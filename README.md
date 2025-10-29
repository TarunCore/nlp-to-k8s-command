# Kubernetes NLP Command Executor

A full-stack web application that translates natural language instructions into kubectl commands using OpenAI's GPT models, safely executes them, and displays the results.

## Features

- 🗣️ **Natural Language Processing**: Type commands in plain English
- 🤖 **AI-Powered Translation**: Uses OpenAI GPT to convert text to kubectl commands
- 🔒 **Safe Execution**: Only allows read-only kubectl commands (get, describe, logs, etc.)
- 📊 **Real-time Output**: See command output and errors instantly
- 📚 **Command History**: Track your last 10 executed commands
- 🎨 **Modern UI**: Beautiful interface built with React and TailwindCSS

## Tech Stack

**Frontend:**
- React 19
- TypeScript
- TailwindCSS 4
- Vite

**Backend:**
- Node.js
- Express
- OpenAI API
- TypeScript

## Prerequisites

- Node.js 18+ installed
- kubectl configured with access to a Kubernetes cluster
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Setup Instructions

### 1. Clone and Install

```bash
# Navigate to project directory
cd nlp-kubernetes

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini
PORT=4000
```

### 3. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

The backend will start on http://localhost:4000

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

The frontend will start on http://localhost:5173 (or another port if 5173 is busy)

### 4. Use the Application

1. Open your browser to the frontend URL (e.g., http://localhost:5173)
2. Type a natural language command, such as:
   - "show all pods in dev namespace"
   - "get the logs of nginx-pod"
   - "describe the service called api-service"
3. Click "Execute" or press Ctrl+Enter
4. View the generated kubectl command and its output

## Example Commands

Here are some example natural language commands you can try:

- "list all pods"
- "show pods in kube-system namespace"
- "get logs from my-app pod"
- "describe service nginx-service"
- "show all deployments"
- "get nodes"
- "describe pod my-pod in production namespace"

## Security Features

### Command Whitelist

The backend only allows these safe, read-only kubectl verbs:
- `get` - View resources
- `describe` - Show detailed information
- `logs` - View container logs
- `exec` - Execute commands in containers
- `rollout` - View rollout status
- `scale` - View/modify replica counts

### Blocked Operations

Dangerous commands are automatically rejected:
- `delete` - Cannot delete resources
- `apply` - Cannot modify configurations
- `create` - Cannot create new resources
- Any other destructive operations

## API Endpoint

### POST /api/execute

Execute a natural language kubectl command.

**Request:**
```json
{
  "nlp": "show all pods in dev namespace"
}
```

**Response:**
```json
{
  "command": "kubectl get pods -n dev",
  "output": "NAME                    READY   STATUS    RESTARTS   AGE\nnginx-123456-abcde      1/1     Running   0          2d",
  "errorOutput": "",
  "exitCode": 0
}
```

**Error Response:**
```json
{
  "error": "Command rejected. Only the following verbs are allowed: get, describe, logs, exec, rollout, scale",
  "command": "kubectl delete pod nginx",
  "rejectedVerb": "delete"
}
```

## Project Structure

```
nlp-kubernetes/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── main.tsx       # Entry point
│   │   └── App.css        # Styles
│   ├── package.json
│   └── vite.config.ts
├── server/                # Express backend
│   ├── src/
│   │   └── index.ts       # API server
│   ├── .env.example       # Environment template
│   └── package.json
└── README.md
```

## Troubleshooting

### Backend won't start
- Verify your OpenAI API key is correct in `.env`
- Ensure port 4000 is not already in use
- Check that all dependencies are installed: `cd server && npm install`

### kubectl commands fail
- Ensure kubectl is installed: `kubectl version`
- Verify cluster access: `kubectl get nodes`
- Check your kubeconfig is properly configured

### Frontend can't connect to backend
- Verify backend is running on http://localhost:4000
- Check browser console for CORS errors
- Ensure both services are running

### OpenAI API errors
- Verify your API key is valid and has credits
- Check your OpenAI account quota and limits
- Try using a different model (e.g., gpt-3.5-turbo instead of gpt-4o-mini)

## Development

### Backend Development
```bash
cd server
npm run dev  # Auto-reloads on file changes
```

### Frontend Development
```bash
cd client
npm run dev  # Hot reload enabled
```

### Build for Production
```bash
# Build frontend
cd client
npm run build

# Build backend
cd server
npm run build  # If you have a build script configured
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- OpenAI for the GPT API
- React and Vite teams
- TailwindCSS for the styling framework

