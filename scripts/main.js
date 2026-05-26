document.addEventListener("DOMContentLoaded", function() {
      
      // === SELECCIÓN DE ELEMENTOS DEL DOM ===
      const menuBtn = document.getElementById("menu-btn");
      const mobileMenu = document.getElementById("mobile-menu");
      const menuOverlay = document.getElementById("menu-overlay");
      const mobileLinks = document.querySelectorAll(".mobile-link");
      const statusMessage = document.getElementById("status-message");

      // === LOGICA DEL MENU HAMBURGUESA (OFF-CANVAS) ===
      
      // Función para abrir el menú lateral
      function openMenu() {
        menuBtn.classList.add("active"); // Activa animación de hamburguesa a X
        mobileMenu.classList.remove("translate-x-full"); // Muestra el menú deslizándolo
        menuOverlay.classList.remove("hidden"); // Activa el contenedor del fondo oscuro
        setTimeout(() => {
          menuOverlay.classList.add("opacity-100"); // Transición suave de opacidad
        }, 10);
      }

      // Función para cerrar el menú lateral
      function closeMenu() {
        menuBtn.classList.remove("active"); // Vuelve el botón a estado original
        mobileMenu.classList.add("translate-x-full"); // Oculta el menú
        menuOverlay.classList.remove("opacity-100"); // Transición suave de opacidad
        setTimeout(() => {
          menuOverlay.classList.add("hidden");
        }, 300); // Espera que termine la animación css
      }

      // Evento de click para abrir/cerrar
      menuBtn.addEventListener("click", function() {
        const isOpen = menuBtn.classList.contains("active");
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Cerrar el menú si se hace click fuera (en el fondo oscuro)
      menuOverlay.addEventListener("click", closeMenu);

      // Cerrar el menú si se hace click en algún enlace del menú móvil
      mobileLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
      });
    });

    // === LÓGICA DE CONTROL DE FLUJO / REDIRECCIÓN ===
    // Función global que maneja el destino de los botones "Seminario" e "Instituto"
    function irAPagina(destino) {
      const statusMessage = document.getElementById("status-message");
      
      if (destino === 'seminario') {
        statusMessage.className = "w-full max-w-md p-4 rounded-xl bg-blue-50 border border-blue-200 text-center text-sm text-blue-800 animate-fade-in-up mt-4";
        statusMessage.innerHTML = "✨ Has seleccionado <strong>Seminario (14 a 17 años)</strong>. Pronto diseñaremos esta sección con materiales, horarios y registro para las clases diarias.";
      } else if (destino === 'instituto') {
        statusMessage.className = "w-full max-w-md p-4 rounded-xl bg-amber-50 border border-amber-200 text-center text-sm text-amber-800 animate-fade-in-up mt-4";
        statusMessage.innerHTML = "🌟 Has seleccionado <strong>Instituto (18 a 35 años)</strong>. Próximamente habilitaremos aquí los módulos de estudio, eventos y la vinculación a centros de estaca.";
      }
      
      statusMessage.classList.remove("hidden");

      // Desplaza suavemente hacia el mensaje de feedback
      statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }