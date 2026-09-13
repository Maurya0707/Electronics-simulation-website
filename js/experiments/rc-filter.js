/**
 * Simulink X Studyhub - Experiment 5: RC Filters & Bode Plot Controller
 * Developed by Aditya Maurya
 */

const RCFilterExperiment = {
  id: 'rc-filter',
  state: {
    type: 'lpf', // 'lpf', 'hpf'
    r: 1000,     // 1 kΩ
    c_uF: 0.1,   // 0.1 µF
    freq: 1000,  // Hz
    vInPeak: 2.0, // V
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
        <th>Frequency (Hz)</th>
        <th>Input Vin (V)</th>
        <th>Output Vout (V)</th>
        <th>Gain (Av)</th>
        <th>Gain (dB)</th>
        <th>Phase Shift (°)</th>
      </tr>
    `;
  },

  setupUI() {
    const container = document.getElementById('experiment-controls');
    if (!container) return;

    container.innerHTML = `
      <div class="control-panel-grid">
        <!-- Filter Type & Component Selection -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-wave-square highlight-cyan"></i> Filter Topology</h4>
          </div>
          <div class="control-group">
            <label>Filter Configuration:</label>
            <div class="btn-group-toggle">
              <button id="btn-filter-lpf" class="btn btn-sm ${this.state.type === 'lpf' ? 'btn-primary' : 'btn-outline'}">
                Low-Pass Filter (LPF)
              </button>
              <button id="btn-filter-hpf" class="btn btn-sm ${this.state.type === 'hpf' ? 'btn-primary' : 'btn-outline'}">
                High-Pass Filter (HPF)
              </button>
            </div>
          </div>
          <div class="control-group">
            <label>Resistor (R) & Capacitor (C):</label>
            <div class="dual-inputs">
              <select id="filter-r-select" class="form-select">
                <option value="470">470 Ω</option>
                <option value="1000" selected>1 kΩ</option>
                <option value="4700">4.7 kΩ</option>
                <option value="10000">10 kΩ</option>
              </select>
              <select id="filter-c-select" class="form-select">
                <option value="0.01">0.01 µF</option>
                <option value="0.047">0.047 µF</option>
                <option value="0.1" selected>0.1 µF</option>
                <option value="1.0">1.0 µF</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Frequency & Signal Generator -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-satellite-dish highlight-cyan"></i> Signal Generator</h4>
          </div>
          <div class="control-group">
            <label>Input Frequency: <span id="filter-f-val" class="highlight-val">${this.state.freq} Hz</span></label>
            <input type="range" id="filter-f-slider" min="50" max="20000" step="50" value="${this.state.freq}">
            <div class="slider-ticks"><span>50Hz</span><span>5kHz</span><span>10kHz</span><span>20kHz</span></div>
          </div>
          <div class="control-group">
            <label>Input Amplitude: <span class="badge badge-info">2.0 V Peak (4.0 Vpp)</span></label>
          </div>
        </div>

        <!-- Real-Time Filter Metrics -->
        <div class="control-card metrics-card">
          <div class="card-header">
            <h4><i class="fas fa-chart-line highlight-cyan"></i> Frequency Response</h4>
          </div>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-title">CUT-OFF FREQ (f_c)</span>
              <span id="metric-filter-fc" class="metric-value highlight-cyan">1591.5 Hz</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">GAIN (V_out / V_in)</span>
              <span id="metric-filter-gain" class="metric-value">0.846</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">GAIN (dB)</span>
              <span id="metric-filter-db" class="metric-value">-1.45 dB</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">PHASE SHIFT (θ)</span>
              <span id="metric-filter-phase" class="metric-value">-32.1°</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-toolbar">
        <button id="btn-filter-log" class="btn btn-primary">
          <i class="fas fa-plus-circle"></i> Add Reading to Table
        </button>
        <button id="btn-filter-sweep" class="btn btn-outline">
          <i class="fas fa-magic"></i> Auto Frequency Sweep
        </button>
        <button id="btn-filter-plot" class="btn btn-accent">
          <i class="fas fa-chart-line"></i> Plot Bode Curve
        </button>
        <button id="btn-filter-clear-table" class="btn btn-secondary">
          <i class="fas fa-trash-alt"></i> Clear Table
        </button>
      </div>
    `;

    // Event listeners
    const lpfBtn = document.getElementById('btn-filter-lpf');
    const hpfBtn = document.getElementById('btn-filter-hpf');
    const rSelect = document.getElementById('filter-r-select');
    const cSelect = document.getElementById('filter-c-select');
    const fSlider = document.getElementById('filter-f-slider');
    const fVal = document.getElementById('filter-f-val');

    lpfBtn.addEventListener('click', () => {
      this.state.type = 'lpf';
      lpfBtn.className = 'btn btn-sm btn-primary';
      hpfBtn.className = 'btn btn-sm btn-outline';
      this.update();
    });

    hpfBtn.addEventListener('click', () => {
      this.state.type = 'hpf';
      hpfBtn.className = 'btn btn-sm btn-primary';
      lpfBtn.className = 'btn btn-sm btn-outline';
      this.update();
    });

    rSelect.addEventListener('change', (e) => {
      this.state.r = parseFloat(e.target.value);
      this.update();
    });

    cSelect.addEventListener('change', (e) => {
      this.state.c_uF = parseFloat(e.target.value);
      this.update();
    });

    fSlider.addEventListener('input', (e) => {
      this.state.freq = parseFloat(e.target.value);
      fVal.textContent = `${this.state.freq} Hz`;
      this.update();
    });

    document.getElementById('btn-filter-log').addEventListener('click', () => this.logReading());
    document.getElementById('btn-filter-clear-table').addEventListener('click', () => this.clearReadings());
    document.getElementById('btn-filter-plot').addEventListener('click', () => {
      this.plotGraph();
      this.app.switchMainView('graph');
    });
    document.getElementById('btn-filter-sweep').addEventListener('click', () => this.autoSweep());
  },

  update() {
    const calc = CircuitMath.calculateRCFilter(
      this.state.type,
      this.state.r,
      this.state.c_uF,
      this.state.freq,
      this.state.vInPeak
    );

    // Update UI Metrics
    document.getElementById('metric-filter-fc').textContent = `${calc.fc} Hz`;
    document.getElementById('metric-filter-gain').textContent = calc.gain;
    document.getElementById('metric-filter-db').textContent = `${calc.gainDB} dB`;
    document.getElementById('metric-filter-phase').textContent = `${calc.phaseDeg}°`;

    // Update Circuit Canvas
    if (this.app.circuitCanvas) {
      this.app.circuitCanvas.updateState({
        type: calc.type,
        r: calc.r,
        c_uF: calc.c_uF,
        freq: calc.freq,
        vOutPeak: calc.vOutPeak,
        current_mA: (calc.vOutPeak / calc.r) * 1000,
        powerOn: true
      });
    }

    // Oscilloscope Waveforms
    if (this.app.oscilloscope) {
      const omega = 2 * Math.PI * this.state.freq;
      const vIn = this.state.vInPeak;
      const vOut = calc.vOutPeak;
      const phaseRad = (calc.phaseDeg * Math.PI) / 180;

      const periodSec = 1 / this.state.freq;
      this.app.oscilloscope.timePerDiv = periodSec / 2.5;

      this.app.oscilloscope.setCh1Waveform((t) => {
        return vIn * Math.sin(omega * t);
      });

      this.app.oscilloscope.setCh2Waveform((t) => {
        return vOut * Math.sin(omega * t + phaseRad);
      });
    }

    if (this.app.multimeter) {
      this.app.multimeter.setReading(calc.vOutPeak / Math.SQRT2, 'V');
    }
  },

  logReading() {
    const calc = CircuitMath.calculateRCFilter(
      this.state.type,
      this.state.r,
      this.state.c_uF,
      this.state.freq,
      this.state.vInPeak
    );

    const reading = {
      sno: this.state.readings.length + 1,
      freq: `${calc.freq} Hz`,
      freqNum: calc.freq,
      vIn: `${calc.vInPeak} V`,
      vOut: `${calc.vOutPeak} V`,
      gain: calc.gain,
      gainDB: calc.gainDB,
      phase: `${calc.phaseDeg}°`
    };

    this.state.readings.push(reading);
    this.renderTable();
    this.plotGraph();
    this.app.showToast(`Logged: f = ${reading.freq}, Gain = ${reading.gainDB} dB`, 'success');
  },

  autoSweep() {
    const sweepFrequencies = [50, 100, 200, 500, 800, 1000, 1500, 2000, 3000, 5000, 8000, 10000, 15000, 20000];
    sweepFrequencies.forEach(f => {
      const calc = CircuitMath.calculateRCFilter(
        this.state.type,
        this.state.r,
        this.state.c_uF,
        f,
        this.state.vInPeak
      );
      this.state.readings.push({
        sno: this.state.readings.length + 1,
        freq: `${calc.freq} Hz`,
        freqNum: calc.freq,
        vIn: `${calc.vInPeak} V`,
        vOut: `${calc.vOutPeak} V`,
        gain: calc.gain,
        gainDB: calc.gainDB,
        phase: `${calc.phaseDeg}°`
      });
    });

    this.renderTable();
    this.plotGraph();
    this.app.switchMainView('graph');
    this.app.showToast('Completed auto-frequency sweep across 50Hz - 20kHz', 'success');
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
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No readings logged yet. Sweep frequency and click "Add Reading" or "Auto Frequency Sweep".</td></tr>`;
      return;
    }

    tbody.innerHTML = this.state.readings.map(r => `
      <tr>
        <td>${r.sno}</td>
        <td><strong>${r.freq}</strong></td>
        <td>${r.vIn}</td>
        <td><strong>${r.vOut}</strong></td>
        <td>${r.gain}</td>
        <td><strong>${r.gainDB} dB</strong></td>
        <td>${r.phase}</td>
      </tr>
    `).join('');
  },

  plotGraph() {
    if (!this.app.graphPlotter) return;
    this.app.graphPlotter.clear();
    this.app.graphPlotter.setLabels(
      `Bode Magnitude Plot (${this.state.type.toUpperCase()}): Frequency (Hz) vs Gain (dB)`,
      "Frequency (Hz)",
      "Gain (dB)"
    );

    if (this.state.readings.length > 0) {
      const points = this.state.readings.map(r => ({
        x: r.freqNum,
        y: r.gainDB
      }));
      this.app.graphPlotter.addSeries(`${this.state.type.toUpperCase()} Response`, "#38bdf8", points);
    }
  }
};
