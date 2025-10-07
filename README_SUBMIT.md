# E-commerce-Mern — Quick start for reviewers

This file contains minimal instructions to run the project locally for review and grading. It focuses on getting the backend and frontend running, seeding a demo seller account, and notes about optional services (Cloudinary, Stripe).

Prerequisites
- Node.js (>=16 recommended)
- npm
- MongoDB running locally or a connection string

1) Copy env
- Copy `.env.example` to `.env` in the repo root and fill in any values you want to provide. For basic testing you only need PORT, MONGO_URL and JWT_SECRET. Cloudinary and Stripe are optional.

2) Install dependencies
- Backend:
  - cd backend
  - npm install

- Frontend:
  - cd frontend
  - npm install

3) Seed a demo seller (optional but recommended for admin flows)
- From the `backend` folder run:
  - node scripts/seedDemoSeller.js

  This will create or update a demo seller with credentials:
    email: seller@example.com
    password: sellerpassword123

4) Start the backend
- From `backend`:
  - npm run dev

  Backend defaults to port 2005 (see `.env.example`). If the port is in use you'll see an error; fix by freeing the port or changing PORT.

5) Start the frontend
- From `frontend`:
  - npm run dev

  Vite may auto-select a different port if 5173 is in use (it will print the chosen port).

6) Test admin flow
- Open the frontend (Vite will provide a local URL). To sign in as a seller, use the seeded credentials above at the seller login page.
- After login, try Admin Add Product — if you didn't provide Cloudinary credentials the app will upload a placeholder image automatically.

7) Stripe / Payments
- A Stripe Checkout session endpoint exists at `/api/payment/create-checkout-session`. To test it end-to-end you'll need to set `STRIPE_SECRET_KEY` in your backend `.env`. Otherwise the endpoint will error.

8) Debugging tips
- If product uploads return 401: the frontend may be using a user token instead of a seller token. Re-login via the seller login page.
- Use the debug endpoint to inspect the stored token payload:
  - GET /api/debug/token with header `Authorization: Bearer <token>`

9) Notes
- Cloudinary: If you don't set Cloudinary env vars the app will still work and use a placeholder image for product uploads.
- Do NOT commit your real `.env` file or any secrets to git.

If you'd like, I can also add a seed script to create a demo product and a demo user; I already added a product seeding script earlier and ran it (ID printed during run).
