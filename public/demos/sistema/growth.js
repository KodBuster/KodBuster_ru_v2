const __kbReduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const __kbScrollBehavior = __kbReduceMotion ? 'auto' : 'smooth';

// Hero 2.0.3: editorial first screen; the only interactive choices now live
// in Smart Service Match and the eight dedicated direction pages.
(() => {
  const root = document.querySelector('[data-growth-hero]');
  if (!root) return;
  const toggle = root.querySelector('.menu-toggle');
  const nav = root.querySelector('.main-nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
  }
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100 && toggle?.getAttribute('aria-expanded') === 'true') setMenu(false);
  }, { passive:true });
})();


// KodBuster tariff-difference explainer.
(() => {
  const block = document.querySelector('[data-tier-proof]');
  const toggle = block?.querySelector('[data-tier-proof-toggle]');
  if (!block || !toggle) return;

  toggle.addEventListener('click', () => {
    const open = block.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
})();


// v0.3 Smart Service Match.
(() => {
  const root = document.querySelector('[data-smart-match]');
  if (!root) return;

  const stageOrder = ['goal', 'zone', 'condition'];
  let step = 0;
  const savedMatch=window.KB_GROWTH?.get()||{};
  const state = { goal:savedMatch.goal||'protect', zone:savedMatch.zone||'front', condition:savedMatch.condition||'normal' };
  let finished=Boolean(savedMatch.matchTouched);

  const labels = {
    goal: { protect:'PROTECT', restore:'RESTORE', interior:'САЛОН', style:'STYLE' },
    zone: { front:'FRONT', body:'BODY', interior:'САЛОН', glass:'СТЁКЛА' },
    condition: { new:'NEW', normal:'NORMAL', worn:'RESTORE' }
  };

  const profiles = {
    protect: {
      front: {
        new: ['PPF передней части + керамика','Максимально сохранить новый кузов без полной оклейки.','85–110 тыс. ₽','1–2 дня',['PPF передней части','Керамика кузова','Антидождь'],'Для нового автомобиля приоритет — сразу закрыть зоны риска и упростить дальнейший уход.'],
        normal: ['PPF передней части + подготовка ЛКП','Защитить наиболее уязвимые зоны и подготовить лак перед оклейкой.','65–85 тыс. ₽','1–2 дня',['PPF передней части','Очистка кузова','Подготовка ЛКП'],'Для автомобиля в обычной эксплуатации защита передней части закрывает главные зоны риска без полной оклейки кузова.'],
        worn: ['Коррекция ЛКП + PPF передней части','Сначала восстановить поверхность, затем защитить зоны риска.','80–105 тыс. ₽','2 дня',['Коррекция ЛКП','PPF передней части','Финишная защита'],'Плёнку лучше наносить после восстановления заметных дефектов — так результат выглядит чище и держится дольше.']
      },
      body: {
        new: ['Полная PPF-защита кузова','Максимальная защита нового автомобиля от сколов и пескоструя.','180–260 тыс. ₽','3–5 дней',['Полная PPF','Защита оптики','Керамика плёнки'],'Новый кузов — лучший момент для полной защиты: меньше подготовки и максимум сохранённого заводского ЛКП.'],
        normal: ['Полная PPF + подготовка кузова','Комплексная защита после глубокой очистки и подготовки.','195–275 тыс. ₽','4–5 дней',['Подготовка ЛКП','Полная PPF','Керамика плёнки'],'Для машины с пробегом сначала устраняются загрязнения и лёгкие дефекты, затем кузов закрывается плёнкой.'],
        worn: ['Коррекция кузова + полная защита','Восстановить визуальное состояние и затем закрыть кузов.','220–310 тыс. ₽','5–6 дней',['Коррекция ЛКП','Полная PPF','Оптика и зоны риска'],'При выраженных дефектах сначала нужен этап восстановления — иначе плёнка сохранит и подчеркнёт повреждения.']
      },
      interior: {
        new: ['Защита салона нового авто','Защитить кожу, текстиль и декоративные поверхности.','22–35 тыс. ₽','1 день',['Защита кожи','Защита текстиля','Пластик и декор'],'Новый салон проще сохранить, чем затем восстанавливать: защитные составы снижают износ и впитывание загрязнений.'],
        normal: ['Детейлинг салона + защита','Глубокая очистка и защитные составы для основных поверхностей.','25–40 тыс. ₽','1 день',['Очистка кожи','Текстиль','Защита салона'],'Для обычной эксплуатации оптимален комплекс очистки с последующей защитой наиболее нагруженных зон.'],
        worn: ['Глубокая химчистка + восстановление','Очистить салон и локально восстановить изношенные элементы.','35–55 тыс. ₽','1–2 дня',['Химчистка','Восстановление кожи','Защита'],'Если есть выраженный износ, одной химчистки мало — добавляется локальное восстановление и консервация.']
      },
      glass: {
        new: ['Защита стёкол + антидождь','Сохранить прозрачность и упростить уход за стеклом.','18–30 тыс. ₽','1 день',['Защитная плёнка','Антидождь','Оптика'],'Для нового автомобиля можно сразу закрыть наиболее уязвимые стеклянные поверхности.'],
        normal: ['Полировка стекла + гидрофоб','Убрать эксплуатационный налёт и улучшить водоотталкивание.','12–22 тыс. ₽','1 день',['Полировка стекла','Антидождь','Очистка'],'Если стекло уже эксплуатировалось, сначала нужна очистка/полировка, затем защитный состав.'],
        worn: ['Восстановление стекла и оптики','Устранить помутнения и вернуть прозрачность перед защитой.','18–32 тыс. ₽','1 день',['Полировка','Восстановление оптики','Защита'],'При заметных дефектах сначала возвращаем прозрачность, затем наносим защиту.']
      }
    }
  };

  const generic = {
    restore: {
      title:'Коррекция лака + защитное покрытие', lead:'Вернуть глубину цвета, убрать мелкие дефекты и закрепить результат защитным составом.', price:'45–75 тыс. ₽', time:'1–2 дня', services:['Коррекция ЛКП','Полировка','Керамика'], reason:'Для задачи восстановления сайт предлагает сначала улучшить состояние поверхности, а уже затем выбирать защиту.'
    },
    interior: {
      title:'Глубокий детейлинг салона', lead:'Очистить поверхности, убрать загрязнения и защитить кожу, текстиль и пластик.', price:'21–45 тыс. ₽', time:'1 день', services:['Химчистка','Кожа','Защита интерьера'], reason:'При выборе салона приоритет смещается с кузовных работ на глубокую очистку и защиту интерьерных материалов.'
    },
    style: {
      title:'Стайлинг кузова и стёкол', lead:'Изменить визуальный характер автомобиля с помощью плёнки, тонировки и отдельных акцентов.', price:'от 55 тыс. ₽', time:'1–3 дня', services:['Винил / PPF','Тонировка','Визуальные акценты'], reason:'Сценарий стайлинга подбирает не восстановление, а инструменты изменения внешнего вида.'
    }
  };

  const stages = [...root.querySelectorAll('[data-stage]')];
  const options = [...root.querySelectorAll('[data-choice]')];
  const next = root.querySelector('[data-match-next]');
  const back = root.querySelector('[data-match-back]');
  const stepLabel = root.querySelector('[data-match-step-label]');
  const progress = root.querySelector('[data-match-progress]');
  const zones = [...root.querySelectorAll('[data-zone-visual]')];
  const scan = root.querySelector('[data-match-scan]');

  const output = {
    code: root.querySelector('[data-result-code]'),
    title: root.querySelector('[data-result-title]'),
    lead: root.querySelector('[data-result-lead]'),
    price: root.querySelector('[data-result-price]'),
    time: root.querySelector('[data-result-time]'),
    services: root.querySelector('[data-result-services]'),
    reason: root.querySelector('[data-result-reason]'),
    goal: root.querySelector('[data-telemetry-goal]'),
    zone: root.querySelector('[data-telemetry-zone]'),
    condition: root.querySelector('[data-telemetry-condition]')
  };

  function getResult() {
    return window.KB_MATCH.get(state,window.KB_GROWTH?.get()?.car||'crossover');
  }

  function renderResult() {
    const r = getResult();
    root.querySelector('[data-match-result]')?.classList.toggle('is-ready',finished);
    root.querySelector('.match-result__status span').textContent = finished ? '✓ ПОДБОР ЗАВЕРШЁН' : '● ПОДБОР В ПРОЦЕССЕ';
    const action=root.querySelector('.match-result__cta');
    action.disabled=!finished;
    action.setAttribute('aria-disabled',String(!finished));
    action.textContent = !finished ? 'Сначала завершите подбор →' : (r.estimate ? 'Добавить услугу в расчёт →' : 'Запросить оценку →');
    output.title.textContent = finished ? r.title : 'Ответьте на 3 вопроса';
    output.lead.textContent = finished ? r.lead : 'Рекомендация появится после выбора задачи, зоны и состояния автомобиля.';
    output.price.textContent = finished ? r.price : '—';
    output.time.textContent = finished ? r.time : '—';
    output.reason.textContent = finished ? r.reason : 'Рекомендации и цены не показываются до завершения подбора.';
    output.services.replaceChildren(...(finished ? r.services : []).map(s => {
      const span = document.createElement('span'); span.textContent = s; return span;
    }));
    output.code.textContent = `R-${(state.goal.charCodeAt(0) + state.zone.charCodeAt(0) + state.condition.charCodeAt(0)) % 90 + 10}`;
    output.goal.textContent = labels.goal[state.goal];
    output.zone.textContent = labels.zone[state.zone];
    output.condition.textContent = labels.condition[state.condition];

    zones.forEach(z => z.classList.toggle('is-active', z.dataset.zoneVisual === state.zone));
    const scanMap = { front:'69%', body:'48%', interior:'56%', glass:'60%' };
    scan.style.left = scanMap[state.zone] || '50%';

    const result = root.querySelector('[data-match-result]');
    result.classList.remove('pulse');
    void result.offsetWidth;
    result.classList.add('pulse');
  }

  function setStep(newStep) {
    step = Math.max(0, Math.min(stageOrder.length - 1, newStep));
    stages.forEach(s => s.classList.toggle('is-active', s.dataset.stage === stageOrder[step]));
    stepLabel.textContent = `0${step + 1} / 03`;
    progress.style.width = `${((step + 1) / 3) * 100}%`;
    back.disabled = step === 0;
    next.innerHTML = step === 2 ? 'Показать рекомендацию <span>→</span>' : 'Дальше <span>→</span>';
  }

  options.forEach(btn => btn.addEventListener('click', () => {
    const type = btn.dataset.choice;
    state[type] = btn.dataset.value;
    finished=false;
    window.__kbMatchTouched=false;
    window.KB_GROWTH?.set({...state,matchTouched:false,recommendation:null});
    root.querySelectorAll(`[data-choice="${type}"]`).forEach(el => el.classList.toggle('is-selected', el === btn));
    renderResult();
  }));

  next.addEventListener('click', () => {
    if (step < 2) setStep(step + 1);
    else {
      finished=true;
      window.__kbMatchTouched=true;
      window.KB_GROWTH?.set({...state,matchTouched:true,recommendation:getResult().estimate||null});
      renderResult();
      root.querySelector('[data-match-result]')?.scrollIntoView({behavior:__kbScrollBehavior, block:'center'});
    }
  });
  back.addEventListener('click', () => setStep(step - 1));

  const upgrade = root.querySelector('[data-block-upgrade]');
  const upgradeToggle = root.querySelector('[data-block-upgrade-toggle]');
  upgradeToggle?.addEventListener('click', () => {
    const open = upgrade.classList.toggle('is-open');
    upgradeToggle.setAttribute('aria-expanded', String(open));
  });

  options.forEach(btn=>btn.classList.toggle('is-selected',state[btn.dataset.choice]===btn.dataset.value));
  setStep(0);
  renderResult();
})();


// v0.4 Service Matrix — filter + inspector + tariff explainer.
(() => {
  const root = document.querySelector('[data-service-matrix]');
  if (!root) return;

  const data = {
    wash:{index:'01',tag:'CARE',title:'Мойка и уход',lead:'Безопасная очистка кузова и сложных зон с правильной химией и сушкой.',price:'4 500–12 000 ₽',time:'2–4 часа',image:'assets/detail-headlight.webp',items:['Детейлинг-мойка','Диски','Воск / гидрофоб','Подкапотное пространство'],caseTitle:'BMW X5 G05',caseCopy:'Комплексный уход и подготовка кузова перед защитой.',caseImage:'assets/case-bmw-x5.webp'},
    polish:{index:'02',tag:'ПОЛИРОВКА',title:'Полировка',lead:'Коррекция лака, удаление голограмм и восстановление глубины цвета.',price:'25 000–55 000 ₽',time:'1 день',image:'assets/service-polish.webp',items:['Одношаговая','Многоэтапная','Антиголограммная','Фары и фонари'],caseTitle:'BMW X5 G05',caseCopy:'Коррекция лака и подготовка под защитное покрытие.',caseImage:'assets/case-bmw-x5.webp'},
    ceramic:{index:'03',tag:'ПОКРЫТИЕ',title:'Керамика и защита',lead:'Защитные покрытия для блеска, гидрофоба и более простого регулярного ухода.',price:'35 000–65 000 ₽',time:'1–2 дня',image:'assets/service-ceramic.webp',items:['Керамика','Кварц','Антидождь','Защита дисков'],caseTitle:'BMW X5 G05',caseCopy:'Коррекция лака + керамическое покрытие кузова.',caseImage:'assets/case-bmw-x5.webp'},
    ppf:{index:'04',tag:'PPF',title:'PPF и оклейка',lead:'Полиуретановая защита зон риска, полная оклейка и изменение внешнего вида.',price:'65 000–260 000 ₽',time:'1–5 дней',image:'assets/service-protection.webp',items:['Передняя часть','Полная PPF','Зоны риска','Винил / цвет'],caseTitle:'Audi Q8',caseCopy:'Защита передней части полиуретановой плёнкой.',caseImage:'assets/case-audi-q8.webp'},
    interior:{index:'05',tag:'САЛОН',title:'Химчистка и салон',lead:'Глубокая очистка кожи, текстиля, пластика и декоративных элементов.',price:'21 000–45 000 ₽',time:'1 день',image:'assets/service-interior.webp',items:['Химчистка','Кожа','Озонация','Защита текстиля'],caseTitle:'Porsche Macan',caseCopy:'Глубокая химчистка салона + защита кожи.',caseImage:'assets/case-porsche-macan.webp'},
    glass:{index:'06',tag:'СТЁКЛА',title:'Тонировка и стёкла',lead:'Тонировка, атермальные решения и дополнительная защита стеклянных поверхностей.',price:'12 000–35 000 ₽',time:'3–6 часов',image:'assets/showcase-sedan.webp',items:['Тонировка','Атермальная плёнка','Антидождь','Защитная плёнка'],caseTitle:'Audi Q8',caseCopy:'Комплексная защита внешних поверхностей и стекла.',caseImage:'assets/case-audi-q8.webp'}
  };

  const cards=[...root.querySelectorAll('[data-service-card]')];
  const filters=[...root.querySelectorAll('[data-service-filter]')];
  const count=root.querySelector('[data-filter-count]');
  const inspector={index:root.querySelector('[data-inspector-index]'),image:root.querySelector('[data-inspector-image]'),tag:root.querySelector('[data-inspector-tag]'),title:root.querySelector('[data-inspector-title]'),lead:root.querySelector('[data-inspector-lead]'),price:root.querySelector('[data-inspector-price]'),time:root.querySelector('[data-inspector-time]'),list:root.querySelector('[data-inspector-list]'),caseTitle:root.querySelector('[data-case-title]'),caseCopy:root.querySelector('[data-case-copy]'),caseImage:root.querySelector('[data-case-image]')};

  function select(card){
    const key=card.dataset.service; const d=data[key]; if(!d) return;
    cards.forEach(c=>c.classList.toggle('is-selected',c===card));
    inspector.index.textContent=d.index; inspector.image.src=d.image; inspector.tag.textContent=d.tag; inspector.title.textContent=d.title; inspector.lead.textContent=d.lead; inspector.price.textContent=d.price; inspector.time.textContent=d.time; inspector.caseTitle.textContent=d.caseTitle; inspector.caseCopy.textContent=d.caseCopy; inspector.caseImage.src=d.caseImage;
    inspector.list.replaceChildren(...d.items.map(item=>{const s=document.createElement('span');s.textContent=item;return s;}));
  }
  cards.forEach(card=>{card.addEventListener('click',e=>{if(e.target.closest('button')||e.currentTarget===card) select(card)});card.querySelector('.matrix-card__select')?.addEventListener('click',e=>{e.stopPropagation();select(card);});});

  filters.forEach(btn=>btn.addEventListener('click',()=>{
    const filter=btn.dataset.serviceFilter; filters.forEach(b=>b.classList.toggle('is-active',b===btn));
    let visible=0; cards.forEach(card=>{const show=filter==='all'||card.dataset.category===filter;card.hidden=!show;if(show)visible++;});
    count.textContent=`${visible} ${visible===1?'направление':visible<5?'направления':'направлений'}`;
    const selected=cards.find(c=>c.classList.contains('is-selected')&&!c.hidden)||cards.find(c=>!c.hidden); if(selected) select(selected);
  }));

  const upgrade=root.querySelector('[data-matrix-upgrade]'); const toggle=root.querySelector('[data-matrix-upgrade-toggle]');
  toggle?.addEventListener('click',()=>{const open=upgrade.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));});
})();

// v0.5 CASE LAB — filters, expanded case details and navigation.
(() => {
  const root = document.querySelector('[data-case-lab]');
  if (!root) return;

  const data = {
    bmw: {
      code:'ПРИМЕР 01', tag:'ПОЛИРОВКА / КЕРАМИКА', title:'BMW X5 G05', service:'Коррекция лака + керамическое покрытие кузова',
      price:'49 000 ₽', time:'2 дня', workcount:'3 этапа', format:'КУЗОВ', image:'assets/case-bmw-x5.webp',
      badge:'ГЛУБОКИЙ ГЛЯНЕЦ + ЗАЩИТА',
      task:'Вернуть глубину чёрному лаку, убрать мелкие риски и защитить кузов после полировки.',
      work:'Двухэтапная коррекция ЛКП, обезжиривание, подготовка поверхности и керамика в два слоя.',
      result:'Чистый глубокий блеск без голограмм, гидрофоб и более простой регулярный уход.'
    },
    audi: {
      code:'ПРИМЕР 02', tag:'PPF / ПЕРЕДНЯЯ ЧАСТЬ', title:'Audi Q8', service:'Защита передней части полиуретановой плёнкой',
      price:'76 000 ₽', time:'1 день', workcount:'4 зоны', format:'ЗАЩИТА', image:'assets/case-audi-q8.webp',
      badge:'ЗОНЫ РИСКА ЗАКРЫТЫ PPF',
      task:'Защитить переднюю часть автомобиля от сколов и пескоструя без полной оклейки кузова.',
      work:'Подготовили ЛКП и закрыли капот, бампер, передние крылья и зеркала прозрачной PPF-плёнкой.',
      result:'Защищены самые нагруженные зоны, при этом плёнка почти не читается на кузове.'
    },
    porsche: {
      code:'ПРИМЕР 03', tag:'САЛОН', title:'Porsche Macan', service:'Глубокая химчистка салона + защита кожи',
      price:'21 000 ₽', time:'1 день', workcount:'6 зон', format:'САЛОН', image:'assets/case-porsche-macan.webp',
      badge:'ЧИСТЫЙ САЛОН + ЗАЩИТА КОЖИ',
      task:'Освежить салон после эксплуатации, убрать загрязнения и вернуть аккуратный вид кожаным поверхностям.',
      work:'Химчистка сидений, пола и карт дверей, глубокая очистка кожи и нанесение защитного состава.',
      result:'Салон визуально свежее, кожа очищена и защищена от быстрого повторного загрязнения.'
    },
    'bmw-polish': {
      code:'ПРИМЕР 04', tag:'ПОЛИРОВКА', title:'BMW 5 Series', service:'Восстановительная полировка кузова',
      price:'34 000 ₽', time:'1 день', workcount:'2 этапа', format:'КУЗОВ', image:'assets/service-polish.webp',
      badge:'МЕНЬШЕ РИСОК + РОВНЫЙ БЛЕСК',
      task:'Убрать голограммы и следы моек, вернуть лаку ровный блеск перед дальнейшим уходом.',
      work:'Очистка кузова, локальная оценка ЛКП, восстановительная и антиголограммная полировка.',
      result:'Лак выглядит чище и глубже, отражения ровнее, большинство мелких дефектов визуально снято.'
    },
    ceramic: {
      code:'ПРИМЕР 05', tag:'ПОКРЫТИЕ', title:'Mercedes GLE', service:'Керамическая защита кузова',
      price:'42 000 ₽', time:'1 день', workcount:'2 слоя', format:'ЗАЩИТА', image:'assets/service-ceramic.webp',
      badge:'БЛЕСК + ГИДРОФОБ',
      task:'Добавить глубину блеска и упростить регулярный уход без оклейки автомобиля плёнкой.',
      work:'Подготовили поверхность, провели финишную очистку и нанесли керамический состав в два слоя.',
      result:'Кузов получил более выраженный блеск, гидрофоб и дополнительную защиту от повседневных загрязнений.'
    },
    glass: {
      code:'ПРИМЕР 06', tag:'СТЁКЛА', title:'BMW M5', service:'Атермальная плёнка + антидождь',
      price:'28 000 ₽', time:'6 часов', workcount:'2 решения', format:'СТЁКЛА', image:'assets/showcase-sedan.webp',
      badge:'КОМФОРТ + ЗАЩИТА СТЁКОЛ',
      task:'Снизить нагрев салона и улучшить поведение стекла в дождь без заметного изменения внешнего вида.',
      work:'Установили атермальную плёнку и нанесли гидрофобный состав на основные стеклянные поверхности.',
      result:'Салон меньше нагревается на солнце, вода быстрее уходит со стекла, внешний вид остаётся сдержанным.'
    }
  };

  const cards = [...root.querySelectorAll('[data-case-card]')];
  const filters = [...root.querySelectorAll('[data-case-filter]')];
  const count = root.querySelector('[data-case-count]');
  const prev = root.querySelector('[data-case-prev]');
  const next = root.querySelector('[data-case-next]');
  const upgrade = root.querySelector('[data-case-upgrade]');
  const upgradeToggle = root.querySelector('[data-case-upgrade-toggle]');

  const out = {
    image: root.querySelector('[data-case-main-image]'),
    tag: root.querySelector('[data-case-main-tag]'),
    code: root.querySelector('[data-case-main-code]'),
    badge: root.querySelector('[data-case-main-result-badge]'),
    title: root.querySelector('[data-case-main-title]'),
    service: root.querySelector('[data-case-main-service]'),
    price: root.querySelector('[data-case-main-price]'),
    task: root.querySelector('[data-case-main-task]'),
    work: root.querySelector('[data-case-main-work]'),
    result: root.querySelector('[data-case-main-result]'),
    time: root.querySelector('[data-case-main-time]'),
    workcount: root.querySelector('[data-case-main-workcount]'),
    format: root.querySelector('[data-case-main-format]')
  };

  let activeId = 'bmw';
  let filter = 'all';

  const visibleCards = () => cards.filter(card => !card.hidden);

  function render(id) {
    const item = data[id];
    if (!item) return;
    activeId = id;
    cards.forEach(card => card.classList.toggle('is-selected', card.dataset.caseId === id));
    out.image.style.opacity = '.35';
    window.setTimeout(() => {
      out.image.src = item.image;
      out.image.alt = `${item.title} — ${item.service}`;
      out.image.style.opacity = '1';
    }, 120);
    out.tag.textContent = item.tag;
    out.code.textContent = item.code;
    out.badge.textContent = item.badge;
    out.title.textContent = item.title;
    out.service.textContent = item.service;
    out.price.textContent = item.price;
    out.task.textContent = item.task;
    out.work.textContent = item.work;
    out.result.textContent = item.result;
    out.time.textContent = item.time;
    out.workcount.textContent = item.workcount;
    out.format.textContent = item.format;
  }

  function applyFilter(value) {
    filter = value;
    filters.forEach(btn => btn.classList.toggle('is-active', btn.dataset.caseFilter === value));
    cards.forEach(card => {
      card.hidden = value !== 'all' && card.dataset.category !== value;
    });
    const visible = visibleCards();
    count.textContent = `${visible.length} ${visible.length === 1 ? 'кейс' : visible.length < 5 ? 'кейса' : 'кейсов'}`;
    if (!visible.some(card => card.dataset.caseId === activeId) && visible[0]) render(visible[0].dataset.caseId);
  }

  cards.forEach(card => {
    const select = () => render(card.dataset.caseId);
    card.addEventListener('click', select);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select();
      }
    });
  });

  filters.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.caseFilter)));

  function stepCase(delta) {
    const visible = visibleCards();
    if (!visible.length) return;
    const index = Math.max(0, visible.findIndex(card => card.dataset.caseId === activeId));
    const target = visible[(index + delta + visible.length) % visible.length];
    render(target.dataset.caseId);
  }
  prev?.addEventListener('click', () => stepCase(-1));
  next?.addEventListener('click', () => stepCase(1));

  upgradeToggle?.addEventListener('click', () => {
    const open = upgrade.classList.toggle('is-open');
    upgradeToggle.setAttribute('aria-expanded', String(open));
  });

  render(activeId);
  applyFilter(filter);
})();

// v0.7 Multi-service calculator.
(() => {
  const root = document.querySelector('[data-mini-calc]');
  if (!root) return;

  const carMultipliers = window.KB_PRICING.carMultipliers;
  const carNames = { compact:'компакт / седан', crossover:'кроссовер', suv:'большой SUV', premium:'premium / special' };

  const services = window.KB_PRICING.services;

  const state = {
    car:'crossover',
    selected:new Set(),
    scopes:{ ceramic:'base', ppf:'base', polish:'base', interior:'base', glass:'base' }
  };

  const result = root.querySelector('.calc-result');
  const scopesRoot = root.querySelector('[data-calc-service-scopes]');
  const countTop = root.querySelector('[data-calc-selected-count]');
  const suggestion = root.querySelector('[data-calc-suggestion]');
  const suggestionText = root.querySelector('[data-calc-suggestion-text]');
  const suggestionAction = root.querySelector('[data-calc-suggestion-action]');

  const out = {
    price:root.querySelector('[data-calc-price]'),
    title:root.querySelector('[data-calc-title]'),
    time:root.querySelector('[data-calc-time]'),
    volume:root.querySelector('[data-calc-volume]'),
    percent:root.querySelector('[data-calc-percent]'),
    code:root.querySelector('[data-calc-code]'),
    breakdown:root.querySelector('[data-calc-breakdown]'),
    ring:root.querySelector('.calc-result__ring'),
    lines:root.querySelector('[data-calc-lines]'),
    packageTitle:root.querySelector('[data-calc-package-title]'),
    resultCount:root.querySelector('[data-calc-result-count]')
  };

  const money = n => Math.max(1, Math.round(n));
  const formatRange = (low,high) => `${money(low)}–${money(high)} тыс. ₽`;

  function getLine(serviceKey){
    const service = services[serviceKey];
    const scopeKey = state.scopes[serviceKey] || 'base';
    const scope = service.scopes[scopeKey];
    const car = carMultipliers[state.car];
    return {
      key:serviceKey,
      service, scopeKey, scope,
      low:service.base[0] * scope.factor * car,
      high:service.base[1] * scope.factor * car,
      hours:scope.time * Math.max(.92, car)
    };
  }

  function estimateTime(lines){
    const total = lines.reduce((sum,l)=>sum+l.hours,0);
    // Combined jobs share washing/prep time, so total duration is not a raw sum.
    const adjusted = total * (lines.length > 1 ? .84 : 1);
    if (adjusted <= 6) return '3–6 часов';
    if (adjusted <= 10) return '1 день';
    if (adjusted <= 18) return '1–2 дня';
    if (adjusted <= 28) return '2–3 дня';
    if (adjusted <= 40) return '3–5 дней';
    return '4–6 дней';
  }

  function renderScopes(){
    const keys = [...state.selected];
    if (!keys.length){
      scopesRoot.innerHTML = '<div class="calc-empty">Выберите хотя бы одну услугу выше — здесь появится её индивидуальный объём работ.</div>';
      return;
    }

    scopesRoot.replaceChildren(...keys.map(key => {
      const service = services[key];
      const card = document.createElement('section');
      card.className = 'calc-service-scope';
      card.dataset.scopeService = key;

      const head = document.createElement('div');
      head.className = 'calc-service-scope__head';
      head.innerHTML = `<div><b>${service.name}</b><small>Выберите объём именно для этой услуги</small></div>`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'calc-service-scope__remove';
      remove.dataset.removeService = key;
      remove.textContent = 'Убрать ×';
      head.append(remove);

      const options = document.createElement('div');
      options.className = 'calc-service-scope__options';
      ['local','base','full'].forEach((scopeKey,index) => {
        const scope = service.scopes[scopeKey];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.serviceScope = key;
        btn.dataset.scopeValue = scopeKey;
        btn.classList.toggle('is-selected', state.scopes[key] === scopeKey);
        btn.innerHTML = `<span>0${index+1}</span><b>${scope.label}</b><small>${scope.sub}</small>`;
        options.append(btn);
      });

      card.append(head, options);
      return card;
    }));
  }

  function renderSuggestion(){
    let recommended = null;
    let message = 'Можно комбинировать услуги: каждый выбранный пункт получит свой объём работ.';

    if (state.selected.has('ppf') && !state.selected.has('ceramic')){
      recommended = 'ceramic';
      message = 'К PPF часто добавляют керамическую защиту для открытых зон кузова или самой плёнки.';
    } else if (state.selected.has('polish') && !state.selected.has('ceramic')){
      recommended = 'ceramic';
      message = 'После полировки логично добавить защитное покрытие, чтобы дольше сохранить результат.';
    } else if (state.selected.has('interior') && !state.selected.has('glass')){
      recommended = 'glass';
      message = 'К комплексному уходу можно добавить стёкла/антидождь как отдельную доп. работу.';
    } else if (state.selected.has('ceramic') && state.selected.has('ppf')){
      message = 'Комбинация PPF + керамика уже собрана: плёнка защищает зоны риска, покрытие — остальные поверхности.';
    }

    suggestionText.textContent = message;
    if (recommended){
      suggestionAction.hidden = false;
      suggestionAction.dataset.addService = recommended;
      suggestionAction.firstChild && (suggestionAction.firstChild.textContent = `Добавить ${services[recommended].short} `);
    } else {
      suggestionAction.hidden = true;
      delete suggestionAction.dataset.addService;
    }
  }

  function renderResult(){
    const keys = [...state.selected];
    const lines = keys.map(getLine);
    const carName = carNames[state.car];

    countTop.textContent = keys.length;
    out.resultCount.textContent = keys.length;

    if (!lines.length){
      out.price.textContent = '—';
      out.title.textContent = `${carName} / выберите услуги`;
      out.time.textContent = '—';
      out.volume.textContent = '0 услуг';
      out.percent.textContent = '0%';
      out.ring.style.background = 'conic-gradient(#bedc2d 0 0%,#d7ded5 0% 100%)';
      out.packageTitle.textContent = 'Комплект не выбран';
      out.code.textContent = 'EST-000';
      out.lines.innerHTML = '<div class="calc-empty">Добавьте одну или несколько услуг, чтобы увидеть общий расчёт.</div>';
      out.breakdown.replaceChildren();
      return;
    }

    const totalLow = lines.reduce((sum,l)=>sum+l.low,0);
    const totalHigh = lines.reduce((sum,l)=>sum+l.high,0);

    // Small package efficiency: overlapping washing/prep is not charged twice in this demo estimate.
    const packageFactor = lines.length >= 3 ? .95 : lines.length === 2 ? .975 : 1;
    const low = totalLow * packageFactor;
    const high = totalHigh * packageFactor;
    const workload = Math.min(96, Math.round(30 + lines.reduce((sum,l)=>sum+l.hours,0) * 1.7 + (carMultipliers[state.car]-1)*22));

    out.price.textContent = formatRange(low,high);
    out.title.textContent = `${carName} / ${keys.length} ${keys.length === 1 ? 'услуга' : keys.length < 5 ? 'услуги' : 'услуг'} в одном заказе`;
    out.time.textContent = estimateTime(lines);
    out.volume.textContent = `${keys.length} ${keys.length === 1 ? 'услуга' : keys.length < 5 ? 'услуги' : 'услуг'}`;
    out.percent.textContent = `${workload}%`;
    out.ring.style.background = `conic-gradient(#bedc2d 0 ${workload}%,#d7ded5 ${workload}% 100%)`;
    out.packageTitle.textContent = lines.map(l=>l.service.short).join(' + ');
    out.code.textContent = `EST-${String(Math.round(low+high+workload)).padStart(3,'0').slice(-3)}`;

    out.lines.replaceChildren(...lines.map(line => {
      const row = document.createElement('div');
      row.className = 'calc-line-item';
      row.innerHTML = `<div><b>${line.service.name}</b><small>${line.scope.label} · ${line.scope.sub}</small></div><strong>${formatRange(line.low,line.high)}</strong>`;
      return row;
    }));

    const breakdownItems = [];
    lines.forEach(line => line.scope.breakdown.forEach(item => {
      if (!breakdownItems.includes(item)) breakdownItems.push(item);
    }));
    if (lines.length > 1) breakdownItems.push('Общий финальный контроль комплекса работ');

    out.breakdown.replaceChildren(...breakdownItems.slice(0,7).map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));

    result.classList.remove('is-updating');
    void result.offsetWidth;
    result.classList.add('is-updating');
  }

  function syncServiceButtons(){
    root.querySelectorAll('[data-calc-service]').forEach(btn => {
      const selected = state.selected.has(btn.dataset.calcService);
      btn.classList.toggle('is-selected', selected);
      btn.setAttribute('aria-pressed', String(selected));
      const mark = btn.querySelector('.calc-service-toggle__check');
      if (mark) mark.textContent = selected ? '✓' : '+';
    });
  }

  function renderAll(){
    syncServiceButtons();
    renderScopes();
    renderSuggestion();
    renderResult();
  }

  root.querySelectorAll('[data-calc-car]').forEach(btn => btn.addEventListener('click', () => {
    state.car = btn.dataset.calcCar;
    root.querySelectorAll('[data-calc-car]').forEach(x => {
      const active = x === btn;
      x.classList.toggle('is-selected', active);
      x.setAttribute('aria-checked', String(active));
    });
    renderResult();
  }));

  root.querySelectorAll('[data-calc-service]').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.calcService;
    if (state.selected.has(key)) state.selected.delete(key);
    else state.selected.add(key);
    renderAll();
  }));

  scopesRoot.addEventListener('click', event => {
    const remove = event.target.closest('[data-remove-service]');
    if (remove){
      state.selected.delete(remove.dataset.removeService);
      renderAll();
      return;
    }
    const choice = event.target.closest('[data-service-scope]');
    if (!choice) return;
    state.scopes[choice.dataset.serviceScope] = choice.dataset.scopeValue;
    renderAll();
  });

  suggestionAction?.addEventListener('click', () => {
    const key = suggestionAction.dataset.addService;
    if (!key) return;
    state.selected.add(key);
    renderAll();
  });

  const up = root.querySelector('[data-calc-upgrade]');
  const toggle = root.querySelector('[data-calc-upgrade-toggle]');
  toggle?.addEventListener('click', () => {
    const open = up.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  renderAll();
})();


// v0.8 Proof Protocol.
(() => {
  const root = document.querySelector('[data-proof-protocol]');
  if (!root) return;

  const data = {
    materials:{
      code:'P-01', eyebrow:'01 / МАТЕРИАЛЫ',
      title:'Показываем, чем именно работают.',
      lead:'Не просто «используем премиальные материалы», а объясняем, какие типы составов и плёнок применяются и почему это важно для результата.',
      image:'assets/detail-wheel.webp', alt:'Контроль материалов и поверхности автомобиля',
      mediaTag:'ПРОВЕРКА МАТЕРИАЛОВ / 01', pointA:'Состав', pointB:'Подготовка',
      facts:[
        ['01','Проверенные составы','Подбираются под конкретную поверхность и задачу.'],
        ['02','Понятный класс материала','Клиент видит, где используется керамическое покрытие, PPF или защитный состав.'],
        ['03','Без «магии» в формулировках','Сайт объясняет ценность материала человеческим языком.']
      ],
      why:'Когда цена выше среднего, конкретика по материалам снижает ощущение «платим просто за красивый бренд».',
      businessCode:'ДОВЕРИЕ-01', businessTitle:'Снимает вопрос «почему так дорого?»',
      businessText:'Покупатель видит не абстрактное «качество», а конкретные причины стоимости услуги.',
      format:'ПОДРОБНОСТИ', role:'ДОВЕРИЕ',
      checklist:['бренды или классы материалов','сертификаты и рекомендации','условия применения']
    },
    equipment:{
      code:'P-02', eyebrow:'02 / ОБОРУДОВАНИЕ',
      title:'Показываем среду, в которой делают работу.',
      lead:'Свет, инструменты, подготовленная зона и оборудование становятся частью аргумента качества, а не просто интерьером на фотографии.',
      image:'assets/process-inspection.webp', alt:'Осмотр автомобиля под профессиональным светом',
      mediaTag:'ОСВЕЩЕНИЕ / ОБОРУДОВАНИЕ / 02', pointA:'Контрольный свет', pointB:'Осмотр',
      facts:[
        ['01','Контрольный свет','Помогает видеть дефекты, которые незаметны при обычном освещении.'],
        ['02','Профильный инструмент','Для разных этапов используются разные машины, насадки и расходники.'],
        ['03','Подготовленная зона','Чистая рабочая среда снижает риск случайных дефектов.']
      ],
      why:'Фотография красивого бокса сама по себе ничего не доказывает. Пояснения превращают визуал в аргумент.',
      businessCode:'ДОВЕРИЕ-02', businessTitle:'Делает оборудование частью продажи.',
      businessText:'Клиент понимает, зачем студии профессиональный свет и специализированные инструменты.',
      format:'ПОДТВЕРЖДЕНИЕ РЕЗУЛЬТАТА', role:'ОПЫТ',
      checklist:['рабочее освещение','полировальное оборудование','инструменты контроля']
    },
    warranty:{
      code:'P-03', eyebrow:'03 / ГАРАНТИЯ',
      title:'Объясняем не слово «гарантия», а условия.',
      lead:'Пользователь видит, на что распространяется гарантия, какие есть ограничения и что делать, если потребуется проверка результата.',
      image:'assets/process-delivery.webp', alt:'Выдача автомобиля клиенту после детейлинга',
      mediaTag:'ГАРАНТИЯ / ВЫДАЧА / 03', pointA:'Результат', pointB:'Условия',
      facts:[
        ['01','На что действует','Для каждой услуги можно отдельно указать гарантийные условия.'],
        ['02','Что нужно клиенту','Правила ухода и ограничения после выполнения работ.'],
        ['03','Как обратиться','Понятный сценарий повторного осмотра, если возник вопрос.']
      ],
      why:'Чёткие условия выглядят убедительнее, чем крупная надпись «100% гарантия качества».',
      businessCode:'ДОВЕРИЕ-03', businessTitle:'Снижает риск в голове клиента.',
      businessText:'Человек понимает, что произойдёт после оплаты и куда обращаться при вопросах.',
      format:'УСЛОВИЯ', role:'СНИЖЕНИЕ РИСКОВ',
      checklist:['срок гарантии','условия эксплуатации','порядок повторного осмотра']
    },
    quality:{
      code:'P-04', eyebrow:'04 / КОНТРОЛЬ КАЧЕСТВА',
      title:'Показываем, что работа заканчивается проверкой.',
      lead:'Финальный контроль выносится в отдельный этап: проверка света, кромок, поверхностей, салона и согласованного результата.',
      image:'assets/process-work.webp', alt:'Мастер выполняет детейлинг и контроль поверхности',
      mediaTag:'ПРОВЕРКА КАЧЕСТВА / 04', pointA:'Осмотр', pointB:'Финиш',
      facts:[
        ['01','Чек-лист выдачи','Фиксированный список точек, которые проверяются перед клиентом.'],
        ['02','Ответственный этап','Контроль не растворён внутри работ, а выделен отдельно.'],
        ['03','Сравнение с задачей','Проверяется не «красиво / некрасиво», а согласованный результат.']
      ],
      why:'Для дорогой услуги особенно важно показать, что финальный результат проверяется системно, а не «на глаз».',
      businessCode:'ДОВЕРИЕ-04', businessTitle:'Продаёт процесс, а не только результат.',
      businessText:'Покупатель видит, что качество зависит от системы контроля, а не только от конкретного мастера.',
      format:'CHECKLIST', role:'QUALITY',
      checklist:['световой контроль','проверка кромок и стыков','финальный осмотр']
    },
    report:{
      code:'P-05', eyebrow:'05 / ФОТОФИКСАЦИЯ',
      title:'Фиксируем состояние до, во время и после.',
      lead:'Фотоотчёт помогает показать исходное состояние, ключевые этапы и готовый результат — особенно когда работа занимает несколько дней.',
      image:'assets/comparison-before-after.webp', alt:'Сравнение состояния автомобиля до и после работ',
      mediaTag:'ДО / ПОСЛЕ / 05', pointA:'Before', pointB:'After',
      facts:[
        ['01','До начала','Фиксируется состояние кузова, салона или отдельных зон.'],
        ['02','Ключевые этапы','Можно показать подготовку, процесс оклейки или коррекции.'],
        ['03','После работ','Финальный результат остаётся в истории заказа.']
      ],
      why:'Фотофиксация добавляет прозрачность и одновременно создаёт материал для будущих кейсов.',
      businessCode:'ДОВЕРИЕ-05', businessTitle:'Доверие + контент для кейсов.',
      businessText:'Один процесс одновременно повышает прозрачность для клиента и создаёт доказательный контент для сайта.',
      format:'PHOTO LOG', role:'TRANSPARENCY',
      checklist:['исходное состояние','процесс работ','финальный результат']
    }
  };

  const tabs = [...root.querySelectorAll('[data-proof-tab]')];
  const image = root.querySelector('[data-proof-image]');
  const media = root.querySelector('.proof-stage__media');
  const factsRoot = root.querySelector('[data-proof-facts]');
  const checklistRoot = root.querySelector('[data-proof-checklist] ul');

  const out = {
    code:root.querySelector('[data-proof-code]'),
    eyebrow:root.querySelector('[data-proof-eyebrow]'),
    title:root.querySelector('[data-proof-title]'),
    lead:root.querySelector('[data-proof-lead]'),
    mediaTag:root.querySelector('[data-proof-media-tag]'),
    pointA:root.querySelector('[data-proof-point-a]'),
    pointB:root.querySelector('[data-proof-point-b]'),
    why:root.querySelector('[data-proof-why]'),
    businessCode:root.querySelector('[data-proof-business-code]'),
    businessTitle:root.querySelector('[data-proof-business-title]'),
    businessText:root.querySelector('[data-proof-business-text]'),
    format:root.querySelector('[data-proof-format]'),
    role:root.querySelector('[data-proof-role]')
  };

  let active = 'materials';

  function render(key){
    const d = data[key];
    if (!d) return;
    active = key;

    tabs.forEach(btn => {
      const selected = btn.dataset.proofTab === key;
      btn.classList.toggle('is-active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });

    media.classList.add('is-changing');
    window.setTimeout(() => {
      image.src = d.image;
      image.alt = d.alt;
      media.classList.remove('is-changing');
    }, 120);

    out.code.textContent = d.code;
    out.eyebrow.textContent = d.eyebrow;
    out.title.textContent = d.title;
    out.lead.textContent = d.lead;
    out.mediaTag.textContent = d.mediaTag;
    out.pointA.textContent = d.pointA;
    out.pointB.textContent = d.pointB;
    out.why.textContent = d.why;
    out.businessCode.textContent = d.businessCode;
    out.businessTitle.textContent = d.businessTitle;
    out.businessText.textContent = d.businessText;
    out.format.textContent = d.format;
    out.role.textContent = d.role;

    factsRoot.replaceChildren(...d.facts.map(([n,title,text]) => {
      const div = document.createElement('div');
      div.innerHTML = `<span>${n}</span><b>${title}</b><small>${text}</small>`;
      return div;
    }));

    checklistRoot.replaceChildren(...d.checklist.map(item => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
  }

  tabs.forEach(btn => btn.addEventListener('click', () => render(btn.dataset.proofTab)));

  root.querySelector('[data-proof-next]')?.addEventListener('click', () => {
    const keys = Object.keys(data);
    const nextIndex = (keys.indexOf(active) + 1) % keys.length;
    render(keys[nextIndex]);
  });

  const upgrade = root.querySelector('[data-proof-upgrade]');
  const upgradeToggle = root.querySelector('[data-proof-upgrade-toggle]');
  upgradeToggle?.addEventListener('click', () => {
    const open = upgrade.classList.toggle('is-open');
    upgradeToggle.setAttribute('aria-expanded', String(open));
  });

  render(active);
})();


// v0.9 Process Control.
(() => {
  const root = document.querySelector('[data-process-control]');
  if (!root) return;

  const stages = {
    request:{
      index:0, code:'ШАГ-01', eyebrow:'01 / ЗАЯВКА', status:'ЗАЯВКА / ПОЛУЧЕНА',
      title:'Сначала понимаем задачу.',
      lead:'Клиент выбирает удобный сценарий обращения, а менеджер уже получает базовый контекст: автомобиль, интересующие работы и желаемый результат.',
      image:'assets/process-request.webp', alt:'Приём заявки на детейлинг',
      markerA:'Контакт', markerB:'Задача',
      captionLabel:'СЕЙЧАС', caption:'Фиксируем задачу и удобный способ связи.',
      actions:['фиксируем автомобиль и задачу','уточняем удобный канал связи','согласуем время осмотра'],
      client:['понимание следующего шага','предварительный ориентир','подтверждение записи'],
      time:'5–15 минут', state:'ЗАЯВКА ПОЛУЧЕНА',
      businessCode:'ЭТАП-01', businessTitle:'Убирает неопределённость в начале.',
      businessText:'Человек сразу понимает, что произойдёт после нажатия кнопки, поэтому первый контакт ощущается безопаснее.',
      signal:62, businessList:['что нужно от клиента','кто подключается со стороны бизнеса','какой результат завершает этап']
    },
    inspection:{
      index:1, code:'ШАГ-02', eyebrow:'02 / ОСМОТР', status:'ОСМОТР / 360°',
      title:'Проверяем состояние до обещаний.',
      lead:'Перед финальной стоимостью мастер осматривает автомобиль, фиксирует состояние и подтверждает объём работ — особенно там, где цена зависит от дефектов и площади.',
      image:'assets/process-inspection.webp', alt:'Осмотр автомобиля под профессиональным светом',
      markerA:'ЛКП', markerB:'360° осмотр',
      captionLabel:'КОНТРОЛЬНАЯ ТОЧКА', caption:'Подтверждаем состояние и точный объём работ.',
      actions:['осмотр кузова и салона','фиксация дефектов и зон риска','подтверждение состава работ'],
      client:['точную стоимость','понятный объём','согласованные ожидания'],
      time:'20–40 минут', state:'ОБЪЁМ ПОДТВЕРЖДЁН',
      businessCode:'ЭТАП-02', businessTitle:'Защищает от неверных ожиданий.',
      businessText:'Осмотр отделяет предварительный онлайн-ориентир от финального обещания бизнеса.',
      signal:74, businessList:['исходное состояние','точки риска','что войдёт и не войдёт в работу']
    },
    work:{
      index:2, code:'ШАГ-03', eyebrow:'03 / РАБОТА', status:'РАБОТА / ИДЁТ',
      title:'Показываем, что происходит внутри услуги.',
      lead:'Сайт раскрывает ключевые стадии самой работы: подготовку, основной процесс и промежуточный контроль, вместо абстрактной фразы «оставьте автомобиль мастерам».',
      image:'assets/process-work.webp', alt:'Мастер выполняет детейлинг автомобиля',
      markerA:'Процесс', markerB:'Материал',
      captionLabel:'В РАБОТЕ', caption:'Подготовка → основная работа → промежуточная проверка.',
      actions:['подготовка поверхности или салона','выполнение согласованного комплекса','промежуточная проверка результата'],
      client:['понимание, за что платит','прозрачный состав работ','ориентир по готовности'],
      time:'от нескольких часов до 5 дней', state:'РАБОТЫ ВЫПОЛНЯЮТСЯ',
      businessCode:'ЭТАП-03', businessTitle:'Продаёт сложность и ценность работы.',
      businessText:'Когда процесс виден, высокая стоимость меньше воспринимается как «просто помыли / наклеили / отполировали».',
      signal:83, businessList:['ключевые этапы','материалы и методы','что контролируется во время работы']
    },
    quality:{
      index:3, code:'ШАГ-04', eyebrow:'04 / КОНТРОЛЬ КАЧЕСТВА', status:'ПРОВЕРКА / ПРОЙДЕНА',
      title:'Отдельно проверяем готовый результат.',
      lead:'Контроль качества становится самостоятельным этапом: световой осмотр, кромки и стыки, чистота, соответствие согласованной задаче и финальная фотофиксация.',
      image:'assets/detail-headlight.webp', alt:'Финальный контроль качества автомобиля',
      markerA:'Контрольный свет', markerB:'Итоговая проверка',
      captionLabel:'КОНТРОЛЬ КАЧЕСТВА', caption:'Работа не считается готовой, пока не пройден финальный контроль.',
      actions:['световой и визуальный контроль','проверка зон, кромок и деталей','сверка с согласованной задачей'],
      client:['подтверждённый результат','меньше риска недочётов','финальную фотофиксацию'],
      time:'30–60 минут', state:'ПРОВЕРКА ПРОЙДЕНА',
      businessCode:'ЭТАП-04', businessTitle:'Делает качество процессом, а не лозунгом.',
      businessText:'Отдельный quality gate показывает, что выдача зависит от проверки результата, а не от того, «закончил ли мастер».',
      signal:92, businessList:['чек-лист выдачи','контрольный свет','результат до допуска к выдаче']
    },
    delivery:{
      index:4, code:'ШАГ-05', eyebrow:'05 / ВЫДАЧА', status:'ГОТОВО / ВЫДАЧА',
      title:'Закрываем работу понятной передачей результата.',
      lead:'Клиент принимает автомобиль, получает рекомендации по уходу, гарантийные условия и материалы по выполненным работам.',
      image:'assets/process-delivery.webp', alt:'Выдача автомобиля после детейлинга',
      markerA:'Выдача', markerB:'Правила ухода',
      captionLabel:'ГОТОВО', caption:'Выдаём автомобиль вместе с рекомендациями и подтверждением работ.',
      actions:['совместный финальный осмотр','рекомендации по уходу','передача гарантийной информации'],
      client:['готовый автомобиль','правила ухода','понимание гарантийных условий'],
      time:'15–30 минут', state:'ВЫДАНО',
      businessCode:'ЭТАП-05', businessTitle:'Продолжает отношения после оплаты.',
      businessText:'Выдача превращается не в «заберите ключи», а в точку для повторного доверия, рекомендаций и следующих услуг.',
      signal:96, businessList:['что сделано','как сохранить результат','когда вернуться на обслуживание']
    }
  };

  const order = ['request','inspection','work','quality','delivery'];
  const tabs = [...root.querySelectorAll('[data-process-tab]')];
  const visual = root.querySelector('.process-visual');
  const image = root.querySelector('[data-process-image]');
  const actions = root.querySelector('[data-process-actions]');
  const client = root.querySelector('[data-process-client]');
  const businessList = root.querySelector('[data-process-business-list]');
  const progress = root.querySelector('[data-process-progress]');
  const signal = root.querySelector('[data-process-signal]');

  const out = {
    visualStatus:root.querySelector('[data-process-visual-status]'),
    counter:root.querySelector('[data-process-counter]'),
    markerA:root.querySelector('[data-process-marker-a]'),
    markerB:root.querySelector('[data-process-marker-b]'),
    captionLabel:root.querySelector('[data-process-caption-label]'),
    caption:root.querySelector('[data-process-caption]'),
    code:root.querySelector('[data-process-code]'),
    eyebrow:root.querySelector('[data-process-eyebrow]'),
    title:root.querySelector('[data-process-title]'),
    lead:root.querySelector('[data-process-lead]'),
    time:root.querySelector('[data-process-time]'),
    state:root.querySelector('[data-process-state]'),
    businessCode:root.querySelector('[data-process-business-code]'),
    businessTitle:root.querySelector('[data-process-business-title]'),
    businessText:root.querySelector('[data-process-business-text]'),
    signalLabel:root.querySelector('[data-process-signal-label]')
  };

  const prev = root.querySelector('[data-process-prev]');
  const next = root.querySelector('[data-process-next]');
  const demo = root.querySelector('[data-process-demo]');
  let active = 'request';
  let demoTimer = null;

  const fillList = (target, items) => {
    target.replaceChildren(...items.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
  };

  function render(key){
    const d = stages[key];
    if (!d) return;
    active = key;
    root.dataset.activeStage = key;

    tabs.forEach(btn => {
      const selected = btn.dataset.processTab === key;
      btn.classList.toggle('is-active', selected);
      btn.setAttribute('aria-selected', String(selected));
    });

    visual.classList.add('is-changing');
    window.setTimeout(() => {
      image.src = d.image;
      image.alt = d.alt;
      visual.classList.remove('is-changing');
    }, 110);

    out.visualStatus.innerHTML = `<i></i>${d.status}`;
    out.counter.textContent = `0${d.index + 1} / 05`;
    out.markerA.textContent = d.markerA;
    out.markerB.textContent = d.markerB;
    out.captionLabel.textContent = d.captionLabel;
    out.caption.textContent = d.caption;
    out.code.textContent = d.code;
    out.eyebrow.textContent = d.eyebrow;
    out.title.textContent = d.title;
    out.lead.textContent = d.lead;
    out.time.textContent = d.time;
    out.state.textContent = d.state;
    out.businessCode.textContent = d.businessCode;
    out.businessTitle.textContent = d.businessTitle;
    out.businessText.textContent = d.businessText;
    out.signalLabel.textContent = `${d.signal}%`;

    fillList(actions, d.actions);
    fillList(client, d.client);
    fillList(businessList, d.businessList);

    progress.style.width = `${(d.index / (order.length - 1)) * 100}%`;
    signal.style.width = `${d.signal}%`;

    prev.disabled = d.index === 0;
    next.innerHTML = d.index === order.length - 1 ? 'Вернуться к началу <span>↺</span>' : 'Следующий этап <span>→</span>';
  }

  tabs.forEach(btn => btn.addEventListener('click', () => {
    if (demoTimer) {
      window.clearInterval(demoTimer);
      demoTimer = null;
      demo.innerHTML = 'Пройти весь процесс <span>▶</span>';
    }
    render(btn.dataset.processTab);
  }));

  prev.addEventListener('click', () => {
    const index = stages[active].index;
    if (index > 0) render(order[index - 1]);
  });

  next.addEventListener('click', () => {
    const index = stages[active].index;
    render(order[index === order.length - 1 ? 0 : index + 1]);
  });

  function stopDemo(label = 'Пройти весь процесс <span>▶</span>') {
    if (demoTimer) window.clearInterval(demoTimer);
    demoTimer = null;
    demo.innerHTML = label;
  }

  demo.addEventListener('click', () => {
    if (__kbReduceMotion) {
      const index = stages[active].index;
      render(order[index === order.length - 1 ? 0 : index + 1]);
      demo.innerHTML = 'Следующий этап <span>→</span>';
      return;
    }
    if (demoTimer) {
      stopDemo();
      return;
    }
    render('request');
    demo.innerHTML = 'Остановить демонстрацию <span>■</span>';
    demoTimer = window.setInterval(() => {
      const index = stages[active].index;
      if (index === order.length - 1) {
        stopDemo('Пройти ещё раз <span>↺</span>');
        return;
      }
      render(order[index + 1]);
    }, 2200);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && demoTimer) stopDemo();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting && demoTimer) stopDemo();
    }, { threshold:0.08 });
    observer.observe(root);
  }

  const upgrade = root.querySelector('[data-process-upgrade]');
  const upgradeToggle = root.querySelector('[data-process-upgrade-toggle]');
  upgradeToggle?.addEventListener('click', () => {
    const open = upgrade.classList.toggle('is-open');
    upgradeToggle.setAttribute('aria-expanded', String(open));
  });

  render(active);
})();


// v1.0 Smart Lead — carries context from interactive blocks into the lead form.
(() => {
  const root = document.querySelector('[data-smart-lead]');
  if (!root) return;

  const form = root.querySelector('[data-smart-form]');
  const success = root.querySelector('[data-form-success]');
  const payloadOut = root.querySelector('[data-form-payload]');
  const phoneInput = form?.elements?.namedItem('phone');

  let leadSource = 'Страница / свободный переход';

  const text = selector => document.querySelector(selector)?.textContent?.trim() || '';

  function phoneDigits(value){
    let digits = String(value || '').replace(/\D/g,'');
    if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
    if (digits.length === 10 && digits.startsWith('9')) digits = `7${digits}`;
    return digits.slice(0, 11);
  }

  function formatPhone(value){
    const digits = phoneDigits(value);
    if (!digits) return '';
    const rest = digits.slice(1);
    let out = '+7';
    if (rest.length) out += ` (${rest.slice(0, 3)}`;
    if (rest.length >= 3) out += ')';
    if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
    if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
    if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
    return out;
  }

  if (phoneInput) {
    phoneInput.dataset.prev = phoneInput.value || '';
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value.trim()) {
        phoneInput.value = '+7 (';
        phoneInput.dataset.prev = phoneInput.value;
        const end = phoneInput.value.length;
        phoneInput.setSelectionRange(end, end);
      }
    });
    phoneInput.addEventListener('input', () => {
      const prev = phoneInput.dataset.prev || '';
      let digits = phoneInput.value.replace(/\D/g, '');
      const prevDigits = prev.replace(/\D/g, '');
      if (phoneInput.value.length < prev.length && digits.length === prevDigits.length && digits.length) {
        digits = digits.slice(0, -1);
      }
      if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
      if (digits.length === 10 && digits.startsWith('9')) digits = `7${digits}`;
      digits = digits.slice(0, 11);
      if (!digits || digits === '7') {
        phoneInput.value = '';
        phoneInput.dataset.prev = '';
        return;
      }
      phoneInput.value = formatPhone(digits);
      phoneInput.dataset.prev = phoneInput.value;
    });
    phoneInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Backspace' && event.key !== 'Delete') return;
      const start = phoneInput.selectionStart ?? 0;
      const end = phoneInput.selectionEnd ?? 0;
      if (start !== end) return;
      if (event.key === 'Backspace' && start > 0 && /\D/.test(phoneInput.value[start - 1])) {
        event.preventDefault();
        const digits = phoneDigits(phoneInput.value).slice(0, -1);
        phoneInput.value = digits && digits !== '7' ? formatPhone(digits) : '';
        phoneInput.dataset.prev = phoneInput.value;
        const pos = phoneInput.value.length;
        phoneInput.setSelectionRange(pos, pos);
      }
    });
  }

  const carLabels = {compact:'Седан',crossover:'Кроссовер',suv:'Большой внедорожник',premium:'Премиум'};
  const conditionLabels = {new:'Новый',normal:'Эксплуатация',worn:'Нужен уход'};

  function snapshot(){
    const state=window.KB_GROWTH?.get() || {};
    const cart=Array.isArray(state.cart)?state.cart:[];
    const manual=(state.calcSelected||[]).filter(k=>window.KB_PRICING?.services?.[k]);
    const selectedCalc=[...cart.map(x=>x.title),...manual.map(k=>window.KB_PRICING.services[k].name)];
    const carLabel=carLabels[state.car]||'';
    const conditionLabel=conditionLabels[state.condition]||'';
    const cats=[...new Set(cart.map(x=>x.slug))].map(slug=>(window.KB_SERVICE_DATA||[]).find(x=>x.slug===slug)?.title||slug);
    const rawEstimate=document.querySelector('[data-g27-estimate]')?.textContent?.trim()||'';
    const packagePrice=selectedCalc.length && rawEstimate!=='Ожидает выбора' ? rawEstimate : '';
    const packageNote=document.querySelector('[data-g27-estimate-note]')?.textContent?.trim()||'';
    const caseTitle=window.__kbCaseTouched?text('[data-case-main-title]'):'';
    const caseService=window.__kbCaseTouched?text('[data-case-main-service]'):'';
    const reviewTitle=window.__kbReviewTouched?(window.__kbReviewContext?.title||text('[data-voice-title]')):'';
    const reviewService=window.__kbReviewTouched?(window.__kbReviewContext?.service||text('[data-voice-service]')):'';
    return {
      source:leadSource,
      matchTitle:selectedCalc.length ? `${selectedCalc.length} выбранных работ` : '',
      matchPrice:selectedCalc.join(', '),
      serviceTitle:cats.join(', '), servicePrice:'',
      packageTitle:selectedCalc.length ? 'Составленный заказ' : '',
      packagePrice, packageNote, packageCount:String(selectedCalc.length), selectedCalc,
      carLabel, conditionLabel,
      caseTitle,caseService,reviewTitle,reviewService
    };
  }

  function renderContext(){
    const s = snapshot();
    const chips = root.querySelector('[data-form-context-chips]');
    if (chips) {
      const chipData = [
        ...(s.carLabel ? [s.carLabel] : []),
        ...(s.conditionLabel ? [s.conditionLabel] : []),
        ...s.selectedCalc
      ];
      if (!chipData.length) chipData.push('ваш выбор');
      chips.replaceChildren(...chipData.map(label => {
        const b = document.createElement('b');
        b.textContent = label;
        return b;
      }));
    }
    return s;
  }

  function setSource(source){
    leadSource = source;
    renderContext();
  }

  const ctaMap = [
    ['.matrix-inspector__cta','Service Matrix / выбранная услуга'],
    ['.case-showcase__cta','Case Lab / похожий результат'],
    ['.review-voice__cta','Client Voice / похожий отзыв'],
    ['.g27-selection__cta','Ваш выбор / заказ'],
    ['[data-g27-order]','Направление / заказ']
  ];

  ctaMap.forEach(([selector, source]) => {
    document.querySelectorAll(selector).forEach(button => {
      button.addEventListener('click', () => {
        setSource(source);
        root.scrollIntoView({behavior:__kbScrollBehavior, block:'start'});
        window.setTimeout(() => form.querySelector('input[name="name"]')?.focus({preventScroll:true}), 650);
      });
    });
  });

  function validate(){
    let valid = true;
    const name = form.elements.name;
    const phone = form.elements.phone;
    const nameError = form.querySelector('[data-error-for="name"]');
    const phoneError = form.querySelector('[data-error-for="phone"]');
    nameError.textContent = '';
    phoneError.textContent = '';

    if (name.value.trim().length < 2) {
      nameError.textContent = 'Укажите, как к вам обращаться';
      valid = false;
    }
    const digits = phoneDigits(phone.value);
    if (digits.length !== 11) {
      phoneError.textContent = 'Укажите телефон в формате +7 (999) 123-45-67';
      valid = false;
    }
    return valid;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    success.setAttribute('hidden','');
    if (!validate()) return;

    const s = renderContext();
    const data = new FormData(form);
    const payload = {
      name:data.get('name'),
      phone:data.get('phone'),
      car:data.get('car') || 'не указано',
      car_class:s.carLabel || '—',
      car_condition:s.conditionLabel || '—',
      contact:data.get('contact'),
      comment:data.get('message') || '—',
      source:s.source,
      selected_works:s.selectedCalc.length?s.selectedCalc.join('; '):'—',
      selected_service:s.serviceTitle || '—',
      package:s.packageTitle || '—',
      package_items:s.selectedCalc.length ? s.selectedCalc.join('; ') : '—',
      budget:s.packagePrice || '—',
      review_interest:s.reviewTitle || '—',
      case_interest:s.caseTitle || '—'
    };

    payloadOut.textContent =
`Имя: ${payload.name}
Телефон: ${payload.phone}
Связь: ${payload.contact}
Автомобиль: ${payload.car}
Класс: ${payload.car_class}
Состояние: ${payload.car_condition}

Источник: ${payload.source}
Ваш выбор: ${payload.selected_works}
Услуга: ${payload.selected_service}
Заказ: ${payload.package}
Работы: ${payload.package_items}
Ориентир: ${payload.budget}
Похожий отзыв: ${payload.review_interest}
Кейс: ${payload.case_interest}

Комментарий: ${payload.comment}
Отправка на сервер: НЕ ПОДКЛЮЧЕНА (демо).`;

    success.removeAttribute('hidden');
    success.scrollIntoView({behavior:__kbScrollBehavior, block:'nearest'});
  });

  root.querySelector('[data-form-reset]')?.addEventListener('click', () => {
    success.setAttribute('hidden','');
    form.elements.name.focus();
  });

  const upgrade = root.querySelector('[data-lead-upgrade]');
  const upgradeToggle = root.querySelector('[data-lead-upgrade-toggle]');
  upgradeToggle?.addEventListener('click', () => {
    const open = upgrade.classList.toggle('is-open');
    upgradeToggle.setAttribute('aria-expanded', String(open));
  });

  window.addEventListener('kb:brief-change', () => renderContext());
  renderContext();
})();


// v1.1 Growth → System compact interactive gateway.
(() => {
  const root = document.querySelector('[data-system-gateway]');
  if (!root) return;

  const data = {
    configurator:{
      code:'СИСТЕМА-01',
      eyebrow:'01 / ПОЛНЫЙ КОНФИГУРАТОР',
      title:'Выбор прямо на автомобиле.',
      lead:'Пользователь работает уже не с общими пакетами, а с конкретными зонами, элементами и зависимостями между услугами.',
      flow:['Выбрать автомобиль','Отметить зоны','Собрать решение'],
      value:'Сайт становится полноценным инструментом конфигурации заказа.',
      boundary:'РОСТ: пакет услуг → СИСТЕМА: конкретные зоны и зависимая логика'
    },
    logic:{
      code:'СИСТЕМА-02',
      eyebrow:'02 / УМНАЯ ЛОГИКА',
      title:'Следующий шаг зависит от предыдущего выбора.',
      lead:'Сценарий меняется по типу автомобиля, выбранным зонам, состоянию, бюджету или другим правилам бизнеса.',
      flow:['Получить вводные','Применить правила','Показать релевантный сценарий'],
      value:'Клиент видит только подходящие варианты, а бизнес управляет логикой выбора.',
      boundary:'РОСТ: интерактивные блоки → СИСТЕМА: связанные условия между шагами'
    },
    integrations:{
      code:'СИСТЕМА-03',
      eyebrow:'03 / ИНТЕГРАЦИИ',
      title:'Заявка не заканчивается на форме.',
      lead:'Данные можно передавать в систему учёта клиентов, мессенджер, аналитику или другие рабочие системы по согласованному сценарию.',
      flow:['Собрать данные','Передать в систему','Продолжить работу менеджера'],
      value:'Сайт становится частью рабочего контура, а не отдельной витриной.',
      boundary:'РОСТ: готовый payload → СИСТЕМА: подключённый рабочий контур'
    },
    automation:{
      code:'SYS-04',
      eyebrow:'04 / AUTOMATION',
      title:'Часть действий запускается автоматически.',
      lead:'После выбора или заявки могут запускаться уведомления, распределение лидов, персональные сообщения и другие согласованные автоматические действия.',
      flow:['Событие на сайте','Автосценарий','Следующее действие'],
      value:'Ручных промежуточных действий становится меньше, а процесс — быстрее и стабильнее.',
      boundary:'РОСТ: квалификация → СИСТЕМА: автоматическое продолжение сценария'
    }
  };

  const tabs = [...root.querySelectorAll('[data-system-tab]')];
  const out = {
    code:root.querySelector('[data-system-code]'),
    eyebrow:root.querySelector('[data-system-eyebrow]'),
    title:root.querySelector('[data-system-title]'),
    lead:root.querySelector('[data-system-lead]'),
    flow:root.querySelector('[data-system-flow]'),
    value:root.querySelector('[data-system-value]'),
    boundary:root.querySelector('[data-system-boundary]')
  };
  let active = 'configurator';
  let timer = null;

  function render(key){
    const d = data[key];
    if (!d) return;
    active = key;
    tabs.forEach(btn => {
      const selected = btn.dataset.systemTab === key;
      btn.classList.toggle('is-active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    out.code.textContent = d.code;
    out.eyebrow.textContent = d.eyebrow;
    out.title.textContent = d.title;
    out.lead.textContent = d.lead;
    out.value.textContent = d.value;
    out.boundary.textContent = d.boundary;

    out.flow.replaceChildren();
    d.flow.forEach((label,index) => {
      const span = document.createElement('span');
      span.innerHTML = `<b>0${index+1}</b>${label}`;
      out.flow.append(span);
      if (index < d.flow.length - 1) {
        const arrow = document.createElement('i');
        arrow.textContent = '→';
        out.flow.append(arrow);
      }
    });
  }

  tabs.forEach(btn => btn.addEventListener('click', () => {
    if (timer) { window.clearInterval(timer); timer = null; }
    render(btn.dataset.systemTab);
  }));

  const tourButton = root.querySelector('[data-system-tour]');
  function stopTour() {
    if (timer) window.clearInterval(timer);
    timer = null;
    if (tourButton) tourButton.innerHTML = 'Пройти отличия <b>→</b>';
  }

  tourButton?.addEventListener('click', event => {
    const button = event.currentTarget;
    const keys = Object.keys(data);
    let index = keys.indexOf(active);
    if (__kbReduceMotion) {
      render(keys[(index + 1) % keys.length]);
      return;
    }
    if (timer) {
      stopTour();
      return;
    }
    button.innerHTML = 'Остановить <b>■</b>';
    timer = window.setInterval(() => {
      index = (index + 1) % keys.length;
      render(keys[index]);
    }, 1900);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && timer) stopTour();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting && timer) stopTour();
    }, { threshold:0.08 });
    observer.observe(root);
  }

  render(active);
})();


// v1.2 Client Voice — filterable demo reviews linked to cases and Smart Lead.
(() => {
  const root = document.querySelector('[data-client-voice]');
  if (!root) return;

  const reviews = {
    x5:{
      category:['polish','ceramic'], title:'BMW X5 G05', service:'Коррекция лака + керамика',
      quote:'«После полировки цвет снова стал глубоким, а мелкая паутинка почти исчезла. Понравилось, что заранее объяснили, что реально исправить.»',
      time:'2 дня', kind:'ПОЛИРОВКА / КЕРАМИКА', image:'assets/case-bmw-x5.webp', tag:'ПОЛИРОВКА / КЕРАМИКА',
      code:'ОТ-01', caseName:'ПРИМЕР 01 / BMW X5 G05',
      result:'Коррекция ЛКП, керамическое покрытие, восстановление глубины цвета.'
    },
    q8:{
      category:['ppf'], title:'Audi Q8', service:'PPF передней части',
      quote:'«Оклеили переднюю часть аккуратно, кромки не бросаются в глаза. Машину отдали в согласованный срок, без сюрпризов по цене.»',
      time:'1 день', kind:'PPF / ПЕРЕДНЯЯ ЧАСТЬ', image:'assets/case-audi-q8.webp', tag:'PPF / ПЕРЕДНЯЯ ЧАСТЬ',
      code:'ОТ-02', caseName:'ПРИМЕР 02 / Audi Q8',
      result:'Защита капота, бампера, крыльев и зеркал полиуретановой плёнкой.'
    },
    macan:{
      category:['interior'], title:'Porsche Macan', service:'Химчистка + защита кожи',
      quote:'«Салон заметно посвежел, особенно кожа и светлый текстиль. После выдачи не осталось резкого запаха химии.»',
      time:'1 день', kind:'САЛОН / КОЖА', image:'assets/case-porsche-macan.webp', tag:'САЛОН',
      code:'ОТ-03', caseName:'ПРИМЕР 03 / Porsche Macan',
      result:'Глубокая очистка салона, работа с кожей и защитный состав.'
    },
    gle:{
      category:['ceramic','glass'], title:'Mercedes GLE', service:'Керамика + антидождь',
      quote:'«После мойки автомобиль реально проще привести в порядок, вода со стёкол уходит быстрее. Эффект понятен в обычной эксплуатации.»',
      time:'1 день', kind:'COAT / GLASS', image:'assets/showcase-suv.webp', tag:'COAT / GLASS',
      code:'ОТ-04', caseName:'RELATED / Protection',
      result:'Защитное покрытие кузова и гидрофобная обработка стёкол.'
    },
    bmw5:{
      category:['polish'], title:'BMW 5 Series', service:'Полировка кузова',
      quote:'«Не навязывали полный комплекс. После осмотра предложили только то, что действительно имело смысл для состояния машины.»',
      time:'1 день', kind:'PAINT / POLISH', image:'assets/service-polish.webp', tag:'PAINT / POLISH',
      code:'ОТ-05', caseName:'RELATED / Paint correction',
      result:'Одноэтапная коррекция ЛКП и финишная защита поверхности.'
    },
    rr:{
      category:['ppf','ceramic'], title:'Range Rover Sport', service:'PPF + защита плёнки',
      quote:'«Отдельно понравилась выдача: показали результат под светом и объяснили, как дальше ухаживать за плёнкой и покрытием.»',
      time:'3 дня', kind:'PPF / COAT', image:'assets/service-protection.webp', tag:'PPF / COAT',
      code:'ОТ-06', caseName:'RELATED / Full protection',
      result:'Защитная плёнка на ключевые зоны и финишное покрытие для ухода.'
    }
  };

  const cards = [...root.querySelectorAll('[data-voice-card]')];
  const filters = [...root.querySelectorAll('[data-voice-filter]')];
  const feature = root.querySelector('.voice-feature');
  const image = root.querySelector('[data-voice-image]');
  const count = root.querySelector('[data-voice-count]');
  let active = 'x5';
  let currentFilter = 'all';

  const out = {
    mediaTag:root.querySelector('[data-voice-media-tag]'),
    mediaCode:root.querySelector('[data-voice-media-code]'),
    service:root.querySelector('[data-voice-service]'),
    title:root.querySelector('[data-voice-title]'),
    rating:root.querySelector('[data-voice-rating]'),
    quote:root.querySelector('[data-voice-quote]'),
    time:root.querySelector('[data-voice-time]'),
    kind:root.querySelector('[data-voice-kind]'),
    caseName:root.querySelector('[data-voice-case]'),
    result:root.querySelector('[data-voice-result]')
  };

  function render(key){
    const d = reviews[key];
    if (!d) return;
    active = key;
    cards.forEach(card => card.classList.toggle('is-active', card.dataset.voiceCard === key));
    feature.classList.add('is-changing');
    window.setTimeout(() => {
      image.src = d.image;
      image.alt = `${d.title} — демонстрационный отзыв`;
      feature.classList.remove('is-changing');
    }, 90);
    out.mediaTag.textContent = d.tag;
    out.mediaCode.textContent = d.code;
    out.service.textContent = d.service;
    out.title.textContent = d.title;
    out.rating.textContent = '★★★★★';
    out.quote.textContent = d.quote;
    out.time.textContent = d.time;
    out.kind.textContent = d.kind;
    out.caseName.textContent = d.caseName;
    out.result.textContent = d.result;
  }

  function applyFilter(filter){
    currentFilter = filter;
    let visible = [];
    cards.forEach(card => {
      const key = card.dataset.voiceCard;
      const show = filter === 'all' || reviews[key].category.includes(filter);
      card.hidden = !show;
      if (show) visible.push(key);
    });
    count.textContent = `${visible.length} ${visible.length === 1 ? 'отзыв' : visible.length < 5 ? 'отзыва' : 'отзывов'}`;
    filters.forEach(btn => {
      const on = btn.dataset.voiceFilter === filter;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    if (!visible.includes(active) && visible.length) render(visible[0]);
  }

  filters.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.voiceFilter)));
  cards.forEach(card => card.addEventListener('click', () => render(card.dataset.voiceCard)));

  const upgrade = root.querySelector('[data-voice-upgrade]');
  const upgradeToggle = root.querySelector('[data-voice-upgrade-toggle]');
  upgradeToggle?.addEventListener('click', () => {
    const open = upgrade.classList.toggle('is-open');
    upgradeToggle.setAttribute('aria-expanded', String(open));
  });

  root.querySelector('[data-voice-cta]')?.addEventListener('click', () => {
    const d = reviews[active];
    window.__kbReviewContext = {
      title:d.title,
      service:d.service,
      code:d.code,
      quote:d.quote
    };
  });

  render(active);
  applyFilter(currentFilter);
})();
