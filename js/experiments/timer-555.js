/**
 * Simulink X Studyhub - Experiment 8: 555 Timer Astable Multivibrator Controller
 * Developed by Aditya Maurya
 */

const Timer555Experiment = {
  id: 'timer-555',
  state: {
    rA_k: 10,  // 10 kΩ
    rB_k: 47,  // 47 kΩ
    c_uF: 1.0, // 1.0 µF
    vCC: 9.0,  // 9 V
    readings: []
  },

  init(app) {
    this.app = app;
    this.setupUI();
    this.setupTableHeaders();
    this.update();
  },

  setupTableHeaders() {
    const thead = document.getElementById('table-head');
    if (!thead) return;
    thead.innerHTML = `
      <tr>
        <th>S.No</th>
        <th>R_A (kΩ)</th>
        <th>R_B (kΩ)</th>
        <th>Capacitor C (µF)</th>
        <th>T_high (ms)</th>
        <th>T_low (ms)</th>
        <th>Frequency (Hz)</th>
        <th>Duty Cycle (%)</th>
      </tr>
    `;
  },

  setupUI() {
    const container = document.getElementById('experiment-controls');
    if (!container) return;

    container.innerHTML = `
      <div class="control-panel-grid">
        <!-- Timing Resistors & Capacitor -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-clock highlight-cyan"></i> Timing Components</h4>
          </div>
          <div class="control-group">
            <label>Resistor R_A: <span id="timer-ra-val" class="highlight-val">${this.state.rA_k} kΩ</span></label>
            <input type="range" id="timer-ra-slider" min="1" max="50" step="1" value="${this.state.rA_k}">
            <div class="slider-ticks"><span>1kΩ</span><span>25kΩ</span><span>50kΩ</span></div>
          </div>
          <div class="control-group">
            <label>Resistor R_B: <span id="timer-rb-val" class="highlight-val">${this.state.rB_k} kΩ</span></label>
            <input type="range" id="timer-rb-slider" min="1" max="100" step="1" value="${this.state.rB_k}">
            <div class="slider-ticks"><span>1kΩ</span><span>50kΩ</span><span>100kΩ</span></div>
          </div>
        </div>

        <!-- Capacitor & Power Supply -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-battery-three-quarters highlight-cyan"></i> Timing Capacitor & V_CC</h4>
          </div>
          <div class="control-group">
            <label>Timing Capacitor (C):</label>
            <select id="timer-c-select" class="form-select">
              <option value="0.01">0.01 µF (High Frequency)</option>
              <option value="0.1">0.1 µF (Audio Range)</option>
              <option value="1.0" selected>1.0 µF (Standard LED Flasher)</option>
              <option value="10.0">10.0 µF (Slow Pulse)</option>
              <option value="47.0">47.0 µF (Ultra Slow)</option>
            </select>
          </div>
          <div class="control-group">
            <label>Supply Voltage (V_CC):</label>
            <div class="btn-group-toggle">
              <button id="btn-vcc-5" class="btn btn-sm ${this.state.vCC === 5 ? 'btn-primary' : 'btn-outline'}">+5 V</button>
              <button id="btn-vcc-9" class="btn btn-sm ${this.state.vCC === 9 ? 'btn-primary' : 'btn-outline'}">+9 V</button>
              <button id="btn-vcc-12" class="btn btn-sm ${this.state.vCC === 12 ? 'btn-primary' : 'btn-outline'}">+12 V</button>
            </div>
          </div>
        </div>

        <!-- Real-Time 555 Metrics -->
        <div class="control-card metrics-card">
          <div class="card-header">
            <h4><i class="fas fa-wave-square highlight-cyan"></i> Multivibrator Parameters</h4>
          </div>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-title">OSCILLATION FREQ (f)</span>
              <span id="metric-timer-freq" class="metric-value highlight-cyan">13.85 Hz</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">DUTY CYCLE (D)</span>
              <span id="metric-timer-duty" class="metric-value">54.8%</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">HIGH TIME (T_high)</span>
              <span id="metric-timer-thigh" class="metric-value">39.5 ms</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">LOW TIME (T_low)</span>
              <span id="metric-timer-tlow" class="metric-value">32.6 ms</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-toolbar">
        <button id="btn-timer-log" class="btn btn-primary">
          <i class="fas fa-plus-circle"></i> Add Reading to Table
        </button>
        <button id="btn-timer-plot" class="btn btn-accent">
          <i class="fas fa-chart-line"></i> Plot Duty Cycle vs R_B
        </button>
        <button id="btn-timer-clear-table" class="btn btn-secondary">
          <i class="fas fa-trash-alt"></i> Clear Table
        </button>
      </div>
    `;

    // Event listeners
    const raSlider = document.getElementById('timer-ra-slider');
    const raVal = document.getElementById('timer-ra-val');
    const rbSlider = document.getElementById('timer-rb-slider');
    const rbVal = document.getElementById('timer-rb-val');
    const cSelect = document.getElementById('timer-c-select');

    raSlider.addEventListener('input', (e) => {
      this.state.rA_k = parseFloat(e.target.value);
      raVal.textContent = `${this.state.rA_k} kΩ`;
      this.update();
    });

    rbSlider.addEventListener('input', (e) => {
      this.state.rB_k = parseFloat(e.target.value);
      rbVal.textContent = `${this.state.rB_k} kΩ`;
      this.update();
    });

    cSelect.addEventListener('change', (e) => {
      this.state.c_uF = parseFloat(e.target.value);
      this.update();
    });

    const vcc5 = document.getElementById('btn-vcc-5');
    const vcc9 = document.getElementById('btn-vcc-9');
    const vcc12 = document.getElementById('btn-vcc-12');

    vcc5.addEventListener('click', () => {
      this.state.vCC = 5.0;
      vcc5.className = 'btn btn-sm btn-primary';
      vcc9.className = 'btn btn-sm btn-outline';
      vcc12.className = 'btn btn-sm btn-outline';
      this.update();
    });

    vcc9.addEventListener('click', () => {
      this.state.vCC = 9.0;
      vcc9.className = 'btn btn-sm btn-primary';
      vcc5.className = 'btn btn-sm btn-outline';
      vcc12.className = 'btn btn-sm btn-outline';
      this.update();
    });

    vcc12.addEventListener('click', () => {
      this.state.vCC = 12.0;
      vcc12.className = 'btn btn-sm btn-primary';
      vcc5.className = 'btn btn-sm btn-outline';
      vcc9.className = 'btn btn-sm btn-outline';
      this.update();
    });

    document.getElementById('btn-timer-log').addEventListener('click', () => this.logReading());
    document.getElementById('btn-timer-clear-table').addEventListener('click', () => this.clearReadings());
    document.getElementById('btn-timer-plot').addEventListener('click', () => {
      this.plotGraph();
      this.app.switchMainView('graph');
    });
  },

  update() {
    const calc = CircuitMath.calculate555Timer(
      this.state.rA_k,
      this.state.rB_k,
      this.state.c_uF,
      this.state.vCC
    );

    // Update UI Metrics
    document.getElementById('metric-timer-freq').textContent = `${calc.frequency_Hz} Hz`;
    document.getElementById('metric-timer-duty').textContent = `${calc.dutyCycle}%`;
    document.getElementById('metric-timer-thigh').textContent = `${calc.tHigh_ms} ms`;
    document.getElementById('metric-timer-tlow').textContent = `${calc.tLow_ms} ms`;

    // Update Circuit Canvas
    if (this.app.circuitCanvas) {
      this.app.circuitCanvas.updateState({
        rA_k: calc.rA_k,
        rB_k: calc.rB_k,
        c_uF: calc.c_uF,
        frequency_Hz: calc.frequency_Hz,
        current_mA: 20,
        powerOn: true
      });
    }

    // Oscilloscope Real-Time Dual Waveforms
    if (this.app.oscilloscope) {
      const periodSec = calc.period_ms / 1000;
      const tHighSec = calc.tHigh_ms / 1000;
      const vCC = calc.vCC;
      const vUpper = calc.vUpperThresh;
      const vLower = calc.vLowerTrigger;

      this.app.oscilloscope.timePerDiv = periodSec / 2.5;
      this.app.oscilloscope.ch1.voltsPerDiv = 5.0;
      this.app.oscilloscope.ch2.voltsPerDiv = 5.0;

      // Channel 1: Output Square Wave (Pin 3)
      this.app.oscilloscope.setCh1Waveform((t) => {
        const cycleTime = t % periodSec;
        return cycleTime < tHighSec ? vCC - 0.2 : 0.1;
      });

      // Channel 2: Exponential Charging & Discharging Capacitor Voltage (Pin 2/6)
      this.app.oscilloscope.setCh2Waveform((t) => {
        const cycleTime = t % periodSec;
        if (cycleTime < tHighSec) {
          const frac = cycleTime / tHighSec;
          return vLower + (vUpper - vLower) * (1 - Math.exp(-2.2 * frac));
        } else {
          const frac = (cycleTime - tHighSec) / (periodSec - tHighSec);
          return vUpper - (vUpper - vLower) * (1 - Math.exp(-2.2 * frac));
        }
      });
    }

    if (this.app.multimeter) {
      this.app.multimeter.setReading(calc.frequency_Hz, 'Hz');
    }
  },

  logReading() {
    const calc = CircuitMath.calculate555Timer(
      this.state.rA_k,
      this.state.rB_k,
      this.state.c_uF,
      this.state.vCC
    );

    const reading = {
      sno: this.state.readings.length + 1,
      ra: `${calc.rA_k} kΩ`,
      rb: `${calc.rB_k} kΩ`,
      rbNum: calc.rB_k,
      c: `${calc.c_uF} µF`,
      thigh: `${calc.tHigh_ms} ms`,
      tlow: `${calc.tLow_ms} ms`,
      freq: `${calc.frequency_Hz} Hz`,
      duty: `${calc.dutyCycle}%`,
      dutyNum: calc.dutyCycle
    };

    this.state.readings.push(reading);
    this.renderTable();
    this.plotGraph();
    this.app.showToast(`Logged: f = ${reading.freq}, D = ${reading.duty}`, 'success');
  },

  clearReadings() {
    this.state.readings = [];
    this.renderTable();
    if (this.app.graphPlotter) {
      this.app.graphPlotter.clear();
    }
    this.app.showToast('Observation table cleared', 'info');
  },

  renderTable() {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;

    if (this.state.readings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No readings logged yet. Adjust timing components and click "Add Reading to Table".</td></tr>`;
      return;
    }

    tbody.innerHTML = this.state.readings.map(r => `
      <tr>
        <td>${r.sno}</td>
        <td>${r.ra}</td>
        <td>${r.rb}</td>
        <td>${r.c}</td>
        <td>${r.thigh}</td>
        <td>${r.tlow}</td>
        <td><strong>${r.freq}</strong></td>
        <td><strong class="highlight-cyan">${r.duty}</strong></td>
      </tr>
    `).join('');
  },

  plotGraph() {
    if (!this.app.graphPlotter) return;
    this.app.graphPlotter.clear();
    this.app.graphPlotter.setLabels(
      "555 Timer Duty Cycle vs Resistor R_B (kΩ)",
      "Timing Resistor R_B (kΩ)",
      "Duty Cycle (%)"
    );

    if (this.state.readings.length > 0) {
      const points = this.state.readings.map(r => ({
        x: r.rbNum,
        y: r.dutyNum
      }));
      this.app.graphPlotter.addSeries("Duty Cycle vs RB", "#38bdf8", points);
    }
  }
};
