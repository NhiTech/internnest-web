<div align="center">

# 🪺 InternNest

### Your city. Your summer. Your people.

**Find subleases, navigate transit, and connect with fellow interns — all in one place.**
_Built for interns, by interns._

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)

</div>

---

## The Problem

College students doing 8–12 week summer internships in unfamiliar cities have to find short-term
housing on their own. It's **stressful, time-consuming, and isolating** — and generic listing sites
aren't built for sublease-length stays, for trusting a stranger sight-unseen, or for the social side
of moving somewhere new alone.

> Validated with **50 customer-discovery interviews** (students across MIT, Stanford, Georgia Tech,
> UT, and more — plus 30 companies). See [`docs/design-doc.md`](docs/design-doc.md).

## The Solution

InternNest connects interns with **verified short-term listings** and a **community of peers in the
same city**, so they can focus on the internship instead of the logistics.

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🏙️ | **City hub** | Pick your internship city; see avg rent, listing count, and community size at a glance. Covers SF, NYC, Boston, Chicago, Atlanta, Seattle, LA, and DC. |
| 🏠 | **Housing** | Verified sublease listings with price, dates, amenities, commute-to-company, neighborhood, and poster — filterable by size, area, and budget. |
| 🏘️ | **Neighborhoods** | Per-city neighborhood guides: vibe, avg rent, commute/safety/walkability scores, and what each is best for. |
| 🚇 | **Transit** | How to get around each city — modes, costs, and intern tips. |
| 👥 | **Community** | A verified-intern **Discord** (city channels for housing, roommates, transit & meetups) plus local interest groups. |
| 📝 | **Sign-up / onboarding** | Quick-start profile (school `.edu` email, city, company, dates, budget) to personalize matches. |
| ✅ | **Trust-first** | Verified-student model, verification badges, and "never pay off-platform" guardrails baked into the design. |

---

## 🧱 Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript** |
| UI | **React 18** + **Tailwind CSS** |
| Data / Backend | **Supabase** (Postgres) — with a built-in **hardcoded-data fallback** so the app runs with zero config |
| Hosting | **Vercel** |

---

## 🚀 Getting Started

```bash
# clone
gh repo clone NhiTech/internnest-web
cd internnest-web

# install
npm install

# run (works with no database — uses fallback data)
npm run dev
```

Open **http://localhost:3000**.

### Optional: connect Supabase
The app runs on bundled fallback data out of the box. To use a live database, add a `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

If these aren't set, `lib/data.ts` automatically falls back to `lib/fallback-data.ts` — so nothing
breaks.

---

## 📁 Project Structure

```
internnest-web/
├── app/
│   ├── layout.tsx        # root layout + metadata
│   ├── page.tsx          # home: city selector, stats, and the 4 tabs
│   └── signup/page.tsx   # sign-up / onboarding flow
├── lib/
│   ├── data.ts           # data access (Supabase → fallback)
│   ├── supabase.ts       # Supabase client (null when unconfigured)
│   └── fallback-data.ts  # cities, listings, neighborhoods, transit, groups
├── docs/
│   └── design-doc.md     # full product & technical design doc
└── discord-setup/
    ├── setup.mjs         # one-command builder for the InternNest Discord
    └── README.md         # Discord setup instructions
```

---

## 💬 Discord Community

A moderated, **verified-interns-only** Discord organized by city (channels for housing, roommates,
transit, neighborhoods, and social) with a scam-guard AutoMod rule. The
[`discord-setup/`](discord-setup/) folder has an idempotent `setup.mjs` script that builds the whole
server structure in one run.

> ⚠️ Update `DISCORD_INVITE` in `app/page.tsx` with your real server invite link.

---

## 🗺️ Roadmap

- [x] Core browse experience (cities, listings + filters, neighborhoods, transit, community)
- [x] Sign-up / onboarding form
- [x] Discord community + setup script
- [ ] **Supabase Auth** with `.edu` verification wired to sign-up
- [ ] **Post-a-Listing** write path (verified students only)
- [ ] **Save / favorites** (per-user)
- [ ] Roommate matching (lifestyle-based)
- [ ] Employer (B2B) outreach with real usage data

See [`docs/design-doc.md`](docs/design-doc.md) for the full plan, customer discovery, business model,
and trust/safety design.

---

<div align="center">

**InternNest** · Built for interns, by interns 🪺

</div>
