// Configuración del número telefónico (código de país sin '+')
    const PHONE_NUMBER = "5491122520286"; 

    // Referencias al DOM
    const popup = document.getElementById('whatsapp-popup');
    const toggleBtn = document.getElementById('toggle-whatsapp');
    const closeBtn = document.getElementById('close-popup');
    const iconWhatsapp = document.getElementById('icon-whatsapp');
    const iconClose = document.getElementById('icon-close');
    const messageInput = document.getElementById('user-message');
    const tooltip = document.getElementById('floating-tooltip');
    const whatsappForm = document.getElementById('whatsapp-form');
    const quickButtons = document.querySelectorAll('.quick-btn');

    let isOpen = false;

    // Alternar visibilidad del Popup
    function togglePopup() {
      isOpen = !isOpen;

      if (isOpen) {
        popup.classList.remove('popup-closed');
        popup.classList.add('popup-open');
        
        iconWhatsapp.classList.add('hidden');
        iconClose.classList.remove('hidden');
        tooltip.classList.add('!hidden');

        setTimeout(() => messageInput.focus(), 150);
      } else {
        popup.classList.remove('popup-open');
        popup.classList.add('popup-closed');
        
        iconWhatsapp.classList.remove('hidden');
        iconClose.classList.add('hidden');
        tooltip.classList.remove('!hidden');
      }
    }

    // Event listeners principales
    toggleBtn.addEventListener('click', togglePopup);
    closeBtn.addEventListener('click', togglePopup);

    // Configurar botones de respuesta rápida
    quickButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const topic = btn.getAttribute('data-topic');
        messageInput.value = `Hola, quisiera realizar una consulta sobre: ${topic}.`;
        messageInput.focus();
      });
    });

    // Envío del mensaje hacia WhatsApp
    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userMsg = messageInput.value.trim();

      if (!userMsg) return;

      const encodedMsg = encodeURIComponent(userMsg);
      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMsg}`;

      window.open(whatsappUrl, '_blank');

      togglePopup();
      messageInput.value = '';
    });

    // Cerrar emergente con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        togglePopup();
      }
    });