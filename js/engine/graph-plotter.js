/**
 * Simulink X Studyhub - Scientific Graph Plotter Canvas Engine
 * Developed by Aditya Maurya
 */

class ScientificGraphPlotter {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.title = options.title || 'Experimental V-I Characteristic Curve';
    this.xLabel = options.xLabel || 'Voltage (V)';
    this.yLabel = options.yLabel || 'Current (mA)';
    this.series = []; // Array of { name, color, points: [{x, y}], showLine, showPoints }
    
    this.margin = { top: 40, right: 30, bottom: 45, left: 55 };
    this.hoverPoint = null;

    this.initCanvasEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 580) * dpr;
    this.canvas.height = (rect.height || 360) * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width || 580;
    this.height = rect.height || 360;
    this.render();
  }

  setLabels(title, xLabel, yLabel) {
    this.title = title;
    this.xLabel = xLabel;
    this.yLabel = yLabel;
  }

  clear() {
    this.series = [];
    this.render();
  }

  addSeries(name, color = '#38bdf8', points = []) {
    this.series.push({
      name,
      color,
      points: [...points],
      showLine: true,
      showPoints: true
    });
    this.render();
  }

  addPointToSeries(seriesIndex, x, y) {
    if (!this.series[seriesIndex]) {
      this.addSeries(`Series ${seriesIndex + 1}`, '#38bdf8', []);
    }
    this.series[seriesIndex].points.push({ x, y });
    this.series[seriesIndex].points.sort((a, b) => a.x - b.x);
    this.render();
  }

  initCanvasEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      this.checkHover(mx, my);
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverPoint = null;
      this.render();
    });
  }

  checkHover(mx, my) {
    const bounds = this.getBounds();
    const plotW = this.width - this.margin.left - this.margin.right;
    const plotH = this.height - this.margin.top - this.margin.bottom;

    let closest = null;
    let minDistance = 12; // 12px snap radius

    for (const s of this.series) {
      for (const p of s.points) {
        const px = this.margin.left + ((p.x - bounds.minX) / (bounds.maxX - bounds.minX || 1)) * plotW;
        const py = this.height - this.margin.bottom - ((p.y - bounds.minY) / (bounds.maxY - bounds.minY || 1)) * plotH;
        const dist = Math.hypot(mx - px, my - py);
        if (dist < minDistance) {
          minDistance = dist;
          closest = { ...p, px, py, color: s.color, seriesName: s.name };
        }
      }
    }

    if (closest !== this.hoverPoint) {
      this.hoverPoint = closest;
      this.render();
    }
  }

  getBounds() {
    let minX = 0;
    let maxX = 1;
    let minY = 0;
    let maxY = 1;

    let hasData = false;
    for (const s of this.series) {
      for (const p of s.points) {
        if (!hasData) {
          minX = p.x;
          maxX = p.x;
          minY = p.y;
          maxY = p.y;
          hasData = true;
        } else {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        }
      }
    }

    if (!hasData) {
      return { minX: 0, maxX: 10, minY: 0, maxY: 10 };
    }

    // Include zero if positive
    if (minX > 0) minX = 0;
    if (minY > 0) minY = 0;

    // Margin padding
    const dx = (maxX - minX) * 0.1 || 1;
    const dy = (maxY - minY) * 0.1 || 1;

    return {
      minX: minX < 0 ? minX - dx : 0,
      maxX: maxX + dx,
      minY: minY < 0 ? minY - dy : 0,
      maxY: maxY + dy
    };
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const bounds = this.getBounds();
    const plotW = w - this.margin.left - this.margin.right;
    const plotH = h - this.margin.top - this.margin.bottom;

    // Draw Grid & Axes
    this.drawGridAndAxes(bounds, plotW, plotH);

    // Draw Series
    for (const s of this.series) {
      this.drawSeriesLineAndPoints(s, bounds, plotW, plotH);
    }

    // Draw Linear Regression line if Ohm's Law or single curve
    if (this.series.length === 1 && this.series[0].points.length >= 2) {
      this.drawRegressionLine(this.series[0].points, bounds, plotW, plotH);
    }

    // Draw Title & Labels
    this.drawHeaderAndLabels(w, h);

    // Draw Hover Tooltip
    if (this.hoverPoint) {
      this.drawTooltip(this.hoverPoint);
    }
  }

  drawGridAndAxes(b, plotW, plotH) {
    const ctx = this.ctx;
    const left = this.margin.left;
    const bottom = this.height - this.margin.bottom;
    const top = this.margin.top;

    ctx.save();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    ctx.font = '11px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = '#94a3b8';

    // Vertical grid lines (X axis)
    const xSteps = 6;
    for (let i = 0; i <= xSteps; i++) {
      const frac = i / xSteps;
      const xVal = b.minX + frac * (b.maxX - b.minX);
      const px = left + frac * plotW;

      ctx.beginPath();
      ctx.moveTo(px, top);
      ctx.lineTo(px, bottom);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillText(xVal.toFixed(1), px, bottom + 16);
    }

    // Horizontal grid lines (Y axis)
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const frac = i / ySteps;
      const yVal = b.minY + frac * (b.maxY - b.minY);
      const py = bottom - frac * plotH;

      ctx.beginPath();
      ctx.moveTo(left, py);
      ctx.lineTo(left + plotW, py);
      ctx.stroke();

      ctx.textAlign = 'right';
      ctx.fillText(yVal.toFixed(1), left - 8, py + 4);
    }

    // Border Box
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(left, top, plotW, plotH);

    ctx.restore();
  }

  drawSeriesLineAndPoints(s, b, plotW, plotH) {
    const ctx = this.ctx;
    const left = this.margin.left;
    const bottom = this.height - this.margin.bottom;

    if (s.points.length === 0) return;

    ctx.save();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2.2;
    ctx.fillStyle = s.color;

    // Draw Line
    if (s.showLine && s.points.length > 1) {
      ctx.beginPath();
      s.points.forEach((p, idx) => {
        const px = left + ((p.x - b.minX) / (b.maxX - b.minX || 1)) * plotW;
        const py = bottom - ((p.y - b.minY) / (b.maxY - b.minY || 1)) * plotH;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Draw Point Markers
    if (s.showPoints) {
      s.points.forEach((p) => {
        const px = left + ((p.x - b.minX) / (b.maxX - b.minX || 1)) * plotW;
        const py = bottom - ((p.y - b.minY) / (b.maxY - b.minY || 1)) * plotH;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
    }

    ctx.restore();
  }

  drawRegressionLine(points, b, plotW, plotH) {
    // Linear regression y = mx + c
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (const p of points) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
    }
    const denom = (n * sumX2 - sumX * sumX);
    if (Math.abs(denom) < 1e-9) return;

    const m = (n * sumXY - sumX * sumY) / denom;
    const c = (sumY - m * sumX) / n;

    const left = this.margin.left;
    const bottom = this.height - this.margin.bottom;

    const x1 = b.minX;
    const y1 = m * x1 + c;
    const x2 = b.maxX;
    const y2 = m * x2 + c;

    const px1 = left + ((x1 - b.minX) / (b.maxX - b.minX || 1)) * plotW;
    const py1 = bottom - ((y1 - b.minY) / (b.maxY - b.minY || 1)) * plotH;
    const px2 = left + ((x2 - b.minX) / (b.maxX - b.minX || 1)) * plotW;
    const py2 = bottom - ((y2 - b.minY) / (b.maxY - b.minY || 1)) * plotH;

    const ctx = this.ctx;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, py2);
    ctx.stroke();
    ctx.restore();
  }

  drawHeaderAndLabels(w, h) {
    const ctx = this.ctx;
    ctx.save();

    // Title
    ctx.font = 'bold 13px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.fillText(this.title, w / 2, 22);

    // X Axis Label
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(this.xLabel, w / 2, h - 8);

    // Y Axis Label (Rotated)
    ctx.save();
    ctx.translate(14, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(this.yLabel, 0, 0);
    ctx.restore();

    ctx.restore();
  }

  drawTooltip(p) {
    const ctx = this.ctx;
    const text = `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`;
    ctx.save();
    ctx.font = '11px "JetBrains Mono", Consolas, monospace';
    const textWidth = ctx.measureText(text).width;
    const boxW = textWidth + 14;
    const boxH = 22;

    const bx = Math.min(this.width - boxW - 10, Math.max(10, p.px - boxW / 2));
    const by = Math.max(30, p.py - 30);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = p.color || '#38bdf8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, boxH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(text, bx + boxW / 2, by + 15);
    ctx.restore();
  }

  downloadImage() {
    const link = document.createElement('a');
    link.download = `simulink-studyhub-graph-${Date.now()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}
