/* Masjid and Madrassah Revival motion system */

(() => {
    const root = document.documentElement;

    if (!window.gsap || !window.ScrollTrigger) {
        root.classList.remove("revival-js");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const headingParts = gsap.utils.toArray("[data-revival-heading]:not(.revival-sticky-heading) > *");
    const standaloneObjects = gsap.utils.toArray("[data-revival-reveal]");
    const staggerObjects = gsap.utils.toArray("[data-stagger] > *");
    const allRevealObjects = [...headingParts, ...standaloneObjects, ...staggerObjects];

    if (prefersReducedMotion) {
        gsap.set(allRevealObjects, { autoAlpha: 1, clearProps: "all" });
        gsap.set("[data-hero-reveal], .revival-hero h1 > span", { autoAlpha: 1, clearProps: "all" });
        root.classList.add("revival-motion-ready");
        root.classList.remove("revival-js");
        return;
    }

    const revealObject = (element, index) => {
        const isHeading = element.parentElement?.matches("[data-revival-heading]");
        const isGridObject = element.parentElement?.matches("[data-stagger]");
        const direction = isGridObject && index % 2 ? 18 : -18;

        gsap.set(element, {
            autoAlpha: 0,
            y: isHeading ? 48 : 34,
            x: isGridObject ? direction : 0,
            clipPath: isHeading ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)"
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
                    clipPath: "inset(0 0 0% 0)",
                    duration: isHeading ? 0.95 : 0.76,
                    ease: "power3.out",
                    clearProps: "transform,clip-path"
                });
            }
        });
    };

    allRevealObjects.forEach(revealObject);
    root.classList.add("revival-motion-ready");

    gsap.set(".revival-hero h1 > span", { autoAlpha: 0, yPercent: 115 });
    gsap.set(".revival-hero [data-hero-reveal]", { autoAlpha: 0, y: 28 });
    root.classList.remove("revival-js");

    gsap.timeline({ defaults: { ease: "power4.out" } })
        .to(".revival-hero .revival-kicker", { autoAlpha: 1, y: 0, duration: 0.72 }, 0.12)
        .to(".revival-hero h1 > span", {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.08,
            stagger: 0.13
        }, 0.24)
        .to(".revival-hero-bottom", { autoAlpha: 1, y: 0, duration: 0.82 }, 0.72)
        .to(".revival-hero-mark", { autoAlpha: 1, y: 0, duration: 0.9 }, 0.48);

    gsap.to(".revival-hero-mark", {
        yPercent: 10,
        rotate: 3,
        ease: "none",
        scrollTrigger: {
            trigger: ".revival-hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.7
        }
    });

    gsap.to(".revival-hero-inner", {
        yPercent: 12,
        autoAlpha: 0.28,
        ease: "none",
        scrollTrigger: {
            trigger: ".revival-hero",
            start: "38% top",
            end: "bottom top",
            scrub: 0.6
        }
    });

    gsap.utils.toArray(".solution-watermark, .vision-watermark").forEach((element) => {
        gsap.fromTo(element, { xPercent: 4 }, {
            xPercent: -7,
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
