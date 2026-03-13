import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i < currentStep ? 'bg-accent text-accent-foreground' :
                i === currentStep ? 'bg-primary text-primary-foreground' :
                'bg-muted text-muted-foreground'
              }`}>
                {i < currentStep ? <Check size={14} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`hidden sm:block w-8 md:w-16 lg:w-24 h-0.5 mx-1 ${i < currentStep ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm font-medium text-primary">{steps[currentStep]}</p>
      </div>

      {/* Form Steps */}
      <div className="gov-card p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="gov-label">Project Name</label>
                  <input {...step1Form.register('projectName')} className="gov-input" placeholder="e.g. Highway Expansion NH-44" />
                  {step1Form.formState.errors.projectName && <p className="text-xs text-destructive mt-1">{step1Form.formState.errors.projectName.message as string}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="gov-label">Sector</label>
                    <select {...step1Form.register('sector')} className="gov-input">
                      <option value="">Select Sector</option>
                      {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {step1Form.formState.errors.sector && <p className="text-xs text-destructive mt-1">{step1Form.formState.errors.sector.message as string}</p>}
                  </div>
                  <div>
                    <label className="gov-label">Category</label>
                    <select {...step1Form.register('category')} className="gov-input">
                      <option value="">Select Category</option>
                      <option value="A">Category A</option>
                      <option value="B1">Category B1</option>
                      <option value="B2">Category B2</option>
                    </select>
                    {step1Form.formState.errors.category && <p className="text-xs text-destructive mt-1">{step1Form.formState.errors.category.message as string}</p>}
                  </div>
                </div>
                <div>
                  <label className="gov-label">Estimated Cost (₹ in Crores)</label>
                  <input {...step1Form.register('estimatedCost')} className="gov-input" placeholder="e.g. 1200" />
                  {step1Form.formState.errors.estimatedCost && <p className="text-xs text-destructive mt-1">{step1Form.formState.errors.estimatedCost.message as string}</p>}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="gov-label">State</label>
                    <select {...step2Form.register('state')} className="gov-input">
                      <option value="">Select State</option>
                      {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {step2Form.formState.errors.state && <p className="text-xs text-destructive mt-1">{step2Form.formState.errors.state.message as string}</p>}
                  </div>
                  <div>
                    <label className="gov-label">District</label>
                    <input {...step2Form.register('district')} className="gov-input" placeholder="e.g. Pune" />
                    {step2Form.formState.errors.district && <p className="text-xs text-destructive mt-1">{step2Form.formState.errors.district.message as string}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="gov-label">Latitude</label>
                    <input {...step2Form.register('latitude')} className="gov-input" placeholder="e.g. 18.5204" />
                    {step2Form.formState.errors.latitude && <p className="text-xs text-destructive mt-1">{step2Form.formState.errors.latitude.message as string}</p>}
                  </div>
                  <div>
                    <label className="gov-label">Longitude</label>
                    <input {...step2Form.register('longitude')} className="gov-input" placeholder="e.g. 73.8567" />
                    {step2Form.formState.errors.longitude && <p className="text-xs text-destructive mt-1">{step2Form.formState.errors.longitude.message as string}</p>}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">Select all applicable clearance types:</p>
                {['Environmental Clearance', 'Forest Clearance', 'Wildlife Clearance', 'CRZ Clearance'].map(type => (
                  <label key={type} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    selectedClearances.includes(type) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                  }`}>
                    <input type="checkbox" checked={selectedClearances.includes(type)} onChange={() => toggleClearance(type)} className="w-4 h-4 rounded accent-primary" />
                    <span className="text-sm font-medium">{type}</span>
                  </label>
                ))}
                {selectedClearances.length === 0 && <p className="text-xs text-destructive">Select at least one clearance type</p>}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <FileUploader label="EIA Report" accept=".pdf" onFilesChange={setEiaFiles} />
                <FileUploader label="Project Map" accept=".pdf,.jpg,.png" onFilesChange={setMapFiles} />
                <FileUploader label="Compliance Documents" onFilesChange={setComplianceFiles} />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Review Your Submission</h3>
                <div className="space-y-3">
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
                    <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <span className="text-sm font-medium text-right">{value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <button onClick={prevStep} disabled={currentStep === 0} className="gov-btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <ArrowLeft size={16} /> Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button onClick={nextStep} className="gov-btn-primary text-sm">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} className="gov-btn-primary text-sm bg-accent disabled:opacity-50 disabled:cursor-not-allowed">
              <Check size={16} /> Submit Proposal
            </button>
          )}
        </div>
        {submitError && <p className="text-xs text-destructive mt-3">{submitError}</p>}
      </div>
    </div>
  );
}
