export const questions = [
 {id:'work',label:'일터에서 어떤 어려움이 있나요?',topic:'일터와 생활',answer:'전쟁이 끝난 뒤에도 이 공장에서 계속 일할 수 있을지 걱정돼요. 일자리를 잃으면 생활비를 마련하기 어려워질 테니까요.'},
 {id:'vote',label:'나라의 결정에 의견을 낼 수 있나요?',topic:'정치적 권리',answer:'나라를 위해 일했지만 대표를 뽑을 권리는 없어요. 우리 삶에 영향을 주는 결정인데, 제 목소리는 빠져 있죠.'},
 {id:'priority',label:'가장 먼저 바꾸고 싶은 것은 무엇인가요?',topic:'가장 중요한 변화',answer:'일자리도 중요해요. 하지만 가장 먼저, 우리 삶을 결정하는 정치에 여성도 참여할 수 있었으면 좋겠어요.'}
];
export const demands = [
 {id:'jobs',label:'여성의 일자리 유지',detail:'전쟁 이후에도 일을 계속할 기회'},
 {id:'vote',label:'여성의 정치 참여 확대',detail:'대표를 뽑고 정치에 목소리를 낼 권리'},
 {id:'support',label:'생활 지원 확대',detail:'불안한 생활을 돕는 경제적 지원'}
];
export const canRecord = state => questions.every(question => state.heard.includes(question.id));
export const initialState = () => ({version:1,screen:'intro',heard:[],active:null,demand:null,evidence:null,completed:false});
export function restore(raw) {
 try {const s=JSON.parse(raw);if(s.version!==1 || !['intro','interview','report','complete'].includes(s.screen) || !Array.isArray(s.heard) || s.heard.some(id=>!questions.some(q=>q.id===id)) || typeof s.completed!=='boolean')return initialState();
 if(s.screen==='complete'&&!s.completed)return initialState();
 return {...initialState(),...s,heard:[...new Set(s.heard)],screen:s.screen==='report'&&!canRecord(s)?'interview':s.screen,active:questions.some(q=>q.id===s.active)&&s.heard.includes(s.active)?s.active:null,demand:demands.some(d=>d.id===s.demand)?s.demand:null,evidence:s.heard.includes(s.evidence)?s.evidence:null};
 }catch{return initialState();}
}
export function evaluate(s) {
 if(!canRecord(s))return {ok:false,kind:'guidance',title:'세 이야기를 모두 들어볼까요?',text:'일터의 어려움, 정치 참여, 가장 먼저 바라는 변화를 모두 들은 뒤 생각을 정리해 주세요.'};
 if(!s.demand||!s.evidence)return {ok:false,kind:'guidance',title:'어떤 요구로 들렸나요?',text:'이 사람이 바라는 변화와, 그렇게 생각한 이유가 된 발언을 함께 골라주세요.'};
 if(!s.heard.includes(s.evidence))return {ok:false,kind:'guidance',title:'그 이야기를 직접 들어볼까요?',text:'인터뷰에서 들은 발언을 근거로 골라주세요.'};
 if(s.demand==='jobs')return {ok:false,kind:'conversation',title:'일자리를 계속 갖고 싶은 마음도 있어요.',text:'제 걱정을 알아주셨네요. 그런데 저는 그것보다, 우리 삶을 결정하는 정치에 제 의견을 낼 수 있는 권리를 더 원해요. 일자리 문제를 결정할 때도 제 목소리가 함께 들렸으면 좋겠어요.'};
 if(s.demand==='support')return {ok:false,kind:'conversation',title:'생활을 도와주는 것도 제게 중요해요.',text:'생활이 어려워질까 걱정되니까요. 하지만 저는 도움을 받는 것과 함께, 우리 삶에 관한 결정에 직접 참여하고 싶어요. 대표를 뽑는 데 저도 한 표를 낼 수 있으면 좋겠어요.'};
 if(!['vote','priority'].includes(s.evidence))return {ok:false,kind:'conversation',title:'그 말도 제 걱정을 담고 있어요.',text:'일자리를 잃을까 걱정된다는 이야기였죠. 제가 정치에 참여하고 싶은 이유를 설명한 말도 있었어요. 그 이야기를 함께 살펴봐 주시겠어요?'};
 return {ok:true,kind:'confirmed',title:'네, 제가 가장 바라는 변화예요.',text:'일자리와 생활도 중요하지만, 저는 정치에 제 목소리를 낼 권리를 더 원해요.'};
}
