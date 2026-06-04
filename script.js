/**
 * FinSoko Agent Pride Prototype
 * All simulation logic runs locally in the browser
 */

// ============================================
// PREDEFINED BORROWER DATA
// ============================================
const PRESETS = {
    grace: {
        name: 'Grace',
        occupation: 'Maize trader',
        county: 'Kakamega',
        gender: 'Female',
        loanAmount: 28000,
        monthlyIncome: 21000,
        incomeVariance: 28,
        childrenUnder5: 0,
        nextHarvest: 2,
        message: 'No money for school fees, but harvest income comes in two months.'
    },
    amina: {
        name: 'Amina',
        occupation: 'Shea butter trader',
        county: 'Busia',
        gender: 'Female',
        loanAmount: 12000,
        monthlyIncome: 18000,
        incomeVariance: 18,
        childrenUnder5: 1,
        nextHarvest: 1,
        message: 'I need stock money after market day.'
    },
    peter: {
        name: 'Peter',
        occupation: 'Formal employee',
        county: 'Nairobi',
        gender: 'Male',
        loanAmount: 60000,
        monthlyIncome: 42000,
        incomeVariance: 8,
        childrenUnder5: 2,
        nextHarvest: 0,
        message: 'I was called by a debt collector and need urgent support.'
    }
};

// ============================================
// CUSTOM CURSOR
// ============================================
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
        return;
    }

    let cursorX = 0, cursorY = 0, currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function animateCursor() {
        currentX += (cursorX - currentX) * 0.15;
        currentY += (cursorY - currentY) * 0.15;
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover state
    document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Click state
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

// ============================================
// SCROLL INDICATOR
// ============================================
function initScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        indicator.style.width = scrollPercent + '%';
    }, { passive: true });
}

// ============================================
// HEADER SCROLL BEHAVIOR
// ============================================
function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================
// SLICED TITLE HOVER EFFECT
// ============================================
function initSlicedTitles() {
    document.querySelectorAll('[data-sliced-text]').forEach(title => {
        const text = title.dataset.slicedText;
        title.innerHTML = '';

        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            span.style.transitionDelay = (i * 0.02) + 's';
            title.appendChild(span);
        });

        title.addEventListener('mouseenter', () => {
            title.querySelectorAll('.char').forEach(char => {
                const randomY = (Math.random() - 0.5) * 12;
                const randomOpacity = 0.5 + Math.random() * 0.5;
                char.style.transform = `translateY(${randomY}px)`;
                char.style.opacity = randomOpacity;
            });
        });

        title.addEventListener('mouseleave', () => {
            title.querySelectorAll('.char').forEach(char => {
                char.style.transform = 'translateY(0)';
                char.style.opacity = '1';
            });
        });
    });
}

// ============================================
// SCROLL-SCRAMBLE TEXT
// ============================================
class ScrambleText {
    constructor(element) {
        this.element = element;
        this.originalText = element.dataset.scramble || element.textContent;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        this.frame = 0;
        this.isAnimating = false;
        this.hasTriggered = false;
    }

    trigger() {
        if (this.hasTriggered) return;
        this.hasTriggered = true;
        this.isAnimating = true;
        this.frame = 0;
        this.update();
    }

    update() {
        if (!this.isAnimating) return;

        const text = this.originalText;
        let output = '';
        const progress = this.frame / 30;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                output += ' ';
                continue;
            }

            const charProgress = i / text.length;
            if (progress > charProgress + 0.1) {
                output += text[i];
            } else if (progress > charProgress) {
                output += Math.random() > 0.5 ? text[i] : this.chars[Math.floor(Math.random() * this.chars.length)];
            } else {
                output += this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        }

        this.element.textContent = output;
        this.frame++;

        if (this.frame <= 35) {
            requestAnimationFrame(() => this.update());
        } else {
            this.element.textContent = this.originalText;
            this.isAnimating = false;
        }
    }
}

function initScrambleTexts() {
    const scrambleInstances = [];
    document.querySelectorAll('.scramble-text').forEach(el => {
        // Store original text
        if (!el.dataset.scramble) {
            el.dataset.scramble = el.textContent;
        }
        scrambleInstances.push(new ScrambleText(el));
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const instance = scrambleInstances.find(inst => inst.element === entry.target);
                if (instance) instance.trigger();
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.scramble-text').forEach(el => observer.observe(el));
}

// ============================================
// PAGE LOADER
// ============================================
function initPageLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    const hideLoader = () => loader.classList.add('hidden');

    window.addEventListener('load', () => {
        setTimeout(hideLoader, 450);
    });

    // Fallback: keep the prototype usable even if remote fonts/CDNs are slow.
    setTimeout(hideLoader, 1500);
}

// ============================================
// HERO VIGNETTE MOUSE FOLLOW
// ============================================
function initHeroVignette() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        hero.style.setProperty('--vignette-x', x + '%');
        hero.style.setProperty('--vignette-y', y + '%');
    });
}

// ============================================
// PRESET BUTTON HANDLERS
// ============================================
function initPresetButtons() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetKey = btn.dataset.preset;
            const data = PRESETS[presetKey];
            if (!data) return;

            // Update active state
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Populate form
            document.getElementById('name').value = data.name;
            document.getElementById('occupation').value = data.occupation;
            document.getElementById('county').value = data.county;
            document.getElementById('gender').value = data.gender;
            document.getElementById('loanAmount').value = data.loanAmount;
            document.getElementById('monthlyIncome').value = data.monthlyIncome;
            document.getElementById('incomeVariance').value = data.incomeVariance;
            document.getElementById('childrenUnder5').value = data.childrenUnder5;
            document.getElementById('nextHarvest').value = data.nextHarvest;
            document.getElementById('message').value = data.message;
        });
    });
}

// ============================================
// AGENT SIMULATION ENGINE
// ============================================

/**
 * Scout Agent: Financial literacy coach
 */
function runScoutAgent(data) {
    const msg = (data.message || '').toLowerCase();
    let educationSMS = '';
    let trigger = '';

    if (msg.includes('school fees') || msg.includes('school') || msg.includes('no money')) {
        educationSMS = 'Plan repayment around your strongest cash-flow week and keep a small school-fee buffer before borrowing.';
        trigger = 'school-fee stress';
    } else if (msg.includes('debt collector') || msg.includes('debt')) {
        educationSMS = 'You have options. A FinS officer can review your situation without obligation. Reply STOP to pause.';
        trigger = 'urgent hardship';
    } else if (msg.includes('loan shark') || msg.includes('shark')) {
        educationSMS = 'Avoid informal lenders. A SACCO officer can discuss safe alternatives. Reply STOP to pause.';
        trigger = 'high-risk language';
    } else {
        educationSMS = 'Thank you for contacting FinSoko. A loan officer will review your request.';
        trigger = 'loan_application';
    }

    return {
        educationSMS,
        trigger,
        handoffRequired: true,
        contextPacket: {
            name: data.name,
            occupation: data.occupation,
            county: data.county,
            gender: data.gender,
            loanAmount: parseInt(data.loanAmount) || 0,
            monthlyIncome: parseInt(data.monthlyIncome) || 0,
            incomeVariance: parseInt(data.incomeVariance) || 0,
            childrenUnder5: parseInt(data.childrenUnder5) || 0,
            nextHarvest: parseInt(data.nextHarvest) || 0,
            message: data.message
        }
    };
}

/**
 * Guardian Agent: Tier-1 loan triage
 */
function runGuardianAgent(data) {
    const loanAmount = parseInt(data.loanAmount) || 0;
    const incomeVariance = parseInt(data.incomeVariance) || 0;
    const childrenUnder5 = parseInt(data.childrenUnder5) || 0;
    const nextHarvest = parseInt(data.nextHarvest) || 0;
    const msg = (data.message || '').toLowerCase();
    const monthlyIncome = parseInt(data.monthlyIncome) || 0;

    // Collect risk flags
    const riskFlags = [];

    if (loanAmount > 15000) {
        riskFlags.push({
            key: 'amount_above_guardian_authority',
            label: 'Amount above guardian authority',
            class: 'amount'
        });
    }
    if (incomeVariance > 35) {
        riskFlags.push({
            key: 'high_income_variance',
            label: 'High income variance',
            class: 'variance'
        });
    }
    if (childrenUnder5 >= 2) {
        riskFlags.push({
            key: 'children_under5_pause_point',
            label: 'Children under 5 pause point',
            class: 'children'
        });
    }
    if (nextHarvest > 3) {
        riskFlags.push({
            key: 'repayment_timing_gap',
            label: 'Repayment timing gap',
            class: 'timing'
        });
    }
    if (msg.includes('debt collector') || msg.includes('loan shark')) {
        riskFlags.push({
            key: 'urgent_hardship_language',
            label: 'Urgent hardship language',
            class: 'hardship'
        });
    }

    // Recommendation
    let recommendation;
    if (loanAmount <= 15000 && riskFlags.length === 0) {
        recommendation = 'eligible_for_low_amount_review';
    } else {
        recommendation = 'escalate_to_hunter_for_human_review';
    }

    // Affordability signal
    const monthlyRepayment = loanAmount / 12;
    const affordabilityThreshold = monthlyIncome * 0.3;
    let affordabilitySignal;
    if (affordabilityThreshold >= monthlyRepayment) {
        affordabilitySignal = 'within_affordability_range';
    } else {
        affordabilitySignal = 'stretched_repayment_capacity';
    }

    // Escalation path. Every case still ends with a human loan officer.
    const escalatedHumanReview = loanAmount > 15000 || riskFlags.length > 0 ||
        msg.includes('debt collector') || msg.includes('loan shark');
    const escalationPath = escalatedHumanReview
        ? 'Escalated human review'
        : 'Routine officer confirmation';

    // Dignity-filtered message (never uses "unreliable", "risky", "lazy", "unfit")
    let dignityMessage;
    if (escalatedHumanReview) {
        dignityMessage = 'We need a human officer to review timing and repayment fit before any decision.';
    } else {
        dignityMessage = 'Your application is ready for routine officer confirmation. A human officer will make the final decision shortly.';
    }

    return {
        recommendation,
        riskFlags,
        affordabilitySignal,
        escalatedHumanReview,
        escalationPath,
        dignityMessage,
        contextPacket: {
            name: data.name,
            occupation: data.occupation,
            county: data.county,
            loanAmount,
            monthlyIncome,
            incomeVariance,
            childrenUnder5,
            nextHarvest,
            riskFlags: riskFlags.map(f => f.key),
            recommendation,
            affordabilitySignal
        }
    };
}

/**
 * Hunter Agent: Human-in-the-loop coordinator
 */
function runHunterAgent(data, guardianOutput) {
    const occupation = (data.occupation || '').toLowerCase().trim();

    // Officer assignment
    let assignedOfficer;
    if (occupation === 'formal employee') {
        assignedOfficer = 'David - salaried borrower portfolio';
    } else {
        assignedOfficer = 'Sarah - informal trader portfolio';
    }

    // Build briefing
    const loanAmount = parseInt(data.loanAmount) || 0;
    const incomeVariance = parseInt(data.incomeVariance) || 0;
    const riskFlagNames = guardianOutput.riskFlags.map(f => f.key).join(', ');

    const briefing = `Applicant ${data.name} in ${data.county} requests KES ${loanAmount.toLocaleString()} as a ${data.occupation.toLowerCase()}. Income variance is ${incomeVariance}%. Guardian flags: ${riskFlagNames || 'none'}. Officer must make final decision and record rationale.`;

    return {
        assignedOfficer,
        briefing,
        finalDecisionStatus: 'HUMAN_REQUIRED',
        contextPacket: {
            name: data.name,
            occupation: data.occupation,
            county: data.county,
            loanAmount,
            assignedOfficer,
            riskFlags: guardianOutput.riskFlags.map(f => f.key),
            finalDecisionStatus: 'HUMAN_REQUIRED'
        }
    };
}

// ============================================
// WORKFLOW OUTPUT RENDERING
// ============================================

function renderScoutOutput(output) {
    const container = document.getElementById('scout-output');
    if (!container) return;

    container.innerHTML = `
        <div class="output-item">
            <p class="output-label">Education SMS</p>
            <p class="output-value message-box">"${output.educationSMS}"</p>
        </div>
        <div class="output-item">
            <p class="output-label">Detected Trigger</p>
            <p class="output-value"><span class="risk-tag hardship">${output.trigger}</span></p>
        </div>
        <div class="output-item">
            <p class="output-label">Handoff Required</p>
            <p class="output-value"><strong style="color: #4caf50;">Yes</strong> &rarr; Guardian Agent</p>
        </div>
        <div class="output-item">
            <p class="output-label">Minimal Context Packet</p>
            <div class="context-packet">
                <code>${JSON.stringify(output.contextPacket, null, 2)}</code>
            </div>
        </div>
    `;
}

function renderGuardianOutput(output) {
    const container = document.getElementById('guardian-output');
    if (!container) return;

    let riskFlagsHTML = '';
    if (output.riskFlags.length > 0) {
        riskFlagsHTML = output.riskFlags.map(f =>
            `<span class="risk-tag ${f.class}">${f.label}</span>`
        ).join('');
    } else {
        riskFlagsHTML = '<span class="risk-tag low-risk">No risk flags detected</span>';
    }

    const affordabilityColor = output.affordabilitySignal === 'within_affordability_range'
        ? '#4caf50' : '#fbc02d';

    container.innerHTML = `
        <div class="output-item">
            <p class="output-label">Recommendation</p>
            <p class="output-value" style="font-family: 'Courier New', monospace; color: ${output.recommendation.includes('escalate') ? '#E5926D' : '#4caf50'};">${output.recommendation}</p>
        </div>
        <div class="output-item">
            <p class="output-label">Risk Flags (${output.riskFlags.length})</p>
            <div class="risk-tags-container">${riskFlagsHTML}</div>
        </div>
        <div class="output-item">
            <p class="output-label">Affordability Signal</p>
            <p class="output-value" style="color: ${affordabilityColor};">${output.affordabilitySignal}</p>
        </div>
        <div class="output-item">
            <p class="output-label">Escalation Path</p>
            <p class="output-value"><strong style="color: ${output.escalatedHumanReview ? '#E5926D' : '#4caf50'};">${output.escalationPath}</strong></p>
        </div>
        <div class="output-item">
            <p class="output-label">Dignity-Filtered Member Message</p>
            <p class="output-value message-box">"${output.dignityMessage}"</p>
        </div>
        <div class="output-item">
            <p class="output-label">Context Packet to Hunter</p>
            <div class="context-packet">
                <code>${JSON.stringify(output.contextPacket, null, 2)}</code>
            </div>
        </div>
    `;
}

function renderHunterOutput(output) {
    const container = document.getElementById('hunter-output');
    if (!container) return;

    container.innerHTML = `
        <div class="output-item">
            <p class="output-label">Assigned Officer</p>
            <p class="output-value" style="color: #D3A13B; font-weight: 500;">${output.assignedOfficer}</p>
        </div>
        <div class="output-item">
            <p class="output-label">Human Briefing</p>
            <p class="output-value message-box">"${output.briefing}"</p>
        </div>
        <div class="output-item">
            <p class="output-label">Final Decision Status</p>
            <p class="output-value" style="font-family: 'Courier New', monospace; color: #E5926D; font-weight: 600;">${output.finalDecisionStatus}</p>
        </div>
        <div class="output-item">
            <p class="output-label">Context Packet</p>
            <div class="context-packet">
                <code>${JSON.stringify(output.contextPacket, null, 2)}</code>
            </div>
        </div>
    `;
}

// ============================================
// BURST CHIP PARTICLE EFFECT
// ============================================
class BurstChip {
    constructor() {
        this.particleCount = 50;
        this.colors = ['#D3A13B', '#ffffff', '#E5926D', '#FFF6EF', '#D3A13B'];
    }

    burst(x, y) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(container);

        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle(container, x, y, i);
        }

        setTimeout(() => container.remove(), 2500);
    }

    createParticle(container, originX, originY, index) {
        const particle = document.createElement('div');
        const size = 2 + Math.random() * 6;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        particle.style.cssText = `
            position: absolute;
            left: ${originX}px;
            top: ${originY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
        `;

        container.appendChild(particle);

        const angle = (Math.random() * Math.PI * 2);
        const distance = 80 + Math.random() * 250;
        const destX = originX + Math.cos(angle) * distance;
        const destY = originY + Math.sin(angle) * distance;

        // Use GSAP if available, otherwise use CSS animations
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();

            tl.to(particle, {
                x: destX - originX,
                y: destY - originY,
                duration: 0.6 + Math.random() * 0.4,
                ease: 'elastic.out(1, 0.5)',
            });

            tl.to(particle, {
                opacity: 0,
                scale: 0.2,
                duration: 1.5 + Math.random() * 0.5,
                ease: 'power2.out',
            }, '-=0.3');

            gsap.to(particle, {
                rotation: Math.random() * 720 - 360,
                duration: 2,
                ease: 'none',
            });
        } else {
            // Fallback without GSAP
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${destX - originX}px, ${destY - originY}px) scale(0.2)`, opacity: 0 }
            ], {
                duration: 1500 + Math.random() * 500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
        }
    }
}

// ============================================
// FORM SUBMISSION & AGENT WORKFLOW
// ============================================
function initAgentDemo() {
    const form = document.getElementById('demo-form');
    const btn = document.getElementById('run-demo-btn');
    if (!form || !btn) return;

    const burstChip = new BurstChip();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            occupation: document.getElementById('occupation').value.trim(),
            county: document.getElementById('county').value.trim(),
            gender: document.getElementById('gender').value,
            loanAmount: document.getElementById('loanAmount').value,
            monthlyIncome: document.getElementById('monthlyIncome').value,
            incomeVariance: document.getElementById('incomeVariance').value,
            childrenUnder5: document.getElementById('childrenUnder5').value,
            nextHarvest: document.getElementById('nextHarvest').value,
            message: document.getElementById('message').value.trim()
        };

        // Validate required fields
        if (!formData.name || !formData.loanAmount || !formData.message) {
            alert('Please fill in at least Name, Loan Amount, and Message.');
            return;
        }

        // Disable button during processing
        btn.disabled = true;
        btn.querySelector('.btn-run-demo-text').textContent = 'Processing...';

        // Burst chip effect on button
        const rect = btn.getBoundingClientRect();
        burstChip.burst(rect.left + rect.width / 2, rect.top + rect.height / 2);

        // Hide placeholder, show output
        const placeholder = document.getElementById('workflow-placeholder');
        const output = document.getElementById('workflow-output');
        if (placeholder) placeholder.style.display = 'none';
        if (output) output.style.display = 'block';

        // Reset step visibility
        ['step-scout', 'step-guardian', 'step-hunter', 'final-decision'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.opacity = '0';
        });

        // Clear previous outputs
        document.getElementById('scout-output').innerHTML = '<p style="color: rgba(255,255,255,0.3); font-style: italic;">Processing...</p>';
        document.getElementById('guardian-output').innerHTML = '<p style="color: rgba(255,255,255,0.3); font-style: italic;">Waiting for Scout handoff...</p>';
        document.getElementById('hunter-output').innerHTML = '<p style="color: rgba(255,255,255,0.3); font-style: italic;">Waiting for Guardian handoff...</p>';

        // Scroll to workflow
        setTimeout(() => {
            document.getElementById('workflow').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);

        // Step 1: Scout Agent (after 600ms)
        setTimeout(() => {
            const scoutOutput = runScoutAgent(formData);
            renderScoutOutput(scoutOutput);

            const stepScout = document.getElementById('step-scout');
            if (stepScout) {
                stepScout.style.animation = 'none';
                stepScout.offsetHeight; // trigger reflow
                stepScout.style.animation = 'step-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            }

            // Step 2: Guardian Agent (after 1400ms from start)
            setTimeout(() => {
                const guardianOutput = runGuardianAgent(formData);
                renderGuardianOutput(guardianOutput);

                const stepGuardian = document.getElementById('step-guardian');
                if (stepGuardian) {
                    stepGuardian.style.animation = 'none';
                    stepGuardian.offsetHeight;
                    stepGuardian.style.animation = 'step-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                }

                // Step 3: Hunter Agent (after 2200ms from start)
                setTimeout(() => {
                    const hunterOutput = runHunterAgent(formData, guardianOutput);
                    renderHunterOutput(hunterOutput);

                    const stepHunter = document.getElementById('step-hunter');
                    if (stepHunter) {
                        stepHunter.style.animation = 'none';
                        stepHunter.offsetHeight;
                        stepHunter.style.animation = 'step-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    }

                    // Final Decision (after 3000ms from start)
                    setTimeout(() => {
                        const finalDecision = document.getElementById('final-decision');
                        if (finalDecision) {
                            finalDecision.style.animation = 'none';
                            finalDecision.offsetHeight;
                            finalDecision.style.animation = 'step-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                        }

                        // Re-enable button
                        btn.disabled = false;
                        btn.querySelector('.btn-run-demo-text').textContent = 'Run Agent Demo';
                    }, 800);

                }, 800);
            }, 800);
        }, 600);
    });
}

// Add step-enter keyframe
const stepEnterStyle = document.createElement('style');
stepEnterStyle.textContent = `
    @keyframes step-enter {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(stepEnterStyle);

// ============================================
// GSAP ANIMATIONS (if available)
// ============================================
function initGsapAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Safety items entrance
    gsap.from('.safety-item', {
        scrollTrigger: {
            trigger: '#safety',
            start: 'top 75%',
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
    });

    // Metric cards entrance (if not already animated)
    gsap.from('.metric-card', {
        scrollTrigger: {
            trigger: '.metrics-row',
            start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 1.2,
    });
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    // Keep the prototype close to a normal web app experience for evaluators.
    initScrollIndicator();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initSlicedTitles();
    initHeroVignette();
    initPresetButtons();
    initAgentDemo();
    initGsapAnimations();
});
