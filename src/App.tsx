import React, { useState } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { AudioAnalyzer } from './components/AudioAnalyzer';
import { ProcessingStatus } from './components/ProcessingStatus';
import { Music, Upload, Mic, Wand2 } from 'lucide-react';
import type { AudioTrack, ProcessingStatus as Status } from './types/audio';

function App() {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [status, setStatus] = useState<Status>({
    stage: 'uploading',
    progress: 0,
    message: 'Ready to start'
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentTrack({
        id: Math.random().toString(36).substr(2, 9),
        type: 'full-track',
        audioUrl: url,
        duration: 0
      });
      setStatus({
        stage: 'analyzing',
        progress: 0,
        message: 'Analyzing audio...'
      });
    }
  };

  const handleRecordingComplete = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setCurrentTrack({
      id: Math.random().toString(36).substr(2, 9),
      type: 'acapella',
      audioUrl: url,
      duration: 0
    });
    setStatus({
      stage: 'analyzing',
      progress: 0,
      message: 'Analyzing recording...'
    });
  };

  const handleAnalysisComplete = (data: { tempo: number; key: string; genre: string }) => {
    if (currentTrack) {
      setCurrentTrack({
        ...currentTrack,
        ...data
      });
      setStatus({
        stage: 'complete',
        progress: 100,
        message: 'Analysis complete'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music size={32} className="text-blue-400" />
            <h1 className="text-3xl font-bold">SongCraft AI</h1>
          </div>
          <p className="text-gray-400">Transform your music with AI-powered analysis and generation</p>
        </header>

        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-6 shadow-xl">
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Input Your Music</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-400 transition-colors">
                  <Upload size={24} />
                  <label className="cursor-pointer text-center">
                    <span className="block text-sm text-gray-400 mb-2">Upload Audio File</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="inline-block px-4 py-2 bg-blue-500 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                      Choose File
                    </span>
                  </label>
                </div>

                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-600 rounded-lg">
                  <Mic size={24} />
                  <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                </div>
              </div>
            </div>

            {currentTrack && (
              <div className="space-y-4">
                <ProcessingStatus status={status} />
                
                {status.stage === 'analyzing' && (
                  <AudioAnalyzer
                    audioUrl={currentTrack.audioUrl}
                    onAnalysisComplete={handleAnalysisComplete}
                  />
                )}

                {status.stage === 'complete' && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Analysis Results</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="block text-gray-400">Tempo</span>
                        <span className="font-medium">{currentTrack.tempo} BPM</span>
                      </div>
                      <div>
                        <span className="block text-gray-400">Key</span>
                        <span className="font-medium">{currentTrack.key}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400">Genre</span>
                        <span className="font-medium">{currentTrack.genre}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;