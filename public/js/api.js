/* ====================================
   API COMMUNICATION
   Frontend-Backend Communication Layer
   ==================================== */

// API Configuration
const API_CONFIG = {
    baseURL: window.location.origin,
    endpoints: {
        createUser: '/api/user',
        generatePlan: '/api/generate',
        downloadPDF: '/api/pdf/diet-plan',
        previewPDF: '/api/pdf/preview',
        healthCheck: '/api/health',
        searchFoods: '/api/foods/search',
        getMealSuggestions: '/api/meals/suggestions'
    },
    timeout: 30000, // 30 seconds
    retryAttempts: 3
};

// API Client Class
class APIClient {
    constructor(config = API_CONFIG) {
        this.config = config;
        this.requestId = 0;
    }

    // Generate unique request ID
    generateRequestId() {
        return ++this.requestId;
    }

    // Make HTTP request with retry logic
    async makeRequest(endpoint, options = {}) {
        const requestId = this.generateRequestId();
        const url = `${this.config.baseURL}${endpoint}`;
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': requestId.toString()
            },
            timeout: this.config.timeout
        };

        const finalOptions = { ...defaultOptions, ...options };

        // Add request timestamp
        finalOptions.headers['X-Request-Time'] = new Date().toISOString();

        let lastError;
        
        for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
            try {
                console.log(`API Request [${requestId}] - Attempt ${attempt}:`, {
                    url,
                    method: finalOptions.method,
                    headers: finalOptions.headers
                });

                const response = await this.fetchWithTimeout(url, finalOptions);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                
                console.log(`API Response [${requestId}]:`, data);
                
                return {
                    success: true,
                    data: data,
                    status: response.status,
                    requestId: requestId
                };

            } catch (error) {
                lastError = error;
                console.error(`API Request [${requestId}] - Attempt ${attempt} failed:`, error);
                
                // Don't retry on client errors (4xx)
                if (error.message.includes('HTTP 4')) {
                    break;
                }
                
                // Wait before retry (exponential backoff)
                if (attempt < this.config.retryAttempts) {
                    await this.delay(Math.pow(2, attempt) * 1000);
                }
            }
        }

        return {
            success: false,
            error: lastError.message,
            requestId: requestId
        };
    }

    // Fetch with timeout
    async fetchWithTimeout(url, options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    // Utility delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize API client
const apiClient = new APIClient();

// Submit diet plan to backend
async function submitDietPlan(formData) {
    try {
        // Validate form data before submission
        const validationResult = validateFormDataForSubmission(formData);
        if (!validationResult.isValid) {
            throw new Error(validationResult.message);
        }

        // Show progress updates
        updateLoadingProgress('Validating your information...', 10);

        // Prepare data for submission
        const submissionData = prepareSubmissionData(formData);
        
        updateLoadingProgress('Creating your profile...', 20);

        // First create/update user
        const userResponse = await apiClient.makeRequest('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submissionData)
        });

        if (!userResponse.success) {
            throw new Error(userResponse.error || 'Failed to save user profile');
        }

        updateLoadingProgress('Calculating your nutritional needs...', 40);

        // Generate diet plan
        const dietPlanResponse = await apiClient.makeRequest('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userResponse.data.data.userId,
                preferences: {
                    mealsPerDay: 3,
                    snacksPerDay: 1
                }
            })
        });

        if (!dietPlanResponse.success) {
            throw new Error(dietPlanResponse.error || 'Failed to generate diet plan');
        }

        updateLoadingProgress('Generating your personalized meal plan...', 70);
        
        // Simulate additional processing time for better UX
        await apiClient.delay(1500);
        
        updateLoadingProgress('Finalizing your diet plan...', 95);
        await apiClient.delay(1000);

        // Store plan data for success page
        const planData = dietPlanResponse.data.data;
        
        return {
            success: true,
            data: {
                userId: userResponse.data.data.userId,
                planId: planData._id,
                plan: planData,
                bmr: userResponse.data.data.bmr,
                tdee: userResponse.data.data.tdee,
                macroRatios: userResponse.data.data.macroRatios
            }
        };

    } catch (error) {
        console.error('Diet plan submission error:', error);
        
        // Track error for analytics
        trackEvent('form_submission_error', {
            error: error.message,
            timestamp: new Date().toISOString()
        });

        return {
            success: false,
            error: error.message
        };
    }
}

// Validate form data before submission
function validateFormDataForSubmission(formData) {
    const requiredFields = [
        'fullName', 'age', 'gender', 'email',
        'currentWeight', 'height', 'primaryGoal',
        'activityLevel', 'dietType', 'workSchedule'
    ];

    for (const field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
            return {
                isValid: false,
                message: `Missing required field: ${field}`
            };
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        return {
            isValid: false,
            message: 'Invalid email format'
        };
    }

    // Validate age range
    const age = parseInt(formData.age);
    if (age < 18 || age > 100) {
        return {
            isValid: false,
            message: 'Age must be between 18 and 100'
        };
    }

    return { isValid: true };
}

// Prepare submission data
function prepareSubmissionData(formData) {
    const submissionData = {
        // Personal Information
        personalInfo: {
            fullName: formData.fullName,
            age: parseInt(formData.age),
            gender: formData.gender,
            email: formData.email,
            phone: formData.phone || null
        },

        // Physical Measurements
        physicalData: {
            currentWeight: parseFloat(formData.currentWeight),
            weightUnit: formData.weightUnit || 'kg',
            height: parseFloat(formData.height),
            heightUnit: formData.heightUnit || 'cm',
            bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
            waistCircumference: formData.waistCircumference ? parseFloat(formData.waistCircumference) : null,
            hipCircumference: formData.hipCircumference ? parseFloat(formData.hipCircumference) : null
        },

        // Goals and Timeline
        goals: {
            primaryGoal: formData.primaryGoal,
            targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : null,
            timeline: formData.timeline,
            activityLevel: formData.activityLevel
        },

        // Dietary Preferences
        dietaryPreferences: {
            dietType: formData.dietType,
            mealFrequency: formData.mealFrequency,
            foodAllergies: Array.isArray(formData.foodAllergies) ? formData.foodAllergies : [],
            foodsToAvoid: formData.foodsToAvoid || '',
            preferredCuisines: Array.isArray(formData.preferredCuisines) ? formData.preferredCuisines : [],
            waterIntake: formData.waterIntake ? parseFloat(formData.waterIntake) : 2.5
        },

        // Health Information
        healthInfo: {
            medicalConditions: Array.isArray(formData.medicalConditions) ? formData.medicalConditions : [],
            currentMedications: formData.currentMedications || '',
            dietExperience: formData.dietExperience || 'beginner',
            sleepHours: formData.sleepHours || '',
            stressLevel: formData.stressLevel || ''
        },

        // Lifestyle Factors
        lifestyle: {
            workSchedule: formData.workSchedule,
            cookingSkills: formData.cookingSkills,
            mealPrepTime: formData.mealPrepTime || 'moderate',
            budgetPreference: formData.budgetPreference || 'medium',
            exerciseRoutine: formData.exerciseRoutine || '',
            specialRequests: formData.specialRequests || ''
        },

        // Metadata
        metadata: {
            submissionDate: new Date().toISOString(),
            userAgent: navigator.userAgent,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language
        }
    };

    return submissionData;
}

// Update loading progress
function updateLoadingProgress(message, percentage) {
    const loadingText = document.getElementById('loadingText');
    const loadingSubtext = document.getElementById('loadingSubtext');
    
    if (loadingText) {
        loadingText.textContent = message;
    }
    
    if (loadingSubtext) {
        loadingSubtext.textContent = `${percentage}% complete`;
    }
    
    // Update progress bar if it exists
    const progressBar = document.querySelector('.loading-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

// Download PDF
async function downloadPDF(planId) {
    try {
        showLoadingOverlay('Preparing your PDF download...');
        
        const response = await apiClient.makeRequest(`${API_CONFIG.endpoints.downloadPDF}/${planId}`, {
            method: 'GET'
        });

        hideLoadingOverlay();

        if (response.success && response.data.downloadUrl) {
            // Create download link
            const link = document.createElement('a');
            link.href = response.data.downloadUrl;
            link.download = response.data.filename || 'internity-diet-plan.pdf';
            link.target = '_blank';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Track download
            trackEvent('pdf_download_success', {
                planId: planId,
                filename: response.data.filename
            });
            
            return true;
        } else {
            throw new Error(response.error || 'Failed to download PDF');
        }
        
    } catch (error) {
        hideLoadingOverlay();
        console.error('PDF download error:', error);
        
        showErrorMessage('Sorry, there was an error downloading your PDF. Please try again.');
        
        trackEvent('pdf_download_error', {
            planId: planId,
            error: error.message
        });
        
        return false;
    }
}

// Validate email (real-time)
async function validateEmailAPI(email) {
    try {
        const response = await apiClient.makeRequest(API_CONFIG.endpoints.validateEmail, {
            method: 'POST',
            body: JSON.stringify({ email: email })
        });

        return response.success ? response.data : { isValid: false };
        
    } catch (error) {
        console.error('Email validation error:', error);
        // Return basic validation if API fails
        return {
            isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        };
    }
}

// Health check
async function performHealthCheck() {
    try {
        const response = await apiClient.makeRequest(API_CONFIG.endpoints.healthCheck);
        return response.success;
    } catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
}

// Connection status monitoring
class ConnectionMonitor {
    constructor() {
        this.isOnline = navigator.onLine;
        this.listeners = [];
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.notifyListeners('online');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.notifyListeners('offline');
        });
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(status) {
        this.listeners.forEach(callback => callback(status));
    }

    async checkConnection() {
        if (!this.isOnline) {
            return false;
        }

        try {
            const response = await fetch('/api/health', {
                method: 'HEAD',
                timeout: 5000
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Initialize connection monitor
const connectionMonitor = new ConnectionMonitor();

// Show connection status
connectionMonitor.addListener((status) => {
    const statusIndicator = document.querySelector('.connection-status');
    
    if (!statusIndicator) {
        const indicator = document.createElement('div');
        indicator.className = 'connection-status';
        document.body.appendChild(indicator);
    }
    
    const indicator = document.querySelector('.connection-status');
    
    if (status === 'offline') {
        indicator.textContent = 'No internet connection';
        indicator.className = 'connection-status offline';
        indicator.style.display = 'block';
    } else {
        indicator.textContent = 'Connection restored';
        indicator.className = 'connection-status online';
        indicator.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 3000);
    }
});

// Retry failed requests when connection is restored
connectionMonitor.addListener((status) => {
    if (status === 'online') {
        // Retry any failed form submissions
        retryFailedSubmissions();
    }
});

// Store failed submissions for retry
let failedSubmissions = [];

function retryFailedSubmissions() {
    if (failedSubmissions.length === 0) return;
    
    console.log('Retrying failed submissions:', failedSubmissions.length);
    
    failedSubmissions.forEach(async (submission) => {
        try {
            const result = await submitDietPlan(submission.data);
            if (result.success) {
                // Remove from failed submissions
                failedSubmissions = failedSubmissions.filter(s => s.id !== submission.id);
                console.log('Retry successful for submission:', submission.id);
            }
        } catch (error) {
            console.error('Retry failed for submission:', submission.id, error);
        }
    });
}

// Add failed submission to retry queue
function addFailedSubmission(data) {
    const submission = {
        id: Date.now(),
        data: data,
        timestamp: new Date().toISOString()
    };
    
    failedSubmissions.push(submission);
    console.log('Added failed submission to retry queue:', submission.id);
}

// API response caching (for static data)
class APICache {
    constructor() {
        this.cache = new Map();
        this.ttl = 5 * 60 * 1000; // 5 minutes
    }

    set(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    get(key) {
        const cached = this.cache.get(key);
        
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    clear() {
        this.cache.clear();
    }
}

const apiCache = new APICache();

// Initialize API system
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in demo mode (GitHub Pages)
    const isDemoMode = window.location.hostname.includes('github.io') || window.demoBackend;
    
    if (isDemoMode) {
        console.log('🎯 DEMO MODE ENABLED - Using simulated backend');
        return; // Skip real health checks in demo mode
    }
    
    // Perform initial health check (only for real backend)
    performHealthCheck().then(isHealthy => {
        if (!isHealthy) {
            console.warn('Backend health check failed');
        }
    });
    
    // Setup periodic health checks (only for real backend)
    setInterval(() => {
        performHealthCheck();
    }, 60000); // Every minute
});

// Export API functions
window.DietPlannerAPI = {
    submitDietPlan,
    downloadPDF,
    validateEmailAPI,
    performHealthCheck,
    connectionMonitor
};