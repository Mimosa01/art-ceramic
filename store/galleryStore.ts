import { fetchActiveGalleryItems } from "@/services/galleryService";
import { GalleryItemRow } from "@/types/gallery";
import { create } from "zustand";

/** Состояние загрузки списка галереи — выставляется внутри экшенов */
export type GalleryListStatus = "idle" | "loading" | "success" | "error";

export type GalleryStoreState = {
  items: GalleryItemRow[];
  listStatus: GalleryListStatus;
  listError: string | null;
};

export type GalleryStoreActions = {

  loadGallery: () => Promise<void>;

  refetchGallery: () => Promise<void>;

  invalidateListCache: () => void;
  /** Полный сброс стора */
  reset: () => void;
};

export type GalleryStore = GalleryStoreState & GalleryStoreActions;

const initialState: GalleryStoreState = {
  items: [],
  listStatus: "idle",
  listError: null,
};

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  ...initialState,

  loadGallery: async () => {
    const { listStatus, items } = get();
    if (listStatus === "loading") return;
    if (listStatus === "success" && items.length > 0) return;

    set({ listStatus: "loading", listError: null });

    const { data, error } = await fetchActiveGalleryItems();

    if (error) {
      set({
        listStatus: "error",
        listError: error.message,
        items: [],
      });
      return;
    }

    set({
      listStatus: "success",
      listError: null,
      items: data,
    });
  },

  refetchGallery: async () => {
    const { listStatus } = get();
    if (listStatus === "loading") return;

    set({ listStatus: "loading", listError: null });

    const { data, error } = await fetchActiveGalleryItems();

    if (error) {
      set({
        listStatus: "error",
        listError: error.message,
      });
      return;
    }

    set({
      listStatus: "success",
      listError: null,
      items: data,
    });
  },

  invalidateListCache: () => {
    set((s) => {
      if (s.listStatus !== "success") return {};
      return { listStatus: "idle" as const };
    });
  },

  reset: () => set(initialState),
}));

/** Вызовы вне React (по аналогии с modalActions) */
export const galleryActions = {
  loadGallery: () => useGalleryStore.getState().loadGallery(),
  refetchGallery: () => useGalleryStore.getState().refetchGallery(),
  invalidateListCache: () => useGalleryStore.getState().invalidateListCache(),
  reset: () => useGalleryStore.getState().reset(),
};
