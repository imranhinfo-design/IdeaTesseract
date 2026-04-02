import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2, 
  Copy, 
  Check, 
  History, 
  ChevronRight, 
  ChevronLeft,
  Zap, 
  Target, 
  MessageSquare, 
  Settings2,
  Globe,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateSalesScript, ScriptGenerationParams } from '../services/geminiService';
import { cn } from '../lib/utils';
import { useNavigate, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import NeuronBackground from '../components/NeuronBackground';
import Logo from '../components/Logo';

interface SavedScript {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export default function ScriptGenerator() {
  const navigate = useNavigate();
  const [params, setParams] = useState<ScriptGenerationParams>({
    industry: '',
    target: '',
    goal: '',
    type: 'Cold Call',
    tone: 'Persuasive',
    length: 'Medium (2m)',
    objectionLevel: 'Basic',
    researchMode: true,
  });

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SavedScript[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('script_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleGenerate = async () => {
    if (!params.industry || !params.target || !params.goal) {
      setError("Please fill in all core fields (Industry, Target, Goal).");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const script = await generateSalesScript(params);
      setResult(script);
      
      // Save to history
      const newScript: SavedScript = {
        id: Date.now().toString(),
        title: `${params.type}: ${params.goal.substring(0, 20)}...`,
        content: script,
        timestamp: Date.now(),
      };
      const updatedHistory = [newScript, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem('script_history', JSON.stringify(updatedHistory));
    } catch (err: any) {
      console.error(err);
      let message = err.message || "Failed to generate script. Please try again.";
      if (message.includes("RATE_LIMIT_EXCEEDED")) {
        message = "You've reached the Gemini API free tier limit (20 requests per day). Please wait a few minutes or try again later today. This is a limit imposed by Google on their free AI model.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/30 rounded-full blur-[120px] animate-move-blue"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/30 rounded-full blur-[120px] animate-move-yellow"></div>
        <NeuronBackground />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-3xl border-b border-white/10 px-6 py-4 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
            >
              <ArrowLeft size={20} /> Back
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <Logo className="w-10 h-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]" />
              <div className="flex flex-col items-start">
                <span className="font-serif text-xl tracking-tight text-white leading-none font-bold">IdeaTesseract</span>
                <span className="text-[10px] text-cyan-400/60 uppercase tracking-widest font-bold mt-1">Script Generator</span>
              </div>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 border border-white/10 rounded-full transition-all text-sm font-bold text-white shadow-lg"
            >
              <History size={16} />
              History
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Input Panel */}
        <div className="space-y-6">
          <section className="bg-slate-900/60 backdrop-blur-3xl border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 text-cyan-400">
                <div className="p-2.5 bg-slate-800/80 rounded-2xl shadow-lg border border-white/20">
                  <Target size={24} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-white font-bold">Core Objective</h2>
                  <p className="text-[10px] text-cyan-400/60 uppercase tracking-widest font-bold">Define your target & goal</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 ml-1">Industry</label>
                  <input 
                    type="text"
                    placeholder="e.g. SaaS, Real Estate, Fintech"
                    className="w-full bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-slate-500 text-white shadow-inner hover:bg-slate-800/60 font-bold"
                    value={params.industry}
                    onChange={e => setParams({...params, industry: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 ml-1">Target Audience</label>
                  <input 
                    type="text"
                    placeholder="e.g. CTOs of mid-sized companies"
                    className="w-full bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-slate-500 text-white shadow-inner hover:bg-slate-800/60 font-bold"
                    value={params.target}
                    onChange={e => setParams({...params, target: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 ml-1">Primary Goal</label>
                  <textarea 
                    placeholder="e.g. Book a demo for our new AI security tool"
                    className="w-full bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all h-32 resize-none placeholder:text-slate-500 text-white shadow-inner hover:bg-slate-800/60 font-bold"
                    value={params.goal}
                    onChange={e => setParams({...params, goal: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-900/60 backdrop-blur-3xl border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 text-yellow-500">
                <div className="p-2.5 bg-slate-800/80 rounded-2xl shadow-lg border border-white/20">
                  <Settings2 size={24} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-white font-bold">Advanced Options</h2>
                  <p className="text-[10px] text-yellow-500/60 uppercase tracking-widest font-bold">Fine-tune the persuasion</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 ml-1">Script Type</label>
                  <select 
                    className="w-full bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all appearance-none cursor-pointer text-white shadow-inner hover:bg-slate-800/60 font-bold"
                    value={params.type}
                    onChange={e => setParams({...params, type: e.target.value})}
                  >
                    {['Cold Call', 'Sales Pitch', 'Speech', 'Email', 'LinkedIn', 'Custom'].map(t => (
                      <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 ml-1">Tone</label>
                  <select 
                    className="w-full bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all appearance-none cursor-pointer text-white shadow-inner hover:bg-slate-800/60 font-bold"
                    value={params.tone}
                    onChange={e => setParams({...params, tone: e.target.value})}
                  >
                    {['Persuasive', 'Professional', 'Friendly', 'Direct', 'Empathetic', 'Bold & Disruptive'].map(t => (
                      <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 ml-1">Length</label>
                  <select 
                    className="w-full bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all appearance-none cursor-pointer text-white shadow-inner hover:bg-slate-800/60 font-bold"
                    value={params.length}
                    onChange={e => setParams({...params, length: e.target.value})}
                  >
                    {['Short (30s)', 'Medium (2m)', 'Long (5m+)'].map(t => (
                      <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 ml-1">Objection Level</label>
                  <select 
                    className="w-full bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all appearance-none cursor-pointer text-white shadow-inner hover:bg-slate-800/60 font-bold"
                    value={params.objectionLevel}
                    onChange={e => setParams({...params, objectionLevel: e.target.value})}
                  >
                    {['None', 'Basic', 'Comprehensive'].map(t => (
                      <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between p-5 bg-slate-800/60 rounded-2xl border border-cyan-500/30 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-all shadow-lg border border-white/10",
                    params.researchMode ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-700 text-slate-500"
                  )}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">2026 Research Mode</p>
                    <p className="text-[10px] text-cyan-400/60 uppercase tracking-wider font-bold">Real-time market trends</p>
                  </div>
                </div>
                <button 
                  onClick={() => setParams({...params, researchMode: !params.researchMode})}
                  className={cn(
                    "w-14 h-7 rounded-full transition-all relative shadow-inner",
                    params.researchMode ? "bg-cyan-500" : "bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md",
                    params.researchMode ? "left-8" : "left-1"
                  )} />
                </button>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-10 py-5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    Analyzing 2026 Trends...
                  </>
                ) : (
                  <>
                    <Sparkles size={22} />
                    Generate Persuasive Script
                  </>
                )}
              </button>
              
              {error && (
                <p className="mt-5 text-sm text-red-400 text-center font-bold">{error}</p>
              )}
            </div>
          </section>
        </div>

        {/* Output Panel */}
        <div className="relative h-[calc(100vh-14rem)]">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border border-white/10 rounded-[3rem] bg-slate-900/40 backdrop-blur-3xl shadow-2xl"
              >
                <div className="w-24 h-24 bg-slate-800/60 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-lg backdrop-blur-md">
                  <MessageSquare size={40} className="text-cyan-400" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-3 font-bold">Ready to Persuade?</h3>
                <p className="text-slate-400 max-w-xs font-bold leading-relaxed">Fill in your objective and let the AI architect a high-converting script for you.</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col bg-slate-900/60 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-2xl overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/60">Generated Output</span>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full transition-all text-xs font-bold shadow-lg shadow-cyan-500/20 active:scale-95"
                    >
                      {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy Script'}
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    {loading ? (
                      <div className="space-y-6 animate-pulse">
                        <div className="h-10 bg-slate-800/60 rounded-xl w-3/4" />
                        <div className="h-5 bg-slate-800/60 rounded-xl w-full" />
                        <div className="h-5 bg-slate-800/60 rounded-xl w-5/6" />
                        <div className="h-5 bg-slate-800/60 rounded-xl w-full" />
                        <div className="h-48 bg-slate-800/60 rounded-xl w-full" />
                      </div>
                    ) : (
                      <div className="markdown-body !text-slate-200">
                        <ReactMarkdown>{result || ''}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900/90 backdrop-blur-3xl border-l border-white/10 z-[70] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
                  <div>
                    <h2 className="font-serif text-2xl text-white font-bold">Script History</h2>
                    <p className="text-[10px] text-cyan-400/60 uppercase tracking-widest font-bold mt-1">Your recent generations</p>
                  </div>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="p-3 hover:bg-white/10 rounded-full transition-colors text-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {history.length === 0 ? (
                    <div className="text-center py-20 text-slate-600">
                      <History size={64} className="mx-auto mb-6 opacity-10" />
                      <p className="font-bold">No saved scripts yet.</p>
                    </div>
                  ) : (
                    history.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => {
                          setResult(item.content);
                          setShowHistory(false);
                        }}
                        className="w-full text-left p-6 bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-[2rem] transition-all group shadow-lg"
                      >
                        <h4 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{new Date(item.timestamp).toLocaleDateString()}</p>
                          <ChevronLeft size={14} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="p-8 border-t border-white/10 bg-slate-900/60 backdrop-blur-md">
                  <button 
                    onClick={() => {
                      if (confirm('Clear all history?')) {
                        setHistory([]);
                        localStorage.removeItem('script_history');
                      }
                    }}
                    className="w-full py-4 text-xs font-bold text-red-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                  >
                    Clear All History
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Sparkles */}
      <div className="fixed bottom-10 right-10 z-40 pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="p-5 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl"
        >
          <Sparkles className="text-yellow-400" size={28} />
        </motion.div>
      </div>

      <footer className="mt-16 relative z-10 w-full border-t border-white/10 pt-16 pb-8 bg-slate-950/90 backdrop-blur-2xl rounded-t-[4rem] px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Logo className="w-8 h-8" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight text-white">IdeaTesseract</span>
            </div>
            <p className="text-slate-400 text-base max-w-md font-medium leading-relaxed mb-8">
              The world's most advanced AI business architect. We help entrepreneurs transform abstract ideas into multi-dimensional, actionable business structures and strategic roadmaps.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-slate-400 hover:text-cyan-400">
                <Icons.Twitter size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-slate-400 hover:text-cyan-400">
                <Icons.Github size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-slate-400 hover:text-cyan-400">
                <Icons.Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">AI Tools</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><Icons.LayoutDashboard size={14} /> Business Plan Gen</Link></li>
              <li><Link to="/script-generator" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><Icons.MessageSquare size={14} /> Sales Script Gen</Link></li>
              <li><Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><Icons.Compass size={14} /> Startup Architect</Link></li>
              <li><Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><Icons.Map size={14} /> Strategy Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Market Analysis</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">API Access</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-bold">
            © {new Date().getFullYear()} IdeaTesseract. All rights reserved. Powered by advanced Generative AI.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <span>Status: Operational</span>
            <span>Region: Global</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
