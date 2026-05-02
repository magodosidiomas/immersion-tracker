/* ════════════════════════════════════════════════════════════
   DASHBOARD
   Gráfico de rosca (Chart.js) e calendário de atividade.
════════════════════════════════════════════════════════════ */

// Posicionador externo para tooltips do donut
Chart.Tooltip.positioners.donutOutside = function(elements) {
  if (!elements.length) return false;
  const arc = elements[0].element;
  const angle = (arc.startAngle + arc.endAngle) / 2;
  const r = arc.outerRadius + 16;
  return { x: arc.x + Math.cos(angle) * r, y: arc.y + Math.sin(angle) * r };
};

let dashMode   = 'categoria';
let _dashChart = null;

function renderDashboard() {
  if (!state.userLanguages.length) return;
  const contents      = getLangContents();
  const studySessions = getLangStudySessions();
  const totals        = {};

  contents.forEach(c => {
    (c.sessions || []).forEach(s => {
      let key;
      if      (dashMode === 'categoria')    key = s.cat  || 'imersao';
      else if (dashMode === 'subcategoria') key = s.sub  || 'escuta-leitura';
      else                                  key = c.type || 'outro';
      totals[key] = (totals[key] || 0) + (s.durationMin || 0);
    });
  });

  if (dashMode !== 'tipo') {
    studySessions.forEach(s => {
      const key = dashMode === 'categoria' ? (s.cat || 'estudo') : (s.sub || 'vocabulario');
      totals[key] = (totals[key] || 0) + (s.durationMin || 0);
    });
  }

  let order;
  if      (dashMode === 'categoria')    order = ['imersao','interativa','estudo','producao'];
  else if (dashMode === 'subcategoria') order = ['escuta-leitura','escuta','leitura','vocabulario','gramatica','fala','escrita','conversacao'];
  else                                  order = ['youtube','serie','podcast','livro','website','outro'];

  if (dashMode !== 'categoria') order = order.filter(k => (totals[k] || 0) > 0);
  if (!order.length) order = dashMode === 'tipo'
    ? ['outro']
    : (dashMode === 'categoria' ? ['imersao','interativa','estudo','producao'] : ['vocabulario']);

  const labels   = order.map(k => DASH_LABELS[k] || k);
  const data     = order.map(k => totals[k] || 0);
  const colors   = order.map(k => DASH_COLORS[k] || '#6B6882');
  const totalMin = data.reduce((a, b) => a + b, 0);

  document.getElementById('donutTotal').textContent = totalMin > 0 ? fmtMinNoSec(totalMin) : '—';

  document.getElementById('donutLegend').innerHTML = order.map((k, i) => {
    const pct = totalMin > 0 ? Math.round((data[i] / totalMin) * 100) : 0;
    return `<div class="legend-row">
      <div class="legend-dot" style="background:${colors[i]}"></div>
      <span class="legend-label">${esc(labels[i])}</span>
      <span class="legend-val">${fmtMinNoSec(data[i])}</span>
      <span class="legend-pct">${pct}%</span>
    </div>`;
  }).join('');

  const canvas = document.getElementById('dashDonut');
  canvas.setAttribute('aria-label', `Distribuição por ${dashMode}: ${labels.join(', ')}`);

  if (_dashChart) { _dashChart.destroy(); _dashChart = null; }

  const isEmpty = totalMin === 0;
  _dashChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data:            isEmpty ? order.map(() => 1) : data,
        backgroundColor: isEmpty ? order.map(() => '#2A2540') : colors,
        borderWidth: 0,
        hoverOffset: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: !isEmpty,
          position: 'donutOutside',
          callbacks: {
            label: function(ctx) {
              const val   = ctx.parsed;
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct   = total > 0 ? Math.round((val / total) * 100) : 0;
              return ` ${fmtMinNoSec(val)} · ${pct}%`;
            }
          }
        }
      },
      animation: { duration: 300 },
    }
  });

  renderCalendar();
}

document.getElementById('dashSegmented').querySelectorAll('.segmented__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#dashSegmented .segmented__btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    dashMode = btn.dataset.mode;
    renderDashboard();
  });
});

/* ════════════════════════════════════════════════════════════
   CALENDAR
════════════════════════════════════════════════════════════ */

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();

function getActiveDays() {
  const days = new Set();
  getLangContents().forEach(c => {
    (c.sessions || []).forEach(s => {
      days.add(s.date || new Date(s.createdAt).toISOString().slice(0, 10));
    });
  });
  getLangStudySessions().forEach(s => {
    days.add(s.date || new Date(s.createdAt).toISOString().slice(0, 10));
  });
  return days;
}

function renderCalendar() {
  const activeDays = getActiveDays();
  const todayStr   = new Date().toISOString().slice(0, 10);
  const now        = new Date();

  const label = new Date(calYear, calMonth, 1)
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  document.getElementById('calMonthLabel').textContent =
    label.charAt(0).toUpperCase() + label.slice(1);

  const isCurrentMonth = calYear === now.getFullYear() && calMonth === now.getMonth();
  document.getElementById('calNext').disabled = isCurrentMonth;

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  let html = DOW_LABELS.map(d => `<div class="cal-dow">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day cal-day--empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    let cls = 'cal-day';
    if (activeDays.has(dateStr)) cls += ' cal-day--active';
    if (dateStr === todayStr)    cls += ' cal-day--today';
    html += `<div class="${cls}">${d}</div>`;
  }
  document.getElementById('calGrid').innerHTML = html;
}

document.getElementById('calPrev').addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});
document.getElementById('calNext').addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

// Suporte a swipe no calendário
(function() {
  const el = document.getElementById('calGrid');
  let startX = 0;
  el.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) document.getElementById('calNext').click();
    else        document.getElementById('calPrev').click();
  }, { passive: true });
})();
