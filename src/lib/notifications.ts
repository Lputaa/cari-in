import { supabase } from "./supabase";

export async function createNotification(
  userId: string,
  postId: string,
  type: "comment" | "status_change"
) {
  // Jangan kirim notifikasi ke diri sendiri
  const { data: post } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .maybeSingle();

  if (!post || post.user_id === userId) return;

  // Hanya kirim ke pemilik post
  const { error } = await supabase.from("notifications").insert({
    user_id: post.user_id,
    post_id: postId,
    type,
  });

  if (error) console.error("Failed to create notification:", error);
}

export async function createNotificationForPostOwner(
  postId: string,
  fromUserId: string,
  type: "comment" | "status_change"
) {
  const { data: post } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .maybeSingle();

  if (!post || post.user_id === fromUserId) return;

  await supabase.from("notifications").insert({
    user_id: post.user_id,
    post_id: postId,
    type,
  });
}
