'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV = [
  { href: '/converter', label: 'Converter' },
  { href: '/features', label: 'Features' },
  { href: '/supported-formats', label: 'Formats' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' }
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-ink-900">
          <Logo />
          <span className="text-lg tracking-tight">PixelMorph</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-ink-700 hover:text-ink-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/converter" className="btn-primary ml-2">
            Open Converter
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg ring-1 ring-gray-200 text-ink-900"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            {open ? (
              <path
                fill="currentColor"
                d="M6.4 4.99 12 10.59l5.6-5.6 1.41 1.41L13.41 12l5.6 5.6-1.41 1.41L12 13.41l-5.6 5.6-1.41-1.41L10.59 12l-5.6-5.6z"
              />
            ) : (
              <path
                fill="currentColor"
                d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container-tight py-3 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-3 rounded-lg text-base font-medium text-ink-900 hover:bg-gray-100"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/converter" className="btn-primary mt-2 w-full">
              Open Converter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-soft">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 7l4-3 4 3 4-3 4 3v10l-4 3-4-3-4 3-4-3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
