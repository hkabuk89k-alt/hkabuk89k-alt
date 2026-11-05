حراج كل شي - اليمن | ملفات دمج OneSignal

ملفات الحزمة:
- index.html: واجهة الموقع مع OneSignal SDK init.
- admin.html: لوحة الإدارة مع استدعاء الإشعارات عند إضافة إعلان جديد من الإدارة أو الموافقة على إعلان عميل.
- OneSignalSDKWorker.js: service worker مطلوب للويب push.
- api/send-notification.js: Vercel serverless function، لا يضع REST API Key داخل المتصفح.

إعداد Vercel:
أنت ذكرت أن متغيري ONESIGNAL_APP_ID و ONESIGNAL_REST_API_KEY أُضيفا بالفعل.
أضف متغيراً جديداً:
Name: ONESIGNAL_ADMIN_TOKEN
Value: -9O2Rv3TuAXhMMeqgxNVkrAboxOpE9eoUx1mImxRKXM

ثم استبدل الملفات المقابلة في مشروع GitHub بهذه الملفات، مع إبقاء بقية ملفات المشروع كما هي، ثم اعمل Deploy.

عند فتح لوحة admin.html وتسجيل الدخول، ستظهر مطالبة بإدخال ONESIGNAL_ADMIN_TOKEN. أدخله كما هو؛ سيبقى في sessionStorage خلال جلسة المتصفح الحالية. لا تشاركه.

ملاحظات:
- يجب أن يكون الموقع على HTTPS.
- الإشعارات تستهدف Subscribed Users (المشتركين في إشعارات OneSignal).
- عند الإضافة أو الموافقة، يُرسل إشعار بعنوان الإعلان وقسمه.
- تعديل إعلان موجود أو حذف إعلان لا يرسل إشعاراً.
- هذا الرمز الإضافي يحمي endpoint من الاستدعاء العادي؛ تسجيل الدخول الحالي للوحة ما زال client-side كما كان.
