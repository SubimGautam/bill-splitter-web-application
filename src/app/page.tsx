"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="page">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-inner">
            <div className="logo">
              <div className="logo-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="logo-text">Splito</span>
            </div>
            <div className="nav-links">
              <Link href="#features" className="nav-link">Features</Link>
              <Link href="#how-it-works" className="nav-link">How it works</Link>
              <Link href="#pricing" className="nav-link">Pricing</Link>
            </div>
            <div className="nav-actions">
              <Link href="/authentication/login" className="btn-ghost">Log in</Link>
              <Link href="/authentication/signup" className="btn-primary">Get started free</Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">✨ Trusted by 50,000+ users worldwide</div>
          <h1 className="hero-title">
            Split expenses.<br />
            <span className="gradient-text">Not friendships.</span>
          </h1>
          <p className="hero-sub">
            Track shared bills, split costs fairly, and settle up easily — whether it's a trip, a household, or a night out.
          </p>
          <div className="hero-cta">
            <Link href="/authentication/signup" className="btn-hero-primary">Start for free</Link>
            <Link href="#how-it-works" className="btn-hero-ghost">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
              See how it works
            </Link>
          </div>
          <div className="hero-social-proof">
            <div className="avatars">
              {["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7"].map((c, i) => (
                <div key={i} className="avatar" style={{background: c, zIndex: 5 - i}} />
              ))}
            </div>
            <span>Join thousands already splitting smarter</span>
          </div>
        </section>

        {/* MOCK DASHBOARD */}
        <section className="dashboard-preview">
          <div className="browser-chrome">
            <div className="browser-dots">
              <span style={{background:"#FF5F57"}} />
              <span style={{background:"#FFBD2E"}} />
              <span style={{background:"#28CA40"}} />
            </div>
            <div className="browser-url">app.splito.com/dashboard</div>
          </div>
          <div className="mock-dashboard">
            {/* Sidebar */}
            <div className="mock-sidebar">
              <div className="mock-logo">
                <div className="logo-icon-sm" />
                <span>Splito</span>
              </div>
              <div className="mock-nav-items">
                {[
                  {icon:"⊞", label:"Dashboard", active: true},
                  {icon:"👥", label:"Groups"},
                  {icon:"💸", label:"Expenses"},
                  {icon:"📊", label:"Reports"},
                  {icon:"⚙️", label:"Settings"},
                ].map((item) => (
                  <div key={item.label} className={`mock-nav-item ${item.active ? "active" : ""}`}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="mock-main">
              <div className="mock-header-row">
                <div>
                  <div className="mock-greeting">Good morning, Alex 👋</div>
                  <div className="mock-date">Friday, February 27</div>
                </div>
                <div className="mock-add-btn">+ Add expense</div>
              </div>

              <div className="mock-cards-row">
                <div className="mock-stat-card green">
                  <div className="mock-stat-label">You are owed</div>
                  <div className="mock-stat-value">$284.50</div>
                  <div className="mock-stat-delta">↑ from 3 people</div>
                </div>
                <div className="mock-stat-card red">
                  <div className="mock-stat-label">You owe</div>
                  <div className="mock-stat-value">$72.00</div>
                  <div className="mock-stat-delta">↓ to 1 person</div>
                </div>
                <div className="mock-stat-card blue">
                  <div className="mock-stat-label">This month</div>
                  <div className="mock-stat-value">$1,040</div>
                  <div className="mock-stat-delta">↑ 12% vs last</div>
                </div>
              </div>

              <div className="mock-recent">
                <div className="mock-section-title">Recent expenses</div>
                {[
                  {icon:"🍕", name:"Pizza night", group:"NYC Trip", amount:"-$18.40", color:"#FEE2E2", who:"with 3 others"},
                  {icon:"🚗", name:"Uber to airport", group:"Travel", amount:"+$32.00", color:"#DCFCE7", who:"from Jamie"},
                  {icon:"🏠", name:"March rent", group:"Home", amount:"-$850.00", color:"#FEE2E2", who:"with roommates"},
                  {icon:"🎬", name:"Netflix split", group:"Subscriptions", amount:"+$5.00", color:"#DCFCE7", who:"from Sam"},
                ].map((item, i) => (
                  <div key={i} className="mock-expense-row">
                    <div className="mock-expense-icon" style={{background: item.color}}>{item.icon}</div>
                    <div className="mock-expense-info">
                      <div className="mock-expense-name">{item.name}</div>
                      <div className="mock-expense-group">{item.group} · {item.who}</div>
                    </div>
                    <div className={`mock-expense-amount ${item.amount.startsWith("+") ? "pos" : "neg"}`}>
                      {item.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features" id="features">
          <div className="section-label">WHY SPLITO</div>
          <h2 className="section-title">Everything you need to<br />manage shared money</h2>
          <div className="features-grid">
            {[
              {
                icon: "⚡",
                title: "Lightning fast splits",
                desc: "Add an expense in seconds. Splito instantly calculates who owes what and notifies everyone.",
                color: "#FFF7ED",
                accent: "#F97316",
              },
              {
                icon: "🌍",
                title: "Multi-currency support",
                desc: "Traveling abroad? Handle expenses in any currency with real-time exchange rates.",
                color: "#EFF6FF",
                accent: "#3B82F6",
              },
              {
                icon: "📊",
                title: "Smart reports",
                desc: "Visualize spending trends and category breakdowns. Know exactly where group money goes.",
                color: "#F0FDF4",
                accent: "#22C55E",
              },
              {
                icon: "🔔",
                title: "Smart reminders",
                desc: "Automated nudges to settle up — no awkward conversations needed.",
                color: "#FDF4FF",
                accent: "#A855F7",
              },
              {
                icon: "🔒",
                title: "Bank-level security",
                desc: "Your financial data is encrypted end-to-end. We never store your payment details.",
                color: "#FFF1F2",
                accent: "#F43F5E",
              },
              {
                icon: "📱",
                title: "Works everywhere",
                desc: "Web, iOS, and Android. Your balances are always in sync, always up to date.",
                color: "#ECFDF5",
                accent: "#10B981",
              },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{background: f.color, color: f.accent}}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-it-works" id="how-it-works">
          <div className="hiw-inner">
            <div className="hiw-content">
              <div className="section-label">HOW IT WORKS</div>
              <h2 className="section-title left">Up and running<br />in 3 simple steps</h2>
              <div className="steps">
                {[
                  {num:"01", title:"Create a group", desc:"Set up a group for your trip, household, or any shared expense scenario in seconds."},
                  {num:"02", title:"Add expenses", desc:"Log what you paid and Splito figures out who owes whom — automatically."},
                  {num:"03", title:"Settle up", desc:"Pay back with one tap. Connect your bank or use built-in payment links."},
                ].map((step) => (
                  <div key={step.num} className="step">
                    <div className="step-num">{step.num}</div>
                    <div>
                      <div className="step-title">{step.title}</div>
                      <div className="step-desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hiw-visual">
              <div className="hiw-card main-card">
                <div className="hiw-card-header">
                  <div className="group-avatar">🏖️</div>
                  <div>
                    <div className="group-name">Barcelona Trip</div>
                    <div className="group-members">4 members · 12 expenses</div>
                  </div>
                </div>
                <div className="hiw-balances">
                  {[
                    {name:"You", amount:"+$126", color:"#22C55E"},
                    {name:"Jamie", amount:"-$44", color:"#EF4444"},
                    {name:"Sam", amount:"+$18", color:"#22C55E"},
                    {name:"Alex", amount:"-$100", color:"#EF4444"},
                  ].map((b) => (
                    <div key={b.name} className="balance-row">
                      <div className="balance-avatar">{b.name[0]}</div>
                      <span className="balance-name">{b.name}</span>
                      <span className="balance-amount" style={{color: b.color}}>{b.amount}</span>
                    </div>
                  ))}
                </div>
                <div className="settle-btn">Settle up →</div>
              </div>

              <div className="hiw-card floating-card notification-card">
                <span>🎉</span>
                <div>
                  <div style={{fontWeight:600, fontSize:"13px"}}>Jamie paid you back!</div>
                  <div style={{color:"#6B7280", fontSize:"12px"}}>$44.00 received</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials">
          <div className="section-label center">WHAT PEOPLE SAY</div>
          <h2 className="section-title center">Loved by groups everywhere</h2>
          <div className="testimonials-grid">
            {[
              {quote:"Finally an app that makes splitting costs stress-free. Our friend group used it on a 10-day Europe trip and it was perfect.", name:"Maria G.", role:"Travel enthusiast", avatar:"#FF6B6B"},
              {quote:"We use Splito for our 4-person apartment. No more awkward \"you owe me\" texts. Everything is just clear and fair.", name:"David K.", role:"Roommate of 2 years", avatar:"#4ECDC4"},
              {quote:"The reports feature helped me realize how much we were spending on dining out. Total game changer for budgeting.", name:"Sarah M.", role:"Finance-conscious user", avatar:"#45B7D1"},
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{background: t.avatar}} />
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="cta-inner">
            <h2>Ready to split smarter?</h2>
            <p>Free forever for individuals. No credit card required.</p>
            <div className="cta-actions">
              <Link href="/authentication/signup" className="btn-cta-primary">Create free account</Link>
              <Link href="/authentication/login" className="btn-cta-ghost">Already have an account</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="logo-text">Splito</span>
              </div>
              <p className="footer-tagline">Making shared expenses painless since 2024.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <div className="footer-col-title">Product</div>
                <Link href="#features">Features</Link>
                <Link href="#pricing">Pricing</Link>
                <Link href="/authentication/signup">Sign up</Link>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Company</div>
                <Link href="#">About</Link>
                <Link href="#">Blog</Link>
                <Link href="#">Contact</Link>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Legal</div>
                <Link href="#">Privacy</Link>
                <Link href="#">Terms</Link>
                <Link href="/admin/login">Admin</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Splito. All rights reserved.</span>
          </div>
        </footer>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          min-height: 100vh;
          background: #FAFAFA;
          font-family: 'DM Sans', system-ui, sans-serif;
          color: #111827;
          overflow-x: hidden;
        }

        /* NAV */
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(250, 250, 250, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #E5E7EB;
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #22C55E, #16A34A);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.5px;
        }
        .nav-links {
          display: flex;
          gap: 32px;
        }
        .nav-link {
          text-decoration: none;
          color: #6B7280;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.15s;
        }
        .nav-link:hover { color: #111827; }
        .nav-actions { display: flex; gap: 12px; align-items: center; }
        .btn-ghost {
          text-decoration: none;
          color: #374151;
          font-size: 15px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .btn-ghost:hover { background: #F3F4F6; }
        .btn-primary {
          text-decoration: none;
          background: #22C55E;
          color: white;
          font-size: 15px;
          font-weight: 600;
          padding: 8px 20px;
          border-radius: 8px;
          transition: background 0.15s, transform 0.1s;
        }
        .btn-primary:hover { background: #16A34A; transform: translateY(-1px); }

        /* HERO */
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 32px 60px;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F0FDF4;
          color: #16A34A;
          border: 1px solid #BBF7D0;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 28px;
        }
        .hero-title {
          font-size: clamp(44px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -2px;
          color: #111827;
          margin-bottom: 20px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #22C55E 0%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 18px;
          color: #6B7280;
          max-width: 520px;
          margin: 0 auto 36px;
          line-height: 1.7;
        }
        .hero-cta { display: flex; gap: 14px; justify-content: center; align-items: center; margin-bottom: 32px; }
        .btn-hero-primary {
          text-decoration: none;
          background: #22C55E;
          color: white;
          font-size: 16px;
          font-weight: 600;
          padding: 14px 32px;
          border-radius: 10px;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(34,197,94,0.3);
        }
        .btn-hero-primary:hover { background: #16A34A; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(34,197,94,0.35); }
        .btn-hero-ghost {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #374151;
          font-size: 15px;
          font-weight: 500;
          padding: 14px 24px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          background: white;
          transition: border-color 0.15s, background 0.15s;
        }
        .btn-hero-ghost:hover { border-color: #9CA3AF; background: #F9FAFB; }
        .hero-social-proof {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #6B7280;
          font-size: 14px;
        }
        .avatars { display: flex; }
        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid white;
          margin-left: -8px;
        }
        .avatar:first-child { margin-left: 0; }

        /* DASHBOARD PREVIEW */
        .dashboard-preview {
          max-width: 1100px;
          margin: 0 auto 80px;
          padding: 0 32px;
          border-radius: 16px;
          overflow: hidden;
        }
        .browser-chrome {
          background: #E5E7EB;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 12px 12px 0 0;
        }
        .browser-dots { display: flex; gap: 6px; }
        .browser-dots span { width: 12px; height: 12px; border-radius: 50%; display: block; }
        .browser-url {
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: #9CA3AF;
          background: white;
          padding: 4px 12px;
          border-radius: 6px;
          max-width: 300px;
          margin: 0 auto;
        }
        .mock-dashboard {
          display: flex;
          background: #F8F9FA;
          border: 1px solid #E5E7EB;
          border-top: none;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          min-height: 400px;
        }
        .mock-sidebar {
          width: 200px;
          background: #1F2937;
          padding: 20px 16px;
          flex-shrink: 0;
        }
        .mock-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 28px;
          padding: 0 8px;
        }
        .logo-icon-sm {
          width: 24px;
          height: 24px;
          background: #22C55E;
          border-radius: 6px;
        }
        .mock-nav-items { display: flex; flex-direction: column; gap: 4px; }
        .mock-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          color: #9CA3AF;
          font-size: 13px;
          cursor: pointer;
        }
        .mock-nav-item.active { background: #374151; color: white; }
        .mock-main { flex: 1; padding: 24px; overflow: hidden; }
        .mock-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .mock-greeting { font-size: 16px; font-weight: 700; color: #111827; }
        .mock-date { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
        .mock-add-btn {
          background: #22C55E;
          color: white;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .mock-cards-row { display: flex; gap: 12px; margin-bottom: 20px; }
        .mock-stat-card {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
        }
        .mock-stat-card.green { background: #F0FDF4; }
        .mock-stat-card.red { background: #FFF1F2; }
        .mock-stat-card.blue { background: #EFF6FF; }
        .mock-stat-label { font-size: 11px; color: #6B7280; margin-bottom: 4px; }
        .mock-stat-value { font-size: 20px; font-weight: 700; color: #111827; }
        .mock-stat-delta { font-size: 11px; color: #9CA3AF; margin-top: 2px; }
        .mock-recent { background: white; border-radius: 10px; padding: 14px; }
        .mock-section-title { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 12px; }
        .mock-expense-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 0;
          border-bottom: 1px solid #F3F4F6;
        }
        .mock-expense-row:last-child { border-bottom: none; }
        .mock-expense-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .mock-expense-name { font-size: 12px; font-weight: 600; color: #111827; }
        .mock-expense-group { font-size: 11px; color: #9CA3AF; }
        .mock-expense-info { flex: 1; }
        .mock-expense-amount { font-size: 13px; font-weight: 700; }
        .mock-expense-amount.pos { color: #16A34A; }
        .mock-expense-amount.neg { color: #EF4444; }

        /* FEATURES */
        .features {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 32px;
          text-align: center;
        }
        .section-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #22C55E;
          margin-bottom: 14px;
          text-transform: uppercase;
        }
        .section-label.center { text-align: center; }
        .section-title {
          font-size: clamp(30px, 4vw, 46px);
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.15;
          color: #111827;
          margin-bottom: 56px;
        }
        .section-title.left { text-align: left; margin-bottom: 36px; }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .feature-card {
          text-align: left;
          padding: 28px;
          border-radius: 16px;
          background: white;
          border: 1px solid #F3F4F6;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .feature-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 16px;
        }
        .feature-title { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 8px; }
        .feature-desc { font-size: 14px; color: #6B7280; line-height: 1.65; }

        /* HOW IT WORKS */
        .how-it-works {
          background: #F0FDF4;
          padding: 80px 32px;
        }
        .hiw-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 80px;
          align-items: center;
        }
        .hiw-content { flex: 1; }
        .steps { display: flex; flex-direction: column; gap: 28px; }
        .step { display: flex; gap: 20px; align-items: flex-start; }
        .step-num {
          font-size: 13px;
          font-weight: 800;
          color: #22C55E;
          background: #DCFCE7;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }
        .step-title { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 4px; }
        .step-desc { font-size: 14px; color: #6B7280; line-height: 1.65; }

        .hiw-visual { flex: 1; position: relative; min-height: 340px; }
        .hiw-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          border: 1px solid #F3F4F6;
        }
        .main-card { position: relative; z-index: 2; }
        .hiw-card-header { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; }
        .group-avatar { font-size: 28px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: #FEF9C3; border-radius: 10px; }
        .group-name { font-size: 16px; font-weight: 700; color: #111827; }
        .group-members { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
        .hiw-balances { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .balance-row { display: flex; align-items: center; gap: 10px; }
        .balance-avatar {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #22C55E, #3B82F6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 12px;
        }
        .balance-name { flex: 1; font-size: 14px; color: #374151; font-weight: 500; }
        .balance-amount { font-size: 14px; font-weight: 700; }
        .settle-btn {
          background: #22C55E;
          color: white;
          text-align: center;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .floating-card {
          position: absolute;
          bottom: -20px;
          right: -20px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          width: auto;
          font-size: 22px;
          animation: float 3s ease-in-out infinite;
          z-index: 3;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* TESTIMONIALS */
        .testimonials {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 32px;
          text-align: center;
        }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: left; }
        .testimonial-card {
          background: white;
          border: 1px solid #F3F4F6;
          border-radius: 16px;
          padding: 28px;
          transition: box-shadow 0.2s;
        }
        .testimonial-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
        .stars { color: #F59E0B; font-size: 16px; margin-bottom: 14px; letter-spacing: 2px; }
        .testimonial-quote { font-size: 15px; color: #374151; line-height: 1.7; margin-bottom: 20px; }
        .testimonial-author { display: flex; gap: 12px; align-items: center; }
        .testimonial-avatar { width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0; }
        .testimonial-name { font-size: 14px; font-weight: 700; color: #111827; }
        .testimonial-role { font-size: 12px; color: #9CA3AF; margin-top: 2px; }

        /* CTA */
        .cta-section {
          background: #111827;
          padding: 80px 32px;
          text-align: center;
        }
        .cta-inner { max-width: 600px; margin: 0 auto; }
        .cta-section h2 { font-size: 40px; font-weight: 800; letter-spacing: -1.5px; color: white; margin-bottom: 14px; }
        .cta-section p { font-size: 16px; color: #9CA3AF; margin-bottom: 36px; }
        .cta-actions { display: flex; gap: 14px; justify-content: center; }
        .btn-cta-primary {
          text-decoration: none;
          background: #22C55E;
          color: white;
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          transition: background 0.15s, transform 0.1s;
        }
        .btn-cta-primary:hover { background: #16A34A; transform: translateY(-2px); }
        .btn-cta-ghost {
          text-decoration: none;
          color: #9CA3AF;
          padding: 14px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          border: 1px solid #374151;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-cta-ghost:hover { border-color: #6B7280; color: white; }

        /* FOOTER */
        .footer {
          background: #F9FAFB;
          border-top: 1px solid #E5E7EB;
          padding: 56px 32px 24px;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          gap: 60px;
          margin-bottom: 40px;
        }
        .footer-brand { max-width: 240px; }
        .footer-tagline { font-size: 14px; color: #9CA3AF; margin-top: 12px; line-height: 1.6; }
        .footer-links { display: flex; gap: 60px; }
        .footer-col { display: flex; flex-direction: column; gap: 10px; }
        .footer-col-title { font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 4px; }
        .footer-col a { text-decoration: none; font-size: 14px; color: #6B7280; transition: color 0.15s; }
        .footer-col a:hover { color: #111827; }
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          border-top: 1px solid #E5E7EB;
          padding-top: 20px;
          font-size: 13px;
          color: #9CA3AF;
          text-align: center;
        }
      `}</style>
    </>
  );
}