"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/features/landing/components/get-started-button";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
  { href: "#cta", label: "Get Started" },
];

export function LandingNavbar() {
  const [isSolid, setIsSolid] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  const scrollToSection = (href: string) => {
    if (!href.startsWith("#")) {
      return;
    }

    const target = document.querySelector<HTMLElement>(href);

    if (!target) {
      return;
    }

    const navbar = document.querySelector<HTMLElement>("[data-landing-navbar]");
    const navbarHeight = navbar?.offsetHeight ?? 96;
    const y = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 14;

    setIsVisible(true);
    window.scrollTo({
      top: Math.max(0, y),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current + 4;
      const scrollingUp = currentY < lastScrollY.current - 4;

      setIsSolid(currentY > 20);

      if (mobileOpen) {
        setIsVisible(true);
      } else if (currentY <= 12 || scrollingUp) {
        setIsVisible(true);
      } else if (scrollingDown) {
        setIsVisible(false);
      }

      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      data-landing-navbar
      className={`fixed top-0 z-50 w-full px-4 pt-4 transition-transform duration-300 md:px-6 ${
        isVisible ? "translate-y-0" : "-translate-y-[120%]"
      }`}
    >
      <div
        className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-300 ${
          isSolid
            ? "border-gray-200/70 bg-white/86 shadow-[0_12px_34px_rgba(16,24,40,0.09)] backdrop-blur-xl"
            : "border-gray-200/60 bg-white/58 shadow-[0_10px_30px_rgba(16,24,40,0.06)] backdrop-blur-lg"
        }`}
      >
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 md:grid-cols-[1fr_auto_1fr] md:px-5">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 rounded-full   py-1.5 text-lg font-semibold tracking-tight text-gray-900 transition-colors "
          >
            <Image src="/logo.svg" alt="Resonance" width={28} height={28} />
            Resonance
          </Link>

          <nav className="hidden items-center justify-center gap-8 md:flex">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-950"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(item.href);
                  }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden justify-end md:flex">
            <GetStartedButton className="h-9 rounded-full bg-linear-to-r from-[#2b7fff] to-[#11a9a4] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(46,122,255,0.24)] transition-all duration-200 hover:brightness-105">
              Sign In
            </GetStartedButton>
          </div>

          <div className="flex justify-end md:hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Toggle navigation"
              className="rounded-full border border-gray-200 bg-white/80 text-gray-700 hover:bg-white hover:text-gray-950"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="border-t border-gray-200 px-4 pb-4 pt-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950"
                  onClick={(event) => {
                    event.preventDefault();
                    setMobileOpen(false);
                    requestAnimationFrame(() => {
                      scrollToSection(item.href);
                    });
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <GetStartedButton
              className="mt-3 h-10 w-full rounded-full bg-linear-to-r from-[#2b7fff] to-[#11a9a4] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(46,122,255,0.24)]"
              onClick={() => setMobileOpen(false)}
            >
              Get started
            </GetStartedButton>
          </div>
        ) : null}
      </div>
    </header>
  );
}
