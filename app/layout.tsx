import type { Metadata } from 'next';
import './globals.css';
import './reconstruction.css';
import './home-motion.css';
import './shared-motion.css';
import './project-motion.css';
import './intro-motion.css';
import IntroPreloader from '@/components/intro-preloader';
import PageTransitions from '@/components/page-transitions';
export const metadata: Metadata = {
  metadataBase: new URL('https://shourya-bafna-portfolio.melodicllama2.chatgpt.site'),
  title: { default: 'Shourya Bafna — Software & AI Engineer', template: '%s · Shourya Bafna' },
  description: 'Shourya Bafna builds full-stack applications, thoughtful AI systems, and practical machine learning. Explore selected projects, experience, and engineering decisions.',
  openGraph: { title: 'Shourya Bafna — Software & AI Engineer', description: 'Full-stack applications and applied AI. Projects, engineering experience, and the work behind them.', type: 'website' },
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" className="__variable_e29fa9"><head><link rel="preload" href="/fonts/urbanist-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><IntroPreloader/><PageTransitions>{children}</PageTransitions></body></html>;
}
