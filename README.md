## Resume Builder
A full-stack web application that empowers users to easily create, edit, and manage their professional resumes. This platform includes AI-powered suggestions to help craft compelling descriptions and allows users to download their resumes as professional PDF documents. All resume data is securely saved for future access and modification.

## Features
1. Create Resumes: Start a new resume from scratch with a clean, intuitive form.

2. Edit Resumes: Modify existing resume details, including personal information, education, experience, skills, projects, certifications, and languages.

3. Delete Resumes: Remove unwanted resumes from your collection.

4. AI Suggestions: Leverage artificial intelligence to generate enhanced descriptions for your experience and project sections, helping you articulate your achievements effectively.

5. Download PDF: Export your completed resume as a high-quality, print-ready PDF document.

6. Save Resumes: All your resume data is securely saved to the database, allowing you to access and update it at any time.

## Technologies Used
This project is built using a modern MERN (MongoDB, Express.js, React, Node.js) stack, complemented by various libraries and tools for a robust and user-friendly experience.

### Frontend:

1. React.js: A JavaScript library for building user interfaces.

2. Vite: A fast build tool for modern web projects.

3. Tailwind CSS: A utility-first CSS framework for rapid UI development.

4. React Router DOM: For declarative routing in React applications.

5. Axios: Promise-based HTTP client for making API requests.

6. React Draft Wysiwyg & Draft.js: Rich text editor for detailed descriptions.

7. React Toastify: For displaying stylish notifications.

8. html2pdf.js: For client-side PDF generation from HTML content.

9. DOMPurify: To sanitize HTML content.

### Backend:

1. Node.js & Express.js: A powerful and flexible web application framework for Node.js.

2. MongoDB & Mongoose: A NoSQL database and an ODM (Object Data Modeling) library for MongoDB.

3. dotenv: To load environment variables from a .env file.

4. bcryptjs: For hashing passwords securely.

5. jsonwebtoken: For implementing JSON Web Tokens for authentication.

6. cors: Middleware for enabling Cross-Origin Resource Sharing.

7. helmet: Helps secure Express apps by setting various HTTP headers.

8. express-rate-limit: To limit repeated requests to public APIs and/or endpoints.

9. morgan: HTTP request logger middleware.

10. OpenAI / Hugging Face Inference: (Based on your package.json, you have both openai and @huggingface/inference. The actual AI model used depends on your aiController.js implementation.)

## Setup and Installation
Follow these steps to get the project up and running on your local machine.

### Prerequisites
Node.js (v18 or higher recommended)

npm (comes with Node.js)

MongoDB Atlas Account (or a local MongoDB instance)

Git

## Backend Setup
### Clone the repository:

git clone https://github.com/Artemis6161/resume-builder.git
cd resume-builder/Backend # Navigate into the backend directory

### Install dependencies:

npm install

### Create a .env file in the Backend directory and add the following environment variables:

PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING # Get this from MongoDB Atlas
JWT_SECRET=YOUR_RANDOM_SECRET_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY # Or HUGGINGFACE_API_KEY if using Hugging Face
FRONTEND_URL=http://localhost:5173 # Or your deployed frontend URL

* MONGO_URI: Get this from your MongoDB Atlas cluster. Remember to whitelist your current IP address (or 0.0.0.0/0 for development) in Network Access.

* JWT_SECRET: Generate a strong, random string.

* OPENAI_API_KEY / HUGGINGFACE_API_KEY: Obtain API keys from OpenAI or Hugging Face for AI suggestions.

* FRONTEND_URL: Set this to the URL where your frontend will be running (e.g., http://localhost:5173 for local development, or your Render frontend URL for deployed backend).

### Start the backend server:

npm start

The backend server will start on http://localhost:5000 (or your specified PORT).

## Frontend Setup
### Navigate to the frontend directory:

cd ../Frontend/resume-builder # From the Backend directory, or adjust path

### Install dependencies:

npm install

### Create a .env file in the Frontend/resume-builder directory and add the following environment variable:

VITE_APP_BACKEND_URL=http://localhost:5000 # Or your deployed backend URL

VITE_APP_BACKEND_URL: Set this to the URL where your backend is running (e.g., http://localhost:5000 for local development, or your Render backend URL for deployed frontend).

### Start the frontend development server:

npm run dev

The frontend application will open in your browser, usually at http://localhost:5173.

## Usage
1. Register/Login: Access the application through your browser and create a new account or log in if you already have one.

2. Dashboard: After logging in, you'll be directed to your dashboard where you can see all your saved resumes.

3. Create Resume: Click the "Create Resume" button to start building a new resume.

4. Fill in Details: Navigate through the form sections (Basic Info, Education, Experience, etc.) to input your resume details.

5. AI Enhance: Use the "✨ AI Enhance" button next to description fields to get AI-generated suggestions.

6. Save: Click "Save Resume" to persist your changes to the database.

7. Download PDF: Once you're satisfied, click "Download PDF" to get a printable version of your resume.

## Deployment
This project is designed for deployment on platforms like Render. Ensure you configure environment variables (MONGO_URI, JWT_SECRET, OPENAI_API_KEY/HUGGINGFACE_API_KEY, FRONTEND_URL for backend, and VITE_APP_BACKEND_URL for frontend) correctly on your chosen hosting provider. Remember to whitelist Render's IP addresses in your MongoDB Atlas Network Access settings.

