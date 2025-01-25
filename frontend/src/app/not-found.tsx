'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            {/* Large 404 Background */}
            <div className="select-none pointer-events-none absolute -top-[120px] left-1/2 -translate-x-1/2 text-[250px] font-bold text-gray-100">
              404
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-24 h-24 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center mb-8"
              >
                <Search className="h-12 w-12 text-[#1B4D3E]" />
              </motion.div>

              {/* Text */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Oops! The page you&apos;re looking for seems to have taken a vacation. 
                Let&apos;s get you back on track.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/"
                  className="flex items-center gap-2 px-6 py-3 bg-[#1B4D3E] text-white rounded-lg 
                    hover:bg-[#163D37] transition-all duration-300 w-full sm:w-auto justify-center"
                >
                  <Home className="h-5 w-5" />
                  Back to Home
                </Link>
                <button 
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 
                    text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 
                    w-full sm:w-auto justify-center"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Go Back
                </button>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Looking for something specific?
            </h2>
            <div className="flex flex-col gap-2 text-gray-600">
              <Link 
                href="/rooms" 
                className="hover:text-[#1B4D3E] transition-colors"
              >
                Browse Our Rooms
              </Link>
              <Link 
                href="/about" 
                className="hover:text-[#1B4D3E] transition-colors"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-[#1B4D3E] transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-0 w-32 h-32 bg-gradient-to-tr from-[#1B4D3E]/5 to-transparent -z-10 rounded-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1B4D3E]/5 to-transparent -z-10 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
} 