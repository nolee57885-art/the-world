(() => {
  const canvas = document.getElementById("world");
  const ctx = canvas.getContext("2d");
  const $ = (id) => document.getElementById(id);
  const audio = $("audio");
  const scenes = [
    {name:"The quiet Nile",region:"EGYPT · NORTH AFRICA",desc:"Old stones, warm air, and a river that remembers.",time:"AMBER DUSK",weather:"A SOFT DESERT BREEZE",sky:["#e9a56f","#d97867","#624b67"],ground:"#80604c",water:"#416b70",accent:"#e6bd79",kind:"egypt"},
    {name:"Where the skies begin",region:"CAPPADOCIA · TÜRKİYE",desc:"A valley of soft light, drifting clouds and distant dreams.",time:"FIRST LIGHT",weather:"BALLOONS IN THE DISTANCE",sky:["#f5c89a","#e89b89","#788aa0"],ground:"#a76f5c",water:"#8a7772",accent:"#f4d7a6",kind:"turkey"},
    {name:"A palace by the water",region:"RAJASTHAN · INDIA",desc:"Lotus ponds, quiet courtyards and the colour of evening.",time:"GOLDEN HOUR",weather:"A MONSOON BREEZE",sky:["#e9b58b","#bd827d","#565e72"],ground:"#6f6959",water:"#557b78",accent:"#f1d39a",kind:"india"},
    {name:"The mountains are dreaming",region:"CHINA · EAST ASIA",desc:"Misty peaks rise behind an ancient garden temple.",time:"MISTY MORNING",weather:"CLOUDS BETWEEN THE PEAKS",sky:["#b6c9bd","#7e9b9b","#526c78"],ground:"#526b5e",water:"#547e7c",accent:"#e5d5ad",kind:"china"},
    {name:"A garden after rain",region:"KYOTO · JAPAN",desc:"A little bridge, lantern light and petals on the stream.",time:"BLUE HOUR",weather:"CHERRY BLOSSOM PETALS",sky:["#9a9ab0","#6d728d","#343d5c"],ground:"#53634e",water:"#426c70",accent:"#f0c6b7",kind:"japan"},
    {name:"The green beyond",region:"BALI · INDONESIA",desc:"Terraced hills disappear into a slow tropical morning.",time:"SOFT MORNING",weather:"WARM RAIN IN THE TREES",sky:["#a7c6b4","#80a99c","#547b78"],ground:"#4e7959",water:"#4c8981",accent:"#e8d5a0",kind:"bali"}
  ];
  let sceneIndex = Math.floor(Math.random()*scenes.length), W=320,H=180, lastTime=0, elapsed=0, particles=[], music=[], trackIndex=0, currentUrl=null;
  let clouds = Array.from({length:5},(_,i)=>({x:i*90-20,y:18+(i%3)*18,s:.65+(i%3)*.22}));
  let birds = Array.from({length:4},(_,i)=>({x:i*105+25,y:48+(i%2)*16,s:.5+(i%3)*.15}));
  function resize(){const dpr=Math.min(window.devicePixelRatio||1,2);W=Math.max(240,Math.round(innerWidth/4));H=Math.max(135,Math.round(innerHeight/4));canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false;ctx.scale(W/(innerWidth),H/(innerHeight));}
  function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));}
  function polygon(points,c){ctx.fillStyle=c;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();}
  function drawCloud(x,y,s,c){const k=s;px(x,y+4*k,22*k,6*k,c);px(x+5*k,y,12*k,5*k,c);px(x+2*k,y+1*k,18*k,5*k,c);}
  function drawTemple(kind,t,accent){
    const base=H*.69;
    if(kind==="egypt"){
      polygon([[W*.03,base],[W*.22,H*.31],[W*.40,base]],"#c99a6b");polygon([[W*.08,base],[W*.22,H*.42],[W*.35,base]],"#e0b47b");
      polygon([[W*.58,base],[W*.72,H*.42],[W*.87,base]],"#b98762");
      px(W*.68,base-30,W*.12,30,"#bd916d");for(let i=0;i<5;i++)px(W*(.69+i*.022),base-24,2,24,"#e0b47b");
      px(W*.47,base-7,W*.02,7,"#e5bf8c");
    } else if(kind==="turkey"){
      for(let i=0;i<5;i++){let x=W*(.16+i*.16),y=base-35-(i%2)*15;polygon([[x,y+25],[x+7,y],[x+14,y+25]],"#a96f5d");px(x+4,y+13,6,12,"#d6a17e");}
      for(let i=0;i<3;i++){let x=W*(.28+i*.18)+Math.sin(t*.35+i)*3;px(x,base-48-i%2*9,2,12,"#493f52");polygon([[x-7,base-48-i%2*9],[x+1,base-56-i%2*9],[x+8,base-48-i%2*9]],"#493f52");}
    } else if(kind==="india"){
      px(W*.28,base-34,W*.43,34,"#b77d69");px(W*.34,base-47,W*.31,15,"#c99579");px(W*.43,base-60,W*.12,14,"#d9aa81");px(W*.465,base-72,W*.05,12,"#e4bf91");
      for(let i=0;i<7;i++){let x=W*(.31+i*.055);px(x,base-25,3,25,"#604e4d");}
      px(W*.46,base-43,3,9,"#493e48");px(W*.52,base-43,3,9,"#493e48");
    } else if(kind==="china"){
      polygon([[W*.08,base],[W*.28,H*.2],[W*.49,base]],"#536d6d");polygon([[W*.36,base],[W*.64,H*.13],[W*.9,base]],"#6d8580");
      px(W*.42,base-28,W*.2,28,"#8e7768");px(W*.39,base-32,W*.26,5,"#c99c73");polygon([[W*.38,base-32],[W*.52,base-45],[W*.66,base-32]],"#b87d62");px(W*.5,base-44,3,10,"#e0b27c");
    } else if(kind==="japan"){
      px(W*.57,base-30,W*.13,30,"#8f5c55");px(W*.55,base-34,W*.17,5,"#d8a078");polygon([[W*.53,base-34],[W*.635,base-46],[W*.74,base-34]],"#624c59");px(W*.62,base-52,8,6,"#e0a77d");
      for(let i=0;i<6;i++){let x=W*(.08+i*.13),y=base-40-(i%3)*8;px(x,y,12,5,"#d18d9c");px(x+3,y-5,7,5,"#e8b3b6");}
    } else {
      for(let i=0;i<6;i++){let x=W*(.1+i*.14),y=base-25-(i%3)*9;px(x,y,28,3,"#a6a86d");px(x+4,y-9,22,3,"#8caa70");}
      px(W*.66,base-32,3,32,"#594f48");px(W*.62,base-37,12,9,"#4d7857");px(W*.68,base-43,15,12,"#5f8b61");
    }
  }
  function drawTree(x,y,s,c){px(x+5*s,y-12*s,4*s,15*s,"#564d45");px(x,y-22*s,14*s,13*s,c);px(x+3*s,y-27*s,8*s,8*s,c);}
  function draw(t){
    const s=scenes[sceneIndex], phase=(Math.sin(t*.025)+1)/2, sky=s.sky;
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,sky[0]);g.addColorStop(.58,sky[1]);g.addColorStop(1,sky[2]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // distant sun and tiny stars
    const sunX=W*(.76+Math.sin(t*.012)*.025),sunY=H*(.28+phase*.06);
    ctx.fillStyle=s.accent;ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(sunX,sunY,Math.max(5,W*.027),0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    for(let i=0;i<18;i++){let x=(i*73+11)%W,y=(i*37+9)%(H*.48);if(phase<.3)px(x,y,1,1,"#fff0cf");}
    clouds.forEach((c,i)=>{c.x+=.025*c.s;if(c.x>W+30)c.x=-35;drawCloud(c.x,c.y,c.s,"rgba(255,238,211,.32)");});
    // layered distant landscape
    polygon([[0,H*.62],[W*.12,H*.45],[W*.25,H*.59],[W*.42,H*.4],[W*.58,H*.61],[W*.78,H*.43],[W,H*.62],[W,H],[0,H]],s.kind==="china"?"#617d78":"#6f7774");
    polygon([[0,H*.69],[W*.17,H*.56],[W*.31,H*.68],[W*.53,H*.52],[W*.7,H*.67],[W*.88,H*.54],[W,H*.68],[W,H],[0,H]],s.ground);
    drawTemple(s.kind,t,s.accent);
    if(["india","japan","bali","china"].includes(s.kind)){for(let i=0;i<12;i++)drawTree((i*47+Math.sin(t*.2+i)*2)%W,H*.73,.55+(i%3)*.15,s.kind==="japan"?"#64765d":"#426d58");}
    // water / foreground
    if(["egypt","india","japan"].includes(s.kind)){px(0,H*.77,W,H*.23,s.water);for(let i=0;i<24;i++){let x=(i*31+t*(.25+i%3*.08))%W;px(x,H*(.79+(i%7)*.026),5+(i%4)*3,1,"rgba(240,210,160,.5)");}}
    else {polygon([[0,H*.83],[W*.2,H*.75],[W*.43,H*.82],[W*.7,H*.73],[W,H*.8],[W,H],[0,H]],s.kind==="bali"?"#3f694d":"#485c50");}
    // drifting foreground glimmers and birds
    birds.forEach((b,i)=>{b.x-=.12*b.s;if(b.x<-10)b.x=W+10;px(b.x,b.y+Math.sin(t*.03+i)*2,3,1,"#443f50");px(b.x+3,b.y+1+Math.sin(t*.03+i)*2,3,1,"#443f50");});
    for(let i=0;i<9;i++){let x=(i*61+t*(.08+i%2*.06))%W,y=H*(.76+(i*17%20)/100);px(x,y,1,1,"rgba(255,226,174,.65)");}
    // vignette
    const v=ctx.createRadialGradient(W/2,H*.48,H*.18,W/2,H*.48,H*.8);v.addColorStop(0,"rgba(12,16,30,0)");v.addColorStop(1,"rgba(12,16,30,.34)");ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
  }
  function frame(now){const dt=Math.min((now-lastTime)/1000||0,.05);lastTime=now;elapsed+=dt;draw(elapsed);requestAnimationFrame(frame);}
  function setScene(i){sceneIndex=(i+scenes.length)%scenes.length;const s=scenes[sceneIndex];$("place").textContent=s.name;$("region").textContent=s.region;$("description").textContent=s.desc;$("scene-time").textContent=s.time;$("scene-weather").textContent=s.weather;$("chapter").textContent="A QUIET JOURNEY";$("hint").textContent="A small journey, just for you";$("place").style.animation="none";void $("place").offsetWidth;$("place").style.animation="arrive .8s ease both";}
  $("discover").addEventListener("click",()=>{let next=sceneIndex;while(next===sceneIndex)next=Math.floor(Math.random()*scenes.length);setScene(next);});
  function updateTrack(){if(!music.length){$("track-name").textContent="Your music, your moment";$("track-hint").textContent="Add your classical or flute playlist";$("play").textContent="▶";return;}const f=music[trackIndex];$("track-name").textContent=f.name.replace(/\.[^.]+$/,"");$("track-hint").textContent=(trackIndex+1)+" of "+music.length+" · Your playlist";$("play").textContent=audio.paused?"▶":"Ⅱ";}
  function playTrack(i){if(!music.length)return;trackIndex=(i+music.length)%music.length;if(currentUrl)URL.revokeObjectURL(currentUrl);currentUrl=URL.createObjectURL(music[trackIndex]);audio.src=currentUrl;audio.play().then(updateTrack).catch(()=>{$("track-hint").textContent="Tap play to start your music";updateTrack();});updateTrack();}
  $("music-files").addEventListener("change",e=>{music=Array.from(e.target.files||[]);trackIndex=0;if(music.length)playTrack(0);});
  $("play").addEventListener("click",()=>{if(!music.length){$("music-files").click();return;}if(audio.paused)audio.play().then(updateTrack).catch(()=>{});else audio.pause();updateTrack();});
  $("next").addEventListener("click",()=>playTrack(trackIndex+1));$("previous").addEventListener("click",()=>playTrack(trackIndex-1));
  audio.addEventListener("ended",()=>{if(music.length>1)playTrack(trackIndex+1);else updateTrack();});audio.addEventListener("play",updateTrack);audio.addEventListener("pause",updateTrack);
  $("volume").addEventListener("input",e=>audio.volume=Number(e.target.value));audio.volume=.65;
  window.addEventListener("resize",resize);resize();setScene(sceneIndex);requestAnimationFrame(frame);
  window.addEventListener("beforeunload",()=>{if(currentUrl)URL.revokeObjectURL(currentUrl);});
})();