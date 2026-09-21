import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' }
];

const resources = {
  en: {
    translation: {
      appName: "KalaSetu", welcomeBack: "Welcome Back!", subWelcome: "Log in to continue your journey.",
      signIn: "Sign In", signUp: "Create New Account", email: "Email Address", password: "Password",
      noAccount: "Don't have an account?", haveAccount: "Already have an account?", joinAs: "How do you want to join?",
      buyerRole: "Buyer / Business", buyerDesc: "I want to purchase authentic crafts.",
      artisanRole: "Artisan / Creator", artisanDesc: "I want to sell my creations globally.",
      fullName: "Full Name", phone: "Mobile Number", createAccount: "Sign Up Now",
      myInventory: "My Catalogue", signOut: "Sign Out", marketplace: "Global Marketplace",
      discover: "Discover authentic crafts.", clusterBtn: "Bulk / Cluster", settings: "My Account",
      language: "Change Language", totalItems: "Total Items", totalStock: "Total Stock", editProfile: "Edit Profile",
      orderHistory: "Order History", saveChanges: "Save Changes", cancel: "Cancel",
      delivered: "Delivered", processing: "Processing",
      
      // NEW UPLOAD PAGE TRANSLATIONS
      listNewItem: "List a New Item",
      showcaseCraft: "Showcase your craft to the world in 3 simple steps.",
      step1: "Add a Photo",
      tapToAddPhoto: "Tap to add photo",
      aiHintClean: "AI will automatically clean the background",
      aiEnhanced: "AI Enhanced",
      step2: "What type of craft is this?",
      step3: "Item Details",
      itemName: "Name of the item",
      pricePerUnit: "Price per unit (₹)",
      howMany: "How many?",
      typeDescription: "Type description, or use mic...",
      voiceHint: "Tap the mic to describe the material and how you made it.",
      publishToMarket: "Publish to Marketplace",
      catTextiles: "Clothes / Textiles",
      catPottery: "Pottery / Clay",
      catJewelry: "Jewelry",
      catWoodwork: "Woodwork",
      catOther: "Other Craft"
    }
  },
  hi: {
    translation: {
      appName: "कला-सेतु", welcomeBack: "वापसी पर स्वागत है!", subWelcome: "अपनी यात्रा जारी रखने के लिए लॉग इन करें।",
      signIn: "लॉग इन करें", signUp: "नया खाता बनाएँ", email: "ईमेल पता", password: "पासवर्ड",
      noAccount: "क्या आपके पास खाता नहीं है?", haveAccount: "क्या आपके पास पहले से खाता है?", joinAs: "आप कैसे जुड़ना चाहते हैं?",
      buyerRole: "खरीदार / व्यवसाय", buyerDesc: "मैं प्रामाणिक शिल्प खरीदना चाहता हूँ।",
      artisanRole: "कारीगर / निर्माता", artisanDesc: "मैं अपनी रचनाएँ दुनिया को बेचना चाहता हूँ।",
      fullName: "पूरा नाम", phone: "मोबाइल नंबर", createAccount: "अभी साइन अप करें",
      myInventory: "मेरी सूची", signOut: "लॉग आउट", marketplace: "वैश्विक बाज़ार",
      discover: "प्रामाणिक शिल्प खोजें।", clusterBtn: "थोक / क्लस्टर", settings: "मेरा खाता",
      language: "भाषा बदलें", totalItems: "कुल उत्पाद", totalStock: "कुल स्टॉक", editProfile: "प्रोफ़ाइल संपादित करें",
      orderHistory: "ऑर्डर इतिहास", saveChanges: "बदलाव सहेजें", cancel: "रद्द करें",
      delivered: "पहुंचा दिया", processing: "प्रक्रिया में",

      // NEW UPLOAD PAGE TRANSLATIONS
      listNewItem: "नया आइटम सूचीबद्ध करें",
      showcaseCraft: "3 आसान चरणों में अपनी कला दुनिया को दिखाएं।",
      step1: "एक फोटो जोड़ें",
      tapToAddPhoto: "फोटो जोड़ने के लिए टैप करें",
      aiHintClean: "AI अपने आप बैकग्राउंड साफ कर देगा",
      aiEnhanced: "AI द्वारा बेहतर",
      step2: "यह किस प्रकार की कला है?",
      step3: "आइटम विवरण",
      itemName: "आइटम का नाम",
      pricePerUnit: "प्रति यूनिट कीमत (₹)",
      howMany: "कितनी मात्रा?",
      typeDescription: "विवरण टाइप करें, या माइक का उपयोग करें...",
      voiceHint: "सामग्री और इसे बनाने के तरीके का वर्णन करने के लिए माइक पर टैप करें।",
      publishToMarket: "मार्केटप्लेस पर प्रकाशित करें",
      catTextiles: "कपड़े / वस्त्र",
      catPottery: "मिट्टी के बर्तन",
      catJewelry: "आभूषण / गहने",
      catWoodwork: "लकड़ी का काम",
      catOther: "अन्य कला"
    }
  },
  mr: {
    translation: {
      appName: "कला-सेतु", welcomeBack: "पुन्हा स्वागत आहे!", subWelcome: "तुमचा प्रवास सुरू ठेवण्यासाठी लॉग इन करा.",
      signIn: "लॉग इन करा", signUp: "नवीन खाते तयार करा", email: "ईमेल पत्ता", password: "पासवर्ड",
      noAccount: "खाते नाही का?", haveAccount: "आधीच खाते आहे का?", joinAs: "तुम्हाला कसे जोडायचे आहे?",
      buyerRole: "खरेदीदार / व्यवसाय", buyerDesc: "मला अस्सल हस्तकला खरेदी करायची आहे.",
      artisanRole: "कारागीर / निर्माता", artisanDesc: "मला माझी निर्मिती जागतिक स्तरावर विकायची आहे.",
      fullName: "पूर्ण नाव", phone: "मोबाईल नंबर", createAccount: "आता साइन अप करा",
      myInventory: "माझी यादी", signOut: "लॉग आउट", marketplace: "जागतिक बाजारपेठ",
      discover: "अस्सल हस्तकला शोधा.", clusterBtn: "मोठ्या प्रमाणात", settings: "माझे खाते",
      language: "भाषा बदला", totalItems: "एकूण वस्तू", totalStock: "एकूण साठा", editProfile: "प्रोफाइल संपादित करा",
      orderHistory: "ऑर्डर इतिहास", saveChanges: "बदल जतन करा", cancel: "रद्द करा",
      delivered: "वितरित", processing: "प्रक्रिया करत आहे",

      listNewItem: "नवीन वस्तू सूचीबद्ध करा",
      showcaseCraft: "३ सोप्या चरणांमध्ये आपली कला जगाला दाखवा.",
      step1: "फोटो जोडा",
      tapToAddPhoto: "फोटो जोडण्यासाठी टॅप करा",
      aiHintClean: "AI स्वयंचलितपणे पार्श्वभूमी साफ करेल",
      aiEnhanced: "AI सुधारित",
      step2: "ही कोणत्या प्रकारची कला आहे?",
      step3: "वस्तूचे तपशील",
      itemName: "वस्तूचे नाव",
      pricePerUnit: "प्रति युनिट किंमत (₹)",
      howMany: "किती?",
      typeDescription: "वर्णन टाइप करा किंवा माइक वापरा...",
      voiceHint: "साहित्य आणि ते कसे बनवले याचे वर्णन करण्यासाठी माइकवर टॅप करा.",
      publishToMarket: "मार्केटप्लेसवर प्रकाशित करा",
      catTextiles: "कपडे",
      catPottery: "मातीची भांडी",
      catJewelry: "दागिने",
      catWoodwork: "लाकूडकाम",
      catOther: "इतर कला"
    }
  },
  gu: {
    translation: {
      appName: "કલા-સેતુ", welcomeBack: "ફરી સ્વાગત છે!", subWelcome: "તમારી યાત્રા ચાલુ રાખવા માટે લૉગ ઇન કરો.",
      signIn: "લૉગ ઇન કરો", signUp: "નવું ખાતું બનાવો", email: "ઇમેઇલ સરનામું", password: "પાસવર્ડ",
      noAccount: "શું તમારી પાસે ખાતું નથી?", haveAccount: "શું તમારી પાસે પહેલેથી જ ખાતું છે?", joinAs: "તમે કેવી રીતે જોડાવા માંગો છો?",
      buyerRole: "ખરીદનાર / વ્યવસાય", buyerDesc: "હું અધિકૃત હસ્તકલા ખરીદવા માંગુ છું.",
      artisanRole: "કારીગર / નિર્માતા", artisanDesc: "હું મારી રચનાઓ વૈશ્વિક સ્તરે વેચવા માંગુ છું.",
      fullName: "પૂરું નામ", phone: "મોબાઇલ નંબર", createAccount: "હમણાં સાઇન અપ કરો",
      myInventory: "મારી ઇન્વેન્ટરી", signOut: "લૉગ આઉટ", marketplace: "વૈશ્વિક બજાર",
      discover: "અધિકૃત હસ્તકલા શોધો.", clusterBtn: "જથ્થાબંધ", settings: "મારું ખાતું",
      language: "ભાષા બદલો", totalItems: "કુલ વસ્તુઓ", totalStock: "કુલ સ્ટોક", editProfile: "પ્રોફાઇલ સંપાદિત કરો",
      orderHistory: "ઓર્ડર ઇતિહાસ", saveChanges: "ફેરફારો સાચવો", cancel: "રદ કરો",
      delivered: "વિતરિત", processing: "પ્રક્રિયા ચાલુ છે",

      listNewItem: "નવી વસ્તુ સૂચિબદ્ધ કરો",
      showcaseCraft: "3 સરળ પગલાંમાં તમારી કલા વિશ્વને બતાવો.",
      step1: "ફોટો ઉમેરો",
      tapToAddPhoto: "ફોટો ઉમેરવા માટે ટેપ કરો",
      aiHintClean: "AI આપમેળે પૃષ્ઠભૂમિ સાફ કરશે",
      aiEnhanced: "AI ઉન્નત",
      step2: "આ કયા પ્રકારની કળા છે?",
      step3: "વસ્તુની વિગતો",
      itemName: "વસ્તુનું નામ",
      pricePerUnit: "યુનિટ દીઠ કિંમત (₹)",
      howMany: "કેટલા?",
      typeDescription: "વર્ણન લખો, અથવા માઇકનો ઉપયોગ કરો...",
      voiceHint: "સામગ્રી અને તમે તેને કેવી રીતે બનાવ્યું તેનું વર્ણન કરવા માટે માઇકને ટેપ કરો.",
      publishToMarket: "માર્કેટપ્લેસ પર પ્રકાશિત કરો",
      catTextiles: "કપડાં",
      catPottery: "માટીકામ",
      catJewelry: "દાગીના",
      catWoodwork: "લાકડાનું કામ",
      catOther: "અન્ય કળા"
    }
  },
  ta: {
    translation: {
      appName: "கலா-சேது", welcomeBack: "மீண்டும் வருக!", subWelcome: "தொடர உள்நுழையவும்.",
      signIn: "உள்நுழைக", signUp: "புதிய கணக்கை உருவாக்கு", email: "மின்னஞ்சல் முகவரி", password: "கடவுச்சொல்",
      noAccount: "கணக்கு இல்லையா?", haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?", joinAs: "நீங்கள் எப்படி சேர விரும்புகிறீர்கள்?",
      buyerRole: "வாங்குபவர் / வணிகம்", buyerDesc: "நான் கைவினைப்பொருட்களை வாங்க விரும்புகிறேன்.",
      artisanRole: "கைவினைஞர் / படைப்பாளர்", artisanDesc: "எனது படைப்புகளை உலகளவில் விற்க விரும்புகிறேன்.",
      fullName: "முழு பெயர்", phone: "கைபேசி எண்", createAccount: "இப்போது பதிவு செய்க",
      myInventory: "எனது இருப்பு", signOut: "வெளியேறு", marketplace: "உலகளாவிய சந்தை",
      discover: "கைவினைப்பொருட்களைக் கண்டறியவும்.", clusterBtn: "மொத்தம்", settings: "எனது கணக்கு",
      language: "மொழியை மாற்று", totalItems: "மொத்த பொருட்கள்", totalStock: "மொத்த இருப்பு", editProfile: "சுயவிவரத்தை திருத்து",
      orderHistory: "ஆர்டர் வரலாறு", saveChanges: "மாற்றங்களைச் சேமி", cancel: "ரத்து செய்",
      delivered: "வழங்கப்பட்டது", processing: "செயலாக்கத்தில் உள்ளது",

      listNewItem: "புதிய பொருளைப் பட்டியலிடு",
      showcaseCraft: "3 எளிய படிகளில் உங்கள் கலையை உலகிற்குக் காட்டுங்கள்.",
      step1: "புகைப்படம் சேர்",
      tapToAddPhoto: "புகைப்படம் சேர்க்க தட்டவும்",
      aiHintClean: "AI தானாகவே பின்னணியை அழிக்கும்",
      aiEnhanced: "AI மேம்படுத்தப்பட்டது",
      step2: "இது எந்த வகையான கலை?",
      step3: "பொருளின் விவரங்கள்",
      itemName: "பொருளின் பெயர்",
      pricePerUnit: "ஒரு பொருளின் விலை (₹)",
      howMany: "எத்தனை?",
      typeDescription: "விவரத்தைத் தட்டச்சு செய்க அல்லது மைக்கைப் பயன்படுத்தவும்...",
      voiceHint: "பொருள் மற்றும் அதை எப்படி செய்தீர்கள் என்பதை விவரிக்க மைக்கைத் தட்டவும்.",
      publishToMarket: "சந்தையில் வெளியிடு",
      catTextiles: "துணிகள்",
      catPottery: "மண்பாண்டம்",
      catJewelry: "நகைகள்",
      catWoodwork: "மரவேலை",
      catOther: "மற்ற கலை"
    }
  }
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('appLanguage');
  if (!savedLanguage) savedLanguage = 'en';

  i18n.use(initReactI18next).init({
    resources, lng: savedLanguage, fallbackLng: 'en', interpolation: { escapeValue: false }
  });
};

initI18n();
export default i18n;