// Tempo detection using onset detection and autocorrelation
export const detectTempo = (buffer: AudioBuffer): number => {
  const data = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  
  // Calculate energy over time windows
  const windowSize = Math.floor(sampleRate * 0.02); // 20ms windows
  const energies: number[] = [];
  
  for (let i = 0; i < data.length; i += windowSize) {
    let energy = 0;
    for (let j = 0; j < windowSize && i + j < data.length; j++) {
      energy += Math.abs(data[i + j]);
    }
    energies.push(energy);
  }
  
  // Find peaks (onsets)
  const peaks = findPeaks(energies);
  
  // Calculate intervals between peaks
  const intervals = calculateIntervals(peaks, sampleRate / windowSize);
  
  // Get most common interval (tempo)
  const tempo = 60 / (intervals[0] || 0.5);
  
  return Math.round(Math.max(60, Math.min(180, tempo))); // Clamp between 60-180 BPM
};

const findPeaks = (data: number[]): number[] => {
  const peaks: number[] = [];
  const threshold = Math.max(...data) * 0.5;
  
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > threshold && 
        data[i] > data[i - 1] && 
        data[i] > data[i + 1]) {
      peaks.push(i);
    }
  }
  
  return peaks;
};

const calculateIntervals = (peaks: number[], samplesPerSecond: number): number[] => {
  const intervals: number[] = [];
  
  for (let i = 1; i < peaks.length; i++) {
    intervals.push((peaks[i] - peaks[i - 1]) / samplesPerSecond);
  }
  
  return intervals.sort((a, b) => 
    intervals.filter(v => v === a).length - 
    intervals.filter(v => v === b).length
  );
};