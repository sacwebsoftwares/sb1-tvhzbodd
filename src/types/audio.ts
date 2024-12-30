export interface AudioTrack {
  id: string;
  type: 'acapella' | 'full-track';
  audioUrl: string;
  duration: number;
  tempo?: number;
  key?: string;
  genre?: string;
}

export interface ProcessingStatus {
  stage: 'uploading' | 'analyzing' | 'processing' | 'complete';
  progress: number;
  message: string;
}