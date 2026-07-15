export type PostType = "lost" | "found";
export type PostStatus = "OPEN" | "RESOLVED";
export type NotificationType = "comment" | "status_change" | "report";

export const CATEGORIES = [
  "Elektronik",
  "Dompet",
  "Kunci",
  "Dokumen",
  "Aksesoris",
  "Lainnya",
] as const;

export const LOCATIONS = [
  "Lantai 5",
  "Lantai 6",
  "Lantai 7",
  "Lantai 8",
  "Parkiran Gerbang Utara",
  "Parkiran Gerbang Selatan",
  "Perpustakaan",
  "Kantin",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Location = (typeof LOCATIONS)[number];

export interface User {
  uid: string;
  email: string;
  anonymous_id: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  type: PostType;
  title: string;
  description: string;
  category: Category;
  location: Location;
  images: string[];
  status: PostStatus;
  report_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  message: string;
  images: string[];
  report_count: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  post_id: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}
