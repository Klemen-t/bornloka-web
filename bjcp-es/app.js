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
  html(id,h) { document.getElementById(id).innerHTML = h; }
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
      const distractors = this.getDistractors(style, pool, 3);
      const options = Utils.shuffle([style, ...distractors]);
      const profile = this.pickGuessProfile(style);
      return { style, type:'guess', options, correct: style.name, profile };
    } else {
      // Show name, guess a random parameter (ABV, IBU, SRM, Category, Commercial Examples)
      const possibleSubtypes = [];
      if ((style.abvmin !== undefined && style.abvmin !== null) || (style.abvmax !== undefined && style.abvmax !== null)) possibleSubtypes.push('abv');
      if ((style.ibumin !== undefined && style.ibumin !== null) || (style.ibumax !== undefined && style.ibumax !== null)) possibleSubtypes.push('ibu');
      if ((style.srmmin !== undefined && style.srmmin !== null) || (style.srmmax !== undefined && style.srmmax !== null)) possibleSubtypes.push('srm');
      if (style.category) possibleSubtypes.push('category');
      if (style.commercialexamples && style.commercialexamples.trim().length > 5 && style.commercialexamples !== '-') possibleSubtypes.push('examples');
      
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
    fb.innerHTML = `
      <div class="feedback-title">${isCorrect ? '\u2705 ¡Correcto!' : `\u274c La respuesta correcta era: ${correct}`}</div>
      <div class="feedback-text">${q.style.overallimpression?.substring(0,200)||''}${q.style.overallimpression?.length>200?'\u2026':''}</div>`;
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
          <div class="question-label">🍺 Tasting Mode — Identifica l'estil</div>
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
          <div class="question-label">⚖️ Comparació d'estils</div>
          <div class="question-title">¿De qué estilo habla esta comparación?</div>
          <div class="question-chars">${wide('Comparación de estilos', s.stylecomparison, 450)}${tagsHTML}</div>`;
      } else {
        // sensory (default)
        const chars = [
          s.aroma ? wide('Aroma', s.aroma, 380) : '',
          s.flavor ? wide('Sabor', s.flavor, 380) : '',
          s.mouthfeel ? wide('Sensació', s.mouthfeel, 280) : '',
        ].join('');
        Utils.el('question-card').innerHTML = `
          <div class="question-label">🍺 Endevina l'estil BJCP</div>
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
      if (q.subtype === 'abv') prompt = "Quin és el rang d'alcohol (ABV) d'aquest estil?";
      else if (q.subtype === 'ibu') prompt = "Quin és el rang d'amargor (IBU) d'aquest estil?";
      else if (q.subtype === 'srm') prompt = "Quin és el color típic (SRM) d'aquest estil?";
      else if (q.subtype === 'category') prompt = "¿A qué categoría pertenece este estilo?";
      else if (q.subtype === 'examples') prompt = "Quins d'aquests són exemples comercials d'aquest estil?";

      Utils.el('question-card').innerHTML = `
        <div class="question-label">📋 Defineix l'estil</div>
        <div class="question-title" style="margin-bottom:8px">${s.name}</div>
        <div style="font-size:14px;color:var(--accent);font-weight:600;margin-bottom:16px">${prompt}</div>`;

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
    fb.innerHTML = `
      <div class="feedback-title">${isCorrect?'✅ ¡Correcto!':'❌ Incorrecto — '+q.correct}</div>
      <div class="feedback-text">${q.style.overallimpression?.substring(0,180)||''}…</div>`;
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
        <h2 class="result-title">${pct>=80?'Aprovat amb honors!':pct>=60?'Aprovat!':pct>=40?'Gairebé...':'Segueix practicant!'}</h2>
        <p class="result-subtitle">Examen completat — ${total} preguntes</p>
        <div class="result-breakdown">
          <div class="result-stat"><span class="result-stat-val" style="color:var(--accent)">${pct}%</span><span class="result-stat-key">Nota</span></div>
          <div class="result-stat"><span class="result-stat-val" style="color:var(--green)">${correct}</span><span class="result-stat-key">Correctos</span></div>
          <div class="result-stat"><span class="result-stat-val" style="color:var(--red)">${this.errors.length}</span><span class="result-stat-key">Errores</span></div>
          <div class="result-stat"><span class="result-stat-val">${this.score}</span><span class="result-stat-key">Puntos</span></div>
        </div>
        ${this.errors.length?`<div class="errors-list"><h4 style="margin-bottom:12px">Errores:</h4>${this.errors.map(e=>`<div class="error-item"><div class="error-q">${e.q}</div><div class="error-correct">✓ ${e.correct}</div></div>`).join('')}</div>`:''}
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
    Utils.el('stat-accuracy').textContent = total ? Math.round(d.totalCorrect/total*100)+'%' : '—';

    // Category levels
    const catLevels = Utils.el('cat-levels');
    const cats = Object.entries(d.catStats);
    if(!cats.length) { catLevels.innerHTML = '<div class="empty-state">Encara no has practicat per categories</div>'; }
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
    if(!weakStyles.length) { weak.innerHTML = '<div class="empty-state">Cap error de moment 🎉</div>'; }
    else {
      weak.innerHTML = weakStyles.map(([name,st]) => `
        <div class="weak-style-item" onclick="Study.openModal('${name.replace(/'/g,"\\'")}');App.showMode('study')">
          <div class="weak-style-name">${name}</div>
          <div class="weak-style-errors">❌ ${st.wrong}</div>
        </div>`).join('');
    }

    // Favorites
    const favEl = Utils.el('fav-styles-list');
    if(!d.favorites.length) { favEl.innerHTML = '<div class="empty-state">Afegeix estils a preferits amb ❤️</div>'; }
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
