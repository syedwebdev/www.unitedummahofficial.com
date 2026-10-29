/* ========================================
   SUPPORT US - ONE-TIME MOTION SYSTEM
======================================== */

(() => {
    const root = document.documentElement;

    if (!window.gsap || !window.ScrollTrigger) {
        root.classList.remove("support-js");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = [
        ...new Set(gsap.utils.toArray(
            "[data-support-heading], [data-support-reveal], [data-support-stagger] > *"
        ))
    ];

    if (prefersReducedMotion) {
        gsap.set(revealTargets, { clearProps: "all" });
        root.classList.add("support-motion-ready");
        root.classList.remove("support-js");
        return;
    }

    gsap.set(".support-hero h1 > span", { autoAlpha: 0, yPercent: 112 });
    gsap.set(".support-hero [data-support-hero]", { autoAlpha: 0, y: 28 });

    revealTargets.forEach((element) => {
        const isHeading = element.hasAttribute("data-support-heading");
        const isStaggerItem = Boolean(element.parentElement?.hasAttribute("data-support-stagger"));
        const itemIndex = isStaggerItem ? [...element.parentElement.children].indexOf(element) : 0;

        gsap.set(element, {
            autoAlpha: 0,
            x: isStaggerItem ? (itemIndex % 2 === 0 ? -22 : 22) : 0,
            y: isHeading ? 58 : 34
        });

        ScrollTrigger.create({
            trigger: element,
            start: "top 90%",
            once: true,
            onEnter: () => {
                gsap.to(element, {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    duration: isHeading ? 0.96 : 0.76,
                    delay: isStaggerItem ? Math.min(itemIndex * 0.045, 0.24) : 0,
                    ease: "power3.out",
                    clearProps: "transform,opacity,visibility"
                });
            }
        });
    });

    root.classList.add("support-motion-ready");

    const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTimeline
        .to(".support-hero .support-kicker", { autoAlpha: 1, y: 0, duration: 0.72 }, 0.08)
        .to(".support-hero h1 > span", {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.08,
            stagger: 0.13
        }, 0.18)
        .to(".support-hero .support-hero-bottom", { autoAlpha: 1, y: 0, duration: 0.78 }, 0.62)
        .from(".support-hero-ledger span", {
            autoAlpha: 0,
            y: 18,
            duration: 0.55,
            stagger: 0.1
        }, 0.68);

    gsap.to(".support-hero-media", {
        yPercent: 10,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
            trigger: ".support-hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8
        }
    });

    gsap.utils.toArray(".student-marker strong, .amanah-seal iconify-icon").forEach((element) => {
        gsap.fromTo(element, { y: -8 }, {
            y: 10,
            ease: "none",
            scrollTrigger: {
                trigger: element.closest("section"),
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
