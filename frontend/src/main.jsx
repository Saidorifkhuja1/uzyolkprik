import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  HardHat,
  Languages,
  Layers,
  Mail,
  MapPin,
  Menu,
  Moon,
  MoveRight,
  Package,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { API_DOCS, fetchSite } from "./api";
import "./styles.css";

// ============================================================
// TRANSLATIONS — O'zbek (default), Rus, Ingliz
// ============================================================
const TRANSLATIONS = {
  uz: {
    // System & Brand
    loading: "Sayt ma'lumotlari yuklanmoqda...",
    backendCheck: "Backend ishlayotganini tekshiring: http://127.0.0.1:8000",
    pageNotFound: "Sahifa topilmadi",
    legalSmall: "klasteri davlat muassasasi",
    brandName: "Oʻzyoʻlkoʻprik",
    brandLegalName: "“Oʻzyoʻlkoʻprik” klasteri davlat muassasasi",
    heroTagline: "Koʻprik va sunʼiy inshootlar uchun loyihalash, ishlab chiqarish, taʼmirlash va diagnostika ishlari",
    heroIntro: "Oʻzbekiston Respublikasi Prezidentining 330-sonli qarori asosida tashkil topgan davlat muassasasi bo'lib Respublika boʻyicha koʻprik qurilishiga ta'aluqli barcha ishlarni amalga oshiradi.",
    homePurpose: "Klasterning maqsadi – avtomobil yo‘llarida joylashgan ko‘prik va sun’iy inshootlarni ta’mirlash hamda texnik soz holatda saqlash maqsadida “loyihalash – tiklash – ekspluatatsiya qilish” ishlarini amalga oshirish hisoblanadi.",
    contactHours: "09:00 dan 18:00 gacha",
    bankText: "Oʻzbekiston Respublikasi TIF Milliy bank Bektemir tumani filiali BIK 00450 STIR 200 836 188",
    addressText: "Toshkent shahri, Yashnobod tumani, Oʻrta Masjid MFY, Ohangrabo koʻchasi 12-uy 100146",
    statusUnderDev: "Ishlab chiqish bosqichida.",

    // Navigation items
    nav: {
      "bosh-sahifa": "Bosh sahifa",
      "korxona-haqida": "Korxona haqida",
      "korxona-ustavi": "Korxona ustavi",
      "tashkiliy-tuzilma": "Tashkiliy tuzilma",
      "rahbariyat": "Rahbariyat",
      "zavod-haqida": "Zavod haqida",
      "katalog": "Katalog",
      "mahsulotlar-katalogi": "Mahsulotlar katalogi",
      "nomenklatura": "Nomenklatura",
      "narx-navo": "Narx-navo",
      "bosh-ish-orinlari": "Boʻsh ish oʻrinlari",
      "filiallar": "Filiallar",
      "elonlar": "Eʼlonlar",
      "qayta-aloqa": "Qayta aloqa",
      "mulkchilik-shakli": "Mulkchilik shakli",
      "vazifalar": "Vazifalar",
    },

    // Header
    contact: "Aloqa",
    searchTitle: "Sayt bo'yicha qidiruv",
    searchPlaceholder: "Sahifa nomi yoki kalit so'zni kiriting...",
    searchPageLabel: "Sayt sahifasi",

    // Hero
    heroKicker: "Respublika Ko'prik Infratuzilmasi",
    heroBtn1: "Katalogni ko'rish",
    heroBtn2: "Bog'lanish",
    heroBadge: "Yagona Klaster Modeli",
    heroProcess: "Loyihalash → Ishlab chiqarish → Ekspluatatsiya",
    heroImgAlt: "Ko'prik va ishlab chiqarish obyekti",

    // Quick links
    ql_catalog: "Katalog",
    ql_catalog_detail: "Mahsulotlar va hujjatlar",
    ql_leaders: "Rahbariyat",
    ql_leaders_detail: "Muassasa mas'ullari",
    ql_elonlar: "E'lonlar",
    ql_elonlar_detail: "Tanlovlar va xaridlar",
    ql_contact: "Qayta aloqa",
    ql_contact_detail: "Manzil va telefonlar",

    // Metrics
    metricDir: "Asosiy Yo'nalish",
    metricTask: "Klaster Vazifasi",
    metricContact: "Aloqa Kanallari",
    metricControl: "To'liq Nazorat",

    // Home sections
    modelFallback: "Klaster Modeli",
    modelTitleFallback: "Loyihadan tayyor konstruksiyagacha yagona boshqaruv",
    capEyebrowFallback: "Yo'nalishlar",
    capTitleFallback: "Ko'prik infratuzilmasi uchun asosiy xizmat bloklari",
    capDesc: "Muassasa tomonidan amalga oshiriladigan yuqori aniqlikdagi texnik va muhandislik xizmatlari yo'nalishi.",
    capabilities: ["Loyihalash", "Temir-beton qurilmalarini ishlab chiqarish", "Ta'mirlash va tiklash", "Diagnostika ishlari"],
    workflowEyebrowFallback: "Ish Oqimi",
    workflowTitleFallback: "Texnik qarordan amaliy natijagacha",
    workflowSteps: ["Diagnostika", "Loyihalash", "Ishlab chiqarish", "Ekspluatatsiya"],
    workflowStepDesc: "Ko'prik va sun'iy inshootlar bo'yicha ketma-ketlik va sifat nazorati bosqichi.",
    tasksEyebrowFallback: "Vazifalar",
    tasksTitleFallback: "Klaster bajaradigan asosiy ishlar",
    operationalTasks: "Operatsion Vazifalar",
    tasksCount: (n) => `${n} ta faoliyat yo'nalishi`,
    institutionProcess: "Muassasa Jarayoni",
    institutionProcessDesc: "Diagnostika, ishlab chiqarish, tiklash va texnik soz holatda saqlash ishlari bitta operatsion tizimda birlashadi.",
    tasksList: [
      "avtomobil yo‘llarida qurish, qayta qurish, ta’mirlash va saqlash ishlarini amalga oshirish;",
      "ko‘prik va sun’iy inshootlarni muntazam ravishda shartnoma asosida diagnostika qilish, pasportlashtirish va texnik ko‘rikdan o‘tkazib borish;",
      "diagnostika qilish natijalariga asosan aniqlanadigan avariya holatidagi ta’mirtalab ko‘prik va sun’iy inshootlarni loyihalashtirish, ta’mirlash va tiklash ishlarini amalga oshirish;",
      "ko‘prik va sun’iy inshootlarni ta’mirlash hamda tiklash uchun zarur bo‘ladigan materiallarni, jumladan temir-beton qurilmalari va jihozlarni ishlab chiqarish;",
      "umumiy foydalanishdagi avtomobil yo‘llarida joylashgan ko‘prik va sun’iy inshootlarni texnik soz holatda saqlash;",
      "zamonaviy texnika va texnologiyalarni qo‘llash orqali raqobatbardosh, sifatli mahsulotlar ishlab chiqarish va yetkazib berish;",
      "temir-beton, tovar-beton va noruda mahsulotlarini ishlab chiqarish va sotish;",
      "avtotransport, temir yo‘l transporti va boshqa transport vositalari bilan yuk tashish xizmatlarini ko‘rsatish;",
      "o‘zi ishlab chiqargan mahsulotlarni o‘zaro tuzilgan shartnomalar asosida mulkchilik shaklidan qat’iy nazar korxona, tashkilotlarga va fuqarolarga sotish;",
      "temir yo‘l xizmatlarini, shu jumladan temir yo‘l yuk hovlisi xizmatlarini ko‘rsatish;",
      "avtomobil transportida yo‘lovchi tashish;",
      "noruda mahsulotlarini qazib olish, qayta ishlash va sotish;"
    ],

    // Labels
    pageLabel: "Sahifa",
    aboutLabel: "Korxona haqida",
    zavodLabel: "Zavod va Texnologiyalar",
    announcementLabel: "Tanlov Savdolari",
    contactLabel: "Qayta Aloqa",
    infoLabel: "Ma'lumot",
    branchesLabel: "Hududiy Tarmoq",

    // Status page
    noInfo: "Ma'lumot mavjud emas.",
    downloadDoc: "Hujjatni yuklab olish",

    // Leaders
    bornLabel: "Tug'ilgan sanasi va joyi:",
    educationLabel: "Tamomlagan:",
    noData: "Ma'lumot kiritilmagan",

    // Contact page
    contactTitle: "Bog'lanish va Manzil",
    phones: "Telefon raqamlar",
    email: "E-pochtamiz",
    workHours: "Ish vaqti",
    bankDetails: "Hisob-raqam",
    address: "Joylashuv manzili",
    mapTitle: "O'zyo'lko'prik xaritada",

    // Announcement
    emailLabel: "Tijorat takliflarini yuborish uchun e-pochta:",
    announcementIntro: "“O‘zyo‘lko‘prik klaster” DM quyidagi uskunalar yetkazib berish bo‘yicha tanlov savdolarini e’lon qiladi:",
    announcementItems: [
      "Kozlovoy kran KS-100 t – 2 dona",
      "Ko'prikli kran 20/5 t – 2 dona",
      "Ko'prikli kran 10 t – 2 dona",
      "Beton qorgich BSU-60 m3/soat – 1 dona",
      "Armatura to'g'rilash va kesish uskunasi – 2 dona",
      "Avtomatik armatura bukuvchi uskuna – 2 dona"
    ],

    // Footer
    footerContact: "Aloqa sahifasi",

    // Price / Catalog
    noProducts: "Hozircha hech qanday mahsulot yoki xizmat kiritilmagan.",
    viewDetails: "Batafsil ko'rish",
    downloadFile: "Faylni yuklab olish",
    downloadBtn: "Yuklab olish",
    fileAvailable: "Fayl bor",
    moreInfo: "Batafsil ma'lumot",
    catalogDocs: "Katalog hujjatlari",
    catalogDefaultDesc: "O'zyo'lko'prik klasteri rasmiy zavod mahsulotlari, ko'prik va temir-beton konstruksiyalari katalogi.",
    nomDefaultDesc: "O'zyo'lko'prik klasteri rasmiy zavod mahsulotlari va buyumlari nomenklaturasi.",

    // Filiallar
    filiallarTitle: "Filiallar",
    branchesHeading: "Hududiy Filiallar va Bazalar",
    searchBranch: "Filial, rahbariyat yoki hudud bo'yicha qidiruv...",
    directorLabel: "Filial Rahbari (Direktor)",
    detailsBtn: "Batafsil ma'lumotlarni ko'rish",
    branchAddress: "Manzil:",
    branchPhone: "Telefon raqami:",
    branchTasks: "Asosiy faoliyati (Vazifalar)",
    branchFile: "Ilova fayl:",
    branchFileBtn: "Faylni yuklab olish",
    branchOrder: "Tartib:",
    branchActive: "Holat:",
    activeYes: "Faol",
    activeNo: "Nofaol",
    branchDesc: "Filial haqida:",
  },

  ru: {
    // System & Brand
    loading: "Загрузка данных сайта...",
    backendCheck: "Проверьте работу сервера: http://127.0.0.1:8000",
    pageNotFound: "Страница не найдена",
    legalSmall: "государственное учреждение кластера",
    brandName: "«Узйулкуприк»",
    brandLegalName: "Государственное учреждение кластера «Узйулкуприк»",
    heroTagline: "Проектирование, производство, ремонт и диагностика мостов и искусственных сооружений",
    heroIntro: "Государственное учреждение, созданное на основании постановления Президента Республики Узбекистан №330, осуществляет все виды работ по мостостроению по всей Республике.",
    homePurpose: "Цель кластера – реализация цикла «проектирование – восстановление – эксплуатация» для ремонта и поддержания в технически исправном состоянии мостов и искусственных сооружений на автомобильных дорогах.",
    contactHours: "с 09:00 до 18:00",
    bankText: "Национальный банк ВЭД Республики Узбекистан, Бектемирский филиал, БИК 00450, ИНН 200 836 188",
    addressText: "г. Ташкент, Яшнабадский район, сходы граждан Урта Масжид, ул. Оханграбо, д. 12, 100146",
    statusUnderDev: "На стадии разработки.",

    // Navigation items
    nav: {
      "bosh-sahifa": "Главная",
      "korxona-haqida": "О предприятии",
      "korxona-ustavi": "Устав предприятия",
      "tashkiliy-tuzilma": "Организационная структура",
      "rahbariyat": "Руководство",
      "zavod-haqida": "О заводе",
      "katalog": "Каталог",
      "mahsulotlar-katalogi": "Каталог продукции",
      "nomenklatura": "Номенклатура",
      "narx-navo": "Прайс-лист",
      "bosh-ish-orinlari": "Вакансии",
      "filiallar": "Филиалы",
      "elonlar": "Объявления",
      "qayta-aloqa": "Обратная связь",
      "mulkchilik-shakli": "Форма собственности",
      "vazifalar": "Задачи",
    },

    // Header
    contact: "Связь",
    searchTitle: "Поиск по сайту",
    searchPlaceholder: "Введите название страницы или ключевое слово...",
    searchPageLabel: "Страница сайта",

    // Hero
    heroKicker: "Республиканская Мостовая Инфраструктура",
    heroBtn1: "Посмотреть каталог",
    heroBtn2: "Связаться",
    heroBadge: "Единая Кластерная Модель",
    heroProcess: "Проектирование → Производство → Эксплуатация",
    heroImgAlt: "Мост и производственный объект",

    // Quick links
    ql_catalog: "Каталог",
    ql_catalog_detail: "Продукция и документы",
    ql_leaders: "Руководство",
    ql_leaders_detail: "Ответственные лица",
    ql_elonlar: "Объявления",
    ql_elonlar_detail: "Тендеры и закупки",
    ql_contact: "Обратная связь",
    ql_contact_detail: "Адрес и телефоны",

    // Metrics
    metricDir: "Основное Направление",
    metricTask: "Задача Кластера",
    metricContact: "Каналы Связи",
    metricControl: "Полный Контроль",

    // Home sections
    modelFallback: "Модель Кластера",
    modelTitleFallback: "Единое управление от проекта до готовой конструкции",
    capEyebrowFallback: "Направления",
    capTitleFallback: "Основные блоки услуг для мостовой инфраструктуры",
    capDesc: "Направление высокоточных технических и инженерных услуг, реализуемых учреждением.",
    capabilities: ["Проектирование", "Производство железобетонных конструкций", "Ремонт и восстановление", "Диагностические работы"],
    workflowEyebrowFallback: "Рабочий Процесс",
    workflowTitleFallback: "От технического решения к практическому результату",
    workflowSteps: ["Диагностика", "Проектирование", "Производство", "Эксплуатация"],
    workflowStepDesc: "Этап последовательного контроля качества по мостам и искусственным сооружениям.",
    tasksEyebrowFallback: "Задачи",
    tasksTitleFallback: "Основные работы, выполняемые кластером",
    operationalTasks: "Операционные Задачи",
    tasksCount: (n) => `${n} направлений деятельности`,
    institutionProcess: "Процесс Учреждения",
    institutionProcessDesc: "Диагностика, производство, восстановление и техническое обслуживание объединены в одной операционной системе.",
    tasksList: [
      "Строительство, реконструкция, ремонт и содержание автомобильных дорог;",
      "Регулярная договорная диагностика, паспортизация и технический осмотр мостов и искусственных сооружений;",
      "Проектирование, ремонт и восстановление аварийных мостов и сооружений, выявленных в ходе диагностики;",
      "Производство материалов, включая железобетонные конструкции и оборудование, для ремонта и восстановления;",
      "Поддержание в технически исправном состоянии мостов и искусственных сооружений общего пользования;",
      "Производство и поставка конкурентоспособной, качественной продукции с применением передовых технологий;",
      "Производство и реализация железобетонных изделий, товарного бетона и нерудных материалов;",
      "Оказание услуг грузоперевозок автомобильным, железнодорожным и иными видами транспорта;",
      "Реализация собственной продукции предприятиям, организациям и гражданам независимо от формы собственности;",
      "Предоставление железнодорожных услуг, включая обслуживание грузового двора;",
      "Пассажирские перевозки автомобильным транспортом;",
      "Добыча, переработка и реализация нерудных полезных ископаемых;"
    ],

    // Labels
    pageLabel: "Страница",
    aboutLabel: "О предприятии",
    zavodLabel: "Завод и Технологии",
    announcementLabel: "Тендерные Торги",
    contactLabel: "Обратная Связь",
    infoLabel: "Информация",
    branchesLabel: "Региональная Сеть",

    // Status page
    noInfo: "Информация отсутствует.",
    downloadDoc: "Скачать документ",

    // Leaders
    bornLabel: "Дата и место рождения:",
    educationLabel: "Образование:",
    noData: "Данные не введены",

    // Contact page
    contactTitle: "Связь и Адрес",
    phones: "Телефоны",
    email: "Электронная почта",
    workHours: "Рабочее время",
    bankDetails: "Банковские реквизиты",
    address: "Адрес расположения",
    mapTitle: "«Узйулкуприк» на карте",

    // Announcement
    emailLabel: "Электронная почта для коммерческих предложений:",
    announcementIntro: "ГУ «Узйулкуприк кластер» объявляет конкурсные торги на поставку следующего оборудования:",
    announcementItems: [
      "Кран козловой КС-100 т – 2 шт",
      "Кран мостовой 20/5 т – 2 шт",
      "Кран мостовой 10 т – 2 шт",
      "Бетоносмесительная установка БСУ-60 м3/час – 1 шт",
      "Станок для правки и резки арматуры – 2 шт",
      "Автоматический станок для гибки арматуры – 2 шт"
    ],

    // Footer
    footerContact: "Страница контактов",

    // Price / Catalog
    noProducts: "Продукты или услуги пока не добавлены.",
    viewDetails: "Подробнее",
    downloadFile: "Скачать файл",
    downloadBtn: "Скачать",
    fileAvailable: "Файл есть",
    moreInfo: "Подробная информация",
    catalogDocs: "Документы каталога",
    catalogDefaultDesc: "Официальный каталог продукции завода кластера O'zyo'lko'prik: мостовые и железобетонные конструкции.",
    nomDefaultDesc: "Официальная номенклатура продукции и изделий завода кластера O'zyo'lko'prik.",

    // Filiallar
    filiallarTitle: "Филиалы",
    branchesHeading: "Региональные Филиалы и Базы",
    searchBranch: "Поиск по филиалу, руководителю или региону...",
    directorLabel: "Руководитель Филиала (Директор)",
    detailsBtn: "Подробная информация",
    branchAddress: "Адрес:",
    branchPhone: "Телефон:",
    branchTasks: "Основная деятельность (Задачи)",
    branchFile: "Прикреплённый файл:",
    branchFileBtn: "Скачать файл",
    branchOrder: "Порядок:",
    branchActive: "Статус:",
    activeYes: "Активен",
    activeNo: "Неактивен",
    branchDesc: "О филиале:",
  },

  en: {
    // System & Brand
    loading: "Loading site data...",
    backendCheck: "Check that backend is running: http://127.0.0.1:8000",
    pageNotFound: "Page not found",
    legalSmall: "state cluster institution",
    brandName: "“Uzyolkorpik”",
    brandLegalName: "State Institution of “Uzyolkorpik” Cluster",
    heroTagline: "Design, production, repair and diagnostics for bridges and artificial structures",
    heroIntro: "A state institution established under Resolution No. 330 of the President of the Republic of Uzbekistan, performing all works related to bridge construction across the Republic.",
    homePurpose: "The goal of the cluster is to implement the 'design – restoration – operation' cycle for repairing and maintaining bridges and artificial structures on highways in good technical condition.",
    contactHours: "09:00 to 18:00",
    bankText: "National Bank for Foreign Economic Activity of Uzbekistan, Bektemir branch, BIC 00450, TIN 200 836 188",
    addressText: "12 Ohangrabo Street, Orta Masjid MFC, Yashnabad District, Tashkent 100146",
    statusUnderDev: "Under development.",

    // Navigation items
    nav: {
      "bosh-sahifa": "Home",
      "korxona-haqida": "About Enterprise",
      "korxona-ustavi": "Enterprise Charter",
      "tashkiliy-tuzilma": "Organizational Structure",
      "rahbariyat": "Management",
      "zavod-haqida": "About Plant",
      "katalog": "Catalog",
      "mahsulotlar-katalogi": "Products Catalog",
      "nomenklatura": "Nomenclature",
      "narx-navo": "Price List",
      "bosh-ish-orinlari": "Vacancies",
      "filiallar": "Branches",
      "elonlar": "Announcements",
      "qayta-aloqa": "Contact",
      "mulkchilik-shakli": "Ownership Form",
      "vazifalar": "Tasks",
    },

    // Header
    contact: "Contact",
    searchTitle: "Search the site",
    searchPlaceholder: "Enter page name or keyword...",
    searchPageLabel: "Site page",

    // Hero
    heroKicker: "Republic Bridge Infrastructure",
    heroBtn1: "View catalog",
    heroBtn2: "Get in touch",
    heroBadge: "Single Cluster Model",
    heroProcess: "Design → Production → Operation",
    heroImgAlt: "Bridge and production facility",

    // Quick links
    ql_catalog: "Catalog",
    ql_catalog_detail: "Products and documents",
    ql_leaders: "Management",
    ql_leaders_detail: "Institution officials",
    ql_elonlar: "Announcements",
    ql_elonlar_detail: "Tenders and purchases",
    ql_contact: "Contact us",
    ql_contact_detail: "Address and phones",

    // Metrics
    metricDir: "Core Directions",
    metricTask: "Cluster Tasks",
    metricContact: "Contact Channels",
    metricControl: "Full Control",

    // Home sections
    modelFallback: "Cluster Model",
    modelTitleFallback: "Single management from project to finished structure",
    capEyebrowFallback: "Directions",
    capTitleFallback: "Core service blocks for bridge infrastructure",
    capDesc: "High-precision technical and engineering service direction implemented by the institution.",
    capabilities: ["Engineering & Design", "Reinforced Concrete Production", "Repair & Restoration", "Diagnostics & Inspection"],
    workflowEyebrowFallback: "Workflow",
    workflowTitleFallback: "From technical decision to practical result",
    workflowSteps: ["Diagnostics", "Design", "Production", "Operation"],
    workflowStepDesc: "Quality control and sequencing stage for bridges and artificial structures.",
    tasksEyebrowFallback: "Tasks",
    tasksTitleFallback: "Key activities performed by the cluster",
    operationalTasks: "Operational Tasks",
    tasksCount: (n) => `${n} activity directions`,
    institutionProcess: "Institution Process",
    institutionProcessDesc: "Diagnostics, production, restoration and maintenance are unified in one operational system.",
    tasksList: [
      "Construction, reconstruction, repair, and maintenance of highways and roads;",
      "Regular contractual diagnostics, passportization, and technical inspection of bridges and artificial structures;",
      "Design, repair, and restoration of emergency bridges and structures identified through diagnostics;",
      "Production of materials, including reinforced concrete structures and equipment needed for repair and restoration;",
      "Maintaining bridges and artificial structures on public roads in good technical condition;",
      "Production and supply of competitive, high-quality products using advanced technologies;",
      "Production and sale of reinforced concrete items, ready-mix concrete, and non-metallic materials;",
      "Freight transportation services by road, rail, and other transport modes;",
      "Sale of manufactured products to enterprises, organizations, and citizens regardless of ownership form;",
      "Provision of railway services, including freight yard operations;",
      "Passenger transportation by motor vehicles;",
      "Extraction, processing, and sale of non-metallic mineral resources;"
    ],

    // Labels
    pageLabel: "Page",
    aboutLabel: "About the Company",
    zavodLabel: "Plant and Technologies",
    announcementLabel: "Tender Sales",
    contactLabel: "Contact",
    infoLabel: "Information",
    branchesLabel: "Regional Network",

    // Status page
    noInfo: "No information available.",
    downloadDoc: "Download document",

    // Leaders
    bornLabel: "Date and place of birth:",
    educationLabel: "Education:",
    noData: "No data entered",

    // Contact page
    contactTitle: "Contact and Address",
    phones: "Phone numbers",
    email: "Our email",
    workHours: "Working hours",
    bankDetails: "Bank details",
    address: "Location address",
    mapTitle: "“Uzyolkorpik” on the map",

    // Announcement
    emailLabel: "Email for commercial proposals:",
    announcementIntro: "State Institution “Uzyolkorpik Cluster” announces an open tender for the supply of the following equipment:",
    announcementItems: [
      "Gantry crane KS-100 t – 2 pcs",
      "Overhead crane 20/5 t – 2 pcs",
      "Overhead crane 10 t – 2 pcs",
      "Concrete batching plant BSU-60 m3/h – 1 pc",
      "Rebar straightening and cutting machine – 2 pcs",
      "Automatic rebar bending machine – 2 pcs"
    ],

    // Footer
    footerContact: "Contact page",

    // Price / Catalog
    noProducts: "No products or services added yet.",
    viewDetails: "View details",
    downloadFile: "Download file",
    downloadBtn: "Download",
    fileAvailable: "File available",
    moreInfo: "Detailed information",
    catalogDocs: "Catalog documents",
    catalogDefaultDesc: "Official catalog of O'zyo'lko'prik cluster plant products: bridge and reinforced concrete structures.",
    nomDefaultDesc: "Official nomenclature of products and items of O'zyo'lko'prik cluster plant.",

    // Filiallar
    filiallarTitle: "Branches",
    branchesHeading: "Regional Branches and Bases",
    searchBranch: "Search by branch, director or region...",
    directorLabel: "Branch Director",
    detailsBtn: "View full information",
    branchAddress: "Address:",
    branchPhone: "Phone:",
    branchTasks: "Main activities (Tasks)",
    branchFile: "Attached file:",
    branchFileBtn: "Download file",
    branchOrder: "Order:",
    branchActive: "Status:",
    activeYes: "Active",
    activeNo: "Inactive",
    branchDesc: "About the branch:",
  },
};

// Helper translation functions
function getNavTitle(slug, label, t) {
  if (slug && t?.nav?.[slug]) return t.nav[slug];
  if (label) {
    const norm = label.toLowerCase().trim().replace(/['ʻʼ`]/g, "'");
    for (const [key, val] of Object.entries(t?.nav || {})) {
      if (key.toLowerCase().replace(/['ʻʼ`]/g, "'") === norm) return val;
    }
  }
  return label;
}

function translateLeaderPosition(pos, lang) {
  if (!pos || lang === "uz") return pos;
  const p = pos.toLowerCase();
  if (p.includes("bosh direktor")) {
    return lang === "ru" ? "Генеральный директор" : "General Director";
  }
  if (p.includes("bosh muhandis") || p.includes("bosh muhandisi")) {
    return lang === "ru" ? "Заместитель директора — Главный инженер" : "Deputy Director — Chief Engineer";
  }
  if (p.includes("direktor oʻrinbosari") || p.includes("direktor o'rinbosari") || p.includes("direktor urinbosari")) {
    return lang === "ru" ? "Заместитель директора" : "Deputy Director";
  }
  return pos;
}

function translateLeaderDetail(text, lang) {
  if (!text || lang === "uz") return text;
  let res = text;
  if (lang === "ru") {
    res = res
      .replace(/viloyati/gi, "область")
      .replace(/shaxri|shahri/gi, "г.")
      .replace(/tumani/gi, "район")
      .replace(/Toshkent avtomobil yo'llari instituti/gi, "Ташкентский автодорожный институт")
      .replace(/Toshkent Politexnika instituti/gi, "Ташкентский политехнический институт")
      .replace(/Namangan muhandislik-qurilish instituti/gi, "Наманганский инженерно-строительный институт")
      .replace(/Toshkent iqtisodiyot universiteti/gi, "Ташкентский государственный экономический университет");
  } else if (lang === "en") {
    res = res
      .replace(/viloyati/gi, "region")
      .replace(/shaxri|shahri/gi, "city")
      .replace(/tumani/gi, "district")
      .replace(/Toshkent avtomobil yo'llari instituti/gi, "Tashkent Automobile and Road Institute")
      .replace(/Toshkent Politexnika instituti/gi, "Tashkent Polytechnic Institute")
      .replace(/Namangan muhandislik-qurilish instituti/gi, "Namangan Civil Engineering Institute")
      .replace(/Toshkent iqtisodiyot universiteti/gi, "Tashkent State University of Economics");
  }
  return res;
}

// Pristine Default High-Tech Bridge Plant & Concrete Cluster Asset
const DEFAULT_ASSETS = {
  logo: "/logo.png",

  hero: "/plant_hero.png",
  plant: "/plant_hero.png",
  contact: "/plant_hero.png",

  leaders: [
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none"><rect width="400" height="400" fill="%230E1726"/><circle cx="200" cy="140" r="60" fill="%2306B6D4" opacity="0.4"/><path d="M100 340 C 100 240, 300 240, 300 340" fill="%230F766E" opacity="0.6"/><text x="200" y="380" fill="%23F8FAFC" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">Raxbar</text></svg>`,
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none"><rect width="400" height="400" fill="%230E1726"/><circle cx="200" cy="140" r="60" fill="%23F59E0B" opacity="0.4"/><path d="M100 340 C 100 240, 300 240, 300 340" fill="%233B82F6" opacity="0.6"/><text x="200" y="380" fill="%23F8FAFC" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">Bosh Muhandis</text></svg>`,
  ],
};

function App() {
  const [site, setSite] = useState(null);
  const [loadError, setLoadError] = useState("");
  const getInitialSlug = () => {
    const hash = window.location.hash.replace("#", "");
    return hash || "bosh-sahifa";
  };
  const [activeSlug, setActiveSlug] = useState(getInitialSlug);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Theme: dark (default) | light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("uz_theme") || "dark";
  });

  // Language: uz (default) | ru | en
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("uz_lang") || "uz";
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("uz_theme", theme);
  }, [theme]);

  // Apply lang to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("uz_lang", lang);
  }, [lang]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const changeLang = (newLang) => setLang(newLang);

  useEffect(() => {
    fetchSite()
      .then((data) => {
        setSite(data);
        setLoadError("");
      })
      .catch((error) => {
        setSite(null);
        setLoadError(error.message || "Sayt ma'lumotlarini yuklab bo'lmadi");
      });

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveSlug(hash || "bosh-sahifa");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const activePage = useMemo(() => {
    if (!site) return null;
    return site.pages.find((page) => page.slug === activeSlug) || site.pages[0];
  }, [site, activeSlug]);

  if (!site) {
    return (
      <main className="loading-screen">
        <div className="loading-mark">OʻY</div>
        {loadError ? (
          <div style={{ maxWidth: 480 }}>
            <p style={{ color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>{loadError}</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.backendCheck}</p>
          </div>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>{t.loading}</p>
        )}
      </main>
    );
  }

  const navigate = (slug) => {
    window.location.hash = slug === "bosh-sahifa" ? "" : slug;
    setActiveSlug(slug);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        site={site}
        activeSlug={activeSlug}
        onNavigate={navigate}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onOpenSearch={() => setSearchOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onChangeLang={changeLang}
        t={t}
      />
      <main>
        <PageRenderer page={activePage} site={site} onNavigate={navigate} t={t} lang={lang} />
      </main>
      <Footer site={site} onNavigate={navigate} t={t} />

      {searchOpen && (
        <SearchModal site={site} onClose={() => setSearchOpen(false)} onNavigate={navigate} t={t} />
      )}
    </>
  );
}

function Header({ site, activeSlug, onNavigate, menuOpen, setMenuOpen, onOpenSearch, theme, onToggleTheme, lang, onChangeLang, t }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const closeAll = () => {
      setOpenDropdown(null);
      setLangMenuOpen(false);
    };
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  const navigate = (slug) => {
    setOpenDropdown(null);
    onNavigate(slug);
  };

  const logoSrc = "/logo.png";

  const langLabels = { uz: "O'Z", ru: "RU", en: "EN" };
  const allLangs = ["uz", "ru", "en"];

  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="top-strip-info">
          <span className="top-strip-item">
            <Building2 size={14} />
            {t.brandLegalName || site.brand.legalName}
          </span>
          <span className="top-strip-item">
            <Clock3 size={14} />
            {t.contactHours || site.contact.hours}
          </span>
        </div>
        <div className="top-strip-info">
          <a href={`mailto:${site.contact.email}`} className="top-strip-item">
            <Mail size={14} />
            {site.contact.email}
          </a>
        </div>
      </div>

      <div className="nav-wrap">
        <button className="brand-button" onClick={() => onNavigate("bosh-sahifa")}>
          <img
            src={logoSrc}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_ASSETS.logo;
            }}
            alt="Oʻzyoʻlkoʻprik logotipi"
            style={{ borderRadius: "50%", background: theme === "light" ? "rgba(0,0,0,0.06)" : "transparent" }}
          />
          <div className="brand-text">
            <strong>{t.brandName || site.brand.name}</strong>
            <small>{t.legalSmall}</small>
          </div>
        </button>

        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Asosiy menyu">
          {site.navigation.map((item) => (
            <NavItem
              key={item.slug || item.label}
              item={item}
              activeSlug={activeSlug}
              onNavigate={navigate}
              isOpen={openDropdown === item.slug}
              onToggle={(event) => {
                event.stopPropagation();
                setOpenDropdown(openDropdown === item.slug ? null : item.slug);
              }}
              t={t}
            />
          ))}
        </nav>

        <div className="header-actions">
          {/* Language Switcher */}
          <div
            className="lang-switcher"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lang-switcher-btn"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              aria-label="Tilni tanlang"
              title="Tilni o'zgartirish"
            >
              <Languages size={15} />
              <span>{langLabels[lang]}</span>
            </button>
            {langMenuOpen && (
              <div className="lang-dropdown">
                {allLangs.map((l) => (
                  <button
                    key={l}
                    className={lang === l ? "lang-option active" : "lang-option"}
                    onClick={() => {
                      onChangeLang(l);
                      setLangMenuOpen(false);
                    }}
                  >
                    {langLabels[l]}
                    {lang === l && <span className="lang-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Light rejimga o'tish" : "Dark rejimga o'tish"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Search */}
          <button className="icon-button" aria-label="Qidiruv" onClick={onOpenSearch}>
            <Search size={18} />
          </button>

          <button className="contact-button" onClick={() => navigate("qayta-aloqa")}>
            <Phone size={16} />
            <span>{t.contact}</span>
          </button>
          <button
            className="menu-button"
            aria-label="Menyuni ochish"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function NavItem({ item, activeSlug, onNavigate, isOpen, onToggle, t }) {
  const childActive = item.children?.some((child) => child.slug === activeSlug);
  const hasChildren = Boolean(item.children?.length);

  const handleClick = (event) => {
    if (hasChildren) {
      onToggle(event);
      return;
    }
    onNavigate(item.slug);
  };

  return (
    <div className={isOpen ? "nav-item is-open" : "nav-item"}>
      <button
        className={activeSlug === item.slug || childActive ? "nav-link active" : "nav-link"}
        onClick={handleClick}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        {getNavTitle(item.slug, item.label, t)}
        {hasChildren && <ChevronDown size={14} />}
      </button>
      {hasChildren && isOpen && (
        <div className="nav-dropdown" onClick={(event) => event.stopPropagation()}>
          {item.children.map((child) => (
            <button key={child.slug} onClick={() => onNavigate(child.slug)}>
              {getNavTitle(child.slug, child.label, t)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchModal({ site, onClose, onNavigate, t }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return site.pages;
    const q = query.toLowerCase();
    return site.pages.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        getNavTitle(p.slug, p.title, t)?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.status?.toLowerCase().includes(q)
    );
  }, [site, query, t]);

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h3 style={{ fontSize: 18 }}>{t?.searchTitle || "Qidiruv"}</h3>
          <button onClick={onClose} className="icon-button">
            <X size={18} />
          </button>
        </div>

        <div className="search-input-wrap">
          <Search size={20} />
          <input
            type="text"
            className="search-input"
            placeholder={t?.searchPlaceholder || "Kalit so'z kiriting..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="search-results">
          {results.map((page) => (
            <button
              key={page.slug}
              className="search-result-item"
              onClick={() => {
                onNavigate(page.slug);
                onClose();
              }}
            >
              <div>
                <strong style={{ display: "block" }}>{getNavTitle(page.slug, page.title, t)}</strong>
                <small style={{ color: "var(--text-muted)" }}>{page.status || t?.searchPageLabel || "Sayt sahifasi"}</small>
              </div>
              <ArrowRight size={16} style={{ color: "var(--accent-cyan)" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageRenderer({ page, site, onNavigate, t, lang }) {
  if (!page) {
    return (
      <section className="page-shell">
        <div className="glass-panel" style={{ padding: 48, textAlign: "center" }}>
          <Sparkles size={40} style={{ color: "#06b6d4", marginBottom: 16 }} />
          <h2>{t.pageNotFound}</h2>
        </div>
      </section>
    );
  }

  if (page.type === "home") return <Home site={site} onNavigate={onNavigate} t={t} />;
  if (page.type === "leaders") return <Leaders page={page} site={site} t={t} lang={lang} />;
  if (page.type === "document") return <DocumentPage page={page} site={site} t={t} />;
  if (page.type === "announcement") return <Announcement page={page} t={t} />;
  if (page.type === "contact") return <Contact site={site} t={t} lang={lang} />;
  if (page.slug === "narx-navo") return <PriceGridPage page={page} site={site} t={t} />;
  if (page.type === "filiallar" || page.slug === "filiallar") return <FiliallarPage page={page} site={site} t={t} />;
  return <StatusPage page={page} site={site} t={t} />;
}

function Home({ site, onNavigate, t }) {
  const quickLinks = [
    { label: t.ql_catalog, slug: "katalog", detail: t.ql_catalog_detail },
    { label: t.ql_leaders, slug: "rahbariyat", detail: t.ql_leaders_detail },
    { label: t.ql_elonlar, slug: "elonlar", detail: t.ql_elonlar_detail },
    { label: t.ql_contact, slug: "qayta-aloqa", detail: t.ql_contact_detail },
  ];

  const heroSrc = site?.assets?.hero || DEFAULT_ASSETS.hero;
  const plantSrc = site?.assets?.plant || DEFAULT_ASSETS.plant;

  const currentCapabilities = t.capabilities || site.home.capabilities;
  const currentTasks = t.tasksList || site.home.tasks;

  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-kicker">
              <ShieldCheck size={16} />
              {t.heroKicker}
            </div>
            <h1 className="hero-title">{t.brandLegalName || site.brand.legalName}</h1>
            <div className="hero-tagline">{t.heroTagline || site.brand.tagline}</div>
            <p className="hero-lead">{t.heroIntro || site.home.intro}</p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => onNavigate("katalog")}>
                <span>{t.heroBtn1}</span>
                <MoveRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => onNavigate("qayta-aloqa")}>
                {t.heroBtn2}
              </button>
            </div>
          </div>

          <div className="hero-card">
            <img
              src={heroSrc}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_ASSETS.hero;
              }}
              alt={t.heroImgAlt}
            />
            <div className="hero-card-overlay">
              <div className="hero-card-badge">
                <Layers size={14} />
                {t.heroBadge}
              </div>
              <h3>{t.heroProcess}</h3>
            </div>
          </div>
        </div>

        <div className="quick-access-strip">
          {quickLinks.map((link) => (
            <button
              key={link.slug}
              className="quick-link-card"
              onClick={() => onNavigate(link.slug)}
            >
              <div className="quick-link-content">
                <strong>{link.label}</strong>
                <small>{link.detail}</small>
              </div>
              <div className="quick-link-icon">
                <ArrowRight size={18} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="metrics-band">
        <div className="metric-item">
          <div className="metric-number">{currentCapabilities.length}</div>
          <div className="metric-label">{t.metricDir}</div>
        </div>
        <div className="metric-item">
          <div className="metric-number">{currentTasks.length}</div>
          <div className="metric-label">{t.metricTask}</div>
        </div>
        <div className="metric-item">
          <div className="metric-number">{site.contact.phones.length}</div>
          <div className="metric-label">{t.metricContact}</div>
        </div>
        <div className="metric-item">
          <div className="metric-number">360°</div>
          <div className="metric-label">{t.metricControl}</div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">{site.home.modelEyebrow || t.modelFallback}</span>
          <h2>{site.home.modelTitle || t.modelTitleFallback}</h2>
        </div>
        <div className="glass-panel" style={{ padding: 36, display: "grid", gap: 20 }}>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--text-muted)" }}>{t.homePurpose || site.home.purpose}</p>
          <div
            style={{
              padding: 20,
              borderRadius: 14,
              background: "rgba(6, 182, 212, 0.08)",
              border: "1px solid rgba(6, 182, 212, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Sparkles size={24} style={{ color: "#06b6d4", flexShrink: 0 }} />
            <div>
              <strong style={{ color: "var(--text-main)", display: "block" }}>{t.institutionProcess}</strong>
              <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                {t.institutionProcessDesc}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">{site.home.capabilitiesEyebrow || t.capEyebrowFallback}</span>
          <h2>{site.home.capabilitiesTitle || t.capTitleFallback}</h2>
        </div>
        <div className="capability-grid">
          {currentCapabilities.map((capability, index) => (
            <article className="capability-card" key={capability}>
              <div className="capability-top">
                <div className="capability-icon-wrap">
                  <IconForIndex index={index} />
                </div>
                <span className="capability-num">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{capability}</h3>
              <p>{t.capDesc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">{site.home.workflowEyebrow || t.workflowEyebrowFallback}</span>
          <h2>{site.home.workflowTitle || t.workflowTitleFallback}</h2>
        </div>
        <div className="process-grid">
          {t.workflowSteps.map((step, index) => (
            <article className="process-card" key={step}>
              <div className="process-step-num">{index + 1}</div>
              <h3>{step}</h3>
              <p>{t.workflowStepDesc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="task-section-grid">
          <div className="task-visual-card">
            <img
              src={plantSrc}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_ASSETS.plant;
              }}
              alt={t.operationalTasks}
            />
            <div className="task-visual-info">
              <strong>{t.operationalTasks}</strong>
              <span>{t.tasksCount(currentTasks.length)}</span>
            </div>
          </div>

          <div>
            <div className="section-heading" style={{ marginBottom: 20 }}>
              <span className="eyebrow">{site.home.tasksEyebrow || t.tasksEyebrowFallback}</span>
              <h2>{site.home.tasksTitle || t.tasksTitleFallback}</h2>
            </div>
            <div className="task-list">
              {currentTasks.map((task, index) => (
                <div className="task-row" key={task}>
                  <span className="task-row-num">{String(index + 1).padStart(2, "0")}</span>
                  <p>{task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function IconForIndex({ index }) {
  const icons = [FileText, Building2, HardHat, ShieldCheck];
  const Icon = icons[index] || CheckCircle2;
  return <Icon size={24} />;
}

function StatusPage({ page, site, t }) {
  const pageImgSrc = page.imageUrl || site?.assets?.hero || DEFAULT_ASSETS.hero;
  const statusText = page.status?.includes("Ishlab chiqish") ? t.statusUnderDev : (page.status || t.noInfo);

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page.slug, page.title, t)} label={t.pageLabel} />
      <div className="glass-panel" style={{ padding: 48, display: "grid", gap: 24 }}>
        
        {page.content ? (
          <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--text-muted)", textAlign: "left", whiteSpace: "pre-line" }}>
            {page.content}
          </p>
        ) : (
          <h2 style={{ fontSize: 24, color: "var(--text-main)", textAlign: "center" }}>{statusText}</h2>
        )}

        {page.fileUrl && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <a
              href={page.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ padding: "12px 24px", fontSize: 15 }}
              download
            >
              <span>{t.downloadDoc}</span>
              <ExternalLink size={16} />
            </a>
          </div>
        )}

        <img
          src={pageImgSrc}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_ASSETS.hero;
          }}
          alt=""
          style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 16, marginTop: 16 }}
        />
      </div>
    </section>
  );
}

function Leaders({ page, site, t, lang }) {
  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page.slug, page.title, t)} label={t.aboutLabel} />
      <div className="leaders-grid">
        {page.leaders.map((leader, idx) => {
          const leaderImg =
            site?.assets?.leaders?.[leader.imageIndex] ||
            DEFAULT_ASSETS.leaders[idx % DEFAULT_ASSETS.leaders.length];

          return (
            <article className="leader-card" key={leader.name}>
              {leader.imageIndex === null && !leaderImg ? (
                <div className="leader-placeholder">
                  <UserRound size={64} />
                </div>
              ) : (
                <img
                  src={leaderImg}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_ASSETS.leaders[idx % DEFAULT_ASSETS.leaders.length];
                  }}
                  alt={leader.name}
                />
              )}
              <div className="leader-info">
                <h2>{leader.name}</h2>
                <p className="position">{translateLeaderPosition(leader.position, lang)}</p>
                <dl>
                  <dt>{t.bornLabel}</dt>
                  <dd>{translateLeaderDetail(leader.born, lang) || t.noData}</dd>
                  <dt>{t.educationLabel}</dt>
                  <dd>{translateLeaderDetail(leader.education, lang) || t.noData}</dd>
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DocumentPage({ page, site, t }) {
  const defaultDesc = page.slug === "katalog"
    ? t.catalogDefaultDesc
    : page.slug === "nomenklatura"
      ? t.nomDefaultDesc
      : "";

  const pageDesc = page.content || defaultDesc;

  let items = [];
  if (page.fileUrl) {
    items = [
      {
        id: "page-file",
        title: getNavTitle(page.slug, page.title, t),
        fileUrl: page.fileUrl,
        embedUrl: page.fileUrl,
      }
    ];
  }

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page.slug, page.title, t)} label={t.zavodLabel} />
      <div style={{ display: "grid", gap: 32 }}>
        
        {pageDesc && (
          <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 16px auto" }}>
            <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--text-muted)" }}>
              {pageDesc}
            </p>
          </div>
        )}

        {page.imageUrl && (
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
            <img
              src={page.imageUrl}
              alt=""
              style={{ width: "100%", maxHeight: 420, objectFit: "cover" }}
            />
          </div>
        )}

        {items.map((item, index) => {
          const embed = item.embedUrl;
          const isImage = /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjpg|png|svg|webp)$/i.test(item.fileUrl);

          return (
            <div key={item.id || index} style={{ display: "grid", gap: 24 }}>
              {embed && isImage && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={embed}
                    alt={item.title}
                    style={{ width: "100%", maxHeight: 600, objectFit: "contain", borderRadius: 8 }}
                  />
                </div>
              )}

              {embed && !isImage && (
                <div className="pdf-embed-container" style={{ marginTop: 0 }}>
                  <iframe
                    src={embed}
                    className="pdf-embed-frame"
                    title={item.title}
                    allow="autoplay"
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ padding: "16px 36px", fontSize: 16 }}
                  download
                >
                  <span>{t.downloadDoc}</span>
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Announcement({ page, t }) {
  const introText = t.announcementIntro || page.intro;
  const items = t.announcementItems || page.items;

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page.slug, page.title, t)} label={t.announcementLabel} />
      <div className="announcement-box">
        <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 24 }}>{introText}</p>
        <div className="equipment-grid">
          {items.map((item) => (
            <div className="equipment-badge" key={item}>
              <Wrench size={18} style={{ color: "var(--accent-cyan)" }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="proposal-card">
          <Mail size={24} style={{ color: "var(--accent-cyan)" }} />
          <div>
            <span style={{ color: "var(--text-muted)", display: "block", fontSize: 13 }}>
              {t.emailLabel}
            </span>
            <a href={`mailto:${page.email}`}>{page.email}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({ site, t, lang }) {
  return (
    <section className="page-shell">
      <PageHero title={t.contactTitle} label={t.contactLabel} />
      <div className="contact-layout">
        <div className="contact-cards">
          <InfoCard icon={Phone} title={t.phones} lines={site.contact.phones} />
          <InfoCard icon={Mail} title={t.email} lines={[site.contact.email]} />
          <InfoCard icon={Clock3} title={t.workHours} lines={[t.contactHours || site.contact.hours]} />
          <InfoCard icon={BriefcaseBusiness} title={t.bankDetails} lines={[t.bankText || site.contact.bank]} />
          <InfoCard icon={MapPin} title={t.address} lines={[t.addressText || site.contact.address]} />
        </div>
        <div className="map-panel">
          <iframe
            title={t.mapTitle}
            src={`https://www.google.com/maps?q=41.251234,69.354249&output=embed&z=17&hl=${lang || "uz"}`}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, title, lines }) {
  return (
    <article className="info-card">
      <div className="info-icon-wrap">
        <Icon size={20} />
      </div>
      <div>
        <h2>{title}</h2>
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </article>
  );
}

function PageHero({ title, label }) {
  return (
    <div className="page-hero">
      <span className="eyebrow">{label}</span>
      <h1>{title}</h1>
    </div>
  );
}

function Footer({ site, onNavigate, t }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <strong>{t.brandLegalName || site.brand.legalName}</strong>
        <p>{t.heroTagline || site.brand.tagline}</p>
        <div className="footer-links">
          <a href={API_DOCS.swagger} target="_blank" rel="noreferrer">API (Swagger)</a>
          <a href={API_DOCS.redoc} target="_blank" rel="noreferrer">API (ReDoc)</a>
        </div>
      </div>
      <button className="btn-primary" onClick={() => onNavigate("qayta-aloqa")}>
        <Mail size={16} />
        <span>{t.footerContact}</span>
      </button>
    </footer>
  );
}

function PriceGridPage({ page, site, t }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCatalog, setSelectedCatalog] = useState(null);

  const products = page.narxNavoProducts || [];
  const catalogItems = page.catalogItems || [];

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page.slug, page.title, t)} label={t.infoLabel} />

      {page.content && (
        <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 32px auto" }}>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--text-muted)", whiteSpace: "pre-line" }}>
            {page.content}
          </p>
        </div>
      )}

      {products.length === 0 && catalogItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 16 }}>{t.noProducts}</p>
        </div>
      ) : null}

      {products.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, marginTop: 16 }}>
            {products.map((product) => (
              <div key={product.id} className="glass-panel price-item-card"
                onClick={() => setSelectedProduct(product)}
                style={{ padding: 0, cursor: "pointer", display: "flex", flexDirection: "column",
                  transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  border: "1px solid var(--border-dim)", borderRadius: "var(--radius-md)", overflow: "hidden", height: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.boxShadow = "var(--shadow-glow)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border-dim)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {product.imageUrl ? (
                  <div style={{ width: "100%", background: "var(--bg-surface-elevated)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, minHeight: 200, maxHeight: 260, overflow: "hidden" }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: "100%", maxHeight: 260, objectFit: "contain", display: "block" }} />
                  </div>
                ) : (
                  <div style={{ width: "100%", height: 120, flexShrink: 0, background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(99,102,241,0.15))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Package size={40} style={{ color: "var(--accent-cyan)", opacity: 0.7 }} />
                  </div>
                )}
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", lineHeight: 1.3, margin: 0 }}>{product.name}</h3>
                  {product.text && (
                    <p style={{ fontSize: 14, color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.6, margin: 0 }}>
                      {product.text}
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-cyan)", fontSize: 13, fontWeight: 600, marginTop: "auto", paddingTop: 8 }}>
                    {product.fileUrl && <FileText size={14} />}
                    <span>{t.viewDetails}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {catalogItems.length > 0 && (
        <div style={{ marginTop: products.length > 0 ? 16 : 0 }}>
          {products.length > 0 && <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-main)", marginBottom: 20 }}>{t.catalogDocs}</h2>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {catalogItems.map((item) => (
              <div key={item.id} className="glass-panel price-item-card" onClick={() => setSelectedCatalog(item)}
                style={{ padding: 24, cursor: "pointer", display: "flex", flexDirection: "column", gap: 16, transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease", border: "1px solid var(--border-dim)", borderRadius: "var(--radius-md)", height: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.boxShadow = "var(--shadow-glow)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border-dim)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <FileText size={32} style={{ color: "var(--accent-cyan)" }} />
                  {item.fileUrl && <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 12, background: "rgba(6,182,212,0.15)", color: "var(--accent-cyan)", fontWeight: 600 }}>{t.fileAvailable}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-main)", fontWeight: 600 }}>{item.title}</h3>
                  {item.description && <p style={{ fontSize: 14, color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>{item.description}</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-cyan)", fontSize: 14, fontWeight: 600, marginTop: "auto" }}>
                  <span>{t.viewDetails}</span><ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 }} onClick={() => setSelectedProduct(null)}>
          <div className="glass-panel" style={{ maxWidth: 640, width: "100%", position: "relative", animation: "fadeIn 0.2s ease-out", overflow: "hidden", borderRadius: "var(--radius-md)", maxHeight: "90vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: "absolute", top: 14, right: 14, color: "var(--text-muted)", cursor: "pointer", zIndex: 10, background: "rgba(0,0,0,0.5)", borderRadius: "50%", padding: 6, display: "flex", border: "none" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-main)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
              <X size={18} />
            </button>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {selectedProduct.imageUrl && (
                <div style={{ width: "100%", background: "var(--bg-surface-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} style={{ width: "100%", maxHeight: 380, objectFit: "contain", display: "block" }} />
                </div>
              )}
              <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-main)", margin: 0, paddingRight: 32 }}>{selectedProduct.name}</h2>
                {selectedProduct.text && (
                  <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 16 }}>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-main)", whiteSpace: "pre-line", margin: 0 }}>{selectedProduct.text}</p>
                  </div>
                )}
                {selectedProduct.fileUrl && (
                  <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 16, display: "flex", justifyContent: "center" }}>
                    <a href={selectedProduct.fileUrl} target="_blank" rel="noreferrer" className="btn-primary"
                      style={{ padding: "12px 32px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }} download>
                      <span>{t.downloadFile}</span><ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCatalog && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 }} onClick={() => setSelectedCatalog(null)}>
          <div className="glass-panel" style={{ maxWidth: 600, width: "100%", padding: 32, position: "relative", display: "grid", gap: 24, animation: "fadeIn 0.2s ease-out" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedCatalog(null)} style={{ position: "absolute", top: 20, right: 20, color: "var(--text-muted)", cursor: "pointer" }}><X size={24} /></button>
            <div>
              <span style={{ fontSize: 13, textTransform: "uppercase", color: "var(--accent-cyan)", fontWeight: 700, display: "block", marginBottom: 8 }}>{t.moreInfo}</span>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-main)", lineHeight: 1.3 }}>{selectedCatalog.title}</h2>
            </div>
            {selectedCatalog.description && (
              <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 16 }}>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-main)", whiteSpace: "pre-line" }}>{selectedCatalog.description}</p>
              </div>
            )}
            {selectedCatalog.fileUrl && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, borderTop: "1px solid var(--border-dim)", paddingTop: 20 }}>
                {selectedCatalog.fileUrl.toLowerCase().endsWith(".pdf") ? (
                  <div style={{ width: "100%", height: 350, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-dim)", marginBottom: 12 }}>
                    <iframe src={selectedCatalog.fileUrl} title={selectedCatalog.title} style={{ width: "100%", height: "100%", border: "none" }} />
                  </div>
                ) : /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjpg|png|svg|webp)$/i.test(selectedCatalog.fileUrl) ? (
                  <div style={{ width: "100%", display: "flex", justifyContent: "center", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                    <img src={selectedCatalog.fileUrl} alt={selectedCatalog.title} style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain" }} />
                  </div>
                ) : null}
                <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 8 }}>
                  <a href={selectedCatalog.fileUrl} target="_blank" rel="noreferrer" className="btn-primary"
                    style={{ padding: "12px 28px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }} download>
                    <span>{t.downloadFile}</span><ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}


function FiliallarPage({ page, site, t }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);

  const defaultBranches = [
    {
      id: 1,
      name: "Toshkent Bosh Filiali va Temir-Beton Klasteri",
      region: "Toshkent shahri va viloyati",
      director: "Raximov Anvar Olimovich",
      address: "Toshkent shahri, Yashnobod tumani, Ohangrabo koʻchasi 12-uy",
      phone: "+998 55 515 16 16",
      tasks: "Bosh boshqaruv, Temir-beton konstruksiyalar ishlab chiqarish, Diagnostika markazi",
      status: "Asosiy bazasi",
      description: "Klaster bosh boshqarmasi va temir-beton buyumlari ishlab chiqaruvchi eng yirik majmua.",
    },
    {
      id: 2,
      name: "Vodiy Hududiy Filiali (Fargʻona, Andijon, Namangan)",
      region: "Fargʻona vodiysi",
      director: "Qodirov Sardor Bahromovich",
      address: "Fargʻona shahri, Sanoat zonasi 4-daha",
      phone: "+998 73 244 12 34",
      tasks: "Koʻprik inshootlarini taʼmirlash, tovar-beton va konstruksiya taʼminoti",
      status: "Faol",
      description: "Fargʻona vodiysidagi avtomobil yoʻllari hamda koʻprik qurilishi boʻyicha masʼul hududiy filial.",
    },
    {
      id: 3,
      name: "Samarqand va Zarafshon Hududiy Filiali",
      region: "Samarqand va Jizzax viloyatlari",
      director: "Yoqubov Jasur Alisherovich",
      address: "Samarqand shahri, Dagbit koʻchasi 88-uy",
      phone: "+998 66 233 45 67",
      tasks: "Avtomobil yoʻllaridagi koʻpriklarni diagnostika va rekonstruksiya qilish",
      status: "Faol",
      description: "Samarqand va Jizzax hududidagi koʻprik va sunʼiy inshootlarni texnik soz holatda saqlash.",
    },
    {
      id: 4,
      name: "Buxoro va Navoiy Hududiy Filiali",
      region: "Buxoro va Navoiy viloyatlari",
      director: "Nazarov Bobur Shavkatovich",
      address: "Buxoro shahri, Sanoatchilar koʻchasi 15-uy",
      phone: "+998 65 221 78 90",
      tasks: "Choʻl va magistral hududlardagi sunʼiy inshootlarni saqlash va taʼmirlash",
      status: "Faol",
      description: "Choʻl hududlari hamda magistral yoʻllardagi koʻpriklar ekspluatatsiyasi.",
    },
    {
      id: 5,
      name: "Janubiy Hududiy Filiali (Qashqadaryo va Surxondaryo)",
      region: "Qashqadaryo va Surxondaryo viloyatlari",
      director: "Xoliqov Temur Rustamovich",
      address: "Qarshi shahri, Kasan yoʻli 42-uy",
      phone: "+998 75 225 33 11",
      tasks: "Togʻ va murakkab relyefli koʻpriklarni tiklash va qurilish ishlari",
      status: "Faol",
      description: "Qashqadaryo va Surxondaryo viloyatlaridagi togʻli va murakkab koʻprik obyektlari.",
    },
    {
      id: 6,
      name: "Shimoliy-Gʻarbiy Filial (Xorazm va Qoraqalpogʻiston)",
      region: "Xorazm viloyati va Qoraqalpogʻiston Resp.",
      director: "Muradov Sherzod Ilhomovich",
      address: "Urganch shahri, Al-Xorazmiy koʻchasi 102-uy",
      phone: "+998 62 228 99 00",
      tasks: "Daryo koʻpriklari va suv inshootlari texnik diagnostikasi hamda taʼmiri",
      status: "Faol",
      description: "Amudaryo va kanal koʻpriklari hamda hududiy temir-beton inshootlari taʼminoti.",
    },
  ];

  const branches = page?.branches && page.branches.length > 0 ? page.branches : defaultBranches;

  const filteredBranches = branches.filter(
    (b) =>
      (b.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.region || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.director || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageDesc =
    page?.content ||
    page?.status ||
    "Respublika boʻyicha “Oʻzyoʻlkoʻprik” klasteri hududiy filiallari va ishlab chiqarish bazalari.";

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page?.slug, page?.title, t) || t.filiallarTitle} label={t.branchesLabel} />

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 32 }}>
        {/* Banner va Tavsif */}
        <div className="glass-panel" style={{ padding: 32, borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <Building2 size={32} style={{ color: "var(--accent-cyan)" }} />
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                {t.branchesHeading}
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                {pageDesc}
              </p>
            </div>
          </div>

          {/* Qidiruv input */}
          <div style={{ marginTop: 24, position: "relative", maxWidth: 500 }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder={t.searchBranch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 44px",
                borderRadius: 24,
                border: "1px solid var(--border-bright)",
                background: "var(--search-input-bg)",
                color: "var(--text-main)",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Filiallar kartalari Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="glass-panel price-item-card"
              onClick={() => setSelectedBranch(branch)}
              style={{
                padding: 24,
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                border: "1px solid var(--border-dim)",
                cursor: "pointer",
                transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "var(--border-bright)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border-dim)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Filial rasmi (agar bo'lsa) */}
              {branch.imageUrl && (
                <div style={{ width: "100%", borderRadius: 8, overflow: "hidden", maxHeight: 180 }}>
                  <img
                    src={branch.imageUrl}
                    alt={branch.name}
                    style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                  />
                </div>
              )}

              {/* Sarlavha & Holat */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", margin: 0, lineHeight: 1.4 }}>
                  {branch.name}
                </h3>
                {branch.status && (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 12,
                      background: branch.status === "Asosiy bazasi" ? "rgba(6, 182, 212, 0.2)" : "rgba(16, 185, 129, 0.15)",
                      color: branch.status === "Asosiy bazasi" ? "var(--accent-cyan)" : "#10b981",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {branch.status}
                  </span>
                )}
              </div>

              {/* Direktor ma'lumoti hamda rasmi */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(6, 182, 212, 0.08)",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                }}
              >
                {branch.directorImageUrl ? (
                  <img
                    src={branch.directorImageUrl}
                    alt={branch.director || "Direktor"}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid var(--accent-cyan)",
                      flexShrink: 0,
                      boxShadow: "0 0 10px rgba(6, 182, 212, 0.25)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "rgba(6, 182, 212, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border: "2px solid var(--accent-cyan)",
                    }}
                  >
                    <UserRound size={26} style={{ color: "var(--accent-cyan)" }} />
                  </div>
                )}
                <div>
                  <span style={{ fontSize: 11, color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 2 }}>
                    {t.directorLabel}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}>
                    {branch.director || t.noData}
                  </span>
                </div>
              </div>

              {/* Rekvizitlar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-main)" }}>
                {branch.region && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--accent-cyan)" }}>
                    <MapPin size={16} />
                    <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{branch.region}</span>
                  </div>
                )}

                {branch.address && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <Building2 size={16} style={{ color: "var(--text-muted)", marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: "var(--text-muted)" }}>{branch.address}</span>
                  </div>
                )}

                {branch.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Phone size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    <a href={`tel:${branch.phone.replace(/\s+/g, '')}`} style={{ color: "var(--accent-cyan)", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
                      {branch.phone}
                    </a>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-cyan)", fontSize: 14, fontWeight: 600, marginTop: "auto", paddingTop: 8 }}>
                <span>{t.detailsBtn}</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filial to'liq ma'lumotlari Modali ── */}
      {selectedBranch && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 24,
          }}
          onClick={() => setSelectedBranch(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: 720,
              width: "100%",
              position: "relative",
              animation: "fadeIn 0.2s ease-out",
              overflow: "hidden",
              borderRadius: "var(--radius-md)",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Yopish tugmasi */}
            <button
              onClick={() => setSelectedBranch(null)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "var(--text-main)",
                cursor: "pointer",
                zIndex: 10,
                background: "var(--bg-surface)",
                borderRadius: "50%",
                padding: 10,
                display: "flex",
                border: "1px solid var(--border-dim)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(6,182,212,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
            >
              <X size={22} />
            </button>

            <div style={{ overflowY: "auto", flex: 1 }}>
              {/* Filial Rasmi */}
              {selectedBranch.imageUrl && (
                <div style={{ width: "100%", background: "var(--bg-surface-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={selectedBranch.imageUrl}
                    alt={selectedBranch.name}
                    style={{ width: "100%", maxHeight: 350, objectFit: "cover", display: "block" }}
                  />
                </div>
              )}

              <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Sarlavha hamda status */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, padding: "4px 14px", borderRadius: 14, background: "rgba(6,182,212,0.15)", color: "var(--accent-cyan)", fontWeight: 700 }}>
                      {selectedBranch.region || "Hududiy Filial"}
                    </span>
                    {selectedBranch.status && (
                      <span style={{ fontSize: 13, padding: "4px 14px", borderRadius: 14, background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 700 }}>
                        {selectedBranch.status}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-main)", margin: 0, lineHeight: 1.3 }}>
                    {selectedBranch.name}
                  </h2>
                </div>

                {/* Rahbariyat / Direktor katta rasmli bloki */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: 24,
                    borderRadius: 16,
                    background: "var(--bg-card)",
                    border: "1px solid rgba(6, 182, 212, 0.3)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {selectedBranch.directorImageUrl ? (
                    <img
                      src={selectedBranch.directorImageUrl}
                      alt={selectedBranch.director || "Direktor"}
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid var(--accent-cyan)",
                        boxShadow: "0 0 20px rgba(6, 182, 212, 0.35)",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: "50%",
                        background: "rgba(6, 182, 212, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: "3px solid var(--accent-cyan)",
                        boxShadow: "0 0 20px rgba(6, 182, 212, 0.35)",
                      }}
                    >
                      <UserRound size={56} style={{ color: "var(--accent-cyan)" }} />
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: 12, color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 4, letterSpacing: 0.5 }}>
                      {t.directorLabel}
                    </span>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-main)", margin: 0, lineHeight: 1.3 }}>
                      {selectedBranch.director || t.noData}
                    </h3>
                  </div>
                </div>

                {/* Aloqa va Manzil */}
                <div style={{ display: "grid", gap: 16, fontSize: 15, borderTop: "1px solid var(--border-dim)", paddingTop: 20 }}>
                  {selectedBranch.address && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <Building2 size={22} style={{ color: "var(--accent-cyan)", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <strong style={{ color: "var(--text-main)", display: "block", fontSize: 14, marginBottom: 2 }}>{t.branchAddress}</strong>
                        <span style={{ color: "var(--text-muted)", fontSize: 15 }}>{selectedBranch.address}</span>
                      </div>
                    </div>
                  )}

                  {selectedBranch.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <Phone size={22} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
                      <div>
                        <strong style={{ color: "var(--text-main)", display: "block", fontSize: 14, marginBottom: 2 }}>{t.branchPhone}</strong>
                        <a href={`tel:${selectedBranch.phone.replace(/\s+/g, '')}`} style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 700, fontSize: 16 }}>
                          {selectedBranch.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filial haqida ma'lumot (Tavsif) */}
                {selectedBranch.description && (
                  <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 20 }}>
                    <h4 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", marginBottom: 10 }}>
                      {t.branchDesc}
                    </h4>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-main)", whiteSpace: "pre-line", margin: 0 }}>
                      {selectedBranch.description}
                    </p>
                  </div>
                )}

                {/* Asosiy faoliyati (Vazifalar) */}
                {selectedBranch.tasks && (
                  <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 20 }}>
                    <h4 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", marginBottom: 10 }}>
                      {t.branchTasks}
                    </h4>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-main)", whiteSpace: "pre-line", margin: 0 }}>
                      {selectedBranch.tasks}
                    </p>
                  </div>
                )}

                {/* Fayl yuklab olish (agar bor bo'lsa) */}
                {selectedBranch.fileUrl && (
                  <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 20, display: "flex", justifyContent: "center" }}>
                    <a
                      href={selectedBranch.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                      style={{ padding: "12px 32px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}
                      download
                    >
                      <span>{t.downloadDoc}</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
