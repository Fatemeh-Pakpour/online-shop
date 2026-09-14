import { create } from 'zustand';

type WishlistItem = {
  productId: string;
  name: string;
  price: number;
  categoryName: string;
};

type WishlistStore = {
  items: WishlistItem[];
  hasItem: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  items: [],

  hasItem: (productId) =>
    get().items.some((item) => item.productId === productId),

  toggleItem: (item) =>
    set((state) => {
      const isWishlisted = state.items.some(
        (wishlistItem) => wishlistItem.productId === item.productId,
      );

      if (isWishlisted) {
        return {
          items: state.items.filter(
            (wishlistItem) => wishlistItem.productId !== item.productId,
          ),
        };
      }

      return {
        items: [...state.items, item],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  clearWishlist: () => set({ items: [] }),
}));
