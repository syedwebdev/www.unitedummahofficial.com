(function () {
    // Keep content visible when motion is reduced or animation dependencies fail.
    if (!window.gsap || !window.ScrollTrigger || !window.Lenis ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

/* =================================
   UNITED UMMAH
   SCROLL ANIMATION SYSTEM
================================= */

gsap.registerPlugin(ScrollTrigger);

/* =========================================
   SAFE PER ELEMENT REVEAL SYSTEM V2
   Hidden before viewport → reveal on arrival
========================================= */

function revealOnScroll(
    elements,
    fromVars = {},
    options = {}
) {

    const targets =
        typeof elements === "string"
            ? gsap.utils.toArray(elements)
            : gsap.utils.toArray(elements);


    targets.forEach((element) => {

        if (!element) return;


        const start =
            options.start || "top 86%";


        /* ---------------------------------
           Check current element position
        --------------------------------- */

        const rect =
            element.getBoundingClientRect();


        /*
           If page refreshed halfway down and
           element is already above viewport,
           DO NOT hide it.
        */

        if (rect.bottom <= 0) {

            gsap.set(element, {
                opacity: 1,
                visibility: "visible"
            });

            return;

        }


        /* ---------------------------------
           INITIAL HIDDEN STATE

           Only JS applies this.
           If JS fails, normal CSS stays visible.
        --------------------------------- */

        gsap.set(element, {

            opacity: 0,
            visibility: "hidden",

            ...fromVars

        });


        /* ---------------------------------
           INDIVIDUAL SCROLL TRIGGER
        --------------------------------- */

        ScrollTrigger.create({

            trigger: element,

            start: start,

            once: true,

            onEnter: () => {

                const finalState = {

                    x: 0,
                    y: 0,

                    scale: 1,
                    rotate: 0,

                    opacity: 1,
                    visibility: "visible",

                    duration:
                        options.duration || 0.8,

                    ease:
                        options.ease || "power3.out",

                    clearProps:
                        "transform,opacity,visibility,clipPath"

                };


                /*
                   If masked reveal is being used
                */

                if (fromVars.clipPath) {

                    finalState.clipPath =
                        "inset(0 0 0 0)";

                }


                gsap.to(
                    element,
                    finalState
                );

            }

        });

    });


    /* Recalculate positions safely */

    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });

}

function prepareRevealElements(elements) {

    const targets =
        typeof elements === "string"
            ? gsap.utils.toArray(elements)
            : gsap.utils.toArray(elements);


    targets
        .filter(Boolean)
        .forEach((element) => {

            const rect =
                element.getBoundingClientRect();


            if (rect.bottom <= 0) {

                gsap.set(element, {
                    opacity: 1,
                    visibility: "visible"
                });

                return;

            }


            gsap.set(element, {
                opacity: 0,
                visibility: "visible"
            });

        });

}

function revealHeadingOnScroll(
    element,
    fromVars = {},
    options = {}
) {

    if (!element) return;

    const rect =
        element.getBoundingClientRect();


    if (rect.bottom <= 0) {

        gsap.set(element, {
            autoAlpha: 1,
            clipPath: "inset(0 0 0 0)"
        });

        return;

    }


    gsap.from(element, {
        autoAlpha: 0,
        ...fromVars,

        duration: options.duration || 1,
        ease: options.ease || "power4.out",

        immediateRender: true,
        clearProps: "transform,opacity,visibility,clipPath",

        scrollTrigger: {
            trigger: element,
            start: options.start || "top 78%",
            once: true
        }
    });

}



/* =================================
   LENIS SMOOTH SCROLL
================================= */

const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.1
});


lenis.on("scroll", ScrollTrigger.update);


gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});


gsap.ticker.lagSmoothing(0);


/* =================================
   SCROLL PROGRESS BAR
================================= */

gsap.to(".scroll-progress-bar", {

    scaleX: 1,

    ease: "none",

    scrollTrigger: {
        trigger: document.documentElement,

        start: "top top",
        end: "bottom bottom",

        scrub: 0.15
    }

});


/* =================================
   JOURNEY HERO
   CINEMATIC ENTRANCE
================================= */

const journeyHero = document.querySelector(".journey-hero");

if (journeyHero) {

    const heroTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    heroTimeline.from(
        ".journey-hero-visual",
        {
            autoAlpha: 0,
            duration: 1.6,
            ease: "power2.out"
        },
        0
    );


    /* Small label enters from left */

    heroTimeline.from(
        ".journey-hero .page-label",
        {
            x: -35,
            autoAlpha: 0,
            duration: 0.8
        }
    );


    /* Giant heading reveal */

    heroTimeline.from(
        ".journey-hero h1",
        {
            y: 70,
            autoAlpha: 0,

            clipPath: "inset(0 0 100% 0)",

            duration: 1.15
        },
        "-=0.35"
    );


    /* Intro paragraph */

    heroTimeline.from(
        ".journey-hero-content > p:not(.journey-question)",
        {
            y: 30,
            autoAlpha: 0,

            duration: 0.85
        },
        "-=0.45"
    );


    /* Red line draws itself */

    heroTimeline.from(
        ".journey-hero-line",
        {
            scaleX: 0,

            transformOrigin: "left center",

            duration: 0.75,

            ease: "power2.out"
        },
        "-=0.35"
    );


    /* Final question rises in */

    heroTimeline.from(
        ".journey-hero .journey-question",
        {
            y: 25,
            autoAlpha: 0,

            duration: 0.8
        },
        "-=0.35"
    );


    /* =================================
       HERO SCROLL PARALLAX
    ================================= */

    gsap.to(".journey-hero h1", {

        yPercent: -10,

        ease: "none",

        scrollTrigger: {
            trigger: ".journey-hero",

            start: "top top",
            end: "bottom top",

            scrub: 1
        }

    });


    gsap.to(".journey-hero-content", {

        opacity: 0.72,

        ease: "none",

        scrollTrigger: {
            trigger: ".journey-hero",

            start: "55% top",
            end: "bottom top",

            scrub: true
        }

    });

}


/* =================================
   BREAKING POINT
   PER ELEMENT SCROLL REVEAL
================================= */

const breakingSection =
    document.querySelector(".journey-breaking-point");

if (breakingSection) {

    const breakingLabel =
        breakingSection.querySelector(".page-label");

    const breakingItems =
        breakingSection.querySelectorAll(".breaking-point-item");

    const breakingQuestions =
        breakingSection.querySelector(".breaking-questions");

    const founderOrigin =
        breakingSection.querySelector(".founder-origin");


    /* Label */

    if (breakingLabel) {

        revealOnScroll(
            breakingLabel,
            {
                x: -30
            },
            {
                start: "top 90%",
                duration: 0.65
            }
        );

    }


    /* ---------------------------------
       Story items
       Each item gets its OWN trigger
    --------------------------------- */

    breakingItems.forEach((item, index) => {

        revealOnScroll(
            item,
            {
                x: index % 2 === 0 ? -30 : 30,
                y: 35
            },
            {
                start: "top 88%",
                duration: 0.7
            }
        );

    });


    /* Questions panel */

    if (breakingQuestions) {

        revealOnScroll(
            breakingQuestions,
            {
                x: 50,
                scale: 0.97
            },
            {
                start: "top 86%",
                duration: 0.85,
                ease: "power4.out"
            }
        );

    }


    /* Founder origin */

    if (founderOrigin) {

        revealOnScroll(
            founderOrigin,
            {
                y: 40
            },
            {
                start: "top 88%",
                duration: 0.8
            }
        );

    }

}

/* =================================
   FROM REACTION TO STRATEGY
   DIRECTIONAL REVEAL
================================= */

const strategySection = document.querySelector(".journey-strategy");

if (strategySection) {

    const strategyTL = gsap.timeline({

        scrollTrigger: {
            trigger: ".journey-strategy",
            start: "top 72%",
            toggleActions: "play none none none"
        }

    });


    /* Label */

    strategyTL.from(
        ".journey-strategy .page-label",
        {
            x: -30,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.out"
        }
    );


    /* Main Heading */

    strategyTL.from(
        ".journey-strategy h2",
        {
            y: 65,
            autoAlpha: 0,

            clipPath: "inset(100% 0 0 0)",

            duration: 1,
            ease: "power4.out"
        },
        "-=0.3"
    );


    /* Normal paragraphs */

    const strategyParagraphs = gsap.utils.toArray(
        ".strategy-content > p:not(.strategy-highlight)"
    );

    strategyParagraphs.forEach((paragraph, index) => {

        gsap.from(paragraph, {

            x: index % 2 === 0 ? -45 : 45,
            autoAlpha: 0,

            duration: 0.75,
            ease: "power3.out",

            scrollTrigger: {
                trigger: paragraph,
                start: "top 88%"
            }

        });

    });


    /* Highlight statement */

    gsap.from(
        ".strategy-highlight",
        {
            scale: 0.94,
            y: 35,
            autoAlpha: 0,

            transformOrigin: "left center",

            duration: 0.9,
            ease: "power3.out",

            scrollTrigger: {
                trigger: ".strategy-highlight",
                start: "top 85%"
            }
        }
    );


    /* Highlight subtle scroll zoom */

    gsap.to(
        ".strategy-highlight",
        {
            scale: 1.035,

            ease: "none",

            scrollTrigger: {
                trigger: ".strategy-highlight",

                start: "top 85%",
                end: "bottom 35%",

                scrub: 1
            }
        }
    );

}

/* =================================
   PALESTINE DEFENCE BILL
   DOCUMENTARY REVEAL
================================= */

const billSection = document.querySelector(".journey-bill");

if (billSection) {

    const billLabel =
        billSection.querySelector(".page-label");

    const billHeading =
        billSection.querySelector("h2");

    const billParagraphs =
        billSection.querySelectorAll(".bill-content > p");

    const billStatement =
        billSection.querySelector(".bill-statement");


    if (billLabel) {

        revealOnScroll(
            billLabel,
            {
                y: 20
            },
            {
                start: "top 90%",
                duration: 0.6,
                ease: "power2.out"
            }
        );

    }


    if (billHeading) {

        revealOnScroll(
            billHeading,
            {
                x: -80
            },
            {
                start: "top 86%",
                duration: 1,
                ease: "power4.out"
            }
        );

    }


    billParagraphs.forEach((paragraph) => {

        revealOnScroll(
            paragraph,
            {
                y: 40
            },
            {
                start: "top 88%",
                duration: 0.75
            }
        );

    });


    if (billStatement) {

        revealOnScroll(
            billStatement,
            {
                x: 60
            },
            {
                start: "top 86%",
                duration: 0.95,
                ease: "power4.out"
            }
        );

    }


    if (billStatement) {

        gsap.to(
            billStatement,
            {
                scale: 1.025,

                ease: "none",

                scrollTrigger: {
                    trigger: billStatement,

                    start: "top 85%",
                    end: "bottom 35%",

                    scrub: 1
                }
            }
        );

    }

}

/* =================================
   ISTIFTA & FATAWA
   EVIDENCE REVEAL
================================= */

const fatwaSection = document.querySelector(".journey-fatwa");

if (fatwaSection) {

    const fatwaLabel =
        fatwaSection.querySelector(".page-label");

    const fatwaHeading =
        fatwaSection.querySelector("h2");

    const fatwaParagraphs =
        fatwaSection.querySelectorAll(".fatwa-content > p");

    const fatwaCards =
        fatwaSection.querySelectorAll(".fatwa-card");


    if (fatwaLabel) {

        revealOnScroll(
            fatwaLabel,
            {
                x: -25
            },
            {
                start: "top 90%",
                duration: 0.65
            }
        );

    }


    if (fatwaHeading) {

        revealHeadingOnScroll(
            fatwaHeading,
            {
                y: 60,
                clipPath: "inset(100% 0 0 0)"
            },
            {
                start: "top 86%",
                duration: 1,
                ease: "power4.out"
            }
        );

    }


    fatwaParagraphs.forEach((paragraph) => {

        revealOnScroll(
            paragraph,
            {
                y: 35
            },
            {
                start: "top 88%",
                duration: 0.7
            }
        );

    });


    fatwaCards.forEach((card) => {

        revealOnScroll(
            card,
            {
                y: 45,
                scale: 0.95
            },
            {
                start: "top 86%",
                duration: 0.8,
                ease: "back.out(1.4)"
            }
        );

    });


    const fatwaEvidenceLinks = gsap.utils.toArray(
        ".fatwa-links .evidence-link"
    );

    revealOnScroll(
        fatwaEvidenceLinks,
        {
            x: 40
        },
        {
            start: "top 88%",
            duration: 0.7
        }
    );


    /* Very subtle parallax on cards */

    gsap.to(".fatwa-card", {

        y: -22,

        ease: "none",

        scrollTrigger: {
            trigger: ".journey-fatwa",

            start: "top bottom",
            end: "bottom top",

            scrub: 1.2
        }

    });

}


/* =================================
   BUILDING NATIONAL PRESSURE
   CAMPAIGN MOMENTUM
================================= */

const pressureSection = document.querySelector(".journey-pressure");

if (pressureSection) {

    const pressureLabel =
        pressureSection.querySelector(".page-label");

    const pressureHeading =
        pressureSection.querySelector("h2");

    const pressureParagraphs =
        pressureSection.querySelectorAll(
            ".pressure-content > p:not(.pressure-highlight)"
        );

    const pressureHighlight =
        pressureSection.querySelector(".pressure-highlight");

    const petitionBlock =
        pressureSection.querySelector(".petition-block");

    const petitionNumber =
        pressureSection.querySelector(".petition-number");


    if (pressureLabel) {

        revealOnScroll(
            pressureLabel,
            {
                x: -30
            },
            {
                start: "top 90%",
                duration: 0.65
            }
        );

    }


    if (pressureHeading) {

        revealHeadingOnScroll(
            pressureHeading,
            {
                y: 70,
                clipPath: "inset(0 0 100% 0)"
            },
            {
                start: "top 86%",
                duration: 1,
                ease: "power4.out"
            }
        );

    }


    pressureParagraphs.forEach((paragraph) => {

        revealOnScroll(
            paragraph,
            {
                y: 35
            },
            {
                start: "top 88%",
                duration: 0.7
            }
        );

    });


    if (pressureHighlight) {

        revealOnScroll(
            pressureHighlight,
            {
                x: -55
            },
            {
                start: "top 88%",
                duration: 0.8,
                ease: "power4.out"
            }
        );

    }


    /* Evidence links */

    const pressureEvidenceLinks = gsap.utils.toArray(
    ".journey-pressure .evidence-link"
);

if (pressureEvidenceLinks.length) {

    revealOnScroll(
        pressureEvidenceLinks,
        {
            x: 35
        },
        {
            start: "top 90%",
            duration: 0.7
        }
    );

}


    if (petitionBlock) {

        revealOnScroll(
            petitionBlock,
            {
                y: 60,
                scale: 0.95
            },
            {
                start: "top 82%",
                duration: 1,
                ease: "power4.out"
            }
        );

    }


    if (petitionNumber) {

        revealOnScroll(
            petitionNumber,
            {
                scale: 0.65
            },
            {
                start: "top 78%",
                duration: 1.1,
                ease: "expo.out"
            }
        );

    }


    /* Subtle scroll zoom */

    if (petitionBlock) {

        gsap.to(
            petitionBlock,
            {
                scale: 1.025,

                ease: "none",

                scrollTrigger: {
                    trigger: petitionBlock,

                    start: "top 85%",
                    end: "bottom 25%",

                    scrub: 1
                }
            }
        );

    }

}


/* =================================
   GLOBAL SUMUD FLOTILLA
   SAFE DOCUMENTARY REVEAL
================================= */

const flotillaSection = document.querySelector(".journey-flotilla");

if (flotillaSection) {

    const flotillaLabel =
        flotillaSection.querySelector(".page-label");

    const flotillaHeading =
        flotillaSection.querySelector("h2");

    const flotillaParagraphs =
        flotillaSection.querySelectorAll(".flotilla-content > p");

    const flotillaRole =
        flotillaSection.querySelector(".flotilla-role");

    const flotillaLesson =
        flotillaSection.querySelector(".flotilla-lesson");


    if (flotillaLabel) {

        revealOnScroll(
            flotillaLabel,
            {
                x: -30
            },
            {
                start: "top 90%",
                duration: 0.65
            }
        );

    }


    if (flotillaHeading) {

        revealHeadingOnScroll(
            flotillaHeading,
            {
                y: 60,
                clipPath: "inset(0 0 100% 0)"
            },
            {
                start: "top 86%",
                duration: 1,
                ease: "power4.out"
            }
        );

    }


    flotillaParagraphs.forEach((paragraph) => {

        revealOnScroll(
            paragraph,
            {
                y: 30
            },
            {
                start: "top 88%",
                duration: 0.7
            }
        );

    });


    if (flotillaRole) {

        revealOnScroll(
            flotillaRole,
            {
                x: -55
            },
            {
                start: "top 86%",
                duration: 0.85,
                ease: "power4.out"
            }
        );

    }


    if (flotillaLesson) {

        revealOnScroll(
            flotillaLesson,
            {
                scale: 0.96,
                y: 35
            },
            {
                start: "top 86%",
                duration: 0.9
            }
        );

    }

}


/* =================================
   THE LIMIT OF PRESSURE
   SAFE TURNING POINT REVEAL
================================= */

const limitSection = document.querySelector(".journey-limit");

if (limitSection) {

    const limitLabel =
        limitSection.querySelector(".page-label");

    const limitHeading =
        limitSection.querySelector("h2");

    const limitParagraphs =
        limitSection.querySelectorAll(".limit-content > p");

    const authorityBlock =
        limitSection.querySelector(".authority-block");

    const limitTruth =
        limitSection.querySelector(".limit-truth");

    const conditionItems =
        limitSection.querySelectorAll(
            ".condition-list > *, .limit-condition-list > *"
        );

    const limitEnding =
        limitSection.querySelector(
            ".limit-ending, .limit-conclusion"
        );


    if (limitLabel) {

        revealOnScroll(
            limitLabel,
            {
                x: -30
            },
            {
                start: "top 90%",
                duration: 0.65
            }
        );

    }


    if (limitHeading) {

        revealHeadingOnScroll(
            limitHeading,
            {
                y: 65,
                clipPath: "inset(100% 0 0 0)"
            },
            {
                start: "top 86%",
                duration: 1,
                ease: "power4.out"
            }
        );

    }


    limitParagraphs.forEach((paragraph) => {

        revealOnScroll(
            paragraph,
            {
                y: 28
            },
            {
                start: "top 88%",
                duration: 0.65
            }
        );

    });


    if (authorityBlock) {

        revealOnScroll(
            authorityBlock,
            {
                y: -35,
                scale: 0.97
            },
            {
                start: "top 86%",
                duration: 0.85
            }
        );

    }


    if (limitTruth) {

        revealOnScroll(
            limitTruth,
            {
                x: 55
            },
            {
                start: "top 86%",
                duration: 0.9,
                ease: "power4.out"
            }
        );

    }


    conditionItems.forEach((item) => {

        revealOnScroll(
            item,
            {
                y: 30
            },
            {
                start: "top 88%",
                duration: 0.6
            }
        );

    });


    if (limitEnding) {

        revealOnScroll(
            limitEnding,
            {
                scale: 0.97,
                y: 30
            },
            {
                start: "top 86%",
                duration: 0.8
            }
        );

    }


    /* =================================
       SUBTLE HEADING PARALLAX
       Transform only, never opacity
    ================================= */

    if (limitHeading) {

        gsap.to(limitHeading, {

            yPercent: -7,

            ease: "none",

            scrollTrigger: {

                trigger: limitSection,

                start: "top bottom",
                end: "bottom top",

                scrub: 1.2

            }

        });

    }

}


/* =================================
   THE QUESTION BECAME BIGGER
   SAFE EXPANDING REVEAL
================================= */

const biggerSection = document.querySelector(".journey-question-bigger");

if (biggerSection) {

    const biggerLabel =
        biggerSection.querySelector(".page-label");

    const biggerIntro =
        biggerSection.querySelector(".bigger-intro, .question-bigger-intro");

    const biggerHeading =
        biggerSection.querySelector("h2");

    const biggerItems =
        biggerSection.querySelectorAll(".bigger-question-item");

    const preparationShift =
        biggerSection.querySelector(".preparation-shift");


    if (biggerLabel) {

        revealOnScroll(
            biggerLabel,
            {
                x: -30
            },
            {
                start: "top 90%",
                duration: 0.65
            }
        );

    }


    if (biggerIntro) {

        revealOnScroll(
            biggerIntro,
            {
                y: 25
            },
            {
                start: "top 88%",
                duration: 0.7
            }
        );

    }


    if (biggerHeading) {

        revealHeadingOnScroll(
            biggerHeading,
            {
                y: 65,
                clipPath: "inset(0 0 100% 0)"
            },
            {
                start: "top 86%",
                duration: 1,
                ease: "power4.out"
            }
        );

    }


    biggerItems.forEach((item, index) => {

        revealOnScroll(
            item,
            {
                x: index % 2 === 0 ? -45 : 45,
                y: 18
            },
            {
                start: "top 88%",
                duration: 0.65
            }
        );

    });


    if (preparationShift) {

        revealOnScroll(
            preparationShift,
            {
                scale: 0.97,
                y: 40
            },
            {
                start: "top 86%",
                duration: 0.9
            }
        );

    }


    /* =================================
       SUBTLE PARALLAX
       transform only
    ================================= */

    if (biggerHeading) {

        gsap.to(biggerHeading, {

            yPercent: -6,

            ease: "none",

            scrollTrigger: {

                trigger: biggerSection,

                start: "top bottom",
                end: "bottom top",

                scrub: 1.2

            }

        });

    }

}


/* =================================
   MADRASSA TUL TAKWEYAT
   SAFE INSTITUTION REVEAL
================================= */

const takweyatSection = document.querySelector(".journey-takweyat");

if (takweyatSection) {

    const takweyatLabel =
        takweyatSection.querySelector(".page-label");

    const takweyatHeading =
        takweyatSection.querySelector(".takweyat-heading h2");

    const takweyatParagraphs =
        takweyatSection.querySelectorAll(".takweyat-content > p");

    const takweyatRealization =
        takweyatSection.querySelector(".takweyat-realization");

    const takweyatLink =
        takweyatSection.querySelector(".evidence-link");


    if (takweyatLabel) {

        revealOnScroll(
            takweyatLabel,
            {
                x: -30
            },
            {
                start: "top 90%",
                duration: 0.65
            }
        );

    }


    if (takweyatHeading) {

        revealHeadingOnScroll(
            takweyatHeading,
            {
                x: -65,
                clipPath: "inset(0 100% 0 0)"
            },
            {
                start: "top 86%",
                duration: 1,
                ease: "power4.out"
            }
        );

    }


    takweyatParagraphs.forEach((paragraph) => {

        revealOnScroll(
            paragraph,
            {
                y: 30
            },
            {
                start: "top 88%",
                duration: 0.7
            }
        );

    });


    if (takweyatRealization) {

        revealOnScroll(
            takweyatRealization,
            {
                x: 45,
                scale: 0.97
            },
            {
                start: "top 86%",
                duration: 0.9
            }
        );

    }


    if (takweyatLink) {

        revealOnScroll(
            takweyatLink,
            {
                x: 30
            },
            {
                start: "top 88%",
                duration: 0.65
            }
        );

    }


    /* ---------------------------------
       SUBTLE DESKTOP PARALLAX
       Transform only
    --------------------------------- */

    gsap.matchMedia().add("(min-width: 851px)", () => {

        if (takweyatHeading) {

            gsap.to(takweyatHeading, {

                yPercent: -8,

                ease: "none",

                scrollTrigger: {
                    trigger: takweyatSection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2
                }

            });

        }

    });

}


/* =================================
   THE HOSTAGE CAMPAIGN
   SAFE CRISIS REVEAL
================================= */

const hostageSection = document.querySelector(".journey-hostage");

if (hostageSection) {

    const hostageLabel =
        hostageSection.querySelector(".page-label");

    const hostageHeading =
        hostageSection.querySelector(".hostage-header h2");

    const hostageParagraphs =
        hostageSection.querySelectorAll(".hostage-content > p");

    const hostagePetition =
        hostageSection.querySelector(".hostage-petition");

    const hostageNumber =
        hostageSection.querySelector(".hostage-number");

    const hostageLesson =
        hostageSection.querySelector(".hostage-lesson");

    const weaknessItems =
        hostageSection.querySelectorAll(".weakness-list span");


    if (hostageLabel) {
        revealOnScroll(hostageLabel, { x: -30 }, { start: "top 90%", duration: 0.65 });
    }

    if (hostageHeading) {
        revealHeadingOnScroll(
            hostageHeading,
            { y: 65, clipPath: "inset(0 0 100% 0)" },
            { start: "top 86%", duration: 1, ease: "power4.out" }
        );
    }

    hostageParagraphs.forEach((paragraph) => {
        revealOnScroll(paragraph, { y: 28 }, { start: "top 88%", duration: 0.65 });
    });

    if (hostagePetition) {
        revealOnScroll(
            hostagePetition,
            { x: 50, y: 20 },
            { start: "top 86%", duration: 0.85, ease: "power4.out" }
        );
    }

    if (hostageNumber) {
        revealOnScroll(
            hostageNumber,
            { scale: 0.72 },
            { start: "top 82%", duration: 0.8, ease: "expo.out" }
        );
    }

    if (hostageLesson) {
        revealOnScroll(hostageLesson, { y: 40 }, { start: "top 86%", duration: 0.85 });
    }

    weaknessItems.forEach((item) => {
        revealOnScroll(item, { x: -25 }, { start: "top 88%", duration: 0.55 });
    });

}


/* =================================
   THE FINAL REALIZATION
   SAFE CLIMAX REVEAL
================================= */

const finalRealizationSection =
    document.querySelector(".journey-final-realization");

if (finalRealizationSection) {

    const finalLabel =
        finalRealizationSection.querySelector(".page-label");

    const finalHeading =
        finalRealizationSection.querySelector(
            ".final-realization-heading h2"
        );

    const finalParagraphs =
        finalRealizationSection.querySelectorAll(
            ".final-realization-content > p"
        );

    const finalMain =
        finalRealizationSection.querySelector(
            ".final-realization-main"
        );

    const breakCycle =
        finalRealizationSection.querySelector(
            ".break-cycle"
        );


    if (finalLabel) {
        revealOnScroll(finalLabel, { x: -30 }, { start: "top 90%", duration: 0.65 });
    }

    if (finalHeading) {
        revealHeadingOnScroll(
            finalHeading,
            { x: -70, clipPath: "inset(0 100% 0 0)" },
            { start: "top 86%", duration: 1.05, ease: "power4.out" }
        );
    }

    finalParagraphs.forEach((paragraph) => {
        revealOnScroll(paragraph, { y: 30 }, { start: "top 88%", duration: 0.68 });
    });

    if (finalMain) {
        revealOnScroll(finalMain, { scale: 0.96 }, { start: "top 86%", duration: 0.8 });
    }

    if (breakCycle) {
        revealOnScroll(
            breakCycle,
            { y: 45, scale: 0.96 },
            { start: "top 86%", duration: 0.95, ease: "power4.out" }
        );
    }


    /* =================================
       BACKGROUND CLIMAX PARALLAX
       transform only
    ================================= */

    if (finalHeading) {

        gsap.to(finalHeading, {

            yPercent: -7,

            ease: "none",

            scrollTrigger: {
                trigger: finalRealizationSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2
            }

        });

    }

}


/* =================================
   FROM CAMPAIGNS TO PREPARATION
   SAFE SYSTEM REVEAL
================================= */

const preparationSection =
    document.querySelector(".journey-preparation");

if (preparationSection) {

    const preparationLabel =
        preparationSection.querySelector(".page-label");

    const preparationHeading =
        preparationSection.querySelector(
            ".preparation-heading h2"
        );

    /* IMPORTANT:
       .preparation-main ko exclude kiya hai
       because it gets its own animation
    */
    const preparationIntro =
        preparationSection.querySelectorAll(
            ".preparation-content > p:not(.preparation-main)"
        );

    const notItems =
        preparationSection.querySelectorAll(
            ".preparation-not p"
        );

    const preparationMain =
        preparationSection.querySelector(
            ".preparation-main"
        );

    const preparationClarity =
        preparationSection.querySelector(
            ".preparation-clarity"
        );

    const preparationSystem =
        preparationSection.querySelector(
            ".preparation-system"
        );

    const frontsLabel =
        preparationSection.querySelector(
            ".preparation-fronts > span"
        );

    const frontsIntro =
        preparationSection.querySelector(
            ".preparation-fronts > p"
        );

    const frontLinks =
        preparationSection.querySelectorAll(
            ".preparation-front-list a"
        );


    if (preparationLabel) {
        revealOnScroll(preparationLabel, { x: -30 }, { start: "top 90%", duration: 0.65 });
    }

    if (preparationHeading) {
        revealHeadingOnScroll(
            preparationHeading,
            { x: -65, clipPath: "inset(0 100% 0 0)" },
            { start: "top 86%", duration: 1, ease: "power4.out" }
        );
    }

    preparationIntro.forEach((paragraph) => {
        revealOnScroll(paragraph, { y: 30 }, { start: "top 88%", duration: 0.7 });
    });

    notItems.forEach((item) => {
        revealOnScroll(item, { x: -35 }, { start: "top 88%", duration: 0.55 });
    });

    if (preparationMain) {
        revealOnScroll(
            preparationMain,
            { scale: 0.95, y: 30 },
            { start: "top 86%", duration: 0.85, ease: "power4.out" }
        );
    }

    if (preparationClarity) {
        revealOnScroll(preparationClarity, { x: 45 }, { start: "top 86%", duration: 0.8 });
    }

    if (preparationSystem) {
        revealOnScroll(preparationSystem, { y: 35 }, { start: "top 86%", duration: 0.8 });
    }

    [frontsLabel, frontsIntro].filter(Boolean).forEach((element) => {
        revealOnScroll(element, { y: 22 }, { start: "top 88%", duration: 0.6 });
    });

    frontLinks.forEach((link) => {
        revealOnScroll(link, { x: 40 }, { start: "top 88%", duration: 0.65 });
    });


    /* =================================
       DESKTOP HEADING PARALLAX
       Transform only
    ================================= */

    gsap.matchMedia().add(
        "(min-width: 851px)",
        () => {

            if (preparationHeading) {

                gsap.to(
                    preparationHeading,
                    {
                        yPercent: -7,

                        ease: "none",

                        scrollTrigger: {
                            trigger: preparationSection,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.2
                        }
                    }
                );

            }

        }
    );

}


/* =================================
   THE WORK HAS ENTERED EXECUTION
   SAFE EXECUTION REVEAL
================================= */

const executionSection =
    document.querySelector(".journey-execution");

if (executionSection) {

    const executionLabel =
        executionSection.querySelector(".page-label");

    const executionHeading =
        executionSection.querySelector(".execution-header h2");

    const executionLead =
        executionSection.querySelector(".execution-lead");

    const executionIntro =
        executionSection.querySelector(
            ".execution-content > p:not(.execution-lead)"
        );

    const executionFronts =
        executionSection.querySelectorAll(".execution-front");

    const executionTransition =
        executionSection.querySelector(".execution-transition");

    const executionSteps =
        executionSection.querySelectorAll(".execution-steps p");

    const executionEnding =
        executionSection.querySelector(".execution-ending");


    if (executionLabel) {
        revealOnScroll(executionLabel, { x: -30 }, { start: "top 90%", duration: 0.65 });
    }

    if (executionHeading) {
        revealHeadingOnScroll(
            executionHeading,
            { y: 65, clipPath: "inset(0 0 100% 0)" },
            { start: "top 86%", duration: 1, ease: "power4.out" }
        );
    }

    if (executionLead) {
        revealOnScroll(executionLead, { x: -40 }, { start: "top 88%", duration: 0.75 });
    }

    if (executionIntro) {
        revealOnScroll(executionIntro, { y: 25 }, { start: "top 88%", duration: 0.65 });
    }

    executionFronts.forEach((front) => {
        revealOnScroll(front, { y: 55, scale: 0.96 }, { start: "top 86%", duration: 0.75 });
    });

    if (executionTransition) {
        revealOnScroll(executionTransition, { y: 35 }, { start: "top 86%", duration: 0.75 });
    }

    executionSteps.forEach((step) => {
        revealOnScroll(step, { x: -30 }, { start: "top 88%", duration: 0.55 });
    });

    if (executionEnding) {
        revealOnScroll(
            executionEnding,
            { x: 45, y: 25, scale: 0.97 },
            { start: "top 86%", duration: 0.9, ease: "power4.out" }
        );
    }

}


/* =================================
   FOLLOW THE WORK
   SAFE SOCIAL DIRECTORY REVEAL
================================= */

const followSection =
    document.querySelector(".journey-follow");

if (followSection) {

    const followLabel =
        followSection.querySelector(".page-label");

    const followHeading =
        followSection.querySelector(".follow-heading h2");

    const followIntro =
        followSection.querySelector(".follow-heading p");

    const followLinks =
        followSection.querySelectorAll(".follow-link");


    if (followLabel) {
        revealOnScroll(followLabel, { x: -30 }, { start: "top 90%", duration: 0.65 });
    }

    if (followHeading) {
        revealHeadingOnScroll(
            followHeading,
            { y: 55, clipPath: "inset(0 0 100% 0)" },
            { start: "top 86%", duration: 0.95, ease: "power4.out" }
        );
    }

    if (followIntro) {
        revealOnScroll(followIntro, { y: 25 }, { start: "top 88%", duration: 0.7 });
    }

    followLinks.forEach((link) => {
        revealOnScroll(link, { x: 45 }, { start: "top 88%", duration: 0.65 });
    });


    /* =================================
       ICON MICRO MOTION
       Hover only, no visibility changes
    ================================= */

    followLinks.forEach((link) => {

        const icon =
            link.querySelector(".follow-icon iconify-icon");

        if (!icon) return;

        link.addEventListener("mouseenter", () => {

            gsap.to(icon, {
                rotate: 6,
                scale: 1.12,
                duration: 0.25,
                ease: "power2.out"
            });

        });

        link.addEventListener("mouseleave", () => {

            gsap.to(icon, {
                rotate: 0,
                scale: 1,
                duration: 0.25,
                ease: "power2.out"
            });

        });

    });

}


/* =================================
   THE JOURNEY CONTINUES
   SAFE CINEMATIC FINALE
================================= */

const continuesSection =
    document.querySelector(".journey-continues");

if (continuesSection) {

    const continuesLabel =
        continuesSection.querySelector(".page-label");

    const storyLines =
        continuesSection.querySelectorAll(
            ".journey-continues-story p"
        );

    const callParagraph =
        continuesSection.querySelector(
            ".journey-continues-call > p"
        );

    const finalLines =
        continuesSection.querySelectorAll(
            ".journey-final-lines h2"
        );

    const finalBrand =
        continuesSection.querySelector(
            ".journey-final-brand"
        );


    if (continuesLabel) {
        revealOnScroll(continuesLabel, { x: -30 }, { start: "top 90%", duration: 0.65 });
    }

    storyLines.forEach((line) => {
        revealOnScroll(line, { x: -35 }, { start: "top 88%", duration: 0.58 });
    });

    if (callParagraph) {
        revealOnScroll(callParagraph, { y: 35 }, { start: "top 88%", duration: 0.8 });
    }

    finalLines.forEach((line, index) => {
        revealHeadingOnScroll(
            line,
            {
                x: index === 0 ? -60 : 60,
                clipPath: index === 0
                    ? "inset(0 100% 0 0)"
                    : "inset(0 0 0 100%)"
            },
            {
                start: "top 86%",
                duration: 0.95,
                ease: "power4.out"
            }
        );
    });

    if (finalBrand) {
        revealOnScroll(
            finalBrand,
            { y: 45, scale: 0.95 },
            { start: "top 86%", duration: 1, ease: "power4.out" }
        );
    }

}



})();
