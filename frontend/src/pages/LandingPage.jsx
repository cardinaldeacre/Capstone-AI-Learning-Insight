import React from 'react';
import { Link } from 'react-router-dom';
// Hapus Briefcase dan Code dari import
import { Monitor, User, Send, Linkedin } from 'lucide-react'; 

export default function LandingPage() {
  const teamMembers = [
    { 
      name: 'Rizky Cahyono', 
      role: 'Frontend Lead', 
      expertise: 'React & Backend Developer',
      linkedin: 'https://www.linkedin.com/in/rizky-cahyono-67367a2a0/',
      email: 'rizky.cahyono@example.com' // Tambahkan Email
    },
    { 
      name: 'Iqbal Maulana', 
      role: 'Backend Developer', 
      expertise: 'React & Backend Developer',
      linkedin: 'https://www.linkedin.com/in/iqbal-maulana-dev/',
      email: 'iqbal.maulana@example.com'
    },
    { 
      name: 'Muhammad Ibadurrohman', 
      role: 'React & Backend Developer', 
      expertise: 'Shadcn UI, Prototyping',
      linkedin: 'https://www.linkedin.com/in/muhammad-ibadurrohman-53bb40367', 
      email: 'muhammad.ibadurrohman@example.com'
    },
    { 
      name: 'Edward Christian Rufus', 
      role: 'AI Engineer', 
      expertise: 'Phyton, Training',
      linkedin: 'https://www.linkedin.com/in/edward-christian-rufus-a1a0a7226',
      email: 'edward.rufus@example.com'
    },
    { 
      name: 'Muhammad Alvino Dienova', 
      role: 'AI Engineer', 
      expertise: 'Phyton, Dataset',
      linkedin: 'https://www.linkedin.com/in/alvino-dienova/',
      email: 'muhammad.alvino@example.com'
    },
    { 
      name: 'Rindra Satriatama Putra', 
      role: 'AI Engineer', 
      expertise: 'Phyton, Model',
      linkedin: 'http://www.linkedin.com/in/rindra-satriatama-495106381',
      email: 'rindra.putra@example.com'
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-white dark:bg-gray-950">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* 1. HERO SECTION (Main Header) */}
      <section className="py-20 md:py-32 z-10 flex flex-col items-center justify-center text-center px-6">
        <div className="z-10 flex flex-col items-center mb-10">
          <div className="bg-teal-100 p-4 rounded-xl mb-4 shadow-md">
            <Monitor className="w-12 h-12 text-teal-700" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3 md:text-5xl">
            AI Learning Insight Platform
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Empowering Education with Intelligent Insights and Personalized Learning Experiences.
          </p>
        </div>

        <div className="z-10 flex gap-4">
          <Link 
            to="/login" 
            className="px-6 py-3 text-lg font-semibold rounded-full bg-teal-700 text-white hover:bg-teal-800 transition-colors shadow-lg shadow-teal-700/30"
          >
            Start Learning Now
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-3 text-lg font-semibold rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* 2. ABOUT/TEAM PORTFOLIO SECTION */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16 md:py-24 z-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Meet Our Dedicated Team
          </h2>
          <p className="text-gray-600 mb-12 text-center max-w-xl mx-auto">
            We are a passionate group of developers and AI engineers committed to revolutionizing education through technology. Our diverse expertise drives innovation in creating an intelligent learning platform.
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="size-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-teal-600 font-medium">{member.role}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">Keahlian: {member.expertise}</p>
                
                <div className="flex space-x-3 mt-4">
                  {/* LinkedIn */}
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-teal-600 transition-colors" 
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  
                  {/* Email (Menggunakan mailto:) */}
                  <a 
                    href={`mailto:${member.email}`} 
                    className="text-gray-400 hover:text-teal-600 transition-colors" 
                    aria-label="Email"
                  >
                    <Send size={20} />
                  </a>
                  
                  {/* Portfolio / Briefcase Dihapus */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}