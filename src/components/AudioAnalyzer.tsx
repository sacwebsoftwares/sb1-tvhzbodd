import React, { useEffect, useRef } from 'react';
import { Waves } from 'lucide-react';
import { detectTempo, detectKey, detectGenre } from '../utils/audioAnalysis';

interface AudioAnalyzerProps {
  audioUrl: string;
  onAnalysisComplete: (data: {
    tempo: number;
    key: string;
    genre: string;
  }) => void;
}

export function AudioAnalyzer({ audioUrl, onAnalysisComplete }: AudioAnalyzerProps) {
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const initializeAnalysis = async () => {
      try {
        audioContext.current = new AudioContext();
        analyser.current = audioContext.current.createAnalyser();
        
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);

        const tempo = detectTempo(audioBuffer);
        const key = detectKey(audioBuffer);
        const genre = detectGenre(audioBuffer);

        onAnalysisComplete({ tempo, key, genre });
      } catch (err) {
        console.error('Error analyzing audio:', err);
      }
    };

    initializeAnalysis();

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [audioUrl]);

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
      <Waves className="animate-pulse text-blue-500" size={24} />
      <span className="text-sm text-gray-600">Analyzing audio...</span>
    </div>
  );
}