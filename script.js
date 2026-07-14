const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
menuBtn.addEventListener('click', () => navMenu.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const translations = {
  ar: {
    nav:['عني','المهارات','الخبرات','المشاريع','تواصل'],
    status:'متاح لفرص عمل في الشبكات والأمن السيبراني',
    title:'أبني بنية تحتية مؤسسية آمنة، موثوقة وقابلة للتوسع.',
    intro:'أنا محمد شريف، مهندس بنية تحتية وأمن شبكات بخبرة عملية في Cisco وFortiGate وWindows Server وVMware وLinux والمراقبة والأتمتة.',
    projectBtn:'شاهد مشاريعي', cvBtn:'تحميل السيرة الذاتية'
  }
};
let ar = false;
document.getElementById('langBtn').addEventListener('click', function(){
  ar = !ar;
  document.documentElement.dir = ar ? 'rtl' : 'ltr';
  this.textContent = ar ? 'EN' : 'AR';
  if(ar){
    [...document.querySelectorAll('.nav a')].forEach((a,i)=>a.textContent=translations.ar.nav[i]);
    document.querySelector('.availability').lastChild.textContent=' '+translations.ar.status;
    document.querySelector('.hero h1').innerHTML='أبني بنية تحتية مؤسسية<br><span>آمنة، موثوقة وقابلة للتوسع.</span>';
    document.querySelector('.hero-text').textContent=translations.ar.intro;
    document.querySelector('.hero-actions .primary').textContent=translations.ar.projectBtn;
    document.querySelector('.hero-actions .secondary').textContent=translations.ar.cvBtn;
  } else location.reload();
});
