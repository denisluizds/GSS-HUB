import { toast } from 'sonner';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export function useToast() {
  const toastWrapper = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    if (variant === 'destructive') {
      toast.error(title, { description });
    } else {
      toast.success(title, { description });
    }
  };

  return { toast: toastWrapper };
}
