import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useSpring, useTransform } from 'framer-motion'

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const EZ  = [.22,1,.36,1]
const EZI = [.7,0,.84,0]

const COURSES = [
  { n:'01', name:'Beginner',      sub:'Grade Initial – 3', tag:'FOUNDATION',   price:'₹1,000', note:'Ages 7+',         hot:false, feat:['Scales & arpeggios','Simple repertoire','Sight-reading basics','Aural training','Hand coordination'] },
  { n:'02', name:'Intermediate',  sub:'Grade 4 – 5',       tag:'MUSICIANSHIP', price:'₹1,000', note:'All ages',        hot:false, feat:['Personal interpretation','Advanced scales','Stylistic accuracy','Advanced sight-reading','Harmonic progressions'] },
  { n:'03', name:'Advanced',      sub:'Grade 6 – 8',       tag:'MASTERY',      price:'₹2,000', note:'Pre-professional',hot:true,  feat:['Complex repertoire','Concert preparation','Professional technique','Advanced interpretation','Performance maturity'] },
  { n:'04', name:'Little Mozart', sub:'Alfred Method',     tag:'EARLY YEARS',  price:'₹1,000', note:'Ages 4 – 6',     hot:false, feat:['Music fundamentals','Rhythm & melody','Keyboard intro','Singing & movement','Child-centred learning'] },
]
const TEAM = [
  { name:'Pradeep Chaturvedi',    role:'Founder & Principal',          note:'Trinity College London Rep.',    img:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/sir-1-1024x1024.png',      q:'Pioneer of Western classical piano in Rajasthan.' },
  { name:'Mani Chaturvedi',       role:'Co-Founder · Senior Faculty',  note:'First Female Piano Tutor · RJ', img:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/maam-1024x1024.png',       q:'Award-winning educator. National-level achiever.' },
  { name:'Yashaswini Chaturvedi', role:'Instructor · Grade 8',         note:'Psychology + Music',             img:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/Yashaswini-1024x1024.jpg', q:'Holistic, deeply personalised mentorship.' },
]
const FAQS = [
  { q:'What age groups do you accept?', a:'We welcome students from age 4 through to adults. Our Little Mozart programme serves ages 4–6, while the graded syllabus caters to all levels from Grade Initial to Grade 8.' },
  { q:'Do you prepare for Trinity examinations?', a:'Yes. As the authorised regional representative of Trinity College London, Pradeep Chaturvedi conducts internationally recognised examinations — performance, theory, sight-reading and aural skills.' },
  { q:'Is prior musical experience required?', a:'No prior experience needed for beginner enrolments. For intermediate and advanced levels, we assess each student individually and place them at the appropriate grade.' },
  { q:'What makes Soul of Symphony different?', a:'We are exclusively piano-focused — a conservatoire, not a hobby class. Our approach prioritises discipline, artistry and international standards. Students achieve national ranks and entry to world music schools.' },
  { q:'Are there performance opportunities?', a:'Yes — annual concerts, recitals and curated performance events develop stage confidence, performance maturity and artistic presence in every student.' },
]
const REELS = [
  { src:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/%F0%9F%8E%B9-Meet-Aanya-%E2%80%94-pouring-her-heart-into-Tujhe-Kitna-Chahne-Lage-Hum-on-the-piano-%F0%9F%92%96From-her-fir.mp4', title:'Aanya', sub:'Tujhe Kitna Chahne Lage' },
  { src:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/I-played-the-pain-I-never-spoke-Bekhayali-on-PianoI-hope-you-like-it-kabirsingh-bekhayalip.mp4', title:'Bekhayali', sub:'Playing the pain' },
  { src:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/get.mp4', title:'Studio', sub:'Behind the keys' },
  { src:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/%F0%9F%8E%B9%E2%9C%A8-Experience-the-timeless-beauty-of-Words-by-Boyzone-in-this-heartfelt-piano-cover-by-Ranvir-J.mp4', title:'Ranvir', sub:'Words by Boyzone' },
]
const BAND1 = ['SOUL OF SYMPHONY','THE PIANO CONSERVATOIRE','TRINITY COLLEGE LONDON','EST. 2005 · JAIPUR','NORTH INDIA']
const BAND2 = ['VIKRAM SINGH','SHASHWAT SACHDEV','ANKIT KAR','VIKAS BAGLA','ASHOK BISHNOI','VIPUL GUPTA — RANK 1 INDIA']
const ALUMNI = ['VIKRAM SINGH — Bollywood Composer','VIKAS BAGLA — University of York','ANKIT KAR — Pianist, TATHAASTU','SHASHWAT SACHDEV — Composer & Singer','ASHOK BISHNOI — Rapper & Producer','VIPUL GUPTA — Rank 1, India 2011']

/* ═══════════════════════════════════════
   ANIMATION HELPERS
═══════════════════════════════════════ */
const up = (delay=0,y=50,dur=.9) => ({
  initial:{opacity:0,y},
  whileInView:{opacity:1,y:0},
  viewport:{once:true,margin:'0px 0px -60px 0px'},
  transition:{duration:dur,delay,ease:EZ},
})

/* ── Section label: —— TEXT */
function SLabel({text,dark=false,delay=0}){
  const c = dark ? 'var(--a2)' : 'var(--a1)'
  return(
    <motion.div style={{display:'flex',alignItems:'center',gap:'.9rem',marginBottom:'1.5rem'}} {...up(delay,14,.7)}>
      <motion.span style={{display:'block',width:'28px',height:'1px',background:c,flexShrink:0,transformOrigin:'left'}}
        initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true}} transition={{duration:.7,delay,ease:EZ}}/>
      <span style={{fontFamily:"'Cinzel',serif",fontSize:'.48rem',letterSpacing:'.36em',color:c,textTransform:'uppercase',fontWeight:300}}>{text}</span>
    </motion.div>
  )
}

/* ── Scroll progress bar */
function ProgressBar(){
  const {scrollYProgress}=useScroll()
  const sx=useSpring(scrollYProgress,{stiffness:100,damping:30})
  return <motion.div style={{position:'fixed',top:0,left:0,right:0,height:'2px',background:'var(--a1)',transformOrigin:'left',scaleX:sx,zIndex:9999}}/>
}

/* ═══════════════════════════════════════
   CURSOR
═══════════════════════════════════════ */
function Cursor(){
  const dot=useRef(null), ring=useRef(null), lbl=useRef(null)
  useEffect(()=>{
    if(!window.matchMedia('(pointer:fine)').matches)return
    let mx=0,my=0,rx=0,ry=0,raf
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY})
    const loop=()=>{
      if(dot.current){dot.current.style.left=mx+'px';dot.current.style.top=my+'px'}
      rx+=(mx-rx)*.11; ry+=(my-ry)*.11
      if(ring.current){ring.current.style.left=rx+'px';ring.current.style.top=ry+'px'}
      raf=requestAnimationFrame(loop)
    }
    raf=requestAnimationFrame(loop)
    const on=e=>{const t=e.currentTarget.dataset.c||'';document.body.dataset.cs=t?'l':'h';if(lbl.current)lbl.current.textContent=t}
    const off=()=>{document.body.dataset.cs='';if(lbl.current)lbl.current.textContent=''}
    const bind=()=>document.querySelectorAll('a,button,[data-c]').forEach(el=>{el.addEventListener('mouseenter',on);el.addEventListener('mouseleave',off)})
    bind()
    const ob=new MutationObserver(bind)
    ob.observe(document.body,{childList:true,subtree:true})
    return()=>{cancelAnimationFrame(raf);ob.disconnect()}
  },[])
  return(
    <>
      <style>{`
        .cd{width:5px;height:5px;background:var(--a1);border-radius:50%;position:fixed;pointer-events:none;transform:translate(-50%,-50%);z-index:10000;transition:width .2s,height .2s}
        .cr{width:32px;height:32px;border:1px solid rgba(15,14,12,.22);border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .4s var(--ease),height .4s var(--ease),border-color .3s,background .3s;display:flex;align-items:center;justify-content:center}
        .cl{font-family:'Cinzel',serif;font-size:.4rem;letter-spacing:.18em;color:#fff;text-transform:uppercase;opacity:0;transition:opacity .2s;pointer-events:none;white-space:nowrap}
        [data-cs="h"] .cd{width:3px;height:3px}
        [data-cs="h"] .cr{width:54px;height:54px;border-color:var(--a1);background:rgba(200,144,42,.07)}
        [data-cs="l"] .cd{opacity:0}
        [data-cs="l"] .cr{width:68px;height:68px;background:var(--d0);border-color:var(--d0)}
        [data-cs="l"] .cl{opacity:1}
        @media(pointer:coarse){.cd,.cr{display:none}}
      `}</style>
      <div ref={dot} className="cd"/>
      <div ref={ring} className="cr"><span ref={lbl} className="cl"/></div>
    </>
  )
}

/* ═══════════════════════════════════════
   LOADER — piano keys light-to-dark
═══════════════════════════════════════ */
function Loader({onDone}){
  const [pct,setPct]=useState(0)
  useEffect(()=>{
    let v=0
    const t=setInterval(()=>{
      v+=Math.random()*14+8
      if(v>=100){v=100;clearInterval(t);setTimeout(onDone,700)}
      setPct(Math.round(v))
    },80)
    return()=>clearInterval(t)
  },[])
  const pat=[true,true,false,true,true,true,false]
  const wkeys=[]
  let idx=0
  for(let o=0;o<3;o++){
    pat.forEach(hasB=>{
      const wi=idx++
      wkeys.push(
        <motion.div key={'w'+wi} style={{width:'30px',height:'100px',background:'var(--w0)',border:'1px solid var(--bd)',borderTop:'none',borderRadius:'0 0 3px 3px',position:'relative',flexShrink:0,transition:'background .5s',transitionDelay:wi*.04+'s'}}
          initial={{scaleY:0}} animate={{scaleY:1}} transition={{duration:.4,delay:wi*.04,ease:EZ,transformOrigin:'top'}}>
          {hasB&&<div style={{width:'18px',height:'62px',position:'absolute',top:0,right:'-9px',zIndex:2,background:'var(--d0)',borderRadius:'0 0 3px 3px',boxShadow:'2px 2px 6px rgba(0,0,0,.3)'}}/>}
        </motion.div>
      )
    })
  }
  return(
    <motion.div style={{position:'fixed',inset:0,background:pct>55?'var(--d0)':'var(--w0)',zIndex:9998,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2.8rem',overflow:'hidden',transition:'background .8s ease'}}
      exit={{opacity:0}} transition={{duration:.6,ease:EZ}}>
      <div style={{display:'flex',gap:'2px',position:'relative'}}>{wkeys}</div>
      <motion.div style={{textAlign:'center'}} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.3}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'.52rem',letterSpacing:'.42em',color:pct>55?'var(--a2)':'var(--a1)',textTransform:'uppercase',marginBottom:'.9rem',transition:'color .8s'}}>Soul of Symphony</p>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(2rem,4.5vw,4rem)',fontWeight:300,letterSpacing:'.08em',textTransform:'uppercase',lineHeight:1.05,color:pct>55?'var(--w2)':'var(--d0)',transition:'color .8s'}}>THE PIANO<br/><span style={{color:pct>55?'var(--a2)':'var(--a1)',fontStyle:'italic',transition:'color .8s'}}>CONSERVATOIRE</span></p>
      </motion.div>
      <div style={{width:'240px',height:'1px',background:pct>55?'rgba(255,255,255,.1)':'var(--bd)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,height:'100%',background:'var(--a1)',width:pct+'%',transition:'width .1s linear'}}/>
      </div>
      <p style={{fontFamily:"'DM Mono',monospace",fontSize:'.72rem',color:pct>55?'rgba(255,255,255,.3)':'var(--t3)',letterSpacing:'.12em',transition:'color .8s'}}>
        {pct<100?String(pct).padStart(3,'0'):'READY'}
      </p>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   NAV — white background, sticks on scroll
═══════════════════════════════════════ */
function Nav(){
  const [sc,setSc]=useState(false),[open,setOpen]=useState(false)
  useEffect(()=>{const f=()=>setSc(window.scrollY>60);window.addEventListener('scroll',f,{passive:true});return()=>window.removeEventListener('scroll',f)},[])
  useEffect(()=>{document.body.classList.toggle('locked',open)},[open])
  const links=[['ABOUT','#founder'],['COURSES','#courses'],['FACULTY','#team'],['REELS','#reels'],['FAQ','#faq']]
  return(
    <>
      <style>{`
        nav{position:fixed;top:0;left:0;right:0;z-index:800;padding:1.8rem 5rem;display:flex;align-items:center;justify-content:space-between;transition:all .5s var(--ease);background:transparent}
        nav.sc{background:rgba(250,250,248,.96);backdrop-filter:blur(24px);padding:1rem 5rem;border-bottom:1px solid var(--bd);box-shadow:0 1px 0 var(--bd)}
        .nlo .ns{font-family:'Cinzel',serif;font-size:.42rem;letter-spacing:.32em;color:var(--a1);text-transform:uppercase;display:block;margin-bottom:.12rem}
        .nlo .nn{font-family:'Cinzel',serif;font-size:.72rem;letter-spacing:.16em;color:var(--d0);text-transform:uppercase}
        .nlk{display:flex;gap:3rem;list-style:none}
        .nlk a{font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:.2em;color:var(--t2);text-transform:uppercase;transition:color .3s;position:relative;padding-bottom:.2rem}
        .nlk a::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--d0);transition:width .4s var(--ease)}
        .nlk a:hover{color:var(--d0)}.nlk a:hover::after{width:100%}
        .nbt{font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:.2em;text-transform:uppercase;color:var(--w0);background:var(--d0);padding:.7rem 1.7rem;transition:all .35s var(--ease)}
        .nbt:hover{background:var(--a1);transform:translateY(-2px)}
        .hbtn{display:none;flex-direction:column;gap:5px;padding:6px;z-index:900}
        .hln{display:block;width:22px;height:1px;background:var(--d0);transition:all .4s var(--ease);transform-origin:center}
        .hbtn.op .hln:nth-child(1){transform:translateY(6px) rotate(45deg)}
        .hbtn.op .hln:nth-child(2){opacity:0;transform:scaleX(0)}
        .hbtn.op .hln:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
        .drw{position:fixed;inset:0;z-index:790;background:var(--d0);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem}
        .dl{font-family:'Cinzel',serif;font-size:clamp(1.5rem,7vw,3.2rem);letter-spacing:.12em;font-weight:300;color:rgba(250,250,248,.28);padding:.5rem 0;text-align:center;width:100%;display:block;transition:color .35s;text-transform:uppercase}
        .dl:hover{color:var(--w0)}
        .dbt{margin-top:1.8rem;font-family:'Cinzel',serif;font-size:.56rem;letter-spacing:.24em;text-transform:uppercase;color:var(--d0);background:var(--a2);padding:1rem 3rem;transition:all .35s}
        .dbt:hover{background:var(--a3)}
        .dsoc{display:flex;gap:2rem;margin-top:1.6rem}
        .dsoc a{font-family:'Cinzel',serif;font-size:.46rem;letter-spacing:.18em;color:rgba(250,250,248,.28);text-transform:uppercase;transition:color .3s}
        .dsoc a:hover{color:var(--a2)}
        @media(max-width:1100px){nav{padding:1.1rem 1.8rem}nav.sc{padding:.9rem 1.8rem}.nlk,.nbt{display:none}.hbtn{display:flex}}
        @media(max-width:640px){nav{padding:1rem 1.25rem}}
      `}</style>
      <motion.nav className={sc?'sc':''} initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:EZ}}>
        <a href="#" className="nlo"><span className="ns">EST. 2005 · JAIPUR</span><span className="nn">SOUL OF SYMPHONY</span></a>
        <ul className="nlk">{links.map(([l,h])=><li key={h}><a href={h}>{l}</a></li>)}</ul>
        <a href="#cta" className="nbt">ENROL NOW</a>
        <button className={`hbtn${open?' op':''}`} onClick={()=>setOpen(v=>!v)} aria-label="Menu">
          <span className="hln"/><span className="hln"/><span className="hln"/>
        </button>
      </motion.nav>
      <AnimatePresence>
        {open&&(
          <motion.div className="drw"
            initial={{clipPath:'circle(0% at calc(100% - 2.5rem) 2.5rem)'}}
            animate={{clipPath:'circle(150% at calc(100% - 2.5rem) 2.5rem)',transition:{duration:.55,ease:EZ}}}
            exit={{clipPath:'circle(0% at calc(100% - 2.5rem) 2.5rem)',transition:{duration:.4,ease:EZI}}}>
            {links.map(([l,h],i)=>(
              <motion.a key={h} href={h} className="dl" onClick={()=>setOpen(false)}
                initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:.08+i*.06,ease:EZ}}>{l}</motion.a>
            ))}
            <motion.a href="#cta" className="dbt" onClick={()=>setOpen(false)} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}}>ENROL NOW</motion.a>
            <motion.div className="dsoc" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}>
              <a href="https://www.instagram.com/soulofsymphony/" target="_blank" rel="noreferrer">INSTAGRAM</a>
              <a href="https://www.youtube.com/@soulofsymphony" target="_blank" rel="noreferrer">YOUTUBE</a>
              <a href="mailto:soulofsymphony@gmail.com">EMAIL</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ═══════════════════════════════════════
   HERO — cinematic full-bleed, dark
   (hero stays dark for drama — Cinematic site)
═══════════════════════════════════════ */
function StatNum({end,suf,lbl,dark=true}){
  const ref=useRef(null), inView=useInView(ref,{once:true,amount:.5})
  const [c,setC]=useState(0)
  useEffect(()=>{
    if(!inView)return
    let v=0; const step=end/60
    const t=setInterval(()=>{v=Math.min(v+step,end);setC(Math.round(v));if(v>=end)clearInterval(t)},18)
    return()=>clearInterval(t)
  },[inView,end])
  return(
    <div ref={ref} style={{textAlign:'center',borderRight:`1px solid ${dark?'rgba(255,255,255,.1)':'var(--bd)'}`,padding:'0 clamp(1rem,3vw,2.5rem)'}}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(2rem,4vw,3.5rem)',fontWeight:300,lineHeight:1,color:dark?'var(--w0)':'var(--d0)'}}>{c}{suf}</div>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:'.42rem',letterSpacing:'.2em',color:dark?'rgba(255,255,255,.38)':'var(--t3)',textTransform:'uppercase',marginTop:'.4rem'}}>{lbl}</div>
    </div>
  )
}

function Hero(){
  const {scrollYProgress}=useScroll()
  const imgY=useTransform(scrollYProgress,[0,.4],['0%','18%'])
  const imgOp=useTransform(scrollYProgress,[0,.35],[1,.35])
  return(
    <>
      <style>{`
        #hero{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;background:var(--d0)}
        .hbg{position:absolute;inset:0;z-index:0;overflow:hidden}
        .hbg img{width:100%;height:100%;object-fit:cover;filter:grayscale(35%) contrast(1.1) brightness(.5);display:block}
        .hbg::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,var(--d0) 0%,rgba(15,14,12,.55) 50%,rgba(15,14,12,.18) 100%)}
        .hgrain{position:absolute;inset:0;z-index:1;pointer-events:none;mix-blend-mode:overlay;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='.04'/%3E%3C/svg%3E")}
        .hcnt{position:relative;z-index:2;max-width:1400px;margin:0 auto;width:100%;padding:0 5rem 5rem;display:flex;flex-direction:column}
        .htag{display:flex;align-items:center;gap:.8rem;margin-bottom:2.4rem}
        .htag-l{width:28px;height:1px;background:var(--a2);flex-shrink:0}
        .htag-t{font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:.36em;color:var(--a2);text-transform:uppercase}
        .hwords{margin-bottom:2.5rem}
        .hrow{display:flex;flex-wrap:wrap;gap:.15em;overflow:hidden;line-height:1}
        .hwrd{font-family:'Cinzel',serif;font-size:clamp(3rem,8.5vw,10rem);font-weight:300;color:var(--w0);letter-spacing:.02em;text-transform:uppercase;line-height:.96}
        .hwrd.am{color:var(--a2)}
        .hdesc{display:flex;flex-wrap:wrap;gap:2rem;align-items:flex-start;margin-bottom:3rem}
        .hdl{width:1px;height:80px;background:rgba(255,255,255,.15);flex-shrink:0;margin-top:.4rem;align-self:flex-start}
        .hsub{font-family:'Cormorant Garamond',serif;font-size:clamp(.95rem,1.5vw,1.1rem);font-style:italic;line-height:1.85;color:rgba(255,255,255,.52);max-width:440px;font-weight:300}
        .hbts{display:flex;gap:1.2rem;align-items:center;flex-wrap:wrap;margin-bottom:0}
        .hbs{font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.22em;text-transform:uppercase;color:var(--d0);background:var(--w0);padding:1rem 2.2rem;transition:all .4s var(--ease);display:inline-flex;align-items:center;gap:.6rem}
        .hbs:hover{background:var(--a2);transform:translateY(-3px)}
        .hbo{font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.22em;text-transform:uppercase;color:var(--w0);border:1px solid rgba(255,255,255,.22);padding:1rem 2.2rem;transition:all .4s}
        .hbo:hover{border-color:var(--w0);background:rgba(255,255,255,.07);transform:translateY(-3px)}
        .hstats{display:flex;border-top:1px solid rgba(255,255,255,.1);padding-top:3rem;margin-top:3rem;flex-wrap:wrap;gap:1rem 0}
        .hstats>div:first-child{padding-left:0}
        .hstats>div:last-child{border-right:none}
        .hscrl{position:absolute;bottom:5%;right:5rem;z-index:2;writing-mode:vertical-rl;display:flex;align-items:center;gap:.6rem;opacity:.3}
        .hscrl span{font-family:'Cinzel',serif;font-size:.42rem;letter-spacing:.3em;color:var(--w0);text-transform:uppercase}
        .hscl{width:1px;height:38px;background:linear-gradient(var(--w0),transparent);animation:drip 2s ease-in-out infinite}
        @keyframes drip{0%,100%{opacity:.3;transform:scaleY(.8)}50%{opacity:1;transform:scaleY(1.2)}}
        @media(max-width:1100px){.hcnt{padding:0 2.5rem 4rem}.hscrl{display:none}.hdesc{gap:1.2rem}.hdl{height:50px}}
        @media(max-width:640px){.hcnt{padding:0 1.25rem 3rem}.hbts{flex-direction:column;align-items:stretch}.hbs,.hbo{text-align:center;justify-content:center}.hstats{gap:.5rem 0}}
      `}</style>
      <section id="hero">
        <motion.div className="hbg" style={{y:imgY,opacity:imgOp}}>
          <img src="https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/sir-819x1024.png" alt=""
            loading="eager" onError={e=>{e.target.style.minHeight='100vh';e.target.style.display='none'}}/>
        </motion.div>
        <div className="hgrain"/>
        <div className="hcnt">
          <motion.div className="htag" initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{duration:.8,ease:EZ}}>
            <div className="htag-l"/><span className="htag-t">THE PIANO CONSERVATOIRE · JAIPUR</span>
          </motion.div>
          <div className="hwords">
            {[['WHERE','PASSION'],['BECOMES',{t:'MASTERY.',am:true}]].map((row,ri)=>(
              <div key={ri} className="hrow">
                {row.map((w,wi)=>{
                  const txt=typeof w==='string'?w:w.t
                  const isAm=typeof w==='object'&&w.am
                  return(
                    <div key={wi} style={{overflow:'hidden'}}>
                      <motion.span className={`hwrd${isAm?' am':''}`}
                        initial={{y:'110%'}} animate={{y:'0%'}} transition={{duration:.9,delay:.3+(ri*2+wi)*.14,ease:EZ}}>{txt}</motion.span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <motion.div className="hdesc" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.9,delay:1.1,ease:EZ}}>
            <div className="hdl"/>
            <p className="hsub">North India's premier piano-exclusive conservatoire. Two decades of shaping performers, educators and artists — by the pianist who redefined the craft in Rajasthan.</p>
          </motion.div>
          <motion.div className="hbts" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:1.3,ease:EZ}}>
            <a href="#cta" className="hbs">RESERVE YOUR SEAT →</a>
            <a href="#courses" className="hbo">VIEW COURSES</a>
          </motion.div>
          <motion.div className="hstats" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:1.5,ease:EZ}}>
            <StatNum end={20} suf="+" lbl="Years" dark/>
            <StatNum end={500} suf="+" lbl="Students" dark/>
            <StatNum end={8} suf="" lbl="Grades" dark/>
            <StatNum end={100} suf="%" lbl="Pass Rate" dark/>
          </motion.div>
        </div>
        <div className="hscrl" aria-hidden="true"><div className="hscl"/><span>SCROLL</span></div>
      </section>
    </>
  )
}

/* ═══════════════════════════════════════
   MARQUEE — dual direction cinematic strip
═══════════════════════════════════════ */
function Marquee({items,rev=false,bg='var(--d0)',textColor='var(--w1)',accentColor='var(--a2)',speed=40}){
  const rep=[...items,...items,...items,...items]
  return(
    <div style={{background:bg,padding:'.85rem 0',overflow:'hidden',borderTop:'1px solid rgba(0,0,0,.07)',borderBottom:'1px solid rgba(0,0,0,.07)'}}>
      <style>{`
        @keyframes mf{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes mr{from{transform:translateX(-50%)}to{transform:translateX(0)}}
        .mtrk:hover{animation-play-state:paused}
      `}</style>
      <div className="mtrk" style={{display:'inline-flex',whiteSpace:'nowrap',animation:`${rev?'mr':'mf'} ${speed}s linear infinite`}}>
        {rep.map((item,i)=>(
          <span key={i}>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:'.54rem',letterSpacing:'.26em',color:textColor,textTransform:'uppercase',padding:'0 1.8rem',opacity:.8}}>{item}</span>
            <span style={{color:accentColor,fontSize:'.6rem',opacity:.6}}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   FOUNDER — WHITE bg, cinematic split
═══════════════════════════════════════ */
function Founder(){
  return(
    <>
      <style>{`
        #founder{background:var(--w0);padding:clamp(5rem,10vw,12rem) 0;position:relative;overflow:hidden}
        .fg{max-width:1400px;margin:0 auto;padding:0 5rem;display:grid;grid-template-columns:1fr 1fr;gap:clamp(3rem,8vw,10rem);align-items:center}
        .fi{position:relative}
        .fi-bg{position:absolute;font-family:'Cinzel',serif;font-size:clamp(8rem,22vw,28rem);font-weight:300;color:rgba(15,14,12,.025);right:-3%;bottom:-5%;line-height:.9;pointer-events:none;user-select:none;letter-spacing:-.04em;z-index:0}
        .fiw{position:relative;overflow:hidden;z-index:1}
        .fiw img{width:100%;display:block;filter:grayscale(8%) contrast(1.05);transition:transform .9s var(--ease)}
        .fiw:hover img{transform:scale(1.04)}
        .fiw::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(15,14,12,.65) 0%,transparent 55%)}
        .fi-fr{position:absolute;top:-1.2rem;left:-1.2rem;right:1.2rem;bottom:1.2rem;border:1px solid var(--bd2);pointer-events:none;z-index:-1;transition:all .6s var(--ease)}
        .fi:hover .fi-fr{top:-1.8rem;left:-1.8rem;right:1.8rem;bottom:1.8rem}
        .fi-qt{position:absolute;bottom:0;left:0;right:0;padding:2rem;z-index:2}
        .fi-qt p{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-style:italic;color:rgba(250,250,248,.85);line-height:1.75;margin-bottom:.35rem}
        .fi-qt cite{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.2em;color:var(--a2);text-transform:uppercase;font-style:normal}
        .fh{font-family:'Cinzel',serif;font-size:clamp(2.5rem,5vw,5.5rem);font-weight:300;letter-spacing:.06em;text-transform:uppercase;line-height:.96;color:var(--d0);margin-bottom:.8rem}
        .fh span{color:var(--a1)}
        .frl{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.1em;color:var(--t3);margin-bottom:2.2rem;text-transform:uppercase}
        .fp{font-family:'Cormorant Garamond',serif;font-size:clamp(.9rem,1.3vw,1rem);line-height:2.05;color:var(--t2);margin-bottom:.9rem;font-weight:300}
        .fdiv{height:1px;background:var(--bd);margin:2.2rem 0}
        .fbadges{display:flex;flex-wrap:wrap;gap:.6rem}
        .fbdg{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.12em;text-transform:uppercase;color:var(--t2);border:1px solid var(--bd2);padding:.42rem .9rem;transition:all .35s var(--ease)}
        .fbdg:hover{color:var(--a1);border-color:var(--a1);background:rgba(200,144,42,.06);transform:translateY(-2px)}
        @media(max-width:1100px){.fg{grid-template-columns:1fr;gap:3rem;padding:0 2.5rem}.fi{max-width:520px;margin:0 auto}.fi-bg{font-size:8rem}}
        @media(max-width:640px){.fg{padding:0 1.25rem}#founder{padding:5rem 0}}
      `}</style>
      <section id="founder">
        <div className="fg">
          <motion.div className="fi" {...up(0,60)}>
            <div className="fi-bg">01</div>
            <div className="fi-fr"/>
            <div className="fiw">
              <img src="https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/sir-1-1024x1024.png"
                alt="Pradeep Chaturvedi" loading="lazy"
                onError={e=>{e.target.parentElement.style.minHeight='480px';e.target.parentElement.style.background='var(--w3)';e.target.style.display='none'}}/>
              <div className="fi-qt">
                <p>"Music is not a pastime. It is a discipline, a language, a life."</p>
                <cite>— Pradeep Chaturvedi</cite>
              </div>
            </div>
          </motion.div>
          <div>
            <SLabel text="The Maestro"/>
            <motion.h2 className="fh" {...up(.12,50)}>PRADEEP<br/><span>CHATURVEDI</span></motion.h2>
            <motion.p className="frl" {...up(.18,18,.7)}>PIANIST · EDUCATOR · TRINITY COLLEGE LONDON</motion.p>
            {['Widely acknowledged as the pioneer of Western classical piano education in Rajasthan, Pradeep Chaturvedi has spent over two decades building the most respected piano conservatoire in North India.',
              'As the authorised regional representative of Trinity College London, he holds the unique distinction of conducting internationally recognised graded examinations in Jaipur.',
              'His students have achieved national ranks, performed at international stages, and gained admission to premier music institutions across three continents.',
            ].map((p,i)=><motion.p key={i} className="fp" {...up(.24+i*.1,18,.8)}>{p}</motion.p>)}
            <motion.div className="fdiv" initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true}} transition={{duration:.9,delay:.5,ease:EZ}} style={{transformOrigin:'left'}}/>
            <motion.div className="fbadges" {...up(.56,14,.8)}>
              {['Trinity Affiliate','Rock & Pop','Alfred Method','20+ Years','North India Pioneer'].map(b=><span key={b} className="fbdg">{b}</span>)}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════════════
   ENDORSEMENTS — light warm bg
═══════════════════════════════════════ */
function Endorsements(){
  return(
    <>
      <style>{`
        #endorse{background:var(--w2);padding:clamp(5rem,10vw,10rem) 0;position:relative}
        #endorse::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),transparent)}
        .en{max-width:1400px;margin:0 auto;padding:0 5rem}
        .enh2{font-family:'Cinzel',serif;font-size:clamp(2rem,4.5vw,4.5rem);font-weight:300;letter-spacing:.06em;text-transform:uppercase;line-height:1;color:var(--d0);margin-bottom:.8rem}
        .enh2 span{color:var(--a1)}
        .eng{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:3.5rem}
        .enc{background:var(--w0);border:1px solid var(--bd);padding:3rem;position:relative;overflow:hidden;transition:all .4s var(--ease)}
        .enc::before{content:'';position:absolute;top:0;left:0;width:0;height:3px;background:var(--a1);transition:width .6s var(--ease)}
        .enc:hover{border-color:var(--bd2);transform:translateY(-6px);box-shadow:0 20px 60px rgba(15,14,12,.08)}
        .enc:hover::before{width:100%}
        .eci{font-size:1.8rem;margin-bottom:1.6rem;display:block}
        .enn{font-family:'Cinzel',serif;font-size:clamp(.9rem,1.6vw,1.15rem);font-weight:300;letter-spacing:.08em;text-transform:uppercase;color:var(--d0);margin-bottom:.3rem}
        .enr{font-family:'DM Mono',monospace;font-size:.56rem;letter-spacing:.1em;color:var(--a1);text-transform:uppercase;margin-bottom:1.6rem}
        .ent{font-family:'Cormorant Garamond',serif;font-size:clamp(.9rem,1.3vw,1.02rem);color:var(--t2);line-height:2;font-weight:300}
        @media(max-width:1100px){.en{padding:0 2.5rem}.eng{grid-template-columns:1fr}}
        @media(max-width:640px){.en{padding:0 1.25rem}#endorse{padding:5rem 0}.enc{padding:2rem}}
      `}</style>
      <section id="endorse">
        <div className="en">
          <SLabel text="Endorsed By"/>
          <motion.h2 className="enh2" {...up(.1,50)}>WHEN INDIA'S GREATEST<br/><span>VOICES SPEAK</span> OF ONE SCHOOL.</motion.h2>
          <div className="eng">
            {[{i:'♩',n:'Gajendra Verma',r:'Playback Singer · Composer',t:"India's chart-topping Hindi singer endorses Soul of Symphony as one of the nation's finest piano institutions — praising its conservatoire-grade discipline and transformative approach to musical formation."},
              {i:'♪',n:'Ravindra Upadhyay',r:'Playback Singer · Music Director',t:'Ravindra Upadhyay personally attests to the rigour, artistry and musical culture cultivated here — noting its pivotal role in shaping professional-grade musicians across North India.'},
            ].map((e,i)=>(
              <motion.div key={i} className="enc" {...up(.2+i*.12,40)}>
                <span className="eci">{e.i}</span>
                <div className="enn">{e.n}</div>
                <div className="enr">{e.r}</div>
                <div className="ent">{e.t}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════════════
   COURSES — white bg, clean editorial
═══════════════════════════════════════ */
function Courses(){
  const [hov,setHov]=useState(null)
  return(
    <>
      <style>{`
        #courses{background:var(--w0);padding:clamp(5rem,10vw,12rem) 0;position:relative}
        #courses::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),transparent)}
        .co{max-width:1400px;margin:0 auto;padding:0 5rem}
        .coh{display:grid;grid-template-columns:1.1fr 1fr;gap:4rem;align-items:end;margin-bottom:4rem}
        .coh h2{font-family:'Cinzel',serif;font-size:clamp(2.2rem,5vw,5rem);font-weight:300;letter-spacing:.06em;text-transform:uppercase;line-height:.97;color:var(--d0)}
        .coh h2 span{color:var(--a1)}
        .coh p{font-family:'Cormorant Garamond',serif;font-size:clamp(.9rem,1.3vw,1.02rem);color:var(--t2);line-height:2;font-weight:300}
        .cgrd{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--bd);border-right:none}
        .cc{border-right:1px solid var(--bd);padding:2.5rem 2rem;position:relative;overflow:hidden;cursor:pointer;transition:background .4s var(--ease)}
        .cc:hover{background:var(--d0)}
        .cc-slide{position:absolute;inset:0;background:var(--d0);transform:translateY(101%);transition:transform .55s var(--ease);z-index:0}
        .cc:hover .cc-slide{transform:translateY(0)}
        .cc-hot{position:absolute;top:0;right:0;font-family:'Cinzel',serif;font-size:.4rem;letter-spacing:.14em;color:var(--w0);background:var(--a1);padding:.3rem .85rem;text-transform:uppercase;z-index:3}
        .cc-n{position:relative;z-index:1;font-family:'Cinzel',serif;font-size:.46rem;letter-spacing:.26em;color:var(--t4);text-transform:uppercase;margin-bottom:1.8rem;transition:color .3s}
        .cc:hover .cc-n{color:rgba(255,255,255,.2)}
        .cc-nm{position:relative;z-index:1;font-family:'Cinzel',serif;font-size:clamp(1.05rem,1.8vw,1.45rem);font-weight:300;letter-spacing:.08em;text-transform:uppercase;color:var(--d0);line-height:1.15;margin-bottom:.3rem;transition:color .35s}
        .cc:hover .cc-nm{color:var(--w0)}
        .cc-sub{position:relative;z-index:1;font-family:'DM Mono',monospace;font-size:.54rem;letter-spacing:.1em;color:var(--a1);text-transform:uppercase;margin-bottom:.3rem;transition:color .35s}
        .cc:hover .cc-sub{color:var(--a2)}
        .cc-age{position:relative;z-index:1;font-size:.72rem;color:var(--t3);margin-bottom:1.4rem;transition:color .35s}
        .cc:hover .cc-age{color:rgba(255,255,255,.3)}
        .cc-div{height:1px;background:var(--bd);margin:1.2rem 0;position:relative;z-index:1;transition:background .35s}
        .cc:hover .cc-div{background:rgba(255,255,255,.08)}
        .cc-feat{list-style:none;position:relative;z-index:1}
        .cc-feat li{font-family:'Cormorant Garamond',serif;font-size:clamp(.78rem,1.1vw,.88rem);color:var(--t2);padding:.28rem 0;display:flex;gap:.5rem;line-height:1.5;transition:color .35s}
        .cc:hover .cc-feat li{color:rgba(255,255,255,.38)}
        .cc-feat li span{color:var(--a1);font-size:.7rem;flex-shrink:0;transition:color .35s}
        .cc:hover .cc-feat li span{color:var(--a2)}
        .cc-price{display:flex;align-items:baseline;gap:.35rem;margin-top:1.8rem;padding-top:1.2rem;border-top:1px solid var(--bd);position:relative;z-index:1;transition:border-color .35s}
        .cc:hover .cc-price{border-color:rgba(255,255,255,.08)}
        .cc-p{font-family:'Cormorant Garamond',serif;font-size:1.9rem;font-weight:300;color:var(--a1);transition:color .35s}
        .cc:hover .cc-p{color:var(--a2)}
        .cc-ps{font-size:.72rem;color:var(--t3);transition:color .35s}
        .cc:hover .cc-ps{color:rgba(255,255,255,.3)}
        @media(max-width:1100px){.co{padding:0 2.5rem}.cgrd{grid-template-columns:repeat(2,1fr)}.coh{grid-template-columns:1fr;gap:1.5rem}}
        @media(max-width:640px){.co{padding:0 1.25rem}#courses{padding:5rem 0}.cgrd{grid-template-columns:1fr;border-right:1px solid var(--bd)}.cc{border-right:none;border-bottom:1px solid var(--bd)}}
      `}</style>
      <section id="courses">
        <div className="co">
          <div className="coh">
            <div>
              <SLabel text="The Curriculum"/>
              <motion.h2 {...up(.1,50)}>A PATH FOR<br/>EVERY <span>ASPIRATION.</span></motion.h2>
            </div>
            <motion.p {...up(.15,28,.8)}>Every programme is structured around the Trinity College London graded syllabus — international standards, delivered with the care of a family institution.</motion.p>
          </div>
          <div className="cgrd">
            {COURSES.map((c,i)=>(
              <motion.div key={i} className="cc" data-c={c.hot?'PREMIER':'ENROL'} {...up(.15+i*.09,40)}>
                {c.hot&&<div className="cc-hot">MOST POPULAR</div>}
                <div className="cc-slide"/>
                <div className="cc-n">{c.n}</div>
                <div className="cc-nm">{c.name}</div>
                <div className="cc-sub">{c.sub}</div>
                <div className="cc-age">{c.note}</div>
                <div className="cc-div"/>
                <ul className="cc-feat">{c.feat.map(f=><li key={f}><span>—</span>{f}</li>)}</ul>
                <div className="cc-price"><span className="cc-p">{c.price}</span><span className="cc-ps">/class</span></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════════════
   PIANO KEYS — white keys + dark keys
═══════════════════════════════════════ */
function PianoKeys(){
  const [hov,setHov]=useState(null)
  const pat=[true,true,false,true,true,true,false]
  const wkeys=[]
  let idx=0
  for(let o=0;o<3;o++){
    pat.forEach(hasB=>{
      const wi=idx++
      const isWHov=hov===('w'+wi), isBHov=hov===('b'+wi)
      wkeys.push(
        <div key={'w'+wi} style={{width:'clamp(28px,3.5vw,38px)',height:'clamp(90px,11vw,120px)',
          border:'1px solid rgba(15,14,12,.15)',borderTop:'none',borderRadius:'0 0 3px 3px',position:'relative',flexShrink:0,cursor:'pointer',
          background:isWHov?'linear-gradient(180deg,var(--a3),var(--a2))':'linear-gradient(180deg,#FCFBF8,#EDE8DF)',
          boxShadow:isWHov?'0 4px 20px rgba(200,144,42,.35)':'0 2px 6px rgba(0,0,0,.08)',
          transition:'background .18s,box-shadow .18s'}}
          onMouseEnter={()=>setHov('w'+wi)} onMouseLeave={()=>setHov(null)}>
          {hasB&&(
            <div style={{width:'63%',height:'60%',position:'absolute',top:0,right:'-31.5%',zIndex:3,borderRadius:'0 0 4px 4px',cursor:'pointer',
              background:isBHov?'linear-gradient(180deg,var(--f1),var(--f0))':'var(--d0)',
              boxShadow:isBHov?'0 4px 20px rgba(122,24,40,.5)':'0 3px 10px rgba(0,0,0,.4)',
              transition:'background .18s,box-shadow .18s'}}
              onMouseEnter={e=>{e.stopPropagation();setHov('b'+wi)}} onMouseLeave={()=>setHov(null)}/>
          )}
        </div>
      )
    })
  }
  return(
    <div style={{background:'var(--w3)',padding:'clamp(2rem,4vw,4rem) 0',display:'flex',justifyContent:'center',
      borderTop:'1px solid var(--bd)',borderBottom:'1px solid var(--bd)',position:'relative',overflow:'hidden'}} aria-hidden="true">
      <div style={{display:'flex',position:'relative',boxShadow:'0 16px 60px rgba(0,0,0,.12)'}}>{wkeys}</div>
    </div>
  )
}

/* ═══════════════════════════════════════
   TEAM — white bg, portrait cards
═══════════════════════════════════════ */
function Team(){
  return(
    <>
      <style>{`
        #team{background:var(--w1);padding:clamp(5rem,10vw,12rem) 0;position:relative}
        #team::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),transparent)}
        .te{max-width:1400px;margin:0 auto;padding:0 5rem}
        .teg{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--bd);margin-top:4rem}
        .tec{background:var(--w0);position:relative;overflow:hidden;cursor:pointer;transition:background .4s var(--ease)}
        .tec:hover{background:var(--w2)}
        .tei{aspect-ratio:3/4;overflow:hidden;position:relative}
        .tei img{width:100%;height:100%;object-fit:cover;filter:grayscale(12%) contrast(1.04);transition:transform .9s var(--ease)}
        .tec:hover .tei img{transform:scale(1.06)}
        .tei::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(15,14,12,.8) 0%,rgba(15,14,12,.05) 55%,transparent 100%)}
        .tein{position:absolute;bottom:0;left:0;right:0;padding:2rem;z-index:2}
        .tenote{font-family:'DM Mono',monospace;font-size:.5rem;letter-spacing:.1em;color:var(--a2);text-transform:uppercase;margin-bottom:.45rem;display:flex;align-items:center;gap:.5rem}
        .tenote::before{content:'';display:block;width:12px;height:1px;background:var(--a2);flex-shrink:0}
        .ten{font-family:'Cinzel',serif;font-size:clamp(.95rem,1.8vw,1.25rem);font-weight:300;letter-spacing:.08em;text-transform:uppercase;color:var(--w0);line-height:1.2}
        .ter{font-size:.72rem;color:rgba(255,255,255,.4);margin-top:.2rem;letter-spacing:.02em;font-family:'Cormorant Garamond',serif;font-style:italic}
        .teov{position:absolute;inset:0;background:rgba(15,14,12,.9);display:flex;align-items:center;justify-content:center;padding:2.5rem;opacity:0;transform:translateY(16px);transition:opacity .4s var(--ease),transform .4s var(--ease);z-index:3}
        .tec:hover .teov{opacity:1;transform:translateY(0)}
        .teq{font-family:'Cormorant Garamond',serif;font-size:clamp(1rem,1.6vw,1.2rem);font-style:italic;color:var(--w0);line-height:1.75;margin-bottom:1.4rem;text-align:center}
        .ten2{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.2em;text-transform:uppercase;text-align:center;color:var(--a2)}
        @media(max-width:1100px){.te{padding:0 2.5rem}.teg{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.te{padding:0 1.25rem}#team{padding:5rem 0}.teg{grid-template-columns:1fr}.tei{aspect-ratio:16/9}}
      `}</style>
      <section id="team">
        <div className="te">
          <SLabel text="The Faculty"/>
          <motion.h2 style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(2.2rem,5vw,5rem)',fontWeight:300,letterSpacing:'.06em',textTransform:'uppercase',lineHeight:.97,color:'var(--d0)'}} {...up(.1,50)}>
            TAUGHT BY <span style={{color:'var(--a1)'}}>MASTERS.</span><br/>MENTORED WITH HEART.
          </motion.h2>
          <div className="teg">
            {TEAM.map((m,i)=>(
              <motion.div key={i} className="tec" data-c="VIEW" {...up(.15+i*.12,50)}>
                <div className="tei">
                  <img src={m.img} alt={m.name} loading="lazy" onError={e=>{e.target.style.display='none'}}/>
                </div>
                <div className="tein">
                  <div className="tenote">{m.note}</div>
                  <div className="ten">{m.name}</div>
                  <div className="ter">{m.role}</div>
                </div>
                <div className="teov">
                  <div><div className="teq">"{m.q}"</div><div className="ten2">{m.name}</div></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════════════
   REELS — dark section for contrast
═══════════════════════════════════════ */
function ReelCard({r,i}){
  const [playing,setPlaying]=useState(false),[err,setErr]=useState(false)
  const vid=useRef(null)
  const toggle=()=>{
    if(!vid.current||err)return
    if(vid.current.paused){vid.current.play();setPlaying(true)}
    else{vid.current.pause();setPlaying(false)}
  }
  return(
    <motion.div style={{position:'relative',overflow:'hidden',aspectRatio:'9/16',background:'var(--d2)',cursor:'pointer',
      border:'1px solid rgba(255,255,255,.07)',transition:'all .4s var(--ease)'}}
      whileHover={{scale:1.02,y:-5,borderColor:'rgba(200,144,42,.35)',boxShadow:'0 28px 72px rgba(0,0,0,.5)'}}
      onClick={toggle} data-c={playing?'PAUSE':'PLAY'} {...up(.1+i*.09,50)}>
      {err
        ?<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--d2)',color:'var(--t3)',fontFamily:"'Cinzel',serif",fontSize:'.46rem',letterSpacing:'.18em'}}>NO PREVIEW</div>
        :<video ref={vid} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',pointerEvents:'none'}}
          autoPlay muted loop playsInline preload="metadata" src={r.src} onError={()=>setErr(true)}/>
      }
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(15,14,12,.92) 0%,rgba(15,14,12,.08) 55%,transparent 100%)'}}/>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
        width:'50px',height:'50px',border:`1px solid ${playing?'var(--a2)':'rgba(255,255,255,.3)'}`,
        display:'flex',alignItems:'center',justifyContent:'center',
        background:playing?'rgba(200,144,42,.2)':'rgba(15,14,12,.3)',backdropFilter:'blur(6px)',
        borderRadius:'50%',transition:'all .35s',zIndex:2}}>
        <span style={{fontSize:playing?'.6rem':'.75rem',color:'var(--w0)',marginLeft:playing?0:'2px'}}>{playing?'❚❚':'▶'}</span>
      </div>
      <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'1.3rem 1.1rem',zIndex:2}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:'.5rem',letterSpacing:'.1em',color:'var(--a2)',textTransform:'uppercase',marginBottom:'.4rem'}}>{r.title}</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'.95rem',fontStyle:'italic',color:'rgba(255,255,255,.55)',lineHeight:1.4}}>{r.sub}</div>
      </div>
    </motion.div>
  )
}

function Reels(){
  return(
    <>
      <style>{`
        #reels{background:var(--d1);padding:clamp(5rem,10vw,12rem) 0;position:relative;overflow:hidden}
        #reels::before{content:'';position:absolute;inset:0;pointer-events:none;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='.04'/%3E%3C/svg%3E")}
        .ri{max-width:1400px;margin:0 auto;padding:0 5rem;position:relative;z-index:1}
        .rih{display:grid;grid-template-columns:1fr auto;align-items:flex-end;gap:2rem;margin-bottom:4rem}
        .rih h2{font-family:'Cinzel',serif;font-size:clamp(2.2rem,5vw,5rem);font-weight:300;letter-spacing:.06em;text-transform:uppercase;line-height:.97;color:var(--w0)}
        .rih h2 span{color:var(--a2)}
        .rfol{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.22em;text-transform:uppercase;color:var(--d0);background:var(--a2);padding:.85rem 1.7rem;white-space:nowrap;transition:all .35s var(--ease);display:inline-flex;align-items:center;gap:.6rem;align-self:flex-start}
        .rfol:hover{background:var(--a3);transform:translateY(-2px)}
        .rgd{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem}
        @media(max-width:1100px){.ri{padding:0 2.5rem}.rih{grid-template-columns:1fr;gap:1.5rem}.rgd{grid-template-columns:repeat(2,1fr);gap:1rem}}
        @media(max-width:640px){.ri{padding:0 1.25rem}#reels{padding:5rem 0}.rgd{grid-template-columns:repeat(2,1fr);gap:.7rem}}
        @media(max-width:380px){.rgd{grid-template-columns:1fr}}
      `}</style>
      <section id="reels">
        <div className="ri">
          <div className="rih">
            <div>
              <SLabel text="On Instagram" dark/>
              <motion.h2 {...up(.1,50)}>MOMENTS OF <span>MUSIC</span>,<br/>SHARED WITH THE WORLD.</motion.h2>
              <motion.p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(.9rem,1.3vw,1.05rem)',color:'rgba(255,255,255,.42)',lineHeight:2,maxWidth:'440px',marginTop:'.8rem',fontStyle:'italic'}} {...up(.2,18,.8)}>
                Watch our students perform, grow and inspire. Follow <strong style={{color:'var(--a2)',fontStyle:'normal'}}>@soulofsymphony</strong>
              </motion.p>
            </div>
            <motion.a href="https://www.instagram.com/soulofsymphony/" target="_blank" rel="noreferrer" className="rfol" {...up(.25,18,.8)}>◎ FOLLOW</motion.a>
          </div>
          <div className="rgd">{REELS.map((r,i)=><ReelCard key={i} r={r} i={i}/>)}</div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════════════
   TESTIMONIALS — light bg
═══════════════════════════════════════ */
function Testimonials(){
  const items=[
    {t:'"Soul of Symphony transformed my understanding of music. The mentorship and discipline here are unmatched anywhere in India."',a:'Vivasvat Devanampriya'},
    {t:'"The teachers are highly skilled and genuinely patient. The curriculum is structured, deep, and truly inspiring."',a:'Siddhi Agrawal'},
    {t:'"This institute does not just teach piano — it instils life lessons, confidence and a rare sense of character."',a:'Shreya Jain'},
    {t:'"A truly professional conservatoire with international standards. My son now performs at national events."',a:'Vishal Mathur'},
  ]
  return(
    <>
      <style>{`
        #testi{background:var(--w2);padding:clamp(5rem,10vw,12rem) 0;position:relative}
        #testi::before{content:'\\201C';position:absolute;left:2%;top:0;font-family:'Cormorant Garamond',serif;font-size:clamp(14rem,28vw,32rem);line-height:.85;color:rgba(15,14,12,.04);pointer-events:none;user-select:none}
        .ti{max-width:1400px;margin:0 auto;padding:0 5rem;position:relative;z-index:1}
        .tig{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--bd);margin-top:4rem}
        .tic{background:var(--w1);padding:3rem;position:relative;transition:all .4s var(--ease)}
        .tic::before{content:'';position:absolute;top:0;left:0;height:3px;width:0;background:var(--a1);transition:width .6s var(--ease)}
        .tic:hover{background:var(--w0);transform:translateY(-5px);box-shadow:0 18px 52px rgba(15,14,12,.08)}
        .tic:hover::before{width:100%}
        .tist{color:var(--a1);font-size:.9rem;letter-spacing:.1em;margin-bottom:1.5rem}
        .titx{font-family:'Cormorant Garamond',serif;font-size:clamp(.95rem,1.5vw,1.1rem);font-style:italic;color:var(--t1);line-height:1.9;margin-bottom:1.6rem;font-weight:300}
        .tiau{font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:.2em;text-transform:uppercase;color:var(--a1)}
        @media(max-width:1100px){.ti{padding:0 2.5rem}}
        @media(max-width:640px){.ti{padding:0 1.25rem}#testi{padding:5rem 0}.tig{grid-template-columns:1fr}.tic{padding:2rem}}
      `}</style>
      <section id="testi">
        <div className="ti">
          <SLabel text="What They Say"/>
          <motion.h2 style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(2.2rem,5vw,5rem)',fontWeight:300,letterSpacing:'.06em',textTransform:'uppercase',lineHeight:.97,color:'var(--d0)'}} {...up(.1,50)}>
            VOICES OF <span style={{color:'var(--a1)'}}>DISTINCTION.</span>
          </motion.h2>
          <div className="tig">
            {items.map((t,i)=>(
              <motion.div key={i} className="tic" {...up(.15+i*.1,40)}>
                <div className="tist">★★★★★</div>
                <div className="titx">{t.t}</div>
                <div className="tiau">— {t.a}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════════════
   FAQ — white bg, clean Ayana accordion
═══════════════════════════════════════ */
function FAQ(){
  const [open,setOpen]=useState(null)
  return(
    <>
      <style>{`
        #faq{background:var(--w0);padding:clamp(5rem,10vw,12rem) 0;position:relative}
        #faq::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),transparent)}
        .fq{max-width:1400px;margin:0 auto;padding:0 5rem;display:grid;grid-template-columns:1fr 1.6fr;gap:clamp(3rem,8vw,10rem);align-items:start}
        .fqlh{font-family:'Cinzel',serif;font-size:clamp(2rem,4vw,4rem);font-weight:300;letter-spacing:.06em;text-transform:uppercase;line-height:.97;color:var(--d0);margin:.5rem 0 1.4rem}
        .fqlh span{color:var(--a1)}
        .fqlp{font-family:'Cormorant Garamond',serif;font-size:clamp(.9rem,1.3vw,1.02rem);color:var(--t2);line-height:2;margin-bottom:2rem;font-style:italic;font-weight:300}
        .fqla{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.2em;text-transform:uppercase;color:var(--a1);border-bottom:1px solid rgba(200,144,42,.3);padding-bottom:.2rem;display:inline-block;transition:all .3s}
        .fqla:hover{letter-spacing:.28em;border-color:var(--a1)}
        .fqit{border-bottom:1px solid var(--bd);overflow:hidden}
        .fqbt{width:100%;text-align:left;background:none;padding:1.7rem 0;display:flex;justify-content:space-between;align-items:center;gap:1rem;font-family:'Cormorant Garamond',serif;font-size:clamp(.95rem,1.5vw,1.08rem);color:var(--t1);line-height:1.5;cursor:pointer;transition:color .3s}
        .fqbt:hover{color:var(--d0)}
        .fqic{width:28px;height:28px;border:1px solid var(--bd2);display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:.8rem;flex-shrink:0;transition:all .35s var(--ease)}
        .fqit.op .fqic{background:var(--a1);border-color:var(--a1);color:#fff;transform:rotate(45deg)}
        .fqan{font-family:'Cormorant Garamond',serif;font-size:clamp(.88rem,1.2vw,.98rem);color:var(--t2);line-height:2.1;overflow:hidden;font-style:italic;font-weight:300}
        .fqit.op .fqan{padding-bottom:1.6rem}
        @media(max-width:1100px){.fq{grid-template-columns:1fr;gap:3rem;padding:0 2.5rem}}
        @media(max-width:640px){.fq{padding:0 1.25rem}#faq{padding:5rem 0}.fqbt{font-size:.9rem;padding:1.3rem 0}}
      `}</style>
      <section id="faq">
        <div className="fq">
          <div>
            <SLabel text="Questions"/>
            <h2 className="fqlh">FREQUENTLY<br/><span>ASKED.</span></h2>
            <p className="fqlp">Not finding your answer? We are happy to speak with you personally about your musical journey.</p>
            <a href="#cta" className="fqla">CONTACT US DIRECTLY →</a>
          </div>
          <motion.div {...up(.15,36,.9)}>
            {FAQS.map((f,i)=>(
              <div key={i} className={`fqit${open===i?' op':''}`}>
                <button className="fqbt" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}>
                  {f.q}<span className="fqic">+</span>
                </button>
                <AnimatePresence initial={false}>
                  {open===i&&(
                    <motion.div className="fqan"
                      initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                      transition={{duration:.42,ease:EZ}}>{f.a}</motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════════════
   CTA — light bg with dark form panel
═══════════════════════════════════════ */
function CTA(){
  const [sent,setSent]=useState(false)
  return(
    <>
      <style>{`
        #cta{background:var(--w1);padding:clamp(5rem,10vw,12rem) 0;position:relative}
        #cta::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),transparent)}
        .ct{max-width:1400px;margin:0 auto;padding:0 5rem;display:grid;grid-template-columns:1fr 1fr;gap:clamp(3rem,7vw,8rem);align-items:start}
        .cth{font-family:'Cinzel',serif;font-size:clamp(2.2rem,5vw,5rem);font-weight:300;letter-spacing:.06em;text-transform:uppercase;line-height:.97;color:var(--d0);margin:.5rem 0 1.5rem}
        .cth span{color:var(--a1)}
        .ctp{font-family:'Cormorant Garamond',serif;font-size:clamp(.9rem,1.3vw,1.02rem);color:var(--t2);line-height:2;margin-bottom:2.8rem;font-style:italic;font-weight:300}
        .crow{display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.2rem;border:1px solid var(--bd);margin-bottom:.6rem;transition:all .4s var(--ease);background:var(--w0)}
        .crow:hover{border-color:var(--a1);background:rgba(200,144,42,.04);transform:translateX(7px)}
        .croi{font-size:.9rem;flex-shrink:0;margin-top:.05rem}
        .crot strong{display:block;font-family:'Cinzel',serif;font-size:.46rem;letter-spacing:.16em;color:var(--a1);text-transform:uppercase;font-weight:400;margin-bottom:.18rem}
        .crot span{font-family:'Cormorant Garamond',serif;font-size:clamp(.82rem,1.1vw,.9rem);color:var(--t2)}
        .cform{background:var(--d0);padding:3rem}
        .cft{font-family:'Cinzel',serif;font-size:clamp(1.2rem,2vw,1.75rem);font-weight:300;letter-spacing:.1em;text-transform:uppercase;color:var(--w0);margin-bottom:.3rem}
        .cfs{font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.08em;color:rgba(255,255,255,.28);margin-bottom:2.2rem;text-transform:uppercase}
        .cfr{margin-bottom:1rem}
        .cfl{display:block;font-family:'Cinzel',serif;font-size:.42rem;letter-spacing:.22em;color:rgba(255,255,255,.3);text-transform:uppercase;margin-bottom:.42rem}
        .cfin,.cfse{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:var(--w0);font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:300;padding:.82rem 1rem;outline:none;transition:all .3s;appearance:none;border-radius:0}
        .cfin::placeholder{color:rgba(255,255,255,.2)}.cfin:focus,.cfse:focus{border-color:var(--a2);background:rgba(200,144,42,.06)}
        .cfse{cursor:pointer;color:rgba(255,255,255,.4)}.cfse option{background:var(--d1);color:var(--w0)}
        .cfbtn{width:100%;font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.24em;text-transform:uppercase;color:var(--d0);background:var(--w0);padding:1.15rem;border:none;cursor:pointer;transition:all .4s var(--ease);margin-top:.5rem}
        .cfbtn:hover{background:var(--a2);transform:translateY(-2px)}
        .cfbtn.sent{background:var(--a2)!important;transform:none!important;cursor:default}
        @media(max-width:1100px){.ct{grid-template-columns:1fr;gap:3rem;padding:0 2.5rem}}
        @media(max-width:640px){.ct{padding:0 1.25rem}#cta{padding:5rem 0}.cform{padding:2rem 1.5rem}}
      `}</style>
      <section id="cta">
        <div className="ct">
          <div>
            <SLabel text="Begin Your Journey"/>
            <motion.h2 className="cth" {...up(.1,50)}>RESERVE YOUR<br/><span>PLACE TODAY.</span></motion.h2>
            <motion.p className="ctp" {...up(.2,18,.8)}>Seats at Soul of Symphony are limited and filled by students who are serious about their musical development. We invite you to take the first step.</motion.p>
            {[{i:'📞',l:'PHONE',v:'+91 98291 53063  ·  +91 97859 08037'},
              {i:'✉',l:'EMAIL',v:'soulofsymphony@gmail.com'},
              {i:'📍',l:'STUDIO',v:'121 Mohan Nagar, Gopalpura Bypass, Jaipur 302018'},
              {i:'🌐',l:'INTERNATIONAL',v:'+44 7587 838258'},
            ].map((r,i)=>(
              <motion.div key={i} className="crow" {...up(.3+i*.08,16,.8)}>
                <span className="croi">{r.i}</span>
                <div className="crot"><strong>{r.l}</strong><span>{r.v}</span></div>
              </motion.div>
            ))}
          </div>
          <motion.div className="cform" {...up(.25,45,1)}>
            <div className="cft">ENQUIRE TODAY</div>
            <div className="cfs">WE RESPOND WITHIN 24 HOURS</div>
            <div className="cfr"><label className="cfl">FULL NAME</label><input className="cfin" type="text" placeholder="Your full name"/></div>
            <div className="cfr"><label className="cfl">EMAIL</label><input className="cfin" type="email" placeholder="your@email.com"/></div>
            <div className="cfr"><label className="cfl">PHONE</label><input className="cfin" type="tel" placeholder="+91 00000 00000"/></div>
            <div className="cfr">
              <label className="cfl">PROGRAMME</label>
              <select className="cfse">
                <option value="">Select a programme</option>
                <option>Little Mozart (Ages 4–6)</option>
                <option>Beginner — Grade Initial to 3</option>
                <option>Intermediate — Grade 4 to 5</option>
                <option>Advanced — Grade 6 to 8</option>
              </select>
            </div>
            <button className={`cfbtn${sent?' sent':''}`} onClick={()=>!sent&&setSent(true)}>
              {sent?'✓  ENQUIRY SENT — WE WILL CONTACT YOU':'SUBMIT ENQUIRY →'}
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}

/* ═══════════════════════════════════════
   FOOTER — dark bg, SOUL OF SYMPHONY
   fully visible ghost type + content row
═══════════════════════════════════════ */
function Footer(){
  return(
    <>
      <style>{`
        footer{background:var(--d0);position:relative;overflow:hidden;border-top:1px solid rgba(255,255,255,.06)}
        .ftghost{
          padding:3rem 5rem 0;
          font-family:'Cinzel',serif;
          font-size:clamp(2.5rem,9.5vw,11rem);
          font-weight:300;
          letter-spacing:.04em;
          text-transform:uppercase;
          line-height:.92;
          /* Visible but transparent-filled — outline style */
          color:transparent;
          -webkit-text-stroke:1px rgba(255,255,255,.12);
          user-select:none;
          pointer-events:none;
          white-space:normal;
          word-break:break-word;
        }
        .ftbot{
          max-width:1400px;margin:0 auto;
          padding:2.5rem 5rem 4rem;
          display:grid;
          grid-template-columns:1fr auto 1fr;
          gap:2rem;
          align-items:center;
          border-top:1px solid rgba(255,255,255,.06);
          margin-top:2rem;
        }
        .ftbr .ns{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.3em;color:var(--a2);text-transform:uppercase;display:block;margin-bottom:.3rem}
        .ftbr .nn{font-family:'Cormorant Garamond',serif;font-size:.9rem;color:rgba(255,255,255,.35);letter-spacing:.04em;font-style:italic}
        .ftmd{text-align:center;font-family:'DM Mono',monospace;font-size:.56rem;color:rgba(255,255,255,.2);letter-spacing:.08em;line-height:2;text-transform:uppercase}
        .ftmd strong{color:var(--a2);font-weight:400}
        .ftlk{display:flex;gap:2rem;justify-content:flex-end;flex-wrap:wrap}
        .ftlk a{font-family:'Cinzel',serif;font-size:.46rem;letter-spacing:.18em;color:rgba(255,255,255,.25);text-transform:uppercase;transition:color .3s}
        .ftlk a:hover{color:var(--a2)}
        .ftamber{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--a1),var(--a2),var(--a1),transparent)}
        @media(max-width:1100px){
          .ftghost{padding:3rem 2.5rem 0;font-size:clamp(2rem,8vw,6rem)}
          .ftbot{grid-template-columns:1fr;text-align:center;padding:2rem 2.5rem 4rem;gap:1.5rem}
          .ftlk{justify-content:center}
        }
        @media(max-width:640px){
          .ftghost{padding:2.5rem 1.25rem 0;font-size:clamp(1.6rem,9vw,4rem)}
          .ftbot{padding:2rem 1.25rem 3.5rem;gap:1.2rem}
          .ftlk{gap:1.2rem}
        }
      `}</style>
      <footer>
        {/* SOUL OF SYMPHONY — outlined ghost heading, fully visible */}
        <div className="ftghost" aria-hidden="true">SOUL OF<br/>SYMPHONY</div>
        <div className="ftbot">
          <div className="ftbr">
            <span className="ns">EST. 2005 · JAIPUR, INDIA</span>
            <span className="nn">The Piano Conservatoire</span>
          </div>
          <div className="ftmd">
            © 2026 SOUL OF SYMPHONY<br/>
            <strong>TRINITY COLLEGE LONDON AFFILIATE</strong><br/>
            ALL RIGHTS RESERVED
          </div>
          <div className="ftlk">
            <a href="https://www.youtube.com/@soulofsymphony" target="_blank" rel="noreferrer">YOUTUBE</a>
            <a href="https://www.instagram.com/soulofsymphony/" target="_blank" rel="noreferrer">INSTAGRAM</a>
            <a href="mailto:soulofsymphony@gmail.com">EMAIL</a>
          </div>
        </div>
        <div className="ftamber"/>
      </footer>
    </>
  )
}

/* ═══════════════════════════════════════
   ROOT APP
═══════════════════════════════════════ */
export default function App(){
  const [loaded,setLoaded]=useState(false)
  return(
    <>
      <AnimatePresence>{!loaded&&<Loader onDone={()=>setLoaded(true)}/>}</AnimatePresence>
      {loaded&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6,ease:EZ}}>
          <ProgressBar/>
          <Cursor/>
          <Nav/>
          <main>
            <Hero/>
            {/* dual direction cinematic marquees */}
            <Marquee items={BAND1} bg="var(--d0)" textColor="rgba(250,250,248,.7)" accentColor="var(--a2)" speed={38}/>
            <Marquee items={BAND2} rev bg="var(--d1)" textColor="var(--a2)" accentColor="rgba(250,250,248,.2)" speed={34}/>
            <Founder/>
            <Endorsements/>
            {/* alumni white marquee */}
            <Marquee items={ALUMNI} bg="var(--w3)" textColor="var(--t2)" accentColor="var(--a1)" speed={50}/>
            <Courses/>
            <PianoKeys/>
            <Team/>
            <Reels/>
            <Testimonials/>
            <FAQ/>
            <CTA/>
          </main>
          <Footer/>
        </motion.div>
      )}
    </>
  )
}
