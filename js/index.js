const preloadImages = (selector = "img") => {
  return new Promise((resolve) => {
    imagesLoaded(
      document.querySelectorAll(selector),
      { background: true },
      resolve
    );
  });
};

let lenis;

const initSmoothScrolling = () => {
  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  });

  lenis.on("scroll", () => ScrollTrigger.update());

  const scrollFn = (time) => {
    lenis.raf(time);
    requestAnimationFrame(scrollFn);
  };

  requestAnimationFrame(scrollFn);
};

const triggerFlipOnScroll = (galleryEl, options) => {
  let settings = {
    flip: {
      absoluteOnLeave: false,
      absolute: false,
      scale: true,
      simple: true,
    },
    scrollTrigger: {
      start: "center center",
      end: "+=300%",
    },
    stagger: 0,
  };

  settings = Object.assign({}, settings, options);

  const galleryCaption = galleryEl.querySelector(".caption");
  const galleryItems = galleryEl.querySelectorAll(".gallery__item");

  const galleryItemsInner = [...galleryItems]
    .map((item) => (item.children.length > 0 ? [...item.children] : []))
    .flat();

  galleryEl.classList.add("gallery--switch");
  const flipstate = Flip.getState([galleryItems, galleryCaption], {
    props: "filter, opacity",
  });

  galleryEl.classList.remove("gallery--switch");

  const tl = Flip.to(flipstate, {
    ease: "none",
    absoluteOnLeave: settings.flip.absoluteOnLeave,
    absolute: settings.flip.absolute,
    scale: settings.flip.scale,
    simple: settings.flip.simple,
    scrollTrigger: {
      trigger: galleryEl,
      start: settings.scrollTrigger.start,
      end: settings.scrollTrigger.end,
      pin: galleryEl.parentNode,
      scrub: true,
    },
    stagger: settings.stagger,
  });

  if (galleryItemsInner.length) {
    tl.fromTo(
      galleryItemsInner,
      {
        scale: 2,
      },
      {
        scale: 1,
        scrollTrigger: {
          trigger: galleryEl,
          start: settings.scrollTrigger.start,
          end: settings.scrollTrigger.end,
          scrub: true,
        },
      },
      0
    );
  }
};

const scroll = () => {
  const galleries = [
    {
      id: "#gallery-1",
      options: { flip: { absoluteOnLeave: true, scale: false } },
    },
    {
      id: "#gallery-2",
    },
    {
      id: "#gallery-3",
    },
    {
      id: "#gallery-4",
    },
    {
      id: "#gallery-5",
      options: { flip: { absoluteOnLeave: true, scale: false } },
    },
    {
      id: "#gallery-6",
    },
  ];

  galleries.forEach((gallery) => {
    const galleryElement = document.querySelector(gallery.id);
    triggerFlipOnScroll(galleryElement, gallery.options);
  });
};

preloadImages(".gallery__item").then(() => {
  initSmoothScrolling();
  scroll();
});
