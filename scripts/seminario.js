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

      // === SELECCIÓN DE ELEMENTOS (FORMULARIO) ===
      const formSeminario = document.getElementById("form-seminario");
      const mensajeExito = document.getElementById("mensaje-exito");
      const confirmarNombre = document.getElementById("confirmar-nombre");
      const confirmarModalidad = document.getElementById("confirmar-modalidad");
      const confirmarTutor = document.getElementById("confirmar-tutor");

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
        // Desactiva todas las slides
        slides.forEach((slide, i) => {
          slide.classList.add("opacity-0", "pointer-events-none");
          slide.classList.remove("opacity-100");
          dots[i].classList.remove("bg-white");
          dots[i].classList.add("bg-white/40");
        });

        // Activa la diapositiva solicitada
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

      // Reinicia el temporizador de auto-avance para evitar cambios abruptos al interactuar
      function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000); // Avanza cada 5 segundos
      }

      // Asignar funciones a los botones
      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
      });

      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoSlide();
      });

      // Permitir la navegación con las flechas del teclado
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
          nextSlide();
          resetAutoSlide();
        } else if (e.key === "ArrowLeft") {
          prevSlide();
          resetAutoSlide();
        }
      });

      // Hacer que los puntos indicadores cambien la slide
      window.irASlide = function(index) {
        updateCarousel(index);
        resetAutoSlide();
      }

      // Inicializa el Carrusel automático
      resetAutoSlide();

      // === SOPORTE TÁCTIL (DESLIZAMIENTO CON EL DEDO EN EL CARRUSEL) ===
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
          nextSlide(); // Deslizamiento hacia la izquierda -> siguiente
          resetAutoSlide();
        } else if (touchEndX - touchStartX > 50) {
          prevSlide(); // Deslizamiento hacia la derecha -> anterior
          resetAutoSlide();
        }
      }

// === LÓGICA DE ENVÍO DE FORMULARIO ===
      formSeminario.addEventListener("submit", async function(event) {
        // Detener la recarga nativa de la página
        event.preventDefault();

        // 1. Obtención SEGURA de los elementos (usando operador opcional '?.' para no romper el código)
        const inputNombre = document.getElementById("nombre-estudiante");
        const inputEdad = document.getElementById("edad-estudiante");
        const inputContacto = document.getElementById("contacto");
        const inputEstaca = document.getElementById("estaca-barrio");

        // Extraer valores o usar texto vacío si el campo no existe en este formulario
        const nombreEst = inputNombre ? inputNombre.value.trim() : "";
        const edadEst = inputEdad ? inputEdad.value : "";
        const contactoEst = inputContacto ? inputContacto.value.trim() : "";
        const estacaEst = inputEstaca ? inputEstaca.value.trim() : "";

        // 2. Validación básica
        if (!nombreEst || !edadEst || !contactoEst) {
          alert("Por favor completa los campos obligatorios.");
          return;
        }

        // Obtener elementos de la pantalla de éxito si existen
        const confirmarNombre = document.getElementById("confirmar-nombre");
        const mensajeExito = document.getElementById("mensaje-exito");
        const btnSubmit = formSeminario.querySelector('button[type="submit"]');

        // Deshabilitar botón mientras envía
        if (btnSubmit) btnSubmit.disabled = true;

        try {
          // 3. Envío Real a Web3Forms
          const formData = new FormData(formSeminario);
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });

          const data = await response.json();

          if (response.ok && data.success) {
            // Rellenar datos en la pantalla de éxito (si esos span existen en tu HTML)
            if (confirmarNombre) confirmarNombre.textContent = nombreEst;

            // Ocultar formulario y mostrar éxito
            formSeminario.classList.add("hidden");
            if (mensajeExito) {
              mensajeExito.classList.remove("hidden");
              mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              alert("¡Preinscripción enviada con éxito!");
            }
          } else {
            alert(data.message || "Ocurrió un error al enviar el formulario.");
          }
        } catch (error) {
          alert("Error de conexión. Inténtalo de nuevo.");
        } finally {
          if (btnSubmit) btnSubmit.disabled = false;
        }
      });
    });

    // === REINICIAR FORMULARIO (Multiinscripción) ===
    function reiniciarFormulario() {
      const formSeminario = document.getElementById("form-seminario");
      const mensajeExito = document.getElementById("mensaje-exito");
      
      if (formSeminario) {
        formSeminario.reset();
        formSeminario.classList.remove("hidden");
        formSeminario.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (mensajeExito) {
        mensajeExito.classList.add("hidden");
      }
    }