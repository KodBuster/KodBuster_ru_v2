/* ROST 2.0.4: one canonical customer brief shared by 9 pages; demo data local only. */
(() => {
  const key='kb_growth_v2_brief';
  const defaults={car:'crossover',condition:'normal',goal:'',zone:'',matchTouched:false,recommendation:null,selected:[],byCategory:{},cart:[],calcSelected:[],calcScopes:{},category:''};
  const copy=x=>JSON.parse(JSON.stringify(x));let fallback=copy(defaults);
  // Stable identity of a work, independent of its position in the catalogue.
  // Legacy persisted carts are migrated automatically: byCategory titles remain source of truth.
  function stableId(slug,title){
    let h=2166136261;
    for(const char of title){h^=char.codePointAt(0);h=Math.imul(h,16777619)}
    return slug+':'+(h>>>0).toString(36);
  }
  function normalize(s){
    const byCategory={};
    for(const [slug,works] of Object.entries(s.byCategory||{}))if(Array.isArray(works)&&works.length)byCategory[slug]=[...new Set(works.filter(x=>typeof x==='string'))];
    const cart=[];
    for(const [slug,works] of Object.entries(byCategory)){
      for(const title of works){const exact=window.KB_PRICING?.classified(slug,title)||null;
        cart.push({id:stableId(slug,title),slug,title,pricingKey:exact?.key||'',scope:exact?.scope||'',priceStatus:exact?'demo':'request'});
      }
    }
    return {...defaults,...s,byCategory,cart,selected:[...new Set(cart.map(x=>x.title))],calcSelected:Array.isArray(s.calcSelected)?[...new Set(s.calcSelected)]:[],calcScopes:s.calcScopes&&typeof s.calcScopes==='object'?s.calcScopes:{}};
  }
  function get(){try{const s=JSON.parse(localStorage.getItem(key));if(s&&typeof s==='object'&&!Array.isArray(s))return normalize(s)}catch(_){}return normalize(fallback)}
  function set(patch){const next=normalize({...get(),...patch,updatedAt:new Date().toISOString()});fallback=copy(next);try{localStorage.setItem(key,JSON.stringify(next))}catch(_){}window.dispatchEvent(new CustomEvent('kb:brief-change',{detail:next}));return next}
  function setCategory(slug,works,patch={}){const s=get(),byCategory={...s.byCategory};const vals=[...new Set(works)].filter(Boolean);if(vals.length)byCategory[slug]=vals;else delete byCategory[slug];return set({...patch,byCategory,category:vals.length?slug:(Object.keys(byCategory)[0]||'')})}
  function clear(){return set({...copy(defaults),car:get().car})}
  window.KB_GROWTH={get,set,setCategory,clear,add:(works,patch={})=>set({...patch,selected:[...new Set([...get().selected,...works])]} )};
})();