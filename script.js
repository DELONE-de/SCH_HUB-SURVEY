// ============================================
// MODERN STUDENT SURVEY - JAVASCRIPT
// Mobile-First, Lightweight, Optimized
// ============================================

// Configuration
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx1JaLaAL6aY38oA2hfXuVtDYGOyrWO8bX79gupkdTYkGDOIfV7yvaVZ9onPKG6_M0wjg/exec',
    STORAGE_KEY: 'surveyProgress',
    AUTO_SAVE_INTERVAL: 5000, // 5 seconds
};

// Survey Data Structure
const surveyData = {
    // Section A - Student Profile
    level: '',
    faculty: '',
    department: '',
    accommodation: '',
    primaryDevice: '',
    appUsageFrequency: '',
    
    // Section B - Academic Pain Points
    academicChallenges: [],
    missedUpdatesFrequency: '',
    timetableStress: 0,
    missedItems: [],
    navigationDifficulty: 0,
    trackingMethods: [],
    
    // Section C - Feature Validation
    featureRatings: {},
    topThreeFeatures: [],
    mostNeededFeature: '',
    
    // Section D - AI Features
    aiUsage: '',
    aiToolsUsed: [],
    aiPurposes: [],
    desiredAiFeature: '',
    regularAiFeatures: [],
    weeklyAiFeature: '',
    aiFrustrations: [],
    
    // Section E - Payment & Premium
    willingToPay: '',
    valuableFeatures: [],
    priceRange: '',
    paymentModel: '',
    
    // Section F - Open Feedback
    biggestFrustration: '',
    dailyUseFeature: '',
    wishExisted: '',
    additionalSuggestions: '',
    
    // Early Access
    earlyAccess: false,
    name: '',
    email: '',
    whatsapp: '',
    
    // Metadata
    timestamp: null,
    completionTime: null,
};

// Survey State
let currentSectionIndex = 0;
let startTime = null;
let autoSaveTimer = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const hasSaved = loadProgress();
    setupAutoSave();
    renderSurvey();
    if (hasSaved) {
        startTime = Date.now();
        showScreen('survey');
        renderSection();
        updateProgress();
    }
});

// ============================================
// THEME MANAGEMENT
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
}

document.getElementById('themeToggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ============================================
// SURVEY NAVIGATION
// ============================================

function startSurvey() {
    startTime = Date.now();
    showScreen('survey');
    updateProgress();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    setTimeout(() => {
        document.getElementById(screenId)?.classList.add('active');
    }, 50);
}

function nextSection() {
    if (!validateCurrentSection()) {
        return;
    }
    
    saveCurrentSection();
    
    if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        renderSection();
        updateProgress();
        scrollToTop();
    } else {
        submitSurvey();
    }
}

function prevSection() {
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        renderSection();
        updateProgress();
        scrollToTop();
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// PROGRESS TRACKING
// ============================================

function updateProgress() {
    const totalSections = sections.length;
    const progress = ((currentSectionIndex + 1) / totalSections) * 100;
    
    document.getElementById('currentSection').textContent = currentSectionIndex + 1;
    document.getElementById('progressPercent').textContent = `${Math.round(progress)}%`;
    document.getElementById('progressFill').style.width = `${progress}%`;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentSectionIndex === 0;
    nextBtn.textContent = currentSectionIndex === totalSections - 1 ? 'Submit' : 'Next';
    
    if (currentSectionIndex === totalSections - 1) {
        nextBtn.innerHTML = `
            Submit
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
        `;
    }
}

// ============================================
// AUTO-SAVE FUNCTIONALITY
// ============================================

function setupAutoSave() {
    autoSaveTimer = setInterval(() => {
        saveProgress();
    }, CONFIG.AUTO_SAVE_INTERVAL);
}

function saveProgress() {
    saveCurrentSection();
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
        data: surveyData,
        sectionIndex: currentSectionIndex,
        timestamp: Date.now(),
    }));
}

function loadProgress() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
        try {
            const { data, sectionIndex } = JSON.parse(saved);
            Object.assign(surveyData, data);
            currentSectionIndex = sectionIndex || 0;
            return true;
        } catch (e) {
            console.error('Failed to load progress:', e);
        }
    }
    return false;
}

function clearProgress() {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
    }
}

// ============================================
// SURVEY SECTIONS DEFINITION
// ============================================

const sections = [
    // SECTION A - Student Profile
    {
        id: 'profile',
        title: 'Student Profile',
        description: 'Tell us a bit about yourself',
        questions: [
            {
                id: 'level',
                label: 'What is your level?',
                type: 'radio',
                required: true,
                options: ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level+', 'Postgraduate']
            },
            {
                id: 'faculty',
                label: 'Which faculty/school are you in?',
                type: 'text',
                required: true,
                placeholder: 'e.g., Faculty of Science'
            },
            {
                id: 'department',
                label: 'Which department are you in?',
                type: 'text',
                required: true,
                placeholder: 'e.g., Computer Science'
            },
            {
                id: 'accommodation',
                label: 'Where do you stay?',
                type: 'radio',
                required: true,
                options: ['On-campus', 'Off-campus']
            },
            {
                id: 'primaryDevice',
                label: 'What device do you mainly use for school-related activities?',
                type: 'radio',
                required: true,
                options: ['Android phone', 'iPhone', 'Laptop', 'Tablet']
            },
            {
                id: 'appUsageFrequency',
                label: 'How often do you use student-related apps/platforms?',
                type: 'radio',
                required: true,
                options: ['Daily', 'Weekly', 'Occasionally', 'Rarely', 'Never']
            }
        ]
    },
    
    // SECTION B - Academic Pain Points
    {
        id: 'painPoints',
        title: 'Academic Pain Points',
        description: 'Help us understand your challenges',
        questions: [
            {
                id: 'academicChallenges',
                label: 'Which academic challenges affect you the MOST?',
                type: 'checkbox',
                required: true,
                maxSelect: 3,
                hint: 'Select up to 3',
                options: [
                    'Forgetting assignment deadlines',
                    'Missing tests/exams',
                    'Managing timetable',
                    'Finding lecture venues',
                    'Accessing study materials',
                    'Tracking GPA/CGPA',
                    'Exam preparation',
                    'Missing school/department announcements',
                    'Course registration stress',
                    'Communication with classmates',
                    'Accessing past questions',
                    'Understanding difficult topics',
                    'Organizing study time'
                ]
            },
            {
                id: 'missedUpdatesFrequency',
                label: 'How often do you miss important academic updates?',
                type: 'radio',
                required: true,
                options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
            },
            {
                id: 'timetableStress',
                label: 'How stressful is managing your timetable?',
                type: 'scale',
                required: true,
                min: 1,
                max: 5,
                minLabel: 'Not stressful',
                maxLabel: 'Extremely stressful'
            },
            {
                id: 'missedItems',
                label: 'Have you ever missed any of the following?',
                type: 'checkbox',
                required: false,
                options: [
                    'Assignment deadline',
                    'Test',
                    'Exam',
                    'Lecture',
                    'School announcement',
                    'Department update',
                    'None'
                ]
            },
            {
                id: 'navigationDifficulty',
                label: 'How difficult is it to find lecture halls or buildings on campus?',
                type: 'scale',
                required: true,
                min: 1,
                max: 5,
                minLabel: 'Very easy',
                maxLabel: 'Very difficult'
            },
            {
                id: 'trackingMethods',
                label: 'How do you currently track academic activities?',
                type: 'checkbox',
                required: false,
                options: [
                    'Memory',
                    'Notes app',
                    'WhatsApp groups',
                    'Physical notebook',
                    'Calendar app',
                    'Timetable photo/screenshot',
                    'Friends/classmates',
                    'School portal',
                    "I don't track properly"
                ]
            }
        ]
    },
    
    // SECTION C - Feature Validation
    {
        id: 'features',
        title: 'Feature Validation',
        description: 'Rate features that would help you',
        questions: [
            {
                id: 'featureRatings',
                label: 'Rate how useful these features would be',
                type: 'feature-rating',
                required: true,
                features: [
                    'Smart timetable',
                    'Assignment reminders',
                    'Exam reminders',
                    'Department announcements',
                    'Campus map/navigation',
                    'GPA/CGPA tracker',
                    'Course materials hub',
                    'Past question archive',
                    'Hostel finder',
                    'Marketplace for students',
                    'Transport tracking',
                    'Lost & found system',
                    'Study groups',
                    'Event discovery',
                    'Emergency contacts',
                    'Lecturer directory'
                ]
            },
            {
                id: 'topThreeFeatures',
                label: 'Which THREE features would make you use the app regularly?',
                type: 'checkbox',
                required: true,
                maxSelect: 3,
                hint: 'Select exactly 3',
                options: [
                    'Smart timetable',
                    'Assignment reminders',
                    'Exam reminders',
                    'Campus map',
                    'GPA tracker',
                    'Course materials hub',
                    'Past questions',
                    'Department announcements',
                    'Study groups',
                    'Marketplace',
                    'Hostel finder',
                    'Transport tracking',
                    'Event updates',
                    'Lecturer directory',
                    'Lost & found'
                ]
            },
            {
                id: 'mostNeededFeature',
                label: 'Which feature do you think students in your school need the MOST?',
                type: 'textarea',
                required: true,
                placeholder: 'Describe the most needed feature...'
            }
        ]
    },
    
    // SECTION D - AI Features
    {
        id: 'ai',
        title: 'AI Features & Study Tools',
        description: 'Tell us about AI in your studies',
        questions: [
            {
                id: 'aiUsage',
                label: 'Do you currently use AI tools for academics?',
                type: 'radio',
                required: true,
                options: ['Yes, frequently', 'Sometimes', 'Rarely', 'Never']
            },
            {
                id: 'aiToolsUsed',
                label: 'Which AI tools have you used before?',
                type: 'checkbox',
                required: false,
                options: [
                    'ChatGPT',
                    'Gemini',
                    'Microsoft Copilot',
                    'Grammarly',
                    'QuillBot',
                    'AI math solvers',
                    'AI note summarizers',
                    'Other',
                    'None'
                ]
            },
            {
                id: 'aiPurposes',
                label: 'What do you mainly use AI for academically?',
                type: 'checkbox',
                required: false,
                options: [
                    'Solving assignments',
                    'Summarizing notes',
                    'Studying for exams',
                    'Writing reports',
                    'Research',
                    'Explaining difficult topics',
                    'Brainstorming ideas',
                    'Organizing study plans',
                    "I don't use AI"
                ]
            },
            {
                id: 'desiredAiFeature',
                label: 'What AI feature would you MOST want inside a campus app?',
                type: 'textarea',
                required: false,
                placeholder: 'Describe your ideal AI feature...'
            },
            {
                id: 'regularAiFeatures',
                label: 'Which AI-powered features would you actually use regularly?',
                type: 'checkbox',
                required: false,
                options: [
                    'AI study assistant',
                    'AI timetable planner',
                    'AI note summarizer',
                    'AI exam prep assistant',
                    'AI quiz generator',
                    'AI voice-to-notes',
                    'AI assignment planner',
                    'AI GPA improvement suggestions',
                    'AI scholarship/internship finder',
                    'AI campus navigation assistant',
                    'AI tutoring assistant',
                    'None'
                ]
            },
            {
                id: 'weeklyAiFeature',
                label: 'Which AI feature would become part of your WEEKLY student routine?',
                type: 'textarea',
                required: false,
                placeholder: 'Describe a feature you would use weekly...'
            },
            {
                id: 'aiFrustrations',
                label: 'What frustrates you MOST about existing AI tools?',
                type: 'checkbox',
                required: false,
                options: [
                    'Too expensive',
                    'Wrong answers',
                    'Too generic',
                    'Hard to use',
                    'Too much internet/data usage',
                    'Not student-focused',
                    'Requires constant internet',
                    'Privacy concerns',
                    "I don't use AI tools"
                ]
            }
        ]
    },
    
    // SECTION E - Payment & Premium
    {
        id: 'payment',
        title: 'Payment & Premium Features',
        description: 'Your thoughts on pricing',
        questions: [
            {
                id: 'willingToPay',
                label: 'Would you pay a small fee for features that genuinely improve your academic life?',
                type: 'radio',
                required: true,
                options: ['Yes', 'No', 'Maybe']
            },
            {
                id: 'valuableFeatures',
                label: 'Which features would be valuable enough for students to pay for?',
                type: 'checkbox',
                required: false,
                options: [
                    'AI study assistant',
                    'Past question vault',
                    'Smart reminders',
                    'AI exam prep',
                    'AI tutoring assistant',
                    'Internship/job alerts',
                    'Resume/CV builder',
                    'GPA analytics',
                    'Premium study planner',
                    'Cloud backup/storage',
                    'None'
                ]
            },
            {
                id: 'priceRange',
                label: 'What monthly price feels reasonable for premium student features?',
                type: 'radio',
                required: true,
                options: ['Free only', '₦200–₦500', '₦500–₦1000', '₦1000+', 'Depends on value']
            },
            {
                id: 'paymentModel',
                label: 'Which payment model would you prefer?',
                type: 'radio',
                required: true,
                options: [
                    'Completely free',
                    'Free with ads',
                    'One-time payment',
                    'Monthly subscription',
                    'Freemium',
                    'Pay per feature'
                ]
            }
        ]
    },
    
    // SECTION F - Open Feedback & Early Access
    {
        id: 'feedback',
        title: 'Your Thoughts',
        description: 'Share your honest feedback',
        questions: [
            {
                id: 'biggestFrustration',
                label: 'What is the MOST frustrating part of student life in your school?',
                type: 'textarea',
                required: true,
                placeholder: 'Share your biggest frustration...'
            },
            {
                id: 'dailyUseFeature',
                label: 'What feature would make you use this app every day?',
                type: 'textarea',
                required: true,
                placeholder: 'Describe a must-have daily feature...'
            },
            {
                id: 'wishExisted',
                label: 'What student app or tool do you wish existed?',
                type: 'textarea',
                required: false,
                placeholder: 'Dream app idea...'
            },
            {
                id: 'additionalSuggestions',
                label: 'Any additional suggestions or ideas?',
                type: 'textarea',
                required: false,
                placeholder: 'Any other thoughts...'
            },
            {
                id: 'earlyAccess',
                label: 'Would you like early access to the app when it launches?',
                type: 'early-access',
                required: false
            }
        ]
    }
];

// ============================================
// RENDER SURVEY
// ============================================

function renderSurvey() {
    const container = document.getElementById('surveyContent');
    if (!container) return;
    
    container.innerHTML = sections.map((section, index) => `
        <div class="section ${index === 0 ? 'active' : ''}" data-section="${section.id}">
            <h2 class="section-title">${section.title}</h2>
            <p class="section-description">${section.description}</p>
            ${section.questions.map(q => renderQuestion(q)).join('')}
        </div>
    `).join('');
    
    attachEventListeners();
}

function renderSection() {
    document.querySelectorAll('.section').forEach((section, index) => {
        section.classList.toggle('active', index === currentSectionIndex);
    });
}

function renderQuestion(question) {
    const required = question.required ? '<span class="question-required">*</span>' : '';
    const hint = question.hint ? `<span class="question-hint">${question.hint}</span>` : '';
    
    let inputHTML = '';
    
    switch (question.type) {
        case 'text':
            inputHTML = `
                <input 
                    type="text" 
                    class="input-text" 
                    id="${question.id}"
                    placeholder="${question.placeholder || ''}"
                    ${question.required ? 'required' : ''}
                    value="${surveyData[question.id] || ''}"
                >
            `;
            break;
            
        case 'textarea':
            inputHTML = `
                <textarea 
                    class="input-text" 
                    id="${question.id}"
                    placeholder="${question.placeholder || ''}"
                    ${question.required ? 'required' : ''}
                >${surveyData[question.id] || ''}</textarea>
            `;
            break;
            
        case 'radio':
            inputHTML = `
                <div class="radio-group">
                    ${question.options.map((option, i) => `
                        <label class="radio-option">
                            <input 
                                type="radio" 
                                name="${question.id}" 
                                value="${option}"
                                ${surveyData[question.id] === option ? 'checked' : ''}
                            >
                            <span class="radio-custom"></span>
                            <span class="radio-label">${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'checkbox':
            inputHTML = `
                <div class="checkbox-group" data-max-select="${question.maxSelect || ''}">
                    ${question.options.map((option, i) => `
                        <label class="checkbox-option">
                            <input 
                                type="checkbox" 
                                name="${question.id}" 
                                value="${option}"
                                ${(surveyData[question.id] || []).includes(option) ? 'checked' : ''}
                            >
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'scale':
            const ratings = [];
            for (let i = question.min; i <= question.max; i++) {
                ratings.push(i);
            }
            inputHTML = `
                <div class="rating-scale">
                    ${ratings.map(num => `
                        <label class="rating-option">
                            <input 
                                type="radio" 
                                name="${question.id}" 
                                value="${num}"
                                ${surveyData[question.id] == num ? 'checked' : ''}
                            >
                            <span class="rating-button">${num}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="rating-labels">
                    <span>${question.minLabel}</span>
                    <span>${question.maxLabel}</span>
                </div>
            `;
            break;
            
        case 'feature-rating':
            inputHTML = `
                <div class="feature-rating-grid">
                    ${question.features.map(feature => {
                        const featureId = feature.replace(/[^a-zA-Z0-9]/g, '');
                        const currentRating = (surveyData.featureRatings || {})[feature];
                        return `
                            <div class="feature-rating-item">
                                <div class="feature-name">${feature}</div>
                                <div class="feature-rating-scale">
                                    ${[1, 2, 3, 4, 5].map(num => `
                                        <label class="rating-option">
                                            <input 
                                                type="radio" 
                                                name="feature-${featureId}" 
                                                value="${num}"
                                                data-feature="${feature}"
                                                ${currentRating == num ? 'checked' : ''}
                                            >
                                            <span class="rating-button">${num}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            break;
            
        case 'early-access':
            const earlyAccessChecked = surveyData.earlyAccess ? 'checked' : '';
            inputHTML = `
                <div class="checkbox-group">
                    <label class="checkbox-option">
                        <input 
                            type="checkbox" 
                            id="earlyAccess"
                            ${earlyAccessChecked}
                        >
                        <span class="checkbox-custom"></span>
                        <span class="checkbox-label">Yes, I want early access!</span>
                    </label>
                </div>
                <div id="earlyAccessFields" style="margin-top: var(--spacing-lg); ${surveyData.earlyAccess ? '' : 'display: none;'}">
                    <div style="margin-bottom: var(--spacing-md);">
                        <input 
                            type="text" 
                            class="input-text" 
                            id="name"
                            placeholder="Your Name"
                            value="${surveyData.name || ''}"
                        >
                    </div>
                    <div style="margin-bottom: var(--spacing-md);">
                        <input 
                            type="email" 
                            class="input-text" 
                            id="email"
                            placeholder="Your Email"
                            value="${surveyData.email || ''}"
                        >
                    </div>
                    <div>
                        <input 
                            type="tel" 
                            class="input-text" 
                            id="whatsapp"
                            placeholder="WhatsApp Number"
                            value="${surveyData.whatsapp || ''}"
                        >
                    </div>
                </div>
            `;
            break;
    }
    
    return `
        <div class="question-card" data-question="${question.id}">
            <label class="question-label">
                ${question.label}${required}${hint}
            </label>
            ${inputHTML}
            <div class="error-message" id="error-${question.id}"></div>
        </div>
    `;
}

// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
    // Checkbox max selection limit
    document.querySelectorAll('.checkbox-group[data-max-select]').forEach(group => {
        const maxSelect = parseInt(group.dataset.maxSelect);
        if (!maxSelect) return;
        
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const checked = group.querySelectorAll('input[type="checkbox"]:checked');
                if (checked.length > maxSelect) {
                    cb.checked = false;
                    showToast(`You can only select up to ${maxSelect} options`);
                }
            });
        });
    });
    
    // Early access toggle
    const earlyAccessCheckbox = document.getElementById('earlyAccess');
    if (earlyAccessCheckbox) {
        earlyAccessCheckbox.addEventListener('change', (e) => {
            const fields = document.getElementById('earlyAccessFields');
            if (fields) {
                fields.style.display = e.target.checked ? 'block' : 'none';
            }
        });
    }
}

// ============================================
// VALIDATION
// ============================================

function validateCurrentSection() {
    const currentSection = sections[currentSectionIndex];
    const sectionElement = document.querySelector(`.section[data-section="${currentSection.id}"]`);
    let isValid = true;
    
    // Clear previous errors
    sectionElement.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('active');
    });
    sectionElement.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('error');
    });
    
    currentSection.questions.forEach(question => {
        if (!question.required) return;
        
        const card = sectionElement.querySelector(`.question-card[data-question="${question.id}"]`);
        const errorElement = document.getElementById(`error-${question.id}`);
        let hasValue = false;
        
        switch (question.type) {
            case 'text':
            case 'textarea':
                const textInput = document.getElementById(question.id);
                hasValue = textInput && textInput.value.trim() !== '';
                break;
                
            case 'radio':
            case 'scale':
                const radioInputs = sectionElement.querySelectorAll(`input[name="${question.id}"]:checked`);
                hasValue = radioInputs.length > 0;
                break;
                
            case 'checkbox':
                const checkboxInputs = sectionElement.querySelectorAll(`input[name="${question.id}"]:checked`);
                hasValue = checkboxInputs.length > 0;
                if (question.maxSelect && checkboxInputs.length !== question.maxSelect) {
                    hasValue = false;
                    if (errorElement) {
                        errorElement.textContent = `Please select exactly ${question.maxSelect} options`;
                    }
                }
                break;
                
            case 'feature-rating':
                const featureRadios = sectionElement.querySelectorAll('input[type="radio"][data-feature]:checked');
                hasValue = featureRadios.length === question.features.length;
                if (!hasValue && errorElement) {
                    errorElement.textContent = 'Please rate all features';
                }
                break;
        }
        
        if (!hasValue) {
            isValid = false;
            if (card) card.classList.add('error');
            if (errorElement && !errorElement.textContent) {
                errorElement.textContent = 'This field is required';
            }
            if (errorElement) errorElement.classList.add('active');
        }
    });
    
    if (!isValid) {
        // Scroll to first error
        const firstError = sectionElement.querySelector('.question-card.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

// ============================================
// SAVE SECTION DATA
// ============================================

function saveCurrentSection() {
    const currentSection = sections[currentSectionIndex];
    const sectionElement = document.querySelector(`.section[data-section="${currentSection.id}"]`);
    
    currentSection.questions.forEach(question => {
        switch (question.type) {
            case 'text':
            case 'textarea':
                const textInput = document.getElementById(question.id);
                if (textInput) {
                    surveyData[question.id] = textInput.value.trim();
                }
                break;
                
            case 'radio':
            case 'scale':
                const radioInput = sectionElement.querySelector(`input[name="${question.id}"]:checked`);
                if (radioInput) {
                    surveyData[question.id] = radioInput.value;
                }
                break;
                
            case 'checkbox':
                const checkboxInputs = sectionElement.querySelectorAll(`input[name="${question.id}"]:checked`);
                surveyData[question.id] = Array.from(checkboxInputs).map(cb => cb.value);
                break;
                
            case 'feature-rating':
                const featureRatings = {};
                const featureRadios = sectionElement.querySelectorAll('input[type="radio"][data-feature]:checked');
                featureRadios.forEach(radio => {
                    const feature = radio.dataset.feature;
                    featureRatings[feature] = parseInt(radio.value);
                });
                surveyData.featureRatings = featureRatings;
                break;
                
            case 'early-access':
                const earlyAccessCb = document.getElementById('earlyAccess');
                surveyData.earlyAccess = earlyAccessCb ? earlyAccessCb.checked : false;
                
                if (surveyData.earlyAccess) {
                    const nameInput = document.getElementById('name');
                    const emailInput = document.getElementById('email');
                    const whatsappInput = document.getElementById('whatsapp');
                    
                    surveyData.name = nameInput ? nameInput.value.trim() : '';
                    surveyData.email = emailInput ? emailInput.value.trim() : '';
                    surveyData.whatsapp = whatsappInput ? whatsappInput.value.trim() : '';
                }
                break;
        }
    });
}

// ============================================
// SUBMIT SURVEY
// ============================================

async function submitSurvey() {
    surveyData.timestamp = new Date().toISOString();
    surveyData.completionTime = Math.round((Date.now() - startTime) / 1000);

    showLoading(true);
    console.log('[Survey] Submitting to:', CONFIG.API_URL);
    console.log('[Survey] Payload:', JSON.stringify(surveyData));

    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(surveyData));

        console.log('[Survey] Sending fetch request...');
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });

        // no-cors returns opaque response — we can't read it, but no error = request was sent
        console.log('[Survey] Fetch completed. Response type:', response.type, '| Status:', response.status);

        clearProgress();
        showLoading(false);
        showScreen('success');
        animateCounter('responseCount', 247, 2000);

    } catch (error) {
        console.error('[Survey] Fetch failed:', error.name, '-', error.message);
        showLoading(false);
        showToast(`Submission failed: ${error.message}`);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.toggle('active', show);
    }
}

function showToast(message) {
    // Simple toast notification (you can enhance this)
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--text-primary);
        color: var(--bg-primary);
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function animateCounter(elementId, target, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Add toast animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(style);
