document.addEventListener("DOMContentLoaded", () => {
  initParticipantsCarousel();
  initRoadmapMobileSlider();
  initReveal();
  initSmoothAnchors();
});

function initParticipantsCarousel() {
  const root = document.querySelector(".participants");
  if (!root) return;

  const track = root.querySelector(".participants__list");
  const viewport = root.querySelector(".participants__viewport");
  const btnPrev = root.querySelector(".participants__prev");
  const btnNext = root.querySelector(".participants__next");
  const progressStrong = root.querySelector(".participants__progress strong");
  if (!track || !viewport || !btnPrev || !btnNext || !progressStrong) return;

  const originalItems = Array.from(track.children);
  const total = originalItems.length;
  if (!total) return;

  const getGap = () => {
    const cs = getComputedStyle(track);
    const g = cs.gap || cs.columnGap || "0px";
    const n = parseFloat(g);
    return Number.isFinite(n) ? n : 0;
  };

  const getPerView = () => (window.innerWidth >= 1024 ? 3 : 1);

  const getStep = () => {
    const per = getPerView();
    // mobile: одна карточка на всю ширину viewport
    if (per <= 1) {
      return viewport.getBoundingClientRect().width || 0;
    }
    // desktop: фиксированная карточка + gap
    const first = track.querySelector(".participants__card");
    if (!first) return 0;
    return first.getBoundingClientRect().width + getGap();
  };

  let perView = getPerView();
  let cloneCount = Math.min(perView, total);
  let index = cloneCount;
  let animating = false;

  function setProgress() {
    const logicalLeft = ((index - cloneCount) % total + total) % total;
    // desktop (3 в ряд): номер правой видимой; mobile (1): текущий слайд
    const shown = perView > 1
      ? (logicalLeft + perView - 1) % total
      : logicalLeft;
    progressStrong.textContent = String(shown + 1);
  }

  function translateToIndex(animate = true) {
    const step = getStep();
    if (!step) return;
    track.style.transition = animate ? "transform 450ms ease" : "none";
    track.style.transform = `translateX(${-index * step}px)`;
    setProgress();
  }

  function rebuildClones() {
    track.innerHTML = "";
    originalItems.forEach((el) => track.appendChild(el));

    perView = getPerView();
    cloneCount = Math.min(perView, total);

    const itemsNow = Array.from(track.children);
    const headClones = itemsNow.slice(-cloneCount).map((el) => el.cloneNode(true));
    headClones.forEach((cl) => track.insertBefore(cl, track.firstChild));

    const tailClones = itemsNow.slice(0, cloneCount).map((el) => el.cloneNode(true));
    tailClones.forEach((cl) => track.appendChild(cl));

    index = cloneCount;
    translateToIndex(false);
  }

  function next() {
    if (animating) return;
    animating = true;
    index += perView;
    translateToIndex(true);
  }

  function prev() {
    if (animating) return;
    animating = true;
    index -= perView;
    translateToIndex(true);
  }

  track.addEventListener("transitionend", (e) => {
    if (e.target !== track || e.propertyName !== "transform") return;

    const maxIndex = total + cloneCount - perView;
    if (index > maxIndex) {
      index = cloneCount;
      translateToIndex(false);
    } else if (index < cloneCount) {
      index = total + cloneCount - perView;
      translateToIndex(false);
    }
    animating = false;
  });

  btnNext.addEventListener("click", () => {
    restartAuto();
    next();
  });

  btnPrev.addEventListener("click", () => {
    restartAuto();
    prev();
  });

  let timer = null;
  function startAuto() {
    stopAuto();
    timer = setInterval(next, 4000);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function restartAuto() {
    startAuto();
  }

  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);
  root.addEventListener("focusin", stopAuto);
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) startAuto();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  let resizeRaf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      rebuildClones();
    });
  });

  rebuildClones();
  startAuto();
}

function initRoadmapMobileSlider() {
  const mq = window.matchMedia("(max-width: 768px)");
  const track = document.querySelector(".roadmap__list");
  if (!track) return;

  const btnPrev = document.querySelector(".roadmap__prev");
  const btnNext = document.querySelector(".roadmap__next");
  const dotsRoot = document.querySelector(".roadmap__dots");
  if (!btnPrev || !btnNext || !dotsRoot) return;

  const originalHTML = track.innerHTML;
  let slides = [];
  let dots = [];
  let index = 0;
  let bound = false;

  function getGap() {
    const cs = getComputedStyle(track);
    const g = cs.gap || cs.columnGap || "0px";
    const n = parseFloat(g);
    return Number.isFinite(n) ? n : 0;
  }

  function syncDots() {
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function update() {
    if (!mq.matches || !slides.length) {
      track.style.transform = "";
      return;
    }
    const w = slides[0].getBoundingClientRect().width + getGap();
    track.style.transform = `translateX(${-index * w}px)`;
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === slides.length - 1;
    syncDots();
  }

  function goTo(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    update();
  }

  function mergeForMobile() {
    const s4 = track.querySelector(".roadmap__card--s4");
    const s5 = track.querySelector(".roadmap__card--s5");
    if (s4 && s5) {
      const step5 = s5.querySelector(".roadmap__step");
      if (step5) s4.appendChild(step5);
      s5.remove();
    }
  }

  function buildDots() {
    slides = Array.from(track.querySelectorAll(".roadmap__card"));
    dotsRoot.innerHTML = "";
    dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "roadmap__dot" + (i === 0 ? " is-active" : "");
      b.setAttribute("aria-label", `Слайд ${i + 1}`);
      if (i === 0) b.setAttribute("aria-current", "true");
      b.addEventListener("click", () => goTo(i));
      dotsRoot.appendChild(b);
      return b;
    });
  }

  function bindControls() {
    if (bound) return;
    bound = true;
    btnPrev.addEventListener("click", () => goTo(index - 1));
    btnNext.addEventListener("click", () => goTo(index + 1));
  }

  function enableMobile() {
    track.innerHTML = originalHTML;
    mergeForMobile();
    buildDots();
    bindControls();
    index = 0;
    update();
  }

  function disableMobile() {
    track.innerHTML = originalHTML;
    track.style.transform = "";
    btnPrev.disabled = false;
    btnNext.disabled = false;
    slides = [];
  }

  function onChange() {
    if (mq.matches) enableMobile();
    else disableMobile();
  }

  onChange();
  mq.addEventListener("change", onChange);
  window.addEventListener("resize", () => {
    if (mq.matches) update();
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
  );

  items.forEach((el) => io.observe(el));
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });
}
