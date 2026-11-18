/**
 * KidsFit Global (Division 2 · kisfitglobal.com)
 * 1:1 Personalized US CDC Growth & Bone-Age Report PDF Generator (Zero Dependencies · Strictly Zero-Hangul)
 * Generates a 3-page high-resolution A4/Letter personalized PDF containing the child's exact measurements,
 * US CDC peer percentile, elapsed bone-age adjustment, 3-path adult height forecast, daily nutrition targets,
 * and (for the 6-Month Velocity Pass) a personalized Month 1-6 expected height roadmap.
 */
(function (global) {
  'use strict';

  var PAGE_W = 1240;
  var PAGE_H = 1754;
  var SANS_FONT = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  var SERIF_FONT = '"Newsreader", Georgia, "Times New Roman", serif';

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function formatUtcDate() {
    return new Date().toISOString().slice(0, 10);
  }

  function cmToImperialStr(cm) {
    var totalIn = Number(cm) / 2.54;
    var ft = Math.floor(totalIn / 12);
    var remIn = Number((totalIn - ft * 12).toFixed(1));
    if (remIn >= 12) {
      ft += 1;
      remIn = 0;
    }
    return ft + ' ft ' + remIn.toFixed(1) + ' in (' + Number(cm).toFixed(1) + ' cm)';
  }

  function wrapEnglishText(ctx, text, maxWidth) {
    var raw = String(text || '').trim();
    if (!raw) return [];
    var words = raw.split(/\s+/);
    var lines = [];
    var cur = '';
    for (var i = 0; i < words.length; i++) {
      var test = cur ? (cur + ' ' + words[i]) : words[i];
      if (ctx.measureText(test).width <= maxWidth) {
        cur = test;
      } else {
        if (cur) lines.push(cur);
        cur = words[i];
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function drawRoundedRect(ctx, x, y, w, h, r, fillStyle, strokeStyle, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth || 1.5;
      ctx.stroke();
    }
  }

  function createPageCanvas(pageNum, totalPages, childLabel) {
    var canvas = document.createElement('canvas');
    canvas.width = PAGE_W;
    canvas.height = PAGE_H;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);

    ctx.strokeStyle = '#E4DDD3';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, PAGE_W - 96, PAGE_H - 96);

    ctx.fillStyle = '#857C73';
    ctx.font = '400 17px ' + SANS_FONT;
    ctx.fillText('KidsFit Global (kisfitglobal.com) · Educational tracking based on public US CDC 2000 growth charts; not medical advice.', 84, PAGE_H - 76);
    ctx.textAlign = 'right';
    ctx.fillText(childLabel + ' · Page ' + pageNum + ' of ' + totalPages, PAGE_W - 84, PAGE_H - 76);
    ctx.textAlign = 'left';

    return { canvas: canvas, ctx: ctx };
  }

  function getCdcAnnualVelocityCm(isBoy, ageYears) {
    if (ageYears < 5) return 7.0;
    if (ageYears < 8) return 5.8;
    if (!isBoy) {
      if (ageYears <= 11) return 6.4;
      if (ageYears <= 13) return 4.8;
      return 2.0;
    }
    if (ageYears <= 11) return 5.4;
    if (ageYears <= 14) return 6.8;
    return 2.8;
  }

  function renderPersonalizedPages(aux, profile, isPass) {
    var p = profile || {};
    var nameRaw = String(p.childName || '').trim();
    var childLabel = nameRaw ? (nameRaw + ' (' + aux.sexLabel + ', ' + aux.ageLabel + ')') : (aux.sexLabel + ' · ' + aux.ageLabel);
    var shortLabel = nameRaw || (aux.sexLabel + ' · ' + aux.ageLabel);
    var dateStr = formatUtcDate();
    var tierLabel = isPass ? '6-Month Growth Velocity Pass ($19.99)' : 'Single Growth & Bone-Age Report ($8.99)';
    var emailLabel = String(p.parentEmail || 'Verified Parent Pass');

    // ==================== PAGE 1 ====================
    var p1 = createPageCanvas(1, 3, shortLabel);
    var c1 = p1.ctx;

    drawRoundedRect(c1, 84, 84, PAGE_W - 168, 178, 16, '#2F5241', null, 0);
    c1.fillStyle = '#DCE8E1';
    c1.font = '600 19px ' + SANS_FONT;
    c1.fillText('KIDSFIT GLOBAL GROWTH ATELIER · 1:1 PERSONALIZED REPORT', 120, 132);
    c1.fillStyle = '#FFFFFF';
    c1.font = '600 38px ' + SERIF_FONT;
    c1.fillText('Personalized US CDC Growth & Bone-Age Report', 120, 188);
    c1.fillStyle = '#E6EFEA';
    c1.font = '400 20px ' + SANS_FONT;
    c1.fillText('Issued: ' + dateStr + '   |   Plan: ' + tierLabel + '   |   Parent: ' + emailLabel, 120, 232);

    // Child Profile Summary
    drawRoundedRect(c1, 84, 290, PAGE_W - 168, 220, 14, '#FFFFFF', '#DFD7CC', 2);
    c1.fillStyle = '#8C5E3C';
    c1.font = '700 20px ' + SANS_FONT;
    c1.fillText('CHILD PROFILE & ANTHROPOMETRIC BASELINE', 118, 334);
    c1.fillStyle = '#231F1D';
    c1.font = '700 28px ' + SANS_FONT;
    c1.fillText('Child: ' + childLabel, 118, 380);
    c1.fillStyle = '#4A433E';
    c1.font = '400 21px ' + SANS_FONT;
    c1.fillText('• Standing Height: ' + cmToImperialStr(aux.heightCm) + '   |   Body Weight: ' + Number(aux.weightKg * 2.20462).toFixed(1) + ' lbs (' + aux.weightKg.toFixed(1) + ' kg)', 118, 426);
    c1.fillText('• Family Stature Inputs: Father ' + cmToImperialStr(p.fatherHeight || 177.8) + '  ·  Mother ' + cmToImperialStr(p.motherHeight || 163.8), 118, 468);

    // Section 1: US CDC Peer Percentile
    drawRoundedRect(c1, 84, 540, PAGE_W - 168, 490, 14, '#FFFFFF', '#DFD7CC', 2);
    c1.fillStyle = '#2F5241';
    c1.font = '700 21px ' + SANS_FONT;
    c1.fillText('PART 1 · US CDC 2000 PEER HEIGHT PERCENTILE ANALYSIS', 118, 586);

    var tileW = 326;
    var tileY = 614;
    var tiles1 = [
      { label: 'US CDC Peer Percentile', val: aux.ordinalPercentile + ' Percentile', sub: 'Taller than ~' + Math.round(aux.percentile) + ' of 100 peers' },
      { label: 'Current Standing Height', val: cmToImperialStr(aux.heightCm).split(' (')[0], sub: aux.heightCm.toFixed(1) + ' cm · Z-score ' + aux.zScore.toFixed(2) },
      { label: 'Family Midpoint Target', val: cmToImperialStr(aux.mphCm).split(' (')[0], sub: aux.mphCm.toFixed(1) + ' cm inherited center' }
    ];
    for (var i = 0; i < 3; i++) {
      var tx = 118 + i * (tileW + 13);
      drawRoundedRect(c1, tx, tileY, tileW, 142, 10, '#FAF7F2', '#E5DDD2', 1.5);
      c1.fillStyle = '#6E665E';
      c1.font = '600 18px ' + SANS_FONT;
      c1.fillText(tiles1[i].label, tx + 20, tileY + 38);
      c1.fillStyle = i === 0 ? '#2F5241' : '#231F1D';
      c1.font = '700 29px ' + SANS_FONT;
      c1.fillText(tiles1[i].val, tx + 20, tileY + 84);
      c1.fillStyle = '#7A7168';
      c1.font = '400 18px ' + SANS_FONT;
      c1.fillText(tiles1[i].sub, tx + 20, tileY + 120);
    }

    var barX = 118;
    var barY = 808;
    var barW = PAGE_W - 236;
    c1.fillStyle = '#6E665E';
    c1.font = '500 18px ' + SANS_FONT;
    c1.fillText('3rd', barX, barY - 14);
    c1.fillText('25th', barX + barW * 0.25 - 18, barY - 14);
    c1.fillText('50th (Median)', barX + barW * 0.5 - 58, barY - 14);
    c1.fillText('75th', barX + barW * 0.75 - 18, barY - 14);
    c1.textAlign = 'right';
    c1.fillText('97th', barX + barW, barY - 14);
    c1.textAlign = 'left';

    drawRoundedRect(c1, barX, barY, barW, 24, 12, '#EAE3D9', null, 0);
    var pinPct = clamp(aux.percentile, 3, 97) / 100;
    drawRoundedRect(c1, barX, barY, Math.max(28, barW * pinPct), 24, 12, '#2F5241', null, 0);
    c1.beginPath();
    c1.arc(barX + barW * pinPct, barY + 12, 16, 0, Math.PI * 2);
    c1.fillStyle = '#8C5E3C';
    c1.fill();
    c1.lineWidth = 4;
    c1.strokeStyle = '#FFFFFF';
    c1.stroke();

    c1.fillStyle = '#3A3430';
    c1.font = '400 21px ' + SANS_FONT;
    var obsLines = wrapEnglishText(c1, aux.gentlePeerObservation, barW);
    for (var o = 0; o < Math.min(3, obsLines.length); o++) {
      c1.fillText(obsLines[o], barX, 882 + o * 34);
    }

    // Section 2: Elapsed Bone-Age Calibration & Open Growth Runway
    drawRoundedRect(c1, 84, 1060, PAGE_W - 168, 550, 14, '#FFFFFF', '#DFD7CC', 2);
    c1.fillStyle = '#2F5241';
    c1.font = '700 21px ' + SANS_FONT;
    c1.fillText('PART 2 · ELAPSED BONE-AGE CALIBRATION & REMAINING RUNWAY', 118, 1108);

    var baHeadline = p.hasBoneAge
      ? ('Wrist X-Ray Time-Lag Adjusted (+' + (p.baDeltaMonths || 0) + ' Months Elapsed Since Exam)')
      : 'Day-Exact Chronological & Mid-Parental Maturation Model (No X-Ray Required)';
    var baBody = p.hasBoneAge
      ? String(p.baCalibrationText || 'Adjusted wrist bone-age reading projected cleanly to today.')
      : 'Modeled from US CDC 2000 reference curves, exact age in months, both parents\' heights, and reported evening habits.';

    drawRoundedRect(c1, 118, 1134, PAGE_W - 236, 178, 12, '#F4EFE7', '#DFD5C7', 1.5);
    c1.fillStyle = '#231F1D';
    c1.font = '700 24px ' + SANS_FONT;
    c1.fillText(baHeadline, 146, 1182);
    c1.fillStyle = '#4A433E';
    c1.font = '400 20px ' + SANS_FONT;
    var baLines = wrapEnglishText(c1, baBody, PAGE_W - 292);
    for (var bIdx = 0; bIdx < Math.min(3, baLines.length); bIdx++) {
      c1.fillText(baLines[bIdx], 146, 1224 + bIdx * 32);
    }

    drawRoundedRect(c1, 118, 1344, 486, 224, 12, '#FAF7F2', '#E5DDD2', 1.5);
    c1.fillStyle = '#6E665E';
    c1.font = '600 19px ' + SANS_FONT;
    c1.fillText('Estimated Remaining Growing Time', 148, 1390);
    c1.fillStyle = '#231F1D';
    c1.font = '700 42px ' + SANS_FONT;
    c1.fillText('~' + aux.remainingYears + ' Years', 148, 1456);
    c1.fillStyle = '#6E665E';
    c1.font = '400 19px ' + SANS_FONT;
    c1.fillText('Active childhood & adolescent growth window', 148, 1510);

    drawRoundedRect(c1, 636, 1344, 486, 224, 12, '#EEF3F0', '#2F5241', 2);
    c1.fillStyle = '#2F5241';
    c1.font = '700 19px ' + SANS_FONT;
    c1.fillText('Remaining Potential Height Runway', 666, 1390);
    c1.font = '700 42px ' + SANS_FONT;
    c1.fillText('+' + (aux.remainingRunwayCm / 2.54).toFixed(1) + ' in (+' + aux.remainingRunwayCm.toFixed(1) + ' cm)', 666, 1456);
    c1.fillStyle = '#355846';
    c1.font = '500 19px ' + SANS_FONT;
    c1.fillText('Toward tended forecast of ' + cmToImperialStr(aux.optimizedCm).split(' (')[0], 666, 1510);

    // ==================== PAGE 2 ====================
    var p2 = createPageCanvas(2, 3, shortLabel);
    var c2 = p2.ctx;

    drawRoundedRect(c2, 84, 84, PAGE_W - 168, 96, 12, '#2F5241', null, 0);
    c2.fillStyle = '#FFFFFF';
    c2.font = '600 28px ' + SERIF_FONT;
    c2.fillText('Three-Path Adult Height Forecast & Personalized 90-Day Home Plan', 118, 143);

    drawRoundedRect(c2, 84, 206, PAGE_W - 168, 430, 14, '#FFFFFF', '#DFD7CC', 2);
    c2.fillStyle = '#2F5241';
    c2.font = '700 21px ' + SANS_FONT;
    c2.fillText('PART 3 · FINAL ADULT HEIGHT FORECAST ACROSS THREE PATHS', 118, 252);

    var paths = [
      { title: '1. Family Height Midpoint (Genetic Center)', cm: aux.mphCm, note: 'Expected family band: ' + cmToImperialStr(aux.krMinCm).split(' (')[0] + ' to ' + cmToImperialStr(aux.krMaxCm).split(' (')[0], color: '#8A8076', bg: '#FAF7F2' },
      { title: '2. Current Routine Path (Unmanaged Habits)', cm: aux.unmanagedCm, note: 'Projected if current sleep & posture bottlenecks continue', color: '#8C5E3C', bg: '#FAF7F2' },
      { title: '3. Tended Evening Routine Forecast', cm: aux.optimizedCm, note: 'Recoverable room: +' + (aux.optimizedGainCm / 2.54).toFixed(1) + ' in (+' + aux.optimizedGainCm.toFixed(1) + ' cm)', color: '#2F5241', bg: '#EEF3F0' }
    ];
    var minScale = Math.min(aux.mphCm, aux.unmanagedCm) - 8;
    var maxScale = Math.max(aux.mphCm, aux.optimizedCm) + 4;
    for (var k = 0; k < 3; k++) {
      var ry = 282 + k * 106;
      drawRoundedRect(c2, 118, ry, PAGE_W - 236, 90, 10, paths[k].bg, k === 2 ? '#2F5241' : '#E5DDD2', k === 2 ? 2 : 1.5);
      c2.fillStyle = '#231F1D';
      c2.font = '700 20px ' + SANS_FONT;
      c2.fillText(paths[k].title, 142, ry + 34);
      c2.fillStyle = '#6E665E';
      c2.font = '400 18px ' + SANS_FONT;
      c2.fillText(paths[k].note, 142, ry + 68);

      var bx = 585;
      var bw = 220;
      drawRoundedRect(c2, bx, ry + 32, bw, 22, 11, '#E6DFD5', null, 0);
      var ratio = clamp((paths[k].cm - minScale) / Math.max(1, maxScale - minScale), 0.18, 0.96);
      drawRoundedRect(c2, bx, ry + 32, bw * ratio, 22, 11, paths[k].color, null, 0);

      c2.textAlign = 'right';
      c2.fillStyle = paths[k].color;
      c2.font = '700 23px ' + SANS_FONT;
      c2.fillText(cmToImperialStr(paths[k].cm), PAGE_W - 136, ry + 54);
      c2.textAlign = 'left';
    }

    // Section 4: Weight-Calibrated Daily Nutrition Targets
    drawRoundedRect(c2, 84, 662, PAGE_W - 168, 226, 14, '#FFFFFF', '#DFD7CC', 2);
    c2.fillStyle = '#2F5241';
    c2.font = '700 21px ' + SANS_FONT;
    c2.fillText('PART 4 · DAILY NOURISHMENT TARGETS CALIBRATED FOR ' + aux.weightKg.toFixed(1) + ' KG BODY WEIGHT', 118, 708);

    var nutBoxes = [
      { label: 'Daily Whole-Food Protein', val: '~' + aux.proteinG + ' g / day', sub: 'Split evenly across breakfast & dinner' },
      { label: 'Daily Bioavailable Calcium', val: '~' + aux.calciumMg + ' mg / day', sub: 'Supports epiphyseal mineral density' },
      { label: 'Daily Vitamin D3 Pairing', val: aux.vitDIu + ' IU / day', sub: 'Supports intestinal calcium absorption' }
    ];
    for (var nIdx = 0; nIdx < 3; nIdx++) {
      var nx = 118 + nIdx * (tileW + 13);
      drawRoundedRect(c2, nx, 732, tileW, 130, 10, '#FAF7F2', '#E5DDD2', 1.5);
      c2.fillStyle = '#6E665E';
      c2.font = '600 18px ' + SANS_FONT;
      c2.fillText(nutBoxes[nIdx].label, nx + 18, 766);
      c2.fillStyle = '#2F5241';
      c2.font = '700 30px ' + SANS_FONT;
      c2.fillText(nutBoxes[nIdx].val, nx + 18, 810);
      c2.fillStyle = '#6E665E';
      c2.font = '400 17px ' + SANS_FONT;
      c2.fillText(nutBoxes[nIdx].sub, nx + 18, 842);
    }

    // Section 5: Personalized 90-Day Bottleneck Action Plan
    drawRoundedRect(c2, 84, 914, PAGE_W - 168, 700, 14, '#FFFFFF', '#DFD7CC', 2);
    c2.fillStyle = '#2F5241';
    c2.font = '700 21px ' + SANS_FONT;
    c2.fillText('PART 5 · PERSONALIZED 90-DAY EVENING HABIT PROTOCOL', 118, 960);

    var rxCards = [
      {
        head: '01 · Priority Bottleneck Identified From Your Survey',
        body: aux.primaryBottleneckLine + ' Dim household lights 40 minutes before a 9:30 PM bedtime target.'
      },
      {
        head: '02 · Fasting Buffer & Bone-Mineral Dinner Rhythm',
        body: 'Keep the final 2 hours before sleep free of sweet drinks or snacks, pairing ~' + aux.proteinG + ' g protein and ~' + aux.calciumMg + ' mg calcium across daily meals.'
      },
      {
        head: '03 · Desk Spinal Unloading & 15-Minute Active Play',
        body: 'Raise reading screens closer to eye level during homework and pair 15 minutes of afternoon jumping with 60 seconds of chest-opening stretches before bed.'
      }
    ];
    var curY = 992;
    for (var rIdx = 0; rIdx < rxCards.length; rIdx++) {
      var item = rxCards[rIdx];
      var lines = wrapEnglishText(c2, item.body, PAGE_W - 292).slice(0, 4);
      var boxH = 88 + lines.length * 30;
      drawRoundedRect(c2, 118, curY, PAGE_W - 236, boxH, 10, '#FAF7F2', '#E5DDD2', 1.5);
      c2.fillStyle = '#8C5E3C';
      c2.font = '700 21px ' + SANS_FONT;
      c2.fillText(item.head, 144, curY + 40);
      c2.fillStyle = '#3A3430';
      c2.font = '400 19px ' + SANS_FONT;
      for (var dl = 0; dl < lines.length; dl++) {
        c2.fillText(lines[dl], 144, curY + 76 + dl * 30);
      }
      curY += boxH + 18;
    }

    // ==================== PAGE 3 ====================
    var p3 = createPageCanvas(3, 3, shortLabel);
    var c3 = p3.ctx;

    drawRoundedRect(c3, 84, 84, PAGE_W - 168, 96, 12, '#2F5241', null, 0);
    c3.fillStyle = '#FFFFFF';
    c3.font = '600 28px ' + SERIF_FONT;
    c3.fillText(
      isPass
        ? '6-Month Expected Height Roadmap & 30-Day Home Habit Checklist'
        : 'Printable 30-Day Evening Growth Habit Home Checklist',
      118, 143
    );

    var gridStartY = 210;
    if (isPass) {
      drawRoundedRect(c3, 84, 206, PAGE_W - 168, 560, 14, '#FFFFFF', '#DFD7CC', 2);
      c3.fillStyle = '#2F5241';
      c3.font = '700 20px ' + SANS_FONT;
      var ageY = Math.round(aux.ageMonths / 12);
      var annVel = getCdcAnnualVelocityCm(aux.isBoy, ageY);
      var monthlyGain = annVel / 12;
      c3.fillText(
        'PART 6 · [6-MONTH PASS] EXPECTED HEIGHT TRAJECTORY FROM ' + aux.heightCm.toFixed(1) + ' CM (~+' + annVel.toFixed(1) + ' CM/YR CDC PACE)',
        118, 252
      );

      var thY = 278;
      drawRoundedRect(c3, 118, thY, PAGE_W - 236, 54, 8, '#EEF3F0', null, 0);
      c3.fillStyle = '#2F5241';
      c3.font = '700 18px ' + SANS_FONT;
      c3.fillText('Check-In Milestone', 142, thY + 34);
      c3.fillText('Expected On-Track Height', 400, thY + 34);
      c3.fillText('Measured Morning Height', 690, thY + 34);
      c3.fillText('30-Day Gain', 955, thY + 34);

      for (var m = 1; m <= 6; m++) {
        var rowY = thY + 58 + (m - 1) * 68;
        drawRoundedRect(c3, 118, rowY, PAGE_W - 236, 58, 6, m % 2 === 1 ? '#FAF7F2' : '#FFFFFF', '#E5DDD2', 1);
        var expCm = aux.heightCm + monthlyGain * m;
        c3.fillStyle = '#231F1D';
        c3.font = '600 19px ' + SANS_FONT;
        c3.fillText('Month ' + m + ' (+' + (m * 30) + ' Days)', 142, rowY + 36);
        c3.fillStyle = '#2F5241';
        c3.font = '700 20px ' + SANS_FONT;
        c3.fillText(cmToImperialStr(expCm), 400, rowY + 36);
        c3.fillStyle = '#9E9489';
        c3.font = '400 18px ' + SANS_FONT;
        c3.fillText('_____ ft ____ in / ______ cm', 690, rowY + 36);
        c3.fillText('+ _____ cm', 955, rowY + 36);
      }
      gridStartY = 794;
    }

    var cardH = PAGE_H - gridStartY - 120;
    drawRoundedRect(c3, 84, gridStartY, PAGE_W - 168, cardH, 14, '#FFFFFF', '#DFD7CC', 2);
    c3.fillStyle = '#2F5241';
    c3.font = '700 21px ' + SANS_FONT;
    c3.fillText('30-DAY REFRIGERATOR EVENING HABIT LOG (SLEEP · NOURISHMENT · POSTURE)', 118, gridStartY + 46);
    c3.fillStyle = '#6E665E';
    c3.font = '400 18px ' + SANS_FONT;
    c3.fillText('Check off each evening:  [ ] Lights dimmed before 9:30 PM   [ ] Protein + Calcium dinner (no late sugar)   [ ] Posture stretch', 118, gridStartY + 82);

    var cols = 5;
    var rows = 6;
    var cellGap = 14;
    var gridW = PAGE_W - 236;
    var cellW = Math.floor((gridW - cellGap * (cols - 1)) / cols);
    var availGridH = cardH - 126;
    var cellH = Math.floor((availGridH - cellGap * (rows - 1)) / rows);

    for (var day = 1; day <= 30; day++) {
      var r = Math.floor((day - 1) / cols);
      var col = (day - 1) % cols;
      var cx = 118 + col * (cellW + cellGap);
      var cy = gridStartY + 104 + r * (cellH + cellGap);
      drawRoundedRect(c3, cx, cy, cellW, cellH, 8, '#FAF7F2', '#DFD7CC', 1.5);
      c3.fillStyle = '#8C5E3C';
      c3.font = '700 18px ' + SANS_FONT;
      c3.fillText('DAY ' + (day < 10 ? '0' + day : day), cx + 16, cy + 30);
      c3.fillStyle = '#5C544D';
      c3.font = '400 14.5px ' + SANS_FONT;
      c3.fillText('□ Sleep  □ Meal  □ Posture', cx + 12, cy + Math.min(cellH - 14, 66));
    }

    return [p1.canvas, p2.canvas, p3.canvas];
  }

  function dataUrlToBytes(dataUrl) {
    var base64 = dataUrl.split(',')[1] || '';
    var bin = global.atob(base64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i) & 0xff;
    }
    return bytes;
  }

  function asciiBytes(str) {
    var arr = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i) & 0x7f;
    }
    return arr;
  }

  function buildPdfFromCanvases(canvases) {
    var chunks = [];
    var totalLen = 0;
    function pushBytes(u8) {
      chunks.push(u8);
      totalLen += u8.length;
    }
    function pushStr(s) {
      pushBytes(asciiBytes(s));
    }

    var n = canvases.length;
    var totalObjs = 2 + n * 3;
    var offsets = new Array(totalObjs + 1);

    pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');

    offsets[1] = totalLen;
    pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    var kidsRefs = [];
    for (var i = 0; i < n; i++) {
      kidsRefs.push((3 + i * 3) + ' 0 R');
    }
    offsets[2] = totalLen;
    pushStr('2 0 obj\n<< /Type /Pages /Kids [ ' + kidsRefs.join(' ') + ' ] /Count ' + n + ' >>\nendobj\n');

    for (var p = 0; p < n; p++) {
      var pageObjId = 3 + p * 3;
      var imgObjId = 4 + p * 3;
      var cntObjId = 5 + p * 3;
      var c = canvases[p];
      var jpgBytes = dataUrlToBytes(c.toDataURL('image/jpeg', 0.91));

      offsets[pageObjId] = totalLen;
      pushStr(
        pageObjId + ' 0 obj\n' +
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] ' +
        '/Resources << /XObject << /Im' + p + ' ' + imgObjId + ' 0 R >> >> ' +
        '/Contents ' + cntObjId + ' 0 R >>\nendobj\n'
      );

      offsets[imgObjId] = totalLen;
      pushStr(
        imgObjId + ' 0 obj\n' +
        '<< /Type /XObject /Subtype /Image /Width ' + c.width + ' /Height ' + c.height +
        ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpgBytes.length + ' >>\nstream\n'
      );
      pushBytes(jpgBytes);
      pushStr('\nendstream\nendobj\n');

      var streamCmd = 'q 595.28 0 0 841.89 0 0 cm /Im' + p + ' Do Q\n';
      offsets[cntObjId] = totalLen;
      pushStr(cntObjId + ' 0 obj\n<< /Length ' + streamCmd.length + ' >>\nstream\n' + streamCmd + 'endstream\nendobj\n');
    }

    var xrefPos = totalLen;
    pushStr('xref\n0 ' + (totalObjs + 1) + '\n0000000000 65535 f \n');
    for (var objIdx = 1; objIdx <= totalObjs; objIdx++) {
      var offStr = String(offsets[objIdx]);
      while (offStr.length < 10) offStr = '0' + offStr;
      pushStr(offStr + ' 00000 n \n');
    }
    pushStr('trailer\n<< /Size ' + (totalObjs + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefPos + '\n%%EOF\n');

    var out = new Uint8Array(totalLen);
    var pos = 0;
    for (var k = 0; k < chunks.length; k++) {
      out.set(chunks[k], pos);
      pos += chunks[k].length;
    }
    return out;
  }

  function downloadPersonalizedAtelierPdf(aux, profile, isPass) {
    if (typeof document === 'undefined' || !aux) return false;
    var canvases = renderPersonalizedPages(aux, profile, isPass);
    var pdfBytes = buildPdfFromCanvases(canvases);
    var blob = new Blob([pdfBytes], { type: 'application/pdf' });

    var rawName = String((profile && profile.childName) || '').replace(/[^A-Za-z0-9_-]/g, '').trim();
    var fileName = (rawName ? rawName + '_' : 'Child_') + 'KidsFit_Personalized_Growth_Report_' + formatUtcDate().replace(/-/g, '') + '.pdf';

    var ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
    var isInAppWebView = /Instagram|FBAN|FBAV|Line\/|TikTok/i.test(ua);

    var url = URL.createObjectURL(blob);
    if (!isInAppWebView) {
      var a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        if (a.parentNode) a.parentNode.removeChild(a);
        URL.revokeObjectURL(url);
      }, 4000);
    } else {
      global.open(url, '_blank');
    }
    return { ok: true, fileName: fileName, byteLength: pdfBytes.length };
  }

  global.KfgPersonalizedPdf = {
    renderPersonalizedPages: renderPersonalizedPages,
    buildPdfFromCanvases: buildPdfFromCanvases,
    downloadPersonalizedAtelierPdf: downloadPersonalizedAtelierPdf
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.KfgPersonalizedPdf;
  }
})(typeof window !== 'undefined' ? window : global);
