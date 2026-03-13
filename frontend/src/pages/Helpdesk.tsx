import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, Globe2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const helpdeskSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email is required').max(255),
  category: z.string().min(1, 'Select a category'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

type HelpdeskForm = z.infer<typeof helpdeskSchema>;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
  }),
};

export default function Helpdesk() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<HelpdeskForm>({
    resolver: zodResolver(helpdeskSchema),
  });

  const onSubmit = (data: HelpdeskForm) => {
    console.log('Helpdesk:', data);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      
      {/* Background Decorators */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-emerald-50 to-transparent pointer-events-none z-0" />
      <div className="fixed top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-emerald-200/30 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-multiply" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-teal-100/40 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none z-0" />

      {/* Hero Header */}
      <div className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 z-10 border-b border-slate-200/60 overflow-hidden">
        {/* Fill the blank space with a beautiful faint nature background header */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80')] bg-cover bg-center bg-no-repeat opacity-[0.15] z-0 pointer-events-none mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 lg:from-slate-50 via-slate-50/80 to-slate-50/20 z-0 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mt-6 lg:mt-8">
          <div className="max-w-3xl text-center mx-auto">
            <motion.div 
              custom={1} initial="hidden" animate="visible" variants={fadeUpVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-emerald-100 text-emerald-600 text-sm font-bold mb-6 shadow-sm mx-auto"
            >
              <MessageSquare size={16} className="text-emerald-500" />
              <span>We're here to help</span>
            </motion.div>
            
            <motion.h1 
              custom={2} initial="hidden" animate="visible" variants={fadeUpVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
            >
              How can we support <br/> your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Journey today?</span>
            </motion.h1>
            
            <motion.p 
              custom={3} initial="hidden" animate="visible" variants={fadeUpVariants}
              className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto"
            >
              Whether you need technical assistance, guidance with clearance proposals, or have general inquiries, our dedicated support team is ready to assist.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Info & Support Channels */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUpVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                {[
                  { icon: Phone, title: "Toll Free Helpdesk", desc: "1800-XXX-XXXX", sub: "Available 9 AM to 6 PM (Mon-Sat)" },
                  { icon: Mail, title: "Email Support", desc: "support@parivesh.nic.in", sub: "Expect a response within 24 hours" },
                  { icon: MapPin, title: "Headquarters", desc: "MoEFCC, Indira Paryavaran Bhawan", sub: "Jor Bagh Road, New Delhi - 110003" },
                ].map((item, idx) => (
                  <div key={idx} className="group relative p-6 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110" />
                    
                    <div className="flex gap-5">
                      <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <item.icon size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1 opacity-70">{item.title}</h3>
                        <p className="font-bold text-slate-900 text-lg mb-1">{item.desc}</p>
                        <p className="text-sm text-slate-500 font-medium">{item.sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Global Reach Badge */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUpVariants} className="p-6 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none" />
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <Globe2 className="text-emerald-400" size={32} />
                <h3 className="font-bold text-xl">National Portal</h3>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed relative z-10 mb-6">
                Serving users across all states and union territories of India through our integrated digital infrastructure.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group relative z-10">
                Learn more about PARIVESH 
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Form Area */}
          <div className="lg:col-span-7 xl:col-span-8">
            <motion.div 
              custom={5} initial="hidden" animate="visible" variants={fadeUpVariants}
              className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] relative overflow-hidden"
            >
              {/* Decorative corner accent */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full blur-2xl opacity-70 pointer-events-none" />

              <h2 className="text-2xl font-bold text-slate-900 mb-8 relative z-10">Submit a Support Request</h2>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 flex flex-col items-center justify-center text-center relative z-10 min-h-[400px]"
                  >
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
                      <CheckCircle2 size={48} className="text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">Request Submitted!</h3>
                    <p className="text-slate-600 font-medium text-lg max-w-sm mb-8">
                      Thank you for reaching out. A ticket has been created and our support team will respond to your email within 48 hours.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                      Submit Another Query
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit(onSubmit)} 
                    className="space-y-6 relative z-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          {...register('name')} 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all text-slate-800 placeholder:text-slate-400 outline-none font-medium shadow-sm" 
                          placeholder="John Doe" 
                        />
                        {errors.name && <p className="text-xs text-red-500 font-bold ml-1">{errors.name.message}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                          {...register('email')} 
                          type="email" 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all text-slate-800 placeholder:text-slate-400 outline-none font-medium shadow-sm" 
                          placeholder="john@domain.gov.in" 
                        />
                        {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nature of Issue</label>
                      <div className="relative">
                        <select 
                          {...register('category')} 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all text-slate-800 outline-none font-medium shadow-sm appearance-none cursor-pointer"
                        >
                          <option value="" disabled selected className="text-slate-400">Select Issue Category...</option>
                          <option value="login">Login / Registration Issues</option>
                          <option value="proposal">Proposal Submission Assistance</option>
                          <option value="clearance">Clearance Status Inquiry</option>
                          <option value="documents">Document Upload Problems</option>
                          <option value="technical">Technical / Platform Bug</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>
                      {errors.category && <p className="text-xs text-red-500 font-bold ml-1">{errors.category.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Message Details</label>
                      <textarea 
                        {...register('message')} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all text-slate-800 placeholder:text-slate-400 outline-none font-medium shadow-sm min-h-[160px] resize-y" 
                        placeholder="Please describe your issue in as much detail as possible..." 
                      />
                      {errors.message && <p className="text-xs text-red-500 font-bold ml-1">{errors.message.message}</p>}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium hidden sm:flex">
                        <Clock size={16} className="text-emerald-500" />
                        Average response time: 24-48 hrs
                      </div>
                      
                      <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="group relative w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold overflow-hidden shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <span className="relative z-10">{isSubmitting ? 'Submitting...' : 'Send Request'}</span>
                        {!isSubmitting && <Send size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
