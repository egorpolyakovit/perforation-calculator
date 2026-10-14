(()=>{'use strict';
const $=id=>document.getElementById(id);
const fields=['pattern','length','width','size','pitch','edge','quantity','speedMMin','setupMin','rateHour','materialPerM2'];
const nf=new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2});
const schema={rg:'Круглые отверстия, прямые ряды',rv:'Круглые отверстия, смещённые ряды',qg:'Квадратные отверстия, прямые ряды',qv:'Квадратные отверстия, смещённые ряды'};
const images={rg:'perforation-illustration-rg-circles-straight.png',rv:'perforation-illustration-rg-circles-offset.png',qg:'perforation-illustration-qg-square-lines.png',qv:'perforation-illustration-qv-square-offset.png'};
let report='';
function metric(label,value){return `<div class="metric"><span>${label}</span><b>${value}</b></div>`;}
function reportRows(x,r,price){return [
['Тип перфорации',`${x.pattern.toUpperCase()} — ${schema[x.pattern]}`],
['Длина листа',`${nf.format(x.length)} мм`],
['Ширина листа',`${nf.format(x.width)} мм`],
['Размер отверстия',`${nf.format(x.size)} мм`],
['Шаг отверстий',`${nf.format(x.pitch)} мм`],
['Неперфорируемая кромка',`${nf.format(x.edge)} мм`],
['Количество листов',nf.format(x.quantity)],
['Отверстий на лист',nf.format(r.holes)],
['Всего отверстий',nf.format(r.holesTotal)],
['Открытая площадь',`${nf.format(r.openPercent)} %`],
['Площадь одного листа',`${nf.format(r.sheetArea)} м²`],
['Длина реза на лист',`${nf.format(r.cutLength)} м`],
['Общая длина реза',`${nf.format(r.totalCutLength)} м`],
['Скорость реза',`${nf.format(x.speedMMin)} м/мин`],
['Время наладки',`${nf.format(x.setupMin)} мин`],
['Ставка станка',`${nf.format(x.rateHour)} ₽/час`],
['Стоимость материала',`${nf.format(x.materialPerM2)} ₽/м²`],
['Оценочное время работы',`${nf.format(price.timeMinutes)} мин`],
['Предварительная стоимость',`${nf.format(price.total)} ₽`]
];}
function render(){try{
 const x=Object.fromEntries(fields.map(k=>[k,k==='pattern'?$(k).value:Number($(k).value)]));
 const r=PerforationCalc.calculate(x),price=PerforationCalc.estimate(r,x);
 $('error').textContent='';
 $('stats').innerHTML=[metric('Отверстий / лист',nf.format(r.holes)),metric('Всего отверстий',nf.format(r.holesTotal)),metric('Открытая площадь',nf.format(r.openPercent)+' %'),metric('Площадь листа',nf.format(r.sheetArea)+' м²'),metric('Длина реза / лист',nf.format(r.cutLength)+' м'),metric('Длина реза, всего',nf.format(r.totalCutLength)+' м')].join('');
 $('estimate').innerHTML=[metric('Расчётное время',nf.format(price.timeMinutes)+' мин'),metric('Расчётная сумма',nf.format(price.total)+' ₽')].join('');
 const rows=reportRows(x,r,price);
 report=['РАСЧЁТ ПЕРФОРАЦИИ ЛИСТОВОГО МЕТАЛЛА','',...rows.map(([key,value])=>`${key}: ${value}`),'','Предварительный инженерный расчёт; требует технологической проверки.'].join('\n');
 const host=$('printLines');host.replaceChildren();
 rows.forEach(([key,value])=>{const line=document.createElement('div');line.className='report-line';const strong=document.createElement('strong');strong.textContent=key+': ';line.append(strong,document.createTextNode(value));host.append(line);});
 $('originalPattern').src='assets/img/'+images[x.pattern];
 draw(x);
 }catch(e){$('error').textContent=e.message;$('stats').innerHTML='';$('estimate').innerHTML='';$('preview').replaceChildren();$('printLines').replaceChildren();report='';}}
function draw(x){const svg=$('preview'),ns='http://www.w3.org/2000/svg';svg.replaceChildren();const rect=document.createElementNS(ns,'rect');rect.setAttribute('x','25');rect.setAttribute('y','20');rect.setAttribute('width','470');rect.setAttribute('height','310');rect.setAttribute('rx','6');rect.setAttribute('fill','#e4e4e4');svg.append(rect);
const ratio=Math.min(470/x.length,310/x.width),cols=Math.min(90,Math.floor(x.length/x.pitch)+1),rows=Math.min(70,Math.floor(x.width/x.pitch)+1),max=3000;let count=0;
for(let row=0;row<rows;row++){for(let col=0;col<cols;col++){if(count>=max)break;const offset=x.pattern.endsWith('v')&&row%2?x.pitch/2:0,left=x.edge+col*x.pitch+offset,top=x.edge+row*x.pitch;if(left+x.size>x.length-x.edge||top+x.size>x.width-x.edge)continue;const node=document.createElementNS(ns,x.pattern.startsWith('r')?'circle':'rect');if(x.pattern.startsWith('r')){node.setAttribute('cx',25+(left+x.size/2)*ratio);node.setAttribute('cy',20+(top+x.size/2)*ratio);node.setAttribute('r',Math.max(.5,x.size*ratio/2));}else{node.setAttribute('x',25+left*ratio);node.setAttribute('y',20+top*ratio);node.setAttribute('width',Math.max(.5,x.size*ratio));node.setAttribute('height',Math.max(.5,x.size*ratio));}node.setAttribute('fill','#54718c');svg.append(node);count++;}if(count>=max)break;}}
fields.forEach(k=>$(k).addEventListener('input',render));
$('copy').addEventListener('click',async()=>{if(!report)return;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(report);}else{const area=document.createElement('textarea');area.value=report;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();if(!document.execCommand('copy'))throw new Error('Copy failed');area.remove();}const btn=$('copy');btn.textContent='Скопировано';setTimeout(()=>btn.textContent='Скопировать расчёт',1600);}catch(e){alert('Не удалось скопировать расчёт. Откройте страницу по HTTPS или localhost.');}});
$('pdf').addEventListener('click',()=>{if(report)window.print();});
render();
})();
