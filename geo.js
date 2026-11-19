(()=>{
 'use strict';const D=window.TRIP_DATA,patches=window.TRIP_GEO_DATA?.patches||{};
 const reminders=new Set(['rev58-d6-1','rev58-d17-2','rev58-d41-5','rev58-d42-2','rev58-d50-1','rev58-d51-11','rev58-d54-1','rev58-d53-6']);
 for(const [id,p] of Object.entries(D.places)){
  if(patches[id])Object.assign(p,patches[id]);
  if(p.coordinateAccuracy==='city-reference'||!Number.isFinite(p.lat)||!Number.isFinite(p.lng)){p.lat=null;p.lng=null;p.mapHidden=true;p.coordinateAccuracy='unresolved';}
  if(reminders.has(id)||/-ref$/.test(id)){p.lat=null;p.lng=null;p.mapHidden=true;p.mapReason='reminder';p.coordinateAccuracy='unresolved';}
  if(!p.mapHidden&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)){
   p.coordinateType=p.coordinateAccuracy;
   if(/城市参考(?:点|坐标)/.test(p.address||''))p.address=p.address.replace(/城市参考(?:点|坐标)[^。]*。?/g,'按具名地点坐标导航，并在现场核对入口。');
   if(/airport|机场/i.test(p.query+' '+p.kind)){
    p.mapName=/Dubai International Airport Terminal 3/i.test(p.query)?'迪拜国际机场 T3':/Cairo International Airport Terminal 2|Cairo Airport Terminal 2/i.test(p.query)?'开罗国际机场 T2':p.geoName||p.name;
   }
  }
  p.name=p.name.replace(/\s*[·（(]?\s*城市参考点[）)]?/g,'').trim();
  if(p.coordinateAccuracy==='osm-poi')p.coordinateNote='OpenStreetMap具名地点坐标；建筑中心不等于入口，不保证入口50米误差。';
 }
 function pointsForDay(day,city){
  const groups=new Map();
  for(const id of day.places){const p=D.places[id];if(!p||p.mapHidden||!Number.isFinite(p.lat)||!Number.isFinite(p.lng)||city&&p.city!==city)continue;
   const key=p.lat.toFixed(6)+','+p.lng.toFixed(6);let group=groups.get(key);
   if(!group){group={...p,name:p.mapName||p.name,members:[],memberNames:[]};groups.set(key,group);}group.members.push(id);group.memberNames.push(p.name);
  }
  // D54 arrival and onward metro share one airport stop. Keep the metro's
  // own coordinates for its directions link and the original itinerary row.
  if(day.id==='day54'){
   const airport=[...groups.values()].find(p=>p.members.includes('rev58-d54-5'));
   const metro=[...groups.entries()].find(([,p])=>p.members.length===1&&p.id==='rev58-d54-6');
   if(airport&&metro){
    airport.relatedStops=[{id:metro[1].id,name:'机场 T3 地铁站',lat:metro[1].lat,lng:metro[1].lng}];
    groups.delete(metro[0]);
   }
  }
  return [...groups.values()];
 }
 function unresolvedForDay(day,city){return day.places.map(id=>D.places[id]).filter(p=>p&&p.mapHidden&&p.mapReason!=='reminder'&&(!city||p.city===city));}
 // Offsets are display-only: all navigation and route geometry retain WGS-84.
 function displayPoints(points){
  return points.map((p,i)=>{const nearby=points.map((q,j)=>({q,j})).filter(({q})=>Math.abs(p.lat-q.lat)<.00045&&Math.abs(p.lng-q.lng)<.00045);
   if(nearby.length<2)return {...p,displayLat:p.lat,displayLng:p.lng,displayOffset:false};
   const at=nearby.findIndex(({j})=>j===i),angle=2*Math.PI*at/nearby.length;
   return {...p,displayLat:p.lat+.0003*Math.sin(angle),displayLng:p.lng+.0003*Math.cos(angle),displayOffset:true};
  });
 }
 // Spiderfy works in screen pixels; it never edits a location's WGS-84 data.
 function spreadPixels(points,{width=Infinity,height=Infinity,minGap=40}={}){
  const parent=points.map((_,i)=>i),root=i=>{while(parent[i]!==i)i=parent[i];return i;},join=(a,b)=>{a=root(a);b=root(b);if(a!==b)parent[b]=a;};
  for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)if(Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y)<minGap)join(i,j);
  let output=[];
  for(let pass=0;pass<=points.length;pass++){
   const groups=new Map();points.forEach((p,i)=>{const r=root(i);if(!groups.has(r))groups.set(r,[]);groups.get(r).push(i);});
   output=points.map(p=>({...p,offsetX:0,offsetY:0}));
   for(const ids of groups.values()){
    if(ids.length<2)continue;
    const radius=Math.max(22,minGap/(2*Math.sin(Math.PI/ids.length))),margin=20;
    let x=ids.reduce((n,i)=>n+points[i].x,0)/ids.length,y=ids.reduce((n,i)=>n+points[i].y,0)/ids.length;
    if(Number.isFinite(width)&&width>2*(radius+margin))x=Math.max(radius+margin,Math.min(width-radius-margin,x));
    if(Number.isFinite(height)&&height>2*(radius+margin))y=Math.max(radius+margin,Math.min(height-radius-margin,y));
    ids.forEach((id,k)=>{const angle=-Math.PI/2+2*Math.PI*k/ids.length;output[id].offsetX=x+radius*Math.cos(angle)-points[id].x;output[id].offsetY=y+radius*Math.sin(angle)-points[id].y;});
   }
   let merged=false;
   for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)if(root(i)!==root(j)&&Math.hypot(output[i].x+output[i].offsetX-output[j].x-output[j].offsetX,output[i].y+output[i].offsetY-output[j].y-output[j].offsetY)<minGap-.01){join(i,j);merged=true;}
   if(!merged)break;
  }
  return output;
 }
 function find(day,id,city){return pointsForDay(day,city).find(p=>p.members.includes(id)||p.relatedStops?.some(stop=>stop.id===id))||null;}
 function assertUnique(){for(const day of D.days){const seen=new Set();for(const p of pointsForDay(day)){const key=p.lat.toFixed(6)+','+p.lng.toFixed(6);if(seen.has(key))throw Error(day.id+'存在重复地图站点');seen.add(key);if(p.coordinateAccuracy==='city-reference')throw Error('城市参考点不得上图');}}return true;}
 window.TripGeo={pointsForDay,unresolvedForDay,displayPoints,spreadPixels,find,assertUnique};assertUnique();
})();
