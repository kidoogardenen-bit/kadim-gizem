export const SITE = {
  name: "Kadim Gizem",
  url: "https://kadimgizem.com",
  description:
    "Mitoloji, tarih ve gizli gerçeklerin keşif merkezi — kadim bilgeliğin modern kapısı.",
  ogImage: "/og-image.jpg",
  keywords: [
    "mitoloji",
    "tarih",
    "gizemli gerçekler",
    "antik uygarlıklar",
    "efsaneler",
    "kadim bilgelik",
  ],
  links: {
    twitter: "https://twitter.com/kadimgizem",
    instagram: "https://instagram.com/kadimgizem",
    youtube: "https://youtube.com/@kadimgizem",
    github: "https://github.com/kadimgizem",
    email: "iletisim@kadimgizem.com",
  },
} as const;

export const NAV_ITEMS = [
  { href: "/mitoloji", label: "Mitoloji" },
  { href: "/tarih", label: "Tarih" },
  { href: "/gercekler", label: "Gerçekler" },
  { href: "/hakkinda", label: "Hakkında" },
] as const;

export const CATEGORIES = [
  {
    slug: "mitoloji",
    label: "Mitoloji",
    description: "Tanrılar, kahramanlar ve kadim efsaneler",
    accent: "gold",
  },
  {
    slug: "tarih",
    label: "Tarih",
    description: "Kayıp uygarlıklar ve unutulmuş olaylar",
    accent: "crimson",
  },
  {
    slug: "gercekler",
    label: "Gerçekler",
    description: "Bilim ve gizemin buluştuğu nokta",
    accent: "gold",
  },
  {
    slug: "semboller",
    label: "Semboller",
    description: "Kadim işaretler ve anlamları",
    accent: "crimson",
  },
] as const;

export const FOOTER_LINKS = {
  kesfet: [
    { href: "/mitoloji", label: "Mitoloji" },
    { href: "/tarih", label: "Tarih" },
    { href: "/gercekler", label: "Gerçekler" },
    { href: "/semboller", label: "Semboller" },
  ],
  kurumsal: [
    { href: "/hakkinda", label: "Hakkında" },
    { href: "/iletisim", label: "İletişim" },
    { href: "/gizlilik", label: "Gizlilik Politikası" },
    { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  ],
} as const;
