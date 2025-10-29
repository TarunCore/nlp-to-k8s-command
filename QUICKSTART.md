# Quick Start Guide

Get the Kubernetes NLP Command Executor running in 3 minutes!

## Prerequisites Check

Before starting, verify you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ kubectl configured (`kubectl version`)
- ✅ OpenAI API key ([Get one](https://platform.openai.com/api-keys))

## Installation (2 minutes)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Environment

```bash
# Create .env file from example
cd ../server
cp .env.example .env
```

**Edit `server/.env`** and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini
PORT=4000
```

## Run the App (1 minute)

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

Expected output: `Server is running on port 4000`

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

Expected output: `Local: http://localhost:5173/`

## Test It Out!

1. Open http://localhost:5173 in your browser
2. Type: **"show all pods"**
3. Click **Execute** (or press Ctrl+Enter)
4. See the magic happen! ✨

## Example Commands to Try

- "list all pods"
- "get pods in kube-system namespace"
- "describe service kubernetes"
- "show all namespaces"
- "get deployment status in default namespace"

## Troubleshooting

### Can't connect to backend?
- Check backend is running: `curl http://localhost:4000`
- Should return: "Kubernetes NLP Command Executor API"

### kubectl commands failing?
- Test kubectl: `kubectl get pods`
- Check cluster connection: `kubectl cluster-info`

### OpenAI errors?
- Verify API key in `server/.env`
- Check OpenAI account has credits
- Try model `gpt-3.5-turbo` if `gpt-4o-mini` fails

## What Commands Are Safe?

✅ **Allowed** (read-only):
- `get` - View resources
- `describe` - Detailed info
- `logs` - Container logs
- `rollout` - Deployment status
- `scale` - View replicas

❌ **Blocked** (dangerous):
- `delete` - Deletes resources
- `apply` - Modifies config
- `create` - Creates resources

The app will reject any dangerous commands automatically!

## Next Steps

See [README.md](README.md) for full documentation, API details, and advanced usage.

Happy commanding! 🚀
