/* ============================= Supabase ============================= */
// Replace with your project details from Supabase Dashboard -> Project Settings -> API
const SUPABASE_URL = "https://fbwubybszqzridyrydmi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZid3VieWJzenF6cmlkeXJ5ZG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MDQ1MzYsImV4cCI6MjEwMjQ4MDUzNn0.GevYCvCFsIOgvyHrQB5CmGM225LfnhJ9njt7rjMeaOw";

// True once you swap in your real project URL/key. Until then the app runs
// on local in-memory data only, so every button still works — it just won't
// save anywhere or sync between visitors.
const SUPABASE_CONFIGURED = !SUPABASE_URL.includes("YOUR_PROJECT_ID") && !SUPABASE_ANON_KEY.includes("YOUR_ANON_PUBLIC_KEY");

const supabaseClient = SUPABASE_CONFIGURED ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

if (!SUPABASE_CONFIGURED) {
  console.warn("Sanad: Supabase isn't configured yet (still using the placeholder URL/key). Housing and forum posts will only live in this browser tab until you add your real project credentials at the top of the script.");
}

/* Expected tables (create these in the Supabase SQL editor):

create table housing_listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  city text, rent int, room_type text, gender_pref text,
  nationality_pref text, bills_included boolean,
  description text, poster_role text, whatsapp text
);

create table forum_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  category text, question text, posted_by text, votes int default 0
);

create table forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references forum_posts(id) on delete cascade,
  reply_text text
);
   Enable Row Level Security with policies that allow public select/insert
   if you want anonymous visitors to read and post without logging in. */

/* ============================= i18n ============================= */
const translations = {
en: {
  brandName:"Sanad · سند", brandTag:"Your support system in Saudi Arabia",
  navHome:"Home", navGuide:"Guide", navHousing:"Housing", navCommunity:"Community",
  heroTitle:"One place for housing, guidance, and community.",
  heroSub:"Skip the confusing Facebook groups. Find a room, understand your rights, and ask people who've been there.",
  statCities:"Cities covered", statListings:"Rooms shared this month", statLangs:"Languages",
  qnGuideTitle:"Know your rights", qnGuideSub:"Labor law, Qiwa, Iqama & banking, explained simply",
  qnHousingTitle:"Find a room", qnHousingSub:"Shared housing across 6 major cities",
  qnCommunityTitle:"Ask the community", qnCommunitySub:"Real answers from people already living here — not a random Facebook group",
  trustTitle:"Built to be trustworthy",
  trustBody:"No login wall for browsing, no algorithm deciding what you see. Guide content is written in plain language and reviewed for accuracy, not virality.",
  guideEyebrow:"Knowledge guide hub", guideTitle:"Understand the system before it confuses you",
  guideSub:"Short, plain-language explainers on the things every worker eventually needs.",
  housingEyebrow:"Roommate & shared housing board", housingTitle:"Find your next room",
  housingSub:"Real listings from tenants and property owners. Contact directly on WhatsApp — no middleman.",
  housingPostBtn:"Post a room or list a spare bed",
  postFormTitle:"Post a listing", postFormHint:"This is a demo form — submissions are shown below but not saved.",
  lblCity:"City", lblRent:"Monthly rent (SAR)", lblRoomType:"Room type",
  rtShared:"Shared room", rtPrivate:"Private room", rtBed:"Bed space",
  lblGender:"Gender preference", genAny:"Any", genMale:"Men only", genFemale:"Women only",
  lblNationality:"Nationality / language preference", natAny:"Any", natArab:"Arab",
  lblBills:"Electricity & water included", lblDesc:"Description", descPh:"e.g. Close to metro, quiet flat, 3 flatmates already...",
  lblWhatsapp:"WhatsApp number", postFormSubmit:"Publish listing",
  filterAllCities:"All cities", filterAnyBudget:"Any budget", filterUnder500:"Under 500 SAR", filterUnder800:"Under 800 SAR", filterUnder1200:"Under 1,200 SAR",
  filterAnyNat:"Any nationality pref.",
  perMonth:"/ month", contactWA:"WhatsApp", billsIncluded:"Bills included", billsShared:"Bills shared",
  postedBy:"Posted by",
  communityEyebrow:"Community Q&A", communityTitle:"Ask people who've already figured it out",
  communitySub:"Peer answers on housing, legal questions, jobs, and everyday life.",
  communityAskBtn:"Ask a question",
  askFormTitle:"New question", askFormHint:"This is a demo form — submissions are shown below but not saved.",
  lblCategory:"Category", catHousing:"Housing", catLegal:"Legal", catJobs:"Jobs", catLife:"General life",
  lblQuestion:"Your question", questionPh:"Type your question here...", askFormSubmit:"Post question",
  catAll:"All", replies:"replies", viewReplies:"View replies", hideReplies:"Hide replies",
  footNote:"Sanad is a community platform. Always verify official procedures on government portals such as Qiwa, Absher, and Muqeem.",
  emergencyTitle:"Emergency contacts", em911:"Emergency (Police)", em998:"Civil Defense (Fire)", em997:"Ambulance (Red Crescent)", em19911:"Ministry of HR — Labor Inquiries",
  navProfile:"Profile", shareLabel:"Share", copyLink:"Copy link", linkCopied:"Link copied!", shareViaWhatsapp:"Share via WhatsApp", shareThisPage:"Share this page",
  signInTitle:"Quick sign-in", signInHint:"Just your name and phone — no password needed. This lets us credit your posts and track your shared links.",
  lblName:"Your name", lblPhone:"Phone number", signInSubmit:"Continue", signedInAs:"Signed in as", signOutBtn:"Sign out",
  communityTabQA:"Q&A", communityTabBuddies:"Buddies", becomeBuddyBtn:"Become a buddy — help newcomers",
  buddyFormTitle:"Sign up as a buddy", buddyFormHint:"Newcomers will be able to see your profile and reach you on WhatsApp.",
  lblHelpAreas:"What can you help with?", helpHousing:"Finding housing", helpPaperwork:"Paperwork & procedures", helpOrientation:"General orientation",
  lblBio:"Short bio", bioPh:"e.g. Lived in Riyadh for 3 years, happy to help with Absher/Nafath setup...",
  buddyFormSubmit:"Publish my buddy profile", noBuddiesYet:"No buddies listed yet — be the first!", helpsWith:"Can help with",
  videoLabel:"Room video (optional)", videoHint:"A short walkthrough gets far more replies than photos alone.", uploadingVideo:"Uploading video...",
  profileEyebrow:"Your account", profileTitleSignedOut:"Sign in to unlock more", profileSubSignedOut:"Posting, becoming a buddy, and sharing links all use the same quick sign-in.",
  myLinksTitle:"My share links", myLinksHint:"Generate a personal link for any section — you'll see how many times each one gets clicked.",
  generateLinkBtn:"Get link", clicksLabel:"clicks",
  filterAnyGender:"Any gender", filterMaleOnly:"Men only", filterFemaleOnly:"Women only",
  filterAnyRoom:"Any room type", filterShared:"Shared room", filterPrivate:"Private room", filterBed:"Bed space",
  filtersLabel:"Filters", filtersReset:"Reset", filtersShow:"Show results",
  lblBudget:"Budget", lblNatShort:"Nationality", lblGenderShort:"Gender",
  noListingsTitle:"No rooms match these filters", noListingsSub:"Try a wider budget, or clear a filter or two."
},
ar: {
  brandName:"سند · Sanad", brandTag:"سندك في السعودية",
  navHome:"الرئيسية", navGuide:"الدليل", navHousing:"السكن", navCommunity:"المجتمع",
  heroTitle:"مكان واحد للسكن والإرشاد والمجتمع",
  heroSub:"تجاوز مجموعات فيسبوك المربكة. اعثر على غرفة، افهم حقوقك، واسأل من سبقوك بالتجربة.",
  statCities:"مدن مغطاة", statListings:"غرف تم مشاركتها هذا الشهر", statLangs:"لغات",
  qnGuideTitle:"اعرف حقوقك", qnGuideSub:"نظام العمل، قوى، الإقامة والبنوك بشرح مبسّط",
  qnHousingTitle:"ابحث عن غرفة", qnHousingSub:"سكن مشترك في ٦ مدن رئيسية",
  qnCommunityTitle:"اسأل المجتمع", qnCommunitySub:"إجابات حقيقية من أشخاص يعيشون هنا فعلاً — وليس مجموعة فيسبوك عشوائية",
  trustTitle:"مصمَّم ليكون جديراً بالثقة",
  trustBody:"لا تحتاج تسجيل دخول للتصفح، ولا خوارزمية تتحكم بما تراه. محتوى الدليل مكتوب بلغة بسيطة ويُراجَع للدقة لا للانتشار.",
  guideEyebrow:"مركز الدليل المعرفي", guideTitle:"افهم النظام قبل أن يربكك",
  guideSub:"شروحات قصيرة وبلغة بسيطة لكل ما يحتاجه العامل عاجلاً أم آجلاً.",
  housingEyebrow:"لوحة السكن المشترك والزملاء", housingTitle:"ابحث عن غرفتك القادمة",
  housingSub:"إعلانات حقيقية من مستأجرين وملاك عقارات. تواصل مباشرة عبر واتساب — بدون وسيط.",
  housingPostBtn:"أضف إعلان غرفة أو سرير شاغر",
  postFormTitle:"نشر إعلان", postFormHint:"هذا نموذج تجريبي — تظهر الإعلانات أدناه ولا يتم حفظها.",
  lblCity:"المدينة", lblRent:"الإيجار الشهري (ريال)", lblRoomType:"نوع الغرفة",
  rtShared:"غرفة مشتركة", rtPrivate:"غرفة خاصة", rtBed:"سرير فقط",
  lblGender:"تفضيل الجنس", genAny:"الكل", genMale:"رجال فقط", genFemale:"نساء فقط",
  lblNationality:"تفضيل الجنسية / اللغة", natAny:"أي جنسية", natArab:"عربي",
  lblBills:"الكهرباء والماء شاملة", lblDesc:"الوصف", descPh:"مثال: قريب من المترو، شقة هادئة، ٣ سكان حالياً...",
  lblWhatsapp:"رقم واتساب", postFormSubmit:"نشر الإعلان",
  filterAllCities:"كل المدن", filterAnyBudget:"أي ميزانية", filterUnder500:"أقل من ٥٠٠ ريال", filterUnder800:"أقل من ٨٠٠ ريال", filterUnder1200:"أقل من ١٢٠٠ ريال",
  filterAnyNat:"أي تفضيل جنسية",
  perMonth:"/ شهرياً", contactWA:"واتساب", billsIncluded:"الفواتير شاملة", billsShared:"الفواتير مشتركة",
  postedBy:"نشره",
  communityEyebrow:"أسئلة وأجوبة المجتمع", communityTitle:"اسأل من سبقك بالتجربة",
  communitySub:"إجابات من زملاء حول السكن والمسائل القانونية والعمل والحياة اليومية.",
  communityAskBtn:"اطرح سؤالاً",
  askFormTitle:"سؤال جديد", askFormHint:"هذا نموذج تجريبي — تظهر الأسئلة أدناه ولا يتم حفظها.",
  lblCategory:"التصنيف", catHousing:"السكن", catLegal:"قانوني", catJobs:"وظائف", catLife:"حياة عامة",
  lblQuestion:"سؤالك", questionPh:"اكتب سؤالك هنا...", askFormSubmit:"نشر السؤال",
  catAll:"الكل", replies:"ردود", viewReplies:"عرض الردود", hideReplies:"إخفاء الردود",
  footNote:"سند منصة مجتمعية. تأكد دائماً من الإجراءات الرسمية عبر البوابات الحكومية مثل قوى وأبشر ومقيم.",
  emergencyTitle:"أرقام الطوارئ", em911:"الطوارئ (الشرطة)", em998:"الدفاع المدني (الإطفاء)", em997:"الإسعاف (الهلال الأحمر)", em19911:"وزارة الموارد البشرية — استفسارات العمل",
  navProfile:"الملف الشخصي", shareLabel:"مشاركة", copyLink:"نسخ الرابط", linkCopied:"تم نسخ الرابط!", shareViaWhatsapp:"مشاركة عبر واتساب", shareThisPage:"شارك هذه الصفحة",
  signInTitle:"تسجيل دخول سريع", signInHint:"فقط اسمك ورقم جوالك — بدون كلمة مرور. هذا يساعدنا على نسب مشاركاتك وتتبع روابطك.",
  lblName:"اسمك", lblPhone:"رقم الجوال", signInSubmit:"متابعة", signedInAs:"مسجل الدخول باسم", signOutBtn:"تسجيل الخروج",
  communityTabQA:"أسئلة وأجوبة", communityTabBuddies:"الرفقاء", becomeBuddyBtn:"كن رفيقاً — ساعد الوافدين الجدد",
  buddyFormTitle:"سجّل كرفيق", buddyFormHint:"سيتمكن الوافدون الجدد من رؤية ملفك الشخصي والتواصل معك عبر واتساب.",
  lblHelpAreas:"بماذا يمكنك المساعدة؟", helpHousing:"إيجاد السكن", helpPaperwork:"الأوراق والإجراءات", helpOrientation:"التوجيه العام",
  lblBio:"نبذة قصيرة", bioPh:"مثال: أعيش في الرياض منذ 3 سنوات، يسعدني المساعدة في إعداد أبشر ونفاذ...",
  buddyFormSubmit:"نشر ملفي كرفيق", noBuddiesYet:"لا يوجد رفقاء بعد — كن الأول!", helpsWith:"يمكنه المساعدة في",
  videoLabel:"فيديو الغرفة (اختياري)", videoHint:"جولة قصيرة بالفيديو تحصل على ردود أكثر بكثير من الصور فقط.", uploadingVideo:"جارٍ رفع الفيديو...",
  profileEyebrow:"حسابك", profileTitleSignedOut:"سجّل الدخول لفتح المزيد", profileSubSignedOut:"النشر والانضمام كرفيق ومشاركة الروابط، كلها تستخدم نفس تسجيل الدخول السريع.",
  myLinksTitle:"روابط المشاركة الخاصة بي", myLinksHint:"أنشئ رابطاً شخصياً لأي قسم — ستشاهد عدد مرات النقر على كل رابط.",
  generateLinkBtn:"احصل على الرابط", clicksLabel:"نقرات",
  filterAnyGender:"أي جنس", filterMaleOnly:"رجال فقط", filterFemaleOnly:"نساء فقط",
  filterAnyRoom:"أي نوع غرفة", filterShared:"غرفة مشتركة", filterPrivate:"غرفة خاصة", filterBed:"سرير فقط",
  filtersLabel:"الفلاتر", filtersReset:"إعادة ضبط", filtersShow:"عرض النتائج",
  lblBudget:"الميزانية", lblNatShort:"الجنسية", lblGenderShort:"الجنس",
  noListingsTitle:"لا توجد غرف مطابقة لهذه الفلاتر", noListingsSub:"جرّب ميزانية أوسع أو أزل فلتراً أو اثنين."
},
ur: {
  brandName:"سند · Sanad", brandTag:"سعودی عرب میں آپ کا سہارا",
  navHome:"ہوم", navGuide:"گائیڈ", navHousing:"رہائش", navCommunity:"کمیونٹی",
  heroTitle:"رہائش، رہنمائی اور کمیونٹی — سب ایک جگہ",
  heroSub:"الجھی ہوئی فیس بک گروپس کو چھوڑیں۔ کمرہ ڈھونڈیں، اپنے حقوق سمجھیں، اور تجربہ کار لوگوں سے سوال کریں۔",
  statCities:"شہر شامل ہیں", statListings:"اس مہینے شیئر ہونے والے کمرے", statLangs:"زبانیں",
  qnGuideTitle:"اپنے حقوق جانیں", qnGuideSub:"لیبر قانون، قویٰ، اقامہ اور بینکنگ — آسان زبان میں",
  qnHousingTitle:"کمرہ تلاش کریں", qnHousingSub:"6 بڑے شہروں میں مشترکہ رہائش",
  qnCommunityTitle:"کمیونٹی سے پوچھیں", qnCommunitySub:"یہاں پہلے سے رہنے والے لوگوں کے حقیقی جوابات — کسی بے ترتیب فیس بک گروپ سے نہیں",
  trustTitle:"اعتماد کے قابل بنایا گیا",
  trustBody:"براؤز کرنے کے لیے لاگ ان کی ضرورت نہیں، کوئی الگورتھم یہ طے نہیں کرتا کہ آپ کیا دیکھیں۔ گائیڈ کا مواد آسان زبان میں لکھا اور درستگی کے لیے جانچا گیا ہے۔",
  guideEyebrow:"نالج گائیڈ ہب", guideTitle:"نظام کو الجھن سے پہلے سمجھیں",
  guideSub:"ہر ورکر کو بالآخر درکار چیزوں کی مختصر، آسان وضاحتیں۔",
  housingEyebrow:"روم میٹ اور مشترکہ رہائش بورڈ", housingTitle:"اپنا اگلا کمرہ تلاش کریں",
  housingSub:"کرایہ داروں اور مالکان کی حقیقی لسٹنگز۔ براہ راست واٹس ایپ پر رابطہ کریں — کوئی بیچ والا نہیں۔",
  housingPostBtn:"کمرہ یا خالی بیڈ کی پوسٹ لگائیں",
  postFormTitle:"لسٹنگ پوسٹ کریں", postFormHint:"یہ ایک ڈیمو فارم ہے — اندراجات نیچے دکھائے جائیں گے مگر محفوظ نہیں ہوں گے۔",
  lblCity:"شہر", lblRent:"ماہانہ کرایہ (SAR)", lblRoomType:"کمرے کی قسم",
  rtShared:"مشترکہ کمرہ", rtPrivate:"نجی کمرہ", rtBed:"صرف بیڈ",
  lblGender:"صنفی ترجیح", genAny:"کوئی بھی", genMale:"صرف مرد", genFemale:"صرف خواتین",
  lblNationality:"قومیت / زبان کی ترجیح", natAny:"کوئی بھی", natArab:"عرب",
  lblBills:"بجلی اور پانی شامل", lblDesc:"تفصیل", descPh:"مثلاً: میٹرو کے قریب، پرسکون فلیٹ، پہلے سے 3 ساتھی...",
  lblWhatsapp:"واٹس ایپ نمبر", postFormSubmit:"لسٹنگ شائع کریں",
  filterAllCities:"تمام شہر", filterAnyBudget:"کوئی بھی بجٹ", filterUnder500:"500 SAR سے کم", filterUnder800:"800 SAR سے کم", filterUnder1200:"1,200 SAR سے کم",
  filterAnyNat:"کوئی بھی قومیت ترجیح",
  perMonth:"/ ماہانہ", contactWA:"واٹس ایپ", billsIncluded:"بلز شامل ہیں", billsShared:"بلز مشترکہ",
  postedBy:"پوسٹ کردہ",
  communityEyebrow:"کمیونٹی سوال و جواب", communityTitle:"تجربہ کار لوگوں سے پوچھیں",
  communitySub:"رہائش، قانونی سوالات، ملازمت اور روزمرہ زندگی سے متعلق ساتھیوں کے جوابات۔",
  communityAskBtn:"سوال پوچھیں",
  askFormTitle:"نیا سوال", askFormHint:"یہ ایک ڈیمو فارم ہے — سوالات نیچے دکھائے جائیں گے مگر محفوظ نہیں ہوں گے۔",
  lblCategory:"زمرہ", catHousing:"رہائش", catLegal:"قانونی", catJobs:"ملازمتیں", catLife:"عمومی زندگی",
  lblQuestion:"آپ کا سوال", questionPh:"اپنا سوال یہاں لکھیں...", askFormSubmit:"سوال پوسٹ کریں",
  catAll:"تمام", replies:"جوابات", viewReplies:"جوابات دیکھیں", hideReplies:"جوابات چھپائیں",
  footNote:"سند ایک کمیونٹی پلیٹ فارم ہے۔ ہمیشہ سرکاری طریقہ کار کی تصدیق قویٰ، ابشر اور مقیم جیسے سرکاری پورٹلز سے کریں۔",
  emergencyTitle:"ہنگامی نمبرز", em911:"ایمرجنسی (پولیس)", em998:"سول ڈیفنس (فائر)", em997:"ایمبولینس (ریڈ کریسنٹ)", em19911:"وزارت انسانی وسائل — لیبر انکوائریز",
  navProfile:"پروفائل", shareLabel:"شیئر", copyLink:"لنک کاپی کریں", linkCopied:"لنک کاپی ہو گیا!", shareViaWhatsapp:"واٹس ایپ پر شیئر کریں", shareThisPage:"یہ صفحہ شیئر کریں",
  signInTitle:"فوری سائن ان", signInHint:"صرف آپ کا نام اور فون نمبر — پاس ورڈ کی ضرورت نہیں۔ یہ ہمیں آپ کی پوسٹس کا سہرا دینے اور آپ کے شیئر کردہ لنکس ٹریک کرنے میں مدد دیتا ہے۔",
  lblName:"آپ کا نام", lblPhone:"فون نمبر", signInSubmit:"جاری رکھیں", signedInAs:"بطور سائن ان", signOutBtn:"سائن آؤٹ",
  communityTabQA:"سوال و جواب", communityTabBuddies:"ساتھی", becomeBuddyBtn:"ساتھی بنیں — نئے آنے والوں کی مدد کریں",
  buddyFormTitle:"بطور ساتھی سائن اپ کریں", buddyFormHint:"نئے آنے والے آپ کی پروفائل دیکھ سکیں گے اور واٹس ایپ پر آپ سے رابطہ کر سکیں گے۔",
  lblHelpAreas:"آپ کس چیز میں مدد کر سکتے ہیں؟", helpHousing:"رہائش تلاش کرنا", helpPaperwork:"کاغذی کارروائی اور طریقہ کار", helpOrientation:"عمومی رہنمائی",
  lblBio:"مختصر تعارف", bioPh:"مثلاً: 3 سال سے ریاض میں مقیم ہوں، ابشر/نفاذ سیٹ اپ میں مدد کے لیے تیار ہوں...",
  buddyFormSubmit:"میری ساتھی پروفائل شائع کریں", noBuddiesYet:"ابھی تک کوئی ساتھی نہیں — پہلے آپ بنیں!", helpsWith:"مدد کر سکتا ہے",
  videoLabel:"کمرے کی ویڈیو (اختیاری)", videoHint:"ایک مختصر ویڈیو صرف تصاویر کے مقابلے میں کہیں زیادہ جوابات لاتی ہے۔", uploadingVideo:"ویڈیو اپ لوڈ ہو رہی ہے...",
  profileEyebrow:"آپ کا اکاؤنٹ", profileTitleSignedOut:"مزید کے لیے سائن ان کریں", profileSubSignedOut:"پوسٹ کرنا، ساتھی بننا، اور لنکس شیئر کرنا سب ایک ہی فوری سائن ان استعمال کرتے ہیں۔",
  myLinksTitle:"میرے شیئر لنکس", myLinksHint:"کسی بھی سیکشن کے لیے ذاتی لنک بنائیں — آپ دیکھ سکیں گے کہ ہر لنک پر کتنی بار کلک ہوا۔",
  generateLinkBtn:"لنک حاصل کریں", clicksLabel:"کلکس",
  filterAnyGender:"کوئی بھی صنف", filterMaleOnly:"صرف مرد", filterFemaleOnly:"صرف خواتین",
  filterAnyRoom:"کوئی بھی کمرہ", filterShared:"مشترکہ کمرہ", filterPrivate:"نجی کمرہ", filterBed:"صرف بیڈ",
  filtersLabel:"فلٹرز", filtersReset:"ری سیٹ", filtersShow:"نتائج دیکھیں",
  lblBudget:"بجٹ", lblNatShort:"قومیت", lblGenderShort:"صنف",
  noListingsTitle:"ان فلٹرز سے کوئی کمرہ نہیں ملا", noListingsSub:"بجٹ بڑھائیں یا ایک دو فلٹر ہٹا دیں۔"
}
};

/* ============================= Guide content ============================= */
const guideIcons = {
  labor:'<path d="M4 7h16M4 12h16M4 17h10"/>',
  qiwa:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  bank:'<rect x="3" y="10" width="18" height="9" rx="1"/><path d="M3 10l9-6 9 6"/><path d="M7 14v3M12 14v3M17 14v3"/>',
  iqama:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h5M13 14h5"/>',
  health:'<path d="M12 21s-7-4.5-9.5-9C0.8 8.3 2.6 4 7 4c2.2 0 3.9 1.3 5 3 1.1-1.7 2.8-3 5-3 4.4 0 6.2 4.3 4.5 8-2.5 4.5-9.5 9-9.5 9z"/>',
  emergency:'<path d="M12 2l9 4.5v6c0 5-3.8 8-9 9.5-5.2-1.5-9-4.5-9-9.5v-6L12 2z"/><path d="M12 8v5M12 16h.01"/>',
  travel:'<path d="M2 16l20-8-8 20-2-8-8-2 -2-2z" />'
};

const guideData = {
en: [
 {k:"labor", title:"Labor Law & Contracts", sub:"Know what your contract must include", body:`<ul>
   <li>Your work contract must state job title, salary, working hours, and contract duration — get a copy in a language you understand.</li>
   <li>Standard working hours are 8 hours/day or 48 hours/week, reduced during Ramadan for Muslim workers.</li>
   <li>Employers cannot legally withhold your passport in most sectors — ask about your rights if this happens.</li>
   <li>End-of-service benefits (gratuity) are calculated based on years of service — keep your own record of your start date and salary changes.</li>
 </ul>`},
 {k:"qiwa", title:"The Qiwa Platform", sub:"Saudi Arabia's labor services portal", body:`<ul>
   <li>Qiwa is the official platform for managing work contracts, transfers, and labor complaints — accessible via app or web.</li>
   <li>You can view and confirm your own contract details on Qiwa once your employer registers it.</li>
   <li>Job/employer transfer requests, and reporting an unpaid salary, can both be started through Qiwa.</li>
   <li>Always check Qiwa directly rather than trusting a broker's word about your contract status.</li>
 </ul>`},
 {k:"bank", title:"Banking & Money Transfer", sub:"Opening accounts, Absher & Nafath basics", body:`<ul>
   <li>Most banks require a valid Iqama to open an account; some offer accounts for new arrivals with limited features.</li>
   <li><strong>Absher</strong> is the government's main citizen/resident e-services platform — link your Iqama and phone number to access government services online.</li>
   <li><strong>Nafath</strong> is the national digital identity app used to verify your identity for banking, government, and many private services — install it and complete verification early, as many services now require it.</li>
   <li>Use licensed money transfer operators or your bank's app for remittances — avoid informal transfer agents.</li>
 </ul>`},
 {k:"iqama", title:"Iqama & Government Services", sub:"Your residency permit, explained", body:`<ul>
   <li>The Iqama is your residency ID — carry it at all times, it's required for almost everything from SIM cards to renting.</li>
   <li>Your employer is generally responsible for renewing your Iqama on time — follow up before it expires to avoid fines.</li>
   <li>Muqeem is the online portal for checking your Iqama status, exit/re-entry visas, and dependents' records.</li>
   <li>An expired Iqama can affect your ability to travel, open accounts, or renew a driving license.</li>
 </ul>`},
 {k:"health", title:"Healthcare", sub:"Insurance and where to get treatment", body:`<ul>
   <li>Private-sector employers are generally required to provide medical insurance — ask HR for your insurance card and network hospital list.</li>
   <li>Government hospitals may have separate procedures for non-citizens; private clinics and insurance-network hospitals are usually more accessible.</li>
   <li>Keep a digital copy of your insurance card and policy number saved on your phone.</li>
 </ul>`},
 {k:"emergency", title:"Emergency Contacts", sub:"Save these numbers now", body:`<div class="emergency-grid">
   <div class="em-item"><div class="num">911</div><div class="lbl" data-i18n="em911">Emergency (Police)</div></div>
   <div class="em-item"><div class="num">998</div><div class="lbl" data-i18n="em998">Civil Defense (Fire)</div></div>
   <div class="em-item"><div class="num">997</div><div class="lbl" data-i18n="em997">Ambulance (Red Crescent)</div></div>
   <div class="em-item"><div class="num">19911</div><div class="lbl" data-i18n="em19911">Ministry of HR — Labor Inquiries</div></div>
 </div>`},
 {k:"travel", title:"Before You Travel Checklist", sub:"For those preparing to move", body:`<ul>
   <li>Verify your job offer and contract terms directly through Qiwa before traveling, if possible.</li>
   <li>Confirm who is paying for your visa, flight, and initial accommodation in writing.</li>
   <li>Save your recruitment agency's license number and your employer's official company name.</li>
   <li>Bring digital and physical copies of your passport, contract, and medical clearance certificate.</li>
 </ul>`}
],
ar: [
 {k:"labor", title:"نظام العمل والعقود", sub:"تعرّف على ما يجب أن يتضمنه عقدك", body:`<ul>
   <li>يجب أن يحدد عقد عملك المسمى الوظيفي والراتب وساعات العمل ومدة العقد — احصل على نسخة بلغة تفهمها.</li>
   <li>ساعات العمل النظامية ٨ ساعات يومياً أو ٤٨ ساعة أسبوعياً، وتُخفَّض في رمضان للعمال المسلمين.</li>
   <li>لا يحق لصاحب العمل الاحتفاظ بجواز سفرك في معظم القطاعات — اسأل عن حقوقك إن حدث ذلك.</li>
   <li>مكافأة نهاية الخدمة تُحسب حسب سنوات الخدمة — احتفظ بسجل خاص بتاريخ بدء عملك وتغييرات راتبك.</li>
 </ul>`},
 {k:"qiwa", title:"منصة قوى", sub:"البوابة الرسمية لخدمات العمل في السعودية", body:`<ul>
   <li>قوى هي المنصة الرسمية لإدارة عقود العمل والنقل والشكاوى العمالية — متاحة عبر التطبيق أو الموقع.</li>
   <li>يمكنك عرض وتأكيد تفاصيل عقدك بمجرد تسجيل صاحب العمل له في قوى.</li>
   <li>يمكن بدء طلبات نقل الكفالة والإبلاغ عن تأخر الراتب عبر قوى.</li>
   <li>تحقق دائماً من قوى مباشرة بدلاً من الاعتماد على كلام الوسيط بشأن حالة عقدك.</li>
 </ul>`},
 {k:"bank", title:"البنوك وتحويل الأموال", sub:"فتح الحسابات وأساسيات أبشر ونفاذ", body:`<ul>
   <li>تتطلب معظم البنوك إقامة سارية لفتح حساب؛ بعضها يوفر حسابات للوافدين الجدد بميزات محدودة.</li>
   <li><strong>أبشر</strong> هي المنصة الحكومية الرئيسية للخدمات الإلكترونية — اربط إقامتك ورقم جوالك للوصول إلى الخدمات الحكومية.</li>
   <li><strong>نفاذ</strong> هو تطبيق الهوية الرقمية الوطنية المستخدم للتحقق من هويتك في البنوك والخدمات الحكومية والخاصة — فعّله مبكراً فكثير من الخدمات باتت تتطلبه.</li>
   <li>استخدم شركات تحويل أموال مرخصة أو تطبيق بنكك للحوالات — تجنب وسطاء التحويل غير الرسميين.</li>
 </ul>`},
 {k:"iqama", title:"الإقامة والخدمات الحكومية", sub:"تصريح إقامتك بشرح مبسّط", body:`<ul>
   <li>الإقامة هي بطاقة هويتك للسكن — احملها دائماً، فهي مطلوبة لكل شيء تقريباً من شرائح الجوال إلى استئجار السكن.</li>
   <li>صاحب العمل مسؤول عادةً عن تجديد إقامتك في وقتها — تابع الأمر قبل انتهائها لتجنب الغرامات.</li>
   <li>مقيم هي البوابة الإلكترونية لمتابعة حالة إقامتك وتأشيرات الخروج والعودة وسجلات التابعين.</li>
   <li>انتهاء صلاحية الإقامة قد يؤثر على قدرتك على السفر أو فتح حساب بنكي أو تجديد رخصة القيادة.</li>
 </ul>`},
 {k:"health", title:"الرعاية الصحية", sub:"التأمين وأين تحصل على العلاج", body:`<ul>
   <li>عادة ما يُلزَم أصحاب العمل في القطاع الخاص بتوفير تأمين طبي — اطلب بطاقة التأمين وقائمة المستشفيات من الموارد البشرية.</li>
   <li>قد تختلف إجراءات المستشفيات الحكومية لغير المواطنين؛ العيادات الخاصة ومستشفيات شبكة التأمين عادة أسهل وصولاً.</li>
   <li>احتفظ بنسخة رقمية من بطاقة تأمينك ورقم الوثيقة على هاتفك.</li>
 </ul>`},
 {k:"emergency", title:"أرقام الطوارئ", sub:"احفظ هذه الأرقام الآن", body:`<div class="emergency-grid">
   <div class="em-item"><div class="num">911</div><div class="lbl">الطوارئ (الشرطة)</div></div>
   <div class="em-item"><div class="num">998</div><div class="lbl">الدفاع المدني (الإطفاء)</div></div>
   <div class="em-item"><div class="num">997</div><div class="lbl">الإسعاف (الهلال الأحمر)</div></div>
   <div class="em-item"><div class="num">19911</div><div class="lbl">وزارة الموارد البشرية — استفسارات العمل</div></div>
 </div>`},
 {k:"travel", title:"قائمة ما قبل السفر", sub:"لمن يستعد للانتقال", body:`<ul>
   <li>تحقق من عرض العمل وشروط العقد مباشرة عبر قوى قبل السفر إن أمكن.</li>
   <li>احصل على تأكيد كتابي بمن يدفع تكاليف التأشيرة والطيران والسكن الأولي.</li>
   <li>احتفظ برقم ترخيص مكتب الاستقدام والاسم الرسمي لشركة صاحب العمل.</li>
   <li>أحضر نسخاً رقمية وورقية من جواز سفرك وعقدك وشهادة الفحص الطبي.</li>
 </ul>`}
],
ur: [
 {k:"labor", title:"لیبر قانون اور معاہدے", sub:"جانیں کہ آپ کے معاہدے میں کیا شامل ہونا چاہیے", body:`<ul>
   <li>آپ کے ورک کنٹریکٹ میں جاب ٹائٹل، تنخواہ، اوقات کار اور مدت درج ہونی چاہیے — ایسی زبان میں کاپی لیں جو آپ سمجھتے ہوں۔</li>
   <li>معیاری اوقات کار 8 گھنٹے یومیہ یا 48 گھنٹے ہفتہ وار ہیں، رمضان میں مسلمان ورکرز کے لیے کم کیے جاتے ہیں۔</li>
   <li>زیادہ تر شعبوں میں آجر قانونی طور پر آپ کا پاسپورٹ نہیں رکھ سکتا — اگر ایسا ہو تو اپنے حقوق کے بارے میں پوچھیں۔</li>
   <li>سروس کے اختتام پر فوائد (گریجویٹی) سالوں کی خدمت کی بنیاد پر ہوتے ہیں — اپنی شروعاتی تاریخ اور تنخواہ کی تبدیلیوں کا ریکارڈ رکھیں۔</li>
 </ul>`},
 {k:"qiwa", title:"قویٰ پلیٹ فارم", sub:"سعودی عرب کا لیبر سروسز پورٹل", body:`<ul>
   <li>قویٰ ورک کنٹریکٹس، ٹرانسفرز اور لیبر شکایات کے انتظام کا سرکاری پلیٹ فارم ہے — ایپ یا ویب کے ذریعے قابل رسائی۔</li>
   <li>آجر کے رجسٹر کرنے کے بعد آپ اپنے معاہدے کی تفصیلات قویٰ پر دیکھ اور تصدیق کر سکتے ہیں۔</li>
   <li>ملازمت کی منتقلی کی درخواستیں، اور غیر ادا شدہ تنخواہ کی رپورٹنگ، دونوں قویٰ کے ذریعے شروع کی جا سکتی ہیں۔</li>
   <li>اپنے معاہدے کی صورتحال کے بارے میں ایجنٹ کی بات پر بھروسہ کرنے کے بجائے ہمیشہ قویٰ پر خود چیک کریں۔</li>
 </ul>`},
 {k:"bank", title:"بینکنگ اور رقم کی ترسیل", sub:"اکاؤنٹ کھولنا، ابشر اور نفاذ کے بنیادی اصول", body:`<ul>
   <li>زیادہ تر بینکوں کو اکاؤنٹ کھولنے کے لیے درست اقامہ درکار ہوتا ہے؛ کچھ نئے آنے والوں کے لیے محدود سہولیات والے اکاؤنٹس فراہم کرتے ہیں۔</li>
   <li><strong>ابشر</strong> حکومت کا اہم ای-سروسز پلیٹ فارم ہے — اپنا اقامہ اور فون نمبر منسلک کریں تاکہ حکومتی خدمات آن لائن حاصل کر سکیں۔</li>
   <li><strong>نفاذ</strong> قومی ڈیجیٹل شناختی ایپ ہے جو بینکنگ، حکومتی اور کئی نجی خدمات کے لیے شناخت کی تصدیق کرتی ہے — جلد انسٹال اور تصدیق مکمل کریں کیونکہ اب کئی خدمات کو اس کی ضرورت ہوتی ہے۔</li>
   <li>ترسیلات کے لیے لائسنس یافتہ منی ٹرانسفر آپریٹرز یا اپنے بینک کی ایپ استعمال کریں — غیر رسمی ایجنٹس سے گریز کریں۔</li>
 </ul>`},
 {k:"iqama", title:"اقامہ اور سرکاری خدمات", sub:"آپ کا رہائشی اجازت نامہ، سمجھایا گیا", body:`<ul>
   <li>اقامہ آپ کا رہائشی شناختی کارڈ ہے — ہمیشہ ساتھ رکھیں، سم کارڈ سے لے کر کرایہ تک تقریباً ہر چیز کے لیے درکار ہے۔</li>
   <li>عام طور پر آپ کے آجر کی ذمہ داری ہے کہ وہ وقت پر آپ کا اقامہ تجدید کرے — ختم ہونے سے پہلے پیروی کریں تاکہ جرمانوں سے بچا جا سکے۔</li>
   <li>مقیم آن لائن پورٹل ہے جہاں آپ اقامہ کی صورتحال، خروج/ری اینٹری ویزے اور زیر کفالت افراد کے ریکارڈز چیک کر سکتے ہیں۔</li>
   <li>ختم شدہ اقامہ سفر، اکاؤنٹ کھولنے یا ڈرائیونگ لائسنس کی تجدید پر اثر ڈال سکتا ہے۔</li>
 </ul>`},
 {k:"health", title:"صحت کی دیکھ بھال", sub:"انشورنس اور علاج کہاں سے کروائیں", body:`<ul>
   <li>نجی شعبے کے آجروں کے لیے عام طور پر میڈیکل انشورنس فراہم کرنا لازمی ہے — اپنا انشورنس کارڈ اور نیٹ ورک ہسپتالوں کی فہرست HR سے مانگیں۔</li>
   <li>سرکاری ہسپتالوں کا غیر شہریوں کے لیے الگ طریقہ کار ہو سکتا ہے؛ نجی کلینکس اور انشورنس نیٹ ورک ہسپتال عام طور پر زیادہ قابل رسائی ہوتے ہیں۔</li>
   <li>اپنے فون میں انشورنس کارڈ اور پالیسی نمبر کی ڈیجیٹل کاپی محفوظ رکھیں۔</li>
 </ul>`},
 {k:"emergency", title:"ہنگامی نمبرز", sub:"یہ نمبرز ابھی محفوظ کریں", body:`<div class="emergency-grid">
   <div class="em-item"><div class="num">911</div><div class="lbl">ایمرجنسی (پولیس)</div></div>
   <div class="em-item"><div class="num">998</div><div class="lbl">سول ڈیفنس (فائر)</div></div>
   <div class="em-item"><div class="num">997</div><div class="lbl">ایمبولینس (ریڈ کریسنٹ)</div></div>
   <div class="em-item"><div class="num">19911</div><div class="lbl">وزارت انسانی وسائل — لیبر انکوائریز</div></div>
 </div>`},
 {k:"travel", title:"سفر سے پہلے کی چیک لسٹ", sub:"منتقلی کی تیاری کرنے والوں کے لیے", body:`<ul>
   <li>ممکن ہو تو سفر سے پہلے اپنی جاب آفر اور معاہدے کی شرائط قویٰ کے ذریعے براہ راست تصدیق کریں۔</li>
   <li>تحریری طور پر تصدیق کریں کہ ویزا، فلائٹ اور ابتدائی رہائش کی ادائیگی کون کرے گا۔</li>
   <li>اپنی ریکروٹمنٹ ایجنسی کا لائسنس نمبر اور آجر کا سرکاری کمپنی نام محفوظ رکھیں۔</li>
   <li>پاسپورٹ، معاہدے اور میڈیکل کلیئرنس سرٹیفکیٹ کی ڈیجیٹل اور فزیکل کاپیاں ساتھ لائیں۔</li>
 </ul>`}
]
};

/* ============================= Housing listings ============================= */
/* Placeholder data shown briefly while the real rows load from Supabase (see fetchAndRenderListings). */
let listings = [
 {city:"Riyadh", rent:550, type:"shared", gender:"male", nat:"Any", bills:true,
  desc:"3-bedroom flat near Olaya, 15 min walk to metro. 2 flatmates already, both Pakistani. Kitchen shared, AC in every room.",
  by:"Owner", wa:"966501234567"},
 {city:"Jeddah", rent:700, type:"private", gender:"any", nat:"Filipino", bills:false,
  desc:"Private room in Al Rawdah, close to Corniche. Bills split evenly between 4 tenants. Prefer Filipino or Southeast Asian tenant.",
  by:"Tenant", wa:"966502345678"},
 {city:"Dammam/Khobar", rent:450, type:"bed", gender:"male", nat:"Indian", bills:true,
  desc:"Bed space in shared labor accommodation near Khobar Corniche, 6 beds total, cleaning rota in place, water and electricity included.",
  by:"Tenant", wa:"966503456789"},
 {city:"Makkah", rent:900, type:"private", gender:"female", nat:"Arab", bills:true,
  desc:"Furnished private room for a working woman, close to Haram bus route. Quiet building, Arabic-speaking flatmates preferred.",
  by:"Owner", wa:"966504567890"},
 {city:"Madinah", rent:600, type:"shared", gender:"any", nat:"Any", bills:false,
  desc:"Shared room available near King Fahd road, 2 people currently, open to any nationality. Bills split monthly by usage.",
  by:"Tenant", wa:"966505678901"},
 {city:"Hail", rent:400, type:"bed", gender:"male", nat:"Bangladeshi", bills:true,
  desc:"Simple bed space, factory workers' housing block, walking distance to industrial area. All utilities included in rent.",
  by:"Owner", wa:"966506789012"},
 {city:"Riyadh", rent:1100, type:"private", gender:"any", nat:"Any", bills:true,
  desc:"Modern private room in a new building near King Fahd Road, gym access included, professional flatmates, all bills covered.",
  by:"Owner", wa:"966507890123"},
 {city:"Jeddah", rent:520, type:"shared", gender:"male", nat:"Indian", bills:true,
  desc:"Shared room close to Al Balad, 3 Indian flatmates, walking distance to bus stop, water and electricity included in rent.",
  by:"Tenant", wa:"966508901234"}
];

/* ============================= Forum data ============================= */
/* Placeholder data shown briefly while the real rows load from Supabase (see fetchAndRenderForum). */
let forumPosts = [
 {cat:"Housing", q:"Can I share an Iqama address with roommates who aren't my family?", by:"New in Riyadh", votes:14,
  replies:["Yes, many shared flats register the lease under one tenant's name — just make sure your municipal address on Absher matches where you actually live.",
   "We did this for 2 years in Jeddah, no issues, just keep a copy of the rent agreement in case anyone asks."]},
 {cat:"Legal", q:"My employer is delaying my Iqama renewal — what should I do?", by:"Worried_Worker", votes:22,
  replies:["Check your Iqama status directly on Muqeem first. If it's genuinely overdue, you can raise it through Qiwa's labor complaint feature."]},
 {cat:"Jobs", q:"Is it normal for a new employer to ask for a fee to process my transfer?", by:"Fahad_K", votes:31,
  replies:["No — transfer of sponsorship fees paid by the worker are not standard practice. Verify everything through Qiwa directly rather than a middleman.",
   "Be cautious, this is a common scam pattern. Ask your new employer to handle it officially."]},
 {cat:"General life", q:"Best way to send money home without high fees?", by:"RemitteeRiyadh", votes:18,
  replies:["Compare rates between your bank's app and licensed remittance companies — rates change weekly, so check both before sending."]},
 {cat:"Housing", q:"Any tips for finding female-only shared housing in Makkah?", by:"Amina_S", votes:9,
  replies:["Ask around at your workplace first — most listings for women-only flats circulate by word of mouth before they're posted anywhere."]},
 {cat:"Legal", q:"Do I need Nafath to open a bank account or just Absher?", by:"NewArrival22", votes:12,
  replies:["You'll likely need both — Absher registration first, then Nafath for identity verification at the bank or in their app."]},
 {cat:"Jobs", q:"How long does a standard Qiwa contract transfer usually take?", by:"Sana_T", votes:7,
  replies:["It varies, but once both employers confirm on Qiwa it's often processed within a couple of weeks. Follow up directly on the platform."]},
 {cat:"General life", q:"Which is cheaper for a first month — hotel or shared bed space?", by:"JustLanded", votes:15,
  replies:["Bed space, by far, if you can find one through a trusted contact — hotels add up fast in the first two weeks."]}
];

/* ============================= Buddies ============================= */
/* Placeholder data shown briefly while the real rows load from Supabase (see fetchAndRenderBuddies). */
let buddies = [
 {name:"Waseem A.", help:["Housing","Paperwork"], bio:"3 years in Riyadh, happy to help with Absher/Nafath setup and finding shared housing near Olaya.", wa:"966509012345"},
 {name:"Grace M.", help:["Orientation","Housing"], bio:"Been in Jeddah for 2 years, know the ropes around Al Balad and Corniche housing options.", wa:"966509123456"}
];

/* ============================= State & render ============================= */
let state = { lang:'en', tab:'home', guideOpen:{}, filters:{city:'all', budget:'all', nat:'all', gender:'all', roomType:'all'}, forumCat:'All', openReplies:{}, communitySubTab:'qa' };
let appUser = null; // { id, name, phone } once signed in — in-memory only, resets on reload
let myShareLinks = []; // [{id, page, code, clicks}]
let pendingSignInAction = null; // callback to run right after a successful sign-in

function t(key){ return translations[state.lang][key] ?? key; }

function applyI18n(){
  document.documentElement.lang = state.lang;
  document.documentElement.dir = (state.lang==='ar'||state.lang==='ur') ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('data-lang', state.lang);
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(translations[state.lang][k] !== undefined) el.innerHTML = translations[state.lang][k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const k = el.getAttribute('data-i18n-ph');
    if(translations[state.lang][k] !== undefined) el.setAttribute('placeholder', translations[state.lang][k]);
  });
  document.querySelectorAll('[data-lang-btn]').forEach(b=>{
    b.classList.toggle('active', b.getAttribute('data-lang-btn')===state.lang);
  });
  document.title = state.lang==='en' ? "Sanad · سند — Your support system in Saudi Arabia" : translations[state.lang].brandName + " — " + translations[state.lang].brandTag;
}

function setTab(tab){
  state.tab = tab;
  document.querySelectorAll('section.view').forEach(s=>s.classList.remove('active'));
  document.getElementById('view-'+tab).classList.add('active');
  document.querySelectorAll('nav.tabbar button').forEach(b=>b.classList.toggle('active', b.getAttribute('data-tab')===tab));
  window.scrollTo({top:0, behavior:'instant'});
  applyFeedMode();
  closeFilters();
  setPostFormOpen(false);
}

/* On mobile the housing tab is a full-bleed feed: no header, no page scroll.
   Everything else is CSS — this only flips the flag. */
function applyFeedMode(){
  const feedMode = state.tab === 'housing' && window.innerWidth < 760;
  document.body.classList.toggle('feed-mode', feedMode);
}
window.addEventListener('resize', ()=>{ applyFeedMode(); if(window.innerWidth >= 760) closeFilters(); });

/* ---- Guide render ---- */
function renderGuide(){
  const grid = document.getElementById('guideGrid');
  const data = guideData[state.lang];
  grid.innerHTML = data.map((g,i)=>`
    <div class="guide-card ${state.guideOpen[g.k]?'open':''}" data-guide="${g.k}">
      <button class="guide-head" data-guide-toggle="${g.k}">
        <div class="ic">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+guideIcons[g.k]+'</svg>'}</div>
        <div class="tt"><h3>${g.title}</h3><span>${g.sub}</span></div>
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="guide-body"><div class="guide-body-inner">${g.body}</div></div>
    </div>
  `).join('');
  grid.querySelectorAll('[data-guide-toggle]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const k = btn.getAttribute('data-guide-toggle');
      state.guideOpen[k] = !state.guideOpen[k];
      btn.closest('.guide-card').classList.toggle('open', state.guideOpen[k]);
    });
  });
}

/* ---- Housing render ---- */
function populateFilterOptions(){
  const cities = ["Riyadh","Jeddah","Dammam/Khobar","Makkah","Madinah","Hail"];
  const cityLabels = {en:cities, ar:["الرياض","جدة","الدمام/الخبر","مكة","المدينة","حائل"], ur:["ریاض","جدہ","دمام/خبر","مکہ","مدینہ","حائل"]};
  const fc = document.getElementById('filterCity');
  fc.querySelectorAll('option:not(:first-child)').forEach(o=>o.remove());
  cities.forEach((c,i)=>{
    const opt = document.createElement('option');
    opt.value=c; opt.textContent = cityLabels[state.lang][i];
    fc.appendChild(opt);
  });
  const nats = ["Any","Indian","Pakistani","Filipino","Arab","Bangladeshi"];
  const natLabels = {
    en:["Any nationality pref.","Indian","Pakistani","Filipino","Arab","Bangladeshi"],
    ar:["أي جنسية","هندي","باكستاني","فلبيني","عربي","بنغلاديشي"],
    ur:["کوئی بھی قومیت","بھارتی","پاکستانی","فلپائنی","عرب","بنگلہ دیشی"]
  };
  const fn = document.getElementById('filterNat');
  fn.innerHTML = '';
  nats.forEach((n,i)=>{
    const opt = document.createElement('option');
    opt.value = n==='Any' ? 'all' : n;
    opt.textContent = natLabels[state.lang][i];
    fn.appendChild(opt);
  });
  fc.value = state.filters.city; fn.value = state.filters.nat;
  const fgSel = document.getElementById('filterGender');
  if(fgSel) fgSel.value = state.filters.gender;
  const frtSel = document.getElementById('filterRoomType');
  if(frtSel) frtSel.value = state.filters.roomType;

  // room type / gender / nationality select translations inside the post form
  const rtSel = document.getElementById('f-roomtype');
  [...rtSel.options].forEach(o=>{ const k=o.getAttribute('data-i18n'); if(k) o.textContent = t(k); });
  const genSel = document.getElementById('f-gender');
  [...genSel.options].forEach(o=>{ const k=o.getAttribute('data-i18n'); if(k) o.textContent = t(k); });
  const natSel = document.getElementById('f-nat');
  [...natSel.options].forEach(o=>{ const k=o.getAttribute('data-i18n'); if(k) o.textContent = t(k); });
  const catSel = document.getElementById('q-cat');
  [...catSel.options].forEach(o=>{ const k=o.getAttribute('data-i18n'); if(k) o.textContent = t(k); });
}

async function fetchAndRenderListings(){
  if (!SUPABASE_CONFIGURED) { renderListings(); return; }
  try {
    const { data, error } = await supabaseClient
      .from('housing_listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading listings:', error);
      renderListings();
      return;
    }

    listings = data.map(l => ({
      city: l.city,
      rent: l.rent,
      type: l.room_type,
      gender: l.gender_pref,
      nat: l.nationality_pref,
      bills: l.bills_included,
      desc: l.description,
      by: l.poster_role,
      wa: l.whatsapp,
      video: l.video_url
    }));

    renderListings();
  } catch (err) {
    console.error('Could not reach Supabase for listings, showing local data instead:', err);
    renderListings();
  }
}

const waIconSvg = '<svg viewBox="0 0 32 32"><path d="M16.001 3C9.096 3 3.5 8.596 3.5 15.5c0 2.34.63 4.53 1.73 6.42L3 29l7.27-2.19a12.4 12.4 0 005.73 1.4c6.905 0 12.5-5.596 12.5-12.5S22.906 3 16.001 3zm7.28 17.7c-.31.87-1.53 1.6-2.51 1.81-.67.14-1.55.25-4.5-.97-3.78-1.57-6.22-5.4-6.4-5.65-.19-.25-1.53-2.04-1.53-3.89 0-1.85.97-2.76 1.31-3.14.34-.38.74-.47.98-.47.25 0 .49 0 .7.01.23.01.53-.09.83.63.31.74 1.06 2.56 1.15 2.74.09.19.15.4.03.65-.13.25-.19.4-.38.62-.19.22-.4.49-.57.66-.19.19-.39.4-.17.78.22.38.98 1.62 2.11 2.62 1.45 1.29 2.67 1.7 3.05 1.89.38.19.6.16.82-.1.22-.25.94-1.1 1.19-1.48.25-.38.5-.31.84-.19.34.13 2.16 1.02 2.53 1.2.37.19.62.28.71.44.09.15.09.85-.22 1.72z"/></svg>';

const shareIconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4"/></svg>';
const houseIconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10l9-7 9 7"/><path d="M5 9v11h14V9"/></svg>';

function filterListings(){
  const f = state.filters;
  return listings.filter(l=>{
    if(f.city!=='all' && l.city!==f.city) return false;
    if(f.budget!=='all' && l.rent > parseInt(f.budget)) return false;
    if(f.nat!=='all' && l.nat!==f.nat) return false;
    if(f.gender!=='all' && l.gender!==f.gender) return false;
    if(f.roomType!=='all' && l.type!==f.roomType) return false;
    return true;
  });
}

/* Keeps the filter FAB badge and the sheet's "Show results" count honest. */
function updateFilterUI(){
  const active = Object.values(state.filters).filter(v=>v!=='all').length;
  const badge = document.getElementById('filterBadge');
  if(badge){ badge.textContent = active; badge.classList.toggle('on', active>0); }
  const count = document.getElementById('filterCount');
  if(count) count.textContent = '(' + filterListings().length + ')';
}

function renderListings(){
  const wrap = document.getElementById('listingsGrid');
  const genderLabelKey = {any:'genAny', male:'genMale', female:'genFemale'};
  const roomTypeLabelKey = {shared:'rtShared', private:'rtPrivate', bed:'rtBed'};
  const filtered = filterListings();
  updateFilterUI();
  if(filtered.length===0){
    wrap.innerHTML = `
      <div class="feed-card feed-card--empty">
        <div class="feed-placeholder">${houseIconSvg}</div>
        <div class="feed-empty">
          <strong>${t('noListingsTitle')}</strong>
          <p>${t('noListingsSub')}</p>
          <button id="btnEmptyReset">${t('filtersReset')}</button>
        </div>
      </div>`;
    wrap.querySelector('#btnEmptyReset').addEventListener('click', resetFilters);
    return;
  }
  wrap.innerHTML = filtered.map((l,i)=>`
    <div class="feed-card" data-idx="${i}">
      ${l.video ? `<video class="feed-media" src="${l.video}" muted loop playsinline></video>` : `<div class="feed-placeholder">${houseIconSvg}</div>`}
      <div class="feed-scrim"></div>
      ${l.video ? `<button class="feed-mute" data-mute-toggle="${i}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9v6h4l5 4V5l-5 4H5z"/><path d="M17 9a3 3 0 010 6" stroke-opacity="0.4"/></svg></button>` : ''}
      <div class="feed-rail">
        <div><button class="wa" data-wa="${l.wa}">${waIconSvg}</button><div class="lbl">${t('contactWA')}</div></div>
        <div><button class="sh" data-listing-share="${i}">${shareIconSvg}</button><div class="lbl">${t('shareLabel')}</div></div>
      </div>
      <div class="feed-content">
        <div class="feed-price">${l.rent} SAR${t('perMonth')}</div>
        <h3>${t(roomTypeLabelKey[l.type] || l.type)}</h3>
        <div class="city">${l.city} · ${t('postedBy')} ${l.by}</div>
        <div class="feed-tag-row">
          <span class="feed-tag">${t(genderLabelKey[l.gender] || l.gender)}</span>
          <span class="feed-tag">${l.nat==='Any' ? t('natAny') : l.nat}</span>
          <span class="feed-tag">${l.bills ? t('billsIncluded') : t('billsShared')}</span>
        </div>
        <p class="feed-desc">${l.desc}</p>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('[data-wa]').forEach(btn=>{
    btn.addEventListener('click', ()=> window.open('https://wa.me/'+btn.getAttribute('data-wa'), '_blank'));
  });
  wrap.querySelectorAll('[data-mute-toggle]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const card = btn.closest('.feed-card');
      const vid = card.querySelector('video');
      if(vid){ vid.muted = !vid.muted; }
    });
  });
  wrap.querySelectorAll('[data-listing-share]').forEach(btn=>{
    btn.addEventListener('click', ()=> openSharePanel('housing'));
  });

  // Autoplay the video currently in view, pause the rest — same feel as a short-video feed.
  const videos = wrap.querySelectorAll('video');
  if(videos.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.play().catch(()=>{}); }
        else{ entry.target.pause(); }
      });
    }, { root: wrap, threshold: 0.6 });
    videos.forEach(v=>io.observe(v));
  }
}

/* ---- Forum render ---- */
async function fetchAndRenderForum(){
  if (!SUPABASE_CONFIGURED) { renderForum(); return; }
  try {
    const { data, error } = await supabaseClient
      .from('forum_posts')
      .select('*, forum_replies(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching forum:', error);
      renderForum();
      return;
    }

    forumPosts = data.map(p => ({
      id: p.id,
      cat: p.category,
      q: p.question,
      by: p.posted_by,
      votes: p.votes,
      replies: p.forum_replies ? p.forum_replies.map(r => r.reply_text) : []
    }));

    renderForum();
  } catch (err) {
    console.error('Could not reach Supabase for forum posts, showing local data instead:', err);
    renderForum();
  }
}

function renderCatChips(){
  const cats = ["All","Housing","Legal","Jobs","General life"];
  const catKeys = {All:"catAll", Housing:"catHousing", Legal:"catLegal", Jobs:"catJobs", "General life":"catLife"};
  const row = document.getElementById('catChipRow');
  row.innerHTML = cats.map(c=>`<button class="cat-chip ${state.forumCat===c?'active':''}" data-cat="${c}">${t(catKeys[c])}</button>`).join('');
  row.querySelectorAll('[data-cat]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.forumCat = btn.getAttribute('data-cat');
      renderCatChips(); renderForum();
    });
  });
}

function renderForum(){
  const list = document.getElementById('forumList');
  const catKeys = {Housing:"catHousing", Legal:"catLegal", Jobs:"catJobs", "General life":"catLife"};
  const items = state.forumCat==='All' ? forumPosts : forumPosts.filter(p=>p.cat===state.forumCat);
  list.innerHTML = items.map((p,i)=>{
    const idx = forumPosts.indexOf(p);
    const open = state.openReplies[idx];
    return `
    <div class="q-card">
      <div class="q-top">
        <div class="vote">
          <button data-vote="${idx}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5l7 8H5l7-8z"/></svg>
          </button>
          <div class="n">${p.votes}</div>
        </div>
        <div class="q-body">
          <div class="q-cat">${t(catKeys[p.cat])}</div>
          <h4>${p.q}</h4>
          <p class="by">${p.by}</p>
          <div class="q-actions">
            <button data-toggle-reply="${idx}">${p.replies.length} ${t('replies')} · ${open ? t('hideReplies') : t('viewReplies')}</button>
          </div>
          <div class="replies ${open?'open':''}" id="replies-${idx}">
            ${p.replies.map(r=>`<div class="reply"><span class="who">↳</span>${r}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
  list.querySelectorAll('[data-vote]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const idx = btn.getAttribute('data-vote');
      const post = forumPosts[idx];
      post.votes++;
      renderForum();
      if (SUPABASE_CONFIGURED && post.id) {
        try {
          const { error } = await supabaseClient
            .from('forum_posts')
            .update({ votes: post.votes })
            .eq('id', post.id);
          if (error) console.error('Error updating vote:', error);
        } catch (err) {
          console.error('Could not reach Supabase to save vote:', err);
        }
      }
    });
  });
  list.querySelectorAll('[data-toggle-reply]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = btn.getAttribute('data-toggle-reply');
      state.openReplies[idx] = !state.openReplies[idx];
      renderForum();
    });
  });
}

/* ============================= Sign-in (light accounts) ============================= */
function openSignIn(onSuccess){
  pendingSignInAction = onSuccess || null;
  document.getElementById('si-name').value = appUser ? appUser.name : '';
  document.getElementById('si-phone').value = appUser ? appUser.phone : '';
  document.getElementById('signInModal').style.display = 'flex';
}
function closeSignIn(){
  document.getElementById('signInModal').style.display = 'none';
  pendingSignInAction = null;
}
function requireSignIn(onReady){
  if(appUser){ onReady(); return; }
  openSignIn(onReady);
}

async function submitSignIn(){
  const name = document.getElementById('si-name').value.trim();
  const phone = document.getElementById('si-phone').value.trim();
  if(!name || !phone){ return; }

  if(!SUPABASE_CONFIGURED){
    appUser = { id: 'local-'+Date.now(), name, phone };
  } else {
    try{
      // Reuse an existing account for this phone number if one already exists.
      const { data: existing } = await supabaseClient.from('app_users').select('*').eq('phone', phone).limit(1);
      if(existing && existing.length){
        appUser = { id: existing[0].id, name: existing[0].name, phone: existing[0].phone };
      } else {
        const { data: created, error } = await supabaseClient.from('app_users').insert([{ name, phone }]).select();
        if(error){ console.error('Sign-in error:', error); return; }
        appUser = { id: created[0].id, name: created[0].name, phone: created[0].phone };
      }
    } catch(err){
      console.error('Could not reach Supabase to sign in:', err);
      appUser = { id: 'local-'+Date.now(), name, phone }; // fall back so the demo still works offline
    }
  }

  document.getElementById('signInModal').style.display = 'none';
  const action = pendingSignInAction;
  pendingSignInAction = null;
  renderProfile();
  await fetchAndRenderShareLinks();
  if(action) action();
}

function signOut(){
  appUser = null;
  myShareLinks = [];
  renderProfile();
}

function renderProfile(){
  const out = document.getElementById('profileSignedOut');
  const inn = document.getElementById('profileSignedIn');
  if(!appUser){
    out.style.display = 'block';
    inn.style.display = 'none';
    return;
  }
  out.style.display = 'none';
  inn.style.display = 'block';
  document.getElementById('profileName').textContent = appUser.name;
  document.getElementById('profilePhone').textContent = appUser.phone;

  const pages = [
    {key:'home', label: t('navHome')},
    {key:'guide', label: t('navGuide')},
    {key:'housing', label: t('navHousing')},
    {key:'community', label: t('navCommunity')}
  ];
  const list = document.getElementById('myLinksList');
  list.innerHTML = pages.map(p=>{
    const existing = myShareLinks.find(l=>l.page===p.key);
    if(existing){
      return `<div class="buddy-card">
        <div class="buddy-top"><h3>${p.label}</h3><span style="font-size:12px;color:var(--ink-faint);">${existing.clicks} ${t('clicksLabel')}</span></div>
        <button class="wa-btn" style="background:var(--green);" data-open-share="${p.key}">${shareIconSvg}${t('shareLabel')}</button>
      </div>`;
    }
    return `<div class="buddy-card">
      <div class="buddy-top"><h3>${p.label}</h3></div>
      <button class="wa-btn" style="background:var(--gold);" data-open-share="${p.key}">${shareIconSvg}${t('generateLinkBtn')}</button>
    </div>`;
  }).join('');
  list.querySelectorAll('[data-open-share]').forEach(btn=>{
    btn.addEventListener('click', ()=> openSharePanel(btn.getAttribute('data-open-share')));
  });
}

/* ============================= Share links + click tracking ============================= */
function randomShareCode(){
  return Math.random().toString(36).slice(2, 9);
}

function baseShareUrl(){
  return window.location.origin + window.location.pathname;
}

async function fetchAndRenderShareLinks(){
  if(!appUser){ myShareLinks = []; return; }
  if(!SUPABASE_CONFIGURED){ renderProfile(); return; }
  try{
    const { data, error } = await supabaseClient
      .from('share_links')
      .select('id, page, code, share_clicks(count)')
      .eq('user_id', appUser.id);
    if(error){ console.error('Error loading share links:', error); return; }
    myShareLinks = data.map(l=>({ id:l.id, page:l.page, code:l.code, clicks: (l.share_clicks && l.share_clicks[0]) ? l.share_clicks[0].count : 0 }));
    renderProfile();
  } catch(err){
    console.error('Could not reach Supabase to load share links:', err);
  }
}

async function getOrCreateShareLink(page){
  let existing = myShareLinks.find(l=>l.page===page);
  if(existing) return existing;

  const code = randomShareCode();
  if(!SUPABASE_CONFIGURED){
    existing = { id:'local-'+code, page, code, clicks:0 };
    myShareLinks.push(existing);
    return existing;
  }
  try{
    const { data, error } = await supabaseClient.from('share_links').insert([{ user_id: appUser.id, page, code }]).select();
    if(error){ console.error('Error creating share link:', error); return { id:null, page, code, clicks:0 }; }
    existing = { id:data[0].id, page, code, clicks:0 };
    myShareLinks.push(existing);
    return existing;
  } catch(err){
    console.error('Could not reach Supabase to create share link:', err);
    existing = { id:'local-'+code, page, code, clicks:0 };
    myShareLinks.push(existing);
    return existing;
  }
}

async function openSharePanel(page){
  requireSignIn(async ()=>{
    const link = await getOrCreateShareLink(page);
    const url = `${baseShareUrl()}?ref=${link.code}&page=${page}`;
    document.getElementById('shareLinkInput').value = url;
    document.getElementById('btnShareWhatsapp').href = `https://wa.me/?text=${encodeURIComponent(url)}`;
    document.getElementById('sharePanel').style.display = 'flex';
    renderProfile();
  });
}

async function trackIncomingShareCode(){
  const params = new URLSearchParams(window.location.search);
  const code = params.get('ref');
  if(!code || !SUPABASE_CONFIGURED) return;
  try{
    const { data } = await supabaseClient.from('share_links').select('id').eq('code', code).limit(1);
    if(data && data.length){
      await supabaseClient.from('share_clicks').insert([{ share_link_id: data[0].id }]);
    }
  } catch(err){
    console.error('Could not record share click:', err);
  }
}

/* ============================= Buddies ============================= */
function renderBuddies(){
  const wrap = document.getElementById('buddyList');
  if(!buddies.length){
    wrap.innerHTML = `<p style="text-align:center;color:var(--ink-faint);font-size:13px;padding:20px 0;">${t('noBuddiesYet')}</p>`;
    return;
  }
  const helpKeyMap = {Housing:'helpHousing', Paperwork:'helpPaperwork', Orientation:'helpOrientation'};
  wrap.innerHTML = buddies.map(b=>`
    <div class="buddy-card">
      <div class="buddy-top"><h3>${b.name}</h3></div>
      <div class="tag-row">${(b.help||[]).map(h=>`<span class="tag">${t(helpKeyMap[h]||h)}</span>`).join('')}</div>
      <p class="buddy-desc">${b.bio}</p>
      <a class="wa-btn" href="https://wa.me/${b.wa}" target="_blank" rel="noopener">${waIconSvg}${t('contactWA')}</a>
    </div>
  `).join('');
}

async function fetchAndRenderBuddies(){
  if(!SUPABASE_CONFIGURED){ renderBuddies(); return; }
  try{
    const { data, error } = await supabaseClient.from('buddies').select('*, app_users(name)').order('created_at', { ascending:false });
    if(error){ console.error('Error loading buddies:', error); renderBuddies(); return; }
    buddies = data.map(b=>({ name: b.app_users ? b.app_users.name : 'Buddy', help: b.help_areas || [], bio: b.bio, wa: b.whatsapp }));
    renderBuddies();
  } catch(err){
    console.error('Could not reach Supabase for buddies, showing local data instead:', err);
    renderBuddies();
  }
}

async function submitBuddy(){
  const help = [...document.querySelectorAll('.buddy-help:checked')].map(c=>c.value);
  const bio = document.getElementById('buddy-bio').value.trim() || '—';
  const wa = (document.getElementById('buddy-wa').value || '966500000000').replace(/[^0-9]/g,'');
  if(!help.length){ return; }

  requireSignIn(async ()=>{
    if(!SUPABASE_CONFIGURED){
      buddies.unshift({ name: appUser.name, help, bio, wa });
      document.getElementById('buddyForm').style.display = 'none';
      renderBuddies();
      return;
    }
    try{
      const { error } = await supabaseClient.from('buddies').insert([{ user_id: appUser.id, help_areas: help, bio, whatsapp: wa }]);
      if(error){ console.error('Error publishing buddy profile:', error); return; }
      document.getElementById('buddyForm').style.display = 'none';
      await fetchAndRenderBuddies();
    } catch(err){
      console.error('Could not reach Supabase to publish buddy profile:', err);
    }
  });
}

/* ---- Full re-render ---- */
function renderAll(){
  applyI18n();
  populateFilterOptions();
  renderGuide();
  renderListings();
  renderCatChips();
  renderForum();
  renderBuddies();
  renderProfile();
}

/* ============================= Events ============================= */
document.querySelectorAll('[data-lang-btn]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.lang = btn.getAttribute('data-lang-btn');
    renderAll();
  });
});
document.querySelectorAll('nav.tabbar button').forEach(btn=>{
  btn.addEventListener('click', ()=> setTab(btn.getAttribute('data-tab')));
});
document.querySelectorAll('[data-goto]').forEach(btn=>{
  btn.addEventListener('click', ()=> setTab(btn.getAttribute('data-goto')));
});

function setPostFormOpen(open){
  document.getElementById('postForm').style.display = open ? 'block' : 'none';
}
document.getElementById('btnOpenPost').addEventListener('click', ()=>{
  const open = document.getElementById('postForm').style.display === 'none';
  setPostFormOpen(open);
  if(open) closeFilters(); // only one sheet at a time
});
document.getElementById('btnClosePost').addEventListener('click', ()=> setPostFormOpen(false));

/* ---- Filter bottom sheet (mobile) ---- */
function setFiltersOpen(open){
  const sheet = document.getElementById('filterSheet');
  const btn = document.getElementById('btnToggleFilters');
  if(!sheet) return;
  sheet.classList.toggle('open', open);
  if(btn) btn.setAttribute('aria-expanded', String(open));
  // Only a modal dialog while it's actually a sheet — on desktop it's a static panel.
  const box = sheet.querySelector('.filter-bar');
  if(open){ box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true'); }
  else{ box.removeAttribute('role'); box.removeAttribute('aria-modal'); }
  if(open) updateFilterUI();
}
function closeFilters(){ setFiltersOpen(false); }

function resetFilters(){
  state.filters = {city:'all', budget:'all', nat:'all', gender:'all', roomType:'all'};
  ['filterCity','filterBudget','filterNat','filterGender','filterRoomType'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value = 'all';
  });
  renderListings();
}

document.getElementById('btnToggleFilters').addEventListener('click', ()=>{
  const open = !document.getElementById('filterSheet').classList.contains('open');
  setFiltersOpen(open);
  if(open) setPostFormOpen(false); // only one sheet at a time
});
document.querySelectorAll('[data-close-filters]').forEach(el=>{
  el.addEventListener('click', closeFilters);
});
document.getElementById('btnResetFilters').addEventListener('click', resetFilters);
document.addEventListener('keydown', e=>{
  if(e.key !== 'Escape') return;
  closeFilters();
  setPostFormOpen(false);
});
document.getElementById('btnOpenAsk').addEventListener('click', ()=>{
  const p = document.getElementById('askForm');
  p.style.display = p.style.display==='none' ? 'block' : 'none';
});
document.getElementById('btnOpenBuddy').addEventListener('click', ()=>{
  const p = document.getElementById('buddyForm');
  p.style.display = p.style.display==='none' ? 'block' : 'none';
});

/* ---- Sign-in modal ---- */
document.getElementById('btnProfileSignIn').addEventListener('click', ()=> openSignIn());
document.getElementById('btnSignInSubmit').addEventListener('click', submitSignIn);
document.getElementById('btnSignInCancel').addEventListener('click', closeSignIn);
document.getElementById('btnSignOut').addEventListener('click', signOut);

/* ---- Share panel ---- */
document.querySelectorAll('[data-share-page]').forEach(btn=>{
  btn.addEventListener('click', ()=> openSharePanel(btn.getAttribute('data-share-page')));
});
document.getElementById('btnShareClose').addEventListener('click', ()=>{
  document.getElementById('sharePanel').style.display = 'none';
});
document.getElementById('btnCopyShareLink').addEventListener('click', ()=>{
  const input = document.getElementById('shareLinkInput');
  input.select();
  navigator.clipboard?.writeText(input.value).catch(()=>{});
  const btn = document.getElementById('btnCopyShareLink');
  const original = btn.textContent;
  btn.textContent = t('linkCopied');
  setTimeout(()=>{ btn.textContent = original; }, 1800);
});

/* ---- Community sub-tabs (Q&A / Buddies) ---- */
document.querySelectorAll('[data-subtab]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.communitySubTab = btn.getAttribute('data-subtab');
    document.querySelectorAll('[data-subtab]').forEach(b=>b.classList.toggle('active', b===btn));
    document.getElementById('communityQA').style.display = state.communitySubTab==='qa' ? 'block' : 'none';
    document.getElementById('communityBuddies').style.display = state.communitySubTab==='buddies' ? 'block' : 'none';
  });
});

document.getElementById('btnSubmitBuddy').addEventListener('click', submitBuddy);

document.getElementById('filterCity').addEventListener('change', e=>{ state.filters.city = e.target.value; renderListings(); });
document.getElementById('filterBudget').addEventListener('change', e=>{ state.filters.budget = e.target.value; renderListings(); });
document.getElementById('filterNat').addEventListener('change', e=>{ state.filters.nat = e.target.value; renderListings(); });
document.getElementById('filterGender').addEventListener('change', e=>{ state.filters.gender = e.target.value; renderListings(); });
document.getElementById('filterRoomType').addEventListener('change', e=>{ state.filters.roomType = e.target.value; renderListings(); });

document.getElementById('btnSubmitListing').addEventListener('click', async ()=>{
  const city = document.getElementById('f-city').value;
  const rent = parseInt(document.getElementById('f-rent').value) || 0;
  const room_type = document.getElementById('f-roomtype').value;
  const gender_pref = document.getElementById('f-gender').value;
  const nationality_pref = document.getElementById('f-nat').value === 'all' ? 'Any' : document.getElementById('f-nat').value;
  const bills_included = document.getElementById('f-bills').checked;
  const description = document.getElementById('f-desc').value || '—';
  const whatsapp = (document.getElementById('f-wa').value || '966500000000').replace(/[^0-9]/g, '');
  const videoFile = document.getElementById('f-video').files[0];

  if (!rent) {
    document.getElementById('f-rent').focus();
    return;
  }

  const clearFormAndClose = () => {
    document.getElementById('postForm').style.display = 'none';
    document.getElementById('f-rent').value = '';
    document.getElementById('f-desc').value = '';
    document.getElementById('f-wa').value = '';
    document.getElementById('f-video').value = '';
    document.getElementById('videoUploadStatus').style.display = 'none';
  };

  requireSignIn(async ()=>{
    if (!SUPABASE_CONFIGURED) {
      // No backend configured yet — keep the listing in this tab so the form still works.
      // A locally-picked video plays fine for this session via an object URL, but won't persist across reloads.
      const localVideoUrl = videoFile ? URL.createObjectURL(videoFile) : null;
      listings.unshift({ city, rent, type: room_type, gender: gender_pref, nat: nationality_pref, bills: bills_included, desc: description, by: appUser.name, wa: whatsapp, video: localVideoUrl });
      clearFormAndClose();
      setTab('housing');
      renderListings();
      return;
    }

    try {
      let video_url = null;
      if (videoFile) {
        const statusEl = document.getElementById('videoUploadStatus');
        statusEl.style.display = 'block';
        const path = `${Date.now()}_${videoFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        const { error: uploadError } = await supabaseClient.storage.from('listing-videos').upload(path, videoFile);
        statusEl.style.display = 'none';
        if (uploadError) {
          console.error('Error uploading video:', uploadError);
        } else {
          video_url = supabaseClient.storage.from('listing-videos').getPublicUrl(path).data.publicUrl;
        }
      }

      const { error } = await supabaseClient.from('housing_listings').insert([{
        city, rent, room_type, gender_pref, nationality_pref, bills_included, description,
        poster_role: appUser.name, whatsapp, video_url, poster_user_id: appUser.id
      }]);

      if (error) {
        console.error('Error publishing listing:', error);
        return;
      }

      clearFormAndClose();
      await fetchAndRenderListings();
      setTab('housing');
    } catch (err) {
      console.error('Could not reach Supabase to publish listing:', err);
    }
  });
});

document.getElementById('btnSubmitQuestion').addEventListener('click', async ()=>{
  const catEl = document.getElementById('q-cat');
  const catMap = {"catHousing":"Housing","catLegal":"Legal","catJobs":"Jobs","catLife":"General life"};
  const selKey = catEl.selectedOptions[0].getAttribute('data-i18n');
  const category = catMap[selKey] || "General life";
  const question = document.getElementById('q-text').value.trim();
  if(!question){ document.getElementById('q-text').focus(); return; }

  const clearFormAndClose = () => {
    document.getElementById('askForm').style.display = 'none';
    document.getElementById('q-text').value = '';
    state.forumCat = 'All';
    renderCatChips();
  };

  requireSignIn(async ()=>{
    if (!SUPABASE_CONFIGURED) {
      // No backend configured yet — keep the question in this tab so the form still works.
      forumPosts.unshift({ cat: category, q: question, by: appUser.name, votes: 0, replies: [] });
      clearFormAndClose();
      renderForum();
      return;
    }

    try {
      const { error } = await supabaseClient.from('forum_posts').insert([{
        category, question, posted_by: appUser.name, votes: 0, poster_user_id: appUser.id
      }]);

      if (error) {
        console.error('Error posting question:', error);
        return;
      }

      clearFormAndClose();
      await fetchAndRenderForum();
    } catch (err) {
      console.error('Could not reach Supabase to post question:', err);
    }
  });
});

/* ============================= Initial load ============================= */
async function initApp(){
  renderAll();
  applyFeedMode();
  await trackIncomingShareCode();
  await Promise.all([fetchAndRenderListings(), fetchAndRenderForum(), fetchAndRenderBuddies()]);
}

initApp();
