/**
 * Simulink X Studyhub - Accurate Circuit Mathematics & Physics Engine
 * Developed by Aditya Maurya
 */

const CircuitMath = {
  // Thermal voltage at 300K (Room Temperature)
  V_THERMAL: 0.02585, // 25.85 mV

  /**
   * 1. Ohm's Law & Circuit Calculations
   */
  calculateOhmsLaw(voltage, resistance, wireMaterial = 'copper', tempC = 25) {
    // Temperature coefficient of resistance
    const alphaMap = {
      copper: 0.00393,
      aluminum: 0.00403,
      nichrome: 0.0004,
      carbon: -0.0005
    };
    const alpha = alphaMap[wireMaterial] || 0.00393;
    const effectiveR = resistance * (1 + alpha * (tempC - 20));
    
    // Prevent divide by zero
    const safeR = Math.max(0.01, effectiveR);
    const current = voltage / safeR;
    const power = voltage * current;
    const conductance = 1 / safeR;

    return {
      voltage: Number(voltage.toFixed(3)),
      current: Number(current.toFixed(5)), // Amperes
      current_mA: Number((current * 1000).toFixed(3)), // Milliamperes
      nominalR: resistance,
      effectiveR: Number(safeR.toFixed(2)),
      power: Number(power.toFixed(4)),
      conductance: Number(conductance.toFixed(5)),
      wireMaterial,
      tempC
    };
  },

  /**
   * 2. P-N Junction & Zener Diode Shockley Modeling
   */
  calculateDiode(vSupply, diodeType = 'silicon', isReverse = false, rSeries = 1000) {
    const diodeParams = {
      silicon: { Is: 1e-9, eta: 1.5, Vknee: 0.70, Vz: 100, Rz: 10 },
      germanium: { Is: 1e-6, eta: 1.0, Vknee: 0.28, Vz: 50, Rz: 15 },
      zener: { Is: 2e-9, eta: 1.5, Vknee: 0.70, Vz: 5.6, Rz: 8.5 }
    };

    const p = diodeParams[diodeType] || diodeParams.silicon;
    const Vt = this.V_THERMAL;

    let Vd = 0;
    let Id = 0; // Current through diode in Amperes

    if (!isReverse) {
      // Forward Bias: solve vSupply = Id * rSeries + Vd
      // We use Newton-Raphson to solve for Vd accurately
      let vGuess = Math.min(vSupply, p.Vknee);
      for (let i = 0; i < 30; i++) {
        const I_shockley = p.Is * (Math.exp(Math.min(40, vGuess / (p.eta * Vt))) - 1);
        const f = vGuess + I_shockley * rSeries - vSupply;
        const df = 1 + (p.Is / (p.eta * Vt)) * Math.exp(Math.min(40, vGuess / (p.eta * Vt))) * rSeries;
        const nextV = vGuess - f / df;
        if (Math.abs(nextV - vGuess) < 1e-6) {
          vGuess = nextV;
          break;
        }
        vGuess = Math.max(0, Math.min(vSupply, nextV));
      }
      Vd = Math.max(0, vGuess);
      Id = (vSupply - Vd) / rSeries;
      if (Id < 0) Id = 0;
    } else {
      // Reverse Bias
      const absV = Math.abs(vSupply);
      if (diodeType === 'zener' && absV >= p.Vz) {
        // Zener Breakdown Region
        const vBreakover = absV - p.Vz;
        Id = -(vBreakover / (p.Rz + rSeries) + p.Is);
        Vd = -(p.Vz + Math.abs(Id) * p.Rz);
      } else {
        // Normal reverse leakage
        const iLeak = p.Is * (1 - Math.exp(-absV / (p.eta * Vt)));
        Vd = -absV;
        Id = -iLeak;
      }
    }

    // Dynamic resistance calculation
    const dynamicR = (p.eta * Vt) / (Math.abs(Id) + p.Is);

    return {
      vSupply,
      vDiode: Number(Vd.toFixed(4)),
      current_A: Id,
      current_mA: Number((Id * 1000).toFixed(4)),
      current_uA: Number((Id * 1000000).toFixed(3)),
      vResistor: Number((vSupply - Math.abs(Vd)).toFixed(4)),
      dynamicR: Number(dynamicR.toFixed(2)),
      isConduction: Math.abs(Vd) >= (isReverse ? p.Vz : p.Vknee),
      diodeType,
      isReverse
    };
  },

  /**
   * 3. Rectifier (Half-Wave & Full-Wave Bridge with Filter)
   */
  calculateRectifier(vRMS = 12, freq = 50, type = 'full-wave', filterCapUF = 100, rLoad = 1000, filterEnabled = true) {
    const Vm = Math.SQRT2 * vRMS;
    const diodeDrop = type === 'full-wave' ? 1.4 : 0.7; // 2 diodes conduct in bridge, 1 in half-wave
    const Vpeak = Math.max(0, Vm - diodeDrop);

    let Vdc = 0;
    let Vrms_out = 0;
    let rippleFactor = 0;
    let rippleVpp = 0;
    let efficiency = 0;
    const rippleFreq = type === 'full-wave' ? 2 * freq : freq;

    if (!filterEnabled || filterCapUF <= 0) {
      // Unfiltered
      if (type === 'half-wave') {
        Vdc = Vpeak / Math.PI;
        Vrms_out = Vpeak / 2;
        rippleFactor = 1.21;
        efficiency = 40.6;
        rippleVpp = Vpeak;
      } else {
        Vdc = (2 * Vpeak) / Math.PI;
        Vrms_out = Vpeak / Math.SQRT2;
        rippleFactor = 0.482;
        efficiency = 81.2;
        rippleVpp = Vpeak;
      }
    } else {
      // With Shunt Capacitor Filter
      const C = filterCapUF * 1e-6;
      // Peak-to-peak ripple voltage Vr = Vpeak / (f_ripple * R_L * C)
      const idealVr = Vpeak / (rippleFreq * rLoad * C);
      rippleVpp = Math.min(Vpeak, idealVr);
      Vdc = Math.max(0, Vpeak - rippleVpp / 2);
      Vrms_out = Math.sqrt(Math.pow(Vdc, 2) + Math.pow(rippleVpp / (2 * Math.sqrt(3)), 2));
      rippleFactor = rippleVpp / (2 * Math.sqrt(3) * Math.max(0.1, Vdc));
      efficiency = Math.min(96, (Vdc / Vrms_out) * 100);
    }

    const Idc = Vdc / rLoad;

    return {
      vRMS,
      Vm: Number(Vm.toFixed(2)),
      Vpeak: Number(Vpeak.toFixed(2)),
      Vdc: Number(Vdc.toFixed(2)),
      Vrms_out: Number(Vrms_out.toFixed(2)),
      rippleFactor: Number(rippleFactor.toFixed(4)),
      rippleVpp: Number(rippleVpp.toFixed(2)),
      efficiency: Number(efficiency.toFixed(1)),
      Idc_mA: Number((Idc * 1000).toFixed(2)),
      rippleFreq,
      type,
      filterEnabled,
      filterCapUF,
      rLoad,
      freq
    };
  },

  /**
   * 4. BJT Common Emitter (CE) Input & Output
   */
  calculateBJT(vBB, vCC, rB = 100000, rC = 1000, beta = 150) {
    const Vbe_on = 0.68;
    const Vce_sat = 0.18;
    const EarlyVoltage = 100;

    // Input circuit: VBB = IB * RB + VBE
    let Ib = 0;
    let Vbe = 0;
    if (vBB > Vbe_on) {
      Ib = (vBB - Vbe_on) / rB;
      Vbe = Vbe_on + 0.026 * Math.log(Math.max(1, (Ib * 1e6) / 10));
    } else {
      Ib = 1e-9 * (Math.exp(vBB / 0.026) - 1);
      Vbe = vBB;
    }

    // Output circuit: VCC = IC * RC + VCE
    // Potential active current
    const Ic_active = beta * Ib;
    const Ic_sat = Math.max(0, (vCC - Vce_sat) / rC);

    let Ic = 0;
    let Vce = 0;
    let region = "Cutoff";

    if (Ib <= 1e-7) {
      region = "Cutoff";
      Ic = 1e-7; // Small leakage ICEO
      Vce = vCC;
    } else if (Ic_active >= Ic_sat) {
      region = "Saturation";
      Ic = Ic_sat;
      Vce = Vce_sat;
    } else {
      region = "Active";
      // Account for Early Effect
      const earlyFactor = 1 + (vCC - Ic_active * rC) / EarlyVoltage;
      Ic = Ic_active * earlyFactor;
      Vce = Math.max(Vce_sat, vCC - Ic * rC);
    }

    const dynamicInputR = Ib > 0 ? (0.026 / Ib) : 1e6;
    const dynamicOutputR = EarlyVoltage / Math.max(1e-6, Ic);

    return {
      vBB,
      vCC,
      rB,
      rC,
      beta,
      Ib_uA: Number((Ib * 1e6).toFixed(2)),
      Ic_mA: Number((Ic * 1000).toFixed(2)),
      Vbe: Number(Vbe.toFixed(3)),
      Vce: Number(Vce.toFixed(3)),
      region,
      hie: Number(dynamicInputR.toFixed(1)),
      hoe_inv_k: Number((dynamicOutputR / 1000).toFixed(1))
    };
  },

  /**
   * 5. Passive RC Filter Frequency Response
   */
  calculateRCFilter(type = 'lpf', r = 1000, c_uF = 0.1, freq = 1000, vInPeak = 2.0) {
    const C = c_uF * 1e-6;
    const fc = 1 / (2 * Math.PI * r * C);
    const ratio = freq / fc;

    let gain = 0;
    let phaseDeg = 0;

    if (type === 'lpf') {
      gain = 1 / Math.sqrt(1 + Math.pow(ratio, 2));
      phaseDeg = -Math.atan(ratio) * (180 / Math.PI);
    } else {
      // HPF
      gain = ratio / Math.sqrt(1 + Math.pow(ratio, 2));
      phaseDeg = 90 - Math.atan(ratio) * (180 / Math.PI);
    }

    const gainDB = 20 * Math.log10(Math.max(1e-5, gain));
    const vOutPeak = vInPeak * gain;

    return {
      type,
      r,
      c_uF,
      freq,
      fc: Number(fc.toFixed(1)),
      gain: Number(gain.toFixed(4)),
      gainDB: Number(gainDB.toFixed(2)),
      phaseDeg: Number(phaseDeg.toFixed(1)),
      vInPeak,
      vOutPeak: Number(vOutPeak.toFixed(3))
    };
  },

  /**
   * 6. Operational Amplifier (IC 741)
   */
  calculateOpAmp(config = 'inverting', r1 = 10000, rf = 20000, vInPeak = 1.0, vSupply = 15) {
    let idealGain = 0;
    let phaseShift = 0;

    if (config === 'inverting') {
      idealGain = -(rf / r1);
      phaseShift = 180;
    } else {
      idealGain = 1 + (rf / r1);
      phaseShift = 0;
    }

    const vSat = vSupply - 1.5; // ~13.5V for 15V supply
    const vOutTheoretical = Math.abs(idealGain) * vInPeak;
    const isSaturated = vOutTheoretical > vSat;
    const vOutActual = Math.min(vSat, vOutTheoretical);

    return {
      config,
      r1,
      rf,
      gain: Number(idealGain.toFixed(2)),
      gainMag: Number(Math.abs(idealGain).toFixed(2)),
      phaseShift,
      vInPeak,
      vSupply,
      vSat: Number(vSat.toFixed(2)),
      vOutTheoretical: Number(vOutTheoretical.toFixed(2)),
      vOutActual: Number(vOutActual.toFixed(2)),
      isSaturated
    };
  },

  /**
   * 7. Logic Gates
   */
  calculateLogicGate(gateType = 'AND', inA = 0, inB = 0) {
    const a = inA ? 1 : 0;
    const b = inB ? 1 : 0;
    let out = 0;

    switch (gateType.toUpperCase()) {
      case 'AND': out = (a & b); break;
      case 'OR': out = (a | b); break;
      case 'NOT': out = (a ? 0 : 1); break;
      case 'NAND': out = (!(a & b)) ? 1 : 0; break;
      case 'NOR': out = (!(a | b)) ? 1 : 0; break;
      case 'XOR': out = (a ^ b); break;
      case 'XNOR': out = ((a ^ b) ? 0 : 1); break;
      default: out = 0;
    }

    const outVoltage = out ? 4.85 : 0.12; // Realistic TTL levels

    return {
      gateType: gateType.toUpperCase(),
      inA: a,
      inB: b,
      output: out,
      outVoltage: Number(outVoltage.toFixed(2)),
      ledGlow: out === 1
    };
  },

  /**
   * 8. 555 Timer Astable Multivibrator
   */
  calculate555Timer(rA_k = 10, rB_k = 47, c_uF = 1.0, vCC = 9) {
    const Ra = rA_k * 1000;
    const Rb = rB_k * 1000;
    const C = c_uF * 1e-6;

    const tHigh = 0.693 * (Ra + Rb) * C;
    const tLow = 0.693 * Rb * C;
    const period = tHigh + tLow;
    const frequency = 1 / Math.max(1e-6, period);
    const dutyCycle = (tHigh / period) * 100;

    const vUpperThresh = (2 / 3) * vCC;
    const vLowerTrigger = (1 / 3) * vCC;

    return {
      rA_k,
      rB_k,
      c_uF,
      vCC,
      tHigh_ms: Number((tHigh * 1000).toFixed(2)),
      tLow_ms: Number((tLow * 1000).toFixed(2)),
      period_ms: Number((period * 1000).toFixed(2)),
      frequency_Hz: Number(frequency.toFixed(2)),
      dutyCycle: Number(dutyCycle.toFixed(1)),
      vUpperThresh: Number(vUpperThresh.toFixed(2)),
      vLowerTrigger: Number(vLowerTrigger.toFixed(2))
    };
  }
};
