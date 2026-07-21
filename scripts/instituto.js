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