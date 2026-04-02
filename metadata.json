import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BusinessPlan, generateStepDeepDive } from '../services/geminiService';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
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
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-100">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-400/60 rounded-full blur-[120px] animate-move-blue"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-400/60 rounded-full blur-[120px] animate-move-yellow"></div>
        <NeuronBackground />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-cyan-700 hover:text-cyan-600 transition-colors font-medium"
          >
            <ArrowLeft size={20} /> Back to Plan
          </button>
          <button 
            onClick={handleReset}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="font-serif text-xl tracking-tight text-gray-900">IdeaTesseract</span>
          </button>
        </header>

        <main>
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handlePrevStep}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${currentIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
            >
              <ArrowLeft size={16} /> Previous Step
            </button>
            <span className="text-gray-500 font-medium">Step {currentIndex + 1} of {plan.steps.length}</span>
            <button 
              onClick={handleNextStep}
              disabled={currentIndex === plan.steps.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${currentIndex === plan.steps.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
            >
              Next Step <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-400 shadow-[0_30px_80px_rgba(0,0,0,0.15)] mb-12">
            <div className="w-full h-64 md:h-80 mb-8 rounded-2xl overflow-hidden relative">
              <img
                src={`https://picsum.photos/seed/${encodeURIComponent(step.imageKeyword)}/1200/600`}
                alt={step.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-yellow-500 shrink-0 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <IconComponent className="text-cyan-700" size={32} />
              </div>
              <h1 className="text-3xl md:text-5xl font-serif text-gray-900">{step.title}</h1>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-10">
              {step.description}
            </p>

            {!deepDive && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleGetMoreInfo}
                  disabled={loading}
                  className="px-8 py-4 bg-cyan-700 text-white rounded-full flex items-center justify-center gap-3 hover:bg-cyan-600 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,255,255,0.4)] text-lg font-medium w-full md:w-auto"
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

          {deepDive && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-cyan-200 shadow-[0_0_40px_rgba(0,0,0,0.05)]"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-cyan-700 mb-8 flex items-center gap-3">
                <Sparkles /> Strategic Deep Dive
              </h2>
              <div className="prose prose-cyan max-w-none prose-headings:font-serif prose-headings:font-light prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700">
                <ReactMarkdown>{deepDive}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </main>
        
        <footer className="mt-16 border-t border-slate-200 pt-12 pb-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Logo className="w-8 h-8" />
                <span className="text-xl font-serif font-light tracking-tight">IdeaTesseract</span>
              </div>
              <p className="text-gray-500 text-sm max-w-md">
                The world's most advanced AI business architect. We help entrepreneurs transform abstract ideas into multi-dimensional, actionable business structures and strategic roadmaps.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="/" className="hover:text-cyan-700 transition-colors">Business Plan Generator</a></li>
                <li><a href="/" className="hover:text-cyan-700 transition-colors">Startup Architect</a></li>
                <li><a href="/" className="hover:text-cyan-700 transition-colors">Strategy Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="/" className="hover:text-cyan-700 transition-colors">Privacy Policy</a></li>
                <li><a href="/" className="hover:text-cyan-700 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 text-xs">
            <p>© {new Date().getFullYear()} IdeaTesseract. All rights reserved. Powered by advanced Generative AI.</p>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
