/**
 * Home / Landing Page
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Shield, Zap, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Navigation */}
      <nav className="border-b border-secondary-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg" />
            <span className="font-bold text-lg">VenkatAI</span>
          </div>
          <div className="flex gap-4">
            <Link href="/en/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/en/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
            Create Amazing Video Content with AI
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            Enterprise-grade AI media generation platform trusted by creators worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/register">
              <Button size="lg" icon={<Sparkles size={20} />}>
                Start Creating Now
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" icon={<ArrowRight size={20} />}>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-secondary-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-secondary-900 mb-16">Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '😊',
                title: 'Face Swap',
                desc: 'Swap faces in videos with high precision',
              },
              {
                icon: '🎬',
                title: 'Image to Video',
                desc: 'Create videos from static images',
              },
              {
                icon: '📝',
                title: 'Text to Video',
                desc: 'Generate videos from text descriptions',
              },
              {
                icon: '🎨',
                title: 'Background Removal',
                desc: 'Remove or replace video backgrounds',
              },
              {
                icon: '🔄',
                title: 'Image Upscaling',
                desc: 'Enhance image quality up to 8x',
              },
              {
                icon: '✨',
                title: 'Motion Generation',
                desc: 'Add realistic motion to static images',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white rounded-lg border border-secondary-200 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{feature.title}</h3>
                <p className="text-secondary-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-secondary-900 mb-16">Why Choose VenkatAI</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                icon: <Shield size={32} className="text-primary-600" />,
                title: 'Enterprise Security',
                items: ['End-to-end encryption', 'GDPR compliant', 'SOC 2 certified'],
              },
              {
                icon: <Zap size={32} className="text-primary-600" />,
                title: 'Lightning Fast',
                items: ['4x faster processing', 'Global CDN', 'API ready'],
              },
              {
                icon: <Users size={32} className="text-primary-600" />,
                title: 'Developer Friendly',
                items: ['Comprehensive API', 'Webhooks', 'SDKs available'],
              },
              {
                icon: <Sparkles size={32} className="text-primary-600" />,
                title: 'Always Improving',
                items: ['New models weekly', 'Community feedback', 'Beta features'],
              },
            ].map((benefit, i) => (
              <div key={i} className="p-8 rounded-lg bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">{benefit.title}</h3>
                <ul className="space-y-2">
                  {benefit.items.map((item, j) => (
                    <li key={j} className="text-secondary-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Create?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of creators using VenkatAI</p>
          <Link href="/en/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-secondary-100">
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary-200 bg-secondary-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {[
            {
              title: 'Product',
              links: ['Features', 'Pricing', 'API Docs', 'Status'],
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Contact'],
            },
            {
              title: 'Legal',
              links: ['Privacy', 'Terms', 'Security', 'GDPR'],
            },
            {
              title: 'Follow',
              links: ['Twitter', 'GitHub', 'Discord', 'LinkedIn'],
            },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
          <p>&copy; 2024 VenkatAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
