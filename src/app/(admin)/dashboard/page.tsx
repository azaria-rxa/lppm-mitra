import { hitungDataDashboard } from "@/lib/laporan";
import { DashboardView } from "./dashboard-view";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await hitungDataDashboard();
  return <DashboardView initialData={data} />;
}
