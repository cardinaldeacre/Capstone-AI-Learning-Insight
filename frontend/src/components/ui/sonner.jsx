import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon
} from 'lucide-react';
import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      position="top-center"
      theme="light" // <-- selalu light
      className="toaster group"
      richColors
      closeButton
      toastOptions={{
        className:
          'bg-white border shadow-lg rounded-xl flex items-center gap-3 p-4 transition-all duration-300 backdrop-blur-md',
        style: {
          animation: 'slideUp 0.35s ease, fadeIn 0.35s ease'
        }
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-600" />,
        info: <InfoIcon className="size-5 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-500" />,
        error: <OctagonXIcon className="size-5 text-red-500" />,
        loading: <Loader2Icon className="size-5 animate-spin text-sky-500" />
      }}
    />
  );
};

export { Toaster };
