/* ====================================
   FORM NAVIGATION
   Multi-step Form Navigation System
   ==================================== */

// Navigation state
let navigationState = {
    currentStep: 1,
    totalSteps: 6,
    visitedSteps: [1],
    stepHistory: [1]
};

// Initialize form navigation
function initializeFormNavigation() {
    setupNavigationButtons();
    setupStepClickNavigation();
    setupKeyboardNavigation();
    updateNavigationState();
}

// Setup navigation buttons
function setupNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', handlePreviousStep);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextStep);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', handleFormSubmission);
    }
}

// Setup step click navigation
function setupStepClickNavigation() {
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    
    progressSteps.forEach((stepElement, index) => {
        const stepNumber = index + 1;
        
        stepElement.addEventListener('click', function() {
            // Only allow navigation to visited steps or next unvisited step
            if (navigationState.visitedSteps.includes(stepNumber) || 
                stepNumber === Math.max(...navigationState.visitedSteps) + 1) {
                navigateToStep(stepNumber);
            }
        });
        
        // Add hover effects for clickable steps
        stepElement.addEventListener('mouseenter', function() {
            if (navigationState.visitedSteps.includes(stepNumber) || 
                stepNumber === Math.max(...navigationState.visitedSteps) + 1) {
                this.style.cursor = 'pointer';
                this.style.opacity = '0.8';
            }
        });
        
        stepElement.addEventListener('mouseleave', function() {
            this.style.opacity = '';
        });
    });
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Only handle navigation if form is visible
        const formContainer = document.getElementById('formContainer');
        if (!formContainer || formContainer.classList.contains('hidden')) {
            return;
        }
        
        // Alt + Left Arrow: Previous step
        if (event.altKey && event.key === 'ArrowLeft') {
            event.preventDefault();
            handlePreviousStep();
        }
        
        // Alt + Right Arrow: Next step
        if (event.altKey && event.key === 'ArrowRight') {
            event.preventDefault();
            handleNextStep();
        }
        
        // Alt + Enter: Submit form (on last step)
        if (event.altKey && event.key === 'Enter' && navigationState.currentStep === navigationState.totalSteps) {
            event.preventDefault();
            handleFormSubmission();
        }
        
        // Escape: Go back to hero section
        if (event.key === 'Escape') {
            event.preventDefault();
            goBackToHero();
        }
    });
}

// Handle next step
function handleNextStep() {
    if (navigationState.currentStep < navigationState.totalSteps) {
        // Validate current step before proceeding
        if (validateCurrentStep()) {
            const nextStep = navigationState.currentStep + 1;
            navigateToStep(nextStep);
            
            // Mark step as visited
            if (!navigationState.visitedSteps.includes(nextStep)) {
                navigationState.visitedSteps.push(nextStep);
            }
            
            // Track navigation
            trackStepNavigation('next', navigationState.currentStep, nextStep);
        } else {
            // Show validation errors
            showStepValidationError();
        }
    }
}

// Handle previous step
function handlePreviousStep() {
    if (navigationState.currentStep > 1) {
        const prevStep = navigationState.currentStep - 1;
        navigateToStep(prevStep);
        
        // Track navigation
        trackStepNavigation('previous', navigationState.currentStep, prevStep);
    }
}

// Navigate to specific step
function navigateToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > navigationState.totalSteps) {
        return;
    }
    
    // Update navigation state
    const previousStep = navigationState.currentStep;
    navigationState.currentStep = stepNumber;
    navigationState.stepHistory.push(stepNumber);
    
    // Update UI
    showStep(stepNumber);
    updateProgressBar();
    updateNavigationButtons();
    updateStepIndicators();
    
    // Save current step
    saveNavigationState();
    
    // Scroll to form top
    scrollToFormTop();
    
    // Focus management
    handleStepFocus(stepNumber);
    
    // Analytics
    trackEvent('step_navigation', {
        from: previousStep,
        to: stepNumber,
        method: 'direct'
    });
}

// Show specific step
function showStep(stepNumber) {
    // Hide all steps
    const allSteps = document.querySelectorAll('.form-step');
    allSteps.forEach(step => {
        step.classList.remove('active', 'prev', 'next');
    });
    
    // Show current step
    const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        
        // Add animation classes
        setTimeout(() => {
            currentStepElement.classList.add('animate-in');
        }, 50);
    }
    
    // Update step classes for animations
    updateStepAnimationClasses(stepNumber);
}

// Update step animation classes
function updateStepAnimationClasses(currentStep) {
    const allSteps = document.querySelectorAll('.form-step');
    
    allSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('prev', 'next');
        
        if (stepNumber < currentStep) {
            step.classList.add('prev');
        } else if (stepNumber > currentStep) {
            step.classList.add('next');
        }
    });
}

// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const percentage = (navigationState.currentStep / navigationState.totalSteps) * 100;
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        
        // Add completion animation
        progressFill.classList.add('progress-update');
        setTimeout(() => {
            progressFill.classList.remove('progress-update');
        }, 300);
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Update previous button
    if (prevBtn) {
        prevBtn.style.display = navigationState.currentStep === 1 ? 'none' : 'inline-flex';
        prevBtn.disabled = navigationState.currentStep === 1;
    }
    
    // Update next/submit buttons
    if (navigationState.currentStep === navigationState.totalSteps) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) {
            submitBtn.style.display = 'inline-flex';
            submitBtn.disabled = false;
        }
    } else {
        if (nextBtn) {
            nextBtn.style.display = 'inline-flex';
            nextBtn.disabled = false;
        }
        if (submitBtn) submitBtn.style.display = 'none';
    }
    
    // Update button text based on step
    updateButtonText();
}

// Update button text
function updateButtonText() {
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (nextBtn) {
        const stepTexts = {
            1: 'Continue to Physical Data',
            2: 'Continue to Goals',
            3: 'Continue to Diet Preferences',
            4: 'Continue to Health Info',
            5: 'Continue to Lifestyle'
        };
        
        const buttonText = stepTexts[navigationState.currentStep] || 'Next Step';
        nextBtn.innerHTML = `${buttonText} <i class="fas fa-chevron-right"></i>`;
    }
    
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-rocket"></i> Generate My Diet Plan';
    }
}

// Update step indicators
function updateStepIndicators() {
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    
    progressSteps.forEach((stepElement, index) => {
        const stepNumber = index + 1;
        
        // Remove all status classes
        stepElement.classList.remove('active', 'completed', 'accessible');
        
        // Add appropriate classes
        if (stepNumber === navigationState.currentStep) {
            stepElement.classList.add('active');
        } else if (navigationState.visitedSteps.includes(stepNumber)) {
            stepElement.classList.add('completed');
        }
        
        // Mark accessible steps
        if (navigationState.visitedSteps.includes(stepNumber) || 
            stepNumber === Math.max(...navigationState.visitedSteps) + 1) {
            stepElement.classList.add('accessible');
        }
    });
}

// Handle step focus
function handleStepFocus(stepNumber) {
    setTimeout(() => {
        const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            // Focus on first input in the step
            const firstInput = currentStepElement.querySelector('input, select, textarea');
            if (firstInput && !firstInput.disabled) {
                firstInput.focus();
            }
        }
    }, 300);
}

// Scroll to form top
function scrollToFormTop() {
    const formWrapper = document.querySelector('.form-wrapper');
    if (formWrapper) {
        formWrapper.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Handle form submission
function handleFormSubmission() {
    // Validate all steps
    const allStepsValid = validateAllSteps();
    
    if (allStepsValid) {
        // Disable submit button to prevent double submission
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Plan...';
        }
        
        // Proceed with form submission
        handleFormSubmit(event);
    } else {
        // Navigate to first invalid step
        const firstInvalidStep = findFirstInvalidStep();
        if (firstInvalidStep) {
            navigateToStep(firstInvalidStep);
            showValidationSummary();
        }
    }
}

// Validate all steps
function validateAllSteps() {
    let allValid = true;
    
    for (let step = 1; step <= navigationState.totalSteps; step++) {
        const fieldsToValidate = stepValidationFields[step] || [];
        
        fieldsToValidate.forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field && !validateField(field)) {
                allValid = false;
            }
        });
    }
    
    return allValid;
}

// Find first invalid step
function findFirstInvalidStep() {
    for (let step = 1; step <= navigationState.totalSteps; step++) {
        const fieldsToValidate = stepValidationFields[step] || [];
        
        for (let fieldName of fieldsToValidate) {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field && !validateField(field)) {
                return step;
            }
        }
    }
    
    return null;
}

// Show validation summary
function showValidationSummary() {
    const validationSummary = document.createElement('div');
    validationSummary.className = 'validation-summary';
    validationSummary.innerHTML = `
        <div class="validation-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Please Complete Required Fields</h3>
            <p>Some required fields need to be completed before generating your diet plan.</p>
            <button onclick="this.parentElement.parentElement.remove()">Got it</button>
        </div>
    `;
    
    document.body.appendChild(validationSummary);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (validationSummary.parentElement) {
            validationSummary.remove();
        }
    }, 5000);
}

// Show step validation error
function showStepValidationError() {
    const currentStepElement = document.querySelector(`[data-step="${navigationState.currentStep}"]`);
    if (currentStepElement) {
        // Add shake animation
        currentStepElement.classList.add('shake-error');
        setTimeout(() => {
            currentStepElement.classList.remove('shake-error');
        }, 600);
    }
    
    // Show error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'step-error-message';
    errorMessage.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        Please complete all required fields before continuing.
    `;
    
    const stepHeader = currentStepElement.querySelector('.step-header');
    if (stepHeader) {
        stepHeader.appendChild(errorMessage);
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
}

// Go back to hero section
function goBackToHero() {
    const formContainer = document.getElementById('formContainer');
    const heroSection = document.getElementById('home');
    
    if (formContainer && heroSection) {
        formContainer.classList.add('hidden');
        heroSection.style.display = 'block';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Clear navigation state
        clearNavigationState();
    }
}

// Save navigation state
function saveNavigationState() {
    try {
        localStorage.setItem('dietPlanNavigationState', JSON.stringify(navigationState));
    } catch (error) {
        console.error('Error saving navigation state:', error);
    }
}

// Load navigation state
function loadNavigationState() {
    try {
        const savedState = localStorage.getItem('dietPlanNavigationState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            navigationState = { ...navigationState, ...parsedState };
            
            // Navigate to saved step
            navigateToStep(navigationState.currentStep);
        }
    } catch (error) {
        console.error('Error loading navigation state:', error);
    }
}

// Clear navigation state
function clearNavigationState() {
    localStorage.removeItem('dietPlanNavigationState');
    navigationState = {
        currentStep: 1,
        totalSteps: 6,
        visitedSteps: [1],
        stepHistory: [1]
    };
}

// Update navigation state
function updateNavigationState() {
    // Update global currentStep variable for backward compatibility
    window.currentStep = navigationState.currentStep;
}

// Track step navigation
function trackStepNavigation(method, fromStep, toStep) {
    trackEvent('step_navigation', {
        method: method,
        from_step: fromStep,
        to_step: toStep,
        timestamp: new Date().toISOString()
    });
}

// Navigation progress summary
function getNavigationProgress() {
    return {
        currentStep: navigationState.currentStep,
        totalSteps: navigationState.totalSteps,
        visitedSteps: navigationState.visitedSteps,
        completionPercentage: (navigationState.visitedSteps.length / navigationState.totalSteps) * 100,
        isComplete: navigationState.visitedSteps.length === navigationState.totalSteps
    };
}

// Add navigation help
function addNavigationHelp() {
    const helpButton = document.createElement('button');
    helpButton.className = 'navigation-help-btn';
    helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
    helpButton.title = 'Navigation Help';
    
    helpButton.addEventListener('click', showNavigationHelp);
    
    const formWrapper = document.querySelector('.form-wrapper');
    if (formWrapper) {
        formWrapper.appendChild(helpButton);
    }
}

function showNavigationHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'navigation-help-modal';
    helpModal.innerHTML = `
        <div class="help-content">
            <h3><i class="fas fa-map"></i> Navigation Help</h3>
            <div class="help-section">
                <h4>How to Navigate:</h4>
                <ul>
                    <li><i class="fas fa-mouse"></i> Click on step numbers to jump between visited steps</li>
                    <li><i class="fas fa-keyboard"></i> Use Alt + Arrow keys for quick navigation</li>
                    <li><i class="fas fa-save"></i> Your progress is automatically saved</li>
                    <li><i class="fas fa-undo"></i> Press Escape to return to the main page</li>
                </ul>
            </div>
            <div class="help-section">
                <h4>Current Progress:</h4>
                <p>Step ${navigationState.currentStep} of ${navigationState.totalSteps}</p>
                <p>${Math.round((navigationState.visitedSteps.length / navigationState.totalSteps) * 100)}% Complete</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(helpModal);
}

// Initialize navigation on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeFormNavigation();
    loadNavigationState();
    addNavigationHelp();
});

// Export navigation functions
window.FormNavigation = {
    navigateToStep,
    handleNextStep,
    handlePreviousStep,
    getNavigationProgress,
    clearNavigationState,
    updateNavigationState
};