"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { getPosts } from "@/lib/db";
import Navbar from "@/components/Navbar";
import ComposeBox from "@/components/ComposeBox";
import FeedTabs from "@/components/FeedTabs";
import Select from "@/components/ui/Select";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { CATEGORIES, LOCATIONS, type Post, type PostStatus, type PostType, type Category, type Location } from "@/types";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPosts({
        type: activeTab !== "all" ? (activeTab as PostType) : undefined,
        category: filterCategory ? (filterCategory as Category) : undefined,
        location: filterLocation ? (filterLocation as Location) : undefined,
        status: filterStatus ? (filterStatus as PostStatus) : undefined,
        search: searchQuery || undefined,
      });
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filterCategory, filterLocation, filterStatus, searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function handleCreateClick() {
    if (!user) return;
    setShowCreateModal(true);
  }

  return (
    <div className="min-h-screen bg-neutral-gray">
      <Navbar />

      <div className="max-w-[680px] mx-auto px-4 sm:px-0 py-4 space-y-4">
        {/* Compose Box — langsung di feed */}
        <ComposeBox onClick={handleCreateClick} />

        {/* Search + Filter — compact */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-black/40" />
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-brutal)] border-2 border-neutral-black bg-neutral-white text-body outline-none focus:ring-2 focus:ring-primary shadow-[var(--shadow-brutal-sm)]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-4 py-2.5 rounded-[var(--radius-brutal)] border-2 border-neutral-black font-bold text-sm cursor-pointer transition-all duration-150 shadow-[var(--shadow-brutal-sm)] hover:shadow-[var(--shadow-brutal)] hover:-translate-y-0.5 ${
              showFilters ? "bg-primary text-neutral-black" : "bg-neutral-white"
            }`}
          >
            <SlidersHorizontal size={16} strokeWidth={2.5} />
            Filter
          </button>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-[var(--radius-brutal)] border-2 border-neutral-black bg-neutral-white text-caption font-bold cursor-pointer"
            >
              <option value="">Semua Kategori</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-3 py-2 rounded-[var(--radius-brutal)] border-2 border-neutral-black bg-neutral-white text-caption font-bold cursor-pointer"
            >
              <option value="">Semua Lokasi</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-[var(--radius-brutal)] border-2 border-neutral-black bg-neutral-white text-caption font-bold cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="OPEN">OPEN</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
            {(filterCategory || filterLocation || filterStatus) && (
              <button
                onClick={() => { setFilterCategory(""); setFilterLocation(""); setFilterStatus(""); }}
                className="px-3 py-2 rounded-full bg-danger text-neutral-white text-sm font-bold cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        <FeedTabs active={activeTab} onChange={setActiveTab} />

        {/* Feed — scrolling list */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          ) : posts.length === 0 ? (
            <EmptyState
              title="Belum ada postingan"
              description="Jadi yang pertama membantu!"
              actionLabel="Reset Filter"
              onAction={() => {
                setSearchQuery("");
                setFilterCategory("");
                setFilterLocation("");
                setFilterStatus("");
                setActiveTab("all");
              }}
            />
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onClick={() => router.push(`/post/${post.id}`)} />
            ))
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchPosts();
          }}
        />
      )}
    </div>
  );
}
