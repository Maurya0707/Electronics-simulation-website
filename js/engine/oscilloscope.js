/**
 * Simulink X Studyhub - Real-Time Dual-Channel Digital Storage Oscilloscope (DSO) Engine
 * Developed by Aditya Maurya
 */

class VirtualOscilloscope {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Display Graticule Settings
    this.hDivisions = 10;
    this.vDivisions = 8;

    // Timebase (seconds per division)
    this.timePerDiv = 0.005; // 5ms/div default
    this.timeOffset = 0;

    // Channel 1 (Yellow Trace)
    this.ch1 = {
      enabled: true,
      voltsPerDiv: 2.0, // 2V/div
      yPosOffset: 0,    // divisions from center
      coupling: 'DC',   // 'DC', 'AC', 'GND'
      color: '#ffeb3b',
      glowColor: 'rgba(255, 235, 59, 0.45)',
      vpp: 0,
      vrms: 0,
      freq: 0,
      waveformFn: null // (t) => voltage
    };

    // Channel 2 (Cyan Trace)
    this.ch2 = {
      enabled: true,
      voltsPerDiv: 2.0,
      yPosOffset: 0,
      coupling: 'DC',
      color: '#00f2fe',
      glowColor: 'rgba(0, 242, 254, 0.45)',
      vpp: 0,
      vrms: 0,
      freq: 0,
      waveformFn: null
    };

    // Trigger
    this.trigger = {
      source: 'CH1',
      edge: 'rising',
      level: 0.0 // Volts
    };

    this.isRunning = true;
    this.elapsedTime = 0;
    this.lastFrameTime = performance.now();

    // High DPI Canvas Scaling
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.startRenderLoop();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 640) * dpr;
    this.canvas.height = (rect.height || 360) * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width || 640;
    this.height = rect.height || 360;
  }

  setCh1Waveform(fn) {
    this.ch1.waveformFn = fn;
  }

  setCh2Waveform(fn) {
    this.ch2.waveformFn = fn;
  }

  toggleRun() {
    this.isRunning = !this.isRunning;
    return this.isRunning;
  }

  startRenderLoop() {
    const loop = (now) => {
      const dt = (now - this.lastFrameTime) / 1000;
      this.lastFrameTime = now;

      if (this.isRunning) {
        this.elapsedTime += dt;
      }

      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Clear Screen (CRT Dark Slate Screen with slight phosphor gradient)
    ctx.fillStyle = '#060d13';
    ctx.fillRect(0, 0, w, h);

    // Subtle CRT Vignette / Tube Curve
    const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, w * 0.65);
    grad.addColorStop(0, 'rgba(10, 25, 35, 0.2)');
    grad.addColorStop(1, 'rgba(0, 5, 10, 0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw Oscilloscope Graticule
    this.drawGraticule(w, h);

    // Draw Channel Traces
    if (this.ch1.enabled && this.ch1.waveformFn) {
      this.drawTrace(this.ch1, w, h);
    }
    if (this.ch2.enabled && this.ch2.waveformFn) {
      this.drawTrace(this.ch2, w, h);
    }

    // Draw On-Screen Measurement Readout OSD
    this.drawOSD(w, h);
  }

  drawGraticule(w, h) {
    const ctx = this.ctx;
    const dx = w / this.hDivisions;
    const dy = h / this.vDivisions;

    ctx.save();
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';

    // Major grid lines
    ctx.beginPath();
    for (let x = 0; x <= w; x += dx) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += dy) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Center Crosshair axes with tick marks
    const cx = w / 2;
    const cy = h / 2;

    ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    // Center X
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    // Center Y
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    // Minor subdivision ticks on center axes (5 subdivisions per division)
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.beginPath();
    const tickLen = 4;
    for (let x = 0; x <= w; x += dx / 5) {
      ctx.moveTo(x, cy - tickLen);
      ctx.lineTo(x, cy + tickLen);
    }
    for (let y = 0; y <= h; y += dy / 5) {
      ctx.moveTo(cx - tickLen, y);
      ctx.lineTo(cx + tickLen, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  drawTrace(channel, w, h) {
    const ctx = this.ctx;
    const numPoints = Math.floor(w);
    const totalTime = this.timePerDiv * this.hDivisions;
    const dt = totalTime / numPoints;
    const centerY = h / 2;
    const pixelsPerDivY = h / this.vDivisions;
    const pixelsPerVolt = pixelsPerDivY / channel.voltsPerDiv;

    let minV = Infinity;
    let maxV = -Infinity;
    let sumSq = 0;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = channel.color;
    ctx.lineWidth = 2.0;
    ctx.shadowColor = channel.glowColor;
    ctx.shadowBlur = 8;
    ctx.lineJoin = 'round';

    const tStart = this.elapsedTime;

    for (let i = 0; i < numPoints; i++) {
      const x = i;
      const t = tStart + i * dt;
      let v = 0;

      if (channel.coupling === 'GND') {
        v = 0;
      } else {
        try {
          v = channel.waveformFn(t);
        } catch (e) {
          v = 0;
        }
      }

      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
      sumSq += v * v;

      // Invert Y because canvas Y increases downwards
      const y = centerY - (v * pixelsPerVolt) - (channel.yPosOffset * pixelsPerDivY);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.restore();

    // Update measurements
    if (numPoints > 0 && minV !== Infinity) {
      channel.vpp = Math.max(0, maxV - minV);
      channel.vrms = Math.sqrt(sumSq / numPoints);
    }
  }

  drawOSD(w, h) {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = '11px "JetBrains Mono", Consolas, monospace';

    // Top Status Bar: Timebase, Run/Stop
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(8, 8, w - 16, 22);

    ctx.fillStyle = this.isRunning ? '#10b981' : '#ef4444';
    ctx.fillText(this.isRunning ? '● RUN' : '❚❚ STOP', 16, 23);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`TIME: ${(this.timePerDiv * 1000).toFixed(1)} ms/div`, 80, 23);

    // Channel 1 Settings & Measurements (Bottom-Left)
    if (this.ch1.enabled) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(8, h - 42, 170, 34);

      ctx.fillStyle = this.ch1.color;
      ctx.fillText(`CH1: ${this.ch1.voltsPerDiv}V/div [${this.ch1.coupling}]`, 14, h - 26);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`Vpp: ${this.ch1.vpp.toFixed(2)}V  Vrms: ${this.ch1.vrms.toFixed(2)}V`, 14, h - 12);
    }

    // Channel 2 Settings & Measurements (Bottom-Right)
    if (this.ch2.enabled) {
      const boxW = 170;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(w - boxW - 8, h - 42, boxW, 34);

      ctx.fillStyle = this.ch2.color;
      ctx.fillText(`CH2: ${this.ch2.voltsPerDiv}V/div [${this.ch2.coupling}]`, w - boxW - 2, h - 26);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`Vpp: ${this.ch2.vpp.toFixed(2)}V  Vrms: ${this.ch2.vrms.toFixed(2)}V`, w - boxW - 2, h - 12);
    }

    ctx.restore();
  }
}
