import { useCallback, useEffect, useState } from "react";
import {
  fetchOrdersForAdmin,
  updateOrderStatus,
} from "@/services/orderService";
import type { OrderRow, OrderStatus } from "@/types/order";

export type AdminOrdersState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; rows: OrderRow[] };

export function useAdminOrders() {
  const [state, setState] = useState<AdminOrdersState>({ status: "loading" });
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setMutationError(null);
    const { data, error: err } = await fetchOrdersForAdmin();
    if (err) {
      setState({ status: "error", message: err.message });
      return;
    }
    setState({ status: "ready", rows: data });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data, error: err } = await fetchOrdersForAdmin();
      if (cancelled) return;
      if (err) {
        setState({ status: "error", message: err.message });
        return;
      }
      setState({ status: "ready", rows: data });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setOrderStatus = useCallback(
    async (id: number, status: OrderStatus) => {
      setMutationError(null);
      setUpdatingId(id);
      const { data, error } = await updateOrderStatus(id, status);
      setUpdatingId(null);
      if (error) {
        setMutationError(error.message);
        return;
      }
      if (data) {
        setState((s) => {
          if (s.status !== "ready") return s;
          return {
            ...s,
            rows: s.rows.map((r) => (r.id === id ? data : r)),
          };
        });
      }
    },
    [],
  );

  return {
    state,
    updatingId,
    mutationError,
    refetch,
    setOrderStatus,
  };
}
