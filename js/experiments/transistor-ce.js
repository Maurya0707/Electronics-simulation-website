/**
 * Simulink X Studyhub - Experiment 4: BJT CE Characteristics Controller
 * Developed by Aditya Maurya
 */

const TransistorCEExperiment = {
  id: 'transistor-ce',
  state: {
    mode: 'output', // 'input', 'output'
    vBB: 1.5,
    vCC: 5.0,
    rB: 100000, // 100 kΩ
    rC: 1000,   // 1 kΩ
    beta: 150,
    targetIb_uA: 40,
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
    if (this.state.mode === 'output') {
      thead.innerHTML = `
        <tr>
          <th>S.No</th>
          <th>V_CE (V)</th>
          <th>I_C (mA)</th>
          <th>I_B (µA)</th>
          <th>V_BE (V)</th>
          <th>Operating Region</th>
        </tr>
      `;
    } else {
      thead.innerHTML = `
        <tr>
          <th>S.No</th>
          <th>V_BE (V)</th>
          <th>I_B (µA)</th>
          <th>V_CE (V)</th>
          <th>I_C (mA)</th>
          <th>Operating Region</th>
        </tr>
      `;
    }
  },

  setupUI() {
    const container = document.getElementById('experiment-controls');
    if (!container) return;

    container.innerHTML = `
      <div class="control-panel-grid">
        <!-- Mode & Transistor Settings -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-project-diagram highlight-cyan"></i> Study Mode</h4>
          </div>
          <div class="control-group">
            <label>Characteristic Mode:</label>
            <div class="btn-group-toggle">
              <button id="btn-bjt-output" class="btn btn-sm ${this.state.mode === 'output' ? 'btn-primary' : 'btn-outline'}">
                Output (IC vs VCE)
              </button>
              <button id="btn-bjt-input" class="btn btn-sm ${this.state.mode === 'input' ? 'btn-primary' : 'btn-outline'}">
                Input (IB vs VBE)
              </button>
            </div>
          </div>
          <div class="control-group">
            <label>Target Base Current (I_B):</label>
            <select id="bjt-ib-select" class="form-select" ${this.state.mode !== 'output' ? 'disabled' : ''}>
              <option value="20">20 µA</option>
              <option value="40" selected>40 µA</option>
              <option value="60">60 µA</option>
              <option value="80">80 µA</option>
              <option value="100">100 µA</option>
            </select>
          </div>
        </div>

        <!-- Power Supplies Adjustments -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-sliders-h highlight-cyan"></i> Dual Bias Controls</h4>
          </div>
          <div class="control-group">
            <label>Collector Supply (V_CC): <span id="bjt-vcc-val" class="highlight-val">${this.state.vCC.toFixed(1)} V</span></label>
            <input type="range" id="bjt-vcc-slider" min="0" max="15" step="0.2" value="${this.state.vCC}">
            <div class="slider-ticks"><span>0V</span><span>7.5V</span><span>15V</span></div>
          </div>
          <div class="control-group">
            <label>Base Supply (V_BB): <span id="bjt-vbb-val" class="highlight-val">${this.state.vBB.toFixed(2)} V</span></label>
            <input type="range" id="bjt-vbb-slider" min="0" max="5.0" step="0.05" value="${this.state.vBB}">
            <div class="slider-ticks"><span>0V</span><span>2.5V</span><span>5.0V</span></div>
          </div>
        </div>

        <!-- Real-Time Transistor Metrics -->
        <div class="control-card metrics-card">
          <div class="card-header">
            <h4><i class="fas fa-microchip highlight-cyan"></i> Operating Point (Q-Point)</h4>
          </div>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-title">OPERATING REGION</span>
              <span id="metric-bjt-region" class="metric-value highlight-cyan">ACTIVE</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">BASE CURRENT (I_B)</span>
              <span id="metric-bjt-ib" class="metric-value">40.0 µA</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">COLLECTOR CURRENT (I_C)</span>
              <span id="metric-bjt-ic" class="metric-value">6.00 mA</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">COLLECTOR-EMITTER (V_CE)</span>
              <span id="metric-bjt-vce" class="metric-value">4.00 V</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-toolbar">
        <button id="btn-bjt-log" class="btn btn-primary">
          <i class="fas fa-plus-circle"></i> Add Reading to Table
        </button>
        <button id="btn-bjt-sweep" class="btn btn-outline">
          <i class="fas fa-magic"></i> Auto-Sweep V_CE (0 to 12V)
        </button>
        <button id="btn-bjt-plot" class="btn btn-accent">
          <i class="fas fa-chart-line"></i> Plot Transistor Curves
        </button>
        <button id="btn-bjt-clear-table" class="btn btn-secondary">
          <i class="fas fa-trash-alt"></i> Clear Table
        </button>
      </div>
    `;

    // Event listeners
    const outBtn = document.getElementById('btn-bjt-output');
    const inBtn = document.getElementById('btn-bjt-input');
    const ibSelect = document.getElementById('bjt-ib-select');
    const vccSlider = document.getElementById('bjt-vcc-slider');
    const vccVal = document.getElementById('bjt-vcc-val');
    const vbbSlider = document.getElementById('bjt-vbb-slider');
    const vbbVal = document.getElementById('bjt-vbb-val');

    outBtn.addEventListener('click', () => {
      this.state.mode = 'output';
      outBtn.className = 'btn btn-sm btn-primary';
      inBtn.className = 'btn btn-sm btn-outline';
      ibSelect.disabled = false;
      this.setupTableHeaders();
      this.syncBaseCurrentToTarget();
      this.update();
    });

    inBtn.addEventListener('click', () => {
      this.state.mode = 'input';
      inBtn.className = 'btn btn-sm btn-primary';
      outBtn.className = 'btn btn-sm btn-outline';
      ibSelect.disabled = true;
      this.setupTableHeaders();
      this.update();
    });

    ibSelect.addEventListener('change', (e) => {
      this.state.targetIb_uA = parseFloat(e.target.value);
      this.syncBaseCurrentToTarget();
      this.update();
    });

    vccSlider.addEventListener('input', (e) => {
      this.state.vCC = parseFloat(e.target.value);
      vccVal.textContent = `${this.state.vCC.toFixed(1)} V`;
      this.update();
    });

    vbbSlider.addEventListener('input', (e) => {
      this.state.vBB = parseFloat(e.target.value);
      vbbVal.textContent = `${this.state.vBB.toFixed(2)} V`;
      this.update();
    });

    document.getElementById('btn-bjt-log').addEventListener('click', () => this.logReading());
    document.getElementById('btn-bjt-clear-table').addEventListener('click', () => this.clearReadings());
    document.getElementById('btn-bjt-plot').addEventListener('click', () => {
      this.plotGraph();
      this.app.switchMainView('graph');
    });
    document.getElementById('btn-bjt-sweep').addEventListener('click', () => this.autoSweep());

    this.syncBaseCurrentToTarget();
  },

  syncBaseCurrentToTarget() {
    const targetIb_A = this.state.targetIb_uA * 1e-6;
    this.state.vBB = targetIb_A * this.state.rB + 0.68;
    const vbbSlider = document.getElementById('bjt-vbb-slider');
    const vbbVal = document.getElementById('bjt-vbb-val');
    if (vbbSlider) vbbSlider.value = this.state.vBB;
    if (vbbVal) vbbVal.textContent = `${this.state.vBB.toFixed(2)} V`;
  },

  update() {
    const calc = CircuitMath.calculateBJT(
      this.state.vBB,
      this.state.vCC,
      this.state.rB,
      this.state.rC,
      this.state.beta
    );

    // Update UI Metrics
    const regEl = document.getElementById('metric-bjt-region');
    regEl.textContent = calc.region.toUpperCase();
    if (calc.region === 'Active') regEl.style.color = '#38bdf8';
    else if (calc.region === 'Saturation') regEl.style.color = '#10b981';
    else regEl.style.color = '#ef4444';

    document.getElementById('metric-bjt-ib').textContent = `${calc.Ib_uA.toFixed(1)} µA`;
    document.getElementById('metric-bjt-ic').textContent = `${calc.Ic_mA.toFixed(2)} mA`;
    document.getElementById('metric-bjt-vce').textContent = `${calc.Vce.toFixed(2)} V`;

    // Update Circuit Canvas
    if (this.app.circuitCanvas) {
      this.app.circuitCanvas.updateState({
        vBB: calc.vBB,
        vCC: calc.vCC,
        Ib_uA: calc.Ib_uA,
        Ic_mA: calc.Ic_mA,
        current_mA: calc.Ic_mA,
        powerOn: true
      });
    }

    if (this.app.multimeter) {
      if (this.app.multimeter.mode === 'DCA') {
        this.app.multimeter.setReading(calc.Ic_mA, 'mA');
      } else {
        this.app.multimeter.setReading(calc.Vce, 'V');
      }
    }
  },

  logReading() {
    const calc = CircuitMath.calculateBJT(
      this.state.vBB,
      this.state.vCC,
      this.state.rB,
      this.state.rC,
      this.state.beta
    );

    const reading = {
      sno: this.state.readings.length + 1,
      mode: this.state.mode,
      vbe: `${calc.Vbe.toFixed(3)} V`,
      ib: `${calc.Ib_uA.toFixed(1)} µA`,
      vce: `${calc.Vce.toFixed(2)} V`,
      ic: `${calc.Ic_mA.toFixed(2)} mA`,
      region: calc.region,
      xVal: this.state.mode === 'output' ? calc.Vce : calc.Vbe,
      yVal: this.state.mode === 'output' ? calc.Ic_mA : calc.Ib_uA,
      seriesKey: `Ib = ${calc.Ib_uA.toFixed(0)} µA`
    };

    this.state.readings.push(reading);
    this.renderTable();
    this.plotGraph();
    this.app.showToast(`Logged: VCE = ${reading.vce}, IC = ${reading.ic}`, 'success');
  },

  autoSweep() {
    const savedVcc = this.state.vCC;
    for (let v = 0; v <= 12; v += 0.5) {
      const calc = CircuitMath.calculateBJT(this.state.vBB, v, this.state.rB, this.state.rC, this.state.beta);
      this.state.readings.push({
        sno: this.state.readings.length + 1,
        mode: 'output',
        vbe: `${calc.Vbe.toFixed(3)} V`,
        ib: `${calc.Ib_uA.toFixed(1)} µA`,
        vce: `${calc.Vce.toFixed(2)} V`,
        ic: `${calc.Ic_mA.toFixed(2)} mA`,
        region: calc.region,
        xVal: calc.Vce,
        yVal: calc.Ic_mA,
        seriesKey: `Ib = ${calc.Ib_uA.toFixed(0)} µA`
      });
    }
    this.state.vCC = savedVcc;
    this.renderTable();
    this.plotGraph();
    this.app.switchMainView('graph');
    this.app.showToast(`Completed auto-sweep for Ib = ${this.state.targetIb_uA} µA`, 'success');
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
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No readings logged yet. Adjust supplies and click "Add Reading" or "Auto-Sweep".</td></tr>`;
      return;
    }

    if (this.state.mode === 'output') {
      tbody.innerHTML = this.state.readings.map(r => `
        <tr>
          <td>${r.sno}</td>
          <td><strong>${r.vce}</strong></td>
          <td><strong>${r.ic}</strong></td>
          <td>${r.ib}</td>
          <td>${r.vbe}</td>
          <td><span class="badge ${r.region === 'Active' ? 'badge-info' : (r.region === 'Saturation' ? 'badge-success' : 'badge-danger')}">${r.region}</span></td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = this.state.readings.map(r => `
        <tr>
          <td>${r.sno}</td>
          <td><strong>${r.vbe}</strong></td>
          <td><strong>${r.ib}</strong></td>
          <td>${r.vce}</td>
          <td><strong>${r.ic}</strong></td>
          <td><span class="badge ${r.region === 'Active' ? 'badge-info' : 'badge-danger'}">${r.region}</span></td>
        </tr>
      `).join('');
    }
  },

  plotGraph() {
    if (!this.app.graphPlotter) return;
    this.app.graphPlotter.clear();

    if (this.state.mode === 'output') {
      this.app.graphPlotter.setLabels(
        "BJT CE Output Characteristics: V_CE (V) vs I_C (mA)",
        "Collector-Emitter Voltage V_CE (V)",
        "Collector Current I_C (mA)"
      );
    } else {
      this.app.graphPlotter.setLabels(
        "BJT CE Input Characteristics: V_BE (V) vs I_B (µA)",
        "Base-Emitter Voltage V_BE (V)",
        "Base Current I_B (µA)"
      );
    }

    if (this.state.readings.length > 0) {
      const groups = {};
      this.state.readings.forEach(r => {
        if (!groups[r.seriesKey]) groups[r.seriesKey] = [];
        groups[r.seriesKey].push({ x: r.xVal, y: r.yVal });
      });

      const colors = ['#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
      let cIdx = 0;
      for (const [key, pts] of Object.entries(groups)) {
        this.app.graphPlotter.addSeries(key, colors[cIdx % colors.length], pts);
        cIdx++;
      }
    }
  }
};
