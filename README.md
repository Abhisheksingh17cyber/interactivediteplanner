# INTERNITY DIET PLANNER

## Professional Interactive Diet Planning Website

A comprehensive, professional diet planning application that creates personalized nutrition plans with PDF generation capabilities. Built with modern web technologies and featuring a sleek black, white, and grey design theme.

## 🌟 Features

### Core Functionality
- **Interactive Multi-Step Form**: Comprehensive data collection for personalized diet plans
- **Professional Design**: Modern black/white/grey color scheme with responsive design
- **Personalized Diet Plans**: Algorithm-based meal planning using user data and preferences
- **PDF Generation**: Professional PDF reports with complete diet plans and meal schedules
- **Food Database**: Comprehensive nutrition database with 1000+ foods
- **Progress Tracking**: Built-in tracking system for weight and measurements

### Technical Features
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Modern JavaScript**: ES6+ with modular architecture
- **RESTful API**: Complete backend API with rate limiting and security
- **Database Integration**: MongoDB with Mongoose ODM
- **PDF Export**: Professional PDFs with custom branding
- **Form Validation**: Real-time validation with user-friendly error messages

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internity-diet-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/internity_diet_planner
   RATE_LIMIT_WINDOW=900000
   RATE_LIMIT_MAX=100
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Start the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and go to `http://localhost:3000`

## 📁 Project Structure

```
internity-diet-planner/
├── public/                 # Static assets
│   ├── css/               # Stylesheets
│   │   ├── styles.css     # Main styles
│   │   ├── form.css       # Form-specific styles
│   │   └── responsive.css # Mobile responsiveness
│   ├── js/                # Frontend JavaScript
│   │   ├── main.js        # Core application logic
│   │   ├── form-validation.js # Form validation
│   │   ├── form-navigation.js # Multi-step navigation
│   │   └── api.js         # API communication
│   └── images/            # Static images
├── src/                   # Backend source code
│   ├── database/          # Database models
│   │   ├── User.js        # User model
│   │   ├── DietPlan.js    # Diet plan model
│   │   └── Food.js        # Food database model
│   ├── routes/            # API routes
│   │   ├── api.js         # Main API routes
│   │   └── pdf.js         # PDF generation routes
│   ├── services/          # Business logic services
│   │   └── PDFGenerator.js # PDF generation service
│   └── utils/             # Utility functions
│       └── initializeDatabase.js # Database initialization
├── temp/                  # Temporary files
│   └── pdfs/             # Generated PDF files
├── index.html             # Main application page
├── server.js              # Express server
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔧 API Endpoints

### User Management
- `POST /api/user` - Create or update user profile
- `GET /api/user/:userId` - Get user profile

### Diet Plan Generation
- `POST /api/generate` - Generate personalized diet plan
- `GET /api/plan/:planId` - Get specific diet plan
- `GET /api/user/:userId/plans` - Get user's diet plans

### Food Database
- `GET /api/foods/search` - Search foods by name/category
- `GET /api/foods/:foodId` - Get specific food details
- `GET /api/foods/categories` - Get food categories

### PDF Generation
- `GET /api/pdf/diet-plan/:planId` - Download diet plan PDF
- `GET /api/pdf/user/:userId/current-plan` - Download current plan PDF
- `GET /api/pdf/preview/:planId` - Preview PDF in browser

### Utility
- `GET /api/health` - Health check endpoint
- `GET /api/status` - API status information

## 🎨 Design System

### Color Palette
- **Primary**: #000000 (Black)
- **Secondary**: #666666 (Grey)
- **Accent**: #CCCCCC (Light Grey)
- **Background**: #FFFFFF (White)
- **Text**: #333333 (Dark Grey)
- **Light Text**: #888888 (Medium Grey)

### Typography
- **Headers**: 'Poppins', sans-serif (Bold)
- **Body**: 'Inter', sans-serif (Regular)
- **Monospace**: 'Fira Code', monospace

### Components
- Modern form controls with subtle shadows
- Gradient backgrounds for visual appeal
- Consistent spacing using CSS custom properties
- Responsive grid layouts

## 🔐 Security Features

- **Helmet.js**: Security headers protection
- **Rate Limiting**: API request throttling
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error management

## 📊 Database Schema

### User Model
- Personal information (name, age, gender, height, weight)
- Goals and preferences
- Dietary restrictions and allergies
- Lifestyle and activity data
- Health conditions

### Diet Plan Model
- User reference and plan details
- Weekly meal plans with nutrition data
- Shopping lists and recipes
- Progress tracking data

### Food Model
- Comprehensive nutrition data
- Dietary classifications (vegan, keto, etc.)
- Allergen information
- Serving sizes and preparation methods

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set appropriate rate limits
4. Configure CORS for production domains

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] SSL certificate installed
- [ ] Rate limiting configured
- [ ] Error logging implemented
- [ ] Backup strategy in place

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@internitydietplanner.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

## 🔮 Future Enhancements

- [ ] Machine learning for better meal recommendations
- [ ] Mobile app development
- [ ] Integration with fitness trackers
- [ ] Nutritionist consultation features
- [ ] Meal photo recognition
- [ ] Social features and community
- [ ] Advanced analytics and reporting

---

**INTERNITY DIET PLANNER** - Your personalized path to better nutrition and health.