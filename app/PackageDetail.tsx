import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Star, Clock, Users, MapPin, Check, X, Building2, Bus, UserCheck, Pencil,
} from "lucide-react";
import { Panel } from "../components/shared/Panel";
import { StatusBadge } from "../components/shared/StatusBadge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTravel } from "../hooks/useTravel";
import { formatIDR } from "../lib/data";
import { parseDescription } from "./Packages";
import { destinationImages, avatar } from "../lib/images";

const gallery = [destinationImages.bali, destinationImages.lombok, destinationImages.komodo, destinationImages.yogyakarta];
const DEFAULT_INCLUDED = ["Return flights", "4-star hotel accommodation", "Daily breakfast & dinner", "Private air-conditioned transport", "English-speaking tour guide", "All entrance tickets"];
const DEFAULT_EXCLUDED = ["Travel insurance", "Personal expenses", "Lunch on free days", "Optional water sports", "Tips & gratuities"];
const DEFAULT_ITINERARY = [
  { day: "Day 1", title: "Arrival & Welcome Dinner", detail: "Airport pickup, hotel check-in, welcome dinner with traditional performance." },
  { day: "Day 2", title: "Sightseeing Tour", detail: "Full-day guided tour of key attractions with lunch included." },
  { day: "Day 3", title: "Free Day & Activities", detail: "Free time for personal exploration or optional activities." },
  { day: "Day 4", title: "Shopping & Departure", detail: "Souvenir shopping and airport transfer for departure." },
];
const reviews = [
  { name: "Citra Dewi", rating: 5, text: "Absolutely magical trip! The guide was knowledgeable and the itinerary was perfectly paced.", date: "2 weeks ago" },
  { name: "Fajar Nugroho", rating: 5, text: "Best value for money. Hotels were stunning and everything ran on time.", date: "1 month ago" },
  { name: "Indah Permata", rating: 4, text: "Great experience overall, would have loved one more free day.", date: "1 month ago" },
];

export function PackageDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { packages, hotels, guides, loading } = useTravel();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading package details...</p>
        </div>
      </div>
    );
  }

  const pkg = packages.find((p) => p.id === id) || packages[0];
  if (!pkg) return null;

  // Parse itinerary & facilities from JSON stored in deskripsi
  const parsed = parseDescription(pkg.description ?? "");
  const itinerary = parsed.itinerary?.length ? parsed.itinerary : DEFAULT_ITINERARY;
  const included = parsed.included?.filter(Boolean).length ? parsed.included!.filter(Boolean) : DEFAULT_INCLUDED;
  const excluded = parsed.excluded?.filter(Boolean).length ? parsed.excluded!.filter(Boolean) : DEFAULT_EXCLUDED;
  const overview = parsed.overview?.trim() || `Discover the magic of ${pkg.destination} on this ${pkg.duration} journey crafted for travelers who want comfort, culture and unforgettable scenery.`;


  return (
    <>
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/packages")} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Packages
        </button>
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
          <Pencil className="size-4" /> Edit Package
        </button>
      </div>

      {/* Cover */}
      <div className="relative h-72 overflow-hidden rounded-2xl bg-muted">
        <ImageWithFallback src={pkg.image} alt={pkg.name} className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium backdrop-blur">{pkg.category}</span>
            <StatusBadge status={pkg.status} className="bg-white/90" />
          </div>
          <h1 className="text-3xl font-bold">{pkg.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/90">
            <span className="flex items-center gap-1"><MapPin className="size-4" /> {pkg.destination}</span>
            <span className="flex items-center gap-1"><Clock className="size-4" /> {pkg.duration}</span>
            <span className="flex items-center gap-1"><Users className="size-4" /> Quota {pkg.quota}</span>
            <span className="flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" /> {pkg.rating} ({pkg.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-4 gap-3">
        {gallery.map((g, i) => (
          <div key={i} className="h-24 overflow-hidden rounded-xl bg-muted sm:h-32">
            <ImageWithFallback src={g} alt={`Gallery ${i + 1}`} className="size-full object-cover transition hover:scale-105" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Overview">
            <p className="text-sm leading-relaxed text-muted-foreground">{overview}</p>
          </Panel>

          <Panel title="Itinerary">
            <div className="relative space-y-6 pl-6">
              <span className="absolute left-[7px] top-1 h-[calc(100%-1rem)] w-px bg-border" />
              {itinerary.map((it) => (
                <div key={it.day} className="relative">
                  <span className="absolute -left-[22px] top-1 size-3.5 rounded-full border-2 border-primary bg-card" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{it.day}</p>
                  <h4 className="mt-0.5 font-semibold text-foreground">{it.title}</h4>
                  <p className="mt-0.5 text-sm text-muted-foreground">{it.detail}</p>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Panel title="Included Facilities">
              <ul className="space-y-2.5">
                {included.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600"><Check className="size-3" /></span> {f}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Excluded Facilities">
              <ul className="space-y-2.5">
                {excluded.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500"><X className="size-3" /></span> {f}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title="Customer Reviews">
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.name} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img src={avatar(r.name)} alt={r.name} className="size-9 rounded-full bg-muted" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={i < r.rating ? "size-3 fill-amber-500 text-amber-500" : "size-3 text-slate-300"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Panel title="Pricing Breakdown">
            <div className="space-y-2.5 text-sm">
              <Row label="Base price / person" value={formatIDR(pkg.price)} />
              <Row label="Taxes & fees (10%)" value={formatIDR(pkg.price * 0.1)} />
              <Row label="Service charge" value={formatIDR(150000)} />
              <div className="my-2 h-px bg-border" />
              <div className="flex items-center justify-between font-bold text-foreground">
                <span>Total / person</span>
                <span className="text-lg text-primary">{formatIDR(pkg.price * 1.1 + 150000)}</span>
              </div>
            </div>
          </Panel>

          <Panel title="Hotel Information">
            <div className="flex items-center gap-3">
              <ImageWithFallback src={hotels[0].image} alt={hotels[0].name} className="size-14 rounded-xl bg-muted object-cover" />
              <div>
                <p className="font-semibold text-foreground">{hotels[0].name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><Building2 className="size-3" /> {hotels[0].city} · ⭐ {hotels[0].rating}</p>
              </div>
            </div>
          </Panel>

          <Panel title="Transportation">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600"><Bus className="size-5" /></span>
              <div>
                <p className="font-semibold text-foreground">Toyota Hiace Premio</p>
                <p className="text-xs text-muted-foreground">Private · 14 seats · A/C</p>
              </div>
            </div>
          </Panel>

          <Panel title="Tour Guide">
            <div className="flex items-center gap-3">
              <img src={guides[0].avatar} alt={guides[0].name} className="size-11 rounded-full bg-muted" />
              <div>
                <p className="font-semibold text-foreground">{guides[0].name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><UserCheck className="size-3" /> {guides[0].languages} · ⭐ {guides[0].rating}</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
