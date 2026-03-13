import { useState } from 'react';
import { Home, Leaf, Shield, CheckCircle2, Sprout, Eye, Compass, Workflow, Globe, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'objective', label: 'Objective', icon: Compass },
  { id: 'evolution', label: 'Evolution of PARIVESH', icon: Workflow },
  { id: 'modules', label: 'Modules', icon: Globe },
];

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
  }),
};

export default function About() {
  const [activeTab, setActiveTab] = useState('objective');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden relative selection:bg-emerald-500/30">
      
      {/* Global Ambient Glows */}
      <div className="fixed top-0 inset-x-0 h-[500px] bg-gradient-to-b from-emerald-100/50 via-transparent to-transparent pointer-events-none z-0" />
      <motion.div 
        animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{ x: [0, -30, 0], y: [0, 50, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="fixed bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-teal-100/60 rounded-full blur-[100px] pointer-events-none z-0"
      />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden border-b border-slate-200">
        {/* Vibrant Natural Landscape Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80')] bg-cover bg-center opacity-[0.45] z-0 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-slate-50/70 to-emerald-50/20 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/90 to-transparent z-0" />
        
        {/* Dynamic geometric accents */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] z-0" />
        
        <div className="max-w-7xl mx-auto relative z-20 px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-3xl">
              <motion.div 
                custom={1} initial="hidden" animate="visible" variants={fadeUpVariants}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-600 text-sm font-bold mb-8 shadow-sm"
              >
                <Sprout size={16} />
                <span>Next Generation Platform</span>
              </motion.div>
              
              <motion.h1 
                custom={2} initial="hidden" animate="visible" variants={fadeUpVariants}
                className="text-5xl lg:text-6xl xl:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 via-emerald-800 to-teal-600 tracking-tight leading-[1.1] mb-6"
              >
                Transforming <br/> Environmental Governance.
              </motion.h1>
              
              <motion.p 
                custom={3} initial="hidden" animate="visible" variants={fadeUpVariants}
                className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium max-w-xl"
              >
                PARIVESH 2.0 is the definitive single-window hub for processing Environment, Forest, Wildlife, and Coastal Regulation Zone clearances securely and sustainably.
              </motion.p>
              
              <motion.div 
                custom={4} initial="hidden" animate="visible" variants={fadeUpVariants}
                className="mt-10 flex items-center gap-4 hidden lg:flex"
              >
                <div className="flex -space-x-3">
                  {[1,2,3].map((i) => (
                    <div key={i} className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-slate-100 shadow-md`}>
                       <Shield size={18} className="text-emerald-500" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="block font-bold text-slate-800">10,000+</span>
                  <span className="text-slate-500 font-medium">Clearances processed</span>
                </div>
              </motion.div>
            </div>
            
            {/* Right Visual Composition */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block h-[500px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Main large image */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-64 h-80 rounded-[2rem] overflow-hidden border-4 border-white shadow-[0_20px_50px_-12px_rgba(16,185,129,0.3)] rotate-[-6deg]"
                >
                  <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80" alt="Nature" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
                </motion.div>

                {/* Secondary overlapping image */}
                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute right-4 bottom-12 z-20 w-56 h-64 rounded-[2rem] overflow-hidden border-4 border-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rotate-[8deg]"
                >
                  <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80" alt="Plant" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 to-transparent" />
                </motion.div>

                {/* Decorative floating icon badge */}
                <motion.div 
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-20 right-16 z-30 w-16 h-16 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center shadow-xl"
                >
                  <Leaf className="text-emerald-500" size={28} />
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Sidebar Menu */}
          <div className="lg:col-span-4 xl:col-span-3">
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUpVariants} className="sticky top-28">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">
                Discover
              </h2>
              <div className="flex flex-col gap-2 relative">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold transition-all w-full text-left outline-none ${
                        isActive 
                          ? 'text-emerald-700 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 bg-white border border-emerald-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon size={18} className={`relative z-10 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="relative z-10">{tab.label}</span>
                      
                      {isActive && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-4 w-1.5 h-1.5 rounded-full bg-emerald-500 z-10"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Extra Stats Card */}
              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hidden lg:block">
                <Leaf className="text-emerald-600 mb-4" size={28} />
                <h3 className="text-slate-800 font-bold mb-2">Sustainable Future</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Driving India's ecological balance through seamless, transparent digital administration.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Content Panels */}
          <div className="lg:col-span-8 xl:col-span-9 min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {activeTab === 'objective' && (
                <motion.div
                  key="objective"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-10"
                >
                  {/* Image Frame */}
                  <div className="relative h-64 sm:h-80 md:h-[400px] w-full rounded-3xl overflow-hidden group shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">
                    <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img 
                      src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80" 
                      alt="Lush forest landscape" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-20" />
                    <div className="absolute bottom-6 left-6 z-30 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                        <Eye className="text-white drop-shadow-md" size={24} />
                      </div>
                      <span className="text-white font-serif font-bold tracking-wide text-xl drop-shadow-md">The Vision</span>
                    </div>
                  </div>

                  <div className="prose prose-emerald max-w-none text-slate-600 font-medium text-lg leading-relaxed">
                    <p>
                      In pursuant to <strong className="text-slate-800">'Digital India'</strong> and capturing the spirit of Minimum Government and Maximum Governance, a Single-Window named <strong className="text-emerald-700">PARIVESH</strong> (Pro-Active and Responsive facilitation by Interactive, Virtuous, and Environmental Single Window Hub) has been developed by the MOEFCC through NIC.
                    </p>
                    <p className="mt-6">
                      Encouraged by the success of the existing system, its scope has been further onboarded with a technology-driven and professionally run institutional mechanism. It provides a comprehensive single window solution for the administration of all green clearances and monitors their subsequent compliance across the nation. Process transformation, technology transformation, and domain knowledge intervention were the key drivers behind the framework of the new PARIVESH 2.0.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-shadow">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                      <div>
                        <h4 className="text-slate-800 font-bold mb-1">Process Transformation</h4>
                        <p className="text-sm text-slate-500 font-medium">Streamlining legacy systems into modern digital frameworks.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-shadow">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                      <div>
                        <h4 className="text-slate-800 font-bold mb-1">Technology Driven</h4>
                        <p className="text-sm text-slate-500 font-medium">Leveraging state-of-the-art infrastructure and analytics.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'evolution' && (
                <motion.div
                  key="evolution"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <div className="mb-10">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Journey of Transformation</h2>
                    <p className="text-slate-600 font-medium text-lg">
                      The evolution of PARIVESH marks a significant milestone in India's journey towards sustainable growth and transparent governance.
                    </p>
                  </div>

                  <div className="relative border-l-2 border-emerald-100 ml-4 py-4 space-y-12">
                    
                    {[
                      { title: "Initial Launch", desc: "Launch of the foundational portal dedicated solely to Environmental Clearances.", icon: Sprout },
                      { title: "Unified Integration", desc: "Integration of Forest, Wildlife, and CRZ clearances into a unified, accessible platform.", icon: Globe },
                      { title: "PARIVESH 2.0", desc: "Transition to version 2.0 focusing on end-to-end process automation and user experience.", icon: Workflow },
                      { title: "Advanced Analytics", desc: "Implementation of GIS-based decision support systems and predictive analytics.", icon: Compass },
                    ].map((step, idx) => {
                      const StepIcon = step.icon;
                      return (
                        <div key={idx} className="relative pl-10 group">
                          {/* Timeline dot */}
                          <div className="absolute -left-[21px] top-1 w-10 h-10 rounded-full bg-white border-2 border-emerald-200 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-500 transition-colors shadow-sm">
                            <StepIcon size={16} className="text-emerald-600" />
                          </div>
                          
                          <div className="bg-white border border-slate-100 group-hover:border-emerald-200 rounded-2xl p-6 transition-all shadow-sm group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:-translate-y-1">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                            <p className="text-slate-600 font-medium">{step.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'modules' && (
                <motion.div
                  key="modules"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Core Clearances</h2>
                    <p className="text-slate-600 font-medium text-lg">
                      PARIVESH encompasses various specialized modules designed to logically distribute and streamline specific types of green clearances.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 block pt-4">
                    {[
                      { title: "Environment Clearance", desc: "Processing and monitoring of environmental impact assessments across industrial sectors.", color: "bg-emerald-50/60 hover:bg-emerald-50", border: "border-emerald-100 hover:border-emerald-200", iconColor: "text-emerald-600", iconBg: "bg-emerald-100", icon: Wind },
                      { title: "Forest Clearance", desc: "Evaluating proposals involving diversion of forest land for non-forestry purposes responsibly.", color: "bg-stone-50/60 hover:bg-stone-50", border: "border-stone-100 hover:border-stone-200", iconColor: "text-stone-600", iconBg: "bg-stone-200/60", icon: Leaf },
                      { title: "Wildlife Clearance", desc: "Rigorous reviews for applications affecting protected areas, national parks, and wildlife habitats.", color: "bg-teal-50/60 hover:bg-teal-50", border: "border-teal-100 hover:border-teal-200", iconColor: "text-teal-600", iconBg: "bg-teal-100", icon: Shield },
                      { title: "CRZ Clearance", desc: "Management of Coastal Regulation Zone regulations and proposals for coastal stability.", color: "bg-cyan-50/60 hover:bg-cyan-50", border: "border-cyan-100 hover:border-cyan-200", iconColor: "text-cyan-600", iconBg: "bg-cyan-100", icon: Globe },
                    ].map((mod, idx) => {
                      const ModIcon = mod.icon;
                      return (
                        <div key={idx} className={`relative p-8 rounded-3xl ${mod.color} border ${mod.border} group transition-all duration-300`}>
                          <div className={`w-12 h-12 rounded-2xl ${mod.iconBg} flex items-center justify-center mb-6`}>
                            <ModIcon className={mod.iconColor} size={24} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-900">{mod.title}</h3>
                          <p className="text-slate-600 font-medium leading-relaxed group-hover:text-slate-700">{mod.desc}</p>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
