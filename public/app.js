

let data=[];
let originalData=[];

let sortAsc=true;
let selectedRows=new Set();
let editingCell=null;
let pinnedColumns=new Set();

const ROW_HEIGHT=40;

const container=document.getElementById("container");
const windowEl=document.getElementById("window");
const sizer=document.getElementById("sizer");

const fpsEl=document.querySelector('[data-test-id="debug-fps"]');
const rowsEl=document.querySelector('[data-test-id="debug-rendered-rows"]');
const posEl=document.querySelector('[data-test-id="debug-scroll-position"]');


fetch("transactions.json")
.then(r=>r.json())
.then(d=>{
data=d;
originalData=d;

init();

setupSorting();
setupFiltering();
setupQuickFilters();
setupPinning();
});


function init(){

sizer.style.height=
data.length*ROW_HEIGHT+"px";

render();

}


function render(){

const scrollTop=container.scrollTop;
const height=container.clientHeight;

const startIndex=Math.floor(scrollTop/ROW_HEIGHT);
const visible=Math.ceil(height/ROW_HEIGHT);
const endIndex=startIndex+visible+5;

const rows=data.slice(startIndex,endIndex);

windowEl.style.transform=
`translateY(${startIndex*ROW_HEIGHT}px)`;

windowEl.innerHTML="";


rows.forEach((row,index)=>{

const div=document.createElement("div");
div.className="row";

div.setAttribute(
"data-test-id",
"virtual-row-"+row.id
);


/* Selected rows */

if(selectedRows.has(row.id)){
div.setAttribute("data-selected","true");
}


/* Row click */

div.onclick=(e)=>{

if(e.ctrlKey){

if(selectedRows.has(row.id)){
selectedRows.delete(row.id);
}else{
selectedRows.add(row.id);
}

}else{

selectedRows.clear();
selectedRows.add(row.id);

}

render();

};


/* ROW HTML */

div.innerHTML=`

<div class="cell id-cell">
${row.id}
</div>

<div class="cell">
${row.date}
</div>

<div class="cell merchant-cell"
data-test-id="cell-${startIndex+index}-merchant">

${editingCell===row.id
? `<input id="editInput" value="${row.merchant}" />`
: row.merchant}

</div>

<div class="cell">
${row.amount}
</div>

<div class="cell">
${row.status}
</div>

`;


/* Pin column */

if(pinnedColumns.has("id")){
div.querySelector(".id-cell")
.classList.add("pinned-column");
}


windowEl.appendChild(div);


/* CELL EDITING */

const merchantCell=
div.querySelector(".merchant-cell");

merchantCell.ondblclick=()=>{

editingCell=row.id;

render();

setTimeout(()=>{

const input=document.getElementById("editInput");

if(input){

input.focus();


input.onkeydown=(ev)=>{

if(ev.key==="Enter"){

row.merchant=input.value;

editingCell=null;

render();

}

};


input.onblur=()=>{

row.merchant=input.value;

editingCell=null;

render();

};

}

},50);

};

});


rowsEl.innerText=rows.length;

posEl.innerText=
`Row ${startIndex} / ${data.length}`;

}


/* SCROLL */

container.addEventListener(
"scroll",
()=>requestAnimationFrame(render)
);


/* SORTING */

function setupSorting(){

const header=document.querySelector(
'[data-test-id="header-amount"]'
);

header.onclick=()=>{

if(sortAsc){
data.sort((a,b)=>a.amount-b.amount);
}else{
data.sort((a,b)=>b.amount-a.amount);
}

sortAsc=!sortAsc;

container.scrollTop=0;

render();

};

}


/* FILTERING */

function setupFiltering(){

const input=document.querySelector(
'[data-test-id="filter-merchant"]'
);

const countEl=document.querySelector(
'[data-test-id="filter-count"]'
);

let timer;

input.addEventListener("input",(e)=>{

clearTimeout(timer);

timer=setTimeout(()=>{

const value=e.target.value.toLowerCase();

data=originalData.filter(x=>
x.merchant.toLowerCase().includes(value)
);

countEl.innerText=
`Showing ${data.length} of 1000000 rows`;

container.scrollTop=0;

render();

},300);

});

}


/* QUICK FILTER */

function setupQuickFilters(){

const completedBtn=document.querySelector(
'[data-test-id="quick-filter-Completed"]'
);

const pendingBtn=document.querySelector(
'[data-test-id="quick-filter-Pending"]'
);

const resetBtn=document.getElementById("resetFilter");

const countEl=document.querySelector(
'[data-test-id="filter-count"]'
);


completedBtn.onclick=()=>{

data=originalData.filter(
x=>x.status==="Completed"
);

countEl.innerText=
`Showing ${data.length} of 1000000 rows`;

container.scrollTop=0;

render();

};


pendingBtn.onclick=()=>{

data=originalData.filter(
x=>x.status==="Pending"
);

countEl.innerText=
`Showing ${data.length} of 1000000 rows`;

container.scrollTop=0;

render();

};


resetBtn.onclick=()=>{

data=originalData;

countEl.innerText=
`Showing 1000000 of 1000000 rows`;

container.scrollTop=0;

render();

};

}


/* PIN COLUMN */

function setupPinning(){

const pinBtn=document.querySelector(
'[data-test-id="pin-column-id"]'
);

const headerId=document.querySelector(
'[data-test-id="header-id"]'
);

pinBtn.onclick=()=>{

if(pinnedColumns.has("id")){

pinnedColumns.delete("id");
headerId.classList.remove("pinned-column");

}else{

pinnedColumns.add("id");
headerId.classList.add("pinned-column");

}

render();

};

}


/* FPS COUNTER */

let last=performance.now();

function fpsLoop(){

const now=performance.now();

const fps=1000/(now-last);

last=now;

fpsEl.innerText=fps.toFixed(1);

requestAnimationFrame(fpsLoop);

}

fpsLoop();