(()=>{
  'use strict';
  const D=window.TRIP_DATA,KEY='silkloop-2027-flightwatch-v1';
  const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // SWAP_SUPPORT_20261110: new route IDs never inherit old booking state.
  const routes=[["tas-bak","塔什干TAS → 巴库GYD","2027-07-24"],["evn-beg","JU851 EVN14:20 → BEG15:35（用户确认已购）","2027-08-01"],["sjj-saw","PC292 萨拉热窝SJJ → 伊斯坦布尔SAW · 11:05–13:50（用户确认已落实）","2027-08-08"],["asr-hrg","PC2733 ASR09:05 → SAW10:30；PC620 21:50 → HRG次日00:30（用户确认已购）","2027-08-20"],["asw-cai","阿斯旺 → 开罗（与夜巴比较，可不买）","2027-08-28"],["cai-uae","EK928 CAI → DXB · 13:10–17:30（用户确认时刻）","2027-09-02"],["uae-hgh","EK310 DXB → HGH · 04:35–17:05（用户确认时刻）","2027-09-06"]];
  const legacyRoutes=[["evn-cap","旧方案归档 · EVN → SAW → ASR/NAV（记录保留，不代表新方案已订）","2027-08-01"],["ist-sjj","旧方案归档 · 伊斯坦布尔 → 萨拉热窝（原方向，记录保留）","2027-08-13"],["beg-hrg","旧方案归档 · 贝尔格莱德 → 赫尔格达（原方案，记录保留）","2027-08-20"]];
  const allRoutes=[...routes,...legacyRoutes];
  const fields=['date','flight','price','url','status','note','updated'];
  const unlocked=()=>!!window.TripVault?.isUnlocked();
  let records={},loaded=false,loading=null,attempted=false,generation=0,queue=Promise.resolve(),notice='';
  function normalize(value){
    if(!value||typeof value!=='object'||Array.isArray(value))throw Error('航班记录格式无效');
    const next=Object.create(null),blocked=new Set(['__proto__','constructor','prototype']);
    for(const [id,r] of Object.entries(value)){
      if(blocked.has(id)||!r||typeof r!=='object'||Array.isArray(r))continue;
      const clean=Object.create(null);
      for(const f of fields)if(Object.prototype.hasOwnProperty.call(r,f)&&typeof r[f]==='string')clean[f]=r[f].slice(0,f==='note'?3000:2000);
      next[id]=clean;
    }
    return next;
  }
  function check(g){if(g!==generation||!unlocked())throw Error('私密区已锁定，请解锁后重试。');}
  function redraw(){mountAll(document);}
  function load(){
    if(!unlocked()||loaded||attempted)return loading||Promise.resolve();
    attempted=true;const g=generation;
    const task=(async()=>{
      const current=window.TripVault.readSection('flightWatch');let next=normalize(current||{}),old=localStorage.getItem(KEY);
      if(old){const legacy=normalize(JSON.parse(old));next={...legacy,...next};check(g);await window.TripVault.writeSection('flightWatch',next);check(g);if(localStorage.getItem(KEY)===old)localStorage.removeItem(KEY);notice='旧航班记录已加密迁入本机。';}
      check(g);records=next;loaded=true;
    })();loading=task;
    task.then(()=>{if(loading===task)loading=null;redraw();},error=>{if(g===generation){records={};notice='读取或迁移未完成：'+error.message+' 原资料保留，请重新解锁后重试。';}if(loading===task)loading=null;redraw();});
    return task;
  }
  function persist(next){
    const g=generation;records=next;
    const run=async()=>{check(g);await window.TripVault.writeSection('flightWatch',next);check(g);};
    const result=queue.then(run,run);queue=result.catch(error=>{if(g===generation){notice='未保存：'+error.message;for(const el of document.querySelectorAll('[data-flight-saved]'))el.textContent=notice;}});return result;
  }
  D.guides.push({id:'flight-watch',title:'航班计划与本机记录',html:'<h2>航班计划与本机记录</h2><p>公开航段计划按9月2日开罗飞迪拜、9月6日17:05到杭州排，9月7日开学。私人订单状态、实付、实际航班与备注仅在解锁后查看；本机已有记录优先保留，默认日期更新不会覆盖你的填写。旧方案观察记录单独标为归档，保留原日期、价格与状态，不转换为新航段。这里不自动搜票或订票。</p><div data-flight-watch></div>'});
  function mountAll(scope=document){for(const el of scope.querySelectorAll('[data-flight-watch]')){
    if(!unlocked()||!loaded){el.innerHTML='<p class="minor">'+E(notice||'实际航班、观察价、订单状态和备注仅在本机加密区查看。')+'</p>'+allRoutes.map(([,title])=>'<p>'+E(title)+'</p>').join('')+'<button class="soft-button" data-guide="private">打开本机私密区</button>';el.oninput=null;el.onchange=null;el.onclick=null;if(unlocked()&&!attempted)load().catch(()=>{});continue;}
    el.innerHTML='<p class="minor">仅加密保存到本机此浏览器；不会上传公开网页。填写记录不会替你订票。旧方案归档继续保留原记录，不把旧价格或已订状态转给新航线。</p>'+allRoutes.map(([id,title,date])=>{const r=records[id]||{};return '<details class="flight-observation"><summary>'+E(title)+' <span class="minor">'+(r.status==='booked'?'本人标记已订':r.price?'观察价 ¥'+E(r.price):'待观察')+'</span></summary><div class="flight-fields">'+[['date','拟出发日（当地）','date'],['flight','航司／航班','text'],['price','含行李总价（人民币）','number'],['url','来源链接','url']].map(([f,label,type])=>'<label>'+label+'<input type="'+type+'" maxlength="2000" data-flight-id="'+id+'" data-flight-field="'+f+'" value="'+E(r[f]||(f==='date'?date:''))+'"></label>').join('')+'<label>状态<select data-flight-id="'+id+'" data-flight-field="status"><option value="watching">待订／观察中</option><option value="booked" '+(r.status==='booked'?'selected':'')+'>本人确认已订</option></select></label><label>机场、行李与衔接备注<textarea maxlength="3000" data-flight-id="'+id+'" data-flight-field="note">'+E(r.note||'')+'</textarea></label></div></details>';}).join('')+'<p class="minor" data-flight-saved role="status">'+E(notice||'填写即加密保存；票据请导入票夹。')+'</p><button class="soft-button" data-flight-export>导出统一加密备份</button><label class="soft-button file-label">导入本机航班JSON<input type="file" accept=".json,application/json" data-flight-import></label>';
    el.oninput=e=>{const t=e.target,id=t.dataset.flightId,f=t.dataset.flightField;if(!unlocked()||!allRoutes.some(r=>r[0]===id)||!fields.includes(f))return;const next=normalize(records);next[id]={...(next[id]||{}),[f]:String(t.value).slice(0,f==='note'?3000:2000),updated:new Date().toISOString()};el.querySelector('[data-flight-saved]').textContent='正在加密保存……';persist(next).then(()=>{if(unlocked()&&el.isConnected)el.querySelector('[data-flight-saved]').textContent='已加密保存到本机。';}).catch(()=>{});};
    el.onclick=async e=>{if(!e.target.closest('[data-flight-export]')||!unlocked())return;const g=generation;try{await queue;check(g);const blob=await window.TripVault.exportBackup();check(g);const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='丝路随行-私密区加密备份.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){notice=error.message;redraw();}};
    el.onchange=async e=>{if(!e.target.hasAttribute('data-flight-import')||!e.target.files[0]||!unlocked())return;const g=generation;try{const file=e.target.files[0];if(file.size>1048576)throw Error('备份超过1MB');const parsed=JSON.parse(await file.text());check(g);if(parsed.format!=='silkloop-2027-flightwatch/v1')throw Error('请选择航班记录JSON（silkloop-2027-flightwatch/v1）；统一加密备份请在私密区恢复');await persist({...records,...normalize(parsed.records)});check(g);notice='航班JSON已导入本机加密区；原JSON仍是明文，请妥善保管。';redraw();}catch(error){if(g===generation){notice='未导入：'+error.message;redraw();}}};
  }}
  window.addEventListener('tripvaultchange',event=>{if(event.detail?.reason==='write')return;generation++;records={};loaded=false;loading=null;attempted=false;notice='';redraw();if(unlocked())load().catch(()=>{});});
  window.TripFlightWatch={mountAll,getState:()=>unlocked()&&loaded?JSON.parse(JSON.stringify(records)):{},flush:()=>queue};
})();
