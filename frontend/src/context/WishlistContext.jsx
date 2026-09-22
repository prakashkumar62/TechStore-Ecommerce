import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const toast = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('techstore_wishlist');
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch {
      setWishlist([]);
    }
  }, []);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      let updated;
      if (exists) {
        updated = prev.filter((item) => item._id !== product._id);
        toast.info(`Removed ${product.name} from wishlist`);
      } else {
        updated = [...prev, product];
        toast.success(`Saved ${product.name} to wishlist!`);
      }
      localStorage.setItem('techstore_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
