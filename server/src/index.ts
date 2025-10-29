import express from "express"
import cors from "cors"
import 'dotenv/config'
import { spawn } from 'child_process'
import OpenAI from 'openai'

const app = express();

const PORT = process.env.PORT || 4000;

// Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Whitelist of allowed kubectl commands
const ALLOWED_VERBS = ['get', 'describe', 'logs', 'exec', 'rollout', 'scale'];

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Kubernetes NLP Command Executor API");
});

// Main API endpoint
app.post("/api/execute", async (req, res): Promise<void> => {
  try {
    const { nlp } = req.body;

    if (!nlp || typeof nlp !== 'string') {
      res.status(400).json({ 
        error: 'Invalid request. Please provide "nlp" field with a string value.' 
      });
      return;
    }

    // // Step 1: Call OpenAI to translate NLP to kubectl command
    // const completion = await openai.chat.completions.create({
    //   model: OPENAI_MODEL,
    //   messages: [
    //     {
    //       role: 'system',
    //       content: 'You are a strict translator. Translate the user\'s plain-English Kubernetes request into a single kubectl command only. Output only the command, no extra text, no explanations, no markdown.'
    //     },
    //     {
    //       role: 'user',
    //       content: nlp
    //     }
    //   ],
    //   temperature: 0.3,
    //   max_tokens: 150
    // });

    // let kubectlCommand = completion.choices[0]?.message?.content?.trim() || '';

    // if (!kubectlCommand) {
    //   res.status(500).json({ 
    //     error: 'Failed to generate kubectl command from OpenAI.' 
    //   });
    //   return;
    // }

    // // Remove "kubectl" prefix if present and clean up
    // kubectlCommand = kubectlCommand.replace(/^kubectl\s+/, '').trim();
    
    // // Remove any markdown code blocks if present
    // kubectlCommand = kubectlCommand.replace(/^```(?:bash|shell)?\n?/gm, '').replace(/\n?```$/gm, '').trim();
    let kubectlCommand = "get nodes";
    // Step 2: Parse and validate the command
    const args = kubectlCommand.split(/\s+/);
    const verb = args[0];

    // if (!verb || !ALLOWED_VERBS.includes(verb.toLowerCase())) {
    //   res.status(403).json({
    //     error: `Command rejected. Only the following verbs are allowed: ${ALLOWED_VERBS.join(', ')}`,
    //     command: `kubectl ${kubectlCommand}`,
    //     rejectedVerb: verb
    //   });
    //   return;
    // }

    // Step 3: Execute kubectl command safely
    const kubectl = spawn('kubectl', args);

    let stdout = '';
    let stderr = '';

    kubectl.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    kubectl.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    kubectl.on('close', (exitCode) => {
      res.json({
        command: `kubectl ${kubectlCommand}`,
        output: stdout,
        errorOutput: stderr,
        exitCode: exitCode || 0
      });
    });

    // Handle timeout (30 seconds)
    setTimeout(() => {
      if (!kubectl.killed) {
        kubectl.kill();
        res.json({
          command: `kubectl ${kubectlCommand}`,
          output: stdout,
          errorOutput: stderr + '\nCommand timed out after 30 seconds.',
          exitCode: -1
        });
      }
    }, 30000);

  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while processing your request.',
      details: error.response?.data || null
    });
  }
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    console.log("Visit http://localhost:" + PORT);
});