(()=>{
  'use strict';
  const KEY='silkloop-2027-planning-v1';
  const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const defaults=[{"id":"air","label":"首段及跨国航空","amount":7543},{"id":"intercity","label":"城际与地面接驳","amount":2650},{"id":"stay","label":"49晚住宿","amount":3500},{"id":"food","label":"餐饮饮水","amount":3000},{"id":"tickets","label":"门票、团游与船游","amount":2950},{"id":"misc","label":"签证保险装备通讯洗衣明信片","amount":1640},{"id":"reserve","label":"机动金","amount":717}];
  const actualCategories=[...defaults.filter(c=>c.id!=='reserve'),{id:'other',label:'其他实际支出'}];
  const initial=()=>({version:1,budget:defaults.map(x=>({...x})),records:[],updated:''});
  const copy=v=>JSON.parse(JSON.stringify(v));
  const unlocked=()=>!!window.TripVault?.isUnlocked();
  const validMoney=v=>v!==null&&v!==''&&Number.isFinite(Number(v))&&Number(v)>=0&&Number(v)<=10000000;
  let state=initial(),notice='',loaded=false,loading=null,session=0,wasUnlocked=unlocked(),queue=Promise.resolve(),writing=0;
  const mounted=new Map();
  function normalize(parsed,strict=false){
    if(!parsed||parsed.version!==1||!Array.isArray(parsed.budget)||!Array.isArray(parsed.records))throw Error('预算备份格式不兼容，原资料已保留。');
    const fresh=initial();
    for(const item of fresh.budget){const found=parsed.budget.find(x=>x&&x.id===item.id);if(found&&validMoney(found.amount))item.amount=Number(found.amount);else if(strict)throw Error('预算字段无效，原资料已保留。');}
    for(const r of parsed.records){
      if(!r||typeof r.id!=='string'||!validMoney(r.cny)||!actualCategories.some(c=>c.id===r.category))throw Error('实付字段无效，原资料已保留。');
      fresh.records.push({id:r.id,date:String(r.date||'').slice(0,10),category:r.category,city:String(r.city||'').slice(0,100),original:String(r.original||'').slice(0,80),cny:Number(r.cny),note:String(r.note||'').slice(0,300)});
    }
    fresh.updated=typeof parsed.updated==='string'?parsed.updated:'';return fresh;
  }
  function checkSession(g){if(g!==session||!unlocked())throw Error('私密区已锁定或已切换，未提交此操作。请解锁后重试。');}
  function repaint(){for(const [el,options] of mounted){if(el.isConnected===false){mounted.delete(el);continue;}try{mount(el,options);}catch{el.textContent='预算界面暂时无法显示，请重新打开；加密资料未改动。';}}}
  async function encrypt(next,g){checkSession(g);writing++;try{await window.TripVault.writeSection('planning',next);checkSession(g);}finally{writing--;}}
  function ensureLoaded(){
    if(!unlocked())return Promise.reject(Error('请先解锁本机私密区。'));
    if(loaded)return Promise.resolve();if(loading)return loading;
    const g=session;
    const task=(async()=>{
      const current=window.TripVault.readSection('planning');
      let next=current==null?initial():normalize(current),legacyRaw=null;
      // No access to legacy plaintext occurs while the vault is locked.
      try{legacyRaw=window.localStorage.getItem(KEY);}catch{notice='无法检查旧版本机记录；加密区内资料仍可使用。';}
      if(legacyRaw){
        try{
          const legacy=normalize(JSON.parse(legacyRaw),true);
          if(current==null)next=legacy;
          else{const merged=new Map(legacy.records.map(r=>[r.id,r]));for(const r of next.records)merged.set(r.id,r);next.records=[...merged.values()];}
          next.updated=new Date().toISOString();await encrypt(next,g);
          try{if(window.localStorage.getItem(KEY)===legacyRaw)window.localStorage.removeItem(KEY);else throw Error('changed');notice='旧版预算与实付已迁入本机加密区，原明文已清除。';}
          catch{notice='加密迁移已保存，但旧明文未能清除；请保留加密备份后重试清理。';}
        }catch(error){checkSession(g);next=current==null?initial():normalize(current);notice='旧版记录尚未迁移：'+(error.message||'加密保存失败')+' 原明文已保留，当前只显示加密区内资料。';}
      }
      checkSession(g);state=next;loaded=true;
    })();
    loading=task;
    task.then(()=>{if(loading===task)loading=null;repaint();},error=>{if(loading===task)loading=null;if(g===session){state=initial();loaded=false;notice='私密预算读取失败：'+(error.message||'请重新解锁后重试');repaint();}});
    return task;
  }
  function change(update,success){
    const g=session;
    const run=async()=>{checkSession(g);await ensureLoaded();checkSession(g);const next=update(copy(state));next.updated=new Date().toISOString();await encrypt(next,g);state=next;notice=success;repaint();return true;};
    const result=queue.then(run,run);queue=result.catch(()=>{});
    return result.catch(error=>{if(g===session){notice='未保存：'+(error.message||'加密存储失败')+' 当前已保存资料未被覆盖。';repaint();}return false;});
  }
  const amount=n=>'¥'+Number(n).toLocaleString('zh-CN',{minimumFractionDigits:0,maximumFractionDigits:2});
  function visible(){return unlocked()&&loaded?state:initial();}
  function totals(){const s=visible(),planned=s.budget.reduce((n,r)=>n+r.amount,0),spent=s.records.reduce((n,r)=>n+r.cny,0);return {planned,spent,balance:planned-spent};}
  function categoryLabel(id){return actualCategories.find(c=>c.id===id)?.label||id;}
  async function exportEncrypted(){
    const g=session;try{checkSession(g);await queue;await ensureLoaded();checkSession(g);const blob=await window.TripVault.exportBackup();checkSession(g);const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='丝路随行-私密区加密备份-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);notice='已导出统一加密备份；不含票夹附件，请另保留票据原件。';repaint();}catch(error){if(g===session){notice='加密备份未导出：'+(error.message||'请在私密区重试');repaint();}}
  }
  function mount(target,options={}){
    const el=typeof target==='string'?document.querySelector(target):target;if(!el)return null;mounted.set(el,options);
    const isOpen=unlocked(),editable=isOpen&&loaded,s=visible(),day=options.day||{},total=totals(),defaultDate=day.date||'2027-07-11',rows=s.records.slice().reverse();
    const publicInfo='<p class="minor">58天压价目标22000元；完整路线分配参考24883元，差2883元需要真实压价或少买可选门票。49晚具名住宿搜索目标3925–6835元；目标预算中的3500元尚未实现。个人已保存预算与实付不会被这次更新覆盖。</p>';
    if(!editable){
      el.innerHTML='<section class="planning-panel" aria-label="公开预算草案"><div class="day-highlights"><strong>'+amount(total.planned)+' 公开预算草案</strong></div>'+publicInfo+'<div class="planning-budget">'+defaults.map(c=>'<p>'+E(c.label)+'：'+amount(c.amount)+'</p>').join('')+'</div><p class="minor" role="status">'+E(isOpen?'正在读取本机加密预算……':'个人预算与实付记录已锁定。解锁后才能查看、编辑和迁移旧记录。')+'</p><button type="button" class="soft-button" data-guide="private">'+(isOpen?'打开本机私密区':'解锁本机私密区')+'</button><p class="planning-notice minor" role="status" aria-live="polite">'+E(notice)+'</p></section>';
      el.onchange=null;el.onsubmit=null;el.onclick=null;if(isOpen&&!loading)ensureLoaded().catch(()=>{});return {key:KEY,totals:total};
    }
    el.innerHTML='<section class="planning-panel" aria-label="私密预算与实际支出"><div class="day-highlights"><strong>'+amount(total.planned)+' 私人规划</strong><br>已记实付 '+amount(total.spent)+' · 规划余额 '+amount(total.balance)+'</div>'+publicInfo+'<details><summary>编辑各类私人预算</summary><div class="planning-budget">'+s.budget.map(c=>'<label style="display:block;margin:10px 0">'+E(c.label)+' <input type="number" inputmode="decimal" min="0" max="10000000" step="0.01" data-budget-id="'+E(c.id)+'" value="'+c.amount+'" aria-label="'+E(c.label)+'人民币预算" style="max-width:140px"> 元</label>').join('')+'</div><p class="minor">应急已含在规划总额；只在实际付款后记录实付。</p></details><details '+(options.compact?'':'open')+'><summary>记一笔私密实付</summary><form data-expense-form><div class="planning-fields" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin:12px 0"><label>日期 <input name="date" type="date" required value="'+E(defaultDate)+'"></label><label>类别 <select name="category">'+actualCategories.map(c=>'<option value="'+E(c.id)+'">'+E(c.label)+'</option>').join('')+'</select></label><label>城市/段落 <input name="city" maxlength="100" value="'+E(day.city||'')+'" placeholder="如：开罗／SPX接驳"></label><label>原币金额 <input name="original" maxlength="80" placeholder="如：70 AED，供留底"></label><label>折合人民币 <input name="cny" type="number" inputmode="decimal" required min="0.01" max="10000000" step="0.01" placeholder="手工填实际人民币"></label><label>说明 <input name="note" maxlength="300" placeholder="票价含税／单程／行李等"></label></div><button class="soft-button" type="submit">加密保存这笔实付</button></form></details><p class="planning-notice minor" role="status" aria-live="polite">'+E(notice||'仅加密保存在本机此浏览器；清除浏览器数据会丢失，请保留口令和加密备份。')+'</p><div class="travel-tools"><button class="soft-button" type="button" data-planning-export>导出统一加密备份</button><button class="soft-button" type="button" data-guide="private">私密区与备份恢复</button><label class="soft-button" style="cursor:pointer">迁入旧版预算JSON<input data-planning-import type="file" accept=".json,application/json" style="display:none"></label></div><details '+(rows.length?'open':'')+'><summary>已记实付 '+rows.length+' 笔</summary>'+(!rows.length?'<p class="minor">尚未记录实付，草案估算不会自动成为实付。</p>':'<div class="table-scroll"><table><thead><tr><th>日期／城市</th><th>类别</th><th>原币</th><th>人民币</th><th>说明</th><th></th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+E(r.date)+'<br>'+E(r.city)+'</td><td>'+E(categoryLabel(r.category))+'</td><td>'+E(r.original||'—')+'</td><td>'+amount(r.cny)+'</td><td>'+E(r.note)+'</td><td><button type="button" class="soft-button" data-expense-delete="'+E(r.id)+'" aria-label="删除'+E(r.date)+'这笔实付">删除</button></td></tr>').join('')+'</tbody></table></div>')+'</details></section>';
    el.onchange=async event=>{
      const t=event.target;if(!unlocked()){repaint();return;}
      if(t.matches('[data-budget-id]')){const id=t.dataset.budgetId,value=t.value;if(!validMoney(value)){notice='请输入0至10000000之间的人民币金额。';repaint();return;}await change(next=>{const cat=next.budget.find(c=>c.id===id);if(!cat)throw Error('预算类别无效');cat.amount=Number(value);return next;},'私人预算已加密保存到本机。');}
      if(t.matches('[data-planning-import]')&&t.files?.[0]){
        const g=session,file=t.files[0];try{if(file.size>5*1048576)throw Error('旧备份超过5MB');const parsed=normalize(JSON.parse(await file.text()),true);checkSession(g);await change(next=>{const merged=new Map(next.records.map(r=>[r.id,r]));for(const r of parsed.records)merged.set(r.id,r);next.budget=parsed.budget;next.records=[...merged.values()];return next;},'旧JSON已加密迁入，实付按ID合并，现有记录保留。旧备份文件仍是明文，请自行妥善处理。');}catch(error){if(g===session){notice='旧JSON未导入：'+(error.message||'格式无效')+' 当前资料已保留。';repaint();}}
      }
    };
    el.onsubmit=async event=>{
      if(!event.target.matches('[data-expense-form]'))return;event.preventDefault();if(!unlocked()){repaint();return;}
      const data=new FormData(event.target),cny=Number(data.get('cny')),category=String(data.get('category')||'other');
      if(!validMoney(cny)||cny<=0||!actualCategories.some(c=>c.id===category)){notice='请填写有效类别和大于0的人民币实付。';repaint();return;}
      const record={id:'expense-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),date:String(data.get('date')||'').slice(0,10),category,city:String(data.get('city')||'').slice(0,100),original:String(data.get('original')||'').slice(0,80),cny,note:String(data.get('note')||'').slice(0,300)};
      await change(next=>{next.records.push(record);return next;},'实付已加密保存到本机。');
    };
    el.onclick=async event=>{const button=event.target.closest('button');if(!button)return;if(!unlocked()){repaint();return;}if(button.hasAttribute('data-planning-export'))await exportEncrypted();if(button.hasAttribute('data-expense-delete')){const id=button.dataset.expenseDelete;await change(next=>{next.records=next.records.filter(r=>r.id!==id);return next;},'这笔实付已从本机加密记录删除。');}};
    return {key:KEY,totals:total};
  }
  function mountAll(scope=document,options={}){return [...(scope.matches?.('[data-trip-planning]')?[scope]:[]),...scope.querySelectorAll('[data-trip-planning]')].map(el=>mount(el,options));}
  window.addEventListener('tripvaultchange',event=>{
    // A write to hotel/flight/pocketNotes must not replace an in-progress budget form.
    if(event.detail?.reason==='write'&&(event.detail.section!=='planning'||writing))return;
    const open=unlocked();if(!open){session++;state=initial();loaded=false;loading=null;notice='私密区已锁定，私人预算与实付已从页面清除。';}
    else if(!wasUnlocked||['setup','unlock','import','reset'].includes(event.detail?.reason)){session++;loaded=false;loading=null;notice='';}
    else if(writing)return;
    else if(loaded){try{const stored=window.TripVault.readSection('planning');state=stored==null?initial():normalize(stored);}catch(error){state=initial();loaded=false;notice='私密预算读取失败：'+error.message;}}
    wasUnlocked=open;repaint();if(open&&!loaded&&!loading)ensureLoaded().catch(()=>{});
  });
  window.TripPlanning={KEY,mount,mountAll,totals,getState:()=>copy(visible())};
})();
