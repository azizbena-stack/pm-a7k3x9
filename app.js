/* =========================================================================
   Pulse Music — MVP interactive prototype
   Single-file demo app. All data below is synthetic/mocked for demonstration.
   ========================================================================= */

/* ---------------------------- RNG / UTILS ------------------------------ */
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function strSeed(s){
  let h = 0;
  for(let i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i)) | 0; }
  return Math.abs(h);
}
function pick(arr, rand){ return arr[Math.floor(rand()*arr.length)]; }
function pickN(arr, n, rand){
  const copy = arr.slice(); const out=[];
  while(out.length<n && copy.length){ out.push(copy.splice(Math.floor(rand()*copy.length),1)[0]); }
  return out;
}
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function fmtPct(v){ const s = v>=0? '+':''; return s+v.toFixed(0)+'%'; }
function fmtNum(n){ return n.toLocaleString((typeof LOCALE_MAP!=='undefined' && LOCALE_MAP[state.lang]) || 'fr-FR'); }
function esc(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function daysAgo(dateStr){ return Math.round((TODAY - new Date(dateStr))/86400000); }
function fmtDate(d){ return d.toLocaleDateString((typeof LOCALE_MAP!=='undefined' && LOCALE_MAP[state.lang]) || 'fr-FR', {day:'2-digit', month:'short', year:'numeric'}); }
const TODAY = new Date('2026-08-15');

/* ---------------------------- REFERENCE DATA ---------------------------- */
const GENRES = [
  {id:'afro-house',    name:'Afro House',        color:'#3987e5'},
  {id:'afro-tech',      name:'Afro Tech',          color:'#d95926'},
  {id:'house',          name:'House',              color:'#199e70'},
  {id:'deep-house',     name:'Deep House',         color:'#c98500'},
  {id:'organic-house',  name:'Organic House',      color:'#d55181'},
  {id:'melodic-house',  name:'Melodic House',      color:'#008300'},
  {id:'melodic-techno', name:'Melodic Techno',     color:'#9085e9'},
  {id:'tech-house',     name:'Tech House',         color:'#e66767'},
  {id:'progressive-house', name:'Progressive House', color:'#3987e5'},
  {id:'techno',         name:'Techno',             color:'#d95926'},
  {id:'minimal-deeptech', name:'Minimal / Deep Tech', color:'#199e70'},
  {id:'indie-dance',    name:'Indie Dance',        color:'#c98500'},
  {id:'tribal-house',   name:'Tribal House',       color:'#d55181'},
];
const genreById = id => GENRES.find(g=>g.id===id);

const COUNTRIES = [
  {code:'ES', name:'Espagne', flag:'🇪🇸'},
  {code:'AE', name:'Émirats arabes unis', flag:'🇦🇪'},
  {code:'GR', name:'Grèce', flag:'🇬🇷'},
  {code:'FR', name:'France', flag:'🇫🇷'},
  {code:'US', name:'États-Unis', flag:'🇺🇸'},
  {code:'GB', name:'Royaume-Uni', flag:'🇬🇧'},
  {code:'BR', name:'Brésil', flag:'🇧🇷'},
  {code:'ZA', name:'Afrique du Sud', flag:'🇿🇦'},
  {code:'IT', name:'Italie', flag:'🇮🇹'},
  {code:'DE', name:'Allemagne', flag:'🇩🇪'},
  {code:'PT', name:'Portugal', flag:'🇵🇹'},
  {code:'MX', name:'Mexique', flag:'🇲🇽'},
  {code:'MA', name:'Maroc', flag:'🇲🇦'},
  {code:'NL', name:'Pays-Bas', flag:'🇳🇱'},
  {code:'BE', name:'Belgique', flag:'🇧🇪'},
  {code:'HR', name:'Croatie', flag:'🇭🇷'},
  {code:'CH', name:'Suisse', flag:'🇨🇭'},
  {code:'AT', name:'Autriche', flag:'🇦🇹'},
  {code:'SE', name:'Suède', flag:'🇸🇪'},
  {code:'TR', name:'Turquie', flag:'🇹🇷'},
  {code:'TN', name:'Tunisie', flag:'🇹🇳'},
  {code:'LB', name:'Liban', flag:'🇱🇧'},
  {code:'EG', name:'Égypte', flag:'🇪🇬'},
  {code:'AR', name:'Argentine', flag:'🇦🇷'},
  {code:'CO', name:'Colombie', flag:'🇨🇴'},
  {code:'TH', name:'Thaïlande', flag:'🇹🇭'},
  {code:'ID', name:'Indonésie', flag:'🇮🇩'},
  {code:'IN', name:'Inde', flag:'🇮🇳'},
  {code:'AU', name:'Australie', flag:'🇦🇺'},
  {code:'CA', name:'Canada', flag:'🇨🇦'},
  {code:'JP', name:'Japon', flag:'🇯🇵'},
  {code:'IE', name:'Irlande', flag:'🇮🇪'},
];
const countryByCode = c => COUNTRIES.find(x=>x.code===c);

const CITIES = [
  {id:'ibiza', name:'Ibiza', country:'ES'},
  {id:'barcelona', name:'Barcelone', country:'ES'},
  {id:'dubai', name:'Dubaï', country:'AE'},
  {id:'mykonos', name:'Mykonos', country:'GR'},
  {id:'athens', name:'Athènes', country:'GR'},
  {id:'paris', name:'Paris', country:'FR'},
  {id:'miami', name:'Miami', country:'US'},
  {id:'newyork', name:'New York', country:'US'},
  {id:'losangeles', name:'Los Angeles', country:'US'},
  {id:'london', name:'Londres', country:'GB'},
  {id:'saopaulo', name:'São Paulo', country:'BR'},
  {id:'capetown', name:'Cape Town', country:'ZA'},
  {id:'johannesburg', name:'Johannesburg', country:'ZA'},
  {id:'milan', name:'Milan', country:'IT'},
  {id:'berlin', name:'Berlin', country:'DE'},
  {id:'lisbon', name:'Lisbonne', country:'PT'},
  {id:'tulum', name:'Tulum', country:'MX'},
  {id:'marrakech', name:'Marrakech', country:'MA'},
  {id:'amsterdam', name:'Amsterdam', country:'NL'},
  // Villes ajoutées pour couvrir les nouveaux pays — pas encore synchronisées
  // en direct via Soundcharts (voir APP_CITY_TO_DB_NAME / REAL_CITIES plus
  // bas) : elles alimentent le classement simulé Monde/Pays mais ne peuvent
  // pas apparaître dans le sélecteur "Ville" tant qu'un vrai flux de données
  // n'existe pas pour elles.
  {id:'bruxelles', name:'Bruxelles', country:'BE'},
  {id:'zrce', name:'Zrce', country:'HR'},
  {id:'zurich', name:'Zurich', country:'CH'},
  {id:'vienne', name:'Vienne', country:'AT'},
  {id:'stockholm', name:'Stockholm', country:'SE'},
  {id:'istanbul', name:'Istanbul', country:'TR'},
  {id:'hammamet', name:'Hammamet', country:'TN'},
  {id:'beyrouth', name:'Beyrouth', country:'LB'},
  {id:'elgouna', name:'El Gouna', country:'EG'},
  {id:'buenosaires', name:'Buenos Aires', country:'AR'},
  {id:'medellin', name:'Medellín', country:'CO'},
  {id:'phuket', name:'Phuket', country:'TH'},
  {id:'bali', name:'Bali', country:'ID'},
  {id:'goa', name:'Goa', country:'IN'},
  {id:'sydney', name:'Sydney', country:'AU'},
  {id:'montreal', name:'Montréal', country:'CA'},
  {id:'tokyo', name:'Tokyo', country:'JP'},
  {id:'dublin', name:'Dublin', country:'IE'},
];
const cityById = id => CITIES.find(c=>c.id===id);

/* ---------------------------- LIVE CHARTS (Supabase) -----------------------
   Real, per-city Apple Music / Spotify / Shazam rankings, synced daily from
   Soundcharts into our own Supabase project by the sync-charts Edge
   Function. Used for the "city" scope on Home and for the city detail view
   in Explore — everywhere else (world/country scope, DJ Score, Trending
   Now) still runs on the simulated catalogue below until that's rebuilt on
   real data too. */
const SUPABASE_URL = 'https://ysrenidrdyiafnfhpfpg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QMAo4k31YfvE2mfGA33Yog_YdG0RLwv';
const SUPABASE_HEADERS = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };

// Maps this app's internal city id to the exact city_name stored in Supabase
// (set when the daily sync was configured — keep in sync with that list).
const APP_CITY_TO_DB_NAME = {
  ibiza:'Ibiza', barcelona:'Barcelona', dubai:'Dubai', mykonos:'Mykonos', athens:'Athens',
  paris:'Paris', miami:'Miami', newyork:'New York', losangeles:'Los Angeles', london:'London',
  saopaulo:'Sao Paulo', capetown:'Cape Town', johannesburg:'Johannesburg', milan:'Milan',
  berlin:'Berlin', lisbon:'Lisbon', tulum:'Tulum', marrakech:'Marrakech', amsterdam:'Amsterdam',
};
// Sous-ensemble de CITIES qui a un vrai flux Soundcharts (clé présente dans
// APP_CITY_TO_DB_NAME) — c'est cette liste, et seulement elle, qui doit
// alimenter le sélecteur "Ville" et l'onglet "Ville" d'Explore : les
// nouvelles villes ajoutées pour les pays supplémentaires n'ont pas de vrai
// classement et ne doivent jamais y apparaître.
const REAL_CITIES = CITIES.filter(c => !!APP_CITY_TO_DB_NAME[c.id]);
const PLATFORM_LABEL = { apple_music:'Apple Music', spotify:'Spotify', shazam:'Shazam' };
const PLATFORMS_UI = ['apple_music', 'spotify', 'shazam'];

let dbCityIdCache = null; // { 'Paris': 'uuid', ... } — fetched once, reused all session
async function getDbCityId(appCityId){
  const dbName = APP_CITY_TO_DB_NAME[appCityId];
  if(!dbName) return null;
  if(!dbCityIdCache){
    try{
      const res = await fetch(`${SUPABASE_URL}/rest/v1/cities?select=id,city_name`, { headers: SUPABASE_HEADERS });
      const rows = await res.json();
      dbCityIdCache = {};
      (rows||[]).forEach(r=>{ dbCityIdCache[r.city_name] = r.id; });
    } catch(e){ dbCityIdCache = {}; }
  }
  return dbCityIdCache[dbName] || null;
}

const realTracksCache = {}; // synthetic-id -> track-like object, so real chart rows can use the same play engine
const realChartCache = {}; // `${appCityId}:${platform}:${period}` -> entries array (session-only)
// period: 'today' (comparaison au jour précédent, fournie directement par Soundcharts
// via previous_rank) | '7d' | '30d' (on recalcule alors le classement d'il y a 7/30
// jours à partir d'un second instantané et on compare les morceaux par titre+artiste,
// puisque leur identifiant peut changer d'un instantané à l'autre).
async function fetchRealCityChart(appCityId, platform, period){
  period = period || 'today';
  const key = appCityId+':'+platform+':'+period;
  if(realChartCache[key]) return realChartCache[key];
  const dbCityId = await getDbCityId(appCityId);
  if(!dbCityId){ realChartCache[key] = []; return []; }
  try{
    const latestRes = await fetch(
      `${SUPABASE_URL}/rest/v1/chart_entries?city_id=eq.${dbCityId}&platform=eq.${platform}&select=captured_at&order=captured_at.desc&limit=1`,
      { headers: SUPABASE_HEADERS }
    );
    const latestRows = await latestRes.json();
    if(!latestRows || !latestRows.length){ realChartCache[key] = []; return []; }
    const latestDate = latestRows[0].captured_at;
    const entriesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/chart_entries?city_id=eq.${dbCityId}&platform=eq.${platform}&captured_at=eq.${latestDate}&select=rank,previous_rank,tracks(title,artist_name,cover_url,youtube_id)&order=rank.asc&limit=100`,
      { headers: SUPABASE_HEADERS }
    );
    let entries = await entriesRes.json();
    entries = entries || [];

    if(period!=='today' && entries.length){
      const daysAgo = period==='30d' ? 30 : 7;
      const targetDate = new Date(new Date(latestDate).getTime() - daysAgo*86400000).toISOString();
      const histDateRes = await fetch(
        `${SUPABASE_URL}/rest/v1/chart_entries?city_id=eq.${dbCityId}&platform=eq.${platform}&captured_at=lte.${targetDate}&select=captured_at&order=captured_at.desc&limit=1`,
        { headers: SUPABASE_HEADERS }
      );
      const histDateRows = await histDateRes.json();
      let histMap = null;
      if(histDateRows && histDateRows.length){
        const histDate = histDateRows[0].captured_at;
        const histRes = await fetch(
          `${SUPABASE_URL}/rest/v1/chart_entries?city_id=eq.${dbCityId}&platform=eq.${platform}&captured_at=eq.${histDate}&select=rank,tracks(title,artist_name)`,
          { headers: SUPABASE_HEADERS }
        );
        const histEntries = await histRes.json();
        histMap = {};
        (histEntries||[]).forEach(h=>{
          const t = h.tracks || {};
          const k = (t.title||'').toLowerCase().trim()+'|'+(t.artist_name||'').toLowerCase().trim();
          histMap[k] = h.rank;
        });
      }
      // Remplace previous_rank par le rang d'il y a 7/30 jours (ou null si on n'a pas
      // encore assez d'historique synchronisé pour remonter aussi loin, ou si le
      // morceau n'était pas dans le classement à cette date).
      entries = entries.map(e=>{
        const t = e.tracks || {};
        const k = (t.title||'').toLowerCase().trim()+'|'+(t.artist_name||'').toLowerCase().trim();
        const histRank = histMap ? (histMap[k]!=null ? histMap[k] : null) : null;
        return Object.assign({}, e, { previous_rank: histRank });
      });
    }

    realChartCache[key] = entries;
    return entries;
  } catch(e){
    realChartCache[key] = [];
    return [];
  }
}

function realTrackMoveHTML(rank, prev){
  if(prev==null || prev===rank) return `<span class="t-trend flat">–</span>`;
  if(prev > rank) return `<span class="t-trend up">▲ ${prev-rank}</span>`;
  return `<span class="t-trend down">▼ ${rank-prev}</span>`;
}
// IMPORTANT — leçon retenue : Soundcharts ne fournit AUCUN genre réel par morceau
// pour les classements "Ville" (contrairement au catalogue simulé Monde/Pays). Une
// version précédente assignait un genre inventé (déterministe mais faux), l'affichait
// et s'en servait pour filtrer — ça a produit des titres reggaeton/latin trap étiquetés
// "Techno", confirmé par capture vidéo. C'était la mauvaise approche : on ne doit
// jamais présenter une donnée fabriquée comme si elle venait de Soundcharts.
// cityTrackGenre() reste UNIQUEMENT pour varier la couleur/texture de la pochette
// (coverStyle) — jamais affiché en texte, jamais utilisé pour filtrer la liste Ville.
const CITY_PSEUDO_GENRES = ['afro-house','afro-tech','house','melodic-house','melodic-techno','techno'];
function cityTrackGenre(title, artist){
  const seedKey = (title||'')+'|'+(artist||'');
  return CITY_PSEUDO_GENRES[strSeed(seedKey) % CITY_PSEUDO_GENRES.length];
}
// Le job de sync Soundcharts peut laisser une entrée dont le titre n'a pas encore
// été résolu (placeholder côté base, ex. "Track Loading..."). Ne jamais afficher ça
// comme si c'était un vrai titre de morceau — on filtre ces entrées de la liste.
function isPlaceholderTitle(title){
  if(!title) return true;
  const s = String(title).trim();
  if(!s) return true;
  if(/loading/i.test(s)) return true;
  if(/^(unknown|inconnu|n\/a|untitled|sans titre)$/i.test(s)) return true;
  return false;
}
const FREE_LIMIT_TRACKS = 20; // doit rester identique à freeLimit dans renderHome
function renderRealTrackRow(entry, idx, locked){
  const t = entry.tracks || {};
  const seedKey = (t.title||'')+'|'+(t.artist_name||'');
  const rid = 'real-' + strSeed(seedKey+'|'+idx);
  realTracksCache[rid] = {
    id: rid,
    isRealCity: true, // marque une entrée de classement ville réel : jamais de genre inventé affiché
    title: t.title || 'Titre inconnu',
    artist: t.artist_name || '',
    coverUrl: t.cover_url || null,
    coverSeed: strSeed(seedKey) % 9999,
    genre: cityTrackGenre(t.title, t.artist_name), // cosmétique uniquement (couleur pochette) — voir note ci-dessus, jamais affiché/filtré
    // profil démo assigné en tournant sur la position dans la liste (pas par hasard) :
    // deux morceaux voisins dans le classement n'ont jamais le même profil, et ces
    // profils sont volontairement très contrastés (voir DEMO_PROFILES) — tempo,
    // timbre du kick inclus, pas juste l'habillage en arrière-plan.
    demoProfile: DEMO_PROFILES[idx % DEMO_PROFILES.length],
    demoBpm: DEMO_PROFILES[idx % DEMO_PROFILES.length].bpm,
    // Found automatically by the sync job (YouTube search) — kept only to
    // offer a real video link from the track detail view. The quick tap-to-
    // play button here always goes through the Apple Music preview /
    // generated-loop pipeline instead (see togglePlay) — exactly like the
    // Monde/Pays rows — because a YouTube iframe's autoplay cannot reliably
    // follow this tap's gesture on mobile Safari.
    youtubeId: t.youtube_id || null,
  };
  const t2 = realTracksCache[rid]; // normalized object (coverHTML/genreById expect this shape, same as Monde/Pays rows)
  return `
  <div class="track-row ${locked?'lock-row':''}" style="padding-left:0;">
    <div class="rank ${idx<3?'top3':''}">${idx<3? ['🥇','🥈','🥉'][idx] : (idx+1)}</div>
    ${coverHTML(t2,false)}
    <div class="t-info">
      <div class="t-title">${esc(t2.title)}</div>
      <div class="t-sub">${esc(t2.artist)}</div>
    </div>
    <div class="t-right">${realTrackMoveHTML(entry.rank, entry.previous_rank)}</div>
  </div>`;
}
function realChartPlatformTabsHTML(action, selected){
  return `<div class="segmented" style="margin-top:9px;">
    ${PLATFORMS_UI.map(p=>`<button class="${p===selected?'active':''}" data-action="${action}" data-p="${p}">${PLATFORM_LABEL[p]}</button>`).join('')}
  </div>`;
}
function realChartListHTML(entries, opts){
  opts = opts || {};
  if(!entries.length) return `<div class="empty-msg">Pas encore de classement synchronisé pour cette ville/plateforme.</div>`;
  // Pas de filtre par genre ici : Soundcharts ne donne pas de genre réel par morceau
  // pour les classements ville (voir note au-dessus de cityTrackGenre). On filtre en
  // revanche les entrées dont le titre n'a pas encore été résolu par le job de sync
  // (placeholder type "Track Loading...") — ne jamais montrer ça comme un vrai titre.
  const filtered = entries.filter(e=>{
    const t = e.tracks || {};
    return !isPlaceholderTitle(t.title);
  });
  if(!filtered.length) return `<div class="empty-msg">Classement en cours de synchronisation, revenez dans quelques minutes.</div>`;
  return filtered.map((e,i)=>renderRealTrackRow(e,i, opts.freeLimit!=null && i>=opts.freeLimit)).join('');
}

/* ---------------------------- REAL CHART DATA -----------------------------
   Track identity (title / artist / label / genre / chart rank) below is real
   public chart data snapshotted from Beatport's live genre Top 100 charts
   (beatport.com/genre/.../top-100) on the day this prototype was built.
   Beatport is the DJ/club-focused chart authority — it's the direct
   equivalent of "Spotify Top 100" for this product's audience, which is why
   it's used here rather than Spotify's mainstream (largely non-electronic)
   Top 100. All DJ-side numbers (plays, countries, cities, DJ Score, growth,
   history) remain SIMULATED for this demo — that data isn't publicly
   available and is exactly what the real product would need to source via
   licensed DJ-software telemetry, per the architecture in the Admin panel. */
const BP_IMG = (id) => `https://geo-media.beatport.com/image_size/95x95/${id}.jpg`;
const REAL_TRACKS = [
  // Afro House — beatport.com/genre/afro-house/89/top-100
  {title:'Jamaican (Bam Bam) (Extended Mix)', artist:'HUGEL, SOLTO (FR)', genre:'afro-house', label:'MoBlack Records', chartRank:1, cover:BP_IMG('cefa8af7-25b7-4172-af68-f6fc21bcc906'), spotifyId:'1ExjoMeJQxAYtHFke6eW31'},
  {title:'Mundian To Bach Ke (Dario Nunez & Juany Bravo Extended Remix)', artist:'Panjabi MC', genre:'afro-house', label:'Altra Moda', chartRank:2, cover:BP_IMG('85e1c4d0-d1c2-4cf7-bac9-9a12b6769a5f'), spotifyId:'1861aw25303TGbfvMYqrD6'},
  {title:'Pump up the Jam', artist:'Lizwi, Aaron Sevilla, Brøder, SENATVS', genre:'afro-house', label:'AFRODISE', chartRank:4, cover:BP_IMG('81e1d49f-5296-4169-8e42-0ad9eed40c8f'), spotifyId:'5fPPJ5AlDwK85SMC0W6eZt'},
  {title:'Playback (Extended Mix)', artist:'Shadu', genre:'afro-house', label:'Vibecore Records', chartRank:5, cover:BP_IMG('9c57163a-7924-4ac9-a93f-a9221642cfcd')},
  {title:'Celebration (Antdot, Maz (BR) Edit)', artist:'Frankie Romano, Supermini', genre:'afro-house', label:'Dawn Patrol Records', chartRank:6, cover:BP_IMG('8d456ce8-1a78-4a42-90bb-2c984ffd0558'), spotifyId:'5NPnaydalrXfHAtum1Gbpt'},
  {title:'Amor De Mi Vida', artist:'Aaron Sevilla, P.Rivas, Flavor Plus, Dos Rios', genre:'afro-house', label:'AFRODISE', chartRank:7, cover:BP_IMG('3f76ab5f-2481-40f6-9439-5cfef92928e6'), spotifyId:'1D3BTqKyE0XLPKozItBFgS'},
  {title:'Girls Dance (Extended Mix)', artist:'Roland Clark, Moree MK, MANU BS', genre:'afro-house', label:'Make The Girls Dance Records', chartRank:8, cover:BP_IMG('a04af539-f551-422c-a3fa-67c52fb45bf5'), spotifyId:'3Ff0w6b3YoztL63tJxaH46'},
  {title:'PYHU (Put Your Hands Up)', artist:'Kurd Maverick, HUGEL', genre:'afro-house', label:'Cr2 Records', chartRank:9, cover:BP_IMG('be677cf8-b51d-47a6-8354-1db291a0d6ae'), spotifyId:'0zKsNJbYwvNTpePcwra0Qq'},
  {title:'Sueño Contigo', artist:'Nolek, Aaron Sevilla', genre:'afro-house', label:'Sunset Gathering', chartRank:11, cover:BP_IMG('13e5543d-1dd5-4abe-87c9-b8e534f68668')},
  {title:'Say What (feat. Chuala)', artist:'&ME, Rampa, Adam Port, Keinemusik, chuala', genre:'afro-house', label:'Keinemusik', chartRank:12, cover:BP_IMG('95ae01c4-128f-44f6-8c4d-df4f0032faa3'), spotifyId:'73YTJNeXISV9QHMG82ZrwP'},
  // Afro Tech — curated from the Afro House chart's more percussive/club-tool entries
  {title:'YELE (Extended Mix)', artist:'Themba, Vanco', genre:'afro-tech', label:'AfroRepublik', chartRank:18, cover:BP_IMG('0cd5388b-20dc-4826-8ee9-834324410f72')},
  {title:'Fire Fire', artist:'Shimza, Kasango, AR/CO', genre:'afro-tech', label:'Helix Records', chartRank:20, cover:BP_IMG('975235ae-fb25-4626-a58f-cbfadba6d10b'), spotifyId:'35dt2bP4CcBzepyufQbvYZ'},
  {title:'Sinnerman', artist:'DJ Care, MikroBeats, Aaron Sevilla', genre:'afro-tech', label:'AFRODISE', chartRank:19, cover:BP_IMG('88ddba3c-6756-4edf-b072-2d7efafa14ef'), spotifyId:'4yn925QAS3ZCtWwtkW1H59'},
  // Tribal House — curated from the Afro House chart's world/percussion-fusion entries
  {title:'Yamore (Extended)', artist:'Salif Keita, Cesaria Evora, MoBlack, Franc Fala, Benja (NL)', genre:'tribal-house', label:'Decca Records France', chartRank:10, cover:BP_IMG('b1089579-c8a6-4ee4-8bb4-f3d333197d1b'), spotifyId:'04l6CQdt3SqYNwREH0K741'},
  {title:"La Verdolaga (feat. Totó La Momposina) (Extended Mix)", artist:'Toto La Momposina, HUGEL', genre:'tribal-house', label:'Defected', chartRank:15, cover:BP_IMG('cb616350-7761-4506-937d-0a8065b656d3'), spotifyId:'1SHDkI7ZAD0qGfEO38D87o'},

  // House — beatport.com/genre/house/5/top-100
  {title:'4Get The Girl (Mellizos Extended Remix)', artist:'Route 94, Mellizos', genre:'house', label:'Defected', chartRank:1, cover:BP_IMG('a5b23ca0-1597-4b8c-9c26-f548a4bb374a')},
  {title:'Good Girl (Extended Mix)', artist:'Tristan Henry, Cloonee, Prospa', genre:'house', label:'Hellbent Records', chartRank:2, cover:BP_IMG('3f53a915-e682-4865-acc9-06339a3ddde8'), spotifyId:'263Ecah3YA4hVZHxR2Ex9p'},
  {title:'Free Your Mind (Extended Mix)', artist:'Cloonee, Prospa', genre:'house', label:'CircoLoco Records', chartRank:3, cover:BP_IMG('68d19d58-caeb-431c-8375-be7415f16966'), spotifyId:'6TWbY1dq8eYtFiMiGdBlOa'},
  {title:'Hey Everybody (Extended Mix)', artist:'Kolter', genre:'house', label:'Positiva', chartRank:4, cover:BP_IMG('96ff70f5-947a-4223-9f17-59a93afd60f3'), spotifyId:'25PFZE1QqJieWRIJOCk755'},
  {title:'Talk To You (Extended Mix)', artist:'ANOTR, 54 Ultra', genre:'house', label:'NO ART', chartRank:5, cover:BP_IMG('e3044e43-9425-4575-9587-a224c9e5d2c1'), spotifyId:'5zEcbencrcP0p5Z8508vWz'},
  {title:'Little More (Body Action)', artist:'Sean Doron', genre:'house', label:"You&Me Records", chartRank:6, cover:BP_IMG('da6916ac-d684-4977-abec-4f88cc4c8025')},
  {title:'Want To Know (Extended Mix)', artist:'Rooléh', genre:'house', label:'No Art', chartRank:7, cover:BP_IMG('9958200d-7207-46b8-ad04-324741a80da2')},
  {title:'Shinjuku (Extended Mix)', artist:'Franky Rizardo', genre:'house', label:'LTF Records', chartRank:8, cover:BP_IMG('9686c89c-082e-422d-8fa7-136a2b640ce4'), spotifyId:'0niU8VMrQzSNhrmsiLlmeS'},
  {title:'All Night Long (Extended Mix)', artist:'Ferra Black, Chico Rose (NL)', genre:'house', label:'LTF Records', chartRank:9, cover:BP_IMG('777682f1-12e6-4767-9561-d8f63fc70098')},

  // Deep House — beatport.com/genre/deep-house/12/top-100
  {title:'What We Got', artist:'Midas Field, Marijn Jansen', genre:'deep-house', label:'tszr', chartRank:1, cover:BP_IMG('1c149979-c34c-4f4e-ba54-644389d976a5')},
  {title:'Trapped', artist:'Kolter', genre:'deep-house', label:'Koltrax', chartRank:2, cover:BP_IMG('8f90ebd0-dc36-43e4-a257-2dd4969c7a31'), spotifyId:'7LhaYxesZoZQ8b9WJGuLDx'},
  {title:'After You', artist:'Shokë', genre:'deep-house', label:'Cecille', chartRank:3, cover:BP_IMG('2ebbe117-a830-4085-89ba-614b50000ba3')},
  {title:"Can't Slow Down", artist:'Omar+', genre:'deep-house', label:'Atlantic Records UK', chartRank:4, cover:BP_IMG('b1108708-35d7-4d39-b436-c1a9f5e2a86b'), spotifyId:'2PKGJK3Kldd4DHJNzSFWJD'},
  {title:'Apathy', artist:'Brunello, Hilel Lev', genre:'deep-house', label:'Mellow Circus Records', chartRank:5, cover:BP_IMG('71ae6e08-8b3d-4b81-838a-35ad129ca0c3'), spotifyId:'6XRk6rd9IhdtVfQd45JFdi'},
  {title:'Breather', artist:'S.A.M., Chris Stussy', genre:'deep-house', label:'Up The Stuss', chartRank:6, cover:BP_IMG('b6458c86-78ae-4c9d-955a-6f9be68f576b'), spotifyId:'2d5i2HUJpBVgM9aRkoQpVj'},
  {title:'Chiamami', artist:'Shokë', genre:'deep-house', label:'Cecille', chartRank:7, cover:BP_IMG('2ebbe117-a830-4085-89ba-614b50000ba3')},
  {title:'Bahia', artist:'Nick Curly', genre:'deep-house', label:'8Bit', chartRank:8, cover:BP_IMG('802a573f-b2cf-45ef-9346-e7c1ed66c68a'), spotifyId:'39SY52L2wO1puZJtPzAXF8'},
  {title:'Questions', artist:'Alan Fitzpatrick, Piem, SLM', genre:'deep-house', label:'8Bit', chartRank:9, cover:BP_IMG('f61bad6d-1876-49a0-8ffd-caac09ae571b')},

  // Organic House — beatport.com/genre/organic-house/93/top-100
  {title:'Ango (Club Mix)', artist:'Khen', genre:'organic-house', label:'Lost Miracle', chartRank:1, cover:BP_IMG('6348ba6d-3abc-49a4-9f3b-7c4e4367ea9a')},
  {title:'Homecoming (Tim Green Extended Mix)', artist:'Above & Beyond', genre:'organic-house', label:'Anjunabeats', chartRank:2, cover:BP_IMG('0b934767-3e9a-4032-8101-bdc43ac8b846')},
  {title:'Edge of Desire (Extended Mix)', artist:'KOYENGA', genre:'organic-house', label:'Sounds Of Sirin', chartRank:3, cover:BP_IMG('527c0bf5-e11b-491d-8f91-5fc2b0716a9f')},
  {title:'Summer 98 (Extended Mix)', artist:'Artic White', genre:'organic-house', label:'Univack', chartRank:4, cover:BP_IMG('a0346619-8fd7-41cf-a4c1-467f267e9087')},
  {title:"Don't This", artist:'Fairtone', genre:'organic-house', label:'Emilarge Records', chartRank:5, cover:BP_IMG('8f5a4865-2d86-43c2-b0d3-556d6bc76087'), spotifyId:'26bMfu9JPgKIkVYJbaEZM7'},
  {title:'Self R3B00T', artist:'DAVI', genre:'organic-house', label:'8Bit', chartRank:6, cover:BP_IMG('722f3fb3-53e1-4ef4-8734-dd29592f34bc'), spotifyId:'5Jnn9v6YgtyIxN1ZHXewT7'},
  {title:'Fading Out (Extended Mix)', artist:'Lee Burridge', genre:'organic-house', label:'All Day I Dream', chartRank:7, cover:BP_IMG('e37d8cf0-c0fb-4c6f-93c3-f3fcef2c8e1f')},
  {title:'Monday Memories (Extended Mix)', artist:'KOYENGA', genre:'organic-house', label:'Sounds Of Sirin', chartRank:8, cover:BP_IMG('527c0bf5-e11b-491d-8f91-5fc2b0716a9f')},
  {title:'Too Good (Extended Mix)', artist:'Trilucid', genre:'organic-house', label:'Anjunadeep Explorations', chartRank:9, cover:BP_IMG('3a3e9445-befb-4d11-b95e-01474dea2f65'), spotifyId:'7L3TshEkUwwrQUGsiKiNRL'},

  // Melodic House — beatport.com/genre/melodic-house-techno/90/top-100
  {title:'Whisper To Me', artist:'Jimi Jules, Modern Tales', genre:'melodic-house', label:'Innervisions', chartRank:1, cover:BP_IMG('af1826d9-6d5d-46e0-95ce-f1e51f171569'), spotifyId:'4fJj5d2sms5UUsFyvrNjwr'},
  {title:'The 11th Hour', artist:'Celia Babini, Brunello', genre:'melodic-house', label:'Mellow Circus Records', chartRank:4, cover:BP_IMG('aa52eef0-5711-49ef-933b-782bceb056a5'), spotifyId:'5rsbEsAcHDNMS6HmWKvZ4m'},
  {title:'Smalltown Boy', artist:'Kotiēr', genre:'melodic-house', label:'X Recordings', chartRank:5, cover:BP_IMG('e05d976b-c586-4c14-b062-2432ae3495b1'), spotifyId:'5za6XRkJQSrVipzabuf6cV'},
  {title:'Raider on the Storm', artist:'Solomun, Inez', genre:'melodic-house', label:'Diynamic', chartRank:8, cover:BP_IMG('5acc95b8-c576-4afb-8ff4-7d79dc0c5aab')},
  {title:'Ghost Dance', artist:'Brunello', genre:'melodic-house', label:'Mellow Circus Records', chartRank:9, cover:BP_IMG('58ee4727-7f9a-47b1-94f6-4673c0fec5ee'), spotifyId:'3x6CEyquRREaQ9ZBbBhrGe'},
  {title:'Dance Baby', artist:'Liva K, HotLap', genre:'melodic-house', label:'Abracadabra Music', chartRank:10, cover:BP_IMG('34de26f9-952c-407c-9b73-718bb57902a4'), spotifyId:'605GkjW7WFEB6una1Uciar'},
  {title:'I See U', artist:'HotLap', genre:'melodic-house', label:'Siamese', chartRank:12, cover:BP_IMG('b5536b7c-5d01-46a3-a711-a7bb800d8f4e'), spotifyId:'2MPt7xLRfjNeN3qqNuGnfS'},
  {title:"Burnin'", artist:'Mosoo, Samm (BE)', genre:'melodic-house', label:'VOD', chartRank:15, cover:BP_IMG('bd3349dd-dfac-43dc-90cb-9dfb8b1064d6')},
  {title:'Toxic', artist:'Vintage Culture, DEPARTAMENTO', genre:'melodic-house', label:'AFFAIRS', chartRank:16, cover:BP_IMG('b2609925-efbb-49b4-8c07-74277f4ecaa0'), spotifyId:'4mloPBa6kT7U2b6ok2TvZe'},

  // Melodic Techno — beatport.com/genre/melodic-house-techno/90/top-100
  {title:'Come To Life', artist:'Cassian, AR/CO', genre:'melodic-techno', label:'tszr / Helix Records', chartRank:2, cover:BP_IMG('14e27060-16da-4702-b69c-59e35b815a14'), spotifyId:'0CBRDrO5BuFxmfIjOSYUaW'},
  {title:'Here In My Arms (Enjoy The Silence)', artist:'Armin van Buuren, Silver Panda', genre:'melodic-techno', label:'Armada Music', chartRank:3, cover:BP_IMG('db493611-6fe5-41fd-b0ed-c7c352e4bb5e'), spotifyId:'1rwOLMfAwW4M6sehYf7Lop'},
  {title:'Closer (Adriatique x GENESI)', artist:'Adriatique, Emmit Fenn, GENESI (ITA)', genre:'melodic-techno', label:'X Recordings', chartRank:6, cover:BP_IMG('62938540-b511-4f75-95a3-6902c18939e0')},
  {title:'Other Dimension', artist:'Volkoder, Anyma (ofc)', genre:'melodic-techno', label:'ÆDEN RECORDS', chartRank:7, cover:BP_IMG('d682da2e-f690-43d0-91e6-388e9ce47001'), spotifyId:'5IQCfDD1PwrArvdEFDLUZ2'},
  {title:'7 Days', artist:'Kevin de Vries, Meduza', genre:'melodic-techno', label:'Tomorrowland Music', chartRank:11, cover:BP_IMG('824ad2ad-ae21-4e9e-b2c1-be41ce32c607'), spotifyId:'7Dukh87qwI5c0IB1UEAp73'},
  {title:'Science Fiction', artist:'Brunello', genre:'melodic-techno', label:'Mellow Circus Records', chartRank:13, cover:BP_IMG('baff6bd6-f897-45d5-a130-5535e7478470'), spotifyId:'6FTveMyq8szPAloptdZ17g'},
  {title:'333 (Extended)', artist:'Super Flu, Peace Control, Eric Reyes', genre:'melodic-techno', label:'Didschn', chartRank:14, cover:BP_IMG('ca085f9c-1fc9-4eaf-9379-b7dbac074845')},
  {title:'Crossing', artist:'HotLap', genre:'melodic-techno', label:'Global Underground', chartRank:17, cover:BP_IMG('f7b97c1d-3c20-4a05-a247-46d594134b92')},

  // Tech House — beatport.com/genre/tech-house/11/top-100
  {title:'Beat Goes On', artist:'Rafael, Adam Ten', genre:'tech-house', label:'Maccabi House', chartRank:1, cover:BP_IMG('aed932b2-4481-46ee-9661-a48f52a79ee5'), spotifyId:'4WHvIDcDOcAVrsI5BxPGBM'},
  {title:'MYSTERY OF RAW', artist:'Wu-Tang Clan, Michael Bibi, Kettama', genre:'tech-house', label:'CircoLoco Records', chartRank:2, cover:BP_IMG('0081a294-434d-4d4f-a5b4-8d9eac715593'), spotifyId:'2v4NP088R6LUgFBDF9JqBg'},
  {title:'Body Shake', artist:'Max Styler', genre:'tech-house', label:'Nu Moda', chartRank:3, cover:BP_IMG('f7988cd7-211b-412d-9283-f873cb8530fb'), spotifyId:'3oToDCuXNWSgqkxtPKQM3b'},
  {title:'Reason Why', artist:'Sapian', genre:'tech-house', label:'Prophecy', chartRank:4, cover:BP_IMG('7d2c3455-4d87-447d-a0b9-129bb4488f0f')},
  {title:'Stay Sexy', artist:'Mili, HUGEL, LaBritney', genre:'tech-house', label:'Make The Girls Dance Records', chartRank:5, cover:BP_IMG('147b990b-5790-4617-9e45-82cd52939f33'), spotifyId:'51ebEtVMk572G7rln7lims'},
  {title:'I Never Knew', artist:'Adam Ten', genre:'tech-house', label:'Defected', chartRank:6, cover:BP_IMG('700c55a3-a434-4482-9bd5-ab8f45e99108'), spotifyId:'54vF34GSMXYZfjPXMsHYWf'},
  {title:'wtf', artist:'Roland Clark, DvirNuns, Broken Hill', genre:'tech-house', label:'THRIVE MUSIC', chartRank:7, cover:BP_IMG('f2efbc21-6169-440a-9d10-158b5836d9f5'), spotifyId:'0gsCoEAU0OOr4lXNEgXhgW'},
  {title:'Never Leave U', artist:'Sonny Kane', genre:'tech-house', label:'Boat Club Records', chartRank:8, cover:BP_IMG('ee52762e-d265-4ce7-bd01-d81c60ed3ad2'), spotifyId:'23khOJxVCE4SEDYCf4mZb8'},
  {title:'Late Night Baddies', artist:'MALARKEY, Gaskin, Tom Did It', genre:'tech-house', label:'Bass Jamz', chartRank:9, cover:BP_IMG('e5e065ea-403c-47f4-a32e-1537f2b5db0a')},

  // Progressive House — beatport.com/genre/progressive-house/15/top-100
  {title:'Rise', artist:'Guy J', genre:'progressive-house', label:'Global Underground', chartRank:1, cover:BP_IMG('bb973753-28af-48a3-a563-da35ea3e0654'), spotifyId:'3r6mlzTxJ88gBZaXLQ95M8'},
  {title:'Iguana', artist:'Maze 28', genre:'progressive-house', label:'Meanwhile', chartRank:2, cover:BP_IMG('5b873ce4-2fdb-4b5a-a471-49d96bd1add2'), spotifyId:'4mEfQZMtdHx70plj7PAPPb'},
  {title:'Stamina', artist:'Simon Vuarambon', genre:'progressive-house', label:'Global Underground', chartRank:3, cover:BP_IMG('45d5c6b4-d5ee-4faf-a8f1-f5107f5f9a7a'), spotifyId:'6y04dwYrPlsU9snufwmJvg'},
  {title:'Luv 4 U', artist:'Cristoph, Seizmic (UK)', genre:'progressive-house', label:'Consequence Of Society Recordings', chartRank:4, cover:BP_IMG('6ed5cba9-95f8-42bd-abd2-5d6c315b7656')},
  {title:'Storm Chasing', artist:'Spencer Brown', genre:'progressive-house', label:'Global Underground', chartRank:5, cover:BP_IMG('a62f23cb-b406-476a-b814-815feefef494')},
  {title:'Natural Blues (TECIE)', artist:'Moby, BLOND:ISH, Kiko Franco, Jacob Lusk', genre:'progressive-house', label:'Defected', chartRank:6, cover:BP_IMG('1d62b145-bca9-4e9a-8c50-9e988b4f045c')},
  {title:'Go', artist:'HANA, Ezequiel Arias', genre:'progressive-house', label:'Anjunadeep', chartRank:7, cover:BP_IMG('52cc0116-6fe9-4232-a566-516575011ae1'), spotifyId:'19qaByyKLCD9R2raOpD13U'},
  {title:'Be My High', artist:'Redspace, Poli-Poli', genre:'progressive-house', label:'AMOX Frequencies', chartRank:8, cover:BP_IMG('f3d79f2f-1aa6-4007-a1e0-ab909fd78d56')},

  // Techno (Peak Time/Driving) — beatport.com/genre/techno-peak-time-driving/6/top-100
  {title:"Don't Mess With Us", artist:'Victor Ruiz, Kaufmann (DE)', genre:'techno', label:'VOLTA', chartRank:1, cover:BP_IMG('11ac23f4-28d2-4de0-96d9-9371be8dbbf2'), spotifyId:'7aYuudVpLDpY3d3I4YoXUQ'},
  {title:'Liquid Hook (Victor Ruiz Remix)', artist:'Liquid Soul, Victor Ruiz, Captain Hook', genre:'techno', label:'Iboga Records', chartRank:2, cover:BP_IMG('4b231cd8-1504-410a-a13d-6fcdeabdb41f'), spotifyId:'1HNRoHRSHSIJqvywZgj1GO'},
  {title:'Vibrancy (Kos:mo Remix)', artist:'UMEK', genre:'techno', label:'1605', chartRank:3, cover:BP_IMG('693d0f5b-92c8-4c51-aecd-2cd1d0fbb116'), spotifyId:'4AGbgD8EmhPwCMO4uEZlX3'},
  {title:'K.O.', artist:'Oliver Huntemann, Kaufmann (DE)', genre:'techno', label:'Drumcode', chartRank:4, cover:BP_IMG('2e43d6d6-5681-4b4d-9c36-eafb12c301a8'), spotifyId:'6cShjebz9q8ika8tyssGOa'},
  {title:'Dancing', artist:'19:26, Bittermind', genre:'techno', label:'Drumcode', chartRank:5, cover:BP_IMG('33fdf53a-9941-47a6-a25a-93a8d0595238'), spotifyId:'1oyHVXCaR3TSlD4p2kWdz1'},
  {title:'The Realm', artist:'Layton Giordani, KASIA (ofc)', genre:'techno', label:'Drumcode', chartRank:6, cover:BP_IMG('19b27928-126a-406e-914f-0b737ec04607'), spotifyId:'2KtVx4lNWEgRW7UXGxJZwO'},
  {title:'No Mercy', artist:'Armin van Buuren, Adam Beyer', genre:'techno', label:'Drumcode', chartRank:7, cover:BP_IMG('1fcb7780-e4fb-4488-a84e-2cef11ff7343'), spotifyId:'4pLwmpLa11SfOVakFQvIxk'},
  {title:'Proton', artist:'Alignment, Space 92', genre:'techno', label:'TAKEOFF', chartRank:8, cover:BP_IMG('b7857e27-5b2e-4443-aeae-41ea466ab299'), spotifyId:'2AzAamWZi47Fv7nds8h7AM'},

  // Minimal / Deep Tech — beatport.com/genre/minimal-deep-tech/14/top-100
  {title:'Can You Feel The Bass', artist:'Local Dub', genre:'minimal-deeptech', label:"You&Me Records", chartRank:1, cover:BP_IMG('15862b4e-757b-45d3-93e9-e350f2eb2a94'), spotifyId:'4gALmStbKnYZWsBv2hJcGI'},
  {title:'Work It', artist:'SEBS', genre:'minimal-deeptech', label:'Atlantic Records UK', chartRank:2, cover:BP_IMG('2dfbe133-70d3-4afd-a815-89382e05239f'), spotifyId:'3xcgtqFTfz0KX3JiOvooJM'},
  {title:'Trust Me (feat. Ben Westbeech)', artist:'Ben Westbeech, Dunmore Brothers', genre:'minimal-deeptech', label:'Solid Grooves Records', chartRank:3, cover:BP_IMG('6582d431-92a3-4141-aa0f-2a811f0cf416'), spotifyId:'5qP8KF9stgPaaXuXu2Hj1I'},
  {title:'Positive', artist:'Jamback', genre:'minimal-deeptech', label:'CircoLoco Records', chartRank:4, cover:BP_IMG('32a7f2ce-b1fe-460f-83b1-f2011fafaed7'), spotifyId:'0cZN3g7rtfNE6vsmX0k8OF'},
  {title:"Poppin' In Tha Club", artist:'Local Dub', genre:'minimal-deeptech', label:"You&Me Records", chartRank:5, cover:BP_IMG('15862b4e-757b-45d3-93e9-e350f2eb2a94'), spotifyId:'5QMZrqyuY2JhdGgexPd3uF'},
  {title:'Reaction', artist:'Local Dub', genre:'minimal-deeptech', label:"You&Me Records", chartRank:6, cover:BP_IMG('15862b4e-757b-45d3-93e9-e350f2eb2a94'), spotifyId:'6GhfGMVMtrkLyPuPeb1Rkp'},
  {title:'Move Shake', artist:'Jeff Sorkowitz', genre:'minimal-deeptech', label:'IN / ROTATION - Insomniac Records', chartRank:7, cover:BP_IMG('afd9b4bd-fb4c-4635-953f-8e416cf131d6'), spotifyId:'3zJ3HnuFWvYGNeVxafs4mu'},
  {title:'XTC', artist:'Mike Morrisey, BLND (UK)', genre:'minimal-deeptech', label:'Metamorfosi Records', chartRank:8, cover:BP_IMG('534b4571-178a-409d-8883-c635ee21447d')},

  // Indie Dance — beatport.com/genre/indie-dance/37/top-100
  {title:'Work', artist:'Gabss', genre:'indie-dance', label:'NO DISCO', chartRank:1, cover:BP_IMG('b296a9be-a33a-4011-8c54-cb178420ead6'), spotifyId:'1rpdapoYtP0nk1zK01FZT9'},
  {title:'Panjab (Extended Mix)', artist:'Sphynx, GROSSOMODDO', genre:'indie-dance', label:'Make The Girls Dance Records', chartRank:2, cover:BP_IMG('b3f50356-d4ee-41b4-93a2-04f72cd391c3')},
  {title:'Freak (Extended Mix)', artist:'HIGHLITE, Peredel', genre:'indie-dance', label:'Nomo Music', chartRank:3, cover:BP_IMG('74032e84-f772-472b-842e-0fb7603b51cf')},
  {title:'Tu Es Tout (Extended Mix)', artist:'Tom & Collins', genre:'indie-dance', label:"SPINNIN' DEEP", chartRank:4, cover:BP_IMG('3f2d33d6-957a-42d5-8d13-67fd55b76c54'), spotifyId:'34OVYem9gbZQwKFdOC6Hxs'},
  {title:'Rock Like This', artist:'Amour Propre', genre:'indie-dance', label:'Diynamic', chartRank:5, cover:BP_IMG('d9737289-2313-475b-9d7f-a94250210ca3'), spotifyId:'2PCu3SAbFOR3xf05PIvla4'},
  {title:'Synth Lines', artist:'Alexey Union, David LeSal, Broken Hill, STAY GOLDEN', genre:'indie-dance', label:'All Day I Dream', chartRank:6, cover:BP_IMG('de7d0304-1751-4ee5-a381-4382bf189818'), spotifyId:'4L2ADNUv49ViqB0MEbhrj4'},
  {title:'Silent Covenant', artist:'STAY GOLDEN', genre:'indie-dance', label:'All Day I Dream', chartRank:7, cover:BP_IMG('de7d0304-1751-4ee5-a381-4382bf189818'), spotifyId:'2BSjHcyVsGiWP5XYFj1eNH'},
  {title:'Spring Girl (Extended)', artist:'Maori, Adam Ten', genre:'indie-dance', label:'Higher Ground', chartRank:8, cover:BP_IMG('36f4689b-315f-4a69-aa3e-37a2c087a4dc'), spotifyId:'6JNtrXY6BmWdew481iWXbl'},
];

/* ---------------------------- TRACK GENERATION --------------------------- */
const N_TRACKS = REAL_TRACKS.length;
let TRACKS = [];

function genHistory(rand, driftBias){
  const arr=[]; let v = 22 + rand()*35;
  for(let d=0; d<90; d++){
    const drift = driftBias * 0.045 * (d/90);
    v += (rand()-0.5)*3.4 + drift;
    v = clamp(v, 4, 99);
    arr.push(Math.round(v*10)/10);
  }
  return arr;
}
function pctChange(arr, back){
  const end = arr[arr.length-1];
  const start = arr[Math.max(0, arr.length-1-back)];
  if(start<=0.001) return 0;
  return Math.round(((end-start)/start)*1000)/10;
}

const CHART_GENRE_LABEL = {
  'afro-house':'Afro House', 'afro-tech':'Afro House', 'tribal-house':'Afro House',
  'house':'House', 'deep-house':'Deep House', 'organic-house':'Organic House',
  'melodic-house':'Melodic House & Techno', 'melodic-techno':'Melodic House & Techno',
  'tech-house':'Tech House', 'progressive-house':'Progressive House',
  'techno':'Techno (Peak Time / Driving)', 'minimal-deeptech':'Minimal / Deep Tech',
  'indie-dance':'Indie Dance',
};
function chartScoreFromRank(rank){
  // Beatport genre-chart position -> 0-100 "Chart Performance" input.
  // #1 ≈ 100, decaying smoothly; never the sole driver of DJ Score (see WEIGHTS).
  return clamp(108 - rank*4, 5, 100);
}

function buildTracks(){
  for(let i=0;i<N_TRACKS;i++){
    const rand = mulberry32(2000+i*97);
    const src = REAL_TRACKS[i];
    const title = src.title, artist = src.artist, label = src.label, chartRank = src.chartRank, coverUrl = src.cover;
    const genre = src.genre;
    const spotifyId = src.spotifyId || null; // verified real Spotify track ID (WebSearch, exact title+artist match) — null = not verified, stays on the generated preview
    const isRiser = rand() < 0.15; // ~15% of catalogue = early-stage "Next Big Track" candidates
    const driftBias = isRiser ? (5+rand()*8) : (rand()-0.42)*7;
    const history = genHistory(rand, driftBias);

    const releaseDaysAgo = isRiser ? Math.round(rand()*70) : Math.round(rand()*rand()*520); // risers are always fresh
    const releaseDate = new Date(TODAY.getTime() - releaseDaysAgo*86400000);
    const newness = clamp(100 - releaseDaysAgo/4.2, 2, 100);

    // Play-count growth (independent of the bounded 0-100 score curve above — a track's
    // spins can grow +200% while its normalized DJ Score index only moves within 0-100).
    const growth14d = isRiser ? Math.round((60 + rand()*220)*10)/10 : Math.round(((rand()-0.38)*60)*10)/10;
    const trend7d = Math.round((growth14d * (0.24+rand()*0.10))*10)/10;
    const trend30d = Math.round((growth14d * (1.25+rand()*0.35))*10)/10;
    const trend24h = Math.round((trend7d * (0.10+rand()*0.10))*10)/10;

    // Early-stage tracks are adopted by a smaller, spreading pool of DJs/markets —
    // that's exactly what keeps them out of the Top 15 while they're still emerging.
    const djsPlaying = isRiser ? Math.round(120 + rand()*520) : Math.round(180 + rand()*rand()*6200);
    const countriesCount = isRiser ? Math.round(8 + rand()*55) : Math.round(6 + rand()*88);
    const citiesCount = Math.round(countriesCount*1.6 + rand()*90);
    const clubsCount = rand()<0.62 ? Math.round(15+rand()*420) : null;

    // per-city affinity (drives country/city rankings independent of global score)
    const cityAffinity = {};
    const homeCities = pickN(CITIES, 4, rand);
    CITIES.forEach(c=>{ cityAffinity[c.id] = Math.round(rand()*55); });
    homeCities.forEach((c,idx)=>{ cityAffinity[c.id] = Math.round(70 + rand()*30 - idx*3); });

    const m = {
      freq: clamp(30 + (djsPlaying/6200)*70, 0, 100),
      growth: clamp(50 + growth14d*0.55, 0, 100),
      geo: clamp((countriesCount/95)*100, 0, 100),
      chart: chartScoreFromRank(chartRank),
      city: clamp((citiesCount/230)*100, 0, 100),
      newness: newness,
    };

    TRACKS.push({
      id: 'trk_'+i,
      title, artist, genre, label,
      chartSource:'Beatport', chartGenreName: CHART_GENRE_LABEL[genre] || (genreById(genre)?genreById(genre).name:''), chartRank,
      releaseDate, releaseDaysAgo,
      djsPlaying, countriesCount, citiesCount, clubsCount,
      cityAffinity,
      history,
      trend24h: Math.round(trend24h*10)/10,
      trend7d, trend30d, growth14d,
      m,
      djScore: 0, // computed
      coverSeed: Math.floor(rand()*9999),
      coverUrl,
      spotifyId,
    });
  }
}
buildTracks();

// The ~30 "Monde"/"Pays" catalogue tracks without a verified Spotify ID get
// their real YouTube video (found automatically server-side, see
// sync-charts' catalog backfill) applied here once it's available — the
// catalogue itself is built synchronously above, so this patches it in
// shortly after and re-renders if a track detail/list is already on screen.
async function applyCatalogYoutubeIds(){
  try{
    const res = await fetch(`${SUPABASE_URL}/rest/v1/catalog_youtube?youtube_id=not.is.null&select=track_key,youtube_id`, { headers: SUPABASE_HEADERS });
    const rows = await res.json();
    if(!Array.isArray(rows) || !rows.length) return;
    const byKey = {};
    rows.forEach(r=>{ byKey[r.track_key] = r.youtube_id; });
    let changed = false;
    TRACKS.forEach(t=>{
      if(byKey[t.id]){ t.youtubeId = byKey[t.id]; changed = true; }
    });
    if(changed && typeof renderView === 'function') renderView();
  } catch(e){ /* no youtube ids yet — generated preview stays the fallback */ }
}
applyCatalogYoutubeIds();

/* ---------------------------- SCORING ENGINE ----------------------------- */
// Default coefficients per spec
const DEFAULT_WEIGHTS = { freq:30, growth:20, geo:15, chart:15, city:10, newness:10 };
let WEIGHTS = {...DEFAULT_WEIGHTS};

function recomputeScores(){
  const wsum = Object.values(WEIGHTS).reduce((a,b)=>a+b,0) || 1;
  TRACKS.forEach(t=>{
    const raw = t.m.freq*WEIGHTS.freq + t.m.growth*WEIGHTS.growth + t.m.geo*WEIGHTS.geo +
                t.m.chart*WEIGHTS.chart + t.m.city*WEIGHTS.city + t.m.newness*WEIGHTS.newness;
    t.djScore = Math.round(clamp(raw/wsum, 1, 100));
  });
  TRACKS.sort((a,b)=>b.djScore-a.djScore);
  TRACKS.forEach((t,i)=> t.rank = i+1 );
  // Next Big Tracks: strong 14d growth, not already top 15
  TRACKS.forEach(t=> t.isNextBig = (t.growth14d>=55 && t.rank>15) );
}
recomputeScores();

function trendScoreOf(t){
  // Emphasizes velocity + newness + geographic spread acceleration
  return Math.round(clamp(t.growth14d*0.55 + t.m.newness*0.25 + t.m.geo*0.20, -100, 400));
}
function trendLabel(growth14d){
  if(growth14d>=150) return {txt:'EXPLODING', cls:'exploding', icon:'🚀'};
  if(growth14d>=80) return {txt:'HOT', cls:'hot', icon:'🔥'};
  if(growth14d>=30) return {txt:'RISING', cls:'rising', icon:'↑'};
  return {txt:'STEADY', cls:'steady', icon:'→'};
}
function trendBadge(pct){
  const abs = Math.abs(pct);
  let icon = '→', cls='flat';
  if(pct>=25){icon='🚀';cls='up';}
  else if(pct>=15){icon='🔥';cls='up';}
  else if(pct>=1){icon='↑';cls='up';}
  else if(pct<=-1){icon='↓';cls='down';}
  return `<span class="t-trend ${cls}">${icon} ${fmtPct(Math.round(pct))}</span>`;
}

/* ---------------------------- DJ PROFILES (for "similar taste") --------- */
const FAKE_DJS = [
  {name:'Kwesi Sol', city:'ibiza', genres:['afro-house','organic-house']},
  {name:'Nala Rivers', city:'capetown', genres:['afro-tech','tribal-house']},
  {name:'Théo Marchand', city:'paris', genres:['melodic-techno','techno']},
  {name:'Sanaa Bloom', city:'dubai', genres:['afro-house','melodic-house']},
  {name:'Milo Andrade', city:'miami', genres:['tech-house','house']},
  {name:'Zola Vex', city:'berlin', genres:['minimal-deeptech','techno']},
];

/* ---------------------------- APP STATE ---------------------------------- */
const state = {
  user: null, // {name,email,isPro,artistName,country,city,genres,instagram,soundcloud}
  view: 'home',
  scope: 'world', // world | country | city
  selectedCountry: 'ES',
  selectedCity: 'ibiza',
  period: '7d', // today|7d|30d
  cityPeriod: 'today', // today|7d|30d — période de comparaison pour le classement réel "Ville"
  genreFilters: new Set(), // empty = all
  trendingPeriod: '7d',
  exploreMode: 'country', // country | city
  exploreOpenCityId: null,
  exploreCityPlatform: 'spotify', // apple_music | spotify | shazam — live city charts
  homeCityPlatform: 'spotify',
  radarTab: 'saved',
  favTracks: new Set(),
  favArtists: new Set(),
  favCities: new Set(),
  favGenres: new Set(),
  currentTrackId: null,
  trackChartPeriod: '30d',
  lang: 'fr', // fr | en | es | de
};

function isPro(){ return !!(state.user && state.user.isPro); }

/* ---------------------------- AUTH + PERSISTENCE (Supabase) ----------------
   Real accounts via Supabase Auth (email+password), with cross-session
   storage of the DJ profile, Radar favorites and language in our own
   `profiles` table (RLS-protected — each user can only ever read/write their
   own row). Session tokens live in localStorage so a signed-in DJ stays
   signed in across app restarts. A guest (no account) stays local-only and
   simply won't be remembered next launch — that's the one case where nothing
   is persisted, and it's intentional. */
const AUTH_SESSION_KEY = 'pulse_auth_session';
let authSession = null; // { access_token, refresh_token, expires_at(ms), userId, email }
let PERSIST_READY = false;

function getStoredSession(){
  try{ const raw = localStorage.getItem(AUTH_SESSION_KEY); return raw ? JSON.parse(raw) : null; }
  catch(e){ return null; }
}
function setStoredSession(session){
  try{
    if(session) localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(AUTH_SESSION_KEY);
  }catch(e){ /* storage unavailable — session just won't survive a restart */ }
}
function applyAuthResponse(data){
  authSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + ((data.expires_in || 3600) * 1000),
    userId: data.user && data.user.id,
    email: data.user && data.user.email,
  };
  setStoredSession(authSession);
}
function authHeaders(session){
  return { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' };
}

async function authSignUp(email, password){
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: { ...SUPABASE_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw { code: data.error_code || data.code, message: data.msg || data.error_description || data.message };
  return data; // access_token present only if email confirmation is OFF
}
async function authSignIn(email, password){
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { ...SUPABASE_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw { code: data.error_code || data.code, message: data.msg || data.error_description || data.message };
  return data;
}
async function authSignOut(){
  if(authSession && authSession.access_token){
    try{
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { ...SUPABASE_HEADERS, Authorization: `Bearer ${authSession.access_token}` },
      });
    }catch(e){ /* best-effort — we still clear the local session below */ }
  }
  authSession = null;
  setStoredSession(null);
}
// Refreshes the access token if it's near expiry. Returns null (never
// throws) if there's no usable session — callers fall back to local-only.
async function ensureFreshSession(){
  if(!authSession) return null;
  if(authSession.expires_at - Date.now() > 30000) return authSession;
  try{
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { ...SUPABASE_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: authSession.refresh_token }),
    });
    const data = await res.json().catch(()=>({}));
    if(!res.ok) throw new Error('refresh_failed');
    applyAuthResponse(data);
    return authSession;
  }catch(e){
    authSession = null;
    setStoredSession(null);
    return null;
  }
}

async function initPersistence(){
  const stored = getStoredSession();
  if(stored && stored.access_token){
    authSession = stored;
    const session = await ensureFreshSession();
    if(session) await loadPersistedState();
  }
  PERSIST_READY = true;
}

async function loadPersistedState(){
  const session = await ensureFreshSession();
  if(!session) return;
  try{
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${session.userId}&select=*`, { headers: authHeaders(session) });
    const rows = await res.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    if(row){
      state.user = {
        name: row.name || '', email: session.email, isPro: !!row.is_pro,
        artistName: row.artist_name || '', country: row.country || '', city: row.city || '',
        genres: row.genres || [], instagram: row.instagram || '', soundcloud: row.soundcloud || '',
      };
      if(Array.isArray(row.fav_tracks)) state.favTracks = new Set(row.fav_tracks);
      if(row.lang && row.lang !== state.lang) setLang(row.lang);
    } else if(state.user){
      // First save for a brand-new account — no row yet, create it.
      await persistState();
    }
  }catch(e){ /* non-fatal — app keeps working from in-memory state */ }
}

async function persistState(){
  const session = await ensureFreshSession();
  if(!session || !state.user) return;
  const payload = {
    id: session.userId,
    name: state.user.name || '', artist_name: state.user.artistName || '',
    country: state.user.country || '', city: state.user.city || '',
    genres: state.user.genres || [], instagram: state.user.instagram || '', soundcloud: state.user.soundcloud || '',
    is_pro: !!state.user.isPro, fav_tracks: [...state.favTracks], lang: state.lang,
    updated_at: new Date().toISOString(),
  };
  try{
    await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: { ...authHeaders(session), Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify(payload),
    });
  }catch(e){ /* non-fatal — next successful save catches up */ }
}

/* ---------------------------- NATIVE SHELL (Capacitor iOS/Android) ---------------------------- */
/* This same index.html is also the web root of the real iOS/Android app (Capacitor).
   On web / Send / the claude.ai Artifact, window.Capacitor doesn't exist, so everything
   here just no-ops and the page behaves exactly as before. Inside the native app it wires
   up real OS chrome: status bar color, hiding the splash screen once the UI is ready, and
   the Android hardware/gesture back button (closing an open overlay first, exiting the app
   only when there's nothing left to close). */
function initNativeShell(){
  try{
    const C = window.Capacitor;
    if(!C || typeof C.isNativePlatform !== 'function' || !C.isNativePlatform()) return;
    const P = C.Plugins || {};
    if(P.StatusBar){
      P.StatusBar.setStyle({ style: 'DARK' }).catch(()=>{});
      P.StatusBar.setBackgroundColor({ color: '#0a0a0f' }).catch(()=>{});
    }
    if(P.App){
      P.App.addListener('backButton', ({ canGoBack }) => {
        const openOverlay = ['trackOverlay','genreOverlay','paywallOverlay']
          .map(id => document.getElementById(id))
          .find(el => el && !el.classList.contains('hidden'));
        if(openOverlay){
          if(openOverlay.id==='trackOverlay') closeTrack();
          else { openOverlay.classList.add('hidden'); renderView(); }
          return;
        }
        if(canGoBack) window.history.back();
        else P.App.exitApp();
      });
    }
    // Give the first render a beat to paint before dropping the splash screen.
    setTimeout(()=>{ if(P.SplashScreen) P.SplashScreen.hide().catch(()=>{}); }, 350);
  }catch(e){ /* non-fatal — app stays fully usable without native chrome */ }
}

/* ---------------------------- I18N / LANGUAGES ---------------------------- */
const LANGS = [
  {code:'fr', flag:'🇫🇷', label:'FR'},
  {code:'en', flag:'🇬🇧', label:'EN'},
  {code:'es', flag:'🇪🇸', label:'ES'},
  {code:'de', flag:'🇩🇪', label:'DE'},
];
const LOCALE_MAP = {fr:'fr-FR', en:'en-US', es:'es-ES', de:'de-DE'};

const I18N = {
  fr: {
    'auth.tagline': `The Global DJ Music Intelligence Platform`,
    'auth.nameLabel': `Nom d'artiste ou pseudo`,
    'auth.namePlaceholder': `ex: Kwesi Sol`,
    'auth.emailLabel': `Email`,
    'auth.emailPlaceholder': `toi@label.com`,
    'auth.signup': `Créer mon compte DJ`,
    'auth.guest': `Continuer en invité`,
    'auth.disclaimer': `En continuant, tu rejoins la plateforme de référence pour savoir ce qui marche, où, et ce qui va exploser.`,
    'auth.langLabel': `Langue`,
    'auth.passwordLabel': `Mot de passe`,
    'auth.passwordPlaceholder': `6 caractères minimum`,
    'auth.login': `Se connecter`,
    'auth.loading': `Un instant…`,
    'auth.haveAccount': `J'ai déjà un compte`,
    'auth.noAccount': `Créer un compte`,
    'auth.errorMissing': `Email et mot de passe requis`,
    'auth.errorInvalidCredentials': `Email ou mot de passe incorrect`,
    'auth.errorEmailTaken': `Un compte existe déjà avec cet email`,
    'auth.errorWeakPassword': `Le mot de passe doit faire au moins 6 caractères`,
    'auth.errorGeneric': `Une erreur est survenue, réessaie`,
    'auth.checkEmail': `Compte créé ! Vérifie ta boîte mail pour confirmer, puis connecte-toi.`,
    'auth.errorEmailNotConfirmed': `Confirme d'abord ton email (vérifie ta boîte de réception)`,
    'nav.top': `Top`,
    'nav.nextbig': `Next Big`,
    'nav.explore': `Explore`,
    'nav.radar': `Radar`,
    'nav.profile': `Profil`,
    'home.brandSmall': `MUSIC INTELLIGENCE`,
    'home.scopeWorld': `MONDE`,
    'home.scopeCountry': `PAYS`,
    'home.scopeCity': `VILLE`,
    'home.periodToday': `TODAY`,
    'home.period7d': `7 JOURS`,
    'home.period30d': `30 JOURS`,
    'home.chipAll': `TOUT`,
    'home.chipAfroHouse': `AFRO HOUSE`,
    'home.chipAfroTech': `AFRO TECH`,
    'home.chipHouse': `HOUSE`,
    'home.chipMelodic': `MELODIC`,
    'home.chipTechno': `TECHNO`,
    'home.chipMoreGenres': `+ Genres`,
    'home.trendingNow': `🔥 Trending Now`,
    'home.topGlobal': `GLOBAL TOP 100`,
    'home.topPrefix': `TOP`,
    'home.pro': `Pro ↗`,
    'home.unlockTop100': `🔓 Débloquer le Top 100 complet — PRO DJ`,
    'nextbig.title': `NEXT BIG TRACKS`,
    'nextbig.subtitle': `DÉTECTION PRÉCOCE`,
    'nextbig.proOnlyTitle': `Réservé aux DJs Pro`,
    'nextbig.proOnlyDesc': `Découvre les morceaux qui explosent avant tout le monde, avant qu'ils deviennent des hits mondiaux.`,
    'nextbig.unlockPro': `Débloquer avec PRO`,
    'nextbig.empty': `Aucun morceau émergent pour ce filtre pour le moment.`,
    'nextbig.days14': `en 14 jours`,
    'nextbig.djs': `DJs`,
    'nextbig.countries': `Pays`,
    'nextbig.adoptionNote': `💬 Ce morceau commence à être fortement adopté par les DJs.`,
    'explore.title': `WORLD MAP`,
    'explore.country': `PAYS`,
    'explore.city': `VILLES`,
    'explore.selectZone': `Sélectionne une zone`,
    'explore.activeScene': `Scène active`,
    'radar.title': `MY RADAR`,
    'radar.alertsTab': `🔔 Alertes`,
    'radar.empty': `Ton radar est vide.<br>Ajoute des morceaux depuis leur fiche pour suivre leur évolution ici. 📡`,
    'radar.followedGenres': `GENRES SUIVIS`,
    'radar.followedCities': `VILLES SUIVIES`,
    'radar.thisWeek': `cette semaine`,
    'profile.title': `PROFIL`,
    'profile.loginPrompt': `Connecte-toi pour créer ton profil DJ.`,
    'profile.loginButton': `Se connecter / Créer un compte`,
    'profile.createTitle': `CRÉER MON PROFIL DJ`,
    'profile.artistName': `Nom d'artiste`,
    'profile.country': `Pays`,
    'profile.city': `Ville`,
    'profile.genresPlayed': `Genres joués`,
    'profile.instagram': `Instagram`,
    'profile.soundcloud': `SoundCloud`,
    'profile.createButton': `Créer mon profil DJ`,
    'profile.titleProfile': `PROFIL DJ`,
    'profile.proDj': `PRO DJ`,
    'profile.free': `FREE`,
    'profile.goProTitle': `⭐ Passe PRO DJ`,
    'profile.goProDesc': `Top 100 complet, Next Big Tracks, historique 90 jours, alertes illimitées, My Radar complet.`,
    'profile.viewProOffer': `Voir l'offre PRO`,
    'profile.topPlayed': `Top morceaux joués`,
    'profile.similarDjs': `DJs au style similaire`,
    'profile.noMatch': `Pas encore de correspondance.`,
    'profile.admin': `🛠️ Admin Dashboard`,
    'profile.logout': `Se déconnecter`,
    'profile.footer': `© 2026 Bena — Pulse Music.<br>Tous droits réservés. Logiciel propriétaire — voir LICENSE.txt.`,
    'profile.language': `Langue`,
    'track.detailTitle': `FICHE MORCEAU`,
    'track.djScore': `DJ SCORE`,
    'track.days7': `sur 7 jours`,
    'track.djs': `DJs`,
    'track.countries': `Pays`,
    'track.cities': `Villes`,
    'track.clubsEvents': `Clubs / événements`,
    'track.dataUnavailable': `Donnée indisponible`,
    'track.topLocations': `Top Locations`,
    'track.trendHistory': `Trend History`,
    'track.days7chip': `7 JOURS`,
    'track.days30chip': `30 JOURS`,
    'track.days90chip': `90 JOURS`,
    'track.details': `Détails`,
    'track.genre': `Genre`,
    'track.releaseDate': `Date de sortie`,
    'track.artist': `Artiste`,
    'track.label': `Label`,
    'track.ranking': `Classement`,
    'track.audioRealBadge': `✓ Extrait audio officiel — lecteur Spotify`,
    'track.audioRealNote': `Audio réel diffusé directement depuis les serveurs Spotify (widget officiel intégré) — identifié manuellement pour ce morceau.`,
    'track.audioRealBadgeYoutube': `✓ Extrait audio réel — lecteur YouTube`,
    'track.audioRealNoteYoutube': `Audio réel diffusé directement depuis YouTube (lecteur officiel intégré) — trouvé automatiquement pour ce morceau.`,
    'track.audioRealBadgeApple': `✓ Extrait audio réel — Apple Music`,
    'track.audioRealNoteApple': `Extrait de 30 secondes du vrai morceau, via la recherche publique Apple Music.`,
    'track.audioGenNote': `Extrait généré pour la démo (pas encore identifié avec certitude sur Spotify) · adapté au genre du morceau`,
    'track.playExtract': `▶ Écouter l'extrait`,
    'track.pauseExtract': `⏸ Pause l'extrait`,
    'track.listenFull': `Écouter en entier`,
    'track.spotify': `Spotify`,
    'track.beatport': `Beatport`,
    'track.soundcloud': `SoundCloud`,
    'track.appleMusic': `Apple Music`,
    'track.teaser': `Teaser`,
    'track.deezer': `Deezer`,
    'track.youtubeMusic': `YouTube Music`,
    'track.disclaimerBase': `Identité du morceau (titre, artiste, label, classement, pochette) basée sur le chart public Beatport du jour.`,
    'track.disclaimerSpotify': ` L'extrait audio est le vrai morceau, diffusé via le lecteur officiel Spotify.`,
    'track.disclaimerYoutube': ` L'extrait audio est le vrai morceau, diffusé via le lecteur officiel YouTube.`,
    'track.disclaimerApple': ` L'extrait audio est le vrai morceau (30 secondes), via la recherche publique Apple Music.`,
    'track.disclaimerGenerated': ` L'extrait audio est généré pour la démo (morceau pas encore identifié avec certitude sur Spotify).`,
    'track.disclaimerTail': ` Les indicateurs DJ (plays, pays, villes, DJ Score, croissance) sont simulés pour cette démo — ils viendront de la télémétrie DJ réelle en production.`,
    'genreSheet.combine': `Combiner des genres`,
    'genreSheet.apply': `Appliquer`,
    'paywall.perMonth': `/mois`,
    'paywall.orYearly': `ou 39,99&nbsp;€/an — soit 3,33&nbsp;€/mois (-33%)`,
    'paywall.activate': `Activer PRO (démo)`,
    'paywall.later': `Plus tard`,
    'paywall.labelOffer': `Offre Label/Artiste avec analytics avancés disponible sur demande.`,
    'paywall.f1': `Top 100 complet`, 'paywall.f2': `Tous les genres, pays &amp; villes`, 'paywall.f3': `🚀 Next Big Tracks`, 'paywall.f4': `Historique 90 jours`, 'paywall.f5': `Alertes illimitées`, 'paywall.f6': `My Radar complet`, 'paywall.f7': `Statistiques avancées`,
    'toast.addedToRadar': `Ajouté à ton Radar 📡`,
    'toast.proActivated': `🎉 PRO DJ activé (démo) — tout est débloqué !`,
    'toast.profileCreated': `Profil DJ créé ✅`,
    'toast.openingOn': `Ouverture sur {p}…`,
    'toast.noPreview': `Aucun extrait audio réel disponible pour ce morceau`,
  },
  en: {
    'auth.tagline': `The Global DJ Music Intelligence Platform`,
    'auth.nameLabel': `Artist name or alias`,
    'auth.namePlaceholder': `e.g. Kwesi Sol`,
    'auth.emailLabel': `Email`,
    'auth.emailPlaceholder': `you@label.com`,
    'auth.signup': `Create my DJ account`,
    'auth.guest': `Continue as guest`,
    'auth.disclaimer': `By continuing, you're joining the reference platform for knowing what's working, where, and what's about to explode.`,
    'auth.langLabel': `Language`,
    'auth.passwordLabel': `Password`,
    'auth.passwordPlaceholder': `6 characters minimum`,
    'auth.login': `Log in`,
    'auth.loading': `One moment…`,
    'auth.haveAccount': `I already have an account`,
    'auth.noAccount': `Create an account`,
    'auth.errorMissing': `Email and password required`,
    'auth.errorInvalidCredentials': `Incorrect email or password`,
    'auth.errorEmailTaken': `An account already exists with this email`,
    'auth.errorWeakPassword': `Password must be at least 6 characters`,
    'auth.errorGeneric': `Something went wrong, try again`,
    'auth.checkEmail': `Account created! Check your inbox to confirm, then log in.`,
    'auth.errorEmailNotConfirmed': `Confirm your email first (check your inbox)`,
    'nav.top': `Top`,
    'nav.nextbig': `Next Big`,
    'nav.explore': `Explore`,
    'nav.radar': `Radar`,
    'nav.profile': `Profile`,
    'home.brandSmall': `MUSIC INTELLIGENCE`,
    'home.scopeWorld': `WORLD`,
    'home.scopeCountry': `COUNTRY`,
    'home.scopeCity': `CITY`,
    'home.periodToday': `TODAY`,
    'home.period7d': `7 DAYS`,
    'home.period30d': `30 DAYS`,
    'home.chipAll': `ALL`,
    'home.chipAfroHouse': `AFRO HOUSE`,
    'home.chipAfroTech': `AFRO TECH`,
    'home.chipHouse': `HOUSE`,
    'home.chipMelodic': `MELODIC`,
    'home.chipTechno': `TECHNO`,
    'home.chipMoreGenres': `+ Genres`,
    'home.trendingNow': `🔥 Trending Now`,
    'home.topGlobal': `GLOBAL TOP 100`,
    'home.topPrefix': `TOP`,
    'home.pro': `Pro ↗`,
    'home.unlockTop100': `🔓 Unlock the full Top 100 — PRO DJ`,
    'nextbig.title': `NEXT BIG TRACKS`,
    'nextbig.subtitle': `EARLY DETECTION`,
    'nextbig.proOnlyTitle': `Pro DJs only`,
    'nextbig.proOnlyDesc': `Discover tracks exploding before everyone else, before they become global hits.`,
    'nextbig.unlockPro': `Unlock with PRO`,
    'nextbig.empty': `No emerging tracks for this filter right now.`,
    'nextbig.days14': `in 14 days`,
    'nextbig.djs': `DJs`,
    'nextbig.countries': `Countries`,
    'nextbig.adoptionNote': `💬 This track is starting to see strong adoption by DJs.`,
    'explore.title': `WORLD MAP`,
    'explore.country': `COUNTRY`,
    'explore.city': `CITIES`,
    'explore.selectZone': `Select a region`,
    'explore.activeScene': `Active scene`,
    'radar.title': `MY RADAR`,
    'radar.alertsTab': `🔔 Alerts`,
    'radar.empty': `Your radar is empty.<br>Add tracks from their detail page to follow their progress here. 📡`,
    'radar.followedGenres': `FOLLOWED GENRES`,
    'radar.followedCities': `FOLLOWED CITIES`,
    'radar.thisWeek': `this week`,
    'profile.title': `PROFILE`,
    'profile.loginPrompt': `Sign in to create your DJ profile.`,
    'profile.loginButton': `Log in / Create an account`,
    'profile.createTitle': `CREATE MY DJ PROFILE`,
    'profile.artistName': `Artist name`,
    'profile.country': `Country`,
    'profile.city': `City`,
    'profile.genresPlayed': `Genres you play`,
    'profile.instagram': `Instagram`,
    'profile.soundcloud': `SoundCloud`,
    'profile.createButton': `Create my DJ profile`,
    'profile.titleProfile': `DJ PROFILE`,
    'profile.proDj': `PRO DJ`,
    'profile.free': `FREE`,
    'profile.goProTitle': `⭐ Go PRO DJ`,
    'profile.goProDesc': `Full Top 100, Next Big Tracks, 90-day history, unlimited alerts, full My Radar.`,
    'profile.viewProOffer': `See the PRO offer`,
    'profile.topPlayed': `Most played tracks`,
    'profile.similarDjs': `DJs with a similar style`,
    'profile.noMatch': `No match yet.`,
    'profile.admin': `🛠️ Admin Dashboard`,
    'profile.logout': `Log out`,
    'profile.footer': `© 2026 Bena — Pulse Music.<br>All rights reserved. Proprietary software — see LICENSE.txt.`,
    'profile.language': `Language`,
    'track.detailTitle': `TRACK DETAILS`,
    'track.djScore': `DJ SCORE`,
    'track.days7': `over 7 days`,
    'track.djs': `DJs`,
    'track.countries': `Countries`,
    'track.cities': `Cities`,
    'track.clubsEvents': `Clubs / events`,
    'track.dataUnavailable': `Data unavailable`,
    'track.topLocations': `Top Locations`,
    'track.trendHistory': `Trend History`,
    'track.days7chip': `7 DAYS`,
    'track.days30chip': `30 DAYS`,
    'track.days90chip': `90 DAYS`,
    'track.details': `Details`,
    'track.genre': `Genre`,
    'track.releaseDate': `Release date`,
    'track.artist': `Artist`,
    'track.label': `Label`,
    'track.ranking': `Ranking`,
    'track.audioRealBadge': `✓ Official audio clip — Spotify player`,
    'track.audioRealNote': `Real audio streamed directly from Spotify's servers (official embedded widget) — manually identified for this track.`,
    'track.audioRealBadgeYoutube': `✓ Real audio clip — YouTube player`,
    'track.audioRealNoteYoutube': `Real audio streamed directly from YouTube (official embedded player) — found automatically for this track.`,
    'track.audioRealBadgeApple': `✓ Real audio clip — Apple Music`,
    'track.audioRealNoteApple': `30-second clip of the real track, via Apple Music's public search.`,
    'track.audioGenNote': `Generated preview for the demo (not yet confidently matched on Spotify) · adapted to the track's genre`,
    'track.playExtract': `▶ Play preview`,
    'track.pauseExtract': `⏸ Pause preview`,
    'track.listenFull': `Listen in full`,
    'track.spotify': `Spotify`,
    'track.beatport': `Beatport`,
    'track.soundcloud': `SoundCloud`,
    'track.appleMusic': `Apple Music`,
    'track.teaser': `Teaser`,
    'track.deezer': `Deezer`,
    'track.youtubeMusic': `YouTube Music`,
    'track.disclaimerBase': `Track identity (title, artist, label, ranking, cover art) based on today's public Beatport chart.`,
    'track.disclaimerSpotify': ` The audio preview is the real track, streamed via the official Spotify player.`,
    'track.disclaimerYoutube': ` The audio preview is the real track, streamed via the official YouTube player.`,
    'track.disclaimerApple': ` The audio preview is the real track (30 seconds), via Apple Music's public search.`,
    'track.disclaimerGenerated': ` The audio preview is generated for the demo (track not yet confidently matched on Spotify).`,
    'track.disclaimerTail': ` DJ metrics (plays, countries, cities, DJ Score, growth) are simulated for this demo — they'll come from real DJ telemetry in production.`,
    'genreSheet.combine': `Combine genres`,
    'genreSheet.apply': `Apply`,
    'paywall.perMonth': `/month`,
    'paywall.orYearly': `or €39.99/year — i.e. €3.33/month (-33%)`,
    'paywall.activate': `Activate PRO (demo)`,
    'paywall.later': `Later`,
    'paywall.labelOffer': `Label/Artist offer with advanced analytics available on request.`,
    'paywall.f1': `Full Top 100`, 'paywall.f2': `All genres, countries &amp; cities`, 'paywall.f3': `🚀 Next Big Tracks`, 'paywall.f4': `90-day history`, 'paywall.f5': `Unlimited alerts`, 'paywall.f6': `Full My Radar`, 'paywall.f7': `Advanced stats`,
    'toast.addedToRadar': `Added to your Radar 📡`,
    'toast.proActivated': `🎉 PRO DJ activated (demo) — everything is unlocked!`,
    'toast.profileCreated': `DJ profile created ✅`,
    'toast.openingOn': `Opening on {p}…`,
    'toast.noPreview': `No real audio preview available for this track`,
  },
  es: {
    'auth.tagline': `The Global DJ Music Intelligence Platform`,
    'auth.nameLabel': `Nombre artístico o alias`,
    'auth.namePlaceholder': `ej: Kwesi Sol`,
    'auth.emailLabel': `Email`,
    'auth.emailPlaceholder': `tu@sello.com`,
    'auth.signup': `Crear mi cuenta DJ`,
    'auth.guest': `Continuar como invitado`,
    'auth.disclaimer': `Al continuar, te unes a la plataforma de referencia para saber qué funciona, dónde, y qué está a punto de explotar.`,
    'auth.langLabel': `Idioma`,
    'auth.passwordLabel': `Contraseña`,
    'auth.passwordPlaceholder': `Mínimo 6 caracteres`,
    'auth.login': `Iniciar sesión`,
    'auth.loading': `Un momento…`,
    'auth.haveAccount': `Ya tengo una cuenta`,
    'auth.noAccount': `Crear una cuenta`,
    'auth.errorMissing': `Email y contraseña obligatorios`,
    'auth.errorInvalidCredentials': `Email o contraseña incorrectos`,
    'auth.errorEmailTaken': `Ya existe una cuenta con este email`,
    'auth.errorWeakPassword': `La contraseña debe tener al menos 6 caracteres`,
    'auth.errorGeneric': `Algo salió mal, inténtalo de nuevo`,
    'auth.checkEmail': `¡Cuenta creada! Revisa tu correo para confirmar y luego inicia sesión.`,
    'auth.errorEmailNotConfirmed': `Confirma primero tu email (revisa tu bandeja de entrada)`,
    'nav.top': `Top`,
    'nav.nextbig': `Next Big`,
    'nav.explore': `Explorar`,
    'nav.radar': `Radar`,
    'nav.profile': `Perfil`,
    'home.brandSmall': `MUSIC INTELLIGENCE`,
    'home.scopeWorld': `MUNDO`,
    'home.scopeCountry': `PAÍS`,
    'home.scopeCity': `CIUDAD`,
    'home.periodToday': `HOY`,
    'home.period7d': `7 DÍAS`,
    'home.period30d': `30 DÍAS`,
    'home.chipAll': `TODOS`,
    'home.chipAfroHouse': `AFRO HOUSE`,
    'home.chipAfroTech': `AFRO TECH`,
    'home.chipHouse': `HOUSE`,
    'home.chipMelodic': `MELODIC`,
    'home.chipTechno': `TECHNO`,
    'home.chipMoreGenres': `+ Géneros`,
    'home.trendingNow': `🔥 Tendencias`,
    'home.topGlobal': `TOP 100 GLOBAL`,
    'home.topPrefix': `TOP`,
    'home.pro': `Pro ↗`,
    'home.unlockTop100': `🔓 Desbloquear el Top 100 completo — PRO DJ`,
    'nextbig.title': `PRÓXIMOS HITS`,
    'nextbig.subtitle': `DETECCIÓN TEMPRANA`,
    'nextbig.proOnlyTitle': `Solo para DJs Pro`,
    'nextbig.proOnlyDesc': `Descubre los temas que explotan antes que nadie, antes de que se conviertan en hits mundiales.`,
    'nextbig.unlockPro': `Desbloquear con PRO`,
    'nextbig.empty': `No hay temas emergentes para este filtro por ahora.`,
    'nextbig.days14': `en 14 días`,
    'nextbig.djs': `DJs`,
    'nextbig.countries': `Países`,
    'nextbig.adoptionNote': `💬 Este tema está empezando a ser muy adoptado por los DJs.`,
    'explore.title': `MAPA MUNDIAL`,
    'explore.country': `PAÍS`,
    'explore.city': `CIUDADES`,
    'explore.selectZone': `Selecciona una zona`,
    'explore.activeScene': `Escena activa`,
    'radar.title': `MI RADAR`,
    'radar.alertsTab': `🔔 Alertas`,
    'radar.empty': `Tu radar está vacío.<br>Añade temas desde su ficha para seguir su evolución aquí. 📡`,
    'radar.followedGenres': `GÉNEROS SEGUIDOS`,
    'radar.followedCities': `CIUDADES SEGUIDAS`,
    'radar.thisWeek': `esta semana`,
    'profile.title': `PERFIL`,
    'profile.loginPrompt': `Inicia sesión para crear tu perfil de DJ.`,
    'profile.loginButton': `Iniciar sesión / Crear cuenta`,
    'profile.createTitle': `CREAR MI PERFIL DJ`,
    'profile.artistName': `Nombre artístico`,
    'profile.country': `País`,
    'profile.city': `Ciudad`,
    'profile.genresPlayed': `Géneros que tocas`,
    'profile.instagram': `Instagram`,
    'profile.soundcloud': `SoundCloud`,
    'profile.createButton': `Crear mi perfil DJ`,
    'profile.titleProfile': `PERFIL DJ`,
    'profile.proDj': `PRO DJ`,
    'profile.free': `FREE`,
    'profile.goProTitle': `⭐ Pásate a PRO DJ`,
    'profile.goProDesc': `Top 100 completo, Próximos Hits, historial de 90 días, alertas ilimitadas, Radar completo.`,
    'profile.viewProOffer': `Ver la oferta PRO`,
    'profile.topPlayed': `Temas más escuchados`,
    'profile.similarDjs': `DJs con estilo similar`,
    'profile.noMatch': `Aún no hay coincidencias.`,
    'profile.admin': `🛠️ Panel de Administración`,
    'profile.logout': `Cerrar sesión`,
    'profile.footer': `© 2026 Bena — Pulse Music.<br>Todos los derechos reservados. Software propietario — ver LICENSE.txt.`,
    'profile.language': `Idioma`,
    'track.detailTitle': `FICHA DEL TEMA`,
    'track.djScore': `DJ SCORE`,
    'track.days7': `en 7 días`,
    'track.djs': `DJs`,
    'track.countries': `Países`,
    'track.cities': `Ciudades`,
    'track.clubsEvents': `Clubs / eventos`,
    'track.dataUnavailable': `Dato no disponible`,
    'track.topLocations': `Top Ubicaciones`,
    'track.trendHistory': `Historial de Tendencia`,
    'track.days7chip': `7 DÍAS`,
    'track.days30chip': `30 DÍAS`,
    'track.days90chip': `90 DÍAS`,
    'track.details': `Detalles`,
    'track.genre': `Género`,
    'track.releaseDate': `Fecha de lanzamiento`,
    'track.artist': `Artista`,
    'track.label': `Sello`,
    'track.ranking': `Clasificación`,
    'track.audioRealBadge': `✓ Extracto oficial — reproductor Spotify`,
    'track.audioRealNote': `Audio real transmitido directamente desde los servidores de Spotify (widget oficial integrado) — identificado manualmente para este tema.`,
    'track.audioRealBadgeYoutube': `✓ Extracto de audio real — reproductor YouTube`,
    'track.audioRealNoteYoutube': `Audio real transmitido directamente desde YouTube (reproductor oficial integrado) — encontrado automáticamente para este tema.`,
    'track.audioRealBadgeApple': `✓ Extracto de audio real — Apple Music`,
    'track.audioRealNoteApple': `Extracto de 30 segundos del tema real, vía la búsqueda pública de Apple Music.`,
    'track.audioGenNote': `Extracto generado para la demo (aún no identificado con certeza en Spotify) · adaptado al género del tema`,
    'track.playExtract': `▶ Escuchar extracto`,
    'track.pauseExtract': `⏸ Pausar extracto`,
    'track.listenFull': `Escuchar completo`,
    'track.spotify': `Spotify`,
    'track.beatport': `Beatport`,
    'track.soundcloud': `SoundCloud`,
    'track.appleMusic': `Apple Music`,
    'track.teaser': `Teaser`,
    'track.deezer': `Deezer`,
    'track.youtubeMusic': `YouTube Music`,
    'track.disclaimerBase': `Identidad del tema (título, artista, sello, clasificación, portada) basada en el chart público de Beatport del día.`,
    'track.disclaimerSpotify': ` El extracto de audio es el tema real, transmitido a través del reproductor oficial de Spotify.`,
    'track.disclaimerYoutube': ` El extracto de audio es el tema real, transmitido a través del reproductor oficial de YouTube.`,
    'track.disclaimerApple': ` El extracto de audio es el tema real (30 segundos), vía la búsqueda pública de Apple Music.`,
    'track.disclaimerGenerated': ` El extracto de audio se genera para la demo (tema aún no identificado con certeza en Spotify).`,
    'track.disclaimerTail': ` Los indicadores de DJ (reproducciones, países, ciudades, DJ Score, crecimiento) están simulados para esta demo — en producción vendrán de telemetría real de DJs.`,
    'genreSheet.combine': `Combinar géneros`,
    'genreSheet.apply': `Aplicar`,
    'paywall.perMonth': `/mes`,
    'paywall.orYearly': `o 39,99&nbsp;€/año — 3,33&nbsp;€/mes (-33%)`,
    'paywall.activate': `Activar PRO (demo)`,
    'paywall.later': `Más tarde`,
    'paywall.labelOffer': `Oferta Sello/Artista con analíticas avanzadas disponible bajo petición.`,
    'paywall.f1': `Top 100 completo`, 'paywall.f2': `Todos los géneros, países &amp; ciudades`, 'paywall.f3': `🚀 Próximos Hits`, 'paywall.f4': `Historial de 90 días`, 'paywall.f5': `Alertas ilimitadas`, 'paywall.f6': `Radar completo`, 'paywall.f7': `Estadísticas avanzadas`,
    'toast.addedToRadar': `Añadido a tu Radar 📡`,
    'toast.proActivated': `🎉 PRO DJ activado (demo) — ¡todo desbloqueado!`,
    'toast.profileCreated': `Perfil DJ creado ✅`,
    'toast.openingOn': `Abriendo en {p}…`,
    'toast.noPreview': `No hay extracto de audio real disponible para este tema`,
  },
  de: {
    'auth.tagline': `The Global DJ Music Intelligence Platform`,
    'auth.nameLabel': `Künstlername oder Alias`,
    'auth.namePlaceholder': `z. B. Kwesi Sol`,
    'auth.emailLabel': `E-Mail`,
    'auth.emailPlaceholder': `du@label.com`,
    'auth.signup': `Mein DJ-Konto erstellen`,
    'auth.guest': `Als Gast fortfahren`,
    'auth.disclaimer': `Mit der Fortsetzung trittst du der Referenzplattform bei, um zu wissen, was funktioniert, wo, und was als Nächstes durchstarten wird.`,
    'auth.langLabel': `Sprache`,
    'auth.passwordLabel': `Passwort`,
    'auth.passwordPlaceholder': `Mindestens 6 Zeichen`,
    'auth.login': `Anmelden`,
    'auth.loading': `Einen Moment…`,
    'auth.haveAccount': `Ich habe bereits ein Konto`,
    'auth.noAccount': `Konto erstellen`,
    'auth.errorMissing': `E-Mail und Passwort erforderlich`,
    'auth.errorInvalidCredentials': `Falsche E-Mail oder falsches Passwort`,
    'auth.errorEmailTaken': `Es existiert bereits ein Konto mit dieser E-Mail`,
    'auth.errorWeakPassword': `Das Passwort muss mindestens 6 Zeichen lang sein`,
    'auth.errorGeneric': `Etwas ist schiefgelaufen, versuch es erneut`,
    'auth.checkEmail': `Konto erstellt! Bestätige deine E-Mail und melde dich dann an.`,
    'auth.errorEmailNotConfirmed': `Bestätige zuerst deine E-Mail (Posteingang prüfen)`,
    'nav.top': `Top`,
    'nav.nextbig': `Next Big`,
    'nav.explore': `Entdecken`,
    'nav.radar': `Radar`,
    'nav.profile': `Profil`,
    'home.brandSmall': `MUSIC INTELLIGENCE`,
    'home.scopeWorld': `WELT`,
    'home.scopeCountry': `LAND`,
    'home.scopeCity': `STADT`,
    'home.periodToday': `HEUTE`,
    'home.period7d': `7 TAGE`,
    'home.period30d': `30 TAGE`,
    'home.chipAll': `ALLE`,
    'home.chipAfroHouse': `AFRO HOUSE`,
    'home.chipAfroTech': `AFRO TECH`,
    'home.chipHouse': `HOUSE`,
    'home.chipMelodic': `MELODIC`,
    'home.chipTechno': `TECHNO`,
    'home.chipMoreGenres': `+ Genres`,
    'home.trendingNow': `🔥 Im Trend`,
    'home.topGlobal': `GLOBALE TOP 100`,
    'home.topPrefix': `TOP`,
    'home.pro': `Pro ↗`,
    'home.unlockTop100': `🔓 Komplette Top 100 freischalten — PRO DJ`,
    'nextbig.title': `NEXT BIG TRACKS`,
    'nextbig.subtitle': `FRÜHERKENNUNG`,
    'nextbig.proOnlyTitle': `Nur für Pro-DJs`,
    'nextbig.proOnlyDesc': `Entdecke Tracks, die durchstarten, bevor sie zu weltweiten Hits werden.`,
    'nextbig.unlockPro': `Mit PRO freischalten`,
    'nextbig.empty': `Für diesen Filter gibt es derzeit keine aufstrebenden Tracks.`,
    'nextbig.days14': `in 14 Tagen`,
    'nextbig.djs': `DJs`,
    'nextbig.countries': `Länder`,
    'nextbig.adoptionNote': `💬 Dieser Track wird zunehmend stark von DJs gespielt.`,
    'explore.title': `WELTKARTE`,
    'explore.country': `LAND`,
    'explore.city': `STÄDTE`,
    'explore.selectZone': `Wähle eine Region`,
    'explore.activeScene': `Aktive Szene`,
    'radar.title': `MEIN RADAR`,
    'radar.alertsTab': `🔔 Meldungen`,
    'radar.empty': `Dein Radar ist leer.<br>Füge Tracks über ihre Detailseite hinzu, um ihre Entwicklung hier zu verfolgen. 📡`,
    'radar.followedGenres': `VERFOLGTE GENRES`,
    'radar.followedCities': `VERFOLGTE STÄDTE`,
    'radar.thisWeek': `diese Woche`,
    'profile.title': `PROFIL`,
    'profile.loginPrompt': `Melde dich an, um dein DJ-Profil zu erstellen.`,
    'profile.loginButton': `Anmelden / Konto erstellen`,
    'profile.createTitle': `MEIN DJ-PROFIL ERSTELLEN`,
    'profile.artistName': `Künstlername`,
    'profile.country': `Land`,
    'profile.city': `Stadt`,
    'profile.genresPlayed': `Gespielte Genres`,
    'profile.instagram': `Instagram`,
    'profile.soundcloud': `SoundCloud`,
    'profile.createButton': `Mein DJ-Profil erstellen`,
    'profile.titleProfile': `DJ-PROFIL`,
    'profile.proDj': `PRO DJ`,
    'profile.free': `FREE`,
    'profile.goProTitle': `⭐ Werde PRO DJ`,
    'profile.goProDesc': `Komplette Top 100, Next Big Tracks, 90-Tage-Verlauf, unbegrenzte Meldungen, komplettes My Radar.`,
    'profile.viewProOffer': `PRO-Angebot ansehen`,
    'profile.topPlayed': `Meistgespielte Tracks`,
    'profile.similarDjs': `DJs mit ähnlichem Stil`,
    'profile.noMatch': `Noch keine Übereinstimmung.`,
    'profile.admin': `🛠️ Admin-Dashboard`,
    'profile.logout': `Abmelden`,
    'profile.footer': `© 2026 Bena — Pulse Music.<br>Alle Rechte vorbehalten. Proprietäre Software — siehe LICENSE.txt.`,
    'profile.language': `Sprache`,
    'track.detailTitle': `TRACK-DETAILS`,
    'track.djScore': `DJ SCORE`,
    'track.days7': `über 7 Tage`,
    'track.djs': `DJs`,
    'track.countries': `Länder`,
    'track.cities': `Städte`,
    'track.clubsEvents': `Clubs / Events`,
    'track.dataUnavailable': `Daten nicht verfügbar`,
    'track.topLocations': `Top-Standorte`,
    'track.trendHistory': `Trendverlauf`,
    'track.days7chip': `7 TAGE`,
    'track.days30chip': `30 TAGE`,
    'track.days90chip': `90 TAGE`,
    'track.details': `Details`,
    'track.genre': `Genre`,
    'track.releaseDate': `Erscheinungsdatum`,
    'track.artist': `Künstler`,
    'track.label': `Label`,
    'track.ranking': `Ranking`,
    'track.audioRealBadge': `✓ Offizieller Audio-Ausschnitt — Spotify-Player`,
    'track.audioRealNote': `Echtes Audio, direkt von Spotifys Servern gestreamt (offizielles eingebettetes Widget) — für diesen Track manuell verifiziert.`,
    'track.audioRealBadgeYoutube': `✓ Echter Audio-Ausschnitt — YouTube-Player`,
    'track.audioRealNoteYoutube': `Echtes Audio, direkt von YouTube gestreamt (offizieller eingebetteter Player) — automatisch für diesen Track gefunden.`,
    'track.audioRealBadgeApple': `✓ Echter Audio-Ausschnitt — Apple Music`,
    'track.audioRealNoteApple': `30-Sekunden-Ausschnitt des echten Tracks, über die öffentliche Apple-Music-Suche.`,
    'track.audioGenNote': `Generierter Ausschnitt für die Demo (auf Spotify noch nicht mit Sicherheit gefunden) · an das Genre des Tracks angepasst`,
    'track.playExtract': `▶ Ausschnitt abspielen`,
    'track.pauseExtract': `⏸ Ausschnitt pausieren`,
    'track.listenFull': `Vollständig anhören`,
    'track.spotify': `Spotify`,
    'track.beatport': `Beatport`,
    'track.soundcloud': `SoundCloud`,
    'track.appleMusic': `Apple Music`,
    'track.teaser': `Teaser`,
    'track.deezer': `Deezer`,
    'track.youtubeMusic': `YouTube Music`,
    'track.disclaimerBase': `Track-Identität (Titel, Künstler, Label, Ranking, Cover) basiert auf der öffentlichen Beatport-Chart des Tages.`,
    'track.disclaimerSpotify': ` Der Audio-Ausschnitt ist der echte Track, gestreamt über den offiziellen Spotify-Player.`,
    'track.disclaimerYoutube': ` Der Audio-Ausschnitt ist der echte Track, gestreamt über den offiziellen YouTube-Player.`,
    'track.disclaimerApple': ` Der Audio-Ausschnitt ist der echte Track (30 Sekunden), über die öffentliche Apple-Music-Suche.`,
    'track.disclaimerGenerated': ` Der Audio-Ausschnitt wird für die Demo generiert (Track auf Spotify noch nicht mit Sicherheit identifiziert).`,
    'track.disclaimerTail': ` DJ-Kennzahlen (Plays, Länder, Städte, DJ Score, Wachstum) sind für diese Demo simuliert — in der Produktion stammen sie aus echter DJ-Telemetrie.`,
    'genreSheet.combine': `Genres kombinieren`,
    'genreSheet.apply': `Anwenden`,
    'paywall.perMonth': `/Monat`,
    'paywall.orYearly': `oder 39,99&nbsp;€/Jahr — also 3,33&nbsp;€/Monat (-33%)`,
    'paywall.activate': `PRO aktivieren (Demo)`,
    'paywall.later': `Später`,
    'paywall.labelOffer': `Label-/Künstlerangebot mit erweiterten Analytics auf Anfrage erhältlich.`,
    'paywall.f1': `Komplette Top 100`, 'paywall.f2': `Alle Genres, Länder &amp; Städte`, 'paywall.f3': `🚀 Next Big Tracks`, 'paywall.f4': `90-Tage-Verlauf`, 'paywall.f5': `Unbegrenzte Meldungen`, 'paywall.f6': `Komplettes My Radar`, 'paywall.f7': `Erweiterte Statistiken`,
    'toast.addedToRadar': `Zu deinem Radar hinzugefügt 📡`,
    'toast.proActivated': `🎉 PRO DJ aktiviert (Demo) — alles freigeschaltet!`,
    'toast.profileCreated': `DJ-Profil erstellt ✅`,
    'toast.openingOn': `Öffne bei {p}…`,
    'toast.noPreview': `Kein echter Audio-Ausschnitt für diesen Track verfügbar`,
  },
};
function tr(key){
  const d = I18N[state.lang] || I18N.fr;
  return (d[key] !== undefined ? d[key] : I18N.fr[key]) || key;
}
function tf(key, params){
  let s = tr(key);
  Object.keys(params||{}).forEach(k=> s = s.replace('{'+k+'}', params[k]));
  return s;
}
function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent = tr(el.dataset.i18n); });
}
function setLang(lang){
  state.lang = lang;
  applyI18n();
  renderAuthScreen();
  if(!document.getElementById('appScreen').classList.contains('hidden')) renderView();
  if(!document.getElementById('trackOverlay').classList.contains('hidden')) renderTrackOverlay();
}

const COUNTRY_I18N = {
  ES:{fr:'Espagne', en:'Spain', es:'España', de:'Spanien'},
  AE:{fr:'Émirats arabes unis', en:'United Arab Emirates', es:'Emiratos Árabes Unidos', de:'Vereinigte Arabische Emirate'},
  GR:{fr:'Grèce', en:'Greece', es:'Grecia', de:'Griechenland'},
  FR:{fr:'France', en:'France', es:'Francia', de:'Frankreich'},
  US:{fr:'États-Unis', en:'United States', es:'Estados Unidos', de:'USA'},
  GB:{fr:'Royaume-Uni', en:'United Kingdom', es:'Reino Unido', de:'Vereinigtes Königreich'},
  BR:{fr:'Brésil', en:'Brazil', es:'Brasil', de:'Brasilien'},
  ZA:{fr:'Afrique du Sud', en:'South Africa', es:'Sudáfrica', de:'Südafrika'},
  IT:{fr:'Italie', en:'Italy', es:'Italia', de:'Italien'},
  DE:{fr:'Allemagne', en:'Germany', es:'Alemania', de:'Deutschland'},
  PT:{fr:'Portugal', en:'Portugal', es:'Portugal', de:'Portugal'},
  MX:{fr:'Mexique', en:'Mexico', es:'México', de:'Mexiko'},
  MA:{fr:'Maroc', en:'Morocco', es:'Marruecos', de:'Marokko'},
  NL:{fr:'Pays-Bas', en:'Netherlands', es:'Países Bajos', de:'Niederlande'},
};
function cname(code){
  const names = COUNTRY_I18N[code];
  return (names && (names[state.lang] || names.fr)) || (countryByCode(code)||{}).name || code;
}
function platformQuery(t){
  // Strip parenthetical remix/version tags for a cleaner, more relevant search query.
  const cleanTitle = t.title.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  return (cleanTitle + ' ' + t.artist).trim();
}
function citiesFollowedLabel(n){
  const forms = {
    fr: n>1 ? `${n} villes suivies` : `${n} ville suivie`,
    en: n>1 ? `${n} cities tracked` : `${n} city tracked`,
    es: n>1 ? `${n} ciudades seguidas` : `${n} ciudad seguida`,
    de: `${n} verfolgte Städte`,
  };
  return forms[state.lang] || forms.fr;
}
function langSwitcherHTML(active, size){
  const sz = size||'normal';
  return `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">${LANGS.map(l=>`
    <div class="chip ${l.code===active?'active':''}" style="${sz==='sm'?'padding:5px 10px;font-size:10.5px;':''}" data-action="set-lang" data-lang="${l.code}">${l.flag} ${l.label}</div>
  `).join('')}</div>`;
}

/* ---------------------------- COVER RENDER --------------------------------
   No licensed artwork is available in this prototype (real label covers are
   copyrighted and there's no image API wired up), so each track gets a
   unique generative cover instead — layered gradients + a genre-specific
   visual motif, seeded by the track so it's stable and one-of-a-kind. */
function coverStyle(genreId, seed){
  const g = genreById(genreId);
  const rand = mulberry32(seed+777);
  const angle = Math.round(rand()*360);
  const gx = 12+Math.round(rand()*70), gy = 12+Math.round(rand()*70);
  const hue2 = Math.round((seed*53)%360);
  const accent = `hsla(${hue2},70%,52%,0.56)`;
  const grain = `repeating-radial-gradient(circle at 3px 3px, rgba(255,255,255,.05) 0px, rgba(255,255,255,.05) 1px, transparent 1.6px, transparent 7px)`;
  const glow = `radial-gradient(circle at ${gx}% ${gy}%, ${accent}, transparent 62%)`;
  const base = `linear-gradient(${angle}deg, ${g.color}f2 0%, #0a0a10 145%)`;

  let motif = '';
  if(genreId==='techno' || genreId==='minimal-deeptech'){
    // stark monochrome scanlines — hard, driving genres
    motif = `repeating-linear-gradient(${(angle+90)%360}deg, rgba(255,255,255,.08) 0px, rgba(255,255,255,.08) 1px, transparent 1px, transparent 5px), `;
  } else if(genreId==='indie-dance'){
    // retro synthwave horizon line
    motif = `linear-gradient(0deg, transparent 44%, rgba(255,255,255,.25) 45%, rgba(255,255,255,.25) 46%, transparent 47%), `;
  } else if(genreId==='tech-house'){
    // bold halftone dots
    motif = `radial-gradient(rgba(255,255,255,.16) 1.2px, transparent 1.3px), `;
  } else if(genreId==='afro-house'||genreId==='afro-tech'||genreId==='tribal-house'||genreId==='organic-house'){
    // warm organic glow, earthy tones
    motif = `radial-gradient(circle at ${100-gx}% ${100-gy}%, rgba(255,196,120,.32), transparent 58%), `;
  } else if(genreId==='melodic-house'||genreId==='melodic-techno'||genreId==='progressive-house'){
    // soft diagonal light streak — atmospheric genres
    motif = `linear-gradient(${(angle+35)%360}deg, transparent 40%, rgba(255,255,255,.14) 50%, transparent 60%), `;
  }
  const size = (genreId==='tech-house') ? 'background-size: 9px 9px, auto, auto, auto;' : '';
  return `background-image:${motif}${grain}, ${glow}, ${base}; ${size}`;
}
function coverInitials(title){
  return title.replace(/\(.*?\)/g,'').trim().split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
}
function coverHTML(t, big){
  const playing = state.playingId===t.id;
  // Real Beatport cover art is hotlinked from Beatport's own public CDN (the same
  // thumbnail URLs their site serves) — if it ever fails to load, the generative
  // artwork underneath shows through instead of a broken image.
  const img = t.coverUrl ? `<img src="${t.coverUrl}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;">` : '';
  // Badge visible AVANT même d'appuyer sur play quand on a un identifiant
  // vérifié (Spotify/YouTube, jamais deviné) — sinon seulement une fois
  // qu'Apple Music a confirmé un extrait (ça, ça ne se sait qu'après coup).
  const verified = !!(t.spotifyId || t.youtubeId);
  const spotifyBadge = (verified || t.itunesPreviewUrl) ? `<div style="position:absolute;top:4px;right:4px;width:16px;height:16px;border-radius:50%;background:#fc3d62;display:flex;align-items:center;justify-content:center;font-size:9px;box-shadow:0 0 0 2px rgba(0,0,0,.35);" title="${verified?'Morceau vérifié (Spotify/YouTube)':'Extrait audio réel disponible (Apple Music)'}">✓</div>` : '';
  return `<div class="cover-wrap">
    <div class="cover${big?' lg':''}" style="${coverStyle(t.genre, t.coverSeed)}position:relative;overflow:hidden;">${coverInitials(t.title)}${img}${spotifyBadge}</div>
    <button class="play-overlay${big?' lg':''}${playing?' playing':''}" data-action="toggle-play" data-id="${t.id}" aria-label="Écouter l'extrait">${playing?'⏸':'▶'}</button>
  </div>`;
}

/* ---------------------------- AUDIO PREVIEW ENGINE -------------------------
   No licensed audio is available in this prototype, so each track gets a short
   procedurally generated preview loop (seeded by the track) instead of silence
   or a fake "real" file — it lets the play/pause flow be demoed honestly. */
const GENRE_BPM = {'afro-house':122,'afro-tech':123,'house':124,'deep-house':121,'organic-house':120,'melodic-house':123,'melodic-techno':124,'tech-house':125,'progressive-house':122,'techno':130,'minimal-deeptech':127,'indie-dance':118,'tribal-house':120};
// Each genre gets its own instrumentation character (waveforms, filter, groove,
// percussion density, melodic vs. atmospheric) so the preview actually feels
// adapted to the track's genre instead of one generic loop for everything.
const GENRE_SOUND = {
  'afro-house':      {bassWave:'sine',     bassCutoff:620, padWave:'sine',     padGain:0.09, hatProb:0.85, percProb:0.55, kickDecay:0.16, swing:0.10, mode:'pad'},
  'afro-tech':        {bassWave:'sine',     bassCutoff:560, padWave:'sine',     padGain:0.07, hatProb:0.95, percProb:0.75, kickDecay:0.14, swing:0.12, mode:'pad'},
  'tribal-house':     {bassWave:'sine',     bassCutoff:600, padWave:'sine',     padGain:0.07, hatProb:0.9,  percProb:0.85, kickDecay:0.16, swing:0.14, mode:'pad'},
  'house':            {bassWave:'sawtooth', bassCutoff:520, padWave:'triangle', padGain:0.10, hatProb:0.75, percProb:0.15, kickDecay:0.17, swing:0.04, mode:'pad'},
  'deep-house':       {bassWave:'sine',     bassCutoff:420, padWave:'triangle', padGain:0.11, hatProb:0.55, percProb:0.10, kickDecay:0.19, swing:0.06, mode:'pad'},
  'organic-house':    {bassWave:'sine',     bassCutoff:380, padWave:'triangle', padGain:0.11, hatProb:0.40, percProb:0.10, kickDecay:0.20, swing:0.05, mode:'arp', arpWave:'triangle'},
  'melodic-house':    {bassWave:'sine',     bassCutoff:460, padWave:'triangle', padGain:0.12, hatProb:0.55, percProb:0.10, kickDecay:0.19, swing:0.03, mode:'arp', arpWave:'triangle'},
  'melodic-techno':   {bassWave:'sawtooth', bassCutoff:340, padWave:'sawtooth', padGain:0.10, hatProb:0.70, percProb:0.15, kickDecay:0.20, swing:0.02, mode:'arp', arpWave:'sawtooth'},
  'tech-house':       {bassWave:'sawtooth', bassCutoff:500, padWave:'triangle', padGain:0.06, hatProb:0.85, percProb:0.30, kickDecay:0.15, swing:0.09, mode:'pad'},
  'progressive-house':{bassWave:'sawtooth', bassCutoff:400, padWave:'sawtooth', padGain:0.11, hatProb:0.70, percProb:0.10, kickDecay:0.20, swing:0.02, mode:'arp', arpWave:'triangle'},
  'techno':           {bassWave:'square',   bassCutoff:300, padWave:'sawtooth', padGain:0.06, hatProb:0.95, percProb:0.20, kickDecay:0.22, swing:0.0,  mode:'pad'},
  'minimal-deeptech':  {bassWave:'square',   bassCutoff:260, padWave:'triangle', padGain:0.05, hatProb:0.80, percProb:0.35, kickDecay:0.14, swing:0.06, mode:'pad'},
  'indie-dance':      {bassWave:'square',   bassCutoff:700, padWave:'square',   padGain:0.07, hatProb:0.65, percProb:0.10, kickDecay:0.16, swing:0.0,  mode:'arp', arpWave:'square'},
};
// 4 demo profiles for real-city chart tracks (no genre data from Soundcharts to go
// on), built for MAXIMUM audible contrast rather than genre realism — different
// kick waveform/pitch (the loudest, most frequent sound in the loop, so it has to
// differ too, not just the background pad/bass), a wide BPM spread (98-132, not a
// tight 118-130 dance-music range), and pad vs. arp mode.
const DEMO_PROFILES = [
  { bpm:90,  kickWave:'sine',     kickFreqStart:120, kickFreqEnd:32, kickDecay:0.30, bassWave:'sine',     bassCutoff:320, padWave:'triangle', padGain:0.14, hatProb:0.22, percProb:0.05, swing:0.05, mode:'pad' },
  { bpm:138, kickWave:'square',   kickFreqStart:180, kickFreqEnd:62, kickDecay:0.10, bassWave:'square',   bassCutoff:260, padWave:'sawtooth', padGain:0.05, hatProb:0.97, percProb:0.20, swing:0.0,  mode:'pad' },
  { bpm:112, kickWave:'triangle', kickFreqStart:150, kickFreqEnd:48, kickDecay:0.20, bassWave:'sine',     bassCutoff:460, padWave:'triangle', padGain:0.11, hatProb:0.55, percProb:0.10, swing:0.03, mode:'arp', arpWave:'triangle' },
  { bpm:124, kickWave:'sawtooth', kickFreqStart:165, kickFreqEnd:55, kickDecay:0.13, bassWave:'sawtooth', bassCutoff:620, padWave:'sine',     padGain:0.07, hatProb:0.88, percProb:0.90, swing:0.16, mode:'pad' },
];
// Each profile now has its own, never-repeated kick waveform (sine / square /
// triangle / sawtooth) — the kick is the loudest, most frequent hit in the loop,
// so two profiles sharing a waveform there is what made them sound alike even
// with every other parameter varied. Also widened the BPM spread further.
const PREVIEW_MS = 24000;
let audioCtx = null, playTimer = null, progressTimer = null, playMasterGain = null;

function ensureAudioCtx(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  return audioCtx;
}
function seededScaleFreqs(seed){
  const root = 26 + (seed%12); // semitone offset, kept in a low/mid register
  const steps = [0,3,5,7,10,12,15,19]; // minor-pentatonic-ish, generally pleasant
  return steps.map(s => 440*Math.pow(2, (root+s-57)/12));
}
function playTrack(t){
  stopPlayback();
  let ctx;
  try{ ctx = ensureAudioCtx(); if(ctx.state==='suspended') ctx.resume(); }
  catch(e){ toast('Lecture audio indisponible sur ce navigateur.'); return; }

  const prof = t.demoProfile || GENRE_SOUND[t.genre] || GENRE_SOUND['house'];
  // ±12% tempo jitter seeded per track, so even two tracks sharing a profile
  // don't play at the exact same speed.
  const bpmJitter = 0.88 + mulberry32((t.coverSeed||0)+7)()*0.24;
  const bpm = Math.round((t.demoBpm || GENRE_BPM[t.genre] || 123) * bpmJitter);
  const stepDur = 60/bpm/4;
  const freqs = seededScaleFreqs(t.coverSeed);
  const rnd = mulberry32(t.coverSeed+1);
  const bassPattern = Array.from({length:16}, ()=> rnd()<0.55?1:0);
  const padChord = [freqs[0]/2, freqs[2]/2, freqs[4]/2];
  const arpNotes = [freqs[0], freqs[2], freqs[4], freqs[3], freqs[5], freqs[2], freqs[4], freqs[1]];

  const master = ctx.createGain();
  master.gain.value = 0.0001;
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -3;
  limiter.knee.value = 6;
  limiter.ratio.value = 4;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.25;
  master.connect(limiter);
  limiter.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(1.4, ctx.currentTime+0.15);
  playMasterGain = master;

  function kick(when){
    const o=ctx.createOscillator(), g=ctx.createGain();
    // The kick is the loudest, most frequent sound in the loop (hits every beat) —
    // it has to vary by profile too, or two different-sounding loops still land on
    // an identical-sounding thump and the whole thing is perceived as "the same".
    o.type=prof.kickWave||'sine';
    o.frequency.setValueAtTime(prof.kickFreqStart||150,when);
    o.frequency.exponentialRampToValueAtTime(prof.kickFreqEnd||45,when+0.09);
    g.gain.setValueAtTime(0.9,when); g.gain.exponentialRampToValueAtTime(0.001,when+prof.kickDecay);
    o.connect(g); g.connect(master); o.start(when); o.stop(when+prof.kickDecay+0.03);
  }
  function hat(when, vol){
    const size = Math.floor(ctx.sampleRate*0.03);
    const buf = ctx.createBuffer(1,size,ctx.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<size;i++) d[i]=(Math.random()*2-1)*(1-i/size);
    const src=ctx.createBufferSource(); src.buffer=buf;
    const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=6500;
    const g=ctx.createGain(); g.gain.value=vol;
    src.connect(hp); hp.connect(g); g.connect(master); src.start(when);
  }
  function perc(when, freq){
    // short percussive blip (conga/click) — used by afro/tribal/tech-house profiles
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.setValueAtTime(freq,when); o.frequency.exponentialRampToValueAtTime(freq*0.6,when+0.05);
    g.gain.setValueAtTime(0.28,when); g.gain.exponentialRampToValueAtTime(0.001,when+0.07);
    o.connect(g); g.connect(master); o.start(when); o.stop(when+0.08);
  }
  function bass(when, freq){
    const o=ctx.createOscillator(), g=ctx.createGain(), f=ctx.createBiquadFilter();
    o.type=prof.bassWave; o.frequency.value=freq;
    f.type='lowpass'; f.frequency.value=prof.bassCutoff;
    g.gain.setValueAtTime(0.0001,when); g.gain.linearRampToValueAtTime(0.42,when+0.02); g.gain.exponentialRampToValueAtTime(0.001,when+stepDur*1.8);
    o.connect(f); f.connect(g); g.connect(master); o.start(when); o.stop(when+stepDur*2);
  }
  function pad(when){
    padChord.forEach(f=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type=prof.padWave; o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,when); g.gain.linearRampToValueAtTime(prof.padGain,when+1.2); g.gain.linearRampToValueAtTime(0.0001,when+7.8);
      o.connect(g); g.connect(master); o.start(when); o.stop(when+8);
    });
  }
  function arpNote(when, freq, len){
    const o=ctx.createOscillator(), g=ctx.createGain(), f=ctx.createBiquadFilter();
    o.type=prof.arpWave||'triangle'; o.frequency.value=freq*2;
    f.type='lowpass'; f.frequency.value=2400;
    g.gain.setValueAtTime(0.0001,when); g.gain.linearRampToValueAtTime(prof.padGain*0.9,when+0.02); g.gain.exponentialRampToValueAtTime(0.001,when+len);
    o.connect(f); f.connect(g); g.connect(master); o.start(when); o.stop(when+len+0.02);
  }

  state.playingId = t.id;
  state.playingReal = false;
  state.playStartedAt = Date.now();
  updatePlayerUI();

  let step=0, nextNoteTime=ctx.currentTime+0.05, lastPadAt=-100;
  playTimer = setInterval(()=>{
    while(nextNoteTime < ctx.currentTime + 0.15){
      const s = step%16;
      const swung = nextNoteTime + (s%2===1 ? prof.swing*stepDur : 0);
      if(s%4===0) kick(nextNoteTime);
      if(s%2===1 && rnd()<prof.hatProb) hat(swung, s%4===3?0.22:0.12);
      if(s%2===0 && rnd()<prof.percProb) perc(swung, 300+((step*53)%260));
      if(bassPattern[s]) bass(swung, freqs[(step>>1)%freqs.length]);
      if(prof.mode==='pad'){
        if(s===0 && nextNoteTime-lastPadAt>7){ pad(nextNoteTime); lastPadAt=nextNoteTime; }
      } else {
        if(s%2===0){ arpNote(swung, arpNotes[(step>>1)%arpNotes.length], stepDur*1.7); }
        if(s===0 && nextNoteTime-lastPadAt>7){ pad(nextNoteTime); lastPadAt=nextNoteTime; } // sparse low pad bed under the arp
      }
      nextNoteTime += stepDur; step++;
    }
    if(Date.now()-state.playStartedAt > PREVIEW_MS) stopPlayback();
  }, 40);
  progressTimer = setInterval(updateProgressUI, 200);
}
function stopPlayback(){
  if(playTimer){ clearInterval(playTimer); playTimer=null; }
  if(progressTimer){ clearInterval(progressTimer); progressTimer=null; }
  if(playMasterGain && audioCtx){
    try{
      const now = audioCtx.currentTime;
      playMasterGain.gain.cancelScheduledValues(now);
      playMasterGain.gain.setValueAtTime(playMasterGain.gain.value, now);
      playMasterGain.gain.linearRampToValueAtTime(0.0001, now+0.08);
    }catch(e){}
    playMasterGain=null;
  }
  const itunesEl = document.getElementById('itunesAudioEl');
  if(itunesEl){ try{ itunesEl.pause(); }catch(e){} }
  if(spotifyController){ try{ spotifyController.pause(); }catch(e){} }
  state.playingId=null;
  state.playingReal=false;
  state.playingItunes=false;
  state.itunesLoading=false;
  state.playingEmbed=null;
  updatePlayerUI();
}
// Apple's free, keyless iTunes Search API — used after YouTube to play a
// real 30s preview of the actual track instead of the generated loop. No
// daily quota, so this is resolved on demand right when the listener taps
// play, not pre-fetched in bulk. Results are cached per track for the
// session so a track is never searched twice. Per Apple's terms, a found
// preview is always shown next to a link to open the track in Apple Music
// (see renderMiniPlayer / track overlay).
const itunesCache = {};
// A silent ~0s WAV, used only to "prime" the shared <audio> element below —
// see ensureItunesAudioEl for why.
const SILENT_AUDIO_DATA_URI = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
// iOS Safari only allows a *new* <audio> element's play() to succeed when the
// call happens synchronously inside the tap's own event handler. The real
// preview URL for an unseen track isn't known until a network round-trip
// finishes, so a freshly-created element whose play() is called after that
// await gets silently blocked on iPhone — this is exactly why the same track
// could play for real on desktop (looser autoplay policy) but silently fall
// back to the generated loop on a phone. The fix is a single <audio> element,
// created once and kept in the DOM for the rest of the session (never
// recreated via innerHTML), "primed" with a near-silent clip synchronously
// on every tap — once an element has been allowed to play via a genuine user
// gesture, WebKit keeps allowing programmatic play() calls on that SAME
// element later, even from async code with no gesture of its own.
let itunesAudioEl = null;
function ensureItunesAudioEl(){
  if(itunesAudioEl) return itunesAudioEl;
  itunesAudioEl = document.createElement('audio');
  itunesAudioEl.id = 'itunesAudioEl';
  itunesAudioEl.style.display = 'none';
  itunesAudioEl.addEventListener('ended', stopPlayback);
  document.body.appendChild(itunesAudioEl);
  return itunesAudioEl;
}
// ------------------------------------------------------------------------
// Lecture Spotify "cachée" — pour que l'appli garde sa propre identité et ne
// montre jamais le lecteur/logo Spotify, on pilote un contrôleur officiel
// (API iFrame de Spotify, gratuite, sans connexion) depuis un cadre quasi
// invisible plutôt que d'afficher leur widget. IMPORTANT : jamais
// display:none sur ce cadre — la plupart des navigateurs mettent en pause
// tout contenu intégré en display:none, on le réduit donc à 1px et une
// opacité quasi nulle à la place, ce qui le laisse "affiché" techniquement.
let spotifyController = null;
let spotifyControllerEl = null;
let spotifyControllerReadyPromise = null;
let spotifyCurrentUri = null;
function ensureSpotifyControllerHost(){
  if(spotifyControllerEl) return spotifyControllerEl;
  spotifyControllerEl = document.createElement('div');
  spotifyControllerEl.id = 'spotifyEmbedHost';
  spotifyControllerEl.style.cssText = 'position:fixed; width:1px; height:1px; opacity:0.01; overflow:hidden; pointer-events:none; left:-9999px; bottom:0;';
  document.body.appendChild(spotifyControllerEl);
  return spotifyControllerEl;
}
function loadSpotifyController(firstUri){
  if(spotifyControllerReadyPromise) return spotifyControllerReadyPromise;
  spotifyControllerReadyPromise = new Promise((resolve)=>{
    // L'API peut être lente à charger (ou bloquée par le réseau) — on
    // n'attend pas indéfiniment, sinon le bouton play resterait figé en
    // "chargement" pour rien ; le code appelant bascule alors sur le widget
    // visible classique plutôt que de laisser l'utilisateur sans rien.
    const giveUp = setTimeout(()=>resolve(null), 5000);
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      try{
        const host = ensureSpotifyControllerHost();
        IFrameAPI.createController(host, { uri: firstUri, width:'1', height:'1' }, (controller) => {
          clearTimeout(giveUp);
          spotifyController = controller;
          spotifyCurrentUri = firstUri;
          resolve(controller);
        });
      }catch(e){ clearTimeout(giveUp); resolve(null); }
    };
    if(!document.getElementById('spotifyIframeApiScript')){
      const s = document.createElement('script');
      s.id = 'spotifyIframeApiScript';
      s.src = 'https://open.spotify.com/embed/iframe-api/v1';
      s.async = true;
      s.onerror = () => resolve(null);
      document.body.appendChild(s);
    }
  });
  return spotifyControllerReadyPromise;
}
function startSpotifyHiddenPlayback(controller, uri, id){
  let confirmed = false;
  const onUpdate = (e) => {
    if(e && !e.isPaused){
      confirmed = true;
      if(state.playingId===id){ state.playingReal = true; updatePlayerUI(); }
    }
  };
  try{ controller.addListener('playback_update', onUpdate); }catch(e){}
  const doPlay = () => { try{ controller.play(); }catch(e){} };
  if(spotifyCurrentUri !== uri){
    spotifyCurrentUri = uri;
    try{ controller.loadUri(uri); }catch(e){}
    setTimeout(doPlay, 250); // laisse le temps au chargement du nouvel URI avant de lancer la lecture
  } else {
    doPlay();
  }
  // Si après un délai raisonnable aucun évènement "ça joue vraiment" n'est
  // arrivé (autoplay bloqué par le navigateur, typiquement iPhone), on
  // bascule sur le widget Spotify visible classique — l'utilisateur appuie
  // alors une fois dans le cadre qui apparaît, exactement comme avant,
  // plutôt que de rester sur un bouton play qui ne fait rien.
  setTimeout(()=>{
    if(!confirmed && state.playingId===id && state.playingEmbed==='spotify-hidden'){
      state.playingEmbed = 'spotify';
      updatePlayerUI();
    }
  }, 2500);
}
// {ok:true, hit:obj|null} on a completed request (hit is null = Apple genuinely
// has nothing for this query) — {ok:false} on a network error/timeout, which
// is NOT the same thing and must never be cached as a permanent "no match"
// (see lookupItunesPreview below — this is what was silently conflating a
// one-off mobile network hiccup with a confirmed absence on Apple Music).
// Bug trouvé le 2026-10-03 (soir) : l'appel iTunes ne récupérait QUE le tout
// premier résultat (limit=1) et le jouait sans jamais vérifier qu'il
// correspondait réellement au titre/artiste cherché — le classement de
// pertinence d'Apple se trompe souvent sur des titres de club courts/génériques
// ou des crédits DJ multiples, donc l'extrait joué pouvait être un morceau
// complètement différent de celui affiché ("les musiques ne correspondent
// pas"). Corrigé en récupérant plusieurs candidats (limit=5) et en ne gardant
// que celui dont le titre ET l'artiste ressemblent vraiment à ce qu'on
// cherchait (voir itunesHitMatches) ; si aucun des 5 ne correspond vraiment,
// on considère qu'Apple n'a rien (on passe à la tentative suivante, puis à
// l'extrait généré) plutôt que de jouer un morceau au hasard.
function normText(s){
  return (s||'').toString().normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
}
function sigWords(s, minLen){ minLen = minLen || 3; return normText(s).split(' ').filter(w=>w.length>=minLen); }
function itunesHitMatches(queryTitle, queryArtist, hitTrackName, hitArtistName){
  const qTitleWords = sigWords(queryTitle);
  if(!qTitleWords.length) return false;
  const hTitle = normText(hitTrackName);
  const titleHits = qTitleWords.filter(w=>hTitle.includes(w)).length;
  const titleRatio = titleHits / qTitleWords.length;
  // Crédits DJ multiples côté requête ("HUGEL, SOLTO (FR)") : on exige qu'AU
  // MOINS UN des artistes cités apparaisse dans l'artiste du résultat Apple
  // — pas forcément le premier, Apple ne crédite pas toujours dans le même
  // ordre que Beatport, ni la liste complète. On enlève aussi les tags style
  // "(FR)"/"(NL)" qui ne font pas partie du vrai nom d'artiste.
  // minLen=2 (pas 3) : beaucoup de pseudos DJ sont courts ou numériques
  // ("19:26", "ANOTR") — testé et corrigé après avoir trouvé qu'un artiste
  // purement numérique passait inaperçu et laissait n'importe quel résultat
  // du même titre générique passer sans vérification d'artiste.
  const artistTokens = (queryArtist||'').split(/[,&]/)
    .map(a=>a.replace(/\s*[\(\[][^\)\]]*[\)\]]\s*/g,'').trim())
    .filter(Boolean);
  const artistWords = artistTokens.length ? artistTokens.flatMap(a=>sigWords(a,2)) : sigWords(queryArtist||'',2);
  const hArtist = normText(hitArtistName);
  const artistOk = artistWords.length===0 || artistWords.some(w=>hArtist.includes(w));
  return titleRatio >= 0.6 && artistOk;
}
async function itunesSearchOnce(term){
  // Mobile connections are more prone to a slow/stalled request than desktop
  // wifi — cap each attempt at 6s so a bad network degrades to the next
  // fallback (a cleaner search term, then the generated preview) quickly
  // instead of leaving the listener staring at a stuck "loading" state.
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(()=>controller.abort(), 6000) : null;
  try{
    const q = encodeURIComponent(term);
    const res = await fetch(`https://itunes.apple.com/search?term=${q}&media=music&entity=song&limit=10`, controller ? {signal: controller.signal} : {});
    if(!res.ok) return {ok:false};
    const data = await res.json();
    const results = (data && Array.isArray(data.results)) ? data.results : [];
    return {ok:true, results};
  }catch(e){ return {ok:false}; /* network/timeout/CORS error — not a confirmed absence */ }
  finally{ if(timer) clearTimeout(timer); }
}
async function lookupItunesPreview(t){
  const key = t.id;
  if(itunesCache[key] !== undefined) return itunesCache[key];
  // Many catalogue titles carry DJ remix/edit suffixes — e.g. "(Dario Nunez &
  // Juany Bravo Extended Remix)" — and a full artist credits list — e.g. "DJ
  // Care, MikroBeats, Aaron Sevilla" — that the exact beatport-style string
  // doesn't always match verbatim in Apple's catalogue, even when the song
  // itself is there. Try the exact title+artist first, then a cleaned-up
  // title with just the lead artist, then the cleaned title alone — each
  // extra attempt only runs if the previous one found nothing, so a track
  // that matches on the first try costs exactly one request. The first,
  // highest-value attempt gets one retry if it fails outright (vs. simply
  // finding no result) — on a flaky mobile connection that one retry is
  // often the difference between a real preview and the generated fallback.
  // Enlève TOUS les groupes "(...)" / "[...]" en fin de titre, pas juste le
  // dernier — "Jamaican (Bam Bam) (Extended Mix)" avait avant seulement
  // "(Extended Mix)" retiré ; on boucle maintenant pour aussi retirer
  // "(Bam Bam)" si besoin. Enlève aussi un suffixe "- Extended Mix" / "-
  // Radio Edit" etc. qui n'est pas entre parenthèses chez certains labels.
  let cleanTitle = t.title;
  let prevTitle;
  do{
    prevTitle = cleanTitle;
    cleanTitle = cleanTitle.replace(/\s*[\(\[][^\)\]]*[\)\]]\s*$/,'').trim();
  }while(cleanTitle && cleanTitle !== prevTitle);
  cleanTitle = cleanTitle.replace(/\s*-\s*(extended|radio|original|club|vip|remix|edit|mix)\b.*$/i,'').trim();
  if(!cleanTitle) cleanTitle = t.title;
  const artistList = (t.artist||'').split(/[,&]/).map(a=>a.replace(/\s*[\(\[][^\)\]]*[\)\]]\s*/g,'').trim()).filter(Boolean);
  const leadArtist = artistList[0] || (t.artist||'').trim();
  const attempts = [
    `${t.title} ${t.artist}`,
    cleanTitle !== t.title || leadArtist !== t.artist ? `${cleanTitle} ${leadArtist}` : null,
    cleanTitle !== t.title ? cleanTitle : null,
    // Beatport cite parfois les artistes dans un ordre différent de celui
    // retenu par Apple : on retente avec chaque autre artiste crédité avant
    // de renoncer (plafonné à 3 au total pour ne pas multiplier les requêtes
    // sur un morceau à 6 featurings).
    ...artistList.slice(1,3).map(a => `${cleanTitle} ${a}`),
  ].filter(Boolean);
  let hit = null, anyFailed = false;
  for(let i=0;i<attempts.length;i++){
    let r = await itunesSearchOnce(attempts[i]);
    if(!r.ok && i===0) r = await itunesSearchOnce(attempts[i]); // one retry, exact query only
    if(!r.ok){ anyFailed = true; continue; }
    const match = (r.results||[]).find(res => res.previewUrl && itunesHitMatches(t.title, t.artist, res.trackName, res.artistName));
    if(match){ hit = { previewUrl: match.previewUrl, trackViewUrl: match.trackViewUrl || null }; break; }
  }
  if(hit){ itunesCache[key] = hit; return hit; }
  if(anyFailed) return null; // transient failure — leave uncached so the next tap retries
  itunesCache[key] = null; // every attempt completed and genuinely found nothing — a real, cacheable negative
  return null;
}
async function togglePlay(id){
  const t = TRACKS.find(x=>x.id===id) || realTracksCache[id];
  if(!t) return;
  if(state.playingId===id){ stopPlayback(); return; }
  // Priority order:
  //  1. An iTunes preview already resolved earlier this session for THIS
  //     track — smoothest (single tap, no embed) and already verified, so
  //     reuse it directly rather than re-opening an embed.
  //  2. A verified identifier (t.spotifyId for the Monde/Pays catalogue,
  //     t.youtubeId for Ville tracks synced from Soundcharts) — these were
  //     pinned to the EXACT title/artist by hand/at sync time, not guessed
  //     from text, so unlike the iTunes search below there is zero risk of
  //     landing on the wrong song. We skip the iTunes guess entirely for
  //     these and open the real embed instead — it may need one extra tap
  //     inside the embed itself on iPhone (cross-origin autoplay is blocked
  //     there even with `allow="autoplay"`, a WebKit policy, not a bug on
  //     our side), but it is always audibly the right track.
  //  3. iTunes Search API text-match fallback for everything else.
  //  4. The generated placeholder loop, clearly labelled, as a last resort.
  if(t.itunesPreviewUrl){
    stopPlayback();
    state.playingId = id;
    state.playingItunes = true;
    updatePlayerUI();
    const el = ensureItunesAudioEl();
    el.src = t.itunesPreviewUrl;
    el.play().catch(()=>{});
    return;
  }
  if(t.spotifyId){
    // Lecture pilotée en coulisses via l'API Spotify (contrôleur caché,
    // jamais leur lecteur/logo affiché) — notre propre mini-player sert
    // d'interface. Si l'auto-lecture ne démarre vraiment pas (politique
    // navigateur sur iPhone notamment), bascule automatiquement sur le
    // widget Spotify visible classique après un court délai, pour ne
    // jamais laisser un bouton play qui ne fait rien.
    stopPlayback();
    state.playingId = id;
    state.playingEmbed = 'spotify-hidden';
    state.itunesLoading = true;
    updatePlayerUI();
    const uri = 'spotify:track:'+t.spotifyId;
    const controller = await loadSpotifyController(uri);
    if(state.playingId !== id) return; // l'auditeur est passé à autre chose entretemps
    if(!controller){
      state.itunesLoading = false;
      state.playingEmbed = 'spotify';
      updatePlayerUI();
      return;
    }
    state.itunesLoading = false;
    updatePlayerUI();
    startSpotifyHiddenPlayback(controller, uri, id);
    return;
  }
  if(t.youtubeId){
    stopPlayback();
    state.playingId = id;
    state.playingEmbed = 'youtube';
    updatePlayerUI();
    return;
  }
  if(t.itunesChecked){
    // Already looked up earlier this session, no iTunes match — go straight
    // to the generated preview, clearly labelled "extrait démo" in the mini
    // player (never claims to be the real recording). The actual dishonest
    // part was never "something plays" — it was Ville showing a fabricated
    // genre next to it. That's fixed at the source now (no genre label is
    // ever shown/filtered for a real city track), so it's safe for tapping
    // play to always do something again instead of going silent.
    playTrack(t);
    return;
  }
  // Not checked yet: try the real 30s Apple Music preview first. Prime the
  // shared <audio> element with this exact tap's user gesture BEFORE the
  // network lookup below — see ensureItunesAudioEl for why this is what
  // makes the real preview actually audible on an iPhone, not just found.
  stopPlayback();
  state.playingId = id;
  state.itunesLoading = true;
  updatePlayerUI();
  const el = ensureItunesAudioEl();
  try{ el.src = SILENT_AUDIO_DATA_URI; el.play().catch(()=>{}); }catch(e){ /* priming is best-effort, fire-and-forget: some phones never settle this promise, and awaiting it was blocking ALL playback */ }
  const hit = await lookupItunesPreview(t);
  // Only lock this track to the generated preview for the rest of the
  // session once Apple's answer is a confirmed negative (itunesCache has an
  // entry for it). A network failure leaves itunesCache unset on purpose —
  // t.itunesChecked stays false too, so the next tap gets a fresh attempt
  // instead of being stuck on the generic loop because of a one-off hiccup.
  if(itunesCache[t.id] !== undefined) t.itunesChecked = true;
  if(state.playingId !== id) return; // listener moved on during the lookup
  state.itunesLoading = false;
  if(hit && hit.previewUrl){
    t.itunesPreviewUrl = hit.previewUrl;
    t.itunesTrackUrl = hit.trackViewUrl;
    state.playingItunes = true;
    updatePlayerUI();
    el.src = hit.previewUrl;
    el.play().catch(()=>{});
  } else {
    state.playingId = null;
    playTrack(t);
  }
}
function updateProgressUI(){
  if(!state.playingId) return;
  const pct = clamp(((Date.now()-state.playStartedAt)/PREVIEW_MS)*100, 0, 100);
  const el = document.getElementById('mpProgressFill');
  if(el) el.style.width = pct+'%';
}
function updatePlayerUI(){
  const mp = document.getElementById('miniPlayer');
  if(mp) mp.innerHTML = renderMiniPlayer();
  document.querySelectorAll('.play-overlay').forEach(btn=>{
    const playing = btn.dataset.id===state.playingId;
    btn.classList.toggle('playing', playing);
    btn.textContent = playing ? '⏸' : '▶';
  });
  document.querySelectorAll('.big-play-btn').forEach(btn=>{
    const playing = btn.dataset.id===state.playingId;
    btn.textContent = playing ? "⏸ Pause l'extrait" : "▶ Écouter l'extrait";
  });
}
function renderMiniPlayer(){
  if(!state.playingId) return '';
  const t = TRACKS.find(x=>x.id===state.playingId) || realTracksCache[state.playingId];
  if(!t) return '';
  if(state.playingEmbed==='spotify-hidden' && t.spotifyId){
    // Lecture Spotify pilotée en coulisses — jamais de logo/widget Spotify
    // affiché, barre dans le style maison comme pour Apple Music. Morceau
    // vérifié (pas deviné), donc pas de badge "extrait démo".
    const g2 = genreById(t.genre);
    return `
    <div class="mini-player mini-player-spotify">
      <div class="cover" style="width:34px;height:34px;border-radius:9px;font-size:11px;position:relative;overflow:hidden;${coverStyle(t.genre,t.coverSeed)}">${coverInitials(t.title)}${t.coverUrl?`<img src="${t.coverUrl}" alt="" referrerpolicy="no-referrer" onerror="this.style.display='none'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`:''}</div>
      <div class="mp-info">
        <div class="mp-title">${esc(t.title)}</div>
        <div class="mp-artist">${esc(t.artist)}${t.isRealCity?'':` · <span style="color:${g2.color};">${g2.name}</span>`} · extrait vérifié</div>
      </div>
      <button data-action="toggle-play" data-id="${t.id}">⏸</button>
      <button data-action="mini-player-stop" title="Arrêter">✕</button>
    </div>`;
  }
  if(state.playingEmbed==='spotify' && t.spotifyId){
    // Lecteur Spotify vérifié — jamais deviné, toujours le bon morceau. Sur
    // iPhone, le tap de départ ne suffit pas toujours à lancer le son tout
    // seul (restriction navigateur sur les iframes d'un autre site) : le
    // bouton play DANS l'encadré ci-dessous le fait à coup sûr.
    return `
    <div class="mini-player mini-player-embed">
      <div class="mp-embed-head">
        <div class="mp-title">${esc(t.title)}</div>
        <button data-action="mini-player-stop" title="Arrêter">✕</button>
      </div>
      <iframe style="border-radius:12px;" src="https://open.spotify.com/embed/track/${t.spotifyId}?utm_source=app&autoplay=1" width="100%" height="152" frameborder="0" allowfullscreen="" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify — ${esc(t.title)}"></iframe>
      <div style="font-size:10px;color:var(--text-muted);text-align:center;margin-top:4px;">Si le son ne démarre pas tout seul, appuie sur ▶ dans le cadre ci-dessus — morceau vérifié, jamais un extrait généré.</div>
    </div>`;
  }
  if(state.playingEmbed==='youtube' && t.youtubeId){
    return `
    <div class="mini-player mini-player-embed">
      <div class="mp-embed-head">
        <div class="mp-title">${esc(t.title)}</div>
        <button data-action="mini-player-stop" title="Arrêter">✕</button>
      </div>
      <iframe style="border-radius:12px;" src="https://www.youtube.com/embed/${t.youtubeId}?autoplay=1&playsinline=1" width="100%" height="152" frameborder="0" allowfullscreen="" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="YouTube — ${esc(t.title)}"></iframe>
      <div style="font-size:10px;color:var(--text-muted);text-align:center;margin-top:4px;">Si le son ne démarre pas tout seul, appuie sur ▶ dans le cadre ci-dessus — morceau vérifié, jamais un extrait généré.</div>
    </div>`;
  }
  if(state.itunesLoading){
    // Briefly shown while the on-demand Apple Music lookup is in flight
    // (usually well under a second).
    return `
    <div class="mini-player">
      <div class="mp-info"><div class="mp-title">Recherche d'un extrait réel…</div></div>
      <button data-action="mini-player-stop" title="Arrêter">✕</button>
    </div>`;
  }
  if(state.playingItunes && t.itunesPreviewUrl){
    // Real 30s preview found via Apple's iTunes Search API — played through
    // the shared, persistent <audio> element (see ensureItunesAudioEl; it is
    // NOT re-emitted here — recreating it on every render is exactly what
    // broke autoplay permission on iOS). Per Apple's terms this preview must
    // sit next to a link to open the track in Apple Music, provided below.
    const g2 = genreById(t.genre);
    return `
    <div class="mini-player mini-player-spotify">
      <div class="cover" style="width:34px;height:34px;border-radius:9px;font-size:11px;position:relative;overflow:hidden;${coverStyle(t.genre,t.coverSeed)}">${coverInitials(t.title)}${t.coverUrl?`<img src="${t.coverUrl}" alt="" referrerpolicy="no-referrer" onerror="this.style.display='none'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`:''}</div>
      <div class="mp-info">
        <div class="mp-title">${esc(t.title)}</div>
        <div class="mp-artist">${esc(t.artist)}${t.isRealCity?'':` · <span style="color:${g2.color};">${g2.name}</span>`} · extrait réel Apple Music</div>
      </div>
      ${t.itunesTrackUrl ? `<a href="${t.itunesTrackUrl}" target="_blank" rel="noopener" title="Ouvrir dans Apple Music" style="font-size:15px;flex:0 0 auto;">🎵</a>` : ''}
      <button data-action="toggle-play" data-id="${t.id}">⏸</button>
      <button data-action="mini-player-stop" title="Arrêter" style="flex:0 0 auto;">✕</button>
    </div>`;
  }
  const g = genreById(t.genre);
  return `
  <div class="mini-player">
    <div class="cover" style="width:34px;height:34px;border-radius:9px;font-size:11px;position:relative;overflow:hidden;${coverStyle(t.genre,t.coverSeed)}">${coverInitials(t.title)}${t.coverUrl?`<img src="${t.coverUrl}" alt="" referrerpolicy="no-referrer" onerror="this.style.display='none'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`:''}</div>
    <div class="mp-info">
      <div class="mp-title">${esc(t.title)}</div>
      <div class="mp-artist">${esc(t.artist)}${t.isRealCity?'':` · <span style="color:${g.color};">${g.name}</span>`} · extrait démo</div>
      <div class="mp-progress"><div id="mpProgressFill" style="width:0%;"></div></div>
    </div>
    <button data-action="toggle-play" data-id="${t.id}">⏸</button>
    <button data-action="mini-player-stop" title="Arrêter">✕</button>
  </div>`;
}

/* ---------------------------- TOAST --------------------------------------- */
function toast(msg){
  const c = document.getElementById('toast-container');
  const d = document.createElement('div');
  d.className='toast'; d.textContent=msg;
  c.appendChild(d);
  setTimeout(()=>{ d.style.opacity='0'; d.style.transition='opacity .3s'; setTimeout(()=>d.remove(),300); }, 2200);
}

/* ---------------------------- GENRE FILTER LOGIC --------------------------- */
function trackMatchesGenreFilter(t){
  if(state.genreFilters.size===0) return true;
  return state.genreFilters.has(t.genre);
}
function setQuickGenre(key){
  state.genreFilters = new Set();
  if(key==='all'){ /* empty = all */ }
  else if(key==='melodic'){ state.genreFilters.add('melodic-house'); state.genreFilters.add('melodic-techno'); }
  else if(key==='techno'){ state.genreFilters.add('techno'); }
  else if(key==='afro-house'){ state.genreFilters.add('afro-house'); }
  else if(key==='afro-tech'){ state.genreFilters.add('afro-tech'); }
  else if(key==='house'){ state.genreFilters.add('house'); }
  renderView();
}
function quickGenreActive(key){
  const s = state.genreFilters;
  if(key==='all') return s.size===0;
  if(key==='melodic') return s.size===2 && s.has('melodic-house') && s.has('melodic-techno');
  if(key==='techno') return s.size===1 && s.has('techno');
  if(key==='afro-house') return s.size===1 && s.has('afro-house');
  if(key==='afro-tech') return s.size===1 && s.has('afro-tech');
  if(key==='house') return s.size===1 && s.has('house');
  return false;
}

/* ============================================================================
   RENDER: ROOT DISPATCH
   ============================================================================ */
function renderView(){
  document.querySelectorAll('.nav-btn').forEach(b=> b.classList.toggle('active', b.dataset.view===state.view));
  const c = document.getElementById('view-container');
  if(state.view==='home') { c.innerHTML = renderHome(); if(state.scope==='city') loadHomeCityList(); }
  else if(state.view==='nextbig') c.innerHTML = renderNextBig();
  else if(state.view==='explore') c.innerHTML = renderExplore();
  else if(state.view==='radar') c.innerHTML = renderRadar();
  else if(state.view==='profile') c.innerHTML = renderProfile();
  c.scrollTop = 0;
}

/* ============================================================================
   HOME — Global Top 100 + Trending Now module
   ============================================================================ */
function scopedList(){
  let list = TRACKS.filter(trackMatchesGenreFilter);
  if(state.scope==='country'){
    list = list.slice().sort((a,b)=>{
      const av = Math.max(...CITIES.filter(c=>c.country===state.selectedCountry).map(c=>a.cityAffinity[c.id]||0));
      const bv = Math.max(...CITIES.filter(c=>c.country===state.selectedCountry).map(c=>b.cityAffinity[c.id]||0));
      return bv-av;
    });
  } else if(state.scope==='city'){
    list = list.slice().sort((a,b)=> (b.cityAffinity[state.selectedCity]||0) - (a.cityAffinity[state.selectedCity]||0));
  }
  return list;
}
function periodTrendOf(t){
  if(state.period==='today') return t.trend24h;
  if(state.period==='30d') return t.trend30d;
  return t.trend7d;
}

function renderHome(){
  const list = scopedList();
  const freeLimit = 20;
  const trending = TRACKS.filter(trackMatchesGenreFilter).slice().sort((a,b)=>{
    const pa = state.trendingPeriod==='24h'?a.trend24h:state.trendingPeriod==='30d'?a.trend30d:a.trend7d;
    const pb = state.trendingPeriod==='24h'?b.trend24h:state.trendingPeriod==='30d'?b.trend30d:b.trend7d;
    return pb-pa;
  }).slice(0,8);

  return `
  <div class="topbar">
    <div class="brand-row">
      <div class="brand"><span class="dot"></span>Pulse Music<small>${tr('home.brandSmall')}</small></div>
      <button class="icon-btn" data-action="nav" data-view="radar">🔔${state.favTracks.size? '<span class=\"badge-dot\"></span>':''}</button>
    </div>
    <div class="segmented">
      <button class="${state.scope==='world'?'active':''}" data-action="scope" data-scope="world">${tr('home.scopeWorld')}</button>
      <button class="${state.scope==='country'?'active':''}" data-action="scope" data-scope="country">${tr('home.scopeCountry')}</button>
      <!-- Ville retirée (demandé explicitement) — Monde + Pays uniquement pour l'instant. -->

    </div>
    ${state.scope==='country' ? `
      <select class="chip-select" data-action="select-country" style="margin-top:9px;width:100%;background:var(--card-2);border:1px solid var(--border);color:#fff;padding:9px 11px;border-radius:12px;font-size:12.5px;font-weight:700;">
        ${COUNTRIES.map(c=>`<option value="${c.code}" ${c.code===state.selectedCountry?'selected':''}>${c.flag} ${cname(c.code)}</option>`).join('')}
      </select>` : ''}
    ${state.scope==='city' ? `
      <select class="chip-select" data-action="select-city" style="margin-top:9px;width:100%;background:var(--card-2);border:1px solid var(--border);color:#fff;padding:9px 11px;border-radius:12px;font-size:12.5px;font-weight:700;">
        ${REAL_CITIES.map(c=>`<option value="${c.id}" ${c.id===state.selectedCity?'selected':''}>${countryByCode(c.country).flag} ${c.name}</option>`).join('')}
      </select>
    <div class="segmented" style="margin-top:9px;">
      <button class="${state.cityPeriod==='today'?'active':''}" data-action="city-period" data-period="today">${tr('home.periodToday')}</button>
      <button class="${state.cityPeriod==='7d'?'active':''}" data-action="city-period" data-period="7d">${tr('home.period7d')}</button>
      <button class="${state.cityPeriod==='30d'?'active':''}" data-action="city-period" data-period="30d">${tr('home.period30d')}</button>
    </div>` : `
    <div class="segmented" style="margin-top:9px;">
      <button class="${state.period==='today'?'active':''}" data-action="period" data-period="today">${tr('home.periodToday')}</button>
      <button class="${state.period==='7d'?'active':''}" data-action="period" data-period="7d">${tr('home.period7d')}</button>
      <button class="${state.period==='30d'?'active':''}" data-action="period" data-period="30d">${tr('home.period30d')}</button>
    </div>`}
    ${state.scope!=='city' ? `
    <div class="chiprow">
      <div class="chip ${quickGenreActive('all')?'active':''}" data-action="quickgenre" data-g="all">${tr('home.chipAll')}</div>
      <div class="chip ${quickGenreActive('afro-house')?'active':''}" data-action="quickgenre" data-g="afro-house">${tr('home.chipAfroHouse')}</div>
      <div class="chip ${quickGenreActive('afro-tech')?'active':''}" data-action="quickgenre" data-g="afro-tech">${tr('home.chipAfroTech')}</div>
      <div class="chip ${quickGenreActive('house')?'active':''}" data-action="quickgenre" data-g="house">${tr('home.chipHouse')}</div>
      <div class="chip ${quickGenreActive('melodic')?'active':''}" data-action="quickgenre" data-g="melodic">${tr('home.chipMelodic')}</div>
      <div class="chip ${quickGenreActive('techno')?'active':''}" data-action="quickgenre" data-g="techno">${tr('home.chipTechno')}</div>
      <div class="chip ghost" data-action="open-genre-sheet">${tr('home.chipMoreGenres')}</div>
    </div>` : `
    <div style="font-size:10.5px;color:var(--text-muted);margin-top:9px;line-height:1.4;">Filtre par genre indisponible ici : Soundcharts ne fournit pas le genre réel de chaque morceau pour les classements ville.</div>`}
  </div>

  <div class="section-title"><h2>${tr('home.trendingNow')}</h2>
    <span class="link" data-action="set-trending-period" data-p="${state.trendingPeriod==='24h'?'7d':state.trendingPeriod==='7d'?'30d':'24h'}">${state.trendingPeriod.toUpperCase()} ⟳</span>
  </div>
  <div class="hscroll">
    ${trending.map(t=>`
      <div class="next-card" style="flex:0 0 168px;" data-action="open-track" data-id="${t.id}">
        <div class="glow"></div>
        ${coverHTML(t,false)}
        <div style="font-weight:700;font-size:12.5px;margin-top:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(t.title)}</div>
        <div style="font-size:10.5px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(t.artist)}</div>
        <div style="margin-top:8px;">${trendBadge(state.trendingPeriod==='24h'?t.trend24h:state.trendingPeriod==='30d'?t.trend30d:t.trend7d)}</div>
      </div>`).join('')}
  </div>

  <div class="section-title"><h2>🏆 ${state.scope==='world'?tr('home.topGlobal'):state.scope==='country'?tr('home.topPrefix')+' '+cname(state.selectedCountry).toUpperCase():tr('home.topPrefix')+' '+cityById(state.selectedCity).name.toUpperCase()}</h2>
    ${!isPro()?`<span class="link" data-action="open-paywall">${tr('home.pro')}</span>`:''}
  </div>
  ${state.scope==='city' ? `
  <div class="track-list" id="homeCityList">
    <div class="empty-msg">Chargement…</div>
  </div>
  <div style="text-align:center;font-size:10px;color:var(--text-muted);margin-top:6px;">Powered by Soundcharts</div>
  ${!isPro() ? `<div class="hpad" style="margin-top:6px;"><button class="btn btn-primary btn-block" data-action="open-paywall">${tr('home.unlockTop100')}</button></div>` : ''}` : `
  <div class="track-list">
    ${list.slice(0,100).map((t,i)=>renderTrackRow(t, i, !isPro() && i>=freeLimit)).join('')}
  </div>
  ${!isPro() ? `<div class="hpad" style="margin-top:6px;"><button class="btn btn-primary btn-block" data-action="open-paywall">${tr('home.unlockTop100')}</button></div>` : ''}`}
  <div style="height:8px;"></div>
  `;
}
async function loadHomeCityList(){
  if(state.scope!=='city') return;
  const appCityId = state.selectedCity;
  const platform = state.homeCityPlatform || 'spotify';
  const period = state.cityPeriod || 'today';
  const entries = await fetchRealCityChart(appCityId, platform, period);
  if(state.scope!=='city' || state.selectedCity!==appCityId || state.homeCityPlatform!==platform || state.cityPeriod!==period) return; // user moved on
  const host = document.getElementById('homeCityList');
  if(host) host.innerHTML = realChartListHTML(entries, { freeLimit: isPro() ? null : FREE_LIMIT_TRACKS });
}

function renderTrackRow(t, idx, locked){
  const trend = periodTrendOf(t);
  return `
  <div class="track-row ${locked?'lock-row':''}" ${locked?'':`data-action="open-track" data-id="${t.id}"`}>
    <div class="rank ${idx<3?'top3':''}">${idx<3? ['🥇','🥈','🥉'][idx] : (idx+1)}</div>
    ${coverHTML(t,false)}
    <div class="t-info">
      <div class="t-title">${esc(t.title)}</div>
      <div class="t-sub"><span class="genre-dot" style="background:${genreById(t.genre).color}"></span>${esc(t.artist)} · ${genreById(t.genre).name}</div>
    </div>
    <div class="t-right">
      <div class="t-score tabular">${t.djScore}<span style="color:var(--text-muted);font-weight:600;font-size:10.5px;">/100</span></div>
      ${trendBadge(trend)}
    </div>
  </div>`;
}

/* ============================================================================
   NEXT BIG TRACKS
   ============================================================================ */
function renderNextBig(){
  if(!isPro()){
    return `
    <div class="topbar">
      <div class="brand-row"><div class="brand"><span class="dot"></span>${tr('nextbig.title')}</div></div>
    </div>
    <div class="hpad" style="margin-top:40px;">
      <div class="card" style="text-align:center;">
        <div style="font-size:34px;">🚀🔒</div>
        <h3 style="margin:10px 0 6px;">${tr('nextbig.proOnlyTitle')}</h3>
        <p style="color:var(--text-muted);font-size:12.5px;line-height:1.6;">${tr('nextbig.proOnlyDesc')}</p>
        <button class="btn btn-primary btn-block" style="margin-top:14px;" data-action="open-paywall">${tr('nextbig.unlockPro')}</button>
      </div>
    </div>`;
  }
  const list = TRACKS.filter(t=>t.isNextBig && trackMatchesGenreFilter(t)).sort((a,b)=>b.growth14d-a.growth14d);
  return `
  <div class="topbar">
    <div class="brand-row"><div class="brand"><span class="dot"></span>${tr('nextbig.title')}<small>${tr('nextbig.subtitle')}</small></div></div>
    <div class="chiprow">
      <div class="chip ${quickGenreActive('all')?'active':''}" data-action="quickgenre" data-g="all">${tr('home.chipAll')}</div>
      <div class="chip ${quickGenreActive('afro-house')?'active':''}" data-action="quickgenre" data-g="afro-house">${tr('home.chipAfroHouse')}</div>
      <div class="chip ${quickGenreActive('melodic')?'active':''}" data-action="quickgenre" data-g="melodic">${tr('home.chipMelodic')}</div>
      <div class="chip ${quickGenreActive('techno')?'active':''}" data-action="quickgenre" data-g="techno">${tr('home.chipTechno')}</div>
    </div>
  </div>
  <div class="hpad" style="display:flex;flex-direction:column;gap:12px;margin-top:8px;">
    ${list.length===0? `<div class="empty-msg">${tr('nextbig.empty')}</div>` : list.map((t,i)=>{
      const tl = trendLabel(t.growth14d);
      return `
      <div class="card" data-action="open-track" data-id="${t.id}" style="cursor:pointer;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="display:flex;gap:12px;">
            ${coverHTML(t,false)}
            <div>
              <div style="font-size:11px;color:var(--text-muted);font-weight:800;">#${i+1} — ${genreById(t.genre).name.toUpperCase()}</div>
              <div style="font-weight:800;font-size:14.5px;margin-top:2px;">${esc(t.title)}</div>
              <div style="font-size:11.5px;color:var(--text-muted);">${esc(t.artist)}</div>
            </div>
          </div>
          <span class="trend-pill ${tl.cls}">${tl.icon} ${tl.txt}</span>
        </div>
        <div style="display:flex; gap:20px; margin-top:14px;">
          <div><div style="font-size:17px;font-weight:800;color:var(--good-text);" class="tabular">${fmtPct(Math.round(t.growth14d))}</div><div style="font-size:10px;color:var(--text-muted);">${tr('nextbig.days14')}</div></div>
          <div><div style="font-size:17px;font-weight:800;" class="tabular">${fmtNum(t.djsPlaying)}</div><div style="font-size:10px;color:var(--text-muted);">${tr('nextbig.djs')}</div></div>
          <div><div style="font-size:17px;font-weight:800;" class="tabular">${t.countriesCount}</div><div style="font-size:10px;color:var(--text-muted);">${tr('nextbig.countries')}</div></div>
        </div>
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-soft);font-size:11.5px;color:var(--text-secondary);">${tr('nextbig.adoptionNote')}</div>
      </div>`;
    }).join('')}
  </div>
  <div style="height:10px;"></div>`;
}

/* ============================================================================
   EXPLORE — World map / Country ranking / City ranking
   ============================================================================ */
function renderExplore(){
  // Ville retirée ici aussi — mode forcé sur 'country', plus de toggle tant
  // qu'il n'y a qu'un seul choix.
  const mode = 'country';
  const items = mode==='country' ? COUNTRIES : REAL_CITIES;
  return `
  <div class="topbar">
    <div class="brand-row"><div class="brand"><span class="dot"></span>${tr('explore.title')}</div></div>
  </div>
  <div class="section-title"><h2>${tr('explore.selectZone')}</h2></div>
  <div class="country-grid">
    ${items.map(it=>{
      const id = mode==='country'? it.code : it.id;
      const label = mode==='country'? cname(it.code) : it.name;
      const flag = mode==='country'? it.flag : countryByCode(it.country).flag;
      const topScore = mode==='country'
        ? Math.max(...CITIES.filter(c=>c.country===it.code).map(c=>Math.max(...TRACKS.slice(0,40).map(t=>t.cityAffinity[c.id]||0))), 0)
        : Math.max(...TRACKS.slice(0,40).map(t=>t.cityAffinity[it.id]||0), 0);
      return `
      <div class="country-card" data-action="explore-open" data-mode="${mode}" data-id="${id}">
        <div class="fl">${flag}</div>
        <div class="nm">${esc(label)}</div>
        <div class="ct">${mode==='country'? citiesFollowedLabel(CITIES.filter(c=>c.country===it.code).length) : tr('explore.activeScene')}</div>
        <div class="meter"><div style="width:${clamp(topScore,8,100)}%"></div></div>
      </div>`;
    }).join('')}
  </div>
  <div id="exploreDetail"></div>
  <div style="height:10px;"></div>`;
}
function renderExploreDetail(mode, id){
  if(mode==='city'){
    const c = cityById(id);
    const title = countryByCode(c.country).flag+' '+c.name.toUpperCase();
    const platform = state.exploreCityPlatform || 'spotify';
    return `
      <div class="hpad" style="margin-top:6px;">
        <div class="card">
          <div style="font-weight:800;font-size:14px;">${title}</div>
          <div style="color:var(--text-muted);font-size:11px;margin-top:2px;">${cname(c.country)} · classement en direct</div>
          <div id="exploreCityList" style="margin-top:10px;">
            <div class="empty-msg">Chargement…</div>
          </div>
          <div style="text-align:center;font-size:10px;color:var(--text-muted);margin-top:8px;">Powered by Soundcharts</div>
        </div>
      </div>`;
  }
  const c = countryByCode(id);
  const title = c.flag+' '+cname(id).toUpperCase();
  const cities = CITIES.filter(x=>x.country===id);
  const list = TRACKS.filter(trackMatchesGenreFilter).slice().sort((a,b)=>{
    const av = Math.max(...cities.map(ci=>a.cityAffinity[ci.id]||0), 0);
    const bv = Math.max(...cities.map(ci=>b.cityAffinity[ci.id]||0), 0);
    return bv-av;
  }).slice(0,8);
  const sub = cities.map(c=>c.name).join(' · ');
  return `
    <div class="hpad" style="margin-top:6px;">
      <div class="card">
        <div style="font-weight:800;font-size:14px;">${title}</div>
        <div style="color:var(--text-muted);font-size:11px;margin-top:2px;">${esc(sub)}</div>
        <div style="margin-top:10px;">
        ${list.map((t,i)=>`
          <div class="track-row" style="padding-left:0;" data-action="open-track" data-id="${t.id}">
            <div class="rank ${i<3?'top3':''}">${i+1}</div>
            ${coverHTML(t,false)}
            <div class="t-info">
              <div class="t-title">${esc(t.title)}</div>
              <div class="t-sub">${esc(t.artist)}</div>
            </div>
            <div class="t-right"><div class="t-score tabular">${t.djScore}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
}
async function loadExploreCityList(appCityId){
  const platform = state.exploreCityPlatform || 'spotify';
  const entries = await fetchRealCityChart(appCityId, platform);
  const host = document.getElementById('exploreCityList'); // fetched after await: user may have navigated away and back
  if(host) host.innerHTML = realChartListHTML(entries);
}

/* ============================================================================
   RADAR — Favorites + Alerts
   ============================================================================ */
const ALERTS_I18N = {
  fr: [
    {icon:'🚀', title:'Afro House Alert', body:'Un nouveau morceau entre dans le Top 20 mondial.', time:'Il y a 2h'},
    {icon:'🔥', title:'Your Track Radar', body:'5 morceaux que vous suivez progressent fortement cette semaine.', time:'Il y a 5h'},
    {icon:'📍', title:'Ibiza Alert', body:'Un nouveau morceau devient #1 à Ibiza.', time:'Il y a 1j'},
    {icon:'📈', title:'Rising Fast', body:'Un morceau suivi vient de progresser fortement en 7 jours.', time:'Il y a 1j'},
    {icon:'🌍', title:'Nouveau marché', body:'Un morceau de votre radar perce en Amérique du Sud.', time:'Il y a 2j'},
  ],
  en: [
    {icon:'🚀', title:'Afro House Alert', body:'A new track just entered the global Top 20.', time:'2h ago'},
    {icon:'🔥', title:'Your Track Radar', body:'5 tracks you follow are surging strongly this week.', time:'5h ago'},
    {icon:'📍', title:'Ibiza Alert', body:'A new track just became #1 in Ibiza.', time:'1d ago'},
    {icon:'📈', title:'Rising Fast', body:'A followed track just surged strongly over 7 days.', time:'1d ago'},
    {icon:'🌍', title:'New market', body:'A track from your radar is breaking through in South America.', time:'2d ago'},
  ],
  es: [
    {icon:'🚀', title:'Afro House Alert', body:'Un nuevo tema entra en el Top 20 mundial.', time:'Hace 2h'},
    {icon:'🔥', title:'Your Track Radar', body:'5 temas que sigues están creciendo fuerte esta semana.', time:'Hace 5h'},
    {icon:'📍', title:'Ibiza Alert', body:'Un nuevo tema se convierte en el #1 en Ibiza.', time:'Hace 1d'},
    {icon:'📈', title:'Rising Fast', body:'Un tema que sigues acaba de crecer fuerte en 7 días.', time:'Hace 1d'},
    {icon:'🌍', title:'Nuevo mercado', body:'Un tema de tu radar está despegando en Sudamérica.', time:'Hace 2d'},
  ],
  de: [
    {icon:'🚀', title:'Afro House Alert', body:'Ein neuer Track ist in die globalen Top 20 eingestiegen.', time:'vor 2 Std.'},
    {icon:'🔥', title:'Your Track Radar', body:'5 Tracks, denen du folgst, legen diese Woche stark zu.', time:'vor 5 Std.'},
    {icon:'📍', title:'Ibiza Alert', body:'Ein neuer Track ist jetzt #1 in Ibiza.', time:'vor 1 Tag'},
    {icon:'📈', title:'Rising Fast', body:'Ein verfolgter Track ist in 7 Tagen stark gestiegen.', time:'vor 1 Tag'},
    {icon:'🌍', title:'Neuer Markt', body:'Ein Track aus deinem Radar setzt sich in Südamerika durch.', time:'vor 2 Tagen'},
  ],
};

function renderRadar(){
  const favTracks = TRACKS.filter(t=>state.favTracks.has(t.id));
  return `
  <div class="topbar">
    <div class="brand-row"><div class="brand"><span class="dot"></span>${tr('radar.title')}</div></div>
    <div class="radar-tabs">
      <div class="chip ${state.radarTab==='saved'?'active':''}" data-action="radar-tab" data-t="saved">📡 Radar (${favTracks.length})</div>
      <div class="chip ${state.radarTab==='alerts'?'active':''}" data-action="radar-tab" data-t="alerts">${tr('radar.alertsTab')}</div>
    </div>
  </div>
  ${state.radarTab==='saved' ? renderRadarSaved(favTracks) : renderRadarAlerts()}
  <div style="height:10px;"></div>`;
}
function renderRadarSaved(favTracks){
  if(favTracks.length===0){
    return `<div class="empty-msg">${tr('radar.empty')}</div>`;
  }
  return `
  <div class="track-list" style="margin-top:6px;">
    ${favTracks.map(t=>`
      <div class="track-row" data-action="open-track" data-id="${t.id}">
        ${coverHTML(t,false)}
        <div class="t-info">
          <div class="t-title">${esc(t.title)}</div>
          <div class="t-sub">${esc(t.artist)} · ${tr('radar.thisWeek')}</div>
        </div>
        <div class="t-right">${trendBadge(t.trend7d)}</div>
      </div>`).join('')}
  </div>
  ${state.favGenres.size || state.favCities.size ? `
  <div class="divider"></div>
  <div class="hpad">
    ${state.favGenres.size? `<div style="font-size:11px;color:var(--text-muted);font-weight:800;margin-bottom:6px;">${tr('radar.followedGenres')}</div><div class="chiprow" style="padding:0 0 10px;">${[...state.favGenres].map(g=>`<div class="chip active">${genreById(g).name}</div>`).join('')}</div>`:''}
    ${state.favCities.size? `<div style="font-size:11px;color:var(--text-muted);font-weight:800;margin-bottom:6px;">${tr('radar.followedCities')}</div><div class="chiprow" style="padding:0;">${[...state.favCities].map(c=>`<div class="chip active">${cityById(c).name}</div>`).join('')}</div>`:''}
  </div>` : ''}
  `;
}
function renderRadarAlerts(){
  const alerts = ALERTS_I18N[state.lang] || ALERTS_I18N.fr;
  return `<div style="margin-top:4px;">${alerts.map(a=>`
    <div class="alert-item">
      <div class="aic">${a.icon}</div>
      <div>
        <div class="at">${a.title}</div>
        <div class="ad">${a.body}</div>
        <div class="atime">${a.time}</div>
      </div>
    </div>`).join('')}
  </div>`;
}

/* ============================================================================
   PROFILE — DJ profile / subscription / admin entry
   ============================================================================ */
function renderProfile(){
  if(!state.user){
    return `
    <div class="topbar"><div class="brand-row"><div class="brand"><span class="dot"></span>${tr('profile.title')}</div></div></div>
    <div class="hpad" style="margin-top:10px;">
      <div class="empty-msg">${tr('profile.loginPrompt')}</div>
      <button class="btn btn-primary btn-block" data-action="logout-to-auth">${tr('profile.loginButton')}</button>
    </div>
    <div class="hpad" style="margin-top:18px;text-align:center;">
      <div style="font-size:11px;color:var(--text-muted);font-weight:800;margin-bottom:8px;">${tr('profile.language')}</div>
      ${langSwitcherHTML(state.lang)}
    </div>`;
  }
  if(!state.user.artistName){
    return `
    <div class="topbar"><div class="brand-row"><div class="brand"><span class="dot"></span>${tr('profile.createTitle')}</div></div></div>
    <div class="hpad" style="margin-top:6px;">
      <div class="field"><label>${tr('profile.artistName')}</label><input id="pf_name" type="text" value="${esc(state.user.name||'')}"></div>
      <div class="field"><label>${tr('profile.country')}</label><select id="pf_country">${COUNTRIES.map(c=>`<option value="${c.code}">${c.flag} ${cname(c.code)}</option>`).join('')}</select></div>
      <div class="field"><label>${tr('profile.city')}</label><select id="pf_city">${CITIES.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
      <div class="field"><label>${tr('profile.genresPlayed')}</label>
        <div class="genre-check-grid" id="pf_genres">
          ${GENRES.map(g=>`<div class="gcheck" data-g="${g.id}" style="color:${g.color}" data-action="toggle-pf-genre">${g.name}</div>`).join('')}
        </div>
      </div>
      <div class="field"><label>${tr('profile.instagram')}</label><input id="pf_ig" type="text" placeholder="@toncompte"></div>
      <div class="field"><label>${tr('profile.soundcloud')}</label><input id="pf_sc" type="text" placeholder="soundcloud.com/toncompte"></div>
      <button class="btn btn-primary btn-block" data-action="save-profile">${tr('profile.createButton')}</button>
      <div style="text-align:center;margin-top:18px;">
        <div style="font-size:11px;color:var(--text-muted);font-weight:800;margin-bottom:8px;">${tr('profile.language')}</div>
        ${langSwitcherHTML(state.lang)}
      </div>
    </div>`;
  }
  const u = state.user;
  const played = pickN(TRACKS, 5, mulberry32(u.name.length*13+7));
  const similar = FAKE_DJS.filter(d=>d.genres.some(g=>u.genres.includes(g))).slice(0,4);
  return `
  <div class="topbar"><div class="brand-row"><div class="brand"><span class="dot"></span>${tr('profile.titleProfile')}</div></div></div>
  <div class="hpad" style="margin-top:4px;">
    <div class="card" style="display:flex;gap:14px;align-items:center;">
      <div style="width:58px;height:58px;border-radius:50%;background:var(--brand-grad);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;">${(u.artistName||u.name||'?')[0].toUpperCase()}</div>
      <div style="flex:1;">
        <div style="font-weight:800;font-size:15px;">${esc(u.artistName)}</div>
        <div style="font-size:11.5px;color:var(--text-muted);">${countryByCode(u.country).flag} ${cityById(u.city).name}, ${cname(u.country)}</div>
        <div style="margin-top:5px;">${u.isPro? `<span class="status-chip good"><span class="sw"></span>${tr('profile.proDj')}</span>` : `<span class="status-chip warning"><span class="sw"></span>${tr('profile.free')}</span>`}</div>
      </div>
    </div>
    <div class="chiprow" style="padding:12px 0 0;">${u.genres.map(g=>`<div class="chip active">${genreById(g).name}</div>`).join('')}</div>
    <div style="display:flex;gap:8px;margin-top:12px;">
      ${u.instagram? `<div class="platform-btn">📷 ${esc(u.instagram)}</div>`:''}
      ${u.soundcloud? `<div class="platform-btn">☁️ SoundCloud</div>`:''}
    </div>
  </div>

  ${!u.isPro? `<div class="hpad" style="margin-top:14px;">
    <div class="card" style="background:linear-gradient(135deg,#1c1430,#12121c);border-color:rgba(139,92,246,.35);">
      <div style="font-weight:800;font-size:14px;">${tr('profile.goProTitle')}</div>
      <p style="color:var(--text-muted);font-size:12px;line-height:1.6;margin:6px 0 12px;">${tr('profile.goProDesc')}</p>
      <button class="btn btn-primary btn-block" data-action="open-paywall">${tr('profile.viewProOffer')}</button>
    </div>
  </div>` : ''}

  <div class="section-title"><h2>${tr('profile.topPlayed')}</h2></div>
  <div class="track-list">${played.map((t,i)=>renderTrackRow(t,i,false)).join('')}</div>

  <div class="section-title"><h2>${tr('profile.similarDjs')}</h2></div>
  <div class="hscroll">
    ${similar.length? similar.map(d=>`
      <div class="card" style="flex:0 0 140px;text-align:center;">
        <div style="width:44px;height:44px;border-radius:50%;background:var(--card-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;margin:0 auto;">${d.name[0]}</div>
        <div style="font-weight:700;font-size:12px;margin-top:8px;">${esc(d.name)}</div>
        <div style="font-size:10px;color:var(--text-muted);">${cityById(d.city).name}</div>
      </div>`).join('') : `<div class="empty-msg">${tr('profile.noMatch')}</div>`}
  </div>

  <div class="section-title"><h2>${tr('profile.language')}</h2></div>
  <div class="hpad">${langSwitcherHTML(state.lang)}</div>

  <div class="divider"></div>
  <div class="hpad" style="display:flex;flex-direction:column;gap:9px;">
    <button class="btn btn-outline btn-block" data-action="open-admin">${tr('profile.admin')}</button>
    <button class="btn btn-ghost btn-block" data-action="logout">${tr('profile.logout')}</button>
  </div>
  <div style="text-align:center;font-size:10px;color:var(--text-muted);padding:16px 24px 4px;line-height:1.6;">${tr('profile.footer')}</div>
  <div style="height:12px;"></div>`;
}

/* ============================================================================
   TRACK DETAIL OVERLAY
   ============================================================================ */
function openTrack(id){
  state.currentTrackId = id;
  state.trackChartPeriod = '30d';
  const ov = document.getElementById('trackOverlay');
  ov.classList.remove('hidden');
  renderTrackOverlay();
}
function closeTrack(){
  document.getElementById('trackOverlay').classList.add('hidden');
}
function renderTrackOverlay(){
  const t = TRACKS.find(x=>x.id===state.currentTrackId);
  if(!t) return;
  const ov = document.getElementById('trackOverlay');
  const isFav = state.favTracks.has(t.id);
  const g = genreById(t.genre);
  const topLoc = CITIES.map(c=>({c, v:t.cityAffinity[c.id]||0})).sort((a,b)=>b.v-a.v).slice(0,4);
  const locked90 = !isPro();

  ov.innerHTML = `
    <div class="overlay-header">
      <button class="close-btn" data-action="close-track">✕</button>
      <div style="font-size:11px;font-weight:800;color:var(--text-muted);letter-spacing:.6px;">${tr('track.detailTitle')}</div>
      <button class="close-btn" data-action="toggle-fav" data-id="${t.id}">${isFav?'❤️':'🤍'}</button>
    </div>
    <div style="flex:1;overflow-y:auto;">
      <div style="text-align:center;padding:6px 24px 10px;">
        ${coverHTML(t,true)}
        <h2 style="margin:14px 0 2px;font-size:19px;">${esc(t.title)}</h2>
        <div style="color:var(--text-muted);font-size:13px;">${esc(t.artist)}</div>
        <div style="margin-top:8px;"><span class="chip" style="display:inline-flex;color:${g.color};border-color:${g.color}55;"><span class="genre-dot" style="background:${g.color};margin-right:6px;"></span>${g.name}</span></div>
        ${t.chartRank ? `<div style="margin-top:9px;display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;background:rgba(20,199,102,.12);color:var(--good-text);font-size:10.5px;font-weight:800;letter-spacing:.2px;">📊 ${t.chartSource} — ${esc(t.chartGenreName)} #${t.chartRank}</div>` : ''}
      </div>

      <div class="hpad">
        ${t.itunesPreviewUrl ? `
          <div style="display:flex;align-items:center;gap:6px;justify-content:center;margin-bottom:8px;padding:5px 12px;border-radius:20px;background:rgba(252,61,98,.12);color:#fc3d62;font-size:10.5px;font-weight:800;letter-spacing:.2px;">${tr('track.audioRealBadgeApple')}</div>
          <button class="btn btn-primary btn-block big-play-btn" data-action="toggle-play" data-id="${t.id}">${state.playingId===t.id? tr('track.pauseExtract') : tr('track.playExtract')}</button>
          <div style="text-align:center;font-size:10px;color:var(--text-muted);margin-top:6px;">${tr('track.audioRealNoteApple')}${t.itunesTrackUrl ? ` · <a href="${t.itunesTrackUrl}" target="_blank" rel="noopener" style="color:#fc3d62;">${tr('track.appleMusic')}</a>` : ''}</div>
        ` : `
          <!-- No Apple Music preview found for this track — Spotify's
               widget is no longer used as a fallback, so this just plays
               the generated preview. Same button/behavior as every Monde/
               Pays track (see togglePlay): tapping it always goes through
               the primed <audio> element, never a YouTube iframe, so it
               stays reliable on iPhone. -->
          <button class="btn btn-primary btn-block big-play-btn" data-action="toggle-play" data-id="${t.id}">${state.playingId===t.id? tr('track.pauseExtract') : tr('track.playExtract')}</button>
          <div style="text-align:center;font-size:10px;color:var(--text-muted);margin-top:6px;">${state.itunesLoading && state.playingId===t.id ? '…' : tr('track.audioGenNote')}</div>
        `}
        ${t.youtubeId ? `
          <div style="margin-top:10px;">
            <div style="display:flex;align-items:center;gap:6px;justify-content:center;margin-bottom:8px;padding:5px 12px;border-radius:20px;background:rgba(255,0,51,.12);color:#ff0033;font-size:10.5px;font-weight:800;letter-spacing:.2px;">${tr('track.audioRealBadgeYoutube')}</div>
            <iframe style="border-radius:12px;" src="https://www.youtube.com/embed/${t.youtubeId}" width="100%" height="152" frameborder="0" allowfullscreen="" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="YouTube player — ${esc(t.title)}"></iframe>
            <div style="text-align:center;font-size:10px;color:var(--text-muted);margin-top:6px;">${tr('track.audioRealNoteYoutube')}</div>
          </div>
        ` : ''}
      </div>

      <div class="hpad" style="margin-top:14px;">
        <div class="card" style="text-align:center;">
          <div style="font-size:11px;color:var(--text-muted);font-weight:800;letter-spacing:.6px;">${tr('track.djScore')}</div>
          <div style="font-size:40px;font-weight:800;margin:4px 0;" class="tabular">${t.djScore}<span style="font-size:16px;color:var(--text-muted);">/100</span></div>
          <div class="meter" style="margin:0 auto;max-width:220px;"><div style="width:${t.djScore}%"></div></div>
          <div style="margin-top:10px;">${trendBadge(t.trend7d)} <span style="color:var(--text-muted);font-size:11px;">${tr('track.days7')}</span></div>
        </div>
      </div>

      <div class="hpad" style="display:flex;gap:9px;margin-top:12px;">
        <div class="stat-tile"><div class="label">${tr('track.djs')}</div><div class="value tabular">${fmtNum(t.djsPlaying)}</div></div>
        <div class="stat-tile"><div class="label">${tr('track.countries')}</div><div class="value tabular">${t.countriesCount}</div></div>
        <div class="stat-tile"><div class="label">${tr('track.cities')}</div><div class="value tabular">${t.citiesCount}</div></div>
      </div>
      <div class="hpad" style="margin-top:9px;">
        <div class="stat-tile"><div class="label">${tr('track.clubsEvents')}</div><div class="value tabular">${t.clubsCount? fmtNum(t.clubsCount) : tr('track.dataUnavailable')}</div></div>
      </div>

      <div class="section-title"><h2>${tr('track.topLocations')}</h2></div>
      <div class="hpad">
        <div class="card">
          ${topLoc.map((l,i)=>`
            <div class="locrow">
              <div class="rk">#${i+1}</div>
              <div class="flag">${countryByCode(l.c.country).flag}</div>
              <div class="nm">${l.c.name}</div>
              <div class="rankbadge">${Math.round(l.v)}/100</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="section-title"><h2>${tr('track.trendHistory')}</h2></div>
      <div class="periodrow">
        <div class="chip ${state.trackChartPeriod==='7d'?'active':''}" data-action="chart-period" data-p="7d">${tr('track.days7chip')}</div>
        <div class="chip ${state.trackChartPeriod==='30d'?'active':''}" data-action="chart-period" data-p="30d">${tr('track.days30chip')}</div>
        <div class="chip ${state.trackChartPeriod==='90d'?'active':''} ${locked90?'ghost':''}" data-action="${locked90?'open-paywall':'chart-period'}" data-p="90d">${tr('track.days90chip')} ${locked90?'🔒':''}</div>
      </div>
      <div class="hpad">
        <div class="card"><div id="chartHost"></div></div>
      </div>

      <div class="section-title"><h2>${tr('track.details')}</h2></div>
      <div class="hpad">
        <div class="card">
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12.5px;"><span style="color:var(--text-muted);">${tr('track.genre')}</span><span style="font-weight:700;">${g.name}</span></div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12.5px;border-top:1px solid var(--border-soft);"><span style="color:var(--text-muted);">${tr('track.releaseDate')}</span><span style="font-weight:700;">${fmtDate(t.releaseDate)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12.5px;border-top:1px solid var(--border-soft);"><span style="color:var(--text-muted);">${tr('track.artist')}</span><span style="font-weight:700;">${esc(t.artist)}</span></div>
          ${t.label ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12.5px;border-top:1px solid var(--border-soft);"><span style="color:var(--text-muted);">${tr('track.label')}</span><span style="font-weight:700;">${esc(t.label)}</span></div>` : ''}
          ${t.chartRank ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12.5px;border-top:1px solid var(--border-soft);"><span style="color:var(--text-muted);">${tr('track.ranking')}</span><span style="font-weight:700;">${t.chartSource} ${esc(t.chartGenreName)} #${t.chartRank}</span></div>` : ''}
        </div>
        ${t.chartRank ? `<div style="font-size:10px;color:var(--text-muted);margin-top:8px;line-height:1.5;">${tr('track.disclaimerBase')}${t.itunesPreviewUrl ? tr('track.disclaimerApple') : tr('track.disclaimerGenerated')}${tr('track.disclaimerTail')}</div>` : ''}
      </div>

      <div class="section-title"><h2>${tr('track.listenFull')}</h2></div>
      <div class="hpad platform-row">
        <div class="platform-btn" data-action="platform" data-p="Spotify" data-id="${t.id}">🟢 ${tr('track.spotify')}</div>
        <div class="platform-btn" data-action="platform" data-p="SoundCloud" data-id="${t.id}">☁️ ${tr('track.soundcloud')}</div>
        <div class="platform-btn" data-action="platform" data-p="AppleMusic" data-id="${t.id}">🍎 ${tr('track.appleMusic')}</div>
      </div>
      <div style="height:20px;"></div>
    </div>
  `;
  drawTrendChart(t);
}

/* ---------------------------- TREND CHART (SVG, dataviz-skill compliant) --- */
function drawTrendChart(t){
  const host = document.getElementById('chartHost');
  if(!host) return;
  const days = state.trackChartPeriod==='7d'?7:state.trackChartPeriod==='30d'?30:90;
  const data = t.history.slice(t.history.length-days);
  const w = 320, h = 140, padL=8, padR=8, padT=14, padB=20;
  const min = Math.min(...data), max = Math.max(...data);
  const range = Math.max(1, max-min);
  const x = i => padL + (i/(data.length-1)) * (w-padL-padR);
  const y = v => padT + (1-((v-min)/range)) * (h-padT-padB);
  const pts = data.map((v,i)=>[x(i),y(v)]);
  const linePath = pts.map((p,i)=> (i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const areaPath = linePath + ` L${pts[pts.length-1][0].toFixed(1)},${h-padB} L${pts[0][0].toFixed(1)},${h-padB} Z`;
  const last = pts[pts.length-1];
  const startDate = new Date(TODAY.getTime() - (days-1)*86400000);

  host.innerHTML = `
  <div class="viz-root chart-wrap" data-palette="#3987e5" style="color-scheme:dark;">
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" id="trendSvg" style="overflow:visible;">
      <line x1="${padL}" y1="${h-padB}" x2="${w-padR}" y2="${h-padB}" stroke="var(--baseline)" stroke-width="1"/>
      <line x1="${padL}" y1="${padT}" x2="${w-padR}" y2="${padT}" stroke="var(--gridline)" stroke-width="1"/>
      <path d="${areaPath}" fill="var(--series-blue)" opacity="0.10" stroke="none"/>
      <path d="${linePath}" fill="none" stroke="var(--series-blue)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${last[0]}" cy="${last[1]}" r="4" fill="var(--series-blue)" stroke="var(--surface-1)" stroke-width="2"/>
      <text x="${last[0]}" y="${last[1]-10}" text-anchor="end" font-size="11" font-weight="700" fill="var(--text-primary)">${data[data.length-1].toFixed(0)}</text>
      <text x="${padL}" y="${h-6}" font-size="9.5" fill="var(--text-muted)">${fmtDate(startDate)}</text>
      <text x="${w-padR}" y="${h-6}" text-anchor="end" font-size="9.5" fill="var(--text-muted)">${fmtDate(TODAY)}</text>
      <g id="hoverLayer" opacity="0"></g>
      <rect x="0" y="0" width="${w}" height="${h}" fill="transparent" id="hitLayer"/>
    </svg>
    <div class="chart-tooltip" id="chartTooltip"></div>
  </div>`;

  const svg = document.getElementById('trendSvg');
  const hit = document.getElementById('hitLayer');
  const hoverLayer = document.getElementById('hoverLayer');
  const tip = document.getElementById('chartTooltip');

  function moveHover(clientX){
    const rect = svg.getBoundingClientRect();
    const relX = ((clientX-rect.left)/rect.width) * w;
    let idx = Math.round(((relX-padL)/(w-padL-padR)) * (data.length-1));
    idx = clamp(idx, 0, data.length-1);
    const px = x(idx), py = y(data[idx]);
    hoverLayer.style.opacity = 1;
    hoverLayer.innerHTML = `
      <line x1="${px}" y1="${padT}" x2="${px}" y2="${h-padB}" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="2,2"/>
      <circle cx="${px}" cy="${py}" r="4" fill="var(--series-blue)" stroke="var(--surface-1)" stroke-width="2"/>`;
    const d = new Date(TODAY.getTime() - (data.length-1-idx)*86400000);
    tip.style.opacity=1;
    tip.style.left = (px/w*100)+'%';
    tip.style.top = (py/h*100)+'%';
    tip.textContent = `${fmtDate(d)} · ${data[idx].toFixed(0)}/100`;
  }
  svg.addEventListener('mousemove', e=> moveHover(e.clientX));
  svg.addEventListener('touchmove', e=>{ if(e.touches[0]) moveHover(e.touches[0].clientX); }, {passive:true});
  svg.addEventListener('mouseleave', ()=>{ hoverLayer.style.opacity=0; tip.style.opacity=0; });
}

/* ============================================================================
   GENRE MULTI-SELECT SHEET (combine genres)
   ============================================================================ */
function openGenreSheet(){
  const ov = document.getElementById('genreOverlay');
  ov.classList.remove('hidden');
  ov.innerHTML = `
    <div class="sheet-inner">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h3 style="margin:0;font-size:15px;">${tr('genreSheet.combine')}</h3>
        <button class="close-btn" data-action="close-genre-sheet">✕</button>
      </div>
      <div class="genre-check-grid">
        ${GENRES.map(g=>`<div class="gcheck ${state.genreFilters.has(g.id)?'on':''}" style="color:${g.color};${state.genreFilters.has(g.id)?`background:${g.color}22;border-color:${g.color};`:''}" data-action="toggle-adv-genre" data-g="${g.id}">${g.name}</div>`).join('')}
      </div>
      <button class="btn btn-primary btn-block" style="margin-top:16px;" data-action="close-genre-sheet">${tr('genreSheet.apply')}</button>
    </div>`;
}

/* ============================================================================
   PAYWALL
   ============================================================================ */
function openPaywall(){
  const ov = document.getElementById('paywallOverlay');
  ov.classList.remove('hidden');
  ov.innerHTML = `
    <div class="sheet-inner">
      <div style="text-align:center;">
        <div style="font-size:30px;">⭐</div>
        <h3 style="margin:8px 0 4px;">PRO DJ</h3>
        <div style="font-size:22px;font-weight:800;">4,99&nbsp;€<span style="font-size:12px;color:var(--text-muted);font-weight:600;">${tr('paywall.perMonth')}</span></div>
        <div style="font-size:11px;color:var(--good-text);font-weight:700;margin-top:3px;">${tr('paywall.orYearly')}</div>
      </div>
      <div style="margin:18px 0;">
        ${['paywall.f1','paywall.f2','paywall.f3','paywall.f4','paywall.f5','paywall.f6','paywall.f7'].map(k=>`
          <div style="display:flex;gap:10px;align-items:center;padding:7px 0;font-size:13px;"><span style="color:var(--good-text);">✓</span>${tr(k)}</div>`).join('')}
      </div>
      <button class="btn btn-primary btn-block" data-action="activate-pro">${tr('paywall.activate')}</button>
      <button class="btn btn-ghost btn-block" style="margin-top:9px;" data-action="close-paywall">${tr('paywall.later')}</button>
      <p style="text-align:center;font-size:10px;color:var(--text-muted);margin-top:12px;">${tr('paywall.labelOffer')}</p>
    </div>`;
}
function closePaywall(){ document.getElementById('paywallOverlay').classList.add('hidden'); }

/* ============================================================================
   ADMIN DASHBOARD
   ============================================================================ */
const DATA_SOURCES = [
  {name:'Beatport Charts API', desc:'Charts genres & ventes — alimente l\'identité et le Chart Performance des 100 morceaux de cette démo', status:'good', sync:'il y a 4 min'},
  {name:'DJ Software Telemetry', desc:'Serato / rekordbox / Engine DJ — opt-in DJ', status:'good', sync:'il y a 11 min'},
  {name:'1001Tracklists', desc:'Base de tracklists sets & festivals', status:'good', sync:'il y a 1h'},
  {name:'Spotify for Developers', desc:'Signal streaming complémentaire (non prioritaire)', status:'warning', sync:'il y a 6h'},
  {name:'Festival & Club Lineups', desc:'Programmation événements partenaires', status:'good', sync:'il y a 2h'},
  {name:'Playlist Curators Network', desc:'Playlists éditoriales spécialisées club/DJ', status:'critical', sync:'échec — retry programmé'},
];

function openAdmin(){
  document.getElementById('adminOverlay').classList.remove('hidden');
  renderAdmin();
}
function closeAdmin(){ document.getElementById('adminOverlay').classList.add('hidden'); }

function renderAdmin(){
  const root = document.getElementById('adminOverlay');
  const wsum = Object.values(WEIGHTS).reduce((a,b)=>a+b,0);
  const top5 = TRACKS.slice(0,5);
  const dataErrors = DATA_SOURCES.filter(s=>s.status==='critical').length;

  root.innerHTML = `
    <div class="admin-topbar">
      <div class="brand" style="font-size:14px;"><span class="dot"></span>Pulse Music <span style="color:var(--text-muted);font-weight:600;">— Admin Dashboard</span></div>
      <button class="close-btn" data-action="close-admin">✕</button>
    </div>
    <div class="admin-body">
      <div class="admin-grid">
        <div class="stat-tile"><div class="label">Utilisateurs</div><div class="value tabular">18 402</div><div class="delta" style="color:var(--good-text);">+312 / 7j</div></div>
        <div class="stat-tile"><div class="label">Morceaux</div><div class="value tabular">${TRACKS.length}</div></div>
        <div class="stat-tile"><div class="label">Artistes</div><div class="value tabular">${new Set(TRACKS.map(t=>t.artist)).size}</div></div>
        <div class="stat-tile"><div class="label">Genres</div><div class="value tabular">${GENRES.length}</div></div>
        <div class="stat-tile"><div class="label">Pays couverts</div><div class="value tabular">${COUNTRIES.length}</div></div>
        <div class="stat-tile"><div class="label">Villes suivies</div><div class="value tabular">${CITIES.length}</div></div>
        <div class="stat-tile"><div class="label">Sources actives</div><div class="value tabular">${DATA_SOURCES.filter(s=>s.status!=='critical').length}/${DATA_SOURCES.length}</div></div>
        <div class="stat-tile"><div class="label">Erreurs de données</div><div class="value tabular" style="color:${dataErrors?'var(--critical)':'var(--good-text)'};">${dataErrors}</div></div>
      </div>

      <div class="admin-section">
        <h3>⚙️ Algorithme — Coefficients du DJ Score</h3>
        <div class="card">
          ${weightSliderRow('freq','DJ Play Frequency')}
          ${weightSliderRow('growth','Growth')}
          ${weightSliderRow('geo','Geographical Reach')}
          ${weightSliderRow('chart','Chart Performance')}
          ${weightSliderRow('city','City / Club Performance')}
          ${weightSliderRow('newness','Newness')}
          <div class="weight-total">Total pondération brute : <b style="color:${wsum===100?'var(--good-text)':'var(--warning)'};">${wsum}%</b> — normalisé automatiquement à 100% pour le calcul du score.</div>
        </div>
      </div>

      <div class="admin-section">
        <h3>👀 Aperçu Top 5 (recalcul live)</h3>
        <table class="admin-table">
          <tr><th>#</th><th>Morceau</th><th>Genre</th><th>DJ Score</th></tr>
          ${top5.map((t,i)=>`<tr><td>${i+1}</td><td>${esc(t.title)} — <span style="color:var(--text-muted);">${esc(t.artist)}</span></td><td>${genreById(t.genre).name}</td><td class="tabular"><span class="barbg"><div style="width:${t.djScore}%"></div></span>${t.djScore}</td></tr>`).join('')}
        </table>
      </div>

      <div class="admin-section">
        <h3>🧮 Pourquoi ce score ? — ${esc(top5[0].title)}</h3>
        <table class="admin-table">
          <tr><th>Indicateur</th><th>Valeur brute</th><th>Poids</th><th>Contribution</th></tr>
          ${['freq','growth','geo','chart','city','newness'].map(k=>{
            const labels={freq:'DJ Play Frequency',growth:'Growth',geo:'Geographical Reach',chart:'Chart Performance',city:'City/Club Performance',newness:'Newness'};
            const contrib = Math.round(top5[0].m[k]*WEIGHTS[k]/wsum);
            return `<tr><td>${labels[k]}</td><td class="tabular">${Math.round(top5[0].m[k])}/100</td><td class="tabular">${WEIGHTS[k]}%</td><td class="tabular"><b>${contrib}</b> pts</td></tr>`;
          }).join('')}
          <tr><td colspan="3" style="font-weight:800;">DJ SCORE FINAL</td><td class="tabular" style="font-weight:800;">${top5[0].djScore}/100</td></tr>
        </table>
      </div>

      <div class="admin-section">
        <h3>🔌 Sources de données <span style="text-transform:none;color:var(--text-muted);font-weight:500;">— architecture modulaire, respect API &amp; licences</span></h3>
        ${DATA_SOURCES.map(s=>`
          <div class="src-row">
            <div><div class="nm">${esc(s.name)}</div><div class="desc">${esc(s.desc)} · sync ${esc(s.sync)}</div></div>
            <span class="status-chip ${s.status}"><span class="sw"></span>${s.status==='good'?'Connectée':s.status==='warning'?'En attente':'Erreur'}</span>
          </div>`).join('')}
      </div>
      <div style="text-align:center;font-size:10px;color:var(--text-muted);padding:22px 0 4px;">© 2026 Bena — Pulse Music. Logiciel propriétaire, tous droits réservés — voir LICENSE.txt.</div>
    </div>
  `;

  root.querySelectorAll('input[type=range]').forEach(inp=>{
    inp.addEventListener('input', e=>{
      WEIGHTS[e.target.dataset.k] = parseInt(e.target.value,10);
      recomputeScores();
      renderAdmin();
    });
  });
}
function weightSliderRow(key,label){
  return `
  <div class="slider-row">
    <div class="lbl">${label}</div>
    <input type="range" min="0" max="60" value="${WEIGHTS[key]}" data-k="${key}">
    <div class="val tabular">${WEIGHTS[key]}%</div>
  </div>`;
}

/* ============================================================================
   AUTH SCREEN
   ============================================================================ */
let authMode = 'signup'; // 'signup' | 'login'
let authBusy = false;
let authError = null;

// Turns a Supabase Auth error into one of our own translated messages.
function mapAuthError(err){
  const code = (err && err.code) || '';
  const msg = ((err && err.message) || '').toLowerCase();
  if(code==='user_already_exists' || msg.includes('already registered') || msg.includes('already exists')) return tr('auth.errorEmailTaken');
  if(code==='invalid_credentials' || msg.includes('invalid login credentials')) return tr('auth.errorInvalidCredentials');
  if(code==='weak_password' || msg.includes('at least 6')) return tr('auth.errorWeakPassword');
  if(code==='email_not_confirmed' || msg.includes('not confirmed')) return tr('auth.errorEmailNotConfirmed');
  return tr('auth.errorGeneric');
}

function renderAuthScreen(){
  const wrap = document.getElementById('authWrap');
  if(!wrap) return;
  const prevName = document.getElementById('authName');
  const prevEmail = document.getElementById('authEmail');
  const prevPassword = document.getElementById('authPassword');
  const savedName = prevName ? prevName.value : '';
  const savedEmail = prevEmail ? prevEmail.value : '';
  const savedPassword = prevPassword ? prevPassword.value : '';
  const isSignup = authMode === 'signup';
  wrap.innerHTML = `
    <div class="auth-glow"></div>
    <div style="margin-bottom:16px;">${langSwitcherHTML(state.lang, 'sm')}</div>
    <div class="auth-logo">
      <div class="mark"><svg viewBox="0 0 64 64" width="36" height="36" xmlns="http://www.w3.org/2000/svg"><rect x="8.5" y="22" width="7" height="20" rx="3.5" fill="#fff"/><rect x="18.5" y="15.5" width="7" height="33" rx="3.5" fill="#fff"/><rect x="28.5" y="10" width="7" height="44" rx="3.5" fill="#fff"/><rect x="38.5" y="17" width="7" height="30" rx="3.5" fill="#fff"/><rect x="48.5" y="20" width="7" height="24" rx="3.5" fill="#fff"/></svg></div>
      <h1>Pulse Music</h1>
      <p>${tr('auth.tagline')}</p>
    </div>
    ${isSignup ? `
    <div class="field">
      <label>${tr('auth.nameLabel')}</label>
      <input id="authName" type="text" placeholder="${tr('auth.namePlaceholder')}" value="${esc(savedName)}">
    </div>` : ''}
    <div class="field">
      <label>${tr('auth.emailLabel')}</label>
      <input id="authEmail" type="email" autocapitalize="off" autocorrect="off" placeholder="${tr('auth.emailPlaceholder')}" value="${esc(savedEmail)}">
    </div>
    <div class="field">
      <label>${tr('auth.passwordLabel')}</label>
      <input id="authPassword" type="password" placeholder="${tr('auth.passwordPlaceholder')}" value="${esc(savedPassword)}">
    </div>
    ${authError ? `<p style="color:#ff6b6b;font-size:11.5px;text-align:center;margin:-6px 0 12px;line-height:1.5;">${esc(authError)}</p>` : ''}
    <button class="btn btn-primary btn-block" data-action="${isSignup ? 'signup' : 'login'}" ${authBusy?'disabled':''}>${authBusy ? tr('auth.loading') : (isSignup ? tr('auth.signup') : tr('auth.login'))}</button>
    <div style="height:10px"></div>
    <button class="btn btn-ghost btn-block" data-action="toggle-auth-mode" ${authBusy?'disabled':''}>${isSignup ? tr('auth.haveAccount') : tr('auth.noAccount')}</button>
    <div style="height:10px"></div>
    <button class="btn btn-ghost btn-block" data-action="guest" ${authBusy?'disabled':''}>${tr('auth.guest')}</button>
    <p style="text-align:center; color:var(--text-muted); font-size:10.5px; margin-top:18px; line-height:1.6;">
      ${tr('auth.disclaimer')}
    </p>
  `;
}

/* ============================================================================
   EVENT DELEGATION
   ============================================================================ */
document.addEventListener('click', async (e)=>{
  const el = e.target.closest('[data-action]');
  if(!el) return;
  const a = el.dataset.action;

  if(a==='toggle-auth-mode'){
    authMode = authMode==='signup' ? 'login' : 'signup';
    authError = null;
    renderAuthScreen();
  }
  else if(a==='signup'){
    const name = document.getElementById('authName').value.trim() || 'DJ Invité';
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    if(!email || !password){ authError = tr('auth.errorMissing'); renderAuthScreen(); return; }
    authBusy = true; authError = null; renderAuthScreen();
    try{
      const data = await authSignUp(email, password);
      if(data.access_token){
        applyAuthResponse(data);
        state.user = {name, email, isPro:false, artistName:'', genres:[]};
        await persistState();
        authBusy = false;
        enterApp();
      } else {
        // "Confirm email" is on for this project: no session until the DJ
        // clicks the link Supabase just emailed them.
        authBusy = false;
        authMode = 'login';
        toast(tr('auth.checkEmail'));
        renderAuthScreen();
      }
    }catch(err){
      authBusy = false;
      authError = mapAuthError(err);
      renderAuthScreen();
    }
  }
  else if(a==='login'){
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    if(!email || !password){ authError = tr('auth.errorMissing'); renderAuthScreen(); return; }
    authBusy = true; authError = null; renderAuthScreen();
    try{
      const data = await authSignIn(email, password);
      applyAuthResponse(data);
      state.user = {name:'', email, isPro:false, artistName:'', genres:[]};
      await loadPersistedState();
      authBusy = false;
      enterApp();
    }catch(err){
      authBusy = false;
      authError = mapAuthError(err);
      renderAuthScreen();
    }
  }
  else if(a==='guest'){
    state.user = {name:'Invité', email:'', isPro:false, artistName:'', genres:[]};
    enterApp();
  }
  else if(a==='logout'){
    authSignOut();
    state.user=null; state.view='home';
    authMode = 'login'; authError = null;
    document.getElementById('appScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
    renderAuthScreen();
  }
  else if(a==='logout-to-auth'){
    authMode = 'login'; authError = null;
    document.getElementById('appScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
    renderAuthScreen();
  }
  else if(a==='nav'){ state.view = el.dataset.view; renderView(); }
  else if(a==='scope'){ state.scope = el.dataset.scope; state.genreFilters = new Set(); renderView(); }
  else if(a==='home-city-platform'){ state.homeCityPlatform = el.dataset.p; renderView(); }
  else if(a==='period'){ state.period = el.dataset.period; renderView(); }
  else if(a==='city-period'){ state.cityPeriod = el.dataset.period; renderView(); }
  else if(a==='quickgenre'){ setQuickGenre(el.dataset.g); }
  else if(a==='open-genre-sheet'){ openGenreSheet(); }
  else if(a==='close-genre-sheet'){ document.getElementById('genreOverlay').classList.add('hidden'); renderView(); }
  else if(a==='toggle-adv-genre'){
    const g = el.dataset.g;
    if(state.genreFilters.has(g)) state.genreFilters.delete(g); else state.genreFilters.add(g);
    openGenreSheet();
  }
  else if(a==='set-trending-period'){ state.trendingPeriod = el.dataset.p; renderView(); }
  else if(a==='open-track'){ openTrack(el.dataset.id); }
  else if(a==='close-track'){ closeTrack(); }
  else if(a==='chart-period'){ state.trackChartPeriod = el.dataset.p; renderTrackOverlay(); }
  else if(a==='toggle-fav'){
    const id = el.dataset.id;
    if(state.favTracks.has(id)) state.favTracks.delete(id); else { state.favTracks.add(id); toast(tr('toast.addedToRadar')); }
    persistState();
    renderTrackOverlay();
  }
  else if(a==='platform'){
    const t2 = el.dataset.id ? TRACKS.find(x=>x.id===el.dataset.id) : null;
    const p = el.dataset.p;
    if(p==='Spotify' && t2 && t2.spotifyId){ window.open('https://open.spotify.com/track/'+t2.spotifyId, '_blank', 'noopener'); }
    else if(t2){
      // No verified per-track ID on this platform — open a real search on the platform
      // for this exact title + artist, rather than a fake/unverifiable embed.
      const q = encodeURIComponent(platformQuery(t2));
      const urls = {
        Spotify: 'https://open.spotify.com/search/'+q,
        SoundCloud: 'https://soundcloud.com/search?q='+q,
        AppleMusic: 'https://music.apple.com/search?term='+q,
      };
      if(urls[p]) window.open(urls[p], '_blank', 'noopener');
      else toast(tf('toast.openingOn',{p}));
    }
    else toast(tf('toast.openingOn',{p}));
  }
  else if(a==='toggle-play'){ togglePlay(el.dataset.id); }
  else if(a==='mini-player-stop'){ stopPlayback(); }
  else if(a==='explore-mode'){ state.exploreMode = el.dataset.m; document.getElementById('view-container').innerHTML = renderExplore(); }
  else if(a==='explore-open'){
    const host = document.getElementById('exploreDetail');
    if(host) host.innerHTML = renderExploreDetail(el.dataset.mode, el.dataset.id);
    if(el.dataset.mode==='city'){
      state.exploreOpenCityId = el.dataset.id;
      loadExploreCityList(el.dataset.id);
    }
  }
  else if(a==='explore-city-platform'){
    state.exploreCityPlatform = el.dataset.p;
    const host = document.getElementById('exploreDetail');
    if(host && state.exploreOpenCityId) host.innerHTML = renderExploreDetail('city', state.exploreOpenCityId);
    if(state.exploreOpenCityId) loadExploreCityList(state.exploreOpenCityId);
  }
  else if(a==='radar-tab'){ state.radarTab = el.dataset.t; renderView(); }
  else if(a==='open-paywall'){ openPaywall(); }
  else if(a==='close-paywall'){ closePaywall(); }
  else if(a==='activate-pro'){
    if(state.user){ state.user.isPro = true; }
    persistState();
    closePaywall();
    toast(tr('toast.proActivated'));
    renderView();
    if(!document.getElementById('trackOverlay').classList.contains('hidden')) renderTrackOverlay();
  }
  else if(a==='toggle-pf-genre'){
    el.classList.toggle('on');
    if(el.classList.contains('on')){ el.style.background = el.style.color+'22'; el.style.borderColor = el.style.color; }
    else { el.style.background=''; el.style.borderColor=''; }
  }
  else if(a==='save-profile'){
    const name = document.getElementById('pf_name').value.trim() || 'DJ';
    const country = document.getElementById('pf_country').value;
    const city = document.getElementById('pf_city').value;
    const genres = [...document.querySelectorAll('#pf_genres .gcheck.on')].map(x=>x.dataset.g);
    const ig = document.getElementById('pf_ig').value.trim();
    const sc = document.getElementById('pf_sc').value.trim();
    state.user = {...state.user, artistName:name, country, city, genres: genres.length?genres:['afro-house'], instagram:ig, soundcloud:sc};
    persistState();
    toast(tr('toast.profileCreated'));
    renderView();
  }
  else if(a==='open-admin'){ openAdmin(); }
  else if(a==='close-admin'){ closeAdmin(); }
  else if(a==='set-lang'){ setLang(el.dataset.lang); }
});
document.addEventListener('change', (e)=>{
  if(e.target.dataset.action==='select-country'){ state.selectedCountry = e.target.value; renderView(); }
  if(e.target.dataset.action==='select-city'){ state.selectedCity = e.target.value; renderView(); }
});

function enterApp(){
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('appScreen').classList.remove('hidden');
  state.view='home';
  renderView();
}

/* init: render immediately on the auth screen, then light up real persistence
   once the db/user capabilities resolve — if a saved profile is found, skip
   straight past the auth screen for a returning DJ. */
applyI18n();
renderAuthScreen();
initPersistence().then(()=>{
  if(state.user){ enterApp(); }
});
initNativeShell();
