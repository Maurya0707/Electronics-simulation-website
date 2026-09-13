/**
 * Simulink X Studyhub - Digital Multimeter & Virtual Test Instruments Engine
 * Developed by Aditya Maurya
 */

class VirtualMultimeter {
  constructor(elementPrefix = 'dmm') {
    this.prefix = elementPrefix;
    this.mode = 'DCV'; // 'DCV', 'ACV', 'DCA', 'RES', 'DIODE'
    this.range = 'AUTO';
    this.value = 0;
    this.isHold = false;
    this.isPowered = true;
    this.unit = 'V';
  }

  setMode(mode) {
    this.mode = mode;
    switch (mode) {
      case 'DCV':
      case 'ACV':
        this.unit = 'V';
        break;
      case 'DCA':
      case 'ACA':
        this.unit = 'mA';
        break;
      case 'RES':
        this.unit = 'Ω';
        break;
      case 'DIODE':
        this.unit = 'V';
        break;
    }
    this.updateDisplay();
  }

  setReading(val, customUnit) {
    if (this.isHold) return;
    this.value = val;
    if (customUnit) this.unit = customUnit;
    this.updateDisplay();
  }

  toggleHold() {
    this.isHold = !this.isHold;
    return this.isHold;
  }

  updateDisplay() {
    const screenEl = document.getElementById(`${this.prefix}-screen`);
    const unitEl = document.getElementById(`${this.prefix}-unit`);
    const modeEl = document.getElementById(`${this.prefix}-mode`);
    const holdEl = document.getElementById(`${this.prefix}-hold-badge`);

    if (!screenEl) return;

    if (!this.isPowered) {
      screenEl.textContent = '';
      return;
    }

    let displayVal = '0.000';
    if (typeof this.value === 'number') {
      if (Math.abs(this.value) >= 1000) {
        displayVal = (this.value / 1000).toFixed(3);
        if (this.unit === 'Ω') this.unit = 'kΩ';
        if (this.unit === 'mA') this.unit = 'A';
      } else if (Math.abs(this.value) < 0.01 && this.value !== 0) {
        displayVal = (this.value * 1000).toFixed(2);
        if (this.unit === 'V') this.unit = 'mV';
        if (this.unit === 'mA') this.unit = 'µA';
      } else {
        displayVal = this.value.toFixed(3);
      }
    } else {
      displayVal = String(this.value);
    }

    screenEl.textContent = displayVal;
    if (unitEl) unitEl.textContent = this.unit;
    if (modeEl) modeEl.textContent = this.mode;
    if (holdEl) holdEl.style.display = this.isHold ? 'inline-block' : 'none';
  }
}

class RegulatedPowerSupply {
  constructor() {
    this.voltage = 5.0;
    this.current = 0.0;
    this.currentLimit = 1.0; // Amperes
    this.isOn = true;
    this.isCC = false; // Constant Current mode active
  }

  setVoltage(v) {
    this.voltage = Math.max(0, Math.min(30, v));
  }

  setLoadCurrent(iA) {
    this.current = iA;
    this.isCC = this.current >= this.currentLimit;
  }

  togglePower() {
    this.isOn = !this.isOn;
    return this.isOn;
  }
}
