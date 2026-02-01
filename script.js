/* ============================================================
   INNER SUNSHINE THERAPIES — SHARED JAVASCRIPT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Navigation scroll effect --- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 48);
  });

  /* --- Mobile hamburger --- */
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }
  // Close mobile nav on link click
  if (navLinks) {
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* --- Active nav link (based on current page) --- */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === page);
  });

  /* --- Floating CTA visibility --- */
  const floatingCTA = document.getElementById('floatingCTA');
  // Hide floating CTA entirely on the contact page
  if (page === 'contact.html' && floatingCTA) {
    floatingCTA.style.display = 'none';
  }

  window.addEventListener('scroll', () => {
    if (floatingCTA && floatingCTA.style.display !== 'none') {
      floatingCTA.classList.toggle('visible', window.scrollY > 320);
    }
  });

  /* --- Scroll Reveal (IntersectionObserver) --- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal for performance
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealIO.observe(el));

  /* --- Dynamic pet name field (contact page) --- */
  const serviceSelect = document.getElementById('serviceInterest');
  const petFieldWrap = document.getElementById('petFieldWrap');

  if (serviceSelect && petFieldWrap) {
    const animalServices = ['animal-communication', 'animal-healing'];

    function togglePetField() {
      const isAnimal = animalServices.includes(serviceSelect.value);
      petFieldWrap.classList.toggle('hidden', !isAnimal);
      petFieldWrap.classList.toggle('visible', isAnimal);
    }

    serviceSelect.addEventListener('change', togglePetField);
    togglePetField(); // initial state
  }

  /* --- Netlify Form AJAX Handler --- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', handleSubmit);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const form       = e.target;
    const statusDiv  = document.getElementById('formStatus');
    const submitBtn  = form.querySelector('.submit-btn');

    // Reset status
    statusDiv.className = 'form-status';
    statusDiv.innerHTML = '';

    // Disable while sending
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // Build URL-encoded body that Netlify expects
    const body = new URLSearchParams(new FormData(form)).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    })
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      // Success
      statusDiv.className = 'form-status success';
      statusDiv.innerHTML =
        '<span class="si">✓</span>' +
        '<div><strong>Message Sent!</strong>Thank you for reaching out. Michelle will be in touch with you shortly.</div>';
      form.reset();
      // Re-hide pet field after reset
      if (petFieldWrap) {
        petFieldWrap.classList.add('hidden');
        petFieldWrap.classList.remove('visible');
      }
    })
    .catch(err => {
      console.error('Form submission error:', err);
      statusDiv.className = 'form-status error';
      statusDiv.innerHTML =
        '<span class="si">!</span>' +
        '<div><strong>Something went wrong.</strong>Please try again, or reach out directly via email.</div>';
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    });
  }

});
