(()=>{
  const D=window.TRIP_DATA;
  const groups=[
    {title:'出发前30–60天：把资格和大交通定下来',items:[['passport-valid','检查护照有效期、空白页；备用证件照和电子扫描件只存私密区'],['student-proof','实体ISIC、国内学生证和英文在读证明姓名拼音与护照一致'],['rail-student','杭州—新疆铁路学生优惠区间已核验（本人已确认）'],['return-air','先观察并确认最迟9月5日到杭州的完整返程，预留入境和返校时间'],['border-legs','逐项核阿拉木图国际卧铺、巴库夜车、贝城赴埃及及国际巴士实际运营日'],['hostel-criteria','选青旅先看安全清洁、储物柜、交通与洗衣；埃及房内空调，阿联酋单独入住年龄按具体旅馆']]},
    {title:'出发前2–4周：签证、保险和钱',items:[['egypt-evisa','在埃及官方门户预办旅游电子签，核HRG口岸与实际入境材料'],['insurance-full','在出境前选覆盖全程/全部目的地的旅行险，核英文证明、格方要求及浮潜条款'],['cards-money','准备可海外支付的实体卡、备用支付渠道和少量现金，开通境外交易并设合理限额'],['backpack-trial','背包实装称重和试背；按所选票种核自带随身包尺寸、重量与件数，只有实际超限才另查加购；不默认购买托运或8kg'],['phone-data','确认手机可用当地SIM/eSIM；计划、翻译、导航软件和必要号码先下载']]},
    {title:'出发前7天：完成离线和手机演练',items:[['offline-save','下载完整离线行程；断网重开到D57并检查地图示意和私密票夹'],['vault-prepare','设置私密区口令，把真实酒店、订单号及机票原件存入加密区；另存密文备份'],['wash-pack','按一周轮换带衣服，轻薄保暖层/防风雨外套、泳衣、拖鞋、洗衣用品和小锁'],['power-gear','检查充电器、线、充电宝规格和目的地插头转换；保留备用充电线'],['medication','个人常用药保留原包装；处方和携带规则按药品及目的地核实，不把未核药品当通用可带']]},
    {title:'前一晚与出门当天：拿得到、走得动',items:[['files-offline','再次核车站/机场全名、出发时刻、行李、护照与签证，票据不要只留网络链接'],['backups-offline','加密备份另存设备或自己控制的安全位置；普通导出不含私密票据'],['train-supplies','杭州长途卧铺提前买饮水和耐放简餐；贵重品小包随身、主包能上锁'],['morning-list','每天出门检查护照/卡/少量现金、手机电量、相机、饮水、防晒与外套；主包寄存上锁']]},
  ];
  const all=groups.flatMap(g=>g.items);
  for(const [key,label] of all){const id='prep-'+key;if(!D.bookings.some(b=>b.id===id))D.bookings.push({id,label,done:key==='rail-student'});}
  D.guides.unshift({id:'preparation',title:'出发前准备清单',subtitle:'分阶段准备、每日出门复点',html:'<h2>出发前，把准备分阶段做好</h2><p>这份清单可在本机勾选，勾选不代表代办、购票或投保。真实订单与证件放私密区，别写进公开计划。</p><div data-preparation></div>'});
  D.guides.unshift({id:'private',title:'私密资料与票夹保护',subtitle:'口令加密、酒店与已订机票',html:'<h2>公开计划和私人订单分开</h2><p>公开站点只包含建议路线。这里的真实酒店、已订航班和附件只在本机口令加密保存，不会写进公开源码或上传到公开站点。口令不会上传，也没有找回服务，请保管密文备份。</p><section data-private-vault></section>'});
  D.guides.push({id:'connection',title:'国外流量与离线入口',subtitle:'公网入口、当地SIM与断网备用',html:'<h2>用当地流量打开</h2><p>独立公网版无需登录ChatGPT、电脑无需开机。它与chatgpt.site属于不同入口，本机记录不会自动互通；如需换入口，先在旧入口导出备份，私密数据只导出密文。</p><ol><li>在手机浏览器地址栏直接打开新入口，先看日期与版本；微信/QQ中打不开时，改用系统浏览器。</li><li>使用当地SIM/eSIM后，先实际打开计划、地图导航和一条官网，确认数据可完整回传。</li><li>联网缓存后，再开飞行模式测试行程和已存票据。地图街道底图、导航与实时官网仍需网络。</li><li>下载独立HTML作为不经过任何域名的备用。设备不支持加密时，仍能读公开计划，但不要把敏感附件导入不受保护的替代工具。</li></ol><p>新入口只证明本轮访问测试成功，不保证所有国家/运营商永远可达；离线版是旅途中的第二入口。</p>'});
  const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mountAll(scope=document,ctx={}){for(const el of scope.querySelectorAll('[data-preparation]')){el.innerHTML=groups.map(g=>'<section class="preparation-group"><h3>'+E(g.title)+'</h3>'+g.items.map(([key,label])=>{const id='prep-'+key,b=D.bookings.find(x=>x.id===id),done=Object.hasOwn(ctx.state?.bookings||{},id)?ctx.state.bookings[id]:b.done;return '<div class="todo-row '+(done?'done':'')+'"><label><input type="checkbox" data-booking="'+id+'" '+(done?'checked':'')+'><span>'+E(label)+'</span></label></div>';}).join('')+'</section>').join('');}}
  window.TripPreparation={mountAll,groups};
})();
