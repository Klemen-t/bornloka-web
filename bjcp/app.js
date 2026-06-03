// ===== STORE (localStorage) =====
const Store = {
  KEY: 'bjcp_progress',
  defaults() {
    return {
      xp: 0, streak: 0, lastStudyDate: null,
      favorites: [], difficult: [],
      styleStats: {}, // {styleName: {correct,wrong}}
      catStats: {},   // {category: {correct,wrong}}
      totalCorrect: 0, totalWrong: 0,
    };
  },
  load() {
    try { return { ...this.defaults(), ...JSON.parse(localStorage.getItem(this.KEY) || '{}') }; }
    catch (e) { return this.defaults(); }
  },
  save(data) { localStorage.setItem(this.KEY, JSON.stringify(data)); },
  get() { return this._cache || (this._cache = this.load()); },
  update(fn) { const d = this.get(); fn(d); this._cache = d; this.save(d); },
  addXP(n) { this.update(d => d.xp += n); App.refreshBadges(); },
  recordAnswer(style, correct) {
    this.update(d => {
      const k = style.name;
      if (!d.styleStats[k]) d.styleStats[k] = { correct: 0, wrong: 0 };
      if (correct) { d.styleStats[k].correct++; d.totalCorrect++; }
      else { d.styleStats[k].wrong++; d.totalWrong++; }
      const cat = style.category;
      if (!d.catStats[cat]) d.catStats[cat] = { correct: 0, wrong: 0 };
      if (correct) d.catStats[cat].correct++; else d.catStats[cat].wrong++;
    });
  },
  toggleFav(name) {
    let isFav = false;
    this.update(d => {
      const i = d.favorites.indexOf(name);
      if (i >= 0) { d.favorites.splice(i, 1); isFav = false; }
      else { d.favorites.push(name); isFav = true; }
    });
    return isFav;
  },
  toggleDifficult(name) {
    let isD = false;
    this.update(d => {
      const i = d.difficult.indexOf(name);
      if (i >= 0) { d.difficult.splice(i, 1); isD = false; }
      else { d.difficult.push(name); isD = true; }
    });
    return isD;
  },
  updateStreak() {
    this.update(d => {
      const today = new Date().toDateString();
      if (d.lastStudyDate === today) return;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      d.streak = (d.lastStudyDate === yesterday) ? d.streak + 1 : 1;
      d.lastStudyDate = today;
    });
    App.refreshBadges();
  },
  reset() { this._cache = this.defaults(); this.save(this._cache); }
};

// ===== UTILS =====
const Utils = {
  speak(text) {
    if (!window.speechSynthesis) {
      Utils.toast('El teu navegador no suporta àudio', 'error');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  },
  getAbvColor(val) {
    if (!val) return 'var(--text2)';
    if (val < 4.5) return 'var(--blue)';
    if (val <= 6.0) return 'var(--green)';
    if (val <= 8.5) return '#fb923c'; // orange
    return 'var(--red)';
  },
  getIbuColor(val) {
    if (!val) return 'var(--text2)';
    if (val <= 20) return 'var(--blue)';
    if (val <= 40) return 'var(--green)';
    if (val <= 60) return '#fb923c'; // orange
    return 'var(--red)';
  },
  srmToColor(srm) {
    const colors = ['#FFE699', '#FFD878', '#FFCA5A', '#FFBF42', '#FBB123', '#F8A600',
      '#F39C00', '#EA8F00', '#E58500', '#DE7C00', '#D77200', '#CF6900', '#CB6200',
      '#C35900', '#BB5100', '#B54C00', '#B04500', '#A63E00', '#A13700', '#9B3200',
      '#952D00', '#8E2900', '#882300', '#821E00', '#7B1A00', '#771900', '#701400',
      '#6A0F00', '#660D00', '#5E0B00', '#5A0A02', '#560A05', '#520907', '#4C0505',
      '#470606', '#440607', '#3F0708', '#3B0607', '#3A070B', '#36080A'];
    const idx = Math.min(Math.max(Math.round(srm) - 1, 0), colors.length - 1);
    return colors[idx];
  },
  srmToName(srm) {
    if (!srm) return '—';
    if (srm <= 2) return 'Palla';
    if (srm <= 4) return 'Groc';
    if (srm <= 8) return 'Or';
    if (srm <= 14) return 'Ambre';
    if (srm <= 18) return 'Coure';
    if (srm <= 22) return 'Marró';
    if (srm <= 30) return 'Negre fosc';
    return 'Negre';
  },
  fmtRange(min, max, unit = '') {
    if (!min && !max) return '—';
    if (min && max) return `${min}–${max}${unit}`;
    return `${min || max}${unit}`;
  },
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
    return a;
  },
  pick(arr, n) { return this.shuffle(arr).slice(0, n); },
  truncate(text, limit) {
    if (!text || text.length <= limit + 40) return text;

    let nextDot = text.indexOf('. ', limit - 20);
    if (nextDot === -1) {
      const lastDot = text.lastIndexOf('.');
      if (lastDot > limit - 20) nextDot = lastDot;
    }

    if (nextDot !== -1 && nextDot < limit + 120) {
      return text.substring(0, nextDot + 1) + (nextDot >= text.length - 2 ? '' : '…');
    }

    const sub = text.substring(0, limit);
    const prevDot = sub.lastIndexOf('. ');
    if (prevDot > limit * 0.3) {
      return text.substring(0, prevDot + 1) + '…';
    }

    const sp = sub.lastIndexOf(' ');
    return text.substring(0, sp > 0 ? sp : limit) + '…';
  },
  toast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => t.remove(), 3000);
  },
  el(id) { return document.getElementById(id); },
  html(id, h) { document.getElementById(id).innerHTML = h; },
  trackEvent(eventName, params = {}) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  },

  linkify(text) {
    if (!text) return '';
    let res = text;
    const styles = BJCP_STYLES.map(s => s.name).filter(Boolean).sort((a,b)=>b.length - a.length);
    const replacements = [];
    
    const aliases = {
      'Marzen': ['Märzen', 'Märzenbier'],
      'Kolsch': ['Kölsch'],
      'Biere de Garde': ['Bière de Garde'],
      'Weissbier': ['Weißbier'],
      'Berliner Weisse': ['Berliner Weiße'],
      'Gueuze': ['Geuze']
    };

    styles.forEach(name => {
      let targets = [name];
      if (aliases[name]) targets = targets.concat(aliases[name]);
      
      targets.forEach(target => {
        if (res.includes(target)) {
          const token = `__STYLE_LINK_${replacements.length}__`;
          replacements.push({ token, name, target });
          res = res.split(target).join(token);
        }
      });
    });

    replacements.forEach(({ token, name, target }) => {
      res = res.split(token).join(`<span onclick="Study.openModal('${name.replace(/'/g, "\\'")}'); event.stopPropagation();" style="cursor:pointer;color:var(--accent);font-weight:600;white-space:nowrap;" title="Veure ${name.replace(/'/g, "\\'")}">${target}&nbsp;↗</span>`);
    });
    return res;
  },

  linkifyExamples(text) {
    if (!text || text === '-') return text;
    return text.split(',').map(ex => {
      const name = ex.trim();
      if (!name) return '';
      const url = `https://untappd.com/search?q=${encodeURIComponent(name)}`;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:var(--text); text-decoration:underline; text-decoration-color:var(--purple); text-underline-offset:2px; font-weight:600;" title="Buscar a Untappd">${name}&nbsp;↗</a>`;
    }).join(', ');
  },

  buildHelperHTML(style, context = 'modal', chosenName = null) {
    if (typeof STUDY_HELPERS === 'undefined') return '';
    const h = STUDY_HELPERS[style.number];
    if (!h) return '';
    const section = (icon, title, color, items) => items && items.length ? `
      <div class="helper-section">
        <div class="helper-title" style="color:${color}">${icon} ${title}</div>
        <ul class="helper-list">
          ${items.map(i => `<li>${Utils.linkify(i)}</li>`).join('')}
        </ul>
      </div>` : '';

    if (context === 'feedback-correct') {
      const confusionNote = h.confusableWith?.length
        ? `<div class="helper-confusion-note">⚠️ Sovint es confon amb: <em>${h.confusableWith.slice(0, 2).join(', ')}</em></div>` : '';
      return `<div class="study-helpers-panel helpers-correct">
        <div class="helpers-header">🧩 Perquè has encertat — reforç</div>
        ${section('🔑', 'Identificadors clau:', '#22c55e', h.keyIdentifiers)}
        ${confusionNote}
      </div>`;
    }

    if (context === 'feedback-wrong') {
      let confusionMsg = '';
      if (chosenName && h.confusableWith) {
        const chosenFirst = chosenName.toLowerCase().split(/[\s(]/)[0];
        const matched = h.confusableWith.find(c => c.toLowerCase().includes(chosenFirst));
        if (matched) {
          confusionMsg = `<div class="helper-confusion-alert">💡 Has triat <strong>${chosenName}</strong>, que és un dels estils que es confonen habitualment amb <strong>${style.name}</strong>. Recorda les diferències clau:</div>`;
        }
      }
      return `<div class="study-helpers-panel helpers-wrong">
        <div class="helpers-header">🧩 Per aprendre de l'error</div>
        ${confusionMsg}
        ${section('🔑', 'Identificadors clau de "' + style.name + '":', '#22c55e', h.keyIdentifiers?.slice(0, 3))}
        ${section('⚠️', 'Defectes comuns:', '#E5172F', h.commonFaults?.slice(0, 2))}
        ${section('🔀', 'No confondre amb:', '#E5A020', h.confusableWith?.slice(0, 3))}
      </div>`;
    }

    // Default: 'modal'
    return `<div class="study-helpers-panel">
      ${section('🔀', 'Confusió habitual amb:', '#E5A020', h.confusableWith)}
      ${section('🔑', 'Identificadors clau:', '#22c55e', h.keyIdentifiers)}
      ${section('⚠️', 'Defectes comuns:', '#E5172F', h.commonFaults)}
    </div>`;
  }
};


// ===== APP CONTROLLER =====
const App = {
  currentMode: 'study',
  init() {
    Store.updateStreak();
    this.refreshBadges();
    Study.init();
    // populate exam cat filter
    const cats = [...new Set(BJCP_STYLES.map(s => s.category).filter(Boolean))].sort();
    const sel = Utils.el('exam-cat-filter');
    cats.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o); });
  },
  showMode(mode) {
    document.querySelectorAll('.mode-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    Utils.el(`mode-${mode}`).classList.add('active');
    Utils.el(`tab-${mode}`).classList.add('active');
    this.currentMode = mode;
    Utils.trackEvent('page_view', { page_title: mode, page_path: '/' + mode });
    if (mode === 'stats') Stats.render();
    if (mode === 'detect') Detector.showLanding();
  },
  refreshBadges() {
    const d = Store.get();
    Utils.el('xp-display').textContent = `${d.xp} XP`;
    Utils.el('streak-display').textContent = d.streak;
  },
  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.dataset.theme === 'dark';
    html.dataset.theme = isDark ? 'light' : 'dark';
    Utils.el('theme-icon').textContent = isDark ? '🌙' : '☀️';
  },
  resetProgress() {
    if (!confirm('Segur que vols reiniciar tot el progrés? Aquesta acció és irreversible.')) return;
    Store.reset();
    this.refreshBadges();
    Stats.render();
    Utils.toast('Progrés reiniciat', 'info');
  }
};

// ===== STUDY MODULE =====
const Study = {
  filtered: [...BJCP_STYLES],
  searchQ: '', catQ: '', showFavs: false, showDiff: false,

  init() {
    // populate category filter
    const cats = [...new Set(BJCP_STYLES.map(s => s.category).filter(Boolean))].sort();
    const sel = Utils.el('cat-filter');
    cats.forEach(c => {
      const o = document.createElement('option');
      o.value = c; o.textContent = c; sel.appendChild(o);
    });
    this.render();
  },

  applyFilters() {
    const d = Store.get();
    this.filtered = BJCP_STYLES.filter(s => {
      const q = this.searchQ.toLowerCase();
      if (q && !s.name?.toLowerCase().includes(q) && !s.category?.toLowerCase().includes(q)) return false;
      if (this.catQ && s.category !== this.catQ) return false;
      if (this.showFavs && !d.favorites.includes(s.name)) return false;
      if (this.showDiff && !d.difficult.includes(s.name)) return false;
      return true;
    });
    Utils.el('style-count').textContent = `${this.filtered.length} estils`;
  },

  render() {
    this.applyFilters();
    const d = Store.get();
    const grid = Utils.el('cards-grid');
    if (!this.filtered.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;padding:60px 0">🔍 Cap estil trobat</div>';
      return;
    }
    grid.innerHTML = this.filtered.map(s => this.cardHTML(s, d)).join('');
  },

  cardHTML(s, d) {
    const isFav = d.favorites.includes(s.name);
    const isDiff = d.difficult.includes(s.name);
    const hasHelper = typeof STUDY_HELPERS !== 'undefined' && !!STUDY_HELPERS[s.number];
    const abv = Utils.fmtRange(s.abvmin, s.abvmax, '%');
    const ibuStr = Utils.fmtRange(s.ibumin, s.ibumax);
    const srmStr = Utils.fmtRange(s.srmmin, s.srmmax);
    const srmMid = s.srmmin && s.srmmax ? (s.srmmin + s.srmmax) / 2 : s.srmmin || s.srmmax;
    const srmColor = srmMid ? Utils.srmToColor(srmMid) : '#888';
    const tags = (s.tags || '').split(',').slice(0, 3).map(t => t.trim()).filter(Boolean);
    const srmGradAll = `linear-gradient(90deg, ${Utils.srmToColor(2)}, ${Utils.srmToColor(10)}, ${Utils.srmToColor(20)}, ${Utils.srmToColor(30)}, ${Utils.srmToColor(40)})`;
    const srmIcon = s.srmmin !== undefined ? `<div style="width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg, ${Utils.srmToColor(s.srmmin)}, ${Utils.srmToColor(s.srmmax||s.srmmin)});border:1px solid rgba(255,255,255,0.3)"></div>` : '';

    return `<div class="style-card${isDiff ? ' card-difficult' : ''}" style="--card-grad: linear-gradient(90deg, var(--accent), ${srmColor});" onclick="Study.openModal('${s.name.replace(/'/g, "\\'")}')">
      <div class="card-header">
        <span class="card-number">${s.number || '—'}</span>
        <div class="card-actions">
          <button class="card-action-btn" title="Preferit" onclick="event.stopPropagation();Study.toggleFav('${s.name.replace(/'/g, "\\'")}',this)">${isFav ? '❤️' : '🤍'}</button>
          <button class="card-action-btn" title="A repassar" onclick="event.stopPropagation();Study.toggleDiff('${s.name.replace(/'/g, "\\'")}',this)">${isDiff ? '📌' : '📍'}</button>
        </div>
      </div>
      <div class="card-name">${s.name}</div>
      <div class="card-category">${s.category || ''}</div>
      <div class="card-stats-block" style="background:var(--bg2); border:1px solid var(--border); border-radius:8px; padding:10px 12px; display:flex; flex-direction:column; gap:8px; margin: 12px 0;">
        ${abv !== '—' ? `
        <div style="display:flex;align-items:center;gap:6px;font-size:11.5px">
          <span style="color:var(--text3);font-weight:700;width:28px">ABV</span>
          <span style="font-size:9px;color:var(--text3);width:10px;text-align:right">0</span>
          <div style="flex:1;height:6px;background:rgba(139,92,246,0.2);border-radius:3px;position:relative"><div style="position:absolute;left:${Math.min(100, (s.abvmin/14)*100)}%;right:${Math.max(0, 100 - ((s.abvmax||s.abvmin)/14)*100)}%;background:#8b5cf6;height:100%;border-radius:3px"></div></div>
          <span style="font-size:9px;color:var(--text3);width:14px">14</span>
          <span style="min-width:46px;text-align:right;font-weight:600">${abv}</span>
        </div>` : ''}
        ${ibuStr !== '—' ? `
        <div style="display:flex;align-items:center;gap:6px;font-size:11.5px">
          <span style="color:var(--text3);font-weight:700;width:28px">IBU</span>
          <span style="font-size:9px;color:var(--text3);width:10px;text-align:right">0</span>
          <div style="flex:1;height:6px;background:rgba(59,130,246,0.2);border-radius:3px;position:relative"><div style="position:absolute;left:${Math.min(100, (s.ibumin/120)*100)}%;right:${Math.max(0, 100 - ((s.ibumax||s.ibumin)/120)*100)}%;background:#3b82f6;height:100%;border-radius:3px"></div></div>
          <span style="font-size:9px;color:var(--text3);width:14px">120</span>
          <span style="min-width:46px;text-align:right;font-weight:600">${ibuStr}</span>
        </div>` : ''}
        ${srmMid ? `
        <div style="display:flex;align-items:center;gap:6px;font-size:11.5px">
          <span style="color:var(--text3);font-weight:700;width:28px">SRM</span>
          <span style="font-size:9px;color:var(--text3);width:10px;text-align:right">0</span>
          <div style="flex:1;height:6px;background:${srmGradAll};border-radius:3px;position:relative"><div style="position:absolute;left:${Math.min(100, (s.srmmin/40)*100)}%;right:${Math.max(0, 100 - ((s.srmmax||s.srmmin)/40)*100)}%;top:-2px;bottom:-2px;border:2px solid var(--text);border-radius:4px;box-shadow:0 0 2px rgba(0,0,0,0.5);"></div></div>
          <span style="font-size:9px;color:var(--text3);width:14px">40</span>
          <div style="min-width:46px;display:flex;justify-content:flex-end;align-items:center;gap:4px;font-weight:600"><span>${srmStr}</span> ${srmIcon}</div>
        </div>` : ''}
      </div>
      <div class="card-desc">${s.overallimpression || s.aroma || ''}</div>
      ${tags.length ? `<div class="card-badges">${tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}</div>` : ''}
    </div>`;
  },

  toggleFav(name, btn) {
    const isFav = Store.toggleFav(name);
    btn.textContent = isFav ? '❤️' : '🤍';
    Utils.toast(isFav ? `${name} afegit a preferits` : `${name} eliminat de preferits`, 'info');
    if (this.showFavs) this.render();
  },

  toggleDiff(name, btn) {
    const isD = Store.toggleDifficult(name);
    btn.textContent = isD ? '📌' : '📍';
    const card = btn.closest('.style-card');
    card.classList.toggle('card-difficult', isD);
    Utils.toast(isD ? `${name} marcat per repassar` : `${name} ja no es repassa`, 'info');
    if (this.showDiff) this.render();
  },

  search(v) { this.searchQ = v; this.render(); },
  filterCat(v) { this.catQ = v; this.render(); },
  filterFavorites() {
    this.showFavs = !this.showFavs;
    if (this.showFavs) this.showDiff = false;
    Utils.el('fav-filter-btn').classList.toggle('active-filter', this.showFavs);
    Utils.el('diff-filter-btn').classList.remove('active-filter');
    this.render();
  },
  filterDifficult() {
    this.showDiff = !this.showDiff;
    if (this.showDiff) this.showFavs = false;
    Utils.el('diff-filter-btn').classList.toggle('active-filter', this.showDiff);
    Utils.el('fav-filter-btn').classList.remove('active-filter');
    this.render();
  },
  shuffle() {
    BJCP_STYLES.sort(() => Math.random() - 0.5);
    this.render();
    Utils.toast('Estils barrejats!', 'success');
  },

  openModal(name) {
    const s = BJCP_STYLES.find(x => x.name === name);
    if (!s) return;
    Utils.trackEvent('view_item', { item_name: s.name, item_category: s.category || 'Unknown' });
    const d = Store.get();
    const isFav = d.favorites.includes(s.name);
    const isDiff = d.difficult.includes(s.name);
    const abv = Utils.fmtRange(s.abvmin, s.abvmax, '%');
    const ibu = Utils.fmtRange(s.ibumin, s.ibumax);
    const og = Utils.fmtRange(s.ogmin, s.ogmax);
    const fg = Utils.fmtRange(s.fgmin, s.fgmax);
    const srmMid = s.srmmin && s.srmmax ? (s.srmmin + s.srmmax) / 2 : s.srmmin || s.srmmax;
    const abvMid = s.abvmin && s.abvmax ? (s.abvmin + s.abvmax) / 2 : s.abvmin || s.abvmax;
    const ibuMid = s.ibumin && s.ibumax ? (s.ibumin + s.ibumax) / 2 : s.ibumin || s.ibumax;
    const tags = (s.tags || '').split(',').map(t => t.trim()).filter(Boolean);

    const sections = [
      ['Impressió general', s.overallimpression],
      ['Aroma', s.aroma],
      ['Aparença', s.appearance],
      ['Sabor', s.flavor],
      ['Sensació en boca', s.mouthfeel],
      ['Comentaris', s.comments],
      ['Història', s.history],
      ['Ingredients característics', s.characteristicingredients],
      ['Comparació d\'estils', Utils.linkify(s.stylecomparison)],
      ['Exemples comercials', s.commercialexamples],
    ].filter(([, v]) => v && v !== '-');

    Utils.el('modal-content').innerHTML = `
      <div class="modal-top">
        <div>
          <div class="modal-number">${s.number || ''} · ${s.category || ''}</div>
          <div class="modal-name">
            ${s.name}
            ${s.pronunciation ? `<span class="pronunciation-btn" style="font-size:0.6em;color:var(--text3);font-weight:500;margin-left:8px;cursor:pointer;transition:color 0.2s;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text3)'" onclick="Utils.speak('${s.pronunciation.replace(/-/g, ' ').replace(/'/g, "\\'")}')" title="Escoltar pronunciació">🔊 / ${s.pronunciation} /</span>` : ''}
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:flex-start">
          <button class="card-action-btn" title="Preferit" style="font-size:20px" onclick="Study.toggleFav('${s.name.replace(/'/g, "\\'")}',this)">${isFav ? '❤️' : '🤍'}</button>
          <button class="card-action-btn" title="A repassar" style="font-size:20px" onclick="Study.toggleDiff('${s.name.replace(/'/g, "\\'")}',this)">${isDiff ? '📌' : '📍'}</button>
          <button class="modal-close" onclick="Study.closeModal()">✕</button>
        </div>
      </div>
      <div class="modal-stats">
        <div class="modal-stat"><div class="modal-stat-val" style="color:${abvMid ? Utils.getAbvColor(abvMid) : 'inherit'}">${abv}</div><div class="modal-stat-key">ABV</div></div>
        <div class="modal-stat"><div class="modal-stat-val" style="color:${ibuMid ? Utils.getIbuColor(ibuMid) : 'inherit'}">${ibu}</div><div class="modal-stat-key">IBU</div></div>
        ${og !== '—' ? `<div class="modal-stat"><div class="modal-stat-val" style="color:var(--purple)">${og}</div><div class="modal-stat-key">OG</div></div>` : ''}
        ${fg !== '—' ? `<div class="modal-stat"><div class="modal-stat-val" style="color:var(--purple)">${fg}</div><div class="modal-stat-key">FG</div></div>` : ''}
        <div class="modal-stat">
          <div class="modal-stat-val" style="color:${srmMid ? Utils.srmToColor(srmMid) : 'var(--text2)'}">${Utils.fmtRange(s.srmmin, s.srmmax)}</div>
          <div class="modal-stat-key">SRM</div>
        </div>
      </div>
      ${Utils.buildHelperHTML(s)}
      <div class="modal-sections">
        ${sections.map(([title, text], i) => {
          const isComm = title === 'Exemples comercials';
          const bgStyle = isComm ? 'background: var(--purple-bg); border-color: rgba(200,150,10,0.3);' : '';
          const titleStyle = isComm ? 'color: var(--purple);' : '';
          const textStyle = isComm ? 'color: var(--text);' : '';
          const content = isComm ? Utils.linkifyExamples(text) : text;
          return `
          <div class="modal-section${i < 4 ? '' : ' full'}" ${bgStyle ? `style="${bgStyle}"` : ''}>
            <div class="modal-section-title" ${titleStyle ? `style="${titleStyle}"` : ''}>${title}</div>
            <div class="modal-section-text" ${textStyle ? `style="${textStyle}"` : ''}>${content}</div>
          </div>`;
        }).join('')}
      </div>
      ${tags.length ? `<div class="modal-tags">${tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}</div>` : ''}
    `;
    const overlay = Utils.el('detail-modal');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    Store.updateStreak();
  },

  closeModal(e) {
    if (e && e.target !== Utils.el('detail-modal')) return;
    Utils.el('detail-modal').classList.remove('open');
    document.body.style.overflow = '';
  }
};

// ===== QUIZ MODULE =====
const Quiz = {
  type: null, questions: [], current: 0, score: 0, errors: [],
  answered: false,

  start(type) {
    this.type = type;
    this.questions = this.generateQuestions(type, 10);
    this.current = 0; this.score = 0; this.errors = []; this.answered = false;
    Utils.el('quiz-selector').classList.add('hidden');
    Utils.el('quiz-results').classList.add('hidden');
    Utils.el('quiz-game').classList.remove('hidden');
    this.showQuestion();
  },

  generateQuestions(type, n) {
    const d = Store.get();
    const withData = BJCP_STYLES.filter(s =>
      s.name && s.category && (s.abvmin || s.abvmax) &&
      s.aroma && s.aroma.length > 30 && !s.aroma.startsWith('Igual') && !s.aroma.startsWith('Varia')
    );
    const basePool = withData.length >= n ? withData : BJCP_STYLES.filter(s => s.name && s.category);
    // Adaptive: styles with more errors appear more frequently (up to 5x)
    const weighted = [];
    basePool.forEach(s => {
      const st = d.styleStats[s.name];
      let weight = 1;
      if (st) {
        const total = st.correct + st.wrong;
        const accuracy = total > 0 ? st.correct / total : 0.5;
        weight = Math.max(1, Math.round((1 - accuracy) * 4) + 1);
      }
      for (let i = 0; i < weight; i++) weighted.push(s);
    });
    const seen = new Set();
    const pool = Utils.shuffle(weighted).filter(s => { if (seen.has(s.name)) return false; seen.add(s.name); return true; });
    return pool.slice(0, n).map(s => {
      const t = type === 'mix' ? (Math.random() < 0.5 ? 'guess' : 'define') : type;
      return this.buildQuestion(s, t, pool);
    });
  },

  buildQuestion(style, type, pool) {
    if (type === 'guess') {
      const profile = this.pickGuessProfile(style);
      let distractors, keyClue;
      if (profile === 'confusion') {
        distractors = this.getDistractorsForConfusion(style, pool, 3);
        const h_c = typeof STUDY_HELPERS !== 'undefined' ? STUDY_HELPERS[style.number] : null;
        keyClue = h_c?.keyIdentifiers ? Utils.shuffle([...h_c.keyIdentifiers])[0] : '';
      } else {
        distractors = this.getDistractors(style, pool, 3);
      }
      const options = Utils.shuffle([style, ...distractors]);
      return { style, type: 'guess', options, correct: style.name, profile, keyClue };
    } else {
      // Show name, guess a random parameter (ABV, IBU, SRM, Category, Commercial Examples)
      const possibleSubtypes = [];
      const h_key = typeof STUDY_HELPERS !== 'undefined' ? STUDY_HELPERS[style.number] : null;
      if ((style.abvmin !== undefined && style.abvmin !== null) || (style.abvmax !== undefined && style.abvmax !== null)) possibleSubtypes.push('abv');
      if ((style.ibumin !== undefined && style.ibumin !== null) || (style.ibumax !== undefined && style.ibumax !== null)) possibleSubtypes.push('ibu');
      if ((style.srmmin !== undefined && style.srmmin !== null) || (style.srmmax !== undefined && style.srmmax !== null)) possibleSubtypes.push('srm');
      if (style.category) possibleSubtypes.push('category');
      if (style.commercialexamples && style.commercialexamples.trim().length > 5 && style.commercialexamples !== '-') possibleSubtypes.push('examples');
      if (h_key?.keyIdentifiers?.length) possibleSubtypes.push('key_id');

      const subtype = possibleSubtypes.length > 0 ? Utils.shuffle(possibleSubtypes)[0] : 'abv';

      let correct = '';
      let options = [];

      // Pick n distractors that differ from correct midpoint by at least minDist
      const distPick = (src, midFn, cMid, minDist, n) => {
        const far = Utils.shuffle(src.filter(s => Math.abs(midFn(s) - cMid) >= minDist));
        return far.length >= n ? far.slice(0, n) : Utils.shuffle(src).slice(0, n);
      };
      if (subtype === 'abv') {
        correct = Utils.fmtRange(style.abvmin, style.abvmax, '% ABV');
        const cMid = ((style.abvmin || 0) + (style.abvmax || 0)) / 2;
        const src = pool.filter(s => s.name !== style.name && (s.abvmin || s.abvmax) && Utils.fmtRange(s.abvmin, s.abvmax, '% ABV') !== correct);
        const picked = distPick(src, s => ((s.abvmin || 0) + (s.abvmax || 0)) / 2, cMid, 1.5, 3);
        options = Utils.shuffle([correct, ...picked.map(s => Utils.fmtRange(s.abvmin, s.abvmax, '% ABV'))]);
      } else if (subtype === 'ibu') {
        correct = Utils.fmtRange(style.ibumin, style.ibumax, ' IBU');
        if (correct === '—') correct = 'Sense especificar';
        const cMid = ((style.ibumin || 0) + (style.ibumax || 0)) / 2;
        const src = pool.filter(s => s.name !== style.name && (s.ibumin || s.ibumax) && Utils.fmtRange(s.ibumin, s.ibumax, ' IBU') !== correct);
        const picked = distPick(src, s => ((s.ibumin || 0) + (s.ibumax || 0)) / 2, cMid, 20, 3);
        options = Utils.shuffle([correct, ...picked.map(s => Utils.fmtRange(s.ibumin, s.ibumax, ' IBU'))]);
      } else if (subtype === 'srm') {
        const mid = (style.srmmin + style.srmmax) / 2 || style.srmmin || style.srmmax;
        correct = `${Utils.fmtRange(style.srmmin, style.srmmax)} SRM (${Utils.srmToName(mid)})`;
        const src = pool.filter(s => s.name !== style.name && (s.srmmin || s.srmmax));
        const picked = distPick(src, s => (s.srmmin + s.srmmax) / 2 || s.srmmin || s.srmmax, mid, 4, 3);
        options = Utils.shuffle([correct, ...picked.map(s => {
          const m = (s.srmmin + s.srmmax) / 2 || s.srmmin || s.srmmax;
          return `${Utils.fmtRange(s.srmmin, s.srmmax)} SRM (${Utils.srmToName(m)})`;
        })]);
      } else if (subtype === 'category') {
        correct = style.category;
        const others = [...new Set(pool.filter(s => s.category !== style.category).map(s => s.category))];
        options = Utils.shuffle([correct, ...Utils.shuffle(others).slice(0, 3)]);
      } else if (subtype === 'examples') {
        const getCleanExamples = (s) => {
          const arr = (s.commercialexamples || '').split(',').map(e => e.trim()).filter(Boolean);
          return arr.slice(0, 2).join(', ');
        };
        correct = getCleanExamples(style);
        const others = Utils.shuffle(pool.filter(s => s.name !== style.name && s.commercialexamples && s.commercialexamples.trim().length > 5 && s.commercialexamples !== '-'))
          .slice(0, 3).map(s => getCleanExamples(s));
        options = Utils.shuffle([correct, ...others]);
      } else if (subtype === 'key_id') {
        const keyClue = Utils.shuffle([...h_key.keyIdentifiers])[0];
        correct = style.name;
        const confusionNames = (h_key.confusableWith || []).map(c => { const m = c.match(/^(.+?)\s*\(/); return m ? m[1].trim() : c.trim(); });
        const confDist = Utils.shuffle(pool.filter(s => s.name !== style.name && confusionNames.includes(s.name)));
        const fallDist = Utils.shuffle(pool.filter(s => s.name !== style.name && !confusionNames.includes(s.name)));
        const kidDist = [...confDist, ...fallDist].slice(0, 3);
        while (kidDist.length < 3) { const extra = Utils.shuffle(pool.filter(s => s.name !== style.name && !kidDist.find(d => d.name === s.name)))[0]; if (extra) kidDist.push(extra); else break; }
        options = Utils.shuffle([style.name, ...kidDist.map(s => s.name)]);
        return { style, type: 'define', subtype: 'key_id', options, correct, keyClue };
      }

      // Ensure unique options
      options = [...new Set(options)];
      // If we don't have enough unique options, fill with random distractors
      while (options.length < 4) {
        if (subtype === 'abv') {
          const cMid = ((style.abvmin || 0) + (style.abvmax || 0)) / 2;
          const sign = options.length % 2 === 0 ? 1 : -1;
          const lo = Math.max(1, +(cMid + sign * (2 + Math.random() * 3)).toFixed(1));
          options.push(`${lo}–${+(lo + 1.5 + Math.random() * 1.5).toFixed(1)}% ABV`);
        } else if (subtype === 'ibu') {
          const cMid = ((style.ibumin || 0) + (style.ibumax || 0)) / 2;
          const sign = options.length % 2 === 0 ? 1 : -1;
          const base = Math.max(5, Math.round(cMid + sign * (22 + Math.random() * 15)));
          options.push(`${base}–${base + 10 + Math.round(Math.random() * 15)} IBU`);
        } else if (subtype === 'srm') {
          const cMid = ((style.srmmin || 0) + (style.srmmax || 0)) / 2;
          const sign = options.length % 2 === 0 ? 1 : -1;
          const base = Math.max(1, Math.round(cMid + sign * (5 + Math.random() * 5)));
          options.push(`${base}–${base + 3 + Math.round(Math.random() * 5)} SRM (${Utils.srmToName(base + 2)})`);
        } else {
          options.push('Opció genèrica ' + options.length);
        }
        options = [...new Set(options)];
      }
      options = Utils.shuffle(options);

      return { style, type: 'define', subtype, options, correct };
    }
  },

  pickGuessProfile(style) {
    const c = ['sensory', 'sensory']; // sensory weighted 2x
    if ((style.aroma || '').length > 50 && style.flavor) c.push('tasting');
    if ((style.history || '').length > 40) c.push('history');
    if ((style.characteristicingredients || '').length > 20) c.push('ingredients');
    if ((style.comments || '').length > 30) c.push('comments');
    if ((style.stylecomparison || '').length > 30) c.push('stylecomparison');
    if (typeof STUDY_HELPERS !== 'undefined' && STUDY_HELPERS[style.number]?.keyIdentifiers?.length) {
      c.push('confusion'); c.push('confusion'); // weighted 2x
    }
    return Utils.shuffle(c)[0];
  },

  getDistractors(style, pool, n) {
    // Score each candidate by similarity → higher = more confusing (better distractor)
    const abvMid = ((style.abvmin || 0) + (style.abvmax || 0)) / 2;
    const ibuMid = ((style.ibumin || 0) + (style.ibumax || 0)) / 2;
    const srmMid = ((style.srmmin || 0) + (style.srmmax || 0)) / 2;
    const aromaWords = new Set((style.aroma || '').toLowerCase().split(/[\s,;.()]+/).filter(w => w.length > 4));
    const scored = pool.filter(s => s.name !== style.name).map(s => {
      let pts = 0;
      if (s.category === style.category) pts += 8;
      const sAbv = ((s.abvmin || 0) + (s.abvmax || 0)) / 2;
      if (Math.abs(abvMid - sAbv) <= 1.5) pts += 4;
      const sIbu = ((s.ibumin || 0) + (s.ibumax || 0)) / 2;
      if (Math.abs(ibuMid - sIbu) <= 12) pts += 3;
      const sSrm = ((s.srmmin || 0) + (s.srmmax || 0)) / 2;
      if (Math.abs(srmMid - sSrm) <= 5) pts += 2;
      const sWords = (s.aroma || '').toLowerCase().split(/[\s,;.()]+/).filter(w => w.length > 4);
      pts += Math.min(sWords.filter(w => aromaWords.has(w)).length * 1.5, 5);
      pts += Math.random() * 2; // slight randomness to avoid always same set
      return { style: s, pts };
    }).sort((a, b) => b.pts - a.pts);
    return Utils.shuffle(scored.slice(0, Math.max(n * 4, 12))).slice(0, n).map(c => c.style);
  },

  getDistractorsForConfusion(style, pool, n) {
    const h = typeof STUDY_HELPERS !== 'undefined' ? STUDY_HELPERS[style.number] : null;
    if (!h?.confusableWith?.length) return this.getDistractors(style, pool, n);
    const confusionNames = h.confusableWith.map(c => {
      const m = c.match(/^(.+?)\s*\(/); return m ? m[1].trim() : c.trim();
    });
    const confusionStyles = Utils.shuffle(pool.filter(s =>
      s.name !== style.name && confusionNames.some(cn => s.name === cn)
    ));
    const regular = this.getDistractors(style, pool, n * 2).filter(s => !confusionStyles.find(c => c.name === s.name));
    return Utils.shuffle([...confusionStyles, ...regular]).slice(0, n);
  },

  generateTastingNote(s) {
    const srmMid = ((s.srmmin || 0) + (s.srmmax || 0)) / 2 || s.srmmin || s.srmmax;
    const abvMid = ((s.abvmin || 0) + (s.abvmax || 0)) / 2;
    const ibuMid = ((s.ibumin || 0) + (s.ibumax || 0)) / 2;
    const strength = abvMid < 4 ? 'de baixa graduació' : abvMid < 5.5 ? 'de força estàndard' : abvMid < 7.5 ? 'de força moderada-alta' : 'forta';
    const bitter = ibuMid < 15 ? 'molt baixa' : ibuMid < 25 ? 'baixa' : ibuMid < 40 ? 'moderada' : ibuMid < 60 ? 'alta' : 'molt alta';
    let note = '';
    if (s.appearance) {
      note += `<p><strong>Aparença:</strong> ${s.appearance.substring(0, 160).replace(/\.\s*$/, '').replace(/\n/g, ' ')}.</p>`;
    } else if (srmMid) {
      note += `<p><strong>Aparença:</strong> Cervesa de color ${Utils.srmToName(srmMid).toLowerCase()}, ${strength}.</p>`;
    }
    if (s.aroma) note += `<p><strong>Aroma:</strong> ${s.aroma.substring(0, 250).replace(/\n/g, ' ')}</p>`;
    if (s.flavor) note += `<p><strong>Sabor:</strong> ${s.flavor.substring(0, 250).replace(/\n/g, ' ')}</p>`;
    if (s.mouthfeel) note += `<p><strong>Sensació:</strong> ${s.mouthfeel.substring(0, 150).replace(/\n/g, ' ')}</p>`;
    if (!note) note = `<p>Cervesa ${strength} amb amargor ${bitter}.</p>`;
    return note;
  },

  setConfidence(level) {
    if (this.answered) return; // guard against double-tap
    this.answered = true;
    const q = this.questions[this.current];
    const chosen = this._pendingChosen;
    if (!chosen) return; // no answer selected yet
    const correct = q.correct;
    const isCorrect = chosen === correct;

    // Lock all buttons and reveal correct/wrong
    document.querySelectorAll('.answer-btn').forEach(btn => {
      btn.disabled = true;
      btn.style.boxShadow = '';
      const btnText = btn.textContent.replace(/\s+/g, ' ').trim();
      if (q.type === 'guess') {
        if (btnText.startsWith(correct)) btn.classList.add('correct');
        else if (btnText.startsWith(chosen) && !isCorrect) btn.classList.add('wrong');
      } else {
        if (btnText === correct) btn.classList.add('correct');
        else if (btnText === chosen && !isCorrect) btn.classList.add('wrong');
      }
    });

    let baseXP = 0;
    if (isCorrect) {
      baseXP = 10;
      this.score += 10;
      Store.addXP(10);
    } else {
      this.errors.push({ q: q.type === 'guess' ? 'Quin estil és?' : q.style.name, correct });
    }
    Store.recordAnswer(q.style, isCorrect);

    let bonusXP = 0;
    if (isCorrect) {
      if (level === 'sure') { bonusXP = 5; Utils.toast('🎯 Correcte i n\'estaves segur! +15 XP', 'success'); }
      else if (level === 'guess') { bonusXP = -3; Utils.toast('💡 Has tingut sort! +7 XP', 'info'); }
      else { Utils.toast('✅ Correcte! +10 XP', 'success'); }
    } else {
      if (level === 'sure') { bonusXP = -10; Utils.toast('⚠️ Molt segur i has fallat! -10 XP', 'error'); }
      else if (level === 'doubt') { bonusXP = -2; Utils.toast('❌ Incorrecte, però dubtaves.', 'error'); }
      else { Utils.toast('❌ Incorrecte', 'error'); }
    }

    if (bonusXP !== 0) { this.score = Math.max(0, this.score + bonusXP); Store.addXP(bonusXP); }
    Utils.el('quiz-score-live').textContent = `Puntuació: ${this.score}`;

    // Show feedback
    const fb = Utils.el('quiz-feedback');
    fb.className = `quiz-feedback${isCorrect ? '' : ' wrong-fb'}`;
    const chosenStyleName = (q.type === 'guess' || q.subtype === 'key_id') ? chosen : null;
    const helperCtx = isCorrect ? 'feedback-correct' : 'feedback-wrong';
    fb.innerHTML = `
      <div class="feedback-title">${isCorrect ? '\u2705 Correcte!' : `\u274c La resposta correcta era: ${correct}`}</div>
      <div class="feedback-text">${q.style.overallimpression?.substring(0, 200) || ''}${q.style.overallimpression?.length > 200 ? '\u2026' : ''}</div>
      ${Utils.buildHelperHTML(q.style, helperCtx, isCorrect ? null : chosenStyleName)}`;
    fb.classList.remove('hidden');

    Utils.el('quiz-confidence').classList.add('hidden');
    Utils.el('next-btn').classList.remove('hidden');
  },

  showQuestion() {
    const q = this.questions[this.current];
    this.answered = false;
    const total = this.questions.length;
    const pct = (this.current / total) * 100;
    Utils.el('quiz-progress-fill').style.width = pct + '%';
    Utils.el('quiz-q-counter').textContent = `Pregunta ${this.current + 1}/${total}`;
    Utils.el('quiz-score-live').textContent = `Puntuació: ${this.score}`;
    Utils.el('quiz-feedback').classList.add('hidden');
    Utils.el('next-btn').classList.add('hidden');
    Utils.el('quiz-confidence').classList.add('hidden');

    if (q.type === 'guess') {
      const s = q.style;
      const tags = (s.tags || '').split(',').map(t => t.trim()).filter(Boolean);
      const tagsHTML = tags.length ? `<div class="q-char wide q-char-tags"><div class="q-char-label">Tags</div><div class="q-tags">${tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}</div></div>` : '';
      const statsHTML = [
        s.abvmin || s.abvmax ? `<div class="q-char"><div class="q-char-label">ABV</div><div class="q-char-val">${Utils.fmtRange(s.abvmin, s.abvmax, '%')}</div></div>` : '',
        s.ibumin || s.ibumax ? `<div class="q-char"><div class="q-char-label">IBU</div><div class="q-char-val">${Utils.fmtRange(s.ibumin, s.ibumax)}</div></div>` : '',
        s.srmmin || s.srmmax ? `<div class="q-char"><div class="q-char-label">Color</div><div class="q-char-val">${Utils.srmToName((s.srmmin + s.srmmax) / 2)}</div></div>` : '',
      ].join('');
      const wide = (lbl, txt, lim = 380) => `<div class="q-char wide"><div class="q-char-label">${lbl}</div><div class="q-char-val">${Utils.truncate(txt, lim)}</div></div>`;

      if (q.profile === 'tasting') {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🍺 Tasting Mode — Identifica l'estil</div>
          <div class="question-title">Quina cervesa descriu aquesta nota de tast?</div>
          <div class="tasting-note">${this.generateTastingNote(s)}</div>`;
      } else if (q.profile === 'history') {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">📜 Conèixes la seva història?</div>
          <div class="question-title">Quin estil descriu aquest origen i evolució?</div>
          <div class="question-chars">${wide('Història', s.history, 450)}${tagsHTML}</div>`;
      } else if (q.profile === 'ingredients') {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🌾 Ingredients característics</div>
          <div class="question-title">Quin estil utilitza aquests ingredients?</div>
          <div class="question-chars">${statsHTML}${wide('Ingredients característics', s.characteristicingredients, 380)}${tagsHTML}</div>`;
      } else if (q.profile === 'comments') {
        const cmpH = s.stylecomparison ? wide('Comparació d\'estils', Utils.linkify(s.stylecomparison), 300) : '';
        Utils.el('question-card').innerHTML = `
          <div class="question-label">💬 Comentaris de l'estil</div>
          <div class="question-title">A quin estil es refereixen aquests comentaris?</div>
          <div class="question-chars">${wide('Comentaris', s.comments, 420)}${cmpH}</div>`;
      } else if (q.profile === 'stylecomparison') {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">⚖️ Comparació d'estils</div>
          <div class="question-title">De quin estil parla aquesta comparació?</div>
          <div class="question-chars">${wide('Comparació d\'estils', Utils.linkify(s.stylecomparison), 450)}${tagsHTML}</div>`;
      } else if (q.profile === 'confusion') {
        const keyClue = q.keyClue || (typeof STUDY_HELPERS !== 'undefined' && STUDY_HELPERS[s.number]?.keyIdentifiers
          ? Utils.shuffle([...STUDY_HELPERS[s.number].keyIdentifiers])[0] : '');
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🧩 Confusió d'estils</div>
          <div class="question-title">Quin estil té aquest identificador clau?</div>
          <div class="question-chars">
            <div class="q-char wide q-char-keyid">
              <div class="q-char-label">Identificador clau</div>
              <div class="q-char-val" style="font-style:italic;font-size:15px">&ldquo;${keyClue}&rdquo;</div>
            </div>
            ${statsHTML}
          </div>`;
      } else {
        // sensory (default)
        const chars = [
          s.aroma ? wide('Aroma', s.aroma, 380) : '',
          s.flavor ? wide('Sabor', s.flavor, 380) : '',
          s.mouthfeel ? wide('Sensació', s.mouthfeel, 280) : '',
        ].join('');
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🍺 Endevina l'estil BJCP</div>
          <div class="question-title">Quin estil és aquesta cervesa?</div>
          <div class="question-chars">${statsHTML}${chars}</div>`;
      }
      Utils.el('answers-grid').innerHTML = q.options.map(opt => `
        <button class="answer-btn" onclick="Quiz.answer('${opt.name.replace(/'/g, "\\'")}')">
          ${opt.name}
          <div style="font-size:11px;color:var(--text3);font-weight:400;margin-top:4px">${opt.category || ''}</div>
        </button>`).join('');
    } else {
      const s = q.style;
      let prompt = "Defineix aquest estil";
      if (q.subtype === 'abv') prompt = "Quin és el rang d'alcohol (ABV) d'aquest estil?";
      else if (q.subtype === 'ibu') prompt = "Quin és el rang d'amargor (IBU) d'aquest estil?";
      else if (q.subtype === 'srm') prompt = "Quin és el color típic (SRM) d'aquest estil?";
      else if (q.subtype === 'category') prompt = "A quina categoria pertany aquest estil?";
      else if (q.subtype === 'examples') prompt = "Quins d'aquests són exemples comercials d'aquest estil?";
      else if (q.subtype === 'key_id') prompt = "A quin estil pertany aquest identificador clau?";

      if (q.subtype === 'key_id') {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🧩 Identifica l'estil</div>
          <div class="question-title">A quin estil pertany aquest identificador clau?</div>
          <div class="question-chars">
            <div class="q-char wide q-char-keyid">
              <div class="q-char-label">Identificador clau</div>
              <div class="q-char-val" style="font-style:italic">&ldquo;${q.keyClue}&rdquo;</div>
            </div>
          </div>`;
      } else {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">📋 Defineix l'estil</div>
          <div class="question-title" style="margin-bottom:8px">${s.name}</div>
          <div style="font-size:14px;color:var(--accent);font-weight:600;margin-bottom:16px">${prompt}</div>`;
      }

      Utils.el('answers-grid').innerHTML = q.options.map(opt => `
        <button class="answer-btn" onclick="Quiz.answer('${opt.replace(/'/g, "\\'")}')">
          ${opt}
        </button>`).join('');
    }
  },

  answer(chosen) {
    if (this.answered) return;
    // Don't lock yet — user can still change selection before confirming confidence
    this._pendingChosen = chosen;
    const q = this.questions[this.current];

    // Clear all highlights, mark chosen temporarily
    document.querySelectorAll('.answer-btn').forEach(btn => {
      btn.style.boxShadow = '';
      const btnText = btn.textContent.replace(/\s+/g, ' ').trim();
      if (q.type === 'guess') {
        if (btnText.startsWith(chosen)) btn.style.boxShadow = '0 0 0 3px var(--accent)';
      } else {
        if (btnText === chosen) btn.style.boxShadow = '0 0 0 3px var(--accent)';
      }
    });

    // Show confidence calibration (without locking yet)
    Utils.el('quiz-confidence').classList.remove('hidden');
  },

  nextQuestion() {
    this.current++;
    if (this.current >= this.questions.length) { this.showResults(); return; }
    this.showQuestion();
  },

  renderResults() {
    const pct = Math.round((this.score / (this.questions.length * 10)) * 100);
    Utils.trackEvent('quiz_completed', { score: this.score, percentage: pct, type: 'quiz' });

    Utils.el('quiz-progress').innerHTML = '';
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '🤔' : '💪';
    const msg = pct >= 80 ? 'Excel·lent!' : pct >= 60 ? 'Molt bé!' : pct >= 40 ? 'Continua practicant!' : 'Cal estudiar més!';
    const errHTML = this.errors.length ? `
      <div class="errors-list">
        <h4 style="margin-bottom:12px;color:var(--text2)">Errors (${this.errors.length}):</h4>
        ${this.errors.map(e => `
          <div class="error-item">
            <div class="error-q">${e.q}</div>
            <div class="error-correct">✓ ${e.correct}</div>
          </div>`).join('')}
      </div>` : '';
    const res = Utils.el('quiz-results');
    res.innerHTML = `
      <div class="quiz-results">
        <div style="font-size:72px;margin-bottom:16px">${emoji}</div>
        <h2 class="result-title">${msg}</h2>
        <p class="result-subtitle">Has aconseguit ${this.score} de ${this.questions.length * 10} punts</p>
        <div class="result-breakdown">
          <div class="result-stat"><span class="result-stat-val" style="color:var(--accent)">${pct}%</span><span class="result-stat-key">Precisió</span></div>
          <div class="result-stat"><span class="result-stat-val" style="color:var(--green)">${this.questions.length - this.errors.length}</span><span class="result-stat-key">Correctes</span></div>
          <div class="result-stat"><span class="result-stat-val" style="color:var(--red)">${this.errors.length}</span><span class="result-stat-key">Errors</span></div>
          <div class="result-stat"><span class="result-stat-val">${this.score}</span><span class="result-stat-key">Punts</span></div>
        </div>
        ${errHTML}
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="Quiz.start('${this.type}')">🔄 Tornar a jugar</button>
          <button class="btn btn-outline" onclick="Quiz.backToSelector()">← Canviar tipus</button>
        </div>
      </div>`;
    res.classList.remove('hidden');
  },

  showResults() {
    Utils.el('quiz-game').classList.add('hidden');
    this.renderResults();
  },

  abort() { this.backToSelector(); },
  backToSelector() {
    Utils.el('quiz-game').classList.add('hidden');
    Utils.el('quiz-results').classList.add('hidden');
    Utils.el('quiz-selector').classList.remove('hidden');
  }
};

// ===== EXAM MODULE =====
const Exam = {
  nQuestions: 10, timePerQ: 30, questions: [], current: 0,
  score: 0, errors: [], timerInterval: null, timeLeft: 0,

  setN(btn, n) {
    document.querySelectorAll('#exam-setup .config-btn[data-n]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); this.nQuestions = n;
  },
  setTime(btn, t) {
    document.querySelectorAll('#exam-setup .config-btn[data-t]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); this.timePerQ = t;
  },

  start() {
    const cat = Utils.el('exam-cat-filter').value;
    let pool = BJCP_STYLES.filter(s => s.name && s.category);
    if (cat) pool = pool.filter(s => s.category === cat);
    if (pool.length < 4) { Utils.toast('Pocs estils en aquesta categoria per generar preguntes', 'error'); return; }

    this.questions = Utils.shuffle(pool).slice(0, Math.min(this.nQuestions, pool.length))
      .map(s => Quiz.buildQuestion(s, 'guess', pool));
    this.current = 0; this.score = 0; this.errors = [];
    Utils.el('exam-setup').classList.add('hidden');
    Utils.el('exam-results').classList.add('hidden');
    Utils.el('exam-game').classList.remove('hidden');
    this.showQuestion();
  },

  showQuestion() {
    const q = this.questions[this.current];
    const total = this.questions.length;
    Utils.el('exam-q-counter').textContent = `${this.current + 1} / ${total}`;
    Utils.el('exam-progress-fill').style.width = `${((this.current) / total) * 100}%`;
    Utils.el('exam-score-live').textContent = this.score;
    Utils.el('exam-feedback').classList.add('hidden');
    Utils.el('exam-next-btn').classList.add('hidden');
    this.answered = false;

    const s = q.style;
    const chars = [
      s.abvmin || s.abvmax ? { label: 'ABV', val: Utils.fmtRange(s.abvmin, s.abvmax, '%'), wide: false } : null,
      s.ibumin || s.ibumax ? { label: 'IBU', val: Utils.fmtRange(s.ibumin, s.ibumax), wide: false } : null,
      s.srmmin || s.srmmax ? { label: 'Color', val: Utils.srmToName((s.srmmin + s.srmmax) / 2 || s.srmmin || s.srmmax), wide: false } : null,
      s.aroma ? { label: 'Aroma', val: s.aroma.length > 300 ? s.aroma.substring(0, 300) + '…' : s.aroma, wide: true } : null,
      s.flavor ? { label: 'Sabor', val: s.flavor.length > 300 ? s.flavor.substring(0, 300) + '…' : s.flavor, wide: true } : null,
      s.mouthfeel ? { label: 'Sensació', val: s.mouthfeel.length > 250 ? s.mouthfeel.substring(0, 250) + '…' : s.mouthfeel, wide: true } : null,
    ].filter(Boolean);

    Utils.el('exam-question-card').innerHTML = `
      <div class="question-label">🧪 Pregunta ${this.current + 1}</div>
      <div class="question-title">Quin estil BJCP és?</div>
      <div class="question-chars">
        ${chars.map(c => `
          <div class="q-char ${c.wide ? 'wide' : ''}">
            <div class="q-char-label">${c.label}</div>
            <div class="q-char-val">${c.val}</div>
          </div>`).join('')}
      </div>`;

    Utils.el('exam-answers-grid').innerHTML = q.options.map(opt => `
      <button class="answer-btn" onclick="Exam.answer('${opt.name.replace(/'/g, "\\'")}')">
        ${opt.name}
        <div style="font-size:11px;color:var(--text3);margin-top:4px">${opt.category || ''}</div>
      </button>`).join('');

    if (this.timePerQ > 0) this.startTimer();
  },

  startTimer() {
    clearInterval(this.timerInterval);
    this.timeLeft = this.timePerQ;
    const path = Utils.el('timer-fill-path');
    const text = Utils.el('exam-timer-text');
    const circ = 100;
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const pct = this.timeLeft / this.timePerQ;
      text.textContent = this.timeLeft;
      if (path) path.style.strokeDashoffset = circ - (pct * circ);
      if (path && this.timeLeft <= 5) path.style.stroke = 'var(--red)';
      else if (path) path.style.stroke = 'var(--accent)';
      if (this.timeLeft <= 0) { clearInterval(this.timerInterval); this.timeOut(); }
    }, 1000);
    // init
    if (path) { path.style.strokeDashoffset = 0; path.style.stroke = 'var(--accent)'; }
    text.textContent = this.timePerQ;
  },

  timeOut() {
    if (this.answered) return;
    this.answered = true;
    document.querySelectorAll('#exam-answers-grid .answer-btn').forEach(b => b.disabled = true);
    const q = this.questions[this.current];
    this.errors.push({ q: 'Temps esgotat', correct: q.correct });
    Store.recordAnswer(q.style, false);
    const fb = Utils.el('exam-feedback');
    fb.className = 'quiz-feedback wrong-fb';
    fb.innerHTML = `<div class="feedback-title">⏱ Temps esgotat!</div><div class="feedback-text">La resposta era: <strong>${q.correct}</strong></div>`;
    fb.classList.remove('hidden');
    Utils.el('exam-next-btn').classList.remove('hidden');
  },

  answer(chosen) {
    if (this.answered) return;
    this.answered = true;
    clearInterval(this.timerInterval);
    const q = this.questions[this.current];
    const isCorrect = chosen === q.correct;

    document.querySelectorAll('#exam-answers-grid .answer-btn').forEach(btn => {
      btn.disabled = true;
      const t = btn.textContent.replace(/\s+/g, ' ').trim();
      if (t.startsWith(q.correct)) btn.classList.add('correct');
      else if (t.startsWith(chosen) && !isCorrect) btn.classList.add('wrong');
    });

    if (isCorrect) {
      const bonus = this.timePerQ > 0 ? Math.ceil(this.timeLeft / this.timePerQ * 10) : 0;
      this.score += 10 + bonus;
      Store.addXP(10 + bonus);
      Utils.toast(`✅ +${10 + bonus} punts`, 'success');
    } else {
      this.errors.push({ q: `Quin estil?`, correct: q.correct });
      Utils.toast('❌ Incorrecte', 'error');
    }
    Store.recordAnswer(q.style, isCorrect);

    const fb = Utils.el('exam-feedback');
    fb.className = `quiz-feedback${isCorrect ? '' : ' wrong-fb'}`;
    const examHelperCtx = isCorrect ? 'feedback-correct' : 'feedback-wrong';
    fb.innerHTML = `
      <div class="feedback-title">${isCorrect ? '\u2705 Correcte!' : '\u274c Incorrecte \u2014 ' + q.correct}</div>
      <div class="feedback-text">${q.style.overallimpression?.substring(0, 180) || ''}\u2026</div>
      ${Utils.buildHelperHTML(q.style, examHelperCtx, isCorrect ? null : chosen)}`;
    fb.classList.remove('hidden');
    Utils.el('exam-next-btn').classList.remove('hidden');
    Utils.el('exam-score-live').textContent = this.score;
  },

  nextQuestion() {
    this.current++;
    if (this.current >= this.questions.length) { this.showResults(); return; }
    this.showQuestion();
  },

  showResults() {
    clearInterval(this.timerInterval);
    Utils.el('exam-game').classList.add('hidden');
    Utils.trackEvent('quiz_completed', { score: this.score, type: 'exam' });
    const total = this.questions.length;
    const correct = total - this.errors.length;
    const pct = Math.round((correct / total) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '🥈' : pct >= 40 ? '🥉' : '💪';
    const res = Utils.el('exam-results');
    res.innerHTML = `
      <div class="quiz-results">
        <div style="font-size:72px;margin-bottom:16px">${emoji}</div>
        <h2 class="result-title">${pct >= 80 ? 'Aprovat amb honors!' : pct >= 60 ? 'Aprovat!' : pct >= 40 ? 'Gairebé...' : 'Segueix practicant!'}</h2>
        <p class="result-subtitle">Examen completat — ${total} preguntes</p>
        <div class="result-breakdown">
          <div class="result-stat"><span class="result-stat-val" style="color:var(--accent)">${pct}%</span><span class="result-stat-key">Nota</span></div>
          <div class="result-stat"><span class="result-stat-val" style="color:var(--green)">${correct}</span><span class="result-stat-key">Correctes</span></div>
          <div class="result-stat"><span class="result-stat-val" style="color:var(--red)">${this.errors.length}</span><span class="result-stat-key">Errors</span></div>
          <div class="result-stat"><span class="result-stat-val">${this.score}</span><span class="result-stat-key">Punts</span></div>
        </div>
        ${this.errors.length ? `<div class="errors-list"><h4 style="margin-bottom:12px">Errors:</h4>${this.errors.map(e => `<div class="error-item"><div class="error-q">${e.q}</div><div class="error-correct">✓ ${e.correct}</div></div>`).join('')}</div>` : ''}
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="Exam.start()">🔄 Nou examen</button>
          <button class="btn btn-outline" onclick="Exam.backToSetup()">← Configuració</button>
        </div>
      </div>`;
    res.classList.remove('hidden');
  },

  abort() { clearInterval(this.timerInterval); this.backToSetup(); },
  backToSetup() {
    Utils.el('exam-game').classList.add('hidden');
    Utils.el('exam-results').classList.add('hidden');
    Utils.el('exam-setup').classList.remove('hidden');
  }
};

// ===== STATS MODULE =====
const Stats = {
  render() {
    const d = Store.get();
    const total = d.totalCorrect + d.totalWrong;
    Utils.el('stat-xp').textContent = d.xp;
    Utils.el('stat-streak').textContent = d.streak;
    Utils.el('stat-correct').textContent = d.totalCorrect;
    Utils.el('stat-accuracy').textContent = total ? Math.round(d.totalCorrect / total * 100) + '%' : '—';

    // Category levels
    const catLevels = Utils.el('cat-levels');
    const cats = Object.entries(d.catStats);
    if (!cats.length) { catLevels.innerHTML = '<div class="empty-state">Encara no has practicat per categories</div>'; }
    else {
      catLevels.innerHTML = cats.sort((a, b) => (b[1].correct + b[1].wrong) - (a[1].correct + a[1].wrong))
        .map(([cat, st]) => {
          const tot = st.correct + st.wrong;
          const pct = tot ? Math.round(st.correct / tot * 100) : 0;
          return `<div class="cat-level-item">
            <div class="cat-level-name" title="${cat}">${cat}</div>
            <div class="cat-level-bar"><div class="cat-level-fill" style="width:${pct}%"></div></div>
            <div class="cat-level-pct">${pct}%</div>
          </div>`;
        }).join('');
    }

    // Weak styles
    const weak = Utils.el('weak-styles');
    const weakStyles = Object.entries(d.styleStats)
      .filter(([, st]) => st.wrong > 0)
      .sort((a, b) => b[1].wrong - a[1].wrong).slice(0, 10);
    if (!weakStyles.length) { weak.innerHTML = '<div class="empty-state">Cap error de moment 🎉</div>'; }
    else {
      weak.innerHTML = weakStyles.map(([name, st]) => `
        <div class="weak-style-item" onclick="Study.openModal('${name.replace(/'/g, "\\'")}');App.showMode('study')">
          <div class="weak-style-name">${name}</div>
          <div class="weak-style-errors">❌ ${st.wrong}</div>
        </div>`).join('');
    }

    // Favorites
    const favEl = Utils.el('fav-styles-list');
    if (!d.favorites.length) { favEl.innerHTML = '<div class="empty-state">Afegeix estils a preferits amb ❤️</div>'; }
    else {
      favEl.innerHTML = d.favorites.map(name => `
        <div class="fav-style-item" onclick="Study.openModal('${name.replace(/'/g, "\\'")}');App.showMode('study')">
          <span>❤️</span>
          <div class="fav-style-name">${name}</div>
        </div>`).join('');
    }
  }
};

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') Study.closeModal();
  if (e.key === '1') App.showMode('study');
  if (e.key === '2') App.showMode('quiz');
  if (e.key === '3') App.showMode('exam');
  if (e.key === '4') App.showMode('stats');
});

// ===== BOOTSTRAP =====
document.addEventListener('DOMContentLoaded', () => {
  App.init();

  // ── Hero canvas bubbles (from bornloka-web) ──────────────────────────
  (function () {
    const cv = document.getElementById('bg-canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    function rz() {
      cv.width = window.innerWidth * devicePixelRatio;
      cv.height = window.innerHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    rz(); window.addEventListener('resize', rz);
    const W = () => window.innerWidth, H = () => window.innerHeight;
    function mkP(anyY) {
      return {
        type: 'bubble',
        x: Math.random() * W(), y: anyY ? Math.random() * H() : H() + 20,
        r: 2.0 + Math.random() * 6.5, speed: .45 + Math.random() * 1.5,
        sway: (Math.random() - .5) * .4, phase: Math.random() * Math.PI * 2,
        alpha: .25 + Math.random() * .35, rot: 0,
        rotSpeed: 0
      };
    }
    const pts = Array.from({ length: 50 }, () => mkP(true));
    let t = 0;

    function frame() {
      ctx.clearRect(0, 0, W(), H()); t += .011;
      pts.forEach(p => {
        p.y -= p.speed; p.x += Math.sin(t + p.phase) * p.sway;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = '#E5172F'; ctx.lineWidth = 1.5;
        ctx.globalAlpha = p.alpha * (0.8 + 0.4 * Math.sin(t * 1.8 + p.phase));
        ctx.stroke(); ctx.globalAlpha = 1;

        if (p.y + p.r < 0) Object.assign(p, mkP(false), { x: Math.random() * W() });
      });
      requestAnimationFrame(frame);
    }
    frame();
  })();
});

// ===== DETECTOR MODULE =====
const Detector = {
  currentQ: 0,
  scores: null,
  answers: {},

  QUESTIONS: [
    {
      id: 'color', icon: '<i data-lucide="palette"></i>', skip: true,
      text: 'Quin és el color de la cervesa?',
      hint: 'Observa-la contra la llum — si pots',
      opts: [
        { label: 'Palla / Groc pàl·lid', icon: '<div style="width:22px;height:22px;border-radius:50%;background:#F3D534;box-shadow:inset 0 0 4px rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.2)"></div>', v: { min: 1, max: 4 } },
        { label: 'Groc / Daurat', icon: '<div style="width:22px;height:22px;border-radius:50%;background:#D78306;box-shadow:inset 0 0 4px rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.2)"></div>', v: { min: 4, max: 9 } },
        { label: 'Ambre', icon: '<div style="width:22px;height:22px;border-radius:50%;background:#862700;box-shadow:inset 0 0 4px rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.2)"></div>', v: { min: 9, max: 17 } },
        { label: 'Coure / Vermellós', icon: '<div style="width:22px;height:22px;border-radius:50%;background:#470400;box-shadow:inset 0 0 4px rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.2)"></div>', v: { min: 17, max: 24 } },
        { label: 'Marró', icon: '<div style="width:22px;height:22px;border-radius:50%;background:#200100;box-shadow:inset 0 0 4px rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.2)"></div>', v: { min: 24, max: 33 } },
        { label: 'Negre fosc', icon: '<div style="width:22px;height:22px;border-radius:50%;background:#0B0000;box-shadow:inset 0 0 4px rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.2)"></div>', v: { min: 30, max: 42 } },
        { label: 'Negre opac', icon: '<div style="width:22px;height:22px;border-radius:50%;background:#000000;box-shadow:inset 0 0 4px rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.2)"></div>', v: { min: 38, max: 99 } },
      ],
      score(style, opt) {
        const { min: tMin, max: tMax } = opt.v;
        const a = style.srmmin || style.srmmax, b = style.srmmax || style.srmmin;
        if (!a && !b) return 0;
        const sMid = (a + b) / 2;
        if (b >= tMin && a <= tMax) return 25;
        const dist = Math.min(Math.abs(sMid - tMin), Math.abs(sMid - tMax));
        return dist <= 6 ? -5 : -20;
      }
    },
    {
      id: 'abv', icon: '<i data-lucide="flask-conical"></i>', skip: true,
      text: 'Quina és la graduació alcohòlica (ABV)?',
      hint: 'A l\'etiqueta o la percepció de calor a la gola',
      opts: [
        { label: 'Molt baixa (<3.5%)', icon: '<i data-lucide="droplet"></i>', v: { min: 0, max: 3.5 } },
        { label: 'Baixa (3.5–5%)', icon: '<i data-lucide="glass-water"></i>', v: { min: 3.5, max: 5.2 } },
        { label: 'Estàndard (4.5–6.5%)', icon: '<i data-lucide="beer"></i>', v: { min: 4.5, max: 6.8 } },
        { label: 'Alta (6–9%)', icon: '<i data-lucide="flame"></i>', v: { min: 6, max: 9 } },
        { label: 'Molt alta (>9%)', icon: '<i data-lucide="bomb"></i>', v: { min: 9, max: 25 } },
      ],
      score(style, opt) {
        const { min: tMin, max: tMax } = opt.v;
        const a = style.abvmin || style.abvmax, b = style.abvmax || style.abvmin;
        if (!a && !b) return 0;
        const sMid = (a + b) / 2;
        if (b >= tMin && a <= tMax) return 25;
        const dist = Math.min(Math.abs(sMid - tMin), Math.abs(sMid - tMax));
        return dist <= 1.5 ? -5 : dist <= 3 ? -14 : -22;
      }
    },
    {
      id: 'ibu', icon: '<i data-lucide="leaf"></i>', skip: true,
      text: 'Com perceps l\'amargor?',
      hint: 'L\'amargor residual al final de boca',
      opts: [
        { label: 'Quasi absent (<10 IBU)', icon: '<i data-lucide="flower"></i>', v: { min: 0, max: 12 } },
        { label: 'Suau (10–25)', icon: '<i data-lucide="sprout"></i>', v: { min: 10, max: 27 } },
        { label: 'Moderat (25–45)', icon: '<i data-lucide="leaf"></i>', v: { min: 25, max: 48 } },
        { label: 'Marcat (45–70)', icon: '<i data-lucide="zap"></i>', v: { min: 45, max: 73 } },
        { label: 'Molt intens (>70)', icon: '<i data-lucide="flame"></i>', v: { min: 68, max: 200 } },
      ],
      score(style, opt) {
        const { min: tMin, max: tMax } = opt.v;
        const a = style.ibumin || style.ibumax, b = style.ibumax || style.ibumin;
        if (!a && !b) return 0;
        const sMid = (a + b) / 2;
        if (b >= tMin && a <= tMax) return 22;
        const dist = Math.min(Math.abs(sMid - tMin), Math.abs(sMid - tMax));
        return dist <= 10 ? -5 : dist <= 25 ? -13 : -20;
      }
    },
    {
      id: 'ferment', icon: '<i data-lucide="test-tubes"></i>', skip: true,
      text: 'Quin és el caràcter de fermentació?',
      hint: 'La impressió del llevat: net com una lager, afruitat, fenòlic...',
      opts: [
        { label: 'Net / Lager — sense notes de llevat', icon: '<i data-lucide="snowflake"></i>', kw: ['lager', 'neutre', 'net', 'clean', 'crisp', 'neutral'], negKw: ['belga', 'belgian', 'trappist', 'sour', 'àcid', 'fumat', 'fum', 'smoke'] },
        { label: 'Ale — lleument afruitat / esterosa', icon: '<i data-lucide="apple"></i>', kw: ['afruitat', 'ester', 'fruitat', 'poma', 'pera', 'fruita'], negKw: ['lager', 'sour', 'àcid', 'belga', 'belgian', 'fumat'] },
        { label: 'Belga — molt afruitat o fenòlic', icon: '<i data-lucide="cherry"></i>', kw: ['belga', 'belgian', 'trappist', 'fenòl', 'clau', 'plàtan', 'especiat', 'spice'], negKw: ['lager', 'sour', 'fumat'] },
        { label: 'Àcid / Làctic / Salvatge', icon: '<i data-lucide="citrus"></i>', kw: ['sour', 'àcid', 'làctic', 'brett', 'salvatge', 'agre', 'lambic', 'wild'], negKw: ['lager', 'belga', 'fumat'] },
        { label: 'Fumat o especiat (addició)', icon: '<i data-lucide="flame"></i>', kw: ['fumat', 'fum', 'smoke', 'torba', 'smoked', 'peat'], negKw: ['sour', 'àcid'] },
      ],
      score(style, opt) {
        const text = ((style.aroma || '') + (style.flavor || '') + (style.tags || '') + (style.category || '')).toLowerCase();
        const hits = opt.kw.filter(k => text.includes(k)).length;
        const neg = (opt.negKw || []).filter(k => text.includes(k)).length;
        return neg > 0 ? -22 : hits >= 3 ? 32 : hits >= 2 ? 22 : hits >= 1 ? 12 : -5;
      }
    },
    {
      id: 'aroma', icon: '<i data-lucide="wind"></i>', skip: true,
      text: 'Quin és l\'aroma dominant?',
      hint: 'El primer que perceps al nas',
      opts: [
        { label: 'Llúpol (cítric/floral/resinós)', icon: '<i data-lucide="leaf"></i>', kw: ['hop', 'lup', 'citric', 'floral', 'citrus', 'pine', 'resin', 'tropical', 'grapefruit', 'herbal'] },
        { label: 'Malta / Pa / Bescüit', icon: '<i data-lucide="wheat"></i>', kw: ['malt', 'bread', 'biscuit', 'toast', 'grain', 'cereal', 'bready'] },
        { label: 'Torrat / Cafè / Xocolata', icon: '<i data-lucide="coffee"></i>', kw: ['roast', 'coffee', 'chocolate', 'burnt', 'dark', 'cocoa', 'char'] },
        { label: 'Afruitat / Esterós', icon: '<i data-lucide="apple"></i>', kw: ['fruit', 'ester', 'banana', 'apple', 'pear', 'cherry', 'plum', 'dried', 'tropical', 'stone'] },
        { label: 'Especiat / Herbal', icon: '<i data-lucide="flame"></i>', kw: ['spice', 'spicy', 'pepper', 'clove', 'coriander', 'herbal', 'herb'] },
        { label: 'Àcid / Funk / Làctic', icon: '<i data-lucide="citrus"></i>', kw: ['sour', 'acid', 'tart', 'lactic', 'brett', 'barnyard', 'wild', 'funk', 'vinegar', 'lambic'] },
        { label: 'Net / Neutre / Mineral', icon: '<i data-lucide="droplet"></i>', kw: ['clean', 'neutral', 'crisp', 'mineral', 'delicate', 'subtle', 'lager'] },
      ],
      score(style, opt) {
        const text = ((style.aroma || '') + (style.tags || '')).toLowerCase();
        const hits = opt.kw.filter(k => text.includes(k)).length;
        return hits >= 3 ? 28 : hits >= 2 ? 18 : hits >= 1 ? 10 : -8;
      }
    },
    {
      id: 'flavor', icon: '<i data-lucide="utensils"></i>', skip: true,
      text: 'Quin és el gust principal?',
      hint: 'La impresió general al paladar i el final de boca',
      opts: [
        { label: 'Amarg de llúpol / Sec', icon: '<i data-lucide="leaf"></i>', kw: ['hop', 'bitter', 'dry', 'resin', 'harsh', 'hoppy'] },
        { label: 'Dolç / Caramel / Toffee', icon: '<i data-lucide="coffee"></i>', kw: ['sweet', 'caramel', 'toffee', 'malt', 'molasses', 'candy'] },
        { label: 'Torrat sec / Amarg fosc', icon: '<i data-lucide="coffee"></i>', kw: ['roast', 'dry', 'burnt', 'coffee', 'chocolate', 'bitter', 'char'] },
        { label: 'Afruitat / Esterós', icon: '<i data-lucide="apple"></i>', kw: ['fruit', 'ester', 'fruity', 'banana', 'apple', 'cherry', 'pear', 'plum'] },
        { label: 'Especiat', icon: '<i data-lucide="flame"></i>', kw: ['spice', 'spicy', 'pepper', 'clove', 'coriander', 'spicy', 'warm'] },
        { label: 'Àcid / Agre', icon: '<i data-lucide="citrus"></i>', kw: ['sour', 'tart', 'acid', 'lactic', 'citric', 'brett', 'vinegar', 'acetic'] },
        { label: 'Equilibrat / Maltós', icon: '<i data-lucide="wheat"></i>', kw: ['balance', 'balanced', 'malt', 'clean', 'biscuit', 'bread', 'mild'] },
      ],
      score(style, opt) {
        const text = ((style.flavor || '') + (style.tags || '')).toLowerCase();
        const hits = opt.kw.filter(k => text.includes(k)).length;
        return hits >= 3 ? 25 : hits >= 2 ? 15 : hits >= 1 ? 7 : -6;
      }
    },
    {
      id: 'body', icon: '<i data-lucide="feather"></i>', skip: true,
      text: 'Com és el cos i la sensació en boca?',
      hint: 'La textura, el pes i la carbonatació',
      opts: [
        { label: 'Lleuger / Refrescant / Gasificat', icon: '<i data-lucide="wind"></i>', kw: ['light', 'thin', 'crisp', 'refreshing', 'highly carbonated', 'prickly', 'effervescent', 'watery'] },
        { label: 'Mig / Suau / Cremós', icon: '<i data-lucide="beer"></i>', kw: ['medium', 'smooth', 'creamy', 'moderate', 'balanced'] },
        { label: 'Ple / Robust / Viscós', icon: '<i data-lucide="anchor"></i>', kw: ['full', 'robust', 'heavy', 'rich', 'thick', 'chewy', 'viscous', 'warming'] },
        { label: 'Sedós / Nitrogenat', icon: '<i data-lucide="cloud"></i>', kw: ['silky', 'satiny', 'nitro', 'nitrogen', 'velvety'] },
      ],
      score(style, opt) {
        const text = ((style.mouthfeel || '') + (style.tags || '')).toLowerCase();
        const hits = opt.kw.filter(k => text.includes(k)).length;
        return hits >= 2 ? 20 : hits >= 1 ? 11 : -5;
      }
    },
    {
      id: 'carbo', icon: '<i data-lucide="circle-dashed"></i>', skip: true,
      text: 'Com és la carbonatació?',
      hint: 'Pots saltar si no n\'estàs segur',
      opts: [
        { label: 'Molt baixa (nitro / tirat natural)', icon: '<i data-lucide="cloud"></i>', kw: ['nitro', 'nitrogen', 'low carbonation', 'smooth', 'cask', 'nitrogenat'] },
        { label: 'Baixa a mitja (ales angleses)', icon: '<i data-lucide="wind"></i>', kw: ['low', 'moderate carbon', 'medium carbon', 'mitja', 'baixa'] },
        { label: 'Alta (lager / ale estàndard)', icon: '<i data-lucide="droplet"></i>', kw: ['high carbon', 'alta carbon', 'highly carbonated', 'moderadament'] },
        { label: 'Molt alta (belga / blat / brut)', icon: '<i data-lucide="sparkles"></i>', kw: ['highly carbonated', 'molt alta', 'very high carbon', 'effervescent', 'belgian', 'champagne', 'brut'] },
      ],
      score(style, opt) {
        const text = ((style.mouthfeel || '') + (style.tags || '')).toLowerCase();
        const hits = opt.kw.filter(k => text.includes(k)).length;
        return hits >= 2 ? 20 : hits >= 1 ? 10 : -3;
      }
    },
    {
      id: 'clarity', icon: '<i data-lucide="eye"></i>', skip: true,
      text: 'Com és la transparència de la cervesa?',
      hint: 'Pots saltar si no n\'estàs segur',
      opts: [
        { label: 'Brillant / Cristal·lina / Filtrada', icon: '<i data-lucide="diamond"></i>', kw: ['brilliant', 'clear', 'bright', 'brillant', 'cristall', 'filtered', 'filtrada', 'cristal'] },
        { label: 'Lleugerament tèrbola (acceptable)', icon: '<i data-lucide="cloud-sun"></i>', kw: ['slight haze', 'chill haze', 'lleugerament tèrbol', 'slight turbidity'] },
        { label: 'Molt tèrbola / Làctica / Opaca', icon: '<i data-lucide="cloud"></i>', kw: ['turbid', 'hazy', 'opaque', 'cloudy', 'tèrbol', 'lletós', 'opac', 'unfiltered', 'yeast in suspension', 'sense filtrar'] },
      ],
      score(style, opt) {
        const text = ((style.appearance || '') + (style.tags || '')).toLowerCase();
        const hits = opt.kw.filter(k => text.includes(k)).length;
        return hits >= 2 ? 22 : hits >= 1 ? 12 : -6;
      }
    },
    {
      id: 'origin', icon: '<i data-lucide="globe"></i>', skip: true,
      text: 'Quina és l\'origen o tradició d\'aquesta cervesa?',
      hint: 'Pots saltar aquesta pregunta si no ho sàpiga\'s',
      opts: [
        { label: 'Britànica', icon: '🇬🇧', cats: ['British Pale', 'Scottish', 'Irish', 'Brown British', 'Strong British', 'Dark British'] },
        { label: 'Alemanya / Austríaca', icon: '🇩🇪', cats: ['German Lager', 'Munich', 'Bock', 'German Ale', 'European'] },
        { label: 'Belga / Francesa', icon: '🇧🇪', cats: ['Belgian', 'Trappist', 'Historical'] },
        { label: 'Americana', icon: '🇺🇸', cats: ['American Lager', 'American Pale', 'American Porter', 'American Wild'] },
        { label: 'Altres / No sé', icon: '🌍', cats: [] },
      ],
      score(style, opt) {
        if (!opt.cats.length) return 0;
        const cat = style.category || '';
        return opt.cats.some(c => cat.toLowerCase().includes(c.split(' ')[0].toLowerCase())) ? 20 : -15;
      }
    },
  ],


  _initScores() {
    this.scores = BJCP_STYLES.filter(s => s.name && s.category).map(s => ({ style: s, score: 0 }));
  },

  _recomputeScores() {
    this._initScores();
    Object.entries(this.answers).forEach(([qIdx, optIdx]) => {
      if (optIdx === null) return;
      const q = this.QUESTIONS[parseInt(qIdx)];
      const opt = q.opts[optIdx];
      this.scores.forEach(item => { item.score += q.score(item.style, opt); });
    });
  },

  start() {
    this.currentQ = 0;
    this.answers = {};
    this._initScores();
    Utils.el('detect-landing').classList.add('hidden');
    Utils.el('detect-game').classList.remove('hidden');
    Utils.el('detect-results').classList.add('hidden');
    this.showQuestion();
  },

  showLanding() {
    Utils.el('detect-landing').classList.remove('hidden');
    Utils.el('detect-game').classList.add('hidden');
    Utils.el('detect-results').classList.add('hidden');
  },

  showQuestion() {
    const q = this.QUESTIONS[this.currentQ];
    const total = this.QUESTIONS.length;
    Utils.el('detect-progress-fill').style.width = ((this.currentQ / total) * 100) + '%';
    Utils.el('detect-q-counter').textContent = `${this.currentQ + 1} / ${total}`;
    Utils.el('detect-question-card').innerHTML = `
      <div class="detect-q-icon">${q.icon}</div>
      <div class="detect-q-text">${q.text}</div>
      ${q.hint ? `<div class="detect-q-hint">💡 ${q.hint}</div>` : ''}
      <div class="detect-opts">
        ${q.opts.map((opt, i) => `
          <button class="detect-opt-btn" onclick="Detector.pickAnswer(${i})">
            <span class="detect-opt-icon">${opt.icon}</span>
            <span class="detect-opt-label">${opt.label}</span>
          </button>`).join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px;">
        ${q.skip ? `<button class="btn btn-outline btn-sm" onclick="Detector.skip()">Saltar →</button>` : ''}
        <div id="detect-nav-btns" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
      </div>
    `;
    const prev = this.answers[this.currentQ];
    if (prev !== undefined && prev !== null)
      document.querySelectorAll('.detect-opt-btn')[prev]?.classList.add('selected');
    this._renderNavBtns();
    this.renderLiveRanking();
    if (window.lucide) window.lucide.createIcons();
  },

  pickAnswer(optIdx) {
    this.answers[this.currentQ] = optIdx;
    this._recomputeScores();
    document.querySelectorAll('.detect-opt-btn').forEach((btn, i) =>
      btn.classList.toggle('selected', i === optIdx));
    this.renderLiveRanking();
    this._renderNavBtns();
  },

  _renderNavBtns() {
    const el = document.getElementById('detect-nav-btns');
    if (!el) return;
    const isLast = this.currentQ === this.QUESTIONS.length - 1;
    const hasAns = this.answers[this.currentQ] !== undefined;
    el.innerHTML =
      (this.currentQ > 0 ? `<button class="btn btn-outline btn-sm" onclick="Detector.prev()">← Anterior</button>` : '') +
      (hasAns ? (isLast
        ? `<button class="btn btn-primary btn-sm" onclick="Detector.showResults()">Veure resultats ✓</button>`
        : `<button class="btn btn-primary btn-sm" onclick="Detector.next()">Següent →</button>`) : '');
  },

  prev() {
    if (this.currentQ > 0) { this.currentQ--; this.showQuestion(); }
  },

  next() {
    this.currentQ++;
    if (this.currentQ >= this.QUESTIONS.length) this.showResults();
    else this.showQuestion();
  },

  skip() {
    this.answers[this.currentQ] = null;
    this._recomputeScores();
    this.next();
  },

  _sorted() { return [...this.scores].sort((a, b) => b.score - a.score); },

  renderLiveRanking() {
    if (!this.scores) return;
    const sorted = this._sorted();
    const maxScore = Math.max(1, sorted[0]?.score || 0);
    const answered = this.currentQ > 0;
    Utils.el('detect-live-ranking').innerHTML = `
      <div class="rank-title">🎯 ${answered ? 'Estils més probables' : 'Estils possibles'}</div>
      ${sorted.slice(0, 10).map((item, i) => {
      const pct = answered ? Math.max(0, Math.round((item.score / maxScore) * 100)) : 0;
      const srmMid = item.style.srmmin && item.style.srmmax
        ? (item.style.srmmin + item.style.srmmax) / 2 : item.style.srmmin || item.style.srmmax || 10;
      const color = Utils.srmToColor(srmMid);
      return `
          <div class="rank-item" onclick="Study.openModal('${item.style.name.replace(/'/g, "\\'")}')">  
            <div class="rank-pos">${i + 1}</div>
            <div class="rank-info">
              <div class="rank-name">${item.style.name}</div>
              <div class="rank-bar-wrap"><div class="rank-bar-fill" style="width:${pct}%;background:${color}"></div></div>
            </div>
            <div class="rank-pct">${pct}%</div>
          </div>`;
    }).join('')}
    `;
  },

  showResults() {
    Utils.el('detect-game').classList.add('hidden');
    Utils.el('detect-results').classList.remove('hidden');
    const sorted = this._sorted();
    Utils.trackEvent('use_detector', { top_result: sorted[0]?.style.name || 'Unknown' });
    const maxScore = Math.max(1, sorted[0]?.score || 0);
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    Utils.el('detect-results').innerHTML = `
      <div class="detect-results-header">
        <div style="font-size:56px;margin-bottom:12px">🕵️</div>
        <h2 class="detect-results-title">Resultat del Detectiu</h2>
        <p class="detect-results-sub">Basant-nos en les teves respostes, els estils més probables són:</p>
      </div>
      <div class="detect-top-results">
        ${sorted.slice(0, 5).map((item, i) => {
      const pct = Math.max(0, Math.round((item.score / maxScore) * 100));
      const srmMid = item.style.srmmin && item.style.srmmax
        ? (item.style.srmmin + item.style.srmmax) / 2 : item.style.srmmin || item.style.srmmax || 10;
      const color = Utils.srmToColor(srmMid);
      return `
            <div class="detect-result-card" onclick="Study.openModal('${item.style.name.replace(/'/g, "\\'")}')">  
              <div class="detect-result-medal">${medals[i]}</div>
              <div class="detect-result-main">
                <div class="detect-result-name">${item.style.name}</div>
                <div class="detect-result-num">${item.style.number || ''} · ${item.style.category || ''}</div>
                <div class="detect-result-bar-wrap"><div class="detect-result-bar" style="width:${pct}%;background:linear-gradient(90deg,${color},var(--accent))"></div></div>
              </div>
              <div class="detect-result-pct" style="color:${color}">${pct}%</div>
            </div>`;
    }).join('')}
      </div>
      <p style="font-size:12px;color:var(--text3);text-align:center;margin-bottom:20px">Toca qualsevol estil per veure'n tots els detalls 👀</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="Detector.start()">🔄 Tornar a detectar</button>
        <button class="btn btn-outline" onclick="Detector.showLanding()">← Inici detectiu</button>
      </div>
    `;
    Store.addXP(5);
    Utils.toast('🕵️ Detecció completada! +5 XP', 'success');
  },
};

