/* ====================================
   DIET PLAN MODEL
   Database schema for generated diet plans
   ==================================== */

const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
    // Reference to user
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },

    // Plan identification
    planId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },

    // Plan metadata
    planInfo: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            maxlength: 500
        },
        duration: {
            type: Number,
            required: true,
            min: 1,
            max: 365 // days
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            enum: ['weight_loss', 'weight_gain', 'muscle_building', 'maintenance'],
            required: true
        }
    },

    // Nutritional targets
    nutritionalTargets: {
        dailyCalories: {
            type: Number,
            required: true,
            min: 800,
            max: 5000
        },
        macros: {
            protein: {
                grams: { type: Number, required: true, min: 0 },
                calories: { type: Number, required: true, min: 0 },
                percentage: { type: Number, required: true, min: 0, max: 100 }
            },
            carbs: {
                grams: { type: Number, required: true, min: 0 },
                calories: { type: Number, required: true, min: 0 },
                percentage: { type: Number, required: true, min: 0, max: 100 }
            },
            fats: {
                grams: { type: Number, required: true, min: 0 },
                calories: { type: Number, required: true, min: 0 },
                percentage: { type: Number, required: true, min: 0, max: 100 }
            }
        },
        fiber: {
            type: Number,
            min: 0,
            max: 100
        },
        sodium: {
            type: Number,
            min: 0,
            max: 10000
        },
        water: {
            type: Number,
            min: 1,
            max: 10,
            default: 2.5
        }
    },

    // Weekly meal plan (7 days)
    weeklyMealPlan: [{
        day: {
            type: Number,
            required: true,
            min: 1,
            max: 7
        },
        dayName: {
            type: String,
            required: true,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        meals: {
            breakfast: {
                name: { type: String, required: true },
                description: String,
                ingredients: [{
                    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
                    name: { type: String, required: true },
                    quantity: { type: Number, required: true, min: 0 },
                    unit: { type: String, required: true },
                    calories: { type: Number, required: true, min: 0 }
                }],
                instructions: [String],
                prepTime: { type: Number, min: 0 }, // minutes
                cookTime: { type: Number, min: 0 }, // minutes
                servings: { type: Number, min: 1, default: 1 },
                nutrition: {
                    calories: { type: Number, required: true, min: 0 },
                    protein: { type: Number, required: true, min: 0 },
                    carbs: { type: Number, required: true, min: 0 },
                    fats: { type: Number, required: true, min: 0 },
                    fiber: { type: Number, min: 0 },
                    sodium: { type: Number, min: 0 }
                },
                timing: String, // e.g., "7:00-8:00 AM"
                tags: [String]
            },
            midMorningSnack: {
                name: String,
                description: String,
                ingredients: [{
                    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
                    name: { type: String, required: true },
                    quantity: { type: Number, required: true, min: 0 },
                    unit: { type: String, required: true },
                    calories: { type: Number, required: true, min: 0 }
                }],
                instructions: [String],
                prepTime: { type: Number, min: 0 },
                nutrition: {
                    calories: { type: Number, min: 0 },
                    protein: { type: Number, min: 0 },
                    carbs: { type: Number, min: 0 },
                    fats: { type: Number, min: 0 }
                },
                timing: String,
                tags: [String]
            },
            lunch: {
                name: { type: String, required: true },
                description: String,
                ingredients: [{
                    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
                    name: { type: String, required: true },
                    quantity: { type: Number, required: true, min: 0 },
                    unit: { type: String, required: true },
                    calories: { type: Number, required: true, min: 0 }
                }],
                instructions: [String],
                prepTime: { type: Number, min: 0 },
                cookTime: { type: Number, min: 0 },
                servings: { type: Number, min: 1, default: 1 },
                nutrition: {
                    calories: { type: Number, required: true, min: 0 },
                    protein: { type: Number, required: true, min: 0 },
                    carbs: { type: Number, required: true, min: 0 },
                    fats: { type: Number, required: true, min: 0 },
                    fiber: { type: Number, min: 0 },
                    sodium: { type: Number, min: 0 }
                },
                timing: String,
                tags: [String]
            },
            eveningSnack: {
                name: String,
                description: String,
                ingredients: [{
                    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
                    name: { type: String, required: true },
                    quantity: { type: Number, required: true, min: 0 },
                    unit: { type: String, required: true },
                    calories: { type: Number, required: true, min: 0 }
                }],
                instructions: [String],
                prepTime: { type: Number, min: 0 },
                nutrition: {
                    calories: { type: Number, min: 0 },
                    protein: { type: Number, min: 0 },
                    carbs: { type: Number, min: 0 },
                    fats: { type: Number, min: 0 }
                },
                timing: String,
                tags: [String]
            },
            dinner: {
                name: { type: String, required: true },
                description: String,
                ingredients: [{
                    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
                    name: { type: String, required: true },
                    quantity: { type: Number, required: true, min: 0 },
                    unit: { type: String, required: true },
                    calories: { type: Number, required: true, min: 0 }
                }],
                instructions: [String],
                prepTime: { type: Number, min: 0 },
                cookTime: { type: Number, min: 0 },
                servings: { type: Number, min: 1, default: 1 },
                nutrition: {
                    calories: { type: Number, required: true, min: 0 },
                    protein: { type: Number, required: true, min: 0 },
                    carbs: { type: Number, required: true, min: 0 },
                    fats: { type: Number, required: true, min: 0 },
                    fiber: { type: Number, min: 0 },
                    sodium: { type: Number, min: 0 }
                },
                timing: String,
                tags: [String]
            }
        },
        dailyTotals: {
            calories: { type: Number, required: true, min: 0 },
            protein: { type: Number, required: true, min: 0 },
            carbs: { type: Number, required: true, min: 0 },
            fats: { type: Number, required: true, min: 0 },
            fiber: { type: Number, min: 0 },
            sodium: { type: Number, min: 0 }
        }
    }],

    // Shopping list
    shoppingList: {
        categories: [{
            name: { type: String, required: true },
            items: [{
                name: { type: String, required: true },
                quantity: { type: Number, required: true, min: 0 },
                unit: { type: String, required: true },
                estimatedCost: { type: Number, min: 0 },
                notes: String,
                alternatives: [String]
            }]
        }],
        totalEstimatedCost: { type: Number, min: 0 },
        notes: String
    },

    // Hydration and supplements
    supplementaryInfo: {
        hydration: {
            dailyWaterGoal: { type: Number, min: 0, default: 2.5 },
            schedule: [String], // e.g., ["Wake up: 1 glass", "Before meals: 1 glass"]
            tips: [String]
        },
        supplements: [{
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            timing: { type: String, required: true },
            purpose: String,
            optional: { type: Boolean, default: true },
            notes: String
        }]
    },

    // Exercise recommendations
    exerciseRecommendations: {
        weeklySchedule: [{
            day: String,
            type: String, // cardio, strength, flexibility, rest
            duration: Number, // minutes
            intensity: String, // low, moderate, high
            description: String,
            exercises: [String]
        }],
        generalTips: [String],
        restDays: Number
    },

    // Progress tracking template
    progressTracking: {
        measurements: [{
            type: String, // weight, waist, hip, body_fat
            frequency: String, // daily, weekly, bi-weekly
            unit: String,
            targetChange: Number
        }],
        photos: {
            recommended: Boolean,
            frequency: String,
            angles: [String]
        },
        journaling: {
            recommended: Boolean,
            prompts: [String]
        }
    },

    // PDF generation info
    pdfInfo: {
        generated: { type: Boolean, default: false },
        generatedAt: Date,
        filePath: String,
        fileName: String,
        fileSize: Number,
        downloadCount: { type: Number, default: 0 },
        lastDownloaded: Date
    },

    // Plan status and metadata
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'active'
    },

    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        version: { type: String, default: '1.0' },
        generatedBy: { type: String, default: 'system' },
        customizations: [String],
        feedback: {
            rating: { type: Number, min: 1, max: 5 },
            comments: String,
            submittedAt: Date
        }
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
dietPlanSchema.index({ userId: 1 });
dietPlanSchema.index({ planId: 1 });
dietPlanSchema.index({ 'planInfo.type': 1 });
dietPlanSchema.index({ status: 1 });
dietPlanSchema.index({ 'metadata.createdAt': -1 });
dietPlanSchema.index({ 'planInfo.startDate': 1, 'planInfo.endDate': 1 });

// Virtual for plan duration in days
dietPlanSchema.virtual('durationInDays').get(function() {
    if (this.planInfo.endDate && this.planInfo.startDate) {
        const diffTime = Math.abs(this.planInfo.endDate - this.planInfo.startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return this.planInfo.duration || 7;
});

// Virtual for average daily calories
dietPlanSchema.virtual('averageDailyCalories').get(function() {
    if (this.weeklyMealPlan && this.weeklyMealPlan.length > 0) {
        const totalCalories = this.weeklyMealPlan.reduce((sum, day) => sum + day.dailyTotals.calories, 0);
        return Math.round(totalCalories / this.weeklyMealPlan.length);
    }
    return this.nutritionalTargets.dailyCalories;
});

// Virtual for plan completion percentage
dietPlanSchema.virtual('completionPercentage').get(function() {
    const now = new Date();
    const start = this.planInfo.startDate;
    const end = this.planInfo.endDate;
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const totalDuration = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / totalDuration) * 100);
});

// Pre-save middleware
dietPlanSchema.pre('save', function(next) {
    this.metadata.updatedAt = new Date();
    
    // Auto-generate planId if not exists
    if (!this.planId) {
        this.planId = `plan_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    }
    
    // Set end date based on duration
    if (this.planInfo.duration && this.planInfo.startDate && !this.planInfo.endDate) {
        this.planInfo.endDate = new Date(this.planInfo.startDate.getTime() + (this.planInfo.duration * 24 * 60 * 60 * 1000));
    }
    
    next();
});

// Instance methods
dietPlanSchema.methods.calculateTotalCost = function() {
    if (this.shoppingList && this.shoppingList.categories) {
        let total = 0;
        this.shoppingList.categories.forEach(category => {
            category.items.forEach(item => {
                if (item.estimatedCost) {
                    total += item.estimatedCost;
                }
            });
        });
        this.shoppingList.totalEstimatedCost = Math.round(total * 100) / 100;
        return this.shoppingList.totalEstimatedCost;
    }
    return 0;
};

dietPlanSchema.methods.getDayMealPlan = function(dayNumber) {
    return this.weeklyMealPlan.find(day => day.day === dayNumber);
};

dietPlanSchema.methods.updateDownloadCount = function() {
    this.pdfInfo.downloadCount += 1;
    this.pdfInfo.lastDownloaded = new Date();
    return this.save();
};

dietPlanSchema.methods.addFeedback = function(rating, comments) {
    this.metadata.feedback = {
        rating: rating,
        comments: comments,
        submittedAt: new Date()
    };
    return this.save();
};

dietPlanSchema.methods.getWeeklyNutritionSummary = function() {
    if (!this.weeklyMealPlan || this.weeklyMealPlan.length === 0) {
        return null;
    }
    
    const totals = this.weeklyMealPlan.reduce((acc, day) => {
        acc.calories += day.dailyTotals.calories;
        acc.protein += day.dailyTotals.protein;
        acc.carbs += day.dailyTotals.carbs;
        acc.fats += day.dailyTotals.fats;
        acc.fiber += day.dailyTotals.fiber || 0;
        acc.sodium += day.dailyTotals.sodium || 0;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sodium: 0 });
    
    const days = this.weeklyMealPlan.length;
    
    return {
        weekly: totals,
        daily: {
            calories: Math.round(totals.calories / days),
            protein: Math.round((totals.protein / days) * 10) / 10,
            carbs: Math.round((totals.carbs / days) * 10) / 10,
            fats: Math.round((totals.fats / days) * 10) / 10,
            fiber: Math.round((totals.fiber / days) * 10) / 10,
            sodium: Math.round(totals.sodium / days)
        }
    };
};

// Static methods
dietPlanSchema.statics.findByPlanId = function(planId) {
    return this.findOne({ planId: planId });
};

dietPlanSchema.statics.findByUserId = function(userId) {
    return this.find({ userId: userId }).sort({ 'metadata.createdAt': -1 });
};

dietPlanSchema.statics.findActivePlans = function() {
    return this.find({ status: 'active' });
};

dietPlanSchema.statics.findPlansByType = function(type) {
    return this.find({ 'planInfo.type': type, status: 'active' });
};

dietPlanSchema.statics.getPopularMeals = function() {
    return this.aggregate([
        { $match: { status: 'active' } },
        { $unwind: '$weeklyMealPlan' },
        { $project: {
            breakfast: '$weeklyMealPlan.meals.breakfast.name',
            lunch: '$weeklyMealPlan.meals.lunch.name',
            dinner: '$weeklyMealPlan.meals.dinner.name'
        }},
        { $group: {
            _id: null,
            breakfastMeals: { $addToSet: '$breakfast' },
            lunchMeals: { $addToSet: '$lunch' },
            dinnerMeals: { $addToSet: '$dinner' }
        }}
    ]);
};

// Export the model
module.exports = mongoose.model('DietPlan', dietPlanSchema);