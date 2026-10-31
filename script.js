(() => {
"use strict";
const canvas=document.getElementById("world"),ctx=canvas.getContext("2d"),$=id=>document.getElementById(id);
const scenes=[
{name:"The quiet Nile",region:"EGYPT · NORTH AFRICA",desc:"Old stones, warm air, and a river that remembers.",time:"AMBER DUSK",weather:"A SOFT DESERT BREEZE",sky:["#edb17c","#d47c70","#55516b"],land:"#9b775e",far:"#7d6a67",water:"#416d72",accent:"#f5d39a",kind:"egypt"},
{name:"Where the skies begin",region:"CAPPADOCIA · TÜRKİYE",desc:"A valley of soft light, drifting clouds and distant dreams.",time:"FIRST LIGHT",weather:"BALLOONS IN THE DISTANCE",sky:["#f7cda4","#e99c8b","#7b91a1"],land:"#b77d68",far:"#9c756f",water:"#8a7772",accent:"#f6d7aa",kind:"turkey"},
{name:"A palace by the water",region:"RAJASTHAN · INDIA",desc:"Lotus ponds, quiet courtyards and the colour of evening.",time:"GOLDEN HOUR",weather:"A MONSOON BREEZE",sky:["#e9bd91","#c7857b","#555f76"],land:"#817568",far:"#6d6d69",water:"#527b7a",accent:"#f3d49c",kind:"india"},
{name:"The mountains are dreaming",region:"CHINA · EAST ASIA",desc:"Misty peaks rise behind an ancient garden temple.",time:"MISTY MORNING",weather:"CLOUDS BETWEEN THE PEAKS",sky:["#c0d2c7","#8ba9a5","#596f7d"],land:"#657d70",far:"#607879",water:"#557e7d",accent:"#eadbb8",kind:"china"},
{name:"A garden after rain",region:"KYOTO · JAPAN",desc:"A little bridge, lantern light and petals on the stream.",time:"BLUE HOUR",weather:"CHERRY BLOSSOM PETALS",sky:["#a6a6bb","#777c99","#3d4964"],land:"#5e715b",far:"#61716a",water:"#426d72",accent:"#f2c7c0",kind:"japan"},
{name:"The green beyond",region:"BALI · INDONESIA",desc:"Terraced hills disappear into a slow tropical morning.",time:"SOFT MORNING",weather:"WARM RAIN IN THE TREES",sky:["#b6d0b7","#86b0a0","#567e78"],land:"#4d7958",far:"#5f8b68",water:"#4c8981",accent:"#f1d7a0",kind:"bali"},
{name:"A valley wrapped in clouds",region:"KASHMIR · INDIA",desc:"Still water, cedar forests and mountains holding the morning.",time:"PALE MORNING",weather:"MIST OVER THE LAKE",sky:["#c7d7d2","#92b3b4","#617d8b"],land:"#587665",far:"#718b87",water:"#527f88",accent:"#f0d9b3",kind:"kashmir"},
{name:"The world turns quiet",region:"THE SWISS ALPS · SWITZERLAND",desc:"A wooden chalet rests beneath snow-bright peaks.",time:"WINTER SUN",weather:"SLOW SNOWFALL",sky:["#b9d0df","#8eafc2","#607e96"],land:"#55776a",far:"#8aa5ad",water:"#60818b",accent:"#fff0d5",kind:"alps"},
{name:"Where the river meets the sea",region:"KERALA · INDIA",desc:"Backwater palms lean over a world moving gently by.",time:"TROPICAL AFTERNOON",weather:"PALM LEAVES IN THE BREEZE",sky:["#f0c79b","#a9bba0","#5c807b"],land:"#4d7758",far:"#648a68",water:"#397c7c",accent:"#f7dda9",kind:"kerala"},
{name:"A city made of light",region:"ISTANBUL · TÜRKİYE",desc:"Domes and minarets gather above the shimmering Bosphorus.",time:"ROSE-GOLD EVENING",weather:"GULLS OVER THE WATER",sky:["#f0b38c","#c77f83","#59627b"],land:"#786c68",far:"#817879",water:"#456e7a",accent:"#f6d19a",kind:"istanbul"},
{name:"The long stone road",region:"THE GREAT WALL · CHINA",desc:"An ancient path winds through green mountains and distant haze.",time:"SUNLIT AFTERNOON",weather:"WIND THROUGH THE PINES",sky:["#c6d7bd","#9bb59c","#667f78"],land:"#55765b",far:"#6e8d79",water:"#547b77",accent:"#f4d8a5",kind:"wall"},
{name:"A forest full of stars",region:"A QUIET FOREST · SOMEWHERE",desc:"Fireflies wake beneath the trees as the last light fades.",time:"DEEP BLUE HOUR",weather:"FIREFLIES IN THE FERN",sky:["#687b88","#455d6b","#202f42"],land:"#294a43",far:"#345a52",water:"#355f63",accent:"#f4d58e",kind:"forest",stars:true}
];
let idx=0,W=480,H=270,last=0,t=0,changing=false;const clouds=Array.from({length:7},(_,i)=>({x:i*83-20,y:23+(i%4)*19,s:.65+(i%3)*.22})),birds=Array.from({length:5},(_,i)=>({x:i*115+20,y:68+(i%3)*13,s:.6+(i%2)*.2}));let petals=[],ripples=[],sparkles=[];
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.imageSmoothingEnabled=false}
function r(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,w),Math.max(1,h))}
function p(a,c){ctx.fillStyle=c;ctx.beginPath();a.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fill()}
function mountain(x,b,w,peak,c){p([[x,b],[x+w*.46,peak],[x+w,b]],c);p([[x+w*.46,peak],[x+w*.67,b],[x+w,b]],"rgba(25,45,55,.13)")}
function tree(x,y,k,c){r(x+6*k,y-20*k,4*k,23*k,"#554d45");r(x,y-29*k,17*k,15*k,c);r(x+4*k,y-36*k,10*k,10*k,c)}
function cloud(x,y,k){ctx.globalAlpha=.22;r(x,y+5*k,27*k,5*k,"#fff0d8");r(x+5*k,y,16*k,7*k,"#fff0d8");r(x+2*k,y+2*k,23*k,7*k,"#fff0d8");ctx.globalAlpha=1}
function landmark(s){
const y=178,k=s.kind;
if(k==="egypt"){p([[38,y],[119,83],[199,y]],"#d1a477");p([[69,y],[119,111],[169,y]],"#e4bc89");p([[279,y],[342,108],[410,y]],"#b88968");r(304,136,77,42,"#ad8068");for(let i=0;i<5;i++)r(312+i*14,144,5,34,"#dfb98b");}
if(k==="turkey"){for(let i=0;i<8;i++){let x=25+i*59,yy=139-(i%3)*18;p([[x,yy+38],[x+13,yy-12],[x+26,yy+38]],i%2?"#b77b66":"#c58c70");r(x+9,yy+13,8,25,"#d9a78a")}for(let i=0;i<4;i++){let x=90+i*88+Math.sin(t*.4+i)*4,yy=65+i%2*22;r(x,yy+10,12,17,"#a85e59");r(x+3,yy,6,12,"#e9c39e");}}
if(k==="india"){r(150,132,182,44,"#bd8972");r(169,117,145,18,"#d6a080");r(197,101,90,18,"#d8ad85");r(222,84,39,19,"#e2bf94");for(let i=0;i<7;i++)r(165+i*25,145,7,31,"#624f4d");}
if(k==="china"){mountain(0,y,170,62,"#536f70");mountain(300,y,180,47,"#718b80");r(214,146,83,30,"#a27c69");r(204,141,103,7,"#d5ae7c");p([[198,141],[255,116],[312,141]],"#aa705e");p([[191,141],[255,128],[319,141]],"#d5ae7c");}
if(k==="japan"){r(270,141,75,35,"#a7665d");r(260,136,95,7,"#d69c79");p([[254,137],[307,111],[361,137]],"#574d5d");p([[246,137],[307,123],[368,137]],"#c28a71");}
if(k==="bali"){for(let i=0;i<6;i++){let x=15+i*77,yy=152-i%3*13;r(x,yy,63,4,"#9cb37a");r(x+7,yy-13,50,4,"#7f9f69");r(x+15,yy-25,37,4,"#62885d")}r(337,132,5,44,"#554c40");p([[320,137],[339,111],[357,137]],"#496d50");}
if(k==="kashmir"){mountain(0,y,170,47,"#849e9e");mountain(120,y,190,35,"#789394");mountain(290,y,190,54,"#758e8f");r(204,147,78,29,"#a77c62");r(216,136,54,12,"#c49775");}
if(k==="alps"){mountain(0,y,190,39,"#8aa6b0");mountain(130,y,210,22,"#a5bbc4");mountain(310,y,170,48,"#819eaa");r(208,151,60,25,"#875f4e");p([[198,151],[238,124],[278,151]],"#634f4b");}
if(k==="kerala"){r(145,154,192,22,"#a77b58");p([[135,155],[240,124],[347,155]],"#755c4a");for(let i=0;i<4;i++){let x=25+i*120;r(x,90,5,85,"#665344");p([[x+2,95],[x-34,65],[x+3,83]],"#3d7557");p([[x+2,104],[x+38,72],[x+3,91]],"#477b5c");}}
if(k==="istanbul"){r(177,138,130,38,"#b58b78");ctx.fillStyle="#cfa58a";ctx.beginPath();ctx.arc(241,139,34,Math.PI,0);ctx.fill();r(230,94,5,46,"#e1b78b");r(288,105,5,71,"#caa17f");r(165,111,5,65,"#caa17f");}
if(k==="wall"){mountain(0,y,180,61,"#68856f");mountain(260,y,220,46,"#66816d");p([[0,158],[95,145],[165,125],[240,137],[330,110],[480,125],[480,137],[330,122],[240,149],[165,137],[95,157],[0,171]],"#c7a77e");for(let x=20;x<470;x+=35)r(x,143+Math.sin(x)*8,5,10,"#806f60");}
if(k==="forest"){for(let i=0;i<13;i++)tree(i*42-8,181,.9+(i%3)*.2,i%2?"#315d50":"#274e47")}
}
function draw(){
const s=scenes[idx],phase=(Math.sin(t*.018)+1)/2,g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,s.sky[0]);g.addColorStop(.58,s.sky[1]);g.addColorStop(1,s.sky[2]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
if(s.stars||phase<.18)for(let i=0;i<55;i++){ctx.globalAlpha=.35+.4*Math.sin(t*.8+i);r((i*83+17)%W,(i*47+13)%145,1,1,"#fff4da")}ctx.globalAlpha=1;
ctx.fillStyle=s.accent;ctx.beginPath();ctx.arc(365+Math.sin(t*.012)*9,76+Math.sin(t*.02)*3,13,0,Math.PI*2);ctx.fill();
clouds.forEach(c=>{c.x+=.018*c.s;if(c.x>W+40)c.x=-40;cloud(c.x,c.y,c.s)});
mountain(-30,184,200,94,s.far);mountain(120,184,210,76,s.far);mountain(330,184,190,105,s.far);
p([[0,180],[75,151],[155,178],[252,144],[345,179],[430,151],[480,176],[480,270],[0,270]],s.land);landmark(s);
if(["japan","india","bali","kashmir","kerala","forest"].includes(s.kind))for(let i=0;i<13;i++)tree((i*43+12)%480,190+i%4*10,.55+i%3*.16,s.kind==="japan"?"#526b55":"#477052");
if(["egypt","india","japan","kashmir","kerala","istanbul"].includes(s.kind)){r(0,204,480,66,s.water);for(let i=0;i<42;i++)r((i*37+t*(.12+i%4*.035))%500,210+i*19%55,5+i%5*3,1,i%3?"rgba(244,216,169,.35)":"rgba(198,226,210,.28)");if(s.kind==="japan"||s.kind==="india")for(let x=175;x<305;x+=7)r(x,220-Math.sin((x-175)/130*Math.PI)*15,6,2,"#b88a75");}
else p([[0,205],[85,192],[180,209],[280,190],[380,207],[480,195],[480,270],[0,270]],s.kind==="alps"?"#78918b":"#3f694f");
if(s.kind==="alps")for(let i=0;i<35;i++)r(i*53%480,(i*31+t*7)%270,2,2,"rgba(255,255,255,.7)");
if(s.kind==="forest")for(let i=0;i<22;i++){ctx.globalAlpha=.4+.4*Math.sin(t*2+i);r((i*71+Math.sin(t*.3+i)*12)%480,160+i*23%95,2,2,"#f8df91")}ctx.globalAlpha=1;
birds.forEach((b,i)=>{b.x-=.12*b.s;if(b.x<-10)b.x=W+10;let y=b.y+Math.sin(t*.05+i)*2;r(b.x,y,4,1,"#343d4a");r(b.x+4,y+1,4,1,"#343d4a")});
petals.forEach((v,i)=>{v.x+=v.vx+Math.sin(t*.04+i)*.12;v.y+=v.vy;v.rot+=.03;if(v.y>H+5)petals.splice(i,1);else{ctx.save();ctx.translate(v.x,v.y);ctx.rotate(v.rot);r(-2,-1,4,2,v.c);ctx.restore()}});
sparkles.forEach((v,i)=>{v.life-=.015;v.x+=v.vx;v.y+=v.vy;if(v.life<=0)sparkles.splice(i,1);else{ctx.globalAlpha=v.life;r(v.x,v.y,2,2,"#f3d8a2");ctx.globalAlpha=1}});
ripples.forEach((v,i)=>{v.r+=.7;v.life-=.025;if(v.life<=0)ripples.splice(i,1);else{ctx.strokeStyle="rgba(240,220,184,"+(v.life*.45)+")";ctx.beginPath();ctx.ellipse(v.x,v.y,v.r,v.r*.28,0,0,Math.PI*2);ctx.stroke()}});
const v=ctx.createRadialGradient(240,130,85,240,130,300);v.addColorStop(0,"rgba(10,17,28,0)");v.addColorStop(1,"rgba(10,17,28,.25)");ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
}
function setScene(i){idx=i;let s=scenes[idx];$("place").textContent=s.name;$("region").textContent=s.region;$("description").textContent=s.desc;$("scene-time").textContent=s.time;$("scene-weather").textContent=s.weather;$("place-count").textContent=String(idx+1).padStart(2,"0")+" / "+String(scenes.length).padStart(2,"0");$("place").style.animation="none";void $("place").offsetWidth;$("place").style.animation="arrive 1.1s ease both"}
function discover(){if(changing)return;changing=true;canvas.style.opacity="0";setTimeout(()=>{let n=idx;while(n===idx)n=Math.floor(Math.random()*scenes.length);setScene(n);petals=[];sparkles=[];canvas.style.opacity="1";setTimeout(()=>changing=false,700)},520)}
const audio=$("ambient-audio"),musicButton=$("music-play"),musicPlayer=document.querySelector(".music-player");
const tracks=[
{title:"Badinerie",artist:"J.S. Bach · European Archive",url:"https://www.orangefreesounds.com/wp-content/uploads/2017/09/Bach-badinerie.mp3"},
{title:"Träumerei",artist:"Robert Schumann · Donald Betts",url:"https://www.orangefreesounds.com/wp-content/uploads/2016/01/Traumerei-piano-music.mp3"},
{title:"Nocturne, Op. 9 No. 1",artist:"Frédéric Chopin · Olga Gurevich",url:"https://www.orangefreesounds.com/wp-content/uploads/2018/01/Chopin-nocturne-op-9-no-1-1.mp3"},
{title:"Waltz in A Minor",artist:"Frédéric Chopin · Aya Higuchi",url:"https://www.orangefreesounds.com/wp-content/uploads/2017/03/Chopin-waltz-in-a-minor.mp3"},
{title:"Morning Mood",artist:"Edvard Grieg · Musopen Symphony",url:"https://www.orangefreesounds.com/wp-content/uploads/2018/05/Edvard-grieg-morning-mood.mp3"}
];
let trackIndex=0,hasStarted=false,skipGuard=false;
function showTrack(){const track=tracks[trackIndex];$("track-title").textContent=track.title;$("track-artist").textContent=track.artist}
function setPlaying(playing){musicPlayer.classList.toggle("is-playing",playing);musicButton.innerHTML=playing?"Ⅱ":"▶";musicButton.setAttribute("aria-label",playing?"Pause music":"Play music");$("track-state").textContent=playing?"NOW PLAYING":"A LITTLE MUSIC"}
function loadTrack(index,autoplay){trackIndex=(index+tracks.length)%tracks.length;showTrack();audio.src=tracks[trackIndex].url;audio.load();if(autoplay){audio.play().then(()=>{hasStarted=true;setPlaying(true)}).catch(()=>{setPlaying(false);$("track-state").textContent="TAP PLAY TO LISTEN"})}}
async function startMusic(){if(!audio.src)loadTrack(trackIndex,false);try{await audio.play();hasStarted=true;setPlaying(true)}catch(error){setPlaying(false);$("track-state").textContent="TAP PLAY TO LISTEN"}}
musicButton.addEventListener("click",()=>{if(audio.paused)startMusic();else{audio.pause();setPlaying(false)}});
audio.addEventListener("ended",()=>loadTrack(trackIndex+1,true));
audio.addEventListener("error",()=>{if(skipGuard)return;skipGuard=true;setTimeout(()=>{skipGuard=false;if(hasStarted)loadTrack(trackIndex+1,true)},350)});
$("discover").addEventListener("click",discover);
$("enter-world").addEventListener("click",()=>{$("welcome").classList.add("leaving");startMusic()});

canvas.addEventListener("click",e=>{let b=canvas.getBoundingClientRect(),x=(e.clientX-b.left)/b.width*W,y=(e.clientY-b.top)/b.height*H,s=scenes[idx];if(y>190&&["egypt","india","japan","kashmir","kerala","istanbul"].includes(s.kind)){ripples.push({x,y,r:3,life:1});for(let i=0;i<6;i++)sparkles.push({x,y,vx:(Math.random()-.5)*1.2,vy:-Math.random()*.7,life:1})}else for(let i=0;i<10;i++)petals.push({x:x+(Math.random()-.5)*18,y:y+(Math.random()-.5)*14,vx:(Math.random()-.5)*.65,vy:.25+Math.random()*.55,rot:Math.random()*3,c:["#f2c9c4","#f0d7ad","#e8e5cf"][i%3]})});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("sound-panel").hidden){$("sound-panel").hidden=true;$("music-toggle").setAttribute("aria-expanded","false")}if(e.key==="ArrowRight"&&$("welcome").classList.contains("leaving"))discover()});
function frame(now){let dt=Math.min((now-last)/1000||0,.05);last=now;t+=dt;draw();requestAnimationFrame(frame)}
window.addEventListener("resize",resize);resize();setScene(0);requestAnimationFrame(frame);
})();