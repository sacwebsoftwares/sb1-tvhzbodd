export interface Beat {
  id: string;
  type: 'kick' | 'snare' | 'hihat' | 'percussion';
  timing: number; // Position in beats (0-15 for a 4-bar pattern)
  velocity: number; // 0-1 for volume
  pitch?: number; // Frequency modifier
}

export interface BeatPattern {
  id: string;
  tempo: number;
  beats: Beat[];
  key: string;
  genre: string;
}