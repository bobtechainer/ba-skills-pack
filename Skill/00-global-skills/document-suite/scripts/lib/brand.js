/**
 * Brand tokens for domain-docs skill — now brand-agnostic.
 *
 * Brand/vendor is CONTEXT, not skill code. Loaded from
 *   `_shared/brands/<slug>.json` (primary brand, left-side cover logo)
 * and optionally
 *   `brand-context/clients/<slug>/*` (client/bank, right-side cover logo)
 *
 * Pick brand via env var `BANKING_DOCS_BRAND=<slug>` or CLI flag handled
 * upstream (see scripts/build_doc.js). Defaults to the first available
 * brand config or falls back to hardcoded neutral tokens.
 *
 * Exports the same shape as before (COLORS, FONT, PAGE, TABLE_TOTAL_WIDTH,
 * LOGOS, BRAND_DIR) so downstream callers (generate_docx.js, cover.js)
 * don't need to change.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { convertInchesToTwip } = require('docx');

// ── Locate _shared/brands/ ──────────────────────────────────
// Skill dir: domain-docs/scripts/lib/brand.js
// Up 4: domain-docs → skills → techainer-agents → base
// Then down into skills/_shared/brands/
const SKILLS_ROOT = path.resolve(__dirname, '..', '..', '..');
const BRANDS_DIR = path.join(SKILLS_ROOT, '_shared', 'brands');

// Legacy fallback dir (in-skill, pre-refactor). Still supported.
const LEGACY_BRAND_DIR = path.resolve(__dirname, '..', '..', 'brand');

function loadBrandConfig(slug) {
  const configPath = path.join(BRANDS_DIR, `${slug}.json`);
  if (!fs.existsSync(configPath)) {
    console.error(`[brand] Config not found: ${configPath}`);
    console.error(`[brand] Available: ${fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_')).join(', ')}`);
    throw new Error(`Brand config missing for slug="${slug}"`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function resolveLogoPath(configLogo, brandsDir) {
  // Config stores "./assets/foo.png" relative to brands dir
  if (!configLogo) return null;
  if (path.isAbsolute(configLogo)) return configLogo;
  return path.resolve(brandsDir, configLogo);
}

// ── Pick active brand ────────────────────────────────────────
const ACTIVE_SLUG = process.env.BANKING_DOCS_BRAND || 'techainer';
let active = null;
try {
  active = loadBrandConfig(ACTIVE_SLUG);
} catch (err) {
  console.warn(`[brand] Falling back to hardcoded legacy tokens: ${err.message}`);
  active = null;
}

// ── Build exported constants ─────────────────────────────────
// Prefer active brand JSON; fall back to legacy hardcoded if JSON missing.
const COLORS = {
  PRIMARY: active?.colors?.primary || '0B3D7F',
  SECONDARY: active?.colors?.secondary || 'E85A1A',
  ACCENT: active?.colors?.accent || '1B9AAA',
  LIGHT: active?.colors?.light || '2C7BE5',

  // Body text — fixed across brands (legible defaults)
  TEXT_BODY: '1F2937',
  TEXT_LIGHT: '6B7280',

  // Client (right-side) accent — filled by brand-context sidecar at build time
  // Generic keys; overridden by _client/colors.json when --client is passed
  CLIENT_PRIMARY: 'E30613',
  CLIENT_ACCENT: 'FF6B1A',

  // Neutrals
  WHITE: 'FFFFFF',
  TABLE_HEADER: 'E8F0FE',
  TABLE_ALT: 'F6F8FA',
  TABLE_BORDER: 'D0D7DE',
  CONFIDENTIAL: '8B949E',

  // Status
  SUCCESS: '3FB950',
  WARN: 'F59E0B',
  DANGER: 'DC2626',
};

const FONT = {
  MAIN: 'Arial',
  MONO: 'Courier New',
  SIZE_BODY: 22,
  SIZE_SMALL: 20,
  SIZE_H1: 36,
  SIZE_H2: 28,
  SIZE_H3: 24,
  SIZE_H4: 22,
};

const PAGE = {
  WIDTH: convertInchesToTwip(8.27),
  HEIGHT: convertInchesToTwip(11.69),
  MARGIN: {
    top: convertInchesToTwip(1),
    bottom: convertInchesToTwip(0.9),
    left: convertInchesToTwip(1),
    right: convertInchesToTwip(1),
  },
  CONTENT_WIDTH: convertInchesToTwip(6.27),
};

const TABLE_TOTAL_WIDTH = PAGE.CONTENT_WIDTH - 100;

// ── Logos ────────────────────────────────────────────────────
// VENDOR: left-side cover logo — loaded from active brand config.
// CLIENT: right-side cover logo — null by default, set by --client flag
//         or brand-context sidecar at build time.
const activeLogo = resolveLogoPath(active?.logo, BRANDS_DIR);

const LOGOS = {
  // Left-side cover logo: the active VENDOR BRAND.
  VENDOR: activeLogo && fs.existsSync(activeLogo) ? activeLogo : null,

  // Right-side cover logo: the CLIENT. Null = no client logo on cover.
  // Overridden by brand-context sidecar (_client/logo.png) at build time.
  CLIENT: null,
};

// ── Metadata (exposed so callers can render brand-aware text) ─
const META = {
  slug: active?.slug || 'generic',
  name: active?.name || '',
  name_short: active?.name_short || '',
  tagline: active?.tagline || '',
  footer_text: active?.footer_text || 'Confidential.',
  confidentiality_stamp: active?.confidentiality_stamp || 'CONFIDENTIAL',
  approval_roles: active?.approval_roles || ['Prepared by', 'Reviewed by', 'Approved by'],
  contact: active?.contact || {},
  locale: active?.locale || 'vi-VN',
};


module.exports = {
  COLORS, FONT, PAGE, TABLE_TOTAL_WIDTH, LOGOS,
  BRAND_DIR: LEGACY_BRAND_DIR,   // back-compat for legacy callers
  BRANDS_DIR,
  META,
  // Helpers for advanced use
  loadBrandConfig,
  resolveLogoPath,
};
