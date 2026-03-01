const fs = require("fs");

const merchants = [
"TechCorp",
"Amazon",
"Flipkart",
"Apple",
"Microsoft",
"Walmart"
];

const categories = [
"Shopping",
"Food",
"Electronics",
"Travel"
];

const statuses = [
"Completed",
"Pending",
"Failed"
];

const TOTAL = 1000000;

const data = [];

for(let i=0;i<TOTAL;i++){

data.push({

id:i,

date:new Date(
Date.now()-Math.random()*1e12
).toISOString(),

merchant:
merchants[
Math.floor(Math.random()*merchants.length)
],

category:
categories[
Math.floor(Math.random()*categories.length)
],

amount:
Number((Math.random()*1000).toFixed(2)),

status:
statuses[
Math.floor(Math.random()*statuses.length)
],

description:"Transaction "+i

});

}

fs.writeFileSync(
"public/transactions.json",
JSON.stringify(data)
);

console.log("Generated 1 Million rows");