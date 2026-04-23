// Central place for SEO + branding constants. Update SITE_URL before going live.

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://pixelmorph.net';

const SITE_NAME = 'PixelMorph';
const SITE_TAGLINE = 'Premium online image converter, HEIC, JPG, PNG & WEBP';
const SITE_DESCRIPTION =
  'PixelMorph is a fast, secure online image converter. Convert HEIC to JPG, HEIC to PNG, JPG to PNG, PNG to WEBP, WEBP to JPG and more, in batch, right in your browser.';

const TWITTER_HANDLE = '@pixelmorphapp';

module.exports = {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  TWITTER_HANDLE
};
