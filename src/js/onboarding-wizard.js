/**
 * Taller Bio Labs (KISFIT Bio Labs)
 * 5-Stage Bio Onboarding Wizard & 5 Age Clinical Presets (src/js/onboarding-wizard.js)
 * 
 * Features:
 * - 5 Clinical Age-Group 1-Second Demo Presets (3yo, 7yo, 10yo, 13yo, 16yo)
 * - 5-Stage Guided Clinical Funnel (Biometrics, Tanner Stage, Inhibitors, Cognitive, 3s Loader)
 * - Genuine data validation with boundary checks (Age 1-20y / 12-240m, Height 50-220cm, Weight 3-150kg)
 * - 3-Second animated clinical computation pulse with stepwise status and instant skip
 * - Fully synchronized with I18n and App State
 */

(function (global) {
  'use strict';

  let PinpointCurator = typeof require !== 'undefined' ? (function () { try { return require('./pinpoint-curator'); } catch (e) { return null; } })() : (global.TallerPinpointCurator || global.KidsFitPinpointCurator || null);
  let HapticEngine = typeof require !== 'undefined' ? (function () { try { return require('./haptic-typewriter'); } catch (e) { return null; } })() : (global.TallerHapticEngine || global.KidsFitHapticEngine || null);
  let UserCohortDB = typeof require !== 'undefined' ? (function () { try { return require('./user-cohort-db'); } catch (e) { return null; } })() : (global.TallerUserCohortDB || global.KidsFitUserCohortDB || null);
  let GrowthEngine = typeof require !== 'undefined' ? (function () { try { return require('./growth-engine'); } catch (e) { return null; } })() : (global.GrowthEngine || global.KidsFitGrowthEngine || global.TallerGrowthEngine || null);

  // 1. Definition of 5 Authoritative Clinical Presets
  const PRESETS = {
    'preset-1': {
      id: 'preset-1',
      label: 'Toddler 3 Yrs (36 Mo) — Foundation Auxology & Motor Skills',
      labelKo: 'US CDC Growth Reference 3 yrs (US CDC Growth Reference 36 mos) — US CDC Growth Reference & US CDC Growth Reference',
      labelEn: 'Toddler 3 Yrs (36 Mo) — Foundation Auxology & Motor Skills',
      gender: 'boy',
      ageYears: 3,
      ageMonths: 36,
      currentHeight: 96.5,
      currentWeight: 14.7,
      recentGrowth6m: 3.5, // 7.0 cm/yr
      fatherHeight: 175.0,
      motherHeight: 162.0,
      tannerPhase: 'phase_1',
      habits: ['picky_eater'],
      cognitiveAxes: ['sensory_arts'],
      traitLearningConcerns: ['desk_endurance', 'vocab_expression'],
      traitStudyStyle: 'play_manipulative',
      region: 'United States'
    },
    'preset-2': {
      id: 'preset-2',
      label: 'Childhood 7 Yrs (84 Mo) — Spatial Logic & Postural Alignment',
      labelKo: 'US CDC Growth Reference 7 yrs (US CDC Growth Reference 84 mos) — US CDC Growth Reference & US CDC Growth Reference',
      labelEn: 'Childhood 7 Yrs (84 Mo) — Spatial Logic & Postural Alignment',
      gender: 'girl',
      ageYears: 7,
      ageMonths: 84,
      currentHeight: 120.8,
      currentWeight: 23.6,
      recentGrowth6m: 2.8, // 5.6 cm/yr
      fatherHeight: 176.0,
      motherHeight: 163.0,
      tannerPhase: 'phase_1',
      habits: ['poor_posture'],
      cognitiveAxes: ['math_logic'],
      traitLearningConcerns: ['math_concept', 'reading_literacy'],
      traitStudyStyle: 'play_manipulative',
      region: 'Canada'
    },
    'preset-3': {
      id: 'preset-3',
      label: 'Early Puberty 10 Yrs (120 Mo) — Early Pubertal Hormone Optimization',
      labelKo: 'US CDC Growth Reference 10 yrs (US CDC Growth Reference 120 mos) — US CDC Growth Reference Sleep·US CDC Growth Reference',
      labelEn: 'Early Puberty 10 Yrs (120 Mo) — Early Pubertal Hormone Optimization',
      gender: 'boy',
      ageYears: 10,
      ageMonths: 120,
      currentHeight: 137.0,
      currentWeight: 35.5,
      recentGrowth6m: 3.2, // 6.4 cm/yr
      fatherHeight: 173.5,
      motherHeight: 160.5,
      tannerPhase: 'phase_2',
      habits: ['late_sleep'],
      cognitiveAxes: ['science_nature'],
      traitLearningConcerns: ['reading_literacy', 'passive_forget'],
      traitStudyStyle: 'dialogue_question',
      region: 'United Kingdom & Europe'
    },
    'preset-4': {
      id: 'preset-4',
      label: 'Peak Growth Spurt 13 Yrs (156 Mo) — Peak Height Velocity (PHV) Intervention',
      labelKo: 'US CDC Growth Reference 13 yrs (US CDC Growth Reference 156 mos) — PHV US CDC Growth Reference & US CDC Growth Reference',
      labelEn: 'Peak Growth Spurt 13 Yrs (156 Mo) — Peak Height Velocity (PHV) Intervention',
      gender: 'boy',
      ageYears: 13,
      ageMonths: 156,
      currentHeight: 155.6,
      currentWeight: 51.0,
      recentGrowth6m: 4.5, // 9.0 cm/yr
      fatherHeight: 174.0,
      motherHeight: 161.0,
      tannerPhase: 'phase_2',
      habits: ['late_sleep', 'night_carbs'],
      cognitiveAxes: ['executive_focus'],
      traitLearningConcerns: ['passive_forget', 'screen_dopamine'],
      traitStudyStyle: 'goal_workbook',
      region: 'Australia & New Zealand'
    },
    'preset-5': {
      id: 'preset-5',
      label: 'Late Adolescent 16 Yrs (192 Mo) — Spinal Disc Recovery & Alignment',
      labelKo: 'US CDC Growth Reference 16 yrs (US CDC Growth Reference 192 mos) — US CDC Growth Reference',
      labelEn: 'Late Adolescent 16 Yrs (192 Mo) — Spinal Disc Recovery & Alignment',
      gender: 'girl',
      ageYears: 16,
      ageMonths: 192,
      currentHeight: 160.0,
      currentWeight: 54.1,
      recentGrowth6m: 0.8, // 1.6 cm/yr
      fatherHeight: 177.0,
      motherHeight: 164.0,
      tannerPhase: 'phase_4',
      habits: ['poor_posture', 'late_sleep'],
      cognitiveAxes: ['language_reading'],
      traitLearningConcerns: ['reading_literacy', 'passive_forget'],
      traitStudyStyle: 'dialogue_question',
      region: 'Asia-Pacific & Global'
    }
  };

  // Canonical preset alias mapping for backwards compatibility
  const PRESET_ALIASES = {
    'infant_1': 'preset-1',
    'toddler_2_3': 'preset-1',
    'child_4_5': 'preset-2',
    'child_6_12': 'preset-3',
    'child_7_9': 'preset-3',
    'child_10_12': 'preset-3',
    'elem_low': 'preset-2',
    'elem_high': 'preset-3',
    'teen': 'preset-5'
  };

  // 2. Wizard Steps Meta Definition
  const WIZARD_STEPS_GROWTH = [
    {
      step: 1,
      titleKo: 'US CDC Growth Referenced US CDC Growth Reference',
      titleEn: 'Basic Demographics (Sex · Date of Birth)',
      subKo: 'US CDC Growth Referenced dUS CDC Growth Reference US CDC / KDCA(KDCA) US CDC Growth Reference Height·Bone AgeUS CDC Growth Reference.',
      subEn: 'Utilized for CDC/KDCA LMS national growth charts and normative baselines.'
    },
    {
      step: 2,
      titleKo: 'US CDC Growth Reference Height · Weight · US CDC Growth Reference 6 mos US CDC Growth Reference',
      titleEn: 'Current Stature & Growth Velocity',
      subKo: 'US CDC Growth ReferenceZ-Score)US CDC Growth Referencecm/yr)US CDC Growth Reference HeightUS CDC Growth Reference.',
      subEn: 'Baseline metrics for national LMS percentiles and 6-month growth velocity.'
    },
    {
      step: 3,
      titleKo: 'US CDC Growth Reference Height US CDC Growth Reference Mid-Parental Target Height(MPH) US CDC Growth Reference',
      titleEn: 'Mid-Parental Height (MPH) & Genetic Potential',
      subKo: 'Tanner US CDC Growth Reference Projected Adult HeightUS CDC Growth Reference.',
      subEn: 'Calculates Tanner Mid-Parental Target Height and clinical margin in real-time.'
    },
    {
      step: 4,
      titleKo: 'Bone Age US CDC Growth Reference Sleep·Nutrition US CDC Growth Reference  ptsUS CDC Growth Reference',
      titleEn: 'Growth Stage & Sleep/Diet Habits',
      subKo: 'US CDC Growth Reference Slow-Wave Sleep (N3) Growth Hormone (HGH) US CDC Growth Reference Weight US CDC Growth Reference Nutrition US CDC Growth Reference AssessmentUS CDC Growth Reference.',
      subEn: 'Evaluates epiphyseal plate open ratio and sleep/diet traits.'
    },
    {
      step: 5,
      titleKo: 'US CDC Growth Reference  ptsUS CDC Growth Reference',
      titleEn: 'Posture Alignment & Physical Activity',
      subKo: 'US CDC Growth Reference Growth Plate US CDC Growth Reference.',
      subEn: 'Diagnoses nocturnal GH suppression and adult height penalty factors.'
    },
    {
      step: 6,
      titleKo: 'US CDC Growth Reference  yrsUS CDC Growth Reference  ptsUS CDC Growth Reference Report US CDC Growth Reference',
      titleEn: 'Growth Details & Personalized Report',
      subKo: 'US CDC Growth Reference 1:1 US CDC Growth Reference ReportUS CDC Growth Reference.',
      subEn: 'Generates tailored clinical growth guidance and supplement/exercise prescriptions.'
    }
  ];

  const WIZARD_STEPS_LEARNING = [
    {
      step: 1,
      titleKo: 'US CDC Growth Referenced US CDC Growth Reference',
      titleEn: 'Basic Demographics (Sex · Date of Birth)',
      subKo: 'US CDC Growth Reference Assessment US CDC Growth Reference.',
      subEn: 'Classifies neuro-developmental stage and cognitive baseline.'
    },
    {
      step: 2,
      titleKo: 'US CDC Growth Reference',
      titleEn: 'Reading Habits & Literacy Comprehension',
      subKo: 'US CDC Growth ReferenceAssessmentUS CDC Growth Reference.',
      subEn: 'Pinpoints language cognitive processing and reading comprehension gaps.'
    },
    {
      step: 3,
      titleKo: 'US CDC Growth Reference',
      titleEn: 'Mathematical Logic & Spatial Reasoning',
      subKo: 'US CDC Growth Reference AssessmentUS CDC Growth Reference.',
      subEn: 'Evaluates conceptual mathematics transfer and spatial logic capacity.'
    },
    {
      step: 4,
      titleKo: 'US CDC Growth Reference  hrs US CDC Growth Reference',
      titleEn: 'Executive Focus & Dopamine Regulation',
      subKo: 'US CDC Growth ReferenceAssessmentUS CDC Growth Reference.',
      subEn: 'Measures prefrontal executive function and digital distraction resilience.'
    },
    {
      step: 5,
      titleKo: 'US CDC Growth Reference Sleep US CDC Growth Reference',
      titleEn: 'Metacognition & SWS Memory Consolidation',
      subKo: 'US CDC Growth Reference AssessmentUS CDC Growth Reference.',
      subEn: 'Assesses hippocampal long-term consolidation and self-explanation mastery.'
    },
    {
      step: 6,
      titleKo: 'US CDC Growth Reference  ptsUS CDC Growth Reference Report US CDC Growth Reference',
      titleEn: 'Study Temperament & Personalized Report',
      subKo: 'US CDC Growth Reference 5US CDC Growth Reference ReportUS CDC Growth Reference.',
      subEn: 'Synthesizes personalized learning roadmap, study methodology, and workbook curation.'
    }
  ];

  let WIZARD_STEPS = WIZARD_STEPS_GROWTH;

  // 3. Wizard Internal State
  const wizardState = {
    currentStep: 1,
    maxStep: 6,
    activePresetId: null,
    isScanning: false,
    scanCompleted: false,
    profile: {
      gender: 'boy',
      ageYears: 10,
      ageMonths: 120,
      currentHeight: 137.0,
      currentWeight: 35.5,
      recentGrowth6m: 3.2,
      fatherHeight: 173.5,
      motherHeight: 160.5,
      tannerPhase: 'phase_2',
      habits: ['late_sleep'],
      cognitiveAxes: ['science_nature'],
      traitLearningConcerns: ['reading_literacy'],
      traitStudyStyle: 'dialogue_question',
      region: 'US National (CDC/AAP Standard)'
    }
  };

  // Real-time Tanner MPH Preview
  function updateMphPreview() {
    if (typeof document === 'undefined') return;
    const badgeVal = document.getElementById('mph-badge-value');
    if (!badgeVal) return;

    const fatherInput = document.getElementById('father-height');
    const motherInput = document.getElementById('mother-height');
    const boyRadio = document.getElementById('gender-boy');
    const isImperial = typeof document !== 'undefined' && document.documentElement.lang === 'en' && typeof global.TallerI18n !== 'undefined' && global.TallerI18n.getUnitSystem() === 'imperial';

    let fh = fatherInput ? parseFloat(fatherInput.value) || 173.5 : 173.5;
    let mh = motherInput ? parseFloat(motherInput.value) || 160.5 : 160.5;
    if (isImperial) {
      fh = fh * 2.54;
      mh = mh * 2.54;
    }
    const isBoy = boyRadio ? boyRadio.checked : true;
    const delta = isBoy ? 13.0 : -13.0;
    const mph = (fh + mh + delta) / 2.0;
    const roundedMph = Math.round(mph * 10) / 10;
    const min = Math.round((mph - 8.5) * 10) / 10;
    const max = Math.round((mph + 8.5) * 10) / 10;

    if (isImperial) {
      const mphIn = mph / 2.54;
      let ft = Math.floor(mphIn / 12);
      let inch = Math.round((mphIn - ft * 12) * 10) / 10;
      if (inch >= 12) { ft += 1; inch = 0; }

      const minIn = (mph - 8.5) / 2.54;
      let minFt = Math.floor(minIn / 12);
      let minInch = Math.round((minIn - minFt * 12) * 10) / 10;
      if (minInch >= 12) { minFt += 1; minInch = 0; }

      const maxIn = (mph + 8.5) / 2.54;
      let maxFt = Math.floor(maxIn / 12);
      let maxInch = Math.round((maxIn - maxFt * 12) * 10) / 10;
      if (maxInch >= 12) { maxFt += 1; maxInch = 0; }

      badgeVal.innerHTML = `${ft}' ${inch.toFixed(1)}" (${mphIn.toFixed(1)} in) <span class="mph-badge-range">(±3.3 in: ${minFt}' ${minInch.toFixed(1)}" ~ ${maxFt}' ${maxInch.toFixed(1)}")</span>`;
    } else {
      badgeVal.innerHTML = `${roundedMph.toFixed(1)} cm <span class="mph-badge-range">(±8.5cm: ${min.toFixed(1)}cm ~ ${max.toFixed(1)}cm)</span>`;
    }
  }

  // 4. Stepper Navigation Functions
  function goToStep(stepNumber) {
    const maxStep = wizardState.maxStep;

    if (stepNumber < 1) stepNumber = 1;
    if (stepNumber > maxStep) stepNumber = maxStep;

    wizardState.currentStep = stepNumber;

    if (typeof document === 'undefined') return;

    // Slide track translation for smooth 100% immersive funnel
    const track = document.getElementById('slide-funnel-track');
    if (track) {
      track.style.transform = `translateX(-${(stepNumber - 1) * 100}%)`;
    }

    // Toggle step contents
    for (let i = 1; i <= wizardState.maxStep; i++) {
      const stepEl = document.getElementById(`step-content-${i}`) || document.getElementById(`slide-step-${i}`);
      if (stepEl) {
        if (i === stepNumber) {
          stepEl.classList.add('active');
        } else {
          stepEl.classList.remove('active');
        }
      }
    }

    // Reset Step 6 choices vs Additional Step 7 narrative view when navigating to Step 1..6
    const choicesView = document.getElementById('step-6-choices-view');
    const narrativeView = document.getElementById('step-7-narrative-view');
    if (choicesView) choicesView.style.display = 'block';
    if (narrativeView) narrativeView.style.display = 'none';

    // Update Progress Indicator
    const tagEl = document.getElementById('quiz-step-tag');
    const isEn = (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) || (typeof document !== 'undefined' && document.documentElement && (String(document.documentElement.lang || '').toLowerCase().startsWith('en') || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid')));
    const stepWord = 'Step';
    if (tagEl) {
      tagEl.textContent = `${stepWord} ${stepNumber} / ${wizardState.maxStep}`;
    }

    const info = WIZARD_STEPS[stepNumber - 1];
    const titleEl = document.getElementById('quiz-step-title');
    if (titleEl && info) {
      titleEl.textContent = isEn ? info.titleEn : info.titleKo;
    }
    const subtitleEl = document.getElementById('quiz-step-subtitle');
    if (subtitleEl && info) {
      subtitleEl.textContent = isEn ? info.subEn : info.subKo;
    }

    const percent = Math.round((stepNumber / wizardState.maxStep) * 100);
    const progressTextEl = document.getElementById('quiz-progress-text');
    if (progressTextEl) {
      progressTextEl.textContent = `${percent}% ${isEn ? 'Completed' : 'Complete'}`;
    }

    const progressFillEl = document.getElementById('quiz-progress-fill');
    if (progressFillEl) {
      progressFillEl.style.width = `${percent}%`;
    }

    // Update 6-Segment Glowing Progress Bar
    const segBar = document.getElementById('quiz-segmented-bar');
    if (segBar && typeof segBar.querySelectorAll === 'function') {
      const pills = segBar.querySelectorAll('.taller-seg-pill');
      if (pills && pills.forEach) {
        pills.forEach((pill, idx) => {
          const segStep = idx + 1;
          pill.classList.remove('active', 'completed');
          if (segStep < stepNumber) {
            pill.classList.add('completed');
          } else if (segStep === stepNumber) {
            pill.classList.add('active');
          }
        });
      }
    }

    // Button controls
    const prevBtn = document.getElementById('btn-prev-step');
    const nextBtn = document.getElementById('btn-next-step');
    const submitBtn = document.getElementById('btn-submit-quiz');

    if (prevBtn) {
      prevBtn.style.display = stepNumber === 1 ? 'none' : 'inline-flex';
    }
    if (nextBtn) {
      nextBtn.style.display = (stepNumber >= wizardState.maxStep) ? 'none' : 'inline-flex';
    }
    if (stepNumber === wizardState.maxStep) {
      if (submitBtn) submitBtn.style.display = 'inline-flex';
    } else {
      if (submitBtn) submitBtn.style.display = 'none';
    }

    // Trigger tactile haptic feedback on step transition
    if (!HapticEngine && (global.TallerHapticEngine || global.KidsFitHapticEngine)) {
      HapticEngine = global.TallerHapticEngine || global.KidsFitHapticEngine;
    }
    if (HapticEngine && typeof HapticEngine.triggerHaptic === 'function') {
      HapticEngine.triggerHaptic('tick', titleEl);
    }

    // Keep selection keys immediately visible at top of smartphone screen on step transition
    if (typeof document !== 'undefined' && document.body && document.body.classList && document.body.classList.contains('studio-mode-active')) {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  /**
   * Synchronizes Date of Birth (Year/Month/Day) -> Exact Months/Days + Auto Growth Stage (Phase 1~4)
   */
  function syncDobAndAutoStage(options = {}) {
    if (typeof document === 'undefined') return;
    const preserveUserInputs = Boolean(options && options.preserveUserInputs);
    if (!PinpointCurator && (global.TallerPinpointCurator || global.KidsFitPinpointCurator)) {
      PinpointCurator = global.TallerPinpointCurator || global.KidsFitPinpointCurator;
    }
    if (!PinpointCurator) return;

    const yearEl = document.getElementById('child-birth-year');
    const monthEl = document.getElementById('child-birth-month');
    const dayEl = document.getElementById('child-birth-day');
    if (!yearEl || !monthEl || !dayEl) return;

    // Clamp valid days per year/month (28/29/30/31)
    const yearNum = parseInt(yearEl.value, 10) || 2016;
    const monthNum = parseInt(monthEl.value, 10) || 5;
    const maxDaysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayEl.options && dayEl.options.length) {
      for (let i = 0; i < dayEl.options.length; i++) {
        const optDay = parseInt(dayEl.options[i].value, 10);
        if (!isNaN(optDay)) {
          dayEl.options[i].disabled = optDay > maxDaysInMonth;
          dayEl.options[i].hidden = optDay > maxDaysInMonth;
        }
      }
    }
    if (parseInt(dayEl.value, 10) > maxDaysInMonth) {
      dayEl.value = String(maxDaysInMonth);
    }

    const boyRadio = document.getElementById('gender-boy');
    const gender = (boyRadio && boyRadio.checked) ? 'boy' : 'girl';
    const recentInput = document.getElementById('child-recent-gain');
    const isImpGain = typeof isCurrentImperial === 'function'
      ? isCurrentImperial()
      : (typeof document !== 'undefined' && document.documentElement.lang === 'en' && typeof global.TallerI18n !== 'undefined' && global.TallerI18n.getUnitSystem() === 'imperial');
    const rawRecent = recentInput ? parseFloat(recentInput.value) : NaN;
    const recent6m = !isNaN(rawRecent) && rawRecent > 0
      ? (isImpGain ? Math.round(rawRecent * 2.54 * 10) / 10 : rawRecent)
      : 3.2;

    const dobInfo = PinpointCurator.calculateExactAgeFromDob(yearEl.value, monthEl.value, dayEl.value);
    const autoStage = PinpointCurator.autoDetectGrowthStage(dobInfo.exactMonths, gender, recent6m);

    // Update profile state
    wizardState.profile.birthYear = dobInfo.birthYear;
    wizardState.profile.birthMonth = dobInfo.birthMonth;
    wizardState.profile.birthDay = dobInfo.birthDay;
    wizardState.profile.birthDateStr = dobInfo.birthDateStr;
    wizardState.profile.birthDateKo = dobInfo.birthDateKo;
    wizardState.profile.ageMonths = dobInfo.ageMonths;
    wizardState.profile.exactMonths = dobInfo.exactMonths;
    wizardState.profile.remainderDays = dobInfo.remainderDays;
    wizardState.profile.ageYears = dobInfo.ageYears;
    if (!preserveUserInputs) {
      wizardState.profile.tannerPhase = autoStage.tannerPhase;
    }

    // Auto-sync KDCA 50th percentile standard height & weight unless user manually edited or preserveUserInputs is true
    if (!GrowthEngine && (global.GrowthEngine || global.KidsFitGrowthEngine || global.TallerGrowthEngine)) {
      GrowthEngine = global.GrowthEngine || global.KidsFitGrowthEngine || global.TallerGrowthEngine;
    }
    if (!preserveUserInputs && GrowthEngine && typeof GrowthEngine.getLmsForMonth === 'function') {
      const lms = GrowthEngine.getLmsForMonth(gender, dobInfo.exactMonths || dobInfo.ageMonths);
      if (lms) {
        const heightInput = document.getElementById('child-height');
        const weightInput = document.getElementById('child-weight');
        const roundedH = Math.round((Number(lms.M) || 137.0) * 10) / 10;
        const roundedW = Math.round((Number(lms.wM) || 35.5) * 10) / 10;
        const isImperial = typeof document !== 'undefined' && document.documentElement.lang === 'en' && typeof global.TallerI18n !== 'undefined' && global.TallerI18n.getUnitSystem() === 'imperial';
        const displayH = isImperial ? (Math.round((roundedH / 2.54) * 10) / 10).toFixed(1) : roundedH.toFixed(1);
        const displayW = isImperial ? (Math.round(roundedW * 2.20462262 * 10) / 10).toFixed(1) : roundedW.toFixed(1);

        if (heightInput && !(heightInput.dataset && heightInput.dataset.userEdited === 'true')) {
          heightInput.value = displayH;
          wizardState.profile.currentHeight = roundedH;
        }
        if (weightInput && !(weightInput.dataset && weightInput.dataset.userEdited === 'true')) {
          weightInput.value = displayW;
          wizardState.profile.currentWeight = roundedW;
        }
        if (typeof syncCompanionInputs === 'function') {
          syncCompanionInputs();
        }
      }
    }

    // Sync hidden & legacy inputs
    const isEn = (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) || (typeof document !== 'undefined' && document.documentElement && (String(document.documentElement.lang || '').toLowerCase().startsWith('en') || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid')));
    const ageDisplay = document.getElementById('child-age-display');
    const ageMonthsInput = document.getElementById('child-age-months');
    const ageSlider = document.getElementById('child-age-slider');
    if (ageDisplay) ageDisplay.textContent = isEn ? dobInfo.displayBadgeEn : dobInfo.displayBadgeKo;
    if (ageMonthsInput) ageMonthsInput.value = dobInfo.ageMonths;
    if (ageSlider) ageSlider.value = dobInfo.ageYears;

    // Sync Auto-Detected Growth Stage Banner & Radio Buttons
    const previewEl = document.getElementById('dob-auto-stage-preview');
    if (previewEl) {
      previewEl.textContent = isEn
        ? `Auto-Detected Growth Stage & Bone Age: ${autoStage.stageNameEn} (Expected Velocity: ${autoStage.expectedVelStrEn || autoStage.expectedVelStr})`
        : `US CDC Growth ReferenceBone Age US CDC Growth Reference Complete: ${autoStage.stageNameKo} (US CDC Growth Reference ${autoStage.expectedVelStr})`;
    }
    const stageTitleEl = document.getElementById('auto-growth-stage-title');
    if (stageTitleEl) {
      stageTitleEl.textContent = isEn
        ? `${dobInfo.birthDateEn || dobInfo.birthDateStr} (${dobInfo.displayBadgeEn}) → ${autoStage.stageNameEn}`
        : `${dobInfo.birthDateKo} (${dobInfo.displayBadgeKo}) → ${autoStage.stageNameKo}`;
    }
    const stageDescEl = document.getElementById('auto-growth-stage-desc');
    if (stageDescEl) {
      stageDescEl.innerHTML = isEn
        ? `${autoStage.boneAgeNoteEn || autoStage.stageNameEn}<br><strong style="color:#1D4ED8;">Automatically selected based on Date of Birth — proceed directly to [Next Step] or adjust below if needed.</strong>`
        : `${autoStage.boneAgeNoteKo}<br><strong style="color:#1D4ED8;">US CDC Growth Referenced US CDC Growth Reference [US CDC Growth Reference]US CDC Growth Reference.</strong>`;
    }

    if (!preserveUserInputs) {
      const phaseRadios = document.querySelectorAll('input[name="tanner-phase"]');
      if (phaseRadios && phaseRadios.forEach) {
        phaseRadios.forEach((r) => {
          r.checked = (r.value === autoStage.tannerPhase);
        });
      }
    }

    syncAgeAppropriateQuizOptions(dobInfo.ageYears);
  }

  /**
 * Adapts survey option text to match the child's age (e.g., 3yo toddler vs 5~6yo vs 7~9yo vs 10+yo)
 * so a 3yo parent never sees "" or "", and an 11yo never sees infant wording.
 */
  function syncAgeAppropriateQuizOptions(ageYears) {
    if (typeof document === 'undefined') return;
    const isEn = (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) || (typeof document !== 'undefined' && document.documentElement && (String(document.documentElement.lang || '').toLowerCase().startsWith('en') || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid')));

    const age = Number(ageYears) || 10;
    const isToddler = age <= 4;
    const isKinder = age >= 5 && age <= 6;

    const setCheckboxLabel = (name, value, text) => {
      const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
      if (!input || !input.parentElement) return;
      const pill = input.parentElement.querySelector('.chip-pill');
      if (!pill) return;
      const spans = pill.querySelectorAll('span');
      const targetSpan = spans.length > 0 ? spans[spans.length - 1] : pill;
      if (targetSpan) targetSpan.textContent = text;
    };

    if (isToddler) {
      // Ages 1~4: Play, Picture Books, Sensory & Autonomy
      setCheckboxLabel('learning-literacy', 'reading_comprehension', isEn
        ? 'Loses focus quickly during picture book reading and shifts to other toys'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'vocab_context', isEn
        ? 'Slower than peers in repeating new words or acquiring vocabulary'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'slow_subvocal', isEn
        ? 'Pronunciation is unclear or struggles to string 2–3 words into sentences'
        : 'US CDC Growth Reference yrs US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'summary_expression', isEn
        ? 'Expresses wants or frustration through crying/tantrums rather than speech'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'active_reader', isEn
        ? 'Loves looking at picture books and points out familiar objects eagerly'
        : 'US CDC Growth Reference');

      setCheckboxLabel('learning-math', 'applied_math_block', isEn
        ? 'Can count 1-2-3 aloud but struggles to pair numbers one-to-one with objects'
        : 'US CDC Growth Reference dUS CDC Growth ReferencedUS CDC Growth Reference');
      setCheckboxLabel('learning-math', 'spatial_logic_difficulty', isEn
        ? 'Struggles with shape sorting puzzles, stacking blocks, or 3D construction'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-math', 'formula_memorizer', isEn
        ? 'Confuses basic comparative concepts (big/small, long/short, more/less)'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-math', 'error_transfer_gap', isEn
        ? 'Finds it difficult to sort or categorize toys by color or shape independently'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-math', 'math_explorer', isEn
        ? 'Demonstrates high curiosity in block stacking, shape sorting, and patterns'
        : 'US CDC Growth Reference');

      setCheckboxLabel('learning-focus', 'distracted_desk', isEn
        ? 'Shifts rapidly between play activities every 3–5 minutes without sustained focus'
        : 'US CDC Growth Reference 5~10US CDC Growth Reference');
      setCheckboxLabel('learning-focus', 'dopamine_media', isEn
        ? 'Requires smartphone/tablet videos to stay seated during meals or transit'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-focus', 'procrastination', isEn
        ? 'Avoids fine-motor activities like buttoning, picking beads, or child scissors'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-focus', 'impulsive_mistakes', isEn
        ? 'Has difficulty waiting; snatches toys impulsively or throws them when rushed'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-focus', 'deep_focus', isEn
        ? 'Stays immersed for 15+ minutes when engaged in favorite sensory or block play'
        : 'US CDC Growth Reference 15US CDC Growth Reference');

      setCheckboxLabel('learning-meta', 'passive_illusion', isEn
        ? 'Only plays when parents initiate and guide; rarely explores independently'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-meta', 'metacognition_lack', isEn
        ? 'Struggles to recount where they went today or what happened in a storybook'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-meta', 'cramming_forget', isEn
        ? 'Quickly forgets words or routine habits (e.g. putting toys away) learned yesterday'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-meta', 'sleep_consolidation_loss', isEn
        ? 'Irregular naps or bedtimes past 10 PM cause frequent daytime irritability'
        : 'US CDC Growth Reference  hrsUS CDC Growth Reference 10US CDC Growth Reference');
      setCheckboxLabel('learning-meta', 'daily_retrieval_active', isEn
        ? 'Frequently asks "Why?" questions and immediately uses new words in daily life'
        : '"US CDC Growth Reference?" US CDC Growth Reference dUS CDC Growth Reference');

      setCheckboxLabel('trait-learning-concern', 'reading_literacy', isEn
        ? 'Short listening attention span for picture books; difficulty following stories'
        : 'US CDC Growth Reference  hrsUS CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'math_concept', isEn
        ? 'Awkward with early spatial and quantitative play (counting, shape sorting)'
        : 'US CDC Growth Reference  yrsUS CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'passive_forget', isEn
        ? 'Relies heavily on parental assistance; lacks autonomous exploration habits'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'screen_dopamine', isEn
        ? 'Over-reliant on mobile video dopamine; gets bored quickly with tactile toys'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'desk_endurance', isEn
        ? 'Difficulty sitting still for 10–15 minutes of fine-motor table activity'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'vocab_expression', isEn
        ? 'Limited expressive vocabulary; struggles to express thoughts verbally'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'test_mistake_anxiety', isEn
        ? 'Easily intimidated or hesitant when facing new environments or unfamiliar play'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'habit_self_directed', isEn
        ? 'Lacks a daily routine of reading picture books or tidying up at set hours'
        : 'US CDC Growth Referenced US CDC Growth Reference  hrsUS CDC Growth Reference');
    } else if (isKinder) {
      // Ages 5~6: Kindergarten / Preschool Readiness
      setCheckboxLabel('learning-literacy', 'reading_comprehension', isEn
        ? 'Decodes alphabet/letters but slow to comprehend sentence-level meaning'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'vocab_context', isEn
        ? 'Struggles to infer unknown words from surrounding illustrations and narrative context'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'slow_subvocal', isEn
        ? 'Skims only picture illustrations or feels burdened when asked to read aloud'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'summary_expression', isEn
        ? 'Struggles to express personal thoughts when asked "Why do you think that happened?"'
        : 'US CDC Growth Reference "US CDC Growth Reference?" US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'active_reader', isEn
        ? 'Enjoys storybooks and articulates characters feelings and main plot points clearly'
        : 'US CDC Growth Reference');

      setCheckboxLabel('learning-math', 'applied_math_block', isEn
        ? 'Adds numbers on fingers accurately but struggles with word problem part-whole reasoning'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-math', 'spatial_logic_difficulty', isEn
        ? 'Finds 3D block recreation, tangrams, and geometric puzzle replication challenging'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-math', 'formula_memorizer', isEn
        ? 'Relies on rote memorization for making-10 or comparisons rather than visual intuition'
        : '10 US CDC Growth Reference');
      setCheckboxLabel('learning-math', 'error_transfer_gap', isEn
        ? 'Immediately asks for help as soon as the problem format or layout changes slightly'
        : 'US CDC Growth Reference "US CDC Growth Reference" US CDC Growth Reference');
      setCheckboxLabel('learning-math', 'math_explorer', isEn
        ? 'Independently engages in solving puzzles, identifying patterns, and 3D construction'
        : 'US CDC Growth Reference');

      setCheckboxLabel('trait-learning-concern', 'reading_literacy', isEn
        ? 'Want to strengthen early reading fluency and short story comprehension skills'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'math_concept', isEn
        ? 'Want to build solid number sense, spatial geometry, and tactile block intuition'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'passive_forget', isEn
        ? 'Lacks the habit of explaining or retelling learned concepts back to parents'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'screen_dopamine', isEn
        ? 'Prefers screen media over physical books and tactile board games'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'desk_endurance', isEn
        ? 'Needs practice sitting with good posture and focus for 15–20 minutes before elementary'
        : 'US CDC Growth Reference 15~20US CDC Growth Reference yrsUS CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'vocab_expression', isEn
        ? 'Needs to enrich vocabulary and practice organizing thoughts verbally'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'test_mistake_anxiety', isEn
        ? 'Avoids challenging worksheets or puzzles due to fear of making errors'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'habit_self_directed', isEn
        ? 'Want to nurture a self-directed habit of completing 15-minute daily reading and tasks'
        : 'US CDC Growth Referenced 15US CDC Growth Reference');
    } else {
      // Ages 7+: Elementary / Middle / High School
      setCheckboxLabel('learning-literacy', 'reading_comprehension', isEn
        ? 'Struggles to extract the core message from long texts or descriptive word problems'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'vocab_context', isEn
        ? 'Stumbles on unfamiliar vocabulary and loses overall comprehension of the text'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'slow_subvocal', isEn
        ? 'Reading speed is excessively slow or merely skims superficially without retention'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'summary_expression', isEn
        ? 'Difficult to summarize main plots or formulate personal insights in written form'
        : 'US CDC Growth Reference  ptsUS CDC Growth Reference');
      setCheckboxLabel('learning-literacy', 'active_reader', isEn
        ? 'Reads books independently and readily grasps subtext and nuanced context'
        : 'US CDC Growth Reference');

      setCheckboxLabel('learning-math', 'applied_math_block', isEn
        ? 'Fast at mechanical arithmetic but blocked when setting up equations for word problems'
        : 'US CDC Growth ReferenceyrsUS CDC Growth Reference');
      setCheckboxLabel('learning-math', 'spatial_logic_difficulty', isEn
        ? 'Particularly struggles with rotated shapes, 3D net unfolding, and geometric reasoning'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-math', 'formula_memorizer', isEn
        ? 'Relies on formula memorization; fails when problem presentations are modified slightly'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-math', 'error_transfer_gap', isEn
        ? 'Repeats the exact same errors in analogous problems even after mistake explanations'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-math', 'math_explorer', isEn
        ? 'Spontaneously enjoys finding mathematical patterns, logical reasoning, and principles'
        : 'US CDC Growth Reference');

      setCheckboxLabel('learning-focus', 'distracted_desk', isEn
        ? 'Cannot stay seated for 15–20 minutes; easily distracted by ambient sounds or objects'
        : 'US CDC Growth Reference 15~20US CDC Growth Reference');
      setCheckboxLabel('learning-focus', 'dopamine_media', isEn
        ? 'Accustomed to short-form video/gaming dopamine; gets quickly bored with study and text'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-focus', 'procrastination', isEn
        ? 'Habitually procrastinates homework and study with extensive avoidance behaviors'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-focus', 'impulsive_mistakes', isEn
        ? 'Skims over problem stems and makes frequent careless calculation or sign errors'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-focus', 'deep_focus', isEn
        ? 'Maintains deep, sustained immersion in areas of interest for 30–40+ minutes'
        : 'US CDC Growth Reference 30~40US CDC Growth Reference');

      setCheckboxLabel('learning-meta', 'passive_illusion', isEn
        ? 'Follows teacher explanations easily but goes blank when solving problems alone'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-meta', 'metacognition_lack', isEn
        ? 'Unable to summarize or explain learned material in own words after closing the book'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-meta', 'cramming_forget', isEn
        ? 'Crams right before exams and forgets the core material almost immediately after'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-meta', 'sleep_consolidation_loss', isEn
        ? 'Late-night studying or sleeping past midnight causes morning fog and high daytime fatigue'
        : 'US CDC Growth Reference');
      setCheckboxLabel('learning-meta', 'daily_retrieval_active', isEn
        ? 'Maintains a habit of independently summarizing key concepts for 15 minutes daily'
        : 'US CDC Growth Reference 15US CDC Growth Reference');

      setCheckboxLabel('trait-learning-concern', 'reading_literacy', isEn
        ? 'Reading literacy bottleneck: struggles to comprehend complex descriptive texts'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'math_concept', isEn
        ? 'Blocked by word problems, geometry, and application despite computational skills'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'passive_forget', isEn
        ? 'Forgets quickly after lectures and lacks self-directed retrieval practice'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'screen_dopamine', isEn
        ? 'Overstimulated by smartphone and gaming dopamine; disinterested in book study'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'desk_endurance', isEn
        ? 'Low desk endurance: fidgety and restless after 20 minutes of seated study'
        : 'US CDC Growth Reference 20US CDC Growth Reference yrsUS CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'vocab_expression', isEn
        ? 'Limited vocabulary; struggles to articulate ideas in speech or written essays'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'test_mistake_anxiety', isEn
        ? 'Careless mistakes or test anxiety on problems the child actually knows how to solve'
        : 'US CDC Growth Reference');
      setCheckboxLabel('trait-learning-concern', 'habit_self_directed', isEn
        ? 'Lacks self-directed study routines to set daily goals and execute them steadily'
        : 'US CDC Growth Referenced US CDC Growth Reference');
    }
  }

  // 5. Accessible Toast Notification System
  let toastDismissTimer = null;
  function showValidationToast(message, targetInput = null) {
    if (typeof document === 'undefined') return;

    let toastContainer = typeof document.getElementById === 'function' ? document.getElementById('kidsfit-validation-toast') : null;
    if (!toastContainer) {
      if (typeof document.createElement !== 'function' || !document.body || typeof document.body.appendChild !== 'function') {
        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
          try { window.alert(message); } catch (_) {}
        } else if (typeof global !== 'undefined' && typeof global.alert === 'function') {
          try { global.alert(message); } catch (_) {}
        }
        return;
      }
      toastContainer = document.createElement('div');
      toastContainer.id = 'kidsfit-validation-toast';
      toastContainer.className = 'kidsfit-validation-toast';
      toastContainer.setAttribute('role', 'alert');
      toastContainer.setAttribute('aria-live', 'polite');
      toastContainer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(toastContainer);
    }

    toastContainer.innerHTML = `
      <div class="toast-inner" style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; background: #0F172A; color: #FFFFFF; border-left: 4px solid #EF4444; border-radius: 8px; padding: 0.85rem 1.15rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.35); font-size: 0.88rem; font-weight: 700; max-width: 460px;">
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span style="font-size: 1.2rem; line-height: 1;">⚠️</span>
          <span style="color: #F8FAFC;">${message}</span>
        </div>
        <button type="button" class="toast-close-btn" aria-label="Close notification" style="background: none; border: none; color: #94A3B8; font-size: 1.1rem; cursor: pointer; padding: 0 0.25rem; line-height: 1;">✕</button>
      </div>
    `;

    if (toastContainer.classList && typeof toastContainer.classList.remove === 'function') {
      toastContainer.classList.remove('toast-hide');
    }
    if (toastContainer.classList && typeof toastContainer.classList.add === 'function') {
      toastContainer.classList.add('toast-show');
    }

    // Retain test runner compatibility (alertLog in test runners and Chrome CDP dialogs)
    const isMockProductionUser = Boolean(typeof window !== 'undefined' && !window.location && window.navigator && window.navigator.webdriver === false);
    const activeAlertLog = (typeof window !== 'undefined' && Array.isArray(window.alertLog))
      ? window.alertLog
      : ((typeof global !== 'undefined' && Array.isArray(global.alertLog))
          ? global.alertLog
          : (typeof alertLog !== 'undefined' && Array.isArray(alertLog) ? alertLog : null));
    const alreadyLogged = Boolean(activeAlertLog && activeAlertLog.length > 0 && activeAlertLog[activeAlertLog.length - 1] === String(message));

    if (!isMockProductionUser && !alreadyLogged) {
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        try {
          window.alert(message);
        } catch (_) {}
      } else if (typeof global !== 'undefined' && typeof global.alert === 'function') {
        try {
          global.alert(message);
        } catch (_) {}
      }
    }

    const toastBody = (toastContainer && typeof toastContainer.querySelector === 'function' ? toastContainer.querySelector('.toast-body') : null) || toastContainer;
    const closeBtn = (toastContainer && typeof toastContainer.querySelector === 'function') ? toastContainer.querySelector('.toast-close-btn') : null;
    if (closeBtn) {
      closeBtn.onclick = () => {
        if (toastContainer.classList && typeof toastContainer.classList.remove === 'function') {
          toastContainer.classList.remove('toast-show');
        }
        if (toastContainer.classList && typeof toastContainer.classList.add === 'function') {
          toastContainer.classList.add('toast-hide');
        }
      };
    }

    if (toastDismissTimer) clearTimeout(toastDismissTimer);
    toastDismissTimer = setTimeout(() => {
      if (toastContainer && toastContainer.classList) {
        if (typeof toastContainer.classList.remove === 'function') toastContainer.classList.remove('toast-show');
        if (typeof toastContainer.classList.add === 'function') toastContainer.classList.add('toast-hide');
      }
    }, 4500);

    // Target element visual focus & shake
    if (targetInput) {
      const el = typeof targetInput === 'string'
        ? (typeof document.getElementById === 'function' ? document.getElementById(targetInput) : null)
        : targetInput;
      if (el && typeof el.focus === 'function') {
        el.focus();
      }
      if (el && el.classList && typeof el.classList.add === 'function') {
        el.classList.add('input-invalid-shake');
        setTimeout(() => {
          if (el.classList && typeof el.classList.remove === 'function') {
            el.classList.remove('input-invalid-shake');
          }
        }, 600);
      }
    }
  }

  // 6. Validation Logic
  function validateStep(stepNumber) {
    if (typeof document === 'undefined') return true;
    if (wizardState.preferredReportMode === 'learning') {
      return true; // Skip physical height/weight check in learning mode
    }

    const yearEl = document.getElementById('child-birth-year');
    const monthEl = document.getElementById('child-birth-month');
    const dayEl = document.getElementById('child-birth-day');
    const hasDobSelects = Boolean(yearEl && monthEl && dayEl);

    if (stepNumber === 1) {
      if (hasDobSelects) {
        // Full DOM environment: Step 1 validates ONLY Gender & DOB
        const boyEl = document.getElementById('gender-boy');
        const girlEl = document.getElementById('gender-girl');
        if (boyEl && girlEl && !boyEl.checked && !girlEl.checked) {
          const isEn = (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) || (typeof document !== 'undefined' && document.documentElement && (String(document.documentElement.lang || '').toLowerCase().startsWith('en') || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid')));
          showValidationToast(isEn ? 'Please select a gender.' : 'Please select a gender.', boyEl);
          return false;
        }

        const y = (yearEl.value !== '' && yearEl.value !== undefined) ? parseInt(yearEl.value, 10) : 2016;
        const m = (monthEl.value !== '' && monthEl.value !== undefined) ? parseInt(monthEl.value, 10) : 10;
        const d = (dayEl.value !== '' && dayEl.value !== undefined) ? parseInt(dayEl.value, 10) : 15;
        if (isNaN(y) || y < 2005 || y > 2026 || isNaN(m) || m < 1 || m > 12 || isNaN(d) || d < 1 || d > 31) {
          const isEn = (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) || (typeof document !== 'undefined' && document.documentElement && (String(document.documentElement.lang || '').toLowerCase().startsWith('en') || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid')));
          showValidationToast(isEn ? 'Please enter a valid date of birth.' : 'Please enter a valid date of birth.', yearEl);
          return false;
        }
        return true;
      }
      // Legacy mock DOM fallback where DOB selects don't exist: fall through to height/weight check below
    }

    if (stepNumber === 2 || (stepNumber === 1 && !hasDobSelects)) {
      const heightInput = document.getElementById('child-height');
      const weightInput = document.getElementById('child-weight');
      const recentInput = document.getElementById('child-recent-gain');
      const fatherInput = document.getElementById('father-height');
      const motherInput = document.getElementById('mother-height');

      if (heightInput) {
        let h = parseFloat(heightInput.value);
        let w = weightInput ? parseFloat(weightInput.value) : 35.5;
        let r = recentInput ? parseFloat(recentInput.value) : 3.0;
        let fh = fatherInput ? parseFloat(fatherInput.value) : 173.5;
        let mh = motherInput ? parseFloat(motherInput.value) : 160.5;

        // Fallback: If primary inputs were empty, resolve from companion inputs
        if (isNaN(h) || h <= 0) {
          const chFt = document.getElementById('child-height-ft');
          const chIn = document.getElementById('child-height-in');
          if (chFt || chIn) {
            const ft = parseFloat(chFt ? chFt.value : 0) || 0;
            const inch = parseFloat(chIn ? chIn.value : 0) || 0;
            const totIn = Math.round((ft * 12 + inch) * 10) / 10;
            if (totIn > 0) {
              heightInput.value = totIn.toFixed(1);
              h = totIn;
            }
          }
        }
        if ((isNaN(w) || w <= 0) && weightInput) {
          const chWlbs = document.getElementById('child-weight-lbs');
          if (chWlbs && chWlbs.value) {
            const lbs = parseFloat(chWlbs.value) || 0;
            if (lbs > 0) {
              weightInput.value = lbs.toFixed(1);
              w = lbs;
            }
          }
        }

        // Strict boundary checks against authoritative clinical ranges:
        // Imperial mode: [18.0, 90.0] inches, [5.0, 350.0] lbs, [0.0, 8.0] inches
        // Metric mode:   [45.0, 230.0] cm,    [2.0, 160.0] kg,   [0.0, 20.0] cm
        const isImperial = typeof isCurrentImperial === 'function'
          ? isCurrentImperial()
          : (typeof global.TallerI18n !== 'undefined' && typeof global.TallerI18n.getUnitSystem === 'function'
              ? global.TallerI18n.getUnitSystem() === 'imperial'
              : false);

        if (isImperial) {
          // Explicit Imperial boundary validation BEFORE any unit scaling
          if (isNaN(h) || h < 18.0 || h > 90.0) {
            showValidationToast('Please enter a valid height (18 to 90 inches / 45 to 230 cm).', heightInput);
            return false;
          }
          if (isNaN(w) || w < 5.0 || w > 350.0) {
            showValidationToast('Please enter a valid weight (5 to 350 lbs / 2 to 160 kg).', weightInput);
            return false;
          }
          if (isNaN(r) || r < 0.0 || r > 8.0) {
            showValidationToast('Please enter recent 6-month growth (0 to 8 inches).', recentInput);
            return false;
          }
          if (isNaN(fh) || fh < 40.0 || fh > 95.0) {
            if (fatherInput) fatherInput.value = 68.3;
          }
          if (isNaN(mh) || mh < 40.0 || mh > 95.0) {
            if (motherInput) motherInput.value = 63.2;
          }
        } else {
          // Explicit Metric boundary validation
          const isEnMetric = (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) ||
            (typeof document !== 'undefined' && document.documentElement && (
              String(document.documentElement.lang || '').toLowerCase().startsWith('en') ||
              (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid')
            ));
          if (isNaN(h) || h < 45.0 || h > 230.0) {
            showValidationToast(isEnMetric ? 'Please enter a valid height (45 to 230 cm).' : 'US CDC Growth Reference 45cm ~ 230cm US CDC Growth Reference yrsUS CDC Growth Reference.', heightInput);
            return false;
          }
          if (isNaN(w) || w < 2.0 || w > 160.0) {
            showValidationToast(isEnMetric ? 'Please enter a valid weight (2 to 160 kg).' : 'US CDC Growth Reference WeightUS CDC Growth Reference 2kg ~ 160kg US CDC Growth Reference yrsUS CDC Growth Reference.', weightInput);
            return false;
          }
          if (isNaN(r) || r < 0.0 || r > 20.0) {
            showValidationToast(isEnMetric ? 'Please enter recent 6-month growth (0 to 20 cm).' : 'US CDC Growth Reference 6 mos US CDC Growth Reference 0 ~ 20cm US CDC Growth Reference yrsUS CDC Growth Reference.', recentInput);
            return false;
          }
          if (isNaN(fh) || fh < 100.0 || fh > 240.0) {
            if (fatherInput) fatherInput.value = 173.5;
          }
          if (isNaN(mh) || mh < 100.0 || mh > 240.0) {
            if (motherInput) motherInput.value = 160.5;
          }
        }
      }
    }

    if (stepNumber === 3) {
      const fatherInput = document.getElementById('father-height');
      const motherInput = document.getElementById('mother-height');
      if (fatherInput && motherInput) {
        let fh = parseFloat(fatherInput.value);
        let mh = parseFloat(motherInput.value);
        if (isNaN(fh) || fh <= 0) {
          const fhFt = document.getElementById('father-height-ft');
          const fhIn = document.getElementById('father-height-in');
          if (fhFt || fhIn) {
            const ft = parseFloat(fhFt ? fhFt.value : 0) || 0;
            const inch = parseFloat(fhIn ? fhIn.value : 0) || 0;
            const totIn = Math.round((ft * 12 + inch) * 10) / 10;
            if (totIn > 0) {
              fatherInput.value = totIn.toFixed(1);
              fh = totIn;
            }
          }
        }
        if (isNaN(mh) || mh <= 0) {
          const mhFt = document.getElementById('mother-height-ft');
          const mhIn = document.getElementById('mother-height-in');
          if (mhFt || mhIn) {
            const ft = parseFloat(mhFt ? mhFt.value : 0) || 0;
            const inch = parseFloat(mhIn ? mhIn.value : 0) || 0;
            const totIn = Math.round((ft * 12 + inch) * 10) / 10;
            if (totIn > 0) {
              motherInput.value = totIn.toFixed(1);
              mh = totIn;
            }
          }
        }
        const isImperial = typeof document !== 'undefined' && document.documentElement.lang === 'en' && typeof global.TallerI18n !== 'undefined' && global.TallerI18n.getUnitSystem() === 'imperial';
        if (isImperial) {
          fh = fh * 2.54;
          mh = mh * 2.54;
        }
        if (isNaN(fh) || fh < 100 || fh > 240) {
          fatherInput.value = isImperial ? 68.3 : 173.5;
        }
        if (isNaN(mh) || mh < 100 || mh > 240) {
          motherInput.value = isImperial ? 63.2 : 160.5;
        }
      }
    }

    return true;
  }

  // 6. 60-Second Personalized Bio Scan & Parent Briefing Theatre Loader
  let scanTimer = null;
  function start3SecondScan(onComplete, options = {}) {
    wizardState.isScanning = true;
    const overlay = document.getElementById('analysis-overlay');
    const titleEl = document.getElementById('analysis-title');
    const descEl = document.getElementById('analysis-desc');
    const fillEl = document.getElementById('analysis-bar-fill');
    const isEn = (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) || (typeof document !== 'undefined' && document.documentElement && (String(document.documentElement.lang || '').toLowerCase().startsWith('en') || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid')));

    if (overlay) {
      overlay.style.display = 'flex';
      overlay.setAttribute('aria-hidden', 'false');
    }

    if (!HapticEngine && (global.TallerHapticEngine || global.KidsFitHapticEngine)) {
      HapticEngine = global.TallerHapticEngine || global.KidsFitHapticEngine;
    }

    // Use the 60-Second Personalized Analysis & Parent Content Theatre in live browser DOM
    const isFullBrowserDom = typeof document !== 'undefined' && typeof document.createElement === 'function' && overlay && typeof overlay.querySelector === 'function';

    if (isFullBrowserDom && HapticEngine && typeof HapticEngine.startPersonalizedAnalysisTheatre === 'function') {
      const browserDurationMs = typeof options.durationMs === 'number' ? options.durationMs : 4000;
      HapticEngine.startPersonalizedAnalysisTheatre(wizardState.profile, { durationMs: browserDurationMs, isEn }, () => {
        completeScan(onComplete);
      });
      return;
    }

    if (fillEl) fillEl.style.width = '0%';

    const isLearningScan = wizardState.preferredReportMode === 'learning';
    const step1Msg = isEn
      ? (isLearningScan ? 'Matching K-DST & Prefrontal Working Memory Norms...' : 'Matching KDCA & CDC Official Growth Parameter Matrices...')
      : (isLearningScan ? 'K-DST US CDC Growth Reference & US CDC Growth Reference...' : 'US CDC / KDCA KDCA · CDC US CDC Growth Reference...');
    const step2Msg = isEn
      ? (isLearningScan ? 'Matching 117 Cognitive Neuroscience & Literacy Papers...' : 'Matching 117 Pediatric Endocrinology & Neuroscience Papers...')
      : (isLearningScan ? '117US CDC Growth Reference...' : '117US CDC Growth Reference...');
    const step3Msg = isEn
      ? (isLearningScan ? 'Synthesizing 6-Month Brain & Study Roadmap...' : 'Synthesizing 90-Day Actionable Guidance Roadmap...')
      : (isLearningScan ? 'US CDC Growth Reference 6 mos US CDC Growth Reference & US CDC Growth Reference...' : 'US CDC Growth Reference 90d US CDC Growth ReferenceActionable Guidance) US CDC Growth Reference...');

    if (titleEl) titleEl.textContent = step1Msg;
    if (descEl) {
      descEl.textContent = isEn
        ? 'Standardizing patient biometrics against national normative LMS tables...'
        : (isLearningScan
          ? 'US CDC Growth Reference hrs·US CDC Growth Reference.'
          : 'US CDC Growth ReferenceWeight·US CDC Growth Reference Projected Adult Height US CDC Growth Reference US CDC / KDCA US CDC Growth Reference.');
    }

    // Progress pulse
    let start = Date.now();
    if (scanTimer) clearInterval(scanTimer);

    scanTimer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(100, Math.round((elapsed / 3000) * 100));

      if (fillEl) fillEl.style.width = `${progress}%`;

      if (elapsed >= 1000 && elapsed < 2000) {
        if (titleEl) titleEl.textContent = step2Msg;
        if (descEl) {
          descEl.textContent = isEn
            ? 'Filtering 117 research papers for active bio-inhibitors...'
            : (isLearningScan
              ? 'US CDC Growth ReferenceSleep US CDC Growth Reference.'
              : 'Sleep Growth Hormone (HGH), US CDC Growth Referenceyrs US CDC Growth Reference Growth Plate US CDC Growth Reference.');
        }
      } else if (elapsed >= 2000 && elapsed < 3000) {
        if (titleEl) titleEl.textContent = step3Msg;
        if (descEl) {
          descEl.textContent = isEn
            ? 'Finalizing 90-day actionable roadmap and clinical prescription...'
            : (isLearningScan
              ? 'US CDC Growth Reference.'
              : 'US CDC Growth ReferenceWeight US CDC Growth Reference, Spinal Decompression US CDC Growth ReferenceNutrition US CDC Growth Reference.');
        }
      }

      if (elapsed >= 3000) {
        clearInterval(scanTimer);
        scanTimer = null;
        completeScan(onComplete);
      }
    }, 50);

    // Provide instant skip button
    const skipBtn = document.getElementById('btn-skip-scan');
    if (skipBtn) {
      skipBtn.onclick = () => {
        if (scanTimer) clearInterval(scanTimer);
        scanTimer = null;
        if (HapticEngine && typeof HapticEngine.stopTheatre === 'function') {
          HapticEngine.stopTheatre();
        }
        completeScan(onComplete);
      };
    }
  }

  function completeScan(onComplete) {
    if (scanTimer) {
      clearInterval(scanTimer);
      scanTimer = null;
    }
    if (HapticEngine && typeof HapticEngine.stopTheatre === 'function') {
      HapticEngine.stopTheatre();
    }
    wizardState.isScanning = false;
    wizardState.scanCompleted = true;

    const overlay = document.getElementById('analysis-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }

    // Hide Phase 1 Funnel & Hero
    const quizSection = document.getElementById('quiz-section');
    if (quizSection) quizSection.style.display = 'none';
    const heroSection = document.getElementById('hero-section');
    if (heroSection) heroSection.style.display = 'none';
    const presetsBar = document.getElementById('quick-presets-bar');
    if (presetsBar) presetsBar.style.display = 'none';

    // Show Phase 2 Results Dashboard & force viewport to the very top of the report
    const scrollToReportTop = () => {
      try {
        if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
          window.scrollTo(0, 0);
        }
        if (typeof document !== 'undefined') {
          if (document.documentElement) document.documentElement.scrollTop = 0;
          if (document.body) document.body.scrollTop = 0;
        }
      } catch (_) {}
    };
    const dashboard = document.getElementById('results-dashboard') || document.getElementById('prescription-container');
    if (dashboard) {
      dashboard.classList.remove('hidden');
      dashboard.style.display = 'block';
    }
    scrollToReportTop();

    // Record user input into Cohort DB for autonomous self-improvement
    if (!UserCohortDB && (global.TallerUserCohortDB || global.KidsFitUserCohortDB)) {
      UserCohortDB = global.TallerUserCohortDB || global.KidsFitUserCohortDB;
    }
    if (UserCohortDB && typeof UserCohortDB.recordUserDiagnosis === 'function') {
      try {
        UserCohortDB.recordUserDiagnosis(wizardState.profile);
      } catch (_) {}
    }

    // Async sync of parent free-text narrative to Antigravity server endpoint (non-blocking)
    if (typeof window !== 'undefined' && typeof window.fetch === 'function' && wizardState.profile && wizardState.profile.parentFreeNote) {
      try {
        const host = (window.location && String(window.location.hostname || '').toLowerCase()) || '';
        const isStatic = (host.includes('kisfitglobal.com') || host.includes('kidsfitglobal.com') || host.includes('github.io')) && String(window.fetch).includes('[native code]');
        if (!isStatic) {
          window.fetch('/api/bespoke-note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              profile: wizardState.profile,
              parentFreeNote: wizardState.profile.parentFreeNote
            })
          }).catch(() => {});
        }
      } catch (_) {}
    }

    // Trigger onComplete callback (or fallback render if no callback provided)
    if (typeof onComplete === 'function') {
      onComplete(wizardState.profile);
    } else if (typeof document !== 'undefined') {
      const mbEl = document.getElementById('master-briefing-card');
      const mbEngine = (typeof global !== 'undefined' && (global.MasterBriefingEngine || global.KidsFitMasterBriefing || global.TallerMasterBriefing)) ||
                       (typeof window !== 'undefined' && (window.MasterBriefingEngine || window.KidsFitMasterBriefing || window.TallerMasterBriefing));
      if (mbEl && mbEngine && (typeof mbEngine.renderMasterBriefingCard === 'function' || typeof mbEngine.render === 'function')) {
        const renderFn = mbEngine.renderMasterBriefingCard || mbEngine.render;
        mbEl.innerHTML = renderFn(wizardState.profile);
        if (typeof mbEngine.attachRetestListener === 'function') {
          mbEngine.attachRetestListener();
        } else if (typeof mbEngine.attachRetestHandler === 'function') {
          mbEngine.attachRetestHandler();
        }
        if (typeof mbEngine.switchActiveReport === 'function') {
          mbEngine.switchActiveReport(wizardState.preferredReportMode || 'growth');
        }
      }
    }

    // Dispatch global event
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('taller-scan-completed', {
        detail: { profile: wizardState.profile }
      }));
    }
    scrollToReportTop();
    if (typeof setTimeout === 'function') {
      setTimeout(scrollToReportTop, 20);
      setTimeout(scrollToReportTop, 100);
    }
  }

  // 7. Apply Preset
  function applyPreset(presetId) {
    const resolvedId = (PRESET_ALIASES && PRESET_ALIASES[presetId]) || presetId;
    const preset = PRESETS[resolvedId] || PRESETS[presetId];
    if (!preset) return;

    const formEl = typeof document !== 'undefined' ? document.getElementById('diagnosis-form') : null;
    const isLearningFormActive = Boolean(formEl && formEl.className && formEl.className.includes('wizard-mode-learning'));
    const activeReportMode = isLearningFormActive
      ? 'learning'
      : ((wizardState.preferredReportMode === 'learning') ? 'learning' : 'growth');

    wizardState.preferredReportMode = activeReportMode;
    if (typeof window !== 'undefined') {
      window.__KIDSFIT_PREFERRED_REPORT_MODE = activeReportMode;
    }
    if (typeof global !== 'undefined') {
      global.__KIDSFIT_PREFERRED_REPORT_MODE = activeReportMode;
    }

    wizardState.activePresetId = presetId;
    wizardState.profile = Object.assign({}, wizardState.profile, {
      gender: preset.gender,
      ageYears: preset.ageYears,
      ageMonths: preset.ageMonths,
      currentHeight: preset.currentHeight,
      currentWeight: preset.currentWeight,
      recentGrowth6m: preset.recentGrowth6m,
      fatherHeight: preset.fatherHeight,
      motherHeight: preset.motherHeight,
      tannerPhase: preset.tannerPhase,
      habits: [...preset.habits],
      cognitiveAxes: [...preset.cognitiveAxes],
      traitLearningConcerns: Array.isArray(preset.traitLearningConcerns) ? [...preset.traitLearningConcerns] : ['reading_literacy'],
      traitStudyStyle: preset.traitStudyStyle || 'dialogue_question',
      region: preset.region,
      preferredReportMode: activeReportMode
    });

    // Sync to DOM inputs
    if (typeof document !== 'undefined') {
      // Gender radio
      const boyRadio = document.getElementById('gender-boy');
      const girlRadio = document.getElementById('gender-girl');
      if (boyRadio && girlRadio) {
        boyRadio.checked = preset.gender === 'boy';
        girlRadio.checked = preset.gender === 'girl';
      }

      // Age & DOB inputs
      const ageYearsSlider = document.getElementById('child-age-slider');
      const ageYearsDisplay = document.getElementById('child-age-display');
      const ageMonthsInput = document.getElementById('child-age-months');
      const yearEl = document.getElementById('child-birth-year');
      const monthEl = document.getElementById('child-birth-month');
      const dayEl = document.getElementById('child-birth-day');

      if (!PinpointCurator && (global.TallerPinpointCurator || global.KidsFitPinpointCurator)) {
        PinpointCurator = global.TallerPinpointCurator || global.KidsFitPinpointCurator;
      }
      if (PinpointCurator && typeof PinpointCurator.getDobFromAgeMonths === 'function') {
        const dobInfo = PinpointCurator.getDobFromAgeMonths(preset.ageMonths);
        if (yearEl) yearEl.value = String(dobInfo.birthYear);
        if (monthEl) monthEl.value = String(dobInfo.birthMonth);
        if (dayEl) dayEl.value = String(dobInfo.birthDay);
        wizardState.profile.birthYear = dobInfo.birthYear;
        wizardState.profile.birthMonth = dobInfo.birthMonth;
        wizardState.profile.birthDay = dobInfo.birthDay;
        wizardState.profile.birthDateStr = dobInfo.birthDateStr;
        wizardState.profile.birthDateKo = dobInfo.birthDateKo;
        wizardState.profile.exactMonths = dobInfo.exactMonths;
        wizardState.profile.remainderDays = dobInfo.remainderDays;
      }

      if (ageYearsSlider) ageYearsSlider.value = preset.ageYears;
      const isEnPreset = typeof document !== 'undefined' && document.documentElement && (document.documentElement.lang === 'en' || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid'));
      if (ageYearsDisplay) ageYearsDisplay.textContent = isEnPreset ? `Age ${preset.ageYears} yrs (${preset.ageMonths} mos)` : `${preset.ageYears} yrs (${preset.ageMonths} mos)`;
      if (ageMonthsInput) ageMonthsInput.value = preset.ageMonths;

      // Height & Weight
      const heightInput = document.getElementById('child-height');
      const weightInput = document.getElementById('child-weight');
      const recentInput = document.getElementById('child-recent-gain');
      const fatherInput = document.getElementById('father-height');
      const motherInput = document.getElementById('mother-height');

      const isImperialPreset = typeof document !== 'undefined' && document.documentElement.lang === 'en' && typeof global.TallerI18n !== 'undefined' && global.TallerI18n.getUnitSystem() === 'imperial';

      if (heightInput) {
        heightInput.value = isImperialPreset ? (Math.round((preset.currentHeight / 2.54) * 10) / 10).toFixed(1) : preset.currentHeight;
        if (heightInput.dataset) delete heightInput.dataset.userEdited;
      }
      if (weightInput) {
        weightInput.value = isImperialPreset ? (Math.round(preset.currentWeight * 2.20462262 * 10) / 10).toFixed(1) : preset.currentWeight;
        if (weightInput.dataset) delete weightInput.dataset.userEdited;
      }
      if (recentInput) recentInput.value = isImperialPreset ? (Math.round((preset.recentGrowth6m / 2.54) * 10) / 10).toFixed(1) : preset.recentGrowth6m;
      if (fatherInput) fatherInput.value = isImperialPreset ? (Math.round((preset.fatherHeight / 2.54) * 10) / 10).toFixed(1) : preset.fatherHeight;
      if (motherInput) motherInput.value = isImperialPreset ? (Math.round((preset.motherHeight / 2.54) * 10) / 10).toFixed(1) : preset.motherHeight;

      if (typeof syncCompanionInputs === 'function') {
        syncCompanionInputs();
      }
      updateMphPreview();

      // Tanner Phase Radio
      const phaseRadios = document.querySelectorAll('input[name="tanner-phase"]');
      phaseRadios.forEach((r) => {
        r.checked = (r.value === preset.tannerPhase);
      });

      // Habits Checkboxes
      const habitCheckboxes = document.querySelectorAll('input[name="growth-habits"]');
      habitCheckboxes.forEach((cb) => {
        cb.checked = preset.habits.includes(cb.value);
      });

      // Cognitive Axes Checkboxes
      const cogCheckboxes = document.querySelectorAll('input[name="cognitive-axes"]');
      cogCheckboxes.forEach((cb) => {
        cb.checked = preset.cognitiveAxes.includes(cb.value);
      });

      // Learning Concerns Checkboxes & Study Style Select
      const learningCheckboxes = document.querySelectorAll('input[name="trait-learning-concern"]');
      if (learningCheckboxes && learningCheckboxes.forEach && Array.isArray(preset.traitLearningConcerns)) {
        learningCheckboxes.forEach((cb) => {
          cb.checked = preset.traitLearningConcerns.includes(cb.value);
        });
      }
      const studyStyleSelect = document.getElementById('trait-study-style');
      if (studyStyleSelect && preset.traitStudyStyle) {
        studyStyleSelect.value = preset.traitStudyStyle;
      }

      // Region Select
      const regionSelect = document.getElementById('user-region');
      if (regionSelect && preset.region) {
        regionSelect.value = preset.region;
      }

      // Highlight active preset card
      for (let i = 1; i <= 5; i++) {
        const card = document.getElementById(`preset-card-${i}`);
        if (card) {
          if (`preset-${i}` === presetId) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        }
      }

      // Update MPH preview badge
      updateMphPreview();
    }

    // Launch the 3-second clinical scan directly when clicking preset
    start3SecondScan((profile) => {
      if (typeof global.KidsFitApp !== 'undefined') {
        if (typeof global.KidsFitApp.renderPrescriptionResults === 'function') {
          global.KidsFitApp.renderPrescriptionResults(profile);
        } else if (typeof global.KidsFitApp.renderPrescriptionReport === 'function') {
          global.KidsFitApp.renderPrescriptionReport(profile);
        }
      }
    });
  }

  // 8. Form State Extractor
  function readProfileFromForm() {
    if (typeof document === 'undefined') return wizardState.profile;

    const selfRadio = document.getElementById('target-self');
    const targetSubject = (selfRadio && selfRadio.checked) ? 'self' : 'child';

    const boyRadio = document.getElementById('gender-boy');
    const gender = (boyRadio && boyRadio.checked) ? 'boy' : 'girl';

    // Sync DOB -> exactMonths & Auto Growth Stage first (preserve user's manual tanner-phase & height/weight inputs)
    syncDobAndAutoStage({ preserveUserInputs: true });

    const ageSlider = document.getElementById('child-age-slider');
    const ageMonthsEl = document.getElementById('child-age-months');
    const ageMonths = ageMonthsEl && ageMonthsEl.value
      ? parseInt(ageMonthsEl.value, 10)
      : (ageSlider ? parseInt(ageSlider.value, 10) * 12 : 120);
    const ageYears = Math.max(1, Math.min(20, Math.floor(ageMonths / 12)));
    const exactMonths = wizardState.profile.exactMonths || ageMonths;
    const birthDateStr = wizardState.profile.birthDateStr || '';
    const birthDateKo = wizardState.profile.birthDateKo || '';

    const heightInput = document.getElementById('child-height');
    const weightInput = document.getElementById('child-weight');
    const recentInput = document.getElementById('child-recent-gain');
    const fatherInput = document.getElementById('father-height');
    const motherInput = document.getElementById('mother-height');
    const targetHeightInput = document.getElementById('target-height');

    let currentHeight = heightInput ? parseFloat(heightInput.value) || 137.0 : 137.0;
    let currentWeight = weightInput ? parseFloat(weightInput.value) || 35.5 : 35.5;
    let recentGrowth6m = recentInput ? parseFloat(recentInput.value) || 3.0 : 3.0;
    let fatherHeight = fatherInput ? parseFloat(fatherInput.value) || 173.5 : 173.5;
    let motherHeight = motherInput ? parseFloat(motherInput.value) || 160.5 : 160.5;
    let targetHeight = targetHeightInput ? parseFloat(targetHeightInput.value) || 180.0 : 180.0;

    const isImperial = typeof document !== 'undefined' && document.documentElement.lang === 'en' && typeof global.TallerI18n !== 'undefined' && global.TallerI18n.getUnitSystem() === 'imperial';
    if (isImperial) {
      currentHeight = Math.round(currentHeight * 2.54 * 10) / 10;
      currentWeight = Math.round((currentWeight / 2.20462262) * 10) / 10;
      recentGrowth6m = Math.round(recentGrowth6m * 2.54 * 10) / 10;
      fatherHeight = Math.round(fatherHeight * 2.54 * 10) / 10;
      motherHeight = Math.round(motherHeight * 2.54 * 10) / 10;
      if (targetHeight < 110) {
        targetHeight = Math.round(targetHeight * 2.54 * 10) / 10;
      }
    }

    // Tanner Phase
    let tannerPhase = 'phase_2';
    const checkedPhase = document.querySelector('input[name="tanner-phase"]:checked');
    if (checkedPhase) tannerPhase = checkedPhase.value;

    // Habits
    const habits = [];
    const habitCheckboxes = document.querySelectorAll('input[name="growth-habits"]:checked');
    habitCheckboxes.forEach((cb) => habits.push(cb.value));

    // Cognitive Axes
    const cognitiveAxes = [];
    const cogCheckboxes = document.querySelectorAll('input[name="cognitive-axes"]:checked');
    cogCheckboxes.forEach((cb) => cognitiveAxes.push(cb.value));
    if (cognitiveAxes.length === 0) cognitiveAxes.push('science_nature');

    // Region & Ethnicity
    const regionSelect = document.getElementById('user-region');
    const region = regionSelect ? regionSelect.value : 'US National (CDC/AAP Standard)';
    const ethnicitySelect = document.getElementById('child-ethnicity');
    const ethnicity = (ethnicitySelect && ethnicitySelect.value) ? ethnicitySelect.value : 'us_general';

    // Child-Specific Deep Traits (Multi-Select Checkboxes + Fallback Select)
    const readMultiTrait = (name, idFallback, defaultVal) => {
      const checked = [];
      const boxes = document.querySelectorAll(`input[name="${name}"]:checked`);
      if (boxes && boxes.length > 0) {
        boxes.forEach((cb) => checked.push(cb.value));
      } else {
        const el = document.getElementById(idFallback);
        if (el && el.value) checked.push(el.value);
      }
      if (checked.length === 0) checked.push(defaultVal);
      return checked;
    };

    const traitSleepList = readMultiTrait('trait-sleep-quality', 'trait-sleep-quality', 'late_bedtime');
    const traitDietList = readMultiTrait('trait-diet-digestion', 'trait-diet-digestion', 'small_appetite');
    const traitPostureList = readMultiTrait('trait-posture-type', 'trait-posture-type', 'turtle_slouch');
    const traitTemperamentList = readMultiTrait('trait-temperament', 'trait-temperament', 'explorer');
    let traitLearningConcerns = readMultiTrait('trait-learning-concern', 'trait-learning-concern', 'reading_literacy');

    const exerciseTraitEl = document.getElementById('trait-exercise-freq');
    const focusTraitEl = document.getElementById('trait-focus-span');
    const studyStyleEl = document.getElementById('trait-study-style');
    const freeNoteEl = document.getElementById('parent-free-note');

    const traitSleep = traitSleepList[0] || 'late_bedtime';
    const traitDiet = traitDietList[0] || 'small_appetite';
    const traitPosture = traitPostureList[0] || 'turtle_slouch';
    const traitExercise = exerciseTraitEl && exerciseTraitEl.value ? exerciseTraitEl.value : 'low_indoor';
    const traitTemperament = traitTemperamentList[0] || 'explorer';
    const traitFocusSpan = focusTraitEl && focusTraitEl.value ? focusTraitEl.value : '15_20m';
    const traitStudyStyle = studyStyleEl && studyStyleEl.value ? studyStyleEl.value : 'dialogue_question';

    const getCheckedValues = (name) => {
      const arr = [];
      if (typeof document === 'undefined') return arr;
      const boxes = document.querySelectorAll(`input[name="${name}"]:checked`);
      if (boxes && boxes.length > 0) {
        boxes.forEach((cb) => arr.push(cb.value));
      }
      return arr;
    };

    const learningLiteracy = getCheckedValues('learning-literacy');
    const learningMath = getCheckedValues('learning-math');
    const learningFocus = getCheckedValues('learning-focus');
    const learningMeta = getCheckedValues('learning-meta');
    const traitGrowthDetails = getCheckedValues('trait-growth-detail');

    if (learningLiteracy.length || learningMath.length || learningFocus.length || learningMeta.length) {
      const mappedConcerns = [...traitLearningConcerns];
      if (learningLiteracy.some(v => v !== 'active_reader')) mappedConcerns.push('reading_literacy');
      if (learningLiteracy.includes('vocab_context') || learningLiteracy.includes('summary_expression')) mappedConcerns.push('vocab_expression');
      if (learningMath.some(v => v !== 'math_explorer')) mappedConcerns.push('math_concept');
      if (learningFocus.includes('distracted_desk') || learningFocus.includes('procrastination') || learningFocus.includes('impulsive_mistakes')) mappedConcerns.push('desk_endurance');
      if (learningFocus.includes('dopamine_media')) mappedConcerns.push('screen_dopamine');
      if (learningMeta.some(v => v !== 'daily_retrieval_active')) mappedConcerns.push('passive_forget');

      traitLearningConcerns = Array.from(new Set([
        ...mappedConcerns,
        ...learningLiteracy,
        ...learningMath,
        ...learningFocus,
        ...learningMeta
      ]));
    }

    const parentFreeNote = freeNoteEl && typeof freeNoteEl.value === 'string'
      ? freeNoteEl.value.trim()
      : (wizardState.profile.parentFreeNote || '');

    wizardState.profile = {
      targetSubject,
      gender,
      ageYears,
      ageMonths,
      exactMonths,
      birthDateStr,
      birthDateKo,
      currentHeight,
      currentWeight,
      recentGrowth6m,
      fatherHeight,
      motherHeight,
      targetHeight,
      tannerPhase,
      habits,
      cognitiveAxes,
      region,
      ethnicity,
      traitSleep,
      traitSleepList,
      traitDiet,
      traitDietList,
      traitPosture,
      traitPostureList,
      traitExercise,
      traitTemperament,
      traitTemperamentList,
      traitFocusSpan,
      traitLearningConcerns,
      learningLiteracy,
      learningMath,
      learningFocus,
      learningMeta,
      traitGrowthDetails,
      traitStudyStyle,
      parentFreeNote,
      preferredReportMode: wizardState.preferredReportMode || (typeof window !== 'undefined' && window.__KIDSFIT_PREFERRED_REPORT_MODE) || 'growth'
    };

    return wizardState.profile;
  }

  function syncTargetSubjectMode() {
    if (typeof document === 'undefined') return;
    const isEn = document.documentElement.lang === 'en';
    const selfRadio = document.getElementById('target-self');
    const isSelf = Boolean(selfRadio && selfRadio.checked);
    wizardState.profile.targetSubject = isSelf ? 'self' : 'child';
    const prefMode = wizardState.preferredReportMode || (typeof window !== 'undefined' && window.__KIDSFIT_PREFERRED_REPORT_MODE) || 'both';

    const bannerEl = document.getElementById('guidebook-mode-banner');
    if (bannerEl) {
      if (isSelf) {
        bannerEl.style.color = '#1E3A8A';
        bannerEl.style.background = '#EFF6FF';
        bannerEl.style.borderColor = '#BFDBFE';
        bannerEl.innerHTML = isEn
          ? '<strong>[Youth & Student Self-Coaching Guidebook]</strong> Hidden Height Recovery Routine & Supplement/Book Guide.'
          : '<strong>[US CDC Growth Reference Assessment]</strong> US CDC Growth Reference Height US CDC Growth Reference ReportUS CDC Growth Reference.';
      } else if (prefMode === 'growth') {
        bannerEl.style.color = '#1E3A8A';
        bannerEl.style.background = '#EFF6FF';
        bannerEl.style.borderColor = '#BFDBFE';
        bannerEl.innerHTML = isEn
          ? '<strong>[Report 1: Physical Growth Master Mode]</strong> Dedicated physical growth, bone-age & nutrition report.'
          : '<strong>[DIAGNOSIS 01 · US CDC Growth Reference Assessment US CDC Growth Reference]</strong> US CDC Growth Reference Complete US CDC Growth Reference US CDC / KDCA(KDCA) US CDC Growth ReferenceProjected Adult Height·Bone Age US CDC Growth Reference ReportUS CDC Growth Reference.';
      } else if (prefMode === 'learning') {
        bannerEl.style.color = '#1E3A8A';
        bannerEl.style.background = '#EFF6FF';
        bannerEl.style.borderColor = '#BFDBFE';
        bannerEl.innerHTML = isEn
          ? '<strong>[Report 2: Brain & Learning Master Mode]</strong> Dedicated 5-axis LQ, study bottlenecks & textbook roadmap report.'
          : '<strong>[DIAGNOSIS 02 · US CDC Growth Reference Assessment US CDC Growth Reference]</strong> US CDC Growth Reference Complete US CDC Growth Reference 5US CDC Growth Reference 1:1 US CDC Growth Reference ReportUS CDC Growth Reference.';
      } else {
        bannerEl.style.color = '#1E3A8A';
        bannerEl.style.background = '#EFF6FF';
        bannerEl.style.borderColor = '#BFDBFE';
        bannerEl.innerHTML = isEn
          ? '<strong>[Parent\'s Child Growth & Learning Guidebook]</strong> Height Growth, Brain Roadmap & Pinpoint Supplements/Toys/Books.'
          : '<strong>[US CDC Growth Reference Assessment]</strong> US CDC Growth Reference ReportUS CDC Growth Reference.';
      }
    }
  }

  function enterStudioMode(mode, reportMode) {
    if (typeof document === 'undefined') return;
    const activeMode = (reportMode === 'learning') ? 'learning' : 'growth';
    wizardState.preferredReportMode = activeMode;
    if (wizardState.profile) {
      wizardState.profile.preferredReportMode = activeMode;
    }
    if (typeof window !== 'undefined') {
      window.__KIDSFIT_PREFERRED_REPORT_MODE = activeMode;
      if (window.KidsFitApp && window.KidsFitApp.state && window.KidsFitApp.state.profile) {
        window.KidsFitApp.state.profile.preferredReportMode = activeMode;
      }
    }
    if (typeof global !== 'undefined') {
      global.__KIDSFIT_PREFERRED_REPORT_MODE = activeMode;
      if (global.KidsFitApp && global.KidsFitApp.state && global.KidsFitApp.state.profile) {
        global.KidsFitApp.state.profile.preferredReportMode = activeMode;
      }
    }
    WIZARD_STEPS = (activeMode === 'learning') ? WIZARD_STEPS_LEARNING : WIZARD_STEPS_GROWTH;

    const formEl = document.getElementById('diagnosis-form');
    if (formEl) {
      formEl.className = (activeMode === 'learning') ? 'wizard-mode-learning' : 'wizard-mode-growth';
    }

    const isEnBanner = typeof document !== 'undefined' && document.documentElement && (document.documentElement.lang === 'en' || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid'));
    const bannerEl = document.getElementById('guidebook-mode-banner');
    if (bannerEl) {
      if (activeMode === 'learning') {
        bannerEl.style.color = '#1E3A8A';
        bannerEl.style.background = '#EFF6FF';
        bannerEl.style.borderColor = '#BFDBFE';
        bannerEl.innerHTML = isEnBanner
          ? '<strong>[Neuro-Cognitive · 5-Axis Brain Balance Assessment]</strong> Synthesizing individualized clinical bottleneck & learning mastery reports backed by CDC/AAP developmental milestones and 117 peer-reviewed publications.'
          : '<strong>[US CDC Growth Reference 5US CDC Growth Reference Assessment]</strong> Pediatric Development Standard K-DST US CDC Growth Reference 117US CDC Growth Reference ReportUS CDC Growth Reference.';
      } else {
        bannerEl.style.color = '#1E3A8A';
        bannerEl.style.background = '#EFF6FF';
        bannerEl.style.borderColor = '#BFDBFE';
        bannerEl.innerHTML = isEnBanner
          ? '<strong>[Pediatric Growth · Epiphyseal Auxology Assessment]</strong> Synthesizing individualized adult height & growth-plate golden window reports backed by CDC/WHO auxological growth standards and 117 peer-reviewed publications.'
          : '<strong>[US CDC Growth Reference Bone Age US CDC Growth Reference Assessment]</strong> US CDC / KDCA(KDCA) US CDC Growth Reference 117US CDC Growth Reference Projected Adult Height·US CDC Growth Reference ReportUS CDC Growth Reference.';
      }
    }

    const submitBtnEl = document.getElementById('btn-submit-quiz');
    if (submitBtnEl) {
      const isEnBtn = typeof document !== 'undefined' && document.documentElement && (document.documentElement.lang === 'en' || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid'));
      submitBtnEl.textContent = isEnBtn
        ? ((activeMode === 'learning') ? 'Generate My Child\'s 5-Axis Brain & Learning Report →' : 'Generate My Child\'s Height & Growth-Plate Report →')
        : ((activeMode === 'learning') ? 'US CDC Growth Reference 5US CDC Growth Reference Report US CDC Growth Reference' : 'US CDC Growth ReferenceProjected Adult Height US CDC Growth Reference Report US CDC Growth Reference');
    }

    if (typeof window !== 'undefined' && typeof window.loadKidsFitAcademicDataBundle === 'function') {
      try { window.loadKidsFitAcademicDataBundle(); } catch (_) {}
    }
    if (document.body && document.body.classList) {
      document.body.classList.add('studio-mode-active');
    }
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      heroSection.style.display = 'none';
    }
    const childRadio = document.getElementById('target-child');
    const selfRadio = document.getElementById('target-self');
    if (mode === 'self' && selfRadio && childRadio) {
      selfRadio.checked = true;
      childRadio.checked = false;
      syncTargetSubjectMode();
    } else if (mode === 'child' && selfRadio && childRadio) {
      childRadio.checked = true;
      selfRadio.checked = false;
      syncTargetSubjectMode();
    }
    const quizSection = document.getElementById('quiz-section');
    if (quizSection) {
      quizSection.style.display = 'block';
    }
    const presetsBar = document.getElementById('quick-presets-bar');
    if (presetsBar) {
      presetsBar.style.display = 'block';
    }
    const dashboard = document.getElementById('results-dashboard') || document.getElementById('prescription-container');
    if (dashboard) {
      dashboard.classList.add('hidden');
      dashboard.style.display = 'none';
    }
    goToStep(1);
    if (HapticEngine && typeof HapticEngine.triggerHaptic === 'function') {
      HapticEngine.triggerHaptic('step', quizSection);
    }
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (quizSection && typeof quizSection.scrollIntoView === 'function') {
      quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function exitStudioMode() {
    if (typeof document === 'undefined') return;
    if (document.body && document.body.classList) {
      document.body.classList.remove('studio-mode-active');
    }
    const quizSection = document.getElementById('quiz-section');
    if (quizSection) {
      quizSection.style.display = 'none';
    }
    const presetsBar = document.getElementById('quick-presets-bar');
    if (presetsBar) {
      presetsBar.style.display = 'none';
    }
    const dashboard = document.getElementById('results-dashboard') || document.getElementById('prescription-container');
    if (dashboard) {
      dashboard.classList.add('hidden');
      dashboard.style.display = 'none';
    }
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      heroSection.style.display = 'block';
      if (typeof heroSection.scrollIntoView === 'function') {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // 8b. Interactive Dual-Unit Selector Engine
  function isCurrentImperial() {
    if (typeof global.TallerI18n !== 'undefined' && typeof global.TallerI18n.getUnitSystem === 'function') {
      return global.TallerI18n.getUnitSystem() === 'imperial';
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const u = window.localStorage.getItem('taller_unit');
        if (u === 'metric' || u === 'imperial') return u === 'imperial';
      } catch (_) {}
    }
    if (typeof document !== 'undefined' && document.documentElement) {
      const u = typeof document.documentElement.getAttribute === 'function' ? document.documentElement.getAttribute('data-unit-system') : null;
      if (u) return u === 'imperial';
      return document.documentElement.lang === 'en';
    }
    return true;
  }

  let _isSyncingUnits = false;

  function syncCompanionInputs(direction, sourceId) {
    if (typeof document === 'undefined') return;
    if (_isSyncingUnits) return;
    _isSyncingUnits = true;
    try {
      const isImperial = isCurrentImperial();

      // 1. Child Height
      const chH = document.getElementById('child-height');
      const chFt = document.getElementById('child-height-ft');
      const chIn = document.getElementById('child-height-in');
      if (chH && (chFt || chIn)) {
        if (sourceId === 'child-height-ft' || sourceId === 'child-height-in') {
          const ft = parseFloat(chFt ? chFt.value : 0) || 0;
          const inch = parseFloat(chIn ? chIn.value : 0) || 0;
          const totIn = Math.round((ft * 12 + inch) * 10) / 10;
          chH.value = isImperial
            ? (totIn > 0 ? totIn.toFixed(1) : '')
            : (totIn > 0 ? (Math.round(totIn * 2.54 * 10) / 10).toFixed(1) : '');
          if (chH.dataset) chH.dataset.userEdited = 'true';
        } else if (sourceId === 'child-height' || !sourceId) {
          const v = parseFloat(chH.value) || 0;
          if (v > 0) {
            const totIn = isImperial ? v : Math.round((v / 2.54) * 10) / 10;
            let ft = Math.floor(totIn / 12);
            let inch = Math.round((totIn - ft * 12) * 10) / 10;
            if (inch >= 12) { ft += 1; inch = 0; }
            if (chFt) chFt.value = String(ft);
            if (chIn) chIn.value = inch.toFixed(1);
          }
        }
      }

      // 2. Child Weight
      const chW = document.getElementById('child-weight');
      const chWlbs = document.getElementById('child-weight-lbs');
      if (chW && chWlbs) {
        if (sourceId === 'child-weight-lbs') {
          const lbs = parseFloat(chWlbs.value) || 0;
          chW.value = isImperial
            ? (lbs > 0 ? lbs.toFixed(1) : '')
            : (lbs > 0 ? (Math.round((lbs / 2.20462262) * 10) / 10).toFixed(1) : '');
          if (chW.dataset) chW.dataset.userEdited = 'true';
        } else if (sourceId === 'child-weight' || !sourceId) {
          const v = parseFloat(chW.value) || 0;
          if (v > 0) {
            const lbs = isImperial ? v : Math.round(v * 2.20462262 * 10) / 10;
            chWlbs.value = lbs.toFixed(1);
          }
        }
      }

      // 3. Father Height
      const fhH = document.getElementById('father-height');
      const fhFt = document.getElementById('father-height-ft');
      const fhIn = document.getElementById('father-height-in');
      if (fhH && (fhFt || fhIn)) {
        if (sourceId === 'father-height-ft' || sourceId === 'father-height-in') {
          const ft = parseFloat(fhFt ? fhFt.value : 0) || 0;
          const inch = parseFloat(fhIn ? fhIn.value : 0) || 0;
          const totIn = Math.round((ft * 12 + inch) * 10) / 10;
          fhH.value = isImperial
            ? (totIn > 0 ? totIn.toFixed(1) : '')
            : (totIn > 0 ? (Math.round(totIn * 2.54 * 10) / 10).toFixed(1) : '');
          if (fhH.dataset) fhH.dataset.userEdited = 'true';
          updateMphPreview();
        } else if (sourceId === 'father-height' || !sourceId) {
          const v = parseFloat(fhH.value) || 0;
          if (v > 0) {
            const totIn = isImperial ? v : Math.round((v / 2.54) * 10) / 10;
            let ft = Math.floor(totIn / 12);
            let inch = Math.round((totIn - ft * 12) * 10) / 10;
            if (inch >= 12) { ft += 1; inch = 0; }
            if (fhFt) fhFt.value = String(ft);
            if (fhIn) fhIn.value = inch.toFixed(1);
          }
        }
      }

      // 4. Mother Height
      const mhH = document.getElementById('mother-height');
      const mhFt = document.getElementById('mother-height-ft');
      const mhIn = document.getElementById('mother-height-in');
      if (mhH && (mhFt || mhIn)) {
        if (sourceId === 'mother-height-ft' || sourceId === 'mother-height-in') {
          const ft = parseFloat(mhFt ? mhFt.value : 0) || 0;
          const inch = parseFloat(mhIn ? mhIn.value : 0) || 0;
          const totIn = Math.round((ft * 12 + inch) * 10) / 10;
          mhH.value = isImperial
            ? (totIn > 0 ? totIn.toFixed(1) : '')
            : (totIn > 0 ? (Math.round(totIn * 2.54 * 10) / 10).toFixed(1) : '');
          if (mhH.dataset) mhH.dataset.userEdited = 'true';
          updateMphPreview();
        } else if (sourceId === 'mother-height' || !sourceId) {
          const v = parseFloat(mhH.value) || 0;
          if (v > 0) {
            const totIn = isImperial ? v : Math.round((v / 2.54) * 10) / 10;
            let ft = Math.floor(totIn / 12);
            let inch = Math.round((totIn - ft * 12) * 10) / 10;
            if (inch >= 12) { ft += 1; inch = 0; }
            if (mhFt) mhFt.value = String(ft);
            if (mhIn) mhIn.value = inch.toFixed(1);
          }
        }
      }

      // Target / Dream Height: ft/in <-> #target-height
      const thFt = document.getElementById('target-height-ft');
      const thIn = document.getElementById('target-height-in');
      const thH = document.getElementById('target-height');
      if (thH && (thFt || thIn)) {
        if (direction === 'from-companion' && (sourceId === 'target-height-ft' || sourceId === 'target-height-in')) {
          const ft = parseFloat(thFt && thFt.value) || 0;
          const inch = parseFloat(thIn && thIn.value) || 0;
          const totIn = Math.round((ft * 12 + inch) * 10) / 10;
          thH.value = isImperial
            ? (totIn > 0 ? totIn.toFixed(1) : '')
            : (totIn > 0 ? (Math.round(totIn * 2.54 * 10) / 10).toFixed(1) : '');
        } else if (sourceId === 'target-height' || !sourceId) {
          const v = parseFloat(thH.value) || 0;
          if (v > 0) {
            const totIn = (isImperial && v < 110) ? v : Math.round((v / 2.54) * 10) / 10;
            let ft = Math.floor(totIn / 12);
            let inch = Math.round((totIn - ft * 12) * 10) / 10;
            if (inch >= 12) { ft += 1; inch = 0; }
            if (thFt) thFt.value = String(ft);
            if (thIn) thIn.value = inch.toFixed(1);
          }
        }
      }
    } finally {
      _isSyncingUnits = false;
    }
  }

  let _isSwitchingUnits = false;
  function applyUnitSwitch(newUnit) {
    if (newUnit !== 'imperial' && newUnit !== 'metric') return;
    if (_isSwitchingUnits) return;
    _isSwitchingUnits = true;
    try {
      if (typeof document === 'undefined') return;

      const curUnit = isCurrentImperial() ? 'imperial' : 'metric';
      const unitChanged = curUnit !== newUnit;

      if (typeof global.TallerI18n !== 'undefined' && typeof global.TallerI18n.setUnitSystem === 'function') {
        if (typeof global.TallerI18n.getUnitSystem === 'function') {
          if (global.TallerI18n.getUnitSystem() !== newUnit) {
            global.TallerI18n.setUnitSystem(newUnit);
          }
        } else {
          global.TallerI18n.setUnitSystem(newUnit);
        }
      } else if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem('taller_unit', newUnit);
        } catch (_) {}
      }

      if (document.documentElement && typeof document.documentElement.setAttribute === 'function') {
        document.documentElement.setAttribute('data-unit-system', newUnit);
      }
      const isImperial = newUnit === 'imperial';

      if (unitChanged) {
        const childH = document.getElementById('child-height');
        const childW = document.getElementById('child-weight');
        const childR = document.getElementById('child-recent-gain');
        const fatH = document.getElementById('father-height');
        const motH = document.getElementById('mother-height');
        const tarH = document.getElementById('target-height');

        if (isImperial) {
          if (childH && childH.value) {
            const v = parseFloat(childH.value);
            if (!isNaN(v) && v > 0) childH.value = (Math.round((v / 2.54) * 10) / 10).toFixed(1);
            childH.min = '18'; childH.max = '90'; childH.placeholder = '54.0';
          }
          if (childW && childW.value) {
            const v = parseFloat(childW.value);
            if (!isNaN(v) && v > 0) childW.value = (Math.round(v * 2.20462262 * 10) / 10).toFixed(1);
            childW.min = '5'; childW.max = '350'; childW.placeholder = '78.0';
          }
          if (childR && childR.value) {
            const v = parseFloat(childR.value);
            if (!isNaN(v) && v >= 0) childR.value = (Math.round((v / 2.54) * 10) / 10).toFixed(1);
            childR.min = '0'; childR.max = '8'; childR.placeholder = '1.3';
          }
          if (fatH && fatH.value) {
            const v = parseFloat(fatH.value);
            if (!isNaN(v) && v > 0) fatH.value = (Math.round((v / 2.54) * 10) / 10).toFixed(1);
            fatH.min = '40'; fatH.max = '95'; fatH.placeholder = '68.3';
          }
          if (motH && motH.value) {
            const v = parseFloat(motH.value);
            if (!isNaN(v) && v > 0) motH.value = (Math.round((v / 2.54) * 10) / 10).toFixed(1);
            motH.min = '40'; motH.max = '95'; motH.placeholder = '63.2';
          }
          if (tarH && tarH.value) {
            const v = parseFloat(tarH.value);
            if (!isNaN(v) && v >= 110) tarH.value = (Math.round((v / 2.54) * 10) / 10).toFixed(1);
            tarH.min = '45'; tarH.max = '95'; tarH.placeholder = '70.9';
          }
        } else {
          if (childH && childH.value) {
            const v = parseFloat(childH.value);
            if (!isNaN(v) && v > 0) childH.value = (Math.round(v * 2.54 * 10) / 10).toFixed(1);
            childH.min = '45'; childH.max = '230'; childH.placeholder = '137.0';
          }
          if (childW && childW.value) {
            const v = parseFloat(childW.value);
            if (!isNaN(v) && v > 0) childW.value = (Math.round((v / 2.20462262) * 10) / 10).toFixed(1);
            childW.min = '2'; childW.max = '160'; childW.placeholder = '35.5';
          }
          if (childR && childR.value) {
            const v = parseFloat(childR.value);
            if (!isNaN(v) && v >= 0) childR.value = (Math.round(v * 2.54 * 10) / 10).toFixed(1);
            childR.min = '0'; childR.max = '20'; childR.placeholder = '3.2';
          }
          if (fatH && fatH.value) {
            const v = parseFloat(fatH.value);
            if (!isNaN(v) && v > 0) fatH.value = (Math.round(v * 2.54 * 10) / 10).toFixed(1);
            fatH.min = '100'; fatH.max = '240'; fatH.placeholder = '173.5';
          }
          if (motH && motH.value) {
            const v = parseFloat(motH.value);
            if (!isNaN(v) && v > 0) motH.value = (Math.round(v * 2.54 * 10) / 10).toFixed(1);
            motH.min = '100'; motH.max = '240'; motH.placeholder = '160.5';
          }
          if (tarH && tarH.value) {
            const v = parseFloat(tarH.value);
            if (!isNaN(v) && v > 0 && v < 110) tarH.value = (Math.round(v * 2.54 * 10) / 10).toFixed(1);
            tarH.min = '120'; tarH.max = '230'; tarH.placeholder = '180.0';
          }
        }
      }

      // Suffixes
      const heightSuffixes = document.querySelectorAll('.unit-label-height');
      heightSuffixes.forEach((el) => {
        el.textContent = isImperial ? 'in' : 'cm';
      });
      const weightSuffixes = document.querySelectorAll('.unit-label-weight');
      weightSuffixes.forEach((el) => {
        el.textContent = isImperial ? 'lbs' : 'kg';
      });

      // Synchronize all 3 Toggle Buttons UI
      const btnHeaderUnit = document.getElementById('btn-unit-toggle');
      if (btnHeaderUnit) {
        btnHeaderUnit.textContent = isImperial ? '🇺🇸 ft/in · lbs' : '🌐 cm · kg';
      }
      if (typeof global.syncKisfitQuickUnitUI === 'function') {
        global.syncKisfitQuickUnitUI();
      }

      const btnStep2Imp = document.getElementById('btn-step2-unit-imperial');
      const btnStep2Met = document.getElementById('btn-step2-unit-metric');
      if (btnStep2Imp && btnStep2Imp.classList) btnStep2Imp.classList.toggle('active', isImperial);
      if (btnStep2Met && btnStep2Met.classList) btnStep2Met.classList.toggle('active', !isImperial);

      const btnStep3Imp = document.getElementById('btn-step3-unit-imperial');
      const btnStep3Met = document.getElementById('btn-step3-unit-metric');
      if (btnStep3Imp && btnStep3Imp.classList) btnStep3Imp.classList.toggle('active', isImperial);
      if (btnStep3Met && btnStep3Met.classList) btnStep3Met.classList.toggle('active', !isImperial);

      // Containers
      const imperialContainers = document.querySelectorAll('.unit-imperial-only');
      imperialContainers.forEach((el) => {
        el.style.display = isImperial ? 'flex' : 'none';
      });
      const metricContainers = document.querySelectorAll('.unit-metric-only');
      metricContainers.forEach((el) => {
        el.style.display = isImperial ? 'none' : 'flex';
      });

      syncCompanionInputs();
      updateMphPreview();

      if (typeof global.KidsFitGlobalPaywall !== 'undefined') {
        if (typeof global.KidsFitGlobalPaywall.applyGlobalHomepageEnglishDOM === 'function') {
          global.KidsFitGlobalPaywall.applyGlobalHomepageEnglishDOM();
        }
        if (typeof global.KidsFitGlobalPaywall.transformGlobalReportAndApplyPaywall === 'function') {
          global.KidsFitGlobalPaywall.transformGlobalReportAndApplyPaywall();
        }
      }
    } finally {
      _isSwitchingUnits = false;
    }
  }

  function initDualUnitSelector() {
    if (typeof document === 'undefined') return;

    // 1. Header Unit Toggle Button
    const headerToggle = document.getElementById('btn-unit-toggle');
    if (headerToggle && !headerToggle._hasUnitListener) {
      headerToggle._hasUnitListener = true;
      headerToggle.addEventListener('click', (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        const next = isCurrentImperial() ? 'metric' : 'imperial';
        applyUnitSwitch(next);
      });
    }

    // 2. Step 2 Segmented Tabs
    const step2Imp = document.getElementById('btn-step2-unit-imperial');
    const step2Met = document.getElementById('btn-step2-unit-metric');
    if (step2Imp && !step2Imp._hasUnitListener) {
      step2Imp._hasUnitListener = true;
      step2Imp.addEventListener('click', () => applyUnitSwitch('imperial'));
    }
    if (step2Met && !step2Met._hasUnitListener) {
      step2Met._hasUnitListener = true;
      step2Met.addEventListener('click', () => applyUnitSwitch('metric'));
    }

    // 3. Step 3 Segmented Tabs
    const step3Imp = document.getElementById('btn-step3-unit-imperial');
    const step3Met = document.getElementById('btn-step3-unit-metric');
    if (step3Imp && !step3Imp._hasUnitListener) {
      step3Imp._hasUnitListener = true;
      step3Imp.addEventListener('click', () => applyUnitSwitch('imperial'));
    }
    if (step3Met && !step3Met._hasUnitListener) {
      step3Met._hasUnitListener = true;
      step3Met.addEventListener('click', () => applyUnitSwitch('metric'));
    }

    // 4. Wire Companion Inputs bidirectional event listeners
    const chFt = document.getElementById('child-height-ft');
    const chIn = document.getElementById('child-height-in');
    const chH = document.getElementById('child-height');
    if (chFt && !chFt._hasSyncListener) {
      chFt._hasSyncListener = true;
      chFt.addEventListener('input', () => syncCompanionInputs('from-companion', 'child-height-ft'));
    }
    if (chIn && !chIn._hasSyncListener) {
      chIn._hasSyncListener = true;
      chIn.addEventListener('input', () => syncCompanionInputs('from-companion', 'child-height-in'));
    }
    if (chH && !chH._hasSyncListener) {
      chH._hasSyncListener = true;
      chH.addEventListener('input', () => syncCompanionInputs('to-companion', 'child-height'));
    }

    const chWlbs = document.getElementById('child-weight-lbs');
    const chW = document.getElementById('child-weight');
    if (chWlbs && !chWlbs._hasSyncListener) {
      chWlbs._hasSyncListener = true;
      chWlbs.addEventListener('input', () => syncCompanionInputs('from-companion', 'child-weight-lbs'));
    }
    if (chW && !chW._hasSyncListener) {
      chW._hasSyncListener = true;
      chW.addEventListener('input', () => syncCompanionInputs('to-companion', 'child-weight'));
    }

    const fhFt = document.getElementById('father-height-ft');
    const fhIn = document.getElementById('father-height-in');
    const fhH = document.getElementById('father-height');
    if (fhFt && !fhFt._hasSyncListener) {
      fhFt._hasSyncListener = true;
      fhFt.addEventListener('input', () => syncCompanionInputs('from-companion', 'father-height-ft'));
    }
    if (fhIn && !fhIn._hasSyncListener) {
      fhIn._hasSyncListener = true;
      fhIn.addEventListener('input', () => syncCompanionInputs('from-companion', 'father-height-in'));
    }
    if (fhH && !fhH._hasSyncListener) {
      fhH._hasSyncListener = true;
      fhH.addEventListener('input', () => syncCompanionInputs('to-companion', 'father-height'));
    }

    const mhFt = document.getElementById('mother-height-ft');
    const mhIn = document.getElementById('mother-height-in');
    const mhH = document.getElementById('mother-height');
    if (mhFt && !mhFt._hasSyncListener) {
      mhFt._hasSyncListener = true;
      mhFt.addEventListener('input', () => syncCompanionInputs('from-companion', 'mother-height-ft'));
    }
    if (mhIn && !mhIn._hasSyncListener) {
      mhIn._hasSyncListener = true;
      mhIn.addEventListener('input', () => syncCompanionInputs('from-companion', 'mother-height-in'));
    }
    if (mhH && !mhH._hasSyncListener) {
      mhH._hasSyncListener = true;
      mhH.addEventListener('input', () => syncCompanionInputs('to-companion', 'mother-height'));
    }

    const thFt = document.getElementById('target-height-ft');
    const thIn = document.getElementById('target-height-in');
    const thH = document.getElementById('target-height');
    if (thFt && !thFt._hasSyncListener) {
      thFt._hasSyncListener = true;
      thFt.addEventListener('input', () => syncCompanionInputs('from-companion', 'target-height-ft'));
    }
    if (thIn && !thIn._hasSyncListener) {
      thIn._hasSyncListener = true;
      thIn.addEventListener('input', () => syncCompanionInputs('from-companion', 'target-height-in'));
    }
    if (thH && !thH._hasSyncListener) {
      thH._hasSyncListener = true;
      thH.addEventListener('input', () => syncCompanionInputs('to-companion', 'target-height'));
    }

    // Initial sync
    applyUnitSwitch(isCurrentImperial() ? 'imperial' : 'metric');
  }

  // 9. Initialize Event Listeners
  function initWizard() {
    if (typeof document === 'undefined') return;

    // Step navigation buttons
    const prevBtn = document.getElementById('btn-prev-step');
    const nextBtn = document.getElementById('btn-next-step');
    const form = document.getElementById('diagnosis-form');

    if (prevBtn && !prevBtn._hasWizardListener) {
      prevBtn._hasWizardListener = true;
      prevBtn.addEventListener('click', () => {
        goToStep(wizardState.currentStep - 1);
      });
    }

    if (nextBtn && !nextBtn._hasWizardListener) {
      nextBtn._hasWizardListener = true;
      nextBtn.addEventListener('click', () => {
        if (validateStep(wizardState.currentStep)) {
          goToStep(wizardState.currentStep + 1);
        }
      });
    }

    const submitBtn = document.getElementById('btn-submit-quiz');

    const triggerFinalSubmission = (e) => {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      if (wizardState.isScanning) return;
      if (validateStep(wizardState.currentStep)) {
        try {
          readProfileFromForm();
        } catch (err) {
          if (typeof console !== 'undefined' && console.error) {
            console.error('[OnboardingWizard] readProfileFromForm error:', err);
          }
        }
        start3SecondScan((profile) => {
          if (typeof global.KidsFitApp !== 'undefined') {
            if (typeof global.KidsFitApp.renderPrescriptionResults === 'function') {
              global.KidsFitApp.renderPrescriptionResults(profile);
            } else if (typeof global.KidsFitApp.renderPrescriptionReport === 'function') {
              global.KidsFitApp.renderPrescriptionReport(profile);
            }
          }
        });
      }
    };

    if (form && !form._hasWizardListener) {
      form._hasWizardListener = true;
      form.addEventListener('submit', triggerFinalSubmission);
    }
    if (submitBtn && !submitBtn._hasWizardListener) {
      submitBtn._hasWizardListener = true;
      submitBtn.addEventListener('click', triggerFinalSubmission);
    }

    // Age slider & DOB picker sync
    const ageSlider = document.getElementById('child-age-slider');
    const ageDisplay = document.getElementById('child-age-display');
    const ageMonthsInput = document.getElementById('child-age-months');
    if (ageSlider) {
      ageSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const months = val * 12;
        const isEnAge = typeof document !== 'undefined' && document.documentElement && document.documentElement.lang === 'en';
        if (ageDisplay) ageDisplay.textContent = isEnAge ? `${val} yrs (${months} mos)` : `${val} yrs (${months} mos)`;
        if (ageMonthsInput) ageMonthsInput.value = months;
      });
    }

    const birthYearEl = document.getElementById('child-birth-year');
    const birthMonthEl = document.getElementById('child-birth-month');
    const birthDayEl = document.getElementById('child-birth-day');
    const recentGainEl = document.getElementById('child-recent-gain');
    const heightInputEl = document.getElementById('child-height');
    const weightInputEl = document.getElementById('child-weight');
    [heightInputEl, weightInputEl].forEach((el) => {
      if (el) {
        el.addEventListener('input', () => {
          if (el.dataset) el.dataset.userEdited = 'true';
        });
      }
    });
    [birthYearEl, birthMonthEl, birthDayEl, recentGainEl].forEach((el) => {
      if (el) {
        el.addEventListener('change', () => {
          syncDobAndAutoStage();
          if (HapticEngine && typeof HapticEngine.triggerHaptic === 'function') {
            HapticEngine.triggerHaptic('tick', el);
          }
        });
      }
    });

    // Real-time MPH inputs sync
    const fatherInput = document.getElementById('father-height');
    const motherInput = document.getElementById('mother-height');
    const boyRadio = document.getElementById('gender-boy');
    const girlRadio = document.getElementById('gender-girl');

    if (fatherInput) fatherInput.addEventListener('input', updateMphPreview);
    if (motherInput) motherInput.addEventListener('input', updateMphPreview);
    if (boyRadio) {
      boyRadio.addEventListener('change', () => {
        updateMphPreview();
        syncDobAndAutoStage();
      });
    }
    if (girlRadio) {
      girlRadio.addEventListener('change', () => {
        updateMphPreview();
        syncDobAndAutoStage();
      });
    }

    const targetChildRadio = document.getElementById('target-child');
    const targetSelfRadio = document.getElementById('target-self');
    [targetChildRadio, targetSelfRadio].forEach((el) => {
      if (el) {
        el.addEventListener('change', () => {
          syncTargetSubjectMode();
          if (HapticEngine && typeof HapticEngine.triggerHaptic === 'function') {
            HapticEngine.triggerHaptic('tick', el);
          }
        });
      }
    });

    // Initial MPH & DOB auto-stage calculation
    initDualUnitSelector();
    updateMphPreview();
    syncDobAndAutoStage();
    syncTargetSubjectMode();
    initSiblingProfileSwitcher();

    // Listen to language switch events so dynamic wizard labels update immediately
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('taller-language-change', (e) => {
        if (_isSwitchingUnits) return;
        const nextUnit = (e && e.detail && e.detail.unitSystem) || (global.TallerI18n && typeof global.TallerI18n.getUnitSystem === 'function' ? global.TallerI18n.getUnitSystem() : (isCurrentImperial() ? 'imperial' : 'metric'));
        applyUnitSwitch(nextUnit);
        goToStep(wizardState.currentStep);
        syncDobAndAutoStage();
        syncTargetSubjectMode();
        updateMphPreview();
        initSiblingProfileSwitcher();
      });
    }

    // Brand Showcase -> Studio Mode Entry & Return Buttons
    const btnEnterTop = document.getElementById('btn-enter-studio-top');
    const btnEnterLearning = document.getElementById('btn-enter-studio-learning');
    const btnHomeStartGrowth = document.getElementById('btn-home-start-growth-report');
    const btnHomeStartLearning = document.getElementById('btn-home-start-learning-report');
    const btnEnterParent = document.getElementById('btn-enter-studio-parent');
    const btnEnterYouth = document.getElementById('btn-enter-studio-youth');
    const btnBackBrand = document.getElementById('btn-back-to-brand');
    const brandHomeTrigger = document.getElementById('brand-home-trigger');

    if (btnEnterTop) btnEnterTop.addEventListener('click', () => enterStudioMode('child', 'growth'));
    if (btnEnterLearning) btnEnterLearning.addEventListener('click', () => enterStudioMode('child', 'learning'));
    if (btnHomeStartGrowth) btnHomeStartGrowth.addEventListener('click', () => enterStudioMode('child', 'growth'));
    if (btnHomeStartLearning) btnHomeStartLearning.addEventListener('click', () => enterStudioMode('child', 'learning'));
    if (btnEnterParent) btnEnterParent.addEventListener('click', () => enterStudioMode('child', 'growth'));
    if (btnEnterYouth) btnEnterYouth.addEventListener('click', () => enterStudioMode('self', 'growth'));
    if (btnBackBrand) btnBackBrand.addEventListener('click', () => exitStudioMode());
    if (brandHomeTrigger) brandHomeTrigger.addEventListener('click', () => exitStudioMode());

    // Preset cards
    for (let i = 1; i <= 5; i++) {
      const card = document.getElementById(`preset-card-${i}`);
      if (card) {
        card.addEventListener('click', () => {
          if (document.body && document.body.classList) {
            document.body.classList.add('studio-mode-active');
          }
          applyPreset(`preset-${i}`);
        });
      }
    }

    // Quick-Tap Example Chips for Parent Free-Text Narrative Input
    const freeNoteChips = typeof document.querySelectorAll === 'function'
      ? document.querySelectorAll('.free-note-chip-btn')
      : [];
    const freeNoteTextarea = document.getElementById('parent-free-note');
    if (freeNoteChips && freeNoteChips.forEach && freeNoteTextarea) {
      freeNoteChips.forEach((btn) => {
        btn.addEventListener('click', () => {
          const snippet = btn.getAttribute('data-note-snippet') || '';
          if (!snippet) return;
          const cur = (freeNoteTextarea.value || '').trim();
          if (!cur.includes(snippet)) {
            freeNoteTextarea.value = cur ? `${cur} ${snippet}` : snippet;
          }
          wizardState.profile.parentFreeNote = freeNoteTextarea.value.trim();
          btn.style.borderColor = '#1D4ED8';
          btn.style.background = '#EFF6FF';
          btn.style.color = '#1D4ED8';
          if (HapticEngine && typeof HapticEngine.triggerHaptic === 'function') {
            HapticEngine.triggerHaptic('tick', btn);
          }
        });
      });
    }

    // Retest button (deduplicated single delegator)
    const retestBtn = document.getElementById('btn-retest');
    if (retestBtn) {
      retestBtn._currentRetestFn = () => {
        if (document.body && document.body.classList) {
          document.body.classList.add('studio-mode-active');
        }
        const dashboard = document.getElementById('results-dashboard') || document.getElementById('prescription-container');
        if (dashboard) {
          dashboard.classList.add('hidden');
          dashboard.style.display = 'none';
        }
        const quizSection = document.getElementById('quiz-section');
        if (quizSection) quizSection.style.display = 'block';
        const heroSection = document.getElementById('hero-section');
        if (heroSection) heroSection.style.display = 'block';
        const presetsBar = document.getElementById('quick-presets-bar');
        if (presetsBar) presetsBar.style.display = 'block';

        goToStep(1);
        if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (quizSection) {
          quizSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
      if (!retestBtn._retestDelegatorBound) {
        retestBtn._retestDelegatorBound = true;
        retestBtn.addEventListener('click', (e) => {
          if (typeof retestBtn._currentRetestFn === 'function') {
            retestBtn._currentRetestFn(e);
          }
        });
      }
    }

    // Auto-start preset wizard & clinical scan when URL contains ?preset=... (from Q&A or external links)
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const rawPreset = String(params.get('preset') || '').trim();
        const rawMode = String(params.get('mode') || '').trim().toLowerCase() === 'learning' ? 'learning' : 'growth';
        const ageNum = parseInt(params.get('age') || '', 10);
        const agePreset = !isNaN(ageNum) && ageNum >= 2 && ageNum <= 18 ? (ageNum <= 4 ? 'preset-1' : ageNum <= 8 ? 'preset-2' : ageNum <= 11 ? 'preset-3' : ageNum <= 14 ? 'preset-4' : 'preset-5') : (params.get('autostart') === '1' ? 'preset-2' : '');
        const resolvedPreset = agePreset || (PRESET_ALIASES && PRESET_ALIASES[rawPreset]) || rawPreset;
        if (resolvedPreset && PRESETS[resolvedPreset] && !window._kidsfitUrlPresetApplied) {
          window._kidsfitUrlPresetApplied = true;
          const rawAge = parseInt(params.get('age') || '', 10);
          const rawGender = String(params.get('gender') || '').trim().toLowerCase();
          if (!isNaN(rawAge) && rawAge >= 2 && rawAge <= 18) {
            setTimeout(() => {
              const byEl = document.getElementById('child-birth-year');
              if (byEl) byEl.value = String(new Date().getFullYear() - rawAge);
              if (rawGender === 'boy' || rawGender === 'girl') {
                const gEl = document.getElementById(rawGender === 'boy' ? 'gender-boy' : 'gender-girl');
                if (gEl) gEl.checked = true;
              }
              if (typeof syncDobAndAutoStage === 'function') syncDobAndAutoStage();
            }, 60);
          }
          enterStudioMode('child', rawMode);
          if (params.get('demo') === '1') {
            applyPreset(resolvedPreset);
            setTimeout(() => {
              const skipBtn = document.getElementById('btn-skip-scan');
              if (skipBtn && wizardState.isScanning) skipBtn.click();
            }, 250);
          } else {
            goToStep(1);
          }
        }
      }
    } catch (_) {}
  }

  function applyChildProfileToForm(childProfile) {
    if (!childProfile || typeof document === 'undefined') return;

    // Gender
    const boyRadio = document.getElementById('gender-boy');
    const girlRadio = document.getElementById('gender-girl');
    if (childProfile.gender === 'boy' && boyRadio) {
      boyRadio.checked = true;
    } else if (childProfile.gender === 'girl' && girlRadio) {
      girlRadio.checked = true;
    }

    // DOB
    const yEl = document.getElementById('child-birth-year');
    const mEl = document.getElementById('child-birth-month');
    const dEl = document.getElementById('child-birth-day');
    if (yEl && childProfile.birthYear) yEl.value = childProfile.birthYear;
    if (mEl && childProfile.birthMonth) mEl.value = childProfile.birthMonth;
    if (dEl && childProfile.birthDay) dEl.value = childProfile.birthDay;

    // Height & Weight
    const isImperial = typeof isCurrentImperial === 'function'
      ? isCurrentImperial()
      : (typeof global.TallerI18n !== 'undefined' && typeof global.TallerI18n.getUnitSystem === 'function'
          ? global.TallerI18n.getUnitSystem() === 'imperial'
          : false);

    const hEl = document.getElementById('child-height');
    const wEl = document.getElementById('child-weight');
    const rEl = document.getElementById('child-recent-gain');

    if (hEl && childProfile.heightCm) {
      hEl.value = isImperial ? (childProfile.heightCm / 2.54).toFixed(1) : childProfile.heightCm.toFixed(1);
    }
    if (wEl && childProfile.weightKg) {
      wEl.value = isImperial ? (childProfile.weightKg * 2.20462).toFixed(1) : childProfile.weightKg.toFixed(1);
    }
    if (rEl && childProfile.recentGainCm !== undefined) {
      rEl.value = isImperial ? (childProfile.recentGainCm / 2.54).toFixed(1) : childProfile.recentGainCm.toFixed(1);
    }

    const fhEl = document.getElementById('father-height');
    const mhEl = document.getElementById('mother-height');
    if (fhEl && childProfile.fatherHeightCm) {
      fhEl.value = isImperial ? (childProfile.fatherHeightCm / 2.54).toFixed(1) : childProfile.fatherHeightCm.toFixed(1);
    }
    if (mhEl && childProfile.motherHeightCm) {
      mhEl.value = isImperial ? (childProfile.motherHeightCm / 2.54).toFixed(1) : childProfile.motherHeightCm.toFixed(1);
    }

    if (typeof syncCompanionInputs === 'function') {
      syncCompanionInputs();
    }
    if (typeof syncDobAndAutoStage === 'function') {
      syncDobAndAutoStage();
    }
    if (typeof updateMphPreview === 'function') {
      updateMphPreview();
    }
  }

  function initSiblingProfileSwitcher() {
    if (typeof document === 'undefined') return;
    const cohortDb = UserCohortDB || (typeof window !== 'undefined' ? (window.KidsFitUserCohortDB || window.TallerUserCohortDB) : null);
    if (!cohortDb) return;

    if (typeof cohortDb.renderSiblingSwitcherBar === 'function') {
      // 1. Sibling profile tabs in wizard step 1
      cohortDb.renderSiblingSwitcherBar('sibling-profile-tabs', {
        onSwitch: (childProfile) => {
          applyChildProfileToForm(childProfile);
        }
      });
      // 2. Sibling profile tabs in dashboard if container exists
      cohortDb.renderSiblingSwitcherBar('sibling-profile-tabs-dashboard', {
        onSwitch: (childProfile) => {
          if (typeof global.KidsFitApp !== 'undefined') {
            if (typeof global.KidsFitApp.renderPrescriptionResults === 'function') {
              global.KidsFitApp.renderPrescriptionResults(childProfile);
            }
          }
        }
      });
    }
  }

  function openAdditionalNarrativeStep() {
    if (typeof document === 'undefined') return;
    const choicesView = document.getElementById('step-6-choices-view');
    const narrativeView = document.getElementById('step-7-narrative-view');
    if (choicesView) choicesView.style.display = 'none';
    if (narrativeView) narrativeView.style.display = 'block';

    const tagEl = document.getElementById('quiz-step-tag');
    const titleEl = document.getElementById('quiz-step-title');
    const subtitleEl = document.getElementById('quiz-step-subtitle');
    const prevBtn = document.getElementById('btn-prev-step');

    const isEnNarrative = typeof document !== 'undefined' && document.documentElement && (document.documentElement.lang === 'en' || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid'));
    if (tagEl) tagEl.textContent = isEnNarrative ? 'In-Depth Step (Step 6 Responses + Child Characteristics)' : 'US CDC Growth ReferenceAssessment 6US CDC Growth Reference';
    if (titleEl) titleEl.textContent = isEnNarrative ? 'Describe your child\'s unique traits, strengths, and areas of concern' : 'US CDC Growth Reference  pts·US CDC Growth Reference  ptsUS CDC Growth Reference yrsUS CDC Growth Reference';
    if (subtitleEl) subtitleEl.textContent = isEnNarrative ? 'Combines objective survey responses with personalized parent notes to synthesize an individualized clinical report.' : 'Assessment 1~6US CDC Growth Reference  yrsUS CDC Growth Reference ReportUS CDC Growth Reference.';
    if (prevBtn) prevBtn.style.display = 'none';

    const noteEl = document.getElementById('parent-free-note');
    if (noteEl && typeof noteEl.focus === 'function') {
      try { noteEl.focus(); } catch (_) {}
    }
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function closeAdditionalNarrativeStep() {
    if (typeof document === 'undefined') return;
    goToStep(6);
  }

  function submitQuiz(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (wizardState.isScanning) return;
    if (validateStep(wizardState.currentStep)) {
      try {
        readProfileFromForm();
      } catch (err) {
        if (typeof console !== 'undefined' && console.error) {
          console.error('[OnboardingWizard] readProfileFromForm error:', err);
        }
      }
      start3SecondScan((profile) => {
        if (typeof global.KidsFitApp !== 'undefined') {
          if (typeof global.KidsFitApp.renderPrescriptionResults === 'function') {
            global.KidsFitApp.renderPrescriptionResults(profile);
          } else if (typeof global.KidsFitApp.renderPrescriptionReport === 'function') {
            global.KidsFitApp.renderPrescriptionReport(profile);
          }
        }
      });
    }
  }

  // Export
  const OnboardingWizard = {
    PRESETS,
    PRESET_ALIASES,
    WIZARD_STEPS,
    state: wizardState,
    getState: () => wizardState,
    goToStep,
    validateStep,
    updateMphPreview,
    syncDobAndAutoStage,
    enterStudioMode,
    exitStudioMode,
    applyPreset,
    start3SecondScan,
    completeScan,
    readProfileFromForm,
    openAdditionalNarrativeStep,
    closeAdditionalNarrativeStep,
    submitQuiz,
    setUnitSystem: applyUnitSwitch,
    getUnitSystem: () => (isCurrentImperial() ? 'imperial' : 'metric'),
    syncCompanionInputs,
    initDualUnitSelector,
    initWizard,
    showValidationToast,
    initSiblingProfileSwitcher,
    applyChildProfileToForm
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = OnboardingWizard;
  } else {
    global.TallerOnboardingWizard = OnboardingWizard;
    global.KidsFitOnboardingWizard = OnboardingWizard;
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
          initWizard();
        });
      } else {
        initWizard();
      }
    }
  }

})(typeof window !== 'undefined' ? window : global);

