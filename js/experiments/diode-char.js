/**
 * Simulink X Studyhub - Experiment 2: Diode Characteristics Controller
 * Developed by Aditya Maurya
 */

const DiodeCharExperiment = {
  id: 'diode-char',
  state: {
    vSupply: 0.5,
    diodeType: 'silicon', // 'silicon', 'germanium', 'zener'
    isReverse: false,
    rSeries: 1000, // 1 kΩ
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
        <th>Bias Mode</th>
        <th>Supply Voltage (V)</th>
        <th>Diode Voltage Vd (V)</th>
        <th>Diode Current Id</th>
        <th>Dynamic Resistance rac (Ω)</th>
      </tr>
    `;
  },

  setupUI() {
    const container = document.getElementById('experiment-controls');
    if (!container) return;

    container.innerHTML = `
      <div class="control-panel-grid">
        <!-- Diode & Bias Selector -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-microchip highlight-cyan"></i> Diode Configuration</h4>
          </div>
          <div class="control-group">
            <label>Diode Semiconductor Material:</label>
            <select id="diode-type-select" class="form-select">
              <option value="silicon" selected>Silicon Diode (1N4007, Knee ~0.7V)</option>
              <option value="germanium">Germanium Diode (1N34A, Knee ~0.3V)</option>
              <option value="zener">Zener Diode (BZX55C 5.6V)</option>
            </select>
          </div>
          <div class="control-group">
            <label>Bias Connection Mode:</label>
            <div class="btn-group-toggle">
              <button id="btn-forward-bias" class="btn btn-sm ${!this.state.isReverse ? 'btn-primary' : 'btn-outline'}">
                Forward Bias (+ to Anode)
              </button>
              <button id="btn-reverse-bias" class="btn btn-sm ${this.state.isReverse ? 'btn-primary' : 'btn-outline'}">
                Reverse Bias (+ to Cathode)
              </button>
            </div>
          </div>
        </div>

        <!-- Supply Voltage Tuning -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-sliders-h highlight-cyan"></i> Voltage Source</h4>
          </div>
          <div class="control-group">
            <label>Supply Voltage: <span id="diode-v-val" class="highlight-val">${this.state.vSupply.toFixed(2)} V</span></label>
            <input type="range" id="diode-v-slider" min="0" max="${this.state.isReverse ? 15 : 2.0}" step="${this.state.isReverse ? 0.2 : 0.05}" value="${this.state.vSupply}">
            <div class="slider-ticks">
              <span>0V</span>
              <span>${this.state.isReverse ? '7.5V' : '1.0V'}</span>
              <span>${this.state.isReverse ? '15V' : '2.0V'}</span>
            </div>
          </div>
          <div class="control-group">
            <label>Current Limiting Resistor (R_series):</label>
            <span class="badge badge-info">1000 Ω (1 kΩ)</span>
          </div>
        </div>

        <!-- Real-Time Diode Metrics -->
        <div class="control-card metrics-card">
          <div class="card-header">
            <h4><i class="fas fa-tachometer-alt highlight-cyan"></i> Semiconductor Metrics</h4>
          </div>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-title">DIODE VOLTAGE (Vd)</span>
              <span id="metric-diode-vd" class="metric-value">0.00 V</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">CURRENT (Id)</span>
              <span id="metric-diode-id" class="metric-value">0.00 mA</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">DYNAMIC RESISTANCE (r_ac)</span>
              <span id="metric-diode-rac" class="metric-value">0.0 Ω</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">CONDUCTION STATE</span>
              <span id="metric-diode-state" class="metric-value">OFF</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-toolbar">
        <button id="btn-diode-log" class="btn btn-primary">
          <i class="fas fa-plus-circle"></i> Add Reading to Table
        </button>
        <button id="btn-diode-plot" class="btn btn-accent">
          <i class="fas fa-chart-line"></i> Plot Diode V-I Curve
        </button>
        <button id="btn-diode-clear-table" class="btn btn-secondary">
          <i class="fas fa-trash-alt"></i> Clear Table
        </button>
      </div>
    `;

    // Event Listeners
    const typeSelect = document.getElementById('diode-type-select');
    typeSelect.addEventListener('change', (e) => {
      this.state.diodeType = e.target.value;
      this.update();
    });

    const fwdBtn = document.getElementById('btn-forward-bias');
    const revBtn = document.getElementById('btn-reverse-bias');
    const vSlider = document.getElementById('diode-v-slider');
    const vVal = document.getElementById('diode-v-val');

    fwdBtn.addEventListener('click', () => {
      this.state.isReverse = false;
      fwdBtn.className = 'btn btn-sm btn-primary';
      revBtn.className = 'btn btn-sm btn-outline';
      vSlider.max = 2.0;
      vSlider.step = 0.05;
      this.state.vSupply = Math.min(2.0, this.state.vSupply);
      vSlider.value = this.state.vSupply;
      vVal.textContent = `${this.state.vSupply.toFixed(2)} V`;
      this.update();
    });

    revBtn.addEventListener('click', () => {
      this.state.isReverse = true;
      revBtn.className = 'btn btn-sm btn-primary';
      fwdBtn.className = 'btn btn-sm btn-outline';
      vSlider.max = 15.0;
      vSlider.step = 0.2;
      this.state.vSupply = 5.0;
      vSlider.value = this.state.vSupply;
      vVal.textContent = `${this.state.vSupply.toFixed(2)} V`;
      this.update();
    });

    vSlider.addEventListener('input', (e) => {
      this.state.vSupply = parseFloat(e.target.value);
      vVal.textContent = `${this.state.vSupply.toFixed(2)} V`;
      this.update();
    });

    document.getElementById('btn-diode-log').addEventListener('click', () => this.logReading());
    document.getElementById('btn-diode-clear-table').addEventListener('click', () => this.clearReadings());
    document.getElementById('btn-diode-plot').addEventListener('click', () => {
      this.plotGraph();
      this.app.switchMainView('graph');
    });
  },

  update() {
    const calc = CircuitMath.calculateDiode(
      this.state.vSupply,
      this.state.diodeType,
      this.state.isReverse,
      this.state.rSeries
    );

    // Update UI Metrics
    document.getElementById('metric-diode-vd').textContent = `${calc.vDiode.toFixed(3)} V`;
    const curText = this.state.isReverse ? `${calc.current_uA.toFixed(2)} µA` : `${calc.current_mA.toFixed(2)} mA`;
    document.getElementById('metric-diode-id').textContent = curText;
    document.getElementById('metric-diode-rac').textContent = `${calc.dynamicR.toFixed(1)} Ω`;

    const stateEl = document.getElementById('metric-diode-state');
    if (calc.isConduction) {
      stateEl.textContent = this.state.isReverse ? 'BREAKDOWN' : 'CONDUCTION (ON)';
      stateEl.style.color = '#10b981';
    } else {
      stateEl.textContent = 'CUT-OFF (OFF)';
      stateEl.style.color = '#94a3b8';
    }

    // Update Animated Circuit Canvas
    if (this.app.circuitCanvas) {
      this.app.circuitCanvas.updateState({
        vSupply: calc.vSupply,
        vDiode: calc.vDiode,
        current_mA: calc.current_mA,
        current_uA: calc.current_uA,
        current_A: calc.current_A,
        diodeType: calc.diodeType,
        isReverse: calc.isReverse,
        powerOn: true
      });
    }

    // Update Multimeter & Oscilloscope
    if (this.app.multimeter) {
      if (this.app.multimeter.mode === 'DCA') {
        if (this.state.isReverse) {
          this.app.multimeter.setReading(calc.current_uA, 'µA');
        } else {
          this.app.multimeter.setReading(calc.current_mA, 'mA');
        }
      } else {
        this.app.multimeter.setReading(calc.vDiode, 'V');
      }
    }
  },

  logReading() {
    const calc = CircuitMath.calculateDiode(
      this.state.vSupply,
      this.state.diodeType,
      this.state.isReverse,
      this.state.rSeries
    );

    const reading = {
      sno: this.state.readings.length + 1,
      bias: this.state.isReverse ? 'Reverse' : 'Forward',
      vSupply: calc.vSupply.toFixed(2),
      vDiode: calc.vDiode.toFixed(3),
      current: this.state.isReverse ? `${calc.current_uA.toFixed(2)} µA` : `${calc.current_mA.toFixed(2)} mA`,
      currentNum: this.state.isReverse ? calc.current_uA / 1000 : calc.current_mA,
      dynamicR: calc.dynamicR.toFixed(1)
    };

    this.state.readings.push(reading);
    this.renderTable();
    this.plotGraph();
    this.app.showToast(`Logged: Vd = ${reading.vDiode} V, Id = ${reading.current}`, 'success');
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
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No readings logged yet. Adjust voltage and click "Add Reading to Table".</td></tr>`;
      return;
    }

    tbody.innerHTML = this.state.readings.map(r => `
      <tr>
        <td>${r.sno}</td>
        <td><span class="badge ${r.bias === 'Forward' ? 'badge-info' : 'badge-warning'}">${r.bias}</span></td>
        <td>${r.vSupply} V</td>
        <td><strong>${r.vDiode} V</strong></td>
        <td><strong>${r.current}</strong></td>
        <td>${r.dynamicR} Ω</td>
      </tr>
    `).join('');
  },

  plotGraph() {
    if (!this.app.graphPlotter) return;
    this.app.graphPlotter.clear();
    this.app.graphPlotter.setLabels(
      `${this.state.diodeType.toUpperCase()} Diode V-I Characteristics`,
      "Diode Voltage Vd (Volts)",
      "Diode Current Id (mA)"
    );

    if (this.state.readings.length > 0) {
      const points = this.state.readings.map(r => ({
        x: parseFloat(r.vDiode),
        y: r.currentNum
      }));
      this.app.graphPlotter.addSeries(`${this.state.diodeType} V-I Curve`, "#38bdf8", points);
    }
  }
};
