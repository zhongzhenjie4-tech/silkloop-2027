(() => {
  'use strict';
  (window.TripItinerary26 ||= {}).turkiyeEgypt = function ({day, row, setRows, budget}) {
    const perge = 'https://www.muze.gov.tr/muze-detay?DistId=PRG&SectionId=PRG01';
    const aspendos = 'https://muze.gov.tr/muze-detay?distId=ASP&sectionId=ASP01';
    const turkiyeFees = 'https://muze.gov.tr/document/bakanlik_yonergesi_tr.pdf';
    const t1b = 'https://cop31.antalya.edu.tr/en/getting-here?hedef=expo_area';
    const openAir = 'https://muze.gov.tr/muze-detay?distId=GRM&lang=en&sectionId=GRM01';
    const darkChurch = 'https://muze.gov.tr/urun-ekle?catalogNo=WEB-GRM02-01-009';
    const goremeSunrise = 'https://www.al-habib.info/prayer-time/for/Turkiye/G%C3%B6reme,%2B/23885910/2027/';
    const pegasus = 'https://www.flypgs.com/en/press-room/announcement/about-check-in-and-boarding-closure-times-and-cabin-baggage-requirements';
    const m4 = 'https://www.metro.istanbul/en/Hatlarimiz/HatDetay?hat=M4';
    const enr = 'https://enr.gov.eg/o-city/obs/enr/railway/en/home';
    const superJet = 'https://www.superjet.com.eg/ar/lang/en';
    const karnak = 'https://egymonuments.gov.eg/en/archaeological-sites/karnak/';
    const nmecHours = 'https://nmec.gov.eg/opening-hours/';
    const nmecTickets = 'https://egymonuments.com/nmec/tickets';
    const hangingChurch = 'https://egymonuments.gov.eg/en/monuments/the-hanging-church';
    const copticMuseum = 'https://egymonuments.gov.eg/en/museums/the-coptic-museum/';
    const source = (label, url) => ({label, url});
    const updateRows = (n, fields) => setRows(n, day(n).rows.map(r => fields[r.id] ? row(n, r.id, fields[r.id]) : r));

    updateRows(37, {
      'd26r58-02': {
        title: '轻轨 T1B 往 EXPO 方向至 Aksu，再接驳佩尔盖',
        detail: '确认车辆终点为 EXPO，在 Aksu 下车后按实时导航步行或短程打车。到达古城后确认当天可开放路线。',
        links: [source('T1B EXPO 方向指引', t1b), source('Aksu站地图', 'https://www.google.com/maps/search/?api=1&query=Aksu+Tram+Station+Antalya')],
      },
      'd26r58-03': {
        detail: '参观佩尔盖柱廊、浴场和体育场开放区域。土耳其文旅部目前公告古剧场因修缮临时关闭，出发前复查；古城外籍参考票 €11。阿斯潘多斯是另一处古剧场，若选半日团，按当天团单替换上午交通与景点，不能叠加默认时段。',
        links: [source('佩尔盖开放与修缮公告', perge), source('土耳其文旅部票价表', turkiyeFees)],
      },
    });
    const optionalTheatre = row(37, 'v26-d37-aspendos', {
      time: '半日团 · 可选替换', title: '可选升级：佩尔盖＋阿斯潘多斯古剧场',
      detail: '只有能在当天下午及时回安塔利亚并确认夜巴衔接时才订。按团单核对游览时间、是否含两处门票及接送。阿斯潘多斯外籍参考票 €15。回程不够宽松就保留佩尔盖、下杜登和晚间夜巴的原主线。',
      links: [source('阿斯潘多斯景区官网', aspendos), source('古剧场地图（Wikidata）', 'https://www.wikidata.org/wiki/Q16697381'), source('土耳其文旅部票价表', turkiyeFees)],
    });
    const d37 = day(37);
    setRows(37, [...d37.rows.slice(0, 3), optionalTheatre, ...d37.rows.slice(3)]);
    budget(37, '佩尔盖外籍票参考 €11；阿斯潘多斯可选，加 €15 与未含的团费或接送，若团价包含门票则不重复计。2027以出票价为准。');

    const d38 = day(38);
    const firstBalloon = row(38, 'v26-d38-balloon', {
      time: '到站后 · 地面观景', title: '热气球第一窗口：到达后看空中余场', place: 'goreme-sunrise',
      detail: '按附近日期推算，格雷梅日出约05:55–06:00，夜巴候选06:10抵达时可能已过放飞。寄完主包、如果还能看到空中的球，就去观景台；D39留作日出观球与预约乘飞，D40用于停飞改期。',
      links: [source('格雷梅当地日出表', goremeSunrise), source('格雷梅观景台地图', 'https://www.google.com/maps/search/?api=1&query=Goreme+Sunrise+Viewpoint')],
    });
    setRows(38, [d38.rows[0], firstBalloon, ...d38.rows.slice(1)]);
    d38.note = 'D38夜巴候选06:10到达，放飞可能已经开始；到站后有球在空中就顺路看，D39留作日出及乘飞主窗口。';
    d38.priority = d38.note;
    budget(38, '地面观球本身无乘飞票；具体观景台如有收费现场确认。付费乘飞只按正式订单记一次，D39为可提前预订的窗口。');

    updateRows(39, {
      'd23r58-01': {
        time: '05:00–07:00 · 日出窗口', title: '日出前看热气球／按预约集合体验', place: 'goreme-sunrise',
        detail: 'D38未看到时走本日主观球窗口。地面观景用地图上的镇边观景台，商业乘飞的上车点与时刻按正式订单；若遇天气停飞，问清D40是否能改期且不影响绿线接车。',
      },
      'd23r58-03': {
        detail: '优先参观露天博物馆。外籍参考价 €20。园区内黑暗教堂（Karanlık Kilise）为单独收费点，参考附加票 €6，按现场票务另购；基础票和附加票同时选为 €26。',
        links: [source('格雷梅露天博物馆', openAir), source('黑暗教堂附加票', darkChurch)],
      },
      'd23r58-09': {
        detail: '红谷或玫瑰谷只选一段熟悉路线，结伴、带水，下载离线地图并提前确认出口接驳。预留日落前下撤时间；若等日落再走，备好手机电筒与电量，有头灯更好。可跳过Paşabağ来换取谷地时间，避免同时追多个远端。',
      },
    });
    day(39).priority = 'D39优先保住日出观球与露天博物馆；黑暗教堂选购 €6，傍晚谷地择一。';
    day(39).note = day(39).priority;
    budget(39, '露天博物馆 €20，选黑暗教堂则合计 €26；若再选 Zelve／Paşabağ 官方联票参考 €12。球票、接驳另计，票面以2027为准。');

    updateRows(40, {
      'd24v2-01': {
        time: '05:20–07:00 · 天气备选', title: '前两天遇停飞才启用的热气球备选',
        detail: 'D38/D39 已完成就留作自由早餐前时间。如前两天因天气停飞，D40可用于地面补看或改约；与绿线团接车时间冲突时，保留已确认的行程并删去一项。',
      },
      'd24-return-v17': {
        detail: '返格雷梅按正式团单。最晚傍晚联系青旅确认次日去 ASR 的接车窗口；若绿线可能晚归，出团前先锁司机和备选车。',
      },
      'd24-bags-v17': {
        title: '同一青旅整包与确认 ASR 接驳', place: 'stay-goreme',
        detail: '核对开塞利 ASR 而非内夫谢希尔 NAV，拿到司机联络、上车点与最晚抵达时间。目标 04:30–05:00 上车、07:05 前到 ASR，按约1小时15分至1小时30分车程再给拼车停靠留量。接驳单位不能承诺到达时间时改约更早的车或正规专车。',
        links: [source('飞马航空机场到达建议', pegasus)],
      },
      'd24-station-v17': {
        title: '最后复核明晨接车确认单', place: 'stay-goreme',
        detail: '复核已约车辆和联程文件，将集合信息存离线。少睡一会也不要把09:05这班押在06:00–06:30接车上。',
      },
    });
    day(40).note = '热气球仅作天气备选；绿线返城仍住格雷梅。傍晚锁定次日04:30–05:00接车，07:05前到ASR。';
    day(40).priority = day(40).note;
    budget(40, '绿线核对已含门票、午餐和接送；热气球改期以原订单条款为准。ASR拼车或专车以书面含行李报价为准。');

    updateRows(41, {
      'sw19-d41-shuttle': {
        time: '04:30–06:30 · 接车04:30–05:00',
        detail: '按 D40 已确认接车安排去开塞利 ASR，目标06:30左右抵达缓冲，最迟按07:05到航站楼倒排。飞马建议国内段提前2小时到场，不能把值机截止时间当作到场时间；接车未落实即用备选车辆。',
        links: [source('飞马航空机场到达建议', pegasus)],
      },
      'd41r58-09': {
        detail: '出机场前确认托运行李牌最终目的地为 HRG、已经拿到后段登机牌、可以重新进入国际出发区且航班无延误。若条件不足，在 SAW 按指引继续办理后段并候机，不去市区。',
      },
      'sw19-d41-m4-return': {
        title: '17:00乘 M4 返回 SAW，18:30目标到航站楼',
        detail: 'M4运营方目前列 Kadıköy 至 SAW 全程约52分钟，另留步行、等车、进站和进航站楼时间。17:00从Kadıköy上车，18:30目标抵达；按国际段21:50起飞倒推，18:50前抵达更稳。不要等到19:00才从市区出发。遇地铁停运或进度不足就缩短市区行程。',
        links: [source('Metro İstanbul M4 线路', m4), source('飞马航空国际段到场建议', pegasus)],
      },
    });
    day(41).extras += '<p><b>返场时间：</b>17:00 乘 M4，目标18:30到SAW航站楼，按21:50国际段留足至少3小时。中转仍由实际行李标签、登机牌和当日航班决定。</p>';
    budget(41, '已出票的PC2733和PC620照原账本。只在执行市区半日时增加往返M4及饮食；ASR接驳以当日已确认报价为准。');

    const d46 = day(46);
    updateRows(46, {
      'd46v2-01': {time: '05:30–06:00', detail: '吃早餐，退房或先办理寄存。请前台确认10:30后能取回主包。'},
      'd46v2-02': {time: '06:00–06:30'},
      'd46v2-03': {
        time: '06:30–07:00', detail: '埃及文物部目前列06:00开门，给卡纳克留06:30–10:30完整窗口。外籍票参考普通600 EGP、符合资格学生300 EGP，覆盖卡纳克与露天博物馆；Mut庙为另项。',
        links: [source('卡纳克开放与门票', karnak)],
      },
      'd46v2-04': {time: '07:00–08:45'},
      'd46v2-05': {time: '08:45–10:30', detail: '依体力游圣湖和开放支线，带水遮阳；10:30按计划离开景区。'},
      'd46v2-06': {time: '10:30–11:20', place: 'stay-luxor', detail: '从景区回卢克索住宿，取回50L主包并确认退房。'},
      'd46v2-07': {time: '11:20–12:00'},
      'd46v2-08': {
        time: '12:00后 · 按票面倒排', title: '到卢克索站，按正式火车票候车',
        detail: '目标选13:00–14:30之间发车的合适下午班次。正式票面出来后留进站和检票时间，最少预留45分钟；若该窗口无票，优先另选更晚可出票班次，不把旧的11:05样例当既定安排。',
        links: [source('埃及国铁 ENR', enr)],
      },
      'd46v2-09': {
        time: '下午 · 待出票', title: '埃及国铁：卢克索→阿斯旺',
        detail: '13:00–14:30是拟选出发窗口，抵达时刻和车型以正式票面为准。没有核实到13:00出发、14:30抵达的车次，不据此排下一站。若较晚抵达，直接入住晚餐。',
        links: [source('埃及国铁 ENR', enr)],
      },
      'd46v2-10': {time: '抵达后', place: 'stay-aswan', detail: '从阿斯旺站直接去住宿办理入住。明早有阿布辛贝集合，晚到便跳过额外活动。'},
      'd46v2-11': {time: '18:00–19:00 · 随到站顺延'},
      'd46v2-12': {
        time: '最迟 D46 傍晚 · 可在乘车前办理', title: '确认阿布辛贝次日拼车、集合与所需资料',
        detail: '提前向已核实的住宿或持牌承运方确认D47约04:00–04:30接客的实际时刻、身份证明要求、提交方式与截止时间。若明确需要备案，走承运方可核实的正式渠道，仅提供所需资料；不在公开网页、群聊或未核实的 WhatsApp 联系方式提交护照照片。若需更早提交，提前办理。',
        place: 'stay-aswan', highlight: true,
      },
    });
    d46.priority = '卡纳克06:30–10:30，下午火车待出票；最迟傍晚确认D47阿布辛贝接车、集合时间和必要资料。';
    d46.note = d46.priority;
    d46.extras = '<p>卡纳克优先保留清晨窗口。卢克索→阿斯旺按正式车票选下午发车，抵达时间不锁定。若阿布辛贝运营商要求更早提交资料，在赴阿斯旺前办妥。</p>';
    d46.transportPlan = [{...d46.transportPlan[0], service: '下午火车 · 未出票；车型、车次和时刻以实际车票为准', departure: '13:00–14:30 发车目标', arrival: '以正式票面为准', url: enr, status: '待购'}];
    budget(46, '卡纳克外籍票参考600 EGP，符合学生资格300 EGP；火车、阿布辛贝拼车报价分别核。次日神庙门票不包括在车辆费用内，除非团单明确写明。');

    const d48 = day(48);
    updateRows(48, {
      'd48r58-08': {
        time: '13:30–15:00 · 依船况', title: '植物园岛（Kitchener’s Island）轻装往返',
        detail: '先问清往返船价及回程。90分钟包括上下船与回岸，计划15:00回东岸；无法保证回程或夜间交通需要提前到站，就缩短停留或跳过植物园。',
      },
      'd48r58-09': {
        time: '15:15–15:45', title: '回青旅取50L主包，备车上简餐', place: 'stay-aswan',
        detail: '依车票确认上车点和应到时间。若行李领取有排队，先取包，简餐在路上解决。',
      },
      'd48r58-10': {
        time: '15:45后 · 依票面', title: '按票面前往夜巴站或阿斯旺火车站', place: null,
        detail: 'Super Jet 上车点按对应车票核对，不能用火车站坐标当作汽车站。87次列车则查阿斯旺国铁站和开罗实际到站。目标至少提前45分钟报到，若运营方指定更早以其为准。',
        links: [source('Super Jet 官网', superJet), source('埃及国铁 ENR', enr)],
      },
      'd48r58-11': {
        time: '傍晚 · 未出票', title: '阿斯旺→开罗：夜巴或夜火车', place: null,
        detail: '17:00/18:00 Super Jet 或17:15 87次是待核候选，不能视为2027班次。买票前确认日期、外籍可售、车型、上下车点和抵达时刻。赶不上当日方案，改订后续合适服务并调整D49，不为赶夜车压缩取包和进站时间。',
        links: [source('Super Jet 官网', superJet), source('埃及国铁 ENR', enr)],
      },
    });
    setRows(48, d48.rows.filter(r => r.id !== 'd48r58-07'));
    d48.priority = '上午菲莱、高坝与方尖碑；13:30–15:00植物园岛含回岸，15:15取包，优先保住正式夜间交通。';
    d48.note = d48.priority;
    d48.extras = '<p>17:00/18:00 Super Jet 或17:15的87次都是待核候选。植物园只在能按时返岸、取包并抵达确认车站时执行。不能按候选钟点预设开罗到站。若最后改为次日ASW→CAI，另核住宿、机票与D49删减。</p>';
    d48.transportPlan = [
      {...d48.transportPlan[0], service: '夜巴候选，17:00/18:00尚未核实为2027可购班次', departure: '傍晚候选 · 以票面为准', arrival: '次日 · 车站与钟点待核', url: superJet, status: '待购'},
      {id: 'v26-aswan-cairo-rail', route: 'Aswan → Cairo', operator: 'Egyptian National Railways（ENR）', service: '87次候选，17:15发车尚未核实为2027可购班次', departure: '傍晚候选 · 以票面为准', arrival: '次日 · 车站与钟点待核', url: enr, status: '待购'},
    ];
    budget(48, '植物园岛往返船价与入园费用分别确认；Super Jet 或国铁只选一项计价，按正式出票的含行李总额记。');

    const d53 = day(53);
    updateRows(53, {
      'd53r58-01': {place: 'stay-cairo'},
      'd53r58-05': {
        time: '09:45–11:45', detail: '优先阶梯金字塔和已确认开放、已买相应票的内容。11:45前离开，给午餐、南郊进城与下午入场留余量。若上午延误优先缩短萨卡拉支线。',
      },
      'd53r58-06': {time: '11:45–12:15'},
      'd53r58-07': {
        time: '12:15–13:30', title: '萨卡拉→埃及文明国家博物馆 NMEC', place: 'rev58-d53-9',
        detail: '南郊车辆先直达NMEC，不先进科普特老城。目标13:15左右到馆，给午间车流与进馆留到13:30的弹性。',
      },
      'd53r58-10': {
        time: '13:30–15:00',
        detail: '先看皇家木乃伊展厅和主展厅。馆方目前平日09:00–17:00、16:00截止入场；若还想进悬空教堂，15:00前出馆。外籍票参考普通550 EGP、符合资格学生300 EGP。',
        links: [source('NMEC 开放时间', nmecHours), source('NMEC 官方门票', nmecTickets)],
      },
      'd53r58-09': {
        time: '15:00–15:25', title: 'NMEC→科普特老城', place: 'rev58-d53-7',
        detail: '乘车去科普特老城。想进悬空教堂应在16:00前提前抵达；车流延误就保留NMEC并改走仍能通行的街区外景。',
      },
      'd53r58-08': {
        time: '15:25–17:15 · 先核开门', title: '科普特老城：悬空教堂优先，晚段看外景',
        detail: '文物部目前列悬空教堂16:00关闭，先看教堂；可考虑科普特博物馆（现行16:00票窗截止、17:00闭馆），但以当天可进时间择一。16:00后只逛可通行的公共街段和巴比伦要塞外景。',
        links: [source('悬空教堂开放时间', hangingChurch), source('科普特博物馆开放时间', copticMuseum)],
      },
      'd53-dinner-transfer-v17': {time: '17:15–17:45', title: '科普特老城→开罗市中心餐店'},
      'd53r58-11': {time: '17:45–18:45'},
      'd53r58-12': {time: '18:45–20:30'},
    });
    const d53Rows = new Map(d53.rows.map(r => [r.id, r]));
    setRows(53, ['d53r58-01','d53r58-02','d53r58-03','d53r58-04','d53r58-05','d53r58-06','d53r58-07','d53r58-10','d53r58-09','d53r58-08','d53-dinner-transfer-v17','d53r58-11','d53r58-12'].map(id => d53Rows.get(id)));
    d53.label = '达舒尔·萨卡拉·文明馆·科普特';
    d53.priority = '南郊午前结束，先入NMEC，15:00转场，优先赶16:00关闭的悬空教堂。';
    d53.note = d53.priority;
    budget(53, 'NMEC外籍票参考550 EGP，符合学生资格300 EGP；科普特博物馆若选入内需另票。达舒尔、萨卡拉正票、附加区与车费分开核。');
  };
})();
