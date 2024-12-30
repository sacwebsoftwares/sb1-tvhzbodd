import React from 'react';
import { BeatControls } from './BeatControls';

interface AudioAnalysisResultsProps {
  tempo: number;
  key: string;
  genre: string;
}

export function AudioAnalysisResults({ tempo, key, genre }: AudioAnalysisResultsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Analysis Results</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="block text-gray-400">Tempo</span>
            <span className="font-medium">{tempo} BPM</span>
          </div>
          <div>
            <span className="block text-gray-400">Key</span>
            <span className="font-medium">{key}</span>
          </div>
          <div>
            <span className="block text-gray-400">Genre</span>
            <span className="font-medium">{genre}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Beat Generation</h3>
        <BeatControls genre={genre} tempo={tempo} />
      </div>
    </div>
  );
}