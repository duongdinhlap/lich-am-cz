/*!
 * Lịch Âm CZ – Bộ tính toán Âm lịch Việt Nam
 * Thuật toán chuyển đổi dựa trên công trình của Hồ Ngọc Đức
 * (https://www.informatik.uni-leipzig.de/~duc/amlich/), múi giờ UTC+7.
 */
(function (root) {
  'use strict';

  var TZ = 7; // Múi giờ Việt Nam
  var PI = Math.PI;

  var CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  var CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  var CON_GIAP = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];
  var THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  var THANG_AM = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Chạp'];

  // 24 tiết khí, bắt đầu từ Xuân phân (kinh độ Mặt Trời 0°), mỗi tiết 15°
  var TIET_KHI = [
    'Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng',
    'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ',
    'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết',
    'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'
  ];
  var TIET_KHI_MO_TA = [
    'Giữa xuân, ngày đêm dài bằng nhau', 'Trời trong sáng, tiết tảo mộ', 'Mưa rào, lợi cho cây cốc',
    'Bắt đầu mùa hạ', 'Lúa đầy hạt, mưa vừa', 'Lúa trổ bông, gieo trồng',
    'Giữa hạ, ngày dài nhất năm', 'Nóng nhẹ', 'Nóng oi bức nhất',
    'Bắt đầu mùa thu', 'Hết nóng, mưa ngâu', 'Nắng nhạt, sương trắng',
    'Giữa thu, ngày đêm dài bằng nhau', 'Mát mẻ, sương lạnh', 'Sương mù xuất hiện',
    'Bắt đầu mùa đông', 'Tuyết nhẹ, rét nhẹ', 'Tuyết dày, rét đậm',
    'Giữa đông, đêm dài nhất năm', 'Rét nhẹ', 'Rét đậm nhất năm',
    'Bắt đầu mùa xuân', 'Mưa ẩm, mưa phùn', 'Sâu nở, sấm động'
  ];

  // 12 thần trực nhật (Hoàng đạo / Hắc đạo)
  var THAN = ['Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước', 'Kim Quỹ', 'Kim Đường',
    'Bạch Hổ', 'Ngọc Đường', 'Thiên Lao', 'Huyền Vũ', 'Tư Mệnh', 'Câu Trận'];
  var THAN_TOT = [1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0];

  // Thập nhị trực
  var TRUC = [
    { ten: 'Kiến', nen: 'Xuất hành, khai trương, nhậm chức, giá thú', ky: 'Động thổ, đào giếng, mai táng', tot: 1 },
    { ten: 'Trừ', nen: 'Giải trừ, chữa bệnh, dọn dẹp, tẩy uế', ky: 'Cưới hỏi, khai trương, đi xa', tot: 1 },
    { ten: 'Mãn', nen: 'Cầu tài, cúng tế, mở kho, xuất hàng', ky: 'Kiện tụng, nhậm chức, chữa bệnh', tot: 1 },
    { ten: 'Bình', nen: 'Sửa đường, trang trí nhà cửa, giao dịch', ky: 'Đào mương, khơi ngòi, kiện tụng', tot: 1 },
    { ten: 'Định', nen: 'Cưới hỏi, ký kết, nhập học, mua bán', ky: 'Kiện tụng, xuất hành xa', tot: 1 },
    { ten: 'Chấp', nen: 'Xây dựng, trồng cây, tuyển người', ky: 'Xuất tiền, dời nhà, đi xa', tot: 1 },
    { ten: 'Phá', nen: 'Phá dỡ nhà cũ, chữa bệnh, săn bắt', ky: 'Cưới hỏi, khai trương, ký kết', tot: 0 },
    { ten: 'Nguy', nen: 'Cúng lễ, cầu an, an táng', ky: 'Leo cao, đi thuyền, làm việc lớn', tot: 0 },
    { ten: 'Thành', nen: 'Khai trương, cưới hỏi, nhập trạch, ký kết', ky: 'Kiện tụng, tranh chấp', tot: 1 },
    { ten: 'Thu', nen: 'Thu hoạch, thu nợ, nhập kho, mua sắm', ky: 'An táng, khai trương, đi xa', tot: 1 },
    { ten: 'Khai', nen: 'Khai trương, xuất hành, động thổ, nhập học', ky: 'An táng, chôn cất', tot: 1 },
    { ten: 'Bế', nen: 'Đắp đê, lấp hố, xây tường, an táng', ky: 'Khai trương, chữa mắt, xuất hành', tot: 0 }
  ];

  // Ngũ hành nạp âm (30 cặp trong vòng Lục thập hoa giáp)
  var NAP_AM = [
    'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim',
    'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc',
    'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy',
    'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim',
    'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc',
    'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'
  ];

  var HY_THAN = ['Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam'];
  var TAI_THAN = ['Đông Nam', 'Đông Nam', 'Chính Đông', 'Chính Đông', 'Chính Bắc',
    'Chính Nam', 'Tây Nam', 'Tây Nam', 'Chính Tây', 'Tây Bắc'];

  /* ---------------- Thuật toán Hồ Ngọc Đức ---------------- */

  function INT(d) { return Math.floor(d); }

  function jdFromDate(dd, mm, yy) {
    var a = INT((14 - mm) / 12);
    var y = yy + 4800 - a;
    var m = mm + 12 * a - 3;
    var jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    }
    return jd;
  }

  function jdToDate(jd) {
    var a, b, c;
    if (jd > 2299160) {
      a = jd + 32044;
      b = INT((4 * a + 3) / 146097);
      c = a - INT((b * 146097) / 4);
    } else {
      b = 0;
      c = jd + 32082;
    }
    var d = INT((4 * c + 3) / 1461);
    var e = c - INT((1461 * d) / 4);
    var m = INT((5 * e + 2) / 153);
    var day = e - INT((153 * m + 2) / 5) + 1;
    var month = m + 3 - 12 * INT(m / 10);
    var year = b * 100 + d - 4800 + INT(m / 10);
    return [day, month, year];
  }

  function NewMoon(k) {
    var T = k / 1236.85;
    var T2 = T * T, T3 = T2 * T, dr = PI / 180;
    var Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    var Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    var F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    var C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    var deltat;
    if (T < -11) {
      deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
      deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    return Jd1 + C1 - deltat;
  }

  // Kinh độ Mặt Trời (radian) tại thời điểm jdn (giờ UT)
  function SunLongitude(jdn) {
    var T = (jdn - 2451545.0) / 36525;
    var T2 = T * T, dr = PI / 180;
    var M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    var L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    var L = (L0 + DL) * dr;
    L = L - PI * 2 * INT(L / (PI * 2));
    return L;
  }

  function getSunLongitude(dayNumber, timeZone) {
    return INT(SunLongitude(dayNumber - 0.5 - timeZone / 24) / PI * 6);
  }

  function getNewMoonDay(k, timeZone) {
    return INT(NewMoon(k) + 0.5 + timeZone / 24);
  }

  function getLunarMonth11(yy, timeZone) {
    var off = jdFromDate(31, 12, yy) - 2415021;
    var k = INT(off / 29.530588853);
    var nm = getNewMoonDay(k, timeZone);
    var sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) nm = getNewMoonDay(k - 1, timeZone);
    return nm;
  }

  function getLeapMonthOffset(a11, timeZone) {
    var k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    var last, i = 1;
    var arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
  }

  function solar2lunar(dd, mm, yy, timeZone) {
    if (timeZone === undefined) timeZone = TZ;
    var dayNumber = jdFromDate(dd, mm, yy);
    var k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    var monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) monthStart = getNewMoonDay(k, timeZone);
    var a11 = getLunarMonth11(yy, timeZone);
    var b11 = a11;
    var lunarYear;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
      b11 = getLunarMonth11(yy + 1, timeZone);
    }
    var lunarDay = dayNumber - monthStart + 1;
    var diff = INT((monthStart - a11) / 29);
    var lunarLeap = 0;
    var lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      var leapMonthDiff = getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) lunarLeap = 1;
      }
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
    return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap, jd: dayNumber, monthStart: monthStart };
  }

  // Trả về [ngày, tháng, năm] dương lịch, hoặc null nếu ngày âm không hợp lệ
  function lunar2solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
    if (timeZone === undefined) timeZone = TZ;
    var a11, b11;
    if (lunarMonth < 11) {
      a11 = getLunarMonth11(lunarYear - 1, timeZone);
      b11 = getLunarMonth11(lunarYear, timeZone);
    } else {
      a11 = getLunarMonth11(lunarYear, timeZone);
      b11 = getLunarMonth11(lunarYear + 1, timeZone);
    }
    var k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    var off = lunarMonth - 11;
    if (off < 0) off += 12;
    if (b11 - a11 > 365) {
      var leapOff = getLeapMonthOffset(a11, timeZone);
      var leapMonth = leapOff - 2;
      if (leapMonth <= 0) leapMonth += 12;
      if (lunarLeap && lunarMonth !== leapMonth) return null;
      if (lunarLeap || off >= leapOff) off += 1;
    } else if (lunarLeap) {
      return null;
    }
    var monthStart = getNewMoonDay(k + off, timeZone);
    return jdToDate(monthStart + lunarDay - 1);
  }

  /* ---------------- Tiện ích lịch ---------------- */

  function weekday(jd) { return (jd + 1) % 7; } // 0 = Chủ nhật

  function daysInMonth(m, y) {
    var nm = m === 12 ? 1 : m + 1, ny = m === 12 ? y + 1 : y;
    return jdFromDate(1, nm, ny) - jdFromDate(1, m, y);
  }

  function lunarFromJd(jd) {
    var d = jdToDate(jd);
    return solar2lunar(d[0], d[1], d[2]);
  }

  // Số ngày của tháng âm bắt đầu tại jd monthStart (29 hoặc 30)
  function lunarMonthLength(monthStart) {
    return lunarFromJd(monthStart + 29).day === 30 ? 30 : 29;
  }

  // Tháng nhuận của năm âm lịch Y (0 nếu không có)
  function getLeapMonth(Y) {
    var s = lunar2solar(1, 1, Y, 0);
    var jd = jdFromDate(s[0], s[1], s[2]);
    for (var i = 0; i < 14; i++) {
      var l = lunarFromJd(jd);
      if (l.year !== Y) break;
      if (l.leap) return l.month;
      jd += lunarMonthLength(jd);
    }
    return 0;
  }

  function canChiYear(y) { return CAN[(y + 6) % 10] + ' ' + CHI[(y + 8) % 12]; }
  function canChiMonth(m, y) { return CAN[(y * 12 + m + 3) % 10] + ' ' + CHI[(m + 1) % 12]; }
  function canChiDay(jd) { return CAN[(jd + 9) % 10] + ' ' + CHI[(jd + 1) % 12]; }
  function dayCanIdx(jd) { return (jd + 9) % 10; }
  function dayChiIdx(jd) { return (jd + 1) % 12; }
  function napAmDay(jd) { return NAP_AM[INT(((jd + 49) % 60) / 2)]; }
  function napAmYear(y) { return NAP_AM[INT((((y - 4) % 60) + 60) % 60 / 2)]; }

  function hourRange(i) {
    var s = (23 + 2 * i) % 24, e = (s + 2) % 24;
    var p = function (h) { return (h < 10 ? '0' : '') + h; };
    return p(s) + 'h – ' + p(e) + 'h';
  }

  // 12 khung giờ trong ngày kèm thần trực và Hoàng đạo / Hắc đạo
  function gioTrongNgay(jd) {
    var dz = dayChiIdx(jd);
    var start = (((dz - 2) * 2) % 12 + 12) % 12; // giờ Thanh Long
    var can0 = ((jd - 1) * 2) % 10;               // can giờ Tý
    var list = [];
    for (var i = 0; i < 12; i++) {
      var t = (i - start + 12) % 12;
      list.push({
        idx: i, chi: CHI[i], canChi: CAN[(can0 + i) % 10] + ' ' + CHI[i],
        range: hourRange(i), than: THAN[t], tot: THAN_TOT[t] === 1
      });
    }
    return list;
  }

  // Sao trực nhật của ngày theo tháng âm lịch (Hoàng đạo / Hắc đạo)
  function saoNgay(jd, lunarMonth) {
    var mz = (lunarMonth + 1) % 12;
    var start = (((mz - 2) * 2) % 12 + 12) % 12;
    var t = (dayChiIdx(jd) - start + 12) % 12;
    return { ten: THAN[t], tot: THAN_TOT[t] === 1 };
  }

  function termIndexAt(t) {
    return INT(SunLongitude(t) * 180 / PI / 15) % 24;
  }

  // Tiết khí của ngày (tính tại cuối ngày giờ VN), có bắt đầu trong ngày hay không
  function tietKhi(jd) {
    var endIdx = termIndexAt(jd + 0.5 - TZ / 24);
    var startIdx = termIndexAt(jd - 0.5 - TZ / 24);
    return { idx: endIdx, ten: TIET_KHI[endIdx], moTa: TIET_KHI_MO_TA[endIdx], batDau: endIdx !== startIdx };
  }

  // Thập nhị trực: dựa vào tháng tiết khí (Lập xuân mở đầu tháng Dần)
  function trucNgay(jd) {
    var k = tietKhi(jd).idx;
    var monthOff = INT(((k - 21 + 24) % 24) / 2);
    var mz = (2 + monthOff) % 12;
    var t = (dayChiIdx(jd) - mz + 12) % 12;
    return TRUC[t];
  }

  // Danh sách 24 tiết khí trong một năm dương lịch
  function tietKhiTrongNam(y) {
    var start = jdFromDate(1, 1, y), end = jdFromDate(31, 12, y);
    var out = [];
    for (var jd = start; jd <= end; jd++) {
      var t = tietKhi(jd);
      if (t.batDau) {
        var d = jdToDate(jd);
        out.push({ jd: jd, d: d[0], m: d[1], y: d[2], idx: t.idx, ten: t.ten, moTa: t.moTa });
      }
    }
    return out;
  }

  function getDayInfo(dd, mm, yy) {
    var jd = jdFromDate(dd, mm, yy);
    var l = solar2lunar(dd, mm, yy);
    var len = lunarMonthLength(l.monthStart);
    var c = dayCanIdx(jd), z = dayChiIdx(jd);
    var tam = [3, 7, 13, 18, 22, 27].indexOf(l.day) >= 0;
    var nguyetKy = [5, 14, 23].indexOf(l.day) >= 0;
    return {
      d: dd, m: mm, y: yy, jd: jd,
      thu: weekday(jd), tenThu: THU[weekday(jd)],
      lunar: l, monthLen: len, tenThangAm: THANG_AM[l.month - 1],
      canChi: { ngay: canChiDay(jd), thang: canChiMonth(l.month, l.year), nam: canChiYear(l.year) },
      conGiap: CON_GIAP[(l.year + 8) % 12],
      napAm: napAmDay(jd),
      tiet: tietKhi(jd),
      truc: trucNgay(jd),
      sao: saoNgay(jd, l.month),
      gio: gioTrongNgay(jd),
      hyThan: HY_THAN[c % 5], taiThan: TAI_THAN[c],
      xungTuoi: CHI[(z + 6) % 12],
      tamNuong: tam, nguyetKy: nguyetKy
    };
  }

  var api = {
    TZ: TZ, CAN: CAN, CHI: CHI, THU: THU, THANG_AM: THANG_AM, TIET_KHI: TIET_KHI, THAN: THAN, TRUC: TRUC,
    jdFromDate: jdFromDate, jdToDate: jdToDate, solar2lunar: solar2lunar, lunar2solar: lunar2solar,
    lunarFromJd: lunarFromJd, lunarMonthLength: lunarMonthLength, getLeapMonth: getLeapMonth,
    weekday: weekday, daysInMonth: daysInMonth,
    canChiYear: canChiYear, canChiMonth: canChiMonth, canChiDay: canChiDay, napAmYear: napAmYear,
    gioTrongNgay: gioTrongNgay, saoNgay: saoNgay, tietKhi: tietKhi, trucNgay: trucNgay,
    tietKhiTrongNam: tietKhiTrongNam, getDayInfo: getDayInfo, conGiap: function (y) { return CON_GIAP[(y + 8) % 12]; }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LunarVN = api;
})(this);
