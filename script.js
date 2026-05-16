/* ══ 1. FLOATING PARTICLES ══ */
(function(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  function resize(){
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(a,b){ return Math.random()*(b-a)+a; }

  class Dot {
    reset(){
      this.x  = rand(0, W);
      this.y  = rand(0, H);
      this.r  = rand(0.5, 1.5); // Smaller dots
      this.vx = rand(-0.1, 0.1); // Slower
      this.vy = rand(-0.08, 0.08); // Slower
      this.a  = rand(0.02, 0.2); // More transparent
      this.da = rand(-0.001, 0.001);
    }
    constructor(){ this.reset(); }
    tick(){
      this.x += this.vx;
      this.y += this.vy;
      this.a += this.da;
      if(this.a > 0.2) this.da = -Math.abs(this.da);
      if(this.a < 0.02) this.da = Math.abs(this.da);
      if(this.x < -10 || this.x > W+10 || this.y < -10 || this.y > H+10) this.reset();
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,212,255,${this.a})`;
      ctx.fill();
    }
  }

  for(let i=0;i<50;i++) pts.push(new Dot()); // Fewer dots

  function lines(){
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle=`rgba(0,212,255,${0.03*(1-d/120)})`;
          ctx.lineWidth=0.5; ctx.stroke();
        }
      }
    }
  }

  function loop(){
    ctx.clearRect(0,0,W,H);
    lines();
    pts.forEach(p=>{ p.tick(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ══ 2. TYPED TEXT ══ */
(function(){
  const el = document.getElementById('typedText');
  if(!el) return;
  const lines = [
    'VLSI DESIGN // SILICON ARCHITECTURE',
    'EMBEDDED SYSTEMS // PCB DESIGN',
    'RTL DESIGN // SYSTEMVERILOG'
  ];
  let li=0, ci=0, del=false;

  function tick(){
    const line = lines[li];
    if(!del){
      el.textContent = line.slice(0, ++ci);
      if(ci === line.length){ del=true; setTimeout(tick,2500); return; }
      setTimeout(tick, 40); // Slightly faster typing
    } else {
      el.textContent = line.slice(0, --ci);
      if(ci === 0){ del=false; li=(li+1)%lines.length; setTimeout(tick,400); return; }
      setTimeout(tick, 20); // Faster deleting
    }
  }
  setTimeout(tick, 800);
})();

/* ══ 3. SCROLL REVEAL ══ */
(function(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{ threshold:0.1 });
  document.querySelectorAll('.reveal,.stagger').forEach(el=>io.observe(el));
})();

/* ══ 4. SKILL BARS ══ */
(function(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll('.skill-bar-fill').forEach(b=>{
          b.style.width = b.dataset.width + '%';
        });
        io.unobserve(e.target);
      }
    });
  },{ threshold:0.15 });
  const g = document.getElementById('skillsGrid');
  if(g) io.observe(g);
})();

/* ══ 5. ACTIVE NAV + SCROLL CLASS ══ */
(function(){
  const nav   = document.getElementById('mainNav');
  const links = document.querySelectorAll('#navLinks a[data-section]');
  const sects = Array.from(links).map(a=>document.getElementById(a.dataset.section));

  window.addEventListener('scroll',()=>{
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    let cur = '';
    sects.forEach((s,i)=>{ 
      if(s && s.getBoundingClientRect().top <= 100) cur = links[i].dataset.section; 
    });
    links.forEach(a=>a.classList.toggle('active', a.dataset.section === cur));
  },{ passive:true });
})();
