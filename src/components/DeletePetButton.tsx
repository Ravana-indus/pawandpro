'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

export function DeletePetButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="inline-flex text-error bg-error/5 hover:bg-error/10 px-4 py-3 rounded-xl font-bold transition-colors border border-error/20 items-center justify-center gap-2 disabled:opacity-50"
      onClick={(e) => {
        if (!confirm('Are you sure you want to delete this pet? This cannot be undone.')) {
          e.preventDefault();
        }
      }}
    >
      <span className="material-symbols-outlined text-sm pt-0.5">delete</span> 
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
