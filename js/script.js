document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".participants__list");
    const btnPrev = document.querySelector(".btn-scroll-left");
    const btnNext = document.querySelector(".btn-scroll-right");
    const progressStrong = document.querySelector(".participants__progress strong");
    const progressRoot = document.querySelector(".participants__progress span");
  
    if (!track || !btnPrev || !btnNext || !progressStrong) return;
  
    const originalItems = Array.from(track.children);
    const total = originalItems.length;
  
    // gap между карточками (flex gap)
    const gap = (() => {
      const cs = getComputedStyle(track);
      const g = cs.gap || cs.columnGap || "0px";
      const n = parseFloat(g);
      return Number.isFinite(n) ? n : 0;
    })();
  
    const getCardWidth = () => {
      const first = track.querySelector(".participants__card");
      if (!first) return 0;
      return first.getBoundingClientRect().width + gap;
    };
  
    const getPerView = () => (window.innerWidth >= 1024 ? 3 : 1);
  
    let perView = getPerView();
    let cloneCount = Math.min(perView, total);
    let index = cloneCount; // текущий индекс в track с учётом клонов
    let animating = false;
  
    function setProgress() {
        const logicalLeft = ((index - cloneCount) % total + total) % total; // 0..total-1
        const logicalRight = (logicalLeft + perView - 1) % total;           // последняя видимая
        progressStrong.textContent = String(logicalRight + 1);
    }
  
    function translateToIndex(animate = true) {
      const cw = getCardWidth();
      if (!cw) return;
  
      track.style.transition = animate ? "transform 450ms ease" : "none";
      track.style.transform = `translateX(${-index * cw}px)`;
      setProgress();
    }
  
    function rebuildClones() {
      // восстановить оригинал
      track.innerHTML = "";
      originalItems.forEach((el) => track.appendChild(el));
  
      perView = getPerView();
      cloneCount = Math.min(perView, total);
  
      const itemsNow = Array.from(track.children);
  
      // клоны в начало (последние cloneCount)
      const headClones = itemsNow.slice(-cloneCount).map((el) => el.cloneNode(true));
      headClones.forEach((cl) => track.insertBefore(cl, track.firstChild));
  
      // клоны в конец (первые cloneCount)
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
  
    track.addEventListener("transitionend", () => {
      // после анимации, если мы попали в клон-зону — прыгаем без анимации
      const maxIndex = total + cloneCount - 1;
  
      if (index > maxIndex) {
        index = cloneCount; // на первый реальный
        translateToIndex(false);
      } else if (index < cloneCount) {
        index = total + cloneCount - 1; // на последний реальный
        translateToIndex(false);
      }
  
      // re-enable
      // (даже если был "без анимации" прыжок — это ок)
      animating = false;
    });
  
    // кнопки
    btnNext.addEventListener("click", () => {
      restartAuto();
      next();
    });
  
    btnPrev.addEventListener("click", () => {
      restartAuto();
      prev();
    });
  
    // авто каждые 4 сек
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
  
    // пауза при наведении/фокусе (обычно ожидаемо)
    track.addEventListener("mouseenter", stopAuto);
    track.addEventListener("mouseleave", startAuto);
    btnPrev.addEventListener("mouseenter", stopAuto);
    btnPrev.addEventListener("mouseleave", startAuto);
    btnNext.addEventListener("mouseenter", stopAuto);
    btnNext.addEventListener("mouseleave", startAuto);
  
    // пересборка на ресайз (меняется perView => меняется cloneCount)
    let resizeRaf = 0;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        rebuildClones();
      });
    });
  
    rebuildClones();
    startAuto();
  });