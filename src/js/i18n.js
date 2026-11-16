/**
 * KISFIT Bio Labs (Global English Edition)
 * Bilingual (EN ↔ KO) Internationalization & Unit Conversion Engine (src/js/i18n.js)
 * 
 * Features:
 * - Dual Standard & Language Support:
 *   - Global Mode (EN): US CDC 2000 & WHO Growth Standards, Imperial units (ft/in, lbs)
 *   - Korean Mode (KO): KDCA 2017 Growth Standards, Metric units (cm, kg)
 * - Bidirectional precision unit conversions:
 *   - cm <-> ft/in
 *   - kg <-> lbs
 * - Reactive dictionary lookup & DOM synchronization
 * - localStorage persistence ('taller_lang', 'taller_unit')
 */

(function (global) {
  'use strict';

  // 1. Translation Dictionary
  const EN_DICTIONARY = {
      // Header & Brand
      'brand.title': 'KISFIT',
      'brand.tagline': 'Height · Physical · Mental Growth & Personalized Learning Platform',
      'trust.badge': 'Built on Official Standards: US CDC 2000, WHO & AAP Pediatric Auxology',
      'nav.auxology': 'Physical Growth & Auxology',
      'nav.endocrinology': 'Endocrinology & Bio-Nutrition',
      'nav.biomechanics': 'Biomechanics & Posture',
      'nav.neuro': 'Neuro-Cognitive Matrix',
      'nav.tracker': '90-Day Tracker & Clinical PDF',
      'theme.dark': '🌙 Dark Mode',
      'theme.light': '☀️ Light Mode',
      'lang.toggle': 'US Units (ft/in · lbs)',

      // Hero
      'hero.badge': '🌱 Powered by US CDC 2000, WHO Growth Standards & 117 Clinical Papers · KISFIT AI™',
      'hero.headline': 'Track Your Child\'s US CDC Growth Curve—\n<span class="hero-headline-highlight" style="background: linear-gradient(90deg, #1D4ED8 0%, #0284C7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">And Get an Age-by-Age Growth Plan.</span>',
      'hero.subtitle': 'Check your child\'s predicted adult height in 60 seconds and save quarterly US CDC milestones to your free Parent Dashboard.',
      'nav.forWhom': 'Who It\'s For',
      'nav.services': 'Our Services',
      'hero.cta.parent': '📏 Start Physical Growth Report →',
      'hero.cta.learning': '🧠 Start Brain & Learning Report →',
      'hero.cta.youth': 'Students · Start Self Diagnosis →',

      // For Whom Section
      'forWhom.kicker': 'WHO IT\'S FOR',
      'forWhom.title': 'Who Needs This?',
      'forWhom.sub': 'Zero fluff. Only the exact growth and learning answers you need right now.',
      'forWhom.parent.badge': 'FOR PARENTS',
      'forWhom.parent.title': 'Child Height Growth & Age-Fit Learning',
      'forWhom.parent.b1': '• Curious about your child\'s final adult height',
      'forWhom.parent.b2': '• Want a clear 4-year brain & study roadmap',
      'forWhom.parent.b3': '• Need exact supplements, toys & books for their traits',
      'forWhom.parent.btn': 'Start Parent Diagnosis →',
      'forWhom.student.badge': 'FOR STUDENTS',
      'forWhom.student.title': 'Unlock +6.7cm Hidden Height & Deep Focus',
      'forWhom.student.b1': '• Want to know your max potential height before plates close',
      'forWhom.student.b2': '• Need a 10 PM sleep, posture & nutrition routine',
      'forWhom.student.b3': '• Want to cut screen time and focus deeper in less time',
      'forWhom.student.btn': 'Start Student Diagnosis →',

      // Services Section
      'services.kicker': '3 CORE REPORTS',
      'services.title': '3 Core Results in 1 Minute',
      'services.sub': 'Finish the quick survey to unlock your complete bespoke guidebook.',
      'services.s1.title': 'Genetic vs. Unmanaged vs. Managed Height',
      'services.s1.desc': 'Finds height loss bottlenecks and prescribes a daily sleep, diet & posture routine.',
      'services.s2.title': 'Age N → N+3 Brain & Study Milestones',
      'services.s2.desc': 'Auto-detects growth stage and maps out 4 years of brain & self-directed study focus.',
      'services.s3.title': 'Pinpoint Supplements · Toys · Books · Edu Travel',
      'services.s3.desc': 'Matches verified specific products directly to your child\'s appetite, sleep & temperament.',
      'services.basis': 'Clinical Basis: US CDC 2000 · WHO Growth Standards · ASQ-3 / AAP Milestones · 117-Paper DB',

      // Studio & Quiz Extra Keys
      'studio.bar.title': '✦ KISFIT AI · 1:1 Personalized Growth & Learning Diagnosis',
      'studio.bar.back': '← Back to Overview',
      'presets.bar.label': '⚡ 1-Sec Demo Presets:',
      'preset.chip.1': '👶 Age 3',
      'preset.chip.2': '🧒 Age 7',
      'preset.chip.3': '👦 Age 10',
      'preset.chip.4': '⚡ Age 13',
      'preset.chip.5': '🌟 Age 16',
      'quiz.edition.label': '📘 Personalized Diagnosis Type',
      'quiz.edition.child': '👶 1:1 Personalized Growth & Learning Diagnosis',
      'quiz.edition.self': '🙋 1:1 Personalized Growth & Learning Diagnosis',
      'quiz.dob.hint1': '✨ Even in the same birth year, Jan vs. Dec births differ by up to 4.8 cm (AI day-level calibration active)',
      'quiz.mph.label': 'Real-Time Mid-Parental Target Height (Tanner MPH)',
      'quiz.region.label': 'Region (For Local Museum & Educational Travel Courses)',
      'quiz.autostage.badge': '🔬 KISFIT Clinical Auxology Engine™ Auto-Detected Growth Stage & Bone Maturation!',
      'quiz.autostage.manualLabel': 'Auto-Selected Growth Stage (Click below only if you wish to override)',
      'quiz.habits.label': 'Sleep, Nutrition & Posture Inhibition Factors (Select all that apply)',
      'quiz.habits.hint': 'Selected factors are used to compute nocturnal GH suppression (-52% max) and height loss penalties.',
      'quiz.cog.label': 'Core Brain & Learning Focus Domains (Select all that apply)',
      'quiz.cog.hint': 'Generates age-specific neuroplasticity and inquiry learning protocols.',
      'quiz.submit.btn': '✦ Generate My Growth & Learning Guidebook →',
      'loader.desc': 'Cross-referencing day-calibrated birth data with 117 peer-reviewed studies to compile your guidebook.',
      'results.tab1.title': 'Physical Growth Percentile & Bone Age Trajectory (Auxology)',
      'results.tab1.desc': 'K-GROWTH AI™ Z-Score, annual growth velocity, Tanner Mid-Parental Height (MPH ±8.5 cm), and 3-tier adult height simulation.',
      'results.tab2.title': '24-Hour Hormone Curve & Clinical Bio-Nutrition',
      'results.tab2.desc': 'Slow-wave sleep (SWS) GH suppression simulation (-52% max) and weight-proportional nutrient bioavailability gauges.',
      'results.tab3.title': 'Spinal Decompression & Epiphyseal Biomechanics Studio',
      'results.tab3.desc': 'Intervertebral disc rehydration (+1.8 cm) and Wolff\'s Law mechanical loading routines with interactive countdown timers.',
      'results.tab4.title': 'Neuro-Cognitive Matrix & Weekend Socratic Inquiry Roadmap',
      'results.tab4.desc': '5-axis neuro-cognitive balance radar chart, age-specific cortical development guide, and 3-step inquiry dialogue prompts.',
      'results.tab5.title': '90-Day Growth Tracker & Hospital-Style Clinical PDF Report',
      'results.tab5.desc': 'Continuous height/weight streak tracker and 1-click printable 2-page clinical PDF report.',
      'footer.disclaimer': 'Powered by proprietary KISFIT AI™ algorithms and official US CDC 2000, WHO Growth Standards, AAP, PES, and ASQ-3 developmental milestones (117 papers). This guidebook is for educational and wellness guidance and does not replace medical diagnosis. Product recommendation links on this service are part of Amazon Associates and global affiliate programs, through which we may receive a commission.',

      // Presets
      'presets.badge': 'Clinical Demo Presets',
      'presets.title': 'Instant 1-Second Pediatric Simulations',
      'presets.hint': 'Select an age profile to instantly simulate official growth trajectories and intervention protocols.',
      'preset.1.badge': 'Toddler 3 Yrs',
      'preset.1.title': 'Foundation Auxology & Motor Skills',
      'preset.1.desc': 'Epiphyseal plate 90%+ open; sensory-motor integration window',
      'preset.2.badge': 'Childhood 7 Yrs',
      'preset.2.title': 'Spatial Logic & Postural Alignment',
      'preset.2.desc': 'Steady annual velocity monitoring and thoracic posture alignment',
      'preset.3.badge': 'Puberty 10 Yrs',
      'preset.3.title': 'Early Pubertal Hormone Optimization',
      'preset.3.desc': 'Deep-sleep GH maximization & prevention of late-night glycemic spikes',
      'preset.4.badge': 'Peak Spurt 13 Yrs',
      'preset.4.title': 'Peak Height Velocity (PHV) Intervention',
      'preset.4.desc': 'Critical 8~10 cm/yr growth spurt & executive cognitive focus',
      'preset.5.badge': 'Adolescent 16 Yrs',
      'preset.5.title': 'Spinal Disc Recovery & Alignment',
      'preset.5.desc': 'Decompression traction recovering +1.5~2.5 cm prior to plate closure',

      // Wizard Steps
      'wizard.step': 'Step',
      'wizard.step1.title': 'Child Basic Info (Sex · Date of Birth)',
      'wizard.step1.sub': 'Calculates exact days since birth for US CDC 2000 & WHO LMS percentile comparison.',
      'wizard.step2.title': 'Current Height · Weight · 6-Month Growth Gain',
      'wizard.step2.sub': 'Evaluates current stature and annual growth velocity (cm/yr).',
      'wizard.step3.title': 'Parents\' Height & Region Selection',
      'wizard.step3.sub': 'Computes Tanner Mid-Parental Height (MPH) and local educational courses.',
      'wizard.step4.title': 'Auto-Detected Growth Stage & Sleep/Diet Patterns',
      'wizard.step4.sub': 'Select all sleep and eating patterns that apply to your child.',
      'wizard.step5.title': 'Growth Inhibition Habits & Posture/Activity Check',
      'wizard.step5.sub': 'Correcting these habits can unlock up to +5cm of hidden growth potential.',
      'wizard.step6.title': 'Brain & Learning Focus + Temperament & Custom Note',
      'wizard.step6.sub': 'Matches tailored supplements, play tools, books, and educational travel courses.',

      // Form Labels
      'label.gender': 'Biological Sex',
      'label.gender.boy': 'Boy',
      'label.gender.girl': 'Girl',
      'label.age': 'Date of Birth (Exact Month & Day Calibration)',
      'label.height': 'Current Height',
      'label.weight': 'Current Weight',
      'label.recentGrowth': 'Recent 6-Month Height Gain',
      'label.fatherHeight': 'Father\'s Height',
      'label.motherHeight': 'Mother\'s Height',
      'label.prev': '← Previous',
      'label.next': 'Next Step →',
      'label.scan': '🔬 Run 3-Second Clinical Scan',

      // Tanner Phases
      'phase.1.title': 'Phase 1. Foundation Growth',
      'phase.1.desc': 'Open growth plate ratio 90%+, steady 5~6 cm/yr velocity',
      'phase.2.title': 'Phase 2. Peak Height Velocity (PHV)',
      'phase.2.desc': 'Pulsatile GH & IGF-1 surge; maximum velocity golden window',
      'phase.3.title': 'Phase 3. Deceleration & Maturation',
      'phase.3.desc': 'Final residual potential of 4~7 cm before epiphyseal fusion',
      'phase.4.title': 'Phase 4. Structural Postural Alignment',
      'phase.4.desc': 'Spinal disc decompression recovering +1.5~2.5 cm of hidden height',

      // Habits
      'habit.late_sleep': 'Delayed Bedtime (Sleep after 10:30 PM)',
      'habit.night_carbs': 'Pre-Sleep Snacks or Sugary Drinks',
      'habit.poor_posture': 'Tech-Neck & Slouched Desk Posture',
      'habit.picky_eater': 'Meat/Veggie Picky Eating & Nutrient Deficit',
      'habit.sedentary': 'Under 30 Mins/Day Active Exercise',

      // Cognitive Axes
      'cog.math_logic': 'Math, Spatial & Geometric Logic',
      'cog.language_reading': 'Vocabulary, Literacy & Reading',
      'cog.science_nature': 'Science, Nature & Principle Inquiry',
      'cog.sensory_arts': 'Sensory, Art & Creative Expression',
      'cog.executive_focus': 'Prefrontal Focus & Self-Regulation',

      // Loader
      'loader.step1': 'Loading K-GROWTH AI™ Parameter Matrices...',
      'loader.step2': 'Computing Standardized Z-Scores & 3-Tier Predicted Trajectories...',
      'loader.step3': 'Finalizing GH Suppression Ratio & 5-Axis Neuro-Cognitive Protocol!',
      'loader.skip': '⚡ Skip Wait & View Results Immediately ↗',

      // Results
      'rx.retest': '🔄 Re-enter Information',
      'rx.standard.kdca': 'KISFIT AI™ · US CDC 2000, WHO & AAP Precision Analysis Complete',
      'rx.standard.cdc': 'US CDC 2000 & WHO Clinical Growth Standards Applied',

      // Deep Child Trait Questions (Multi-Select Expanded)
      'quiz.trait.sleep.label': '🌙 Sleep Depth & Morning Wake-Up Pattern (Select all that apply)',
      'quiz.trait.sleep.hint': 'Tap all sleep patterns that apply to your child.',
      'quiz.trait.sleep.opt1': 'Falls asleep before 9:30 PM · Wakes up refreshed',
      'quiz.trait.sleep.opt2': 'Bedtime consistently after 10:30 PM',
      'quiz.trait.sleep.opt3': 'Frequent tossing & mouth-breathing',
      'quiz.trait.sleep.opt4': 'Looks for milk or snacks right before bed',
      'quiz.trait.sleep.opt5': 'Hard to wake up in the morning',
      'quiz.trait.sleep.opt6': 'Heavy head/neck night sweats during sleep',
      'quiz.trait.sleep.opt7': 'Wakes easily to small sounds & sleep-talks',
      'quiz.trait.sleep.opt8': 'Oversleeps on weekends',
      'quiz.trait.diet.label': '🍽️ Appetite & Digestive Constitution (Select all that apply)',
      'quiz.trait.diet.hint': 'Finds delicious, high-absorption nutrients even picky eaters love!',
      'quiz.trait.diet.opt1': 'Small appetite · Eats small portions',
      'quiz.trait.diet.opt2': 'Picks out meat or vegetables',
      'quiz.trait.diet.opt3': 'Stomachache or diarrhea from milk/dairy',
      'quiz.trait.diet.opt4': 'Eats a balanced diet with good digestion',
      'quiz.trait.diet.opt5': 'Constipation or difficult bowel movements',
      'quiz.trait.diet.opt6': 'Prefers refined carbs (bread, pasta, sweets) over balanced protein and vegetables',
      'quiz.trait.diet.opt7': 'Holds food in mouth long or gets indigestion often',
      'quiz.trait.diet.opt8': 'Drinks less than 3 cups of water a day',
      'quiz.trait.posture.label': '🦴 Sitting Posture & Growing Pains (Select all that apply)',
      'quiz.trait.posture.opt1': 'Tech-neck & rounded back at desk/screens',
      'quiz.trait.posture.opt2': 'Crossed legs, uneven standing, or W-sitting',
      'quiz.trait.posture.opt3': 'Nighttime knee/calf growing pains',
      'quiz.trait.posture.opt4': 'Maintains upright back and neck posture',
      'quiz.trait.posture.opt5': 'Rests chin on hand or leans to one side',
      'quiz.trait.posture.opt6': 'Quick foot fatigue when walking · Flat feet',
      'quiz.trait.exercise.label': '🏃 Weekly Active Sweating & Outdoor Play',
      'quiz.trait.exercise.opt1': '1x/week or less · Mostly indoor quiet play',
      'quiz.trait.exercise.opt2': '2–3x/week PE, youth sports (soccer, gymnastics, martial arts), or active play',
      'quiz.trait.exercise.opt3': '4x+/week active daily sweating play',
      'quiz.trait.temp.label': '🧩 Child Temperament & Style (Select all that apply)',
      'quiz.trait.temp.opt1': 'Active Explorer · Hands-on physical learner',
      'quiz.trait.temp.opt2': 'Focused Builder · Loves blocks & crafting',
      'quiz.trait.temp.opt3': 'Verbal Questioner · Loves asking "Why?"',
      'quiz.trait.temp.opt4': 'Careful Observer · Cautious & detail-oriented',
      'quiz.trait.temp.opt5': 'Creative Expressive · Loves music, art & roleplay',
      'quiz.trait.temp.opt6': 'Goal Achiever · Motivated by praise & mission stickers',
      'quiz.trait.focus.label': '⏱️ Attention Span on Single Play or Study Task',
      'quiz.trait.focus.opt1': 'Under 10 mins · Needs short rewarding play',
      'quiz.trait.focus.opt2': '15–20 mins · Fits step-by-step missions',
      'quiz.trait.focus.opt3': '30+ mins · Fits deep reading & projects',
      'quiz.trait.learning.label': '📚 Current Learning Bottlenecks (Multi-Select · 1:1 Study Rx)',
      'quiz.trait.learning.hint': 'Pinpoints neuro-cognitive root causes and tailors study strategies, books, and workbooks.',
      'quiz.trait.learning.opt1': 'Struggles with reading comprehension on long text problems',
      'quiz.trait.learning.opt2': 'Can do basic math but gets stuck on applied problem-solving',
      'quiz.trait.learning.opt3': 'Quickly forgets classroom lessons & struggles with independent homework review',
      'quiz.trait.learning.opt4': 'Used to smartphone/YouTube stimuli & lacks interest in books',
      'quiz.trait.learning.opt5': 'Cannot sit upright at desk for 15-20 mins & easily distracted',
      'quiz.trait.learning.opt6': 'Limited vocabulary or struggles to express ideas in writing',
      'quiz.trait.learning.opt7': 'Knows concepts but makes careless calculation or reading mistakes on tests',
      'quiz.trait.learning.opt8': 'Struggles to plan daily study volume and schedule independently',
      'quiz.trait.studystyle.label': '🎯 Preferred Learning & Study Absorption Style',
      'quiz.trait.studystyle.opt1': '🗣️ Dialogue & Inquiry — Understands best when asking and explaining aloud (Socratic / Feynman)',
      'quiz.trait.studystyle.opt2': '🧩 Hands-On Manipulative — Thrives when touching blocks, 3D shapes & experiment kits',
      'quiz.trait.studystyle.opt3': '🎨 Visual & Mind-Map — Remembers longer with diagrams, charts & visual stories',
      'quiz.trait.studystyle.opt4': '🏆 Daily Mission & Goal — Focuses best with 15-min timer missions & daily checklists',
      'quiz.freenote.label': '💬 Share Your Concerns Freely (1:1 Pediatric AI Clinical Synthesis)',
      'quiz.freenote.hint': 'Write any concerns about supplements, sleep, or growth to get a 1:1 custom answer in your report! (Tap a chip below to auto-fill)',
      'quiz.freenote.placeholder': 'e.g., Wondering which supplement to give my growing child. Wakes up with leg pain at night and has a small appetite...'
    };
  const DICTIONARY = {
    en: EN_DICTIONARY,
    ko: EN_DICTIONARY
  };

  // 2. Unit Conversions
  function cmToFtIn(cm) {
    if (typeof cm !== 'number' || isNaN(cm) || cm <= 0) return { ft: 0, in: 0, str: '0 ft 0 in' };
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round((totalInches % 12) * 10) / 10;
    return {
      ft: ft,
      in: inches,
      str: `${ft} ft ${inches.toFixed(1)} in`
    };
  }

  function ftInToCm(ft, inches = 0) {
    const f = parseFloat(ft) || 0;
    const i = parseFloat(inches) || 0;
    const cm = (f * 12 + i) * 2.54;
    return Math.round(cm * 10) / 10;
  }

  function cmToInches(cm) {
    if (typeof cm !== 'number' || isNaN(cm) || cm <= 0) return 0;
    return Math.round((cm / 2.54) * 10) / 10;
  }

  function inchesToCm(inches) {
    if (typeof inches !== 'number' || isNaN(inches) || inches <= 0) return 0;
    return Math.round((inches * 2.54) * 10) / 10;
  }

  function kgToLbs(kg) {
    if (typeof kg !== 'number' || isNaN(kg) || kg <= 0) return 0;
    return Math.round(kg * 2.20462262 * 10) / 10;
  }

  function lbsToKg(lbs) {
    if (typeof lbs !== 'number' || isNaN(lbs) || lbs <= 0) return 0;
    return Math.round((lbs / 2.20462262) * 10) / 10;
  }

  // 3. State Management
  function isGlobalPaidEditionLock() {
    try {
      if (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === false) return false;
      if (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) return true;
      if (typeof document !== 'undefined' && document.documentElement && typeof document.documentElement.getAttribute === 'function') {
        const edition = document.documentElement.getAttribute('data-edition');
        if (edition === 'global-paid') return true;
        if (edition === 'ko') return false;
      }
      if (typeof window !== 'undefined' && window.location) {
        const host = String(window.location.hostname || '').toLowerCase();
        const search = String(window.location.search || '').toLowerCase();
        if (search.indexOf('edition=ko') !== -1) return false;
        if (search.indexOf('edition=global') !== -1 || search.indexOf('paywall=1') !== -1) return true;
        if (host.indexOf('kisfitglobal.com') !== -1 && typeof navigator !== 'undefined' && navigator.userAgent) {
          return true;
        }
      }
      if (typeof document === 'undefined') return true;
    } catch (_) {}
    return false;
  }

  let currentLang = 'en';
  let currentUnitSystem = 'imperial'; // 'metric' (cm, kg) or 'imperial' (ft/in, lbs)
  let prevUnitSystem = 'metric';

  function initI18n() {
    if (isGlobalPaidEditionLock()) {
      currentLang = 'en';
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem('taller_lang', 'en');
          const savedUnit = window.localStorage.getItem('taller_unit');
          currentUnitSystem = (savedUnit === 'metric' || savedUnit === 'imperial') ? savedUnit : 'imperial';
        } catch (e) {
          currentUnitSystem = 'imperial';
        }
      } else {
        currentUnitSystem = 'imperial';
      }
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedLang = window.localStorage.getItem('taller_lang');
        if (savedLang === 'en' || savedLang === 'ko') {
          currentLang = savedLang;
        } else if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('en')) {
          currentLang = 'en';
        }
        const savedUnit = window.localStorage.getItem('taller_unit');
        if (savedUnit === 'imperial' || savedUnit === 'metric') {
          currentUnitSystem = savedUnit;
        } else {
          currentUnitSystem = currentLang === 'en' ? 'imperial' : 'metric';
        }
      } catch (e) {
        // Fallback
      }
    }
    updateDocumentLang();
    updateDOM();

    // Wire #btn-lang-toggle click listener
    if (typeof document !== 'undefined') {
      const langBtn = document.getElementById('btn-lang-toggle');
      if (langBtn && !langBtn._hasI18nListener) {
        langBtn.addEventListener('click', () => {
          toggleLanguage();
        });
        langBtn._hasI18nListener = true;
      }
    }
  }

  function getLanguage() {
    return isGlobalPaidEditionLock() ? 'en' : currentLang;
  }

  function getUnitSystem() {
    return currentUnitSystem;
  }

  function setLanguage(lang) {
    if (lang !== 'ko' && lang !== 'en') return;
    if (isGlobalPaidEditionLock()) {
      lang = 'en';
    }
    const langChanged = currentLang !== lang;
    currentLang = lang;
    if (langChanged) {
      currentUnitSystem = lang === 'en' ? 'imperial' : 'metric';
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('taller_lang', currentLang);
        localStorage.setItem('taller_unit', currentUnitSystem);
      } catch (e) {}
    }

    updateDocumentLang();
    if (langChanged) {
      updateDOM();
    }
  }

  function toggleLanguage() {
    if (isGlobalPaidEditionLock()) {
      setUnitSystem(currentUnitSystem === 'imperial' ? 'metric' : 'imperial');
      return;
    }
    setLanguage(currentLang === 'ko' ? 'en' : 'ko');
  }

  function setUnitSystem(unit) {
    if (unit !== 'metric' && unit !== 'imperial') return;
    currentUnitSystem = unit;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('taller_unit', currentUnitSystem);
      } catch (e) {}
    }
    updateDOM();
  }

  function updateDocumentLang() {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang;
    }
  }

  function t(key, lang = currentLang) {
    const dict = DICTIONARY[lang] || DICTIONARY.ko;
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to KO if missing in EN
    if (DICTIONARY.ko && DICTIONARY.ko[key]) {
      return DICTIONARY.ko[key];
    }
    return key;
  }

  function updateDOM() {
    if (typeof document === 'undefined') return;

    // 1. Elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const translated = t(key);
        // Fallback guard: If key is not in dictionary, preserve existing meaningful DOM text
        if (translated !== key) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.setAttribute('placeholder', translated);
          } else {
            el.textContent = translated;
          }
        }
      }
    });

    // 2. Elements with data-i18n-html
    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key) {
        const translated = t(key);
        if (translated !== key) {
          el.innerHTML = translated.replace(/\n/g, '<br>');
        }
      }
    });

    // 3. Language button
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      if (isGlobalPaidEditionLock()) {
        langBtn.textContent = currentUnitSystem === 'imperial' ? '🇺🇸 Units: ft/in · lbs' : '🌐 Units: cm · kg';
        langBtn.title = 'Toggle between Imperial (ft/in, lbs) and Metric (cm, kg)';
      } else {
        langBtn.textContent = currentLang === 'ko' ? '🇺🇸 EN (CDC)' : '🇰🇷 KO (KDCA)';
        langBtn.title = 'Toggle between Imperial (ft/in, lbs) and Metric (cm, kg)';
      }
    }

    // 3a. Translate extra quiz checkboxes & headers when in English
    if (currentLang === 'en') {
      const extraCheckboxMapEn = {
        'learning-literacy:reading_comprehension': 'Struggles to grasp the core structure of long passages or word problems',
        'learning-literacy:vocab_context': 'Gets stuck on unfamiliar vocabulary instead of inferring meaning from context',
        'learning-literacy:slow_subvocal': 'Reads very slowly or subvocalizes (moves lips while reading)',
        'learning-literacy:summary_expression': 'Finds it hard to summarize a book or express thoughts in words/writing after reading',
        'learning-literacy:active_reader': 'Actively enjoys reading books and understands context & subtext well',
        'learning-math:applied_math_block': 'Fast at basic arithmetic, but struggles to set up equations for word problems',
        'learning-math:spatial_logic_difficulty': 'Finds mental rotation, 3D nets, and spatial geometry problems especially difficult',
        'learning-math:formula_memorizer': 'Relies on rote formula memorization rather than conceptual proof; misses modified problems',
        'learning-math:error_transfer_gap': 'Repeats the same mistakes on similar problem types even after reviewing explanations',
        'learning-math:math_explorer': 'Enjoys finding patterns, logic puzzles, and exploring new mathematical principles',
        'learning-focus:distracted_desk': 'Finds it hard to sit at a desk for 15–20+ minutes; easily distracted by small noises or objects',
        'learning-focus:dopamine_media': 'Used to high-dopamine short-form video/games; gets bored quickly with text or study',
        'learning-focus:procrastination': 'Procrastinates starting homework or study tasks with frequent off-task behavior',
        'learning-focus:impulsive_mistakes': 'Skips reading full problem statements or makes frequent careless sign/calculation errors',
        'learning-focus:deep_focus': 'Immerses deeply for 30–40+ minutes when working on interesting topics or problems',
        'learning-meta:passive_illusion': 'Understands when listening to a teacher/tutor, but goes blank when solving alone',
        'learning-meta:metacognition_lack': 'Cannot close the book and explain or summarize what was just learned in their own words',
        'learning-meta:cramming_forget': 'Crams the night before tests and quickly forgets the material right after',
        'learning-meta:sleep_consolidation_loss': 'Studies or sleeps late at night, resulting in morning brain fog and daytime fatigue',
        'learning-meta:daily_retrieval_active': 'Has a habit of spending 15 minutes reviewing and asking questions about daily lessons',
        'trait-growth-detail:growing_pain_night': 'Frequent nighttime knee, calf, or ankle growing pains or lower-body fatigue',
        'trait-growth-detail:underweight_thin': 'Small meal volume and slow weight gain; tends to be underweight compared to peers',
        'trait-growth-detail:overweight_fat_gain': 'Weight (body fat) gaining faster than height; concerned about bone-age acceleration',
        'trait-growth-detail:rhinitis_mouth': 'Allergic rhinitis, nasal congestion, or mouth breathing disrupting deep slow-wave sleep',
        'trait-growth-detail:early_puberty_worry': 'Early pubertal signs (breast buds, body hair, scalp oil/odor) appearing earlier than peers',
        'trait-growth-detail:bone_age_delay': 'Shorter than peer average with annual height velocity slowing below 5 cm/yr (<2 in/yr)',
        'trait-growth-detail:dairy_calcium_lack': 'Low dairy intake or weak digestion raising concern for Calcium, Vitamin D3 & protein deficit',
        'trait-growth-detail:slouch_disc_loss': 'Forward head posture (tech neck) and slouched spine when seated causing hidden height loss'
      };
      Object.keys(extraCheckboxMapEn).forEach((k) => {
        const parts = k.split(':');
        const input = document.querySelector(`input[name="${parts[0]}"][value="${parts[1]}"]`);
        if (input && input.parentElement) {
          const pill = input.parentElement.querySelector('.chip-pill');
          if (pill) {
            const spans = pill.querySelectorAll('span');
            const targetSpan = spans.length > 0 ? spans[spans.length - 1] : pill;
            if (targetSpan) targetSpan.textContent = extraCheckboxMapEn[k];
          }
        }
      });

      const groupHeadersEn = [
        { id: 'learning-reading-literacy-group', label: 'Reading Habits & Cognitive Literacy Processing (Multi-Select)', hint: 'Evaluates long-passage comprehension, contextual vocabulary inference, and reading fluency based on cognitive linguistics.' },
        { id: 'learning-math-logic-group', label: 'Mathematical Logic & 3D Spatial Reasoning (Multi-Select)', hint: 'Diagnoses the cognitive transition from basic arithmetic to applied word problems and 3D spatial geometry.' },
        { id: 'learning-focus-dopamine-group', label: 'Prefrontal Attention Span & Digital Dopamine Habits (Multi-Select)', hint: 'Assesses prefrontal executive function (working memory, impulse control) and digital reward-circuit sensitivity.' },
        { id: 'learning-metacognition-group', label: 'Metacognitive Active Recall & SWS Memory Consolidation (Multi-Select)', hint: 'Evaluates hippocampal-to-neocortical sleep memory consolidation and blank-sheet self-explanation habits.' },
        { id: 'trait-growth-detail-group', label: 'Additional Auxology, Weight-for-Height & Endocrine Checkpoints (Multi-Select)', hint: 'Selected clinical checkpoints are directly integrated into your child\'s bespoke growth & bone-age report.' }
      ];
      groupHeadersEn.forEach((g) => {
        const grp = document.getElementById(g.id);
        if (grp && grp.parentElement) {
          const lbl = grp.parentElement.querySelector('.form-label');
          const hnt = grp.parentElement.querySelector('.section-hint');
          if (lbl) lbl.textContent = g.label;
          if (hnt) hnt.textContent = g.hint;
        }
      });

      const printTopBtn = document.getElementById('btn-print-report-top');
      if (printTopBtn) printTopBtn.textContent = '🖨️ Print / Save PDF Report';
      const rxTitle = document.getElementById('rx-header-title');
      if (rxTitle && /[\uac00-\ud7a3]/.test(rxTitle.textContent)) {
        rxTitle.textContent = 'KISFIT Personalized Clinical Growth & Brain LQ Report';
      }
      const progText = document.getElementById('quiz-progress-text');
      if (progText && progText.textContent.indexOf('\uC644\uB8CC') !== -1) {
        progText.textContent = progText.textContent.replace('\uC644\uB8CC', 'Completed');
      }
    }

    // 3b. Translate DOB & Region select option labels
    const yearSel = document.getElementById('child-birth-year');
    if (yearSel && yearSel.options) {
      Array.from(yearSel.options).forEach((opt) => {
        opt.textContent = `Born ${opt.value}`;
      });
    }
    const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthSel = document.getElementById('child-birth-month');
    if (monthSel && monthSel.options) {
      Array.from(monthSel.options).forEach((opt) => {
        const mIdx = (parseInt(opt.value, 10) || 1) - 1;
        opt.textContent = monthNamesEn[mIdx] || `Month ${opt.value}`;
      });
    }
    const daySel = document.getElementById('child-birth-day');
    if (daySel && daySel.options) {
      Array.from(daySel.options).forEach((opt) => {
        opt.textContent = `Day ${opt.value}`;
      });
    }
    const regionMapEn = {};
    const regionSel = document.getElementById('user-region');
    if (regionSel && regionSel.options) {
      Array.from(regionSel.options).forEach((opt) => {
        opt.textContent = currentLang === 'en' ? (regionMapEn[opt.value] || opt.value) : opt.value;
      });
    }

    // 4. Update unit labels in inputs
    const heightUnitLabels = document.querySelectorAll('.unit-label-height');
    heightUnitLabels.forEach((el) => {
      el.textContent = currentUnitSystem === 'imperial' ? 'in (or ft/in)' : 'cm';
    });
    const weightUnitLabels = document.querySelectorAll('.unit-label-weight');
    weightUnitLabels.forEach((el) => {
      el.textContent = currentUnitSystem === 'imperial' ? 'lbs' : 'kg';
    });

    // Note: Primary input element conversion is authoritatively managed by
    // OnboardingWizard.applyUnitSwitch() to eliminate double-conversion bugs.
    if (prevUnitSystem !== currentUnitSystem) {
      prevUnitSystem = currentUnitSystem;
    }

    // 5. Fire global custom event
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('taller-language-change', {
        detail: { language: currentLang, unitSystem: currentUnitSystem }
      }));
    }
  }

  // Export
  const I18n = {
    DICTIONARY,
    initI18n,
    getLanguage,
    setLanguage,
    toggleLanguage,
    getUnitSystem,
    setUnitSystem,
    t,
    updateDOM,
    applyTranslations: updateDOM,
    cmToFtIn,
    ftInToCm,
    cmToInches,
    inchesToCm,
    kgToLbs,
    lbsToKg
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
  } else {
    global.TallerI18n = I18n;
    if (typeof window !== 'undefined') {
      window.addEventListener('DOMContentLoaded', () => {
        initI18n();
        const langBtn = document.getElementById('btn-lang-toggle');
        if (langBtn && !langBtn._hasI18nListener) {
          langBtn.addEventListener('click', () => {
            toggleLanguage();
          });
          langBtn._hasI18nListener = true;
        }
      });
    }
  }

})(typeof window !== 'undefined' ? window : global);
