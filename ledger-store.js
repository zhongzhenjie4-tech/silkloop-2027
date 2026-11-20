(()=>{
  'use strict';
  const KEY='silkloop-2027-ledger-public-v1',C=window.TripLedgerCore,copy=v=>JSON.parse(JSON.stringify(v));
  const base=()=>C.normalizeImport(window.TRIP_LEDGER_PUBLIC||{records:[]}).records;
  const budgets=[['air','首段及跨国航空',7543],['intercity','城际与地面接驳',2650],['stay','48晚住宿',3500],['food','餐饮饮水',3000],['tickets','门票、团游与船游',2950],['misc','签证保险装备通讯洗衣明信片',1640],['reserve','机动金',717]].map(([id,label,amount])=>({id,label,amount}));
  let saved={version:1,budget:copy(budgets),records:[],hidden:[],ledger:C.defaults()},warning='',queue=Promise.resolve();
  function validate(input){
    if(!input||input.version!==1||!Array.isArray(input.budget)||!Array.isArray(input.records))throw Error('账本格式无效');
    const budget=budgets.map(b=>{const found=input.budget.find(x=>x.id===b.id);if(!found||!Number.isFinite(Number(found.amount))||Number(found.amount)<0||Number(found.amount)>10000000)throw Error('预算金额无效');return {...b,amount:Math.round(Number(found.amount)*100)/100};});
    const records=C.normalizeImport({records:input.records}).records,hidden=Array.isArray(input.hidden)?input.hidden.filter(id=>typeof id==='string'):[];
    return {version:1,budget,records,hidden,ledger:C.normalizeLedger(input.ledger)};
  }
  try{const raw=localStorage.getItem(KEY);if(raw)saved=validate(JSON.parse(raw));}catch{warning='本机账本读取失败，当前先显示公开已确认花销；原存储未清除。';}
  function getState(){const records=new Map(base().filter(r=>!saved.hidden.includes(r.id)).map(r=>[r.id,r]));for(const r of saved.records)records.set(r.id,r);return copy({...saved,records:[...records.values()]});}
  function update(fn){
    const run=()=>{try{const before=getState(),draft=copy(before),result=fn(draft);if(result?.then)throw Error('更新须同步完成');const next=validate(result||draft),baseline=base(),baselineMap=new Map(baseline.map(r=>[r.id,r]));
      const ids=new Set(next.records.map(r=>r.id));next.hidden=baseline.filter(r=>!ids.has(r.id)).map(r=>r.id);next.records=next.records.filter(r=>!baselineMap.has(r.id)||JSON.stringify(r)!==JSON.stringify(baselineMap.get(r.id)));
      localStorage.setItem(KEY,JSON.stringify(next));saved=next;warning='';window.dispatchEvent(new CustomEvent('tripledgerchange'));return true;
    }catch(error){warning=error.message||'账单未保存';return false;}};
    const result=queue.then(run,run);queue=result.catch(()=>{});return result;
  }
  window.TripLedgerStore={KEY,getState,ready:async()=>getState(),update,warning:()=>warning,subscribe:fn=>{const h=()=>fn(getState());window.addEventListener('tripledgerchange',h);return ()=>window.removeEventListener('tripledgerchange',h);}};
})();
