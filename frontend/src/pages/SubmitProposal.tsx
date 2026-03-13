import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '@/components/forms/FileUploader';
import { indianStates, sectors } from '@/data/mockData';
import { API_BASE_URL, apiRequest } from '@/lib/api';

const step1Schema = z.object({
  projectName: z.string().min(3, 'Project name is required'),
  sector: z.string().min(1, 'Select a sector'),
  category: z.string().min(1, 'Select a category'),
  estimatedCost: z.string().min(1, 'Estimated cost is required'),
});

const step2Schema = z.object({
  state: z.string().min(1, 'Select a state'),
  district: z.string().min(2, 'District is required'),
  latitude: z.string().min(1, 'Latitude is required'),
  longitude: z.string().min(1, 'Longitude is required'),
});

const steps = ['Project Details', 'Location', 'Clearance Type', 'Documents', 'Review & Submit'];
const AUTH_TOKEN_KEY = 'parivesh_auth_token';

const clearanceTypeMap: Record<string, 'EC' | 'FC' | 'WL' | 'CRZ'> = {
  'Environmental Clearance': 'EC',
  'Forest Clearance': 'FC',
  'Wildlife Clearance': 'WL',
  'CRZ Clearance': 'CRZ',
};

interface CreateApplicationResponse {
  success: boolean;
  application: {
    _id: string;
  };
}

const uploadDocument = async (
  file: File,
  documentType: 'EIA_REPORT' | 'MAP' | 'COMPLIANCE_REPORT',
  applicationId: string,
  token: string
) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('applicationId', applicationId);
  formData.append('documentName', file.name);
  formData.append('documentType', documentType);

  const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || 'Document upload failed');
  }
};

export default function SubmitProposal() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedClearances, setSelectedClearances] = useState<string[]>([]);
  const [eiaFiles, setEiaFiles] = useState<File[]>([]);
  const [mapFiles, setMapFiles] = useState<File[]>([]);
  const [complianceFiles, setComplianceFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const step1Form = useForm({ resolver: zodResolver(step1Schema), defaultValues: formData });
  const step2Form = useForm({ resolver: zodResolver(step2Schema), defaultValues: formData });

  const nextStep = async () => {
    if (currentStep === 0) {
      const valid = await step1Form.trigger();
      if (!valid) return;
      setFormData(prev => ({ ...prev, ...step1Form.getValues() }));
    } else if (currentStep === 1) {
      const valid = await step2Form.trigger();
      if (!valid) return;
      setFormData(prev => ({ ...prev, ...step2Form.getValues() }));
    } else if (currentStep === 2 && selectedClearances.length === 0) {
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setSubmitError('');

    const clearanceLabel = selectedClearances[0];
    const clearanceType = clearanceTypeMap[clearanceLabel];

    if (!clearanceType) {
      setSubmitError('Select at least one valid clearance type.');
      return;
    }

    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setSubmitError('Please sign in again to submit the application.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        projectName: formData.projectName,
        sector: formData.sector,
        category: formData.category,
        clearanceType,
        state: formData.state,
        district: formData.district,
        coordinates: {
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        },
        projectCost: Number(formData.estimatedCost),
        projectDescription: `Selected clearances: ${selectedClearances.join(', ')}`,
      };

      const createResponse = await apiRequest<CreateApplicationResponse>('/api/applications', {
        method: 'POST',
        token,
        body: JSON.stringify(payload),
      });

      const applicationId = createResponse.application._id;

      const uploadTasks = [
        ...eiaFiles.map((file) => uploadDocument(file, 'EIA_REPORT', applicationId, token)),
        ...mapFiles.map((file) => uploadDocument(file, 'MAP', applicationId, token)),
        ...complianceFiles.map((file) => uploadDocument(file, 'COMPLIANCE_REPORT', applicationId, token)),
      ];

      await Promise.all(uploadTasks);

      await apiRequest(`/api/applications/${applicationId}/submit`, {
        method: 'POST',
        token,
      });

      navigate('/applicant/applications');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleClearance = (type: string) => {
    setSelectedClearances(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative bg-stone-50/50 flex flex-col font-sans -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-hidden items-center justify-center">
      
      {/* Background with Blend Mode */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.35] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80")', // Stunning lush green nature scene
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-stone-50/70 to-emerald-50/80 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent pointer-events-none z-0" />
      
      {/* Container */}
      <div className="w-full max-w-4xl relative z-10 w-full">
        
        {/* Dynamic Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-emerald-100 text-emerald-700 text-sm font-bold shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            New Application Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-emerald-950 tracking-tight leading-tight">
            Submit a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Proposal</span>
          </h1>
        </motion.div>

        {/* Progress Tracker (Glassmorphic) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6 relative px-4">
            {/* Background line for progress */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-emerald-900/10 rounded-full z-0" />
            
            {/* Active progress line */}
            <div 
              className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full z-0 transition-all duration-500 ease-out" 
              style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 2rem)` }}
            />

            {steps.map((step, i) => {
              const isActive = i === currentStep;
              const isCompleted = i < currentStep;
              return (
                <div key={i} className="flex flex-col items-center relative z-10">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      scale: isActive ? 1.2 : 1,
                      backgroundColor: isCompleted ? '#10b981' : isActive ? '#059669' : '#ffffff',
                      borderColor: isCompleted || isActive ? '#059669' : '#e5e7eb',
                      color: isCompleted || isActive ? '#ffffff' : '#9ca3af'
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 shadow-sm transition-colors duration-300`}
                  >
                    {isCompleted ? <Check size={18} strokeWidth={3} /> : i + 1}
                  </motion.div>
                  {/* Step Label (Hidden on small screens unless active) */}
                  <span className={`absolute -bottom-7 text-[10px] sm:text-xs font-bold whitespace-nowrap transition-colors duration-300 ${
                    isActive ? 'text-emerald-800' : isCompleted ? 'text-emerald-600/70 hidden sm:block' : 'text-emerald-900/40 hidden sm:block'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main Form Card (Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-emerald-900/10 border border-white/60 overflow-hidden"
        >
          <div className="p-8 sm:p-10 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-emerald-950 mb-6">Project Details</h3>
                    <div>
                      <label className="block text-sm font-bold text-emerald-900/70 mb-2">Project Name</label>
                      <input 
                        {...step1Form.register('projectName')} 
                        className="w-full bg-white/50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm placeholder:text-emerald-900/30 font-medium" 
                        placeholder="e.g. Highway Expansion NH-44" 
                      />
                      {step1Form.formState.errors.projectName && <p className="text-xs text-rose-500 font-medium mt-1.5 ml-1">{step1Form.formState.errors.projectName.message as string}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-emerald-900/70 mb-2">Sector</label>
                        <select 
                          {...step1Form.register('sector')} 
                          className="w-full bg-white/50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm font-medium"
                        >
                          <option value="">Select Sector</option>
                          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {step1Form.formState.errors.sector && <p className="text-xs text-rose-500 font-medium mt-1.5 ml-1">{step1Form.formState.errors.sector.message as string}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-emerald-900/70 mb-2">Category</label>
                        <select 
                          {...step1Form.register('category')} 
                          className="w-full bg-white/50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm font-medium"
                        >
                          <option value="">Select Category</option>
                          <option value="A">Category A</option>
                          <option value="B1">Category B1</option>
                          <option value="B2">Category B2</option>
                        </select>
                        {step1Form.formState.errors.category && <p className="text-xs text-rose-500 font-medium mt-1.5 ml-1">{step1Form.formState.errors.category.message as string}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-900/70 mb-2">Estimated Cost (₹ in Crores)</label>
                      <input 
                        {...step1Form.register('estimatedCost')} 
                        className="w-full bg-white/50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm placeholder:text-emerald-900/30 font-medium" 
                        placeholder="e.g. 1200" 
                      />
                      {step1Form.formState.errors.estimatedCost && <p className="text-xs text-rose-500 font-medium mt-1.5 ml-1">{step1Form.formState.errors.estimatedCost.message as string}</p>}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-emerald-950 mb-6">Location Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-emerald-900/70 mb-2">State</label>
                        <select 
                          {...step2Form.register('state')} 
                          className="w-full bg-white/50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm font-medium"
                        >
                          <option value="">Select State</option>
                          {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {step2Form.formState.errors.state && <p className="text-xs text-rose-500 font-medium mt-1.5 ml-1">{step2Form.formState.errors.state.message as string}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-emerald-900/70 mb-2">District</label>
                        <input 
                          {...step2Form.register('district')} 
                          className="w-full bg-white/50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm placeholder:text-emerald-900/30 font-medium" 
                          placeholder="e.g. Pune" 
                        />
                        {step2Form.formState.errors.district && <p className="text-xs text-rose-500 font-medium mt-1.5 ml-1">{step2Form.formState.errors.district.message as string}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-hidden rounded-xl border border-emerald-100 bg-white/50 p-6">
                      <div>
                         <label className="block text-sm font-bold text-emerald-900/70 mb-2">Latitude</label>
                        <input 
                          {...step2Form.register('latitude')} 
                          className="w-full bg-white/80 border border-emerald-100/50 rounded-xl px-4 py-3 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm placeholder:text-emerald-900/30 font-medium" 
                          placeholder="e.g. 18.5204" 
                        />
                        {step2Form.formState.errors.latitude && <p className="text-xs text-rose-500 font-medium mt-1.5 ml-1">{step2Form.formState.errors.latitude.message as string}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-emerald-900/70 mb-2">Longitude</label>
                        <input 
                          {...step2Form.register('longitude')} 
                          className="w-full bg-white/80 border border-emerald-100/50 rounded-xl px-4 py-3 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm placeholder:text-emerald-900/30 font-medium" 
                          placeholder="e.g. 73.8567" 
                        />
                        {step2Form.formState.errors.longitude && <p className="text-xs text-rose-500 font-medium mt-1.5 ml-1">{step2Form.formState.errors.longitude.message as string}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-emerald-950 mb-2">Clearance Requirements</h3>
                    <p className="text-emerald-800/60 font-medium mb-6">Select all regulatory clearances applicable to your project:</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Environmental Clearance', 'Forest Clearance', 'Wildlife Clearance', 'CRZ Clearance'].map(type => (
                        <label key={type} className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          selectedClearances.includes(type) 
                            ? 'border-emerald-500 bg-emerald-50/80 shadow-md shadow-emerald-500/10' 
                            : 'border-emerald-100 bg-white/50 hover:border-emerald-300 hover:bg-white/80'
                        }`}>
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                             selectedClearances.includes(type) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-emerald-200 bg-transparent'
                          }`}>
                            {selectedClearances.includes(type) && <Check size={14} strokeWidth={3} />}
                          </div>
                          
                          <input 
                            type="checkbox" 
                            checked={selectedClearances.includes(type)} 
                            onChange={() => toggleClearance(type)} 
                            className="hidden" 
                          />
                          <span className={`font-bold ${selectedClearances.includes(type) ? 'text-emerald-900' : 'text-emerald-950/70'}`}>{type}</span>
                        </label>
                      ))}
                    </div>
                    {selectedClearances.length === 0 && (
                      <motion.p initial={{opacity: 0}} animate={{opacity: 1}} className="text-sm text-rose-500 font-bold bg-rose-50 p-3 rounded-lg border border-rose-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Please select at least one clearance type to proceed.
                      </motion.p>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-emerald-950 mb-2">Upload Documents</h3>
                    <p className="text-emerald-800/60 font-medium mb-6">Provide the necessary documentation supporting your application.</p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-white/50 rounded-2xl border border-emerald-100">
                        <FileUploader label="EIA Report" accept=".pdf" onFilesChange={setEiaFiles} />
                      </div>
                      <div className="p-4 bg-white/50 rounded-2xl border border-emerald-100">
                        <FileUploader label="Project Map" accept=".pdf,.jpg,.png" onFilesChange={setMapFiles} />
                      </div>
                      <div className="p-4 bg-white/50 rounded-2xl border border-emerald-100">
                        <FileUploader label="Compliance Documents" onFilesChange={setComplianceFiles} />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
                         <FileText size={24} />
                       </div>
                       <div>
                         <h3 className="text-2xl font-bold text-emerald-950">Review Submission</h3>
                         <p className="text-emerald-800/60 font-medium">Verify your details before final submission.</p>
                       </div>
                    </div>
                    
                    <div className="bg-white/60 rounded-2xl border border-emerald-100 p-6 overflow-hidden relative">
                      {/* Decorative watermark */}
                      <Check className="absolute -bottom-10 -right-10 w-48 h-48 text-emerald-900/[0.03] rotate-12 pointer-events-none" />
                      
                      <div className="space-y-4 relative z-10">
                        {(() => {
                          const totalUploadedFiles = eiaFiles.length + mapFiles.length + complianceFiles.length;
                          const uploadedFilesSummary = totalUploadedFiles > 0
                            ? `${totalUploadedFiles} files (EIA: ${eiaFiles.length}, Map: ${mapFiles.length}, Compliance: ${complianceFiles.length})`
                            : '0 files';

                          return [
                            ['Project Name', formData.projectName],
                            ['Sector', formData.sector],
                            ['Category', formData.category],
                            ['Estimated Cost', `₹${formData.estimatedCost} Cr`],
                            ['State', formData.state],
                            ['District', formData.district],
                            ['Coordinates', `${formData.latitude}, ${formData.longitude}`],
                            ['Clearances', selectedClearances.join(', ')],
                            ['Uploaded Files', uploadedFilesSummary],
                          ];
                        })().map(([label, value]) => (
                          <div key={label} className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-emerald-100/50 last:border-0 gap-1">
                            <span className="text-sm font-bold text-emerald-900/60 w-1/3">{label}</span>
                            <span className="text-base font-bold text-emerald-950 sm:text-right w-full sm:w-2/3">{value || '—'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="bg-emerald-50/50 px-8 py-6 border-t border-emerald-100/60 flex items-center justify-between mt-auto">
            <button 
              onClick={prevStep} 
              disabled={currentStep === 0} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                currentStep === 0 
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-md border border-emerald-200 hover:-translate-y-0.5'
              }`}
            >
              <ArrowLeft size={18} /> Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button 
                onClick={nextStep} 
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all ml-auto"
              >
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ml-auto ${
                  isSubmitting 
                    ? 'bg-emerald-400 text-white cursor-wait opacity-80' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                   <>Processing...</>
                 ) : (
                   <>
                     Submit Application <Send size={18} />
                   </>
                 )}
              </button>
            )}
          </div>
        </motion.div>

        {submitError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-rose-50/90 backdrop-blur-sm border border-rose-200 text-rose-600 px-6 py-4 rounded-xl text-center font-semibold shadow-sm"
          >
            {submitError}
          </motion.div>
        )}
      </div>
    </div>
  );
}
