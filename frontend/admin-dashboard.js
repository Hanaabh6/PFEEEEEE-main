(function(){
  const apiBase = window.APP_CONFIG && window.APP_CONFIG.API_BASE ? window.APP_CONFIG.API_BASE : '';
  const el = {
    infoOverlay: document.getElementById('infoOverlay'),
    overlayTitle: document.getElementById('overlayTitle'),
    overlayBody: document.getElementById('overlayBody'),
    overlayClose: document.getElementById('overlayClose'),
    overlayBackdrop: document.getElementById('overlayBackdrop'),
    globalSearch: document.getElementById('globalSearch'),
    profileButton: document.getElementById('profileButton'),
    profileDropdown: document.getElementById('profileDropdown'),
    profileAvatar: document.getElementById('profileAvatar'),
    profileName: document.getElementById('profileName'),
    notifBadge: document.getElementById('notifBadge'),
    positionDebugText: document.getElementById('positionDebugText'),
    tableBody: document.getElementById('tableBody'),
    activityBody: document.getElementById('activityBody'),
    kpiTotal: document.getElementById('kpiTotal'), kpiActive: document.getElementById('kpiActive'), kpiActivePct: document.getElementById('kpiActivePct'), barActive: document.getElementById('barActive'),
    kpiInactive: document.getElementById('kpiInactive'), kpiInactivePct: document.getElementById('kpiInactivePct'), barInactive: document.getElementById('barInactive'),
    kpiBroken: document.getElementById('kpiBroken'), barBroken: document.getElementById('barBroken'),
    kpiBorrowed: document.getElementById('kpiBorrowed'), barBorrowed: document.getElementById('barBorrowed'),
    kpiReports: document.getElementById('kpiReports'), barReports: document.getElementById('barReports'),
    kpiViews: document.getElementById('kpiViews'), kpiRooms: document.getElementById('kpiRooms')
  };
  let objectCacheById = {}, adminProfileData = null, chartInstances = {};

  function authHeaders() {
    const token = localStorage.getItem('userToken') || '';
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  }
  function getPos() {
    return { room: localStorage.getItem('user_room')||'', x: Number(localStorage.getItem('user_x')||0), y: Number(localStorage.getItem('user_y')||0), z: Number(localStorage.getItem('user_z')||0) };
  }
  function updatePositionBadge(){
    if(!el.positionDebugText) return;
    const room=String(localStorage.getItem('user_room')||'').trim();
    el.positionDebugText.textContent=room||'Salle inconnue';
  }
  function norm(v) { return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(); }
  function isAvail(v) { const n=norm(v); return n==='active' || n==='disponible'; }
  function isBroken(v) { return ['panne','en panne','inactive','inactif','indisponible','non disponible','unavailable','hors service','hors-service','hors ligne','hors-ligne','broken','out of order','out_of_order','hs'].includes(norm(v)); }
  function mapStatusLabel(s){
    const n = norm(s||'');
    if(!n) return 'Inconnu';
    if(n==='active' || n==='disponible' || n==='available') return 'Disponible';
    if(n==='borrowed' || n.includes('emprunt') || n.includes('en_utilisation') || n.includes('en utilisation') || n.includes('en_util')) return 'En utilisation';
    if(n.includes('panne') || n.includes('hs') || n.includes('hors')) return 'En panne';
    if(n==='inactive' || n.includes('inact') || n.includes('indisponibl')) return 'Indisponible';
    return String(s||'').charAt(0).toUpperCase()+String(s||'').slice(1);
  }
  function dStatus(i) { return String(i&&i.maintenance_state?i.maintenance_state:'').trim() || String(i&&(i.status||i.availability)?(i.status||i.availability):'inconnu'); }
  function canReac(i) { const ds=dStatus(i), cb=i&&typeof i.current_borrow==='object'?i.current_borrow:null; if(cb||norm(ds)==='en_utilisation'||norm(i&&i.availability)==='en_utilisation')return false; if(norm(i&&i.maintenance_state)||isBroken(ds)||isBroken(i&&i.status)||isBroken(i&&i.availability))return true; if(isAvail(ds)||isAvail(i&&i.status)||isAvail(i&&i.availability))return false; return false; }
  function gRoom(s) { const l=s&&typeof s==='object'&&Object.prototype.hasOwnProperty.call(s,'location')?s.location:s; if(typeof l==='string')return String(l).trim(); if(!l||typeof l!=='object')return''; return String(l.room||l.name||'').trim(); }
  function gFloor(i){
    try{
      const l = i && typeof i==='object' && Object.prototype.hasOwnProperty.call(i,'location') ? i.location : i;
      if(!l) return '';
      return String(l.floor || l.level || l.etage || l.floor_name || l.floorName || l.levelName || '').trim();
    }catch(e){return '';}
  }
  function esc(v){ return String(v||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'<','>':'>','"':'"'}[c]||'&#39;')); }
  function openOverlay(t,h){ el.overlayTitle.textContent=t; el.overlayBody.innerHTML=h; el.infoOverlay.hidden=false; el.infoOverlay.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; el.overlayClose.focus(); }
  function closeOverlay(){ el.infoOverlay.hidden=true; el.infoOverlay.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  function applyName(n){ const s=String(n||'').trim(); if(!s)return; el.profileName.textContent=s; el.profileAvatar.textContent=(s[0]||'A').toUpperCase(); }

  function readH(){ try{const r=localStorage.getItem('adminHistory');const p=r?JSON.parse(r):[];return Array.isArray(p)?p:[];}catch{return[];} }
  function writeH(v){ localStorage.setItem('adminHistory',JSON.stringify(v.slice(0,30))); }
  function addH(a,d,s){ const t=localStorage.getItem('userToken'); if(t) fetch(`${apiBase}/admin/history`,{method:'POST',headers:authHeaders(),body:JSON.stringify({action:a,detail:d,status:s||'Succes'})}).catch(()=>{}); }

  async function loadProfile(){
    try{ const r=await fetch(`${apiBase}/user/profile`,{headers:authHeaders()}); if(!r.ok)return; const p=await r.json(); adminProfileData=p; if(String(p.role||'').toLowerCase()&&String(p.role||'').toLowerCase()!=='admin'){window.location.href='user.html';return;} const em=String(p.email||localStorage.getItem('userEmail')||'admin@intellibuild.com'); const disp=String(localStorage.getItem('adminDisplayName')||'').trim()||String(p.display_name||'').trim()||em.split('@')[0]||'Admin'; localStorage.setItem('userRole','admin'); localStorage.setItem('userEmail',em); localStorage.setItem('adminDisplayName',disp); applyName(disp); }catch(e){console.error('Profil:',e);}
  }

  function anim(elm,start,end,dur){
    if(!elm) return;
    const range=end-start,t0=performance.now();
    function step(now){ const p=Math.min((now-t0)/dur,1); elm.textContent=Math.floor(start+range*(1-Math.pow(1-p,3))).toLocaleString('fr-FR'); if(p<1)requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  async function loadStats(){
    try{ const r=await fetch(`${apiBase}/admin/stats/overview`,{headers:authHeaders()}); if(!r.ok)return; const d=await r.json(); const tot=d.total||0;
    anim(el.kpiTotal,0,tot,800); anim(el.kpiActive,0,d.active||0,800); anim(el.kpiInactive,0,d.inactive||0,800); anim(el.kpiBroken,0,d.broken||0,800);
    anim(el.kpiBorrowed,0,d.borrowed||0,800); anim(el.kpiReports,0,d.pending_reports||0,800); anim(el.kpiViews,0,d.total_views||0,800); anim(el.kpiRooms,0,d.rooms||0,800);
    const pA=tot?Math.round((d.active/tot)*100):0, pI=tot?Math.round((d.inactive/tot)*100):0;
    el.kpiActivePct.textContent=pA+'% du total'; el.kpiInactivePct.textContent=pI+'% du total';
    el.barActive.style.width=pA+'%'; el.barInactive.style.width=pI+'%';
    el.barBroken.style.width=tot?Math.min(100,Math.round(((d.broken||0)/tot)*100))+'%':'0%';
    el.barBorrowed.style.width=tot?Math.min(100,Math.round(((d.borrowed||0)/tot)*100))+'%':'0%';
    el.barReports.style.width=tot?Math.min(100,Math.round(((d.pending_reports||0)/tot)*100))+'%':'0%';
    }catch(e){console.error('Stats:',e);}
  }

  async function initCharts(){
    const cols=['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316'];
    const scols={active:'#10b981',inactive:'#ef4444',en_utilisation:'#f59e0b',panne:'#f97316',autre:'#94a3b8'};
    const [bt,bs,tv,tr] = await Promise.all([
      fetch(`${apiBase}/admin/stats/by-type`,{headers:authHeaders()}).then(r=>r.ok?r.json():[]).catch(()=>[]),
      fetch(`${apiBase}/admin/stats/by-status`,{headers:authHeaders()}).then(r=>r.ok?r.json():[]).catch(()=>[]),
      fetch(`${apiBase}/admin/stats/top-viewed?limit=6`,{headers:authHeaders()}).then(r=>r.ok?r.json():[]).catch(()=>[]),
      fetch(`${apiBase}/admin/stats/top-reported?limit=6`,{headers:authHeaders()}).then(r=>r.ok?r.json():[]).catch(()=>[])
    ]);
    const copt={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{display:false},beginAtZero:true}}};
    Object.values(chartInstances).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') chart.destroy();
    });

    function setBarChartHeight(canvasId, labelCount) {
      const canvas = document.getElementById(canvasId);
      if (!canvas || !canvas.parentElement) return;
      const rows = Math.max(1, Number(labelCount) || 0);
      canvas.parentElement.style.height = Math.max(160, rows * 48) + 'px';
    }

    function barChartOptions(values) {
      const numericValues = Array.isArray(values) ? values.map(v => Math.max(0, Number(v) || 0)) : [];
      const maxValue = numericValues.length ? Math.max(...numericValues) : 0;
      return {
        ...copt,
        indexAxis:'y',
        scales:{
          x:{
            beginAtZero:true,
            max:Math.max(1, maxValue),
            ticks:{
              stepSize:1,
              precision:0
            },
            grid:{
              color:'rgba(148, 163, 184, 0.18)'
            }
          },
          y:{
            beginAtZero:true,
            ticks:{
              autoSkip:false
            },
            grid:{
              display:true,
              color:'rgba(148, 163, 184, 0.12)',
              drawBorder:false
            }
          }
        }
      };
    }

    const topViewedLabels = (tv||[]).map(x=>x.name||'Sans nom').slice(0,6);
    const topViewedValues = (tv||[]).map(x=>x.view_count||0).slice(0,6);
    const topReportedLabels = (tr||[]).map(x=>x.thing_name||'Inconnu').slice(0,6);
    const topReportedValues = (tr||[]).map(x=>x.count||0).slice(0,6);

    setBarChartHeight('chartTopViewed', topViewedLabels.length);
    setBarChartHeight('chartTopReported', topReportedLabels.length);

    chartInstances.type=new Chart(document.getElementById('chartByType'),{type:'doughnut',data:{labels:(bt||[]).map(x=>x.type||'Inconnu'),datasets:[{data:(bt||[]).map(x=>x.count||0),backgroundColor:cols,borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{boxWidth:12,font:{size:11}}}},cutout:'65%'}});
    chartInstances.status=new Chart(document.getElementById('chartByStatus'),{type:'doughnut',data:{labels:(bs||[]).map(x=>x.status||'Inconnu'),datasets:[{data:(bs||[]).map(x=>x.count||0),backgroundColor:(bs||[]).map(x=>scols[x.status]||'#94a3b8'),borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{boxWidth:12,font:{size:11}}}},cutout:'65%'}});
    chartInstances.viewed=new Chart(document.getElementById('chartTopViewed'),{type:'bar',data:{labels:topViewedLabels,datasets:[{label:'Vues',data:topViewedValues,backgroundColor:'#10b981',borderRadius:6,maxBarThickness:22}]},options:barChartOptions(topViewedValues)});
    chartInstances.reported=new Chart(document.getElementById('chartTopReported'),{type:'bar',data:{labels:topReportedLabels,datasets:[{label:'Signalements',data:topReportedValues,backgroundColor:'#ef4444',borderRadius:6,maxBarThickness:22}]},options:barChartOptions(topReportedValues)});
  }

  async function loadActivity(){
    if(!el.activityBody) return; // activity section removed from layout
    try{ const r=await fetch(`${apiBase}/admin/stats/recent-activity?limit=10`,{headers:authHeaders()}); if(!r.ok)throw new Error(); const d=await r.json();
    const rows=(Array.isArray(d)?d:[]).map(a=>{ const st=String(a.status||'-').toLowerCase(); let bc='info'; if(st.includes('succes')||st.includes('disponible'))bc='success'; else if(st.includes('echec')||st.includes('erreur'))bc='danger'; else if(st.includes('attente'))bc='warning'; return `<tr><td>${esc(a.created_at||a.date||'-')}</td><td>${esc(a.email||'-')}</td><td>${esc(a.action||'-')}</td><td>${esc(a.detail||'-')}</td><td><span class="activity-badge ${bc}">${esc(a.status||'-')}</span></td></tr>`; }).join('');
    el.activityBody.innerHTML=rows||'<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:24px;">Aucune activité récente.</td></tr>';
    }catch(e){ if(el.activityBody) el.activityBody.innerHTML='<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:24px;">Erreur chargement.</td></tr>'; }
  }

  async function checkNotifs(){
    try{ const r=await fetch(`${apiBase}/notifications/count`,{headers:authHeaders()}); if(!r.ok)return; const d=await r.json(); const n=d.unread||0;
    if(n>0){ el.notifBadge.textContent=n>99?'99+':n; el.notifBadge.style.display='grid'; } else { el.notifBadge.style.display='none'; }
    }catch(e){}
  }

  async function loadObjects(query){
    try{ const pos=getPos(); const r=await fetch(`${apiBase}/things/search`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({search_query:String(query||'').trim(),user_room:pos.room,user_x:pos.x,user_y:pos.y,user_z:pos.z})});
    const items=await r.json(); objectCacheById={}; const tb=el.tableBody; tb.innerHTML='';
    items.forEach(item=>{
      const id=String(item.id||'').trim(); if(id) objectCacheById[id]=item;
      const nm=item.name||'Sans nom';
      const tp=item.type||item['@type']||'Objet';
      const locRaw=gRoom(item)||'N/A';
      const floorRaw=gFloor(item);
      const locDisplay = floorRaw ? (locRaw + ' — ' + floorRaw) : locRaw;
      const rawSt=dStatus(item);
      const st=mapStatusLabel(rawSt);
      const reac=canReac(item)?`<button onclick="window.reac('${esc(id)}')" class="rounded border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50">Activer</button>`:'';
      const tr=document.createElement('tr'); tr.className='hover:bg-emerald-50/50 transition';
      tr.innerHTML=`<td class="p-3 font-medium text-sm"><a href="#" onclick="window.edit('${esc(id)}');return false;" class="truncate">${esc(nm)}</a></td><td class="p-3 text-sm text-slate-600">${esc(tp)}</td><td class="p-3 text-sm text-slate-600">${esc(locDisplay)}</td><td class="p-3"><span class="px-2 py-1 rounded-full text-[10px] font-bold ${isAvail(rawSt)?'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-700'}">${esc(st)}</span></td><td class="p-3 text-right flex gap-1 justify-end">${reac}<button onclick="window.edit('${esc(id)}')" class="h-6 w-6 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs" title="Modifier"><i class="fas fa-pen"></i></button><button onclick="window.del('${esc(id)}')" class="h-6 w-6 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs" title="Supprimer"><i class="fas fa-trash"></i></button></td>`;
      tb.appendChild(tr);
    });
    addH('Consultation',(items.length)+' objets','Succes');
    }catch(e){console.error('Objets:',e);}
  }

  window.reac=async function(id){ try{ const r=await fetch(`${apiBase}/things/${encodeURIComponent(id)}/status`,{method:'PATCH',headers:authHeaders(),body:JSON.stringify({status:'active'})}); if(!r.ok){alert('Erreur');return;} addH('Remise en service',id,'Succes'); loadObjects(); loadStats(); initCharts(); loadActivity(); }catch(e){alert('Erreur réseau');} };
  window.del=async function(id){ if(!confirm('Supprimer cet objet ?'))return; try{ const r=await fetch(`${apiBase}/things/${encodeURIComponent(id)}`,{method:'DELETE',headers:authHeaders()}); if(!r.ok){alert('Erreur');return;} addH('Suppression',id,'Succes'); loadObjects(); loadStats(); initCharts(); loadActivity(); }catch(e){alert('Erreur réseau');} };
  window.edit=function(id){ const i=objectCacheById[id]; if(!i)return; const reacBtn=canReac(i)?`<div class="md:col-span-2 flex justify-end pt-2"><button onclick="window.reac('${esc(id)}');closeOverlay()" class="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold">Remettre en service</button></div>`:''; const dispStatus = mapStatusLabel(dStatus(i)); openOverlay('Détail',`<div class="glass-main p-6 rounded-3xl shadow-2xl"><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div class="bg-white/90 rounded-xl p-4 border border-slate-200"><p class="text-slate-500 font-semibold">Nom</p><p class="font-bold text-slate-800 mt-1">${esc(i.name)}</p></div><div class="bg-white/90 rounded-xl p-4 border border-slate-200"><p class="text-slate-500 font-semibold">Type</p><p class="font-bold text-slate-800 mt-1">${esc(i.type)}</p></div><div class="bg-white/90 rounded-xl p-4 border border-slate-200"><p class="text-slate-500 font-semibold">Localisation</p><p class="font-bold text-slate-800 mt-1">${esc(gRoom(i))}${gFloor(i)?' — '+esc(gFloor(i)) : ''}</p></div><div class="bg-white/90 rounded-xl p-4 border border-slate-200"><p class="text-slate-500 font-semibold">Vérifier</p><p class="font-bold text-slate-800 mt-1">${esc(dispStatus)}</p></div><div class="md:col-span-2 bg-white/90 rounded-xl p-4 border border-slate-200"><p class="text-slate-500 font-semibold">Description</p><p class="font-bold text-slate-800 mt-1">${esc(i.description||'-')}</p></div></div>${reacBtn}<div class="mt-4 text-right"><a href="objets.html?id=${esc(id)}" class="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold inline-block">Gérer dans l'inventaire</a></div></div>`); };

  el.profileButton.addEventListener('click',e=>{e.stopPropagation(); const o=el.profileDropdown.classList.toggle('open'); el.profileButton.setAttribute('aria-expanded',String(o));});
  document.addEventListener('click',e=>{ if(!el.profileDropdown.contains(e.target)&&!el.profileButton.contains(e.target)){el.profileDropdown.classList.remove('open'); el.profileButton.setAttribute('aria-expanded','false');} });
  document.getElementById('openProfileOverlay').addEventListener('click',async e=>{ e.preventDefault(); await loadProfile(); el.profileDropdown.classList.remove('open'); const name=String(localStorage.getItem('adminDisplayName')||'Admin'), email=String(adminProfileData&&adminProfileData.email?adminProfileData.email:localStorage.getItem('userEmail')||'admin@intellibuild.com'), room=String(localStorage.getItem('user_room')||'Non définie'); openOverlay('Mon profil',`<div class="glass-main p-6 rounded-3xl shadow-2xl"><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div class="bg-white/90 rounded-xl p-4 border border-slate-200"><p class="text-slate-500 font-semibold">Nom</p><p class="font-bold text-slate-800 mt-1">${esc(name)}</p></div><div class="bg-white/90 rounded-xl p-4 border border-slate-200"><p class="text-slate-500 font-semibold">Rôle</p><p class="font-bold text-slate-800 mt-1">Admin</p></div><div class="bg-white/90 rounded-xl p-4 border border-slate-200"><p class="text-slate-500 font-semibold">Email</p><p class="font-bold text-slate-800 mt-1">${esc(email)}</p></div><div class="bg-white/90 rounded-xl p-4 border border-slate-200"><p class="text-slate-500 font-semibold">Salle active</p><p class="font-bold text-slate-800 mt-1">${esc(room)}</p></div></div></div>`); });
  function showHistoryOverlay(){
    el.profileDropdown.classList.remove('open');
    openOverlay('Historique','<div class="p-4 text-slate-500">Chargement...</div>');
    (async()=>{
      try{
        const resp = await fetch(`${apiBase}/admin/history?limit=200`,{headers:authHeaders()});
        if(!resp.ok) throw new Error('history_fetch_failed');
        const ah = await resp.json().catch(()=>[]);
        const al=Array.isArray(ah)?ah:[];
        const rows = al.length ? al.map(i=>`<tr><td class="p-3 text-sm text-slate-600 whitespace-nowrap">${i.date||'-'}</td><td class="p-3 text-sm font-semibold text-slate-700">${esc(i.action)}</td><td class="p-3 text-sm">${esc(i.detail)}</td><td class="p-3 text-sm"><span class="px-3 py-1 rounded-full text-xs font-bold ${String(i.status||'').toLowerCase().includes('succes')?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}">${esc(i.status||'-')}</span></td></tr>`).join('') : '';

        if(rows){
          el.overlayBody.innerHTML=`<div class="glass-main p-6 rounded-3xl shadow-2xl"><h3 class="text-lg font-bold mb-3">Historique admin</h3><table class="w-full text-left"><thead class="text-gray-600 border-b border-gray-300"><tr class="text-[11px] uppercase font-bold tracking-wider"><th class="p-3">Date</th><th class="p-3">Action</th><th class="p-3">Détail</th><th class="p-3">Statut</th></tr></thead><tbody class="divide-y divide-gray-200">${rows}</tbody></table></div>`;
        } else {
          el.overlayBody.innerHTML=`<div class="glass-main p-6 rounded-3xl shadow-2xl"><h3 class="text-lg font-bold mb-3">Historique admin</h3><div class="p-4 text-slate-500">Aucun historique admin disponible.</div></div>`;
        }

      }catch(e){ el.overlayBody.innerHTML='<div class="text-red-600">Erreur chargement historique.</div>'; }
    })();
  }

  const _openHistoryEl = document.getElementById('openHistoryOverlay');
  if(_openHistoryEl){ _openHistoryEl.addEventListener('click', e=>{ e.preventDefault(); showHistoryOverlay(); }); }
  // Delegated handler: if element is injected or click target differs, still handle clicks
  document.addEventListener('click', function(e){ const a = e.target.closest && e.target.closest('#openHistoryOverlay'); if(a){ e.preventDefault(); showHistoryOverlay(); } });
  document.getElementById('logoutLink').addEventListener('click',e=>{ e.preventDefault(); localStorage.clear(); window.location.href='login.html'; });
  el.overlayClose.addEventListener('click',closeOverlay);
  el.overlayBackdrop.addEventListener('click',closeOverlay);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ el.profileDropdown.classList.remove('open'); if(!el.infoOverlay.hidden)closeOverlay(); } });

  window.addEventListener('load', async ()=>{
    const params = new URLSearchParams(window.location.search || '');
    const initialQuery = String(params.get('q') || '').trim();
    if (el.globalSearch && initialQuery) {
      el.globalSearch.value = initialQuery;
    }
    await loadProfile(); loadStats(); initCharts(); loadActivity(); checkNotifs(); loadObjects(initialQuery);
    updatePositionBadge();
    setInterval(()=>{ if(!document.hidden){ checkNotifs(); } }, 30000);
    setInterval(()=>{ if(!document.hidden){ loadStats(); loadActivity(); } }, 60000);
  });
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden){ loadObjects(el.globalSearch ? String(el.globalSearch.value || '').trim() : ''); loadStats(); updatePositionBadge(); } });
  window.addEventListener('storage',e=>{ if(e.key==='user_room'){ updatePositionBadge(); } });
  if (el.globalSearch) {
    el.globalSearch.addEventListener('input', function () {
      const q = String(this.value || '').trim();
      const nq = norm(q);
      // if user types 'verifier' show full list with normalized statuses
      if(nq && (nq==='verifier' || nq==='verif')){ loadObjects(''); return; }
      loadObjects(q);
    });
  }
})();