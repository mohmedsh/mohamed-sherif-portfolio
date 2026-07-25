# Mohamed Sherif — Portfolio & Knowledge Hub

نسخة جاهزة للرفع على GitHub Pages، وبها:

- موقع Portfolio احترافي ومتجاوب.
- CV Builder كامل لتعديل البيانات والخبرات والمهارات والمشاريع والتعليم والشهادات واللغات وأقسام مخصصة.
- صفحة `cv.html` تنشئ الـCV من آخر بيانات محفوظة، مع Preview وPrint وتنزيل PDF مباشر.
- Projects وTechnical Notes.
- لوحة Admin مستقلة.
- Public / Private / Unlisted.
- Published / Draft / Archived.
- Demo Mode يعمل فورًا باستخدام Local Storage.
- Production Mode باستخدام Supabase Auth + PostgreSQL + RLS.
- GitHub Actions للنشر التلقائي.

## 1) تجربة النسخة الآن

افتح `index.html` في متصفح، أو شغّل Local Server:

```bash
python -m http.server 8000
```

ثم افتح:

```text
http://localhost:8000
```

لوحة التحكم:

```text
http://localhost:8000/admin.html
```

حساب التجربة:

```text
Username: mohamed.sherif
Password: 123
```

> Demo Mode للحكم على التصميم والـWorkflow فقط. البيانات محفوظة في المتصفح نفسه وليست حماية حقيقية.

> **تنبيه أمان:** كلمة المرور `123` موجودة فقط لتجربة النسخة المحلية. لا تصلح لنسخة Live تحتوي ملفات خاصة؛ لأنها سهلة التخمين، كما أن أي كلمة مرور Demo موجودة في كود JavaScript يمكن رؤيتها. في النسخة الحقيقية كلمة المرور تُحفظ وتُتحقق داخل Supabase وليست داخل GitHub.

## 2) ربط Supabase للحماية الحقيقية

1. أنشئ مشروع Supabase.
2. افتح SQL Editor وشغّل ملف `supabase-schema.sql` كاملًا.
3. من Authentication → Users أنشئ مستخدم الـOwner ببريد حقيقي وكلمة مرور قوية (يفضل 12 حرفًا أو أكثر). اسم الدخول الظاهر داخل الموقع سيظل `mohamed.sherif`.
4. ارجع إلى SQL Editor وشغّل السطر الموجود في نهاية الملف بعد وضع بريدك الصحيح:

```sql
insert into public.profiles (id, role)
select id, 'owner' from auth.users where email = 'YOUR_EMAIL@example.com'
on conflict (id) do update set role = excluded.role;
```

5. من Project Settings → API انسخ:
   - Project URL
   - Public anon key
6. ضعهما في `config.js`:

```js
window.PORTFOLIO_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_PUBLIC_ANON_KEY",
  AUTH_USERNAME: "mohamed.sherif",
  AUTH_EMAIL: "YOUR_SUPABASE_OWNER_EMAIL",
  DEMO_USERNAME: "mohamed.sherif",
  DEMO_PASSWORD: "123"
};
```

`anon key` مصمم للاستخدام في الـFrontend؛ الحماية الحقيقية تأتي من سياسات RLS الموجودة في ملف SQL. لا تضع `service_role` key داخل الموقع أو GitHub نهائيًا.

## 3) الرفع على GitHub Pages

1. أنشئ Repository جديدًا، مثل `mohamed-portfolio`.
2. ارفع كل الملفات كما هي.
3. افتح Settings → Pages.
4. اختر Source: GitHub Actions.
5. عند كل Push إلى `main` سيتم نشر الموقع تلقائيًا.

الرابط يكون غالبًا:

```text
https://USERNAME.github.io/mohamed-portfolio/
```

## 4) طريقة الاستخدام

- افتح `admin.html`.
- سجّل الدخول.
- من CV Builder عدّل أي جزء في الـCV، ثم اضغط `Save latest CV`.
- زر `Preview CV` يفتح آخر نسخة محفوظة.
- زر `Download latest PDF` يحفظ التعديلات أولًا ثم يولّد PDF جديدًا؛ لا تحتاج إلى رفع ملف CV يدويًا بعد كل تعديل.
- من Projects أو Technical Notes أضف وعدّل واحذف.
- Visibility:
  - `public`: يظهر للزوار عند Published.
  - `private`: يراه Owner فقط داخل لوحة التحكم.
  - `unlisted`: محفوظ في النظام وغير ظاهر في القوائم العامة. يمكن تطوير صفحة مشاركة بتوكن كمرحلة تالية.
- Status:
  - `published`: منشور إذا كان Public.
  - `draft`: مسودة.
  - `archived`: مؤرشف.

## 5) ملاحظات أمنية

- لا ترفع بيانات شركات أو IPs أو مخططات حقيقية على Public Storage.
- الملفات الخاصة توضع في bucket باسم `portfolio-private` وتحتاج Signed URLs عند إضافة File Manager.
- لا تستخدم إخفاء عناصر HTML كوسيلة حماية؛ RLS هو الذي يمنع الاستعلام أصلًا.
- لا تخزن كلمات مرور أو مفاتيح حساسة داخل المشاريع أو الملخصات.

## الملفات الأساسية

- `index.html`: الموقع العام.
- `admin.html`: لوحة التحكم وCV Builder.
- `cv.html`: عرض وتنزيل أحدث نسخة CV.
- `cv.css`: تنسيق الـCV للطباعة وPDF.
- `cv.js`: قراءة أحدث بيانات وتوليد PDF.
- `styles.css`: تصميم الموقع.
- `admin.css`: تصميم لوحة الإدارة.
- `app.js`: منطق الموقع العام.
- `admin.js`: منطق لوحة الإدارة.
- `data-service.js`: التبديل بين Demo وSupabase.
- `supabase-schema.sql`: قاعدة البيانات والصلاحيات، بما فيها جدول `cv_documents`.
- `.github/workflows/pages.yml`: النشر التلقائي.
