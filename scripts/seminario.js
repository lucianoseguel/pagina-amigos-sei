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



  /*===================================================
  COMPONENTE DE BENEFICIOS
  ====================================================*/

        const tabData = {
            respuestas: {
                badge: "Espiritual & Decisiones",
                badgeStyle: "bg-blue-50 text-brandBlue-700 border-blue-200",
                iconBg: "from-blue-500 to-brandBlue-700",
                title: "Respuestas para tu vida",
                subtitle: "Aprende a conectar las escrituras con tus desafíos diarios.",
                description: "En Seminario descubrirás respuestas claras a tus interrogantes. Transforma tus dudas en convicción profunda y adquiere principios eternos que te guiarán para tomar mejores decisiones en tus estudios, relaciones y futuro.",
                highlights: [
                    "Dominio de temas doctrinales contemporáneos",
                    "Aprender a reconocer y recibir revelación personal",
                    "Principios prácticos para metas personales y espirituales"
                ],
                quote: "«Seminario me ayudó a tener claridad en momentos clave donde no sabía qué decisión tomar.»"
            },
            amistades: {
                badge: "Comunidad & Valores",
                badgeStyle: "bg-amber-50 text-amber-700 border-amber-200",
                iconBg: "from-amber-400 to-brandGold-600",
                title: "Amistades eternas",
                subtitle: "Rodéate de jóvenes que comparten tus mismos principios.",
                description: "Construye amistades verdaderas en un entorno seguro y libre de presiones sociales negativas. Un espacio donde puedes expresarte con libertad, compartir experiencias y apoyarte mutuamente en tu fe.",
                highlights: [
                    "Ambiente seguro, respetuoso y positivo",
                    "Red de amigos que se fortalecen mutuamente",
                    "Actividades integradoras y aprendizaje colaborativo"
                ],
                quote: "«Aquí encontré a mis mejores amigos, personas con las que puedo ser verdaderamente yo mismo.»"
            },
            futuro: {
                badge: "Crecimiento & Liderazgo",
                badgeStyle: "bg-purple-50 text-purple-700 border-purple-200",
                iconBg: "from-purple-500 to-indigo-600",
                title: "Preparación para tu futuro",
                subtitle: "Desarrolla una perspectiva más elevada de tu potencial divino.",
                description: "Asistir a Seminario te entrena de forma integral. Fortalece hábitos de estudio, disciplina personal y liderazgo espiritual que te servirán para la universidad, una misión, tu carrera y la vida familiar.",
                highlights: [
                    "Hábitos diarios de lectura y enfoque mental",
                    "Preparación clave para la educación secular y el servicio",
                    "Desarrollo de habilidades de liderazgo centrado en valores"
                ],
                quote: "«La rutina de Seminario me enseñó la autodisciplina que hoy aplico con éxito en mis estudios.»"
            },
            horarios: {
                badge: "Flexibilidad & Accesibilidad",
                badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
                iconBg: "from-emerald-500 to-teal-700",
                title: "Clases ajustadas a ti",
                subtitle: "Modalidades presenciales y virtuales adaptadas a tu horario.",
                description: "Sabemos que tienes una agenda ocupada con la escuela y la familia. Por eso, Seminario ofrece opciones presenciales o virtuales en diferentes horarios para que puedas aprender a tu ritmo sin complicaciones.",
                highlights: [
                    "Horarios matutinos, vespertinos u opción en línea",
                    "Plataformas amigables de fácil acceso",
                    "Maestros y tutores empáticos listos para apoyarte"
                ],
                quote: "«Pude adaptar las clases fácilmente junto con mi horario escolar y mis actividades.»"
            }
        };

        function selectTab(key) {
            const data = tabData[key];
            if (!data) return;

            // Actualizar estado de los botones de pestañas
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.className = "tab-button flex-1 min-w-[160px] py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all duration-200 flex items-center justify-center gap-2";
            });

            const activeBtn = document.getElementById(`tab-btn-${key}`);
            if (activeBtn) {
                activeBtn.className = "tab-button flex-1 min-w-[160px] py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 text-brandBlue-700 bg-white shadow-sm tab-glow";
            }

            // Inyectar contenido con animación
            const container = document.getElementById('tab-content');
            container.innerHTML = `
                <div class="grid lg:grid-cols-12 gap-8 items-center animate-fade-in-slide">
                    
                    <!-- Columna Izquierda: Información Principal -->
                    <div class="lg:col-span-7 space-y-4">
                        <div class="flex items-center gap-2">
                            <span class="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${data.badgeStyle}">
                                ${data.badge}
                            </span>
                        </div>

                        <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            ${data.title}
                        </h3>

                        <p class="text-slate-700 font-medium text-sm sm:text-base leading-snug">
                            ${data.subtitle}
                        </p>

                        <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            ${data.description}
                        </p>

                        <blockquote class="p-4 rounded-2xl bg-slate-50 border-l-4 border-brandBlue-600 text-slate-700 text-xs italic sm:text-sm">
                            ${data.quote}
                        </blockquote>
                    </div>

                    <!-- Columna Derecha: Puntos Clave / Beneficios -->
                    <div class="lg:col-span-5 bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-100 flex flex-col justify-between">
                        <div>
                            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                <svg class="w-4 h-4 text-brandBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                Lo que obtendrás:
                            </h4>

                            <ul class="space-y-3 mb-6">
                                ${data.highlights.map(item => `
                                    <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                                        <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                                        <span>${item}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <button onclick="showToast('Saber más sobre ' + '${data.title}')" class="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-200 text-xs shadow-xs transition-all flex items-center justify-center gap-1.5">
                            <span>Conocer detalles de esta opción</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </button>
                    </div>

                </div>
            `;
        }

        function toggleModal(id) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.toggle('hidden');
            }
        }

        function showToast(message) {
            const toast = document.getElementById('toast-msg');
            const toastText = document.getElementById('toast-text');
            toastText.textContent = message;
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }

        function copyCode() {
            const codeBox = document.getElementById('code-snippet-box');
            const btnText = document.getElementById('copy-btn-text');
            
            const el = document.createElement('textarea');
            el.value = codeBox.textContent;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            btnText.textContent = "¡Copiado!";
            setTimeout(() => {
                btnText.textContent = "Copiar Código";
            }, 2500);
        }

        // Cargar primera pestaña al iniciar y preparar el snippet
        window.onload = function() {
            selectTab('respuestas');
            document.getElementById('code-snippet-box').textContent = document.querySelector('main').outerHTML;
        };
  