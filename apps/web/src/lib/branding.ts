/**
 * Single source of truth for brand identity.
 *
 * Update values here — not in individual components — when brand details
 * change. Components should import `brand` rather than hardcoding strings.
 */

export const brand = {
  name: "nowe.ai",
  legalName: "nowe.ai",
  tagline: "Know we prioritise your peace.",

  domain: "nowe.ai",
  url: "https://nowe.ai",

  logo: {
    // House-shaped icon mark (robot face) — used for compact placements:
    // navbar, footer, auth pages, favicon/app icon source.
    icon: "/logo-icon.jpeg",
    // Full "NOWE AI" wordmark — used for wider placements: OG image, email header.
    wordmark: "/logo-wordmark.jpeg",
    alt: "nowe.ai logo",
  },

  email: {
    supportEmail: "support@nowe.ai",
    senderName: "nowe.ai",
    senderEmail: "noreply@nowe.ai",
    replyTo: "support@nowe.ai",
  },

  social: {
    twitter: "#",
    linkedin: "#",
    instagram: "#",
  },

  copyright: `© ${new Date().getFullYear()} nowe.ai. All rights reserved. Built in 🇬🇭 Ghana.`,

  metadata: {
    title: "nowe.ai | Know we prioritise your peace.",
    description:
      "nowe.ai is an AI-powered property discovery platform. Describe your ideal home naturally and we'll find the best matches for you across Ghana.",
    keywords: [
      "property rental Ghana",
      "houses for rent Accra",
      "AI property search",
      "apartments Ghana",
      "find home Ghana",
    ],
    ogTitle: "nowe.ai — AI-Powered Property Discovery",
    ogDescription:
      "Describe your ideal home naturally. Our AI finds the best properties in Ghana for you.",
  },
} as const;
