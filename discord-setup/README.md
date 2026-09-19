# InternNest — Discord Setup

`setup.mjs` builds a base InternNest server: roles, categories, channels, permission gating, and an
AutoMod scam guard. **Idempotent** — re-run it after editing the `CITIES` array to add cities.

## What it creates
- **Roles:** Admin, Mod, Verified Intern, Summer 2026, + one per city (San Francisco, New York, Atlanta).
- **🏠 START HERE** (everyone): `#welcome #rules #verify #how-it-works #announcements`
- **🌐 COMMUNITY** (Verified Intern only): `#introductions #general #feedback #scam-warnings`
- **📍 per-city** (city role only): `#<city>-housing #-roommates #-transit #-neighborhoods #-social`
- **AutoMod:** blocks messages containing off-platform payment terms (zelle, venmo, cashapp, wire…).

## One-time setup
1. **Create a server** in Discord (empty). Enable Developer Mode (User Settings → Advanced), then
   right-click the server → **Copy Server ID** → that's your `GUILD_ID`.
2. **Create a bot:** https://discord.com/developers/applications → New Application → **Bot** →
   **Reset Token** → copy it → that's your `DISCORD_TOKEN`. (No privileged intents needed.)
3. **Invite the bot with admin:** OAuth2 → URL Generator → scope **`bot`** → permission
   **Administrator** → open the URL → add it to your server.
4. Install + run:
   ```bash
   cd internnest-discord-setup
   npm init -y && npm i discord.js
   DISCORD_TOKEN=your-token GUILD_ID=your-server-id node setup.mjs
   ```

## After running (manual — the bot can't do these)
- **Verify gate:** add **Carl-bot** (https://carl.gg) and set a verification button/captcha in
  `#verify` that grants the **Verified Intern** role. (True `.edu` email checking = later upgrade via
  the website OAuth.)
- **City self-select:** add Carl-bot **reaction-roles** (🌉→San Francisco, 🗽→New York, 🍑→Atlanta)
  **in a Verified-Intern-only channel**, so only verified people can unlock a city.

## To add a city later
Edit the `CITIES` array in `setup.mjs` and re-run — existing roles/channels are skipped, new ones created.
