import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function trimAddress(walletAddress) {
  if (walletAddress.length <= length) {
    return walletAddress; // No need to trim if it's shorter than the specified length
  }
  const start = walletAddress.slice(0, 6);
  const end = walletAddress.slice(-4);
  const trimmedAddress = `${start}...${end}`;
  return trimmedAddress;
}