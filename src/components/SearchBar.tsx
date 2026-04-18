'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch results
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data.results || []);
          setSelectedIndex(0);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex].url);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container transition-all rounded-full border border-outline-variant/10 text-on-surface-variant group sm:w-64"
      >
        <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">search</span>
        <span className="text-sm font-medium opacity-60">Search anything...</span>
        <kbd className="ml-auto text-[10px] bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant/20 font-sans hidden sm:block">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-md bg-black/20 animate-in fade-in duration-200">
      <div 
        ref={searchRef}
        className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300"
      >
        <div className="flex items-center px-6 py-5 border-b border-outline-variant/10">
          <span className="material-symbols-outlined text-primary text-2xl">search</span>
          <input 
            autoFocus
            type="text"
            placeholder="Search products, pets, or vets..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-lg font-medium text-on-surface placeholder:text-on-surface-variant/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 hover:text-on-surface transition-colors"
          >
            Esc to close
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-on-surface-variant font-medium">Scouring the database...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              {['product', 'pet', 'vet'].map(type => {
                const filtered = results.filter(r => r.type === type);
                if (filtered.length === 0) return null;
                return (
                  <div key={type} className="space-y-2">
                    <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{type}s</h3>
                    <div className="space-y-1">
                      {filtered.map((item, idx) => {
                        const globalIndex = results.indexOf(item);
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelect(item.url)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${
                              selectedIndex === globalIndex ? 'bg-primary/10 scale-[1.01]' : 'hover:bg-surface-container-low'
                            }`}
                          >
                            <div className="w-12 h-12 rounded-xl border border-outline-variant/10 overflow-hidden bg-white shrink-0 shadow-sm">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-on-surface truncate">{item.title}</h4>
                              <p className="text-xs text-on-surface-variant truncate">{item.subtitle}</p>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100">chevron_right</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-outline-variant/30 mb-4">search_off</span>
              <p className="text-on-surface-variant font-medium">No matches found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="py-12 px-4 space-y-8">
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Royal Canin', 'Persian', 'Cardiology', 'ZenBowl'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-4 py-2 bg-surface-container-low hover:bg-primary/10 hover:text-primary transition-all rounded-full text-xs font-bold border border-outline-variant/10"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
               </div>
               
               <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-tertiary/5 rounded-2xl border border-tertiary/10 text-center space-y-2">
                     <span className="material-symbols-outlined text-tertiary">inventory_2</span>
                     <p className="text-[10px] font-black uppercase tracking-wider text-tertiary">2k+ Products</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center space-y-2">
                     <span className="material-symbols-outlined text-primary">pets</span>
                     <p className="text-[10px] font-black uppercase tracking-wider text-primary">500+ Pets</p>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10 text-center space-y-2">
                     <span className="material-symbols-outlined text-secondary">medical_services</span>
                     <p className="text-[10px] font-black uppercase tracking-wider text-secondary">100+ Vets</p>
                  </div>
               </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-surface-container border-t border-outline-variant/10 flex items-center justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6">
           <div className="flex gap-4">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">keyboard_return</span> Select</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">keyboard_arrow_down</span> Navigate</span>
           </div>
           <span>Close with ESC</span>
        </div>
      </div>
      
      {/* Click outside backdrop shortcut */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={() => setIsOpen(false)}
      ></div>
    </div>
  );
}
