import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

// Publishable key: safe in the browser, access is enforced by RLS (members table).
const sb = createClient('https://bwnbtdyyozipenkyupru.supabase.co', 'sb_publishable_tfM5mf8eYl1NQI4zw4jyKw_oWdG4ezF');

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = n => '€' + (Math.round(n * 100) / 100).toLocaleString('nl-BE', { maximumFractionDigits: 2 });
const when = t => new Date(t).toLocaleString('nl-BE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const icons = () => window.lucide?.createIcons();
function toast(m) { const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 3500); }

/* ---------- content ---------- */
const LISTS = {
  'fp-merge': ['Foodplug', [['repo', 'Haider deelt repo + nodigt ons uit'], ['basis', 'Basisversie kiezen (optie 3)'], ['kleur', 'Rood + geel/goud van Haider'], ['paginas', "Haiders pagina's in Amines stijl, minder tekst"], ['bestel', 'Aparte bestelpagina (afhalen/betalen)'], ['delete', 'Verwijder-icoon bij laatste item'], ['anim', 'Loading- en algemene animaties'], ['test', 'Zayd test + bug-feedback']]],
  'fp-dinsdag': ['Foodplug', [['flow', 'Demo: bestellen → ticket bij Foodplug'], ['menu', "Echt menu + foto's in de demo"], ['pitch', 'Testfase kunnen uitleggen'], ['prijs', 'Prijs afspreken onder ons'], ['vragen', 'Vragen klaar: uren, leverzones, wie neemt aan, welk toestel']]],
  'fp-test': ['Foodplug', [['korting', 'Korting voor online bestellen kiezen'], ['banner', 'Fallback-banner "Bestel via WhatsApp"'], ['toestel', 'Toestel voor tickets kiezen'], ['handleiding', 'Handleiding van 1 pagina'], ['eval', 'Evaluaties in de agenda']]],
  'fp-later': ['Foodplug', [['betalen', 'Betalen: Mollie/Stripe + cash'], ['privacy', 'Privacyverklaring'], ['domein', 'Domein op naam van Foodplug'], ['video', 'Promovideo afspreken']]],
  'ld-a': ['Loodgieters', [['punten', 'Verbeterpunten verzamelen'], ['info', "Echte info: diensten, regio, foto's, reviews"], ['template', 'Template-delen herbruikbaar maken'], ['contact', 'Contact + prijsvoorstel']]],
  'ld-b': ['Loodgieters', [['info', "Info: diensten, regio, foto's, reviews"], ['template', 'Starten vanaf template van Amine'], ['anders', 'Ander uiterlijk dan Loodgieter A'], ['contact', 'Contact + prijsvoorstel']]],
  'prijs': ['Prijzen', [['vast', 'Prijzen samen vastleggen'], ['host', 'Vercel Pro of Cloudflare Pages kiezen'], ['starter', 'Hoeveel klanten krijgen starterskorting?']]],
  'diensten': ['Diensten', [['templates', 'Templates per sector'], ['cms', 'CMS kiezen en testen'], ['boek', 'Boekingssysteem uitwerken']]],
  'admin': ['Admin', [['akkoord', 'Akkoord op papier: wat, prijs, timing'], ['vorm', 'Vorm: zelfstandige in bijberoep of student-zelfstandige'], ['kbo', 'Ondernemingsloket → KBO-nummer + sociaal verzekeringsfonds'], ['btw', 'Btw-vrijstelling kleine onderneming (< €25.000/jaar)'], ['bank', 'Aparte bankrekening'], ['offerte', 'Offerte: scope, prijs, 50% voorschot, eigendom, portfolio'], ['factuur', 'Factuursjabloon'], ['verdelen', 'Betaald → kosten eraf → ÷3']]],
  'gdpr': ['GDPR', [['minimaal', 'Enkel nodige data: naam, tel, adres, bestelling'], ['privacy', 'Privacyverklaring op de site'], ['bewaar', 'Bewaartermijn (bv. 6 maanden) + automatisch wissen'], ['eu', 'Database in EU-regio'], ['toegang', 'Toegang beperken tot klant + onderhoud'], ['dpa', 'Verwerkersovereenkomst bij de offerte'], ['cookies', 'Cookiebanner alleen bij tracking'], ['lek', 'Datalek → binnen 72 u melden bij de GBA']]],
  'team': ['Team', [['onenig', 'Regel bij onenigheid'], ['rollen', 'Rollen verdelen'], ['naam', 'Naam kiezen'], ['logo', 'Logo'], ['site', 'Eigen website / portfolio'], ['deploy', 'Startbord online zetten'], ['claude', 'Claude-assistent terug (API-key + kosten bekijken)']]],
  'klanten': ['Klanten', [['lijst', 'Lijst van 20 lokale zaken'], ['demo', 'Demo per sector klaar'], ['pitch', 'Pitchbericht voor WhatsApp/Insta'], ['ref', 'Doorverwijskorting bepalen'], ['review', 'Na oplevering: Google-review vragen']]],
};
const AREAS = { Foodplug: 'projecten', Loodgieters: 'projecten', Prijzen: 'prijzen', Diensten: 'diensten', Admin: 'admin', GDPR: 'admin', Team: 'team', Klanten: 'klanten' };
const PROJECTS = { foodplug: 'Foodplug', 'lood-a': 'Loodgieter A', 'lood-b': 'Loodgieter B' };

/* ---------- state ---------- */
// One shared team account; who you are is a local choice (trusted team, not a security boundary).
const TEAM_EMAIL = 'team@startbord.app';
let me = null, entered = false;
const S = { checks: {}, items: [] };
const COLORS = { Zayd: '#FF7A3D', Amine: '#F5C451', Haider: '#7FB3FF' };
const name = n => n || '?';
const color = n => COLORS[n] || '#A3A1B8';
const av = (n, cls = '') => `<span class="av ${cls}" style="--c:${color(n)}">${esc(name(n).slice(0, 1).toUpperCase())}</span>`;
const store = { get: () => { try { return localStorage.getItem('startbord-who'); } catch { return null; } }, set: v => { try { v ? localStorage.setItem('startbord-who', v) : localStorage.removeItem('startbord-who'); } catch {} } };

/* ---------- routing ---------- */
function show() {
  const h = location.hash.slice(1) || 'overzicht';
  const id = $('#' + CSS.escape(h))?.classList.contains('view') ? h : 'overzicht';
  $$('.view').forEach(v => v.hidden = v.id !== id);
  $$('#nav a').forEach(a => a.getAttribute('href') === '#' + id ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  scrollTo(0, 0);
}
addEventListener('hashchange', show);

/* ---------- checklists & feedback: build shells once, fill on every load ---------- */
for (const el of $$('[data-list]')) {
  const k = el.dataset.list;
  el.innerHTML = `<div class="cl"></div><form class="add" data-add="${k}"><input type="text" maxlength="200" placeholder="+ Taak toevoegen" aria-label="Taak toevoegen"><button class="ghost" type="submit">Voeg toe</button></form>`;
}
for (const el of $$('[data-fb]')) {
  const p = el.dataset.fb;
  el.innerHTML = `<div class="feed"></div><form class="fbform" data-fbform="${p}"><textarea maxlength="2000" placeholder="Feedback voor ${esc(PROJECTS[p])}…" aria-label="Feedback voor ${esc(PROJECTS[p])}"></textarea><button type="submit"><i data-lucide="send"></i>Plaats</button></form>`;
}
for (const el of $$('[data-links]')) el.insertAdjacentHTML('afterend', `<button class="ghost" type="button" data-addlink="${el.dataset.links}" style="padding:6px 12px;font-size:13px"><i data-lucide="plus"></i>Link</button>`);

const taskRow = (id, text, extra) => {
  const c = S.checks[id];
  return `<label class="task${c ? ' done' : ''}"><input type="checkbox" data-check="${esc(id)}"${c ? ' checked' : ''}><span class="t">${esc(text)}</span>${extra ? '<span class="added">nieuw</span>' : ''}${c ? `<span class="who">${av(c.by, 'sm')}</span>` : ''}</label>`;
};
const listIds = k => [...LISTS[k][1].map(([id]) => k + ':' + id), ...S.items.filter(i => i.kind === 'task' && i.ref === k).map(i => 'x:' + i.id)];
const msg = f => `<div class="msg${f.by === me ? ' mine' : ''}">${av(f.by)}<div><div class="meta"><b>${esc(name(f.by))}</b>${when(f.at)}${f.by === me ? `<button class="del" type="button" data-del="${f.id}">verwijder</button>` : ''}</div><div class="body">${esc(f.text)}</div></div></div>`;

function render() {
  for (const el of $$('[data-list]')) {
    const k = el.dataset.list;
    $('.cl', el).innerHTML = LISTS[k][1].map(([id, t]) => taskRow(k + ':' + id, t)).join('')
      + S.items.filter(i => i.kind === 'task' && i.ref === k).map(i => taskRow('x:' + i.id, i.text, true)).join('');
  }
  for (const el of $$('[data-count]')) { const ids = listIds(el.dataset.count); el.textContent = ids.filter(i => S.checks[i]).length + '/' + ids.length; }
  const areas = {};
  for (const k in LISTS) { const a = (areas[LISTS[k][0]] ||= [0, 0]); const ids = listIds(k); a[0] += ids.filter(i => S.checks[i]).length; a[1] += ids.length; }
  $('#progress').innerHTML = Object.entries(areas).map(([a, [d, t]]) => { const p = Math.round(d / t * 100); return `<a class="ring${p === 100 ? ' full' : ''}" href="#${AREAS[a]}"><span class="r" style="--p:${p}"><span>${p}%</span></span>${esc(a)}</a>`; }).join('');
  const fb = S.items.filter(i => i.kind === 'feedback');
  for (const el of $$('[data-fb]')) { const l = fb.filter(f => f.ref === el.dataset.fb); $('.feed', el).innerHTML = l.length ? l.map(msg).join('') : '<p class="empty">Nog niets. Schrijf de eerste feedback.</p>'; }
  const recent = [...fb].reverse().slice(0, 6);
  $('#recent').innerHTML = recent.length ? recent.map(f => `<div><span class="chip">${esc(PROJECTS[f.ref] || f.ref)}</span>${msg(f)}</div>`).join('') : '<p class="empty">Nog geen feedback. Ga naar <a href="#projecten">Projecten</a>.</p>';
  for (const el of $$('[data-links]')) el.innerHTML = S.items.filter(i => i.kind === 'link' && i.ref === el.dataset.links).map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener"><i data-lucide="link"></i>${esc(l.text)}</a>`).join('');
  icons();
}

/* ---------- data ---------- */
async function load() {
  const [c, i, kv] = await Promise.all([sb.from('checks').select('*'), sb.from('items').select('*').order('at'), sb.from('kv').select('*')]);
  if (c.error || i.error || kv.error) return toast('Laden mislukt. Herlaad de pagina.');
  S.checks = Object.fromEntries(c.data.map(r => [r.id, r]));
  S.items = i.data;
  const p = kv.data.find(r => r.key === 'prices')?.value;
  if (p && !document.activeElement?.matches?.('[data-price]')) { prices = merge(DEF, p); drawPrices(); }
  render();
}
let reloadT;
const reload = () => { clearTimeout(reloadT); reloadT = setTimeout(load, 300); };

document.addEventListener('change', async e => {
  const id = e.target.dataset?.check; if (!id) return;
  const on = e.target.checked;
  const { error } = on ? await sb.from('checks').upsert({ id, by: me }) : await sb.from('checks').delete().eq('id', id);
  if (error) { e.target.checked = !on; toast('Opslaan mislukt'); } else load();
});
document.addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target;
  if (f.id === 'login-form') return login();
  const ref = f.dataset.add || f.dataset.fbform; if (!ref) return;
  const field = $('input,textarea', f), text = field.value.trim(); if (!text) return;
  const { error } = await sb.from('items').insert({ kind: f.dataset.add ? 'task' : 'feedback', ref, text, by: me });
  if (error) return toast('Opslaan mislukt');
  field.value = ''; load();
});
document.addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.del) { const { error } = await sb.from('items').delete().eq('id', b.dataset.del); error ? toast('Verwijderen mislukt') : load(); }
  if (b.dataset.addlink) {
    const url = prompt('Link (https://…)'); if (!url) return;
    if (!/^https?:\/\/\S+$/i.test(url)) return toast('Alleen http(s)-links');
    const text = prompt('Naam van de link', new URL(url).hostname) || new URL(url).hostname;
    const { error } = await sb.from('items').insert({ kind: 'link', ref: b.dataset.addlink, text: text.slice(0, 80), url, by: me });
    error ? toast('Opslaan mislukt') : load();
  }
  if ('logout' in b.dataset) { store.set(null); await sb.auth.signOut(); location.reload(); }
  if ('switch' in b.dataset) { store.set(null); location.reload(); }
  if (b.dataset.who) { store.set(b.dataset.who); location.reload(); }
  if (b.dataset.preset) applyPreset(b.dataset.preset);
});

/* ---------- calculator ---------- */
const DEF = { packs: { landing: 250, site: 450 }, opts: { cms: 200, bestel: 300, betaal: 150, boek: 250, taal: 100, seo: 75, logo: 100 }, page: 50, maint: { geen: 0, basis: 15, zorgeloos: 35, pro: 60 } };
const N = {
  packs: { landing: 'Landingspagina', site: "Website tot 5 pagina's" },
  opts: { cms: 'CMS (klant past zelf aan)', bestel: 'Bestel-/ticketsysteem', betaal: 'Online betalen', boek: 'Boekingssysteem', taal: 'Meertalig NL/FR/EN', seo: 'Lokale SEO + Google-profiel', logo: 'Basis logo & huisstijl' },
  maint: { geen: ['Geen', ['Alleen opleveren', 'Klant host zelf']], basis: ['Basis', ['Hosting, SSL, domein', 'Back-ups', '1 tekstwijziging /maand']], zorgeloos: ['Zorgeloos', ['Alles van Basis', 'Bestel-/boeksysteem bewaakt', '1 u wijzigingen /maand', 'Reactie < 24 u']], pro: ['Pro', ['Alles van Zorgeloos', 'Betalingen opgevolgd', 'Maandrapport', '2 u wijzigingen, voorrang']] },
};
const merge = (a, b) => ({ packs: { ...a.packs, ...b.packs }, opts: { ...a.opts, ...b.opts }, page: b.page ?? a.page, maint: { ...a.maint, ...b.maint } });
let prices = merge(DEF, {});

export function calc(sel, p) {
  const base = p.packs[sel.pack] + sel.opts.reduce((s, k) => s + p.opts[k], 0) + sel.pages * p.page;
  const price = Math.round(base * (1 - sel.disc / 100) / 5) * 5;
  const m = p.maint[sel.maint];
  return { base, price, pp: price / 3, m, year: price + m * 12 };
}
console.assert(calc({ pack: 'site', opts: ['bestel'], pages: 0, disc: 60, maint: 'geen' }, DEF).price === 300, 'Foodplug-referentie moet €300 zijn');
console.assert(calc({ pack: 'landing', opts: [], pages: 1, disc: 0, maint: 'basis' }, DEF).year === 480, 'jaar 1 = prijs + 12 × onderhoud');

const priceInput = (path, v) => `<span class="eur">€</span><input type="number" min="0" step="5" value="${v}" data-price="${path}" aria-label="Bedrag">`;
function drawPrices() {
  const sel = readSel();
  $('#packs').innerHTML = Object.keys(N.packs).map(k => `<div class="line"><label><input type="radio" name="pack" value="${k}"${(sel?.pack ?? 'site') === k ? ' checked' : ''}>${N.packs[k]}</label>${priceInput('packs.' + k, prices.packs[k])}</div>`).join('');
  $('#opts').innerHTML = Object.keys(N.opts).map(k => `<div class="line"><label><input type="checkbox" value="${k}"${sel?.opts.includes(k) ? ' checked' : ''}>${N.opts[k]}</label><span class="eur">+</span>${priceInput('opts.' + k, prices.opts[k])}</div>`).join('')
    + `<div class="line"><label>Prijs per extra pagina</label>${priceInput('page', prices.page)}</div>`;
  $('#maint').innerHTML = Object.keys(N.maint).map(k => `<label><input type="radio" name="maint" value="${k}"${(sel?.maint ?? 'geen') === k ? ' checked' : ''}><span>${N.maint[k][0]}${prices.maint[k] ? ' €' + prices.maint[k] : ''}</span></label>`).join('');
  $('#tiers').innerHTML = Object.keys(N.maint).map(k => `<div class="tier${k === 'zorgeloos' ? ' hl' : ''}"><span class="eyebrow">${N.maint[k][0]}</span><div class="line" style="padding:0">${priceInput('maint.' + k, prices.maint[k])}<small class="muted">/maand</small></div><ul>${N.maint[k][1].map(x => `<li><i data-lucide="check"></i>${esc(x)}</li>`).join('')}</ul></div>`).join('');
  drawCalc(); icons();
}
function readSel() {
  if (!$('#packs input')) return null;
  return { pack: $('#packs input:checked')?.value || 'site', opts: $$('#opts input[type=checkbox]:checked').map(i => i.value), pages: Math.max(0, Math.min(20, +$('#pages').value || 0)), disc: +$('#disc input:checked').value, maint: $('#maint input:checked')?.value || 'geen' };
}
function drawCalc() {
  const r = calc(readSel(), prices);
  $('#o-price').textContent = eur(r.price); $('#o-base').textContent = eur(r.base); $('#o-pp').textContent = eur(r.pp); $('#o-m').textContent = eur(r.m); $('#o-y').textContent = eur(r.year);
}
let saveT;
document.addEventListener('input', e => {
  if (!e.target.closest('#prijzen')) return;
  const path = e.target.dataset.price;
  if (path) {
    const v = Math.max(0, Math.min(100000, +e.target.value || 0)), [a, b] = path.split('.');
    b ? prices[a][b] = v : prices[a] = v;
    clearTimeout(saveT);
    saveT = setTimeout(async () => { const { error } = await sb.from('kv').upsert({ key: 'prices', value: prices }); error ? toast('Prijs opslaan mislukt') : toast('Prijzen bewaard'); }, 700);
  }
  drawCalc();
});
const PRESETS = { foodplug: { pack: 'site', opts: ['bestel'], disc: 60, maint: 'zorgeloos' }, lood: { pack: 'landing', opts: ['seo'], disc: 25, maint: 'basis' } };
function applyPreset(k) {
  const p = PRESETS[k];
  $$('#packs input').forEach(i => i.checked = i.value === p.pack);
  $$('#opts input[type=checkbox]').forEach(i => i.checked = p.opts.includes(i.value));
  $('#pages').value = 0;
  $$('#disc input').forEach(i => i.checked = +i.value === p.disc);
  $$('#maint input').forEach(i => i.checked = i.value === p.maint);
  drawCalc();
}

/* ---------- auth ---------- */
async function login() {
  const { error } = await sb.auth.signInWithPassword({ email: TEAM_EMAIL, password: $('#login-pw').value });
  $('#login-msg').textContent = error ? 'Verkeerd wachtwoord.' : '';
}
async function enter() {
  if (entered) return;
  me = store.get();
  if (!COLORS[me]) { $('#gate').hidden = false; $('#gate-login').hidden = true; $('#gate-who').hidden = false; return; }
  entered = true;
  $('#gate').hidden = true; $('#app').hidden = false;
  $('#me-av').outerHTML = av(me); $('#me-name').textContent = name(me);
  const d = Math.ceil((new Date('2026-10-27T00:00:00') - new Date()) / 864e5);
  $('#days').textContent = Math.max(0, d);
  show(); drawPrices(); await load();
  sb.channel('startbord').on('postgres_changes', { event: '*', schema: 'public' }, reload).subscribe();
  addEventListener('focus', reload);
}
sb.auth.onAuthStateChange((ev, s) => { if (s && (ev === 'SIGNED_IN' || ev === 'INITIAL_SESSION')) enter(s); });
const { data: { session } } = await sb.auth.getSession();
session ? enter(session) : ($('#gate').hidden = false);
icons();
