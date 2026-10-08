import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,evaluate,restore,canRecord} from '../game.js';
const ready=()=>({...initialState(),heard:['work','vote','priority'],demand:'vote',evidence:'vote'});
test('requires all three distinct stories before recording in any order',()=>{for(const heard of [[],['vote'],['work','vote'],['vote','vote','priority']]){assert.equal(canRecord({...ready(),heard}),false);assert.equal(evaluate({...ready(),heard}).ok,false);}assert.equal(canRecord({...ready(),heard:['priority','work','vote']}),true);assert.equal(evaluate(ready()).ok,true);});
test('other real needs receive a personal response and remain available to revise',()=>{for(const demand of ['jobs','support']){const r=evaluate({...ready(),demand,evidence:'work'});assert.equal(r.ok,false);assert.equal(r.kind,'conversation');assert.match(r.text,/제|저/);assert.doesNotMatch(r.title+r.text,/틀렸|우선순위를 다시/);}});
test('a correct demand cannot pass with unrelated evidence',()=>assert.equal(evaluate({...ready(),evidence:'work'}).ok,false));
test('both political statements are valid evidence',()=>{assert.equal(evaluate(ready()).ok,true);assert.equal(evaluate({...ready(),evidence:'priority'}).ok,true);});
test('restores progress and rejects corrupt or incompatible saves',()=>{const s={...ready(),screen:'report'};assert.deepEqual(restore(JSON.stringify(s)),s);for(const raw of ['oops','null',JSON.stringify({...s,version:2}),JSON.stringify({...s,heard:['unknown']})])assert.deepEqual(restore(raw),initialState());});

test('resumes an old incomplete report at interview without losing heard stories',()=>{const s={...ready(),screen:'report',heard:['vote']};const result=restore(JSON.stringify(s));assert.equal(result.screen,'interview');assert.deepEqual(result.heard,['vote']);assert.equal(result.demand,'vote');});
