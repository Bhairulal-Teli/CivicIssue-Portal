# Civic Issue Management Admin Portal

A comprehensive React-based admin portal for managing civic issues, designed for municipal staff to efficiently handle citizen reports, track progress, and analyze performance metrics.

## 🚀 Features

### 📊 Dashboard
- Real-time overview of issues statistics
- Recent issues display
- Department performance metrics
- Key performance indicators

### 📋 Issue Management
- View all reported issues with filtering options
- Search functionality across titles, descriptions, and locations
- Detailed issue view with media attachments
- Task assignment to departments
- Status updates and progress tracking

### 🏢 Department Management
- Department overview with performance metrics
- Active issues count per department
- Average response times
- Efficiency tracking

### 📈 Analytics & Reporting
- Issues breakdown by category and priority
- Response time metrics
- Resolution rates
- Monthly trends visualization
- Export functionality

### ⚙️ Settings & Configuration
- Notification preferences
- System configuration
- User profile management
- Security settings

## 🛠️ Technical Stack

- **Frontend**: React 18, Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Styling**: Tailwind CSS with custom components
- **API Integration**: Axios-ready service layer
- **Build Tool**: Create React App

## 📁 Project Structure

```
admin-portal/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── issues/          # Issue management
│   │   ├── departments/     # Department management
│   │   └── analytics/       # Analytics components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services and utilities
│   ├── data/                # Mock data and constants
│   ├── App.jsx              # Main application component
│   └── index.js             # Application entry point
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd civic-admin-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

## 🔌 Backend Integration

### API Endpoints Expected

The frontend is designed to work with the following API structure:

```
GET /api/issues              # Get all issues with filters
GET /api/issues/:id          # Get single issue
POST /api/issues             # Create new issue
PUT /api/issues/:id          # Update issue
DELETE /api/issues/:id       # Delete issue
PATCH /api/issues/:id/assign # Assign issue to department

GET /api/departments         # Get all departments
GET /api/departments/:id     # Get single department
POST /api/departments        # Create department
PUT /api/departments/:id     # Update department

GET /api/analytics/dashboard # Get dashboard analytics
GET /api/analytics/trends    # Get trend data
```

### Data Format

Issues should follow this structure:
```json
{
  "id": "101",
  "title": "Pothole on Main Road",
  "description": "Large pothole causing damage to vehicles",
  "status": "Pending",
  "priority": "High",
  "category": "Roads",
  "date": "2024-03-15",
  "location": "Main Road & Oak Street",
  "lastUpdate": "2024-03-15",
  "type": "image",
  "source": "path/to/media/file",
  "assignedTo": "Department Name",
  "reportedBy": "Citizen Name"
}
```

## 🎨 Customization

### Theme Configuration

The application uses a blue and white theme. You can customize colors in:
- `tailwind.config.js` - Tailwind color palette
- `src/App.css` - Custom CSS variables

### Adding New Components

1. Create component file in appropriate directory
2. Follow the existing naming convention
3. Export from the component file
4. Import in the parent component

### API Integration

Replace mock data in `src/data/mockData.js` with actual API calls:

```javascript
// Replace this
import { mockIssues } from '../data/mockData';

// With this
import { useApi } from '../hooks/useApi';
import api from '../services/api';

const { data: issues, loading, error } = useApi(() => api.issues.getAll());
```

## 📱 Responsive Design

The portal is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- Input validation and sanitization
- Protected routes (ready for authentication)
- Secure API communication
- CSRF protection ready
- Role-based access control structure

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` directory with optimized production files.

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Performance Optimization

- Lazy loading for routes and components
- Image optimization
- Bundle splitting
- Memoization of expensive calculations
- Virtual scrolling for large lists (ready to implement)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app integration
- [ ] Multi-language support
- [ ] Dark theme
- [ ] Advanced filtering options
- [ ] Bulk operations
- [ ] Report generation
- [ ] Integration with GIS systems
- [ ] Citizen feedback system

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide React for the beautiful icons
- SIH (Smart India Hackathon) for the inspiration