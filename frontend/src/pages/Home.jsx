import { useEffect } from 'react';
import './Home.css';

export default function Home() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Spendiary – AI Expense Analyser';

    var $ = function (s) { return document.querySelector(s); };
    var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
    var hero = $('#top'), nav = $('#nav'), bar = $('#bar'), phone = $('#phone'), copy = $('#copy'),
      panes = $$('.pane'), dots = $$('#dots span'),
      shapes = $$('.shape'), c1 = $('#chip1'), c2 = $('#chip2'), panel = $('#panel');
    var mx = 0, my = 0, tx = 0, ty = 0, cur = -1, prog = 0, ticking = false;
    var alive = true;

    function update() {
      var h = hero.offsetHeight - innerHeight;
      prog = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / h));
      bar.style.transform = 'scaleX(' + prog + ')';
      nav.classList.toggle('stuck', scrollY > 20);

      // copy drifts and fades
      copy.style.transform = 'translateY(' + (-prog * 60) + 'px)';
      copy.style.opacity = 1 - Math.max(0, prog - .55) * 1.6;
      // phone rotates upright and grows
      var rot = (1 - Math.min(1, prog * 2.2)) * -12;
      phone.style.transform = 'perspective(900px) rotateY(' + (rot + tx * 8) + 'deg) rotateX(' + (ty * -6) + 'deg) rotateZ(' + (rot * .5) + 'deg) scale(' + (1 + prog * .28) + ')';
      shapes.forEach(function (s) { s.style.transform = 'translate(' + (tx * -12) + 'px,' + (prog * parseFloat(s.dataset.sp)) + 'px) rotate(' + (prog * parseFloat(s.dataset.sp) * .3) + 'deg)'; });
      c1.style.transform = 'translate(' + (tx * 16) + 'px,' + (-prog * 50 + ty * 10) + 'px)';
      c2.style.transform = 'translate(' + (tx * -16) + 'px,' + (prog * 40 + ty * 10) + 'px)';
      var i = prog < .34 ? 0 : prog < .67 ? 1 : 2;
      if (i !== cur) {
        cur = i;
        panes.forEach(function (p, k) { p.classList.toggle('on', k === i); });
        dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
      }
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    function onMove(e) {
      var r = panel.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; update();
    }
    function onLeave() { tx = ty = 0; update(); }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', update);
    panel.addEventListener('mousemove', onMove);
    panel.addEventListener('mouseleave', onLeave);
    update();

    // scroll reveal + counters
    function count(el) {
      var n = +el.dataset.n, t0 = performance.now();
      (function f(t) {
        if (!alive) return;
        var p = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(n * e).toLocaleString('en-IN');
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          [].forEach.call(e.target.querySelectorAll('[data-n]'), count);
          if (e.target.dataset.n) count(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: .2 });
    $$('.rv').forEach(function (el) { io.observe(el); });

    // login modal
    var modal = $('#modal'), ok = $('#ok'), last;
    function open() { last = document.activeElement; modal.classList.add('open'); setTimeout(function () { $('#em').focus(); }, 200); }
    function close() { modal.classList.remove('open'); ok.style.display = 'none'; last && last.focus(); }
    function onModalClick(e) { if (e.target === modal) close(); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    function showOk() { ok.style.display = 'block'; }
    var openers = $$('[data-open]');
    openers.forEach(function (b) { b.addEventListener('click', open); });
    $('#close').addEventListener('click', close);
    modal.addEventListener('click', onModalClick);
    addEventListener('keydown', onKey);
    $('#go').addEventListener('click', showOk);

    return () => {
      alive = false;
      document.title = prevTitle;
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', update);
      panel.removeEventListener('mousemove', onMove);
      panel.removeEventListener('mouseleave', onLeave);
      io.disconnect();
      openers.forEach(function (b) { b.removeEventListener('click', open); });
      $('#close') && $('#close').removeEventListener('click', close);
      modal.removeEventListener('click', onModalClick);
      removeEventListener('keydown', onKey);
      $('#go') && $('#go').removeEventListener('click', showOk);
    };
  }, []);

  return (
    <>
      <div className="bar" id="bar"></div>

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <symbol id="mark" viewBox="0 0 64 64">
            <mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
              <rect width="64" height="64" fill="#fff" />
              <g fill="none" stroke="#000" strokeLinecap="round">
                <path d="M42 25.5C42 20 22 20 22 27C22 34 42 30 42 37C42 44 22 44 22 38.5" strokeWidth="5.6" />
                <path d="M32 15V49" strokeWidth="4" />
              </g>
            </mask>
            <g mask="url(#m)" strokeWidth="3" strokeLinejoin="round">
              <polygon points="8,43.4 8,46 32,60 56,46 56,26.6" fill="#0A2540" stroke="#0A2540" />
              <polygon points="8,37.4 8,18 32,4 56,18 56,20.6" fill="#2563EB" stroke="#2563EB" />
            </g>
          </symbol>
        </defs>
      </svg>

      <nav id="nav">
        <div className="nav-in">
          <a className="brand" href="#top" aria-label="Spendiary home"><svg><use href="#mark" /></svg><b className="wd">Spend<span>iary</span></b></a>
          <div className="links">
            <a href="#receipts">Receipts</a><a href="#budget">Budget</a><a href="#intelligence">Intelligence</a><a href="#reports">Reports</a><a href="#reviews">Reviews</a><a href="#faq">FAQ</a>
          </div>
          <button className="btn sm keep" data-open><span>Login</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg></button>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="stage">
          <div className="grid">
            <div className="copy" id="copy">
              <h1 aria-label="AI-powered expense tracking, from receipts to reports, fast.">
                <span className="ln"><span>AI-powered</span></span>
                <span className="ln"><span>expense tracking</span></span>
                <span className="ln"><span>from receipts to</span></span>
                <span className="ln"><span><em>reports, fast.</em></span></span>
              </h1>
              <p className="sub fade" style={{ animationDelay: '.7s' }}>Snap or upload a receipt and Spendiary reads every detail, sorts your spending, and turns it into clear reports you can act on.</p>
              <div className="cta fade" style={{ animationDelay: '.85s' }}>
                <button className="btn" data-open><span>Login to Spendiary</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg></button>

              </div>
            </div>

            <div className="panel" id="panel">
              {/* floating shapes */}
              <svg className="shape float" data-sp="40" style={{ left: '-4%', top: '6%', width: '34%', animationDelay: '-1s' }} viewBox="0 0 100 100"><polygon points="10,35 50,12 90,35 90,48 50,72 10,48" fill="#fff" /><polygon points="10,48 50,72 90,48 90,62 50,86 10,62" fill="#0A2540" /><rect x="40" y="38" width="20" height="4" rx="2" fill="#2563EB" /></svg>
              <svg className="shape float" data-sp="-60" style={{ right: '-3%', top: '2%', width: '30%', animationDelay: '-3s' }} viewBox="0 0 100 100"><g transform="rotate(14 50 50)"><rect x="22" y="8" width="56" height="84" rx="6" fill="#EFF4FB" /><g fill="#2563EB"><rect x="32" y="22" width="36" height="4" rx="2" /><rect x="32" y="34" width="26" height="4" rx="2" /><rect x="32" y="46" width="32" height="4" rx="2" /></g><rect x="32" y="66" width="36" height="12" rx="3" fill="#0A2540" /></g></svg>
              <svg className="shape float" data-sp="70" style={{ right: '2%', bottom: '6%', width: '26%', animationDelay: '-2s' }} viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#fff" /><path d="M50 50V10A40 40 0 0 1 90 50Z" fill="#0A2540" /><path d="M50 50H90A40 40 0 0 1 62 88Z" fill="#60A5FA" /><circle cx="50" cy="50" r="16" fill="#2563EB" /></svg>
              <svg className="shape float" data-sp="-30" style={{ left: '3%', bottom: '10%', width: '20%', animationDelay: '-4s' }} viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="40" ry="20" fill="#0A2540" /><ellipse cx="50" cy="46" rx="40" ry="20" fill="#fff" /><ellipse cx="50" cy="46" rx="26" ry="12" fill="#60A5FA" /></svg>

              <div className="chip" id="chip1" style={{ left: '5%', top: '48%' }}><i>₹</i><div><small>Saved this month</small><b>₹12,400</b></div></div>
              <div className="chip" id="chip2" style={{ right: '4%', top: '30%' }}><i>✓</i><div><small>Receipt scanned</small><b>Big Bazaar · ₹860</b></div></div>

              <div className="phone" id="phone">
                <div className="notch"></div>
                <div className="screen">
                  <div className="pane on">
                    <div className="mut">Welcome back 👋</div>
                    <div className="mut" style={{ marginTop: '8px' }}>Expenses · this month</div>
                    <div className="big">₹42,380</div>
                    <svg className="chart" viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M0 44 C25 40 35 18 60 26 S100 50 125 30 S170 8 200 16" /></svg>
                    <div className="mut" style={{ marginTop: '4px' }}>Recent expenses</div>
                    <div className="row"><span>Groceries<span className="tag">Food</span></span><b>₹1,150</b></div>
                    <div className="row"><span>Cab ride<span className="tag">Travel</span></span><b>₹340</b></div>
                    <div className="row"><span>Electricity<span className="tag">Bills</span></span><b>₹2,180</b></div>
                  </div>
                  <div className="pane">
                    <div className="mut">Budget</div>
                    <div className="big">₹18,500 <span className="mut" style={{ fontSize: '.45em' }}>of ₹30,000</span></div>
                    <div className="mut" style={{ marginTop: '12px' }}>Food</div><div className="meter"><i style={{ '--w': '72%' }}></i></div>
                    <div className="mut">Travel</div><div className="meter"><i className="n" style={{ '--w': '45%' }}></i></div>
                    <div className="mut">Bills</div><div className="meter"><i style={{ '--w': '88%' }}></i></div>
                    <div className="row"><span>23 days left</span><b>33 items</b></div>
                  </div>
                  <div className="pane">
                    <div className="mut">Financial health</div>
                    <div className="score"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" stroke="#e3eaf5" /><circle className="arc" cx="50" cy="50" r="36" /><text x="50" y="60" textAnchor="middle">90</text></svg></div>
                    <div className="row"><span>Great — savings are on track</span></div>
                    <div className="row"><span>Savings goal</span><b>60%</b></div>
                  </div>
                </div>
              </div>
              <div className="dots" id="dots"><span className="on"></span><span></span><span></span></div>
            </div>
          </div>

        </div>
      </header>

      <main>
        <section className="sec" id="receipts"><div className="wrap two">
          <div className="rv"><span className="tg">Receipts</span>
            <h2>Receipts in, insights out</h2>
            <p className="lead">From paper slips to forwarded emails, Spendiary gives you several ways to add receipts. It reads the details, cleans the data and sorts your spending for you.</p>
            <button className="btn" data-open><span>Login to start</span></button></div>
          <div className="sheet rv" style={{ '--d': 2 }}><div style={{ textAlign: 'center', fontWeight: 600, marginBottom: '14px' }}>Add expense</div>
            <div className="opt"><i>📷</i><div>Snap receipt<small>Use your camera to capture details</small></div></div>
            <div className="opt"><i>🖼</i><div>Upload from gallery<small>Add up to 5 receipts at once</small></div></div>
            <div className="opt"><i>📄</i><div>PDF receipt<small>Add up to 5 PDF receipts</small></div></div>
            <div className="opt"><i>✉</i><div>Email receipt<small>Forward receipts and invoices</small></div></div>
            <div className="opt"><i>✎</i><div>Enter manually<small>Type in your transaction details</small></div></div>
            <div className="opt"><i>🏦</i><div>Import bank statement<small>Bring in many transactions together</small></div></div>
          </div></div></section>

        <section className="sec mist" id="budget"><div className="wrap">
          <div className="rv"><span className="tg">Income, savings and budget</span>
            <h2>Track income. Set budgets. Hit your savings goals.</h2>
            <p className="lead">Add your income and Spendiary subtracts your monthly spending to show what you saved. Then add budgets or savings goals to build the habit.</p></div>
          <div className="three">
            <div className="cx rv" style={{ '--d': 1 }}><h3>Set your budget</h3><p>Track your budget by category.</p>
              <div className="num">₹10,000 <small style={{ fontSize: '14px', color: 'var(--slate)' }}>of ₹80,000</small></div>
              <div className="trk"><i className="mf" style={{ '--w': '100%', background: '#0A2540' }}></i></div><div className="trk"><i className="mf" style={{ '--w': '38%' }}></i></div></div>
            <div className="cx rv" style={{ '--d': 2 }}><h3>Financial health</h3><p>One score for how you spend, save and budget.</p>
              <div className="num" data-n="90" style={{ fontSize: '56px' }}>0</div>
              <div className="seg"><i style={{ '--k': 0 }}></i><i style={{ '--k': 1 }}></i><i style={{ '--k': 2 }}></i><i style={{ '--k': 3 }}></i><i style={{ '--k': 4 }}></i></div><p>Savings exceed goals. Great.</p></div>
            <div className="cx rv" style={{ '--d': 3 }}><h3>Saving goals</h3><p>Watch your progress in real time.</p>
              <div className="num">₹54,000 <small style={{ fontSize: '14px', color: 'var(--slate)' }}>of ₹90,000</small></div>
              <div className="trk"><i className="mf" style={{ '--w': '60%', background: '#16a34a' }}></i></div><p>You are 60% there. Well done!</p></div>
          </div>
          <div className="wide">
            <div className="cx rv"><h3>Stay in control, every step</h3><p>Income, expenses and savings update together as you add receipts.</p>
              <div className="num">₹5,000 <small style={{ fontSize: '14px', color: 'var(--slate)' }}>income this month</small></div></div>
            <div className="cx rv" style={{ '--d': 1 }}><h3>Clear overview</h3><p>See how you spend over time, matched with income.</p>
              <svg className="ln2" viewBox="0 0 400 150" preserveAspectRatio="none"><path d="M0 70 L60 70 L120 35 L180 70 L240 70 L300 55 L400 70" stroke="#2563EB" /><path d="M0 110 L80 110 L140 120 L200 108 L300 108 L400 95" stroke="#0A2540" /></svg></div>
          </div></div></section>

        <section className="sec dark" id="intelligence"><div className="wrap two">
          <div className="rv"><span className="tg">Intelligence</span>
            <h2>Built-in intelligence to guide your money habits</h2>
            <p className="lead">Ask the assistant things like “Which category did I overspend on?” or “How can I save more this month?” and get proactive suggestions.</p>
            <div className="chips"><span style={{ background: '#123256', borderColor: '#2b4668', color: '#dbe7f7' }}>Analyze spending</span><span style={{ background: '#123256', borderColor: '#2b4668', color: '#dbe7f7' }}>Find savings</span></div></div>
          <div className="chat rv" style={{ '--d': 1 }}>
            <div className="b u" style={{ '--k': 0 }}>How can I save more this month?</div>
            <div className="b a" style={{ '--k': 1 }}>Here is a breakdown of your recent spending:<br /><b>Groceries:</b> frequent, mostly from two stores.<br /><b>Food and drinks:</b> snacks pop up often.<br /><b>Transport:</b> several cab rides.</div>
            <div className="b a" style={{ '--k': 2 }}>Cutting cabs to twice a week could save about <b>₹1,800</b>.</div>
          </div></div></section>

        <section className="sec" id="reports"><div className="wrap">
          <div className="rv"><span className="tg">Reports</span>
            <h2>See every transaction, merchant and category</h2>
            <p className="lead">Filter your transactions, edit merchant details and read clear breakdowns over any period.</p></div>
          <div className="rp">
            <div className="cx rv" style={{ background: 'var(--mist)' }}><h3>See your transactions</h3><p>Filter by spend category and details.</p>
              <div className="tx"><span>Rice per pack<small>Food · Supplies</small></span><b>₹1,150</b></div>
              <div className="tx"><span>Kitchen mixer<small>Kitchen · Appliances</small></span><b>₹3,400</b></div>
              <div className="tx"><span>Cab to office<small>Travel</small></span><b>₹340</b></div></div>
            <div className="cx rv" style={{ '--d': 1, background: 'var(--mist)' }}><h3>Clear presentation</h3><p>Top products and merchants over any period.</p>
              <table><tbody><tr><th>Name</th><th>Amount</th></tr><tr><td>Fried rice</td><td>₹5,850</td></tr><tr><td>Roasted chicken</td><td>₹5,850</td></tr><tr><td>Charcoal 1/4</td><td>₹3,700</td></tr><tr><td>Grilled fish</td><td>₹2,800</td></tr></tbody></table></div>
          </div>
          <div className="three" style={{ marginTop: '20px' }}>
            <div className="cx rv"><h3>Edit merchants</h3><p>See and edit merchant and receipt details.</p>
              <table style={{ marginTop: '12px' }}><tbody><tr><td>Name</td><td>Big Bazaar</td></tr><tr><td>Phone</td><td>080 4024 0224</td></tr><tr><td>Type</td><td>Grocery</td></tr></tbody></table></div>
            <div className="cx rv" style={{ '--d': 1 }}><h3>See breakdown</h3><p>Spending by category, last 30 days.</p><div className="donut"></div></div>
            <div className="cx rv" style={{ '--d': 2 }}><h3>Detailed insights</h3><p>Go deeper into your patterns.</p>
              <div className="num" style={{ fontSize: '32px' }}>₹<span data-n="7500">0</span></div><p>All-time food expense</p>
              <div className="stats"><div><b data-n="12000">0</b><small>Transactions</small></div><div><b><span data-n="90">0</span>%</b><small>Of total</small></div><div><b>₹40k</b><small>Monthly avg</small></div></div></div>
          </div></div></section>

        <section className="sec mist" id="reviews"><div className="wrap">
          <div className="rv"><span className="tg">Testimonials</span><h2>Why people love Spendiary</h2>
            <p className="lead">Sample feedback from people tracking for personal clarity, business records and future goals.</p></div>
          <div className="masonry">
            <div className="quote rv">Receipt recognition is remarkably accurate. I would love to see even more reporting options to analyse my expenses.<div className="who"><i>A</i><div>Aarav<small>Delhi</small></div></div></div>
            <div className="quote nv rv" style={{ '--d': 1 }}><b>It saves me real time</b> when I report for taxes and gather receipts. It has also helped me understand my spending patterns.<div className="who"><i>R</i><div>Riya<small>Mumbai</small></div></div></div>
            <div className="quote rv" style={{ '--d': 2 }}>I travel often and needed a simple way to capture expenses on the go, from meals to taxis to flights, and share them with my finance team.<div className="who"><i>K</i><div>Karan<small>Bengaluru</small></div></div></div>
            <div className="quote rv">The app reads my bills well. My family and I use it to manage our household spending.<div className="who"><i>S</i><div>Sana<small>Panipat</small></div></div></div>
            <div className="quote rv" style={{ '--d': 1 }}>Exactly the kind of well-designed, thoughtful AI expense tool I was looking for.<div className="who"><i>M</i><div>Manish<small>Pune</small></div></div></div>
          </div></div></section>

        <section className="sec dark" id="faq"><div className="wrap two" style={{ alignItems: 'start' }}>
          <div className="rv"><span className="tg">Questions</span><h2>Frequently asked questions</h2>
            <p className="lead">Could not find something? Log in and ask the assistant.</p>
            <button className="btn" data-open style={{ background: 'var(--blue)' }}><span>Login</span></button></div>
          <div className="rv" style={{ '--d': 1 }}>
            <details open><summary>What is Spendiary and how does it work?</summary><p>You add receipts and Spendiary reads the details, sorts them into categories and turns them into reports.</p></details>
            <details><summary>Why should I care about Spendiary?</summary><p>It saves you from typing, keeps receipts in one place and shows where your money goes.</p></details>
            <details><summary>How can I add expenses?</summary><p>Use the camera, gallery, PDF, email, manual entry or a bank statement import.</p></details>
            <details><summary>Can I try it on a free trial?</summary><p>Sign in to see what trial options are available.</p></details>
            <details><summary>Does it read email attachments?</summary><p>Yes. Forwarded receipts and their attachments become expenses.</p></details>
            <details><summary>Does it support auto email forwarding?</summary><p>You can forward receipts and invoices from your email to add them.</p></details>
            <details><summary>Can I chat with my data and make reports?</summary><p>Yes. Ask the assistant questions and generate reports of your expenses.</p></details>
          </div></div></section>
      </main>

      <footer><div className="wrap">
        <div className="lg rv"><div><b>Already have an account?</b>Log in on web or mobile.</div><button className="btn sm" data-open><span>Login</span></button></div>
        <div className="wm" aria-hidden="true">Spendiary</div>
        <div className="fl"><a className="brand" href="#top" style={{ fontSize: '17px', color: '#fff' }}><svg style={{ width: '24px', height: '24px' }}><use href="#mark" /></svg>Spendiary</a>
          <span>©2026 Spendiary</span><a href="#receipts">Receipts</a><a href="#budget">Budget</a><a href="#intelligence">Intelligence</a><a href="#reports">Reports</a><a href="#reviews">Reviews</a><a href="#faq">FAQ</a></div>
      </div></footer>

      <div className="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="lt">
        <div className="card">
          <button className="x" id="close" aria-label="Close">×</button>
          <svg width="40" height="40"><use href="#mark" /></svg>
          <h2 id="lt">Welcome back</h2>
          <p>Log in to see your receipts and reports.</p>
          <div id="form">
            <label htmlFor="em">Email</label><input id="em" type="email" placeholder="you@example.com" autoComplete="email" />
            <label htmlFor="pw">Password</label><input id="pw" type="password" placeholder="Your password" autoComplete="current-password" />
            <button className="btn" id="go"><span>Login</span></button>
            <div className="ok" id="ok">Demo only: no account is created or checked.</div>
          </div>
        </div>
      </div>
    </>
  );
}
