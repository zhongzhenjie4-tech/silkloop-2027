(()=>{
  'use strict';
  const D=window.TRIP_DATA,F=window.TripFood,checked='2026/11/04 · 具体厕位待现场';
  const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const places={
    hub:{name:'交通枢纽与上车前',where:'机场、铁路站、长途汽车站内先按Toilet / WC / Restroom标识或问工作人员；安检前后区域不能逆行。',when:'值机/检票准备完成后、上长途交通前按需要使用；不要拖到最后检票。',cost:'可能收费，少量当地硬币与零钞随身；具体收费、供纸和开放区域待现场。',boundary:'本次未核某一站具体厕位、开放时间或卫生。大巴不默认有厕所，夜车/火车也要确认实际车辆设施。'},
    museum:{name:'博物馆、景区与正规服务区',where:'进馆后先看设施图或问服务台最近厕所；长段户外游览前先解决。',when:'用原有参观/休息时间，不为找厕所另跨城区或错过预约。',cost:'可能在检票后区域；需要门票时不假设可免费进馆借用，也不为找厕所临时买昂贵项目。',boundary:'有建筑不等于随时开放；闭馆、维修与节庆时间待现场。未核具体门号和可用性。'},
    hostel:{name:'住宿与餐饮点的顺路设施',where:'离开青旅前、回住宿午休时使用；就餐点先询问顾客厕所，不随意闯入员工区。',when:'长途、船游、清晨活动前先安排；外出日利用已在的室内空间。',cost:'住宿通常随入住使用；餐饮与商场厕所可能有消费/收费条件，先问。',boundary:'纸品、清洁与开放以现场为准，不因评分或收费就承诺干净。'},
    boat:{name:'船游、峡谷与长段户外',where:'集合时先问船/车辆是否有可用厕所、上船前最近岸上厕所和途中停靠。',when:'出发前按需使用，背包里留纸巾；不为了找厕所离队或走到无安全保障的地方。',cost:'服务区/码头可能收费，金额未核。',boundary:'不把某一产品的设施套给全部船游或车辆；没有确认就按途中未必可用准备。'}
  };
  const plans={},daily={};
  const note='没有核查十国具体公厕、楼层、收费或实时卫生。地图仅搜索附近设施；先按建筑内标识、问工作人员和现场收费选择。纸巾、小包湿巾、洗手用品与当地零钱放随身包，不把背包放湿地面。';
  for(const day of D.days||[]){
    daily[day.id]=(day.city||day.label||'当天')+'：离开住宿前、长途上车前及进馆后顺路确认；具体点位待现场。';
    for(const row of day.rows||[]){
      const t=row.title||'',ids=[];
      if(/机场|航班|飞|车站|夜车|夜巴|铁路|列车|火车|大巴|动车|过境|跨境|卧铺/.test(t))ids.push('hub');
      if(/博物馆|神庙|宫|景区|城堡/.test(t))ids.push('museum');
      if(/船游|出海|浮潜|峡谷|徒步/.test(t))ids.push('boat');
      if(ids.length)plans[row.id]={title:'出发/入场前确认厕所',ids:[...new Set(ids)].slice(0,2),note:'利用原有候车、集合或入馆时段，不改变当日交通。'};
    }
  }
  function card(id){const s=places[id];return '<article class="toilet-card"><span class="toilet-basis">设施方向 · 具体点位待现场</span><h4>'+E(s.name)+'</h4><dl><dt>怎么找</dt><dd>'+E(s.where)+'</dd><dt>什么时候</dt><dd>'+E(s.when)+'</dd><dt>费用</dt><dd>'+E(s.cost)+'</dd><dt>边界</dt><dd>'+E(s.boundary)+'</dd></dl></article>';}
  function details(id){const p=plans[id];return p?'<section class="meal-block toilet-block" aria-label="厕所准备"><h3>'+E(p.title)+'</h3><p>'+E(p.note)+'</p>'+p.ids.map(card).join('')+'</section>':'';}
  function overview(day){const region=F.region(day);return '<details class="food-overview toilet-overview"><summary>厕所准备 · 枢纽、入馆前与零钱</summary><p>'+E(daily[day.id]||note)+'</p><p>'+E(note)+'</p><div class="food-links"><a class="soft-button" href="'+E(F.nav((day.city||region.name)+' public toilet WC'))+'" target="_blank" rel="noopener noreferrer">搜索附近厕所方向 ↗</a><button data-guide="toilets">打开厕所随身手册</button></div></details>';}
  function guide(){return '<h2>厕所准备与顺路使用</h2><p>'+E(note)+'</p><p>优先使用已在的机场、车站、博物馆或住宿设施；开阔景区和夜间老城不要等到急需时才开始找。允许时先确认纸品、洗手水与门锁，少量零钱单独放，不依赖扫码或刷卡。收费不等于卫生保证。</p>'+Object.keys(places).map(card).join('')+'<h3>长途交通的实际边界</h3><p>上车前问司机/列车员厕所和途中休息；不能假定大巴有厕所或每隔固定小时必停车。夜车若临时停用，及时询问工作人员。船游和浮潜必须看所选具体产品的设施说明，未确认时只把岸上出发前设施作为准备方向。</p><h3>可识别的标志</h3><p>WC、Toilet、Restroom、Toilets是常见标志；不确定就向服务台展示“toilet”文字或图标。公共设施可能收费，硬币、纸巾和湿巾不代表所有场所都需要，按现场选择。</p><p class="food-source-note">未添加旧新马厕位、Google评分或虚构设施导航点。此手册不改变原有交通、预约和返校时间。</p>';}
  const previous={overview:F.overview,details:F.details,summary:F.summary};
  F.overview=day=>previous.overview(day)+overview(day);
  F.details=id=>previous.details(id)+details(id);
  F.summary=id=>previous.summary(id);
  D.guides.push({id:'toilets',title:'厕所方向与零钱纸巾',html:guide()});
  window.TripToilets={places,plans,daily,checked,note,card,details,overview,guide};
})();

