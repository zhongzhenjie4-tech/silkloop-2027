(()=>{
 'use strict';const D=window.TRIP_DATA;
 const scope='单人单程含税，50L主包托运＋10L日用包；已购不重复购买或加购已有行李，真实实付只在本机私密区。';
 const airserbia='https://www.airserbia.com/en/explore/services/baggage',pgs='https://www.flypgs.com/en/pegasus-baggage-allowance';
 const make=(id,date,label,good,upper,conditions,url,extra={})=>({id,date,label,goodBuyCny:good,considerUpToCny:upper,waitAboveCny:upper,replanAboveCny:upper,scope,conditions,sources:[{title:'官方入口',url}],marketEvidence:[],...extra});
 const data={checked:'2026-11-10',currency:'CNY',status:'三段已购，历史价线仅作比较；主链只剩TAS→GYD待购',scope,quotesConfirmedForUserDates:0,quotesObservedForUserDates:0,bookedMainRoutes:3,actualPaymentsPublic:false,routes:[
 make('tas-bak','2027-07-24','塔什干TAS → 巴库GYD · 待购',1100,1300,['主链唯一待购航段，按已购后段日期安排。','直飞优先；HY755旧12:30→14:25为现行样例，2027周六实际开行待核。','乌航/AZAL比较含实际所需托运的最终含税价。'],'https://www.azal.az/en/flights-from-tashkent-to-baku'),
 make('evn-beg','2027-08-01','已购JU851 · 埃里温EVN → 贝尔格莱德BEG T2',1250,1400,['本人确认已购8/1 JU851 14:20→15:35，实际飞行3小时15分。','按所选Standard 23kg托运＋8kg手提规划，最终以本人客票为准。','停止追价；只核航变、机场和值机通知。以下金额为原采购目标，不是实付。'],airserbia,{bookingStatus:'booked-user-reported'}),
 make('sjj-saw','2027-08-08','已购PC292 · 萨拉热窝SJJ → 伊斯坦布尔SAW',600,750,['本人确认已购11:05→13:50，按20kg托运＋8kg手提票种规划。','不重复买票或加购；实际订单、乘机人与实付不公开。'],pgs,{bookingStatus:'booked-user-reported'}),
 make('asr-hrg','2027-08-20','已购PC2733＋PC620 · ASR → SAW → HRG T1',1100,1250,['PC2733 ASR09:05→SAW10:30；PC620 SAW21:50→HRG次日00:30，已由本人购妥。','按此前所选20kg托运＋8kg手提规划，最终以客票为准；交包核HRG行李牌与后段登机牌。','11小时20分中转，Kadıköy/Moda半日仍按航班与行李条件执行；17点返程、目标18:30回SAW。','停止追价；以下金额只保留原采购比较目标，不是成交价。'],'https://www.flypgs.com/en/help-center',{bookingStatus:'booked-user-reported'}),
 make('asw-cai','2027-08-28','阿斯旺ASW → 开罗CAI（夜车替代，可不买）',700,1000,['夜巴仍为主线，飞机是可选分支。','比较含所需行李、接驳及额外住宿的完整成本，不计四段主链。'],'https://www.egyptair.com/en/Pages/HomePage.aspx',{optional:true})
 ],totalTargets:{goodBuySumCny:4050,considerUpperSumCny:4700,status:'四段历史比较目标，三段已购；不等于实付或剩余待付',unbookedRouteIds:['tas-bak'],unbookedGoodBuySumCny:1100,unbookedUpperSumCny:1300}};
 const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const tableHTML=()=>'<div class="fare-targets-grid">'+data.routes.map(r=>{const booked=r.bookingStatus==='booked-user-reported';return '<article class="fare-card"><p class="fare-date">'+E(r.date)+'</p><h4>'+E(r.label)+'</h4>'+(booked?'<p>已购 · 实付与订单仅存本机私密区</p>':'')+'<div class="fare-metrics"><div><small>'+(booked?'原比较目标':'好价不高于')+'</small><strong>¥'+r.goodBuyCny+'</strong></div><div><small>'+(booked?'原比较上沿':'可以考虑至')+'</small><strong>¥'+r.considerUpToCny+'</strong></div></div><ul>'+r.conditions.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>'+r.sources.map(s=>'<a href="'+E(s.url)+'" target="_blank" rel="noopener noreferrer">'+E(s.title)+' ↗</a>').join(' · ')+'</article>';}).join('')+'</div>';
 const html='<h2>机票已购状态与剩余价线</h2><p>'+E(scope)+'</p><p>EVN→BEG、SJJ→SAW、ASR→SAW→HRG三段已由本人购妥；主链只剩7/24 TAS→GYD待购，参考目标1100–1300元。四段4050/4700元只保留为历史比较目标，不是实付或剩余待付。9/2与9/6阿航两段继续按已购时刻。</p>'+tableHTML()+'<a href="./fare-reference.md">下载购票参考</a><button class="soft-button" data-guide="flight-watch">本机航班与订单记录</button>';
 const old=D.guides.find(x=>x.id==='fare-targets');if(old)Object.assign(old,{title:'已购航班与剩余价线',html});else D.guides.push({id:'fare-targets',title:'已购航班与剩余价线',subtitle:'三段已购；主链仅TAS待购',html});
 D.fareTargets=data;window.TripFareTargets={data,tableHTML};
})();
