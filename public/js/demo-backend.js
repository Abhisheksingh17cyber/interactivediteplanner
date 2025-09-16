/* ====================================
   DEMO BACKEND SIMULATION
   Simulates backend functionality for GitHub Pages deployment
   ==================================== */

// Demo data and configurations
const DEMO_CONFIG = {
    enableDemo: true,
    simulateDelay: true,
    minDelay: 1000, // minimum delay in ms
    maxDelay: 3000  // maximum delay in ms
};

// Sample food database for demo
const DEMO_FOODS = [
    {
        id: 'food_001',
        name: 'Chicken Breast',
        category: 'protein',
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
        serving: '100g'
    },
    {
        id: 'food_002', 
        name: 'Brown Rice',
        category: 'grains',
        calories: 123,
        protein: 2.6,
        carbs: 23,
        fats: 0.9,
        serving: '100g cooked'
    },
    {
        id: 'food_003',
        name: 'Broccoli',
        category: 'vegetables',
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fats: 0.4,
        serving: '100g'
    },
    {
        id: 'food_004',
        name: 'Salmon',
        category: 'protein',
        calories: 208,
        protein: 22.1,
        carbs: 0,
        fats: 12.4,
        serving: '100g'
    },
    {
        id: 'food_005',
        name: 'Sweet Potato',
        category: 'vegetables',
        calories: 86,
        protein: 1.6,
        carbs: 20.1,
        fats: 0.1,
        serving: '100g'
    },
    {
        id: 'food_006',
        name: 'Greek Yogurt',
        category: 'dairy',
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fats: 0.4,
        serving: '100g'
    }
];

// Demo meal templates
const DEMO_MEALS = {
    breakfast: [
        {
            name: 'Protein Breakfast Bowl',
            foods: [
                { foodId: 'food_006', quantity: 200, name: 'Greek Yogurt' },
                { foodId: 'food_003', quantity: 50, name: 'Broccoli' }
            ]
        },
        {
            name: 'Power Breakfast',
            foods: [
                { foodId: 'food_002', quantity: 100, name: 'Brown Rice' },
                { foodId: 'food_001', quantity: 80, name: 'Chicken Breast' }
            ]
        }
    ],
    lunch: [
        {
            name: 'Balanced Lunch',
            foods: [
                { foodId: 'food_001', quantity: 120, name: 'Chicken Breast' },
                { foodId: 'food_002', quantity: 150, name: 'Brown Rice' },
                { foodId: 'food_003', quantity: 100, name: 'Broccoli' }
            ]
        },
        {
            name: 'Fish & Sweet Potato',
            foods: [
                { foodId: 'food_004', quantity: 100, name: 'Salmon' },
                { foodId: 'food_005', quantity: 200, name: 'Sweet Potato' }
            ]
        }
    ],
    dinner: [
        {
            name: 'Light Dinner',
            foods: [
                { foodId: 'food_004', quantity: 150, name: 'Salmon' },
                { foodId: 'food_003', quantity: 150, name: 'Broccoli' }
            ]
        },
        {
            name: 'Hearty Dinner',
            foods: [
                { foodId: 'food_001', quantity: 150, name: 'Chicken Breast' },
                { foodId: 'food_005', quantity: 200, name: 'Sweet Potato' },
                { foodId: 'food_003', quantity: 100, name: 'Broccoli' }
            ]
        }
    ],
    snack: [
        {
            name: 'Protein Snack',
            foods: [
                { foodId: 'food_006', quantity: 150, name: 'Greek Yogurt' }
            ]
        }
    ]
};

// Demo Backend Simulation Class
class DemoBackend {
    constructor() {
        this.users = new Map();
        this.dietPlans = new Map();
        this.currentUserId = null;
        this.currentPlanId = null;
    }

    // Simulate network delay
    async simulateDelay() {
        if (!DEMO_CONFIG.simulateDelay) return;
        
        const delay = Math.random() * (DEMO_CONFIG.maxDelay - DEMO_CONFIG.minDelay) + DEMO_CONFIG.minDelay;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Generate unique IDs
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    calculateBMR(userData) {
        const { weight, height, age, gender } = userData;
        
        if (gender === 'male') {
            return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
        } else {
            return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
        }
    }

    // Calculate TDEE
    calculateTDEE(bmr, activityLevel) {
        const multipliers = {
            'sedentary': 1.2,
            'lightly_active': 1.375,
            'moderately_active': 1.55,
            'very_active': 1.725,
            'extra_active': 1.9
        };
        
        return Math.round(bmr * (multipliers[activityLevel] || 1.2));
    }

    // Calculate macro ratios based on goal
    calculateMacroRatios(goal) {
        const ratios = {
            'weight_loss': { protein: 30, carbs: 35, fats: 35 },
            'weight_gain': { protein: 25, carbs: 45, fats: 30 },
            'muscle_gain': { protein: 35, carbs: 40, fats: 25 },
            'maintenance': { protein: 25, carbs: 45, fats: 30 }
        };
        
        return ratios[goal] || ratios['maintenance'];
    }

    // Create/Update user
    async createUser(userData) {
        await this.simulateDelay();
        
        try {
            const userId = this.generateId('user');
            
            // Calculate metabolic data
            const bmr = this.calculateBMR(userData);
            const tdee = this.calculateTDEE(bmr, userData.activityLevel);
            const macroRatios = this.calculateMacroRatios(userData.primaryGoal);
            
            const user = {
                id: userId,
                ...userData,
                bmr,
                tdee,
                macroRatios,
                createdAt: new Date().toISOString()
            };
            
            this.users.set(userId, user);
            this.currentUserId = userId;
            
            return {
                success: true,
                data: {
                    userId,
                    bmr,
                    tdee,
                    macroRatios
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Generate diet plan
    async generateDietPlan(userId, preferences = {}) {
        await this.simulateDelay();
        
        try {
            const user = this.users.get(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const planId = this.generateId('plan');
            
            // Calculate calorie target based on goal
            let dailyCalories = user.tdee;
            switch (user.primaryGoal) {
                case 'weight_loss':
                    dailyCalories = Math.round(user.tdee * 0.8);
                    break;
                case 'weight_gain':
                    dailyCalories = Math.round(user.tdee * 1.2);
                    break;
                case 'muscle_gain':
                    dailyCalories = Math.round(user.tdee * 1.15);
                    break;
                default:
                    dailyCalories = user.tdee;
            }

            // Calculate macro targets
            const macroTargets = {
                protein: Math.round((dailyCalories * user.macroRatios.protein / 100) / 4),
                carbs: Math.round((dailyCalories * user.macroRatios.carbs / 100) / 4),
                fats: Math.round((dailyCalories * user.macroRatios.fats / 100) / 9)
            };

            // Generate weekly meal plan
            const weeklyPlan = this.generateWeeklyMealPlan(dailyCalories, macroTargets, user);
            
            const dietPlan = {
                id: planId,
                userId,
                name: `${user.primaryGoal.replace('_', ' ').toUpperCase()} Plan`,
                description: `Personalized diet plan for ${user.primaryGoal.replace('_', ' ')}`,
                goals: {
                    primaryGoal: user.primaryGoal,
                    targetWeight: user.targetWeight,
                    timeframe: user.timeframe,
                    dailyCalories,
                    macroTargets
                },
                weeklyPlan,
                shoppingList: this.generateShoppingList(weeklyPlan),
                createdAt: new Date().toISOString()
            };

            this.dietPlans.set(planId, dietPlan);
            this.currentPlanId = planId;

            return {
                success: true,
                data: dietPlan
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Generate weekly meal plan
    generateWeeklyMealPlan(dailyCalories, macroTargets, user) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const weeklyPlan = [];

        days.forEach(day => {
            const dayPlan = {
                day,
                meals: {
                    breakfast: this.selectMeal('breakfast', dailyCalories * 0.25),
                    lunch: this.selectMeal('lunch', dailyCalories * 0.35),
                    dinner: this.selectMeal('dinner', dailyCalories * 0.3),
                    snack: this.selectMeal('snack', dailyCalories * 0.1)
                }
            };
            weeklyPlan.push(dayPlan);
        });

        return weeklyPlan;
    }

    // Select meal based on type and target calories
    selectMeal(mealType, targetCalories) {
        const availableMeals = DEMO_MEALS[mealType] || [];
        const selectedMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
        
        if (!selectedMeal) {
            return {
                name: `Sample ${mealType}`,
                foods: [],
                nutrition: { calories: 0, protein: 0, carbs: 0, fats: 0 }
            };
        }

        // Calculate nutrition for the meal
        let totalNutrition = { calories: 0, protein: 0, carbs: 0, fats: 0 };
        
        const mealFoods = selectedMeal.foods.map(food => {
            const foodData = DEMO_FOODS.find(f => f.id === food.foodId);
            if (foodData) {
                const multiplier = food.quantity / 100;
                const nutrition = {
                    calories: Math.round(foodData.calories * multiplier),
                    protein: Math.round(foodData.protein * multiplier * 10) / 10,
                    carbs: Math.round(foodData.carbs * multiplier * 10) / 10,
                    fats: Math.round(foodData.fats * multiplier * 10) / 10
                };
                
                totalNutrition.calories += nutrition.calories;
                totalNutrition.protein += nutrition.protein;
                totalNutrition.carbs += nutrition.carbs;
                totalNutrition.fats += nutrition.fats;
                
                return {
                    name: food.name,
                    quantity: food.quantity,
                    unit: 'g',
                    nutrition
                };
            }
            return null;
        }).filter(Boolean);

        return {
            name: selectedMeal.name,
            foods: mealFoods,
            nutrition: {
                calories: Math.round(totalNutrition.calories),
                protein: Math.round(totalNutrition.protein * 10) / 10,
                carbs: Math.round(totalNutrition.carbs * 10) / 10,
                fats: Math.round(totalNutrition.fats * 10) / 10
            },
            instructions: [`Prepare ${mealFoods.map(f => f.name).join(', ')}`],
            prepTime: Math.floor(Math.random() * 20) + 10,
            cookTime: Math.floor(Math.random() * 30) + 10
        };
    }

    // Generate shopping list
    generateShoppingList(weeklyPlan) {
        const shoppingItems = new Map();
        
        weeklyPlan.forEach(day => {
            Object.values(day.meals).forEach(meal => {
                meal.foods.forEach(food => {
                    if (shoppingItems.has(food.name)) {
                        shoppingItems.get(food.name).quantity += food.quantity;
                    } else {
                        shoppingItems.set(food.name, {
                            name: food.name,
                            quantity: food.quantity,
                            unit: food.unit,
                            category: 'General'
                        });
                    }
                });
            });
        });
        
        return Array.from(shoppingItems.values());
    }

    // Get diet plan
    async getDietPlan(planId) {
        await this.simulateDelay();
        
        const plan = this.dietPlans.get(planId);
        if (!plan) {
            return {
                success: false,
                error: 'Diet plan not found'
            };
        }

        return {
            success: true,
            data: plan
        };
    }

    // Health check
    async healthCheck() {
        return {
            success: true,
            data: {
                status: 'healthy',
                mode: 'demo',
                timestamp: new Date().toISOString()
            }
        };
    }
}

// Create global demo backend instance
window.demoBackend = new DemoBackend();

// Override API functions for demo mode
if (DEMO_CONFIG.enableDemo) {
    console.log('🎯 DEMO MODE ENABLED - Using simulated backend');
    
    // Override the API client for demo
    window.originalAPIClient = window.apiClient;
    
    window.apiClient = {
        makeRequest: async (endpoint, options = {}) => {
            console.log('🎭 Demo API Request:', endpoint, options);
            
            try {
                let response;
                
                // Route to appropriate demo backend method
                if (endpoint === '/api/user' && options.method === 'POST') {
                    const userData = JSON.parse(options.body);
                    response = await window.demoBackend.createUser(userData);
                } else if (endpoint === '/api/generate' && options.method === 'POST') {
                    const requestData = JSON.parse(options.body);
                    response = await window.demoBackend.generateDietPlan(requestData.userId, requestData.preferences);
                } else if (endpoint.startsWith('/api/plan/')) {
                    const planId = endpoint.split('/').pop();
                    response = await window.demoBackend.getDietPlan(planId);
                } else if (endpoint === '/api/health') {
                    response = await window.demoBackend.healthCheck();
                } else {
                    // Default response for unhandled endpoints
                    response = {
                        success: true,
                        data: { message: 'Demo endpoint response' }
                    };
                }
                
                console.log('🎭 Demo API Response:', response);
                return response;
                
            } catch (error) {
                console.error('🚨 Demo API Error:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },
        
        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms))
    };
    
    // Show demo mode indicator and ensure proper initialization
    document.addEventListener('DOMContentLoaded', () => {
        const demoIndicator = document.createElement('div');
        demoIndicator.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: #ff6b6b;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                animation: pulse 2s infinite;
            ">
                🎯 DEMO MODE
            </div>
            <style>
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(demoIndicator);
        
        // Ensure loading overlay is hidden in demo mode
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay && loadingOverlay.style.display !== 'none') {
                loadingOverlay.style.display = 'none';
                console.log('🎯 Demo mode: Loading overlay hidden');
            }
        }, 2000);
    });
}

console.log('✅ Demo Backend Loaded Successfully');