import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => boolean;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
  discount: number;
  applyCoupon: () => boolean;
}

const CART_STORAGE_KEY = "inkwave-cart";

const loadStoredCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

const compactCartForStorage = (items: CartItem[]): CartItem[] => {
  return items.map((item) => {
    const isLargeDataUrl = item.image.startsWith("data:") && item.image.length > 300_000;
    if (!isLargeDataUrl) return item;

    return { ...item, image: "/placeholder.svg" };
  });
};

const persistCart = (items: CartItem[]): boolean => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.warn("Cart save failed, trying compact fallback:", error);

    try {
      const compactItems = compactCartForStorage(items);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(compactItems));
      return true;
    } catch (compactError) {
      console.error("Failed to save cart to storage:", compactError);
      return false;
    }
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadStoredCart);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const addItem = (item: Omit<CartItem, "quantity">): boolean => {
    let saved = false;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const nextItems = existing
        ? prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];

      saved = persistCart(nextItems);
      if (!saved) return prev;

      return nextItems;
    });

    if (!saved) {
      toast.error("Could not save cart. Browser storage is full.");
    }

    return saved;
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const nextItems = prev.filter((i) => i.id !== id);

      if (!persistCart(nextItems)) {
        toast.error("Could not update cart right now. Please try again.");
        return prev;
      }

      return nextItems;
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeItem(id);

    setItems((prev) => {
      const nextItems = prev.map((i) => i.id === id ? { ...i, quantity: qty } : i);

      if (!persistCart(nextItems)) {
        toast.error("Could not update quantity right now. Please try again.");
        return prev;
      }

      return nextItems;
    });
  };

  const clearCart = () => {
    if (!persistCart([])) {
      toast.error("Could not clear cart right now. Please try again.");
      return;
    }

    setItems([]);
    setDiscount(0);
    setCouponCode("");
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - discount);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const applyCoupon = (): boolean => {
    try {
      const couponsRaw = localStorage.getItem("inkwave-coupons") || "[]";
      const coupons = JSON.parse(couponsRaw);
      const found = Array.isArray(coupons)
        ? coupons.find((c: any) => c.code?.toUpperCase() === couponCode.toUpperCase() && c.active)
        : undefined;

      if (found) {
        if (found.type === "percentage") setDiscount(subtotal * found.value / 100);
        else setDiscount(found.value);
        return true;
      }
    } catch (error) {
      console.error("Failed to apply coupon:", error);
    }

    setDiscount(0);
    return false;
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, couponCode, setCouponCode, discount, applyCoupon }}>
      {children}
    </CartContext.Provider>
  );
};
