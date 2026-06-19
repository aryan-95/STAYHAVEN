import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiChevronRight } from 'react-icons/fi';

const CATEGORIES = ['beach','mountain','city','countryside','lake','desert','cabin','villa','apartment','treehouse','boat','farm'];
const AMENITIES = ['WiFi','Kitchen','Washer','Dryer','AC','Heating','TV','Pool','Hot Tub','Free Parking','EV Charger','Gym','BBQ Grill','Fireplace','Balcony','Garden','Beach Access','Ski Access','Breakfast Included','Workspace','Pet Friendly','Wheelchair Accessible'];

const STEPS = ['Basic Info', 'Location', 'Details', 'Amenities', 'Images', 'Review'];

const init = {
  title: '', description: '', category: 'apartment',
  pricePerNight: '', cleaningFee: '', guests: 1, bedrooms: 1, beds: 1, bathrooms: 1,
  location: { address: '', city: '', state: '', country: '', zipCode: '' },
  amenities: [],
  houseRules: { checkIn: '15:00', checkOut: '11:00', noSmoking: true, noPets: false, noParties: true, selfCheckIn: false },
  images: []
};

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(init);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setLoc = (key, val) => setForm(f => ({ ...f, location: { ...f.location, [key]: val } }));
  const setRule = (key, val) => setForm(f => ({ ...f, houseRules: { ...f.houseRules, [key]: val } }));

  const toggleAmenity = (a) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
    }));
  };

  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const res = await api.post('/upload/images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, images: [...f.images, ...res.data.images] }));
      toast.success(`${files.length} image${files.length > 1 ? 's' : ''} uploaded`);
    } catch { toast.error('Image upload failed'); }
    finally { setUploading(false); }
  };

  const removeImage = (idx) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.location.city || !form.location.country) {
      toast.error('Please fill all required fields'); return;
    }
    if (form.images.length === 0) { toast.error('Please upload at least one image'); return; }
    setSaving(true);
    try {
      await api.post('/properties', form);
      toast.success('Property listed successfully! 🎉');
      navigate('/host/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">List your property</h1>
          <p className="text-gray-500">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? 'bg-brand' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {/* Step 0: Basic info */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Property title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} className="input-field" placeholder="Cozy beachfront villa with ocean views" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={5} className="input-field resize-none" placeholder="Describe your property in detail..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property type *</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} type="button" onClick={() => set('category', c)}
                      className={`py-2.5 px-3 rounded-xl border text-sm font-medium capitalize transition-all ${form.category === c ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 hover:border-gray-400'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Street address *</label>
                <input value={form.location.address} onChange={e => setLoc('address', e.target.value)} className="input-field" placeholder="123 Ocean Drive" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <input value={form.location.city} onChange={e => setLoc('city', e.target.value)} className="input-field" placeholder="Malibu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State / Region</label>
                  <input value={form.location.state} onChange={e => setLoc('state', e.target.value)} className="input-field" placeholder="California" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country *</label>
                  <input value={form.location.country} onChange={e => setLoc('country', e.target.value)} className="input-field" placeholder="USA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP / Postal code</label>
                  <input value={form.location.zipCode} onChange={e => setLoc('zipCode', e.target.value)} className="input-field" placeholder="90265" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details & Pricing */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Max guests', key: 'guests', min: 1 },
                  { label: 'Bedrooms', key: 'bedrooms', min: 0 },
                  { label: 'Beds', key: 'beds', min: 1 },
                  { label: 'Bathrooms', key: 'bathrooms', min: 0.5 },
                ].map(({ label, key, min }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => set(key, Math.max(min, form[key] - 1))}
                        className="w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:border-gray-800 font-bold">−</button>
                      <span className="text-lg font-semibold w-8 text-center">{form[key]}</span>
                      <button type="button" onClick={() => set(key, form[key] + 1)}
                        className="w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:border-gray-800 font-bold">+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per night ($) *</label>
                  <input type="number" min="1" value={form.pricePerNight} onChange={e => set('pricePerNight', e.target.value)} className="input-field" placeholder="150" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cleaning fee ($)</label>
                  <input type="number" min="0" value={form.cleaningFee} onChange={e => set('cleaningFee', e.target.value)} className="input-field" placeholder="50" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">House rules</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Check-in time</label>
                    <input type="time" value={form.houseRules.checkIn} onChange={e => setRule('checkIn', e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Check-out time</label>
                    <input type="time" value={form.houseRules.checkOut} onChange={e => setRule('checkOut', e.target.value)} className="input-field text-sm" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  {[
                    { key: 'noSmoking', label: 'No smoking' },
                    { key: 'noParties', label: 'No parties or events' },
                    { key: 'noPets', label: 'No pets allowed' },
                    { key: 'selfCheckIn', label: 'Self check-in available' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.houseRules[key]} onChange={e => setRule(key, e.target.checked)} className="w-4 h-4 accent-brand rounded" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Amenities */}
          {step === 3 && (
            <div>
              <p className="text-gray-500 text-sm mb-4">Select all that apply to your property</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES.map(a => (
                  <label key={a} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${form.amenities.includes(a) ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                    <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="accent-brand w-4 h-4" />
                    <span className="text-sm text-gray-700">{a}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {step === 4 && (
            <div>
              <p className="text-gray-500 text-sm mb-4">Upload at least one image. First image will be the cover.</p>
              <label className={`block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${uploading ? 'border-brand/50 bg-brand/5' : 'border-gray-200 hover:border-brand/50 hover:bg-gray-50'}`}>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} disabled={uploading} />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                    <p className="text-brand font-medium">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FiUpload className="w-8 h-8 text-gray-400" />
                    <p className="font-medium text-gray-700">Click to upload images</p>
                    <p className="text-sm text-gray-400">PNG, JPG, WEBP up to 10MB each</p>
                  </div>
                )}
              </label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiX className="text-white w-3 h-3" />
                      </button>
                      {i === 0 && <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">Cover</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">Review your listing</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                {form.images[0] && <img src={form.images[0].url} className="w-full aspect-video object-cover rounded-xl mb-3" />}
                <p><span className="font-medium">Title:</span> {form.title}</p>
                <p><span className="font-medium">Category:</span> <span className="capitalize">{form.category}</span></p>
                <p><span className="font-medium">Location:</span> {form.location.city}, {form.location.country}</p>
                <p><span className="font-medium">Price:</span> ${form.pricePerNight}/night</p>
                <p><span className="font-medium">Guests:</span> {form.guests} · Beds: {form.beds} · Baths: {form.bathrooms}</p>
                <p><span className="font-medium">Amenities:</span> {form.amenities.join(', ') || 'None selected'}</p>
                <p><span className="font-medium">Images:</span> {form.images.length} uploaded</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="btn-secondary px-8 disabled:opacity-40">Back</button>
          {step < STEPS.length - 1
            ? <button onClick={() => setStep(s => s + 1)} className="btn-primary px-8 flex items-center gap-2">
                Next <FiChevronRight className="w-4 h-4" />
              </button>
            : <button onClick={handleSubmit} disabled={saving} className="btn-primary px-8">
                {saving ? 'Publishing...' : 'Publish Listing 🎉'}
              </button>
          }
        </div>
      </div>
    </div>
  );
}
