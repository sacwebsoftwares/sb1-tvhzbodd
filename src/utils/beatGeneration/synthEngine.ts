// Basic synthesizer for drum sounds
export class DrumSynthesizer {
  private ctx: AudioContext;
  
  constructor() {
    this.ctx = new AudioContext();
  }

  async createKick(time: number, velocity: number = 1): Promise<AudioNode> {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    
    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    
    osc.connect(gain);
    osc.start(time);
    osc.stop(time + 0.5);
    
    return gain;
  }

  async createSnare(time: number, velocity: number = 1): Promise<AudioNode> {
    const noise = this.ctx.createBufferSource();
    const noiseGain = this.ctx.createGain();
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    
    // Create noise buffer
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = buffer;
    noiseGain.gain.setValueAtTime(velocity, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    
    osc.frequency.setValueAtTime(250, time);
    oscGain.gain.setValueAtTime(velocity * 0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    
    noise.connect(noiseGain);
    osc.connect(oscGain);
    noise.start(time);
    osc.start(time);
    osc.stop(time + 0.2);
    
    return noiseGain;
  }

  async createHihat(time: number, velocity: number = 1): Promise<AudioNode> {
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    
    noise.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    
    gain.gain.setValueAtTime(velocity * 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    
    noise.connect(filter);
    filter.connect(gain);
    noise.start(time);
    
    return gain;
  }

  getContext(): AudioContext {
    return this.ctx;
  }
}