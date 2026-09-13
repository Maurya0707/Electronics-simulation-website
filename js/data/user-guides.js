/**
 * Simulink X Studyhub - Step-by-Step User Simulation Manuals
 * Developed by Aditya Maurya
 */

const EXPERIMENT_USER_GUIDES = {
  "ohms-law": {
    expId: "ohms-law",
    title: "Ohm's Law & Circuit Analysis Simulation Guide",
    steps: [
      {
        step: 1,
        title: "Select Nominal Resistor Value",
        desc: "Choose a test resistor from the dropdown (e.g. 100 Ω or 220 Ω). Choose conductor material (Copper, Nichrome, or Aluminum) and set ambient temperature."
      },
      {
        step: 2,
        title: "Power ON the Circuit",
        desc: "Ensure the DC power supply button indicates 'Power OFF' (meaning the circuit is currently powered ON and active). Watch the green LED indicator glow."
      },
      {
        step: 3,
        title: "Vary Supply Voltage",
        desc: "Slide the Supply Voltage slider starting from 0 V and increase in steps of 2 V (e.g., 2V, 4V, 6V, 8V, 10V, 12V... up to 20V)."
      },
      {
        step: 4,
        title: "Log Data Points",
        desc: "After each voltage adjustment, click 'Add Reading to Table'. Observe current (I), voltmeter reading (V), and computed resistance logged in real time."
      },
      {
        step: 5,
        title: "Plot V-I Characteristics",
        desc: "Click 'Plot Linear V-I Fit'. The screen will automatically switch to the X-Y Plotter showing your experimental data points with a dashed linear regression line."
      },
      {
        step: 6,
        title: "Verify Slope Resistance & Generate Report",
        desc: "Check that the slope ΔV/ΔI matches your nominal resistance. Click 'Lab Report' at the top to generate and print your official signed laboratory sheet."
      }
    ]
  },

  "diode-char": {
    expId: "diode-char",
    title: "P-N Junction & Zener Diode Simulation Guide",
    steps: [
      {
        step: 1,
        title: "Choose Diode Type & Bias",
        desc: "Select Silicon (1N4007, knee ~0.7V), Germanium (1N34A, knee ~0.3V), or Zener Diode (5.6V). Select 'Forward Bias' first."
      },
      {
        step: 2,
        title: "Sweep Forward Voltage",
        desc: "Gradually adjust the DC voltage slider in small 0.1V steps from 0.0V to 1.5V. Notice that current remains almost zero until reaching the knee voltage!"
      },
      {
        step: 3,
        title: "Log Conduction Data Points",
        desc: "Click 'Add Reading to Table' at 0.2V, 0.4V, 0.6V, 0.7V, 0.8V, 1.0V, 1.5V to capture the exponential turn-on curve."
      },
      {
        step: 4,
        title: "Test Reverse Bias & Zener Breakdown",
        desc: "Switch to 'Reverse Bias' mode. Sweep voltage from 0V up to 15V. If Zener is selected, watch the sharp avalanche breakdown occur at 5.6V!"
      },
      {
        step: 5,
        title: "Plot Characteristic V-I Curve",
        desc: "Click 'Plot Diode V-I Curve'. View the plotted points and verify knee voltage and dynamic resistance r_ac = ΔVd/ΔId."
      }
    ]
  },

  "rectifier": {
    expId: "rectifier",
    title: "Rectifiers & Filter Circuits Simulation Guide",
    steps: [
      {
        step: 1,
        title: "Select Rectifier Architecture",
        desc: "Choose between 'Full-Wave Bridge (4 Diodes)' or 'Half-Wave (1 Diode)'. Set secondary AC voltage (default 12V RMS)."
      },
      {
        step: 2,
        title: "Inspect Waveforms on Oscilloscope",
        desc: "Switch workbench display to 'Dual-Trace DSO'. Yellow trace (CH1) shows AC secondary sine wave; Cyan trace (CH2) shows pulsating DC output."
      },
      {
        step: 3,
        title: "Record Unfiltered Rectifier Metrics",
        desc: "With Filter OFF, click 'Add Reading to Table'. Note the theoretical ripple factor (1.21 for Half-Wave, 0.482 for Full-Wave)."
      },
      {
        step: 4,
        title: "Activate Shunt Capacitor Filter",
        desc: "Toggle 'Filter ON' checkbox. Select capacitor values (10µF, 100µF, 470µF, 1000µF) and notice how the ripple voltage (Vr p-p) smoothes out!"
      },
      {
        step: 5,
        title: "Plot Ripple Factor vs Capacitance",
        desc: "Log readings for each capacitor value, then click 'Plot Ripple vs Filter Capacitance' to visualize the ripple reduction curve."
      }
    ]
  },

  "transistor-ce": {
    expId: "transistor-ce",
    title: "BJT Common Emitter (CE) Simulation Guide",
    steps: [
      {
        step: 1,
        title: "Choose Study Mode",
        desc: "Select 'Output (IC vs VCE)' to plot output characteristics, or 'Input (IB vs VBE)' for input base junction characteristics."
      },
      {
        step: 2,
        title: "Set Constant Base Current (I_B)",
        desc: "For output characteristics, choose a base current (e.g. 20µA, 40µA, 60µA, 80µA, or 100µA). Base supply V_BB automatically synchronizes."
      },
      {
        step: 3,
        title: "Vary Collector-Emitter Supply (V_CC)",
        desc: "Increase V_CC slider from 0V to 12V. Watch the operating state transition from Saturation (<0.2V) into the linear Active region."
      },
      {
        step: 4,
        title: "One-Click Auto-Sweep",
        desc: "Click 'Auto-Sweep V_CE (0 to 12V)' to automatically sweep and log 25 data points across the curve, or click 'Add Reading' manually."
      },
      {
        step: 5,
        title: "Repeat for Multiple Base Currents",
        desc: "Change I_B to 40µA and click 'Auto-Sweep'. Then change to 60µA and sweep again. Click 'Plot Transistor Curves' to see the complete family of output curves!"
      }
    ]
  },

  "rc-filter": {
    expId: "rc-filter",
    title: "RC Filters & Bode Plot Simulation Guide",
    steps: [
      {
        step: 1,
        title: "Select Filter Mode",
        desc: "Choose 'Low-Pass Filter (LPF)' or 'High-Pass Filter (HPF)'. Set standard resistor (e.g. 1 kΩ) and capacitor (e.g. 0.1 µF)."
      },
      {
        step: 2,
        title: "Calculate Theoretical Cut-off Frequency",
        desc: "Check the calculated cut-off frequency fc = 1/(2·π·R·C) (for 1kΩ and 0.1µF, fc ≈ 1591.5 Hz)."
      },
      {
        step: 3,
        title: "Observe Phase Shift on Oscilloscope",
        desc: "Switch display to 'Dual-Trace DSO'. At low frequencies in LPF, input and output are in phase. Near fc, output lags by 45° and amplitude drops to 0.707!"
      },
      {
        step: 4,
        title: "Run Full Frequency Sweep",
        desc: "Click 'Auto Frequency Sweep' to test frequencies from 50 Hz to 20 kHz automatically, or sweep manually and click 'Add Reading to Table'."
      },
      {
        step: 5,
        title: "Plot Bode Magnitude Curve",
        desc: "Click 'Plot Bode Curve'. The X-Y Plotter will display the semi-logarithmic Gain (dB) vs Frequency curve showing the -3dB bandwidth and -20dB/decade roll-off."
      }
    ]
  },

  "opamp": {
    expId: "opamp",
    title: "Op-Amp 741 Inverting & Non-Inverting Simulation Guide",
    steps: [
      {
        step: 1,
        title: "Select Feedback Configuration",
        desc: "Choose 'Inverting (Av = -Rf/R1)' or 'Non-Inverting (Av = 1 + Rf/R1)'. Set input resistor R1 (10 kΩ) and feedback resistor Rf (20 kΩ)."
      },
      {
        step: 2,
        title: "Check Gain & Phase Relationship",
        desc: "For inverting with Rf=20k and R1=10k, Gain Av = -2 (180° phase inversion). For non-inverting, Gain Av = +3 (0° in-phase)."
      },
      {
        step: 3,
        title: "Observe Amplified Waveforms on DSO",
        desc: "Switch to 'Dual-Trace DSO'. Notice Channel 1 (Yellow) is the 1.0 Vpk input, and Channel 2 (Cyan) is the amplified 2.0 Vpk inverted output."
      },
      {
        step: 4,
        title: "Observe Saturation Clipping",
        desc: "Increase input amplitude Vin slider above 7.0 V. The output attempts to reach 14+ V but flat-tops at ±13.5V due to ±15V power supply rails!"
      },
      {
        step: 5,
        title: "Plot Vin vs Vout Linearity",
        desc: "Log several readings at different input amplitudes and click 'Plot Vin vs Vout Linearity' to observe the linear operating region vs clipping."
      }
    ]
  },

  "logic-gates": {
    expId: "logic-gates",
    title: "Digital Logic Gates & Truth Table Simulation Guide",
    steps: [
      {
        step: 1,
        title: "Select TTL Logic Gate IC",
        desc: "Choose from AND (7408), OR (7432), NOT (7404), NAND (7400), NOR (7402), XOR (7486), or XNOR (74266)."
      },
      {
        step: 2,
        title: "Set Input Logic Levels",
        desc: "Click 'Logic 0 (0 V)' or 'Logic 1 (+5 V)' buttons for Input A and Input B. Observe the animated schematic update switches and paths."
      },
      {
        step: 3,
        title: "Observe Output State & LED",
        desc: "Check output indicator LED. If output is Logic 1, the red LED glows brightly and DMM reads ~4.85 V. If Logic 0, LED is dark."
      },
      {
        step: 4,
        title: "Log Current State",
        desc: "Click 'Log State to Truth Table' to record the current combination in your observation sheet."
      },
      {
        step: 5,
        title: "Auto-Verify Complete Truth Table",
        desc: "Click 'Auto-Verify Complete Truth Table' to test all binary permutations (00, 01, 10, 11) with instant pass/fail validation!"
      }
    ]
  },

  "timer-555": {
    expId: "timer-555",
    title: "555 Astable Multivibrator Simulation Guide",
    steps: [
      {
        step: 1,
        title: "Configure Timing Resistors & Capacitor",
        desc: "Set timing resistor RA (10 kΩ), RB (47 kΩ potentiometer), and capacitor C (1.0 µF). Set V_CC to +9V."
      },
      {
        step: 2,
        title: "Observe Live Flashing Output LED",
        desc: "Watch the red output LED on the schematic blink in real-time at the exact calculated oscillation frequency f = 1.44/((RA+2RB)·C)!"
      },
      {
        step: 3,
        title: "Inspect Dual Traces on Oscilloscope",
        desc: "Switch to 'Dual-Trace DSO'. Channel 1 shows the square wave output at Pin 3. Channel 2 shows capacitor voltage charging exponentially between 1/3 Vcc and 2/3 Vcc."
      },
      {
        step: 4,
        title: "Vary Resistor RB & Observe Duty Cycle",
        desc: "Adjust RB slider and click 'Add Reading to Table'. Notice how changing RB affects high time, low time, and duty cycle D = (RA+RB)/(RA+2RB)."
      },
      {
        step: 5,
        title: "Plot Duty Cycle vs RB",
        desc: "Click 'Plot Duty Cycle vs R_B' to visualize the non-linear relationship on the scientific graph plotter."
      }
    ]
  }
};
