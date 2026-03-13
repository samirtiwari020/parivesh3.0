import { useState } from 'react';
import { ChevronRight, FileText, FileDown, Layers, FileSignature, CheckCircle2, ShieldCheck } from 'lucide-react';
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

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] },
  }),
};

export default function Clearances() {
  const [activeSidebar, setActiveSidebar] = useState('Know Your Application Forms');
  const [activeCategory, setActiveCategory] = useState('CRZ');

  const currentForms = formData[activeCategory as keyof typeof formData] || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      
      {/* Background Decorators */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-emerald-50 to-transparent pointer-events-none z-0" />
      <div className="fixed top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-emerald-200/30 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-multiply" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-teal-100/40 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none z-0" />

      {/* Hero Header */}
      <div className="relative pt-16 pb-12 lg:pt-20 lg:pb-16 z-10 border-b border-slate-200/60 overflow-hidden bg-white/40 backdrop-blur-xl">
        {/* Beautiful Natural Landscape Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=1920&q=80')] bg-cover bg-center bg-no-repeat opacity-[0.25] z-0 pointer-events-none mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 to-transparent z-0 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div 
              custom={1} initial="hidden" animate="visible" variants={fadeUpVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-emerald-100 text-emerald-600 text-sm font-bold mb-6 shadow-sm"
            >
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Regulatory Hub</span>
            </motion.div>
            
            <motion.h1 
              custom={2} initial="hidden" animate="visible" variants={fadeUpVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
            >
              Examine <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Clearances</span> & <br/> Application Forms
            </motion.h1>
            
            <motion.p 
              custom={3} initial="hidden" animate="visible" variants={fadeUpVariants}
              className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl"
            >
              Access the complete repository of procedural guidelines, necessary forms, and regulatory workflows across all environmental domains. 
            </motion.p>
          </div>
        </div>
      </div>

      {/* 4 Category Tabs (Sticky Below Header) */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-8 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pb-4 text-[13px] sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap relative outline-none ${
                  activeCategory === cat
                    ? 'text-emerald-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="activeCategoryTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Sidebar Menu */}
          <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-32">
            <motion.div 
              custom={4} initial="hidden" animate="visible" variants={fadeUpVariants}
              className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col p-2 relative"
            >
              {/* Decorative side accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full -z-0 opacity-50 pointer-events-none" />

              {sidebarLinks.map((link) => {
                const isActive = activeSidebar === link;
                return (
                  <button
                    key={link}
                    onClick={() => setActiveSidebar(link)}
                    className={`relative w-full text-left px-5 py-4 my-1 rounded-2xl flex items-center justify-between text-sm transition-all duration-300 outline-none z-10 group ${
                      isActive
                        ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                        : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="relative z-10 break-words pr-4">{link}</span>
                    <ChevronRight 
                      size={18} 
                      className={`relative z-10 shrink-0 transition-transform duration-300 ${isActive ? 'text-white translate-x-1' : 'text-slate-400 group-hover:translate-x-1'}`} 
                    />
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 xl:col-span-9 lg:min-h-[600px]">
             
             <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUpVariants} className="mb-8 pl-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600">
                    <Layers size={20} />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">{activeSidebar}</h2>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-2 ml-[3.25rem]">
                  Domain: 
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    {activeCategory}
                  </span>
                </div>
             </motion.div>
            
            <AnimatePresence mode="wait">
              {activeSidebar === 'Know Your Application Forms' ? (
                <motion.div 
                  key="table-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
                >
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm text-left whitespace-nowrap lg:whitespace-normal">
                      <thead className="bg-[#0f951e] text-white">
                        <tr>
                          <th className="px-5 py-5 font-bold text-center w-16">#</th>
                          <th className="px-6 py-5 font-bold border-l border-emerald-500/30">Application Form Name</th>
                          <th className="px-6 py-5 font-bold border-l border-emerald-500/30 w-[35%]">Description</th>
                          <th className="px-6 py-5 font-bold border-l border-emerald-500/30 w-[20%]">Workflow Sequence</th>
                          <th className="px-5 py-5 font-bold text-center border-l border-emerald-500/30 w-28">Download</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentForms.map((item, idx) => (
                          <motion.tr 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 + 0.2 }}
                            key={idx} 
                            className="bg-white hover:bg-emerald-50/50 transition-colors group"
                          >
                            <td className="px-5 py-5 text-center font-bold text-slate-400">{String(idx + 1).padStart(2, '0')}</td>
                            <td className="px-6 py-5">
                              <div className="font-bold text-slate-800">{item.name}</div>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-slate-600 font-medium leading-snug">{item.desc}</p>
                            </td>
                            <td className="px-6 py-5">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 group-hover:border-emerald-200 group-hover:bg-white transition-colors">
                                {item.seq}
                              </span>
                            </td>
                            <td className="px-5 py-5">
                              <div className="flex items-center justify-center gap-3">
                                <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="Download DOC">
                                  <FileText size={16} />
                                </button>
                                <button className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="Download PDF">
                                  <FileDown size={16} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                        {currentForms.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-20 text-center">
                              <div className="flex flex-col items-center justify-center text-slate-400">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                  <FileSignature size={28} className="opacity-50" />
                                </div>
                                <p className="font-medium text-lg text-slate-600">No application forms found.</p>
                                <p className="text-sm">Please check back later or select a different category.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-16 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <CheckCircle2 size={40} className="opacity-50" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Select an option</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">
                    Content for "<span className="text-slate-700">{activeSidebar}</span>" is currently being updated. Please select "Know Your Application Forms" to view the active data table.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
