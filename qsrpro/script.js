// QSRPro Website - JavaScript with Advanced Animations and Branching Logic

document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }));

    // Smooth scrolling for navigation links
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

    // Navbar background on scroll
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .step-item, .equipment-item, .vision-card').forEach(el => {
        observer.observe(el);
    });

    // Early Access Form Handling
    const earlyAccessForm = document.getElementById('earlyAccessForm');
    if (earlyAccessForm) {
        earlyAccessForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Thank You!';
                submitBtn.style.background = '#28a745';

                // Reset form
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 2000);
        });
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = '#28a745';

                // Reset form
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 2000);
        });
    }

    // Stats counter animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        updateCounter();
    }

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('+')) {
                        const num = parseInt(text.replace('+', ''));
                        stat.textContent = '0';
                        animateCounter(stat, num, 2000);
                        setTimeout(() => {
                            stat.textContent = num + '+';
                        }, 2000);
                    } else if (text.includes('%')) {
                        const num = parseInt(text.replace('%', ''));
                        stat.textContent = '0';
                        animateCounter(stat, num, 2000);
                        setTimeout(() => {
                            stat.textContent = num + '%';
                        }, 2000);
                    } else if (text.includes('min')) {
                        const num = parseInt(text.replace('min', ''));
                        stat.textContent = '0';
                        animateCounter(stat, num, 2000);
                        setTimeout(() => {
                            stat.textContent = num + 'min';
                        }, 2000);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // Parallax effect for floating icons
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-icon');

        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // ===== INTERACTIVE PHONE MOCKUP WITH BRANCHING =====

    // Define the diagnostic flow
    const diagnosticFlow = [
        {
            id: 1,
            title: 'Check power supply',
            description: 'Verify that the fryer is plugged in and the outlet has power.',
            actions: ['Yes, Working', 'No, Failed'],
            nextSteps: [2, 2] // Both lead to step 2 for demo
        },
        {
            id: 2,
            title: 'Verify thermostat',
            description: 'Check if the thermostat is set to the correct temperature.',
            actions: ['Yes, Working', 'No, Failed'],
            nextSteps: [3, 3]
        },
        {
            id: 3,
            title: 'Test heating element',
            description: 'Use a multimeter to test the heating element for continuity.',
            actions: ['Yes, Working', 'No, Failed'],
            nextSteps: [4, 4]
        },
        {
            id: 4,
            title: 'Element working?',
            description: 'Based on your test, is the heating element functioning?',
            isBranch: true,
            actions: ['Yes', 'No'],
            nextSteps: [5, 6] // Branch: Yes -> Check control board, No -> Document findings
        },
        {
            id: 5,
            title: 'Check control board',
            description: 'If element works, the issue is likely in the control board. Check for burnt components.',
            actions: ['Issue Found', 'No Issues'],
            nextSteps: [6, 6]
        },
        {
            id: 6,
            title: 'Document findings',
            description: 'Document your findings and escalate to technician if needed.',
            actions: ['Complete', 'Escalate'],
            nextSteps: [6, 6],
            isFinal: true
        }
    ];

    let currentFlowStep = 0;
    let autoAdvanceTimer = null;
    let isAutoPlaying = true; // Enable auto-play mode
    let userInteracted = false; // Track if user manually interacted

    function updateFlowDisplay() {
        const step = diagnosticFlow[currentFlowStep];
        const totalSteps = diagnosticFlow.length;
        const progressPercentValue = Math.round(((currentFlowStep + 1) / totalSteps) * 100);

        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentDisplay = document.querySelector('.progress-percent');
        const currentStepDisplay = document.querySelector('.current-step');
        const percentValue = document.querySelector('.percent-value');

        if (progressFill) progressFill.style.width = progressPercentValue + '%';
        if (progressPercentDisplay) progressPercentDisplay.textContent = progressPercentValue + '%';
        if (currentStepDisplay) currentStepDisplay.textContent = currentFlowStep + 1;
        if (percentValue) percentValue.textContent = progressPercentValue;

        // Update step display with smooth transition
        const stepTitle = document.getElementById('stepTitle');
        const stepDescription = document.getElementById('stepDescription');
        if (stepTitle) {
            stepTitle.style.opacity = '0';
            setTimeout(() => {
                stepTitle.textContent = step.title;
                stepTitle.style.opacity = '1';
            }, 100);
        }
        if (stepDescription) {
            stepDescription.style.opacity = '0';
            setTimeout(() => {
                stepDescription.textContent = step.description;
                stepDescription.style.opacity = '1';
            }, 100);
        }

        // Update confidence meter - always high (95%) to show high confidence in diagnostics
        const confidenceFill = document.getElementById('confidenceFill');
        const confidenceValue = document.getElementById('confidenceValue');
        const confidence = 95; // High confidence in diagnostic accuracy
        if (confidenceFill) {
            confidenceFill.style.width = confidence + '%';
            confidenceFill.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)'; // Green gradient
        }
        if (confidenceValue) confidenceValue.textContent = confidence;

        // Show/hide branch decision
        const branchDecision = document.getElementById('branchDecision');
        const stepActions = document.getElementById('stepActions');

        if (step.isBranch) {
            if (branchDecision) branchDecision.style.display = 'block';
            if (stepActions) stepActions.style.display = 'none';
        } else {
            if (branchDecision) branchDecision.style.display = 'none';
            if (stepActions) stepActions.style.display = 'flex';
        }

        // Update action buttons
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach((btn, index) => {
            btn.textContent = '';
            const icon = document.createElement('i');
            icon.className = index === 0 ? 'fas fa-check' : 'fas fa-times';
            const span = document.createElement('span');
            span.textContent = step.actions[index];
            btn.appendChild(icon);
            btn.appendChild(span);

            btn.onclick = () => {
                userInteracted = true;
                advanceFlow(index);
            };
        });

        // Update branch buttons
        const branchBtns = document.querySelectorAll('.branch-btn');
        branchBtns.forEach((btn, index) => {
            btn.textContent = '';
            const icon = document.createElement('i');
            icon.className = index === 0 ? 'fas fa-check-circle' : 'fas fa-times-circle';
            const span = document.createElement('span');
            span.textContent = step.actions[index];
            btn.appendChild(icon);
            btn.appendChild(span);

            btn.onclick = () => {
                userInteracted = true;
                advanceFlow(index);
            };
        });

        // Clear auto-advance timer
        if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);

        // Auto-advance logic
        if (isAutoPlaying) {
            if (currentFlowStep === diagnosticFlow.length - 1) {
                // On final step, show completion message then restart
                const diagnosticContent = document.querySelector('.diagnostic-content');
                if (diagnosticContent) {
                    setTimeout(() => {
                        // Show completion message with vivid styling
                        const completionMsg = document.createElement('div');
                        completionMsg.style.cssText = `
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 40px 30px;
                            border-radius: 16px;
                            text-align: center;
                            font-size: 24px;
                            font-weight: bold;
                            z-index: 1000;
                            animation: fadeInScale 0.6s ease-out;
                            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                            border: 2px solid rgba(255, 255, 255, 0.3);
                        `;
                        completionMsg.innerHTML = `
                            <div style="font-size: 48px; margin-bottom: 15px; animation: bounce 0.6s ease-out;">🎉</div>
                            <div style="font-size: 28px; margin-bottom: 10px;">Job Completed!</div>
                            <div style="font-size: 16px; opacity: 0.95; margin-top: 10px;">✓ All issues fixed</div>
                        `;
                        diagnosticContent.appendChild(completionMsg);

                        // Restart after 2 seconds
                        setTimeout(() => {
                            completionMsg.remove();
                            currentFlowStep = 0;
                            updateFlowDisplay();
                        }, 2000);
                    }, 1000);
                }
            } else {
                // Auto-advance to next step after 0.8 seconds
                autoAdvanceTimer = setTimeout(() => {
                    advanceFlow(0); // Auto-select first option
                }, 800);
            }
        } else {
            // Manual mode: 5-second timer for user interaction
            if (!step.isFinal) {
                autoAdvanceTimer = setTimeout(() => {
                    advanceFlow(0); // Auto-select first option
                }, 5000);
            }
        }
    }

    function advanceFlow(actionIndex) {
        const step = diagnosticFlow[currentFlowStep];
        const nextStepId = step.nextSteps[actionIndex];
        currentFlowStep = nextStepId - 1;

        // Add animation
        const diagnosticContent = document.querySelector('.diagnostic-content');
        if (diagnosticContent) {
            diagnosticContent.style.opacity = '0.7';
            diagnosticContent.style.transform = 'scale(0.98)';
            setTimeout(() => {
                updateFlowDisplay();
                diagnosticContent.style.opacity = '1';
                diagnosticContent.style.transform = 'scale(1)';
            }, 150);
        } else {
            updateFlowDisplay();
        }
    }

    // Add CSS animation for completion message
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        @keyframes bounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-20px);
            }
        }
        
        #stepTitle, #stepDescription {
            transition: opacity 0.3s ease-in-out;
        }
        
        .diagnostic-content {
            transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // Initialize flow display
    updateFlowDisplay();

    // Typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // Initialize typing effect after a delay
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 50);
        }
    }, 500);

    // Add loading states to CTA buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Join') || btn.textContent.includes('Try')) {
            btn.addEventListener('click', function (e) {
                if (this.href === '#' || this.href.endsWith('#early-access')) {
                    e.preventDefault();

                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                    this.style.pointerEvents = 'none';

                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.pointerEvents = '';

                        // Scroll to early access section
                        document.querySelector('#early-access').scrollIntoView({ behavior: 'smooth' });
                    }, 1500);
                }
            });
        }
    });

    // Add subtle animations to feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add subtle animations to step items
    document.querySelectorAll('.step-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Add subtle animations to equipment items
    document.querySelectorAll('.equipment-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    });

    console.log('QSRPro website loaded with advanced animations and branching logic');
});

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Performance optimization: debounce scroll events
const debouncedScroll = debounce(function () {
    // Scroll-based animations can be added here
}, 10);

window.addEventListener('scroll', debouncedScroll);
