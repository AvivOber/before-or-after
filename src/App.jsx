import { useState, useEffect, useRef } from "react";

// ─── SONG DATABASE ─────────────────────────────────────────────────────────────
const SONG_DB = [
  { id: 1,  title: "Bohemian Rhapsody",    artist: "Queen",            year: 1975, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",  fact: "Took three weeks to record and cost £4,500 — an unheard-of sum at the time." },
  { id: 2,  title: "Billie Jean",           artist: "Michael Jackson",  year: 1983, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",  fact: "Michael Jackson invented a special weighted shoe to perform the iconic lean." },
  { id: 3,  title: "Smells Like Teen Spirit",artist: "Nirvana",         year: 1991, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",  fact: "Kurt Cobain described the riff as his attempt to write 'the ultimate pop song'." },
  { id: 4,  title: "Rolling in the Deep",   artist: "Adele",            year: 2010, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",  fact: "Written in 40 minutes after a breakup. It became the best-selling single of 2011." },
  { id: 5,  title: "Like a Rolling Stone",  artist: "Bob Dylan",        year: 1965, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",  fact: "Columbia Records hesitated to release a 6-minute single — it became his biggest hit." },
  { id: 6,  title: "Superstition",          artist: "Stevie Wonder",    year: 1972, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",  fact: "Stevie Wonder wrote it in 30 minutes and played every instrument himself." },
  { id: 7,  title: "Purple Rain",           artist: "Prince",           year: 1984, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",  fact: "The iconic guitar solo was recorded live in one take in front of a real audience." },
  { id: 8,  title: "Hey Jude",              artist: "The Beatles",      year: 1968, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",  fact: "Paul McCartney wrote it for John Lennon's son Julian during his parents' divorce." },
  { id: 9,  title: "Mr. Brightside",        artist: "The Killers",      year: 2003, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",  fact: "It spent a record 286 weeks on the UK Singles Chart across its entire lifespan." },
  { id: 10, title: "Lose Yourself",         artist: "Eminem",           year: 2002, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", fact: "Eminem wrote the lyrics on set during filming of 8 Mile, on a paper bag." },
  { id: 11, title: "Bad Guy",               artist: "Billie Eilish",    year: 2019, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", fact: "Her brother Finneas produced the entire song in his childhood bedroom." },
  { id: 12, title: "God's Plan",            artist: "Drake",            year: 2018, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", fact: "Drake gave away his entire $996,631 video budget to strangers in Miami during filming." },
  { id: 13, title: "Thriller",              artist: "Michael Jackson",  year: 1982, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",  fact: "The music video cost $500,000 — the most expensive ever made at the time." },
  { id: 14, title: "Hotel California",      artist: "Eagles",           year: 1977, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",  fact: "Don Felder wrote the iconic riff while doodling on a 12-string acoustic." },
  { id: 15, title: "Blinding Lights",       artist: "The Weeknd",       year: 2019, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",  fact: "Holds the record for most weeks in the top 10 of the Billboard Hot 100." },
  { id: 16, title: "Yesterday",             artist: "The Beatles",      year: 1965, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",  fact: "McCartney dreamed the melody and used the placeholder lyrics 'Scrambled eggs'." },
  { id: 17, title: "Shape of You",          artist: "Ed Sheeran",       year: 2017, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",  fact: "Written in 20 minutes — it was originally intended for Rihanna." },
  { id: 18, title: "Waterloo",              artist: "ABBA",             year: 1974, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",  fact: "ABBA won Eurovision with this song in 1974, launching their international career." },
  { id: 19, title: "Born to Run",           artist: "Bruce Springsteen",year: 1975, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",  fact: "Springsteen spent six months perfecting this song, calling it 'the most difficult'." },
  { id: 20, title: "DNA",                   artist: "Kendrick Lamar",   year: 2017, preview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",  fact: "Fox News played the video during a segment — Kendrick later turned it against them." },
];

// ─── SCORING CONFIG (easy to extend for future stages) ───────────────────────
const SCORING = {
  correct: 100,
  // future: speedBonus: (timeLeft, totalTime) => Math.floor(timeLeft / totalTime * 50),
};

// ─── SHARED IN-MEMORY STATE (simulates a real-time backend) ──────────────────
let SHARED = null;
const SUBS = new Set();
function getShared() { return SHARED; }
function setShared(updater) {
  SHARED = typeof updater === "function" ? updater(SHARED) : updater;
  SUBS.forEach(fn => fn({ ...SHARED }));
}
function useShared() {
  const [state, setState] = useState(SHARED);
  useEffect(() => {
    const handler = s => setState(s ? { ...s } : null);
    SUBS.add(handler);
    return () => SUBS.delete(handler);
  }, []);
  return state;
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
let SETTINGS = { volume: 0.8, sfx: 0.8 };
const SETTINGS_SUBS = new Set();
function setSettings(updater) {
  SETTINGS = typeof updater === "function" ? updater(SETTINGS) : updater;
  SETTINGS_SUBS.forEach(fn => fn({ ...SETTINGS }));
}
function useSettings() {
  const [s, setS] = useState({ ...SETTINGS });
  useEffect(() => {
    const h = v => setS({ ...v });
    SETTINGS_SUBS.add(h);
    return () => SETTINGS_SUBS.delete(h);
  }, []);
  return s;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function genPin() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => c[Math.floor(Math.random() * c.length)]).join("");
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const AVATAR_COLORS = ["#7c3aed","#0891b2","#d97706","#dc2626","#059669","#db2777","#2563eb","#65a30d"];
function avatarColor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null); // null | "host" | "player"

  return role === null ? (
    <Landing onHost={() => setRole("host")} onJoin={() => setRole("player")} />
  ) : role === "host" ? (
    <HostApp onBack={() => { setShared(null); setRole(null); }} />
  ) : (
    <PlayerApp onBack={() => setRole(null)} />
  );
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
function Landing({ onHost, onJoin }) {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <Screen bg="deep" style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      <style>{GLOBAL_CSS}</style>
      <button onClick={() => setShowSettings(true)} style={S.settingsBtn}>⚙️</button>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {/* Header at top */}
      <div style={{ textAlign:"center", padding:"2.5rem 1rem 0" }}>
        <div style={S.logoWrap}>
          <span style={S.logoB}>Before</span>
          <span style={S.logoOr}> or </span>
          <span style={S.logoA}>After</span>
        </div>
        <p style={S.tagline}>The ultimate music timeline party game</p>
      </div>
      {/* Buttons centered in remaining space */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1rem" }}>
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", justifyContent:"center" }}>
          <Btn variant="purple" size="lg" onClick={onHost}>🎮 Host a Game</Btn>
          <Btn variant="teal"   size="lg" onClick={onJoin}>📱 Join a Game</Btn>
        </div>
        <p style={{ color:"#475569", fontSize:"0.85rem" }}>
          Host on a big screen · Players join on their phones
        </p>
      </div>
    </Screen>
  );
}

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
function SettingsPanel({ onClose }) {
  const settings = useSettings();
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:200, backdropFilter:"blur(4px)",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"#1a1740", border:"1px solid rgba(255,255,255,0.12)",
        borderRadius:22, padding:"2rem", width:"min(90vw, 380px)",
        display:"flex", flexDirection:"column", gap:"1.5rem",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ color:"#e2e8f0", fontWeight:900, margin:0, fontSize:"1.3rem" }}>⚙️ Settings</h2>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#94a3b8", fontSize:"1.4rem", cursor:"pointer", lineHeight:1 }}>✕</button>
        </div>

        <SettingBlock label="🔊 Music Volume">
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
            <input type="range" min="0" max="1" step="0.01"
              value={settings.volume}
              onChange={e => setSettings(s => ({ ...s, volume: +e.target.value }))}
              style={{ ...S.slider, flex:1 }} />
            <span style={{ color:"#a78bfa", fontWeight:700, minWidth:38, textAlign:"right", fontSize:"0.9rem" }}>
              {Math.round(settings.volume * 100)}%
            </span>
          </div>
        </SettingBlock>

        <SettingBlock label="🎛️ SFX Volume">
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
            <input type="range" min="0" max="1" step="0.01"
              value={settings.sfx}
              onChange={e => setSettings(s => ({ ...s, sfx: +e.target.value }))}
              style={{ ...S.slider, flex:1 }} />
            <span style={{ color:"#a78bfa", fontWeight:700, minWidth:38, textAlign:"right", fontSize:"0.9rem" }}>
              {Math.round(settings.sfx * 100)}%
            </span>
          </div>
        </SettingBlock>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOST FLOW
// ═══════════════════════════════════════════════════════════════════════════════
function HostApp({ onBack }) {
  const gs = useShared();
  const phase = gs?.phase;

  function backToMenu() { setShared(null); onBack(); }

  if (!phase)              return <HostSetup   onBack={onBack} />;
  if (phase === "lobby")   return <HostLobby   gs={gs} onBack={backToMenu} />;
  if (phase === "playing") return <HostPlaying gs={gs} onBack={backToMenu} />;
  if (phase === "reveal")  return <HostReveal  gs={gs} onBack={backToMenu} />;
  if (phase === "podium")  return <HostPodium  gs={gs} onBack={backToMenu} />;
  return null;
}

// ─── PIVOT HELPERS ────────────────────────────────────────────────────────────
// pivotMode: "year" | "date"
// pivotYear: number (used in year mode, and as the year component in date mode)
// pivotMonth / pivotDay: numbers (only used in date mode)
// pivotLabel(gs): human-readable string for display everywhere
// songIsCorrect(song, gs): returns "before" | "after"
function pivotLabel(gs) {
  if (gs.pivotMode === "date") {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[gs.pivotMonth - 1]} ${gs.pivotDay}, ${gs.pivotYear}`;
  }
  return String(gs.pivotYear);
}
function songIsCorrect(song, gs) {
  if (gs.pivotMode === "date") {
    // Compare song release year against the full date
    // Songs only have year precision, so: song year < pivot year → before
    // song year === pivot year → treat as "before" (released earlier in that year is unknown,
    //   so we conservatively say before the date unless month/day tips it)
    if (song.year < gs.pivotYear) return "before";
    if (song.year > gs.pivotYear) return "after";
    // Same year — since songs only store year, we compare against Jan 1 of that year
    // i.e. if pivot is June 15 2000 and song is from 2000, we can't know → mark "before" the date
    // (In a future build with full release dates this becomes exact)
    return "before";
  }
  return song.year < gs.pivotYear ? "before" : "after";
}

// HOST: SETUP ──────────────────────────────────────────────────────────────────
function HostSetup({ onBack }) {
  const [pivotMode,  setPivotMode]  = useState("year"); // "year" | "date"
  const [pivotYear,  setPivotYear]  = useState(2000);
  const [pivotMonth, setPivotMonth] = useState(6);
  const [pivotDay,   setPivotDay]   = useState(15);
  const [rounds,     setRounds]     = useState(12);
  const [timer,      setTimer]      = useState(30);

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysInMonth = new Date(pivotYear, pivotMonth, 0).getDate();

  // Keep day in range when month/year changes
  useEffect(() => {
    if (pivotDay > daysInMonth) setPivotDay(daysInMonth);
  }, [pivotMonth, pivotYear, daysInMonth]);

  function create() {
    const songs = shuffle(SONG_DB).slice(0, rounds);
    setShared({
      phase: "lobby", pin: genPin(),
      pivotMode, pivotYear, pivotMonth, pivotDay,
      rounds, timer, songs,
      currentRound: 0,
      players: {}, answers: {}, roundScores: {},
    });
  }

  const previewLabel = pivotMode === "date"
    ? `${MONTHS[pivotMonth-1]} ${pivotDay}, ${pivotYear}`
    : String(pivotYear);

  return (
    <Screen center bg="deep">
      <style>{GLOBAL_CSS}</style>
      <BackBtn onClick={onBack} />
      <Card style={{ maxWidth:480, width:"100%" }}>
        <h1 style={{ ...S.heading, textAlign:"center", marginBottom:"2rem" }}>Game Settings</h1>

        {/* ── Pivot setting ── */}
        <SettingBlock
          label="🗓 Pivot Date"
          desc="Players decide: was each song released BEFORE or AFTER this date?">

          {/* Mode toggle */}
          <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.25rem" }}>
            {["year","date"].map(m => (
              <button key={m}
                onClick={() => setPivotMode(m)}
                style={{
                  flex:1, padding:"0.5rem", borderRadius:10, fontWeight:700, fontSize:"0.88rem", cursor:"pointer",
                  border: pivotMode === m ? "2px solid #7c3aed" : "2px solid rgba(255,255,255,0.1)",
                  background: pivotMode === m ? "rgba(124,58,237,0.18)" : "transparent",
                  color: pivotMode === m ? "#a78bfa" : "#64748b", transition:"all 0.15s",
                }}>
                {m === "year" ? "📅 Year only" : "📆 Specific date"}
              </button>
            ))}
          </div>

          {/* Preview pill */}
          <div style={{ textAlign:"center", marginBottom:"1.25rem" }}>
            <div style={S.bigNum}>{previewLabel}</div>
          </div>

          {/* Year (always shown) */}
          <div style={{ marginBottom: pivotMode === "date" ? "1rem" : 0 }}>
            <p style={{ color:"#64748b", fontSize:"0.78rem", marginBottom:4 }}>Year</p>
            <input type="range" min="1950" max="2023" value={pivotYear}
              onChange={e => setPivotYear(+e.target.value)} style={S.slider} />
            <div style={{ display:"flex", justifyContent:"space-between", color:"#475569", fontSize:"0.75rem", marginTop:2 }}>
              <span>1950</span><span style={{color:"#94a3b8",fontWeight:600}}>{pivotYear}</span><span>2023</span>
            </div>
          </div>

          {/* Month + Day (date mode only) */}
          {pivotMode === "date" && (
            <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
              <div style={{ flex:2 }}>
                <p style={{ color:"#64748b", fontSize:"0.78rem", marginBottom:4 }}>Month</p>
                <select value={pivotMonth} onChange={e => setPivotMonth(+e.target.value)} style={S.select}>
                  {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                </select>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ color:"#64748b", fontSize:"0.78rem", marginBottom:4 }}>Day</p>
                <select value={pivotDay} onChange={e => setPivotDay(+e.target.value)} style={S.select}>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </SettingBlock>

        <SettingBlock label="🎵 Number of Rounds">
          <ChipGroup value={rounds} onChange={setRounds} options={[8,12,15,20]} />
        </SettingBlock>

        <SettingBlock label="⏱ Answer Timer">
          <ChipGroup value={timer} onChange={setTimer} options={[30,45,60]} suffix="s" />
        </SettingBlock>

        <Btn variant="purple" size="lg" style={{ width:"100%", marginTop:"0.5rem" }} onClick={create}>
          Create Room →
        </Btn>
      </Card>
    </Screen>
  );
}

// HOST: LOBBY ──────────────────────────────────────────────────────────────────
function HostLobby({ gs, onBack }) {
  const players = Object.values(gs.players);

  function start() {
    setShared(s => ({ ...s, phase:"playing", answers:{}, roundStartTime: Date.now() }));
  }

  return (
    <Screen bg="deep" className="lobby-layout" style={{ padding:"2rem", gap:"2rem", minHeight:"100vh" }}>
      <style>{GLOBAL_CSS}</style>
      <BackBtn onClick={onBack} />
      {/* Left panel: PIN */}
      <div style={{ flex:"0 0 300px", display:"flex", flexDirection:"column", gap:"1.5rem", alignItems:"center", justifyContent:"center" }}>
        <div style={S.logoSmall}>Before or After</div>
        <div style={{ ...S.card, textAlign:"center", width:"100%", border:"2px solid #7c3aed" }}>
          <p style={{ color:"#94a3b8", fontSize:"0.78rem", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>Room PIN</p>
          <div style={{ fontSize:"3.2rem", fontWeight:900, letterSpacing:"0.18em", color:"#e2e8f0", fontFamily:"monospace", margin:"0.5rem 0" }}>{gs.pin}</div>
          <p style={{ color:"#64748b", fontSize:"0.78rem", margin:0 }}>Share this code with players</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6, color:"#64748b", fontSize:"0.88rem", alignItems:"center" }}>
          <span>🎵 {gs.rounds} rounds</span>
          <span>⏱ {gs.timer}s per round</span>
          <span>🗓 Pivot: {pivotLabel(gs)}</span>
        </div>
      </div>

      {/* Right panel: players */}
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <h2 style={{ color:"#e2e8f0", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:12 }}>
          Players Joined
          <span style={{ background:"#7c3aed", color:"#fff", borderRadius:999, padding:"0 0.6rem", fontSize:"1rem" }}>
            {players.length}
          </span>
        </h2>
        <div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:"0.75rem", alignContent:"flex-start" }}>
          {players.length === 0
            ? <p style={{ color:"#475569", fontStyle:"italic" }}>Waiting for players to join…</p>
            : players.map(p => (
              <div key={p.id} style={S.playerChip}>
                <Avatar name={p.name} size={32} />
                <span style={{ color:"#e2e8f0" }}>{p.name}</span>
              </div>
            ))
          }
        </div>
        <Btn variant="purple" size="lg" style={{ width:"100%", marginTop:"1.5rem" }}
          disabled={players.length === 0} onClick={start}>
          Start Game! 🎮
        </Btn>
      </div>
    </Screen>
  );
}

// HOST: PLAYING ────────────────────────────────────────────────────────────────
function HostPlaying({ gs, onBack }) {
  const { songs, currentRound, timer, answers, players } = gs;
  const song = songs[currentRound];
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(timer);
  const totalPlayers = Object.keys(players).length;
  const answeredCount = Object.keys(answers).length;
  const label = pivotLabel(gs);
  const settings = useSettings();

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = settings.volume;
  }, [settings.volume]);

  // reset & start timer on each new round
  useEffect(() => {
    setTimeLeft(timer);
    if (audioRef.current) { audioRef.current.load(); audioRef.current.volume = SETTINGS.volume; audioRef.current.play().catch(() => {}); }
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(intervalRef.current); doReveal(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [currentRound]); // eslint-disable-line

  function doReveal() {
    clearInterval(intervalRef.current);
    if (audioRef.current) audioRef.current.pause();
    const correct = songIsCorrect(song, gs);
    const roundScores = {};
    Object.keys(players).forEach(pid => {
      roundScores[pid] = answers[pid] === correct ? SCORING.correct : 0;
    });
    setShared(s => {
      const updatedPlayers = { ...s.players };
      Object.keys(players).forEach(pid => {
        updatedPlayers[pid] = { ...updatedPlayers[pid], score: (updatedPlayers[pid].score || 0) + (roundScores[pid] || 0) };
      });
      return { ...s, phase:"reveal", correctAnswer: correct, roundScores, players: updatedPlayers };
    });
  }

  const pct = Math.round((timeLeft / timer) * 100);
  const urgent = timeLeft <= 10;

  return (
    <Screen bg="deep" style={{ padding:"2rem", display:"flex", flexDirection:"column", gap:"2rem", minHeight:"100vh" }}>
      <style>{GLOBAL_CSS}</style>
      <audio ref={audioRef} src={song.preview} />
      <BackBtn onClick={onBack} />

      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", paddingLeft:"80px" }}>
        <span style={S.roundBadge}>Round {currentRound + 1} / {songs.length}</span>
        <div style={{ flex:1, height:10, background:"rgba(255,255,255,0.08)", borderRadius:999, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, borderRadius:999, background: urgent ? "#ef4444" : "#7c3aed", transition:"width 1s linear, background 0.3s" }} />
        </div>
        <span style={{ fontWeight:900, fontSize:"1.8rem", minWidth:52, textAlign:"right", color: urgent ? "#ef4444" : "#e2e8f0", transition:"color 0.3s" }}>
          {timeLeft}
        </span>
      </div>

      {/* Centre */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1.5rem" }}>
        <div style={{ fontSize:"5rem", animation:"bob 1.2s ease-in-out infinite alternate" }}>🎵</div>
        <h2 style={{ color:"#e2e8f0", fontSize:"2.2rem", fontWeight:700, margin:0 }}>Now Playing…</h2>
        <p style={{ color:"#94a3b8", fontSize:"1.2rem", margin:0 }}>Was this song released…</p>
        <div style={{ display:"flex", alignItems:"center", gap:"2rem", marginTop:"0.5rem", flexWrap:"wrap", justifyContent:"center" }}>
          <div style={{ background:"#4f46e5", borderRadius:16, padding:"1rem 2rem", color:"#fff", fontWeight:900, fontSize:"1.5rem" }}>⏮ BEFORE</div>
          <div style={{ color:"#e2e8f0", fontSize: label.length > 8 ? "2.2rem" : "4rem", fontWeight:900, letterSpacing:"-0.03em", textAlign:"center" }}>{label}</div>
          <div style={{ background:"#0891b2", borderRadius:16, padding:"1rem 2rem", color:"#fff", fontWeight:900, fontSize:"1.5rem" }}>AFTER ⏭</div>
        </div>
      </div>

      {/* Answer progress */}
      <div style={{ textAlign:"center" }}>
        <p style={{ color:"#64748b", margin:"0 0 8px" }}>{answeredCount} / {totalPlayers} answered</p>
        <div style={{ height:6, background:"rgba(255,255,255,0.07)", borderRadius:999, overflow:"hidden" }}>
          <div style={{ height:"100%", background:"#34d399", borderRadius:999, transition:"width 0.4s",
            width: totalPlayers > 0 ? `${(answeredCount/totalPlayers)*100}%` : "0%" }} />
        </div>
      </div>

      <button onClick={doReveal} style={S.ghostBtn}>Skip → Reveal Answer</button>
    </Screen>
  );
}

// HOST: REVEAL ─────────────────────────────────────────────────────────────────
function HostReveal({ gs, onBack }) {
  const { songs, currentRound, correctAnswer, roundScores, players } = gs;
  const song = songs[currentRound];
  const isLast = currentRound >= songs.length - 1;
  const label = pivotLabel(gs);

  function next() {
    if (isLast) {
      setShared(s => ({ ...s, phase:"podium" }));
    } else {
      setShared(s => ({ ...s, phase:"playing", currentRound: s.currentRound + 1, answers:{}, roundStartTime: Date.now() }));
    }
  }

  const correct = correctAnswer === "before";
  const winners = Object.entries(roundScores)
    .filter(([, pts]) => pts > 0)
    .map(([pid]) => players[pid]?.name)
    .filter(Boolean);

  return (
    <Screen center bg="deep">
      <style>{GLOBAL_CSS}</style>
      <BackBtn onClick={onBack} />
      <Card style={{ maxWidth:560, width:"100%", gap:"1.5rem" }}>
        {/* Answer banner */}
        <div style={{ background: correct ? "#4f46e5" : "#0891b2", borderRadius:16, padding:"1.5rem 2rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          <span style={{ fontSize:"2.5rem" }}>{correct ? "⏮" : "⏭"}</span>
          <div>
            <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.85rem", margin:0 }}>The answer was</p>
            <p style={{ color:"#fff", fontSize:"1.6rem", fontWeight:900, margin:0 }}>
              {correct ? "BEFORE" : "AFTER"} {label}
            </p>
          </div>
        </div>

        {/* Song details */}
        <div style={{ textAlign:"center" }}>
          <p style={{ color:"#94a3b8", fontSize:"0.85rem", margin:"0 0 4px" }}>The song was</p>
          <h2 style={{ color:"#e2e8f0", fontSize:"1.9rem", fontWeight:700, margin:0 }}>🎵 {song.title}</h2>
          <p style={{ color:"#94a3b8", margin:"4px 0 0" }}>{song.artist}</p>
          <span style={{ display:"inline-block", background:"#7c3aed", color:"#fff", borderRadius:999, padding:"0.25rem 1rem", fontWeight:700, marginTop:10, fontSize:"1.1rem" }}>
            {song.year}
          </span>
          {song.fact && (
            <p style={{ color:"#64748b", fontSize:"0.88rem", fontStyle:"italic", marginTop:"1rem", lineHeight:1.6 }}>
              💡 {song.fact}
            </p>
          )}
        </div>

        {/* Who got it right */}
        {winners.length > 0 ? (
          <div style={{ background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.25)", borderRadius:12, padding:"1rem 1.25rem" }}>
            <p style={{ color:"#34d399", fontWeight:700, margin:"0 0 6px" }}>✅ Correct answers:</p>
            <p style={{ color:"#a7f3d0", margin:0 }}>{winners.join(", ")}</p>
          </div>
        ) : (
          <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12, padding:"1rem 1.25rem" }}>
            <p style={{ color:"#f87171", margin:0, fontWeight:700 }}>😬 Nobody got it right!</p>
          </div>
        )}

        {/* Live standings preview */}
        <MiniLeaderboard players={players} limit={5} />

        <Btn variant="purple" size="lg" style={{ width:"100%" }} onClick={next}>
          {isLast ? "🏆 Final Results" : `Round ${currentRound + 2} →`}
        </Btn>
      </Card>
    </Screen>
  );
}

// HOST: PODIUM ─────────────────────────────────────────────────────────────────
function HostPodium({ gs, onBack }) {
  const sorted = Object.values(gs.players).sort((a, b) => b.score - a.score);
  const [first, second, third] = sorted;

  function again() { setShared(null); onBack(); }

  return (
    <Screen bg="deep" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", padding:"2rem 2rem 3rem", gap:"2rem" }}>
      <style>{GLOBAL_CSS}</style>
      <h1 style={{ ...S.heading, fontSize:"2.8rem", margin:0 }}>🏆 Final Results</h1>

      {/* Podium visual */}
      <div style={{ display:"flex", alignItems:"flex-end", gap:"1rem", justifyContent:"center" }}>
        {[
          { p: second, rank:2, h:130, bg:"#94a3b8" },
          { p: first,  rank:1, h:185, bg:"#FFD700" },
          { p: third,  rank:3, h:95,  bg:"#cd7f32" },
        ].map(({ p, rank, h, bg }) => (
          <div key={rank} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            {p ? (
              <>
                <Avatar name={p.name} size={44} style={{ marginBottom:6 }} />
                <p style={{ color:"#e2e8f0", fontWeight:700, fontSize:"0.9rem", margin:"0 0 2px", textAlign:"center", maxWidth:110 }}>{p.name}</p>
                <p style={{ color:"#94a3b8", fontSize:"0.8rem", margin:"0 0 6px" }}>{p.score} pts</p>
              </>
            ) : <div style={{ height:72 }} />}
            <div style={{ width:110, height:h, background:bg, borderRadius:"8px 8px 0 0", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:"2.2rem", fontWeight:900, color:"rgba(0,0,0,0.3)" }}>#{rank}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full leaderboard */}
      <div style={{ width:"100%", maxWidth:440, display:"flex", flexDirection:"column", gap:8 }}>
        {sorted.map((p, i) => (
          <div key={p.id} style={{ display:"flex", gap:"1rem", alignItems:"center", background:"rgba(255,255,255,0.05)", borderRadius:10, padding:"0.7rem 1rem" }}>
            <span style={{ color:"#7c3aed", fontWeight:700, minWidth:24 }}>{i + 1}</span>
            <Avatar name={p.name} size={28} />
            <span style={{ flex:1, color:"#e2e8f0" }}>{p.name}</span>
            <span style={{ color:"#a78bfa", fontWeight:700 }}>{p.score} pts</span>
          </div>
        ))}
      </div>

      <Btn variant="purple" size="lg" style={{ minWidth:200 }} onClick={again}>Play Again 🎮</Btn>
    </Screen>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER FLOW
// ═══════════════════════════════════════════════════════════════════════════════
function PlayerApp({ onBack }) {
  const gs = useShared();
  const [pid] = useState(() => "p_" + Math.random().toString(36).slice(2, 9));
  const [joined, setJoined] = useState(false);
  const [name,   setName]   = useState("");

  function handleJoin(playerName) {
    setName(playerName);
    setState_player(playerName);
    setJoined(true);
  }

  function setState_player(playerName) {
    setShared(s => ({ ...s, players: { ...s.players, [pid]: { id:pid, name:playerName, score:0 } } }));
  }

  if (!joined) return <PlayerJoin gs={gs} onBack={onBack} onJoin={handleJoin} />;

  const phase = gs?.phase;
  if (!phase || phase === "lobby") return <PlayerWaiting gs={gs} name={name} />;
  if (phase === "playing")         return <PlayerPlaying gs={gs} pid={pid} name={name} />;
  if (phase === "reveal")          return <PlayerReveal  gs={gs} pid={pid} name={name} />;
  if (phase === "podium")          return <PlayerPodium  gs={gs} pid={pid} onBack={onBack} />;
  return null;
}

// PLAYER: JOIN ─────────────────────────────────────────────────────────────────
function PlayerJoin({ gs, onBack, onJoin }) {
  const [nameVal, setNameVal] = useState("");
  const [pinVal,  setPinVal]  = useState("");
  const [err,     setErr]     = useState("");

  function submit() {
    const live = getShared();
    if (!nameVal.trim())                      { setErr("Please enter your name."); return; }
    if (!live)                                { setErr("No active game found. Ask the host for the PIN."); return; }
    if (pinVal.toUpperCase() !== live.pin)    { setErr("Wrong PIN — try again."); return; }
    if (live.phase !== "lobby")               { setErr("This game has already started."); return; }
    onJoin(nameVal.trim());
  }

  return (
    <Screen center bg="deep">
      <style>{GLOBAL_CSS}</style>
      <BackBtn onClick={onBack} />
      <Card style={{ maxWidth:360, width:"90%", gap:"1rem", alignItems:"center" }}>
        <div style={S.logoSmall}>Before or After</div>
        <h2 style={{ color:"#e2e8f0", margin:0 }}>Join Game</h2>
        <input style={S.input} placeholder="Your name" maxLength={20}
          value={nameVal} onChange={e => setNameVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()} />
        <input style={{ ...S.input, textTransform:"uppercase", letterSpacing:"0.15em", fontFamily:"monospace", fontSize:"1.1rem" }}
          placeholder="Room PIN" maxLength={5}
          value={pinVal} onChange={e => setPinVal(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && submit()} />
        {err && <p style={{ color:"#f87171", fontSize:"0.85rem", margin:0, textAlign:"center" }}>{err}</p>}
        <Btn variant="teal" size="lg" style={{ width:"100%" }} onClick={submit}>Join! 🎮</Btn>
      </Card>
    </Screen>
  );
}

// PLAYER: WAITING ──────────────────────────────────────────────────────────────
function PlayerWaiting({ gs, name }) {
  return (
    <Screen center bg="deep">
      <style>{GLOBAL_CSS}</style>
      <div style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem" }}>
        <Avatar name={name} size={80} style={{ fontSize:"2.2rem" }} />
        <h2 style={{ color:"#e2e8f0", fontSize:"1.8rem", margin:0 }}>{name}</h2>
        <p style={{ color:"#34d399", margin:0 }}>You're in the game! 🎉</p>
        <div style={{ display:"flex", gap:"0.5rem", margin:"0.5rem 0" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:"#7c3aed",
              animation:`bounce 0.8s ${i*0.2}s ease-in-out infinite alternate` }} />
          ))}
        </div>
        <p style={{ color:"#64748b", margin:0 }}>Waiting for the host to start…</p>
        {gs && <div style={{ marginTop:"0.5rem", background:"rgba(255,255,255,0.06)", borderRadius:8, padding:"0.4rem 1rem", color:"#475569", fontFamily:"monospace", fontSize:"0.85rem" }}>PIN: {gs.pin}</div>}
      </div>
    </Screen>
  );
}

// PLAYER: PLAYING ──────────────────────────────────────────────────────────────
function PlayerPlaying({ gs, pid, name }) {
  const { timer, currentRound, songs, answers } = gs;
  const [timeLeft, setTimeLeft] = useState(timer);
  const intervalRef = useRef(null);
  const myAnswer = answers[pid];
  const hasAnswered = !!myAnswer;
  const label = pivotLabel(gs);

  useEffect(() => {
    setTimeLeft(timer);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(intervalRef.current); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [currentRound, timer]);

  function answer(choice) {
    if (hasAnswered) return;
    setShared(s => ({ ...s, answers: { ...s.answers, [pid]: choice } }));
  }

  const pct = Math.round((timeLeft / timer) * 100);
  const urgent = timeLeft <= 10;

  return (
    <Screen bg="deep" style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Header bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1rem 1.25rem" }}>
        <span style={{ color:"#a78bfa", fontWeight:700 }}>{name}</span>
        <span style={{ color:"#64748b", fontSize:"0.82rem" }}>Round {currentRound+1}/{songs.length}</span>
        <span style={{ fontWeight:900, fontSize:"1.3rem", color: urgent ? "#ef4444" : "#a78bfa", transition:"color 0.3s" }}>{timeLeft}s</span>
      </div>
      <div style={{ height:4, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background: urgent ? "#ef4444" : "#7c3aed", transition:"width 1s linear, background 0.3s" }} />
      </div>

      {/* Question */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", padding:"1rem" }}>
        <div style={{ fontSize:"4.5rem", animation:"bob 1.2s ease-in-out infinite alternate" }}>🎵</div>
        <p style={{ color:"#94a3b8", fontSize:"1.05rem", margin:0, textAlign:"center" }}>Was this song released</p>
        <div style={{ color:"#e2e8f0", fontSize: label.length > 8 ? "2rem" : "3.5rem", fontWeight:900, letterSpacing:"-0.03em", textAlign:"center", lineHeight:1.1 }}>{label}</div>
        <p style={{ color:"#64748b", fontSize:"0.85rem", margin:0 }}>Listen carefully — then choose below</p>
      </div>

      {/* Buttons or locked state */}
      <div style={{ padding:"1.25rem", paddingBottom:"2rem" }}>
        {!hasAnswered ? (
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <button onClick={() => answer("before")} style={{ ...S.answerBtn, background:"linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
              <span style={{ fontSize:"1.8rem" }}>⏮</span>
              <div>
                <div style={{ fontWeight:900, fontSize:"1.3rem", color:"#fff" }}>BEFORE</div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.85rem" }}>Released before {label}</div>
              </div>
            </button>
            <button onClick={() => answer("after")} style={{ ...S.answerBtn, background:"linear-gradient(135deg,#0891b2,#0d9488)" }}>
              <span style={{ fontSize:"1.8rem" }}>⏭</span>
              <div>
                <div style={{ fontWeight:900, fontSize:"1.3rem", color:"#fff" }}>AFTER</div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.85rem" }}>Released after {label}</div>
              </div>
            </button>
          </div>
        ) : (
          <div style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem" }}>
            <div style={{
              background: myAnswer === "before" ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "linear-gradient(135deg,#0891b2,#0d9488)",
              borderRadius:16, padding:"1.25rem 2.5rem", color:"#fff", fontWeight:900, fontSize:"1.2rem"
            }}>
              {myAnswer === "before" ? "⏮ BEFORE" : "⏭ AFTER"} {label}
            </div>
            <p style={{ color:"#64748b", margin:0, fontSize:"0.9rem" }}>Answer locked in — waiting for others…</p>
          </div>
        )}
      </div>
    </Screen>
  );
}

// PLAYER: REVEAL ───────────────────────────────────────────────────────────────
function PlayerReveal({ gs, pid, name }) {
  const { songs, currentRound, correctAnswer, roundScores, players } = gs;
  const song = songs[currentRound];
  const label = pivotLabel(gs);
  const myPts = roundScores[pid] || 0;
  const isCorrect = myPts > 0;
  const totalScore = players[pid]?.score || 0;

  return (
    <Screen bg="deep" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", padding:"1.5rem", gap:"1.25rem" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Result banner */}
      <div style={{ background: isCorrect ? "#16a34a" : "#dc2626", borderRadius:20, padding:"2rem", textAlign:"center" }}>
        <div style={{ fontSize:"3rem" }}>{isCorrect ? "✅" : "❌"}</div>
        <p style={{ color:"#fff", fontSize:"1.4rem", fontWeight:700, margin:"0.5rem 0 0" }}>
          {isCorrect ? `Correct! +${myPts} points` : "Wrong answer"}
        </p>
      </div>

      {/* Song reveal */}
      <Card style={{ textAlign:"center", gap:"0.5rem" }}>
        <p style={{ color:"#64748b", fontSize:"0.82rem", margin:0 }}>The song was</p>
        <h3 style={{ color:"#e2e8f0", fontSize:"1.4rem", fontWeight:700, margin:0 }}>🎵 {song.title}</h3>
        <p style={{ color:"#94a3b8", margin:0 }}>{song.artist}</p>
        <span style={{ display:"inline-block", background:"#7c3aed", color:"#fff", borderRadius:999, padding:"0.2rem 0.9rem", fontWeight:700, marginTop:4 }}>
          {song.year}
        </span>
        <p style={{ color:"#64748b", fontSize:"0.85rem", margin:"0.5rem 0 0" }}>
          {correctAnswer === "before" ? "⏮" : "⏭"} Released <strong style={{color:"#a78bfa"}}>{correctAnswer}</strong> {label}
        </p>
        {song.fact && <p style={{ color:"#475569", fontSize:"0.82rem", fontStyle:"italic", margin:"0.5rem 0 0", lineHeight:1.6 }}>💡 {song.fact}</p>}
      </Card>

      {/* Total score */}
      <div style={{ textAlign:"center" }}>
        <p style={{ color:"#64748b", margin:"0 0 4px", fontSize:"0.82rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Your total score</p>
        <p style={{ color:"#a78bfa", fontSize:"3rem", fontWeight:900, margin:0 }}>{totalScore}</p>
      </div>

      <p style={{ color:"#374151", textAlign:"center", fontSize:"0.82rem", marginTop:"auto" }}>
        Waiting for the next round…
      </p>
    </Screen>
  );
}

// PLAYER: PODIUM ───────────────────────────────────────────────────────────────
function PlayerPodium({ gs, pid, onBack }) {
  const sorted = Object.values(gs.players).sort((a, b) => b.score - a.score);
  const myRank = sorted.findIndex(p => p.id === pid) + 1;
  const me = gs.players[pid];
  const rankEmoji = ["🥇","🥈","🥉"][myRank - 1] || `#${myRank}`;

  return (
    <Screen bg="deep" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", padding:"2rem", gap:"1.5rem" }}>
      <style>{GLOBAL_CSS}</style>
      <h2 style={{ color:"#e2e8f0", fontSize:"2rem", fontWeight:900, margin:0 }}>Game Over!</h2>

      <div style={{ background:"linear-gradient(135deg,#312e81,#4f46e5)", borderRadius:24, padding:"2rem 3rem", textAlign:"center", width:"100%", maxWidth:320 }}>
        <div style={{ fontSize:"3rem" }}>{rankEmoji}</div>
        <p style={{ color:"#c4b5fd", margin:"0.5rem 0 0", fontSize:"0.85rem" }}>You finished</p>
        <p style={{ color:"#fff", fontSize:"1.8rem", fontWeight:900, margin:0 }}>{me?.name}</p>
        <p style={{ color:"#a78bfa", fontSize:"1.5rem", fontWeight:700, margin:"0.25rem 0 0" }}>{me?.score} pts</p>
      </div>

      <div style={{ width:"100%", maxWidth:360, display:"flex", flexDirection:"column", gap:8 }}>
        {sorted.map((p, i) => (
          <div key={p.id} style={{ display:"flex", gap:"0.75rem", alignItems:"center", borderRadius:10, padding:"0.7rem 1rem",
            background: p.id === pid ? "#312e81" : "rgba(255,255,255,0.05)" }}>
            <span style={{ color:"#7c3aed", fontWeight:700, minWidth:24 }}>{i+1}</span>
            <Avatar name={p.name} size={28} />
            <span style={{ flex:1, color:"#e2e8f0" }}>{p.name}</span>
            <span style={{ color:"#a78bfa", fontWeight:700 }}>{p.score} pts</span>
          </div>
        ))}
      </div>

      <Btn variant="teal" size="lg" onClick={onBack}>Play Again</Btn>
    </Screen>
  );
}

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
function Screen({ children, center, bg, className, style = {} }) {
  return (
    <div className={className} style={{
      minHeight:"100vh", fontFamily:"'Segoe UI', system-ui, sans-serif",
      background: bg === "deep" ? "linear-gradient(135deg,#0f0a1e 0%,#1e1b4b 55%,#0f172a 100%)" : "#fff",
      ...(center ? { display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" } : {}),
      ...style,
    }}>
      {children}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:22, padding:"2.25rem 2rem",
      border:"1px solid rgba(255,255,255,0.09)", display:"flex", flexDirection:"column", gap:"1.25rem", ...style }}>
      {children}
    </div>
  );
}

function Btn({ children, variant, size, style = {}, disabled, onClick }) {
  const base = { border:"none", cursor: disabled ? "not-allowed" : "pointer", fontWeight:700,
    borderRadius:12, transition:"transform 0.1s, opacity 0.15s", opacity: disabled ? 0.5 : 1,
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"0.4rem" };
  const variants = {
    purple: { background:"linear-gradient(135deg,#7c3aed,#4f46e5)", color:"#fff" },
    teal:   { background:"linear-gradient(135deg,#0891b2,#0d9488)",  color:"#fff" },
  };
  const sizes = {
    lg: { padding:"0.9rem 2rem", fontSize:"1.05rem" },
    md: { padding:"0.65rem 1.4rem", fontSize:"0.9rem" },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...sizes[size||"md"], ...style }}
      disabled={disabled} onClick={onClick}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
      {children}
    </button>
  );
}

function Avatar({ name, size = 36, style = {} }) {
  const initials = name ? name[0].toUpperCase() : "?";
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:avatarColor(name||"?"),
      display:"flex", alignItems:"center", justifyContent:"center",
      fontWeight:700, fontSize: size * 0.42, color:"#fff", flexShrink:0, ...style }}>
      {initials}
    </div>
  );
}

function SettingBlock({ label, desc, children }) {
  return (
    <div style={{ marginBottom:"1.75rem" }}>
      <label style={{ color:"#a78bfa", fontWeight:700, fontSize:"0.95rem", display:"block", marginBottom:4 }}>{label}</label>
      {desc && <p style={{ color:"#64748b", fontSize:"0.8rem", margin:"0 0 0.75rem" }}>{desc}</p>}
      {children}
    </div>
  );
}

function ChipGroup({ value, onChange, options, suffix = "" }) {
  return (
    <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
      {options.map(o => (
        <button key={o}
          style={{ padding:"0.5rem 1.3rem", borderRadius:999, fontWeight:600, fontSize:"0.95rem", cursor:"pointer",
            border: value === o ? "2px solid #7c3aed" : "2px solid rgba(255,255,255,0.1)",
            background: value === o ? "rgba(124,58,237,0.15)" : "transparent",
            color: value === o ? "#a78bfa" : "#64748b", transition:"all 0.15s" }}
          onClick={() => onChange(o)}>
          {o}{suffix}
        </button>
      ))}
    </div>
  );
}

function MiniLeaderboard({ players, limit = 5 }) {
  const sorted = Object.values(players).sort((a, b) => b.score - a.score).slice(0, limit);
  if (sorted.length === 0) return null;
  return (
    <div>
      <p style={{ color:"#64748b", fontSize:"0.82rem", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 8px" }}>Standings</p>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {sorted.map((p, i) => (
          <div key={p.id} style={{ display:"flex", gap:"0.75rem", alignItems:"center", background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"0.5rem 0.75rem" }}>
            <span style={{ color:"#7c3aed", fontWeight:700, minWidth:20, fontSize:"0.85rem" }}>{i+1}</span>
            <Avatar name={p.name} size={24} />
            <span style={{ flex:1, color:"#e2e8f0", fontSize:"0.9rem" }}>{p.name}</span>
            <span style={{ color:"#a78bfa", fontWeight:700, fontSize:"0.9rem" }}>{p.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick}
      style={{ position:"fixed", top:16, left:16, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)",
        color:"#94a3b8", padding:"0.45rem 1rem", borderRadius:8, cursor:"pointer", zIndex:100, fontSize:"0.88rem" }}>
      ← Back
    </button>
  );
}

// ─── STYLE TOKENS ─────────────────────────────────────────────────────────────
const S = {
  logoWrap:   { fontSize:"clamp(2.5rem,8vw,5rem)", fontWeight:900, letterSpacing:"-0.02em", marginBottom:"0.5rem", textAlign:"center" },
  logoB:      { color:"#818cf8", textShadow:"0 0 40px rgba(129,140,248,0.4)" },
  logoOr:     { color:"#94a3b8", fontSize:"0.58em" },
  logoA:      { color:"#34d399", textShadow:"0 0 40px rgba(52,211,153,0.4)" },
  tagline:    { color:"#94a3b8", fontSize:"1.1rem", marginBottom:"2.5rem", textAlign:"center" },
  logoSmall:  { color:"#818cf8", fontWeight:900, fontSize:"1.3rem", letterSpacing:"-0.02em" },
  heading:    { color:"#e2e8f0", fontWeight:900, letterSpacing:"-0.02em" },
  bigNum:     { fontSize:"3.5rem", fontWeight:900, color:"#818cf8", letterSpacing:"-0.03em", lineHeight:1 },
  slider:     { width:"100%", accentColor:"#7c3aed", marginTop:"0.5rem", cursor:"pointer" },
  card:       { background:"rgba(255,255,255,0.05)", borderRadius:20, padding:"2rem", border:"1px solid rgba(255,255,255,0.09)" },
  input:      { width:"100%", padding:"0.85rem 1rem", borderRadius:12, border:"2px solid rgba(255,255,255,0.1)",
                background:"rgba(255,255,255,0.05)", color:"#e2e8f0", fontSize:"1rem", outline:"none",
                boxSizing:"border-box", transition:"border-color 0.15s" },
  playerChip: { background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12,
                padding:"0.5rem 0.9rem", display:"flex", alignItems:"center", gap:8 },
  roundBadge: { background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.4)", color:"#a78bfa",
                padding:"0.4rem 1rem", borderRadius:999, fontWeight:700, whiteSpace:"nowrap", fontSize:"0.9rem" },
  answerBtn:  { width:"100%", padding:"1.25rem 1.5rem", borderRadius:18, border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", gap:"1rem", textAlign:"left", transition:"transform 0.1s, opacity 0.15s" },
  ghostBtn:   { background:"transparent", border:"1px solid rgba(255,255,255,0.12)", color:"#64748b",
                padding:"0.65rem 2rem", borderRadius:10, cursor:"pointer", alignSelf:"center",
                fontWeight:600, fontSize:"0.88rem", display:"block", margin:"0 auto" },
  select:     { width:"100%", padding:"0.75rem 0.9rem", borderRadius:10, border:"2px solid rgba(255,255,255,0.1)",
                background:"rgba(255,255,255,0.07)", color:"#e2e8f0", fontSize:"0.95rem", outline:"none",
                cursor:"pointer", appearance:"auto" },
  settingsBtn:{ position:"fixed", top:16, left:16, background:"rgba(255,255,255,0.08)",
                border:"1px solid rgba(255,255,255,0.12)", color:"#94a3b8", padding:"0.45rem 0.65rem",
                borderRadius:8, cursor:"pointer", zIndex:100, fontSize:"1.1rem", lineHeight:1 },
};

// ─── GLOBAL CSS KEYFRAMES ─────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes bob    { from { transform: translateY(0);    } to { transform: translateY(-10px); } }
  @keyframes bounce { from { transform: translateY(0);    } to { transform: translateY(-8px);  } }
  input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
  button:active { transform: scale(0.97) !important; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f0a1e; }

  .lobby-layout { display: flex; align-items: stretch; }

  @media (max-width: 700px) {
    .lobby-layout { flex-direction: column !important; padding: 1rem !important; gap: 1.5rem !important; }
    .lobby-layout > div:first-child { flex: none !important; width: 100% !important; }
  }
  @media (max-width: 480px) {
    body { font-size: 14px; }
    input[type="range"] { height: 32px; }
  }
`;
