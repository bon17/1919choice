export const questions = [
  {id:'work',label:'일터에서 어떤 어려움이 있나요?',topic:'일터와 생활',answer:'전쟁이 끝난 뒤에도 이 공장에서 계속 일할 수 있을지 걱정돼요. 일자리를 잃으면 생활비를 마련하기 어려워질 테니까요.'},
  {id:'vote',label:'나라의 결정에 의견을 낼 수 있나요?',topic:'정치적 권리',answer:'나라를 위해 일했지만 대표를 뽑을 권리는 없어요. 우리 삶에 영향을 주는 결정인데, 제 목소리는 빠져 있죠.'},
  {id:'priority',label:'가장 먼저 바꾸고 싶은 것은 무엇인가요?',topic:'가장 중요한 변화',answer:'일자리도 중요해요. 하지만 가장 먼저, 우리 삶을 결정하는 정치에 여성도 참여할 수 있었으면 좋겠어요.'}
];
export const demands = [
  {id:'jobs',label:'여성의 일자리 유지',detail:'전쟁 이후에도 일을 계속할 기회',card:'일자리 유지',area:'economic',evidence:['work'],response:'일자리를 잃을까 걱정하는 제 이야기를 기억해 주셨네요. 계속 일할 수 있는 기회도 제게 중요한 요구예요. 정치에 목소리를 낼 권리도 함께 바라고 있어요.'},
  {id:'vote',label:'여성의 정치 참여 확대',detail:'대표를 뽑고 정치에 목소리를 낼 권리',card:'여성 참정권',area:'political',evidence:['vote','priority'],response:'네, 저는 정치에 제 목소리를 낼 권리를 가장 바라고 있어요. 일자리와 생활에 관한 결정에도 여성의 의견이 함께 반영되었으면 좋겠어요.'},
  {id:'support',label:'생활 지원 확대',detail:'불안한 생활을 돕는 경제적 지원',card:'생활 지원',area:'economic',evidence:['work'],response:'생활비를 마련하기 어려워질까 걱정하는 제 마음을 알아주셨네요. 생활을 돕는 지원도 필요해요. 우리 삶에 관한 결정에 참여할 권리도 함께 바라고 있어요.'}
];
export const scenes = [
  {id:'woman',title:'공장에서 일했던 여성',subtitle:'생활과 정치, 그녀가 바라는 변화',place:'유럽의 한 공업 도시 · 1919년',activity:'질문과 근거',time:'약 3분',voices:1,art:'woman',context:'전쟁터로 떠난 사람들을 대신해 공장에서 일했던 여성입니다. 이제 전후 일자리와, 자신의 삶을 결정하는 정치에 관심을 갖고 있습니다.',facts:['공장 일로 마련하는 생활비','불안한 전후 일자리','아직 없는 선거 참여 권리'],opening:'전쟁 중에는 전쟁터로 떠난 사람들을 대신해 공장에서 일했어요. 그 일로 가족의 생활비도 마련했죠. 그런데 전쟁이 끝난 지금도 저는 나라의 대표를 뽑는 데 참여할 수 없어요. 일자리와 생활에 영향을 주는 결정인데, 제 의견은 들리지 않는 것 같아요.',items:questions},
  {id:'pankhurst',title:'에멀린 팽크허스트',subtitle:'한 사람의 요구가 운동이 되기까지',place:'영국 · 1919년에서 지난 활동 돌아보기',activity:'자료 연결',time:'약 4분',voices:1,art:'pankhurst',context:'에멀린 팽크허스트(1858~1928)는 영국 여성 참정권 운동의 대표적인 인물입니다. 1903년 동료들과 여성 사회 정치 연맹(WSPU)을 조직하고, 여성도 정치에 참여하도록 법을 바꾸는 운동을 이끌었습니다.',facts:['영국 여성 참정권 운동','여성 사회 정치 연맹','요구 → 활동 → 변화'],opening:'여성도 나라의 대표를 뽑고, 자신의 삶에 영향을 주는 결정에 참여할 수 있어야 한다고 주장했습니다.',quoteNote:'팽크허스트의 주장을 요약한 재구성입니다.',items:[
    {id:'letter',label:'1913년 · 동료들에게 보낸 편지',topic:'법을 바꾸려는 요구',answer:'교과서의 편지에서 팽크허스트는 선거법 개정안에 여성을 포함하는 문제를 이야기합니다. 개정이 실패하면 더 강한 행동이 필요하다고 동료들에게 호소했습니다.',detail:'공장에 취직하는 문제보다, 여성의 선거 참여를 법으로 보장하는 데 관심을 두었습니다. 편지의 표현을 그대로 인용하지 않고 요약한 자료입니다.',year:'1913',source:'사용자 제공 교과서 187쪽 · 편지 자료 요약'},
    {id:'arrest',label:'1914년 · 체포 사진이 보여주는 것',topic:'운동과 갈등',answer:'교과서에는 1914년 체포된 팽크허스트의 사진이 실려 있습니다. 여성 참정권을 요구한 운동은 편지와 집회·시위 등으로 이어졌고, 정부와 충돌하며 체포를 겪기도 했습니다.',detail:'변화를 요구하는 목소리가 실제 조직과 행동으로 이어졌다는 점을 살펴보세요. 이 화면의 인물 그림은 역사 사진을 대신하는 재구성 삽화입니다.',year:'1914',source:'사용자 제공 교과서 187쪽 · 체포 사진의 설명'},
    {id:'timeline',label:'1918년과 1928년 · 무엇이 달라졌을까?',topic:'권리는 점차 확대되었다',answer:'1918년 영국에서는 재산 등의 조건을 충족한 30세 이상 여성에게 선거권이 주어졌습니다. 여성 모두가 남성과 같은 조건을 갖게 된 것은 아니었습니다.',detail:'훗날인 1928년에는 여성도 남성과 같은 21세 이상 연령 조건으로 투표할 수 있게 됩니다. 여러 운동가의 노력과 전쟁 중 여성의 기여가 권리 확대에 영향을 주었습니다.',year:'1918 → 1928',source:'사용자 제공 교과서 187쪽 · 참정권 확대 연표'}
  ]},
  {id:'citizens',title:'선거를 바라보는 두 시민',subtitle:'선거가 있으면 누구나 참여할 수 있을까?',place:'유럽의 시민과 독일 시민 · 1919년',activity:'제도 비교',time:'약 3분',voices:2,art:'citizen',context:'전쟁 뒤에는 더 많은 사람이 정치에 참여해야 한다는 요구가 커졌습니다. 재산 때문에 목소리가 작은 시민과, 황제가 물러난 뒤 새 국가를 생각하는 독일 시민을 함께 만납니다.',facts:['재산에 따른 참여 제한','독일 황제 퇴위 · 1918년','바이마르 공화국 · 1919년'],opening:'법을 지키고 세금도 내는데, 가진 재산이 적다고 정치에서 제 목소리도 작아야 할까요?',items:[
    {id:'citizen',label:'평범한 시민의 이야기',topic:'보통 선거를 바라는 시민',answer:'선거가 있어도 재산이 적은 사람은 참여하지 못하거나 영향력이 작아요. 더 많은 성인이 같은 한 표로 의견을 냈으면 좋겠어요.'},
    {id:'german',label:'독일 시민의 이야기',topic:'공화국을 생각하는 시민',answer:'1918년 황제가 물러났어요. 앞으로는 왕가가 권력을 물려받기보다, 국민으로부터 나오는 권력으로 나라를 운영했으면 좋겠어요.'},
    {id:'constitution',label:'1919년 · 바이마르 헌법 확인하기',topic:'두 요구와 이어지는 실제 자료',answer:'제1조: 독일은 공화국이며 국가 권력은 국민으로부터 나온다. 제22조: 국회 의원은 20세 이상 남녀의 보통·평등·직접·비밀 선거로 선출된다.',detail:'교과서에 실린 헌법 조항을 요약했습니다. 공화정은 군주가 없는 국가 형태이고, 모든 공화국이 항상 민주적인 것은 아닙니다. 이 헌법에서는 국민의 정치 참여를 확대하려는 규정도 함께 확인할 수 있습니다.',source:'사용자 제공 교과서 187쪽 · 바이마르 헌법 제1조·제22조'}
  ]},
  {id:'peasant',title:'러시아 농민의 목소리',subtitle:'앞 게임에서 들었던 토지 문제',place:'1917년 러시아를 1919년에서 돌아보기',activity:'짧은 회상',time:'약 1분',voices:1,art:'peasant',context:'러시아 혁명 게임에서 병사는 전쟁, 노동자는 식량, 농민은 토지 문제를 이야기했습니다. 여기서는 혁명 과정을 다시 따라가지 않고 농민의 요구 하나를 떠올립니다.',facts:['1917년의 선행 사건','농사를 짓는 사람과 땅을 가진 사람','다음 경제적 요구로 연결'],opening:'우리가 농사를 짓는데 넓은 토지는 일부 지주가 가지고 있어요. 농사를 짓는 사람들의 토지 문제도 바뀌었으면 좋겠습니다.',items:[{id:'land',label:'농민의 요구 다시 듣기',topic:'토지 문제',answer:'농사를 짓는 사람도 땅을 이용하며 살아갈 수 있도록 토지 문제를 바꾸고 싶어요. 지주의 땅에서 일하는 생활은 늘 불안합니다.'}]},
  {id:'factory',title:'유럽의 공장 노동자',subtitle:'월급뿐 아니라 공장과 이익의 문제',place:'러시아 밖 유럽의 공업 도시 · 1919년',activity:'정책과 근거',time:'약 2분 30초',voices:1,art:'factory',context:'전쟁이 끝났지만 노동자들의 생활은 여전히 어려웠습니다. 일부 사람들은 생활 지원과 함께 공장을 누가 소유하고 운영하며, 이익을 어떻게 나눌지도 바꾸자고 주장했습니다.',facts:['노동자의 생활','소수에게 집중된 공장과 이익','소유·운영·분배의 변화'],opening:'하루 종일 일해도 생활은 빠듯해요. 공장을 움직이는 건 많은 노동자인데, 공장과 이익은 소수에게 집중되어 있죠. 우리 생활과 공장을 운영하는 방식이 함께 바뀌었으면 좋겠어요.',items:[
    {id:'wages',label:'생활에서 무엇이 어려운가요?',topic:'노동자의 생활',answer:'긴 시간 일해도 생활비를 마련하기 빠듯해요. 임금과 노동시간, 안전하게 일할 환경을 개선하는 일도 필요합니다.'},
    {id:'ownership',label:'공장 운영은 어떻게 바뀌기를 바라나요?',topic:'소유·운영·이익 분배',answer:'임금만 조금 올리는 데서 끝나지 않았으면 좋겠어요. 공장을 소유하고 운영하는 방식과, 함께 만든 이익을 나누는 방식도 바꾸고 싶습니다.'},
    {id:'influence',label:'러시아의 변화는 어떤 영향을 주었나요?',topic:'다른 지역으로 전해진 변화',answer:'사회주의 운동은 러시아 혁명 이전부터 있었어요. 러시아의 혁명은 다른 나라에서 경제적 불평등을 바꾸려던 사람들에게도 영향을 주었습니다.'}
  ]},
  {id:'young',title:'젊은 노동자의 두 가지 바람',subtitle:'지금까지 모은 목소리로 변화안을 만들기',place:'전쟁 이후의 유럽 · 1919년',activity:'나의 변화안',time:'약 2분',voices:1,art:'young',context:'이 노동자는 정치적 권리와 경제적 삶의 개선을 함께 바라고 있습니다. 조사에서 모은 카드로 두 요구를 다루는 제안을 만들어 보세요.',facts:['정치에 참여할 권리','더 나은 경제적 삶','여러 제안 조합 가능'],opening:'저는 투표할 권리도 갖고 싶어요. 그리고 하루 종일 일하는 노동자들이 너무 가난하게 살지 않았으면 좋겠습니다.',items:[
    {id:'political',label:'정치에서 어떤 변화를 바라나요?',topic:'정치적 권리',answer:'성별이나 재산 때문에 목소리가 빠지지 않고, 저 같은 노동자도 대표를 뽑는 데 참여하고 싶어요.'},
    {id:'economic',label:'생활에서는 무엇이 달라지면 좋을까요?',topic:'경제적 삶',answer:'공장에서 계속 일하며, 우리도 덜 가난하고 안전하게 살고 싶어요. 노동조건이나 함께 만든 이익을 나누는 방식도 나아졌으면 좋겠어요.'}
  ]}
];
export const activityOptions = {
  pankhurst:{
    demand:[{id:'vote',label:'여성도 선거에 참여할 권리',detail:'나라의 대표를 뽑는 법과 참여 범위'},{id:'jobs',label:'여성의 공장 일자리 유지',detail:'전쟁 뒤에도 일할 기회'},{id:'support',label:'노동자의 생활 지원',detail:'임금과 생활비의 어려움'}],
    action:[{id:'movement',label:'연맹을 조직하고 편지·시위로 법 개정을 요구',detail:'동료를 모으고 정치적 변화를 위한 행동'},{id:'work',label:'공장에서 일하며 생활비를 마련',detail:'전쟁 중 여성 노동자의 기여'},{id:'relief',label:'생활비를 돕는 지원 활동',detail:'경제적 어려움을 줄이는 활동'}],
    impact:[{id:'gradual',label:'여러 사람의 활동과 전쟁 중 기여가 점진적 확대에 영향',detail:'1918년의 제한과 훗날 1928년의 동등한 연령 조건'},{id:'all1918',label:'1918년에 모든 여성이 남성과 같은 조건으로 참여',detail:'전쟁이 끝난 직후의 변화로 해석'},{id:'alone',label:'팽크허스트 한 사람의 활동만으로 권리 확대',detail:'다른 운동가와 전쟁 중 기여는 제외한 해석'}]
  },
  citizens:{
    system:[{id:'limited',label:'제도 A · 재산에 따라 참여 제한',detail:'선거는 열리지만 일정한 재산을 가진 성인만 투표합니다.'},{id:'broad',label:'제도 B · 더 많은 성인에게 같은 한 표',detail:'성별·재산에 따른 제한을 줄여 성인이 동등하게 참여합니다.'}],
    reason:[{id:'participation',label:'재산과 성별 때문에 빠졌던 사람들의 목소리가 들어가서'},{id:'equal',label:'더 많은 시민이 동등한 한 표로 대표를 뽑을 수 있어서'},{id:'wealth',label:'재산이 많은 사람이 나라의 결정을 더 많이 맡아서'},{id:'order',label:'선거가 있기만 하면 참여 범위는 상관없어서'}]
  },
  peasant:{
    demand:[{id:'land',label:'농사를 짓는 사람들의 토지 문제 해결'},{id:'food',label:'도시의 식량 부족 해결'},{id:'peace',label:'전쟁을 멈추고 병사들이 돌아오는 것'}],
    evidence:[{id:'land',label:'농사를 짓지만 땅은 일부 지주가 가지고 있다.'},{id:'price',label:'물가가 오르고 먹을 것이 부족하다.'},{id:'front',label:'전선에서 싸우는 생활이 힘들다.'}]
  },
  factory:{
    proposal:[{id:'coop',label:'노동자들이 함께 공장을 운영하고 이익을 나누기',detail:'소유·운영·분배의 변화를 함께 생각하는 제안'},{id:'public',label:'공장을 사회 전체의 이익에 맞게 공적으로 소유·운영하기',detail:'소수의 이익에 집중된 운영을 바꾸자는 제안'},{id:'pay',label:'임금과 생활 지원을 늘리기',detail:'당장의 생활비 어려움을 줄이는 제안'},{id:'vote',label:'대표를 뽑는 정치적 권리를 늘리기',detail:'나라의 결정에 목소리를 내게 하는 제안'}]
  }
};
const blankChapter = () => ({heard:[],active:null,phase:'explore',form:{},record:null});
export const initialState = () => ({version:3,screen:'intro',sceneIndex:0,chapters:Object.fromEntries(scenes.map(scene=>[scene.id,blankChapter()]))});
export const currentScene = state => scenes[state.sceneIndex];
export const chapter = (state,id=currentScene(state).id) => state.chapters[id];
export const canRecord = (state,id=currentScene(state).id) => scenes.find(scene=>scene.id===id).items.every(item=>chapter(state,id).heard.includes(item.id));
export const canVisit = (state,index) => Number.isInteger(index)&&index>=0&&index<scenes.length&&scenes.slice(0,index).every(scene=>chapter(state,scene.id).record!==null);
export const allComplete = state => scenes.every(scene=>chapter(state,scene.id).record!==null);
export function availableProposals(state) {
  const cards=getRecords(state);
  const has=id=>cards.some(card=>card.id===id);
  const political=[],economic=[];
  if(has('pankhurst'))political.push({id:'suffrage',label:'성별에 따른 선거 참여 제한을 줄이기',source:'팽크허스트 · 여성 참정권 운동'});
  if(has('citizen'))political.push({id:'universal',label:'재산에 따른 제한을 줄여 보통 선거 확대',source:'평범한 시민 · 보통 선거'});
  if(has('german'))political.push({id:'representatives',label:'국민이 대표를 선출하고 정치에 참여하기',source:'독일 시민 · 공화정과 선거'});
  if(has('factory'))economic.push({id:'living',label:'임금·노동시간을 개선하고 생활을 지원하기',source:'공장 노동자 · 생활의 어려움'},{id:'safe',label:'안전한 노동환경과 노동자의 권리 보장',source:'공장 노동자 · 노동조건'},{id:'sharing',label:'노동자가 공장 운영과 이익 분배에 참여하기',source:'공장 노동자 · 경제 운영의 변화'});
  if(has('woman'))economic.push({id:'jobs',label:'노동자의 일할 기회를 지키기',source:'여성 노동자 · 일자리의 걱정'});
  if(has('woman'))economic.push({id:'support',label:'불안한 생활을 돕는 경제적 지원',source:'여성 노동자 · 생활비의 걱정'});
  if(has('peasant'))economic.push({id:'land',label:'농민들의 토지 이용 문제를 해결하기',source:'러시아 농민 · 토지 문제'});
  return {political,economic};
}
const help=(title,text,kind='guidance')=>({ok:false,kind,title,text});
const yes=text=>({ok:true,kind:'confirmed',title:'이 목소리를 조사 기록에 남겼습니다.',text});
export function evaluate(state,id=currentScene(state).id,form=chapter(state,id).form) {
  if(!canRecord(state,id))return help('이야기와 자료를 조금 더 살펴볼까요?','이 장면의 이야기와 자료를 모두 확인한 뒤 생각을 정리해 주세요.');
  if(id==='woman'){
    const demand=demands.find(d=>d.id===form.demand);
    if(!demand||!form.evidence)return help('어떤 요구를 기록하고 싶나요?','바라는 변화와 그 이유가 된 발언을 함께 골라주세요.');
    if(!demand.evidence.includes(form.evidence))return help('고른 요구와 이어지는 발언을 함께 볼까요?',demand.area==='political'?'일자리 걱정도 제 마음을 담고 있어요. 정치 참여를 기록하려면 대표를 뽑을 권리와 참여하고 싶은 마음을 말한 발언을 연결해 주시겠어요?':'대표를 뽑고 싶다는 말은 정치 참여에 관한 이야기예요. 지금 고른 일자리나 생활의 요구에는 일터와 생활비를 걱정한 발언이 더 잘 이어져요. 고른 요구는 그대로 두어도 괜찮아요.','conversation');
    return yes(demand.response);
  }
  if(id==='pankhurst'){
    if(!form.demand||!form.action||!form.impact)return help('세 연결을 함께 정리해 볼까요?','요구, 활동, 사회에 끼친 영향을 하나씩 골라주세요.');
    if(form.demand!=='vote')return help('1913년 편지의 법 개정 요구를 떠올려 보세요.','생활과 일자리도 중요한 문제였지만, 이 자료에서 팽크허스트가 바꾸려 한 것은 여성의 선거 참여 범위입니다.');
    if(form.action!=='movement')return help('요구를 실제 행동으로 옮긴 방법은 무엇이었을까요?','연맹, 동료에게 보낸 편지, 시위와 체포를 함께 살펴보세요. 전쟁 중 공장 노동은 여성들이 사회에 기여한 또 다른 활동입니다.');
    if(form.impact!=='gradual')return help('권리가 한 번에, 한 사람의 힘으로 확대되었을까요?','1918년에는 여성에게 연령·재산 등의 제한이 있었습니다. 다른 운동가의 노력과 전쟁 중 여성의 기여, 훗날 1928년의 변화를 함께 연결해 보세요.');
    return yes('여성의 정치 참여 요구가 조직과 행동으로 이어지고, 여러 사람의 노력 속에서 권리가 점차 확대된 과정을 연결했어요.');
  }
  if(id==='citizens'){
    if(!form.system||!form.reason)return help('제도와 선택한 이유를 함께 골라주세요.','두 제도 모두 선거가 있습니다. 누가 참여할 수 있는지 비교해 보세요.');
    if(form.system!=='broad')return help('선거에서 빠지는 사람은 누구일까요?','재산 기준을 유지하면 이 시민은 여전히 참여하지 못할 수 있어요. 두 시민은 국민의 참여 범위를 넓히기를 바라고 있습니다.','conversation');
    if(!['participation','equal'].includes(form.reason))return help('시민의 목소리와 이유를 다시 연결해 볼까요?','선거가 있다는 사실만으로 충분하지 않아요. 참여 범위와 동등한 한 표라는 점이 두 시민의 요구와 어떻게 연결되는지 살펴보세요.');
    return yes('더 많은 시민이 동등하게 참여하는 이유를 찾았어요. 독일에서는 1919년 바이마르 공화국이 성립했고, 헌법에 국민으로부터 나오는 권력과 보통 선거가 규정되었습니다.');
  }
  if(id==='peasant'){
    if(!form.demand||!form.evidence)return help('농민의 요구와 근거를 함께 떠올려 보세요.','앞 게임의 병사·노동자·농민은 서로 다른 어려움을 말했습니다.');
    if(form.demand!=='land'||form.evidence!=='land')return help('식량과 전쟁도 중요한 어려움이었어요.','이 농민은 자신이 농사를 짓는 땅을 누가 가지고 있는지 이야기했습니다. 그 토지 문제와 요구를 함께 연결해 주세요.','conversation');
    return yes('1917년 농민들의 토지 문제도 중요한 불만이었죠. 이제 러시아 밖의 노동자는 경제적 삶과 재산의 운영에 어떤 변화를 바랐는지 살펴봅시다.');
  }
  if(id==='factory'){
    if(!form.proposal||!form.evidence)return help('제안과 이유가 된 발언을 함께 골라주세요.','당장의 생활과 경제를 운영하는 방식이라는 두 이야기를 비교해 보세요.');
    if(form.proposal==='pay')return help('생활을 돕는 제안도 제게 필요해요.','하지만 저는 임금뿐 아니라 공장을 운영하고 이익을 나누는 방식도 바라고 있어요. 두 번째 이야기와 그 요구를 다루는 제안을 함께 살펴봐 주시겠어요?','conversation');
    if(form.proposal==='vote')return help('정치에 목소리를 내는 일도 중요해요.','지금 제가 이야기하는 공장의 소유·운영과 이익 분배 문제를 직접 다루는 제안도 함께 생각해 주세요.','conversation');
    if(!['coop','public'].includes(form.proposal))return help('이 장면의 제안에서 골라주세요.','공장과 이익을 어떻게 운영하고 나눌지 살펴보세요.');
    if(form.evidence!=='ownership')return help('이 제안을 고른 이유는 어느 이야기와 더 이어질까요?','생활의 어려움과 다른 지역으로의 영향도 단서예요. 공장 소유·운영·이익 분배를 바꾸자는 제안에는 그 변화 자체를 바란 발언을 연결해 주세요.','conversation');
    return yes('생활을 돕는 일과 함께 공장과 이익의 운영을 바꾸자는 제안을 살펴봤어요. 실제 실행 방식과 효과는 더 논의해야 하지만, 경제적 불평등을 바꾸려는 요구와 연결됩니다.');
  }
  if(id==='young'){
    if(!form.political||!form.economic||!form.politicalEvidence||!form.economicEvidence)return help('두 바람을 모두 담아 볼까요?','정치적 권리와 경제적 삶에 관한 제안을 하나씩 고르고, 각각의 발언도 연결해 주세요.');
    const proposals=availableProposals(state);
    if(!proposals.political.some(p=>p.id===form.political)||!proposals.economic.some(p=>p.id===form.economic))return help('조사에서 모은 카드로 제안해 주세요.','앞 장면에서 수집한 정치·경제 카드에 담긴 아이디어를 골라주세요.');
    if(form.economic==='land')return help('농민에게는 토지 문제가 중요했어요.','저는 지금 공장에서 일하는 노동자의 생활을 이야기했어요. 우리 노동조건이나 생활, 공장에서 만든 이익의 문제를 다루는 제안도 찾아볼까요?','conversation');
    if(form.politicalEvidence!=='political'||form.economicEvidence!=='economic')return help('각 제안과 그 이유가 된 발언을 다시 이어볼까요?','대표를 뽑고 싶다는 발언은 정치적 권리와, 덜 가난하고 안전하게 살고 싶다는 발언은 경제적 삶과 연결됩니다. 제안은 유지하고 근거를 살펴봐도 좋아요.','conversation');
    return yes('제 목소리를 낼 권리와 더 나은 생활을 함께 생각해 주셨네요. 한 가지 변화만 택하지 않고 두 요구를 함께 담을 수 있군요.');
  }
  return help('조사 장면을 확인해 주세요.','시작 화면에서 이어갈 수 있습니다.');
}
const itemText=(id,key)=>{const item=scenes.find(s=>s.id===id).items.find(i=>i.id===key);return item?[item.answer,item.detail].filter(Boolean).join(' '):'';};
export function getRecords(state) {
  const records=[];
  const add=(id,person,title,areas,evidence,proposal,concept=null,source='수업용 재구성')=>records.push({id,person,title,areas,evidence,proposal,concept,source});
  const w=chapter(state,'woman').record;
  if(w){const d=demands.find(d=>d.id===w.demand);add('woman','여성 노동자',d.card,[d.area],[itemText('woman',w.evidence)],d.label,d.area==='political'?'democracy':null);}
  if(chapter(state,'pankhurst').record)add('pankhurst','팽크허스트','여성 참정권 운동',['political'],[itemText('pankhurst','letter'),itemText('pankhurst','arrest'),itemText('pankhurst','timeline')],'법 개정 요구 → 조직과 행동 → 점진적인 권리 확대','democracy','제공 교과서 187쪽 · 편지·사진 설명·연표');
  const c=chapter(state,'citizens').record;
  if(c){add('citizen','평범한 시민','보통 선거 확대',['political'],[itemText('citizens','citizen')],activityOptions.citizens.reason.find(o=>o.id===c.reason).label,'democracy');add('german','독일 시민','공화정의 수립',['political'],[itemText('citizens','german'),itemText('citizens','constitution')],'바이마르 공화국과 국민의 정치 참여','democracy','제공 교과서 187쪽 · 바이마르 헌법');}
  if(chapter(state,'peasant').record)add('peasant','러시아 농민','토지 문제 해결',['economic'],[itemText('peasant','land')],'1917년 농민의 토지 요구 회상',null,'별도 러시아 혁명 게임 · 교과서 184~185쪽');
  const f=chapter(state,'factory').record;
  if(f)add('factory','공장 노동자','노동자의 삶과 경제 운영',['economic'],[itemText('factory','wages'),itemText('factory','ownership'),itemText('factory','influence')],activityOptions.factory.proposal.find(o=>o.id===f.proposal).label,'socialism','수업용 재구성 · 교과서의 러시아 혁명과 사회 변동을 연결');
  const y=chapter(state,'young').record;
  if(y){const options=availableProposals({...state,chapters:{...state.chapters,young:{...chapter(state,'young'),record:null}}});add('young','젊은 노동자','정치적 권리와 경제적 삶',['political','economic'],[itemText('young','political'),itemText('young','economic')],options.political.find(p=>p.id===y.political).label+' + '+options.economic.find(p=>p.id===y.economic).label);}
  return records;
}
export function concepts(state){const records=getRecords(state);return {democracy:records.some(r=>r.concept==='democracy'),socialism:records.some(r=>r.concept==='socialism')};}
export function completeChapter(state){const result=evaluate(state);if(result.ok){const c=chapter(state);c.record={...c.form};c.phase='result';}return result;}
export function nextScene(state){if(!chapter(state).record)return false;if(state.sceneIndex===scenes.length-1){state.screen='discovery';return true;}state.sceneIndex++;state.screen='play';return true;}
export function visitScene(state,index){if(!canVisit(state,index))return false;state.sceneIndex=index;state.screen='play';return true;}
export function restore(raw) {
  try{
    const saved=JSON.parse(raw);
    if(!saved||typeof saved!=='object')return initialState();
    if([1,2].includes(saved.version)){
      if(!Array.isArray(saved.heard)||saved.heard.some(id=>!questions.some(q=>q.id===id)))return initialState();
      const migrated=initialState(),c=chapter(migrated,'woman');
      c.heard=[...new Set(saved.heard)];c.active=c.heard.includes(saved.active)?saved.active:null;
      c.form={demand:saved.demand,evidence:saved.evidence};
      c.phase=saved.screen==='report'&&canRecord(migrated)?'activity':'explore';
      if(saved.completed&&evaluate(migrated).ok){c.record={...c.form};c.phase='result';}
      migrated.screen=saved.screen==='intro'?'intro':'play';return migrated;
    }
    if(saved.version!==3||!saved.chapters||!['intro','play','discovery','ending'].includes(saved.screen)||!Number.isInteger(saved.sceneIndex)||saved.sceneIndex<0||saved.sceneIndex>=scenes.length)return initialState();
    const clean=initialState();
    for(const scene of scenes){
      const data=saved.chapters[scene.id],c=chapter(clean,scene.id);
      if(!data||!Array.isArray(data.heard))continue;
      c.heard=[...new Set(data.heard.filter(id=>scene.items.some(item=>item.id===id)))];
      c.active=c.heard.includes(data.active)?data.active:null;
      if(data.form&&typeof data.form==='object')c.form=Object.fromEntries(Object.entries(data.form).filter(([key,value])=>['demand','evidence','action','impact','system','reason','proposal','political','economic','politicalEvidence','economicEvidence'].includes(key)&&typeof value==='string'&&value.length<60));
      c.phase=['explore','activity','result'].includes(data.phase)?data.phase:'explore';
      if(c.phase==='activity'&&!canRecord(clean,scene.id))c.phase='explore';
      if(data.record&&typeof data.record==='object'&&canVisit(clean,scenes.indexOf(scene))&&evaluate(clean,scene.id,data.record).ok)c.record={...data.record};
      if(c.phase==='result'&&!c.record)c.phase=canRecord(clean,scene.id)?'activity':'explore';
    }
    clean.sceneIndex=canVisit(clean,saved.sceneIndex)?saved.sceneIndex:scenes.findIndex(scene=>!chapter(clean,scene.id).record);
    clean.screen=saved.screen;
    if(['discovery','ending'].includes(clean.screen)&&!allComplete(clean))clean.screen='play';
    return clean;
  }catch{return initialState();}
}
