(()=>{
 'use strict';const D=window.TRIP_DATA;
 const scope='单人单程含税，50L主包托运＋10L日用包；比较实际所需额度的最终价，已含行李不重复加购。';
 const airserbia='https://www.airserbia.com/en/explore/services/baggage',pgs='https://www.flypgs.com/en/pegasus-baggage-allowance';
 const make=(id,date,label,good,upper,conditions,url,extra={})=>({id,date,label,goodBuyCny:good,considerUpToCny:upper,waitAboveCny:upper,replanAboveCny:upper,scope,conditions,sources:[{title:'官方核查入口',url}],marketEvidence:[],...extra});
 const data={checked:'2026-11-10',currency:'CNY',status:'采购决策价线，不是最低价预测；真实实付只存本机',scope,quotesConfirmedForUserDates:0,quotesObservedForUserDates:2,actualPaymentsPublic:false,
 routes:[
 make('tas-bak','2027-07-24','塔什干TAS → 巴库GYD',1100,1300,['直飞优先；HY755旧12:30→14:25只是现行样例，2027周六实际开行待核。','乌航/AZAL按含所需托运的最终价比较。'],'https://www.azal.az/en/flights-from-tashkent-to-baku'),
 make('evn-beg','2027-08-01','埃里温EVN → 贝尔格莱德BEG · JU851直飞优先',1250,1400,['官方公布周日14:20→15:35，实际飞行3小时15分；当日可售待出票复核。','Standard含1件23kg托运＋1件8kg手提；与Light单加托运，7/30的968元不能当8/1报价。','11/10本人官网截图Standard 151.91欧元含23kg托运，约1135元（按11/9 ECB参考7.4689）；为待购观察价。'],airserbia,{bookingStatus:'candidate-not-booked',observedQuoteEur:151.91,observedApproxCny:1135,observedOn:'2026-11-10'}),
 make('sjj-saw','2027-08-08','萨拉热窝SJJ → 伊斯坦布尔SAW · PC292',600,750,['按用户确认航段11:05→13:50排程，含20kg托运＋8kg手提按本人票面。','不重复买这段或加购已有行李；真实订单、乘机人与实付不公开。'],pgs,{bookingStatus:'booked-user-reported'}),
 make('asr-hrg','2027-08-20','开塞利ASR → SAW → 赫尔格达HRG · 长转半日',1100,1250,['候选09:05→SAW10:30、21:50→HRG次日00:30，11小时20分中转；平台标行李直达。','用户截图903元含20kg托运＋8kg手提，是观察价不是已买；720元无主包托运不作执行价。','ASR交包核HRG行李牌与两段额度；同一航司保护联程优先。','8/20清晨离开卡帕，17点从Kadıköy回机场、目标18:30抵SAW。'],'https://www.flypgs.com/en/help-center',{bookingStatus:'candidate-not-booked',observedQuoteCny:903,observedOn:'2026-11-09'}),
 make('asw-cai','2027-08-28','阿斯旺ASW → 开罗CAI（夜车替代，可不买）',700,1000,['夜巴为主线；改飞机须连机场接驳、额外住宿与主包托运一起比较。','不计四段主链，不直接接9/2国际航班。'],'https://www.egyptair.com/en/Pages/HomePage.aspx',{optional:true})
 ],totalTargets:{goodBuySumCny:4050,considerUpperSumCny:4700,status:'四段比较目标含已落实SJJ段，不是剩余待付或已核花费',unbookedRouteIds:['tas-bak','evn-beg','asr-hrg'],unbookedGoodBuySumCny:3450,unbookedUpperSumCny:3950}};
 const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const tableHTML=()=>'<div class="fare-targets-grid">'+data.routes.map(r=>'<article class="fare-card"><p class="fare-date">'+E(r.date)+'</p><h4>'+E(r.label)+'</h4><div class="fare-metrics"><div><small>好价不高于</small><strong>¥'+r.goodBuyCny+'</strong></div><div><small>可以考虑至</small><strong>¥'+r.considerUpToCny+'</strong></div></div><ul>'+r.conditions.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>'+r.sources.map(s=>'<a href="'+E(s.url)+'" target="_blank" rel="noopener noreferrer">'+E(s.title)+' ↗</a>').join(' · ')+'</article>').join('')+'</div>';
 const html='<h2>反向路线 · 四段机票价线</h2><p>'+E(scope)+'</p><p>四段好价线合计4050元，上沿4700元；其中SJJ段按用户确认安排。未购三段好价目标3450元，不是实际报价。阿航9/2与9/6两段保留，不重复算待购。</p>'+tableHTML()+'<p>四段尽量争取4000–4200元，不建议都顶上限买。价线是预算决策参考，不承诺未来降到某价，也不把未知票差登记为已节省。</p><a href="./fare-reference.md">下载购票参考</a><button class="soft-button" data-guide="flight-watch">本机航班与订单记录</button>';
 const old=D.guides.find(x=>x.id==='fare-targets');if(old)Object.assign(old,{title:'反向路线 · 机票价线',html});else D.guides.push({id:'fare-targets',title:'反向路线 · 机票价线',subtitle:'四段参考、三段待购；含主包托运',html});
 D.fareTargets=data;window.TripFareTargets={data,tableHTML};
})();
