/* 示範網站保護：浮水印、防複製、網域鎖 */
(function () {
  "use strict";

  function makeTile() {
    var c = document.createElement("canvas"), dpr = window.devicePixelRatio || 1, w = 420, h = 260;
    c.width = w * dpr; c.height = h * dpr;
    var g = c.getContext("2d");
    g.scale(dpr, dpr);
    g.translate(w / 2, h / 2);
    g.rotate(-24 * Math.PI / 180);
    g.textAlign = "center";
    g.fillStyle = "rgba(14,74,76,0.11)";
    g.font = "900 22px 'Noto Sans TC', sans-serif";
    g.fillText("DEMO 示範網站", 0, -6);
    g.font = "500 13px 'Noto Sans TC', sans-serif";
    g.fillText("Ninth 九號製作｜未經授權禁止使用", 0, 18);
    return c.toDataURL("image/png");
  }

  var tile = "";
  function paint() {
    var el = document.getElementById("wm");
    if (!el) {
      el = document.createElement("div");
      el.id = "wm";
      el.setAttribute("aria-hidden", "true");
      document.body.appendChild(el);
    }
    var s = "position:fixed;inset:0;z-index:2147483647;pointer-events:none;display:block;opacity:1;visibility:visible;background-repeat:repeat;background-image:url(" + tile + ")";
    if (el.getAttribute("style") !== s) el.setAttribute("style", s);
  }
  function init() { tile = makeTile(); paint(); }

  function start() {
    init();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(init);
    new MutationObserver(function () { if (tile) paint(); })
      .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "id"] });
    setInterval(function () { if (tile) paint(); }, 1500);
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);

  function inField(t) { return t && t.closest && t.closest("input,textarea,select,[contenteditable]"); }

  ["contextmenu", "dragstart"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { e.preventDefault(); });
  });
  ["selectstart", "copy", "cut"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (!inField(e.target)) e.preventDefault(); });
  });
  document.addEventListener("keydown", function (e) {
    var k = (e.key || "").toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (k === "f12" ||
        (mod && ["s", "u", "p"].indexOf(k) > -1) ||
        (mod && ["c", "a", "x"].indexOf(k) > -1 && !inField(e.target)) ||
        (mod && e.shiftKey && ["i", "j", "c"].indexOf(k) > -1) ||
        (e.metaKey && e.altKey && ["i", "j", "u"].indexOf(k) > -1)) {
      e.preventDefault();
    }
  });

  // 網域鎖：只在 Ninth 的網址或本機預覽時顯示
  var h = location.hostname, p = location.pathname;
  var ok = h === "" || h === "localhost" || h === "127.0.0.1" ||
    ((h === "ninthlab99-netizen.github.io" || h === "ninthlab.com.tw" || h === "www.ninthlab.com.tw") &&
      p.indexOf("/maomao-demo") === 0);
  if (!ok) {
    document.documentElement.innerHTML =
      '<body style="font-family:sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#0E4A4C;color:#fff;text-align:center;padding:24px">' +
      '<div><h1 style="font-size:24px">此頁面為 Ninth 九號的網站提案示範</h1>' +
      '<p style="opacity:.8">未經授權不得轉載或使用。如需製作網站，請洽 ninthlab.com.tw</p></div></body>';
  }

  console.log("%c此網站為 Ninth 九號製作的提案示範，版權所有，未經授權禁止複製使用。", "font-size:14px;color:#C2412D;font-weight:bold");
})();
