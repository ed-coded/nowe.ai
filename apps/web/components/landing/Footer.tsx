import { Home, Twitter, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Browse Properties", href: "#" },
    { label: "AI Search", href: "#" },
    { label: "Pricing", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Agents: [
    { label: "List a Property", href: "#" },
    { label: "Agent Verification", href: "#" },
    { label: "Agent Dashboard", href: "#" },
    { label: "Apply Now", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] pt-16 pb-8">
      <div className="container-home">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4 group" aria-label="Home">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center group-hover:bg-[var(--accent-hover)] transition-colors">
                <Home size={16} className="text-white" />
              </div>
              <span className="font-semibold text-[var(--text-primary)] text-lg tracking-tight">
                home
              </span>
            </a>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 max-w-xs">
              The housing intelligence layer for Africa. Discover your next home
              through the power of AI.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all duration-200 focus-ring"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)] mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-ring rounded"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-faint)]">
            © 2026 Home Technologies Ltd. All rights reserved. Built in 🇬🇭 Ghana.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-xs text-[var(--text-faint)]">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
