# Ingredia
## Tools Used
- Frontend:
    [![React](https://img.shields.io/badge/-React-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)](https://react.dev/)
    [![TypeScript](https://img.shields.io/badge/-TypeScript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
    [![JavaScript](https://img.shields.io/badge/-JavaScript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- Backend:
    [![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
    [![Express.js](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
- Databases:
    [![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
- Data: [Kaggle - Food Ingredients List](https://www.kaggle.com/datasets/datafiniti/food-ingredient-lists), Open Food Facts API

## Steps on How to Run/Deploy Code
- Installations
    - `npm install`
    - `npm install lucide-react`
    - `npm install mongodb mongoose bcryptjs dotenv`
- Environment variables (ensure it's under backend/)
- Backend
    - Open up 1st terminal: `cd backend && node seed.js`
    - Open up 2nd terminal: `cd backend && node server.js`
- Frontend
    - Open up 3rd terminal: `cd frontend`
    - Dev: `npm start`
        - Build: `npm run build` (deploy the `build/` folder to a static host)
        - Open http://localhost:3000

## Project Description
- **Goal:** Help users evaluate product ingredients against personal dietary preferences and provide lightweight community reviews for safety-awareness.
- **Audience:** Consumers with allergies or dietary restrictions and medical professionals/reviewers who can provide product assessments.

Ingredia is a social networking for connecting others in regards to checking ingredients within products to indicate if it is healthy, hazardous, unsafe, etc. This app helps users evaluate product ingredients against personal preferences (allergies and ingredients to avoid) and view simple product reviews.

## Working Sections
- **LoginPage**: client-side login (works)
- **Product list & search**: renders demo products and supports searching (works)
- **ProductCard**: shows image, score, ingredients, and flags potential conflicts with preferences (works)
- **UserPreferencesModal**: set allergies and avoid listed items (works)
- **ReviewSection**: post reviews (works)
- **ScanModal**: UI placeholder with demo result (demo only with no real scanner)
- **Backend**: load dataset for backend

## Contributions

### Allison Pham

### Ahad Hassan

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
