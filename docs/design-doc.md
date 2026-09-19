# InternNest — Design Doc

**Tagline:** *Your city. Your summer. Your people.*
**One-liner:** Built for interns, by interns — find subleases, navigate transit, and connect with
fellow interns, all in one place.
**Status:** MVP live at https://intern-nest-psi.vercel.app/ · **Last updated:** 2026-09-18

---

## Project Summary

### Customers
College students completing short-term summer internships in major cities (New York, San Francisco,
Atlanta, Chicago, Boston, Seattle, LA, Washington) who need to independently find temporary housing
for **8–12 weeks**.

### Problem
Finding short-term, affordable housing in an unfamiliar city is stressful, time-consuming, and
isolating — leaving students overwhelmed before their internship even begins. Traditional listing
sites aren't built for sublease-length stays, trust between strangers, or the social side of moving
somewhere new alone.

### Solution
InternNest simplifies the housing search for intern students by connecting them with **verified
short-term listings** and a **community of peers in the same city**, so they can focus on their
internship experience — not logistics.

---

## Customer Discovery

**Insights from the field — 50 interviews. Real students, real companies, real pain.**

| Total interviews | GT students | Companies |
|:---:|:---:|:---:|
| **50** | **11** | **30** |

We validated the problem on **both sides of the market** — the interns who need housing (~20
students, incl. 11 Georgia Tech), and the employers who send them (30 companies).

### Demand side — interns who relocated for internships
We interviewed college students who moved to unfamiliar major cities (e.g. Seattle, New York,
Austin, LA) for summer internships at large companies (e.g. Microsoft, Tesla, Apple, BMW).

**What we heard:**
- Finding short-term (8–12 week) housing is **stressful, time-consuming, and isolating** — it starts
  before the internship and competes with everything else they're preparing for.
- Existing sites aren't built for **sublease-length stays** or for **trusting a stranger** sight-unseen
  in a new city.
- **Transit / commute** heavily shapes where they can realistically live ("good transit let me
  actually live in the city").
- Moving alone is **socially isolating** — they wanted peers going through the same thing.

**Sample voices** (students × their internships):
- Mechanical Engineer @ **MIT** → Varda Space Industries
- Mechanical Engineer @ **Univ. of Tennessee** → Toyota Motor Manufacturing KY
- Business Student @ **Indiana State** → Keystone Group
- CS @ **Stanford** → McKinsey

Range spans multiple schools, majors, and industries — the pain isn't school- or field-specific.

> *[Optional: add 2–3 direct quotes from these interviews.]*

### Employer side — companies that host interns
We interviewed businesses that bring on interns and asked whether they'd point their interns to a
platform like InternNest.

**What we heard:**
- **Yes — they would use it / recommend it to their interns.**
- It would make the housing process **a lot easier** for both the intern and the company.
- It gives them **peace of mind knowing their interns are getting proper, safe housing** — a pain
  point they currently can't help with well.
- Caveat (their bar for adoption): they want to see **real student demand / usage numbers** before
  formally adopting or promoting it.

Across **30 companies** interviewed.

> *[Optional: add roles of interviewees (recruiting / intern program managers) and direct quotes.]*

### Key takeaways
- The problem is **real and two-sided**: interns feel the pain acutely, and employers want to help
  but lack a tool.
- Employers are a **potential distribution channel** (recommend to incoming interns) — not just a
  "nice to have."
- Their adoption gate — *"show us usage data"* — directly shapes our plan: prove demand with real
  interns first (**Roadmap 0–3 mo**), then return to employers with numbers (**Roadmap 3–6 mo**).

### What We Learned (key insights)
| Insight | What it means |
|---|---|
| **Pain ≠ Demand** | Many students have normalized the housing-search struggle and tolerate inefficiencies rather than seek new solutions. |
| **Habit is Sticky** | Students default to Airbnb despite the difficulty — behavior change requires a *clearly superior* offering. |
| **Trust is the Barrier** | Trust and familiarity are the primary obstacles to adoption for any new housing platform. |
| **Employers Need Evidence** | Several employers would consider adoption only after seeing real data on intern demand. |
| **Pay for Trust, Not Convenience** | Students would pay for verified safety and reliability — convenience alone isn't enough. |
| **B2B Is the Real Opportunity** | Employer subsidization is the preferred payment model → a **B2B channel**, not student-direct. |

## MVP & Testing
*What we built. What we learned. How it changed us.*

**What we tested**
- A demo website with verified intern-friendly listings.
- A basic roommate-matching flow based on preferences.
- A landing page to gauge employer interest.
- Interviews to test willingness-to-pay assumptions.

**What we learned**
- **Trusting the accuracy of listings was the most valued feature by far.**
- Employers want demand data before committing budget.
- Students trust platforms their company endorses.
- The Airbnb habit is strong — differentiation must be clear.

**How it changed us**
- Shifted from **B2C-first → B2B employer-channel** strategy.
- Prioritized **trust/verification over feature breadth**.
- Focused MVP scope to **housing + roommates**.
- Identified **employer subsidization as the core business model**.

## Business Model
Discovery pointed away from charging students directly and toward **employer-subsidized B2B**:
- **Primary — Employer subscriptions:** companies pay/subsidize access, positioned as an *intern
  retention & experience* tool (peace of mind that interns get proper housing).
- **Secondary — Apartment finder's fee:** revenue from a verified landlord network.
- **Later — Featured-listing ads + relocation analytics.**
- Students value **verified safety/reliability** (would pay for trust) — but employer subsidization
  is the preferred, lower-friction path to revenue.

## Goals & Non-Goals

**Goals**
- Let an intern find a trustworthy 8–12 week sublease in their internship city fast.
- Make listings feel safe (verification, real intern posters tied to companies).
- Add the social layer competitors lack — peers, neighborhoods, transit, community groups.
- Prove demand with real users before scaling.

**Non-Goals (for now)**
- Long-term / year-round leasing.
- Handling payments, deposits, or lease contracts (link out; don't intermediate money yet).
- Nationwide coverage — start with a focused set of intern-heavy cities.

---

## Key Features (current + planned)

| Area | What it does | State |
|---|---|---|
| **City selector** | Pick a city; see listing count, avg rent, # groups | ✅ Live |
| **Housing listings** | Cards with size, dates, price/mo, amenities (WiFi/AC/Parking/Pool/Gym), commute time ("8 min to Meta"), neighborhood, save (♡), verified badge, poster profile ("Celine B. @ Meta") | ✅ Live |
| **Filters** | Size (Studio/1BR/2BR/Shared), Area, Budget | ✅ Live |
| **Post a Listing** | Interns subleasing their place list it for peers | 🟡 CTA present — not persisted (no auth/write path yet) |
| **Neighborhoods** | Area guides per city (vibe, scores, transit notes, walkability) | ✅ Data-backed (Supabase/fallback) |
| **Transit** | How to get around / commute info | ✅ Data-backed |
| **Community** | Interest groups per city | ✅ Data-backed |
| **Save / favorites (♡)** | Bookmark a listing | 🟡 UI only — no `favorites` table yet |
| **Auth** | Log in / Sign up, profiles | 🔴 UI only — not implemented (no auth lib) |
| **Verification** | "✓ Verified" listings/posters for trust | 🟡 Badge shown; no verification flow yet |
| **Matching algorithm** | Suggest listings + roommates by budget, commute tolerance, social interests | 🔜 Planned |

---

## Primary User Flows

**A. Intern looking for housing**
1. Land → pick city → see stats (avg rent, listings, groups).
2. Filter by size / area / budget.
3. Browse verified listings (amenities, commute to their company, poster).
4. Save favorites → contact poster / "View ↗".
5. (Planned) Get suggested listings + potential roommates matched to their preferences.

**B. Intern subleasing their place**
1. "Post a Listing" → enter details (dates, price, size, amenities, neighborhood, company/commute).
2. Verify identity / intern status → listing gets ✓ badge.
3. Manage inquiries.

**C. Community**
1. Join their city's group → meet peers, ask questions, coordinate.

---

## Onboarding & Profile
The profile powers matching, community, and the verified "@ Company" trust signal — but collect it
**progressively**, not as one wall of questions at sign-up (a long form kills conversion, which
fights the sticky-Airbnb-habit problem). Ask the minimum to get value; enrich later.

**Collect data only where a feature uses it:**
| Data | Powers | When |
|---|---|---|
| School (`.edu`) email | Verification, community | Step 1 (required) |
| Internship city + company / work location | Commute times, community grouping, "@ Company" badge | Step 1 (required) |
| Dates, budget | Listing match + filtering | Step 1 (required) |
| Size / amenity prefs, commute tolerance | Sharper listing suggestions | Step 2 (prompted) |
| Hobbies, interests, lifestyle traits (cleanliness, sleep schedule, social level) | Roommate matching + community | Step 3 (opt-in) |

**Flow (3 light steps):**
1. **Required minimum** — verify email, name, city, company/work location, dates, budget → browse + personalized listings immediately.
2. **Prompted** — size/amenity prefs, commute tolerance → better matches.
3. **Opt-in** — hobbies/traits/lifestyle → roommate matching + community (only when they want it).

Let users **browse first and fill the profile as they go** — don't gate the whole app behind a form.

**Guardrails:**
- **Fair Housing:** match on **lifestyle compatibility** (cleanliness, sleep, noise, social level) —
  **never** protected classes (race, religion, national origin, etc.). "Traits" = lifestyle, not identity.
- **Privacy:** social fields are opt-in; users control profile visibility; be clear data is used for matching.

## Roles & Interfaces (Seeker vs. Poster)
**One account, role-tailored views** — not two apps. A user is often both (subletting their
school-year place *and* seeking in their intern city). Ask intent at onboarding
("looking / subleasing / both").
- **Seeker view:** browse + filter listings, saved, roommate matching, community, messages.
- **Poster / leaser view:** "My Listings" dashboard — create/manage listings, inquiries, payout status.

## Community & Group Chats — Discord (MVP)

**Why Discord & why now:** the community pillar solves the *isolating* half of the problem. Hosting
it on **Discord** (vs. building chat) is a zero-build way to validate community demand and — crucially
— it doubles as our **demand instrument** for the B2B pitch (members/activity per city = the "usage
data" employers asked for). Chosen over GroupMe/WhatsApp because we need *structured, role-gated,
moderatable* space (channels per city + topic), not a flat group chat.

### What it does
- Connects **verified interns in the same city** — housing leads, roommate-finding, local knowledge
  (transit/neighborhoods/safety), and social/meetups.
- Acts as **top of funnel**: verify → assigned to city → dropped into relevant channels → nudged to
  the website for listings/matching.
- Generates **demand signal + feedback** for the product and the employer pitch.

### Access funnel (verified-only)
```
join → sees only #verify → verify (.edu) → "Verified Intern" role
     → pick city → city role → that city's channels unlock
     → (optional) pick company → company role
```
Unverified members see nothing but #verify — the gate is the trust mechanism.

### Server structure
```
🏠 START HERE
   #welcome  #rules  #verify  #how-it-works  #announcements
🌐 COMMUNITY (all verified)
   #introductions  #general  #feedback  #success-stories  #scam-warnings
📍 <CITY>  (role-gated per city)
   #<city>-housing  #<city>-roommates  #<city>-transit  #<city>-neighborhoods
   #<city>-social  #<city>-meetups
```

### Roles
- **Verified Intern** — the access gate (unverified see only #verify).
- **City roles** (SF / NYC / ATL…) — auto-assigned; control channel visibility, keep it uncluttered.
- **Company roles** (optional) — cross-city connection (`@Meta`, `@McKinsey`).
- **Season/cohort role** (`Summer 2026`) — **load-bearing for seasonality** (below).
- **Mod / Admin.**

### Seasonality (important, easy to miss)
Internships are cohort-based — the community fully turns over each summer. Design for it:
- Tag every member with a **season role** (`Summer 2026`).
- **Archive or reset** city channels between cohorts so next summer's interns don't land in stale
  chatter. Keep an #alumni/archive for continuity.

### Bots & tooling
- **Verification:** MVP = off-the-shelf bot (Carl-bot gate + email-code) so you can launch today;
  upgrade to **website `.edu` OAuth** so site + Discord share one verification.
- **Reaction-roles** (Carl-bot) for city/company self-selection.
- **AutoMod + scam filtering:** auto-flag payment-request patterns (Zelle/Venmo/wire) and suspicious
  links — housing scams thrive in chat, so this mirrors the listings anti-fraud stance.
- **Welcome bot:** DM new members the verify steps.
- **Later:** a bot that cross-posts new verified website listings into `#<city>-housing`.

### Website ↔ Discord integration
- **Single verification:** `.edu` verify on the site → OAuth → grants both site `verified_student`
  and Discord "Verified Intern" role. Verify once.
- **Reinforcing loop:** Discord (community, cheap, sticky) feeds the website (listings, matching,
  later payments); the website feeds Discord (new listings surfaced in city channels).

### Metrics (this is the demand data)
Members per city, active users, messages, listings shared, roommate connections made → exactly the
usage evidence for the **3–6 month employer outreach** (Roadmap).

### Migration path
- **Now:** Discord (redirect), verified-invite-gated.
- **Later:** if community proves sticky, bring chat **on-site** (Supabase Realtime / Stream SDK) for
  verified-only rooms tied to profiles + full data ownership. Discord's moderation burden + off-platform
  data are the reasons to eventually in-source.
- **Future — AI concierge (chatbot):** help find listings, answer city/commute questions, guide
  onboarding. Not MVP.

## Data Model (from Supabase tables + `fallback-data.ts`)
- **cities** — id, name, state, emoji, lat, lng, avg_rent, color, listings (count), groups (count).
- **neighborhoods** — city_id, name, vibe, avg_rent, commute_score, safety_score, cost_score, transit_notes, best_for, buildings, walkability, highlight, color.
- **listings** — city_id, size, price/mo, amenities[], commute reference ("8 min to Meta"),
  neighborhood, photos[], external link. **Plus (to add):**
  - `owner_id` → FK to the verified student who posted it
  - `start_date`, `end_date` — **required** (defines the sublease window)
  - `lease_flexibility` — `sublease | month_to_month | fixed_dates`
  - `right_to_sublease` (bool) — attestation checkbox, required to post
  - `landlord_permission` (bool) — "my lease allows subletting / I have landlord permission"
  - `poster_verified` (derived from owner), `status` (`draft | published | flagged | removed`)
- **transport options** — per-city transit info (`TransportOption`).
- **interest_groups** — per-city community groups (`InterestGroup`).
- **Not yet modeled (planned):** `users`/profiles (with `verified_student`), `favorites` (user ↔
  listing). Needed to make Sign-up, Post-a-Listing, and Save persist. Enforce with RLS: only
  `verified_student` users can insert listings; only `owner_id` can edit/remove their own.

---

## Architecture & Tech (verified from the repo)
- **Frontend:** **Next.js 14** (App Router, `src/app/`), **React 18**, **TypeScript**. Light/dark mode; client-side city/listing filtering.
- **Backend / DB:** **Supabase** (`@supabase/supabase-js`). Tables: `cities`, `neighborhoods`, `listings`, transport options, interest groups.
- **Data layer w/ graceful fallback:** `lib/data.ts` fetches from Supabase but **falls back to hardcoded `lib/fallback-data.ts`** whenever Supabase isn't configured (`isSupabaseConfigured`). So the app renders even with no DB — the live site may currently be running on fallback data.
- **Seeding:** `scripts/seed-supabase.mjs` (`npm run seed`) upserts the fallback dataset into Supabase (requires `SUPABASE_SERVICE_ROLE_KEY`).
- **Maps:** Leaflet / react-leaflet (`components/ApartmentMap.jsx`).
- **Deploy:** Vercel (`vercel.json`, `next.config.mjs`).
- **Auth: not yet implemented.** No auth dependency in `package.json`; "Log in / Sign up" and likely "Post a Listing" appear to be UI-only. Supabase Auth is the natural fit to wire next.
- **Legacy:** root `intern-hub-mvp.jsx` / `internnest-mvp.jsx` are earlier single-file prototypes; the live app is `src/app/`.

---

## The Matching / Suggestion Algorithm (planned)
Match students to **listings** and **roommates** using early-user data:
- **Signals:** budget, commute tolerance (distance/time to their company), size preference, social interests, dates overlap, city/neighborhood.
- **v1 (rules):** score listings by budget fit + commute + dates overlap; surface top matches.
- **v2 (data-driven):** learn weights from what users save/contact; add roommate compatibility.

---

## Trust & Safety
- Verify intern status (school/company email or offer proof) → drives the ✓ badge.
- Real poster profiles tied to companies.
- Report/flag listings; don't intermediate payments (reduce fraud surface).

---

## Listings & Verification (MVP)
Scope for now: **month-to-month / sublease housing only.** Keep it simple — verify *people*, keep
listings *legit*, don't touch money.

### Simple listing template (post-a-listing form)
```
Title             e.g. "1BR near Meta, June–Aug"
City              (dropdown)
Neighborhood / area
Size              Studio / 1BR / 2BR / Shared
Available dates   start – end   REQUIRED (defines the sublease window)
Price / month
Amenities         a few only (WiFi, Furnished, Parking)
Commute note      "8 min to <company>"
Photos            required — the #1 trust signal
Posted by         verified student (auto-filled)
[✓] I confirm I have the right to sublease this place
[✓] My lease allows subletting / I have landlord permission
```

### Subleasing from others
Interns can sublease a place they **rent** (not just own) — that's the core supply. Because they're
offering someone else's roof, subleases get two extra guardrails at post time:
- **Required dates** (`start_date`/`end_date`) — no open-ended listings; the window is explicit.
- **Two attestations** — right-to-sublease **and** landlord-permission checkboxes (see form above).

### Verification (lightweight — no lease uploads yet)
- **Poster is a verified student** (`.edu` magic link) → ties every listing to a real identity.
- **Attestations** (right-to-sublease + landlord-permission) — checkboxes, no documents.
  Accountability without friction.
- ❌ **Lease/document submission:** intentionally **out of scope** — too complex for MVP. Add later,
  and only if fake-sublease trouble actually appears (then require a lease or landlord-consent upload).

### Preventing fake listings (MVP defenses)
The strategy is to **raise the cost of faking** and **remove the payoff**, not to over-verify:
1. **Verified-student posters only** — a fake listing is attached to an accountable real identity.
2. **Required photos + attestation** — friction and a name on the line.
3. **In-app messaging only** — don't expose phone/email until both opt in; scammers push people
   off-platform, which becomes the tell.
4. **MVP: we don't handle money — warn + flag off-platform payments.** Surface a "never pay before
   you verify; never pay by Zelle/Venmo/wire" warning, and auto-flag any off-platform payment request
   in messaging.
5. **Report / flag → quick manual review** for anything flagged.
6. **Later (only if needed):** duplicate-photo / reverse-image detection, too-good-pricing flags,
   new-account posting limits.

### Payments & money flow — *Post-MVP (deferred)*
Not building payments yet. When we do, the principle is: **all money through a trusted processor /
escrow — never personal transfers.**
- **Processor: Stripe (Connect) with an escrow-style hold** — funds held until move-in/confirmation,
  then released to the poster; chargebacks/disputes handled by the processor.
- **Why a processor, not us:** it handles PCI + money movement, so InternNest isn't a money
  transmitter itself.
- Until then, InternNest connects the parties and **explicitly warns against off-platform payments.**

## Success Metrics
- Interns who find + secure housing through the platform (activation → conversion).
- Listings posted per city; % verified.
- Roommate/community connections made.
- Retention across a summer cohort; NPS / qualitative feedback.

---

## Roadmap — What's Next for InternNest
*From concept to company — a phased plan for growth.*

### 0–3 Months · Launch & Validate
- Recruit **15–20 interns** heading to major cities this summer to test the live platform.
- Gather user feedback on listings quality, roommate matching, and onboarding.
- Refine the matching algorithm using real user preference data (budget, commute, social interests).
- Document demand signals to build the case for employer outreach.

### 3–6 Months · Employer Outreach
- Return to the **30 companies** we interviewed with real usage data and demand metrics.
- Pitch the employer subscription tier — position as an intern retention & experience tool.
- Pilot with **2–3 companies** willing to subsidize intern housing access.
- Expand listing inventory in at least 3 target cities (**NYC, SF, ATL**).

### 6–9 Months · Scale & Revenue
- Formalize B2B employer subscription contracts and an onboarding pipeline.
- Launch the apartment finder's-fee revenue stream with a verified landlord network.
- Expand to **5+ major internship cities** with curated, verified listings.
- Explore featured-listing ads and relocation analytics as additional revenue streams.

---

## Open Questions / Risks
- **Supply cold-start:** listings need posters — how do we seed the first city's inventory?
- **Trust:** how rigorous is verification, and how do we prevent scams without handling payments?
- **Which city first?** Focus one intern-dense city to prove the loop before expanding.
- **Legality:** subleasing rules vary; do we advise users or stay neutral?
- **Tech stack confirmation** (backend, auth, DB) to plan the build.
