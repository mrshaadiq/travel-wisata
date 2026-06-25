import { useMemo, useState } from "react";
import { Plus, Upload, Download, Search, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription,
} from "../components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useTravel } from "../hooks/useTravel";
import { toast } from "sonner";

export function Customers() {
  const { customers, loading } = useTravel();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);

  const cities = useMemo(() => ["all", ...Array.from(new Set(customers.map((c) => c.city)))], [customers]);

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
      (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) &&
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
            <button onClick={() => toast.success("Customer data imported")} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition hover:bg-muted">
              <Upload className="size-4" /> Import
            </button>
            <button onClick={() => toast.success("Exported to Excel")} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition hover:bg-muted">
              <Download className="size-4" /> Export Excel
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
                  <Plus className="size-4" /> Add Customer
                </button>
              </DialogTrigger>
              <AddCustomerModal onSave={() => { setOpen(false); toast.success("Customer added successfully"); }} />
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
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email or ID"
              className="h-10 w-full rounded-lg border border-border bg-muted/40 pl-10 pr-3 text-sm outline-none focus:border-primary focus:bg-card"
            />
          </div>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary">
            {cities.map((c) => <option key={c} value={c}>{c === "all" ? "All Cities" : c}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary">
            {["all", "Active", "VIP", "Inactive"].map((s) => <option key={s} value={s}>{s === "all" ? "All Status" : s}</option>)}
          </select>
          <input type="date" className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground outline-none focus:border-primary" />
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
                  <td className="px-5 py-3 text-muted-foreground">{new Date(c.lastBooking).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-lg p-1.5 text-muted-foreground outline-none hover:bg-muted"><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="size-4" /> View Details</DropdownMenuItem>
                        <DropdownMenuItem><Pencil className="size-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => toast.error("Customer removed")}><Trash2 className="size-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 text-sm text-muted-foreground">
          <span>Showing {filtered.length} of {customers.length} customers</span>
          <div className="flex gap-1">
            <button className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted">Previous</button>
            <button className="rounded-lg bg-primary px-3 py-1.5 text-primary-foreground">1</button>
            <button className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted">2</button>
            <button className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted">Next</button>
          </div>
        </div>
      </Panel>
    </>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input {...props} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}

function AddCustomerModal({ onSave }: { onSave: () => void }) {
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
            <Field label="Full Name" placeholder="Jane Doe" />
            <Field label="Date of Birth" type="date" />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact Information</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" type="email" placeholder="jane@email.com" />
            <Field label="Phone" placeholder="+62 812 ..." />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Address</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" placeholder="Jakarta" />
            <Field label="Postal Code" placeholder="12345" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <button onClick={onSave} className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save Customer</button>
      </DialogFooter>
    </DialogContent>
  );
}
