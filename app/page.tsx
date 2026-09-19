"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCities,
  getListings,
  getNeighborhoods,
  getTransport,
  getInterestGroups,
} from "@/lib/data";
import type {
  City,
  Listing,
  Neighborhood,
  TransportOption,
  InterestGroup,
} from "@/lib/fallback-data";

type Tab = "housing" | "neighborhoods" | "transit" | "community";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "housing", label: "Housing", icon: "🏠" },
  { key: "neighborhoods", label: "Neighborhoods", icon: "🏙️" },
  { key: "transit", label: "Transit", icon: "🚇" },
  { key: "community", label: "Community", icon: "👥" },
];

// TODO: replace with your real InternNest Discord invite link.
const DISCORD_INVITE = "https://discord.gg/your-invite-code";

export default function HomePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [cityId, setCityId] = useState<string>("");
  const [tab, setTab] = useState<Tab>("housing");

  const [listings, setListings] = useState<Listing[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [transport, setTransport] = useState<TransportOption[]>([]);
  const [groups, setGroups] = useState<InterestGroup[]>([]);

  // filters
  const [sizeFilter, setSizeFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");
  const [maxBudget, setMaxBudget] = useState<number>(0);

  useEffect(() => {
    getCities().then((c) => {
      setCities(c);
      if (c.length) setCityId(c[0].id);
    });
  }, []);

  useEffect(() => {
    if (!cityId) return;
    getListings(cityId).then((l) => {
      setListings(l);
      const max = l.reduce((m, x) => Math.max(m, x.price), 0);
      setMaxBudget(max);
      setSizeFilter("All");
      setAreaFilter("All");
    });
    getNeighborhoods(cityId).then(setNeighborhoods);
    getTransport(cityId).then(setTransport);
    getInterestGroups(cityId).then(setGroups);
  }, [cityId]);

  const city = cities.find((c) => c.id === cityId);

  const sizes = useMemo(
    () => ["All", ...Array.from(new Set(listings.map((l) => l.type)))],
    [listings],
  );
  const areas = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(listings.map((l) => l.neighborhood).filter(Boolean) as string[]),
      ),
    ],
    [listings],
  );
  const priceCeiling = useMemo(
    () => listings.reduce((m, x) => Math.max(m, x.price), 0),
    [listings],
  );

  const filtered = listings.filter(
    (l) =>
      (sizeFilter === "All" || l.type === sizeFilter) &&
      (areaFilter === "All" || l.neighborhood === areaFilter) &&
      (maxBudget === 0 || l.price <= maxBudget),
  );

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span>🪺</span> InternNest
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/signup"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Sign up
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Internship Housing & Community
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Your city. Your internship. Your people.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Find subleases, navigate transit, and connect with fellow interns — all
          in one place. Built for interns, by interns.
        </p>
      </section>

      {/* City selector */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap justify-center gap-2">
          {cities.map((c) => (
            <button
              key={c.id}
              onClick={() => setCityId(c.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                c.id === cityId
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="mr-1">{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Stats */}
      {city && (
        <section className="mx-auto mt-6 max-w-6xl px-4">
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <Stat label="Avg Rent" value={`$${city.avgRent}/mo`} />
            <Stat label="Listings" value={String(listings.length)} />
            <Stat label="Groups" value={String(groups.length)} />
          </div>
        </section>
      )}

      {/* Tabs */}
      <section className="mx-auto mt-8 max-w-6xl px-4">
        <div className="flex flex-wrap gap-2 border-b border-slate-200">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
                tab === t.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === "housing" && (
            <div>
              {/* Filters */}
              <div className="mb-5 flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4">
                <Select
                  label="Size"
                  value={sizeFilter}
                  onChange={setSizeFilter}
                  options={sizes}
                />
                <Select
                  label="Area"
                  value={areaFilter}
                  onChange={setAreaFilter}
                  options={areas}
                />
                <div>
                  <label className="block text-xs font-medium text-slate-500">
                    Max budget: ${maxBudget}/mo
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={priceCeiling}
                    step={50}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="mt-2 w-48 accent-indigo-600"
                  />
                </div>
                <button className="ml-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  + Post a Listing
                </button>
              </div>

              {filtered.length === 0 ? (
                <p className="text-slate-500">No listings match your filters.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "neighborhoods" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {neighborhoods.map((n) => (
                <div
                  key={n.name}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{n.name}</h3>
                    <span className="text-sm text-slate-500">
                      ${n.avgRent}/mo
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{n.vibe}</p>
                  <div className="mt-3 flex gap-3 text-xs text-slate-500">
                    <span>🚇 Commute {n.commuteScore}/10</span>
                    <span>🛡️ Safety {n.safetyScore}/10</span>
                    <span>🚶 Walk {n.walkability}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{n.highlight}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {n.bestFor.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "transit" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {transport.map((t) => (
                <div
                  key={t.mode}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{t.icon}</span>
                    <h3 className="font-bold">{t.mode}</h3>
                    <span className="ml-auto text-sm text-slate-500">
                      {t.cost}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{t.desc}</p>
                  <p className="mt-2 text-sm text-indigo-600">💡 {t.tip}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "community" && (
            <div className="space-y-6">
              <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 transition hover:border-indigo-400"
              >
                <span className="text-3xl">💬</span>
                <div className="flex-1">
                  <h3 className="font-bold text-indigo-900">
                    Join the InternNest Discord
                  </h3>
                  <p className="text-sm text-indigo-700">
                    Verified interns only — city channels for housing, roommates,
                    transit & meetups. Your people are already here.
                  </p>
                </div>
                <span className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                  Join →
                </span>
              </a>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map((g) => (
                <a
                  key={g.name}
                  href={g.link ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{g.emoji}</span>
                    <h3 className="font-bold">{g.name}</h3>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                    <span>{g.category}</span>
                    <span>{g.members} members</span>
                  </div>
                </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-slate-400">
        InternNest · Built for interns, by interns
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ListingCard({ listing: l }: { listing: Listing }) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="text-3xl">{l.img}</div>
        {l.verified && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            ✓ Verified
          </span>
        )}
      </div>
      <h3 className="mt-3 font-bold leading-tight">{l.title}</h3>
      <p className="text-sm text-slate-500">
        {l.type} · {l.dates}
      </p>
      <p className="mt-2 text-lg font-bold">
        ${l.price}
        <span className="text-sm font-normal text-slate-500">/mo</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        {l.amenities.slice(0, 4).map((a) => (
          <span
            key={a}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
          >
            {a}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
        <span className="text-slate-500">
          {l.poster} @ {l.posterCompany}
        </span>
        {l.link && (
          <a
            href={l.link}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 hover:underline"
          >
            View ↗
          </a>
        )}
      </div>
    </div>
  );
}
