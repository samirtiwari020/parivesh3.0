import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Trees, Bird, Waves, FileText, CheckCircle2, Clock, Landmark, Download, Phone, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ClearanceChart from '@/components/charts/ClearanceChart';
import { mockStats, mockNotices } from '@/data/mockData';

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

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
  const [activeNoticeTab, setActiveNoticeTab] = useState<string>('Environment');

  const filteredNotices = mockNotices.filter(n => n.category === activeNoticeTab);

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
        <div className="gov-container grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              SINGLE WINDOW HUB
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
              Pro-Active and Responsive facilitation by Interactive &amp; Virtuous Environmental Single-window Hub
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10 leading-relaxed max-w-xl">
              A workflow based, role-based application for online submission and monitoring of proposals for Environment, Forest, Wildlife and CRZ Clearances from the Government of India.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link to="/register" className="gov-btn-primary">Submit Proposal <ArrowRight size={18} /></Link>
              <Link to="/app" className="gov-btn-secondary">Track Application</Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 0.1 }} className="grid grid-cols-2 gap-3 md:gap-4">
            {roleCards.map((role, i) => (
              <Link to={i === 0 ? '/register' : '/login'} key={i} className="gov-card p-5 md:p-6 group cursor-pointer border border-transparent hover:border-primary/10">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <role.icon size={20} />
                </div>
                <h3 className="font-semibold text-foreground mb-1 text-sm md:text-base">{role.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{role.desc}</p>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="gov-section bg-surface">
        <div className="gov-container">
          <div className="mb-10 md:mb-16 max-w-2xl">
            <h2 className="gov-heading">About PARIVESH</h2>
            <p className="text-muted-foreground">PARIVESH is a Single-Window Integrated Environmental Management System, developed in pursuance of the Hon'ble Prime Minister's vision of Minimum Government and Maximum Governance.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Single Window', desc: 'One portal for all environmental clearances — EC, FC, Wildlife, and CRZ.' },
              { title: 'Transparent Process', desc: 'Track your application status in real-time with complete transparency.' },
              { title: 'Digital India', desc: 'Paperless, efficient processing aligned with Government of India digital initiatives.' },
            ].map((item, i) => (
              <div key={i} className="gov-card p-6 md:p-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 font-bold">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clearance Categories */}
      <section className="gov-section">
        <div className="gov-container">
          <div className="mb-10 md:mb-16 max-w-2xl">
            <h2 className="gov-heading">Clearance Categories</h2>
            <p className="text-muted-foreground">Select the appropriate clearance category to view guidelines and initiate your application.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {clearanceCategories.map((cat, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className="gov-card p-6 flex flex-col items-start border border-muted/50">
                <div className={`w-12 h-12 rounded-xl ${cat.bgClass} ${cat.colorClass} flex items-center justify-center mb-6`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{cat.title} Clearance</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">Guidelines and submission process for {cat.title.toLowerCase()} related projects.</p>
                <button className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
                  View Details <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Board */}
      <section className="gov-section bg-surface">
        <div className="gov-container">
          <h2 className="gov-heading mb-8">Notice Board</h2>
          <div className="gov-card overflow-hidden">
            <div className="flex border-b border-border overflow-x-auto">
              {noticeCategories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveNoticeTab(tab)}
                  className={`px-4 md:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap relative ${
                    activeNoticeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                  {activeNoticeTab === tab && (
                    <motion.div layoutId="notice-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" transition={spring} />
                  )}
                </button>
              ))}
            </div>
            <div className="divide-y divide-border">
              {filteredNotices.length > 0 ? filteredNotices.map((notice) => (
                <div key={notice.id} className="px-4 md:px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{notice.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notice.date}</p>
                  </div>
                  <button className="text-primary hover:text-primary/80 transition-colors shrink-0 ml-4">
                    <Download size={16} />
                  </button>
                </div>
              )) : (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">No notices available.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="gov-section">
        <div className="gov-container grid lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-1">
            <h2 className="gov-heading">Real-time Statistics</h2>
            <p className="text-muted-foreground mb-8">Transparent view of application processing across all clearance categories.</p>
            <div className="space-y-4">
              <div className="gov-card p-5 flex justify-between items-center">
                <span className="font-medium">Total Received</span>
                <span className="text-2xl font-bold tabular-data">11,700</span>
              </div>
              <div className="gov-card p-5 flex justify-between items-center">
                <span className="font-medium">Total Approved</span>
                <span className="text-2xl font-bold text-accent tabular-data">7,500</span>
              </div>
              <div className="gov-card p-5 flex justify-between items-center">
                <span className="font-medium">Pending</span>
                <span className="text-2xl font-bold text-status-pending tabular-data">2,600</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <ClearanceChart data={mockStats} />
          </div>
        </div>
      </section>

      {/* Manuals & Helpdesk */}
      <section className="gov-section bg-surface">
        <div className="gov-container grid md:grid-cols-2 gap-8">
          <div className="gov-card p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-4">Manuals & Walkthroughs</h3>
            <p className="text-sm text-muted-foreground mb-6">Download user manuals and step-by-step guides for using the PARIVESH portal.</p>
            <Link to="/manuals" className="gov-btn-primary text-sm">
              <Download size={16} /> View All Manuals
            </Link>
          </div>
          <div className="gov-card p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-4">Helpdesk Support</h3>
            <p className="text-sm text-muted-foreground mb-4">Need assistance? Contact our support team.</p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone size={14} /> 1800-XXX-XXXX (Toll Free)</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail size={14} /> support@parivesh.nic.in</div>
            </div>
            <Link to="/helpdesk" className="gov-btn-secondary text-sm">
              <MessageSquare size={16} /> Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
