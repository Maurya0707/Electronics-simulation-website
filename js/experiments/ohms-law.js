/**
 * Simulink X Studyhub - Experiment 1: Ohm's Law Controller
 * Developed by Aditya Maurya
 */

const OhmsLawExperiment = {
  id: 'ohms-law',
  state: {
    voltage: 5.0,
    nominalR: 100,
    wireMaterial: 'copper',
    tempC: 25,
    powerOn: true,
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
        <th>Voltage (V)</th>
        <th>Current (mA)</th>
        <th>Calculated R (Ω)</th>
        <th>Power (W)</th>
      </tr>
    `;
  },

  setupUI() {
    const container = document.getElementById('experiment-controls');
    if (!container) return;

    container.innerHTML = `
      <div class="control-panel-grid">
        <!-- Power Supply Control -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-bolt highlight-cyan"></i> Regulated DC Power Supply</h4>
            <button id="ohms-pwr-toggle" class="btn btn-sm ${this.state.powerOn ? 'btn-danger' : 'btn-success'}">
              ${this.state.powerOn ? 'Power OFF' : 'Power ON'}
            </button>
          </div>
          <div class="control-group">
            <label>Supply Voltage: <span id="ohms-v-val" class="highlight-val">${this.state.voltage.toFixed(1)} V</span></label>
            <input type="range" id="ohms-v-slider" min="0" max="30" step="0.5" value="${this.state.voltage}">
            <div class="slider-ticks"><span>0V</span><span>15V</span><span>30V</span></div>
          </div>
        </div>

        <!-- Load Resistor & Material -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-microchip highlight-cyan"></i> Resistor Properties</h4>
          </div>
          <div class="control-group">
            <label>Test Resistance (R): <span id="ohms-r-val" class="highlight-val">${this.state.nominalR} Ω</span></label>
            <select id="ohms-r-select" class="form-select">
              <option value="50">50 Ω (Power Resistor)</option>
              <option value="100" selected>100 Ω (Standard)</option>
              <option value="220">220 Ω (Color: Red-Red-Brown)</option>
              <option value="470">470 Ω (Color: Yellow-Violet-Brown)</option>
              <option value="1000">1000 Ω (1 kΩ)</option>
            </select>
          </div>
          <div class="control-group">
            <label>Conductor Material & Temperature:</label>
            <div class="dual-inputs">
              <select id="ohms-mat-select" class="form-select">
                <option value="copper" selected>Copper Wire</option>
                <option value="nichrome">Nichrome Wire (Low Temp Coeff)</option>
                <option value="aluminum">Aluminum Wire</option>
              </select>
              <input type="number" id="ohms-temp-input" class="form-control" value="25" min="0" max="120" title="Temp (°C)">
              <span class="input-suffix">°C</span>
            </div>
          </div>
        </div>

        <!-- Live Status Metrics -->
        <div class="control-card metrics-card">
          <div class="card-header">
            <h4><i class="fas fa-tachometer-alt highlight-cyan"></i> Circuit Readouts</h4>
            <span class="badge ${this.state.powerOn ? 'badge-live' : 'badge-idle'}">
              ${this.state.powerOn ? 'CIRCUIT ACTIVE' : 'OPEN CIRCUIT'}
            </span>
          </div>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-title">VOLTAGE (V)</span>
              <span id="metric-ohms-v" class="metric-value">5.00 V</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">CURRENT (I)</span>
              <span id="metric-ohms-i" class="metric-value">50.00 mA</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">EFFECTIVE R</span>
              <span id="metric-ohms-reff" class="metric-value">100.0 Ω</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">POWER (P)</span>
              <span id="metric-ohms-p" class="metric-value">0.25 W</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-toolbar">
        <button id="btn-ohms-log" class="btn btn-primary">
          <i class="fas fa-plus-circle"></i> Add Reading to Table
        </button>
        <button id="btn-ohms-plot" class="btn btn-accent">
          <i class="fas fa-chart-line"></i> Plot Linear V-I Fit
        </button>
        <button id="btn-ohms-clear-table" class="btn btn-secondary">
          <i class="fas fa-trash-alt"></i> Clear Table
        </button>
      </div>
    `;

    // Event listeners
    const vSlider = document.getElementById('ohms-v-slider');
    const vVal = document.getElementById('ohms-v-val');
    vSlider.addEventListener('input', (e) => {
      this.state.voltage = parseFloat(e.target.value);
      vVal.textContent = `${this.state.voltage.toFixed(1)} V`;
      this.update();
    });

    const rSelect = document.getElementById('ohms-r-select');
    rSelect.addEventListener('change', (e) => {
      this.state.nominalR = parseFloat(e.target.value);
      document.getElementById('ohms-r-val').textContent = `${this.state.nominalR} Ω`;
      this.update();
    });

    const matSelect = document.getElementById('ohms-mat-select');
    matSelect.addEventListener('change', (e) => {
      this.state.wireMaterial = e.target.value;
      this.update();
    });

    const tempInput = document.getElementById('ohms-temp-input');
    tempInput.addEventListener('input', (e) => {
      this.state.tempC = parseFloat(e.target.value) || 25;
      this.update();
    });

    const pwrBtn = document.getElementById('ohms-pwr-toggle');
    pwrBtn.addEventListener('click', () => {
      this.state.powerOn = !this.state.powerOn;
      pwrBtn.textContent = this.state.powerOn ? 'Power OFF' : 'Power ON';
      pwrBtn.className = `btn btn-sm ${this.state.powerOn ? 'btn-danger' : 'btn-success'}`;
      this.update();
    });

    document.getElementById('btn-ohms-log').addEventListener('click', () => this.logReading());
    document.getElementById('btn-ohms-clear-table').addEventListener('click', () => this.clearReadings());
    document.getElementById('btn-ohms-plot').addEventListener('click', () => {
      this.plotGraph();
      this.app.switchMainView('graph');
    });
  },

  update() {
    const calc = CircuitMath.calculateOhmsLaw(
      this.state.powerOn ? this.state.voltage : 0,
      this.state.nominalR,
      this.state.wireMaterial,
      this.state.tempC
    );

    // Update UI metrics
    document.getElementById('metric-ohms-v').textContent = `${calc.voltage.toFixed(2)} V`;
    document.getElementById('metric-ohms-i').textContent = `${calc.current_mA.toFixed(2)} mA`;
    document.getElementById('metric-ohms-reff').textContent = `${calc.effectiveR.toFixed(1)} Ω`;
    document.getElementById('metric-ohms-p').textContent = `${calc.power.toFixed(3)} W`;

    // Update Animated Circuit Canvas
    if (this.app.circuitCanvas) {
      this.app.circuitCanvas.updateState({
        voltage: calc.voltage,
        current_mA: calc.current_mA,
        current_A: calc.current,
        nominalR: calc.nominalR,
        powerOn: this.state.powerOn
      });
    }

    // Update Multimeter & Oscilloscope
    if (this.app.multimeter) {
      if (this.app.multimeter.mode === 'DCA') {
        this.app.multimeter.setReading(calc.current_mA, 'mA');
      } else if (this.app.multimeter.mode === 'RES') {
        this.app.multimeter.setReading(calc.effectiveR, 'Ω');
      } else {
        this.app.multimeter.setReading(calc.voltage, 'V');
      }
    }

    if (this.app.oscilloscope) {
      this.app.oscilloscope.setCh1Waveform(() => calc.voltage);
      this.app.oscilloscope.setCh2Waveform(() => calc.current_mA / 10);
    }
  },

  logReading() {
    const calc = CircuitMath.calculateOhmsLaw(
      this.state.powerOn ? this.state.voltage : 0,
      this.state.nominalR,
      this.state.wireMaterial,
      this.state.tempC
    );

    const calcR = calc.current > 0 ? (calc.voltage / calc.current).toFixed(2) : '∞';
    const reading = {
      sno: this.state.readings.length + 1,
      voltage: calc.voltage.toFixed(2),
      current: calc.current_mA.toFixed(2),
      calcR: calcR,
      power: calc.power.toFixed(3)
    };

    this.state.readings.push(reading);
    this.renderTable();
    this.plotGraph();
    this.app.showToast(`Logged: V = ${reading.voltage} V, I = ${reading.current} mA`, 'success');
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
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No readings logged yet. Adjust voltage and click "Add Reading to Table".</td></tr>`;
      return;
    }

    tbody.innerHTML = this.state.readings.map(r => `
      <tr>
        <td>${r.sno}</td>
        <td><strong>${r.voltage}</strong></td>
        <td><strong>${r.current}</strong></td>
        <td>${r.calcR}</td>
        <td>${r.power}</td>
      </tr>
    `).join('');
  },

  plotGraph() {
    if (!this.app.graphPlotter) return;
    this.app.graphPlotter.clear();
    this.app.graphPlotter.setLabels("Ohm's Law: Voltage (V) vs Current (mA)", "Voltage V (Volts)", "Current I (mA)");

    if (this.state.readings.length > 0) {
      const points = this.state.readings.map(r => ({
        x: parseFloat(r.voltage),
        y: parseFloat(r.current)
      }));
      this.app.graphPlotter.addSeries("V-I Experimental Points", "#38bdf8", points);
    }
  }
};
