// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ← ADD THIS FUNCTION ↓
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")           // Replace spaces and underscores with -
    .replace(/[^\w\-]+/g, "")          // Remove all non-word chars
    .replace(/\-\-+/g, "-")            // Replace multiple - with single -
    .replace(/^-+/, "")                // Trim - from start
    .replace(/-+$/, "");               // Trim - from end
}