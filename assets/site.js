/* =====================================================================================
   GRACE COMMUNITY CHURCH: assets/site.js
   Shared by every page. Load it at the bottom of <body>, before any page script.
   CONTENTS
     1. SITE settings: meeting places, page photo, hero photos, FORMS (where they send)
     2. Dated content: removes data-until / data-from items that are out of date
     3. Page background photo, footer year
     4. This Sunday: footer map, "Get directions" links, hero strip, [data-sun] text
     5. Mobile menu
     6. Pop-up forms (data-dialog="id" opens one, data-close closes it)
     7. Forms: checking, sending, thank-you message
   ===================================================================================== */

var SITE = {
  // Where the church meets, in date order. The strip under the hero, every "Get directions" button,
  // the Contact page's "This Sunday" card and the footer map all use the first entry whose "until"
  // date has not passed; the last entry has no "until" and stays for good. "embed" is optional:
  // Google's own embed address for that place (Google Maps > Share > Embed a map > the part inside src="...").
  meetingPlaces: [
    { until: "2026-10-18", name: "Mother Bethel AME Church", address: "419 S 6th St, Philadelphia, PA 19147", time: "12:00 PM", when: "Sundays, Oct 11 & 18 · 12:00 PM", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3058.914331494515!2d-75.15433712403855!3d39.94330588431766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c89dce8724e3%3A0xe65f30c2230e5a33!2sMother%20Bethel%20African%20Methodist%20Episcopal%20Church!5e0!3m2!1sen!2sus!4v1791393170178!5m2!1sen!2sus" },
    { until: "2026-10-25", name: "Mt. Zion United Methodist Church", address: "1530 N 11th St, Philadelphia, PA 19122", time: "11:00 AM", when: "Sunday, Oct 25 · 11:00 AM", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.449277796189!2d-75.15594892403706!3d39.976064082342106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c8750d33f387%3A0x758ef05e2a5f6aa5!2sMt.%20Zion%20United%20Methodist%20Church!5e0!3m2!1sen!2sus!4v1791393211512!5m2!1sen!2sus" },
    { until: "2026-11-01", name: "Meredith Elementary School (cafeteria)", address: "725 S 5th St, Philadelphia, PA 19147", time: "3:00 PM", when: "Sunday, Nov 1 · 3:00 PM · Official launch service", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.082793589414!2d-75.15323662403868!3d39.939537684544746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c89f0419216f%3A0x3e01c45119eaad6f!2sMeredith%20Elementary%20School!5e0!3m2!1sen!2sus!4v1791393246819!5m2!1sen!2sus" },
    { name: "Meredith Elementary School (cafeteria)", address: "725 S 5th St, Philadelphia, PA 19147", time: "12:00 PM", when: "Every Sunday", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.082793589414!2d-75.15323662403868!3d39.939537684544746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c89f0419216f%3A0x3e01c45119eaad6f!2sMeredith%20Elementary%20School!5e0!3m2!1sen!2sus!4v1791393246819!5m2!1sen!2sus" }
  ],

  // Whole-page background photo. It stays fixed while the page scrolls, under a cream layer at 85%.
  // The image files sit in the "images" folder. Use "" for plain cream.
  pageImage:      "images/background.jpg",
  pageImageSmall: "images/background-phone.jpg",   // taller crop used on phones; "" to use the main photo everywhere

  // Optional photo behind each hero slide on the home page (1920x1080), e.g. welcome: "images/hero-welcome.jpg".
  heroImages:  { welcome: "", launch: "", bible: "", food: "" },
  // Colour laid over each slide photo at 85% opacity: "light" (cream, dark text) or "dark" (black, light text).
  heroTone:    "light",

  // FORMS (Contact, vehicle donation, equipment donation).
  // Paste the Google Apps Script web app address here (it ends in /exec). See google-apps-script/Code.gs.
  // Left empty, a form opens the visitor's email app with the message filled in, addressed to formEmail.
  formEndpoint: "https://script.google.com/macros/s/AKfycbxyOB6PrONvOJKWWYSCYagTooND6nfrvlXG1xWh9O1-zSeOUPmBBtZxMAvjKRlPpsPsPg/exec",
  formEmail:    "info@gracecommunityphilly.org"
};
var EMBEDS = true; // true on the hosted site; set false to test without Google Maps frames

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 2. Dated content. data-until="YYYY-MM-DD" removes something the day after that date;
        data-from="YYYY-MM-DD" keeps it back until that date. */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  function day(v) { var d = v.split("-"); return new Date(+d[0], +d[1] - 1, +d[2]); }
  $$("[data-until], [data-from]").forEach(function (el) {
    var until = el.getAttribute("data-until"), from = el.getAttribute("data-from");
    if ((until && day(until) < today) || (from && day(from) > today)) el.parentNode.removeChild(el);
  });

  /* 3. Page background photo and the footer year */
  // Full addresses, so the photo is found from the page's folder rather than from assets/
  function abs(src) { try { return new URL(src, document.baseURI).href; } catch (e) { return src; } }
  if (SITE.pageImage) {
    document.documentElement.style.setProperty("--page-image", 'url("' + abs(SITE.pageImage) + '")');
    if (SITE.pageImageSmall) document.documentElement.style.setProperty("--page-image-small", 'url("' + abs(SITE.pageImageSmall) + '")');
    document.documentElement.classList.add("has-page-bg");
  }
  if ($("#year")) $("#year").textContent = Math.max(2026, today.getFullYear());

  /* 4. This Sunday: where the church meets next */
  var spot = null;
  (SITE.meetingPlaces || []).forEach(function (m) { if (!spot && (!m.until || day(m.until) >= today)) spot = m; });
  if (spot) {
    var full = spot.name + ", " + spot.address, q = encodeURIComponent(full);
    function set(sel, text) { var el = $(sel); if (el) el.textContent = text; }
    set("#map-place", full); set("#map-when", spot.when);
    set("#map-h", spot.until ? "Where we meet this Sunday" : "Where we meet");
    if ($("#map-link")) $("#map-link").href = "https://www.google.com/maps/search/?api=1&query=" + q;
    // home page strip under the hero
    set("#sun-label", spot.until ? "This Sunday" : "Every Sunday");
    set("#sun-time", spot.time);
    set("#sun-place", spot.name + ". See all service times");
    // any page: <span data-sun="label|when|time|name|address">
    var sun = { label: spot.until ? "This Sunday" : "Every Sunday", when: spot.when, time: spot.time, name: spot.name, address: spot.address };
    $$("[data-sun]").forEach(function (el) { var v = sun[el.getAttribute("data-sun")]; if (v) el.textContent = v; });
    $$("[data-dir]").forEach(function (a) {
      a.href = "https://www.google.com/maps/dir/?api=1&destination=" + q; a.target = "_blank"; a.rel = "noopener";
      var note = document.createElement("span"); note.className = "sr-only"; note.textContent = " to " + spot.name + " (opens in a new tab)";
      a.appendChild(note);
    });
    if (EMBEDS && $("#map")) {
      var mf = document.createElement("iframe");
      mf.src = spot.embed || ("https://www.google.com/maps?q=" + q + "&z=15&output=embed");
      mf.title = "Google Map showing " + full; mf.loading = "lazy"; mf.referrerPolicy = "strict-origin-when-cross-origin"; mf.allowFullscreen = true;
      $("#map").prepend(mf); $("#map").classList.add("live");
    }
  }

  /* 5. Mobile menu */
  var toggle = $("#nav-toggle"), nav = $("#site-nav"), toggleText = $("#nav-toggle-text");
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggleText.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (ev) { if (ev.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); }
    });
  }

  /* 6. Pop-up forms. A link with data-dialog="dlg-x" opens <dialog id="dlg-x">. Without JavaScript
        (or in very old browsers) the link simply goes to its href, the Contact page. */
  $$("[data-dialog]").forEach(function (a) {
    var dlg = document.getElementById(a.getAttribute("data-dialog"));
    if (!dlg || !dlg.showModal) return;
    a.addEventListener("click", function (ev) { ev.preventDefault(); dlg.showModal(); var f = $("input:not([type=hidden])", dlg); if (f) f.focus(); });
    dlg.addEventListener("click", function (ev) { if (ev.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { a.focus(); });
    $$("[data-close]", dlg).forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
  });

  /* 7. Forms. Each <form data-form="contact|vehicle|equipment"> is checked here, then sent to
        SITE.formEndpoint (Google Apps Script → Google Sheet + email), or, with no endpoint,
        written into an email in the visitor's email app. data-done="id" names the thank-you panel. */
  var EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function labelOf(field) {
    if (field.getAttribute("data-label")) return field.getAttribute("data-label");
    var l = field.closest("label");
    return l ? l.textContent.replace(/\((required|optional)\)/g, "").trim().split("\n")[0] : field.name;
  }
  // A ticked choice is named by its group's question (the fieldset legend), not by its own text
  function groupLabel(f) {
    if (f.getAttribute("data-label")) return f.getAttribute("data-label");
    if (f.type !== "radio" && f.type !== "checkbox") return "";
    var fs = f.closest("fieldset"), lg = fs && fs.querySelector("legend");
    return lg ? lg.textContent.replace(/\((required|optional|choose at least one)\)/g, "").trim() : "";
  }
  $$("form[data-form]").forEach(function (form) {
    var kind = form.getAttribute("data-form");
    var err = $(".f-error", form);
    var done = document.getElementById(form.getAttribute("data-done"));
    var btn = $("button[type=submit]", form), btnText = btn.textContent;

    // Pre-select a reason from the address, e.g. contact.html?reason=giving
    var m = location.search.match(/[?&]reason=([\w-]+)/);
    if (m) { var r = $('input[name=reason][data-key="' + m[1] + '"]', form); if (r) r.checked = true; }

    form.addEventListener("input", function (ev) {
      ev.target.removeAttribute("aria-invalid");
      var g = ev.target.closest("[data-need-one]"); if (g) g.removeAttribute("data-invalid");
    });
    form.addEventListener("change", function (ev) {
      ev.target.removeAttribute("aria-invalid");
      var g = ev.target.closest("[data-need-one]"); if (g) g.removeAttribute("data-invalid");
    });

    function finish(viaEmail) {
      form.hidden = true;
      if (done) {
        if (viaEmail) { var msg = $(".done-msg", done); if (msg) msg.textContent = "Your email app should now open with your message filled in. Press Send there to finish. Nothing opened? Email us at " + SITE.formEmail + "."; }
        done.hidden = false; done.focus();
      }
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (form.elements.website && form.elements.website.value) { finish(false); return; } // spam trap filled: quietly stop

      // Check required fields
      var bad = [];
      $$("[required]", form).forEach(function (f) {
        var v = f.type === "checkbox" ? f.checked : f.value.trim() !== "";
        if (v && f.type === "email") v = EMAIL_OK.test(f.value.trim());
        if (!v) { f.setAttribute("aria-invalid", "true"); bad.push(f); }
      });
      $$("[data-need-one]", form).forEach(function (g) {
        if (!$("input:checked", g)) { g.setAttribute("data-invalid", "true"); bad.push($("input", g)); }
      });
      if (bad.length) {
        var emailBad = bad.some(function (f) { return f.type === "email" && f.value.trim(); });
        err.textContent = (bad.length === 1 ? "Please fill in the highlighted field" : "Please fill in the " + bad.length + " highlighted fields") +
          (emailBad ? ", and check that your email address is complete." : ".");
        err.hidden = false; bad[0].focus(); return;
      }
      err.hidden = true;

      // Gather the answers (several ticked boxes with one name become one line)
      var order = [], vals = {}, labels = {};
      $$("input, select, textarea", form).forEach(function (f) {
        if (!f.name || f.name === "website" || f.type === "submit") return;
        if ((f.type === "checkbox" || f.type === "radio") && !f.checked) return;
        if (!(f.name in vals)) { order.push(f.name); vals[f.name] = []; labels[f.name] = groupLabel(f) || labelOf(f); }
        if (f.value.trim()) vals[f.name].push(f.value.trim());
      });

      if (SITE.formEndpoint) {
        var body = new URLSearchParams();
        body.append("form", kind);
        order.forEach(function (k) { vals[k].forEach(function (v) { body.append(k, v); }); });
        body.append("page", location.pathname);
        btn.disabled = true; btn.textContent = "Sending…";
        fetch(SITE.formEndpoint, { method: "POST", mode: "no-cors", body: body })
          .then(function () { finish(false); })
          .catch(function () {
            btn.disabled = false; btn.textContent = btnText;
            err.textContent = "Your message didn’t send. Check your internet connection and try again, or email us at " + SITE.formEmail + ".";
            err.hidden = false;
          });
      } else {
        var lines = order.filter(function (k) { return vals[k].length; }).map(function (k) { return labels[k] + ": " + vals[k].join(", "); });
        var subject = form.getAttribute("data-subject") || "Message from the website";
        location.href = "mailto:" + SITE.formEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
        finish(true);
      }
    });
  });
})();
