(() => {
  'use strict';
  const routeSample = 'https://12go.asia/en/van/marsa-matruh/siwa';
  const busSample = 'https://shaffl.com/bus/siwa-to-cairo';
  const siwaBus = 'https://siwabus.com/public/';
  const moonPhases = 'https://aa.usno.navy.mil/calculated/moon/phases?year=2027';
  const siwaSunset = 'https://aa.usno.navy.mil/api/rstt/oneday?date=2027-09-01&coords=29.2032,25.51965&tz=3';
  const localSafari = 'https://www.siwawi.com/en/prices';
  const lateReturnExample = 'https://mysimsem.com/experiences/siwa-oasis-3-days-2-nights-salt-lakes-safari-authentic-experiences/';
  const telescope = 'https://www.sunnyegypttravels.com/en/trips/siwa-stargazing-desert-night';
  const oracle = 'https://egymonuments.com/details/TempleofAghurmiinSiwa';
  const mountain = 'https://egymonuments.com/details/TombsofGabalal-Mawta';
  const church = 'https://egymonuments.gov.eg/en/monuments/the-hanging-church';
  const nmec = 'https://nmec.gov.eg/opening-hours/';
  const saqqara = 'https://egymonuments.gov.eg/en/archaeological-sites/saqqara/';
  const source = (label, url) => ({label, url});

  (window.TripItinerary27 ||= {}).egypt = ({D, day, row, place, setRows, meal, budget}) => {
    const cairoDinner = D.dining.meals.find(m => m.day === 53 && m.meal === '晚餐');
    const luggageRow = day(51).rows.findIndex(r => r.id === 'd51r58-01');
    day(51).rows[luggageRow] = row(51, 'd51r58-01', {
      detail: '先和开罗同一家青旅确认 8/30 退房后可寄存 50L 主包 3 天，9/2（D54）早晨可取。问清费用、取包时间与凭证。D51–D53 仅背 10L 小包，备三晚换洗、常用药、水和充电用品，护照、现金等贵重物随身。',
      highlight: true,
    });
    const prepareRow = day(51).rows.findIndex(r => r.id === 'd51r58-11');
    day(51).rows[prepareRow] = row(51, 'd51r58-11', {
      detail: '马特鲁入住后复核次日赴锡瓦的实际票面与上车点，按车票倒推海岸游览和送站最迟时间。司机报价确认整车总价、早到和直送实际乘车点；仅携 10L 小包。',
    });

    const labelDay = (n, name, city, extra) => Object.assign(day(n), {
      label:name, title:name, name, city, defaultCity:city, country:'埃及', countryCode:'EG', timezone:'Africa/Cairo',
      transportStatus:'待核 / 待订', flightStatus:null, scheduleBasis:'当地建议时段，未购交通按确认后的车票或团单',
      ...extra,
    });
    labelDay(52, '马特鲁果冻海→锡瓦·新月观星', '马特鲁', {
      requiresBookingTime:true,
      priority:'先锁能在 15:00–15:30 抵锡瓦的车，再决定马特鲁海滩。确认 4×4 在 21:15 后离开观星点。',
      note:'锡瓦镇住一晚。住宿与本地晚返 4×4 拼车合计预留 ¥420，目标 ¥360。城际车与马特鲁西岸车另算。',
      extras:'<p>主线争取约 17:30 随 4×4 进沙漠，看日落、晚餐并在暗处观星，目标 22:30–23:30 送回镇上。订前确认拼车人数、成团条件、出发点、许可与餐饮接送是否含在总价、离开观星点时刻，以及住宿能否晚归。8/31 新月为埃及当地 20:41。活动效果按现场云量、风沙调整。</p><p>单人拼不到晚返 4×4 时，改询 Sunny Egypt 约两小时望远镜观星，$25 起，带镇上接送，按指定日期和人数核实；只选一项观星活动计费。</p>',
      transportPlan:[{id:'v27-matrouh-siwa', route:'马特鲁 → 锡瓦', operator:'On Time Shuttle / 本地正规直达车', service:'11:00→15:00 是现行平台班次样例，2027 未出票；按实际票面确定接送地点', departure:'约 11:00 · 选班目标', arrival:'约 15:00 · 目标', url:routeSample, status:'待购'}],
    });
    const safari = place(52, 'v27-siwa-great-sand-sea', {
      name:'锡瓦大沙海 4×4 观星点待核', city:'锡瓦', kind:'sight',
      query:'Great Sand Sea Safari Siwa Oasis Egypt',
      address:'运营方回传实际集合点和观星点后按团单导航，当前仅提供名称搜索',
    });
    setRows(52, [
      row(52,'d52r58-01',{time:'06:30–07:15',title:'马特鲁退房、轻装上车',place:'stay-matrouh',detail:'只有 10L 小包，50L 主包留在开罗青旅寄存至 D54。先核赴锡瓦正式票面和集合点，按车票定海岸停留。'}),
      row(52,'d52r58-02',{time:'07:15–08:00',title:'艳后浴池与海蚀岩岸',detail:'海岸只预留一次停留。若锡瓦车偏早，马特鲁只保留艳后浴池的短停，迟到会误车时直接去上车点。'}),
      row(52,'d52r58-04',{time:'08:00–09:25 · 车辆与后续车票允许才走',title:'阿吉巴悬崖海滩 · 可选',detail:'包括从艳后浴池过去的车程。能在 09:25 前从阿吉巴返城才加此站；海岸延误、早班出票或道路拥堵时跳过。实际门票与下海条件现场核。'}),
      row(52,'d52r58-09',{time:'09:25–11:00 · 以票面倒排',title:'回城直达票面上车点，备午餐与水',place:null,detail:'给阿吉巴回城留约 30–60 分钟，按运营方要求提前报到。请司机明确送实际车站或约定上车点。午餐用可带走的简餐。',links:[source('马特鲁→锡瓦售票样例',routeSample)]}),
      row(52,'d52r58-10',{time:'11:00–15:00 · 选班样例',title:'马特鲁→锡瓦直达车',place:null,detail:'优先选票面约 15:00 抵达的固定车，15:30 前抵镇再排半日团。现行平台 11:00→15:00 仅为样例；人满发车需要多留余量，不能用 4×4 的时间倒推为固定发车。',links:[source('车型与售票入口',routeSample)],highlight:true}),
      row(52,'v27-d52-checkin',{time:'15:00–16:30 · 依到站',title:'锡瓦镇先入住、放小包与补水',place:'stay-siwa',detail:'选镇内可确认空调和晚归门禁的候选，先办理入住再去集合。延误时先告知团方，以其确认的晚接或短观星项目衔接。'}),
      row(52,'v27-d52-safari',{time:'17:30–23:30 · 成团后核时间',title:'本地晚返 4×4：冲沙、日落、晚餐与新月观星',place:safari,detail:'提前请青旅或持牌运营方确认散拼名额和含许可、晚餐、回镇接送的总价，约好 21:15 后才离开暗处观星点，目标 22:30–23:30 回锡瓦镇。20:41 为新月时刻，观星按天够黑与现场条件；普通日落半日团及多日样例都不能当作晚返报价。',links:[source('Siwawi 普通半日团参考',localSafari),source('晚返安排样例 · 多日行程',lateReturnExample),source('美国海军天文台新月数据',moonPhases)],highlight:true}),
      row(52,'v27-d52-solo-stargazing',{time:'单人备选 · 与 4×4 二选一',title:'Sunny Egypt 两小时望远镜观星',detail:'独行拼不到晚返 4×4 时，先问 8/31 单人能否成行、接车时间和总价。项目 $25 起，约两小时，商品列锡瓦镇住宿接送、向导与望远镜，实际价格和时间须运营方确认。',links:[source('Sunny Egypt 单人备选询价',telescope)]}),
      row(52,'v27-d52-return',{time:'22:30–23:30 · 主线回镇窗口',title:'送回锡瓦镇住宿，夜间洗澡休息',place:'stay-siwa',detail:'通过团方原车回镇，入住时已核晚归门禁和热水。D53 退房前安排小包寄存，傍晚取包去夜巴。'}),
    ]);
    meal(52,'午餐',null);
    meal(52,'晚餐',null);
    budget(52,'¥420 预留，¥360 目标。合计锡瓦镇一晚空调住宿及一人份本地晚返 4×4 拼车，按含许可、晚餐和送回住宿的全价比较。城际交通、马特鲁西岸用车与海滩费用另计。未拼成时，Sunny Egypt 两小时望远镜观星 $25 起，按单人结算另核，与 4×4 二选一。');

    labelDay(53, '锡瓦盐湖·古堡·Fatnas→开罗夜巴', '锡瓦', {
      requiresBookingTime:true,
      priority:'早上盐湖和温泉，下午先遗迹再去 Fatnas。买到合适的晚班才等 19:40 日落。',
      note:'只在锡瓦寄存 10L 小包；傍晚取回并乘夜巴。50L 主包留在开罗青旅，D54 早取。',
      lodging:'锡瓦→开罗夜巴 · 以出票为准',
      extras:'<p>若车票 19:30 或 20:00 发车，把 Fatnas 放在下午。回镇后留取包、简餐和提前到站时间。日落与上车冲突时先保住夜巴。</p>',
      transportPlan:[{id:'v27-siwa-cairo', route:'锡瓦 → 开罗', operator:'West & Middle Delta / Siwa Bus', service:'19:30 或 20:00 现行样例；跨夜，约 8–10 小时，2027 未出票', departure:'19:30 或 20:00 · 按正式票面', arrival:'9/2 早晨 · 按实际到站', url:busSample, status:'待购'}],
    });
    const pin = (id, name, query, lat, lng, osm, address, kind='sight') => place(53,id,{
      name,query,lat,lng,kind,address,coordinateSource:'https://www.openstreetmap.org/'+osm,
    });
    const salt = pin('v27-siwa-salt-pool','锡瓦东侧盐池候选','Siwa Salt Pools near Aghurmi Siwa',29.203957,25.6147217,'node/9276239217','OSM 已标注一处盐池信息点，采盐区开放水池与车辆入口当天由司机确认');
    const spring = pin('v27-siwa-cleopatra','锡瓦克利奥帕特拉温泉','Cleopatra Spring Siwa Egypt',29.196957,25.5501014,'node/1894542597','Gabal el-Dakrour 一带');
    const temple = pin('v27-siwa-oracle','阿蒙神谕神庙入口','Temple of the Oracle of Amun Aghurmi Siwa Egypt',29.2048989,25.5446872,'node/10207281117','Aghurmi，按现场正式售票入口');
    const tombs = pin('v27-siwa-tombs','锡瓦亡者之山','Mountain of the Dead Gabal al Mawta Siwa Egypt',29.2112889,25.524822,'node/9586448317','锡瓦镇北缘，按开放墓室参观');
    const shali = pin('v27-siwa-shali','沙利古堡','Fortress of Shali Siwa Egypt',29.2013166,25.5177266,'way/179115007','锡瓦镇中心，遗址轮廓内参考点');
    const fatnas = pin('v27-siwa-fatnas','脂肪岛 Fatnas','Fatnas Island Siwa Egypt',29.1925543,25.4793782,'node/1894542335','锡瓦镇西侧，景区入场与岸边通行按现场');
    const westDelta = pin('v27-siwa-west-delta','锡瓦 West & Middle Delta 车站','West and Middle Delta Bus Station Siwa Egypt',29.2050468,25.519015,'way/1149162496','仅适用于此运营方，按实际出票站点核对','station');
    const alternateBusMap = source('Siwa Bus 镇内站点 · 以票面为准','https://www.openstreetmap.org/node/13394368701');
    setRows(53,[
      row(53,'v27-d53-breakfast',{time:'08:00–08:45',title:'早餐、退房与寄存 10L 小包',place:'stay-siwa',detail:'和前台确认傍晚取包时间及寄存收费，记录夜巴上车点和要求提前到站时间。'}),
      row(53,'v27-d53-salt-tour',{time:'08:45–10:30',title:'锡瓦盐湖漂浮',place:salt,detail:'按司机确认的可用盐池与入口。带淡水冲洗和护目镜；有伤口时留岸上避开盐水。'}),
      row(53,'v27-d53-cleopatra',{time:'10:45–11:45',title:'克利奥帕特拉温泉池',place:spring,detail:'从盐湖回镇的途中停温泉，入水及活动按现场管理。'}),
      row(53,'v27-d53-lunch',{time:'12:00–14:00',title:'回镇午餐、补水与室内避暑',place:null,detail:'就近用餐；按气温安排有遮阴或空调的场所，水和夜巴便餐提前准备。'}),
      row(53,'v27-d53-oracle',{time:'14:15–15:00',title:'阿蒙神谕神庙',place:temple,detail:'按官方开放与停止入场时间排在下午靠前。当前外国成人票 120 EGP，符合资格的学生 60 EGP，2027 行前重查。',links:[source('神谕神庙官方售票',oracle)]}),
      row(53,'v27-d53-tombs',{time:'15:20–16:05',title:'亡者之山与开放古墓',place:tombs,detail:'先看有开放、时段允许的古墓。当前外国成人票 120 EGP，符合资格的学生 60 EGP。按馆方票面核末入场。',links:[source('亡者之山官方售票',mountain)]}),
      row(53,'v27-d53-shali',{time:'16:15–16:50',title:'沙利古堡短停',place:shali,detail:'优先走步行方便的开放街段；日间行程超时就缩短。'}),
      row(53,'v27-d53-fatnas',{time:'17:00–17:45 · 以夜巴倒排',title:'Fatnas 脂肪岛 · 下午走',place:fatnas,detail:'锡瓦当地日落参考 19:40，19:30 或 20:00 夜巴均应提前离开。只有另买到更晚班次、回镇取包与候车时间都留足时才等日落。',links:[source('美国海军天文台 · 锡瓦日落',siwaSunset)],highlight:true}),
      row(53,'v27-d53-pick-bag',{time:'18:00–18:35 · 以票面倒排',title:'回镇取 10L 小包与车上简餐',place:'stay-siwa',detail:'带水和能上车吃的晚餐。必要时提早离开 Fatnas，给回镇交通与取包留出时间。'}),
      row(53,'v27-d53-station',{time:'18:45 · 19:30 车次的到站目标',title:'按票面到锡瓦夜巴站候车',place:westDelta,detail:'按运营方要求提前 45–60 分钟到上车点。地图标的是 West & Middle Delta 参考站；Siwa Bus 站另按票面和运营方核对。',links:[alternateBusMap,source('Siwa Bus 官方入口',siwaBus)]}),
      row(53,'v27-d53-night-bus',{time:'19:30 或 20:00 · 现行候选',title:'锡瓦→开罗夜巴',detail:'West & Middle Delta 19:30 或 Siwa Bus 20:00 均为可查的现行班次例，2027 日期、车站和抵达时刻以最终购票为准。建议只用一段真正可出票的直达夜巴，并留次日接驳余量。',links:[source('夜巴车次价位样例',busSample),source('Siwa Bus 官方入口',siwaBus)],highlight:true}),
    ]);
    meal(53,'晚餐',null);
    budget(53,'神谕神庙和亡者之山外籍普通票现行参考各 120 EGP，符合学生资格各 60 EGP。夜巴按实际售票含行李价计，近期车票样例 EGP 560–740；当地接驳、餐饮和盐湖费用另核。今夜在车上。');

    labelDay(54, '开罗收官·萨卡拉·悬空教堂·文明馆', '开罗', {
      requiresBookingTime:false,
      priority:'夜巴准点且 09:30 前出发才保留达舒尔与萨卡拉。下午先悬空教堂，再赶 NMEC 16:00 末入场。',
      note:'D54 早回开罗青旅取回寄存了 3 天的 50L 主包，晚间住开罗，留足 D55 EK928 前的缓冲。',
      extras:'<p>夜巴到站延误时直接压缩南郊。寄存与早晨取包按青旅确认；尚不能入住时先放包补给，晚间再办正式入住。南郊全天车应确认异地落客。下午先到悬空教堂，再进 NMEC。明早赴 CAI T2。</p>',
    });
    setRows(54,[
      row(54,'d53r58-01',{time:'05:00–07:30 · 随夜巴抵达顺延',title:'夜巴抵开罗，回原青旅取 50L 主包',place:'stay-cairo',detail:'按票面确认开罗到达站，再到同一家青旅凭寄存记录领取 8/30 留下的 50L 主包。早入住、早间冲澡与当日存包须预先问好；无法早入住时先把主包留前台再出门。',highlight:true}),
      row(54,'d53r58-02',{time:'07:30–09:00 · 依到站',title:'开罗市中心→南郊包车',place:null,detail:'09:30 前能从开罗出发且按路况可在中午离开南郊才尝试达舒尔＋萨卡拉。换乘和取包耗时较长时直接去萨卡拉；预先约司机向北返回科普特老城。'}),
      row(54,'d53r58-03',{time:'09:00–10:15 · 09:30 前已出发才走',title:'达舒尔红金字塔与弯曲金字塔 · 条件停留',place:'rev58-d53-3',detail:'早到首站才保留红金字塔和弯曲金字塔。时间有限就红金字塔优先；09:30 后才从开罗上车直接去萨卡拉。',links:[source('达舒尔官方资料','https://egymonuments.gov.eg/en/archaeological-sites/dahshur/')]}),
      row(54,'d53r58-05',{time:'10:30–12:00 · 按车况调整',title:'萨卡拉阶梯金字塔',place:'rev58-d53-4',detail:'核心是阶梯金字塔和正票进入的区域。附加票或支线有空才选，中午及时折返以保下午两处限时景点。',links:[source('萨卡拉开放及票务',saqqara)]}),
      row(54,'d53r58-06',{time:'12:00–12:30',title:'萨卡拉附近午餐',place:null,detail:'留就近简餐窗口。车到较晚时用可带走的便餐。'}),
      row(54,'d53r58-07',{time:'12:30–14:15 · 预计转场',title:'南郊→科普特老城',place:'rev58-d53-7',detail:'目标 14:15 前到科普特老城，给交通和步行安检留余量。南郊延误时直接去悬空教堂，必要时压缩其余点位。',highlight:true}),
      row(54,'d53r58-08',{time:'14:15–15:00',title:'科普特老城与悬空教堂',place:'rev58-d53-8',detail:'先参观悬空教堂，现行 16:00 关门，尽量 15:00 前入内；不临时增加其他馆，保留到 NMEC 的交通。',links:[source('悬空教堂官方开放时间',church)],highlight:true}),
      row(54,'d53r58-09',{time:'15:00–15:25 · 预计转场',title:'悬空教堂→埃及文明国家博物馆 NMEC',place:'rev58-d53-9',detail:'给车程、安检及购票留余量，目标 15:30 前进馆。馆方 16:00 停止入场。',links:[source('NMEC 官方开放时间',nmec)]}),
      row(54,'d53r58-10',{time:'15:25–17:00 · 16:00 末入场',title:'NMEC 皇家木乃伊与文明主展厅',place:'rev58-d53-9',detail:'现行平日 09:00–17:00，16:00 停止入场。先看皇家木乃伊与主展厅。外籍票目前参考普通 550 EGP、符合资格学生 300 EGP。',links:[source('NMEC 官方开放时间',nmec),source('NMEC 官方票务','https://egymonuments.com/nmec/tickets')],highlight:true}),
      row(54,'d53-dinner-transfer-v17',{time:'17:00–17:45 · 依车况',title:'文明馆→开罗市中心',detail:'留回老城区接驳时间，按实际到店时刻就近安排晚餐。'}),
      row(54,'d53r58-11',{time:'17:45–18:45',title:'晚餐：Koshary Abou Tarek · 市中心总店',detail:'就近晚餐，先确认实际到店时刻与营业。'}),
      row(54,'d53r58-12',{time:'18:45–20:00 · 看当天进度',title:'尼罗河晚景 · 可选',place:'rev58-d53-12',detail:'准时且体力允许时才去扎马雷克，看完回青旅。'}),
      row(54,'v27-d54-stay',{time:'20:00后',title:'开罗原青旅住一晚，确认次日送机',place:'stay-cairo',detail:'确认 9/3 EK928 航班和 CAI T2 送机安排，晚上备齐 50L 主包托运和次日随身用品。'}),
    ]);
    if (cairoDinner) meal(54,'晚餐',{...cairoDinner,note:'D54 文明馆后回市中心用餐；堵车或太晚就改青旅附近便餐。'});
    budget(54,'NMEC 外籍票现行参考 550 EGP，符合资格学生 300 EGP。达舒尔与萨卡拉门票、附加区和包车分别核。开罗住宿一晚按住宿页预算，早入住、冲澡与寄存若收费另核。');
  };
})();
