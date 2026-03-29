import AdminOrdersPage from "@/components/admin/AdminOrderPage";

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold text-(--red-deep)">Заявки</h1>
      <div className="mt-6">
        <AdminOrdersPage />
      </div>
    </main>
  );
}
