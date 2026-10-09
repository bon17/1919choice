import {questions,demands,scenes,constitution,activityOptions,initialState,restore,currentScene,chapter,canRecord,canVisit,allComplete,availableProposals,evaluate,getRecords,concepts,selectClue,historyComplete,completeChapter,nextScene,visitScene} from './game.js';
const storageKey='1919-prototype-v1';
const womanArtwork='assets/woman-worker.webp';
const castArtwork='assets/cast-sheet.webp';
let state=initialState(),notice='',feedback=null,modalType=null,modalReturn='[data-action="map"]',animation='',soundOn=false,audioContext=null,ambient=null;
let notesOpen=window.matchMedia('(min-width:901px)').matches;
try{
  const raw=localStorage.getItem(storageKey);state=restore(raw);
  if(raw){try{if(![1,2,3,4].includes(JSON.parse(raw)?.version))notice='이전 기록 형식을 읽을 수 없어 새 조사를 시작합니다.';}catch{notice='저장된 기록을 읽을 수 없어 새 조사를 시작합니다.';}}
  soundOn=localStorage.getItem('1919-sound')==='on';
}catch{notice='이 브라우저에서는 기록을 저장할 수 없어요. 현재 탭에서는 계속 플레이할 수 있습니다.';}
const app=document.querySelector('#app');
const shortNames=['여성 노동자','팽크허스트','두 시민','러시아 농민','공장 노동자','젊은 노동자'];
const voiceNumbers=['01','02','03·04','05','06','07'];
const artTiles={pankhurst:[0,0],citizen:[1,0],german:[2,0],peasant:[0,1],factory:[1,1],young:[2,1]};
const esc=text=>String(text??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{notice='진행 기록 저장이 제한되어 있어요. 현재 탭에서 계속 플레이할 수 있습니다.';}}
function sound(type='page'){
  if(!soundOn)return;
  try{
    audioContext??=new (window.AudioContext||window.webkitAudioContext)();
    audioContext.resume().catch(()=>{});
    const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;
    oscillator.type=type==='page'?'triangle':'sine';
    oscillator.frequency.setValueAtTime(type==='record'?660:type==='clue'?520:180,now);
    oscillator.frequency.exponentialRampToValueAtTime(type==='record'?880:260,now+.12);
    gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.035,now+.02);gain.gain.exponentialRampToValueAtTime(.0001,now+.18);
    oscillator.connect(gain).connect(audioContext.destination);oscillator.start();oscillator.stop(now+.2);
  }catch{soundOn=false;}
}
function syncAmbience(){
  const needed=soundOn&&!document.hidden&&!modalType&&state.screen==='play'&&['woman','factory'].includes(currentScene(state).id)&&chapter(state).phase==='explore';
  if(!needed&&ambient){ambient.stop();ambient=null;}
  if(needed&&!ambient&&audioContext){
    const gain=audioContext.createGain();gain.gain.value=.006;
    ambient=audioContext.createOscillator();ambient.type='triangle';ambient.frequency.value=55;
    ambient.connect(gain).connect(audioContext.destination);ambient.start();ambient.onended=()=>gain.disconnect();
  }
}
document.addEventListener('visibilitychange',syncAmbience);
function artwork(art,extra=''){
  if(art==='woman')return `<img class="artwork woman-art ${extra}" src="${womanArtwork}" alt="공장 앞의 여성 노동자와 뒤에서 일하는 여성들">`;
  const [x,y]=artTiles[art]||artTiles.citizen;
  const names={pankhurst:'팽크허스트와 여성 참정권 운동에 참여한 동료들',citizen:'거리에서 신문을 든 평범한 시민',german:'독일의 투표소에 온 여성 시민',peasant:'밭에서 일하는 러시아 농민',factory:'공장에서 일하는 노동자',young:'거리의 젊은 노동자'};
  return `<svg class="artwork ${extra}" viewBox="${x*512} ${y*512} 512 512" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${names[art]}"><image href="${castArtwork}" width="1536" height="1024"/></svg>`;
}
function render(focus,top=false){
  const records=getRecords(state);
  app.innerHTML=`<header class="mast"><a href="#" data-action="home" class="brand">1919<span>목소리 조사단</span></a><div class="header-right"><button class="quiet sound-toggle" data-action="sound" aria-pressed="${soundOn}" aria-label="효과음 ${soundOn?'끄기':'켜기'}">${soundOn?'♫ 소리 켜짐':'♪ 소리 꺼짐'}</button><button class="quiet" data-action="map">변화 지도 <span class="count">${records.length}/7</span></button></div></header>${notice?`<p class="storage" role="status">${notice}</p>`:''}${state.screen==='intro'?intro():state.screen==='play'?play():state.screen==='discovery'?discovery():ending()}<footer><span>@BONSSAM 보은쌤과 함께하는 역사 수업</span><div><button class="quiet" data-action="sources">자료와 출처</button><button class="quiet" data-action="reset">처음부터</button></div></footer>${modalType?modal():''}`;
  bind();syncAmbience();
  if(focus)document.querySelector(focus)?.focus({preventScroll:!top});
  if(top)window.scrollTo({top:0,behavior:'instant'});
  animation='';
}
function intro(){
  const started=Object.values(state.chapters).some(c=>c.heard.length||c.record);
  return `<main class="intro"><div class="intro-grid"><section><div class="eyebrow">전쟁 이후의 유럽 · 1919</div><p class="issue">전쟁은 끝났다. 질문은 시작됐다.</p><h1>1919년,<br>당신이라면<br><em>무엇을 요구하시겠습니까?</em></h1><p class="lead">“전쟁 전의 세상으로<br>그대로 돌아갈 수는 없어.”</p><p class="description">당신은 세계 변화 조사단입니다.<br>일곱 사람의 목소리에서 변화의 단서를 찾아보세요.</p><button class="primary" data-action="start">${allComplete(state)?'완성한 조사 보기':started?'조사 이어하기':'사람들의 목소리 듣기'} →</button><p class="small">17~20분 분량 설계 · 점수 없이 · 이어하기 가능</p></section><figure class="intro-art">${artwork('woman')}<figcaption><span class="location-pin">● 유럽의 한 공업 도시</span><strong>이곳에 어떤 목소리가 있을까요?</strong></figcaption></figure></div><div class="steps"><span><b>01</b> 사람을 만나고</span><span><b>02</b> 말에서 단서를 찾고</span><span><b>03</b> 나만의 변화안을 만드세요</span></div></main>`;
}
function route(){return `<nav class="route" aria-label="조사 경로"><ol>${scenes.map((scene,index)=>`<li><button data-visit="${index}" aria-label="${shortNames[index]} 목소리로 이동" ${canVisit(state,index)?'':'disabled'} ${index===state.sceneIndex?'aria-current="step"':''} class="${chapter(state,scene.id).record?'visited':''}"><small>${voiceNumbers[index]} ${chapter(state,scene.id).record?'✓':''}</small><span>${shortNames[index]}</span></button></li>`).join('')}</ol></nav>`;}
function stageTrail(){
  const phase=chapter(state).phase,ids=['background','explore','activity','result'],labels=['만나기 전','이야기·단서','나의 생각','목소리 기록'];
  return `<ol class="stage-trail" aria-label="장면 진행 단계">${ids.map((id,i)=>`<li ${phase===id||phase==='history'&&id==='activity'?'aria-current="step"':''}><span>${i+1}</span>${labels[i]}</li>`).join('')}</ol>`;
}
function play(){
  const scene=currentScene(state),c=chapter(state),titles={background:'이 사람을 만나기 전에',explore:scene.id==='pankhurst'?'자료에서 그녀의 발자취 찾기':'무엇이 궁금한가요?',activity:activityTitle(scene.id),history:'우리의 생각, 실제 헌법과 만나기',result:'이 목소리를 지도에 남겼어요!'};
  return `<main class="workspace">${route()}<div class="section-heading"><div><div class="eyebrow">목소리 ${voiceNumbers[state.sceneIndex]} · ${scene.place}</div><h1 tabindex="-1" id="screen-title">${titles[c.phase]}</h1></div><span class="phase">${scene.time}</span></div>${stageTrail()}<div class="play-grid"><section class="main-panel ${animation}" data-scene="${scene.id}" data-phase="${c.phase}">${c.phase==='background'?background():c.phase==='result'?resultScreen():c.phase==='history'?historyScreen():c.phase==='activity'?activity():explore()}</section>${c.phase==='background'?'':notebook()}</div></main>`;
}
function activityTitle(id){return {woman:'그녀가 더 바라는 변화는 무엇으로 들렸나요?',pankhurst:'그녀의 행동은 어떤 변화를 만들었을까요?',citizens:'두 시민의 목소리를 선거에 담으려면?',peasant:'농민은 무엇을 바꾸고 싶었을까요?',factory:'그의 바람을 담은 제안을 해볼까요?',young:'두 바람을 담은 나의 변화안'}[id];}
function background(){
  const scene=currentScene(state);
  return `<div class="background-grid"><figure class="character-frame">${artwork(scene.art)}<figcaption>${scene.title}</figcaption></figure><section class="background-copy"><span class="pill">${scene.id==='pankhurst'?'실제 인물의 발자취':'새로운 목소리'}</span><h2>${scene.title}</h2><p>${scene.context}</p><p class="bridge">${scene.bridge}</p>${scene.id==='pankhurst'?'<details class="more"><summary>팽크허스트 더 알아보기</summary><p>에멀린 팽크허스트(1858~1928)는 여성의 선거권을 위해 동료들을 모으고 운동을 이끌었습니다. 참정권은 투표처럼 정치에 참여하는 권리예요. 그녀의 활동은 여러 운동가의 노력과 함께 여성 참정권 확대에 영향을 주었습니다.</p></details>':''}${scene.id==='peasant'?'<p class="previous-game"><a href="https://bon17.github.io/russia-1917-game/" target="_blank" rel="noopener">러시아 혁명 게임 떠올리기 ↗</a><small>앞 게임을 하지 않았어도 이 이야기로 이어갈 수 있어요.</small></p>':''}<button class="primary" data-action="listen">${scene.id==='pankhurst'?'그녀의 자료 살펴보기':'이야기 들으러 가기'} →</button></section></div>`;
}
function notebook(){
  const scene=currentScene(state),c=chapter(state),clues=scene.items.filter(i=>c.clues[i.id]);
  return `<aside class="notebook ${animation==='clue-added'?'note-pulse':''}"><details class="notes-disclosure" ${notesOpen?'open':''}><summary><span>✎ 조사 노트</span><small>단서 ${clues.length}/${scene.items.length}</small></summary>${clues.length?clues.map(item=>`<article class="note"><span>${item.topic}</span><p><mark>${item.clue}</mark></p></article>`).join(''):'<p class="empty-note">인물의 말에서 찾은 단서를<br>여기에 모아둘게요.</p>'}</details><button class="text-button" data-action="map">모은 목소리 ${getRecords(state).length}/7 ↗</button></aside>`;
}
function speaker(item){return item?.speaker||currentScene(state).title;}
function highlighted(text,clue,found){return found?esc(text).replace(esc(clue),`<mark class="ink">${esc(clue)}</mark>`):esc(text);}
function clueButtons(item,history=false){
  const c=chapter(state),found=history?c.history[item.id]:c.clues[item.id],items=history?constitution:currentScene(state).items;
  const options=items.indexOf(item)%2?[item.other,item.clue]:[item.clue,item.other];
  return `<section class="clue-task"><p class="clue-instruction">${found?'✓ 조사 노트에 남겼어요':'말에서 단서 한 구절을 골라보세요'}</p><div class="clue-options">${options.map(option=>`<button class="clue-button ${found===option?'selected':''}" data-clue="${item.id}" data-value="${esc(option)}" ${history?'data-history="true"':''} aria-pressed="${found===option}">“${option}”${found===option?' ✓':''}</button>`).join('')}</div></section>`;
}
function explore(){
  const scene=currentScene(state),c=chapter(state),item=scene.items.find(i=>i.id===c.active),done=scene.items.filter(i=>c.clues[i.id]).length;
  const name=speaker(item),art=item?.art||scene.art;
  const text=item?highlighted(item.answer,item.clue,!!c.clues[item.id]):esc(scene.opening);
  return `<nav class="story-tabs" aria-label="${scene.id==='pankhurst'?'살펴볼 자료':'듣고 싶은 이야기'}">${scene.items.map((i,index)=>`<button data-question="${i.id}" ${c.active===i.id?'aria-current="true"':''}><span>${index+1}</span>${i.label}<small>${c.clues[i.id]?'단서 ✓':c.heard.includes(i.id)?'단서 찾기':'열어보기'}</small></button>`).join('')}</nav><div class="conversation-grid ${animation==='speaker-enter'?'speaker-enter':''}" id="voice-panel" tabindex="-1"><figure class="character-frame">${artwork(art)}<figcaption class="speaker-name">${name}</figcaption></figure><section class="dialogue"><div class="reading-goal"><span>이번에 찾아볼 것</span><p>${item?.goal||'아래 이야기에서 이 사람이 바라는 변화를 찾아보세요.'}</p></div>${item?.year?`<span class="source-year">${item.year}</span>`:''}<${scene.id==='pankhurst'?'article':'blockquote'} class="speech"><span class="speaker-label">${scene.id==='pankhurst'?(item?.id==='letter'?'팽크허스트의 편지':item?.topic||'자료 안내'):name+'의 이야기'}</span><p>${text}</p></${scene.id==='pankhurst'?'article':'blockquote'}>${item?.id==='timeline'?timeline():''}${item?.source?`<small class="source-citation">${item.source}</small>`:''}${item?clueButtons(item):''}<div id="feedback" tabindex="-1" role="status">${feedbackHTML()}</div></section></div><div class="panel-bottom"><button class="text-button" data-action="background">← 만나기 전으로</button><span id="interview-progress" class="small">단서 ${done}/${scene.items.length}</span>${item&&c.clues[item.id]&&done<scene.items.length?'<button class="primary" data-action="next-item">다음 이야기 살펴보기 →</button>':`<button class="primary" data-action="activity" aria-describedby="interview-progress" ${canRecord(state)?'':'disabled'}>${scene.id==='young'?'나의 변화안 만들기':'생각 정리하기'} →</button>`}</div>`;
}
function timeline(){return `<div class="timeline"><div><strong>1918</strong><p>일부 30세 이상 여성<small>재산 등의 제한이 남아 있었어요.</small></p></div><span>→</span><div class="future"><strong>1928 <small>훗날</small></strong><p>남녀 모두 21세 이상<small>1919년에는 아직 일어나지 않은 변화예요.</small></p></div></div>`;}
function evidenceOptions(){return currentScene(state).items.map(i=>({id:i.id,label:i.clue,detail:i.topic}));}
function activityFields(){
  const id=currentScene(state).id;
  if(id==='woman')return [{name:'demand',title:'어떤 요구를 기록하고 싶나요?',intro:'일자리·생활·정치 참여 모두 그녀가 실제로 바란 변화예요. 주목한 요구를 골라주세요.',options:demands},{name:'evidence',title:'그렇게 들은 이유는 어떤 말인가요?',intro:'조사 노트에서 고른 요구와 이어지는 단서를 골라주세요.',options:evidenceOptions()}];
  if(id==='pankhurst')return [{name:'demand',title:'어떤 권리를 위해 법을 바꾸려 했나요?',intro:'1913년 편지에서 찾은 말을 떠올려보세요.',options:activityOptions.pankhurst.demand},{name:'action',title:'그 권리를 얻기 위해 무엇을 했나요?',intro:'동료들과 함께한 행동을 이어주세요.',options:activityOptions.pankhurst.action},{name:'impact',title:'여성의 선거권은 어떻게 달라졌나요?',intro:'1918년에 남은 제한과 훗날 1928년의 변화를 함께 생각해 보세요.',options:activityOptions.pankhurst.impact}];
  if(id==='citizens')return [{name:'system',title:'이 시민도 투표할 수 있는 제도는?',intro:'두 시민의 목소리가 나라의 결정에 반영되려면, 누가 투표할 수 있어야 할까요? A·B의 참여 범위를 비교해보세요.',options:activityOptions.citizens.system},{name:'reason',title:'그 선거 방식을 제안한 이유는?',intro:'선거가 열리는 것과 시민이 참여하는 것은 함께 살펴야 해요.',options:activityOptions.citizens.reason}];
  if(id==='peasant')return [{name:'demand',title:'농민은 무엇을 바꾸고 싶었나요?',intro:'농사를 짓는 땅과 생활을 연결해보세요.',options:activityOptions.peasant.demand},{name:'evidence',title:'그 요구와 이어지는 말은?',intro:'농민이 이야기한 어려움을 골라주세요.',options:activityOptions.peasant.evidence}];
  if(id==='factory')return [{name:'proposal',title:'그가 바라는 변화에 어떤 제안을 할까요?',intro:'생활의 어려움과 공장·이익의 운영을 함께 생각해보세요.',options:activityOptions.factory.proposal},{name:'evidence',title:'이 제안과 이어지는 발언은?',intro:'고른 제안이 어떤 바람을 다루는지 연결해보세요.',options:evidenceOptions()}];
  const o=availableProposals(state),e=evidenceOptions();
  return [{name:'political',title:'정치에 참여할 권리를 위한 제안',intro:'지금까지 모은 카드에서 아이디어를 골라주세요. 타당한 제안은 여러 가지예요.',options:o.political},{name:'politicalEvidence',title:'정치 제안의 이유가 된 말은?',intro:'이 노동자가 정치에서 바라는 것을 연결하세요.',options:e},{name:'economic',title:'더 나은 생활을 위한 제안',intro:'이번에는 노동자의 경제적 삶을 다룰 아이디어를 골라주세요.',options:o.economic},{name:'economicEvidence',title:'생활 제안의 이유가 된 말은?',intro:'두 제안에 각각의 근거를 담아 완성해보세요.',options:e}];
}
function activity(){
  const scene=currentScene(state),c=chapter(state),fields=activityFields(),step=Math.min(c.step,fields.length-1),field=fields[step];
  return `<div class="activity-person">${artwork(scene.art,'small-portrait')}<div><span class="pill">내 생각 ${step+1}/${fields.length}</span><h2>${scene.title}</h2></div></div>${scene.id==='citizens'&&step===0?'<div class="build-up">여성의 참여를 바꾼 이야기에서, 더 많은 시민의 참여로 이어집니다.<br>“재산이 적은 나도 나라의 결정에 참여할 수 있을까요?”</div>':''}${scene.id==='young'?proposalPair(c.form):''}<p class="task">${field.intro}</p><fieldset><legend>${field.title}</legend><div class="choices">${field.options.map((o,index)=>`<label class="choice ${c.form[field.name]===o.id?'chosen':''}"><input type="radio" name="${field.name}" value="${o.id}" ${c.form[field.name]===o.id?'checked':''}><span class="choice-icon">${String.fromCharCode(65+index)}</span><span><strong>${o.label}</strong>${o.detail||o.source?`<small>${o.detail||o.source}</small>`:''}</span></label>`).join('')}</div></fieldset><div id="feedback" tabindex="-1" role="status">${feedbackHTML()}</div><div class="panel-bottom"><button class="text-button" data-action="${step?'prev-step':'explore'}">← ${step?'앞의 선택':'이야기 다시 보기'}</button><div class="activity-actions">${step===fields.length-1?'<button class="quiet" data-action="hint">단서 함께 보기</button><button class="primary" data-action="submit">인물에게 확인하기 →</button>':`<button class="primary" data-action="next-step" ${c.form[field.name]?'':'disabled'}>이 생각 이어가기 →</button>`}</div></div>`;
}
function proposalPair(form){
  const options=availableProposals(state);
  return `<div class="proposal-pair"><div><span>정치에 참여하기</span><p>${options.political.find(o=>o.id===form.political)?.label||'첫 번째 바람을 담아주세요'}</p></div><b class="pair-link">＋</b><div class="economic"><span>더 나은 생활</span><p>${options.economic.find(o=>o.id===form.economic)?.label||'두 번째 바람을 담아주세요'}</p></div></div>`;
}
function historyScreen(){
  return `<span class="pill">두 시민의 요구와 연결되는 실제 자료</span><h2>바이마르 헌법 · 1919년</h2><p class="task">독일은 새 나라의 원칙을 헌법에 담았습니다. 누가 권력을 갖고, 누가 선거에 참여하는지 찾아보세요.</p><div class="constitution">${constitution.map(item=>`<article><div class="reading-goal"><span>찾아볼 것</span><p>${item.goal}</p></div><h3>${item.number}</h3><blockquote>${highlighted(item.text,item.clue,!!chapter(state).history[item.id])}</blockquote>${clueButtons(item,true)}</article>`).join('')}</div><p class="source-citation">동아 역사1 교과서 187쪽 · 바이마르 헌법 제1조·제22조</p><div id="feedback" tabindex="-1" role="status">${feedbackHTML()}</div><div class="panel-bottom"><button class="text-button" data-action="edit">← 내 제안 다시 보기</button><button class="primary" data-action="confirm-record" ${historyComplete(state)?'':'disabled'}>두 목소리 기록하기 →</button></div>`;
}
function feedbackHTML(){return feedback?`<div class="feedback"><strong>${feedback.title}</strong><p>${feedback.text}</p>${chapter(state).phase==='activity'?'<button class="text-button" data-action="edit">선택을 다시 살펴보기 →</button>':''}</div>`:'';}
function hint(){
  const hints={woman:'일자리와 생활비에 관한 말도, 정치에 참여하고 싶다는 말도 실제 요구예요. 당신이 고른 요구와 이어지는 말을 연결해보세요.',pankhurst:'편지에는 선거법, 활동에는 동료들과 함께한 운동이 등장해요. 권리는 1918년에서 훗날 1928년까지 점차 확대되었어요.',citizens:'제도 A에서는 재산이 적은 시민이 빠져요. 제도 B에서는 더 많은 시민이 같은 한 표로 참여해요.',peasant:'농사를 짓는 사람과 땅을 가진 사람이 다르다는 이야기를 떠올려보세요.',factory:'생활 지원도 도움이 돼요. 그는 함께 공장을 운영하고 이익을 나누는 방식도 바라고 있어요.',young:'대표를 뽑고 싶다는 말과 안전하게 살고 싶다는 말을 각각의 제안에 연결하세요.'};
  return {title:'함께 볼 단서',text:hints[currentScene(state).id]};
}
function resultScreen(){
  const scene=currentScene(state),c=chapter(state),response=evaluate(state,scene.id,c.record).text;
  const ids={woman:['woman'],pankhurst:['pankhurst'],citizens:['citizen','german'],peasant:['peasant'],factory:['factory'],young:['young']}[scene.id];
  const records=getRecords(state).filter(r=>ids.includes(r.id));
  let explanation='';
  if(scene.id==='woman')explanation='<details class="more"><summary>이 요구는 어떤 역사 개념과 이어질까요?</summary><p>정치 참여 확대는 민주주의의 확산과 이어집니다. 일자리·생활의 요구도 함께 존재했어요. 경제적 요구를 했다는 이유만으로 사회주의라고 분류하지는 않아요.</p></details>';
  if(scene.id==='pankhurst')explanation=`<section class="learning-note"><h3>여성의 한 표를 위한 노력</h3><p>팽크허스트는 동료들을 모으고 법 개정을 요구하는 운동을 이끌었어요. 여러 운동가의 노력과 전쟁 중 여성의 기여가 참정권 확대에 영향을 주었습니다.</p>${timeline()}</section>`;
  if(scene.id==='citizens')explanation='<section class="learning-note"><h3>더 많은 사람의 한 표 → 민주주의의 확산</h3><p>1919년 바이마르 공화국은 국민에게서 나오는 국가 권력과 20세 이상 남녀의 보통 선거를 헌법에 담았습니다.</p><details class="more"><summary>공화정과 민주주의는 어떤 관계일까요?</summary><p>공화정은 군주가 없는 국가 형태예요. 모든 공화국이 항상 민주적인 것은 아니에요. 여기서는 헌법에 시민의 정치 참여를 확대하는 규정이 함께 있다는 점을 살펴봤어요.</p></details></section>';
  if(scene.id==='peasant')explanation='<p class="historical">농민의 토지 요구는 경제적 삶의 문제예요. 다음에는 러시아 밖 노동자의 요구를 만나봅시다.</p>';
  if(scene.id==='factory')explanation='<section class="concept socialism"><span class="pill">요구에서 발견한 역사 개념</span><h3>사회주의의 확산</h3><p>경제적 불평등을 줄이기 위해 공장과 토지 같은 생산에 필요한 재산을 <b>사회 전체의 이익에 맞게 소유·운영</b>하자는 주장이었어요.</p><p>사회주의 운동은 러시아 혁명 이전부터 있었고, 혁명은 다른 나라의 운동에도 영향을 주었습니다.</p><details class="more"><summary>소유·운영·분배, 조금 더 알아보기</summary><p>소유는 ‘누구의 것인가’, 운영은 ‘누가 어떻게 결정하는가’, 분배는 ‘이익을 어떻게 나누는가’의 문제예요. 구체적인 방법에는 여러 논의가 있었어요. 생활 개선을 바라는 사람 모두가 사회주의자는 아닙니다.</p></details></section>';
  if(scene.id==='young')explanation=proposalPair(c.record);
  return `<div class="complete-badge">목소리 기록 ✓${scene.voices===2?' · 두 시민':''}</div><h2 class="complete-title">${records.map(r=>r.title).join(' · ')}</h2><div class="result-voice">${artwork(scene.art,'small-portrait')}<blockquote class="confirmation">${response}</blockquote></div><div class="earned-cards">${records.map(r=>`<article class="earned-card" data-record="${r.id}"><small>${r.person}</small><h3>${r.title}</h3><p>${r.areas.length===2?'정치적 권리 + 경제적 삶':r.areas[0]==='political'?'정치 참여 확대':'경제적 삶의 개선'}</p>${r.concept==='democracy'?'<strong>민주주의의 확산</strong>':''}</article>`).join('')}</div>${explanation}<details class="result-evidence more"><summary>내가 연결한 발언과 제안 다시 보기</summary>${records.map(r=>`<p>${r.proposal}</p>${r.evidence.map(e=>`<p class="historical">${e}</p>`).join('')}`).join('')}</details><div class="result-actions"><button class="primary" data-action="next">${scene.id==='young'?'핵심 발견 확인하기':'다음 목소리 듣기'} →</button><button class="text-button" data-action="map">변화 지도 보기 ↗</button><button class="text-button" data-action="explore">이야기 다시 보기</button><button class="text-button" data-action="revise">다른 제안도 살펴보기 ↗</button></div>`;
}
function discovery(){
  const young=getRecords(state).find(r=>r.id==='young');
  return `<main class="summary-page"><div class="eyebrow">YOUR DISCOVERY · 7개의 목소리</div><h1 id="screen-title" tabindex="-1">두 바람을 함께<br>품을 수 있습니다.</h1><p class="discovery-lead">민주주의와 사회주의는 같은 질문에 대한<br><strong>서로 반대의 답이 아닙니다.</strong></p><div class="discovery-columns"><article><span>정치에 관한 질문</span><h2>민주주의</h2><h3>누가 정치에 참여하고 결정하는가?</h3><p>더 많은 사람의 정치 참여</p></article><article class="economic"><span>경제에 관한 질문</span><h2>사회주의</h2><h3>경제와 재산을 어떻게 운영하고 분배할 것인가?</h3><p>경제적 평등과 사회 전체의 이익 강조</p></article></div><div class="own-proposal"><span>당신이 젊은 노동자에게 제안한 변화</span><p>${young.proposal}</p></div><p class="historical">오늘 살펴본 것은 당시 확산을 이해하기 위한 두 질문입니다. 사람들은 더 많은 정치적 권리와 더 나은 경제적 삶을 함께 요구하기도 했습니다.</p><button class="primary" data-action="ending">1919년의 변화 정리하기 →</button></main>`;
}
function ending(){
  const young=getRecords(state).find(r=>r.id==='young');
  return `<main class="summary-page ending"><div class="eyebrow">INVESTIGATION COMPLETE · ${getRecords(state).length}/7</div><h1 id="screen-title" tabindex="-1">1919년,<br>사람들이 원했던 변화</h1><div class="war-chain"><span>제1차 세계 대전</span><b>↓</b><p>전쟁 피해 · 물가 상승 · 식량 부족 · 사회 변화</p><b>↓</b><strong>“예전 세상으로 그대로 돌아갈 수 없다.”</strong></div><div class="discovery-columns ending-columns"><article><span>“나도 정치에 참여하고 싶다.”</span><h2>정치 참여 확대</h2><p>여성 참정권 · 보통 선거 · 공화정</p><b>↓</b><h3>민주주의의 확산</h3></article><article class="economic"><span>“더 평등하게 살고 싶다.”</span><h2>경제적 평등의 요구</h2><p>노동자 문제 · 토지 문제<br>1917년 러시아 혁명의 영향</p><b>↓</b><h3>사회주의의 확산</h3></article></div><p class="ending-discovery">둘은 반드시 서로 반대되는 선택이 아닙니다.<br>정치적 권리와 더 나은 경제적 삶을 함께 요구할 수 있습니다.</p><div class="own-proposal"><span>나의 1919년 변화안</span><p>${young.proposal}</p></div><blockquote class="discussion">1919년 여러분이 노동자라면,<br>민주주의와 사회주의 가운데 반드시 하나만 선택해야 했을까요?<small>친구들과 선택한 이유를 이야기해 보세요.</small></blockquote><div class="result-actions"><button class="primary" data-action="map">나의 1919년 변화 지도 확인하기 ↗</button><button class="text-button" data-action="discovery">핵심 발견 다시 보기</button><button class="text-button" data-action="review">목소리 다시 살펴보기</button></div><p class="historical">나라와 시기에 따라 변화의 범위는 달랐습니다. 공화정이 항상 민주주의를 보장하는 것은 아니고, 생활 개선을 원하는 사람 모두가 사회주의자인 것도 아닙니다.</p></main>`;
}
function mapCard(record,area){return `<details class="map-card" data-card-id="${record.id}" data-area="${area}"><summary><span>${record.person}${record.areas.length===2?' · 두 영역에 연결된 한 목소리':''}</span><h4>${record.title}</h4><small>근거와 제안 펼쳐 보기</small></summary><div class="card-detail"><p>${record.proposal}</p>${record.evidence.map(e=>`<p class="card-evidence">${e}</p>`).join('')}<small>${record.source}</small></div></details>`;}
function modal(){
  if(modalType==='reset')return `<dialog open class="overlay" aria-modal="true" aria-labelledby="modal-title"><div class="modal reset-modal"><h2 id="modal-title" tabindex="-1">처음부터 조사할까요?</h2><p>이 게임의 대화와 조사 기록이 초기화됩니다.</p><div class="panel-bottom"><button class="quiet" data-action="close">계속하기</button><button class="primary" data-action="confirm-reset">처음부터 시작</button></div></div></dialog>`;
  if(modalType==='sources')return `<dialog open class="overlay" aria-modal="true" aria-labelledby="modal-title"><div class="modal"><button class="close" data-action="close" aria-label="출처 닫기">✕</button><h2 id="modal-title" tabindex="-1">자료와 출처</h2><div class="source-list"><h3>동아 역사1 교과서</h3><p>184~185쪽: 러시아 혁명과 사회주의 개혁·확산.<br>187쪽: 팽크허스트의 편지(1913), 체포 사진(1914), 여성 참정권 확대 연표, 바이마르 헌법 제1조·제22조.</p><p>편지는 교과서에 실린 앞부분을 발췌했습니다. 헌법 조항은 교과서에 실린 제1조·제22조를 제시했습니다. 체포 장면은 교과서 사진의 내용을 글로 설명합니다.</p><h3>팽크허스트와 여성 참정권</h3><p>에멀린 팽크허스트(1858~1928)는 실제 인물입니다. 1903년 여성 사회 정치 연맹(WSPU)을 조직했습니다. 1918년 영국 여성 선거권에는 30세 이상·재산 등의 조건이 있었고, 1928년에 남성과 같은 21세 이상 연령 조건이 되었습니다. 권리 확대에는 여러 운동가의 활동과 전쟁 중 여성의 기여가 함께 영향을 주었습니다.</p><h3>대사와 그림</h3><p>편지와 헌법 인용을 제외한 인물 대사는 역사적 상황을 바탕으로 만든 수업용 대사입니다. 그림은 AI로 만든 수업용 재구성 삽화이며 실제 역사 사진이 아닙니다. 팽크허스트 그림도 1914년의 체포 사진을 재현한 것이 아닙니다. 선거 제도 A·B는 참여 범위를 비교하기 위한 가상 예시입니다.</p><h3>러시아 혁명 게임과 연결</h3><p>이전 게임의 토지 요구를 짧게 돌아봅니다. 계정이나 완료 기록은 필요하지 않습니다. 사회주의 운동은 러시아 혁명 이전에도 있었으며, 혁명 뒤 다른 나라로 영향이 이어졌습니다.</p><a href="https://bon17.github.io/russia-1917-game/" target="_blank" rel="noopener">러시아 혁명 게임 ↗</a><h3>수업 시간과 시점</h3><p>본편 17분과 다시 읽기·수정 여유 3분으로 설계했습니다. 실제 학생의 읽기 속도는 수업에서 확인해야 합니다. 강제 타이머와 감점은 없습니다. 1928년은 1919년에서 바라본 훗날의 변화이고, 소련 성립(1922)도 이후의 사건입니다.</p><p>효과음은 기본으로 꺼져 있습니다. 소리를 켜면 공장 장면의 작은 배경음과 단서·기록 효과음이 나옵니다. 기기의 ‘동작 줄이기’ 설정도 따릅니다.</p></div><button class="primary" data-action="close">조사로 돌아가기 →</button></div></dialog>`;
  const records=getRecords(state),learned=concepts(state);
  return `<dialog open class="overlay" aria-modal="true" aria-labelledby="modal-title"><div class="modal map-modal"><button class="close" data-action="close" aria-label="지도 닫기">✕</button><div class="eyebrow">MAP OF CHANGE · ${records.length}/7</div><h2 id="modal-title" tabindex="-1">나의 1919년 변화 지도</h2><p class="muted">${records.length}개의 목소리를 모았습니다. 카드를 펼치면 요구·근거·제안을 다시 볼 수 있어요.</p><div class="map-columns">${[['political','정치 참여의 확대',learned.democracy?'민주주의의 확산':'???'],['economic','경제적 삶의 개선',learned.socialism?'사회주의의 확산':'???']].map(([area,title,concept])=>`<section><h3>${title}</h3>${records.some(r=>r.areas.includes(area))?records.filter(r=>r.areas.includes(area)).map(r=>mapCard(r,area)).join(''):'<div class="map-empty">이 영역의 요구를<br>조사해 모아보세요.</div>'}<strong class="map-concept">${concept}</strong></section>`).join('')}</div><p class="historical">${learned.socialism?'경제적 요구 모두가 사회주의와 같은 뜻은 아닙니다. 공장 노동자 장면에서 소유·운영·분배의 변화와 사회주의의 뜻을 함께 살펴봤습니다.':'이야기를 먼저 만나고, 역사 개념의 이름은 조사하면서 연결합니다.'} 정치적 권리와 더 나은 경제적 삶은 함께 요구할 수 있습니다.</p>${allComplete(state)?'<p class="map-discussion">1919년 여러분이 노동자라면, 반드시 하나만 선택해야 했을까요?</p>':''}<button class="primary" data-action="close">${allComplete(state)?'나의 조사로 돌아가기':'조사 계속하기'} →</button></div></dialog>`;
}
function action(name){
  let focus='#screen-title',top=false;
  if(name==='sound'){
    soundOn=!soundOn;try{localStorage.setItem('1919-sound',soundOn?'on':'off');}catch{}
    if(soundOn)sound('clue');else audioContext?.suspend().catch(()=>{});
    render('[data-action="sound"]');return;
  }
  if(name==='home'){state.screen='intro';top=true;}
  if(name==='start'){state.screen=allComplete(state)?'ending':'play';top=true;animation='scene-enter';sound();}
  if(name==='review'){visitScene(state,0);feedback=null;top=true;}
  if(name==='listen'){chapter(state).phase='explore';if(!chapter(state).active)hear(currentScene(state).items[0].id);feedback=null;top=true;animation='speaker-enter';sound();}
  if(name==='background'){chapter(state).phase='background';feedback=null;top=true;}
  if(name==='activity'){if(!canRecord(state))return;chapter(state).phase='activity';chapter(state).step=0;feedback=null;top=true;animation='scene-enter';sound();}
  if(name==='explore'){chapter(state).phase='explore';feedback=null;top=true;}
  if(name==='next-item'){const c=chapter(state),next=currentScene(state).items.find(i=>!c.clues[i.id]);if(next)hear(next.id);feedback=null;focus='#voice-panel';animation='speaker-enter';sound();}
  if(name==='next-step'){const c=chapter(state),fields=activityFields();if(!c.form[fields[c.step].name]||c.step>=fields.length-1)return;c.step++;feedback=null;top=true;sound();}
  if(name==='prev-step'){chapter(state).step=Math.max(0,chapter(state).step-1);feedback=null;top=true;}
  if(name==='edit'){chapter(state).step=0;chapter(state).phase='activity';feedback=null;top=true;}
  if(['submit','confirm-record'].includes(name)){
    feedback=completeChapter(state);
    if(feedback.ok||feedback.kind==='history'){feedback=null;top=true;animation=chapter(state).phase==='result'?'record-collected':'scene-enter';sound(chapter(state).phase==='result'?'record':'page');}else focus='#feedback';
  }
  if(name==='hint'){feedback=hint();focus='#feedback';}
  if(name==='revise'){chapter(state).form={...chapter(state).record};chapter(state).step=0;chapter(state).phase='activity';feedback=null;top=true;}
  if(name==='next'){if(!nextScene(state))return;feedback=null;top=true;animation='scene-enter';sound();}
  if(name==='ending'){if(!allComplete(state))return;state.screen='ending';top=true;sound();}
  if(name==='discovery'){if(!allComplete(state))return;state.screen='discovery';top=true;}
  if(['map','reset','sources'].includes(name)){modalReturn=`[data-action="${name}"]`;modalType=name;focus='#modal-title';}
  if(name==='close'){modalType=null;focus=modalReturn;}
  if(name==='confirm-reset'){state=initialState();modalType=null;feedback=null;top=true;}
  save();render(focus,top);
  if(focus==='#feedback')document.querySelector('#feedback')?.scrollIntoView({block:'nearest'});
  if(focus==='#voice-panel')document.querySelector('#voice-panel')?.scrollIntoView({block:'start'});
}
function hear(id){const c=chapter(state);if(!currentScene(state).items.some(i=>i.id===id))return;c.active=id;if(!c.heard.includes(id))c.heard.push(id);}
function bind(){
  app.querySelectorAll('[data-action]').forEach(el=>el.onclick=e=>{e.preventDefault();action(el.dataset.action);});
  app.querySelectorAll('[data-visit]').forEach(el=>el.onclick=()=>{if(visitScene(state,Number(el.dataset.visit))){feedback=null;animation='scene-enter';save();render('#screen-title',true);sound();}});
  app.querySelectorAll('[data-question]').forEach(el=>el.onclick=()=>{hear(el.dataset.question);feedback=null;animation='speaker-enter';save();render('#voice-panel');document.querySelector('#voice-panel')?.scrollIntoView({block:'start'});sound();});
  app.querySelectorAll('[data-clue]').forEach(el=>el.onclick=()=>{
    if(selectClue(state,el.dataset.clue,el.dataset.value,el.dataset.history==='true')){feedback=null;animation='clue-added';sound('clue');}
    else{feedback={title:'이 말도 상황을 알려주네요.',text:'위의 ‘찾아볼 것’을 다시 확인해보세요. 그 질문에 직접 답하는 말 한 구절을 골라볼까요?'};}
    save();render(`[data-clue="${el.dataset.clue}"][data-value="${el.dataset.value}"]`);
  });
  app.querySelectorAll('input[type="radio"]').forEach(el=>el.onchange=()=>{chapter(state).form[el.name]=el.value;feedback=null;save();render(`input[name="${el.name}"][value="${el.value}"]`);});
  const notes=app.querySelector('.notes-disclosure');if(notes)notes.ontoggle=()=>{notesOpen=notes.open;};
  const dialog=app.querySelector('dialog');
  if(dialog){
    [...app.children].filter(el=>el!==dialog).forEach(el=>el.inert=true);
    dialog.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();modalType=null;render(modalReturn);}
      if(event.key==='Tab'){
        const items=[...dialog.querySelectorAll('button,input,a[href],summary')],first=items[0],last=items.at(-1);
        if(event.shiftKey&&(document.activeElement===first||!items.includes(document.activeElement))){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&(document.activeElement===last||!items.includes(document.activeElement))){event.preventDefault();first.focus();}
      }
    });
  }
}
render();
