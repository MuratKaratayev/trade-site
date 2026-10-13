// Скрипт листа «03 · Моушн», извлечён из TRADE-brandbook.dc.html (docs/brandbook/unbundle.py).
// Источник правды для components/figures/*. Не редактировать.
var FALL = [1, 0.31, 0.09];
var STAGGER = 50;
var DUR = 600;
function makeBez(x1, y1, x2, y2) {
  return function (x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var lo = 0, hi = 1, t = x;
    for (var i = 0; i < 26; i++) {
      t = (lo + hi) / 2;
      var cx = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
      if (cx < x) lo = t; else hi = t;
    }
    return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
  };
}
var EASE = makeBez(0.32, 0.72, 0, 1);
function iso(x, y, z, g) { return [g.ox + (x - y) * 0.8660254 * g.s, g.oy + (x + y) * 0.5 * g.s - z * g.s]; }
function P(a) { return a.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
function faces(x, y, z, w, d, h, g) {
  var z1 = z + h;
  return {
    left: P([iso(x, y + d, z, g), iso(x + w, y + d, z, g), iso(x + w, y + d, z1, g), iso(x, y + d, z1, g)]),
    right: P([iso(x + w, y, z, g), iso(x + w, y + d, z, g), iso(x + w, y + d, z1, g), iso(x + w, y, z1, g)]),
    top: P([iso(x, y, z1, g), iso(x + w, y, z1, g), iso(x + w, y + d, z1, g), iso(x, y + d, z1, g)])
  };
}
function hull(x, y, z, w, d, h, g) {
  var pts = [];
  [0, w].forEach(function (a) { [0, d].forEach(function (b) { [0, h].forEach(function (c) { pts.push(iso(x + a, y + b, z + c, g)); }); }); });
  pts.sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; });
  function cross(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
  var lower = [], upper = [];
  pts.forEach(function (p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); });
  for (var i = pts.length - 1; i >= 0; i--) { var p = pts[i]; while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  upper.pop(); lower.pop();
  return P(lower.concat(upper));
}
function pushBox(list, f, fill, stroke, topFill, topStroke) {
  list.push({ pts: f.left, fill: fill, stroke: stroke });
  list.push({ pts: f.right, fill: fill, stroke: stroke });
  list.push({ pts: f.top, fill: topFill || fill, stroke: topStroke || stroke });
}
var THEMES = {
  dark: { bg: '#14171A', panel: '#1E2226', line: '#2E343A', text: '#F2F3F4', muted: '#9AA3AB', accentText: '#FF5A36', figure: '#C9CED3', dim: '#5D666E', accentFill: 'rgba(215, 51, 19, 0.28)' },
  light: { bg: '#FFFFFF', panel: '#F4F5F6', line: '#DCDFE2', text: '#14171A', muted: '#5B636B', accentText: '#A82710', figure: '#3A4148', dim: '#A3AAB1', accentFill: 'rgba(215, 51, 19, 0.16)' }
};

class Component extends DCLogic {
  ensure() {
    if (this.figs) return;
    var mk = function (n) { var a = []; for (var i = 0; i < n; i++) a.push({ from: 0, to: 0, start: 0, cur: 0, d: 0 }); return a; };
    this.figs = { field: mk(36), rail: mk(8), rack: mk(6) };
  }
  componentWillUnmount() { if (this.raf) cancelAnimationFrame(this.raf); this.raf = null; }
  reduced() {
    try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  activate(name, idx, dist) {
    this.ensure();
    var now = performance.now();
    var red = this.reduced();
    this.figs[name].forEach(function (e, j) {
      var d = idx == null ? null : dist(idx, j);
      var target = d != null && d < FALL.length ? FALL[d] : 0;
      var ring = d == null ? Math.min(e.d, 3) : Math.min(d, 3);
      if (d != null) e.d = d;
      if (target === e.to) return;
      e.from = e.cur; e.to = target;
      e.start = now + (red ? 0 : ring * STAGGER);
      if (red) { e.cur = target; e.start = now - DUR; e.from = target; }
    });
    this.kick();
  }
  kick() {
    var self = this;
    if (self.raf) return;
    var loop = function () {
      var now = performance.now();
      var moving = false;
      ['field', 'rail', 'rack'].forEach(function (k) {
        self.figs[k].forEach(function (e) {
          if (now < e.start) { moving = true; return; }
          var p = Math.min(1, (now - e.start) / DUR);
          e.cur = e.from + (e.to - e.from) * EASE(p);
          if (p < 1) moving = true;
        });
      });
      self.forceUpdate();
      self.raf = moving ? requestAnimationFrame(loop) : null;
    };
    self.raf = requestAnimationFrame(loop);
  }
  buildField(c, m) {
    var self = this, g = { s: 26, ox: 229, oy: 150 }, N = 6, solids = [], hits = [];
    pushBox(solids, faces(-0.25, -0.25, -0.35, N + 0.5, N + 0.5, 0.35, g), c.panel, c.dim);
    var cells = [];
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) cells.push([i, j]);
    cells.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]) || a[0] - b[0]; });
    cells.forEach(function (ij) {
      var k = ij[0] * N + ij[1], v = self.figs.field[k].cur;
      var h = 0.45 + v * 2.3 * m;
      var hot = v > 0.66;
      pushBox(solids, faces(ij[0] + 0.19, ij[1] + 0.19, 0, 0.62, 0.62, h, g), c.panel, c.figure, hot ? c.accentFill : c.panel, hot ? c.accentText : c.figure);
    });
    for (var i2 = 0; i2 < N; i2++) for (var j2 = 0; j2 < N; j2++) {
      (function (a, b) {
        hits.push({ pts: hull(a, b, 0, 1, 1, 0.45, g), enter: function () { self.activate('field', a * N + b, function (p, q) { return Math.max(Math.abs(Math.floor(p / N) - Math.floor(q / N)), Math.abs(p % N - q % N)); }); } });
      })(i2, j2);
    }
    return { solids: solids, hits: hits };
  }
  buildRail(c, m) {
    var self = this, g = { s: 24, ox: 160, oy: 200 }, solids = [], hits = [];
    pushBox(solids, faces(-0.3, 0.2, -0.25, 8.4, 0.9, 0.25, g), c.panel, c.dim);
    for (var i = 0; i < 8; i++) {
      var v = self.figs.rail[i].cur, x = i * 1.0 + 0.07, y = 0, w = 0.86, d = 1.3, z = 0.05 + v * 1.25 * m, h = 1.8;
      pushBox(solids, faces(x, y, z, w, d, h, g), c.panel, c.figure);
      solids.push({ pts: P([iso(x + 0.14, y + d, z + 0.45, g), iso(x + w - 0.14, y + d, z + 0.45, g)]), fill: 'none', stroke: c.dim });
      solids.push({ pts: P([iso(x + 0.14, y + d, z + 0.75, g), iso(x + w - 0.14, y + d, z + 0.75, g)]), fill: 'none', stroke: c.dim });
      var led = v > 0.2;
      solids.push({ pts: P([iso(x + 0.14, y + d, z + h - 0.22, g), iso(x + 0.3, y + d, z + h - 0.22, g), iso(x + 0.3, y + d, z + h - 0.38, g), iso(x + 0.14, y + d, z + h - 0.38, g)]), fill: led ? c.accentText : c.panel, stroke: led ? c.accentText : c.figure });
      (function (k) {
        hits.push({ pts: hull(k * 1.0 + 0.07, 0, 0, 0.86, 1.3, 3.4, g), enter: function () { self.activate('rail', k, function (p, q) { return Math.abs(p - q); }); } });
      })(i);
    }
    return { solids: solids, hits: hits };
  }
  buildRack(c, m) {
    var self = this, g = { s: 38, ox: 250, oy: 290 }, solids = [], hits = [];
    pushBox(solids, faces(-0.1, -0.1, -0.2, 2.4, 1.9, 0.2, g), c.panel, c.dim);
    pushBox(solids, faces(0, 0, 0, 0.12, 0.12, 4.45, g), c.panel, c.dim);
    pushBox(solids, faces(2.08, 0, 0, 0.12, 0.12, 4.45, g), c.panel, c.dim);
    for (var k = 0; k < 6; k++) {
      var v = self.figs.rack[k].cur, z = 0.3 + k * 0.68, out = v * 1.4 * m, hot = v > 0.66;
      pushBox(solids, faces(0.15, 0.1 + out, z, 1.9, 1.5, 0.42, g), c.panel, c.figure, hot ? c.accentFill : c.panel, hot ? c.accentText : c.figure);
      solids.push({ pts: P([iso(0.95, 1.6 + out, z + 0.21, g), iso(1.25, 1.6 + out, z + 0.21, g)]), fill: 'none', stroke: hot ? c.accentText : c.dim });
      (function (n, zz) {
        hits.push({ pts: hull(0.15, 0.1, zz, 1.9, 2.4, 0.68, g), enter: function () { self.activate('rack', n, function (p, q) { return Math.abs(p - q); }); } });
      })(k, z - 0.13);
    }
    pushBox(solids, faces(-0.05, -0.05, 4.45, 2.3, 1.75, 0.1, g), c.panel, c.dim);
    hits.reverse();
    return { solids: solids, hits: hits };
  }
  renderVals() {
    this.ensure();
    var self = this;
    var theme = this.state.theme || this.props.theme || 'dark';
    var I = this.state.intensity != null ? this.state.intensity : (this.props.intensity != null ? this.props.intensity : 0.6);
    var m = 0.35 + 1.1 * I;
    var c = THEMES[theme] || THEMES.dark;
    return {
      c: c,
      intensity: I,
      intensityLabel: Number(I).toFixed(2),
      field: this.buildField(c, m),
      rail: this.buildRail(c, m),
      rack: this.buildRack(c, m),
      fieldLeave: function () { self.activate('field', null); },
      railLeave: function () { self.activate('rail', null); },
      rackLeave: function () { self.activate('rack', null); },
      setDark: function () { self.setState({ theme: 'dark' }); },
      setLight: function () { self.setState({ theme: 'light' }); },
      setIntensity: function (e) { self.setState({ intensity: parseFloat(e.target.value) }); },
      darkBtnBg: theme === 'dark' ? '#D73313' : 'transparent',
      darkBtnFg: theme === 'dark' ? '#FFFFFF' : c.text,
      lightBtnBg: theme === 'light' ? '#D73313' : 'transparent',
      lightBtnFg: theme === 'light' ? '#FFFFFF' : c.text
    };
  }
}
