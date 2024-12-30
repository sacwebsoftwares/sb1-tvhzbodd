// Genre detection using spectral analysis
export const detectGenre = (buffer: AudioBuffer): string => {
  const data = buffer.getChannelData(0);
  const fftSize = 2048;
  const context = new OfflineAudioContext(1, data.length, buffer.sampleRate);
  const analyser = context.createAnalyser();
  
  analyser.fftSize = fftSize;
  const frequencies = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(frequencies);
  
  // Calculate spectral features
  const spectralCentroid = calculateSpectralCentroid(frequencies);
  const spectralRolloff = calculateSpectralRolloff(frequencies);
  const zeroCrossingRate = calculateZeroCrossingRate(data);
  
  // Simple genre classification based on audio features
  if (zeroCrossingRate > 0.1 && spectralCentroid > 3000) {
    return 'Electronic';
  } else if (spectralRolloff > 0.85) {
    return 'Rock';
  } else if (zeroCrossingRate < 0.05) {
    return 'R&B';
  } else if (spectralCentroid < 2000) {
    return 'Hip Hop';
  }
  
  return 'Pop';
};

const calculateSpectralCentroid = (frequencies: Float32Array): number => {
  let numerator = 0;
  let denominator = 0;
  
  frequencies.forEach((magnitude, i) => {
    numerator += magnitude * i;
    denominator += magnitude;
  });
  
  return numerator / denominator;
};

const calculateSpectralRolloff = (frequencies: Float32Array): number => {
  const totalEnergy = frequencies.reduce((sum, val) => sum + Math.abs(val), 0);
  let currentEnergy = 0;
  
  for (let i = 0; i < frequencies.length; i++) {
    currentEnergy += Math.abs(frequencies[i]);
    if (currentEnergy >= totalEnergy * 0.85) {
      return i / frequencies.length;
    }
  }
  
  return 1;
};

const calculateZeroCrossingRate = (data: Float32Array): number => {
  let crossings = 0;
  
  for (let i = 1; i < data.length; i++) {
    if ((data[i] >= 0 && data[i - 1] < 0) || 
        (data[i] < 0 && data[i - 1] >= 0)) {
      crossings++;
    }
  }
  
  return crossings / data.length;
};