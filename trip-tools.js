(()=>{
  'use strict';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const zoneFormatters=new Map();
  function zoneParts(now,timezone='UTC'){
    let formatter=zoneFormatters.get(timezone);
    if(!formatter){formatter=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});zoneFormatters.set(timezone,formatter);}
    return Object.fromEntries(formatter.formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  }
  const tripDate=(now=new Date(),timezone='UTC')=>{const p=zoneParts(now,timezone);return p.year+'-'+p.month+'-'+p.day;};
  const clockMinutes=(now=new Date(),timezone='UTC')=>{const p=zoneParts(now,timezone);return Number(p.hour)*60+Number(p.minute);};
  const todayIndex=(D,now=new Date())=>D.days.findIndex(d=>d.date===tripDate(now,d.timezone||'UTC'));
  function times(row){return [...String(row.time||'').matchAll(/(\d{1,2}):(\d{2})/g)].map(m=>Number(m[1])*60+Number(m[2]));}
  function nextStep(D,state,now=new Date()){
    const d=D.days[state.day],focus=state.focus?.[d.id],remaining=d.rows.filter(r=>!state.done[r.id]);
    if(focus==='end'||!remaining.length)return {mode:'end',row:null,next:null};
    const manual=d.rows.find(r=>r.id===focus&&!state.done[r.id]);
    let row=manual,mode=manual?'manual':'preview';
    if(!row&&!d.requiresBookingTime&&d.date===tripDate(now,d.timezone||'UTC')){
      const minute=clockMinutes(now,d.timezone||'UTC');
      row=remaining.find(r=>{const t=times(r);return (t.length>1?(t[1]<t[0]?t[1]+1440:t[1]):Math.max(t[0]+30,1440))>minute;});
      mode='clock';
    }
    if(!row)row=remaining[0];
    const index=d.rows.indexOf(row),next=d.rows.slice(index+1).find(r=>!state.done[r.id])||null;
    return {mode,row,next};
  }
  function nextHTML(D,state,now=new Date()){
    const d=D.days[state.day],n=nextStep(D,state,now),today=todayIndex(D,now);
    const smallActions=`<div class="next-small-actions"><button class="text-action" data-view="vault">离线票夹</button><button class="text-action" data-open-reminders>出发提醒</button>${today>=0&&today!==state.day?`<button class="text-action" data-day="${today}">回到今天</button>`:''}</div>`;
    if(!n.row)return `<div class="next-card"><p class="next-kicker">下一站</p><h2>已走到当天末尾</h2><p class="minor">未勾选的安排仍保留在下方，可随时回看。</p><button class="soft-button" data-next-clock>重新按时间查看</button>${smallActions}</div>`;
    const row=n.row,t=times(row)[0],delta=t-clockMinutes(now,d.timezone||'UTC');
    const status=n.mode==='clock'?(delta>0?`计划 ${delta>=60?Math.floor(delta/60)+'小时':''}${delta%60?delta%60+'分钟':''}后开始`:'按当前计划时间定位'):n.mode==='manual'?'按你选定的步骤继续':`${d.date.slice(5).replace('-','/')} 行程预览`;
    const p=D.places[row.place],route=row.links?.find(l=>/google\.[^/]+\/maps|google\.com\/maps/.test(l.href||l.url||''));
    const nav=route?.href||route?.url||(p?'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(p.query):'');
    return `<div class="next-card" data-next-row="${row.id}"><div class="next-kicker"><span>下一站</span><span>${esc(status)}</span></div><p class="next-time">${esc(row.time.replace(/\s+/g,''))}</p><h2>${esc(row.title)}</h2>${p?`<p class="next-address">${esc(p.address)}</p>`:''}<div class="next-actions"><button class="primary-button" data-next-open="${row.id}">查看具体安排</button>${nav?`<a class="soft-button" href="${esc(nav)}" target="_blank" rel="noopener noreferrer">导航</a>`:''}<button class="soft-button" data-next-done="${row.id}">完成这步，继续</button></div>${n.next?`<p class="next-after">接下来 ${esc(n.next.time.replace(/\s+/g,''))} · ${esc(n.next.title)}</p>`:''}<div class="next-foot"><span>${n.mode==='clock'?'仅定位时间，不会自动勾选完成。':'出行当天可按当地时间定位。'}</span><button class="text-action" data-next-clock>按时间查看</button></div>${smallActions}</div>`;
  }
  const leadOptions=[0,15,30,60,120,150,180];
  const isDateTime=s=>{
    if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s))return false;
    const d=new Date(s+':00Z');
    return Number.isFinite(d.getTime())&&d.toISOString().slice(0,16)===s;
  };
  // Calendar inputs are wall times in each event's IANA zone. Sampling offsets
  // handles DST and fractional-hour zones without depending on the device zone.
  function zonedDateTimeToUTC(when,timezone){
    if(!isDateTime(when))throw Error('请检查日期与时间。');
    const wall=Date.parse(when+':00Z'),candidates=new Set();
    for(const hours of [-48,-24,-12,0,12,24,48]){
      const sample=wall+hours*3600000,p=zoneParts(new Date(sample),timezone);
      const local=Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day),Number(p.hour),Number(p.minute),Number(p.second));
      const candidate=wall-(local-sample),d=new Date(candidate),q=zoneParts(d,timezone);
      if(q.year+'-'+q.month+'-'+q.day+'T'+q.hour+':'+q.minute===when)candidates.add(candidate);
    }
    if(!candidates.size)throw Error('这个当地时间因时区或夏令时调整不存在，请按正式票面修改。');
    // A repeated autumn wall time uses its first occurrence; show the zone in
    // the exported description so it remains reviewable before travel.
    return new Date(Math.min(...candidates));
  }
  function reminderDefinitions(D=window.TRIP_DATA){
    return (Array.isArray(D?.reminders)?D.reminders:[]).filter(r=>r&&typeof r.id==='string'&&/^[a-zA-Z0-9._-]{1,100}$/.test(r.id)).map(r=>({...r,timezone:r.timezone||D.days?.find(d=>d.id===r.day||d.date===r.date)?.timezone||'UTC',pending:r.pending!==false,minutes:Number.isFinite(r.minutes)&&r.minutes>0?r.minutes:60,lead:leadOptions.includes(r.lead)?r.lead:60}));
  }
  function remindersForState(state,D=window.TRIP_DATA){return reminderDefinitions(D).map(r=>{const v=state.reminders?.[r.id]||{};return {...r,when:isDateTime(v.when)?v.when:r.date+'T'+r.time,lead:leadOptions.includes(v.lead)?v.lead:r.lead,enabled:typeof v.enabled==='boolean'?v.enabled:false};});}
  function cleanSettings(D,input,state){
    state.focus=state.focus||{};state.reminders=state.reminders||{};
    if(input.focus&&typeof input.focus==='object')for(const d of D.days){const id=input.focus[d.id];if(id==='end'||d.rows.some(r=>r.id===id))state.focus[d.id]=id;}
    if(input.reminders&&typeof input.reminders==='object')for(const r of reminderDefinitions(D)){const v=input.reminders[r.id];if(v&&isDateTime(v.when)&&typeof v.enabled==='boolean'&&leadOptions.includes(v.lead))state.reminders[r.id]={when:v.when,lead:v.lead,enabled:v.enabled};}
  }
  const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  const icsText=s=>String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
  function fold(line){let out='',part='',bytes=0;for(const ch of line){const n=new TextEncoder().encode(ch).length;if(bytes+n>75){out+=part+'\r\n';part=' ';bytes=1;}part+=ch;bytes+=n;}return out+part;}
  function buildCalendar(events,now=new Date()){
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Silkloop 2027//Travel Reminders//ZH','CALSCALE:GREGORIAN','X-WR-CALNAME:丝路环线2027出发提醒'];
    for(const r of events.filter(r=>r.enabled)){
      if(!isDateTime(r.when))throw new Error('请检查日期与时间。');
      const start=zonedDateTimeToUTC(r.when,r.timezone||'UTC'),duration=Number.isFinite(r.minutes)&&r.minutes>0?r.minutes:60,end=new Date(start.getTime()+duration*60000);
      lines.push('BEGIN:VEVENT','UID:'+icsText(r.id)+'@silkloop-2027','DTSTAMP:'+stamp(now),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+icsText(r.title||'出发提醒'),'LOCATION:'+icsText(r.location||''),'DESCRIPTION:'+icsText('行程参考：'+(r.detail||'')+'\n当地时区：'+(r.timezone||'UTC')+'。日历已换算为同一真实时刻；请以正式票面及运营方通知为准。'),'TRANSP:TRANSPARENT');
      if(leadOptions.includes(r.lead)&&r.lead>0)lines.push('BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:-PT'+r.lead+'M','DESCRIPTION:'+icsText('出发提醒：'+r.title),'END:VALARM');
      lines.push('END:VEVENT');
    }
    return lines.concat('END:VCALENDAR').map(fold).join('\r\n')+'\r\n';
  }
  function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  const categories={flight:'机票',train:'火车票',bus:'大巴票',hotel:'酒店',entry:'入境卡',other:'其他'};
  let dbPromise;
  function database(){
    if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
      const req=indexedDB.open('silkloop-2027-files',1);
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('tickets'))req.result.createObjectStore('tickets',{keyPath:'id'});};
      req.onsuccess=()=>{const db=req.result;db.onversionchange=()=>db.close();resolve(db);};
      req.onerror=()=>{dbPromise=null;reject(req.error);};
      req.onblocked=()=>{dbPromise=null;reject(new Error('请关闭其他应用标签后重试。'));};
    });
    return dbPromise;
  }
  async function filesOp(mode,fn){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('tickets',mode),req=fn(tx.objectStore('tickets'));let result;req.onsuccess=()=>result=req.result;tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(tx.error||new Error('保存未完成'));tx.onerror=()=>{};});}
  async function fileType(file){const b=new Uint8Array(await file.slice(0,16).arrayBuffer()),s=String.fromCharCode(...b);if(s.startsWith('%PDF-'))return 'application/pdf';if([137,80,78,71,13,10,26,10].every((n,i)=>b[i]===n))return 'image/png';if(b[0]===255&&b[1]===216&&b[2]===255)return 'image/jpeg';if(s.startsWith('GIF87a')||s.startsWith('GIF89a'))return 'image/gif';if(s.startsWith('RIFF')&&s.slice(8,12)==='WEBP')return 'image/webp';throw new Error('请选 JPG、PNG、WebP、GIF 图片或 PDF 文件。');}
  function ticketBundleConfig(D){const b=D?.ticketBundle;return b&&typeof b.revision==='string'&&/^silkloop-2027-[a-zA-Z0-9._-]{1,64}$/.test(b.revision)&&Number.isInteger(b.count)&&b.count>0&&b.count<=100?{revision:b.revision,count:b.count}:null;}
  function mount(ctx){
    const {D,state,save,toast,renderJourney,setView,setDay,openStep}=ctx,$=s=>document.querySelector(s);
    let records=[],storageRows=[],legacyCount=0,loadGeneration=0,ready=false,failure='',filter='all',uploading=false,previewURL='',deleteID='',previewImages=[],bundleBusy=false,bundleTried=false,bundleError='';
    const vault=()=>window.TripVault,unlocked=()=>!!vault()?.isUnlocked();
    function requireVault(){if(!vault()?.supported()||!unlocked())throw Error('请先解锁私密区，再导入或打开票据。');}
    const bundleConfig=ticketBundleConfig(D),bundleRevision=bundleConfig?.revision||null;
    if(!state.preparedTicketImports||typeof state.preparedTicketImports!=='object'||Array.isArray(state.preparedTicketImports))state.preparedTicketImports={};
    function renderNext(){const el=$('#next-stop');if(el)el.innerHTML=nextHTML(D,state);}
    function renderVault(){
      if(bundleConfig&&unlocked()&&ready&&!failure&&!bundleBusy&&!bundleTried&&state.ticketBundleRevision!==bundleRevision){bundleTried=true;queueMicrotask(()=>importPreparedTickets());}
      const isOpen=unlocked(),shown=records.filter(r=>filter==='all'||r.day===''||r.day===D.days[state.day].id),bytes=records.reduce((n,r)=>n+r.bytes,0),disabled=!isOpen||!ready||failure||uploading||bundleBusy?'disabled':'';
      $('#vault-view').innerHTML=`<div class="view-title"><div><h2>加密离线票夹</h2><p>先解锁本机私密区，再导入或打开票据。</p></div><span class="vault-count">${storageRows.length+legacyCount} 份</span></div><section data-private-vault></section><details class="vault-info"><summary>本机加密，换设备不自动同步</summary><p>新导入的 PDF、图片、文件名和预览均先加密再存入当前浏览器；锁定后不显示原文件名。清理浏览器数据会删除附件，请保留原件与加密私密区备份。公开网页不含你的私人票据。</p></details>${legacyCount?`<p class="vault-error" role="status">发现 ${legacyCount} 份旧版未加密附件，尚未受到口令保护。原件仍保留；${isOpen?'正在尝试加密迁移，失败时仍保留旧件，可解锁后重试。':'请解锁私密区后完成加密迁移。'}</p>`:''}${isOpen?preparedHTML():''}<details class="vault-upload" ${records.length?'':'open'}><summary>添加票据</summary><div class="vault-upload-body">${!isOpen?'<p class="vault-error">请先解锁上方私密区；未解锁时不会导入票据。</p>':''}<div class="vault-fields"><label>票据类型<select id="ticket-category">${Object.entries(categories).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label>使用日期<select id="ticket-day"><option value="">全程通用</option>${D.days.map(d=>`<option value="${d.id}">${d.date.slice(5).replace('-','/')} ${esc(d.label)}</option>`).join('')}</select></label></div><div class="vault-import-actions"><label class="primary-button vault-import">导入 PDF<input type="file" id="ticket-pdf" aria-label="选择 PDF 文件" accept="application/pdf,.pdf" multiple ${disabled}></label><label class="soft-button vault-import">导入图片<input type="file" id="ticket-images" aria-label="选择票据图片" accept="image/jpeg,image/png,image/webp,image/gif" multiple ${disabled}></label></div><label class="soft-button vault-import vault-file-fallback">从手机“文件”选取<input type="file" id="ticket-files" aria-label="从手机文件选择票据" multiple ${disabled}></label><p class="minor">PDF 按钮仍打开相册时，用“从手机文件选取”。微信／QQ 里的 PDF 请先另存到手机“下载”目录。</p><p class="minor">单份最多 20 MB，票夹合计 100 MB。${isOpen?(bytes/1048576).toFixed(1)+' MB 已用。':'解锁后显示用量。'}</p></div></details><div class="vault-list-top"><h3>我的票据</h3><label><span class="sr-only">筛选票据</span><select id="ticket-filter"><option value="all" ${filter==='all'?'selected':''}>全部日期</option><option value="day" ${filter==='day'?'selected':''}>当天与全程通用</option></select></label></div><div class="vault-list" aria-live="polite">${failure?`<p class="vault-error">${esc(failure)}</p><button class="soft-button" data-vault-retry>重新尝试</button>`:!isOpen?'<p class="empty-state">私密票夹已锁定。</p>':!ready?'<p class="minor">正在打开加密票夹…</p>':shown.length?shown.map(r=>`<article class="ticket-card"><span class="ticket-symbol">${r.type==='application/pdf'?'PDF':'图片'}</span><div><p class="ticket-meta">${categories[r.category]||'其他'} · ${r.day?esc(D.days.find(d=>d.id===r.day)?.date.slice(5).replace('-','/')):'全程通用'} · ${(r.bytes/1048576).toFixed(2)} MB</p><h3>${esc(r.name)}</h3><div class="ticket-actions"><button class="primary-button" data-ticket-open="${esc(r.id)}">打开票据</button><button class="soft-button" data-ticket-save="${esc(r.id)}">另存原文件</button><button class="danger-quiet" data-ticket-delete="${esc(r.id)}">删除</button></div></div></article>`).join(''):'<div class="empty-state">还没有票据。可导入车票二维码、酒店订单图片或 PDF。</div>'}</div><button class="soft-button vault-reminders" data-open-reminders>查看出发提醒</button>`;
      vault()?.mountAll($('#vault-view'));
    }
    function preparedHTML(){
      if(!bundleConfig)return '<section class="vault-prepared"><h3>目前无云端票据</h3><p id="ticket-bundle-status" role="status">这趟旅行还没有已订票据。可以先手动导入 PDF 或图片，保留原文件离线查看；不会自动读取其他旅行的票据。</p></section>';
      return `<section class="vault-prepared"><h3>本人云端票包 · ${bundleConfig.count} 份</h3><p id="ticket-bundle-status" role="status">${bundleBusy?'正在存入本机票夹，请稍等…':bundleError?esc(bundleError):state.ticketBundleRevision===bundleRevision?'本机已存好，可离线打开；正式时间仍以票面为准。':'联网后可将本人云端票据存入当前设备。'}</p><button class="soft-button" data-ticket-bundle-import ${!ready||failure||uploading||bundleBusy?'disabled':''}>${bundleBusy?'正在存入…':state.ticketBundleRevision===bundleRevision?'重新核对并存入云端票据':'存入本人云端票据'}</button></section>`;
    }
    const bytesFrom64=b64=>Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    const hashBytes=async b=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b)),v=>v.toString(16).padStart(2,'0')).join('');
    const opaqueID=()=> 'sealed-'+Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('');
    async function sealTicket(record){
      requireVault();const {blob,previews=[],id:oldID,...metadata}=record;
      metadata.sha256=metadata.sha256||await hashBytes(await blob.arrayBuffer());
      const encrypted=await vault().sealBlob(blob),encryptedMetadata=await vault().sealBlob(new Blob([JSON.stringify(metadata)],{type:'application/json'})),sealedPreviews=[];
      for(const p of previews)sealedPreviews.push({blob:await vault().sealBlob(p.blob,{page:p.page})});
      requireVault();return {schema:2,id:opaqueID(),blob:encrypted,metadata:encryptedMetadata,previews:sealedPreviews,storageBytes:encrypted.size+encryptedMetadata.size+sealedPreviews.reduce((n,p)=>n+p.blob.size,0)};
    }
    async function metadataFor(row){requireVault();const opened=await vault().openBlob(row.metadata),metadata=JSON.parse(await opened.blob.text());requireVault();return {...metadata,id:row.id};}
    async function storeTicket(record){const row=await sealTicket(record),metadata=await metadataFor(row);requireVault();await filesOp('readwrite',s=>s.put(row));requireVault();storageRows.unshift(row);records.unshift(metadata);return metadata;}
    async function originalFor(record){requireVault();const row=storageRows.find(r=>r.id===record.id);if(!row)throw Error('未找到这份加密附件。');return (await vault().openBlob(row.blob)).blob;}
    async function migrateLegacy(row){
      // Verify every encrypted payload before one atomic transaction replaces the
      // legacy row. Any failure leaves its original bytes in IndexedDB.
      const sealed=await sealTicket(row),opened=await vault().openBlob(sealed.blob);
      if(await hashBytes(await opened.blob.arrayBuffer())!==await hashBytes(await row.blob.arrayBuffer()))throw Error('旧附件加密核验失败，原件已保留。');
      for(let i=0;i<(row.previews||[]).length;i++){const p=await vault().openBlob(sealed.previews[i].blob);if(await hashBytes(await p.blob.arrayBuffer())!==await hashBytes(await row.previews[i].blob.arrayBuffer()))throw Error('旧预览加密核验失败，原件已保留。');}
      const metadata=await metadataFor(sealed);requireVault();await filesOp('readwrite',store=>{store.delete(row.id);return store.put(sealed);});return {row:sealed,metadata};
    }
    async function importPreparedTickets(force=false){
      if(!bundleConfig||!unlocked()||bundleBusy||uploading||!ready||failure||(!force&&state.ticketBundleRevision===bundleRevision))return;
      bundleBusy=true;bundleError='';renderVault();let added=0;
      try{
        const response=await fetch('./api/ticket-bundle',{credentials:'same-origin',cache:'no-store'});
        if(!response.ok)throw Error(response.status===403?'请使用本人账号登录后，再存入云端票据。':response.status===404?'目前无云端票据，可以先手动导入 PDF 或图片。':'云端票据暂时未能加载，手动导入仍可使用；联网后可重试。');
        const bundle=await response.json();if(bundle.revision!==bundleRevision||!Array.isArray(bundle.files)||bundle.files.length!==bundleConfig.count)throw Error('票据包尚未准备完整，请稍后重试。');
        for(const f of bundle.files){
          if(!/^[a-f0-9]{64}$/.test(f.sha256)||!Object.hasOwn(categories,f.category)||!(f.day===''||D.days.some(d=>d.id===f.day))||!Number.isInteger(f.bytes)||f.bytes<=0||f.bytes>20*1048576||typeof f.name!=='string'||!f.name||f.name.length>240||!['application/pdf','image/jpeg','image/png','image/gif','image/webp'].includes(f.type)||!Array.isArray(f.previews)||f.previews.length>5)throw Error('票据信息校验失败。');
          const id='prepared-'+f.sha256;if(!force&&state.preparedTicketImports[id])continue;
          let existing=records.find(r=>r.id===id||r.sha256===f.sha256);
          if(!existing)for(const r of records.filter(r=>r.bytes===f.bytes||r.originalBytes===f.bytes)){if(await hashBytes(await (await originalFor(r)).arrayBuffer())===f.sha256){existing=r;break;}}
          if(existing){state.preparedTicketImports[id]=true;save();continue;}
          if(typeof f.base64!=='string'||f.base64.length>Math.ceil(20*1048576/3)*4+4)throw Error('票据文件超过单份容量限制。');
          const bytes=bytesFrom64(f.base64);if(bytes.length!==f.bytes||await hashBytes(bytes)!==f.sha256)throw Error('票据下载不完整，联网后重试。');
          const blob=new Blob([bytes],{type:f.type});if(await fileType(blob)!==f.type)throw Error('票据格式校验失败。');
          const previews=[];let storedBytes=bytes.length;
          for(const p of f.previews||[]){if(!p||!Number.isInteger(p.page)||p.page<1||p.page>500||!Number.isInteger(p.bytes)||p.bytes<=0||p.bytes>20*1048576||typeof p.base64!=='string'||p.base64.length>Math.ceil(20*1048576/3)*4+4||!/^[a-f0-9]{64}$/.test(p.sha256)||p.type!=='image/png')throw Error('票据预览信息校验失败。');const b=bytesFrom64(p.base64);if(b.length!==p.bytes||await hashBytes(b)!==p.sha256)throw Error('票据预览下载不完整。');const image=new Blob([b],{type:'image/png'});if(await fileType(image)!=='image/png')throw Error('票据预览格式错误。');previews.push({blob:image,page:p.page});storedBytes+=b.length;}
          if(records.length>=100||records.reduce((n,r)=>n+r.bytes,0)+storedBytes>100*1048576)throw Error('本机票夹空间不足，已存好的票据仍保留。');
          const record={id,name:String(f.name).slice(0,240),category:f.category,day:f.day,type:f.type,bytes:storedBytes,originalBytes:f.bytes,sha256:f.sha256,savedAt:new Date().toISOString(),blob,previews};
          await storeTicket(record);state.preparedTicketImports[id]=true;save();added++;
        }
        state.ticketBundleRevision=bundleRevision;save();toast(added?`已帮你存入 ${added} 份票据，断网也能打开。`:'准备好的票据已在本机，无需重复导入。');
      }catch(error){bundleError=error.message||'暂未存入，请联网后重试。';}
      finally{bundleBusy=false;if(state.view==='vault')renderVault();}
    }
    async function loadFiles(){const generation=++loadGeneration;ready=false;try{failure='';records=[];const all=await filesOp('readonly',s=>s.getAll());if(generation!==loadGeneration)return;storageRows=all.filter(r=>r.schema===2);const legacy=all.filter(r=>r.schema!==2);legacyCount=legacy.length;
      if(unlocked()){
        for(const row of storageRows){try{const metadata=await metadataFor(row);if(generation!==loadGeneration)return;records.push(metadata);}catch(error){if(!unlocked())return;failure='部分附件无法解密，密文仍保留。请恢复对应的私密区备份。';}}
        for(const row of legacy){if(generation!==loadGeneration||!unlocked())return;try{const migrated=await migrateLegacy(row);if(generation!==loadGeneration)return;storageRows.push(migrated.row);records.push(migrated.metadata);legacyCount--;}catch(error){if(!unlocked())return;failure='旧附件迁移尚未完成，原件仍保留且尚未加密。请保留原文件后重试。';}}
        records.sort((a,b)=>String(b.savedAt).localeCompare(String(a.savedAt)));
      }ready=true;
    }catch{if(generation!==loadGeneration)return;ready=true;failure='当前浏览器暂时无法保存附件。请用 Safari 或 Chrome 打开，并确认允许本机存储。';}if(state.view==='vault')renderVault();}
    function closePreview(){for(const url of previewImages)URL.revokeObjectURL(url);previewImages=[];if(previewURL){URL.revokeObjectURL(previewURL);previewURL='';}$('#ticket-preview-body').replaceChildren();$('#ticket-preview-title').textContent='票据';$('#ticket-original').removeAttribute('href');$('#ticket-original').removeAttribute('download');}
    async function openTicket(id){
      requireVault();const r=records.find(r=>r.id===id);if(!r)return;const blob=await originalFor(r);requireVault();closePreview();previewURL=URL.createObjectURL(blob);$('#ticket-preview-title').textContent=r.name;
      const body=$('#ticket-preview-body'),el=document.createElement(r.type==='application/pdf'?'iframe':'img');el.src=previewURL;
      if(r.type==='application/pdf')el.title='PDF 票据预览';else{el.alt=r.name;el.onerror=()=>{body.textContent='当前浏览器无法预览此图片，请另存原文件后查看。';};}
      const stored=storageRows.find(row=>row.id===id);
      if(r.type==='application/pdf'&&stored.previews?.length){for(const p of stored.previews){const opened=await vault().openBlob(p.blob);requireVault();const image=document.createElement('img'),url=URL.createObjectURL(opened.blob);previewImages.push(url);image.src=url;image.alt=`${r.name}，第${opened.metadata?.page||''}页`;image.className='ticket-page-preview';body.append(image);}}else body.append(el);requireVault();const link=$('#ticket-original');link.href=previewURL;link.download=r.name;$('#ticket-preview').showModal();
    }
    function renderReminders(){
      $('#export-reminders').disabled=!unlocked();
      if(!unlocked()){$('#reminder-list').innerHTML='<p class="vault-error">出发提醒保存在本机加密私密区。请先解锁，再核对和编辑真实票面时间；锁定时不会写入或导出提醒。</p><button class="primary-button" data-guide="private">解锁私密资料</button>';return;}
      const rows=remindersForState(state,D);
      $('#reminder-list').innerHTML=rows.map(r=>`<article class="reminder-row"><label class="reminder-pick"><input type="checkbox" data-reminder-id="${r.id}" data-reminder-field="enabled" ${r.enabled?'checked':''}><strong>${esc(r.title)}</strong></label><p>${esc(r.detail||'按正式票面或本人确认时间填写。')}</p><p class="minor">当地时区：${esc(r.timezone)}</p><div class="reminder-fields"><label>出发时间<input type="datetime-local" value="${r.when}" data-reminder-id="${r.id}" data-reminder-field="when" required aria-label="${esc(r.title)} 出发时间"></label><label>提前提醒<select data-reminder-id="${r.id}" data-reminder-field="lead" aria-label="${esc(r.title)} 提前提醒">${[0,15,30,60,120,150,180].map(n=>`<option value="${n}" ${r.lead===n?'selected':''}>${n===0?'不设提醒':n%60===0?'提前 '+n/60+' 小时':'提前 '+n+' 分钟'}</option>`).join('')}</select></label></div>${r.pending?'<p class="reminder-pending">待出票计划；购票后请按票面时间修改。</p>':''}</article>`).join('')||'<p class="empty-state">还没有已确认的出发提醒。购票后按日期、当地时区和票面时间添加；待订计划默认不启用提醒。</p>';
    }
    document.body.insertAdjacentHTML('beforeend',`<dialog id="ticket-preview" class="ticket-preview"><div class="dialog-top"><h2 id="ticket-preview-title">票据</h2><button class="icon-button" data-close="ticket-preview" aria-label="关闭票据">×</button></div><div class="ticket-preview-tools"><a class="soft-button" id="ticket-original" target="_blank" rel="noopener">打开／下载原文件</a><span class="minor">PDF 无法预览时，请打开原文件。</span></div><div id="ticket-preview-body"></div></dialog><dialog id="ticket-delete" class="help-dialog"><div class="dialog-top"><h2>删除这份票据？</h2></div><div class="help-content"><p id="ticket-delete-name"></p><p>将从当前手机票夹中删除，保存在手机其他位置的原文件不受影响。</p><div class="help-actions"><button class="soft-button" data-close="ticket-delete">保留</button><button class="primary-button" id="ticket-delete-confirm">确认删除</button></div></div></dialog><dialog id="reminder-dialog" class="reminder-dialog"><div class="dialog-top"><h2>出发提醒</h2><button class="icon-button" data-close="reminder-dialog" aria-label="关闭出发提醒">×</button></div><div class="reminder-content"><p>核对时间、勾选需要的项目，再导入手机日历。每项采用所标注的当地 IANA 时区；导出时换算为准确时刻，手机会按日历设置显示。修改仅影响提醒，不改动原行程。</p><p class="minor">导入后由手机日历提醒，请确认日历通知已开启。这里不会自动改签或订票；再次导入前请检查日历里是否已有同名行程。</p><div id="reminder-list"></div><div class="reminder-export"><button class="primary-button" id="export-reminders">导出手机日历提醒</button><p class="minor">下载 .ics 文件后，用手机日历打开并添加。原文件中的时间不会随航班变更自动更新。</p></div></div></dialog>`);
    $('#ticket-preview').addEventListener('close',closePreview);
    document.addEventListener('click',async e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b.hasAttribute('data-open-reminders')){renderReminders();$('#reminder-dialog').showModal();}
      if(b.dataset.guide==='private')$('#reminder-dialog').close();
      if(b.dataset.nextOpen){openStep(b.dataset.nextOpen);}
      if(b.dataset.focusRow){state.focus[D.days[state.day].id]=b.dataset.focusRow;save();renderNext();$('#next-stop')?.scrollIntoView({block:'center',behavior:'instant'});toast('从这一步继续，之前的记录保持原样。');}
      if(b.hasAttribute('data-next-clock')){delete state.focus[D.days[state.day].id];save();renderNext();}
      if(b.dataset.nextDone){const rows=D.days[state.day].rows,index=rows.findIndex(r=>r.id===b.dataset.nextDone);if(index<0)return;state.done[rows[index].id]=true;state.focus[D.days[state.day].id]=rows.slice(index+1).find(r=>!state.done[r.id])?.id||'end';save();renderJourney();toast('已完成，继续下一步。');}
      if(b.dataset.ticketOpen){try{await openTicket(b.dataset.ticketOpen);}catch(error){closePreview();toast(error.message||'附件暂时无法打开，原件仍保留。');}}
      if(b.dataset.ticketSave){try{requireVault();const r=records.find(r=>r.id===b.dataset.ticketSave);if(r){const blob=await originalFor(r);requireVault();download(blob,r.name);}}catch(error){toast(error.message||'附件暂时无法解密。');}}
      if(b.dataset.ticketDelete){try{requireVault();deleteID=b.dataset.ticketDelete;$('#ticket-delete-name').textContent=records.find(r=>r.id===deleteID)?.name||'';$('#ticket-delete').showModal();}catch(error){toast(error.message);}}
      if(b.hasAttribute('data-ticket-bundle-import'))await importPreparedTickets(true);
      if(b.hasAttribute('data-vault-retry')){ready=false;renderVault();loadFiles();}
      if(b.id==='ticket-delete-confirm'){b.disabled=true;try{requireVault();await filesOp('readwrite',s=>s.delete(deleteID));records=records.filter(r=>r.id!==deleteID);storageRows=storageRows.filter(r=>r.id!==deleteID);$('#ticket-delete').close();renderVault();toast('票据已从本机票夹删除。');}catch(error){toast(error.message||'未能删除，请重试。');}finally{b.disabled=false;}}
      if(b.id==='export-reminders'){if(!unlocked()){toast('请先解锁私密区，再导出出发提醒。');return;}const events=remindersForState(state,D);if(!events.some(r=>r.enabled)){toast('先勾选至少一项提醒。');return;}try{download(new Blob([buildCalendar(events)],{type:'text/calendar;charset=utf-8'}),'丝路环线2027_出发提醒.ics');toast('请用手机日历打开下载的提醒文件。');}catch(error){toast(error.message||'请检查出发日期、时间和时区。');}}
    });
    document.addEventListener('change',async e=>{
      const t=e.target;
      if(t.id==='ticket-filter'){filter=t.value;renderVault();}
      if(t.dataset.reminderId){if(!unlocked()){renderReminders();toast('请先解锁私密区，再修改出发提醒。');return;}const id=t.dataset.reminderId,r=remindersForState(state,D).find(r=>r.id===id);if(!r)return;const value={when:r.when,lead:r.lead,enabled:r.enabled};if(t.dataset.reminderField==='when'){if(!isDateTime(t.value)){toast('请填写有效的日期与时间。');return;}value.when=t.value;}if(t.dataset.reminderField==='lead')value.lead=Number(t.value);if(t.dataset.reminderField==='enabled')value.enabled=t.checked;state.reminders[id]=value;save();}
      if(['ticket-pdf','ticket-images','ticket-files'].includes(t.id)&&!uploading&&!bundleBusy){
        if(!unlocked()){toast('请先解锁私密区，再导入票据。');t.value='';return;}
        const files=Array.from(t.files||[]),category=$('#ticket-category').value,dayID=$('#ticket-day').value;if(!files.length)return;
        if(!Object.hasOwn(categories,category)||!(dayID===''||D.days.some(d=>d.id===dayID))){toast('请重新选择票据类型和日期。');return;}
        uploading=true;renderVault();let count=0,duplicates=0,error='';
        for(const file of files){try{
          requireVault();
          if(!file.size||file.size>20*1048576)throw new Error('单份票据需在 20 MB 以内。');
          const type=await fileType(file),sha256=await hashBytes(await file.arrayBuffer());
          let existing=records.find(r=>r.sha256===sha256);
          if(!existing)for(const r of records.filter(r=>(r.originalBytes||r.bytes)===file.size&&!r.sha256)){if(await hashBytes(await (await originalFor(r)).arrayBuffer())===sha256){existing=r;break;}}
          if(existing){duplicates++;continue;}
          if(records.length>=100||records.reduce((n,r)=>n+r.bytes,0)+file.size>100*1048576)throw new Error('票夹已达 100 MB 或 100 份上限，请先删除不需要的附件。');
          const record={id:'manual-'+sha256,name:String(file.name||'票据').slice(0,240),category,day:dayID,bytes:file.size,originalBytes:file.size,type,sha256,savedAt:new Date().toISOString(),blob:new Blob([file],{type})};
          await storeTicket(record);count++;
        }catch(err){error=err.name==='QuotaExceededError'?'手机存储空间不足，请先释放空间。':err.message||'附件未能存入，请重试。';}}
        uploading=false;renderVault();toast(`${count?'已存入 '+count+' 份票据。':''}${duplicates?'已跳过 '+duplicates+' 份相同文件。':''}${error?'未存入：'+error:''}`||'没有可导入的票据。');if(count&&navigator.storage?.persist)navigator.storage.persist().catch(()=>{});
      }
    });
    setInterval(()=>{if(document.visibilityState==='visible'&&state.view==='journey')renderNext();},30000);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')renderNext();});
    window.addEventListener('tripvaultchange',event=>{
      if(event.detail?.reason==='write')return;
      if(!unlocked()){loadGeneration++;records=[];closePreview();$('#ticket-preview').close();$('#ticket-delete').close();$('#ticket-delete-name').textContent='';deleteID='';bundleTried=false;}
      if($('#reminder-dialog').open)renderReminders();
      loadFiles();if(state.view==='vault')renderVault();
    });
    loadFiles();return {renderVault,renderNext};
  }
  window.TripTools={nextStep,nextHTML,tripDate,clockMinutes,todayIndex,zonedDateTimeToUTC,remindersForState,cleanSettings,buildCalendar,ticketBundleConfig,mount};
})();
