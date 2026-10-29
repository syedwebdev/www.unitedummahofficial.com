/* ========================================
   SECTION-AWARE CUSTOM CURSOR
======================================== */

(() => {
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const hasTouch = navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ((!hasFinePointer && !hasTouch) || prefersReducedMotion) return;

    const cursor = document.createElement("div");
    cursor.className = "site-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = '<span class="site-cursor-ring"></span><span class="site-cursor-dot"></span>';
    document.body.appendChild(cursor);

    if (hasFinePointer) {
        document.body.classList.add("custom-cursor-active");
    }

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const follower = { x: pointer.x, y: pointer.y };
    let currentTone = "";
    let touchHideTimer;

    const interactiveSelector = "a, button, input, textarea, select, [role='button'], [data-cursor-interactive]";

    function asElement(target) {
        return target instanceof Element ? target : null;
    }

    function updateTone(target) {
        const themeTarget = asElement(target)?.closest("section, nav, footer, .journey-marquee, .plan-marquee, .skills-marquee, .home-marquee, .university-marquee, .revival-marquee, .network-marquee, .media-marquee, .collab-marquee, .support-marquee, .join-marquee") || document.body;
        const tone = getComputedStyle(themeTarget).getPropertyValue("--section-cursor-tone").trim();

        if (tone && tone !== currentTone) {
            currentTone = tone;
            cursor.style.setProperty("--cursor-tone", tone);
        }
    }

    function render() {
        const followSpeed = hasFinePointer ? 0.18 : 0.16;
        follower.x += (pointer.x - follower.x) * followSpeed;
        follower.y += (pointer.y - follower.y) * followSpeed;
        cursor.style.transform = `translate3d(${follower.x}px, ${follower.y}px, 0)`;
        requestAnimationFrame(render);
    }

    if (hasFinePointer) {
        document.addEventListener("pointermove", (event) => {
            if (event.pointerType && event.pointerType !== "mouse") return;

            pointer.x = event.clientX;
            pointer.y = event.clientY;
            cursor.classList.add("is-visible");
            cursor.classList.toggle("is-interactive", Boolean(asElement(event.target)?.closest(interactiveSelector)));
            updateTone(event.target);
        }, { passive: true });

        document.addEventListener("pointerdown", () => cursor.classList.add("is-pressed"));
        document.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"));
        document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
        document.addEventListener("mouseenter", () => cursor.classList.add("is-visible"));
    }

    if (hasTouch) {
        const updateFromTouch = (event) => {
            const touch = event.touches[0];
            if (!touch) return;

            clearTimeout(touchHideTimer);
            pointer.x = touch.clientX;
            pointer.y = touch.clientY;
            cursor.classList.add("is-visible");
            cursor.classList.toggle("is-interactive", Boolean(asElement(event.target)?.closest(interactiveSelector)));
            updateTone(event.target);
        };

        const hideAfterTouch = () => {
            cursor.classList.remove("is-pressed", "is-interactive");
            touchHideTimer = window.setTimeout(() => cursor.classList.remove("is-visible"), 520);
        };

        document.addEventListener("touchstart", (event) => {
            updateFromTouch(event);
            cursor.classList.add("is-pressed");
        }, { passive: true });
        document.addEventListener("touchmove", updateFromTouch, { passive: true });
        document.addEventListener("touchend", hideAfterTouch, { passive: true });
        document.addEventListener("touchcancel", hideAfterTouch, { passive: true });
    }

    window.addEventListener("blur", () => cursor.classList.remove("is-visible"));

    updateTone(document.body);
    requestAnimationFrame(render);
})();
