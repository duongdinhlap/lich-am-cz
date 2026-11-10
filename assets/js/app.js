/* Lịch Âm CZ – Giao diện ứng dụng */
(function () {
  'use strict';
  var L = window.LunarVN;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var MIN_Y = 1900, MAX_Y = 2100;

  /* ---------------- Ngày lễ ---------------- */
  var LUNAR_HOLIDAYS = [
    { d: 1, m: 1, name: 'Tết Nguyên Đán', off: true, major: true },
    { d: 2, m: 1, name: 'Mùng 2 Tết', off: true },
    { d: 3, m: 1, name: 'Mùng 3 Tết', off: true },
    { d: 15, m: 1, name: 'Tết Nguyên Tiêu (Rằm tháng Giêng)', major: true },
    { d: 3, m: 3, name: 'Tết Hàn Thực' },
    { d: 10, m: 3, name: 'Giỗ Tổ Hùng Vương', off: true, major: true },
    { d: 15, m: 4, name: 'Lễ Phật Đản' },
    { d: 5, m: 5, name: 'Tết Đoan Ngọ' },
    { d: 15, m: 7, name: 'Lễ Vu Lan (Rằm tháng Bảy)', major: true },
    { d: 15, m: 8, name: 'Tết Trung Thu', major: true },
    { d: 9, m: 9, name: 'Tết Trùng Cửu' },
    { d: 10, m: 10, name: 'Tết Thường Tân' },
    { d: 15, m: 10, name: 'Tết Hạ Nguyên' },
    { d: 23, m: 12, name: 'Ông Công Ông Táo' },
    { giaoThua: true, name: 'Giao thừa – Tất niên', off: true, major: true }
  ];
  var SOLAR_HOLIDAYS = [
    { d: 1, m: 1, name: 'Tết Dương lịch', off: true, major: true },
    { d: 9, m: 1, name: 'Ngày Học sinh – Sinh viên Việt Nam' },
    { d: 3, m: 2, name: 'Ngày thành lập Đảng Cộng sản Việt Nam' },
    { d: 14, m: 2, name: 'Lễ Tình nhân (Valentine)' },
    { d: 27, m: 2, name: 'Ngày Thầy thuốc Việt Nam' },
    { d: 8, m: 3, name: 'Ngày Quốc tế Phụ nữ' },
    { d: 26, m: 3, name: 'Ngày thành lập Đoàn TNCS Hồ Chí Minh' },
    { d: 21, m: 4, name: 'Ngày Sách và Văn hóa đọc Việt Nam' },
    { d: 30, m: 4, name: 'Ngày Giải phóng miền Nam, thống nhất đất nước', off: true, major: true },
    { d: 1, m: 5, name: 'Ngày Quốc tế Lao động', off: true, major: true },
    { d: 7, m: 5, name: 'Chiến thắng Điện Biên Phủ' },
    { d: 19, m: 5, name: 'Ngày sinh Chủ tịch Hồ Chí Minh' },
    { d: 1, m: 6, name: 'Ngày Quốc tế Thiếu nhi' },
    { d: 28, m: 6, name: 'Ngày Gia đình Việt Nam' },
    { d: 27, m: 7, name: 'Ngày Thương binh – Liệt sĩ' },
    { d: 19, m: 8, name: 'Ngày Cách mạng tháng Tám' },
    { d: 2, m: 9, name: 'Quốc khánh nước CHXHCN Việt Nam', off: true, major: true },
    { d: 10, m: 10, name: 'Ngày Giải phóng Thủ đô' },
    { d: 13, m: 10, name: 'Ngày Doanh nhân Việt Nam' },
    { d: 20, m: 10, name: 'Ngày Phụ nữ Việt Nam' },
    { d: 20, m: 11, name: 'Ngày Nhà giáo Việt Nam' },
    { d: 22, m: 12, name: 'Ngày thành lập Quân đội Nhân dân Việt Nam' },
    { d: 24, m: 12, name: 'Lễ Giáng sinh' }
  ];

  var holCache = {};
  function holidaysOfYear(y) {
    if (holCache[y]) return holCache[y];
    var list = [];
    SOLAR_HOLIDAYS.forEach(function (h) {
      var jd = L.jdFromDate(h.d, h.m, y);
      list.push({ d: h.d, m: h.m, y: y, jd: jd, name: h.name, type: 'solar', off: !!h.off, major: !!h.major, lunar: L.solar2lunar(h.d, h.m, y) });
    });
    [y - 1, y].forEach(function (ly) {
      LUNAR_HOLIDAYS.forEach(function (h) {
        var s;
        if (h.giaoThua) {
          var t = L.lunar2solar(1, 1, ly + 1, 0);
          s = L.jdToDate(L.jdFromDate(t[0], t[1], t[2]) - 1);
        } else {
          s = L.lunar2solar(h.d, h.m, ly, 0);
        }
        if (!s || s[2] !== y) return;
        list.push({ d: s[0], m: s[1], y: y, jd: L.jdFromDate(s[0], s[1], s[2]), name: h.name, type: 'lunar', off: !!h.off, major: !!h.major, lunar: L.solar2lunar(s[0], s[1], s[2]) });
      });
    });
    list.sort(function (a, b) { return a.jd - b.jd || (a.type === 'lunar' ? -1 : 1); });
    var map = {};
    list.forEach(function (h) { (map[h.jd] = map[h.jd] || []).push(h); });
    holCache[y] = { list: list, map: map };
    return holCache[y];
  }
  function holidaysOn(jd) {
    var d = L.jdToDate(jd);
    return holidaysOfYear(d[2]).map[jd] || [];
  }

  /* ---------------- Trạng thái ---------------- */
  function vnNow() { return new Date(Date.now() + 7 * 3600e3); }
  function vnToday() { var n = vnNow(); return { d: n.getUTCDate(), m: n.getUTCMonth() + 1, y: n.getUTCFullYear() }; }
  var TODAY = vnToday();
  var state = {
    sel: { d: TODAY.d, m: TODAY.m, y: TODAY.y },
    view: { m: TODAY.m, y: TODAY.y },
    year: TODAY.y, holYear: TODAY.y, holFilter: 'all'
  };
  function todayJd() { return L.jdFromDate(TODAY.d, TODAY.m, TODAY.y); }
  function clampY(y) { return Math.max(MIN_Y, Math.min(MAX_Y, y)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtLunar(l, withYear) {
    return l.day + '/' + l.month + (l.leap ? ' nhuận' : '') + (withYear ? '/' + l.year : '');
  }
  function lunarMonthName(l) { return 'Tháng ' + L.THANG_AM[l.month - 1] + (l.leap ? ' (nhuận)' : ''); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------------- Sự kiện trong ngày ---------------- */
  function dayEvents(info) {
    var ev = [];
    holidaysOn(info.jd).forEach(function (h) {
      ev.push({ ico: '★', tone: 'red', title: h.name, desc: (h.type === 'lunar' ? 'Lễ âm lịch' : 'Lễ dương lịch') + (h.off ? ' · Ngày nghỉ lễ' : '') });
    });
    var l = info.lunar;
    if (l.day === 1) ev.push({ ico: '☾', tone: 'gold', title: 'Mồng 1 ' + lunarMonthName(l).toLowerCase(), desc: 'Ngày sóc – thắp hương gia tiên, cầu may đầu tháng' });
    if (l.day === 15) ev.push({ ico: '◯', tone: 'gold', title: 'Ngày Rằm', desc: 'Trăng tròn – lễ Phật, cúng gia tiên' });
    if (info.tiet.batDau) ev.push({ ico: '☀', tone: 'gold', title: 'Tiết ' + info.tiet.ten + ' bắt đầu', desc: info.tiet.moTa });
    ev.push(info.sao.tot
      ? { ico: '✓', tone: 'green', title: 'Ngày Hoàng đạo – ' + info.sao.ten, desc: 'Ngày tốt, thuận lợi khởi sự' }
      : { ico: '!', tone: 'red', title: 'Ngày Hắc đạo – ' + info.sao.ten, desc: 'Nên cân nhắc khi làm việc lớn' });
    ev.push({ ico: '✎', tone: info.truc.tot ? 'green' : 'red', title: 'Trực ' + info.truc.ten + ' – nên: ' + info.truc.nen.toLowerCase(), desc: 'Kỵ: ' + info.truc.ky.toLowerCase() });
    if (info.tamNuong) ev.push({ ico: '!', tone: 'red', title: 'Ngày Tam Nương', desc: 'Kiêng khởi công, cưới hỏi, xuất hành xa' });
    if (info.nguyetKy) ev.push({ ico: '!', tone: 'red', title: 'Ngày Nguyệt Kỵ', desc: '“Mùng năm, mười bốn, hăm ba” – tránh việc quan trọng' });
    return ev;
  }

  /* ---------------- Khối Hôm nay ---------------- */
  function renderToday() {
    var s = state.sel;
    var info = L.getDayInfo(s.d, s.m, s.y);
    var l = info.lunar;
    var isToday = info.jd === todayJd();
    var good = info.gio.filter(function (g) { return g.tot; });
    var hols = holidaysOn(info.jd);
    var ev = dayEvents(info);

    var countdown = '';
    if (isToday) {
      var t = L.lunar2solar(1, 1, l.year + 1, 0);
      var left = L.jdFromDate(t[0], t[1], t[2]) - info.jd;
      countdown = '<div class="countdown">Còn <b>' + left + ' ngày</b> nữa đến Tết Nguyên Đán ' + L.canChiYear(l.year + 1) + ' (' + t[0] + '/' + t[1] + '/' + t[2] + ')</div>';
    }

    $('#todayCard').innerHTML =
      '<div class="today-top">' +
        '<div class="today-bar">' +
          '<span class="today-label">' + (isToday ? 'Hôm nay' : 'Ngày đang xem') + '</span>' +
          '<div class="today-nav">' +
            '<button data-step="-1" aria-label="Ngày trước">‹</button>' +
            (isToday ? '' : '<button data-go-today>Hôm nay</button>') +
            '<button data-step="1" aria-label="Ngày sau">›</button>' +
          '</div>' +
        '</div>' +
        '<div class="today-solar">' +
          '<div class="today-big">' + info.d + '</div>' +
          '<div class="today-solar-meta">' +
            '<div class="today-thu">' + info.tenThu + '</div>' +
            '<div class="today-month">Tháng ' + info.m + ' năm ' + info.y + '</div>' +
            '<div class="today-badges">' +
              (l.day === 1 ? '<span class="pill gold">Mồng 1 âm lịch</span>' : '') +
              hols.slice(0, 2).map(function (h) { return '<span class="pill gold">' + esc(h.name) + '</span>'; }).join('') +
              (info.tiet.batDau ? '<span class="pill light">Tiết ' + info.tiet.ten + '</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="today-lunar">' +
        '<div class="lunar-disc"><small>Âm lịch</small><b>' + l.day + '</b></div>' +
        '<div class="lunar-text">' +
          '<h3>' + (l.day === 1 ? 'Mồng 1 · ' : 'Ngày ' + l.day + ' · ') + lunarMonthName(l) + '</h3>' +
          '<p>Năm ' + info.canChi.nam + ' (' + info.conGiap + ') · Tháng ' + (info.monthLen === 30 ? 'đủ (30 ngày)' : 'thiếu (29 ngày)') + '</p>' +
          '<div class="today-badges">' +
            (info.sao.tot ? '<span class="pill good">Hoàng đạo</span>' : '<span class="pill bad">Hắc đạo</span>') +
            '<span class="pill ' + (info.truc.tot ? 'good' : 'bad') + '">Trực ' + info.truc.ten + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="today-body">' +
        '<div class="cc-grid">' +
          '<div class="cc"><small>Ngày</small><b>' + info.canChi.ngay + '</b></div>' +
          '<div class="cc"><small>Tháng</small><b>' + info.canChi.thang + '</b></div>' +
          '<div class="cc"><small>Năm</small><b>' + info.canChi.nam + '</b></div>' +
        '</div>' +
        '<dl class="facts">' +
          '<div><dt>Tiết khí</dt><dd>' + info.tiet.ten + '</dd></div>' +
          '<div><dt>Nạp âm</dt><dd>' + info.napAm + '</dd></div>' +
          '<div><dt>Sao trực nhật</dt><dd>' + info.sao.ten + '</dd></div>' +
          '<div><dt>Xung tuổi</dt><dd>' + info.xungTuoi + '</dd></div>' +
          '<div><dt>Hỷ thần</dt><dd>' + info.hyThan + '</dd></div>' +
          '<div><dt>Tài thần</dt><dd>' + info.taiThan + '</dd></div>' +
        '</dl>' +
        '<div><p class="sub-title">Giờ hoàng đạo</p><div class="hours-good">' +
          good.map(function (g) { return '<div class="hour-chip"><b>' + g.chi + '</b><span>' + g.range + '</span></div>'; }).join('') +
        '</div></div>' +
        '<div><p class="sub-title">Việc quan trọng trong ngày</p><ul class="events">' +
          ev.map(function (e) { return '<li class="event ' + e.tone + '"><span class="ev-ico">' + e.ico + '</span><div><b>' + esc(e.title) + '</b><span>' + esc(e.desc) + '</span></div></li>'; }).join('') +
        '</ul></div>' +
        countdown +
      '</div>';

    renderHours(info, isToday);
  }

  function renderHours(info, isToday) {
    var nowIdx = -1;
    if (isToday) { var h = vnNow().getUTCHours(); nowIdx = Math.floor(((h + 1) % 24) / 2); }
    $('#hoursCard').innerHTML =
      '<h3 class="card-title">12 khung giờ · ' + info.canChi.ngay + '</h3>' +
      '<div class="hours-table">' +
      info.gio.map(function (g) {
        return '<div class="hrow ' + (g.tot ? 'good' : 'bad') + (g.idx === nowIdx ? ' now' : '') + '">' +
          '<div><b>' + g.canChi + '</b><small>' + g.range + ' · ' + g.than + '</small></div>' +
          '<span class="hstate">' + (g.tot ? 'Hoàng đạo' : 'Hắc đạo') + '</span></div>';
      }).join('') +
      '</div>' +
      '<p class="note">Giờ đang diễn ra được viền đỏ. Giờ hoàng đạo do các sao tốt Thanh Long, Minh Đường, Kim Quỹ, Kim Đường, Ngọc Đường, Tư Mệnh cai quản.</p>';
  }

  /* ---------------- Lịch tháng ---------------- */
  function renderMonth() {
    var m = state.view.m, y = state.view.y;
    var first = L.jdFromDate(1, m, y);
    var days = L.daysInMonth(m, y);
    var lead = (L.weekday(first) + 6) % 7;
    var total = Math.ceil((lead + days) / 7) * 7;
    var tJd = todayJd(), sJd = L.jdFromDate(state.sel.d, state.sel.m, state.sel.y);
    var html = '';
    for (var i = 0; i < total; i++) {
      var jd = first - lead + i;
      var dt = L.jdToDate(jd);
      var l = L.lunarFromJd(jd);
      var hols = holidaysOn(jd);
      var wd = L.weekday(jd);
      var cls = ['cell'];
      if (dt[1] !== m) cls.push('other');
      if (wd === 0) cls.push('sun');
      if (l.day === 1) cls.push('m1');
      if (l.day === 15) cls.push('ram');
      if (hols.some(function (h) { return h.off; })) cls.push('off');
      if (jd === tJd) cls.push('today');
      if (jd === sJd) cls.push('sel');
      var good = L.saoNgay(jd, l.month).tot;
      var lun = l.day === 1
        ? '<span class="badge-m1">1/' + l.month + (l.leap ? 'N' : '') + '</span>'
        : '<span class="lun">' + l.day + '</span>';
      var label = dt[0] + '/' + dt[1] + '/' + dt[2] + ', âm lịch ' + fmtLunar(l, true) + (hols.length ? ', ' + hols.map(function (h) { return h.name; }).join(', ') : '');
      html += '<button class="' + cls.join(' ') + '" data-jd="' + jd + '" aria-label="' + esc(label) + '">' +
        (good ? '<span class="dot-h" aria-hidden="true"></span>' : '') +
        '<span class="sol">' + dt[0] + '</span>' + lun +
        (hols.length ? '<span class="ev">' + esc(hols[0].name) + '</span><span class="dot-e" aria-hidden="true"></span>' : '') +
        '</button>';
    }
    $('#monthGrid').innerHTML = html;
    $('#monthTitle').textContent = 'Tháng ' + m + ' · ' + y;
    var l1 = L.lunarFromJd(first), l2 = L.lunarFromJd(first + days - 1);
    var sub = 'Âm lịch: ' + lunarMonthName(l1).replace('Tháng ', 'tháng ') +
      (l1.month !== l2.month || l1.leap !== l2.leap ? ' – ' + lunarMonthName(l2).replace('Tháng ', 'tháng ') : '') +
      ' · năm ' + L.canChiYear(l2.year);
    $('#monthSub').textContent = sub;
    $('#selMonth').value = m;
    $('#selYear').value = y;
  }

  function shiftMonth(delta) {
    var m = state.view.m + delta, y = state.view.y;
    if (m < 1) { m = 12; y--; } else if (m > 12) { m = 1; y++; }
    if (y < MIN_Y || y > MAX_Y) return;
    state.view = { m: m, y: y };
    renderMonth();
  }

  function selectJd(jd, keepView) {
    var d = L.jdToDate(jd);
    if (d[2] < MIN_Y || d[2] > MAX_Y) return;
    state.sel = { d: d[0], m: d[1], y: d[2] };
    if (!keepView || state.view.m !== d[1] || state.view.y !== d[2]) state.view = { m: d[1], y: d[2] };
    renderMonth();
    renderToday();
  }

  /* ---------------- Lịch năm ---------------- */
  function renderYear() {
    var y = state.year, tJd = todayJd();
    $('#yearTitle').textContent = 'Năm ' + y;
    var leap = L.getLeapMonth(y);
    $('#yearSub').textContent = 'Âm lịch ' + L.canChiYear(y) + ' (' + L.conGiap(y) + ') · ' + L.napAmYear(y) + (leap ? ' · nhuận tháng ' + leap : '');
    var hol = holidaysOfYear(y).map;
    var out = '';
    for (var m = 1; m <= 12; m++) {
      var first = L.jdFromDate(1, m, y), days = L.daysInMonth(m, y);
      var lead = (L.weekday(first) + 6) % 7;
      var g = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(function (w, i) { return '<span class="wd' + (i === 6 ? ' sun' : '') + '">' + w + '</span>'; }).join('');
      for (var k = 0; k < lead; k++) g += '<span></span>';
      var m1s = [];
      for (var d = 1; d <= days; d++) {
        var jd = first + d - 1, l = L.lunarFromJd(jd);
        var c = ['d'];
        if (L.weekday(jd) === 0) c.push('sun');
        if (hol[jd]) c.push('hd');
        if (l.day === 1) { c.push('m1'); m1s.push('<b>' + d + '/' + m + '</b> → mồng 1 tháng ' + l.month + (l.leap ? ' nhuận' : '')); }
        if (jd === tJd) c.push('today');
        g += '<span class="' + c.join(' ') + '" title="Âm lịch ' + fmtLunar(l, true) + '">' + d + '</span>';
      }
      out += '<div class="mini" data-m="' + m + '" role="button" tabindex="0" aria-label="Xem tháng ' + m + '">' +
        '<h3>Tháng ' + m + '</h3><div class="mini-grid">' + g + '</div>' +
        '<div class="mini-foot">' + m1s.join('<br>') + '</div></div>';
    }
    $('#yearGrid').innerHTML = out;
  }

  /* ---------------- Ngày lễ & tiết khí ---------------- */
  function renderHolidays() {
    var y = state.holYear, tJd = todayJd();
    $('#holTitle').textContent = 'Ngày lễ năm ' + y;
    $('#holSub').textContent = 'Năm ' + L.canChiYear(y) + ' · Lễ âm lịch và dương lịch Việt Nam';
    var f = state.holFilter;
    var list = holidaysOfYear(y).list.filter(function (h) {
      return f === 'all' || (f === 'off' ? h.off : h.type === f);
    });
    var byMonth = {};
    list.forEach(function (h) { (byMonth[h.m] = byMonth[h.m] || []).push(h); });
    var html = '';
    Object.keys(byMonth).sort(function (a, b) { return a - b; }).forEach(function (m) {
      html += '<div class="hol-month"><h4>Tháng ' + m + '</h4>';
      byMonth[m].forEach(function (h) {
        var diff = h.jd - tJd;
        var left = diff === 0 ? 'Hôm nay' : diff > 0 ? 'Còn ' + diff + ' ngày' : 'Đã qua';
        html += '<div class="hol ' + h.type + (h.off ? ' off' : '') + (diff < 0 ? ' past' : '') + '" data-jd="' + h.jd + '" role="button" tabindex="0">' +
          '<div class="hol-date"><b>' + pad(h.d) + '</b><small>' + L.THU[L.weekday(h.jd)].replace('Thứ ', 'T.').replace('Chủ nhật', 'CN') + '</small></div>' +
          '<div class="hol-name"><b>' + esc(h.name) + '</b><small>' + h.d + '/' + h.m + '/' + h.y + ' · Âm lịch ' + fmtLunar(h.lunar) + '</small>' +
          '<div class="hol-tags"><span class="mini-tag ' + (h.type === 'lunar' ? 'am">Âm lịch' : 'duong">Dương lịch') + '</span>' + (h.off ? '<span class="mini-tag nghi">Nghỉ lễ</span>' : '') + '</div></div>' +
          '<div class="hol-left' + (diff >= 0 && diff <= 30 ? ' soon' : '') + '">' + left + '</div></div>';
      });
      html += '</div>';
    });
    $('#holList').innerHTML = html || '<p class="muted">Không có ngày lễ phù hợp.</p>';

    var tk = L.tietKhiTrongNam(y);
    var cur = L.tietKhi(tJd).idx;
    $('#tkTitle').textContent = '24 tiết khí năm ' + y;
    $('#tkList').innerHTML = tk.map(function (t, i) {
      var isCur = y === TODAY.y && t.idx === cur;
      return '<li class="' + (isCur ? 'current' : '') + '" data-jd="' + t.jd + '"><span class="tk-i">' + (i + 1) + '</span>' +
        '<div><b>' + t.ten + (isCur ? ' · hiện tại' : '') + '</b><small>' + t.moTa + '</small></div>' +
        '<span class="tk-d">' + pad(t.d) + '/' + pad(t.m) + '</span></li>';
    }).join('');
  }

  /* ---------------- Đổi ngày ---------------- */
  function resultBlock(label, main, sub, jd) {
    return '<div class="r-label">' + label + '</div><div class="r-main">' + main + '</div><div class="r-sub">' + sub + '</div>' +
      (jd ? '<button class="link-btn" data-open-jd="' + jd + '">Xem chi tiết ngày này →</button>' : '');
  }
  function errBlock(msg) { return '<div class="r-err">' + msg + '</div>'; }

  function convertS2L() {
    var d = +$('#sD').value, m = +$('#sM').value, y = +$('#sY').value;
    var out = $('#resS2L');
    if (!(y >= MIN_Y && y <= MAX_Y) || !(m >= 1 && m <= 12) || !(d >= 1 && d <= L.daysInMonth(m, y))) {
      out.innerHTML = errBlock('Ngày dương lịch không hợp lệ (hỗ trợ năm ' + MIN_Y + '–' + MAX_Y + ').');
      return;
    }
    var info = L.getDayInfo(d, m, y), l = info.lunar;
    var hol = holidaysOn(info.jd).map(function (h) { return h.name; }).join(', ');
    out.innerHTML = resultBlock('Âm lịch',
      (l.day === 1 ? 'Mồng 1' : 'Ngày ' + l.day) + ' ' + lunarMonthName(l).toLowerCase() + '<br>năm ' + info.canChi.nam,
      info.tenThu + ', ' + d + '/' + m + '/' + y + '<br>Ngày ' + info.canChi.ngay + ' · Tháng ' + info.canChi.thang +
      '<br>' + (info.sao.tot ? 'Hoàng đạo' : 'Hắc đạo') + ' · Trực ' + info.truc.ten + ' · Tiết ' + info.tiet.ten +
      (hol ? '<br><strong style="color:var(--red)">' + esc(hol) + '</strong>' : ''), info.jd);
  }

  function convertL2S() {
    var d = +$('#lD').value, m = +$('#lM').value, y = +$('#lY').value, leap = $('#lLeap').checked ? 1 : 0;
    var out = $('#resL2S');
    if (!(y >= MIN_Y && y <= MAX_Y) || !(m >= 1 && m <= 12) || !(d >= 1 && d <= 30)) {
      out.innerHTML = errBlock('Ngày âm lịch không hợp lệ.');
      return;
    }
    var lm = L.getLeapMonth(y);
    if (leap && lm !== m) {
      out.innerHTML = errBlock('Năm ' + y + ' (' + L.canChiYear(y) + ') ' + (lm ? 'chỉ nhuận tháng ' + lm + '.' : 'không có tháng nhuận.'));
      return;
    }
    var s = L.lunar2solar(d, m, y, leap);
    if (!s) { out.innerHTML = errBlock('Không tìm được ngày tương ứng.'); return; }
    var back = L.solar2lunar(s[0], s[1], s[2]);
    if (back.day !== d || back.month !== m || back.leap !== leap) {
      out.innerHTML = errBlock('Tháng ' + m + (leap ? ' nhuận' : '') + ' năm ' + y + ' chỉ có 29 ngày (tháng thiếu).');
      return;
    }
    var info = L.getDayInfo(s[0], s[1], s[2]);
    out.innerHTML = resultBlock('Dương lịch',
      info.tenThu + '<br>' + s[0] + '/' + s[1] + '/' + s[2],
      'Âm lịch ' + d + '/' + m + (leap ? ' nhuận' : '') + ' năm ' + info.canChi.nam + '<br>Ngày ' + info.canChi.ngay + ' · ' + (info.sao.tot ? 'Hoàng đạo' : 'Hắc đạo') +
      (lm ? '<br><small>Năm ' + y + ' nhuận tháng ' + lm + '</small>' : ''), info.jd);
  }

  function renderQuick() {
    var tJd = todayJd(), t = L.lunarFromJd(tJd);
    var items = [];
    var tetY = t.year + 1, tet = L.lunar2solar(1, 1, tetY, 0);
    items.push({ name: 'Tết Nguyên Đán ' + L.canChiYear(tetY), jd: L.jdFromDate(tet[0], tet[1], tet[2]) });
    // Mồng 1 và Rằm sắp tới
    for (var jd = tJd + 1; jd < tJd + 32; jd++) {
      var l = L.lunarFromJd(jd);
      if (l.day === 1 && !items.some(function (i) { return i.k === 'm1'; })) items.push({ k: 'm1', name: 'Mồng 1 tháng ' + l.month + (l.leap ? ' nhuận' : '') + ' âm lịch', jd: jd });
      if (l.day === 15 && !items.some(function (i) { return i.k === 'ram'; })) items.push({ k: 'ram', name: 'Rằm tháng ' + l.month + (l.leap ? ' nhuận' : '') + ' âm lịch', jd: jd });
    }
    var upcoming = holidaysOfYear(TODAY.y).list.concat(holidaysOfYear(TODAY.y + 1).list)
      .filter(function (h) { return h.jd > tJd && h.major; }).slice(0, 4);
    upcoming.forEach(function (h) { if (!items.some(function (i) { return i.jd === h.jd; })) items.push({ name: h.name, jd: h.jd }); });
    items.sort(function (a, b) { return a.jd - b.jd; });
    $('#quickList').innerHTML = items.map(function (i) {
      var d = L.jdToDate(i.jd);
      return '<div class="quick" data-jd="' + i.jd + '" role="button" tabindex="0"><div><b>' + esc(i.name) + '</b><small>' + L.THU[L.weekday(i.jd)] + ', ' + d[0] + '/' + d[1] + '/' + d[2] + '</small></div>' +
        '<div class="days">' + (i.jd - tJd) + '<small>ngày nữa</small></div></div>';
    }).join('');
  }

  /* ---------------- Điều hướng tab ---------------- */
  var rendered = {};
  function showTab(name) {
    if (!$('[data-view="' + name + '"]')) name = 'lich';
    $$('.view').forEach(function (v) { v.hidden = v.dataset.view !== name; });
    $$('.tab').forEach(function (t) {
      var on = t.dataset.tab === name;
      t.classList.toggle('active', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    if (name === 'nam' && rendered.nam !== state.year) { renderYear(); rendered.nam = state.year; }
    if (name === 'le') renderHolidays();
    if (name === 'doi' && !rendered.doi) { renderQuick(); rendered.doi = true; }
    window.scrollTo(0, 0);
  }
  function route() { showTab((location.hash || '#lich').slice(1)); }

  /* ---------------- Khởi tạo ---------------- */
  function init() {
    var sm = $('#selMonth'), sy = $('#selYear');
    for (var m = 1; m <= 12; m++) sm.add(new Option('Tháng ' + m, m));
    for (var y = MIN_Y; y <= MAX_Y; y++) sy.add(new Option('Năm ' + y, y));

    $('#prevMonth').onclick = function () { shiftMonth(-1); };
    $('#nextMonth').onclick = function () { shiftMonth(1); };
    sm.onchange = function () { state.view.m = +sm.value; renderMonth(); };
    sy.onchange = function () { state.view.y = +sy.value; renderMonth(); };
    $('#btnToday').onclick = function () { selectJd(todayJd()); };

    $('#monthGrid').addEventListener('click', function (e) {
      var c = e.target.closest('.cell'); if (!c) return;
      selectJd(+c.dataset.jd, true);
      if (window.innerWidth < 980) $('#todayCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#todayCard').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var cur = L.jdFromDate(state.sel.d, state.sel.m, state.sel.y);
      if (b.dataset.step) selectJd(cur + (+b.dataset.step));
      if ('goToday' in b.dataset) selectJd(todayJd());
    });

    // Vuốt để đổi tháng
    var sx = 0, sY = 0;
    var grid = $('#monthGrid');
    grid.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sY = e.touches[0].clientY; }, { passive: true });
    grid.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) shiftMonth(dx < 0 ? 1 : -1);
    }, { passive: true });

    // Lịch năm
    $('#prevYear').onclick = function () { state.year = clampY(state.year - 1); renderYear(); rendered.nam = state.year; };
    $('#nextYear').onclick = function () { state.year = clampY(state.year + 1); renderYear(); rendered.nam = state.year; };
    function openMini(e) {
      var mc = e.target.closest('.mini'); if (!mc) return;
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      state.view = { m: +mc.dataset.m, y: state.year };
      renderMonth();
      location.hash = '#lich';
    }
    $('#yearGrid').addEventListener('click', openMini);
    $('#yearGrid').addEventListener('keydown', openMini);

    // Mở ngày từ danh sách
    function openJd(e) {
      var el = e.target.closest('[data-jd],[data-open-jd]'); if (!el) return;
      if (e.type === 'keydown' && e.key !== 'Enter') return;
      selectJd(+(el.dataset.openJd || el.dataset.jd));
      location.hash = '#lich';
    }
    ['#holList', '#tkList', '#quickList', '#resS2L', '#resL2S'].forEach(function (s) {
      $(s).addEventListener('click', openJd);
      $(s).addEventListener('keydown', openJd);
    });

    // Ngày lễ
    $('#prevHolYear').onclick = function () { state.holYear = clampY(state.holYear - 1); renderHolidays(); };
    $('#nextHolYear').onclick = function () { state.holYear = clampY(state.holYear + 1); renderHolidays(); };
    $$('.filter').forEach(function (b) {
      b.onclick = function () {
        state.holFilter = b.dataset.filter;
        $$('.filter').forEach(function (x) { x.classList.toggle('active', x === b); });
        renderHolidays();
      };
    });

    // Đổi ngày
    $('#sD').value = TODAY.d; $('#sM').value = TODAY.m; $('#sY').value = TODAY.y;
    var tl = L.lunarFromJd(todayJd());
    $('#lD').value = tl.day; $('#lM').value = tl.month; $('#lY').value = tl.year; $('#lLeap').checked = !!tl.leap;
    $('#formS2L').onsubmit = function (e) { e.preventDefault(); convertS2L(); };
    $('#formL2S').onsubmit = function (e) { e.preventDefault(); convertL2S(); };

    renderMonth();
    renderToday();
    window.addEventListener('hashchange', route);
    route();

    // Tự cập nhật khi qua ngày mới (app mở lâu / quay lại từ nền)
    function refreshDay() {
      var n = vnToday();
      if (n.d !== TODAY.d || n.m !== TODAY.m || n.y !== TODAY.y) {
        var wasToday = state.sel.d === TODAY.d && state.sel.m === TODAY.m && state.sel.y === TODAY.y;
        TODAY = n; rendered = {};
        if (wasToday) selectJd(todayJd()); else { renderMonth(); renderToday(); }
        route();
      } else if (!$('#view-lich').hidden) {
        renderHours(L.getDayInfo(state.sel.d, state.sel.m, state.sel.y), L.jdFromDate(state.sel.d, state.sel.m, state.sel.y) === todayJd());
      }
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) refreshDay(); });
    setInterval(refreshDay, 60000);

    setupInstall();
  }

  /* ---------------- PWA ---------------- */
  function setupInstall() {
    var btn = $('#btnInstall'), deferred = null;
    var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (standalone) return;
    if (isIOS) btn.hidden = false;
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; btn.hidden = false; });
    window.addEventListener('appinstalled', function () { btn.hidden = true; });
    btn.onclick = function () {
      if (deferred) {
        deferred.prompt();
        deferred.userChoice.finally(function () { deferred = null; btn.hidden = true; });
      } else {
        $('#iosSheet').hidden = false;
      }
    };
    $('#iosClose').onclick = function () { $('#iosSheet').hidden = true; };
    $('#iosSheet').onclick = function (e) { if (e.target.id === 'iosSheet') e.currentTarget.hidden = true; };
  }

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  init();
})();
