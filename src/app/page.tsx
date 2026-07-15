"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { getPosts } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import Select from "@/components/ui/Select";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { CATEGORIES, LOCATIONS, type Post, type PostStatus, type PostType, type Category, type Location } from "@/types";

const FEED_TABS = [
  { label: "Mading", value: "all" },
  { label: "Lost", value: "lost" },
  { label: "Found", value: "found" },
];

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
    if (!user) {
      // Redirect ke login atau trigger login
      return;
    }
    setShowCreateModal(true);
  }

  return (
    <div className="min-h-screen bg-neutral-gray">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary border-b-[var(--border-brutal)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 text-center">
          <h2 className="text-h1 font-bold mb-2">Kehilangan sesuatu?</h2>
          <p className="text-body mb-4">Cari-in ajaa. Laporkan atau temukan barang hilang di kampus.</p>
          <Button variant="secondary" onClick={handleCreateClick}>
            <Plus size={20} strokeWidth={2.5} className="mr-1" />
            Buat Posting
          </Button>
        </div>
      </section>

      {/* Search & Filter */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-4">
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={20} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-black/40" />
            <input
              type="text"
              placeholder="Cari postingan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-[var(--radius-brutal)] border-[var(--border-brutal)] bg-neutral-white text-base outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button
            variant={showFilters ? "primary" : "secondary"}
            className="!px-4"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <Select
              options={CATEGORIES}
              placeholder="Semua Kategori"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            />
            <Select
              options={LOCATIONS}
              placeholder="Semua Lokasi"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
            <Select
              options={["OPEN", "RESOLVED"]}
              placeholder="Semua Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Tabs + Feed */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <Tabs tabs={FEED_TABS} active={activeTab} onChange={setActiveTab} />

        <div className="py-4 space-y-4">
          {isLoading ? (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          ) : posts.length === 0 ? (
            <EmptyState
              title="Tidak ada postingan ditemukan"
              description="Coba ubah filter atau kata kunci pencarian."
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

      {/* FAB - Mobile */}
      <button
        onClick={handleCreateClick}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full border-[var(--border-brutal)] shadow-[var(--shadow-brutal)] flex items-center justify-center cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform duration-200 sm:hidden"
        aria-label="Buat Posting"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

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
