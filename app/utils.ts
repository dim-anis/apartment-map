import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export const url = new URL(
  "https://www.nhatot.com/thue-can-ho-chung-cu-quan-son-tra-da-nang"
);

export function createLink(ad_id: number) {
  return `${url}/${ad_id}.htm`;
}
