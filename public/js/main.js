/* ====================================
   MAIN JAVASCRIPT FILE
   Core Application Functionality
   ==================================== */

// Global variables
let currentStep = 1;
const totalSteps = 6;
let formData = {};
let autoSaveTimer = null;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize form auto-save
    initializeAutoSave();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Load saved form data
    loadFormData();
    
    // Initialize tooltips and help text
    initializeTooltips();
    
    // Initialize mobile navigation
    initializeMobileNav();
    
    // Initialize weight unit sync
    initializeUnitSync();
    
    // Hide loading overlay after initialization
    setTimeout(() => {
        hideLoadingOverlay();
    }, 1500);
    
    console.log('INTERNITY DIET PLANNER initialized successfully');
}

// Start Plan Creation
function startPlanCreation() {
    const heroSection = document.getElementById('home');
    const formContainer = document.getElementById('formContainer');
    
    // Smooth scroll to form
    heroSection.style.display = 'none';
    formContainer.classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = document.querySelector('#fullName');
        if (firstInput) {
            firstInput.focus();
        }
    }, 500);
    
    // Track event
    trackEvent('form_started', { step: 1 });
}

// Navigation Functions
function initializeNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', goToPreviousStep);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextStep);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', handleFormSubmit);
    }
    
    // Initialize progress display
    updateProgressDisplay();
}

function goToNextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            updateProgressDisplay();
            updateNavigationButtons();
            trackEvent('step_completed', { step: currentStep - 1 });
        }
    }
}

function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgressDisplay();
        updateNavigationButtons();
    }
}

function showStep(step) {
    // Hide all steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update progress steps
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    progressSteps.forEach((stepEl, index) => {
        if (index + 1 <= step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
    
    // Smooth scroll to top of form
    const formWrapper = document.querySelector('.form-wrapper');
    if (formWrapper) {
        formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateProgressDisplay() {
    const progressFill = document.getElementById('progressFill');
    const percentage = (currentStep / totalSteps) * 100;
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show/hide previous button
    if (prevBtn) {
        prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    }
    
    // Show/hide next and submit buttons
    if (currentStep === totalSteps) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'inline-flex';
    } else {
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        if (submitBtn) submitBtn.style.display = 'none';
    }
}

// Auto-save Functionality
function initializeAutoSave() {
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('change', handleFormChange);
        input.addEventListener('input', debounce(handleFormChange, 1000));
    });
}

function handleFormChange(event) {
    const field = event.target;
    const fieldName = field.name;
    const fieldValue = getFieldValue(field);
    
    // Update form data
    formData[fieldName] = fieldValue;
    
    // Save to localStorage
    saveFormData();
    
    // Show auto-save indicator
    showAutoSaveIndicator();
    
    // Clear validation errors
    clearFieldError(field);
}

function getFieldValue(field) {
    if (field.type === 'checkbox') {
        const checkedBoxes = document.querySelectorAll(`input[name="${field.name}"]:checked`);
        return Array.from(checkedBoxes).map(cb => cb.value);
    } else if (field.type === 'radio') {
        const checkedRadio = document.querySelector(`input[name="${field.name}"]:checked`);
        return checkedRadio ? checkedRadio.value : '';
    } else {
        return field.value;
    }
}

function saveFormData() {
    try {
        localStorage.setItem('dietPlanFormData', JSON.stringify(formData));
        localStorage.setItem('dietPlanCurrentStep', currentStep.toString());
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

function loadFormData() {
    try {
        const savedData = localStorage.getItem('dietPlanFormData');
        const savedStep = localStorage.getItem('dietPlanCurrentStep');
        
        if (savedData) {
            formData = JSON.parse(savedData);
            populateForm(formData);
        }
        
        if (savedStep) {
            currentStep = parseInt(savedStep);
            showStep(currentStep);
            updateProgressDisplay();
            updateNavigationButtons();
        }
    } catch (error) {
        console.error('Error loading form data:', error);
    }
}

function populateForm(data) {
    Object.keys(data).forEach(fieldName => {
        const fields = document.querySelectorAll(`[name="${fieldName}"]`);
        
        fields.forEach(field => {
            if (field.type === 'checkbox') {
                if (Array.isArray(data[fieldName])) {
                    field.checked = data[fieldName].includes(field.value);
                }
            } else if (field.type === 'radio') {
                field.checked = field.value === data[fieldName];
            } else {
                field.value = data[fieldName] || '';
            }
        });
    });
}

function clearFormData() {
    localStorage.removeItem('dietPlanFormData');
    localStorage.removeItem('dietPlanCurrentStep');
    formData = {};
    currentStep = 1;
}

function showAutoSaveIndicator() {
    let indicator = document.querySelector('.auto-save-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'auto-save-indicator';
        document.body.appendChild(indicator);
    }
    
    indicator.textContent = 'Saving...';
    indicator.classList.add('show', 'saving');
    
    setTimeout(() => {
        indicator.textContent = 'Saved';
        indicator.classList.remove('saving');
        indicator.classList.add('saved');
        
        setTimeout(() => {
            indicator.classList.remove('show', 'saved');
        }, 2000);
    }, 1000);
}

// Unit Synchronization
function initializeUnitSync() {
    const weightUnit = document.getElementById('weightUnit');
    const targetWeightUnit = document.getElementById('targetWeightUnit');
    
    if (weightUnit && targetWeightUnit) {
        weightUnit.addEventListener('change', function() {
            targetWeightUnit.textContent = this.value;
        });
    }
}

// Mobile Navigation
function initializeMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });
}

// Tooltips and Help Text
function initializeTooltips() {
    // Add help icons to complex fields
    const complexFields = [
        { field: 'bodyFat', help: 'Body fat percentage can be measured using calipers, bioelectrical impedance, or DEXA scan' },
        { field: 'activityLevel', help: 'Choose the level that best describes your average weekly activity' },
        { field: 'waterIntake', help: 'Recommended daily water intake is typically 2-3 liters for adults' }
    ];
    
    complexFields.forEach(item => {
        const field = document.getElementById(item.field);
        if (field) {
            addHelpTooltip(field, item.help);
        }
    });
}

function addHelpTooltip(field, helpText) {
    const helpIcon = document.createElement('i');
    helpIcon.className = 'fas fa-question-circle help-icon';
    helpIcon.title = helpText;
    
    const fieldGroup = field.closest('.form-group');
    if (fieldGroup) {
        const label = fieldGroup.querySelector('label');
        if (label) {
            label.appendChild(helpIcon);
        }
    }
}

// Form Submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    // Show loading overlay
    showLoadingOverlay('Generating your personalized diet plan...');
    
    try {
        // Collect all form data
        const completeFormData = collectFormData();
        
        // Submit to backend
        const response = await submitDietPlan(completeFormData);
        
        if (response.success) {
            // Show success section
            showSuccessSection(response.data);
            
            // Clear saved form data
            clearFormData();
            
            // Track successful submission
            trackEvent('form_submitted', { 
                userId: response.data.userId,
                planId: response.data.planId 
            });
        } else {
            throw new Error(response.message || 'Failed to generate diet plan');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        hideLoadingOverlay();
        showErrorMessage('Sorry, there was an error generating your diet plan. Please try again.');
    }
}

function collectFormData() {
    const formElement = document.getElementById('dietPlanForm');
    const formData = new FormData(formElement);
    const data = {};
    
    // Convert FormData to regular object
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Handle multiple values (checkboxes)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // Add timestamp
    data.submissionDate = new Date().toISOString();
    
    return data;
}

function showSuccessSection(planData) {
    hideLoadingOverlay();
    
    const formContainer = document.getElementById('formContainer');
    const successSection = document.getElementById('successSection');
    
    formContainer.classList.add('hidden');
    successSection.classList.remove('hidden');
    
    // Populate plan preview
    const planPreview = document.getElementById('planPreview');
    if (planPreview && planData) {
        planPreview.innerHTML = generatePlanPreview(planData);
    }
    
    // Set up download button
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (downloadBtn && planData.planId) {
        downloadBtn.onclick = () => downloadPDF(planData.planId);
        downloadBtn.disabled = false;
    }
    
    // Set up preview button
    const previewBtn = document.getElementById('previewPdfBtn');
    if (previewBtn && planData.planId) {
        previewBtn.onclick = () => previewPDF(planData.planId);
        previewBtn.disabled = false;
    }
    
    // Set up create another button
    const createAnotherBtn = document.getElementById('createAnotherBtn');
    if (createAnotherBtn) {
        createAnotherBtn.onclick = createAnotherPlan;
    }
    
    // Store plan data for future use
    localStorage.setItem('currentPlanId', planData.planId);
    localStorage.setItem('currentUserId', planData.userId);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generatePlanPreview(planData) {
    const plan = planData.plan || {};
    const dailyCalories = plan.goals?.dailyCalories || 'N/A';
    const macroTargets = plan.goals?.macroTargets || {};
    
    return `
        <div class="plan-summary">
            <h3><i class="fas fa-chart-pie"></i> Your Plan Summary</h3>
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="label">Daily Calories:</span>
                    <span class="value">${dailyCalories} kcal</span>
                </div>
                <div class="summary-item">
                    <span class="label">Protein:</span>
                    <span class="value">${macroTargets.protein || 'N/A'}g</span>
                </div>
                <div class="summary-item">
                    <span class="label">Carbs:</span>
                    <span class="value">${macroTargets.carbs || 'N/A'}g</span>
                </div>
                <div class="summary-item">
                    <span class="label">Fats:</span>
                    <span class="value">${macroTargets.fats || 'N/A'}g</span>
                </div>
            </div>
            <div class="metabolic-info">
                <h4>Your Metabolic Profile:</h4>
                <div class="metabolic-grid">
                    <div class="metabolic-item">
                        <span class="label">BMR:</span>
                        <span class="value">${planData.bmr || 'N/A'} kcal/day</span>
                    </div>
                    <div class="metabolic-item">
                        <span class="label">TDEE:</span>
                        <span class="value">${planData.tdee || 'N/A'} kcal/day</span>
                    </div>
                </div>
            </div>
            <div class="plan-features">
                <h4>Your Plan Includes:</h4>
                <ul>
                    <li><i class="fas fa-check"></i> 7-day personalized meal plan</li>
                    <li><i class="fas fa-check"></i> Detailed shopping list organized by category</li>
                    <li><i class="fas fa-check"></i> Complete nutrition breakdown</li>
                    <li><i class="fas fa-check"></i> Meal preparation instructions</li>
                    <li><i class="fas fa-check"></i> Progress tracking templates</li>
                    <li><i class="fas fa-check"></i> Professional PDF document</li>
                </ul>
            </div>
        </div>
    `;
}

function downloadPDF(pdfUrl) {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'internity-diet-plan.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    trackEvent('pdf_downloaded', { url: pdfUrl });
}

function createAnotherPlan() {
    // Reset everything
    clearFormData();
    currentStep = 1;
    
    // Hide success section
    const successSection = document.getElementById('successSection');
    successSection.classList.add('hidden');
    
    // Show hero section
    const heroSection = document.getElementById('home');
    heroSection.style.display = 'block';
    
    // Reset form
    const form = document.getElementById('dietPlanForm');
    if (form) {
        form.reset();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    trackEvent('create_another_plan');
}

// Loading Functions
function showLoadingOverlay(message = 'Processing...', subtext = '') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    const loadingSubtext = document.getElementById('loadingSubtext');
    
    if (overlay) {
        overlay.classList.remove('hidden');
        
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        if (loadingSubtext) {
            loadingSubtext.textContent = subtext;
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Error Handling
function showErrorMessage(message) {
    // Create error modal or use existing notification system
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Analytics and Tracking
function trackEvent(eventName, properties = {}) {
    // Implement your analytics tracking here
    console.log('Event tracked:', eventName, properties);
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, properties);
    // }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Smooth scrolling for anchor links
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

// PDF Functions
async function downloadPDF(planId) {
    if (!planId) {
        showErrorMessage('No plan ID available for PDF download');
        return;
    }
    
    try {
        // Check if we're in demo mode
        if (window.demoBackend) {
            // Show demo message for PDF download
            showDemoMessage('PDF Download', 
                'In the full version, this would download a professionally formatted PDF with your complete diet plan, meal schedules, shopping lists, and nutrition breakdown.',
                planId);
            return;
        }
        
        // Create download link
        const downloadUrl = `/api/pdf/diet-plan/${planId}`;
        
        // Create temporary link element
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'INTERNITY_Diet_Plan.pdf';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Track event
        trackEvent('pdf_downloaded', { planId: planId });
        
    } catch (error) {
        console.error('Error downloading PDF:', error);
        showErrorMessage('Failed to download PDF. Please try again.');
    }
}

async function previewPDF(planId) {
    if (!planId) {
        showErrorMessage('No plan ID available for PDF preview');
        return;
    }
    
    try {
        // Check if we're in demo mode
        if (window.demoBackend) {
            // Show demo preview
            showDemoPreview(planId);
            return;
        }
        
        // Open PDF preview in new window
        const previewUrl = `/api/pdf/preview/${planId}`;
        window.open(previewUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        // Track event
        trackEvent('pdf_previewed', { planId: planId });
        
    } catch (error) {
        console.error('Error previewing PDF:', error);
        showErrorMessage('Failed to preview PDF. Please try again.');
    }
}

// Demo functions
function showDemoMessage(title, message, planId) {
    const modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.innerHTML = `
        <div class="demo-modal-content">
            <div class="demo-modal-header">
                <h3>🎯 ${title} - Demo Mode</h3>
                <button class="demo-close" onclick="this.closest('.demo-modal').remove()">&times;</button>
            </div>
            <div class="demo-modal-body">
                <p>${message}</p>
                <div class="demo-features">
                    <h4>Full Version PDF Includes:</h4>
                    <ul>
                        <li>✅ Professional cover page with branding</li>
                        <li>✅ Complete user profile and goals</li>
                        <li>✅ Detailed nutrition summary</li>
                        <li>✅ 7-day meal plan with recipes</li>
                        <li>✅ Organized shopping list</li>
                        <li>✅ Progress tracking templates</li>
                    </ul>
                </div>
            </div>
            <div class="demo-modal-footer">
                <button onclick="this.closest('.demo-modal').remove()">Close</button>
                <button onclick="showDemoPreview('${planId}')">View Plan Details</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    trackEvent('demo_pdf_download_attempted', { planId });
}

function showDemoPreview(planId) {
    // Remove existing modals
    document.querySelectorAll('.demo-modal').forEach(modal => modal.remove());
    
    // Get plan data from demo backend
    if (window.demoBackend && window.demoBackend.currentPlanId) {
        const plan = window.demoBackend.dietPlans.get(window.demoBackend.currentPlanId);
        const user = window.demoBackend.users.get(window.demoBackend.currentUserId);
        
        if (plan && user) {
            const modal = document.createElement('div');
            modal.className = 'demo-modal demo-preview';
            modal.innerHTML = generateDemoPreviewContent(plan, user);
            document.body.appendChild(modal);
            trackEvent('demo_pdf_preview_shown', { planId });
        }
    }
}

function createAnotherPlan() {
    // Reset form and go back to step 1
    const form = document.getElementById('dietPlanForm');
    if (form) {
        form.reset();
    }
    
    // Clear stored data
    clearFormData();
    localStorage.removeItem('currentPlanId');
    localStorage.removeItem('currentUserId');
    
    // Reset UI
    currentStep = 1;
    showStep(1);
    updateProgressDisplay();
    updateNavigationButtons();
    
    // Show form, hide success
    const formContainer = document.getElementById('formContainer');
    const successSection = document.getElementById('successSection');
    
    formContainer.classList.remove('hidden');
    successSection.classList.add('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track event
    trackEvent('create_another_plan_clicked');
}

function generateDemoPreviewContent(plan, user) {
    return `
        <div class="demo-modal-content demo-pdf-preview">
            <div class="demo-modal-header">
                <h3>📄 Diet Plan Preview - ${plan.name}</h3>
                <button class="demo-close" onclick="this.closest('.demo-modal').remove()">&times;</button>
            </div>
            <div class="demo-modal-body">
                <div class="pdf-preview-content">
                    <div class="pdf-section">
                        <h4>User Profile</h4>
                        <div class="profile-grid">
                            <div><strong>Name:</strong> ${user.fullName || 'Demo User'}</div>
                            <div><strong>Age:</strong> ${user.age || 'N/A'} years</div>
                            <div><strong>Goal:</strong> ${user.primaryGoal?.replace('_', ' ') || 'N/A'}</div>
                            <div><strong>BMR:</strong> ${user.bmr || 'N/A'} kcal/day</div>
                        </div>
                    </div>
                    
                    <div class="pdf-section">
                        <h4>Daily Targets</h4>
                        <div class="targets-grid">
                            <div class="target-box">
                                <span class="target-value">${plan.goals.dailyCalories}</span>
                                <span class="target-label">Calories</span>
                            </div>
                            <div class="target-box">
                                <span class="target-value">${plan.goals.macroTargets.protein}g</span>
                                <span class="target-label">Protein</span>
                            </div>
                            <div class="target-box">
                                <span class="target-value">${plan.goals.macroTargets.carbs}g</span>
                                <span class="target-label">Carbs</span>
                            </div>
                            <div class="target-box">
                                <span class="target-value">${plan.goals.macroTargets.fats}g</span>
                                <span class="target-label">Fats</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pdf-section">
                        <h4>Sample Week - Monday</h4>
                        ${generateSampleDayPreview(plan.weeklyPlan[0] || plan.weeklyPlan.find(d => d.day === 'monday'))}
                    </div>
                    
                    <div class="pdf-section">
                        <h4>Shopping List Preview</h4>
                        <div class="shopping-preview">
                            ${plan.shoppingList.slice(0, 6).map(item => 
                                `<div class="shopping-item">• ${item.name} - ${Math.round(item.quantity)}${item.unit}</div>`
                            ).join('')}
                            ${plan.shoppingList.length > 6 ? `<div class="shopping-more">...and ${plan.shoppingList.length - 6} more items</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div class="demo-modal-footer">
                <button onclick="this.closest('.demo-modal').remove()">Close Preview</button>
                <button onclick="showDemoMessage('PDF Download', 'Complete PDF with all 7 days, recipes, and detailed instructions would be downloaded in the full version.', '${plan.id}')">Download Full PDF</button>
            </div>
        </div>
    `;
}

function generateSampleDayPreview(dayPlan) {
    if (!dayPlan) return '<p>No meal plan available</p>';
    
    return `
        <div class="day-preview">
            ${Object.entries(dayPlan.meals).map(([mealType, meal]) => `
                <div class="meal-preview">
                    <h5>${mealType.charAt(0).toUpperCase() + mealType.slice(1)} - ${meal.nutrition.calories} kcal</h5>
                    <div class="meal-foods">
                        ${meal.foods.map(food => `<span class="food-item">${food.name} (${food.quantity}${food.unit})</span>`).join(', ')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Export functions for other modules
window.DietPlanner = {
    startPlanCreation,
    showLoadingOverlay,
    hideLoadingOverlay,
    trackEvent,
    formatCurrency,
    formatDate,
    downloadPDF,
    previewPDF,
    createAnotherPlan
};