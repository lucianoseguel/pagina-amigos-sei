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

      // === SELECCIÓN DE ELEMENTOS (FORMULARIO ADAPTADO A INSTITUTO) ===
      const formInstituto = document.getElementById("form-instituto"); // CAMBIADO: ID del formulario de instituto
      const mensajeExito = document.getElementById("mensaje-exito");
      const confirmarNombre = document.getElementById("confirmar-nombre");
      const confirmarModalidad = document.getElementById("confirmar-modalidad");
      // ELIMINADO: confirmarTutor (Ya no aplica en Instituto)

      // === LÓGICA DEL MENÚ LATERAL (OFF-CANVAS) ===
      function openMenu() {
        menuBtn.classList.add("active");
        mobileMenu.classList.remove("translate-x-full");
        menuOverlay.classList.remove("hidden");
        setTimeout(() => {
          menuOverlay.classList.add("opacity-100");
        }, 10);
      }

      function closeMenu() {
        menuBtn.classList.remove("active");
        mobileMenu.classList.add("translate-x-full");
        menuOverlay.classList.remove("opacity-100");
        setTimeout(() => {
          menuOverlay.classList.add("hidden");
        }, 300);
      }

      menuBtn.addEventListener("click", function() {
        const isOpen = menuBtn.classList.contains("active");
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      menuOverlay.addEventListener("click", closeMenu);

      mobileLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
      });

      // === LÓGICA DEL CARRUSEL DE IMÁGENES ===
      function updateCarousel(index) {
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

      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
      });

      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoSlide();
      });

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
      }

      resetAutoSlide();

      // === SOPORTE TÁCTIL ===
      let touchStartX = 0;
      let touchEndX = 0;
      const carouselContainer = document.getElementById("carousel-slides");

      carouselContainer.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carouselContainer.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
      }, { passive: true });

      function handleGesture() {
        if (touchStartX - touchEndX > 50) {
          nextSlide();
          resetAutoSlide();
        } else if (touchEndX - touchStartX > 50) {
          prevSlide();
          resetAutoSlide();
        }
      }

      // === LÓGICA DE ENVÍO DE FORMULARIO (ADAPTADA) ===
      if (formInstituto) { // Verificación de seguridad para evitar errores
        formInstituto.addEventListener("submit", function(event) {
          event.preventDefault();

          // 1. Obtención de los valores del formulario de Instituto
          const nombreEst = document.getElementById("nombre-estudiante").value.trim();
          const telefono = document.getElementById("telefono-contacto").value.trim();
          const ocupacion = document.getElementById("ocupacion").value;
          const modalitySelect = document.getElementById("modalidad");
          const modalidadTexto = modalitySelect.options[modalitySelect.selectedIndex].text;

          // 2. Validación básica (Campos obligatorios de Instituto)
          if (!nombreEst || !telefono || !ocupacion || !modalitySelect.value) {
            return; 
          }

          // 3. Inyección de datos en la pantalla de éxito
          confirmarNombre.textContent = nombreEst;
          confirmarModalidad.textContent = modalidadTexto;

          // Transición visual
          formInstituto.classList.add("hidden");
          mensajeExito.classList.remove("hidden");

          mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    });

    // === REINICIAR FORMULARIO (Multiinscripción) ===
    function reiniciarFormulario() {
      const formInstituto = document.getElementById("form-instituto");
      const mensajeExito = document.getElementById("mensaje-exito");
      
      if (formInstituto) {
        formInstituto.reset();
        mensajeExito.classList.add("hidden");
        formInstituto.classList.remove("hidden");
        formInstituto.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    /** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brandBlue: {
          DEFAULT: '#0F1E36', // El azul oscuro señorial para fondos y títulos
          light: '#1E3A66',   // Una variante un poco más clara para hovers
        },
        brandGold: {
          DEFAULT: '#F59E0B', // El tono ámbar/dorado que hace un contraste hermoso
          dark: '#D97706',    // Para el efecto hover de los botones
        },
        brandSky: '#38BDF8',  // Azul claro para detalles y textos secundarios
      },
    },
  },
  plugins: [],
}