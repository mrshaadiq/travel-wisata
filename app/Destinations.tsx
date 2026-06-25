"use client";

import { useState } from "react";
import { Plus, MapPin, TrendingUp, Pencil, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "../components/ui/dialog";
import { useTravel } from "../hooks/useTravel";
import { toast } from "sonner";

const EMPTY_FORM = { nama_destinasi: "", kota: "", deskripsi: "", image_url: "" };

type Dest = ReturnType<typeof useTravel>["destinations"][number];

export function Destinations() {
  const { destinations, loading, addDestination, updateDestination, deleteDestination } = useTravel();

  // --- Add dialog ---
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // --- Edit dialog ---
  const [editTarget, setEditTarget] = useState<{ id: number; d: Dest } | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [updating, setUpdating] = useState(false);

  // --- Delete dialog ---
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading destinations...</p>
        </div>
      </div>
    );
  }

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setAddForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const parseId = (id: string) => parseInt(id.replace("DST-", ""), 10);

  // --- Handlers ---
  const handleAdd = async () => {
    if (!addForm.nama_destinasi.trim()) { toast.error("Destination name is required"); return; }
    setSaving(true);
    const { error } = await addDestination({
      nama_destinasi: addForm.nama_destinasi.trim(),
      kota_id: null,
      deskripsi: addForm.deskripsi.trim(),
    });
    setSaving(false);
    if (error) { toast.error("Failed to add destination: " + (error.message ?? "Unknown error")); }
    else { toast.success("Destination added!"); setAddForm(EMPTY_FORM); setAddOpen(false); }
  };

  const openEdit = (d: Dest) => {
    setEditTarget({ id: parseId(d.id), d });
    setEditForm({ nama_destinasi: d.name, kota: d.province ?? "", deskripsi: "", image_url: d.image ?? "" });
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    if (!editForm.nama_destinasi.trim()) { toast.error("Destination name is required"); return; }
    setUpdating(true);
    const { error } = await updateDestination(editTarget.id, {
      nama_destinasi: editForm.nama_destinasi.trim(),
      kota_id: null,
      deskripsi: editForm.deskripsi.trim(),
    });
    setUpdating(false);
    if (error) { toast.error("Failed to update destination: " + (error.message ?? "Unknown error")); }
    else { toast.success("Destination updated!"); setEditTarget(null); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteDestination(deleteTarget.id);
    setDeleting(false);
    if (error) { toast.error("Failed to delete destination: " + (error.message ?? "Unknown error")); }
    else { toast.success(`"${deleteTarget.name}" deleted`); setDeleteTarget(null); }
  };

  // Reusable form body (same fields for add & edit)
  const FormFields = ({
    form,
    onChange,
  }: {
    form: typeof EMPTY_FORM;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  }) => (
    <div className="space-y-4">
      <Field label="Destination Name" name="nama_destinasi" placeholder="e.g. Bali" value={form.nama_destinasi} onChange={onChange} required />
      <Field label="City" name="kota" placeholder="e.g. Denpasar" value={form.kota} onChange={onChange} />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Description <span className="text-xs text-muted-foreground">(optional)</span>
        </label>
        <textarea
          name="deskripsi"
          rows={3}
          placeholder="Describe the destination..."
          value={form.deskripsi}
          onChange={onChange}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <Field label="Image URL" name="image_url" placeholder="https://example.com/photo.jpg" value={form.image_url} onChange={onChange} />
    </div>
  );

  return (
    <>
      <PageHeader
        title="Destination Management"
        description="Curate the destinations featured across your tour packages."
        actions={
          <Dialog open={addOpen} onOpenChange={(v) => { setAddOpen(v); if (!v) setAddForm(EMPTY_FORM); }}>
            <DialogTrigger asChild>
              <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                <Plus className="size-4" /> Add Destination
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Destination</DialogTitle>
                <DialogDescription>Add a new destination to the system.</DialogDescription>
              </DialogHeader>
              <FormFields form={addForm} onChange={handleAddChange} />
              <DialogFooter>
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  {saving ? "Saving..." : "Save Destination"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Destination grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {destinations.map((d) => (
          <div key={d.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
            <div className="relative h-40 bg-muted">
              <ImageWithFallback src={d.image} alt={d.name} className="size-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute left-3 top-3"><StatusBadge status={d.status} className="bg-white/90 backdrop-blur" /></div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{d.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {d.province}</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{d.category}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm font-semibold text-green-600"><TrendingUp className="size-3.5" /> {d.popularity}% popularity</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(d)}
                    className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                    title="Edit destination"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: parseId(d.id), name: d.name })}
                    className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                    title="Delete destination"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(v) => { if (!v) setEditTarget(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>Update the details for this destination.</DialogDescription>
          </DialogHeader>
          <FormFields form={editForm} onChange={handleEditChange} />
          <DialogFooter>
            <button
              onClick={() => setEditTarget(null)}
              className="h-10 flex-1 rounded-lg border border-border text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {updating && <Loader2 className="size-4 animate-spin" />}
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Destination</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>&ldquo;{deleteTarget?.name}&rdquo;</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({
  label,
  required,
  ...props
}: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <input
        {...props}
        className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
