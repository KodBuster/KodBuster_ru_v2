import ExcelJS from "exceljs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "KodBuster_прайс.xlsx");

const navy = "071421";
const orange = "FF6B2C";
const paper = "F6F5F2";
const ink = "101821";
const muted = "5C6670";
const line = "D8D4CC";
const white = "FFFFFF";
const featured = "FFF4EE";

const workbook = new ExcelJS.Workbook();
workbook.creator = "KodBuster";
workbook.created = new Date("2026-09-24");
workbook.modified = new Date();

function styleSheet(sheet, widths) {
  sheet.properties.defaultRowHeight = 18;
  sheet.views = [{ state: "frozen", ySplit: 2, showGridLines: false }];
  widths.forEach((width, index) => {
    sheet.getColumn(index + 1).width = width;
  });
}

function title(sheet, text, cols) {
  sheet.mergeCells(1, 1, 1, cols);
  const cell = sheet.getCell(1, 1);
  cell.value = text;
  cell.font = { name: "Calibri", size: 16, bold: true, color: { argb: white } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
  cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(1).height = 28;
}

function note(sheet, row, cols, text) {
  sheet.mergeCells(row, 1, row, cols);
  const cell = sheet.getCell(row, 1);
  cell.value = text;
  cell.font = { name: "Calibri", size: 10, italic: true, color: { argb: muted } };
  cell.alignment = { wrapText: true, vertical: "middle" };
  sheet.getRow(row).height = 32;
}

function header(sheet, row, labels) {
  labels.forEach((label, index) => {
    const cell = sheet.getCell(row, index + 1);
    cell.value = label;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: orange } };
    cell.alignment = { vertical: "middle", wrapText: true };
    cell.border = {
      bottom: { style: "thin", color: { argb: orange } },
    };
  });
  sheet.getRow(row).height = 22;
}

function money(value) {
  return { formula: undefined, richText: undefined, result: value };
}

function fillRow(sheet, row, values, { highlight = false, moneyCols = [] } = {}) {
  values.forEach((value, index) => {
    const cell = sheet.getCell(row, index + 1);
    const isMoney = moneyCols.includes(index);
    cell.value = isMoney && typeof value === "number" ? value : value;
    if (isMoney && typeof value === "number") {
      cell.numFmt = '#,##0" ₽"';
      cell.alignment = { vertical: "middle", horizontal: "right" };
    } else {
      cell.alignment = { vertical: "middle", wrapText: true };
    }
    cell.font = { name: "Calibri", size: 11, color: { argb: ink }, bold: index === 0 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: highlight ? featured : row % 2 === 0 ? paper : white },
    };
    cell.border = {
      bottom: { style: "hair", color: { argb: line } },
    };
  });
  sheet.getRow(row).height = 36;
}

const packages = workbook.addWorksheet("Пакеты", { properties: { tabColor: { argb: orange } } });
styleSheet(packages, [28, 18, 16, 18, 18, 22, 38, 42, 28]);
title(packages, "KodBuster — пакеты запуска сайта", 9);
note(packages, 2, 9, "Цены фиксированные, без «от». Число заявок в цену не входит. Скидка 10% действует, если первая оплата пройдёт в течение трёх рабочих дней после разбора.");
header(packages, 3, [
  "Пакет",
  "Цена",
  "Быстрая предоплата",
  "Срок",
  "Работа студии",
  "Страницы",
  "Что входит",
  "Тексты",
  "Первый месяц «Забота»",
]);
fillRow(packages, 4, [
  "Старт — одна страница",
  70000,
  63000,
  "до 5 рабочих дней",
  "3 рабочих дня",
  "Одна страница, 6–8 блоков",
  "Тексты пишем мы. Домен .ru, хостинг и SSL на первый год оформлены на клиента. Заявка в Telegram или MAX, согласие на форме, ссылка в карточке Яндекс Карт. Один круг правок.",
  "Входят",
  "Не входит",
], { moneyCols: [1, 2] });
fillRow(packages, 5, [
  "Рост — страница под нишу",
  120000,
  108000,
  "до 8 рабочих дней",
  "6 рабочих дней",
  "Одна страница, свой первый экран",
  "Всё из «Старт». Свой первый экран и состав под нишу. Блоки услуг, работ, отзывов и цен. Карточка Яндекс Карт по чеклисту. Видно, откуда приходят обращения. Готово к рекламе. Два круга правок.",
  "Ваши или наши от 20 000 ₽",
  "Входит",
], { highlight: true, moneyCols: [1, 2] });
fillRow(packages, 6, [
  "Система — сайт с разделами",
  170000,
  153000,
  "до 12 рабочих дней",
  "9 рабочих дней",
  "Главная и до 5 страниц услуг",
  "Всё из «Рост». У каждой страницы свой адрес. Общие меню, телефон и форма. Отдельные страницы для Карт и рекламы. Два круга правок.",
  "Ваши или наши от 35 000 ₽",
  "Входит",
], { moneyCols: [1, 2] });

const extras = workbook.addWorksheet("Дополнительные услуги", { properties: { tabColor: { argb: navy } } });
styleSheet(extras, [42, 16, 18, 48]);
title(extras, "Разовые дополнительные услуги", 4);
note(extras, 2, 4, "Не публикуются на сайте отдельным прайсом. Обсуждаются после запуска или на разборе, когда понятно, что нужно клиенту.");
header(extras, 3, ["Услуга", "Цена", "Срок", "Комментарий"]);
const extraRows = [
  ["Тексты для пакета «Рост»", 20000, "2 рабочих дня", "Если клиент не даёт свои тексты."],
  ["Тексты для пакета «Система»", 35000, "4 рабочих дня", "Главная и до 5 страниц услуг."],
  ["Тексты одной дополнительной страницы", 5000, "1 рабочий день", "Сверх комплекта текстов Системы."],
  ["Страница услуги сверх пяти в «Системе»", 15000, "2 рабочих дня", "Свой адрес, общий каркас сайта."],
  ["Посадочная под группу объявлений", 25000, "3 рабочих дня", "Отдельная страница под рекламу."],
  ["Запуск Директа, первые 30 дней ведения", 50000, "30 дней", "Бюджет в кабинет клиент кладёт отдельно, от 60 000 ₽."],
  ["Подключение коллтрекинга", 20000, "3 рабочих дня", "Лицензию сервиса клиент оплачивает сам."],
  ["Интеграция CRM, одна воронка", 30000, "5 рабочих дней", "Лицензию CRM клиент оплачивает сам."],
];
extraRows.forEach((row, index) => fillRow(extras, 4 + index, row, { moneyCols: [1] }));

const monthly = workbook.addWorksheet("Периодические услуги", { properties: { tabColor: { argb: "1F6B8A" } } });
styleSheet(monthly, [28, 28, 18, 56]);
title(monthly, "Ежемесячные услуги после запуска", 4);
note(monthly, 2, 4, "Со второго года домен и хостинг продлеваются по счёту регистратора внутри «Заботы», если клиент на сопровождении.");
header(monthly, 3, ["Услуга", "Цена", "Пример при бюджете 60 000 ₽", "Что входит"]);
fillRow(monthly, 4, [
  "Забота",
  "20 000 ₽ / месяц",
  "20 000 ₽",
  "До 3 часов: тексты, цены, контроль форм, продление домена и хостинга, короткий отчёт.",
]);
fillRow(monthly, 5, [
  "Реклама",
  "15% бюджета, минимум 40 000 ₽",
  "40 000 ₽",
  "Ведение Яндекс Директа. Бюджет в кабинет — отдельно, от 60 000 ₽ в месяц.",
], { highlight: true });
fillRow(monthly, 6, [
  "Забота и реклама",
  "15 000 ₽ + ведение рекламы",
  "55 000 ₽",
  "Сопровождение сайта со скидкой плюс ведение Директа. При бюджете 60 000 ₽: 15 000 + 40 000.",
]);

const ads = workbook.addWorksheet("Рекламный бюджет", { properties: { tabColor: { argb: orange } } });
styleSheet(ads, [36, 22, 56]);
title(ads, "Пополнение рекламного бюджета и порог ведения", 3);
note(ads, 2, 3, "Бюджет в кабинет Яндекс Директа клиент пополняет сам. KodBuster не обещает число заявок: ведение имеет смысл только когда на клики хватает денег.");
header(ads, 3, ["Условие", "Значение", "Пояснение"]);
const adRows = [
  ["Минимальный бюджет в кабинет Директа", "от 60 000 ₽ / месяц", "Ниже этого порога ведение не берём: отчёта без заявок потом не защитить."],
  ["Оплата бюджета", "Клиент кладёт сам в кабинет", "Это не гонорар студии. Счёт Директа и счёт KodBuster разделены."],
  ["Гонорар за ведение", "15% от бюджета, минимум 40 000 ₽", "При бюджете 60 000 ₽ гонорар = 40 000 ₽, не 9 000 ₽."],
  ["Первые 30 дней", "50 000 ₽", "Запуск кампании и первый месяц ведения. Бюджет в кабинет — отдельно."],
  ["Со второго месяца", "15% / мин. 40 000 ₽", "Если клиент остаётся на ведении после запуска."],
  ["Забота и реклама", "15 000 ₽ + гонорар ведения", "При бюджете 60 000 ₽ итого 55 000 ₽ в месяц студии плюс 60 000 ₽ в кабинет."],
  ["Медицинская реклама", "Только после проверки", "Нужны лицензия и согласованные формулировки до запуска Директа."],
  ["Коллтрекинг и CRM", "Подписка клиента", "Разовое подключение — по прайсу доп. услуг. Ежемесячная плата сервису — за клиентом."],
];
adRows.forEach((row, index) => fillRow(ads, 4 + index, row, { highlight: index === 0 }));

const pay = workbook.addWorksheet("Оплата и условия", { properties: { tabColor: { argb: muted } } });
styleSheet(pay, [28, 16, 16, 16, 16, 16, 16, 48]);
title(pay, "Оплата пакетов и общие условия", 8);
note(pay, 2, 8, "Календарный срок паузируется, пока клиент задерживает фото, доступы или правки. Демо после звонка — ссылка, не бесплатный рабочий сайт.");
header(pay, 3, [
  "Пакет",
  "Цена",
  "50% до старта",
  "30% после макета",
  "20% перед публикацией",
  "Цена со скидкой 10%",
  "Первый платёж со скидкой",
  "Условие скидки",
]);
fillRow(pay, 4, ["Старт", 70000, 35000, 21000, 14000, 63000, 31500, "Первая оплата в течение 3 рабочих дней после разбора."], { moneyCols: [1, 2, 3, 4, 5, 6] });
fillRow(pay, 5, ["Рост", 120000, 60000, 36000, 24000, 108000, 54000, "Первая оплата в течение 3 рабочих дней после разбора."], { highlight: true, moneyCols: [1, 2, 3, 4, 5, 6] });
fillRow(pay, 6, ["Система", 170000, 85000, 51000, 34000, 153000, 76500, "Первая оплата в течение 3 рабочих дней после разбора."], { moneyCols: [1, 2, 3, 4, 5, 6] });

pay.mergeCells(8, 1, 8, 8);
pay.getCell(8, 1).value = "От клиента на старте: фото, доступ к карточке на Яндекс Картах, телефон для кодов регистратора и кабинета Яндекса. Домен и хостинг оформляются на клиента. Со второго года продление — по счёту регистратора.";
pay.getCell(8, 1).alignment = { wrapText: true, vertical: "middle" };
pay.getCell(8, 1).font = { name: "Calibri", size: 11, color: { argb: ink } };
pay.getRow(8).height = 40;

await workbook.xlsx.writeFile(file);
console.log(file);
