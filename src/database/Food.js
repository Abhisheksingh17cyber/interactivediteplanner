/* ====================================
   FOOD DATABASE MODEL
   Comprehensive food database with nutritional information
   ==================================== */

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    // Basic food information
    name: {
        type: String,
        required: [true, 'Food name is required'],
        trim: true,
        index: true
    },
    
    aliases: [{
        type: String,
        trim: true
    }], // Alternative names for the food
    
    description: {
        type: String,
        maxlength: 500
    },
    
    category: {
        type: String,
        required: [true, 'Food category is required'],
        enum: [
            'grains', 'vegetables', 'fruits', 'protein', 'dairy', 
            'nuts_seeds', 'oils_fats', 'beverages', 'herbs_spices',
            'legumes', 'seafood', 'meat', 'poultry', 'snacks', 'sweets'
        ],
        index: true
    },
    
    subcategory: {
        type: String,
        trim: true
    },
    
    // Nutritional information per 100g
    nutrition: {
        calories: {
            type: Number,
            required: [true, 'Calories are required'],
            min: [0, 'Calories cannot be negative']
        },
        
        macronutrients: {
            protein: {
                type: Number,
                required: [true, 'Protein content is required'],
                min: [0, 'Protein cannot be negative']
            },
            carbohydrates: {
                type: Number,
                required: [true, 'Carbohydrate content is required'],
                min: [0, 'Carbohydrates cannot be negative']
            },
            fats: {
                type: Number,
                required: [true, 'Fat content is required'],
                min: [0, 'Fats cannot be negative']
            },
            fiber: {
                type: Number,
                min: [0, 'Fiber cannot be negative'],
                default: 0
            },
            sugar: {
                type: Number,
                min: [0, 'Sugar cannot be negative'],
                default: 0
            }
        },
        
        vitamins: {
            vitaminA: { type: Number, min: 0, default: 0 }, // mcg
            vitaminC: { type: Number, min: 0, default: 0 }, // mg
            vitaminD: { type: Number, min: 0, default: 0 }, // mcg
            vitaminE: { type: Number, min: 0, default: 0 }, // mg
            vitaminK: { type: Number, min: 0, default: 0 }, // mcg
            thiamine: { type: Number, min: 0, default: 0 }, // mg
            riboflavin: { type: Number, min: 0, default: 0 }, // mg
            niacin: { type: Number, min: 0, default: 0 }, // mg
            vitaminB6: { type: Number, min: 0, default: 0 }, // mg
            folate: { type: Number, min: 0, default: 0 }, // mcg
            vitaminB12: { type: Number, min: 0, default: 0 } // mcg
        },
        
        minerals: {
            calcium: { type: Number, min: 0, default: 0 }, // mg
            iron: { type: Number, min: 0, default: 0 }, // mg
            magnesium: { type: Number, min: 0, default: 0 }, // mg
            phosphorus: { type: Number, min: 0, default: 0 }, // mg
            potassium: { type: Number, min: 0, default: 0 }, // mg
            sodium: { type: Number, min: 0, default: 0 }, // mg
            zinc: { type: Number, min: 0, default: 0 }, // mg
            copper: { type: Number, min: 0, default: 0 }, // mg
            selenium: { type: Number, min: 0, default: 0 } // mcg
        }
    },
    
    // Dietary classifications
    dietaryInfo: {
        isVegetarian: { type: Boolean, default: false },
        isVegan: { type: Boolean, default: false },
        isGlutenFree: { type: Boolean, default: false },
        isDairyFree: { type: Boolean, default: false },
        isNutFree: { type: Boolean, default: false },
        isKeto: { type: Boolean, default: false },
        isPaleo: { type: Boolean, default: false },
        isOrganic: { type: Boolean, default: false },
        isProcessed: { type: Boolean, default: false }
    },
    
    // Allergen information
    allergens: [{
        type: String,
        enum: ['dairy', 'eggs', 'fish', 'shellfish', 'nuts', 'peanuts', 'soy', 'wheat', 'sesame']
    }],
    
    // Common serving sizes
    servingSizes: [{
        name: { type: String, required: true }, // e.g., "1 cup", "1 medium", "1 slice"
        grams: { type: Number, required: true, min: 0 },
        description: String
    }],
    
    // Preparation methods that affect nutrition
    preparationMethods: [{
        method: { type: String, required: true }, // e.g., "raw", "boiled", "fried"
        nutritionMultiplier: {
            calories: { type: Number, default: 1 },
            protein: { type: Number, default: 1 },
            carbs: { type: Number, default: 1 },
            fats: { type: Number, default: 1 }
        },
        notes: String
    }],
    
    // Cuisine and usage information
    cuisineInfo: {
        cuisines: [{
            type: String,
            enum: ['indian', 'mediterranean', 'asian', 'american', 'italian', 'mexican', 'middle_eastern', 'african']
        }],
        commonUses: [String] // e.g., "breakfast", "snack", "side dish"
    },
    
    // Cost and availability
    marketInfo: {
        averageCost: { type: Number, min: 0 }, // per 100g in local currency
        availability: {
            type: String,
            enum: ['year_round', 'seasonal', 'limited'],
            default: 'year_round'
        },
        seasonalMonths: [Number], // months 1-12 when available
        shelfLife: {
            type: Number, // days
            min: 0
        },
        storageInstructions: String
    },
    
    // Recipe and cooking information
    cookingInfo: {
        cookingTime: { type: Number, min: 0 }, // minutes
        prepTime: { type: Number, min: 0 }, // minutes
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'easy'
        },
        cookingMethods: [String], // e.g., "boiling", "steaming", "grilling"
        tips: [String]
    },
    
    // Health benefits and concerns
    healthInfo: {
        benefits: [String],
        concerns: [String],
        recommendedFor: [String], // e.g., "weight loss", "muscle building"
        avoidFor: [String] // e.g., "diabetes", "high blood pressure"
    },
    
    // Quality and sourcing
    qualityInfo: {
        isVerified: { type: Boolean, default: false },
        dataSource: { type: String, default: 'manual' }, // manual, usda, other
        lastVerified: Date,
        confidenceScore: { type: Number, min: 0, max: 100, default: 80 }
    },
    
    // Usage statistics
    stats: {
        timesUsed: { type: Number, default: 0 },
        lastUsed: Date,
        popularityScore: { type: Number, min: 0, max: 100, default: 50 },
        userRating: { type: Number, min: 0, max: 5, default: 0 },
        ratingCount: { type: Number, default: 0 }
    },
    
    // Metadata
    metadata: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        createdBy: { type: String, default: 'system' },
        version: { type: String, default: '1.0' },
        tags: [String],
        isActive: { type: Boolean, default: true }
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
foodSchema.index({ name: 'text', aliases: 'text', description: 'text' });
foodSchema.index({ category: 1 });
foodSchema.index({ 'dietaryInfo.isVegetarian': 1 });
foodSchema.index({ 'dietaryInfo.isVegan': 1 });
foodSchema.index({ 'dietaryInfo.isGlutenFree': 1 });
foodSchema.index({ 'dietaryInfo.isKeto': 1 });
foodSchema.index({ 'stats.popularityScore': -1 });
foodSchema.index({ 'metadata.isActive': 1 });
foodSchema.index({ 'nutrition.calories': 1 });

// Virtual for protein per calorie ratio
foodSchema.virtual('proteinRatio').get(function() {
    if (this.nutrition.calories > 0) {
        return Math.round((this.nutrition.macronutrients.protein * 4 / this.nutrition.calories) * 100);
    }
    return 0;
});

// Virtual for carb per calorie ratio
foodSchema.virtual('carbRatio').get(function() {
    if (this.nutrition.calories > 0) {
        return Math.round((this.nutrition.macronutrients.carbohydrates * 4 / this.nutrition.calories) * 100);
    }
    return 0;
});

// Virtual for fat per calorie ratio
foodSchema.virtual('fatRatio').get(function() {
    if (this.nutrition.calories > 0) {
        return Math.round((this.nutrition.macronutrients.fats * 9 / this.nutrition.calories) * 100);
    }
    return 0;
});

// Virtual for nutrition density score
foodSchema.virtual('nutritionDensity').get(function() {
    const vitamins = Object.values(this.nutrition.vitamins).reduce((sum, val) => sum + val, 0);
    const minerals = Object.values(this.nutrition.minerals).reduce((sum, val) => sum + val, 0);
    const fiber = this.nutrition.macronutrients.fiber;
    const protein = this.nutrition.macronutrients.protein;
    
    const nutrientScore = (vitamins + minerals + fiber + protein) / 100;
    const calorieScore = Math.max(1, this.nutrition.calories / 100);
    
    return Math.round((nutrientScore / calorieScore) * 100);
});

// Pre-save middleware
foodSchema.pre('save', function(next) {
    this.metadata.updatedAt = new Date();
    
    // Update popularity score based on usage
    if (this.stats.timesUsed > 0) {
        this.stats.popularityScore = Math.min(100, Math.log(this.stats.timesUsed) * 20);
    }
    
    // Auto-determine dietary classifications
    if (this.nutrition.macronutrients.carbohydrates < 5 && this.nutrition.macronutrients.fats > 15) {
        this.dietaryInfo.isKeto = true;
    }
    
    // Validate macro totals don't exceed calories (with tolerance)
    const macroCalories = (this.nutrition.macronutrients.protein * 4) + 
                         (this.nutrition.macronutrients.carbohydrates * 4) + 
                         (this.nutrition.macronutrients.fats * 9);
    
    if (macroCalories > this.nutrition.calories * 1.1) { // 10% tolerance
        return next(new Error('Macro nutrients exceed total calories'));
    }
    
    next();
});

// Instance methods
foodSchema.methods.calculateNutritionForQuantity = function(quantity, unit = 'g') {
    let multiplier = 1;
    
    // Convert to grams if needed
    if (unit !== 'g') {
        const servingSize = this.servingSizes.find(s => s.name.toLowerCase().includes(unit.toLowerCase()));
        if (servingSize) {
            multiplier = (quantity * servingSize.grams) / 100;
        } else {
            // Default conversions
            const conversions = {
                'kg': 1000,
                'oz': 28.35,
                'lb': 453.6,
                'cup': 240, // approximate for liquids
                'tbsp': 15,
                'tsp': 5
            };
            multiplier = (quantity * (conversions[unit] || 1)) / 100;
        }
    } else {
        multiplier = quantity / 100;
    }
    
    return {
        calories: Math.round(this.nutrition.calories * multiplier),
        protein: Math.round(this.nutrition.macronutrients.protein * multiplier * 10) / 10,
        carbs: Math.round(this.nutrition.macronutrients.carbohydrates * multiplier * 10) / 10,
        fats: Math.round(this.nutrition.macronutrients.fats * multiplier * 10) / 10,
        fiber: Math.round(this.nutrition.macronutrients.fiber * multiplier * 10) / 10,
        sodium: Math.round(this.nutrition.minerals.sodium * multiplier)
    };
};

foodSchema.methods.incrementUsage = function() {
    this.stats.timesUsed += 1;
    this.stats.lastUsed = new Date();
    return this.save();
};

foodSchema.methods.addRating = function(rating) {
    const currentTotal = this.stats.userRating * this.stats.ratingCount;
    this.stats.ratingCount += 1;
    this.stats.userRating = Math.round(((currentTotal + rating) / this.stats.ratingCount) * 10) / 10;
    return this.save();
};

foodSchema.methods.isCompatibleWithDiet = function(dietType) {
    const compatibility = {
        'vegetarian': this.dietaryInfo.isVegetarian,
        'vegan': this.dietaryInfo.isVegan,
        'keto': this.dietaryInfo.isKeto,
        'paleo': this.dietaryInfo.isPaleo,
        'gluten_free': this.dietaryInfo.isGlutenFree
    };
    
    return compatibility[dietType] || false;
};

foodSchema.methods.hasAllergen = function(allergen) {
    return this.allergens.includes(allergen);
};

// Static methods
foodSchema.statics.searchByName = function(query) {
    return this.find({
        $text: { $search: query },
        'metadata.isActive': true
    }).sort({ score: { $meta: 'textScore' } });
};

foodSchema.statics.findByCategory = function(category) {
    return this.find({ 
        category: category,
        'metadata.isActive': true 
    }).sort({ 'stats.popularityScore': -1 });
};

foodSchema.statics.findForDiet = function(dietType) {
    const query = { 'metadata.isActive': true };
    
    switch (dietType) {
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
        case 'gluten_free':
            query['dietaryInfo.isGlutenFree'] = true;
            break;
    }
    
    return this.find(query).sort({ 'stats.popularityScore': -1 });
};

foodSchema.statics.findHighProtein = function(minProtein = 15) {
    return this.find({
        'nutrition.macronutrients.protein': { $gte: minProtein },
        'metadata.isActive': true
    }).sort({ 'nutrition.macronutrients.protein': -1 });
};

foodSchema.statics.findLowCalorie = function(maxCalories = 100) {
    return this.find({
        'nutrition.calories': { $lte: maxCalories },
        'metadata.isActive': true
    }).sort({ 'nutrition.calories': 1 });
};

foodSchema.statics.findWithoutAllergens = function(allergens) {
    return this.find({
        allergens: { $nin: allergens },
        'metadata.isActive': true
    }).sort({ 'stats.popularityScore': -1 });
};

foodSchema.statics.getPopularFoods = function(limit = 50) {
    return this.find({ 'metadata.isActive': true })
        .sort({ 'stats.popularityScore': -1 })
        .limit(limit);
};

foodSchema.statics.getNutrientRichFoods = function(nutrient, limit = 20) {
    const sortField = `nutrition.${nutrient}`;
    const query = {};
    query[sortField] = { $gt: 0 };
    query['metadata.isActive'] = true;
    
    const sort = {};
    sort[sortField] = -1;
    
    return this.find(query).sort(sort).limit(limit);
};

// Export the model
module.exports = mongoose.model('Food', foodSchema);