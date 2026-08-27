import { createSupabaseAdminClient } from "@/lib/supabase/server";

const rupiah = (n: number) => "Rp" + Number(n || 0).toLocaleString("id-ID");

const STATUS_META: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  success: "Success",
  failed: "Failed",
  refunded: "Refunded",
};

type Dataset = {
  key: string;
  title: string;
  addLabel: string;
  columns: { key: string; label: string; align?: "left" | "right"; numeric?: boolean }[];
  stats: { label: string; value: string; delta: string }[];
  rows: { id: string; status: any; cells: Record<string, string | number>; rating?: number }[];
};

export async function loadAdminDatasets(): Promise<Record<string, Dataset>> {
  const admin = createSupabaseAdminClient();

  const [ordersRes, productsRes, paymentsRes] = await Promise.all([
    admin.from("orders").select("id, order_code, status, total, customer_uid, customer_whatsapp, games(short_name), products(label)").order("created_at", { ascending: false }).limit(50),
    admin.from("products").select("id, label, price, old_price, coins, is_active, sort_order, games(slug, name)").order("game_id").order("sort_order"),
    admin.from("payment_methods").select("id, label, slug, type, fee, is_active").order("sort_order"),
  ]);

  const orders = ordersRes.data || [];
  const products = productsRes.data || [];
  const payments = paymentsRes.data || [];

  const totalRevenue = orders
    .filter((o: any) => o.status === "success" || o.status === "paid")
    .reduce((s: number, o: any) => s + (o.total || 0), 0);
  const pendingCount = orders.filter((o: any) => ["pending", "paid", "processing"].includes(o.status)).length;
  const activeProducts = products.filter((p: any) => p.is_active).length;
  const activePayments = payments.filter((p: any) => p.is_active).length;

  return {
    Dashboard: {
      key: "Dashboard",
      title: "Overview",
      addLabel: "Add Widget",
      columns: [
        { key: "name", label: "Metric" },
        { key: "value", label: "Value" },
        { key: "change", label: "Change" },
        { key: "period", label: "Period" },
      ],
      stats: [
        { label: "Total Revenue", value: rupiah(totalRevenue), delta: "+ live" },
        { label: "Active Products", value: `${activeProducts} / ${products.length}`, delta: "+ live" },
        { label: "Payment Methods", value: `${activePayments} / ${payments.length}`, delta: "+ live" },
        { label: "Pending Orders", value: String(pendingCount), delta: "+ live" },
      ],
      rows: [],
    },
    Product: {
      key: "Product",
      title: "Products",
      addLabel: "Add New Product",
      columns: [
        { key: "name", label: "Label" },
        { key: "game", label: "Game" },
        { key: "price", label: "Price", numeric: true },
        { key: "coins", label: "Coins", numeric: true },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Total Product", value: String(products.length), delta: "+ live" },
        { label: "Active", value: String(activeProducts), delta: "+ live" },
        { label: "Avg. Price", value: products.length ? rupiah(Math.round(products.reduce((s: number, p: any) => s + (p.price || 0), 0) / products.length)) : rupiah(0), delta: "—"},
        { label: "Max. Price", value: products.length ? rupiah(Math.max(...products.map((p: any) => p.price || 0))) : rupiah(0), delta: "—"},
      ],
      rows: products.map((p: any) => ({
        id: `prod-${p.id}`,
        status: p.is_active ? "Active" : "Cancelled",
        cells: {
          name: p.label,
          game: p.games?.name || "—",
          price: rupiah(p.price),
          coins: p.coins,
        },
      })),
    },
    Order: {
      key: "Order",
      title: "Orders",
      addLabel: "Refresh",
      columns: [
        { key: "code", label: "Order" },
        { key: "game", label: "Game" },
        { key: "uid", label: "UID" },
        { key: "total", label: "Total", numeric: true },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Total Orders", value: String(orders.length), delta: "+ live" },
        { label: "Pending", value: String(pendingCount), delta: "+ live" },
        { label: "Revenue", value: rupiah(totalRevenue), delta: "+ live" },
        { label: "Success Rate", value: orders.length ? `${Math.round((orders.filter((o: any) => o.status === "success").length / orders.length) * 100)}%` : "—", delta: "—"},
      ],
      rows: orders.map((o: any) => ({
        id: `order-${o.id}`,
        status: STATUS_META[o.status] || o.status,
        cells: {
          code: o.order_code,
          game: o.games?.short_name || "—",
          uid: o.customer_uid,
          total: rupiah(o.total),
        },
      })),
    },
    Customer: {
      key: "Customer",
      title: "Customers",
      addLabel: "Add Customer",
      columns: [
        { key: "uid", label: "UID" },
        { key: "whatsapp", label: "WhatsApp" },
        { key: "orders", label: "Orders", numeric: true },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Unique UIDs", value: String(new Set(orders.map((o: any) => o.customer_uid).filter(Boolean)).size), delta: "—"},
        { label: "With WhatsApp", value: String(orders.filter((o: any) => o.customer_whatsapp).length), delta: "—"},
        { label: "Total Orders", value: String(orders.length), delta: "—"},
        { label: "Avg. Order", value: orders.length ? rupiah(Math.round(totalRevenue / orders.length)) : rupiah(0), delta: "—"},
      ],
      rows: (() => {
        const map = new Map<string, { uid: string; whatsapp: string; count: number; status: string }>();
        for (const o of orders as any[]) {
          const k = o.customer_uid || "unknown";
          const ex = map.get(k);
          if (ex) ex.count++;
          else map.set(k, { uid: k, whatsapp: o.customer_whatsapp || "—", count: 1, status: o.status === "success" ? "Active" : "Pending" });
        }
        return Array.from(map.values()).slice(0, 20).map((c) => ({
          id: `cust-${c.uid}`,
          status: c.status,
          cells: { uid: c.uid, whatsapp: c.whatsapp, orders: c.count },
        }));
      })(),
    },
    Message: {
      key: "Message",
      title: "Messages",
      addLabel: "New Message",
      columns: [
        { key: "name", label: "From" },
        { key: "preview", label: "Preview" },
        { key: "time", label: "Order" },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Recent Orders", value: String(Math.min(orders.length, 10)), delta: "—"},
        { label: "Total Messages", value: String(orders.length), delta: "—"},
        { label: "With WhatsApp", value: String(orders.filter((o: any) => o.customer_whatsapp).length), delta: "—"},
        { label: "Resolved", value: String(orders.filter((o: any) => o.status === "success").length), delta: "—"},
      ],
      rows: orders.slice(0, 10).map((o: any) => ({
        id: `msg-${o.id}`,
        status: o.status === "success" ? "Read" : "Unread",
        cells: {
          name: o.customer_whatsapp || o.customer_uid || "—",
          preview: `${o.games?.short_name || ""} ${o.products?.label || ""}`.trim(),
          time: o.order_code,
        },
      })),
    },
    Payment: {
      key: "Payment",
      title: "Payment Methods",
      addLabel: "Add Method",
      columns: [
        { key: "name", label: "Method" },
        { key: "type", label: "Type" },
        { key: "slug", label: "Slug" },
        { key: "fee", label: "Fee", numeric: true },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Total Methods", value: String(payments.length), delta: "—"},
        { label: "Active", value: String(activePayments), delta: "—"},
        { label: "Inactive", value: String(payments.length - activePayments), delta: "—"},
        { label: "Types", value: String(new Set(payments.map((p: any) => p.type)).size), delta: "—"},
      ],
      rows: payments.map((p: any) => ({
        id: `pay-${p.id}`,
        status: p.is_active ? "Active" : "Cancelled",
        cells: {
          name: p.label,
          type: p.type,
          slug: p.slug,
          fee: p.fee > 0 ? rupiah(p.fee) : "Gratis",
        },
      })),
    },
    Settings: {
      key: "Settings",
      title: "Settings",
      addLabel: "Add Setting",
      columns: [
        { key: "name", label: "Setting" },
        { key: "value", label: "Value" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Plan", value: "Free Plan", delta: "+ upgrade" },
        { label: "Team Members", value: "1", delta: "+ invite" },
        { label: "Active Sessions", value: "live", delta: "—"},
        { label: "API Calls (mo)", value: String(orders.length), delta: "—"},
      ],
      rows: [
        { id: "s1", status: "Active", cells: { name: "Two-Factor Authentication", value: "Off", category: "Security" } },
        { id: "s2", status: "Pending", cells: { name: "Email Notifications", value: "All", category: "Notifications" } },
        { id: "s3", status: "Active", cells: { name: "Dark Mode", value: "On (this page)", category: "Appearance" } },
        { id: "s4", status: "Cancelled", cells: { name: "SSO (SAML)", value: "Off", category: "Security" } },
      ],
    },
  };
}

export const DASHBOARD_NAV = {
  MAIN: ["Dashboard", "Product", "Order", "Customer", "Message", "Payment"] as const,
  TOOLS: ["Email", "Automation", "Analytics", "Integration"] as const,
  BOTTOM: ["Help center", "Feedback", "Settings"] as const,
};
