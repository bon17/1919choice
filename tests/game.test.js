import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,evaluate,restore} from '../game.js';
const ready=()=>({...initialState(),heard:['work','vote','priority'],demand:'vote',evidence:'vote'});
test('requires interview evidence before submission',()=>assert.equal(evaluate({...ready(),heard:['work']}).ok,false));
test('economic worries are not mistaken for the stated priority',()=>assert.equal(evaluate({...ready(),demand:'jobs',evidence:'work'}).ok,false));
test('a correct demand cannot pass with unrelated evidence',()=>assert.equal(evaluate({...ready(),evidence:'work'}).ok,false));
test('both political statements are valid evidence',()=>{assert.equal(evaluate(ready()).ok,true);assert.equal(evaluate({...ready(),evidence:'priority'}).ok,true);});
test('restores progress and rejects corrupt or incompatible saves',()=>{const s={...ready(),screen:'report'};assert.deepEqual(restore(JSON.stringify(s)),s);for(const raw of ['oops','null',JSON.stringify({...s,version:2}),JSON.stringify({...s,heard:['unknown']})])assert.deepEqual(restore(raw),initialState());});
