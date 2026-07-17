// ========================================
// PORTFOLIO SCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeatmap();
  initScrollReveal();
  initSmoothScroll();
  initPhotoLoader();
  initCountUp();
});

// ---- Navbar ----
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('open');
    });
  });

  // Navbar scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.style.padding = '10px 0';
      navbar.style.background = 'rgba(5, 5, 16, 0.95)';
    } else {
      navbar.style.padding = '16px 0';
      navbar.style.background = 'rgba(5, 5, 16, 0.8)';
    }
    lastScroll = currentScroll;
  });

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.navbar-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ---- Contribution Heatmap ----
function initHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  const monthsContainer = document.getElementById('heatmapMonths');
  if (!grid) return;

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const weeks = 52;
  const daysPerWeek = 7;

  // Generate month labels
  months.forEach((month, i) => {
    const span = document.createElement('span');
    span.textContent = month;
    span.style.width = `${(weeks / months.length) * 15}px`;
    monthsContainer.appendChild(span);
  });

  // Generate heatmap cells with realistic-looking contribution data
  // Create a pattern that mimics real GitHub activity
  const contributionData = generateContributionData(weeks, daysPerWeek);

  for (let week = 0; week < weeks; week++) {
    const column = document.createElement('div');
    column.className = 'heatmap-column';

    for (let day = 0; day < daysPerWeek; day++) {
      const cell = document.createElement('div');
      const level = contributionData[week][day];
      cell.className = `heatmap-cell level-${level}`;

      // Tooltip
      const contributions = [0, 1, 3, 6, 12][level];
      cell.title = `${contributions} contributions`;

      column.appendChild(cell);
    }

    grid.appendChild(column);
  }
}

function generateContributionData(weeks, days) {
  const data = [];

  for (let w = 0; w < weeks; w++) {
    const weekData = [];
    // Simulate more activity on weekdays, less on weekends
    // Create streaks and gaps that look realistic
    const weekActivity = Math.random();
    const isActiveWeek = weekActivity > 0.25;

    for (let d = 0; d < days; d++) {
      if (!isActiveWeek) {
        weekData.push(Math.random() > 0.85 ? 1 : 0);
      } else {
        const isWeekend = d >= 5;
        if (isWeekend) {
          const r = Math.random();
          weekData.push(r > 0.7 ? (r > 0.9 ? 2 : 1) : 0);
        } else {
          const r = Math.random();
          if (r > 0.8) weekData.push(4);
          else if (r > 0.55) weekData.push(3);
          else if (r > 0.3) weekData.push(2);
          else if (r > 0.12) weekData.push(1);
          else weekData.push(0);
        }
      }
    }
    data.push(weekData);
  }

  return data;
}

// ---- Scroll Reveal ----
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ---- Smooth Scroll ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ---- Photo Loader ----
function initPhotoLoader() {
  const heroPhotoEl = document.getElementById('heroPhoto');
  const aboutPhotoEl = document.getElementById('aboutPhoto');

  // Try loading profile photo
  const heroImg = new Image();
  heroImg.src = 'images/profile-photo.jpg';
  heroImg.onload = function () {
    heroImg.className = 'hero-profile-img';
    heroImg.alt = 'Profile photo';
    heroPhotoEl.replaceWith(heroImg);
  };

  // Try loading about photo
  const aboutImg = new Image();
  aboutImg.src = 'images/about-photo.jpg';
  aboutImg.onload = function () {
    aboutImg.className = 'about-photo';
    aboutImg.alt = 'About photo';
    aboutPhotoEl.replaceWith(aboutImg);
  };

  // Also try PNG versions
  const heroImgPng = new Image();
  heroImgPng.src = 'images/profile-photo.png';
  heroImgPng.onload = function () {
    if (heroPhotoEl.parentNode) {
      heroImgPng.className = 'hero-profile-img';
      heroImgPng.alt = 'Profile photo';
      heroPhotoEl.replaceWith(heroImgPng);
    }
  };

  const aboutImgPng = new Image();
  aboutImgPng.src = 'images/about-photo.png';
  aboutImgPng.onload = function () {
    if (aboutPhotoEl.parentNode) {
      aboutImgPng.className = 'about-photo';
      aboutImgPng.alt = 'About photo';
      aboutPhotoEl.replaceWith(aboutImgPng);
    }
  };
}

// ---- Count Up Animation ----
function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number, .achievement-value, .streak-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateValue(el) {
  const text = el.textContent.trim();
  const hasPlus = text.includes('+');
  const hasComma = text.includes(',');

  let numStr = text.replace(/[^0-9]/g, '');
  const targetNum = parseInt(numStr, 10);

  if (isNaN(targetNum) || targetNum === 0) return;

  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easedProgress * targetNum);

    let displayVal = currentVal.toString();
    if (hasComma && currentVal >= 1000) {
      displayVal = currentVal.toLocaleString();
    }
    if (hasPlus) displayVal += '+';

    el.textContent = displayVal;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Ensure final value matches original
      el.textContent = text;
    }
  }

  requestAnimationFrame(update);
}
