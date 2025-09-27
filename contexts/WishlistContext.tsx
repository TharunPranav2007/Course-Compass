
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Course } from '../types';

interface WishlistContextType {
  wishlist: string[]; // array of course IDs
  addToWishlist: (courseId: string) => void;
  removeFromWishlist: (courseId: string) => void;
  isInWishlist: (courseId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToWishlist = (courseId: string) => {
    setWishlist((prev) => [...new Set([...prev, courseId])]);
  };

  const removeFromWishlist = (courseId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== courseId));
  };
  
  const isInWishlist = (courseId: string) => {
    return wishlist.includes(courseId);
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
