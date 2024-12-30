import React from 'react';
import { ProcessingStatus as Status } from '../types/audio';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  status: Status;
}

export function ProcessingStatus({ status }: ProcessingStatusProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{status.message}</span>
        <span className="text-sm text-gray-500">{status.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${status.progress}%` }}
        />
      </div>
      {status.stage !== 'complete' && (
        <Loader2 className="animate-spin mt-4 mx-auto text-blue-500" size={24} />
      )}
    </div>
  );
}