import { requireStaff } from "@/lib/auth";
import { loadAdminDatasets } from "@/lib/admin/dashboard-data";
import Dashboard2 from "@/components/admin/Dashboard";

export default async function AdminPaymentsPage() {
  const { profile } = await requireStaff();
  const datasets = await loadAdminDatasets();
  return <Dashboard2 initialActive="Payment" initialDatasets={datasets} profile={profile} />;
}
