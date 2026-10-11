/* Optional real lead delivery. No fake success; non-empty endpoint must be provided by site owner. */
(() => {
 const config=window.KB_LEAD_CONFIG||{},form=document.querySelector('[data-smart-form]');
 if(!form||!config.endpoint)return;
 let url;
 try{url=new URL(config.endpoint,location.href);if(url.protocol!=='https:'&&!(url.protocol==='http:'&&url.hostname==='localhost'))throw Error('Use HTTPS endpoint')}catch(e){console.error('Lead endpoint is invalid:',e);return;}
 const success=document.querySelector('[data-form-success]'),payload=document.querySelector('[data-form-payload]'),button=form.querySelector('[type="submit"]');
 if(button)button.querySelector('span').textContent='Отправить заявку';
 const status=document.createElement('p');status.className='g27-lead-status';status.setAttribute('role','status');status.style.cssText='font-size:13px;line-height:1.5;color:#d5fa72;margin:14px 0';button?.after(status);
 let inFlight=false;
 form.addEventListener('submit',async ev=>{
   ev.preventDefault();ev.stopImmediatePropagation(); // bypass frontend-only preview handler
   if(inFlight)return;
   const name=form.elements.namedItem('name')?.value.trim()||'';
   const phone=form.elements.namedItem('phone')?.value.replace(/\D/g,'')||'';
   if(name.length<2||phone.length<10){status.textContent='Проверьте имя и номер телефона';return;}
   const s=window.KB_GROWTH?.get()||{},selected=(s.cart||[]).map(x=>({id:x.id,slug:x.slug,title:x.title,scope:x.scope||null,priceStatus:x.priceStatus}));
   const request={name,phone:form.elements.namedItem('phone').value.trim(),car:form.elements.namedItem('car')?.value.trim()||'',carClass:s.car||'',contact:new FormData(form).get('contact'),comment:form.elements.namedItem('message')?.value.trim()||'',condition:s.condition||'',services:selected,additionalDemoPackages:s.calcSelected||[],source:'Рост 2.0.7.3 / Услуги',submittedAt:new Date().toISOString(),pricingDisclaimer:'Предварительная демонстрационная оценка. Точная стоимость согласуется с менеджером'};
   inFlight=true;button.disabled=true;status.textContent='Отправляем заявку...';
   try{
     const response=await fetch(url.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(request),credentials:'same-origin',signal:AbortSignal.timeout(12000)});
     if(!response.ok)throw Error('HTTP '+response.status);
     if(success){success.hidden=false;success.querySelector('strong').textContent='Заявка отправлена менеджеру.';success.querySelector('p').textContent='Сервер подтвердил приём данных.';}
     if(payload)payload.textContent='Сервер подтвердил получение заявки. Выбрано работ: '+selected.length+'.';
     status.textContent='Успешно отправлено';
   }catch(err){status.textContent='Не удалось доставить заявку. Попробуйте позже или свяжитесь с центром напрямую.';console.error('Lead delivery failed:',err);success&&(success.hidden=true)}
   finally{inFlight=false;button.disabled=false;}
 },true);
})();
