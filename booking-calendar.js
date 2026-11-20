(()=>{
 'use strict';const data=window.TRIP_BOOKING_DATA,D=window.TRIP_DATA;if(!data||!D)return;
 const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const A=(s,u)=>'<a class="soft-button" href="'+E(u)+'" target="_blank" rel="noopener noreferrer">'+E(s)+' ↗</a>';
 const range=p=>'¥'+p.join('–');
 const list=a=>'<ul>'+a.map(s=>'<li>'+E(s)+'</li>').join('')+'</ul>';
 const stayNights=()=>data.hotels.reduce((total,h)=>total+h.periods.reduce((n,p)=>n+p.nights,0),0);
 const stayCities=()=>new Set(data.hotels.map(h=>h.city)).size;
 function syncStays(){
  if(!D.accommodations?.length)return;
  const checkout=date=>{
   const next=new Date(date+'T12:00:00Z');
   next.setUTCDate(next.getUTCDate()+1);
   return next.toISOString().slice(0,10);
  };
  data.hotels=D.accommodations.map(stay=>{
   const periods=[];
   for(const n of [...stay.dayNumbers].sort((a,b)=>a-b)){
    const date=D.days[n-1].date, previous=periods.at(-1);
    if(previous?.checkOut===date){
     previous.checkOut=checkout(date);
     previous.nights++;
    }else periods.push({checkIn:date,checkOut:checkout(date),nights:1});
   }
   return {id:stay.id,city:stay.label,name:stay.primary.name,url:stay.primary.url,
    planCny:stay.primary.planBedCny,periods,previousCny:stay.previousPrimary?.planBedCny||stay.primary.planBedCny};
  }).filter(h=>h.periods.length>0);
  data.paidNights=stayNights();
  data.totalStayTargetCny=[0,1].map(i=>data.hotels.reduce((sum,h)=>
   sum+h.planCny[i]*h.periods.reduce((n,p)=>n+p.nights,0),0));
 }
 function flightTable(){return '<div class="booking-table-wrap"><table><thead><tr><th>当地出发日</th><th>公开计划航段</th><th>衔接与落实顺序</th></tr></thead><tbody>'+data.calendar.routes.map(r=>'<tr><td>'+E(r.date)+'<br>D'+r.day+'</td><td>'+E(r.label)+'</td><td>'+E(r.priority)+'</td></tr>').join('')+'</tbody></table></div>';}
 function returnHTML(day){if(!['day54','day55','day56','day57','day58'].includes(day.id))return '';return '<details class="stay-overview booking-return"><summary><span class="stay-summary-title">返杭衔接 · 9/6 EK310 04:35→17:05</span><small>9/2–9/4三晚床位；9/5晚取包赴T3</small></summary><p>9/2 EK928 13:10开罗CAI T2→17:30迪拜DXB T3；9/6 EK310 04:35迪拜DXB T3→17:05杭州HGH T4。航站楼和航变按本人客票。</p><p>9/5早上退房寄包，约21:30取包，约22:00进红线，目标22:45前抵T3。核实际进站点的机场方向末班，必要时打车。抵杭乘19号线至创景路换5号线，再步行到校。9/7开学。寄存、退房后淋浴按选定青旅确认。</p>'+A('阿航正式时刻入口','https://www.emirates.com/english/book/flight-schedules/')+'<button class="soft-button" data-guide="booking-calendar">查看三晚床位与机场衔接</button></details>';}
 function guideHTML(){const c=data.calendar;return '<h2>预订时间线 · 机票与经济床位</h2><p>核查 '+E(data.checked)+'。'+D.days.length+'天主线、'+stayCities()+'个住宿城市、'+stayNights()+'个付费夜。按完整航段、床型和含税总价比较；月份是执行建议，不是最低价预测。</p><a class="soft-button" href="./booking-reference.md" download="经济住宿与预订时间表.md">下载完整日期与核查记录</a><h3>当前回程与返校衔接</h3><p><strong>9/6 17:05到杭州，9/7开学。</strong>公开计划按9/2 EK928 13:10→17:30、9/6 EK310 04:35→17:05排；私人订单状态不从公开网页推定，解锁本机私密区后查看或更新。</p>'+data.dubai.branches.map(b=>'<details class="booking-section"><summary>'+E(b.label)+(b.default?' · 当前主线':'')+'</summary><ol>'+b.sequence.map(x=>'<li>'+E(x)+'</li>').join('')+'</ol>'+list(b.conditions)+'</details>').join('')+'<p>主线连住9/2、9/3、9/4三晚，9/5退房存包、晚上取包去机场。寄存、退房后淋浴与可退押金按具体青旅规则，未确认前不计成免费服务。</p><h3>具体关注哪些机票</h3>'+flightTable()+c.routes.map(r=>'<details class="booking-section"><summary>'+E(r.date)+' · '+E(r.label)+'</summary><p><b>从何时看：</b>'+E(r.startWatching)+'</p><p><b>建议落实：</b>'+E(r.recommendedDecision)+'</p><p><b>前后查：</b>'+E(r.flexibility)+'</p>'+list(r.checks)+A('官方查看',r.url)+(r.compareUrls||[]).map(u=>A('对照入口',u)).join('')+'</details>').join('')+'<h3>从现在到出发怎么安排</h3>'+c.phases.map(p=>'<section class="booking-phase"><h4>'+E(p.window)+' · '+E(p.title)+'</h4>'+list(p.actions)+'</section>').join('')+'<h3>经济住宿 · 具体入住退房日</h3><p>按下表合计'+stayNights()+'个付费夜，询价目标合计 <b>'+range(data.totalStayTargetCny)+'</b>。目标区间不是2027含税已订报价，实际支付和订单只存本机私密区。</p><p>单人优先宿舍床位，超过¥150先比较同区；Kaş的海岸旺季床位保留条件目标，储物、清洁和空调需合适。迪拜优先混合宿舍/男性床位，查询是否另收押金；三晚连住减少搬家。</p><div class="booking-table-wrap"><table><thead><tr><th>城市/床位候选</th><th>入住→退房</th><th>晚数</th><th>每晚目标</th></tr></thead><tbody>'+data.hotels.map(h=>'<tr><td>'+E(h.city)+'<br>'+E(h.name)+'</td><td>'+h.periods.map(p=>E(p.checkIn)+' → '+E(p.checkOut)).join('<br>')+'</td><td>'+h.periods.reduce((n,p)=>n+p.nights,0)+'</td><td>'+range(h.planCny)+'</td></tr>').join('')+'</tbody></table></div><button class="soft-button" data-guide="stays">每家床型、地址、地图与来源</button><h3>酒店什么时候订</h3><p>'+E(c.hotelStrategy.principle)+'</p>'+list(c.hotelStrategy.priorityCities.map(h=>h.city+' '+h.checkIn+'→'+h.checkOut+'：'+h.action))+'<p>'+E(c.hotelStrategy.rolling)+'</p><p>'+E(c.hotelStrategy.beforeNonRefundable)+'</p><h3>杭州—新疆铁路</h3><p>'+E(c.rail.ordinarySaleDate)+'；'+E(c.rail.secondaryRail)+'</p><p>'+E(c.rail.studentReservationWindow)+'</p><p>'+E(c.rail.discountCorrection)+'</p>'+list(c.rail.checks)+'<h3>航空学生价怎么比</h3><p>'+E(c.studentFares.emirates)+'</p><p>'+E(c.studentFares.pegasus)+'</p><details class="booking-section"><summary>官方与经营来源</summary>'+[...c.sources,...data.dubai.sources].map(s=>'<p>'+A(s.title,s.url)+'</p>').join('')+'</details>';}
 const flightGuide=D.guides.find(g=>g.id==='flight-watch');
 const flightGuideBase=flightGuide?.html;
 function refresh(){
  syncStays();
  const updated={id:'booking-calendar',title:'什么时候订 · 机票与经济住宿',
   subtitle:D.days.length+'天、'+stayCities()+'个住宿城市、'+stayNights()+'晚与返杭衔接',html:guideHTML()};
  const previous=D.guides.find(g=>g.id===updated.id);
  if(previous)Object.assign(previous,updated);
  else D.guides.push(updated);
  if(flightGuideBase)flightGuide.html=flightGuideBase.replace('<div data-flight-watch>',
   '<h3>公开航班与购票进度</h3>'+flightTable()+'<button class="soft-button" data-guide="booking-calendar">关注频率、下单时点与机场衔接</button><div data-flight-watch>');
 }
 window.TripBooking={data,flightTable,returnHTML,refresh};D.bookingCalendar=data;
 refresh();
})();
