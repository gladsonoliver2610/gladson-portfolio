import React, { useState, useEffect, useMemo } from 'react';

// ---- Child Component: Heatmap ----
function Heatmap() {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const weeks = 52;
  const daysPerWeek = 7;

  // Generate month labels styles and widths
  const monthLabels = useMemo(() => {
    return months.map((month, i) => (
      <span key={i} style={{ width: `${(weeks / months.length) * 15}px` }}>
        {month}
      </span>
    ));
  }, []);

  // Generate heatmap cells with contribution level data
  const contributionData = useMemo(() => {
    const data = [];
    for (let w = 0; w < weeks; w++) {
      const weekData = [];
      const weekActivity = Math.random();
      const isActiveWeek = weekActivity > 0.25;

      for (let d = 0; d < daysPerWeek; d++) {
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
  }, []);

  return (
    <div className="heatmap-card reveal">
      <div className="heatmap-header">
        <div>
          <div className="section-label">CONTRIBUTIONS</div>
          <h3>Activity Heatmap</h3>
        </div>
        <a href="https://github.com/gladsonoliver2610" target="_blank" rel="noopener noreferrer" className="view-github-btn">View on GitHub →</a>
      </div>

      <div className="heatmap-months" id="heatmapMonths">
        {monthLabels}
      </div>
      <div className="heatmap-body">
        <div className="heatmap-days">
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
          <span>Su</span>
        </div>
        <div className="heatmap-grid" id="heatmapGrid">
          {contributionData.map((weekData, wIndex) => (
            <div key={wIndex} className="heatmap-column">
              {weekData.map((level, dIndex) => {
                const contributions = [0, 1, 3, 6, 12][level];
                return (
                  <div
                    key={dIndex}
                    className={`heatmap-cell level-${level}`}
                    title={`${contributions} contributions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        <div className="legend-cell heatmap-cell level-0"></div>
        <div className="legend-cell heatmap-cell level-1"></div>
        <div className="legend-cell heatmap-cell level-2"></div>
        <div className="legend-cell heatmap-cell level-3"></div>
        <div className="legend-cell heatmap-cell level-4"></div>
        <span>More</span>
      </div>
    </div>
  );
}

// ---- Main App Component ----
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [crtActive, setCrtActive] = useState(true);

  // Live GitHub Stats State
  const [gitStats, setGitStats] = useState({
    repos: 4,
    stars: 0,
    followers: 0,
    forks: 0,
    following: 0,
    avatarUrl: null,
    languages: [
      { name: 'JavaScript', percent: 74.1, color: '🟨', class: 'lang-javascript' },
      { name: 'HTML', percent: 14.1, color: '🟧', class: 'lang-html' },
      { name: 'TypeScript', percent: 9.4, color: '🟦', class: 'lang-typescript' },
      { name: 'CSS', percent: 2.5, color: '🎨', class: 'lang-css' }
    ]
  });

  // Fetch Live GitHub data
  useEffect(() => {
    // 1. Fetch main user profile details
    fetch('https://api.github.com/users/gladsonoliver2610')
      .then(res => res.json())
      .then(profile => {
        if (profile && !profile.message) {
          setGitStats(prev => ({
            ...prev,
            repos: profile.public_repos ?? prev.repos,
            followers: profile.followers ?? prev.followers,
            following: profile.following ?? prev.following,
            avatarUrl: profile.avatar_url ?? prev.avatarUrl
          }));
        }
      })
      .catch(err => console.error('Error fetching profile:', err));

    // 2. Fetch user repositories to compute total stars, forks, and top languages
    fetch('https://api.github.com/users/gladsonoliver2610/repos?per_page=100')
      .then(res => res.json())
      .then(repos => {
        if (Array.isArray(repos)) {
          let totalStars = 0;
          let totalForks = 0;
          const langCounts = {};

          repos.forEach(repo => {
            totalStars += repo.stargazers_count || 0;
            totalForks += repo.forks_count || 0;
            if (repo.language) {
              langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
            }
          });

          // Compute language percentages
          const totalLangsCount = Object.values(langCounts).reduce((a, b) => a + b, 0);
          let computedLanguages = [];

          if (totalLangsCount > 0) {
            const colorMap = {
              'JavaScript': { color: '🟨', class: 'lang-javascript' },
              'HTML': { color: '🟧', class: 'lang-html' },
              'TypeScript': { color: '🟦', class: 'lang-typescript' },
              'CSS': { color: '🎨', class: 'lang-css' },
              'Java': { color: '☕', class: 'lang-java' },
              'Python': { color: '🐍', class: 'lang-python' },
              'C++': { color: '⚙️', class: 'lang-cpp' },
              'C#': { color: '⚙️', class: 'lang-csharp' },
              'Shell': { color: '🐚', class: 'lang-shell' }
            };

            computedLanguages = Object.entries(langCounts)
              .map(([name, count]) => {
                const percent = parseFloat(((count / totalLangsCount) * 100).toFixed(1));
                const meta = colorMap[name] || { color: '📄', class: 'lang-css' };
                return { name, percent, ...meta };
              })
              .sort((a, b) => b.percent - a.percent);
          }

          setGitStats(prev => ({
            ...prev,
            stars: totalStars,
            forks: totalForks,
            languages: computedLanguages.length > 0 ? computedLanguages : prev.languages
          }));
        }
      })
      .catch(err => console.error('Error fetching repos:', err));
  }, []);

  // 3. CRT active effect on document body
  useEffect(() => {
    if (crtActive) {
      document.body.classList.add('crt-active');
    } else {
      document.body.classList.remove('crt-active');
    }
  }, [crtActive]);

  // 4. Scroll effects (navbar shrinkage, active link tracking, reveals, countups)
  useEffect(() => {
    const handleScroll = () => {
      // Navbar scroll style trigger
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Active section highlight tracking
      const sections = document.querySelectorAll('section[id]');
      let current = 'home';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 5. Scroll Reveal IntersectionObserver
  useEffect(() => {
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
    return () => observer.disconnect();
  }, []);

  // 6. CountUp Animation IntersectionObserver
  useEffect(() => {
    const statNumbers = document.querySelectorAll('.stat-number, .achievement-value, .streak-number');

    const animateValue = (el) => {
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
          el.textContent = text;
        }
      }

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [gitStats]); // Re-observe when gitStats changes and updates DOM values

  // 7. Smooth Scroll helper
  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className={crtActive ? "crt-flicker" : ""}>
      {/* Background Effects */}
      <div className="bg-grid"></div>
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      {/* ========== NAVBAR ========== */}
      <nav
        className="navbar"
        id="navbar"
        style={{
          padding: isScrolled ? '10px 0' : '16px 0',
          background: isScrolled ? 'rgba(5, 5, 16, 0.95)' : 'rgba(5, 5, 16, 0.8)'
        }}
      >
        <div className="container">
          <a href="#" className="navbar-logo" onClick={(e) => handleAnchorClick(e, 'home')}>Gladson Oliver</a>
          <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`} id="navLinks">
            <li>
              <a
                href="#home"
                className={activeSection === 'home' ? 'active' : ''}
                onClick={(e) => handleAnchorClick(e, 'home')}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className={activeSection === 'projects' ? 'active' : ''}
                onClick={(e) => handleAnchorClick(e, 'projects')}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#experience"
                className={activeSection === 'experience' ? 'active' : ''}
                onClick={(e) => handleAnchorClick(e, 'experience')}
              >
                Experience
              </a>
            </li>
            <li>
              <a
                href="#skills"
                className={activeSection === 'skills' ? 'active' : ''}
                onClick={(e) => handleAnchorClick(e, 'skills')}
              >
                Skills
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={(e) => handleAnchorClick(e, 'contact')}
              >
                Contact
              </a>
            </li>
          </ul>

          <button
            className="theme-toggle"
            id="themeToggle"
            aria-label="Toggle CRT mode"
            onClick={() => setCrtActive(!crtActive)}
            title={crtActive ? "Disable CRT Scanlines" : "Enable CRT Scanlines"}
          >
            ✦
          </button>

          <button
            className={`hamburger ${isMenuOpen ? 'open' : ''}`}
            id="hamburger"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="availability-badge reveal">
              <span className="dot"></span>
              Available for opportunities
            </div>

            <h1 className="hero-title reveal reveal-delay-1">
              Hi, I'm <span className="name">Gladson<br />Oliver</span> <span className="wave">👋</span>
            </h1>

            <p className="hero-description reveal reveal-delay-2">
              From <strong>curiosity</strong> to <span className="highlight-link" onClick={(e) => handleAnchorClick(e, 'about')} style={{ cursor: 'pointer' }}>full-stack development</span> —
              building the web, one experience at a time.
            </p>

            <div className="hero-buttons reveal reveal-delay-3">
              <a href="#about" className="btn-primary" onClick={(e) => handleAnchorClick(e, 'about')}>Read My Story →</a>
              <a href="#" className="btn-secondary">Resume 📄</a>
            </div>

            <div className="hero-tags reveal reveal-delay-4">
              <span className="hero-tag">Next.js</span>
              <span className="hero-tag">React</span>
              <span className="hero-tag">Node.js</span>
              <span className="hero-tag">TypeScript</span>
              <span className="hero-tag">PostgreSQL</span>
            </div>
          </div>

          <div className="hero-image-wrapper reveal">
            {gitStats.avatarUrl ? (
              <img src={gitStats.avatarUrl} className="hero-profile-img" alt="Gladson Oliver" />
            ) : (
              <div className="hero-profile-placeholder" id="heroPhoto">
                Add your photo<br />profile-photo.jpg
              </div>
            )}
            <div className="floating-dot purple" style={{ top: '15%', right: '15%' }}></div>
            <div className="floating-dot cyan" style={{ top: '55%', left: '0' }}></div>
            <div className="floating-dot pink" style={{ bottom: '15%', right: '5%' }}></div>
            <div className="floating-dot purple" style={{ top: '25%', right: '-5%' }}></div>
          </div>
        </div>

        <div className="scroll-indicator" onClick={(e) => handleAnchorClick(e, 'about')} style={{ cursor: 'pointer' }}>
          <span>SCROLL</span>
          <span className="scroll-dot"></span>
        </div>
      </section>

      {/* ========== ABOUT SECTION ========== */}
      <section className="about" id="about">
        <div className="section-label" style={{ textAlign: 'center', marginBottom: '8px' }}>ABOUT ME</div>
        <div className="container">
          <div className="about-image-wrapper reveal">
            <div className="about-image-card">
              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              {gitStats.avatarUrl ? (
                <img src={gitStats.avatarUrl} className="about-photo" alt="Gladson Oliver" />
              ) : (
                <div className="about-photo-placeholder" id="aboutPhoto">
                  Add your photo — about-photo.jpg
                </div>
              )}
            </div>

            <div className="about-exp-badge">
              <div className="exp-label">EXPERIENCE</div>
              <div className="exp-value">1+ <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>yrs</span></div>
            </div>

            <div className="about-name-tag">
              <div className="dev-label">// THE DEVELOPER</div>
              <div className="dev-name">Gladson Oliver</div>
              <div className="dev-location">Chennai, India</div>
              <div className="open-to-work-badge">
                <span className="check">✓</span>
                Open to Work
              </div>
            </div>
          </div>

          <div className="about-content">
            <div className="about-text-card reveal">
              <div className="quote-icon">❝</div>
              <p>Hi, I'm Gladson Oliver from Chennai, a passionate developer with expertise in Next.js, React, and Node, Express, Mongodb. Currently building high-quality software experiences.</p>
            </div>

            <div className="about-stats">
              <div className="about-stat-card reveal reveal-delay-1">
                <div className="stat-icon">🚀</div>
                <div className="stat-number">{gitStats.repos}+</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="about-stat-card reveal reveal-delay-2">
                <div className="stat-icon">💼</div>
                <div className="stat-number">3+</div>
                <div className="stat-label">Internships</div>
              </div>
              <div className="about-stat-card reveal reveal-delay-3">
                <div className="stat-icon">🏆</div>
                <div className="stat-number">5+</div>
                <div className="stat-label">Certificates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== GITHUB PRESENCE SECTION ========== */}
      <section className="github" id="github">
        <div className="container">
          <div className="github-header reveal">
            <div className="section-label">GITHUB PRESENCE</div>
            <h2 className="section-title">Code, <span className="purple">Commits</span> & <span className="orange">Craft</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>A living record of curiosity turned into code — pulled live from GitHub.</p>

            <div className="github-badges">
              <span className="github-badge">PROFILE VIEWS <span className="badge-count">539</span></span>
              <span className="github-badge">FOLLOWERS <span className="badge-count">{gitStats.followers}</span></span>
              <span className="github-badge">STARS <span className="badge-count" style={{ background: 'var(--accent-orange)' }}>{gitStats.stars}</span></span>
            </div>
          </div>

          <div className="github-stats-grid">
            <div className="github-stat-card reveal">
              <div className="stat-icon">🛡️</div>
              <div className="stat-number">{gitStats.repos}</div>
              <div className="stat-label">Repositories</div>
            </div>
            <div className="github-stat-card reveal reveal-delay-1">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">{gitStats.stars}</div>
              <div className="stat-label">Total Stars</div>
            </div>
            <div className="github-stat-card reveal reveal-delay-2">
              <div className="stat-icon">👥</div>
              <div className="stat-number">{gitStats.followers}</div>
              <div className="stat-label">Followers</div>
            </div>
            <div className="github-stat-card reveal reveal-delay-3">
              <div className="stat-icon">🍴</div>
              <div className="stat-number">{gitStats.forks}</div>
              <div className="stat-label">Total Forks</div>
            </div>
          </div>

          <div className="github-detail-row">
            <div className="github-streak-card reveal">
              <div className="streak-item">
                <div className="streak-number">3,374</div>
                <div className="streak-label">Total Contributions</div>
                <div className="streak-date">Sep 25, 2021 - Present</div>
              </div>
              <div className="streak-ring">
                <svg width="80" height="80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(139, 92, 246, 0.15)" stroke-width="4" />
                  <circle cx="40" cy="40" r="35" fill="none" stroke="var(--accent-purple)" stroke-width="4"
                    strokeDasharray="220" strokeDashoffset="215" strokeLinecap="round" />
                </svg>
                <span className="ring-value">1</span>
                <span className="ring-icon">🔥</span>
              </div>
              <div className="streak-item">
                <div className="streak-number">20</div>
                <div className="streak-label">Longest Streak</div>
                <div className="streak-date">Jun 30, 2024 - Jul 19, 2024</div>
              </div>
            </div>
            <div className="github-stats-image reveal">
              <span className="github-stats-placeholder">GitHub stats card</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTRIBUTIONS / HEATMAP ========== */}
      <section className="contributions">
        <div className="container">
          <Heatmap />

          <div className="languages-card reveal">
            <div className="section-label">LANGUAGES</div>
            <h3>Top Languages</h3>
            <p className="lang-subtitle">Based on your public repos</p>

            {gitStats.languages.map((lang, index) => (
              <React.Fragment key={index}>
                <div className="language-item" style={{ marginTop: index > 0 ? '14px' : '0px' }}>
                  <span className="lang-icon">{lang.color}</span>
                  <span className="lang-name">{lang.name}</span>
                  <span className="lang-percent">{lang.percent}%</span>
                </div>
                <div className={`language-bar ${lang.class}`}>
                  <div className="bar-fill" style={{ width: `${lang.percent}%` }}></div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ACHIEVEMENTS SECTION ========== */}
      <section className="achievements">
        <div className="container">
          <div className="achievements-header reveal">
            <div className="section-label">ACHIEVEMENTS</div>
            <h2 className="section-title">Unlocked <span className="highlight">Milestones</span> 🎮</h2>
          </div>

          <div className="achievements-grid">
            <div className="achievement-card reveal">
              <div className="achievement-icon">⭐</div>
              <div className="achievement-value">{gitStats.stars}</div>
              <div className="achievement-label">Total Stars</div>
              <span className="unlocked-badge">🔓 Unlocked</span>
            </div>
            <div className="achievement-card reveal reveal-delay-1">
              <div className="achievement-icon">🛡️</div>
              <div className="achievement-value">{gitStats.repos}</div>
              <div className="achievement-label">Repositories</div>
              <span className="unlocked-badge">🔓 Unlocked</span>
            </div>
            <div className="achievement-card reveal reveal-delay-2">
              <div className="achievement-icon">👥</div>
              <div className="achievement-value">{gitStats.followers}</div>
              <div className="achievement-label">Followers</div>
              <span className="unlocked-badge">🔓 Unlocked</span>
            </div>
            <div className="achievement-card reveal reveal-delay-3">
              <div className="achievement-icon">🍴</div>
              <div className="achievement-value">{gitStats.forks}</div>
              <div className="achievement-label">Total Forks</div>
              <span className="unlocked-badge">🔓 Unlocked</span>
            </div>
            <div className="achievement-card reveal reveal-delay-4">
              <div className="achievement-icon">👁️</div>
              <div className="achievement-value">{gitStats.following}</div>
              <div className="achievement-label">Following</div>
              <span className="unlocked-badge">🔓 Unlocked</span>
            </div>
            <div className="achievement-card reveal">
              <div className="achievement-icon">🔭</div>
              <div className="achievement-value">{gitStats.languages.length}+</div>
              <div className="achievement-label">Languages</div>
              <span className="unlocked-badge">🔓 Unlocked</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TECHNOLOGIES SECTION ========== */}
      <section className="technologies" id="skills">
        <div className="container">
          <div className="technologies-header reveal">
            <div className="section-label">TOOLS OF THE TRADE</div>
            <h2 className="section-title">Technologies I <span className="highlight">worked with</span></h2>
            <p className="section-subtitle">Battle-tested through real projects and production deployments.</p>
          </div>

          <div className="tech-grid">
            <div className="tech-card reveal">
              <div className="tech-icon">⚛️</div>
              <div className="tech-name">React</div>
            </div>
            <div className="tech-card reveal reveal-delay-1">
              <div className="tech-icon" style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>N</div>
              <div className="tech-name">Next.js</div>
            </div>
            <div className="tech-card reveal reveal-delay-2">
              <div className="tech-icon" style={{ color: '#3178c6', fontWeight: 700, fontSize: '1.2rem', background: '#3178c6', color: '#fff', width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>TS</div>
              <div className="tech-name">TypeScript</div>
            </div>
            <div className="tech-card reveal reveal-delay-3">
              <div className="tech-icon">💚</div>
              <div className="tech-name">Node.js</div>
            </div>
            <div className="tech-card reveal reveal-delay-4">
              <div className="tech-icon">🐘</div>
              <div className="tech-name">PostgreSQL</div>
            </div>
            <div className="tech-card reveal">
              <div className="tech-icon">🌊</div>
              <div className="tech-name">TailwindCSS</div>
            </div>
            <div className="tech-card reveal reveal-delay-1">
              <div className="tech-icon">🍃</div>
              <div className="tech-name">MongoDB</div>
            </div>
            <div className="tech-card reveal reveal-delay-2">
              <div className="tech-icon" style={{ color: '#f05032' }}>⎇</div>
              <div className="tech-name">Git</div>
            </div>
            <div className="tech-card reveal reveal-delay-3">
              <div className="tech-icon">△</div>
              <div className="tech-name">Prisma</div>
            </div>
            <div className="tech-card reveal reveal-delay-4">
              <div className="tech-icon" style={{ fontWeight: 300, fontSize: '1.6rem', fontFamily: 'monospace' }}>ex</div>
              <div className="tech-name">Express</div>
            </div>
            <div className="tech-card reveal">
              <div className="tech-icon" style={{ background: '#f7df1e', color: '#000', width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', margin: '0 auto 12px' }}>JS</div>
              <div className="tech-name">JavaScript</div>
            </div>
            <div className="tech-card reveal reveal-delay-1">
              <div className="tech-icon">🐳</div>
              <div className="tech-name">Docker</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Gladson Oliver. Crafted with ❤️ and ☕</p>
        </div>
      </footer>
    </div>
  );
}
