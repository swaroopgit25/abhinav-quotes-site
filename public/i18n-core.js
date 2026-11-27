/* Languages: English (default), Telugu, Hindi.
   ONE file used by the website AND the server (PDF + email), so every word is translated in the same way.
   TO FIX OR ADD A WORD: add / edit a line in the TEXT list below:  [ 'English', 'తెలుగు', 'हिन्दी' ]
   The English text must match the English on the page exactly.
   Dish names are NOT here: they live in menu-te.js (Telugu) and menu-hi.js (Hindi). */
(function (root) {
  'use strict';
  var NAME_TE = 'శ్రీమతి వుప్పల జగదీశ్వరి', NAME_HI = 'श्रीमती वुप्पला जगदीश्वरी';

  var TEXT = [
    /* ---- top of the planner ---- */
    ['← Back', '← వెనుకకు', '← वापस'],
    ['Plan your event', 'మీ వేడుకను ప్లాన్ చేయండి', 'अपना कार्यक्रम प्लान करें'],
    ['Tell us about your event, pick your dishes, then choose the service.', 'మీ వేడుక వివరాలు చెప్పండి, వంటకాలను ఎంచుకోండి, ఆ తర్వాత సేవను ఎంచుకోండి.', 'हमें अपने कार्यक्रम के बारे में बताएं, व्यंजन चुनें, फिर सेवा चुनें।'],
    ['Start here', 'ఇక్కడ ప్రారంభించండి', 'यहाँ से शुरू करें'],
    ['What meal is it for?', 'ఇది ఏ భోజనం కోసం?', 'यह किस भोजन के लिए है?'],
    ['Choose the meal first. We then show the dishes that suit it.', 'ముందుగా భోజనాన్ని ఎంచుకోండి. దానికి సరిపోయే వంటకాలను మేము చూపిస్తాము.', 'पहले भोजन चुनें। फिर हम उसके अनुकूल व्यंजन दिखाएंगे।'],
    ['Having more than one meal in a day? Choose the first meal now and pick its dishes. Then press “Save this meal & add another” at the bottom, and add your next meal.',
      'ఒక రోజులో ఒకటి కంటే ఎక్కువ భోజనాలు ఉన్నాయా? ముందుగా మొదటి భోజనాన్ని ఎంచుకుని దాని వంటకాలను ఎంచుకోండి. తర్వాత కింద ఉన్న “ఈ భోజనాన్ని సేవ్ చేసి మరొకటి జోడించండి” నొక్కి, తదుపరి భోజనాన్ని జోడించండి.',
      'एक दिन में एक से ज़्यादा भोजन हैं? पहले पहला भोजन चुनें और उसके व्यंजन चुनें। फिर नीचे “इस भोजन को सेव करें और दूसरा जोड़ें” दबाएं और अगला भोजन जोड़ें।'],
    ['Pick a meal above, and your event form opens here.', 'పైన భోజనాన్ని ఎంచుకోండి, మీ వేడుక ఫారమ్ ఇక్కడ తెరుచుకుంటుంది.', 'ऊपर भोजन चुनें, आपका कार्यक्रम फ़ॉर्म यहाँ खुलेगा।'],
    ['Now choose the Standard Menu or the All Events Menu, and your event form opens here.', 'ఇప్పుడు స్టాండర్డ్ మెనూ లేదా ఆల్ ఈవెంట్స్ మెనూ ఎంచుకోండి, మీ వేడుక ఫారమ్ ఇక్కడ తెరుచుకుంటుంది.', 'अब स्टैंडर्ड मेन्यू या ऑल इवेंट्स मेन्यू चुनें, आपका कार्यक्रम फ़ॉर्म यहाँ खुलेगा।'],

    /* ---- meals, times, event types ---- */
    ['Meal', 'భోజనం', 'भोजन'],
    ['Welcome Drinks', 'వెల్కమ్ డ్రింక్స్', 'वेलकम ड्रिंक्स'],
    ['Breakfast', 'అల్పాహారం', 'नाश्ता'],
    ['Lunch', 'మధ్యాహ్న భోజనం', 'दोपहर का भोजन'],
    ['Snacks / High Tea', 'స్నాక్స్ / హై టీ', 'स्नैक्स / हाई टी'],
    ['Dinner', 'రాత్రి భోజనం', 'रात का भोजन'],
    ['Saree', 'చీరల వేడుక', 'साड़ी समारोह'],
    ['Morning or night', 'ఉదయం లేదా రాత్రి', 'सुबह या रात'],
    ['Breakfast time', 'అల్పాహార సమయం', 'नाश्ते का समय'],
    ['Morning', 'ఉదయం', 'सुबह'],
    ['Night', 'రాత్రి', 'रात'],
    ['Select time', 'సమయం ఎంచుకోండి', 'समय चुनें'],
    ['Wedding / Reception', 'వివాహం / రిసెప్షన్', 'शादी / रिसेप्शन'],
    ['Engagement', 'నిశ్చితార్థం', 'सगाई'],
    ['Birthday Party', 'పుట్టినరోజు వేడుక', 'जन्मदिन पार्टी'],
    ['Housewarming', 'గృహప్రవేశం', 'गृह प्रवेश'],
    ['Baby Shower / Seemantham', 'సీమంతం / బేబీ షవర్', 'गोद भराई / बेबी शावर'],
    ['Saree / Half Saree Function', 'చీరల / హాఫ్ శారీ వేడుక', 'साड़ी / हाफ साड़ी समारोह'],
    ['Pooja / Festival', 'పూజ / పండుగ', 'पूजा / त्योहार'],
    ['Corporate Event', 'కార్పొరేట్ కార్యక్రమం', 'कॉर्पोरेट कार्यक्रम'],
    ['Other', 'ఇతర', 'अन्य'],

    /* ---- Standard / All Events menu ---- */
    ['Which menu would you like?', 'మీకు ఏ మెనూ కావాలి?', 'आप कौन सा मेन्यू चाहेंगे?'],
    ['Standard Menu', 'స్టాండర్డ్ మెనూ', 'स्टैंडर्ड मेन्यू'],
    ['All Events Menu', 'ఆల్ ఈవెంట్స్ మెనూ', 'ऑल इवेंट्स मेन्यू'],
    ['One dish from each section', 'ప్రతి విభాగం నుండి ఒక వంటకం', 'हर सेक्शन से एक व्यंजन'],
    ['Choose from the full menu', 'పూర్తి మెనూ నుండి ఎంచుకోండి', 'पूरे मेन्यू से चुनें'],
    ['Note: the plate rate may vary in some seasons or due to inflation.', 'గమనిక: సీజన్‌ను బట్టి లేదా ద్రవ్యోల్బణం వల్ల ప్లేట్ ధర మారవచ్చు.', 'ध्यान दें: मौसम या महंगाई के कारण प्लेट की दर बदल सकती है।'],
    ['Enter the number of guests in the event details to see your total.', 'మీ మొత్తం చూడటానికి వేడుక వివరాలలో అతిథుల సంఖ్యను నమోదు చేయండి.', 'अपना कुल देखने के लिए कार्यक्रम विवरण में मेहमानों की संख्या डालें।'],
    ['Want more choices? Switch to the All Events Menu', 'ఇంకా ఎక్కువ ఎంపికలు కావాలా? ఆల్ ఈవెంట్స్ మెనూకి మారండి', 'और विकल्प चाहिए? ऑल इवेंट्स मेन्यू पर जाएं'],
    ['Switch to the All Events Menu', 'ఆల్ ఈవెంట్స్ మెనూకి మారండి', 'ऑल इवेंट्स मेन्यू पर जाएं'],
    ['Choose whatever you prefer from the full menu. Your quotation goes to Mrs. Vuppala Jagadeeswari, and you can discuss and finalise the price with her.',
      'పూర్తి మెనూ నుండి మీకు నచ్చినవి ఎంచుకోండి. మీ కొటేషన్ ' + NAME_TE + ' గారికి వెళ్తుంది, ఆమెతో మాట్లాడి ధరను నిర్ణయించుకోవచ్చు.',
      'पूरे मेन्यू से अपनी पसंद का चुनें। आपका कोटेशन ' + NAME_HI + ' जी को जाएगा, और आप उनसे बात करके कीमत तय कर सकते हैं।'],
    ['Choose whatever you prefer from the full menu. When you send your quotation, it goes to Mrs. Vuppala Jagadeeswari, and you can discuss and finalise the price with her.',
      'పూర్తి మెనూ నుండి మీకు నచ్చినవి ఎంచుకోండి. మీరు కొటేషన్ పంపినప్పుడు అది ' + NAME_TE + ' గారికి వెళ్తుంది, ఆమెతో మాట్లాడి ధరను నిర్ణయించుకోవచ్చు.',
      'पूरे मेन्यू से अपनी पसंद का चुनें। जब आप कोटेशन भेजेंगे तो वह ' + NAME_HI + ' जी को जाएगा, और आप उनसे बात करके कीमत तय कर सकते हैं।'],
    ['You can choose:', 'మీరు ఎంచుకోవచ్చు:', 'आप चुन सकते हैं:'],
    ['Menu changed, so your dishes were cleared. Pick again below.', 'మెనూ మారింది, కాబట్టి మీ వంటకాలు తొలగించబడ్డాయి. కింద మళ్లీ ఎంచుకోండి.', 'मेन्यू बदल गया, इसलिए आपके व्यंजन हट गए। नीचे फिर से चुनें।'],
    ['Please enter the number of guests, so your Standard Menu total can be worked out.', 'దయచేసి అతిథుల సంఖ్యను నమోదు చేయండి, అప్పుడు మీ స్టాండర్డ్ మెనూ మొత్తం లెక్కించవచ్చు.', 'कृपया मेहमानों की संख्या डालें, ताकि आपका स्टैंडर्ड मेन्यू कुल निकाला जा सके।'],
    ['You can choose up to two rice.', 'మీరు గరిష్టంగా రెండు అన్నం రకాలు ఎంచుకోవచ్చు.', 'आप अधिकतम दो चावल चुन सकते हैं।'],
    ['Two biryani rice means no plain rice. Remove one biryani rice first.', 'రెండు బిర్యానీ రైస్ అంటే సాదా అన్నం ఉండదు. ముందుగా ఒక బిర్యానీ రైస్ తీసివేయండి.', 'दो बिरयानी राइस का मतलब सादा चावल नहीं। पहले एक बिरयानी राइस हटाएं।'],
    ['Two rice cannot go with biryani rice. Remove your biryani rice first, or keep one rice.', 'రెండు అన్నం రకాలు బిర్యానీ రైస్‌తో కలవవు. ముందుగా బిర్యానీ రైస్ తీసివేయండి, లేదా ఒక అన్నం మాత్రమే ఉంచండి.', 'दो चावल बिरयानी राइस के साथ नहीं हो सकते। पहले बिरयानी राइस हटाएं, या एक ही चावल रखें।'],
    ['Two rice means no North Indian curry. Remove your North Indian curry first.', 'రెండు అన్నం రకాలు అంటే నార్త్ ఇండియన్ కూర ఉండదు. ముందుగా నార్త్ ఇండియన్ కూర తీసివేయండి.', 'दो चावल का मतलब नॉर्थ इंडियन करी नहीं। पहले नॉर्थ इंडियन करी हटाएं।'],
    ['You can choose up to two biryani rice.', 'మీరు గరిష్టంగా రెండు బిర్యానీ రైస్ ఎంచుకోవచ్చు.', 'आप अधिकतम दो बिरयानी राइस चुन सकते हैं।'],
    ['Two rice means no biryani rice. Remove one rice first.', 'రెండు అన్నం రకాలు అంటే బిర్యానీ రైస్ ఉండదు. ముందుగా ఒక అన్నం తీసివేయండి.', 'दो चावल का मतलब बिरयानी राइस नहीं। पहले एक चावल हटाएं।'],
    ['Two biryani rice cannot go with plain rice. Remove your rice first, or keep one biryani rice.', 'రెండు బిర్యానీ రైస్ సాదా అన్నంతో కలవవు. ముందుగా అన్నం తీసివేయండి, లేదా ఒక బిర్యానీ రైస్ మాత్రమే ఉంచండి.', 'दो बिरयानी राइस सादे चावल के साथ नहीं हो सकते। पहले चावल हटाएं, या एक ही बिरयानी राइस रखें।'],
    ['Two biryani rice means no South Indian curry. Remove your South Indian curry first.', 'రెండు బిర్యానీ రైస్ అంటే సౌత్ ఇండియన్ కూర ఉండదు. ముందుగా సౌత్ ఇండియన్ కూర తీసివేయండి.', 'दो बिरयानी राइस का मतलब साउथ इंडियन करी नहीं। पहले साउथ इंडियन करी हटाएं।'],
    ['You can choose up to two North Indian curries.', 'మీరు గరిష్టంగా రెండు నార్త్ ఇండియన్ కూరలు ఎంచుకోవచ్చు.', 'आप अधिकतम दो नॉर्थ इंडियन करी चुन सकते हैं।'],
    ['Two rice means no North Indian curry. Remove one rice to add one.', 'రెండు అన్నం రకాలు అంటే నార్త్ ఇండియన్ కూర ఉండదు. ఒకటి జోడించడానికి ఒక అన్నం తీసివేయండి.', 'दो चावल का मतलब नॉर्थ इंडियन करी नहीं। जोड़ने के लिए एक चावल हटाएं।'],
    ['To choose two North Indian curries, pick two biryani rice and no plain rice.', 'రెండు నార్త్ ఇండియన్ కూరలు ఎంచుకోవడానికి, రెండు బిర్యానీ రైస్ ఎంచుకోండి, సాదా అన్నం వద్దు.', 'दो नॉर्थ इंडियन करी चुनने के लिए दो बिरयानी राइस चुनें, सादा चावल नहीं।'],
    ['You can choose up to two South Indian curries.', 'మీరు గరిష్టంగా రెండు సౌత్ ఇండియన్ కూరలు ఎంచుకోవచ్చు.', 'आप अधिकतम दो साउथ इंडियन करी चुन सकते हैं।'],
    ['Two biryani rice means no South Indian curry. Remove one biryani rice to add one.', 'రెండు బిర్యానీ రైస్ అంటే సౌత్ ఇండియన్ కూర ఉండదు. ఒకటి జోడించడానికి ఒక బిర్యానీ రైస్ తీసివేయండి.', 'दो बिरयानी राइस का मतलब साउथ इंडियन करी नहीं। जोड़ने के लिए एक बिरयानी राइस हटाएं।'],
    ['To choose two South Indian curries, pick two rice and no biryani rice.', 'రెండు సౌత్ ఇండియన్ కూరలు ఎంచుకోవడానికి, రెండు అన్నం రకాలు ఎంచుకోండి, బిర్యానీ రైస్ వద్దు.', 'दो साउथ इंडियन करी चुनने के लिए दो चावल चुनें, बिरयानी राइस नहीं।'],
    ['That choice is not available with your current picks.', 'మీరు ప్రస్తుతం ఎంచుకున్న వాటితో ఈ ఎంపిక సాధ్యం కాదు.', 'आपके मौजूदा चुनाव के साथ यह विकल्प उपलब्ध नहीं है।'],
    ['Remove one South Indian curry first. One rice allows only one South Indian curry.', 'ముందుగా ఒక సౌత్ ఇండియన్ కూర తీసివేయండి. ఒక అన్నానికి ఒక సౌత్ ఇండియన్ కూర మాత్రమే.', 'पहले एक साउथ इंडियन करी हटाएं। एक चावल के साथ केवल एक साउथ इंडियन करी मिलती है।'],
    ['Remove one North Indian curry first. One biryani rice allows only one North Indian curry.', 'ముందుగా ఒక నార్త్ ఇండియన్ కూర తీసివేయండి. ఒక బిర్యానీ రైస్‌కు ఒక నార్త్ ఇండియన్ కూర మాత్రమే.', 'पहले एक नॉर्थ इंडियन करी हटाएं। एक बिरयानी राइस के साथ केवल एक नॉर्थ इंडियन करी मिलती है।'],
    ['That change is not allowed with your current picks.', 'మీరు ప్రస్తుతం ఎంచుకున్న వాటితో ఈ మార్పు సాధ్యం కాదు.', 'आपके मौजूदा चुनाव के साथ यह बदलाव संभव नहीं है।'],

    /* ---- step 1 ---- */
    ['Event details', 'వేడుక వివరాలు', 'कार्यक्रम का विवरण'],
    ['Tell us about the occasion and who it is for.', 'వేడుక గురించి, ఎవరి కోసమో మాకు చెప్పండి.', 'हमें अवसर के बारे में और यह किसके लिए है, बताएं।'],
    ['Customer name', 'కస్టమర్ పేరు', 'ग्राहक का नाम'],
    ['Phone', 'ఫోన్ నంబర్', 'फ़ोन नंबर'],
    ['Customer email', 'కస్టమర్ ఈమెయిల్', 'ग्राहक का ईमेल'],
    ['Email', 'ఈమెయిల్', 'ईमेल'],
    ['Address', 'చిరునామా', 'पता'],
    ['Event type', 'వేడుక రకం', 'कार्यक्रम का प्रकार'],
    ['Event date', 'వేడుక తేదీ', 'कार्यक्रम की तारीख'],
    ['Event time', 'వేడుక సమయం', 'कार्यक्रम का समय'],
    ['Number of guests', 'అతిథుల సంఖ్య', 'मेहमानों की संख्या'],
    ['e.g. 150', 'ఉదా: 150', 'जैसे: 150'],
    ['e.g. Ramesh Kumar', 'ఉదా: రమేష్ కుమార్', 'जैसे: रमेश कुमार'],
    ['e.g. 98765 43210', 'ఉదా: 98765 43210', 'जैसे: 98765 43210'],
    ['e.g. ramesh@gmail.com', 'ఉదా: ramesh@gmail.com', 'जैसे: ramesh@gmail.com'],
    ['e.g. Plot 12, Road No. 3, Saheb Nagar, Hyderabad - 500070', 'ఉదా: ప్లాట్ 12, రోడ్ నం. 3, సాహెబ్ నగర్, హైదరాబాద్ - 500070', 'जैसे: प्लॉट 12, रोड नं. 3, साहेब नगर, हैदराबाद - 500070'],

    /* ---- step 2 ---- */
    ['Pick your dishes', 'మీ వంటకాలను ఎంచుకోండి', 'अपने व्यंजन चुनें'],
    ['Choose dishes from the list. They land on the plate as you tap.', 'జాబితా నుండి వంటకాలను ఎంచుకోండి. మీరు నొక్కగానే అవి ప్లేటులో చేరతాయి.', 'सूची से व्यंजन चुनें। टैप करते ही वे प्लेट पर आ जाते हैं।'],
    ['Items', 'వంటకాలు', 'व्यंजन'],
    ['All', 'అన్నీ', 'सभी'],
    ['Your plate', 'మీ ప్లేటు', 'आपकी प्लेट'],
    ['No items found for this meal yet.', 'ఈ భోజనానికి ఇంకా వంటకాలు లేవు.', 'इस भोजन के लिए अभी कोई व्यंजन नहीं मिला।'],
    ['No dishes yet', 'ఇంకా వంటకాలు లేవు', 'अभी कोई व्यंजन नहीं'],
    ['Clear all', 'అన్నీ తీసివేయి', 'सब हटाएं'],
    ['Tap dishes above to place them on your plate.', 'వంటకాలను మీ ప్లేటులో ఉంచడానికి పైన నొక్కండి.', 'व्यंजन अपनी प्लेट में रखने के लिए ऊपर टैप करें।'],
    ['Banana leaf', 'అరటి ఆకు', 'केले का पत्ता'],
    ['Yellow leaf plate', 'పసుపు ఆకు ప్లేటు', 'पीली पत्ता प्लेट'],
    ['Green leaf-print plate', 'ఆకుపచ్చ ఆకు డిజైన్ ప్లేటు', 'हरी पत्ती प्रिंट प्लेट'],
    ['Natural leaf plate', 'సహజ ఆకు ప్లేటు', 'प्राकृतिक पत्ता प्लेट'],
    ['Gold gift tray', 'గోల్డ్ గిఫ్ట్ ట్రే', 'गोल्ड गिफ्ट ट्रे'],
    ['Sweet gift box', 'స్వీట్ గిఫ్ట్ బాక్స్', 'मिठाई गिफ्ट बॉक्स'],
    ['Clear plastic glass', 'ప్లాస్టిక్ గ్లాసు', 'प्लास्टिक का गिलास'],
    ['Paper juice cup', 'పేపర్ జ్యూస్ కప్పు', 'पेपर जूस कप'],
    /* dish categories (tabs, plate labels, PDF) */
    ['Water Bottles', 'వాటర్ బాటిళ్లు', 'पानी की बोतलें'],
    ['Sweets', 'స్వీట్లు', 'मिठाइयाँ'],
    ['Hot Snacks', 'హాట్ స్నాక్స్', 'गरम नाश्ता'],
    ['Saree Items', 'చీరల వేడుక ఐటమ్స్', 'साड़ी समारोह आइटम'],
    ['Snacks', 'స్నాక్స్', 'स्नैक्स'],
    ['Roti', 'రొట్టెలు', 'रोटी'],
    ['Rice', 'అన్నం', 'चावल'],
    ['Biryani Rice', 'బిర్యానీ రైస్', 'बिरयानी राइस'],
    ['North Indian Curries', 'నార్త్ ఇండియన్ కూరలు', 'नॉर्थ इंडियन करी'],
    ['South Indian Curries', 'సౌత్ ఇండియన్ కూరలు', 'साउथ इंडियन करी'],
    ['South Indian Fry', 'సౌత్ ఇండియన్ ఫ్రై', 'साउथ इंडियन फ्राई'],
    ['South Indian Liquids', 'సౌత్ ఇండియన్ పులుసులు / చారు', 'साउथ इंडियन तरल (सांभर, रसम)'],
    ['Dal Items', 'పప్పు రకాలు', 'दाल'],
    ['Raitas', 'రైతాలు', 'रायता'],
    ['Chat Items', 'చాట్ ఐటమ్స్', 'चाट'],
    ['Soups', 'సూప్స్', 'सूप'],
    ['Pickles & Chutneys', 'పచ్చళ్లు & చట్నీలు', 'अचार और चटनी'],
    ['Podulu', 'పొడులు', 'पोडुलु (मसाला पाउडर)'],
    ['Tiffins', 'టిఫిన్లు', 'टिफ़िन (नाश्ता)'],
    ['Fruit Juices', 'ఫ్రూట్ జ్యూస్‌లు', 'फलों के जूस'],
    ['Fruit Juices & Fruit Chat', 'ఫ్రూట్ జ్యూస్‌లు & ఫ్రూట్ చాట్', 'फलों के जूस और फ्रूट चाट'],
    ['Hot Drinks', 'వేడి పానీయాలు', 'गरम पेय'],
    ['Ice Creams', 'ఐస్ క్రీమ్స్', 'आइसक्रीम'],
    ['Special Items', 'ప్రత్యేక ఐటమ్స్', 'विशेष आइटम'],
    ['Default Items', 'డిఫాల్ట్ ఐటమ్స్', 'डिफ़ॉल्ट आइटम'],
    ['Default items', 'డిఫాల్ట్ ఐటమ్స్', 'डिफ़ॉल्ट आइटम'],
    ['Starters', 'స్టార్టర్స్', 'स्टार्टर'],
    ['Sides', 'సైడ్స్', 'साइड'],
    ['Special', 'ప్రత్యేకం', 'विशेष'],
    ['Curries', 'కూరలు', 'करी'],
    ['Drinks', 'పానీయాలు', 'पेय'],

    /* ---- steps 3 to 7 ---- */
    ['Service boys', 'సర్వీస్ బాయ్స్', 'सर्विस बॉय'],
    ['How many service boys?', 'ఎంత మంది సర్వీస్ బాయ్స్ కావాలి?', 'कितने सर्विस बॉय चाहिए?'],
    ['One fewer service boy', 'ఒకరిని తగ్గించండి', 'एक कम करें'],
    ['One more service boy', 'ఒకరిని పెంచండి', 'एक बढ़ाएं'],
    ['Not sure? Leave it at 0 and we’ll suggest a number for your guests.', 'ఖచ్చితంగా తెలియదా? 0 గా ఉంచండి, మీ అతిథుల సంఖ్యకు తగ్గ సంఖ్యను మేము సూచిస్తాము.', 'पक्का नहीं पता? 0 रहने दें, हम आपके मेहमानों के हिसाब से संख्या बता देंगे।'],
    ['Trained helpers to serve your guests with a smile.', 'మీ అతిథులకు చిరునవ్వుతో వడ్డించే శిక్షణ పొందిన సిబ్బంది.', 'आपके मेहमानों को मुस्कान के साथ परोसने वाले प्रशिक्षित सहायक।'],
        ['Service boys are charged extra. The amount will be confirmed in your final quotation.', 'సర్వీస్ బాయ్స్ కు అదనపు ఛార్జీలు వర్తిస్తాయి. ఆ మొత్తాన్ని మీ తుది కొటేషన్ లో తెలియజేస్తాము.', 'सर्विस बॉय के लिए अलग से शुल्क लगेगा। राशि आपके अंतिम कोटेशन में बताई जाएगी।'],
    ['Note:', 'గమనిక:', 'नोट:'],
    ['Note: Service boys are charged extra. The amount will be confirmed in your final quotation.', 'గమనిక: సర్వీస్ బాయ్స్ కు అదనపు ఛార్జీలు వర్తిస్తాయి. ఆ మొత్తాన్ని మీ తుది కొటేషన్ లో తెలియజేస్తాము.', 'नोट: सर्विस बॉय के लिए अलग से शुल्क लगेगा। राशि आपके अंतिम कोटेशन में बताई जाएगी।'],
    ['Please suggest', 'దయచేసి సూచించండి', 'कृपया सुझाएं'],
    ['Pickup or delivery', 'పికప్ లేదా డెలివరీ', 'पिकअप या डिलीवरी'],
    ['Pickup / delivery', 'పికప్ / డెలివరీ', 'पिकअप / डिलीवरी'],
    ['Delivery by us', 'మా ద్వారా డెలివరీ', 'हमारी ओर से डिलीवरी'],
    ['We bring it to your address', 'మేము మీ చిరునామాకు తీసుకువస్తాము', 'हम इसे आपके पते पर लाएंगे'],
    ['Self pickup', 'స్వయంగా పికప్', 'खुद लेने आएं'],
    ['You collect it from us', 'మీరు మా వద్ద నుండి తీసుకోవచ్చు', 'आप हमसे ले जाएं'],
    ['We can bring it to your door, or you can collect it.', 'మేము మీ ఇంటికి తీసుకురావచ్చు, లేదా మీరు తీసుకెళ్లవచ్చు.', 'हम आपके दरवाज़े तक पहुंचा सकते हैं, या आप खुद ले जा सकते हैं।'],
    ['We’ll deliver to the address above.', 'పైన ఉన్న చిరునామాకు మేము డెలివరీ చేస్తాము.', 'हम ऊपर दिए पते पर डिलीवरी करेंगे।'],
    ['Please add your delivery address above.', 'దయచేసి పైన మీ డెలివరీ చిరునామాను జోడించండి.', 'कृपया ऊपर अपना डिलीवरी पता डालें।'],
    ['Spice level', 'కారం స్థాయి', 'मसाले का स्तर'],
    ['How spicy should the food be?', 'ఆహారం ఎంత కారంగా ఉండాలి?', 'खाना कितना तीखा होना चाहिए?'],
    ['Mild', 'తక్కువ కారం', 'हल्का'],
    ['Gentle, family friendly', 'మృదువైనది, కుటుంబానికి అనుకూలం', 'हल्का, परिवार के अनुकूल'],
    ['Medium', 'మధ్యస్థం', 'मध्यम'],
    ['Balanced, our usual', 'సమతుల్యం, మా సాధారణ రుచి', 'संतुलित, हमारा सामान्य स्वाद'],
    ['Hot', 'కారం', 'तीखा'],
    ['Proper Andhra heat', 'అసలైన ఆంధ్ర కారం', 'असली आंध्रा तीखापन'],
    ['Extra hot', 'చాలా కారం', 'बहुत तीखा'],
    ['Bring the fire', 'ఘాటుగా కావాలి', 'ज़बरदस्त तीखा'],
    ['We cook to your family’s taste.', 'మేము మీ కుటుంబ రుచికి తగ్గట్టు వండుతాము.', 'हम आपके परिवार के स्वाद के अनुसार पकाते हैं।'],
    ['Serving style', 'వడ్డించే విధానం', 'परोसने का तरीका'],
    ['Buffet', 'బఫే', 'बुफे'],
    ['Guests serve themselves', 'అతిథులు స్వయంగా వడ్డించుకుంటారు', 'मेहमान खुद परोसते हैं'],
    ['Table service', 'టేబుల్ సర్వీస్', 'टेबल सर्विस'],
    ['Served at the table', 'టేబుల్ వద్ద వడ్డిస్తారు', 'टेबल पर परोसा जाता है'],
    ['Banana-leaf sit-down', 'అరటి ఆకులో కూర్చుని భోజనం', 'केले के पत्ते पर बैठकर भोजन'],
    ['Traditional leaf meal', 'సంప్రదాయ ఆకు భోజనం', 'पारंपरिक पत्तल भोजन'],
    ['How the food reaches your guests.', 'ఆహారం మీ అతిథులకు ఎలా అందుతుంది.', 'खाना आपके मेहमानों तक कैसे पहुंचता है।'],
    ['Extras', 'అదనపు సేవలు', 'अतिरिक्त सेवाएं'],
    ['Live counter', 'లైవ్ కౌంటర్', 'लाइव काउंटर'],
    ['Live counters and stalls', 'లైవ్ కౌంటర్లు మరియు స్టాళ్లు', 'लाइव काउंटर और स्टॉल'],
        ['Puri Counter', 'పూరీ కౌంటర్', 'पूरी काउंटर'],
    ['Sweetness level', 'తీపి స్థాయి', 'मिठास का स्तर'],
    ['We sweeten the drinks to your guests’ taste.', 'మీ అతిథుల రుచికి తగ్గట్టు డ్రింక్స్ లో తీపి వేస్తాము.', 'हम आपके मेहमानों के स्वाद के अनुसार ड्रिंक्स में मिठास रखते हैं।'],
    ['Less sweet', 'తక్కువ తీపి', 'कम मीठा'],
    ['Just a hint of sweetness', 'కొద్దిగా మాత్రమే తీపి', 'बस हल्की सी मिठास'],
    ['Regular', 'సాధారణం', 'सामान्य'],
    ['Extra sweet', 'ఎక్కువ తీపి', 'ज़्यादा मीठा'],
    ['For those with a sweet tooth', 'తీపి ఇష్టపడే వారికి', 'मीठे के शौकीनों के लिए'],
    ['No added sugar', 'చక్కెర కలపకుండా', 'बिना चीनी'],
    ['Only the fruit’s own sweetness', 'పండ్ల సహజ తీపి మాత్రమే', 'सिर्फ़ फलों की अपनी मिठास'],
    ['Drink serving style', 'డ్రింక్స్ వడ్డించే విధానం', 'ड्रिंक्स परोसने का तरीका'],
    ['How the drinks reach your guests.', 'డ్రింక్స్ అతిథులకు ఎలా అందుతాయి.', 'ड्रिंक्स मेहमानों तक कैसे पहुँचते हैं।'],
    ['Tray service', 'ట్రే సర్వీస్', 'ट्रे सर्विस'],
    ['Our boys carry glasses on trays', 'మా సిబ్బంది ట్రేలలో గ్లాసులు అందిస్తారు', 'हमारे लड़के ट्रे में गिलास पेश करते हैं'],
    ['Drinks counter', 'డ్రింక్స్ కౌంటర్', 'ड्रिंक्स काउंटर'],
    ['Guests pick up a glass at a counter', 'అతిథులు కౌంటర్ వద్ద గ్లాసు తీసుకుంటారు', 'मेहमान काउंटर से गिलास लेते हैं'],
    ['Dispenser station', 'డిస్పెన్సర్ స్టేషన్', 'डिस्पेंसर स्टेशन'],
    ['Chilled dispensers, self-serve', 'చల్లని డిస్పెన్సర్లు, అతిథులు స్వయంగా తీసుకుంటారు', 'ठंडे डिस्पेंसर, मेहमान खुद लेते हैं'],
    ['Chafing dishes', 'చాఫింగ్ డిషెస్', 'चैफिंग डिश'],
    ['Keeps food hot', 'ఆహారాన్ని వేడిగా ఉంచుతుంది', 'खाना गरम रखता है'],
    ['Cleanup crew', 'క్లీనప్ సిబ్బంది', 'सफाई दल'],
    ['We clear up after the event', 'వేడుక తర్వాత మేము శుభ్రం చేస్తాము', 'कार्यक्रम के बाद हम सफाई करते हैं'],
    ['Which live counters or stalls?', 'ఏ లైవ్ కౌంటర్లు లేదా స్టాళ్లు?', 'कौन से लाइव काउंटर या स्टॉल?'],
    ['choose any', 'ఏవైనా ఎంచుకోండి', 'कोई भी चुनें'],
    ['Little touches that make the day feel grand.', 'ఆ రోజును వైభవంగా మార్చే చిన్న చిన్న ప్రత్యేకతలు.', 'दिन को शानदार बनाने वाली छोटी-छोटी खूबियां।'],
    ['Paan', 'పాన్', 'पान'], ['Bobbatlu', 'బొబ్బట్లు', 'बोबट्टू'], ['Dosa', 'దోశ', 'डोसा'], ['Chaat', 'చాట్', 'चाट'],
    ['Jalebi', 'జిలేబి', 'जलेबी'], ['Pani puri', 'పానీ పూరీ', 'पानी पूरी'], ['Ice cream', 'ఐస్ క్రీమ్', 'आइसक्रीम'],
    ['Ice carving', 'ఐస్ కార్వింగ్', 'आइस कार्विंग'], ['Veg carving', 'వెజ్ కార్వింగ్', 'वेज कार्विंग'], ['Fruit stall', 'ఫ్రూట్ స్టాల్', 'फ्रूट स्टॉल'],

    /* ---- step 8 + buttons + messages ---- */
    ['Special requests', 'ప్రత్యేక అభ్యర్థనలు', 'विशेष अनुरोध'],
    ['e.g. serve sweets first, a few guests are diabetic…', 'ఉదా: ముందుగా స్వీట్లు వడ్డించండి, కొందరు అతిథులకు షుగర్ ఉంది…', 'जैसे: पहले मिठाई परोसें, कुछ मेहमानों को डायबिटीज़ है…'],
    ['Save this meal & add another', 'ఈ భోజనాన్ని సేవ్ చేసి మరొకటి జోడించండి', 'इस भोजन को सेव करें और दूसरा जोड़ें'],
    ['Get my quotation', 'నా కొటేషన్ పొందండి', 'मेरा कोटेशन पाएं'],
    ['Remove', 'తీసివేయి', 'हटाएं'],
    ['Pick at least one dish before saving this meal.', 'ఈ భోజనాన్ని సేవ్ చేసే ముందు కనీసం ఒక వంటకం ఎంచుకోండి.', 'इस भोजन को सेव करने से पहले कम से कम एक व्यंजन चुनें।'],
    ['Please enter your name.', 'దయచేసి మీ పేరు నమోదు చేయండి.', 'कृपया अपना नाम डालें।'],
    ['Please enter a valid phone number.', 'దయచేసి సరైన ఫోన్ నంబర్ నమోదు చేయండి.', 'कृपया सही फ़ोन नंबर डालें।'],
    ['Please pick at least one dish from the Items panel.', 'దయచేసి వంటకాల జాబితా నుండి కనీసం ఒక వంటకం ఎంచుకోండి.', 'कृपया व्यंजन सूची से कम से कम एक व्यंजन चुनें।'],
    ['Sending your quotation…', 'మీ కొటేషన్ పంపుతున్నాము…', 'आपका कोटेशन भेजा जा रहा है…'],
    ['Sorry, we could not send your quotation. Please try again, or call us on 77940 93779.', 'క్షమించండి, మీ కొటేషన్ పంపలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి, లేదా 77940 93779 కు కాల్ చేయండి.', 'क्षमा करें, हम आपका कोटेशन नहीं भेज सके। कृपया फिर से कोशिश करें, या 77940 93779 पर कॉल करें।'],

    /* ---- the quotation shown after sending + the PDF + the email ---- */
    ['Your quotation request', 'మీ కొటేషన్ అభ్యర్థన', 'आपका कोटेशन अनुरोध'],
    ['QUOTATION REQUEST', 'కొటేషన్ అభ్యర్థన', 'कोटेशन अनुरोध'],
    ['Requested on:', 'అభ్యర్థన తేదీ:', 'अनुरोध की तारीख:'],
    ['CUSTOMER', 'కస్టమర్', 'ग्राहक'],
    ['EVENT', 'వేడుక', 'कार्यक्रम'],
    ['SERVICE DETAILS', 'సేవా వివరాలు', 'सेवा विवरण'],
    ['PRICE', 'ధర', 'कीमत'],
    ['TOTAL', 'మొత్తం', 'कुल'],
    ['TOTAL (STANDARD MENU MEALS ONLY)', 'మొత్తం (స్టాండర్డ్ మెనూ భోజనాలు మాత్రమే)', 'कुल (केवल स्टैंडर्ड मेन्यू भोजन)'],
    ['Name', 'పేరు', 'नाम'],
    ['Event', 'వేడుక', 'कार्यक्रम'],
    ['Date', 'తేదీ', 'तारीख'],
    ['Price', 'ధర', 'कीमत'],
    ['Total', 'మొత్తం', 'कुल'],
    ['Total (Standard Menu only)', 'మొత్తం (స్టాండర్డ్ మెనూ మాత్రమే)', 'कुल (केवल स्टैंडर्ड मेन्यू)'],
    ['Note', 'గమనిక', 'नोट'],
    ['None', 'ఏవీ లేవు', 'कोई नहीं'],
    ['Note: the Standard Menu rate may vary in some seasons or due to inflation.', 'గమనిక: సీజన్‌ను బట్టి లేదా ద్రవ్యోల్బణం వల్ల స్టాండర్డ్ మెనూ ధర మారవచ్చు.', 'ध्यान दें: मौसम या महंगाई के कारण स्टैंडर्ड मेन्यू की दर बदल सकती है।'],
    ['The Standard Menu rate may vary in some seasons or due to inflation.', 'సీజన్‌ను బట్టి లేదా ద్రవ్యోల్బణం వల్ల స్టాండర్డ్ మెనూ ధర మారవచ్చు.', 'मौसम या महंगाई के कारण स्टैंडर्ड मेन्यू की दर बदल सकती है।'],
    ['Price to be finalised with Mrs. Vuppala Jagadeeswari', 'ధర ' + NAME_TE + ' గారితో నిర్ణయించబడుతుంది', 'कीमत ' + NAME_HI + ' जी के साथ तय की जाएगी'],
    ['All Events Menu: price to be finalised with Mrs. Vuppala Jagadeeswari', 'ఆల్ ఈవెంట్స్ మెనూ: ధర ' + NAME_TE + ' గారితో నిర్ణయించబడుతుంది', 'ऑल इवेंट्स मेन्यू: कीमत ' + NAME_HI + ' जी के साथ तय की जाएगी'],
    ['For the All Events Menu, Mrs. Vuppala Jagadeeswari will review your selection and contact you to discuss and finalise the price.', 'ఆల్ ఈవెంట్స్ మెనూ కోసం, ' + NAME_TE + ' గారు మీ ఎంపికను పరిశీలించి, ధర నిర్ణయించడానికి మిమ్మల్ని సంప్రదిస్తారు.', 'ऑल इवेंट्स मेन्यू के लिए, ' + NAME_HI + ' जी आपका चुनाव देखकर कीमत तय करने के लिए आपसे संपर्क करेंगी।'],
    ['Mrs. Vuppala Jagadeeswari will review your selection and call you to discuss and finalise the price.', NAME_TE + ' గారు మీ ఎంపికను పరిశీలించి, ధర నిర్ణయించడానికి మీకు కాల్ చేస్తారు.', NAME_HI + ' जी आपका चुनाव देखकर कीमत तय करने के लिए आपको कॉल करेंगी।'],
    ['Mrs. Vuppala Jagadeeswari will call you for further details and any changes.', NAME_TE + ' గారు మరిన్ని వివరాల కోసం మరియు ఏవైనా మార్పుల కోసం మీకు కాల్ చేస్తారు.', NAME_HI + ' जी अधिक जानकारी और किसी भी बदलाव के लिए आपको कॉल करेंगी।'],
    ['Mrs. VSuppala Jagadeeswari will call you for further details and any changes.', NAME_TE + ' గారు మరిన్ని వివరాల కోసం మరియు ఏవైనా మార్పుల కోసం మీకు కాల్ చేస్తారు.', NAME_HI + ' जी अधिक जानकारी और किसी भी बदलाव के लिए आपको कॉल करेंगी।'],
    ['Your quotation has been sent ✓', 'మీ కొటేషన్ పంపబడింది ✓', 'आपका कोटेशन भेज दिया गया है ✓'],
    ['Thank you for choosing Abhinav Caterers.', 'అభినవ్ క్యాటరర్స్‌ను ఎంచుకున్నందుకు ధన్యవాదాలు.', 'अभिनव कैटरर्स को चुनने के लिए धन्यवाद।'],
    ['Download PDF', 'PDF డౌన్‌లోడ్ చేయండి', 'PDF डाउनलोड करें']
  ];

  /* pieces replaced inside longer lines (meal titles like "Lunch - Standard Menu (Rs. 290/plate) · 12:30 PM · 70 guests (11 dishes)") */
  var FRAG = [
    ['Mrs. Vuppala Jagadeeswari', NAME_TE, NAME_HI],
    ['Welcome Drinks', 'వెల్కమ్ డ్రింక్స్', 'वेलकम ड्रिंक्स'],
    ['Snacks / High Tea', 'స్నాక్స్ / హై టీ', 'स्नैक्स / हाई टी'],
    ['All Events Menu', 'ఆల్ ఈవెంట్స్ మెనూ', 'ऑल इवेंट्स मेन्यू'],
    ['Standard Menu', 'స్టాండర్డ్ మెనూ', 'स्टैंडर्ड मेन्यू'],
    ['Breakfast', 'అల్పాహారం', 'नाश्ता'],
    ['Lunch', 'మధ్యాహ్న భోజనం', 'दोपहर का भोजन'],
    ['Dinner', 'రాత్రి భోజనం', 'रात का भोजन'],
    ['Saree', 'చీరల వేడుక', 'साड़ी समारोह'],
    ['Morning', 'ఉదయం', 'सुबह'],
    ['Night', 'రాత్రి', 'रात'],
    ['/plate', '/ప్లేటు', '/प्लेट'],
    [' guests', ' అతిథులు', ' मेहमान'],
    [' dishes)', ' వంటకాలు)', ' व्यंजन)']
  ];

  var DISH_NOUN = {   // short names used in "You can choose: 1 - Sweet" and "Our standard menu serves only one sweet."
    'sweet': ['స్వీట్', 'मिठाई'], 'hot snack': ['హాట్ స్నాక్', 'गरम नाश्ता'], 'rice': ['అన్నం', 'चावल'],
    'biryani rice': ['బిర్యానీ రైస్', 'बिरयानी राइस'], 'south indian curry': ['సౌత్ ఇండియన్ కూర', 'साउथ इंडियन करी'],
    'north indian curry': ['నార్త్ ఇండియన్ కూర', 'नॉर्थ इंडियन करी'], 'south indian fry': ['సౌత్ ఇండియన్ ఫ్రై', 'साउथ इंडियन फ्राई'],
    'dal': ['పప్పు', 'दाल'], 'liquid (sambar, rasam)': ['పులుసు / చారు (సాంబార్, రసం)', 'तरल (सांभर, रसम)']
  };

  var D = {};
  TEXT.forEach(function (r) { D[r[0]] = r; });
  var LI = { te: 1, hi: 2 };

  function dish(s, lang) {
    var t = lang === 'te' ? root.MENU_TE : root.MENU_HI;
    return (t && t[s]) || '';
  }
  function noun(n, li) { var r = DISH_NOUN[String(n).toLowerCase()]; return r ? r[li - 1] : ''; }
  function plate(rs, li) { return li === 1 ? rs + ' ఒక్కో ప్లేటుకు' : rs + ' प्रति प्लेट'; }
  function guestsWord(li) { return li === 1 ? 'అతిథులు' : 'मेहमान'; }
  function list(s, lang) {          // "Laddu, Mirchi Bajji" -> every item translated (only if every item is known)
    var li = LI[lang], parts = s.split(', '), ok = true;
    var out = parts.map(function (p) { var q = D[p] ? D[p][li] : dish(p, lang); if (!q) ok = false; return q; });
    return ok ? out.join(', ') : '';
  }

  /* lines with numbers or names inside: [pattern, function(match, li, lang) -> text] */
  var PAT = [
    [/^Step (\d+)$/, function (m, li) { return (li === 1 ? 'దశ ' : 'चरण ') + m[1]; }],
    [/^(₹\d+) per plate$/, function (m, li) { return plate(m[1], li); }],
    [/^Standard Menu: (₹\d+) per plate$/, function (m, li) { return (li === 1 ? 'స్టాండర్డ్ మెనూ: ' : 'स्टैंडर्ड मेन्यू: ') + plate(m[1], li); }],
    [/^Your total: (₹\d+) × (\d+) guests = (₹[\d,]+)$/, function (m, li) {
      return (li === 1 ? 'మీ మొత్తం: ' : 'आपका कुल: ') + m[1] + ' × ' + m[2] + ' ' + guestsWord(li) + ' = ' + m[3]; }],
    [/^Prefer a fixed price\? Switch to the Standard Menu \((₹\d+) per plate\)$/, function (m, li) {
      return li === 1 ? 'స్థిర ధర కావాలా? స్టాండర్డ్ మెనూకి మారండి (' + plate(m[1], li) + ')' : 'तय कीमत चाहिए? स्टैंडर्ड मेन्यू पर जाएं (' + plate(m[1], li) + ')'; }],
    [/^(₹\d+) per plate\. One dish from each section\. Your quotation PDF will show the total \((₹\d+) × number of guests\)\.$/, function (m, li) {
      return li === 1 ? plate(m[1], li) + '. ప్రతి విభాగం నుండి ఒక వంటకం. మీ కొటేషన్ PDF లో మొత్తం (' + m[2] + ' × అతిథుల సంఖ్య) చూపబడుతుంది.'
        : plate(m[1], li) + '। हर सेक्शन से एक व्यंजन। आपके कोटेशन PDF में कुल (' + m[2] + ' × मेहमानों की संख्या) दिखेगा।'; }],
    [/^Standard Menu (₹\d+) per plate\. Pick one dish from each section\. Tap a picked dish to change it\.$/, function (m, li) {
      return li === 1 ? 'స్టాండర్డ్ మెనూ ' + plate(m[1], li) + '. ప్రతి విభాగం నుండి ఒక వంటకం ఎంచుకోండి. మార్చడానికి ఎంచుకున్న వంటకాన్ని నొక్కండి.'
        : 'स्टैंडर्ड मेन्यू ' + plate(m[1], li) + '। हर सेक्शन से एक व्यंजन चुनें। बदलने के लिए चुने हुए व्यंजन को टैप करें।'; }],
    [/^Your menu \((\d+)\)$/, function (m, li) { return (li === 1 ? 'మీ మెనూ (' : 'आपका मेन्यू (') + m[1] + ')'; }],
    [/^(\d+) dish(?:es)? on your plate$/, function (m, li) { return li === 1 ? 'మీ ప్లేటులో ' + m[1] + ' వంటకాలు' : 'आपकी प्लेट में ' + m[1] + ' व्यंजन'; }],
    [/^(\d+:\d\d [AP]M) to (\d+:\d\d [AP]M)$/, function (m, li) { return li === 1 ? m[1] + ' నుండి ' + m[2] + ' వరకు' : m[1] + ' से ' + m[2] + ' तक'; }],
    [/^(\d+) - (.+)$/, function (m, li) { var n = noun(m[2], li); return n ? m[1] + ' - ' + n : ''; }],
    [/^(.+) not available now$/, function (m, li) { var n = noun(m[1], li); return n ? n + (li === 1 ? ' ఇప్పుడు అందుబాటులో లేదు' : ' अभी उपलब्ध नहीं') : ''; }],
    [/^Our standard menu serves only one (.+)\.$/, function (m, li) { var n = noun(m[1], li); return n ? (li === 1 ? 'మా స్టాండర్డ్ మెనూలో ' + n + ' ఒక్కటి మాత్రమే ఉంటుంది.' : 'हमारे स्टैंडर्ड मेन्यू में केवल एक ' + n + ' मिलता है।') : ''; }],
    [/^Please choose the Standard Menu or the All Events Menu for your (.+)\.$/, function (m, li, lang) {
      var meal = D[m[1].charAt(0).toUpperCase() + m[1].slice(1)];
      return li === 1 ? 'దయచేసి మీ ' + (meal ? meal[1] : m[1]) + ' కోసం స్టాండర్డ్ మెనూ లేదా ఆల్ ఈవెంట్స్ మెనూ ఎంచుకోండి.'
        : 'कृपया अपने ' + (meal ? meal[2] : m[1]) + ' के लिए स्टैंडर्ड मेन्यू या ऑल इवेंट्स मेन्यू चुनें।'; }],
    [/^Collect from (.+)\.$/, function (m, li) { return li === 1 ? m[1] + ' నుండి తీసుకోండి.' : m[1] + ' से ले जाएं।'; }],
    [/^(.+) saved\. Now choose the next meal above and pick its dishes\.$/, function (m, li, lang) {
      var meal = tr(m[1], lang);
      return li === 1 ? meal + ' సేవ్ చేయబడింది. ఇప్పుడు పైన తదుపరి భోజనాన్ని ఎంచుకుని దాని వంటకాలను ఎంచుకోండి.'
        : meal + ' सेव हो गया। अब ऊपर अगला भोजन चुनें और उसके व्यंजन चुनें।'; }],
    [/^(Mild|Medium|Hot|Extra hot)\. (.+)$/, function (m, li, lang) { return tr(m[1], lang) + '. ' + tr(m[2], lang); }],
    [/^Live counter \((.+)\)$/, function (m, li, lang) { return tr('Live counter', lang) + ' (' + (list(m[1], lang) || m[1]) + ')'; }],
    [/^Standard Menu: Rs\. (\d+) x (\d+) guests = Rs\. ([\d,]+)$/, function (m, li) {
      return (li === 1 ? 'స్టాండర్డ్ మెనూ: ' : 'स्टैंडर्ड मेन्यू: ') + 'Rs. ' + m[1] + ' × ' + m[2] + ' ' + guestsWord(li) + ' = Rs. ' + m[3]; }],
    [/^Standard Menu: Rs\. (\d+) per plate$/, function (m, li) { return (li === 1 ? 'స్టాండర్డ్ మెనూ: ' : 'स्टैंडर्ड मेन्यू: ') + plate('Rs. ' + m[1], li); }],
    [/^Rs\. (\d+) x (\d+) guests = Rs\. ([\d,]+)$/, function (m, li) { return 'Rs. ' + m[1] + ' × ' + m[2] + ' ' + guestsWord(li) + ' = Rs. ' + m[3]; }],
    [/^Rs\. (\d+) per plate \(total will be confirmed once the number of guests is final\)$/, function (m, li) {
      return li === 1 ? plate('Rs. ' + m[1], li) + ' (అతిథుల సంఖ్య ఖరారైన తర్వాత మొత్తం నిర్ధారించబడుతుంది)' : plate('Rs. ' + m[1], li) + ' (मेहमानों की संख्या तय होने पर कुल की पुष्टि होगी)'; }],
    [/^(\d+) guests$/, function (m, li) { return m[1] + ' ' + guestsWord(li); }]
  ];

  function one(c, lang) {
    var li = LI[lang], r = D[c];
    if (r) return r[li];
    var d = dish(c, lang);
    if (d) return d;
    for (var i = 0; i < PAT.length; i++) {
      var mm = PAT[i][0].exec(c);
      if (mm) { var o = PAT[i][1](mm, li, lang); if (o) return o; }
    }
    if (c.indexOf(', ') > 0) { var l = list(c, lang); if (l) return l; }
    var out = c;
    FRAG.forEach(function (f) { if (out.indexOf(f[0]) >= 0) out = out.split(f[0]).join(f[li]); });
    return out;
  }
  function tr(s, lang) {
    if (s == null || !lang || lang === 'en' || !LI[lang]) return s;
    var str = String(s), m = /^(\s*)([\s\S]*?)(\s*)$/.exec(str);
    if (!m[2]) return str;
    var out = one(m[2], lang);
    return out === m[2] ? str : m[1] + out + m[3];
  }

  function all(lang) {              // every translated word of one language (used to test a PDF font)
    var li = LI[lang], t = lang === 'te' ? root.MENU_TE : root.MENU_HI, out = [];
    TEXT.forEach(function (r) { out.push(r[li]); });
    FRAG.forEach(function (r) { out.push(r[li]); });
    Object.keys(t || {}).forEach(function (k) { out.push(t[k]); });
    return out;
  }
  root.I18N = { tr: tr, dish: dish, text: D, all: all, LANGS: ['en', 'te', 'hi'] };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.I18N;
})(typeof window !== 'undefined' ? window : globalThis);