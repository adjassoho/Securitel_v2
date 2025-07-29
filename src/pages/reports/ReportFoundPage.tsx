import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { reportService } from '../../services/api';

const foundReportSchema = z.object({
  serialNumber: z.string().min(1, 'Le numéro de série est requis'),
  foundDate: z.string().min(1, 'La date de découverte est requise'),
  foundLocation: z.string().min(10, 'Veuillez décrire le lieu de découverte').max(500),
  reporterPhone: z.string().min(10, 'Le numéro de téléphone est requis'),
});

const ReportFoundPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(foundReportSchema),
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const onSubmit = async (data: z.infer<typeof foundReportSchema>) => {
    try {
      await reportService.reportFound({
        serial_number: data.serialNumber,
        found_date: data.foundDate,
        found_location: data.foundLocation,
        reporter_phone: data.reporterPhone,
      });
      setNotification({ type: 'success', message: 'Rapport envoyé avec succès !' });
      reset();
    } catch (error) {
      setNotification({ type: 'error', message: 'Erreur lors de l’envoi du rapport' });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900">Déclarer un appareil trouvé</h1>
{notification && (
        <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'}`}>{notification.message}</div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div className="form-control">
          <label className="label">Numéro de série</label>
          <input type="text" {...register('serialNumber')} className="input" placeholder="Ex: SN123456789" />
          {errors.serialNumber && <span className="text-error">{errors.serialNumber.message}</span>}
        </div>
        <div className="form-control">
          <label className="label">Date de découverte</label>
          <input type="date" {...register('foundDate')} className="input" max={new Date().toISOString().split('T')[0]} />
          {errors.foundDate && <span className="text-error">{errors.foundDate.message}</span>}
        </div>
        <div className="form-control">
          <label className="label">Lieu de découverte</label>
          <textarea {...register('foundLocation')} className="textarea" rows={3} placeholder="Décrivez où vous avez trouvé l'appareil..."></textarea>
          {errors.foundLocation && <span className="text-error">{errors.foundLocation.message}</span>}
        </div>
        <div className="form-control">
          <label className="label">Votre numéro de téléphone</label>
          <input type="tel" {...register('reporterPhone')} className="input" placeholder="Ex: 0612345678" />
          {errors.reporterPhone && <span className="text-error">{errors.reporterPhone.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Envoyer le rapport</button>
      </form>
    </div>
  );
};

export default ReportFoundPage;

























































































































