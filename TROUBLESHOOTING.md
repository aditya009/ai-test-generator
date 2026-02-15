# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: "500 Internal Server Error" when generating test cases

**Cause:** API key not provided or OpenAI response parsing failed

**Solutions:**

1. **Check your API key is entered correctly in Step 1**
   - Make sure you copied the full API key
   - It should start with `sk-` for OpenAI
   
2. **Check backend logs**
   ```bash
   cd backend
   npm run dev
   # Watch the console for detailed error messages
   ```

3. **Verify API key works**
   ```bash
   # Test OpenAI directly
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

4. **Use environment variable instead**
   ```bash
   # In backend/.env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

### Issue 2: "Failed to load resource: 404 favicon.ico"

**Fix:** Not critical, but if you want to fix it:

```bash
cd frontend/public
# Create a simple favicon
echo '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">🔍</text></svg>' > favicon.svg
```

Update `frontend/index.html`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

### Issue 3: Backend not connecting

**Check:**
1. Backend is running on port 3001
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"ok"}
   ```

2. Frontend proxy is configured
   ```javascript
   // frontend/vite.config.js should have:
   server: {
     proxy: {
       '/api': 'http://localhost:3001'
     }
   }
   ```

### Issue 4: CORS errors

**Fix:** Make sure backend CORS is configured:
```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue 5: OpenAI rate limit

**Error:** `429 Too Many Requests`

**Solutions:**
- Wait a few minutes
- Check your OpenAI usage limits
- Use Gemini or Ollama instead

### Issue 6: Empty test cases generated

**Check:**
1. User story description is detailed enough
2. Backend logs show successful API call
3. OpenAI returned valid JSON

**Fix:**
```bash
# Add more detailed user story
# Example:
As a user, I want to login to the system
So that I can access my dashboard

Acceptance Criteria:
- User can enter username and password
- System validates credentials
- User sees error for invalid credentials
- User is redirected to dashboard on success
```

## Debug Mode

**Enable detailed logging:**

**Backend:**
```javascript
// backend/server.js - already has logging
// Check console for:
// - Incoming requests
// - OpenAI API calls
// - Response parsing
```

**Frontend:**
```javascript
// frontend/src/components/Step2Generate.jsx
// Check browser console for:
// - "Sending request to backend"
// - "Received response"
// - Any error messages
```

## Still Having Issues?

1. **Check versions:**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 9+
   ```

2. **Reinstall dependencies:**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   cd ../frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check firewall/antivirus:**
   - Allow ports 3001 and 5173
   - Some antivirus software blocks local servers

4. **Test with curl:**
   ```bash
   # Test backend directly
   curl -X POST http://localhost:3001/api/llm/generate \
     -H "Content-Type: application/json" \
     -d '{
       "provider": "openai",
       "apiKey": "your-key",
       "appType": "web",
       "storyId": "TEST-1",
       "storyDescription": "As a user I want to login",
       "promptMode": "auto"
     }'
   ```

## Working Example

**Minimal test to verify everything works:**

1. Start backend with API key in .env
2. Open frontend
3. Enter these values:
   - **LLM Provider**: OpenAI
   - **API Key**: (your OpenAI key or leave blank if in .env)
   - **App Type**: Web
   - **Input Method**: Manual
   - **User Story ID**: TEST-001
   - **User Story Description**: 
     ```
     As a user, I want to login to the application
     So that I can access my account
     
     Acceptance Criteria:
     - User enters email and password
     - System validates credentials
     - User sees dashboard on success
     - User sees error message on failure
     ```
   - **Prompt Mode**: Auto

4. Click "Continue to Test Case Generation"
5. Wait 10-30 seconds
6. You should see 5-10 test cases generated!

## Contact

If you're still stuck:
- Check the GitHub issues
- Review the README.md
- Check OpenAI API status: https://status.openai.com/
