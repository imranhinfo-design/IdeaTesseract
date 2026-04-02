import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BusinessPlan, generateStepDeepDive } from '../services/geminiService';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft, ArrowRight, Sparkles, Zap } from 'lucide-react';
import * as Icons from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import NeuronBackground from '../components/NeuronBackground';
import Logo from '../components/Logo';
import { SEO } from '../components/SEO';

export default function StepDetails() {
  const { stepIndex } = useParams<{ stepIndex: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [idea, setIdea] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('English');
  const [deepDive, setDeepDive] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem('currentPlan');
    const savedIdea = localStorage.getItem('currentIdea');
    const savedCountry = localStorage.getItem('currentCountry');
    const savedLanguage = localStorage.getItem('currentLanguage');
    
    if (savedPlan) setPlan(JSON.parse(savedPlan));
    if (savedIdea) setIdea(savedIdea);
    if (savedCountry) setCountry(savedCountry);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Reset deep dive when step changes
  useEffect(() => {
    setDeepDive(null);
  }, [stepIndex]);

  if (!plan || !stepIndex) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 font-sans">
        <Loader2 className="animate-spin text-cyan-700" size={48} />
      </div>
    );
  }

  const currentIndex = parseInt(stepIndex, 10);
  const step = plan.steps[currentIndex];
  if (!step) return <div className="text-gray-900 text-center mt-20">Step not found.</div>;

  const IconComponent = (Icons as any)[step.icon] || Icons.Briefcase;

  const handleGetMoreInfo = async () => {
    setLoading(true);
    try {
      const result = await generateStepDeepDive(idea, country, step.title, step.description, language);
      setDeepDive(result);
    } catch (error) {
      console.error(error);
      setDeepDive("Failed to generate detailed information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevStep = () => {
    if (currentIndex > 0) {
      navigate(`/step/${currentIndex - 1}`);
    }
  };

  const handleNextStep = () => {
    if (currentIndex < plan.steps.length - 1) {
      navigate(`/step/${currentIndex + 1}`);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('currentPlan');
    localStorage.removeItem('currentIdea');
    localStorage.removeItem('currentCountry');
    localStorage.removeItem('currentLanguage');
    window.location.href = '/';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-6 lg:p-12 font-sans text-gray-900 relative"
    >
      <SEO 
        title={`${step.title} - ${idea}`}
        description={step.description}
        keywords={`${step.title}, ${idea}, business strategy, ${country}`}
        canonical={`https://ais-pre-qwdzgtvcxwikuaul7m6xio-226285742400.asia-southeast1.run.app/step/${stepIndex}`}
      />
      {/* Abstract Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-950">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/40 rounded-full blur-[120px] animate-move-blue"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/40 rounded-full blur-[120px] animate-move-yellow"></div>
        <NeuronBackground />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
          >
            <ArrowLeft size={20} /> Back to Plan
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/script-generator')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-full text-sm font-bold transition-all border border-blue-500/20"
            >
              <Zap size={16} /> Script Gen
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <Logo className="w-10 h-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]" />
              <span className="font-serif text-xl font-bold tracking-tight text-white">IdeaTesseract</span>
            </button>
          </div>
        </header>

        <main>
          <div className="flex justify-between items-center mb-10 p-4 bg-slate-900/60 backdrop-blur-3xl rounded-[2rem] border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <button 
              onClick={handlePrevStep}
              disabled={currentIndex === 0}
              className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-full transition-all font-bold border shadow-lg ${currentIndex === 0 ? 'text-slate-600 border-transparent cursor-not-allowed' : 'text-white bg-slate-800/80 backdrop-blur-md border-white/20 hover:bg-slate-700'}`}
            >
              <ArrowLeft size={18} /> Previous Step
            </button>
            <span className="relative z-10 text-white font-bold text-lg">Step {currentIndex + 1} of {plan.steps.length}</span>
            <button 
              onClick={handleNextStep}
              disabled={currentIndex === plan.steps.length - 1}
              className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-full transition-all font-bold border shadow-lg ${currentIndex === plan.steps.length - 1 ? 'text-slate-600 border-transparent cursor-not-allowed' : 'text-white bg-slate-800/80 backdrop-blur-md border-white/20 hover:bg-slate-700'}`}
            >
              Next Step <ArrowRight size={18} />
            </button>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-2xl mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-full h-64 md:h-80 mb-8 rounded-2xl overflow-hidden relative shadow-inner border border-white/10">
                <img
                  src={`https://picsum.photos/seed/${encodeURIComponent(step.imageKeyword)}/1200/600`}
                  alt={step.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shrink-0 shadow-lg">
                  <IconComponent className="text-cyan-400" size={32} />
                </div>
                <h1 className="text-3xl md:text-5xl font-serif text-white font-bold">{step.title}</h1>
              </div>
              
              <p className="text-xl text-slate-200 leading-relaxed mb-10 font-medium">
                {step.description}
              </p>

              {!deepDive && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleGetMoreInfo}
                    disabled={loading}
                    className="px-8 py-4 bg-cyan-600 text-white rounded-full flex items-center justify-center gap-3 hover:bg-cyan-500 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)] text-lg font-bold w-full md:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Architecting Deep Dive...
                      </>
                    ) : (
                      <>
                        <Sparkles size={24} />
                        Get More Specific Info
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {deepDive && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-serif text-white mb-8 flex items-center gap-3 font-bold">
                  <Sparkles className="text-cyan-400" /> Strategic Deep Dive
                </h2>
                <div className="markdown-body !text-slate-200">
                  <ReactMarkdown>{deepDive}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </main>
        
        <footer className="mt-16 border-t border-white/10 pt-16 pb-8 bg-slate-950/90 backdrop-blur-2xl rounded-t-[4rem] px-6">
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
    </motion.div>
  );
}
