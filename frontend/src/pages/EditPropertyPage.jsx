import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';

const AMENITIES = ['WiFi','Kitchen','Washer','Dryer','AC','Heating','TV','Pool','Hot Tub','Free Parking','Gym','BBQ Grill','Fireplace','Balcony','Garden','Beach Access','Ski Access','Breakfast Included','Workspace','Pet Friendly'];
const CATEGORIES = ['beach','mountain','city','countryside','lake','cabin','villa','apartment','treehouse','farm'];

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get(`/properties/${id}`).then(res => {
      const p = res.data.property;
      setForm({
        title: p.title, description: p.description, category: p.category,
        pricePerNight: p.pricePerNight, cleaningFee: p.cleaningFee || '',
        guests: p.guests, bedrooms: p.bedrooms, beds: p.beds, bathrooms: p.bathrooms,
        location: p.location, amenities: p.amenities || [],
        houseRules: p.houseRules, images: p.images || []
      });
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading || !form) return <div className="min-h-screen"><Navbar /><div className="page-container py-8"><div className="h-64 bg-gray-200 rounded-2xl animate-pulse" /></div></div>;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setLoc = (key, val) => setForm(f => ({ ...f, location: { ...f.location, [key]: val } }));
  const toggleAmenity = (a) => setForm(f => ({
    ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
  }));

  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const res = await api.post('/upload/images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, images: [...f.images, ...res.data.images] }));
      toast.success('Images uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/properties/${id}`, form);
      toast.success('Listing updated!');
      navigate('/host/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-8 max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Edit listing</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Section title="Basic Info">
            <div className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} className="input-field resize-none" required />
              </div>
              <div>
                <label className="label">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} type="button" onClick={() => set('category', c)}
                      className={`px-3 py-1.5 rounded-full border text-sm capitalize ${form.category === c ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 hover:border-gray-400'}`}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Location">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Address</label>
                <input value={form.location?.address} onChange={e => setLoc('address', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label">City</label>
                <input value={form.location?.city} onChange={e => setLoc('city', e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="label">Country</label>
                <input value={form.location?.country} onChange={e => setLoc('country', e.target.value)} className="input-field" required />
              </div>
            </div>
          </Section>

          <Section title="Pricing & Capacity">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price per night ($)</label>
                <input type="number" min="1" value={form.pricePerNight} onChange={e => set('pricePerNight', e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="label">Cleaning fee ($)</label>
                <input type="number" min="0" value={form.cleaningFee} onChange={e => set('cleaningFee', e.target.value)} className="input-field" />
              </div>
              {[{ label: 'Max guests', key: 'guests' }, { label: 'Bedrooms', key: 'bedrooms' }, { label: 'Beds', key: 'beds' }, { label: 'Bathrooms', key: 'bathrooms' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input type="number" min="0" value={form[key]} onChange={e => set(key, Number(e.target.value))} className="input-field" />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Amenities">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITIES.map(a => (
                <label key={a} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-sm transition-all ${form.amenities.includes(a) ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                  <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="accent-brand w-3.5 h-3.5" />
                  {a}
                </label>
              ))}
            </div>
          </Section>

          <Section title="Photos">
            <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-brand/50 hover:bg-gray-50 transition-colors">
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} disabled={uploading} />
              <FiUpload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{uploading ? 'Uploading...' : 'Click to add more images'}</p>
            </label>
            {form.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img.url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiX className="text-white w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/host/dashboard')} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h3 className="font-display font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}
