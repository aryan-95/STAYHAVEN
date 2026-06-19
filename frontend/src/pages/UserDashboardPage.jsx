import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiLock, FiUpload } from 'react-icons/fi';

export default function UserDashboardPage() {
  const { user, updateUser, becomeHost } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/profile', profile);
      updateUser(res.data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      await api.put('/users/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleBecomeHost = async () => {
    try {
      await becomeHost();
      toast.success('You are now a host! 🏠');
      navigate('/host/dashboard');
    } catch { toast.error('Something went wrong'); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const res = await api.post('/upload/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(p => ({ ...p, avatar: res.data.url }));
      toast.success('Photo updated');
    } catch { toast.error('Upload failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-8 max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">My Account</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
          {['profile', 'security'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="space-y-6">
            {/* Avatar + name */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-brand flex items-center justify-center flex-shrink-0">
                    {profile.avatar
                      ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                      : <span className="text-white text-3xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 shadow-sm">
                    <FiUpload className="w-3.5 h-3.5 text-gray-600" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                      <p className="text-sm text-gray-500 capitalize">{user?.email} · {user?.role}</p>
                    </div>
                    <button onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                      disabled={saving}
                      className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                      {editing ? <><FiSave className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}</> : <><FiEdit2 className="w-4 h-4" />Edit</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    disabled={!editing} className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input value={user?.email} disabled className="input-field pl-10 bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    disabled={!editing} placeholder="+1 555 000 0000" className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  disabled={!editing} rows={3} placeholder="Tell us a bit about yourself..."
                  className="input-field resize-none disabled:bg-gray-50 disabled:text-gray-500" />
              </div>
            </div>

            {/* Become host */}
            {user?.role === 'guest' && (
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-6 text-white">
                <h3 className="font-display font-bold text-lg mb-1">Become a host</h3>
                <p className="text-white/70 text-sm mb-4">Share your space and start earning extra income.</p>
                <button onClick={handleBecomeHost} className="bg-white text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                  Start hosting →
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'security' && (
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-display font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiLock className="w-5 h-5" /> Change password
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
              {[
                { label: 'Current password', key: 'currentPassword' },
                { label: 'New password', key: 'newPassword' },
                { label: 'Confirm new password', key: 'confirm' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input type="password" value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                    className="input-field" required />
                </div>
              ))}
              <button type="submit" disabled={saving} className="btn-primary w-full py-3">
                {saving ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
