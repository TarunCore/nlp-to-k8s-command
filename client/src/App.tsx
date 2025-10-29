import { useState } from 'react'
import './App.css'

interface CommandResult {
  id: string;
  nlpInput: string;
  command: string;
  output: string;
  errorOutput: string;
  exitCode: number;
  timestamp: Date;
}

function App() {
  const [nlpInput, setNlpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<CommandResult | null>(null);
  const [history, setHistory] = useState<CommandResult[]>([]);
  const [error, setError] = useState<string>('');

  const API_URL = 'http://localhost:4000';

  const executeCommand = async () => {
    if (!nlpInput.trim()) {
      setError('Please enter a command');
      return;
    }

    setLoading(true);
    setError('');
    setCurrentResult(null);

    try {
      const response = await fetch(`${API_URL}/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nlp: nlpInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to execute command');
        return;
      }

      const result: CommandResult = {
        id: Date.now().toString(),
        nlpInput,
        command: data.command,
        output: data.output,
        errorOutput: data.errorOutput,
        exitCode: data.exitCode,
        timestamp: new Date(),
      };

      setCurrentResult(result);
      setHistory((prev) => [result, ...prev].slice(0, 10)); // Keep last 10 commands
    } catch (err: any) {
      setError(err.message || 'Network error. Make sure the backend is running on port 4000.');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setNlpInput('');
    setCurrentResult(null);
    setError('');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const loadFromHistory = (result: CommandResult) => {
    setNlpInput(result.nlpInput);
    setCurrentResult(result);
    setError('');
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            Kubernetes NLP Command Executor
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-2xl">
              <label className="block text-white font-semibold mb-3">
                Enter your command in plain English:
              </label>
              <textarea
                value={nlpInput}
                onChange={(e) => setNlpInput(e.target.value)}
                placeholder="e.g., show all pods in dev namespace&#10;e.g., get the logs of nginx-pod&#10;e.g., describe the service called api-service"
                className="w-full h-24 px-4 py-3 bg-slate-800/50 text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 placeholder-slate-400 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    executeCommand();
                  }
                }}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={executeCommand}
                  disabled={loading || !nlpInput.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Executing...
                    </span>
                  ) : (
                    'Execute'
                  )}
                </button>
                <button
                  onClick={clearAll}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200"
                >
                  Clear
                </button>
              </div>
              <p className="text-slate-300 text-xs mt-2">
                Press Ctrl+Enter to execute quickly
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 shadow-lg">
                <p className="text-red-200 font-semibold">Error:</p>
                <p className="text-red-100 mt-1 text-sm">{error}</p>
              </div>
            )}

            {/* Command Output */}
            {currentResult && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Output</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    currentResult.exitCode === 0 
                      ? 'bg-green-500/30 text-green-200 border border-green-500/50' 
                      : 'bg-red-500/30 text-red-200 border border-red-500/50'
                  }`}>
                    Exit Code: {currentResult.exitCode}
                  </span>
                </div>
                <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-600 max-h-[450px] overflow-auto shadow-inner">
                  <pre className="text-slate-200 font-mono text-sm whitespace-pre-wrap break-words">
                    {currentResult.output || currentResult.errorOutput || 'No output'}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Generated Command & History */}
          <div className="lg:col-span-1 space-y-6">
            {/* Generated Command */}
            {currentResult && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl">
                <h3 className="text-white font-semibold mb-3">Generated Command</h3>
                <div className="bg-slate-900/70 rounded-lg p-3 border border-slate-600 shadow-inner">
                  <code className="text-green-400 font-mono text-sm break-all">
                    {currentResult.command}
                  </code>
                </div>
              </div>
            )}

            {/* History */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">History</h3>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-red-300 hover:text-red-200 text-xs font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {history.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">
                  No commands executed yet
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left bg-slate-800/50 hover:bg-slate-700/50 rounded-lg p-3 border border-slate-600 hover:border-blue-400 transition-all duration-200 group"
                    >
                      <p className="text-slate-300 text-xs truncate mb-1 group-hover:text-white">
                        {item.nlpInput}
                      </p>
                      <code className="text-green-400 text-xs font-mono truncate block">
                        {item.command}
                      </code>
                      <p className="text-slate-500 text-xs mt-1">
                        {item.timestamp.toLocaleTimeString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-4">
          <p className="text-slate-400 text-xs">
            Powered by OpenAI GPT • Safe read-only kubectl commands only
          </p>
        </div>
      </div>
    </div>
  );
}

export default App
