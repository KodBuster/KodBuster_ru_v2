/* ROST 2.0.4 / canonical demo pricing rules. No production prices are asserted. */
(() => {
 const services = {
    polish:{
      name:'Полировка', short:'Полировка',
      base:[28,42],
      scopes:{
        local:{label:'Локально',sub:'1–2 элемента',factor:.42,time:4,breakdown:['Локальная очистка и подготовка','Коррекция выбранных элементов']},
        base:{label:'1 этап',sub:'Кузов целиком',factor:1,time:8,breakdown:['Деконтаминация кузова','Одноэтапная коррекция ЛКП']},
        full:{label:'Глубокая',sub:'2–3 этапа',factor:1.55,time:14,breakdown:['Многоэтапная коррекция ЛКП','Финишная полировка и контроль']}
      }
    },
    ceramic:{
      name:'Керамическая защита', short:'Керамика',
      base:[38,52],
      scopes:{
        local:{label:'Локально',sub:'Отдельные элементы',factor:.48,time:4,breakdown:['Подготовка выбранных элементов','Керамическое покрытие']},
        base:{label:'Кузов',sub:'Основной комплекс',factor:1,time:7,breakdown:['Подготовка поверхности','Керамическое покрытие кузова']},
        full:{label:'Расширенная',sub:'Кузов + диски + стёкла',factor:1.46,time:10,breakdown:['Керамика кузова','Защита дисков и стёкол']}
      }
    },
    ppf:{
      name:'PPF-защита', short:'PPF',
      base:[68,88],
      scopes:{
        local:{label:'Зоны риска',sub:'Ручки / пороги / оптика',factor:.42,time:5,breakdown:['Подготовка зон риска','PPF на локальные элементы']},
        base:{label:'Передняя часть',sub:'Капот / бампер / крылья',factor:1,time:14,breakdown:['Подготовка ЛКП','PPF передней части']},
        full:{label:'Весь кузов',sub:'Полная PPF-защита',factor:2.65,time:32,breakdown:['Полная подготовка кузова','PPF на весь кузов']}
      }
    },
    interior:{
      name:'Детейлинг салона', short:'Салон',
      base:[22,34],
      scopes:{
        local:{label:'Частично',sub:'Сиденья / отдельные зоны',factor:.52,time:3,breakdown:['Локальная химчистка','Обработка выбранных зон']},
        base:{label:'Полная',sub:'Весь салон',factor:1,time:7,breakdown:['Полная химчистка салона','Кожа / текстиль / пластик']},
        full:{label:'С защитой',sub:'Химчистка + консервация',factor:1.42,time:10,breakdown:['Полная химчистка','Защитные составы интерьера']}
      }
    },
    glass:{
      name:'Стёкла и оптика', short:'Стёкла',
      base:[16,26],
      scopes:{
        local:{label:'Одна зона',sub:'Лобовое / оптика',factor:.55,time:3,breakdown:['Подготовка поверхности','Работа с выбранной зоной']},
        base:{label:'Комплект',sub:'Основные стёкла',factor:1,time:5,breakdown:['Подготовка стёкол','Основной комплекс']},
        full:{label:'Расширенный',sub:'Стёкла + оптика',factor:1.38,time:7,breakdown:['Стёкла и оптика','Финишная защита / гидрофоб']}
      }
    }
  };
 const carMultipliers = { compact:.88, crossover:1, suv:1.18, premium:1.34 };
 // Exact catalogue works only. Ambiguous variants are request-only, never priced as another procedure.
 const priceRules = {
  polish: {'Одношаговая полировка':['polish','base'], 'Многоэтапная полировка':['polish','full']},
  coating: {'Керамическое покрытие кузова':['ceramic','base']},
  ppf: {'Полная оклейка кузова PPF':['ppf','full'], 'Оклейка передней части автомобиля PPF':['ppf','base']},
  interior: {'Полная химчистка салона':['interior','base']}
 };
 const classified=(slug,title)=>{const r=priceRules[slug]?.[title];return r ? {key:r[0],scope:r[1]} : null;};
 const money=(n)=>Math.max(1,Math.round(n));
 const calculate=(selection,car='crossover')=>{
   if(!Array.isArray(selection)||!selection.length)return null;
   const mult=carMultipliers[car]||1;
   const lines=selection.filter(x=>services[x.key]&&services[x.key].scopes[x.scope]).map(x=>({...x,low:services[x.key].base[0]*services[x.key].scopes[x.scope].factor*mult,high:services[x.key].base[1]*services[x.key].scopes[x.scope].factor*mult}));
   if(!lines.length)return null;
   const factor=lines.length>=3?.95:lines.length===2?.975:1;
   const low=lines.reduce((s,x)=>s+x.low,0)*factor,high=lines.reduce((s,x)=>s+x.high,0)*factor;
   return {low,high,range:`${money(low)}–${money(high)} тыс. ₽`,lines};
 };
 const groups={
   polish: ['Одношаговая полировка','Многоэтапная полировка','Восстановительная полировка','Абразивная полировка'],
   ppf: ['Полная оклейка кузова PPF','Оклейка передней части автомобиля PPF','PPF капота','PPF переднего бампера','PPF передних крыльев','PPF зеркал','PPF фар','PPF стоек','PPF порогов','PPF зон дверных ручек','PPF кромок дверей','PPF зоны погрузки багажника','PPF отдельных элементов кузова']
 };
 function conflicting(slug,a,b){
   if(a===b)return false;
   if(slug==='polish')return groups.polish.includes(a)&&groups.polish.includes(b);
   if(slug==='ppf'){
     const full='Полная оклейка кузова PPF',front='Оклейка передней части автомобиля PPF';
     if((a===full&&groups.ppf.includes(b))||(b===full&&groups.ppf.includes(a)))return true;
     const frontItems=['PPF капота','PPF переднего бампера','PPF передних крыльев','PPF зеркал','PPF фар'];
     if((a===front&&frontItems.includes(b))||(b===front&&frontItems.includes(a)))return true;
   }
   return false;
 }
 window.KB_PRICING={services,carMultipliers,classified,calculate,conflicting,priceRules};
})();
