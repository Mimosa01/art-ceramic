import { useCallback, useEffect, useState } from "react";
import {
  createGalleryItem,
  deleteGalleryItem,
  fetchAllGalleryItems,
  updateGalleryItem,
} from "@/services/galleryService";
import type {
  GalleryItemInsert,
  GalleryItemRow,
  GalleryItemUpdate,
} from "@/types/gallery";

export type AdminGalleryState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: GalleryItemRow[] };

export function useAdminGallery() {
  const [state, setState] = useState<AdminGalleryState>({ status: "loading" });
  const [saving, setSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setMutationError(null);
    const { data, error: err } = await fetchAllGalleryItems();
    if (err) {
      setMutationError(err.message);
      return;
    }
    setState({ status: "ready", items: data });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data, error: err } = await fetchAllGalleryItems();
      if (cancelled) return;
      if (err) {
        setState({ status: "error", message: err.message });
        return;
      }
      setState({ status: "ready", items: data });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const createItem = useCallback(async (payload: GalleryItemInsert) => {
    setMutationError(null);
    setSaving(true);
    const { data, error } = await createGalleryItem(payload);
    setSaving(false);
    if (error) {
      setMutationError(error.message);
      return false;
    }
    if (data) {
      setState((s) => {
        if (s.status !== "ready") return s;
        return { status: "ready", items: [...s.items, data] };
      });
    }
    return true;
  }, []);

  const updateItem = useCallback(
    async (id: number, payload: GalleryItemUpdate) => {
      setMutationError(null);
      setSaving(true);
      const { data, error } = await updateGalleryItem(id, payload);
      setSaving(false);
      if (error) {
        setMutationError(error.message);
        return false;
      }
      if (data) {
        setState((s) => {
          if (s.status !== "ready") return s;
          return {
            status: "ready",
            items: s.items.map((it) => (it.id === id ? data : it)),
          };
        });
      }
      return true;
    },
    [],
  );

  const removeItem = useCallback(async (id: number) => {
    setMutationError(null);
    setSaving(true);
    const { error } = await deleteGalleryItem(id);
    setSaving(false);
    if (error) {
      setMutationError(error.message);
      return false;
    }
    setState((s) => {
      if (s.status !== "ready") return s;
      return {
        status: "ready",
        items: s.items.filter((it) => it.id !== id),
      };
    });
    return true;
  }, []);

  return {
    state,
    saving,
    mutationError,
    refetch,
    createItem,
    updateItem,
    removeItem,
  };
}
