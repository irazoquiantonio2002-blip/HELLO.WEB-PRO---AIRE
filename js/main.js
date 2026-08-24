(function () {
  const waNumber = "525546061127";

  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    window.setTimeout(() => loader?.classList.add("loaded"), 350);
  });

  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mob-menu");

  hamburger?.addEventListener("click", () => {
    const open = !mobileMenu?.classList.contains("open");
    mobileMenu?.classList.toggle("open", open);
    hamburger.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger?.classList.remove("active");
      hamburger?.setAttribute("aria-expanded", "false");
    });
  });

  const marquee = document.getElementById("marquee");
  if (marquee) {
    const items = [
      "Venta de equipos",
      "Ingeniería HVAC",
      "Instalación profesional",
      "Mantenimiento preventivo",
      "Reparación y diagnóstico",
      "Servicio post-venta",
      "Aire acondicionado",
      "Calefacción"
    ];
    const content = [...items, ...items]
      .map((item) => `<span><i class="fa-solid fa-fan"></i>${item}</span>`)
      .join("");
    marquee.innerHTML = content;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const counters = document.querySelectorAll(".stat-num[data-count]");
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const duration = 1150;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${prefix}${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.45 });

  counters.forEach((counter) => countObserver.observe(counter));

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const form = document.getElementById("wa-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("f-name")?.value.trim();
    const interest = document.getElementById("f-interest")?.value;
    const message = document.getElementById("f-msg")?.value.trim();

    if (!name || !message) {
      form.reportValidity();
      return;
    }

    const text = [
      "Hola PRO-AIRE, visité su sitio web y me gustaría solicitar una cotización.",
      `Nombre: ${name}`,
      `Servicio: ${interest}`,
      `Detalle: ${message}`
    ].join("\n");

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas?.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let particles = [];
  let animationFrame = 0;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = Array.from({ length: Math.max(18, Math.floor(rect.width / 58)) }, (_, index) => ({
      x: Math.random() * rect.width,
      y: rect.height * (0.18 + Math.random() * 0.48),
      speed: 0.35 + Math.random() * 0.55,
      amp: 18 + Math.random() * 34,
      phase: Math.random() * Math.PI * 2,
      length: 24 + Math.random() * 36,
      hue: index % 3 === 0 ? "164, 61, 103" : "30, 136, 168"
    }));
  }

  function drawAirflow(time) {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    particles.forEach((particle) => {
      particle.x += particle.speed;
      if (particle.x > rect.width + particle.length) {
        particle.x = -particle.length;
        particle.y = rect.height * (0.18 + Math.random() * 0.48);
      }

      const y = particle.y + Math.sin(time * 0.001 + particle.phase) * particle.amp;
      const gradient = ctx.createLinearGradient(particle.x - particle.length, y, particle.x, y);
      gradient.addColorStop(0, `rgba(${particle.hue}, 0)`);
      gradient.addColorStop(1, `rgba(${particle.hue}, 0.32)`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(particle.x - particle.length, y);
      ctx.quadraticCurveTo(particle.x - particle.length / 2, y - 8, particle.x, y);
      ctx.stroke();
    });

    animationFrame = requestAnimationFrame(drawAirflow);
  }

  if (canvas && ctx && !prefersReducedMotion) {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    animationFrame = requestAnimationFrame(drawAirflow);
  }

  window.addEventListener("beforeunload", () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
})();
