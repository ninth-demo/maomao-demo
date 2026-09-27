/* 前台共用：頁首、頁尾、手機底部按鈕 */
(function () {
  "use strict";

  var SHOP = {
    tel: "02-2255-3006",
    telHref: "tel:0222553006",
    address: "新北市板橋區民生路三段 293 號",
    ig: "https://www.instagram.com/maomao_house/",
    fb: "https://www.facebook.com/maomaobathouse/"
  };
  window.SHOP = SHOP;

  var NAV = [
    ["index.html", "首頁"],
    ["services.html", "服務價目"],
    ["self-wash.html", "自助洗怎麼用"],
    ["hand-dry.html", "堅持手吹"],
    ["news.html", "最新消息"],
    ["visit.html", "預約與交通"]
  ];

  var PAW = '<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="#0E4A4C"><ellipse cx="16" cy="21" rx="7" ry="6"/><circle cx="7.5" cy="13.5" r="3"/><circle cx="12.5" cy="8.5" r="3"/><circle cx="19.5" cy="8.5" r="3"/><circle cx="24.5" cy="13.5" r="3"/></g></svg>';
  window.PAW = PAW;

  var page = document.body.getAttribute("data-page");

  var head = document.getElementById("site-head");
  if (head) {
    head.className = "site-head";
    head.innerHTML =
      '<div class="wrap">' +
        '<a class="brand" href="index.html"><span class="brand-mark">' + PAW + '</span>毛毛澡堂</a>' +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="main-nav">選單</button>' +
        '<nav class="nav" id="main-nav" aria-label="主選單">' +
          NAV.map(function (n) {
            var cur = n[0] === page ? ' aria-current="page"' : "";
            return '<a href="' + n[0] + '"' + cur + ">" + n[1] + "</a>";
          }).join("") +
        "</nav>" +
      "</div>";
    var btn = head.querySelector(".menu-btn"), nav = head.querySelector(".nav");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "關閉" : "選單";
    });
  }

  var bar = document.createElement("div");
  bar.className = "demo-bar";
  bar.setAttribute("role", "note");
  bar.innerHTML = "這是 <strong>Ninth 九號</strong> 為毛毛澡堂製作的網站提案示範，並非官方網站。　<a href=\"admin/index.html\" style=\"color:#FFD166\">試用商家後台</a>";
  document.body.insertBefore(bar, document.body.firstChild);

  var foot = document.getElementById("site-foot");
  if (foot) {
    var data = MM.Store.load();
    var hoursRows = [1, 2, 3, 4, 5, 6, 0].map(function (d) {
      var h = data.hours[d];
      return "<li>" + MM.WEEK[d] + "　" + (h ? h[0] + "～" + h[1] : "公休") + "</li>";
    }).join("");
    foot.className = "site-foot";
    foot.innerHTML =
      '<div class="wrap">' +
        '<div class="foot-grid">' +
          "<div><h2>毛毛澡堂</h2><p>寵物專業美容、寵物自助澡堂、寵物鮮食。<br>堅持手吹，不使用烘箱。</p>" +
            '<ul style="margin-top:14px"><li><a href="' + SHOP.telHref + '">' + SHOP.tel + "</a></li><li>" + SHOP.address + "</li>" +
            '<li><a href="' + SHOP.ig + '" target="_blank" rel="noopener">Instagram @maomao_house</a></li>' +
            '<li><a href="' + SHOP.fb + '" target="_blank" rel="noopener">Facebook 粉絲專頁</a></li></ul></div>' +
          "<div><h2>營業時間</h2><ul>" + hoursRows + "</ul></div>" +
          "<div><h2>網站導覽</h2><ul>" + NAV.map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + "</a></li>"; }).join("") + "</ul></div>" +
        "</div>" +
        '<div class="foot-legal"><span>價格與公告為示範內容，實際請以店家公告為準。</span>' +
        '<span>網站提案示範，由 <a href="https://ninthlab.com.tw/" target="_blank" rel="noopener">Ninth 九號</a> 設計製作，未經授權請勿轉載使用</span></div>' +
      "</div>";
  }

  var dock = document.createElement("div");
  dock.className = "dock";
  dock.innerHTML = '<a class="btn btn-primary" href="' + SHOP.telHref + '">打電話</a><a class="btn btn-soap" href="visit.html#book">線上預約</a>';
  document.body.appendChild(dock);
})();
