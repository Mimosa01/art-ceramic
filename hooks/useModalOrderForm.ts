"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  modalOrderFormSchema,
  type ModalOrderFormValues,
} from "@/lib/orderFormSchema";

export function useModalOrderForm(styleFieldPrefill: string) {
  return useForm<ModalOrderFormValues>({
    resolver: zodResolver(modalOrderFormSchema),
    defaultValues: {
      name: "",
      contact: "",
      style: styleFieldPrefill,
      comment: "",
    },
    mode: "onChange",
  });
}
