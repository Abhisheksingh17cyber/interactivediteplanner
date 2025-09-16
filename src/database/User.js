/* ====================================
   USER MODEL
   Database schema for user information
   ==================================== */

const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    // Personal Information
    personalInfo: {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: [2, 'Full name must be at least 2 characters'],
            maxlength: [100, 'Full name cannot exceed 100 characters']
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [18, 'Age must be at least 18'],
            max: [100, 'Age cannot exceed 100']
        },
        gender: {
            type: String,
            required: [true, 'Gender is required'],
            enum: ['male', 'female', 'other']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        phone: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || validator.isMobilePhone(v, 'any');
                },
                message: 'Please provide a valid phone number'
            }
        }
    },

    // Physical Measurements
    physicalData: {
        currentWeight: {
            type: Number,
            required: [true, 'Current weight is required'],
            min: [30, 'Weight must be at least 30'],
            max: [500, 'Weight cannot exceed 500']
        },
        weightUnit: {
            type: String,
            enum: ['kg', 'lbs'],
            default: 'kg'
        },
        height: {
            type: Number,
            required: [true, 'Height is required'],
            min: [100, 'Height must be at least 100'],
            max: [300, 'Height cannot exceed 300']
        },
        heightUnit: {
            type: String,
            enum: ['cm', 'ft'],
            default: 'cm'
        },
        bodyFat: {
            type: Number,
            min: [5, 'Body fat percentage must be at least 5%'],
            max: [50, 'Body fat percentage cannot exceed 50%']
        },
        waistCircumference: {
            type: Number,
            min: [50, 'Waist circumference must be at least 50cm'],
            max: [200, 'Waist circumference cannot exceed 200cm']
        },
        hipCircumference: {
            type: Number,
            min: [50, 'Hip circumference must be at least 50cm'],
            max: [200, 'Hip circumference cannot exceed 200cm']
        }
    },

    // Goals and Timeline
    goals: {
        primaryGoal: {
            type: String,
            required: [true, 'Primary goal is required'],
            enum: ['weight_loss', 'weight_gain', 'muscle_building', 'maintenance']
        },
        targetWeight: {
            type: Number,
            min: [30, 'Target weight must be at least 30'],
            max: [500, 'Target weight cannot exceed 500']
        },
        timeline: {
            type: String,
            required: [true, 'Timeline is required'],
            enum: ['1_month', '3_months', '6_months', '1_year']
        },
        activityLevel: {
            type: String,
            required: [true, 'Activity level is required'],
            enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']
        }
    },

    // Dietary Preferences
    dietaryPreferences: {
        dietType: {
            type: String,
            required: [true, 'Diet type is required'],
            enum: ['non_vegetarian', 'vegetarian', 'vegan', 'keto', 'mediterranean', 'paleo', 'intermittent_fasting']
        },
        mealFrequency: {
            type: String,
            required: [true, 'Meal frequency is required'],
            enum: ['3_meals', '4_meals', '5_meals']
        },
        foodAllergies: [{
            type: String,
            enum: ['dairy', 'gluten', 'nuts', 'seafood', 'eggs', 'soy']
        }],
        foodsToAvoid: {
            type: String,
            maxlength: [500, 'Foods to avoid cannot exceed 500 characters']
        },
        preferredCuisines: [{
            type: String,
            enum: ['indian', 'mediterranean', 'asian', 'american', 'italian', 'mexican']
        }],
        waterIntake: {
            type: Number,
            min: [1, 'Water intake must be at least 1 liter'],
            max: [10, 'Water intake cannot exceed 10 liters'],
            default: 2.5
        }
    },

    // Health Information
    healthInfo: {
        medicalConditions: [{
            type: String,
            enum: ['diabetes', 'hypertension', 'pcos', 'thyroid', 'heart_disease', 'none']
        }],
        currentMedications: {
            type: String,
            maxlength: [1000, 'Current medications cannot exceed 1000 characters']
        },
        dietExperience: {
            type: String,
            enum: ['beginner', 'some_experience', 'experienced', 'expert'],
            default: 'beginner'
        },
        sleepHours: {
            type: String,
            enum: ['less_than_5', '5_to_6', '6_to_7', '7_to_8', 'more_than_8']
        },
        stressLevel: {
            type: String,
            enum: ['low', 'moderate', 'high', 'very_high']
        }
    },

    // Lifestyle Factors
    lifestyle: {
        workSchedule: {
            type: String,
            required: [true, 'Work schedule is required'],
            enum: ['regular', 'shift_work', 'flexible', 'night_shift', 'freelancer']
        },
        cookingSkills: {
            type: String,
            required: [true, 'Cooking skills level is required'],
            enum: ['beginner', 'intermediate', 'advanced', 'professional']
        },
        mealPrepTime: {
            type: String,
            enum: ['minimal', 'moderate', 'flexible', 'extensive'],
            default: 'moderate'
        },
        budgetPreference: {
            type: String,
            enum: ['low', 'medium', 'high', 'no_limit'],
            default: 'medium'
        },
        exerciseRoutine: {
            type: String,
            maxlength: [500, 'Exercise routine cannot exceed 500 characters']
        },
        specialRequests: {
            type: String,
            maxlength: [1000, 'Special requests cannot exceed 1000 characters']
        }
    },

    // Calculated Values
    calculations: {
        bmr: {
            type: Number,
            min: 0
        },
        tdee: {
            type: Number,
            min: 0
        },
        targetCalories: {
            type: Number,
            min: 0
        },
        macros: {
            protein: {
                type: Number,
                min: 0
            },
            carbs: {
                type: Number,
                min: 0
            },
            fats: {
                type: Number,
                min: 0
            }
        },
        bmi: {
            value: {
                type: Number,
                min: 0
            },
            category: {
                type: String,
                enum: ['underweight', 'normal', 'overweight', 'obese']
            }
        }
    },

    // Metadata
    metadata: {
        submissionDate: {
            type: Date,
            default: Date.now
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        ipAddress: String,
        userAgent: String,
        timezone: String,
        language: String,
        source: {
            type: String,
            default: 'web'
        }
    },

    // Status and Flags
    status: {
        type: String,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
userSchema.index({ 'personalInfo.email': 1 });
userSchema.index({ 'metadata.submissionDate': -1 });
userSchema.index({ status: 1 });
userSchema.index({ 'goals.primaryGoal': 1 });
userSchema.index({ 'dietaryPreferences.dietType': 1 });

// Virtual for full name display
userSchema.virtual('displayName').get(function() {
    return this.personalInfo.fullName;
});

// Virtual for BMI calculation
userSchema.virtual('bmiCalculated').get(function() {
    if (this.physicalData.height && this.physicalData.currentWeight) {
        const heightInMeters = this.physicalData.heightUnit === 'cm' 
            ? this.physicalData.height / 100 
            : this.physicalData.height * 0.3048;
        
        const weightInKg = this.physicalData.weightUnit === 'kg' 
            ? this.physicalData.currentWeight 
            : this.physicalData.currentWeight * 0.453592;
        
        return weightInKg / (heightInMeters * heightInMeters);
    }
    return null;
});

// Pre-save middleware to update lastUpdated and calculate values
userSchema.pre('save', function(next) {
    this.metadata.lastUpdated = new Date();
    
    // Calculate BMI if not already calculated
    if (!this.calculations.bmi.value && this.bmiCalculated) {
        this.calculations.bmi.value = Math.round(this.bmiCalculated * 10) / 10;
        
        // Determine BMI category
        const bmi = this.calculations.bmi.value;
        if (bmi < 18.5) {
            this.calculations.bmi.category = 'underweight';
        } else if (bmi < 25) {
            this.calculations.bmi.category = 'normal';
        } else if (bmi < 30) {
            this.calculations.bmi.category = 'overweight';
        } else {
            this.calculations.bmi.category = 'obese';
        }
    }
    
    next();
});

// Instance methods
userSchema.methods.toSafeObject = function() {
    const user = this.toObject();
    delete user.emailVerificationToken;
    delete user.metadata.ipAddress;
    delete user.metadata.userAgent;
    return user;
};

userSchema.methods.calculateBMR = function() {
    const age = this.personalInfo.age;
    const gender = this.personalInfo.gender;
    
    // Convert weight to kg
    const weightInKg = this.physicalData.weightUnit === 'kg' 
        ? this.physicalData.currentWeight 
        : this.physicalData.currentWeight * 0.453592;
    
    // Convert height to cm
    const heightInCm = this.physicalData.heightUnit === 'cm' 
        ? this.physicalData.height 
        : this.physicalData.height * 30.48;
    
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
    } else {
        bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
    }
    
    this.calculations.bmr = Math.round(bmr);
    return this.calculations.bmr;
};

userSchema.methods.calculateTDEE = function() {
    if (!this.calculations.bmr) {
        this.calculateBMR();
    }
    
    const activityMultipliers = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        extremely_active: 1.9
    };
    
    const multiplier = activityMultipliers[this.goals.activityLevel] || 1.2;
    this.calculations.tdee = Math.round(this.calculations.bmr * multiplier);
    return this.calculations.tdee;
};

userSchema.methods.calculateTargetCalories = function() {
    if (!this.calculations.tdee) {
        this.calculateTDEE();
    }
    
    const goalAdjustments = {
        weight_loss: -500,     // 500 calorie deficit
        weight_gain: 500,      // 500 calorie surplus
        muscle_building: 300,  // 300 calorie surplus
        maintenance: 0         // no adjustment
    };
    
    const adjustment = goalAdjustments[this.goals.primaryGoal] || 0;
    this.calculations.targetCalories = Math.round(this.calculations.tdee + adjustment);
    
    // Ensure minimum calorie intake
    const minimumCalories = this.personalInfo.gender === 'male' ? 1500 : 1200;
    if (this.calculations.targetCalories < minimumCalories) {
        this.calculations.targetCalories = minimumCalories;
    }
    
    return this.calculations.targetCalories;
};

userSchema.methods.calculateMacros = function() {
    if (!this.calculations.targetCalories) {
        this.calculateTargetCalories();
    }
    
    const calories = this.calculations.targetCalories;
    
    // Macro ratios based on goal
    const macroRatios = {
        weight_loss: { protein: 0.35, carbs: 0.35, fats: 0.30 },
        weight_gain: { protein: 0.25, carbs: 0.45, fats: 0.30 },
        muscle_building: { protein: 0.40, carbs: 0.35, fats: 0.25 },
        maintenance: { protein: 0.30, carbs: 0.40, fats: 0.30 }
    };
    
    const ratios = macroRatios[this.goals.primaryGoal] || macroRatios.maintenance;
    
    this.calculations.macros = {
        protein: Math.round((calories * ratios.protein) / 4),   // 4 calories per gram
        carbs: Math.round((calories * ratios.carbs) / 4),       // 4 calories per gram
        fats: Math.round((calories * ratios.fats) / 9)          // 9 calories per gram
    };
    
    return this.calculations.macros;
};

// Static methods
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ 'personalInfo.email': email.toLowerCase() });
};

userSchema.statics.getActiveUsers = function() {
    return this.find({ status: 'active' });
};

userSchema.statics.getUsersByGoal = function(goal) {
    return this.find({ 'goals.primaryGoal': goal, status: 'active' });
};

userSchema.statics.getUsersByDietType = function(dietType) {
    return this.find({ 'dietaryPreferences.dietType': dietType, status: 'active' });
};

// Export the model
module.exports = mongoose.model('User', userSchema);