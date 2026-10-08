export const questions = [
 {id:'work',label:'일터에서 어떤 어려움이 있나요?',topic:'일터와 생활',answer:'전쟁이 끝난 뒤에도 이 공장에서 계속 일할 수 있을지 걱정돼요. 일자리를 잃으면 생활비를 마련하기 어려워질 테니까요.'},
 {id:'vote',label:'나라의 결정에 의견을 낼 수 있나요?',topic:'정치적 권리',answer:'나라를 위해 일했지만 대표를 뽑을 권리는 없어요. 우리 삶에 영향을 주는 결정인데, 제 목소리는 빠져 있죠.'},
 {id:'priority',label:'가장 먼저 바꾸고 싶은 것은 무엇인가요?',topic:'가장 중요한 변화',answer:'일자리도 중요해요. 하지만 가장 먼저, 우리 삶을 결정하는 정치에 여성도 참여할 수 있었으면 좋겠어요.'}
];
export const demands = [
 {id:'jobs',label:'여성의 일자리 유지',detail:'전쟁 이후에도 일을 계속할 기회',card:'일자리 유지',area:'economic',connection:'경제적 삶의 개선',evidence:['work'],response:'일자리를 잃을까 걱정하는 제 이야기를 기억해 주셨네요. 계속 일할 수 있는 기회도 제게 중요한 요구예요. 정치에 목소리를 낼 권리도 함께 바라고 있어요.'},
 {id:'vote',label:'여성의 정치 참여 확대',detail:'대표를 뽑고 정치에 목소리를 낼 권리',card:'여성 참정권',area:'political',connection:'정치 참여 확대',evidence:['vote','priority'],response:'네, 저는 정치에 제 목소리를 낼 권리를 가장 바라고 있어요. 일자리와 생활에 관한 결정에도 여성의 의견이 함께 반영되었으면 좋겠어요.'},
 {id:'support',label:'생활 지원 확대',detail:'불안한 생활을 돕는 경제적 지원',card:'생활 지원',area:'economic',connection:'경제적 삶의 개선',evidence:['work'],response:'생활비를 마련하기 어려워질까 걱정하는 제 마음을 알아주셨네요. 생활을 돕는 지원도 필요해요. 도움을 받는 것과 함께, 우리 삶에 관한 결정에 참여할 권리도 바라고 있어요.'}
];
export const canRecord = state => questions.every(question => state.heard.includes(question.id));
export const initialState = () => ({version:2,screen:'intro',heard:[],active:null,demand:null,evidence:null,completed:false});
export function restore(raw) {
 try {
  const s=JSON.parse(raw);
  if(![1,2].includes(s.version) || !['intro','interview','report','complete'].includes(s.screen) || !Array.isArray(s.heard) || s.heard.some(id=>!questions.some(q=>q.id===id)) || typeof s.completed!=='boolean')return initialState();
  const clean={...initialState(),heard:[...new Set(s.heard)],screen:s.screen,active:questions.some(q=>q.id===s.active)&&s.heard.includes(s.active)?s.active:null,demand:demands.some(d=>d.id===s.demand)?s.demand:null,evidence:s.heard.includes(s.evidence)?s.evidence:null,completed:s.completed};
  if(clean.screen==='report'&&!canRecord(clean))clean.screen='interview';
  if(clean.completed&&!evaluate(clean).ok){clean.completed=false;clean.screen=canRecord(clean)?'report':'interview';}
  if(clean.screen==='complete'&&!clean.completed)clean.screen='interview';
  return clean;
 }catch{return initialState();}
}
export function evaluate(s) {
 if(!canRecord(s))return {ok:false,kind:'guidance',title:'세 이야기를 모두 들어볼까요?',text:'일터의 어려움, 정치 참여, 가장 먼저 바라는 변화를 모두 들은 뒤 생각을 정리해 주세요.'};
 const demand=demands.find(d=>d.id===s.demand);
 if(!demand||!s.evidence)return {ok:false,kind:'guidance',title:'어떤 요구를 기록하고 싶나요?',text:'이 사람이 바라는 변화와, 그렇게 생각한 이유가 된 발언을 함께 골라주세요.'};
 if(!s.heard.includes(s.evidence))return {ok:false,kind:'guidance',title:'그 이야기를 직접 들어볼까요?',text:'인터뷰에서 들은 발언을 근거로 골라주세요.'};
 if(!demand.evidence.includes(s.evidence))return {ok:false,kind:'conversation',title:'고른 요구와 이어지는 이야기를 함께 볼까요?',text:demand.area==='political'?'일자리를 잃을까 걱정된다는 말도 제 마음을 담고 있어요. 정치 참여를 기록하려면, 제가 대표를 뽑을 권리와 정치에 참여하고 싶은 마음을 이야기한 발언을 연결해 주시겠어요?':'대표를 뽑고 싶다는 말은 정치 참여에 관한 이야기예요. 지금 고른 일자리나 생활의 요구에는, 제가 일터와 생활비를 걱정한 발언이 더 잘 이어져요. 고른 요구를 바꾸지 않아도 그 발언을 근거로 기록할 수 있어요.'};
 return {ok:true,kind:'confirmed',title:'제 이야기에서 그 요구를 찾아주셨네요.',text:demand.response,demandId:demand.id};
}
export function recordedDemand(state){return state.completed?demands.find(d=>d.id===state.demand):null;}
