# English AI Backend

Backend foundation for the global multilingual learning app.

## Services
- Guest authentication (no registration required for learning)
- Optional account endpoint
- Per-language-pair cloud progress
- Global leaderboard API
- Stripe Premium subscription checkout/webhook
- Optional Supabase persistence

## Run locally
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and configure production secrets/services.
4. `npm start`

The API listens on `http://localhost:8787` by default.

## Production requirements
Configure a real `JWT_SECRET`, Supabase project, Stripe keys/price/webhook secret, HTTPS, and a production database before publishing. Never commit `.env` or service-role keys.
