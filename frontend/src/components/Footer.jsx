import React from 'react';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-surface-variant py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
          </div>
          <span className="font-headline-sm text-sm font-bold text-primary">Local Hai</span>
          <span className="text-secondary text-xs">• Zero Dark-Store Community Marketplace</span>
        </div>

        <p className="font-body-sm text-xs text-secondary max-w-md">
          With great shops comes great convenience. Made with love, a little web, and a lot of neighbourhood pride.
        </p>

        <div className="flex items-center gap-4 text-xs text-secondary">
          <span className="flex items-center gap-1 text-tertiary font-medium">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            100% Direct Kirana Powered
          </span>
        </div>
      </div>
    </footer>
  );
}

