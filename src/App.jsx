import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useProgress } from '@react-three/drei'
import Scene from './components/Scene.jsx'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  { tag: 'Aerial', title: 'Autonomous Quadcopter', desc: 'GPS waypoint navigation with onboard computer vision and obstacle avoidance.' },
  { tag: 'AI · Vision', title: 'Gesture-Controlled Arm', desc: '6-DOF robotic arm driven by real-time hand tracking and IK solvers.' },
  { tag: 'Rover', title: 'Mars Rover Prototype', desc: 'Rocker-bogie suspension, LoRa telemetry and semi-autonomous sampling.' },
  { tag: 'Combat', title: 'Line Follower X', desc: 'PID-tuned high-speed follower. Inter-college race finalist 2025.' },
  { tag: 'IoT', title: 'Smart Greenhouse', desc: 'ESP32 sensor mesh with automated irrigation and dashboard analytics.' },
  { tag: 'Humanoid', title: 'Biped Walker', desc: 'Inverted-pendulum balance research platform built from scratch.' },
]

function LoaderVeil() {
  const { progress, active } = useProgress()
  const done = !active && progress >= 100
  return (
    <div id="loader-veil" className={done ? 'done' : ''}>
      <div className="loader-dot" />
      <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.25em', color: '#6e6e73' }}>
        PREPARING STUDIO
      </p>
    </div>
  )
}

export default function App() {
  const progressRef = useRef(0)
  const mainRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Master scroll driver: full page -> 0..1 for the 3D choreography
      ScrollTrigger.create({
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          progressRef.current = self.progress
          const fill = document.getElementById('scroll-progress-fill')
          if (fill) fill.style.transform = `scaleX(${self.progress})`
        },
      })

      // Hero drifts and fades away smoothly as you scroll on
      gsap.to('.hero-inner', {
        y: -90,
        opacity: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom 35%',
          scrub: 0.8,
        },
      })

      // Silky section entrances (reverse gracefully on scroll-up)
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // Gentle hero intro
      gsap.fromTo(
        '.hero-line',
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
      )
    }, mainRef)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={mainRef} style={{ position: 'relative', minHeight: '100vh', background: 'transparent' }}>
      <LoaderVeil />

      {/* ===== Fixed full-screen 3D studio stage ===== */}
      <div id="drone-canvas-wrap" aria-hidden="true">
        {/* whisper of studio glow behind the drone */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 45% at 50% 46%, rgba(255,255,255,0.05), transparent 70%)' }} />
        <Scene progressRef={progressRef} />
      </div>

      {/* ===== Minimal scroll progress hairline ===== */}
      <div id="scroll-progress" aria-hidden="true">
        <div id="scroll-progress-fill" />
      </div>

      {/* ===== Foreground ===== */}
      <main id="foreground">
        {/* ---------- HERO ---------- */}
        <section id="hero" className="fg-section" style={{ minHeight: '100vh', padding: '8rem 2rem 5rem', alignItems: 'flex-start', textAlign: 'center' }}>
          <div className="hero-inner" style={{ maxWidth: '56rem', margin: '0 auto', width: '100%' }}>
            <p className="hero-line eyebrow">Ghani Khan Choudhury Institute of Engineering &amp; Technology</p>
            <h1 className="hero-line hero-title">
              GKCIET Robotics Club
              <br />
              <span className="light">RAISC</span>
            </h1>
            <p className="hero-line bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-white to-gray-400 text-2xl md:text-4xl font-medium tracking-tight" style={{ maxWidth: '52rem', margin: '1.75rem auto 0', lineHeight: 1.3 }}>
              Engineering the future — drones, AI and automation, designed and built by students.
            </p>
            <div className="hero-line" style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.9rem', justifyContent: 'center' }}>
              <a href="#join" className="btn-white">Join the Club</a>
              <a href="#projects" className="btn-frost">Explore Projects</a>
            </div>
            <p className="hero-line" style={{ marginTop: '2.5rem', fontSize: '0.8rem', color: '#6e6e73' }}>
              <a href="#about" className="link-blue" style={{ textDecoration: 'none' }}>Scroll to explore&nbsp;&nbsp;›</a>
            </p>
          </div>
        </section>

        {/* ---------- ABOUT ---------- */}
        <section id="about" className="fg-section">
          <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div className="reveal card" style={{ padding: '2.75rem' }}>
              <p className="eyebrow">About us</p>
              <h2 className="section-title">We design machines that move the world.</h2>
              <p className="body-muted" style={{ marginTop: '1.25rem' }}>
                RAISC is the student robotics collective at GKCIET — exploring robotics, artificial
                intelligence and automation through hands-on builds, hackathons and inter-college
                competitions.
              </p>
              <div className="stats-row">
                {[
                  ['120+', 'MEMBERS'],
                  ['25+', 'ROBOTS SHIPPED'],
                  ['12', 'TROPHIES'],
                ].map(([n, l]) => (
                  <div key={l} className="stat">
                    <div className="stat-num">{n}</div>
                    <div className="stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                ['Learn', 'Weekly workshops across Arduino, ROS, CAD, 3D printing and control theory.'],
                ['Build', 'Focused squads for aerial, rover, manipulator and embedded AI systems.'],
                ['Compete', 'Techfests, drone races, robowars and national hackathons.'],
              ].map(([t, d]) => (
                <div key={t} className="reveal card card-hover" style={{ padding: '1.6rem 1.75rem' }}>
                  <h3 style={{ margin: 0, fontWeight: 600, color: '#fff' }}>{t}</h3>
                  <p className="body-muted" style={{ margin: '0.5rem 0 0', fontSize: '0.92rem' }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- PROJECTS ---------- */}
        <section id="projects" className="fg-section" style={{ display: 'block' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p className="eyebrow">Projects · Divisions</p>
              <h2 className="section-title">Selected work from the lab.</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {PROJECTS.map((p) => (
                <article key={p.title} className="reveal card card-hover" style={{ padding: '1.9rem' }}>
                  <span className="tag">{p.tag.toUpperCase()}</span>
                  <h3 style={{ margin: '1.1rem 0 0', fontSize: '1.2rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>{p.title}</h3>
                  <p className="body-muted" style={{ margin: '0.6rem 0 0', fontSize: '0.92rem' }}>{p.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- JOIN ---------- */}
        <section id="join" className="fg-section">
          <div className="reveal card" style={{ maxWidth: '46rem', margin: '0 auto', width: '100%', padding: '3.5rem 2.5rem', textAlign: 'center', borderRadius: '1.75rem' }}>
            <p className="eyebrow">Membership</p>
            <h2 className="section-title">Come build with us.</h2>
            <p className="body-muted" style={{ margin: '1.25rem auto 0', maxWidth: '30rem' }}>
              No experience needed — just curiosity. Recruitments open every semester.
              We meet <strong style={{ color: '#fff', fontWeight: 600 }}>Saturdays, 4 PM, Innovation Lab, Block C</strong>.
            </p>
            <form
              style={{ margin: '2rem auto 0', maxWidth: '28rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}
              onSubmit={(e) => {
                e.preventDefault()
                const data = new FormData(e.currentTarget)
                alert(`Welcome aboard, ${data.get('name') || 'maker'}! We'll reach out at ${data.get('email') || 'your inbox'}.`)
              }}
            >
              <input name="name" required placeholder="Your name" style={{ flex: '1 1 160px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,.16)', background: 'rgba(255,255,255,.05)', padding: '0.8rem 1.25rem', fontSize: '0.85rem', color: '#fff', outline: 'none' }} />
              <input name="email" required type="email" placeholder="Email" style={{ flex: '1 1 160px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,.16)', background: 'rgba(255,255,255,.05)', padding: '0.8rem 1.25rem', fontSize: '0.85rem', color: '#fff', outline: 'none' }} />
              <button className="btn-white">Join</button>
            </form>
          </div>
        </section>

        {/* ---------- FOOTER ---------- */}
        <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,.1)', background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '3rem 2rem 2rem' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>GKCIET Robotics Club · RAISC</h3>
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#6e6e73' }}>Robotics · AI · Automation — GKCIET Malda.</p>
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {['GitHub', 'Instagram', 'LinkedIn', 'YouTube'].map((label) => (
                  <a key={label} href="#" className="tag" style={{ textDecoration: 'none' }}>{label}</a>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', letterSpacing: '0.22em', color: '#6e6e73', fontWeight: 600 }}>CONTACT</h4>
              <p style={{ color: '#a1a1a6', margin: 0 }}>raisc@gkciet.ac.in</p>
              <p style={{ color: '#a1a1a6', margin: '0.25rem 0 0' }}>Innovation Lab, Block C, GKCIET Campus, Malda, WB</p>
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', letterSpacing: '0.22em', color: '#6e6e73', fontWeight: 600 }}>MEETINGS</h4>
              <p style={{ color: '#a1a1a6', margin: 0 }}>Every Saturday · 4:00 PM</p>
              <p style={{ color: '#6e6e73', margin: '0.25rem 0 0' }}>Open lab: Tue / Thu · 5–7 PM</p>
              <a href="#join" className="btn-white" style={{ marginTop: '1rem', padding: '0.6rem 1.4rem', fontSize: '0.78rem' }}>Join the Club</a>
            </div>
          </div>
          <p style={{ maxWidth: '72rem', margin: '2.5rem auto 0', borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.72rem', color: '#6e6e73' }}>
            © {new Date().getFullYear()} RAISC · GKCIET Robotics Club
          </p>
        </footer>
      </main>
    </div>
  )
}
