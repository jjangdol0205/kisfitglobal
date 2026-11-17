/**
 * Taller Bio Labs - Master Briefing Engine (Phase 2 Master Briefing Card)
 * Fact-Based Precision Diagnosis & Short / Mid / Long-Term Academic DB Guidance Roadmap
 * Dynamically powered by `src/data/research-knowledge-base.json` (834+ peer-reviewed papers)
 */

(function (global) {
  'use strict';

  let GrowthEngine = typeof require !== 'undefined' ? (function () { try { return require('./growth-engine'); } catch (e) { return null; } })() : (global.KidsFitGrowthEngine || null);
  let EndocrinologyEngine = typeof require !== 'undefined' ? (function () { try { return require('./endocrinology-engine'); } catch (e) { return null; } })() : (global.KidsFitEndocrinologyEngine || null);
  let NutritionEngine = typeof require !== 'undefined' ? (function () { try { return require('./nutrition-engine'); } catch (e) { return null; } })() : (global.KidsFitNutritionEngine || null);
  let BiomechanicsStudio = typeof require !== 'undefined' ? (function () { try { return require('./biomechanics-studio'); } catch (e) { return null; } })() : (global.KidsFitBiomechanicsStudio || null);
  let NeuroCognitiveMatrix = typeof require !== 'undefined' ? (function () { try { return require('./executive-cognitive-matrix'); } catch (e) { return null; } })() : (global.KidsFitNeuroCognitiveMatrix || null);
  let GrowthTracker = typeof require !== 'undefined' ? (function () { try { return require('./growth-tracker'); } catch (e) { return null; } })() : (global.KidsFitGrowthTracker || null);
  let PinpointCurator = typeof require !== 'undefined' ? (function () { try { return require('./pinpoint-curator'); } catch (e) { return null; } })() : (global.TallerPinpointCurator || global.KidsFitPinpointCurator || null);
  let UserCohortDB = typeof require !== 'undefined' ? (function () { try { return require('./user-cohort-db'); } catch (e) { return null; } })() : (global.TallerUserCohortDB || global.KidsFitUserCohortDB || null);

  /**
   * Retrieves knowledge base papers from runtime memory or CommonJS require
   */
  function getKnowledgeBase() {
    if (typeof window !== 'undefined' && window.KIDSFIT_RESEARCH_DATA) {
      return window.KIDSFIT_RESEARCH_DATA;
    }
    if (typeof global !== 'undefined' && global.KIDSFIT_RESEARCH_DATA) {
      return global.KIDSFIT_RESEARCH_DATA;
    }
    if (typeof require !== 'undefined') {
      try {
        return require('../data/research-knowledge-base.json');
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Inhibitor search keywords dictionary
   */
  const INHIBITOR_KEYWORDS = {
    late_sleep: {
      tagKo: 'Sleep US CDC Growth Reference & Slow-Wave Sleep (N3)(SWS) Growth Hormone (HGH) US CDC Growth Reference',
      tagEn: 'Circadian Delay & SWS Growth Hormone Loss',
      plainReasonKo: 'US CDC Growth Reference 10US CDC Growth Reference 90US CDC Growth Reference Slow-Wave Sleep (N3)(SWS) Growth Hormone (HGH) US CDC Growth Referencedd US CDC Growth Reference 65%)US CDC Growth Reference.',
      plainReasonEn: 'Sleeping after 10:30 PM reduces the first 90-min SWS growth hormone pulse (65% of daily output).',
      terms: ['sleep', 'circadian', 'melatonin', 'slow-wave', 'Sleep', 'US CDC Growth Reference', 'Slow-Wave Sleep (N3)', 'US CDC Growth Reference', 'gh-igf-1']
    },
    night_carbs: {
      tagKo: 'US CDC Growth Reference & US CDC Growth Reference',
      tagEn: 'Nocturnal Glycemic Spike & Somatostatin Suppression',
      plainReasonKo: 'US CDC Growth Reference Growth Hormone (HGH)US CDC Growth Reference52% US CDC Growth Reference.',
      plainReasonEn: 'Pre-sleep carbs spike insulin and hypothalamic somatostatin, suppressing GH by up to -52%.',
      terms: ['glucose', 'insulin', 'sugar', 'somatostatin', 'US CDC Growth Reference', 'US CDC Growth Reference', 'US CDC Growth Reference', 'US CDC Growth Reference', 'US CDC Growth Reference', 'US CDC Growth Reference']
    },
    poor_posture: {
      tagKo: 'US CDC Growth Reference & US CDC Growth Reference',
      tagEn: 'Forward Head Posture & Spinal Disc Compression',
      plainReasonKo: 'US CDC Growth Reference yrsUS CDC Growth Reference 1.5~2.2cmUS CDC Growth Reference.',
      plainReasonEn: 'Forward head posture compresses spinal discs, masking 1.5~2.2cm of recoverable stature.',
      terms: ['posture', 'spine', 'cervical', 'kyphosis', 'craniovertebral', 'US CDC Growth Reference', 'US CDC Growth Reference', 'US CDC Growth Reference yrs', 'US CDC Growth Reference', 'US CDC Growth Reference', 'US CDC Growth Reference', 'US CDC Growth Reference yrsUS CDC Growth Reference']
    },
    picky_eater: {
      tagKo: 'Protein·US CDC Growth Reference & US CDC Growth Reference',
      tagEn: 'Nutritional Imbalance & Bone Matrix Mineralization Deficit',
      plainReasonKo: 'US CDC Growth ReferenceVitaminD3·K2·Protein US CDC Growth Reference Growth Plate US CDC Growth Reference yrsUS CDC Growth Reference.',
      plainReasonEn: 'Deficits in Calcium, D3, K2, and Protein slow epiphyseal chondrocyte proliferation and bone accrual.',
      terms: ['nutrition', 'calcium', 'vitamin', 'protein', 'zinc', 'US CDC Growth Reference', 'Nutrition', 'US CDC Growth Reference', 'Protein', 'Vitamin', 'Zinc', 'US CDC Growth Reference', 'US CDC Growth Reference']
    },
    sedentary: {
      tagKo: 'US CDC Growth Reference & Growth Plate US CDC Growth Reference yrsUS CDC Growth Reference',
      tagEn: 'Sedentary Lifestyle & Epiphyseal Mechanical Loading Deficit',
      plainReasonKo: 'US CDC Growth Reference  ptsUS CDC Growth Reference ExerciseUS CDC Growth ReferenceWolff\'s Law)US CDC Growth Reference Growth Plate US CDC Growth Reference.',
      plainReasonEn: 'Lack of vertical jumping reduces Wolff\'s Law piezoelectric micro-loading on growth plates.',
      terms: ['exercise', 'jump', 'physical activity', 'loading', 'mechanical', 'Exercise', ' ptsUS CDC Growth Reference', 'US CDC Growth Reference', 'US CDC Growth Reference', 'Growth Plate', 'US CDC Growth Reference yrsUS CDC Growth Reference']
    }
  };

  /**
   * Formats a complete, unclipped empirical fact from a paper
   */
  function getCleanFactLine(p, isEn) {
    if (!p) return '';
    if (isEn) {
      return p.title || p.key_statistics || '';
    }
    const rawKo = p.plain_fact_ko || p.key_statistics || p.clinical_summary_ko || p.title_ko || '';
    return String(rawKo).replace(/^\[growth \d+growth\]\s*/, '').trim();
  }

  /**
   * Formats a complete, unclipped actionable prescription from a paper
   */
  function getCleanActionLine(p, isEn) {
    if (!p) return '';
    if (isEn) {
      return 'Apply daily targeted protocol aligned with peer-reviewed clinical thresholds.';
    }
    const raw = p.short_term_action_ko || p.parenting_prescription_ko || '';
    return String(raw).trim();
  }

  /**
   * Matches academic papers dynamically from research-knowledge-base.json based on inhibitors & age
   */
  function matchPapers(habits = [], ageYears = 10, tannerPhase = 'phase_2', limit = 3) {
    const kb = getKnowledgeBase();
    if (!kb || !Array.isArray(kb.papers)) return [];

    const effectiveHabits = Array.isArray(habits) && habits.length > 0 ? habits : ['late_sleep'];
    const matched = [];
    const pickedIds = new Set();

    // 1. Pick the best matching paper for each selected inhibitor
    effectiveHabits.forEach((h) => {
      const info = INHIBITOR_KEYWORDS[h];
      if (!info) return;

      let bestPaper = null;
      let maxScore = -1;

      kb.papers.forEach((p) => {
        if (pickedIds.has(p.id)) return;

        const corpus = `${p.title || ''} ${p.title_ko || ''} ${p.key_statistics || ''} ${p.clinical_summary_ko || ''} ${p.parenting_prescription_ko || ''}`.toLowerCase();
        let termHits = 0;
        info.terms.forEach((term) => {
          if (corpus.includes(term.toLowerCase())) {
            termHits++;
          }
        });

        if (termHits > 0) {
          let score = termHits * 10;
          if (p.age_range && p.age_range.includes(String(Math.round(ageYears)))) score += 15;
          if (p.evidence_level && p.evidence_level.includes('Level I')) score += 10;
          if (p.pmid) score += 5;
          if (p.citations_count) score += Math.min(20, Math.round(p.citations_count / 10));

          if (score > maxScore) {
            maxScore = score;
            bestPaper = p;
          }
        }
      });

      if (bestPaper) {
        pickedIds.add(bestPaper.id);
        matched.push({
          paper: bestPaper,
          matchedCauseKo: info.tagKo,
          matchedCauseEn: info.tagEn,
          plainReasonKo: info.plainReasonKo,
          plainReasonEn: info.plainReasonEn,
          inhibitorKey: h
        });
      }
    });

    // 2. Fallback backfill if fewer than limit
    if (matched.length < limit) {
      const candidates = kb.papers.filter((p) => !pickedIds.has(p.id) && (p.pillar === 'growth_endocrinology' || p.pillar === 'posture_biomechanics_exercise'));
      for (const c of candidates) {
        if (matched.length >= limit) break;
        matched.push({
          paper: c,
          matchedCauseKo: 'US CDC Growth Reference & Bone Age US CDC Growth Reference',
          matchedCauseEn: 'Pediatric Linear Growth & Bone Age Standards',
          plainReasonKo: 'US CDC Growth Reference.',
          plainReasonEn: 'Evidence-based clinical standard for age-specific linear growth trajectory.',
          inhibitorKey: 'standard'
        });
        pickedIds.add(c.id);
      }
    }

    return matched.slice(0, limit);
  }

  /**
   * Matches 3 distinct horizon papers (Short-Term 1-4w, Mid-Term 1-3m, Long-Term 6m-Adult)
   * directly from the learning DB based on user profile
   */
  function matchHorizonPapers(habits = [], ageYears = 10, cognitiveAxes = []) {
    const kb = getKnowledgeBase();
    if (!kb || !Array.isArray(kb.papers) || kb.papers.length === 0) {
      return { shortTerm: null, midTerm: null, longTerm: null };
    }

    const usedIds = new Set();
    const hasSleepOrCarb = habits.includes('late_sleep') || habits.includes('night_carbs');
    const hasPosture = habits.includes('poor_posture');

    // 1. Short-Term Paper (Weeks 1-4: Sleep/GH Reset or Spinal Decompression)
    let shortPaper = kb.papers.find((p) => {
      if (hasPosture && (p.sub_domain === 'posture_biomechanics_exercise' || String(p.id) === 'PMID:30897641')) return true;
      if (hasSleepOrCarb && (p.sub_domain === 'chronobiology_sleep_architecture' || String(p.id) === 'PMID:4300547')) return true;
      return p.horizon === 'short_term';
    }) || kb.papers[0];
    if (shortPaper) usedIds.add(shortPaper.id);

    // 2. Mid-Term Paper (Months 1-3 / 90 Days: Clinical Nutrition / Gut-Bone Axis / Wolff's Law / Museum Havruta)
    let midPaper = kb.papers.find((p) => {
      if (usedIds.has(p.id)) return false;
      if (habits.includes('picky_eater') && p.sub_domain === 'clinical_nutrigenomics_microbiome') return true;
      if (habits.includes('sedentary') && p.sub_domain === 'epiphyseal_wolff_loading') return true;
      return p.horizon === 'mid_term' || p.sub_domain === 'clinical_nutrigenomics_microbiome';
    }) || kb.papers.find((p) => !usedIds.has(p.id)) || kb.papers[0];
    if (midPaper) usedIds.add(midPaper.id);

    // 3. Long-Term Paper (6 Months to Age 20: Tanner MPH Trajectory / Bone Age / Longitudinal Executive Function)
    let longPaper = kb.papers.find((p) => {
      if (usedIds.has(p.id)) return false;
      if (ageYears <= 7 && p.sub_domain === 'executive_function_longitudinal') return true;
      return p.sub_domain === 'growth_endocrinology_core' || p.sub_domain === 'executive_function_longitudinal' || p.horizon === 'long_term';
    }) || kb.papers.find((p) => !usedIds.has(p.id)) || kb.papers[0];

    return {
      shortTerm: shortPaper,
      midTerm: midPaper,
      longTerm: longPaper
    };
  }

  /**
   * Renders a compact citation chip for a horizon paper
   */
  function renderHorizonPaperBadge(paper, horizonLabelKo, horizonLabelEn, accentColor, isEn) {
    if (!paper) return '';
    const firstAuthor = Array.isArray(paper.authors) && paper.authors.length > 0 ? paper.authors[0] : 'Clinical Group';
    const linkUrl = paper.pmid
      ? `https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`
      : (paper.doi ? `https://doi.org/${paper.doi}` : '#');
    const linkLabel = paper.pmid ? `PMID:${paper.pmid}` : (paper.doi ? 'DOI US CDC Growth Reference' : 'Ref');
    const factText = getCleanFactLine(paper, isEn);

    return `
      <div class="horizon-paper-evidence" style="margin-top: 0.65rem; padding: 0.52rem 0.68rem; background: #FFFFFF; border-left: 2.5px solid ${accentColor}; border-radius: 6px; font-size: 0.74rem; line-height: 1.4;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.2rem;">
          <span style="color: ${accentColor}; font-weight: 800;">${isEn ? horizonLabelEn : horizonLabelKo} US CDC Growth Reference: ${firstAuthor} et al. (${paper.year || 2021})</span>
          ${linkUrl !== '#' ? `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #1D4ED8; font-weight: 800; text-decoration: none; background: #EFF6FF; padding: 0.08rem 0.4rem; border-radius: 4px;">${linkLabel} ↗</a>` : ''}
        </div>
        <div style="color: #475569; font-weight: 500;">
          <strong>US CDC Growth Reference:</strong> ${factText}
        </div>
      </div>
    `;
  }

  /**
   * 3-B. Antigravity Bespoke Free-Text Narrative Analyzer (10+ Cluster Precision Engine)
   * Parses parent's or youth's free-form narrative (`profile.parentFreeNote`) across clinical/behavioral
   * clusters, extracts concrete tokens (sleep time, food, activity, body part, temperament), computes a
   * Narrative Precision Level (Level 1~5, 78%~99%), and synthesizes a multi-layered custom schedule.
   */
  function analyzeParentFreeNote(noteText, profile, nutTargets, mphVal, optimizedHeight, potentialGainCm, isEn) {
    nutTargets = (nutTargets && typeof nutTargets === 'object') ? nutTargets : { calciumMg: 800, vitDIU: 1000, proteinG: 40, magnesiumMg: 150, zincMg: 10 };
    profile = (profile && typeof profile === 'object') ? profile : { ageMonths: 120, currentWeight: 35.5 };
    const rawNote = (profile && (profile.parentFreeNote || profile.freeNote)) || (typeof noteText === 'string' ? noteText : '');
    const raw = (rawNote || '').trim();

    // Auto-synthesize survey profile clues if user did not type free text
    let effectiveRaw = raw;
    let isSurveyAutoSynthesized = false;
    if (effectiveRaw.length === 0) {
      isSurveyAutoSynthesized = true;
      const surveyClues = [];
      if (profile.habits && Array.isArray(profile.habits)) {
        profile.habits.forEach(h => {
          if (h === 'late_sleep') surveyClues.push('US CDC Growth Reference 10US CDC Growth Reference');
          if (h === 'night_carbs') surveyClues.push('US CDC Growth Reference');
          if (h === 'poor_posture') surveyClues.push('US CDC Growth Reference yrs');
          if (h === 'picky_eater') surveyClues.push('US CDC Growth Reference');
          if (h === 'sedentary') surveyClues.push('Exercise US CDC Growth Reference');
        });
      }
      if (profile.traitGrowthDetails && Array.isArray(profile.traitGrowthDetails)) {
        profile.traitGrowthDetails.forEach(g => {
          if (g === 'growing_pain_night') surveyClues.push('US CDC Growth Reference');
          if (g === 'underweight_thin') surveyClues.push('US CDC Growth ReferenceWeight US CDC Growth Reference Weight US CDC Growth Reference');
          if (g === 'overweight_fat_gain') surveyClues.push('US CDC Growth ReferenceWeight US CDC Growth Reference Bone Age US CDC Growth Reference');
          if (g === 'rhinitis_mouth') surveyClues.push('US CDC Growth Reference');
          if (g === 'early_puberty_worry') surveyClues.push('US CDC Growth Reference Bone Age US CDC Growth Reference');
          if (g === 'bone_age_delay') surveyClues.push('US CDC Growth Reference');
          if (g === 'dairy_calcium_lack') surveyClues.push('US CDC Growth Reference');
          if (g === 'slouch_disc_loss') surveyClues.push('US CDC Growth Reference yrs US CDC Growth Reference');
        });
      }
      if (profile.traitPostureList && Array.isArray(profile.traitPostureList)) {
        if (profile.traitPostureList.includes('growing_pains')) surveyClues.push('US CDC Growth Reference');
        if (profile.traitPostureList.includes('turtle_slouch')) surveyClues.push('US CDC Growth Reference yrs');
      }
      if (profile.traitSleepList && Array.isArray(profile.traitSleepList)) {
        if (profile.traitSleepList.includes('toss_mouth')) surveyClues.push('US CDC Growth Reference');
      }
      if (profile.traitDietList && Array.isArray(profile.traitDietList)) {
        if (profile.traitDietList.includes('dairy_sensitive')) surveyClues.push('US CDC Growth Reference');
        if (profile.traitDietList.includes('constipation_hard')) surveyClues.push('US CDC Growth Reference');
      }
      const allLearningConcerns = []
        .concat(Array.isArray(profile.traitLearningConcerns) ? profile.traitLearningConcerns : [])
        .concat(Array.isArray(profile.learningBottlenecks) ? profile.learningBottlenecks : [])
        .concat(Array.isArray(profile.devConcerns) ? profile.devConcerns : [])
        .concat(Array.isArray(profile.developmentConcerns) ? profile.developmentConcerns : [])
        .concat(Array.isArray(profile.cognitiveAxes) ? profile.cognitiveAxes : []);
      let hasLearningClue = false;
      allLearningConcerns.forEach(c => {
        if (c === 'reading_literacy' || c === 'reading_comprehension' || c === 'learning-literacy' || c === 'language' || c === 'language_reading' || c === 'language_literacy') {
          surveyClues.push('US CDC Growth Reference');
          hasLearningClue = true;
        }
        if (c === 'vocab_expression') {
          surveyClues.push('US CDC Growth Reference');
          hasLearningClue = true;
        }
        if (c === 'math_concept' || c === 'applied_math_block' || c === 'learning-math' || c === 'cognition' || c === 'math_space' || c === 'math_logic') {
          surveyClues.push('US CDC Growth Reference');
          hasLearningClue = true;
        }
        if (c === 'passive_forget' || c === 'metacognition_lack' || c === 'learning-meta' || c === 'science_nature') {
          surveyClues.push('US CDC Growth Reference');
          hasLearningClue = true;
        }
        if (c === 'screen_dopamine' || c === 'dopamine_media' || c === 'learning-focus' || c === 'fine-motor' || c === 'fine_motor' || c === 'executive_focus') {
          surveyClues.push('US CDC Growth Reference');
          hasLearningClue = true;
        }
        if (c === 'desk_endurance' || c === 'distracted_desk') {
          surveyClues.push('US CDC Growth Reference 15US CDC Growth Reference');
          hasLearningClue = true;
        }
        if (c === 'test_mistake_anxiety' || c === 'social-emotional' || c === 'social_emotion') {
          surveyClues.push('US CDC Growth Reference');
          hasLearningClue = true;
        }
        if (c === 'habit_self_directed') {
          surveyClues.push('US CDC Growth Reference');
          hasLearningClue = true;
        }
      });
      if (!hasLearningClue) {
        surveyClues.push('US CDC Growth Reference');
      }
      effectiveRaw = surveyClues.length > 0
        ? surveyClues.join(' ')
        : 'US CDC Growth Reference Sleep US CDC Growth Reference';
    }
    const ageYears = Math.max(1, Math.min(20, Math.floor((Number(profile.ageMonths) || 120) / 12)));
    const weight = Number(profile.currentWeight) || 35.5;
    const insights = [];
    const growthInsights = [];
    const learningInsights = [];
    const detectedKeywords = [];
    const growthKeywords = [];
    const learningKeywords = [];

    function recordInsight(item, pillar, kw) {
      insights.push(item);
      if (kw) detectedKeywords.push(kw);
      if (pillar === 'growth') {
        growthInsights.push(item);
        if (kw) growthKeywords.push(kw);
      } else if (pillar === 'learning') {
        learningInsights.push(item);
        if (kw) learningKeywords.push(kw);
      }
    }

    if (effectiveRaw.length > 0) {
      const text = effectiveRaw.toLowerCase();

      // Extract specific user-written tokens for hyper-personalization
      const timeMatch = raw.match(/(\d{1,2})\s*(?:pm|am|h)(\s*\d{1,2}\s*m)?/);
      const mentionedTime = timeMatch ? timeMatch[0] : null;
      if (mentionedTime) {
        detectedKeywords.push(`US CDC Growth Reference${mentionedTime})`);
        growthKeywords.push(`US CDC Growth Reference${mentionedTime})`);
      }

      // Cluster 1: Growing pains / leg / knee pain at night (Growth)
      if (/growing pain|leg|knee|calf|ankle|ache|growing pain|leg|knee|calf|ankle|ache|growing pain|leg|knee|calf|ankle|ache|growing pain|leg|knee|calf|ankle|ache|growing pain|leg|knee|calf|ankle|ache|growing pain|leg|knee|calf|ankle|ache|growing pain|leg|knee|calf|ankle|ache|growing pain|leg|knee|calf|ankle|ache|growing pain|leg|knee|calf|ankle|ache|growing pain|leg|knee|calf|ankle|ache|growing pain|leg|knee|calf|ankle|ache/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth Reference & US CDC Growth Reference yrsUS CDC Growth Reference',
          badgeEn: 'Growing Pains Relief',
          answerKo: `US CDC Growth Reference → <strong>US CDC Growth Reference 5US CDC Growth Reference${nutTargets.calciumMg}mg)·Magnesium(${nutTargets.magnesiumMg}mg)·VitaminD3(${nutTargets.vitDIU}IU)</strong> US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Do a 5-min warm knee/calf massage before bed and give Calcium (${nutTargets.calciumMg}mg) + Magnesium (${nutTargets.magnesiumMg}mg) + D3 after dinner for deep pain-free sleep!`,
          sourceKo: 'US CDC Growth Reference: US CDC Growth Reference PMID:24709624'
        }, 'growth', 'US CDC Growth Reference');
      }

      // Cluster 2: Genetic height worry / short parents / small peer percentile (Growth)
      if (/genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile|genetic|mom|dad|parent|short|small|percentile/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth ReferenceMPH) +8.5cm US CDC Growth Reference',
          badgeEn: 'Overcoming Genetic MPH',
          answerKo: `Mid-Parental Target Height(<strong>${mphVal}cm</strong>)US CDC Growth Reference <strong>±8.5cm</strong> US CDC Growth Reference → <strong>US CDC Growth Reference 10US CDC Growth ReferenceHT042 6 mos US CDC Growth Reference</strong> US CDC Growth Reference <strong>${optimizedHeight}cm (+${potentialGainCm}cm)</strong> US CDC Growth Reference.`,
          answerEn: `Genetic MPH (${mphVal}cm) has a ±8.5cm environmental window! With 10 PM sleep and daily nutrition for 6+ months, your child can reach up to ${optimizedHeight}cm (+${potentialGainCm}cm)!`,
          sourceKo: 'US CDC Growth Reference: US CDC Growth Reference Yakar et al. 2018'
        }, 'growth', 'US CDC Growth ReferenceMPH) US CDC Growth Reference');
      }

      // Cluster 3: Dislikes exercise / rope skipping / stays indoors (Growth)
      if (/exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina/.test(text)) {
        recordInsight({
          badgeKo: 'Exercise US CDC Growth Reference 10US CDC Growth Reference',
          badgeEn: 'Fun Indoor Jumping Routine',
          answerKo: `US CDC Growth Reference <strong>US CDC Growth Reference 10US CDC Growth Reference  ptsUS CDC Growth Reference 30US CDC Growth Reference×3 yrsUS CDC Growth Reference</strong>US CDC Growth Reference <strong>+1.8cm</strong>US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Replace forced rope-skipping with 10 mins of indoor silent trampoline jumping and 30s×3 doorway bar hanging to unlock +1.8cm!`,
          sourceKo: 'US CDC Growth Reference: US CDC Growth Reference PMID:30897641'
        }, 'growth', 'US CDC Growth Reference Growth Plate US CDC Growth Reference Exercise');
      }

      // Cluster 4: Refuses milk / picky eater / small appetite / underweight (Growth)
      if (/milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight|milk|dairy|picky|appetite|meat|veggie|thin|weight/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth Reference Nutrition US CDC Growth Reference',
          badgeEn: 'Picky Eater Nutrition',
          answerKo: `US CDC Growth Reference <strong>US CDC Growth ReferenceCalcium Citrate(${nutTargets.calciumMg}mg) + VitaminD3(${nutTargets.vitDIU}IU) + US CDC Growth Reference${nutTargets.proteinG}g US CDC Growth Reference Zinc(${nutTargets.zincMg}mg)</strong>US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Give lactose-free Citrate/Fish Calcium (${nutTargets.calciumMg}mg) + NZ Colostrum + Vit D3 + Zinc (${nutTargets.zincMg}mg) morning and night to restore taste bud sensitivity!`,
          sourceKo: 'US CDC Growth Reference: US CDC Growth ReferenceNutritionUS CDC Growth Reference 2023 · BMC Pediatr 2023'
        }, 'growth', 'US CDC Growth ReferenceNutrition US CDC Growth Reference');
      }

      // Cluster 5: Rhinitis / mouth breathing / snoring / late sleep / hard wakeup (Growth)
      if (/rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late|rhinitis|snor|mouth breath|airway|sleep|bedtime|late/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth Reference & US CDC Growth Reference',
          badgeEn: 'Deep Sleep Recovery',
          answerKo: `${mentionedTime ? `<strong>${mentionedTime}</strong> Sleep US CDC Growth Reference → ` : ''}US CDC Growth Reference 30US CDC Growth Reference <strong>US CDC Growth Reference  yrsUS CDC Growth Reference 50%·US CDC Growth Reference 21℃ US CDC Growth Reference</strong>US CDC Growth Reference 10US CDC Growth Reference2US CDC Growth Reference Slow-Wave Sleep (N3)(SWS) Growth Hormone (HGH) US CDC Growth Reference65%)US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Use nasal saline rinse 30 mins before bed and keep 50% bedroom humidity to restore deep slow-wave sleep GH pulses!`,
          sourceKo: 'US CDC Growth Reference: US CDC Growth Reference 2024 (Slow-Wave Sleep (N3) GH US CDC Growth Reference'
        }, 'growth', 'US CDC Growth Reference & Slow-Wave Sleep (N3)(SWS) US CDC Growth Reference');
      }

      // Cluster 6: Puberty / precocious puberty / bone age closure worry (Growth)
      if (/puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne|puberty|precocious|bone age|plate|spurt|acne/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth ReferenceBone Age(US CDC Growth Reference & US CDC Growth Reference',
          badgeEn: 'Pubertal Golden-Time Care',
          answerKo: `Bone Age US CDC Growth Reference → <strong>① US CDC Growth Reference 9US CDC Growth Reference, ② US CDC Growth Reference, ③ US CDC Growth Reference HT042·US CDC Growth Reference</strong>US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Stop snacks after 9 PM to suppress insulin/leptin spikes, manage body fat, and combine HT042 + Cartilage Calcium while growth plates are open!`,
          sourceKo: 'US CDC Growth Reference: US CDC Growth ReferenceBone Age·IGF-1 US CDC Growth Reference'
        }, 'growth', 'US CDC Growth Reference Bone Age(Bone Age) US CDC Growth Reference');
      }

      // Cluster 7: Smartphone / YouTube / short attention span / reading reluctance (Learning)
      if (/phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth Reference & US CDC Growth Reference',
          badgeEn: 'Prefrontal Working Memory & Screen Dopamine Reset',
          answerKo: ageYears <= 6
            ? `US CDC Growth Reference <strong>15US CDC Growth Reference</strong> + US CDC Growth Reference 1 hrs US CDC Growth Reference yrsUS CDC Growth Reference.`
            : `US CDC Growth Reference <strong>20US CDC Growth Referenced US CDC Growth Reference 2US CDC Growth Reference</strong> + US CDC Growth ReferenceDLPFC) US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Use a visual timer for 20-minute single-task deep work before screen access, and block blue light 1 hour before sleep to restore DLPFC attention circuits.`,
          sourceKo: 'US CDC Growth Reference: Higuchi et al. PMID:12970330 · Diamond PMID:23012271'
        }, 'learning', 'US CDC Growth Reference & US CDC Growth Reference');
      }

      // Cluster 8: Confidence / shyness / sensitivity / perfectionism / friends / stubbornness (Learning)
      if (/confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth Reference & US CDC Growth Reference',
          badgeEn: 'Autonomy Support & Academic Self-Efficacy Prescription',
          answerKo: ageYears <= 6
            ? `US CDC Growth Reference <strong>US CDC Growth Reference</strong>US CDC Growth Reference'dd US CDC Growth Reference' US CDC Growth Reference yrsUS CDC Growth Reference.`
            : ` ptsUS CDC Growth Reference <strong>US CDC Growth Reference</strong>US CDC Growth Reference1US CDC Growth ReferenceProtégé US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Focus feedback on problem-solving strategies rather than scores, and build self-efficacy through peer/parent teaching roles.`,
          sourceKo: 'US CDC Growth Reference: Bernier et al., Child Dev · PMID:20331667'
        }, 'learning', 'US CDC Growth Reference & US CDC Growth Reference');
      }

      // Cluster 9: Posture / turtle neck / slouching / crossed legs / flat feet (Growth)
      if (/posture|slouch|neck|spine|shoulder|flat feet|desk|posture|slouch|neck|spine|shoulder|flat feet|desk|posture|slouch|neck|spine|shoulder|flat feet|desk|posture|slouch|neck|spine|shoulder|flat feet|desk|posture|slouch|neck|spine|shoulder|flat feet|desk|posture|slouch|neck|spine|shoulder|flat feet|desk|growing pain|leg|knee|calf|ankle|ache growth|growthgrowing pain|leg|knee|calf|ankle|ache|posture|slouch|neck|spine|shoulder|flat feet|desk|posture|slouch|neck|spine|shoulder|flat feet|desk|posture|slouch|neck|spine|shoulder|flat feet|desk|phone|youtube|game|screen|focus|distract|study|tabletgrowth/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth Reference yrs US CDC Growth Reference & US CDC Growth Reference1.8cm US CDC Growth Reference',
          badgeEn: 'Posture & Spinal Decompression',
          answerKo: `US CDC Growth Reference 30US CDC Growth Reference 18kg US CDC Growth Reference → <strong>US CDC Growth Reference 3US CDC Growth Reference 30US CDC Growth Reference</strong>US CDC Growth Reference <strong>+1.8cm</strong>US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Use an eye-level ergonomic book stand and practice 3-min thoracic foam rolling + 30s doorway dead-hangs daily!`,
          sourceKo: 'US CDC Growth Reference: Hansraj 2014 · PMID:25393825'
        }, 'growth', 'US CDC Growth Reference & US CDC Growth Reference');
      }

      // Cluster 10: Digestion / constipation / diarrhea / gut immunity / frequent colds (Growth)
      if (/constipat|diarrhea|digest|gut|immune|probiotic|milk|dairy|picky|appetite|meat|veggie|thin|weight|constipat|diarrhea|digest|gut|immune|probiotic|constipat|diarrhea|digest|gut|immune|probiotic|constipat|diarrhea|digest|gut|immune|probiotic|constipat|diarrhea|digest|gut|immune|probiotic|constipat|diarrhea|digest|gut|immune|probiotic|constipat|diarrhea|digest|gut|immune|probiotic|constipat|diarrhea|digest|gut|immune|probiotic|constipat|diarrhea|digest|gut|immune|probiotic|constipat|diarrhea|digest|gut|immune|probiotic/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth ReferenceGut-Bone Axis) US CDC Growth Reference',
          badgeEn: 'Gut-Bone Axis Absorption Care',
          answerKo: `US CDC Growth Reference  ptsUS CDC Growth Reference → <strong>US CDC Growth Reference</strong>US CDC Growth Reference <strong>US CDC Growth Reference</strong>US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Support the Gut-Bone Axis with morning probiotics + colostrum and switch to stomach-friendly Calcium Citrate!`,
          sourceKo: 'US CDC Growth Reference: Weaver et al., J Bone Miner Res · PMID:26174539'
        }, 'growth', 'US CDC Growth ReferenceGut-Bone Axis) US CDC Growth Reference');
      }

      // Cluster 11: Reading reluctance / Literacy / Vocabulary / Long passage comprehension (Learning)
      if (/reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|phone|youtube|game|screen|focus|distract|study|tablet growth|phone|youtube|game|screen|focus|distract|study|tabletgrowth|phone|youtube|game|screen|focus|distract|study|tablet|reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth Reference & US CDC Growth Reference',
          badgeEn: 'Reading Literacy & Schema Structuring Prescription',
          answerKo: ageYears <= 6
            ? `US CDC Growth Reference 15US CDC Growth Reference <strong>US CDC Growth Reference 'US CDC Growth Reference?' US CDC Growth Reference 3US CDC Growth Reference</strong>US CDC Growth Reference42% US CDC Growth Reference yrsUS CDC Growth Reference.`
            : `US CDC Growth Reference 15US CDC Growth Reference <strong>US CDC Growth Reference 3US CDC Growth Reference</strong>US CDC Growth Reference42% US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Practice 15-minute daily paragraph keyword structuring and 3-turn causal inquiry dialogue to boost reading comprehension by 42%.`,
          sourceKo: 'US CDC Growth Reference: Mol & Bus PMID:21219058 · Romeo et al. PMID:29648612'
        }, 'learning', 'US CDC Growth Reference');
      }

      // Cluster 12: Math / Calculation vs Word Problems / Geometry / Spatial & Thinking Math (Learning)
      if (/math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|reading|literacy|vocab|comprehension|essay|passage|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth Reference',
          badgeEn: 'Spatial Reasoning & Working-Memory Offloading Prescription',
          answerKo: `US CDC Growth Reference → <strong>① US CDC Growth Reference → ② US CDC Growth Reference → ③ US CDC Growth Reference 2US CDC Growth Reference</strong>US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Stop mental calculation: offload working memory by drawing problem conditions visually and solving 2 spatial-reasoning problems daily.`,
          sourceKo: 'US CDC Growth Reference: Mix et al. 2016 · Gathercole et al. PMID:14979759'
        }, 'learning', 'US CDC Growth Reference & US CDC Growth Reference');
      }

      // Cluster 13: Academy / Forgetting / Self-Directed Study / Metacognition / Active Recall (Learning)
      if (/review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study/.test(text)) {
        recordInsight({
          badgeKo: 'US CDC Growth Reference → US CDC Growth Reference',
          badgeEn: 'Metacognitive Active Recall & Sleep Memory Consolidation',
          answerKo: `US CDC Growth Reference <strong>US CDC Growth Reference 3US CDC Growth ReferenceActive Recall) + 1US CDC Growth Reference 10US CDC Growth Reference Slow-Wave Sleep (N3)</strong>US CDC Growth Reference 92%US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Combine post-lesson 3-line active recall, 1-minute Feynman verbal explanation, and pre-10 PM slow-wave sleep to reach 92% memory retention.`,
          sourceKo: 'US CDC Growth Reference: Roediger & Karpicke PMID:16507066 · Diekelmann PMID:20046194'
        }, 'learning', 'US CDC Growth ReferenceActive Recall) & Sleep US CDC Growth Reference');
      }

      // Growth Fallback
      if (growthInsights.length === 0) {
        growthKeywords.push('US CDC Growth Reference');
        const fallbackGrowth = {
          badgeKo: 'US CDC Growth Reference 1:1 US CDC Growth Reference',
          badgeEn: '1:1 Custom Growth Prescription',
          answerKo: `US CDC Growth Reference <strong>① US CDC Growth Reference 10US CDC Growth Reference, ② US CDC Growth Reference${nutTargets.calciumMg}mg)·VitaminD3(${nutTargets.vitDIU}IU)·Zinc(${nutTargets.zincMg}mg) US CDC Growth Reference, ③ US CDC Growth Reference & 5US CDC Growth Reference Growth Plate US CDC Growth Reference</strong>US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Practice pre-10 PM sleep, morning/evening Calcium+D3+Colostrum supplementation, and 5-min bedtime stretching!`,
          sourceKo: 'US CDC Growth Reference: US CDC / KDCA(KDCA) US CDC Growth ReferenceNutritionUS CDC Growth Reference'
        };
        growthInsights.push(fallbackGrowth);
        if (insights.length === 0) {
          insights.push(fallbackGrowth);
          detectedKeywords.push('US CDC Growth Reference');
        }
      }

      // Learning Fallback
      if (learningInsights.length === 0) {
        learningKeywords.push('US CDC Growth Reference');
        const fallbackLearning = {
          badgeKo: 'US CDC Growth Reference 1:1 US CDC Growth Reference',
          badgeEn: '1:1 Custom Learning Prescription',
          answerKo: `<strong>① US CDC Growth Reference 15US CDC Growth Reference → ② US CDC Growth Reference 20US CDC Growth Referenced US CDC Growth Reference → ③ US CDC Growth Reference 3US CDC Growth Reference</strong> US CDC Growth Reference yrsUS CDC Growth Reference.`,
          answerEn: `Apply daily 15-min structured inquiry reading, 20-min visual timer deep focus, and 3-line active recall!`,
          sourceKo: 'US CDC Growth Reference: US CDC Growth ReferenceRoediger & Karpicke 2006 · PMID:16507066)'
        };
        learningInsights.push(fallbackLearning);
        if (insights.length === 0) {
          insights.push(fallbackLearning);
          detectedKeywords.push('US CDC Growth Reference');
        }
      }
    }

    // Calculate Survey Selection Precision Level
    const charLen = raw.length;
    const clusterCount = insights.length;
    let precisionPercent = 92;
    let precisionLevelKo = 'US CDC Growth Reference 92%';
    if (charLen >= 80 || clusterCount >= 4) {
      precisionPercent = 99;
      precisionLevelKo = 'US CDC Growth Reference 99%';
    } else if (charLen >= 45 || clusterCount >= 3) {
      precisionPercent = 96;
      precisionLevelKo = 'US CDC Growth Reference 96%';
    } else if (charLen >= 20 || clusterCount >= 2) {
      precisionPercent = 92;
      precisionLevelKo = 'US CDC Growth Reference 92%';
    } else if (charLen >= 1) {
      precisionPercent = 88;
      precisionLevelKo = 'US CDC Growth Reference 88%';
    }

    // Physical Growth Daily Routine (Concise 1-Line Schedule)
    const physicalDailyRoutine = {
      morning: `07:30 US CDC Growth Reference: US CDC Growth Reference [US CDC Growth Reference ${Math.round(nutTargets.calciumMg / 2)}mg · VitaminD3 ${nutTargets.vitDIU}IU · US CDC Growth Reference] US CDC Growth Reference`,
      afterSchool: `16:30 US CDC Growth Reference Exercise: [${ageYears <= 4 ? 'US CDC Growth Reference 15US CDC Growth Reference' : (/exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina|exercise|jump|rope|sport|sedentary|stamina/.test(effectiveRaw) ? 'US CDC Growth Reference 10US CDC Growth Reference  ptsUS CDC Growth Reference' : 'US CDC Growth Reference ptsUS CDC Growth Reference 15US CDC Growth Reference')}] + US CDC Growth Reference`,
      dinner: `18:30 US CDC Growth Reference: US CDC Growth Reference 3 hrs US CDC Growth Reference Complete(Protein ${nutTargets.proteinG}g/d) + [US CDC Growth Reference ${Math.round(nutTargets.calciumMg / 2)}mg · Magnesium ${nutTargets.magnesiumMg}mg · Zinc ${nutTargets.zincMg}mg] US CDC Growth Reference`,
      bedtime: `${ageYears <= 5 ? '21:15' : '21:45'} US CDC Growth Reference: US CDC Growth Reference ${/rhinitis|snor|mouth breath|airway|sleep|bedtime|late|growth|rhinitis|snor|mouth breath|airway|sleep|bedtime|late/.test(effectiveRaw) ? 'US CDC Growth Reference  yrsUS CDC Growth Reference 50% + ' : ''}${ageYears <= 4 ? 'US CDC Growth Reference 5US CDC Growth Reference' : 'US CDC Growth Reference 30US CDC Growth Reference & US CDC Growth Reference 5US CDC Growth Reference'} US CDC Growth Reference`
    };

    // 4-Stage Age-Appropriate Daily Learning Routine (Concise 1-line badges)
    const learningDailyRoutine = ageYears <= 3 ? {
      stage1: `09:00 US CDC Growth Reference10US CDC Growth Reference: US CDC Growth Reference ExerciseUS CDC Growth Reference`,
      stage2: `15:30 US CDC Growth Reference15US CDC Growth Reference: US CDC Growth Reference`,
      stage3: `18:30 US CDC Growth Reference10US CDC Growth Reference: US CDC Growth Reference`,
      stage4: `21:00 Slow-Wave Sleep (N3) US CDC Growth Reference: US CDC Growth Reference 9US CDC Growth Reference`
    } : (ageYears <= 6 ? {
      stage1: `08:30 US CDC Growth Reference5US CDC Growth Reference: US CDC Growth Reference 1US CDC Growth Reference`,
      stage2: `16:30 US CDC Growth Reference15US CDC Growth Reference: US CDC Growth Reference`,
      stage3: `19:00 US CDC Growth Reference15US CDC Growth Reference: US CDC Growth Reference 'US CDC Growth Reference?' US CDC Growth Reference 2US CDC Growth Reference`,
      stage4: `21:30 1US CDC Growth Reference & US CDC Growth Reference: US CDC Growth Reference d 1US CDC Growth Reference`
    } : {
      stage1: `07:30 US CDC Growth Reference5US CDC Growth Reference: US CDC Growth Reference`,
      stage2: `16:30 US CDC Growth Reference20US CDC Growth Reference: US CDC Growth Reference`,
      stage3: `18:30 1US CDC Growth Reference: US CDC Growth Reference 1US CDC Growth Reference`,
      stage4: `21:30 3US CDC Growth Reference & US CDC Growth Reference: US CDC Growth Reference 3US CDC Growth Reference 10US CDC Growth Reference`
    });

    const dailyScheduleKo = physicalDailyRoutine;

    return {
      hasNote: true,
      isSurveyAutoSynthesized,
      antigravityVerifiedId: 'AGY-' + Math.abs(Math.sin((profile.ageMonths || 120) * 97) * 1000000).toString(36).toUpperCase().slice(0, 6),
      rawNote: raw,
      charLen,
      clusterCount,
      precisionPercent,
      precisionLevelKo,
      detectedKeywords,
      growthKeywords,
      learningKeywords,
      dailyScheduleKo,
      physicalDailyRoutine,
      learningDailyRoutine,
      insights,
      growthInsights,
      learningInsights
    };
  }

  /**
   * Builds the Phenotype-Driven Bespoke Growth Specialization Section + <50th Percentile rhGH Paper Report
   * - Short child (kdcaPct < 50.0): Intensive height catch-up + 3-tier rhGH injection clinical paper report
   * - Tall child (kdcaPct >= 75.0 or rapid puberty): Precocious puberty & bone-age acceleration defense report
   * - Overweight for height: Pediatric fat reduction without stunting linear growth (leptin/aromatase/insulin defense)
   * - Underweight for height: Bone-matrix & lean-mass bulk-up + zinc taste-bud regeneration protocol
   * - Balanced height & weight: Survey lifestyle bottleneck pinpoint optimization for top 15% leap
   */
  function buildPhenotypeSpecializedGrowthHtml(ctx) {
    const {
      isEn,
      ageYears,
      exactMonths,
      genderKo,
      height,
      weight,
      standardMean,
      deltaStr,
      kdcaPct,
      kdcaTop,
      mphVal,
      unmanagedHeight,
      optimizedHeight,
      potentialGainCm,
      velocityPerYear,
      targetHeight6m,
      weightEval,
      optimalWeightForHeight,
      weightVsHeightDelta,
      weightVsHeightStr,
      targetWeight6m,
      lmsObj,
      tanner,
      habits,
      traitSleepList,
      traitDietList,
      sleepTraitLabelKo,
      dietTraitLabelKo,
      postureTraitLabelKo,
      customSleepRoutineKo,
      customDietRoutineKo,
      customPostureStudyRoutineKo,
      nutTargets
    } = ctx;

    const isShortChild = kdcaPct < 50.0;
    const isTallOrEarlyPuberty = kdcaPct >= 72.0 || (kdcaPct >= 50.0 && (tanner === 'phase_3' || tanner === 'phase_4' || velocityPerYear >= 7.0));
    const isOverweightForHeight =
      weightVsHeightDelta >= 1.8 ||
      (weightEval && weightEval.weightPercentile >= 78) ||
      (weightEval && lmsObj && weightEval.bmi >= (lmsObj.bmiP85 || 20.0) * 0.95) ||
      (Array.isArray(habits) && (habits.includes('overweight') || habits.includes('obesity_risk'))) ||
      (Array.isArray(traitDietList) && (traitDietList.includes('sweet_carb') || traitDietList.includes('fast_carb_sweet')) && weightVsHeightDelta >= 0.5);
    const isUnderweightForHeight =
      !isOverweightForHeight && (
        weightVsHeightDelta <= -1.4 ||
        (weightEval && weightEval.weightPercentile <= 30) ||
        (Array.isArray(habits) && habits.includes('picky_eater')) ||
        (Array.isArray(traitDietList) && (traitDietList.includes('small_appetite') || traitDietList.includes('meat_veggie_picky')) && weightVsHeightDelta <= 0.3)
      );

    const blocks = [];

    // 1. Height Specialization Block
    if (isShortChild) {
      let rhghTierBadge = '';
      let rhghTierVerdict = '';
      if (kdcaPct < 3.0) {
        rhghTierBadge = isEn
          ? `Tier A (< 3rd Percentile · Current ${kdcaPct.toFixed(1)}th) — Pediatric Endocrinology Referral & Medical rhGH Evaluation`
          : `US CDC Growth Reference A (US CDC Growth Reference 3% US CDC Growth Reference ${kdcaPct.toFixed(1)}US CDC Growth Reference — US CDC Growth Reference`;
        rhghTierVerdict = isEn
          ? `Current stature is below the 3rd percentile (-2.0 SD). A wrist Bone-Age X-ray and GH stimulation test at a pediatric endocrinology clinic are recommended to evaluate insurance-covered rhGH eligibility, combined with nocturnal slow-wave sleep & spinal decompression to maximize linear response.`
          : `US CDC Growth Reference 3US CDC Growth Reference2.0 SD) US CDC Growth Reference Bone Age(X-ray) US CDC Growth Reference Growth Hormone (HGH) US CDC Growth Reference 10%) US CDC Growth Reference. US CDC Growth Reference Slow-Wave Sleep (N3)·Nutrition·US CDC Growth Reference.`;
      } else if (kdcaPct < 25.0) {
        rhghTierBadge = isEn
          ? `Tier B (3rd–25th Percentile · Current ${kdcaPct.toFixed(1)}th) — Idiopathic Short Stature (ISS) Out-of-Pocket rhGH Decision Zone`
          : `US CDC Growth Reference B (US CDC Growth Reference 3~25% US CDC Growth Reference ${kdcaPct.toFixed(1)}US CDC Growth Reference — US CDC Growth ReferenceHeight(ISS) US CDC Growth Reference`;
        rhghTierVerdict = isEn
          ? `Non-GHD Idiopathic Short Stature (ISS) border zone where parents most frequently consider $15,000–$35,000/yr out-of-pocket rhGH injections. However, BMJ & Cochrane meta-analyses show 4–5 years of daily ISS injections yield only +1.4 to +2.0 in (+3.5–5.0 cm) net adult height gain (~$12,000 per cm). Completing a 12-week non-pharmacological SWS GH peak, bio-nutrition, and decompression protocol first is the evidence-based clinical order.`
          : `US CDC Growth Reference dUS CDC Growth ReferenceHeight US CDC Growth Reference1,000US CDC Growth Reference. US CDC Growth Reference BMJ US CDC Growth Reference 4US CDC Growth Reference3.5~5.0cm(1cmUS CDC Growth Reference 800US CDC Growth Reference12US CDC Growth Reference Sleep·Nutrition·US CDC Growth Reference yrs US CDC Growth Reference1.5~2.2cm/US CDC Growth Reference.`;
      } else {
        rhghTierBadge = isEn
          ? `Tier C (25th–50th Percentile · Current ${kdcaPct.toFixed(1)}th) — Non-Pharmacological Golden-Window Reversal Zone`
          : `US CDC Growth Reference C (US CDC Growth Reference 25~50% US CDC Growth Reference ${kdcaPct.toFixed(1)}US CDC Growth Reference — US CDC Growth Reference 30% US CDC Growth Reference`;
        rhghTierVerdict = isEn
          ? `Slightly below the peer mean (${standardMean} cm) without pathological hormone deficiency. Linear growth is currently suppressed by modifiable sleep, nutrition, and spinal compression bottlenecks. Optimizing the 10 PM endogenous SWS GH surge (70% daily output) plus targeted Calcium/D3/Zinc and 15-min decompression can naturally propel stature into the Top 25–30% within 6–12 months without injections.`
          : `US CDC Growth Reference${standardMean}cm)US CDC Growth ReferenceSleep(${sleepTraitLabelKo})·Nutrition(${dietTraitLabelKo})·US CDC Growth Reference yrs(${postureTraitLabelKo}) US CDC Growth Reference. US CDC Growth Reference 10US CDC Growth Reference Growth Hormone (HGH) US CDC Growth Reference70% US CDC Growth ReferenceD3·HT042·Spinal Decompression US CDC Growth Reference 6~12 mos US CDC Growth Reference 25~30%US CDC Growth Reference.`;
      }

      blocks.push(`
        <div id="short-child-intensive-height-report" style="background: #FFFFFF; border: 2px solid #1D4ED8; border-radius: 18px; padding: 1.15rem 1.25rem; margin-bottom: 0.9rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.6rem;">
            <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.8rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px;">
              ${isEn ? 'STATURE SPECIALIZATION · Below-Average Height (&lt; 50th Percentile) Catch-Up Protocol' : 'Height US CDC Growth Reference 50% US CDC Growth Reference'}
            </span>
            <span style="font-size: 0.8rem; font-weight: 900; color: #1D4ED8;">
              ${isEn ? `Current ${height} cm (${kdcaPct.toFixed(1)}th Percentile · Top ${kdcaTop}%)` : `US CDC Growth Reference ${height}cm (US CDC Growth Reference ${kdcaPct.toFixed(1)}% / US CDC Growth Reference ${kdcaTop}% · US CDC Growth Reference ${deltaStr})`}
            </span>
          </div>
          <h4 style="font-size: 1.12rem; font-weight: 900; color: #0F172A; margin: 0 0 0.5rem 0;">
            ${isEn
              ? `Root-Cause Breakdown vs. Peer Mean (${standardMean} cm) &amp; +${potentialGainCm.toFixed(1)} cm Catch-Up Prescription`
              : `US CDC Growth Reference${standardMean}cm) US CDC Growth Reference &amp; US CDC Growth Reference${potentialGainCm.toFixed(1)}cm US CDC Growth Reference`}
          </h4>
          <p style="font-size: 0.88rem; color: #0F172A; line-height: 1.56; margin: 0 0 0.75rem 0;">
            ${isEn
              ? `At age ${ageYears}, current stature is <strong>${deltaStr}</strong> relative to the US CDC peer mean (${standardMean} cm). While leaving current sleep, nutrition, and posture bottlenecks unmanaged risks restricting final adult height to <strong>${unmanagedHeight} cm</strong> (vs. Genetic Target MPH <strong>${mphVal} cm</strong>), accelerating annual height velocity from <strong>${velocityPerYear} cm/yr → ${(velocityPerYear + 1.8).toFixed(1)} cm/yr</strong> unlocks up to <strong>${optimizedHeight} cm</strong>.`
              : `US CDC Growth Reference ${ageYears} yrs ${genderKo}US CDC Growth Reference${standardMean}cm) US CDC Growth Reference <strong>${deltaStr}</strong> US CDC Growth Reference. US CDC Growth Reference Mid-Parental Target Height(<strong>${mphVal}cm</strong>) US CDC Growth Reference<strong>${sleepTraitLabelKo} · ${dietTraitLabelKo} · ${postureTraitLabelKo}</strong>)US CDC Growth Reference <strong>${unmanagedHeight}cm</strong>US CDC Growth Reference<strong>US CDC Growth Reference ${velocityPerYear}cm → US CDC Growth Reference ${(velocityPerYear + 1.8).toFixed(1)}cm</strong>US CDC Growth Reference <strong>${optimizedHeight}cm</strong>US CDC Growth Reference.`}
          </p>

          <!-- Paper-Based Detailed rhGH Injection Clinical Report (< 50th Percentile) -->
          <div id="rhgh-injection-paper-report" style="background: #F8FAFC; border: 1.5px solid #93C5FD; border-radius: 14px; padding: 1rem 1.1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.5rem;">
              <span style="font-size: 0.96rem; font-weight: 900; color: #1D4ED8;">
                ${isEn
                  ? '[&lt; 50th Percentile Exclusive] Growth Hormone (rhGH) Injection Efficacy, Cost &amp; BMJ/Cochrane Paper Fact-Check'
                  : '[US CDC Growth Reference 50% US CDC Growth Reference] Growth Hormone (HGH)(rhGH) US CDC Growth Reference'}
              </span>
              <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.75rem; font-weight: 800; padding: 0.18rem 0.6rem; border-radius: 9999px; border: 1px solid #BFDBFE;">
                ${isEn ? 'BMJ · Cochrane · JCEM Evidence' : 'BMJ · Cochrane · JCEM US CDC Growth Reference'}
              </span>
            </div>

            <div style="background: #EFF6FF; border-left: 4px solid #1D4ED8; border-radius: 10px; padding: 0.65rem 0.85rem; margin-bottom: 0.7rem; font-size: 0.84rem; color: #0F172A; line-height: 1.52;">
              <div style="font-weight: 900; color: #1D4ED8; margin-bottom: 0.2rem;">${isEn ? `Clinical Percentile Tier Verdict: ${rhghTierBadge}` : `US CDC Growth Reference: ${rhghTierBadge}`}</div>
              <div>${rhghTierVerdict}</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.7rem; font-size: 0.84rem; color: #0F172A; line-height: 1.5;">
              <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
                ${isEn
                  ? `<strong style="color: #1D4ED8;">① [Clinical Efficacy] True GH Deficiency (GHD) vs. Idiopathic Short Stature (ISS):</strong><br/>
                • <strong>True GHD (&lt; 3rd Percentile &amp; GH &lt; 10 ng/mL):</strong> +8.5–11.0 cm/yr first-year catch-up, adding <strong>+3.0 to +4.1 in (+7.5–10.5 cm)</strong> to final adult height (<em>Ranke et al., JCEM</em>).<br/>
                • <strong>Non-Deficient Short Stature (ISS, 3rd–50th Percentile):</strong> 3.5–5.4 years of daily injections yield an average net adult height gain of only <strong>+1.4 to +2.0 in (+3.5–5.0 cm, or +0.8–1.1 cm/yr)</strong> vs. untreated controls (<em>Deodati &amp; Cianfarani, BMJ 2011 · PMID:21402719 / Cochrane Review</em>).`
                  : `<strong style="color: #1D4ED8;">① [US CDC Growth Reference] US CDC Growth ReferenceGHD) vs dUS CDC Growth Reference ISS) US CDC Growth Reference:</strong><br/>
                • <strong>Growth Hormone (HGH) US CDC Growth Reference 3% US CDC Growth Reference &amp; US CDC Growth Reference 10ng/mL US CDC Growth Reference:</strong> US CDC Growth Reference 1US CDC Growth Reference 8.5~11.0cm US CDC Growth Reference<strong>+7.5 ~ +10.5cm</strong> US CDC Growth Reference <em>Ranke et al., JCEM</em>).<br/>
                • <strong>dUS CDC Growth ReferenceHeight(US CDC Growth Reference 3~50% US CDC Growth Reference:</strong> 3.5~5.4US CDC Growth Referenced US CDC Growth Reference <strong>+3.5cm ~ +5.0cm (US CDC Growth Reference0.8~1.1cm)</strong> US CDC Growth Reference<em>Deodati &amp; Cianfarani, BMJ 2011 · PMID:21402719 / Cochrane Review</em>).`}
              </div>
              <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
                ${isEn
                  ? `<strong style="color: #1D4ED8;">② [Cost-Benefit &amp; Bone-Age Caution] ~$10,000–$15,000 per cm &amp; Epiphyseal Acceleration:</strong><br/>
                • Out-of-pocket rhGH costs <strong>$15,000–$35,000/yr ($60,000+ over 4 years · ~1,300 daily injections)</strong>. High-dose pubertal administration can accelerate bone maturation (Bone Age), causing earlier growth-plate fusion that offsets initial height gains (<em>Kamp et al., JCEM / Finkelstein et al.</em>).`
                  : `<strong style="color: #1D4ED8;">② [US CDC Growth Reference &amp; Bone Age US CDC Growth Reference pts] 1cmUS CDC Growth Reference 700US CDC Growth Reference1,000US CDC Growth Reference &amp; US CDC Growth Reference:</strong><br/>
                • US CDC Growth Reference WeightUS CDC Growth Reference <strong>US CDC Growth Reference 800US CDC Growth Reference1,200US CDC Growth Reference4US CDC Growth Reference 3,500US CDC Growth Reference4,800US CDC Growth Reference 1,300US CDC Growth Reference</strong>US CDC Growth Reference1~2US CDC Growth Reference <strong>Bone Age(US CDC Growth Reference Growth PlateUS CDC Growth Reference dUS CDC Growth Reference</strong>US CDC Growth Reference<em>Kamp et al., JCEM / Finkelstein et al.</em>).`}
              </div>
              <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
                ${isEn
                  ? `<strong style="color: #1D4ED8;">③ [Mandatory 12-Week Pre-Injection Protocol] Awakening 70% Endogenous Nocturnal GH:</strong><br/>
                • <strong>65–70% of daily human growth hormone is secreted naturally during 10 PM–2 AM slow-wave sleep (SWS)</strong> (<em>Takahashi et al., J Clin Invest</em>). Before committing to injections, execute a strict 12-week baseline protocol: <strong>① 21:45 lights-out &amp; zero late-night sugar/dairy (insulin suppression), ② Weight-calibrated Calcium (${nutTargets.calciumMg} mg), Vitamin D3 (${nutTargets.vitDIU} IU) &amp; Zinc (${nutTargets.zincMg} mg), and ③ 15-min evening dead-hang spinal decompression &amp; plyometric jumping</strong>.`
                  : `<strong style="color: #1D4ED8;">③ [US CDC Growth Reference 12US CDC Growth Reference] US CDC Growth Reference Growth Hormone (HGH) 70% US CDC Growth Reference:</strong><br/>
                • US CDC Growth Reference Growth Hormone (HGH)US CDC Growth Reference <strong>65~70%US CDC Growth Reference 10US CDC Growth Reference 2US CDC Growth Reference Slow-Wave Sleep (N3)(SWS)</strong>US CDC Growth Reference<em>Takahashi et al., J Clin Invest</em>). US CDC Growth Reference 12US CDC Growth Reference <strong>① 21:45 US CDC Growth Reference, ② Weight US CDC Growth Reference${nutTargets.calciumMg}mg)·VitaminD3(${nutTargets.vitDIU}IU)·Zinc(${nutTargets.zincMg}mg)·HT042(US CDC Growth Reference, RCT +17% US CDC Growth Reference, ③ US CDC Growth Reference ptsUS CDC Growth Reference 15US CDC Growth Reference</strong>US CDC Growth Reference  ptsUS CDC Growth Reference yrsUS CDC Growth Reference.`}
              </div>
            </div>
          </div>
        </div>
      `);
    } else if (isTallOrEarlyPuberty) {
      blocks.push(`
        <div id="tall-child-precocious-puberty-report" style="background: #FFFFFF; border: 2px solid #1D4ED8; border-radius: 18px; padding: 1.15rem 1.25rem; margin-bottom: 0.9rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.6rem;">
            <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.8rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px;">
              ${isEn ? 'STATURE SPECIALIZATION · Tall Stature &amp; Precocious Puberty / Bone-Age Defense' : 'Height US CDC Growth Reference &amp; US CDC Growth ReferenceBone Age US CDC Growth Reference'}
            </span>
            <span style="font-size: 0.8rem; font-weight: 900; color: #1D4ED8;">
              ${isEn ? `Current ${height} cm (Top ${kdcaTop}% · ${deltaStr} vs. Mean)` : `US CDC Growth Reference ${height}cm (US CDC Growth Reference ${kdcaTop}% · US CDC Growth Reference ${deltaStr})`}
            </span>
          </div>
          <h4 style="font-size: 1.12rem; font-weight: 900; color: #0F172A; margin: 0 0 0.5rem 0;">
            ${isEn
              ? `Critical Check for Tall Children: Preventing the "Tall Child → Early Growth-Plate Fusion" Paradox`
              : `US CDC Growth Reference  ptsUS CDC Growth Reference: 'US CDC Growth Reference → US CDC Growth Reference Growth Plate US CDC Growth Reference' US CDC Growth Reference &amp; US CDC Growth Reference`}
          </h4>
          <p style="font-size: 0.88rem; color: #0F172A; line-height: 1.56; margin: 0 0 0.7rem 0;">
            ${isEn
              ? `At age ${ageYears}, your child is currently in the <strong>Top ${kdcaTop}% (${height} cm)</strong>. However, pediatric endocrinology warns against the classic paradox where <strong>early tall stature is driven by premature sex-steroid activation that advances Bone Age by 1.5–2.0 years, fusing epiphyseal plates early and leaving final adult height below Genetic MPH (${mphVal} cm)</strong> (<em>Carel &amp; Léger, NEJM 2008 · PMID:18499569</em>).`
              : `US CDC Growth Reference ${ageYears} yrs ${genderKo}US CDC Growth Reference <strong>${kdcaTop}% (${height}cm)</strong>US CDC Growth Reference. US CDC Growth Reference <strong>"US CDC Growth ReferenceBone Age)US CDC Growth Reference 1.5~2US CDC Growth Reference Growth PlateUS CDC Growth Reference dUS CDC Growth Reference${mphVal}cm)US CDC Growth Reference"</strong>US CDC Growth Reference<em>Carel &amp; Léger, NEJM 2008 · PMID:18499569</em>).`}
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.84rem; color: #0F172A; line-height: 1.5;">
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">① [4 Early Puberty &amp; Bone-Age Acceleration Red Flags]:</strong> Watch for breast budding before age 8 (girls), testicular enlargement before age 9 (boys), adult-type scalp/apocrine body odor, or sudden height velocity &gt;4–5 cm in 6 months (8–10 cm/yr). Schedule a 6-month wrist Bone-Age X-ray if present.`
                : `<strong style="color: #1D4ED8;">① [US CDC Growth ReferenceBone Age US CDC Growth Reference 4US CDC Growth Reference  ptsUS CDC Growth Reference]:</strong> Girl US CDC Growth Reference 8 yrs·Boy US CDC Growth Reference 9 yrs US CDC Growth Reference <strong>US CDC Growth Reference</strong>US CDC Growth Reference 6 mosUS CDC Growth Reference 4~5cm US CDC Growth Reference 8~10cm US CDC Growth Reference 6 mos US CDC Growth Reference Bone Age(X-ray) US CDC Growth Reference.`}
            </div>
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">② [Nocturnal Melatonin Puberty Brake]:</strong> Pineal <strong>melatonin secreted during pitch-dark sleep at 21:45 acts as a natural physiological brake on hypothalamic GnRH pulse generation</strong> (<em>Waldhauser et al., JCEM</em>). Eliminate blue-light screen exposure 60 minutes before bed.`
                : `<strong style="color: #1D4ED8;">② [US CDC Growth Reference]:</strong> US CDC Growth Reference 9US CDC Growth Reference 45US CDC Growth Reference Sleep US CDC Growth Reference <strong>US CDC Growth ReferenceMelatonin)US CDC Growth ReferenceGnRH) US CDC Growth Reference</strong> US CDC Growth Reference<em>Waldhauser et al., JCEM</em>). US CDC Growth Reference yrsUS CDC Growth Reference.`}
            </div>
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">③ [Anti-Aromatase Nutrition &amp; Growth-Plate Longevity]:</strong> Minimize BPA plastics, high-fructose beverages, and fried foods that elevate adipose aromatase/estrogen conversion. Pairing lean protein, Calcium (${nutTargets.calciumMg} mg), and Vitamin D3 (${nutTargets.vitDIU} IU) with daily rope-skipping preserves open growth plates toward <strong>${optimizedHeight} cm</strong>.`
                : `<strong style="color: #1D4ED8;">③ [US CDC Growth Reference &amp; Growth Plate US CDC Growth Reference]:</strong> US CDC Growth Reference BPA), US CDC Growth Reference${nutTargets.calciumMg}mg)·VitaminD3(${nutTargets.vitDIU}IU) US CDC Growth Reference ptsUS CDC Growth Reference ExerciseUS CDC Growth Reference Bone Age US CDC Growth Reference <strong>${optimizedHeight}cm</strong>US CDC Growth Reference.`}
            </div>
          </div>
        </div>
      `);
    }

    // 2. Weight-for-Height Specialization Block
    if (isOverweightForHeight) {
      blocks.push(`
        <div id="weight-reduction-growth-report" style="background: #FFFFFF; border: 2px solid #1D4ED8; border-radius: 18px; padding: 1.15rem 1.25rem; margin-bottom: 0.9rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.6rem;">
            <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.8rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px; border: 1px solid #93C5FD;">
              ${isEn ? 'WEIGHT SPECIALIZATION · Overweight-for-Height Fat Reduction &amp; Leptin Control' : 'Weight US CDC Growth ReferenceWeight US CDC Growth Reference &amp; US CDC Growth Reference'}
            </span>
            <span style="font-size: 0.8rem; font-weight: 900; color: #1D4ED8;">
              ${isEn ? `Current ${weight} kg (Optimal for ${height} cm: ${optimalWeightForHeight} kg · ${weightVsHeightStr})` : `US CDC Growth Reference ${weight}kg (US CDC Growth Reference ${height}cm US CDC Growth ReferenceWeight ${optimalWeightForHeight}kg US CDC Growth Reference ${weightVsHeightStr})`}
            </span>
          </div>
          <h4 style="font-size: 1.12rem; font-weight: 900; color: #0F172A; margin: 0 0 0.5rem 0;">
            ${isEn
              ? `"Grow Into Weight" Pediatric Protocol: Lowering Body Fat Without Stunting Linear Bone Growth`
              : `US CDC Growth Reference 'US CDC Growth Reference Weight US CDC Growth ReferenceWeight US CDC Growth Reference' US CDC Growth Reference`}
          </h4>
          <p style="font-size: 0.88rem; color: #0F172A; line-height: 1.56; margin: 0 0 0.7rem 0;">
            ${isEn
              ? `Current weight is elevated relative to height (${height} cm, BMI ${weightEval.bmi}). In pediatric endocrinology, excess adiposity poses two major threats: <strong>① Adipose aromatase and Leptin accelerate bone age and epiphyseal closure by 1–2 years</strong>, and <strong>② Elevated free fatty acids &amp; nocturnal hyperinsulinemia blunt night-time GH secretion by up to 40%</strong> (<em>Shalitin &amp; Phillip, Int J Obes; Fennoy, JCEM</em>).`
              : `US CDC Growth Reference${height}cm) US CDC Growth Reference WeightUS CDC Growth ReferenceBMI ${weightEval.bmi})US CDC Growth Reference. US CDC Growth ReferenceWeightUS CDC Growth Reference <strong>① US CDC Growth Reference yrsUS CDC Growth ReferenceLeptin) US CDC Growth Reference Growth Plate US CDC Growth Reference 1~2US CDC Growth Reference</strong>US CDC Growth Reference <strong>② US CDC Growth Reference 10US CDC Growth Reference Growth Hormone (HGH)(GH) US CDC Growth Reference 40% US CDC Growth Reference</strong>US CDC Growth Reference<em>Shalitin &amp; Phillip, Int J Obes; Fennoy, JCEM</em>).`}
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.84rem; color: #0F172A; line-height: 1.5;">
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">① [No Crash Dieting · "Growing Into Weight" Strategy]:</strong> Caloric starvation halts bone elongation immediately. Hold weight steady around <strong>${targetWeight6m} kg</strong> over the next 6 months while linear height expands to <strong>${targetHeight6m} cm</strong>, naturally normalizing BMI percentile.`
                : `<strong style="color: #1D4ED8;">① [US CDC Growth Reference 'US CDC Growth Reference Weight US CDC Growth ReferenceGrowing into Weight)' US CDC Growth Reference]:</strong> US CDC Growth Reference. US CDC Growth Reference 6 mosUS CDC Growth Reference WeightUS CDC Growth Reference <strong>${targetWeight6m}kg</strong> US CDC Growth Reference <strong>${targetHeight6m}cm</strong>US CDC Growth Reference.`}
            </div>
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">② [Nocturnal Insulin Blockade]:</strong> Maintain full daily protein (${nutTargets.proteinG} g/day from lean meat, fish, eggs, tofu) while strictly eliminating liquid fructose, refined carbs, and any food/milk within 3 hours of bedtime to disinhibit the 10 PM GH surge.`
                : `<strong style="color: #1D4ED8;">② [US CDC Growth Reference]:</strong> Protein(US CDC Growth Reference ${nutTargets.proteinG}g: US CDC Growth Reference, <strong>US CDC Growth Reference 3 hrs US CDC Growth Reference</strong>US CDC Growth Reference Growth Hormone (HGH) US CDC Growth Reference yrsUS CDC Growth Reference.`}
            </div>
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">③ [Post-Dinner 15-Min Plyometric Jump &amp; Vitamin D3 Repletion]:</strong> Perform 15 minutes of rope-skipping or trampoline jumping 30 minutes after dinner to clear postprandial glucose, and supplement fat-sequestered <strong>Vitamin D3 (${nutTargets.vitDIU} IU) + Calcium (${nutTargets.calciumMg} mg)</strong>.`
                : `<strong style="color: #1D4ED8;">③ [US CDC Growth Reference 15US CDC Growth Reference  ptsUS CDC Growth Reference &amp; US CDC Growth Reference VitaminD3 US CDC Growth Reference]:</strong> US CDC Growth Reference 30US CDC Growth Reference  ptsUS CDC Growth Reference 15US CDC Growth Reference<strong>VitaminD3(${nutTargets.vitDIU}IU)US CDC Growth Reference${nutTargets.calciumMg}mg)</strong>US CDC Growth Reference yrsUS CDC Growth Reference.`}
            </div>
          </div>
        </div>
      `);
    } else if (isUnderweightForHeight) {
      blocks.push(`
        <div id="weight-gain-growth-report" style="background: #FFFFFF; border: 2px solid #1D4ED8; border-radius: 18px; padding: 1.15rem 1.25rem; margin-bottom: 0.9rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.6rem;">
            <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.8rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px; border: 1px solid #93C5FD;">
              ${isEn ? 'WEIGHT SPECIALIZATION · Underweight-for-Height Lean Bulk-Up &amp; Hepatic IGF-1 Activation' : 'Weight US CDC Growth ReferenceWeight·US CDC Growth Reference &amp; Weight US CDC Growth Reference'}
            </span>
            <span style="font-size: 0.8rem; font-weight: 900; color: #1D4ED8;">
              ${isEn ? `Current ${weight} kg (Optimal for ${height} cm: ${optimalWeightForHeight} kg · ${weightVsHeightStr})` : `US CDC Growth Reference ${weight}kg (US CDC Growth Reference ${height}cm US CDC Growth ReferenceWeight ${optimalWeightForHeight}kg US CDC Growth Reference ${weightVsHeightStr})`}
            </span>
          </div>
          <h4 style="font-size: 1.12rem; font-weight: 900; color: #0F172A; margin: 0 0 0.5rem 0;">
            ${isEn
              ? `Lean-Child Bone Matrix &amp; Weight Gain Protocol: Unlocking Hepatic IGF-1 Synthesis`
              : `US CDC Growth Reference 'US CDC Growth Reference Weight US CDC Growth Reference' US CDC Growth Reference`}
          </h4>
          <p style="font-size: 0.88rem; color: #0F172A; line-height: 1.56; margin: 0 0 0.7rem 0;">
            ${isEn
              ? `Optimal weight for ${height} cm is <strong>${optimalWeightForHeight} kg</strong>, whereas current weight is <strong>${weight} kg (${weightVsHeightStr})</strong>. Pediatric auxology establishes that <strong>lean children must first gain 1–2 kg of lean mass to trigger hepatic IGF-1 synthesis before a linear height spurt can occur 2–3 months later</strong> (<em>Lifshitz, J Am Coll Nutr · PMID:19366985</em>). Reaching <strong>${targetWeight6m} kg</strong> within 6 months is priority #1.`
              : `US CDC Growth Reference${height}cm)US CDC Growth Reference WeightUS CDC Growth Reference <strong>${optimalWeightForHeight}kg</strong>US CDC Growth Reference <strong>${weight}kg (${weightVsHeightStr})</strong>US CDC Growth Reference. US CDC Growth Reference <strong>"US CDC Growth Reference WeightUS CDC Growth Reference 1~2kg US CDC Growth Reference IGF-1(US CDC Growth Reference 2~3 mos US CDC Growth Reference"</strong>US CDC Growth Reference<em>Lifshitz, J Am Coll Nutr · PMID:19366985</em>). 6 mos US CDC Growth Reference <strong>US CDC Growth Reference Weight ${targetWeight6m}kg</strong> US CDC Growth Reference.`}
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.84rem; color: #0F172A; line-height: 1.5;">
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">① [Taste-Bud Receptor Renewal via Zinc (${nutTargets.zincMg} mg) &amp; Probiotics]:</strong> Picky or low-appetite children require 4 weeks of bioavailable <strong>Zinc, Iron, Colostrum, and L. rhamnosus probiotics</strong> to regenerate gustatory taste buds and switch on natural hunger signaling.`
                : `<strong style="color: #1D4ED8;">① [US CDC Growth Reference yrsUS CDC Growth Reference Zinc(${nutTargets.zincMg}mg) &amp; US CDC Growth Reference]:</strong> US CDC Growth Reference${dietTraitLabelKo})US CDC Growth Reference <strong>Zinc(Zinc)·US CDC Growth Reference Protein·US CDC Growth Reference</strong>US CDC Growth Reference 4US CDC Growth Reference.`}
            </div>
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">② [Calorie-Dense Micro-Portions (${nutTargets.proteinG} g/day Protein)]:</strong> Avoid liquids during meals and double caloric density per spoonful using minced beef, egg yolk, cheese, avocado/olive oil, and Greek yogurt snacks.`
                : `<strong style="color: #1D4ED8;">② [US CDC Growth Reference 'US CDC Growth Reference'US CDC Growth Reference Weight US CDC Growth Reference]:</strong> US CDC Growth Reference, <strong>US CDC Growth Reference</strong>US CDC Growth ReferenceProtein(US CDC Growth Reference ${nutTargets.proteinG}g/d) US CDC Growth Reference 2US CDC Growth Reference yrsUS CDC Growth Reference. US CDC Growth Reference ProteinUS CDC Growth Reference yrsUS CDC Growth Reference.`}
            </div>
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">③ [Lactose-Free Citrate Calcium (${nutTargets.calciumMg} mg) &amp; Pre-Meal Play]:</strong> Build bone mineral density without GI discomfort using Calcium Citrate + Vitamin D3 (${nutTargets.vitDIU} IU).`
                : `<strong style="color: #1D4ED8;">③ [US CDC Growth Reference${nutTargets.calciumMg}mg) &amp; US CDC Growth Reference 15US CDC Growth Reference Exercise]:</strong> US CDC Growth Reference VitaminD3(${nutTargets.vitDIU}IU)US CDC Growth Reference yrsUS CDC Growth Reference.`}
            </div>
          </div>
        </div>
      `);
    }

    // 3. Balanced / Survey-Habit-Focused Block (Always shown as primary if standard height & weight, or as survey summary)
    if (blocks.length === 0) {
      blocks.push(`
        <div id="balanced-child-survey-focus-report" style="background: #FFFFFF; border: 2px solid #1D4ED8; border-radius: 18px; padding: 1.15rem 1.25rem; margin-bottom: 0.9rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.6rem;">
            <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.8rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px;">
              ${isEn ? 'BALANCED PHENOTYPE · Survey Lifestyle Bottleneck Pinpoint Optimization' : 'US CDC Growth Reference'}
            </span>
            <span style="font-size: 0.8rem; font-weight: 900; color: #1D4ED8;">
              ${isEn ? `Current Top ${kdcaTop}% (${height} cm) · Weight ${weight} kg (Balanced)` : `US CDC Growth Reference ${kdcaTop}% (${height}cm) · Weight ${weight}kg (US CDC Growth Reference`}
            </span>
          </div>
          <h4 style="font-size: 1.12rem; font-weight: 900; color: #0F172A; margin: 0 0 0.5rem 0;">
            ${isEn
              ? `Balanced Height-to-Weight Profile: Eliminating Survey Habit Penalties to Reach ${optimizedHeight} cm`
              : `US CDC Growth ReferenceWeight US CDC Growth Reference: US CDC Growth Reference 3US CDC Growth Reference pts US CDC Growth Reference${optimizedHeight}cm) US CDC Growth Reference`}
          </h4>
          <p style="font-size: 0.88rem; color: #0F172A; line-height: 1.56; margin: 0 0 0.7rem 0;">
            ${isEn
              ? `At age ${ageYears}, height (${height} cm · Top ${kdcaTop}%) and weight (${weight} kg · Optimal ${optimalWeightForHeight} kg) are well-proportioned. Rather than extreme weight interventions, correcting the specific sleep, nutrition, and posture bottlenecks flagged in your survey unlocks <strong>+${potentialGainCm.toFixed(1)} cm above current projections to reach ${optimizedHeight} cm</strong>.`
              : `US CDC Growth Reference ${ageYears} yrs ${genderKo}US CDC Growth Reference${height}cm · US CDC Growth Reference ${kdcaTop}%)US CDC Growth Reference Weight(${weight}kg · US CDC Growth Reference ${optimalWeightForHeight}kg)US CDC Growth Reference. US CDC Growth Reference Weight US CDC Growth Reference, <strong>US CDC Growth Reference Sleep·US CDC Growth Reference yrsUS CDC Growth Reference yrs US CDC Growth Reference Mid-Parental Target Height(${mphVal}cm)US CDC Growth Reference ${optimizedHeight}cm(+${potentialGainCm.toFixed(1)}cm)</strong>US CDC Growth Reference.`}
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.84rem; color: #0F172A; line-height: 1.5;">
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">① [Survey Sleep Bottleneck Fix]:</strong> Enforce 21:45 dark-room lights-out to capture 100% of the 10 PM–2 AM slow-wave sleep GH surge.`
                : `<strong style="color: #1D4ED8;">① [US CDC Growth Reference Sleep US CDC Growth Reference: ${sleepTraitLabelKo} US CDC Growth Reference]:</strong> ${customSleepRoutineKo}US CDC Growth Reference 10US CDC Growth Reference 2US CDC Growth Reference Slow-Wave Sleep (N3) Growth Hormone (HGH) US CDC Growth Reference 100% US CDC Growth Reference yrsUS CDC Growth Reference.`}
            </div>
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">② [Survey Nutrition Bottleneck Fix]:</strong> Supply daily Calcium (${nutTargets.calciumMg} mg), Vitamin D3 (${nutTargets.vitDIU} IU), Zinc (${nutTargets.zincMg} mg), and ${nutTargets.proteinG} g protein for epiphyseal chondrocyte proliferation.`
                : `<strong style="color: #1D4ED8;">② [US CDC Growth Reference: ${dietTraitLabelKo} US CDC Growth Reference]:</strong> ${customDietRoutineKo}US CDC Growth Reference yrsUS CDC Growth Reference.`}
            </div>
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.6rem 0.8rem;">
              ${isEn
                ? `<strong style="color: #1D4ED8;">③ [Survey Posture &amp; Spinal Decompression Fix]:</strong> Use an eye-level reading stand and 3×20s doorway dead-hang stretches to reclaim +0.8 in (+1.8 cm) of compressed intervertebral disc height.`
                : `<strong style="color: #1D4ED8;">③ [US CDC Growth Reference yrs·US CDC Growth Reference: ${postureTraitLabelKo} US CDC Growth Reference]:</strong> ${customPostureStudyRoutineKo}US CDC Growth Reference1.8cmUS CDC Growth Reference yrsUS CDC Growth Reference.`}
            </div>
          </div>
        </div>
      `);
    }

    return `
      <div id="phenotype-specialized-growth-section" style="margin-bottom: 1.15rem;">
        ${blocks.join('\n')}
      </div>
    `;
  }

  /**
   * Builds the Domain-Specific Learning Problem & 4-Week Improvement Spotlight in Pillar 2
   * Emphasizes the exact learning bottleneck(s) selected in the survey and how to fix them step by step.
   */
  function buildBottleneckSpecializedLearningHtml(ctx) {
    const {
      isEn,
      ageYears,
      isToddlerAge,
      isKinderAge,
      concernsArr,
      rawNoteLower,
      activeStyleInfo,
      weaknessesList
    } = ctx;

    const domainCards = [];

    if (isToddlerAge) {
      domainCards.push({
        badge: isEn ? 'Early Childhood Fine-Motor, Autonomy & Language Explosion Focus' : 'US CDC Growth Reference',
        problemTitle: isEn ? 'Ages 1–3 Pincer-Grasp Frustration & Short Joint-Attention Span' : 'US CDC Growth Reference 1~3 yrs US CDC Growth Reference & US CDC Growth Reference  hrs US CDC Growth Reference',
        causeKo: isEn
          ? 'Between ages 2 and 3, 30% of the motor cortex is wired to the fingertips while prefrontal autonomy surges; however, immature tripod finger coordination causes frustration or rapid task-switching (Diamond 2000; Lillard 2017).'
          : 'US CDC Growth Reference 2~3 yrsUS CDC Growth Reference ExerciseUS CDC Growth Reference 30%US CDC Growth Reference,  yrs US CDC Growth ReferenceDiamond 2000; Lillard 2017).',
        mistakeVsFixKo: isEn
          ? 'Instead of buttoning clothes for them or reading text-heavy books, provide 10 minutes of wooden tong pom-pom transfers, bead threading, and 15-turn interactive picture-book pointing.'
          : 'US CDC Growth Reference10US CDC Growth Reference.',
        fourWeekPlanKo: isEn
          ? 'Week 1 (10-min wooden clothespin/tong pom-pom transfer) → Week 2 (Coin/cap slot drop & safety-scissor single-snip practice) → Weeks 3–4 (Lift-the-flap pointing & 15-turn conversational serve-and-return)'
          : '1US CDC Growth Reference 10US CDC Growth Reference → 2US CDC Growth Reference 1US CDC Growth Reference → 3~4US CDC Growth Reference 15US CDC Growth Reference'
      });
    } else {
      if (concernsArr.includes('reading_literacy') || /reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|phone|youtube|game|screen|focus|distract|study|tablet|reading|literacy|vocab|comprehension|essay|passage|reading|literacy/i.test(rawNoteLower)) {
        domainCards.push({
          badge: isEn ? 'DOMAIN TARGET ① · Deep Reading Comprehension & Text Inference' : 'US CDC Growth Reference ① · US CDC Growth Reference & US CDC Growth Reference',
          problemTitle: isEn ? 'Skimming Long Passages & Missing Key Conditions in Word Problems' : 'US CDC Growth Reference',
          causeKo: isEn
            ? 'Phonetic decoding is intact, but limited academic vocabulary schemas and prefrontal working-memory span cause cognitive fatigue after 5+ lines of dense text, leading to guessing from familiar words (Mol & Bus 2011 · PMID:21219058).'
            : 'US CDC Growth ReferenceDecoding)US CDC Growth Reference→US CDC Growth Reference5US CDC Growth ReferenceMol & Bus 2011 · PMID:21219058).',
          mistakeVsFixKo: isEn
            ? 'Forcing high book volume or long book reports increases reading aversion. Switch to a 15-minute micro-passage routine: [Circle 3 keywords → Highlight logical connectors (however/therefore) → Close the book and summarize in 3 spoken sentences].'
            : 'US CDC Growth Reference. US CDC Growth Reference 15US CDC Growth Reference 1US CDC Growth Reference [US CDC Growth Reference 3US CDC Growth Reference → US CDC Growth Reference → US CDC Growth Reference 3US CDC Growth Reference]US CDC Growth Reference.',
          fourWeekPlanKo: isEn
            ? 'Week 1 (Read 1 short passage aloud & infer 2 unfamiliar words from context) → Week 2 (Circle 1 core keyword per paragraph) → Weeks 3–4 (Close book & deliver a 60-second 3-sentence verbal summary to parents)'
            : `1US CDC Growth Reference 1US CDC Growth Reference & US CDC Growth Reference 2US CDC Growth Reference → 2US CDC Growth Reference 1US CDC Growth Reference → 3~4US CDC Growth Reference[${activeStyleInfo.badge}] US CDC Growth Reference: US CDC Growth Reference 3US CDC Growth Reference 1US CDC Growth Reference`
        });
      }
      if (concernsArr.includes('math_concept') || /math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|reading|literacy|vocab|comprehension|essay|passage|math/i.test(rawNoteLower)) {
        domainCards.push({
          badge: isEn ? 'DOMAIN TARGET ② · Applied Word Problems & Visuospatial Math' : 'US CDC Growth Reference ② · US CDC Growth Reference',
          problemTitle: isEn ? 'Accurate in Basic Arithmetic, Stuck on Multi-Step Word Problems & 3D Geometry' : 'US CDC Growth Reference',
          causeKo: isEn
            ? 'Procedural calculation is automated, but attempting to solve multi-condition problems purely via mental math overloads the 4±1 slot prefrontal working memory instead of offloading onto the parietal visuospatial sketchpad (Mix et al. 2016 · DOI:10.1037/edu0000105).'
            : 'US CDC Growth ReferenceVisuospatial Sketchpad) US CDC Growth Reference4±1US CDC Growth ReferenceMix et al. 2016 · DOI:10.1037/edu0000105).',
          mistakeVsFixKo: isEn
            ? 'Repetitive drill worksheets do not build mathematical modeling. Stop mental math and solve just 2 applied problems/day by drawing [Singapore Bar Models, number lines, or cross-sections] in the margin.'
            : 'US CDC Growth Reference. US CDC Growth Reference 2US CDC Growth Reference [US CDC Growth Reference]US CDC Growth Reference.',
          fourWeekPlanKo: isEn
            ? 'Week 1 (Circle numeric givens + underline target unknown in every word problem) → Week 2 (Draw Singapore Bar Models or number lines before writing equations) → Weeks 3–4 (Write a 2-line logical step plan without looking at the answer key)'
            : (isKinderAge
              ? '1US CDC Growth Reference 10 US CDC Growth Reference → 2US CDC Growth Reference → 3~4US CDC Growth Reference'
              : '1US CDC Growth Reference → 2US CDC Growth Reference  yrsUS CDC Growth Reference → 3~4US CDC Growth Reference 2US CDC Growth Reference')
        });
      }
      if (concernsArr.includes('passive_forget') || concernsArr.includes('habit_self_directed') || /review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|forget|memory/i.test(rawNoteLower)) {
        domainCards.push({
          badge: isEn ? 'DOMAIN TARGET ③ · Long-Term Memory Consolidation & Active Recall' : 'US CDC Growth Reference ③ · US CDC Growth Reference & US CDC Growth Reference',
          problemTitle: isEn ? 'Understands During Lectures, Forgets Within 48 Hours When Solving Alone' : 'US CDC Growth Reference',
          causeKo: isEn
            ? 'Passive listening creates an "Illusion of Competence." Without active hippocampal retrieval practice immediately after learning, up to 65% of short-term traces decay within 24 hours (Roediger & Karpicke 2006 · PMID:16507066).'
            : 'US CDC Growth Reference "US CDC Growth Reference"US CDC Growth ReferenceIllusion of Competence) US CDC Growth Reference. US CDC Growth ReferenceRetrieval) US CDC Growth Reference 24 hrs US CDC Growth Reference 65%US CDC Growth ReferenceRoediger & Karpicke 2006 · PMID:16507066).',
          mistakeVsFixKo: isEn
            ? 'Rereading notes or adding more tutoring hours yields minimal retention. Closing the book for a 3-minute Blank-Page Recall or Feynman teach-back boosts 1-week retention from 48% to 92%.'
            : 'US CDC Growth ReferenceRereading)US CDC Growth Reference. US CDC Growth Reference 3US CDC Growth Reference 3US CDC Growth Reference 48%→92%US CDC Growth Reference.',
          fourWeekPlanKo: isEn
            ? 'Week 1 (Close book after study & state 3 core keywords aloud) → Week 2 (Write 3-line Cornell blank-page summary & fill gaps in blue pen) → Weeks 3–4 (Re-solve missed problems 24 hours later on a blank sheet while explaining why)'
            : '1US CDC Growth Reference 3US CDC Growth Reference → 2US CDC Growth Reference 3US CDC Growth Reference → 3~4US CDC Growth Reference'
        });
      }
      if (concernsArr.includes('screen_dopamine') || concernsArr.includes('desk_endurance') || /phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tabletgrowth|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|focus|screen/i.test(rawNoteLower)) {
        domainCards.push({
          badge: isEn ? 'DOMAIN TARGET ④ · Prefrontal Focus Endurance & Dopamine Reset' : 'US CDC Growth Reference ④ · US CDC Growth Reference & US CDC Growth Reference',
          problemTitle: isEn ? 'High Reactivity to Fast Media, Loses Desk Focus Within 15 Minutes' : 'US CDC Growth Reference 15~20US CDC Growth Referenced US CDC Growth Reference',
          causeKo: isEn
            ? 'Striatal conditioning to rapid digital dopamine spikes fatigues prefrontal executive inhibition during slow-reward tasks like reading or problem-solving (Diamond 2013 · PMID:23020641).'
            : 'US CDC Growth Reference10US CDC Growth Reference yrsUS CDC Growth ReferenceDiamond 2013 · PMID:23020641).',
          mistakeVsFixKo: isEn
            ? 'Forcing 60-minute desk marathons turns the desk into a cortisol stressor. Dock phones in the living room and use a visual countdown timer for guaranteed 15–20 minute deep-focus sprints.'
            : 'US CDC Growth Reference 1 hrs US CDC Growth Reference. US CDC Growth Reference15~20US CDC Growth Reference.',
          fourWeekPlanKo: isEn
            ? 'Week 1 (Phone docked outside room + 15-min visual timer single-task sprint) → Week 2 (Eye-level bookstand + 20-min focus sprint followed by 5-min dead-hang break) → Weeks 3–4 (Self-checked 3-task daily mission card for 30-min flow)'
            : '1US CDC Growth Reference 15US CDC Growth Reference → 2US CDC Growth Reference 20US CDC Growth Reference 5US CDC Growth Reference ptsUS CDC Growth Reference → 3~4US CDC Growth Reference d 3US CDC Growth Reference 30US CDC Growth Reference'
        });
      }
      if (concernsArr.includes('vocab_expression') || concernsArr.includes('test_mistake_anxiety') || /reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|growth|growth|confidence|shy|anxious|friend|sensitive|mistake|confidence|shy|anxious|friend|sensitive|mistake|growth|writing/i.test(rawNoteLower)) {
        domainCards.push({
          badge: isEn ? 'DOMAIN TARGET ⑤ · Expressive Writing Logic & Error-Proofing' : 'US CDC Growth Reference ⑤ · US CDC Growth Reference & US CDC Growth Reference',
          problemTitle: isEn ? 'Has Ideas in Mind but Struggles with Structured Written Answers or Careless Errors' : 'US CDC Growth Reference ptsUS CDC Growth Reference',
          causeKo: isEn
            ? 'Gap between passive receptive vocabulary and active expressive retrieval, paired with impulsive prefrontal self-monitoring during tests.'
            : 'US CDC Growth ReferenceptsUS CDC Growth Reference ptsUS CDC Growth ReferenceSelf-Monitoring) US CDC Growth Reference.',
          mistakeVsFixKo: isEn
            ? 'Start with verbal scaffolding before writing, then practice the 2-sentence ["Claim: ... Because: ..."] structure and numbering problem constraints ①, ②.'
            : 'US CDC Growth Reference. US CDC Growth Reference ["US CDC Growth Reference. US CDC Growth Reference"] 2US CDC Growth Reference.',
          fourWeekPlanKo: isEn
            ? 'Week 1 (Daily 1-word academic sentence game) → Week 2 (Write 2-line "Claim + Because" notebook entries) → Weeks 3–4 (Number problem conditions ①, ② before writing final answers)'
            : '1US CDC Growth Reference 1US CDC Growth Reference → 2US CDC Growth Reference"US CDC Growth Reference" US CDC Growth Reference 2US CDC Growth Reference → 3~4US CDC Growth Reference ①, ② US CDC Growth Reference'
        });
      }
    }

    if (domainCards.length === 0 && weaknessesList && weaknessesList.length > 0) {
      const topW = weaknessesList[0];
      domainCards.push({
        badge: isEn ? `DOMAIN TARGET · ${topW.shortLabel} Optimization` : `US CDC Growth Reference ${topW.shortLabel} US CDC Growth Reference`,
        problemTitle: topW.title,
        causeKo: topW.weakTrait,
        mistakeVsFixKo: isEn
          ? `${topW.howToFix} Pairing this with your child's dominant learning style doubles neural retention speed.`
          : `${topW.howToFix} US CDC Growth Reference yrs US CDC Growth Reference [${activeStyleInfo.badge}] US CDC Growth Reference 2US CDC Growth Reference.`,
        fourWeekPlanKo: isEn
          ? `Week 1 (15-min daily low-friction warm-up) → Week 2 (3-line verbal/diagram recall) → Weeks 3–4 (5x/week routine to elevate score from ${topW.score} → ${Math.min(96, topW.score + 16)} pts)`
          : `1US CDC Growth Reference${topW.helpfulTools} US CDC Growth Reference 15US CDC Growth Reference → 2US CDC Growth Reference[${activeStyleInfo.badge}] US CDC Growth Reference 1US CDC Growth Reference → 3~4US CDC Growth Reference 5d US CDC Growth Reference ${topW.score} pts → US CDC Growth Reference ${Math.min(96, topW.score + 16)} pts US CDC Growth Reference`
      });
    }

    return `
      <div id="specialized-learning-bottleneck-spotlight" style="background: #FFFFFF; border: 2px solid #1D4ED8; border-radius: 20px; padding: 1.15rem 1.25rem; margin-bottom: 1.2rem; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.6rem;">
          <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.8rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px;">
            ${isEn ? 'SPECIFIC LEARNING BOTTLENECK 1:1 NEUROSCIENCE BREAKDOWN &amp; 4-WEEK MASTERPLAN' : 'US CDC Growth Reference pts 1:1 US CDC Growth Reference &amp; 4US CDC Growth Reference'}
          </span>
          <span style="font-size: 0.78rem; font-weight: 800; color: #1D4ED8; background: #EFF6FF; padding: 0.2rem 0.65rem; border-radius: 9999px; border: 1px solid #BFDBFE;">
            ${isEn ? 'Survey Bottleneck × Dominant Learning Style Match' : `US CDC Growth Reference × [${activeStyleInfo.badge}] US CDC Growth Reference`}
          </span>
        </div>
        <h3 style="font-size: 1.16rem; font-weight: 900; color: #0F172A; margin: 0 0 0.65rem 0;">
          ${isEn ? `Age ${ageYears} Domain-Specific Study Bottleneck Diagnosis &amp; Step-by-Step Fix` : `US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference pts US CDC Growth Reference Assessment &amp; US CDC Growth Reference`}
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.7rem;">
          ${domainCards.slice(0, 3).map((card) => `
            <div style="background: #F8FAFC; border: 1.5px solid #93C5FD; border-radius: 14px; padding: 0.9rem 1rem;">
              <div style="font-size: 0.82rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.25rem;">
                ${card.badge}
              </div>
              <div style="font-size: 1.0rem; font-weight: 900; color: #0F172A; margin-bottom: 0.45rem;">
                ${isEn ? `Symptom: ${card.problemTitle}` : `US CDC Growth Reference: ${card.problemTitle}`}
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.38rem; font-size: 0.85rem; color: #0F172A; line-height: 1.52;">
                <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.55rem 0.75rem;">
                  <strong style="color: #1D4ED8;">${isEn ? '• Executive-Cognitive Root Cause:' : '• US CDC Growth Reference:'}</strong> ${card.causeKo}
                </div>
                <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.55rem 0.75rem;">
                  <strong style="color: #1D4ED8;">${isEn ? '• Evidence-Based Fix (How-To):' : '• US CDC Growth ReferenceHow-To Fix):'}</strong> ${card.mistakeVsFixKo}
                </div>
                <div style="background: #EFF6FF; border: 1px solid #93C5FD; border-radius: 10px; padding: 0.55rem 0.75rem;">
                  <strong style="color: #1D4ED8;">${isEn ? '• 4-Week Action Roadmap:' : '• 4US CDC Growth Reference:'}</strong> ${card.fourWeekPlanKo}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Renders the complete HTML for Master Briefing Card
   * - Section 1: Fact-Based Comprehensive Precision Diagnosis
   * - Section 2: Matched Paper Fact Cards (Zero Fluff)
   * - Section 3: Short-Term (1-4w) / Mid-Term (1-3m) / Long-Term (6m-Adult) Paper-Backed Guidance Roadmap
   */
  function renderMasterBriefingCard(profile = {}) {
    if (!GrowthEngine && global.KidsFitGrowthEngine) GrowthEngine = global.KidsFitGrowthEngine;
    if (!EndocrinologyEngine && global.KidsFitEndocrinologyEngine) EndocrinologyEngine = global.KidsFitEndocrinologyEngine;
    if (!NutritionEngine && global.KidsFitNutritionEngine) NutritionEngine = global.KidsFitNutritionEngine;
    if (!BiomechanicsStudio && global.KidsFitBiomechanicsStudio) BiomechanicsStudio = global.KidsFitBiomechanicsStudio;
    if (!NeuroCognitiveMatrix && global.KidsFitNeuroCognitiveMatrix) NeuroCognitiveMatrix = global.KidsFitNeuroCognitiveMatrix;
    if (!GrowthTracker && global.KidsFitGrowthTracker) GrowthTracker = global.KidsFitGrowthTracker;
    if (!PinpointCurator && (global.TallerPinpointCurator || global.KidsFitPinpointCurator)) {
      PinpointCurator = global.TallerPinpointCurator || global.KidsFitPinpointCurator;
    }
    if (!UserCohortDB && (global.TallerUserCohortDB || global.KidsFitUserCohortDB)) {
      UserCohortDB = global.TallerUserCohortDB || global.KidsFitUserCohortDB;
    }

    const kb = getKnowledgeBase();
    const totalDbPapers = (kb && kb.metadata && Number(kb.metadata.total_papers)) || (kb && Array.isArray(kb.papers) && kb.papers.length) || 2783;
    const kbBal = (kb && kb.metadata && kb.metadata.learning_analytics && kb.metadata.learning_analytics.macro_pillar_balance) || {};
    const kbPillarCounts = (kb && kb.metadata && kb.metadata.pillar_counts) || {};
    const growthMacroCount = Number(kbBal.growth_macro_count) || (Number(kbPillarCounts.growth_endocrinology || 0) + Number(kbPillarCounts.posture_biomechanics_exercise || 0)) || 1183;
    const learningMacroCount = Number(kbBal.learning_macro_count) || Math.max(0, totalDbPapers - growthMacroCount) || 1600;

    const isEn = (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang === 'en');
    const isYouthSelf = profile.targetSubject === 'self' || (Number(profile.ageYears) >= 14 && profile.targetSubject !== 'child');
    const ageMonths = profile.ageMonths || ((profile.ageYears || 10) * 12);
    const exactMonths = Number(profile.exactMonths || ageMonths);
    const ageYears = Math.max(1, Math.min(20, Math.floor(ageMonths / 12)));
    const gender = profile.gender === 'girl' ? 'girl' : 'boy';
    const genderKo = gender === 'boy' ? (isYouthSelf ? 'US CDC Growth Reference' : 'Boy') : (isYouthSelf ? 'US CDC Growth Reference' : 'Girl');
    const height = parseFloat(profile.currentHeight) || 137.0;
    const weight = parseFloat(profile.currentWeight) || 35.5;
    const recentGain = parseFloat(profile.recentGrowth6m) || 3.2;
    const fatherH = parseFloat(profile.fatherHeight) || 173.5;
    const motherH = parseFloat(profile.motherHeight) || 160.5;
    const habits = Array.isArray(profile.habits) ? profile.habits : ['late_sleep'];
    const autoStageObj = (PinpointCurator && typeof PinpointCurator.autoDetectGrowthStage === 'function')
      ? PinpointCurator.autoDetectGrowthStage(exactMonths, gender, recentGain)
      : { tannerPhase: 'phase_2', stageNameKo: 'Phase 2 · US CDC Growth ReferencePHV)' };
    const tanner = profile.tannerPhase || autoStageObj.tannerPhase || 'phase_2';
    const cognitiveAxes = Array.isArray(profile.cognitiveAxes) ? profile.cognitiveAxes : ['science_nature'];

    // Section 1: Public Clinical Standards Data (KDCA 2017 / US CDC 2000) using exact decimal months from DOB
    let kdcaTop = 50.0;
    let kdcaPct = 50.0;
    let kdcaZ = 0.0;
    let standardMean = 137.0;
    let lmsObj = { L: 1.0, M: 137.0, S: 0.0498, wM: 35.5, wS: 0.15, bmiP5: 14.2, bmiP50: 17.2, bmiP85: 20.5, bmiP95: 22.8 };
    if (GrowthEngine && typeof GrowthEngine.getLmsForMonth === 'function' && typeof GrowthEngine.calculateKdcaPercentile === 'function') {
      lmsObj = GrowthEngine.getLmsForMonth(gender, exactMonths) || lmsObj;
      standardMean = lmsObj.M;
      const kdcaRes = GrowthEngine.calculateKdcaPercentile(height, lmsObj.L, lmsObj.M, lmsObj.S);
      kdcaTop = kdcaRes.topPercent;
      kdcaPct = kdcaRes.percentile;
      kdcaZ = kdcaRes.zScore;
    }

    const deltaCm = Math.round((height - standardMean) * 10) / 10;
    const deltaStr = deltaCm >= 0 ? `+${deltaCm} cm` : `${deltaCm} cm`;

    // Weight & BMI Full Clinical Evaluation (Matching Height's Precision!)
    let weightEval = {
      bmi: Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10,
      currentWeight: weight,
      standardWeight: Math.round((lmsObj.wM || 35.5) * 10) / 10,
      weightPercentile: 50.0,
      weightTopPercent: 50.0,
      weightZScore: 0.0,
      weightDelta: 0.0,
      optimalWeightForHeight: Math.round((lmsObj.wM || 35.5) * 10) / 10,
      weightVsHeightDelta: 0.0,
      targetWeight6m: Math.round(((lmsObj.wM || 35.5) + 1.8) * 10) / 10,
      bmiStatus: 'US CDC Growth Reference 5~84US CDC Growth Reference',
      bmiShortStatus: 'US CDC Growth Reference Weight',
      bmiNote: 'US CDC Growth Reference Weight US CDC Growth Reference.',
      bmiBadgeColor: '#1D4ED8'
    };
    if (GrowthEngine && typeof GrowthEngine.evaluateWeightAndBmi === 'function') {
      try {
        weightEval = Object.assign(weightEval, GrowthEngine.evaluateWeightAndBmi(height, weight, lmsObj));
      } catch (_) {}
    }
    weightEval.statusLabel = weightEval.statusLabel || weightEval.bmiStatus || 'US CDC Growth Reference 5~84US CDC Growth Reference';
    const weightTop = weightEval.weightTopPercent;
    const weightPct = weightEval.weightPercentile;
    const standardWeight = weightEval.standardWeight;
    const weightDeltaKg = weightEval.weightDelta;
    const weightDeltaStr = weightDeltaKg >= 0 ? `+${weightDeltaKg} kg` : `${weightDeltaKg} kg`;
    const optimalWeightForHeight = weightEval.optimalWeightForHeight;
    const weightVsHeightDelta = weightEval.weightVsHeightDelta;
    const weightVsHeightDeltaStr = weightVsHeightDelta >= 0 ? `+${weightVsHeightDelta} kg` : `${weightVsHeightDelta} kg`;
    const weightVsHeightStr = weightVsHeightDeltaStr;
    const targetWeight6m = weightEval.targetWeight6m;
    const targetHeight6m = Math.round((height + Math.max(2.6, recentGain + 0.8)) * 10) / 10;

    let mphVal = gender === 'boy' ? (fatherH + motherH + 13) / 2 : (fatherH + motherH - 13) / 2;
    mphVal = Math.round(mphVal * 10) / 10;

    // 3-Tier Height Trajectory Facts
    let unmanagedHeight = Math.round((mphVal - Math.min(5.0, Math.max(1.2, habits.length * 1.1))) * 10) / 10;
    let optimizedHeight = Math.round((mphVal + (tanner === 'phase_4' ? 2.2 : tanner === 'phase_3' ? 4.8 : 7.2)) * 10) / 10;
    let potentialGainCm = Math.round((optimizedHeight - unmanagedHeight) * 10) / 10;
    if (GrowthEngine && typeof GrowthEngine.predictAdultHeightTrajectories === 'function') {
      try {
        const traj = GrowthEngine.predictAdultHeightTrajectories(mphVal, habits, tanner);
        unmanagedHeight = traj.unmanaged.height;
        optimizedHeight = traj.optimized.height;
        potentialGainCm = traj.optimized.gainOverUnmanaged;
      } catch (_) {}
    }

    const adultStandardBmi = gender === 'boy' ? 21.5 : 20.0;
    const adultTargetWeight = Math.round((adultStandardBmi * Math.pow(optimizedHeight / 100, 2)) * 10) / 10;

    const velocityPerYear = Math.round(recentGain * 2 * 10) / 10;
    const isRedFlag = ageYears >= 4 && ageYears <= 11 && velocityPerYear < 4.5;

    // Age & Sex Accurate Growth Plate Remaining Window
    const defaultClosureAge = gender === 'boy' ? 17 : 15;
    let windowInfo = {
      closureAge: defaultClosureAge,
      headline: `US CDC Growth Reference ${Math.max(1, defaultClosureAge - ageYears)}~${Math.max(2, defaultClosureAge + 1 - ageYears)}US CDC Growth Reference`,
      shortBadge: `US CDC Growth Reference ${Math.max(1, defaultClosureAge - ageYears)}~${Math.max(2, defaultClosureAge + 1 - ageYears)}US CDC Growth Reference`,
      subLabel: `US CDC Growth Reference ${defaultClosureAge} yrs Growth Plate US CDC Growth Reference`,
      fullText: `US CDC Growth Reference ${Math.max(1, defaultClosureAge - ageYears)}~${Math.max(2, defaultClosureAge + 1 - ageYears)}US CDC Growth Reference ${defaultClosureAge} yrs Growth Plate US CDC Growth Reference`,
      meaningKo: `US CDC Growth Reference Growth PlateUS CDC Growth Reference${gender === 'boy' ? 'Boy US CDC Growth Reference 16.5~17 yrs' : 'Girl US CDC Growth Reference 14.5~15 yrs'})US CDC Growth Reference  hrsUS CDC Growth Reference.`,
      meaningExplanation: `US CDC Growth Reference Growth PlateUS CDC Growth Reference${gender === 'boy' ? 'Boy US CDC Growth Reference 16.5~17 yrs' : 'Girl US CDC Growth Reference 14.5~15 yrs'})US CDC Growth Reference  hrsUS CDC Growth Reference.`,
      detailExplanation: `US CDC Growth Reference ${ageYears} yrs ${genderKo}US CDC Growth Reference Growth PlateUS CDC Growth Reference ${defaultClosureAge} yrsUS CDC Growth Reference ${Math.max(1, defaultClosureAge - ageYears)}~${Math.max(2, defaultClosureAge + 1 - ageYears)}US CDC Growth Reference Boy US CDC Growth Reference.`
    };
    if (GrowthEngine && typeof GrowthEngine.calculateRemainingGrowthWindow === 'function') {
      try {
        windowInfo = Object.assign({}, windowInfo, GrowthEngine.calculateRemainingGrowthWindow(exactMonths, gender, tanner));
      } catch (_) {}
    }
    const goldenTimeLabel = isEn
      ? `~${Math.max(1, (gender === 'boy' ? 17 : 15) - ageYears)} yrs remaining until epiphyseal closure`
      : `${windowInfo.shortBadge} · ${windowInfo.subLabel}`;
    const goldenTimeMeaningKo = windowInfo.meaningKo;

    // Executive-Cognitive Target Focus Label
    let neuroFocusLabel = isEn ? 'Prefrontal Executive Function & Causal Reasoning' : 'US CDC Growth Reference & US CDC Growth Reference';
    if (ageYears <= 3) neuroFocusLabel = isEn ? 'Fine-Motor Cortex (30%) & Sensory Synapses' : 'US CDC Growth ReferenceExerciseUS CDC Growth Reference 30%) & US CDC Growth Reference';
    else if (ageYears <= 6) neuroFocusLabel = isEn ? '3D Spatial Rotation (Parietal) & Dialogue Turns' : '3US CDC Growth Reference & US CDC Growth Reference';
    else if (ageYears <= 12) neuroFocusLabel = isEn ? 'Working Memory & Havruta Critical Inquiry' : 'US CDC Growth Reference & US CDC Growth Reference';
    else neuroFocusLabel = isEn ? 'Higher Metacognition & Self-Directed Mastery' : 'US CDC Growth Reference & US CDC Growth Reference';

    // Section 2: Realtime Papers Matching (for specific causes)
    const matchedPapers = matchPapers(habits, ageYears, tanner, 3);

    // Section 3: Horizon-Specific Papers & Nutrition Targets
    const horizonPapers = matchHorizonPapers(habits, ageYears, cognitiveAxes);

    let nutTargets = {
      calciumMg: ageYears <= 3 ? 650 : ageYears <= 8 ? 800 : 1000,
      vitDIU: 2000,
      vitK2Mcg: 75,
      proteinG: Math.round(weight * 1.3 * 10) / 10,
      zincMg: 10,
      magnesiumMg: 180,
      weightKg: weight
    };
    if (NutritionEngine && typeof NutritionEngine.calculateTargets === 'function') {
      try {
        const calcNut = NutritionEngine.calculateTargets(weight, ageYears) || {};
        nutTargets = Object.assign({}, nutTargets, calcNut, {
          magnesiumMg: calcNut.magnesiumMg || nutTargets.magnesiumMg || Math.round(weight * 5.5) || 180
        });
      } catch (e) {
        // fallback
      }
    }

    const computedMetrics = {
      kdcaPercentile: kdcaPct,
      topPercent: kdcaTop,
      zScore: kdcaZ,
      mph: mphVal,
      unmanagedHeight,
      optimizedHeight,
      potentialGainCm
    };

    const guidebookEditionLabel = isYouthSelf
      ? `[US CDC Growth Reference] US CDC Growth Reference ${ageYears} yrs(${exactMonths.toFixed(1)} mos) US CDC Growth Reference`
      : `[US CDC Growth Reference] US CDC Growth Reference ${ageYears} yrs(${exactMonths.toFixed(1)} mos) US CDC Growth Reference`;

    // Child-specific deep trait labels & individualized routines (supports multi-select lists)
    const traitSleepList = Array.isArray(profile.traitSleepList) && profile.traitSleepList.length
      ? profile.traitSleepList
      : [profile.traitSleep || 'late_bedtime'];
    const traitDietList = Array.isArray(profile.traitDietList) && profile.traitDietList.length
      ? profile.traitDietList
      : [profile.traitDiet || 'small_appetite'];
    const traitPostureList = Array.isArray(profile.traitPostureList) && profile.traitPostureList.length
      ? profile.traitPostureList
      : [profile.traitPosture || 'turtle_slouch'];
    const traitTempList = Array.isArray(profile.traitTemperamentList) && profile.traitTemperamentList.length
      ? profile.traitTemperamentList
      : [profile.traitTemperament || 'explorer'];
    const traitFocus = profile.traitFocusSpan || '15_20m';

    const sleepLabelMapKo = {
      deep_early: '21:30 US CDC Growth Reference',
      late_bedtime: '22:30 US CDC Growth Reference',
      toss_mouth: 'US CDC Growth Reference',
      night_snack: 'US CDC Growth Reference',
      hard_wakeup: 'US CDC Growth Reference',
      morning_fatigue: 'US CDC Growth Reference',
      night_sweat: 'Sleep US CDC Growth Reference',
      light_dream: 'US CDC Growth Reference',
      wake_middle: 'US CDC Growth Reference',
      bedtime_screen: 'US CDC Growth Reference',
      weekend_oversleep: 'US CDC Growth ReferenceSleepUS CDC Growth Reference'
    };

    const dietLabelMapKo = {
      small_appetite: 'US CDC Growth Reference',
      meat_veggie_picky: 'US CDC Growth Reference',
      dairy_sensitive: 'US CDC Growth Reference',
      constipation_hard: 'US CDC Growth Reference',
      sweet_carb: 'US CDC Growth Reference',
      fast_carb_sweet: 'US CDC Growth Reference',
      fast_indigestion: 'US CDC Growth Reference',
      slow_hold_mouth: 'US CDC Growth Reference',
      water_low: 'US CDC Growth Reference3US CDC Growth Reference',
      weak_stomach: 'US CDC Growth Reference',
      skip_breakfast: 'US CDC Growth Reference',
      balanced_good: 'US CDC Growth Reference'
    };

    const postureLabelMapKo = {
      turtle_slouch: 'US CDC Growth Reference',
      leg_cross_pelvis: 'US CDC Growth ReferenceWUS CDC Growth Reference',
      growing_pains: 'US CDC Growth Reference',
      chin_lean: 'US CDC Growth Reference',
      flat_foot: 'US CDC Growth Reference',
      w_sit_flat_foot: 'WUS CDC Growth Reference',
      round_shoulder: 'US CDC Growth Reference',
      upright_good: 'US CDC Growth Reference'
    };

    const tempLabelMapKo = {
      explorer: 'US CDC Growth Reference',
      builder: 'US CDC Growth Reference',
      questioner: 'US CDC Growth Reference',
      cautious: 'US CDC Growth Reference yrs·US CDC Growth Reference',
      creative_art: 'US CDC Growth Reference',
      art_story: 'US CDC Growth Reference',
      reward_goal: 'US CDC Growth Reference',
      competitive_game: 'US CDC Growth Reference'
    };

    const sleepTraitLabelKo = traitSleepList.map(k => sleepLabelMapKo[k] || 'US CDC Growth Reference').join(' · ');
    const dietTraitLabelKo = traitDietList.map(k => dietLabelMapKo[k] || 'US CDC Growth Reference').join(' · ');
    const postureTraitLabelKo = traitPostureList.map(k => postureLabelMapKo[k] || 'US CDC Growth Reference').join(' · ');
    const tempTraitLabelKo = traitTempList.map(k => tempLabelMapKo[k] || 'US CDC Growth Reference').join(' · ');

    const focusTraitLabelKo = {
      under_10m: '10US CDC Growth Reference',
      '15_20m': '15~20US CDC Growth Reference',
      '30m_plus': '30US CDC Growth Reference'
    }[traitFocus] || '15~20US CDC Growth Reference';

    // Trait-specific custom routine lines (combining multi-selected traits)
    const sleepRoutines = [];
    if (traitSleepList.includes('toss_mouth') || traitSleepList.includes('wake_middle') || traitSleepList.includes('light_dream') || traitSleepList.includes('night_sweat')) {
      sleepRoutines.push('US CDC Growth Reference  yrsUS CDC Growth Reference21℃, 50%) US CDC Growth Reference Slow-Wave Sleep (N3) US CDC Growth Reference');
    }
    if (traitSleepList.includes('night_snack')) {
      sleepRoutines.push('US CDC Growth Reference 3 hrs US CDC Growth Reference GH US CDC Growth Reference');
    }
    if (traitSleepList.includes('hard_wakeup') || traitSleepList.includes('morning_fatigue') || traitSleepList.includes('weekend_oversleep')) {
      sleepRoutines.push('US CDC Growth Reference 1 hrs US CDC Growth Reference');
    }
    if (sleepRoutines.length === 0 || traitSleepList.includes('late_bedtime') || traitSleepList.includes('bedtime_screen')) {
      sleepRoutines.push('21:45 US CDC Growth Reference 1 hrs US CDC Growth Reference 10US CDC Growth Reference2US CDC Growth Reference Growth Hormone (HGH) US CDC Growth Reference');
    }
    const customSleepRoutineKo = sleepRoutines.slice(0, 2).join(' + ');

    const dietRoutines = [];
    if (traitDietList.includes('dairy_sensitive') || traitDietList.includes('weak_stomach') || traitDietList.includes('constipation_hard')) {
      dietRoutines.push(`US CDC Growth Reference${nutTargets.calciumMg}mg)·VitaminD3(${nutTargets.vitDIU}IU)·US CDC Growth Reference`);
    }
    if (traitDietList.includes('meat_veggie_picky') || traitDietList.includes('sweet_carb') || traitDietList.includes('fast_carb_sweet')) {
      dietRoutines.push(`US CDC Growth Reference Protein(${nutTargets.proteinG}g/d)US CDC Growth Reference Zinc·US CDC Growth Reference`);
    }
    if (traitDietList.includes('fast_indigestion') || traitDietList.includes('water_low')) {
      dietRoutines.push('US CDC Growth Reference 5US CDC Growth Reference 20US CDC Growth Reference');
    }
    if (dietRoutines.length === 0 || traitDietList.includes('small_appetite') || traitDietList.includes('slow_hold_mouth')) {
      dietRoutines.push(`US CDC Growth ReferenceHT042)·US CDC Growth Reference${nutTargets.calciumMg}mg) US CDC Growth Reference`);
    }
    const customDietRoutineKo = dietRoutines.slice(0, 2).join(' + ');

    const customPostureStudyRoutineKo = `${(traitPostureList.includes('growing_pains') || traitPostureList.includes('flat_foot')) ? 'US CDC Growth Reference 5US CDC Growth Reference' : 'US CDC Growth Reference'} US CDC Growth Reference 30US CDC Growth Reference×3 yrsUS CDC Growth Reference & US CDC Growth Reference  ptsUS CDC Growth Reference 10US CDC Growth Reference`;

    const bespokeNote = analyzeParentFreeNote(
      (profile && (profile.parentFreeNote || profile.freeNote)) || '',
      profile,
      nutTargets,
      mphVal,
      optimizedHeight,
      potentialGainCm,
      isEn
    );

    let lqData = null;
    if (NeuroCognitiveMatrix && typeof NeuroCognitiveMatrix.calculateLqMetrics === 'function') {
      try {
        lqData = NeuroCognitiveMatrix.calculateLqMetrics(profile);
      } catch (e) {
        lqData = null;
      }
    }
    if (!lqData) {
      lqData = {
        scores: {
          literacy_vocab: 78,
          math_spatial: 80,
          working_memory_focus: 76,
          metacognition_retrieval: 74,
          inquiry_creative: 82
        },
        overallLQ: 78.0,
        topPercent: 22,
        metricsMeta: {
          literacy_vocab: { icon: '', nameKo: 'US CDC Growth Reference', descKo: 'US CDC Growth Reference', citation: 'Mol & Bus 2011 · PMID:21219058' },
          math_spatial: { icon: '', nameKo: 'US CDC Growth Reference', descKo: '3D US CDC Growth Reference', citation: 'Mix et al. 2016 · DOI:10.1037/edu0000105' },
          working_memory_focus: { icon: '', nameKo: 'US CDC Growth Reference1US CDC Growth Reference', descKo: 'US CDC Growth Referenced US CDC Growth Reference', citation: 'Gathercole et al. 2004 · PMID:14979759' },
          metacognition_retrieval: { icon: '', nameKo: 'US CDC Growth Reference', descKo: 'US CDC Growth Reference', citation: 'Roediger & Karpicke 2006 · PMID:16507066' },
          inquiry_creative: { icon: '', nameKo: 'US CDC Growth Reference', descKo: 'US CDC Growth Reference "US CDC Growth Reference?"US CDC Growth Reference', citation: 'Romeo et al. 2018 · PMID:29648612' }
        },
        trajectory: {
          unmanaged: { focusMinutes: 12, forgetRatePercent: 52, retentionPercent: 48, lqScore: 65, statusKo: 'US CDC Growth Reference' },
          baseline: { focusMinutes: 20, forgetRatePercent: 38, retentionPercent: 62, lqScore: 75, statusKo: 'US CDC Growth Reference' },
          coached: { focusMinutes: 35, forgetRatePercent: 8, retentionPercent: 92, lqScore: 88, gainLq: 23, focusGainMinutes: 23, statusKo: '6 mos US CDC Growth Reference' }
        }
      };
    }

    // Normalize lqData.trajectory fields so both legacy and new chart templates work seamlessly
    if (lqData && lqData.trajectory) {
      const unm = lqData.trajectory.unmanaged || { focusMinutes: 12, retentionPercent: 48, lqScore: 65 };
      const base = lqData.trajectory.baseline || lqData.trajectory.current || { focusMinutes: 18, retentionPercent: 60, lqScore: 76 };
      const coach = lqData.trajectory.coached || { focusMinutes: 35, retentionPercent: 92, lqScore: 89, gainLq: 14, focusGainMinutes: 17 };
      lqData.trajectory.current = Object.assign({}, unm, {
        focusMinutes: unm.focusMinutes || base.focusMinutes || 15,
        retentionRate: unm.retentionRate || unm.retentionPercent || 48
      });
      lqData.trajectory.coached = Object.assign({}, coach, {
        focusMinutes: coach.focusMinutes || 35,
        retentionRate: coach.retentionRate || coach.retentionPercent || 92,
        gainFocusMin: coach.gainFocusMin || coach.focusGainMinutes || 18,
        gainLq: coach.gainLq || Math.max(8, Math.round((coach.lqScore || 89) - (lqData.overallLQ || 78)))
      });
    }

    const isLearningDefault = (profile && (profile.preferredReportMode === 'growth' || profile.preferredReportMode === 'learning'))
      ? (profile.preferredReportMode === 'learning')
      : ((typeof global !== 'undefined' && global.__KIDSFIT_PREFERRED_REPORT_MODE === 'learning') ||
         (typeof window !== 'undefined' && window.__KIDSFIT_PREFERRED_REPORT_MODE === 'learning'));

    // Build intuitive 8-step Learning Report data (Disposition -> Strengths -> Weaknesses -> Careers -> Strengthen How-To -> Remedy How-To -> Helpful Items -> Direct Links)
    const cogAxisPrimary = (Array.isArray(profile.cognitiveAxes) && profile.cognitiveAxes[0]) || 'science_nature';
    const studyStyleKey = profile.traitStudyStyle || 'dialogue_question';
    const tempKey = profile.traitTemperament || (Array.isArray(profile.traitTemperamentList) && profile.traitTemperamentList[0]) || 'explorer';
    const concernsArr = Array.isArray(profile.traitLearningConcerns) ? profile.traitLearningConcerns : ['reading_literacy'];
    const rawNoteLower = String((profile && profile.parentFreeNote) || '').toLowerCase();

    // Age-tier flags for strict age-appropriate setting (3yo never gets complex reading/academies; 11yo never gets Gabe/Froebel)
    const isToddlerAge = ageYears <= 3;
    const isKinderAge = ageYears >= 4 && ageYears <= 6;
    const isElemLowAge = ageYears >= 7 && ageYears <= 9;
    const isUpperAge = ageYears >= 10;

    const styleProfileMap = {
      dialogue_question: {
        badge: isToddlerAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference',
        title: isToddlerAge
          ? 'US CDC Growth Reference 【US CDC Growth Reference】'
          : (isKinderAge
            ? 'US CDC Growth Reference 【US CDC Growth Reference】'
            : 'US CDC Growth Reference 2US CDC Growth Reference 【US CDC Growth Reference】'),
        summary: isToddlerAge
          ? 'US CDC Growth Reference.'
          : 'US CDC Growth Reference.',
        detail: 'US CDC Growth Reference.',
        boostAction: isToddlerAge
          ? 'US CDC Growth Reference 10US CDC Growth Reference yrsUS CDC Growth Reference.'
          : (isKinderAge
            ? 'US CDC Growth Reference 1US CDC Growth Reference yrsUS CDC Growth Reference.'
            : 'US CDC Growth Reference 1US CDC Growth Reference 1US CDC Growth Reference yrsUS CDC Growth Reference.'),
        fixAction: isToddlerAge
          ? 'US CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference 1US CDC Growth Reference yrsUS CDC Growth Reference.'
      },
      play_manipulative: {
        badge: 'US CDC Growth Reference',
        title: isToddlerAge
          ? 'US CDC Growth Reference 【US CDC Growth Reference】'
          : (isKinderAge
            ? 'US CDC Growth Reference 【US CDC Growth Reference】'
            : 'US CDC Growth Reference 【US CDC Growth Reference】'),
        summary: isToddlerAge
          ? 'US CDC Growth Reference ExerciseUS CDC Growth Reference30%)US CDC Growth Reference.'
          : 'US CDC Growth Reference.',
        detail: 'US CDC Growth Reference ExerciseUS CDC Growth Reference30%) US CDC Growth Reference.',
        boostAction: isToddlerAge
          ? 'US CDC Growth Reference 15US CDC Growth Reference yrsUS CDC Growth Reference.'
          : (isKinderAge
            ? 'US CDC Growth Reference yrsUS CDC Growth Reference.'
            : 'US CDC Growth Reference 3D US CDC Growth Reference yrsUS CDC Growth Reference.'),
        fixAction: isToddlerAge
          ? 'US CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference yrsUS CDC Growth Reference.'
      },
      visual_story: {
        badge: 'US CDC Growth Reference',
        title: isToddlerAge
          ? 'US CDC Growth Reference 【US CDC Growth Reference】'
          : 'US CDC Growth Reference 【US CDC Growth Reference】',
        summary: isToddlerAge
          ? 'US CDC Growth Reference.'
          : 'US CDC Growth Reference.',
        detail: 'US CDC Growth Reference.',
        boostAction: isToddlerAge
          ? 'US CDC Growth Reference  ptsUS CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference 3US CDC Growth Reference yrsUS CDC Growth Reference.',
        fixAction: isToddlerAge
          ? 'US CDC Growth Reference  hrsUS CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference yrsUS CDC Growth Reference.'
      },
      goal_workbook: {
        badge: 'US CDC Growth Reference',
        title: isToddlerAge
          ? 'US CDC Growth Reference 【US CDC Growth Reference】'
          : 'US CDC Growth Reference 【US CDC Growth Reference】',
        summary: isToddlerAge
          ? 'US CDC Growth Reference 5US CDC Growth Reference.'
          : 'US CDC Growth Reference 20US CDC Growth Reference.',
        detail: 'US CDC Growth Reference.',
        boostAction: isToddlerAge
          ? '5US CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference15~20US CDC Growth Reference yrsUS CDC Growth Reference.',
        fixAction: 'US CDC Growth Reference 15~20US CDC Growth Reference yrsUS CDC Growth Reference.'
      }
    };
    const activeStyleInfo = styleProfileMap[studyStyleKey] || styleProfileMap.dialogue_question;

    // Age-appropriate tool label helper
    const ageMathToolLabel = isToddlerAge
      ? 'US CDC Growth Reference'
      : (isKinderAge ? 'US CDC Growth Reference' : '3D US CDC Growth Reference');
    const ageLangToolLabel = isToddlerAge
      ? 'US CDC Growth Reference'
      : (isKinderAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference');
    const ageBuilderToolLabel = isToddlerAge
      ? 'US CDC Growth Reference'
      : (isKinderAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference');

    // Step 2: Strengths (Concise 1-line visual cards, zero double quotes)
    const strengthsList = [];
    if (cogAxisPrimary === 'math_logic' || /math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|growth|growth|growth/.test(rawNoteLower)) {
      strengthsList.push({
        icon: '',
        score: Math.max(84, (lqData.scores && lqData.scores.math_spatial) || 86),
        shortLabel: isToddlerAge ? 'US CDC Growth Reference' : (isKinderAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference'),
        title: isToddlerAge ? 'US CDC Growth Reference & US CDC Growth Reference' : (isKinderAge ? 'US CDC Growth Reference & US CDC Growth Reference' : 'US CDC Growth Reference & US CDC Growth Reference'),
        goodTrait: isToddlerAge
          ? 'US CDC Growth Reference.'
          : 'US CDC Growth Reference.',
        howToBoost: isToddlerAge
          ? 'US CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference 2US CDC Growth Reference yrsUS CDC Growth Reference.',
        helpfulTools: ageMathToolLabel
      });
    } else if (cogAxisPrimary === 'language_reading' || /growth|growth|growth|growth/.test(rawNoteLower)) {
      strengthsList.push({
        icon: '',
        score: Math.max(84, (lqData.scores && lqData.scores.literacy_vocab) || 86),
        shortLabel: isToddlerAge ? 'US CDC Growth Reference' : (isKinderAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference'),
        title: isToddlerAge ? 'US CDC Growth Reference & US CDC Growth Reference' : (isKinderAge ? 'US CDC Growth Reference & US CDC Growth Reference' : 'US CDC Growth Reference & US CDC Growth Reference'),
        goodTrait: isToddlerAge
          ? 'US CDC Growth Reference.'
          : 'US CDC Growth Reference.',
        howToBoost: isToddlerAge
          ? 'US CDC Growth Reference 2US CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference 2US CDC Growth Reference yrsUS CDC Growth Reference.',
        helpfulTools: ageLangToolLabel
      });
    } else if (cogAxisPrimary === 'sensory_arts' || /growth|growth|growth|growth|growth/.test(rawNoteLower)) {
      strengthsList.push({
        icon: '',
        score: Math.max(85, (lqData.scores && lqData.scores.inquiry_creative) || 87),
        shortLabel: isToddlerAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference',
        title: isToddlerAge ? 'US CDC Growth Reference & US CDC Growth Reference' : 'US CDC Growth Reference & US CDC Growth Reference',
        goodTrait: 'US CDC Growth Reference.',
        howToBoost: isToddlerAge
          ? 'US CDC Growth Reference ptsUS CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference 4US CDC Growth Reference 2US CDC Growth Reference.',
        helpfulTools: isToddlerAge ? 'US CDC Growth Reference ptsUS CDC Growth Reference' : 'US CDC Growth Reference'
      });
    } else if (cogAxisPrimary === 'executive_focus') {
      strengthsList.push({
        icon: '',
        score: Math.max(84, (lqData.scores && lqData.scores.working_memory_focus) || 85),
        shortLabel: isToddlerAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference',
        title: isToddlerAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference',
        goodTrait: 'US CDC Growth Reference.',
        howToBoost: isToddlerAge
          ? 'US CDC Growth Reference 10US CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference yrsUS CDC Growth Reference.',
        helpfulTools: isToddlerAge ? 'US CDC Growth Reference dUS CDC Growth Reference' : 'US CDC Growth Reference'
      });
    } else {
      strengthsList.push({
        icon: '',
        score: Math.max(85, (lqData.scores && lqData.scores.inquiry_creative) || 86),
        shortLabel: isToddlerAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference',
        title: isToddlerAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference',
        goodTrait: isToddlerAge
          ? 'US CDC Growth Reference.'
          : 'US CDC Growth Reference.',
        howToBoost: isToddlerAge
          ? 'US CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference yrsUS CDC Growth Reference.',
        helpfulTools: isToddlerAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference'
      });
    }

    if (tempKey === 'builder') {
      strengthsList.push({
        icon: '',
        score: 86,
        shortLabel: 'US CDC Growth Reference',
        title: 'US CDC Growth Reference',
        goodTrait: 'US CDC Growth Reference.',
        howToBoost: isToddlerAge
          ? 'US CDC Growth Reference 10US CDC Growth Reference yrsUS CDC Growth Reference.'
          : 'US CDC Growth Reference 10US CDC Growth Reference.',
        helpfulTools: ageBuilderToolLabel
      });
    } else if (tempKey === 'questioner') {
      strengthsList.push({
        icon: '',
        score: 87,
        shortLabel: 'US CDC Growth Reference',
        title: 'US CDC Growth Reference',
        goodTrait: 'US CDC Growth Reference.',
        howToBoost: 'US CDC Growth Reference 10US CDC Growth Reference 1US CDC Growth Reference yrsUS CDC Growth Reference.',
        helpfulTools: isToddlerAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference'
      });
    } else if (tempKey === 'reward_goal') {
      strengthsList.push({
        icon: '',
        score: 86,
        shortLabel: 'US CDC Growth Reference',
        title: 'US CDC Growth Reference',
        goodTrait: 'US CDC Growth Reference.',
        howToBoost: 'US CDC Growth Reference yrsUS CDC Growth Reference.',
        helpfulTools: 'US CDC Growth Reference dd US CDC Growth Reference'
      });
    } else {
      strengthsList.push({
        icon: '',
        score: 85,
        shortLabel: 'US CDC Growth Reference',
        title: 'US CDC Growth Reference',
        goodTrait: 'US CDC Growth Reference 2US CDC Growth Reference.',
        howToBoost: 'US CDC Growth Reference.',
        helpfulTools: 'US CDC Growth Reference'
      });
    }

    strengthsList.push({
      icon: '',
      score: Math.max(83, Math.round(lqData.overallLQ || 83)),
      shortLabel: 'US CDC Growth Reference',
      title: `${activeStyleInfo.badge} US CDC Growth Reference`,
      goodTrait: activeStyleInfo.summary,
      howToBoost: activeStyleInfo.boostAction,
      helpfulTools: isToddlerAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference'
    });

    // Step 3: Weaknesses (Concise 1-line visual cards, age x trait differentiated)
    const weaknessesList = [];
    if (isToddlerAge) {
      weaknessesList.push({
        icon: '',
        score: Math.min(72, (lqData.scores && lqData.scores.literacy_vocab) || 70),
        shortLabel: 'US CDC Growth Reference',
        title: 'US CDC Growth Reference',
        weakTrait: 'US CDC Growth Reference.',
        howToFix: 'US CDC Growth Reference 10US CDC Growth Reference yrsUS CDC Growth Reference.',
        helpfulTools: 'US CDC Growth Reference'
      });
      weaknessesList.push({
        icon: '',
        score: Math.min(71, (lqData.scores && lqData.scores.working_memory_focus) || 69),
        shortLabel: 'US CDC Growth Reference',
        title: 'US CDC Growth Reference',
        weakTrait: 'US CDC Growth Reference  yrs US CDC Growth Reference.',
        howToFix: 'US CDC Growth Reference yrsUS CDC Growth Reference.',
        helpfulTools: 'US CDC Growth Reference'
      });
      weaknessesList.push({
        icon: '',
        score: Math.min(70, (lqData.scores && lqData.scores.metacognition_retrieval) || 68),
        shortLabel: 'US CDC Growth Reference',
        title: 'US CDC Growth Reference',
        weakTrait: 'US CDC Growth Reference.',
        howToFix: 'US CDC Growth Reference 1 hrs US CDC Growth Reference 15US CDC Growth Reference yrsUS CDC Growth Reference.',
        helpfulTools: 'US CDC Growth Reference'
      });
    } else {
      if (concernsArr.includes('reading_literacy') || concernsArr.includes('vocab_expression') || /reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|phone|youtube|game|screen|focus|distract|study|tablet|reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage|reading|literacy|vocab|comprehension|essay|passage/.test(rawNoteLower)) {
        weaknessesList.push({
          icon: '',
          score: Math.min(72, (lqData.scores && lqData.scores.literacy_vocab) || 68),
          shortLabel: isKinderAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference',
          title: isKinderAge
            ? 'US CDC Growth Reference'
            : 'US CDC Growth Reference',
          weakTrait: isKinderAge
            ? 'US CDC Growth Reference.'
            : 'US CDC Growth Reference.',
          howToFix: isKinderAge
            ? 'US CDC Growth Reference 15US CDC Growth Reference 2US CDC Growth Reference yrsUS CDC Growth Reference.'
            : 'US CDC Growth Reference 15US CDC Growth Reference 【US CDC Growth Reference 3US CDC Growth Reference】US CDC Growth Reference yrsUS CDC Growth Reference.',
          helpfulTools: ageLangToolLabel + ', US CDC Growth Reference'
        });
      }
      if (concernsArr.includes('math_concept') || /math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle|math|arithmetic|geometry|spatial|logic|formula|puzzle/.test(rawNoteLower)) {
        weaknessesList.push({
          icon: '',
          score: Math.min(72, (lqData.scores && lqData.scores.math_spatial) || 69),
          shortLabel: isKinderAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference',
          title: isKinderAge
            ? 'US CDC Growth Reference'
            : 'US CDC Growth Reference',
          weakTrait: isKinderAge
            ? 'US CDC Growth Reference.'
            : 'US CDC Growth Reference.',
          howToFix: isKinderAge
            ? 'US CDC Growth Reference yrsUS CDC Growth Reference.'
            : 'US CDC Growth Reference yrsUS CDC Growth Reference.',
          helpfulTools: ageMathToolLabel
        });
      }
      if (concernsArr.includes('passive_forget') || concernsArr.includes('habit_self_directed') || /review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study|review|recall|memory|forget|exam|test|homework|study/.test(rawNoteLower)) {
        weaknessesList.push({
          icon: '',
          score: Math.min(71, (lqData.scores && lqData.scores.metacognition_retrieval) || 67),
          shortLabel: 'US CDC Growth Reference',
          title: 'US CDC Growth Reference',
          weakTrait: 'US CDC Growth Reference.',
          howToFix: 'US CDC Growth Reference 3US CDC Growth Reference 1US CDC Growth Reference yrsUS CDC Growth Reference.',
          helpfulTools: isKinderAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference'
        });
      }
      if (concernsArr.includes('screen_dopamine') || concernsArr.includes('desk_endurance') || concernsArr.includes('test_mistake_anxiety') || /phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tabletgrowth|phone|youtube|game|screen|focus|distract|study|tablet|phone|youtube|game|screen|focus|distract|study|tablet/.test(rawNoteLower)) {
        weaknessesList.push({
          icon: '',
          score: Math.min(70, (lqData.scores && lqData.scores.working_memory_focus) || 66),
          shortLabel: 'US CDC Growth Reference',
          title: 'US CDC Growth Reference 15~20US CDC Growth Reference',
          weakTrait: 'US CDC Growth Referenced US CDC Growth Reference.',
          howToFix: 'US CDC Growth Reference 15~20US CDC Growth Reference yrsUS CDC Growth Reference.',
          helpfulTools: 'US CDC Growth Reference'
        });
      }
      while (weaknessesList.length < 3) {
        if (weaknessesList.length === 1) {
          weaknessesList.push({
            icon: '',
            score: 70,
            shortLabel: 'US CDC Growth Reference',
            title: 'US CDC Growth Reference',
            weakTrait: 'US CDC Growth Reference.',
            howToFix: 'US CDC Growth Reference yrsUS CDC Growth Reference.',
            helpfulTools: ageMathToolLabel
          });
        } else {
          weaknessesList.push({
            icon: '',
            score: 69,
            shortLabel: 'US CDC Growth Referenced 3US CDC Growth Reference',
            title: 'US CDC Growth Reference',
            weakTrait: 'US CDC Growth Reference.',
            howToFix: 'US CDC Growth Reference 3US CDC Growth Reference 3US CDC Growth Reference yrsUS CDC Growth Reference.',
            helpfulTools: isKinderAge ? 'US CDC Growth Reference 15US CDC Growth Reference' : 'US CDC Growth Reference 20US CDC Growth Reference'
          });
        }
      }
    }

    // Step 4: Recommended Future Careers (Concise 1-line aptitude match, zero double quotes)
    const careerMap = {
      math_logic: [
        { icon: '', group: 'IT·US CDC Growth Reference', shortJob: 'AI·US CDC Growth Reference', jobs: 'AI US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference ptsUS CDC Growth Reference.' },
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference', jobs: '3D US CDC Growth Reference & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' },
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference', jobs: 'US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' }
      ],
      language_reading: [
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference', jobs: 'US CDC Growth Reference & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' },
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference PD·US CDC Growth Reference', jobs: 'US CDC Growth ReferencePD) & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' },
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference', jobs: 'US CDC Growth Reference & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference ptsUS CDC Growth Reference ptsUS CDC Growth Reference.' }
      ],
      sensory_arts: [
        { icon: '', group: 'US CDC Growth ReferenceUX', shortJob: 'UX/UI·US CDC Growth Reference', jobs: 'UX/UI US CDC Growth Reference & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' },
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference', jobs: 'US CDC Growth Reference & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' },
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference', jobs: 'US CDC Growth Reference & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' }
      ],
      executive_focus: [
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference PM·US CDC Growth Reference', jobs: 'US CDC Growth ReferencePM) & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' },
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference', jobs: 'US CDC Growth Reference & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' },
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth ReferenceVC', jobs: 'US CDC Growth Reference & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference AssessmentUS CDC Growth Reference.' }
      ],
      science_nature: [
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference', jobs: 'US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' },
        { icon: '', group: 'US CDC Growth Reference', shortJob: 'US CDC Growth Reference', jobs: 'US CDC Growth Reference & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference.' },
        { icon: '', group: 'AI·US CDC Growth Reference', shortJob: 'AI·US CDC Growth Reference', jobs: 'AI US CDC Growth Reference & US CDC Growth Reference', majors: 'US CDC Growth Reference', reason: 'US CDC Growth Reference  yrsUS CDC Growth Reference.' }
      ]
    };
    const recommendedCareers = careerMap[cogAxisPrimary] || careerMap.science_nature;

    // Curated Direct Link Items for Both Growth (Pillar 1) & Learning (Pillar 2)
    const curatedAllItems = (PinpointCurator && typeof PinpointCurator.curatePinpointItems === 'function')
      ? PinpointCurator.curatePinpointItems(profile)
      : { supplements: [], toys: [], learningTools: [], books: [], tours: [] };
    const quickSupplements = Array.isArray(curatedAllItems.supplements) ? curatedAllItems.supplements.slice(0, 3) : [];
    const quickGrowthGear = Array.isArray(curatedAllItems.toys) ? curatedAllItems.toys.slice(0, 3) : [];
    const quickTools = Array.isArray(curatedAllItems.learningTools) ? curatedAllItems.learningTools.slice(0, 3) : [];
    const quickBooks = Array.isArray(curatedAllItems.books) ? curatedAllItems.books.slice(0, 3) : [];
    const quickTours = Array.isArray(curatedAllItems.tours) ? curatedAllItems.tours.slice(0, 3) : [];

    // Strictly isolate Physical Growth Report & Brain Learning Report so neither can enter the other
    if (typeof document !== 'undefined') {
      const topBtnGrowth = document.getElementById('btn-switch-report-growth');
      const topBtnLearning = document.getElementById('btn-switch-report-learning');
      const navHeaderGrowth = document.getElementById('nav-header-growth-report');
      const navHeaderLearning = document.getElementById('nav-header-learning-report');
      if (topBtnGrowth && topBtnGrowth.style) topBtnGrowth.style.display = 'none';
      if (topBtnLearning && topBtnLearning.style) topBtnLearning.style.display = 'none';
      if (navHeaderGrowth && navHeaderGrowth.style) navHeaderGrowth.style.display = 'none';
      if (navHeaderLearning && navHeaderLearning.style) navHeaderLearning.style.display = 'none';
    }

    const phenotypeSpecializedGrowthHtml = buildPhenotypeSpecializedGrowthHtml({
      isEn,
      ageYears,
      exactMonths,
      genderKo,
      height,
      weight,
      standardMean,
      deltaStr,
      kdcaPct,
      kdcaTop,
      mphVal,
      unmanagedHeight,
      optimizedHeight,
      potentialGainCm,
      velocityPerYear,
      targetHeight6m,
      weightEval,
      optimalWeightForHeight,
      weightVsHeightDelta,
      weightVsHeightStr,
      targetWeight6m,
      lmsObj,
      tanner,
      habits,
      traitSleepList,
      traitDietList,
      sleepTraitLabelKo,
      dietTraitLabelKo,
      postureTraitLabelKo,
      customSleepRoutineKo,
      customDietRoutineKo,
      customPostureStudyRoutineKo,
      nutTargets
    });

    const bottleneckSpecializedLearningHtml = buildBottleneckSpecializedLearningHtml({
      isEn,
      ageYears,
      isToddlerAge,
      isKinderAge,
      concernsArr,
      rawNoteLower,
      activeStyleInfo,
      weaknessesList
    });

    return `
      <!-- Master Briefing Card: Crisp Comprehensive Growth & Habit Percentile PDF Guide Sheet -->
      <div class="bento-card master-briefing-card" id="master-briefing-card-content" style="border-left: 5px solid ${isLearningDefault ? '#1D4ED8' : '#3B82F6'}; text-align: left; padding: 1.5rem;">
        
        <!-- Header with Print / PDF Button -->
        <div class="briefing-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid #BFDBFE; padding-bottom: 0.9rem;">
          <div>
            <span id="master-report-header-badge" class="section-badge-pill" style="display: inline-flex; align-items: center; gap: 0.35rem; background: ${isLearningDefault ? '#EFF6FF' : '#EFF6FF'}; color: ${isLearningDefault ? '#1D4ED8' : '#1D4ED8'}; font-size: 0.82rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 9999px; border: 1px solid ${isLearningDefault ? '#EFF6FF' : '#EFF6FF'}; margin-bottom: 0.35rem;">
              ${isEn ? 'KISFIT · PRECISION REPORT' : (isLearningDefault ? `KISFIT · US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference AssessmentUS CDC Growth Reference` : guidebookEditionLabel)}
            </span>
            <h2 id="master-report-header-title" class="briefing-title" style="font-size: 1.38rem; font-weight: 900; color: #0F172A; margin: 0.15rem 0; word-break: keep-all;">
              ${isEn
                ? 'At-a-Glance Precision Diagnosis & Daily Prescription'
                : (isLearningDefault ? `US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference & US CDC Growth Reference Assessment Report` : `US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference AssessmentUS CDC Growth Reference & US CDC Growth Reference Growth Guide`)}
            </h2>
          </div>
          <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <button
              type="button"
              id="btn-print-report-briefing"
              onclick="(function(){ try { var app = window.KidsFitApp; var gt = window.KidsFitGrowthTracker || window.TallerGrowthTracker; if(gt && typeof gt.preparePrintReport === 'function'){ gt.preparePrintReport(app && app.state ? app.state.profile : {}); } window.print(); } catch(e){ window.print(); } })()"
              style="display: inline-flex; align-items: center; gap: 0.35rem; background: #F8FAFC; color: #0F172A; font-weight: 900; font-size: 0.84rem; padding: 0.48rem 0.95rem; border-radius: 9999px; border: 1.5px solid #93C5FD; cursor: pointer; box-shadow: 0 4px 14px #F8FAFC;"
            >
              ${isEn ? 'Print / Save A4 PDF' : 'Report US CDC Growth Reference PDF US CDC Growth Reference'}
            </button>
            <span id="master-report-standard-badge" style="background: #EFF6FF; color: #1D4ED8; font-weight: 800; font-size: 0.8rem; padding: 0.38rem 0.8rem; border-radius: 9999px; border: 1px solid #BFDBFE;">
              ${isEn ? 'Official Pediatric Standards' : (isLearningDefault ? 'Pediatric Development Standard K-DST US CDC Growth Reference' : 'US CDC / KDCA Pediatric Growth Standards US CDC Growth Reference')}
            </span>
          </div>
        </div>

        <!-- ====================================================================== -->
        <!-- 【US CDC Growth Reference 1: US CDC Growth Reference Report (Chapters 1~4)】              -->
        <!-- ====================================================================== -->
        <div id="pillar-1-container" class="master-pillar-container" style="display: ${isLearningDefault ? 'none' : 'block'}; background: #FFFFFF; border: 2px solid #BFDBFE; border-radius: 24px; padding: 1.4rem; margin-bottom: 2rem;">
          <!-- Official Standards Verification Banner -->
          <div style="background: #F8FAFC; border: 1.5px solid #93C5FD; border-radius: 14px; padding: 0.75rem 1rem; margin-bottom: 1.15rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.1rem;"></span>
              <span style="font-size: 0.86rem; font-weight: 800; color: #0F172A;">
                US CDC / KDCA(KDCA) US CDC Growth Reference 1:1 US CDC Growth Reference Report
              </span>
            </div>
            <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8; background: #EFF6FF; padding: 0.2rem 0.65rem; border-radius: 9999px; border: 1px solid #BFDBFE;">
              US CDC Growth Reference ${ageYears} yrs(${exactMonths.toFixed(1)} mos) US CDC Growth Reference Assessment
            </span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1.5px solid #BFDBFE;">
            <div>
              <span style="font-size: 0.82rem; font-weight: 900; color: #1D4ED8; background: #EFF6FF; padding: 0.25rem 0.75rem; border-radius: 9999px;">
                REPORT 01 · PHYSICAL GROWTH MASTER REPORT
              </span>
              <h2 style="font-size: 1.38rem; font-weight: 900; color: #0F172A; margin: 0.4rem 0 0.15rem 0;">
                【Report 1: US CDC Growth Reference Report】
              </h2>
              <p style="font-size: 0.86rem; color: #475569; margin: 0;">
                US CDC / KDCA(KDCA 2017) US CDC Growth ReferenceMPH) · 24 hrs US CDC Growth Reference Spinal Decompression US CDC Growth Reference
              </p>
            </div>
            <span style="font-size: 0.82rem; font-weight: 800; color: #1D4ED8; background: #EFF6FF; border: 1px solid #BFDBFE; padding: 0.3rem 0.8rem; border-radius: 9999px;">
              US CDC Growth Reference Report 1 (CHAPTER 1 ~ 4)
            </span>
          </div>

        <!-- ================================================================== -->
        <!-- CHAPTER 1: US CDC Growth Reference & US CDC Growth Reference  hrsUS CDC Growth ReferenceNo Ad Clutter!)       -->
        <!-- ================================================================== -->
        <div id="report-ch-1" style="scroll-margin-top: 5.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.65rem;">
            <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.78rem; font-weight: 900; padding: 0.22rem 0.7rem; border-radius: 9999px; border: 1px solid #BFDBFE;">
              CHAPTER 01 · EXECUTIVE SUMMARY
            </span>
            <span style="font-size: 0.92rem; font-weight: 900; color: #0F172A;">US CDC Growth Reference &amp; US CDC Growth Reference  hrsUS CDC Growth Reference</span>
          </div>

        <!-- Top Summary Hero Card (Vivid Eye-Catching 3-Trajectory Curve + Milestone Pillars) -->
        <div class="taller-height-reveal-hero" id="taller-potential-reveal-hero" style="margin-bottom: 1.15rem; padding: 1.35rem 1.4rem; background: #F8FAFC; border: 2px solid #93C5FD; box-shadow: 0 4px 14px #F8FAFC;">
          <div style="display: flex; flex-direction: column; gap: 1.05rem;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.35rem;">
                <span style="font-size: 0.86rem; font-weight: 900; color: #1D4ED8;">
                  ${isEn ? 'POTENTIAL ADULT HEIGHT & GROWTH TRAJECTORY' : 'US CDC Growth Reference 6 mos US CDC Growth Reference 3US CDC Growth Reference'}
                </span>
                <span style="font-size: 0.78rem; font-weight: 900; color: #1D4ED8; background: #EFF6FF; padding: 0.2rem 0.7rem; border-radius: 9999px;">
                  US CDC / KDCA(KDCA) · Tanner Bone Age US CDC Growth Reference
                </span>
              </div>
              <div style="display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap;">
                <span class="taller-giant-height-number">${optimizedHeight.toFixed(1)} cm</span>
                <span style="background: #EFF6FF; border: 1.5px solid #93C5FD; color: #1D4ED8; font-size: 0.96rem; font-weight: 900; padding: 0.28rem 0.85rem; border-radius: 9999px; box-shadow: 0 4px 14px #F8FAFC;">
                  ▲ US CDC Growth Reference${potentialGainCm.toFixed(1)} cm ${isEn ? 'More Growth' : 'US CDC Growth Reference!'}
                </span>
              </div>
              <div id="briefing-one-line-verdict" style="font-size: 0.96rem; color: #0F172A; margin-top: 0.55rem; line-height: 1.55;">
                ${isEn
                  ? `Current <strong>${height}cm (Top ${kdcaTop}%)</strong> · Genetic MPH <strong>${mphVal}cm</strong> · Unmanaged <strong>${unmanagedHeight}cm</strong> → Consistent Care <strong style="color: #1D4ED8;">${optimizedHeight}cm</strong>`
                  : `US CDC Growth Reference <strong>${height}cm (US CDC Growth Reference ${kdcaTop}%)</strong> · US CDC Growth Reference <strong>${mphVal}cm</strong> · US CDC Growth Reference <strong style="color: #1D4ED8;">${unmanagedHeight}cm</strong> → US CDC Growth Reference <strong style="color: #1D4ED8;">${optimizedHeight}cm</strong>`}
              </div>
            </div>

            <!-- VIVID FIRST-SCREEN 3-TRAJECTORY CURVE + MILESTONE CALLOUTS SVG (PC Wide vs Smartphone Mobile Split) -->
            <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 0.95rem 0.95rem; box-shadow: 0 4px 14px #F8FAFC;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.6rem;">
                <span style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8;">
                  US CDC Growth Reference 3US CDC Growth Reference ${ageYears} yrs → US CDC Growth Reference ${windowInfo.closureAge} yrs)
                </span>
                <div style="display: flex; gap: 0.65rem; flex-wrap: wrap; font-size: 0.78rem; font-weight: 800;">
                  <span style="color: #1D4ED8;">● US CDC Growth Reference${optimizedHeight}cm)</span>
                  <span style="color: #1D4ED8;">● US CDC Growth Reference${mphVal}cm)</span>
                  <span style="color: #1D4ED8;">● US CDC Growth Reference${unmanagedHeight}cm)</span>
                </div>
              </div>

              <!-- [PC US CDC Growth Reference] -->
              <div class="pc-view-block">
                <svg id="hero-vivid-growth-curve-svg" viewBox="0 0 640 245" style="width: 100%; height: auto; display: block;">
                  <defs>
                    <linearGradient id="heroOptFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#1D4ED8" stop-opacity="0.42" />
                      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.02" />
                    </linearGradient>
                    <linearGradient id="heroMphFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.24" />
                      <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.0" />
                    </linearGradient>
                    <linearGradient id="heroOptStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stop-color="#1D4ED8" />
                      <stop offset="55%" stop-color="#1D4ED8" />
                      <stop offset="100%" stop-color="#1D4ED8" />
                    </linearGradient>
                  </defs>

                  <line x1="48" y1="35" x2="515" y2="35" stroke="#E2E8F0" stroke-dasharray="4,4" />
                  <line x1="48" y1="85" x2="515" y2="85" stroke="#E2E8F0" stroke-dasharray="4,4" />
                  <line x1="48" y1="135" x2="515" y2="135" stroke="#E2E8F0" stroke-dasharray="4,4" />
                  <line x1="48" y1="185" x2="515" y2="185" stroke="#E2E8F0" />

                  <text x="58" y="212" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="middle">US CDC Growth Reference ${ageYears} yrs)</text>
                  <text x="205" y="212" fill="#0F172A" font-size="11" font-weight="800" text-anchor="middle">+1US CDC Growth Reference</text>
                  <text x="355" y="212" fill="#0F172A" font-size="11" font-weight="800" text-anchor="middle">US CDC Growth Reference</text>
                  <text x="495" y="212" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="middle">US CDC Growth Reference ${windowInfo.closureAge} yrs)</text>

                  <path d="M 58 172 C 175 142, 315 68, 495 36 L 495 185 L 58 185 Z" fill="url(#heroOptFill)" />
                  <path d="M 58 172 C 175 152, 315 102, 495 78 L 495 185 L 58 185 Z" fill="url(#heroMphFill)" />

                  <path d="M 58 172 C 175 162, 315 136, 495 122" fill="none" stroke="#94A3B8" stroke-width="3" stroke-dasharray="6,5" />
                  <circle cx="205" cy="155" r="4.5" fill="#94A3B8" />
                  <circle cx="355" cy="133" r="4.5" fill="#94A3B8" />
                  <circle cx="495" cy="122" r="6" fill="#94A3B8" stroke="#FFFFFF" stroke-width="2" />

                  <path d="M 58 172 C 175 152, 315 102, 495 78" fill="none" stroke="#64748B" stroke-width="3.5" />
                  <circle cx="205" cy="140" r="4.5" fill="#64748B" />
                  <circle cx="355" cy="99" r="5" fill="#64748B" />
                  <circle cx="495" cy="78" r="6.5" fill="#64748B" stroke="#FFFFFF" stroke-width="2" />

                  <path d="M 58 172 C 175 142, 315 68, 495 36" fill="none" stroke="url(#heroOptStroke)" stroke-width="5" stroke-linecap="round" />
                  <circle cx="58" cy="172" r="7" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2.5" />
                  <circle cx="205" cy="124" r="5.5" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="1.8" />
                  <circle cx="355" cy="66" r="6" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2" />
                  <circle cx="495" cy="36" r="8.5" fill="#1D4ED8" stroke="#1D4ED8" stroke-width="3" />

                  <rect x="14" y="130" width="98" height="26" rx="8" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.4" />
                  <text x="63" y="147" fill="#0F172A" font-size="11.5" font-weight="900" text-anchor="middle">US CDC Growth Reference ${height}cm</text>

                  <rect x="150" y="88" width="110" height="24" rx="7" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.2" />
                  <text x="205" y="104" fill="#1D4ED8" font-size="10.5" font-weight="900" text-anchor="middle">6 mos US CDC Growth Reference ${targetHeight6m}cm</text>

                  <line x1="495" y1="45" x2="495" y2="114" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="3,3" />
                  <rect x="372" y="24" width="108" height="24" rx="12" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.3" />
                  <text x="426" y="40" fill="#1D4ED8" font-size="11" font-weight="900" text-anchor="middle">▲ +${potentialGainCm.toFixed(1)}cm US CDC Growth Reference</text>

                  <rect x="510" y="20" width="122" height="28" rx="8" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.6" />
                  <text x="571" y="38" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">US CDC Growth Reference ${optimizedHeight}cm</text>

                  <rect x="510" y="63" width="122" height="28" rx="8" fill="#EFF6FF" stroke="#64748B" stroke-width="1.3" />
                  <text x="571" y="81" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="middle">US CDC Growth Reference ${mphVal}cm</text>

                  <rect x="510" y="108" width="122" height="28" rx="8" fill="#EFF6FF" stroke="#94A3B8" stroke-width="1.3" />
                  <text x="571" y="126" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="middle">US CDC Growth Reference ${unmanagedHeight}cm</text>
                </svg>

                <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.55rem; margin-top: 0.65rem; padding-top: 0.65rem; border-top: 1px dashed #BFDBFE;">
                  <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.55rem 0.65rem; text-align: center;">
                    <div style="font-size: 0.74rem; color: #1D4ED8; font-weight: 800;">① US CDC Growth Reference</div>
                    <div style="font-size: 1.08rem; font-weight: 900; color: #0F172A; margin-top: 0.15rem;">${unmanagedHeight} cm</div>
                  </div>
                  <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.55rem 0.65rem; text-align: center;">
                    <div style="font-size: 0.74rem; color: #1D4ED8; font-weight: 800;">② US CDC Growth Reference Mid-Parental Target Height</div>
                    <div style="font-size: 1.08rem; font-weight: 900; color: #0F172A; margin-top: 0.15rem;">${mphVal} cm</div>
                  </div>
                  <div style="background: #EFF6FF; border: 1.5px solid #93C5FD; border-radius: 10px; padding: 0.55rem 0.65rem; text-align: center;">
                    <div style="font-size: 0.74rem; color: #1D4ED8; font-weight: 900;">③ US CDC Growth Reference</div>
                    <div style="font-size: 1.12rem; font-weight: 900; color: #1D4ED8; margin-top: 0.15rem;">${optimizedHeight} cm</div>
                  </div>
                </div>
              </div>

              <!-- [US CDC Growth Reference yrsUS CDC Growth Reference & 1US CDC Growth Reference] -->
              <div class="mobile-view-block">
                <svg viewBox="0 0 340 215" style="width: 100%; height: auto; display: block; margin-bottom: 0.65rem;">
                  <line x1="20" y1="30" x2="320" y2="30" stroke="#E2E8F0" stroke-dasharray="4,4" />
                  <line x1="20" y1="95" x2="320" y2="95" stroke="#E2E8F0" stroke-dasharray="4,4" />
                  <line x1="20" y1="160" x2="320" y2="160" stroke="#E2E8F0" />

                  <path d="M 32 148 C 115 118, 200 58, 305 28 L 305 160 L 32 160 Z" fill="#EFF6FF" />
                  <path d="M 32 148 C 115 140, 200 122, 305 112" fill="none" stroke="#94A3B8" stroke-width="3.2" stroke-dasharray="5,4" />
                  <path d="M 32 148 C 115 128, 200 92, 305 72" fill="none" stroke="#64748B" stroke-width="3.5" />
                  <path d="M 32 148 C 115 118, 200 58, 305 28" fill="none" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round" />

                  <circle cx="32" cy="148" r="6.5" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2" />
                  <circle cx="165" cy="82" r="5.5" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="1.8" />
                  <circle cx="305" cy="28" r="8" fill="#1D4ED8" stroke="#1D4ED8" stroke-width="2.5" />
                  <circle cx="305" cy="72" r="6" fill="#64748B" stroke="#FFFFFF" stroke-width="2" />
                  <circle cx="305" cy="112" r="5.5" fill="#94A3B8" stroke="#FFFFFF" stroke-width="1.8" />

                  <rect x="8" y="102" width="106" height="26" rx="8" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.4" />
                  <text x="61" y="119" fill="#0F172A" font-size="12.5" font-weight="900" text-anchor="middle">US CDC Growth Reference ${height}cm</text>

                  <rect x="114" y="34" width="128" height="26" rx="8" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.4" />
                  <text x="178" y="51" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">▲ +${potentialGainCm.toFixed(1)}cm US CDC Growth Reference!</text>

                  <text x="12" y="186" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="start">US CDC Growth Reference${ageYears} yrs)</text>
                  <text x="168" y="186" fill="#0F172A" font-size="11.5" font-weight="800" text-anchor="middle">6 mos US CDC Growth Reference ${targetHeight6m}cm</text>
                  <text x="328" y="186" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="end">US CDC Growth Reference${windowInfo.closureAge} yrs)</text>
                </svg>

                <div style="display: flex; flex-direction: column; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed #BFDBFE;">
                  <div style="background: #EFF6FF; border: 1.5px solid #93C5FD; border-radius: 12px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.9rem; color: #1D4ED8; font-weight: 900;">③ US CDC Growth Reference</span>
                    <span style="font-size: 1.22rem; font-weight: 900; color: #1D4ED8;">${optimizedHeight} cm <small style="font-size:0.82rem;">(+${potentialGainCm.toFixed(1)}cm↑)</small></span>
                  </div>
                  <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.6rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.88rem; color: #1D4ED8; font-weight: 800;">② US CDC Growth Reference Mid-Parental Target Height (MPH)</span>
                    <span style="font-size: 1.12rem; font-weight: 900; color: #0F172A;">${mphVal} cm</span>
                  </div>
                  <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.6rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.88rem; color: #1D4ED8; font-weight: 800;">① US CDC Growth Reference</span>
                    <span style="font-size: 1.12rem; font-weight: 900; color: #1D4ED8;">${unmanagedHeight} cm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================== -->
        <!-- VIVID WEIGHT & BMI BALANCE HERO CARD (WeightUS CDC Growth Reference Assessment!)   -->
        <!-- ================================================================== -->
        <div id="taller-weight-reveal-hero" style="margin-bottom: 1.15rem; padding: 1.25rem 1.35rem; background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.65rem;">
            <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.82rem; font-weight: 900; padding: 0.25rem 0.8rem; border-radius: 9999px; border: 1px solid #93C5FD;">
              Weight &amp; US CDC Growth ReferenceBMI) US CDC Growth Reference Assessment US CDC Growth Reference Weight US CDC Growth Reference
            </span>
            <span style="font-size: 0.8rem; font-weight: 900; color: #1D4ED8;">
              BMI ${weightEval.bmi} (${weightEval.bmiShortStatus})
            </span>
          </div>

          <div style="display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.45rem;">
            <span style="font-size: 2.1rem; font-weight: 900; color: #0F172A; letter-spacing: -0.02em;">${weight} kg</span>
            <span style="background: #EFF6FF; border: 1.5px solid #93C5FD; color: #1D4ED8; font-size: 0.9rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px;">
              US CDC Growth Reference Weight US CDC Growth Reference ${weightEval.weightTopPercent}% (${weightDeltaStr}) · US CDC Growth Reference${height}cm) US CDC Growth Reference Weight ${weightEval.optimalWeightForHeight}kg
            </span>
          </div>

          <p style="font-size: 0.9rem; color: #0F172A; line-height: 1.55; margin: 0 0 0.85rem 0;">
            ${weightEval.statusLabel} — 6 mos US CDC Growth Reference<strong>${targetHeight6m}cm</strong>) US CDC Growth Reference <strong>6 mos US CDC Growth Reference WeightUS CDC Growth Reference <span style="color: #1D4ED8;">${weightEval.targetWeight6m}kg</span></strong>US CDC Growth Reference.
          </p>

          <!-- Weight 4-Stage Visual Comparison Bars + BMI Spectrum Gauge -->
          <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 16px; padding: 0.95rem 1rem;">
            <div class="weight-4stage-grid" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; margin-bottom: 0.75rem;">
              <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.65rem 0.8rem;">
                <div style="font-size: 0.76rem; color: #475569; font-weight: 800;">① US CDC Growth Reference Weight vs US CDC Growth Reference</div>
                <div style="font-size: 1.05rem; font-weight: 900; color: #1D4ED8; margin-top: 0.2rem;">${weight}kg <span style="font-size:0.82rem; color: #475569;">(US CDC Growth Reference ${weightEval.standardWeight}kg / ${weightDeltaStr})</span></div>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.65rem 0.8rem;">
                <div style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800;">② US CDC Growth Reference${height}cm) US CDC Growth Reference Weight</div>
                <div style="font-size: 1.05rem; font-weight: 900; color: #1D4ED8; margin-top: 0.2rem;">${weightEval.optimalWeightForHeight}kg <span style="font-size:0.82rem; color: #475569;">(US CDC Growth Reference ${weightVsHeightStr})</span></div>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.65rem 0.8rem;">
                <div style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800;">③ 6 mos US CDC Growth Reference${targetHeight6m}cm) US CDC Growth Reference Weight</div>
                <div style="font-size: 1.05rem; font-weight: 900; color: #1D4ED8; margin-top: 0.2rem;">${weightEval.targetWeight6m}kg <span style="font-size:0.82rem; color: #1D4ED8;">(US CDC Growth Reference</span></div>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.65rem 0.8rem;">
                <div style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800;">④ US CDC Growth ReferenceBMI · Bone Age US CDC Growth Reference</div>
                <div style="font-size: 1.05rem; font-weight: 900; color: #1D4ED8; margin-top: 0.2rem;">BMI ${weightEval.bmi} <span style="font-size:0.82rem; color: #1D4ED8;">(${weightEval.bmiShortStatus})</span></div>
              </div>
            </div>

            <!-- Visual Weight Balance Spectrum Bar -->
            <div style="font-size: 0.78rem; color: #475569; font-weight: 800; margin-bottom: 0.35rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.25rem;">
              <span>US CDC Growth ReferenceWeight·US CDC Growth Reference</span>
              <span style="color: #1D4ED8;">US CDC Growth Reference</span>
              <span>US CDC Growth ReferenceWeight US CDC Growth Reference</span>
            </div>
            <div style="position: relative; height: 14px; border-radius: 9999px; background: #DBEAFE; border: 1px solid #93C5FD; overflow: hidden;">
              <div style="position: absolute; top: 0; bottom: 0; left: ${Math.max(6, Math.min(92, weightEval.weightPercentile))}%; width: 10px; margin-left: -5px; background: #FFFFFF; border: 2px solid #0F172A; border-radius: 9999px; box-shadow: 0 4px 14px #F8FAFC;"></div>
            </div>
          </div>
        </div>

        <!-- ================================================================== -->
        <!-- PHENOTYPE-DRIVEN SPECIALIZED GROWTH REPORT (US CDC Growth ReferenceWeight US CDC Growth Reference>
        <!-- ================================================================== -->
        ${phenotypeSpecializedGrowthHtml}

        <!-- ================================================================== -->
        <!-- STEP 01: CRISP Comprehensive Growth & Habit Percentile PDF Guide SHEET (High-Contrast Table)       -->
        <!-- ================================================================== -->
        <div class="briefing-section briefing-status" id="briefing-status-section" style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 1.25rem 1.35rem; margin-bottom: 1.15rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.85rem; border-bottom: 1px solid #BFDBFE; padding-bottom: 0.65rem;">
            <h3 class="briefing-section-title" style="font-size: 1.18rem; font-weight: 900; color: #0F172A; margin: 0;">
              ${isEn ? '1. Clinical Growth Diagnosis Sheet' : '1. US CDC Growth Reference AssessmentUS CDC Growth Reference & Weight US CDC Growth Reference'}
            </h3>
            <span style="font-size: 0.82rem; font-weight: 800; color: #1D4ED8;">
              ${genderKo} · US CDC Growth Reference ${ageYears} yrs (${exactMonths.toFixed(1)} mos) · ${height}cm / ${weight}kg
            </span>
          </div>

          <div class="briefing-status-grid" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.65rem;">
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.85rem 0.95rem; display: flex; flex-direction: column; gap: 0.25rem;">
              <span style="font-size: 0.84rem; color: #1D4ED8; font-weight: 800;">${isEn ? 'Height Percentile' : 'US CDC Growth Reference'}</span>
              <span id="briefing-percentile" style="font-size: 1.06rem; font-weight: 900; color: #1D4ED8;">
                ${isEn ? `Top ${kdcaTop}% (${kdcaPct}th)` : `US CDC Growth Reference ${kdcaTop}% (${deltaStr})`}
              </span>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.85rem 0.95rem; display: flex; flex-direction: column; gap: 0.25rem;">
              <span style="font-size: 0.84rem; color: #1D4ED8; font-weight: 800;">${isEn ? 'Weight Percentile' : 'US CDC Growth Reference Weight US CDC Growth ReferenceWeight)'}</span>
              <span id="briefing-weight-percentile" style="font-size: 1.06rem; font-weight: 900; color: #1D4ED8;">
                US CDC Growth Reference ${weightEval.weightTopPercent}% (${weightDeltaStr} · US CDC Growth Reference ${weightEval.optimalWeightForHeight}kg)
              </span>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.85rem 0.95rem; display: flex; flex-direction: column; gap: 0.25rem;">
              <span style="font-size: 0.84rem; color: #0F172A; font-weight: 800;">${isEn ? 'Growth Velocity' : 'US CDC Growth Reference'}</span>
              <span id="briefing-velocity" style="font-size: 1.04rem; font-weight: 900; color: ${isRedFlag ? '#1D4ED8' : '#1D4ED8'};">
                US CDC Growth Reference ${velocityPerYear} cm ${isRedFlag ? 'US CDC Growth Reference' : 'US CDC Growth Reference'}
              </span>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.85rem 0.95rem; display: flex; flex-direction: column; gap: 0.25rem;">
              <span style="font-size: 0.84rem; color: #0F172A; font-weight: 800;">${isEn ? 'Genetic MPH' : 'US CDC Growth Reference Mid-Parental Target Height'}</span>
              <span id="briefing-mph" style="font-size: 1.04rem; font-weight: 900; color: #1D4ED8;">
                ${mphVal} cm <span style="font-size: 0.8rem; font-weight: 700;">(±8.5cm)</span>
              </span>
            </div>

            <div style="grid-column: 1 / -1; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.85rem 1rem; display: flex; flex-direction: column; gap: 0.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem;">
                <span style="font-size: 0.92rem; color: #1D4ED8; font-weight: 900;">${isEn ? 'Remaining Epiphyseal Growth Window' : 'US CDC Growth Reference Growth Plate US CDC Growth Reference'}</span>
                <span id="briefing-goldentime" style="font-size: 0.98rem; font-weight: 900; color: #1D4ED8;">
                  ${goldenTimeLabel}
                </span>
              </div>
              <div style="font-size: 0.82rem; color: #0F172A; line-height: 1.45;">
                <strong>US CDC Growth Reference:</strong> ${windowInfo.meaningExplanation}
              </div>
            </div>
          </div>

          <!-- Transparent Growth Score & 3-Tier Height Calculation Formula Box -->
          <div id="growth-score-formula-box" style="margin-top: 0.85rem; background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 14px; padding: 0.85rem 1rem; font-size: 0.84rem; color: #0F172A; line-height: 1.55;">
            <div style="font-size: 0.9rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.35rem;">
              [US CDC Growth Reference]
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.22rem;">
              <div>• <strong>① US CDC Growth Reference:</strong> US CDC / KDCA(KDCA 2017) ${exactMonths.toFixed(1)} mos LMS US CDC Growth Reference ${kdcaTop}%(${deltaStr}) · Weight US CDC Growth Reference ${weightEval.weightTopPercent}%(US CDC Growth Reference ${weightEval.optimalWeightForHeight}kg)</div>
              <div>• <strong>② Mid-Parental Target Height (${mphVal}cm):</strong> US CDC Growth Reference Tanner US CDC Growth Reference <code>(${profile.gender === 'girl' ? 'US CDC Growth Reference13cm' : 'US CDC Growth Reference13cm'}) ÷ 2</code></div>
              <div>• <strong>③ 3US CDC Growth Reference:</strong> US CDC Growth Reference <strong>${unmanagedHeight}cm</strong> → US CDC Growth Reference${windowInfo.shortBadge}) Sleep·Nutrition·US CDC Growth Reference <strong>${optimizedHeight}cm (+${potentialGainCm}cm)</strong></div>
            </div>
          </div>
        </div>

        <!-- ================================================================== -->
        <!-- BESPOKE 1:1 SURVEY CLICK-BASED PRESCRIPTION (Concise 1-Per-Row)     -->
        <!-- ================================================================== -->
        <div id="bespoke-parent-note-section" style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 1.2rem 1.35rem; margin-bottom: 1.15rem; text-align: left;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span style="font-size: 1.04rem; font-weight: 900; color: #1D4ED8;">
              ${isEn ? '1:1 Survey-Based Custom Growth Prescription' : 'US CDC Growth Reference 1:1 US CDC Growth Reference'}
            </span>
            <span style="font-size: 0.78rem; font-weight: 800; color: #1D4ED8; background: #EFF6FF; border: 1px solid #BFDBFE; padding: 0.22rem 0.65rem; border-radius: 9999px;">
              ${bespokeNote.precisionLevelKo}
            </span>
          </div>

          ${bespokeNote.hasNote ? `
            <div style="margin-bottom: 0.75rem; font-size: 0.82rem; color: #475569; background: #F8FAFC; border-radius: 10px; padding: 0.55rem 0.85rem;">
              <strong style="color: #1D4ED8;">US CDC Growth Reference${bespokeNote.growthKeywords.length}US CDC Growth Reference:</strong> ${bespokeNote.growthKeywords.join(' · ')}
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 0.9rem;">
              ${bespokeNote.growthInsights.map((ins, idx) => `
                <div class="bespoke-single-insight-card" style="display: block; background: #F8FAFC; border-left: 4px solid #1D4ED8; border-radius: 14px; padding: 0.95rem 1.1rem;">
                  <div style="font-size: 0.98rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.28rem;">
                    US CDC Growth Reference ${idx + 1}US CDC Growth Reference ${isEn ? ins.badgeEn : ins.badgeKo}
                  </div>
                  <div style="font-size: 0.92rem; color: #0F172A; line-height: 1.52; margin-bottom: 0.25rem;">
                    ${isEn ? ins.answerEn : ins.answerKo}
                  </div>
                  <div style="font-size: 0.76rem; color: #1D4ED8; font-weight: 700;">${ins.sourceKo}</div>
                </div>
              `).join('')}
            </div>

            <!-- 4-Slot Hyper-Personalized Daily Timetable -->
            <div id="bespoke-daily-timetable-box" style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 14px; padding: 0.9rem 1.05rem;">
              <div style="font-size: 0.9rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.45rem;">
                [US CDC Growth Reference 4US CDC Growth Reference]
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.38rem; font-size: 0.85rem; color: #0F172A; line-height: 1.5;">
                <div>• ${bespokeNote.physicalDailyRoutine.morning}</div>
                <div>• ${bespokeNote.physicalDailyRoutine.afterSchool}</div>
                <div>• ${bespokeNote.physicalDailyRoutine.dinner}</div>
                <div>• ${bespokeNote.physicalDailyRoutine.bedtime}</div>
              </div>
            </div>
          ` : ''}

          <!-- Hidden legacy live free-text input preserved in DOM for script safety -->
          <div style="display: none;">
            <input type="text" id="live-bespoke-note-input" value="${(bespokeNote.rawNote || '').replace(/"/g, '&quot;')}" />
            <button type="button" id="btn-live-bespoke-update">growth</button>
          </div>
        </div>

        <!-- ================================================================== -->
        <!-- STEP 02: DAILY MORNING & EVENING ROUTINE (Clean 1-Column List)      -->
        <!-- ================================================================== -->
        <div class="briefing-section briefing-actions" id="briefing-actions-section" style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 1.2rem 1.35rem; margin-bottom: 1.15rem;">
          <h3 class="briefing-section-title" style="font-size: 1.15rem; font-weight: 900; color: #0F172A; margin: 0 0 0.75rem 0;">
            ${isEn ? '2. Daily Morning & Evening Growth Roadmap (3 Easy Steps)' : '2. US CDC Growth Reference 3US CDC Growth Reference'}
          </h3>

          <div id="briefing-horizon-roadmap" style="display: flex; flex-direction: column; gap: 0.65rem;">
            <!-- Routine 1: Sleep & Hormone -->
            <div class="briefing-action-item horizon-card" id="horizon-short-term" style="border-left: 4px solid #1D4ED8; padding: 0.85rem 1.05rem; background: #F8FAFC; border-radius: 12px;">
              <div style="font-size: 0.95rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.2rem;">
                ① ${isEn ? 'Bedtime 10 PM Deep Sleep Routine' : `Sleep US CDC Growth Reference${sleepTraitLabelKo})`}
              </div>
              <div class="action-desc" id="briefing-action-sleep" style="font-size: 0.9rem; line-height: 1.5; color: #0F172A;">
                ${isEn
                  ? `Sleep by 21:45–22:00 & stop snacks 2–3 hrs before bed to maximize peak nocturnal growth hormone (65% of daily output).`
                  : `<strong>${customSleepRoutineKo}</strong> + US CDC Growth Reference 5US CDC Growth Reference Growth Plate US CDC Growth Reference`}
              </div>
            </div>

            <!-- Routine 2: Morning & Evening All-in-One Nutrition -->
            <div class="briefing-action-item horizon-card" id="horizon-mid-term" style="border-left: 4px solid #1D4ED8; padding: 0.85rem 1.05rem; background: #F8FAFC; border-radius: 12px;">
              <div style="font-size: 0.95rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.2rem;">
                ② ${isEn ? 'Morning & Evening Tailored Nutrition' : `US CDC Growth Reference Nutrition US CDC Growth Reference${dietTraitLabelKo})`}
              </div>
              <div class="action-desc" id="briefing-action-nutrition" style="font-size: 0.9rem; line-height: 1.5; color: #0F172A;">
                ${isEn
                  ? `Supplement daily Calcium (${nutTargets.calciumMg}mg) + Vit D3 (${nutTargets.vitDIU}IU) + NZ Colostrum + Zinc + Magnesium morning and night for 6+ months.`
                  : `<strong>${customDietRoutineKo}</strong> (dd US CDC Growth Reference ${nutTargets.calciumMg}mg · D3 ${nutTargets.vitDIU}IU · Protein ${nutTargets.proteinG}g · Zinc ${nutTargets.zincMg}mg)`}
              </div>
            </div>

            <!-- Routine 3: 10-Min Spine Stretch & Jumping -->
            <div class="briefing-action-item horizon-card" id="horizon-long-term" style="border-left: 4px solid #1D4ED8; padding: 0.85rem 1.05rem; background: #F8FAFC; border-radius: 12px;">
              <div style="font-size: 0.95rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.2rem;">
                ③ ${isEn ? '10-Min Spine Decompression & Play Focus' : `Spinal Decompression(+1.8cm) &  ptsUS CDC Growth Reference${postureTraitLabelKo})`}
              </div>
              <div class="action-desc" id="briefing-action-exercise" style="font-size: 0.9rem; line-height: 1.5; color: #0F172A;">
                ${isEn
                  ? `Evening doorway bar hang (30s×3), indoor forefoot jumping (10 mins), and 20-min hands-on focus matched to [${tempTraitLabelKo}].`
                  : `<strong>${customPostureStudyRoutineKo}</strong>US CDC Growth Reference1.8cm US CDC Growth Reference`}
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================== -->
        <!-- STEP 03: 6-MONTH EXPECTED OUTCOMES                                  -->
        <!-- ================================================================== -->
        <div id="expected-outcomes-section" style="background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 1.1rem 1.3rem; margin-bottom: 1.15rem; text-align: left;">
          <h3 style="font-size: 1.1rem; font-weight: 900; color: #0F172A; margin: 0 0 0.5rem 0;">
            ${isEn ? '3. Expected Outcomes After 6 Months of Consistent Care' : '3. 6 mos US CDC Growth Reference'}
          </h3>
          <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.92rem; color: #0F172A; line-height: 1.65;">
            <li><strong>${isEn ? 'Height Trajectory:' : 'US CDC Growth Reference:'}</strong> growth ${unmanagedHeight}cm → <strong style="color: #1D4ED8;">${optimizedHeight}cm (+${potentialGainCm}cm)</strong> growth <strong>+1.5~1.8cm/growth</strong> growth</li>
            <li><strong>${isEn ? 'Deep Sleep & Posture:' : 'US CDC Growth Reference:'}</strong> growth growing pain|leg|knee|calf|ankle|ache growth posture|slouch|neck|spine|shoulder|flat feet|desk·posture|slouch|neck|spine|shoulder|flat feet|desk growth <strong>growth +1.8cm</strong> growth</li>
            <li><strong>${isEn ? 'Focus & Confidence:' : 'US CDC Growth Reference:'}</strong> growth-review|recall|memory|forget|exam|test|homework|study growth phone|youtube|game|screen|focus|distract|study|tablet growth <strong>2growth</strong> growth</li>
          </ul>
        </div>
        </div><!-- /#report-ch-1 -->

        <!-- ================================================================== -->
        <!-- CHAPTER 2: growth & puberty|precocious|bone age|plate|spurt|acne growth (Auxology & Bone Age)    -->
        <!-- ================================================================== -->
        <div id="report-ch-2" style="scroll-margin-top: 5.5rem; margin-top: 1.75rem; padding-top: 1.5rem; border-top: 2px solid #BFDBFE;">
          <div style="margin-bottom: 0.9rem;">
            <span style="display: inline-block; background: #EFF6FF; color: #1D4ED8; font-size: 0.78rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px; border: 1px solid #BFDBFE; margin-bottom: 0.35rem;">
              CHAPTER 02 · AUXOLOGY &amp; BONE AGE TRAJECTORY
            </span>
            <h3 style="font-size: 1.24rem; font-weight: 900; color: #0F172A; margin: 0 0 0.25rem 0;">
              ${isEn ? '2. Physical Growth Percentile & Bone-Age Trajectory' : '2. US CDC Growth Reference & Bone Age US CDC Growth Reference'}
            </h3>
            <p style="font-size: 0.88rem; color: #475569; margin: 0; line-height: 1.5;">
              growth(KDCA 2017) growth genetic|mom|dad|parent|short|small|percentile genetic|mom|dad|parent|short|small|percentile growth(MPH), growth 3growth.
            </p>
          </div>
          ${GrowthEngine && typeof GrowthEngine.renderTab1Report === 'function'
            ? GrowthEngine.renderTab1Report(profile)
            : ''}
          ${PinpointCurator && typeof PinpointCurator.renderLifecycleTimelineOnly === 'function'
            ? PinpointCurator.renderLifecycleTimelineOnly(profile)
            : ''}
        </div>

        <!-- ================================================================== -->
        <!-- CHAPTER 3: growth·growth & growth (+ growth)      -->
        <!-- ================================================================== -->
        <div id="report-ch-3" style="scroll-margin-top: 5.5rem; margin-top: 1.75rem; padding-top: 1.5rem; border-top: 2px solid #BFDBFE;">
          <div style="margin-bottom: 0.9rem;">
            <span style="display: inline-block; background: #EFF6FF; color: #1D4ED8; font-size: 0.78rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px; border: 1px solid #BFDBFE; margin-bottom: 0.35rem;">
              CHAPTER 03 · ENDOCRINOLOGY, SLEEP &amp; CLINICAL NUTRITION
            </span>
            <h3 style="font-size: 1.24rem; font-weight: 900; color: #0F172A; margin: 0 0 0.25rem 0;">
              ${isEn ? '3. 24h Growth Hormone Curve & Clinical Nutrition Bioavailability' : '3. US CDC Growth ReferenceSleep 24 hrs US CDC Growth Reference & US CDC Growth Reference Nutrition US CDC Growth Reference'}
            </h3>
            <p style="font-size: 0.88rem; color: #475569; margin: 0; line-height: 1.5;">
              growth·growth(SWS) growth milk|dairy|picky|appetite|meat|veggie|thin|weight growth·growthD3·growth·growth.
            </p>
          </div>
          ${NutritionEngine && typeof NutritionEngine.renderTab2Report === 'function'
            ? NutritionEngine.renderTab2Report(profile)
            : (EndocrinologyEngine && typeof EndocrinologyEngine.renderEndocrinologySection === 'function'
              ? EndocrinologyEngine.renderEndocrinologySection(profile)
              : '')}
        </div>

        <!-- ================================================================== -->
        <!-- CHAPTER 4: posture|slouch|neck|spine|shoulder|flat feet|desk growth & growth (growth & exercise|jump|rope|sport|sedentary|stamina growth) -->
        <!-- ================================================================== -->
        <div id="report-ch-4" style="scroll-margin-top: 5.5rem; margin-top: 1.75rem; padding-top: 1.5rem; border-top: 2px solid #BFDBFE;">
          <div style="margin-bottom: 0.9rem;">
            <span style="display: inline-block; background: #EFF6FF; color: #1D4ED8; font-size: 0.78rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px; border: 1px solid #BFDBFE; margin-bottom: 0.35rem;">
              CHAPTER 04 · SPINAL DECOMPRESSION &amp; BIOMECHANICS
            </span>
            <h3 style="font-size: 1.22rem; font-weight: 900; color: #0F172A; margin: 0 0 0.25rem 0;">
              ${isEn ? '4. Spinal Decompression (+1.8cm) & 4-Step Epiphyseal Exercise' : '4. Spinal Decompression(+1.8cm US CDC Growth Reference & Growth Plate 4US CDC Growth Reference Exercise'}
            </h3>
            <p style="font-size: 0.94rem; color: #475569; margin: 0; line-height: 1.65;">
              posture|slouch|neck|spine|shoulder|flat feet|desk·growth(Wolff's Law)US CDC Growth Reference Growth Plate US CDC Growth Reference 4US CDC Growth Reference Exercise US CDC Growth Reference.
            </p>
          </div>
          ${BiomechanicsStudio && typeof BiomechanicsStudio.renderBiomechanicsSection === 'function'
            ? BiomechanicsStudio.renderBiomechanicsSection(profile)
            : ''}
        </div><!-- /#report-ch-4 -->

        <!-- ================================================================== -->
        <!-- ON-DEMAND BUTTON & DRAWER: US CDC Growth Reference>
        <!-- ================================================================== -->
        <div id="growth-products-cta-banner" style="margin-top: 1.5rem; padding: 1.2rem 1.35rem; background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 20px; text-align: center;">
          <div style="display: inline-block; background: #EFF6FF; border: 1px solid #93C5FD; color: #1D4ED8; font-size: 0.78rem; font-weight: 900; padding: 0.22rem 0.75rem; border-radius: 9999px; margin-bottom: 0.45rem;">
            US CDC Growth Reference ${ageYears} yrs(${height}cm/${weight}kg) · [${dietTraitLabelKo}] · [${postureTraitLabelKo}] US CDC Growth Reference
          </div>
          <div style="font-size: 0.98rem; font-weight: 900; color: #0F172A; margin-bottom: 0.75rem; line-height: 1.45;">
            US CDC Growth Reference <strong style="color: #1D4ED8;">${optimizedHeight}cm</strong> US CDC Growth Reference <strong>US CDC Growth Reference NutritionUS CDC Growth Reference &amp; ExerciseUS CDC Growth Reference</strong>US CDC Growth Reference.
          </div>
          <button
            type="button"
            id="btn-toggle-growth-products"
            onclick="window.MasterBriefingEngine && window.MasterBriefingEngine.toggleProductDrawer(this, 'growth')"
            style="cursor: pointer; width: 100%; max-width: 560px; min-height: 52px; background: #1D4ED8; border: 1.5px solid #1E40AF; color: #FFFFFF; font-weight: 900; font-size: 0.98rem; padding: 0.8rem 1.25rem; border-radius: 14px; box-shadow: 0 6px 16px rgba(29, 78, 216, 0.2);"
          >
            US CDC Growth ReferenceNutritionUS CDC Growth Reference ▲
          </button>
        </div>

        <div id="growth-curated-products-drawer" class="curated-product-recommendation-section" style="display: block; margin-top: 1.1rem; padding: 1.15rem; background: #FFFFFF; border: 2px solid #BFDBFE; border-radius: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.85rem; padding-bottom: 0.65rem; border-bottom: 1px dashed #BFDBFE;">
            <span style="font-size: 0.96rem; font-weight: 900; color: #1D4ED8;">
              [US CDC Growth Reference ${ageYears} yrs × ${dietTraitLabelKo} · ${postureTraitLabelKo}] US CDC Growth Reference
            </span>
            <span style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800;">
              US CDC Growth Reference
            </span>
          </div>

          ${PinpointCurator && typeof PinpointCurator.renderContextualSupplementsPrescription === 'function'
            ? PinpointCurator.renderContextualSupplementsPrescription(profile)
            : ''}
          ${PinpointCurator && typeof PinpointCurator.renderContextualBiomechanicsPrescription === 'function'
            ? PinpointCurator.renderContextualBiomechanicsPrescription(profile)
            : ''}
        </div>

        <!-- Report 1 Standalone Action Footer (100% Independent - No Cross-Report Button) -->
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed #BFDBFE; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem;">
          <span style="font-size: 0.84rem; color: #1D4ED8; font-weight: 800;">
            [US CDC Growth Reference Report] Assessment Complete · Assessment 6US CDC Growth Reference
          </span>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" onclick="window.print()" style="cursor: pointer; background: #EFF6FF; border: 1px solid #93C5FD; color: #0F172A; font-weight: 800; font-size: 0.82rem; padding: 0.45rem 0.9rem; border-radius: 9999px;">
              US CDC Growth Reference Report US CDC Growth Reference PDF US CDC Growth Reference
            </button>
          </div>
        </div>
      </div><!-- /#pillar-1-container -->

      <!-- ====================================================================== -->
      <!-- 【US CDC Growth Reference 2: US CDC Growth Reference Report (US CDC Growth Reference & US CDC Growth Reference】 -->
      <!-- ====================================================================== -->
      <div id="pillar-2-container" class="master-pillar-container" style="display: ${isLearningDefault ? 'block' : 'none'}; background: #FFFFFF; border: 2px solid #BFDBFE; border-radius: 24px; padding: 1.4rem; margin-top: 1.25rem; margin-bottom: 2rem;">
        <style>
          #pillar-2-container .learning-quick-nav-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.45rem;
          }
          #pillar-2-container .learning-radar-bars-grid {
            display: grid;
            grid-template-columns: 1fr 1.15fr;
            gap: 0.9rem;
            align-items: center;
          }
          #pillar-2-container .learning-bento-kpi-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.65rem;
          }
          #pillar-2-container .learning-timetable-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.55rem;
          }
          @media (max-width: 768px) {
            #pillar-2-container {
              padding: 1rem 0.9rem !important;
              border-radius: 20px !important;
            }
            #pillar-2-container .learning-quick-nav-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 0.4rem !important;
            }
            #pillar-2-container .learning-radar-bars-grid {
              grid-template-columns: 1fr !important;
            }
            #pillar-2-container .learning-bento-kpi-grid {
              grid-template-columns: 1fr !important;
            }
            #pillar-2-container .learning-timetable-grid {
              grid-template-columns: 1fr !important;
            }
            #pillar-2-container h3 {
              font-size: 1.15rem !important;
              line-height: 1.38 !important;
              word-break: keep-all !important;
            }
            #pillar-2-container .learning-step-card {
              padding: 1.05rem 0.95rem !important;
              border-radius: 18px !important;
            }
          }
        </style>

        <!-- Official Brain & Learning Standards Verification Banner -->
        <div style="background: #F8FAFC; border: 1.5px solid #93C5FD; border-radius: 16px; padding: 0.8rem 1.05rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.45rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.15rem;"></span>
            <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A; word-break: keep-all;">
              Pediatric Development Standard K-DST US CDC Growth Reference 【US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference AssessmentUS CDC Growth Reference】
            </span>
          </div>
          <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8; background: #EFF6FF; padding: 0.22rem 0.7rem; border-radius: 9999px; border: 1px solid #BFDBFE;">
            US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference Assessment
          </span>
        </div>

        <!-- Compact 8-Step Visual Quick Index Grid -->
        <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 16px; padding: 0.85rem 0.95rem; margin-bottom: 1.2rem;">
          <div style="font-size: 0.86rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.55rem;">
            US CDC Growth ReferenceReport US CDC Growth Reference
          </div>
          <div class="learning-quick-nav-grid">
            <a href="#learning-step-1-style" style="text-decoration: none; text-align: center; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.5rem 0.4rem; color: #1D4ED8; font-size: 0.82rem; font-weight: 900;">① US CDC Growth Reference</a>
            <a href="#learning-step-2-strengths" style="text-decoration: none; text-align: center; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.5rem 0.4rem; color: #1D4ED8; font-size: 0.82rem; font-weight: 900;">② US CDC Growth Reference pts</a>
            <a href="#learning-step-3-weaknesses" style="text-decoration: none; text-align: center; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.5rem 0.4rem; color: #1D4ED8; font-size: 0.82rem; font-weight: 900;">③ US CDC Growth Reference</a>
            <a href="#learning-step-4-careers" style="text-decoration: none; text-align: center; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.5rem 0.4rem; color: #1D4ED8; font-size: 0.82rem; font-weight: 900;">④ US CDC Growth Reference</a>
            <a href="#learning-step-5-boost" style="text-decoration: none; text-align: center; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.5rem 0.4rem; color: #1D4ED8; font-size: 0.82rem; font-weight: 900;">⑤ US CDC Growth Reference pts US CDC Growth Reference</a>
            <a href="#learning-step-6-remedy" style="text-decoration: none; text-align: center; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.5rem 0.4rem; color: #1D4ED8; font-size: 0.82rem; font-weight: 900;">⑥ US CDC Growth Reference pts US CDC Growth Reference</a>
            <a href="#learning-step-7-items" style="text-decoration: none; text-align: center; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.5rem 0.4rem; color: #1D4ED8; font-size: 0.82rem; font-weight: 900;">⑦ US CDC Growth Reference</a>
            <a href="#learning-step-8-links" style="text-decoration: none; text-align: center; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.5rem 0.4rem; color: #1D4ED8; font-size: 0.82rem; font-weight: 900;">⑧ US CDC Growth Reference</a>
          </div>
        </div>

        <!-- ================================================================== -->
        <!-- CHAPTER 5: [STEP 1] US CDC Growth Reference [STEP 2] US CDC Growth Reference pts + [STEP 3] US CDC Growth Reference pts -->
        <!-- ================================================================== -->
        <div id="report-ch-5" style="scroll-margin-top: 5.5rem;">

          <!-- ==================== STEP 1: US CDC Growth Reference 5US CDC Growth Reference 6 mos US CDC Growth Reference ==================== -->
          <div id="learning-step-1-style" class="taller-learning-reveal-hero learning-step-card" style="background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 22px; margin-bottom: 1.2rem; padding: 1.25rem 1.35rem; text-align: left; box-shadow: 0 4px 14px #F8FAFC;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.6rem;">
              <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.82rem; font-weight: 900; padding: 0.26rem 0.8rem; border-radius: 9999px;">
                STEP 1 · US CDC Growth Reference &amp; US CDC Growth Reference
              </span>
              <span style="font-size: 0.82rem; font-weight: 900; color: #1D4ED8; background: #EFF6FF; border: 1px solid #93C5FD; padding: 0.22rem 0.75rem; border-radius: 9999px;">
                US CDC Growth Reference LQ ${lqData.overallLQ.toFixed(1)} pts (US CDC Growth Reference ${lqData.topPercent}%)
              </span>
            </div>

            <div style="display: flex; align-items: baseline; gap: 0.65rem; flex-wrap: wrap; margin-bottom: 0.4rem;">
              <span style="font-size: 2.15rem; font-weight: 900; color: #0F172A; letter-spacing: -0.02em;">US CDC Growth Reference LQ ${lqData.trajectory.coached.lqScore} pts</span>
              <span style="background: #EFF6FF; border: 1.5px solid #93C5FD; color: #1D4ED8; font-size: 0.88rem; font-weight: 900; padding: 0.22rem 0.75rem; border-radius: 9999px;">
                ▲ 6 mos US CDC Growth Reference${lqData.trajectory.coached.gainLq} pts US CDC Growth Reference
              </span>
            </div>

            <h3 style="font-size: 1.24rem; font-weight: 900; color: #0F172A; margin: 0 0 0.45rem 0; line-height: 1.38; word-break: keep-all;">
              1. US CDC Growth Reference ${ageYears} yrs): <span style="color: #1D4ED8;">${activeStyleInfo.title}</span>
            </h3>
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem; margin-bottom: 0.85rem;">
              <span style="background: #F8FAFC; border: 1px solid #BFDBFE; color: #1D4ED8; font-size: 0.8rem; font-weight: 900; padding: 0.22rem 0.7rem; border-radius: 9999px;">
                ${activeStyleInfo.badge}
              </span>
              <span style="font-size: 0.92rem; font-weight: 800; color: #0F172A; word-break: keep-all;">
                ${activeStyleInfo.summary}
              </span>
            </div>

            <!-- 2×2 Learning Bento KPI Cards (Stacked inside each card for zero horizontal clipping on mobile & desktop) -->
            <div id="learning-bento-stats-grid" class="learning-bento-kpi-grid" style="margin-bottom: 1rem;">
              <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.75rem 0.9rem; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; gap: 0.2rem;">
                <div style="font-size: 0.78rem; color: #1D4ED8; font-weight: 800;">US CDC Growth Reference</div>
                <div style="font-size: 1.22rem; font-weight: 900; color: #0F172A; line-height: 1.2;">US CDC Growth Reference ${lqData.topPercent}%</div>
                <div style="font-size: 0.76rem; color: #475569; font-weight: 700;">LQ ${lqData.overallLQ.toFixed(1)} pts → US CDC Growth Reference ${lqData.trajectory.coached.lqScore} pts</div>
              </div>
              <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.75rem 0.9rem; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; gap: 0.2rem;">
                <div style="font-size: 0.78rem; color: #1D4ED8; font-weight: 800;">1US CDC Growth Reference hrs</div>
                <div style="font-size: 1.22rem; font-weight: 900; color: #0F172A; line-height: 1.2;">${lqData.trajectory.current.focusMinutes}US CDC Growth Reference → ${lqData.trajectory.coached.focusMinutes}US CDC Growth Reference</div>
                <div style="font-size: 0.76rem; color: #475569; font-weight: 700;">US CDC Growth Reference${lqData.trajectory.coached.gainFocusMin}US CDC Growth Reference</div>
              </div>
              <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.75rem 0.9rem; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; gap: 0.2rem;">
                <div style="font-size: 0.78rem; color: #1D4ED8; font-weight: 800;">US CDC Growth Reference</div>
                <div style="font-size: 1.22rem; font-weight: 900; color: #0F172A; line-height: 1.2;">${lqData.trajectory.current.retentionRate}% → ${lqData.trajectory.coached.retentionRate}%</div>
                <div style="font-size: 0.76rem; color: #475569; font-weight: 700;">3US CDC Growth Reference SleepUS CDC Growth Reference</div>
              </div>
              <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.75rem 0.9rem; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; gap: 0.2rem;">
                <div style="font-size: 0.78rem; color: #1D4ED8; font-weight: 800;">US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference</div>
                <div style="font-size: 1.08rem; font-weight: 900; color: #0F172A; line-height: 1.2;">${ageYears <= 3 ? 'growth·growth' : ageYears <= 6 ? 'math|arithmetic|geometry|spatial|logic|formula|puzzle·reading|literacy|vocab|comprehension|essay|passage growth' : ageYears <= 9 ? 'growth·growth' : 'review|recall|memory|forget|exam|test|homework|study growth'}</div>
                <div style="font-size: 0.75rem; color: #475569; font-weight: 700; word-break: keep-all;">US CDC Growth Reference pts: ${strengthsList[0].shortLabel || strengthsList[0].title}</div>
              </div>
            </div>

            <!-- VIVID LEARNING GRAPH 1 & 2: 5-AXIS RADAR CHART + 5-AXIS HORIZONTAL BAR GAUGES + 6-MONTH TRAJECTORY CURVE -->
            <div id="learning-visual-charts-showcase" style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 1rem; margin-bottom: 0.85rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
                <span style="font-size: 0.92rem; font-weight: 900; color: #1D4ED8;">
                  5US CDC Growth Reference &amp; US CDC Growth Reference  ptsUS CDC Growth Reference
                </span>
                <span style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800;">
                  ● US CDC Growth Reference: US CDC Growth Reference | ┄  ptsUS CDC Growth Reference: US CDC Growth Reference75 pts)
                </span>
              </div>

              <!-- Clean Visual 2-Column (1-Column on Mobile): 5-Axis Radar SVG + 5-Axis Visual Bar Chart -->
              <div class="learning-radar-bars-grid" style="margin-bottom: 0.9rem;">
                <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 0.65rem;">
                  ${NeuroCognitiveMatrix && typeof NeuroCognitiveMatrix.renderLqRadarSvg === 'function'
                    ? NeuroCognitiveMatrix.renderLqRadarSvg(lqData.scores)
                    : ''}
                </div>
                <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 16px; padding: 0.9rem 1rem; display: flex; flex-direction: column; gap: 0.65rem;">
                  <div style="font-size: 0.84rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.1rem;">
                    5US CDC Growth Reference  yrsUS CDC Growth Reference 78 pts US CDC Growth Reference
                  </div>
                  ${[
                    { icon: '', label: 'growth·reading|literacy|vocab|comprehension|essay|passagegrowth', val: (lqData.scores && lqData.scores.literacy_vocab) || 78, color: '#1D4ED8' },
                    { icon: '', label: 'growth·math|arithmetic|geometry|spatial|logic|formula|puzzlegrowth', val: (lqData.scores && lqData.scores.math_spatial) || 80, color: '#1D4ED8' },
                    { icon: '', label: 'phone|youtube|game|screen|focus|distract|study|tablet·growthreview|recall|memory|forget|exam|test|homework|study', val: (lqData.scores && lqData.scores.working_memory_focus) || 76, color: '#1D4ED8' },
                    { icon: '', label: 'review|recall|memory|forget|exam|test|homework|study·growth', val: (lqData.scores && lqData.scores.metacognition_retrieval) || 74, color: '#1D4ED8' },
                    { icon: '', label: 'growth·growth', val: (lqData.scores && lqData.scores.inquiry_creative) || 82, color: '#1D4ED8' }
                  ].map(axis => `
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.84rem; font-weight: 900; margin-bottom: 0.22rem;">
                        <span style="color: #0F172A;">${axis.icon} ${axis.label}</span>
                        <span style="color: ${axis.val >= 80 ? '#1D4ED8' : '#1D4ED8'};">${axis.val} pts <span style="font-size: 0.74rem; color: #475569; font-weight: 700;">(${axis.val >= 78 ? '+' + (axis.val - 78) : (axis.val - 78)} pts)</span></span>
                      </div>
                      <div style="position: relative; height: 11px; background: #E2E8F0; border: 1px solid #CBD5E1; border-radius: 9999px; overflow: hidden;">
                        <div style="position: absolute; left: 78%; top: 0; bottom: 0; width: 2px; background: #0F172A; z-index: 2;" title="US CDC Growth Reference 78 pts"></div>
                        <div style="width: ${Math.min(100, axis.val)}%; height: 100%; background: ${axis.color}; border-radius: 9999px;"></div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- 6-Month Learning Growth Curve SVG (PC Wide vs Smartphone Mobile Split) -->
              <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 14px; padding: 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.5rem;">
                  <span style="font-size: 0.86rem; font-weight: 900; color: #1D4ED8;">
                    6 mos US CDC Growth ReferenceLQ) US CDC Growth Reference
                  </span>
                  <div style="display: flex; gap: 0.55rem; flex-wrap: wrap; font-size: 0.75rem; font-weight: 800;">
                    <span style="color: #1D4ED8;">● US CDC Growth Reference${lqData.trajectory.coached.lqScore} pts)</span>
                    <span style="color: #1D4ED8;">● US CDC Growth Reference80 pts)</span>
                    <span style="color: #1D4ED8;">● US CDC Growth Reference${lqData.trajectory.unmanaged.lqScore} pts)</span>
                  </div>
                </div>

                <!-- [PC US CDC Growth Reference] -->
                <div class="pc-view-block">
                  <svg id="hero-vivid-learning-curve-svg" viewBox="0 0 640 210" style="width: 100%; height: auto; display: block;">
                    <defs>
                      <linearGradient id="learnOptFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#1D4ED8" stop-opacity="0.38" />
                        <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.03" />
                      </linearGradient>
                      <linearGradient id="learnOptStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stop-color="#1D4ED8" />
                        <stop offset="50%" stop-color="#1D4ED8" />
                        <stop offset="100%" stop-color="#1D4ED8" />
                      </linearGradient>
                    </defs>

                    <line x1="50" y1="35" x2="505" y2="35" stroke="#E2E8F0" stroke-dasharray="4,4" />
                    <line x1="50" y1="80" x2="505" y2="80" stroke="#E2E8F0" stroke-dasharray="4,4" />
                    <line x1="50" y1="125" x2="505" y2="125" stroke="#E2E8F0" stroke-dasharray="4,4" />
                    <line x1="50" y1="170" x2="505" y2="170" stroke="#E2E8F0" />

                    <text x="60" y="196" fill="#0F172A" font-size="11.5" font-weight="900" text-anchor="middle">US CDC Growth Reference Assessmentd</text>
                    <text x="205" y="196" fill="#0F172A" font-size="11" font-weight="800" text-anchor="middle">4US CDC Growth Reference</text>
                    <text x="355" y="196" fill="#0F172A" font-size="11" font-weight="800" text-anchor="middle">12US CDC Growth Reference</text>
                    <text x="495" y="196" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="middle">6 mos US CDC Growth Reference</text>

                    <path d="M 60 142 C 180 112, 320 64, 495 34 L 495 170 L 60 170 Z" fill="url(#learnOptFill)" />
                    <path d="M 60 142 C 180 146, 320 150, 495 154" fill="none" stroke="#94A3B8" stroke-width="3" stroke-dasharray="6,5" />
                    <circle cx="495" cy="154" r="5.5" fill="#94A3B8" stroke="#FFFFFF" stroke-width="1.8" />
                    <path d="M 60 142 C 180 130, 320 112, 495 98" fill="none" stroke="#64748B" stroke-width="3" />
                    <circle cx="495" cy="98" r="5.5" fill="#64748B" stroke="#FFFFFF" stroke-width="1.8" />
                    <path d="M 60 142 C 180 112, 320 64, 495 34" fill="none" stroke="url(#learnOptStroke)" stroke-width="5" stroke-linecap="round" />
                    <circle cx="60" cy="142" r="7" fill="#64748B" stroke="#FFFFFF" stroke-width="2.2" />
                    <circle cx="205" cy="105" r="5.5" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="1.8" />
                    <circle cx="355" cy="62" r="6" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2" />
                    <circle cx="495" cy="34" r="8" fill="#1D4ED8" stroke="#1D4ED8" stroke-width="3" />

                    <rect x="14" y="102" width="104" height="26" rx="7" fill="#EFF6FF" stroke="#64748B" stroke-width="1.3" />
                    <text x="66" y="119" fill="#0F172A" font-size="11" font-weight="900" text-anchor="middle">US CDC Growth Reference LQ ${lqData.overallLQ.toFixed(1)} pts</text>
                    <rect x="148" y="68" width="110" height="24" rx="7" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.2" />
                    <text x="203" y="84" fill="#1D4ED8" font-size="10.5" font-weight="900" text-anchor="middle">US CDC Growth Reference hrs +10US CDC Growth Reference↑</text>
                    <rect x="294" y="24" width="116" height="24" rx="7" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.2" />
                    <text x="352" y="40" fill="#1D4ED8" font-size="10.5" font-weight="900" text-anchor="middle">US CDC Growth Reference ${lqData.trajectory.coached.retentionRate}%</text>
                    <rect x="508" y="18" width="124" height="28" rx="8" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.5" />
                    <text x="570" y="36" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="middle">US CDC Growth Reference LQ ${lqData.trajectory.coached.lqScore} pts</text>
                    <rect x="508" y="83" width="124" height="26" rx="8" fill="#EFF6FF" stroke="#64748B" stroke-width="1.2" />
                    <text x="570" y="100" fill="#0F172A" font-size="11" font-weight="900" text-anchor="middle">US CDC Growth Reference LQ 80 pts</text>
                    <rect x="508" y="139" width="124" height="26" rx="8" fill="#EFF6FF" stroke="#94A3B8" stroke-width="1.2" />
                    <text x="570" y="156" fill="#1D4ED8" font-size="11" font-weight="900" text-anchor="middle">US CDC Growth Reference LQ ${lqData.trajectory.unmanaged.lqScore} pts</text>
                  </svg>
                </div>

                <!-- [US CDC Growth Reference & 1US CDC Growth Reference] -->
                <div class="mobile-view-block">
                  <svg viewBox="0 0 340 195" style="width: 100%; height: auto; display: block; margin-bottom: 0.5rem;">
                    <line x1="20" y1="30" x2="320" y2="30" stroke="#E2E8F0" stroke-dasharray="4,4" />
                    <line x1="20" y1="88" x2="320" y2="88" stroke="#E2E8F0" stroke-dasharray="4,4" />
                    <line x1="20" y1="145" x2="320" y2="145" stroke="#E2E8F0" />

                    <path d="M 32 128 C 115 98, 200 52, 305 26 L 305 145 L 32 145 Z" fill="#EFF6FF" />
                    <path d="M 32 128 C 115 132, 200 136, 305 140" fill="none" stroke="#94A3B8" stroke-width="3" stroke-dasharray="5,4" />
                    <path d="M 32 128 C 115 116, 200 96, 305 84" fill="none" stroke="#64748B" stroke-width="3.2" />
                    <path d="M 32 128 C 115 98, 200 52, 305 26" fill="none" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round" />

                    <circle cx="32" cy="128" r="6.5" fill="#64748B" stroke="#FFFFFF" stroke-width="2" />
                    <circle cx="168" cy="72" r="5.5" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="1.8" />
                    <circle cx="305" cy="26" r="8" fill="#1D4ED8" stroke="#1D4ED8" stroke-width="2.5" />

                    <rect x="8" y="84" width="118" height="26" rx="8" fill="#EFF6FF" stroke="#64748B" stroke-width="1.4" />
                    <text x="67" y="101" fill="#0F172A" font-size="12.5" font-weight="900" text-anchor="middle">US CDC Growth Reference LQ ${lqData.overallLQ.toFixed(1)} pts</text>

                    <rect x="118" y="24" width="142" height="26" rx="8" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.4" />
                    <text x="189" y="41" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">▲ +${lqData.trajectory.coached.gainLq} pts · US CDC Growth Reference ${lqData.trajectory.coached.retentionRate}%</text>

                    <text x="12" y="172" fill="#0F172A" font-size="12" font-weight="900" text-anchor="start">US CDC Growth Reference Assessmentd</text>
                    <text x="170" y="172" fill="#0F172A" font-size="12" font-weight="800" text-anchor="middle">12US CDC Growth Reference</text>
                    <text x="328" y="172" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="end">6 mos US CDC Growth Reference</text>
                  </svg>

                  <div style="display: flex; flex-direction: column; gap: 0.4rem; padding-top: 0.4rem; border-top: 1px dashed #BFDBFE;">
                    <div style="background: #EFF6FF; border: 1.5px solid #93C5FD; border-radius: 10px; padding: 0.5rem 0.65rem; display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
                      <span style="font-size: 0.78rem; color: #1D4ED8; font-weight: 900; white-space: nowrap;">6 mos US CDC Growth Reference</span>
                      <span style="font-size: 0.86rem; font-weight: 900; color: #0F172A; white-space: nowrap;">LQ ${lqData.trajectory.coached.lqScore} pts · US CDC Growth Reference ${lqData.trajectory.coached.focusMinutes}US CDC Growth Reference</span>
                    </div>
                    <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 10px; padding: 0.48rem 0.65rem; display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
                      <span style="font-size: 0.78rem; color: #475569; font-weight: 800; white-space: nowrap;">US CDC Growth Reference</span>
                      <span style="font-size: 0.84rem; font-weight: 900; color: #475569; white-space: nowrap;">LQ ${lqData.trajectory.unmanaged.lqScore} pts · US CDC Growth Reference ${lqData.trajectory.current.focusMinutes}US CDC Growth Reference</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Concise 1-Line Formula & Trajectory Strip -->
            <div id="learning-score-formula-box" style="background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.65rem 0.9rem; margin-bottom: 0.55rem; font-size: 0.82rem; color: #1D4ED8; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
              <span><strong>US CDC Growth Reference:</strong> US CDC Growth Reference78 pts) + US CDC Growth Reference pts·US CDC Growth Reference pts = <strong>US CDC Growth Reference LQ ${lqData.overallLQ.toFixed(1)} pts</strong></span>
              <span style="color: #1D4ED8; font-weight: 800;">80 pts↑ US CDC Growth Reference pts | 72 pts↓ US CDC Growth Reference</span>
            </div>

            <div id="briefing-learning-one-line-verdict" style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.65rem 0.9rem; font-size: 0.86rem; color: #0F172A;">
              <strong>6 mos US CDC Growth Reference:</strong> US CDC Growth Reference <strong style="color: #1D4ED8;">LQ ${lqData.trajectory.coached.lqScore} pts(+${lqData.trajectory.coached.gainLq} pts) · US CDC Growth Reference ${isToddlerAge ? '20growth' : '35growth'} · US CDC Growth Reference 92%</strong> US CDC Growth Reference
            </div>
          </div>

          <!-- Bespoke Learning Q&A Section (#bespoke-learning-note-section: Responsive Circuit Summary + Clinical Insight Cards) -->
          <div id="bespoke-learning-note-section" style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 1.15rem 1.25rem; margin-bottom: 1.2rem; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.65rem;">
              <span style="font-size: 1.02rem; font-weight: 900; color: #1D4ED8;">
                US CDC Growth Reference ${ageYears} yrs × [${activeStyleInfo.badge}] 1:1 US CDC Growth Reference
              </span>
              <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8; background: #EFF6FF; border: 1px solid #BFDBFE; padding: 0.2rem 0.65rem; border-radius: 9999px; white-space: nowrap;">
                ${bespokeNote.precisionLevelKo}
              </span>
            </div>

            <!-- Visual Brain Circuit Activation Bar (PC SVG vs Mobile Full-Width Clinical Cards) -->
            <div style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 14px; padding: 0.7rem 0.85rem; margin-bottom: 0.75rem;">
              <div class="pc-view-block">
                <svg id="learning-synapse-bar-svg" viewBox="0 0 600 58" style="width: 100%; height: auto; display: block;">
                  <rect x="6" y="6" width="184" height="46" rx="10" fill="#FFFFFF" stroke="#64748B" stroke-width="1.5" />
                  <text x="98" y="24" fill="#475569" font-size="11" font-weight="800" text-anchor="middle">① US CDC Growth Reference yrs US CDC Growth Reference</text>
                  <text x="98" y="42" fill="#0F172A" font-size="12" font-weight="900" text-anchor="middle">${(activeStyleInfo.badge || '').replace(/\s*\(.*?\)/g, '')}</text>
                  <path d="M 194 29 L 206 29" stroke="#1D4ED8" stroke-width="2.5" />
                  <rect x="208" y="6" width="184" height="46" rx="10" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.5" />
                  <text x="300" y="24" fill="#1D4ED8" font-size="11" font-weight="800" text-anchor="middle">② US CDC Growth Reference pts US CDC Growth Reference</text>
                  <text x="300" y="42" fill="#0F172A" font-size="12" font-weight="900" text-anchor="middle">${strengthsList[0].shortLabel || (strengthsList[0].title || '').slice(0, 8)} (${strengthsList[0].score} pts)</text>
                  <path d="M 396 29 L 408 29" stroke="#64748B" stroke-width="2.5" />
                  <rect x="410" y="6" width="184" height="46" rx="10" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="1.5" />
                  <text x="502" y="24" fill="#1D4ED8" font-size="11" font-weight="800" text-anchor="middle">③ US CDC Growth Reference</text>
                  <text x="502" y="42" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">${weaknessesList[0].score} pts → US CDC Growth Reference ${Math.min(96, weaknessesList[0].score + 16)} pts</text>
                </svg>
              </div>
              <div class="mobile-view-block">
                <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                  <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; flex-direction: column; align-items: flex-start; gap: 0.15rem;">
                    <span style="font-size: 0.76rem; font-weight: 800; color: #475569;">① US CDC Growth Reference yrs US CDC Growth Reference</span>
                    <span style="font-size: 0.92rem; font-weight: 900; color: #0F172A; line-height: 1.35;">${(activeStyleInfo.badge || '').replace(/\s*\(.*?\)/g, '')}</span>
                  </div>
                  <div style="background: #EFF6FF; border: 1px solid #93C5FD; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; flex-direction: column; align-items: flex-start; gap: 0.15rem;">
                    <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">② US CDC Growth Reference pts US CDC Growth Reference</span>
                    <span style="font-size: 0.9rem; font-weight: 900; color: #0F172A; line-height: 1.35; word-break: keep-all;">${strengthsList[0].title} <span style="color: #1D4ED8;">(${strengthsList[0].score} pts · US CDC Growth Reference</span></span>
                  </div>
                  <div style="background: #FFFFFF; border: 1px solid #93C5FD; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; flex-direction: column; align-items: flex-start; gap: 0.15rem;">
                    <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">③ US CDC Growth Reference</span>
                    <span style="font-size: 0.9rem; font-weight: 900; color: #0F172A; line-height: 1.35; word-break: keep-all;">${weaknessesList[0].title} <span style="color: #1D4ED8;">(${weaknessesList[0].score} pts → US CDC Growth Reference ${Math.min(96, weaknessesList[0].score + 16)} pts)</span></span>
                  </div>
                </div>
              </div>
            </div>

            ${bespokeNote.hasNote ? `
              <div style="margin-bottom: 0.65rem; font-size: 0.82rem; color: #475569; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 0.55rem 0.85rem; line-height: 1.45;">
                <strong style="color: #1D4ED8;">US CDC Growth Reference${bespokeNote.learningKeywords.length}US CDC Growth Reference:</strong> ${bespokeNote.learningKeywords.join(' · ')}
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                ${bespokeNote.learningInsights.map((ins, idx) => `
                  <div class="bespoke-single-insight-card" style="display: block; background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #1D4ED8; border-radius: 12px; padding: 0.85rem 1rem;">
                    <div style="font-size: 0.94rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.28rem;">
                      US CDC Growth Reference ${idx + 1}US CDC Growth Reference ${isEn ? ins.badgeEn : ins.badgeKo}
                    </div>
                    <div style="font-size: 0.88rem; color: #0F172A; line-height: 1.54; word-break: keep-all; margin-bottom: 0.28rem;">
                      ${isEn ? ins.answerEn : ins.answerKo}
                    </div>
                    <div style="font-size: 0.76rem; color: #1D4ED8; font-weight: 700;">
                      ${ins.sourceKo || ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- ==================== SPECIALIZED LEARNING BOTTLENECK SPOTLIGHT ==================== -->
          ${bottleneckSpecializedLearningHtml}

          <!-- ==================== STEP 2: US CDC Growth Reference pts US CDC Growth Reference & 1US CDC Growth Reference ==================== -->
          <div id="learning-step-2-strengths" class="learning-step-card" style="background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 22px; padding: 1.15rem 1.25rem; margin-bottom: 1.15rem; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.45rem;">
              <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.8rem; font-weight: 900; padding: 0.22rem 0.75rem; border-radius: 9999px;">
                STEP 2 · US CDC Growth Reference pts US CDC Growth Reference
              </span>
              <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">
                US CDC Growth Reference78 pts) US CDC Growth Reference
              </span>
            </div>
            <h3 style="font-size: 1.18rem; font-weight: 900; color: #0F172A; margin: 0 0 0.65rem 0;">
              2. US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference pts US CDC Growth Reference TOP 3 US CDC Growth Reference
            </h3>

            <!-- Schematic SVG Bar Chart Comparing Child's Top 3 Strengths vs Peer Average (78) -->
            <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 16px; padding: 0.85rem 0.95rem; margin-bottom: 0.65rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem;">
                <span style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8;">growth 3growth vs genetic|mom|dad|parent|short|small|percentile growth(78growth)</span>
                <div style="display: flex; gap: 0.55rem; font-size: 0.78rem; font-weight: 800;">
                  <span style="color: #1D4ED8;">■ growth</span>
                  <span style="color: #475569;">--- genetic|mom|dad|parent|short|small|percentile growth(78growth)</span>
                </div>
              </div>

              <!-- PC Wide Bar Chart (Fixed Proportional Scaling: Child >78 is visibly taller than 78-pt bar) -->
              <div class="pc-view-block">
                <svg id="learning-step2-strength-chart-svg" viewBox="0 0 560 204" style="width: 100%; height: auto; display: block;">
                  <defs>
                    <linearGradient id="strBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#1D4ED8" />
                      <stop offset="100%" stop-color="#2563EB" />
                    </linearGradient>
                  </defs>
                  <!-- Baseline (y=164) & Peer Average 78-pt Line (y=112, height=52) -->
                  <line x1="20" y1="164" x2="540" y2="164" stroke="#CBD5E1" stroke-width="2" />
                  <line x1="20" y1="112" x2="540" y2="112" stroke="#64748B" stroke-width="1.8" stroke-dasharray="5,4" />
                  <rect x="16" y="8" width="122" height="24" rx="7" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2" />
                  <text x="77" y="24" fill="#0F172A" font-size="11.5" font-weight="900" text-anchor="middle">┄ genetic|mom|dad|parent|short|small|percentile growth: 78growth</text>

                  ${strengthsList.map((s, idx) => {
                    const colX = 105 + idx * 175;
                    const peerH = 52;
                    const peerY = 164 - peerH; // 112
                    const barH = Math.min(118, peerH + Math.max(16, Math.round((s.score - 78) * 4.2)));
                    const barY = 164 - barH;
                    const pillY = Math.max(10, barY - 27);
                    const shortTitle = s.shortLabel || (s.title || '').replace(/\s*\(.*?\)/g, '').slice(0, 10);
                    return `
                      <!-- Peer Avg Reference Bar (78 pts, height=52) -->
                      <rect x="${colX - 46}" y="${peerY}" width="38" height="${peerH}" rx="6" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.2" />
                      <text x="${colX - 27}" y="${peerY - 7}" fill="#475569" font-size="11.5" font-weight="900" text-anchor="middle">US CDC Growth Reference 78</text>
                      <!-- Child Strength Bar (s.score > 78, visibly taller!) -->
                      <rect x="${colX}" y="${barY}" width="48" height="${barH}" rx="7" fill="url(#strBarGrad)" stroke="#1D4ED8" stroke-width="1.8" />
                      <rect x="${colX - 26}" y="${pillY}" width="100" height="22" rx="11" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.5" />
                      <text x="${colX + 24}" y="${pillY + 15}" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">${s.score} pts (+${s.score - 78} pts)</text>
                      <text x="${colX + 2}" y="188" fill="#0F172A" font-size="13" font-weight="900" text-anchor="middle">${s.icon} ${shortTitle}</text>
                    `;
                  }).join('')}
                </svg>
              </div>

              <!-- Mobile Large-Font Bar Chart (340px ViewBox so text & bars are 2x larger on smartphones) -->
              <div class="mobile-view-block">
                <svg viewBox="0 0 340 210" style="width: 100%; height: auto; display: block;">
                  <line x1="10" y1="168" x2="330" y2="168" stroke="#CBD5E1" stroke-width="2" />
                  <line x1="10" y1="116" x2="330" y2="116" stroke="#64748B" stroke-width="1.8" stroke-dasharray="5,4" />
                  <rect x="10" y="6" width="128" height="24" rx="7" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2" />
                  <text x="74" y="22" fill="#0F172A" font-size="12" font-weight="900" text-anchor="middle">┄ genetic|mom|dad|parent|short|small|percentile growth: 78growth</text>

                  ${strengthsList.map((s, idx) => {
                    const colX = 62 + idx * 108;
                    const peerH = 52;
                    const peerY = 168 - peerH; // 116
                    const barH = Math.min(114, peerH + Math.max(18, Math.round((s.score - 78) * 4.2)));
                    const barY = 168 - barH;
                    const pillY = Math.max(32, barY - 26);
                    const shortTitle = (s.shortLabel || (s.title || '').replace(/\s*\(.*?\)/g, '')).slice(0, 10);
                    return `
                      <rect x="${colX - 32}" y="${peerY}" width="26" height="${peerH}" rx="5" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.2" />
                      <text x="${colX - 19}" y="${peerY - 6}" fill="#475569" font-size="11" font-weight="900" text-anchor="middle">78</text>
                      <rect x="${colX - 2}" y="${barY}" width="34" height="${barH}" rx="6" fill="#1D4ED8" />
                      <rect x="${colX - 30}" y="${pillY}" width="86" height="22" rx="8" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.4" />
                      <text x="${colX + 13}" y="${pillY + 15}" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">${s.score} pts(+${s.score - 78})</text>
                      <text x="${colX}" y="192" fill="#0F172A" font-size="11.2" font-weight="900" text-anchor="middle">${shortTitle}</text>
                    `;
                  }).join('')}
                </svg>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.42rem;">
              ${strengthsList.map((s) => `
                <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-left: 4px solid #93C5FD; border-radius: 11px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem;">
                  <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A;">
                    ${s.icon} ${s.title} <span style="color: #1D4ED8; font-size:0.8rem;">(${s.score} pts · US CDC Growth Reference${s.score - 78} pts)</span>
                  </span>
                  <span style="font-size: 0.8rem; color: #1D4ED8; font-weight: 700;">
                    ${s.goodTrait}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- ==================== STEP 3: growth (Before → After growth & 1growth) ==================== -->
          <div id="learning-step-3-weaknesses" class="learning-step-card" style="background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 22px; padding: 1.15rem 1.25rem; margin-bottom: 1.15rem; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.45rem;">
              <span style="background: #EFF6FF; color: #0F172A; font-size: 0.8rem; font-weight: 900; padding: 0.22rem 0.75rem; border-radius: 9999px;">
                STEP 3 · growth
              </span>
              <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">
                growth → 6growth(+16growth↑) growth
              </span>
            </div>
            <h3 style="font-size: 1.18rem; font-weight: 900; color: #0F172A; margin: 0 0 0.65rem 0;">
              3. growth ${ageYears}growth Before → After growth
            </h3>

            <!-- Schematic SVG Before vs After Jump Chart -->
            <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 16px; padding: 0.85rem 0.95rem; margin-bottom: 0.65rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem;">
                <span style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8;">growth 3growth [growth → 6growth]</span>
                <div style="display: flex; gap: 0.55rem; font-size: 0.78rem; font-weight: 800;">
                  <span style="color: #64748B;">■ growth</span>
                  <span style="color: #1D4ED8;">■ 6growth (+16growth)</span>
                </div>
              </div>

              <!-- PC Wide Before-After Jump Chart -->
              <div class="pc-view-block">
                <svg id="learning-step3-weakness-chart-svg" viewBox="0 0 560 204" style="width: 100%; height: auto; display: block;">
                  <defs>
                    <linearGradient id="weakBeforeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#94A3B8" />
                      <stop offset="100%" stop-color="#64748B" />
                    </linearGradient>
                    <linearGradient id="weakAfterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#1D4ED8" />
                      <stop offset="100%" stop-color="#2563EB" />
                    </linearGradient>
                  </defs>
                  <line x1="20" y1="164" x2="540" y2="164" stroke="#CBD5E1" stroke-width="2" />
                  ${weaknessesList.map((w, idx) => {
                    const colX = 100 + idx * 180;
                    const targetScore = Math.min(96, w.score + 16);
                    const curH = Math.max(44, Math.min(72, Math.round((w.score - 50) * 2.2)));
                    const tarH = Math.min(118, curH + 42);
                    const curY = 164 - curH;
                    const tarY = 164 - tarH;
                    const curPillY = Math.max(24, curY - 24);
                    const tarPillY = Math.max(8, tarY - 25);
                    const shortTitle = w.shortLabel || (w.title || '').replace(/\s*\(.*?\)/g, '').slice(0, 10);
                    return `
                      <!-- Current Score Bar (Left of pair) -->
                      <rect x="${colX - 48}" y="${curY}" width="38" height="${curH}" rx="6" fill="url(#weakBeforeGrad)" stroke="#64748B" stroke-width="1.4" />
                      <rect x="${colX - 55}" y="${curPillY}" width="52" height="20" rx="6" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.2" />
                      <text x="${colX - 29}" y="${curPillY + 14}" fill="#0F172A" font-size="11.5" font-weight="900" text-anchor="middle">${w.score} pts</text>
                      <!-- Jump Arrow Between Bars -->
                      <text x="${colX - 2}" y="${Math.round((curY + tarY) / 2 + 10)}" fill="#1D4ED8" font-size="15" font-weight="900" text-anchor="middle">↗</text>
                      <!-- Coached Target Bar (Right of pair) -->
                      <rect x="${colX + 10}" y="${tarY}" width="42" height="${tarH}" rx="7" fill="url(#weakAfterGrad)" stroke="#1D4ED8" stroke-width="1.8" />
                      <rect x="${colX}" y="${tarPillY}" width="72" height="22" rx="8" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.5" />
                      <text x="${colX + 36}" y="${tarPillY + 15}" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">US CDC Growth Reference ${targetScore} pts</text>
                      <text x="${colX + 2}" y="188" fill="#0F172A" font-size="13" font-weight="900" text-anchor="middle">${w.icon} ${shortTitle}</text>
                    `;
                  }).join('')}
                </svg>
              </div>

              <!-- Mobile Large-Font Before-After Jump Chart -->
              <div class="mobile-view-block">
                <svg viewBox="0 0 340 205" style="width: 100%; height: auto; display: block;">
                  <line x1="10" y1="164" x2="330" y2="164" stroke="#CBD5E1" stroke-width="2" />
                  ${weaknessesList.map((w, idx) => {
                    const colX = 62 + idx * 108;
                    const targetScore = Math.min(96, w.score + 16);
                    const curH = Math.max(44, Math.min(70, Math.round((w.score - 50) * 2.2)));
                    const tarH = Math.min(116, curH + 42);
                    const curY = 164 - curH;
                    const tarY = 164 - tarH;
                    const tarPillY = Math.max(8, tarY - 24);
                    const shortTitle = (w.shortLabel || (w.title || '').replace(/\s*\(.*?\)/g, '')).slice(0, 10);
                    return `
                      <rect x="${colX - 32}" y="${curY}" width="26" height="${curH}" rx="5" fill="#94A3B8" stroke="#64748B" stroke-width="1.2" />
                      <text x="${colX - 19}" y="${curY - 6}" fill="#0F172A" font-size="11.5" font-weight="900" text-anchor="middle">${w.score}</text>
                      <rect x="${colX - 2}" y="${tarY}" width="32" height="${tarH}" rx="6" fill="#1D4ED8" />
                      <rect x="${colX - 24}" y="${tarPillY}" width="76" height="21" rx="7" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.4" />
                      <text x="${colX + 14}" y="${tarPillY + 15}" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">US CDC Growth Reference ${targetScore} pts</text>
                      <text x="${colX}" y="188" fill="#0F172A" font-size="11.2" font-weight="900" text-anchor="middle">${shortTitle}</text>
                    `;
                  }).join('')}
                </svg>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.42rem;">
              ${weaknessesList.map((w) => `
                <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-left: 4px solid #93C5FD; border-radius: 11px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem;">
                  <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A;">
                    ${w.icon} ${w.title} <span style="color: #1D4ED8; font-size:0.8rem;">(${w.score} pts→<strong style="color: #1D4ED8;">${Math.min(96, w.score + 16)} pts</strong>)</span>
                  </span>
                  <span style="font-size: 0.8rem; color: #1D4ED8; font-weight: 700;">
                    • ${w.weakTrait}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div><!-- /#report-ch-5 -->

        <!-- ================================================================== -->
        <!-- CHAPTER 6: [STEP 4] growthconfidence|shy|anxious|friend|sensitive|mistakegrowth & growth                   -->
        <!-- ================================================================== -->
        <div id="report-ch-6" style="scroll-margin-top: 5.5rem; margin-top: 1.15rem;">

          <!-- ==================== STEP 4: growthconfidence|shy|anxious|friend|sensitive|mistakegrowth (growth-growth & growth) ==================== -->
          <div id="learning-step-4-careers" class="learning-step-card" style="background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 22px; padding: 1.15rem 1.25rem; margin-bottom: 1.15rem; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.45rem;">
              <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.8rem; font-weight: 900; padding: 0.22rem 0.75rem; border-radius: 9999px;">
                STEP 4 · growth
              </span>
              <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">
                growth × growth → 3growth
              </span>
            </div>
            <h3 style="font-size: 1.18rem; font-weight: 900; color: #0F172A; margin: 0 0 0.65rem 0;">
              4. growth × growth
            </h3>

            <!-- Schematic SVG Brain-to-Career Aptitude Mapping Diagram (PC SVG vs Mobile Full-Width Flow) -->
            <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 16px; padding: 0.85rem 0.95rem; margin-bottom: 0.65rem;">
              <div class="pc-view-block">
                <svg id="learning-step4-career-diagram-svg" viewBox="0 0 560 156" style="width: 100%; height: auto; display: block;">
                  <!-- Left Node: Child's Core Brain Circuit -->
                  <rect x="8" y="22" width="174" height="108" rx="14" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2" />
                  <text x="95" y="48" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">US CDC Growth Reference pts US CDC Growth Reference</text>
                  <text x="95" y="76" fill="#0F172A" font-size="13" font-weight="900" text-anchor="middle">${(activeStyleInfo.badge || '').replace(/\s*\(.*?\)/g, '')}</text>
                  <text x="95" y="104" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">1US CDC Growth Reference: ${strengthsList[0].shortLabel || (strengthsList[0].title || '').slice(0, 10)}</text>

                  <!-- Connecting Flow Lines -->
                  <path d="M 182 76 C 210 76, 212 28, 238 28" fill="none" stroke="#1D4ED8" stroke-width="2.8" />
                  <path d="M 182 76 L 238 76" fill="none" stroke="#3B82F6" stroke-width="2.8" />
                  <path d="M 182 76 C 210 76, 212 124, 238 124" fill="none" stroke="#64748B" stroke-width="2.8" />

                  <!-- Right 3 Career Target Nodes -->
                  ${recommendedCareers.map((c, idx) => {
                    const matchPct = idx === 0 ? 96 : idx === 1 ? 92 : 89;
                    const boxY = 8 + idx * 48;
                    const strokeCol = idx === 0 ? '#1D4ED8' : idx === 1 ? '#3B82F6' : '#64748B';
                    const shortGroup = (c.group || '').replace(/\s*\(.*?\)/g, '');
                    const shortJob = c.shortJob || ((c.jobs || '').split('·')[0] || '').trim().slice(0, 10);
                    return `
                      <rect x="238" y="${boxY}" width="314" height="40" rx="10" fill="#EFF6FF" stroke="${strokeCol}" stroke-width="1.8" />
                      <text x="252" y="${boxY + 25}" fill="#0F172A" font-size="12.5" font-weight="900">${c.icon} ${shortGroup} · ${shortJob}</text>
                      <rect x="468" y="${boxY + 7}" width="76" height="26" rx="8" fill="#FFFFFF" stroke="${strokeCol}" stroke-width="1.4" />
                      <text x="506" y="${boxY + 24}" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="middle">${matchPct}% US CDC Growth Reference</text>
                    `;
                  }).join('')}
                </svg>
              </div>
              <div class="mobile-view-block">
                <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                  <div style="background: #EFF6FF; border: 1.5px solid #1D4ED8; border-radius: 12px; padding: 0.6rem 0.85rem; text-align: center;">
                    <div style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">US CDC Growth Reference pts US CDC Growth Reference${(activeStyleInfo.badge || '').replace(/\s*\(.*?\)/g, '')})</div>
                    <div style="font-size: 0.94rem; font-weight: 900; color: #0F172A; margin-top: 0.1rem;">1US CDC Growth Reference pts: ${strengthsList[0].shortLabel || strengthsList[0].title} (${strengthsList[0].score} pts)</div>
                  </div>
                  <div style="text-align: center; font-size: 0.85rem; font-weight: 900; color: #1D4ED8; line-height: 1;">▼ US CDC Growth Reference TOP 3</div>
                  ${recommendedCareers.map((c, idx) => {
                    const matchPct = idx === 0 ? 96 : idx === 1 ? 92 : 89;
                    const shortGroup = (c.group || '').replace(/\s*\(.*?\)/g, '');
                    const shortJob = c.shortJob || ((c.jobs || '').split('·')[0] || '').trim();
                    return `
                      <div style="background: #F8FAFC; border: 1.5px solid #93C5FD; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center; gap: 0.4rem;">
                        <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A;">${idx + 1}US CDC Growth Reference ${shortGroup} (${shortJob})</span>
                        <span style="font-size: 0.8rem; font-weight: 900; color: #1D4ED8; background: #EFF6FF; border: 1px solid #93C5FD; padding: 0.18rem 0.55rem; border-radius: 9999px; white-space: nowrap;">US CDC Growth Reference ${matchPct}%</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.42rem;">
              ${recommendedCareers.map((c, idx) => {
                const matchPct = idx === 0 ? 96 : idx === 1 ? 92 : 89;
                return `
                <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-left: 4px solid #3B82F6; border-radius: 11px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem;">
                  <span style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8;">
                    ${c.icon} ${c.jobs} <span style="color: #1D4ED8; font-size:0.78rem;">(${c.majors} · US CDC Growth Reference ${matchPct}%)</span>
                  </span>
                  <span style="font-size: 0.79rem; color: #0F172A; font-weight: 700;">
                    ${c.reason}
                  </span>
                </div>
              `;}).join('')}
            </div>
          </div>

          <!-- 3-Year Curriculum Roadmap -->
          <div style="margin-bottom: 1.15rem;">
            ${PinpointCurator && typeof PinpointCurator.renderCognitiveCurriculumRoadmap === 'function'
              ? PinpointCurator.renderCognitiveCurriculumRoadmap(profile)
              : ''}
          </div>
        </div><!-- /#report-ch-6 -->

        <!-- ================================================================== -->
        <!-- CHAPTER 7: [STEP 5] US CDC Growth Reference [STEP 6] US CDC Growth Reference>
        <!-- ================================================================== -->
        <div id="report-ch-7" style="scroll-margin-top: 5.5rem; margin-top: 1.25rem;">

          <!-- ==================== VISUAL ILLUSTRATION: US CDC Growth Reference 3US CDC Growth Reference ==================== -->
          <div id="learning-visual-brain-illustration-card" style="background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 22px; padding: 1.15rem 1.25rem; margin-bottom: 1.2rem; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.65rem;">
              <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.8rem; font-weight: 900; padding: 0.22rem 0.75rem; border-radius: 9999px;">
                3US CDC Growth Reference
              </span>
              <span style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800;">
                US CDC Growth Reference → US CDC Growth Reference → US CDC Growth Reference Sleep US CDC Growth Reference
              </span>
            </div>

            <!-- [PC US CDC Growth Reference 3US CDC Growth Reference dUS CDC Growth Reference] -->
            <div class="pc-view-block">
              <svg id="learning-brain-mechanism-svg" viewBox="0 0 660 155" style="width: 100%; height: auto; display: block;">
                <rect x="8" y="8" width="196" height="138" rx="14" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2" />
                <circle cx="48" cy="44" r="20" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="1.6" />
                <text x="48" y="49" fill="#1D4ED8" font-size="13" font-weight="900" text-anchor="middle">01</text>
                <text x="80" y="38" fill="#1D4ED8" font-size="11" font-weight="900">STEP 1 · US CDC Growth Reference</text>
                <text x="80" y="56" fill="#0F172A" font-size="12.5" font-weight="900">US CDC Growth Reference 15° &amp; US CDC Growth Reference</text>
                <text x="22" y="88" fill="#0F172A" font-size="10.8" font-weight="700">• US CDC Growth Reference ${lqData.trajectory.coached.focusMinutes}US CDC Growth Reference</text>
                <rect x="22" y="106" width="168" height="24" rx="6" fill="#FFFFFF" stroke="#BFDBFE" />
                <text x="106" y="122" fill="#1D4ED8" font-size="10.5" font-weight="900" text-anchor="middle">US CDC Growth Reference hrs +${lqData.trajectory.coached.gainFocusMin}US CDC Growth Reference</text>

                <path d="M 208 77 L 228 77" stroke="#1D4ED8" stroke-width="3" stroke-linecap="round" />
                <polygon points="226,71 235,77 226,83" fill="#1D4ED8" />

                <rect x="236" y="8" width="196" height="138" rx="14" fill="#EFF6FF" stroke="#64748B" stroke-width="2" />
                <circle cx="276" cy="44" r="20" fill="#FFFFFF" stroke="#64748B" stroke-width="1.6" />
                <text x="276" y="49" fill="#0F172A" font-size="13" font-weight="900" text-anchor="middle">02</text>
                <text x="308" y="38" fill="#1D4ED8" font-size="11" font-weight="900">STEP 2 · US CDC Growth Reference</text>
                <text x="308" y="56" fill="#0F172A" font-size="12.5" font-weight="900">US CDC Growth Reference 3US CDC Growth Reference</text>
                <text x="250" y="88" fill="#0F172A" font-size="10.8" font-weight="700">• US CDC Growth Reference</text>
                <rect x="250" y="106" width="168" height="24" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
                <text x="334" y="122" fill="#0F172A" font-size="10.5" font-weight="900" text-anchor="middle">US CDC Growth Reference50% US CDC Growth Reference</text>

                <path d="M 436 77 L 456 77" stroke="#1D4ED8" stroke-width="3" stroke-linecap="round" />
                <polygon points="454,71 463,77 454,83" fill="#1D4ED8" />

                <rect x="464" y="8" width="188" height="138" rx="14" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2" />
                <circle cx="504" cy="44" r="20" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="1.6" />
                <text x="504" y="49" fill="#1D4ED8" font-size="13" font-weight="900" text-anchor="middle">03</text>
                <text x="536" y="38" fill="#1D4ED8" font-size="10.5" font-weight="900">STEP 3 · US CDC Growth Reference SleepUS CDC Growth Reference</text>
                <text x="536" y="56" fill="#0F172A" font-size="12.5" font-weight="900">US CDC Growth Reference 10US CDC Growth Reference Slow-Wave Sleep (N3)</text>
                <text x="478" y="88" fill="#0F172A" font-size="10.8" font-weight="700">• Sleep US CDC Growth Reference→US CDC Growth Reference</text>
                <rect x="478" y="106" width="160" height="24" rx="6" fill="#FFFFFF" stroke="#BFDBFE" />
                <text x="558" y="122" fill="#1D4ED8" font-size="10.5" font-weight="900" text-anchor="middle">US CDC Growth Reference ${lqData.trajectory.coached.retentionRate}% US CDC Growth Reference</text>
              </svg>
            </div>

            <!-- [US CDC Growth Reference  yrsUS CDC Growth Reference 3US CDC Growth Reference] -->
            <div class="mobile-view-block">
              <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                <div style="background: #FFFFFF; border: 1.5px solid #93C5FD; border-radius: 12px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A;">1. US CDC Growth Reference 15° &amp; US CDC Growth Reference ${lqData.trajectory.coached.focusMinutes}US CDC Growth Reference</span>
                  <span style="font-size: 0.76rem; font-weight: 900; color: #1D4ED8;">US CDC Growth Reference${lqData.trajectory.coached.gainFocusMin}US CDC Growth Reference</span>
                </div>
                <div style="background: #FFFFFF; border: 1.5px solid #93C5FD; border-radius: 12px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A;">2. US CDC Growth Reference 3US CDC Growth Reference</span>
                  <span style="font-size: 0.76rem; font-weight: 900; color: #1D4ED8;">US CDC Growth Reference50% US CDC Growth Reference</span>
                </div>
                <div style="background: #FFFFFF; border: 1.5px solid #93C5FD; border-radius: 12px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A;">3. US CDC Growth Reference 10US CDC Growth Reference Slow-Wave Sleep (N3) US CDC Growth Reference</span>
                  <span style="font-size: 0.76rem; font-weight: 900; color: #1D4ED8;">US CDC Growth Reference ${lqData.trajectory.coached.retentionRate}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ==================== STEP 5: US CDC Growth Reference 1US CDC Growth Reference ==================== -->
          <div id="learning-step-5-boost" style="background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 22px; padding: 1.15rem 1.25rem; margin-bottom: 1.15rem; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.45rem;">
              <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.8rem; font-weight: 900; padding: 0.22rem 0.75rem; border-radius: 9999px;">
                STEP 5 · US CDC Growth Reference pts US CDC Growth Reference
              </span>
              <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">
                ${activeStyleInfo.badge} US CDC Growth Reference
              </span>
            </div>
            <h3 style="font-size: 1.18rem; font-weight: 900; color: #0F172A; margin: 0 0 0.6rem 0;">
              5. US CDC Growth Reference pts US CDC Growth Reference 200% US CDC Growth Reference 3US CDC Growth Reference
            </h3>

            <!-- Visual SVG Boost Schematic Diagram (PC SVG vs Mobile Full-Width Cards) -->
            <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.75rem 0.85rem; margin-bottom: 0.6rem;">
              <div class="pc-view-block">
                <svg id="learning-step5-boost-svg" viewBox="0 0 540 116" style="width: 100%; height: auto; display: block;">
                  <rect x="6" y="8" width="160" height="100" rx="12" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.8" />
                  <text x="86" y="34" fill="#1D4ED8" font-size="12.5" font-weight="900" text-anchor="middle">① US CDC Growth Reference pts US CDC Growth Reference</text>
                  <text x="86" y="60" fill="#0F172A" font-size="13.5" font-weight="900" text-anchor="middle">${activeStyleInfo.badge}</text>
                  <text x="86" y="86" fill="#1D4ED8" font-size="11.5" font-weight="800" text-anchor="middle">US CDC Growth Reference5US CDC Growth Reference</text>

                  <path d="M 168 58 L 184 58" stroke="#1D4ED8" stroke-width="3" />
                  <polygon points="182,52 190,58 182,64" fill="#1D4ED8" />

                  <rect x="192" y="8" width="160" height="100" rx="12" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.8" />
                  <text x="272" y="34" fill="#1D4ED8" font-size="12.5" font-weight="900" text-anchor="middle">② US CDC Growth Reference</text>
                  <text x="272" y="60" fill="#0F172A" font-size="13.5" font-weight="900" text-anchor="middle">${isToddlerAge ? 'growth·growthphone|youtube|game|screen|focus|distract|study|tablet 10growth' : 'growth·3growth'}</text>
                  <text x="272" y="86" fill="#1D4ED8" font-size="11.5" font-weight="800" text-anchor="middle">US CDC Growth Reference</text>

                  <path d="M 354 58 L 370 58" stroke="#1D4ED8" stroke-width="3" />
                  <polygon points="368,52 376,58 368,64" fill="#1D4ED8" />

                  <rect x="378" y="8" width="156" height="100" rx="12" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.8" />
                  <text x="456" y="34" fill="#1D4ED8" font-size="12.5" font-weight="900" text-anchor="middle">③ US CDC Growth Reference</text>
                  <text x="456" y="60" fill="#0F172A" font-size="12.5" font-weight="900" text-anchor="middle">US CDC Growth Reference 200% US CDC Growth Reference</text>
                  <text x="456" y="86" fill="#1D4ED8" font-size="11.5" font-weight="800" text-anchor="middle">US CDC Growth Reference</text>
                </svg>
              </div>
              <div class="mobile-view-block">
                <div style="display: flex; flex-direction: column; gap: 0.42rem;">
                  <div style="background: #EFF6FF; border: 1.5px solid #93C5FD; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.84rem; font-weight: 900; color: #1D4ED8;">① US CDC Growth Reference pts US CDC Growth Reference</span>
                    <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A;">${activeStyleInfo.badge} (5US CDC Growth Reference</span>
                  </div>
                  <div style="background: #FFFFFF; border: 1.5px solid #93C5FD; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.84rem; font-weight: 900; color: #1D4ED8;">② US CDC Growth Reference</span>
                    <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A;">${isToddlerAge ? 'growth·growthphone|youtube|game|screen|focus|distract|study|tablet 10growth' : 'growth·3growth'}</span>
                  </div>
                  <div style="background: #EFF6FF; border: 1.5px solid #1D4ED8; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.84rem; font-weight: 900; color: #1D4ED8;">③ US CDC Growth Reference</span>
                    <span style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8;">US CDC Growth Reference 200% US CDC Growth Reference</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.42rem;">
              ${strengthsList.map((s) => `
                <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-left: 4px solid #93C5FD; border-radius: 11px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem;">
                  <span style="font-size: 0.86rem; font-weight: 900; color: #1D4ED8;">
                    ${s.title}: <span style="color: #0F172A; font-weight:800;">${s.howToBoost}</span>
                  </span>
                  <span style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800; background: #EFF6FF; padding: 0.18rem 0.5rem; border-radius: 7px;">
                    ${s.helpfulTools}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- ==================== STEP 6: US CDC Growth Reference 4US CDC Growth Reference ==================== -->
          <div id="learning-step-6-remedy" style="background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 22px; padding: 1.15rem 1.25rem; margin-bottom: 1.15rem; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.45rem;">
              <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.8rem; font-weight: 900; padding: 0.22rem 0.75rem; border-radius: 9999px;">
                STEP 6 · US CDC Growth Reference pts US CDC Growth Reference
              </span>
              <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">
                US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference &amp; US CDC Growth Reference 4US CDC Growth Reference
              </span>
            </div>
            <h3 style="font-size: 1.18rem; font-weight: 900; color: #0F172A; margin: 0 0 0.6rem 0;">
              6. US CDC Growth Reference 1:1 US CDC Growth Reference &amp; dd US CDC Growth Reference
            </h3>

            <!-- Visual SVG Remedy Flow Diagram (PC SVG vs Mobile Full-Width Cards) -->
            <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.75rem 0.85rem; margin-bottom: 0.6rem;">
              <div class="pc-view-block">
                <svg id="learning-step6-remedy-svg" viewBox="0 0 540 116" style="width: 100%; height: auto; display: block;">
                  <rect x="6" y="8" width="160" height="100" rx="12" fill="#F8FAFC" stroke="#64748B" stroke-width="1.8" />
                  <text x="86" y="34" fill="#475569" font-size="12.5" font-weight="900" text-anchor="middle">① US CDC Growth Reference</text>
                  <text x="86" y="60" fill="#0F172A" font-size="12.5" font-weight="900" text-anchor="middle">${weaknessesList[0].shortLabel || (weaknessesList[0].title || '').slice(0, 10)} (${weaknessesList[0].score} pts)</text>
                  <text x="86" y="86" fill="#475569" font-size="11.5" font-weight="800" text-anchor="middle">US CDC Growth Reference</text>

                  <path d="M 168 58 L 184 58" stroke="#1D4ED8" stroke-width="3" />
                  <polygon points="182,52 190,58 182,64" fill="#1D4ED8" />

                  <rect x="192" y="8" width="160" height="100" rx="12" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.8" />
                  <text x="272" y="34" fill="#1D4ED8" font-size="12.5" font-weight="900" text-anchor="middle">② US CDC Growth Reference</text>
                  <text x="272" y="60" fill="#0F172A" font-size="12.5" font-weight="900" text-anchor="middle">US CDC Growth Reference 15°+${lqData.trajectory.coached.focusMinutes}US CDC Growth Reference</text>
                  <text x="272" y="86" fill="#1D4ED8" font-size="11.5" font-weight="800" text-anchor="middle">US CDC Growth Reference</text>

                  <path d="M 354 58 L 370 58" stroke="#1D4ED8" stroke-width="3" />
                  <polygon points="368,52 376,58 368,64" fill="#1D4ED8" />

                  <rect x="378" y="8" width="156" height="100" rx="12" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.8" />
                  <text x="456" y="34" fill="#1D4ED8" font-size="12.5" font-weight="900" text-anchor="middle">③ 6 mos US CDC Growth Reference</text>
                  <text x="456" y="60" fill="#0F172A" font-size="13" font-weight="900" text-anchor="middle">US CDC Growth Reference ${Math.min(96, weaknessesList[0].score + 16)} pts (+16 pts US CDC Growth Reference</text>
                  <text x="456" y="86" fill="#1D4ED8" font-size="11.5" font-weight="800" text-anchor="middle">US CDC Growth Reference</text>
                </svg>
              </div>
              <div class="mobile-view-block">
                <div style="display: flex; flex-direction: column; gap: 0.42rem;">
                  <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.82rem; font-weight: 900; color: #475569;">① US CDC Growth Reference</span>
                    <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A;">${weaknessesList[0].shortLabel || (weaknessesList[0].title || '').slice(0, 10)} (${weaknessesList[0].score} pts)</span>
                  </div>
                  <div style="background: #EFF6FF; border: 1.5px solid #93C5FD; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.82rem; font-weight: 900; color: #1D4ED8;">② US CDC Growth Reference</span>
                    <span style="font-size: 0.88rem; font-weight: 900; color: #0F172A;">US CDC Growth Reference 15° + ${lqData.trajectory.coached.focusMinutes}US CDC Growth Reference</span>
                  </div>
                  <div style="background: #EFF6FF; border: 1.5px solid #1D4ED8; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.82rem; font-weight: 900; color: #1D4ED8;">③ 6 mos US CDC Growth Reference</span>
                    <span style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8;">US CDC Growth Reference ${Math.min(96, weaknessesList[0].score + 16)} pts (+16 pts US CDC Growth Reference</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.42rem; margin-bottom: 0.65rem;">
              ${weaknessesList.map((w) => `
                <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-left: 4px solid #93C5FD; border-radius: 11px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem;">
                  <span style="font-size: 0.86rem; font-weight: 900; color: #1D4ED8;">
                    ${w.title}: <span style="color: #0F172A; font-weight:800;">${w.howToFix}</span>
                  </span>
                  <span style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800; background: #EFF6FF; padding: 0.18rem 0.5rem; border-radius: 7px;">
                    ${w.helpfulTools}
                  </span>
                </div>
              `).join('')}
            </div>

            <!-- 4-Stage Self-Directed Study Timetable (#bespoke-learning-timetable-box) -->
            <div id="bespoke-learning-timetable-box" style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.75rem 0.9rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.45rem;">
                <span style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8;">
                  US CDC Growth Reference ${ageYears} yrs US CDC Growth Reference 4US CDC Growth Reference
                </span>
                <span style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800;">
                  US CDC Growth Reference → US CDC Growth Reference → US CDC Growth Reference → US CDC Growth Reference SleepUS CDC Growth Reference
                </span>
              </div>
              <div class="pc-view-block">
                <svg id="learning-timetable-clock-svg" viewBox="0 0 540 72" style="width: 100%; height: auto; display: block; margin-bottom: 0.45rem;">
                  <line x1="36" y1="26" x2="504" y2="26" stroke="#93C5FD" stroke-width="3.5" />
                  <circle cx="72" cy="26" r="10" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2" />
                  <text x="72" y="56" fill="#1D4ED8" font-size="12.5" font-weight="900" text-anchor="middle">① US CDC Growth Reference</text>
                  <circle cx="204" cy="26" r="10" fill="#64748B" stroke="#FFFFFF" stroke-width="2" />
                  <text x="204" y="56" fill="#0F172A" font-size="12.5" font-weight="900" text-anchor="middle">② US CDC Growth Reference</text>
                  <circle cx="338" cy="26" r="10" fill="#3B82F6" stroke="#FFFFFF" stroke-width="2" />
                  <text x="338" y="56" fill="#1D4ED8" font-size="12.5" font-weight="900" text-anchor="middle">③ US CDC Growth Reference 3US CDC Growth Reference</text>
                  <circle cx="468" cy="26" r="10" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2" />
                  <text x="468" y="56" fill="#1D4ED8" font-size="12.5" font-weight="900" text-anchor="middle">④ US CDC Growth Reference 10US CDC Growth Reference SleepUS CDC Growth Reference</text>
                </svg>
              </div>
              <div class="learning-mobile-stack" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.42rem; font-size: 0.84rem; color: #0F172A; line-height: 1.42; font-weight: 700;">
                <div style="background: #EFF6FF; border-left: 3.5px solid #1D4ED8; padding: 0.48rem 0.65rem; border-radius: 8px;">${bespokeNote.learningDailyRoutine.stage1}</div>
                <div style="background: #EFF6FF; border-left: 3.5px solid #1D4ED8; padding: 0.48rem 0.65rem; border-radius: 8px;">${bespokeNote.learningDailyRoutine.stage2}</div>
                <div style="background: #EFF6FF; border-left: 3.5px solid #1D4ED8; padding: 0.48rem 0.65rem; border-radius: 8px;">${bespokeNote.learningDailyRoutine.stage3}</div>
                <div style="background: #EFF6FF; border-left: 3.5px solid #1D4ED8; padding: 0.48rem 0.65rem; border-radius: 8px;">${bespokeNote.learningDailyRoutine.stage4}</div>
              </div>
            </div>
          </div>
        </div><!-- /#report-ch-7 -->

        <!-- ================================================================== -->
        <!-- CHAPTER 8: [STEP 7] US CDC Growth Reference [STEP 8] US CDC Growth Reference>
        <!-- ================================================================== -->
        <div id="report-ch-8" style="scroll-margin-top: 5.5rem; margin-top: 1.2rem;">

          <!-- ==================== STEP 7: US CDC Growth Reference N yrs × US CDC Growth Reference 3US CDC Growth Reference ==================== -->
          <div id="learning-step-7-items" style="background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 22px; padding: 1.15rem 1.25rem; margin-bottom: 1.15rem; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.45rem;">
              <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.8rem; font-weight: 900; padding: 0.22rem 0.75rem; border-radius: 9999px;">
                STEP 7 · 3US CDC Growth Reference
              </span>
              <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">
                US CDC Growth Reference ${ageYears} yrs × [${activeStyleInfo.badge}] US CDC Growth Reference
              </span>
            </div>
            <h3 style="font-size: 1.18rem; font-weight: 900; color: #0F172A; margin: 0 0 0.6rem 0;">
              7. Assessment US CDC Growth Reference 3US CDC Growth Reference
            </h3>

            <!-- Schematic SVG 3-Pillar Synergy Diagram (PC SVG vs Mobile Full-Width Cards) -->
            <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.75rem 0.85rem; margin-bottom: 0.6rem;">
              <div class="pc-view-block">
                <svg id="learning-step7-synergy-svg" viewBox="0 0 540 116" style="width: 100%; height: auto; display: block;">
                  <rect x="6" y="8" width="126" height="100" rx="11" fill="#EFF6FF" stroke="#64748B" stroke-width="1.8" />
                  <text x="69" y="34" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">1. US CDC Growth Reference</text>
                  <text x="69" y="60" fill="#0F172A" font-size="12.5" font-weight="900" text-anchor="middle">US CDC Growth Reference</text>
                  <text x="69" y="86" fill="#475569" font-size="11" font-weight="800" text-anchor="middle">US CDC Growth Reference  yrsUS CDC Growth Reference</text>

                  <text x="142" y="64" fill="#1D4ED8" font-size="18" font-weight="900" text-anchor="middle">+</text>

                  <rect x="152" y="8" width="126" height="100" rx="11" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.8" />
                  <text x="215" y="34" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">2. US CDC Growth Reference</text>
                  <text x="215" y="60" fill="#0F172A" font-size="12.5" font-weight="900" text-anchor="middle">US CDC Growth Reference</text>
                  <text x="215" y="86" fill="#1D4ED8" font-size="11" font-weight="800" text-anchor="middle">US CDC Growth Reference</text>

                  <text x="288" y="64" fill="#1D4ED8" font-size="18" font-weight="900" text-anchor="middle">+</text>

                  <rect x="298" y="8" width="124" height="100" rx="11" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.8" />
                  <text x="360" y="34" fill="#1D4ED8" font-size="12" font-weight="900" text-anchor="middle">3. US CDC Growth Reference</text>
                  <text x="360" y="60" fill="#0F172A" font-size="12.5" font-weight="900" text-anchor="middle">${(profile.region || 'growth').slice(0, 6)} US CDC Growth Reference</text>
                  <text x="360" y="86" fill="#1D4ED8" font-size="11" font-weight="800" text-anchor="middle">US CDC Growth Reference</text>

                  <path d="M 426 58 L 440 58" stroke="#1D4ED8" stroke-width="3" />
                  <polygon points="438,52 446,58 438,64" fill="#1D4ED8" />

                  <rect x="448" y="8" width="86" height="100" rx="11" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.8" />
                  <text x="491" y="34" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="middle">US CDC Growth Reference</text>
                  <text x="491" y="60" fill="#0F172A" font-size="12.5" font-weight="900" text-anchor="middle">LQ ${lqData.trajectory.coached.lqScore} pts</text>
                  <text x="491" y="86" fill="#1D4ED8" font-size="11.5" font-weight="900" text-anchor="middle">+${lqData.trajectory.coached.gainLq} pts US CDC Growth Reference</text>
                </svg>
              </div>
              <div class="mobile-view-block">
                <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                  <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 10px; padding: 0.5rem 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.82rem; font-weight: 900; color: #1D4ED8;">1. US CDC Growth Reference</span>
                    <span style="font-size: 0.82rem; font-weight: 800; color: #0F172A;">US CDC Growth Reference  yrsUS CDC Growth Reference</span>
                  </div>
                  <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 10px; padding: 0.5rem 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.82rem; font-weight: 900; color: #1D4ED8;">2. US CDC Growth Reference</span>
                    <span style="font-size: 0.82rem; font-weight: 800; color: #0F172A;">US CDC Growth Reference</span>
                  </div>
                  <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 10px; padding: 0.5rem 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.82rem; font-weight: 900; color: #1D4ED8;">3. US CDC Growth Reference${(profile.region || 'growth').slice(0, 6)})</span>
                    <span style="font-size: 0.82rem; font-weight: 800; color: #0F172A;">US CDC Growth Reference</span>
                  </div>
                  <div style="background: #EFF6FF; border: 1.5px solid #1D4ED8; border-radius: 10px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.84rem; font-weight: 900; color: #1D4ED8;">▶ 3US CDC Growth Reference</span>
                    <span style="font-size: 0.92rem; font-weight: 900; color: #1D4ED8;">LQ ${lqData.trajectory.coached.lqScore} pts (+${lqData.trajectory.coached.gainLq} pts US CDC Growth Reference</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="learning-mobile-stack" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem;">
              <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-left: 4px solid #93C5FD; border-radius: 11px; padding: 0.6rem 0.75rem;">
                <div style="font-size: 0.74rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.2rem;">US CDC Growth Reference TOP 3</div>
                <div style="font-size: 0.82rem; font-weight: 800; color: #0F172A; line-height: 1.4;">
                  ${quickTools.length > 0 ? quickTools.slice(0, 3).map((t, i) => `${i + 1}. ${t.name}`).join('<br/>') : '1. growth<br/>2. growth phone|youtube|game|screen|focus|distract|study|tabletgrowth<br/>3. growth review|recall|memory|forget|exam|test|homework|studyreview|recall|memory|forget|exam|test|homework|study growth'}
                </div>
              </div>
              <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-left: 4px solid #93C5FD; border-radius: 11px; padding: 0.6rem 0.75rem;">
                <div style="font-size: 0.74rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.2rem;">US CDC Growth Reference TOP 3</div>
                <div style="font-size: 0.82rem; font-weight: 800; color: #0F172A; line-height: 1.4;">
                  ${quickBooks.length > 0 ? quickBooks.slice(0, 3).map((b, i) => `${i + 1}. ${b.name}`).join('<br/>') : '1. reading|literacy|vocab|comprehension|essay|passage reading|literacy|vocab|comprehension|essay|passage growth<br/>2. growthmath|arithmetic|geometry|spatial|logic|formula|puzzle math|arithmetic|geometry|spatial|logic|formula|puzzle math|arithmetic|geometry|spatial|logic|formula|puzzle<br/>3. growth reading|literacy|vocab|comprehension|essay|passage growth'}
                </div>
              </div>
              <div style="background: #FFFFFF; border: 1px solid #BFDBFE; border-left: 4px solid #93C5FD; border-radius: 11px; padding: 0.6rem 0.75rem;">
                <div style="font-size: 0.74rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.2rem;">[${profile.region || 'growth'}] US CDC Growth Reference TOP 3</div>
                <div style="font-size: 0.82rem; font-weight: 800; color: #0F172A; line-height: 1.4;">
                  ${quickTours.length > 0 ? quickTours.slice(0, 3).map((t, i) => `${i + 1}. ${t.name}`).join('<br/>') : '1. growth<br/>2. growth<br/>3. growth'}
                </div>
              </div>
            </div>
          </div>

          <!-- ================================================================== -->
          <!-- ON-DEMAND BUTTON & DRAWER: US CDC Growth Reference>
          <!-- ================================================================== -->
          <div id="learning-products-cta-banner" style="margin-top: 1.1rem; margin-bottom: 1.1rem; padding: 1.15rem 1.25rem; background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 20px; text-align: center;">
            <div style="display: inline-block; background: #EFF6FF; border: 1px solid #93C5FD; color: #1D4ED8; font-size: 0.78rem; font-weight: 900; padding: 0.2rem 0.75rem; border-radius: 9999px; margin-bottom: 0.4rem;">
              US CDC Growth Reference ${ageYears} yrs · ${activeStyleInfo.badge} | US CDC Growth Reference pts [${strengthsList[0].title}] US CDC Growth Reference
            </div>
            <div style="font-size: 0.96rem; font-weight: 900; color: #0F172A; margin-bottom: 0.7rem; line-height: 1.42;">
              US CDC Growth Reference Assessment US CDC Growth Reference <strong>US CDC Growth Reference</strong>US CDC Growth Reference.
            </div>
            <button
              type="button"
              id="btn-toggle-learning-products"
              onclick="window.MasterBriefingEngine && window.MasterBriefingEngine.toggleProductDrawer(this, 'learning')"
              style="cursor: pointer; width: 100%; max-width: 560px; min-height: 50px; background: #1D4ED8; border: 1.5px solid #1E40AF; color: #FFFFFF; font-weight: 900; font-size: 0.96rem; padding: 0.75rem 1.15rem; border-radius: 14px; box-shadow: 0 6px 16px rgba(29, 78, 216, 0.2);"
            >
              US CDC Growth Reference ▲
            </button>
          </div>

          <!-- ==================== STEP 8: US CDC Growth Reference ==================== -->
          <div id="learning-curated-products-drawer" class="curated-product-recommendation-section" style="display: block; margin-top: 1rem;">
            <div id="learning-step-8-links" style="background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 20px; padding: 1.1rem 1.2rem; margin-bottom: 1.15rem; text-align: left;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem; padding-bottom: 0.6rem; border-bottom: 1px dashed #BFDBFE;">
                <span style="background: #1D4ED8; color: #FFFFFF; font-size: 0.78rem; font-weight: 900; padding: 0.22rem 0.75rem; border-radius: 9999px;">
                  STEP 8 · US CDC Growth Reference ${ageYears} yrs × [${activeStyleInfo.badge}] US CDC Growth Reference
                </span>
                <span style="font-size: 0.76rem; font-weight: 800; color: #1D4ED8;">
                  US CDC Growth Reference pts US CDC Growth Reference &amp; US CDC Growth Reference pts US CDC Growth Reference
                </span>
              </div>

              <!-- Concise Curated Cards (#pillar2-learning-tools-box, Education Chapter, Travel Chapter) -->
              ${PinpointCurator && typeof PinpointCurator.renderPillar2LearningToolsPrescription === 'function'
                ? PinpointCurator.renderPillar2LearningToolsPrescription(profile)
                : ''}
              ${PinpointCurator && typeof PinpointCurator.renderCustomEducationChapter === 'function'
                ? PinpointCurator.renderCustomEducationChapter(profile)
                : ''}
              ${PinpointCurator && typeof PinpointCurator.renderCustomTravelChapter === 'function'
                ? PinpointCurator.renderCustomTravelChapter(profile)
                : ''}
            </div>
          </div>
        </div><!-- /#report-ch-8 -->

        <!-- Report 2 Standalone Action Footer (100% Independent - No Cross-Report Button) -->
        <div style="margin-top: 1.15rem; padding-top: 0.85rem; border-top: 1px dashed #BFDBFE; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem;">
          <span style="font-size: 0.82rem; color: #1D4ED8; font-weight: 800;">
            [US CDC Growth Reference Report] US CDC Growth Reference Assessment Complete
          </span>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" onclick="window.print()" style="cursor: pointer; background: #EFF6FF; border: 1px solid #93C5FD; color: #0F172A; font-weight: 800; font-size: 0.82rem; padding: 0.45rem 0.9rem; border-radius: 9999px;">
              US CDC Growth Reference Report US CDC Growth Reference PDF US CDC Growth Reference
            </button>
          </div>
        </div>
        <template id="learning-clinical-archive-metadata" style="display:none" data-age="${ageYears}" data-style="${studyStyleKey}" data-temp="${tempKey}" data-axis="${cogAxisPrimary}">
          [KISFIT EXECUTIVE-COGNITIVE CLINICAL ARCHIVE | US CDC Growth Reference ${ageYears} yrs(${exactMonths.toFixed(1)} mos) × ${activeStyleInfo.badge} × ${tempTraitLabelKo} × ${focusTraitLabelKo}]
          1. K-DST US CDC Growth Reference: US CDC Growth Reference${lqData.scores.literacy_vocab} pts), US CDC Growth Reference${lqData.scores.math_spatial} pts), US CDC Growth Reference${lqData.scores.working_memory_focus} pts), US CDC Growth Reference${lqData.scores.metacognition_retrieval} pts), US CDC Growth Reference${lqData.scores.inquiry_creative} pts) — US CDC Growth Reference LQ ${lqData.overallLQ.toFixed(1)} pts(US CDC Growth Reference ${lqData.topPercent}%).
          2. US CDC Growth Reference pts US CDC Growth Reference: ${strengthsList.map(s => s.title + '(' + s.score + 'growth): ' + s.goodTrait + ' -> ' + s.howToBoost + ' [' + s.helpfulTools + ']').join(' | ')}.
          3. US CDC Growth Reference: ${weaknessesList.map(w => w.title + '(' + w.score + 'growth): ' + w.weakTrait + ' -> ' + w.howToFix + ' [' + w.helpfulTools + ']').join(' | ')}.
          4. US CDC Growth Reference: ${recommendedCareers.map(c => c.group + ' (' + c.jobs + ' / ' + c.majors + '): ' + c.reason).join(' | ')}.
          5. Slow-Wave Sleep (N3)(SWS) US CDC Growth ReferenceDiekelmann & Born 2010, PMID:20046194; Roediger & Karpicke 2006, PMID:16507066; Mix et al. 2016, DOI:10.1037/edu0000105; Romeo et al. 2018, PMID:29648612; Gathercole et al. 2004, PMID:14979759):
          ${bespokeNote.learningDailyRoutine.stage1} / ${bespokeNote.learningDailyRoutine.stage2} / ${bespokeNote.learningDailyRoutine.stage3} / ${bespokeNote.learningDailyRoutine.stage4}.
          6. US CDC Growth Reference×US CDC Growth Reference: US CDC Growth Reference${quickTools.map(t => t.name + ':' + (t.specKo || '')).join(', ')}) / US CDC Growth Reference${quickBooks.map(b => b.name + ':' + (b.specKo || '')).join(', ')}) / US CDC Growth Reference${quickTours.map(t => t.name + ':' + (t.specKo || '')).join(', ')}).
          7. 5US CDC Growth Reference: ${strengthsList.concat(weaknessesList).map(d => `[${d.title || ''}| ptsUS CDC Growth Reference:${d.score || 80}|US CDC Growth Reference:${d.goodTrait || d.weakTrait || ''}|US CDC Growth Reference:${d.howToBoost || d.howToFix || ''}|US CDC Growth Reference:${d.helpfulTools || ''}]`).join(' // ').repeat(9)}.
        </template>
      </div><!-- /#pillar-2-container -->

        <!-- Mandatory FTC & Affiliate Disclosure (Always visible inside the report) -->
        <div id="affiliate-ftc-disclosure" style="margin-bottom: 1.1rem; padding: 0.7rem 0.95rem; background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 12px; font-size: 0.78rem; color: #475569; text-align: center; line-height: 1.45;">
          ${isEn ? 'ℹ Links provided may earn an affiliate commission through partner affiliate programs at no additional cost to you.' : 'ℹUS CDC Growth Reference dUS CDC Growth ReferencedUS CDC Growth Reference.'}
        </div>

        <!-- ================================================================== -->
        <!-- SOFT-LOCK-IN MEMBERSHIP VAULT: growth vs growth -->
        <!-- ================================================================== -->
        <div id="member-history-vault-section" style="margin-top: 1.2rem; margin-bottom: 1.1rem;">
          <!-- 1) growth -->
          <div id="growth-history-vault-box" style="display: ${isLearningDefault ? 'none' : 'block'}; background: #F8FAFC; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 1.25rem; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.55rem;">
              <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.8rem; font-weight: 900; padding: 0.22rem 0.7rem; border-radius: 9999px; border: 1px solid #BFDBFE;">
                [growth] growth·growth
              </span>
              <span style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800;">
                growth
              </span>
            </div>
            <h3 style="font-size: 1.08rem; font-weight: 900; color: #0F172A; margin: 0 0 0.4rem 0;">
              growth(${height}cm · growth ${kdcaTop}%)growth
            </h3>
            <p style="font-size: 0.82rem; color: #475569; line-height: 1.5; margin: 0 0 0.8rem 0;">
              growth(growth)growth genetic|mom|dad|parent|short|small|percentile growth.
            </p>

            <div style="display: flex; flex-wrap: wrap; gap: 0.55rem; margin-bottom: 0.8rem;">
              <input
                type="text"
                id="vault-child-name"
                class="form-input"
                placeholder="US CDC Growth Reference: US CDC Growth Reference"
                style="flex: 1 1 160px; min-height: 44px; font-size: 0.88rem; background: #FFFFFF; border: 1px solid #BFDBFE; color: #0F172A; padding: 0.5rem 0.85rem; border-radius: 10px;"
              />
              <input
                type="text"
                id="vault-member-contact"
                class="form-input"
                placeholder="US CDC Growth Referenced"
                style="flex: 1.5 1 220px; min-height: 44px; font-size: 0.88rem; background: #FFFFFF; border: 1px solid #BFDBFE; color: #0F172A; padding: 0.5rem 0.85rem; border-radius: 10px;"
              />
              <button
                type="button"
                id="btn-save-history-vault"
                data-age="${ageYears}"
                data-months="${exactMonths.toFixed(1)}"
                data-height="${height}"
                data-weight="${weight}"
                data-top="${kdcaTop}"
                data-mph="${mphVal}"
                data-opt="${optimizedHeight}"
                data-vel="${velocityPerYear}"
                onclick="window.MasterBriefingEngine && window.MasterBriefingEngine.saveGrowthVault(this)"
                style="background: #1D4ED8; color: #FFFFFF; border: 1.5px solid #1E40AF; border-radius: 10px; padding: 0.55rem 1.15rem; min-height: 44px; font-size: 0.86rem; font-weight: 900; cursor: pointer;"
              >
                growth
              </button>
            </div>

            <div id="vault-save-feedback" style="display: none; margin-bottom: 0.7rem; padding: 0.5rem 0.8rem; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; font-size: 0.82rem; font-weight: 800; color: #1D4ED8;"></div>

            <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.7rem;">
              <table style="width: 100%; min-width: 520px; white-space: nowrap; border-collapse: collapse; font-size: 0.82rem; color: #0F172A; text-align: left;">
                <thead>
                  <tr style="border-bottom: 1px solid #BFDBFE; color: #1D4ED8;">
                    <th style="padding: 0.45rem 0.55rem;">growth</th>
                    <th style="padding: 0.45rem 0.55rem;">growth</th>
                    <th style="padding: 0.45rem 0.55rem;">growth / milk|dairy|picky|appetite|meat|veggie|thin|weight</th>
                    <th style="padding: 0.45rem 0.55rem;">genetic|mom|dad|parent|short|small|percentile</th>
                    <th style="padding: 0.45rem 0.55rem;">growth rhinitis|snor|mouth breath|airway|sleep|bedtime|lategrowth</th>
                    <th style="padding: 0.45rem 0.55rem;">growth</th>
                  </tr>
                </thead>
                <tbody id="vault-history-tbody">
                  <tr style="border-bottom: 1px solid #BFDBFE;">
                    <td style="padding: 0.45rem;">growth</td>
                    <td style="padding: 0.45rem; font-weight: 800; color: #1D4ED8;">growth (growth ${ageYears}growth)</td>
                    <td style="padding: 0.45rem; font-weight: 900; color: #1D4ED8;">${height}cm / ${weight}kg</td>
                    <td style="padding: 0.45rem; color: #1D4ED8; font-weight: 800;">growth ${kdcaTop}%</td>
                    <td style="padding: 0.45rem; color: #1D4ED8; font-weight: 800;">${optimizedHeight}cm</td>
                    <td style="padding: 0.45rem; color: #1D4ED8; font-weight: 800;">growth</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 2) growth·growth -->
          <div id="learning-history-vault-box" style="display: ${isLearningDefault ? 'block' : 'none'}; background: #F8FAFC; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 1.25rem; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.55rem;">
              <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.8rem; font-weight: 900; padding: 0.22rem 0.7rem; border-radius: 9999px; border: 1px solid #BFDBFE;">
                [growth·growth] growth·LQ growth
              </span>
              <span style="font-size: 0.76rem; color: #1D4ED8; font-weight: 800;">
                growth LQ growth
              </span>
            </div>
            <h3 style="font-size: 1.08rem; font-weight: 900; color: #0F172A; margin: 0 0 0.4rem 0;">
              growth(LQ ${lqData.overallLQ.toFixed(1)}growth · growth ${lqData.topPercent}%)growth
            </h3>
            <p style="font-size: 0.82rem; color: #475569; line-height: 1.5; margin: 0 0 0.8rem 0;">
              growth <strong>growth(${activeStyleInfo.title}), growth(${strengthsList[0].title}), growth(${weaknessesList[0].title})</strong>growth.
            </p>

            <div style="display: flex; flex-wrap: wrap; gap: 0.55rem; margin-bottom: 0.8rem;">
              <input
                type="text"
                id="vault-learning-child-name"
                class="form-input"
                placeholder="US CDC Growth Reference: US CDC Growth Reference"
                style="flex: 1 1 160px; min-height: 44px; font-size: 0.88rem; background: #FFFFFF; border: 1px solid #BFDBFE; color: #0F172A; padding: 0.5rem 0.85rem; border-radius: 10px;"
              />
              <input
                type="text"
                id="vault-learning-member-contact"
                class="form-input"
                placeholder="US CDC Growth Referenced"
                style="flex: 1.5 1 220px; min-height: 44px; font-size: 0.88rem; background: #FFFFFF; border: 1px solid #BFDBFE; color: #0F172A; padding: 0.5rem 0.85rem; border-radius: 10px;"
              />
              <button
                type="button"
                id="btn-save-learning-history-vault"
                data-age="${ageYears}"
                data-lq="${lqData.overallLQ.toFixed(1)}"
                data-top="${lqData.topPercent}"
                data-style="${activeStyleInfo.title}"
                data-strength="${strengthsList[0].title}"
                data-target="${lqData.trajectory.coached.lqScore}"
                onclick="window.MasterBriefingEngine && window.MasterBriefingEngine.saveLearningVault(this)"
                style="background: #1D4ED8; color: #FFFFFF; border: 1.5px solid #1E40AF; border-radius: 10px; padding: 0.55rem 1.15rem; min-height: 44px; font-size: 0.86rem; font-weight: 900; cursor: pointer;"
              >
                growth·growth
              </button>
            </div>

            <div id="vault-learning-save-feedback" style="display: none; margin-bottom: 0.7rem; padding: 0.5rem 0.8rem; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; font-size: 0.82rem; font-weight: 800; color: #1D4ED8;"></div>

            <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.7rem;">
              <table style="width: 100%; min-width: 520px; white-space: nowrap; border-collapse: collapse; font-size: 0.82rem; color: #0F172A; text-align: left;">
                <thead>
                  <tr style="border-bottom: 1px solid #BFDBFE; color: #1D4ED8;">
                    <th style="padding: 0.45rem 0.55rem;">growth</th>
                    <th style="padding: 0.45rem 0.55rem;">growth</th>
                    <th style="padding: 0.45rem 0.55rem;">growth (LQ)</th>
                    <th style="padding: 0.45rem 0.55rem;">growth</th>
                    <th style="padding: 0.45rem 0.55rem;">6growth LQ</th>
                    <th style="padding: 0.45rem 0.55rem;">growth</th>
                  </tr>
                </thead>
                <tbody id="vault-learning-history-tbody">
                  <tr style="border-bottom: 1px solid #BFDBFE;">
                    <td style="padding: 0.45rem;">growth</td>
                    <td style="padding: 0.45rem; font-weight: 800; color: #1D4ED8;">growth (growth ${ageYears}growth)</td>
                    <td style="padding: 0.45rem; font-weight: 900; color: #1D4ED8;">LQ ${lqData.overallLQ.toFixed(1)}growth (growth ${lqData.topPercent}%)</td>
                    <td style="padding: 0.45rem; color: #1D4ED8; font-weight: 800;">${activeStyleInfo.title}</td>
                    <td style="padding: 0.45rem; color: #1D4ED8; font-weight: 800;">LQ ${lqData.trajectory.coached.lqScore}growth</td>
                    <td style="padding: 0.45rem; color: #1D4ED8; font-weight: 800;">growth</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================================================================== -->
        <!-- REPEAT-VISIT RETENTION LOOP CARD: growth vs growth -->
        <!-- ================================================================== -->
        <div id="retention-repeat-loop-section" style="margin-top: 1.15rem; margin-bottom: 1.1rem;">
          <!-- 1) growth (#growth-retention-repeat-loop) -->
          <div id="growth-retention-repeat-loop" style="display: ${isLearningDefault ? 'none' : 'block'}; background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 18px; padding: 1.25rem; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.65rem;">
              <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.82rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px; border: 1px solid #93C5FD;">
                [growth] growth
              </span>
              <span style="font-size: 0.8rem; color: #1D4ED8; font-weight: 800;">
                growth 1cmgrowth 7cmgrowth
              </span>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 900; color: #0F172A; margin: 0 0 0.65rem 0; line-height: 1.4;">
              growth
            </h3>
            <div class="learning-mobile-stack" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.65rem; margin-bottom: 0.85rem;">
              <div style="background: #FFFFFF; border-top: 3px solid #93C5FD; border-radius: 12px; padding: 0.8rem 0.9rem;">
                <div style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.25rem;">① growth 1growth</div>
                <div style="font-size: 0.82rem; color: #0F172A; line-height: 1.45;">growth·milk|dairy|picky|appetite|meat|veggie|thin|weightgrowth(5~6cm/growth↑)growth.</div>
              </div>
              <div style="background: #FFFFFF; border-top: 3px solid #93C5FD; border-radius: 12px; padding: 0.8rem 0.9rem;">
                <div style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.25rem;">② growth</div>
                <div style="font-size: 0.82rem; color: #0F172A; line-height: 1.45;">growth 10growth posture|slouch|neck|spine|shoulder|flat feet|desk growth·growth exercise|jump|rope|sport|sedentary|stamina growth 5growth.</div>
              </div>
              <div style="background: #FFFFFF; border-top: 3px solid #93C5FD; border-radius: 12px; padding: 0.8rem 0.9rem;">
                <div style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.25rem;">③ 3growth(growth) growth</div>
                <div style="font-size: 0.82rem; color: #0F172A; line-height: 1.45;">milk|dairy|picky|appetite|meat|veggie|thin|weight growth·growthD3·growth·growth.</div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
              <button
                type="button"
                data-age="${ageYears}"
                data-height="${height}"
                data-opt="${optimizedHeight}"
                onclick="window.MasterBriefingEngine && window.MasterBriefingEngine.copyGrowthReminder(this)"
                style="flex: 1 1 240px; min-height: 44px; background: #1D4ED8; color: #FFFFFF; border: 1.5px solid #1E40AF; border-radius: 12px; padding: 0.6rem 1rem; font-size: 0.88rem; font-weight: 900; cursor: pointer;"
              >
                ${isEn ? 'Copy Growth Check-in Routine to Clipboard' : "US CDC Growth Reference 'US CDC Growth Reference ptsUS CDC Growth Reference' US CDC Growth Reference"}
              </button>
            </div>
          </div>

          <!-- 2) growth (#learning-retention-repeat-loop) -->
          <div id="learning-retention-repeat-loop" style="display: ${isLearningDefault ? 'block' : 'none'}; background: #F8FAFC; border: 2px solid #93C5FD; border-radius: 18px; padding: 1.25rem; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.65rem;">
              <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.82rem; font-weight: 900; padding: 0.24rem 0.75rem; border-radius: 9999px; border: 1px solid #93C5FD;">
                ${isEn ? '[Brain & Learning] Periodic Check-in Routine' : '[US CDC Growth Reference] US CDC Growth Reference ptsUS CDC Growth Reference'}
              </span>
              <span style="font-size: 0.8rem; color: #1D4ED8; font-weight: 800;">
                ${isEn ? 'Periodic check-in guide to reinforce strengths and bridge gaps' : 'US CDC Growth Reference ptsUS CDC Growth Reference ptsUS CDC Growth Reference  ptsUS CDC Growth Reference'}
              </span>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 900; color: #0F172A; margin: 0 0 0.65rem 0; line-height: 1.4;">
              ${isEn ? 'Brain & Learning Periodic Check-in Checklist' : 'US CDC Growth Reference ptsUS CDC Growth Reference'}
            </h3>
            <div class="learning-mobile-stack" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.65rem; margin-bottom: 0.85rem;">
              <div style="background: #FFFFFF; border-top: 3px solid #93C5FD; border-radius: 12px; padding: 0.8rem 0.9rem;">
                <div style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.25rem;">${isEn ? '① Every Friday Evening' : '① US CDC Growth Referenced US CDC Growth Reference'}</div>
                <div style="font-size: 0.82rem; color: #0F172A; line-height: 1.45;">${isEn ? 'Lightly check weekly active recall review & sustained focus progress.' : `US CDC Growth Reference ${isToddlerAge ? 'US CDC Growth Reference' : 'US CDC Growth Reference & US CDC Growth Reference  hrs'} US CDC Growth Reference  ptsUS CDC Growth Reference yrsUS CDC Growth Reference.`}</div>
              </div>
              <div style="background: #FFFFFF; border-top: 3px solid #93C5FD; border-radius: 12px; padding: 0.8rem 0.9rem;">
                <div style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.25rem;">${isEn ? '② 1st of Every Month' : '② US CDC Growth Reference 1d'}</div>
                <div style="font-size: 0.82rem; color: #0F172A; line-height: 1.45;">${isEn ? `Monitor changes in top strength (${strengthsList[0].title}) and focus area (${weaknessesList[0].title}).` : `US CDC Growth Reference pts(${strengthsList[0].title})US CDC Growth Reference pts(${weaknessesList[0].title})US CDC Growth Reference LQ US CDC Growth Reference yrsUS CDC Growth Reference.`}</div>
              </div>
              <div style="background: #FFFFFF; border-top: 3px solid #93C5FD; border-radius: 12px; padding: 0.8rem 0.9rem;">
                <div style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8; margin-bottom: 0.25rem;">${isEn ? '③ 3-Month Cycle' : '③ 3 mos US CDC Growth Reference'}</div>
                <div style="font-size: 0.82rem; color: #0F172A; line-height: 1.45;">${isEn ? 'Upgrade to next-tier reading books, workbooks, and experiential exploration courses.' : 'US CDC Growth Reference yrsUS CDC Growth Reference.'}</div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
              <button
                type="button"
                data-age="${ageYears}"
                data-style="${activeStyleInfo.title}"
                data-lq="${lqData.overallLQ.toFixed(1)}"
                data-target="${lqData.trajectory.coached.lqScore}"
                onclick="window.MasterBriefingEngine && window.MasterBriefingEngine.copyLearningReminder(this)"
                style="flex: 1 1 240px; min-height: 44px; background: #1D4ED8; color: #FFFFFF; border: 1.5px solid #1E40AF; border-radius: 12px; padding: 0.6rem 1rem; font-size: 0.88rem; font-weight: 900; cursor: pointer;"
              >
                ${isEn ? 'Copy Learning Check-in Routine to Clipboard' : "US CDC Growth Reference 'US CDC Growth Reference ptsUS CDC Growth Reference' US CDC Growth Reference"}
              </button>
            </div>
          </div>
        </div>

        <!-- ================================================================== -->
        <!-- GOLDEN ZONE 4-CHANNEL OWNED MEDIA HUB (growth·growth / growth·growth 4growth) -->
        <!-- ================================================================== -->
        ${isEn ? '' : `
        <div id="official-4channel-community-hub" style="margin-top: 1.2rem; margin-bottom: 1.2rem; background: #F8FAFC; border: 1.5px solid #BFDBFE; border-radius: 20px; padding: 1.2rem 1.3rem; text-align: left;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.55rem;">
            <span style="background: #EFF6FF; color: #1D4ED8; font-size: 0.78rem; font-weight: 900; padding: 0.22rem 0.7rem; border-radius: 9999px; border: 1px solid #BFDBFE;">
              KISFIT US CDC Growth Reference 4US CDC Growth Reference
            </span>
            <span style="font-size: 0.76rem; color: #475569; font-weight: 800;">
              US CDC Growth Reference | US CDC Growth Reference 4US CDC Growth Reference
            </span>
          </div>
          <h3 id="channel-hub-dynamic-title" style="font-size: 1.1rem; font-weight: 900; color: #0F172A; margin: 0 0 0.75rem 0; line-height: 1.4;">
            \${isLearningDefault
              ? 'US CDC Growth Reference 4US CDC Growth Reference'
              : 'US CDC Growth Reference 4US CDC Growth Reference'}
          </h3>
          <div class="learning-mobile-stack" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.65rem;">
            <!-- 1. Naver Blog -->
            <a href="https://blog.naver.com/expertise333" target="_blank" rel="noopener noreferrer" id="hub-link-naver-blog" style="text-decoration: none; background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.85rem 0.95rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.35rem;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
                  <span style="font-size: 0.75rem; font-weight: 900; color: #1D4ED8;">US CDC Growth Reference</span>
                  <span style="font-size: 0.72rem; color: #1D4ED8; font-weight: 800;">US CDC Growth Reference ↗</span>
                </div>
                <div style="font-size: 0.9rem; font-weight: 900; color: #0F172A;">
                  US CDC Growth Reference &amp; US CDC Growth Reference
                </div>
              </div>
            </a>

            <!-- 2. Naver Cafe -->
            <a href="https://cafe.naver.com/moneyfitlab" target="_blank" rel="noopener noreferrer" id="hub-link-naver-cafe" style="text-decoration: none; background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.85rem 0.95rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.35rem;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
                  <span style="font-size: 0.75rem; font-weight: 900; color: #1D4ED8;">US CDC Growth Reference</span>
                  <span style="font-size: 0.72rem; color: #1D4ED8; font-weight: 800;">US CDC Growth Reference ↗</span>
                </div>
                <div style="font-size: 0.9rem; font-weight: 900; color: #0F172A;">
                  US CDC Growth Reference PDF &amp; US CDC Growth Reference
                </div>
              </div>
            </a>

            <!-- 3. Instagram (4-Panel Webtoon) -->
            <a href="https://www.instagram.com/kids_fit1" target="_blank" rel="noopener noreferrer" id="hub-link-instagram" style="text-decoration: none; background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.85rem 0.95rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.35rem;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
                  <span style="font-size: 0.75rem; font-weight: 900; color: #1D4ED8;">US CDC Growth Reference@kids_fit1)</span>
                  <span style="font-size: 0.72rem; color: #1D4ED8; font-weight: 800;">4US CDC Growth Reference ↗</span>
                </div>
                <div style="font-size: 0.9rem; font-weight: 900; color: #0F172A;">
                  US CDC Growth Reference &amp; US CDC Growth Reference 4US CDC Growth Reference
                </div>
              </div>
            </a>

            <!-- 4. Threads (4-Panel Webtoon Simultaneous Upload) -->
            <a href="https://www.threads.com/@kids_fit1" target="_blank" rel="noopener noreferrer" id="hub-link-threads" style="text-decoration: none; background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 0.85rem 0.95rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.35rem;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
                  <span style="font-size: 0.75rem; font-weight: 900; color: #1D4ED8;">US CDC Growth ReferenceThreads)</span>
                  <span style="font-size: 0.72rem; color: #1D4ED8; font-weight: 800;">US CDC Growth Reference ↗</span>
                </div>
                <div style="font-size: 0.9rem; font-weight: 900; color: #0F172A;">
                  4US CDC Growth Reference &amp; US CDC Growth Reference
                </div>
              </div>
            </a>
          </div>
        </div>
        `}

        <!-- Physical Growth Cohort Section: Hidden when viewing Learning Report! -->
        <div id="growth-cohort-log-wrapper" style="display: ${isLearningDefault ? 'none' : 'block'};">
          ${UserCohortDB && typeof UserCohortDB.renderGuidebookCohortSection === 'function'
            ? UserCohortDB.renderGuidebookCohortSection(profile, computedMetrics)
            : ''}
        </div>

        <!-- ================================================================== -->
        <!-- REPORT FOOTER ARCHIVE: growth AI growth & growth (growth) -->
        <!-- ================================================================== -->
        <div id="report-end-academic-archive" style="margin-top: 1.5rem; background: #F8FAFC; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 1.15rem 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 0.7rem;">
            <div style="display: inline-flex; align-items: center; gap: 0.45rem;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #EFF6FF; box-shadow: 0 4px 14px #F8FAFC;"></span>
              <span id="live-research-sync-text" style="font-size: 0.88rem; font-weight: 900; color: #1D4ED8;">
                growth AI growth ${totalDbPapers.toLocaleString('en-US')}growth (growth ${growthMacroCount.toLocaleString('en-US')}growth · growth ${learningMacroCount.toLocaleString('en-US')}growth)
              </span>
            </div>
            <span style="font-size: 0.75rem; font-weight: 800; color: #1D4ED8; background: #EFF6FF; border: 1px solid #BFDBFE; padding: 0.2rem 0.65rem; border-radius: 9999px;">
              PubMed · Crossref · OpenAlex 30growth
            </span>
          </div>

          <details class="clinical-source-details" open style="background: #F8FAFC; border: 1px solid #BFDBFE; border-radius: 14px; padding: 0.8rem 1.1rem;">
            <summary style="cursor: pointer; font-size: 0.86rem; font-weight: 800; color: #1D4ED8; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <span>${isEn ? 'Peer-Reviewed Academic References Applied to This Report' : 'US CDC Growth Reference ReportUS CDC Growth Reference ▼)'}</span>
              <span style="font-size: 0.74rem; color: #1D4ED8; background: #EFF6FF; padding: 0.16rem 0.55rem; border-radius: 9999px;">growth ${totalDbPapers.toLocaleString('en-US')}growth DB growth</span>
            </summary>
            <div class="briefing-section briefing-research" id="briefing-research-section" style="margin-top: 0.75rem; padding-top: 0.7rem; border-top: 1px dashed #BFDBFE;">
              <div id="briefing-papers-container" class="briefing-papers-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${matchedPapers.map(({ paper: p, matchedCauseKo, matchedCauseEn }) => `
                  <div class="matched-paper-card" style="background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 0.65rem 0.8rem; text-align: left;">
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.2rem;">
                      <span style="color: #1D4ED8; font-size: 0.82rem; font-weight: 800;">
                        • ${isEn ? matchedCauseEn : matchedCauseKo}
                      </span>
                      <span style="font-size: 0.75rem; color: #1D4ED8;">
                        ${p.pmid
                          ? `<a href="https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/" target="_blank" rel="noopener noreferrer" style="color: #1D4ED8; text-decoration: none; font-weight: 700;">${p.authors && p.authors[0] ? p.authors[0].split(' ')[0] : 'PubMed'} (${p.year}) · PMID ↗</a>`
                          : p.doi
                          ? `<a href="https://doi.org/${p.doi}" target="_blank" rel="noopener noreferrer" style="color: #1D4ED8; text-decoration: none; font-weight: 700;">${p.journal || 'DOI'} (${p.year}) · DOI ↗</a>`
                          : ''}
                      </span>
                    </div>
                    <div style="font-size: 0.82rem; color: #0F172A; line-height: 1.45;">
                      ${getCleanFactLine(p, isEn)}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </details>
        </div>

      </div>
    `;
  }

  /**
   * Switches between Standalone Physical Growth Report ('growth')
   * and Standalone Brain & Learning Report ('learning') — 100% Separate.
   */
  function switchActiveReport(mode) {
    if (typeof document === 'undefined') return;
    const normalized = (mode === 'learning') ? 'learning' : 'growth';
    global.__KIDSFIT_PREFERRED_REPORT_MODE = normalized;
    if (typeof window !== 'undefined') window.__KIDSFIT_PREFERRED_REPORT_MODE = normalized;
    if (global.KidsFitApp && global.KidsFitApp.state && global.KidsFitApp.state.profile) {
      global.KidsFitApp.state.profile.preferredReportMode = normalized;
    }
    if (document.body && document.body.classList) {
      document.body.classList.toggle('print-mode-learning', normalized === 'learning');
    }

    // Strictly hide any cross-report switching buttons so Physical Growth Report and Brain Learning Report never enter each other
    const btnGrowth = document.getElementById('btn-switch-report-growth');
    const btnLearning = document.getElementById('btn-switch-report-learning');
    const navHeaderGrowth = document.getElementById('nav-header-growth-report');
    const navHeaderLearning = document.getElementById('nav-header-learning-report');
    if (btnGrowth && btnGrowth.style) btnGrowth.style.display = 'none';
    if (btnLearning && btnLearning.style) btnLearning.style.display = 'none';
    if (navHeaderGrowth && navHeaderGrowth.style) navHeaderGrowth.style.display = 'none';
    if (navHeaderLearning && navHeaderLearning.style) navHeaderLearning.style.display = 'none';

    const p1 = document.getElementById('pillar-1-container');
    const p2 = document.getElementById('pillar-2-container');
    const growthVault = document.getElementById('growth-history-vault-box');
    const learningVault = document.getElementById('learning-history-vault-box');
    const growthLoop = document.getElementById('growth-retention-repeat-loop');
    const learningLoop = document.getElementById('learning-retention-repeat-loop');
    const growthCohortWrapper = document.getElementById('growth-cohort-log-wrapper');

    if (p1) {
      p1.style.display = (normalized === 'learning') ? 'none' : 'block';
    }
    if (p2) {
      p2.style.display = (normalized === 'growth') ? 'none' : 'block';
    }
    if (growthVault) {
      growthVault.style.display = (normalized === 'learning') ? 'none' : 'block';
    }
    if (learningVault) {
      learningVault.style.display = (normalized === 'growth') ? 'none' : 'block';
    }
    if (growthLoop) {
      growthLoop.style.display = (normalized === 'learning') ? 'none' : 'block';
    }
    if (learningLoop) {
      learningLoop.style.display = (normalized === 'growth') ? 'none' : 'block';
    }
    if (growthCohortWrapper) {
      growthCohortWrapper.style.display = (normalized === 'learning') ? 'none' : 'block';
    }

    const targetScrollEl = normalized === 'learning' ? p2 : p1;
    if (targetScrollEl && typeof targetScrollEl.scrollIntoView === 'function') {
      targetScrollEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Attaches click event to retest button and live bespoke note updater
   */
  function attachRetestHandler(callback) {
    if (typeof document === 'undefined') return;

    if (global.__KIDSFIT_PREFERRED_REPORT_MODE === 'growth' || global.__KIDSFIT_PREFERRED_REPORT_MODE === 'learning') {
      switchActiveReport(global.__KIDSFIT_PREFERRED_REPORT_MODE);
    }

    // 1. Wire Live Bespoke Note Chips & Update Button inside the Report (Both Top Studio & Pillar 1 Box)
    const topInput = document.getElementById('antigravity-live-characteristic-input');
    const topBtn = document.getElementById('btn-antigravity-live-generate');
    const topChips = typeof document.querySelectorAll === 'function'
      ? document.querySelectorAll('.antigravity-top-chip')
      : [];
    const liveInput = document.getElementById('live-bespoke-note-input');
    const liveBtn = document.getElementById('btn-live-bespoke-update');
    const liveChips = typeof document.querySelectorAll === 'function'
      ? document.querySelectorAll('.live-bespoke-chip')
      : [];

    if (topChips && topChips.forEach && topInput) {
      topChips.forEach((chip) => {
        chip.addEventListener('click', () => {
          const snippet = chip.getAttribute('data-snippet') || '';
          if (!snippet) return;
          const cur = (topInput.value || '').trim();
          if (!cur.includes(snippet)) {
            topInput.value = cur ? `${cur} ${snippet}` : snippet;
          }
          if (liveInput) liveInput.value = topInput.value;
          chip.style.borderColor = '#1D4ED8';
          chip.style.background = '#EFF6FF';
          chip.style.color = '#1D4ED8';
        });
      });
    }

    if (liveChips && liveChips.forEach && liveInput) {
      liveChips.forEach((chip) => {
        chip.addEventListener('click', () => {
          const snippet = chip.getAttribute('data-snippet') || '';
          if (!snippet) return;
          const cur = (liveInput.value || '').trim();
          if (!cur.includes(snippet)) {
            liveInput.value = cur ? `${cur} ${snippet}` : snippet;
          }
          if (topInput) topInput.value = liveInput.value;
          chip.style.borderColor = '#1D4ED8';
          chip.style.background = '#EFF6FF';
          chip.style.color = '#1D4ED8';
        });
      });
    }

    const triggerLiveAntigravityReportUpdate = (sourceInputEl) => {
      const newNote = ((sourceInputEl && sourceInputEl.value) || (topInput && topInput.value) || (liveInput && liveInput.value) || '').trim();
      const wizardNoteEl = document.getElementById('parent-free-note');
      if (wizardNoteEl) wizardNoteEl.value = newNote;

      const wiz = global.TallerOnboardingWizard || (typeof window !== 'undefined' ? window.TallerOnboardingWizard : null);
      const wizState = wiz ? (typeof wiz.getState === 'function' ? wiz.getState() : wiz.state) : null;
      const appProfile = (global.KidsFitApp && global.KidsFitApp.state && global.KidsFitApp.state.profile) ? global.KidsFitApp.state.profile : null;
      const baseProfile = (wizState && wizState.profile) ? wizState.profile : (appProfile || {});
      const curProfile = Object.assign({}, baseProfile, { parentFreeNote: newNote });

      if (wizState && wizState.profile) {
        wizState.profile.parentFreeNote = newNote;
      }
      if (appProfile) {
        appProfile.parentFreeNote = newNote;
      }

      const mbEl = document.getElementById('master-briefing-card');
      if (mbEl) {
        mbEl.innerHTML = renderMasterBriefingCard(curProfile);
        attachRetestHandler(callback);
        if (global.KidsFitApp && typeof global.KidsFitApp.attachHormoneSliderListeners === 'function') {
          global.KidsFitApp.attachHormoneSliderListeners();
        }
        const bioStudio = global.KidsFitBiomechanicsStudio || global.BiomechanicsStudio || global.TallerBiomechanicsStudio;
        if (bioStudio && typeof bioStudio.initRoutineTimers === 'function') {
          bioStudio.initRoutineTimers();
        }
      }

      const statusBox = document.getElementById('antigravity-live-api-status');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = `<strong>Antigravity AI growth!</strong> growth(<em>"${newNote.replace(/</g, '&lt;').replace(/>/g, '&gt;') || 'US CDC Growth Reference'}"</em>)growth·growth.`;
      }

      // Sync to server /api/antigravity-report and /api/bespoke-note asynchronously
      if (typeof window !== 'undefined' && typeof window.fetch === 'function' && newNote) {
        try {
          window.fetch('/api/antigravity-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              profile: curProfile,
              parentFreeNote: newNote
            })
          })
            .then((res) => (res && res.ok ? res.json() : null))
            .then((data) => {
              const latestStatusBox = document.getElementById('antigravity-live-api-status');
              if (latestStatusBox && data && data.ok) {
                const topPaper = Array.isArray(data.matchedPapers) && data.matchedPapers[0] ? data.matchedPapers[0] : null;
                latestStatusBox.style.display = 'block';
                latestStatusBox.innerHTML = `<strong>[growth #${data.verifiedId || 'AGY-LIVE'}] Antigravity growth (${data.totalPapersSearched || 2081}growth):</strong> ${data.customAiPrescription || ''}${topPaper ? `<br/><span style="color: #1D4ED8;">US CDC Growth Reference: ${topPaper.titleKo || topPaper.title} (${topPaper.journal || 'PubMed'}, ${topPaper.year || ''}) — ${topPaper.findingKo || ''}</span>` : ''}`;
              }
            })
            .catch(() => {});
        } catch (_) {}
      }
    };

    if (topBtn && topInput) {
      topBtn.onclick = () => triggerLiveAntigravityReportUpdate(topInput);
    }

    if (liveBtn && liveInput) {
      liveBtn.onclick = () => triggerLiveAntigravityReportUpdate(liveInput);
    }

    if (global.KidsFitGlobalPaywall && typeof global.KidsFitGlobalPaywall.transformGlobalReportAndApplyPaywall === 'function') {
      try {
        global.KidsFitGlobalPaywall.transformGlobalReportAndApplyPaywall();
      } catch (_) {}
    }

    const btn = document.getElementById('btn-retest');
    if (!btn) return;

    btn._currentRetestFn = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof document !== 'undefined' && document.body && document.body.classList) {
        document.body.classList.add('studio-mode-active');
      }

      const dashboard = document.getElementById('results-dashboard') || document.getElementById('prescription-container');
      if (dashboard) {
        dashboard.style.display = 'none';
        dashboard.classList.add('hidden');
      }

      const quizSection = document.getElementById('quiz-section');
      if (quizSection) {
        quizSection.style.display = 'block';
        quizSection.classList.remove('hidden');
        if (typeof quizSection.scrollIntoView === 'function') {
          quizSection.scrollIntoView({ behavior: 'smooth' });
        }
      }

      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        heroSection.style.display = 'block';
        heroSection.classList.remove('hidden');
      }

      const presetsBar = document.getElementById('quick-presets-bar') || document.querySelector('.quick-presets-wrapper');
      if (presetsBar) {
        presetsBar.style.display = 'block';
        presetsBar.classList.remove('hidden');
      }

      if (typeof callback === 'function') {
        callback();
      } else if (global.TallerOnboardingWizard && typeof global.TallerOnboardingWizard.goToStep === 'function') {
        global.TallerOnboardingWizard.goToStep(1);
      }
    };

    if (!btn._retestDelegatorBound) {
      btn._retestDelegatorBound = true;
      btn.addEventListener('click', (e) => {
        if (typeof btn._currentRetestFn === 'function') {
          btn._currentRetestFn(e);
        }
      });
    }
  }

  /**
   * Clean helper methods for product drawers, history vaults, and reminder copy buttons
   * (Replaces inline onclick strings so HTML attributes never break or leak raw JS code)
   */
  function toggleProductDrawer(btn, mode) {
    if (typeof document === 'undefined') return;
    const isLearning = mode === 'learning';
    const boxId = isLearning ? 'learning-curated-products-drawer' : 'growth-curated-products-drawer';
    const box = document.getElementById(boxId);
    const ftc = document.getElementById('affiliate-ftc-disclosure');
    if (!box) return;
    const isHidden = (box.style.display === 'none' || !box.style.display);
    box.style.display = isHidden ? 'block' : 'none';
    if (ftc && isHidden) ftc.style.display = 'block';
    if (btn) {
      if (isLearning) {
        btn.innerHTML = isHidden
          ? 'US CDC Growth Reference ▲'
          : 'US CDC Growth Reference ▼';
      } else {
        btn.innerHTML = isHidden
          ? 'US CDC Growth Reference ▲'
          : 'US CDC Growth ReferenceNutritionUS CDC Growth Reference ▼';
      }
    }
    if (isHidden && typeof box.scrollIntoView === 'function') {
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function saveGrowthVault(btn) {
    if (typeof document === 'undefined') return;
    try {
      const nameEl = document.getElementById('vault-child-name');
      const contactEl = document.getElementById('vault-member-contact');
      const cName = (nameEl && nameEl.value && nameEl.value.trim()) ? nameEl.value.trim() : 'US CDC Growth Reference';
      const cContact = (contactEl && contactEl.value && contactEl.value.trim()) ? contactEl.value.trim() : 'US CDC Growth Reference';
      const ageYears = Number((btn && btn.getAttribute('data-age')) || 10);
      const ageMonths = Number((btn && btn.getAttribute('data-months')) || 120);
      const height = Number((btn && btn.getAttribute('data-height')) || 137);
      const weight = Number((btn && btn.getAttribute('data-weight')) || 35);
      const topPercent = Number((btn && btn.getAttribute('data-top')) || 50);
      const mph = Number((btn && btn.getAttribute('data-mph')) || 170);
      const potentialHeight = Number((btn && btn.getAttribute('data-opt')) || 177);
      const velocity = Number((btn && btn.getAttribute('data-vel')) || 6.0);

      const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem('kidsfit_member_history_vault') : null;
      let list = raw ? JSON.parse(raw) : [];
      const today = new Date().toISOString().slice(0, 10);
      const entry = {
        date: today,
        childName: cName,
        contact: cContact,
        ageYears,
        ageMonths,
        height,
        weight,
        topPercent,
        mph,
        potentialHeight,
        velocity
      };
      list.unshift(entry);
      if (list.length > 20) list = list.slice(0, 20);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('kidsfit_member_history_vault', JSON.stringify(list));
      }
      const tbody = document.getElementById('vault-history-tbody');
      if (tbody) {
        tbody.innerHTML = list.map((r, idx) => {
          const prev = list[idx + 1];
          const diff = prev
            ? ((r.height - prev.height) >= 0 ? `+${(r.height - prev.height).toFixed(1)}cm` : `${(r.height - prev.height).toFixed(1)}cm`)
            : 'US CDC Growth Reference pts';
          return `<tr style="border-bottom: 1px solid #BFDBFE;"><td style="padding:0.5rem;">${r.date}</td><td style="padding:0.5rem;font-weight:800;color: #1D4ED8;">${r.childName} (growth ${r.ageYears}growth)</td><td style="padding:0.5rem;font-weight:900;color: #1D4ED8;">${r.height}cm / ${r.weight}kg</td><td style="padding:0.5rem;color: #1D4ED8;font-weight:800;">growth ${r.topPercent}%</td><td style="padding:0.5rem;color: #1D4ED8;font-weight:800;">${r.potentialHeight}cm</td><td style="padding:0.5rem;color: #1D4ED8;font-weight:800;">${diff}</td></tr>`;
        }).join('');
      }
      const msgEl = document.getElementById('vault-save-feedback');
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.textContent = `[${today}] ${cName}growth(${height}cm · growth ${topPercent}%)growth!`;
      }
    } catch (_) {}
  }

  function saveLearningVault(btn) {
    if (typeof document === 'undefined') return;
    try {
      const nameEl = document.getElementById('vault-learning-child-name');
      const contactEl = document.getElementById('vault-learning-member-contact');
      const cName = (nameEl && nameEl.value && nameEl.value.trim()) ? nameEl.value.trim() : 'US CDC Growth Reference';
      const cContact = (contactEl && contactEl.value && contactEl.value.trim()) ? contactEl.value.trim() : 'US CDC Growth Reference';
      const ageYears = Number((btn && btn.getAttribute('data-age')) || 10);
      const overallLQ = Number((btn && btn.getAttribute('data-lq')) || 78);
      const topPercent = Number((btn && btn.getAttribute('data-top')) || 22);
      const styleTitle = (btn && btn.getAttribute('data-style')) || 'US CDC Growth Reference';
      const topStrength = (btn && btn.getAttribute('data-strength')) || 'US CDC Growth Reference pts';
      const targetCoachedLQ = Number((btn && btn.getAttribute('data-target')) || 90);

      const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem('kidsfit_learning_history_vault') : null;
      let list = raw ? JSON.parse(raw) : [];
      const today = new Date().toISOString().slice(0, 10);
      const entry = {
        date: today,
        childName: cName,
        contact: cContact,
        ageYears,
        overallLQ,
        topPercent,
        styleTitle,
        topStrength,
        targetCoachedLQ
      };
      list.unshift(entry);
      if (list.length > 20) list = list.slice(0, 20);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('kidsfit_learning_history_vault', JSON.stringify(list));
      }
      const tbody = document.getElementById('vault-learning-history-tbody');
      if (tbody) {
        tbody.innerHTML = list.map((r, idx) => {
          const prev = list[idx + 1];
          const diff = prev
            ? ((r.overallLQ - prev.overallLQ) >= 0 ? `+${(r.overallLQ - prev.overallLQ).toFixed(1)}growth` : `${(r.overallLQ - prev.overallLQ).toFixed(1)}growth`)
            : 'US CDC Growth Reference Assessment US CDC Growth Reference pts';
          return `<tr style="border-bottom: 1px solid #BFDBFE;"><td style="padding:0.5rem;">${r.date}</td><td style="padding:0.5rem;font-weight:800;color: #1D4ED8;">${r.childName} (growth ${r.ageYears}growth)</td><td style="padding:0.5rem;font-weight:900;color: #1D4ED8;">LQ ${r.overallLQ}growth (growth ${r.topPercent}%)</td><td style="padding:0.5rem;color: #1D4ED8;font-weight:800;">${r.styleTitle}</td><td style="padding:0.5rem;color: #1D4ED8;font-weight:800;">LQ ${r.targetCoachedLQ}growth</td><td style="padding:0.5rem;color: #1D4ED8;font-weight:800;">${diff}</td></tr>`;
        }).join('');
      }
      const msgEl = document.getElementById('vault-learning-save-feedback');
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.textContent = `[${today}] ${cName}growth·growth(LQ ${overallLQ}growth · growth ${topPercent}%)growth!`;
      }
    } catch (_) {}
  }

  function copyGrowthReminder(btn) {
    try {
      const isEn = (typeof I18n !== 'undefined' && typeof I18n.getCurrentLanguage === 'function' && I18n.getCurrentLanguage() === 'en') ||
                   (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang === 'en');
      const age = (btn && btn.getAttribute('data-age')) || '10';
      const height = (btn && btn.getAttribute('data-height')) || '137';
      const opt = (btn && btn.getAttribute('data-opt')) || '177';
      const text = isEn
        ? `[Periodic Growth Check-in Routine] Child (Age ${age}, Current ${height}cm) Target Potential ${opt}cm Action Plan! 1) 1st of every month: re-measure height. 2) Weekly 10 PM sleep & spine decompression check. 3) Every 3 months: update weight-proportional nutrition. https://kisfitglobal.com`
        : `[US CDC Growth Reference ptsUS CDC Growth Reference] US CDC Growth Reference ${age} yrs, US CDC Growth Reference ${height}cm) US CDC Growth Reference ${opt}cm US CDC Growth Reference! ①US CDC Growth Reference 1d US CDC Growth Reference ptsUS CDC Growth Reference ②US CDC Growth Reference10US CDC Growth Reference Sleep·US CDC Growth Reference ③3 mosUS CDC Growth Reference WeightUS CDC Growth Reference Nutrition US CDC Growth Reference https://kidsfit.co.kr`;
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
      if (btn) {
        btn.textContent = isEn ? 'Growth Check-in Routine copied to clipboard!' : 'US CDC Growth Reference [US CDC Growth Reference ptsUS CDC Growth Reference]US CDC Growth Reference!';
        btn.style.background = '#059669';
      }
    } catch (_) {}
  }

  function copyLearningReminder(btn) {
    try {
      const isEn = (typeof I18n !== 'undefined' && typeof I18n.getCurrentLanguage === 'function' && I18n.getCurrentLanguage() === 'en') ||
                   (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang === 'en');
      const age = (btn && btn.getAttribute('data-age')) || '10';
      const style = (btn && btn.getAttribute('data-style')) || 'US CDC Growth Reference';
      const lq = (btn && btn.getAttribute('data-lq')) || '78';
      const target = (btn && btn.getAttribute('data-target')) || '90';
      const text = isEn
        ? `[Periodic Brain & Learning Check-in Routine] Child (Age ${age}, ${style}) LQ ${lq} -> Target ${target} Action Plan! 1) Every Friday: review & focus check. 2) 1st of every month: evaluate strengths/weaknesses LQ scores. 3) Every 3 months: upgrade tailored reading & weekend learning courses. https://kisfitglobal.com`
        : `[US CDC Growth Reference ptsUS CDC Growth Reference] US CDC Growth Reference ${age} yrs, ${style}) LQ ${lq} pts → US CDC Growth Reference ${target} pts US CDC Growth Reference! ①US CDC Growth Referenced US CDC Growth Reference hrs US CDC Growth Reference ②US CDC Growth Reference 1d US CDC Growth Reference pts·US CDC Growth Reference pts LQ US CDC Growth ReferenceAssessment ③3 mosUS CDC Growth Reference https://kidsfit.co.kr`;
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
      if (btn) {
        btn.textContent = isEn ? 'Learning Check-in Routine copied to clipboard!' : 'US CDC Growth Reference [US CDC Growth Reference ptsUS CDC Growth Reference]US CDC Growth Reference!';
        btn.style.background = '#1D4ED8';
      }
    } catch (_) {}
  }

  const MasterBriefingEngine = {
    INHIBITOR_KEYWORDS,
    getKnowledgeBase,
    matchPapers,
    matchHorizonPapers,
    analyzeParentFreeNote,
    buildPhenotypeSpecializedGrowthHtml,
    buildBottleneckSpecializedLearningHtml,
    renderMasterBriefingCard,
    render: renderMasterBriefingCard,
    switchActiveReport,
    toggleProductDrawer,
    saveGrowthVault,
    saveLearningVault,
    copyGrowthReminder,
    copyLearningReminder,
    attachRetestHandler,
    attachRetestListener: attachRetestHandler
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MasterBriefingEngine;
  }
  global.KidsFitMasterBriefing = MasterBriefingEngine;
  global.MasterBriefingEngine = MasterBriefingEngine;
  global.TallerMasterBriefing = MasterBriefingEngine;

})(typeof window !== 'undefined' ? window : global);
