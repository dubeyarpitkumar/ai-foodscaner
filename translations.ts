import { HealthCondition, Gender, DietType } from "./types";

export const translations = {
  en: {
    nutriScanAI: "NutriScan AI",
    myProfile: "My Profile",
    analyzing: "Analyzing your food...",
    error: "Error",
    close: "Close",
    
    // LandingScreen
    getStarted: "Get Started",
    landingTitle: "Welcome to NutriScan AI",
    landingSubtitle: "Your Smart Food Analyzer.",
    landingDescription: "Sign up or log in to get personalized nutritional information and health recommendations by scanning food with your camera.",

    // AuthScreen
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    loginWithGoogle: "Continue with Google",
    
    // ProfileForm
    createYourProfile: "Create Your Profile",
    completeProfile: "Please complete your profile to get personalized recommendations.",
    displayName: "Display Name",
    displayNamePlaceholder: "e.g., John Doe",
    gender: "Gender",
    dietType: "Dietary Preference",
    saveAndContinue: "Save and Continue",
    
    // Dashboard Header
    signOut: "Sign Out",

    // HomeScreen
    smartFoodAnalyzer: "Your Smart Food Analyzer.",
    homeScreenDescription: "Get instant nutritional information and health recommendations by scanning food with your camera.",
    scanFood: "Scan Food",
    scanFoodDescription: "Use camera to identify food",
    scanQRCode: "Scan Barcode / QR",
    scanQRCodeDescription: "For codes on packaged items",
    uploadImage: "Upload an Image",
    uploadImageDescription: "Or analyze a photo from your device",

    // ProfileModal
    yourHealthProfile: "Your Health Profile",
    age: "Age",
    agePlaceholder: "e.g., 30",
    healthGoal: "Health Goal / Condition",
    allergies: "Allergies (comma-separated)",
    allergiesPlaceholder: "e.g., Peanuts, Gluten",
    cancel: "Cancel",
    saveProfile: "Save Profile",
    healthConditions: {
        [HealthCondition.NONE]: "None",
        [HealthCondition.DIABETIC]: "Diabetic",
        [HealthCondition.GYM_GOER]: "Gym-Goer",
        [HealthCondition.HEART_PATIENT]: "Heart Patient",
    },
    genders: {
      [Gender.MALE]: "Male",
      [Gender.FEMALE]: "Female",
      [Gender.OTHER]: "Other",
      [Gender.PREFER_NOT_TO_SAY]: "Prefer not to say",
    },
    dietTypes: {
      [DietType.NONE]: "None",
      [DietType.VEGETARIAN]: "Vegetarian",
      [DietType.VEGAN]: "Vegan",
      [DietType.PESCATARIAN]: "Pescatarian",
      [DietType.KETO]: "Keto",
    },

    // ResultsDisplay
    noResults: "No results to display.",
    nutritionalInformation: "Nutritional Information",
    calories: "Calories",
    kcal: "kcal",
    protein: "Protein",
    grams: "grams",
    fat: "Fat",
    sugar: "Sugar",
    fiber: "Fiber",
    ingredients: "Ingredients",
    scanAnotherItem: "Scan Another Item",

    // Scanner
    errorImageCapture: "Could not capture image. Please ensure camera permissions are enabled.",
    errorCameraAccess: "Camera access denied. Please enable camera permissions in your browser settings.",
    pointAtQRCode: "Point at a Barcode or QR Code",
    back: "Back",
    captureImage: "Capture Food Image",
  },
  hi: {
    nutriScanAI: "न्यूट्रीस्कैन AI",
    myProfile: "मेरी प्रोफ़ाइल",
    analyzing: "आपके भोजन का विश्लेषण किया जा रहा है...",
    error: "त्रुटि",
    close: "बंद करें",

    // LandingScreen
    getStarted: "शुरू करें",
    landingTitle: "न्यूट्रीस्कैन AI में आपका स्वागत है",
    landingSubtitle: "आपका स्मार्ट खाद्य विश्लेषक।",
    landingDescription: "अपने कैमरे से भोजन को स्कैन करके व्यक्तिगत पोषण संबंधी जानकारी और स्वास्थ्य सुझाव प्राप्त करने के लिए साइन अप या लॉग इन करें।",

    // AuthScreen
    login: "लॉग इन करें",
    signup: "साइन अप करें",
    email: "ईमेल",
    password: "पासवर्ड",
    loginWithGoogle: "Google के साथ जारी रखें",

    // ProfileForm
    createYourProfile: "अपनी प्रोफ़ाइल बनाएं",
    completeProfile: "व्यक्तिगत सुझाव प्राप्त करने के लिए कृपया अपनी प्रोफ़ाइल पूरी करें।",
    displayName: "प्रदर्शित नाम",
    displayNamePlaceholder: "उदा., जॉन डो",
    gender: "लिंग",
    dietType: "आहार वरीयता",
    saveAndContinue: "सहेजें और जारी रखें",
    
    // Dashboard Header
    signOut: "साइन आउट",

    // HomeScreen
    smartFoodAnalyzer: "आपका स्मार्ट खाद्य विश्लेषक।",
    homeScreenDescription: "अपने कैमरे से भोजन को स्कैन करके तुरंत पोषण संबंधी जानकारी और स्वास्थ्य सुझाव प्राप्त करें।",
    scanFood: "खाना स्कैन करें",
    scanFoodDescription: "भोजन की पहचान के लिए कैमरे का उपयोग करें",
    scanQRCode: "बारकोड / QR स्कैन करें",
    scanQRCodeDescription: "पैकेज्ड आइटम पर कोड के लिए",
    uploadImage: "एक छवि अपलोड करें",
    uploadImageDescription: "या अपने डिवाइस से एक तस्वीर का विश्लेषण करें",

    // ProfileModal
    yourHealthProfile: "आपकी स्वास्थ्य प्रोफ़ाइल",
    age: "आयु",
    agePlaceholder: "उदा., 30",
    healthGoal: "स्वास्थ्य लक्ष्य / स्थिति",
    allergies: "एलर्जी (अल्पविराम से अलग)",
    allergiesPlaceholder: "उदा., मूंगफली, लस",
    cancel: "रद्द करें",
    saveProfile: "प्रोफ़ाइल सहेजें",
    healthConditions: {
        [HealthCondition.NONE]: "कोई नहीं",
        [HealthCondition.DIABETIC]: "मधुमेह",
        [HealthCondition.GYM_GOER]: "जिम जाने वाला",
        [HealthCondition.HEART_PATIENT]: "हृदय रोगी",
    },
    genders: {
      [Gender.MALE]: "पुरुष",
      [Gender.FEMALE]: "महिला",
      [Gender.OTHER]: "अन्य",
      [Gender.PREFER_NOT_TO_SAY]: "बताना नहीं चाहते",
    },
    dietTypes: {
      [DietType.NONE]: "कोई नहीं",
      [DietType.VEGETARIAN]: "शाकाहारी",
      [DietType.VEGAN]: "पूरी तरह शाकाहारी",
      [DietType.PESCATARIAN]: "मछली खाने वाला शाकाहारी",
      [DietType.KETO]: "कीटो",
    },

    // ResultsDisplay
    noResults: "प्रदर्शित करने के लिए कोई परिणाम नहीं।",
    nutritionalInformation: "पोषण संबंधी जानकारी",
    calories: "कैलोरी",
    kcal: "kcal",
    protein: "प्रोटीन",
    grams: "ग्राम",
    fat: "वसा",
    sugar: "चीनी",
    fiber: "फाइबर",
    ingredients: "सामग्री",
    scanAnotherItem: "दूसरा आइटम स्कैन करें",

    // Scanner
    errorImageCapture: "छवि कैप्चर नहीं की जा सकी। कृपया सुनिश्चित करें कि कैमरा अनुमतियाँ सक्षम हैं।",
    errorCameraAccess: "कैमरे तक पहुंच से इनकार किया गया। कृपया अपनी ब्राउज़र सेटिंग्स में कैमरा अनुमतियां सक्षम करें।",
    pointAtQRCode: "एक बारकोड या QR कोड पर इंगित करें",
    back: "वापस",
    captureImage: "भोजन की छवि कैप्चर करें",
  }
};