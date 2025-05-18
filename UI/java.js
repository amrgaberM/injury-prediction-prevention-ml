/* java.js – Enhanced UI Scripts with Futuristic Design, FAQ Toggle,
   Hamburger & Dark Mode Toggles */

/* Utility Functions */
const utils = {
  sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },
  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
};

/* Particle Background with Interactive Connections and Mouse Attraction */
window.addEventListener('load', () => {
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    // Set canvas size and account for high DPI displays
    function setCanvasSize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    }
    setCanvasSize();

    let particlesArray = [];
    const numberOfParticles = 100;
    const maxDistance = 120;
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Bounce off edges (accounting for scaling)
        if (this.x < 0 || this.x > canvas.width / (window.devicePixelRatio || 1)) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height / (window.devicePixelRatio || 1)) this.speedY *= -1;

        // Mouse interaction for futuristic attraction/repulsion effect
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 2;
            this.y -= (dy / distance) * force * 2;
          }
        }
      }
      draw() {
        ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * canvas.width / (window.devicePixelRatio || 1);
        const y = Math.random() * canvas.height / (window.devicePixelRatio || 1);
        const speedX = (Math.random() - 0.5) * 1;
        const speedY = (Math.random() - 0.5) * 1;
        particlesArray.push(new Particle(x, y, size, speedX, speedY));
      }
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.strokeStyle = `rgba(0,229,255,${1 - distance / maxDistance})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', utils.debounce(() => {
      setCanvasSize();
      initParticles();
    }, 200));
  }
});

/* DOM Ready Events for FAQ Toggle, Hamburger & Dark Mode Toggle */
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader-wrapper');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  // Scroll to Top
  const scrollTop = document.createElement('div');
  scrollTop.className = 'scroll-top';
  scrollTop.innerHTML = '↑';
  document.body.appendChild(scrollTop);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }
  });

  scrollTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
    });
  }

  // FAQ Toggle Setup
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      question.parentElement.classList.toggle('active');
    });
    question.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        question.parentElement.classList.toggle('active');
      }
    });
  });
});