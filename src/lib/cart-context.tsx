"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  price: number;
  priceType: "person" | "pcs" | "hour";
  category: string;
  description?: string;
  features: string[];
  images: string[];
  minPeople?: number;
  maxPeople?: number;
}

export interface CartItem {
  product: Product;
  guests: number;
}

export interface GuestError {
  productId: string;
  type: "min" | "max";
  limit: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateGuests: (productId: string, guests: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  isInCart: (productId: string) => boolean;
  getGuestErrors: () => GuestError[];
  itemCount: number;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "hen-experience-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or unavailable
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  // Persist whenever items change (after hydration)
  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((i) => i.product.id === product.id)) return prev;
      return [...prev, { product, guests: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateGuests = useCallback((productId: string, guests: number) => {
    const clamped = Math.max(1, Math.min(99, guests));
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, guests: clamped } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((productId: string) => {
    return items.some((i) => i.product.id === productId);
  }, [items]);

  const getTotal = useCallback(() => {
    return items.reduce((sum, i) => {
      return (
        sum +
        (i.product.priceType === "person"
          ? i.product.price * i.guests
          : i.product.price)
      );
    }, 0);
  }, [items]);

  const getGuestErrors = useCallback((): GuestError[] => {
    const errors: GuestError[] = [];
    for (const item of items) {
      if (item.product.priceType !== "person") continue;
      if (item.product.minPeople && item.guests < item.product.minPeople) {
        errors.push({ productId: item.product.id, type: "min", limit: item.product.minPeople });
      }
      if (item.product.maxPeople && item.guests > item.product.maxPeople) {
        errors.push({ productId: item.product.id, type: "max", limit: item.product.maxPeople });
      }
    }
    return errors;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateGuests,
        clearCart,
        getTotal,
        isInCart,
        getGuestErrors,
        itemCount: items.length,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
