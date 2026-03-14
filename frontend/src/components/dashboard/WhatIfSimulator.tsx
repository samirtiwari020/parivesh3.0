import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, AlertTriangle, CheckCircle, Info, Zap, Trees, Waves, Factory, LandPlot } from 'lucide-react';

const CATEGORIES = ['Sand', 'Limestone', 'Bricks', 'Infrastructure', 'Industry'];
const POLLUTION_RISKS = ['Low', 'Medium', 'High'];

interface SimulationResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  warnings: string[];
  recommendation: string;
}

export default function WhatIfSimulator() {
  const [category, setCategory] = useState(CATEGORIES[3]);
  const [area, setArea] = useState<number>(10);
  const [forestDist, setForestDist] = useState<number>(5);
  const [riverDist, setRiverDist] = useState<number>(5);
  const [pollution, setPollution] = useState(POLLUTION_RISKS[0]);
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const simulate = () => {
    setIsSimulating(true);
    setResult(null);

    // Simulate delay for effect
    setTimeout(() => {
      const warnings: string[] = [];
      let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
      let recommendation = '';

      // Rule: IF project area > 50 hectares -> Risk Level = High
      if (area > 50) {
        riskLevel = 'High';
      }

      // Rule: IF distance from forest < 5 km -> Add warning: "Forest proximity risk detected"
      if (forestDist < 5) {
        warnings.push('Forest proximity risk detected');
        if (riskLevel !== 'High') riskLevel = 'Medium';
      }

      // Rule: IF distance from river < 2 km -> Add warning: "River ecosystem impact possible"
      if (riverDist < 2) {
        warnings.push('River ecosystem impact possible');
        if (riskLevel !== 'High') riskLevel = 'Medium';
      }

      // Rule: IF pollution risk = High -> Recommendation = "Requires strict mitigation plan"
      if (pollution === 'High') {
        recommendation = 'Requires strict mitigation plan';
        if (riskLevel !== 'High') riskLevel = 'Medium';
      }

      // Logic check for no major risks
      const hasMajorRisks = area > 50 || forestDist < 5 || riverDist < 2 || pollution === 'High';

      // Rule: If no major risks -> Recommendation = "Likely to pass initial scrutiny"
      if (!hasMajorRisks) {
        riskLevel = 'Low';
        recommendation = 'Likely to pass initial scrutiny';
      } else if (!recommendation) {
        // Default recommendation for Medium risk if not overridden by Pollution High
        recommendation = 'Proposal may require additional environmental safeguards before approval.';
      }

      setResult({ riskLevel, warnings, recommendation });
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
          <Zap size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-emerald-950">Environmental What-If Simulator</h3>
          <p className="text-sm text-emerald-800/60 font-medium">Predict your project's environmental risk before submission.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-xl shadow-emerald-950/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <Factory size={16} className="text-emerald-500" />
                Project Category
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <LandPlot size={16} className="text-emerald-500" />
                Project Area (ha)
              </label>
              <input 
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <Trees size={16} className="text-emerald-500" />
                Forest Distance (km)
              </label>
              <input 
                type="number"
                value={forestDist}
                onChange={(e) => setForestDist(Number(e.target.value))}
                className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <Waves size={16} className="text-emerald-500" />
                River Distance (km)
              </label>
              <input 
                type="number"
                value={riverDist}
                onChange={(e) => setRiverDist(Number(e.target.value))}
                className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <AlertTriangle size={16} className="text-emerald-500" />
                Pollution Risk Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {POLLUTION_RISKS.map(p => (
                  <button
                    key={p}
                    onClick={() => setPollution(p)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border-2 transition-all ${
                      pollution === p 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                        : 'bg-white border-emerald-50 text-emerald-900/60 hover:border-emerald-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={simulate}
            disabled={isSimulating}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Impact...
              </>
            ) : (
              <>
                <Zap size={20} />
                Simulate Environmental Review
              </>
            )}
          </button>
        </div>

        {/* Results Card */}
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            {!result && !isSimulating && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="flex-grow bg-emerald-50/50 border-2 border-dashed border-emerald-200 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100/50">
                  <HelpCircle size={32} className="text-emerald-200" />
                </div>
                <h4 className="font-bold text-emerald-900">Ready to Simulate?</h4>
                <p className="text-sm text-emerald-800/50 mt-2 max-w-[200px]">Enter your project parameters and click the button results.</p>
              </motion.div>
            )}

            {isSimulating && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-grow bg-white/40 backdrop-blur-md rounded-[2rem] border border-white flex flex-col items-center justify-center p-8"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-emerald-100 rounded-full" />
                  <div className="absolute inset-0 w-20 h-20 border-4 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <p className="mt-6 font-bold text-emerald-900 animate-pulse">Running Complex Algorithms...</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-grow bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white p-8 shadow-2xl shadow-emerald-950/10 flex flex-col"
              >
                <div className="mb-8 p-6 bg-emerald-50/30 rounded-3xl border border-emerald-100/50 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 -mr-8 -mt-8 ${
                    result.riskLevel === 'Low' ? 'bg-green-500' :
                    result.riskLevel === 'Medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  
                  <h4 className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap size={14} className="text-emerald-500" />
                    Decision Intelligence Output
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full animate-pulse shadow-lg ${
                      result.riskLevel === 'Low' ? 'bg-green-500 shadow-green-500/40' :
                      result.riskLevel === 'Medium' ? 'bg-yellow-500 shadow-yellow-500/40' :
                      'bg-red-500 shadow-red-500/40'
                    }`} />
                    <div className={`text-2xl font-black ${
                      result.riskLevel === 'Low' ? 'text-green-600' :
                      result.riskLevel === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      Risk Level: {result.riskLevel}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle size={12} className="text-rose-400" />
                      Detected Risk Factors
                    </h4>
                    {result.warnings.length > 0 ? (
                      <div className="space-y-2">
                        {result.warnings.map((warning, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i} 
                            className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-emerald-100/50 shadow-sm"
                          >
                            <span className={`w-2 h-2 rounded-full ${
                              result.riskLevel === 'High' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                            <span className="text-sm font-bold text-emerald-950 leading-tight">{warning}</span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-emerald-900/40 italic pl-2">No critical environmental factors detected.</div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle size={12} className="text-emerald-400" />
                      Authorities Recommendation
                    </h4>
                    <div className="p-5 bg-gradient-to-br from-emerald-950 to-teal-900 rounded-2xl shadow-xl shadow-emerald-950/20 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400" />
                      <p className="text-sm md:text-base font-bold text-emerald-50 leading-relaxed relative z-10">{result.recommendation}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 flex items-start gap-4 text-[10px] text-emerald-800/60 font-medium leading-relaxed border-t border-emerald-100/60">
                  <Info size={14} className="shrink-0 text-emerald-500 mt-0.5" />
                  <p>
                    This simulation estimates possible review outcomes based on environmental parameters. 
                    <span className="font-bold block mt-1 text-emerald-950">Final decisions are taken by the authority.</span>
                  </p>
                </div>
              </motion.div>
            )}



          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
