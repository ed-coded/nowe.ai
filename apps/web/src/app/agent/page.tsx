import Link from "next/link";
import {
  Building2,
  Home as HomeIcon,
  Building,
  ArrowRight,
  ClipboardCheck,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const audiences = [
  {
    icon: Building2,
    title: "Real Estate Agents",
    description:
      "List properties, manage inquiries, and close deals faster with renters who already know what they want.",
  },
  {
    icon: HomeIcon,
    title: "Landlords",
    description:
      "Fill vacancies with serious, intent-driven renters instead of fielding endless unqualified calls.",
  },
  {
    icon: Building,
    title: "Developers",
    description:
      "Showcase entire projects and unit inventory to a qualified audience actively searching in your market.",
  },
];

const benefits = [
  {
    icon: ClipboardCheck,
    title: "Get Verified",
    description: "Build trust with a verified badge that sets you apart from unverified listings.",
  },
  {
    icon: MessageSquare,
    title: "Direct Leads",
    description: "Hear from renters and buyers who are ready to move, not just browsing.",
  },
  {
    icon: BarChart3,
    title: "Track Performance",
    description: "See views, saves, and inquiries on every listing you manage.",
  },
];

export default function AgentLandingPage() {
  return (
    <main>
      <Navbar />

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden dot-grid pt-16">
        <div className="absolute w-[500px] h-[500px] -top-40 -left-40 bg-[var(--accent)] opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] bottom-0 -right-40 bg-indigo-500 opacity-8 rounded-full blur-3xl pointer-events-none" />

        <div className="container-home relative z-10 text-center pt-24 pb-16">
          <div className="inline-block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)] border-opacity-20 rounded-full px-3 py-1 mb-6">
            For Professionals
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-[var(--text-primary)]">Grow your business</span>
            <br />
            <span className="gradient-text">on nowe.ai.</span>
          </h1>

          <p className="text-base md:text-lg text-[var(--text-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
            Whether you&apos;re a real estate agent, a landlord, or a developer,
            nowe.ai connects you with renters and buyers who already know what
            they&apos;re looking for.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/agent/signup"
              className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_var(--accent-glow-strong)] focus-ring"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/agent/signin"
              className="flex items-center gap-2 border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium px-6 py-3.5 rounded-xl transition-all duration-200 hover:bg-[var(--surface)] focus-ring"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[var(--surface)]">
        <div className="container-home">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-[var(--text-primary)] mb-14 tracking-tight">
            Built for every kind of property professional
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {audiences.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center mb-5">
                  <Icon size={22} className="text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)] border-opacity-20 flex items-center justify-center mx-auto mb-4">
                  <Icon size={18} className="text-[var(--accent)]" />
                </div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  {title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs mx-auto">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-home text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">
            Ready to list your first property?
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            Applications are reviewed to keep the platform trusted for renters and professionals alike.
          </p>
          <Link
            href="/agent/signup"
            className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_var(--accent-glow-strong)] focus-ring"
          >
            Apply as a Professional
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
