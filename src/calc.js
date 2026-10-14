(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.PerforationCalc=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const PATTERNS={rg:'Round · straight',rv:'Round · staggered',qg:'Square · straight',qv:'Square · staggered'};
function countAxis(extent,size,pitch,offset=0){return extent<size+offset?0:Math.floor((extent-size-offset)/pitch+1e-9)+1;}
function calculate(o){
 const {length,width,size,pitch,quantity=1,pattern='rg',edge=0}=o;
 for(const [key,n] of Object.entries({length,width,size,pitch,quantity,edge}))if(!Number.isFinite(n)||n<0||((key!=='edge')&&n===0))throw Error('Invalid '+key);
 if(!PATTERNS[pattern])throw Error('Unknown pattern');
 if(pitch<size)throw Error('Pitch must be at least the hole size');
 if(length<=2*edge||width<=2*edge)throw Error('Margins exceed sheet size');
 if(quantity%1!==0)throw Error('Quantity must be a whole number');
 const L=length-2*edge,W=width-2*edge, staggered=pattern.endsWith('v');
 const rowCount=countAxis(W,size,pitch);let holes=0;
 for(let r=0;r<rowCount;r++)holes+=countAxis(L,size,pitch,staggered&&r%2?pitch/2:0);
 const areaHole=pattern.startsWith('r')?Math.PI*size*size/4:size*size;
 const perimeter=pattern.startsWith('r')?Math.PI*size:4*size;
 const sheetArea=length*width/1e6,openArea=holes*areaHole/1e6;
 return {holes,holesTotal:holes*quantity,sheetArea,totalArea:sheetArea*quantity,openArea,openPercent:100*openArea/sheetArea,cutLength:holes*perimeter/1000,totalCutLength:holes*perimeter*quantity/1000,rowCount,pattern,size,pitch,quantity,length,width,edge};
}
function estimate(result,{speedMMin,setupMin,rateHour,materialPerM2}={}){
 for(const [k,v] of Object.entries({speedMMin,setupMin,rateHour,materialPerM2}))if(!Number.isFinite(v)||v<0)throw Error('Invalid cost input '+k);
 if(speedMMin===0)throw Error('Cutting speed must be positive');
 const cutMinutes=result.totalCutLength/speedMMin;
 const timeMinutes=cutMinutes+setupMin;
 return {cutMinutes,timeMinutes,cuttingCost:timeMinutes/60*rateHour,materialCost:result.totalArea*materialPerM2,total:timeMinutes/60*rateHour+result.totalArea*materialPerM2};
}
return {PATTERNS,calculate,estimate,countAxis};
});
