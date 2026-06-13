# Ingredia
(Cover image)

- Frontend:
    [![React](https://img.shields.io/badge/-React-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)](https://react.dev/)
    [![TypeScript](https://img.shields.io/badge/-TypeScript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
    [![JavaScript](https://img.shields.io/badge/-JavaScript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- Backend:
    [![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
    [![Express.js](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
- Databases:
    [![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
- Data: [Kaggle - Food Ingredients List](https://www.kaggle.com/datasets/datafiniti/food-ingredient-lists), [Open Food Facts API](https://world.openfoodfacts.org/data)

## Project Overview
- **Goal:** Help users evaluate product ingredients against personal dietary preferences and provide lightweight community reviews for safety-awareness.
- **Audience:** Consumers with allergies or dietary restrictions and medical professionals/reviewers who can provide product assessments.

Ingredia is a social networking for connecting others in regards to checking ingredients within products to indicate if it is healthy, hazardous, unsafe, etc. This app helps users evaluate product ingredients against personal preferences (allergies and ingredients to avoid) and view simple product reviews.

## Features
- **LoginPage**: client-side login (works)
- **Product list & search**: renders demo products and supports searching (works)
- **ProductCard**: shows image, score, ingredients, and flags potential conflicts with preferences (works)
- **UserPreferencesModal**: set allergies and avoid listed items (works)
- **ReviewSection**: post reviews (works)
- **ScanModal**: UI placeholder with demo result (demo only with no real scanner)
- **Backend**: load dataset for backend

## Project Deployment Instructions: Steps on How to Run Code

### Tools, Libraries, Frameworks, and APIs
- **Frontend:** React, TypeScript, JavaScript, Lucide-React
- **Backend:** Node.js, Express.js, bcryptjs, dotenv
- **Databases:** MongoDB, Mongoose
- **APIs & Data:** Open Food Facts API, Kaggle Food Ingredients List dataset

- Ensure Git is installed (download based on OS)
- Clone this GitHub repository using an IDE (e.g. Visual Studio Code)
    - Click "Code" (green button) > HTTPS > copy `https://github.com/UCR-CS110/final-project-ingredia-ahad-allison-lynvy.git`
- Run `git clone https://github.com/UCR-CS110/final-project-ingredia-ahad-allison-lynvy.git`
- Installation commands
    - `npm install`
    - `npm install lucide-react`
    - `npm install mongodb mongoose bcryptjs dotenv express`
- Environment variables (ensure it's under backend/)
    Create a `.env` file in the `backend/` directory and add the following:
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<your_username>:<your_password>@<your_cluster_url>/<database_name>?retryWrites=true&w=majority
    ```
- Backend
    - Open up 1st terminal: `cd backend && node seed.js`
        - Only need to run once
    - Open up 2nd terminal: `cd backend && node server.js`
        - Run everytime
- Frontend
    - Open up 3rd terminal: `cd frontend`
        - Run everytime
    - Dev: `npm start`
            - Open `http://localhost:3000`
        - Build: `npm run build` (deploy the `build/` folder to a static host)

## Team Contributions
### Ahad Hassan
**Fullstack & Authentication**
- Developed the secure user authentication flow (Sign Up and Log In) using Express.js and bcryptjs, ensuring user credentials are safely managed in MongoDB.
- Finalized key React frontend components (such as the LoginPage and global layouts), polishing the UI to ensure a seamless and modern user experience.
- Conducted end-to-end testing of the application flow, verifying that user sessions, preference saving, and product rendering worked smoothly together.
- Authored and structured the project's README documentation, detailing the tech stack, deployment instructions, and feature overviews.

### Allison Pham
**Frontend**
- Adjusted preferences filtering
- Adjusted image logic so that the default image icon only displayed for any items that had images attached
- Data: display specific details for positive vs. negative in pop up card
- Search functionality
- Items
    - Fix pop up cards (when clicking "View details" for items)

**Backend and Databases**
- Have data populate automatically
- Fetch Open Food Facts API and Kaggle Food Ingredients List dataset
    - Implement data grabbing from each
- Ensure data loads dynamically (where it automatically populates)
- Switch from local storage to using MongoDB
    - Setup MongoDB storage for reviews/comments, user data information to connect each user account with the aspects they interact with (e.g. adding a comment)
    - Test database to ensure updates made through the frontend properly loads in the database
- Different roles for accounts
    - Roles: explorer (default role), expert, admin
    - Can edit admin role through database
    - Admin has access to a dashboard featuring 2 options: users and reviews
        - Users: any user with the admin role can see how many users have each role, searchability (by name, username, or email), lists all users (name, username, email, phone number, join date, role for each user)
        - Reviews: searchability (by email, item name, comment content), list all reviews, ability to delete comments from the admin dashboard
    - All users: ability to edit own and delete own comments
    - Admin only: can delete other users' comments
- Add profile button with 3 options: profile, password, account
    - Profile: ability to update profile (name, username, phone number)
    - Password: can change password
    - Account: users can see which roles they have
        - Ex: for admin, it will say "Admin - full access"
- Fix preferences functionality
    - Preferences page would pop up every time the page was reloaded
    - Preferences originally didn't save when the page was reloaded
- Scan products with option to request access to camera, handle logic if items weren't in the database, and fix logic
    - Scanning feature ended up being taken out due to the libraries having issues with scanning QR codes (e.g. it needed to match specifically with an item)
        - Attempted with 2 different libraries

**General**
- Debugged frontend, backend, and database features
- Test each aspect by noting down any bugs that arose

### Lynvy Chang
**Frontend & Design**
- Created the initial frontend design and layout for Ingredia.
- Designed and implemented the main user interface pages, including the product browsing page, product cards, scan modal, preferences modal, and navigation layout.
- Continued improving the visual design to make the app cleaner, more modern, and similar to ingredient-checking apps like Yuka.
- Implemented the login and create account pages.
- Added the authentication flow for users to sign up, log in, and log out.
- Helped build the user profile experience, including displaying a personalized welcome message.
- Worked on user preference features, including allergies and ingredients to avoid.
- Helped connect the frontend pages together and made sure the app flow was clear for the demo.

## AI Usage
We used AI when we first started to help further our ideas and come up with more features. We also used AI to debug certain parts of our code and to learn how to improve the aesthetic of our project.

## Assignment
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/c4wSHrp5)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23927610&assignment_repo_type=AssignmentRepo)
