document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const page = document.querySelector(".network-page");

    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!window.gsap || !window.ScrollTrigger || reducedMotion) {
        root.classList.add("network-motion-ready");
        root.classList.remove("network-js");
        return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ nullTargetWarn: false });

    const heroWords = gsap.utils.toArray(".network-hero h1 > span");
    const heroReveals = gsap.utils.toArray(".network-hero [data-network-hero]");
    const headings = gsap.utils.toArray("[data-network-heading]");
    const reveals = gsap.utils.toArray("[data-network-reveal]");
    const staggerGroups = gsap.utils.toArray("[data-network-stagger]");
    const animated = new WeakSet();

    const revealWhenReached = (element, options = {}) => {
        if (!element || animated.has(element)) return;
        animated.add(element);

        gsap.set(element, {
            autoAlpha: 0,
            x: options.x || 0,
            y: options.y ?? 38,
            clipPath: options.clipPath || "inset(0 0 14% 0)"
        });

        ScrollTrigger.create({
            trigger: element,
            start: options.start || "top 89%",
            once: true,
            onEnter: () => {
                gsap.to(element, {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    clipPath: "inset(0 0 0% 0)",
                    duration: options.duration || 0.82,
                    ease: options.ease || "power3.out",
                    clearProps: "transform,clip-path"
                });
            }
        });
    };

    gsap.set(heroWords, { autoAlpha: 0, yPercent: 112 });
    gsap.set(heroReveals, { autoAlpha: 0, y: 28 });

    headings.forEach((heading) => {
        Array.from(heading.children).forEach((element, index) => {
            revealWhenReached(element, {
                x: index < 2 ? -20 : 0,
                y: index === heading.children.length - 1 ? 52 : 22,
                duration: index === heading.children.length - 1 ? 0.98 : 0.7,
                ease: index === heading.children.length - 1 ? "power4.out" : "power3.out"
            });
        });
    });

    reveals.forEach((element, index) => {
        revealWhenReached(element, {
            x: index % 2 === 0 ? -14 : 14,
            y: 36
        });
    });

    staggerGroups.forEach((group) => {
        Array.from(group.children).forEach((element, index) => {
            revealWhenReached(element, {
                x: index % 2 === 0 ? -18 : 18,
                y: 34,
                duration: 0.76
            });
        });
    });

    root.classList.add("network-motion-ready");

    const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
    heroTimeline
        .to(heroWords, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.08,
            stagger: 0.14
        })
        .to(heroReveals, {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            stagger: 0.1
        }, "-=0.62");

    gsap.to(".network-orbit-one", {
        rotate: 360,
        duration: 34,
        repeat: -1,
        ease: "none"
    });

    gsap.to(".network-orbit-two", {
        rotate: -360,
        duration: 48,
        repeat: -1,
        ease: "none"
    });

    gsap.to(".network-hero-mark", {
        yPercent: 10,
        rotate: 3,
        ease: "none",
        scrollTrigger: {
            trigger: ".network-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(".network-hero-copy", {
        yPercent: -7,
        autoAlpha: 0.32,
        ease: "none",
        scrollTrigger: {
            trigger: ".network-hero",
            start: "34% top",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.utils.toArray(".business-watermark, .ai-watermark").forEach((element) => {
        gsap.fromTo(element, { xPercent: 5 }, {
            xPercent: -5,
            ease: "none",
            scrollTrigger: {
                trigger: element.closest("section"),
                start: "top bottom",
                end: "bottom top",
                scrub: 1.15
            }
        });
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
