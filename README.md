# Ingredia
<div align="center">
    <strong>Ingredia</strong> is a web app for evaluating product ingredients.
</div>

<div align="center">
    Flag allergens, additives, and unwanted ingredients, while browsing product reviews.
</div>

<div align="center">
    <img src="cover.png" width="600" />
    <!-- ![Cover](cover.png) -->
</div>

<div align="center">

[![React](https://img.shields.io/badge/-React-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/-Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Figma](https://img.shields.io/badge/-Figma-%23F24E1E.svg?style=flat-square&logo=figma&logoColor=white)](https://figma.com/)

</div>

## Project Overview
Ingredia is a social networking for connecting others in regards to checking ingredients within products to indicate if it is healthy, hazardous, unsafe, etc. The web app helps users evaluate product ingredients against personal preferences (allergies and ingredients to avoid) and view product reviews.
- **Goal:** help users evaluate product ingredients against personal dietary preferences and provide lightweight community reviews for safety-awareness
- **Audience:** consumers with allergies or dietary restrictions and medical professionals/reviewers who can provide product assessments

## Features
| **Overview** | **Details** |
|---|---|
| Auth | • Users can register (name, username, email, phone, password)<br>• Password strength validation<br>• Login and logout options |
| Products | • Search products through dataset<br>• Filter by category and dietary restrictions<br>• Flag potential conflicts with preferences<br>• Ingredient analysis (score, positive, negative)<br>• English-specific filtering |
| Reviews and Comments | • View available user reviews per product<br>• Post a review with star rating and comment<br>• All users can edit their own reviews |
| User Profile | • View and update name, username, and phone<br>• Change password option<br>• Role display (explorer, expert, admin) |
| Admin Dashboard | • View all users and reviews<br>• Can delete any user review (within reason) |
| Database | • Store core information into MongoDB<br>• User model - stores user info<br>• Review model - stores reviews per product |

## Project Deployment
### Tech Stack
| **Category** | **Technologies (Tools, Libraries, Frameworks, APIs)** |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Express.js (ran on Node.js, files handled in JavaScript) |
| Databases | MongoDB, Mongoose |
| APIs and Data | [Open Food Facts API](https://world.openfoodfacts.org/data), [Kaggle - Food Ingredients List](https://www.kaggle.com/datasets/datafiniti/food-ingredient-lists) |

### Instructions: Steps on How to Run 
| **Step** | **Instructions** |
|---|---|
| Git + GitHub Setup | • Ensure Git is installed ([download](https://git-scm.com/install/windows) based on OS)<br>• Clone [this GitHub repository](https://github.com/UCR-CS110/final-project-ingredia-ahad-allison-lynvy) using an IDE (e.g. Visual Studio Code)<br>&nbsp;&nbsp;&nbsp;&nbsp;• Click "Code" (green button) > HTTPS > copy `https://github.com/UCR-CS110/final-project-ingredia-ahad-allison-lynvy.git`<br>• Run `git clone "https://github.com/UCR-CS110/final-project-ingredia-ahad-allison-lynvy.git"` |
| Installation | • Run `npm install`<br>• Run `npm install lucide-react`<br>• Run `npm install mongodb mongoose bcryptjs dotenv express` |
| Environment Variables | Create a `.env` file in the `backend/` folder.<br><br>`PORT=5000`<br>`MONGO_URI=mongodb+srv://<username>:<password>@<cluster_url>/<database_name>?retryWrites=true&w=majority` |
| Backend | • Open up 1st terminal: `cd backend && node seed.js`<br>&nbsp;&nbsp;&nbsp;&nbsp;• Only need to run once<br>• Open up 2nd terminal: `cd backend && node server.js`<br>&nbsp;&nbsp;&nbsp;&nbsp;• Run everytime |
| Frontend | • Open up 3rd terminal: `cd frontend`<br>&nbsp;&nbsp;&nbsp;&nbsp;• Run everytime<br>• Dev: `npm start`<br>&nbsp;&nbsp;&nbsp;&nbsp;• Build: `npm run build` (deploy the `build/` folder to a static host)<br>&nbsp;&nbsp;&nbsp;&nbsp;• Open http://localhost:3000 |

## Team Contributions
### Ahad Hassan
**Fullstack & Authentication**
- Developed the secure user authentication flow (Sign Up and Log In) using Express.js and bcryptjs, ensuring user credentials are safely managed in MongoDB.
- Finalized key React frontend components (such as the LoginPage and global layouts), polishing the UI to ensure a seamless and modern user experience.
- Conducted end-to-end testing of the application flow, verifying that user sessions, preference saving, and product rendering worked smoothly together.
- Authored and structured the project's README documentation, detailing the tech stack, deployment instructions, and feature overviews.

### Allison Pham
**Frontend**
- Search functionality for products
- Preferences filtering with implementation of save (regardless of reloads)
- Pop up cards
    - Update pop up cards for products with details for positive vs. negative breakdown
    - Fix "View details" to ensure a card pops up
- Image fallback logic for missing product images (image icon for products are only displayed for items that had images attached)

**Backend and Databases**
- Migrated from storing locally to MongoDB database
    - Setup MongoDB storage for reviews/comments, user data information to connect each user account with the aspects they interact with (e.g. adding a comment)
    - Test database to ensure updates made through the frontend properly loads in the database
- Connect user accounts to their interactions, reviews/comments, etc.
- Fetch data from datasets (Open Food Facts API and Kaggle Food Ingredients List)
- Ensure data loads dynamically (where it automatically populates)
- Implement different roles for user accounts
    - Roles: explorer (default), expert, admin
        - Admin role is assignable through database
    - Admin dashboard features 2 views: users and reviews
        - Users: see how many users have each role (3 types of roles), searchability (by name, username, or email), lists all users (name, username, email, phone number, join date, role)
        - Reviews: searchability (by email, item name, comment content), list all reviews, ability to delete comments from dashboard
    - All users: ability to edit own and  their own reviews
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
    - Scanning feature ended up being taken out due to the libraries having issues with scannining QR codes (e.g. it needed to match specifically with an item)
        - Attempted with 2 different libraries

**General**
- Debugged frontend, backend, and database features end-to-end
- Test each aspect by noting down any bugs that arose

### Lynvy Chang
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
