/* ====================================
   PDF GENERATION SERVICE
   Professional PDF generation for diet plans
   ==================================== */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
    constructor() {
        this.colors = {
            primary: '#000000',      // Black
            secondary: '#666666',    // Grey
            accent: '#CCCCCC',       // Light grey
            background: '#FFFFFF',   // White
            text: '#333333',         // Dark grey
            lightText: '#888888'     // Medium grey
        };
        
        this.fonts = {
            regular: 'Helvetica',
            bold: 'Helvetica-Bold',
            italic: 'Helvetica-Oblique',
            boldItalic: 'Helvetica-BoldOblique'
        };
        
        this.margins = {
            top: 72,
            bottom: 72,
            left: 72,
            right: 72
        };
    }
    
    async generateDietPlanPDF(dietPlan, user, outputPath) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margins: this.margins,
                    info: {
                        Title: `${dietPlan.name} - INTERNITY DIET PLANNER`,
                        Author: 'INTERNITY DIET PLANNER',
                        Subject: 'Personalized Diet Plan',
                        Keywords: 'diet, nutrition, meal plan, health'
                    }
                });
                
                const stream = fs.createWriteStream(outputPath);
                doc.pipe(stream);
                
                // Generate PDF content
                this.addCoverPage(doc, dietPlan, user);
                this.addUserProfile(doc, user);
                this.addNutritionSummary(doc, dietPlan);
                this.addWeeklyMealPlan(doc, dietPlan);
                this.addShoppingList(doc, dietPlan);
                this.addRecipes(doc, dietPlan);
                this.addProgressTracking(doc);
                this.addFooter(doc);
                
                doc.end();
                
                stream.on('finish', () => {
                    resolve(outputPath);
                });
                
                stream.on('error', (error) => {
                    reject(error);
                });
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    addCoverPage(doc, dietPlan, user) {
        // Header with logo area
        doc.rect(0, 0, doc.page.width, 150)
           .fill(this.colors.primary);
        
        // Company name
        doc.fillColor(this.colors.background)
           .font(this.fonts.bold)
           .fontSize(32)
           .text('INTERNITY', 72, 40, { align: 'center' });
        
        doc.fontSize(18)
           .text('DIET PLANNER', 72, 80, { align: 'center' });
        
        // Decorative line
        doc.moveTo(72, 120)
           .lineTo(doc.page.width - 72, 120)
           .stroke(this.colors.background);
        
        // Main title
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(28)
           .text(dietPlan.name, 72, 200, { align: 'center' });
        
        // Subtitle
        doc.fillColor(this.colors.secondary)
           .font(this.fonts.regular)
           .fontSize(16)
           .text('Personalized Nutrition Plan', 72, 240, { align: 'center' });
        
        // User info box
        const boxY = 300;
        doc.rect(72, boxY, doc.page.width - 144, 150)
           .stroke(this.colors.accent);
        
        doc.fillColor(this.colors.text)
           .font(this.fonts.bold)
           .fontSize(14)
           .text('PREPARED FOR:', 92, boxY + 20);
        
        doc.font(this.fonts.regular)
           .fontSize(18)
           .text(user.name || 'Valued Client', 92, boxY + 45);
        
        doc.fontSize(12)
           .fillColor(this.colors.secondary);
        
        if (user.email) {
            doc.text(`Email: ${user.email}`, 92, boxY + 75);
        }
        
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 92, boxY + 95);
        doc.text(`Plan Duration: ${dietPlan.goals.timeframe || 'Ongoing'}`, 92, boxY + 115);
        
        // Goal highlight
        const goalY = 500;
        doc.rect(72, goalY, doc.page.width - 144, 80)
           .fill(this.colors.accent);
        
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(16)
           .text('PRIMARY GOAL', 72, goalY + 20, { align: 'center' });
        
        doc.font(this.fonts.regular)
           .fontSize(18)
           .text(dietPlan.goals.primaryGoal.replace('_', ' ').toUpperCase(), 
                 72, goalY + 45, { align: 'center' });
        
        // Footer note
        doc.fillColor(this.colors.lightText)
           .font(this.fonts.italic)
           .fontSize(10)
           .text('This plan is personalized based on your individual needs and preferences.', 
                 72, doc.page.height - 120, { align: 'center' });
        
        doc.text('Please consult with a healthcare professional before starting any new diet program.', 
                 72, doc.page.height - 100, { align: 'center' });
        
        doc.addPage();
    }
    
    addUserProfile(doc, user) {
        this.addSectionHeader(doc, 'USER PROFILE');
        
        let yPos = 150;
        
        // Personal Information
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(14)
           .text('Personal Information', 72, yPos);
        
        yPos += 25;
        doc.fillColor(this.colors.text)
           .font(this.fonts.regular)
           .fontSize(11);
        
        const personalInfo = [
            [`Name: ${user.name || 'Not provided'}`, `Age: ${user.age || 'Not provided'}`],
            [`Gender: ${user.gender || 'Not provided'}`, `Height: ${user.height || 'Not provided'} cm`],
            [`Current Weight: ${user.weight || 'Not provided'} kg`, `Target Weight: ${user.goals?.targetWeight || 'Not provided'} kg`]
        ];
        
        personalInfo.forEach(row => {
            doc.text(row[0], 72, yPos);
            doc.text(row[1], 300, yPos);
            yPos += 20;
        });
        
        yPos += 20;
        
        // Activity Level
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(14)
           .text('Activity & Lifestyle', 72, yPos);
        
        yPos += 25;
        doc.fillColor(this.colors.text)
           .font(this.fonts.regular)
           .fontSize(11);
        
        if (user.lifestyle?.activityLevel) {
            doc.text(`Activity Level: ${user.lifestyle.activityLevel.replace('_', ' ')}`, 72, yPos);
            yPos += 20;
        }
        
        if (user.lifestyle?.exerciseFrequency) {
            doc.text(`Exercise Frequency: ${user.lifestyle.exerciseFrequency}`, 72, yPos);
            yPos += 20;
        }
        
        yPos += 20;
        
        // Dietary Preferences
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(14)
           .text('Dietary Preferences', 72, yPos);
        
        yPos += 25;
        doc.fillColor(this.colors.text)
           .font(this.fonts.regular)
           .fontSize(11);
        
        if (user.dietaryPreferences?.dietType && user.dietaryPreferences.dietType !== 'none') {
            doc.text(`Diet Type: ${user.dietaryPreferences.dietType}`, 72, yPos);
            yPos += 20;
        }
        
        if (user.dietaryPreferences?.allergies?.length > 0) {
            doc.text(`Allergies: ${user.dietaryPreferences.allergies.join(', ')}`, 72, yPos);
            yPos += 20;
        }
        
        if (user.dietaryPreferences?.dislikes?.length > 0) {
            doc.text(`Dislikes: ${user.dietaryPreferences.dislikes.join(', ')}`, 72, yPos);
            yPos += 20;
        }
        
        // Health Conditions
        if (user.healthInfo?.conditions?.length > 0) {
            yPos += 20;
            doc.fillColor(this.colors.primary)
               .font(this.fonts.bold)
               .fontSize(14)
               .text('Health Considerations', 72, yPos);
            
            yPos += 25;
            doc.fillColor(this.colors.text)
               .font(this.fonts.regular)
               .fontSize(11)
               .text(`Conditions: ${user.healthInfo.conditions.join(', ')}`, 72, yPos);
        }
        
        doc.addPage();
    }
    
    addNutritionSummary(doc, dietPlan) {
        this.addSectionHeader(doc, 'NUTRITION SUMMARY');
        
        let yPos = 150;
        
        // Daily Targets
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(16)
           .text('Daily Targets', 72, yPos);
        
        yPos += 30;
        
        // Create nutrition boxes
        const boxWidth = 120;
        const boxHeight = 80;
        const spacing = 20;
        
        const targets = [
            { label: 'CALORIES', value: dietPlan.goals.dailyCalories, unit: 'kcal' },
            { label: 'PROTEIN', value: dietPlan.goals.macroTargets.protein, unit: 'g' },
            { label: 'CARBS', value: dietPlan.goals.macroTargets.carbs, unit: 'g' },
            { label: 'FATS', value: dietPlan.goals.macroTargets.fats, unit: 'g' }
        ];
        
        targets.forEach((target, index) => {
            const xPos = 72 + (index * (boxWidth + spacing));
            
            // Box
            doc.rect(xPos, yPos, boxWidth, boxHeight)
               .stroke(this.colors.accent);
            
            // Label
            doc.fillColor(this.colors.secondary)
               .font(this.fonts.bold)
               .fontSize(10)
               .text(target.label, xPos, yPos + 10, { 
                   width: boxWidth, 
                   align: 'center' 
               });
            
            // Value
            doc.fillColor(this.colors.primary)
               .font(this.fonts.bold)
               .fontSize(24)
               .text(target.value.toString(), xPos, yPos + 30, { 
                   width: boxWidth, 
                   align: 'center' 
               });
            
            // Unit
            doc.fillColor(this.colors.secondary)
               .font(this.fonts.regular)
               .fontSize(12)
               .text(target.unit, xPos, yPos + 60, { 
                   width: boxWidth, 
                   align: 'center' 
               });
        });
        
        yPos += boxHeight + 40;
        
        // Macro Ratio Chart (simplified text version)
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(14)
           .text('Macronutrient Distribution', 72, yPos);
        
        yPos += 25;
        
        const totalMacroCalories = (dietPlan.goals.macroTargets.protein * 4) + 
                                 (dietPlan.goals.macroTargets.carbs * 4) + 
                                 (dietPlan.goals.macroTargets.fats * 9);
        
        const proteinPercent = Math.round((dietPlan.goals.macroTargets.protein * 4 / totalMacroCalories) * 100);
        const carbPercent = Math.round((dietPlan.goals.macroTargets.carbs * 4 / totalMacroCalories) * 100);
        const fatPercent = Math.round((dietPlan.goals.macroTargets.fats * 9 / totalMacroCalories) * 100);
        
        doc.fillColor(this.colors.text)
           .font(this.fonts.regular)
           .fontSize(12);
        
        doc.text(`Protein: ${proteinPercent}%`, 72, yPos);
        doc.text(`Carbohydrates: ${carbPercent}%`, 200, yPos);
        doc.text(`Fats: ${fatPercent}%`, 350, yPos);
        
        yPos += 40;
        
        // Weekly Nutrition Summary
        if (dietPlan.nutritionSummary) {
            doc.fillColor(this.colors.primary)
               .font(this.fonts.bold)
               .fontSize(14)
               .text('Weekly Averages', 72, yPos);
            
            yPos += 25;
            
            const weeklyAvg = dietPlan.nutritionSummary.daily;
            
            doc.fillColor(this.colors.text)
               .font(this.fonts.regular)
               .fontSize(11);
            
            doc.text(`Average Daily Calories: ${weeklyAvg.calories} kcal`, 72, yPos);
            yPos += 20;
            doc.text(`Average Daily Protein: ${weeklyAvg.protein}g`, 72, yPos);
            yPos += 20;
            doc.text(`Average Daily Carbohydrates: ${weeklyAvg.carbs}g`, 72, yPos);
            yPos += 20;
            doc.text(`Average Daily Fats: ${weeklyAvg.fats}g`, 72, yPos);
        }
        
        doc.addPage();
    }
    
    addWeeklyMealPlan(doc, dietPlan) {
        this.addSectionHeader(doc, 'WEEKLY MEAL PLAN');
        
        let yPos = 150;
        const pageHeight = doc.page.height - this.margins.bottom;
        
        dietPlan.weeklyPlan.forEach((day, dayIndex) => {
            // Check if we need a new page
            if (yPos > pageHeight - 200) {
                doc.addPage();
                yPos = 72;
            }
            
            // Day header
            doc.rect(72, yPos, doc.page.width - 144, 30)
               .fill(this.colors.primary);
            
            doc.fillColor(this.colors.background)
               .font(this.fonts.bold)
               .fontSize(14)
               .text(day.day.toUpperCase(), 72, yPos + 8, { 
                   width: doc.page.width - 144, 
                   align: 'center' 
               });
            
            yPos += 40;
            
            // Meals for the day
            const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
            
            meals.forEach(mealType => {
                if (day.meals[mealType] && yPos < pageHeight - 100) {
                    const meal = day.meals[mealType];
                    
                    // Meal name
                    doc.fillColor(this.colors.secondary)
                       .font(this.fonts.bold)
                       .fontSize(12)
                       .text(mealType.toUpperCase(), 72, yPos);
                    
                    // Calories
                    doc.text(`${meal.totalNutrition.calories} kcal`, 
                            doc.page.width - 144, yPos, { align: 'right' });
                    
                    yPos += 18;
                    
                    // Foods
                    doc.fillColor(this.colors.text)
                       .font(this.fonts.regular)
                       .fontSize(10);
                    
                    meal.foods.forEach(food => {
                        if (yPos < pageHeight - 50) {
                            doc.text(`• ${food.name} (${food.quantity}${food.unit})`, 90, yPos);
                            yPos += 15;
                        }
                    });
                    
                    yPos += 10;
                }
            });
            
            yPos += 20;
        });
        
        doc.addPage();
    }
    
    addShoppingList(doc, dietPlan) {
        this.addSectionHeader(doc, 'SHOPPING LIST');
        
        let yPos = 150;
        
        if (dietPlan.shoppingList && dietPlan.shoppingList.length > 0) {
            // Group items by category
            const groupedItems = {};
            
            dietPlan.shoppingList.forEach(item => {
                const category = item.category || 'General';
                if (!groupedItems[category]) {
                    groupedItems[category] = [];
                }
                groupedItems[category].push(item);
            });
            
            Object.keys(groupedItems).forEach(category => {
                // Category header
                doc.fillColor(this.colors.primary)
                   .font(this.fonts.bold)
                   .fontSize(14)
                   .text(category.toUpperCase(), 72, yPos);
                
                yPos += 25;
                
                // Items in category
                doc.fillColor(this.colors.text)
                   .font(this.fonts.regular)
                   .fontSize(11);
                
                groupedItems[category].forEach(item => {
                    doc.text(`□ ${item.name} - ${Math.round(item.quantity)}${item.unit}`, 90, yPos);
                    yPos += 18;
                    
                    // Check if we need a new page
                    if (yPos > doc.page.height - 150) {
                        doc.addPage();
                        yPos = 72;
                    }
                });
                
                yPos += 15;
            });
        } else {
            doc.fillColor(this.colors.text)
               .font(this.fonts.regular)
               .fontSize(12)
               .text('Shopping list will be generated based on your meal selections.', 72, yPos);
        }
        
        doc.addPage();
    }
    
    addRecipes(doc, dietPlan) {
        this.addSectionHeader(doc, 'MEAL INSTRUCTIONS');
        
        let yPos = 150;
        const pageHeight = doc.page.height - this.margins.bottom;
        
        // Collect unique meals from the week
        const uniqueMeals = new Map();
        
        dietPlan.weeklyPlan.forEach(day => {
            Object.values(day.meals).forEach(meal => {
                if (meal.name && !uniqueMeals.has(meal.name)) {
                    uniqueMeals.set(meal.name, meal);
                }
            });
        });
        
        Array.from(uniqueMeals.values()).forEach(meal => {
            // Check if we need a new page
            if (yPos > pageHeight - 200) {
                doc.addPage();
                yPos = 72;
            }
            
            // Meal name
            doc.fillColor(this.colors.primary)
               .font(this.fonts.bold)
               .fontSize(14)
               .text(meal.name, 72, yPos);
            
            yPos += 25;
            
            // Prep and cook time
            doc.fillColor(this.colors.secondary)
               .font(this.fonts.regular)
               .fontSize(10);
            
            doc.text(`Prep Time: ${meal.prepTime || 15} min`, 72, yPos);
            doc.text(`Cook Time: ${meal.cookTime || 15} min`, 200, yPos);
            doc.text(`Calories: ${meal.totalNutrition.calories} kcal`, 350, yPos);
            
            yPos += 25;
            
            // Ingredients
            doc.fillColor(this.colors.primary)
               .font(this.fonts.bold)
               .fontSize(12)
               .text('Ingredients:', 72, yPos);
            
            yPos += 18;
            
            doc.fillColor(this.colors.text)
               .font(this.fonts.regular)
               .fontSize(10);
            
            meal.foods.forEach(food => {
                doc.text(`• ${food.quantity}${food.unit} ${food.name}`, 90, yPos);
                yPos += 15;
            });
            
            yPos += 10;
            
            // Instructions
            doc.fillColor(this.colors.primary)
               .font(this.fonts.bold)
               .fontSize(12)
               .text('Instructions:', 72, yPos);
            
            yPos += 18;
            
            doc.fillColor(this.colors.text)
               .font(this.fonts.regular)
               .fontSize(10);
            
            if (meal.instructions && meal.instructions.length > 0) {
                meal.instructions.forEach((instruction, index) => {
                    doc.text(`${index + 1}. ${instruction}`, 90, yPos, { width: 450 });
                    yPos += 15;
                });
            } else {
                doc.text('1. Prepare and combine all ingredients as desired.', 90, yPos);
                yPos += 15;
                doc.text('2. Cook according to your preference and dietary needs.', 90, yPos);
                yPos += 15;
                doc.text('3. Serve and enjoy!', 90, yPos);
                yPos += 15;
            }
            
            yPos += 25;
            
            // Separator line
            doc.moveTo(72, yPos)
               .lineTo(doc.page.width - 72, yPos)
               .stroke(this.colors.accent);
            
            yPos += 20;
        });
        
        doc.addPage();
    }
    
    addProgressTracking(doc) {
        this.addSectionHeader(doc, 'PROGRESS TRACKING');
        
        let yPos = 150;
        
        // Weight tracking table
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(14)
           .text('Weight Progress Tracker', 72, yPos);
        
        yPos += 30;
        
        // Table header
        doc.rect(72, yPos, doc.page.width - 144, 25)
           .fill(this.colors.accent);
        
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(10);
        
        doc.text('DATE', 80, yPos + 8);
        doc.text('WEIGHT (kg)', 180, yPos + 8);
        doc.text('BODY FAT %', 280, yPos + 8);
        doc.text('NOTES', 380, yPos + 8);
        
        yPos += 25;
        
        // Empty rows for tracking
        for (let i = 0; i < 10; i++) {
            doc.rect(72, yPos, doc.page.width - 144, 25)
               .stroke(this.colors.accent);
            yPos += 25;
        }
        
        yPos += 30;
        
        // Measurement tracking
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(14)
           .text('Body Measurements Tracker', 72, yPos);
        
        yPos += 30;
        
        // Measurements table
        doc.rect(72, yPos, doc.page.width - 144, 25)
           .fill(this.colors.accent);
        
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(10);
        
        doc.text('DATE', 80, yPos + 8);
        doc.text('CHEST (cm)', 150, yPos + 8);
        doc.text('WAIST (cm)', 220, yPos + 8);
        doc.text('HIPS (cm)', 290, yPos + 8);
        doc.text('ARMS (cm)', 360, yPos + 8);
        
        yPos += 25;
        
        // Empty rows for measurements
        for (let i = 0; i < 8; i++) {
            doc.rect(72, yPos, doc.page.width - 144, 25)
               .stroke(this.colors.accent);
            yPos += 25;
        }
        
        yPos += 40;
        
        // Notes section
        doc.fillColor(this.colors.primary)
           .font(this.fonts.bold)
           .fontSize(14)
           .text('Progress Notes', 72, yPos);
        
        yPos += 30;
        
        doc.fillColor(this.colors.text)
           .font(this.fonts.regular)
           .fontSize(10)
           .text('Use this space to record how you feel, energy levels, challenges, and victories:', 72, yPos);
        
        yPos += 30;
        
        // Lines for notes
        for (let i = 0; i < 15; i++) {
            doc.moveTo(72, yPos)
               .lineTo(doc.page.width - 72, yPos)
               .stroke(this.colors.accent);
            yPos += 20;
        }
    }
    
    addFooter(doc) {
        // Footer on every page
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);
            
            // Footer line
            doc.moveTo(72, doc.page.height - 60)
               .lineTo(doc.page.width - 72, doc.page.height - 60)
               .stroke(this.colors.accent);
            
            // Footer text
            doc.fillColor(this.colors.lightText)
               .font(this.fonts.regular)
               .fontSize(8);
            
            doc.text('INTERNITY DIET PLANNER', 72, doc.page.height - 45);
            doc.text(`Page ${i - range.start + 1} of ${range.count}`, 
                    doc.page.width - 150, doc.page.height - 45, { align: 'right' });
            
            doc.text('For support: contact@internitydietplanner.com', 
                    72, doc.page.height - 30, { width: doc.page.width - 144, align: 'center' });
        }
    }
    
    addSectionHeader(doc, title) {
        // Header background
        doc.rect(0, 0, doc.page.width, 100)
           .fill(this.colors.primary);
        
        // Title
        doc.fillColor(this.colors.background)
           .font(this.fonts.bold)
           .fontSize(24)
           .text(title, 72, 35, { align: 'center' });
        
        // Decorative line
        doc.moveTo(150, 75)
           .lineTo(doc.page.width - 150, 75)
           .stroke(this.colors.background);
    }
}

module.exports = PDFGenerator;