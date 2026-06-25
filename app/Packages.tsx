"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Download, Star, Clock, Users, MapPin, Eye, Pencil, Trash2,
  X, Package, DollarSign, CalendarDays, AlignLeft, Tag, ToggleLeft, ToggleRight,
  AlertTriangle, ListOrdered, CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  Trash
} from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTravel } from "../hooks/useTravel";
import { formatIDR } from "../lib/data";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ItineraryItem {
  day: string;
  title: string;
  detail: string;
}

export interface PackageFormData {
  nama_paket: string;
  kategori_id: number | null;
  durasi_hari: number;
  harga_dasar: number;
  deskripsi: string;
  is_aktif: boolean;
  // Extended fields (serialized inside deskripsi as JSON)
  overview: string;
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
}

const EMPTY_FORM: PackageFormData = {
  nama_paket: "",
  kategori_id: null,
  durasi_hari: 3,
  harga_dasar: 0,
  deskripsi: "",
  is_aktif: true,
  overview: "",
  itinerary: [{ day: "Day 1", title: "", detail: "" }],
  included: [""],
  excluded: [""],
};

/** Serialize extended fields into deskripsi JSON string */
export function serializeDescription(form: PackageFormData): string {
  return JSON.stringify({
    overview: form.overview,
    itinerary: form.itinerary.filter((it) => it.title.trim()),
    included: form.included.filter(Boolean),
    excluded: form.excluded.filter(Boolean),
  });
}

/** Parse deskripsi back to extended fields */
export function parseDescription(deskripsi: string): Partial<PackageFormData> {
  try {
    const parsed = JSON.parse(deskripsi);
    return {
      overview: parsed.overview ?? "",
      itinerary: parsed.itinerary?.length ? parsed.itinerary : [{ day: "Day 1", title: "", detail: "" }],
      included: parsed.included?.length ? parsed.included : [""],
      excluded: parsed.excluded?.length ? parsed.excluded : [""],
    };
  } catch {
    return {
      overview: deskripsi ?? "",
      itinerary: [{ day: "Day 1", title: "", detail: "" }],
      included: [""],
      excluded: [""],
    };
  }
}

// ─── Step indicators ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 0, label: "Info Dasar", icon: Package },
  { id: 1, label: "Itinerary", icon: ListOrdered },
  { id: 2, label: "Fasilitas", icon: CheckCircle2 },
];

// ─── Package Modal ────────────────────────────────────────────────────────────
function PackageModal({
  open,
  onClose,
  onSubmit,
  initial,
  kategoriList,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PackageFormData) => Promise<void>;
  initial: PackageFormData;
  kategoriList: { kategori_id: number; nama_kategori: string }[];
  submitting: boolean;
}) {
  const [form, setForm] = useState<PackageFormData>(initial);
  const [step, setStep] = useState(0);

  // Reset form & step when modal opens
  useEffect(() => {
    if (open) {
      setForm(initial);
      setStep(0);
    }
  }, [open, initial]);

  if (!open) return null;

  const set = <K extends keyof PackageFormData>(field: K, value: PackageFormData[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ── Itinerary helpers ──
  const addItineraryRow = () =>
    set("itinerary", [...form.itinerary, { day: `Day ${form.itinerary.length + 1}`, title: "", detail: "" }]);

  const updateItinerary = (idx: number, field: keyof ItineraryItem, value: string) => {
    const updated = form.itinerary.map((it, i) => (i === idx ? { ...it, [field]: value } : it));
    set("itinerary", updated);
  };

  const removeItinerary = (idx: number) =>
    set("itinerary", form.itinerary.filter((_, i) => i !== idx));

  // ── Facility helpers ──
  const updateFacility = (list: "included" | "excluded", idx: number, value: string) => {
    const updated = form[list].map((f, i) => (i === idx ? value : f));
    set(list, updated);
  };

  const addFacility = (list: "included" | "excluded") =>
    set(list, [...form[list], ""]);

  const removeFacility = (list: "included" | "excluded", idx: number) =>
    set(list, form[list].filter((_, i) => i !== idx));

  // ── Validation per step ──
  const validateStep0 = () => {
    if (!form.nama_paket.trim()) { toast.error("Nama paket wajib diisi"); return false; }
    if (form.durasi_hari < 1) { toast.error("Durasi minimal 1 hari"); return false; }
    if (form.harga_dasar <= 0) { toast.error("Harga harus lebih dari 0"); return false; }
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep0()) { setStep(0); return; }
    await onSubmit({ ...form, deskripsi: serializeDescription(form) });
  };

  const isEdit = !!initial.nama_paket;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && onClose()} />

      {/* Dialog */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <Package className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                {isEdit ? "Edit Paket Wisata" : "Tambah Paket Wisata"}
              </h2>
              <p className="text-xs text-muted-foreground">Langkah {step + 1} dari 3 — {STEPS[step].label}</p>
            </div>
          </div>
          <button
            onClick={() => !submitting && onClose()}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-0 border-b border-border shrink-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === i;
            const isDone = step > i;
            return (
              <button
                key={s.id}
                onClick={() => { if (i === 0 || step > 0) setStep(i); }}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 py-3 text-xs font-medium transition border-b-2",
                  isActive ? "border-primary text-primary" : isDone ? "border-emerald-500 text-emerald-600" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                {s.label}
                {isDone && <CheckCircle2 className="size-3 text-emerald-500" />}
              </button>
            );
          })}
        </div>

        {/* Form Body — scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {/* ── STEP 0: Info Dasar ── */}
            {step === 0 && (
              <>
                {/* Nama Paket */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Package className="size-3.5 text-muted-foreground" />
                    Nama Paket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.nama_paket}
                    onChange={(e) => set("nama_paket", e.target.value)}
                    placeholder="Contoh: Bali Adventure 4D3N"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                {/* Kategori & Durasi */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Tag className="size-3.5 text-muted-foreground" /> Kategori
                    </label>
                    <select
                      value={form.kategori_id ?? ""}
                      onChange={(e) => set("kategori_id", e.target.value ? Number(e.target.value) : null)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {kategoriList.map((k) => (
                        <option key={k.kategori_id} value={k.kategori_id}>{k.nama_kategori}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <CalendarDays className="size-3.5 text-muted-foreground" />
                      Durasi (hari) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={form.durasi_hari}
                      onChange={(e) => set("durasi_hari", Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </div>

                {/* Harga */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <DollarSign className="size-3.5 text-muted-foreground" />
                    Harga Dasar (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">Rp</span>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={form.harga_dasar}
                      onChange={(e) => set("harga_dasar", Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  {form.harga_dasar > 0 && (
                    <p className="text-xs text-muted-foreground">{formatIDR(form.harga_dasar)} per orang</p>
                  )}
                </div>

                {/* Overview */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <AlignLeft className="size-3.5 text-muted-foreground" /> Overview / Deskripsi Singkat
                  </label>
                  <textarea
                    value={form.overview}
                    onChange={(e) => set("overview", e.target.value)}
                    rows={3}
                    placeholder="Jelaskan pengalaman umum yang akan didapat peserta..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Status Aktif</p>
                    <p className="text-xs text-muted-foreground">Paket akan ditampilkan ke pelanggan</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set("is_aktif", !form.is_aktif)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
                      form.is_aktif
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {form.is_aktif ? <><ToggleRight className="size-4" /> Aktif</> : <><ToggleLeft className="size-4" /> Draft</>}
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 1: Itinerary ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Tambahkan jadwal kegiatan per hari.</p>
                  <button
                    type="button"
                    onClick={addItineraryRow}
                    className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition"
                  >
                    <Plus className="size-3.5" /> Tambah Hari
                  </button>
                </div>

                <div className="relative space-y-4 pl-6">
                  <span className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border" />
                  {form.itinerary.map((it, idx) => (
                    <div key={idx} className="relative rounded-xl border border-border bg-background p-4 space-y-3">
                      <span className="absolute -left-[22px] top-5 size-3.5 rounded-full border-2 border-primary bg-card" />

                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={it.day}
                          onChange={(e) => updateItinerary(idx, "day", e.target.value)}
                          placeholder="Day 1"
                          className="w-24 rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase tracking-wide"
                        />
                        <input
                          type="text"
                          value={it.title}
                          onChange={(e) => updateItinerary(idx, "title", e.target.value)}
                          placeholder="Judul kegiatan hari ini..."
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                        />
                        {form.itinerary.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItinerary(idx)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition"
                          >
                            <Trash className="size-3.5" />
                          </button>
                        )}
                      </div>

                      <textarea
                        value={it.detail}
                        onChange={(e) => updateItinerary(idx, "detail", e.target.value)}
                        rows={2}
                        placeholder="Deskripsi detail kegiatan hari ini..."
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 2: Fasilitas ── */}
            {step === 2 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Included */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <p className="text-sm font-semibold text-foreground">Termasuk</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addFacility("included")}
                      className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-100 transition dark:bg-emerald-900/20 dark:text-emerald-400"
                    >
                      <Plus className="size-3" /> Tambah
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.included.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateFacility("included", idx, e.target.value)}
                          placeholder="Contoh: Tiket pesawat PP"
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                        />
                        {form.included.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFacility("included", idx)}
                            className="rounded p-1 text-muted-foreground hover:text-red-500 transition"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Excluded */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="size-4 text-red-400" />
                      <p className="text-sm font-semibold text-foreground">Tidak Termasuk</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addFacility("excluded")}
                      className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-100 transition dark:bg-red-900/20 dark:text-red-400"
                    >
                      <Plus className="size-3" /> Tambah
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.excluded.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <XCircle className="size-4 shrink-0 text-red-400" />
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateFacility("excluded", idx, e.target.value)}
                          placeholder="Contoh: Asuransi perjalanan"
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition"
                        />
                        {form.excluded.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFacility("excluded", idx)}
                            className="rounded p-1 text-muted-foreground hover:text-red-500 transition"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 border-t border-border px-6 py-4 shrink-0">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition"
              >
                <ChevronLeft className="size-4" /> Kembali
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted transition"
              >
                Batal
              </button>
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
              >
                Lanjut <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition"
              >
                {submitting ? (
                  <><span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Menyimpan...</>
                ) : (
                  isEdit ? "Simpan Perubahan" : "Tambah Paket"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function DeleteDialog({
  open, name, onCancel, onConfirm, submitting,
}: {
  open: boolean; name: string; onCancel: () => void;
  onConfirm: () => Promise<void>; submitting: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-semibold text-foreground">Hapus Paket</h3>
          <p className="text-sm text-muted-foreground">
            Apakah kamu yakin ingin menghapus paket <span className="font-medium text-foreground">"{name}"</span>? Tindakan ini tidak bisa dibatalkan.
          </p>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onCancel} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted transition">Batal</button>
          <button onClick={onConfirm} disabled={submitting} className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition">
            {submitting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function Packages() {
  const router = useRouter();
  const { packages, loading, kategoriList, addPackage, updatePackage, deletePackage } = useTravel();

  const [cat, setCat] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<{ id: string; form: PackageFormData } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading packages...</p>
        </div>
      </div>
    );
  }

  const categories = ["All", ...Array.from(new Set(packages.map((p) => p.category)))];
  const list = packages.filter((p) => cat === "All" || p.category === cat);

  const extractId = (pkgId: string): number => {
    const match = pkgId.match(/PKG-0*(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  const handleOpenAdd = () => { setEditTarget(null); setShowModal(true); };

  const handleOpenEdit = (p: (typeof packages)[0]) => {
    const kategoriId = kategoriList.find((k) => k.nama_kategori === p.category)?.kategori_id ?? null;
    const extended = parseDescription(p.description ?? "");
    setEditTarget({
      id: p.id,
      form: {
        nama_paket: p.name,
        kategori_id: kategoriId,
        durasi_hari: parseInt(p.duration) || 3,
        harga_dasar: p.price,
        deskripsi: p.description ?? "",
        is_aktif: p.status === "Active",
        overview: extended.overview ?? "",
        itinerary: extended.itinerary ?? [{ day: "Day 1", title: "", detail: "" }],
        included: extended.included ?? [""],
        excluded: extended.excluded ?? [""],
      },
    });
    setShowModal(true);
  };

  const handleCloseModal = () => { if (submitting) return; setShowModal(false); setEditTarget(null); };

  const handleSubmit = async (data: PackageFormData) => {
    setSubmitting(true);
    try {
      if (editTarget) {
        const { error } = await updatePackage(extractId(editTarget.id), data);
        if (error) { toast.error("Gagal memperbarui: " + (error.message ?? error)); }
        else { toast.success("Paket berhasil diperbarui!"); setShowModal(false); setEditTarget(null); }
      } else {
        const { error } = await addPackage(data);
        if (error) { toast.error("Gagal menambah: " + (error.message ?? error)); }
        else { toast.success("Paket baru berhasil ditambahkan!"); setShowModal(false); }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await deletePackage(extractId(deleteTarget.id));
      if (error) { toast.error("Gagal menghapus: " + (error.message ?? error)); }
      else { toast.success(`Paket "${deleteTarget.name}" berhasil dihapus.`); setDeleteTarget(null); }
    } finally { setDeleting(false); }
  };

  const handleExport = () => {
    const rows = [
      ["ID", "Nama Paket", "Kategori", "Destinasi", "Harga", "Durasi", "Status"],
      ...packages.map((p) => [p.id, p.name, p.category, p.destination, p.price, p.duration, p.status]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "tour-packages.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Packages exported as CSV");
  };

  return (
    <>
      <PackageModal
        open={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initial={editTarget?.form ?? EMPTY_FORM}
        kategoriList={kategoriList}
        submitting={submitting}
      />
      <DeleteDialog
        open={deleteTarget !== null}
        name={deleteTarget?.name ?? ""}
        onCancel={() => { if (!deleting) setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm}
        submitting={deleting}
      />

      <PageHeader
        title="Tour Packages"
        description="Browse, create and manage all travel packages."
        actions={
          <>
            <button onClick={handleExport} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition hover:bg-muted">
              <Download className="size-4" /> Export
            </button>
            <button onClick={handleOpenAdd} className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
              <Plus className="size-4" /> Add Package
            </button>
          </>
        }
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition",
              cat === c ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-muted-foreground ring-1 ring-border hover:bg-muted"
            )}>
            {c}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {list.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <Package className="size-8 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">Belum ada paket wisata</p>
          <p className="text-sm text-muted-foreground">Klik tombol "Add Package" untuk menambahkan paket baru.</p>
          <button onClick={handleOpenAdd} className="mt-2 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
            <Plus className="size-4" /> Add Package
          </button>
        </div>
      )}

      {/* Package Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const fill = Math.round((p.booked / p.quota) * 100);
          return (
            <div key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
              <div className="relative h-44 bg-muted">
                <ImageWithFallback src={p.image} alt={p.name} className="size-full object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute left-3 top-3"><StatusBadge status={p.status} className="bg-white/90 backdrop-blur" /></div>
                <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">{p.category}</span>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-amber-600 backdrop-blur">
                  <Star className="size-3 fill-amber-500 text-amber-500" /> {p.rating}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {p.destination}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="size-3.5" /> {p.duration}</span>
                  <span className="flex items-center gap-1"><Users className="size-3.5" /> {p.booked}/{p.quota} booked</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${fill}%` }} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-foreground">{formatIDR(p.price)}</p>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => router.push(`/packages/${p.id}`)} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-primary transition" title="View">
                      <Eye className="size-4" />
                    </button>
                    <button onClick={() => handleOpenEdit(p)} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-primary transition" title="Edit">
                      <Pencil className="size-4" />
                    </button>
                    <button onClick={() => setDeleteTarget({ id: p.id, name: p.name })} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition" title="Delete">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
