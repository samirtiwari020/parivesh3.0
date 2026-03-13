import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Trees, Bird, Waves, FileText, CheckCircle2, Clock, Landmark, Download, Phone, Mail, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ClearanceChart from '@/components/charts/ClearanceChart';
import { mockStats, mockNotices } from '@/data/mockData';

import heroImage from '@/assets/images/copy1.jpg';

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

// We keep roleCards here for future use or move them elsewhere if needed,
// but for the Hero section, we will show the image instead.
const roleCards = [
  { title: 'Project Proponent', desc: 'Submit & Track Proposals', icon: FileText },
  { title: 'State Authority', desc: 'Process & Review', icon: CheckCircle2 },
  { title: 'Central Authority', desc: 'Final Approval', icon: Landmark },
  { title: 'Employee Mapping', desc: 'Internal Access', icon: Clock },
];

const clearanceCategories = [
  { title: 'Environment', icon: Leaf, colorClass: 'text-accent', bgClass: 'bg-accent/10' },
  { title: 'Forest', icon: Trees, colorClass: 'text-primary', bgClass: 'bg-primary/10' },
  { title: 'Wildlife', icon: Bird, colorClass: 'text-status-pending', bgClass: 'bg-status-pending/10' },
  { title: 'CRZ', icon: Waves, colorClass: 'text-status-review', bgClass: 'bg-status-review/10' },
];

const noticeCategories = ['Environment', 'Forest', 'Wildlife', 'CAMPA'] as const;

export default function Home() {
  const navigate = useNavigate();
  const [activeNoticeTab, setActiveNoticeTab] = useState<string>('Environment');

  const filteredNotices = mockNotices.filter(n => n.category === activeNoticeTab);

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-24 md:pt-32 pb-24 md:pb-36 px-4 md:px-6 overflow-hidden">
        {/* Full-screen Background Image */}
        <div className="absolute inset-0 -z-20">
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroImage} 
            alt="Environmental Conservation Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Premium Gradient Overlays for depth and text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-transparent -z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent -z-10" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-overlay pointer-events-none -z-10" />

        <div className="gov-container w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Main Content */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={spring} className="lg:col-span-8 max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide mb-8 shadow-sm"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                </span>
                ENVIRONMENTAL SINGLE WINDOW HUB
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif font-extrabold text-white leading-[1.1] mb-6 tracking-tight drop-shadow-xl">
                <span className="block text-accent mb-2">Pro-Active</span>
                Responsive Facilitation
              </h1>
              
              <p className="text-lg md:text-2xl text-emerald-50/90 mb-10 leading-relaxed max-w-2xl font-light drop-shadow-md">
                A virtuous environmental hub for online submission and monitoring of proposals for Clearances from the Government of India.
              </p>
              
              <div className="flex flex-wrap gap-4 md:gap-6">
                <Link to="/register" className="gov-btn-primary bg-white text-primary hover:bg-zinc-100 group relative overflow-hidden text-lg px-8 py-4 shadow-xl">
                  <span className="relative z-10 flex items-center gap-2 font-bold">
                    Submit Proposal 
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link to="/app" className="gov-btn-secondary text-lg px-8 py-4 text-white border-2 border-white/30 hover:bg-white/10 hover:border-white bg-white/5 backdrop-blur-md transition-all shadow-lg">
                  Track Application
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5 }}
                className="mt-12 flex items-center gap-8 text-sm font-medium text-emerald-100/80"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"><CheckCircle2 size={14} className="text-white" /></div> Make in India
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"><CheckCircle2 size={14} className="text-white" /></div> Digital India
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side Floating Badges / Info (Optional but adds balance) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ ...spring, delay: 0.4 }}
              className="lg:col-span-4 hidden lg:flex flex-col gap-6 justify-end h-full"
            >
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl ml-auto w-64 transform translate-y-12">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-4">
                  <Leaf size={24} />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Sustainable Focus</h3>
                <p className="text-emerald-100/70 text-sm leading-relaxed">Fast-tracking green clearances for rapid national growth.</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative gov-section pb-24 lg:pb-32 overflow-hidden bg-surface/50">
        <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-accent/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="gov-container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4 text-primary font-semibold text-sm">
                <span className="w-8 h-[2px] bg-primary rounded-full"></span>
                ABOUT PLATFORM
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground">
                Vision of Minimum Government, <span className="text-primary italic">Maximum Governance</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg md:max-w-md border-l-2 border-primary/30 pl-6 py-2">
              PARIVESH is a Single-Window Integrated Environmental Management System driving transparent policy execution.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Single Window', desc: 'One portal for all environmental clearances — EC, FC, Wildlife, and CRZ.', icon: Landmark },
              { title: 'Transparent Process', desc: 'Track your application status in real-time with complete transparency and accountability.', icon: CheckCircle2 },
              { title: 'Digital India', desc: 'Paperless, efficient processing aligned with Government of India digital initiatives.', icon: CheckCircle2 },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white hover:border-primary/20 shadow-soft hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex items-center justify-center mb-6 shadow-inner ring-1 ring-primary/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <span className="text-2xl font-black">{i + 1}</span>
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clearance Categories */}
      <section className="relative gov-section py-24 bg-gradient-to-b from-background to-surface">
        <div className="gov-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Clearance Categories</h2>
            <p className="text-lg text-muted-foreground">Select the appropriate clearance category to view guidelines and initiate your application securely.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {clearanceCategories.map((cat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -8 }} 
                onClick={() => navigate(`/clearances?category=${cat.title}`)}
                className="gov-card p-1 group relative flex flex-col items-start border-0 bg-gradient-to-b from-white to-white/80 shadow-soft hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden cursor-pointer"
              >
                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-full w-full bg-white/90 backdrop-blur-sm p-8 rounded-[1.8rem] flex flex-col items-start border border-white/50">
                  <div className={`w-16 h-16 rounded-2xl ${cat.bgClass} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    <cat.icon size={32} className={`drop-shadow-sm ${cat.colorClass}`} />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-foreground">{cat.title} Clearance</h3>
                  <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">Ensure compliance with {cat.title.toLowerCase()} guidelines. Simplify your submission process.</p>
                  
                  <div className="relative w-full overflow-hidden mt-auto">
                    <div className="text-sm font-bold text-primary flex items-center gap-2 group-hover:gap-4 transition-all w-full relative z-10">
                      View Resources 
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Board */}
      <section className="relative gov-section bg-gradient-to-br from-emerald-950 via-primary to-emerald-900 text-white overflow-hidden rounded-[3rem] mx-4 md:mx-6 lg:mx-12 my-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="gov-container relative z-10 py-12 md:py-20 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="lg:w-1/3">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white drop-shadow-md">Notice Board</h2>
              <p className="text-emerald-100/80 text-lg mb-8 leading-relaxed">Stay updated with the latest circulars, office memorandums, and official guidelines issued directly by the ministry.</p>
              
              <div className="flex flex-col gap-2">
                {noticeCategories.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveNoticeTab(tab)}
                    className={`px-6 py-4 text-left rounded-xl text-base font-semibold transition-all duration-300 border ${
                      activeNoticeTab === tab 
                        ? 'bg-white text-primary border-white shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]' 
                        : 'bg-black/20 text-emerald-100/70 border-white/10 hover:bg-black/30 hover:text-white'
                    }`}
                  >
                    {tab} Notifications
                  </button>
                ))}
              </div>
            </div>
            
            <div className="lg:w-2/3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="p-6 md:p-8 border-b border-white/10 bg-black/20 flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Recent Updates ({activeNoticeTab})
                </h3>
                <button className="text-sm font-medium text-accent hover:text-white transition-colors">View All</button>
              </div>
              <div className="divide-y divide-white/10 max-h-[500px] overflow-y-auto no-scrollbar relative">
                {filteredNotices.length > 0 ? filteredNotices.map((notice, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={notice.id} 
                    className="p-6 md:p-8 flex items-start justify-between group hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="pr-6">
                      <span className="inline-block px-3 py-1 bg-black/30 text-emerald-200 text-xs font-semibold rounded-full mb-3 shadow-sm border border-white/10">
                        {notice.date}
                      </span>
                      <p className="text-base md:text-lg font-medium text-white group-hover:text-accent transition-colors leading-snug">{notice.title}</p>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-black/30 text-emerald-200 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-primary-foreground transition-all transform group-hover:scale-110 shadow-lg border border-white/5">
                      <Download size={20} />
                    </button>
                  </motion.div>
                )) : (
                  <div className="p-12 text-center text-zinc-500">No recent notices available for this category.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="relative gov-section">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10" />
        <div className="gov-container grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Live Analytics</h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Transparent, real-time dashboard of application processing across all environmental clearance categories.
            </p>
            <div className="space-y-6">
              {[
                { label: 'Total Received', value: '11,700', colorClass: 'text-foreground', icon: FileText, bg: 'bg-zinc-100' },
                { label: 'Total Approved', value: '7,500', colorClass: 'text-accent', icon: CheckCircle2, bg: 'bg-accent/10' },
                { label: 'Pending Review', value: '2,600', colorClass: 'text-status-pending', icon: Clock, bg: 'bg-status-pending/10' },
              ].map((stat, i) => (
                <div key={i} className="group relative bg-surface p-6 rounded-[1.5rem] border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.colorClass}`}>
                        <stat.icon size={20} />
                      </div>
                      <span className="font-semibold text-lg text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className={`text-3xl font-bold tabular-data ${stat.colorClass}`}>{stat.value}</span>
                  </div>
                  <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ${stat.bg.replace('/10', '')} bg-opacity-100`} style={{ backgroundColor: i===1 ? 'hsl(var(--accent))' : i===2 ? 'hsl(var(--status-pending))' : 'hsl(var(--foreground))' }} />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 bg-surface p-6 md:p-8 rounded-[2rem] shadow-soft border border-border/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-xl">Clearance Trends (YTD)</h3>
              <select className="bg-background border border-border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>All Categories</option>
                <option>Environment</option>
                <option>Forest</option>
              </select>
            </div>
            <ClearanceChart data={mockStats} />
          </div>
        </div>
      </section>

      {/* Manuals & Helpdesk */}
      <section className="relative gov-section">
        <div className="gov-container grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Manuals */}
          <div className="group relative bg-gradient-to-br from-surface to-background p-8 md:p-12 rounded-[2.5rem] border border-border/50 shadow-soft hover:shadow-2xl transition-all duration-500 overflow-hidden text-center md:text-left">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-8 mx-auto md:mx-0 shadow-inner group-hover:scale-110 transition-transform">
              <FileText size={32} />
            </div>
            <h3 className="text-3xl font-serif font-bold mb-4">Knowledge Base</h3>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Access comprehensive user manuals, video tutorials, and step-by-step guides for navigating the portal.
            </p>
            <Link to="/manuals" className="gov-btn-primary px-8 py-4 w-full justify-center text-lg overflow-hidden relative">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Download size={20} /> Access Resources
              </span>
            </Link>
          </div>

          {/* Helpdesk */}
          <div className="group relative bg-gradient-to-br from-primary to-emerald-900 text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden text-center md:text-left">
            <div className="absolute right-0 top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 mx-auto md:mx-0 shadow-inner border border-white/20 group-hover:scale-110 transition-transform">
                <Phone size={32} className="text-white drop-shadow-sm" />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-4 text-white">Need Assistance?</h3>
              <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
                Our dedicated support team is available 24/7 to help you with technical queries or application tracking.
              </p>
              
              <div className="space-y-4 mb-10 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 text-base font-medium">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Phone size={18} /></div> 
                  <div>
                    <span className="block text-primary-foreground/60 text-xs uppercase tracking-wider mb-1">Toll Free</span>
                    1800-XXX-XXXX
                  </div>
                </div>
                <div className="h-px w-full bg-white/10" />
                <div className="flex items-center gap-4 text-base font-medium">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Mail size={18} /></div> 
                  <div>
                    <span className="block text-primary-foreground/60 text-xs uppercase tracking-wider mb-1">Email Support</span>
                    support@parivesh.nic.in
                  </div>
                </div>
              </div>
              
              <Link to="/helpdesk" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-bold shadow-lg hover:bg-zinc-50 hover:scale-[1.02] transition-all w-full text-lg group/btn">
                <MessageSquare size={20} className="group-hover/btn:animate-pulse" /> Live Chat Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
