/* ========================================
   COLLABORATE WITH US - MOTION SYSTEM
======================================== */

(() => {
    const root = document.documentElement;

    if (!window.gsap || !window.ScrollTrigger) {
        root.classList.remove("collab-js");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = [
        ...new Set(gsap.utils.toArray(
            "[data-collab-heading], [data-collab-reveal], [data-collab-stagger] > *"
        ))
    ];

    if (prefersReducedMotion) {
        gsap.set(revealTargets, { clearProps: "all" });
        root.classList.add("collab-motion-ready");
        root.classList.remove("collab-js");
        return;
    }

    gsap.set(".collab-hero h1 > span", { autoAlpha: 0, yPercent: 112 });
    gsap.set(".collab-hero [data-collab-hero]", { autoAlpha: 0, y: 28 });

    revealTargets.forEach((element) => {
        const isHeading = element.hasAttribute("data-collab-heading");
        const isStaggerItem = Boolean(element.parentElement?.hasAttribute("data-collab-stagger"));

        gsap.set(element, {
            autoAlpha: 0,
            x: isStaggerItem ? -18 : 0,
            y: isHeading ? 58 : 34
        });

        ScrollTrigger.create({
            trigger: element,
            start: "top 88%",
            once: true,
            onEnter: () => {
                gsap.to(element, {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    duration: isHeading ? 0.95 : 0.74,
                    ease: "power3.out",
                    clearProps: "transform,opacity,visibility"
                });
            }
        });
    });

    root.classList.add("collab-motion-ready");

    const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTimeline
        .to(".collab-hero-top", { autoAlpha: 1, y: 0, duration: 0.72 }, 0.08)
        .to(".collab-hero h1 > span", {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.08,
            stagger: 0.13
        }, 0.18)
        .to(".collab-hero-bottom", { autoAlpha: 1, y: 0, duration: 0.78 }, 0.62)
        .from(".collab-hero-nodes span", {
            autoAlpha: 0,
            x: 20,
            duration: 0.55,
            stagger: 0.1
        }, 0.72);

    gsap.to(".collab-hero-media", {
        yPercent: 12,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
            trigger: ".collab-hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8
        }
    });

    gsap.to(".collab-orbit-one", {
        rotation: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".collab-hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.9
        }
    });

    gsap.to(".collab-orbit-two", {
        rotation: -32,
        ease: "none",
        scrollTrigger: {
            trigger: ".collab-hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.7
        }
    });

    gsap.utils.toArray(".front-detail-icon").forEach((icon) => {
        gsap.fromTo(icon, { rotation: -8, scale: 0.9 }, {
            rotation: 8,
            scale: 1.04,
            ease: "none",
            scrollTrigger: {
                trigger: icon.closest("section"),
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });

    if (window.Lenis) {
        const lenis = new Lenis({
            duration: 1.05,
            smoothWheel: true,
            wheelMultiplier: 0.9
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
                end: "max",
                scrub: 0.1
            }
        });
    }

    window.addEventListener("load", () => ScrollTrigger.refresh());
})();
