/**
 * Simulink X Studyhub - Core Application Controller
 * Developed by Aditya Maurya
 */

class SimulinkStudyhubApp {
  constructor() {
    this.activeExperimentId = 'ohms-law';
    this.experiments = {
      'ohms-law': OhmsLawExperiment,
      'diode-char': DiodeCharExperiment,
      'rectifier': RectifierExperiment,
      'transistor-ce': TransistorCEExperiment,
      'rc-filter': RCFilterExperiment,
      'opamp': OpAmpExperiment,
      'logic-gates': LogicGatesExperiment,
      'timer-555': Timer555Experiment
    };

    this.activeTab = 'simulation'; // 'simulation', 'theory', 'viva'
    this.activeView = 'circuit';    // 'circuit', 'oscilloscope', 'graph'
    this.quizAnswers = {};
    this.quizScore = null;

    this.init();
  }

  init() {
    // Initialize Engines
    this.circuitCanvas = new CircuitCanvas('circuit-canvas');
    this.oscilloscope = new VirtualOscilloscope('dso-canvas');
    this.graphPlotter = new ScientificGraphPlotter('graph-canvas');
    this.multimeter = new VirtualMultimeter('dmm');

    this.setupNavigation();
    this.setupTabs();
    this.setupInstrumentsPanel();
    this.setupReportModal();
    this.setupUserManualModal();
    this.setupEventListeners();

    // Load initial experiment
    this.loadExperiment('ohms-law');
  }

  setupNavigation() {
    // Dropdown selector
    const selector = document.getElementById('experiment-selector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        this.loadExperiment(e.target.value);
      });
    }

    // Quick links in header, footer, & chips
    document.querySelectorAll('[data-exp-id]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const expId = link.getAttribute('data-exp-id');
        this.loadExperiment(expId);
        this.switchTab('simulation');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Close mobile menu if open
        const navMenu = document.getElementById('navbar-menu');
        if (navMenu) navMenu.classList.remove('show');
      });
    });

    // Mobile nav toggle
    const navToggle = document.getElementById('navbar-toggle');
    const navMenu = document.getElementById('navbar-menu');
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
      });
    }
  }

  setupTabs() {
    // Both header navbar links and tab buttons
    const triggers = document.querySelectorAll('.tab-btn, .tab-nav-trigger');
    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-tab');
        if (tab) {
          this.switchTab(tab);
          // Close mobile menu if open
          const navMenu = document.getElementById('navbar-menu');
          if (navMenu) navMenu.classList.remove('show');
        }
      });
    });
  }

  switchTab(tab) {
    this.activeTab = tab;

    // Update all tab button states
    document.querySelectorAll('.tab-btn, .tab-nav-trigger').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tab);
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tab}`);
    });

    if (tab === 'simulation') {
      setTimeout(() => {
        this.resizeActiveCanvas();
      }, 50);
    } else if (tab === 'theory') {
      this.renderTheoryTab();
    } else if (tab === 'viva') {
      this.renderVivaTab();
    }
  }

  setupInstrumentsPanel() {
    // View Switcher Buttons (Circuit / Oscilloscope / Graph)
    const viewButtons = document.querySelectorAll('.view-toggle-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        this.switchMainView(view);
      });
    });

    // Oscilloscope controls
    const dsoRunBtn = document.getElementById('dso-run-btn');
    if (dsoRunBtn) {
      dsoRunBtn.addEventListener('click', () => {
        const isRunning = this.oscilloscope.toggleRun();
        dsoRunBtn.innerHTML = isRunning ? '<i class="fas fa-pause"></i> STOP' : '<i class="fas fa-play"></i> RUN';
        dsoRunBtn.className = isRunning ? 'btn btn-sm btn-outline-warning' : 'btn btn-sm btn-success';
      });
    }

    const dsoTimeSelect = document.getElementById('dso-timebase-select');
    if (dsoTimeSelect) {
      dsoTimeSelect.addEventListener('change', (e) => {
        this.oscilloscope.timePerDiv = parseFloat(e.target.value);
      });
    }

    const dsoCh1VDiv = document.getElementById('dso-ch1-vdiv');
    if (dsoCh1VDiv) {
      dsoCh1VDiv.addEventListener('change', (e) => {
        this.oscilloscope.ch1.voltsPerDiv = parseFloat(e.target.value);
      });
    }

    const dsoCh2VDiv = document.getElementById('dso-ch2-vdiv');
    if (dsoCh2VDiv) {
      dsoCh2VDiv.addEventListener('change', (e) => {
        this.oscilloscope.ch2.voltsPerDiv = parseFloat(e.target.value);
      });
    }

    // Multimeter mode buttons
    document.querySelectorAll('.dmm-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.id === 'dmm-hold-btn') return;
        document.querySelectorAll('.dmm-mode-btn').forEach(b => {
          if (b.id !== 'dmm-hold-btn') b.classList.remove('active');
        });
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        this.multimeter.setMode(mode);

        // Re-trigger active experiment update to display relevant unit
        if (this.experiments[this.activeExperimentId]) {
          this.experiments[this.activeExperimentId].update();
        }
      });
    });

    const dmmHoldBtn = document.getElementById('dmm-hold-btn');
    if (dmmHoldBtn) {
      dmmHoldBtn.addEventListener('click', () => {
        const held = this.multimeter.toggleHold();
        dmmHoldBtn.classList.toggle('active', held);
        const badge = document.getElementById('dmm-hold-badge');
        if (badge) badge.style.display = held ? 'inline-block' : 'none';
      });
    }

    // Graph Download & CSV Export
    const btnDownloadGraph = document.getElementById('btn-download-graph');
    if (btnDownloadGraph) {
      btnDownloadGraph.addEventListener('click', () => {
        if (this.graphPlotter) this.graphPlotter.downloadImage();
      });
    }

    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => this.exportTableToCSV());
    }
  }

  switchMainView(view) {
    this.activeView = view;
    const circuitView = document.getElementById('view-circuit');
    const dsoView = document.getElementById('view-oscilloscope');
    const graphView = document.getElementById('view-graph');
    const dsoBar = document.querySelector('.dso-controls-bar');

    if (circuitView) circuitView.style.display = view === 'circuit' ? 'block' : 'none';
    if (dsoView) dsoView.style.display = view === 'oscilloscope' ? 'block' : 'none';
    if (graphView) graphView.style.display = view === 'graph' ? 'block' : 'none';

    // Show DSO knobs when viewing DSO or Oscilloscope
    if (dsoBar) {
      dsoBar.style.display = view === 'oscilloscope' ? 'flex' : 'none';
    }

    // Update button states
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });

    setTimeout(() => {
      this.resizeActiveCanvas();
    }, 50);
  }

  resizeActiveCanvas() {
    if (this.activeView === 'circuit' && this.circuitCanvas) this.circuitCanvas.resizeCanvas();
    if (this.activeView === 'oscilloscope' && this.oscilloscope) this.oscilloscope.resizeCanvas();
    if (this.activeView === 'graph' && this.graphPlotter) this.graphPlotter.resizeCanvas();
  }

  loadExperiment(expId) {
    if (!this.experiments[expId]) return;

    this.activeExperimentId = expId;

    // Update Dropdown selector
    const selector = document.getElementById('experiment-selector');
    if (selector && selector.value !== expId) {
      selector.value = expId;
    }

    // Update Header Badge and Title
    const manual = LAB_MANUALS[expId];
    if (manual) {
      document.getElementById('exp-header-title').textContent = manual.title;
      document.getElementById('exp-category-badge').textContent = manual.category;
    }

    // Inform Circuit Canvas
    if (this.circuitCanvas) {
      this.circuitCanvas.setExperiment(expId);
    }

    // Reset Observation Table
    const tbody = document.getElementById('table-body');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">Ready. Adjust circuit controls to log data points.</td></tr>`;
    }

    // Initialize Experiment Controller
    const expController = this.experiments[expId];
    expController.init(this);

    // Render the Step-by-Step User Manual Card for this experiment
    this.renderStepByStepGuide();

    // Default to Circuit Schematic view on load
    this.switchMainView('circuit');

    // Refresh active tab if in theory or viva
    if (this.activeTab === 'theory') this.renderTheoryTab();
    if (this.activeTab === 'viva') this.renderVivaTab();

    this.showToast(`Loaded: ${manual.title}`, 'info');
  }

  renderStepByStepGuide() {
    const guide = EXPERIMENT_USER_GUIDES[this.activeExperimentId];
    const container = document.getElementById('simulation-guide-container');
    if (!guide || !container) return;

    container.innerHTML = `
      <div class="guide-card">
        <div class="guide-card-header">
          <div class="guide-title">
            <i class="fas fa-compass highlight-cyan"></i>
            <span>Step-by-Step User Manual: ${guide.title}</span>
          </div>
          <button id="btn-toggle-guide" class="btn btn-sm btn-outline">
            <i class="fas fa-chevron-up" id="guide-chevron"></i> Toggle Guide
          </button>
        </div>
        <div class="guide-steps-list" id="guide-steps-body">
          ${guide.steps.map(s => `
            <div class="guide-step-item">
              <div class="step-badge">${s.step}</div>
              <div class="step-content">
                <div class="step-title">${s.title}</div>
                <div class="step-desc">${s.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const toggleBtn = document.getElementById('btn-toggle-guide');
    const bodyEl = document.getElementById('guide-steps-body');
    const chevron = document.getElementById('guide-chevron');

    if (toggleBtn && bodyEl && chevron) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = bodyEl.style.display === 'none';
        bodyEl.style.display = isHidden ? 'grid' : 'none';
        chevron.className = isHidden ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
      });
    }
  }

  renderTheoryTab() {
    const manual = LAB_MANUALS[this.activeExperimentId];
    const container = document.getElementById('tab-theory-content');
    if (!manual || !container) return;

    container.innerHTML = `
      <div class="manual-container">
        <div class="manual-section">
          <h3><i class="fas fa-bullseye highlight-cyan"></i> Aim of the Experiment</h3>
          <p class="lead">${manual.aim}</p>
        </div>

        <div class="manual-section">
          <h3><i class="fas fa-tools highlight-cyan"></i> Apparatus Required</h3>
          <ul class="apparatus-list">
            ${manual.apparatus.map(item => `<li><i class="fas fa-check-circle text-success"></i> ${item}</li>`).join('')}
          </ul>
        </div>

        <div class="manual-section">
          <h3><i class="fas fa-book-open highlight-cyan"></i> Theoretical Principle</h3>
          <div class="theory-text">${manual.theory.replace(/\n\n/g, '<br><br>')}</div>
        </div>

        <div class="manual-section">
          <h3><i class="fas fa-square-root-alt highlight-cyan"></i> Mathematical Governing Formulas</h3>
          <div class="formulas-grid">
            ${manual.formulas.map(f => `
              <div class="formula-card">
                <span class="formula-name">${f.name}</span>
                <code class="formula-expr">${f.expr}</code>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="manual-section">
          <h3><i class="fas fa-list-ol highlight-cyan"></i> Step-by-Step Procedure</h3>
          <ol class="procedure-list">
            ${manual.procedure.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>

        <div class="manual-section">
          <h3><i class="fas fa-shield-alt highlight-cyan"></i> Laboratory Precautions</h3>
          <ul class="precautions-list">
            ${manual.precautions.map(p => `<li><i class="fas fa-exclamation-triangle text-warning"></i> ${p}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  renderVivaTab() {
    const questions = VIVA_QUESTIONS[this.activeExperimentId] || [];
    const container = document.getElementById('tab-viva-content');
    if (!container) return;

    this.quizAnswers = {};
    this.quizScore = null;

    container.innerHTML = `
      <div class="viva-container">
        <div class="viva-header">
          <div>
            <h3><i class="fas fa-graduation-cap highlight-cyan"></i> Engineering Viva Voce & Conceptual Quiz</h3>
            <p class="text-muted">Test your core theoretical and practical understanding. Formatted as per B.Tech lab examinations.</p>
          </div>
          <div id="viva-score-box" class="viva-score-box" style="display:none;">
            <span class="score-label">YOUR SCORE</span>
            <span id="viva-score-num" class="score-num">0 / 5</span>
          </div>
        </div>

        <div class="viva-questions-list">
          ${questions.map((item, qIdx) => `
            <div class="viva-card" id="viva-card-${qIdx}">
              <div class="viva-q-title">
                <span class="q-number">Q${qIdx + 1}.</span>
                <span>${item.q}</span>
              </div>
              <div class="viva-options">
                ${item.options.map((opt, optIdx) => `
                  <label class="viva-option-label" id="opt-label-${qIdx}-${optIdx}">
                    <input type="radio" name="viva-q-${qIdx}" value="${optIdx}" data-q="${qIdx}">
                    <span class="opt-text">${opt}</span>
                  </label>
                `).join('')}
              </div>
              <div class="viva-explanation" id="viva-exp-${qIdx}" style="display: none;">
                <strong>Explanation:</strong> ${item.explanation}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="viva-actions">
          <button id="btn-submit-viva" class="btn btn-primary btn-lg">
            <i class="fas fa-paper-plane"></i> Submit Answers & View Results
          </button>
          <button id="btn-reset-viva" class="btn btn-secondary">
            <i class="fas fa-redo"></i> Reset Quiz
          </button>
        </div>
      </div>
    `;

    // Event listeners for radio buttons
    container.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const qIdx = parseInt(e.target.getAttribute('data-q'));
        const optIdx = parseInt(e.target.value);
        this.quizAnswers[qIdx] = optIdx;

        // Visual selection
        const card = document.getElementById(`viva-card-${qIdx}`);
        card.querySelectorAll('.viva-option-label').forEach(lbl => lbl.classList.remove('selected'));
        document.getElementById(`opt-label-${qIdx}-${optIdx}`).classList.add('selected');
      });
    });

    document.getElementById('btn-submit-viva').addEventListener('click', () => this.evaluateViva());
    document.getElementById('btn-reset-viva').addEventListener('click', () => this.renderVivaTab());
  }

  evaluateViva() {
    const questions = VIVA_QUESTIONS[this.activeExperimentId] || [];
    let correctCount = 0;

    questions.forEach((item, qIdx) => {
      const selected = this.quizAnswers[qIdx];
      const explanationEl = document.getElementById(`viva-exp-${qIdx}`);
      if (explanationEl) explanationEl.style.display = 'block';

      item.options.forEach((_, optIdx) => {
        const labelEl = document.getElementById(`opt-label-${qIdx}-${optIdx}`);
        if (!labelEl) return;

        if (optIdx === item.answer) {
          labelEl.classList.add('opt-correct');
        } else if (selected === optIdx && selected !== item.answer) {
          labelEl.classList.add('opt-incorrect');
        }
      });

      if (selected === item.answer) {
        correctCount++;
      }
    });

    // Show score box
    const scoreBox = document.getElementById('viva-score-box');
    const scoreNum = document.getElementById('viva-score-num');
    if (scoreBox && scoreNum) {
      scoreBox.style.display = 'block';
      scoreNum.textContent = `${correctCount} / ${questions.length}`;
      scoreNum.style.color = correctCount >= 3 ? '#10b981' : '#ef4444';
    }

    this.showToast(`Quiz completed! You scored ${correctCount}/${questions.length}`, correctCount >= 3 ? 'success' : 'warning');
  }

  exportTableToCSV() {
    const expController = this.experiments[this.activeExperimentId];
    if (!expController || !expController.state.readings || expController.state.readings.length === 0) {
      this.showToast('No observation readings to export', 'warning');
      return;
    }

    const readings = expController.state.readings;
    const headers = Object.keys(readings[0]).filter(k => !['xVal', 'yVal', 'seriesKey', 'currentNum', 'freqNum', 'vInNum', 'vOutNum', 'capVal', 'rbNum', 'dutyNum'].includes(k));
    const csvRows = [headers.join(',')];

    readings.forEach(row => {
      const values = headers.map(header => {
        const val = row[header];
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(csvData);
    link.download = `Simulink_Studyhub_${this.activeExperimentId}_readings.csv`;
    link.click();
    this.showToast('Observation data exported to CSV', 'success');
  }

  setupReportModal() {
    const modal = document.getElementById('report-modal');
    const btnOpenReport = document.getElementById('btn-generate-report');
    const btnCloseModal = document.getElementById('btn-close-report-modal');
    const btnPrintReport = document.getElementById('btn-print-report');

    if (btnOpenReport && modal) {
      btnOpenReport.addEventListener('click', () => {
        this.populateReport();
        modal.classList.add('show');
      });
    }

    if (btnCloseModal && modal) {
      btnCloseModal.addEventListener('click', () => {
        modal.classList.remove('show');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
      });
    }

    if (btnPrintReport) {
      btnPrintReport.addEventListener('click', () => {
        window.print();
      });
    }
  }

  populateReport() {
    const manual = LAB_MANUALS[this.activeExperimentId];
    const reportContent = document.getElementById('report-printable-area');
    if (!manual || !reportContent) return;

    const studentName = document.getElementById('report-student-name')?.value || 'Aditya Maurya';
    const rollNo = document.getElementById('report-roll-no')?.value || '2026/BTECH/ECE/042';
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    let tableHTML = '';
    const tableEl = document.getElementById('table-body');
    if (tableEl) {
      tableHTML = `
        <table class="report-table">
          <thead>
            ${document.getElementById('table-head')?.innerHTML || ''}
          </thead>
          <tbody>
            ${tableEl.innerHTML}
          </tbody>
        </table>
      `;
    }

    reportContent.innerHTML = `
      <div class="report-header">
        <div class="report-brand">SIMULINK X STUDYHUB VIRTUAL ENGINEERING LABORATORY</div>
        <div class="report-title">PRACTICAL LABORATORY RECORD REPORT</div>
        <div class="report-meta-grid">
          <div><strong>Student Name:</strong> ${studentName}</div>
          <div><strong>Roll / Reg No:</strong> ${rollNo}</div>
          <div><strong>Experiment:</strong> ${manual.title}</div>
          <div><strong>Date:</strong> ${dateStr}</div>
        </div>
      </div>

      <div class="report-body">
        <h4>1. AIM</h4>
        <p>${manual.aim}</p>

        <h4>2. APPARATUS</h4>
        <ul>${manual.apparatus.map(item => `<li>${item}</li>`).join('')}</ul>

        <h4>3. FORMULAS & GOVERNING EQUATIONS</h4>
        <ul>${manual.formulas.map(f => `<li><strong>${f.name}:</strong> ${f.expr}</li>`).join('')}</ul>

        <h4>4. OBSERVATION TABLE</h4>
        ${tableHTML}

        <h4>5. RESULT & VERIFICATION</h4>
        <p>The circuit experiment for <strong>${manual.title}</strong> was successfully simulated on the Simulink X Studyhub Virtual Workbench. The experimental observations are in rigorous agreement with theoretical circuit principles.</p>

        <div class="report-signatures">
          <div class="sig-box">Student Signature</div>
          <div class="sig-box">Faculty Evaluator Signature</div>
        </div>
      </div>
    `;
  }

  setupUserManualModal() {
    const modal = document.getElementById('user-manual-modal');
    const btnOpen = document.getElementById('btn-open-user-manual');
    const btnClose = document.getElementById('btn-close-user-manual-modal');

    if (btnOpen && modal) {
      btnOpen.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('show');
      });
    }

    if (btnClose && modal) {
      btnClose.addEventListener('click', () => {
        modal.classList.remove('show');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
      });
    }
  }

  setupEventListeners() {
    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
      }
    });

    // Fullscreen toggle
    const btnFullscreen = document.getElementById('btn-fullscreen-toggle');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Auto resize canvases on window resize
    window.addEventListener('resize', () => {
      this.resizeActiveCanvas();
    });
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : (type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle')}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.simulinkApp = new SimulinkStudyhubApp();
});
