/** Keep in sync with backend cloudinary_service limits. */
export const MAX_RESUME_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function assertPdfResume(file: File): void {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) throw new Error("Resume must be a PDF file");
  if (file.size > MAX_RESUME_BYTES) {
    throw new Error("Resume must be 10 MB or smaller");
  }
}

export function assertImageFile(file: File): void {
  const ok = /^image\/(jpeg|png|webp|gif)$/i.test(file.type);
  if (!ok) throw new Error("Use a JPEG, PNG, WebP, or GIF image");
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5 MB or smaller");
  }
}
