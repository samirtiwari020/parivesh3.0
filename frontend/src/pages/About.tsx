import { useState } from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const tabs = [
  { id: 'objective', label: 'Objective' },
  { id: 'evolution', label: 'Evolution of PARIVESH' },
  { id: 'modules', label: 'Modules' },
];

export default function About() {
  const [activeTab, setActiveTab] = useState('objective');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[250px] md:h-[300px] bg-emerald-950 flex flex-col justify-center overflow-hidden">
        {/* Placeholder for the hands holding plant background */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="/images/about-hero-bg.jpg" 
          alt="Hands holding plant" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          onError={(e) => {
            // Fallback if image doesn't exist yet
            e.currentTarget.style.display = 'none';
          }}
        />
        
        <div className="gov-container relative z-20 px-4 md:px-6">
          <div className="flex items-center text-sm font-medium text-emerald-100/80 mb-4">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home size={14} className="mb-0.5" />
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">About</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            About
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="gov-container px-4 md:px-6 py-12 md:py-16 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Left Sidebar Menu */}
          <div className="md:col-span-4 lg:col-span-3">
            <h2 className="text-xl font-bold text-foreground mb-6 pb-2 border-b border-border">
              What do we do?
            </h2>
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-surface border border-border/50 text-foreground/80 hover:bg-muted hover:text-foreground hover:border-border'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs ${activeTab === tab.id ? 'opacity-100' : 'opacity-50'}`}>
                    &gt;
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="md:col-span-8 lg:col-span-9">
            <h2 className="text-2xl font-bold text-foreground mb-6">About PARIVESH</h2>
            
            <div className="bg-surface rounded-2xl border border-border/50 p-6 shadow-sm">
              {activeTab === 'objective' && (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="w-full lg:w-1/3 shrink-0 rounded-xl overflow-hidden shadow-sm">
                     <img 
                      src="/images/green-tech-circle.jpg" 
                      alt="Green technology" 
                      className="w-full h-auto aspect-video object-cover"
                      onError={(e) => {
                         // Fallback placeholder
                         e.currentTarget.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80";
                      }}
                    />
                  </div>
                  <div className="w-full lg:w-2/3 prose prose-emerald prose-sm sm:prose-base max-w-none text-foreground/80 leading-relaxed">
                    <p className="mb-4">
                      In pursuant to 'Digital India' and capturing the spirit of Minimum Government and Maximum Governance, a Single-Window named PARIVESH (Pro-Active and Responsive facilitation by Interactive, Virtuous, and Environmental Single Window Hub) has been developed by the MOEFCC through NIC.
                    </p>
                    <p>
                      Encouraged by the success of the existing PARIVESH its scope has been further onboarded with a technology-driven and professionally run institutional mechanism, to provide a comprehensive single window solution for the administration of all green clearances and monitor their subsequent compliance across the nation. Process transformation, technology transformation, and domain knowledge intervention were the key drivers behind the framework of the new PARIVESH 2.0.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'evolution' && (
                <div className="prose prose-emerald prose-sm sm:prose-base max-w-none text-foreground/80 leading-relaxed">
                  <p>
                    The evolution of PARIVESH marks a significant milestone in India's journey towards sustainable growth and transparent governance. From its inception as a digitized clearance mechanism to its current iteration as PARIVESH 2.0.
                  </p>
                  <ul className="mt-4 list-disc pl-5 space-y-2">
                    <li>Launch of initial portal for Environmental Clearances.</li>
                    <li>Integration of Forest, Wildlife, and CRZ clearances into a unified platform.</li>
                    <li>Transition to PARIVESH 2.0 focusing on end-to-end process automation.</li>
                    <li>Implementation of advanced analytics and GIS-based decision support systems.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'modules' && (
                <div className="prose prose-emerald prose-sm sm:prose-base max-w-none text-foreground/80 leading-relaxed">
                  <p>
                    PARIVESH encompasses various specialized modules designed to streamline specific types of green clearances:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
                      <h4 className="font-semibold text-emerald-900 mb-2">Environment Clearance</h4>
                      <p className="text-sm text-emerald-800/80">Processing and monitoring of environmental impact assessments.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-100">
                      <h4 className="font-semibold text-stone-900 mb-2">Forest Clearance</h4>
                      <p className="text-sm text-stone-800/80">Evaluating proposals involving diversion of forest land for non-forestry purposes.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-teal-50/50 border border-teal-100">
                      <h4 className="font-semibold text-teal-900 mb-2">Wildlife Clearance</h4>
                      <p className="text-sm text-teal-800/80">Reviews applications affecting protected areas and wildlife habitats.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-cyan-50/50 border border-cyan-100">
                      <h4 className="font-semibold text-cyan-900 mb-2">CRZ Clearance</h4>
                      <p className="text-sm text-cyan-800/80">Management of Coastal Regulation Zone regulations and proposals.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
