import {questions,demands,scenes,activityOptions,initialState,restore,currentScene,chapter,canRecord,canVisit,allComplete,availableProposals,evaluate,getRecords,concepts,completeChapter,nextScene,visitScene} from './game.js';
const storageKey='1919-prototype-v1';
const womanArtwork='assets/woman-worker.webp';
const castArtwork='assets/cast-sheet.webp';
let state=initialState(),notice='',feedback=null,modalType=null,modalReturn='[data-action="map"]';
let notesOpen=window.matchMedia('(min-width:651px)').matches;
try{
  const raw=localStorage.getItem(storageKey);
  state=restore(raw);
  if(raw){try{if(![1,2,3].includes(JSON.parse(raw)?.version))notice='이전 기록 형식을 읽을 수 없어 새 조사를 시작합니다.';}catch{notice='저장된 기록을 읽을 수 없어 새 조사를 시작합니다.';}}
}catch{notice='이 브라우저에서는 기록을 저장할 수 없어요. 현재 탭에서는 계속 플레이할 수 있습니다.';}
const app=document.querySelector('#app');
const shortNames=['여성 노동자','팽크허스트','두 시민','러시아 농민','공장 노동자','젊은 노동자'];
const voiceNumbers=['01','02','03·04','05','06','07'];
const artTiles={pankhurst:[0,0],citizen:[1,0],german:[2,0],peasant:[0,1],factory:[1,1],young:[2,1]};
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{notice='진행 기록 저장이 제한되어 있어요. 현재 탭에서 계속 플레이할 수 있습니다.';}}
function artwork(art,portrait=false){
  const label=art==='pankhurst'?'팽크허스트를 표현한 수업용 재구성 삽화':'1919년 사람들의 생활을 표현한 수업용 재구성 삽화';
  if(art==='woman')return `<img class="${portrait?'portrait':'scene-picture'}" src="${womanArtwork}" alt="공장과 여성 노동자의 수업용 재구성 삽화">`;
  const [x,y]=artTiles[art]||artTiles.citizen;
  return `<svg class="${portrait?'portrait':'scene-picture'}" viewBox="${x*512} ${y*512} 512 512" preserveAspectRatio="xMidYMin slice" role="img" aria-label="${label}"><image href="${castArtwork}" width="1536" height="1024"/></svg>`;
}
function render(focus,top=false){
  const records=getRecords(state);
  app.innerHTML=`<header class="mast"><a href="#" data-action="home" class="brand">1919<span>목소리 조사단</span></a><div class="header-right"><span class="edition">7명의 목소리 · 전쟁 뒤의 유럽</span><button class="quiet" data-action="map">변화 지도 <span class="count">${records.length}/7</span></button></div></header>${notice?`<p class="storage" role="status">${notice}</p>`:''}${state.screen==='intro'?intro():state.screen==='play'?play():state.screen==='discovery'?discovery():ending()}<footer><span>@BONSSAM 보은쌤과 함께하는 역사 수업</span><div><button class="quiet" data-action="sources">자료와 출처</button><button class="quiet" data-action="reset">처음부터</button></div></footer>${modalType?modal():''}`;
  bind();
  if(focus)document.querySelector(focus)?.focus({preventScroll:!top});
  if(top)window.scrollTo({top:0,behavior:'instant'});
}
function intro(){
  const started=Object.values(state.chapters).some(c=>c.heard.length||c.record);
  return `<main class="intro"><div class="eyebrow">EUROPE AFTER THE WAR · 1919</div><div class="intro-grid"><section><p class="issue">전쟁은 끝났다. 질문은 시작됐다.</p><h1>1919년,<br>당신이라면<br><em>무엇을 요구하시겠습니까?</em></h1><p class="lead">“전쟁 전의 세상으로<br>그대로 돌아갈 수는 없어.”</p><p class="description">당신은 세계 변화 조사단입니다.<br>일곱 사람의 목소리를 듣고, 그들이 원하는 변화를 찾아보세요.</p><button class="primary" data-action="start">${allComplete(state)?'완성한 조사 보기':started?'조사 이어하기':'사람들의 목소리 듣기'} <span>↗</span></button><p class="small">약 17~20분 분량 · 점수 없이 · 같은 브라우저에서 이어하기</p><div class="intro-route"><span>질문하기</span><span>자료 살펴보기</span><span>제도 비교하기</span><span>나의 변화안 만들기</span></div></section><figure class="intro-art"><img src="${womanArtwork}" alt="1919년의 공장과 여성 노동자를 표현한 수업용 삽화" fetchpriority="high"><figcaption><span>전쟁이 끝난 뒤, 새로운 바람</span><strong>목소리를 모으면<br>변화가 보입니다.</strong><small>수업용 재구성 삽화</small></figcaption></figure></div><div class="steps"><span><b>01</b> 이야기를 듣고</span><span><b>02</b> 근거를 연결하고</span><span><b>03</b> 함께 바랐던 변화를 발견하세요</span></div></main>`;
}
function route(){return `<nav class="route" aria-label="조사 경로"><ol>${scenes.map((scene,index)=>`<li><button data-visit="${index}" ${canVisit(state,index)?'':'disabled'} ${index===state.sceneIndex?'aria-current="step"':''} class="${chapter(state,scene.id).record?'visited':''}"><small>${voiceNumbers[index]} ${chapter(state,scene.id).record?'✓':''}</small><span>${shortNames[index]}</span></button></li>`).join('')}</ol></nav>`;}
function person(scene=currentScene(state)){
  const art=scene.id==='citizens'&&chapter(state).active==='german'?'german':scene.art;
  return `<div class="person">${artwork(art,true)}<div><span class="eyebrow">${scene.place}</span><h2>${scene.title}</h2><span class="small">${scene.id==='pankhurst'?'실제 인물 · 대사와 그림은 수업용 재구성':'역사적 상황을 바탕으로 재구성한 목소리'}</span></div></div>`;
}
function play(){
  const scene=currentScene(state),c=chapter(state);
  const titles={explore:scene.subtitle,activity:activityTitle(scene.id),result:'이 목소리를 지도에 남겼습니다.'};
  return `<main class="workspace">${route()}<div class="section-heading"><div><div class="eyebrow">FIELD NOTE · ${voiceNumbers[state.sceneIndex]}</div><h1 tabindex="-1" id="screen-title">${titles[c.phase]}</h1></div><span class="phase">${scene.activity} · ${scene.time}</span></div><div class="play-grid"><section class="main-panel" data-scene="${scene.id}">${c.phase==='result'?resultScreen():c.phase==='activity'?activity():explore()}</section>${notebook()}</div></main>`;
}
function activityTitle(id){return {woman:'어떤 요구를 기록할까요?',pankhurst:'요구가 활동과 변화로 이어졌나요?',citizens:'두 시민의 요구에 맞는 제도는?',peasant:'농민은 무엇을 바꾸고 싶었을까요?',factory:'그가 바라는 변화를 제안해 보세요.',young:'두 바람을 담은 나의 변화안'}[id];}
function notebook(){
  const scene=currentScene(state),c=chapter(state);
  return `<aside class="notebook"><details class="notes-disclosure" ${notesOpen?'open':''}><summary><span class="eyebrow">YOUR NOTEBOOK</span><span class="notes-title">조사 노트 <small>${c.heard.length}/${scene.items.length}</small></span></summary><p class="muted">직접 확인한 이야기와 자료가 판단의 근거가 됩니다.</p>${c.heard.length?c.heard.map(id=>{const item=scene.items.find(i=>i.id===id);return `<article class="note"><span>${item.topic}</span><p>${item.answer}</p></article>`;}).join(''):'<div class="empty-note"><span>✎</span><p>이야기와 자료를 살펴보면<br>이곳에 단서가 쌓여요.</p></div>'}</details><div class="map-teaser"><span>모은 목소리 ${getRecords(state).length}/7</span><strong>${c.record?'이 장면의 요구가 기록되었어요.':'다른 사람의 요구도 함께 모아보세요.'}</strong><button class="text-button" data-action="map">변화 지도 펼치기 ↗</button></div></aside>`;
}
function explore(){
  const scene=currentScene(state),c=chapter(state),item=scene.items.find(i=>i.id===c.active);
  const art=scene.id==='citizens'&&c.active==='german'?'german':scene.art;
  const sourceMode=scene.id==='pankhurst';
  const quote=sourceMode?'':`<blockquote id="active-story" tabindex="-1" aria-live="polite" aria-atomic="true">“${item?item.answer:scene.opening}”</blockquote>`;
  return `${person()}<figure class="scene-art">${artwork(art)}<figcaption>${scene.place} · 수업용 재구성 삽화</figcaption></figure><section class="scene-background"><h3>이 사람을 만나기 전에</h3><p>${scene.context}</p><div class="context-facts">${scene.facts.map(f=>`<span>${f}</span>`).join('')}</div></section>${sourceMode?`<p class="historical portrait-statement">“${scene.opening}”<small>${scene.quoteNote}</small></p>`:quote}<div class="prompt"><h3>${sourceMode?'세 자료를 살펴보세요.':scene.id==='peasant'?'앞 게임의 목소리를 떠올려 보세요.':'무엇이 궁금한가요?'}</h3><p>${sourceMode?'자료를 비교하며 요구·활동·영향을 찾아보세요.':scene.id==='young'?'두 바람을 모두 듣고, 모은 카드에서 제안을 골라보세요.':'이야기를 충분히 듣고, 발언을 근거로 생각을 연결해 보세요.'}</p></div><div class="questions ${sourceMode?'source-buttons':''}">${scene.items.map((q,index)=>`<button class="question ${c.active===q.id?'selected':''}" data-question="${q.id}" aria-pressed="${c.active===q.id}"><span class="question-number">0${index+1}</span><span>${q.label}</span><small>${c.heard.includes(q.id)?'확인한 자료 ✓':sourceMode?'자료 열기 ↗':'이야기 듣기 ↗'}</small></button>`).join('')}</div>${sourceMode&&item?sourceDetail(item):!sourceMode&&item?.detail?`<div class="source-detail"><p>${item.detail}</p><small>${item.source||''}</small></div>`:''}${scene.id==='peasant'?`<p class="historical previous-game">이전 게임을 아직 하지 않았어도 이 장면의 이야기로 이어갈 수 있어요. <a href="https://bon17.github.io/russia-1917-game/" target="_blank" rel="noopener">러시아 혁명 게임 보기 ↗</a></p>`:''}<div class="panel-bottom"><span class="small" id="interview-progress" role="status">${canRecord(state)?'필요한 이야기를 모두 확인했어요. 이제 생각을 정리해 보세요.':`${sourceMode?'자료':'이야기'} ${c.heard.length}/${scene.items.length} · 모두 확인한 뒤 정리할 수 있어요.`}</span><button class="primary" data-action="activity" aria-describedby="interview-progress" ${canRecord(state)?'':'disabled'}>${canRecord(state)?(scene.id==='young'?'나의 변화안 만들기 →':'생각 정리하기 →'):`${c.heard.length}/${scene.items.length} · 모두 살펴보세요`}</button></div>`;
}
function sourceDetail(item){
  return `<article class="source-detail" id="active-source" tabindex="-1" aria-live="polite"><span class="source-year">${item.year}</span><h3>${item.topic}</h3><p>${item.answer}</p><p>${item.detail}</p>${item.id==='timeline'?timeline():''}<small>${item.source}</small></article>`;
}
function timeline(){return `<div class="timeline"><div><strong>1918</strong><p>현재에서 돌아본 변화<br><b>일부 30세 이상 여성</b><small>재산 등의 조건이 남아 있었어요.</small></p></div><div class="future"><strong>1928</strong><p>훗날의 변화<br><b>남녀 모두 21세 이상</b><small>1919년에는 아직 일어나지 않았어요.</small></p></div></div>`;}
function choices(name,options,legend,number){
  const form=chapter(state).form;
  return `<fieldset><legend>${number?`<span>${number}</span>`:''}${legend}</legend><div class="choices">${options.map(o=>`<label class="choice ${form[name]===o.id?'chosen':''}"><input type="radio" name="${name}" value="${o.id}" ${form[name]===o.id?'checked':''}><span><strong>${o.label}</strong>${o.detail||o.source?`<small>${o.detail||o.source}</small>`:''}</span></label>`).join('')}</div></fieldset>`;
}
function evidenceOptions(scene=currentScene(state)){return scene.items.map(i=>({id:i.id,label:i.answer,detail:i.topic}));}
function activity(){
  const scene=currentScene(state);
  let task='',fields='';
  if(scene.id==='woman'){
    task='한 사람이 여러 변화를 바랄 수 있어요. 당신이 주목한 요구와 그 이유가 된 발언을 연결해 보세요.';
    fields=`<p class="choice-note">정치 참여를 가장 바라고 있지만, 일자리와 생활의 걱정도 실제 요구예요. 근거와 이어지는 요구는 각각 기록할 수 있어요.</p>${choices('demand',demands,'어떤 요구를 기록하고 싶나요?',1)}${choices('evidence',evidenceOptions(),'그 요구와 이어지는 발언은?',2)}`;
  }else if(scene.id==='pankhurst'){
    task='세 자료에서 발견한 것을 이어보세요. 어떤 권리를 요구했고, 어떻게 행동했으며, 사회에는 어떤 변화가 나타났나요?';
    fields=choices('demand',activityOptions.pankhurst.demand,'팽크허스트의 요구',1)+choices('action',activityOptions.pankhurst.action,'요구를 실현하려 한 활동',2)+choices('impact',activityOptions.pankhurst.impact,'그 활동과 이어지는 사회 변화',3);
  }else if(scene.id==='citizens'){
    task='두 제도 모두 선거를 엽니다. 두 시민이 바라는 참여의 범위를 생각하고, 제도와 선택한 이유를 함께 골라보세요.';
    fields='<p class="choice-note">아래 A·B는 비교를 위한 가상 제도입니다. 실제 국가의 법을 그대로 재현한 것은 아닙니다.</p>'+choices('system',activityOptions.citizens.system,'시민의 요구에 더 맞는 제도',1)+choices('reason',activityOptions.citizens.reason,'그 제도를 선택한 이유',2);
  }else if(scene.id==='peasant'){
    task='병사·노동자·농민의 어려움은 같지 않았어요. 이 농민의 말에서 토지와 생활의 관계를 찾아보세요.';
    fields=choices('demand',activityOptions.peasant.demand,'이 농민의 요구',1)+choices('evidence',activityOptions.peasant.evidence,'그렇게 생각한 이유',2);
  }else if(scene.id==='factory'){
    task='이 노동자는 생활비뿐 아니라 공장과 이익의 운영도 바라고 있어요. 제안이 어떤 요구를 다루는지, 발언을 근거로 확인해 보세요.';
    fields=choices('proposal',activityOptions.factory.proposal,'그가 바라는 변화를 다루는 제안',1)+choices('evidence',evidenceOptions(),'그 제안과 이어지는 발언',2);
  }else{
    task='조사에서 모은 카드에 담긴 아이디어입니다. 이 노동자의 두 바람을 다루는 제안을 하나씩 골라주세요. 타당한 조합은 여러 가지예요.';
    const options=availableProposals(state),evidence=evidenceOptions();
    fields=`<section class="proposal-slot" data-slot="political"><div class="slot-heading"><span>01</span><h3>정치적 권리</h3></div>${choices('political',options.political,'정치에 참여하기 위한 제안')}${choices('politicalEvidence',evidence,'이 제안의 근거가 된 발언')}</section><section class="proposal-slot economic-slot" data-slot="economic"><div class="slot-heading"><span>02</span><h3>경제적 삶</h3></div>${choices('economic',options.economic,'더 나은 삶을 위한 제안')}${choices('economicEvidence',evidence,'이 제안의 근거가 된 발언')}</section>`;
  }
  return `${person()}<p class="task">${task}</p>${fields}<div id="feedback" tabindex="-1" role="status" aria-live="polite">${feedbackHTML()}</div><div class="panel-bottom"><button class="text-button" data-action="explore">← 이야기와 자료 다시 보기</button><div class="activity-actions"><button class="quiet hint-button" data-action="hint">단서 함께 보기</button><button class="primary" data-action="submit">${scene.id==='young'?'나의 변화안 확인하기':'조사 기록하기'} ↗</button></div></div>`;
}
function feedbackHTML(){return feedback?`<div class="feedback conversation"><span class="feedback-speaker">${feedback.kind==='conversation'?'인물의 답변':'조사 안내'}</span><strong>${feedback.title}</strong><p>${feedback.text}</p></div>`:'';}
function hint(){
  const hints={woman:'정치 참여는 대표를 뽑을 권리·가장 먼저 바라는 변화와, 일자리와 생활은 일터·생활비 걱정과 연결해 보세요.',pankhurst:'1913년은 법 개정 요구, 1914년은 운동 과정의 갈등, 1918·1928년은 제한이 남았다가 줄어든 변화를 보여줍니다. 한 사람의 힘만으로 설명하기는 어려워요.',citizens:'선거가 있느냐와 누가 참여하느냐는 다른 질문이에요. 재산이 적은 시민의 한 표가 어떻게 달라지는지 비교해 보세요.',peasant:'농민이 반복해서 말한 것은 자신이 농사를 짓는 땅의 주인이 누구인가 하는 문제예요.',factory:'생활 지원도 도움이 됩니다. 이 장면의 노동자는 거기에 더해 소유·운영·이익 분배의 변화를 바랐어요. 두 번째 이야기와 두 운영 제안을 비교해 보세요.',young:'정치적 권리에는 대표를 뽑고 싶다는 발언을, 경제적 삶에는 덜 가난하고 안전하게 살고 싶다는 발언을 연결하세요. 공장 노동자의 삶을 다루는 여러 제안이 가능해요.'};
  return {kind:'guidance',title:'함께 볼 단서',text:hints[currentScene(state).id]};
}
function resultScreen(){
  const scene=currentScene(state),c=chapter(state);
  const response=evaluate(state,scene.id,c.record).text;
  const ids={woman:['woman'],pankhurst:['pankhurst'],citizens:['citizen','german'],peasant:['peasant'],factory:['factory'],young:['young']}[scene.id];
  const records=getRecords(state).filter(r=>ids.includes(r.id));
  let explanation='';
  if(scene.id==='woman')explanation=`<p class="historical">일자리·생활의 요구와 정치적 권리는 함께 존재할 수 있어요. 경제적 요구를 했다는 사실만으로 사회주의라고 분류하지 않습니다.</p>`;
  if(scene.id==='pankhurst')explanation=`<section class="learning-note"><h3>그녀는 무엇을 했고, 어떤 영향을 끼쳤을까요?</h3><p>여성 사회 정치 연맹을 조직하고 법 개정을 요구하며 운동을 이끌었습니다. 여성 참정권 확대에는 여러 운동가의 노력과 전쟁 중 여성의 기여가 함께 영향을 주었습니다.</p>${timeline()}</section>`;
  if(scene.id==='citizens')explanation=`<section class="learning-note"><h3>바이마르 공화국 · 1919년</h3><p>국민으로부터 나오는 국가 권력과 20세 이상 남녀의 보통 선거를 헌법에 규정했습니다.</p><p class="historical">공화정은 군주가 없는 국가 형태입니다. 공화정 그 자체가 항상 민주주의를 보장하지는 않습니다.</p></section>`;
  if(scene.id==='peasant')explanation=`<p class="historical">1917년 러시아 혁명은 1919년보다 앞선 사건입니다. 농민의 토지 요구를 기억하고, 다음에는 다른 지역 노동자들의 경제적 요구를 만나봅니다.</p>`;
  if(scene.id==='factory')explanation=`<section class="concept socialism"><span>요구에서 발견한 역사 개념</span><h3>사회주의의 확산</h3><div class="context-facts"><span>소유: 누구의 것인가?</span><span>운영: 누가 어떻게 결정하는가?</span><span>분배: 이익을 어떻게 나누는가?</span></div><p>당시 사회주의는 경제적 불평등을 비판하며, 공장과 토지처럼 생산에 필요한 재산을 <b>사회 전체의 이익에 맞게 소유·운영</b>해야 한다고 주장했습니다.</p><p>사회주의는 러시아 혁명 이전부터 있었고, 러시아 혁명은 다른 나라의 사회주의 운동에도 영향을 주었습니다.</p><small>생활 개선을 바라는 사람 모두가 사회주의자인 것은 아니며, 실제 소유·운영 방식에는 다양한 논의가 있었습니다.</small></section>`;
  if(scene.id==='young')explanation=`<section class="learning-note"><h3>당신이 만든 변화안</h3><p class="chosen-proposal">${records[0].proposal}</p><p>두 요구를 동시에 다룰 수 있다는 것을 당신의 제안으로 확인했습니다.</p></section>`;
  return `<div class="complete-badge">조사 완료 ✓${scene.voices===2?' · 두 목소리 기록':''}</div>${person()}<h2 class="complete-title">${scene.id==='woman'?demands.find(d=>d.id===c.record.demand).label:records.map(r=>r.title).join(' · ')}</h2><blockquote class="confirmation">${response}</blockquote><div class="earned-cards">${records.map(r=>`<article class="earned-card" data-record="${r.id}"><small>${r.person}</small><h3>${r.title}</h3><p>${r.areas.length===2?'정치적 권리 + 경제적 삶':r.areas[0]==='political'?'정치 참여 확대':'경제적 삶의 개선'}</p>${r.concept==='democracy'?'<strong>민주주의의 확산</strong>':''}</article>`).join('')}</div>${explanation}<details class="result-evidence"><summary>내가 연결한 발언과 제안 다시 보기</summary>${records.map(r=>`<p>${r.proposal}</p>${r.evidence.map(e=>`<p class="historical">${e}</p>`).join('')}`).join('')}</details><div class="result-actions"><button class="primary" data-action="next">${scene.id==='young'?'핵심 발견 확인하기':'다음 목소리 듣기'} →</button><button class="text-button" data-action="map">변화 지도 보기 ↗</button><button class="text-button" data-action="explore">이야기·자료 다시 보기</button><button class="text-button" data-action="revise">${scene.id==='woman'?'다른 요구도 살펴보기':'다른 제안도 살펴보기'} ↗</button></div>`;
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
  if(modalType==='sources')return `<dialog open class="overlay" aria-modal="true" aria-labelledby="modal-title"><div class="modal"><button class="close" data-action="close" aria-label="출처 닫기">✕</button><div class="eyebrow">SOURCES & CONTEXT</div><h2 id="modal-title" tabindex="-1">자료와 수업 안내</h2><div class="source-list"><h3>제공된 교과서 자료</h3><p>「러시아혁명, 민주주의 확산.pdf」, 교과서 184~187쪽. 187쪽의 팽크허스트 편지(1913), 체포 사진(1914)의 설명, 여성 참정권 연표, 바이마르 헌법 제1조·제22조를 요약해 사용했습니다.</p><h3>두 게임의 연결</h3><p>러시아 농민은 별도 러시아 혁명 게임의 토지 요구를 약 1분으로 회상합니다. 이전 게임의 완료 기록이나 계정은 필요하지 않습니다.</p><a href="https://bon17.github.io/russia-1917-game/" target="_blank" rel="noopener">러시아 혁명 게임 ↗</a><h3>표현과 시점</h3><p>인물 대사와 삽화는 수업용 재구성이며 실제 발언·역사 사진이 아닙니다. 팽크허스트는 실제 인물입니다. 1913·1914·1917·1918년은 지난 사건, 1928년은 훗날의 변화입니다. 소련 성립은 1922년으로 이 게임의 현재인 1919년 이후입니다.</p><h3>수업 사용</h3><p>본편 약 17분에 다시 읽기·수정 여유 3분을 더한 분량 설계입니다. 실제 학생의 읽기 속도에 따라 달라지므로 강제 타이머는 없습니다. 수업 마지막에 변화안과 선택 이유를 서로 설명해 보세요.</p></div><button class="primary" data-action="close">조사로 돌아가기 →</button></div></dialog>`;
  const records=getRecords(state),learned=concepts(state);
  return `<dialog open class="overlay" aria-modal="true" aria-labelledby="modal-title"><div class="modal map-modal"><button class="close" data-action="close" aria-label="지도 닫기">✕</button><div class="eyebrow">MAP OF CHANGE · ${records.length}/7</div><h2 id="modal-title" tabindex="-1">나의 1919년 변화 지도</h2><p class="muted">${records.length}개의 목소리를 모았습니다. 카드를 펼치면 요구·근거·제안을 다시 볼 수 있어요.</p><div class="map-columns">${[['political','정치 참여의 확대',learned.democracy?'민주주의의 확산':'???'],['economic','경제적 삶의 개선',learned.socialism?'사회주의의 확산':'???']].map(([area,title,concept])=>`<section><h3>${title}</h3>${records.some(r=>r.areas.includes(area))?records.filter(r=>r.areas.includes(area)).map(r=>mapCard(r,area)).join(''):'<div class="map-empty">이 영역의 요구를<br>조사해 모아보세요.</div>'}<strong class="map-concept">${concept}</strong></section>`).join('')}</div><p class="historical">${learned.socialism?'경제적 요구 모두가 사회주의와 같은 뜻은 아닙니다. 공장 노동자 장면에서 소유·운영·분배의 변화와 사회주의의 뜻을 함께 살펴봤습니다.':'이야기를 먼저 만나고, 역사 개념의 이름은 조사하면서 연결합니다.'} 정치적 권리와 더 나은 경제적 삶은 함께 요구할 수 있습니다.</p>${allComplete(state)?'<p class="map-discussion">1919년 여러분이 노동자라면, 반드시 하나만 선택해야 했을까요?</p>':''}<button class="primary" data-action="close">${allComplete(state)?'나의 조사로 돌아가기':'조사 계속하기'} →</button></div></dialog>`;
}
function action(actionName){
  let focus='#screen-title',top=false;
  if(actionName==='home'){state.screen='intro';top=true;}
  if(actionName==='start'){state.screen=allComplete(state)?'ending':'play';top=true;}
  if(actionName==='review'){visitScene(state,0);feedback=null;top=true;}
  if(actionName==='activity'){if(!canRecord(state))return;chapter(state).phase='activity';feedback=null;top=true;}
  if(actionName==='explore'){chapter(state).phase='explore';feedback=null;top=true;}
  if(actionName==='submit'){
    feedback=completeChapter(state);
    if(feedback.ok){feedback=null;top=true;}else focus='#feedback';
  }
  if(actionName==='hint'){feedback=hint();focus='#feedback';}
  if(actionName==='revise'){chapter(state).form={...chapter(state).record};chapter(state).phase='activity';feedback=null;top=true;}
  if(actionName==='next'){if(!nextScene(state))return;feedback=null;top=true;}
  if(actionName==='ending'){if(!allComplete(state))return;state.screen='ending';top=true;}
  if(actionName==='discovery'){if(!allComplete(state))return;state.screen='discovery';top=true;}
  if(['map','reset','sources'].includes(actionName)){
    modalReturn=`[data-action="${actionName}"]`;modalType=actionName;focus='#modal-title';
  }
  if(actionName==='close'){modalType=null;focus=modalReturn;}
  if(actionName==='confirm-reset'){state=initialState();modalType=null;feedback=null;top=true;}
  save();render(focus,top);
  if(focus==='#feedback')document.querySelector('#feedback')?.scrollIntoView({block:'nearest'});
}
function bind(){
  app.querySelectorAll('[data-action]').forEach(el=>el.onclick=e=>{e.preventDefault();action(el.dataset.action);});
  app.querySelectorAll('[data-visit]').forEach(el=>el.onclick=()=>{if(visitScene(state,Number(el.dataset.visit))){feedback=null;save();render('#screen-title',true);}});
  app.querySelectorAll('[data-question]').forEach(el=>el.onclick=()=>{
    const c=chapter(state),id=el.dataset.question;c.active=id;if(!c.heard.includes(id))c.heard.push(id);
    save();render(`[data-question="${id}"]`);
    if(currentScene(state).id==='pankhurst')document.querySelector('#active-source')?.scrollIntoView({block:'nearest'});
  });
  app.querySelectorAll('input[type="radio"]').forEach(el=>el.onchange=()=>{
    chapter(state).form[el.name]=el.value;feedback=null;save();render(`input[name="${el.name}"][value="${el.value}"]`);
  });
  const notes=app.querySelector('.notes-disclosure');if(notes)notes.ontoggle=()=>{notesOpen=notes.open;};
  const dialog=app.querySelector('dialog');
  if(dialog){
    const background=[...app.children].filter(el=>el!==dialog);background.forEach(el=>el.inert=true);
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
