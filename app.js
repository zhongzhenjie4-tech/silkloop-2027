(()=>{
  'use strict';
  const D=window.TRIP_DATA, KEY='silkloop-2027-pocket-v1';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  for(const g of D.extraGuides||[])if(!D.guides.some(x=>x.id===g.id))D.guides.push(g);
  const stayShort=Object.fromEntries((D.accommodations||[]).map(c=>[c.id,c.primary.name.split(/[（/]/)[0].trim()]));
  for(const d of D.days)for(const r of d.rows){const id=r.accommodationRoutes?.[0]||d.accommodation?.cityId;if(!id)continue;const name=stayShort[id];if(!name)continue;const replace=t=>t.replace(/[^→，；。< ]{0,16}拟住[^→，；。< ]{0,20}片区/g,name).replace(/实际住宿|实际青旅|老城青旅|卡莱伊奇青旅|住宿片区|住处|青旅/g,name);r.title=replace(r.title);r.detail=replace(r.detail);r.plain=r.title+' '+r.detail.replace(/<[^>]*>/g,' ');}
  const paths={
    route:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h9a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h9"/>',
    map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Z"/><path d="M9 3v16M15 5v16"/>',
    note:'<path d="M14 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9"/><path d="m10 14 2-5 7-7 3 3-7 7-5 2Z"/>',
    bag:'<rect x="4" y="6" width="16" height="15" rx="3"/><path d="M9 6V4a3 3 0 0 1 6 0v2M4 12h16M9 10v4M15 10v4"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    chevron:'<path d="m8 4 8 8-8 8"/>',
    down:'<path d="m5 9 7 7 7-7"/>',
    locate:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>',
    expand:'<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
    pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    cloud:'<path d="M6 18a5 5 0 1 1 .8-9.9A6 6 0 0 1 18.6 9 4.5 4.5 0 0 1 18 18Z"/>',
    check:'<path d="m5 12 4 4L20 5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    food:'<path d="M5 3v7a3 3 0 0 0 6 0V3M8 3v18M18 3c-3 4-3 8 0 9v9M18 3v9"/>',
    ticket:'<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7Z"/><path d="M15 5v3m0 3v2m0 3v3"/>',
  };
  const icon=(name)=>'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(paths[name]||paths.note)+'</svg>';
  function icons(){ $$('[data-icon]').forEach(n=>n.innerHTML=icon(n.dataset.icon)); }
  const defaults={day:0,view:'journey',done:{},bookings:{},notes:[],dayNotes:{},todos:[],focus:{},reminders:{}};
  let storeOK=true, saved={};
  try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch{storeOK=false;}
  const state={...defaults,...saved};
  if(!Number.isInteger(state.day)||state.day<0||state.day>=D.days.length)state.day=0;
  if(!['journey','map','vault','notes','guide'].includes(state.view))state.view='journey';
  for(const key of ['done','bookings','dayNotes','focus','reminders'])if(!state[key]||typeof state[key]!=='object'||Array.isArray(state[key]))state[key]={};
  for(const key of ['notes','todos'])if(!Array.isArray(state[key]))state[key]=[];
  const legacySensitive={notes:state.notes,dayNotes:state.dayNotes,todos:state.todos,reminders:state.reminders};
  let legacySensitivePending=!!(state.notes.length||Object.keys(state.dayNotes).length||state.todos.length||Object.keys(state.reminders).length),legacySensitiveMigrating=false,privateGeneration=0,notesQueue=Promise.resolve(),lastNotesSnapshot='';
  state.notes=[];state.dayNotes={};state.todos=[];state.reminders={};
  const privateReady=()=>!!window.TripVault?.isUnlocked();
  const sensitive=()=>({notes:state.notes,dayNotes:state.dayNotes,todos:state.todos,reminders:state.reminders});
  // Each trip owns its storage; no booking or entry-card completion is inherited.
  let city=D.days[state.day].defaultCity, selectedPlace='', guide='', expanded=new Set(), leafletMap, tileLayer, markerLayer, markers={}, deferredInstall;
  let extras=null;
  let sketchMode=false, tileFailures=0, userMarker, offlineReady=false, pendingPlace='', toastTimer;
  const day=()=>D.days[state.day];
  const currentPlaces=()=>day().places.map(id=>D.places[id]).filter(p=>p.city===city);
  const dateText=s=>s.slice(5).split('-').map(Number).join('月')+'日';
  const dayLabel=i=>['周日','周一','周二','周三','周四','周五','周六'][new Date(D.days[i].date+'T12:00:00Z').getUTCDay()];
  function savePublic(){
    const publicState={...state,notes:legacySensitivePending?legacySensitive.notes:[],dayNotes:legacySensitivePending?legacySensitive.dayNotes:{},todos:legacySensitivePending?legacySensitive.todos:[],reminders:legacySensitivePending?legacySensitive.reminders:{}};
    try{localStorage.setItem(KEY,JSON.stringify(publicState));storeOK=true;}catch{storeOK=false;}
  }
  function save(){
    savePublic();
    if(privateReady()&&!legacySensitiveMigrating){
      const snapshot=JSON.stringify(sensitive());
      if(snapshot!==lastNotesSnapshot){lastNotesSnapshot=snapshot;const value=JSON.parse(snapshot);notesQueue=notesQueue.catch(()=>{}).then(()=>window.TripVault.writeSection('pocketNotes',value)).then(()=>{const el=$('#day-note-state');if(el)el.textContent='已加密保存到当前浏览器';}).catch(error=>{lastNotesSnapshot='';const el=$('#day-note-state');if(el)el.textContent='未能加密保存，请保持页面并重试';toast(error.message||'私密资料未保存');});}
    }
    const el=$('#storage-state');if(el)el.textContent=storeOK?'公开清单进度存本机；私密文字和附件请用私密区的加密备份。':'浏览器未允许保存，请先导出备份。';
    return storeOK;
  }
  async function syncPrivate(){
    const generation=++privateGeneration;
    if(!privateReady()){
      state.notes=[];state.dayNotes={};state.todos=[];state.reminders={};lastNotesSnapshot='';
      // Hidden views and closed dialogs also retain their DOM until replaced.
      renderNotes();renderGuide();
      $('#search-input').value='';search('');$('#search-dialog').close();
      return;
    }
    if(legacySensitiveMigrating)return;
    legacySensitiveMigrating=true;
    try{
      let value=window.TripVault.readSection('pocketNotes')||{notes:[],dayNotes:{},todos:[],reminders:{}};
      if(legacySensitivePending){value={notes:[...new Map([...(value.notes||[]),...legacySensitive.notes].map(n=>[n.id,n])).values()],dayNotes:{...value.dayNotes,...legacySensitive.dayNotes},todos:[...new Map([...(value.todos||[]),...legacySensitive.todos].map(n=>[n.id,n])).values()],reminders:{...value.reminders,...legacySensitive.reminders}};await window.TripVault.writeSection('pocketNotes',value);legacySensitivePending=false;}
      if(generation!==privateGeneration||!privateReady())return;
      state.notes=Array.isArray(value.notes)?value.notes:[];state.dayNotes=value.dayNotes&&typeof value.dayNotes==='object'?value.dayNotes:{};state.todos=Array.isArray(value.todos)?value.todos:[];state.reminders=value.reminders&&typeof value.reminders==='object'?value.reminders:{};lastNotesSnapshot=JSON.stringify(sensitive());savePublic();
      if(state.view==='notes')renderNotes();else if(state.view==='guide')renderGuide();
    }catch(error){toast(error.message||'旧备忘尚未迁移；旧副本仍保留在本机。');}finally{legacySensitiveMigrating=false;}
  }
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2500);}
  function renderTabs(){
    $('#day-tabs').innerHTML=D.days.map((d,i)=>`<button class="day-tab" data-day="${i}" data-country="${E(d.country)}" aria-selected="${i===state.day}" role="tab"><strong>${d.date.slice(5).split('-').map(Number).join('/')}</strong><span>${dayLabel(i)}</span><small>${E(d.label)}</small></button>`).join('');
    renderNavigator();
    document.documentElement.style.setProperty('--day',day().accent);
    const active=$('#day-tabs [aria-selected=true]');if(active)active.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  let countryFilter='all';
  function renderNavigator(){
    const countries=[...new Set(D.days.map(d=>d.country))];
    $('#country-filter').innerHTML='<option value="all">全部国家 / 地区</option>'+countries.map(c=>`<option value="${E(c)}" ${countryFilter===c?'selected':''}>${E(c)}</option>`).join('');
    $('#day-jump').innerHTML=D.days.map((d,i)=>`<option value="${i}" ${i===state.day?'selected':''}>D${i+1} · ${d.date.slice(5)} · ${E(d.label)}</option>`).join('');
    $$('#day-tabs .day-tab').forEach(b=>b.hidden=countryFilter!=='all'&&b.dataset.country!==countryFilter);
    $('#day-prev').disabled=state.day===0;$('#day-next').disabled=state.day===D.days.length-1;
  }
  function priority(){return E(day().priority||'计划安排 · 2027交通与订单待确认');}
  function transportHTML(d){
    if(!d.transportPlan?.length)return '';
    return '<details class="stay-overview transport-overview"><summary><span class="stay-summary-title">本日交通 · 具体班次参考</span><small>'+d.transportPlan.map(l=>E(l.operator)+' '+E(l.departure)+' → '+E(l.arrival||'到达留缓冲')).join('<br>')+'</small></summary>'+d.transportPlan.map(l=>'<div class="transport-brief"><strong>'+E(l.route)+' · '+E(l.service)+'</strong><p>'+E(l.departure)+' → '+E(l.arrival||'抵达按边检和实际车票')+'</p>'+(l.url?'<a class="soft-button" target="_blank" rel="noopener noreferrer" href="'+E(l.url)+'">查看运营方／参考班次 ↗</a>':'')+'</div>').join('')+'<p class="minor">这是推荐检索的班次或钟点，不表示已经购票；2027日期、夏令时和实际售票结果须核准。</p><button class="soft-button" data-guide="transport-specific">全部车次与证据</button></details>';
  }
  function mountPlanning(){window.TripPlanning?.mountAll(document,{day:day()});window.TripFlightWatch?.mountAll(document);window.TripPreparation?.mountAll(document,{state,save,toast});window.TripVault?.mountAll(document);}
  function renderJourney(){
    const d=day(),done=d.rows.filter(r=>state.done[r.id]).length;
    $('#journey-view').innerHTML=`<div class="day-heading"><p class="date-label">${dateText(d.date)} ${dayLabel(state.day)} · ${E(d.country)} · ${E(d.timezone)} 当地时间</p><h1>${E(d.label)}</h1><p>${E(d.note)}</p><div class="day-status"><span>${['day54','day58'].includes(d.id)?'按本轮确认航空时刻':'具体时段 · 路线计划'}</span><span>D${state.day+1} / ${D.days.length}</span></div><div class="day-highlights">${priority()}</div></div><div id="next-stop">${TripTools.nextHTML(D,state)}</div><button class="map-peek" data-view="map"><span><strong>在地图上看看今天</strong><small>${d.places.length} 个地点 · 点选地点可导航、记备忘</small></span>${icon('map')}</button>${window.TripStay?.dayHTML(d)||''}${transportHTML(d)}${window.TripBooking?.returnHTML(d)||''}${TripFood.overview(d)}<div class="schedule-heading"><h2>当天行程</h2><span class="progress-label">已完成 ${done} / ${d.rows.length}</span></div><div class="schedule">${d.rows.map(row=>{
      const open=expanded.has(row.id);
      return `<article class="step ${row.highlight?'highlight ':''}${state.done[row.id]?'is-done':''}" id="step-${row.id}"><label class="step-check"><input type="checkbox" data-done="${row.id}" ${state.done[row.id]?'checked':''} aria-label="完成：${E(row.title)}"></label><div class="step-panel"><button class="step-toggle" data-expand="${row.id}" aria-expanded="${open}" aria-controls="detail-${row.id}"><span class="step-time">${E(row.time.replace(/\s+/g,''))}</span><span class="step-title">${E(row.title)}</span><span class="step-expand"><span>${row.links.length?'含具体路线与导航':'查看安排与提醒'}</span>${icon(open?'down':'chevron')}</span></button>${TripFood.summary(row.id)}<div class="step-detail" id="detail-${row.id}" ${open?'':'hidden'}>${row.detail}${row.links.length?'<div class="route-actions">'+row.links.filter(l=>/^https:\/\//.test(l.url||l.href||'')).map(l=>'<a class="soft-button" href="'+E(l.url||l.href)+'" target="_blank" rel="noopener noreferrer">'+E(l.label||'打开这段路线')+' ↗</a>').join('')+'</div>':''}${TripFood.details(row.id)}<div class="step-controls">${row.place?`<button class="soft-button" data-open-place="${row.place}">${icon('map')}地图</button>`:''}<button class="soft-button" data-focus-row="${row.id}">从这一步继续</button><button class="soft-button" data-note-place="${row.place||''}">${icon('note')}记一下</button></div></div></div></article>`;
    }).join('')}</div><div class="extras prose"><h3>当天备选与交通补充</h3>${d.extras||'<p>当天按上方的具体动线与缓冲执行。</p>'}</div>${window.TripPostcards?.dayHTML(d)||''}<details class="day-account"><summary>记一笔今天的花销</summary><div data-trip-planning></div></details>`;
    mountPlanning();
  }
  function openRow(id){if(!day().rows.some(r=>r.id===id))return;setView('journey');expanded.add(id);renderJourney();requestAnimationFrame(()=>$('#step-'+id)?.scrollIntoView({block:'start',behavior:'instant'}));}
  function ensureSelection(){const list=currentPlaces();if(!list.some(p=>p.id===selectedPlace))selectedPlace=list[0]?.id||'';}
  function renderMapUI(){
    ensureSelection();
    if($('#dining-map-list'))$('#dining-map-list').innerHTML=window.TripDining?.mapHTML(day())||'';
    $('#map-title').textContent=day().label;
    const cities=[...new Set(day().places.map(id=>D.places[id].city))];
    $('#city-tabs').innerHTML=cities.map(c=>`<button class="chip" data-city="${E(c)}" aria-pressed="${city===c}">${E(c)}</button>`).join('');
    const list=currentPlaces();
    $('#place-strip').innerHTML=list.map((p,i)=>`<button class="place-chip" data-poi="${p.id}" aria-pressed="${p.id===selectedPlace}">${i+1}. ${E(p.name)}</button>`).join('');
    const p=D.places[selectedPlace];
    if(!p){$('#place-card').innerHTML='';return;}
    const maps='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(p.query);
    $('#place-card').innerHTML=`<div class="place-meta"><span>${E(p.city)}</span><span>${E(p.time||'当天顺路安排')}</span></div><h3>${E(p.name)}</h3><p>${E(p.address)}</p><p class="coordinate-note">${p.coordinateAccuracy==='city-reference'?'城市参考坐标；具体地点请打开导航确认。':'地标参考坐标；实际入口以现场与导航为准。'}</p><div class="place-actions"><a class="primary-button" href="${E(maps)}" target="_blank" rel="noopener noreferrer">${icon('pin')}打开地点导航</a><button class="soft-button" data-note-place="${p.id}">${icon('note')}记备忘</button><button class="soft-button" data-show-step="${p.id}">看行程</button></div>`;
    drawSketch();refreshMapMode();
  }
  function mapVisible(){return state.view==='map'||(state.view==='journey'&&window.innerWidth>760);}
  function updateMap(fit=true){
    renderMapUI();if(!mapVisible())return;
    if(!window.L){sketchMode=true;refreshMapMode();return;}
    if(!leafletMap){
      fit=true;
      leafletMap=L.map('map-canvas',{zoomControl:false,scrollWheelZoom:true,attributionControl:true});
      L.control.zoom({position:'bottomleft'}).addTo(leafletMap);
      tileLayer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',updateWhenIdle:true});
      tileLayer.on('tileerror',()=>{if(++tileFailures>=3){sketchMode=true;refreshMapMode();}});
      markerLayer=L.layerGroup().addTo(leafletMap);
    }
    markerLayer.clearLayers();markers={};
    const list=currentPlaces();
    list.forEach((p,i)=>{
      const active=p.id===selectedPlace;
      const marker=L.marker([p.lat,p.lng],{title:p.name,keyboard:true,icon:L.divIcon({className:'route-marker'+(active?' selected':''),html:`<span>${i+1}</span>`,iconSize:active?[34,34]:[29,29],iconAnchor:[15,15]})});
      marker.on('click',()=>selectPlace(p.id,true));marker.addTo(markerLayer);markers[p.id]=marker;
    });
    if(list.length>1)L.polyline(list.map(p=>[p.lat,p.lng]),{color:day().accent,weight:3,dashArray:'6 8',opacity:.7,interactive:false}).addTo(markerLayer);
    requestAnimationFrame(()=>{leafletMap.invalidateSize();if(fit&&list.length)leafletMap.fitBounds(L.latLngBounds(list.map(p=>[p.lat,p.lng])),{padding:[38,38],maxZoom:14,animate:false});refreshMapMode();});
  }
  function drawSketch(){
    const list=currentPlaces();if(!list.length)return;
    let minx=Math.min(...list.map(p=>p.lng)),maxx=Math.max(...list.map(p=>p.lng)),miny=Math.min(...list.map(p=>p.lat)),maxy=Math.max(...list.map(p=>p.lat));
    const dx=Math.max(maxx-minx,.005),dy=Math.max(maxy-miny,.005),scale=Math.min(560/dx,300/dy);
    const pts=list.map(p=>[350+(p.lng-(minx+maxx)/2)*scale,225-(p.lat-(miny+maxy)/2)*scale]);
    $('#map-sketch').innerHTML=`<svg viewBox="0 0 700 450" role="img" aria-label="${E(city)}地点顺序示意"><defs><pattern id="grid" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0V35" fill="none" stroke="#cfdfe1" stroke-width=".7"/></pattern></defs><rect width="700" height="450" fill="url(#grid)"/><text x="25" y="35" font-size="16" fill="#63838b">${E(city)} · 地点示意，非道路导航</text><polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${day().accent}" stroke-width="3" stroke-dasharray="8 8"/>${pts.map(([x,y],i)=>`<g data-poi="${list[i].id}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="${list[i].id===selectedPlace?18:15}" fill="${list[i].id===selectedPlace?'#c45d32':day().accent}" stroke="#fff" stroke-width="3"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="14">${i+1}</text></g>`).join('')}<text x="25" y="427" font-size="13" fill="#63838b">点下方地点名称，查看地址与具体行程。</text></svg>`;
  }
  function refreshMapMode(){
    const sketch=sketchMode||!navigator.onLine||!window.L;
    $('#map-sketch').hidden=!sketch;
    $('#map-mode').textContent=sketch?'在线地图':'路线示意';
    $('#map-caption').innerHTML=(sketch?'离线地点示意；街道底图与导航需要联网。':'景点连线仅示意顺序，实际道路与换乘请打开导航。')+' 底图 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
    if(leafletMap&&tileLayer){if(sketch&&leafletMap.hasLayer(tileLayer))leafletMap.removeLayer(tileLayer);else if(!sketch&&!leafletMap.hasLayer(tileLayer))tileLayer.addTo(leafletMap);}
  }
  function selectPlace(id,zoom=false){if(!D.places[id])return;selectedPlace=id;city=D.places[id].city;updateMap(false);if(zoom&&leafletMap&&mapVisible())leafletMap.setView([D.places[id].lat,D.places[id].lng],15,{animate:false});}
  function bookingDone(b){return Object.hasOwn(state.bookings,b.id)?state.bookings[b.id]:b.done;}
  function todoHTML(){return `<div class="todo-panel"><h3>出发清单</h3><p class="minor">勾选只更新你的清单，不会替你购票或提交资料。</p>${D.bookings.map(b=>{const done=bookingDone(b);return `<div class="todo-row ${done?'done':''}"><label><input type="checkbox" data-booking="${b.id}" ${done?'checked':''}><span>${E(done?b.label.replace('待购','已购（自行确认）'):b.label)}</span></label></div>`;}).join('')}${(privateReady()?state.todos:[]).map(t=>`<div class="todo-row ${t.done?'done':''}"><label><input type="checkbox" data-todo="${E(t.id)}" ${t.done?'checked':''}><span>${E(t.text)}</span></label><button class="danger-quiet" data-delete-todo="${E(t.id)}" aria-label="删除待办">移除</button></div>`).join('')}${privateReady()?'<form class="todo-add todo-form"><input type="text" name="todo" maxlength="300" placeholder="再加一件要记得的事" aria-label="新待办"><button class="soft-button" type="submit">添加</button></form>':'<p class="minor">解锁后可添加自己的私密待办。</p>'}</div>`;}
  function renderNotes(){
    if(!privateReady()){$('#notes-view').innerHTML='<div class="view-title"><h2>本机加密备忘</h2></div><p>解锁后再查看或添加真实酒店、航班与私人备忘。公开行程无需解锁。</p>'+(legacySensitivePending?'<p class="minor">检测到旧版本机备忘，解锁后会加密迁移；迁移前旧副本仍保留。</p>':'')+'<button class="primary-button" data-guide="private">解锁私密资料</button>'+todoHTML();return;}
    const d=day(),notes=state.notes.filter(n=>n.day===d.id),selected=pendingPlace;
    $('#notes-view').innerHTML=`<div class="view-title"><div><h2>留点备忘</h2><p>${dateText(d.date)} · ${E(d.label)} · 只保存在当前设备</p></div><button class="soft-button" data-export>导出</button></div><div class="note-compose"><h3>当天随手记</h3><label class="field-label" for="day-note">自动保存，可以记车次、座号或想吃的店</label><textarea id="day-note" data-day-note="${d.id}" placeholder="今天要记住什么…">${E(state.dayNotes[d.id]||'')}</textarea><p class="saved-state" id="day-note-state">${storeOK?'写下后加密保存到当前浏览器':'本地保存不可用，请导出加密备份'}</p></div><form class="note-compose" id="memo-form"><h3>为一个地点留张便签</h3><label class="field-label" for="memo-place">关联地点</label><select id="memo-place" name="place"><option value="">当天通用</option>${d.places.map(id=>`<option value="${id}" ${id===selected?'selected':''}>${E(D.places[id].name)}</option>`).join('')}</select><label class="field-label" for="memo-text">备忘内容</label><textarea id="memo-text" name="text" maxlength="10000" placeholder="比如：先到码头问普通往返票，不急着买套餐。" required></textarea><div class="compose-foot"><small>备注随身带，别忘了导出备份</small><button class="primary-button" type="submit">存一张便签</button></div></form><h3 style="margin-bottom:14px">当天的便签 <small>${notes.length}</small></h3>${notes.length?notes.slice().reverse().map(n=>`<article class="note-card"><div class="note-meta"><span>${E(D.places[n.place]?.name||'当天通用')}</span><button class="danger-quiet" data-delete-note="${E(n.id)}" aria-label="删除便签">删除</button></div><textarea data-memo="${E(n.id)}" aria-label="编辑便签">${E(n.text)}</textarea><p class="saved-state">可直接编辑，自动保存</p></article>`).join(''):`<div class="empty-state">${icon('note')}还没有便签。把想记住的事写在上面。</div>`}${todoHTML()}`;
  }
  const guideMeta={preparation:['bag','分阶段准备与每天出门复点'],private:['ticket','本机口令加密的真实资料'],connection:['cloud','国外流量与独立入口'],budget:['food','规划与实付分开记录'],tickets:['ticket','实体学生证与票据'],entry:['bag','十国入境与全程保险'],luggage:['bag','轻装与航空额度'],laundry:['bag','换洗与洗烘'],transit:['route','跨境与夜车衔接'],'uae-return':['route','阿联酋返杭与机场选择'],'flight-watch':['ticket','你观察的航班与含行李价'],food:['food','顺路三餐与备选'],fruit:['food','水果和饮水补给'],toilets:['pin','顺路厕所与现场确认'],sources:['search','当前依据与核验边界']};
  function renderGuide(){
    const g=D.guides.find(g=>g.id===guide);
    if(g){$('#guide-view').innerHTML=`<button class="back-button" data-guide-back>‹ 返回行前资料</button><article class="guide-article prose">${g.html}</article>`;mountPlanning();return;}
    $('#guide-view').innerHTML=`<div class="view-title"><div><h2>出发前，心里有数</h2><p>基础资料 ${D.version} · 复核 ${D.reviewed} · 交通与费用待出票确认</p></div></div><div class="day-highlights"><b>行程进度</b><br>${E(D.transportNote)}</div><div class="travel-tools"><button class="soft-button" data-view="vault">打开离线票夹</button><button class="soft-button" data-open-reminders>设置出发提醒</button></div><div class="guide-grid" style="margin-top:20px">${D.guides.map(g=>`<button class="guide-tile" data-guide="${g.id}">${icon((guideMeta[g.id]||['bag',g.subtitle||'十国随行资料'])[0])}<span><strong>${E(g.title)}</strong><small>${E((guideMeta[g.id]||['bag',g.subtitle||'十国随行资料'])[1])}</small></span></button>`).join('')}</div>${todoHTML()}`;
  }
  function setView(view,scroll=true){
    if(!['journey','map','vault','notes','guide'].includes(view))return;
    state.view=view;document.body.dataset.view=view;
    $$('.bottom-nav button').forEach(b=>{if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    if(view==='notes')renderNotes();if(view==='guide')renderGuide();if(view==='vault')extras?.renderVault();
    try{history.replaceState(null,'','#'+view+'/'+day().id);}catch{/* Local files may not allow history updates. */}save();
    if(scroll)window.scrollTo({top:0,behavior:'instant'});
    requestAnimationFrame(()=>updateMap(view==='map'));
  }
  function setDay(i){if(!Number.isInteger(i)||!D.days[i])return;state.day=i;city=day().defaultCity;selectedPlace='';pendingPlace='';expanded=new Set();renderTabs();renderJourney();setView(state.view,false);updateMap(true);save();}
  function noteAt(place){pendingPlace=place||'';setView('notes');requestAnimationFrame(()=>$('#memo-text')?.focus({preventScroll:false}));}
  function showStep(place){
    const p=D.places[place];let r=day().rows.find(r=>r.place===place)||day().rows.find(r=>p?.keywords.some(k=>r.title.includes(k)));
    setView('journey');if(r){expanded.add(r.id);renderJourney();requestAnimationFrame(()=>$('#step-'+r.id)?.scrollIntoView({block:'center',behavior:'instant'}));}else toast('该地点的具体动线见当天行程。');
  }
  function exportData(){
    const payload={format:'silkloop-2027-trip/v1',privacy:'public-progress-only',exportedAt:new Date().toISOString(),state:{...state,notes:[],dayNotes:{},todos:[],reminders:{}}};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='丝路随行_公开清单进度_'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('已导出公开清单进度；私人备忘和票据请用加密备份。');
  }
  async function importData(file){
    if(!file)return;if(file.size>2*1024*1024){toast('文件过大，请选择本应用导出的备份。');return;}
    try{
      const data=JSON.parse(await file.text());if(data.format!=='silkloop-2027-trip/v1'||!data.state)throw new Error('format');
      const s=data.state;if(!privateReady()&&((s.notes?.length)||Object.keys(s.dayNotes||{}).length||(s.todos?.length)||Object.keys(s.reminders||{}).length)){toast('这份旧备份含私人记录，请先解锁私密区再导入。');return;}const validDays=new Set(D.days.map(d=>d.id)),validRows=new Set(D.days.flatMap(d=>d.rows.map(r=>r.id)));
      const notes=Array.isArray(s.notes)?s.notes.filter(n=>n&&typeof n.id==='string'&&typeof n.text==='string'&&validDays.has(n.day)).slice(0,500).map(n=>({id:n.id.slice(0,100),text:n.text.slice(0,10000),day:n.day,place:D.places[n.place]?n.place:'',createdAt:typeof n.createdAt==='string'?n.createdAt:''})):[];
      state.notes=[...new Map([...state.notes,...notes].map(n=>[n.id,n])).values()];
      if(s.done&&typeof s.done==='object')for(const [k,v] of Object.entries(s.done))if(validRows.has(k)&&typeof v==='boolean')state.done[k]=v;
      if(s.bookings&&typeof s.bookings==='object')for(const b of D.bookings)if(typeof s.bookings[b.id]==='boolean')state.bookings[b.id]=s.bookings[b.id];
      if(s.dayNotes&&typeof s.dayNotes==='object')for(const id of validDays)if(typeof s.dayNotes[id]==='string')state.dayNotes[id]=s.dayNotes[id].slice(0,20000);
      TripTools.cleanSettings(D,s,state);
      if(Array.isArray(s.todos)){const ts=s.todos.filter(t=>t&&typeof t.id==='string'&&typeof t.text==='string').slice(0,200).map(t=>({id:t.id.slice(0,100),text:t.text.slice(0,300),done:!!t.done}));state.todos=[...new Map([...state.todos,...ts].map(t=>[t.id,t])).values()];}
      save();if(state.view==='notes')renderNotes();if(state.view==='guide')renderGuide();renderJourney();toast('备份已合并到本机。');
    }catch{toast('无法读取，请选择“丝路随行”导出的 JSON 备份。');}
    $('#import-data').value='';
  }
  function search(q){
    const query=q.trim().toLowerCase();
    if(!query){$('#search-results').innerHTML='<p class="minor">搜索行程、行前资料和本机备忘，例如“Kaş”“阿联酋”“学生票”“洗衣”。</p>';return;}
    const rowHits=D.days.flatMap((d,i)=>d.rows.filter(r=>(r.time+' '+r.title+' '+r.plain).toLowerCase().includes(query)).map(r=>({d,i,r}))).slice(0,20).map(({d,i,r})=>`<button class="search-result" data-result-day="${i}" data-result-row="${E(r.id)}"><span>${dateText(d.date)} · ${E(r.time.replace(/\s+/g,''))}</span><b>${E(r.title)}</b></button>`);
    const guideHits=D.guides.filter(g=>(g.title+' '+g.html.replace(/<[^>]+>/g,' ')).toLowerCase().includes(query)).slice(0,7).map(g=>`<button class="search-result" data-result-guide="${E(g.id)}"><span>行前资料</span><b>${E(g.title)}</b></button>`);
    const notes=[...state.notes.map(n=>({day:n.day,text:String(n.text||'')})),...Object.entries(state.dayNotes).map(([day,text])=>({day,text:String(text||'')}))];
    const noteHits=notes.filter(n=>n.text.toLowerCase().includes(query)).slice(0,10).map(n=>{const i=D.days.findIndex(d=>d.id===n.day);return i<0?'':`<button class="search-result" data-result-note-day="${i}"><span>本机备忘 · ${dateText(D.days[i].date)}</span><b>${E(n.text.slice(0,100))}</b></button>`;});
    const all=[...rowHits,...guideHits,...noteHits];
    $('#search-results').innerHTML=all.length?all.join(''):'<p class="minor">没有找到，换个地点名或关键词试试。</p>';
  }
  async function offlineStatus(){
    try{const c=await caches.open('silkloop-2027-v3'),keys=await c.keys();offlineReady=keys.length>=15;}catch{offlineReady=false;}
    $('#offline-state').textContent=offlineReady?'离线内容已准备好，出发前可断网试开一次。':'离线内容尚未准备好，请先联网完整打开一次；微信内预览可能不支持安装。';
    updateConnection();
  }
  function updateConnection(){const e=$('#connection');e.classList.toggle('offline',!navigator.onLine);e.textContent=!navigator.onLine?'离线随行':offlineReady?'离线已准备':'已联网';refreshMapMode();}

  document.addEventListener('click',e=>{
    const b=e.target.closest('button,a,label,g');if(!b)return;
    if(b.matches('button[data-view]')){setView(b.dataset.view);return;}
    if(b.dataset.day!==undefined){setDay(Number(b.dataset.day));return;}
    if(b.dataset.expand){const id=b.dataset.expand;expanded.has(id)?expanded.delete(id):expanded.add(id);const article=$('#step-'+id);const open=expanded.has(id);$('.step-detail',article).hidden=!open;b.setAttribute('aria-expanded',String(open));$('.step-expand',b).innerHTML=`<span>${$('.step-detail',article).querySelector('a')?'含具体路线与导航':'查看安排与提醒'}</span>${icon(open?'down':'chevron')}`;return;}
    if(b.dataset.foodRow){openRow(b.dataset.foodRow);return;}
    if(b.dataset.city){city=b.dataset.city;selectedPlace='';tileFailures=0;updateMap(true);return;}
    const poi=e.target.closest('[data-poi]');if(poi){selectPlace(poi.dataset.poi,true);return;}
    if(b.dataset.openPlace){selectPlace(b.dataset.openPlace);setView('map');updateMap(false);if(leafletMap){const p=D.places[b.dataset.openPlace];leafletMap.setView([p.lat,p.lng],15,{animate:false});}return;}
    if(b.hasAttribute('data-note-place')){noteAt(b.dataset.notePlace);return;}
    if(b.dataset.showStep){showStep(b.dataset.showStep);return;}
    if(b.dataset.guide){guide=b.dataset.guide;setView('guide');return;}
    if(b.hasAttribute('data-guide-back')){guide='';renderGuide();window.scrollTo(0,0);return;}
    if(b.dataset.close){$('#'+b.dataset.close).close();return;}
    if(b.dataset.deleteNote){state.notes=state.notes.filter(n=>n.id!==b.dataset.deleteNote);save();renderNotes();toast('便签已删除');return;}
    if(b.dataset.deleteTodo){state.todos=state.todos.filter(n=>n.id!==b.dataset.deleteTodo);save();state.view==='notes'?renderNotes():renderGuide();return;}
    if(b.hasAttribute('data-export'))exportData();
    if(b.dataset.resultGuide){$('#search-dialog').close();guide=b.dataset.resultGuide;setView('guide');return;}
    if(b.dataset.resultNoteDay!==undefined){$('#search-dialog').close();setDay(Number(b.dataset.resultNoteDay));setView('notes');return;}
    if(b.dataset.resultRow){$('#search-dialog').close();setDay(Number(b.dataset.resultDay));setView('journey');expanded.add(b.dataset.resultRow);renderJourney();requestAnimationFrame(()=>$('#step-'+b.dataset.resultRow)?.scrollIntoView({block:'center',behavior:'instant'}));}
  });
  document.addEventListener('change',e=>{
    const t=e.target;
    if(t.dataset.done){state.done[t.dataset.done]=t.checked;save();const el=$('#step-'+t.dataset.done);el.classList.toggle('is-done',t.checked);$('.progress-label').textContent=`已完成 ${day().rows.filter(r=>state.done[r.id]).length} / ${day().rows.length}`;extras?.renderNext();}
    if(t.dataset.booking){state.bookings[t.dataset.booking]=t.checked;save();t.closest('.todo-row').classList.toggle('done',t.checked);}
    if(t.dataset.todo){const item=state.todos.find(x=>x.id===t.dataset.todo);if(item)item.done=t.checked;save();t.closest('.todo-row').classList.toggle('done',t.checked);}
  });
  document.addEventListener('input',e=>{
    const t=e.target;
    if(t.dataset.dayNote){state.dayNotes[t.dataset.dayNote]=t.value.slice(0,20000);save();$('#day-note-state').textContent=storeOK?'正在加密保存…':'未能保存，请导出加密备份';}
    if(t.dataset.memo){const n=state.notes.find(n=>n.id===t.dataset.memo);if(n){n.text=t.value.slice(0,10000);save();}}
  });
  document.addEventListener('submit',e=>{
    if(e.target.id==='memo-form'){e.preventDefault();const f=new FormData(e.target),text=String(f.get('text')||'').trim();if(!text)return;state.notes.push({id:'n'+Date.now()+Math.random().toString(36).slice(2,6),day:day().id,place:String(f.get('place')||''),text:text.slice(0,10000),createdAt:new Date().toISOString()});save();pendingPlace='';renderNotes();toast('便签已存好');}
    if(e.target.matches('form.todo-form')){e.preventDefault();const input=$('input',e.target),text=input.value.trim();if(!text)return;state.todos.push({id:'t'+Date.now(),text:text.slice(0,300),done:false});save();state.view==='notes'?renderNotes():renderGuide();}
  });
  $('#search-open').addEventListener('click',()=>{$('#search-dialog').showModal();search('');$('#search-input').focus();});
  $('#search-input').addEventListener('input',e=>search(e.target.value));
  $('#help-open').addEventListener('click',()=>{$('#help-dialog').showModal();save();offlineStatus();});
  $('#export-data').addEventListener('click',exportData);
  $('#update-app').addEventListener('click',async e=>{
    const b=e.currentTarget;b.disabled=true;b.textContent='正在检查更新…';
    try{
      const r=await navigator.serviceWorker?.getRegistration();
      if(r){await r.update();const worker=r.installing||r.waiting;if(worker&&worker.state!=='activated')await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('wait')),15000);worker.addEventListener('statechange',()=>{if(worker.state==='activated'){clearTimeout(timer);resolve();}else if(worker.state==='redundant'){clearTimeout(timer);reject(new Error('failed'));}});});}
      location.reload();
    }catch{toast('更新暂未完成，请联网后稍后再试。');b.disabled=false;b.textContent='检查更新并重新打开';}
  });
  $('#import-data').addEventListener('change',e=>importData(e.target.files[0]));
  $('#map-mode').addEventListener('click',()=>{sketchMode=!($('#map-sketch').hidden===false);tileFailures=0;updateMap(false);});
  $('#map-fit').addEventListener('click',()=>updateMap(true));
  $('#map-locate').addEventListener('click',()=>{
    if(!navigator.geolocation){toast('此浏览器不支持定位，可直接打开地点导航。');return;}
    navigator.geolocation.getCurrentPosition(pos=>{if(!leafletMap){toast('已取得位置，在线地图加载后可显示。');return;}const ll=[pos.coords.latitude,pos.coords.longitude];if(userMarker)userMarker.remove();userMarker=L.circleMarker(ll,{radius:7,color:'#fff',weight:3,fillColor:'#3974a3',fillOpacity:1}).addTo(leafletMap);leafletMap.setView(ll,15,{animate:false});toast('已定位到你的当前位置');},()=>toast('没有取得定位，请检查手机权限；地点导航仍可使用。'),{timeout:10000,maximumAge:60000});
  });
  window.addEventListener('online',()=>{tileFailures=0;updateConnection();});window.addEventListener('offline',updateConnection);
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;$('#install-app').hidden=false;});
  $('#install-app').addEventListener('click',async()=>{if(deferredInstall){await deferredInstall.prompt();deferredInstall=null;$('#install-app').hidden=true;}});
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>updateMap(false),180);});
  const hash=location.hash.match(/^#(journey|map|vault|notes|guide)\/day(\d{1,2})$/);if(hash&&D.days[Number(hash[2])-1]){state.view=hash[1];state.day=Number(hash[2])-1;city=day().defaultCity;}
  $('#country-filter').addEventListener('change',e=>{countryFilter=e.target.value;const i=D.days.findIndex(d=>d.country===countryFilter);if(countryFilter!=='all'&&day().country!==countryFilter&&i>=0)setDay(i);else renderTabs();});
  $('#day-jump').addEventListener('change',e=>{countryFilter='all';setDay(Number(e.target.value));});
  $('#day-prev').addEventListener('click',()=>{countryFilter='all';setDay(state.day-1);});
  $('#day-next').addEventListener('click',()=>{countryFilter='all';setDay(state.day+1);});
  window.addEventListener('tripvaultchange',e=>{if(e.detail?.reason!=='write')syncPrivate();});
  icons();renderTabs();renderJourney();renderGuide();setView(state.view,false);updateMap(true);updateConnection();
  extras=TripTools.mount({D,state,save,toast,renderJourney,setView,setDay,openStep:openRow});
  if(state.view==='vault')extras.renderVault();
  if('serviceWorker' in navigator&&location.protocol!=='file:'){
    navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(()=>navigator.serviceWorker.ready).then(()=>offlineStatus()).catch(()=>offlineStatus());
    navigator.serviceWorker.addEventListener('controllerchange',()=>offlineStatus());
  }else offlineStatus();
  if(privateReady())syncPrivate();
  window.TripPocket={getState:()=>JSON.parse(JSON.stringify(state)),getData:()=>D,importData,setDay,setView};
})();

