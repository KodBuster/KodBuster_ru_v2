/* Direction UX — grouped exact services, immediate autosave, order form, sync with main «ваш выбор». */
(() => {
 const form=document.querySelector('#service-form');
 if(!form||!window.KB_GROWTH||!window.KB_PRICING)return;
 const slug=form.dataset.slug,data=(window.KB_SERVICE_DATA||[]).find(x=>x.slug===slug);if(!data)return;
 const boxes=[...form.querySelectorAll('input[name="service"]')];
 const query=document.querySelector('#g2-service-query'),summary=document.querySelector('[data-summary]'),count=document.querySelector('[data-count]'),msg=document.querySelector('[data-save-message]');
 const aside=document.querySelector('.g2-config-result');
 const orderScrollBtn=document.querySelector('[data-order-scroll]');
 const addSelectionBtn=document.querySelector('[data-add-to-selection]');
 const calcBtn=document.querySelector('[data-open-calculator]');
 const orderForm=document.querySelector('[data-service-order-form]');
 const orderChips=document.querySelector('[data-service-order-chips]');
 const orderSuccess=document.querySelector('[data-service-order-success]');
 const orderPayload=document.querySelector('[data-service-order-payload]');
 const carLabels={compact:'Седан',crossover:'Кроссовер',suv:'Большой внедорожник',premium:'Премиум'};
 const conditionLabels={new:'Новый',normal:'Эксплуатация',worn:'Нужен уход'};
 function mainSelectionUrl(){
   if(window.top&&window.top!==window)return '../../../packages/sistema/#your-selection';
   return '../#your-selection';
 }
 const groupRanges={
  care:[['Бережная мойка',0,4,'Варианты регулярной очистки'],['Глубокая очистка',4,11,'Загрязнения и труднодоступные зоны'],['Финишный уход',11,15,'Защитные и гидрофобные составы']],
  polish:[['Коррекция кузова',0,4,'Выберите один вариант основного комплекса'],['Локальные задачи',4,8,'Отдельные элементы и дефекты'],['Оптика',8,10,'Фары и фонари']],
  coating:[['Покрытия для кузова',0,6,'Выбор защитного состава'],['Дополнительные зоны',6,10,'Стёкла, диски, пластик и хром']],
  ppf:[['Основные пакеты PPF',0,2,'Передняя часть или весь кузов — взаимоисключающие варианты'],['Локальная PPF',2,13,'Отдельные элементы и зоны риска'],['Винил и стайлинг',13,21,'Изменение внешнего вида'],['Защита салона',21,26,'Плёнки для декоративных поверхностей']],
  interior:[['Химчистка и очистка',0,13,'Общий комплекс или отдельные зоны'],['Уход и защитные составы',13,26,'Кожа, текстиль и элементы интерьера'],['Восстановление кожи',26,35,'Ремонт, покраска и реставрация']],
  glass:[['Плёнки и тонировка',0,5,'Нужно уточнить зону и тип материала'],['Уход и восстановление',5,8,'Гидрофоб и очистка']],
  wheels:[['Диски и шины',0,9,'Очистка, восстановление, защита'],['Оптика',9,15,'Фары и фонари'],['Подкапотное пространство',15,24,'Мойка и консервация']],
  restore:[['Локальное восстановление',0,7,'Повреждения, сколы, царапины'],['Подготовка автомобиля',7,15,'Перед оклейкой, после покупки и сезонный уход'],['Специальные автомобили',15,21,'Премиальные и нестандартные задачи']]
 };
 const list=document.querySelector('[data-service-list]');
 const labels=boxes.map(b=>b.closest('label'));
 for(const [name,from,to,desc] of (groupRanges[slug]||[['Выбор работ',0,boxes.length,'']] )){
    const group=document.createElement('details');group.className='g2-work-group';group.dataset.workGroup=name;
    const head=document.createElement('summary');head.className='g2-work-group__head';
    const strong=document.createElement('strong');strong.textContent=name;
    const small=document.createElement('small');small.textContent=desc;
    const tally=document.createElement('span');tally.className='g2-work-group__tally';tally.setAttribute('aria-hidden','true');
    head.append(strong,small,tally);group.append(head);
    const body=document.createElement('div');body.className='g2-work-group__items';
    for(const label of labels.slice(from,to))body.append(label);
    group.append(body);group.open=from===0;
    list.append(group);
 }
 const clear=document.createElement('button');clear.type='button';clear.className='g2-secondary g2-clear-selection';clear.textContent='Очистить выбор направления';
 if(calcBtn)calcBtn.after(clear);
 const prior=KB_GROWTH.get();
 boxes.forEach(b=>b.checked=(prior.byCategory?.[slug]||[]).includes(b.value));
 for(const group of list.querySelectorAll('.g2-work-group')){if(group.querySelector('input:checked'))group.open=true;}
 for(const name of ['car','condition']){const input=form.querySelector(`input[name="${name}"][value="${prior[name]}"]`);if(input)input.checked=true;}
 const chosen=()=>boxes.filter(b=>b.checked).map(b=>b.value);
 let persistBusy=false;
 function persist(){
   if(persistBusy)return;
   persistBusy=true;
   const vals=chosen();
   KB_GROWTH.setCategory(slug,vals,{car:form.elements.car.value,condition:form.elements.condition.value});
   persistBusy=false;
 }
 function phoneDigits(value){
   let digits=String(value||'').replace(/\D/g,'');
   if(digits.startsWith('8'))digits=`7${digits.slice(1)}`;
   if(digits.length===10&&digits.startsWith('9'))digits=`7${digits}`;
   return digits.slice(0,11);
 }
 function formatPhone(value){
   const digits=phoneDigits(value);
   if(!digits)return '';
   const rest=digits.slice(1);
   let out='+7';
   if(rest.length)out+=` (${rest.slice(0,3)}`;
   if(rest.length>=3)out+=')';
   if(rest.length>3)out+=` ${rest.slice(3,6)}`;
   if(rest.length>6)out+=`-${rest.slice(6,8)}`;
   if(rest.length>8)out+=`-${rest.slice(8,10)}`;
   return out;
 }
 function bindPhoneMask(input){
   if(!input)return;
   input.dataset.prev=input.value||'';
   input.addEventListener('focus',()=>{
     if(!input.value.trim()){input.value='+7 (';input.dataset.prev=input.value;const end=input.value.length;input.setSelectionRange(end,end);}
   });
   input.addEventListener('input',()=>{
     const prev=input.dataset.prev||'';
     let digits=input.value.replace(/\D/g,'');
     const prevDigits=prev.replace(/\D/g,'');
     if(input.value.length<prev.length&&digits.length===prevDigits.length&&digits.length)digits=digits.slice(0,-1);
     if(digits.startsWith('8'))digits=`7${digits.slice(1)}`;
     if(digits.length===10&&digits.startsWith('9'))digits=`7${digits}`;
     digits=digits.slice(0,11);
     if(!digits||digits==='7'){input.value='';input.dataset.prev='';return;}
     input.value=formatPhone(digits);input.dataset.prev=input.value;
   });
   input.addEventListener('keydown',event=>{
     if(event.key!=='Backspace'&&event.key!=='Delete')return;
     const start=input.selectionStart??0,end=input.selectionEnd??0;
     if(start!==end)return;
     if(event.key==='Backspace'&&start>0&&/\D/.test(input.value[start-1])){
       event.preventDefault();
       const digits=phoneDigits(input.value).slice(0,-1);
       input.value=digits&&digits!=='7'?formatPhone(digits):'';
       input.dataset.prev=input.value;
       const pos=input.value.length;input.setSelectionRange(pos,pos);
     }
   });
 }
 function selectionChips(values){
   const state=KB_GROWTH.get();
   const chips=[
     ...(carLabels[state.car]?[carLabels[state.car]]:[]),
     ...(conditionLabels[state.condition]?[conditionLabels[state.condition]]:[]),
     ...values
   ];
   return chips.length?chips:['ваш выбор'];
 }
 function renderOrderChips(values){
   if(!orderChips)return;
   orderChips.replaceChildren(...selectionChips(values).map(label=>{
     const b=document.createElement('b');b.textContent=label;return b;
   }));
 }
 function render(){
   const values=chosen(),car=form.elements.car.value;
   const file={compact:'car-sedan.webp',crossover:'car-crossover.webp',suv:'car-suv.webp',premium:'car-sport.webp'};
   const photo=document.querySelector('.g2-car-result img');if(photo){photo.src='../assets/'+file[car];photo.alt='Демонстрационное изображение автомобиля';}
   count.textContent=`Выбрано: ${values.length} ${values.length===1?'услуга':values.length>1&&values.length<5?'услуги':'услуг'}`;
   summary.replaceChildren();
   if(!values.length){const p=document.createElement('p');p.textContent='Отметьте работы. Они сохраняются автоматически и доступны в «ваш выбор» на главной.';summary.append(p)}
   else for(const val of values){const p=document.createElement('p');p.textContent='✓ '+val;summary.append(p)}
   const quote=values.filter(v=>KB_PRICING.classified(slug,v)),requests=values.filter(v=>!KB_PRICING.classified(slug,v));
   const priceNode=document.querySelector('.g2-result-price strong');
   if(priceNode)priceNode.textContent=!values.length?'Выберите работы':requests.length?`${requests.length} ${requests.length===1?'работа по запросу':'работ по запросу'}`:'Демо-ориентир на главной';
   if(calcBtn)calcBtn.textContent=quote.length?'К ориентиру цены →':'Уточнить стоимость в заявке →';
   clear.hidden=!values.length;
   for(const group of list.querySelectorAll('.g2-work-group')){
     const selected=group.querySelectorAll('input:checked').length;
     const tally=group.querySelector('.g2-work-group__tally');if(tally)tally.textContent=selected?`${selected} выбрано`:'';
   }
   renderOrderChips(values);
 }
 form.addEventListener('change',e=>{
   const input=e.target;
   if(input.name==='service'&&input.checked){
     let n=0;
     for(const b of boxes){if(b!==input&&b.checked&&KB_PRICING.conflicting(slug,input.value,b.value)){b.checked=false;n++;}}
     msg.textContent=n?`Предыдущий пересекающийся вариант заменён: ${n}`:'Выбор сохранён автоматически';
   }else msg.textContent='Параметры сохранены';
   persist();render();
 });
 query?.addEventListener('input',()=>{
   const term=query.value.trim().toLocaleLowerCase('ru');let total=0;
   for(const group of list.querySelectorAll('.g2-work-group')){
     let visible=0;
     for(const label of group.querySelectorAll('.g2-check')){
       const show=label.textContent.toLocaleLowerCase('ru').includes(term);label.hidden=!show;if(show)visible++;
     }
     group.hidden=!visible;if(term&&visible)group.open=true;total+=visible;
   }
   document.querySelector('.g2-empty-search').hidden=!!total;
 });
 function goTop(href){
   persist();
   if(window.top&&window.top!==window)window.top.location.href=href;
   else location.href=href;
 }
 orderScrollBtn?.addEventListener('click',()=>{
   persist();
   if(!chosen().length){msg.textContent='Сначала выберите хотя бы одну услугу';return;}
   document.querySelector('#service-order')?.scrollIntoView({behavior:'smooth',block:'start'});
   window.setTimeout(()=>orderForm?.elements?.namedItem('name')?.focus({preventScroll:true}),500);
 });
 addSelectionBtn?.addEventListener('click',()=>{
   if(!chosen().length){msg.textContent='Сначала выберите хотя бы одну услугу';return;}
   goTop(mainSelectionUrl());
 });
 calcBtn?.addEventListener('click',()=>{
    if(!chosen().length){msg.textContent='Выберите хотя бы одну работу';return;}
    goTop(mainSelectionUrl());
 });
 clear.addEventListener('click',()=>{boxes.forEach(b=>b.checked=false);persist();render();msg.textContent='Выбор направления очищен'});

 if(orderForm){
   const phoneInput=orderForm.elements.namedItem('phone');
   bindPhoneMask(phoneInput);
   orderForm.addEventListener('submit',event=>{
     event.preventDefault();
     const name=orderForm.elements.namedItem('name');
     const phone=orderForm.elements.namedItem('phone');
     const nameError=orderForm.querySelector('[data-error-for="name"]');
     const phoneError=orderForm.querySelector('[data-error-for="phone"]');
     nameError.textContent='';phoneError.textContent='';
     let valid=true;
     if(String(name.value||'').trim().length<2){nameError.textContent='Укажите, как к вам обращаться';valid=false;}
     if(phoneDigits(phone.value).length!==11){phoneError.textContent='Укажите телефон в формате +7 (999) 123-45-67';valid=false;}
     if(!chosen().length){msg.textContent='Сначала выберите хотя бы одну услугу';valid=false;}
     if(!valid)return;
     persist();
     const state=KB_GROWTH.get();
     const works=(state.byCategory?.[slug]||[]);
     orderPayload.textContent=
`Обращение: ${name.value.trim()}
Телефон: ${phone.value.trim()}
Автомобиль: ${orderForm.elements.namedItem('car').value.trim()||'не указано'}
Класс: ${carLabels[state.car]||'—'}
Состояние: ${conditionLabels[state.condition]||'—'}
Направление: ${data.title}
Ваш выбор: ${works.join('; ')||'—'}
Комментарий: ${orderForm.elements.namedItem('message').value.trim()||'—'}
Отправка на сервер: НЕ ПОДКЛЮЧЕНА (демо).`;
     orderSuccess.hidden=false;
     orderSuccess.scrollIntoView({behavior:'smooth',block:'nearest'});
   });
 }

 render();
})();
