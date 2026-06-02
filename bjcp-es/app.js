// ===== STORE (localStorage) =====
const Store = {
  KEY: 'bjcp_progress',
  defaults() {
    return {
      xp:0, streak:0, lastStudyDate:null,
      favorites:[], difficult:[],
      styleStats:{}, // {styleName: {correct,wrong}}
      catStats:{},   // {category: {correct,wrong}}
      totalCorrect:0, totalWrong:0,
    };
  },
  load() {
    try { return {...this.defaults(), ...JSON.parse(localStorage.getItem(this.KEY)||'{}')}; }
    catch(e) { return this.defaults(); }
  },
  save(data) { localStorage.setItem(this.KEY, JSON.stringify(data)); },
  get() { return this._cache || (this._cache = this.load()); },
  update(fn) { const d = this.get(); fn(d); this._cache = d; this.save(d); },
  addXP(n) { this.update(d => d.xp += n); App.refreshBadges(); },
  recordAnswer(style, correct) {
    this.update(d => {
      const k = style.name;
      if(!d.styleStats[k]) d.styleStats[k] = {correct:0,wrong:0};
      if(correct){ d.styleStats[k].correct++; d.totalCorrect++; }
      else { d.styleStats[k].wrong++; d.totalWrong++; }
      const cat = style.category;
      if(!d.catStats[cat]) d.catStats[cat] = {correct:0,wrong:0};
      if(correct) d.catStats[cat].correct++; else d.catStats[cat].wrong++;
    });
  },
  toggleFav(name) {
    let isFav = false;
    this.update(d => {
      const i = d.favorites.indexOf(name);
      if(i>=0){ d.favorites.splice(i,1); isFav=false; }
      else { d.favorites.push(name); isFav=true; }
    });
    return isFav;
  },
  toggleDifficult(name) {
    let isD = false;
    this.update(d => {
      const i = d.difficult.indexOf(name);
      if(i>=0){ d.difficult.splice(i,1); isD=false; }
      else { d.difficult.push(name); isD=true; }
    });
    return isD;
  },
  updateStreak() {
    this.update(d => {
      const today = new Date().toDateString();
      if(d.lastStudyDate === today) return;
      const yesterday = new Date(Date.now()-86400000).toDateString();
      d.streak = (d.lastStudyDate === yesterday) ? d.streak+1 : 1;
      d.lastStudyDate = today;
    });
    App.refreshBadges();
  },
  reset() { this._cache = this.defaults(); this.save(this._cache); }
};

// ===== UTILS =====
const Utils = {
  srmToColor(srm) {
    const colors = ['#FFE699','#FFD878','#FFCA5A','#FFBF42','#FBB123','#F8A600',
      '#F39C00','#EA8F00','#E58500','#DE7C00','#D77200','#CF6900','#CB6200',
      '#C35900','#BB5100','#B54C00','#B04500','#A63E00','#A13700','#9B3200',
      '#952D00','#8E2900','#882300','#821E00','#7B1A00','#771900','#701400',
      '#6A0F00','#660D00','#5E0B00','#5A0A02','#560A05','#520907','#4C0505',
      '#470606','#440607','#3F0708','#3B0607','#3A070B','#36080A'];
    const idx = Math.min(Math.max(Math.round(srm)-1,0), colors.length-1);
    return colors[idx];
  },
  srmToName(srm) {
    if(!srm) return '—';
    if(srm<=2) return 'Paja';
    if(srm<=4) return 'Amarillo';
    if(srm<=8) return 'Oro';
    if(srm<=14) return 'Ámbar';
    if(srm<=18) return 'Cobre';
    if(srm<=22) return 'Marrón';
    if(srm<=30) return 'Negro oscuro';
    return 'Negro';
  },
  fmtRange(min, max, unit='') {
    if(!min && !max) return '—';
    if(min && max) return `${min}–${max}${unit}`;
    return `${min||max}${unit}`;
  },
  shuffle(arr) {
    const a=[...arr];
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a;
  },
  pick(arr,n) { return this.shuffle(arr).slice(0,n); },
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
  toast(msg, type='info') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(()=>t.remove(), 3000);
  },
  el(id) { return document.getElementById(id); },
  html(id,h) { document.getElementById(id).innerHTML = h; },

  buildHelperHTML(style, context='modal', chosenName=null) {
    if(typeof STUDY_HELPERS === 'undefined') return '';
    const h = STUDY_HELPERS[style.number];
    if(!h) return '';
    const section = (icon, title, color, items) => items && items.length ? `
      <div class="helper-section">
        <div class="helper-title" style="color:${color}">${icon} ${title}</div>
        <ul class="helper-list">
          ${items.map(i=>`<li>${i}</li>`).join('')}
        </ul>
      </div>` : '';

    if (context === 'feedback-correct') {
      const confusionNote = h.confusableWith?.length
        ? `<div class="helper-confusion-note">⚠️ Suele confundirse con: <em>${h.confusableWith.slice(0,2).join(', ')}</em></div>` : '';
      return `<div class="study-helpers-panel helpers-correct">
        <div class="helpers-header">🧩 Por qué has acertado — refuerzo</div>
        ${section('🔑','Identificadores clave:','#22c55e', h.keyIdentifiers)}
        ${confusionNote}
      </div>`;
    }

    if (context === 'feedback-wrong') {
      let confusionMsg = '';
      if (chosenName && h.confusableWith) {
        const chosenFirst = chosenName.toLowerCase().split(/[\s(]/)[0];
        const matched = h.confusableWith.find(c => c.toLowerCase().includes(chosenFirst));
        if (matched) {
          confusionMsg = `<div class="helper-confusion-alert">💡 Has elegido <strong>${chosenName}</strong>, que es uno de los estilos que se confunden habitualmente con <strong>${style.name}</strong>. Recuerda las diferencias clave:</div>`;
        }
      }
      return `<div class="study-helpers-panel helpers-wrong">
        <div class="helpers-header">🧩 Para aprender del error</div>
        ${confusionMsg}
        ${section('🔑','Identificadores clave de "' + style.name + '":','#22c55e', h.keyIdentifiers?.slice(0,3))}
        ${section('⚠️','Defectos comunes:','#E5172F', h.commonFaults?.slice(0,2))}
        ${section('🔀','No confundir con:','#E5A020', h.confusableWith?.slice(0,3))}
      </div>`;
    }

    // Default: 'modal'
    return `<div class="study-helpers-panel">
      ${section('🔀','Confusión habitual con:','#E5A020', h.confusableWith)}
      ${section('🔑','Identificadores clave:','#22c55e', h.keyIdentifiers)}
      ${section('⚠️','Defectos comunes:','#E5172F', h.commonFaults)}
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
    const cats = [...new Set(BJCP_STYLES.map(s=>s.category).filter(Boolean))].sort();
    const sel = Utils.el('exam-cat-filter');
    cats.forEach(c => { const o=document.createElement('option'); o.value=c; o.textContent=c; sel.appendChild(o); });
  },
  showMode(mode) {
    document.querySelectorAll('.mode-section').forEach(s=>s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
    Utils.el(`mode-${mode}`).classList.add('active');
    Utils.el(`tab-${mode}`).classList.add('active');
    this.currentMode = mode;
    if(mode==='stats') Stats.render();
    if(mode==='detect') Detector.showLanding();
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
    if(!confirm('¿Seguro que quieres reiniciar todo el progreso? Esta acción es irreversible.')) return;
    Store.reset();
    this.refreshBadges();
    Stats.render();
    Utils.toast('Progreso reiniciado', 'info');
  }
};

// ===== STUDY MODULE =====
const Study = {
  filtered: [...BJCP_STYLES],
  searchQ: '', catQ: '', showFavs: false, showDiff: false,

  init() {
    // populate category filter
    const cats = [...new Set(BJCP_STYLES.map(s=>s.category).filter(Boolean))].sort();
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
      if(q && !s.name?.toLowerCase().includes(q) && !s.category?.toLowerCase().includes(q)) return false;
      if(this.catQ && s.category !== this.catQ) return false;
      if(this.showFavs && !d.favorites.includes(s.name)) return false;
      if(this.showDiff && !d.difficult.includes(s.name)) return false;
      return true;
    });
    Utils.el('style-count').textContent = `${this.filtered.length} estilos`;
  },

  render() {
    this.applyFilters();
    const d = Store.get();
    const grid = Utils.el('cards-grid');
    if(!this.filtered.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;padding:60px 0">🔍 Ningún estilo encontrado</div>';
      return;
    }
    grid.innerHTML = this.filtered.map(s => this.cardHTML(s, d)).join('');
  },

  cardHTML(s, d) {
    const isFav = d.favorites.includes(s.name);
    const isDiff = d.difficult.includes(s.name);
    const hasHelper = typeof STUDY_HELPERS !== 'undefined' && !!STUDY_HELPERS[s.number];
    const abv = Utils.fmtRange(s.abvmin, s.abvmax, '%');
    const ibu = Utils.fmtRange(s.ibumin, s.ibumax);
    const srmMid = s.srmmin && s.srmmax ? (s.srmmin+s.srmmax)/2 : s.srmmin||s.srmmax;
    const srmColor = srmMid ? Utils.srmToColor(srmMid) : '#888';
    const tags = (s.tags||'').split(',').slice(0,3).map(t=>t.trim()).filter(Boolean);
    return `<div class="style-card${isDiff?' card-difficult':''}" style="--card-grad: linear-gradient(90deg, var(--accent), ${srmColor});" onclick="Study.openModal('${s.name.replace(/'/g,"\\'")}')">
      <div class="card-header">
        <span class="card-number">${s.number||'—'}</span>
        <div class="card-actions">
          <button class="card-action-btn" title="Favorito" onclick="event.stopPropagation();Study.toggleFav('${s.name.replace(/'/g,"\\'")}',this)">${isFav?'❤️':'🤍'}</button>
          <button class="card-action-btn" title="A repasar" onclick="event.stopPropagation();Study.toggleDiff('${s.name.replace(/'/g,"\\'")}',this)">${isDiff?'📌':'📍'}</button>
        </div>
      </div>
      <div class="card-name">${s.name}</div>
      <div class="card-category">${s.category||''}</div>
      <div class="card-stats">
        ${abv!=='—'?`<span class="stat-pill abv">⚗️ ${abv}</span>`:''}
        ${ibu!=='—'?`<span class="stat-pill ibu">🌿 ${ibu} IBU</span>`:''}
        ${srmMid?`<span class="stat-pill srm" style="border-left:3px solid ${srmColor}">🎨 ${Utils.srmToName(srmMid)}</span>`:''}
      </div>
      <div class="card-desc">${s.overallimpression||s.aroma||''}</div>
      ${tags.length?`<div class="card-badges">${tags.map(t=>`<span class="tag-badge">${t}</span>`).join('')}</div>`:''}
      ${hasHelper ? '<div class="card-helper-badge">🧩 Study helper</div>' : ''}
      <div class="srm-bar" style="background:linear-gradient(90deg,${Utils.srmToColor(s.srmmin||1)},${Utils.srmToColor(s.srmmax||10)})"></div>
    </div>`;
  },

  toggleFav(name, btn) {
    const isFav = Store.toggleFav(name);
    btn.textContent = isFav ? '❤️' : '🤍';
    Utils.toast(isFav ? `${name} añadido a favoritos` : `${name} eliminado de favoritos`, 'info');
    if(this.showFavs) this.render();
  },

  toggleDiff(name, btn) {
    const isD = Store.toggleDifficult(name);
    btn.textContent = isD ? '📌' : '📍';
    const card = btn.closest('.style-card');
    card.classList.toggle('card-difficult', isD);
    Utils.toast(isD ? `${name} marcado para repasar` : `${name} ya no se repasa`, 'info');
    if(this.showDiff) this.render();
  },

  search(v) { this.searchQ = v; this.render(); },
  filterCat(v) { this.catQ = v; this.render(); },
  filterFavorites() {
    this.showFavs = !this.showFavs;
    if(this.showFavs) this.showDiff = false;
    Utils.el('fav-filter-btn').classList.toggle('active-filter', this.showFavs);
    Utils.el('diff-filter-btn').classList.remove('active-filter');
    this.render();
  },
  filterDifficult() {
    this.showDiff = !this.showDiff;
    if(this.showDiff) this.showFavs = false;
    Utils.el('diff-filter-btn').classList.toggle('active-filter', this.showDiff);
    Utils.el('fav-filter-btn').classList.remove('active-filter');
    this.render();
  },
  shuffle() {
    BJCP_STYLES.sort(()=>Math.random()-0.5);
    this.render();
    Utils.toast('¡Estilos mezclados!', 'success');
  },

  openModal(name) {
    const s = BJCP_STYLES.find(x=>x.name===name);
    if(!s) return;
    const d = Store.get();
    const isFav = d.favorites.includes(s.name);
    const isDiff = d.difficult.includes(s.name);
    const abv = Utils.fmtRange(s.abvmin, s.abvmax, '%');
    const ibu = Utils.fmtRange(s.ibumin, s.ibumax);
    const og = Utils.fmtRange(s.ogmin, s.ogmax);
    const fg = Utils.fmtRange(s.fgmin, s.fgmax);
    const srmMid = s.srmmin && s.srmmax ? (s.srmmin+s.srmmax)/2 : s.srmmin||s.srmmax;
    const tags = (s.tags||'').split(',').map(t=>t.trim()).filter(Boolean);

    const sections = [
      ['Impresión general', s.overallimpression],
      ['Aroma', s.aroma],
      ['Apariencia', s.appearance],
      ['Sabor', s.flavor],
      ['Sensación en boca', s.mouthfeel],
      ['Comentarios', s.comments],
      ['Historia', s.history],
      ['Ingredientes característicos', s.characteristicingredients],
      ['Comparación de estilos', s.stylecomparison],
      ['Ejemplos comerciales', s.commercialexamples],
    ].filter(([,v])=>v && v!=='-');

    Utils.el('modal-content').innerHTML = `
      <div class="modal-top">
        <div>
          <div class="modal-number">${s.number||''} · ${s.category||''}</div>
          <div class="modal-name">${s.name}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:flex-start">
          <button class="card-action-btn" title="Favorito" style="font-size:20px" onclick="Study.toggleFav('${s.name.replace(/'/g,"\\'")}',this)">${isFav?'❤️':'🤍'}</button>
          <button class="card-action-btn" title="A repasar" style="font-size:20px" onclick="Study.toggleDiff('${s.name.replace(/'/g,"\\'")}',this)">${isDiff?'📌':'📍'}</button>
          <button class="modal-close" onclick="Study.closeModal()">✕</button>
        </div>
      </div>
      <div class="modal-stats">
        <div class="modal-stat"><div class="modal-stat-val">${abv}</div><div class="modal-stat-key">ABV</div></div>
        <div class="modal-stat"><div class="modal-stat-val">${ibu}</div><div class="modal-stat-key">IBU</div></div>
        <div class="modal-stat"><div class="modal-stat-val">${og}</div><div class="modal-stat-key">OG</div></div>
        <div class="modal-stat"><div class="modal-stat-val">${fg}</div><div class="modal-stat-key">FG</div></div>
        <div class="modal-stat">
          <div class="modal-stat-val" style="color:${srmMid?Utils.srmToColor(srmMid):'var(--text2)'}">${Utils.fmtRange(s.srmmin,s.srmmax)}</div>
          <div class="modal-stat-key">SRM</div>
        </div>
      </div>
      ${Utils.buildHelperHTML(s)}
      <div class="modal-sections">
        ${sections.map(([title,text],i)=>`
          <div class="modal-section${i<4?'':' full'}">
            <div class="modal-section-title">${title}</div>
            <div class="modal-section-text">${text}</div>
          </div>`).join('')}
      </div>
      ${tags.length?`<div class="modal-tags">${tags.map(t=>`<span class="tag-badge">${t}</span>`).join('')}</div>`:''}
    `;
    const overlay = Utils.el('detail-modal');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    Store.updateStreak();
  },

  closeModal(e) {
    if(e && e.target !== Utils.el('detail-modal')) return;
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
    const pool = Utils.shuffle(weighted).filter(s => { if(seen.has(s.name)) return false; seen.add(s.name); return true; });
    return pool.slice(0, n).map(s => {
      const t = type === 'mix' ? (Math.random() < 0.5 ? 'guess' : 'define') : type;
      return this.buildQuestion(s, t, pool);
    });
  },

  buildQuestion(style, type, pool) {
    if(type === 'guess') {
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
      return { style, type:'guess', options, correct: style.name, profile, keyClue };
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
        const cMid = ((style.abvmin||0)+(style.abvmax||0))/2;
        const src = pool.filter(s => s.name !== style.name && (s.abvmin||s.abvmax) && Utils.fmtRange(s.abvmin,s.abvmax,'% ABV') !== correct);
        const picked = distPick(src, s => ((s.abvmin||0)+(s.abvmax||0))/2, cMid, 1.5, 3);
        options = Utils.shuffle([correct, ...picked.map(s => Utils.fmtRange(s.abvmin, s.abvmax, '% ABV'))]);
      } else if (subtype === 'ibu') {
        correct = Utils.fmtRange(style.ibumin, style.ibumax, ' IBU');
        if (correct === '—') correct = 'Sin especificar';
        const cMid = ((style.ibumin||0)+(style.ibumax||0))/2;
        const src = pool.filter(s => s.name !== style.name && (s.ibumin||s.ibumax) && Utils.fmtRange(s.ibumin,s.ibumax,' IBU') !== correct);
        const picked = distPick(src, s => ((s.ibumin||0)+(s.ibumax||0))/2, cMid, 20, 3);
        options = Utils.shuffle([correct, ...picked.map(s => Utils.fmtRange(s.ibumin, s.ibumax, ' IBU'))]);
      } else if (subtype === 'srm') {
        const mid = (style.srmmin+style.srmmax)/2 || style.srmmin || style.srmmax;
        correct = `${Utils.fmtRange(style.srmmin, style.srmmax)} SRM (${Utils.srmToName(mid)})`;
        const src = pool.filter(s => s.name !== style.name && (s.srmmin||s.srmmax));
        const picked = distPick(src, s => (s.srmmin+s.srmmax)/2 || s.srmmin || s.srmmax, mid, 4, 3);
        options = Utils.shuffle([correct, ...picked.map(s => {
          const m = (s.srmmin+s.srmmax)/2 || s.srmmin || s.srmmax;
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
        const confusionNames = (h_key.confusableWith||[]).map(c => { const m = c.match(/^(.+?)\s*\(/); return m ? m[1].trim() : c.trim(); });
        const confDist = Utils.shuffle(pool.filter(s => s.name !== style.name && confusionNames.includes(s.name)));
        const fallDist = Utils.shuffle(pool.filter(s => s.name !== style.name && !confusionNames.includes(s.name)));
        const kidDist = [...confDist, ...fallDist].slice(0, 3);
        while (kidDist.length < 3) { const extra = Utils.shuffle(pool.filter(s => s.name !== style.name && !kidDist.find(d=>d.name===s.name)))[0]; if(extra) kidDist.push(extra); else break; }
        options = Utils.shuffle([style.name, ...kidDist.map(s => s.name)]);
        return { style, type:'define', subtype:'key_id', options, correct, keyClue };
      }
      
      // Ensure unique options
      options = [...new Set(options)];
      // If we don't have enough unique options, fill with random distractors
      while(options.length < 4) {
        if(subtype === 'abv') {
          const cMid = ((style.abvmin||0)+(style.abvmax||0))/2;
          const sign = options.length % 2 === 0 ? 1 : -1;
          const lo = Math.max(1, +(cMid + sign * (2 + Math.random()*3)).toFixed(1));
          options.push(`${lo}–${+(lo + 1.5 + Math.random()*1.5).toFixed(1)}% ABV`);
        } else if(subtype === 'ibu') {
          const cMid = ((style.ibumin||0)+(style.ibumax||0))/2;
          const sign = options.length % 2 === 0 ? 1 : -1;
          const base = Math.max(5, Math.round(cMid + sign * (22 + Math.random()*15)));
          options.push(`${base}–${base + 10 + Math.round(Math.random()*15)} IBU`);
        } else if(subtype === 'srm') {
          const cMid = ((style.srmmin||0)+(style.srmmax||0))/2;
          const sign = options.length % 2 === 0 ? 1 : -1;
          const base = Math.max(1, Math.round(cMid + sign * (5 + Math.random()*5)));
          options.push(`${base}–${base + 3 + Math.round(Math.random()*5)} SRM (${Utils.srmToName(base + 2)})`);
        } else {
          options.push('Opción genérica ' + options.length);
        }
        options = [...new Set(options)];
      }
      options = Utils.shuffle(options);

      return { style, type:'define', subtype, options, correct };
    }
  },

  pickGuessProfile(style) {
    const c = ['sensory', 'sensory']; // sensory weighted 2x
    if ((style.aroma||'').length > 50 && style.flavor) c.push('tasting');
    if ((style.history||'').length > 40) c.push('history');
    if ((style.characteristicingredients||'').length > 20) c.push('ingredients');
    if ((style.comments||'').length > 30) c.push('comments');
    if ((style.stylecomparison||'').length > 30) c.push('stylecomparison');
    if (typeof STUDY_HELPERS !== 'undefined' && STUDY_HELPERS[style.number]?.keyIdentifiers?.length) {
      c.push('confusion'); c.push('confusion'); // weighted 2x
    }
    return Utils.shuffle(c)[0];
  },

  getDistractors(style, pool, n) {
    // Score each candidate by similarity → higher = more confusing (better distractor)
    const abvMid = ((style.abvmin||0)+(style.abvmax||0))/2;
    const ibuMid = ((style.ibumin||0)+(style.ibumax||0))/2;
    const srmMid = ((style.srmmin||0)+(style.srmmax||0))/2;
    const aromaWords = new Set((style.aroma||'').toLowerCase().split(/[\s,;.()]+/).filter(w=>w.length>4));
    const scored = pool.filter(s => s.name !== style.name).map(s => {
      let pts = 0;
      if (s.category === style.category) pts += 8;
      const sAbv = ((s.abvmin||0)+(s.abvmax||0))/2;
      if (Math.abs(abvMid - sAbv) <= 1.5) pts += 4;
      const sIbu = ((s.ibumin||0)+(s.ibumax||0))/2;
      if (Math.abs(ibuMid - sIbu) <= 12) pts += 3;
      const sSrm = ((s.srmmin||0)+(s.srmmax||0))/2;
      if (Math.abs(srmMid - sSrm) <= 5) pts += 2;
      const sWords = (s.aroma||'').toLowerCase().split(/[\s,;.()]+/).filter(w=>w.length>4);
      pts += Math.min(sWords.filter(w => aromaWords.has(w)).length * 1.5, 5);
      pts += Math.random() * 2; // slight randomness to avoid always same set
      return { style: s, pts };
    }).sort((a,b) => b.pts - a.pts);
    return Utils.shuffle(scored.slice(0, Math.max(n*4, 12))).slice(0, n).map(c => c.style);
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
    const srmMid = ((s.srmmin||0)+(s.srmmax||0))/2 || s.srmmin || s.srmmax;
    const abvMid = ((s.abvmin||0)+(s.abvmax||0))/2;
    const ibuMid = ((s.ibumin||0)+(s.ibumax||0))/2;
    const strength = abvMid < 4 ? 'de baja graduación' : abvMid < 5.5 ? 'de fuerza estándar' : abvMid < 7.5 ? 'de fuerza moderada-alta' : 'fuerte';
    const bitter = ibuMid < 15 ? 'muy baja' : ibuMid < 25 ? 'baixa' : ibuMid < 40 ? 'moderada' : ibuMid < 60 ? 'alta' : 'molt alta';
    let note = '';
    if (s.appearance) {
      note += `<p><strong>Apariencia:</strong> ${s.appearance.substring(0,160).replace(/\.\s*$/,'').replace(/\n/g,' ')}.</p>`;
    } else if (srmMid) {
      note += `<p><strong>Apariencia:</strong> Cerveza de color ${Utils.srmToName(srmMid).toLowerCase()}, ${strength}.</p>`;
    }
    if (s.aroma) note += `<p><strong>Aroma:</strong> ${s.aroma.substring(0,250).replace(/\n/g,' ')}</p>`;
    if (s.flavor) note += `<p><strong>Sabor:</strong> ${s.flavor.substring(0,250).replace(/\n/g,' ')}</p>`;
    if (s.mouthfeel) note += `<p><strong>Sensació:</strong> ${s.mouthfeel.substring(0,150).replace(/\n/g,' ')}</p>`;
    if (!note) note = `<p>Cervesa ${strength} con amargor ${bitter}.</p>`;
    return note;
  },

  setConfidence(level) {
    if(this.answered) return; // guard against double-tap
    this.answered = true;
    const q = this.questions[this.current];
    const chosen = this._pendingChosen;
    if(!chosen) return; // no answer selected yet
    const correct = q.correct;
    const isCorrect = chosen === correct;

    // Lock all buttons and reveal correct/wrong
    document.querySelectorAll('.answer-btn').forEach(btn => {
      btn.disabled = true;
      btn.style.boxShadow = '';
      const btnText = btn.textContent.replace(/\s+/g,' ').trim();
      if(q.type==='guess') {
        if(btnText.startsWith(correct)) btn.classList.add('correct');
        else if(btnText.startsWith(chosen) && !isCorrect) btn.classList.add('wrong');
      } else {
        if(btnText === correct) btn.classList.add('correct');
        else if(btnText === chosen && !isCorrect) btn.classList.add('wrong');
      }
    });

    let baseXP = 0;
    if(isCorrect) {
      baseXP = 10;
      this.score += 10;
      Store.addXP(10);
    } else {
      this.errors.push({ q: q.type==='guess' ? '¿Qué estilo es?' : q.style.name, correct });
    }
    Store.recordAnswer(q.style, isCorrect);

    let bonusXP = 0;
    if (isCorrect) {
      if (level === 'sure')  { bonusXP = 5;   Utils.toast('🎯 Correcto y estabas seguro! +15 XP', 'success'); }
      else if (level === 'guess') { bonusXP = -3; Utils.toast('💡 ¡Has tenido suerte! +7 XP', 'info'); }
      else { Utils.toast('✅ ¡Correcto! +10 XP', 'success'); }
    } else {
      if (level === 'sure')  { bonusXP = -10; Utils.toast('⚠️ ¡Muy seguro y has fallado! -10 XP', 'error'); }
      else if (level === 'doubt') { bonusXP = -2; Utils.toast('❌ Incorrecto, pero dudabas.', 'error'); }
      else { Utils.toast('❌ Incorrecto', 'error'); }
    }

    if (bonusXP !== 0) { this.score = Math.max(0, this.score + bonusXP); Store.addXP(bonusXP); }
    Utils.el('quiz-score-live').textContent = `Puntuación: ${this.score}`;

    // Show feedback
    const fb = Utils.el('quiz-feedback');
    fb.className = `quiz-feedback${isCorrect?'':' wrong-fb'}`;
    const chosenStyleName = (q.type === 'guess' || q.subtype === 'key_id') ? chosen : null;
    const helperCtx = isCorrect ? 'feedback-correct' : 'feedback-wrong';
    fb.innerHTML = `
      <div class="feedback-title">${isCorrect ? '\u2705 \u00a1Correcto!' : `\u274c La respuesta correcta era: ${correct}`}</div>
      <div class="feedback-text">${q.style.overallimpression?.substring(0,200)||''}${q.style.overallimpression?.length>200?'\u2026':''}</div>
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
    Utils.el('quiz-q-counter').textContent = `Pregunta ${this.current+1}/${total}`;
    Utils.el('quiz-score-live').textContent = `Puntuación: ${this.score}`;
    Utils.el('quiz-feedback').classList.add('hidden');
    Utils.el('next-btn').classList.add('hidden');
    Utils.el('quiz-confidence').classList.add('hidden');

    if(q.type === 'guess') {
      const s = q.style;
      const tags = (s.tags||'').split(',').map(t=>t.trim()).filter(Boolean);
      const tagsHTML = tags.length ? `<div class="q-char wide q-char-tags"><div class="q-char-label">Tags</div><div class="q-tags">${tags.map(t=>`<span class="tag-badge">${t}</span>`).join('')}</div></div>` : '';
      const statsHTML = [
        s.abvmin||s.abvmax ? `<div class="q-char"><div class="q-char-label">ABV</div><div class="q-char-val">${Utils.fmtRange(s.abvmin,s.abvmax,'%')}</div></div>` : '',
        s.ibumin||s.ibumax ? `<div class="q-char"><div class="q-char-label">IBU</div><div class="q-char-val">${Utils.fmtRange(s.ibumin,s.ibumax)}</div></div>` : '',
        s.srmmin||s.srmmax ? `<div class="q-char"><div class="q-char-label">Color</div><div class="q-char-val">${Utils.srmToName((s.srmmin+s.srmmax)/2)}</div></div>` : '',
      ].join('');
      const wide = (lbl, txt, lim=380) => `<div class="q-char wide"><div class="q-char-label">${lbl}</div><div class="q-char-val">${Utils.truncate(txt, lim)}</div></div>`;

      if (q.profile === 'tasting') {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🍺 Tasting Mode — Identifica el estilo</div>
          <div class="question-title">¿Qué cerveza describe esta nota de cata?</div>
          <div class="tasting-note">${this.generateTastingNote(s)}</div>`;
      } else if (q.profile === 'history') {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">📜 ¿Conoces su historia?</div>
          <div class="question-title">¿Qué estilo describe este origen y evolución?</div>
          <div class="question-chars">${wide('Historia', s.history, 450)}${tagsHTML}</div>`;
      } else if (q.profile === 'ingredients') {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🌾 Ingredientes característicos</div>
          <div class="question-title">¿Qué estilo usa estos ingredientes?</div>
          <div class="question-chars">${statsHTML}${wide('Ingredientes característicos', s.characteristicingredients, 380)}${tagsHTML}</div>`;
      } else if (q.profile === 'comments') {
        const cmpH = s.stylecomparison ? wide('Comparación de estilos', s.stylecomparison, 300) : '';
        Utils.el('question-card').innerHTML = `
          <div class="question-label">💬 Comentarios de l'estil</div>
          <div class="question-title">¿A qué estilo se refieren estos comentarios?</div>
          <div class="question-chars">${wide('Comentarios', s.comments, 420)}${cmpH}</div>`;
      } else if (q.profile === 'stylecomparison') {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">⚖️ Comparación de estilos</div>
          <div class="question-title">¿De qué estilo habla esta comparación?</div>
          <div class="question-chars">${wide('Comparación de estilos', s.stylecomparison, 450)}${tagsHTML}</div>`;
      } else if (q.profile === 'confusion') {
        const keyClue = q.keyClue || (typeof STUDY_HELPERS!=='undefined' && STUDY_HELPERS[s.number]?.keyIdentifiers
          ? Utils.shuffle([...STUDY_HELPERS[s.number].keyIdentifiers])[0] : '');
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🧩 Confusión de estilos</div>
          <div class="question-title">¿Qué estilo tiene este identificador clave?</div>
          <div class="question-chars">
            <div class="q-char wide q-char-keyid">
              <div class="q-char-label">Identificador clave</div>
              <div class="q-char-val" style="font-style:italic;font-size:15px">&ldquo;${keyClue}&rdquo;</div>
            </div>
            ${statsHTML}
          </div>`;
      } else {
        // sensory (default)
        const chars = [
          s.aroma ? wide('Aroma', s.aroma, 380) : '',
          s.flavor ? wide('Sabor', s.flavor, 380) : '',
          s.mouthfeel ? wide('Sensación', s.mouthfeel, 280) : '',
        ].join('');
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🍺 Adivina el estilo BJCP</div>
          <div class="question-title">¿Qué estilo es esta cerveza?</div>
          <div class="question-chars">${statsHTML}${chars}</div>`;
      }
      Utils.el('answers-grid').innerHTML = q.options.map(opt => `
        <button class="answer-btn" onclick="Quiz.answer('${opt.name.replace(/'/g,"\\'")}')">
          ${opt.name}
          <div style="font-size:11px;color:var(--text3);font-weight:400;margin-top:4px">${opt.category||''}</div>
        </button>`).join('');
    } else {
      const s = q.style;
      let prompt = "Define este estilo";
      if (q.subtype === 'abv') prompt = "¿Cuál es el rango de alcohol (ABV) de este estilo?";
      else if (q.subtype === 'ibu') prompt = "¿Cuál es el rango de amargor (IBU) de este estilo?";
      else if (q.subtype === 'srm') prompt = "¿Cuál es el color típico (SRM) de este estilo?";
      else if (q.subtype === 'category') prompt = "¿A qué categoría pertenece este estilo?";
      else if (q.subtype === 'examples') prompt = "¿Cuáles de estos son ejemplos comerciales de este estilo?";
      else if (q.subtype === 'key_id') prompt = "¿A qué estilo pertenece este identificador clave?";

      if (q.subtype === 'key_id') {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🧩 Identifica el estilo</div>
          <div class="question-title">¿A qué estilo pertenece este identificador clave?</div>
          <div class="question-chars">
            <div class="q-char wide q-char-keyid">
              <div class="q-char-label">Identificador clave</div>
              <div class="q-char-val" style="font-style:italic">&ldquo;${q.keyClue}&rdquo;</div>
            </div>
          </div>`;
      } else {
        Utils.el('question-card').innerHTML = `
          <div class="question-label">📋 Define el estilo</div>
          <div class="question-title" style="margin-bottom:8px">${s.name}</div>
          <div style="font-size:14px;color:var(--accent);font-weight:600;margin-bottom:16px">${prompt}</div>`;
      }

      Utils.el('answers-grid').innerHTML = q.options.map(opt => `
        <button class="answer-btn" onclick="Quiz.answer('${opt.replace(/'/g,"\\'")}')">
          ${opt}
        </button>`).join('');
    }
  },

  answer(chosen) {
    if(this.answered) return;
    // Don't lock yet — user can still change selection before confirming confidence
    this._pendingChosen = chosen;
    const q = this.questions[this.current];

    // Clear all highlights, mark chosen temporarily
    document.querySelectorAll('.answer-btn').forEach(btn => {
      btn.style.boxShadow = '';
      const btnText = btn.textContent.replace(/\s+/g,' ').trim();
      if(q.type==='guess') {
        if(btnText.startsWith(chosen)) btn.style.boxShadow = '0 0 0 3px var(--accent)';
      } else {
        if(btnText === chosen) btn.style.boxShadow = '0 0 0 3px var(--accent)';
      }
    });

    // Show confidence calibration (without locking yet)
    Utils.el('quiz-confidence').classList.remove('hidden');
  },

  nextQuestion() {
    this.current++;
    if(this.current >= this.questions.length) { this.showResults(); return; }
    this.showQuestion();
  },

  showResults() {
    Utils.el('quiz-game').classList.add('hidden');
    const pct = Math.round((this.score / (this.questions.length*10)) * 100);
    const emoji = pct>=80?'🏆':pct>=60?'👍':pct>=40?'🤔':'💪';
    const msg = pct>=80?'¡Excelente!':pct>=60?'¡Muy bien!':pct>=40?'¡Sigue practicando!':'¡Hay que estudiar más!';
    const errHTML = this.errors.length ? `
      <div class="errors-list">
        <h4 style="margin-bottom:12px;color:var(--text2)">Errores (${this.errors.length}):</h4>
        ${this.errors.map(e=>`
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
        <p class="result-subtitle">Has conseguido ${this.score} de ${this.questions.length*10} puntos</p>
        <div class="result-breakdown">
          <div class="result-stat"><span class="result-stat-val" style="color:var(--accent)">${pct}%</span><span class="result-stat-key">Precisión</span></div>
          <div class="result-stat"><span class="result-stat-val" style="color:var(--green)">${this.questions.length-this.errors.length}</span><span class="result-stat-key">Correctos</span></div>
          <div class="result-stat"><span class="result-stat-val" style="color:var(--red)">${this.errors.length}</span><span class="result-stat-key">Errores</span></div>
          <div class="result-stat"><span class="result-stat-val">${this.score}</span><span class="result-stat-key">Puntos</span></div>
        </div>
        ${errHTML}
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="Quiz.start('${this.type}')">🔄 Volver a jugar</button>
          <button class="btn btn-outline" onclick="Quiz.backToSelector()">← Cambiar tipo</button>
        </div>
      </div>`;
    res.classList.remove('hidden');
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
    document.querySelectorAll('#exam-setup .config-btn[data-n]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); this.nQuestions = n;
  },
  setTime(btn, t) {
    document.querySelectorAll('#exam-setup .config-btn[data-t]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); this.timePerQ = t;
  },

  start() {
    const cat = Utils.el('exam-cat-filter').value;
    let pool = BJCP_STYLES.filter(s => s.name && s.category);
    if(cat) pool = pool.filter(s => s.category === cat);
    if(pool.length < 4) { Utils.toast('Pocos estilos en esta categoría para generar preguntas', 'error'); return; }

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
    Utils.el('exam-q-counter').textContent = `${this.current+1} / ${total}`;
    Utils.el('exam-progress-fill').style.width = `${((this.current)/total)*100}%`;
    Utils.el('exam-score-live').textContent = this.score;
    Utils.el('exam-feedback').classList.add('hidden');
    Utils.el('exam-next-btn').classList.add('hidden');
    this.answered = false;

    const s = q.style;
    const chars = [
      s.abvmin||s.abvmax ? { label: 'ABV', val: Utils.fmtRange(s.abvmin,s.abvmax,'%'), wide: false } : null,
      s.ibumin||s.ibumax ? { label: 'IBU', val: Utils.fmtRange(s.ibumin,s.ibumax), wide: false } : null,
      s.srmmin||s.srmmax ? { label: 'Color', val: Utils.srmToName((s.srmmin+s.srmmax)/2||s.srmmin||s.srmmax), wide: false } : null,
      s.aroma ? { label: 'Aroma', val: s.aroma.length > 300 ? s.aroma.substring(0,300)+'…' : s.aroma, wide: true } : null,
      s.flavor ? { label: 'Sabor', val: s.flavor.length > 300 ? s.flavor.substring(0,300)+'…' : s.flavor, wide: true } : null,
      s.mouthfeel ? { label: 'Sensació', val: s.mouthfeel.length > 250 ? s.mouthfeel.substring(0,250)+'…' : s.mouthfeel, wide: true } : null,
    ].filter(Boolean);

    Utils.el('exam-question-card').innerHTML = `
      <div class="question-label">🧪 Pregunta ${this.current+1}</div>
      <div class="question-title">¿Qué estilo BJCP es?</div>
      <div class="question-chars">
        ${chars.map(c => `
          <div class="q-char ${c.wide ? 'wide' : ''}">
            <div class="q-char-label">${c.label}</div>
            <div class="q-char-val">${c.val}</div>
          </div>`).join('')}
      </div>`;

    Utils.el('exam-answers-grid').innerHTML = q.options.map(opt => `
      <button class="answer-btn" onclick="Exam.answer('${opt.name.replace(/'/g,"\\'")}')">
        ${opt.name}
        <div style="font-size:11px;color:var(--text3);margin-top:4px">${opt.category||''}</div>
      </button>`).join('');

    if(this.timePerQ > 0) this.startTimer();
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
      if(path) path.style.strokeDashoffset = circ - (pct * circ);
      if(path && this.timeLeft <= 5) path.style.stroke = 'var(--red)';
      else if(path) path.style.stroke = 'var(--accent)';
      if(this.timeLeft <= 0) { clearInterval(this.timerInterval); this.timeOut(); }
    }, 1000);
    // init
    if(path){ path.style.strokeDashoffset = 0; path.style.stroke = 'var(--accent)'; }
    text.textContent = this.timePerQ;
  },

  timeOut() {
    if(this.answered) return;
    this.answered = true;
    document.querySelectorAll('#exam-answers-grid .answer-btn').forEach(b=>b.disabled=true);
    const q = this.questions[this.current];
    this.errors.push({ q:'Temps esgotat', correct: q.correct });
    Store.recordAnswer(q.style, false);
    const fb = Utils.el('exam-feedback');
    fb.className = 'quiz-feedback wrong-fb';
    fb.innerHTML = `<div class="feedback-title">⏱ Temps esgotat!</div><div class="feedback-text">La resposta era: <strong>${q.correct}</strong></div>`;
    fb.classList.remove('hidden');
    Utils.el('exam-next-btn').classList.remove('hidden');
  },

  answer(chosen) {
    if(this.answered) return;
    this.answered = true;
    clearInterval(this.timerInterval);
    const q = this.questions[this.current];
    const isCorrect = chosen === q.correct;

    document.querySelectorAll('#exam-answers-grid .answer-btn').forEach(btn => {
      btn.disabled = true;
      const t = btn.textContent.replace(/\s+/g,' ').trim();
      if(t.startsWith(q.correct)) btn.classList.add('correct');
      else if(t.startsWith(chosen) && !isCorrect) btn.classList.add('wrong');
    });

    if(isCorrect) {
      const bonus = this.timePerQ > 0 ? Math.ceil(this.timeLeft / this.timePerQ * 10) : 0;
      this.score += 10 + bonus;
      Store.addXP(10 + bonus);
      Utils.toast(`✅ +${10+bonus} puntos`, 'success');
    } else {
      this.errors.push({ q: `Quin estil?`, correct: q.correct });
      Utils.toast('❌ Incorrecto', 'error');
    }
    Store.recordAnswer(q.style, isCorrect);

    const fb = Utils.el('exam-feedback');
    fb.className = `quiz-feedback${isCorrect?'':' wrong-fb'}`;
    const examCtx = isCorrect ? 'feedback-correct' : 'feedback-wrong';
    const examChosen = isCorrect ? null : chosen;
    fb.innerHTML = `
      <div class="feedback-title">${isCorrect?'\u2705 \u00a1Correcto!':'\u274c Incorrecto \u2014 '+q.correct}</div>
      <div class="feedback-text">${q.style.overallimpression?.substring(0,180)||''}…</div>
      ${Utils.buildHelperHTML(q.style, examCtx, examChosen)}`;
    fb.classList.remove('hidden');
    Utils.el('exam-next-btn').classList.remove('hidden');
    Utils.el('exam-score-live').textContent = this.score;
  },

  nextQuestion() {
    this.current++;
    if(this.current >= this.questions.length) { this.showResults(); return; }
    this.showQuestion();
  },

  showResults() {
    clearInterval(this.timerInterval);
    Utils.el('exam-game').classList.add('hidden');
    const total = this.questions.length;
    const correct = total - this.errors.length;
    const pct = Math.round((correct/total)*100);
    const emoji = pct>=80?'🏆':pct>=60?'🥈':pct>=40?'🥉':'💪';
    const res = Utils.el('exam-results');
    res.innerHTML = `
      <div class="quiz-results">
        <div style="font-size:72px;margin-bottom:16px">${emoji}</div>
        <h2 class="result-title">${pct>=80?'¡Aprobado con honores!':pct>=60?'¡Aprobado!':pct>=40?'Casi...':'¡Sigue practicando!'}</h2>
        <p class="result-subtitle">Examen completado — ${total} preguntas</p>
        <div class="result-breakdown">
          <div class="result-stat"><span class="result-stat-val" style="color:var(--accent)">${pct}%</span><span class="result-stat-key">Nota</span></div>
          <div class="result-stat"><span class="result-stat-val" style="color:var(--green)">${correct}</span><span class="result-stat-key">Correctos</span></div>
          <div class="result-stat"><span class="result-stat-val" style="color:var(--red)">${this.errors.length}</span><span class="result-stat-key">Errores</span></div>
          <div class="result-stat"><span class="result-stat-val">${this.score}</span><span class="result-stat-key">Puntos</span></div>
        </div>
        ${this.errors.length?`<div class="errors-list"><h4 style="margin-bottom:12px">Errores:</h4>${this.errors.map(e=>`<div class="error-item"><div class="error-q">${e.q}</div><div class="error-correct">✓ ${e.correct}</div></div>`).join('')}</div>`:''}
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="Exam.start()">🔄 Nuevo examen</button>
          <button class="btn btn-outline" onclick="Exam.backToSetup()">← Configuración</button>
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
    Utils.el('stat-accuracy').textContent = total ? Math.round(d.totalCorrect/total*100)+'%' : '—';

    // Category levels
    const catLevels = Utils.el('cat-levels');
    const cats = Object.entries(d.catStats);
    if(!cats.length) { catLevels.innerHTML = '<div class="empty-state">Todavía no has practicado por categorías</div>'; }
    else {
      catLevels.innerHTML = cats.sort((a,b)=>(b[1].correct+b[1].wrong)-(a[1].correct+a[1].wrong))
        .map(([cat,st]) => {
          const tot = st.correct+st.wrong;
          const pct = tot ? Math.round(st.correct/tot*100) : 0;
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
      .filter(([,st])=>st.wrong>0)
      .sort((a,b)=>b[1].wrong-a[1].wrong).slice(0,10);
    if(!weakStyles.length) { weak.innerHTML = '<div class="empty-state">Ningún error por ahora 🎉</div>'; }
    else {
      weak.innerHTML = weakStyles.map(([name,st]) => `
        <div class="weak-style-item" onclick="Study.openModal('${name.replace(/'/g,"\\'")}');App.showMode('study')">
          <div class="weak-style-name">${name}</div>
          <div class="weak-style-errors">❌ ${st.wrong}</div>
        </div>`).join('');
    }

    // Favorites
    const favEl = Utils.el('fav-styles-list');
    if(!d.favorites.length) { favEl.innerHTML = '<div class="empty-state">Añade estilos a favoritos con ❤️</div>'; }
    else {
      favEl.innerHTML = d.favorites.map(name => `
        <div class="fav-style-item" onclick="Study.openModal('${name.replace(/'/g,"\\'")}');App.showMode('study')">
          <span>❤️</span>
          <div class="fav-style-name">${name}</div>
        </div>`).join('');
    }
  }
};

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') Study.closeModal();
  if(e.key === '1') App.showMode('study');
  if(e.key === '2') App.showMode('quiz');
  if(e.key === '3') App.showMode('exam');
  if(e.key === '4') App.showMode('stats');
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

// ===== DETECTOR MODULE (ES) =====
const Detector = {
  currentQ: 0,
  scores: null,
  answers: {},

  QUESTIONS: [
    {
      id:'color', icon:'🎨', skip:true,
      text: '¿Cuál es el color de la cerveza?',
      hint: 'Obsérvala contra la luz si puedes',
      opts: [
        {label:'Paja / Amarillo pálido', icon:'🌾', v:{min:1,max:4}},
        {label:'Amarillo / Dorado',        icon:'🍯', v:{min:4,max:9}},
        {label:'Ámbar',                   icon:'🧡', v:{min:9,max:17}},
        {label:'Cobre / Rojizo',           icon:'🔶', v:{min:17,max:24}},
        {label:'Marrón',                   icon:'🟤', v:{min:24,max:33}},
        {label:'Negro oscuro',             icon:'⬛', v:{min:30,max:42}},
        {label:'Negro opaco',              icon:'🖤', v:{min:38,max:99}},
      ],
      score(style, opt) {
        const {min:tMin,max:tMax} = opt.v;
        const a = style.srmmin||style.srmmax, b = style.srmmax||style.srmmin;
        if(!a && !b) return 0;
        const sMid = (a+b)/2;
        if(b>=tMin && a<=tMax) return 25;
        const dist = Math.min(Math.abs(sMid-tMin), Math.abs(sMid-tMax));
        return dist<=6 ? -5 : -20;
      }
    },
    {
      id:'abv', icon:'⚗️', skip:true,
      text: '¿Cuál es la graduación alcohólica (ABV)?',
      hint: 'En la etiqueta o por la sensación de calor en garganta',
      opts: [
        {label:'Muy baja (<3.5%)',          icon:'💧', v:{min:0,max:3.5}},
        {label:'Baja (3.5–5%)',             icon:'🍵', v:{min:3.5,max:5.2}},
        {label:'Estándar (4.5–6.5%)',     icon:'🍺', v:{min:4.5,max:6.8}},
        {label:'Alta (6–9%)',               icon:'🔥', v:{min:6,max:9}},
        {label:'Muy alta (>9%)',            icon:'💥', v:{min:9,max:25}},
      ],
      score(style, opt) {
        const {min:tMin,max:tMax} = opt.v;
        const a = style.abvmin||style.abvmax, b = style.abvmax||style.abvmin;
        if(!a && !b) return 0;
        const sMid = (a+b)/2;
        if(b>=tMin && a<=tMax) return 25;
        const dist = Math.min(Math.abs(sMid-tMin), Math.abs(sMid-tMax));
        return dist<=1.5 ? -5 : dist<=3 ? -14 : -22;
      }
    },
    {
      id:'ibu', icon:'🌿', skip:true,
      text: '¿Cómo percibes el amargor?',
      hint: 'El amargor residual al final de boca',
      opts: [
        {label:'Casi ausente (<10 IBU)',  icon:'🧧', v:{min:0,max:12}},
        {label:'Suave (10–25)',           icon:'🍃', v:{min:10,max:27}},
        {label:'Moderado (25–45)',        icon:'🌿', v:{min:25,max:48}},
        {label:'Marcado (45–70)',         icon:'🌶️', v:{min:45,max:73}},
        {label:'Muy intenso (>70)',       icon:'⚡', v:{min:68,max:200}},
      ],
      score(style, opt) {
        const {min:tMin,max:tMax} = opt.v;
        const a = style.ibumin||style.ibumax, b = style.ibumax||style.ibumin;
        if(!a && !b) return 0;
        const sMid = (a+b)/2;
        if(b>=tMin && a<=tMax) return 22;
        const dist = Math.min(Math.abs(sMid-tMin), Math.abs(sMid-tMax));
        return dist<=10 ? -5 : dist<=25 ? -13 : -20;
      }
    },
    {
      id:'ferment', icon:'🧫', skip:true,
      text: '¿Cómo es el carácter de fermentación?',
      hint: 'La impresión de la levadura: limpio como una lager, afrutado, fenólico...',
      opts: [
        {label:'Limpio / Lager — sin notas de levadura', icon:'❄️', kw:['lager','neutro','limpio','clean','crisp','neutral'], negKw:['belga','belgian','trappist','sour','ácido','ahumado','humo','smoke']},
        {label:'Ale — ligeramente afrutado / éstery',    icon:'🍎', kw:['afrutado','éster','frutal','manzana','pera','fruta'], negKw:['lager','sour','ácido','belga','belgian','ahumado']},
        {label:'Belga — muy afrutado o fenólico',       icon:'🍐', kw:['belga','belgian','trappist','fenól','clavo','plátano','especiado','spice'], negKw:['lager','sour','ahumado']},
        {label:'Ácido / Láctico / Salvaje',              icon:'🧴', kw:['sour','ácido','láctico','brett','salvaje','agrio','lambic','wild'], negKw:['lager','belga','ahumado']},
        {label:'Ahumado o especiado (adición)',          icon:'🔥', kw:['ahumado','humo','smoke','turba','smoked','peat'], negKw:['sour','ácido']},
      ],
      score(style, opt) {
        const text = ((style.aroma||'')+(style.flavor||'')+(style.tags||'')+(style.category||'')).toLowerCase();
        const hits = opt.kw.filter(k=>text.includes(k)).length;
        const neg = (opt.negKw||[]).filter(k=>text.includes(k)).length;
        return neg > 0 ? -22 : hits>=3 ? 32 : hits>=2 ? 22 : hits>=1 ? 12 : -5;
      }
    },
    {
      id:'aroma', icon:'👃', skip:true,
      text: '¿Cuál es el aroma dominante?',
      hint: 'Lo primero que percibes en nariz',
      opts: [
        {label:'Lúpulo (cítrico/floral/resinoso)', icon:'🍋', kw:['hop','lupul','citric','floral','citrus','pine','resin','tropical','grapefruit','herbal']},
        {label:'Malta / Pan / Galleta',            icon:'🍞', kw:['malt','bread','biscuit','toast','grain','cereal','bready','malta','pan']},
        {label:'Tostado / Café / Chocolate',      icon:'☕', kw:['roast','coffee','chocolate','burnt','dark','cocoa','char','tostado','café']},
        {label:'Afrutado / Éstery',               icon:'🍎', kw:['fruit','ester','banana','apple','pear','cherry','plum','dried','tropical','stone','fruta']},
        {label:'Especiado / Herbal',               icon:'🌶️', kw:['spice','spicy','pepper','clove','coriander','herbal','herb','especia']},
        {label:'Ácido / Funk / Láctico',           icon:'🧴', kw:['sour','acid','tart','lactic','brett','barnyard','wild','funk','vinegar','lambic','ácido']},
        {label:'Limpio / Neutro / Mineral',        icon:'🧧', kw:['clean','neutral','crisp','mineral','delicate','subtle','lager','limpio']},
      ],
      score(style, opt) {
        const text = ((style.aroma||'')+(style.tags||'')).toLowerCase();
        const hits = opt.kw.filter(k=>text.includes(k)).length;
        return hits>=3 ? 28 : hits>=2 ? 18 : hits>=1 ? 10 : -8;
      }
    },
    {
      id:'flavor', icon:'👅', skip:true,
      text: '¿Cuál es el sabor principal?',
      hint: 'La impresión general en el paladar y el final de boca',
      opts: [
        {label:'Amargo de lúpulo / Seco',  icon:'🌿', kw:['hop','bitter','dry','resin','harsh','hoppy']},
        {label:'Dulce / Caramelo / Toffee', icon:'🍯', kw:['sweet','caramel','toffee','malt','molasses','candy','dulce','caramelo']},
        {label:'Tostado seco / Amargo oscuro', icon:'☕', kw:['roast','dry','burnt','coffee','chocolate','bitter','char','tostado']},
        {label:'Afrutado / Éstery',         icon:'🍎', kw:['fruit','ester','fruity','banana','apple','cherry','pear','plum','fruta']},
        {label:'Especiado',                 icon:'🌶️', kw:['spice','pepper','clove','coriander','spicy','warm','especia']},
        {label:'Ácido / Agrio',              icon:'🧴', kw:['sour','tart','acid','lactic','citric','brett','vinegar','acetic','ácido']},
        {label:'Equilibrado / Maltoso',     icon:'⚖️', kw:['balance','balanced','malt','clean','biscuit','bread','mild','equilibrado']},
      ],
      score(style, opt) {
        const text = ((style.flavor||'')+(style.tags||'')).toLowerCase();
        const hits = opt.kw.filter(k=>text.includes(k)).length;
        return hits>=3 ? 25 : hits>=2 ? 15 : hits>=1 ? 7 : -6;
      }
    },
    {
      id:'body', icon:'🧣', skip:true,
      text: '¿Cómo es el cuerpo y la sensación en boca?',
      hint: 'La textura, el peso y la carbonatación',
      opts: [
        {label:'Ligero / Aéreo / Gasificado', icon:'💨', kw:['light','thin','crisp','refreshing','highly carbonated','prickly','effervescent','watery']},
        {label:'Medio / Suave / Cremoso',      icon:'🍺', kw:['medium','smooth','creamy','moderate','balanced']},
        {label:'Pleno / Robusto / Viscoso',    icon:'🥛', kw:['full','robust','heavy','rich','thick','chewy','viscous','warming']},
        {label:'Sedoso / Nitrogenado',         icon:'🧈', kw:['silky','satiny','nitro','nitrogen','velvety']},
      ],
      score(style, opt) {
        const text = ((style.mouthfeel||'')+(style.tags||'')).toLowerCase();
        const hits = opt.kw.filter(k=>text.includes(k)).length;
        return hits>=2 ? 20 : hits>=1 ? 11 : -5;
      }
    },
    {
      id:'carbo', icon:'🫧', skip:true,
      text: '¿Cómo es la carbonatación?',
      hint: 'Puedes saltar si no estás seguro',
      opts: [
        {label:'Muy baja (nitro / tirado natural)', icon:'🧈', kw:['nitro','nitrogen','low carbonation','smooth','cask','nitrogenado']},
        {label:'Baja a media (ales inglesas)',       icon:'🍺', kw:['low','moderate carbon','medium carbon','media','baja']},
        {label:'Alta (lager / ale estándar)',        icon:'💧', kw:['high carbon','alta carbon','highly carbonated','moderadamente']},
        {label:'Muy alta (belga / trigo / brut)',    icon:'✨', kw:['highly carbonated','muy alta','very high carbon','effervescent','belgian','champagne','brut']},
      ],
      score(style, opt) {
        const text = ((style.mouthfeel||'')+(style.tags||'')).toLowerCase();
        const hits = opt.kw.filter(k=>text.includes(k)).length;
        return hits>=2 ? 20 : hits>=1 ? 10 : -3;
      }
    },
    {
      id:'clarity', icon:'🔍', skip:true,
      text: '¿Cómo es la transparencia de la cerveza?',
      hint: 'Puedes saltar si no estás seguro',
      opts: [
        {label:'Brillante / Cristalino / Filtrado',  icon:'💎', kw:['brilliant','clear','bright','brillante','cristalino','filtered','filtrada','cristal']},
        {label:'Ligeramente turbio (aceptable)',      icon:'🌤️', kw:['slight haze','chill haze','ligeramente turbio','slight turbidity']},
        {label:'Muy turbio / Lechoso / Opaco',        icon:'🌫️', kw:['turbid','hazy','opaque','cloudy','turbio','lechoso','opaco','unfiltered','yeast in suspension','sin filtrar']},
      ],
      score(style, opt) {
        const text = ((style.appearance||'')+(style.tags||'')).toLowerCase();
        const hits = opt.kw.filter(k=>text.includes(k)).length;
        return hits>=2 ? 22 : hits>=1 ? 12 : -6;
      }
    },
    {
      id:'origin', icon:'🌍', skip:true,
      text: '¿Cuál es el origen o tradición de esta cerveza?',
      hint: 'Puedes saltar esta pregunta si no lo sabes',
      opts: [
        {label:'Británica', icon:'🇬🇧', cats:['British Pale','Scottish','Irish','Brown British','Strong British','Dark British']},
        {label:'Alemana / Austríaca', icon:'🇩🇪', cats:['German Lager','Munich','Bock','German Ale','European']},
        {label:'Belga / Francesa', icon:'🇧🇪', cats:['Belgian','Trappist','Historical']},
        {label:'Americana', icon:'🇺🇸', cats:['American Lager','American Pale','American Porter','American Wild']},
        {label:'Otras / No sé', icon:'🌍', cats:[]},
      ],
      score(style, opt) {
        if(!opt.cats.length) return 0;
        const cat = style.category||'';
        return opt.cats.some(c=>cat.toLowerCase().includes(c.split(' ')[0].toLowerCase())) ? 20 : -15;
      }
    },
  ],

  _initScores() {
    this.scores = BJCP_STYLES.filter(s=>s.name&&s.category).map(s=>({style:s,score:0}));
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
    Utils.el('detect-progress-fill').style.width = ((this.currentQ/total)*100)+'%';
    Utils.el('detect-q-counter').textContent = `${this.currentQ+1} / ${total}`;
    Utils.el('detect-question-card').innerHTML = `
      <div class="detect-q-icon">${q.icon}</div>
      <div class="detect-q-text">${q.text}</div>
      ${q.hint?`<div class="detect-q-hint">💡 ${q.hint}</div>`:''}
      <div class="detect-opts">
        ${q.opts.map((opt,i)=>`
          <button class="detect-opt-btn" onclick="Detector.pickAnswer(${i})">
            <span class="detect-opt-icon">${opt.icon}</span>
            <span class="detect-opt-label">${opt.label}</span>
          </button>`).join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px;">
        ${q.skip?`<button class="btn btn-outline btn-sm" onclick="Detector.skip()">Saltar →</button>`:''}
        <div id="detect-nav-btns" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
      </div>
    `;
    const prev = this.answers[this.currentQ];
    if (prev !== undefined && prev !== null)
      document.querySelectorAll('.detect-opt-btn')[prev]?.classList.add('selected');
    this._renderNavBtns();
    this.renderLiveRanking();
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
        ? `<button class="btn btn-primary btn-sm" onclick="Detector.showResults()">Ver resultados ✓</button>`
        : `<button class="btn btn-primary btn-sm" onclick="Detector.next()">Siguiente →</button>`) : '');
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

  _sorted() { return [...this.scores].sort((a,b)=>b.score-a.score); },

  renderLiveRanking() {
    if(!this.scores) return;
    const sorted = this._sorted();
    const maxScore = Math.max(1, sorted[0]?.score||0);
    const answered = this.currentQ > 0;
    Utils.el('detect-live-ranking').innerHTML = `
      <div class="rank-title">🎯 ${answered?'Estilos más probables':'Estilos posibles'}</div>
      ${sorted.slice(0,10).map((item,i)=>{
        const pct = answered ? Math.max(0,Math.round((item.score/maxScore)*100)) : 0;
        const srmMid = item.style.srmmin&&item.style.srmmax
          ?(item.style.srmmin+item.style.srmmax)/2:item.style.srmmin||item.style.srmmax||10;
        const color = Utils.srmToColor(srmMid);
        return `
          <div class="rank-item" onclick="Study.openModal('${item.style.name.replace(/'/g,"\\'")}')">
            <div class="rank-pos">${i+1}</div>
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
    const maxScore = Math.max(1, sorted[0]?.score||0);
    const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
    Utils.el('detect-results').innerHTML = `
      <div class="detect-results-header">
        <div style="font-size:56px;margin-bottom:12px">🕵️</div>
        <h2 class="detect-results-title">Resultado del Detective</h2>
        <p class="detect-results-sub">Basándonos en tus respuestas, los estilos más probables son:</p>
      </div>
      <div class="detect-top-results">
        ${sorted.slice(0,5).map((item,i)=>{
          const pct = Math.max(0,Math.round((item.score/maxScore)*100));
          const srmMid = item.style.srmmin&&item.style.srmmax
            ?(item.style.srmmin+item.style.srmmax)/2:item.style.srmmin||item.style.srmmax||10;
          const color = Utils.srmToColor(srmMid);
          return `
            <div class="detect-result-card" onclick="Study.openModal('${item.style.name.replace(/'/g,"\\'")}')">
              <div class="detect-result-medal">${medals[i]}</div>
              <div class="detect-result-main">
                <div class="detect-result-name">${item.style.name}</div>
                <div class="detect-result-num">${item.style.number||''} · ${item.style.category||''}</div>
                <div class="detect-result-bar-wrap"><div class="detect-result-bar" style="width:${pct}%;background:linear-gradient(90deg,${color},var(--accent))"></div></div>
              </div>
              <div class="detect-result-pct" style="color:${color}">${pct}%</div>
            </div>`;
        }).join('')}
      </div>
      <p style="font-size:12px;color:var(--text3);text-align:center;margin-bottom:20px">Toca cualquier estilo para ver todos los detalles 👀</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="Detector.start()">🔄 Detectar de nuevo</button>
        <button class="btn btn-outline" onclick="Detector.showLanding()">← Inicio detective</button>
      </div>
    `;
    Store.addXP(5);
    Utils.toast('🕵️ ¡Detección completada! +5 XP', 'success');
  },
};
