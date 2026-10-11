/* KODBUSTER NEXT visual-layer. The existing selection/pricing engine remains authoritative. */
(() => {
  const form=document.querySelector('#service-form');if(!form)return;
  document.querySelectorAll('[data-add-service]').forEach(button=>button.addEventListener('click',()=>{
    const value=button.dataset.addService;
    const checkbox=[...form.querySelectorAll('input[name="service"]')].find(el=>el.value===value);
    if(!checkbox){button.textContent='Позиция отсутствует в каталоге';return;}
    const group=checkbox.closest('.g2-work-group');if(group)group.open=true;
    if(!checkbox.checked){checkbox.checked=true;checkbox.dispatchEvent(new Event('change',{bubbles:true}));}
    document.querySelectorAll('.rv-route__button').forEach(b=>{const selected=[...form.querySelectorAll('input[name="service"]')].find(el=>el.value===b.dataset.addService)?.checked;b.classList.toggle('is-selected',!!selected);b.innerHTML=(selected?'Добавлено в подбор':'Добавить в подбор')+' <span>→</span>';});
    checkbox.closest('label')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});
    checkbox.focus({preventScroll:true});
  }));
  form.addEventListener('change',()=>{
    document.querySelectorAll('.rv-route__button').forEach(b=>{const selected=[...form.querySelectorAll('input[name="service"]')].find(el=>el.value===b.dataset.addService)?.checked;b.classList.toggle('is-selected',!!selected);b.innerHTML=(selected?'Добавлено в подбор':'Добавить в подбор')+' <span>→</span>';});
  });
  form.dispatchEvent(new Event('change',{bubbles:true}));
  const dialog=document.querySelector('.rv-lightbox');
  if(dialog && typeof dialog.showModal==='function'){
    document.querySelectorAll('.rv-gallery-card').forEach(btn=>btn.addEventListener('click',()=>{
      dialog.querySelector('img').src=btn.dataset.preview;
      dialog.querySelector('img').alt=btn.dataset.caption;
      dialog.querySelector('p').textContent=btn.dataset.caption+' · Демонстрационная фотография';
      dialog.showModal();
    }));
    dialog.addEventListener('click',ev=>{if(ev.target===dialog)dialog.close();});
  }
})();
