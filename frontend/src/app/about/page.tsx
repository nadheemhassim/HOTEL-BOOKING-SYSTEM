'use client';

import { motion } from 'framer-motion';
import { 
  Users, Building2, CalendarCheck, Star, 
  Coffee, CreditCard, Gift, Bell, User,
  Github, Linkedin, Mail, GraduationCap 
} from 'lucide-react';
import { teamMembers } from '@/types/team';

export default function AboutPage() {
  const getEntityIcon = (responsibility: string) => {
    switch (responsibility) {
      case "User Management":
        return <Users className="h-8 w-8" />;
      case "Room Management":
        return <Building2 className="h-8 w-8" />;
      case "Booking System":
        return <CalendarCheck className="h-8 w-8" />;
      case "Reviews & Rating":
        return <Star className="h-8 w-8" />;
      case "Services Management":
        return <Coffee className="h-8 w-8" />;
      case "Payment System":
        return <CreditCard className="h-8 w-8" />;
      case "Special Offers":
        return <Gift className="h-8 w-8" />;
      case "Staff Management":
        return <Bell className="h-8 w-8" />;
      default:
        return <User className="h-8 w-8" />;
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section - Minimal */}
      <section className="relative py-20 bg-[#1B4D3E] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Meet Our Team
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-gray-200">
              Dedicated professionals working together to revolutionize the hotel booking experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Universities Section - Redesigned */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Academic Partners
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Proudly affiliated with leading educational institutions
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* University Cards - Enhanced styling */}
            <motion.div 
              {...fadeInUp}
              className="p-8 rounded-2xl bg-gradient-to-br from-[#1B4D3E]/5 to-transparent border border-[#1B4D3E]/10 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#1B4D3E]/10 rounded-full">
                  <GraduationCap className="h-8 w-8 text-[#1B4D3E]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">NSBM Green University</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Sri Lanka&apos;s premier green university, leading the way in sustainable education and technological innovation.
              </p>
            </motion.div>

            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-[#1B4D3E]/5 to-transparent border border-[#1B4D3E]/10 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#1B4D3E]/10 rounded-full">
                  <GraduationCap className="h-8 w-8 text-[#1B4D3E]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">University of Plymouth</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                A prestigious UK institution known for excellence in education and research worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Members Grid - Enhanced */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Dream Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the talented individuals behind our success
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#1B4D3E]/10 rounded-full group-hover:bg-[#1B4D3E] transition-colors duration-300">
                    {getEntityIcon(member.responsibility)}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-sm text-[#1B4D3E] font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-4">{member.responsibility}</p>
                  <div className="flex justify-center space-x-4">
                    {member.social.github && (
                      <motion.a 
                        whileHover={{ scale: 1.2 }}
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#1B4D3E] transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </motion.a>
                    )}
                    {member.social.linkedin && (
                      <motion.a 
                        whileHover={{ scale: 1.2 }}
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#1B4D3E] transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </motion.a>
                    )}
                    {member.social.email && (
                      <motion.a 
                        whileHover={{ scale: 1.2 }}
                        href={`mailto:${member.social.email}`}
                        className="text-gray-600 hover:text-[#1B4D3E] transition-colors"
                      >
                        <Mail className="h-5 w-5" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Stats - Enhanced */}
      <section className="py-16 bg-[#1B4D3E] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "8", label: "Team Members" },
              { value: "8", label: "Core Features" },
              { value: "100%", label: "Responsive" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg bg-white/5 backdrop-blur-sm"
              >
                <h4 className="text-3xl md:text-5xl font-bold text-white mb-2">{stat.value}</h4>
                <p className="text-sm md:text-base text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 