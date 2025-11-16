# Restart Backend Server

## Steps to fix the "Invalid Token" error:

1. **Stop the current backend server**
   - Go to the terminal running the backend
   - Press `Ctrl + C` to stop it

2. **Verify JWT_SECRET is in .env file**
   - The `.env` file should contain:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_L6hqpYu9WjAX@ep-little-mouse-a1qssbep-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

3. **Restart the backend**
   ```bash
   cd backend
   npm run dev
   ```

4. **Test the login flow**
   - Go to the login page
   - Login with your credentials
   - The token should now work properly

5. **Add items to cart**
   - After logging in, try adding products to cart
   - It should work without "Invalid token" errors

## If the issue persists:

1. Clear your browser's localStorage:
   ```javascript
   // Open browser console and run:
   localStorage.clear()
   ```

2. Login again with fresh credentials

3. Try adding to cart again
