// Single source of truth for global header + footer navigation.
// Locked per spec §1.8 (header) + §1.9 (footer).

export type NavLink = { label: string; href: string };

// Header centre nav.
// Spec §1.8 + P18 update — The Group · Portfolio · Craftsmanship · Sustainability ·
// Innovation · Journal · News · Careers.
// "Contact us" is a separate filled CTA button on the right (not part of the nav list).
export const PRIMARY_NAV: NavLink[] = [
  { label: "The Group", href: "/the-group" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Craftsmanship", href: "/craftsmanship" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Innovation", href: "/innovation" },
  // { label: "Journal", href: "/blog" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
];

export const HEADER_CTA = {
  label: "Contact us",
  href: "/contact",
  ariaLabel: "Go to contact page",
} as const;

// Footer column structure locked per spec §1.9 Block 1.
export const FOOTER_NAV = {
  group: [
    { label: "About", href: "/the-group" },
    { label: "Leadership", href: "/the-group#leadership" },
    { label: "Governance", href: "/the-group#governance" },
    { label: "Press Kit", href: "/press-kit" },
  ],
  brands: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Mayavé", href: "/portfolio/mayave" },
    { label: "Future Territories", href: "/portfolio#future-territories" },
    { label: "Newsroom", href: "/news" },
  ],
  responsibility: [
    { label: "Craftsmanship", href: "/craftsmanship" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Innovation", href: "/innovation" },
    { label: "Global Presence", href: "/global-presence" },
  ],
  contact: [
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Partnerships", href: "/contact?type=partnership#contact-form" },
  ],
};

export const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/dholakia-retail-private-limited",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/dholakiaretail",
  },
];

export const COMPANY = {
  legalName: "Dholakia Retail Private Limited",
  cin: "U32111GJ2024PTC155690",
  roc: "Ahmedabad",
  address:
    "Dholakia Ventures, Plot No. D-02 and D-11, Gem & Jewellery Park, GHB, Ichchhapor, Surat, Gujarat 394510, India",
  email: "info@dholakiaretail.com",
  established: "2024",
} as const;

export const COMPLIANCE = ["RJC", "Kimberley Process", "SCS-007", "ISO 9001"] as const;

export const LEGAL_LINKS = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
] as const;
