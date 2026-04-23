// Catalogue of supported conversions. Used by /supported-formats and the home
// page, and by internal linking for SEO.

const FORMATS = ['HEIC', 'JPG', 'PNG', 'WEBP'];

const ROUTES = [
  {
    from: 'HEIC',
    to: 'JPG',
    slug: 'heic-to-jpg',
    title: 'HEIC to JPG Converter',
    blurb:
      'Convert iPhone HEIC photos to universally supported JPG images in seconds, no app installs required.'
  },
  {
    from: 'HEIC',
    to: 'PNG',
    slug: 'heic-to-png',
    title: 'HEIC to PNG Converter',
    blurb: 'Turn HEIC photos into lossless PNG files with full quality.'
  },
  {
    from: 'JPG',
    to: 'PNG',
    slug: 'jpg-to-png',
    title: 'JPG to PNG Converter',
    blurb: 'Convert JPG to PNG online with high quality and transparency-ready output.'
  },
  {
    from: 'PNG',
    to: 'JPG',
    slug: 'png-to-jpg',
    title: 'PNG to JPG Converter',
    blurb: 'Compress PNG files into smaller, web-friendly JPG images.'
  },
  {
    from: 'JPG',
    to: 'WEBP',
    slug: 'jpg-to-webp',
    title: 'JPG to WEBP Converter',
    blurb: 'Convert JPG to modern WEBP for faster page loads and smaller file sizes.'
  },
  {
    from: 'WEBP',
    to: 'JPG',
    slug: 'webp-to-jpg',
    title: 'WEBP to JPG Converter',
    blurb: 'Convert WEBP images to JPG for maximum compatibility across devices and apps.'
  },
  {
    from: 'PNG',
    to: 'WEBP',
    slug: 'png-to-webp',
    title: 'PNG to WEBP Converter',
    blurb: 'Convert PNG to WEBP for faster, lighter images that still look great.'
  },
  {
    from: 'WEBP',
    to: 'PNG',
    slug: 'webp-to-png',
    title: 'WEBP to PNG Converter',
    blurb: 'Convert WEBP back to PNG with transparency preserved.'
  }
];

module.exports = { FORMATS, ROUTES };
