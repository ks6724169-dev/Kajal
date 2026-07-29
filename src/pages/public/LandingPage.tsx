import React, { useEffect, useState } from 'react';
import { Navigation } from './landing/Navigation';
import { AppleHero } from './landing/AppleHero';
import { BentoGrid } from './landing/BentoGrid';
import { FooterSection } from './landing/FooterSection';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RolePreviewButtons } from '../../components/common/RolePreviewButtons';

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
    <div id="galaxy-public-landing" className="min-h-screen bg-white font-sans selection:bg-slate-900 selection:text-white relative">
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-transparent">
        <div 
          className="h-full bg-slate-900"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <Navigation onNavigate={navigate} />
      
      <main>
        <AppleHero onNavigate={navigate} />
        <BentoGrid />
      </main>

      <FooterSection onNavigate={navigate} />

      {/* Floating Elements */}
      <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-3 group">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-900 flex items-center justify-center shadow-2xl hover:bg-slate-50 transition-all active:scale-90"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Admin Quick Entry - Role Previews */}
      <div className="fixed bottom-6 left-6 z-[100] hidden sm:block">
        <RolePreviewButtons variant="compact" onNavigate={navigate} />
      </div>
    </div>
  );
};

