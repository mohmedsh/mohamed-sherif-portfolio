# Mohamed Sherif Portfolio Hub — النسخة الآمنة

## تم حذف المشكلة بالكامل

هذه النسخة لا تحتوي على كلمة مرور مكتوبة داخل HTML أو JavaScript، ولا يوجد بها دخول تجريبي أو تخزين صلاحية الإدارة داخل المتصفح.

### الحماية الحالية

- كلمة المرور تُحفظ ويُتحقق منها داخل Supabase Authentication فقط.
- لا توجد كلمة مرور داخل GitHub أو `config.js` أو Local Storage أو Session Storage.
- الزائر يشاهد المحتوى `Public + Published` فقط.
- المحتوى Private وDraft وUnlisted لا يقرأه إلا حساب الـOwner.
- صلاحيات قاعدة البيانات والملفات محمية بـRow Level Security الموجودة في `supabase-schema.sql`.

## الملفات المهمة

- `index.html`: الموقع العام.
- `admin.html`: لوحة التحكم الآمنة.
- `cv.html`: أحدث CV.
- `config.js`: رابط مشروع Supabase والـAnon Key وإيميل الـOwner فقط، بدون كلمة مرور.
- `supabase-schema.sql`: الجداول وسياسات الحماية.

## تشغيل لوحة التحكم الحقيقية مرة واحدة

1. أنشئ مشروعًا في Supabase.
2. افتح SQL Editor وشغّل ملف `supabase-schema.sql` كاملًا.
3. من Authentication → Users أنشئ حساب الـOwner بكلمة مرور قوية.
4. نفّذ أمر تعيين الـOwner الموجود كتعليق في نهاية ملف SQL بعد استبدال الإيميل.
5. افتح `config.js` وضع:

```js
SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
SUPABASE_ANON_KEY: "YOUR_ANON_KEY",
AUTH_USERNAME: "mohamed.sherif",
AUTH_EMAIL: "OWNER_EMAIL"
```

لا تضع كلمة المرور في أي ملف. تدخل بها فقط من شاشة `admin.html`، ويقوم Supabase بالتحقق منها.

## قبل ربط Supabase

الموقع العام سيظل يعرض المحتوى الأساسي الجاهز، لكن لوحة الإدارة ستكون مقفولة برسالة واضحة بدل قبول أي كلمة مرور مكشوفة.
