'use client';

// Global variables
let userName = '';
let stars = [];
let fireworksActive = true;
let isMusicPlaying = false;
let isMuted = false;
let originalVolume = 0.3;
let music = null;
let progressUpdateInterval;

// Initialize the page
function initPage() {
    createStars();
    createShootingStars();
    
    // Initialize music element
    music = document.getElementById('backgroundMusic');
    
    // Hide main content initially
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('openingAnimation').style.display = 'none';
    
    // Focus on name input
    document.getElementById('fullscreenNameInput').focus();
    
    // Set up name input to auto-capitalize first letter
    setupAutoCapitalize();
    
    // Set up music progress bar
    setupMusicProgress();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start automatic fireworks
    startAutomaticFireworks();
    
    // Create star fall animation style
    const style = document.createElement('style');
    style.id = 'star-fall-animation';
    style.textContent = `
        @keyframes starFall {
            0% {
                transform: translateY(-100px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Set up music progress bar
function setupMusicProgress() {
    // Set initial total time
    music.addEventListener('loadedmetadata', function() {
        const totalMinutes = Math.floor(music.duration / 60);
        const totalSeconds = Math.floor(music.duration % 60);
        document.getElementById('totalTime').textContent = 
            `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
    });
    
    // Update progress bar
    music.addEventListener('timeupdate', updateProgressBar);
    
    // Handle music end
    music.addEventListener('ended', function() {
        isMusicPlaying = false;
        document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-play"></i>';
        clearInterval(progressUpdateInterval);
    });
    
    // Handle music error
    music.addEventListener('error', function(e) {
        console.error('Music loading error:', e);
        showToast('Music could not be loaded', 'error');
    });
}

// Update progress bar
function updateProgressBar() {
    if (music && music.duration) {
        const progressPercent = (music.currentTime / music.duration) * 100;
        document.getElementById('musicProgress').style.width = `${progressPercent}%`;
        
        // Update time display
        const currentMinutes = Math.floor(music.currentTime / 60);
        const currentSeconds = Math.floor(music.currentTime % 60);
        document.getElementById('currentTime').textContent = 
            `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
        
        const totalMinutes = Math.floor(music.duration / 60);
        const totalSeconds = Math.floor(music.duration % 60);
        document.getElementById('totalTime').textContent = 
            `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
    }
}

// Set up auto-capitalization for name input
function setupAutoCapitalize() {
    const nameInput = document.getElementById('fullscreenNameInput');
    const openingNameInput = document.getElementById('openingNameInput');
    
    function capitalizeFirstLetter(inputElement) {
        inputElement.addEventListener('input', function(e) {
            const cursorPosition = this.selectionStart;
            const originalValue = this.value;
            
            if (originalValue.length > 0) {
                // Capitalize first letter of each word
                const words = originalValue.split(' ');
                const capitalizedWords = words.map(word => {
                    // Don't change empty words
                    if (word.length === 0) return '';
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                });
                
                const newValue = capitalizedWords.join(' ');
                this.value = newValue;
                
                // Restore cursor position
                const newPosition = cursorPosition + (newValue.length - originalValue.length);
                this.setSelectionRange(newPosition, newPosition);
            }
        });
    }
    
    capitalizeFirstLetter(nameInput);
    capitalizeFirstLetter(openingNameInput);
}

// Start automatic fireworks
function startAutomaticFireworks() {
    // Initial burst when page loads
    setTimeout(() => {
        triggerConfettiBurst();
    }, 1000);
    
    // Periodic fireworks
    setInterval(() => {
        if (fireworksActive && Math.random() > 0.7) {
            triggerRandomFireworks();
        }
    }, 5000);
}

// Create starry background
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random twinkle speed
        const duration = Math.random() * 3 + 2;
        star.style.setProperty('--duration', `${duration}s`);
        
        // Random brightness
        const opacity = Math.random() * 0.7 + 0.3;
        star.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starsContainer.appendChild(star);
        stars.push(star);
    }
}

// Create shooting stars
function createShootingStars() {
    const starsContainer = document.getElementById('stars');
    
    setInterval(() => {
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        
        // Random starting position
        shootingStar.style.left = `${Math.random() * 30}%`;
        shootingStar.style.top = `${Math.random() * 30}%`;
        
        // Random speed
        const speed = Math.random() * 2 + 1;
        shootingStar.style.animationDuration = `${speed}s`;
        
        starsContainer.appendChild(shootingStar);
        
        // Remove after animation completes
        setTimeout(() => {
            if (shootingStar.parentNode) {
                shootingStar.remove();
            }
        }, speed * 1000);
        
    }, 3000);
}

// Trigger confetti burst (for welcome and main display)
function triggerConfettiBurst() {
    // Multiple bursts from different positions
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
    
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
    }, 250);
    
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 500);
    
    // Create star particles
    createStarParticles(20);
}

// Trigger random fireworks
function triggerRandomFireworks() {
    confetti({
        particleCount: 80,
        spread: 100,
        origin: { 
            x: Math.random(),
            y: Math.random() * 0.5
        }
    });
    
    createStarParticles(10);
}

// Create star particles
function createStarParticles(count = 15) {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ffd700', '#ff8c00', '#ff4500', '#00bfff', '#32cd32'];
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star-particle';
        
        // Random properties
        const size = Math.random() * 5 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Animation
        const duration = Math.random() * 2 + 1;
        star.style.animation = `starFall ${duration}s linear forwards`;
        
        container.appendChild(star);
        
        // Remove after animation
        setTimeout(() => {
            if (star.parentNode) {
                star.remove();
            }
        }, duration * 1000);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Fullscreen start button
    document.getElementById('fullscreenStartBtn').addEventListener('click', startCelebration);
    
    // Opening animation start button
    document.getElementById('startBtn').addEventListener('click', startCelebration);
    
    // Enter key support for name inputs
    document.getElementById('fullscreenNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startCelebration();
        }
    });
    
    document.getElementById('openingNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startCelebration();
        }
    });
    
    // Share card button
    document.getElementById('shareCardBtn').addEventListener('click', shareCard);
    
    // Download card button
    document.getElementById('downloadCardBtn').addEventListener('click', downloadCard);
    
    // Music control buttons - FIXED PLAY/PAUSE
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    
    playPauseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMusic();
    });
    
    muteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMute();
    });
    
    // Music progress bar click
    document.getElementById('musicProgressBar').addEventListener('click', function(e) {
        if (music && music.duration) {
            const progressBar = this.getBoundingClientRect();
            const clickPosition = e.clientX - progressBar.left;
            const percentage = clickPosition / progressBar.width;
            music.currentTime = percentage * music.duration;
            updateProgressBar();
        }
    });
    
    // Social media sharing
    document.getElementById('whatsappShare').addEventListener('click', shareOnWhatsApp);
    document.getElementById('instagramShare').addEventListener('click', openInstagram);
    document.getElementById('facebookShare').addEventListener('click', openFacebook);
}

// Toggle background music - FIXED FUNCTION
function toggleMusic() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (!music) {
        console.error('Music element not found');
        return;
    }
    
    if (isMusicPlaying) {
        // Pause music
        music.pause();
        isMusicPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        showToast('Music paused', 'info');
        clearInterval(progressUpdateInterval);
    } else {
        // Play music
        try {
            music.volume = isMuted ? 0 : originalVolume;
            const playPromise = music.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isMusicPlaying = true;
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    showToast('Music playing', 'success');
                    updateProgressBar();
                    
                    // Start progress update interval
                    progressUpdateInterval = setInterval(updateProgressBar, 100);
                }).catch(error => {
                    console.error('Play failed:', error);
                    showToast('Please interact with page first', 'warning');
                });
            }
        } catch (error) {
            console.error('Play error:', error);
            showToast('Could not play music', 'error');
        }
    }
}

// Toggle mute
function toggleMute() {
    const muteBtn = document.getElementById('muteBtn');
    
    if (!music) return;
    
    if (isMuted) {
        // Unmute
        music.volume = originalVolume;
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        showToast('Sound unmuted', 'success');
    } else {
        // Mute
        originalVolume = music.volume;
        music.volume = 0;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        showToast('Sound muted', 'info');
    }
    isMuted = !isMuted;
}

// WhatsApp sharing function
function shareOnWhatsApp() {
    const message = `🥳 Bye Bye 2025, Hello 2026!\n\nनई मस्ती, नए सपने और ढेर सारी खुशियाँ।\nHappy New Year दोस्त 🎉🔥\n\nCheck out this amazing New Year greeting: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918004492996?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    showToast('Opening WhatsApp...', 'info');
}

// Instagram function (opens a profile)
function openInstagram() {
    const instagramUrl = 'https://www.instagram.com/its_badboy2024?igsh=MW4xeG1hYnNpNzdvcg==';
    window.open(instagramUrl, '_blank');
    showToast('Opening Instagram...', 'info');
}

// Facebook function (opens a profile)
function openFacebook() {
    const facebookUrl = 'https://www.facebook.com/lacky.babu.900';
    window.open(facebookUrl, '_blank');
    showToast('Opening Facebook...', 'info');
}

// Start celebration (main function)
function startCelebration() {
    let nameInput = document.getElementById('fullscreenNameInput');
    userName = nameInput.value.trim();
    
    if (!userName) {
        showToast('Please enter your name to continue', 'warning');
        nameInput.focus();
        nameInput.style.borderColor = '#ff4500';
        nameInput.style.boxShadow = '0 0 20px rgba(255, 69, 0, 0.5)';
        
        setTimeout(() => {
            nameInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            nameInput.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        }, 2000);
        return;
    }
    
    // Start music automatically when celebration starts
    if (!isMusicPlaying && music) {
        try {
            music.volume = originalVolume;
            const playPromise = music.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isMusicPlaying = true;
                    document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
                    updateProgressBar();
                    
                    // Start progress update interval
                    progressUpdateInterval = setInterval(updateProgressBar, 100);
                }).catch(error => {
                    console.log('Music auto-play prevented:', error);
                });
            }
        } catch (error) {
            console.error('Music play error:', error);
        }
    }
    
    // Trigger massive confetti celebration
    triggerMassiveConfetti();
    
    // Update display name
    document.getElementById('userNameText').textContent = userName;
    document.getElementById('cardUserName').textContent = `Happy New Year, ${userName}!`;
    
    // Hide fullscreen header
    setTimeout(() => {
        const fullscreenHeader = document.getElementById('fullscreenHeader');
        fullscreenHeader.style.opacity = '0';
        fullscreenHeader.style.transform = 'translateY(-50px)';
        
        setTimeout(() => {
            fullscreenHeader.style.display = 'none';
            
            // Show main content
            const mainContent = document.getElementById('mainContent');
            mainContent.style.display = 'block';
            
            // Scroll to modern header
            setTimeout(() => {
                document.getElementById('modernHeader').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Show welcome message
                showToast(`Welcome ${userName}! Happy New Year 2026! 🎉`, 'success');
                
                // Trigger more confetti when greeting card appears
                setTimeout(() => {
                    triggerConfettiBurst();
                }, 1000);
            }, 300);
        }, 1000);
    }, 1500);
}

// Trigger massive confetti celebration
function triggerMassiveConfetti() {
    // Multiple confetti bursts
    for(let i = 0; i < 5; i++) {
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { 
                    x: Math.random(),
                    y: Math.random() * 0.5
                },
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
            });
        }, i * 300);
    }
    
    // Create lots of star particles
    createStarParticles(50);
}

// Share card function
async function shareCard() {
    const shareText = `🎉 Happy New Year 2026! 🎉\n\nCheck out my personalized New Year greeting!\n\nMade for: ${userName}\n\nMay 2026 bring you endless joy and success!\n\n#HappyNewYear2026 #NewYearGreetings`;
    
    try {
        if (navigator.share) {
            await navigator.share({
                title: `New Year 2026 - ${userName}`,
                text: shareText,
                url: window.location.href
            });
            showToast('Greeting shared successfully!', 'success');
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareText + '\n\n' + window.location.href);
            showToast('Greeting copied to clipboard!', 'success');
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = shareText + '\n\n' + window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Greeting copied! Share it with friends.', 'success');
        }
    } catch (error) {
        console.error('Sharing failed:', error);
        showToast('Failed to share. Try copying the link manually.', 'error');
    }
}

// Download card as image
function downloadCard() {
    showToast('Generating your greeting card...', 'info');
    
    const card = document.getElementById('greetingCard');
    const actions = card.querySelector('.card-actions');
    const musicControl = card.querySelector('.music-control-section');
    const originalDisplay = actions.style.display;
    const originalMusicDisplay = musicControl.style.display;
    actions.style.display = 'none';
    musicControl.style.display = 'none';
    
    html2canvas(card, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
    }).then(canvas => {
        actions.style.display = originalDisplay;
        musicControl.style.display = originalMusicDisplay;
        
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `New-Year-2026-${userName.replace(/\s+/g, '-')}.png`;
        link.href = image;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Card downloaded successfully!', 'success');
    }).catch(error => {
        actions.style.display = originalDisplay;
        musicControl.style.display = originalMusicDisplay;
        console.error('Download failed:', error);
        showToast('Failed to download. Try taking a screenshot.', 'error');
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'fas fa-info-circle';
    if (type === 'success') icon = 'fas fa-check-circle';
    if (type === 'error') icon = 'fas fa-exclamation-circle';
    if (type === 'warning') icon = 'fas fa-exclamation-triangle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 400);
    }, 3000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initPage);

// Performance optimization
window.addEventListener('beforeunload', () => {
    stars = [];
    clearInterval(progressUpdateInterval);
});

// Prevent default behavior for music buttons to ensure they work
document.addEventListener('DOMContentLoaded', function() {
    // Add touch event listeners for mobile
    document.getElementById('playPauseBtn').addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleMusic();
    });
    
    document.getElementById('muteBtn').addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleMute();
    });
});