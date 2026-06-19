import { Link } from 'react-router-dom';
import { FiHome, FiGlobe, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <FiHome className="text-white w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xl">StayHaven</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Find your perfect stay anywhere in the world. Book unique homes, experiences, and places.</p>
            <div className="flex gap-4 mt-5">
              {[FiInstagram, FiTwitter, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Explore</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[['Beach Stays', '/properties?category=beach'], ['Mountain Cabins', '/properties?category=cabin'], ['City Apartments', '/properties?category=city'], ['Luxury Villas', '/properties?category=villa']].map(([label, href]) => (
                <li key={label}><Link to={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Hosting</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[['Become a Host', '/register?become=host'], ['Host Dashboard', '/host/dashboard'], ['Add Property', '/host/add-property'], ['Host Resources', '#']].map(([label, href]) => (
                <li key={label}><Link to={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[['Help Center', '#'], ['Cancellation Policy', '#'], ['Safety Information', '#'], ['Privacy Policy', '#'], ['Terms of Service', '#']].map(([label, href]) => (
                <li key={label}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2024 StayHaven. All rights reserved.</p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FiGlobe className="w-4 h-4" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
