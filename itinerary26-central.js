(function () {
  'use strict';

  (window.TripItinerary26 ||= {}).central = function ({ D, day, row, setRows, place, meal, budget }) {
    const fourStopTour = { label: 'GetYourGuide 四景团', url: 'https://www.getyourguide.com/almaty-city-l1414/classic-almaty-kolsay-kaindy-lakes-charyn-canyon-day-trip-t810106/' };
    const localTour = { label: 'MORN 团程与费用', url: 'https://morn.kz/tours/charyn-kolsai-kaindy/' };
    const officialRail = { label: '乌兹别克斯坦铁路购票', url: 'https://eticket.railway.uz/en/home' };
    const railNotice = { label: '铁路客运现行预售说明', url: 'https://t.me/s/uzrailways_uz/13035' };
    const temuridHours = { label: '塔什干官方旅游开放信息', url: 'https://visit.tashkent.uz/en/about-city/' };
    const historyMuseum = { label: '国家历史博物馆开放与票价', url: 'https://history-museum.uz/site/contacts' };
    const museumReopening = { label: '旅游委员会重开公告', url: 'https://gov.uz/en/uzbektourism/news/view/197142' };
    const observatoryMuseum = { label: '撒马尔罕博物馆官网', url: 'https://samarkandmuseum.uz/en/muzei-dlya-menyu/memorial-museum-and-observatory-of-mirzo-ulugbek' };
    const map = (name) => ({ label: '地点导航', url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}` });
    const rename = (n, name) => Object.assign(day(n), { label: name, title: name, name });

    const charyn = place(6, 'v26-d6-charyn', {
      name: '查伦峡谷游客中心', query: 'Charyn Visitor Center Charyn Canyon Kazakhstan',
      lat: 43.35038, lng: 79.08133, geoEntity: 'charyn-visitor-center',
      coordinateSource: 'https://kazakhstan.travel/en/attractions/893',
    });
    const kolsai = place(6, 'v26-d6-kolsai', {
      name: '下科尔赛湖入口', query: 'Lower Kolsai Lake parking Kazakhstan',
      lat: 42.990487, lng: 78.327091, geoEntity: 'lower-kolsai-visit-access', coordinateAccuracy: 'landmark',
      coordinateSource: 'https://qaztourism.kz/upload/iblock/645/645abc2555c59f0ae004d9d326c6f52f.pdf',
    });
    const kaindy = place(6, 'v26-d6-kaindy', {
      name: '凯因迪湖（湖区）', query: 'Lake Kaindy Trailhead Kazakhstan',
      address: '地图点标示湖的位置。随团在停车点下车，再沿步道到湖岸。',
      lat: 42.98454, lng: 78.46563, geoEntity: 'osm-way-60961015', coordinateAccuracy: 'osm-poi',
      coordinateSource: 'https://www.openstreetmap.org/way/60961015',
    });
    rename(6, '阿拉木图·峡谷与双湖');
    Object.assign(day(6), {
      priority: '查伦峡谷、黑峡谷、凯因迪湖和下科尔赛湖四景拼团。',
      note: '钟点参考 MORN 公布的一日团。确认订单后按所订团的集合地点、顺序和返城时间执行。',
      extras: '行程清晨出发、深夜回城。前晚买好早餐与返程便餐，提前确认青旅夜间进门方式。骑马和游船可全部跳过。',
    });
    setRows(6, [
      row(6, 'd6r58-01', { time: '04:30–05:30', title: '早餐、补水与四景团集合', place: null, highlight: true, links: [fourStopTour, localTour], detail: '前一晚备好早饭和10L日包，50L包留阿拉木图青旅。MORN当前样例05:00集合、05:30出发，地址为Baitursynov街100号。GetYourGuide示例为104号，集合时间也不同，以所订订单为准。' }),
      row(6, 'd6r58-02', { time: '05:30–08:30', title: '乘团车从阿拉木图前往查伦峡谷', place: null, links: [localTour], detail: '长途车程，带足水与早餐。景区顺序和停留时间随运营方及天气调整。' }),
      row(6, 'd6r58-03', { time: '08:30–10:50', title: '查伦峡谷·城堡谷', place: charyn, links: [map('Charyn Visitor Center Charyn Canyon Kazakhstan')], detail: '按导游集合时间走城堡谷，在有余量时走到河谷。晴天补水、防晒。' }),
      row(6, 'd6r58-05', { time: '11:00–11:30', title: '黑峡谷观景', links: [map('Black Canyon viewpoint Kazakhstan')], detail: '按团车停留时间在观景台看峡谷。' }),
      row(6, 'd6r58-04', { time: '12:30–13:30', title: '团程午餐与补水', place: null, links: [fourStopTour, localTour], detail: '选团前看清午餐是否包含。自费时可按约5,000坚戈作准备，或提前带便餐。' }),
      row(6, 'd6v26-kaindy', { time: '13:30–16:00', title: '凯因迪湖·沉水森林', place: kaindy, links: [map('Lake Kaindy Trailhead Kazakhstan'), localTour], detail: '随团换乘上山车辆再走到湖边。参考团的接驳已包含，若换购其他团则核对UAZ是否包含，只有另收费时才另外带坚戈现金。可全程步行，骑马自费且可跳过。' }),
      row(6, 'd6v26-kolsai', { time: '16:30–18:30', title: '下科尔赛湖·湖畔徒步', place: kolsai, links: [map('Lower Kolsai Lake parking Kazakhstan')], detail: '只走下湖岸边，预留回停车点的时间。游船自费且可跳过。' }),
      row(6, 'd6r58-06', { time: '19:00–23:00', title: '返阿拉木图·便餐与回青旅', place: 'stay-almaty', links: [localTour], detail: '返城时间随交通变化。晚餐提前打包，回青旅按既定夜间进门方式办理。' }),
    ]);
    meal(6, '晚餐', null);
    budget(6, '四景团按 US$48–59 预留。MORN 当前公开价 ₸18,990，含两处公园费用及 UAZ 接驳。午餐如自费按约 ₸5,000 备现，骑马和游船可全部跳过。2027 实价按所选日期和套餐。');

    const temurids = place(8, 'v26-d8-temurids', {
      name: '帖木儿历史博物馆', query: 'State Museum of the Temurids Tashkent', address: 'Amir Temur Avenue 1, Tashkent',
      lat: 41.31368, lng: 69.27899, geoEntity: 'osm-way-31972619', coordinateAccuracy: 'osm-poi',
      coordinateSource: 'https://www.openstreetmap.org/way/31972619',
    });
    rename(8, '塔什干·帖木儿馆与老城');
    Object.assign(day(8), {
      priority: '中午抵塔什干，寄包后走帖木儿历史博物馆、艺术地铁和老城。',
      extras: '到站晚则优先保留帖木儿馆与晚餐，按时间缩短老城。若16:00后才抵站，先办入住和用餐并确认D9车票，博物馆按当天剩余时间决定。',
    });
    setRows(8, day(8).rows.map((item) => {
      if (item.id === 'd8r58-02') return row(8, item.id, { place: 'stay-tashkent', links: [map('DRIMIN by Sunrise Caravan Tashkent')] });
      if (item.id === 'd8r58-03') return row(8, item.id, { place: null });
      if (item.id === 'd8r58-04') return row(8, item.id, {
        title: '帖木儿历史博物馆', place: temurids, highlight: true,
        detail: '塔什干官方旅游现行时段为10:00–18:00、周一闭馆。周日安排帖木儿馆，周五D13补看国家历史博物馆。票价与2027到访日开放情况临行复核。',
        links: [map('State Museum of the Temurids Tashkent'), temuridHours],
      });
      return item;
    }));
    meal(8, '午餐', { note: 'DRIMIN寄包后吃Glinka 41A分店。14:00–14:45包含前往与用餐，排队久改便餐，先保留帖木儿馆。' });
    meal(8, '晚餐', { note: '老城游览后到Shahrisabz 5A店吃晚餐。19:00–20:00，排队久可打包。' });

    const observatory = place(12, 'v26-d12-ulugh-observatory', {
      name: '兀鲁伯天文台博物馆', query: 'Ulugh Beg Observatory Samarkand', address: '148 M. Ulugbek Street, Samarkand',
      lat: 39.67521, lng: 67.00554, geoEntity: 'osm-way-235763689', coordinateAccuracy: 'osm-poi',
      coordinateSource: 'https://www.openstreetmap.org/way/235763689',
    });
    rename(12, '撒马尔罕·陵墓群与天文台');
    const d12Rows = day(12).rows;
    setRows(12, [
      ...d12Rows.slice(0, 5),
      row(12, 'd12r58-06', { title: '但以理墓（Khodja Daniyar）', detail: '看完阿夫拉西阿卜博物馆后到墓园，15:15左右从墓园出发去兀鲁伯天文台。' }),
      row(12, 'd12v26-observatory-transfer', { time: '15:15–15:30', title: '但以理墓→兀鲁伯天文台', place: null, detail: '用短程出租车衔接，按现场出入口和交通调整。' }),
      row(12, 'd12v26-observatory', { time: '15:30–16:15', title: '兀鲁伯天文台与博物馆', place: observatory, links: [map('Ulugh Beg Observatory Samarkand'), observatoryMuseum], highlight: true, detail: '留45分钟看大型测角仪遗址和小型展厅。2027开放时段和末入场前一晚确认。' }),
      row(12, 'd12r58-07', { time: '16:15–17:00', title: '回老城，视时间寄卡', place: null, links: [map('UzPost 140100 Samarkand Pochta street 5')], detail: '确认中央邮局营业且能够在16:40前抵达时寄卡。时间不足可在上午Siyob巴扎附近的140101支局试寄，把握不大就跳过。' }),
      row(12, 'd12r58-08', { time: '17:00–18:00' }),
      row(12, 'd12r58-09', { time: '18:00–20:30' }),
    ]);
    meal(12, '晚餐', { note: '逛完天文台回老城，17:00–18:00到Emirhan用餐。便宜备选先核具体店名与门牌。' });
    const samarkandPost = D.postcards.stations.find(({ id }) => id === 'samarkand');
    Object.assign(samarkandPost, {
      day: 12, alternateDay: [], alternateDayAdvice: '',
      routeAdvice: '140100总局在Pochta街5。D12天文台结束后可叫车，能在16:40前抵达且确认窗口营业时再去。D13早班铁路前不安排折返。',
      decision: 'D12可选。若柜台不能收寄至中国大陆或会挤占下一段，略过这一站。',
      visitWindow: 'D12 16:15以后按天文台实际结束时刻判断。当天官方营业复核后，至少预留15–30分钟柜台时间。',
    });
    samarkandPost.hours.text = '当前官方地图记录：周一至周六，列有09:00–17:00及09:00–15:00。D12周四出发前确认国际信函柜台。';
    samarkandPost.backup.notes = ['午间柜台休息13:00–14:00。D12上午若经过且窗口确认可收寄至中国大陆，可提前办理。'];
    window.TripPostcards.ensureGuide();
    budget(12, '按原D12预算加兀鲁伯天文台门票与墓园至天文台的短程接驳。门票原列D13，改列D12后全程只计一次。');

    rename(13, '撒马尔罕→塔什干·国博');
    Object.assign(day(13), {
      priority: '优先买上午Afrosiyob返塔什干，下午看国家历史博物馆，晚上准备D14航班。',
      extras: '13:15到站时，寄包、便餐和进馆交通共留75分钟。晚到就缩短或取消国博，保留回塔什干和D14航班准备。',
      transportPlan: [{ id: 'sam-tas-target', route: '撒马尔罕 → 塔什干', operator: 'Uzbekistan Railways', service: 'Afrosiyob上午班·购票目标', departure: '10:55目标', arrival: '13:15目标', url: officialRail.url }],
    });
    setRows(13, [
      row(13, 'd13v2-01', { time: '08:00–09:00', title: '早餐、退房与核对车票', place: 'stay-samarkand', links: [officialRail], detail: '带50L主包退房。核对电子票上的车站、车次和护照信息。' }),
      row(13, 'd13v2-06', { time: '09:00–09:45', title: 'Old Radio Hostel→撒马尔罕站', detail: '按时到站，买好可带走的午餐。' }),
      row(13, 'd13v2-07', { time: '09:45–10:55', title: '站内安检、候车与上车' }),
      row(13, 'd13v2-08', { time: '10:55–13:15', title: '购票目标·Afrosiyob 撒马尔罕→塔什干', highlight: true, links: [officialRail, railNotice], detail: '按现行提前60天预售规则，2027年5月24日先查官网。10:55–13:15是购票目标，对应班次和放票时间以铁路官网为准。' }),
      row(13, 'd13v2-09', { time: '13:15–14:00', title: '塔什干中央站→DRIMIN寄包', place: 'stay-tashkent', links: [map('DRIMIN by Sunrise Caravan Tashkent')], detail: '提前问青旅能否先寄包，到站直接去放主包。' }),
      row(13, 'd13v26-lunch', { time: '14:00–14:30', title: '便餐与前往国博', place: null, detail: '用提前打包的午餐节省时间，寄包耽搁时优先吃饭并相应缩短进馆。' }),
      row(13, 'd13v26-history', { time: '14:30–16:50', title: '乌兹别克斯坦国家历史博物馆', place: 'rev58-d8-4', highlight: true, detail: '旅游委员会确认2026年7月完成翻新并重新开放。馆方现行时段为周一至周六10:00–17:00，出发前复核2027周五开放和末入场时间。官网列外国成人100,000苏姆、外国学生50,000苏姆，带学生证并确认可用。', links: [map('State Museum of History of Uzbekistan Tashkent'), historyMuseum, museumReopening] }),
      row(13, 'd13-checkin-v17', { time: '16:50–17:30', title: '回DRIMIN登记入住', place: 'stay-tashkent', links: [map('DRIMIN by Sunrise Caravan Tashkent')], detail: '办理入住，和青旅确认次日退房方式。' }),
      row(13, 'd13v2-10', { time: '17:30–18:45' }),
      row(13, 'd13-return-v17', { time: '18:45–19:00', place: 'stay-tashkent' }),
      row(13, 'd13v2-11', { time: '19:00–20:00', title: '核对D14航班、称包与设闹钟', place: null, links: [], detail: '在青旅核对正式票面、机场航站楼和行李额度。按出票时间倒推次日出门时间。' }),
    ]);
    meal(13, '晚餐', { note: '寄包登记后到Glinka 41A分店，17:30–18:45。排队久改便餐，留出核对次日航班的时间。' });
    budget(13, '预留Afrosiyob车票、两端接驳与食宿。国家历史博物馆按现行外国成人100,000苏姆预留，可在馆方接受学生凭证时买50,000苏姆学生票。');

    for (const [n, id, date] of [[9, 'd9r58-02', '5月20日'], [11, 'd11v2-04', '5月22日']]) {
      const current = day(n).rows.find((item) => item.id === id);
      const reminder = `按照现行提前60天规则，2027年${date}先查铁路官网。2027年实际首售日与车次以售票页面为准。`;
      const detail = current.detail.replace(/<\/p>$/, ` ${reminder}</p>`);
      setRows(n, day(n).rows.map((item) => item.id === id ? row(n, id, {
        highlight: true, detail, links: [...current.links, officialRail, railNotice],
      }) : item));
      day(n).extras += reminder;
    }
    const railBooking = D.bookings.find(({ id }) => id === 'uzbek-rail');
    if (railBooking) {
      railBooking.label = '待核 / 待订：3段 Afrosiyob（D9、D11、D13按现行60天规则于5月20/22/24日起查官网）';
    }
  };
})();
