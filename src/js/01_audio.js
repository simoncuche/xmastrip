/* ============ Klang (WebAudio, alles synthetisch) ============ */
const Snd = {
  ctx: null, master: null, musicGain: null, on: true, musicOn: true,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.45;
      this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.32;
      this.musicGain.connect(this.master);
    } catch (e) { this.ctx = null; }
  },
  tone(freq, dur, type = 'square', vol = 0.12, when = 0, slide = 0, dest) {
    if (!this.ctx || !this.on) return;
    const t = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || this.master);
    o.start(t); o.stop(t + dur + 0.02);
  },
  noise(dur, vol = 0.1, freq = 1200, when = 0, type = 'lowpass', dest) {
    if (!this.ctx || !this.on) return;
    const t = this.ctx.currentTime + when;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = this.ctx.createBufferSource(); s.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    const g = this.ctx.createGain(); g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(dest || this.master);
    s.start(t);
  },
  sfx(n) {
    if (!this.ctx || !this.on) return;
    switch (n) {
      case 'blip': this.tone(880, 0.05, 'square', 0.05); break;
      case 'talk': this.tone(rnd(300, 420), 0.03, 'square', 0.025); break;
      case 'ok': this.tone(660, 0.07, 'square', 0.06); this.tone(990, 0.1, 'square', 0.06, 0.07); break;
      case 'error': this.tone(200, 0.15, 'sawtooth', 0.06); break;
      case 'coin': this.tone(988, 0.06, 'square', 0.06); this.tone(1319, 0.18, 'square', 0.06, 0.06); break;
      case 'door': this.noise(0.18, 0.12, 500); this.tone(140, 0.12, 'triangle', 0.08, 0.05); break;
      case 'step': this.noise(0.03, 0.03, 900); break;
      case 'clink': this.tone(2100, 0.25, 'sine', 0.08); this.tone(2650, 0.3, 'sine', 0.06, 0.04); break;
      case 'gulp': this.tone(180, 0.08, 'sine', 0.12, 0, 120); this.tone(160, 0.08, 'sine', 0.1, 0.14, 120); break;
      case 'eat': for (let i = 0; i < 3; i++) this.noise(0.05, 0.08, 1800, i * 0.12, 'bandpass'); break;
      case 'card': this.noise(0.06, 0.1, 3000, 0, 'highpass'); break;
      case 'dart': this.noise(0.05, 0.14, 2500, 0, 'highpass'); this.tone(240, 0.06, 'triangle', 0.08, 0.03); break;
      case 'hit': this.tone(110, 0.12, 'triangle', 0.15, 0, -40); this.noise(0.08, 0.1, 800); break;
      case 'splash': this.noise(0.6, 0.16, 1400); this.noise(0.4, 0.08, 600, 0.15); break;
      case 'ding': this.tone(1568, 0.5, 'sine', 0.1); this.tone(1568, 0.5, 'sine', 0.1, 0.25); break;
      case 'vomit': this.noise(0.7, 0.12, 400); this.tone(160, 0.6, 'sawtooth', 0.04, 0, -90); break;
      case 'cheer': for (let i = 0; i < 10; i++) this.noise(0.25, 0.04, rnd(900, 2400), i * 0.04, 'bandpass'); break;
      case 'whoosh': this.noise(0.4, 0.08, 700, 0, 'bandpass'); break;
      case 'yawn': this.tone(330, 0.6, 'sine', 0.05, 0, -140); break;
      case 'hicks': this.tone(520, 0.06, 'square', 0.05, 0, 260); break;
      case 'shutter': this.noise(0.04, 0.14, 4000, 0, 'highpass'); this.noise(0.05, 0.1, 3000, 0.08, 'highpass'); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.16, 'square', 0.06, i * 0.1)); break;
      case 'lose': [392, 330, 262].forEach((f, i) => this.tone(f, 0.2, 'square', 0.05, i * 0.14)); break;
      case 'lighter': this.noise(0.05, 0.1, 3500, 0, 'highpass'); this.noise(0.4, 0.03, 900, 0.06); break;
      case 'yodel': [392, 587, 494, 784, 659].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.08, i * 0.18, (i % 2 ? -1 : 1) * 80)); break;
      case 'nail': this.tone(1800, 0.05, 'square', 0.05); this.noise(0.06, 0.12, 1500); break;
    }
  },
  /* ---- Musik-Schleifen ---- */
  _mus: null,
  music(kind) {
    if (this._mus && this._mus.kind === kind) return;
    this.stopMusic();
    if (!this.ctx || !kind) return;
    const self = this;
    const st = { kind, step: 0, next: this.ctx.currentTime + 0.05, timer: null };
    const songs = {
      disco: { bpm: 124, steps: 16, play(i, t) {
        const g = self.musicGain, bar = Math.floor(st.step / 16) % 4;
        if (i % 4 === 0) { self.tone(110, 0.18, 'sine', 0.5, t - self.ctx.currentTime, -70, g); }
        if (i % 4 === 2) self.noise(0.04, 0.12, 7000, t - self.ctx.currentTime, 'highpass', g);
        if (i % 8 === 4) self.noise(0.12, 0.16, 1800, t - self.ctx.currentTime, 'bandpass', g);
        const bass = [55, 55, 65.4, 49][bar];
        if (i % 2 === 1) self.tone(bass * 2, 0.11, 'sawtooth', 0.09, t - self.ctx.currentTime, 0, g);
        const mel = [[440, 0, 523, 0, 587, 0, 523, 440], [392, 0, 440, 0, 523, 0, 440, 392], [349, 0, 440, 0, 523, 587, 523, 440], [330, 0, 392, 0, 494, 0, 392, 330]][bar];
        if (i % 2 === 0 && mel[i / 2]) self.tone(mel[i / 2], 0.1, 'square', 0.035, t - self.ctx.currentTime, 0, g);
      } },
      busker: { bpm: 150, steps: 12, play(i, t) {
        const g = self.musicGain, ph = Math.floor(st.step / 12) % 4;
        const dt = t - self.ctx.currentTime;
        if (i % 3 === 0) self.tone([98, 131, 98, 147][ph], 0.2, 'triangle', 0.2, dt, 0, g);
        else self.tone([196, 262, 196, 294][ph] * (i % 3 === 1 ? 1.25 : 1.5), 0.12, 'sawtooth', 0.04, dt, 0, g);
        const mel = [[392, 440, 494, 523, 494, 440, 392, 0, 330, 392, 0, 0], [523, 494, 440, 392, 440, 494, 523, 587, 659, 587, 0, 0],
          [392, 440, 494, 523, 587, 659, 698, 659, 587, 523, 0, 0], [494, 440, 392, 370, 392, 440, 392, 0, 294, 392, 0, 0]][ph];
        if (mel[i]) { self.tone(mel[i], 0.13, 'sawtooth', 0.05, dt, 0, g); self.tone(mel[i] * 1.005, 0.13, 'square', 0.025, dt, 0, g); }
      } },
      bar: { bpm: 96, steps: 8, play(i, t) {
        const g = self.musicGain, ph = Math.floor(st.step / 8) % 4, dt = t - self.ctx.currentTime;
        const root = [131, 175, 147, 196][ph];
        if (i % 4 === 0) self.tone(root / 2, 0.3, 'triangle', 0.18, dt, 0, g);
        if (i % 4 === 2) self.tone(root * 0.75, 0.3, 'triangle', 0.12, dt, 0, g);
        if (i % 2 === 1) self.noise(0.03, 0.05, 6000, dt, 'highpass', g);
        if (i === 0 || i === 3 || i === 6) self.tone(root * 2, 0.25, 'sine', 0.04, dt, 0, g);
      } },
      stube: { bpm: 168, steps: 6, play(i, t) {
        const g = self.musicGain, ph = Math.floor(st.step / 6) % 4, dt = t - self.ctx.currentTime;
        if (i % 3 === 0) self.tone([110, 147, 110, 165][ph], 0.2, 'triangle', 0.16, dt, 0, g);
        else self.tone([220, 294, 220, 330][ph], 0.1, 'square', 0.03, dt, 0, g);
        const mel = [[659, 0, 587, 523, 0, 0], [587, 659, 698, 659, 0, 0], [523, 0, 587, 659, 0, 523], [494, 523, 587, 523, 0, 0]][ph];
        if (mel[i]) self.tone(mel[i], 0.14, 'triangle', 0.06, dt, 0, g);
      } },
    };
    const song = songs[kind];
    if (!song) return;
    st.timer = setInterval(() => {
      if (!self.ctx) return;
      const spb = 60 / song.bpm / (song.steps === 16 ? 4 : song.steps === 12 ? 3 : song.steps === 6 ? 3 : 2);
      while (st.next < self.ctx.currentTime + 0.15) {
        if (self.musicOn && self.on) song.play(st.step % song.steps, st.next);
        st.next += spb; st.step++;
      }
    }, 40);
    this._mus = st;
  },
  stopMusic() { if (this._mus) { clearInterval(this._mus.timer); this._mus = null; } },
};
