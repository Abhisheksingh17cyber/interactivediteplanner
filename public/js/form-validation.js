/* ====================================
   FORM VALIDATION
   Comprehensive Form Validation System
   ==================================== */

// Validation rules configuration
const validationRules = {
    fullName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Please enter a valid full name (letters and spaces only)'
    },
    age: {
        required: true,
        min: 18,
        max: 100,
        type: 'number',
        message: 'Age must be between 18 and 100 years'
    },
    gender: {
        required: true,
        message: 'Please select your gender'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    phone: {
        required: false,
        pattern: /^[\+]?[\d\s\-\(\)]{10,}$/,
        message: 'Please enter a valid phone number'
    },
    currentWeight: {
        required: true,
        min: 30,
        max: 300,
        type: 'number',
        message: 'Weight must be between 30-300 kg or 66-660 lbs'
    },
    height: {
        required: true,
        min: 120,
        max: 250,
        type: 'number',
        message: 'Height must be between 120-250 cm or 4-8 feet'
    },
    bodyFat: {
        required: false,
        min: 5,
        max: 50,
        type: 'number',
        message: 'Body fat percentage must be between 5-50%'
    },
    primaryGoal: {
        required: true,
        message: 'Please select your primary goal'
    },
    timeline: {
        required: true,
        message: 'Please select your timeline'
    },
    activityLevel: {
        required: true,
        message: 'Please select your activity level'
    },
    dietType: {
        required: true,
        message: 'Please select your diet type preference'
    },
    mealFrequency: {
        required: true,
        message: 'Please select your preferred meal frequency'
    },
    workSchedule: {
        required: true,
        message: 'Please select your work schedule type'
    },
    cookingSkills: {
        required: true,
        message: 'Please select your cooking skill level'
    }
};

// Step validation mapping
const stepValidationFields = {
    1: ['fullName', 'age', 'gender', 'email', 'phone'],
    2: ['currentWeight', 'height', 'bodyFat', 'waistCircumference', 'hipCircumference'],
    3: ['primaryGoal', 'timeline', 'activityLevel'],
    4: ['dietType', 'mealFrequency'],
    5: [], // Health info is mostly optional
    6: ['workSchedule', 'cookingSkills']
};

// Initialize validation system
function initializeValidation() {
    const form = document.getElementById('dietPlanForm');
    if (!form) return;
    
    // Add real-time validation to all form fields
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        addFieldValidation(field);
    });
    
    // Add form submission validation
    form.addEventListener('submit', handleFormValidation);
}

// Add validation to individual field
function addFieldValidation(field) {
    // Add event listeners for real-time validation
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', debounce(() => validateFieldOnInput(field), 300));
    
    // Add visual feedback classes
    field.addEventListener('focus', () => {
        clearFieldError(field);
    });
}

// Validate current step
function validateCurrentStep() {
    const fieldsToValidate = stepValidationFields[currentStep] || [];
    let isValid = true;
    let firstErrorField = null;
    
    fieldsToValidate.forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            const fieldValid = validateField(field);
            if (!fieldValid && !firstErrorField) {
                firstErrorField = field;
            }
            isValid = isValid && fieldValid;
        }
    });
    
    // Focus on first error field
    if (!isValid && firstErrorField) {
        firstErrorField.focus();
        
        // Scroll to field if needed
        const fieldGroup = firstErrorField.closest('.form-group');
        if (fieldGroup) {
            fieldGroup.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = getFieldValue(field);
    const rules = validationRules[fieldName];
    
    if (!rules) return true;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Check if field is required
    if (rules.required && (!fieldValue || fieldValue.toString().trim() === '')) {
        showFieldError(field, rules.message || `${fieldName} is required`);
        return false;
    }
    
    // Skip further validation if field is empty and not required
    if (!rules.required && (!fieldValue || fieldValue.toString().trim() === '')) {
        return true;
    }
    
    // Type validation
    if (rules.type === 'number') {
        const numValue = parseFloat(fieldValue);
        if (isNaN(numValue)) {
            showFieldError(field, 'Please enter a valid number');
            return false;
        }
        
        // Min/Max validation for numbers
        if (rules.min !== undefined && numValue < rules.min) {
            showFieldError(field, rules.message || `Minimum value is ${rules.min}`);
            return false;
        }
        
        if (rules.max !== undefined && numValue > rules.max) {
            showFieldError(field, rules.message || `Maximum value is ${rules.max}`);
            return false;
        }
    }
    
    // String length validation
    if (rules.minLength && fieldValue.length < rules.minLength) {
        showFieldError(field, rules.message || `Minimum length is ${rules.minLength} characters`);
        return false;
    }
    
    if (rules.maxLength && fieldValue.length > rules.maxLength) {
        showFieldError(field, rules.message || `Maximum length is ${rules.maxLength} characters`);
        return false;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(fieldValue)) {
        showFieldError(field, rules.message || 'Invalid format');
        return false;
    }
    
    // Custom validation
    const customValidationResult = performCustomValidation(fieldName, fieldValue, field);
    if (!customValidationResult.isValid) {
        showFieldError(field, customValidationResult.message);
        return false;
    }
    
    // If all validations pass, show success
    showFieldSuccess(field);
    return true;
}

// Validate field on input (less strict)
function validateFieldOnInput(field) {
    const fieldName = field.name;
    const fieldValue = getFieldValue(field);
    const rules = validationRules[fieldName];
    
    if (!rules || !fieldValue) return;
    
    // Only check format/pattern on input, not required fields
    if (rules.pattern && fieldValue.length > 0) {
        if (!rules.pattern.test(fieldValue)) {
            showFieldError(field, rules.message || 'Invalid format');
        } else {
            clearFieldError(field);
        }
    }
    
    // Check length limits on input
    if (rules.maxLength && fieldValue.length > rules.maxLength) {
        showFieldError(field, `Maximum ${rules.maxLength} characters allowed`);
    }
}

// Custom validation for specific fields
function performCustomValidation(fieldName, fieldValue, field) {
    switch (fieldName) {
        case 'email':
            return validateEmail(fieldValue);
        
        case 'age':
            return validateAge(fieldValue);
        
        case 'currentWeight':
            return validateWeight(fieldValue, field);
        
        case 'height':
            return validateHeight(fieldValue, field);
        
        case 'targetWeight':
            return validateTargetWeight(fieldValue, field);
        
        case 'phone':
            return validatePhone(fieldValue);
        
        default:
            return { isValid: true };
    }
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: 'Please enter a valid email address'
        };
    }
    
    // Check for common email providers
    const commonProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    
    if (domain && !commonProviders.includes(domain) && !domain.includes('.')) {
        return {
            isValid: false,
            message: 'Please enter a valid email domain'
        };
    }
    
    return { isValid: true };
}

// Age validation
function validateAge(age) {
    const numAge = parseInt(age);
    
    if (numAge < 18) {
        return {
            isValid: false,
            message: 'You must be at least 18 years old to use this service'
        };
    }
    
    if (numAge > 100) {
        return {
            isValid: false,
            message: 'Please enter a valid age'
        };
    }
    
    return { isValid: true };
}

// Weight validation
function validateWeight(weight, field) {
    const numWeight = parseFloat(weight);
    const unit = getWeightUnit(field);
    
    if (unit === 'kg') {
        if (numWeight < 30 || numWeight > 300) {
            return {
                isValid: false,
                message: 'Weight must be between 30-300 kg'
            };
        }
    } else { // lbs
        if (numWeight < 66 || numWeight > 660) {
            return {
                isValid: false,
                message: 'Weight must be between 66-660 lbs'
            };
        }
    }
    
    return { isValid: true };
}

// Height validation
function validateHeight(height, field) {
    const numHeight = parseFloat(height);
    const unit = getHeightUnit(field);
    
    if (unit === 'cm') {
        if (numHeight < 120 || numHeight > 250) {
            return {
                isValid: false,
                message: 'Height must be between 120-250 cm'
            };
        }
    } else { // ft
        if (numHeight < 4 || numHeight > 8) {
            return {
                isValid: false,
                message: 'Height must be between 4-8 feet'
            };
        }
    }
    
    return { isValid: true };
}

// Target weight validation
function validateTargetWeight(targetWeight, field) {
    const currentWeightField = document.getElementById('currentWeight');
    const goalField = document.querySelector('input[name="primaryGoal"]:checked');
    
    if (!currentWeightField || !goalField || !targetWeight) {
        return { isValid: true };
    }
    
    const currentWeight = parseFloat(currentWeightField.value);
    const numTargetWeight = parseFloat(targetWeight);
    const goal = goalField.value;
    
    if (goal === 'weight_loss' && numTargetWeight >= currentWeight) {
        return {
            isValid: false,
            message: 'Target weight should be less than current weight for weight loss'
        };
    }
    
    if (goal === 'weight_gain' && numTargetWeight <= currentWeight) {
        return {
            isValid: false,
            message: 'Target weight should be more than current weight for weight gain'
        };
    }
    
    // Check for realistic weight change
    const weightDifference = Math.abs(numTargetWeight - currentWeight);
    const unit = getWeightUnit(field);
    const maxRealisticChange = unit === 'kg' ? 50 : 110; // 50kg or 110lbs
    
    if (weightDifference > maxRealisticChange) {
        return {
            isValid: false,
            message: `Weight change seems unrealistic. Please consult a healthcare professional for such significant changes.`
        };
    }
    
    return { isValid: true };
}

// Phone validation
function validatePhone(phone) {
    if (!phone) return { isValid: true }; // Phone is optional
    
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10) {
        return {
            isValid: false,
            message: 'Phone number must be at least 10 digits'
        };
    }
    
    return { isValid: true };
}

// Utility functions
function getWeightUnit(field) {
    const unitField = field.parentElement.querySelector('select') || 
                     document.getElementById('weightUnit');
    return unitField ? unitField.value : 'kg';
}

function getHeightUnit(field) {
    const unitField = field.parentElement.querySelector('select') || 
                     document.getElementById('heightUnit');
    return unitField ? unitField.value : 'cm';
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

// Error display functions
function showFieldError(field, message) {
    const fieldGroup = field.closest('.form-group');
    if (!fieldGroup) return;
    
    // Add error class
    fieldGroup.classList.add('error');
    fieldGroup.classList.remove('success');
    
    // Show error message
    const errorElement = fieldGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    // Add red border to field
    field.style.borderColor = '#dc3545';
}

function showFieldSuccess(field) {
    const fieldGroup = field.closest('.form-group');
    if (!fieldGroup) return;
    
    // Add success class
    fieldGroup.classList.add('success');
    fieldGroup.classList.remove('error');
    
    // Hide error message
    const errorElement = fieldGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    
    // Add green border to field
    field.style.borderColor = '#28a745';
}

function clearFieldError(field) {
    const fieldGroup = field.closest('.form-group');
    if (!fieldGroup) return;
    
    // Remove error classes
    fieldGroup.classList.remove('error', 'success');
    
    // Hide error message
    const errorElement = fieldGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    
    // Reset border color
    field.style.borderColor = '';
}

// Form submission validation
function handleFormValidation(event) {
    event.preventDefault();
    
    const form = event.target;
    let isValid = true;
    let firstErrorField = null;
    
    // Validate all fields in the form
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        const fieldValid = validateField(field);
        if (!fieldValid && !firstErrorField) {
            firstErrorField = field;
        }
        isValid = isValid && fieldValid;
    });
    
    if (!isValid && firstErrorField) {
        firstErrorField.focus();
        return false;
    }
    
    return isValid;
}

// Real-time validation indicators
function addValidationIndicators() {
    const form = document.getElementById('dietPlanForm');
    if (!form) return;
    
    // Add completion indicator
    const completionIndicator = document.createElement('div');
    completionIndicator.className = 'form-completion';
    completionIndicator.innerHTML = `
        <div class="completion-text">Form Completion: <span id="completionPercent">0%</span></div>
        <div class="completion-bar">
            <div class="completion-fill" id="completionFill"></div>
        </div>
    `;
    
    const formWrapper = document.querySelector('.form-wrapper');
    if (formWrapper) {
        formWrapper.insertBefore(completionIndicator, formWrapper.firstChild);
    }
    
    // Update completion on field changes
    form.addEventListener('input', updateFormCompletion);
    form.addEventListener('change', updateFormCompletion);
}

function updateFormCompletion() {
    const requiredFields = document.querySelectorAll('[required]');
    let completedFields = 0;
    
    requiredFields.forEach(field => {
        const value = getFieldValue(field);
        if (value && value.toString().trim() !== '') {
            completedFields++;
        }
    });
    
    const percentage = Math.round((completedFields / requiredFields.length) * 100);
    
    const percentElement = document.getElementById('completionPercent');
    const fillElement = document.getElementById('completionFill');
    
    if (percentElement) {
        percentElement.textContent = percentage + '%';
    }
    
    if (fillElement) {
        fillElement.style.width = percentage + '%';
    }
}

// Initialize validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeValidation();
    addValidationIndicators();
});

// Export validation functions
window.FormValidation = {
    validateCurrentStep,
    validateField,
    clearFieldError,
    showFieldError,
    showFieldSuccess
};