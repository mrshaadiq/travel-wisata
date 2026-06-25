import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, MapPin, Calendar, Users, CreditCard, Printer } from "lucide-react";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTravel } from "../hooks/useTravel";
import { formatIDR } from "../lib/data";
import { cn } from "../components/ui/utils";

const steps = ["Booked", "Payment", "Confirmed", "Departed", "Completed"];

export function BookingDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { bookings, packages, loading } = useTravel();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const b = bookings.find((x) => x.id === id) || bookings[0];
  if (!b) return null;
  const pkg = packages.find((p) => p.name === b.package) || packages[0] || { name: b.package, image: "", destination: b.destination, duration: "", category: "", rating: 5, reviews: 0 };
  const currentStep = b.status === "Completed" ? 5 : b.status === "Confirmed" ? 3 : b.status === "Pending" ? 1 : b.status === "Cancelled" ? 1 : 2;


  return (
    <>
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/bookings")} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Bookings
        </button>
        <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground hover:bg-muted">
          <Printer className="size-4" /> Print Invoice
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Booking Code</p>
          <h1 className="text-2xl font-bold text-foreground">{b.id}</h1>
        </div>
        <StatusBadge status={b.status} className="px-3 py-1 text-sm" />
      </div>

      {/* Status tracker */}
      <Panel title="Booking Status Tracker">
        <div className="flex items-center">
          {steps.map((s, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <span className={cn("flex size-9 items-center justify-center rounded-full text-sm font-semibold", done ? "bg-primary text-primary-foreground" : active ? "bg-primary/15 text-primary ring-2 ring-primary" : "bg-muted text-muted-foreground")}>
                    {done ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span className={cn("mt-1.5 text-xs font-medium", done || active ? "text-foreground" : "text-muted-foreground")}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={cn("mx-2 h-0.5 flex-1 rounded-full", i < currentStep ? "bg-primary" : "bg-muted")} />}
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Booking Information">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Info icon={Calendar} label="Departure Date" value={new Date(b.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} />
              <Info icon={Users} label="Participants" value={`${b.participants} person(s)`} />
              <Info icon={MapPin} label="Destination" value={b.destination} />
              <Info icon={CreditCard} label="Payment Method" value={b.method} />
            </div>
          </Panel>

          <Panel title="Participant Information" bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">ID Number</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: b.participants }).map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium text-foreground">{i === 0 ? b.customer : `Companion ${i}`}</td>
                      <td className="px-5 py-3 text-muted-foreground">3271{Math.floor(100000000 + Math.random() * 800000000)}</td>
                      <td className="px-5 py-3 text-muted-foreground">{i === 0 ? "Lead Traveler" : "Adult"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Travel Package Information">
            <div className="flex gap-4">
              <ImageWithFallback src={pkg.image} alt={pkg.name} className="h-24 w-32 shrink-0 rounded-xl bg-muted object-cover" />
              <div>
                <h4 className="font-semibold text-foreground">{pkg.name}</h4>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" /> {pkg.destination} · {pkg.duration}</p>
                <p className="mt-2 text-sm text-muted-foreground">{pkg.category} package · ⭐ {pkg.rating} ({pkg.reviews} reviews)</p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Payment Information">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Package price</span><span className="text-foreground">{formatIDR(b.amount / b.participants)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Participants</span><span className="text-foreground">× {b.participants}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-green-600">- {formatIDR(0)}</span></div>
              <div className="my-2 h-px bg-border" />
              <div className="flex justify-between font-bold"><span className="text-foreground">Total Paid</span><span className="text-lg text-primary">{formatIDR(b.amount)}</span></div>
              <div className="mt-3 rounded-xl bg-green-50 p-3 text-center text-sm font-medium text-green-700">Payment {b.status === "Pending" ? "awaiting confirmation" : "verified"}</div>
            </div>
          </Panel>

          <Panel title="Customer">
            <div className="flex items-center gap-3">
              <img src={b.avatar} alt={b.customer} className="size-11 rounded-full bg-muted" />
              <div>
                <p className="font-semibold text-foreground">{b.customer}</p>
                <p className="text-xs text-muted-foreground">Booked on {new Date(b.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="h-9 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">Confirm Booking</button>
              <button className="h-9 flex-1 rounded-lg border border-border text-sm font-medium text-red-600 hover:bg-red-50">Cancel</button>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Icon className="size-4" /></span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
