import { useState, useEffect } from 'react';
import { generateBusinessPlan, BusinessPlan } from '../services/geminiService';
import { COUNTRY_CURRENCY_MAP, CURRENCY_SYMBOLS, SUPPORTED_LANGUAGES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, MapPin, Coins, Briefcase, Globe, Landmark, Server, ArrowRight, Sparkles, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import NeuronBackground from '../components/NeuronBackground';
import Logo from '../components/Logo';
import { SEO } from '../components/SEO';
import { useNavigate, Link } from 'react-router-dom';

export default function Home() {
  const [idea, setIdea] = useState('');
  const [country, setCountry] = useState('USA');
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [plans, setPlans] = useState<BusinessPlan | null>(null);
  const [selectedName, setSelectedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ads, setAds] = useState({ topBannerId: '', sidebarId: '', footerId: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const code = COUNTRY_CURRENCY_MAP[country] || 'USD';
    setCurrency(code);
    setCurrencySymbol(CURRENCY_SYMBOLS[code] || '$');
    
    fetch('/api/ads-config')
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setAds(data))
      .catch(() => {
        // Fallback to environment variables if server is not available (e.g. static hosting)
        setAds({
          topBannerId: import.meta.env.VITE_ADS_TOP_ID || '',
          sidebarId: import.meta.env.VITE_ADS_SIDEBAR_ID || '',
          footerId: import.meta.env.VITE_ADS_FOOTER_ID || '',
        });
      });
  }, [country]);

  useEffect(() => {
    const savedPlan = localStorage.getItem('currentPlan');
    const savedIdea = localStorage.getItem('currentIdea');
    const savedCountry = localStorage.getItem('currentCountry');
    const savedLanguage = localStorage.getItem('currentLanguage');
    if (savedPlan && savedIdea && savedCountry) {
      try {
        const parsedPlan = JSON.parse(savedPlan);
        setPlans(parsedPlan);
        setIdea(savedIdea);
        setCountry(savedCountry);
        if (savedLanguage) setLanguage(savedLanguage);
        setSelectedName(parsedPlan.suggestedNames[0]);
      } catch (e) {
        console.error("Failed to parse saved plan", e);
      }
    }
  }, []);

  const handleSearch = async () => {
    if (!idea) return;
    setLoading(true);
    setPlans(null);
    setSelectedName('');
    setError(null);
    try {
      const result = await generateBusinessPlan(idea, country, currency, language);
      setPlans(result);
      setSelectedName(result.suggestedNames[0]);
      // Save to localStorage so the details page can access it
      localStorage.setItem('currentPlan', JSON.stringify(result));
      localStorage.setItem('currentIdea', idea);
      localStorage.setItem('currentCountry', country);
      localStorage.setItem('currentLanguage', language);
    } catch (err: any) {
      console.error(err);
      let message = err.message || "Failed to generate business plan.";
      
      // If it's the specific "API key not valid" error from Google
      if (message.includes("API key not valid") || message.includes("INVALID_ARGUMENT")) {
        const { getMaskedApiKey } = await import('../services/geminiService');
        const maskedKey = getMaskedApiKey();
        message = `Your Google Gemini API key is invalid. Google rejected the key: ${maskedKey}. Please double-check your Vercel Environment Variables and REDEPLOY.`;
      } else if (message.includes("503") || message.includes("high demand") || message.includes("UNAVAILABLE")) {
        message = "Google's AI servers are currently experiencing very high demand. I've tried retrying, but they are still busy. Please wait 1-2 minutes and try again.";
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    navigate(`/step/${stepIndex}`);
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
        title={plans ? `${selectedName} - Business Plan` : undefined}
        description={plans ? plans.summary.substring(0, 160) : undefined}
        keywords={plans ? `${selectedName}, ${plans.steps.map(s => s.title).join(', ')}` : undefined}
        canonical={plans ? `https://ais-pre-qwdzgtvcxwikuaul7m6xio-226285742400.asia-southeast1.run.app/?idea=${encodeURIComponent(idea)}` : 'https://ais-pre-qwdzgtvcxwikuaul7m6xio-226285742400.asia-southeast1.run.app/'}
      />
      {/* Abstract Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-950">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/40 rounded-full blur-[120px] animate-move-blue"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/40 rounded-full blur-[120px] animate-move-yellow"></div>
        <NeuronBackground />
      </div>

      <header className="mb-12 md:mb-16 w-full flex flex-col items-center relative z-10 px-4">
        <AdSensePlaceholder adId={ads.topBannerId} className="mb-8" />
        
        <button 
          onClick={handleReset}
          className="flex flex-col items-center justify-center gap-6 cursor-pointer hover:opacity-80 transition-opacity group mx-auto"
        >
          {/* Logo */}
          <div className="shrink-0 flex items-center justify-center">
            <Logo className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 drop-shadow-[0_0_30px_rgba(0,255,255,0.3)] group-hover:scale-105 transition-transform" />
          </div>
          
          {/* Text Group */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(0,255,255,0.4)] leading-none mb-4">
              IdeaTesseract
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-cyan-400 tracking-[0.2em] uppercase font-bold">
              Multi-Dimensional Business Architect
            </p>
          </div>
        </button>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => navigate('/script-generator')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/25 group"
          >
            <Zap size={18} className="group-hover:animate-pulse" />
            Try Script Generator
          </button>
        </div>
      </header>

      <main className="w-full">
        <section className="max-w-5xl mx-auto mb-16 relative z-10 px-4" aria-label="Business Idea Search">
          <div className="bg-slate-900/60 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-400/50" size={24} aria-hidden="true" />
                <input
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your business idea in detail..."
                  aria-label="Enter your business idea"
                  className="w-full p-6 pl-16 border border-white/20 rounded-3xl bg-slate-800/80 backdrop-blur-md text-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all shadow-inner"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400/50" size={20} aria-hidden="true" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    aria-label="Select target country"
                    className="w-full p-4 pl-14 border border-white/20 rounded-2xl bg-slate-800/80 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    {Object.keys(COUNTRY_CURRENCY_MAP).map(c => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400/50" size={20} aria-hidden="true" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    aria-label="Select language"
                    className="w-full p-4 pl-14 border border-white/20 rounded-2xl bg-slate-800/80 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    {Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => (
                      <option key={key} value={key} className="bg-slate-900">{value}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Coins className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400/50" size={20} aria-hidden="true" />
                  <input
                    type="text"
                    value={currencySymbol}
                    readOnly
                    aria-label="Currency symbol"
                    className="w-full p-4 pl-14 border border-white/20 rounded-2xl bg-slate-800/80 backdrop-blur-md text-slate-300 cursor-not-allowed shadow-inner"
                  />
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                aria-label="Generate Business Plan"
                className="w-full p-6 bg-cyan-600 text-white rounded-3xl flex items-center justify-center gap-3 hover:bg-cyan-500 transition-all transform hover:scale-[1.01] shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:bg-slate-800 disabled:text-slate-600"
              >
                <div aria-live="polite" className="flex items-center gap-3 text-lg font-black uppercase tracking-widest">
                  {loading ? <Loader2 className="animate-spin" size={24} aria-hidden="true" /> : <Sparkles size={24} aria-hidden="true" />}
                  {loading ? 'Architecting Your Vision...' : 'Generate Multi-Dimensional Plan'}
                </div>
              </button>
            </div>
          </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2 opacity-70">Make sure your GEMINI_API_KEY is set in your environment variables.</p>
          </div>
        )}
      </section>

      {!plans && !loading && (
        <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-10 px-4">
          <div className="bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/20 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-800/80 backdrop-blur-md text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles size={28} />
              </div>
              <h2 className="text-xl font-serif mb-3 text-white font-bold">AI-Powered Architecture</h2>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">Generate multi-dimensional business structures using advanced generative AI models.</p>
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/20 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-800/80 backdrop-blur-md text-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h2 className="text-xl font-serif mb-3 text-white font-bold">Global Market Context</h2>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">Localized strategies with country-specific currency and market insights for 20+ regions.</p>
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/20 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-800/80 backdrop-blur-md text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                <ArrowRight size={28} />
              </div>
              <h2 className="text-xl font-serif mb-3 text-white font-bold">Step-by-Step Execution</h2>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">From branding to government support, get a clear roadmap to launch your business idea.</p>
            </div>
          </div>
        </section>
      )}

      <AnimatePresence mode="wait">
        {plans && (
          <motion.article
            key={selectedName}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="max-w-5xl mx-auto relative z-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 p-6 bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <button
                onClick={() => {
                  const currentIndex = plans.suggestedNames.indexOf(selectedName);
                  const prevIndex = (currentIndex - 1 + plans.suggestedNames.length) % plans.suggestedNames.length;
                  setSelectedName(plans.suggestedNames[prevIndex]);
                }}
                className="relative z-10 p-4 bg-slate-800/80 backdrop-blur-md text-white rounded-full hover:bg-slate-700 transition-all border border-white/20 shadow-lg w-full md:w-auto font-bold flex items-center justify-center gap-2"
              >
                <ChevronLeft size={20} /> Previous Name
              </button>
              <h2 className="relative z-10 text-2xl md:text-3xl font-serif text-white text-center font-bold">Name: {selectedName}</h2>
              <button
                onClick={() => {
                  const currentIndex = plans.suggestedNames.indexOf(selectedName);
                  const nextIndex = (currentIndex + 1) % plans.suggestedNames.length;
                  setSelectedName(plans.suggestedNames[nextIndex]);
                }}
                className="relative z-10 p-4 bg-slate-800/80 backdrop-blur-md text-white rounded-full hover:bg-slate-700 transition-all border border-white/20 shadow-lg w-full md:w-auto font-bold flex items-center justify-center gap-2"
              >
                Next Name <ChevronRight size={20} />
              </button>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/20 shadow-2xl mb-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-serif text-cyan-400 mb-8 font-bold">Launch {selectedName}</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  <a href={`https://www.google.com/search?q=buy+domain+${encodeURIComponent(selectedName)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 transition-all transform hover:scale-105 shadow-xl font-bold">
                    <Globe size={20} /> Domain Search
                  </a>
                  <a href={`https://www.google.com/search?q=best+web+hosting+for+${encodeURIComponent(selectedName)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-slate-800/80 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-slate-700 transition-all transform hover:scale-105 shadow-md font-bold">
                    <Server size={20} /> Hosting Check
                  </a>
                </div>
              </div>
            </div>

            <input
              type="text"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="text-4xl md:text-6xl font-serif font-bold mb-4 text-center w-full bg-transparent text-white border-b border-transparent hover:border-white/20 focus:border-white/20 focus:outline-none break-words"
            />
            <div className="bg-slate-900/60 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl mb-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-serif font-bold mb-6 text-center text-white">Your Strategic Roadmap</h3>
                <textarea
                  value={plans.summary}
                  onChange={(e) => setPlans({ ...plans, summary: e.target.value })}
                  className="block text-base md:text-lg text-slate-200 text-center max-w-2xl mx-auto w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/20 focus:outline-none font-medium"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="bg-slate-900/60 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl mb-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h4 className="text-xl md:text-2xl font-serif mb-4 text-white text-center font-bold">Branding & Startup Advice</h4>
                <textarea
                  value={plans.brandingStartupAdvice}
                  onChange={(e) => setPlans({ ...plans, brandingStartupAdvice: e.target.value })}
                  className="text-slate-200 leading-relaxed w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/20 focus:outline-none text-center font-medium"
                  rows={6}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
              {plans.steps.map((step, index) => {
                const IconComponent = (Icons as any)[step.icon] || Briefcase;
                return (
                  <div key={index} className="animate-float-card" style={{ animationDelay: `${index * 0.2}s` }}>
                      <motion.div
                        initial={{ opacity: 0, y: 50, rotateX: -10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        whileHover={{ scale: 1.02, rotateY: 2, z: 10 }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                        className="bg-slate-900/60 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 flex flex-col h-full cursor-pointer group relative overflow-hidden"
                        onClick={() => handleStepClick(index)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <div className="relative z-10 flex flex-col h-full">
                          <div className="relative w-full h-40 md:h-48 mb-6 rounded-2xl overflow-hidden shadow-inner border border-white/10">
                            <img
                              src={`https://picsum.photos/seed/${encodeURIComponent(step.imageKeyword)}/600/400`}
                              alt={step.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                          </div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shrink-0 shadow-lg">
                              <IconComponent className="text-cyan-400" size={20} />
                            </div>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                e.stopPropagation();
                                const newSteps = [...plans.steps];
                                newSteps[index].title = e.target.value;
                                setPlans({ ...plans, steps: newSteps });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xl md:text-2xl font-serif text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/20 focus:outline-none w-full text-center truncate font-bold"
                            />
                          </div>
                          <textarea
                            value={step.description}
                            onChange={(e) => {
                              e.stopPropagation();
                              const newSteps = [...plans.steps];
                              newSteps[index].description = e.target.value;
                              setPlans({ ...plans, steps: newSteps });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-300 leading-relaxed w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/20 focus:outline-none text-center resize-none flex-grow max-h-32 overflow-y-auto font-medium"
                            rows={4}
                          />
                          
                          <div className="mt-6 flex justify-center">
                            <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-bold">
                              Get More Specific Info <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-slate-900/60 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <h4 className="text-xl md:text-2xl font-serif mb-6 text-white text-center flex items-center justify-center gap-2 font-bold"><Globe className="text-cyan-400" /> Industry References</h4>
                  <ul className="space-y-2 text-slate-300 font-medium">
                    {plans.industryReferences.map((ref, index) => <li key={index} className="text-center">{ref}</li>)}
                  </ul>
                </div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <h4 className="text-xl md:text-2xl font-serif mb-6 text-white text-center flex items-center justify-center gap-2 font-bold"><Landmark className="text-cyan-400" /> Government Support</h4>
                  <ul className="space-y-2 text-slate-300 font-medium">
                    {plans.governmentHelp.map((help, index) => <li key={index} className="text-center">{help}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h4 className="text-xl md:text-2xl font-serif mb-6 text-white text-center font-bold">Potential Problems & Solutions</h4>
                <div className="space-y-6">
                  {plans.problemsAndSolutions.map((item, index) => (
                    <div key={index} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                      <input
                        type="text"
                        value={item.problem}
                        onChange={(e) => {
                          const newProblems = [...plans.problemsAndSolutions];
                          newProblems[index].problem = e.target.value;
                          setPlans({ ...plans, problemsAndSolutions: newProblems });
                        }}
                        className="font-bold text-white mb-1 w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/20 focus:outline-none text-center"
                      />
                      <textarea
                        value={item.solution}
                        onChange={(e) => {
                          const newProblems = [...plans.problemsAndSolutions];
                          newProblems[index].solution = e.target.value;
                          setPlans({ ...plans, problemsAndSolutions: newProblems });
                        }}
                        className="text-slate-300 w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/20 focus:outline-none text-center resize-none font-medium"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
      </main>
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
        <AdSensePlaceholder adId={ads.footerId} className="mt-8" />
      </footer>
    </motion.div>
  );
}
