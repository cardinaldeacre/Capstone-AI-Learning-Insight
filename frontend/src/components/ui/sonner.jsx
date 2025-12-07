import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      position="top-center"
      theme={theme}
      className="toaster group"
      richColors
      closeButton
      toastOptions={{
        className:
          "bg-white/80 dark:bg-neutral-900/70 backdrop-blur-md border shadow-lg rounded-xl flex items-center gap-3 p-4 transition-all duration-300",
        style: {
          animation: "slideUp 0.35s ease, fadeIn 0.35s ease",
        },
      }}
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
        ),
        info: (
          <InfoIcon className="size-5 text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
        ),
        error: (
          <OctagonXIcon className="size-5 text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin text-sky-500" />
        ),
      }}
    />

  );
};

export { Toaster };
