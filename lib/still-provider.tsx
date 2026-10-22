"use client";

/**
 * Lets an app swap the link and image elements Still components render (kuratlielia/arc-library#13).
 *
 * Without a provider, Still renders a plain `<a>` and `<img>`, so components work in any React app (Vite, Remix, Astro,
 * plain React). Wrap the app once to use your framework's or your own components instead:
 *
 *   import Link from "next/link";
 *   import Image from "next/image";
 *   import { StillProvider } from "@/components/still/lib/still-provider";
 *
 *   <StillProvider link={Link} image={Image}>{children}</StillProvider>
 *
 * Any component that accepts these props works, such as a locale-aware Link from next-intl or a React Router Link
 * wrapped to map `href` to `to`.
 */
import { createContext, createElement, useContext, useMemo, type AnchorHTMLAttributes, type ComponentType, type ImgHTMLAttributes, type ReactNode, type Ref } from "react";

/** The props Still passes to a link: an href plus ordinary anchor attributes. */
export interface StillLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
}

/**
 * The props Still passes to an image. A subset of next/image's props, so next/image can be passed as is: either `fill`
 * (cover the positioned parent) or `width` and `height`, plus `sizes` and `priority` as hints.
 */
export interface StillImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height" | "loading" | "srcSet"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Fills the nearest positioned parent, like next/image's `fill`. */
  fill?: boolean;
  /** Loads the image eagerly with high priority, like next/image's `priority`. */
  priority?: boolean;
  loading?: "eager" | "lazy";
  ref?: Ref<HTMLImageElement>;
}

export type StillLinkComponent = ComponentType<StillLinkProps>;
export type StillImageComponent = ComponentType<StillImageProps>;

/** The default link: a plain anchor. */
export function StillAnchor(props: StillLinkProps) {
  return <a {...props} />;
}

const fillStyle = { position: "absolute", inset: 0, width: "100%", height: "100%" } as const;

/** The default image: a plain, lazily decoded `<img>` that understands `fill` and `priority`. */
export function StillImg({ alt, fill, priority, loading, style, ...props }: StillImageProps) {
  // eslint-disable-next-line @next/next/no-img-element -- the framework-free default; pass next/image through StillProvider instead.
  return <img alt={alt} decoding="async" {...props} loading={loading ?? (priority ? "eager" : "lazy")} fetchPriority={priority ? "high" : props.fetchPriority} style={fill ? { ...fillStyle, ...style } : style} />;
}

interface StillComponents {
  link: StillLinkComponent;
  image: StillImageComponent;
}

const StillContext = createContext<StillComponents>({ link: StillAnchor, image: StillImg });

export interface StillProviderProps {
  /** The link component Still renders for navigation, such as next/link or your own wrapped Link. Defaults to `<a>`. */
  link?: StillLinkComponent;
  /** The image component Still renders for photos, such as next/image. Defaults to `<img>`. */
  image?: StillImageComponent;
  children: ReactNode;
}

/** Sets the link and image components for every Still component inside it. Nested providers inherit what they do not set. */
export function StillProvider({ link, image, children }: StillProviderProps) {
  const parent = useContext(StillContext);
  const value = useMemo(() => ({ link: link ?? parent.link, image: image ?? parent.image }), [link, image, parent]);
  return <StillContext.Provider value={value}>{children}</StillContext.Provider>;
}

/** The link component from the nearest StillProvider, or a plain anchor. */
export const useStillLink = () => useContext(StillContext).link;
/** The image component from the nearest StillProvider, or a plain img. */
export const useStillImage = () => useContext(StillContext).image;

/** What Still components render for a link: the provider's link component, or a plain anchor. */
export function StillLink(props: StillLinkProps) {
  return createElement(useStillLink(), props);
}

/** What Still components render for an image: the provider's image component, or a plain img. */
export function StillImage(props: StillImageProps) {
  return createElement(useStillImage(), props);
}
