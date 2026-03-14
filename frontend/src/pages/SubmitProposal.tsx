import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Send, FileText, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
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

const steps = ['Project Details', 'Location', 'Clearance Type', 'Documents', 'Payment', 'Review & Submit'];
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
  
  // New States
  const [createdApplicationId, setCreatedApplicationId] = useState<string | null>(null);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentGatewayStatus, setPaymentGatewayStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [currentPaymentData, setCurrentPaymentData] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  
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

  const handlePaymentInitiation = async () => {
    setIsProcessingPayment(true);
    setSubmitError('');
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) throw new Error('Please sign in again.');

      let appId = createdApplicationId;

      // 1. Create Application Draft if not already created
      if (!appId) {
        const clearanceLabel = selectedClearances[0];
        const clearanceType = clearanceTypeMap[clearanceLabel];
        
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

        appId = createResponse.application._id;
        setCreatedApplicationId(appId);

        // 2. Upload Documents concurrently
        const uploadTasks = [
          ...eiaFiles.map((file) => uploadDocument(file, 'EIA_REPORT', appId as string, token)),
          ...mapFiles.map((file) => uploadDocument(file, 'MAP', appId as string, token)),
          ...complianceFiles.map((file) => uploadDocument(file, 'COMPLIANCE_REPORT', appId as string, token)),
        ];
        await Promise.all(uploadTasks);
      }

      // 3. Create Payment
      const paymentAmount = 5000; // Mock fee amount
      const paymentResponse = await apiRequest<any>('/api/payments/create', {
        method: 'POST',
        token,
        body: JSON.stringify({
          applicationId: appId,
          amount: paymentAmount
        })
      });

      setCurrentPaymentData(paymentResponse);
      setShowPaymentModal(true);
      setPaymentGatewayStatus('IDLE');

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Payment initialization failed.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const completeMockPayment = async () => {
    if (!transactionId || transactionId.length < 5) {
      setSubmitError('Please enter a valid Transaction ID.');
      return;
    }

    setPaymentGatewayStatus('PROCESSING');
    
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      
      // Simulate real gateway processing time
      await new Promise(resolve => setTimeout(resolve, 2500));

      // 4. Verify Payment with Backend
      await apiRequest('/api/payments/verify', {
        method: 'POST',
        token,
        body: JSON.stringify({
          paymentId: currentPaymentData.payment._id,
          transactionId: transactionId
        })
      });

      setPaymentGatewayStatus('SUCCESS');
      
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentProcessed(true);
        setCurrentStep(5); // Move to Review & Submit
      }, 1500);

    } catch (error) {
      setPaymentGatewayStatus('FAILED');
      setTimeout(() => {
        setShowPaymentModal(false);
        setSubmitError(error instanceof Error ? error.message : 'Payment verification failed.');
      }, 2000);
    }
  };

  const handleSubmit = async () => {
    if (!createdApplicationId || !paymentProcessed) {
      setSubmitError('Application must be created and payment processed first.');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setSubmitError('Please sign in again to submit the application.');
        return;
      }

      await apiRequest(`/api/applications/${createdApplicationId}/submit`, {
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
          backgroundImage: 'url("https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80")',
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
                         <CreditCard size={24} />
                       </div>
                       <div>
                         <h3 className="text-2xl font-bold text-emerald-950">Application Fee</h3>
                         <p className="text-emerald-800/60 font-medium">Complete payment to proceed to final submission.</p>
                       </div>
                    </div>
                    
                    <div className="bg-white/60 rounded-2xl border border-emerald-100 p-8 text-center relative overflow-hidden">
                      <ShieldCheck className="absolute -bottom-10 -left-10 w-48 h-48 text-emerald-900/[0.03] rotate-12 pointer-events-none" />
                      <div className="relative z-10 space-y-6">
                        <div className="text-5xl font-black text-emerald-950 mb-2">₹5,000</div>
                        <p className="text-emerald-800/60 font-medium">Standard Application Processing Fee</p>
                        
                        <button
                          onClick={handlePaymentInitiation}
                          disabled={isProcessingPayment}
                          className={`w-full max-w-sm mx-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                            isProcessingPayment 
                              ? 'bg-emerald-400 text-white cursor-wait opacity-80' 
                              : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5'
                          }`}
                        >
                          {isProcessingPayment ? (
                            <><Loader2 className="animate-spin" size={24} /> Processing Secure Payment...</>
                          ) : (
                            <><CreditCard size={24} /> Pay Now via Secure Gateway</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
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
                            ['Payment Status', paymentProcessed ? 'Paid Successfully ✅' : 'Pending ❌'],
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
              disabled={currentStep === 0 || currentStep === 5 || isProcessingPayment || paymentProcessed} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                (currentStep === 0 || currentStep === 5 || isProcessingPayment || paymentProcessed)
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-md border border-emerald-200 hover:-translate-y-0.5'
              }`}
            >
              <ArrowLeft size={18} /> Back
            </button>
            
            {currentStep === 4 ? (
              <div className="ml-auto text-sm text-emerald-600/60 font-medium flex items-center gap-2">
                <ShieldCheck size={16} /> Secure checkout process
              </div>
            ) : currentStep < steps.length - 1 ? (
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

      {/* Mock Payment Gateway Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-100"
            >
              <div className="bg-sky-600 p-6 text-white text-center relative overflow-hidden">
                <ShieldCheck className="absolute -right-4 -top-4 w-24 h-24 text-white/10 rotate-12" />
                <h3 className="text-xl font-bold relative z-10">Scan & Pay</h3>
                <p className="text-sky-100/80 text-sm mt-1 relative z-10">Complete your transaction using UPI</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Amount to Pay</span>
                  <span className="text-2xl font-black text-sky-950">₹5,000</span>
                </div>

                <div className="flex justify-center p-4">
                  {/* Using the provided QR Code image */}
                  <img 
                    src="/qr-code.jpg" 
                    alt="Scan to Pay" 
                    className="w-64 h-64 object-contain rounded-xl shadow-sm border border-gray-100"
                  />
                </div>

                {paymentGatewayStatus === 'IDLE' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 text-center font-medium">
                      After a successful transaction, please enter your UPI Reference (UTR) ID below to verify the payment.
                    </p>
                    <input 
                      type="text" 
                      placeholder="e.g. 129384729182"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-mono"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                    <button
                      onClick={completeMockPayment}
                      disabled={transactionId.length < 5}
                      className="w-full py-4 bg-sky-600 text-white rounded-xl font-bold shadow-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Verify Transaction
                    </button>
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="w-full py-2 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {paymentGatewayStatus === 'PROCESSING' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-4 text-sky-600 font-bold gap-3">
                    <Loader2 size={32} className="animate-spin" />
                    <p>Verifying Transaction {transactionId}...</p>
                  </motion.div>
                )}

                {paymentGatewayStatus === 'SUCCESS' && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-4 text-emerald-500 font-bold gap-3">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Check size={32} strokeWidth={3} />
                    </div>
                    <p>Payment Verified Successfully!</p>
                  </motion.div>
                )}

                {paymentGatewayStatus === 'FAILED' && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-4 text-rose-500 font-bold gap-3">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">✕</span>
                    </div>
                    <p>Verification Failed. Invalid UTR.</p>
                    <button onClick={() => setPaymentGatewayStatus('IDLE')} className="text-sm underline mt-2 text-gray-500">Try Again</button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


