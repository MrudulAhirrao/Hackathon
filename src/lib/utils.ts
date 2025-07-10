import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertToMarkdown = (raw: string): string=> {
  return raw.replace(/\n\s+/g, '\n').replace(/^\s+|\s+$/g, '') || '';
}
