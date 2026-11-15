(()=>{
  'use strict';
  const C=window.TripLedgerCore,S=window.TripLedgerStore;
  const endpoint='https://open.er-api.com/v6/latest/CNY';
  let pending=null,busy=false,notice='';
  const emit=()=>window.dispatchEvent(new CustomEvent('tripledgerrateschange'));
  const current=()=>S.getState().ledger;
  const fallback=()=>current().rateInfo.kind==='online'?'cache':current().rateInfo.kind==='baseline'?'baseline':'manual';
  function parse(response,now){
    if(!response||response.result!=='success'||response.base_code!=='CNY'||!response.rates||typeof response.rates!=='object')throw Error('汇率接口数据格式或基准币种不符');
    if(response.rates.CNY!==1)throw Error('人民币基准值无效');
    const rates={CNY:1};
    for(const {code} of C.currencies){
      const value=response.rates[code];
      if(typeof value!=='number'||!Number.isFinite(value)||value<=0)throw Error('缺少或无效币种：'+code);
      // The endpoint quotes foreign units per CNY; ledger quotes CNY per unit.
      rates[code]=code==='CNY'?1:1/value;
      if(!Number.isFinite(rates[code])||rates[code]>10000000)throw Error('币种报价超出可用范围：'+code);
    }
    const quoted=Number(response.time_last_update_unix)*1000,next=Number(response.time_next_update_unix)*1000;
    if(!Number.isFinite(quoted)||quoted<1577836800000||quoted>now+300000)throw Error('来源报价时间无效，请稍后再试');
    if(!Number.isFinite(next)||next<=quoted||next>quoted+7*86400000)throw Error('来源下次更新时间无效');
    return {rates,rateDate:new Date(quoted).toISOString().slice(0,10),rateInfo:{kind:'online',provider:'ExchangeRate-API',source:'https://www.exchangerate-api.com',quotedAt:new Date(quoted).toISOString(),syncedAt:new Date(now).toISOString(),nextUpdateAt:new Date(next).toISOString(),baselineVersion:C.baselineVersion}};
  }
  function refresh(){
    if(pending)return pending;
    busy=true;notice='正在联网获取汇率…';emit();
    pending=(async()=>{
      let timer;
      try{
        await S.ready();
        if(window.navigator?.onLine===false)throw Error('当前离线');
        const cached=current(),now=Date.now(),info=cached.rateInfo;
        const quoted=Date.parse(info.quotedAt),next=Date.parse(info.nextUpdateAt),synced=Date.parse(info.syncedAt);
        if(info.kind==='online'&&quoted>=1577836800000&&quoted<=now+300000&&next>now&&next>quoted&&next<=quoted+7*86400000&&synced>0&&synced<=now){
          notice='当前已是来源最新日更报价，继续使用本机缓存。';
          return {ok:true,source:'cache',message:notice,info};
        }
        if(typeof window.fetch!=='function')throw Error('当前浏览器无法联网获取汇率');
        const startingRates=JSON.stringify({rates:cached.rates,rateDate:cached.rateDate,rateInfo:cached.rateInfo});
        const controller=new AbortController();timer=setTimeout(()=>controller.abort(),10000);
        const response=await window.fetch(endpoint,{signal:controller.signal,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});
        if(!response.ok)throw Error(response.status===429?'请求过于频繁，请稍后重试':'汇率接口暂不可用');
        const parsed=parse(await response.json(),Date.now());
        const wrote=await S.update(state=>{
          if(JSON.stringify({rates:state.ledger.rates,rateDate:state.ledger.rateDate,rateInfo:state.ledger.rateInfo})!==startingRates)throw Error('等待期间汇率已修改，本次联网结果未覆盖新设置');
          state.ledger={...state.ledger,...parsed};return state;
        });
        if(!wrote)throw Error(S.warning()||'本机保存失败');
        notice='最新参考汇率已保存；历史账单的人民币实付和当笔汇率保持不变。';
        return {ok:true,source:'network',message:notice,info:current().rateInfo};
      }catch(error){
        const source=fallback(),label={cache:'上次成功缓存',baseline:'内置离线基准',manual:'原手动汇率'}[source];
        notice='联网更新失败，继续使用'+label+'。'+(error.name==='AbortError'?'请求超时。':error.message+'。');
        return {ok:false,source,message:notice,info:current().rateInfo};
      }finally{clearTimeout(timer);busy=false;pending=null;emit();}
    })();
    return pending;
  }
  window.TripLedgerRates={refresh,status:()=>({busy,notice})};
})();
