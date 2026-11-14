(()=>{
  'use strict';
  // Rates are uncalibrated, editable examples in CNY per unit from the user's
  // reference, never live quotes. A saved
  // record's amount, rate and actual CNY are snapshots and are not recalculated.
  const currencies=[
    {code:'CNY',label:'人民币'},{code:'KZT',label:'哈萨克斯坦坚戈'},{code:'UZS',label:'乌兹别克斯坦苏姆'},
    {code:'AZN',label:'阿塞拜疆马纳特'},{code:'GEL',label:'格鲁吉亚拉里'},{code:'AMD',label:'亚美尼亚德拉姆'},
    {code:'RSD',label:'塞尔维亚第纳尔'},{code:'BAM',label:'波黑可兑换马克'},{code:'TRY',label:'土耳其里拉'},
    {code:'EGP',label:'埃及镑'},{code:'AED',label:'阿联酋迪拉姆'},{code:'EUR',label:'欧元'},{code:'USD',label:'美元'}
  ];
  const categories=[{id:'air',label:'航空'},{id:'intercity',label:'交通'},{id:'stay',label:'住宿'},{id:'food',label:'餐饮'},{id:'tickets',label:'门票与活动'},{id:'misc',label:'装备与杂项'},{id:'other',label:'其他'}];
  const countryCodes={CN:'中国',KZ:'哈萨克斯坦',UZ:'乌兹别克斯坦',AZ:'阿塞拜疆',GE:'格鲁吉亚',AM:'亚美尼亚',RS:'塞尔维亚',BA:'波黑',TR:'土耳其',EG:'埃及',AE:'阿联酋'};
  const countryCurrencies={'中国':'CNY','哈萨克斯坦':'KZT','乌兹别克斯坦':'UZS','阿塞拜疆':'AZN','格鲁吉亚':'GEL','亚美尼亚':'AMD','塞尔维亚':'RSD','波黑':'BAM','土耳其':'TRY','埃及':'EGP','阿联酋':'AED'};
  const exampleRates={CNY:1,KZT:1/68,UZS:1/1780,AZN:4.25,GEL:2.65,AMD:1/54,RSD:1/15.5,BAM:3.82,TRY:0.133,EGP:0.123,AED:1.97,EUR:7.47,USD:7.22};
  const copy=value=>JSON.parse(JSON.stringify(value));
  const text=(value,max=300)=>String(value??'').slice(0,max);
  const money=(value,name='金额')=>{if(!['number','string'].includes(typeof value)||(typeof value==='string'&&!value.trim())||!Number.isFinite(Number(value))||Number(value)<0||Number(value)>10000000)throw Error(name+'必须为0至10000000之间的数字');return Number(value);};
  const cents=value=>Math.round((value+Number.EPSILON)*100);
  const rate=value=>{const n=money(value,'汇率');if(n<=0)throw Error('汇率必须大于0');return n;};
  const currency=value=>{const code=String(value||'CNY').toUpperCase();if(!currencies.some(c=>c.code===code))throw Error('不支持的币种：'+code);return code;};
  const identifier=(value,name)=>{if(typeof value!=='string'||!value.trim()||value.length>120||/[|\u0000-\u001f]/.test(value))throw Error(name+'无效');return value;};
  function date(value){const s=text(value,10);if(!s)return '';if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||new Date(s+'T00:00:00Z').toISOString().slice(0,10)!==s)throw Error('日期无效');return s;}
  function country(value){const s=text(value,40);return countryCodes[s.toUpperCase()]||s;}
  function findDay(value){
    if(value&&typeof value==='object')return value;
    const days=window.TRIP_DATA?.days||[];
    if(typeof value==='number'||/^\d+$/.test(String(value)))return days[Number(value)-1]||null;
    return days.find(d=>d.id===value||d.date===value)||null;
  }
  function countryForDay(day){return country(findDay(day)?.country||findDay(day)?.countryCode||'');}
  function currencyForDay(day){return countryCurrencies[countryForDay(day)]||'CNY';}
  function tripDays(value){
    if(value==null||value==='')return [];
    if(!Array.isArray(value))throw Error('行程日必须是数组');
    return [...new Set(value.map(v=>{const n=Number(String(v).replace(/^day/i,''));if(!Number.isInteger(n)||n<1||n>366)throw Error('行程日无效');return n;}))].sort((a,b)=>a-b);
  }
  function countries(value){if(value==null||value==='')return [];if(!Array.isArray(value)||value.length>30)throw Error('国家必须是数组');return [...new Set(value.map(country).filter(Boolean))];}
  function defaults(){
    return {version:1,rates:{...exampleRates},rateDate:'',accounts:[
      {id:'card',label:'银行卡',type:'card'},{id:'alipay',label:'支付宝',type:'wallet'},{id:'wechat',label:'微信',type:'wallet'},
      ...currencies.map(c=>({id:'cash-'+c.code,label:c.code+' 现金',type:'cash',currency:c.code})),{id:'unknown',label:'未指定账户',type:'unknown'}
    ],transfers:[]};
  }
  function normalizeRecord(input){
    if(!input||typeof input!=='object'||Array.isArray(input))throw Error('支出记录无效');
    const category=text(input.category,30);if(!categories.some(c=>c.id===category))throw Error('支出类别无效');
    const code=currency(input.currency),kind=input.kind??'expense';if(!['expense','refund'].includes(kind))throw Error('收支类型无效');
    const cny=cents(money(input.cny,'人民币实付'))/100;
    // Old seven-field records have only a CNY amount. Do not guess their
    // original currency or account from free text.
    const originalAmount=input.amount==null||input.amount===''?cny:money(input.amount,'原币金额');
    const snapshotRate=input.rate==null||input.rate===''?(code==='CNY'?1:(originalAmount&&cny?cny/originalAmount:1)):rate(input.rate);
    if(!Number.isFinite(snapshotRate)||snapshotRate<0)throw Error('记录汇率无效');
    const result={id:identifier(input.id,'记录编号'),date:date(input.date),category,city:text(input.city,100),original:text(input.original,80),cny,note:text(input.note,300),currency:code,amount:originalAmount,rate:snapshotRate,account:input.account?identifier(input.account,'账户'):'unknown',merchant:text(input.merchant,100),countries:countries(input.countries),tripDays:tripDays(input.tripDays),kind};
    if(input.phase!=null&&input.phase!==''){if(!['before','trip','after','undated'].includes(input.phase))throw Error('付款阶段无效');result.phase=input.phase;}
    return result;
  }
  function normalizeTransfer(input){
    if(!input||typeof input!=='object'||Array.isArray(input))throw Error('资金调拨记录无效');
    const kind=input.kind||'transfer';if(!['opening','atm','exchange','transfer','card-to-cash'].includes(kind))throw Error('资金调拨类型无效');
    const fromAccount=input.fromAccount?identifier(input.fromAccount,'转出账户'):'';
    const toAccount=input.toAccount?identifier(input.toAccount,'转入账户'):'';
    if(!toAccount||(!fromAccount&&kind!=='opening'))throw Error('请选择调拨账户；仅期初余额可不填转出账户');
    const fromCurrency=currency(input.fromCurrency||input.toCurrency),toCurrency=currency(input.toCurrency||input.fromCurrency);
    const fromAmount=kind==='opening'&&!fromAccount?0:money(input.fromAmount,'转出金额');
    const toAmount=money(input.toAmount,'转入金额');if(toAmount<=0)throw Error('转入金额必须大于0');
    if(fromAccount&&fromAmount<=0)throw Error('转出金额必须大于0');
    if(fromAccount===toAccount&&fromCurrency===toCurrency)throw Error('同币种调拨的转出和转入账户不能相同');
    return {id:identifier(input.id,'调拨编号'),date:date(input.date),kind,fromAccount,toAccount,fromCurrency,toCurrency,fromAmount,toAmount,note:text(input.note,300)};
  }
  function normalizeLedger(input){
    const result=defaults();if(input==null)return result;
    if(typeof input!=='object'||input.version!==1)throw Error('账本版本不兼容');
    if(input.rates!=null){if(typeof input.rates!=='object'||Array.isArray(input.rates))throw Error('汇率设置无效');for(const c of currencies)if(Object.prototype.hasOwnProperty.call(input.rates,c.code))result.rates[c.code]=rate(input.rates[c.code]);result.rates.CNY=1;}
    result.rateDate=date(input.rateDate);
    if(input.accounts!=null){
      if(!Array.isArray(input.accounts)||input.accounts.length>100)throw Error('账户设置无效');
      const byId=new Map(result.accounts.map(a=>[a.id,a]));
      for(const a of input.accounts){if(!a||typeof a!=='object')throw Error('账户设置无效');const id=identifier(a.id,'账户编号'),type=a.type||'other';if(!['card','wallet','cash','unknown','other'].includes(type))throw Error('账户类型无效');const item={id,label:text(a.label||id,80),type};if(a.currency)item.currency=currency(a.currency);byId.set(id,item);}
      result.accounts=[...byId.values()];
    }
    if(input.transfers!=null){if(!Array.isArray(input.transfers)||input.transfers.length>50000)throw Error('资金调拨记录无效');result.transfers=input.transfers.map(normalizeTransfer);const ids=new Set();for(const t of result.transfers){if(ids.has(t.id))throw Error('资金调拨编号重复');ids.add(t.id);}}
    return result;
  }
  function recordCountries(record){return [...new Set([...(record.countries||[]).map(country),...(record.tripDays||[]).map(countryForDay)].filter(Boolean))];}
  function phaseForRecord(record){const start=window.TRIP_DATA?.startDate||'2027-07-11',end=window.TRIP_DATA?.endDate||'2027-09-06';return !record.date?(record.phase||'undated'):record.date<start?'before':record.date>end?'after':'trip';}
  const round=n=>Math.round((n+Number.EPSILON)*1000000)/1000000;
  function summarize(input,filters={}){
    const state=input||{},ledger=normalizeLedger(state.ledger),all=(state.records||[]).map(normalizeRecord);
    const records=all.filter(r=>{
      if(filters.country&&filters.country!=='all'&&!recordCountries(r).includes(country(filters.country)))return false;
      const requested={pretrip:'before',during:'trip',ontrip:'trip',posttrip:'after'}[filters.phase]||filters.phase;
      if(requested&&requested!=='all'&&phaseForRecord(r)!==requested)return false;
      return (!filters.account||filters.account==='all'||r.account===filters.account)&&(!filters.category||filters.category==='all'||r.category===filters.category);
    });
    const byCategory=categories.map(c=>({...c,spent:records.filter(r=>r.category===c.id).reduce((n,r)=>n+(r.kind==='refund'?-1:1)*cents(r.cny),0)/100,planned:cents(Number((state.budget||[]).find(b=>b.id===c.id)?.amount)||0)/100}));
    const spent=records.reduce((n,r)=>n+(r.kind==='refund'?-1:1)*cents(r.cny),0)/100;
    const planned=(state.budget||[]).filter(b=>!filters.category||filters.category==='all'||b.id===filters.category).reduce((n,b)=>n+cents(Number(b.amount)||0),0)/100;
    // Balances always use the whole ledger, never the current spending filter.
    // Transfers create no expenses; fees must be recorded as separate expenses.
    const balances=new Map();
    const add=(account,code,amount)=>{if(!account)return;const key=account+'|'+code;balances.set(key,round((balances.get(key)||0)+amount));};
    for(const a of ledger.accounts)if(a.type==='cash'&&a.currency)add(a.id,a.currency,0);
    for(const t of ledger.transfers){add(t.fromAccount,t.fromCurrency,-t.fromAmount);add(t.toAccount,t.toCurrency,t.toAmount);}
    for(const r of all)add(r.account,r.currency,(r.kind==='refund'?1:-1)*r.amount);
    const accountBalances=[...balances].map(([key,amount])=>{const [account,currency]=key.split('|'),a=ledger.accounts.find(a=>a.id===account);return {account,currency,amount,label:a?.label||account,type:a?.type||'other'};});
    return {spent,planned,balance:(cents(planned)-cents(spent))/100,byCategory,records,cashBalances:accountBalances.filter(a=>a.type==='cash'||a.account.startsWith('cash-')),accountBalances};
  }
  const csvFields=['id','date','category','city','original','cny','note','currency','amount','rate','account','merchant','countries','tripDays','kind','phase'];
  function csvCell(value){let s=String(value??'');if(s.startsWith("'")||/^[\s\uFEFF]*[=+\-@]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function toCSV(records){return '\uFEFF'+[csvFields.map(csvCell).join(','),...records.map(r=>{const record=normalizeRecord(r);return csvFields.map(k=>csvCell(Array.isArray(record[k])?record[k].join('|'):record[k])).join(',');})].join('\r\n');}
  function parseCSV(source){
    const input=String(source??'').replace(/^\uFEFF/,'');if(input.length>5*1048576)throw Error('CSV超过5MB');
    const rows=[];let row=[],cell='',quoted=false,closed=false;
    for(let i=0;i<input.length;i++){
      const ch=input[i];
      if(quoted){if(ch==='"'){if(input[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=ch;continue;}
      if(ch==='"'){if(cell||closed)throw Error('CSV引号格式无效');quoted=true;continue;}
      if(ch===','||ch==='\r'||ch==='\n'){row.push(cell);cell='';closed=false;if(ch!==','){if(ch==='\r'&&input[i+1]==='\n')i++;if(row.some(Boolean))rows.push(row);row=[];}continue;}
      if(closed)throw Error('CSV引号后有多余字符');cell+=ch;
    }
    if(quoted)throw Error('CSV引号未闭合');if(cell||row.length){row.push(cell);if(row.some(Boolean))rows.push(row);}
    if(!rows.length)return [];
    const header=rows.shift();if(new Set(header).size!==header.length||!['id','category','cny'].every(k=>header.includes(k)))throw Error('CSV缺少id、category或cny列，或存在重复列');
    return rows.map((columns,index)=>{if(columns.length!==header.length)throw Error('CSV第'+(index+2)+'行列数不符');const raw={};for(let i=0;i<header.length;i++){let value=columns[i];if(value.startsWith("''")||/^'[\s\uFEFF]*[=+\-@]/.test(value)||/^'[\t\r\n]/.test(value))value=value.slice(1);if(csvFields.includes(header[i]))raw[header[i]]=value;}for(const k of ['countries','tripDays'])raw[k]=raw[k]?raw[k].split('|'):[];return normalizeRecord(raw);});
  }
  function normalizeImport(input){
    if(!input||typeof input!=='object')throw Error('导入格式无效');const records=Array.isArray(input)?input:input.records;
    if(!Array.isArray(records)||records.length>50000)throw Error('导入缺少支出记录或记录过多');
    const normalized=records.map(normalizeRecord),ids=new Set();for(const r of normalized){if(ids.has(r.id))throw Error('导入记录编号重复');ids.add(r.id);}
    const result={records:normalized};if(!Array.isArray(input)&&input.ledger!=null)result.ledger=normalizeLedger(input.ledger);return result;
  }
  window.TripLedgerCore={currencies,categories,defaults,normalizeRecord,normalizeLedger,normalizeTransfer,countryForDay,currencyForDay,recordCountries,phaseForRecord,summarize,toCSV,parseCSV,normalizeImport};
})();
