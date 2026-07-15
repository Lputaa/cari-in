import { supabase } from "./supabase";

const BUCKET = "post-images";

export async function uploadImage(file: File, path: string): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadMultipleImages(
  files: File[],
  userId: string
): Promise<string[]> {
  const uploads = files.map((file, i) => {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}_${i}.${ext}`;
    return uploadImage(file, path);
  });
  return Promise.all(uploads);
}

export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
