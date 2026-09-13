/**
 * Simulink X Studyhub - B.Tech Engineering Viva Voce Questions & Answers
 * Developed by Aditya Maurya
 */

const VIVA_QUESTIONS = {
  "ohms-law": [
    {
      q: "Under what physical condition does Ohm's Law hold strictly true?",
      options: [
        "Constant temperature and mechanical strain",
        "Varying magnetic field",
        "At absolute zero temperature only",
        "Under high optical radiation"
      ],
      answer: 0,
      explanation: "Ohm's Law is valid only when physical parameters like temperature, cross-sectional geometry, and pressure remain constant, since temperature change alters conductor resistivity."
    },
    {
      q: "Why is an ammeter always connected in series and a voltmeter in parallel?",
      options: [
        "Ammeter has very high resistance, voltmeter has low resistance",
        "Ammeter has very low resistance (ideally zero), voltmeter has very high resistance (ideally infinite)",
        "Both have infinite resistance",
        "It is merely a convention with no electrical significance"
      ],
      answer: 1,
      explanation: "An ammeter must have near-zero internal resistance so it doesn't cause a voltage drop in the branch. A voltmeter must have near-infinite resistance so it draws negligible current from the circuit."
    },
    {
      q: "Which of the following is a non-ohmic conductor?",
      options: [
        "Copper wire",
        "Nichrome resistor",
        "P-N Junction Diode",
        "Aluminum busbar"
      ],
      answer: 2,
      explanation: "Semiconductor devices like P-N junction diodes, transistors, and vacuum tubes have non-linear V-I curves, so their resistance is not constant and they do not obey Ohm's Law."
    },
    {
      q: "Kirchhoff's Current Law (KCL) at a node is a direct consequence of the conservation of:",
      options: [
        "Energy",
        "Electric Charge",
        "Momentum",
        "Magnetic Flux"
      ],
      answer: 1,
      explanation: "KCL states that net charge cannot accumulate at an electrical node; therefore, the sum of currents entering equals the sum of currents leaving (Conservation of Charge)."
    },
    {
      q: "What is the slope of a V-I graph where Current (I) is on the X-axis and Voltage (V) is on the Y-axis?",
      options: [
        "Conductance (G)",
        "Resistance (R)",
        "Power (P)",
        "Capacitance (C)"
      ],
      answer: 1,
      explanation: "Slope = ΔV / ΔI = R (Resistance). If current is on the Y-axis and voltage is on the X-axis, the slope is 1/R = Conductance."
    }
  ],

  "diode-char": [
    {
      q: "What is the typical barrier potential (cut-in knee voltage) for Silicon and Germanium diodes at room temperature (300 K)?",
      options: [
        "0.7 V for Si, 0.3 V for Ge",
        "0.3 V for Si, 0.7 V for Ge",
        "1.1 V for Si, 0.67 V for Ge",
        "0.2 V for both"
      ],
      answer: 0,
      explanation: "Due to differences in semiconductor bandgap energy (1.1 eV for Si vs 0.67 eV for Ge), the built-in potential is ~0.7 V for Silicon and ~0.3 V for Germanium."
    },
    {
      q: "What causes the reverse saturation current (Is) in a reverse-biased P-N junction?",
      options: [
        "Majority charge carriers drifting across the junction",
        "Thermally generated minority charge carriers sweeping across the depletion layer",
        "Recombination of electron-hole pairs",
        "External electromagnetic interference"
      ],
      answer: 1,
      explanation: "Reverse saturation current Is is caused by thermally generated minority carriers (electrons in P-region and holes in N-region) swept across by the electric field of the depletion barrier."
    },
    {
      q: "How does reverse saturation current in a Silicon diode behave when temperature increases by 10 °C?",
      options: [
        "It remains constant",
        "It decreases by half",
        "It approximately doubles",
        "It increases fourfold"
      ],
      answer: 2,
      explanation: "For both Silicon and Germanium, the reverse saturation current approximately doubles for every 10 °C rise in junction temperature: I_s(T2) = I_s(T1) · 2^((T2 - T1)/10)."
    },
    {
      q: "What is the main operating difference between a Zener diode and a normal P-N junction rectifier diode?",
      options: [
        "Zener diodes only conduct in forward bias",
        "Zener diodes are designed to operate safely in the reverse breakdown region with sharp constant voltage",
        "Zener diodes have no depletion region",
        "Zener diodes have much lower doping concentration"
      ],
      answer: 1,
      explanation: "Zener diodes are heavily doped to create a very narrow depletion region, permitting controlled, non-destructive breakdown (Zener/Avalanche) at a precise reverse voltage for voltage regulation."
    },
    {
      q: "What is dynamic (AC) resistance of a forward-biased diode given thermal voltage Vt = 26 mV and forward current If = 2 mA?",
      options: [
        "13 Ω",
        "52 Ω",
        "26 Ω",
        "260 Ω"
      ],
      answer: 0,
      explanation: "For an ideal diode (η = 1), dynamic resistance r_ac = η · V_t / I_f = 26 mV / 2 mA = 13 Ω."
    }
  ],

  "rectifier": [
    {
      q: "What is the theoretical maximum rectification efficiency of a Full-Wave Bridge Rectifier?",
      options: [
        "40.6%",
        "50.0%",
        "81.2%",
        "100%"
      ],
      answer: 2,
      explanation: "The theoretical maximum efficiency of a full-wave rectifier is η = 8 / π² ≈ 81.2%, which is twice that of a half-wave rectifier (40.6%)."
    },
    {
      q: "What is the ripple frequency at the output of a Full-Wave Bridge Rectifier supplied by 50 Hz AC mains?",
      options: [
        "25 Hz",
        "50 Hz",
        "100 Hz",
        "200 Hz"
      ],
      answer: 2,
      explanation: "In a full-wave rectifier, both half-cycles are rectified, producing two output pulses per input cycle. Therefore, f_ripple = 2 × f_in = 2 × 50 Hz = 100 Hz."
    },
    {
      q: "What is the Peak Inverse Voltage (PIV) rating required for each diode in a Full-Wave Bridge Rectifier?",
      options: [
        "V_m",
        "2 · V_m",
        "V_m / 2",
        "√2 · V_m"
      ],
      answer: 0,
      explanation: "In a bridge rectifier, the PIV of each diode is V_m. In a center-tapped full-wave rectifier, each diode must withstand 2·V_m."
    },
    {
      q: "How does increasing the filter capacitance C affect the output DC voltage and ripple factor?",
      options: [
        "Decreases DC voltage and increases ripple",
        "Increases average DC voltage closer to Vm and decreases ripple factor",
        "No effect on ripple",
        "Causes high AC harmonics to amplify"
      ],
      answer: 1,
      explanation: "A larger capacitor stores more charge during peaks and discharges more slowly during troughs, keeping the DC output voltage higher and drastically reducing ripple (γ ∝ 1/C)."
    },
    {
      q: "What is the ripple factor of an unfiltered Half-Wave Rectifier?",
      options: [
        "0.482",
        "1.21",
        "0.812",
        "1.00"
      ],
      answer: 1,
      explanation: "Ripple factor γ = √( (V_rms / V_dc)² - 1 ). For HWR, V_rms = V_m/2 and V_dc = V_m/π, giving γ = √( (π/2)² - 1 ) ≈ 1.21."
    }
  ],

  "transistor-ce": [
    {
      q: "In the Active Region of an NPN BJT in CE configuration, the junctions are biased as follows:",
      options: [
        "Emitter-Base forward biased, Collector-Base reverse biased",
        "Both junctions forward biased",
        "Both junctions reverse biased",
        "Emitter-Base reverse biased, Collector-Base forward biased"
      ],
      answer: 0,
      explanation: "For linear amplification (Active Region), the emitter-base junction must be forward biased to inject electrons, and the collector-base junction reverse biased to collect them."
    },
    {
      q: "What is the Early Effect (Base-Width Modulation) in a BJT?",
      options: [
        "Decrease in effective base width as reverse collector-base voltage increases",
        "Increase in base resistance at high currents",
        "Avalanche breakdown of emitter junction",
        "Decrease in current gain β at cryogenic temperatures"
      ],
      answer: 0,
      explanation: "As reverse bias across the collector-base junction increases, its depletion region expands deeper into the lightly doped base, narrowing the effective metallurgical base width."
    },
    {
      q: "If a transistor has β = 100 and base current IB = 30 µA, what is the ideal collector current IC in the active region?",
      options: [
        "300 µA",
        "3 mA",
        "30 mA",
        "3.03 mA"
      ],
      answer: 1,
      explanation: "I_C = β · I_B = 100 × 30 µA = 3000 µA = 3.0 mA."
    },
    {
      q: "What is the typical value of Collector-Emitter Saturation Voltage VCE(sat) for a silicon BJT?",
      options: [
        "0.7 V",
        "0.2 V",
        "1.5 V",
        "0 V"
      ],
      answer: 1,
      explanation: "When fully turned ON in saturation, both junctions are forward biased, leaving a small residual drop of V_CE(sat) ≈ 0.2 V across collector-emitter."
    },
    {
      q: "What is the mathematical relationship between common-base current gain α and common-emitter current gain β?",
      options: [
        "β = α / (1 - α)",
        "α = β / (β - 1)",
        "β = α · (1 + α)",
        "α = 1 + β"
      ],
      answer: 0,
      explanation: "Since I_E = I_B + I_C and α = I_C/I_E while β = I_C/I_B, substituting gives β = α / (1 - α) and α = β / (1 + β)."
    }
  ],

  "rc-filter": [
    {
      q: "At the cut-off frequency fc of a first-order passive RC Low-Pass Filter, what is the output amplitude relative to input?",
      options: [
        "0.500 (-6 dB)",
        "0.707 (-3 dB)",
        "1.000 (0 dB)",
        "0.100 (-20 dB)"
      ],
      answer: 1,
      explanation: "At f = f_c = 1/(2πRC), resistance equals capacitive reactance (R = X_c). The gain is 1/√2 ≈ 0.707, which is -3.01 dB."
    },
    {
      q: "What is the phase shift between input and output at the cutoff frequency of an RC Low-Pass Filter?",
      options: [
        "0°",
        "-45°",
        "-90°",
        "+180°"
      ],
      answer: 1,
      explanation: "Phase shift θ = -arctan(f/f_c). At f = f_c, θ = -arctan(1) = -45° (the output lags the input by 45°)."
    },
    {
      q: "What is the roll-off rate (attenuation slope) of a first-order RC filter in the stopband?",
      options: [
        "-6 dB/octave or -20 dB/decade",
        "-12 dB/octave or -40 dB/decade",
        "-3 dB/decade",
        "-18 dB/octave"
      ],
      answer: 0,
      explanation: "Each reactive pole in a filter introduces a roll-off of -20 dB per decade (equivalent to -6 dB per octave of frequency doubling)."
    },
    {
      q: "Calculate the cutoff frequency for R = 10 kΩ and C = 15.9 nF:",
      options: [
        "100 Hz",
        "1 kHz",
        "10 kHz",
        "1 MHz"
      ],
      answer: 1,
      explanation: "f_c = 1 / (2 · π · R · C) = 1 / (2 × 3.1416 × 10,000 × 15.9×10⁻⁹) ≈ 1,000 Hz = 1 kHz."
    },
    {
      q: "In an RC High-Pass Filter, where is the output signal taken from?",
      options: [
        "Across the capacitor",
        "Across the resistor",
        "Between input and ground",
        "Across the power supply"
      ],
      answer: 1,
      explanation: "In an HPF, the capacitor is in series with the input to block low frequencies/DC, and the output is taken across the shunt resistor to ground."
    }
  ],

  "opamp": [
    {
      q: "What is the 'Virtual Ground' concept in an inverting operational amplifier configuration?",
      options: [
        "The inverting terminal is physically connected to ground with a wire",
        "Due to near-infinite open-loop gain, negative feedback drives the inverting input voltage to match the grounded non-inverting input",
        "The power supply ground is disconnected",
        "Virtual ground means ground with zero current capability"
      ],
      answer: 1,
      explanation: "Since V_out = A_OL · (V_+ - V_-) and A_OL ≈ 10⁵ to 10⁶, the differential input (V_+ - V_-) = V_out/A_OL ≈ 0. If V_+ = 0V, V_- is held virtually at 0V without being physically grounded."
    },
    {
      q: "What is the closed-loop voltage gain of an inverting amplifier with R1 = 10 kΩ and Rf = 100 kΩ?",
      options: [
        "-10",
        "+10",
        "-11",
        "+11"
      ],
      answer: 0,
      explanation: "For an inverting op-amp, Gain A_v = - (R_f / R_1) = - (100 kΩ / 10 kΩ) = -10."
    },
    {
      q: "If an op-amp with ±15 V dual power supply is configured for gain of +10 and an input of 2 V peak is applied, what will the output look like?",
      options: [
        "Clean 20 V peak sine wave",
        "Output clipped at positive and negative saturation limits (~±13.5 V to ±14 V)",
        "Zero output",
        "Inverted sine wave of 10 V peak"
      ],
      answer: 1,
      explanation: "The theoretical output would be 20 V peak, but an op-amp cannot output a voltage exceeding its DC supply rails. The waveform undergoes flat-top clipping at saturation (V_sat ≈ V_cc - 1.5 V ≈ ±13.5 V)."
    },
    {
      q: "What is the closed-loop gain of a Non-Inverting op-amp with R1 = 10 kΩ and Rf = 47 kΩ?",
      options: [
        "4.7",
        "5.7",
        "-4.7",
        "1.0"
      ],
      answer: 1,
      explanation: "Non-inverting gain A_v = 1 + (R_f / R_1) = 1 + (47 kΩ / 10 kΩ) = 1 + 4.7 = 5.7."
    },
    {
      q: "What is the Common Mode Rejection Ratio (CMRR) of an ideal operational amplifier?",
      options: [
        "0 dB",
        "1",
        "Infinite (∞)",
        "-3 dB"
      ],
      answer: 2,
      explanation: "An ideal op-amp completely rejects common-mode noise on both terminals (A_cm = 0), giving CMRR = |A_d / A_cm| = ∞."
    }
  ],

  "logic-gates": [
    {
      q: "Why are NAND and NOR gates referred to as 'Universal Logic Gates'?",
      options: [
        "They can operate on any DC or AC voltage",
        "Any basic logic function (AND, OR, NOT, XOR) can be constructed solely using NAND or NOR gates",
        "They are universally accepted by all microcontroller architectures",
        "They have infinite fan-out capability"
      ],
      answer: 1,
      explanation: "By De Morgan's laws, NAND and NOR gates can implement inversion, conjunction, and disjunction. Hence, any arbitrary Boolean function can be built using only NAND or only NOR gates."
    },
    {
      q: "What is the output of an XOR gate when both inputs A and B are HIGH (Logic 1)?",
      options: [
        "Logic 1 (HIGH)",
        "Logic 0 (LOW)",
        "High Impedance (Hi-Z)",
        "Indeterminate state"
      ],
      answer: 1,
      explanation: "XOR yields 1 only when inputs differ. When both inputs are identical (00 or 11), the XOR output is LOW (0)."
    },
    {
      q: "In standard TTL logic (such as 7400 series), what is the valid voltage range for Logic HIGH (Logic 1) output?",
      options: [
        "0.0 V to 0.4 V",
        "0.8 V to 2.0 V",
        "2.4 V to 5.0 V",
        "9.0 V to 12.0 V"
      ],
      answer: 2,
      explanation: "For standard 5V TTL logic, output voltage V_OH is guaranteed to be ≥ 2.4 V up to VCC (5.0 V). Output LOW (V_OL) is ≤ 0.4 V."
    },
    {
      q: "What happens to an unconnected (floating) input pin of a standard TTL 74xx IC?",
      options: [
        "It acts as Logic 0",
        "It floats and behaves internally as Logic HIGH (Logic 1)",
        "It causes internal thermal breakdown",
        "It toggles continuously"
      ],
      answer: 1,
      explanation: "In bipolar TTL circuits, multi-emitter input transistors pull floating inputs to a high potential (~1.4 V to 1.8 V), which the gate interprets as Logic 1."
    },
    {
      q: "According to De Morgan's First Theorem, (A · B)' is equal to:",
      options: [
        "A' · B'",
        "A' + B'",
        "A + B",
        "(A + B)'"
      ],
      answer: 1,
      explanation: "De Morgan's theorem states that the complement of a product of variables is equal to the sum of their individual complements: (A · B)' = A' + B'."
    }
  ],

  "timer-555": [
    {
      q: "What are the two reference trigger voltages set by the internal three 5 kΩ resistor divider in a 555 timer with Vcc = 9 V?",
      options: [
        "3.0 V and 6.0 V",
        "4.5 V and 9.0 V",
        "2.5 V and 5.0 V",
        "1.5 V and 7.5 V"
      ],
      answer: 0,
      explanation: "The internal 5k-5k-5k chain divides V_cc into 1/3 V_cc and 2/3 V_cc. For V_cc = 9 V, lower trigger is 3.0 V and upper threshold is 6.0 V."
    },
    {
      q: "In an Astable 555 timer circuit, the timing capacitor charges through:",
      options: [
        "R_A only",
        "R_B only",
        "Both (R_A + R_B)",
        "Discharge Pin 7"
      ],
      answer: 2,
      explanation: "During charging, the discharge transistor (Pin 7) is OFF, so current flows from V_cc through both R_A and R_B into capacitor C."
    },
    {
      q: "In standard Astable configuration without a bypass diode across RB, the duty cycle is always:",
      options: [
        "Strictly 50%",
        "Greater than 50%",
        "Less than 50%",
        "100%"
      ],
      answer: 1,
      explanation: "Because T_high = 0.693(R_A + R_B)C and T_low = 0.693 R_B C, T_high is always strictly greater than T_low, making duty cycle D = (R_A+R_B)/(R_A+2R_B) > 50%."
    },
    {
      q: "What is the purpose of connecting a 0.01 µF capacitor between Pin 5 (Control Voltage) and Ground?",
      options: [
        "To increase output current capability",
        "To bypass electrical noise and high frequency ripple on the 2/3 Vcc threshold voltage",
        "To invert the output pulse",
        "To double the oscillation frequency"
      ],
      answer: 1,
      explanation: "Pin 5 connects to the upper 2/3 V_cc comparator node. Bypassing it with a 0.01 µF ceramic capacitor prevents power supply noise from causing jitter or false triggering."
    },
    {
      q: "Calculate the frequency of a 555 Astable multivibrator with RA = 10 kΩ, RB = 47 kΩ, and C = 1 µF:",
      options: [
        "1.38 Hz",
        "13.8 Hz",
        "138 Hz",
        "1.38 kHz"
      ],
      answer: 1,
      explanation: "f = 1.44 / [(R_A + 2·R_B) · C] = 1.44 / [(10,000 + 2×47,000) × 10⁻⁶] = 1.44 / (104,000 × 10⁻⁶) = 1.44 / 0.104 ≈ 13.85 Hz."
    }
  ]
};
