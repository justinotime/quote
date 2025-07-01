'use client';

import Navbar from '@/app/Components/ui/Navbar';
import FooterSection from '@/app/Components/FooterSection';

const faqs = [
  {
    question: "How do I get started with Quote?",
    answer: "Click the 'Get Started' button on the homepage to create an account. You can sign up with Google, X (Twitter), or email."
  },
  {
    question: "Is Quote free to use?",
    answer: "Yes, Quote is completely free to use. We believe in making great writing tools accessible to everyone."
  },
  {
    question: "How do I publish my writing?",
    answer: "Once you're signed in, you can start writing by clicking 'Start Writing' in your dashboard. Publishing features are coming soon."
  },
  {
    question: "Can I edit my posts after publishing?",
    answer: "Yes, you'll be able to edit your posts after publishing. This feature is currently in development."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach us through our contact page or email us directly at support@quote.com"
  }
];

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar navItems={[]} />
      <main className="flex-1 pt-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#191b22] mb-8">Help & FAQ</h1>
          <p className="text-lg text-[#7e828f] mb-12">
            Find answers to common questions about using Quote.
          </p>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-[#ececec] pb-6">
                <h3 className="text-xl font-semibold text-[#191b22] mb-3">
                  {faq.question}
                </h3>
                <p className="text-[#7e828f] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-[#f5fbfc] rounded-lg">
            <h3 className="text-xl font-semibold text-[#191b22] mb-3">
              Still need help?
            </h3>
            <p className="text-[#7e828f] mb-4">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-all duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
} 