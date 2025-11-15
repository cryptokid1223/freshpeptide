import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  variant?: "nav" | "hero";
  href?: string | null;
};

export function Logo({ variant = "nav", href = "/" }: LogoProps) {
  const isHero = variant === "hero";

  // Nav variant: compact sizing for navbar (28px height)
  // Hero variant: larger sizing for homepage hero (72px height)
  const imageHeight = isHero ? "h-[72px]" : "h-7"; // h-7 = 28px
  const textSize = isHero ? "text-4xl" : "text-base";
  const gap = isHero ? "gap-3" : "gap-2";

  const logoContent = (
    <div className={`inline-flex items-center ${gap}`}>
      <Image
        src="/logo.png"
        alt="FreshPeptide logo"
        width={isHero ? 72 : 28}
        height={isHero ? 72 : 28}
        priority={isHero}
        className={`${imageHeight} w-auto object-contain`}
      />
      <span className={`${textSize} font-semibold text-[#3E3028]`}>
        FreshPeptide
      </span>
    </div>
  );

  // Wrap in Link if href is provided (for navbar)
  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

