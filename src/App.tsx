/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll } from 'motion/react';
import { useEffect } from 'react';
import { LocationDraftProvider } from './context/LocationDraftContext';
import { LanguageProvider } from './i18n/LanguageProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageAmbience } from './components/PageAmbience';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Atlas } from './components/sections/Atlas';
import { Collective } from './components/sections/Collective';
import { Contribute } from './components/sections/Contribute';
import { Contact } from './components/sections/Contact';
import { scrollToSection } from './lib/utils';

export default function App() {
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, '');
    if (!id) return;
    requestAnimationFrame(() => scrollToSection(id));
  }, []);

  return (
    <LanguageProvider>
      <LocationDraftProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-bg font-sans text-ink selection:bg-accent/30 selection:text-ink">
        <PageAmbience />
        <Navbar />

        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="fixed top-0 right-0 left-0 z-[60] h-0.5 origin-left bg-accent"
          aria-hidden
        />

        <main className="relative z-10">
          <Hero />
          <About />
          <Atlas />
          <Collective />
          <Contribute />
          <Contact />
        </main>
        <Footer />
      </div>
      </LocationDraftProvider>
    </LanguageProvider>
  );
}
