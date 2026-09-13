import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64">
      <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mb-4" />
      <p className="text-[var(--text-muted)] font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;