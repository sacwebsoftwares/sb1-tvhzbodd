// Key detection using frequency analysis
export const detectKey = (buffer: AudioBuffer): string => {
  const data = buffer.getChannelData(0);
  const fftSize = 2048;
  const context = new OfflineAudioContext(1, data.length, buffer.sampleRate);
  const analyser = context.createAnalyser();
  
  analyser.fftSize = fftSize;
  const frequencies = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(frequencies);
  
  // Note frequencies (C4 to B4)
  const notes = [
    { note: 'C', freq: 261.63 },
    { note: 'C#', freq: 277.18 },
    { note: 'D', freq: 293.66 },
    { note: 'D#', freq: 311.13 },
    { note: 'E', freq: 329.63 },
    { note: 'F', freq: 349.23 },
    { note: 'F#', freq: 369.99 },
    { note: 'G', freq: 392.00 },
    { note: 'G#', freq: 415.30 },
    { note: 'A', freq: 440.00 },
    { note: 'A#', freq: 466.16 },
    { note: 'B', freq: 493.88 }
  ];
  
  // Find strongest frequencies
  const binSize = buffer.sampleRate / fftSize;
  const noteStrengths = notes.map(note => ({
    note: note.note,
    strength: getFrequencyStrength(frequencies, note.freq, binSize)
  }));
  
  // Return strongest note
  return noteStrengths.sort((a, b) => b.strength - a.strength)[0].note;
};

const getFrequencyStrength = (
  frequencies: Float32Array, 
  targetFreq: number, 
  binSize: number
): number => {
  const binIndex = Math.round(targetFreq / binSize);
  return frequencies[binIndex] || -Infinity;
};