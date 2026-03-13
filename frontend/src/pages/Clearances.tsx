import { useState, useEffect } from 'react';
import { ChevronRight, FileText, FileDown, Leaf, Trees, Bird, Waves, FileQuestion } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarLinks = [
  'Overview',
  'Know Your Approving Authority(KYAA)',
  'Know Your Process Flow',
  'Know Your Application Forms',
  'Agenda & MoM',
  'Notifications & Orders',
];

const categories = ['Environment', 'Forest', 'Wildlife', 'CRZ'];

const categoryIcons: Record<string, any> = {
  Environment: Leaf,
  Forest: Trees,
  Wildlife: Bird,
  CRZ: Waves,
};

// Mock data to show something different for each category
const formData = {
  Environment: [
    { name: 'Fresh Proposal Form (Env)', desc: 'Fresh Proposal Form for Environment clearance', seq: 'CAF + Fresh Proposal Form (Env)' },
    { name: 'Amendment Proposal Form', desc: 'Amendment Proposal Form', seq: 'CAF + Amendment Proposal Form' },
  ],
  Forest: [
    { name: 'Forest Diversion Form', desc: 'Form for forest land diversion', seq: 'CAF + Forest Diversion' },
    { name: 'Tree Cutting Form', desc: 'Form for tree felling permission', seq: 'CAF + Tree Felling' },
  ],
  Wildlife: [
    { name: 'Wildlife Clearance Form', desc: 'Form for wildlife protected areas', seq: 'CAF + Wildlife Clearance' },
  ],
  CRZ: [
    { name: 'Fresh Proposal Form (New)', desc: 'Fresh Proposal Form of CRZ clearance', seq: 'CAF + Fresh Proposal Form (New)' },
    { name: 'Amendment Proposal Form', desc: 'Amendment Proposal Form', seq: 'CAF + Amendment Proposal Form' },
    { name: 'CRZ Validity Extension', desc: 'CRZ Validity Extension', seq: 'CAF + CRZ Validity Extension' },
    { name: 'Transfer of CRZ Clearance', desc: 'Transfer of CRZ Clearance', seq: 'CAF + Transfer of CRZ Clearance' },
  ],
};

export default function Clearances() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeSidebar, setActiveSidebar] = useState('Know Your Application Forms');
  const [activeCategory, setActiveCategory] = useState(
    categoryParam && categories.includes(categoryParam) ? categoryParam : 'CRZ'
  );

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearchParams({ category: cat });
  };

  const currentForms = formData[activeCategory as keyof typeof formData] || [];

  return (
    <div className="min-h-screen bg-stone-50/30 flex flex-col font-sans">
      
      {/* Top Hero Section with Light Background */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-emerald-100/50">
        {/* Very light attractive background image */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.2]"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        {/* Soft gradient overlay so the image isn't too strong and text is readable */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-50/60 via-white/80 to-stone-50/90" />
        
        <div className="gov-container relative z-10 px-4 md:px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-emerald-950 mb-6 drop-shadow-sm tracking-tight"
          >
            Clearance <span className="text-emerald-700">Guidelines</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-emerald-800/80 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Access comprehensive information, application forms, and procedures for your specific environmental clearance needs.
          </motion.p>
        </div>
      </div>

      {/* Categories Tabs Section - with Glassmorphism */}
      <div className="sticky top-[73px] md:top-[85px] z-40 bg-white/70 backdrop-blur-xl border-b border-emerald-100 shadow-sm">
        <div className="gov-container px-4 md:px-6">
          <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-4 pt-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`relative px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 group ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50/80 rounded-t-2xl border-x border-t border-emerald-100/50'
                      : 'text-emerald-950/50 hover:text-emerald-700 hover:bg-stone-50/80 rounded-t-2xl'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-emerald-950/30 group-hover:text-emerald-500 transition-colors duration-300'} />
                  {cat}
                  {isActive && (
                    <motion.div 
                      layoutId="activeCategoryBorder"
                      className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-600 rounded-t-full shadow-[0_-2px_8px_rgba(5,150,105,0.4)]" 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="gov-container px-4 md:px-6 py-10 md:py-14 flex-grow relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative z-10">
          
          {/* Left Sidebar Menu */}
          <div className="md:col-span-4 lg:col-span-3">
             <div className="sticky top-40 bg-white/60 backdrop-blur-md rounded-2xl shadow-xl shadow-emerald-900/5 border border-white overflow-hidden flex flex-col p-2 space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = activeSidebar === link;
                return (
                  <button
                    key={link}
                    onClick={() => setActiveSidebar(link)}
                    className={`group flex items-center justify-between px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-300 text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md transform scale-[1.02]'
                        : 'text-emerald-950/70 hover:bg-white hover:shadow-sm hover:text-emerald-900'
                    }`}
                  >
                    <span className="flex-1 pr-2">{link}</span>
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform duration-300 ${
                        isActive ? 'text-white translate-x-1' : 'text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1'
                      }`} 
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-8 lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + activeSidebar}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 pb-6 border-b border-emerald-100/60">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 flex items-center justify-center shadow-inner border border-emerald-200/50 shrink-0">
                    {activeSidebar === 'Know Your Application Forms' ? <FileText size={24} /> : <FileQuestion size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-emerald-950">
                      {activeSidebar}
                    </h2>
                    <span className="inline-flex items-center gap-2 text-xs font-sans font-bold text-emerald-600 mt-2 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {activeCategory} Clearance
                    </span>
                  </div>
                </div>
                
                {activeSidebar === 'Know Your Application Forms' ? (
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-emerald-900/5 border border-white overflow-hidden relative">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3"></div>
                    
                    <div className="overflow-x-auto relative z-10 p-2">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr>
                            <th className="px-6 py-5 font-bold text-emerald-900/50 uppercase tracking-wider text-center w-16 text-xs border-b border-emerald-100/50">S.No.</th>
                            <th className="px-6 py-5 font-bold text-emerald-900/50 uppercase tracking-wider text-xs border-b border-emerald-100/50">Form Name</th>
                            <th className="px-6 py-5 font-bold text-emerald-900/50 uppercase tracking-wider text-center w-28 text-xs border-b border-emerald-100/50">Action</th>
                            <th className="px-6 py-5 font-bold text-emerald-900/50 uppercase tracking-wider w-[30%] text-xs border-b border-emerald-100/50">Description</th>
                            <th className="px-6 py-5 font-bold text-emerald-900/50 uppercase tracking-wider w-[25%] text-xs border-b border-emerald-100/50">Sequence</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                          {currentForms.map((item, idx) => (
                            <tr key={idx} className="group hover:bg-emerald-50/50 transition-all duration-300">
                              <td className="px-6 py-6 text-center font-bold text-emerald-950/40 group-hover:text-emerald-600 transition-colors">
                                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                              </td>
                              <td className="px-6 py-6 font-bold text-emerald-900 text-base">{item.name}</td>
                              <td className="px-6 py-6">
                                <div className="flex items-center justify-center gap-3">
                                  <button className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-blue-500/25 group/btn" title="Download Word Format">
                                    <FileText size={18} className="group-hover/btn:scale-110 transition-transform" />
                                  </button>
                                  <button className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-red-500/25 group/btn" title="Download PDF Format">
                                    <FileDown size={18} className="group-hover/btn:scale-110 transition-transform" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-6 text-emerald-950/70 leading-relaxed font-medium">{item.desc}</td>
                              <td className="px-6 py-6">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100/60 text-emerald-800 border border-emerald-200/50 shadow-sm">
                                  {item.seq}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {currentForms.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center justify-center text-emerald-950/40">
                                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                                    <FileQuestion size={32} className="opacity-50" />
                                  </div>
                                  <p className="text-xl font-bold text-emerald-900/60">No forms available</p>
                                  <p className="text-sm mt-2 font-medium">Please check back later or select another category above.</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl shadow-emerald-900/5 border border-white p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-stone-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-emerald-100/50">
                        <FileQuestion size={40} className="text-emerald-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-emerald-900 mb-3">Content Coming Soon</h3>
                      <p className="text-emerald-950/60 max-w-md mx-auto leading-relaxed text-lg">
                        The content for <strong>"{activeSidebar}"</strong> is currently being compiled.
                      </p>
                      <button 
                        onClick={() => setActiveSidebar('Know Your Application Forms')}
                        className="mt-8 px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl shadow-sm border border-emerald-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        View Application Forms Instead
                      </button>
                    </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
