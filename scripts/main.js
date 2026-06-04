document.addEventListener("DOMContentLoaded", function() {
  
  // === SELECCIÓN DE ELEMENTOS DEL DOM ===
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuOverlay = document.getElementById("menu-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const globalStatusMessage = document.getElementById("status-message");

  // === LOGICA DEL MENU HAMBURGUESA (OFF-CANVAS) ===
  
  function openMenu() {
    menuBtn.classList.add("open"); // Cambiado a "open" para que coincida con tu CSS de la X
    mobileMenu.classList.remove("translate-x-full"); 
    menuOverlay.classList.remove("hidden"); 
    setTimeout(() => {
      menuOverlay.classList.add("opacity-100"); 
    }, 10);
  }

  function closeMenu() {
    menuBtn.classList.remove("open"); 
    mobileMenu.classList.add("translate-x-full"); 
    menuOverlay.classList.remove("opacity-100"); 
    setTimeout(() => {
      menuOverlay.classList.add("hidden");
    }, 300); 
  }

  menuBtn.addEventListener("click", function() {
    const isOpen = menuBtn.classList.contains("open");
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


  // === PROCESAMIENTO DEL FORMULARIO DE CONTACTO ===
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); 
      
      const btnText = submitBtn.querySelector('span');
      const originalText = btnText.textContent;
      btnText.textContent = "Enviando...";
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-70', 'cursor-not-allowed');

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        globalStatusMessage.classList.remove('hidden');
        if (response.ok) {
          globalStatusMessage.className = "w-full max-w-md p-4 rounded-xl bg-green-50 border border-green-300 text-center text-sm text-green-800 font-medium mt-4 animate-pulse mx-auto";
          globalStatusMessage.innerHTML = "✨ ¡Información enviada con éxito! Un coordinador se pondrá en contacto contigo pronto.";
          contactForm.reset(); 
        } else {
          globalStatusMessage.className = "w-full max-w-md p-4 rounded-xl bg-red-50 border border-red-300 text-center text-sm text-red-800 font-medium mt-4 mx-auto";
          globalStatusMessage.innerHTML = "❌ Hubo un problema al enviar. Por favor, inténtalo de nuevo.";
        }
      })
      .catch(error => {
        globalStatusMessage.classList.remove('hidden');
        globalStatusMessage.className = "w-full max-w-md p-4 rounded-xl bg-red-50 border border-red-300 text-center text-sm text-red-800 font-medium mt-4 mx-auto";
        globalStatusMessage.innerHTML = "🌐 Error de red. Verifica tu conexión a internet.";
      })
      .finally(() => {
        btnText.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        
        globalStatusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }
});

// === LÓGICA DE CONTROL DE FLUJO / VIDEOS / REDIRECCIÓN (GLOBAL) ===
function irAPagina(destino) {
  const statusMessage = document.getElementById("status-message");
  const contactoSection = document.getElementById("contacto");
  const videoContainer = document.getElementById("video-container");
  const videoPlayer = document.getElementById("video-player");
  const videoTitle = document.getElementById("video-title");

  // === CONFIGURACIÓN DE REPRODUCTOR OFICIAL DE LA IGLESIA (BRIGHTCOVE - CERO ANUNCIOS) ===
  // Estos enlaces son los reproductores limpios incrustados oficiales de la Iglesia.
  const videoSeminario = "https://players.brightcove.net/1241706627001/default_default/index.html?videoId=6016140540001"; 
  const videoInstituto = "https://players.brightcove.net/1241706627001/default_default/index.html?videoId=6271926685001"; 

  // Limpiar el reproductor para evitar parpadeos o pantallas congeladas
  if (videoPlayer) videoPlayer.src = "";

  if (destino === 'seminario') {
    if (contactoSection) contactoSection.classList.add("hidden");
    
    if (videoContainer && videoPlayer && videoTitle) {
      videoTitle.innerHTML = "🎬 Invitación Personal a Seminario";
      videoPlayer.src = videoSeminario;
      videoContainer.classList.remove("hidden");
    }

    statusMessage.className = "w-full max-w-md p-4 rounded-xl bg-blue-50 border border-blue-200 text-center text-sm text-blue-800 animate-fade-in-up mt-4 mx-auto";
    statusMessage.innerHTML = "✨ Has seleccionado <strong>Seminario (14 a 17 años)</strong>. Pronto diseñaremos esta sección con materiales, horarios y registro para las clases diarias.";
    statusMessage.classList.remove("hidden");
    
    videoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } 
  
  else if (destino === 'instituto') {
    statusMessage.classList.add("hidden");
    
    if (videoContainer && videoPlayer && videoTitle) {
      videoTitle.innerHTML = "🎬 Invitación Especial a Instituto";
      videoPlayer.src = videoInstituto;
      videoContainer.classList.remove("hidden");
    }

    if (contactoSection) {
      contactoSection.classList.remove("hidden");
    }

    videoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


function gotopage(pagina) {
 window.location.href = pagina;
}