"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useState, useEffect, useRef } from "react";
import { getClientSession } from "../lib/auth";
import { getProfile, saveProfile, UserProfile } from "../lib/profile";
import { Upload, Camera, Save, Lock, User } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = getClientSession();
    if (session) {
      let p = getProfile(session.username);
      if (!p) {
        // Init profile from session if it doesn't exist in localstorage
        p = {
          username: session.username,
          name: session.name,
          email: session.email,
        };
      }
      setProfile(p);
      setPreviewAvatar(p.avatar || null);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewAvatar(base64);
        if (profile) {
          setProfile({ ...profile, avatar: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (profile) {
      setSaving(true);
      saveProfile(profile);
      window.dispatchEvent(new Event("skylink_profile_update"));
      setMessage("Profile saved successfully.");
      setTimeout(() => {
        setMessage("");
        setSaving(false);
      }, 2000);
    }
  };

  if (!profile) return <DashboardLayout><div className="flex h-full items-center justify-center">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Profile Settings</h1>
            <p className="text-slate-500 mt-1">Manage your personal information and account settings.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/30 active:scale-95 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Avatar & Password */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
              <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
                {previewAvatar ? (
                  <img src={previewAvatar} className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 shadow-md" alt="Profile" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-slate-50 shadow-md flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              <h3 className="font-bold text-slate-800 text-lg text-center">{profile.name}</h3>
              <p className="text-slate-500 text-sm font-medium text-center">{profile.position || "Administrator"}</p>
              
              <button onClick={() => fileInputRef.current?.click()} className="mt-5 flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-colors">
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
            </div>

            {/* Password Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                Security
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Confirm Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" />
                </div>
                <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm mt-2">
                  Update Password
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Personal Info */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h3 className="font-bold text-slate-800 mb-6 text-lg border-b border-slate-100 pb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
                  <input 
                    type="text" 
                    value={profile.username}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 font-medium cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    placeholder="+62 812 3456 7890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Position / Title</label>
                  <input 
                    type="text" 
                    value={profile.position || ""}
                    onChange={(e) => setProfile({...profile, position: e.target.value})}
                    placeholder="e.g. Logistics Manager"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
