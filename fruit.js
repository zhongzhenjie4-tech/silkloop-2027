(()=>{
  'use strict';
  const D=window.TRIP_DATA,F=window.TripFood,checked='2026/11/04 · 方向建议，2027现场核';
  const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const choices={
    china:['苹果、香蕉或柑橘等易携带整果','列车两天分次吃；洗净/剥皮后食用，不把切果闷在包里。'],
    kazakhstan:['市场或超市整果：苹果、杏、桃等看现场品相','只买当天小份；峡谷日用不易压坏的整果作补给。'],
    uzbekistan:['瓜、葡萄、桃杏等只作现场选择方向','瓜很大可在有清洁条件的住宿分食；不默认街边切瓜冷链可靠。'],
    azerbaijan:['超市整果：苹果、桃、葡萄等','夜车前买少量耐放整果；避免带整盒切果过夜。'],
    georgia:['超市/市场整果：桃、苹果、葡萄等','一日团前晚采购，出门前洗净；不把“当地水果”当可直接不洗。'],
    armenia:['杏、桃、苹果或葡萄等看供应','路边摊也先看洁净度与保存方式，先问按公斤还是按份计价。'],
    turkey:['超市/市场整果：桃、葡萄、香蕉等','海边日和夜巴日买少量，不将鲜榨果汁当作饮用水替代。'],
    bosnia:['苹果、桃、葡萄等易取得整果','长途往返日带一份，别为特定水果跨区采购。'],
    serbia:['超市整果：苹果、香蕉、桃等','保留预算买蔬菜；水果可补充，不能取代正餐与蛋白质。'],
    egypt:['可自行剥皮的香蕉、橙等优先看现场','热天避开久置切果、不明用水和保存条件不明的果汁；封口水单独补足。'],
    uae:['超市香蕉、柑橘、苹果或小份椰枣','冷气超市采购后及时回住宿；切果、酸奶需可靠冷藏，跨城不背着暴晒。']
  };
  const shops={},fruits=Object.entries(choices).map(([id,v])=>[id,...v]),plans={};
  function info(day){const region=F.region(day);return {region,choice:choices[region.id]||choices.china};}
  function card(day){
    const {region,choice}=info(day),query=(day.city||region.name)+' supermarket fruit';
    return '<article class="fruit-card"><span class="food-tag">水果补给方向 · 未核商家与当季库存</span><h4>'+E(day.city||region.name)+'</h4><p>'+E(choice[0])+'</p><p>'+E(choice[1])+'</p><p class="minor">导航只搜索附近超市/市场，不代表某店已营业或已完成卫生核验。价格按现场每公斤/每件单位确认，水果与饮水记入当天餐饮实际支出。</p><a class="soft-button" href="'+E(F.nav(query))+'" target="_blank" rel="noopener noreferrer">搜索顺路水果补给 ↗</a></article>';
  }
  function overview(day){return '<details class="food-overview fruit-overview"><summary>水果与饮水 · 少量、顺路、可清洁</summary>'+card(day)+'<button data-guide="fruit">查看水果与食物卫生手册</button></details>';}
  for(const day of D.days||[]){
    const target=(day.rows||[]).find(r=>/采购|补给|早餐|午餐/.test(r.title||''))||(day.rows||[])[0];
    if(target)plans[target.id]={dayId:day.id,title:'当日水果与饮水补给'};
  }
  function details(id){const p=plans[id],day=p&&(D.days||[]).find(d=>d.id===p.dayId);return day?'<section class="meal-block fruit-block" aria-label="水果补给">'+card(day)+'</section>':'';}
  function guide(){return '<h2>水果、饮水与食物卫生</h2><p>本页是各地区的补给方向，不是当季库存、摊位或实时卫生评价。优先顺路超市和能确认清洁方式的市场；小份、当天吃完，避免背重与热天变质。整果通常更易自己清洗/剥皮。</p><ul><li>先问计价单位和总价；把水果、饮料、封口饮用水都计入餐饮。按实际天气补水，不用果汁替代饮水。</li><li>购买前看果皮是否破损、切果是否可靠冷藏、器具与手是否洁净；没有可靠清洁/冷藏条件就改完整可剥皮水果。</li><li>跨境前吃完或按边境规定处置鲜果与食品，不假定所有水果可带入下一国；实物入境规定行前再核。</li><li>有厨房先洗手和台面，生熟分开；熟食及时吃，冷藏要求不明就少买。途中不带需冷藏的隔夜熟肉、奶制品和切果。</li></ul>'+Object.entries(choices).map(([id,c])=>'<h3>'+E(({china:'中国途中',kazakhstan:'哈萨克斯坦',uzbekistan:'乌兹别克斯坦',azerbaijan:'阿塞拜疆',georgia:'格鲁吉亚',armenia:'亚美尼亚',turkey:'土耳其',bosnia:'波黑',serbia:'塞尔维亚',egypt:'埃及',uae:'阿联酋'})[id])+'</h3><p>'+E(c[0])+'。'+E(c[1])+'</p>').join('')+'<p class="food-source-note">未新增商家、POI、评分或餐费总额；所有建议以当地供应、卫生条件与口岸规定为准。</p>';}
  const foodOverview=F.overview,foodDetails=F.details,foodSummary=F.summary;
  F.overview=day=>foodOverview(day)+overview(day);
  F.details=id=>foodDetails(id)+details(id);
  F.summary=id=>foodSummary(id);
  D.guides.push({id:'fruit',title:'水果补给与食物卫生',html:guide()});
  window.TripFruit={shops,fruits,plans,guide,details,overview,checked};
})();

