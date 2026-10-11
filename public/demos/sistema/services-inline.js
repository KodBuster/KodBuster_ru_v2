/* KodBuster ROST 2.0.7 — expanded service directions, exact service selections, one basket. */
(() => {
 'use strict';
 const data=window.KB_SERVICE_DATA,core=window.KB_GROWTH,pricing=window.KB_PRICING;
 const root=document.querySelector('[data-g27-service-grid]');
 if(!root||!Array.isArray(data)||!core||!pricing)return;
 const cards=[...root.querySelectorAll('[data-g27-card]')];
 const bySlug=new Map(data.map(item=>[item.slug,item]));
 const q=(node,selector)=>node.querySelector(selector);
 const text=(node,string)=>{if(node)node.textContent=string;};
 const titles=new Map(data.map(item=>[item.slug,item.title]));
 function pricedSelection(items){
   const exact=new Map(),requests=[];
   for(const entry of items){
     const rule=entry.pricingKey&&entry.scope?{key:entry.pricingKey,scope:entry.scope}:pricing.classified(entry.slug,entry.title);
     if(!rule){requests.push(entry);continue}
     if(exact.has(rule.key)){
        // Duplicated billing key must never silently be charged twice.
        requests.push(entry);continue;
     }
     exact.set(rule.key,{key:rule.key,scope:rule.scope});
   }
   return {exact,requests};
 }
 function totalEstimate(items,car,manual=[]){
   const {exact,requests}=pricedSelection(items);
   for(const key of manual){if(!exact.has(key)&&pricing.services[key]){
      const scope=core.get().calcScopes?.[key]||'base';
      exact.set(key,{key,scope});
   }}
   const quote=pricing.calculate([...exact.values()],car);
   return {quote,requests};
 }
 // Scroll *after* the CSS grid has reflowed: opening a full-width card
 // changes its row position (especially when the right-hand card is clicked).
 // The demo toolbar is fixed at the top; the site header is not sticky.
 function scrollToCardStart(card,immediate=false){
   window.requestAnimationFrame(()=>{
     const bar=document.querySelector('.demo-bar');
     const barStyle=bar&&window.getComputedStyle(bar);
     const barVisible=bar&&barStyle.display!=='none'&&barStyle.visibility!=='hidden'&&
       (barStyle.position==='fixed'||barStyle.position==='sticky');
     const offset=(barVisible?bar.getBoundingClientRect().height:0)+16;
     const top=Math.max(0,window.scrollY+card.getBoundingClientRect().top-offset);
     const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
     window.scrollTo({top,behavior:reduceMotion||immediate?'instant':'smooth'});
   });
 }
 function openCard(card,fromFooter=false){
   const isOpen=card.classList.contains('is-open');
   for(const row of cards){
     row.classList.remove('is-open');
     q(row,'[data-g27-panel]').hidden=true;
     q(row,'[data-g27-trigger]').setAttribute('aria-expanded','false');
     text(q(row,'[data-g27-toggle-text]'),'Раскрыть +');
   }
   if(!isOpen){
     card.classList.add('is-open');
     q(card,'[data-g27-panel]').hidden=false;
     q(card,'[data-g27-trigger]').setAttribute('aria-expanded','true');
     text(q(card,'[data-g27-toggle-text]'),'Свернуть −');
   }
   // A footer button disappears when the panel closes: restore keyboard focus
   // to the still-visible header button before repositioning the viewport.
   if(fromFooter)q(card,'[data-g27-trigger]').focus({preventScroll:true});
   if(!isOpen||fromFooter)scrollToCardStart(card,fromFooter);
 }
 for(const card of cards){
   const slug=card.dataset.g27Card;
   q(card,'[data-g27-trigger]')?.addEventListener('click',()=>openCard(card));
   q(card,'[data-g27-collapse]')?.addEventListener('click',()=>openCard(card,true));
   card.addEventListener('change',ev=>{
     const field=ev.target;
     if(!field.matches('[data-g27-work]'))return;
     const state=core.get(),previous=state.byCategory[slug]||[];
     const next=new Set(previous);
     if(field.checked){
       for(const val of previous){if(pricing.conflicting(slug,field.value,val))next.delete(val)}
       next.add(field.value);
     } else next.delete(field.value);
     core.setCategory(slug,[...next]);
     const live=q(card,'[data-g27-card-count]');
     if(live)live.setAttribute('aria-label',`${next.size} выбранных работ`);
   });
   q(card,'[data-g27-search]')?.addEventListener('input',ev=>{
     const search=ev.target.value.toLocaleLowerCase('ru').trim();
     card.querySelectorAll('[data-g27-work]').forEach(input=>{const label=input.closest('.g27-work');label.hidden=!!search&&!input.value.toLocaleLowerCase('ru').includes(search)});
   });
   card.addEventListener('click',ev=>{
     const car=ev.target.closest('[data-g27-car]');
     if(car){
       core.set({car:car.dataset.g27Car});
       return;
     }
     const condition=ev.target.closest('[data-g27-condition]');
     if(condition){core.set({condition:condition.dataset.g27Condition});return;}
   });
 }
 const selection=q(document,'#your-selection');
 const list=q(selection,'[data-g27-selected-list]');
 const plural=n=>(n%10===1&&n%100!==11?'работа':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'работы':'работ');
 function renderCard(card,state){
   const slug=card.dataset.g27Card;
   const chosen=new Set(state.byCategory[slug]||[]);
   for(const input of card.querySelectorAll('[data-g27-work]')){
     input.checked=chosen.has(input.value);
     const mark=input.closest('.g27-work').querySelector('[data-g27-work-price]');
     const rule=pricing.classified(slug,input.value);
     text(mark,rule?'расчёт':'по запросу');
   }
   card.querySelectorAll('[data-g27-car]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.g27Car===state.car)));
   card.querySelectorAll('[data-g27-condition]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.g27Condition===state.condition)));
   text(q(card,'[data-g27-card-count]'),`${chosen.size} ${plural(chosen.size)}`);
   const items=(state.cart||[]).filter(item=>item.slug===slug);
   const {quote,requests}=totalEstimate(items,state.car);
   let label=!chosen.size?'Выберите работы':quote?quote.range:'После осмотра';
   if(quote&&requests.length)label+=` · + ${requests.length} по запросу`;
   text(q(card,'[data-g27-price]'),label);
   const note= !chosen.size ? 'Укажите нужные работы выше.' : quote&&requests.length ? `Частичный демо-ориентир. Ещё ${requests.length} ${plural(requests.length)} без цены, сумму всего заказа уточнит специалист.` : quote ? 'Только демонстрационная цена. Класс автомобиля влияет на диапазон.' : 'Для этих конкретных работ нет достоверного правила расчёта. Не подменяем их ценой другой услуги.';
   text(q(card,'[data-g27-price-detail]'),note);
 }
 const manualSelections=state=>[...new Set((state.calcSelected||[]).filter(k=>pricing.services[k]))];
 function buildEntryRow(item,mode){
   const row=document.createElement('div');row.className='g27-choice-row';
   const label=document.createElement('span');label.textContent=item.title;
   const mark=document.createElement('small');mark.textContent=item.pricingKey?'демо':'по запросу';
   const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.setAttribute('aria-label',`Удалить ${item.title}`);
   if(mode==='exact')remove.dataset.g27Remove=item.id;
   else remove.dataset.g27RemoveManual=item.key;
   row.append(label,mark,remove);return row;
 }
 function renderSelection(state){
   const cart=state.cart||[];
   const priced=pricedSelection(cart);
   const manual=manualSelections(state).filter(key=>!priced.exact.has(key));
   text(q(selection,'[data-g27-total]'),`${cart.length+manual.length} ${plural(cart.length+manual.length)}`);
   list.replaceChildren();
   if(!cart.length&&!manual.length){const p=document.createElement('p');p.className='g27-empty';p.textContent='Пока ничего не выбрано. Раскройте направление выше и отметьте работы.';list.append(p)}
   else{
     for(const cat of data){
       const rows=cart.filter(item=>item.slug===cat.slug);
       if(!rows.length)continue;
       const group=document.createElement('div');group.className='g27-category';
       const title=document.createElement('h3');title.textContent=cat.title;group.append(title);
       for(const entry of rows)group.append(buildEntryRow(entry,'exact'));
       list.append(group);
     }
     if(manual.length){
       const group=document.createElement('div');group.className='g27-category';
       const h=document.createElement('h3');h.textContent='Ранее сохранённые пакеты';group.append(h);
       for(const key of manual)group.append(buildEntryRow({key,title:pricing.services[key].name,pricingKey:key},'manual'));
       list.append(group);
     }
   }
   q(selection,'[data-g27-clear]').hidden=!cart.length&&!manual.length;
   const {quote,requests}=totalEstimate(cart,state.car,manual);
   text(q(selection,'[data-g27-estimate]'),quote?quote.range:cart.length?'По запросу':'Ожидает выбора');
   const note= !cart.length&&!manual.length?'Отметьте услуги в раскрытых карточках.':
       quote&&requests.length?`Частичная демонстрационная стоимость; ещё ${requests.length} ${plural(requests.length)} без цены. Не является суммой всего заказа.`:
       quote?'Стоимость рассчитана по демонстрационным правилам, не является публичной офертой.':
       `Выбрано ${requests.length} работ без подтверждённого правила расчёта. Оценка после осмотра.`;
   text(q(selection,'[data-g27-estimate-note]'),note);
   const chips=document.querySelector('[data-form-context-chips]');
   if(chips){
     const titles=cart.map(item=>item.title);
     chips.replaceChildren(...(titles.length?titles:['ваш выбор']).map(label=>{
       const b=document.createElement('b');b.textContent=label;return b;
     }));
   }
   const sticky=document.querySelector('#g2-sticky');
   if(sticky){
     sticky.hidden=!cart.length || sticky.dataset.dismissed==='true';
     if(cart.length){sticky.querySelector('[data-g2-brief]').textContent=`Сохранено работ: ${cart.length}`;
       const a=sticky.querySelector('a');if(a){a.href='#your-selection';a.textContent='Ваш выбор →';}}
   }
 }
 function render(){
   const state=core.get();cards.forEach(card=>renderCard(card,state));renderSelection(state);
   }
 document.querySelector('#g2-sticky [data-g2-dismiss]')?.addEventListener('click',e=>{
   const sticky=e.target.closest('#g2-sticky');if(sticky){sticky.dataset.dismissed='true';sticky.hidden=true;}
 });
 selection.addEventListener('click',ev=>{
   const remove=ev.target.closest('[data-g27-remove]');
   if(remove){
     const state=core.get(),entry=state.cart.find(item=>item.id===remove.dataset.g27Remove);
     if(entry)core.setCategory(entry.slug,(state.byCategory[entry.slug]||[]).filter(x=>x!==entry.title));
     return;
   }
   const rmManual=ev.target.closest('[data-g27-remove-manual]');
   if(rmManual){
     const key=rmManual.dataset.g27RemoveManual;
     const button=document.querySelector(`[data-calc-service="${key}"]`);
     if(button?.classList.contains('is-selected'))button.click();
     else core.set({calcSelected:manualSelections(core.get()).filter(x=>x!==key)});
     return;
   }
   if(ev.target.closest('[data-g27-clear]')){
     // Preserve car class, reset all selections including manual; clear corresponding calculator buttons.
     for(const button of document.querySelectorAll('[data-calc-service].is-selected'))button.click();
     core.clear();
   }
 });
 window.addEventListener('kb:brief-change',render);
 render();
})();
