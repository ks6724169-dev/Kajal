import React, { useEffect, useState } from 'react';
import { Navigation } from './landing/Navigation';
import { HeroSection } from './landing/HeroSection';
import { FooterSection } from './landing/FooterSection';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onLogin: () => void;
  onOpenTeacherPanel?: () => void;
  onOpenRegistration: () => void;
  onNavigate?: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onLogin, 
  onOpenRegistration,
  onNavigate 
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const navigate = onNavigate || ((path: string) => {
    if (path === '/login') onLogin();
    if (path === '/register') onOpenRegistration();
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="galaxy-public-landing" className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-600 selection:text-white relative">
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-transparent">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <Navigation onNavigate={navigate} />
      
      <main>
        <HeroSection onNavigate={navigate} />
      </main>

      <FooterSection onNavigate={navigate} />

      {/* Floating Elements */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 group pointer-events-none">
        {/* We keep the container for ScrollToTop but make it pointer-events-none so it doesn't block clicks. 
            The actual button will have pointer-events-auto */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="w-14 h-14 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-xl hover:bg-slate-50 transition-colors pointer-events-auto"
            >
              <ArrowUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
