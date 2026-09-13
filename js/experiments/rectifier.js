/**
 * Simulink X Studyhub - Experiment 3: Rectifier Controller (Half-Wave & Full-Wave Bridge)
 * Developed by Aditya Maurya
 */

const RectifierExperiment = {
  id: 'rectifier',
  state: {
    type: 'full-wave', // 'half-wave', 'full-wave'
    vRMS: 12,
    freq: 50,
    rLoad: 1000,
    filterEnabled: false,
    filterCapUF: 100,
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
        <th>Topology</th>
        <th>Filter Capacitor</th>
        <th>Input V_RMS (V)</th>
        <th>DC Voltage V_dc (V)</th>
        <th>Ripple Factor (γ)</th>
        <th>Efficiency (%)</th>
      </tr>
    `;
  },

  setupUI() {
    const container = document.getElementById('experiment-controls');
    if (!container) return;

    container.innerHTML = `
      <div class="control-panel-grid">
        <!-- Rectifier Configuration -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-network-wired highlight-cyan"></i> Rectifier Topology</h4>
          </div>
          <div class="control-group">
            <label>Circuit Architecture:</label>
            <div class="btn-group-toggle">
              <button id="btn-rect-fwr" class="btn btn-sm ${this.state.type === 'full-wave' ? 'btn-primary' : 'btn-outline'}">
                Full-Wave Bridge (4 Diodes)
              </button>
              <button id="btn-rect-hwr" class="btn btn-sm ${this.state.type === 'half-wave' ? 'btn-primary' : 'btn-outline'}">
                Half-Wave (1 Diode)
              </button>
            </div>
          </div>
          <div class="control-group">
            <label>AC Transformer Secondary: <span id="rect-v-val" class="highlight-val">${this.state.vRMS} V RMS</span></label>
            <input type="range" id="rect-v-slider" min="6" max="24" step="2" value="${this.state.vRMS}">
            <div class="slider-ticks"><span>6V</span><span>12V</span><span>18V</span><span>24V</span></div>
          </div>
        </div>

        <!-- Filter & Load Settings -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-filter highlight-cyan"></i> Shunt Capacitor Filter</h4>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="filter-toggle" ${this.state.filterEnabled ? 'checked' : ''}>
              <label class="form-check-label" for="filter-toggle">Filter ON</label>
            </div>
          </div>
          <div class="control-group">
            <label>Filter Capacitance (C):</label>
            <select id="rect-c-select" class="form-select" ${!this.state.filterEnabled ? 'disabled' : ''}>
              <option value="10">10 µF (High Ripple)</option>
              <option value="47">47 µF</option>
              <option value="100" selected>100 µF (Standard)</option>
              <option value="470">470 µF (Smooth DC)</option>
              <option value="1000">1000 µF (Ultra Low Ripple)</option>
            </select>
          </div>
          <div class="control-group">
            <label>Load Resistor (R_L): <span id="rect-rl-val" class="highlight-val">${this.state.rLoad} Ω</span></label>
            <input type="range" id="rect-rl-slider" min="200" max="5000" step="100" value="${this.state.rLoad}">
            <div class="slider-ticks"><span>200Ω</span><span>2.5kΩ</span><span>5kΩ</span></div>
          </div>
        </div>

        <!-- Real-Time Rectifier Metrics -->
        <div class="control-card metrics-card">
          <div class="card-header">
            <h4><i class="fas fa-chart-bar highlight-cyan"></i> Performance Readouts</h4>
          </div>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-title">DC OUTPUT (V_dc)</span>
              <span id="metric-rect-vdc" class="metric-value">0.00 V</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">RIPPLE FACTOR (γ)</span>
              <span id="metric-rect-gamma" class="metric-value">0.482</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">PEAK RIPPLE (Vr p-p)</span>
              <span id="metric-rect-vr" class="metric-value">0.00 V</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">EFFICIENCY (η)</span>
              <span id="metric-rect-eff" class="metric-value">81.2%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-toolbar">
        <button id="btn-rect-log" class="btn btn-primary">
          <i class="fas fa-plus-circle"></i> Add Reading to Table
        </button>
        <button id="btn-rect-plot" class="btn btn-accent">
          <i class="fas fa-chart-line"></i> Plot Ripple vs Filter Capacitance
        </button>
        <button id="btn-rect-clear-table" class="btn btn-secondary">
          <i class="fas fa-trash-alt"></i> Clear Table
        </button>
      </div>
    `;

    // Event listeners
    const fwrBtn = document.getElementById('btn-rect-fwr');
    const hwrBtn = document.getElementById('btn-rect-hwr');
    const vSlider = document.getElementById('rect-v-slider');
    const vVal = document.getElementById('rect-v-val');
    const filterToggle = document.getElementById('filter-toggle');
    const cSelect = document.getElementById('rect-c-select');
    const rlSlider = document.getElementById('rect-rl-slider');
    const rlVal = document.getElementById('rect-rl-val');

    fwrBtn.addEventListener('click', () => {
      this.state.type = 'full-wave';
      fwrBtn.className = 'btn btn-sm btn-primary';
      hwrBtn.className = 'btn btn-sm btn-outline';
      this.update();
    });

    hwrBtn.addEventListener('click', () => {
      this.state.type = 'half-wave';
      hwrBtn.className = 'btn btn-sm btn-primary';
      fwrBtn.className = 'btn btn-sm btn-outline';
      this.update();
    });

    vSlider.addEventListener('input', (e) => {
      this.state.vRMS = parseFloat(e.target.value);
      vVal.textContent = `${this.state.vRMS} V RMS`;
      this.update();
    });

    filterToggle.addEventListener('change', (e) => {
      this.state.filterEnabled = e.target.checked;
      cSelect.disabled = !this.state.filterEnabled;
      this.update();
    });

    cSelect.addEventListener('change', (e) => {
      this.state.filterCapUF = parseFloat(e.target.value);
      this.update();
    });

    rlSlider.addEventListener('input', (e) => {
      this.state.rLoad = parseFloat(e.target.value);
      rlVal.textContent = `${this.state.rLoad} Ω`;
      this.update();
    });

    document.getElementById('btn-rect-log').addEventListener('click', () => this.logReading());
    document.getElementById('btn-rect-clear-table').addEventListener('click', () => this.clearReadings());
    document.getElementById('btn-rect-plot').addEventListener('click', () => {
      this.plotGraph();
      this.app.switchMainView('graph');
    });
  },

  update() {
    const calc = CircuitMath.calculateRectifier(
      this.state.vRMS,
      this.state.freq,
      this.state.type,
      this.state.filterCapUF,
      this.state.rLoad,
      this.state.filterEnabled
    );

    // Update UI Metrics
    document.getElementById('metric-rect-vdc').textContent = `${calc.Vdc.toFixed(2)} V`;
    document.getElementById('metric-rect-gamma').textContent = calc.rippleFactor.toFixed(3);
    document.getElementById('metric-rect-vr').textContent = `${calc.rippleVpp.toFixed(2)} V`;
    document.getElementById('metric-rect-eff').textContent = `${calc.efficiency.toFixed(1)}%`;

    // Update Circuit Canvas
    if (this.app.circuitCanvas) {
      this.app.circuitCanvas.updateState({
        type: calc.type,
        vRMS: calc.vRMS,
        rLoad: calc.rLoad,
        filterEnabled: calc.filterEnabled,
        filterCapUF: calc.filterCapUF,
        current_mA: calc.Idc_mA,
        powerOn: true
      });
    }

    // Configure Dual-Channel Oscilloscope
    if (this.app.oscilloscope) {
      const omega = 2 * Math.PI * this.state.freq;
      const Vm = calc.Vm;
      const Vpeak = calc.Vpeak;
      const isFWR = calc.type === 'full-wave';
      const hasFilter = calc.filterEnabled;
      const Vr = calc.rippleVpp;
      const Vdc = calc.Vdc;

      // Channel 1: AC Input Sine Wave (Secondary)
      this.app.oscilloscope.setCh1Waveform((t) => {
        return Vm * Math.sin(omega * t);
      });

      // Channel 2: Rectified and Filtered Output Waveform
      this.app.oscilloscope.setCh2Waveform((t) => {
        const rawSine = Math.sin(omega * t);
        let rectified = 0;
        if (isFWR) {
          rectified = Math.abs(rawSine) * Vpeak;
        } else {
          rectified = Math.max(0, rawSine) * Vpeak;
        }

        if (!hasFilter) {
          return rectified;
        } else {
          // Exponential discharge ripple on scope
          const rippleFreq = isFWR ? 2 * this.state.freq : this.state.freq;
          const cycleFrac = (t * rippleFreq) % 1.0;
          return Vdc + (Vr / 2) * (1 - 2 * cycleFrac);
        }
      });
    }

    if (this.app.multimeter) {
      if (this.app.multimeter.mode === 'ACV') {
        this.app.multimeter.setReading(calc.vRMS, 'V');
      } else {
        this.app.multimeter.setReading(calc.Vdc, 'V');
      }
    }
  },

  logReading() {
    const calc = CircuitMath.calculateRectifier(
      this.state.vRMS,
      this.state.freq,
      this.state.type,
      this.state.filterCapUF,
      this.state.rLoad,
      this.state.filterEnabled
    );

    const reading = {
      sno: this.state.readings.length + 1,
      type: calc.type === 'full-wave' ? 'Full-Wave' : 'Half-Wave',
      filter: calc.filterEnabled ? `${calc.filterCapUF} µF` : 'None',
      vRMS: `${calc.vRMS} V`,
      vdc: `${calc.Vdc} V`,
      ripple: calc.rippleFactor.toFixed(3),
      eff: `${calc.efficiency}%`,
      capVal: calc.filterEnabled ? calc.filterCapUF : 0
    };

    this.state.readings.push(reading);
    this.renderTable();
    this.plotGraph();
    this.app.showToast(`Logged: Vdc = ${reading.vdc}, γ = ${reading.ripple}`, 'success');
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
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No readings logged yet. Toggle settings and click "Add Reading to Table".</td></tr>`;
      return;
    }

    tbody.innerHTML = this.state.readings.map(r => `
      <tr>
        <td>${r.sno}</td>
        <td><span class="badge ${r.type === 'Full-Wave' ? 'badge-info' : 'badge-warning'}">${r.type}</span></td>
        <td>${r.filter}</td>
        <td>${r.vRMS}</td>
        <td><strong>${r.vdc}</strong></td>
        <td><strong>${r.ripple}</strong></td>
        <td>${r.eff}</td>
      </tr>
    `).join('');
  },

  plotGraph() {
    if (!this.app.graphPlotter) return;
    this.app.graphPlotter.clear();
    this.app.graphPlotter.setLabels(
      "Rectifier Filter Performance: Capacitance (µF) vs Ripple Factor (γ)",
      "Capacitance C (µF)",
      "Ripple Factor γ"
    );

    if (this.state.readings.length > 0) {
      const points = this.state.readings.map(r => ({
        x: r.capVal,
        y: parseFloat(r.ripple)
      }));
      this.app.graphPlotter.addSeries("Ripple Factor vs C", "#38bdf8", points);
    }
  }
};
