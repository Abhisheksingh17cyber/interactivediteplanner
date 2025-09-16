/* ====================================
   FOOD DATABASE INITIALIZATION
   Sample foods to populate the database
   ==================================== */

const mongoose = require('mongoose');
const Food = require('../database/Food');

const sampleFoods = [
    // Grains
    {
        name: 'Brown Rice',
        category: 'grains',
        nutrition: {
            calories: 123,
            macronutrients: {
                protein: 2.6,
                carbohydrates: 23,
                fats: 0.9,
                fiber: 1.8,
                sugar: 0.4
            },
            vitamins: {
                vitaminB6: 0.15,
                niacin: 1.5,
                thiamine: 0.1
            },
            minerals: {
                magnesium: 44,
                phosphorus: 77,
                potassium: 79,
                iron: 0.56
            }
        },
        dietaryInfo: {
            isVegetarian: true,
            isVegan: true,
            isGlutenFree: true,
            isDairyFree: true,
            isNutFree: true
        },
        servingSizes: [
            { name: '1 cup cooked', grams: 195, description: 'Standard serving' },
            { name: '1/2 cup cooked', grams: 98, description: 'Half serving' }
        ],
        cuisineInfo: {
            cuisines: ['asian', 'indian', 'american'],
            commonUses: ['lunch', 'dinner']
        }
    },
    
    // Vegetables
    {
        name: 'Broccoli',
        category: 'vegetables',
        nutrition: {
            calories: 34,
            macronutrients: {
                protein: 2.8,
                carbohydrates: 7,
                fats: 0.4,
                fiber: 2.6,
                sugar: 1.5
            },
            vitamins: {
                vitaminC: 89.2,
                vitaminK: 101.6,
                folate: 63,
                vitaminA: 623
            },
            minerals: {
                potassium: 316,
                phosphorus: 66,
                calcium: 47,
                iron: 0.73
            }
        },
        dietaryInfo: {
            isVegetarian: true,
            isVegan: true,
            isGlutenFree: true,
            isDairyFree: true,
            isNutFree: true,
            isKeto: true,
            isPaleo: true
        },
        servingSizes: [
            { name: '1 cup chopped', grams: 91, description: 'Fresh chopped' },
            { name: '1 medium stalk', grams: 148, description: 'Whole stalk' }
        ],
        cuisineInfo: {
            cuisines: ['american', 'asian', 'italian'],
            commonUses: ['lunch', 'dinner']
        }
    },
    
    // Protein - Chicken
    {
        name: 'Chicken Breast',
        category: 'poultry',
        nutrition: {
            calories: 165,
            macronutrients: {
                protein: 31,
                carbohydrates: 0,
                fats: 3.6,
                fiber: 0,
                sugar: 0
            },
            vitamins: {
                niacin: 14.8,
                vitaminB6: 1.3,
                vitaminB12: 0.3
            },
            minerals: {
                phosphorus: 228,
                potassium: 256,
                sodium: 74,
                zinc: 1
            }
        },
        dietaryInfo: {
            isVegetarian: false,
            isVegan: false,
            isGlutenFree: true,
            isDairyFree: true,
            isNutFree: true,
            isKeto: true,
            isPaleo: true
        },
        servingSizes: [
            { name: '3 oz cooked', grams: 85, description: 'Standard serving' },
            { name: '4 oz cooked', grams: 113, description: 'Large serving' }
        ],
        cuisineInfo: {
            cuisines: ['american', 'asian', 'mediterranean'],
            commonUses: ['lunch', 'dinner']
        }
    },
    
    // Fruits
    {
        name: 'Apple',
        category: 'fruits',
        nutrition: {
            calories: 52,
            macronutrients: {
                protein: 0.3,
                carbohydrates: 14,
                fats: 0.2,
                fiber: 2.4,
                sugar: 10.4
            },
            vitamins: {
                vitaminC: 4.6,
                vitaminK: 2.2
            },
            minerals: {
                potassium: 107,
                calcium: 6,
                phosphorus: 11
            }
        },
        dietaryInfo: {
            isVegetarian: true,
            isVegan: true,
            isGlutenFree: true,
            isDairyFree: true,
            isNutFree: true,
            isPaleo: true
        },
        servingSizes: [
            { name: '1 medium apple', grams: 182, description: 'Whole apple' },
            { name: '1 cup sliced', grams: 109, description: 'Sliced apple' }
        ],
        cuisineInfo: {
            cuisines: ['american', 'european'],
            commonUses: ['breakfast', 'snack']
        }
    },
    
    // Dairy
    {
        name: 'Greek Yogurt',
        category: 'dairy',
        nutrition: {
            calories: 59,
            macronutrients: {
                protein: 10,
                carbohydrates: 3.6,
                fats: 0.4,
                fiber: 0,
                sugar: 3.6
            },
            vitamins: {
                vitaminB12: 0.75,
                riboflavin: 0.27
            },
            minerals: {
                calcium: 110,
                phosphorus: 135,
                potassium: 141,
                sodium: 36
            }
        },
        dietaryInfo: {
            isVegetarian: true,
            isVegan: false,
            isGlutenFree: true,
            isDairyFree: false,
            isNutFree: true,
            isKeto: true
        },
        allergens: ['dairy'],
        servingSizes: [
            { name: '1 cup', grams: 245, description: 'Standard serving' },
            { name: '3/4 cup', grams: 184, description: 'Small serving' }
        ],
        cuisineInfo: {
            cuisines: ['mediterranean', 'american'],
            commonUses: ['breakfast', 'snack']
        }
    },
    
    // Nuts and Seeds
    {
        name: 'Almonds',
        category: 'nuts_seeds',
        nutrition: {
            calories: 579,
            macronutrients: {
                protein: 21.15,
                carbohydrates: 21.55,
                fats: 49.93,
                fiber: 12.5,
                sugar: 4.35
            },
            vitamins: {
                vitaminE: 25.63,
                riboflavin: 1.138,
                niacin: 3.618
            },
            minerals: {
                calcium: 269,
                iron: 3.71,
                magnesium: 270,
                phosphorus: 481,
                potassium: 733
            }
        },
        dietaryInfo: {
            isVegetarian: true,
            isVegan: true,
            isGlutenFree: true,
            isDairyFree: true,
            isNutFree: false,
            isKeto: true,
            isPaleo: true
        },
        allergens: ['nuts'],
        servingSizes: [
            { name: '1 oz (23 almonds)', grams: 28, description: 'Standard serving' },
            { name: '1/4 cup', grams: 35, description: 'Large serving' }
        ],
        cuisineInfo: {
            cuisines: ['mediterranean', 'middle_eastern', 'indian'],
            commonUses: ['snack', 'breakfast']
        }
    },
    
    // Legumes
    {
        name: 'Black Beans',
        category: 'legumes',
        nutrition: {
            calories: 132,
            macronutrients: {
                protein: 8.86,
                carbohydrates: 23.71,
                fats: 0.54,
                fiber: 8.7,
                sugar: 0.28
            },
            vitamins: {
                folate: 149,
                thiamine: 0.244,
                vitaminB6: 0.069
            },
            minerals: {
                iron: 2.1,
                magnesium: 70,
                phosphorus: 140,
                potassium: 355,
                zinc: 1.12
            }
        },
        dietaryInfo: {
            isVegetarian: true,
            isVegan: true,
            isGlutenFree: true,
            isDairyFree: true,
            isNutFree: true,
            isPaleo: false
        },
        servingSizes: [
            { name: '1/2 cup cooked', grams: 86, description: 'Standard serving' },
            { name: '1 cup cooked', grams: 172, description: 'Large serving' }
        ],
        cuisineInfo: {
            cuisines: ['mexican', 'american', 'african'],
            commonUses: ['lunch', 'dinner']
        }
    },
    
    // Seafood
    {
        name: 'Salmon',
        category: 'seafood',
        nutrition: {
            calories: 208,
            macronutrients: {
                protein: 22.1,
                carbohydrates: 0,
                fats: 12.4,
                fiber: 0,
                sugar: 0
            },
            vitamins: {
                vitaminD: 11,
                vitaminB12: 2.8,
                niacin: 8.5,
                vitaminB6: 0.6
            },
            minerals: {
                potassium: 363,
                phosphorus: 252,
                selenium: 24.3,
                sodium: 59
            }
        },
        dietaryInfo: {
            isVegetarian: false,
            isVegan: false,
            isGlutenFree: true,
            isDairyFree: true,
            isNutFree: true,
            isKeto: true,
            isPaleo: true
        },
        allergens: ['fish'],
        servingSizes: [
            { name: '3 oz cooked', grams: 85, description: 'Standard serving' },
            { name: '4 oz cooked', grams: 113, description: 'Large serving' }
        ],
        cuisineInfo: {
            cuisines: ['american', 'asian', 'mediterranean'],
            commonUses: ['lunch', 'dinner']
        }
    },
    
    // Oils and Fats
    {
        name: 'Olive Oil',
        category: 'oils_fats',
        nutrition: {
            calories: 884,
            macronutrients: {
                protein: 0,
                carbohydrates: 0,
                fats: 100,
                fiber: 0,
                sugar: 0
            },
            vitamins: {
                vitaminE: 14.35,
                vitaminK: 60.2
            },
            minerals: {
                iron: 0.56,
                sodium: 2,
                calcium: 1
            }
        },
        dietaryInfo: {
            isVegetarian: true,
            isVegan: true,
            isGlutenFree: true,
            isDairyFree: true,
            isNutFree: true,
            isKeto: true,
            isPaleo: true
        },
        servingSizes: [
            { name: '1 tablespoon', grams: 14, description: 'Standard serving' },
            { name: '1 teaspoon', grams: 5, description: 'Small serving' }
        ],
        cuisineInfo: {
            cuisines: ['mediterranean', 'italian', 'middle_eastern'],
            commonUses: ['lunch', 'dinner']
        }
    },
    
    // More vegetables
    {
        name: 'Spinach',
        category: 'vegetables',
        nutrition: {
            calories: 23,
            macronutrients: {
                protein: 2.9,
                carbohydrates: 3.6,
                fats: 0.4,
                fiber: 2.2,
                sugar: 0.4
            },
            vitamins: {
                vitaminK: 483,
                vitaminA: 9377,
                folate: 194,
                vitaminC: 28.1
            },
            minerals: {
                iron: 2.7,
                calcium: 99,
                potassium: 558,
                magnesium: 79
            }
        },
        dietaryInfo: {
            isVegetarian: true,
            isVegan: true,
            isGlutenFree: true,
            isDairyFree: true,
            isNutFree: true,
            isKeto: true,
            isPaleo: true
        },
        servingSizes: [
            { name: '1 cup raw', grams: 30, description: 'Fresh leaves' },
            { name: '1/2 cup cooked', grams: 90, description: 'Cooked spinach' }
        ],
        cuisineInfo: {
            cuisines: ['mediterranean', 'indian', 'american'],
            commonUses: ['lunch', 'dinner']
        }
    }
];

async function initializeFoodDatabase() {
    try {
        console.log('Initializing food database...');
        
        // Clear existing foods (optional - remove this in production)
        // await Food.deleteMany({});
        
        // Check if foods already exist
        const existingFoodsCount = await Food.countDocuments();
        if (existingFoodsCount > 0) {
            console.log(`Food database already has ${existingFoodsCount} items. Skipping initialization.`);
            return;
        }
        
        // Insert sample foods
        const insertedFoods = await Food.insertMany(sampleFoods);
        console.log(`Successfully inserted ${insertedFoods.length} foods into the database.`);
        
        // Create indexes
        await Food.createIndexes();
        console.log('Food database indexes created successfully.');
        
    } catch (error) {
        console.error('Error initializing food database:', error);
        throw error;
    }
}

// Function to add more foods (can be called separately)
async function addMoreFoods() {
    const additionalFoods = [
        {
            name: 'Sweet Potato',
            category: 'vegetables',
            nutrition: {
                calories: 86,
                macronutrients: {
                    protein: 1.6,
                    carbohydrates: 20.1,
                    fats: 0.1,
                    fiber: 3,
                    sugar: 4.2
                },
                vitamins: {
                    vitaminA: 14187,
                    vitaminC: 2.4,
                    vitaminB6: 0.2
                },
                minerals: {
                    potassium: 337,
                    manganese: 0.3,
                    copper: 0.2
                }
            },
            dietaryInfo: {
                isVegetarian: true,
                isVegan: true,
                isGlutenFree: true,
                isDairyFree: true,
                isNutFree: true,
                isPaleo: true
            },
            servingSizes: [
                { name: '1 medium baked', grams: 114, description: 'Whole baked sweet potato' },
                { name: '1 cup cubed', grams: 133, description: 'Cubed sweet potato' }
            ],
            cuisineInfo: {
                cuisines: ['american', 'african', 'asian'],
                commonUses: ['lunch', 'dinner']
            }
        },
        
        {
            name: 'Quinoa',
            category: 'grains',
            nutrition: {
                calories: 120,
                macronutrients: {
                    protein: 4.4,
                    carbohydrates: 22,
                    fats: 1.9,
                    fiber: 2.8,
                    sugar: 0.9
                },
                vitamins: {
                    folate: 42,
                    thiamine: 0.1,
                    vitaminB6: 0.1
                },
                minerals: {
                    magnesium: 64,
                    phosphorus: 152,
                    potassium: 172,
                    iron: 1.5
                }
            },
            dietaryInfo: {
                isVegetarian: true,
                isVegan: true,
                isGlutenFree: true,
                isDairyFree: true,
                isNutFree: true,
                isPaleo: false
            },
            servingSizes: [
                { name: '1 cup cooked', grams: 185, description: 'Standard serving' },
                { name: '1/2 cup cooked', grams: 93, description: 'Half serving' }
            ],
            cuisineInfo: {
                cuisines: ['american', 'mediterranean'],
                commonUses: ['lunch', 'dinner']
            }
        }
    ];
    
    try {
        const insertedFoods = await Food.insertMany(additionalFoods);
        console.log(`Successfully added ${insertedFoods.length} additional foods.`);
        return insertedFoods;
    } catch (error) {
        console.error('Error adding additional foods:', error);
        throw error;
    }
}

module.exports = {
    initializeFoodDatabase,
    addMoreFoods,
    sampleFoods
};