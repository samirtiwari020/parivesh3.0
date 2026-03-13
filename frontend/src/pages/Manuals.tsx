import { Download, BookOpen, FileText, ChevronRight, Search, FileQuestion } from 'lucide-react';
import { mockManuals } from '@/data/mockData';
import { motion } from 'framer-motion';
import { useState } from 'react';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Manuals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Getting Started', 'Proposals', 'Compliance', 'Technical'];

  // Temporary mock data filtering (assuming mockManuals has a category prop)
  const filteredManuals = mockManuals.filter(manual => {
    const matchesSearch = manual.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          manual.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || manual.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      
      {/* Background Decorators */}
      <div className="fixed top-0 inset-x-0 h-[600px] bg-gradient-to-b from-emerald-50 via-slate-50/50 to-transparent pointer-events-none z-0" />
      <motion.div 
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-10 right-[-10%] w-[35rem] h-[35rem] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-multiply"
      />
      <motion.div 
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="fixed bottom-20 left-[-5%] w-[45rem] h-[45rem] bg-teal-100/50 rounded-full blur-[130px] pointer-events-none z-0 mix-blend-multiply"
      />
      
      {/* Hero Header */}
      <div className="relative pt-16 pb-12 lg:pt-20 lg:pb-16 z-10 border-b border-slate-200/60 overflow-hidden bg-white/40 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80')] bg-cover bg-center bg-no-repeat opacity-[0.06] z-0 pointer-events-none mix-blend-multiply" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <motion.div 
                custom={1} initial="hidden" animate="visible" variants={fadeUpVariants}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-600 text-sm font-bold mb-6 shadow-sm"
              >
                <BookOpen size={16} className="text-emerald-500" />
                <span>Knowledge Base</span>
              </motion.div>
              
              <motion.h1 
                custom={2} initial="hidden" animate="visible" variants={fadeUpVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
              >
                Manuals & <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Walkthroughs</span>
              </motion.h1>
              
              <motion.p 
                custom={3} initial="hidden" animate="visible" variants={fadeUpVariants}
                className="text-lg text-slate-600 font-medium leading-relaxed"
              >
                Comprehensive guides, SOPs, and step-by-step instructions to help you navigate and master the PARIVESH system seamlessly.
              </motion.p>
            </div>

            {/* Search Bar */}
            <motion.div 
              custom={4} initial="hidden" animate="visible" variants={fadeUpVariants}
              className="w-full lg:w-96 shrink-0 relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all text-slate-800 placeholder:text-slate-400 outline-none font-medium shadow-sm" 
                placeholder="Search for guides or keywords..." 
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        
        {/* Categories Tab Bar */}
        <motion.div 
          custom={5} initial="hidden" animate="visible" variants={fadeUpVariants}
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 outline-none flex-shrink-0 ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Resources Grid */}
        {filteredManuals.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredManuals.map((manual) => (
              <motion.div 
                key={manual.id} 
                variants={cardVariants}
                className="group relative bg-white rounded-3xl border border-slate-200 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.15)] hover:border-emerald-200 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 overflow-hidden"
              >
                {/* Decorative background accent on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100" />
                
                <div className="relative z-10 flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                    <FileText size={24} />
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                    {manual.category}
                  </span>
                </div>
                
                <h3 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors relative z-10">
                  {manual.title}
                </h3>
                
                <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-1 relative z-10">
                  {manual.description}
                </p>
                
                <div className="relative z-10 pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                    {manual.fileSize || '2.4 MB'} • PDF
                  </div>
                  <button className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-500 hover:text-white transition-colors duration-300 group/btn">
                    <Download size={18} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200 border-dashed"
          >
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
              <FileQuestion size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No active manuals found.</h3>
            <p className="text-slate-500 font-medium">Try adjusting your search terms or selecting a different category.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
