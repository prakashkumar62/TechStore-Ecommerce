import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from server (if authenticated) or local storage (if guest)
  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartService.getCart();
        if (res.success && res.data) {
          setCartItems(res.data.items || []);
        }
      } catch (err) {
        console.error('Failed to load cart from server:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const localCart = localStorage.getItem('techstore_guest_cart');
      if (localCart) {
        try {
          setCartItems(JSON.parse(localCart));
        } catch {
          setCartItems([]);
        }
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Persist guest cart to local storage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('techstore_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (product.stock <= 0) {
      toast.error('Sorry, this product is currently out of stock.');
      return false;
    }

    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartService.addToCart(product._id, quantity);
        if (res.success && res.data) {
          setCartItems(res.data.items);
          toast.success(`Added ${product.name} to your cart!`);
          return true;
        }
      } catch (error) {
        const msg = error.response?.data?.message || 'Could not add to cart';
        toast.error(msg);
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      // Guest local cart handling
      setCartItems((prev) => {
        const existingIdx = prev.findIndex(
          (item) => (item.product?._id || item.product) === product._id
        );
        let updated;
        if (existingIdx > -1) {
          const currentQty = prev[existingIdx].quantity;
          const newQty = Math.min(currentQty + quantity, product.stock);
          if (newQty === currentQty && product.stock <= currentQty) {
            toast.error(`Cannot add more. Reached stock limit of ${product.stock}`);
            return prev;
          }
          updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQty,
            priceSnapshot: product.price,
          };
        } else {
          updated = [
            ...prev,
            {
              _id: `guest_${Date.now()}`,
              product: product,
              quantity: Math.min(quantity, product.stock),
              priceSnapshot: product.price,
            },
          ];
        }
        toast.success(`Added ${product.name} to cart!`);
        return updated;
      });
      return true;
    }
  };

  const updateQuantity = async (itemId, newQuantity, product) => {
    if (newQuantity < 1) return;

    if (product && newQuantity > product.stock) {
      toast.error(`Max available stock is ${product.stock}`);
      return;
    }

    if (isAuthenticated) {
      try {
        const res = await cartService.updateCartItem(itemId, newQuantity);
        if (res.success && res.data) {
          setCartItems(res.data.items);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update quantity');
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.removeFromCart(itemId);
        if (res.success && res.data) {
          setCartItems(res.data.items);
          toast.info('Item removed from cart');
        }
      } catch (error) {
        toast.error('Failed to remove item');
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      toast.info('Item removed from cart');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setCartItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('techstore_guest_cart');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.priceSnapshot || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
