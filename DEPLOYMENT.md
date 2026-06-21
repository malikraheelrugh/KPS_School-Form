# Backend Deployment Issue & Solution

## Problem

The backend is returning a **500 Server Error** on deployment because it tries to write to `students.json` file. On **Vercel (serverless)**, the filesystem is **read-only** — files cannot be persisted between requests.

## Root Cause

The current `backend/db.js` uses:
```javascript
fs.writeFileSync(dbPath, JSON.stringify(students, null, 2), "utf8");
```

This works locally but **fails on Vercel** because:
- Serverless functions have an ephemeral filesystem
- Files written are lost after the request completes
- This causes an `EACCES` (permission denied) or similar error → 500 response

## Solution

For **production/deployment**, you must use a persistent database. Here are the recommended approaches:

### Option 1: PostgreSQL (Recommended)
1. Create a free database at [Supabase](https://supabase.com) or [Railway](https://railway.app)
2. Install the PostgreSQL adapter in `backend/`:
   ```bash
   npm install pg
   ```
3. Update `backend/db.js` to use PostgreSQL instead of JSON
4. Set `DATABASE_URL` environment variable in your deployment platform

### Option 2: MongoDB
1. Get a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Install MongoDB driver:
   ```bash
   npm install mongodb
   ```
3. Update `backend/db.js` to use MongoDB
4. Set `MONGODB_URI` environment variable

### Option 3: Vercel KV (Simple Key-Value Store)
1. Use [Vercel KV](https://vercel.com/storage/kv) for simple persistence
2. Install:
   ```bash
   npm install @vercel/kv
   ```
3. Store students as JSON string in KV

## Quick Fix for Testing (Local Only)

If you want to keep using JSON locally but need deployment to work, you can:
- Use a mock in-memory store for serverless
- Or migrate to a real database

## Deployment Steps

1. **Choose and set up a database** (PostgreSQL recommended)
2. **Update `backend/db.js`** to use that database instead of JSON file
3. **Add environment variable** to your Vercel project settings
4. **Rebuild and redeploy**

Without this change, form submissions will always fail on Vercel with a 500 error.
