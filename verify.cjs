const fs=require('fs'),vm=require('vm'),assert=require('assert');const html=fs.readFileSync('index.html','utf8'),script=html.match(/<script>([\s\S]*)<\/script>/)[1];let items={},storage={},printed=0;const el=id=>items[id]||(items[id]={innerHTML:'',textContent:'',value:'',style:{},open:false,showModal(){this.open=true},close(){this.open=false}});const context={document:{getElementById:el},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},window:{print(){printed++}},confirm:()=>true};const ctx=vm.createContext(context);vm.runInContext(script,ctx);vm.runInContext(`
function click(id){document.getElementById('body').onclick({target:{closest:()=>({id,dataset:{}})}})}
if(missions.length!==16||choices.length!==16||choices.some(x=>x.length!==2))throw Error('question counts');
if(available(1)||unlock(1))throw Error('initial locks');
openMission(0);if((document.getElementById('body').innerHTML.match(/<fieldset>/g)||[]).length!==3)throw Error('three questions missing');
state.selected[0]=[0,0];state.answers[0]='比較記録';if(!validate(0))throw Error('wrong objective accepted');state.selected[0]=[1,0];state.answers[0]='';if(!validate(0))throw Error('empty prose accepted');
for(let i=0;i<16;i++){
 state.stage=Math.floor(i/4);openMission(i);state.selected[i]=choices[i].map(q=>q.correct===null?0:q.correct);document.getElementById('answer').value='資料を根拠にした自分の考え '+i;click('complete');
 if(state.done.length!==i+1)throw Error('completion failed');
 if(document.getElementById('body').innerHTML.includes('id="continue"')||document.getElementById('body').innerHTML.includes('<textarea'))throw Error('auto navigation');
 if(current!==i)throw Error('current moved without click');click('back');if(document.getElementById('modal').open)throw Error('not back to board');
 if(i<15&&!available(i+1))throw Error('next locked');
}
openMission(0);document.getElementById('answer').value='修正した記録';click('complete');if(state.done.length!==16)throw Error('duplicate stamp');state.name='<script>alert(1)</scr'+'ipt>';if(ticketHTML().includes('<script>'))throw Error('unsafe rendering');printAll();
`,ctx);assert.equal(printed,1);assert.ok(html.includes('data:image/png;base64,'));console.log('PASS: 16 × 3 questions; choice validation; written answer required; sequential unlock; manual next-mission click; stamp uniqueness; safe report and ticket');
