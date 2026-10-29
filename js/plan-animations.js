/* ========================================
   OUR COMPLETE PLAN - MOTION SYSTEM
======================================== */

(() => {
    const root = document.documentElement;

    if (!window.gsap || !window.ScrollTrigger) {
        root.classList.remove("plan-js");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealTargets = gsap.utils.toArray(
        ".plan-section-head, .front-header, .plan-copy > p, [data-stagger] > *, .plan-action-row"
    );

    if (prefersReducedMotion) {
        gsap.set(revealTargets, { clearProps: "all" });
        root.classList.add("plan-motion-ready");
        root.classList.remove("plan-js");
        return;
    }

    gsap.set(".plan-hero h1 > span", { autoAlpha: 0, yPercent: 110 });
    gsap.set(".plan-hero [data-plan-reveal]", { autoAlpha: 0, y: 24 });

    revealTargets.forEach((element) => {
        const isHeading = element.matches(".plan-section-head, .front-header");
        const isStaggerItem = Boolean(element.parentElement?.matches("[data-stagger]"));

        gsap.set(element, {
            autoAlpha: 0,
            y: isHeading ? 54 : 30,
            x: isStaggerItem ? -14 : 0
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
                    duration: isHeading ? 0.95 : 0.72,
                    ease: "power3.out",
                    clearProps: "transform,opacity,visibility"
                });
            }
        });
    });

    root.classList.add("plan-motion-ready");

    const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTimeline
        .to(".plan-hero .plan-kicker", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.12)
        .to(".plan-hero h1 > span", {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.1,
            stagger: 0.12
        }, 0.22)
        .to(".plan-hero-bottom", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.65);

    gsap.to(".plan-hero-media", {
        yPercent: 12,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
            trigger: ".plan-hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.7
        }
    });

    gsap.to(".plan-hero-inner", {
        yPercent: 15,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: {
            trigger: ".plan-hero",
            start: "35% top",
            end: "bottom top",
            scrub: 0.6
        }
    });

    gsap.utils.toArray(".front-giant-number, .university-watermark").forEach((element) => {
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

    gsap.to(".started-glow", {
        scale: 1.25,
        rotation: 8,
        ease: "none",
        scrollTrigger: {
            trigger: ".started-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.utils.toArray(".skills-track span").forEach((element, index) => {
        gsap.to(element, {
            y: index % 2 === 0 ? -12 : 12,
            rotation: index % 2 === 0 ? 4 : -4,
            duration: 2.4 + (index % 3) * 0.35,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.12
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
