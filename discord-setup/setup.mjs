// InternNest — Discord server builder (idempotent; safe to re-run to add cities).
// Setup instructions: see README.md in this folder.
//
//   npm i discord.js
//   DISCORD_TOKEN=xxx GUILD_ID=xxx node setup.mjs
//
// Creates roles, categories, channels, permission gating, and an AutoMod scam guard.

import {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
  AutoModerationRuleTriggerType,
  AutoModerationRuleEventType,
  AutoModerationActionType,
} from 'discord.js';

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !GUILD_ID) {
  console.error('Missing env. Run:  DISCORD_TOKEN=xxx GUILD_ID=xxx node setup.mjs');
  process.exit(1);
}

// ─── CONFIG — edit to add cities / channels ──────────────────────────────────
const SEASON = 'Summer 2026';
const CITIES = [
  { key: 'sf', name: 'San Francisco' },
  { key: 'nyc', name: 'New York' },
  { key: 'atl', name: 'Atlanta' },
];
const CITY_CHANNELS = ['housing', 'roommates', 'transit', 'neighborhoods', 'social'];
const SCAM_KEYWORDS = ['zelle', 'venmo', 'cashapp', 'cash app', 'wire transfer', 'western union'];
// ─────────────────────────────────────────────────────────────────────────────

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.roles.fetch();
    await guild.channels.fetch();
    const everyone = guild.roles.everyone;

    const ensureRole = async (name, opts = {}) => {
      let role = guild.roles.cache.find((r) => r.name === name);
      if (!role) {
        role = await guild.roles.create({ name, mentionable: true, ...opts });
        console.log(`+ role: ${name}`);
      }
      return role;
    };
    const ensureCategory = async (name, permissionOverwrites) => {
      let cat = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildCategory && c.name === name,
      );
      if (!cat) {
        cat = await guild.channels.create({ name, type: ChannelType.GuildCategory, permissionOverwrites });
        console.log(`+ category: ${name}`);
      }
      return cat;
    };
    const ensureText = async (name, parent) => {
      let ch = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildText && c.name === name && c.parentId === parent.id,
      );
      if (!ch) {
        ch = await guild.channels.create({ name, type: ChannelType.GuildText, parent: parent.id });
        console.log(`  + #${name}`);
      }
      return ch;
    };

    // Roles
    await ensureRole('Admin', { permissions: [PermissionFlagsBits.Administrator], hoist: true, color: 0xe74c3c });
    await ensureRole('Mod', {
      permissions: [
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.KickMembers,
        PermissionFlagsBits.ModerateMembers,
      ],
      hoist: true,
      color: 0x3498db,
    });
    const verified = await ensureRole('Verified Intern', { hoist: true, color: 0x2ecc71 });
    await ensureRole(SEASON, { color: 0x9b59b6 });
    const cityRoles = {};
    for (const c of CITIES) cityRoles[c.key] = await ensureRole(c.name, { color: 0x95a5a6 });

    // START HERE — everyone can see (this is where they verify)
    const startCat = await ensureCategory('🏠 START HERE', [
      { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel] },
    ]);
    for (const n of ['welcome', 'rules', 'verify', 'how-it-works', 'announcements']) {
      await ensureText(n, startCat);
    }

    // COMMUNITY — verified only
    const commCat = await ensureCategory('🌐 COMMUNITY', [
      { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: verified.id, allow: [PermissionFlagsBits.ViewChannel] },
    ]);
    for (const n of ['introductions', 'general', 'feedback', 'scam-warnings']) {
      await ensureText(n, commCat);
    }

    // Per-city — gated by city role (assign these only in a verified-only channel)
    for (const c of CITIES) {
      const cat = await ensureCategory(`📍 ${c.name}`, [
        { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: cityRoles[c.key].id, allow: [PermissionFlagsBits.ViewChannel] },
      ]);
      for (const sub of CITY_CHANNELS) await ensureText(`${c.key}-${sub}`, cat);
    }

    // AutoMod — flag off-platform payment / scam terms
    try {
      const rules = await guild.autoModerationRules.fetch();
      if (!rules.find((r) => r.name === 'InternNest scam guard')) {
        await guild.autoModerationRules.create({
          name: 'InternNest scam guard',
          eventType: AutoModerationRuleEventType.MessageSend,
          triggerType: AutoModerationRuleTriggerType.Keyword,
          triggerMetadata: { keywordFilter: SCAM_KEYWORDS },
          actions: [{ type: AutoModerationActionType.BlockMessage }],
          enabled: true,
        });
        console.log('+ AutoMod: scam guard');
      }
    } catch (e) {
      console.warn('AutoMod skipped (add manually in Server Settings → AutoMod):', e.message);
    }

    console.log('\n✅ Structure ready. Next (manual): add Carl-bot in #verify for the verify gate,');
    console.log('   and city reaction-roles in a VERIFIED-ONLY channel. See README.md.');
  } catch (err) {
    console.error('Setup failed:', err);
  } finally {
    client.destroy();
  }
});

client.login(TOKEN);
