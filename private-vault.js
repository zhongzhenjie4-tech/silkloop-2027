(()=>{
  'use strict';
  const STORAGE_KEY='silkloop-2027-private-vault-v1', FORMAT='silkloop-private-vault', VERSION=1, ITERATIONS=310000;
  const BLOB_MAGIC=new TextEncoder().encode('SLVB1\n'), encoder=new TextEncoder(), decoder=new TextDecoder();
  let key=null, data=null, envelope=null, epoch=0, hiddenAt=0, hiddenTimer=0, writeQueue=Promise.resolve();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const copy=v=>v===undefined?null:JSON.parse(JSON.stringify(v));
  const supported=()=>!!(globalThis.crypto?.subtle&&globalThis.crypto?.getRandomValues&&globalThis.TextEncoder&&globalThis.Blob);
  function requireCrypto(){if(!supported())throw Error('当前环境不能安全加密。请用 HTTPS 或 localhost 的新版 Safari / Chrome；私密资料不会以明文保存。');}
  function requireUnlocked(){requireCrypto();if(!key||!data||!envelope)throw Error('请先解锁私密区。');}
  function random(n){return crypto.getRandomValues(new Uint8Array(n));}
  function b64(bytes){let s='';for(let i=0;i<bytes.length;i+=32768)s+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(s);}
  function un64(value,max=5*1048576){if(typeof value!=='string'||value.length>max*1.4+8||!/^[A-Za-z0-9+/]*={0,2}$/.test(value))throw Error('加密备份格式错误。');try{return Uint8Array.from(atob(value),c=>c.charCodeAt(0));}catch{throw Error('加密备份格式错误。');}}
  function stored(){const raw=localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):null;}
  function validate(e){
    if(!e||e.format!==FORMAT||e.version!==VERSION)throw Error('不支持这个备份版本；现有资料未改动。');
    if(typeof e.id!=='string'||!/^[A-Za-z0-9+/]{22}==$/.test(e.id)||e.kdf?.name!=='PBKDF2'||e.kdf?.hash!=='SHA-256'||!Number.isInteger(e.kdf.iterations)||e.kdf.iterations<310000||e.kdf.iterations>2000000||e.cipher?.name!=='AES-GCM')throw Error('加密备份参数无效。');
    if(un64(e.kdf.salt,64).length<16||un64(e.kdf.salt,64).length>64||un64(e.cipher.iv,12).length!==12||un64(e.cipher.data).length<16)throw Error('加密备份不完整。');
    return e;
  }
  async function derive(password,e){
    if(typeof password!=='string'||password.length<8)throw Error('口令至少 8 个字符，请使用独立且不易猜测的口令。');
    const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:un64(e.kdf.salt,64),iterations:e.kdf.iterations},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  }
  const aad=e=>encoder.encode(FORMAT+':1:'+e.id);
  async function encryptData(value,k,e){const iv=random(12),bytes=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad(e)},k,encoder.encode(JSON.stringify(value)));return {...e,cipher:{name:'AES-GCM',iv:b64(iv),data:b64(new Uint8Array(bytes))}};}
  async function decryptData(k,e){let parsed;try{parsed=JSON.parse(decoder.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:un64(e.cipher.iv,12),additionalData:aad(e)},k,un64(e.cipher.data))));}catch{throw Error('口令不正确或加密资料已损坏，现有资料未改动。');}if(!parsed||parsed.version!==1||!parsed.sections||typeof parsed.sections!=='object'||Array.isArray(parsed.sections))throw Error('私密资料结构无效。');return parsed;}
  function notify(reason='state',section=null){if(reason!=='write'||section==='hotel'||section==='flight')mountAll();globalThis.dispatchEvent(new CustomEvent('tripvaultchange',{detail:{unlocked:isUnlocked(),reason,section}}));}
  function isUnlocked(){return !!key&&!!data;}
  function hasVault(){try{return localStorage.getItem(STORAGE_KEY)!==null;}catch{return false;}}
  async function setup(password){requireCrypto();if(hasVault())throw Error('本机已有私密区，请先解锁。');const generation=epoch;
    const e={format:FORMAT,version:VERSION,id:b64(random(16)),kdf:{name:'PBKDF2',hash:'SHA-256',iterations:ITERATIONS,salt:b64(random(16))}};
    const k=await derive(password,e),value={version:1,sections:{hotel:[],flight:[],notes:{text:''}}},encrypted=await encryptData(value,k,e);
    if(generation!==epoch||hasVault())throw Error('私密区状态已改变，请重试。');localStorage.setItem(STORAGE_KEY,JSON.stringify(encrypted));key=k;data=value;envelope=encrypted;epoch++;notify('setup');return true;
  }
  async function unlock(password){requireCrypto();const generation=epoch;let e;try{e=validate(stored());}catch(error){throw Error(error.message||'本机加密资料无法读取。');}const k=await derive(password,e),value=await decryptData(k,e);if(generation!==epoch)throw Error('私密区状态已改变，请重试。');key=k;data=value;envelope=e;epoch++;notify('unlock');return true;}
  function lock(){epoch++;key=null;data=null;envelope=null;clearTimeout(hiddenTimer);hiddenTimer=0;notify('lock');}
  function readSection(name){return isUnlocked()&&Object.hasOwn(data.sections,name)?copy(data.sections[name]):null;}
  function writeSection(name,value){
    if(!/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(name)||['__proto__','constructor','prototype'].includes(name))return Promise.reject(Error('私密分区名称无效。'));
    const generation=epoch,snapshot=copy(value);if(snapshot===null&&value!==null)return Promise.reject(Error('私密资料必须是 JSON 数据。'));
    const run=async()=>{requireUnlocked();if(generation!==epoch)throw Error('私密区已锁定，请解锁后重新保存。');const k=key,e=envelope,next=copy(data);next.sections[name]=snapshot;const encrypted=await encryptData(next,k,e);if(generation!==epoch||key!==k)throw Error('私密区已锁定，未保存。');localStorage.setItem(STORAGE_KEY,JSON.stringify(encrypted));data=next;envelope=encrypted;notify('write',name);return true;};
    const result=writeQueue.then(run,run);writeQueue=result.catch(()=>{});return result;
  }
  async function sealBlob(blob,metadata={}){
    requireUnlocked();if(!(blob instanceof Blob))throw Error('请选择有效文件。');const generation=epoch,k=key,id=envelope.id;
    const meta=encoder.encode(JSON.stringify({metadata:copy(metadata),type:blob.type||'application/octet-stream',bytes:blob.size}));if(meta.length>65536)throw Error('文件信息过长。');
    const prefix=new Uint8Array(4);new DataView(prefix.buffer).setUint32(0,meta.length);const plain=await new Blob([prefix,meta,blob]).arrayBuffer(),iv=random(12);
    const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode('SLVB1:'+id)},k,plain);if(generation!==epoch||key!==k)throw Error('私密区已锁定，文件未保存。');
    const header=encoder.encode(JSON.stringify({version:1,vaultId:id,iv:b64(iv)})),length=new Uint8Array(4);new DataView(length.buffer).setUint32(0,header.length);
    return new Blob([BLOB_MAGIC,length,header,encrypted],{type:'application/octet-stream'});
  }
  async function openBlob(encryptedBlob){
    requireUnlocked();if(!(encryptedBlob instanceof Blob)||encryptedBlob.size<50||encryptedBlob.size>110*1048576)throw Error('加密附件格式无效。');const generation=epoch,k=key,id=envelope.id,bytes=new Uint8Array(await encryptedBlob.arrayBuffer());
    if(BLOB_MAGIC.some((v,i)=>bytes[i]!==v))throw Error('这是旧版未加密附件，需要先迁移。');const length=new DataView(bytes.buffer).getUint32(BLOB_MAGIC.length);if(length<1||length>8192||length+10>=bytes.length)throw Error('加密附件头损坏。');
    let h;try{h=JSON.parse(decoder.decode(bytes.subarray(10,10+length)));}catch{throw Error('加密附件头损坏。');}if(h.version!==1||h.vaultId!==id)throw Error('此附件属于另一份私密区；请恢复对应的加密备份。');
    let plain;try{plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:un64(h.iv,12),additionalData:encoder.encode('SLVB1:'+id)},k,bytes.subarray(10+length)));}catch{throw Error('附件解密失败，原有加密文件已保留。');}if(generation!==epoch||key!==k)throw Error('私密区已锁定。');
    const metaLength=new DataView(plain.buffer).getUint32(0);if(metaLength>65536||metaLength+4>plain.length)throw Error('附件内容无效。');const m=JSON.parse(decoder.decode(plain.subarray(4,4+metaLength))),blob=new Blob([plain.subarray(4+metaLength)],{type:m.type});if(blob.size!==m.bytes)throw Error('附件不完整。');return {blob,metadata:copy(m.metadata)};
  }
  function exportBackup(){requireCrypto();const e=validate(stored());return new Blob([JSON.stringify(e)],{type:'application/json'});}
  async function importBackup(source,password,options={}){
    requireCrypto();let e;try{e=validate(typeof source==='string'?JSON.parse(source):source instanceof Blob?JSON.parse(await source.text()):copy(source));}catch(error){throw Error(error.message||'备份格式无效，现有资料未改动。');}
    const generation=epoch,k=await derive(password,e),value=await decryptData(k,e);if(generation!==epoch)throw Error('私密区状态已改变，请重试。');
    const old=hasVault()?validate(stored()):null;if(old&&old.id!==e.id&&options.replace!==true)throw Error('这是另一份私密区。请先保留当前加密备份，再明确确认替换；旧票夹需要对应备份才能解密。');
    localStorage.setItem(STORAGE_KEY,JSON.stringify(e));key=k;data=value;envelope=e;epoch++;notify('import');return true;
  }
  function reset(confirmation){if(confirmation!=='DELETE PRIVATE VAULT')throw Error('重置需要明确确认。');localStorage.removeItem(STORAGE_KEY);lock();}
  function saveDownload(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  const bound=new WeakSet();
  function hosts(scope){return [...(scope.matches?.('[data-private-vault]')?[scope]:[]),...scope.querySelectorAll('[data-private-vault]')];}
  function mountAll(scope=document){for(const host of hosts(scope)){
    const available=supported(),exists=hasVault(),unlocked=isUnlocked();
    host.innerHTML=`<div class="view-title"><div><h2>本机私密区</h2><p>酒店、已订航班和票夹使用独立口令加密；公开行程始终可读。行程换序不会自动改动原订单日期；旧日期备忘和票夹请按城市复核。</p></div></div><p class="minor">口令至少 8 个字符。忘记口令无法恢复资料。口令和解密密钥只留在内存；离开页面 5 分钟会自动锁定。</p>${!available?'<p role="alert" class="vault-error">当前环境不能安全加密。请用 HTTPS 或 localhost 的新版浏览器打开；私密区和票夹导入已停用。</p>':unlocked?'<p role="status">私密区已解锁</p><div class="help-actions"><button class="primary-button" data-pv-lock>锁定私密区</button><button class="soft-button" data-pv-export>导出加密备份</button></div>':`<form data-pv-access><label>${exists?'解锁口令':'设置独立口令'}<input name="password" type="password" autocomplete="${exists?'current-password':'new-password'}" minlength="8" required></label>${exists?'':'<label>再次输入口令<input name="confirm" type="password" autocomplete="new-password" minlength="8" required></label>'}<button class="primary-button" type="submit">${exists?'解锁私密区':'创建加密私密区'}</button></form>`}<p data-pv-status role="status"></p>${unlocked?recordsHTML('hotel','酒店记录')+recordsHTML('flight','已订航班记录'):''}<details class="vault-info"><summary>加密备份与恢复</summary><p>此备份只含私密文字记录及附件解密所需的加密私密区；不含票夹附件。请另外保留票据原件。换设备或浏览器地址不会自动同步。</p>${available&&exists&&!unlocked?'<button class="soft-button" data-pv-export>导出当前加密备份</button>':''}<form data-pv-restore><label>选择加密备份<input name="backup" type="file" accept="application/json,.json" required ${available?'':'disabled'}></label><label>备份口令<input name="password" type="password" autocomplete="current-password" minlength="8" required ${available?'':'disabled'}></label><button class="soft-button" type="submit" ${available?'':'disabled'}>验证并恢复备份</button></form><button class="danger-quiet" data-pv-reset ${exists?'':'disabled'}>重置本机私密区</button><p class="minor">重置不删除附件，但没有对应加密备份及口令就无法再解密附件。</p></details>`;
    if(!bound.has(host)){bound.add(host);host.addEventListener('submit',async event=>{const form=event.target;if(!(form instanceof HTMLFormElement))return;event.preventDefault();const status=host.querySelector('[data-pv-status]'),fields=new FormData(form),submit=form.querySelector('[type="submit"]');submit.disabled=true;
      try{if(form.hasAttribute('data-pv-access')){const password=fields.get('password');if(!hasVault()&&password!==fields.get('confirm'))throw Error('两次口令不一致。');await (hasVault()?unlock(password):setup(password));}
      if(form.hasAttribute('data-pv-restore')){const file=fields.get('backup');if(!file?.size||file.size>6*1048576)throw Error('请选择有效的加密备份文件。');let replace=false;let candidate;try{candidate=validate(JSON.parse(await file.text()));}catch(error){throw Error(error.message||'备份格式错误。');}if(hasVault()&&validate(stored()).id!==candidate.id){replace=confirm('这将替换本机私密区。旧附件仍保留，但需要旧备份才能解密。已另存当前加密备份并确认替换？');if(!replace)return;}await importBackup(candidate,fields.get('password'),{replace});}
      if(form.dataset.pvRecord){const section=form.dataset.pvRecord,items=readSection(section);if(!Array.isArray(items))throw Error('记录格式不兼容，现有资料已保留。');const item={id:b64(random(12))};for(const [name,value] of fields)if(typeof value==='string')item[name]=value.slice(0,4000);await writeSection(section,[...items,item]);}
      }catch(error){status.textContent=error.message||'操作未完成，原有资料已保留。';}finally{if(submit.isConnected)submit.disabled=false;}});
      host.addEventListener('click',async event=>{const button=event.target.closest('button');if(!button)return;const status=host.querySelector('[data-pv-status]');try{if(button.hasAttribute('data-pv-lock'))lock();if(button.hasAttribute('data-pv-export'))saveDownload(exportBackup(),'silkloop-private-vault-encrypted.json');if(button.hasAttribute('data-pv-reset')&&confirm('确认重置本机私密区？没有对应备份和口令，原附件将无法解密。'))reset('DELETE PRIVATE VAULT');if(button.dataset.pvDelete){if(!confirm('从加密私密区删除这条记录？'))return;const section=button.dataset.pvSection;await writeSection(section,readSection(section).filter(r=>r.id!==button.dataset.pvDelete));}}catch(error){status.textContent=error.message||'操作未完成。';}});
    }
  }}
  function recordsHTML(section,title){const items=readSection(section);if(!Array.isArray(items))return `<p>${esc(title)}的数据已保留，当前界面无法编辑此格式。</p>`;const hotel=section==='hotel',fields=hotel?[['date','日期','date'],['city','城市'],['name','酒店名称'],['address','酒店地址'],['order','订单号'],['notes','备注']]:[['date','出发日期','date'],['from','出发地'],['to','目的地'],['airline','航空公司'],['number','航班号'],['order','订票订单号'],['notes','备注']];return `<details class="vault-upload"><summary>${title} · ${items.length} 条</summary><div class="vault-upload-body">${items.map(r=>`<article class="ticket-card"><div>${fields.filter(([name])=>r[name]).map(([name,label])=>`<p><strong>${label}</strong> ${esc(r[name])}</p>`).join('')}<button class="danger-quiet" data-pv-delete="${esc(r.id)}" data-pv-section="${section}">删除记录</button></div></article>`).join('')}<form data-pv-record="${section}"><div class="vault-fields">${fields.map(([name,label,type])=>`<label>${label}<input name="${name}" type="${type||'text'}" maxlength="4000" ${name==='date'||name==='name'||name==='number'?'required':''}></label>`).join('')}</div><button class="primary-button" type="submit">加密保存${hotel?'酒店':'航班'}记录</button></form></div></details>`;}
  if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){hiddenAt=Date.now();clearTimeout(hiddenTimer);hiddenTimer=setTimeout(()=>{if(isUnlocked())lock();},5*60*1000);}else{clearTimeout(hiddenTimer);hiddenTimer=0;if(hiddenAt&&Date.now()-hiddenAt>=5*60*1000&&isUnlocked())lock();hiddenAt=0;}});
  globalThis.TripVault={isUnlocked,hasVault,unlock,setup,lock,readSection,writeSection,sealBlob,openBlob,exportBackup,importBackup,reset,mountAll,supported,storageKey:STORAGE_KEY};
})();
