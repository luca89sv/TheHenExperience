"use client";

import { useRef, useEffect, ReactNode } from "react";

export type RevealType =
  | "fade-up"
  | "stagger-cards"
  | "step-alternate"
  | "scale-up"
  | "pricing"
  | "faq-stagger"
  | "cta-dramatic"
  | "activity-stagger";

interface ScrollRevealProps {
  children: ReactNode;
  type: RevealType;
  /** For step-alternate: the index of the step (determines left/right) */
  index?: number;
  className?: string;
}

export default function ScrollReveal({ children, type, index = 0, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctx: any;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // For stagger types, if the wrapper has a single child container (e.g. a grid),
      // we want to animate that container's children, not the container itself.
      const getItems = () => {
        if (el.children.length === 1 && el.firstElementChild!.children.length > 0) {
          return Array.from(el.firstElementChild!.children);
        }
        return Array.from(el.children);
      };

      ctx = gsap.context(() => {
        switch (type) {
          case "fade-up": {
            gsap.from(el, {
              y: 40,
              opacity: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
              },
            });
            break;
          }

          case "stagger-cards": {
            const cards = getItems();
            if (cards.length) {
              gsap.from(cards, {
                y: 50,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  once: true,
                },
              });
            }
            break;
          }

          case "step-alternate": {
            gsap.from(el, {
              x: index % 2 === 0 ? -40 : 40,
              opacity: 0,
              duration: 0.8,
              delay: index * 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
              },
            });
            break;
          }

          case "scale-up": {
            const cards = getItems();
            if (cards.length) {
              gsap.from(cards, {
                scale: 0.92,
                opacity: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  once: true,
                },
              });
            }
            break;
          }

          case "pricing": {
            const cards = getItems();
            if (cards.length) {
              gsap.from(cards, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  once: true,
                },
              });
            }
            break;
          }

          case "faq-stagger": {
            const items = getItems();
            if (items.length) {
              gsap.from(items, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  once: true,
                },
              });
            }
            break;
          }

          case "cta-dramatic": {
            gsap.from(el, {
              y: 50,
              opacity: 0,
              scale: 0.96,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
              },
            });
            break;
          }

          case "activity-stagger": {
            const cards = getItems();
            if (cards.length) {
              gsap.from(cards, {
                y: 50,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  once: true,
                },
              });
            }
            break;
          }
        }
      }, el);
    })();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [type, index]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
