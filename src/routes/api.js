/* ====================================
   DIET PLANNER API ROUTES
   Main API endpoints for diet plan generation
   ==================================== */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../database/User');
const DietPlan = require('../database/DietPlan');
const Food = require('../database/Food');

// Rate limiting for diet plan generation
const dietPlanLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 diet plan requests per windowMs
    message: {
        error: 'Too many diet plan requests, please try again later.',
        retryAfter: 900 // 15 minutes in seconds
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to POST routes
router.use('/generate', dietPlanLimit);

/* ====================================
   USER MANAGEMENT ROUTES
   ==================================== */

// Create or update user profile
router.post('/user', async (req, res) => {
    try {
        const userData = req.body;
        
        // Check if user exists (by email if provided)
        let user;
        if (userData.email) {
            user = await User.findOne({ email: userData.email });
        }
        
        if (user) {
            // Update existing user
            Object.assign(user, userData);
            await user.save();
        } else {
            // Create new user
            user = new User(userData);
            await user.save();
        }
        
        res.status(200).json({
            success: true,
            message: 'User profile saved successfully',
            data: {
                userId: user._id,
                bmr: user.calculateBMR(),
                tdee: user.calculateTDEE(),
                macroRatios: user.calculateMacroRatios()
            }
        });
        
    } catch (error) {
        console.error('Error saving user:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.keys(error.errors).map(key => ({
                    field: key,
                    message: error.errors[key].message
                }))
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error saving user profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get user profile
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
        
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile'
        });
    }
});

/* ====================================
   DIET PLAN GENERATION ROUTES
   ==================================== */

// Generate new diet plan
router.post('/generate', async (req, res) => {
    try {
        const { userId, preferences = {} } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        
        // Get user data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Generate diet plan
        const dietPlan = await generatePersonalizedDietPlan(user, preferences);
        
        res.status(200).json({
            success: true,
            message: 'Diet plan generated successfully',
            data: dietPlan
        });
        
    } catch (error) {
        console.error('Error generating diet plan:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating diet plan',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get existing diet plan
router.get('/plan/:planId', async (req, res) => {
    try {
        const dietPlan = await DietPlan.findById(req.params.planId)
            .populate('userId', 'name email');
        
        if (!dietPlan) {
            return res.status(404).json({
                success: false,
                message: 'Diet plan not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: dietPlan
        });
        
    } catch (error) {
        console.error('Error fetching diet plan:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching diet plan'
        });
    }
});

// Get user's diet plans
router.get('/user/:userId/plans', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        const dietPlans = await DietPlan.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('userId', 'name email');
        
        const total = await DietPlan.countDocuments({ userId: req.params.userId });
        
        res.status(200).json({
            success: true,
            data: {
                plans: dietPlans,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total: total
            }
        });
        
    } catch (error) {
        console.error('Error fetching user diet plans:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching diet plans'
        });
    }
});

/* ====================================
   FOOD DATABASE ROUTES
   ==================================== */

// Search foods
router.get('/foods/search', async (req, res) => {
    try {
        const { q, category, diet, limit = 20 } = req.query;
        
        let foods;
        
        if (q) {
            foods = await Food.searchByName(q).limit(parseInt(limit));
        } else if (category) {
            foods = await Food.findByCategory(category).limit(parseInt(limit));
        } else if (diet) {
            foods = await Food.findForDiet(diet).limit(parseInt(limit));
        } else {
            foods = await Food.getPopularFoods(parseInt(limit));
        }
        
        res.status(200).json({
            success: true,
            data: foods
        });
        
    } catch (error) {
        console.error('Error searching foods:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching foods'
        });
    }
});

// Get food by ID
router.get('/foods/:foodId', async (req, res) => {
    try {
        const food = await Food.findById(req.params.foodId);
        
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: food
        });
        
    } catch (error) {
        console.error('Error fetching food:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching food'
        });
    }
});

// Get food categories
router.get('/foods/categories', async (req, res) => {
    try {
        const categories = await Food.distinct('category');
        
        res.status(200).json({
            success: true,
            data: categories
        });
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
});

/* ====================================
   MEAL PLANNING HELPER ROUTES
   ==================================== */

// Get meal suggestions for specific criteria
router.post('/meals/suggestions', async (req, res) => {
    try {
        const {
            mealType, // breakfast, lunch, dinner, snack
            targetCalories,
            dietType,
            allergies = [],
            preferences = {}
        } = req.body;
        
        const suggestions = await generateMealSuggestions({
            mealType,
            targetCalories,
            dietType,
            allergies,
            preferences
        });
        
        res.status(200).json({
            success: true,
            data: suggestions
        });
        
    } catch (error) {
        console.error('Error generating meal suggestions:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating meal suggestions'
        });
    }
});

// Calculate nutrition for custom meal
router.post('/meals/calculate', async (req, res) => {
    try {
        const { foods } = req.body; // Array of {foodId, quantity, unit}
        
        if (!foods || !Array.isArray(foods)) {
            return res.status(400).json({
                success: false,
                message: 'Foods array is required'
            });
        }
        
        let totalNutrition = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: 0,
            sodium: 0
        };
        
        const foodDetails = [];
        
        for (const foodItem of foods) {
            const food = await Food.findById(foodItem.foodId);
            if (food) {
                const nutrition = food.calculateNutritionForQuantity(
                    foodItem.quantity,
                    foodItem.unit || 'g'
                );
                
                totalNutrition.calories += nutrition.calories;
                totalNutrition.protein += nutrition.protein;
                totalNutrition.carbs += nutrition.carbs;
                totalNutrition.fats += nutrition.fats;
                totalNutrition.fiber += nutrition.fiber;
                totalNutrition.sodium += nutrition.sodium;
                
                foodDetails.push({
                    food: food.name,
                    quantity: foodItem.quantity,
                    unit: foodItem.unit || 'g',
                    nutrition: nutrition
                });
            }
        }
        
        res.status(200).json({
            success: true,
            data: {
                totalNutrition: {
                    calories: Math.round(totalNutrition.calories),
                    protein: Math.round(totalNutrition.protein * 10) / 10,
                    carbs: Math.round(totalNutrition.carbs * 10) / 10,
                    fats: Math.round(totalNutrition.fats * 10) / 10,
                    fiber: Math.round(totalNutrition.fiber * 10) / 10,
                    sodium: Math.round(totalNutrition.sodium)
                },
                foodDetails: foodDetails
            }
        });
        
    } catch (error) {
        console.error('Error calculating meal nutrition:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating meal nutrition'
        });
    }
});

/* ====================================
   HELPER FUNCTIONS
   ==================================== */

async function generatePersonalizedDietPlan(user, preferences) {
    try {
        // Calculate user's nutritional needs
        const bmr = user.calculateBMR();
        const tdee = user.calculateTDEE();
        const macroRatios = user.calculateMacroRatios();
        
        // Determine calorie target based on goal
        let dailyCalories = tdee;
        switch (user.goals.primaryGoal) {
            case 'weight_loss':
                dailyCalories = Math.round(tdee * 0.8); // 20% deficit
                break;
            case 'weight_gain':
                dailyCalories = Math.round(tdee * 1.2); // 20% surplus
                break;
            case 'muscle_gain':
                dailyCalories = Math.round(tdee * 1.15); // 15% surplus
                break;
            default:
                dailyCalories = tdee; // maintenance
        }
        
        // Calculate macro targets
        const macroTargets = {
            protein: Math.round((dailyCalories * macroRatios.protein / 100) / 4),
            carbs: Math.round((dailyCalories * macroRatios.carbs / 100) / 4),
            fats: Math.round((dailyCalories * macroRatios.fats / 100) / 9)
        };
        
        // Generate weekly meal plan
        const weeklyPlan = await generateWeeklyMealPlan(user, dailyCalories, macroTargets);
        
        // Create shopping list
        const shoppingList = generateShoppingList(weeklyPlan);
        
        // Create and save diet plan
        const dietPlan = new DietPlan({
            userId: user._id,
            name: `${user.goals.primaryGoal.replace('_', ' ').toUpperCase()} Plan`,
            description: `Personalized diet plan for ${user.goals.primaryGoal.replace('_', ' ')}`,
            goals: {
                primaryGoal: user.goals.primaryGoal,
                targetWeight: user.goals.targetWeight,
                timeframe: user.goals.timeframe,
                dailyCalories: dailyCalories,
                macroTargets: macroTargets
            },
            weeklyPlan: weeklyPlan,
            shoppingList: shoppingList,
            nutritionSummary: calculateWeeklyNutrition(weeklyPlan),
            preferences: {
                dietType: user.dietaryPreferences.dietType,
                allergies: user.dietaryPreferences.allergies,
                dislikes: user.dietaryPreferences.dislikes,
                mealsPerDay: preferences.mealsPerDay || 3,
                snacksPerDay: preferences.snacksPerDay || 1
            }
        });
        
        await dietPlan.save();
        return dietPlan;
        
    } catch (error) {
        console.error('Error generating personalized diet plan:', error);
        throw new Error('Failed to generate diet plan');
    }
}

async function generateWeeklyMealPlan(user, dailyCalories, macroTargets) {
    const weeklyPlan = [];
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    for (const day of daysOfWeek) {
        const dayPlan = {
            day: day,
            meals: {
                breakfast: await generateMeal('breakfast', dailyCalories * 0.25, macroTargets, user),
                lunch: await generateMeal('lunch', dailyCalories * 0.35, macroTargets, user),
                dinner: await generateMeal('dinner', dailyCalories * 0.3, macroTargets, user),
                snacks: await generateMeal('snack', dailyCalories * 0.1, macroTargets, user)
            }
        };
        
        weeklyPlan.push(dayPlan);
    }
    
    return weeklyPlan;
}

async function generateMeal(mealType, targetCalories, macroTargets, user) {
    try {
        // Get suitable foods based on diet type and restrictions
        let query = { 'metadata.isActive': true };
        
        // Apply diet restrictions
        if (user.dietaryPreferences.dietType !== 'none') {
            switch (user.dietaryPreferences.dietType) {
                case 'vegetarian':
                    query['dietaryInfo.isVegetarian'] = true;
                    break;
                case 'vegan':
                    query['dietaryInfo.isVegan'] = true;
                    break;
                case 'keto':
                    query['dietaryInfo.isKeto'] = true;
                    break;
                case 'paleo':
                    query['dietaryInfo.isPaleo'] = true;
                    break;
            }
        }
        
        // Exclude allergens
        if (user.dietaryPreferences.allergies.length > 0) {
            query.allergens = { $nin: user.dietaryPreferences.allergies };
        }
        
        // Get appropriate foods for meal type
        const foods = await Food.find(query)
            .sort({ 'stats.popularityScore': -1 })
            .limit(100);
        
        // Simple meal generation algorithm
        const selectedFoods = [];
        let currentCalories = 0;
        
        // Filter foods appropriate for meal type
        const mealAppropriatefoods = foods.filter(food => {
            const commonUses = food.cuisineInfo.commonUses || [];
            return commonUses.includes(mealType) || commonUses.length === 0;
        });
        
        // Select 2-4 foods for the meal
        const numFoods = Math.floor(Math.random() * 3) + 2; // 2-4 foods
        const availableFoods = [...mealAppropriatefoods];
        
        for (let i = 0; i < numFoods && availableFoods.length > 0 && currentCalories < targetCalories; i++) {
            const randomIndex = Math.floor(Math.random() * availableFoods.length);
            const selectedFood = availableFoods.splice(randomIndex, 1)[0];
            
            // Calculate appropriate quantity
            const remainingCalories = targetCalories - currentCalories;
            const maxQuantity = Math.floor((remainingCalories / selectedFood.nutrition.calories) * 100);
            const quantity = Math.min(maxQuantity, Math.floor(Math.random() * 150) + 50); // 50-200g
            
            if (quantity > 0) {
                const nutrition = selectedFood.calculateNutritionForQuantity(quantity);
                currentCalories += nutrition.calories;
                
                selectedFoods.push({
                    foodId: selectedFood._id,
                    name: selectedFood.name,
                    quantity: quantity,
                    unit: 'g',
                    nutrition: nutrition
                });
            }
        }
        
        return {
            name: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} ${Math.floor(Math.random() * 1000)}`,
            foods: selectedFoods,
            totalNutrition: selectedFoods.reduce((total, food) => ({
                calories: total.calories + food.nutrition.calories,
                protein: total.protein + food.nutrition.protein,
                carbs: total.carbs + food.nutrition.carbs,
                fats: total.fats + food.nutrition.fats,
                fiber: total.fiber + food.nutrition.fiber,
                sodium: total.sodium + food.nutrition.sodium
            }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sodium: 0 }),
            instructions: [`Prepare ${selectedFoods.map(f => f.name).join(', ')}`],
            prepTime: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
            cookTime: Math.floor(Math.random() * 30) + 5   // 5-35 minutes
        };
        
    } catch (error) {
        console.error('Error generating meal:', error);
        // Return a simple fallback meal
        return {
            name: `Simple ${mealType}`,
            foods: [],
            totalNutrition: { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sodium: 0 },
            instructions: ['Meal generation failed - please customize'],
            prepTime: 15,
            cookTime: 15
        };
    }
}

async function generateMealSuggestions(criteria) {
    // Implementation for meal suggestions based on criteria
    const { mealType, targetCalories, dietType, allergies, preferences } = criteria;
    
    let query = { 'metadata.isActive': true };
    
    // Apply dietary restrictions
    if (dietType && dietType !== 'none') {
        query[`dietaryInfo.is${dietType.charAt(0).toUpperCase() + dietType.slice(1)}`] = true;
    }
    
    // Exclude allergens
    if (allergies.length > 0) {
        query.allergens = { $nin: allergies };
    }
    
    const foods = await Food.find(query)
        .sort({ 'stats.popularityScore': -1 })
        .limit(20);
    
    return foods.map(food => ({
        id: food._id,
        name: food.name,
        category: food.category,
        nutrition: food.nutrition,
        suitability: calculateSuitabilityScore(food, criteria)
    }));
}

function calculateSuitabilityScore(food, criteria) {
    let score = 50; // Base score
    
    // Adjust based on meal type appropriateness
    if (food.cuisineInfo.commonUses && food.cuisineInfo.commonUses.includes(criteria.mealType)) {
        score += 20;
    }
    
    // Adjust based on calorie density
    const caloriesPerGram = food.nutrition.calories / 100;
    const idealCaloriesPerGram = criteria.targetCalories / 300; // Assuming 300g meal
    const calorieDifference = Math.abs(caloriesPerGram - idealCaloriesPerGram);
    score -= calorieDifference * 10;
    
    // Adjust based on popularity
    score += (food.stats.popularityScore || 50) * 0.3;
    
    return Math.max(0, Math.min(100, Math.round(score)));
}

function generateShoppingList(weeklyPlan) {
    const shoppingList = {};
    
    weeklyPlan.forEach(day => {
        Object.values(day.meals).forEach(meal => {
            meal.foods.forEach(food => {
                if (shoppingList[food.name]) {
                    shoppingList[food.name].quantity += food.quantity;
                } else {
                    shoppingList[food.name] = {
                        foodId: food.foodId,
                        quantity: food.quantity,
                        unit: food.unit,
                        category: 'general'
                    };
                }
            });
        });
    });
    
    return Object.keys(shoppingList).map(name => ({
        name,
        ...shoppingList[name]
    }));
}

function calculateWeeklyNutrition(weeklyPlan) {
    let totalNutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        sodium: 0
    };
    
    weeklyPlan.forEach(day => {
        Object.values(day.meals).forEach(meal => {
            totalNutrition.calories += meal.totalNutrition.calories;
            totalNutrition.protein += meal.totalNutrition.protein;
            totalNutrition.carbs += meal.totalNutrition.carbs;
            totalNutrition.fats += meal.totalNutrition.fats;
            totalNutrition.fiber += meal.totalNutrition.fiber;
            totalNutrition.sodium += meal.totalNutrition.sodium;
        });
    });
    
    return {
        weekly: totalNutrition,
        daily: {
            calories: Math.round(totalNutrition.calories / 7),
            protein: Math.round(totalNutrition.protein / 7),
            carbs: Math.round(totalNutrition.carbs / 7),
            fats: Math.round(totalNutrition.fats / 7),
            fiber: Math.round(totalNutrition.fiber / 7),
            sodium: Math.round(totalNutrition.sodium / 7)
        }
    };
}

module.exports = router;