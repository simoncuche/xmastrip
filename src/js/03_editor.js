/* ============ Charakter-Editor ============ */
const Editor = {
  open(o = {}) {
    const mode = o.mode || 'new';
    return new Promise((resolve) => {
      const el = document.getElementById('editor');
      const L = Object.assign({}, o.look || (G.S ? G.S.look : defaultLook()));
      const unlocked = (G.S && G.S.unlocked) || {};
      let pid = o.pid || (mode === 'new' ? pick(CREW).id : null);
      if (mode === 'new' && pid) Object.assign(L, crewLook(pid));
      let crewSeed = o.crewSeed || 0;
      const keysFor = { clothes: ['hat', 'hatCol', 'top', 'topCol', 'print', 'pants', 'pantsCol', 'shoes', 'shoesCol', 'acc', 'glasses'], hair: ['hair', 'hairCol'], beard: ['beard', 'beardCol'] }[mode];
      const groups = mode === 'new' ? ['Wer bist du?', ...LOOK_GROUPS] : ['Auswahl'];
      let tab = groups[0];
      let dir = 0, walk = 0;
      const title = { new: 'Wer fährt mit nach Innsbruck?', clothes: 'Kleiderschrank', hair: 'Beim Barbier: Frisur', beard: 'Beim Barbier: Bart' }[mode];
      el.innerHTML = `<div class="ed-head"><h1>${title}</h1><div class="cnt">${mode === 'new' ? `${LOOK_OPTS.length} Merkmale<br>${LOOK_COUNT} Varianten` : ''}</div></div>
        <div class="ed-main"><div class="ed-preview"><div class="ed-figs"><canvas id="edPortrait" width="64" height="64" aria-label="Porträt"></canvas><div><canvas id="edBody" width="18" height="26" aria-label="Spielfigur"></canvas><div class="ed-rot"><button id="edL" aria-label="Drehen links">◀</button><button id="edR" aria-label="Drehen rechts">▶</button></div></div></div>
        <div class="ed-name"><label>Spieler</label><div id="edWho" style="font-family:var(--f-sign);font-size:20px;font-weight:700">${pid ? CREW.find((c) => c.id === pid).name : '<span style="color:var(--ink-dim)">noch niemand gewählt</span>'}</div></div></div>
        <div class="ed-controls"><div class="ed-tabs" role="tablist">${groups.map((g) => `<button class="tab ${g === tab ? 'on' : ''}" data-g="${g}">${g}</button>`).join('')}</div><div class="ed-list" id="edList"></div></div></div>
        <div class="ed-foot"><span class="grow" id="edHint">${mode === 'new' ? `Vorschlag: ${CREW.find((c) => c.id === pid).name}, ${CREW.find((c) => c.id === pid).role}. Tipp auf einen anderen Namen oder gestalte dein Aussehen – dann los!` : 'Änderungen werden sofort übernommen.'}</span>${mode === 'new' ? '<button class="btn" id="edRnd">Zufall</button>' : '<button class="btn" id="edCancel">Abbrechen</button>'}<button class="btn primary" id="edOk">${mode === 'new' ? 'Los geht\'s!' : 'Fertig'}</button></div>`;
      el.hidden = false;
      const pcv = el.querySelector('#edPortrait'), pcx = pcv.getContext('2d');
      const bcv = el.querySelector('#edBody'), bcx = bcv.getContext('2d');
      pcx.imageSmoothingEnabled = false; bcx.imageSmoothingEnabled = false;
      const okBtn = el.querySelector('#edOk');
      const draw = () => {
        pcx.clearRect(0, 0, 64, 64); drawPortrait(pcx, L, { bg: '#2a3a52' });
        bcx.clearRect(0, 0, 18, 26);
        const sheet = getSheet(L);
        const f = [0, 1, 0, 2][Math.floor(walk) % 4];
        bcx.drawImage(sheet, f * SPR_W, dir * SPR_H, SPR_W, SPR_H, 0, 0, SPR_W, SPR_H);
        if (mode === 'new') okBtn.disabled = !pid;
      };
      const iv = setInterval(() => { walk += 0.5; draw(); }, 160);
      el.querySelector('#edL').onclick = () => { dir = [1, 3, 0, 2][dir]; draw(); };
      el.querySelector('#edR').onclick = () => { dir = [2, 0, 3, 1][dir]; draw(); };
      const list = el.querySelector('#edList');
      const renderList = () => {
        const keep = list.scrollTop;
        list.innerHTML = '';
        /* Nach dem Neuaufbau an derselben Stelle bleiben */
        requestAnimationFrame(() => { list.scrollTop = keep; });
        if (tab === 'Wer bist du?') {
          const grid = document.createElement('div');
          grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px';
          for (const c of CREW) {
            const b = document.createElement('button');
            b.className = 'choice' + (pid === c.id ? ' sel' : '');
            b.style.cssText = 'display:grid;grid-template-columns:40px 1fr;align-items:center;column-gap:8px;text-align:left';
            const look = crewLook(c.id);
            b.innerHTML = `<canvas width="64" height="64" style="width:40px;height:40px;image-rendering:pixelated;border-radius:6px;grid-row:1/3" aria-hidden="true"></canvas><span style="font-family:var(--f-pixel);font-size:17px">${c.name}</span><small>${c.role}</small>`;
            b.querySelector('canvas').getContext('2d').drawImage(portraitCanvas(look, '#2a3a52'), 0, 0);
            b.onclick = () => {
              pid = c.id;
              /* Der gewohnte Look des Gewählten als Ausgangspunkt – lässt sich danach frei ändern */
              Object.assign(L, look);
              el.querySelector('#edWho').textContent = c.name;
              el.querySelector('#edHint').textContent = `${c.name}, ${c.role}. Jetzt Aussehen gestalten – oder direkt losfahren.`;
              renderList(); draw(); Snd.sfx('blip');
            };
            grid.appendChild(b);
          }
          list.appendChild(grid);
          const n = document.createElement('p');
          n.className = 'note';
          n.textContent = 'Die anderen elf fahren als Kollegen mit, jeder in seinem gewohnten Look. Wer eine Schlüsselrolle hat (Kassier mit der Gruppenkasse, Anwalt als Jass-Schiedsrichter, Muskelprotz beim Armdrücken …), gibt sie an einen anderen ab, wenn du ihn spielst.';
          list.appendChild(n);
          return;
        }
        const opts = LOOK_OPTS.filter((op) => (keysFor ? keysFor.includes(op.k) : op.g === tab));
        for (const op of opts) {
          const row = document.createElement('div');
          row.className = 'feat';
          const n = (op.col || op.v).length;
          row.innerHTML = `<span>${op.n}<small>${n} Varianten</small></span>`;
          if (op.col) {
            const sw = document.createElement('div'); sw.className = 'swatches';
            op.col.forEach(([name, hex], i) => {
              const b = document.createElement('button');
              b.className = 'sw' + (L[op.k] === i ? ' on' : '');
              b.style.background = hex; b.title = name; b.setAttribute('aria-label', `${op.n}: ${name}`);
              b.onclick = () => { L[op.k] = i; renderList(); draw(); Snd.sfx('blip'); };
              sw.appendChild(b);
            });
            row.appendChild(sw);
          } else {
            const stp = document.createElement('div'); stp.className = 'stepper';
            const out = document.createElement('output');
            const lock = isLocked(op.k, L[op.k], unlocked);
            out.innerHTML = `${op.v[L[op.k]]}${lock ? ' 🔒' : ''}<small>${L[op.k] + 1} / ${n}</small>`;
            const step = (d) => {
              let i = L[op.k];
              for (let k = 0; k < n; k++) { i = (i + d + n) % n; if (!isLocked(op.k, i, unlocked)) break; }
              L[op.k] = i; renderList(); draw(); Snd.sfx('blip');
            };
            const a = document.createElement('button'); a.textContent = '◀'; a.setAttribute('aria-label', 'vorherige'); a.onclick = () => step(-1);
            const b = document.createElement('button'); b.textContent = '▶'; b.setAttribute('aria-label', 'nächste'); b.onclick = () => step(1);
            stp.append(a, out, b);
            row.appendChild(stp);
            const locks = Object.keys(LOCKED[op.k] || {});
            if (locks.some((i) => isLocked(op.k, +i, unlocked))) { const hint = document.createElement('small'); hint.style.cssText = 'grid-column:1/-1;color:var(--ink-dim);font-family:var(--f-sign)'; hint.textContent = `🔒 ${op.v[locks[0]]}: im Trachtenladen in Innsbruck erhältlich`; row.appendChild(hint); }
          }
          list.appendChild(row);
        }
      };
      el.querySelectorAll('.ed-tabs .tab').forEach((t) => t.addEventListener('click', () => { tab = t.dataset.g; el.querySelectorAll('.ed-tabs .tab').forEach((x) => x.classList.toggle('on', x === t)); renderList(); }));
      const close = (val) => { clearInterval(iv); el.hidden = true; el.innerHTML = ''; resolve(val); };
      okBtn.onclick = () => {
        if (mode === 'new' && !pid) { el.querySelector('#edHint').textContent = 'Wähle zuerst, wer du bist!'; Snd.sfx('error'); return; }
        if (mode !== 'new' && G.S) { Object.assign(G.S.look, L); if (G.player) G.player.look = G.S.look; if (tracht()) achieve('tracht'); }
        Snd.sfx('ok');
        close({ look: L, pid, crewSeed });
      };
      const rb = el.querySelector('#edRnd');
      if (rb) rb.onclick = () => { Object.assign(L, randomLook(Math.random, unlocked)); renderList(); draw(); Snd.sfx('blip'); };
      const cb = el.querySelector('#edCrew');
      if (cb) cb.onclick = () => { crewSeed = (crewSeed + 1 + Math.floor(Math.random() * 1000)) % 100000; el.querySelector('#edHint').textContent = 'Die Kollegen sehen jetzt anders aus. Du triffst sie am Torbogen.'; Snd.sfx('blip'); };
      const cc = el.querySelector('#edCancel');
      if (cc) cc.onclick = () => close(null);
      renderList(); draw();
    });
  },
};
