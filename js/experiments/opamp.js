/**
 * Simulink X Studyhub - Experiment 6: Op-Amp 741 Inverting/Non-Inverting Controller
 * Developed by Aditya Maurya
 */

const OpAmpExperiment = {
  id: 'opamp',
  state: {
    config: 'inverting', // 'inverting', 'non-inverting'
    r1: 10000,           // 10 kΩ
    rf: 20000,           // 20 kΩ
    vInPeak: 1.0,        // 1.0 V
    vSupply: 15,         // ±15 V rails
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
        <th>Config</th>
        <th>R1 / Rf (kΩ)</th>
        <th>Vin pk (V)</th>
        <th>Vout pk (V)</th>
        <th>Gain Av Exp (Theor)</th>
        <th>Saturation Status</th>
      </tr>
    `;
  },

  setupUI() {
    const container = document.getElementById('experiment-controls');
    if (!container) return;

    container.innerHTML = `
      <div class="control-panel-grid">
        <!-- Configuration & Resistors -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-arrows-alt-v highlight-cyan"></i> Op-Amp Topology</h4>
          </div>
          <div class="control-group">
            <label>Feedback Configuration:</label>
            <div class="btn-group-toggle">
              <button id="btn-opamp-inv" class="btn btn-sm ${this.state.config === 'inverting' ? 'btn-primary' : 'btn-outline'}">
                Inverting (Av = -Rf/R1)
              </button>
              <button id="btn-opamp-noninv" class="btn btn-sm ${this.state.config === 'non-inverting' ? 'btn-primary' : 'btn-outline'}">
                Non-Inverting (Av = 1+Rf/R1)
              </button>
            </div>
          </div>
          <div class="control-group">
            <label>Resistors (R1 & Rf):</label>
            <div class="dual-inputs">
              <select id="opamp-r1-select" class="form-select">
                <option value="5000">R1 = 5 kΩ</option>
                <option value="10000" selected>R1 = 10 kΩ</option>
                <option value="20000">R1 = 20 kΩ</option>
              </select>
              <select id="opamp-rf-select" class="form-select">
                <option value="10000">Rf = 10 kΩ (Gain 1 / 2)</option>
                <option value="20000" selected>Rf = 20 kΩ (Gain 2 / 3)</option>
                <option value="50000">Rf = 50 kΩ (Gain 5 / 6)</option>
                <option value="100000">Rf = 100 kΩ (Gain 10 / 11)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Input Signal & Dual Rails -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-sliders-h highlight-cyan"></i> Input Amplitude</h4>
          </div>
          <div class="control-group">
            <label>Input Voltage (Vin pk): <span id="opamp-vin-val" class="highlight-val">${this.state.vInPeak.toFixed(1)} V</span></label>
            <input type="range" id="opamp-vin-slider" min="0.2" max="6.0" step="0.2" value="${this.state.vInPeak}">
            <div class="slider-ticks"><span>0.2V</span><span>3.0V</span><span>6.0V</span></div>
          </div>
          <div class="control-group">
            <label>DC Supply Rails:</label>
            <span class="badge badge-info">±15 V Dual DC Supply (Vsat ≈ ±13.5 V)</span>
          </div>
        </div>

        <!-- Real-Time Op-Amp Metrics -->
        <div class="control-card metrics-card">
          <div class="card-header">
            <h4><i class="fas fa-microchip highlight-cyan"></i> Output Readouts</h4>
          </div>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-title">VOLTAGE GAIN (Av)</span>
              <span id="metric-opamp-gain" class="metric-value">-2.00</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">PHASE INVERSION</span>
              <span id="metric-opamp-phase" class="metric-value">180°</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">OUTPUT PEAK (Vout)</span>
              <span id="metric-opamp-vout" class="metric-value">2.00 V</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">STATUS</span>
              <span id="metric-opamp-sat" class="metric-value highlight-green">LINEAR REGION</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-toolbar">
        <button id="btn-opamp-log" class="btn btn-primary">
          <i class="fas fa-plus-circle"></i> Add Reading to Table
        </button>
        <button id="btn-opamp-plot" class="btn btn-accent">
          <i class="fas fa-chart-line"></i> Plot Vin vs Vout Linearity
        </button>
        <button id="btn-opamp-clear-table" class="btn btn-secondary">
          <i class="fas fa-trash-alt"></i> Clear Table
        </button>
      </div>
    `;

    // Event listeners
    const invBtn = document.getElementById('btn-opamp-inv');
    const nonInvBtn = document.getElementById('btn-opamp-noninv');
    const r1Select = document.getElementById('opamp-r1-select');
    const rfSelect = document.getElementById('opamp-rf-select');
    const vinSlider = document.getElementById('opamp-vin-slider');
    const vinVal = document.getElementById('opamp-vin-val');

    invBtn.addEventListener('click', () => {
      this.state.config = 'inverting';
      invBtn.className = 'btn btn-sm btn-primary';
      nonInvBtn.className = 'btn btn-sm btn-outline';
      this.update();
    });

    nonInvBtn.addEventListener('click', () => {
      this.state.config = 'non-inverting';
      nonInvBtn.className = 'btn btn-sm btn-primary';
      invBtn.className = 'btn btn-sm btn-outline';
      this.update();
    });

    r1Select.addEventListener('change', (e) => {
      this.state.r1 = parseFloat(e.target.value);
      this.update();
    });

    rfSelect.addEventListener('change', (e) => {
      this.state.rf = parseFloat(e.target.value);
      this.update();
    });

    vinSlider.addEventListener('input', (e) => {
      this.state.vInPeak = parseFloat(e.target.value);
      vinVal.textContent = `${this.state.vInPeak.toFixed(1)} V`;
      this.update();
    });

    document.getElementById('btn-opamp-log').addEventListener('click', () => this.logReading());
    document.getElementById('btn-opamp-clear-table').addEventListener('click', () => this.clearReadings());
    document.getElementById('btn-opamp-plot').addEventListener('click', () => {
      this.plotGraph();
      this.app.switchMainView('graph');
    });
  },

  update() {
    const calc = CircuitMath.calculateOpAmp(
      this.state.config,
      this.state.r1,
      this.state.rf,
      this.state.vInPeak,
      this.state.vSupply
    );

    // Update UI Metrics
    document.getElementById('metric-opamp-gain').textContent = calc.gain.toFixed(2);
    document.getElementById('metric-opamp-phase').textContent = `${calc.phaseShift}°`;
    document.getElementById('metric-opamp-vout').textContent = `${calc.vOutActual.toFixed(2)} V`;

    const satEl = document.getElementById('metric-opamp-sat');
    if (calc.isSaturated) {
      satEl.textContent = 'SATURATED (CLIPPING)';
      satEl.className = 'metric-value highlight-red';
    } else {
      satEl.textContent = 'LINEAR REGION';
      satEl.className = 'metric-value highlight-green';
    }

    // Update Circuit Canvas
    if (this.app.circuitCanvas) {
      this.app.circuitCanvas.updateState({
        config: calc.config,
        r1: calc.r1,
        rf: calc.rf,
        vOutActual: calc.vOutActual,
        current_mA: (calc.vOutActual / calc.rf) * 1000,
        powerOn: true
      });
    }

    // Oscilloscope Real-Time Waveforms with Soft Saturation Clipping
    if (this.app.oscilloscope) {
      const f = 1000;
      const omega = 2 * Math.PI * f;
      const vIn = this.state.vInPeak;
      const gain = calc.gain;
      const vSat = calc.vSat;

      this.app.oscilloscope.timePerDiv = 0.0005;
      this.app.oscilloscope.ch1.voltsPerDiv = 1.0;
      this.app.oscilloscope.ch2.voltsPerDiv = 5.0;

      this.app.oscilloscope.setCh1Waveform((t) => {
        return vIn * Math.sin(omega * t);
      });

      this.app.oscilloscope.setCh2Waveform((t) => {
        const rawOutput = gain * vIn * Math.sin(omega * t);
        return Math.max(-vSat, Math.min(vSat, rawOutput));
      });
    }

    if (this.app.multimeter) {
      this.app.multimeter.setReading(calc.vOutActual / Math.SQRT2, 'V');
    }
  },

  logReading() {
    const calc = CircuitMath.calculateOpAmp(
      this.state.config,
      this.state.r1,
      this.state.rf,
      this.state.vInPeak,
      this.state.vSupply
    );

    const reading = {
      sno: this.state.readings.length + 1,
      config: calc.config === 'inverting' ? 'Inverting' : 'Non-Inverting',
      r1: `${calc.r1 / 1000} kΩ`,
      rf: `${calc.rf / 1000} kΩ`,
      vIn: `${calc.vInPeak} V`,
      vOut: `${calc.vOutActual} V`,
      gainTheor: calc.gain.toFixed(2),
      gainExp: (calc.vOutActual / calc.vInPeak).toFixed(2),
      sat: calc.isSaturated ? 'Yes (Clipped)' : 'No (Linear)',
      vInNum: calc.vInPeak,
      vOutNum: calc.vOutActual
    };

    this.state.readings.push(reading);
    this.renderTable();
    this.plotGraph();
    this.app.showToast(`Logged: Vin = ${reading.vIn}, Vout = ${reading.vOut}`, 'success');
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
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No readings logged yet. Adjust amplitude and click "Add Reading to Table".</td></tr>`;
      return;
    }

    tbody.innerHTML = this.state.readings.map(r => `
      <tr>
        <td>${r.sno}</td>
        <td><span class="badge ${r.config === 'Inverting' ? 'badge-info' : 'badge-warning'}">${r.config}</span></td>
        <td>${r.r1} / ${r.rf}</td>
        <td>${r.vIn}</td>
        <td><strong>${r.vOut}</strong></td>
        <td>${r.gainExp} (Theor: ${r.gainTheor})</td>
        <td><span class="badge ${r.sat.startsWith('Yes') ? 'badge-danger' : 'badge-success'}">${r.sat}</span></td>
      </tr>
    `).join('');
  },

  plotGraph() {
    if (!this.app.graphPlotter) return;
    this.app.graphPlotter.clear();
    this.app.graphPlotter.setLabels(
      `Op-Amp (${this.state.config.toUpperCase()}): Input Vin (V) vs Output Vout (V)`,
      "Input Voltage Vin (Vpk)",
      "Output Voltage Vout (Vpk)"
    );

    if (this.state.readings.length > 0) {
      const points = this.state.readings.map(r => ({
        x: r.vInNum,
        y: r.vOutNum
      }));
      this.app.graphPlotter.addSeries(`${this.state.config} Linearity`, "#38bdf8", points);
    }
  }
};
