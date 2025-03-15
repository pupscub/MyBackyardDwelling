# MyBackyardDwelling - ADU Property Analysis Platform

MyBackyardDwelling is a web application that helps property owners determine the potential for building an Accessory Dwelling Unit (ADU) on their property. The platform analyzes property details, local zoning laws, and building regulations to provide tailored recommendations.

## Features

- AI-powered property analysis based on address
- Custom ADU design recommendations
- Permit expedition guidance
- Interactive property visualization with Google Maps satellite imagery
- Comprehensive property reports with zoning, setbacks, and ADU potential

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Flask (Python)
- **Database**: SQLite (development), MySQL (production)
- **APIs**: Google Maps Static API

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn
- Python 3.8+
- Git

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mybackyarddwelling.git
   cd mybackyarddwelling
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your credentials
   ```

5. Start the backend server:
   ```bash
   python app.py
   ```

## Deployment

See the [DEPLOYMENT.md](DEPLOYMENT.md) file for detailed deployment instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact [info@mybackyarddwelling.com](mailto:info@mybackyarddwelling.com).
