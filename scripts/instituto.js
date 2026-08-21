document.addEventListener("DOMContentLoaded", function() {
      
  // === SELECCIÓN DE ELEMENTOS (MENÚ HAMBURGUESA) ===
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuOverlay = document.getElementById("menu-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  // === SELECCIÓN DE ELEMENTOS (CARRUSEL) ===
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  let currentSlideIndex = 0;
  let autoSlideInterval;

  // === SELECCIÓN DE ELEMENTOS (FORMULARIO INSTITUTO) ===
  const formInstituto = document.getElementById("form-instituto");
  const resultadoEnvio = document.getElementById("resultado-instituto");
  const btnSubmit = document.getElementById("btn-submit-inst");
  const textoBtn = document.getElementById("texto-btn-inst");

  // === LÓGICA DEL MENÚ LATERAL (OFF-CANVAS) ===
  function openMenu() {
    if (!menuBtn || !mobileMenu || !menuOverlay) return;
    menuBtn.classList.add("active");
    mobileMenu.classList.remove("translate-x-full");
    menuOverlay.classList.remove("hidden");
    setTimeout(() => {
      menuOverlay.classList.add("opacity-100");
    }, 10);
  }

  function closeMenu() {
    if (!menuBtn || !mobileMenu || !menuOverlay) return;
    menuBtn.classList.remove("active");
    mobileMenu.classList.add("translate-x-full");
    menuOverlay.classList.remove("opacity-100");
    setTimeout(() => {
      menuOverlay.classList.add("hidden");
    }, 300);
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function() {
      const isOpen = menuBtn.classList.contains("active");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // === LÓGICA DEL CARRUSEL DE IMÁGENES ===
  function updateCarousel(index) {
    if (!slides.length || !dots.length) return;
    slides.forEach((slide, i) => {
      slide.classList.add("opacity-0", "pointer-events-none");
      slide.classList.remove("opacity-100");
      dots[i].classList.remove("bg-white");
      dots[i].classList.add("bg-white/40");
    });

    slides[index].classList.remove("opacity-0", "pointer-events-none");
    slides[index].classList.add("opacity-100");
    dots[index].classList.remove("bg-white/40");
    dots[index].classList.add("bg-white");
    currentSlideIndex = index;
  }

  function nextSlide() {
    let index = currentSlideIndex + 1;
    if (index >= slides.length) index = 0;
    updateCarousel(index);
  }

  function prevSlide() {
    let index = currentSlideIndex - 1;
    if (index < 0) index = slides.length - 1;
    updateCarousel(index);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      nextSlide();
      resetAutoSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
      resetAutoSlide();
    }
  });

  window.irASlide = function(index) {
    updateCarousel(index);
    resetAutoSlide();
  };

  resetAutoSlide();

  // === SOPORTE TÁCTIL PARA CARRUSEL ===
  let touchStartX = 0;
  let touchEndX = 0;
  const carouselContainer = document.getElementById("carousel-slides");

  if (carouselContainer) {
    carouselContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselContainer.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, { passive: true });
  }

  function handleGesture() {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      resetAutoSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      resetAutoSlide();
    }
  }

  // === LÓGICA DE ENVÍO CON FECH REAL A WEB3FORMS ===
  if (formInstituto) {
    formInstituto.addEventListener("submit", async function(event) {
      event.preventDefault();

      // Deshabilitar botón y dar feedback visual
      if (btnSubmit) btnSubmit.disabled = true;
      if (textoBtn) textoBtn.textContent = "Enviando...";

      if (resultadoEnvio) {
        resultadoEnvio.className = "p-4 rounded-xl text-center text-sm font-semibold bg-blue-100 text-blue-700 block";
        resultadoEnvio.textContent = "Procesando inscripción a Instituto...";
      }

      try {
        const formData = new FormData(formInstituto);
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
          if (resultadoEnvio) {
            resultadoEnvio.className = "p-4 rounded-xl text-center text-sm font-semibold bg-green-100 text-green-700 block";
            resultadoEnvio.textContent = "¡Inscripción a Instituto enviada con éxito! Te contactaremos pronto.";
          }
          formInstituto.reset();
        } else {
          if (resultadoEnvio) {
            resultadoEnvio.className = "p-4 rounded-xl text-center text-sm font-semibold bg-red-100 text-red-700 block";
            resultadoEnvio.textContent = data.message || "Error al enviar. Revisa la clave Web3Forms.";
          }
        }
      } catch (error) {
        if (resultadoEnvio) {
          resultadoEnvio.className = "p-4 rounded-xl text-center text-sm font-semibold bg-red-100 text-red-700 block";
          resultadoEnvio.textContent = "Error de conexión. Verifica tu internet e inténtalo nuevamente.";
        }
      } finally {
        if (btnSubmit) btnSubmit.disabled = false;
        if (textoBtn) textoBtn.textContent = "Enviar preinscripción a Instituto";
      }
    });
  }
});


 /*===================================================
  COMPONENTE DE BENEFICIOS
  ====================================================*/
 // Data registry for benefit items
    const benefitsData = {
      1: {
        category: "Estudio & Escrituras",
        title: "Respuestas para tu vida",
        iconBg: "bg-blue-100 text-brandBlue",
        headerBg: "bg-gradient-to-r from-blue-50 to-sky-50",
        iconSvg: `
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        `,
        description: "Aprende a conectar las escrituras con tus desafíos diarios. Estas en una edad donde tomaras descisiones importantes y  Seminario te ayudará a tomar las correctas y a fortalecer tu testimonio de Jesucristo.",
        highlights: [
          "<strong>Dominio de doctrinas claves:</strong> Aprende a defender tus creencias con claridad y paciencia.",
          "<strong>Toma de decisiones con propósito:</strong> Lecciones de preparación para en cada aspecto de tu vida",
          "<strong>Hábitos de lectura constantes:</strong> Desarrolla el hábito transformador de estudiar la palabra de Dios semanalmente."
        ],
        tip: "Consejo: En las clases de Seminario aprenderás a usar tus escrituras no solo para estudiar, sino como una guía personal de respuestas."
      },
      2: {
        category: "Comunidad & Conexión",
        title: "Amistades eternas",
        iconBg: "bg-amber-100 text-brandGold",
        headerBg: "bg-gradient-to-r from-amber-50 to-orange-50",
        iconSvg: `
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        `,
        description: "Rodéate de jóvenes que viven tus valores y te respetan. Un entorno seguro donde puedes expresarte con libertad, y crecer espiritualmente",
        highlights: [
          "<strong>Círculo de confianza elevado:</strong> Un entorno donde puedes compartir tus ideas sin temor a ser juzgado.",
          "<strong>Apoyo espiritual:</strong> Compañeros que te fortalecerán durante momentos de reto personal.",
          "<strong>Actividades edificantes:</strong> Momentos de recreacion sana y prestar servicio."
        ],
        tip: "Recuerda: Los amigos que haces en Seminario frecuentemente se convierten en apoyos morales para toda la vida adulta."
      },
      3: {
        category: "Crecimiento Personal",
        title: "Preparación para tu futuro",
        iconBg: "bg-emerald-100 text-emerald-700",
        headerBg: "bg-gradient-to-r from-emerald-50 to-teal-50",
        iconSvg: `
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
          </svg>
        `,
        description: "Desarrolla una perspectiva más elevada de quién eres y lo que Dios espera de ti. Seminario te prepara integralmente fortaleciendo tus destrezas de liderazgo, disciplina personal, estudio enfocado y metas para la educación y servicio futuro.",
        highlights: [
          "<strong>Identidad y propósito claro:</strong> Descubre tu potencial espiritual y fortalece tu autoestima.",
          "<strong>Habilidades para la vida:</strong> Disciplina de estudio, liderazgo y compromiso personal.",
          "<strong>Preparación para misiones y universidad:</strong> Una base sólida para afrontar los desafios futuros."
        ],
        tip: "Dato clave: Los graduados de Seminario demuestran mayor resiliencia académica, emocional y espiritual en sus estudios superiores."
      },
      4: {
        category: "Flexibilidad & Formatos",
        title: "Clases a tu ritmo",
        iconBg: "bg-purple-100 text-purple-700",
        headerBg: "bg-gradient-to-r from-purple-50 to-indigo-50",
        iconSvg: `
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        `,
        description: "Sabemos que tus horarios de escuela y actividades extracurriculares son exigentes. Por ello, Seminario se adapta a tus necesidades mediante modalidades presenciales, matutinas, vespertinas u online interactivas.",
        highlights: [
          "<strong>Modalidad Presencial u Online:</strong> Elige el formato que mejor encaje con tu agenda escolar.",
          "<strong>Acompañamiento personalizado:</strong> Maestros dedicados a apoyarte en tu progreso y metas personales."
        ],
        tip: "Pregunta a tu maestro o líder local sobre la modalidad que mejor encaja con tus horarios de estudio este semestre."
      }
    };

    // Modal Element references
    const modal = document.getElementById('benefitModal');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalHighlights = document.getElementById('modalHighlights');
    const modalTip = document.getElementById('modalTip');
    const modalIconContainer = document.getElementById('modalIconContainer');
    const modalHeaderBg = document.getElementById('modalHeaderBg');

    // Function to open modal with populated details
    function openBenefitModal(id) {
      const data = benefitsData[id];
      if (!data) return;

      // Populate content
      modalCategory.textContent = data.category;
      modalTitle.textContent = data.title;
      modalDescription.textContent = data.description;
      modalTip.textContent = data.tip;

      // Icon & Background styling
      modalIconContainer.className = `w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${data.iconBg}`;
      modalIconContainer.innerHTML = data.iconSvg;
      
      modalHeaderBg.className = `p-8 pb-6 rounded-t-3xl border-b border-slate-100 relative ${data.headerBg}`;

      // Populate highlights list
      modalHighlights.innerHTML = data.highlights
        .map(item => `
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <span>${item}</span>
          </li>
        `).join('');

      // Display modal & prevent body scroll
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    // Function to close modal
    function closeBenefitModal() {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    // Close on backdrop click
    function handleBackdropClick(event) {
      if (event.target === modal) {
        closeBenefitModal();
      }
    }

    // Keyboard support: Close on Escape key press
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeBenefitModal();
      }
    });