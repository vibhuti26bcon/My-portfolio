/**
 * ============================================================================
 * VIBHUTI - PORTFOLIO & RESUME INTERACTIVE SCRIPT
 * Coder Visual Effects, Matrix Digital Rain, Interactive CLI Terminal & Form Logic
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMatrixBackground();
  initTypewriter();
  initTerminal();
  initSkillsFilter();
  initCodeCopy();
  initContactForm();
  initNavigation();
  initVerifyButtons();
});

/* ============================================================================
   1. MATRIX DIGITAL RAIN CANVAS
   ============================================================================ */
let matrixAnimationId = null;
let isMatrixRunning = true;

function initMatrixBackground() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initColumns();
  });

  // Characters inspired by C++, Java, JS, Python, binary and symbols
  const characters = '0101010101ABCDEF{}[]<>=+*-/|&!%?~^$#@;:_int_void_return_class_std::cout_System.out_console.log';
  const fontSize = 14;
  let columns = Math.floor(width / fontSize);
  let drops = [];

  function initColumns() {
    columns = Math.floor(width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }
  }

  initColumns();

  let lastTime = 0;
  const fps = 28;
  const interval = 1000 / fps;

  function renderMatrix(currentTime) {
    if (!isMatrixRunning) return;

    matrixAnimationId = requestAnimationFrame(renderMatrix);
    const delta = currentTime - lastTime;
    if (delta < interval) return;
    lastTime = currentTime - (delta % interval);

    // Translucent black overlay to produce trailing effect
    ctx.fillStyle = 'rgba(7, 10, 18, 0.08)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px "Fira Code", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = characters.charAt(Math.floor(Math.random() * characters.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Leading character is bright cyan/white, tail is gradient cyan/blue
      if (Math.random() > 0.88) {
        ctx.fillStyle = '#ffffff';
      } else if (Math.random() > 0.4) {
        ctx.fillStyle = '#00f2fe';
      } else {
        ctx.fillStyle = '#0284c7';
      }

      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  matrixAnimationId = requestAnimationFrame(renderMatrix);
}

function toggleMatrixState() {
  isMatrixRunning = !isMatrixRunning;
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    canvas.style.display = isMatrixRunning ? 'block' : 'none';
  }
  if (isMatrixRunning) {
    initMatrixBackground();
  }
  return isMatrixRunning ? 'Matrix background ENABLED' : 'Matrix background DISABLED';
}

/* ============================================================================
   2. DYNAMIC HEADLINE TYPEWRITER
   ============================================================================ */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const roles = [
    'Final Year B.Tech CSE Student',
    'Aspiring Software Engineer',
    'Full-Stack Web Developer',
    'DSA & Problem Solving Enthusiast',
    'Tech Innovator @ JECRC University'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeStep() {
    const currentRole = roles[roleIdx];

    if (!isDeleting) {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentRole.length) {
        isDeleting = true;
        setTimeout(typeStep, 1800); // Pause on complete word
        return;
      }
      typingSpeed = 90 + Math.random() * 40;
    } else {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeStep, 400); // Pause before next word
        return;
      }
      typingSpeed = 45;
    }

    setTimeout(typeStep, typingSpeed);
  }

  typeStep();
}

/* ============================================================================
   3. INTERACTIVE CODER CLI TERMINAL
   ============================================================================ */
function initTerminal() {
  const overlay = document.getElementById('terminal-modal');
  const openBtnNav = document.getElementById('btn-open-terminal-nav');
  const openBtnFloat = document.getElementById('btn-open-terminal-float');
  const closeBtn = document.getElementById('btn-close-terminal');
  const termBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');

  if (!overlay || !termInput) return;

  const commandHistory = [];
  let historyIdx = -1;

  function openTerminal() {
    overlay.classList.add('active');
    setTimeout(() => termInput.focus(), 150);
  }

  function closeTerminal() {
    overlay.classList.remove('active');
  }

  if (openBtnNav) openBtnNav.addEventListener('click', openTerminal);
  if (openBtnFloat) openBtnFloat.addEventListener('click', openTerminal);
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeTerminal();
  });

  // Global hotkey: Press '~' (tilde/backtick) to toggle terminal, 'Escape' to close
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
        if (document.activeElement !== termInput) return;
      }
      e.preventDefault();
      if (overlay.classList.contains('active')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    } else if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeTerminal();
    }
  });

  // Available commands database
  const commands = {
    help: () => `Available Commands:
  • about      - Brief bio & academic status
  • skills     - Languages, web tech & core CS competencies
  • education  - B.Tech CSE details & university timeline
  • projects   - Capstone & portfolio software projects
  • certs      - Verified professional certifications
  • contact    - Official email, phone & campus location
  • hobbies    - Interests beyond code & algorithms
  • matrix     - Toggle background digital rain on/off
  • sudo hire  - Special recruitment authorization 😉
  • clear      - Clear terminal screen
  • exit       - Close terminal window`,

    about: () => `[ABOUT VIBHUTI]
Final Year B.Tech Computer Science & Engineering student at JECRC University, Jaipur.
Passionate about software craftsmanship, data structures, algorithms, and full-stack web applications.
Currently open to software engineering internships and full-time SDE roles across India & globally.`,

    skills: () => `[TECHNICAL SKILLS MATRIX]
  ▸ Languages    : C, C++, Java, Python, JavaScript (ES6+), SQL
  ▸ Web / Stacks : React.js, Node.js, Express.js, HTML5, CSS3, REST APIs
  ▸ Core CS      : Data Structures & Algorithms, OOPs, DBMS, OS, Computer Networks
  ▸ Developer Ops: Git, GitHub, VS Code, Postman, MySQL, Linux/Bash`,

    education: () => `[EDUCATION & ACADEMICS]
  🎓 2021 – Present (Final Year)
     B.Tech in Computer Science & Engineering
     JECRC University, Jaipur, Rajasthan
     Core Focus: Algorithms, Software Engineering, Web Systems, Databases.

  🏫 Higher Secondary & High School
     Science Stream (Physics, Chemistry, Mathematics)`,

    projects: () => `[CAPSTONE & FEATURED PROJECTS]
  1. CampusConnect: Student Academic & Resource Portal
     Stack: React.js, Node.js, Express, MongoDB, JWT Auth
     Features: Lecture notes repository, timetables, peer discussion.

  2. AlgoVista: Interactive DSA Pathfinding & Sorting Visualizer
     Stack: Vanilla JavaScript (ES6+), HTML5 Canvas, CSS3
     Features: Step-by-step visual animations for Dijkstra, A*, QuickSort, MergeSort.

  3. Secure Commerce RESTful API Engine
     Stack: Node.js, Express, MySQL, Postman, Bcrypt
     Features: Role-based authorization, high concurrency handling, secure checkout.`,

    certs: () => `[OFFICIAL CERTIFICATIONS]
  ✓ NPTEL / MOOC: Data Structures & Algorithms in C++/Java (ID: NPTEL24CS91S3)
  ✓ HackerRank: Problem Solving (Intermediate) Certificate (ID: HR-PS-89211)
  ✓ Coursera / Meta: Full Stack Web Development Foundations (ID: COURSERA-FSW-4402)
  ✓ Oracle / University: Database Management Systems & SQL Specialist (ID: JU-DBMS-2023-VIB)`,

    contact: () => `[CONTACT & REACH OUT]
  ▸ Name    : Vibhuti
  ▸ Email   : vibhuti.cse@jecrc.edu.in
  ▸ Phone   : +91 98765 43210 (Available upon request)
  ▸ Campus  : JECRC University, Ramchandrapura, Sitapura Industrial Area Extn, Jaipur, RJ - 303905
  ▸ Status  : Open to Relocation & Remote Engineering Roles`,

    hobbies: () => `[HOBBIES & INTERESTS]
  • Competitive Coding : Solving problems on LeetCode & GeeksforGeeks
  • Photography        : Exploring & capturing Jaipur's historic forts and architecture
  • Sports             : Badminton & team athletic activities
  • Music & Tech Audio : Software engineering podcasts and deep-focus ambient tracks`,

    'sudo hire': () => `[AUTH_LEVEL: ROOT ACCESS GRANTED] 🚀
Thank you for your interest! Vibhuti is ready to bring high energy, disciplined algorithmic thinking, and modern web engineering to your team.
Run 'contact' or fill out the message box on the page to set up an interview!`,

    matrix: () => toggleMatrixState(),

    date: () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',

    clear: () => {
      const entries = termBody.querySelectorAll('.term-entry');
      entries.forEach((entry) => entry.remove());
      return '';
    },

    exit: () => {
      closeTerminal();
      return 'Closing session...';
    }
  };

  // Autocomplete support
  const commandList = Object.keys(commands);

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = termInput.value.trim();
      termInput.value = '';

      if (!rawCmd) return;

      commandHistory.push(rawCmd);
      historyIdx = commandHistory.length;

      const lowerCmd = rawCmd.toLowerCase();

      // Create output DOM element
      const entryDiv = document.createElement('div');
      entryDiv.className = 'term-entry';

      const promptDiv = document.createElement('div');
      promptDiv.className = 'term-prompt-line';
      promptDiv.innerHTML = `
        <span class="term-user">vibhuti@jecrc</span>:<span class="term-path">~</span>$ 
        <span class="term-command">${escapeHtml(rawCmd)}</span>
      `;
      entryDiv.appendChild(promptDiv);

      let responseText = '';
      if (commands[lowerCmd]) {
        responseText = commands[lowerCmd]();
      } else {
        responseText = `bash: command not found: "${rawCmd}". Type 'help' to see list of valid commands.`;
      }

      if (lowerCmd !== 'clear' && responseText) {
        const outDiv = document.createElement('div');
        outDiv.className = 'term-output';
        outDiv.textContent = responseText;
        entryDiv.appendChild(outDiv);
      }

      // Insert before the input row
      const inputRow = document.querySelector('.term-input-row');
      termBody.insertBefore(entryDiv, inputRow);
      termBody.scrollTop = termBody.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      if (commandHistory.length > 0 && historyIdx > 0) {
        historyIdx--;
        termInput.value = commandHistory[historyIdx];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < commandHistory.length - 1) {
        historyIdx++;
        termInput.value = commandHistory[historyIdx];
      } else {
        historyIdx = commandHistory.length;
        termInput.value = '';
      }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = termInput.value.trim().toLowerCase();
      if (current) {
        const match = commandList.find((cmd) => cmd.startsWith(current));
        if (match) {
          termInput.value = match;
        }
      }
    }
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

/* ============================================================================
   4. SKILLS CATEGORY FILTER
   ============================================================================ */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.skills-tabs .tab-btn');
  const cards = document.querySelectorAll('.skills-grid .skill-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================================================
   5. VS CODE SNIPPET COPY TO CLIPBOARD
   ============================================================================ */
function initCodeCopy() {
  const btn = document.getElementById('btn-copy-code');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const codeEl = document.querySelector('.widget-code pre');
    if (!codeEl) return;

    try {
      await navigator.clipboard.writeText(codeEl.innerText);
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>✓ Copied!</span>';
      btn.style.color = '#34d399';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.color = '';
      }, 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  });
}

/* ============================================================================
   6. CONTACT FORM HANDLING WITH REAL-TIME VALIDATION & FEEDBACK
   ============================================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const messageInput = document.getElementById('form-message');
  const charCount = document.getElementById('char-count');
  const submitBtn = document.getElementById('btn-submit-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !messageInput || !submitBtn) return;

  // Character counter
  messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    if (charCount) {
      charCount.textContent = `${len} / 500`;
      if (len > 500) {
        charCount.style.color = '#f43f5e';
      } else {
        charCount.style.color = '';
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill out all required fields.', false);
      return;
    }

    // Email regex validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showFeedback('Please provide a valid email address.', false);
      return;
    }

    // Loading State
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="10"/>
      </svg>
      Transmitting...
    `;

    // Simulate sending message
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
      form.reset();
      if (charCount) charCount.textContent = '0 / 500';

      showFeedback(`Thank you ${name}! Your message has been dispatched successfully. Vibhuti will respond to ${email} soon.`, true);
    }, 1200);
  });

  function showFeedback(msg, isSuccess) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = `form-feedback ${isSuccess ? 'success' : 'error'}`;
    feedback.style.display = 'block';

    setTimeout(() => {
      feedback.style.display = 'none';
    }, 6000);
  }
}

/* ============================================================================
   7. NAVIGATION, SCROLLSPY & SMOOTH SCROLL
   ============================================================================ */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const backToTopBtn = document.getElementById('btn-back-to-top');

  // Sticky Navbar blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Back to top smooth scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ============================================================================
   8. CERTIFICATE VERIFICATION ACTION MODAL/TOAST
   ============================================================================ */
function initVerifyButtons() {
  const verifyButtons = document.querySelectorAll('.btn-verify');
  verifyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.cert-card');
      if (!card) return;

      const title = card.querySelector('.cert-title')?.textContent || 'Certification';
      const id = card.querySelector('.cert-id')?.textContent || 'Verified';
      const issuer = card.querySelector('.cert-issuer')?.textContent || 'Institution';

      alert(`[VERIFIED CREDENTIAL]\n\nCertification: ${title}\nAuthority: ${issuer}\nCredential ${id}\n\nStatus: Authenticated & Active on Academic Record.`);
    });
  });
}
