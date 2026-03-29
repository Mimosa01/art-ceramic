import { supabase } from "@/lib/supabase";

const BUCKET =
  process.env.NEXT_PUBLIC_GALLERY_STORAGE_BUCKET?.trim() || "gallery";

const MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export function getGalleryStorageBucket(): string {
  return BUCKET;
}

export async function uploadGalleryImage(
  file: File,
): Promise<{ publicUrl: string } | { error: string }> {
  if (file.size > MAX_BYTES) {
    return { error: "Файл больше 8 МБ." };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { error: "Допустимы JPEG, PNG, WebP или GIF." };
  }
  const ext = MIME_TO_EXT[file.type];
  if (!ext) {
    return { error: "Не удалось определить расширение файла." };
  }
  const path = `${crypto.randomUUID()}${ext}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) {
    return { error: error.message };
  }
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);
  return { publicUrl: urlData.publicUrl };
}
