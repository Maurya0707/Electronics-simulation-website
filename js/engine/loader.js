/**
 * SIMULINK X STUDYHUB - JSON ANIMATED PRELOADER ENGINE
 * Loads circuit-loader.json and drives high-fps vector & canvas animations
 * Developed by Aditya Maurya
 */

(function () {
  'use strict';

  class CircuitPreloader {
    constructor() {
      this.preloaderEl = document.getElementById('app-preloader');
      this.canvas = document.getElementById('preloader-circuit-canvas');
      this.barFill = document.getElementById('preloader-bar-fill');
      this.statusText = document.getElementById('preloader-status-text');
      this.percentText = document.getElementById('preloader-percent-text');
      this.skipBtn = document.getElementById('preloader-skip-btn');
      this.lottieContainer = document.getElementById('preloader-lottie-container');

      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.animationFrameId = null;
      this.isExiting = false;

      this.jsonData = null;
      this.currentProgress = 0;
      this.targetProgress = 0;
      this.startTime = performance.now();
      this.duration = 1900; // ~1.9 seconds sequence

      this.particles = [];
      this.vias = [];
      this.traces = [];
      this.loadingSteps = [];

      this.init();
    }

    async init() {
      if (!this.preloaderEl) return;

      this.setupCanvasResize();
      this.setupSkipButton();

      try {
        const response = await fetch('assets/animations/circuit-loader.json');
        if (response.ok) {
          this.jsonData = await response.json();
          this.parseJsonData(this.jsonData);
          this.initLottieIfAvailable(this.jsonData);
        } else {
          this.loadFallbackConfig();
        }
      } catch (err) {
        console.warn('Circuit loader JSON fetch note:', err.message);
        this.loadFallbackConfig();
      }

      this.initParticles();
      this.startCanvasAnimation();
      this.runProgressTimeline();
    }

    parseJsonData(data) {
      if (data && data.meta) {
        this.duration = data.meta.durationMs || 1900;
        this.loadingSteps = data.meta.loadingSteps || [];
        this.rawTraces = data.meta.circuitTraces || [];
        this.rawVias = data.meta.vias || [];
        this.electronConfig = data.meta.electrons || { count: 24, speed: 1.8, colors: ['#00f2fe', '#38bdf8', '#818cf8'] };
      } else {
        this.loadFallbackConfig();
      }
    }

    loadFallbackConfig() {
      this.duration = 1900;
      this.loadingSteps = [
        { progress: 15, status: 'Powering Virtual Laboratory Bus [VCC = +15V, VEE = -15V]...' },
        { progress: 38, status: 'Initializing SPICE Circuit Matrices & Semiconductor Physics...' },
        { progress: 65, status: 'Calibrating Dual-Trace Oscilloscope Timebase & Volts/Div...' },
        { progress: 85, status: 'Synchronizing True-RMS Digital Multimeter Converters...' },
        { progress: 100, status: 'Simulink X Studyhub Online • Launching Workbench' }
      ];
      this.rawTraces = [
        { from: [-140, -110], to: [0, -110], color: '#00f2fe' },
        { from: [0, -110], to: [140, -110], color: '#38bdf8' },
        { from: [140, -110], to: [180, -60], color: '#9333ea' },
        { from: [-180, 70], to: [-120, 120], color: '#9333ea' },
        { from: [-120, 120], to: [140, 120], color: '#00a6ff' }
      ];
      this.rawVias = [
        { x: -140, y: -110, r: 5, color: '#00f2fe' },
        { x: 140, y: -110, r: 5, color: '#38bdf8' },
        { x: 180, y: -60, r: 6, color: '#9333ea' },
        { x: -180, y: 70, r: 6, color: '#9333ea' },
        { x: 140, y: 120, r: 5, color: '#00f2fe' }
      ];
      this.electronConfig = { count: 22, speed: 1.8, colors: ['#00f2fe', '#38bdf8', '#c084fc'] };
    }

    initLottieIfAvailable(data) {
      if ((window.lottie || window.bodymovin) && this.lottieContainer) {
        try {
          const lottieEngine = window.lottie || window.bodymovin;
          lottieEngine.loadAnimation({
            container: this.lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: data
          });
        } catch (e) {
          console.debug('Lottie fallback to canvas:', e.message);
        }
      }
    }

    setupCanvasResize() {
      if (!this.canvas) return;
      const resize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      resize();
    }

    initParticles() {
      const colors = this.electronConfig?.colors || ['#00f2fe', '#38bdf8', '#c084fc'];
      const count = this.electronConfig?.count || 24;

      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          angle: Math.random() * Math.PI * 2,
          radius: 90 + Math.random() * 130,
          speed: (0.015 + Math.random() * 0.02) * (Math.random() > 0.5 ? 1 : -1),
          size: 1.5 + Math.random() * 2.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.3 + Math.random() * 0.7,
          pulse: Math.random() * Math.PI
        });
      }
    }

    startCanvasAnimation() {
      if (!this.ctx) return;

      const render = (time) => {
        if (this.isExiting) return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2 - 40; // centered on the logo chamber

        this.ctx.clearRect(0, 0, w, h);

        // 1. Draw Geometric Circuit Tracks around the central logo
        this.drawCircuitNetwork(cx, cy, time);

        // 2. Draw Orbiting Electron Energy Packets
        this.drawElectrons(cx, cy, time);

        // 3. Draw Live Center Oscilloscope Sine Pulse Wave
        this.drawOscilloscopeWave(cx, cy, time);

        this.animationFrameId = requestAnimationFrame(render);
      };

      this.animationFrameId = requestAnimationFrame(render);
    }

    drawCircuitNetwork(cx, cy, time) {
      const ctx = this.ctx;

      // Concentric subtle PCB rings
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.12)';
      ctx.setLineDash([8, 14]);

      ctx.beginPath();
      ctx.arc(cx, cy, 85, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 125, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Angular circuit track traces extending outward
      const tracks = [
        { startR: 70, endR: 160, angle: -Math.PI / 4, color: '#00f2fe' },
        { startR: 70, endR: 180, angle: Math.PI / 4, color: '#38bdf8' },
        { startR: 70, endR: 170, angle: (3 * Math.PI) / 4, color: '#9333ea' },
        { startR: 70, endR: 190, angle: (-3 * Math.PI) / 4, color: '#00a6ff' },
        { startR: 70, endR: 140, angle: 0, color: '#00f2fe' },
        { startR: 70, endR: 150, angle: Math.PI, color: '#9333ea' }
      ];

      tracks.forEach(tr => {
        const x1 = cx + Math.cos(tr.angle) * tr.startR;
        const y1 = cy + Math.sin(tr.angle) * tr.startR;
        const x2 = cx + Math.cos(tr.angle) * tr.endR;
        const y2 = cy + Math.sin(tr.angle) * tr.endR;

        // Trace line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Elbow dogleg
        const doglegX = x2 + (Math.cos(tr.angle) > 0 ? 35 : -35);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(doglegX, y2);
        ctx.stroke();

        // Terminal Via Pad
        const pulse = (Math.sin(time * 0.005 + tr.startR) + 1) * 0.5;
        ctx.fillStyle = tr.color;
        ctx.shadowColor = tr.color;
        ctx.shadowBlur = 8 * pulse + 4;
        ctx.beginPath();
        ctx.arc(doglegX, y2, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Concentric via ring
        ctx.strokeStyle = tr.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(doglegX, y2, 6.5 + pulse * 2, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.restore();
    }

    drawElectrons(cx, cy, time) {
      const ctx = this.ctx;
      ctx.save();

      this.particles.forEach(p => {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        const glow = Math.sin(time * 0.006 + p.pulse) * 0.3 + 0.7;

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = p.alpha * glow;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtly trailing tail
        const tailX = cx + Math.cos(p.angle - p.speed * 3) * p.radius;
        const tailY = cy + Math.sin(p.angle - p.speed * 3) * p.radius;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * 0.6;
        ctx.globalAlpha = p.alpha * 0.3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      });

      ctx.restore();
    }

    drawOscilloscopeWave(cx, cy, time) {
      const ctx = this.ctx;
      ctx.save();

      const waveWidth = 140;
      const startX = cx - waveWidth / 2;
      const waveY = cy + 65; // just beneath the logo chamber

      ctx.strokeStyle = '#00f2fe';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const t = time * 0.007;
      for (let x = 0; x <= waveWidth; x += 3) {
        const norm = x / waveWidth;
        const envelope = Math.sin(norm * Math.PI); // taper ends
        const y = waveY + Math.sin(norm * 14 + t) * (10 * envelope);

        if (x === 0) ctx.moveTo(startX + x, y);
        else ctx.lineTo(startX + x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    runProgressTimeline() {
      const stepInterval = this.duration / 100;
      let stepIndex = 0;

      const timer = setInterval(() => {
        if (this.isExiting) {
          clearInterval(timer);
          return;
        }

        this.currentProgress += 1;
        if (this.currentProgress > 100) this.currentProgress = 100;

        // Update UI
        if (this.barFill) {
          this.barFill.style.width = `${this.currentProgress}%`;
        }
        if (this.percentText) {
          this.percentText.textContent = `${this.currentProgress}%`;
        }

        // Check for step milestone text
        if (this.loadingSteps.length > 0) {
          const matchedStep = [...this.loadingSteps]
            .reverse()
            .find(s => this.currentProgress >= s.progress);

          if (matchedStep && this.statusText && this.statusText.textContent !== matchedStep.status) {
            this.statusText.textContent = matchedStep.status;
          }
        }

        if (this.currentProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => this.finish(), 220);
        }
      }, stepInterval);
    }

    setupSkipButton() {
      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.finish();
        });
      }
    }

    finish() {
      if (this.isExiting) return;
      this.isExiting = true;

      if (this.barFill) this.barFill.style.width = '100%';
      if (this.percentText) this.percentText.textContent = '100%';
      if (this.statusText) this.statusText.textContent = 'Simulink X Studyhub Online • Launching Workbench';

      if (this.preloaderEl) {
        this.preloaderEl.classList.add('preloader-exit');

        setTimeout(() => {
          if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
          }
          this.preloaderEl.style.display = 'none';

          // Notify master app that simulation is active
          window.dispatchEvent(new CustomEvent('simulink:ready'));
        }, 650);
      }
    }
  }

  // Self initialize on DOMContentLoaded or immediately if DOM is already parsed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.simulinkPreloader = new CircuitPreloader();
    });
  } else {
    window.simulinkPreloader = new CircuitPreloader();
  }
})();
