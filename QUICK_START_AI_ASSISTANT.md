# Quick Start - AI Career Assistant

## Step 1: Install & Start Ollama

```bash
# If Ollama is not installed, download from: https://ollama.com/download

# Pull required models
ollama pull llama3.2
ollama pull nomic-embed-text

# Start Ollama server (keep this running in a separate terminal)
ollama serve
```

## Step 2: Update MongoDB Connection

Since you're using **MongoDB Atlas**, update your `.env` file:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/portfolio
```

## Step 3: Create Vector Search Index in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster → Collections
3. Create collection: `careerinfos`
4. Click "Create Search Index"
5. Choose "Vector Search"
6. Configure:
   - Index Name: `career_info_index`
   - Collection: `careerinfos`
   - Path: `embedding`
   - Dimensions: `768`
   - Similarity: `cosine`

## Step 4: Start Your Application

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Step 5: Seed Your Career Data

After logging into the admin panel, seed the AI knowledge base:

```bash
# First, login to get a token
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"your-email\",\"password\":\"your-password\"}"

# Then use the token to seed
curl -X POST http://localhost:5000/api/ai-chat/seed ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Step 6: Test the AI Assistant

1. Open `http://localhost:5173`
2. Click "Guest Access" or login as admin
3. Look for the purple "Ask AI" button in the bottom-right
4. Click it and ask: "What are your skills?"

---

## Troubleshooting

### "Connection refused" error:
Make sure Ollama is running:
```bash
ollama serve
```

### Slow responses:
First response takes 2-5 seconds. Subsequent responses are faster.

### No MongoDB Atlas? Use Local:
If you want to use local MongoDB instead:

1. Update `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio
   ```

2. The AI chat will work but **vector search requires MongoDB Atlas** or a different approach.

---

## What You Get

✅ Floating AI chat widget on your portfolio
✅ Answers questions about your skills, experience, projects
✅ Provides source citations
✅ Works 24/7 for visitors
✅ Fallback message when Ollama is offline

---

## Files Created

**Backend:**
- `backend/models/CareerInfo.js` - Vector database model
- `backend/routes/ai-chat.js` - AI chat API endpoints
- `backend/server.js` - Updated with AI route

**Frontend:**
- `frontend/src/components/AICareerAssistant.jsx` - Chat UI component
- `frontend/src/components/AICareerAssistant.css` - Chat styles
- `frontend/src/components/Portfolio.jsx` - Integrated AI assistant

**Documentation:**
- `AI_CAREER_ASSISTANT_SETUP.md` - Full setup guide
- `QUICK_START_AI_ASSISTANT.md` - This file
