(() => {
  'use strict';
  (window.TripItinerary27 ||= {}).uae = ({D,day,row,setRows,meal,budget,guide}) => {
    const link = (label,url) => ({label,url});
    const source = {
      fountain:link('Dubai Mall 喷泉时刻','https://www.thedubaimall.com/en/entertain-detail/dubai-fountain'),
      oldCity:link('迪拜旅游局 · 老城、辛达加与 Abra','https://www.visitdubai.com/en/articles/dubais-top-11-cultural-locations'),
      frame:link('迪拜相框官网','https://www.dubaiframe.ae/en/plan-your-visit'),
      future:link('未来博物馆官网','https://museumofthefuture.ae/en/get-help'),
      palm:link('单轨时刻','https://www.palmmonorail.com/train-times'),
      palmPrice:link('单轨票价','https://www.palmmonorail.com/ticket-prices'),
      metro:link('迪拜机场地铁','https://dubaiairports.ae/transport/metro'),
      rta:link('RTA 地铁时刻','https://rta.ae/wps/portal/rta/ae/public-transport/timetable'),
    };
    const map = id => {
      const p = D.places[id];
      return link(p.name+' · 地图', 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.query));
    };
    const timed = (id,time,title,detail,place=null,links=[],highlight=false) => row(57,id,{time,title,detail,place,links,highlight});
    const arrival = day(54);
    const d55 = day(55);
    Object.assign(d55,{
      label:'开罗→迪拜 EK928 · Downtown 夜景', title:'开罗→迪拜 EK928', name:'开罗→迪拜 EK928',
      bookingStatus:'booked-user-reported', requiresBookingTime:false,
      note:'EK928 免费改签至 9 月 3 日周五。13:10 从开罗 T2 起飞，17:30 抵迪拜 T3。先办理入住。',
      priority:'当地 09:30 左右到 CAI T2。能在 21:30 前到 Dubai Mall 再执行夜景线。',
      extras:'<p>到 Dubai Mall 太晚就在住宿附近吃晚餐。公共水族幕墙和喷泉免费观看，付费水族馆仅作现场自选。</p>',
      transportPlan:[{
        id:'cai-uae-ek928',route:'开罗 CAI T2 → 迪拜 DXB T3',operator:'Emirates 阿联酋航空',
        service:'EK928 · 已出票，免费改签至 9/3',departure:'9/3 13:10（开罗）',
        arrival:'9/3 17:30（迪拜）',evidenceStatus:'本人确认改签完成，改签费 EGP 0。',
        url:'https://www.emirates.com/english/book/flight-schedules/',
      }],
    });
    const flightRows = arrival.rows.map(item => {
      const {id,...fields} = item;
      if (id==='d54r58-01') Object.assign(fields,{
        title:'早餐、退房与携带50L主包',
        detail:'50L 主包已计划于 D54 返开罗时取回。核对 9/3 改签后的电子客票、证件与行李，按原定机场缓冲出门。',
        place:'stay-cairo',links:[],
      });
      if (id==='d54r58-05') Object.assign(fields,{
        startDate:d55.date,endDate:d55.date,highlight:true,
        detail:'9/3 改签完成，改签费 EGP 0。当地 13:10 从开罗 CAI T2 出发，当地 17:30 抵迪拜 DXB T3。按电子客票核对。',
      });
      if (id==='d54-evening-v17') Object.assign(fields,{
        detail:'如 21:30 前抵达 Dubai Mall，可看公共水族箱幕墙、哈利法塔外景和喷泉。商场现行排期 18:00–23:00，每半小时一场，按现场当日为准。',
        links:[source.fountain],
      });
      return row(55,id,fields);
    });
    setRows(55,flightRows);
    meal(55,'午餐',null);
    meal(55,'晚餐',null);
    budget(55,'EK928 改签费 EGP 0。公共水族箱幕墙、哈利法塔外景与喷泉公共区 AED 0。另计机场接驳、交通和餐费。');

    const d57 = day(57);
    Object.assign(d57,{
      label:'辛达加老城·JBR·蓝水岛→机场', title:'迪拜老城与海滨，夜赴 DXB T3', name:'迪拜老城与海滨',
      note:'退房寄包后先逛迪拜河老城。午后优先留 JBR 和蓝水岛，夜间赴机场候机。',
      priority:'约 21:30 取包，22:00 左右进红线，目标 22:45 前到 DXB T3。末班衔接有风险就用正规出租车。',
      lodging:'今晚在 DXB T3 候机',
      extras:'<p>辛达加、阿法迪与 Abra 为上午主线，可以用迪拜相框和未来博物馆外观替换。日落以蓝水岛为主，<a href="https://www.visitdubai.com/en/places-to-visit/sunset-beach" target="_blank" rel="noopener noreferrer">Sunset Beach</a> 可取代 JBR 和蓝水岛拍帆船酒店。各站末班以当日 RTA 时刻为准。</p>',
    });
    setRows(57,[
      timed('d57r58-01','08:15–09:00','退房寄包并确认晚间取包','把 50L 主包寄在住宿，确认约 21:30 仍能取包；留好凭证。','stay-dubai'),
      timed('plan27-d57-old-dubai-transfer','09:00–10:00','住宿→迪拜河老城','向 Al Ghubaiba 或辛达加馆入口出发。相框＋未来馆外景可替换整段上午活动。','plan26-al-shindagha',[source.frame,source.future,map('plan26-dubai-frame'),map('future-museum')]),
      timed('plan26-d55-shindagha','10:00–11:25','辛达加博物馆','从 Dubai Creek 展区开始。现行成人 AED 50，优惠按票规；晚到可缩短展厅。','plan26-al-shindagha',[source.oldCity]),
      timed('plan26-d55-fahidi','11:25–12:10','阿法迪历史街区','沿旧城步行看风塔与河岸，正午到来前结束露天长走。','al-fahidi'),
      timed('plan26-d55-abra','12:10–12:40','传统 Abra 过河','查传统公共木船班次和站牌，参考 AED 1 单程。排队久则沿同岸找午餐。','abra',[source.oldCity]),
      timed('d57r58-04','12:40–14:15','午餐、饮水与室内采购','就近找有冷气的餐馆或商场，约 14:15 转往南部海滨。'),
      timed('d57r58-03','14:15–15:30','转往海滨 · 先判断单轨条件','若有票且能在 15:30 前抵 Palm Gateway，可选单轨；否则直接去 JBR。',null,[source.palm,map('rev58-d57-3')]),
      timed('d57r58-05','15:30–17:00 · 可选','棕榈岛单轨→亚特兰蒂斯外景','到站早且当天运营才执行，往返 AED 30 为现价参考。接驳慢或遇停运就略过，优先留 JBR 和蓝水岛。',null,[source.palmPrice,map('plan26-atlantis-public')]),
      timed('d57r58-02','17:00–18:10','JBR 公共海滩与蓝水岛步行桥','走公共海滩和步行桥；没坐单轨可提前到。','rev58-d57-2'),
      timed('plan26-d57-bluewaters','18:10–19:30','蓝水岛看日落和迪拜眼外景','保留免费海滨外景，约 19:30 开始回住宿方向，路况拖延就提前离开。','plan26-bluewaters',[link('蓝水岛步行桥','https://bluewatersdubai.ae/en/whats-on/blogs/a-stroll-across-bluewaters-pedestrian-bridge')]),
      timed('d57-return-v17','19:30–20:35','蓝水岛→住宿片区','按地铁、电车和步行实际接驳。稍晚即可改外带，先保证取包。','stay-dubai'),
      timed('d57r58-06','20:35–21:15','晚餐：Karachi Darbar · Satwa / 284D90店','按住处选就近简餐；20:50 后到就外带。'),
      timed('d57-bags-v17','21:15–21:40','取回50L主包与托运保护袋','约 21:30 取包，尽快前往机场方向地铁站。','stay-dubai'),
      timed('d57r58-07','21:40–22:45 · 提前进机场','约22:00乘红线赴DXB T3','确认实际出发站、机场 T3 停靠与末班。目标 22:45 前到达，遇延误改乘正规出租车。','rev58-d54-6',[source.rta,source.metro],true),
    ]);
    meal(57,'晚餐',{note:'蓝水岛返住宿片区后就近吃，若晚于 20:50 用便携晚餐，优先取包赴机场。'});
    budget(57,'辛达加 AED 50＋传统 Abra AED 1 为现价参考；迪拜相框成人 AED 50 可替换。JBR、蓝水岛外景免费；单轨满足时间条件时另加 AED 30。市内交通、晚餐另计。');
    guide('uae-return','迪拜、阿布扎比与返杭','<h2>9/3 到迪拜 · 9/6 返杭州</h2><p>EK928 已免费改签至 9/3，13:10 开罗 T2 → 17:30 迪拜 T3。EK310 9/6 04:35 迪拜 T3 → 17:05 杭州 T4。</p><ul><li>D55 入住后，能在 21:30 前到 Dubai Mall 再看 Downtown 夜景。D56 周六阿布扎比三站按原顺序执行。</li><li>迪拜住 9/3、9/4 两晚。D57 退房寄包，上午迪拜河老城，傍晚蓝水岛。</li><li>D57 约 21:30 取包，22:45 前到 T3。核实际红线站点的机场方向末班。抵杭乘 19 号线换 5 号线返校。</li></ul>');
  };
})();
