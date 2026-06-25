"use client";

import { useRef, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  Plus, Upload, Download, Search, MoreHorizontal,
  Eye, Pencil, Trash2, AlertTriangle, FileSpreadsheet,
  CheckCircle2, XCircle, Loader2,
} from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogTrigger, DialogDescription,
} from "../components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useTravel } from "../hooks/useTravel";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type Customer = ReturnType<typeof useTravel>["customers"][number];

function parsePelangganId(id: string): number {
  return parseInt(id.replace("CST-", ""), 10);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, loading } = useTravel();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState("all");

  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const cities = useMemo(
    () => ["all", ...Array.from(new Set(customers.map((c) => c.city)))],
    [customers],
  );

  // ── Export Excel ──────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = customers.map((c) => ({
      ID: c.id,
      "Nama Lengkap": c.name,
      Email: c.email,
      "No. HP": c.phone,
      Kota: c.city,
      "Total Booking": c.bookings,
      "Last Booking": c.lastBooking,
      Status: c.status,
      "Member Sejak": c.joined,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    // Lebar kolom otomatis
    ws["!cols"] = [
      { wch: 12 }, { wch: 28 }, { wch: 30 }, { wch: 18 },
      { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 14 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, `customers_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("File Excel berhasil diunduh");
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase();
    return (
      (c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)) &&
      (city === "all" || c.city === city) &&
      (status === "all" || c.status === status)
    );
  });

  return (
    <>
      <PageHeader
        title="Customer Management"
        description="Manage all registered travelers and their booking history."
        actions={
          <>
            {/* Import */}
            <Dialog open={importOpen} onOpenChange={setImportOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition hover:bg-muted">
                  <Upload className="size-4" /> Import
                </button>
              </DialogTrigger>
              <ImportCustomerModal
                onImport={addCustomer}
                onClose={() => setImportOpen(false)}
              />
            </Dialog>

            {/* Export */}
            <button
              onClick={handleExport}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <Download className="size-4" /> Export Excel
            </button>

            {/* Add Customer */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
                  <Plus className="size-4" /> Add Customer
                </button>
              </DialogTrigger>
              <AddCustomerModal
                onSave={addCustomer}
                onSuccess={() => setAddOpen(false)}
                onClose={() => setAddOpen(false)}
              />
            </Dialog>
          </>
        }
      />

      {/* Filters */}
      <Panel bodyClassName="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email or ID"
              className="h-10 w-full rounded-lg border border-border bg-muted/40 pl-10 pr-3 text-sm outline-none focus:border-primary focus:bg-card"
            />
          </div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c === "all" ? "All Cities" : c}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
          >
            {["all", "Active", "VIP", "Inactive"].map((s) => (
              <option key={s} value={s}>{s === "all" ? "All Status" : s}</option>
            ))}
          </select>
          <input
            type="date"
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground outline-none focus:border-primary"
          />
        </div>
      </Panel>

      {/* Table */}
      <Panel bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium">Bookings</th>
                <th className="px-5 py-3 font-medium">Last Booking</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt={c.name} className="size-9 rounded-full bg-muted" />
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-foreground">{c.email}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{c.city}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{c.bookings}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(c.lastBooking).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-lg p-1.5 text-muted-foreground outline-none hover:bg-muted">
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewCustomer(c)}>
                          <Eye className="size-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditCustomer(c)}>
                          <Pencil className="size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setDeleteTarget(c)}
                        >
                          <Trash2 className="size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 text-sm text-muted-foreground">
          <span>Showing {filtered.length} of {customers.length} customers</span>
        </div>
      </Panel>

      {/* View Details Modal */}
      <Dialog open={!!viewCustomer} onOpenChange={(o) => { if (!o) setViewCustomer(null); }}>
        {viewCustomer && <ViewCustomerModal customer={viewCustomer} onClose={() => setViewCustomer(null)} />}
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editCustomer} onOpenChange={(o) => { if (!o) setEditCustomer(null); }}>
        {editCustomer && (
          <EditCustomerModal
            customer={editCustomer}
            onSave={async (data) => updateCustomer(parsePelangganId(editCustomer.id), data)}
            onSuccess={() => setEditCustomer(null)}
            onClose={() => setEditCustomer(null)}
          />
        )}
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        {deleteTarget && (
          <DeleteCustomerModal
            customer={deleteTarget}
            onConfirm={async () => {
              const { error } = await deleteCustomer(parsePelangganId(deleteTarget.id));
              if (error) {
                const msg: string = error?.message || "";
                toast.error(
                  msg.includes("foreign key") || msg.includes("violates")
                    ? "Tidak bisa dihapus karena masih memiliki data booking"
                    : "Gagal menghapus pelanggan",
                );
              } else {
                toast.success(`Pelanggan ${deleteTarget.name} berhasil dihapus`);
                setDeleteTarget(null);
              }
            }}
            onClose={() => setDeleteTarget(null)}
          />
        )}
      </Dialog>
    </>
  );
}

// ─── Shared Field ─────────────────────────────────────────────────────────────

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input
        {...props}
        className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted/50 disabled:text-muted-foreground"
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

// ─── View Details Modal ───────────────────────────────────────────────────────

function ViewCustomerModal({ customer: c, onClose }: { customer: Customer; onClose: () => void }) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Customer Details</DialogTitle>
        <DialogDescription>Informasi lengkap pelanggan.</DialogDescription>
      </DialogHeader>
      <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
        <img src={c.avatar} alt={c.name} className="size-14 rounded-full object-cover ring-2 ring-primary/30" />
        <div>
          <p className="text-base font-semibold text-foreground">{c.name}</p>
          <p className="text-xs text-muted-foreground">{c.id}</p>
          <StatusBadge status={c.status} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-1">
        <InfoRow label="Email" value={c.email} />
        <InfoRow label="Phone" value={c.phone} />
        <InfoRow label="City" value={c.city} />
        <InfoRow label="Total Bookings" value={String(c.bookings)} />
        <InfoRow label="Last Booking" value={new Date(c.lastBooking).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
        <InfoRow label="Member Since" value={new Date(c.joined).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
      </div>
      <DialogFooter>
        <button onClick={onClose} className="h-10 w-full rounded-lg border border-border text-sm font-medium hover:bg-muted">
          Close
        </button>
      </DialogFooter>
    </DialogContent>
  );
}

// ─── Edit Customer Modal ──────────────────────────────────────────────────────

type EditForm = { nama_lengkap: string; email: string; no_hp: string; tanggal_lahir: string };

function EditCustomerModal({
  customer,
  onSave,
  onSuccess,
  onClose,
}: {
  customer: Customer;
  onSave: (data: EditForm) => Promise<{ error: any | null }>;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<EditForm>({
    nama_lengkap: customer.name,
    email: customer.email,
    no_hp: customer.phone === "-" ? "" : customer.phone,
    tanggal_lahir: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.nama_lengkap.trim()) { toast.error("Nama lengkap wajib diisi"); return; }
    if (!form.email.trim() || !form.email.includes("@")) { toast.error("Email tidak valid"); return; }
    setSaving(true);
    const { error } = await onSave(form);
    setSaving(false);
    if (error) {
      const msg: string = error?.message || "Gagal menyimpan";
      toast.error(msg.includes("duplicate") || msg.includes("unique") ? "Email sudah digunakan" : msg);
    } else {
      toast.success("Data pelanggan berhasil diperbarui!");
      onSuccess();
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogDescription>Perbarui informasi pelanggan <strong>{customer.name}</strong>.</DialogDescription>
      </DialogHeader>
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Personal Information</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name *" placeholder="Jane Doe" value={form.nama_lengkap} onChange={set("nama_lengkap")} />
            <Field label="Date of Birth" type="date" value={form.tanggal_lahir} onChange={set("tanggal_lahir")} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact Information</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email *" type="email" placeholder="jane@email.com" value={form.email} onChange={set("email")} />
            <Field label="Phone" placeholder="+62 812 ..." value={form.no_hp} onChange={set("no_hp")} />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          ID: <span className="font-mono font-medium text-foreground">{customer.id}</span>
        </div>
      </div>
      <DialogFooter className="gap-2">
        <button type="button" onClick={onClose} className="h-10 flex-1 rounded-lg border border-border text-sm font-medium hover:bg-muted">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="h-10 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </DialogFooter>
    </DialogContent>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteCustomerModal({
  customer,
  onConfirm,
  onClose,
}: {
  customer: Customer;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="size-6 text-red-600" />
        </div>
        <DialogTitle className="text-center">Hapus Pelanggan?</DialogTitle>
        <DialogDescription className="text-center">
          Tindakan ini akan menghapus <strong>{customer.name}</strong> secara permanen. Data yang sudah dihapus tidak bisa dipulihkan.
        </DialogDescription>
      </DialogHeader>
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm font-medium text-red-700 dark:text-red-400">{customer.name}</p>
        <p className="text-xs text-red-500">{customer.email} · {customer.id}</p>
      </div>
      <DialogFooter className="gap-2">
        <button type="button" onClick={onClose} disabled={deleting} className="h-10 flex-1 rounded-lg border border-border text-sm font-medium hover:bg-muted disabled:opacity-60">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="h-10 flex-1 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Menghapus..." : "Ya, Hapus"}
        </button>
      </DialogFooter>
    </DialogContent>
  );
}

// ─── Add Customer Modal ───────────────────────────────────────────────────────

const EMPTY_FORM = { nama_lengkap: "", email: "", no_hp: "", tanggal_lahir: "", kota: "", kode_pos: "" };

function AddCustomerModal({
  onSave,
  onSuccess,
  onClose,
}: {
  onSave: (data: typeof EMPTY_FORM) => Promise<{ error: any | null }>;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.nama_lengkap.trim()) { toast.error("Nama lengkap wajib diisi"); return; }
    if (!form.email.trim() || !form.email.includes("@")) { toast.error("Email tidak valid"); return; }
    setSaving(true);
    const { error } = await onSave(form);
    setSaving(false);
    if (error) {
      const msg: string = error?.message || "Gagal menyimpan pelanggan";
      toast.error(msg.includes("duplicate") || msg.includes("unique") ? "Email sudah terdaftar" : msg);
    } else {
      toast.success("Pelanggan berhasil ditambahkan!");
      setForm({ ...EMPTY_FORM });
      onSuccess();
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogDescription>Fill in the details to register a new traveler.</DialogDescription>
      </DialogHeader>
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Personal Information</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name *" placeholder="Jane Doe" value={form.nama_lengkap} onChange={set("nama_lengkap")} />
            <Field label="Date of Birth" type="date" value={form.tanggal_lahir} onChange={set("tanggal_lahir")} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact Information</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email *" type="email" placeholder="jane@email.com" value={form.email} onChange={set("email")} />
            <Field label="Phone" placeholder="+62 812 ..." value={form.no_hp} onChange={set("no_hp")} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Address</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" placeholder="Jakarta" value={form.kota} onChange={set("kota")} />
            <Field label="Postal Code" placeholder="12345" value={form.kode_pos} onChange={set("kode_pos")} />
          </div>
        </div>
      </div>
      <DialogFooter className="gap-2">
        <button type="button" onClick={onClose} className="h-10 flex-1 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="h-10 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Customer"}
        </button>
      </DialogFooter>
    </DialogContent>
  );
}

// ─── Import Customer Modal ────────────────────────────────────────────────────

type ImportRow = { nama_lengkap: string; email: string; no_hp: string; tanggal_lahir: string; status: "pending" | "success" | "error"; errorMsg?: string };

function ImportCustomerModal({
  onImport,
  onClose,
}: {
  onImport: (data: { nama_lengkap: string; email: string; no_hp: string; tanggal_lahir: string; kota: string; kode_pos: string }) => Promise<{ error: any | null }>;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDone(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = ev.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

        const parsed: ImportRow[] = json.map((r) => {
          // Fleksibel: terima berbagai nama kolom (English / Indonesia)
          const nama = r["Nama Lengkap"] || r["nama_lengkap"] || r["Nama"] || r["name"] || "";
          const email = r["Email"] || r["email"] || "";
          const hp = r["No. HP"] || r["no_hp"] || r["Phone"] || r["Telepon"] || "";
          const tl = r["Tanggal Lahir"] || r["tanggal_lahir"] || r["Date of Birth"] || "";

          return {
            nama_lengkap: String(nama).trim(),
            email: String(email).trim(),
            no_hp: String(hp).trim(),
            tanggal_lahir: String(tl).trim(),
            status: "pending" as const,
          };
        }).filter((r) => r.nama_lengkap || r.email); // abaikan baris kosong

        setRows(parsed);
      } catch {
        toast.error("Gagal membaca file. Pastikan format .xlsx atau .csv");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (rows.length === 0) return;
    setImporting(true);

    const updated = [...rows];
    for (let i = 0; i < updated.length; i++) {
      const r = updated[i];
      if (!r.nama_lengkap || !r.email.includes("@")) {
        updated[i] = { ...r, status: "error", errorMsg: !r.nama_lengkap ? "Nama kosong" : "Email tidak valid" };
        continue;
      }
      const { error } = await onImport({ nama_lengkap: r.nama_lengkap, email: r.email, no_hp: r.no_hp, tanggal_lahir: r.tanggal_lahir, kota: "", kode_pos: "" });
      updated[i] = {
        ...r,
        status: error ? "error" : "success",
        errorMsg: error ? (
          (error?.message || "").includes("duplicate") || (error?.message || "").includes("unique")
            ? "Email sudah terdaftar"
            : "Gagal insert"
        ) : undefined,
      };
      setRows([...updated]);
    }

    setImporting(false);
    setDone(true);
    const successCount = updated.filter((r) => r.status === "success").length;
    const failCount = updated.filter((r) => r.status === "error").length;
    if (successCount > 0) toast.success(`${successCount} pelanggan berhasil diimport`);
    if (failCount > 0) toast.error(`${failCount} baris gagal diimport`);
  };

  const successCount = rows.filter((r) => r.status === "success").length;
  const errorCount = rows.filter((r) => r.status === "error").length;

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Import Customers</DialogTitle>
        <DialogDescription>
          Upload file <strong>.xlsx</strong> atau <strong>.csv</strong>. Kolom yang dibutuhkan:{" "}
          <code className="rounded bg-muted px-1 text-xs">Nama Lengkap</code>,{" "}
          <code className="rounded bg-muted px-1 text-xs">Email</code>,{" "}
          <code className="rounded bg-muted px-1 text-xs">No. HP</code> (opsional),{" "}
          <code className="rounded bg-muted px-1 text-xs">Tanggal Lahir</code> (opsional).
        </DialogDescription>
      </DialogHeader>

      {/* File picker */}
      <div
        className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center transition hover:border-primary hover:bg-primary/5"
        onClick={() => fileRef.current?.click()}
      >
        <FileSpreadsheet className="size-10 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">Klik untuk pilih file</p>
          <p className="text-xs text-muted-foreground">Format: .xlsx, .xls, .csv</p>
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
      </div>

      {/* Preview table */}
      {rows.length > 0 && (
        <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted">
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Nama</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">No. HP</th>
                <th className="px-3 py-2 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2 font-medium text-foreground">{r.nama_lengkap || <span className="text-red-500">—</span>}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.email}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.no_hp || "—"}</td>
                  <td className="px-3 py-2 text-center">
                    {r.status === "pending" && <span className="text-muted-foreground">·</span>}
                    {r.status === "success" && <CheckCircle2 className="mx-auto size-4 text-green-500" />}
                    {r.status === "error" && (
                      <span className="inline-flex items-center gap-1 text-red-500">
                        <XCircle className="size-4" />
                        <span>{r.errorMsg}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {done && (
        <div className="flex gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
          <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="size-4" />{successCount} berhasil</span>
          <span className="flex items-center gap-1 text-red-500"><XCircle className="size-4" />{errorCount} gagal</span>
        </div>
      )}

      <DialogFooter className="gap-2">
        <button type="button" onClick={onClose} className="h-10 flex-1 rounded-lg border border-border text-sm font-medium hover:bg-muted">
          {done ? "Close" : "Cancel"}
        </button>
        {rows.length > 0 && !done && (
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {importing ? <><Loader2 className="size-4 animate-spin" /> Importing...</> : `Import ${rows.length} Data`}
          </button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}
