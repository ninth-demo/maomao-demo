/* 毛毛澡堂：網站資料
 * 示範版把資料存在瀏覽器（localStorage）。正式版把 Store 換成資料庫即可，頁面程式不用改。
 */
(function (global) {
  "use strict";

  var KEY = "maomao-demo-v1";
  var DOG = ["小型犬", "中型犬", "大型犬"];
  var DOG_SUB = ["8 公斤以下", "8～15 公斤", "15 公斤以上"];

  var CATS = [
    { id: "groom", name: "專業美容", cols: DOG, sub: DOG_SUB,
      intro: "交給美容師處理。全程手吹，不進烘箱。" },
    { id: "self", name: "自助澡堂", cols: DOG, sub: DOG_SUB,
      intro: "自己幫毛孩洗。洗劑、毛巾、吹水機、吹風機都準備好了。" },
    { id: "food", name: "寵物鮮食", cols: ["價格"], sub: [""],
      intro: "店內販售的鮮食，可以洗完澡順便帶回家。" }
  ];

  var SEED = {
    prices: [
      { id: "p1", cat: "groom", name: "精緻洗澡", desc: "含手吹、剪指甲、清耳朵、擠肛門腺", prices: [600, 900, 1300] },
      { id: "p2", cat: "groom", name: "大美容", desc: "精緻洗澡＋全身造型修剪", prices: [1200, 1600, 2200] },
      { id: "p3", cat: "groom", name: "局部修剪", desc: "腳底毛、屁屁毛、眼周修剪", prices: [150, 150, 200] },
      { id: "p4", cat: "self", name: "自助洗澡 60 分鐘", desc: "含洗劑、毛巾、吹水機、吹風機", prices: [300, 400, 550] },
      { id: "p5", cat: "self", name: "超時加收", desc: "超過 60 分鐘，每 30 分鐘", prices: [100, 100, 150] },
      { id: "p6", cat: "food", name: "雞肉鮮食包 150g", desc: "", prices: [90] },
      { id: "p7", cat: "food", name: "牛肉鮮食包 150g", desc: "", prices: [120] },
      { id: "p8", cat: "food", name: "鮮食試吃組", desc: "雞肉、牛肉各兩包", prices: [380] }
    ],
    news: [
      { id: "n1", date: "2026-01-24", tag: "服務調整", pinned: true,
        title: "115 年 2 月 16 日起調整部分服務內容",
        body: "毛毛澡堂將於 115 年 2 月 16 日起調整部分服務內容。\n\n詳細調整的項目與價格，歡迎來電 02-2255-3006，或私訊 Instagram @maomao_house 詢問。\n\n（示範內容：實際公告由店家在後台更新。）" },
      { id: "n2", date: "2026-09-01", tag: "營業時間", pinned: false,
        title: "每週二、週三固定公休",
        body: "毛毛澡堂每週二、週三固定公休，其他日子 11:00 到 20:00 營業。\n\n國定假日或臨時公休會另外在這裡公告，出門前可以先看一下。" },
      { id: "n3", date: "2026-08-15", tag: "自助洗", pinned: false,
        title: "第一次來自助洗？先看這篇",
        body: "自助洗不用自己帶洗劑和毛巾，店裡都準備好了。\n\n第一次來建議先打電話確認時段，並預留 60 分鐘。大型犬的吹乾時間比較長，可以多抓 30 分鐘。\n\n完整流程請看「自助洗怎麼用」頁面。（示範內容）" }
    ],
    hours: { 0: ["11:00", "20:00"], 1: ["11:00", "20:00"], 2: null, 3: null,
             4: ["11:00", "20:00"], 5: ["11:00", "20:00"], 6: ["11:00", "20:00"] },
    closures: [],
    bookings: []
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var Store = {
    load: function () {
      try {
        var raw = localStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return clone(SEED);
    },
    save: function (data) {
      try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
    },
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      return clone(SEED);
    }
  };

  var WEEK = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  // 一律用台北時間
  function taipeiNow() {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    var date = o.year + "-" + o.month + "-" + o.day;
    return { date: date, time: (o.hour === "24" ? "00" : o.hour) + ":" + o.minute, day: new Date(date + "T00:00:00Z").getUTCDay() };
  }

  function statusFor(data, dateStr) {
    var now = taipeiNow();
    dateStr = dateStr || now.date;
    var day = new Date(dateStr + "T00:00:00Z").getUTCDay();
    var closure = (data.closures || []).filter(function (c) { return c.date === dateStr; })[0];
    if (closure) return { open: false, text: "今天臨時公休" + (closure.reason ? "（" + closure.reason + "）" : ""), closure: closure };
    var h = data.hours[day];
    if (!h) return { open: false, text: WEEK[day] + "固定公休" };
    if (dateStr === now.date) {
      if (now.time < h[0]) return { open: false, text: "今天 " + h[0] + " 開門" };
      if (now.time >= h[1]) return { open: false, text: "今天已打烊，營業到 " + h[1] };
      return { open: true, text: "營業中，今天開到 " + h[1] };
    }
    return { open: true, text: h[0] + "～" + h[1] };
  }

  function money(n) { return "NT$" + Number(n).toLocaleString("zh-TW"); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function paras(s) {
    return esc(s).split(/\n{2,}/).map(function (p) { return "<p>" + p.replace(/\n/g, "<br>") + "</p>"; }).join("");
  }

  function sortedNews(data) {
    return data.news.slice().sort(function (a, b) {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.date < b.date ? 1 : -1;
    });
  }

  global.MM = { KEY: KEY, CATS: CATS, WEEK: WEEK, Store: Store, taipeiNow: taipeiNow, statusFor: statusFor,
                money: money, esc: esc, paras: paras, sortedNews: sortedNews };
})(window);
