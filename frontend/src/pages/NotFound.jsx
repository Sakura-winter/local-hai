import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center py-16 px-4 bg-background">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl border border-surface-variant p-8 sm:p-10 text-center flex flex-col items-center shadow-xs">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[44px]">radar</span>
        </div>

        <span className="px-3 py-1 rounded-full bg-error-container/40 text-error text-xs font-bold uppercase tracking-wider mb-2">
          404 • Multiverse Breach
        </span>

        <h1 className="font-headline-lg text-2xl font-bold text-on-surface mb-2">
          This page got lost in the multiverse.
        </h1>

        <p className="font-body-md text-sm text-secondary mb-6">
          Even Spider-Man's web couldn't catch this URL. Let's get you back to your friendly neighbourhood kirana.
        </p>

        <Link
          to="/"
          className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Swing back home</span>
        </Link>
      </div>
    </div>
  );
}

