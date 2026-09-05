import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ActivityLog } from '../../../types/admin';
import { ShieldCheck, KeyRound, UserCheck, Activity, Save } from 'lucide-react';

export function SecurityView() {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    api.getActivityLogs()
      .then(res => setLogs(res.logs))
      .catch(() => {});
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.updateAdminProfile({
        name: profileName,
        email: profileEmail
      });
      success('Admin profile updated successfully');
      refreshUser();
    } catch (err: any) {
      error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('New password and confirmation do not match');
      return;
    }
    if (newPassword.length < 6) {
      error('New password must be at least 6 characters long');
      return;
    }

    setSavingPassword(true);
    try {
      await api.updateAdminProfile({
        currentPassword,
        newPassword
      });
      success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      refreshUser();
    } catch (err: any) {
      error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
            Security & Account Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage admin credentials, update access passwords, and review security audit logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-slate-800">
            <UserCheck size={18} />
            <h2 className="text-sm font-semibold text-slate-100">Administrator Profile</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Login Email
              </label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Account Role:</span>
                <span className="font-semibold text-slate-200 uppercase font-mono">{user?.role || 'admin'}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Session:</span>
                <span className="font-mono text-slate-300">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                <Save size={14} />
                <span>Save Profile Info</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-slate-800">
            <KeyRound size={18} />
            <h2 className="text-sm font-semibold text-slate-100">Update Access Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                New Password (Minimum 6 Characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                <ShieldCheck size={14} />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Audit Activity Logs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-slate-800">
          <Activity size={18} />
          <h2 className="text-sm font-semibold text-slate-100">Audit Trail & Security Logs</h2>
        </div>

        <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No logs recorded.</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-200">{log.description}</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-mono">{log.action}</span>
                    <span>•</span>
                    <span>{log.userEmail}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono self-start sm:self-auto">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
