/**
 * Taller Bio Labs (KISFIT Bio Labs)
 * Multimodal Haptic Feedback, Typewriter Streamer & 60-Second Personalized Analysis Theatre
 * (src/js/haptic-typewriter.js)
 *
 * Features:
 * 1. Multimodal Haptic Feedback Engine:
 * - Android/Mobile: navigator.vibrate patterns
 * - iOS/Desktop/All: Web Audio API synthesized mechanical/clinical micro-tick & chimes
 * - Visual Haptic Pulse: CSS spring bounce & neon cursor glow
 * - User Toggle: ${isEn ? 'Haptic ON' : ' ON'}/OFF safety switch
 * 2. Taller-Style Typewriter Streamer:
 * - Streams clinical analysis headlines character-by-character with punctuation micro-pauses
 * - Fires subtle tactile ticks every 3 characters
 * 3. 60-Second Personalized Waiting Content Theatre:
 * - 6-Stage (10s each) live clinical computation progress bar & countdown timer
 * - 6 Dynamic Child-Specific Briefing Cards (injected with exact DOB months/days, height, MPH, habits, and N -> N+1 -> N+2 age preview)
 * - Interactive 1-Second Touch O/X Parent Fact Quiz with instant haptic & paper-backed answer reveal
 */

(function (global) {
  'use strict';

  const state = {
    hapticEnabled: true,
    audioCtx: null,
    activeTypewriterTimer: null,
    activeTheatreTimer: null,
    activeCardIndex: 0,
    activeQuizIndex: 0,
    quizAnswered: false
  };

  /**
   * Initializes or resumes Web Audio API context safely on user interaction
   */
  function getAudioContext() {
    if (!state.hapticEnabled) return null;
    if (typeof window === 'undefined') return null;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!state.audioCtx) {
        state.audioCtx = new AudioCtx();
      }
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume().catch(() => {});
      }
      return state.audioCtx;
    } catch (e) {
      return null;
    }
  }

  /**
   * Plays a subtle synthesized clinical tactile sound (for iOS/Desktop/Android haptic feel)
   */
  function playTactileTone(freq = 800, durationMs = 12, gainVal = 0.022, type = 'sine') {
    if (!state.hapticEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {
      // Ignore audio errors on restricted autoplay
    }
  }

  /**
   * Triggers multimodal haptic feedback (Vibration + Audio Micro-Tick + Visual Pulse)
   * @param {'tick'|'step'|'quiz_correct'|'quiz_wrong'|'complete'} kind
   * @param {HTMLElement} [targetEl]
   */
  function triggerHaptic(kind = 'tick', targetEl = null) {
    if (!state.hapticEnabled) return;

    // 1. Hardware Vibration (only when supported AND user has tapped frame to prevent browser intervention errors)
    const hasUserActivation = typeof navigator !== 'undefined' && (!navigator.userActivation || navigator.userActivation.hasBeenActive);
    if (hasUserActivation && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        if (kind === 'tick') navigator.vibrate(8);
        else if (kind === 'step') navigator.vibrate([18, 35, 25]);
        else if (kind === 'quiz_correct') navigator.vibrate([15, 30, 35]);
        else if (kind === 'quiz_wrong') navigator.vibrate([40, 50, 40]);
        else if (kind === 'complete') navigator.vibrate([30, 45, 30, 45, 80]);
      } catch (e) {}
    }

    // 2. Synthesized Micro-Tactile Audio
    if (kind === 'tick') {
      playTactileTone(820, 11, 0.018, 'triangle');
    } else if (kind === 'step') {
      playTactileTone(540, 35, 0.028, 'sine');
      setTimeout(() => playTactileTone(780, 45, 0.03, 'sine'), 45);
    } else if (kind === 'quiz_correct') {
      playTactileTone(587.33, 45, 0.032, 'sine'); // D5
      setTimeout(() => playTactileTone(880, 65, 0.035, 'sine'), 55); // A5
    } else if (kind === 'quiz_wrong') {
      playTactileTone(280, 70, 0.03, 'triangle');
    } else if (kind === 'complete') {
      playTactileTone(523.25, 45, 0.032, 'sine');
      setTimeout(() => playTactileTone(659.25, 45, 0.032, 'sine'), 55);
      setTimeout(() => playTactileTone(783.99, 80, 0.038, 'sine'), 110);
    }

    // 3. Visual Spring Pulse
    if (targetEl && targetEl.style) {
      targetEl.style.transition = 'transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1)';
      targetEl.style.transform = 'scale(1.025)';
      setTimeout(() => {
        if (targetEl && targetEl.style) {
          targetEl.style.transform = 'scale(1)';
        }
      }, 160);
    }
  }

  /**
   * Streams text into an element with Taller-style typewriter cursor & haptic ticks
   */
  function typewriteText(el, text, options = {}) {
    if (!el) return;
    if (state.activeTypewriterTimer) {
      clearInterval(state.activeTypewriterTimer);
      state.activeTypewriterTimer = null;
    }

    const fullText = String(text || '');
    const charInterval = options.charInterval || 34;

    if (typeof window === 'undefined' || options.instant) {
      el.textContent = fullText;
      return;
    }

    let idx = 0;
    el.innerHTML = `<span class="tw-text"></span><span class="tw-cursor" style="display:inline-block;margin-left:3px;color: #1D4ED8;font-weight:900;">▋</span>`;
    const textSpan = el.querySelector('.tw-text');

    state.activeTypewriterTimer = setInterval(() => {
      if (idx < fullText.length) {
        idx++;
        if (textSpan) {
          textSpan.textContent = fullText.slice(0, idx);
        } else {
          el.textContent = fullText.slice(0, idx);
        }
        if (idx % 3 === 1) {
          triggerHaptic('tick');
        }
      } else {
        clearInterval(state.activeTypewriterTimer);
        state.activeTypewriterTimer = null;
        if (typeof options.onDone === 'function') options.onDone();
      }
    }, charInterval);
  }

  function isLearningModeActive(profile = {}) {
    if (profile && profile.preferredReportMode === 'learning') return true;
    if (profile && profile.preferredReportMode === 'growth') return false;
    if (typeof window !== 'undefined' && window.__KIDSFIT_PREFERRED_REPORT_MODE === 'learning') return true;
    if (typeof global !== 'undefined' && global.__KIDSFIT_PREFERRED_REPORT_MODE === 'learning') return true;
    if (typeof document !== 'undefined') {
      const formEl = document.getElementById('diagnosis-form');
      if (formEl && formEl.className && formEl.className.includes('wizard-mode-learning')) return true;
    }
    return false;
  }

  /**
   * Builds 6 dynamically personalized child waiting cards strictly separated by mode:
   * - Physical Growth Mode: 100% Height, Weight, BMI, Growth Plate, Sleep GH, Calcium, Spine Decompression
   * - Brain & Learning Mode: 100% LQ 5-Axis, Literacy, Math Spatial, Working Memory, Active Recall, Careers
   */
  function isGlobalEnMode() {
    try {
      if (typeof document !== 'undefined' && document.documentElement) {
        if (document.documentElement.lang === 'en' || (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid')) return true;
      }
      if (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) return true;
    } catch (_) {}
    return false;
  }

  function formatHeightUnit(cmVal) {
    const cm = Number(cmVal) || 137.0;
    const isImp = typeof window !== 'undefined' && (window.__KIDSFIT_UNIT_SYSTEM__ === 'imperial' || (window.TallerI18n && typeof window.TallerI18n.getUnitSystem === 'function' && window.TallerI18n.getUnitSystem() === 'imperial'));
    if (isImp) {
      const totalIn = cm / 2.54;
      const ft = Math.floor(totalIn / 12);
      const inch = Math.round((totalIn - ft * 12) * 10) / 10;
      return `${ft}'${inch}" (${cm.toFixed(1)} cm)`;
    }
    return `${cm.toFixed(1)} cm`;
  }

  function formatWeightUnit(kgVal) {
    const kg = Number(kgVal) || 35.5;
    const isImp = typeof window !== 'undefined' && (window.__KIDSFIT_UNIT_SYSTEM__ === 'imperial' || (window.TallerI18n && typeof window.TallerI18n.getUnitSystem === 'function' && window.TallerI18n.getUnitSystem() === 'imperial'));
    if (isImp) {
      const lbs = Math.round(kg * 2.20462262 * 10) / 10;
      return `${lbs} lbs (${kg.toFixed(1)} kg)`;
    }
    return `${kg.toFixed(1)} kg`;
  }

  function buildChildWaitingCards(profile = {}) {
    const isLearning = isLearningModeActive(profile);
    const isEn = isGlobalEnMode();
    if (isEn) {
      const genderEn = profile.gender === 'girl' ? 'Girl' : 'Boy';
      const ageMonths = Number(profile.ageMonths) || 120;
      const exactMonths = Number(profile.exactMonths || ageMonths).toFixed(1);
      const ageYears = Math.max(1, Math.min(20, Math.floor(ageMonths / 12)));
      const height = Number(profile.currentHeight) || 137.0;
      const weight = Number(profile.currentWeight) || 35.5;
      const fatherH = Number(profile.fatherHeight) || 173.5;
      const motherH = Number(profile.motherHeight) || 160.5;
      const mph = Math.round(((fatherH + motherH + (profile.gender === 'girl' ? -13 : 13)) / 2) * 10) / 10;
      const closureAge = profile.gender === 'girl' ? 15 : 17;
      const remYearsMax = Math.max(2, closureAge - ageYears);
      const hDisp = formatHeightUnit(height);
      const wDisp = formatWeightUnit(weight);
      const mphDisp = formatHeightUnit(mph);
      if (isLearning) {
        return [
          {
            badge: `Brain Briefing 1/6 · Age ${ageYears} Neuro-Developmental Window`,
            title: `Mapping Prefrontal & Cognitive Synaptic Windows (${exactMonths} mos · ${genderEn})`,
            body: `Cross-referencing your child's age-specific prefrontal cortex (DLPFC) and parietal spatial circuits against <strong>117 peer-reviewed neuroscience papers</strong>.`,
            highlight: `Computing 5-Axis Learning Quotient (LQ) & primary cognitive bottleneck...`
          },
          {
            badge: `Brain Briefing 2/6 · Executive Focus Radar & Bottleneck Detection`,
            title: `Analyzing Literacy · Spatial Math · Working Memory · Metacognition · Inquiry`,
            body: `Identifying your child's Top 3 cognitive strengths and Top 3 study bottlenecks to prevent wasted tutoring and study fatigue.`,
            highlight: `Matching 1:1 study methodology (Active Recall / Manipulative / Visual / Goal-Driven)...`
          },
          {
            badge: `Brain Briefing 3/6 · Roediger & Karpicke (2006) Active Recall Effect`,
            title: `3-Min Blank-Sheet Recall Retains 2.4x More Than Re-Reading 4 Times`,
            body: `Closing the book and verbally explaining 3 key takeaways boosts 1-week long-term retention from <strong>48% to 92%</strong>.`,
            highlight: `Synthesizing your child's 4-step daily self-directed study schedule...`
          },
          {
            badge: `Brain Briefing 4/6 · 10 PM Slow-Wave Sleep Memory Consolidation`,
            title: `Hippocampus-to-Neocortex Memory Transfer Peaks Between 10 PM and 2 AM`,
            body: `Vocabulary and math concepts learned during the day are permanently consolidated into the neocortex during deep slow-wave sleep (SWS).`,
            highlight: `Preparing 6-month focus & memory retention growth trajectory...`
          },
          {
            badge: `Brain Briefing 5/6 · Future Career Pathways & 3-Year Roadmap`,
            title: `Matching Top 3 Future Career Tracks to Your Child's Brain Strengths`,
            body: `Mapping a 3-year age-by-age cognitive & academic transition roadmap from Age ${ageYears} to Age ${ageYears + 2}.`,
            highlight: `Finalizing bespoke workbook, STEM kit & museum inquiry curation...`
          },
          {
            badge: `Brain Briefing 6/6 · 1:1 Brain & Learning Master Report Ready`,
            title: `Your Child's Executive Focus Balance Chart & Bottleneck Rx is Ready!`,
            body: `Includes 5-Axis Radar SVG, 6-Month LQ Growth Curve, and step-by-step bottleneck correction protocol.`,
            highlight: `Opening your child's clinical Brain & Learning Report now...`
          }
        ];
      }
      return [
        {
          badge: `Auxology Briefing 1/6 · Day-Exact CDC/WHO LMS Percentile Scan`,
          title: `Cross-Analyzing ${hDisp} / ${wDisp} at ${exactMonths} Months (${genderEn})`,
          body: `Even within the same birth year, January vs. December births differ by up to <strong>1.9 in (4.8 cm)</strong>. Computing day-exact US CDC 2000 & WHO LMS Z-scores.`,
          highlight: `Tanner Mid-Parental Height (MPH): ${mphDisp} (±3.3 in / ±8.5 cm epigenetic window = 6.7 in / 17 cm total range)`
        },
        {
          badge: `Auxology Briefing 2/6 · Weight-for-Height & Leptin Bone-Age Check`,
          title: `Balancing Weight-for-Height to Protect Epiphyseal Growth Plates`,
          body: `Underweight slows bone matrix synthesis, while excess body fat elevates <strong>Leptin & Aromatase</strong>, accelerating bone age and early growth-plate fusion.`,
          highlight: `Calculating optimal target weight and 3-tier adult height trajectory...`
        },
        {
          badge: `Auxology Briefing 3/6 · Epiphyseal Plate Closure Countdown`,
          title: `Approx. ${remYearsMax} Years Remaining Until Growth Plate Fusion (Age ${closureAge})`,
          body: `Simulating Unmanaged vs. Genetic vs. Clinically Optimized adult height and evaluating <50th percentile rhGH clinical trial ROI.`,
          highlight: `Modeling +2.6 in (+6.7 cm) hidden height recovery potential...`
        },
        {
          badge: `Auxology Briefing 4/6 · Bioavailable Calcium, Vit D3/K2 & Zinc Targets`,
          title: `Computing Exact Daily mg/IU Targets for ${wDisp} Body Weight`,
          body: `Citrate/MCHA Calcium offers <strong>45% bioavailability</strong> (2.05x higher than carbonate) when paired with Vitamin D3 and MK-7 Vitamin K2.`,
          highlight: `Applying peer-reviewed pediatric endocrinology & nutrition standards...`
        },
        {
          badge: `Auxology Briefing 5/6 · 10 PM SWS GH Peak & +0.7 in Spinal Decompression`,
          title: `65–70% of Daily Growth Hormone Pulses During First 90 Min of Deep Sleep`,
          body: `Late-night carbs spike insulin and suppress GH by up to <strong>-52%</strong>, while 3x30s doorway dead-hangs restore <strong>+0.7 in (+1.8 cm)</strong> of intervertebral disc height.`,
          highlight: `Building your child's 4-stage daily growth & posture routine...`
        },
        {
          badge: `Auxology Briefing 6/6 · 1:1 Pediatric Auxology Master Report Ready`,
          title: `Your Child's 3-Tier Height Trajectory & Clinical Report is Ready!`,
          body: `Includes CDC LMS Percentile Curve, Phenotype-Specialized Clinical Module, and 90-Day Action Plan.`,
          highlight: `Opening your child's clinical Height & Growth-Plate Report now...`
        }
      ];
    }
    const genderKo = profile.gender === 'girl' ? 'Girl' : 'Boy';
    const ageMonths = Number(profile.ageMonths) || 120;
    const exactMonths = Number(profile.exactMonths || ageMonths).toFixed(1);
    const ageYears = Math.max(1, Math.min(20, Math.floor(ageMonths / 12)));
    const nextAge1 = Math.min(20, ageYears + 1);
    const nextAge2 = Math.min(20, ageYears + 2);
    const height = Number(profile.currentHeight) || 137.0;
    const weight = Number(profile.currentWeight) || 35.5;
    const fatherH = Number(profile.fatherHeight) || 173.5;
    const motherH = Number(profile.motherHeight) || 160.5;
    const mph = Math.round(((fatherH + motherH + (profile.gender === 'girl' ? -13 : 13)) / 2) * 10) / 10;
    const closureAge = profile.gender === 'girl' ? 15 : 17;
    const remYearsMin = Math.max(1, closureAge - ageYears - 1);
    const remYearsMax = Math.max(remYearsMin + 1, closureAge - ageYears);
    const dobDisplay = profile.birthDateStr || `${new Date().getFullYear() - ageYears}US CDC Growth Reference`;
    const habits = Array.isArray(profile.habits) ? profile.habits : ['late_sleep'];

    if (isLearning) {
      const brainStageFocus = ageYears <= 3
        ? 'US CDC Growth Reference ExerciseUS CDC Growth Reference 30% US CDC Growth Reference & US CDC Growth Reference'
        : ageYears <= 6
        ? 'US CDC Growth Reference 3D US CDC Growth Reference & US CDC Growth Reference'
        : ageYears <= 9
        ? 'US CDC Growth ReferenceDLPFC) US CDC Growth Reference ptsUS CDC Growth Reference & US CDC Growth Reference'
        : 'US CDC Growth Reference & US CDC Growth Reference';

      return [
        {
          badge: `US CDC Growth Reference 1/6 · US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference`,
          title: `${dobDisplay} (US CDC Growth Reference ${exactMonths} mos) ${genderKo}, US CDC Growth Reference?`,
          body: `US CDC Growth Reference ${ageYears} yrsUS CDC Growth Reference <strong>[${brainStageFocus}]</strong>US CDC Growth Reference. US CDC Growth Reference 2US CDC Growth Reference.`,
          highlight: `3,714US CDC Growth Reference ${ageYears} yrs US CDC Growth ReferenceLQ)US CDC Growth Reference.`
        },
        {
          badge: `US CDC Growth Reference 2/6 · 5US CDC Growth Reference & US CDC Growth Reference pts US CDC Growth Reference`,
          title: `US CDC Growth Reference 5US CDC Growth Reference`,
          body: `US CDC Growth Reference <strong>US CDC Growth Reference pts TOP 3</strong>US CDC Growth Reference <strong>US CDC Growth Reference TOP 3</strong>US CDC Growth Reference 1US CDC Growth Reference 3US CDC Growth Reference.`,
          highlight: `US CDC Growth Reference pts US CDC Growth Referencepts US CDC Growth Reference 1:1 US CDC Growth Reference.`
        },
        {
          badge: `US CDC Growth Reference 3/6 · US CDC Growth Reference`,
          title: `US CDC Growth Reference 4US CDC Growth Reference 'US CDC Growth Reference 3US CDC Growth Reference'US CDC Growth Reference 2.4US CDC Growth Reference`,
          body: `Roediger & Karpicke(2006)US CDC Growth Reference<strong>US CDC Growth Reference 3US CDC Growth Reference</strong>US CDC Growth Reference 1US CDC Growth Referenced US CDC Growth Reference <strong>48% → 92%</strong>US CDC Growth Reference.`,
          highlight: `US CDC Growth Reference ReportUS CDC Growth Reference 4US CDC Growth Reference dd US CDC Growth Reference yrsUS CDC Growth Reference!`
        },
        {
          badge: `US CDC Growth Reference 4/6 · US CDC Growth Reference 10US CDC Growth Reference Sleep US CDC Growth Reference → US CDC Growth Reference`,
          title: `US CDC Growth Reference  hrsUS CDC Growth Reference 'US CDC Growth Reference 10US CDC Growth Reference'US CDC Growth Reference`,
          body: `US CDC Growth Reference <strong>US CDC Growth Reference 10US CDC Growth Reference 2US CDC Growth Reference Slow-Wave Sleep (N3)(SWS)</strong> US CDC Growth Reference.`,
          highlight: `US CDC Growth Reference 1 hrs US CDC Growth Reference hrsUS CDC Growth Reference ${ageYears <= 4 ? '10US CDC Growth Reference → 20US CDC Growth Reference' : '15US CDC Growth Reference → 35US CDC Growth Reference'}US CDC Growth Reference.`
        },
        {
          badge: `US CDC Growth Reference 5/6 · US CDC Growth Reference pts US CDC Growth Reference & US CDC Growth Reference`,
          title: `US CDC Growth Reference ptsUS CDC Growth Reference 1US CDC Growth Reference3US CDC Growth ReferencedUS CDC Growth Reference?`,
          body: `US CDC Growth Reference pts US CDC Growth Referenced(US CDC Growth Reference, <strong>US CDC Growth Reference TOP 3US CDC Growth Reference</strong>US CDC Growth Reference.`,
          highlight: `US CDC Growth Reference ${ageYears} yrs → US CDC Growth Reference ${nextAge1} yrs → US CDC Growth Reference ${nextAge2} yrsUS CDC Growth Reference 3US CDC Growth Reference.`
        },
        {
          badge: `US CDC Growth Reference 6/6 · US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference`,
          title: `US CDC Growth Reference 1:1 US CDC Growth Reference & Growth GuideUS CDC Growth Reference!`,
          body: `5US CDC Growth Reference, 6 mos US CDC Growth Reference 3US CDC Growth Reference3US CDC Growth Reference<strong>US CDC Growth Reference</strong>US CDC Growth Reference.`,
          highlight: `US CDC Growth Reference [5US CDC Growth Reference & 6 mos US CDC Growth Reference]US CDC Growth Reference yrsUS CDC Growth Reference!`
        }
      ];
    }

    // Physical Growth Mode (100% Pure Growth: Height, Weight, BMI, Growth Plate, Sleep GH, Nutrition, Posture)
    let growthStageFocus = 'US CDC Growth Reference & US CDC Growth Reference 9US CDC Growth Reference 30US CDC Growth Reference Growth Hormone (HGH) US CDC Growth Reference';
    let keyIngredient = 'US CDC Growth Reference VitaminD3·K2 + Zinc·US CDC Growth Reference Protein';
    if (ageYears >= 4 && ageYears <= 6) {
      growthStageFocus = 'US CDC Growth Reference Growth Plate US CDC Growth Reference & US CDC Growth Reference  ptsUS CDC Growth Reference yrsUS CDC Growth Reference';
      keyIngredient = 'US CDC Growth ReferenceHT042) + US CDC Growth Reference 800mg';
    } else if (ageYears >= 7 && ageYears <= 10) {
      growthStageFocus = 'US CDC Growth Reference & US CDC Growth Reference Weight(US CDC Growth Reference';
      keyIngredient = 'US CDC Growth ReferenceHT042) + US CDC Growth Reference VitaminD3·K2';
    } else if (ageYears >= 11) {
      growthStageFocus = 'US CDC Growth ReferencePHV) Growth Plate US CDC Growth Reference & US CDC Growth Reference1.8cm)';
      keyIngredient = 'US CDC Growth Reference 1000mg + Magnesium + US CDC Growth Reference Protein';
    }

    return [
      {
        badge: `US CDC Growth Reference 1/6 · US CDC Growth Referenced dUS CDC Growth ReferenceWeight US CDC Growth Reference`,
        title: `${dobDisplay} (US CDC Growth Reference ${exactMonths} mos) ${genderKo}, US CDC Growth Reference${height}cm)US CDC Growth Reference Weight(${weight}kg) US CDC Growth Reference`,
        body: `US CDC Growth Reference ${ageYears} yrsUS CDC Growth Reference 1US CDC Growth Reference 12US CDC Growth Reference <strong>4.2~5.5cm</strong>, WeightUS CDC Growth Reference <strong>2.5~3.8kg</strong> US CDC Growth Reference. US CDC Growth Reference <strong>${height}cm / ${weight}kg</strong>US CDC Growth Reference ${exactMonths} mos dUS CDC Growth Reference US CDC / KDCA(KDCA) US CDC Growth Reference.`,
        highlight: `US CDC Growth Reference Mid-Parental Target Height(Tanner MPH): ${mph}cm (±8.5cm US CDC Growth Reference Sleep·Nutrition·US CDC Growth Reference yrs US CDC Growth Reference 17cm US CDC Growth Reference`
      },
      {
        badge: `US CDC Growth Reference 2/6 · US CDC Growth Reference Weight & US CDC Growth ReferenceBMI) US CDC Growth Reference`,
        title: `US CDC Growth Reference 'Weight US CDC Growth Reference'US CDC Growth Reference`,
        body: `US CDC Growth Reference${height}cm) US CDC Growth Reference Weight(${weight}kg)US CDC Growth ReferenceWeightUS CDC Growth ReferenceWeight(US CDC Growth Reference Growth Plate US CDC Growth Reference. <strong>US CDC Growth Reference WeightUS CDC Growth Reference 6 mos US CDC Growth Reference Weight</strong>US CDC Growth Reference.`,
        highlight: `US CDC Growth Reference [Weight 3US CDC Growth Reference]US CDC Growth Reference!`
      },
      {
        badge: `US CDC Growth Reference 3/6 · US CDC Growth Reference ${ageYears} yrs Growth Plate US CDC Growth Reference & US CDC Growth Reference`,
        title: `US CDC Growth Reference Growth PlateUS CDC Growth Reference ${closureAge} yrsUS CDC Growth Reference  hrsUS CDC Growth Reference ${remYearsMin}~${remYearsMax}US CDC Growth Reference`,
        body: `Growth Plate US CDC Growth Reference Growth PlateUS CDC Growth Reference${genderKo} US CDC Growth Reference ${closureAge} yrs)US CDC Growth Reference  hrsUS CDC Growth Reference. US CDC Growth Reference ${ageYears} yrsUS CDC Growth Reference <strong>[${growthStageFocus}]</strong>US CDC Growth Reference.`,
        highlight: `US CDC Growth Reference${habits.length}US CDC Growth Reference.`
      },
      {
        badge: `US CDC Growth Reference 4/6 · Weight(${weight}kg) US CDC Growth ReferenceProtein·Nutrition US CDC Growth Reference`,
        title: `US CDC Growth Reference WeightUS CDC Growth Reference NutritionUS CDC Growth Reference`,
        body: `US CDC Growth Reference ${weight}kg ${genderKo}US CDC Growth ReferencedUS CDC Growth Reference22%) US CDC Growth Reference 45%US CDC Growth Reference <strong>[${keyIngredient}]</strong>US CDC Growth Reference.`,
        highlight: `US CDC Growth ReferencePMID:25374566) US CDC Growth Reference NutritionUS CDC Growth ReferenceKDRIs)US CDC Growth Reference.`
      },
      {
        badge: `US CDC Growth Reference 5/6 · US CDC Growth Reference 10US CDC Growth Reference Growth Hormone (HGH) & US CDC Growth Reference1.8cm US CDC Growth Reference`,
        title: `US CDC Growth Reference 10US CDC Growth Reference Slow-Wave Sleep (N3)(SWS) 90US CDC Growth Reference Growth Hormone (HGH)US CDC Growth Reference 65%US CDC Growth Reference`,
        body: `US CDC Growth Reference 2 hrs US CDC Growth Reference Growth Hormone (HGH)US CDC Growth Reference <strong>-52% US CDC Growth Reference</strong>US CDC Growth Reference<strong>US CDC Growth Reference 30US CDC Growth Reference×3 yrsUS CDC Growth Reference  ptsUS CDC Growth Reference Exercise</strong>US CDC Growth Reference <strong>+1.8cm</strong> US CDC Growth Reference.`,
        highlight: `US CDC Growth Reference 4US CDC Growth Reference  hrsUS CDC Growth Reference.`
      },
      {
        badge: `US CDC Growth Reference 6/6 · 1:1 US CDC Growth ReferenceWeight·Bone Age) US CDC Growth Reference Report US CDC Growth Reference`,
        title: `US CDC Growth Reference 3US CDC Growth Reference & Weight AssessmentUS CDC Growth Reference!`,
        body: `US CDC / KDCA US CDC Growth ReferenceWeight US CDC Growth ReferenceMPH) vs US CDC Growth Reference vs US CDC Growth Reference 3US CDC Growth Reference<strong>US CDC Growth Reference Growth Plate US CDC Growth Reference</strong>US CDC Growth Reference.`,
        highlight: `US CDC Growth Reference [US CDC Growth Reference & Weight US CDC Growth Reference Assessment US CDC Growth Reference]US CDC Growth Reference yrsUS CDC Growth Reference!`
      }
    ];
  }

  /**
   * Mode-Specific Interactive 1-Second O/X Parent Fact Quizzes
   */
  const GROWTH_OX_QUIZZES = [
    {
      q: 'Q1. Do parent genetics strictly determine 70%+ of a child\'s final adult height with no room for change?',
      answer: 'X',
      explain: 'FALSE (X)! Longitudinal twin studies (CDC/NIH) show epigenetic & lifestyle factors—10 PM Slow-Wave Sleep (GH surge), bioavailable Calcium Citrate + D3/K2, and spinal decompression—shift final adult stature by up to ±3.3 in (±8.5 cm, a 6.7 in total window).'
    },
    {
      q: 'Q2. Can rapid weight or body-fat gain relative to height cause growth plates to fuse earlier?',
      answer: 'O',
      explain: 'TRUE (⭕)! Excess adipose tissue secretes Leptin and increases aromatase activity, which accelerates bone-age maturation and premature epiphyseal plate fusion (AAP / Pediatric Endocrine Society guidelines).'
    },
    {
      q: 'Q3. Do all children\'s calcium supplements (Carbonate vs. Citrate/MCHA) have the exact same absorption rate?',
      answer: 'X',
      explain: 'FALSE (X)! Standard Calcium Carbonate requires high stomach acid (~22% absorption) and often causes constipation, whereas Calcium Citrate & MCHA deliver ~45% bioavailability (2.05x higher) without GI distress (NIH ODS).'
    },
    {
      q: 'Q4. Does drinking sweet milk or eating fruit/carbs within 1 hour before bed help a child grow taller overnight?',
      answer: 'X',
      explain: 'FALSE (X)! Consuming sugars or refined carbs within 2–3 hours before sleep spikes insulin and somatostatin, suppressing the 10 PM–2 AM nocturnal Growth Hormone (GH) peak by up to -52% (JCEM clinical studies).'
    }
  ];

  const LEARNING_OX_QUIZZES = [
    {
      q: 'Q1. Does closing the book and explaining what you learned for 3 minutes (Active Recall) beat re-reading 4 times?',
      answer: 'O',
      explain: 'TRUE (⭕)! Roediger & Karpicke (2006, WashU) proved that blank-page retrieval practice (Active Recall / Feynman method) boosts 1-week long-term memory retention 2.4x (from 48% to 92%) compared to passive re-reading.'
    },
    {
      q: 'Q2. If a child scores 100% on basic arithmetic but misses math word problems, should they drill more calculation worksheets?',
      answer: 'X',
      explain: 'FALSE (X)! Getting stuck on multi-step word problems is caused by prefrontal working-memory overload, not arithmetic weakness. Externalizing conditions via Visual Bar Modeling (Singapore Math) offloads working memory.'
    },
    {
      q: 'Q3. Does hands-on 3D block & geometric manipulative play in early/middle childhood boost later STEM & spatial math scores?',
      answer: 'O',
      explain: 'TRUE (⭕)! Over 30% of the motor-sensory cortex maps to the fingertips; rotating and assembling 3D spatial blocks directly myelinates intraparietal sulcus (IPS) mental-rotation circuits critical for geometry and physics.'
    },
    {
      q: 'Q4. Does cutting back on sleep to study late at night help the brain retain daytime lessons longer?',
      answer: 'X',
      explain: 'FALSE (X)! Daytime short-term memories stored in the hippocampus are transferred and consolidated into the neocortex during 10 PM–2 AM deep Slow-Wave Sleep (Diekelmann & Born, 2010, Nature Reviews Neuroscience).'
    }
  ];

  const PARENT_OX_QUIZZES = GROWTH_OX_QUIZZES;

  const SIX_STAGES_GROWTH = [
    {
      step: 1,
      rangeSec: [0, 10],
      titleKo: 'Step 1/6 · US CDC Growth Referenced dUS CDC Growth Reference US CDC / KDCA(KDCA) US CDC Growth ReferenceWeight US CDC Growth Reference...',
      titleEn: 'Step 1/6 · Computing Exact Chronological Age & US CDC 2000 / WHO LMS Height/Weight Percentiles...'
    },
    {
      step: 2,
      rangeSec: [10, 20],
      titleKo: 'Step 2/6 · US CDC Growth Reference Weight(BMI) US CDC Growth Reference Growth Plate US CDC Growth Reference...',
      titleEn: 'Step 2/6 · Evaluating Height-Adjusted Optimal Weight & Epiphyseal Growth Window...'
    },
    {
      step: 3,
      rangeSec: [20, 30],
      titleKo: 'Step 3/6 · US CDC Growth Reference Mid-Parental Target Height(MPH) US CDC Growth Reference vs US CDC Growth Reference 3US CDC Growth Reference...',
      titleEn: 'Step 3/6 · Simulating Tanner MPH & 3-Stage Adult Height Trajectories...'
    },
    {
      step: 4,
      rangeSec: [30, 40],
      titleKo: 'Step 4/6 · US CDC Growth Reference 10US CDC Growth Reference Growth Hormone (HGH)(GH-IGF1) US CDC Growth Reference Weight US CDC Growth ReferenceProtein US CDC Growth Reference...',
      titleEn: 'Step 4/6 · Modeling 24-Hour GH-IGF1 Secretion & Weight-Based Nutrient Targets...'
    },
    {
      step: 5,
      rangeSec: [40, 50],
      titleKo: 'Step 5/6 · US CDC Growth Reference1.8cm) US CDC Growth Reference...',
      titleEn: 'Step 5/6 · Designing Spinal Decompression (+1.8cm) & Growth Plate Exercise Protocol...'
    },
    {
      step: 6,
      rangeSec: [50, 60],
      titleKo: 'Step 6/6 · US CDC Growth Reference 1:1 US CDC Growth ReferenceWeight·Bone Age) US CDC Growth Reference Report US CDC Growth Reference...',
      titleEn: 'Step 6/6 · Finalizing Personalized Physical Growth & Weight Balance Master Report...'
    }
  ];

  const SIX_STAGES_LEARNING = [
    {
      step: 1,
      rangeSec: [0, 10],
      titleKo: 'Step 1/6 · US CDC Growth Referenced US CDC Growth Reference 5US CDC Growth ReferenceLQ) US CDC Growth Reference...',
      titleEn: 'Step 1/6 · Mapping Neuro-Developmental Window & 5-Axis Learning Quotient (LQ)...'
    },
    {
      step: 2,
      rangeSec: [10, 20],
      titleKo: 'Step 2/6 · US CDC Growth Reference 5US CDC Growth Reference pts(1US CDC Growth Reference3US CDC Growth Reference...',
      titleEn: 'Step 2/6 · Analyzing Top 3 Cognitive Strengths & Top 3 Study Bottlenecks...'
    },
    {
      step: 3,
      rangeSec: [20, 30],
      titleKo: 'Step 3/6 · US CDC Growth Referenced US CDC Growth Reference 6 mos US CDC Growth Reference...',
      titleEn: 'Step 3/6 · Simulating 6-Month Focus Duration & Long-Term Memory Retention Curve...'
    },
    {
      step: 4,
      rangeSec: [30, 40],
      titleKo: 'Step 4/6 · US CDC Growth Reference pts US CDC Growth Reference TOP 3 US CDC Growth Reference 3US CDC Growth Reference...',
      titleEn: 'Step 4/6 · Matching Future Career Pathways & 3-Year Curriculum Roadmap...'
    },
    {
      step: 5,
      rangeSec: [40, 50],
      titleKo: 'Step 5/6 · US CDC Growth Reference 10US CDC Growth Reference→US CDC Growth Reference Sleep US CDC Growth Reference  hrsUS CDC Growth Reference...',
      titleEn: 'Step 5/6 · Building Active Recall & SWS Hippocampal Memory Consolidation Schedule...'
    },
    {
      step: 6,
      rangeSec: [50, 60],
      titleKo: 'Step 6/6 · US CDC Growth Reference 1:1 US CDC Growth Reference & US CDC Growth Reference Report US CDC Growth Reference...',
      titleEn: 'Step 6/6 · Finalizing Personalized Brain & Learning Visual Master Report...'
    }
  ];

  const SIX_STAGES_60S = SIX_STAGES_GROWTH;

  /**
   * Renders the interactive waiting content studio inside #analysis-theatre-content
   */
  function renderTheatreSubView(profile, elapsedSec, durationMs) {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('analysis-theatre-content');
    if (!container) return;

    const isLearning = isLearningModeActive(profile);
    const activeQuizzes = isLearning ? LEARNING_OX_QUIZZES : GROWTH_OX_QUIZZES;
    const cards = buildChildWaitingCards(profile);
    const cardIdx = Math.min(cards.length - 1, Math.max(0, state.activeCardIndex));
    const currentCard = cards[cardIdx];

    const quizIdx = state.activeQuizIndex % activeQuizzes.length;
    const currentQuiz = activeQuizzes[quizIdx];
    const remainingSec = Math.max(0, Math.ceil((durationMs - elapsedSec * 1000) / 1000));

    // Update top countdown badge if present
    const isEnSub = isGlobalEnMode();
    const countdownEl = document.getElementById('analysis-countdown-badge');
    if (countdownEl) {
      countdownEl.textContent = isEnSub
        ? (isLearning ? `Brain LQ Clinical Scan · ~${remainingSec}s remaining` : `Pediatric Auxology Scan · ~${remainingSec}s remaining`)
        : (isLearning ? `US CDC Growth Reference ${remainingSec}US CDC Growth Reference` : `US CDC Growth Reference ${remainingSec}US CDC Growth Reference`);
    }

    // Update 6 step pills proportionally to durationMs (e.g. 2.5s per step for 15s total)
    const stageLenSec = Math.max(0.5, (durationMs / 1000) / 6);
    const activeStageIdx = Math.min(5, Math.floor(elapsedSec / stageLenSec));
    for (let i = 0; i < 6; i++) {
      const pill = document.getElementById(`theatre-stage-pill-${i + 1}`);
      if (pill) {
        if (i < activeStageIdx) {
          pill.style.background = '#EFF6FF';
          pill.style.borderColor = '#1D4ED8';
          pill.style.color = '#1D4ED8';
          pill.textContent = `Step ${i + 1}`;
        } else if (i === activeStageIdx) {
          pill.style.background = '#EFF6FF';
          pill.style.borderColor = '#3B82F6';
          pill.style.color = '#60A5FA';
          pill.textContent = isEnSub ? `Step ${i + 1} Active` : `Step ${i + 1} US CDC Growth Reference`;
        } else {
          pill.style.background = 'rgba(255, 255, 255, 0.04)';
          pill.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          pill.style.color = '#64748B';
          pill.textContent = `Step ${i + 1}`;
        }
      }
    }

    const cardBodyEl = document.getElementById('theatre-dynamic-card');
    if (cardBodyEl && cardBodyEl.getAttribute('data-card-idx') !== String(cardIdx)) {
      cardBodyEl.setAttribute('data-card-idx', String(cardIdx));
      cardBodyEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.55rem; flex-wrap: wrap;">
          <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.78rem; font-weight: 800; padding: 0.22rem 0.65rem; border-radius: 9999px; border: 1px solid #BFDBFE;">
            ${currentCard.badge}
          </span>
          <div style="display: flex; gap: 0.35rem;">
            <button type="button" id="btn-theatre-prev-card" style="background: #F8FAFC; border: 1px solid #BFDBFE; color: #0F172A; border-radius: 6px; padding: 0.18rem 0.55rem; font-size: 0.75rem; font-weight: 700; cursor: pointer;">${isEnSub ? '◀ Prev' : '◀ US CDC Growth Reference'}</button>
            <button type="button" id="btn-theatre-next-card" style="background: #FFFFFF; border: 1px solid #FFFFFF; color: #000000; border-radius: 6px; padding: 0.18rem 0.55rem; font-size: 0.75rem; font-weight: 800; cursor: pointer;">${isEnSub ? 'Next ▶' : 'US CDC Growth Reference ▶'}</button>
          </div>
        </div>
        <h4 style="font-size: 1.05rem; font-weight: 900; color: #0F172A; margin: 0 0 0.5rem 0; line-height: 1.4;">
          ${currentCard.title}
        </h4>
        <p style="font-size: 0.88rem; color: #475569; line-height: 1.58; margin: 0 0 0.65rem 0;">
          ${currentCard.body}
        </p>
        <div style="background: #EFF6FF; border-left: 3.5px solid #93C5FD; padding: 0.55rem 0.75rem; border-radius: 6px; font-size: 0.81rem; color: #1D4ED8; font-weight: 800;">
          ${currentCard.highlight}
        </div>
      `;

      const prevCardBtn = document.getElementById('btn-theatre-prev-card');
      const nextCardBtn = document.getElementById('btn-theatre-next-card');
      if (prevCardBtn) {
        prevCardBtn.onclick = () => {
          state.activeCardIndex = (state.activeCardIndex - 1 + cards.length) % cards.length;
          triggerHaptic('tick', cardBodyEl);
          cardBodyEl.setAttribute('data-card-idx', '-1');
          renderTheatreSubView(profile, elapsedSec, durationMs);
        };
      }
      if (nextCardBtn) {
        nextCardBtn.onclick = () => {
          state.activeCardIndex = (state.activeCardIndex + 1) % cards.length;
          triggerHaptic('tick', cardBodyEl);
          cardBodyEl.setAttribute('data-card-idx', '-1');
          renderTheatreSubView(profile, elapsedSec, durationMs);
        };
      }
    }

    const quizBoxEl = document.getElementById('theatre-ox-quiz-box');
    const quizCacheKey = `${isLearning ? 'L' : 'G'}-${quizIdx}-${state.quizAnswered}`;
    if (quizBoxEl && quizBoxEl.getAttribute('data-quiz-idx') !== quizCacheKey) {
      quizBoxEl.setAttribute('data-quiz-idx', quizCacheKey);
      const enQuizQ = isLearning
        ? 'Fact Check: Does 3-minute blank-sheet active recall retain 2.4x more long-term memory than re-reading 4 times?'
        : 'Fact Check: Do parent genetics strictly determine 70%+ of a child\'s final adult height with no room for change?';
      const enQuizExp = isLearning
        ? 'TRUE (O)! Roediger & Karpicke (2006) proved that active recall boosts 1-week retention from 48% to 92%.'
        : 'FALSE (X)! Twin studies show sleep GH, bioavailable calcium/D3/K2, and posture control up to ±3.3 in (±8.5 cm) of final height.';
      quizBoxEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
          <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">
            ${isEnSub ? ((isLearning ? "Brain & Learning Neuroscience" : "Pediatric Growth & Auxology") + " 1-Sec Clinical Fact Check (" + (quizIdx + 1) + "/" + activeQuizzes.length + ")") : ((isLearning ? "US CDC Growth Reference" : "US CDC Growth ReferenceWeight US CDC Growth Reference") + " 1US CDC Growth Reference O/X US CDC Growth Reference" + (quizIdx + 1) + "/" + activeQuizzes.length + ")")}
          </span>
          <button type="button" id="btn-theatre-next-quiz" style="background: transparent; border: none; color: #475569; font-size: 0.74rem; font-weight: 700; cursor: pointer; text-decoration: underline;">${isEnSub ? 'Next Fact ↻' : 'US CDC Growth Reference ↻'}</button>
        </div>
        <div style="font-size: 0.92rem; font-weight: 900; color: #0F172A; margin-bottom: 0.65rem; line-height: 1.4;">
          ${currentQuiz.q}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;">
          <button type="button" id="btn-ox-o" style="padding: 0.6rem; border-radius: 10px; font-size: 0.9rem; font-weight: 800; cursor: pointer; border: 1.5px solid #93C5FD; background: #EFF6FF; color: #1D4ED8;">
            ${isEnSub ? '⭕ True (O)' : '⭕ US CDC Growth ReferenceO)'}
          </button>
          <button type="button" id="btn-ox-x" style="padding: 0.6rem; border-radius: 10px; font-size: 0.9rem; font-weight: 800; cursor: pointer; border: 1.5px solid #93C5FD; background: #EFF6FF; color: #1D4ED8;">
            ${isEnSub ? '✕ False (X)' : 'US CDC Growth ReferenceX)'}
          </button>
        </div>
        <div id="theatre-ox-answer" style="display: ${state.quizAnswered ? 'block' : 'none'}; margin-top: 0.6rem; padding: 0.65rem 0.8rem; background: #FFFFFF; border: 1px solid #93C5FD; border-radius: 8px; font-size: 0.8rem; color: #0F172A; line-height: 1.48;">
          ${currentQuiz.explain}
        </div>
      `;

      const handleAnswer = (pick) => {
        state.quizAnswered = true;
        const isCorrect = pick === currentQuiz.answer;
        triggerHaptic(isCorrect ? 'quiz_correct' : 'quiz_wrong', quizBoxEl);
        quizBoxEl.setAttribute('data-quiz-idx', '-1');
        renderTheatreSubView(profile, elapsedSec, durationMs);
      };

      const btnO = document.getElementById('btn-ox-o');
      const btnX = document.getElementById('btn-ox-x');
      const btnNextQ = document.getElementById('btn-theatre-next-quiz');
      if (btnO) btnO.onclick = () => handleAnswer('O');
      if (btnX) btnX.onclick = () => handleAnswer('X');
      if (btnNextQ) {
        btnNextQ.onclick = () => {
          state.activeQuizIndex = (state.activeQuizIndex + 1) % activeQuizzes.length;
          state.quizAnswered = false;
          triggerHaptic('tick', quizBoxEl);
          quizBoxEl.setAttribute('data-quiz-idx', '-1');
          renderTheatreSubView(profile, elapsedSec, durationMs);
        };
      }
    }
  }

  /**
   * Launches the 60-Second Personalized Analysis & Parent Content Theatre
   * @param {Object} profile - Child profile
   * @param {Object} options - { durationMs: 60000, isEn: false }
   * @param {Function} onComplete - Callback when scan finishes or is skipped
   */
  function startPersonalizedAnalysisTheatre(profile = {}, options = {}, onComplete) {
    if (state.activeTheatreTimer) {
      clearInterval(state.activeTheatreTimer);
      state.activeTheatreTimer = null;
    }

    const durationMs = typeof options.durationMs === 'number' ? options.durationMs : 4000;
    const overlay = typeof document !== 'undefined' ? document.getElementById('analysis-overlay') : null;
    const titleEl = typeof document !== 'undefined' ? document.getElementById('analysis-title') : null;
    const descEl = typeof document !== 'undefined' ? document.getElementById('analysis-desc') : null;
    const fillEl = typeof document !== 'undefined' ? document.getElementById('analysis-bar-fill') : null;
    const isEn = typeof document !== 'undefined' && document.documentElement.lang === 'en';

    state.activeCardIndex = 0;
    state.activeQuizIndex = 0;
    state.quizAnswered = false;

    if (overlay) {
      overlay.style.display = 'flex';
      overlay.setAttribute('aria-hidden', 'false');

      // Inject Theatre Containers if not already present inside .analysis-modal
      const modal = overlay.querySelector('.analysis-modal');
      if (modal && !document.getElementById('analysis-theatre-content')) {
        const theatreDiv = document.createElement('div');
        theatreDiv.id = 'analysis-theatre-content';
        theatreDiv.style.cssText = 'margin-top: 1rem; text-align: left; width: 100%;';
        theatreDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.65rem; flex-wrap: wrap;">
            <span id="analysis-countdown-badge" style="font-size: 0.8rem; font-weight: 800; color: #1D4ED8; background: #EFF6FF; border: 1px solid #BFDBFE; padding: 0.22rem 0.65rem; border-radius: 9999px;">
              ${isEn ? 'Pediatric Auxology Scan · ~4s remaining' : 'US CDC Growth Reference 4US CDC Growth Reference'}
            </span>
            <button type="button" id="btn-haptic-toggle" style="font-size: 0.75rem; font-weight: 700; color: #1D4ED8; background: #EFF6FF; border: 1px solid #BFDBFE; padding: 0.2rem 0.6rem; border-radius: 9999px; cursor: pointer;">
              ${isEn ? 'Haptic ON' : 'US CDC Growth Reference ON'}
            </button>
          </div>
          <div id="theatre-stage-pills" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.3rem; margin-bottom: 0.85rem;">
            ${[1, 2, 3, 4, 5, 6].map(n => `<div id="theatre-stage-pill-${n}" style="font-size: 0.68rem; font-weight: 800; text-align: center; padding: 0.25rem 0.15rem; border-radius: 6px; border: 1px solid #BFDBFE;">Step ${n}</div>`).join('')}
          </div>
          <div id="theatre-dynamic-card" data-card-idx="-1" style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 14px; padding: 1rem; margin-bottom: 0.85rem;"></div>
          <div id="theatre-ox-quiz-box" data-quiz-idx="-1" style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 14px; padding: 0.85rem;"></div>
        `;
        const skipBtn = document.getElementById('btn-skip-scan');
        if (skipBtn && skipBtn.parentNode === modal) {
          modal.insertBefore(theatreDiv, skipBtn);
        } else {
          modal.appendChild(theatreDiv);
        }

        const hapticBtn = document.getElementById('btn-haptic-toggle');
        if (hapticBtn) {
          hapticBtn.onclick = () => {
            state.hapticEnabled = !state.hapticEnabled;
            hapticBtn.textContent = state.hapticEnabled ? (isGlobalEnMode() ? 'Haptic ON' : 'US CDC Growth Reference ON') : (isGlobalEnMode() ? 'Haptic OFF' : 'US CDC Growth Reference OFF');
            hapticBtn.style.opacity = state.hapticEnabled ? '1' : '0.6';
            if (state.hapticEnabled) triggerHaptic('tick', hapticBtn);
          };
        }
      }
    }

    if (fillEl) fillEl.style.width = '2%';

    let currentStageIdx = -1;
    let lastCardSwitchSec = 0;
    const startTime = Date.now();
    const isLearning = isLearningModeActive(profile);
    const activeStages = isLearning ? SIX_STAGES_LEARNING : SIX_STAGES_GROWTH;

    // Force fresh card & quiz render when mode changes
    const existingCardEl = typeof document !== 'undefined' ? document.getElementById('theatre-dynamic-card') : null;
    if (existingCardEl) existingCardEl.setAttribute('data-card-idx', '-1');
    const existingQuizEl = typeof document !== 'undefined' ? document.getElementById('theatre-ox-quiz-box') : null;
    if (existingQuizEl) existingQuizEl.setAttribute('data-quiz-idx', '-1');

    triggerHaptic('step', overlay);
    renderTheatreSubView(profile, 0, durationMs);

    // Stage 1 initial typewriter
    if (titleEl) {
      typewriteText(titleEl, isEn ? activeStages[0].titleEn : activeStages[0].titleKo, { charInterval: 28 });
    }
    if (descEl) {
      descEl.textContent = isLearning
        ? (isEn ? `Cross-referencing ${profile.birthDateStr || ''} (${profile.exactMonths || profile.ageMonths} mos, ${profile.gender === 'girl' ? 'Female' : 'Male'}) prefrontal executive & cognitive metrics against 117 peer-reviewed neuroscience papers.` : `${profile.birthDateStr || ''} (US CDC Growth Reference ${profile.exactMonths || profile.ageMonths} mos) ${profile.gender === 'girl' ? 'Girl' : 'Boy'}US CDC Growth Reference 117US CDC Growth Reference DBUS CDC Growth Reference 1:1 US CDC Growth Reference.`)
        : (isEn ? `Cross-referencing ${profile.birthDateStr || ''} (${profile.exactMonths || profile.ageMonths} mos, ${profile.gender === 'girl' ? 'Female' : 'Male'}) height, weight & epiphyseal plate data against US CDC 2000, WHO & 3,714 pediatric endocrine papers.` : `${profile.birthDateStr || ''} (US CDC Growth Reference ${profile.exactMonths || profile.ageMonths} mos) ${profile.gender === 'girl' ? 'Girl' : 'Boy'}US CDC Growth ReferenceWeight·Growth Plate US CDC Growth Reference 117US CDC Growth Reference DB US CDC Growth Reference 1:1 US CDC Growth Reference.`);
    }
    currentStageIdx = 0;

    state.activeTheatreTimer = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const elapsedSec = elapsedMs / 1000;
      const progress = Math.min(100, Math.round((elapsedMs / durationMs) * 100));

      if (fillEl) fillEl.style.width = `${progress}%`;

      // Stage transitions every 10 seconds (or proportional to durationMs)
      const stageDurationSec = (durationMs / 1000) / 6;
      const newStageIdx = Math.min(5, Math.floor(elapsedSec / stageDurationSec));
      if (newStageIdx !== currentStageIdx) {
        currentStageIdx = newStageIdx;
        const st = activeStages[currentStageIdx];
        triggerHaptic('step', titleEl);
        if (titleEl && st) {
          typewriteText(titleEl, isEn ? st.titleEn : st.titleKo, { charInterval: 28 });
        }
      }

      // Auto-rotate waiting cards every 3.5 seconds (for 15s total duration)
      if (elapsedSec - lastCardSwitchSec >= 3.5) {
        lastCardSwitchSec = elapsedSec;
        state.activeCardIndex = (state.activeCardIndex + 1) % 6;
        const cardEl = typeof document !== 'undefined' ? document.getElementById('theatre-dynamic-card') : null;
        if (cardEl) cardEl.setAttribute('data-card-idx', '-1');
      }

      renderTheatreSubView(profile, elapsedSec, durationMs);

      if (elapsedMs >= durationMs) {
        clearInterval(state.activeTheatreTimer);
        state.activeTheatreTimer = null;
        triggerHaptic('complete', overlay);
        if (typeof onComplete === 'function') onComplete();
      }
    }, 100);

    const skipBtn = typeof document !== 'undefined' ? document.getElementById('btn-skip-scan') : null;
    if (skipBtn) {
      skipBtn.onclick = () => {
        if (state.activeTheatreTimer) {
          clearInterval(state.activeTheatreTimer);
          state.activeTheatreTimer = null;
        }
        if (state.activeTypewriterTimer) {
          clearInterval(state.activeTypewriterTimer);
          state.activeTypewriterTimer = null;
        }
        triggerHaptic('complete', skipBtn);
        if (typeof onComplete === 'function') onComplete();
      };
    }
  }

  function stopTheatre() {
    if (state.activeTheatreTimer) {
      clearInterval(state.activeTheatreTimer);
      state.activeTheatreTimer = null;
    }
    if (state.activeTypewriterTimer) {
      clearInterval(state.activeTypewriterTimer);
      state.activeTypewriterTimer = null;
    }
  }

  const TallerHapticEngine = {
    state,
    triggerHaptic,
    typewriteText,
    buildChildWaitingCards,
    PARENT_OX_QUIZZES,
    SIX_STAGES_60S,
    startPersonalizedAnalysisTheatre,
    stopTheatre
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TallerHapticEngine;
  }
  global.TallerHapticEngine = TallerHapticEngine;
  global.KidsFitHapticEngine = TallerHapticEngine;

})(typeof window !== 'undefined' ? window : global);
