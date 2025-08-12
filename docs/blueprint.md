# **App Name**: EcoSwap

## Core Features:

- Account Flow: Implement a user account flow with login/signup functionality, adhering to a dark, minimal UI design. This will reuse an open-source template with neutral branding, featuring smooth animations using Framer Motion for enhanced user experience. User shall be able to create an account also, he can create it using his mail id. and he can even reset password using forgot password, where his account password will be mailed to him.
- Product Catalogue: Develop a product catalog displaying product name, carbon footprint, organic badge, and category badge. Implement a full-text search functionality by name and description. Prototype with 10 items of dummy data.
- Cart & Recommendation Flow: Enable users to 'Add to cart', opening a pop-up listing similar items. Display a ≤120-word paragraph for each suggestion, comparing it to the item just chosen, generated on-demand via Gemini. Add gemini pro api key to .env file. The model will use reasoning tool to decide which information is most important to display.
- Gamification: Implement a gamification system that awards points when the user switches to a more sustainable alternative. The points will be stored in the user's profile. Implement a leaderboard and lifetime points visible in /profile.

## Style Guidelines:

- Primary color: Deep purple (#673AB7) to convey sophistication and environmental consciousness.
- Background color: Dark gray (#303030) for a sleek and modern feel.
- Accent color: Teal (#009688) to highlight interactive elements and indicate sustainability.
- Body and headline font: 'Inter' (sans-serif) for a clean, modern, neutral aesthetic.
- Code Font: 'Source Code Pro' for displaying any code snippets or technical information.
- Use minimalist icons with a line art style to represent product categories and actions, ensuring they are accessible and visually clear.
- Incorporate subtle animations using Framer Motion for page transitions and card interactions to create a smooth and engaging user experience.