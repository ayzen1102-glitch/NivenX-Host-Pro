import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home", plans: "Plans", news: "News", support: "Support",
        login: "Login", register: "Get Started", dashboard: "Dashboard", logout: "Logout"
      },
      hero: {
        badge: "Next-Gen Hosting Infrastructure",
        title1: "Premium", titleHighlight: "Game & VPS", title2: "Hosting",
        subtitle: "Powered by NVMe SSDs and AMD Ryzen CPUs. Deploy in seconds with enterprise DDoS protection and 99.99% uptime.",
        cta1: "View Plans", cta2: "Create Account"
      },
      stats: { servers: "Active Servers", uptime: "Uptime SLA", deploy: "Deploy Time", support: "Expert Support" },
      partners: { title: "OFFICIAL", highlight: "PARTNERS" },
      features: {
        title: "Why Choose", highlight: "NivenX",
        instant: { title: "Instant Deploy", desc: "Your server is live in under 60 seconds with automatic configuration." },
        ddos: { title: "DDoS Protection", desc: "Enterprise-grade DDoS mitigation protecting your server 24/7." },
        global: { title: "Global Network", desc: "Nodes across 3 continents for ultra-low latency worldwide." },
        nvme: { title: "NVMe Storage", desc: "10x faster than traditional SSDs with pure NVMe storage arrays." },
        ryzen: { title: "Ryzen CPUs", desc: "Latest AMD Ryzen processors deliver maximum single-thread performance." },
        uptime: { title: "99.99% Uptime", desc: "Industry-leading uptime backed by redundant infrastructure." }
      },
      pricing: {
        title: "Simple, Transparent", highlight: "Pricing",
        subtitle: "No hidden fees. Pay monthly or save with yearly billing.",
        monthly: "Monthly", yearly: "Yearly", save: "Save 17%",
        popular: "Most Popular", orderNow: "Order Now", viewAll: "View all plans"
      },
      reviews: { title: "PLAYERS DON'T LIE.", subtitle: "Look at these nice reviews we got", ratedOn: "Rated on" },
      games: { title: "PICK YOUR GAME", viewAll: "View all" },
      locations: { title: "OUR LOCATIONS", subtitle: "Strategically placed servers so you always connect to the fastest node near you." },
      cta: { title: "Ready to get started?", subtitle: "Join thousands who trust NivenX. Start in minutes.", button: "Start Hosting Today" },
      footer: {
        tagline: "Premium hosting powered by NVMe SSDs and Ryzen CPUs.",
        services: "Services", company: "Company", support: "Support", account: "Account",
        minecraft: "Minecraft Hosting", vps: "VPS Hosting", game: "Game Servers", web: "Web Hosting",
        announcements: "Announcements", kb: "Knowledgebase",
        operational: "All systems operational"
      },
      auth: {
        loginTitle: "Welcome back", loginSub: "Sign in to your account",
        registerTitle: "Create your account", registerSub: "Start hosting in minutes",
        email: "Email address", password: "Password", name: "Full name",
        signin: "Sign in", signup: "Create account", signingIn: "Signing in...", signingUp: "Creating account...",
        noAccount: "Don't have an account?", hasAccount: "Already have an account?",
        createFree: "Create one free", signIn: "Sign in", orContinue: "or continue with",
        google: "Continue with Google", microsoft: "Continue with Microsoft", github: "Continue with GitHub"
      },
      dashboard: {
        overview: "Overview", services: "My Services", billing: "Billing",
        tickets: "Support", announcements: "Announcements", settings: "Settings", admin: "Admin Panel"
      }
    }
  },
  si: {
    translation: {
      nav: {
        home: "මුල් පිටුව", plans: "සැලසුම්", news: "පුවත්", support: "සහාය",
        login: "පිවිසෙන්න", register: "ආරම්භ කරන්න", dashboard: "උපකරණ පුවරුව", logout: "ඉවත් වන්න"
      },
      hero: {
        badge: "ඊළඟ පරම්පරාවේ සත්කාරක යටිතල ව්‍යුහය",
        title1: "උසස්", titleHighlight: "ක්‍රීඩා සහ VPS", title2: "සත්කාරකත්වය",
        subtitle: "NVMe SSD සහ AMD Ryzen CPU වලින් බලගැන්වේ. තත්පර 60කදී ඔබේ සේවාදායකය සක්‍රිය කරන්න.",
        cta1: "සැලසුම් බලන්න", cta2: "ගිණුමක් සාදන්න"
      },
      stats: { servers: "සක්‍රිය සේවාදායකයන්", uptime: "Uptime SLA", deploy: "යෙදවීමේ කාලය", support: "විශේෂඥ සහාය" },
      partners: { title: "නිල", highlight: "හවුල්කරුවන්" },
      features: {
        title: "NivenX", highlight: "තෝරාගැනීමට හේතු",
        instant: { title: "ක්‍ෂණික යෙදවීම", desc: "ස්වයංක්‍රීය වින්‍යාස සමඟ තත්පර 60කදී ඔබේ සේවාදායකය සක්‍රිය." },
        ddos: { title: "DDoS ආරක්ෂණය", desc: "24/7 ඔබේ සේවාදායකය ආරක්ෂා කරන ව්‍යවසාය-ශ්‍රේණියේ DDoS." },
        global: { title: "ගෝලීය ජාලය", desc: "ලෝකය පුරා අඩු ප්‍රමාදයක් සඳහා කොන්ටිනන්ට් 3ක නෝඩ්." },
        nvme: { title: "NVMe ගබඩාව", desc: "සාම්ප්‍රදායික SSD වලට වඩා 10 ගුණයක් වේගවත්." },
        ryzen: { title: "Ryzen CPU", desc: "නවතම AMD Ryzen ප්‍රොසෙසර් උපරිම කාර්ය සාධනය ලබා දෙයි." },
        uptime: { title: "99.99% Uptime", desc: "අතිරේදී ​යටිතල ව්‍යුහයෙන් සහාය දරන ඉහළ Uptime." }
      },
      pricing: {
        title: "සරල,", highlight: "විනිවිද පෙනෙන මිලකරණය",
        subtitle: "සැඟවුණු ගාස්තු නොමැත. මාසිකව ගෙවන්න හෝ වාර්ෂිකව ඉතිරි කරන්න.",
        monthly: "මාසික", yearly: "වාර්ෂික", save: "17% ඉතිරි කරන්න",
        popular: "වඩාත් ජනප්‍රිය", orderNow: "දැන් ඇණවුම් කරන්න", viewAll: "සියලු සැලසුම් බලන්න"
      },
      reviews: { title: "ක්‍රීඩකයන් බොරු නොකියයි.", subtitle: "අපට ලැබුණු හොඳ reviews", ratedOn: "Rated on" },
      games: { title: "ඔබේ ක්‍රීඩාව තෝරන්න", viewAll: "සියල්ල බලන්න" },
      locations: { title: "අපේ ස්ථාන", subtitle: "ඔබ සෑම විටම ආසන්නම නෝඩ් වෙත සම්බන්ධ වෙන ලෙස ස්ථානගත සේවාදායකයන්." },
      cta: { title: "ආරම්භ කිරීමට සූදානම්ද?", subtitle: "NivenX විශ්වාස කරන දහස් ගණනකට එකතු වන්න.", button: "අද සත්කාරකත්වය ආරම්භ කරන්න" },
      footer: {
        tagline: "NVMe SSD සහ Ryzen CPU වලින් බලගැන්වෙන සත්කාරකත්වය.",
        services: "සේවා", company: "සමාගම", support: "සහාය", account: "ගිණුම",
        minecraft: "Minecraft සත්කාරකත්වය", vps: "VPS සත්කාරකත්වය", game: "ක්‍රීඩා සේවාදායකයන්", web: "වෙබ් සත්කාරකත්වය",
        announcements: "නිවේදන", kb: "දැනුම් පදනම",
        operational: "සියලු පද්ධති ක්‍රියාකාරීයි"
      },
      auth: {
        loginTitle: "නැවත සාදරයෙන් පිළිගනිමු", loginSub: "ඔබේ ගිණුමට පිවිසෙන්න",
        registerTitle: "ඔබේ ගිණුම සාදන්න", registerSub: "මිනිත්තු කිහිපයකින් ආරම්භ කරන්න",
        email: "විද්‍යුත් තැපෑල", password: "මුරපදය", name: "සම්පූර්ණ නම",
        signin: "පිවිසෙන්න", signup: "ගිණුමක් සාදන්න", signingIn: "පිවිසෙමින්...", signingUp: "ගිණුමක් සාදමින්...",
        noAccount: "ගිණුමක් නොමැතිද?", hasAccount: "දැනටමත් ගිණුමක් ඇතිද?",
        createFree: "නිදහසේ සාදන්න", signIn: "පිවිසෙන්න", orContinue: "හෝ ඔස්සේ",
        google: "Google ඔස්සේ", microsoft: "Microsoft ඔස්සේ", github: "GitHub ඔස්සේ"
      },
      dashboard: {
        overview: "දළ විශ්ලේෂණය", services: "මගේ සේවා", billing: "බිල්පත",
        tickets: "සහාය", announcements: "නිවේදන", settings: "සැකසුම්", admin: "පරිපාලක පැනලය"
      }
    }
  },
  ta: {
    translation: {
      nav: {
        home: "முகப்பு", plans: "திட்டங்கள்", news: "செய்திகள்", support: "ஆதரவு",
        login: "உள்நுழைக", register: "தொடங்குக", dashboard: "டாஷ்போர்டு", logout: "வெளியேறு"
      },
      hero: {
        badge: "அடுத்த தலைமுறை ஹோஸ்டிங் உள்கட்டமைப்பு",
        title1: "தரமான", titleHighlight: "கேம் & VPS", title2: "ஹோஸ்டிங்",
        subtitle: "NVMe SSD மற்றும் AMD Ryzen CPU ஆல் இயக்கப்படுகிறது. 60 வினாடிகளில் உங்கள் சர்வரை தொடங்குங்கள்.",
        cta1: "திட்டங்கள் பார்க்க", cta2: "கணக்கு உருவாக்கு"
      },
      stats: { servers: "செயலில் உள்ள சர்வர்கள்", uptime: "இயக்க நேர SLA", deploy: "பயன்படுத்தும் நேரம்", support: "நிபுணர் ஆதரவு" },
      partners: { title: "அதிகாரப்பூர்வ", highlight: "கூட்டாளர்கள்" },
      features: {
        title: "ஏன் NivenX", highlight: "தேர்வு செய்ய வேண்டும்",
        instant: { title: "உடனடி பயன்படுத்துதல்", desc: "தானியங்கு கட்டமைப்புடன் 60 வினாடிகளில் உங்கள் சர்வர் இயங்கும்." },
        ddos: { title: "DDoS பாதுகாப்பு", desc: "24/7 உங்கள் சர்வரை பாதுகாக்கும் நிறுவன-தர DDoS தணிப்பு." },
        global: { title: "உலகளாவிய நெட்வொர்க்", desc: "உலகெங்கும் குறைந்த தாமதத்திற்கு 3 கண்டங்களில் நோட்கள்." },
        nvme: { title: "NVMe சேமிப்பு", desc: "பாரம்பரிய SSD களை விட 10 மடங்கு வேகம்." },
        ryzen: { title: "Ryzen CPU கள்", desc: "சமீபத்திய AMD Ryzen செயலிகள் அதிகபட்ச செயல்திறன் தருகின்றன." },
        uptime: { title: "99.99% இயக்க நேரம்", desc: "தொழில்முன்னணி இயக்க நேரம் உத்தரவாதம்." }
      },
      pricing: {
        title: "எளிய,", highlight: "வெளிப்படையான விலை நிர்ணயம்",
        subtitle: "மறைக்கப்பட்ட கட்டணங்கள் இல்லை. மாதாந்திரமாக செலுத்துங்கள் அல்லது வருடாந்திர சேமிப்பு பெறுங்கள்.",
        monthly: "மாதாந்திர", yearly: "வருடாந்திர", save: "17% சேமி",
        popular: "மிகவும் பிரபலமானது", orderNow: "இப்போது ஆர்டர் செய்க", viewAll: "அனைத்து திட்டங்களும்"
      },
      reviews: { title: "வீரர்கள் பொய் சொல்வதில்லை.", subtitle: "நாங்கள் பெற்ற நல்ல மதிப்புரைகள்", ratedOn: "மதிப்பிடப்பட்டது" },
      games: { title: "உங்கள் விளையாட்டை தேர்வு செய்க", viewAll: "அனைத்தும் பார்க்க" },
      locations: { title: "எங்கள் இடங்கள்", subtitle: "நீங்கள் எப்போதும் அருகிலுள்ள நோட்டுடன் இணைக்கப்படும் வகையில் சர்வர்கள் அமைக்கப்பட்டுள்ளன." },
      cta: { title: "தொடங்க தயாரா?", subtitle: "NivenX ஐ நம்பும் ஆயிரக்கணக்கானோரோடு இணையுங்கள்.", button: "இன்று ஹோஸ்டிங் தொடங்குங்கள்" },
      footer: {
        tagline: "NVMe SSD மற்றும் Ryzen CPU ஆல் இயக்கப்படும் ஹோஸ்டிங்.",
        services: "சேவைகள்", company: "நிறுவனம்", support: "ஆதரவு", account: "கணக்கு",
        minecraft: "Minecraft ஹோஸ்டிங்", vps: "VPS ஹோஸ்டிங்", game: "கேம் சர்வர்கள்", web: "வெப் ஹோஸ்டிங்",
        announcements: "அறிவிப்புகள்", kb: "அறிவுத் தளம்",
        operational: "அனைத்து அமைப்புகளும் இயங்குகின்றன"
      },
      auth: {
        loginTitle: "மீண்டும் வருக", loginSub: "உங்கள் கணக்கில் உள்நுழைக",
        registerTitle: "உங்கள் கணக்கை உருவாக்கு", registerSub: "நிமிடங்களில் தொடங்குங்கள்",
        email: "மின்னஞ்சல் முகவரி", password: "கடவுச்சொல்", name: "முழு பெயர்",
        signin: "உள்நுழைக", signup: "கணக்கு உருவாக்கு", signingIn: "உள்நுழைகிறது...", signingUp: "கணக்கு உருவாக்குகிறது...",
        noAccount: "கணக்கு இல்லையா?", hasAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
        createFree: "இலவசமாக உருவாக்கு", signIn: "உள்நுழைக", orContinue: "அல்லது தொடர",
        google: "Google மூலம்", microsoft: "Microsoft மூலம்", github: "GitHub மூலம்"
      },
      dashboard: {
        overview: "மேலோட்டம்", services: "என் சேவைகள்", billing: "பில்லிங்",
        tickets: "ஆதரவு", announcements: "அறிவிப்புகள்", settings: "அமைப்புகள்", admin: "நிர்வாக பேனல்"
      }
    }
  },
  fr: { translation: { nav: { home: "Accueil", plans: "Plans", news: "Actualités", support: "Support", login: "Connexion", register: "Commencer", dashboard: "Tableau de bord", logout: "Déconnexion" }, hero: { title1: "Hébergement", titleHighlight: "Jeux & VPS", title2: "Premium", subtitle: "Propulsé par NVMe SSD et AMD Ryzen.", cta1: "Voir les Plans", cta2: "Créer un Compte", badge: "Infrastructure d'hébergement nouvelle génération" }, pricing: { monthly: "Mensuel", yearly: "Annuel", save: "Économisez 17%", popular: "Plus populaire", orderNow: "Commander", viewAll: "Voir tous les plans", title: "Tarification", highlight: "Transparente", subtitle: "Sans frais cachés." }, auth: { loginTitle: "Bon retour", loginSub: "Connectez-vous à votre compte", registerTitle: "Créer un compte", registerSub: "Commencez en quelques minutes", email: "Adresse e-mail", password: "Mot de passe", name: "Nom complet", signin: "Se connecter", signup: "Créer un compte", signingIn: "Connexion...", signingUp: "Création...", noAccount: "Pas de compte?", hasAccount: "Déjà un compte?", createFree: "Créez-en un", signIn: "Connexion", orContinue: "ou continuer avec", google: "Continuer avec Google", microsoft: "Continuer avec Microsoft", github: "Continuer avec GitHub" } } },
  de: { translation: { nav: { home: "Startseite", plans: "Pläne", news: "Neuigkeiten", support: "Support", login: "Anmelden", register: "Loslegen", dashboard: "Dashboard", logout: "Abmelden" }, hero: { title1: "Premium", titleHighlight: "Game & VPS", title2: "Hosting", subtitle: "Betrieben von NVMe SSDs und AMD Ryzen CPUs.", cta1: "Pläne ansehen", cta2: "Konto erstellen", badge: "Next-Gen Hosting-Infrastruktur" }, pricing: { monthly: "Monatlich", yearly: "Jährlich", save: "17% sparen", popular: "Beliebteste", orderNow: "Jetzt bestellen", viewAll: "Alle Pläne ansehen", title: "Einfache,", highlight: "transparente Preise", subtitle: "Keine versteckten Gebühren." }, auth: { loginTitle: "Willkommen zurück", loginSub: "Melden Sie sich an", registerTitle: "Konto erstellen", registerSub: "Jetzt starten", email: "E-Mail-Adresse", password: "Passwort", name: "Vollständiger Name", signin: "Anmelden", signup: "Konto erstellen", signingIn: "Anmelden...", signingUp: "Erstellen...", noAccount: "Kein Konto?", hasAccount: "Bereits ein Konto?", createFree: "Kostenlos erstellen", signIn: "Anmelden", orContinue: "oder fortfahren mit", google: "Mit Google fortfahren", microsoft: "Mit Microsoft fortfahren", github: "Mit GitHub fortfahren" } } },
  jp: { translation: { nav: { home: "ホーム", plans: "プラン", news: "ニュース", support: "サポート", login: "ログイン", register: "始める", dashboard: "ダッシュボード", logout: "ログアウト" }, hero: { title1: "プレミアム", titleHighlight: "ゲーム＆VPS", title2: "ホスティング", subtitle: "NVMe SSDとAMD Ryzen CPUで動作。60秒でサーバーを起動。", cta1: "プランを見る", cta2: "アカウント作成", badge: "次世代ホスティングインフラ" }, pricing: { monthly: "月払い", yearly: "年払い", save: "17%節約", popular: "人気No.1", orderNow: "注文する", viewAll: "全プランを見る", title: "シンプルで", highlight: "透明な価格設定", subtitle: "隠れた費用なし。" }, auth: { loginTitle: "おかえりなさい", loginSub: "アカウントにサインイン", registerTitle: "アカウント作成", registerSub: "すぐに始められます", email: "メールアドレス", password: "パスワード", name: "フルネーム", signin: "サインイン", signup: "アカウント作成", signingIn: "サインイン中...", signingUp: "作成中...", noAccount: "アカウントがない方は?", hasAccount: "すでにアカウントをお持ちですか?", createFree: "無料で作成", signIn: "サインイン", orContinue: "または", google: "Googleで続ける", microsoft: "Microsoftで続ける", github: "GitHubで続ける" } } }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "si", label: "සිංහල", flag: "🇱🇰" },
  { code: "ta", label: "தமிழ்", flag: "🇱🇰" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "jp", label: "日本語", flag: "🇯🇵" },
];

export default i18n;
