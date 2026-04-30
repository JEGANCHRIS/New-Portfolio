# 🤖 AI Career Assistant Setup Guide

This guide will help you set up the AI-powered Career Assistant feature in your portfolio.

## Overview

The AI Career Assistant allows visitors to chat with an AI version of you that can answer questions about:
- Your skills and tech stack
- Projects and experience
- Education and training
- Availability for work

## Tech Stack

- **Ollama** - Local AI for embeddings and chat (free, open-source)
- **MongoDB Atlas** - Vector search for RAG (Retrieval-Augmented Generation)
- **Node.js API** - Backend integration
- **React** - Chat UI component

---

## 📋 Prerequisites

### 1. Install Ollama

**Windows:**
```bash
# Download from: https://ollama.com/download
# Or use winget
winget install Ollama.Ollama
```

**Verify installation:**
```bash
ollama --version
```

### 2. Pull Required AI Models

```bash
# Pull the chat model (Llama 3.2 - lightweight and fast)
ollama pull llama3.2

# Pull the embedding model (for vector search)
ollama pull nomic-embed-text
```

**Verify models are installed:**
```bash
ollama list
```

You should see:
- `llama3.2`
- `nomic-embed-text`

### 3. MongoDB Atlas Setup

Since you're using **MongoDB Atlas**, you need to:

1. **Create a Vector Search Index** in your MongoDB Atlas cluster:
   - Go to your Atlas dashboard
   - Select your cluster
   - Navigate to "Collections"
   - Create a new index on the `careerinfos` collection:

```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "dimensions": 768,
        "similarity": "cosine",
        "type": "vector"
      }
    }
  }
}
```

2. **Update your MongoDB Connection String** in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
   ```

---

## 🔧 Configuration

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Update `.env` file:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-super-secret-key-change-this
   
   # AI Configuration (Ollama)
   OLLAMA_HOST=http://localhost:11434
   CHAT_MODEL=llama3.2
   EMBEDDING_MODEL=nomic-embed-text
   ```

3. **Start Ollama server** (if not running):
   ```bash
   ollama serve
   ```

4. **Start the backend:**
   ```bash
   npm start
   # or
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

---

## 🚀 Seeding Your Career Data

Once your backend is running and Ollama is active:

1. **Login to your admin panel** at `http://localhost:5173`

2. **Seed the AI knowledge base** by making a POST request:

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/ai-chat/seed \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Or use the Admin Dashboard** (coming soon):
- Navigate to Admin Dashboard
- Click "Seed AI Knowledge Base"

This will:
- Extract all your portfolio data (skills, experience, projects, etc.)
- Generate vector embeddings using Ollama
- Store them in MongoDB for semantic search

---

## 🎯 How It Works

### User Flow:
1. Visitor clicks the "Ask AI" floating button
2. Chat window opens with a welcome message
3. Visitor asks a question (e.g., "What's your experience with React?")
4. Backend:
   - Converts question to vector embedding
   - Searches MongoDB for similar content
   - Retrieves relevant information (RAG)
   - Sends context + question to Ollama
   - Returns AI response
5. Response displays in chat with source citations

### Example Questions:
- "What are your top technical skills?"
- "Tell me about your recent projects"
- "Are you available for freelance work?"
- "What's your experience with Node.js?"
- "How can I contact you?"

---

## 🧪 Testing the AI Assistant

### Test without Ollama (Fallback Mode):
If Ollama isn't running, the chat will show a friendly fallback message directing users to your email.

### Test with Ollama:
1. Ensure Ollama is running: `ollama serve`
2. Start your backend
3. Open your portfolio
4. Click the "Ask AI" button
5. Try asking: "What skills do you have?"

---

## 🛠️ Troubleshooting

### "Ollama server not running" error:
```bash
# Start Ollama
ollama serve

# Or restart
ollama serve --debug
```

### "Model not found" error:
```bash
# Re-pull the model
ollama pull llama3.2
ollama pull nomic-embed-text
```

### MongoDB Vector Search errors:
- Ensure you created the vector index in Atlas
- Check your connection string includes proper credentials
- Verify the index name is `career_info_index`

### Slow responses:
- Llama 3.2 is already optimized for speed
- For faster responses, consider using `phi3` model:
  ```bash
  ollama pull phi3
  ```
  Then update `.env`: `CHAT_MODEL=phi3`

---

## 🎨 Customization

### Change AI Personality:
Edit the `systemPrompt` in `backend/routes/ai-chat.js`:
```javascript
const systemPrompt = `You are Meshach Christo's AI Career Assistant...`;
```

### Modify Chat UI Colors:
Edit `frontend/src/components/AICareerAssistant.css`:
```css
.ai-chat-toggle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adjust Suggestions:
Edit the `suggestions` array in `backend/routes/ai-chat.js`:
```javascript
const suggestions = [
  "What are Meshach's top technical skills?",
  // Add your custom questions
];
```

---

## 📊 Admin Features

### View Knowledge Base:
```bash
GET http://localhost:5000/api/ai-chat/knowledge-base
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Re-seed Data:
```bash
POST http://localhost:5000/api/ai-chat/seed
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 🚀 Deployment

### For Production:

1. **Ollama on Production:**
   - Deploy Ollama on your server (requires 4GB+ RAM)
   - Or use a cloud AI service (OpenAI, Gemini)

2. **Alternative: Use Cloud AI**
   Update `.env` to use OpenAI or Gemini:
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=your-api-key
   CHAT_MODEL=gpt-3.5-turbo
   EMBEDDING_MODEL=text-embedding-ada-002
   ```

3. **MongoDB Atlas:**
   - Already configured for cloud
   - Ensure vector search is enabled

---

## 📝 Notes

- **Privacy:** All AI processing happens locally with Ollama
- **Cost:** Free to run (no API fees)
- **Performance:** First response may take 2-5 seconds
- **Offline:** Works without internet (except MongoDB connection)

---

## 🎉 Success!

You now have an AI-powered Career Assistant that:
✅ Chats with visitors 24/7
✅ Answers questions about your skills
✅ Showcases your projects
✅ Helps with recruitment
✅ Makes your portfolio stand out!

**Test it now:**
1. Start Ollama: `ollama serve`
2. Start backend: `npm run dev`
3. Start frontend: `npm run dev`
4. Visit your portfolio and click "Ask AI"

---

## 📞 Support

If you encounter issues:
1. Check Ollama is running: `ollama list`
2. Verify MongoDB connection
3. Check backend logs for errors
4. Ensure frontend API URL is correct

**Resources:**
- [Ollama Docs](https://ollama.com/docs)
- [MongoDB Atlas Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/)
- [RAG Explained](https://www.mongodb.com/resources/basics/retrieval-augmented-generation-rag)
