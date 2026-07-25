# Mohamed Sherif Portfolio Hub — النسخة النهائية

هذه النسخة تستبدل كل النسخ التجريبية السابقة، وتستخدم أسماء ملفات جديدة لمنع كاش GitHub Pages القديم.

## ما يعمل في النسخة

- Portfolio احترافي ومتجاوب.
- تسجيل دخول حقيقي عن طريق Supabase Auth.
- لا توجد كلمة مرور داخل GitHub أو JavaScript.
- CV Builder لتعديل كل بيانات الـCV.
- Preview وPDF من آخر تعديل محفوظ في السحابة.
- إضافة وتعديل وحذف المشاريع والملخصات.
- Public / Private / Unlisted وDraft / Published / Archived.
- رفع صورة الغلاف وPDF وZIP والملفات حتى 25 MB.
- الملفات الخاصة داخل Private Storage Bucket.
- تعديل بيانات الموقع والبريد وLinkedIn والموقع الجغرافي.
- البيانات الافتراضية تُضاف تلقائيًا عند أول دخول إذا كانت الجداول فارغة.

## الرفع النهائي على GitHub

1. فك ضغط ملف ZIP.
2. افتح Repository: `mohmedsh/mohamed-sherif-portfolio`.
3. ارفع **كل الملفات الموجودة داخل المجلد** إلى جذر Repository واختر Replace للملفات الموجودة.
4. Commit message: `Deploy final secure portfolio build`.
5. Settings → Pages يجب أن تكون:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /(root)
6. انتظر دقيقة وافتح الموقع مع `?v=final` أول مرة.

## الروابط

- الموقع: `https://mohmedsh.github.io/mohamed-sherif-portfolio/?v=final`
- لوحة التحكم: `https://mohmedsh.github.io/mohamed-sherif-portfolio/admin.html?v=final`
- أحدث CV: `https://mohmedsh.github.io/mohamed-sherif-portfolio/cv.html?v=final`

## تسجيل الدخول

- Username: `mohamed.sherif`
- Password: كلمة المرور التي أنشأتها داخل Supabase Authentication.

لا تضع أو ترسل كلمة المرور داخل أي ملف.

## Supabase

أنت شغلت SQL بنجاح بالفعل. لا تحتاج لتشغيله مرة أخرى إلا إذا حذفت الجداول أو أنشأت مشروع Supabase جديدًا. الملف `supabase-setup.sql` موجود للنسخ الاحتياطي والإعداد من الصفر.

## الأمان

- Publishable key الموجود في `config-final.js` مفتاح عام مصمم للمتصفح.
- الحماية الفعلية تعتمد على RLS.
- ممنوع وضع `service_role` أو `sb_secret_...` أو Database Password داخل GitHub.
