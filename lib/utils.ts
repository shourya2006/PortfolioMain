import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Public contact address shown on the site and used as the form fallback. */
export const contactEmail = "bafna.shourya2023@gmail.com";
