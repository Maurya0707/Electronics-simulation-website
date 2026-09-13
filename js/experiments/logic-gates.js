/**
 * Simulink X Studyhub - Experiment 7: Logic Gates & Truth Tables Controller
 * Developed by Aditya Maurya
 */

const LogicGatesExperiment = {
  id: 'logic-gates',
  state: {
    gateType: 'AND',
    inA: 0,
    inB: 0,
    readings: []
  },

  gateInfo: {
    AND: { ic: 'IC 7408 (Quad 2-Input AND)', expr: 'Y = A · B' },
    OR: { ic: 'IC 7432 (Quad 2-Input OR)', expr: 'Y = A + B' },
    NOT: { ic: 'IC 7404 (Hex Inverter NOT)', expr: 'Y = A\'' },
    NAND: { ic: 'IC 7400 (Quad 2-Input NAND)', expr: 'Y = (A · B)\'' },
    NOR: { ic: 'IC 7402 (Quad 2-Input NOR)', expr: 'Y = (A + B)\'' },
    XOR: { ic: 'IC 7486 (Quad 2-Input XOR)', expr: 'Y = A ⊕ B' },
    XNOR: { ic: 'IC 74266 (Quad 2-Input XNOR)', expr: 'Y = (A ⊕ B)\'' }
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
        <th>Logic Gate IC</th>
        <th>Input A</th>
        <th>Input B</th>
        <th>Output Y</th>
        <th>Output Voltage (V)</th>
        <th>Verification Status</th>
      </tr>
    `;
  },

  setupUI() {
    const container = document.getElementById('experiment-controls');
    if (!container) return;

    container.innerHTML = `
      <div class="control-panel-grid">
        <!-- Logic Gate Selector -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-microchip highlight-cyan"></i> TTL Logic IC</h4>
          </div>
          <div class="control-group">
            <label>Select Logic Gate:</label>
            <select id="logic-gate-select" class="form-select">
              <option value="AND" selected>AND Gate (IC 7408)</option>
              <option value="OR">OR Gate (IC 7432)</option>
              <option value="NOT">NOT Inverter Gate (IC 7404)</option>
              <option value="NAND">NAND Universal Gate (IC 7400)</option>
              <option value="NOR">NOR Universal Gate (IC 7402)</option>
              <option value="XOR">XOR Parity Gate (IC 7486)</option>
              <option value="XNOR">XNOR Equivalence Gate (IC 74266)</option>
            </select>
          </div>
          <div class="control-group">
            <span id="logic-ic-desc" class="badge badge-info">${this.gateInfo.AND.ic}</span>
            <div id="logic-expr" class="highlight-cyan mt-1" style="font-size: 1.1rem; font-family: monospace;">${this.gateInfo.AND.expr}</div>
          </div>
        </div>

        <!-- Binary Input Switches -->
        <div class="control-card">
          <div class="card-header">
            <h4><i class="fas fa-toggle-on highlight-cyan"></i> Logic Inputs (0 / 1)</h4>
          </div>
          <div class="control-group">
            <label>Input A Switch:</label>
            <div class="btn-group-toggle">
              <button id="btn-sw-a0" class="btn btn-sm ${this.state.inA === 0 ? 'btn-primary' : 'btn-outline'}">Logic 0 (0 V)</button>
              <button id="btn-sw-a1" class="btn btn-sm ${this.state.inA === 1 ? 'btn-primary' : 'btn-outline'}">Logic 1 (+5 V)</button>
            </div>
          </div>
          <div class="control-group" id="group-input-b">
            <label>Input B Switch:</label>
            <div class="btn-group-toggle">
              <button id="btn-sw-b0" class="btn btn-sm ${this.state.inB === 0 ? 'btn-primary' : 'btn-outline'}">Logic 0 (0 V)</button>
              <button id="btn-sw-b1" class="btn btn-sm ${this.state.inB === 1 ? 'btn-primary' : 'btn-outline'}">Logic 1 (+5 V)</button>
            </div>
          </div>
        </div>

        <!-- Real-Time Output State -->
        <div class="control-card metrics-card">
          <div class="card-header">
            <h4><i class="fas fa-lightbulb highlight-cyan"></i> Output State (Y)</h4>
          </div>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-title">OUTPUT LOGIC</span>
              <span id="metric-logic-out" class="metric-value">0 (LOW)</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">OUTPUT VOLTAGE</span>
              <span id="metric-logic-v" class="metric-value">0.12 V</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">LED INDICATOR</span>
              <span id="metric-logic-led" class="metric-value text-muted">DARK (OFF)</span>
            </div>
            <div class="metric-item">
              <span class="metric-title">TRUTH TABLE VERIFICATION</span>
              <span id="metric-logic-verified" class="metric-value highlight-green">MATCHED</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-toolbar">
        <button id="btn-logic-log" class="btn btn-primary">
          <i class="fas fa-plus-circle"></i> Log State to Truth Table
        </button>
        <button id="btn-logic-verify-all" class="btn btn-accent">
          <i class="fas fa-clipboard-check"></i> Auto-Verify Complete Truth Table
        </button>
        <button id="btn-logic-clear-table" class="btn btn-secondary">
          <i class="fas fa-trash-alt"></i> Clear Table
        </button>
      </div>
    `;

    // Event listeners
    const gateSelect = document.getElementById('logic-gate-select');
    gateSelect.addEventListener('change', (e) => {
      this.state.gateType = e.target.value;
      const info = this.gateInfo[this.state.gateType];
      document.getElementById('logic-ic-desc').textContent = info.ic;
      document.getElementById('logic-expr').textContent = info.expr;

      const groupB = document.getElementById('group-input-b');
      if (this.state.gateType === 'NOT') {
        groupB.style.display = 'none';
      } else {
        groupB.style.display = 'block';
      }
      this.update();
    });

    const swA0 = document.getElementById('btn-sw-a0');
    const swA1 = document.getElementById('btn-sw-a1');
    const swB0 = document.getElementById('btn-sw-b0');
    const swB1 = document.getElementById('btn-sw-b1');

    swA0.addEventListener('click', () => {
      this.state.inA = 0;
      swA0.className = 'btn btn-sm btn-primary';
      swA1.className = 'btn btn-sm btn-outline';
      this.update();
    });

    swA1.addEventListener('click', () => {
      this.state.inA = 1;
      swA1.className = 'btn btn-sm btn-primary';
      swA0.className = 'btn btn-sm btn-outline';
      this.update();
    });

    swB0.addEventListener('click', () => {
      this.state.inB = 0;
      swB0.className = 'btn btn-sm btn-primary';
      swB1.className = 'btn btn-sm btn-outline';
      this.update();
    });

    swB1.addEventListener('click', () => {
      this.state.inB = 1;
      swB1.className = 'btn btn-sm btn-primary';
      swB0.className = 'btn btn-sm btn-outline';
      this.update();
    });

    document.getElementById('btn-logic-log').addEventListener('click', () => this.logReading());
    document.getElementById('btn-logic-verify-all').addEventListener('click', () => this.autoVerifyAll());
    document.getElementById('btn-logic-clear-table').addEventListener('click', () => this.clearReadings());
  },

  update() {
    const calc = CircuitMath.calculateLogicGate(
      this.state.gateType,
      this.state.inA,
      this.state.inB
    );

    // Update UI Metrics
    const outEl = document.getElementById('metric-logic-out');
    outEl.textContent = calc.output === 1 ? '1 (HIGH)' : '0 (LOW)';
    outEl.style.color = calc.output === 1 ? '#10b981' : '#94a3b8';

    document.getElementById('metric-logic-v').textContent = `${calc.outVoltage} V`;

    const ledEl = document.getElementById('metric-logic-led');
    if (calc.ledGlow) {
      ledEl.textContent = 'GLOWING (RED)';
      ledEl.style.color = '#ef4444';
    } else {
      ledEl.textContent = 'DARK (OFF)';
      ledEl.style.color = '#64748b';
    }

    // Update Circuit Canvas
    if (this.app.circuitCanvas) {
      this.app.circuitCanvas.updateState({
        gateType: calc.gateType,
        inA: calc.inA,
        inB: calc.inB,
        output: calc.output,
        current_mA: calc.output === 1 ? 15 : 0.2,
        powerOn: true
      });
    }

    // Multimeter
    if (this.app.multimeter) {
      this.app.multimeter.setReading(calc.outVoltage, 'V');
    }
  },

  logReading() {
    const calc = CircuitMath.calculateLogicGate(
      this.state.gateType,
      this.state.inA,
      this.state.inB
    );

    const reading = {
      sno: this.state.readings.length + 1,
      gate: calc.gateType,
      inA: calc.inA,
      inB: calc.gateType === 'NOT' ? '—' : calc.inB,
      out: calc.output,
      outV: `${calc.outVoltage} V`,
      status: 'VERIFIED'
    };

    this.state.readings.push(reading);
    this.renderTable();
    this.app.showToast(`Logged State: A=${calc.inA}, B=${reading.inB} => Y=${calc.output}`, 'success');
  },

  autoVerifyAll() {
    this.state.readings = [];
    if (this.state.gateType === 'NOT') {
      [0, 1].forEach(a => {
        const calc = CircuitMath.calculateLogicGate('NOT', a, 0);
        this.state.readings.push({
          sno: this.state.readings.length + 1,
          gate: 'NOT',
          inA: a,
          inB: '—',
          out: calc.output,
          outV: `${calc.outVoltage} V`,
          status: 'VERIFIED'
        });
      });
    } else {
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(([a, b]) => {
        const calc = CircuitMath.calculateLogicGate(this.state.gateType, a, b);
        this.state.readings.push({
          sno: this.state.readings.length + 1,
          gate: this.state.gateType,
          inA: a,
          inB: b,
          out: calc.output,
          outV: `${calc.outVoltage} V`,
          status: 'VERIFIED'
        });
      });
    }
    this.renderTable();
    this.app.showToast(`Verified complete Truth Table for ${this.state.gateType} gate!`, 'success');
  },

  clearReadings() {
    this.state.readings = [];
    this.renderTable();
    this.app.showToast('Truth table cleared', 'info');
  },

  renderTable() {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;

    if (this.state.readings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No truth table entries yet. Click "Log State" or "Auto-Verify Complete Truth Table".</td></tr>`;
      return;
    }

    tbody.innerHTML = this.state.readings.map(r => `
      <tr>
        <td>${r.sno}</td>
        <td><span class="badge badge-info">${r.gate}</span></td>
        <td><strong>${r.inA}</strong></td>
        <td><strong>${r.inB}</strong></td>
        <td><span class="badge ${r.out === 1 ? 'badge-success' : 'badge-secondary'}">${r.out}</span></td>
        <td>${r.outV}</td>
        <td><span class="badge badge-success"><i class="fas fa-check"></i> ${r.status}</span></td>
      </tr>
    `).join('');
  }
};
