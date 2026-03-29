import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { orderFormSchema, type OrderFormValues } from "@/lib/orderFormSchema";

export function useOrderForm() {
  return useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      contact: "",
      idea: "",
      style: "",
    },
    mode: "onChange",
  });
}
