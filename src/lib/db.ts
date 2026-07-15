import { supabase } from "./supabase";
import type { Post, Comment, Notification, PostType, PostStatus, Category, Location } from "@/types";

// ============================================
// USERS
// ============================================

export async function ensureUserExists(uid: string, email: string) {
  // Cek apakah user sudah ada
  const { data: existing } = await supabase
    .from("users")
    .select("uid, anonymous_id")
    .eq("uid", uid)
    .maybeSingle();

  if (existing) return existing;

  // Generate anonymous_id unik
  let anonymousId: string;
  let isUnique = false;
  while (!isUnique) {
    anonymousId = String(Math.floor(100 + Math.random() * 900));
    const { data } = await supabase
      .from("users")
      .select("uid")
      .eq("anonymous_id", anonymousId)
      .maybeSingle();
    if (!data) isUnique = true;
  }

  const { data, error } = await supabase
    .from("users")
    .insert({ uid, email, anonymous_id: anonymousId! })
    .select("uid, anonymous_id")
    .single();

  if (error) throw error;
  return data;
}

export async function getUserById(uid: string) {
  const { data, error } = await supabase
    .from("users")
    .select("uid, anonymous_id")
    .eq("uid", uid)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ============================================
// POSTS
// ============================================

interface CreatePostInput {
  userId: string;
  type: PostType;
  title: string;
  description: string;
  category: Category;
  location: Location;
  images?: string[];
}

export async function createPost(input: CreatePostInput) {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      description: input.description,
      category: input.category,
      location: input.location,
      images: input.images ?? [],
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getPosts(filters?: {
  type?: PostType;
  category?: Category;
  location?: Location;
  status?: PostStatus;
  search?: string;
}) {
  let query = supabase
    .from("posts")
    .select("*, users!inner(anonymous_id)")
    .order("created_at", { ascending: false });

  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.location) query = query.eq("location", filters.location);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.search) query = query.ilike("title", `%${filters.search}%`);
  // Hide posts with 3+ reports
  query = query.lt("report_count", 3);

  const { data, error } = await query;
  if (error) throw error;
  return data as Post[];
}

export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Post;
}

export async function updatePost(id: string, updates: { type?: PostType; title?: string; description?: string; category?: Category; location?: Location; images?: string[]; status?: PostStatus }) {
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// COMMENTS
// ============================================

export async function getCommentsByPostId(postId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .lt("report_count", 3)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Comment[];
}

export async function createComment(postId: string, userId: string, message: string, images?: string[]) {
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: userId, message, images: images ?? [] })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(id: string) {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Notification[];
}

export async function getUnreadCount(userId: string) {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  if (error) throw error;
  return count ?? 0;
}

export async function markNotificationAsRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);
  if (error) throw error;
}

export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  if (error) throw error;
}

// ============================================
// REPORTING
// ============================================

export async function reportPost(postId: string) {
  const { data, error } = await supabase.rpc("increment_report_count", {
    table_name: "posts",
    row_id: postId,
  });
  // Fallback: manual increment jika RPC belum dibuat
  if (error) {
    const { data: post } = await supabase
      .from("posts")
      .select("report_count")
      .eq("id", postId)
      .maybeSingle();
    if (post) {
      await supabase
        .from("posts")
        .update({ report_count: post.report_count + 1 })
        .eq("id", postId);
    }
  }
}

export async function reportComment(commentId: string) {
  const { data: comment } = await supabase
    .from("comments")
    .select("report_count")
    .eq("id", commentId)
    .maybeSingle();
  if (comment) {
    await supabase
      .from("comments")
      .update({ report_count: comment.report_count + 1 })
      .eq("id", commentId);
  }
}
