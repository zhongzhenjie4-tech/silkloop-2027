(() => {
  'use strict';
  const D = window.TRIP_DATA;
  const sections = window.TripItinerary26;
  const changedDays = new Set();
  const stayMoves = [];
  const explicitMeals = new Set();
  const day = n => D.days[n - 1];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[char]);
  const search = query => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
  const navigation = id => ({label:'地点地图', url:search(D.places[id].query || D.places[id].name)});

  function row(n, id, fields) {
    const previous = day(n).rows.find(item => item.id === id);
    const result = {id, time:'', title:'', detail:'', links:[], place:null,
      highlight:false, status:'planned', timeBasis:'clock-plan', ...previous, ...fields};
    if (!result.detail.startsWith('<')) result.detail = '<p>' + escape(result.detail) + '</p>';
    if (!Object.hasOwn(fields, 'links') && previous?.place !== result.place) result.links = [];
    if (!/^(约\s*)?\d{1,2}:\d{2}/.test(result.time)) result.timeBasis = 'conditional';
    result.links = [...result.links];
    if (result.place && !result.links.some(link => /google\.com\/maps/.test(link.url || link.href || ''))) result.links.push(navigation(result.place));
    result.plain = result.title + ' ' + result.detail.replace(/<[^>]+>/g, ' ');
    return result;
  }

  function place(n, id, fields) {
    if (D.places[id]) throw new Error('Duplicate planned location: ' + id);
    const d = day(n);
    const hasCoordinates = Number.isFinite(fields.lat) && Number.isFinite(fields.lng);
    const osm = /^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/(\d+)$/.exec(fields.coordinateSource || '');
    if (hasCoordinates && !/^https:\/\//.test(fields.coordinateSource || '')) throw new Error('Coordinate source missing: ' + id);
    const coordinateAccuracy = hasCoordinates ? (osm ? 'osm-poi' : 'listing-poi') : 'unresolved';
    D.places[id] = {id, city:d.city, country:d.country, countryCode:d.countryCode, timezone:d.timezone,
      kind:'sight', address:'具体入口请结合导航与现场标识确认', keywords:[fields.name,fields.query].filter(Boolean),
      ...fields, lat:hasCoordinates ? fields.lat : null, lng:hasCoordinates ? fields.lng : null,
      coordinateAccuracy, coordinateType:coordinateAccuracy, mapHidden:!hasCoordinates,
      geoEntity:hasCoordinates ? (osm ? 'osm-' + osm[1] + '-' + osm[2] : fields.geoEntity || 'plan26-' + id) : '',
      geoReviewed:'2026-11-20'};
    return id;
  }

  function setRows(n, rows) {
    const d = day(n);
    d.rows = rows;
    changedDays.add(n);
    d.places = [...new Set([...rows.map(item => item.place), d.accommodation?.placeId].filter(Boolean))];
  }

  function guide(id, title, html) {
    const item = D.guides.find(g => g.id === id);
    if (item) Object.assign(item, {title, html});
    else D.guides.push({id, title, html});
  }

  function meal(n, mealName, fields) {
    const meals = D.dining.meals;
    const index = meals.findIndex(m => m.day === n && m.meal === mealName);
    if (fields === null) {
      if (index >= 0) meals.splice(index, 1);
      return;
    }
    const next = {backup:null, note:'按当天动线与预计营业时段选择。', ...meals[index], ...fields, day:n, meal:mealName};
    explicitMeals.add(next);
    if (index < 0) meals.push(next);
    else meals[index] = next;
  }

  const budget = (n, value) => { day(n).activityBudget = value; };
  const moveStay = (fromDay, toDay, toCityId) => stayMoves.push({fromDay,toDay,toCityId});
  const api = {D, day, row, place, setRows, guide, meal, budget, moveStay, escape};
  for (const name of ['central', 'caucasusBalkans', 'turkiyeEgypt', 'uae']) {
    if (typeof sections?.[name] !== 'function') throw new Error('Missing itinerary section: ' + name);
    sections[name](api);
  }

  if (stayMoves.length) {
    for (const {fromDay,toDay,toCityId} of stayMoves) {
      for (const stay of D.accommodations) stay.dayNumbers = stay.dayNumbers.filter(n => n !== fromDay && n !== toDay);
      const target = D.accommodations.find(stay => stay.id === toCityId);
      if (!target) throw new Error('Unknown accommodation: ' + toCityId);
      target.dayNumbers.push(toDay);
      target.dayNumbers.sort((a,b) => a-b);
      day(fromDay).lodging = '巴库→第比利斯夜车候选；若改次日出发，需另订当晚住宿';
      changedDays.add(fromDay);
      changedDays.add(toDay);
    }
    window.TripStay.attach(D, {refreshRoutes:false});
  }
  for (const n of changedDays) setRows(n, day(n).rows);
  for (const n of [14,15,16,28,38,46,48]) day(n).requiresBookingTime = true;
  meal(40,'晚餐',{note:'晚餐后返回同一家住宿，确认 D41 凌晨接车和上车地点。'});
  meal(41,'午餐',{note:'11:00–12:30 预留 SAW 到卡德柯伊地铁及步行，12:30–13:30 用餐。延误或未取得后段登机牌则改在机场吃。'});
  window.TRIP_DINING_DATA.reviewNote = '2026-11-20 按新版六区路线同步用餐时段与链接，店址和菜单沿用各店核查日。';
  D.dining.reviewNote = window.TRIP_DINING_DATA.reviewNote;
  D.dining.corrections[2] = 'D32 考古馆后过海到 Üsküdar／Salacak，D41 仅在转机条件满足时去卡德柯伊。';
  D.dining.corrections[3] = 'D6 四景团、D40、Kekova D35、红海D43等团日先看产品是否含餐，自费时带简餐与足量饮水。';
  window.TripFood.attach(D);
  window.TripDining.refresh(explicitMeals);
  window.TripBooking?.refresh();


  D.version = '2026-11-20 · 六大区域更新 v26';
  D.transportNote = '六段已出票航班按票面执行。D14 塔什干→巴库待购；D15 巴库→第比利斯须落实跨境班次。2027 未购班次、入场时段与票价按实际复核。';
  const oldRoute = D.guides.find(g => g.id === 'revision58');
  if (oldRoute) {
    oldRoute.title = '58天路线 · 旧版与本轮更新';
    oldRoute.html = '<p>当前每日卡片和下方六区更新优先。旧版分时表用于对照。</p><button class="soft-button" data-guide="itinerary26">本轮路线与待核事项</button>' + oldRoute.html;
  }
  const transport = D.days.flatMap(d => (d.transportPlan || []).map(l => ({d,l})));
  guide('transport-specific','逐段交通 · 班次与状态', '<h2>逐段车次、航班与状态</h2><p>各地钟点均为当地时间。参考班次在出票前复核。</p>' + transport.map(({d,l}) =>
    '<details><summary>D' + d.id.slice(3) + ' · ' + escape(d.date) + ' · ' + escape(l.route) + '</summary><p>' + escape(l.operator) + ' · ' + escape(l.service) + '</p><p>' + escape(l.departure) + ' → ' + escape(l.arrival) + '</p><p>' + escape(l.evidenceStatus || l.status || '') + '</p>' +
    (/^https:\/\//.test(l.url || '') ? '<a target="_blank" rel="noopener noreferrer" href="' + escape(l.url) + '">看运营方资料</a>' : '') + '</details>').join(''));
  const revisionGuide = {id:'itinerary26',title:'六区行程更新与待核事项', subtitle:'跨境班次、机场红线、开放时间和新增支出',
    html:'<h2>六区行程更新</h2><ul><li>D6 查伦、黑峡谷、凯因迪与科尔赛按全天团安排。D9／D11／D13 从 5 月 20／22／24 日分别查看高铁。</li><li>D14 HY755 和 D15 巴库→第比利斯夜车待落实。夜车方案为巴库 1 晚、第比利斯 3 晚。</li><li>D27 白天先落实 D28 莫斯塔尔去回交通，保留巴士备选。</li><li>D39 热气球主窗口。D41 04:30–05:00 接车，17:00 离开卡德柯伊返 SAW。</li><li>D46、D48 按实际车票确定时间；D53 文明馆后赶 16:00 前的悬空教堂。</li><li>D56 阿布扎比按普通票和往返巴士预留 AED 230，另计市内接驳与餐费。D57 目标 22:45 前进迪拜机场 T3。</li></ul><p>去回班次、适用折扣及票价按 2027 当日核对。</p><a class="soft-button" href="./itinerary26-reference.md" download="丝路随行_六区更新核查.md">下载逐区核查与来源</a>'};
  D.guides.splice(1,0,revisionGuide);
  D.itineraryRevision26 = {updated:'2026-11-20', days:[...changedDays].sort((a,b) => a-b)};
})();
