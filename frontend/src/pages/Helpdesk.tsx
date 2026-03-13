import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const helpdeskSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email is required').max(255),
  category: z.string().min(1, 'Select a category'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

type HelpdeskForm = z.infer<typeof helpdeskSchema>;

export default function Helpdesk() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<HelpdeskForm>({
    resolver: zodResolver(helpdeskSchema),
  });

  const onSubmit = (data: HelpdeskForm) => {
    console.log('Helpdesk:', data);
    setSubmitted(true);
  };

  return (
    <div className="gov-section">
      <div className="gov-container">
        <div className="mb-10 max-w-2xl">
          <h1 className="gov-heading">Helpdesk Support</h1>
          <p className="text-muted-foreground">Need assistance? Contact our support team or submit a query below.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: Phone, label: 'Toll Free', value: '1800-XXX-XXXX' },
              { icon: Mail, label: 'Email', value: 'support@parivesh.nic.in' },
              { icon: MapPin, label: 'Address', value: 'MoEFCC, Indira Paryavaran Bhawan, Jor Bagh Road, New Delhi - 110003' },
            ].map((item, i) => (
              <div key={i} className="gov-card p-5 flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <div className="gov-card p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                    <Send size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Query Submitted</h3>
                  <p className="text-sm text-muted-foreground">We'll get back to you within 2 working days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="gov-label">Name</label>
                      <input {...register('name')} className="gov-input" placeholder="Your full name" />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="gov-label">Email</label>
                      <input {...register('email')} type="email" className="gov-input" placeholder="your@email.com" />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="gov-label">Issue Category</label>
                    <select {...register('category')} className="gov-input">
                      <option value="">Select Category</option>
                      <option value="login">Login / Registration</option>
                      <option value="proposal">Proposal Submission</option>
                      <option value="clearance">Clearance Status</option>
                      <option value="documents">Document Upload</option>
                      <option value="technical">Technical Issue</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
                  </div>
                  <div>
                    <label className="gov-label">Message</label>
                    <textarea {...register('message')} className="gov-input min-h-[120px] resize-none" placeholder="Describe your issue in detail..." />
                    {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="gov-btn-primary">
                    <Send size={16} /> Submit Query
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
