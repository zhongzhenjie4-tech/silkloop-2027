(function () {
  "use strict";

  (window.TripItinerary26 ||= {}).caucasusBalkans = function ({
    D, day, row, setRows, place, meal, budget, moveStay
  }) {
    const uzSchedule = "https://www.uzairways.com/en/schedule";
    const uzHistoric = "https://www.uzairways.com/en/press-center/news/uzbekistan-airways-increases-regular-flights-number-tashkent-baku";
    const ady = "https://ticket.ady.az/";
    const adyRestart = "https://economy.gov.az/en/post/3371/azerbaycan-respublikasi-ve-gurcustanin-birge-kommunikesi-18-may-2026-ci-il";
    const adyEntry = "https://www.migration.gov.az/en/news_detail/16833";
    const geInsurance = "https://geoconsul.gov.ge/en/entering-georgia";
    const azal = "https://www.azal.az/en/";
    const aliyev = "https://www.heydaraliyevcenter.az/";
    const gotrip = "https://gotrip.ge/";
    const geoMuseum = "https://museum.ge/index.php?lng=eng&m=318";
    const geoMuseumTickets = "https://museum.ge/index.php?lng=eng&m=319";
    const kazbegi = "https://www.getyourguide.com/tbilisi-l1379/from-tbilisi-to-kazbegi-ananuri-gudauri-gergeti-t573712/";
    const matenadaran = "https://matenadaran.am/en/matenadaran/museum-and-gallery/working-hours-and-tickets/";
    const yugoslavia = "https://muzej-jugoslavije.org/en/posetite-nas/";
    const tesla = "https://tesla-museum.org/en/visit/plan-your-visit/";
    const zfbh = "https://www.zfbh.ba/en/time-table/";
    const zfbhSeason = "https://www.zfbh.ba/en/sezonski-voz-sarajevo-ploce-sarajevo-od-26-juna-do-kraja-avgusta/";
    const cable = "https://zicara.ba/en/information/service-info";

    const link = (label, url) => ({ label, url });
    const pin = (n, id, name, query, city, lat, lng, osm, kind = "sight") => place(n, id, {
      name, query, city, kind, lat, lng,
      coordinateSource: `https://www.openstreetmap.org/${osm}`
    });
    const setDayRows = (n, rows) => setRows(n, rows.map(([id, fields]) => row(n, id, fields)));

    const aliyevPin = pin(14, "v26-aliyev-center", "盖达尔·阿利耶夫中心", "Heydar Aliyev Center, Baku", "巴库",
      40.39616, 49.87022, "node/3114746864");
    const hy755 = {
      id: "tas-gyd-hy755", route: "TAS → GYD", operator: "Uzbekistan Airways",
      service: "HY755 周六早班优先 · 待出票",
      departure: "07:35 TAS（航司历史早班参考，当日时刻待核）",
      arrival: "09:30 GYD（航司历史早班参考）",
      evidenceStatus: "2027-07-24 班次、航站楼及含托运实价待核",
      url: uzSchedule,
      sources: [link("官方时刻查询", uzSchedule), link("历史周末早班公告", uzHistoric)]
    };
    Object.assign(day(14), {
      priority: "优先买 HY755 早班直飞含托运。落地后走巴库老城、阿利耶夫中心与海滨。",
      note: "07:35→09:30 是航司曾公开的周末早班参考。2027-07-24 具体时刻、航站楼及 50L 背包托运额度以出票页面为准。",
      extras: "以下景点时段按早班抵达编排。中午后落地则压缩老城内馆，仍有开馆窗口再进阿利耶夫中心，海滨可晚些走。",
      transportPlan: [hy755]
    });
    setDayRows(14, [
      ["d14v2-01", { time: "早班前 · 前夜备妥", title: "早餐简餐、退房与称包", detail: "前一晚收好国际段证件、50L 主包与随身小包。", place: null }],
      ["d14v2-02", { time: "起飞前约 3 小时到 TAS", title: "塔什干住宿 → TAS 国际航站楼", detail: "若订早班，前一晚约车，按票面核对航站楼。", place: "tashkent-airport" }],
      ["d14v2-03", { time: "起飞前", title: "值机、托运与出境", detail: "下单前核实托运行李额度和票面总价。", place: "tashkent-airport" }],
      ["d14v2-05", { time: "07:35 → 09:30 · 历史候选", title: "待购 HY755 · 塔什干 → 巴库直飞", detail: "两端为当地时间，塔什干 UTC+5，巴库 UTC+4。出行日的时刻和航站楼以票面为准。", place: "baku-airport", links: [link("航司时刻表", uzSchedule), link("周末早班历史公告", uzHistoric)], highlight: true }],
      ["d14v2-06", { time: "落地后约 60–90 分钟", title: "GYD 入境、提包与补给", detail: "从实际落地时间顺排后续活动。", place: "baku-airport" }],
      ["d14v2-07", { time: "入境后约 1 小时", title: "GYD → 巴库住宿附近", detail: "乘机场巴士或正规出租；入住房前先寄主包。", place: null }],
      ["d14v2-08", { time: "约 11:30–12:15 · 早班顺利时", title: "寄包和午餐", detail: "午饭选择老城或喷泉广场附近，随后步行游老城。", place: "icherisheher" }],
      ["v26-d14-old-town", { time: "12:15–14:00", title: "巴库老城、少女塔与希尔万沙宫", detail: "少女塔先看外景，宫殿有完整参观时间再入内。", place: "maiden-tower" }],
      ["v26-d14-palace", { time: "老城步行段", title: "希尔万沙宫", detail: "与老城安排在同一段。", place: "shirvanshah" }],
      ["v26-d14-aliyev", { time: "14:45–16:45 · 早班顺利时", title: "盖达尔·阿利耶夫中心", detail: "先走建筑外广场。进馆时核票价、特别展和最后入场时间，临近闭馆时留外观即可。", place: aliyevPin, links: [link("场馆官网", aliyev)] }],
      ["d14v2-10", { time: "17:45–18:45", title: "晚餐：Firuzə Restaurant · 喷泉广场店", detail: "下馆预留充足步行时间，若落地延误可在住宿附近吃。" }],
      ["d14v2-09", { time: "19:00–20:30", title: "里海海滨大道晚景", detail: "散步后返回住宿，确认次日小团返城时间。", place: "baku-boulevard" }],
      ["d14-return-v17", { time: "20:30 后", title: "回宿与确认戈布斯坦接送", detail: "确认次日退房寄存和夜间交通衔接。", place: null }]
    ]);
    meal(14, "晚餐", { rowId: "d14v2-10", shop: "firuze-baku", backup: null, note: "喷泉广场先用晚餐，步行去海滨。若航班晚到，可先在住宿附近简餐。" });
    budget(14, "HY755 单人含税含托运 ≤¥1,100 为目标，¥1,300 为现有比较上沿。阿利耶夫中心门票按 15–25 AZN 预留，展览价格看场馆。");

    const rail = {
      id: "baku-tbilisi-ady", route: "巴库 → 第比利斯",
      operator: "Azerbaijan Railways / ADY", service: "7/25 夜间卧铺候选 · 次晨抵达",
      departure: "7/25 巴库夜间 · 按票面",
      arrival: "7/26 第比利斯 · 按票面", dayOffset: 1,
      evidenceStatus: "2026-05 官方确认恢复。2027-07-25 车次、过境资格及车票待核。",
      sources: [link("ADY 购票", ady), link("两国铁路恢复联合公告", adyRestart), link("阿塞拜疆移民局过境说明", adyEntry)],
      notes: ["两地同为 UTC+4。确认中国普通护照可乘该车及实际过境安排，再买夜车票。无合适车票时改 GYD→TBS。"],
      url: ady
    };
    Object.assign(day(15), {
      label: "戈布斯坦·泥火山 → 第比利斯",
      title: "戈布斯坦岩画与泥火山，夜行第比利斯",
      name: "戈布斯坦·泥火山 → 第比利斯",
      priority: "选下午可回城的戈布斯坦团。夜车和晚班飞机二选一，凭实际车票或机票排提包和送站。",
      note: "夜车 2026 年恢复，7/25 班次未出票。夜车无合适票可改当晚 GYD→TBS，按起飞至少提前三小时到机场，并另计第比利斯当晚住宿。若只有次晨机票，则留宿巴库，D16 走精简老城线。",
      extras: "下单前核实陆路客运资格和护照要求。保险从实际进入格鲁吉亚当日覆盖，若 7/25 晚入境则起保日改 7/25。",
      transportPlan: [rail]
    });
    setDayRows(15, [
      ["d15v2-01", { time: "07:00–07:45", title: "早餐、退房与寄存主包", detail: "预留回店取包时间，水与证件放随身包。", place: null }],
      ["d15v2-02", { time: "07:45–08:30", title: "赴小团约定集合点", detail: "以订单集合地址为准。", place: null }],
      ["d15v2-03", { time: "出发前", title: "核对团程与回城时间", detail: "优先只含戈布斯坦和泥火山的组合，先确认返城后能赶上已选交通。", place: null }],
      ["d15v2-04", {}], ["d15v2-05", {}], ["d15v2-06", {}], ["d15v2-07", {}],
      ["d15v2-08", {}], ["d15v2-09", {}],
      ["d15v2-10", { time: "14:50–16:00 · 目标返城窗", title: "泥火山 → 巴库、提包与补水", detail: "如晚班航班要求更早离开，改短团或缩短现场停留。", place: "icherisheher" }],
      ["d15v2-12", { time: "16:00–17:00 · 随夜间车票调整", title: "晚餐：Araz Terrace · İslam Səfərli 1 店", detail: "饭后取主包去车站或机场，时间紧时改随身简餐。" }],
      ["d15-evening-v17", { time: "按已选班次倒排", title: "夜车方案 · 取包后赴巴库火车站", detail: "仅在有票并核准通行条件时执行。备护照、车票以及覆盖实际入境日期的保险凭证。", place: "baku-station", links: [link("ADY 购票", ady), link("铁路过境说明", adyEntry), link("格鲁吉亚入境要求", geInsurance)], highlight: true }],
      ["d15-return-v17", { time: "7/25 晚 · 夜车或飞机二选一", title: "沿实际票面前往第比利斯", detail: "夜车按车票办理跨境手续。改飞时，按机场要求提前到 GYD，安排 TBS 晚到接驳及落地住宿。若只能 7/26 出发，当晚留宿巴库。", place: null, links: [link("ADY 夜车", ady), link("AZAL 航班", azal)] }]
    ]);
    meal(15, "晚餐", { rowId: "d15v2-12", shop: "baku-araz-terrace-islam1", backup: "firuze-baku", note: "戈布斯坦小团返城后按出发时间安排。接近出发时间就吃随身简餐。" });
    budget(15, "戈布斯坦与泥火山核实团费、门票和接驳是否全含。夜车与机票只计实际使用的一项，改飞另计机场接驳、托运及可能新增住宿。");

    const ge = day(17);
    Object.assign(day(16), {
      label: "第比利斯·老城与圣三一",
      title: "第比利斯老城、硫磺浴区与圣三一大教堂",
      name: "第比利斯·老城与圣三一",
      country: ge.country, countryCode: ge.countryCode, timezone: ge.timezone,
      city: ge.city, defaultCity: ge.defaultCity, accent: ge.accent,
      priority: "抵达寄包后走老城、和平桥、纳里卡拉、浴区与圣三一。先确认要塞与缆车当天开放。",
      note: "夜车次晨到站，晚班飞机方案可能已在第比利斯入住。若 7/26 午后才到，优先和平桥、硫磺浴区与古城晚餐。",
      extras: "周一安排市区步行与外观。若纳里卡拉入口施工或缆车停运，就在老城低处步行和观景。",
      scheduleBasis: "当地时间、按抵达时间顺延",
      transportPlan: []
    });
    moveStay(15, 16, "tbilisi");

    const baths = pin(16, "v26-abanotubani", "阿巴诺图巴尼硫磺浴区", "Abanotubani, Tbilisi", "第比利斯",
      41.68765, 44.81148, "relation/2073134");
    setDayRows(16, [
      ["v26-d16-train-arrival", { time: "次晨 · 夜车方案", title: "夜车抵第比利斯中央站", detail: "夜车实际到站时间按车票；飞机方案走机场接驳。", place: "tbilisi-station" }],
      ["d16v2-01", { time: "上午 · 按交通票面", title: "到青旅寄存主包", detail: "从中央站去青旅。若前日晚飞抵且已入住，从住处开始。若本日飞抵，从 TBS 出机场后顺延。", place: "stay-tbilisi", links: [link("备选：TBS 机场地图", "https://www.openstreetmap.org/node/1704092908")] }],
      ["d16v2-02", { time: "抵达后可用时间", title: "老城入口与梅特希河岸", detail: "若坐车晚到，直接从和平桥开始。", place: "tbilisi-oldtown", links: [] }],
      ["d16v2-03", { time: "11:00–12:00 · 示例", title: "和平桥与 Rike 公园", detail: "走人行桥看库拉河两岸。", place: "peace-bridge", links: [] }],
      ["d16v2-08", { time: "12:00–13:00", title: "老城午餐与补水", detail: "按抵达实际时间，老城就近用餐。", place: null, links: [] }],
      ["d16v2-05", { time: "13:00–14:30", title: "纳里卡拉要塞与高处观景", detail: "根据缆车和施工开放情况选择步道。要塞入口关闭时，可走已开放的观景步道或继续低处浴区。", place: "narikala", links: [] }],
      ["d16v2-07", { time: "14:30–15:30", title: "硫磺浴区与砖拱外景", detail: "浏览浴区巷道，想泡浴可另约；游览窗口内优先外观。", place: baths, links: [] }],
      ["d16v2-09", { time: "16:15–17:30", title: "第比利斯圣三一大教堂", detail: "傍晚视抵达和体力调整。进入宗教场所有着装要求。", place: "rev58-d17-7", links: [] }],
      ["d16v2-10", { time: "18:00–19:00", title: "晚餐：Maspindzelo · Gorgasali 老城店", detail: "可从圣三一搭车或步行返回老城再用餐。", place: "tbilisi-oldtown", links: [] }],
      ["d16v2-11", { time: "19:30 后", title: "回宿与确认明日包车", detail: "核往返总费、出发点、中途停靠与预计返城时间。", place: "stay-tbilisi", links: [] }]
    ]);
    meal(16, "午餐", null);
    meal(16, "晚餐", { rowId: "d16v2-10", shop: "maspindzelo-oldtown", backup: null, note: "大教堂下山后回老城吃饭，晚到就选青旅附近简餐。" });
    budget(16, "老城、浴区和教堂以步行／外观为主，缆车或泡浴按实际选择另计。D16 纳入第比利斯住宿。");

    const didgori = pin(17, "v26-didgori", "圣剑山 · 迪德戈里战役纪念碑", "Didgori Battle Memorial, Georgia", "迪德戈里",
      41.76036, 44.51081, "way/218872324");
    const svetitskhoveli = pin(17, "v26-mtskheta-svetitskhoveli", "姆茨赫塔生命之柱大教堂", "Svetitskhoveli Cathedral, Mtskheta", "姆茨赫塔",
      41.84227, 44.72099, "way/20593299");
    const jvari = pin(17, "v26-jvari", "季瓦里修道院", "Jvari Monastery, Mtskheta", "姆茨赫塔",
      41.83834, 44.73353, "relation/21668876");
    const chronicle = pin(17, "v26-georgia-chronicle", "格鲁吉亚编年史纪念碑", "Chronicle of Georgia, Tbilisi", "第比利斯",
      41.77067, 44.81040, "way/707446533");
    Object.assign(day(17), {
      label: "圣剑山·姆茨赫塔·编年史",
      title: "迪德戈里、姆茨赫塔与格鲁吉亚编年史",
      name: "圣剑山·姆茨赫塔·编年史",
      priority: "GoTrip 同一辆车串联圣剑山、姆茨赫塔、季瓦里和编年史。以司机报价为准，可自行找同伴分摊整车。",
      note: "若计划进国家博物馆，目标 16:30 抵馆，现行最后入场 17:30。预计晚回时留足山上行程，取消馆内参观。",
      extras: "发单前给司机四个完整停靠点，确认迪德戈里路况、等待时间、返城市中心以及整车费用。",
      scheduleBasis: "包车建议时段，按订单和路况",
      transportPlan: []
    });
    setDayRows(17, [
      ["d17r58-01", { time: "07:30–08:00", title: "早餐与 GoTrip 司机会合", detail: "确认车辆、停靠点和返城时间；有同伴再按人数分车费。", place: "stay-tbilisi", links: [link("GoTrip 预约", gotrip)] }],
      ["d17r58-02", { time: "08:00–10:30", title: "迪德戈里圣剑山与战役纪念碑", detail: "山顶留约 40 分钟。雨雾或接驳道路临时封闭时，调整参观顺序或由司机绕行。", place: didgori, links: [link("格鲁吉亚旅游局 · 迪德戈里", "https://georgia.travel/didgori-bike-tour")] }],
      ["d17r58-03", { time: "11:30–12:20", title: "姆茨赫塔老街与生命之柱大教堂", detail: "下车步行、参观教堂外观及开放区域。", place: svetitskhoveli, links: [] }],
      ["d17r58-06", { time: "12:20–13:15", title: "午餐 · 姆茨赫塔老城", detail: "就近吃饭，避免返回第比利斯后再折返。", place: null, links: [] }],
      ["v26-d17-jvari", { time: "13:35–14:15", title: "季瓦里修道院 Jvari", detail: "车辆送到山上，步行看两河交汇。", place: jvari, links: [link("格鲁吉亚旅游局 · Jvari", "https://georgia.travel/jvari-monastery")] }],
      ["v26-d17-chronicle", { time: "14:50–15:45", title: "格鲁吉亚编年史纪念碑", detail: "由纪念碑前台阶上行，再搭原车回市中心。", place: chronicle }],
      ["d17r58-05", { time: "16:30–18:00 · 能按时入馆再去", title: "格鲁吉亚国家博物馆 · Janashia 馆", detail: "按现行公告 17:30 停止入场，外国成人票 40 GEL。接近闭馆时优先晚餐。", place: "rev58-d17-5", links: [link("博物馆营业时间", geoMuseum), link("博物馆票价", geoMuseumTickets)] }],
      ["d17r58-04", { time: "返城后 · 按邮局营业", title: "罗斯塔韦利邮局寄明信片（可选）", detail: "若早回且邮局尚营业再寄；有冲突可选 D16 经过市区时办理。", place: "rev58-d17-4", links: [] }],
      ["d17r58-09", { time: "18:30–19:30 · 按返城调整", title: "晚餐 · 第比利斯老城", detail: "可就近选餐，结束后核明日拼团集合点。", place: "tbilisi-oldtown", links: [] }]
    ]);
    meal(17, "晚餐", { rowId: "d17r58-09", shop: "maspindzelo-oldtown", backup: null, note: "按实际返城和国家博物馆时间顺延，也可在市中心下车处就近吃。" });
    budget(17, "GoTrip 按整车含等待报价，已有同行再分摊。若进国家博物馆，外国成人现行参考 40 GEL。");

    const gudauri = pin(18, "v26-gudauri-friendship", "古多里俄格友谊纪念碑", "Russia–Georgia Friendship Monument, Gudauri", "古多里",
      42.49228, 44.45290, "relation/8379643");
    Object.assign(day(18), {
      priority: "拼团按订单集合。安纳努里、古多里纪念碑与 Gergeti 受当天道路和天气影响。",
      note: "核拼团日期、专车接驳费、午饭和沿线停靠；按订单确定实际发车和返城时刻。"
    });
    setDayRows(18, day(18).rows.map((existing) => {
      const changes = {
        "d18v2-02": { title: "住宿 → 订单指定集合点", detail: "按当日订单确认地点和到场时间。", place: null, links: [link("GetYourGuide 卡兹别克拼团", kazbegi)] },
        "d18v2-03": { detail: "确认当日军工大道通行和团内费用，问清 Gergeti 接驳是否另收费。", links: [link("活动与停靠信息", kazbegi)] },
        "d18v2-08": { title: "古多里俄格友谊纪念碑", detail: "团程如停靠则在纪念碑观景台短走，按导游指示集合。", place: gudauri },
        "d18v2-10": { detail: "按当天道路及拼团条款乘当地接驳，确认费用和上车点。" },
        "d18-return-v17": { place: null, detail: "返城范围与末次停靠顺序按订单和路况，若延误改用简餐。" }
      };
      return [existing.id, changes[existing.id] || {}];
    }));
    budget(18, "拼团对照订单总价，Gergeti 山路接驳、午饭和自选活动看包含项，拼团日期与费用均待确认。");

    const sevan = pin(21, "v26-sevanavank", "塞凡湖半岛 · 塞凡纳旺克修道院", "Sevanavank, Lake Sevan, Armenia", "塞凡湖",
      40.56398, 45.01081, "way/503179918");
    Object.assign(day(21), {
      label: "深坑修道院·古籍馆·塞凡湖",
      title: "深坑修道院、Matenadaran 和塞凡湖",
      name: "深坑修道院·古籍馆·塞凡湖",
      priority: "清早去深坑修道院，回城进古籍馆。下午往返塞凡湖，先确认返程再离城。",
      note: "上午建议预约深坑往返。塞凡湖优先确认往返拼车，北站小巴方案还要确认到半岛的最后一段与返程；缺任一段就改本地活动。",
      extras: "塞凡湖预留从修道院到车辆集合点的步行时间。目标 19:00 前回埃里温，19:30 后用于晚餐和收包，次日 14:20 从 EVN 搭已购 JU851。"
    });
    setDayRows(21, [
      ["d21v2-01", { time: "06:30–07:00", title: "早餐、证件与防晒", detail: "备水和白天两段郊外交通确认。", place: null }],
      ["d21v2-03", { time: "07:00–08:10 · 预约车", title: "埃里温 → Khor Virap 深坑修道院", detail: "预先确认司机等候与回送地点，尽量回送古籍馆附近。", place: "khor-virap" }],
      ["d21v2-04", { time: "08:10–09:00", title: "深坑修道院与亚拉拉特山方向观景", detail: "天气好时在外侧观景；计划 09:00 左右上车回城。", place: "khor-virap" }],
      ["d21v2-06", { time: "09:00–10:15 · 依路况", title: "深坑修道院 → Matenadaran", detail: "在博物馆入口下车，结束南郊行程。", place: "matenadaran" }],
      ["d21v2-09", { time: "10:15–11:45", title: "马特纳达兰古籍馆", detail: "官网当前周二至周六 10:00–17:50，成人 2,000 AMD。学生折扣有资格要求。", place: "matenadaran", links: [link("工作时间和票价", matenadaran)] }],
      ["d21v2-07", { time: "12:00–12:45", title: "午餐：Tun Lahmajo · Teryan 街店", detail: "午饭安排在返城进馆后、启程去塞凡湖前。", place: null }],
      ["d21v2-10", { time: "13:00–14:30 · 以接驳为准", title: "埃里温 → 塞凡湖半岛", detail: "优先预约门到门拼车往返；选北站小巴先确认抵达位置、去半岛接驳、回去的车站和班次。", place: sevan, highlight: true }],
      ["v26-d21-sevan", { time: "14:30–16:30", title: "塞凡纳旺克修道院与湖边步道", detail: "预留登台阶、湖边短走和回到车边的时间。", place: sevan }],
      ["v26-d21-sevan-return", { time: "16:30–19:00 · 依已约返程", title: "塞凡湖半岛 → 埃里温", detail: "优先兑现已约返程，目标 19:00 前回城。", place: null }],
      ["d21v2-11", { time: "19:00–20:00", title: "埃里温晚餐", detail: "回到住处附近用餐。", place: null }],
      ["d21-pack-v17", { time: "20:00 后", title: "核对 JU851 与次日机场接送", detail: "航班 8/1 14:20 EVN → 15:35 BEG，核登机凭证并收好主包。", place: null }],
      ["d21v2-12", {}]
    ]);
    meal(21, "午餐", { rowId: "d21v2-07", shop: "tun-lahmajo-yerevan", backup: "lahmajun-gaidz", note: "返城进馆后吃午餐，再北上塞凡湖；排队久就换简餐保接驳。" });
    budget(21, "古籍馆成人现行 2,000 AMD。深坑修道院接送与塞凡往返分别问价，北站小巴按全程交通费和返程可行性比较。");

    const begTheatre = pin(22, "v26-belgrade-theatre", "贝尔格莱德国家剧院", "National Theatre in Belgrade, Republic Square", "贝尔格莱德",
      44.81701, 20.46100, "way/39701812");
    setRows(22, [
      ...day(22).rows.map((existing) => existing.id === "d41r58-02"
        ? row(22, existing.id, { time: "19:30–20:45", title: "米哈伊洛大公街与共和国广场夜景" })
        : existing),
      row(22, "v26-d22-theatre", { time: "20:45 · 同一广场", title: "贝尔格莱德国家剧院外景", detail: "饭后步行到广场顺拍外立面，航班晚到则挪到 D24。", place: begTheatre })
    ]);
    setRows(24, day(24).rows.flatMap((existing) => existing.id === "d38v2-03" ? [
      row(24, existing.id, { time: "09:15–09:30", title: "共和国广场外观" }),
      row(24, "v26-d24-theatre", { time: "09:30–09:45", title: "贝尔格莱德国家剧院外景", detail: "剧院就在共和国广场边，可与国家博物馆同走。", place: begTheatre })
    ] : [existing]));

    const skadarlija = pin(25, "v26-skadarlija", "斯卡达利亚波西米亚街", "Skadarlija, Belgrade", "贝尔格莱德",
      44.81785, 20.46455, "node/12001055254");
    Object.assign(day(25), {
      label: "南斯拉夫历史·特斯拉·斯卡达利亚",
      title: "南斯拉夫历史博物馆、特斯拉博物馆与斯卡达利亚",
      name: "南斯拉夫历史·特斯拉·斯卡达利亚",
      priority: "上午南斯拉夫历史博物馆和花房，下午特斯拉博物馆，傍晚逛斯卡达利亚并用餐。",
      note: "特斯拉馆以定时导览入场，建议提早到馆。保留两馆完整窗口，不另排跨区往返。",
      extras: "花房当日若有局部展厅调整，照常参观园区开放展区。晚饭后核次日去萨拉热窝的汽车站、证件及车票。"
    });
    setDayRows(25, [
      ["d40v2-01", { time: "08:00–08:45", title: "早餐、证件与两馆开放确认", detail: "核花房动线及特斯拉英语导览场次。", place: null }],
      ["d40v2-02", { time: "09:00–10:00", title: "住处 → 南斯拉夫历史博物馆", detail: "先到博物馆园区入口。", place: "yugoslavia" }],
      ["d40v2-04", { time: "10:00–12:00", title: "南斯拉夫历史博物馆与花房", detail: "参观主展和花房；现行普通票 800 RSD。具体展览以现场开放为准。", place: "yugoslavia", links: [link("博物馆参观信息", yugoslavia)] }],
      ["d40v2-07", { time: "12:45–13:40", title: "午餐：Pizza Bucko · Francuska 18 店", detail: "回中心后吃饭。赶导览时可在特斯拉馆方向就近简餐。", place: null }],
      ["d40v2-08", { time: "14:15–14:45", title: "到特斯拉博物馆排队候场", detail: "提前到馆确认合适英语场次与容量。若满员，可等下一场。", place: "tesla", links: [link("场次和购票规则", tesla)] }],
      ["d40v2-09", { time: "15:00–16:00 · 视入场场次", title: "尼古拉·特斯拉博物馆英语导览", detail: "英语导览现行约 45 分钟、800 RSD，博物馆只收当地现金。", place: "tesla", links: [link("特斯拉馆官方信息", tesla)] }],
      ["d40v2-14", { time: "16:45–18:00", title: "斯卡达利亚波西米亚街散步", detail: "逛 Skadarska 石板街与咖啡馆外景，步行返回住处方向。", place: skadarlija }],
      ["d40v2-12", { time: "18:00–19:00", title: "晚餐 · 斯卡达利亚或邻近 Dorćol", detail: "可在石板街用餐，Walter Dorćol 作为近距离备选。", place: null }],
      ["d40v2-13", { time: "19:30 后", title: "回宿装包并核次日跨境大巴", detail: "核对车票所列出发车站与行李收费。", place: null }]
    ]);
    meal(25, "午餐", { rowId: "d40v2-07", shop: "bucko-francuska", backup: null, note: "上午参观花房后回中心吃，时间紧时在特斯拉馆方向就近解决。" });
    meal(25, "晚餐", { rowId: "d40v2-12", shop: "walter-dorcol", backup: null, note: "首选斯卡达利亚沿街晚餐，Walter Dorćol 是步行备选。" });
    budget(25, "两馆现行普通票合计 1,600 RSD（各 800 RSD），导览或学生票看各馆条件。斯卡达利亚晚餐仍用当天餐饮预算。");

    const sjjTheatre = pin(27, "v26-sarajevo-theatre", "萨拉热窝国家剧院", "National Theatre Sarajevo, Obala Kulina bana", "萨拉热窝",
      43.85687, 18.42073, "way/125300384");
    const cableBase = pin(27, "v26-trebevic-cable-base", "特雷贝维奇缆车下站", "Sarajevska žičara donja stanica, Sarajevo", "萨拉热窝",
      43.85549, 18.43509, "way/566725860", "station");
    const bobTrack = pin(27, "v26-trebevic-bobsleigh", "1984 冬奥雪橇赛道", "Olimpijska bob staza Trebević, Sarajevo", "萨拉热窝",
      43.84110, 18.44229, "relation/5926966");
    Object.assign(day(27), {
      label: "萨拉热窝·冬奥赛道与购票",
      title: "萨拉热窝国家剧院、特雷贝维奇与莫斯塔尔购票",
      name: "萨拉热窝·冬奥赛道与购票",
      priority: "第一件事：周五白天去萨拉热窝火车站确认并落实 8/7 去、回两张票。07:15 只作 2026 夏季历史参考。",
      note: "如 2027 班表、停站或可售票任一项不确定，锁定正规巴士往返。行前先看线上是否开放销售，窗口是现场补办入口。",
      extras: "缆车末班与山上路线按当日情况，赛道走开放段。剧院仅拍外景，黄堡放到有余量的傍晚。"
    });
    setDayRows(27, [
      ["d35v2-10", { time: "08:30–09:30 · 先办", title: "优先落实 D28 莫斯塔尔往返票", detail: "到萨拉热窝火车站核周六去、回班次、停靠、窗口销售与两张车票。07:15 为 2026 夏季历史去程参考。回程不明确时，当场切换到正规巴士双程。", place: "sarajevo-station", links: [link("ŽFBH 官方时刻表", zfbh), link("2026 季节列车历史公告", zfbhSeason)], highlight: true }],
      ["d35v2-01", { time: "购票前后 · 车站附近", title: "早餐、证件与饮水", detail: "早餐选顺路的简餐，携护照核实名购票要求。", place: null }],
      ["v26-d27-theatre", { time: "10:00–10:25", title: "萨拉热窝国家剧院与河边外观", detail: "在 Obala Kulina bana 顺路拍照，再沿河去拉丁桥。", place: sjjTheatre }],
      ["d35v2-03", { time: "10:30–11:00", title: "拉丁桥与河岸外观" }],
      ["d35v2-05", { time: "11:00–11:45", title: "Baščaršija 老城街巷" }],
      ["d35v2-06", { time: "11:45–12:30", title: "午餐：Ferhatović Petica · Bravadžiluk 21" }],
      ["d35v2-07", { time: "12:30–13:15 · 开放且顺路", title: "战争童年博物馆（可选）", detail: "如上午购票耗时，直接前往缆车。", place: null }],
      ["v26-d27-cable", { time: "13:15–14:00", title: "特雷贝维奇缆车上山", detail: "上下行和营业时段有季节差异。上山前问清末班，先留足下行余量。", place: cableBase, links: [link("萨拉热窝缆车运营方", cable)] }],
      ["v26-d27-bob", { time: "14:00–15:50", title: "1984 冬奥雪橇赛道与山上观景", detail: "从缆车上站沿标示开放路径走赛道涂鸦段，留足步行返站时间。", place: bobTrack }],
      ["v26-d27-cable-return", { time: "15:50–16:30", title: "乘缆车返老城", detail: "按当日末班往前留空；下山后直接走晚餐或黄堡。", place: cableBase }],
      ["d35v2-12", { time: "17:45–19:00 · 有余量再去", title: "黄堡城市全景（可选）", detail: "下午晚返就去老城吃饭。", place: "yellow-fortress" }],
      ["d35v2-13", { time: "19:00–20:00", title: "晚餐：Ćevabdžinica Željo · Kundurdžiluk 19" }],
      ["d35v2-14", { time: "20:00 后", title: "回宿、保存 D28 双程票", detail: "核车站、出发钟点和候车提前量，设置闹钟。", place: null }]
    ]);
    meal(27, "午餐", { rowId: "d35v2-06", shop: "petica-sarajevo", backup: "zeljo-sarajevo", note: "车站购票和河畔步行结束后到老城午餐。" });
    meal(27, "晚餐", { rowId: "d35v2-13", shop: "zeljo-sarajevo", backup: "petica-sarajevo", note: "缆车回老城后用餐，黄堡有余量再去。" });
    budget(27, "剧院按免费外景计划。缆车按一人往返票预算，现场票价以运营方为准。D28 往返交通购票可在本日办。");

    const mostar = {
      id: "sw19-sarajevo-mostar", route: "Sarajevo ↔ Mostar", operator: "ŽFBH / 正规巴士备选",
      service: "去回双票按 2027 班表；07:15 为 2026 夏季去程参考",
      departure: "去程及上车站按购票结果",
      arrival: "回程及下车站按购票结果",
      evidenceStatus: "2027-08-07 班次、去回停靠与售票待核；回程优先于 Blagaj。",
      url: zfbh, sources: [link("ŽFBH 时刻表", zfbh), link("2026 季节铁路历史公告", zfbhSeason)]
    };
    Object.assign(day(28), {
      priority: "按 D27 落实的双程票出发。先保返萨拉热窝，再按窗口选 Blagaj。",
      note: "ŽFBH 2026 年有周末 07:15 季节去程。2027-08-07 时间、停站、回程与售票另查，以实际双票为准。",
      extras: "火车买不齐则切换正规巴士往返。Blagaj 只在核妥回程并订好往返接驳后执行，需至少提前 45 分钟回到返程车站。",
      transportPlan: [mostar]
    });
    setDayRows(28, [
      ["d36r58-01", { time: "已订班次前 45–60 分钟", title: "早餐与出发站候车", detail: "火车与备用巴士按各自票面站点导航。", place: "sarajevo-station" }],
      ["d36r58-02", { time: "早班 · 以票面为准", title: "萨拉热窝 → 莫斯塔尔", detail: "有可执行双票时乘 Neretva 风景铁路；否则用预定正规巴士。07:15 只是旧季节班参考。", place: "rev58-d36-2", links: [link("铁路时刻表", zfbh)], highlight: true }],
      ["d36r58-03", { time: "抵达后约 1.5 小时" }],
      ["d36r58-04", { time: "上午 · 依开放时间" }],
      ["d36r58-05", { time: "约 12:00–13:00" }],
      ["d36r58-06", { time: "午后 · 仅返程留足时", detail: "事先谈定往返车费、等候与回到车站时间。接驳未落实则继续在莫斯塔尔老城。" }],
      ["d36r58-07", { time: "往返接驳确认后" }],
      ["d36r58-08", { time: "返程发车至少提前 45 分钟", title: "回返程车站并取水", detail: "按票面确认莫斯塔尔火车站或巴士站。", place: "rev58-d36-2" }],
      ["d36r58-09", { time: "发车前 · 按票面", detail: "查站台或巴士泊位，再买简餐。" }],
      ["d36r58-10", { time: "按正式返程票", title: "莫斯塔尔 → 萨拉热窝，当晚回宿", detail: "抵达后取寄存物并准备 D29 已购 PC292 早间值机。", place: "sarajevo-station" }]
    ]);
    budget(28, "铁路与巴士按实际双程票比较，Blagaj 拼车仅在决定去时计往返价。优先锁住当晚回萨拉热窝。");

    const references = D.transportReferences.filter(({ id }) =>
      ![hy755.id, rail.id, mostar.id].includes(id)
    );
    for (const [n, transport] of [[14, hy755], [15, rail], [28, mostar]]) {
      references.push({ ...transport, dayId: day(n).id, date: day(n).date });
    }
    D.transportReferences = references.sort((a, b) => a.date.localeCompare(b.date));

    const bookingLabels = {
      "baku-tbilisi": "待核 / 待订：7/25 巴库 → 第比利斯夜车，备选 GYD→TBS",
      "mostar-return-reverse19": "待核 / 待订：D27 优先落实 8/7 萨拉热窝 ↔ 莫斯塔尔双程，正规巴士备选"
    };
    for (const booking of D.bookings) {
      if (bookingLabels[booking.id]) booking.label = bookingLabels[booking.id];
    }
    const transitGuide = D.guides.find(({ id }) => id === "transit");
    transitGuide.html = transitGuide.html.replace(
      "7/26巴库→第比利斯夜车、7/29赴埃里温，当前恢复信息不等于2027已买到车票。",
      "7/25 巴库→第比利斯夜车待核、GYD→TBS 为备选，7/29 赴埃里温。2027-07-25 班次与过境条件以官方和实际票面为准。"
    );
  };
}());
