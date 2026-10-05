(()=>{
  const scene=document.querySelector('#hammer-scene');
  if(!scene)return;
  const hammer=document.querySelector('#moving-hammer');
  const observed=document.querySelector('#hammer-observed-path');
  const impact=document.querySelector('#hammer-impact');
  const progress=document.querySelector('#hammer-progress');
  const output=document.querySelector('#hammer-progress-output');
  const play=document.querySelector('#toggle-hammer');
  const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const state={enabled:!motionPreference.matches,visible:false,progress:motionPreference.matches?1:0,cycle:0,lastFrame:0,raf:0};
  const flightMs=2800,holdMs=1100,resetMs=600,totalMs=flightMs+holdMs+resetMs;
  function point(t){return{x:(1-t)*(1-t)*115+2*(1-t)*t*345+t*t*648,y:(1-t)*(1-t)*285+2*(1-t)*t*20+t*t*210};}
  function angle(t){return -45+45*t+12*Math.sin(Math.PI*t);}
  function place(element,t){const p=point(t),degrees=angle(t),r=degrees*Math.PI/180;element.setAttribute('transform',`translate(${p.x-38*Math.cos(r)} ${p.y-38*Math.sin(r)}) rotate(${degrees})`);}
  const ns='http://www.w3.org/2000/svg';
  for(const t of [.23,.5,.76]){const ghost=document.createElementNS(ns,'g');ghost.setAttribute('opacity','.08');const use=document.createElementNS(ns,'use');use.setAttribute('href','#mallet-shape');ghost.append(use);place(ghost,t);document.querySelector('#hammer-ghosts').append(ghost);}
  function rotate(p,pivot,degrees){const r=degrees*Math.PI/180,c=Math.cos(r),s=Math.sin(r);return{x:pivot.x+(p.x-pivot.x)*c-(p.y-pivot.y)*s,y:pivot.y+(p.x-pivot.x)*s+(p.y-pivot.y)*c};}
  function moveArm(t){
    const raw=Math.max(0,Math.min(1,(t-.12)/.66));const easing=raw*raw*(3-2*raw),remaining=1-easing;
    const shoulder=40*remaining,elbow=35*remaining,wrist=-45*remaining;
    document.querySelector('#arm-shoulder-link').setAttribute('transform',`rotate(${shoulder} 803 358)`);
    document.querySelector('#arm-elbow-link').setAttribute('transform',`rotate(${elbow} 752 289)`);
    document.querySelector('#arm-wrist-link').setAttribute('transform',`rotate(${wrist} 804 203)`);
    let target=rotate({x:648,y:210},{x:804,y:203},wrist);target=rotate(target,{x:752,y:289},elbow);target=rotate(target,{x:803,y:358},shoulder);
    document.querySelector('#target-interception-path').setAttribute('d',`M${target.x} ${target.y} Q${(target.x+648)/2} ${Math.min(target.y,210)-18} 648 210`);
    document.querySelector('#target-interception-path').setAttribute('opacity',String(.55*remaining));
    document.querySelector('#predicted-contact-marker').setAttribute('opacity',String(.48*remaining));
  }
  function draw(t,hold=0){
    state.progress=t;place(hammer,t);moveArm(t);
    let d='';for(let n=0;n<=30;n++){const p=point(t*n/30);d+=(n?' L':'M')+p.x.toFixed(2)+' '+p.y.toFixed(2);}
    observed.setAttribute('d',d);progress.value=Math.round(t*100);output.textContent=Math.round(t*100)+'%';
    const hit=t>=.999;impact.setAttribute('opacity',hit?String(.75-.25*Math.min(hold,1)):'0');
    document.querySelector('#impact-ring').setAttribute('r',String(42+hold*14));document.querySelector('#impact-ring-outer').setAttribute('r',String(56+hold*19));
    document.querySelector('#contact-state-label').textContent=hit?'Contact at the center':t<.12?'Observe the moving hammer':t<.78?'Robot moves to intercept':'Ready for the contact';
    document.querySelector('#contact-state-dot').setAttribute('fill',hit?'#bc9551':'#326e79');
    for(const [id,active] of [['stage-observe',t<.2],['stage-forecast',t>=.2&&!hit],['stage-contact',hit]])document.querySelector('#'+id).classList.toggle('current',active);
  }
  function syncButton(){const active=state.enabled&&state.visible&&!document.hidden;play.setAttribute('aria-label',active?'Pause hammer contact animation':'Play hammer contact animation');document.querySelector('#hammer-play-icon').textContent=active?'Ⅱ':'▶';document.querySelector('#hammer-play-label').textContent=active?'Pause':'Play';}
  function frame(timestamp){
    state.raf=0;
    if(!state.enabled||!state.visible||document.hidden){state.lastFrame=0;syncButton();return;}
    if(state.lastFrame)state.cycle=(state.cycle+Math.min(timestamp-state.lastFrame,70))%totalMs;
    state.lastFrame=timestamp;
    if(state.cycle<=flightMs){hammer.setAttribute('opacity','1');draw(state.cycle/flightMs);}
    else if(state.cycle<=flightMs+holdMs){hammer.setAttribute('opacity','1');draw(1,(state.cycle-flightMs)/holdMs);}
    else{const reset=(state.cycle-flightMs-holdMs)/resetMs;hammer.setAttribute('opacity',String(Math.max(0,1-reset)));draw(1,1);moveArm(.78*(1-reset));impact.setAttribute('opacity',String(Math.max(0,.5*(1-reset))));}
    syncButton();state.raf=requestAnimationFrame(frame);
  }
  function start(){syncButton();if(state.enabled&&state.visible&&!document.hidden&&!state.raf)state.raf=requestAnimationFrame(frame);}
  play.addEventListener('click',()=>{state.enabled=!state.enabled;state.lastFrame=0;if(state.enabled&&state.progress>=1)state.cycle=0;start();});
  document.querySelector('#replay-hammer').addEventListener('click',()=>{state.cycle=0;state.lastFrame=0;state.enabled=true;hammer.setAttribute('opacity','1');draw(0);start();});
  progress.addEventListener('input',()=>{state.enabled=false;state.lastFrame=0;state.cycle=Number(progress.value)/100*flightMs;hammer.setAttribute('opacity','1');draw(Number(progress.value)/100);syncButton();});
  document.addEventListener('visibilitychange',()=>{state.lastFrame=0;start();});
  motionPreference.addEventListener('change',e=>{state.enabled=!e.matches;state.lastFrame=0;if(e.matches){hammer.setAttribute('opacity','1');draw(1)}start();});
  if('IntersectionObserver' in window){new IntersectionObserver(entries=>{state.visible=entries[0].isIntersecting;state.lastFrame=0;start();},{threshold:.15}).observe(scene);}else{state.visible=true;start();}
  draw(state.progress);syncButton();
})();
