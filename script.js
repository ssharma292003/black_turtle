(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Edit your products here ---------- */
  var SIDES = {
    shell: { note: "Heavyweight layers that take the weather and the week.", items: [
      { name: "Shell Hoodie", spec: "450 gsm brushed fleece, boxy fit", price: "₹3,499", art: "hoodie" },
      { name: "Plate Bomber", spec: "Water-resistant shell, ribbed hem", price: "₹5,999", art: "bomber" },
      { name: "Cargo Pant", spec: "Ripstop cotton, six pockets", price: "₹3,999", art: "cargo" } ] },
    sharp: { note: "Clean essentials that sit right and keep their shape.", items: [
      { name: "Hex Tee", spec: "240 gsm cotton, hex chest detail", price: "₹1,499", art: "tee" },
      { name: "Five-Panel Cap", spec: "Structured crown, turtle patch", price: "₹999", art: "cap" },
      { name: "Carry Tote", spec: "Heavy canvas, reinforced handles", price: "₹1,199", art: "tote" } ] }
  };
  var HEX = "<polygon points='100,56 112,63 112,77 100,84 88,77 88,63' />";
  var ART = {
    tee: "<svg viewBox='0 0 200 200' aria-hidden='true'><path d='M62 30 L86 24 Q100 42 114 24 L138 30 L180 62 L160 92 L142 80 L142 172 L58 172 L58 80 L40 92 L20 62 Z'/><path d='M86 24 Q100 46 114 24' fill='none'/>" + HEX + "</svg>",
    hoodie: "<svg viewBox='0 0 200 200' aria-hidden='true'><path d='M62 42 L82 26 Q100 16 118 26 L138 42 L182 74 L170 122 L146 114 L146 174 L54 174 L54 114 L30 122 L18 74 Z'/><path d='M82 26 Q100 62 118 26' fill='none'/><path d='M70 130 L130 130 L138 158 L62 158 Z' fill='none'/><path d='M94 56 L93 82 M106 56 L107 82' fill='none'/></svg>",
    bomber: "<svg viewBox='0 0 200 200' aria-hidden='true'><path d='M66 36 Q100 24 134 36 L184 66 L176 136 L150 130 L150 170 L50 170 L50 130 L24 136 L16 66 Z'/><path d='M70 36 Q100 58 130 36' fill='none'/><path d='M100 46 L100 170' fill='none'/><path d='M50 150 L150 150' fill='none'/></svg>",
    cargo: "<svg viewBox='0 0 200 200' aria-hidden='true'><path d='M62 20 L138 20 L146 62 L160 186 L114 186 L100 84 L86 186 L40 186 L54 62 Z'/><path d='M60 36 L140 36' fill='none'/><path d='M46 110 L68 110 L68 140 L44 140 Z' fill='none'/><path d='M154 110 L132 110 L132 140 L156 140 Z' fill='none'/></svg>",
    cap: "<svg viewBox='0 0 200 200' aria-hidden='true'><path d='M42 118 Q42 56 100 56 Q158 56 158 118 Z'/><path d='M28 118 Q100 98 172 118 Q198 128 186 142 Q100 124 14 142 Q2 128 28 118 Z'/><path d='M100 56 L100 110' fill='none'/><circle cx='100' cy='54' r='4'/></svg>",
    tote: "<svg viewBox='0 0 200 200' aria-hidden='true'><path d='M48 72 L152 72 L160 178 L40 178 Z'/><path d='M76 72 Q76 26 100 26 Q124 26 124 72' fill='none'/><polygon points='100,108 114,116 114,132 100,140 86,132 86,116'/></svg>"
  };

  var grid = document.getElementById("panel");
  var note = document.getElementById("tabNote");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));

  function bindCard(card) {
    var plate = card.querySelector(".plate");
    card.querySelectorAll("svg path, svg polygon, svg circle").forEach(function (s) { s.setAttribute("pathLength", "1"); });
    if (!fine || reduce) return;
    card.addEventListener("pointermove", function (e) {
      var r = plate.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      card.style.setProperty("--rx", ((0.5 - y) * 9).toFixed(2) + "deg");
      card.style.setProperty("--ry", ((x - 0.5) * 11).toFixed(2) + "deg");
    });
    card.addEventListener("pointerleave", function () { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
  }
  function render(side, animate) {
    var data = SIDES[side];
    note.textContent = data.note;
    grid.innerHTML = data.items.map(function (p, i) {
      return "<article class='card' style='--i:" + i + "'><div class='plate'>" + ART[p.art] + "</div>" +
        "<div class='meta'><h3>" + p.name + "</h3><p class='spec'>" + p.spec + "</p>" +
        "<div class='row'><span class='price'>" + p.price + "</span><a class='textlink' href='#join'>Get notified</a></div></div></article>";
    }).join("");
    grid.querySelectorAll(".card").forEach(bindCard);
    grid.setAttribute("aria-labelledby", "tab-" + side);
    if (animate) { grid.classList.remove("swap"); void grid.offsetWidth; grid.classList.add("swap"); }
  }
  function select(tab) {
    tabs.forEach(function (t) { var on = t === tab; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
    render(tab.dataset.side, true);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { var n = tabs[(i + 1) % tabs.length]; n.focus(); select(n); }
    });
  });
  render("shell", false);

  /* ---------- Hero: turtle follows pointer, scrambling phrase ---------- */
  var turtle = document.getElementById("turtle");
  if (!reduce && fine) {
    window.addEventListener("pointermove", function (e) {
      turtle.style.setProperty("--rot", ((e.clientX / window.innerWidth - 0.5) * 14).toFixed(2) + "deg");
    });
  }
  var rot = document.getElementById("rot");
  var phrases = ["the street", "the night", "the weather", "the long haul", "everything"];
  var CH = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&";
  function scramble(text, done) {
    var f = 0;
    (function tick() {
      var out = "";
      for (var i = 0; i < text.length; i++) out += (i < f - 5 || text[i] === " ") ? text[i] : CH[Math.floor(Math.random() * CH.length)];
      rot.textContent = out; f++;
      if (f - 5 <= text.length) setTimeout(tick, 34); else done();
    })();
  }
  if (!reduce) {
    var pi = 0;
    (function loop() { setTimeout(function () { pi = (pi + 1) % phrases.length; scramble(phrases[pi], loop); }, 2300); })();
  }

  /* ---------- Split headings + scroll reveals ---------- */
  if (!reduce) {
    document.querySelectorAll("[data-split]").forEach(function (el) {
      var txt = el.textContent.trim();
      el.setAttribute("aria-label", txt);
      el.innerHTML = txt.split(/\s+/).map(function (w, i) { return "<span class='w' aria-hidden='true'><span style='--i:" + i + "'>" + w + "</span></span>"; }).join(" ");
    });
  }
  var revealEls = document.querySelectorAll(".rv, [data-split]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- Lookbook arrows ---------- */
  var strip = document.getElementById("strip");
  function step(dir) { strip.scrollBy({ left: dir * (strip.querySelector(".look").offsetWidth + 20), behavior: reduce ? "auto" : "smooth" }); }
  document.getElementById("prev").addEventListener("click", function () { step(-1); });
  document.getElementById("next").addEventListener("click", function () { step(1); });

  /* ---------- Scroll progress + story parallax ---------- */
  var prog = document.getElementById("progress");
  var story = document.querySelector(".story");
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
    if (!reduce) { var r = story.getBoundingClientRect(); story.style.setProperty("--par", (-r.top * 0.12).toFixed(1) + "px"); }
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Magnetic buttons + cursor ring ---------- */
  if (fine && !reduce) {
    document.querySelectorAll(".btn.primary").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
    var ring = document.createElement("div"); ring.className = "cur-ring";
    var dot = document.createElement("div"); dot.className = "cur-dot";
    document.body.appendChild(ring); document.body.appendChild(dot);
    var tx = 0, ty = 0, rx = 0, ry = 0;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY; document.body.classList.add("cur-on");
      dot.style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
      ring.classList.toggle("big", !!e.target.closest("a, button, input, .plate"));
    });
    document.addEventListener("pointerleave", function () { document.body.classList.remove("cur-on"); });
    (function follow() { rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16; ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)"; requestAnimationFrame(follow); })();
  }

  /* ---------- Living hex grid (canvas) ---------- */
  var burst = function () {};
  (function () {
    var c = document.getElementById("bg"), ctx = c.getContext("2d");
    var R = 38, HW = Math.sqrt(3) * R, VS = 1.5 * R, W, H, dpr, cols, rows;
    var mx = -9999, my = -9999, pulses = [], parts = [], COS = [], SIN = [];
    for (var i = 0; i < 6; i++) { var a = Math.PI / 180 * (60 * i - 30); COS.push(Math.cos(a) * R); SIN.push(Math.sin(a) * R); }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight;
      c.width = W * dpr; c.height = H * dpr; c.style.width = W + "px"; c.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cols = Math.ceil(W / HW) + 2; rows = Math.ceil(H / VS) + 3;
    }
    function hex(x, y, s) { s = s || 1; ctx.moveTo(x + COS[0] * s, y + SIN[0] * s); for (var k = 1; k < 6; k++) ctx.lineTo(x + COS[k] * s, y + SIN[k] * s); ctx.closePath(); }
    function pulse(x, y) { pulses.push({ x: x, y: y, t: performance.now() }); if (pulses.length > 6) pulses.shift(); }
    burst = function (x, y) {
      for (var k = 0; k < 36; k++) { var ang = Math.random() * 6.283, sp = 1.5 + Math.random() * 5; parts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1, s: 0.12 + Math.random() * 0.25 }); }
      pulse(x, y);
    };
    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      var off = (window.scrollY * 0.15) % (2 * VS), lit = [];
      pulses = pulses.filter(function (p) { return t - p.t < 2200; });
      ctx.beginPath();
      for (var r = -1; r < rows; r++) {
        var y = r * VS - off;
        for (var q = -1; q < cols; q++) {
          var x = q * HW + ((r & 1) ? HW / 2 : 0);
          hex(x, y);
          var dx = x - mx, dy = y - my, d = Math.sqrt(dx * dx + dy * dy), v = d < 240 ? 1 - d / 240 : 0;
          for (var p = 0; p < pulses.length; p++) {
            var pu = pulses[p], age = (t - pu.t) / 2200, rad = age * Math.max(W, H) * 0.6;
            var ddx = x - pu.x, ddy = y - pu.y, diff = Math.abs(Math.sqrt(ddx * ddx + ddy * ddy) - rad);
            if (diff < 70) v = Math.max(v, (1 - diff / 70) * (1 - age));
          }
          if (v > 0.04) lit.push(x, y, v);
        }
      }
      ctx.strokeStyle = "rgba(246,241,231,.04)"; ctx.lineWidth = 1; ctx.stroke();
      for (var n = 0; n < lit.length; n += 3) {
        ctx.beginPath(); hex(lit[n], lit[n + 1]);
        ctx.fillStyle = "rgba(168,230,255," + (lit[n + 2] * 0.1).toFixed(3) + ")"; ctx.fill();
        ctx.strokeStyle = "rgba(168,230,255," + (lit[n + 2] * 0.8).toFixed(3) + ")"; ctx.lineWidth = 1.2; ctx.stroke();
      }
      for (var k = parts.length - 1; k >= 0; k--) {
        var pt = parts[k]; pt.x += pt.vx; pt.y += pt.vy; pt.vx *= 0.96; pt.vy *= 0.96; pt.life -= 0.016;
        if (pt.life <= 0) { parts.splice(k, 1); continue; }
        ctx.beginPath(); hex(pt.x, pt.y, pt.s); ctx.strokeStyle = "rgba(168,230,255," + pt.life.toFixed(2) + ")"; ctx.lineWidth = 1.5; ctx.stroke();
      }
      if (!reduce) requestAnimationFrame(frame);
    }
    resize(); window.addEventListener("resize", function () { resize(); if (reduce) frame(performance.now()); });
    window.addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    window.addEventListener("pointerdown", function (e) { pulse(e.clientX, e.clientY); });
    if (!reduce) {
      setInterval(function () { pulse(Math.random() * W, Math.random() * H); }, 2600);
      setTimeout(function () { pulse(W * 0.72, H * 0.45); }, 1100);
    }
    frame(performance.now());
  })();

  /* ---------- Signup: validation + POST to /api/signup ---------- */
  var form = document.getElementById("signup");
  var emailEl = document.getElementById("email");
  var phoneEl = document.getElementById("phone");
  var hpEl = document.getElementById("hp");
  var joinBtn = document.getElementById("joinBtn");
  var statusEl = document.getElementById("status");
  var errEls = { email: document.getElementById("emailErr"), phone: document.getElementById("phoneErr") };
  var inputs = { email: emailEl, phone: phoneEl };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Keep only the 10 digits. Handles pasted "+91 98765 43210", "098765 43210", spaces and dashes.
  function cleanPhone(v) {
    var d = String(v).replace(/\D/g, "");
    if (d.length === 12 && d.indexOf("91") === 0) d = d.slice(2);
    else if (d.length === 11 && d.charAt(0) === "0") d = d.slice(1);
    return d.slice(0, 10);
  }
  function setError(field, msg) {
    errEls[field].textContent = msg;
    inputs[field].setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function setStatus(msg, isError) { statusEl.textContent = msg; statusEl.classList.toggle("error", !!isError); }
  function clearAll() { setError("email", ""); setError("phone", ""); setStatus("", false); }
  function setBusy(on) { joinBtn.disabled = on; joinBtn.textContent = on ? "Joining…" : "Join the list"; }

  var NUM_MSG = "Numbers only, please. No letters.";
  var numTimer = null;
  phoneEl.addEventListener("input", function () {
    var raw = phoneEl.value;
    phoneEl.value = cleanPhone(raw);
    if (/[A-Za-z]/.test(raw)) {
      // Keep the hint visible for a moment so it can actually be read
      setError("phone", NUM_MSG);
      clearTimeout(numTimer);
      numTimer = setTimeout(function () { if (errEls.phone.textContent === NUM_MSG) setError("phone", ""); }, 2500);
    } else if (errEls.phone.textContent !== NUM_MSG) {
      setError("phone", "");
    }
  });
  emailEl.addEventListener("input", function () { setError("email", ""); });

  function validate() {
    var errs = {};
    var email = emailEl.value.trim().toLowerCase();
    var phone = cleanPhone(phoneEl.value);
    if (!email) errs.email = "Enter your email address.";
    else if (email.length > 254 || !EMAIL_RE.test(email)) errs.email = "That email doesn't look right. Try something like you@email.com.";
    if (!phone) errs.phone = "Enter your 10-digit mobile number.";
    else if (!/^\d{10}$/.test(phone)) errs.phone = "Mobile number must be exactly 10 digits. You've entered " + phone.length + ".";
    return { errs: errs, email: email, phone: phone };
  }
  function showFieldErrors(errs) {
    var first = null;
    ["email", "phone"].forEach(function (f) { if (errs[f]) { setError(f, errs[f]); if (!first) first = inputs[f]; } });
    if (first) first.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (joinBtn.disabled) return;
    clearAll();

    var v = validate();
    if (Object.keys(v.errs).length) {
      showFieldErrors(v.errs);
      setStatus("Please fix the highlighted fields.", true);
      return;
    }
    // Honeypot filled in = bot. Pretend it worked, send nothing.
    if (hpEl.value) { setStatus("You're on the list. We'll message you before the drop.", false); form.reset(); return; }

    setBusy(true);
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 12000);

    fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: v.email, phone: v.phone }),
      signal: ctrl.signal
    }).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) { return { res: res, data: data }; });
    }).then(function (out) {
      var res = out.res, data = out.data;
      if (res.ok && data && data.ok) {
        setStatus("You're on the list. We'll message you before the drop.", false);
        if (!reduce) { var r = joinBtn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2); }
        form.reset();
      } else if (res.status === 400 && data && data.errors) {
        showFieldErrors(data.errors);
        setStatus("Please fix the highlighted fields.", true);
      } else if (res.status === 409 && data && data.field) {
        var errs = {}; errs[data.field] = data.field === "email" ? "This email is already on the list." : "This number is already on the list.";
        showFieldErrors(errs);
        setStatus("You're already signed up. No need to join twice.", true);
      } else if (res.status === 429) {
        setStatus("Too many attempts. Please wait a few minutes and try again.", true);
      } else {
        setStatus("Something went wrong on our side. Please try again in a moment.", true);
      }
    }).catch(function (err) {
      if (err && err.name === "AbortError") setStatus("This is taking too long. Check your connection and try again.", true);
      else setStatus("Couldn't reach the server. Check your internet connection and try again.", true);
    }).then(function () { clearTimeout(timer); setBusy(false); });
  });
})();
