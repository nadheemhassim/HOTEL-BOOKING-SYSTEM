'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1B4D3E] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-block group">
              <h3 className="text-2xl font-bold mb-6">
                Luxe<span className="text-[#8B9D83] group-hover:text-white transition-colors">Haven</span>
              </h3>
            </Link>
            <p className="text-gray-300 mb-6">
              Experience unparalleled luxury and comfort in our premium accommodations. Where every stay becomes an unforgettable memory.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="h-10 w-10 rounded-full bg-[#163D37] flex items-center justify-center hover:bg-[#8B9D83] transition-colors group"
                >
                  <Icon className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Rooms', href: '/rooms' },
                { label: 'Contact', href: '/contact' }
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#8B9D83]" />
                <p className="text-gray-300">42 Galle Road, Colombo 03, Sri Lanka</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#8B9D83]" />
                <p className="text-gray-300">+94 11 234 5678</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#8B9D83]" />
                <p className="text-gray-300">info@luxehaven.lk</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-[#8B9D83]" />
                <p className="text-gray-300">24/7 Customer Support</p>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-300 mb-4">
              Subscribe to receive exclusive offers and updates from LuxeHaven.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-[#163D37] border border-[#8B9D83]/30 focus:outline-none focus:border-[#8B9D83] transition-colors text-white placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-4 py-1 bg-[#8B9D83] text-white rounded-md hover:bg-[#7A8B73] transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#8B9D83]/20 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} LuxeHaven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}