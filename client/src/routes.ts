import type { ComponentType } from "react";
import trustPages from "@shared/trust-pages.json";

export const pageLoaders = {
  home: () => import("./pages/home"),
  faq: () => import("./pages/faq"),
  about: () => import("./pages/about"),
  contact: () => import("./pages/contact"),
  "privacy-policy": () => import("./pages/privacy-policy"),
  "terms-of-service": () => import("./pages/terms-of-service"),
  "not-found": () => import("./pages/not-found"),
} satisfies Record<string, () => Promise<{ default: ComponentType }>>;

export type PageKey = keyof typeof pageLoaders;
export interface PageRoute {
  path: string;
  page: PageKey;
  canonicalPath: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

export const routes: PageRoute[] = [
  {
    path: "/",
    page: "home",
    canonicalPath: "/",
    title: "Shopstr Markets - Commerce Without Boundaries",
    description:
      "Explore Shopstr Markets products: Shopstr for permissionless commerce, Self-sown for food producers and artisans, and Naughty Goat Co. for regenerative Mexican cajeta.",
    ogTitle: "Shopstr Markets - Our Products",
    ogDescription:
      "Discover Shopstr, Self-sown, and Naughty Goat Co. — permissionless marketplaces and locally sourced goods.",
  },
  {
    path: "/faq",
    page: "faq",
    canonicalPath: "/faq",
    title: "FAQ | Shopstr Markets",
    description:
      "Frequently asked questions about Shopstr Markets, our permissionless marketplaces, Bitcoin payments, and how to buy and sell on Nostr-based platforms.",
    ogTitle: "FAQ | Shopstr Markets",
    ogDescription:
      "Find answers to common questions about Shopstr Markets, Bitcoin payments, Nostr protocol, and our permissionless marketplace platforms.",
  },
  {
    path: "/privacy-policy",
    page: "privacy-policy",
    canonicalPath: "/privacy-policy",
    title: "Privacy Policy | Shopstr Markets",
    description:
      "Shopstr Markets privacy policy. We minimize data collection and protect your privacy as a permissionless marketplace service.",
    ogTitle: "Privacy Policy | Shopstr Markets",
    ogDescription:
      "Learn how Shopstr Markets protects your privacy through minimal data collection in our permissionless marketplace service.",
  },
  {
    path: "/terms-of-service",
    page: "terms-of-service",
    canonicalPath: "/terms-of-service",
    title: "Terms of Service | Shopstr Markets",
    description:
      "Terms of Service for Shopstr Markets. Understand the rules and responsibilities for using our permissionless marketplace platforms.",
    ogTitle: "Terms of Service | Shopstr Markets",
    ogDescription:
      "Read the terms of service for Shopstr Markets and our permissionless marketplace platforms built on Bitcoin and Nostr.",
  },
  {
    path: "/about",
    page: "about",
    canonicalPath: "/about",
    title: import.meta.env.SSR ? trustPages.about.title : "",
    description: import.meta.env.SSR ? trustPages.about.description : "",
    ogTitle: import.meta.env.SSR ? trustPages.about.title : "",
    ogDescription: import.meta.env.SSR ? trustPages.about.description : "",
  },
  {
    path: "/contact",
    page: "contact",
    canonicalPath: "/contact",
    title: import.meta.env.SSR ? trustPages.contact.title : "",
    description: import.meta.env.SSR ? trustPages.contact.description : "",
    ogTitle: import.meta.env.SSR ? trustPages.contact.title : "",
    ogDescription: import.meta.env.SSR ? trustPages.contact.description : "",
  },
  {
    path: "/privacy",
    page: "privacy-policy",
    canonicalPath: "/privacy-policy",
    title: "Privacy Policy | Shopstr Markets",
    description:
      "Shopstr Markets privacy policy. We minimize data collection and protect your privacy as a permissionless marketplace service.",
    ogTitle: "Privacy Policy | Shopstr Markets",
    ogDescription:
      "Learn how Shopstr Markets protects your privacy through minimal data collection in our permissionless marketplace service.",
  },
];

export function resolveRoute(pathname: string): PageRoute | undefined {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return undefined;
  }
  return routes.find(
    ({ path }) =>
      decoded === path ||
      decoded === `${path === "/" ? "" : path}/` ||
      decoded === `${path === "/" ? "" : path}/index.html`,
  );
}

export function loadPage(page: PageKey) {
  return pageLoaders[page]();
}

export function pageSource(page: PageKey) {
  return `src/pages/${page}.tsx`;
}
