import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/common/KidsBadge';
import { User, Mail, Shield, Save, Check } from 'lucide-react';

export const Profile = () => {
  const { profile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <img
            src={profile?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Profile'}
            alt="Avatar"
            className="w-20 h-20 rounded-full bg-slate-100 border-2 border-brand-300 p-1"
          />
          <div>
            <h1 className="text-xl font-black text-slate-800">{profile?.full_name}</h1>
            <p className="text-xs text-slate-500">{profile?.email}</p>
            <div className="mt-2">
              <RoleBadge role={profile?.role} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email (Cố định)</label>
            <input
              type="text"
              disabled
              value={profile?.email || ''}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Đã Lưu Thay Đổi!' : 'Lưu Thay Đổi'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
