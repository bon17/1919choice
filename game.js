export const questions = [
 {id:'work',label:'일터에서 어떤 어려움이 있나요?',topic:'일터와 생활',answer:'전쟁 동안 공장에서 일했어요. 이제는 일을 계속할 수 있을지 걱정돼요. 생활도 불안하고요.'},
 {id:'vote',label:'나라의 결정에 의견을 낼 수 있나요?',topic:'정치적 권리',answer:'나라를 위해 일했지만 대표를 뽑을 권리는 없어요. 우리 삶에 영향을 주는 결정인데, 제 목소리는 빠져 있죠.'},
 {id:'priority',label:'가장 먼저 바꾸고 싶은 것은 무엇인가요?',topic:'가장 중요한 변화',answer:'일자리도 중요해요. 하지만 가장 먼저, 우리 삶을 결정하는 정치에 여성도 참여할 수 있었으면 좋겠어요.'}
];
export const demands = [
 {id:'jobs',label:'여성의 일자리 유지',detail:'전쟁 이후에도 일을 계속할 기회'},
 {id:'vote',label:'여성의 정치 참여 확대',detail:'대표를 뽑고 정치에 목소리를 낼 권리'},
 {id:'support',label:'생활 지원 확대',detail:'불안한 생활을 돕는 경제적 지원'}
];
export const initialState = () => ({version:1,screen:'intro',heard:[],active:null,demand:null,evidence:null,completed:false});
export function restore(raw) {
 try {const s=JSON.parse(raw);if(s.version!==1 || !['intro','interview','report','complete'].includes(s.screen) || !Array.isArray(s.heard) || s.heard.some(id=>!questions.some(q=>q.id===id)) || typeof s.completed!=='boolean')return initialState();
 if(s.screen==='complete'&&!s.completed)return initialState();
 return {...initialState(),...s,active:questions.some(q=>q.id===s.active)&&s.heard.includes(s.active)?s.active:null,demand:demands.some(d=>d.id===s.demand)?s.demand:null,evidence:s.heard.includes(s.evidence)?s.evidence:null};
 }catch{return initialState();}
}
export function evaluate(s) {
 if(!s.heard.includes('vote')||!s.heard.includes('priority'))return {ok:false,title:'아직 더 들어볼 이야기가 있어요',text:'정치에 의견을 낼 수 있는지, 가장 먼저 바꾸고 싶은 것은 무엇인지 물어보세요.'};
 if(!s.demand||!s.evidence)return {ok:false,title:'요구와 근거를 함께 골라주세요',text:'어떤 변화를 원하는지 고르고, 그 판단을 뒷받침하는 발언도 선택해 주세요.'};
 if(s.demand!=='vote')return {ok:false,title:'중요한 문제예요. 하지만 우선순위를 다시 보세요.',text:'일자리와 생활도 실제 걱정이에요. 이번 기록에는 이 사람이 가장 먼저 바꾸고 싶다고 말한 요구를 담아주세요.'};
 if(!['vote','priority'].includes(s.evidence))return {ok:false,title:'요구와 근거가 서로 다른 이야기를 하고 있어요',text:'일터의 불안은 고른 정치적 요구의 직접적인 근거가 아니에요. 대표를 뽑을 권리나 정치 참여를 말한 발언을 찾아보세요.'};
 return {ok:true,title:'그 목소리를 잘 담았어요.',text:'여성이 대표를 뽑고 정치에 참여할 권리. 여성 참정권 요구는 정치 참여 확대, 그리고 민주주의의 확산과 연결됩니다.'};
}
