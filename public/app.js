let data=[];

const ROW_HEIGHT=40;

const container=
document.getElementById("container");

const windowEl=
document.getElementById("window");

const sizer=
document.getElementById("sizer");


const fpsEl=
document.querySelector(
'[data-test-id="debug-fps"]'
);

const rowsEl=
document.querySelector(
'[data-test-id="debug-rendered-rows"]'
);

const posEl=
document.querySelector(
'[data-test-id="debug-scroll-position"]'
);



fetch("transactions.json")
.then(r=>r.json())
.then(d=>{

data=d;

init();

});



function init(){

sizer.style.height=
data.length*ROW_HEIGHT+"px";

render();

}



function render(){

const scrollTop=
container.scrollTop;

const height=
container.clientHeight;


const startIndex=
Math.floor(scrollTop/ROW_HEIGHT);


const visible=
Math.ceil(height/ROW_HEIGHT);


const endIndex=
startIndex+visible+5;


const rows=
data.slice(startIndex,endIndex);


windowEl.style.transform=
`translateY(${startIndex*ROW_HEIGHT}px)`;


windowEl.innerHTML="";


rows.forEach(row=>{

const div=
document.createElement("div");

div.className="row";

div.setAttribute(
"data-test-id",
"virtual-row-"+row.id
);


div.innerHTML=`

<div class="cell">${row.id}</div>

<div class="cell">${row.date}</div>

<div class="cell">${row.merchant}</div>

<div class="cell">${row.amount}</div>

<div class="cell">${row.status}</div>

`;

windowEl.appendChild(div);

});


rowsEl.innerText=
rows.length;

posEl.innerText=
`Row ${startIndex} / ${data.length}`;

}



container.addEventListener(
"scroll",
()=>requestAnimationFrame(render)
);



let last=performance.now();

function fpsLoop(){

const now=performance.now();

const fps=
1000/(now-last);

last=now;

fpsEl.innerText=
fps.toFixed(1);

requestAnimationFrame(fpsLoop);

}

fpsLoop();