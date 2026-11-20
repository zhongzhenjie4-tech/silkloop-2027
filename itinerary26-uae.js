(() => {
  'use strict';
  (window.TripItinerary26 ||= {}).uae = ({day,row,setRows,place,meal,budget,guide}) => {
    const source = (label,url) => ({label,url});
    const frameWeb = 'https://www.dubaiframe.ae/en/plan-your-visit';
    const futureWeb = 'https://museumofthefuture.ae/en/get-help';
    const oldDubaiWeb = 'https://www.visitdubai.com/en/articles/dubais-top-11-cultural-locations';
    const fountainWeb = 'https://www.visitdubai.com/en/places-to-visit/the-dubai-fountain';
    const airportWeb = 'https://dubaiairports.ae/transport/metro';
    const transitWeb = 'https://rta.ae/wps/portal/rta/ae/public-transport/timetable';
    const adBus = 'https://admobility.gov.ae/en/inter-emirates-services';
    const louvreWeb = 'https://www.louvreabudhabi.ae/visit-us';
    const aquariumWeb = 'https://tickets.thenationalaquarium.ae/tna_b2c/ticketselection.html';
    const mosqueWeb = 'https://szgmc.gov.ae/en/individual-booking';
    const monorailWeb = 'https://www.palmmonorail.com/stations';
    const boardwalkWeb = 'https://www.visitdubai.com/en/places-to-visit/palm-jumeirah-boardwalk';
    const bluewatersWeb = 'https://bluewatersdubai.ae/en/faqs';
    const next = (n,id,time,title,detail,p=null,links=[],highlight=false) => row(n,id,{time,title,detail,place:p,links,highlight});
    const frame = place(55,'plan26-dubai-frame',{name:'迪拜相框',query:'Dubai Frame Zabeel Park Gate 4 Dubai',lat:25.23546,lng:55.30037,coordinateSource:'https://www.openstreetmap.org/way/386649647',address:'Zabeel Park 4 号门，标记为建筑中心'});
    const shindagha = place(55,'plan26-al-shindagha',{name:'辛达加博物馆',query:'Al Shindagha Museum Dubai',lat:25.26647,lng:55.28896,coordinateSource:'https://www.openstreetmap.org/node/11927748577',address:'Al Shindagha 河畔馆群，入场口以票面和现场为准'});
    Object.assign(day(56),{label:'阿布扎比·卢浮宫·水族馆·大清真寺',city:'阿布扎比',defaultCity:'阿布扎比',note:'周六赴阿布扎比。午后安排室内水族馆，傍晚按预约到清真寺，先核回迪拜大巴。',priority:'先核双向 E100／E101 和清真寺预约，再买当天两馆门票。'});
    const aquarium = place(56,'plan26-abu-dhabi-aquarium',{name:'阿布扎比国家水族馆',query:'The National Aquarium Abu Dhabi Al Qana',lat:24.40198,lng:54.49585,coordinateSource:'https://www.openstreetmap.org/node/9629445887',address:'Al Qana，Rabdan'});
    const bluewaters = place(57,'plan26-bluewaters',{name:'蓝水岛海滨',query:'Bluewaters Island Dubai pedestrian bridge',lat:25.07991,lng:55.12192,coordinateSource:'https://www.openstreetmap.org/node/6358621691',address:'岛内参考点，从 JBR 步行桥过岛'});
    const atlantis = place(57,'plan26-atlantis-public',{name:'Atlantis Aquaventure 单轨终点站',query:'Atlantis Aquaventure Monorail Station Dubai',lat:25.13289,lng:55.11880,coordinateSource:'https://www.openstreetmap.org/way/1126642448',kind:'station',address:'站点屋顶中心，从终点步行至公共海滨'});

    Object.assign(day(54),{label:'开罗→迪拜 EK928 · Downtown 夜景',note:'EK928 17:30 抵迪拜 T3。先入境、取包和入住，时间仍够再去 Dubai Mall 看夜景。',priority:'Dubai Mall 和喷泉看当晚到店时间执行，入境或行李晚点就缩短夜景。',extras:'<p>到 Downtown 太晚就在 Satwa 吃饭。补看喷泉可放 D55 晚间，前提是老城动线有余量。</p>'});
    setRows(54,[...day(54).rows.slice(0,6),
      next(54,'d54r58-07','19:15–20:30 · 抵达后目标','红线进城并办理入住','购／充值 Nol 银卡，乘红线往住宿方向。预定住宿后核实最后一段步行或接驳。','stay-dubai',[source('DXB 红线与出站指南',airportWeb)]),
      next(54,'d54-dinner-transfer-v17','20:30–21:10 · 条件执行','住宿→Dubai Mall','如预计 21:30 前到商场，再走 Downtown 夜景线。不用拖主包逛商场。','dubai-mall'),
      next(54,'d54r58-08','21:10–21:55 · 条件执行','晚餐与 Dubai Mall 公共水族箱幕墙','从公共通道看大玻璃幕墙；水族馆检票体验另收费。用快餐或便携餐，按当晚营业选。','dubai-mall'),
      next(54,'d54-evening-v17','21:55–22:40 · 条件执行','哈利法塔外景与迪拜音乐喷泉','旅游局现行晚间参考 18:00–23:00、约每半小时一场。免费公共机位足够，随当晚演出和回宿交通调整。','dubai-fountain',[source('迪拜旅游局演出参考',fountainWeb)]),
      next(54,'plan26-d54-return','22:40–23:20','Downtown→住宿','核当晚地铁站末班或用正规出租车；优先回宿。','stay-dubai')]);
    meal(54,'晚餐',null);
    budget(54,'公共水族箱幕墙、哈利法塔外景与喷泉公共观看区 AED 0。另计地铁、晚餐与必要时的出租车。');

    Object.assign(day(55),{label:'迪拜相框·未来馆·迪拜河老城',city:'迪拜',defaultCity:'迪拜',note:'白天先安排有空调的迪拜相框。未来馆先看建筑外景，2027 开放票务确认后再决定进馆。傍晚走老城与迪拜河。',priority:'辛达加博物馆 19:00 停止入场为现行参考，先看馆再过河。',extras:'<p>未来馆若尚未开放，保留迪拜相框和午餐室内时段，下午提早去辛达加。老迪拜博物馆不作为主线。</p>'});
    setRows(55,[
      next(55,'plan26-d55-start','08:00–09:00','早餐与出门补水','用早餐后赴扎比尔公园 4 号门。','stay-dubai'),
      next(55,'plan26-d55-frame','09:00–11:00','迪拜相框展厅与观景层','官网现行 08:00–21:00，成人 AED 50 参考，按当日票务核准。',frame,[source('迪拜相框官网',frameWeb)]),
      next(55,'plan26-d55-future','11:30–14:15','未来博物馆外景、室内午餐或预约展览','馆方公布暂时闭馆更新，目标 2027 第一季度重新开放。先按免费外景安排；若官网公布 9/3 门票，按实际价格、入场时段和余位选择。没有公布固定的提前 2–4 周放票规则。','future-museum',[source('未来博物馆闭馆与重开说明',futureWeb)]),
      next(55,'plan26-d55-transfer','14:15–16:00','午后室内补水休整，再前往老城','用沿线商场或咖啡座避开正午高温；约 16:00 抵 Al Fahidi。','al-fahidi'),
      next(55,'plan26-d55-fahidi','16:00–16:50','阿法迪历史街区与河畔','侧巷、风塔和河岸短走，沿 Bur Dubai 岸继续往辛达加。','al-fahidi'),
      next(55,'plan26-d55-shindagha','17:10–18:45','辛达加博物馆','旅游局参考 10:00–20:00、最后入场 19:00。成人 AED 50；学生优惠按当日资格核准。时间不足优先 Dubai Creek 展区。',shindagha,[source('迪拜旅游局文化场馆与票价',oldDubaiWeb)]),
      next(55,'plan26-d55-abra','18:45–19:25','传统 Abra 渡过迪拜河','选择传统公共 Abra，现行普通木船参考 AED 1/程，带零钱；空调或观光线有不同价格。','abra',[source('传统 Abra 票价参考',oldDubaiWeb)]),
      next(55,'plan26-d55-souk','19:25–20:30','黄金市场与香料街外圈','按个别店营业决定是否入店，市场街区夜间仍可顺路看外观。','gold-souk'),
      next(55,'plan26-d55-dinner','20:30–21:30','晚餐后乘地铁返住宿','就近在 Deira 吃饭，实际营业晚于计划时换简餐。','stay-dubai')]);
    delete day(55).transportPlan;
    meal(55,'午餐',null);
    budget(55,'迪拜相框与辛达加成人参考各 AED 50，传统 Abra AED 1/程。主线约 AED 101，地铁和餐费另计。未来馆外观免费，室内票按重开后官网另算。');

    setRows(56,[
      next(56,'plan26-d56-start','06:15–07:00','早餐并前往 E100／E101 车站','住 Deira／BurJuman 一带优先查 Al Ghubaiba 的 E100；住迪拜南部可查 Ibn Battuta 的 E101。确认 Nol 余额和返程末班。','al-ghubaiba',[source('城际公交服务',adBus)]),
      next(56,'plan26-d56-bus','07:00–09:30 · 建议窗口','城际巴士赴阿布扎比','按运营时刻选班，单程 AED 25 为现行参考。到中央车站后转乘当地交通赴卢浮宫，候车拥堵时缩短馆内参观。','abu-dhabi-bus'),
      next(56,'plan26-d56-louvre','10:15–13:00 · 到馆后调整','阿布扎比卢浮宫','以普通成人票 AED 70 做预算；以官网资格页为准，未核到 21 岁外国青年 AED 35 通用票。','louvre',[source('卢浮宫官网开放与票价',louvreWeb)]),
      next(56,'plan26-d56-lunch','13:00–13:30','午餐：Museum Café · Louvre Abu Dhabi馆内店','馆内或馆区就近简餐，耽误就带走。','louvre'),
      next(56,'plan26-d56-aquarium','14:15–16:30','阿布扎比国家水族馆 The National Aquarium','由卢浮宫预留约 45 分钟接驳至 Al Qana。官网当前普通票 AED 110；AED 99 或平台折扣以可用时段和结算为准。',aquarium,[source('水族馆官方票务',aquariumWeb)]),
      next(56,'plan26-d56-mosque','17:15–19:30','谢赫扎耶德大清真寺·傍晚与亮灯','提前预约免费访客通行证，按预约提前到并留安检、更衣及步行时间，车程随路况。先确认夜景和返程巴士；当晚返程早则提前离开。','grand-mosque',[source('大清真寺官方访客通行证',mosqueWeb)],true),
      next(56,'plan26-d56-return','19:30–23:00 · 返程按车票','简餐→中央车站→迪拜','按当天 E100／E101 末班倒推，必要时缩短清真寺停留，优先赶回程。','abu-dhabi-bus',[source('城际公交运营方',adBus)])]);
    meal(56,'午餐',{rowId:'plan26-d56-lunch',shop:'abu-dhabi-museum-cafe',backup:null,note:'卢浮宫参观后就近简餐，再去 Al Qana。'});
    meal(56,'晚餐',null);
    day(56).transportPlan = [{route:'迪拜 ↔ 阿布扎比',operator:'RTA / Abu Dhabi Mobility',service:'E100／E101，先核去回班次',departure:'建议 07:00 左右出发',arrival:'回程按 9/4 当天运营表',url:adBus}];
    day(56).extras = '<p>当日主线为卢浮宫、水族馆、清真寺。先落实城际回程，再按票面协调第三站。</p>';
    budget(56,'按官方现价参考：卢浮宫 AED 70、水族馆 AED 110、清真寺预约免费，城际大巴来回 AED 50。合计 AED 230，市内接驳和餐费另算。');

    Object.assign(day(57),{label:'棕榈岛·JBR·蓝水岛→机场',note:'日间退房寄包，午后走棕榈岛与蓝水岛。今晚到 DXB T3 候机，次日 04:35 搭 EK310。',priority:'返程优先：21:30 前后取包，约 22:00 进站，目标 22:45 前到 DXB T3。末班无法确认就叫正规出租车。',extras:'<p>留存青旅寄存和最晚取包确认。棕榈岛单轨若当天不营业，优先留 JBR＋蓝水岛。<a href="https://www.visitdubai.com/en/places-to-visit/sunset-beach" target="_blank" rel="noopener noreferrer">Sunset Beach</a> 拍帆船酒店是替代海边机位，选它就缩短其他海滨停留。</p>'});
    setRows(57,[
      next(57,'d57r58-01','08:30–10:00','退房、寄主包并确认关门时间','确认 21:30 仍有前台可取包，再轻装出门。','stay-dubai'),
      next(57,'d57r58-04','11:30–13:00','商场午餐与饮水','优先选临近地铁、方便下一段转车的商场，炎热时在室内用餐。','rev58-d57-4'),
      next(57,'d57-shopping-v17','13:00–14:30','室内采购伴手礼','Shopping 与补水留在室内；离境前核托运剩余额度。','rev58-d57-4'),
      next(57,'d57r58-03','14:30–15:30','前往棕榈岛单轨乘车点','先确认 Palm Gateway 接驳与运营方是否开放售票。','rev58-d57-3',[source('Palm Monorail 运营方',monorailWeb)]),
      next(57,'d57r58-05','15:30–17:00 · 以当天运营为准','棕榈岛单轨→亚特兰蒂斯外景','通车且有票时执行；AED 30 往返只作预算留量，按运营方实价。停运就改地面接驳或跳过棕榈岛，保留 JBR 和蓝水岛。',atlantis,[source('单轨站点与运营',monorailWeb),source('公共海堤步道',boardwalkWeb)]),
      next(57,'d57r58-02','17:00–18:10','返回电车线，往 JBR 2 与公共海滩','按实时接驳回电车，向 JBR 2；从海边步行桥过蓝水岛。','rev58-d57-2'),
      next(57,'plan26-d57-bluewaters','18:10–19:35','蓝水岛看日落和迪拜眼外景','步行桥往返，公共海滨免费，迪拜眼乘坐为另购活动。日落后按取包截止时间返回。',bluewaters,[source('蓝水岛步行桥与到达方式',bluewatersWeb)]),
      next(57,'d57-return-v17','19:35–20:35','蓝水岛→住宿片区','优先沿顺向公共交通；拖延就取消堂食。','stay-dubai'),
      next(57,'d57r58-06','20:35–21:15','晚餐：Karachi Darbar · Satwa / 284D90店','仅按现有 Satwa 住宿候选选择，就近简餐或外带。'),
      next(57,'d57-bags-v17','21:15–21:40','取主包、证件和托运保护袋','约 22:00 前往实际红线进站点，核对 Centrepoint 方向机场 T3 停靠。','stay-dubai'),
      next(57,'d57r58-07','21:40–22:45 · 提前进机场','乘红线到 DXB T3 候机','周日营业到 24:00 是整网窗口，各站末班不同。提前核实际进站站点和 T3 方向末班；赶不上就用正规出租车。周一首班无法衔接 04:35 起飞。','rev58-d54-6',[source('RTA 时刻',transitWeb),source('迪拜机场地铁',airportWeb)],true)]);
    meal(57,'晚餐',{note:'蓝水岛返住宿片区后就近吃，若晚于 20:50 用便携晚餐，优先取包赴机场。'});
    budget(57,'JBR 和蓝水岛公共海滨 AED 0；棕榈岛单轨先留 AED 30，按运营方是否通车和实际票价。地铁、有轨电车、晚餐与必要时出租车另计。D57 不再加一晚住宿。');
    guide('uae-return','迪拜、阿布扎比与返杭','<h2>9/2 到迪拜 · 9/6 返杭州</h2><p>EK928 9/2 开罗 T2 13:10 → 迪拜 T3 17:30。EK310 9/6 迪拜 T3 04:35 → 杭州 T4 17:05。按票面时刻。</p><ul><li>D54 入住后按时间看 Downtown。D55 迪拜相框、未来馆外景、阿法迪与辛达加。</li><li>D56 周六阿布扎比三站为卢浮宫、国家水族馆和大清真寺。先核往返巴士。</li><li>D57 退房寄包，傍晚蓝水岛，约 22:00 进红线实际站点。机场目标 22:45 前。提前查末班，备用正规出租车。</li><li>9/2、9/3、9/4 三晚为住宿规划。9/5 晚在 T3 候机，抵杭乘 19 号线换 5 号线返校。</li></ul>');
  };
})();
