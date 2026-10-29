document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const page = document.querySelector(".university-page");

    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!window.gsap || !window.ScrollTrigger || reducedMotion) {
        root.classList.remove("university-js");
        return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    gsap.config({ nullTargetWarn: false });

    const heroWords = gsap.utils.toArray(".university-hero h1 > span");
    const heroReveals = gsap.utils.toArray(".university-hero [data-university-reveal]");
    const headings = gsap.utils.toArray("[data-university-heading]");
    const reveals = gsap.utils.toArray("[data-university-reveal]").filter(
        (element) => !element.closest(".university-hero")
    );
    const staggerGroups = gsap.utils.toArray("[data-stagger]");

    gsap.set(heroWords, { autoAlpha: 0, yPercent: 115 });
    gsap.set(heroReveals, { autoAlpha: 0, y: 28 });

    function revealWhenReached(element, options = {}) {
        const fromVars = {
            autoAlpha: 0,
            x: options.x || 0,
            y: options.y ?? 38
        };

        gsap.set(element, fromVars);
        ScrollTrigger.create({
            trigger: element,
            start: options.start || "top 88%",
            once: true,
            onEnter: () => {
                gsap.to(element, {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    duration: options.duration || 0.78,
                    ease: options.ease || "power3.out",
                    clearProps: "transform"
                });
            }
        });
    }

    headings.forEach((heading) => {
        Array.from(heading.children).forEach((element, index) => {
            revealWhenReached(element, {
                x: index < 2 ? -18 : 0,
                y: index < 2 ? 20 : 46,
                duration: index === heading.children.length - 1 ? 0.95 : 0.68,
                ease: index === heading.children.length - 1 ? "power4.out" : "power3.out"
            });
        });
    });

    const revealItems = new Set();

    reveals.forEach((element) => {
        const revealSelf = element.matches("p, a, figure") || !element.children.length;

        if (revealSelf) {
            revealItems.add(element);
            return;
        }

        Array.from(element.children).forEach((child) => {
            if (!child.hasAttribute("data-stagger")) revealItems.add(child);
        });
    });

    Array.from(revealItems).forEach((element, index) => {
        revealWhenReached(element, {
            x: index % 2 === 0 ? 14 : -14,
            y: 34
        });
    });

    staggerGroups.forEach((group) => {
        const children = Array.from(group.children);
        if (!children.length) return;

        children.forEach((element, index) => {
            revealWhenReached(element, {
                x: index % 2 === 0 ? -16 : 16,
                y: 32,
                duration: 0.72
            });
        });
    });

    const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
    heroTimeline
        .to(heroWords, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.05,
            stagger: 0.14
        })
        .to(heroReveals, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1
        }, "-=0.58");

    gsap.to(".university-hero-mark", {
        yPercent: 12,
        rotate: 4,
        ease: "none",
        scrollTrigger: {
            trigger: ".university-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(".university-hero-copy", {
        yPercent: -8,
        autoAlpha: 0.28,
        ease: "none",
        scrollTrigger: {
            trigger: ".university-hero",
            start: "35% top",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.utils.toArray(".front-giant-index, .university-watermark").forEach((element) => {
        gsap.fromTo(element, { xPercent: 5 }, {
            xPercent: -5,
            ease: "none",
            scrollTrigger: {
                trigger: element.closest("section"),
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2
            }
        });
    });

    gsap.to(".university-started-orbit", {
        rotate: 22,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
            trigger: ".started-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4
        }
    });

    if (window.Lenis) {
        const lenis = new Lenis({
            duration: 1.05,
            smoothWheel: true,
            wheelMultiplier: 0.92
        });

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    const progressBar = document.querySelector(".scroll-progress-bar");
    if (progressBar) {
        gsap.set(progressBar, { transformOrigin: "left center", scaleX: 0 });
        gsap.to(progressBar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.documentElement,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.15
            }
        });
    }

    window.addEventListener("load", () => ScrollTrigger.refresh());
});
