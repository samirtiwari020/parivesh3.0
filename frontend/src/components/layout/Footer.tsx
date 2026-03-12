import { Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'About Portal',
    links: [
      { label: 'About PARIVESH', href: '/about' },
      { label: 'How It Works', href: '/about' },
      { label: 'FAQs', href: '/helpdesk' },
    ],
  },
  {
    title: 'Important Links',
    links: [
      { label: 'MoEFCC', href: 'https://moef.gov.in' },
      { label: 'CPCB', href: 'https://cpcb.nic.in' },
      { label: 'Wildlife Institute', href: 'https://wii.gov.in' },
      { label: 'Forest Survey of India', href: 'https://fsi.nic.in' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Accessibility Statement', href: '/accessibility' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Contact Us', href: '/helpdesk' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="gov-container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Landmark size={20} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">PARIVESH</h3>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Single Window Integrated Environmental Management System for Environment, Forest, Wildlife & CRZ Clearances.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/90">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="gov-container px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} PARIVESH Portal. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/50">
            Developed by National Informatics Centre (NIC)
          </p>
        </div>
      </div>
    </footer>
  );
}
