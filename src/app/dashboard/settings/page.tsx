import React from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function SettingsPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <DashboardSidebar />
      <main className="flex-1 space-y-8">
        <header className="mb-8">
          <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-2">Account Settings</h1>
          <p className="text-on-surface-variant text-lg">Manage your personal info, notifications, and security preferences.</p>
        </header>

        {/* Personal Information */}
        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none -z-10 transition-transform group-hover:scale-110"></div>
          
          <h2 className="text-2xl font-bold mb-8 font-headline text-on-surface flex items-center border-b border-outline-variant/10 pb-4 gap-2">
            <span className="material-symbols-outlined text-primary">person</span> Personal Information
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-8 border-b border-outline-variant/10">
              <div className="w-24 h-24 rounded-2xl bg-surface-container overflow-hidden shadow-sm border border-outline-variant/10 relative group-hover:shadow-md transition-shadow">
                 <img
                    alt="User avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiTzfB4yrzToeWJXGIq0itmABZWbBGI_zjWPXuxOjAUn8mKTyN-NmsW8RFdJyAT8HasqV8guTKb_Px6NYz1sfstGC-Zb0js4G2djCGDjc3gxnIvakOCmnOEpLTr5tkHDliBa7VT7wMFaSII4H2qb5TM7vlA9hU0AOBlHjEeAAzgj9xsI_kBKfXnueHRANQ1Epx-5wH2EH847GP1oLqElO2jjYwM3baPqbYs2DxMt5PwN4Fr34-hjExYq66tlMTAaUO9jf8ebGnD6g"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="material-symbols-outlined text-white">photo_camera</span>
                  </div>
              </div>
              <div>
                 <button className="bg-surface-container-highest px-6 py-2.5 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-dim transition-colors shadow-sm mb-2">
                   Upload New Photo
                 </button>
                 <p className="text-xs text-on-surface-variant font-medium">JPEG, GIF or PNG. Max size of 5MB.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">First Name</label>
                 <input type="text" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-on-surface" defaultValue="Sarah" />
               </div>
               <div>
                 <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Last Name</label>
                 <input type="text" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-on-surface" defaultValue="Jenkins" />
               </div>
            </div>
            <div>
               <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 bg-surface-container-lowest w-fit z-10 px-1 relative top-2 left-3">Email Address</label>
               <input type="email" className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3.5 text-on-surface-variant opacity-70 cursor-not-allowed font-medium" defaultValue="sarah.jenkins@example.com" disabled />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
             <button className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md hover:shadow-primary/20 active:scale-95">
               Save Changes
             </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm mb-8">
           <h2 className="text-2xl font-bold font-headline text-on-surface border-b border-outline-variant/10 pb-4 mb-6">Notifications</h2>
           <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                 <div>
                    <h3 className="font-bold text-on-surface">Order Updates</h3>
                    <p className="text-sm text-on-surface-variant mt-1">Get emails and SMS for order processing and delivery tracing.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                 </label>
              </div>
              <div className="flex items-start justify-between gap-4">
                 <div>
                    <h3 className="font-bold text-on-surface">Vaccination Reminders</h3>
                    <p className="text-sm text-on-surface-variant mt-1">Receive alerts when your pets' vaccinations are due.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                 </label>
              </div>
              <div className="flex items-start justify-between gap-4">
                 <div>
                    <h3 className="font-bold text-on-surface">Promotional Emails</h3>
                    <p className="text-sm text-on-surface-variant mt-1">Receive early access to sales and new product launches.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                 </label>
              </div>
           </div>
        </section>

        {/* Security */}
        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
           <h2 className="text-2xl font-bold font-headline text-on-surface border-b border-outline-variant/10 pb-4 mb-6">Security</h2>
           <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                 <div>
                    <h3 className="font-bold text-on-surface">Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-on-surface-variant mt-1">Protect your account with an extra layer of security.</p>
                 </div>
                 <button className="px-4 py-2 bg-surface-container-low border border-outline-variant/20 font-bold text-sm text-on-surface rounded-lg hover:bg-surface-container transition-colors">
                    Enable
                 </button>
              </div>
              <div className="flex items-start justify-between gap-4">
                 <div>
                    <h3 className="font-bold text-on-surface">Password</h3>
                    <p className="text-sm text-on-surface-variant mt-1">Last changed 3 months ago.</p>
                 </div>
                 <button className="px-4 py-2 bg-surface-container-low border border-outline-variant/20 font-bold text-sm text-on-surface rounded-lg hover:bg-surface-container transition-colors">
                    Change
                 </button>
              </div>
              <div className="pt-4 border-t border-error/20">
                 <h3 className="font-bold text-error mb-2">Danger Zone</h3>
                 <p className="text-sm text-on-surface-variant mb-4">Permanently delete your account and all associated data. This action is irreversible.</p>
                 <button className="text-sm font-bold text-error hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">delete_forever</span> Delete Account
                 </button>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
}
