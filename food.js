(()=>{
  'use strict';
  const D=window.TRIP_DATA;
  const checked='2026/11/04 · 2027出发前待重核';
  const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nav=q=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
  const A=(label,url)=>'<a href="'+E(url)+'" target="_blank" rel="noopener noreferrer">'+E(label)+'</a>';
  const regions={
    china:{name:'中国途中',match:/中国|杭州|乌鲁木齐|伊宁|国内/,budget:'¥35–60／日',meals:['早餐：鸡蛋、馒头或面包，出发前吃好。','午餐：车站周边能及时出餐的面、米饭套餐。','晚餐：正餐一份；长途车上用耐放主食、独立包装蛋白质与水果。'],order:'按一人份点主食，先问总价；车上不依赖每站都能补给。',kitchen:'列车日提前买够饮水、面包、坚果与一顿耐放简餐；不要靠方便面撑过两天。',query:'supermarket'},
    kazakhstan:{name:'哈萨克斯坦',match:/哈萨克|阿拉木图|Almaty/i,budget:'¥45–65／日',meals:['早餐：面包、熟鸡蛋、酸奶或粥。','午餐：食堂式套餐、汤面或抓饭，一人份即可。','晚餐：拉条子、汤或米饭配蔬菜，避免一天三餐都只吃肉。'],order:'尝 lagman（拉条子）或 plov（抓饭）；先问份量、是否含配菜。',kitchen:'顺路超市补面包、原味酸奶与水果；厨房允许时煮蛋或意面。',query:'canteen lagman'},
    uzbekistan:{name:'乌兹别克斯坦',match:/乌兹|塔什干|布哈拉|撒马尔罕|Tashkent|Bukhara|Samarkand/i,budget:'¥35–60／日',meals:['早餐：馕、熟蛋、酸奶；住宿含早则用含早。','午餐：plov 抓饭或汤面；沙拉需确认清洗与保存条件。','晚餐：samsa 烤包子配热汤，或青旅厨房做简单热食。'],order:'抓饭先点一小份，烤串按串计价先问清；饮料与服务费另看菜单。',kitchen:'买当天能吃完的馕和小份水果；跨城前补封口饮水。',query:'plov local food'},
    azerbaijan:{name:'阿塞拜疆',match:/阿塞拜疆|巴库|Baku/i,budget:'¥45–70／日',meals:['早餐：面包、奶酪或蛋，配无糖茶。','午餐：qutab 馅饼、热汤或一人份米饭。','晚餐：家常炖菜配主食；夜车前吃好再上车。'],order:'qutab 可先点少量，确认馅料；茶壶、面包和桌上小菜先问是否另收费。',kitchen:'海滨游客区只作散步；顺路超市采购早餐与夜车简餐。',query:'qutab local restaurant'},
    georgia:{name:'格鲁吉亚',match:/格鲁吉亚|第比利斯|卡兹别克|Tbilisi|Kazbegi/i,budget:'¥40–65／日',meals:['早餐：面包、熟蛋、酸奶或住宿早餐。','午餐：khinkali 汤包配蔬菜，小份起点。','晚餐：豆子炖菜 lobio、热汤或厨房热食。'],order:'汤包可能有最低起点数量，先问；khachapuri 奶酪饼一份可能很大，不必叠加多份主食。',kitchen:'夜车到达日先补水休息，超市采购后再安排观光。',query:'khinkali lobio'},
    armenia:{name:'亚美尼亚',match:/亚美尼亚|埃里温|Yerevan|Garni/i,budget:'¥40–65／日',meals:['早餐：lavash 薄饼、熟蛋、酸奶。','午餐：一人份烤肉或烤蔬菜配主食。','晚餐：热汤、dolma 葡萄叶包饭或厨房简餐。'],order:'烤肉有时按重量点单，先确认一人份与克数；饮用水按瓶计价。',kitchen:'一日团前晚买便携早餐，确认团费是否含午餐。',query:'Armenian local food'},
    turkey:{name:'土耳其',match:/土耳其|格雷梅|卡帕|安塔利亚|Kaş|卡什|费特希耶|伊斯坦布尔|Istanbul|Antalya|Göreme|Fethiye/i,budget:'¥55–85／日',meals:['早餐：面包店 simit 芝麻圈、蛋、酸奶，或住宿含早。','午餐：lokanta 家常菜食堂，点一荤一菜或汤配饭。','晚餐：一人份 döner 卷饼、汤或青旅厨房。'],order:'先看有标价的菜单，问清堂食/打包、饮料与桌上小菜；船游午餐只有订单明确包含才算已含。',kitchen:'海边与景点区留餐费余量；夜巴前在车站附近解决正餐，车上备小食。',query:'lokanta affordable food'},
    bosnia:{name:'波黑',match:/波黑|萨拉热窝|莫斯塔尔|Sarajevo|Mostar/i,budget:'¥45–70／日',meals:['早餐：面包店 burek 肉馅饼或奶酪馅饼。','午餐：ćevapi 烤肉条小份，配水和蔬菜。','晚餐：热汤、家常菜或青旅厨房意面。'],order:'馅饼可能按重量售卖，先确认价格单位；烤肉条按份量数量点。',kitchen:'莫斯塔尔往返日自带饮水和便携午餐备选，不为找网红店错过回程。',query:'burek cevapi'},
    serbia:{name:'塞尔维亚',match:/塞尔维亚|贝尔格莱德|泽蒙|Belgrade|Zemun/i,budget:'¥50–75／日',meals:['早餐：pekara 面包店、熟蛋或酸奶。','午餐：家常菜、汤或小份 pljeskavica 肉饼。','晚餐：超市采购后厨房做意面、蛋和蔬菜。'],order:'肉饼先问重量与配料，避免默认最大份；有标价菜单再坐下。',kitchen:'飞埃及前一晚补耐放早餐，确认早班机所需提前出发时间。',query:'pekara affordable food'},
    egypt:{name:'埃及',match:/埃及|赫尔格达|卢克索|阿斯旺|开罗|吉萨|Hurghada|Luxor|Aswan|Cairo|Giza/i,budget:'¥35–60／日',meals:['早餐：热食 ful 蚕豆、熟蛋、面包。','午餐：koshari 豆米面或现做主食，避开久置凉菜。','晚餐：熟透烤鸡或炖菜配饭；超市补封口饮用水。'],order:'先问一人份、饮料及服务费的最终总价；景区周边先看菜单，不先坐下后议价。',kitchen:'热天随身带水但少量多次采购；浮潜/拼团含餐与水必须看订单，不自动扣掉一餐。',query:'koshari affordable restaurant'},
    uae:{name:'阿联酋',match:/阿联酋|迪拜|阿布扎比|沙迦|Dubai|Abu Dhabi|Sharjah/i,budget:'¥65–100／日',meals:['早餐：超市面包、熟蛋、酸奶，利用室内空间避暑。','午餐：顺路印巴简餐套餐，先看是否含水。','晚餐：沙威玛或米饭套餐，配蔬菜与封口饮用水。'],order:'shawarma 一份或一人套餐；购物中心内先看含税总价，不假定食品街都便宜。',kitchen:'优先选允许做饭且有冰箱的住宿；小份采购，跨城日备冷链要求低的小食。',query:'Pakistani Indian affordable restaurant'}
  };
  const shops={},plans={};
  const sourceNote='餐饮方向与导航搜索，不是已核验餐店清单。未查询2027分店、营业、菜单或Google评分；本页每日人民币区间是分日规划留量，不是报价，也不自动相加为原稿3340元餐费。现场菜单、饮水与税费另核。';
  function region(day){
    const candidates=[day.country,day.city,[day.label,day.note].filter(Boolean).join(' ')];
    for(const text of candidates){if(!text)continue;for(const [id,r] of Object.entries(regions))if(r.match.test(String(text)))return {id,...r};}
    return {id:'china',...regions.china};
  }
  function dayFor(value){return typeof value==='object'&&value?value:(D.days||[]).find(d=>d.id===value||d.rows?.some(r=>r.id===value));}
  function search(day,kind){
    const r=region(day),city=day.city||day.label||r.name;
    const q=city+' '+(kind==='supermarket'?'supermarket grocery':r.query);
    return '<a class="soft-button" href="'+E(nav(q))+'" target="_blank" rel="noopener noreferrer">'+(kind==='supermarket'?'搜索顺路超市':'搜索当地餐饮方向')+' ↗</a>';
  }
  function mealHTML(day){
    const r=region(day);
    return '<article class="food-card"><div class="food-card-top"><div><span class="food-tag">方向建议 · 未来未核</span><h4>'+E(day.city||r.name)+' · 三餐与饮水</h4></div></div><p class="food-budget">'+E(r.budget)+' · 规划留量</p><ul>'+r.meals.map(s=>'<li>'+E(s)+'</li>').join('')+'</ul><dl><dt>点单</dt><dd>'+E(r.order)+'</dd><dt>省钱补给</dt><dd>'+E(r.kitchen)+'</dd><dt>排队放弃线</dt><dd>只选当天路线附近一家；预计等位＋出餐超过15–20分钟就改附近现成热食、超市或青旅厨房。赶车前缩短到能留足交通与检票余量，不另排第二家长队。</dd><dt>费用性质</dt><dd>现场自付；住宿含早、船游/团餐仅在订单明确列出时记为已含。水、零食与饮料计入餐饮实际记录，避免漏记或重复记账。</dd></dl><div class="food-links">'+search(day)+' '+search(day,'supermarket')+'</div></article>';
  }
  function attach(data){
    for(const key of Object.keys(plans))delete plans[key];
    for(const day of data.days||[]){
      const mealRows=(day.rows||[]).filter(row=>/早餐|午餐|晚餐|正餐|简餐|备餐|采购|补给/.test(row.title||''));
      const targets=mealRows.length?mealRows:(day.rows||[]).slice(0,1);
      for(const row of targets)plans[row.id]={dayId:day.id,label:'随行餐饮',summary:region(day).budget+' · 三餐方向与15–20分钟备选',note:sourceNote,ids:[]};
    }
    data.foodVersion=checked;
  }
  function summary(id){return plans[id]?'<p class="meal-hint">'+E(plans[id].summary)+'</p>':'';}
  function details(id){const day=dayFor(id);return plans[id]&&day?'<section class="meal-block" aria-label="随行餐饮"><h3>这天怎么吃</h3>'+mealHTML(day)+'<p class="food-source-note">'+E(sourceNote)+'</p></section>':'';}
  function overview(day){
    return '<details class="food-overview"><summary>今天吃什么 · 三餐、饮水与备选</summary>'+mealHTML(day)+'<p class="food-source-note">'+E(sourceNote)+'</p><button data-guide="food">打开十国餐饮与厨房手册</button></details>';
  }
  const budgetRows=[['首段及主要航空',7071,'包含国内入境首段及国际航空草案；2027指定日期、行李、机场、税费与支付价未落实。'],['城际及接驳',2700,'埃及尾段与阿联酋机场、跨城、市内交通需分别展开，150元不保证够。'],['住宿',3860,'48付费夜为条件性算术；夜车改白天飞机、早入住或返程夜改变都要补算。'],['餐饮与饮水',3340,'沿用原稿草案，分日留量不自动对应此数；自付团餐与饮用水需记账。'],['门票及团',3050,'学生资格、出海、交通、保护区费等逐项核；阿联酋新增票项不可仅靠原预留文字覆盖。'],['签证/保险/ISIC/通讯/公交洗衣',1150,'180元保险只是预留，尚无产品/承保证明；洗衣次数与实际收费待核。'],['应急款',579,'应急款已计入21750；不可再次把它当额外可花预算，削减应急款不等于成本下降。']];
  const sources=[
    ['阿联酋免签2025公告','https://ae.china-embassy.gov.cn/lsyw/zytz/202504/t20250414_11594207.htm'],
    ['乌兹别克免签2025公告','https://uz.china-embassy.gov.cn/lsfw/lstz/202505/t20250523_11631125.htm'],
    ['波黑免签协定说明','https://ba.china-embassy.gov.cn/qzfw/201805/t20180528_2317748.htm'],
    ['土耳其免签说明','https://tr.china-embassy.gov.cn/sgxw/202601/t20260112_11811289.htm'],
    ['埃及官方eVisa FAQ','https://visa2egypt.gov.eg/eVisa/FAQ'],
    ['埃及金字塔官方票务','https://egymonuments.com/details/Pyramids'],
    ['GEM官方票务','https://tickets.gem.eg/'],
    ['土耳其托普卡帕宫','https://www.millisaraylar.gov.tr/Lokasyon/2/Topkapi-Sarayi?culture=en'],
    ['土耳其多尔玛巴赫切宫','https://www.millisaraylar.gov.tr/Lokasyon/3/Dolmabahce-Sarayi?culture=en'],
    ['格鲁吉亚保险公告','https://australia.mfa.gov.ge/en/news/629860-information-on-the-mandatory-health-insurance-policy-for-all-tourists-entering-georgia'],
    ['格鲁吉亚保险法令','https://manage.matsne.gov.ge/ka/document/view/6728816'],
    ['Pegasus通用行李规则','https://www.flypgs.com/en/useful-info/info-about-flights/general-rules?embed=true'],
    ['乌航行李规则','https://www.uzairways.com/en/free-baggage-allowance-class-service'],
    ['AZAL手提行李','https://www.azal.az/en/information/baggage/hand'],
    ['Air Cairo行李规则','https://aircairo.com/en-eg/baggage-allowance/'],
    ['Air Arabia手提行李','https://www.airarabia.com/en/help/baggage-enquiries/hand-baggage_baggage-enquiries'],
    ['Kaş船游实际产品','https://kasyacht.com/kekova-boat-trip/'],
    ['巴库—第比利斯格铁公告','https://www.railway.ge/baqodan-tbilisshi-pirveli-matarebeli-chamovida/'],
    ['Air Arabia SPX→SHJ路线','https://flights.airarabia.com/en/flights-from-giza-to-sharjah'],
    ['Air Arabia SPX→AUH路线','https://flights.airarabia.com/en/flights-from-giza-to-abu-dhabi'],
    ['SPX机场位置','https://www.flydubai.com/en-us/destinations/airports/sphinx-international-airport/'],
    ['Wizz暂停阿布扎比本地运营公告','https://s204.q4cdn.com/169340705/files/doc_news/Strategic-realignment-and-focus-on-core-markets-2025.pdf'],
    ['阿布扎比卢浮宫购票','https://www.louvreabudhabi.ae/en/buy-ticket/admission'],
    ['谢赫扎耶德大清真寺FAQ','https://www.szgmc.gov.ae/en/worshippers/en-v-faqs'],
    ['阿联酋城际交通','https://admobility.gov.ae/en/inter-emirates-services'],
    ['AUH机场迪拜接驳','https://www.zayedinternationalairport.ae/en/parking-and-transport/transport/airport-shuttle-to-dubai'],
    ['阿联酋航空杭州航线公告','https://www.emirates.com/media-centre/emirates-to-deploy-the-airbus-a350-to-hangzhou/'],
    ['Etihad杭州计划开航公告','https://www.etihad.com/en-ph/news/etihad-airways-expands-china-network-strengthens-china-eastern-joint-venture-with-five-new-routes-and-28-additional-weekly-flights'],
    ['上海机场联络线官方说明','https://english.shanghai.gov.cn/en-Transportation/20241231/f66f14bbd4b549ab88e6f3aec375790c.html']
  ];
  function table(headers,rows){return '<div class="table-scroll"><table><thead><tr>'+headers.map(h=>'<th>'+E(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+E(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
  function budgetGuide(){
    return '<h2>预算草案与实际支出</h2><p><strong>原稿合计¥21,750，包含¥579应急款；算术正确，价格未落实，不能称封顶。</strong>用户原预算目标为1.5–2万元，2.2万元未被视为已批准上限。</p>'+table(['大类','人民币草案','性质与待核边界'],budgetRows.map(r=>[r[0],'¥'+r[1],r[2]]))+'<h3>必须先落实的三个大项</h3><ul><li>航空：埃及→阿联酋900元、阿联酋→杭州2000元是原稿假设。尚无2027同日期正向完整可购报价；应比较开罗返HGH、返PVG加回杭、正常转机、阿联酋停留四种相同终点方案。</li><li>住宿：阿联酋120元/晚床位、税费、押金和入住年龄均未取得确认；48夜也受夜车与返杭航班影响。</li><li>机场：SPX接驳、SHJ/AUH/DXB选址及跨城不能混为一笔；原稿阿联酋150元交通预留不保证覆盖机场、市内与往返阿布扎比。</li></ul><p>若其余假设不变、把应急款改回850元，总草案为22021元；改为1500元则22671元。这只是对照情景，绝非报价。下方允许编辑自己的规划并记录实际支出，保存在本机。</p><div data-trip-planning></div>';
  }
  function ticketsGuide(){
    return '<h2>票据、学生证与离线材料</h2><p>2027行程中21岁不等于所有景点都自动学生优惠。随身带护照、中国高校学生证和<strong>实体塑料ISIC</strong>；姓名、有效期与护照一致，手机截图只作备份。</p>'+table(['项目','本机2026-11-04复核基线','2027动作'],[
      ['托普卡帕宫','当前外籍实体ISIC学生500TL；按官方具体组合与12–25岁条件','出票前核有效证明、含后宫/圣伊琳娜范围与闭馆日'],
      ['多尔玛巴赫切宫','当前外籍实体ISIC学生300TL；12–25岁条件','不以国内学生证替代实体ISIC承诺获优待'],
      ['大埃及博物馆GEM','当前官方Other Nationality–Student总价920EGP；不是Expatriates学生价','2027购票页核身份、年龄与总价；尚未购票'],
      ['埃及古迹普通单票','金字塔当前24岁及以下＋有效学生证明；各点单核','不把Cairo/Luxor Pass的under30套用全部景点'],
      ['航空/铁路/夜巴/拼团','行程全为候选与草案，除本人导入凭证外不视为已买','核日期、当地时间、机场/站、承运方、行李、姓名与改退；保存PDF和确认号']
    ])+'<h3>离线票夹怎么用</h3><p>存入护照资料页、签证、英文保险、住宿及离境凭证、电子票、学生证明与紧急联系资料。保留原始PDF/图片及手机本地副本；网页票夹只是辅助，不承诺浏览器清理后仍在。不要在公开分享包中放证件、二维码、完整订单或联系方式。</p><p>'+A('GEM官方票务','https://tickets.gem.eg/')+' · '+A('两宫官方条件','https://www.millisaraylar.gov.tr/Lokasyon/2/Topkapi-Sarayi?culture=en')+'</p>';
  }
  function entryGuide(){
    return '<h2>十国入境与保险</h2><p>以下是本机资料基线，适用中国普通护照短期旅游的候选方向；<strong>全部在2027出发前再核，签证签发不等于保证入境</strong>。按护照剩余有效期、累计停留、口岸、往返/离境票及住宿要求准备，不把免签写成无材料。</p>'+table(['国家','当前资料基线','行前动作'],[
      ['哈萨克斯坦','原稿单次30日；累计停留与入境条件待官方重核','核伊宁—霍尔果斯国际客运、实际口岸、票据及护照条件'],
      ['乌兹别克斯坦','2025-06-01起单次≤30日，每180日累计≤90日','删除10日旧政策；保存住宿登记，核当期要求'],
      ['阿塞拜疆','原稿单次30日方向；2027重核','核航空入境与巴库出境夜车实际跨境条件，不把免签当车票'],
      ['格鲁吉亚','原稿单次30日方向；2027重核','夜车过境日起就需保险，覆盖至实际离境'],
      ['亚美尼亚','原稿90日方向；累计周期与条件待官方重核','核公路口岸开放、车票与住宿凭证'],
      ['土耳其','2026现行旅游/过境90/180免签','2027重核入境申报及护照条件'],
      ['波黑','每180日内停留≤90日','更正原稿90日内30日；核累积在境天数'],
      ['塞尔维亚','原稿30日方向；2027重核','核实际停留/住宿登记要求与离境票'],
      ['埃及','拟预办官方单次eVisa，目前30美元；HRG入境','提前核中国护照资格和材料，未签发前不标已办；不套用开罗数字落地签试点'],
      ['阿联酋','中国普通护照剩余有效期6个月以上；每180日总停留≤90日','删除30日旧说；按SHJ/AUH/DXB实际口岸与离境票准备']
    ])+'<h3>保险仍未落实</h3><p>58天180元只是预算预留，没有具体产品、投保/承保或英文凭证。优先在离开中国前核实并购买覆盖全程实际日期与十国地域的医疗及意外险；逐条确认浮潜、海上活动、中暑、夜车、救援遣返、免赔额和子限额。不要把人民币医疗总额换算后就宣称全部合规。</p><p>格鲁吉亚本机复核要求：医疗及意外保险、至少30000GEL、英文或格文、覆盖实际入境至离境；D16夜车应从过境日7/26起覆盖。若只买分段险，未覆盖时段属于自担风险；购买前确认是否允许已离境起保。日期调整后同步改保单。</p><p>'+A('埃及官方eVisa','https://visa2egypt.gov.eg/eVisa/FAQ')+' · '+A('格鲁吉亚保险法令','https://manage.matsne.gov.ge/ka/document/view/6728816')+'</p>';
  }
  function luggageGuide(){
    return '<h2>20L轻装与行李逐单核对</h2><p>采用20L黑色皮质双肩包＋轻便单肩包；<strong>实装总重≤5.5kg是目标，还没有称重验收</strong>。容量、防水或外观不等于航空合规。将相机、电池、充电器、水瓶、证件全部装入后称两件总重并量外部尺寸，预留临时饮水和食品重量。</p>'+table(['航司','本机复核基线','执行动作'],[
      ['Pegasus飞马','Light仅1件40×30×15cm、3kg座下包；标准登机包8kg、55×40×23cm需对应套餐/加购','先按票价自带随身包比较，本人实装符合即无需加购；超出所选票种才比较减物、其他票种或加购。旧280元只是草案留额，不是必买费用。5.5kg为旧目标，尚未称重。'],
      ['乌航','经济舱1件8kg；LITE无免费托运','单肩包需能收进主包，核实际订单尺寸与承运方'],
      ['AZAL','经济舱基础1件10kg、55×40×23cm','仍核票面与件数；不自动额外送单肩包'],
      ['Air Cairo','一般1件7kg、55×40×23cm；托运随区域、票种和承运方不同','按实际BEG—HRG订单核；不默认送23kg托运'],
      ['Air Arabia','主包≤7kg、55×40×20cm；个人物品≤3kg、25×33×20cm；两件及免税品合计≤10kg','主包不能独占10kg；分别称重、量尺寸，再核票面']
    ])+'<p>备2–3套速干换洗、薄外套、遮肩膝长衣、泳衣、常用药、纸巾、耳塞、轻便防晒帽与可补水容器；液体和电池按当期安检规则。不给陌生人代带行李。若包自重过高，先减非必需物，再决定更换包具。</p>';
  }
  function laundryGuide(){
    return '<h2>每5–7天洗衣与补给</h2><p>少带衣服要依靠稳定洗衣，<strong>每5–7天安排一次</strong>；汗湿、泳衣和内衣当天处理，不把7天当硬拖延上限。原稿付费机洗5–6次150元与全程频率不完全一致，实际次数/收费需据住宿重算。</p><ul><li>优先连住且次日不早出发的晚上：阿拉木图、撒马尔罕、第比利斯、格雷梅、伊斯坦布尔、贝尔格莱德、埃及途中再补一次及开罗。日期是候选，不保证青旅有机洗。</li><li>入住前问：是否自助、收费包含洗剂/烘干吗、截止时间、晾晒位置和预计可取时间。没有机洗就搜索顺路自助洗衣店，先看门口营业说明。</li><li>离店/跨境前一晚不洗厚衣；未干衣物分开放，次日尽快展开，不在湿包内闷一天。皮包与相机防潮分开。</li><li>补给只买5–7天小包装，优先牙膏、洗剂、纸巾、防晒与日用品；不要提前背全程瓶装用品。</li></ul><p>洗衣费用在实际记录中用“洗衣/杂项”，不重复计入餐饮；能在厨房做饭前确认炉具、冰箱和清洁要求。</p>';
  }
  function transitGuide(){
    return '<h2>跨境、夜车与到站衔接</h2><p>所有2027车次、票价与发车站待放票核实；平台线路页和当前样例只支持路线方向。2+1只表示一排三座，不能承诺平躺、睡好、WiFi或免费早入住。</p><ul><li>伊宁→阿拉木图：正规国际客运、口岸开放及行李规则逐项确认；全日用于出入境道路，不安排刚好衔接的当晚票。</li><li>阿拉木图→塔什干：7/17的001Х开行日尚待核，卧铺与国际大巴分别确认实际车站、边检和到达时间，不预扣住宿成本。</li><li>巴库→第比利斯：2026官方23:10→08:41是历史时刻，2027再核；购票OTP需真收验证码并完成完整回传才算连接成功。护照与保险放随身小包。</li><li>第比利斯→埃里温：选择正规承运人，边检与路况计入总时长，抵达后晚餐和短散步即可。</li><li>Kaş：D26/D27连住两晚，D27船游后留宿；D28白天去Ağullu站/票面指定站再赴费特希耶，保留至少2.5小时候选换乘余量，并按最终站点/票面重算。</li><li>格雷梅→安塔利亚、费特希耶→伊斯坦布尔：夜巴候选；到站后先寄存、吃饭、按房态补眠，早入住可能另付费，下午删减景点。</li><li>东萨拉热窝→贝城：确认Istočno Sarajevo是否为实际出发站；不能用市中心萨拉热窝站替代。</li><li>阿斯旺→开罗：夜车、大巴或次日早班机均未落实。没有班次/车型/站点/票价证据前，不默认Go Bus直达2+1，也不同时扣掉住宿和交通差价；白天飞需加一晚阿斯旺。</li></ul><p>国际航班至少按承运人要求提前到机场；市区→机场、值机、证件核验、出境安检和到登机口分开算。遇延误先保交通与睡眠，景点按优先级删减。</p>';
  }
  function uaeGuide(){
    return '<h2>阿联酋待核尾段与返校硬约束</h2><p><strong>最迟2027-09-05到杭州并可靠返校；优先09-04或更早到杭。09-06才抵杭的58天分支不采用。</strong>新疆若多住一晚，就缩短阿联酋或其他模块，仍在09-05前返回。2027真实班次优先，不先固定“9/4晚飞”。</p><ul><li>航空比较：开罗直接/中转返HGH、返PVG加完整回杭、正常经阿联酋转机、阿联酋停3晚，都用同一返校终点比较。900＋2000元机票仍是假设，未锁价。</li><li>埃及机场：SPX距吉萨金字塔约45km、市中心约42km；住宿→SPX接驳、路况和机场缓冲另算。SPX/CAI不能随意替换。</li><li>阿联酋机场：SHJ沙迦、AUH阿布扎比、DXB迪拜分别核；机票、住宿和接驳必须组成同一链条。AUH/SHJ到迪拜不等于地铁直达。</li><li>Air Arabia有SPX→SHJ/AUH现行路线页，只说明方向存在。Wizz Air Abu Dhabi本地运营自2025-09-01暂停，不沿用旧航线作默认备选。</li><li>阿布扎比卢浮宫当前成人70AED，未确认普通21岁外国学生单次优惠；120AED学生年票不当单次低价票。谢赫扎耶德大清真寺当前境外游客10AED并需预约。</li><li>E100/E101当前25AED是单程，往返50AED；景点间、市内及机场另计。免费机场接驳须有对应资格和预约，不能默认。</li><li>酒店/青旅入住年龄按具体住宿，满21不证明床位可买、含税或押金已含。至少取得正确日期、最终价与入住条件。</li><li>返HGH：落地后仍需入境及回校。返PVG：加上入境、取行李/候车、机场联络线、虹桥站换乘和高铁回杭，再到宿舍；不写“落地接1小时高铁”当门到门。</li></ul><p>阿联酋盛夏以早晚步行、室内避暑为主；长途日不叠加沙滩与远端景点。尾段没完成报价与返校链核验前，保持待核候选状态。</p>';
  }
  function foodGuide(){return '<h2>十国餐饮、超市与青旅厨房</h2><p>'+E(sourceNote)+'</p><p>每天先保早餐、饮水和一顿热正餐。沿行程吃，不为“高分”跨区；15–20分钟无望出餐就改备选。下面是食物方向，均未核具体店、分店营业或评分。</p>'+Object.values(regions).map(r=>'<h3>'+E(r.name)+' · '+E(r.budget)+'规划留量</h3><ul>'+r.meals.map(s=>'<li>'+E(s)+'</li>').join('')+'</ul><p>'+E(r.order)+' '+E(r.kitchen)+'</p>').join('')+'<h3>厨房与食品保存</h3><p>入住前问厨房是否开放、有无冰箱与基础餐具；先洗手、清洁台面，生熟分开，当餐做当餐吃。没有可靠冷藏就不背隔夜熟肉、切果和奶制品长途赶路。瓶装水与额外饮料都记入餐费。</p>';}
  function sourceGuide(){
    return '<h2>来源与核验边界</h2><p>本App改写依据桌面54.md及本机两份独立复核：Gemini_54天方案核查_20261104.md、58天阿联酋尾段复核_20261104.md。采用复核中的纠错，不继承原稿“定案、封顶、完全合规、已实付”等说法。本次制作没有新增网络查询、购票、投保或商家联系。</p><p>下列链接是既有复核使用的官方入口，供行前继续查证；当前规则/路线/售票页不证明2027指定日期的价格、班次、学生资格或床位。餐饮、水果与厕所仅为方向与现场准备，不是实时营业或卫生检查。</p><ul>'+sources.map(([label,url])=>'<li>'+A(label,url)+'</li>').join('')+'</ul>';
  }
  D.guides=[
    {id:'budget',title:'预算草案与实际支出',html:budgetGuide()},
    {id:'tickets',title:'票据、学生证与离线材料',html:ticketsGuide()},
    {id:'entry',title:'十国入境与全程保险',html:entryGuide()},
    {id:'luggage',title:'20L轻装与航司行李',html:luggageGuide()},
    {id:'laundry',title:'5–7天洗衣与补给',html:laundryGuide()},
    {id:'transit',title:'跨境夜车与到站衔接',html:transitGuide()},
    {id:'uae-return',title:'阿联酋尾段与返校',html:uaeGuide()},
    {id:'food',title:'十国餐饮与青旅厨房',html:foodGuide()},
    {id:'sources',title:'来源与核验边界',html:sourceGuide()}
  ];
  attach(D);
  window.TripFood={shops,plans,summary,details,overview,checked,attach,region,mealHTML,sourceNote,nav};
})();

