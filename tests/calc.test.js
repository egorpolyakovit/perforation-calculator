const assert=require('node:assert/strict');const {calculate,estimate}=require('../src/calc.js');
const a=calculate({length:100,width:100,size:10,pitch:20,edge:0,quantity:2,pattern:'rg'});
assert.equal(a.holes,25);assert.equal(a.holesTotal,50);assert.ok(Math.abs(a.cutLength-25*Math.PI*10/1000)<1e-10);
const b=calculate({length:100,width:100,size:10,pitch:20,edge:0,quantity:1,pattern:'qg'});assert.equal(b.openPercent,25);
const c=calculate({length:100,width:100,size:10,pitch:25,edge:0,quantity:1,pattern:'rv'});assert.equal(c.holes,16);
assert.throws(()=>calculate({length:100,width:100,size:12,pitch:10,edge:0,quantity:1,pattern:'rg'}));
const e=estimate(a,{speedMMin:2,setupMin:30,rateHour:600,materialPerM2:100});assert.ok(e.total>0);
console.log('All geometry and estimation tests passed');
