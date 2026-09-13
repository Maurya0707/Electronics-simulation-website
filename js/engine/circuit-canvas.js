/**
 * Simulink X Studyhub - Interactive Circuit Schematic & Animated Current Engine
 * Developed by Aditya Maurya
 */

class CircuitCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.currentSpeed = 0; // Electron flow particle speed
    this.particleOffset = 0;
    this.activeExpId = 'ohms-law';
    this.state = {}; // Component values, voltages, currents

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.startAnimationLoop();
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

  setExperiment(expId, state = {}) {
    this.activeExpId = expId;
    this.state = { ...state };
    this.updateCurrentSpeed();
  }

  updateState(state) {
    this.state = { ...this.state, ...state };
    this.updateCurrentSpeed();
  }

  updateCurrentSpeed() {
    // Current in mA or A determines particle velocity
    const current = Math.abs(this.state.current_mA || (this.state.current_A ? this.state.current_A * 1000 : 0));
    if (this.state.powerOn === false || current < 0.001) {
      this.currentSpeed = 0;
    } else {
      this.currentSpeed = Math.min(6, 0.4 + Math.log10(Math.max(1, current)) * 1.5);
    }
  }

  startAnimationLoop() {
    const loop = () => {
      if (this.currentSpeed > 0) {
        this.particleOffset = (this.particleOffset + this.currentSpeed) % 40;
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

    // Dark PCB Canvas Background
    ctx.fillStyle = '#0b1320';
    ctx.fillRect(0, 0, w, h);

    // Subtle PCB Grid Pattern
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Render Circuit specific to active experiment
    switch (this.activeExpId) {
      case 'ohms-law':
        this.drawOhmsLawCircuit(w, h);
        break;
      case 'diode-char':
        this.drawDiodeCircuit(w, h);
        break;
      case 'rectifier':
        this.drawRectifierCircuit(w, h);
        break;
      case 'transistor-ce':
        this.drawTransistorCircuit(w, h);
        break;
      case 'rc-filter':
        this.drawRCFilterCircuit(w, h);
        break;
      case 'opamp':
        this.drawOpAmpCircuit(w, h);
        break;
      case 'logic-gates':
        this.drawLogicGateCircuit(w, h);
        break;
      case 'timer-555':
        this.draw555TimerCircuit(w, h);
        break;
      default:
        this.drawOhmsLawCircuit(w, h);
    }
  }

  /* -------------------------------------------------------------
     CIRCUIT SCHEMATICS WITH ANIMATED PARTICLES & LIVE METERS
  ------------------------------------------------------------- */

  // Draw wire with flowing electron dots
  drawAnimatedWire(pathPoints, reverse = false) {
    const ctx = this.ctx;
    ctx.save();

    // Base Wire
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    pathPoints.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Wire Core
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Moving Particles (Current flow)
    if (this.currentSpeed > 0 && pathPoints.length > 1) {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 6;

      // Calculate total length and interpolate
      let totalLen = 0;
      const segments = [];
      for (let i = 0; i < pathPoints.length - 1; i++) {
        const p1 = pathPoints[i];
        const p2 = pathPoints[i + 1];
        const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        segments.push({ p1, p2, len, start: totalLen });
        totalLen += len;
      }

      const spacing = 28;
      const offset = reverse ? (totalLen - this.particleOffset) : this.particleOffset;

      for (let d = (offset % spacing); d < totalLen; d += spacing) {
        // Find segment
        const seg = segments.find(s => d >= s.start && d <= s.start + s.len);
        if (seg) {
          const t = (d - seg.start) / seg.len;
          const px = seg.p1.x + (seg.p2.x - seg.p1.x) * t;
          const py = seg.p1.y + (seg.p2.y - seg.p1.y) * t;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  // Draw DC Power Supply Symbol
  drawDCSupply(x, y, label, voltage) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.fillRect(x - 25, y - 30, 50, 60);
    ctx.strokeRect(x - 25, y - 30, 50, 60);

    // Battery plates
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 10);
    ctx.lineTo(x + 12, y - 10);
    ctx.moveTo(x - 6, y + 10);
    ctx.lineTo(x + 6, y + 10);
    ctx.stroke();

    // Plus / Minus
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('+', x + 16, y - 8);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('−', x + 16, y + 14);

    // Label & Voltage
    ctx.textAlign = 'center';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(label, x, y - 36);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`${voltage}V`, x, y + 44);

    ctx.restore();
  }

  // Draw Resistor Symbol with Color Bands
  drawResistor(x, y, label, valueText, isVertical = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    if (isVertical) ctx.rotate(Math.PI / 2);

    // Zig-Zag or IEC Box
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.fillRect(-24, -9, 48, 18);
    ctx.strokeRect(-24, -9, 48, 18);

    // Color bands (realistic 4-band look)
    const bands = ['#b91c1c', '#000000', '#ea580c', '#eab308'];
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(-16 + i * 9, -9, 4, 18);
    });

    // Label
    ctx.textAlign = 'center';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(label, 0, -15);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(valueText, 0, 24);

    ctx.restore();
  }

  // Draw Digital Meter (Voltmeter or Ammeter)
  drawMeter(x, y, type, valueStr, unitStr) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = type === 'A' ? '#10b981' : '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(type, x, y - 4);

    // Mini LCD reading below meter
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = type === 'A' ? '#34d399' : '#60a5fa';
    ctx.fillText(`${valueStr} ${unitStr}`, x, y + 14);

    ctx.restore();
  }

  // Draw Switch
  drawSwitch(x, y, isOpen) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(x - 15, y, 3, 0, Math.PI * 2);
    ctx.arc(x + 15, y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isOpen ? '#ef4444' : '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 15, y);
    if (isOpen) {
      ctx.lineTo(x + 10, y - 18);
    } else {
      ctx.lineTo(x + 15, y);
    }
    ctx.stroke();

    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = isOpen ? '#ef4444' : '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText(isOpen ? 'OPEN' : 'CLOSED', x, y + 16);
    ctx.restore();
  }

  /* -------------------------------------------------------------
     EXPERIMENT SCHEMATIC IMPLEMENTATIONS
  ------------------------------------------------------------- */

  // 1. Ohm's Law Circuit
  drawOhmsLawCircuit(w, h) {
    const vSupply = this.state.voltage || 5.0;
    const current_mA = this.state.current_mA || (vSupply / 100 * 1000);
    const rVal = this.state.nominalR || 100;
    const isOpen = this.state.powerOn === false;

    const left = 80;
    const right = w - 80;
    const top = 70;
    const bottom = h - 70;
    const midX = (left + right) / 2;

    // Main circuit loop
    this.drawAnimatedWire([
      { x: left, y: (top + bottom) / 2 - 30 },
      { x: left, y: top },
      { x: left + 90, y: top }
    ]);

    this.drawAnimatedWire([
      { x: left + 130, y: top },
      { x: midX - 30, y: top }
    ]);

    this.drawAnimatedWire([
      { x: midX + 30, y: top },
      { x: right, y: top },
      { x: right, y: bottom },
      { x: left, y: bottom },
      { x: left, y: (top + bottom) / 2 + 30 }
    ]);

    // Voltmeter Parallel branch
    this.drawAnimatedWire([
      { x: right - 35, y: top },
      { x: right - 35, y: top + 60 },
      { x: right + 35, y: top + 60 },
      { x: right + 35, y: bottom },
      { x: right, y: bottom }
    ]);

    // Components
    this.drawDCSupply(left, (top + bottom) / 2, 'DC Supply', vSupply);
    this.drawSwitch(left + 110, top, isOpen);
    this.drawMeter(midX, top, 'A', isOpen ? '0.00' : current_mA.toFixed(1), 'mA');
    this.drawResistor(right, (top + bottom) / 2, 'Load Resistor (R)', `${rVal} Ω`, true);
    this.drawMeter(right + 35, (top + bottom) / 2, 'V', isOpen ? '0.00' : vSupply.toFixed(2), 'V');
  }

  // 2. Diode Characteristics Circuit
  drawDiodeCircuit(w, h) {
    const vSupply = this.state.vSupply || 1.0;
    const vDiode = this.state.vDiode || 0.65;
    const current_mA = this.state.current_mA || 0.35;
    const diodeType = this.state.diodeType || 'silicon';
    const isReverse = this.state.isReverse || false;

    const left = 90;
    const right = w - 90;
    const top = 75;
    const bottom = h - 75;
    const midX = (left + right) / 2;

    this.drawAnimatedWire([
      { x: left, y: (top + bottom) / 2 - 30 },
      { x: left, y: top },
      { x: midX - 35, y: top }
    ]);

    this.drawAnimatedWire([
      { x: midX + 35, y: top },
      { x: right, y: top },
      { x: right, y: (top + bottom) / 2 - 25 }
    ]);

    this.drawAnimatedWire([
      { x: right, y: (top + bottom) / 2 + 25 },
      { x: right, y: bottom },
      { x: left, y: bottom },
      { x: left, y: (top + bottom) / 2 + 30 }
    ], isReverse);

    // DC Supply
    this.drawDCSupply(left, (top + bottom) / 2, 'DC Source', vSupply);
    // Series Resistor 1kΩ
    this.drawResistor(midX, top, 'R_series', '1 kΩ');

    // Draw Diode Symbol at (right, center)
    this.drawDiodeSymbol(right, (top + bottom) / 2, diodeType, isReverse);

    // Parallel Voltmeter across diode
    this.drawAnimatedWire([
      { x: right - 40, y: (top + bottom) / 2 - 25 },
      { x: right - 40, y: (top + bottom) / 2 + 25 }
    ]);
    this.drawMeter(right - 40, (top + bottom) / 2, 'V', Math.abs(vDiode).toFixed(2), 'V');

    // Milliammeter / Microammeter on bottom rail
    const unit = isReverse ? 'µA' : 'mA';
    const val = isReverse ? (this.state.current_uA || 0.05).toFixed(2) : current_mA.toFixed(2);
    this.drawMeter(midX, bottom, 'A', val, unit);
  }

  drawDiodeSymbol(x, y, diodeType, isReverse) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    if (isReverse) ctx.rotate(Math.PI);

    // Diode Triangle
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-15, -16);
    ctx.lineTo(15, -16);
    ctx.lineTo(0, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cathode Bar
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-15, 12);
    ctx.lineTo(15, 12);
    if (diodeType === 'zener') {
      // Zener wings
      ctx.moveTo(-15, 12);
      ctx.lineTo(-15, 18);
      ctx.moveTo(15, 12);
      ctx.lineTo(15, 6);
    }
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(diodeType.toUpperCase(), 20, 4);

    ctx.restore();
  }

  // 3. Rectifier Circuit (Full-Wave Bridge & Half-Wave)
  drawRectifierCircuit(w, h) {
    const type = this.state.type || 'full-wave';
    const filterOn = this.state.filterEnabled;
    const vRMS = this.state.vRMS || 12;

    const left = 90;
    const midX = w * 0.42;
    const right = w - 90;
    const top = 80;
    const bottom = h - 80;

    // AC Source / Transformer Secondary
    this.drawACSupply(left, (top + bottom) / 2, `${vRMS}V AC, 50Hz`);

    if (type === 'full-wave') {
      // Bridge Rectifier Diamond
      this.drawAnimatedWire([
        { x: left + 25, y: (top + bottom) / 2 - 15 },
        { x: midX - 35, y: top + 40 }
      ]);
      this.drawAnimatedWire([
        { x: left + 25, y: (top + bottom) / 2 + 15 },
        { x: midX - 35, y: bottom - 40 }
      ]);

      this.drawBridgeRectifier(midX, (top + bottom) / 2);

      // Output wires to load
      this.drawAnimatedWire([
        { x: midX + 35, y: top + 20 },
        { x: right, y: top + 20 },
        { x: right, y: (top + bottom) / 2 - 25 }
      ]);
      this.drawAnimatedWire([
        { x: midX + 35, y: bottom - 20 },
        { x: right, y: bottom - 20 },
        { x: right, y: (top + bottom) / 2 + 25 }
      ]);
    } else {
      // Half-Wave single diode
      this.drawAnimatedWire([
        { x: left + 25, y: (top + bottom) / 2 - 15 },
        { x: left + 25, y: top + 20 },
        { x: midX - 20, y: top + 20 }
      ]);
      this.drawDiodeSymbol(midX, top + 20, 'silicon', false);
      this.drawAnimatedWire([
        { x: midX + 20, y: top + 20 },
        { x: right, y: top + 20 },
        { x: right, y: (top + bottom) / 2 - 25 }
      ]);
      this.drawAnimatedWire([
        { x: left + 25, y: (top + bottom) / 2 + 15 },
        { x: left + 25, y: bottom - 20 },
        { x: right, y: bottom - 20 },
        { x: right, y: (top + bottom) / 2 + 25 }
      ]);
    }

    // Load Resistor
    this.drawResistor(right, (top + bottom) / 2, 'R_Load', `${this.state.rLoad || 1000} Ω`, true);

    // Capacitor Filter Shunt
    if (filterOn) {
      const capX = right - 50;
      this.drawAnimatedWire([
        { x: capX, y: top + 20 },
        { x: capX, y: bottom - 20 }
      ]);
      this.drawCapacitor(capX, (top + bottom) / 2, 'C_Filter', `${this.state.filterCapUF || 100} µF`);
    }
  }

  drawACSupply(x, y, label) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Sine symbol inside
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = -14; i <= 14; i++) {
      const sx = x + i;
      const sy = y + Math.sin((i / 14) * Math.PI) * 8;
      if (i === -14) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(label, x, y + 36);
    ctx.restore();
  }

  drawBridgeRectifier(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Diamond Bridge Outline
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -35);
    ctx.lineTo(35, 0);
    ctx.lineTo(0, 35);
    ctx.lineTo(-35, 0);
    ctx.closePath();
    ctx.stroke();

    // Diode symbols on each arm
    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('D1', 18, -18);
    ctx.fillText('D2', 18, 22);
    ctx.fillText('D3', -18, 22);
    ctx.fillText('D4', -18, -18);

    ctx.fillStyle = '#f8fafc';
    ctx.fillText('BRIDGE', 0, 4);

    ctx.restore();
  }

  drawCapacitor(x, y, label, valueText) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;

    // Two parallel plates
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 6);
    ctx.lineTo(x + 12, y - 6);
    ctx.moveTo(x - 12, y + 6);
    ctx.lineTo(x + 12, y + 6);
    ctx.stroke();

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(label, x + 16, y - 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(valueText, x + 16, y + 12);

    ctx.restore();
  }

  // 4. BJT CE Transistor Circuit
  drawTransistorCircuit(w, h) {
    const midX = w / 2;
    const midY = h / 2;
    const left = 90;
    const right = w - 90;

    // Base loop
    this.drawAnimatedWire([
      { x: left, y: midY + 50 },
      { x: left, y: midY },
      { x: midX - 60, y: midY }
    ]);
    this.drawAnimatedWire([
      { x: midX - 60, y: midY },
      { x: midX - 20, y: midY }
    ]);

    // Collector loop
    this.drawAnimatedWire([
      { x: right, y: midY - 60 },
      { x: right, y: midY - 80 },
      { x: midX + 20, y: midY - 80 },
      { x: midX + 20, y: midY - 20 }
    ]);

    // Emitter to Ground
    this.drawAnimatedWire([
      { x: midX + 20, y: midY + 20 },
      { x: midX + 20, y: midY + 80 },
      { x: left, y: midY + 80 },
      { x: left, y: midY + 50 }
    ]);
    this.drawAnimatedWire([
      { x: midX + 20, y: midY + 80 },
      { x: right, y: midY + 80 },
      { x: right, y: midY - 10 }
    ]);

    // Draw Transistor BC547 Circle and Leads
    this.drawBJTTransistorSymbol(midX, midY);

    // Sources & Resistors
    this.drawDCSupply(left, midY + 25, 'V_BB', (this.state.vBB || 1.5).toFixed(1));
    this.drawDCSupply(right, midY + 25, 'V_CC', (this.state.vCC || 10.0).toFixed(1));
    this.drawResistor(midX - 45, midY, 'R_B', '100 kΩ');
    this.drawResistor(midX + 20, midY - 50, 'R_C', '1 kΩ', true);

    // Microammeter IB & Milliammeter IC
    this.drawMeter(midX - 35, midY - 25, 'A', (this.state.Ib_uA || 20).toFixed(1), 'µA');
    this.drawMeter(right, midY - 80, 'A', (this.state.Ic_mA || 3.0).toFixed(2), 'mA');
  }

  drawBJTTransistorSymbol(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Package Circle
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Base Bar
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.lineTo(-10, 14);
    ctx.stroke();

    // Collector lead
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -7);
    ctx.lineTo(14, -18);
    ctx.stroke();

    // Emitter lead with arrow (NPN arrow pointing outward)
    ctx.beginPath();
    ctx.moveTo(-10, 7);
    ctx.lineTo(14, 18);
    ctx.stroke();

    // NPN Arrow
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(14, 18);
    ctx.lineTo(8, 11);
    ctx.lineTo(4, 18);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('B', -18, 3);
    ctx.fillText('C', 14, -22);
    ctx.fillText('E', 14, 28);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('BC547', -14, -30);

    ctx.restore();
  }

  // 5. RC Filter Circuit
  drawRCFilterCircuit(w, h) {
    const type = this.state.type || 'lpf';
    const left = 90;
    const midX = w / 2;
    const right = w - 90;
    const top = 80;
    const bottom = h - 80;

    this.drawACSupply(left, (top + bottom) / 2, 'Func Gen (Vin)');

    this.drawAnimatedWire([
      { x: left + 25, y: (top + bottom) / 2 - 15 },
      { x: left + 25, y: top },
      { x: midX - 30, y: top }
    ]);

    this.drawAnimatedWire([
      { x: midX + 30, y: top },
      { x: right, y: top },
      { x: right, y: (top + bottom) / 2 - 25 }
    ]);

    this.drawAnimatedWire([
      { x: right, y: (top + bottom) / 2 + 25 },
      { x: right, y: bottom },
      { x: left + 25, y: bottom },
      { x: left + 25, y: (top + bottom) / 2 + 15 }
    ]);

    if (type === 'lpf') {
      this.drawResistor(midX, top, 'R', `${this.state.r || 1000} Ω`);
      this.drawCapacitor(right, (top + bottom) / 2, 'C', `${this.state.c_uF || 0.1} µF`);
    } else {
      this.drawCapacitor(midX, top, 'C', `${this.state.c_uF || 0.1} µF`);
      this.drawResistor(right, (top + bottom) / 2, 'R', `${this.state.r || 1000} Ω`, true);
    }

    // Output Probes
    this.drawMeter(right + 40, (top + bottom) / 2, 'V', (this.state.vOutPeak || 1.41).toFixed(2), 'Vpk');
  }

  // 6. Op-Amp 741 Circuit
  drawOpAmpCircuit(w, h) {
    const config = this.state.config || 'inverting';
    const midX = w / 2;
    const midY = h / 2;
    const left = 90;
    const right = w - 90;

    // Op-Amp Triangle
    this.drawOpAmpSymbol(midX, midY, config);

    // Feedback Loop (Pin 2 to Pin 6 via Rf)
    this.drawAnimatedWire([
      { x: midX - 45, y: midY - 14 },
      { x: midX - 45, y: midY - 60 },
      { x: midX + 45, y: midY - 60 },
      { x: midX + 45, y: midY }
    ]);
    this.drawResistor(midX, midY - 60, 'R_f', `${(this.state.rf || 20000) / 1000} kΩ`);

    // Input Signal
    this.drawACSupply(left, midY - 14, 'Vin (1 kHz)');
    this.drawAnimatedWire([
      { x: left + 25, y: midY - 14 },
      { x: midX - 45, y: midY - 14 }
    ]);
    this.drawResistor(midX - 70, midY - 14, 'R_1', `${(this.state.r1 || 10000) / 1000} kΩ`);

    // Output
    this.drawAnimatedWire([
      { x: midX + 35, y: midY },
      { x: right, y: midY }
    ]);
    this.drawMeter(right, midY, 'V', (this.state.vOutActual || 2.0).toFixed(2), 'Vpk');
  }

  drawOpAmpSymbol(x, y, config) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Large Triangle
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-35, -35);
    ctx.lineTo(35, 0);
    ctx.lineTo(-35, 35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inputs: (-) Inverting, (+) Non-inverting
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('−', -25, -10);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('+', -25, 18);

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('IC 741', -10, 3);
    ctx.fillText(config.toUpperCase(), -20, 48);

    ctx.restore();
  }

  // 7. Logic Gate Circuit
  drawLogicGateCircuit(w, h) {
    const gateType = this.state.gateType || 'AND';
    const inA = this.state.inA || 0;
    const inB = this.state.inB || 0;
    const out = this.state.output || 0;

    const midX = w / 2;
    const midY = h / 2;
    const left = 120;
    const right = w - 120;

    // Input A Wire & Switch
    this.drawAnimatedWire([
      { x: left, y: midY - 25 },
      { x: midX - 35, y: midY - 25 }
    ]);
    this.drawLogicSwitch(left, midY - 25, 'Input A', inA);

    // Input B Wire & Switch (unless NOT gate)
    if (gateType !== 'NOT') {
      this.drawAnimatedWire([
        { x: left, y: midY + 25 },
        { x: midX - 35, y: midY + 25 }
      ]);
      this.drawLogicSwitch(left, midY + 25, 'Input B', inB);
    }

    // Gate Symbol
    this.drawLogicGateSymbol(midX, midY, gateType);

    // Output Wire & LED
    this.drawAnimatedWire([
      { x: midX + 35, y: midY },
      { x: right, y: midY }
    ]);
    this.drawLEDIndicator(right, midY, out);
  }

  drawLogicSwitch(x, y, label, state) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = state ? '#10b981' : '#334155';
    ctx.strokeStyle = state ? '#34d399' : '#64748b';
    ctx.lineWidth = 2;
    ctx.fillRect(x - 30, y - 14, 45, 28);
    ctx.strokeRect(x - 30, y - 14, 45, 28);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state ? '1 (HIGH)' : '0 (LOW)', x - 7, y + 4);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(label, x - 7, y - 18);
    ctx.restore();
  }

  drawLogicGateSymbol(x, y, type) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    // Body shape
    ctx.beginPath();
    if (type.includes('OR')) {
      ctx.moveTo(-30, -30);
      ctx.quadraticCurveTo(0, -30, 25, 0);
      ctx.quadraticCurveTo(0, 30, -30, 30);
      ctx.quadraticCurveTo(-15, 0, -30, -30);
    } else if (type === 'NOT') {
      ctx.moveTo(-25, -25);
      ctx.lineTo(20, 0);
      ctx.lineTo(-25, 25);
      ctx.closePath();
    } else {
      // AND type
      ctx.moveTo(-30, -30);
      ctx.lineTo(0, -30);
      ctx.arc(0, 0, 30, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(-30, 30);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();

    // Inversion Bubble for NOT, NAND, NOR, XNOR
    if (['NOT', 'NAND', 'NOR', 'XNOR'].includes(type)) {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(28, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.fillText(type, -5, 4);

    ctx.restore();
  }

  drawLEDIndicator(x, y, isLit) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = isLit ? '#ef4444' : '#450a0a';
    ctx.strokeStyle = isLit ? '#f87171' : '#7f1d1d';
    ctx.lineWidth = 2;

    if (isLit) {
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 18;
    }

    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(isLit ? 'ON' : 'OFF', x, y + 4);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('LED (Y)', x, y + 30);
    ctx.restore();
  }

  // 8. 555 Timer Circuit
  draw555TimerCircuit(w, h) {
    const midX = w / 2;
    const midY = h / 2;
    const left = 90;
    const right = w - 90;

    // 555 DIP IC
    this.draw555Package(midX, midY);

    // Resistors RA and RB
    this.drawResistor(midX - 70, midY - 60, 'R_A', `${this.state.rA_k || 10} kΩ`);
    this.drawResistor(midX - 70, midY + 10, 'R_B', `${this.state.rB_k || 47} kΩ`);

    // Timing Capacitor C
    this.drawCapacitor(midX - 70, midY + 70, 'C', `${this.state.c_uF || 1.0} µF`);

    // Output Wire to LED
    this.drawAnimatedWire([
      { x: midX + 35, y: midY },
      { x: right, y: midY }
    ]);

    // Flashing LED based on 555 state
    const isHigh = Math.sin(Date.now() * 0.006 * (this.state.frequency_Hz || 2)) > 0;
    this.drawLEDIndicator(right, midY, isHigh);
  }

  draw555Package(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // IC Body
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.fillRect(-35, -50, 70, 100);
    ctx.strokeRect(-35, -50, 70, 100);

    // Top Notch
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -50, 8, 0, Math.PI);
    ctx.fill();
    ctx.stroke();

    // Pin Labels
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText('1:GND', -30, -32);
    ctx.fillText('2:TRIG', -30, -10);
    ctx.fillText('3:OUT', 3, -10);
    ctx.fillText('4:RST', -30, 12);
    ctx.fillText('5:CTRL', 3, 12);
    ctx.fillText('6:THRS', -30, 34);
    ctx.fillText('7:DSCH', 3, 34);
    ctx.fillText('8:VCC', 3, -32);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NE555', 0, 0);

    ctx.restore();
  }
}
