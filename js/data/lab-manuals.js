/**
 * Simulink X Studyhub - B.Tech Engineering Lab Manual Data
 * Developed by Aditya Maurya
 */

const LAB_MANUALS = {
  "ohms-law": {
    id: "ohms-law",
    title: "Verification of Ohm's Law and Circuit Analysis",
    category: "Basic Electrical & Electronics",
    aim: "To verify Ohm's Law experimentally by plotting the V-I characteristics of a resistive element and to calculate its resistance.",
    apparatus: [
      "Regulated DC Power Supply (0-30 V, 2 A)",
      "Digital DC Voltmeter (0-20 V)",
      "Digital DC Milliammeter (0-500 mA)",
      "Rheostat / Potentiometer (100 Ω, 2 A)",
      "Fixed Test Resistor (Known & Unknown standard values)",
      "Connecting wires and breadboard"
    ],
    theory: `Ohm's Law states that the current flowing through a conductor between two points is directly proportional to the voltage across the two points, provided all physical conditions (temperature, pressure, strain) remain constant.
    
Mathematically:
    V ∝ I
    V = I · R
    
Where:
- V = Potential difference across the conductor (Volts)
- I = Electric current flowing through the conductor (Amperes)
- R = Constant of proportionality known as Electrical Resistance (Ohms, Ω)

Kirchhoff's Voltage Law (KVL): The algebraic sum of all voltages in any closed loop network is zero: Σ V = 0.
Kirchhoff's Current Law (KCL): The algebraic sum of all currents entering and leaving a junction is zero: Σ I = 0.`,
    formulas: [
      { name: "Ohm's Law", expr: "R = V / I (Ω)" },
      { name: "Power Dissipation", expr: "P = V · I = I²·R = V² / R (Watts)" },
      { name: "Slope Resistance", expr: "R_calc = ΔV / ΔI" },
      { name: "Percentage Error", expr: "% Error = |(R_theor - R_exp) / R_theor| × 100%" }
    ],
    circuitDiagramDesc: "A DC power supply is connected in series with a rheostat, an ammeter, and the test resistor. A voltmeter is connected in parallel across the test resistor.",
    procedure: [
      "1. Connect the circuit as shown in the schematic diagram with the power supply switched OFF.",
      "2. Set the test resistance R to the desired nominal value (e.g. 100 Ω, 220 Ω, 470 Ω, or 1000 Ω).",
      "3. Switch ON the DC power supply.",
      "4. Gradually adjust the supply voltage slider from 0 V to 20 V in steps of 2 V.",
      "5. For each voltage step, observe and log the readings of the Voltmeter (V) and Ammeter (I).",
      "6. Click 'Add Reading to Table' to log each data point.",
      "7. Plot the graph between Voltage (V) on the X-axis and Current (I) on the Y-axis.",
      "8. Determine the slope of the line and calculate the experimental resistance value."
    ],
    precautions: [
      "Ensure all connections are tight before powering up.",
      "Ammeter must always be connected in SERIES and Voltmeter in PARALLEL.",
      "Do not exceed the power rating of the resistor to prevent thermal drift.",
      "Turn off the power supply before modifying any circuit connections."
    ]
  },

  "diode-char": {
    id: "diode-char",
    title: "P-N Junction Diode & Zener Diode V-I Characteristics",
    category: "Semiconductor Devices",
    aim: "To plot the V-I characteristics of a P-N junction diode (Silicon and Germanium) under forward and reverse bias conditions, determine the knee voltage, and evaluate its static and dynamic resistance.",
    apparatus: [
      "Regulated DC Power Supply (0-30 V)",
      "P-N Junction Diodes (1N4007 Silicon, 1N34A Germanium)",
      "Zener Diode (BZX55C 5.6V)",
      "Current Limiting Resistor (1 kΩ, 0.5 W)",
      "Digital DC Voltmeter (0-20 V)",
      "Digital DC Milliammeter (0-100 mA) & Microammeter (0-100 µA)",
      "Breadboard and Patch Cords"
    ],
    theory: `A P-N junction diode is a two-terminal semiconductor device that allows current to flow primarily in one direction (forward bias) while blocking it in the reverse direction (reverse bias).

Shockley Diode Equation:
    I = I_s · [exp(q·V / (η·k·T)) - 1] = I_s · [exp(V / (η·V_t)) - 1]

Where:
- I_s = Reverse saturation current (~10 nA for Si, ~1 µA for Ge)
- V = Applied junction voltage
- V_t = Thermal voltage (kT/q ≈ 26 mV at 300 K)
- η = Ideality factor (≈ 1 for Ge, ≈ 1 to 2 for Si)

Cut-in (Knee) Voltage:
- Silicon (Si): ~0.7 V
- Germanium (Ge): ~0.3 V
- Zener Diode: Exhibits controlled reverse avalanche / Zener breakdown at V_z (e.g. 5.6 V), maintaining a constant voltage across varying reverse currents.`,
    formulas: [
      { name: "Shockley Diode Equation", expr: "I = I_s · [e^(V / (η · V_t)) - 1]" },
      { name: "Static Resistance", expr: "R_dc = V_d / I_d (Ω)" },
      { name: "Dynamic Resistance", expr: "r_ac = ΔV_d / ΔI_d (Ω)" },
      { name: "Zener Breakdown Voltage", expr: "V_Z = V at sharp reverse current knee" }
    ],
    circuitDiagramDesc: "Forward bias: Anode connected to positive terminal, cathode to negative terminal via 1kΩ resistor. Reverse bias: Terminals inverted.",
    procedure: [
      "1. Select the diode type: Silicon (1N4007), Germanium (1N34A), or Zener Diode.",
      "2. Select the bias mode: Forward Bias or Reverse Bias.",
      "3. For Forward Bias: Increase DC supply voltage from 0 V to 2 V in small increments (0.1 V steps near the knee).",
      "4. Note the voltage drop across the diode (Vd) and the forward current (If) in mA.",
      "5. For Reverse Bias: Increase supply voltage from 0 V to 15 V in steps of 1 V and observe reverse current (Ir) in µA.",
      "6. Click 'Add Reading' for each step and observe the real-time V-I curve being plotted.",
      "7. Identify the knee/cut-in voltage and calculate the dynamic resistance r_ac = ΔV / ΔI."
    ],
    precautions: [
      "Never connect a diode directly across a voltage source without a current limiting resistor in forward bias.",
      "Observe proper polarity of the diode (silver ring denotes cathode).",
      "Do not exceed maximum forward current (1 A for 1N4007) to avoid thermal breakdown."
    ]
  },

  "rectifier": {
    id: "rectifier",
    title: "Half-Wave & Full-Wave Bridge Rectifier with Shunt Filter",
    category: "Analog Electronics",
    aim: "To construct Half-Wave and Full-Wave Bridge Rectifiers, observe AC input and rectified DC output waveforms on an oscilloscope, and analyze the effect of a shunt capacitor filter on ripple factor.",
    apparatus: [
      "Step-Down Transformer (230 V AC / 12-0-12 V, 50 Hz)",
      "P-N Junction Diodes (4 × 1N4007)",
      "Load Resistor R_L (1 kΩ, 2 W)",
      "Filter Capacitors (10 µF, 100 µF, 470 µF, 1000 µF)",
      "Dual-Channel Digital Storage Oscilloscope (DSO)",
      "Digital AC/DC Multimeter"
    ],
    theory: `Rectification is the process of converting alternating current (AC) into unidirectional direct current (DC).
    
1. Half-Wave Rectifier (HWR): Uses a single diode conducting only during the positive half-cycle of the AC input.
- DC Output Voltage: V_dc = V_m / π ≈ 0.318 V_m
- RMS Output Voltage: V_rms = V_m / 2 = 0.5 V_m
- Ripple Factor (without filter): γ = √((V_rms/V_dc)² - 1) = 1.21
- Rectification Efficiency: η_max = 40.6%

2. Full-Wave Bridge Rectifier (FWR): Uses four diodes arranged in a bridge. Diodes D1 & D2 conduct during positive half-cycle, while D3 & D4 conduct during negative half-cycle.
- DC Output Voltage: V_dc = 2·V_m / π ≈ 0.636 V_m
- RMS Output Voltage: V_rms = V_m / √2 ≈ 0.707 V_m
- Ripple Factor (without filter): γ = 0.482
- Rectification Efficiency: η_max = 81.2%
- Ripple Frequency: 2 × f_in (100 Hz for 50 Hz input)

3. Shunt Capacitor Filter: Connected across R_L. It charges to peak voltage V_m and discharges through R_L when the input falls, smoothing the output voltage.
- Ripple factor with filter: γ = 1 / (4·√3 · f · C · R_L) (for Full-Wave)`,
    formulas: [
      { name: "HWR DC Voltage", expr: "V_dc = V_m / π" },
      { name: "FWR DC Voltage", expr: "V_dc = 2 · V_m / π" },
      { name: "Ripple Factor (γ)", expr: "γ = V_ac / V_dc = √((V_rms / V_dc)² - 1)" },
      { name: "Filter Ripple Factor", expr: "γ = 1 / (4√3 · f · C · R_L) [Full Wave]" },
      { name: "Efficiency (η)", expr: "η = P_dc / P_ac × 100%" }
    ],
    circuitDiagramDesc: "AC secondary output fed to bridge rectifier (4 diodes). Output measured across load resistor RL with optional parallel electrolytic capacitor filter.",
    procedure: [
      "1. Select rectifier topology: Half-Wave Rectifier or Full-Wave Bridge Rectifier.",
      "2. Connect Channel 1 (Yellow) of the DSO to the AC transformer secondary to view the input sine wave.",
      "3. Connect Channel 2 (Cyan) across the load resistor RL to observe the rectified output.",
      "4. Record peak voltage (Vm), DC voltage (Vdc), and RMS voltage (Vrms) using the built-in multimeters.",
      "5. Toggle the Shunt Capacitor Filter ON/OFF.",
      "6. Vary capacitor value (10 µF, 100 µF, 470 µF) and load resistance RL.",
      "7. Observe the reduction in ripple voltage (peak-to-peak ripple) and calculate the ripple factor."
    ],
    precautions: [
      "Ensure electrolytic capacitor polarity is respected (positive to DC high, negative to ground).",
      "Check diode orientation in the bridge configuration before applying power.",
      "Do not touch high-voltage AC primary mains connections."
    ]
  },

  "transistor-ce": {
    id: "transistor-ce",
    title: "BJT Common Emitter (CE) Input & Output Characteristics",
    category: "Analog Electronics",
    aim: "To plot the input (IB vs VBE) and output (IC vs VCE) characteristics of an NPN Bipolar Junction Transistor in Common Emitter configuration, and determine current gain (β), input impedance (hie), and output admittance (hoe).",
    apparatus: [
      "NPN Transistor (BC547 / 2N2222)",
      "Dual Regulated DC Power Supplies (0-15 V)",
      "Base Potentiometer / Rheostat (100 kΩ) & Collector Rheostat (1 kΩ)",
      "Base Microammeter (0-200 µA) & Collector Milliammeter (0-50 mA)",
      "DC Digital Voltmeters (0-2 V for VBE, 0-20 V for VCE)",
      "Breadboard and hook-up wires"
    ],
    theory: `In Common Emitter (CE) configuration, the emitter terminal is common to both the input (base-emitter) and output (collector-emitter) circuits.
    
1. Input Characteristics (I_B vs V_BE at constant V_CE):
- Represents the forward-biased base-emitter P-N junction.
- As V_CE increases, the effective base width decreases (Early Effect / Base-width modulation), shifting the curve slightly to the right.
- Dynamic Input Resistance: h_ie = (ΔV_BE / ΔI_B) | at constant V_CE

2. Output Characteristics (I_C vs V_CE at constant I_B):
- Cutoff Region: I_B = 0, both junctions reverse-biased; only small leakage current I_CEO flows.
- Saturation Region: V_CE < 0.2 V; both junctions forward-biased. I_C increases steeply with V_CE.
- Active Region: Base-emitter forward-biased, collector-base reverse-biased. I_C is almost independent of V_CE and governed by:
    I_C = β · I_B + I_CEO
- Dynamic Output Resistance: r_o = 1/h_oe = (ΔV_CE / ΔI_C) | at constant I_B
- Common Emitter Current Gain: β = h_fe = ΔI_C / ΔI_B`,
    formulas: [
      { name: "Current Gain (β)", expr: "β = ΔI_C / ΔI_B (dimensionless)" },
      { name: "Input Resistance (h_ie)", expr: "h_ie = ΔV_BE / ΔI_B (Ω)" },
      { name: "Output Resistance (r_o)", expr: "r_o = ΔV_CE / ΔI_C (kΩ)" },
      { name: "Alpha-Beta Relation", expr: "α = β / (1 + β)" }
    ],
    circuitDiagramDesc: "Base-emitter loop with VBB and microammeter. Collector-emitter loop with VCC and milliammeter. Emitter tied to common ground.",
    procedure: [
      "1. Input Characteristics: Set V_CE to 2 V. Vary V_BE from 0 to 0.9 V in steps of 0.05 V. Note I_B in µA. Repeat for V_CE = 5 V and 10 V.",
      "2. Output Characteristics: Set base current I_B to a fixed value (e.g., 20 µA).",
      "3. Vary V_CE from 0 to 12 V (taking fine readings between 0 and 1 V to capture the saturation knee).",
      "4. Note collector current I_C in mA for each V_CE setting.",
      "5. Repeat the output sweep for I_B = 40 µA, 60 µA, 80 µA, and 100 µA.",
      "6. Observe the family of output curves and identify the Cutoff, Active, and Saturation zones.",
      "7. Calculate current gain β from the active region."
    ],
    precautions: [
      "Do not exceed the maximum collector dissipation (P_c = V_CE × I_C < 500 mW for BC547).",
      "Ensure correct pinout identification: Emitter, Base, Collector.",
      "Keep base current within rated safety limits to avoid thermal damage."
    ]
  },

  "rc-filter": {
    id: "rc-filter",
    title: "RC Low-Pass and High-Pass Filter Frequency Response",
    category: "Network Analysis & Signals",
    aim: "To study the frequency response of first-order passive RC Low-Pass and High-Pass filters, determine the -3 dB cut-off frequency, and plot the Bode magnitude curve.",
    apparatus: [
      "Function / Signal Generator (1 Hz to 1 MHz, Sine wave)",
      "Standard Resistors (1 kΩ, 10 kΩ, 1%)",
      "Standard Capacitors (0.01 µF, 0.1 µF, ceramic / polyester)",
      "Dual-Channel Digital Storage Oscilloscope (DSO)",
      "AC Electronic Millivoltmeter"
    ],
    theory: `Passive RC filters use the frequency-dependent impedance of a capacitor (X_c = 1 / (2·π·f·C)) combined with a resistor to attenuate unwanted frequencies.

1. Low-Pass Filter (LPF): Output taken across the capacitor.
- At low frequencies: X_c is large, output voltage V_out ≈ V_in.
- At high frequencies: X_c is very small, capacitor shunts signal to ground, V_out → 0.
- Cutoff Frequency (-3 dB point): f_c = 1 / (2·π·R·C)
- Transfer Function: H(jω) = 1 / (1 + j·ω·R·C)
- Magnitude Gain: |V_out / V_in| = 1 / √(1 + (f / f_c)²)
- Phase Shift: θ = -arctan(f / f_c) (at f = f_c, θ = -45°, gain = 0.707 or -3.01 dB)

2. High-Pass Filter (HPF): Output taken across the resistor.
- At low frequencies: X_c is large, blocking DC and low frequencies.
- At high frequencies: X_c is small, signal passes unhindered to output.
- Cutoff Frequency: f_c = 1 / (2·π·R·C)
- Magnitude Gain: |V_out / V_in| = (f / f_c) / √(1 + (f / f_c)²)
- Phase Shift: θ = +arctan(f_c / f) (at f = f_c, θ = +45°, gain = 0.707)`,
    formulas: [
      { name: "Cut-off Frequency (f_c)", expr: "f_c = 1 / (2 · π · R · C) (Hz)" },
      { name: "Voltage Gain (A_v)", expr: "A_v = V_out / V_in" },
      { name: "Gain in Decibels (dB)", expr: "Gain(dB) = 20 · log₁₀(V_out / V_in)" },
      { name: "Phase Shift (LPF)", expr: "θ = -arctan(2·π·f·R·C)" },
      { name: "Roll-off Rate", expr: "-20 dB/decade (-6 dB/octave)" }
    ],
    circuitDiagramDesc: "Function generator feeds series RC network. For LPF, output is across C. For HPF, output is across R.",
    procedure: [
      "1. Select filter mode: Low-Pass Filter (LPF) or High-Pass Filter (HPF).",
      "2. Set component values: R = 1 kΩ, C = 0.1 µF (calculated f_c ≈ 1591 Hz).",
      "3. Set function generator to 2 V_pp sine wave.",
      "4. Sweep input frequency from 50 Hz to 50 kHz in logarithmic steps.",
      "5. Measure V_out and phase angle relative to V_in on the dual-channel oscilloscope.",
      "6. Click 'Add Reading' to plot Gain (dB) vs Frequency on the semi-logarithmic Bode Plot.",
      "7. Identify the -3 dB frequency where gain falls to 0.707 × V_in and verify with theoretical formula."
    ],
    precautions: [
      "Maintain constant input voltage amplitude across the entire frequency sweep.",
      "Use oscilloscope probes with proper 10X compensation to reduce probe capacitance loading.",
      "Avoid parasitic cable capacitance at higher frequencies."
    ]
  },

  "opamp": {
    id: "opamp",
    title: "Operational Amplifier (IC 741) Inverting & Non-Inverting Amplifiers",
    category: "Linear Integrated Circuits",
    aim: "To design, simulate, and analyze Inverting and Non-Inverting Amplifiers using IC 741 operational amplifier, measure voltage gain, verify phase relationship, and observe output saturation clipping.",
    apparatus: [
      "Operational Amplifier IC (LM741 / UA741)",
      "Dual Regulated DC Power Supply (±15 V)",
      "Audio Function Generator (Sine wave, 1 kHz, variable amplitude)",
      "Resistors (R1 = 10 kΩ, Rf = 10 kΩ, 22 kΩ, 47 kΩ, 100 kΩ)",
      "Dual-Channel Digital Storage Oscilloscope (DSO)",
      "Digital Multimeter"
    ],
    theory: `The Operational Amplifier (Op-Amp) is a high-gain, direct-coupled differential amplifier.

Golden Rules of Ideal Op-Amp (with negative feedback):
1. The input impedance is infinite: no current enters input terminals (I_+ = I_- = 0).
2. The output attempts to keep the voltage difference between the inputs at zero: V_+ ≈ V_- (Virtual Ground concept).

1. Inverting Amplifier:
- Input signal applied to inverting (-) pin through R1. Non-inverting (+) pin grounded.
- Virtual Ground: Pin 2 sits at 0 V. Current through R1 is I = (V_in - 0)/R1.
- Current through feedback resistor: I = (0 - V_out)/Rf.
- Voltage Gain: A_v = V_out / V_in = - (R_f / R_1)
- Phase Shift: Exactly 180° inversion.

2. Non-Inverting Amplifier:
- Input signal applied directly to non-inverting (+) pin. Feedback divider connected to (-) pin.
- Voltage at (-) pin is V_- = V_out · R1 / (R1 + Rf) = V_in.
- Voltage Gain: A_v = V_out / V_in = 1 + (R_f / R_1)
- Phase Shift: 0° (In-phase).

Saturation: Output cannot swing beyond the supply rails minus drop: V_out(max) ≈ ± (V_cc - 1.5 V) ≈ ±13.5 V for ±15 V supply.`,
    formulas: [
      { name: "Inverting Gain (A_v)", expr: "A_v = - (R_f / R_1)" },
      { name: "Non-Inverting Gain (A_v)", expr: "A_v = 1 + (R_f / R_1)" },
      { name: "Virtual Ground Voltage", expr: "V_in(-) ≈ V_in(+) = 0 V" },
      { name: "Saturation Limit", expr: "|V_out| ≤ V_sat ≈ V_CC - 1.5 V" }
    ],
    circuitDiagramDesc: "IC 741 with Pin 7 at +15V, Pin 4 at -15V, Pin 6 output. R1 connected to Pin 2, Rf connected between Pin 2 and Pin 6.",
    procedure: [
      "1. Choose configuration: Inverting Amplifier or Non-Inverting Amplifier.",
      "2. Set input resistor R1 (e.g. 10 kΩ) and feedback resistor Rf (e.g. 20 kΩ for Gain = -2 or +3).",
      "3. Set input signal Vin to 1 kHz sine wave, 1.0 V_pp.",
      "4. Observe Channel 1 (Input Vin) and Channel 2 (Output Vout) on the oscilloscope.",
      "5. Verify the 180° phase inversion for inverting amplifier, or in-phase for non-inverting amplifier.",
      "6. Increase input amplitude until output waveform clips at top and bottom (Saturation effect).",
      "7. Calculate experimental gain A_v = V_out / V_in and compare with theoretical value."
    ],
    precautions: [
      "Always connect dual power supply ±15 V with correct polarity before applying input signal.",
      "Do not short circuit the op-amp output terminal to ground.",
      "Keep input signal within the linear dynamic range to prevent distortion."
    ]
  },

  "logic-gates": {
    id: "logic-gates",
    title: "Digital Logic Gates & Combinational Circuit Verification",
    category: "Digital Electronics",
    aim: "To verify the truth tables of basic digital logic gates (AND, OR, NOT) and universal logic gates (NAND, NOR), as well as XOR and XNOR gates using standard 7400-series TTL ICs.",
    apparatus: [
      "Digital IC Trainer Kit (+5 V DC Regulated Supply)",
      "TTL Integrated Circuits: 7408 (Quad 2-input AND), 7432 (Quad 2-input OR), 7404 (Hex Inverter NOT), 7400 (Quad 2-input NAND), 7402 (Quad 2-input NOR), 7486 (Quad 2-input XOR)",
      "Logic Input Switches (Logic 0 = 0 V, Logic 1 = +5 V)",
      "Logic Output Indicator LEDs with 330 Ω series resistors",
      "Patch Cords"
    ],
    theory: `Logic gates are the fundamental building blocks of digital electronic systems. They perform logical operations on one or more binary inputs to produce a single binary output.

Boolean Expressions & Truth Tables:
1. AND Gate (Y = A · B): Output is HIGH (1) only if ALL inputs are HIGH.
2. OR Gate (Y = A + B): Output is HIGH (1) if ANY input is HIGH.
3. NOT Gate (Y = Ā): Output is the inverted complement of the input.
4. NAND Gate (Y = (A · B)̄): Universal gate; inverted AND output.
5. NOR Gate (Y = (A + B)̄): Universal gate; inverted OR output.
6. XOR Gate (Y = A ⊕ B = ĀB + AB̄): Output is HIGH when inputs are DIFFERENT (odd parity detector).
7. XNOR Gate (Y = (A ⊕ B)̄ = AB + ĀB̄): Output is HIGH when inputs are IDENTICAL (equality detector).

Universal Property of NAND and NOR: Any Boolean logic circuit can be synthesized exclusively using NAND or NOR gates alone.`,
    formulas: [
      { name: "AND Gate", expr: "Y = A · B" },
      { name: "OR Gate", expr: "Y = A + B" },
      { name: "NOT Gate", expr: "Y = A'" },
      { name: "NAND Gate", expr: "Y = (A · B)'" },
      { name: "NOR Gate", expr: "Y = (A + B)'" },
      { name: "XOR Gate", expr: "Y = A ⊕ B = A·B' + A'·B" },
      { name: "XNOR Gate", expr: "Y = (A ⊕ B)' = A·B + A'·B'" }
    ],
    circuitDiagramDesc: "TTL IC 74xx with Pin 14 connected to +5V (VCC), Pin 7 to GND. Inputs connected to toggle switches, output to LED.",
    procedure: [
      "1. Select the logic gate to study (AND, OR, NOT, NAND, NOR, XOR, XNOR).",
      "2. Toggle Input A switch between Logic 0 (0 V) and Logic 1 (5 V).",
      "3. Toggle Input B switch between Logic 0 (0 V) and Logic 1 (5 V).",
      "4. Observe the state of the output LED (Glow = Logic 1, Off = Logic 0).",
      "5. Click 'Verify State' to automatically validate each row of the Truth Table.",
      "6. Complete all input permutations (00, 01, 10, 11) to verify total compliance with Boolean theory."
    ],
    precautions: [
      "Do not apply voltage greater than 5.25 V to TTL ICs.",
      "Unused inputs of TTL gates float HIGH; always tie them to ground or Vcc for deterministic behavior.",
      "Ensure Pin 14 is tied to VCC (+5V) and Pin 7 to GND before testing."
    ]
  },

  "timer-555": {
    id: "timer-555",
    title: "IC 555 Timer Astable Multivibrator (Free-Running Oscillator)",
    category: "Linear Integrated Circuits",
    aim: "To design and simulate an Astable Multivibrator using IC 555 timer, observe the exponential capacitor charging/discharging and square wave output on an oscilloscope, and measure the oscillation frequency and duty cycle.",
    apparatus: [
      "IC 555 Timer (8-pin DIP package)",
      "Regulated DC Power Supply (+5 V to +12 V)",
      "Timing Resistors RA (10 kΩ) and RB (47 kΩ potentiometer)",
      "Timing Capacitor C (1 µF, 10 µF, electrolytic)",
      "Bypass Capacitor C1 (0.01 µF ceramic)",
      "Output Indicator LED with 470 Ω resistor",
      "Dual-Channel Digital Storage Oscilloscope (DSO)"
    ],
    theory: `The 555 Timer in Astable mode has no stable state; it continuously switches between HIGH and LOW output states, producing a periodic square wave without any external trigger.

Internal Architecture:
- Three internal 5 kΩ resistors form a voltage divider setting reference voltages at 2/3 V_cc (Upper Threshold) and 1/3 V_cc (Lower Trigger).
- Two internal comparators drive a Set-Reset (SR) flip-flop.
- Pin 7 connects to an internal discharge transistor.

Operation Cycle:
1. Charging Phase (Output HIGH):
- Capacitor C charges from 1/3 V_cc towards V_cc through (R_A + R_B).
- Charge time: T_high = 0.693 · (R_A + R_B) · C
2. Discharging Phase (Output LOW):
- When V_c reaches 2/3 V_cc, comparator 1 triggers flip-flop; Pin 7 turns ON.
- Capacitor discharges from 2/3 V_cc towards ground through R_B only.
- Discharge time: T_low = 0.693 · R_B · C

Total Period: T = T_high + T_low = 0.693 · (R_A + 2·R_B) · C
Oscillation Frequency: f = 1 / T = 1.44 / ((R_A + 2·R_B) · C)
Duty Cycle (D): D = [T_high / (T_high + T_low)] × 100% = [(R_A + R_B) / (R_A + 2·R_B)] × 100%`,
    formulas: [
      { name: "Charging Time (T_high)", expr: "T_high = 0.693 · (R_A + R_B) · C (seconds)" },
      { name: "Discharging Time (T_low)", expr: "T_low = 0.693 · R_B · C (seconds)" },
      { name: "Total Period (T)", expr: "T = T_high + T_low = 0.693 · (R_A + 2·R_B) · C" },
      { name: "Frequency (f)", expr: "f = 1.44 / ((R_A + 2·R_B) · C) (Hz)" },
      { name: "Duty Cycle (%)", expr: "D = [(R_A + R_B) / (R_A + 2·R_B)] × 100%" }
    ],
    circuitDiagramDesc: "Pin 8 to VCC, Pin 1 to GND. Pin 4 to VCC. Pin 5 via 0.01uF to GND. RA between VCC and Pin 7. RB between Pin 7 and Pin 6/2. C between Pin 6/2 and GND.",
    procedure: [
      "1. Configure timing resistor RA (1 kΩ to 50 kΩ) and RB (1 kΩ to 100 kΩ).",
      "2. Select timing capacitor C (0.1 µF, 1 µF, 10 µF, or 100 µF).",
      "3. Set supply voltage V_cc to 5 V or 9 V.",
      "4. Connect Channel 1 of DSO to Pin 3 (Output Square Wave).",
      "5. Connect Channel 2 of DSO to Pin 2/6 (Capacitor Voltage Exponential Waveform).",
      "6. Observe the flashing output LED pulsing in synchronization with the square wave.",
      "7. Measure T_high, T_low, frequency, and duty cycle on the oscilloscope, and compare with calculated values."
    ],
    precautions: [
      "Never set RB to 0 Ω directly across Pin 7 and Pin 6 to avoid shorting the discharge transistor.",
      "Ensure proper polarity when using polarized electrolytic capacitors.",
      "Keep lead lengths short to avoid parasitic oscillations."
    ]
  }
};
