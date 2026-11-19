# 地图坐标修复与来源

更新：2026-11-15；地图功能v22，原58天路线与已购航班保持。

## 核对结果

当前数据为58天、701张行程卡、423个地点对象（当天路线使用其中部分对象）。修复前47天有重复坐标，其中10天多个地点全部挤在一个坐标；本版58天地图独立站点同坐标冲突为0。当前实际绘制320个日站点。D54 的迪拜机场 T3 和地铁换乘合为一个地图标记，地铁站仍可单独导航。

禁止使用城市中心兜底。早餐、取包、普通午餐、城市参考项不独立生成Pin。原行程卡片均保留。各地具名青旅已独立定位。

同一物理地点的多个安排合并为一个站点，可展开成员；不同物理地点必须有不同来源实体。真实坐标用于路线和外部导航，近邻圆圈使用显示层展开并以细线指回真实位置。

## 精度与核验边界

OSM具名地点、建筑或景区几何中心不等于入口。保留的旧地标参考在卡片中单独标注。不能把小数位数当作实测精度，也不能保证所有建筑入口误差小于50米。未知坐标为null，不画假Pin。目前当天路线仍有42项地点或分店待核实（合计50次日出现），可在地图“待核实”清单按名称搜索；不能称这些点已全部补齐。

## 数据来源与复现

- OpenStreetMap contributors：[ODbL 1.0](https://www.openstreetmap.org/copyright)。每个新OSM点保留对象链接；可在地点卡片查看“坐标来源”。
- 青旅补充来源：旅舍官网地图、Travelmyth、Qantas住宿平台；菲莱大陆码头使用尼罗河流域组织2022年航运报告，均在相应卡片保留来源及核验边界。
- `scripts/snapshot-map-input.cjs` 从当前行程导出地点；`scripts/geocode-itinerary.mjs --online` 是手动运行的一次性补全工具。按[Nominatim使用政策](https://operations.osmfoundation.org/policies/nominatim/)单线程、至少1.2秒间隔、使用识别头并持久缓存；页面不会自动批量请求地理编码。
- `data/geo-query-cache.json` 保存可复现的公开地点检索证据；`scripts/geo-review-overrides.json` 指定已核对对象与拒绝的同名误匹配。`python scripts/compile-geo.py` 重新生成 `web/geo-data.js`。
- `node scripts/check-geo.cjs` 进行零依赖构建校验；`build-worker.mjs` 已强制调用。不同实体共用坐标会拒绝构建，负例测试验证此断言会实际失败。

## 尚待核实的地点

| 地点 | 名称搜索 |
| --- | --- |
| 伊犁州客运总站 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=%E4%BC%8A%E7%8A%81%E5%B7%9E%E5%AE%A2%E8%BF%90%E6%80%BB%E7%AB%99%20%E4%BC%8A%E5%AE%81%E5%B8%82) |
| Qaganat（Зенкова / Gogol 39分店） | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Qaganat%20%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8F%2039%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B) |
| Qaganat（Dostyk 108分店） | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Qaganat%20%D0%94%D0%BE%D1%81%D1%82%D1%8B%D0%BA%20108%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B) |
| Qaganat（Зенкова / Gogol 39分店） | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Qaganat%20%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8F%2039%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B) |
| Afsona Bukhara（Murod Avliyo 4分店） | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Afsona%20Bukhara%20Murod%20Avliyo%204) |
| Emirhan Restaurant（Mahmudjanov 1/18店） | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Emirhan%20Restaurant%20Ahrorqul%20Mahmudjonov%201%2F18%20Samarkand) |
| 戈布斯坦泥火山 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Gobustan%20Mud%20Volcanoes%20Tourism%20Complex%20Azerbaijan) |
| 罗斯塔韦利邮局寄明信片 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Georgian%20Post%20Rustaveli%20Avenue%20Tbilisi) |
| 梅特希→和平桥→浴场与瀑布 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Abanotubani%20Tbilisi) |
| Rike缆车与格鲁吉亚母亲像日落 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Rike%20Narikala%20Cable%20Car%20Tbilisi) |
| 军工大道·Jinvali水库 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Jinvali%20Water%20Reservoir%20Viewpoint%20Georgia) |
| 泽蒙老城 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Zemun%20Old%20Town%20Belgrade%20Serbia) |
| Tima–Irma · 老桥西岸店 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=National%20restaurant%20Tima%20Irma%20Onescukova%20Mostar) |
| Buyruk Esnaf Lokantası · Sirkeci Hoca Paşa店 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Buyruk%20Esnaf%20Lokantas%C4%B1%20Hoca%20Pa%C5%9Fa%20Sokak%2012%20Sirkeci%20Istanbul) |
| Buyruk Esnaf Lokantası · Sirkeci Hoca Paşa店 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Buyruk%20Esnaf%20Lokantas%C4%B1%20Hoca%20Pa%C5%9Fa%20Sokak%2012%20Sirkeci%20Istanbul) |
| Beşiktaş市场 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Besiktas%20Carsi%20Istanbul%20Turkey) |
| Fener街区 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Fener%20Istanbul%20Turkey) |
| Balat街区 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Balat%20Istanbul%20Turkey) |
| Kaş老镇 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Kas%20Old%20Town%20Andifli%20Kas%20Antalya%20Turkey) |
| Kekova沉城海域 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Kekova%20Sunken%20City%20Turkey) |
| 卡莱伊奇老城 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Kaleici%20Antalya%20Turkey) |
| 格雷梅日出热气球地面摄影 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Sunrise%20Point%20Goreme) |
| Cappadocia Pide House & Restaurant · Hakkı Paşa Meydanı店 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Cappadocia%20Pide%20House%20Restaurant%20Hakki%20Pasa%20Meydani%2016%20Goreme) |
| 红谷·玫瑰谷徒步 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Red%20Valley%20Rose%20Valley%20Goreme%20Turkey) |
| Ihlara峡谷 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Ihlara%20Valley%20Entrance%20Turkey) |
| Kadıköy市场 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Kadikoy%20Market%20Istanbul%20Turkey) |
| El Dahar老城与市场 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=El%20Dahar%20Hurghada) |
| 工匠村与墓室 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Deir%20el-Medina) |
| 西岸村落与尼罗河沿岸摄影 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Al%20Bairat%20Luxor) |
| 尼罗河Felucca帆船 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Luxor%20Nile%20felucca) |
| Makka / Mekka Restaurant · Abtal El Tahrir店 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Makka%20Restaurant%20143%20Abtal%20El%20Tahrir%20Aswan) |
| 渡轮返回东岸 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Aswan%20Corniche) |
| 前往吉萨高原正式入口 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Giza%20Pyramids%20Ticket%20Office) |
| 亚历山大→马特鲁 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Marsa%20Matrouh%20Bus%20Station) |
| 阿吉巴→奥拜德白沙滩 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Al%20Obayed%20Beach%20Marsa%20Matrouh) |
| 奥拜德白沙滩 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Al%20Obayed%20Beach) |
| Magdy Seafood · Omar El-Mokhtar街店 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Magdy%20Seafood%20Omar%20El%20Mokhtar%20Mersa%20Matruh) |
| 马特鲁→开罗 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Cairo%20Go%20Bus%20Station) |
| 扎马雷克岛与尼罗河晚景 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Zamalek%20Cairo) |
| Abra木船→香料市场与黄金市场 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Deira%20Old%20Souk%20Abra%20Station%20Dubai) |
| 午餐、商场室内逛展与超市采购 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Carrefour%20Mall%20of%20the%20Emirates%20Dubai) |
| 19号线→创景路换5号线→杭师大仓前站 | [搜索具体地点](https://www.google.com/maps/search/?api=1&query=Hangzhou%20Normal%20University%20Cangqian%20Campus%20South%20Gate) |
