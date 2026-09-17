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
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Settings,
  Shield,
  Plus,
  Pencil,
  Trash2,
  Download,
  Calendar,
  Paperclip,
  Loader2,
  Image as ImageIcon,
  Upload,
  Megaphone,
} from "lucide-react";
import {
  API_DOCS,
  fetchSite,
  loginUser,
  logoutUser,
  fetchProfile,
  getStoredToken,
  storeToken,
  clearToken,
  fetchElonlar,
  createElon,
  updateElon,
  deleteElon,
  fetchFiliallar,
  createFilial,
  updateFilial,
  deleteFilial,
  updatePage,
  fetchLeaders,
  createLeader,
  updateLeader,
  deleteLeader,
  fetchNarxNavoProducts,
  createNarxNavoProduct,
  updateNarxNavoProduct,
  deleteNarxNavoProduct,
  fetchVacancies,
  createVacancy,
  updateVacancy,
  deleteVacancy,
  fetchCatalogItems,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  updateHomeContent,
  updateContactSettings,
  updateAnnouncementSettings,
} from "./api";
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
    branchesSubtitle: "Respublika boʻyicha “Oʻzyoʻlkoʻprik” klasteri hududiy filiallari va ishlab chiqarish bazalari.",
    branchMainBase: "Asosiy bazasi",
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

    // Account
    account: "Akkaunt",
    login: "Kirish",
    logout: "Chiqish",
    username: "Login",
    password: "Parol",
    loginBtn: "Tizimga kirish",
    loginError: "Login yoki parol noto'g'ri.",
    permissions: "Ruxsatlar",
    noPermissions: "Sizga hech qanday ruxsat berilmagan.",
    accountTitle: "Shaxsiy Kabinet",
    permLabels: {
      can_edit_site_settings: "Sayt sozlamalari",
      can_edit_home_content: "Bosh sahifa kontenti",
      can_edit_leaders: "Rahbariyat",
      can_edit_announcements: "E'lonlar (Announcement)",
      can_edit_korxona_ustavi: "Korxona ustavi",
      can_edit_tashkiliy_tuzilma: "Tashkiliy tuzilma",
      can_edit_katalog: "Katalog",
      can_edit_nomenklatura: "Nomenklatura",
      can_edit_narx_navo: "Narx-navo",
      can_edit_vacancies: "Bo'sh ish o'rinlari",
      can_edit_filiallar: "Filiallar",
      can_edit_contact: "Qayta aloqa",
      can_edit_elonlar: "E'lonlar (product)",
    },
    superuserBadge: "Superuser",
    allPermissions: "Barcha ruxsatlarga ega",
    goToAdmin: "Admin panelga o'tish",

    // Elonlar CRUD
    manageAnnouncements: "E'lonlarni boshqarish paneli",
    staffCanManageNotice: "Sizga e'lonlarni qo'shish, tahrirlash va o'chirish huquqi berilgan.",
    addAnnouncement: "Yangi e'lon qo'shish",
    editAnnouncement: "E'lonni tahrirlash",
    deleteAnnouncement: "O'chirish",
    announcementTitle: "E'lon sarlavhasi",
    announcementTitlePlaceholder: "Masalan: Temir-beton konstruksiyalari yetkazib berish bo'yicha ochiq tanlov...",
    announcementText: "Batafsil matn / tavsif",
    announcementTextPlaceholder: "E'lon mazmuni, talablar, muddatlar va shartlarni yozing...",
    announcementImage: "Rasm yuklash (JPG, PNG)",
    announcementFile: "Biriktirilgan fayl / Hujjat (PDF, DOC va h.k.)",
    downloadAttachment: "Hujjatni yuklab olish",
    confirmDeleteTitle: "E'lonni o'chirish",
    confirmDeleteText: "Haqiqatan ham ushbu e'lonni o'chirmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.",
    cancel: "Bekor qilish",
    save: "Saqlash",
    saving: "Saqlanmoqda...",
    deleting: "O'chirilmoqda...",
    noAnnouncements: "Hozircha faol e'lonlar kiritilmagan.",
    removeImage: "Rasmni olib tashlash",
    removeFile: "Faylni olib tashlash",
    currentImage: "Joriy rasm:",
    currentFile: "Joriy fayl:",
    equipmentListTitle: "Xarid qilinadigan texnika va uskunalar ro'yxati:",
    allAnnouncementsHeading: "Barcha rasmiy e'lonlar",
    manageSection: "Bo'limni boshqarish",
    manageFiliallarTitle: "Filiallarni boshqarish paneli",
    manageFiliallarNotice: "Sizga filiallar ma'lumotlarini qo'shish, tahrirlash va o'chirish huquqi berilgan.",
    addFilial: "Yangi filial qo'shish",
    editFilial: "Filialni tahrirlash",
    deleteFilial: "Filialni o'chirish",
    confirmDeleteFilial: "Haqiqatan ham ushbu filialni o'chirmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.",
    editPageTitle: "Sahifani tahrirlash",
    editPageNotice: "Siz ushbu sahifa matni, rasmi va hujjatlarini o'zgartirish huquqiga egasiz.",
    editPageBtn: "Sahifani tahrirlash",
    directorPhoto: "Direktor fotosurati",
    branchPhoto: "Filial rasmi",
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
    branchesSubtitle: "Региональные филиалы и производственные базы кластера «Узйулкуприк» по всей Республике.",
    branchMainBase: "Основная база",
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

    // Account
    account: "Аккаунт",
    login: "Вход",
    logout: "Выйти",
    username: "Логин",
    password: "Пароль",
    loginBtn: "Войти в систему",
    loginError: "Неверный логин или пароль.",
    permissions: "Разрешения",
    noPermissions: "Вам не предоставлены разрешения.",
    accountTitle: "Личный Кабинет",
    permLabels: {
      can_edit_site_settings: "Настройки сайта",
      can_edit_home_content: "Контент главной страницы",
      can_edit_leaders: "Руководство",
      can_edit_announcements: "Объявления (Announcement)",
      can_edit_korxona_ustavi: "Устав предприятия",
      can_edit_tashkiliy_tuzilma: "Организационная структура",
      can_edit_katalog: "Каталог",
      can_edit_nomenklatura: "Номенклатура",
      can_edit_narx_navo: "Прайс-лист",
      can_edit_vacancies: "Вакансии",
      can_edit_filiallar: "Филиалы",
      can_edit_contact: "Обратная связь",
      can_edit_elonlar: "Объявления (product)",
    },
    superuserBadge: "Суперпользователь",
    allPermissions: "Полный доступ",
    goToAdmin: "Перейти в админ-панель",

    // Elonlar CRUD
    manageAnnouncements: "Панель управления объявлениями",
    staffCanManageNotice: "Вам предоставлены права на добавление, редактирование и удаление объявлений.",
    addAnnouncement: "Добавить объявление",
    editAnnouncement: "Редактировать объявление",
    deleteAnnouncement: "Удалить",
    announcementTitle: "Заголовок объявления",
    announcementTitlePlaceholder: "Например: Открытый конкурс на поставку железобетонных конструкций...",
    announcementText: "Подробный текст / описание",
    announcementTextPlaceholder: "Укажите содержание объявления, требования, сроки и условия...",
    announcementImage: "Загрузить изображение (JPG, PNG)",
    announcementFile: "Прикрепленный файл / документ (PDF, DOC и др.)",
    downloadAttachment: "Скачать документ",
    confirmDeleteTitle: "Удаление объявления",
    confirmDeleteText: "Вы действительно хотите удалить это объявление? Это действие необратимо.",
    cancel: "Отмена",
    save: "Сохранить",
    saving: "Сохранение...",
    deleting: "Удаление...",
    noAnnouncements: "На данный момент активных объявлений нет.",
    removeImage: "Удалить изображение",
    removeFile: "Удалить файл",
    currentImage: "Текущее изображение:",
    currentFile: "Текущий файл:",
    equipmentListTitle: "Список закупаемой техники и оборудования:",
    allAnnouncementsHeading: "Все официальные объявления",
    manageSection: "Управление разделом",
    manageFiliallarTitle: "Панель управления филиалами",
    manageFiliallarNotice: "Вам предоставлено право добавления, редактирования и удаления филиалов.",
    addFilial: "Добавить филиал",
    editFilial: "Редактировать филиал",
    deleteFilial: "Удалить филиал",
    confirmDeleteFilial: "Вы действительно хотите удалить этот филиал? Это действие необратимо.",
    editPageTitle: "Редактирование страницы",
    editPageNotice: "Вы имеете право изменять текст, изображение и документы этой страницы.",
    editPageBtn: "Редактировать страницу",
    directorPhoto: "Фото директора",
    branchPhoto: "Фото филиала",
  },

  en: {
    // System & Brand
    loading: "Loading site data...",
    backendCheck: "Check that backend is running: http://127.0.0.1:8000",
    pageNotFound: "Page not found",
    legalSmall: "state cluster institution",
    brandName: "“Uzyolkoprik”",
    brandLegalName: "State Institution of “Uzyolkoprik” Cluster",
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
    branchesSubtitle: "Regional branches and production bases of the “Uzyolkoprik” cluster across the Republic.",
    branchMainBase: "Main Base",
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

    // Account
    account: "Account",
    login: "Login",
    logout: "Logout",
    username: "Username",
    password: "Password",
    loginBtn: "Sign in",
    loginError: "Invalid username or password.",
    permissions: "Permissions",
    noPermissions: "No permissions have been granted.",
    accountTitle: "My Account",
    permLabels: {
      can_edit_site_settings: "Site Settings",
      can_edit_home_content: "Home Page Content",
      can_edit_leaders: "Management",
      can_edit_announcements: "Announcements",
      can_edit_korxona_ustavi: "Enterprise Charter",
      can_edit_tashkiliy_tuzilma: "Organizational Structure",
      can_edit_katalog: "Catalog",
      can_edit_nomenklatura: "Nomenclature",
      can_edit_narx_navo: "Price List",
      can_edit_vacancies: "Vacancies",
      can_edit_filiallar: "Branches",
      can_edit_contact: "Contact",
      can_edit_elonlar: "Announcements (products)",
    },
    superuserBadge: "Superuser",
    allPermissions: "Full access",
    goToAdmin: "Go to Admin Panel",

    // Elonlar CRUD
    manageAnnouncements: "Announcements Management Panel",
    staffCanManageNotice: "You have permissions to add, edit, and delete announcements.",
    addAnnouncement: "Add Announcement",
    editAnnouncement: "Edit Announcement",
    deleteAnnouncement: "Delete",
    announcementTitle: "Announcement Title",
    announcementTitlePlaceholder: "e.g. Open tender for the supply of reinforced concrete structures...",
    announcementText: "Detailed text / description",
    announcementTextPlaceholder: "Write the announcement content, requirements, deadlines, and terms...",
    announcementImage: "Upload image (JPG, PNG)",
    announcementFile: "Attach file / document (PDF, DOC etc.)",
    downloadAttachment: "Download document",
    confirmDeleteTitle: "Delete announcement",
    confirmDeleteText: "Are you sure you want to delete this announcement? This action cannot be undone.",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving...",
    deleting: "Deleting...",
    noAnnouncements: "No active announcements at the moment.",
    removeImage: "Remove image",
    removeFile: "Remove file",
    currentImage: "Current image:",
    currentFile: "Current file:",
    equipmentListTitle: "List of machinery and equipment to be purchased:",
    allAnnouncementsHeading: "All Official Announcements",
    manageSection: "Manage Section",
    manageFiliallarTitle: "Branches Management Panel",
    manageFiliallarNotice: "You have permission to add, edit, and delete branch information.",
    addFilial: "Add New Branch",
    editFilial: "Edit Branch",
    deleteFilial: "Delete Branch",
    confirmDeleteFilial: "Are you sure you want to delete this branch? This action cannot be undone.",
    editPageTitle: "Edit Page",
    editPageNotice: "You have permission to edit the content, image, and documents on this page.",
    editPageBtn: "Edit Page",
    directorPhoto: "Director Photo",
    branchPhoto: "Branch Photo",
  },
  zh: {
    // System & Brand
    loading: "正在加载网站数据...",
    backendCheck: "请检查后端是否正常运行：http://127.0.0.1:8000",
    pageNotFound: "页面未找到",
    legalSmall: "国家集群机构",
    brandName: "“乌兹路桥” (Uzyolkoprik)",
    brandLegalName: "“乌兹路桥”集群国家机构",
    heroTagline: "桥梁和人工构筑物的设计、生产、维修与检测诊断工程",
    heroIntro: "根据乌兹别克斯坦共和国总统第330号决议成立的国家机构，负责全共和国境内与桥梁建设相关的所有工程。",
    homePurpose: "集群的宗旨是对公路沿线的桥梁和人工构筑物实施“设计 – 恢复 – 运营”全周期作业，以保持良好的技术状态。",
    contactHours: "09:00 至 18:00",
    bankText: "乌兹别克斯坦国家对外经济银行 Bektemir 分行，联行号 00450，税号 200 836 188",
    addressText: "塔什干市雅什纳巴德区奥尔塔清真寺社区奥汉格拉博街12号 邮编100146",
    statusUnderDev: "开发中。",

    // Navigation items
    nav: {
      "bosh-sahifa": "首页",
      "korxona-haqida": "关于企业",
      "korxona-ustavi": "企业章程",
      "tashkiliy-tuzilma": "组织架构",
      "rahbariyat": "领导团队",
      "zavod-haqida": "关于工厂",
      "katalog": "产品目录",
      "mahsulotlar-katalogi": "产品目录",
      "nomenklatura": "产品品名表",
      "narx-navo": "价格表",
      "bosh-ish-orinlari": "招聘信息",
      "filiallar": "分支机构",
      "elonlar": "公告通知",
      "qayta-aloqa": "联系我们",
      "mulkchilik-shakli": "所有制形式",
      "vazifalar": "主要任务",
    },

    // Header
    contact: "联系我们",
    searchTitle: "站内搜索",
    searchPlaceholder: "请输入页面名称或关键词...",
    searchPageLabel: "网站页面",

    // Hero
    heroKicker: "国家桥梁基础设施",
    heroBtn1: "查看目录",
    heroBtn2: "取得联系",
    heroBadge: "统一集群模式",
    heroProcess: "设计 → 生产 → 运营维护",
    heroImgAlt: "桥梁与生产基地",

    // Quick links
    ql_catalog: "产品目录",
    ql_catalog_detail: "产品与技术文件",
    ql_leaders: "领导团队",
    ql_leaders_detail: "机构负责人",
    ql_elonlar: "公告通知",
    ql_elonlar_detail: "招标与采购",
    ql_contact: "联系我们",
    ql_contact_detail: "地址与联系电话",

    // Metrics
    metricDir: "核心业务方向",
    metricTask: "集群任务",
    metricContact: "联系渠道",
    metricControl: "全流程管控",

    // Home sections
    modelFallback: "集群模式",
    modelTitleFallback: "从工程设计到成品构件的一体化管理",
    capEyebrowFallback: "业务方向",
    capTitleFallback: "桥梁基础设施核心服务板块",
    capDesc: "本机构实施的高精度工程技术与施工服务方向。",
    capabilities: ["工程设计与研发", "钢筋混凝土预制生产", "维修加固与恢复", "检测诊断与鉴定"],
    workflowEyebrowFallback: "工作流程",
    workflowTitleFallback: "从技术方案到工程成果",
    workflowSteps: ["检测诊断", "工程设计", "工业生产", "运营维护"],
    workflowStepDesc: "桥梁和人工构筑物的质量控制与分步实施阶段。",
    tasksEyebrowFallback: "职能任务",
    tasksTitleFallback: "集群执行的主要业务活动",
    operationalTasks: "运营任务",
    tasksCount: (n) => `${n} 项主要活动方向`,
    institutionProcess: "机构运营流程",
    institutionProcessDesc: "检测、生产、修复和养护统一整合于一体化作业体系中。",
    tasksList: [
      "公路和道路的建设、改建、维修与养护；",
      "公路桥梁和人工构筑物的定期合同制检测诊断、编制技术护照及技术鉴定；",
      "经检测诊断确定的险情桥梁与构筑物的设计、抢修和结构加固；",
      "维修和恢复所需的各类材料、钢筋混凝土构件及设备的生产；",
      "维护公路沿线桥梁及人工构筑物处于良好技术状态；",
      "应用先进技术生产并供应具有竞争力的优质产品；",
      "生产并销售钢筋混凝土构件、商品混凝土及砂石非金属建材；",
      "提供公路、铁路等多种运输方式的货物运输服务；",
      "向各类所有制形式的企业、组织和个人销售工业产品；",
      "提供铁路专业服务及货运堆场装卸运营；",
      "客运交通车辆客运服务；",
      "开采、加工及销售非金属矿产资源；"
    ],

    // Labels
    pageLabel: "页面",
    aboutLabel: "关于企业",
    zavodLabel: "工厂与技术",
    announcementLabel: "招标采购",
    contactLabel: "联系方式",
    infoLabel: "信息中心",
    branchesLabel: "区域网络",

    // Status page
    noInfo: "暂无相关信息。",
    downloadDoc: "下载文件",

    // Leaders
    bornLabel: "出生日期与地点：",
    educationLabel: "学历背景：",
    noData: "未录入信息",

    // Contact page
    contactTitle: "联系方式与地址",
    phones: "联系电话",
    email: "电子邮箱",
    workHours: "工作时间",
    bankDetails: "银行账户信息",
    address: "办公地址",
    mapTitle: "地图上的“乌兹路桥”",

    // Announcement
    emailLabel: "商务报价接收邮箱：",
    announcementIntro: "“乌兹路桥集群”国家机构现就以下设备供应进行公开招标：",
    announcementItems: [
      "门式起重机 KS-100 吨 – 2台",
      "桥式起重机 20/5 吨 – 2台",
      "桥式起重机 10 吨 – 2台",
      "混凝土搅拌站 BSU-60 立方米/小时 – 1套",
      "钢筋调直切断机 – 2台",
      "自动数控弯箍机 – 2台"
    ],

    // Footer
    footerContact: "联系我们页面",

    // Price / Catalog
    noProducts: "暂未添加产品或服务。",
    viewDetails: "查看详情",
    downloadFile: "下载文件",
    downloadBtn: "下载",
    fileAvailable: "提供附件",
    moreInfo: "详细信息",
    catalogDocs: "目录文件",
    catalogDefaultDesc: "“乌兹路桥”集群工厂产品官方目录：桥梁及钢筋混凝土构件。",
    nomDefaultDesc: "“乌兹路桥”集群工厂产品与构件官方品名表。",

    // Filiallar
    filiallarTitle: "分支机构",
    branchesHeading: "区域分支机构与生产基地",
    branchesSubtitle: "“乌兹路桥”集群分布于全国各地的区域分支机构和生产基地。",
    branchMainBase: "核心基地",
    searchBranch: "按分支机构名称、负责人或所在地区搜索...",
    directorLabel: "分支机构负责人",
    detailsBtn: "查看完整信息",
    branchAddress: "地址：",
    branchPhone: "电话：",
    branchTasks: "主要业务活动（任务）",
    branchFile: "附件：",
    branchFileBtn: "下载附件",
    branchOrder: "序号：",
    branchActive: "状态：",
    activeYes: "正常运营",
    activeNo: "暂停",
    branchDesc: "分支机构简介：",

    // Account
    account: "个人中心",
    login: "登录",
    logout: "退出登录",
    username: "用户名",
    password: "密码",
    loginBtn: "登录系统",
    loginError: "用户名或密码不正确。",
    permissions: "权限范围",
    noPermissions: "您暂未被授予任何模块权限。",
    accountTitle: "个人管理中心",
    permLabels: {
      can_edit_site_settings: "网站设置",
      can_edit_home_content: "首页内容",
      can_edit_leaders: "领导团队",
      can_edit_announcements: "公告通知",
      can_edit_korxona_ustavi: "企业章程",
      can_edit_tashkiliy_tuzilma: "组织架构",
      can_edit_katalog: "产品目录",
      can_edit_nomenklatura: "产品品名",
      can_edit_narx_navo: "价格表",
      can_edit_vacancies: "招聘岗位",
      can_edit_filiallar: "分支机构",
      can_edit_contact: "客户咨询",
      can_edit_elonlar: "商品公告",
    },
    superuserBadge: "超级管理员",
    allPermissions: "全部管理权限",
    goToAdmin: "前往后台管理面板",

    // Elonlar CRUD
    manageAnnouncements: "公告管理面板",
    staffCanManageNotice: "您具有添加、编辑和删除公告的权限。",
    addAnnouncement: "发布新公告",
    editAnnouncement: "编辑公告",
    deleteAnnouncement: "删除",
    announcementTitle: "公告标题",
    announcementTitlePlaceholder: "例如：供应钢筋混凝土构件公开招标...",
    announcementText: "详细内容 / 说明",
    announcementTextPlaceholder: "请输入公告具体内容、要求、截止日期及条件...",
    announcementImage: "上传图片 (JPG, PNG)",
    announcementFile: "附加文件 / 文档 (PDF, DOC等)",
    downloadAttachment: "下载附件文档",
    confirmDeleteTitle: "删除公告",
    confirmDeleteText: "您确定要删除此公告吗？此操作无法撤销。",
    cancel: "取消",
    save: "保存",
    saving: "保存中...",
    deleting: "删除中...",
    noAnnouncements: "目前暂无有效公告。",
    removeImage: "移除图片",
    removeFile: "移除文件",
    currentImage: "当前图片：",
    currentFile: "当前文件：",
    equipmentListTitle: "拟采购机械与设备清单：",
    allAnnouncementsHeading: "全部官方公告",
    manageSection: "管理部分",
    manageFiliallarTitle: "分部管理面板",
    manageFiliallarNotice: "您有权添加、编辑和删除分部信息。",
    addFilial: "添加新分部",
    editFilial: "编辑分部",
    deleteFilial: "删除分部",
    confirmDeleteFilial: "您确定要删除此分部吗？此操作无法撤消。",
    editPageTitle: "编辑页面",
    editPageNotice: "您有权限编辑此页面的内容、图片和文档。",
    editPageBtn: "编辑页面",
    directorPhoto: "主任照片",
    branchPhoto: "分部照片",
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
    if (lang === "ru") return "Генеральный директор";
    if (lang === "zh") return "总经理";
    return "General Director";
  }
  if (p.includes("bosh muhandis") || p.includes("bosh muhandisi")) {
    if (lang === "ru") return "Заместитель директора — Главный инженер";
    if (lang === "zh") return "副总经理兼总工程师";
    return "Deputy Director — Chief Engineer";
  }
  if (p.includes("direktor oʻrinbosari") || p.includes("direktor o'rinbosari") || p.includes("direktor urinbosari")) {
    if (lang === "ru") return "Заместитель директора";
    if (lang === "zh") return "副总经理";
    return "Deputy Director";
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
  } else if (lang === "zh") {
    res = res
      .replace(/viloyati/gi, "州")
      .replace(/shaxri|shahri/gi, "市")
      .replace(/tumani/gi, "区")
      .replace(/Toshkent avtomobil yo'llari instituti/gi, "塔什干公路学院")
      .replace(/Toshkent Politexnika instituti/gi, "塔什干理工学院")
      .replace(/Namangan muhandislik-qurilish instituti/gi, "纳曼干工程建筑学院")
      .replace(/Toshkent iqtisodiyot universiteti/gi, "塔什干国立经济大学");
  }
  return res;
}

const BRANCH_LOCALIZATIONS = {
  ru: {
    1: {
      name: "Главный Ташкентский филиал и железобетонный кластер",
      region: "г. Ташкент и Ташкентская область",
      address: "г. Ташкент, Яшнабадский район, ул. Оханграбо, 12",
      tasks: "Главное управление, производство железобетонных конструкций, центр диагностики",
      description: "Главное управление кластера и крупнейший комплекс по производству железобетонных изделий.",
    },
    2: {
      name: "Региональный филиал Долины (Фергана, Андижан, Наманган)",
      region: "Ферганская долина",
      address: "г. Фергана, 4-й квартал промзоны",
      tasks: "Ремонт мостовых сооружений, поставка товарного бетона и конструкций",
      description: "Региональный филиал, ответственный за автомобильные дороги и мостостроение в Ферганской долине.",
    },
    3: {
      name: "Самаркандский и Зарафшанский региональный филиал",
      region: "Самаркандская и Джизакская области",
      address: "г. Самарканд, ул. Дагбит, 88",
      tasks: "Диагностика и реконструкция мостов на автомобильных дорогах",
      description: "Техническое обслуживание и содержание в исправном состоянии мостов и искусственных сооружений Самарканда и Джизака.",
    },
    4: {
      name: "Бухарский и Навоийский региональный филиал",
      region: "Бухарская и Навоийская области",
      address: "г. Бухара, ул. Саноатчилар, 15",
      tasks: "Содержание и ремонт искусственных сооружений в пустынных и магистральных зонах",
      description: "Эксплуатация мостов на магистральных дорогах и в пустынных районах.",
    },
    5: {
      name: "Южный региональный филиал (Кашкадарья и Сурхандарья)",
      region: "Кашкадарьинская и Сурхандарьинская области",
      address: "г. Карши, Касанское шоссе, 42",
      tasks: "Восстановление и строительство мостов в горных условиях и сложном рельефе",
      description: "Горные и сложные мостовые объекты в Кашкадарьинской и Сурхандарьинской областях.",
    },
    6: {
      name: "Северо-Западный филиал (Хорезм и Каракалпакстан)",
      region: "Хорезмская область и Республика Каракалпакстан",
      address: "г. Ургенч, ул. Аль-Хорезми, 102",
      tasks: "Техническая диагностика и ремонт речных мостов и водохозяйственных сооружений",
      description: "Мосты через Амударью и каналы, а также региональное обеспечение железобетонными конструкциями.",
    },
  },
  en: {
    1: {
      name: "Tashkent Main Branch and Reinforced Concrete Cluster",
      region: "Tashkent city and region",
      address: "12 Ohangrabo Street, Yashnabad District, Tashkent",
      tasks: "Head management, reinforced concrete structures manufacturing, diagnostic center",
      description: "Cluster headquarters and largest manufacturing complex for reinforced concrete products.",
    },
    2: {
      name: "Valley Regional Branch (Fergana, Andijan, Namangan)",
      region: "Fergana Valley",
      address: "4th block, Industrial Zone, Fergana",
      tasks: "Bridge repair, supply of ready-mix concrete and structures",
      description: "Regional branch responsible for highways and bridge construction in the Fergana Valley.",
    },
    3: {
      name: "Samarkand and Zarafshan Regional Branch",
      region: "Samarkand and Jizzakh regions",
      address: "88 Dagbit Street, Samarkand",
      tasks: "Diagnostics and reconstruction of highway bridges",
      description: "Maintaining bridges and artificial structures in good technical condition in Samarkand and Jizzakh regions.",
    },
    4: {
      name: "Bukhara and Navoi Regional Branch",
      region: "Bukhara and Navoi regions",
      address: "15 Sanoatchilar Street, Bukhara",
      tasks: "Maintenance and repair of structures in desert and highway zones",
      description: "Operation of bridges on desert and arterial roads.",
    },
    5: {
      name: "Southern Regional Branch (Kashkadarya and Surkhandarya)",
      region: "Kashkadarya and Surkhandarya regions",
      address: "42 Kasan Road, Karshi",
      tasks: "Restoration and construction of bridges in mountainous and complex terrain",
      description: "Mountain and complex bridge structures in Kashkadarya and Surkhandarya regions.",
    },
    6: {
      name: "North-Western Branch (Khorezm and Karakalpakstan)",
      region: "Khorezm region and Republic of Karakalpakstan",
      address: "102 Al-Khorezmi Street, Urgench",
      tasks: "Technical diagnostics and repair of river bridges and water structures",
      description: "Bridges across the Amudarya River and canals, plus regional concrete supply.",
    },
  },
  zh: {
    1: {
      name: "塔什干总分支机构及钢筋混凝土工业集群",
      region: "塔什干市及塔什干州",
      address: "塔什干市雅什纳巴德区奥汉格拉博街12号",
      tasks: "总部管理、大型钢筋混凝土构件制造、工程检测诊断中心",
      description: "集群指挥中枢及最大规模的钢筋混凝土制品现代化生产基地。",
    },
    2: {
      name: "费尔干纳盆地区域分局（费尔干纳、安集延、纳曼干）",
      region: "费尔干纳盆地",
      address: "费尔干纳市工业园区第4街区",
      tasks: "公路桥梁构筑物大修、商品混凝土及工程结构件供应",
      description: "负责费尔干纳盆地三州公路网及桥梁建设的区域主管机构。",
    },
    3: {
      name: "撒马尔罕与泽拉夫尚区域分局",
      region: "撒马尔罕州和吉扎克州",
      address: "撒马尔罕市达格比特街88号",
      tasks: "高等级公路桥梁的工程检测诊断与改扩建施工",
      description: "负责撒马尔罕和吉扎克地区桥梁及人工构筑物的技术维护与良好状态维系。",
    },
    4: {
      name: "布哈拉与纳沃伊区域分局",
      region: "布哈拉州和纳沃伊州",
      address: "布哈拉市工业街15号",
      tasks: "干线公路及荒漠特殊工况人工构筑物的维保加固",
      description: "负责连接干线公路与沙漠地带重型桥梁工程的运营与抢修维护。",
    },
    5: {
      name: "南部区域分局（卡什卡达里亚与苏尔汉河）",
      region: "卡什卡达里亚州和苏尔汉河州",
      address: "卡尔希市卡桑公路42号",
      tasks: "复杂山区地形与地质条件下的桥梁建造与结构复原",
      description: "专注于南部两州高难度山区桥梁及特种交通构筑物工程。",
    },
    6: {
      name: "西北区域分局（花拉子模与卡拉卡尔帕克斯坦）",
      region: "花拉子模州与卡拉卡尔帕克斯坦共和国",
      address: "乌尔根奇市花拉子米街102号",
      tasks: "跨河大型桥梁与水利交通构筑物的技术诊断与修复",
      description: "负责阿姆河及大型水渠跨河桥梁的管养，以及西北区域的钢筋混凝土构件供应。",
    },
  },
};

function translateBranchStatus(status, lang) {
  if (!status || lang === "uz") return status;
  const s = status.toLowerCase().trim();
  if (s.includes("asosiy")) {
    if (lang === "ru") return "Основная база";
    if (lang === "zh") return "核心基地";
    return "Main Base";
  }
  if (s.includes("faol")) {
    if (lang === "ru") return "Активен";
    if (lang === "zh") return "正常运营";
    return "Active";
  }
  return status;
}

function getLocalizedBranch(branch, lang) {
  if (!branch || lang === "uz") return branch;
  let loc = BRANCH_LOCALIZATIONS[lang]?.[branch.id];
  if (!loc && branch.name) {
    const n = branch.name.toLowerCase();
    if (n.includes("toshkent")) loc = BRANCH_LOCALIZATIONS[lang]?.[1];
    else if (n.includes("vodiy") || n.includes("farg'ona") || n.includes("fargʻona")) loc = BRANCH_LOCALIZATIONS[lang]?.[2];
    else if (n.includes("samarqand")) loc = BRANCH_LOCALIZATIONS[lang]?.[3];
    else if (n.includes("buxoro")) loc = BRANCH_LOCALIZATIONS[lang]?.[4];
    else if (n.includes("janubiy") || n.includes("qashqadaryo")) loc = BRANCH_LOCALIZATIONS[lang]?.[5];
    else if (n.includes("shimoliy") || n.includes("xorazm")) loc = BRANCH_LOCALIZATIONS[lang]?.[6];
  }
  return {
    ...branch,
    name: loc?.name || branch.name,
    region: loc?.region || branch.region,
    address: loc?.address || branch.address,
    tasks: loc?.tasks || branch.tasks,
    description: loc?.description || branch.description,
    status: translateBranchStatus(branch.status, lang),
  };
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

  // ── Auth State ──────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

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

  // ── Restore session on mount ──────────────────────────────────
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      fetchProfile(token)
        .then((profileData) => {
          setUser(profileData);
        })
        .catch(() => {
          clearToken();
          setUser(null);
        });
    }
  }, []);

  // ── Refresh permissions from server on navigation or every 30s ──
  const refreshUser = React.useCallback(() => {
    const token = getStoredToken();
    if (!token) return;
    fetchProfile(token)
      .then((profileData) => setUser(profileData))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshUser();
  }, [activeSlug, refreshUser]);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;
    const interval = setInterval(refreshUser, 30000);
    return () => clearInterval(interval);
  }, [refreshUser]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const changeLang = (newLang) => setLang(newLang);

  const handleLogin = async (username, password) => {
    const data = await loginUser(username, password);
    storeToken(data.access);
    setUser(data.user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    logoutUser();
    clearToken();
    setUser(null);
    setShowAccount(false);
  };

  const handleAccountClick = () => {
    if (user) {
      setShowAccount(true);
    } else {
      setShowLogin(true);
    }
  };

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
        user={user}
        onAccountClick={handleAccountClick}
      />
      <main>
        <PageRenderer page={activePage} site={site} onNavigate={navigate} t={t} lang={lang} user={user} />
      </main>
      <Footer site={site} onNavigate={navigate} t={t} />

      {searchOpen && (
        <SearchModal site={site} onClose={() => setSearchOpen(false)} onNavigate={navigate} t={t} />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          t={t}
        />
      )}

      {showAccount && user && (
        <AccountPanel
          user={user}
          onClose={() => setShowAccount(false)}
          onLogout={handleLogout}
          onNavigate={navigate}
          t={t}
        />
      )}
    </>
  );
}

function Header({
  site,
  activeSlug,
  onNavigate,
  menuOpen,
  setMenuOpen,
  onOpenSearch,
  theme,
  onToggleTheme,
  lang,
  onChangeLang,
  t,
  user,
  onAccountClick,
}) {
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

  const langLabels = { uz: "O'Z", ru: "RU", en: "EN", zh: "ZH" };
  const langNames = { uz: "O'zbek", ru: "Русский", en: "English", zh: "中文" };
  const allLangs = ["uz", "ru", "en", "zh"];

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
                    <span className="lang-option-text">
                      <span className="lang-code">{langLabels[l]}</span>
                      <span className="lang-native">({langNames[l]})</span>
                    </span>
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

          <button
            className={`account-button ${user ? "is-logged-in" : ""}`}
            onClick={onAccountClick}
            title={user ? `${user.username} (${t.account || "Kabinet"})` : (t.login || "Kirish")}
            aria-label={t.account || "Kabinet"}
          >
            {user ? <Shield size={16} /> : <Lock size={16} />}
            <span>{user ? user.username : (t.login || "Kirish")}</span>
            {user && <span className="account-dot" />}
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
        <span>{getNavTitle(item.slug, item.label, t)}</span>
        {hasChildren && <ChevronDown size={14} style={{ flexShrink: 0 }} />}
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

function PageRenderer({ page, site, onNavigate, t, lang, user }) {
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

  if (page.type === "home" || page.slug === "bosh-sahifa") {
    return <Home site={site} onNavigate={onNavigate} t={t} lang={lang} user={user} />;
  }
  if (page.type === "leaders" || page.slug === "rahbariyat") {
    return <Leaders page={page} site={site} t={t} lang={lang} user={user} onNavigate={onNavigate} />;
  }
  if (page.slug === "bosh-ish-orinlari") {
    return <VacanciesPage page={page} site={site} t={t} lang={lang} user={user} onNavigate={onNavigate} />;
  }
  if (page.slug === "narx-navo") {
    return <PriceGridPage page={page} site={site} t={t} lang={lang} user={user} onNavigate={onNavigate} />;
  }
  if (page.type === "filiallar" || page.slug === "filiallar") {
    return <FiliallarPage page={page} site={site} t={t} lang={lang} user={user} onNavigate={onNavigate} />;
  }
  if (page.type === "announcement" || page.slug === "elonlar") {
    return <Announcement page={page} t={t} lang={lang} user={user} onNavigate={onNavigate} />;
  }
  if (page.type === "contact" || page.slug === "qayta-aloqa") {
    return <Contact site={site} t={t} lang={lang} user={user} onNavigate={onNavigate} />;
  }
  if (["korxona-ustavi", "tashkiliy-tuzilma", "katalog", "nomenklatura"].includes(page.slug) || page.type === "document") {
    return <DocumentPage page={page} site={site} t={t} lang={lang} user={user} onNavigate={onNavigate} />;
  }
  return <StatusPage page={page} site={site} t={t} lang={lang} user={user} onNavigate={onNavigate} />;
}

function HomeEditModal({ isOpen, site, onClose, onSaved, t }) {
  const home = site?.home || {};
  const [heroTitle, setHeroTitle] = useState(site?.brand?.legalName || home.heroTitle || "");
  const [heroTagline, setHeroTagline] = useState(site?.brand?.tagline || home.heroTagline || "");
  const [intro, setIntro] = useState(home.intro || "");
  const [purpose, setPurpose] = useState(home.purpose || "");
  const [tasks, setTasks] = useState((home.tasks || []).join("\n"));
  const [capabilities, setCapabilities] = useState((home.capabilities || []).join("\n"));
  const [heroImage, setHeroImage] = useState(null);
  const [tasksImage, setTasksImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [heroPreview, setHeroPreview] = useState(site?.assets?.hero || null);
  const [tasksPreview, setTasksPreview] = useState(site?.home?.tasksImage || null);

  // ── Rules of Hooks: early return MUST be AFTER all hooks ──
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = getStoredToken();
      const fd = new FormData();
      fd.append("hero_title", heroTitle.trim());
      fd.append("hero_tagline", heroTagline.trim());
      fd.append("intro", intro.trim());
      fd.append("purpose", purpose.trim());
      fd.append("tasks", tasks);
      fd.append("capabilities", capabilities);
      if (heroImage) fd.append("hero_image", heroImage);
      if (tasksImage) fd.append("tasks_image", tasksImage);

      await updateHomeContent(fd, token);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="elon-modal-header">
          <div className="elon-modal-title-row">
            <div className="elon-modal-icon">
              <Sparkles size={22} />
            </div>
            <div>
              <h3>{t.editHomeTitle || "Bosh sahifa kontentini tahrirlash"}</h3>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                {t.editHomeNotice || "Shior, matnlar, rasmlar va vazifalarni o'zgartiring"}
              </p>
            </div>
          </div>
          <button className="account-modal-close" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="elon-alert-error" style={{ marginBottom: 16 }}>
            <X size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="elon-modal-form">
          {/* Section 1: Asosiy ma'lumotlar */}
          <div className="modal-section-box">
            <div className="modal-section-title">
              <Building2 size={15} />
              <span>Asosiy Sarlavha & Shior</span>
            </div>
            <div className="elon-form-row">
              <div className="elon-form-group">
                <label>Tashkilot nomi (Sarlavha)</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Masalan: Oʻzyoʻlkoʻprik klasteri..."
                  className="elon-form-input"
                />
              </div>
              <div className="elon-form-group">
                <label>Qisqacha Shior (Tagline)</label>
                <input
                  type="text"
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  placeholder="Masalan: Koʻprik va sunʼiy inshootlar..."
                  className="elon-form-input"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kirish va Maqsad */}
          <div className="modal-section-box">
            <div className="modal-section-title">
              <FileText size={15} />
              <span>Kirish Matni va Maqsad</span>
            </div>
            <div className="elon-form-group">
              <label>Kirish matni (Intro)</label>
              <textarea
                rows={3}
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="Tashkilot haqida umumiy kirish matni..."
                className="elon-form-textarea"
              />
            </div>
            <div className="elon-form-group">
              <label>Klaster maqsadi (Purpose)</label>
              <textarea
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Klasterning asosiy vazifa va maqsadlari..."
                className="elon-form-textarea"
              />
            </div>
          </div>

          {/* Section 3: Media va Rasmlar */}
          <div className="modal-section-box">
            <div className="modal-section-title">
              <ImageIcon size={15} />
              <span>Sahifa Rasmlari</span>
            </div>
            <div className="elon-form-row">
              <div className="elon-form-group">
                <label>Bosh sahifa foni / Rasmi</label>
                {heroPreview && (
                  <div className="media-preview-card">
                    <img src={heroPreview} alt="Hero" className="media-preview-thumb" />
                    <div className="media-preview-info">
                      <span className="media-preview-name">{heroImage ? heroImage.name : "Mavjud fon rasmi"}</span>
                      <span className="media-preview-tag">{heroImage ? "Yangi yuklangan" : "Asosiy banner"}</span>
                    </div>
                  </div>
                )}
                <div className="elon-file-upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    id="hero-img-upload"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setHeroImage(f);
                        setHeroPreview(URL.createObjectURL(f));
                      }
                    }}
                  />
                  <label htmlFor="hero-img-upload" className="file-dropzone-btn">
                    <Upload size={16} />
                    <span>{heroPreview ? "Fon rasmini almashtirish" : "Fon rasmi tanlash"}</span>
                  </label>
                </div>
              </div>

              <div className="elon-form-group">
                <label>Vazifalar bloki rasmi</label>
                {tasksPreview && (
                  <div className="media-preview-card">
                    <img src={tasksPreview} alt="Tasks" className="media-preview-thumb" />
                    <div className="media-preview-info">
                      <span className="media-preview-name">{tasksImage ? tasksImage.name : "Mavjud vazifalar rasmi"}</span>
                      <span className="media-preview-tag">{tasksImage ? "Yangi yuklangan" : "Blok rasmi"}</span>
                    </div>
                  </div>
                )}
                <div className="elon-file-upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    id="tasks-img-upload"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setTasksImage(f);
                        setTasksPreview(URL.createObjectURL(f));
                      }
                    }}
                  />
                  <label htmlFor="tasks-img-upload" className="file-dropzone-btn">
                    <Upload size={16} />
                    <span>{tasksPreview ? "Blok rasmini almashtirish" : "Blok rasmi tanlash"}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Yo'nalishlar va Operatsion vazifalar */}
          <div className="modal-section-box">
            <div className="modal-section-title">
              <Layers size={15} />
              <span>Yo'nalishlar va Operatsion Vazifalar</span>
            </div>
            <div className="elon-form-group">
              <label>Faoliyat yo'nalishlari (Har biri alohida qatorda)</label>
              <textarea
                rows={4}
                value={capabilities}
                onChange={(e) => setCapabilities(e.target.value)}
                placeholder="Loyihalash&#10;Temir-beton konstruksiyalar ishlab chiqarish&#10;Ko'priklarni ta'mirlash va tiklash&#10;Diagnostika ishlari"
                className="elon-form-textarea"
              />
            </div>
            <div className="elon-form-group">
              <label>Asosiy operatsion vazifalar (Har biri alohida qatorda)</label>
              <textarea
                rows={5}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder="Avtomobil yo'llarida ko'priklarni qurish va ta'mirlash;&#10;Inshootlarni muntazam texnik ko'rikdan o'tkazish;&#10;Sifat nazoratini xalqaro standartlar asosida ta'minlash;"
                className="elon-form-textarea"
              />
            </div>
          </div>

          <div className="elon-modal-footer">
            <button type="button" className="account-close-btn" onClick={onClose} disabled={saving}>
              {t.cancel || "Bekor qilish"}
            </button>
            <button type="submit" className="btn-primary-save" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>{t.saving || "Saqlanmoqda..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t.save || "Saqlash"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Home({ site, onNavigate, t, lang, user }) {
  const canManage = Boolean(user && (user.is_superuser || user.permissions?.can_edit_home_content));
  const [isHomeEditOpen, setIsHomeEditOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

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
      {canManage && (
        <div style={{ maxWidth: 1200, margin: "20px auto -10px auto", padding: "0 24px" }}>
          <div className="elon-admin-toolbar glass-panel">
            <div className="elon-toolbar-info">
              <div className="elon-toolbar-icon">
                <Sparkles size={22} style={{ color: "var(--accent-cyan)" }} />
              </div>
              <div>
                <h3 className="elon-toolbar-title">{t.editHomeTitle || "Bosh sahifa kontentini boshqarish"}</h3>
                <p className="elon-toolbar-desc">{t.editHomeNotice || "Sizga bosh sahifaning matn, rasm va vazifalarini tahrirlash huquqi berilgan."}</p>
              </div>
            </div>
            <button type="button" className="btn-add-elon" onClick={() => setIsHomeEditOpen(true)}>
              <Pencil size={16} />
              <span>{t.editHomeBtn || "Bosh sahifani tahrirlash"}</span>
            </button>
          </div>
        </div>
      )}

      {successMsg && (
        <div style={{ maxWidth: 1200, margin: "16px auto 0 auto", padding: "0 24px" }}>
          <div className="elon-alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      <HomeEditModal
        isOpen={isHomeEditOpen}
        site={site}
        onClose={() => setIsHomeEditOpen(false)}
        onSaved={() => {
          setSuccessMsg("Bosh sahifa ma'lumotlari muvaffaqiyatli saqlandi!");
          setTimeout(() => {
            setSuccessMsg(null);
            window.location.reload();
          }, 1500);
        }}
        t={t}
      />

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
          <span className="eyebrow">{lang === "uz" ? (site.home.modelEyebrow || t.modelFallback) : (t.modelFallback || site.home.modelEyebrow)}</span>
          <h2>{lang === "uz" ? (site.home.modelTitle || t.modelTitleFallback) : (t.modelTitleFallback || site.home.modelTitle)}</h2>
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
          <span className="eyebrow">{lang === "uz" ? (site.home.capabilitiesEyebrow || t.capEyebrowFallback) : (t.capEyebrowFallback || site.home.capabilitiesEyebrow)}</span>
          <h2>{lang === "uz" ? (site.home.capabilitiesTitle || t.capTitleFallback) : (t.capTitleFallback || site.home.capabilitiesTitle)}</h2>
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
          <span className="eyebrow">{lang === "uz" ? (site.home.workflowEyebrow || t.workflowEyebrowFallback) : (t.workflowEyebrowFallback || site.home.workflowEyebrow)}</span>
          <h2>{lang === "uz" ? (site.home.workflowTitle || t.workflowTitleFallback) : (t.workflowTitleFallback || site.home.workflowTitle)}</h2>
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
              <span className="eyebrow">{lang === "uz" ? (site.home.tasksEyebrow || t.tasksEyebrowFallback) : (t.tasksEyebrowFallback || site.home.tasksEyebrow)}</span>
              <h2>{lang === "uz" ? (site.home.tasksTitle || t.tasksTitleFallback) : (t.tasksTitleFallback || site.home.tasksTitle)}</h2>
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

function LeaderModal({ isOpen, mode, leader, onClose, onSave, t }) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(isEdit && leader ? leader.name || "" : "");
  const [position, setPosition] = useState(isEdit && leader ? leader.position || "" : "");
  const [born, setBorn] = useState(isEdit && leader ? leader.born || "" : "");
  const [education, setEducation] = useState(isEdit && leader ? leader.education || "" : "");
  const [order, setOrder] = useState(isEdit && leader ? leader.order ?? 0 : 0);
  const [isActive, setIsActive] = useState(isEdit && leader ? leader.is_active ?? true : true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(isEdit && leader ? (leader.imageUrl || leader.image || null) : null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Iltimos, rahbar ismini kiriting.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("position", position.trim());
      fd.append("born", born.trim());
      fd.append("education", education.trim());
      fd.append("order", String(order || 0));
      fd.append("is_active", isActive ? "true" : "false");
      if (imageFile) {
        fd.append("image", imageFile);
      } else if (removeImage) {
        fd.append("remove_image", "true");
      }
      await onSave(fd, isEdit ? leader?.id : null);
      onClose();
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="elon-modal-header">
          <div className="elon-modal-title-row">
            <div className="elon-modal-icon">
              {isEdit ? <Pencil size={22} /> : <UserRound size={22} />}
            </div>
            <div>
              <h3>{isEdit ? "Rahbar ma'lumotlarini tahrirlash" : "Yangi rahbar qo'shish"}</h3>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                Rahbariyat a'zosi ismi, lavozimi, ma'lumoti va fotosurati
              </p>
            </div>
          </div>
          <button className="account-modal-close" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="elon-alert-error" style={{ marginBottom: 16 }}>
            <X size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="elon-modal-form">
          <div className="modal-section-box">
            <div className="modal-section-title">
              <UserRound size={15} />
              <span>Shaxsiy va Xizmat Ma'lumotlari</span>
            </div>
            <div className="elon-form-row">
              <div className="elon-form-group">
                <label>F.I.SH. (To'liq ism) *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Karimov Rustam Alisherovich"
                  required
                  className="elon-form-input"
                />
              </div>
              <div className="elon-form-group">
                <label>Lavozimi *</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Masalan: Bosh direktor o'rinbosari"
                  required
                  className="elon-form-input"
                />
              </div>
            </div>

            <div className="elon-form-row">
              <div className="elon-form-group">
                <label>Tug'ilgan sanasi va joyi</label>
                <input
                  type="text"
                  value={born}
                  onChange={(e) => setBorn(e.target.value)}
                  placeholder="Masalan: 1980 yil, Toshkent shahri"
                  className="elon-form-input"
                />
              </div>
              <div className="elon-form-group">
                <label>Tartib raqami</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="elon-form-input"
                />
              </div>
            </div>
          </div>

          <div className="modal-section-box">
            <div className="modal-section-title">
              <FileText size={15} />
              <span>Ma'lumoti va Faoliyati</span>
            </div>
            <div className="elon-form-group">
              <label>Ma'lumoti / Bitirgan ta'lim dargohi</label>
              <textarea
                rows={3}
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Masalan: 1. Toshkent avtomobil yo'llari instituti. 2. Toshkent Politexnika instituti..."
                className="elon-form-textarea"
              />
            </div>
          </div>

          <div className="modal-section-box">
            <div className="modal-section-title">
              <ImageIcon size={15} />
              <span>Fotosurat (Portret)</span>
            </div>
            <div className="elon-form-group">
              {imagePreview && !removeImage ? (
                <div className="media-preview-card avatar">
                  <img src={imagePreview} alt={name || "Rahbar"} className="media-preview-thumb avatar" />
                  <div className="media-preview-info">
                    <span className="media-preview-name">{imageFile ? imageFile.name : (name || "Rahbar fotosurati")}</span>
                    <span className="media-preview-tag">{imageFile ? "Yangi fotosurat tanlandi" : "Mavjud fotosurat"}</span>
                  </div>
                  <button
                    type="button"
                    className="elon-btn-remove-preview"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setRemoveImage(true);
                    }}
                  >
                    <Trash2 size={14} />
                    <span>O'chirish</span>
                  </button>
                </div>
              ) : null}

              <div className="elon-file-upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  id="leader-photo-file-upload"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setImageFile(f);
                      setImagePreview(URL.createObjectURL(f));
                      setRemoveImage(false);
                    }
                  }}
                />
                <label htmlFor="leader-photo-file-upload" className="file-dropzone-btn">
                  <Upload size={16} />
                  <span>{imagePreview && !removeImage ? "Boshqa fotosurat yuklash" : "Fotosurat tanlash (JPG, PNG)"}</span>
                </label>
              </div>
            </div>

            <div className="elon-form-group" style={{ marginTop: 8 }}>
              <label className="elon-checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Saytda ko'rsatilsin (Faol holatda)</span>
              </label>
            </div>
          </div>

          <div className="elon-modal-footer">
            <button type="button" className="account-close-btn" onClick={onClose} disabled={saving}>
              {t.cancel || "Bekor qilish"}
            </button>
            <button type="submit" className="btn-primary-save" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>{t.saving || "Saqlanmoqda..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t.save || "Saqlash"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Leaders({ page, site, t, lang, user, onNavigate }) {
  const canManage = Boolean(user && (user.is_superuser || user.permissions?.can_edit_leaders));
  const [leaders, setLeaders] = useState(page.leaders || []);
  const [modalMode, setModalMode] = useState(null);
  const [activeLeader, setActiveLeader] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (page.leaders) setLeaders(page.leaders);
  }, [page.leaders]);

  const reloadLeaders = async () => {
    try {
      const token = getStoredToken();
      const res = await fetchLeaders(token);
      setLeaders(res.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveLeader = async (formData, id) => {
    const token = getStoredToken();
    if (id) {
      await updateLeader(id, formData, token);
      setSuccessMsg("Rahbar ma'lumotlari muvaffaqiyatli yangilandi!");
    } else {
      await createLeader(formData, token);
      setSuccessMsg("Yangi rahbar muvaffaqiyatli qo'shildi!");
    }
    await reloadLeaders();
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = getStoredToken();
      await deleteLeader(deleteTarget.id, token);
      setSuccessMsg("Rahbar muvaffaqiyatli o'chirildi!");
      setDeleteTarget(null);
      await reloadLeaders();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || "O'chirishda xatolik yuz berdi");
      setTimeout(() => setErrorMsg(null), 3500);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page.slug, page.title, t)} label={t.aboutLabel} />

      {canManage && (
        <div style={{ maxWidth: 1100, margin: "0 auto 24px auto", width: "100%" }}>
          <div className="elon-admin-toolbar glass-panel">
            <div className="elon-toolbar-info">
              <div className="elon-toolbar-icon">
                <UserRound size={22} style={{ color: "var(--accent-cyan)" }} />
              </div>
              <div>
                <h3 className="elon-toolbar-title">Rahbariyatni boshqarish paneli</h3>
                <p className="elon-toolbar-desc">Sizga rahbariyat ma'lumotlarini qo'shish, tahrirlash va o'chirish huquqi berilgan.</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-add-elon"
              onClick={() => {
                setActiveLeader(null);
                setModalMode("create");
              }}
            >
              <Plus size={18} />
              <span>Yangi rahbar qo'shish</span>
            </button>
          </div>
        </div>
      )}

      {successMsg && (
        <div style={{ maxWidth: 1100, margin: "0 auto 24px auto", width: "100%" }}>
          <div className="elon-alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        </div>
      )}
      {errorMsg && (
        <div style={{ maxWidth: 1100, margin: "0 auto 24px auto", width: "100%" }}>
          <div className="elon-alert-error">
            <X size={18} />
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      <div className="leaders-grid">
        {leaders.map((leader, idx) => {
          const leaderImg =
            leader.imageUrl ||
            site?.assets?.leaders?.[leader.imageIndex] ||
            DEFAULT_ASSETS.leaders[idx % DEFAULT_ASSETS.leaders.length];

          return (
            <article className="leader-card" key={leader.id || leader.name} style={{ position: "relative" }}>
              {canManage && (
                <div
                  className="elon-card-admin-actions"
                  style={{ position: "absolute", top: 12, right: 12, zIndex: 5 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="elon-btn-icon edit"
                    onClick={() => {
                      setActiveLeader(leader);
                      setModalMode("edit");
                    }}
                    title="Tahrirlash"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="elon-btn-icon delete"
                    onClick={() => setDeleteTarget(leader)}
                    title="O'chirish"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

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

      <LeaderModal
        isOpen={Boolean(modalMode)}
        mode={modalMode}
        leader={activeLeader}
        onClose={() => setModalMode(null)}
        onSave={handleSaveLeader}
        t={t}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        elon={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        t={t}
      />
    </section>
  );
}

function PageEditModal({ isOpen, page, onClose, onSave, t }) {
  if (!isOpen || !page) return null;

  const [title, setTitle] = useState(page.title || "");
  const [content, setContent] = useState(page.content || "");
  const [status, setStatus] = useState(page.status || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(page.imageUrl || null);
  const [removeImage, setRemoveImage] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [removeDoc, setRemoveDoc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("content", content.trim());
      fd.append("status", status.trim());
      if (imageFile) {
        fd.append("image", imageFile);
      } else if (removeImage) {
        fd.append("remove_image", "true");
      }
      if (docFile) {
        fd.append("file", docFile);
      } else if (removeDoc) {
        fd.append("remove_file", "true");
      }
      await onSave(fd);
      onClose();
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="account-modal-close" onClick={onClose} aria-label="Yopish">
          <X size={20} />
        </button>

        <div className="account-modal-header">
          <div className="account-icon-box">
            <Pencil size={24} />
          </div>
          <h3>{t.editPageTitle || "Sahifa ma'lumotlarini tahrirlash"}</h3>
          <p>{t.editPageNotice || "Ushbu sahifaning sarlavhasi, matni, rasmi va biriktirilgan hujjatini o'zgartirishingiz mumkin."}</p>
        </div>

        {error && (
          <div className="elon-alert-error" style={{ margin: "0 28px 16px" }}>
            <X size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="elon-form">
          <div className="modal-section-box">
            <h4 className="modal-section-title">Asosiy ma'lumotlar</h4>
            <div className="elon-form-group">
              <label>{t.pageTitle || "Sahifa sarlavhasi"}</label>
              <input
                type="text"
                className="elon-form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="elon-form-group">
              <label>{t.pageStatus || "Qo'shimcha izoh / Holat"}</label>
              <input
                type="text"
                className="elon-form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Masalan: Tasdiqlangan, Yangilangan va h.k."
              />
            </div>
          </div>

          <div className="modal-section-box">
            <h4 className="modal-section-title">Sahifa matni / Tavsif</h4>
            <div className="elon-form-group">
              <textarea
                rows={4}
                className="elon-form-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Sahifada ko'rinadigan asosiy matn yoki tavsif..."
              />
            </div>
          </div>

          <div className="modal-section-box">
            <h4 className="modal-section-title">Sahifa rasmi va biriktirilgan hujjat</h4>
            <div className="elon-form-row">
              <div className="elon-form-group" style={{ flex: 1 }}>
                <label>{t.pageImage || "Sahifa rasmi"}</label>
                {imagePreview && !removeImage ? (
                  <div className="media-preview-card">
                    <img src={imagePreview} alt="Sahifa rasmi" className="media-preview-thumb" />
                    <div className="media-preview-info">
                      <span className="media-preview-name">{imageFile ? imageFile.name : "Mavjud rasm"}</span>
                      <button
                        type="button"
                        className="media-preview-remove"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setRemoveImage(true);
                        }}
                      >
                        <Trash2 size={12} />
                        <span>O'chirish</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="page-image-input"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setImageFile(f);
                          setImagePreview(URL.createObjectURL(f));
                          setRemoveImage(false);
                        }
                      }}
                    />
                    <label htmlFor="page-image-input" className="file-dropzone-btn">
                      <ImageIcon size={16} />
                      <span>Rasm yuklash</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="elon-form-group" style={{ flex: 1 }}>
                <label>{t.pageDoc || "Biriktirilgan hujjat (PDF / Rasm)"}</label>
                {(page.fileUrl || docFile) && !removeDoc ? (
                  <div className="media-preview-card">
                    <div className="media-preview-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(14, 165, 233, 0.15)" }}>
                      <FileText size={24} style={{ color: "var(--accent-cyan)" }} />
                    </div>
                    <div className="media-preview-info">
                      <span className="media-preview-name">{docFile ? docFile.name : "Hujjat biriktirilgan"}</span>
                      <button
                        type="button"
                        className="media-preview-remove"
                        onClick={() => {
                          setDocFile(null);
                          setRemoveDoc(true);
                        }}
                      >
                        <Trash2 size={12} />
                        <span>O'chirish</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="page-doc-input"
                      accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setDocFile(f);
                          setRemoveDoc(false);
                        }
                      }}
                    />
                    <label htmlFor="page-doc-input" className="file-dropzone-btn">
                      <Paperclip size={16} />
                      <span>Hujjat tanlash</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="elon-modal-footer">
            <button type="button" className="account-close-btn" onClick={onClose} disabled={saving}>
              {t.cancel || "Bekor qilish"}
            </button>
            <button type="submit" className="btn-primary-save" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>{t.saving || "Saqlanmoqda..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t.save || "Saqlash"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CatalogItemModal({ isOpen, mode, item, slug, onClose, onSave, t }) {
  const isEdit = mode === "edit";
  const [title, setTitle] = useState(isEdit && item ? item.title || "" : "");
  const [description, setDescription] = useState(isEdit && item ? item.description || "" : "");
  const [fileUrl, setFileUrl] = useState(isEdit && item ? item.fileUrl || "" : "");
  const [file, setFile] = useState(null);
  const [order, setOrder] = useState(isEdit && item ? item.order ?? 0 : 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Hujjat nomini kiriting.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("file_url", fileUrl.trim());
      fd.append("page_slug", slug);
      fd.append("order", String(order || 0));
      if (file) fd.append("file", file);

      await onSave(fd, isEdit ? item?.id : null);
      onClose();
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="account-modal-close" onClick={onClose} aria-label="Yopish">
          <X size={20} />
        </button>

        <div className="account-modal-header">
          <div className="account-icon-box">
            {isEdit ? <Pencil size={24} /> : <Plus size={24} />}
          </div>
          <h3>{isEdit ? "Hujjatni tahrirlash" : "Yangi hujjat qo'shish"}</h3>
          <p>Hujjat nomi, tavsifi va faylini yuklang.</p>
        </div>

        {error && (
          <div className="elon-alert-error" style={{ margin: "0 28px 16px" }}>
            <X size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="elon-form">
          <div className="modal-section-box">
            <h4 className="modal-section-title">Hujjat nomi va tartibi</h4>
            <div className="elon-form-row">
              <div className="elon-form-group" style={{ flex: 2 }}>
                <label>Hujjat nomi / Sarlavhasi</label>
                <input
                  type="text"
                  className="elon-form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Maxsus texnikalar katalogi 2026.pdf"
                  required
                />
              </div>
              <div className="elon-form-group" style={{ flex: 1 }}>
                <label>Tartib raqami</label>
                <input
                  type="number"
                  className="elon-form-input"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="elon-form-group">
              <label>Qisqacha tavsif</label>
              <textarea
                rows={3}
                className="elon-form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hujjat haqida qisqacha ma'lumot..."
              />
            </div>
          </div>

          <div className="modal-section-box">
            <h4 className="modal-section-title">Fayl yoki Tashqi havola</h4>
            <div className="elon-form-group">
              <label>Hujjat fayli (PDF yoki Rasm)</label>
              {file ? (
                <div className="media-preview-card">
                  <div className="media-preview-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(14, 165, 233, 0.15)" }}>
                    <FileText size={24} style={{ color: "var(--accent-cyan)" }} />
                  </div>
                  <div className="media-preview-info">
                    <span className="media-preview-name">{file.name}</span>
                    <button
                      type="button"
                      className="media-preview-remove"
                      onClick={() => setFile(null)}
                    >
                      <Trash2 size={12} />
                      <span>Bekor qilish</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    id="catalog-file-input"
                    accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="catalog-file-input" className="file-dropzone-btn">
                    <Paperclip size={16} />
                    <span>Fayl yuklash (PDF / Rasm)</span>
                  </label>
                </div>
              )}
            </div>

            <div className="elon-form-group" style={{ marginTop: 12 }}>
              <label>Yoki tashqi havola (Google Drive / URL)</label>
              <input
                type="url"
                className="elon-form-input"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="elon-modal-footer">
            <button type="button" className="account-close-btn" onClick={onClose} disabled={saving}>
              {t.cancel || "Bekor qilish"}
            </button>
            <button type="submit" className="btn-primary-save" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>{t.saving || "Saqlanmoqda..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t.save || "Saqlash"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DocumentPage({ page, site, t, user, onNavigate }) {
  const permMap = {
    "korxona-ustavi": "can_edit_korxona_ustavi",
    "tashkiliy-tuzilma": "can_edit_tashkiliy_tuzilma",
    "katalog": "can_edit_katalog",
    "nomenklatura": "can_edit_nomenklatura",
  };
  const permKey = permMap[page.slug];
  const canManage = Boolean(
    user && (user.is_superuser || (permKey && user.permissions?.[permKey]))
  );

  const [currentPage, setCurrentPage] = useState(page);
  const [catalogItems, setCatalogItems] = useState(page.catalogItems || []);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [docModalMode, setDocModalMode] = useState(null);
  const [activeDocItem, setActiveDocItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    setCurrentPage(page);
    if (page.catalogItems) setCatalogItems(page.catalogItems);
  }, [page]);

  const reloadCatalogItems = async () => {
    try {
      const token = getStoredToken();
      const res = await fetchCatalogItems(page.slug, token);
      setCatalogItems(res.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePage = async (formData) => {
    const token = getStoredToken();
    const updated = await updatePage(page.slug, formData, token);
    setCurrentPage((prev) => ({
      ...prev,
      ...updated,
      imageUrl: updated.imageUrl || updated.image || prev.imageUrl,
      fileUrl: updated.fileUrl || updated.file || prev.fileUrl,
    }));
    setSuccessMsg("Sahifa ma'lumotlari muvaffaqiyatli saqlandi!");
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleSaveDocItem = async (formData, id) => {
    const token = getStoredToken();
    if (id) {
      await updateCatalogItem(id, formData, token);
      setSuccessMsg("Hujjat muvaffaqiyatli yangilandi!");
    } else {
      await createCatalogItem(formData, token);
      setSuccessMsg("Yangi hujjat muvaffaqiyatli qo'shildi!");
    }
    await reloadCatalogItems();
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleConfirmDeleteDoc = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = getStoredToken();
      await deleteCatalogItem(deleteTarget.id, token);
      setSuccessMsg("Hujjat muvaffaqiyatli o'chirildi!");
      setDeleteTarget(null);
      await reloadCatalogItems();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || "O'chirishda xatolik yuz berdi");
      setTimeout(() => setErrorMsg(null), 3500);
    } finally {
      setDeleting(false);
    }
  };

  const defaultDesc = currentPage.slug === "katalog"
    ? t.catalogDefaultDesc
    : currentPage.slug === "nomenklatura"
      ? t.nomDefaultDesc
      : "";

  const pageDesc = currentPage.content || defaultDesc;

  let allItems = [];
  if (currentPage.fileUrl) {
    allItems.push({
      id: "page-main-file",
      title: getNavTitle(currentPage.slug, currentPage.title, t),
      fileUrl: currentPage.fileUrl,
      embedUrl: currentPage.fileUrl,
      isMain: true,
    });
  }
  if (catalogItems && catalogItems.length > 0) {
    allItems = allItems.concat(catalogItems);
  }

  const isCatalogPage = ["katalog", "nomenklatura"].includes(currentPage.slug);

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(currentPage.slug, currentPage.title, t)} label={t.zavodLabel} />

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 32, width: "100%" }}>
        {canManage && (
          <div className="elon-admin-toolbar glass-panel">
            <div className="elon-toolbar-info">
              <div className="elon-toolbar-icon">
                <FileText size={22} style={{ color: "var(--accent-cyan)" }} />
              </div>
              <div>
                <h3 className="elon-toolbar-title">{t.editPageTitle || "Sahifani boshqarish"}</h3>
                <p className="elon-toolbar-desc">{t.editPageNotice || "Sizga ushbu sahifa matni, rasmi va hujjatlarini o'zgartirish huquqi berilgan."}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {isCatalogPage && (
                <button
                  type="button"
                  className="btn-add-elon"
                  onClick={() => {
                    setActiveDocItem(null);
                    setDocModalMode("create");
                  }}
                >
                  <Plus size={16} />
                  <span>Yangi hujjat qo'shish</span>
                </button>
              )}
              <button
                type="button"
                className="btn-add-elon secondary"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-bright)" }}
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil size={16} />
                <span>{t.editPageBtn || "Sahifani tahrirlash"}</span>
              </button>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="elon-alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="elon-alert-error">
            <X size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {pageDesc && (
          <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 16px auto" }}>
            <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--text-muted)", whiteSpace: "pre-line" }}>
              {pageDesc}
            </p>
          </div>
        )}

        {currentPage.imageUrl && (
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <img
              src={currentPage.imageUrl}
              alt=""
              style={{ width: "100%", maxHeight: 420, objectFit: "cover" }}
            />
          </div>
        )}

        {allItems.map((item, index) => {
          const embed = item.embedUrl;
          const isImage = /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjpg|png|svg|webp)$/i.test(item.fileUrl);

          return (
            <div key={item.id || index} className="glass-panel" style={{ padding: 28, position: "relative", display: "grid", gap: 20 }}>
              {canManage && !item.isMain && (
                <div
                  className="elon-card-admin-actions"
                  style={{ position: "absolute", top: 16, right: 16, zIndex: 5 }}
                >
                  <button
                    type="button"
                    className="elon-btn-icon edit"
                    onClick={() => {
                      setActiveDocItem(item);
                      setDocModalMode("edit");
                    }}
                    title="Tahrirlash"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="elon-btn-icon delete"
                    onClick={() => setDeleteTarget(item)}
                    title="O'chirish"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                  {item.title}
                </h3>
                {item.description && (
                  <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                )}
              </div>

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

              <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ padding: "14px 32px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}
                  download
                >
                  <span>{t.downloadDoc}</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <PageEditModal
        isOpen={isEditOpen}
        page={currentPage}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSavePage}
        t={t}
      />

      <CatalogItemModal
        isOpen={Boolean(docModalMode)}
        mode={docModalMode}
        item={activeDocItem}
        slug={currentPage.slug}
        onClose={() => setDocModalMode(null)}
        onSave={handleSaveDocItem}
        t={t}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        elon={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDeleteDoc}
        deleting={deleting}
        t={t}
      />
    </section>
  );
}

function formatElonDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${mins}`;
  } catch {
    return dateStr;
  }
}

function ElonModal({ isOpen, mode, elon, onClose, onSave, t }) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(isEdit && elon ? elon.name || "" : "");
  const [text, setText] = useState(isEdit && elon ? elon.text || "" : "");
  const [order, setOrder] = useState(isEdit && elon ? elon.order ?? 0 : 0);
  const [isActive, setIsActive] = useState(isEdit && elon ? elon.is_active ?? true : true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(isEdit && elon ? elon.image || null : null);
  const [removeImage, setRemoveImage] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [removeDoc, setRemoveDoc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleDocChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile(file);
      setRemoveDoc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Iltimos, e'lon sarlavhasini kiriting");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("text", text.trim());
      fd.append("order", String(order));
      fd.append("is_active", isActive ? "true" : "false");
      if (imageFile) {
        fd.append("image", imageFile);
      } else if (removeImage) {
        fd.append("remove_image", "true");
      }
      if (docFile) {
        fd.append("file", docFile);
      } else if (removeDoc) {
        fd.append("remove_file", "true");
      }
      await onSave(fd, isEdit ? elon?.id : null);
      onClose();
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="elon-modal-header">
          <div className="elon-modal-title-row">
            <div className="elon-modal-icon">
              {isEdit ? <Pencil size={18} /> : <Plus size={18} />}
            </div>
            <h3>{isEdit ? (t.editAnnouncement || "E'lonni tahrirlash") : (t.addAnnouncement || "Yangi e'lon qo'shish")}</h3>
          </div>
          <button type="button" className="account-modal-close" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="elon-modal-form">
          {error && (
            <div className="elon-alert-error" style={{ marginBottom: 16 }}>
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="elon-form-group">
            <label>{t.announcementTitle || "E'lon sarlavhasi"} *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.announcementTitlePlaceholder || "E'lon nomi..."}
              required
              className="elon-form-input"
            />
          </div>

          <div className="elon-form-group">
            <label>{t.announcementText || "Batafsil matn / tavsif"}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.announcementTextPlaceholder || "E'lon mazmuni, talablar..."}
              rows={5}
              className="elon-form-textarea"
            />
          </div>

          <div className="elon-form-row">
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>Tartib raqami (Order)</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="elon-form-input"
              />
            </div>
            <div className="elon-form-group" style={{ flex: 1, display: "flex", alignItems: "center", paddingTop: 20 }}>
              <label className="elon-checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Faol (Saytda ko'rinadi)</span>
              </label>
            </div>
          </div>

          <div className="elon-form-group">
            <label>{t.announcementImage || "Rasm yuklash (JPG, PNG)"}</label>
            {imagePreview ? (
              <div className="elon-preview-wrap">
                <img src={imagePreview} alt="Preview" className="elon-preview-img" />
                <button
                  type="button"
                  className="elon-preview-remove-btn"
                  onClick={handleRemoveImage}
                  title="Rasmni olib tashlash"
                >
                  <Trash2 size={14} />
                  <span>{t.removeImage || "Rasmni olib tashlash"}</span>
                </button>
              </div>
            ) : (
              <div className="elon-file-upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="elon-image-upload"
                  style={{ display: "none" }}
                />
                <label htmlFor="elon-image-upload" className="elon-upload-btn">
                  <ImageIcon size={18} />
                  <span>Rasm tanlash</span>
                </label>
              </div>
            )}
          </div>

          <div className="elon-form-group">
            <label>{t.announcementFile || "Biriktirilgan fayl / Hujjat (PDF, DOC va h.k.)"}</label>
            {isEdit && elon?.file && !docFile && !removeDoc && (
              <div className="elon-existing-file">
                <Paperclip size={16} />
                <span className="elon-existing-filename">{elon.file.split("/").pop()}</span>
                <button
                  type="button"
                  className="elon-preview-remove-btn small"
                  onClick={() => setRemoveDoc(true)}
                  title="Faylni olib tashlash"
                >
                  <Trash2 size={13} />
                  <span>{t.removeFile || "Olib tashlash"}</span>
                </button>
              </div>
            )}
            <div className="elon-file-upload-zone">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                onChange={handleDocChange}
                id="elon-doc-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="elon-doc-upload" className="elon-upload-btn">
                <Paperclip size={18} />
                <span>{docFile ? docFile.name : (elon?.file && !removeDoc ? "Faylni almashtirish" : "Hujjat tanlash")}</span>
              </label>
            </div>
          </div>

          <div className="elon-modal-footer">
            <button
              type="button"
              className="account-close-btn"
              onClick={onClose}
              disabled={saving}
            >
              {t.cancel || "Bekor qilish"}
            </button>
            <button
              type="submit"
              className="btn-add-elon"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>{t.saving || "Saqlanmoqda..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t.save || "Saqlash"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ isOpen, elon, onClose, onConfirm, deleting, t }) {
  if (!isOpen || !elon) return null;

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-delete-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon-circle">
          <Trash2 size={24} style={{ color: "#ef4444" }} />
        </div>
        <h3>{t.confirmDeleteTitle || "E'lonni o'chirish"}</h3>
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "12px 0 20px" }}>
          {t.confirmDeleteText || "Haqiqatan ham ushbu e'lonni o'chirmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi."}
        </p>
        <div className="elon-delete-target-preview">
          <strong>{elon.name || elon.title || ""}</strong>
        </div>
        <div className="elon-modal-footer" style={{ marginTop: 24 }}>
          <button
            type="button"
            className="account-close-btn"
            onClick={onClose}
            disabled={deleting}
          >
            {t.cancel || "Bekor qilish"}
          </button>
          <button
            type="button"
            className="btn-danger-delete"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 size={16} className="spin-animate" />
                <span>{t.deleting || "O'chirilmoqda..."}</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>{t.deleteAnnouncement || "O'chirish"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function AnnouncementSettingsModal({ isOpen, initialData, onClose, onSave, t }) {
  const [intro, setIntro] = useState(initialData?.intro || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [itemsText, setItemsText] = useState((initialData?.items || []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const items = itemsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      await onSave({ intro, email, items });
      onClose();
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="elon-modal-header">
          <div className="elon-modal-title-row">
            <div className="elon-modal-icon">
              <Pencil size={18} />
            </div>
            <h3>{t.editAnnouncementSettings || "E'lonlar sahifasi sozlamalari"}</h3>
          </div>
          <button type="button" className="account-modal-close" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="elon-modal-form">
          {error && (
            <div className="elon-alert-error" style={{ marginBottom: 16 }}>
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="elon-form-group">
            <label>Kirish matni (Intro)</label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={3}
              className="elon-form-textarea"
              placeholder="E'lon bo'yicha kirish yoki umumiy ma'lumot..."
            />
          </div>

          <div className="elon-form-group">
            <label>Aloqa elektron pochtasi (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="elon-form-input"
              placeholder="elon@uzyolkoprik.uz"
            />
          </div>

          <div className="elon-form-group">
            <label>Xarid qilinadigan texnika / uskunalar ro'yxati (Har biri alohida qatorda)</label>
            <textarea
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              rows={5}
              className="elon-form-textarea"
              placeholder="Asfalt yotqizgich&#10;Gidravlik kran&#10;Ekskavator"
            />
          </div>

          <div className="elon-modal-footer">
            <button type="button" className="account-close-btn" onClick={onClose} disabled={saving}>
              {t.cancel || "Bekor qilish"}
            </button>
            <button type="submit" className="btn-add-elon" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>{t.saving || "Saqlanmoqda..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t.save || "Saqlash"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LightboxModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="elon-lightbox-backdrop" onClick={onClose}>
      <button className="elon-lightbox-close" onClick={onClose} aria-label="Yopish">
        <X size={26} />
      </button>
      <div className="elon-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Kattalashtirilgan rasm" />
      </div>
    </div>
  );
}

function Announcement({ page, t, lang, user, onNavigate }) {
  const canManage = Boolean(
    user && (user.is_superuser || user.permissions?.can_edit_announcements || user.permissions?.can_edit_elonlar)
  );
  const canManageElonlar = canManage;
  const canManageAnnouncements = canManage;

  const [elonlar, setElonlar] = useState(page.elonlarList || []);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [activeElon, setActiveElon] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Announcement page settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [announcementSettings, setAnnouncementSettings] = useState({
    intro: page.intro || "",
    email: page.email || "",
    items: page.items || [],
  });

  const introText = announcementSettings.intro || t.announcementIntro || page.intro;
  const items = announcementSettings.items?.length ? announcementSettings.items : (t.announcementItems || page.items || []);
  const pageEmail = announcementSettings.email || page.email;

  const reloadElonlar = async () => {
    setLoading(true);
    try {
      const data = await fetchElonlar();
      const list = Array.isArray(data) ? data : (data?.results || []);
      setElonlar(list);
    } catch (err) {
      console.error("reloadElonlar error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page.elonlarList) {
      setElonlar(page.elonlarList);
    }
    setAnnouncementSettings({
      intro: page.intro || "",
      email: page.email || "",
      items: page.items || [],
    });
  }, [page]);

  const handleOpenCreate = () => {
    setActiveElon(null);
    setModalMode("create");
  };

  const handleOpenEdit = (elon) => {
    setActiveElon(elon);
    setModalMode("edit");
  };

  const handleSaveElon = async (formData, id) => {
    const token = getStoredToken();
    if (id) {
      await updateElon(id, formData, token);
      setSuccessMsg("E'lon muvaffaqiyatli yangilandi!");
    } else {
      await createElon(formData, token);
      setSuccessMsg("Yangi e'lon muvaffaqiyatli qo'shildi!");
    }
    await reloadElonlar();
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = getStoredToken();
      await deleteElon(deleteTarget.id, token);
      setSuccessMsg("E'lon muvaffaqiyatli o'chirildi!");
      setDeleteTarget(null);
      await reloadElonlar();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || "O'chirishda xatolik yuz berdi");
      setTimeout(() => setErrorMsg(null), 3500);
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveSettings = async (data) => {
    const token = getStoredToken();
    const updated = await updateAnnouncementSettings(data, token);
    setAnnouncementSettings({
      intro: updated.intro,
      email: updated.email,
      items: updated.items,
    });
    setSuccessMsg("E'lon sahifasi sozlamalari muvaffaqiyatli saqlandi!");
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page.slug, page.title, t)} label={t.announcementLabel} />

      {/* Admin Toolbar if user has permission */}
      {canManage && (
        <div className="elon-admin-toolbar glass-panel">
          <div className="elon-toolbar-info">
            <div className="elon-toolbar-icon">
              <Sparkles size={22} style={{ color: "var(--accent-cyan)" }} />
            </div>
            <div>
              <h3 className="elon-toolbar-title">{t.manageAnnouncements || "E'lonlarni boshqarish paneli"}</h3>
              <p className="elon-toolbar-desc">
                {canManageElonlar && canManageAnnouncements
                  ? "Sizda e'lonlar va sahifa sozlamalarini tahrirlash huquqi mavjud."
                  : canManageElonlar
                  ? "Sizda mahsulot e'lonlarini qo'shish va o'chirish huquqi mavjud."
                  : "Sizda xarid uskunalari ro'yxati va sozlamalarni tahrirlash huquqi mavjud."}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {canManageAnnouncements && (
              <button
                type="button"
                className="btn-edit-admin"
                onClick={() => setIsSettingsOpen(true)}
                style={{
                  background: "rgba(14, 165, 233, 0.15)",
                  color: "var(--accent-cyan)",
                  border: "1px solid var(--accent-cyan)",
                  padding: "9px 16px",
                  borderRadius: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Pencil size={16} />
                <span>Texnika ro'yxati & sozlamalar</span>
              </button>
            )}
            {canManageElonlar && (
              <button
                type="button"
                className="btn-add-elon"
                onClick={handleOpenCreate}
              >
                <Plus size={18} />
                <span>{t.addAnnouncement || "Yangi e'lon qo'shish"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success / Error Alerts */}
      {successMsg && (
        <div className="elon-alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="elon-alert-error">
          <X size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Announcements List Header */}
      <div className="elon-list-header">
        <div className="elon-list-title-row">
          <h2 className="elon-section-heading">
            {t.allAnnouncementsHeading || "Barcha rasmiy e'lonlar"}
          </h2>
          <span className="elon-count-badge">{elonlar.length} ta</span>
        </div>
        {loading && <Loader2 size={18} className="spin-animate" style={{ color: "var(--accent-cyan)" }} />}
      </div>

      {/* Grid of Announcements */}
      {elonlar.length === 0 ? (
        <div className="elon-empty-state glass-panel">
          <Sparkles size={40} style={{ color: "var(--accent-cyan)", opacity: 0.6, marginBottom: 12 }} />
          <p>{t.noAnnouncements || "Hozircha faol e'lonlar kiritilmagan."}</p>
          {canManageElonlar && (
            <button
              type="button"
              className="btn-add-elon"
              style={{ marginTop: 16 }}
              onClick={handleOpenCreate}
            >
              <Plus size={16} />
              <span>{t.addAnnouncement || "Yangi e'lon qo'shish"}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="elonlar-grid">
          {elonlar.map((item) => (
            <article className={`elon-card glass-panel ${!item.is_active ? "inactive" : ""}`} key={item.id}>
              <div className="elon-card-top-bar">
                <div className="elon-date-tag">
                  <Calendar size={13} />
                  <span>{formatElonDate(item.created_at)}</span>
                </div>
                {canManageElonlar && (
                  <div className="elon-card-admin-actions">
                    {!item.is_active && (
                      <span className="elon-badge-draft">Qoralama</span>
                    )}
                    <button
                      type="button"
                      className="elon-btn-icon edit"
                      onClick={() => handleOpenEdit(item)}
                      title={t.editAnnouncement || "Tahrirlash"}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      className="elon-btn-icon delete"
                      onClick={() => setDeleteTarget(item)}
                      title={t.deleteAnnouncement || "O'chirish"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {item.image && (
                <div className="elon-card-image-wrap" onClick={() => setLightboxImg(item.image)}>
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="elon-zoom-hint">
                    <Eye size={16} />
                    <span>Kattalashtirish</span>
                  </div>
                </div>
              )}

              <div className="elon-card-content">
                <h3 className="elon-card-title">{item.name}</h3>
                {item.text && <p className="elon-card-text">{item.text}</p>}
              </div>

              {item.file && (
                <div className="elon-card-footer">
                  <a
                    href={item.file}
                    target="_blank"
                    rel="noreferrer"
                    className="elon-attachment-btn"
                    download
                  >
                    <Paperclip size={14} />
                    <span>{t.downloadAttachment || "Hujjatni yuklab olish"}</span>
                    <Download size={13} />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Equipment List & Proposals Card */}
      <div className="announcement-box" style={{ marginTop: 40, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, color: "var(--text-main)", fontWeight: 700, margin: 0 }}>
            {t.equipmentListTitle || "Xarid qilinadigan texnika va uskunalar ro'yxati:"}
          </h3>
          {canManageAnnouncements && (
            <button
              type="button"
              className="btn-edit-admin"
              onClick={() => setIsSettingsOpen(true)}
              style={{
                background: "rgba(14, 165, 233, 0.15)",
                color: "var(--accent-cyan)",
                border: "1px solid var(--accent-cyan)",
                padding: "6px 12px",
                borderRadius: "6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              title="Ro'yxatni tahrirlash"
            >
              <Pencil size={13} />
              <span>Tahrirlash</span>
            </button>
          )}
        </div>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 20 }}>{introText}</p>
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
            <a href={`mailto:${pageEmail}`}>{pageEmail}</a>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ElonModal
        isOpen={Boolean(modalMode)}
        mode={modalMode}
        elon={activeElon}
        onClose={() => setModalMode(null)}
        onSave={handleSaveElon}
        t={t}
      />

      <AnnouncementSettingsModal
        isOpen={isSettingsOpen}
        initialData={announcementSettings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        t={t}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        elon={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        t={t}
      />

      <LightboxModal
        imageUrl={lightboxImg}
        onClose={() => setLightboxImg(null)}
      />
    </section>
  );
}

function ContactEditModal({ isOpen, contact, onClose, onSave, t }) {
  const [phone1, setPhone1] = useState(contact.phones?.[0] || contact.phone_primary || "");
  const [phone2, setPhone2] = useState(contact.phones?.[1] || contact.phone_secondary || "");
  const [email, setEmail] = useState(contact.email || "");
  const [hours, setHours] = useState(contact.hours || "");
  const [bank, setBank] = useState(contact.bank || "");
  const [address, setAddress] = useState(contact.address || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        phone_primary: phone1.trim(),
        phone_secondary: phone2.trim(),
        email: email.trim(),
        hours: hours.trim(),
        bank: bank.trim(),
        address: address.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="elon-modal-header">
          <div className="elon-modal-title-row">
            <div className="elon-modal-icon">
              <Mail size={18} />
            </div>
            <h3>{t.editContactInfo || "Qayta aloqa ma'lumotlarini tahrirlash"}</h3>
          </div>
          <button type="button" className="account-modal-close" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="elon-modal-form">
          {error && (
            <div className="elon-alert-error" style={{ marginBottom: 16 }}>
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="elon-form-row">
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>Asosiy telefon raqami</label>
              <input
                type="text"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                className="elon-form-input"
                placeholder="+998 71 123 45 67"
              />
            </div>
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>Qo'shimcha telefon raqami</label>
              <input
                type="text"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                className="elon-form-input"
                placeholder="+998 71 765 43 21"
              />
            </div>
          </div>

          <div className="elon-form-group">
            <label>Elektron pochta (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="elon-form-input"
              placeholder="info@uzyolkoprik.uz"
            />
          </div>

          <div className="elon-form-group">
            <label>Ish vaqti</label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="elon-form-input"
              placeholder="Dushanba - Juma: 09:00 - 18:00"
            />
          </div>

          <div className="elon-form-group">
            <label>Bank rekvizitlari</label>
            <textarea
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              rows={3}
              className="elon-form-textarea"
              placeholder="H/r, MFO, INN, Bank nomi..."
            />
          </div>

          <div className="elon-form-group">
            <label>Manzil</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="elon-form-textarea"
              placeholder="Toshkent sh., ..."
            />
          </div>

          <div className="elon-modal-footer">
            <button type="button" className="account-close-btn" onClick={onClose} disabled={saving}>
              {t.cancel || "Bekor qilish"}
            </button>
            <button type="submit" className="btn-add-elon" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>{t.saving || "Saqlanmoqda..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t.save || "Saqlash"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Contact({ site, t, lang, user, onNavigate }) {
  const canManage = Boolean(user && (user.is_superuser || user.permissions?.can_edit_contact));
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [contactData, setContactData] = useState(site.contact || {});
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (site.contact) setContactData(site.contact);
  }, [site.contact]);

  const handleSaveContact = async (payload) => {
    const token = getStoredToken();
    const updated = await updateContactSettings(payload, token);
    setContactData((prev) => ({
      ...prev,
      phones: updated.phones,
      phone_primary: updated.phone_primary,
      phone_secondary: updated.phone_secondary,
      email: updated.email,
      hours: updated.hours,
      bank: updated.bank,
      address: updated.address,
    }));
    setSuccessMsg("Aloqa ma'lumotlari muvaffaqiyatli saqlandi!");
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const phones = contactData.phones?.length ? contactData.phones : [contactData.phone_primary || "+998 71 200 00 00"];

  return (
    <section className="page-shell">
      <PageHero title={t.contactTitle} label={t.contactLabel} />

      {/* Admin Toolbar for can_edit_contact */}
      {canManage && (
        <div className="elon-admin-toolbar glass-panel" style={{ marginBottom: 32 }}>
          <div className="elon-toolbar-info">
            <div className="elon-toolbar-icon">
              <Mail size={22} style={{ color: "var(--accent-cyan)" }} />
            </div>
            <div>
              <h3 className="elon-toolbar-title">Aloqa ma'lumotlarini boshqarish</h3>
              <p className="elon-toolbar-desc">
                Sizga telefon raqamlar, email, ish vaqti, manzil va bank rekvizitlarini tahrirlash huquqi berilgan.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-add-elon"
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil size={16} />
            <span>Ma'lumotlarni tahrirlash</span>
          </button>
        </div>
      )}

      {successMsg && (
        <div className="elon-alert-success" style={{ marginBottom: 24 }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="contact-layout">
        <div className="contact-cards">
          <InfoCard icon={Phone} title={t.phones} lines={phones} />
          <InfoCard icon={Mail} title={t.email} lines={[contactData.email || site.contact?.email || "info@uzyolkoprik.uz"]} />
          <InfoCard icon={Clock3} title={t.workHours} lines={[contactData.hours || t.contactHours || site.contact?.hours || "09:00 - 18:00"]} />
          <InfoCard icon={BriefcaseBusiness} title={t.bankDetails} lines={[contactData.bank || t.bankText || site.contact?.bank || ""]} />
          <InfoCard icon={MapPin} title={t.address} lines={[contactData.address || t.addressText || site.contact?.address || ""]} />
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

      <ContactEditModal
        isOpen={isEditOpen}
        contact={contactData}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveContact}
        t={t}
      />
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

function NarxNavoModal({ isOpen, mode, product, onClose, onSave, t }) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(isEdit && product ? product.name || "" : "");
  const [text, setText] = useState(isEdit && product ? product.text || "" : "");
  const [order, setOrder] = useState(isEdit && product ? product.order ?? 0 : 0);
  const [isActive, setIsActive] = useState(isEdit && product ? product.is_active ?? true : true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(isEdit && product ? product.imageUrl || product.image || null : null);
  const [removeImage, setRemoveImage] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [removeDoc, setRemoveDoc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleDocChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile(file);
      setRemoveDoc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Mahsulot nomini kiriting");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("text", text.trim());
      fd.append("order", String(order));
      fd.append("is_active", isActive ? "true" : "false");
      if (imageFile) {
        fd.append("image", imageFile);
      } else if (removeImage) {
        fd.append("remove_image", "true");
      }
      if (docFile) {
        fd.append("file", docFile);
      } else if (removeDoc) {
        fd.append("remove_file", "true");
      }
      await onSave(fd, isEdit ? product?.id : null);
      onClose();
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="elon-modal-header">
          <div className="elon-modal-title-row">
            <div className="elon-modal-icon">
              {isEdit ? <Pencil size={18} /> : <Plus size={18} />}
            </div>
            <h3>{isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</h3>
          </div>
          <button type="button" className="account-modal-close" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="elon-modal-form">
          {error && (
            <div className="elon-alert-error" style={{ marginBottom: 16 }}>
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="elon-form-group">
            <label>Mahsulot nomi *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Asfalt-beton qorishmasi..."
              required
              className="elon-form-input"
            />
          </div>

          <div className="elon-form-group">
            <label>Tavsif / Narx va xususiyatlar</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Mahsulot turi, xususiyatlari, narxi va shartlari..."
              rows={4}
              className="elon-form-textarea"
            />
          </div>

          <div className="elon-form-row">
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>Tartib raqami</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="elon-form-input"
              />
            </div>
            <div className="elon-form-group" style={{ flex: 1, display: "flex", alignItems: "center", paddingTop: 20 }}>
              <label className="elon-checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Faol (Saytda ko'rinadi)</span>
              </label>
            </div>
          </div>

          <div className="elon-form-group">
            <label>Mahsulot rasmi</label>
            {imagePreview ? (
              <div className="elon-preview-wrap">
                <img src={imagePreview} alt="Preview" className="elon-preview-img" />
                <button
                  type="button"
                  className="elon-preview-remove-btn"
                  onClick={handleRemoveImage}
                >
                  <Trash2 size={14} />
                  <span>Rasmni olib tashlash</span>
                </button>
              </div>
            ) : (
              <div className="elon-file-upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="narx-image-upload"
                  style={{ display: "none" }}
                />
                <label htmlFor="narx-image-upload" className="elon-upload-btn">
                  <ImageIcon size={18} />
                  <span>Rasm tanlash</span>
                </label>
              </div>
            )}
          </div>

          <div className="elon-form-group">
            <label>Hujjat / Narxnoma fayli (PDF, DOC)</label>
            {isEdit && (product?.fileUrl || product?.file) && !docFile && !removeDoc && (
              <div className="elon-existing-file">
                <Paperclip size={16} />
                <span className="elon-existing-filename">{(product.fileUrl || product.file).split("/").pop()}</span>
                <button
                  type="button"
                  className="elon-preview-remove-btn small"
                  onClick={() => setRemoveDoc(true)}
                >
                  <Trash2 size={13} />
                  <span>Olib tashlash</span>
                </button>
              </div>
            )}
            <div className="elon-file-upload-zone">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleDocChange}
                id="narx-doc-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="narx-doc-upload" className="elon-upload-btn">
                <Paperclip size={18} />
                <span>{docFile ? docFile.name : (product?.fileUrl && !removeDoc ? "Faylni almashtirish" : "Hujjat tanlash")}</span>
              </label>
            </div>
          </div>

          <div className="elon-modal-footer">
            <button type="button" className="account-close-btn" onClick={onClose} disabled={saving}>
              Bekor qilish
            </button>
            <button type="submit" className="btn-add-elon" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Saqlash</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PriceGridPage({ page, site, t, lang, user, onNavigate }) {
  const canManage = Boolean(user && (user.is_superuser || user.permissions?.can_edit_narx_navo));
  const [products, setProducts] = useState(page.narxNavoProducts || []);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const catalogItems = page.catalogItems || [];

  useEffect(() => {
    if (page.narxNavoProducts) setProducts(page.narxNavoProducts);
  }, [page.narxNavoProducts]);

  const reloadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchNarxNavoProducts();
      const list = Array.isArray(data) ? data : (data?.results || []);
      setProducts(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (formData, id) => {
    const token = getStoredToken();
    if (id) {
      await updateNarxNavoProduct(id, formData, token);
      setSuccessMsg("Mahsulot muvaffaqiyatli yangilandi!");
    } else {
      await createNarxNavoProduct(formData, token);
      setSuccessMsg("Yangi mahsulot muvaffaqiyatli qo'shildi!");
    }
    await reloadProducts();
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = getStoredToken();
      await deleteNarxNavoProduct(deleteTarget.id, token);
      setSuccessMsg("Mahsulot muvaffaqiyatli o'chirildi!");
      setDeleteTarget(null);
      await reloadProducts();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || "Xatolik yuz berdi");
      setTimeout(() => setErrorMsg(null), 3500);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page.slug, page.title, t)} label={t.infoLabel} />

      {/* Admin Toolbar for can_edit_narx_navo */}
      {canManage && (
        <div className="elon-admin-toolbar glass-panel" style={{ marginBottom: 32 }}>
          <div className="elon-toolbar-info">
            <div className="elon-toolbar-icon">
              <Package size={22} style={{ color: "var(--accent-cyan)" }} />
            </div>
            <div>
              <h3 className="elon-toolbar-title">Narx-navo mahsulotlarini boshqarish paneli</h3>
              <p className="elon-toolbar-desc">
                Sizga narx-navo ro'yxatiga yangi mahsulot qo'shish, tahrirlash va o'chirish huquqi berilgan.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-add-elon"
            onClick={() => {
              setActiveProduct(null);
              setModalMode("create");
            }}
          >
            <Plus size={18} />
            <span>Yangi mahsulot qo'shish</span>
          </button>
        </div>
      )}

      {successMsg && (
        <div className="elon-alert-success" style={{ marginBottom: 24 }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="elon-alert-error" style={{ marginBottom: 24 }}>
          <X size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

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
          {canManage && (
            <button
              type="button"
              className="btn-add-elon"
              style={{ marginTop: 16 }}
              onClick={() => {
                setActiveProduct(null);
                setModalMode("create");
              }}
            >
              <Plus size={16} />
              <span>Yangi mahsulot qo'shish</span>
            </button>
          )}
        </div>
      ) : null}

      {products.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, marginTop: 16 }}>
            {products.map((product) => (
              <div key={product.id} className={`glass-panel price-item-card ${!product.is_active ? "inactive" : ""}`}
                onClick={() => setSelectedProduct(product)}
                style={{ padding: 0, cursor: "pointer", display: "flex", flexDirection: "column",
                  transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  border: "1px solid var(--border-dim)", borderRadius: "var(--radius-md)", overflow: "hidden", height: "100%", position: "relative" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.boxShadow = "var(--shadow-glow)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border-dim)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Admin controls on card */}
                {canManage && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      display: "flex",
                      gap: 6,
                      zIndex: 10,
                      background: "rgba(0,0,0,0.65)",
                      backdropFilter: "blur(6px)",
                      padding: "4px 8px",
                      borderRadius: "8px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!product.is_active && (
                      <span className="elon-badge-draft" style={{ marginRight: 4 }}>Qoralama</span>
                    )}
                    <button
                      type="button"
                      className="elon-btn-icon edit"
                      onClick={() => {
                        setActiveProduct(product);
                        setModalMode("edit");
                      }}
                      title="Tahrirlash"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      className="elon-btn-icon delete"
                      onClick={() => setDeleteTarget(product)}
                      title="O'chirish"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

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
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", marginBottom: 8, lineHeight: 1.4 }}>{item.title}</h3>
                  {item.description && (
                    <p style={{ fontSize: 14, color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5, margin: 0 }}>
                      {item.description}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-cyan)", fontSize: 14, fontWeight: 600, marginTop: "auto", paddingTop: 8 }}>
                  <span>{t.viewDetails}</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 }} onClick={() => setSelectedProduct(null)}>
          <div className="glass-panel" style={{ maxWidth: 650, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 32, position: "relative", display: "grid", gap: 24, animation: "fadeIn 0.2s ease-out" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: "absolute", top: 20, right: 20, color: "var(--text-muted)", cursor: "pointer", zIndex: 10, background: "none", border: "none" }}><X size={24} /></button>
            {selectedProduct.imageUrl && (
              <div style={{ width: "100%", maxHeight: 300, overflow: "hidden", borderRadius: 8, background: "var(--bg-surface-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} style={{ width: "100%", maxHeight: 300, objectFit: "contain" }} />
              </div>
            )}
            <div>
              <span style={{ fontSize: 13, textTransform: "uppercase", color: "var(--accent-cyan)", fontWeight: 700, display: "block", marginBottom: 8 }}>{t.productInfo}</span>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-main)", lineHeight: 1.3 }}>{selectedProduct.name}</h2>
            </div>
            {selectedProduct.text && (
              <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 16 }}>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-main)", whiteSpace: "pre-line" }}>{selectedProduct.text}</p>
              </div>
            )}
            <div style={{ display: "grid", gap: 16, borderTop: "1px solid var(--border-dim)", paddingTop: 20 }}>
              {selectedProduct.price && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: 15 }}>{t.priceLabel}:</span>
                  <strong style={{ fontSize: 18, color: "var(--accent-cyan)" }}>{selectedProduct.price}</strong>
                </div>
              )}
              {selectedProduct.fileUrl && (
                <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 8 }}>
                  <a href={selectedProduct.fileUrl} target="_blank" rel="noreferrer" className="btn-primary"
                    style={{ padding: "12px 28px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }} download>
                    <span>{t.downloadFile}</span><ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedCatalog && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 }} onClick={() => setSelectedCatalog(null)}>
          <div className="glass-panel" style={{ maxWidth: 600, width: "100%", padding: 32, position: "relative", display: "grid", gap: 24, animation: "fadeIn 0.2s ease-out" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedCatalog(null)} style={{ position: "absolute", top: 20, right: 20, color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none" }}><X size={24} /></button>
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

      {/* Modals */}
      <NarxNavoModal
        isOpen={Boolean(modalMode)}
        mode={modalMode}
        product={activeProduct}
        onClose={() => setModalMode(null)}
        onSave={handleSaveProduct}
        t={t}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        elon={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        t={t}
      />
    </section>
  );
}

function VacancyModal({ isOpen, mode, vacancy, onClose, onSave, t }) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(isEdit && vacancy ? vacancy.name || "" : "");
  const [text, setText] = useState(isEdit && vacancy ? vacancy.text || "" : "");
  const [order, setOrder] = useState(isEdit && vacancy ? vacancy.order ?? 0 : 0);
  const [isActive, setIsActive] = useState(isEdit && vacancy ? vacancy.is_active ?? true : true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(isEdit && vacancy ? vacancy.imageUrl || vacancy.image || null : null);
  const [removeImage, setRemoveImage] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [removeDoc, setRemoveDoc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleDocChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile(file);
      setRemoveDoc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Vakansiya nomini kiriting");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("text", text.trim());
      fd.append("order", String(order));
      fd.append("is_active", isActive ? "true" : "false");
      if (imageFile) {
        fd.append("image", imageFile);
      } else if (removeImage) {
        fd.append("remove_image", "true");
      }
      if (docFile) {
        fd.append("file", docFile);
      } else if (removeDoc) {
        fd.append("remove_file", "true");
      }
      await onSave(fd, isEdit ? vacancy?.id : null);
      onClose();
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="elon-modal-header">
          <div className="elon-modal-title-row">
            <div className="elon-modal-icon">
              {isEdit ? <Pencil size={18} /> : <Plus size={18} />}
            </div>
            <h3>{isEdit ? "Vakansiyani tahrirlash" : "Yangi vakansiya qo'shish"}</h3>
          </div>
          <button type="button" className="account-modal-close" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="elon-modal-form">
          {error && (
            <div className="elon-alert-error" style={{ marginBottom: 16 }}>
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="elon-form-group">
            <label>Lavozim nomi *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Bosh muhandis, Yo'l ustasi..."
              required
              className="elon-form-input"
            />
          </div>

          <div className="elon-form-group">
            <label>Talablar va vazifalar (Tavsif)</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nomzodga qo'yiladigan talablar, ish tajribasi, maosh va vazifalar..."
              rows={5}
              className="elon-form-textarea"
            />
          </div>

          <div className="elon-form-row">
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>Tartib raqami</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="elon-form-input"
              />
            </div>
            <div className="elon-form-group" style={{ flex: 1, display: "flex", alignItems: "center", paddingTop: 20 }}>
              <label className="elon-checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Faol (Saytda ko'rinadi)</span>
              </label>
            </div>
          </div>

          <div className="elon-form-group">
            <label>Vakansiya rasmi / banner (Ixtiyoriy)</label>
            {imagePreview ? (
              <div className="elon-preview-wrap">
                <img src={imagePreview} alt="Preview" className="elon-preview-img" />
                <button
                  type="button"
                  className="elon-preview-remove-btn"
                  onClick={handleRemoveImage}
                >
                  <Trash2 size={14} />
                  <span>Rasmni olib tashlash</span>
                </button>
              </div>
            ) : (
              <div className="elon-file-upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="vacancy-image-upload"
                  style={{ display: "none" }}
                />
                <label htmlFor="vacancy-image-upload" className="elon-upload-btn">
                  <ImageIcon size={18} />
                  <span>Rasm tanlash</span>
                </label>
              </div>
            )}
          </div>

          <div className="elon-form-group">
            <label>Biriktirilgan hujjat / ariza namunasi (PDF, DOC)</label>
            {isEdit && (vacancy?.fileUrl || vacancy?.file) && !docFile && !removeDoc && (
              <div className="elon-existing-file">
                <Paperclip size={16} />
                <span className="elon-existing-filename">{(vacancy.fileUrl || vacancy.file).split("/").pop()}</span>
                <button
                  type="button"
                  className="elon-preview-remove-btn small"
                  onClick={() => setRemoveDoc(true)}
                >
                  <Trash2 size={13} />
                  <span>Olib tashlash</span>
                </button>
              </div>
            )}
            <div className="elon-file-upload-zone">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleDocChange}
                id="vacancy-doc-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="vacancy-doc-upload" className="elon-upload-btn">
                <Paperclip size={18} />
                <span>{docFile ? docFile.name : (vacancy?.fileUrl && !removeDoc ? "Faylni almashtirish" : "Hujjat tanlash")}</span>
              </label>
            </div>
          </div>

          <div className="elon-modal-footer">
            <button type="button" className="account-close-btn" onClick={onClose} disabled={saving}>
              Bekor qilish
            </button>
            <button type="submit" className="btn-add-elon" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Saqlash</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VacanciesPage({ page, site, t, lang, user, onNavigate }) {
  const canManage = Boolean(user && (user.is_superuser || user.permissions?.can_edit_vacancies));
  const [vacancies, setVacancies] = useState(page.vacancies || []);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [activeVacancy, setActiveVacancy] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  useEffect(() => {
    if (page.vacancies) setVacancies(page.vacancies);
  }, [page.vacancies]);

  const reloadVacancies = async () => {
    setLoading(true);
    try {
      const data = await fetchVacancies();
      const list = Array.isArray(data) ? data : (data?.results || []);
      setVacancies(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVacancy = async (formData, id) => {
    const token = getStoredToken();
    if (id) {
      await updateVacancy(id, formData, token);
      setSuccessMsg("Bo'sh ish o'rni muvaffaqiyatli yangilandi!");
    } else {
      await createVacancy(formData, token);
      setSuccessMsg("Yangi bo'sh ish o'rni muvaffaqiyatli qo'shildi!");
    }
    await reloadVacancies();
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = getStoredToken();
      await deleteVacancy(deleteTarget.id, token);
      setSuccessMsg("Bo'sh ish o'rni muvaffaqiyatli o'chirildi!");
      setDeleteTarget(null);
      await reloadVacancies();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || "O'chirishda xatolik yuz berdi");
      setTimeout(() => setErrorMsg(null), 3500);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page.slug, page.title, t)} label="Karyera & Imkoniyatlar" />

      {/* Admin toolbar if canManage */}
      {canManage && (
        <div className="elon-admin-toolbar glass-panel" style={{ marginBottom: 32 }}>
          <div className="elon-toolbar-info">
            <div className="elon-toolbar-icon">
              <BriefcaseBusiness size={22} style={{ color: "var(--accent-cyan)" }} />
            </div>
            <div>
              <h3 className="elon-toolbar-title">Bo'sh ish o'rinlarini boshqarish paneli</h3>
              <p className="elon-toolbar-desc">
                Sizga vakansiyalarni qo'shish, tahrirlash va o'chirish huquqi berilgan.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-add-elon"
            onClick={() => {
              setActiveVacancy(null);
              setModalMode("create");
            }}
          >
            <Plus size={18} />
            <span>Yangi vakansiya qo'shish</span>
          </button>
        </div>
      )}

      {successMsg && (
        <div className="elon-alert-success" style={{ marginBottom: 24 }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="elon-alert-error" style={{ marginBottom: 24 }}>
          <X size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Vacancy cards grid */}
      {vacancies.length === 0 ? (
        <div className="glass-panel" style={{ padding: 48, textAlign: "center" }}>
          <BriefcaseBusiness size={40} style={{ color: "var(--accent-cyan)", opacity: 0.6, marginBottom: 12 }} />
          <p style={{ color: "var(--text-muted)", fontSize: 16 }}>Hozircha bo'sh ish o'rinlari mavjud emas.</p>
          {canManage && (
            <button
              type="button"
              className="btn-add-elon"
              style={{ marginTop: 16 }}
              onClick={() => {
                setActiveVacancy(null);
                setModalMode("create");
              }}
            >
              <Plus size={16} />
              <span>Yangi vakansiya qo'shish</span>
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {vacancies.map((item) => (
            <div
              key={item.id}
              className={`glass-panel price-item-card ${!item.is_active ? "inactive" : ""}`}
              onClick={() => setSelectedVacancy(item)}
              style={{
                padding: 24,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-dim)",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(6,182,212,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)" }}>
                    <BriefcaseBusiness size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>{item.name}</h3>
                    {!item.is_active && <span className="elon-badge-draft" style={{ marginTop: 4 }}>Qoralama</span>}
                  </div>
                </div>

                {canManage && (
                  <div className="elon-card-admin-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="elon-btn-icon edit"
                      onClick={() => {
                        setActiveVacancy(item);
                        setModalMode("edit");
                      }}
                      title="Tahrirlash"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      className="elon-btn-icon delete"
                      onClick={() => setDeleteTarget(item)}
                      title="O'chirish"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {item.text && (
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {item.text}
                </p>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border-dim)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-cyan)", fontSize: 13, fontWeight: 600 }}>
                  <Eye size={15} />
                  <span>Batafsil ma'lumot</span>
                </div>
                {item.fileUrl && (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "var(--text-muted)", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 4 }}
                  >
                    <Paperclip size={14} />
                    <span>Fayl</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Vacancy Detail Modal */}
      {selectedVacancy && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 24,
          }}
          onClick={() => setSelectedVacancy(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 32,
              position: "relative",
              display: "grid",
              gap: 20,
              animation: "fadeIn 0.2s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVacancy(null)}
              style={{ position: "absolute", top: 20, right: 20, color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none" }}
            >
              <X size={24} />
            </button>

            <div>
              <span style={{ fontSize: 13, textTransform: "uppercase", color: "var(--accent-cyan)", fontWeight: 700, display: "block", marginBottom: 8 }}>
                Vakansiya tafsilotlari
              </span>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                {selectedVacancy.name}
              </h2>
            </div>

            {selectedVacancy.text && (
              <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 16 }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-main)", marginBottom: 8 }}>Vazifalar va talablar:</h4>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-muted)", whiteSpace: "pre-line", margin: 0 }}>
                  {selectedVacancy.text}
                </p>
              </div>
            )}

            {selectedVacancy.fileUrl && (
              <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 16 }}>
                <a
                  href={selectedVacancy.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 14 }}
                >
                  <Paperclip size={16} />
                  <span>Biriktirilgan faylni yuklab olish</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Ariza topshirish uchun:</span>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setSelectedVacancy(null);
                  onNavigate("qayta-aloqa");
                }}
              >
                <Phone size={15} />
                <span>Aloqaga chiqish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <VacancyModal
        isOpen={Boolean(modalMode)}
        mode={modalMode}
        vacancy={activeVacancy}
        onClose={() => setModalMode(null)}
        onSave={handleSaveVacancy}
        t={t}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        elon={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        t={t}
      />
    </section>
  );
}

function FilialModal({ isOpen, mode, filial, onClose, onSave, t }) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(isEdit && filial ? filial.name || "" : "");
  const [region, setRegion] = useState(isEdit && filial ? filial.region || "" : "");
  const [director, setDirector] = useState(isEdit && filial ? filial.director || "" : "");
  const [phone, setPhone] = useState(isEdit && filial ? filial.phone || "" : "");
  const [address, setAddress] = useState(isEdit && filial ? filial.address || "" : "");
  const [status, setStatus] = useState(isEdit && filial ? filial.status || "Faol" : "Faol");
  const [tasks, setTasks] = useState(isEdit && filial ? filial.tasks || "" : "");
  const [description, setDescription] = useState(isEdit && filial ? filial.description || "" : "");
  const [order, setOrder] = useState(isEdit && filial ? filial.order ?? 0 : 0);
  const [isActive, setIsActive] = useState(isEdit && filial ? filial.is_active ?? true : true);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(isEdit && filial ? filial.imageUrl || filial.image || null : null);
  const [removeImage, setRemoveImage] = useState(false);

  const [dirImageFile, setDirImageFile] = useState(null);
  const [dirImagePreview, setDirImagePreview] = useState(isEdit && filial ? filial.directorImageUrl || filial.directorImage || null : null);
  const [removeDirImage, setRemoveDirImage] = useState(false);

  const [docFile, setDocFile] = useState(null);
  const [removeDoc, setRemoveDoc] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleDirImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDirImageFile(file);
      setDirImagePreview(URL.createObjectURL(file));
      setRemoveDirImage(false);
    }
  };

  const handleDocChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile(file);
      setRemoveDoc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Iltimos, filial nomini kiriting.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("region", region.trim());
      fd.append("director", director.trim());
      fd.append("phone", phone.trim());
      fd.append("address", address.trim());
      fd.append("status", status.trim() || "Faol");
      fd.append("tasks", tasks.trim());
      fd.append("description", description.trim());
      fd.append("order", String(order || 0));
      fd.append("is_active", isActive ? "true" : "false");

      if (imageFile) {
        fd.append("image", imageFile);
      } else if (removeImage) {
        fd.append("remove_image", "true");
      }

      if (dirImageFile) {
        fd.append("director_image", dirImageFile);
      } else if (removeDirImage) {
        fd.append("remove_director_image", "true");
      }

      if (docFile) {
        fd.append("file", docFile);
      } else if (removeDoc) {
        fd.append("remove_file", "true");
      }

      await onSave(fd, isEdit ? filial?.id : null);
      onClose();
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="elon-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="elon-modal-header">
          <div className="elon-modal-title-row">
            <div className="elon-modal-icon">
              {isEdit ? <Pencil size={18} /> : <Plus size={18} />}
            </div>
            <h3>{isEdit ? (t.editFilial || "Filialni tahrirlash") : (t.addFilial || "Yangi filial qo'shish")}</h3>
          </div>
          <button type="button" className="account-modal-close" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="elon-modal-form">
          {error && (
            <div className="elon-alert-error" style={{ marginBottom: 16 }}>
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="elon-form-group">
            <label>Filial nomi *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Toshkent Bosh Filiali..."
              required
              className="elon-form-input"
            />
          </div>

          <div className="elon-form-row">
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>Hudud (Viloyat)</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Masalan: Toshkent viloyati"
                className="elon-form-input"
              />
            </div>
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>Filial rahbari (Direktor)</label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="F.I.SH."
                className="elon-form-input"
              />
            </div>
          </div>

          <div className="elon-form-row">
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>Telefon raqami</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 71 123 45 67"
                className="elon-form-input"
              />
            </div>
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>Holati (Status)</label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Faol yoki Asosiy bazasi"
                className="elon-form-input"
              />
            </div>
          </div>

          <div className="elon-form-group">
            <label>Manzil</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="To'liq manzil..."
              className="elon-form-input"
            />
          </div>

          <div className="elon-form-group">
            <label>Asosiy faoliyati va vazifalari</label>
            <textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="Filialning asosiy yo'nalishlari..."
              rows={3}
              className="elon-form-textarea"
            />
          </div>

          <div className="elon-form-group">
            <label>Filial haqida qisqacha ma'lumot</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Filial tarixi va tavsifi..."
              rows={3}
              className="elon-form-textarea"
            />
          </div>

          <div className="elon-form-row">
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>Tartib raqami</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="elon-form-input"
              />
            </div>
            <div className="elon-form-group" style={{ flex: 1, display: "flex", alignItems: "center", paddingTop: 20 }}>
              <label className="elon-checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Faol (Saytda ko'rinadi)</span>
              </label>
            </div>
          </div>

          <div className="elon-form-row">
            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>{t.branchPhoto || "Filial rasmi"}</label>
              {imagePreview ? (
                <div className="elon-preview-wrap">
                  <img src={imagePreview} alt="Preview" className="elon-preview-img" />
                  <button
                    type="button"
                    className="elon-preview-remove-btn small"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setRemoveImage(true);
                    }}
                  >
                    <Trash2 size={13} />
                    <span>O'chirish</span>
                  </button>
                </div>
              ) : (
                <div className="elon-file-upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="filial-image-upload"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="filial-image-upload" className="elon-upload-btn">
                    <ImageIcon size={16} />
                    <span>Rasm tanlash</span>
                  </label>
                </div>
              )}
            </div>

            <div className="elon-form-group" style={{ flex: 1 }}>
              <label>{t.directorPhoto || "Direktor fotosurati"}</label>
              {dirImagePreview ? (
                <div className="elon-preview-wrap">
                  <img src={dirImagePreview} alt="Director" className="elon-preview-img" style={{ borderRadius: "50%", width: 55, height: 55 }} />
                  <button
                    type="button"
                    className="elon-preview-remove-btn small"
                    onClick={() => {
                      setDirImageFile(null);
                      setDirImagePreview(null);
                      setRemoveDirImage(true);
                    }}
                  >
                    <Trash2 size={13} />
                    <span>O'chirish</span>
                  </button>
                </div>
              ) : (
                <div className="elon-file-upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDirImageChange}
                    id="filial-director-upload"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="filial-director-upload" className="elon-upload-btn">
                    <UserRound size={16} />
                    <span>Rasm tanlash</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="elon-form-group">
            <label>Nizom yoki Hujjat (PDF/DOC)</label>
            {isEdit && (filial?.fileUrl || filial?.file) && !docFile && !removeDoc && (
              <div className="elon-existing-file">
                <Paperclip size={16} />
                <span className="elon-existing-filename">{(filial.fileUrl || filial.file).split("/").pop()}</span>
                <button
                  type="button"
                  className="elon-preview-remove-btn small"
                  onClick={() => setRemoveDoc(true)}
                >
                  <Trash2 size={13} />
                  <span>Olib tashlash</span>
                </button>
              </div>
            )}
            <div className="elon-file-upload-zone">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleDocChange}
                id="filial-doc-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="filial-doc-upload" className="elon-upload-btn">
                <Paperclip size={18} />
                <span>{docFile ? docFile.name : (filial?.fileUrl && !removeDoc ? "Faylni almashtirish" : "Hujjat tanlash")}</span>
              </label>
            </div>
          </div>

          <div className="elon-modal-footer">
            <button
              type="button"
              className="account-close-btn"
              onClick={onClose}
              disabled={saving}
            >
              {t.cancel || "Bekor qilish"}
            </button>
            <button
              type="submit"
              className="btn-add-elon"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>{t.saving || "Saqlanmoqda..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t.save || "Saqlash"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FiliallarPage({ page, site, t, lang, user, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);

  const canManage = Boolean(user && (user.is_superuser || user.permissions?.can_edit_filiallar));

  const [branches, setBranches] = useState(page?.branches || []);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [activeFilial, setActiveFilial] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const reloadBranches = async () => {
    setLoading(true);
    try {
      const token = getStoredToken();
      const data = await fetchFiliallar(token);
      const list = Array.isArray(data) ? data : (data?.results || []);
      setBranches(list);
    } catch (err) {
      console.error("reloadBranches error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page?.branches && page.branches.length > 0) {
      setBranches(page.branches);
    }
  }, [page?.branches]);

  const handleOpenCreate = () => {
    setActiveFilial(null);
    setModalMode("create");
  };

  const handleOpenEdit = (filial) => {
    setActiveFilial(filial);
    setModalMode("edit");
  };

  const handleSaveFilial = async (formData, id) => {
    const token = getStoredToken();
    if (id) {
      await updateFilial(id, formData, token);
      setSuccessMsg("Filial muvaffaqiyatli yangilandi!");
    } else {
      await createFilial(formData, token);
      setSuccessMsg("Yangi filial muvaffaqiyatli qo'shildi!");
    }
    await reloadBranches();
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = getStoredToken();
      await deleteFilial(deleteTarget.id, token);
      setSuccessMsg("Filial muvaffaqiyatli o'chirildi!");
      setDeleteTarget(null);
      await reloadBranches();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || "O'chirishda xatolik yuz berdi");
      setTimeout(() => setErrorMsg(null), 3500);
    } finally {
      setDeleting(false);
    }
  };

  const localizedBranches = useMemo(() => {
    return branches.map((b) => getLocalizedBranch(b, lang));
  }, [branches, lang]);

  const filteredBranches = localizedBranches.filter(
    (b) =>
      (b.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.region || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.director || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageDesc =
    (lang === "uz" ? (page?.content || page?.status) : null) ||
    t.branchesSubtitle ||
    page?.content ||
    page?.status ||
    "Respublika boʻyicha “Oʻzyoʻlkoʻprik” klasteri hududiy filiallari va ishlab chiqarish bazalari.";

  return (
    <section className="page-shell">
      <PageHero title={getNavTitle(page?.slug, page?.title, t) || t.filiallarTitle} label={t.branchesLabel} />

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 32 }}>
        {canManage && (
          <div className="elon-admin-toolbar glass-panel">
            <div className="elon-toolbar-info">
              <div className="elon-toolbar-icon">
                <Building2 size={22} style={{ color: "var(--accent-cyan)" }} />
              </div>
              <div>
                <h3 className="elon-toolbar-title">{t.manageFiliallarTitle || "Filiallarni boshqarish paneli"}</h3>
                <p className="elon-toolbar-desc">{t.manageFiliallarNotice || "Sizga filiallar ma'lumotlarini qo'shish, tahrirlash va o'chirish huquqi berilgan."}</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-add-elon"
              onClick={handleOpenCreate}
            >
              <Plus size={18} />
              <span>{t.addFilial || "Yangi filial qo'shish"}</span>
            </button>
          </div>
        )}

        {successMsg && (
          <div className="elon-alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="elon-alert-error">
            <X size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="glass-panel" style={{ padding: 32, borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <Building2 size={32} style={{ color: "var(--accent-cyan)" }} />
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                {t.branchesHeading} ({branches.length})
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                {pageDesc}
              </p>
            </div>
          </div>

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
              className={`glass-panel price-item-card ${!branch.is_active ? "inactive" : ""}`}
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
                position: "relative",
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
              {canManage && (
                <div
                  className="elon-card-admin-actions"
                  style={{ position: "absolute", top: 12, right: 12, zIndex: 5 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!branch.is_active && (
                    <span className="elon-badge-draft">Qoralama</span>
                  )}
                  <button
                    type="button"
                    className="elon-btn-icon edit"
                    onClick={() => handleOpenEdit(branch)}
                    title={t.editFilial || "Tahrirlash"}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="elon-btn-icon delete"
                    onClick={() => setDeleteTarget(branch)}
                    title={t.deleteFilial || "O'chirish"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              {(branch.imageUrl || branch.image) && (
                <div style={{ width: "100%", borderRadius: 8, overflow: "hidden", maxHeight: 180 }}>
                  <img
                    src={branch.imageUrl || branch.image}
                    alt={branch.name}
                    style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, paddingRight: canManage ? 75 : 0 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", margin: 0, lineHeight: 1.4 }}>
                  {branch.name}
                </h3>
                {branch.status && (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 12,
                      background: (branch.status || "").toLowerCase().includes("asosiy") || (branch.status || "").toLowerCase().includes("основн") || (branch.status || "").toLowerCase().includes("main") ? "rgba(6, 182, 212, 0.2)" : "rgba(16, 185, 129, 0.15)",
                      color: (branch.status || "").toLowerCase().includes("asosiy") || (branch.status || "").toLowerCase().includes("основн") || (branch.status || "").toLowerCase().includes("main") ? "var(--accent-cyan)" : "#10b981",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {branch.status}
                  </span>
                )}
              </div>

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
                {(branch.directorImageUrl || branch.directorImage) ? (
                  <img
                    src={branch.directorImageUrl || branch.directorImage}
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

      <FilialModal
        isOpen={Boolean(modalMode)}
        mode={modalMode}
        filial={activeFilial}
        onClose={() => setModalMode(null)}
        onSave={handleSaveFilial}
        t={t}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        elon={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        t={t}
      />

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
                      <span style={{
                        fontSize: 13,
                        padding: "4px 14px",
                        borderRadius: 14,
                        background: (selectedBranch.status || "").toLowerCase().includes("asosiy") || (selectedBranch.status || "").toLowerCase().includes("основн") || (selectedBranch.status || "").toLowerCase().includes("main") ? "rgba(6,182,212,0.15)" : "rgba(16,185,129,0.15)",
                        color: (selectedBranch.status || "").toLowerCase().includes("asosiy") || (selectedBranch.status || "").toLowerCase().includes("основн") || (selectedBranch.status || "").toLowerCase().includes("main") ? "var(--accent-cyan)" : "#10b981",
                        fontWeight: 700,
                      }}>
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

function LoginModal({ onClose, onLogin, t }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError(t.loginError || "Login va parolni kiriting.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onLogin(username.trim(), password);
    } catch (err) {
      setError(err.message || t.loginError || "Login yoki parol noto'g'ri.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="account-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="account-modal-close" onClick={onClose} aria-label="Yopish">
          <X size={20} />
        </button>

        <div className="account-modal-header">
          <div className="account-icon-box">
            <Lock size={26} />
          </div>
          <h3>{t.accountTitle || "Shaxsiy Kabinet"}</h3>
          <p>{t.loginSubtitle || "Boshqaruv tizimiga kirish uchun ma'lumotlarni kiriting"}</p>
        </div>

        {error && (
          <div className="account-error-alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="account-form">
          <div className="account-form-group">
            <label>{t.username || "Login"}</label>
            <div className="account-input-wrap">
              <UserRound size={17} className="input-icon" />
              <input
                type="text"
                placeholder={t.username || "Login"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="account-form-group">
            <label>{t.password || "Parol"}</label>
            <div className="account-input-wrap">
              <Lock size={17} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t.password || "Parol"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Parolni ko'rsatish"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="account-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>{t.loading || "Kirilmoqda..."}</span>
            ) : (
              <>
                <Lock size={16} />
                <span>{t.loginBtn || "Tizimga kirish"}</span>
              </>
            )}
          </button>
        </form>

        <div className="account-modal-note">
          <small>
            ℹ️ {t.loginNotice || "Ruxsat va hisoblar faqat Bosh Administrator (Superuser) tomonidan taqdim etiladi."}
          </small>
        </div>
      </div>
    </div>
  );
}

const SECTION_PERMISSIONS = [
  {
    key: "can_edit_site_settings",
    siteSlug: "bosh-sahifa",
    icon: Settings,
    badge: "Asosiy",
  },
  {
    key: "can_edit_home_content",
    siteSlug: "bosh-sahifa",
    icon: Sparkles,
    badge: "Bosh sahifa",
  },
  {
    key: "can_edit_leaders",
    siteSlug: "rahbariyat",
    icon: UserRound,
    badge: "Rahbariyat",
  },
  {
    key: "can_edit_announcements",
    siteSlug: "elonlar",
    icon: Sparkles,
    badge: "E'lonlar (Announcement)",
  },
  {
    key: "can_edit_elonlar",
    siteSlug: "elonlar",
    icon: Megaphone,
    badge: "E'lonlar (mahsulot)",
  },
  {
    key: "can_edit_korxona_ustavi",
    siteSlug: "korxona-ustavi",
    icon: FileText,
    badge: "Hujjatlar",
  },
  {
    key: "can_edit_tashkiliy_tuzilma",
    siteSlug: "tashkiliy-tuzilma",
    icon: Layers,
    badge: "Tuzilma",
  },
  {
    key: "can_edit_katalog",
    siteSlug: "katalog",
    icon: Package,
    badge: "Mahsulotlar",
  },
  {
    key: "can_edit_nomenklatura",
    siteSlug: "nomenklatura",
    icon: Package,
    badge: "Nomenklatura",
  },
  {
    key: "can_edit_narx_navo",
    siteSlug: "narx-navo",
    icon: BriefcaseBusiness,
    badge: "Narx-navo",
  },
  {
    key: "can_edit_vacancies",
    siteSlug: "bosh-ish-orinlari",
    icon: BriefcaseBusiness,
    badge: "Vakansiyalar",
  },
  {
    key: "can_edit_filiallar",
    siteSlug: "filiallar",
    icon: Building2,
    badge: "Filiallar",
  },
  {
    key: "can_edit_contact",
    siteSlug: "qayta-aloqa",
    icon: Mail,
    badge: "Aloqa",
  },
];

function AccountPanel({ user, onClose, onLogout, onNavigate, t }) {
  const isSuper = Boolean(user.is_superuser);
  const perms = user.permissions || {};

  const allowedSections = useMemo(() => {
    return SECTION_PERMISSIONS.filter((sec) => isSuper || perms[sec.key]);
  }, [isSuper, perms]);

  return (
    <div className="account-modal-backdrop" onClick={onClose}>
      <div className="account-panel-card" onClick={(e) => e.stopPropagation()}>
        <button className="account-modal-close" onClick={onClose} aria-label="Yopish">
          <X size={20} />
        </button>

        {/* User Header */}
        <div className="account-panel-header">
          <div className="account-avatar">
            {(user.username || "U")[0].toUpperCase()}
          </div>
          <div className="account-panel-user-info">
            <div className="account-panel-name-row">
              <h3>{user.first_name || user.last_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}</h3>
              {isSuper ? (
                <span className="account-badge superuser">
                  <ShieldCheck size={13} />
                  {t.superuserBadge || "Superuser"}
                </span>
              ) : (
                <span className="account-badge staff">
                  <Shield size={13} />
                  {t.staffBadge || "Bo'lim administratori"}
                </span>
              )}
            </div>
            <p className="account-panel-sub">@{user.username}</p>
          </div>
        </div>

        {/* Superuser Special Banner */}
        {isSuper && (
          <div className="superuser-quick-banner">
            <div className="banner-text">
              <strong>👑 {t.superuserBannerTitle || "Bosh Administrator Huquqlari"}</strong>
              <p>{t.superuserBannerDesc || "Siz saytning barcha bo'limlarini boshqarish va xodimlarga ruxsat berish imkoniyatiga egasiz."}</p>
            </div>
            <div className="banner-actions">
              <a
                href="/admin/auth/user/"
                target="_blank"
                rel="noreferrer"
                className="banner-link-btn"
              >
                <span>{t.manageUsers || "Foydalanuvchilarni boshqarish"}</span>
                <ExternalLink size={14} />
              </a>
              <a
                href="/admin/"
                target="_blank"
                rel="noreferrer"
                className="banner-link-btn secondary"
              >
                <span>{t.goToAdmin || "Admin panel"}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Permitted Sections */}
        <div className="account-sections-wrap">
          <div className="account-sections-title-row">
            <h4>{t.permissions || "Ruxsat etilgan bo'limlar"}</h4>
            <span className="section-count-badge">
              {allowedSections.length} ta bo'lim
            </span>
          </div>

          {allowedSections.length === 0 ? (
            <div className="account-empty-perms">
              <Shield size={32} style={{ opacity: 0.5, marginBottom: 8 }} />
              <p style={{ fontWeight: 600, color: "var(--text-main)" }}>
                {t.noPermissions || "Sizga hozircha ruxsatlar biriktirilmagan."}
              </p>
              <small style={{ color: "var(--text-muted)" }}>
                Superuser sizga bo'limlar uchun ruxsat bergandan so'ng, ular shu yerda ko'rinadi.
              </small>
            </div>
          ) : (
            <div className="account-sections-grid">
              {allowedSections.map((sec) => {
                const IconComp = sec.icon || FileText;
                const label = (t.permLabels && t.permLabels[sec.key]) || sec.key;
                return (
                  <div key={sec.key} className="account-section-card">
                    <div className="section-card-top">
                      <div className="section-card-icon">
                        <IconComp size={18} />
                      </div>
                      <div className="section-card-info">
                        <strong>{label}</strong>
                        <span className="section-status-tag">{sec.badge}</span>
                      </div>
                    </div>

                    <div className="section-card-actions">
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate(sec.siteSlug);
                          onClose();
                        }}
                        className="btn-edit-admin"
                        style={{
                          background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontWeight: 600,
                        }}
                        title={t.manageSection || "Bo'limni boshqarish"}
                      >
                        <Pencil size={13} />
                        <span>{t.manageSection || "Bo'limni boshqarish"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate(sec.siteSlug);
                          onClose();
                        }}
                        className="btn-view-site"
                        title="Saytdagi sahifani ko'rish"
                      >
                        <span>Sahifani ko'rish</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="account-panel-footer">
          <button
            type="button"
            className="account-logout-btn"
            onClick={onLogout}
          >
            <LogOut size={16} />
            <span>{t.logout || "Chiqish"}</span>
          </button>
          <button
            type="button"
            className="account-close-btn"
            onClick={onClose}
          >
            <span>{t.close || "Yopish"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
