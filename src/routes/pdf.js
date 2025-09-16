/* ====================================
   PDF ROUTES
   Routes for generating and downloading PDF diet plans
   ==================================== */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const PDFGenerator = require('../services/PDFGenerator');
const User = require('../database/User');
const DietPlan = require('../database/DietPlan');

// Ensure PDF directory exists
const pdfDir = path.join(__dirname, '../../temp/pdfs');
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

// Generate and download PDF diet plan
router.get('/diet-plan/:planId', async (req, res) => {
    try {
        const { planId } = req.params;
        
        // Get diet plan with user data
        const dietPlan = await DietPlan.findById(planId).populate('userId');
        
        if (!dietPlan) {
            return res.status(404).json({
                success: false,
                message: 'Diet plan not found'
            });
        }
        
        const user = dietPlan.userId;
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `diet-plan-${planId}-${timestamp}.pdf`;
        const filepath = path.join(pdfDir, filename);
        
        // Generate PDF
        const pdfGenerator = new PDFGenerator();
        await pdfGenerator.generateDietPlanPDF(dietPlan, user, filepath);
        
        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${dietPlan.name.replace(/[^a-zA-Z0-9]/g, '_')}_Diet_Plan.pdf"`);
        
        // Stream the PDF file
        const fileStream = fs.createReadStream(filepath);
        
        fileStream.pipe(res);
        
        // Clean up file after sending
        fileStream.on('end', () => {
            setTimeout(() => {
                fs.unlink(filepath, (err) => {
                    if (err) console.error('Error deleting temp PDF file:', err);
                });
            }, 5000); // Delete after 5 seconds
        });
        
        fileStream.on('error', (error) => {
            console.error('Error streaming PDF:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Error generating PDF'
                });
            }
        });
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating PDF',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Generate PDF for user's current plan
router.get('/user/:userId/current-plan', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get user's most recent diet plan
        const dietPlan = await DietPlan.findOne({ userId: userId })
            .sort({ createdAt: -1 })
            .populate('userId');
        
        if (!dietPlan) {
            return res.status(404).json({
                success: false,
                message: 'No diet plan found for this user'
            });
        }
        
        const user = dietPlan.userId;
        
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `current-diet-plan-${userId}-${timestamp}.pdf`;
        const filepath = path.join(pdfDir, filename);
        
        // Generate PDF
        const pdfGenerator = new PDFGenerator();
        await pdfGenerator.generateDietPlanPDF(dietPlan, user, filepath);
        
        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Current_Diet_Plan.pdf"`);
        
        // Stream the PDF file
        const fileStream = fs.createReadStream(filepath);
        
        fileStream.pipe(res);
        
        // Clean up file after sending
        fileStream.on('end', () => {
            setTimeout(() => {
                fs.unlink(filepath, (err) => {
                    if (err) console.error('Error deleting temp PDF file:', err);
                });
            }, 5000);
        });
        
        fileStream.on('error', (error) => {
            console.error('Error streaming PDF:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Error generating PDF'
                });
            }
        });
        
    } catch (error) {
        console.error('Error generating current plan PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating PDF',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Preview PDF in browser (without download)
router.get('/preview/:planId', async (req, res) => {
    try {
        const { planId } = req.params;
        
        // Get diet plan with user data
        const dietPlan = await DietPlan.findById(planId).populate('userId');
        
        if (!dietPlan) {
            return res.status(404).json({
                success: false,
                message: 'Diet plan not found'
            });
        }
        
        const user = dietPlan.userId;
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `preview-${planId}-${timestamp}.pdf`;
        const filepath = path.join(pdfDir, filename);
        
        // Generate PDF
        const pdfGenerator = new PDFGenerator();
        await pdfGenerator.generateDietPlanPDF(dietPlan, user, filepath);
        
        // Set response headers for PDF preview
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        
        // Stream the PDF file
        const fileStream = fs.createReadStream(filepath);
        
        fileStream.pipe(res);
        
        // Clean up file after sending
        fileStream.on('end', () => {
            setTimeout(() => {
                fs.unlink(filepath, (err) => {
                    if (err) console.error('Error deleting temp PDF file:', err);
                });
            }, 10000); // Delete after 10 seconds for preview
        });
        
        fileStream.on('error', (error) => {
            console.error('Error streaming PDF preview:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Error generating PDF preview'
                });
            }
        });
        
    } catch (error) {
        console.error('Error generating PDF preview:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating PDF preview',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get PDF generation status (for long-running generations)
router.get('/status/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // This is a placeholder for future implementation of job queuing
        // For now, PDFs are generated synchronously
        
        res.status(200).json({
            success: true,
            data: {
                jobId: jobId,
                status: 'completed',
                message: 'PDF generation completed'
            }
        });
        
    } catch (error) {
        console.error('Error checking PDF status:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking PDF status'
        });
    }
});

// Clean up old PDF files (utility endpoint)
router.post('/cleanup', async (req, res) => {
    try {
        const files = fs.readdirSync(pdfDir);
        const now = Date.now();
        let deletedCount = 0;
        
        files.forEach(file => {
            const filepath = path.join(pdfDir, file);
            const stats = fs.statSync(filepath);
            const fileAge = now - stats.mtime.getTime();
            
            // Delete files older than 1 hour
            if (fileAge > 60 * 60 * 1000) {
                fs.unlinkSync(filepath);
                deletedCount++;
            }
        });
        
        res.status(200).json({
            success: true,
            message: `Cleaned up ${deletedCount} old PDF files`
        });
        
    } catch (error) {
        console.error('Error cleaning up PDF files:', error);
        res.status(500).json({
            success: false,
            message: 'Error cleaning up PDF files'
        });
    }
});

module.exports = router;