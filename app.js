// ==========================================================================
// VEO SOUNDWAVE - HERO PINNED INTRO ENGINE
// ==========================================================================

const FRAME_COUNT = 228;
const images = [];
let loadedCount = 0;
let isHeroLoadComplete = false;

// Setup image file path helper
const getFramePath = (index) => {
  return `frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
};

// Cache and preload all images
function preloadImages(callback) {
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.querySelector('.progress-percent');

  for (let i = 1; i <= FRAME_COUNT; i++) {
    const img = new Image();
    img.src = getFramePath(i);
    img.onload = () => {
      loadedCount++;
      const percent = Math.floor((loadedCount / FRAME_COUNT) * 100);
      
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressPercent) progressPercent.textContent = `${percent}%`;

      if (loadedCount === FRAME_COUNT) {
        setTimeout(() => {
          const preloader = document.getElementById('preloader');
          if (preloader) preloader.classList.add('fade-out');
          callback();
        }, 500);
      }
    };
    img.onerror = () => {
      console.error(`Failed to load frame: ${img.src}`);
      loadedCount++;
    };
    images.push(img);
  }
}

// Canvas references
let showcaseCanvas, showcaseCtx;
let pinnedSection, stickyWrapper;

// Initialize elements & bindings
document.addEventListener('DOMContentLoaded', () => {
  showcaseCanvas = document.getElementById('showcase-canvas');
  showcaseCtx = showcaseCanvas.getContext('2d');
  
  pinnedSection = document.querySelector('.pinned-section');
  stickyWrapper = document.querySelector('.sticky-wrapper');

  preloadImages(() => {
    initShowcase();
    initAuth();
    
    // Initial draw
    drawShowcaseFrame(1);
    
    // Fade in intro title and subtitle overlay
    const introOverlay = document.getElementById('intro-text-overlay');
    if (introOverlay) {
      setTimeout(() => {
        introOverlay.classList.add('visible');
        setTimeout(() => {
          isHeroLoadComplete = true;
        }, 2000); // Hold for 2 seconds
      }, 300);
    }
  });
});

function initShowcase() {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', resizeShowcaseCanvas);
  resizeShowcaseCanvas();
  setupSmoothScroll();
}

function resizeShowcaseCanvas() {
  const rect = showcaseCanvas.parentElement.getBoundingClientRect();
  showcaseCanvas.width = rect.width * window.devicePixelRatio;
  showcaseCanvas.height = rect.height * window.devicePixelRatio;
  showcaseCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  // Re-draw frame
  handleScroll();
}

function handleScroll() {
  if (!pinnedSection || !stickyWrapper) return;
  
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const pinnedHeight = pinnedSection.offsetHeight;
  const windowHeight = window.innerHeight;
  
  const scrollMax = pinnedHeight - windowHeight;
  const scrollFraction = Math.min(1, Math.max(0, scrollTop / scrollMax));
  
  // Map fraction to frames index
  const frameIndex = Math.min(
    FRAME_COUNT,
    Math.max(1, Math.ceil(scrollFraction * FRAME_COUNT))
  );
  
  // Render frame
  requestAnimationFrame(() => drawShowcaseFrame(frameIndex));

  // Fade out hero overlay text gradually as user scrolls 30% of the section
  const introOverlay = document.getElementById('intro-text-overlay');
  if (introOverlay) {
    if (scrollTop > 0 || isHeroLoadComplete) {
      if (scrollFraction <= 0.3) {
        const progress = scrollFraction / 0.3; // 0 to 1
        const scrollOpacity = 1 - progress;
        introOverlay.style.opacity = scrollOpacity;
        const drift = scrollFraction * 120; // Upward drift
        introOverlay.style.transform = `translate(-50%, calc(-50% - ${drift}px))`;
        introOverlay.style.filter = `blur(${progress * 8}px)`; // blur out
        introOverlay.style.pointerEvents = scrollOpacity < 0.1 ? 'none' : 'auto';
      } else {
        introOverlay.style.opacity = 0;
        introOverlay.style.filter = 'blur(8px)';
        introOverlay.style.pointerEvents = 'none';
      }
    }
  }

  // Toggle navbar background transition
  const header = document.querySelector('header');
  if (header) {
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
}

function setupSmoothScroll() {
  document.querySelectorAll('header a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const headerOffset = 64; // Height of the sticky navbar + slight buffer
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function drawShowcaseFrame(index) {
  if (!images[index - 1]) return;
  
  const img = images[index - 1];
  const cw = showcaseCanvas.width / window.devicePixelRatio;
  const ch = showcaseCanvas.height / window.devicePixelRatio;
  
  showcaseCtx.clearRect(0, 0, cw, ch);
  
  // Calculate aspect ratio covering canvas
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = cw / ch;
  
  let drawW, drawH, drawX, drawY;
  
  if (canvasRatio > imgRatio) {
    drawW = cw;
    drawH = cw / imgRatio;
    drawX = 0;
    drawY = (ch - drawH) / 2;
  } else {
    drawW = ch * imgRatio;
    drawH = ch;
    drawX = (cw - drawW) / 2;
    drawY = 0;
  }
  
  showcaseCtx.drawImage(img, drawX, drawY, drawW, drawH);
}

// ==========================================================================
// SIMULATED LOCALSTORAGE AUTHENTICATION SYSTEM
// ==========================================================================

function initAuth() {
  const navLoginBtn = document.getElementById('nav-login-btn');
  const authModal = document.getElementById('auth-modal');
  const closeAuthModal = document.getElementById('close-auth-modal');
  const authBackdrop = document.getElementById('auth-backdrop');
  
  const loginView = document.getElementById('login-view');
  const signupView = document.getElementById('signup-view');
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToLogin = document.getElementById('switch-to-login');
  
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  const userAvatarBtn = document.getElementById('user-avatar-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  const logoutBtn = document.getElementById('logout-btn');

  // Toggle modal open/close
  if (navLoginBtn) {
    navLoginBtn.addEventListener('click', () => {
      authModal.classList.remove('hidden');
      loginView.classList.remove('hidden');
      signupView.classList.add('hidden');
    });
  }

  const hideModal = () => {
    authModal.classList.add('hidden');
    document.getElementById('login-error').classList.add('hidden');
  };

  if (closeAuthModal) closeAuthModal.addEventListener('click', hideModal);
  if (authBackdrop) authBackdrop.addEventListener('click', hideModal);

  // Switch between Login and Sign Up views
  if (switchToSignup) {
    switchToSignup.addEventListener('click', () => {
      loginView.classList.add('hidden');
      signupView.classList.remove('hidden');
    });
  }
  if (switchToLogin) {
    switchToLogin.addEventListener('click', () => {
      signupView.classList.add('hidden');
      loginView.classList.remove('hidden');
    });
  }

  // Handle forms submit
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (signupForm) signupForm.addEventListener('submit', handleSignup);

  // Dropdown menu toggle
  if (userAvatarBtn) {
    userAvatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });
  }

  // Close dropdown on click outside
  document.addEventListener('click', () => {
    if (profileDropdown) profileDropdown.classList.add('hidden');
  });

  if (profileDropdown) {
    profileDropdown.addEventListener('click', (e) => e.stopPropagation());
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('logged_in_user');
      updateAuthUI(null);
      if (profileDropdown) profileDropdown.classList.add('hidden');
    });
  }

  // Check initial state
  const savedUser = JSON.parse(localStorage.getItem('logged_in_user'));
  updateAuthUI(savedUser);
}

function updateAuthUI(user) {
  const navLoginBtn = document.getElementById('nav-login-btn');
  const userProfileMenu = document.getElementById('user-profile-menu');
  const userAvatarInitial = document.getElementById('user-avatar-initial');
  const dropdownUserName = document.getElementById('dropdown-user-name');
  const dropdownUserEmail = document.getElementById('dropdown-user-email');

  if (user) {
    // User is logged in
    if (navLoginBtn) navLoginBtn.classList.add('hidden');
    if (userProfileMenu) userProfileMenu.classList.remove('hidden');
    if (userAvatarInitial) userAvatarInitial.textContent = user.name.charAt(0).toUpperCase();
    if (dropdownUserName) dropdownUserName.textContent = user.name;
    if (dropdownUserEmail) dropdownUserEmail.textContent = user.email;
  } else {
    // User is logged out
    if (navLoginBtn) navLoginBtn.classList.remove('hidden');
    if (userProfileMenu) userProfileMenu.classList.add('hidden');
  }
}

function handleLogin(e) {
  e.preventDefault();
  const emailInput = document.getElementById('login-email').value.trim();
  const passwordInput = document.getElementById('login-password').value;
  const loginError = document.getElementById('login-error');

  // Read users from storage
  const users = JSON.parse(localStorage.getItem('registered_users')) || [];
  
  // Find matching user
  const user = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase() && u.password === passwordInput);

  if (user) {
    // Store active login session
    localStorage.setItem('logged_in_user', JSON.stringify({ name: user.name, email: user.email }));
    updateAuthUI(user);
    
    // Clear forms
    document.getElementById('login-form').reset();
    document.getElementById('auth-modal').classList.add('hidden');
  } else {
    // Show error
    if (loginError) loginError.classList.remove('hidden');
  }
}

function handleSignup(e) {
  e.preventDefault();
  const nameInput = document.getElementById('signup-name').value.trim();
  const emailInput = document.getElementById('signup-email').value.trim();
  const passwordInput = document.getElementById('signup-password').value;

  // Read current users
  const users = JSON.parse(localStorage.getItem('registered_users')) || [];
  
  // Check duplicate
  const duplicate = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
  if (duplicate) {
    alert("An account with this email already exists!");
    return;
  }

  // Create new user profile
  const newUser = { name: nameInput, email: emailInput, password: passwordInput };
  users.push(newUser);
  localStorage.setItem('registered_users', JSON.stringify(users));

  // Log in automatically
  localStorage.setItem('logged_in_user', JSON.stringify({ name: newUser.name, email: newUser.email }));
  updateAuthUI(newUser);

  // Reset & Close
  document.getElementById('signup-form').reset();
  document.getElementById('auth-modal').classList.add('hidden');
}

// ==========================================================================
// SUPABASE BACKEND INTEGRATION
// ==========================================================================

const supabaseUrl = 'https://srrkbcqggjjugfqhxtua.supabase.co';
const supabaseKey = 'sb_publishable_qq3RyG6BwmEfbjv1v2WTmg_L2uREJhl';
let supabaseClient = null;

try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.error("Failed to initialize Supabase:", e);
}

// Hook appointment form submission to Supabase
document.addEventListener('DOMContentLoaded', () => {
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const full_name = document.getElementById('appointment-name').value.trim();
      const email = document.getElementById('appointment-email').value.trim();
      const phone = document.getElementById('appointment-phone').value.trim();
      const dob = document.getElementById('appointment-dob').value;
      const department = document.getElementById('appointment-dept').value;
      const doctor = document.getElementById('appointment-specialist').value;
      const appointment_date = document.getElementById('appointment-date').value;
      const time_slot = document.getElementById('appointment-timeslot').value;
      const reason = document.getElementById('appointment-message').value.trim();
      
      // Auto-generate a unique ticket ID (E.g. NOVA-48293)
      const ticket_id = 'NOVA-' + Math.floor(10000 + Math.random() * 90000);
      
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      const submitBtnText = submitBtn.querySelector('span');
      const originalText = submitBtnText.textContent;
      
      submitBtnText.textContent = "Booking...";
      submitBtn.disabled = true;
      
      if (!supabaseClient) {
        alert("Supabase CDN failed to load. Please check your internet connection.");
        submitBtnText.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }
      
      try {
        const { error } = await supabaseClient
          .from('appointments')
          .insert([{ 
            ticket_id,
            full_name,
            email,
            phone,
            dob,
            department,
            doctor,
            appointment_date,
            time_slot,
            reason
          }]);
          
        if (error) throw error;
        
        alert(`🎉 Booking Successful!\n\nYour Ticket ID is: ${ticket_id}\nDetails saved to your Supabase backend.`);
        appointmentForm.reset();
      } catch (err) {
        console.error("Supabase database error:", err);
        alert(`⚠️ Supabase connection failed: ${err.message || err}\n\nTo resolve this:\n1. Execute the SQL script provided to create the table inside your Supabase SQL Editor.\n2. Ensure columns exactly match: ticket_id, full_name, email, phone, dob, department, doctor, appointment_date, time_slot, reason.\n3. Make sure public INSERT is allowed in your RLS policies.`);
      } finally {
        submitBtnText.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

