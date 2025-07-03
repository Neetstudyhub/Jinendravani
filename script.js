// search and sidebar 
  document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-btn');
    const searchIcon = document.getElementById('search-icon');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.querySelector('#search-bar input');
    const searchClear = document.getElementById('search-clear');
    const searchMic = document.getElementById('search-mic');
    const searchBack = document.getElementById('search-back');
    let recognition;
    let isListening = false;
    let finalTranscript = '';
    let voiceTimeout;
    
    // Initialize Web Speech API with better sensitivity
    function initSpeechRecognition() {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Your browser does not support voice search.");
        return;
      }
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      
      recognition.onstart = () => {
        isListening = true;
        finalTranscript = '';
        document.getElementById('mic-pulse').style.borderColor = '#1a73e8';
        document.getElementById('popup-status').textContent = 'Listening...';
        document.getElementById('popup-transcript').textContent = '';
        document.getElementById('try-again-btn').style.display = 'none';
        
        // Show pop-up
        document.getElementById('voice-popup').style.display = 'block';
        
        // Auto-stop after 5 seconds
        voiceTimeout = setTimeout(() => {
          recognition.stop();
          performSearch(finalTranscript.trim());
        }, 5000);
      };
      
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i][0];
          if (result.confidence > 0.4) { // Only consider confident results
            finalTranscript += result.transcript.trim() + ' ';
          }
        }
        if (finalTranscript.trim()) {
          document.getElementById('popup-transcript').textContent = finalTranscript.trim();
        }
      };
      
      recognition.onerror = (event) => {
        clearTimeout(voiceTimeout);
        document.getElementById('popup-status').textContent = 'Error occurred.';
        document.getElementById('popup-transcript').textContent = event.error;
        document.getElementById('try-again-btn').style.display = 'inline-block';
      };
      
      recognition.onend = () => {
        isListening = false;
        document.getElementById('mic-pulse').style.borderColor = '#ccc';
        const transcript = document.getElementById('popup-transcript').textContent.trim();
        
        if (!transcript) {
          document.getElementById('popup-status').textContent = 'No input detected.';
          document.getElementById('try-again-btn').style.display = 'inline-block';
        } else {
          document.getElementById('popup-status').textContent = 'Processing...';
          setTimeout(() => {
            performSearch(transcript);
            document.getElementById('voice-popup').style.display = 'none';
          }, 500);
        }
      };
    }
    
    // Perform search with query
    function performSearch(query) {
      if (!query) return;
      
      // Redirect to Blogger search page
      window.location.href = '/search?q=' + encodeURIComponent(query);
    }
    
    // Voice Search Button
    searchMic.addEventListener('click', () => {
      if (!recognition) initSpeechRecognition();
      if (!isListening) {
        searchInput.value = '';
        document.getElementById('voice-popup').style.display = 'block';
        recognition.start();
      } else {
        recognition.stop();
        document.getElementById('voice-popup').style.display = 'none';
      }
    });
    
    // Try Again Button
    document.getElementById('try-again-btn').addEventListener('click', () => {
      document.getElementById('popup-transcript').textContent = '';
      document.getElementById('popup-status').textContent = 'Listening...';
      document.getElementById('try-again-btn').style.display = 'none';
      recognition.start();
    });
    
    // Close Popup on Click
    document.getElementById('close-popup')?.addEventListener('click', () => {
      document.getElementById('voice-popup').style.display = 'none';
      if (isListening) recognition.stop();
    });
    
    // Text Search - Press Enter
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.value.trim();
        if (query) performSearch(encodeURIComponent(query));
      }
    });
    
    // Open Sidebar
    hamburger.addEventListener('click', () => {
      if (searchBar.classList.contains('active')) return;
      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.classList.add('sidebar-open');
      trapFocus(sidebar);
    });
    
    function closeSidebar() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('sidebar-open');
      document.querySelectorAll('.has-submenu').forEach(item => {
        item.classList.remove('open');
        const submenu = item.querySelector('.submenu');
        if (submenu) submenu.style.maxHeight = null;
      });
    }
    
    // Trap Focus Inside Sidebar
    function trapFocus(container) {
      const focusableEls = Array.from(container.querySelectorAll('a[href], button, input'));
      const firstFocusableEl = focusableEls[0];
      const lastFocusableEl = focusableEls[focusableEls.length - 1];
      
      document.addEventListener('keydown', function(e) {
        if (!sidebar.classList.contains('active')) return;
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstFocusableEl) {
            e.preventDefault();
            lastFocusableEl.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusableEl) {
            e.preventDefault();
            firstFocusableEl.focus();
          }
        }
      });
    }
    
    // ESC key closes sidebar or search bar
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSidebar();
        if (searchBar.classList.contains('active')) {
          searchBar.classList.remove('active');
          searchIcon.classList.remove('active');
          searchInput.value = '';
          searchClear.style.display = 'none';
          searchMic.style.display = 'none';
          searchBack.style.display = 'none';
          header.classList.remove('search-active');
          logo.style.display = 'block';
          navContainer.style.display = 'flex';
          searchIcon.style.display = 'flex';
        }
      }
    });
    
    // Clear Text
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      searchInput.focus();
    });
    
    // Show/hide icons based on input
    searchInput.addEventListener('input', () => {
      searchClear.style.display = searchInput.value ? 'inline-block' : 'none';
    });
    
    // Back Arrow Click
    searchBack.addEventListener('click', () => {
      searchBar.classList.remove('active');
      searchIcon.classList.remove('active');
      searchInput.value = '';
      searchClear.style.display = 'none';
      searchMic.style.display = 'none';
      searchBack.style.display = 'none';
      header.classList.remove('search-active');
      logo.style.display = 'block';
      navContainer.style.display = 'flex';
      searchIcon.style.display = 'flex';
    });
    
    // Open Search Bar
    searchIcon.addEventListener('click', () => {
      searchBar.classList.add('active');
      searchIcon.classList.add('active');
      searchInput.focus();
      searchBack.style.display = 'inline-block';
      searchClear.style.display = searchInput.value ? 'inline-block' : 'none';
      searchMic.style.display = 'inline-block';
      header.classList.add('search-active');
      logo.style.display = 'none';
      navContainer.style.display = 'none';
      searchIcon.style.display = 'none';
    });
    
    searchIcon.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        searchIcon.click();
      }
    });
    
    // Close on Outside Click
    document.addEventListener('click', function(e) {
      const popup = document.getElementById('voice-popup');
      if (popup && popup.style.display === 'block' && !popup.contains(e.target) && e.target !== searchMic) {
        popup.style.display = 'none';
        if (isListening) recognition.stop();
      }
    });
    
    // Close on ESC
    document.addEventListener('keydown', function(e) {
      const popup = document.getElementById('voice-popup');
      if (e.key === 'Escape' && popup) {
        popup.style.display = 'none';
        if (isListening) recognition.stop();
      }
    });


  // Text Search - Press Enter
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = encodeURIComponent(this.value.trim());
      if (query) window.location.href = '/search?q=' + query;
    }
  });
  
  // Open Sidebar
  hamburger.addEventListener('click', () => {
    if (searchBar.classList.contains('active')) return;
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('sidebar-open');
    trapFocus(sidebar);
  });
  
  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
    document.querySelectorAll('.has-submenu').forEach(item => {
      item.classList.remove('open');
      const submenu = item.querySelector('.submenu');
      if (submenu) submenu.style.maxHeight = null;
    });
  }
  
  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
  
  // Toggle Submenu
  document.querySelectorAll('.has-submenu > a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const parent = this.parentElement;
      const submenu = this.nextElementSibling;
      const isOpen = parent.classList.contains('open');
      parent.classList.toggle('open');
      submenu.style.maxHeight = isOpen ? null : submenu.scrollHeight + "px";
      this.setAttribute('aria-expanded', !isOpen);
    });
  });
  
  // Trap Focus Inside Sidebar
  function trapFocus(container) {
    const focusableEls = Array.from(container.querySelectorAll('a[href], button, input'));
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    
    document.addEventListener('keydown', function(e) {
      if (!sidebar.classList.contains('active')) return;
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusableEl) {
          e.preventDefault();
          lastFocusableEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusableEl) {
          e.preventDefault();
          firstFocusableEl.focus();
        }
      }
    });
  }
  
  // Close sidebar if focus moves out
  document.addEventListener('focusin', function() {
    if (!sidebar.classList.contains('active')) return;
    if (!sidebar.contains(document.activeElement)) {
      closeSidebar();
    }
  });
  
  // Click/tap outside closes sidebar
  document.addEventListener('click', function(e) {
    if (!sidebar.classList.contains('active')) return;
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target) && !searchIcon.contains(e.target)) {
      closeSidebar();
    }
  });
  
  // ESC key closes sidebar or search bar
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeSidebar();
      if (searchBar.classList.contains('active')) {
        searchBar.classList.remove('active');
        searchIcon.classList.remove('active');
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchMic.style.display = 'none';
        searchBack.style.display = 'none';
        header.classList.remove('search-active');
        logo.style.display = 'block';
        navContainer.style.display = 'flex';
        searchIcon.style.display = 'flex';
      }
    }
  });
  
  // Open Search Bar
  searchIcon.addEventListener('click', () => {
    searchBar.classList.add('active');
    searchIcon.classList.add('active');
    searchInput.focus();
    searchBack.style.display = 'inline-block';
    searchClear.style.display = searchInput.value ? 'inline-block' : 'none';
    searchMic.style.display = 'inline-block';
    header.classList.add('search-active');
    logo.style.display = 'none';
    navContainer.style.display = 'none';
    searchIcon.style.display = 'none';
  });
  
  searchIcon.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      searchIcon.click();
    }
  });
  
  // Back Arrow Click
  searchBack.addEventListener('click', () => {
    searchBar.classList.remove('active');
    searchIcon.classList.remove('active');
    searchInput.value = '';
    searchClear.style.display = 'none';
    searchMic.style.display = 'none';
    searchBack.style.display = 'none';
    header.classList.remove('search-active');
    logo.style.display = 'block';
    navContainer.style.display = 'flex';
    searchIcon.style.display = 'flex';
  });
  
  // Clear Text
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    searchInput.focus();
  });
  
  // Show/hide icons based on input
  searchInput.addEventListener('input', () => {
    searchClear.style.display = searchInput.value ? 'inline-block' : 'none';
  });
  
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.length > 0) {
      searchClear.style.display = 'inline-block';
    }
    searchMic.style.display = 'inline-block';
  });
  
  searchInput.addEventListener('blur', () => {
  setTimeout(() => {
    if (!searchBar.contains(document.activeElement)) {
      searchBar.classList.remove('active');
      searchIcon.classList.remove('active');
      searchInput.value = '';
      searchClear.style.display = 'none';
      searchMic.style.display = 'none';
      searchBack.style.display = 'none';
      header.classList.remove('search-active');
      logo.style.display = 'block';
      navContainer.style.display = 'flex';
      searchIcon.style.display = 'flex';
    }
  }, 100);
  });
  
  });
  
  
  
  
  
