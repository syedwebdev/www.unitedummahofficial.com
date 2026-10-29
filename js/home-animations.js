/* ========================================
   UNITED UMMAH HOME - MOTION SYSTEM
======================================== */

(() => {
    const root = document.documentElement;

    if (!window.gsap || !window.ScrollTrigger) {
        root.classList.remove("home-js");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealSelector = [
        ".home-heading",
        ".home-front-heading",
        ".home-copy > p",
        "[data-home-stagger] > *",
        ".home-action-row",
        ".home-system-final",
        ".home-final-mantra"
    ].join(", ");
    const revealTargets = [...new Set(gsap.utils.toArray(revealSelector))];

    if (prefersReducedMotion) {
        gsap.set([
            ...revealTargets,
            ...gsap.utils.toArray(".home-hero h1 > span, .home-hero [data-home-reveal]")
        ], { clearProps: "all" });
        root.classList.add("home-motion-ready");
        root.classList.remove("home-js");
        return;
    }

    gsap.set(".home-hero h1 > span", { autoAlpha: 0, yPercent: 115 });
    gsap.set(".home-hero [data-home-reveal]", { autoAlpha: 0, y: 26 });
    gsap.set(".home-hero [data-home-stagger] > *", { autoAlpha: 0, x: 18 });

    revealTargets.forEach((element) => {
        if (element.closest(".home-hero")) return;

        const isHeading = element.matches(".home-heading, .home-front-heading");
        const isStaggerItem = Boolean(element.parentElement?.matches("[data-home-stagger]"));
        const fromRight = Boolean(element.closest(".home-network, .home-journey-gateway"));

        gsap.set(element, {
            autoAlpha: 0,
            y: isHeading ? 58 : 30,
            x: isStaggerItem ? (fromRight ? 18 : -18) : 0
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
                    duration: isHeading ? 1 : 0.76,
                    ease: "power3.out",
                    clearProps: "transform,opacity,visibility"
                });
            }
        });
    });

    root.classList.add("home-motion-ready");

    const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
    heroTimeline
        .to(".home-hero .home-kicker", { autoAlpha: 1, y: 0, duration: 0.65 }, 0.1)
        .to(".home-hero h1 > span", {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.12,
            stagger: 0.13
        }, 0.2)
        .to(".home-hero-intro", { autoAlpha: 1, y: 0, duration: 0.78 }, 0.64)
        .to(".home-hero-actions", { autoAlpha: 1, y: 0, duration: 0.68 }, 0.82)
        .to(".home-hero-declaration > *", {
            autoAlpha: 1,
            x: 0,
            duration: 0.58,
            stagger: 0.08
        }, 0.72)
        .to(".home-hero-mantra", { autoAlpha: 1, y: 0, duration: 0.72 }, 1.02);

    gsap.to(".home-hero-media", {
        yPercent: 11,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
            trigger: ".home-hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8
        }
    });

    gsap.to(".home-hero-inner", {
        yPercent: 10,
        autoAlpha: 0.34,
        ease: "none",
        scrollTrigger: {
            trigger: ".home-hero",
            start: "45% top",
            end: "bottom top",
            scrub: 0.65
        }
    });

    gsap.utils.toArray(".home-system-word, .home-support-word, .home-university-mark, .home-front-number").forEach((element) => {
        gsap.fromTo(element, { xPercent: 4 }, {
            xPercent: -5,
            ease: "none",
            scrollTrigger: {
                trigger: element.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });

    gsap.utils.toArray(".home-plan-orbit, .home-started-orbit").forEach((element, index) => {
        gsap.to(element, {
            rotation: index ? -24 : 20,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
                trigger: element.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1
            }
        });
    });

    gsap.fromTo(".home-journey-sequence", { "--journey-line-scale": 0 }, {
        "--journey-line-scale": 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".home-journey-sequence",
            start: "top 82%",
            end: "bottom 45%",
            scrub: 0.7
        }
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
