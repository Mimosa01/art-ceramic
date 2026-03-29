import {
  ORDER_STATUS_OPTIONS,
  type OrderStatus,
} from "@/types/order";

type OrderStatusSelectProps = {
  value: string;
  disabled?: boolean;
  onChange: (next: OrderStatus) => void;
};

export default function OrderStatusSelect({
  value,
  disabled,
  onChange,
}: OrderStatusSelectProps) {
  const known = ORDER_STATUS_OPTIONS.some((o) => o.value === value);

  return (
    <select
      className="max-w-44 rounded-md border border-red-deep/20 bg-white px-2 py-1.5 text-[0.8rem] text-red-deep shadow-sm focus:border-red-mid focus:outline-none focus:ring-1 focus:ring-red-mid/40 disabled:opacity-50"
      value={value}
      disabled={disabled}
      aria-label="Статус заявки"
      onChange={(e) => onChange(e.target.value as OrderStatus)}
    >
      {!known ? (
        <option value={value}>{value}</option>
      ) : null}
      {ORDER_STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
