# Supabase Setup

The app runs on fallback data + stubbed auth with no config. To enable real accounts,
listings, and uploads, create a Supabase project and set `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Auth (.edu verification)
- Uses **magic-link OTP** (`signInWithOtp`) — passwordless. Signup collects profile fields into
  `user_metadata`.
- In Supabase → Auth → Providers → Email: enable, and (optional) restrict to `.edu` via a
  domain allowlist / a DB trigger. The app already validates `.edu` client-side.

## Tables

### `listings`
| column | type |
|---|---|
| id | uuid (pk, default gen_random_uuid()) |
| owner_id | uuid (fk → auth.users) |
| city_id | text |
| title | text |
| neighborhood | text |
| type | text  (Studio / 1 Bedroom / …) |
| price | int |
| start_date | date |
| end_date | date |
| lease_type | text (sublease / month_to_month) |
| amenities | text[] |
| right_to_sublease | bool |
| landlord_permission | bool |
| poster_type | text (`intern` / `landlord`) |
| landlord_name | text (landlord listings only) |
| landlord_contact | text (landlord listings only) |
| lease_doc | text (storage path) |
| photos | text[] (storage paths) |
| status | text (pending / published / removed) default 'pending' |
| created_at | timestamptz default now() |

**RLS:** enable, then:
- `insert`: allow when `auth.uid() = owner_id` (only verified, logged-in users post).
- `select`: allow when `status = 'published'` (public sees only reviewed listings).
- `update/delete`: allow when `auth.uid() = owner_id`.

## Storage buckets
- **`listing-photos`** — public read (photos shown on cards).
- **`leases`** — **private** (proof docs; only owner + admins).

## Wiring the read path (next step)
`lib/data.ts` `getListings(cityId)` already reads the `listings` table when Supabase is configured,
falling back to (now empty) fallback data otherwise. Once the table has `published` rows, they show
up in the Housing tab automatically.
