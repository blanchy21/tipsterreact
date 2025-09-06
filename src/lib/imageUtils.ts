/**
 * Utility functions for handling images in the application
 */

/**
 * Normalizes Unsplash URLs to work better with Next.js Image optimization
 * @param url - The original image URL
 * @returns Normalized URL
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) return '/default-avatar.png';
  
  // If it's an Unsplash URL, normalize it
  if (url.includes('images.unsplash.com')) {
    // Remove existing query parameters and add our own
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=400&h=400&fit=crop&crop=face&auto=format&q=80`;
  }
  
  return url;
};

/**
 * Gets a default avatar URL
 * @returns Default avatar URL
 */
export const getDefaultAvatar = (): string => {
  return 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&h=400&fit=crop&crop=face&auto=format&q=80';
};

/**
 * Gets a default cover photo URL
 * @returns Default cover photo URL
 */
export const getDefaultCoverPhoto = (): string => {
  return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&auto=format&q=80';
};

/**
 * Gets a default gallery photo URL
 * @returns Default gallery photo URL
 */
export const getDefaultGalleryPhoto = (): string => {
  return 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&auto=format&q=80';
};
