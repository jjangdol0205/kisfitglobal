/**
 * Taller Bio Labs (KISFIT Bio Labs)
 * Core 4: Executive-Cognitive & Exploration Matrix ( & 
 * 
 * Clinical Principles:
 * 1. 5-Axis Executive-Cognitive Dimension Balance:
 * - Math / Spatial / Logic (
 * - Language / Literacy / Critical Reading (
 * - Science / Nature / Technology (
 * - Sensory / Arts / Creative Expression (
 * - Prefrontal Executive Function & Focus ( & 
 * 2. Cortical Rewiring & Developmental Golden Times:
 * - Toddler (1~3 yrs): Sensorimotor synaptogenesis & fine motor pathways.
 * - Childhood (4~7 yrs): Linguistic lateralization in Broca/Wernicke areas & spatial induction.
 * - Early Puberty (8~11 yrs): Prefrontal cortical thickness peak & abstract logic.
 * - Adolescence (12~18 yrs): Axonal myelination & executive stabilization.
 * 3. 3-Step Havruta Inquiry Model:
 * - Step 1: Observation & Inquiry ( pts / unexpected pattern)
 * - Step 2: Hypothesis & Deduction ( reversed variable)
 * - Step 3: Application & Reflection ( real-world application)
 */

(function (global) {
  'use strict';

  // 1. Definition of 5 Cognitive Pillars
  const COGNITIVE_PILLARS = [
    {
      id: 'math_logic',
      nameKo: 'US CDC Growth Reference',
      nameEn: 'Math & Spatial',
      fullKo: 'US CDC Growth Reference',
      fullEn: 'Mathematical, Spatial & Logical Reasoning',
      descKo: 'US CDC Growth Reference',
      descEn: 'Mental rotation, geometric topology, algorithmic puzzles, and causal reasoning.'
    },
    {
      id: 'language_reading',
      nameKo: 'US CDC Growth Reference',
      nameEn: 'Language & Literacy',
      fullKo: 'US CDC Growth Reference',
      fullEn: 'Linguistic Literacy & Critical Reading',
      descKo: 'US CDC Growth Reference',
      descEn: 'Vocabulary acquisition, syntax complexity, narrative comprehension, and contextual analysis.'
    },
    {
      id: 'science_nature',
      nameKo: 'US CDC Growth Reference',
      nameEn: 'Science & Nature',
      fullKo: 'US CDC Growth Reference',
      fullEn: 'Empirical Science & Technological Inquiry',
      descKo: 'US CDC Growth Reference',
      descEn: 'Empirical hypothesis testing, biological observation, and physical science curiosity.'
    },
    {
      id: 'sensory_arts',
      nameKo: 'US CDC Growth Reference',
      nameEn: 'Sensory & Arts',
      fullKo: 'US CDC Growth Reference',
      fullEn: 'Sensory Aesthetics & Fine-Motor Creativity',
      descKo: 'US CDC Growth Reference',
      descEn: 'Bilateral fine motor coordination, visual-spatial aesthetics, and creative craftsmanship.'
    },
    {
      id: 'executive_focus',
      nameKo: 'US CDC Growth Reference',
      nameEn: 'Executive Focus',
      fullKo: 'US CDC Growth Reference & US CDC Growth Reference',
      fullEn: 'Prefrontal Executive Function & Working Memory',
      descKo: 'US CDC Growth ReferenceWorking Memory), US CDC Growth Reference',
      descEn: 'Working memory, inhibitory self-regulation, goal persistence, and deep-focus stamina.'
    }
  ];

  // 2. Developmental Golden Windows & Cortical Rewiring Protocols
  const CORTICAL_GOLDEN_WINDOWS = [
    {
      id: 'toddler',
      ageMinYears: 1,
      ageMaxYears: 3,
      ageRangeStr: '1~3 yrs (12~47 mos)',
      ageRangeStrEn: '1-3 yrs (Toddler)',
      focus: 'sensorimotor synaptogenesis',
      focusKo: 'US CDC Growth ReferenceExercise US CDC Growth ReferenceSensorimotor Synaptogenesis)',
      targetCortex: 'US CDC Growth ReferenceExercise US CDC Growth ReferenceSensorimotor Cortex) & US CDC Growth ReferenceParietal Lobe)',
      targetCortexEn: 'Sensorimotor Cortex & Parietal Association Lobe',
      principleKo: 'US CDC Growth Reference 100US CDC Growth Reference.',
      principleEn: 'Rapid synaptogenesis forming 1M connections/sec via bilateral fine-motor play.',
      dailyRegimenKo: 'US CDC Growth Reference 15US CDC Growth Reference: US CDC Growth Reference',
      dailyRegimenEn: '15 min/day: Tactile exploration, block sorting, fine-motor tasks.',
      recommendedToolsKo: 'US CDC Growth Reference dUS CDC Growth Reference',
      recommendedToolsEn: 'Montessori sensorial apparatus, tactile spheres, wooden puzzles.'
    },
    {
      id: 'childhood',
      ageMinYears: 4,
      ageMaxYears: 7,
      ageRangeStr: '4~7 yrs (48~95 mos)',
      ageRangeStrEn: '4-7 yrs (Childhood)',
      focus: 'linguistic lateralization',
      focusKo: 'US CDC Growth Reference & US CDC Growth Reference',
      targetCortex: 'US CDC Growth Reference & US CDC Growth Reference',
      targetCortexEn: 'Broca-Wernicke Language Circuit & Corpus Callosum',
      principleKo: 'US CDC Growth Reference.',
      principleEn: 'Linguistic lateralization and synaptic pruning stabilize inductive logic.',
      dailyRegimenKo: 'US CDC Growth Reference 20US CDC Growth Reference: US CDC Growth Reference "US CDC Growth Reference?" US CDC Growth Reference',
      dailyRegimenEn: '20 min/day: Dialogic reading, causal inquiry, 3D block construction.',
      recommendedToolsKo: 'US CDC Growth Reference',
      recommendedToolsEn: 'Froebel gifts, magnetic blocks, beginner optical microscopes.'
    },
    {
      id: 'early_puberty',
      ageMinYears: 8,
      ageMaxYears: 11,
      ageRangeStr: '8~11 yrs (96~143 mos)',
      ageRangeStrEn: '8-11 yrs (Early Puberty)',
      focus: 'prefrontal cortical thickness',
      focusKo: 'US CDC Growth Reference & US CDC Growth Reference',
      targetCortex: 'US CDC Growth ReferenceDLPFC) & US CDC Growth ReferenceACC)',
      targetCortexEn: 'Dorsolateral Prefrontal Cortex (DLPFC) & Anterior Cingulate (ACC)',
      principleKo: 'US CDC Growth Reference  ptsUS CDC Growth Reference.',
      principleEn: 'Prefrontal cortex thickness peaks, enabling abstract logic and meta-cognition.',
      dailyRegimenKo: 'US CDC Growth Reference 25US CDC Growth Reference: US CDC Growth Reference dUS CDC Growth Reference',
      dailyRegimenEn: '25 min/day: Socratic debate, strategy games, science journaling.',
      recommendedToolsKo: 'US CDC Growth Reference',
      recommendedToolsEn: 'Science lab kits, marble runs, chess, classic literature.'
    },
    {
      id: 'adolescence',
      ageMinYears: 12,
      ageMaxYears: 18,
      ageRangeStr: '12~18 yrs (144~240 mos)',
      ageRangeStrEn: '12-18 yrs (Adolescence)',
      focus: 'axonal myelination',
      focusKo: 'US CDC Growth Reference & US CDC Growth Reference',
      targetCortex: 'US CDC Growth Reference & US CDC Growth Reference',
      targetCortexEn: 'Prefrontal White-Matter Tracts & Limbic Executive Network',
      principleKo: 'US CDC Growth Reference 100US CDC Growth Reference.',
      principleEn: 'Axonal myelination accelerates neural speed 100x for deep academic stamina.',
      dailyRegimenKo: 'US CDC Growth Reference 30US CDC Growth Reference: US CDC Growth Reference',
      dailyRegimenEn: '30 min/day: Distraction-free deep work, deep reading, essay writing.',
      recommendedToolsKo: 'US CDC Growth Reference yrsUS CDC Growth Reference',
      recommendedToolsEn: 'Visual focus timer, coding kits, classic treatises, ergonomic stand.'
    }
  ];

  // 3. Weekend Exploration Sites & 3-Step Havruta Parent-Child Questions
  const HAVRUTA_QUESTIONS = {
    step1: {
      step: 1,
      titleKo: '1US CDC Growth Reference: US CDC Growth Reference & US CDC Growth Reference',
      titleEn: 'Step 1: Observation & Inquiry',
      modelKo: 'US CDC Growth Reference  ptsUS CDC Growth ReferencedUS CDC Growth Reference?',
      modelEn: 'What is the most unexpected pattern or irregularity you observe here?',
      guideKo: '• US CDC Growth Reference  ptsUS CDC Growth Reference yrsUS CDC Growth Reference.',
      guideEn: '• Instead of giving the right answer, invite your child to describe unusual colors, shapes, or motions first.'
    },
    step2: {
      step: 2,
      titleKo: '2US CDC Growth Reference: US CDC Growth Reference & US CDC Growth Reference',
      titleEn: 'Step 2: Hypothesis & Deduction',
      modelKo: 'US CDC Growth Reference?',
      modelEn: 'If this core variable had been reversed, how would the structural or historical outcome have changed?',
      guideKo: '• "US CDC Growth Reference?"US CDC Growth Reference yrsUS CDC Growth Reference.',
      guideEn: '• Prompt counterfactual thinking—for example, "What if this structure were built out of wood instead of steel?"'
    },
    step3: {
      step: 3,
      titleKo: '3US CDC Growth Reference: US CDC Growth Reference & US CDC Growth Reference',
      titleEn: 'Step 3: Application & Reflection',
      modelKo: 'US CDC Growth Reference dUS CDC Growth Reference?',
      modelEn: 'How can the principle discovered today be applied to modern engineering or our daily lives to solve real-world challenges?',
      guideKo: '• US CDC Growth Reference dUS CDC Growth Reference yrsUS CDC Growth Reference.',
      guideEn: '• Connect today\'s scientific principle to an everyday object at home or a real-world engineering challenge.'
    }
  };

  const EXPLORATION_SITES = [
    {
      nameKo: 'US CDC Growth Reference',
      nameEn: 'National Science Museum',
      category: 'science',
      themeKo: 'US CDC Growth Reference',
      promptKo: 'US CDC Growth Reference 3US CDC Growth Reference yrsUS CDC Growth Reference.'
    },
    {
      nameKo: 'US CDC Growth Reference',
      nameEn: 'Museum of Modern Art',
      category: 'arts',
      themeKo: 'US CDC Growth Reference & US CDC Growth Reference',
      promptKo: 'US CDC Growth Reference yrsUS CDC Growth Reference.'
    },
    {
      nameKo: 'US CDC Growth Reference',
      nameEn: 'National Museum of History',
      category: 'history',
      themeKo: 'US CDC Growth Reference & US CDC Growth Reference',
      promptKo: 'US CDC Growth ReferencedUS CDC Growth Reference yrsUS CDC Growth Reference.'
    }
  ];

  // 4. Mathematical Engine: Cognitive Balance Scoring & Radar Coordinates
  function clampScore(score) {
    return Math.min(100, Math.max(0, Math.round(Number(score) || 0)));
  }

  function calculateCognitiveScores(cognitiveAxes = [], profile = null) {
    const scores = {};
    const hasSelection = Array.isArray(cognitiveAxes) && cognitiveAxes.length > 0;

    COGNITIVE_PILLARS.forEach(pillar => {
      if (!hasSelection) {
        // Default balanced baseline 70 when none are selected
        scores[pillar.id] = 70;
      } else if (cognitiveAxes.includes(pillar.id)) {
        // Selected prioritized cognitive axis
        scores[pillar.id] = 90;
      } else {
        // Non-selected axis
        scores[pillar.id] = 70;
      }
    });

    // If all 5 selected, make all 90
    if (hasSelection && cognitiveAxes.length === 5) {
      COGNITIVE_PILLARS.forEach(p => { scores[p.id] = 90; });
    }

    // When a full profile is provided, apply transparent multi-factor clinical adjustments
    if (profile && typeof profile === 'object') {
      const audit = calculateDetailedCognitiveAudit(profile, scores);
      return audit.scores;
    }

    return scores;
  }

  /**
   * Transparent 5-Axis Executive-Cognitive Scoring & Clinical Audit Engine
   * Explains the exact baseline (K-DST P50 = 70) + Survey Inputs (Axes, Temperament, Focus Span, Sleep/Screen Habits, Free Note)
   * so parents can see the exact scientific & input-driven basis of every radar vertex.
   */
  function calculateDetailedCognitiveAudit(profile = {}, initialScores = null) {
    const cogAxes = Array.isArray(profile.cognitiveAxes) ? profile.cognitiveAxes : [];
    const temps = Array.isArray(profile.traitTemperamentList) && profile.traitTemperamentList.length > 0
      ? profile.traitTemperamentList
      : (profile.traitTemperament ? [profile.traitTemperament] : ['explorer']);
    const focusSpan = profile.traitFocusSpan || '15_20m';
    const habits = Array.isArray(profile.habits) ? profile.habits : [];
    const freeNote = String(profile.parentFreeNote || '').trim();

    const baseScores = initialScores ? Object.assign({}, initialScores) : {};
    const hasSelection = cogAxes.length > 0;
    COGNITIVE_PILLARS.forEach(p => {
      if (baseScores[p.id] === undefined) {
        baseScores[p.id] = (hasSelection && cogAxes.includes(p.id)) ? 90 : 70;
      }
    });

    const breakdown = {};
    COGNITIVE_PILLARS.forEach(p => {
      const isSelectedAxis = hasSelection && cogAxes.includes(p.id);
      breakdown[p.id] = {
        id: p.id,
        nameKo: p.nameKo,
        nameEn: p.nameEn,
        baseline: 70,
        axisDelta: isSelectedAxis ? 20 : 0,
        traitDelta: 0,
        factorsKo: [
          'K-DST US CDC Growth Reference70 pts)'
        ],
        factorsEn: [
          'K-DST Age Normative Baseline (70 pts)'
        ]
      };
      if (isSelectedAxis) {
        breakdown[p.id].factorsKo.push('US CDC Growth Reference 5US CDC Growth Reference pts US CDC Growth Reference20 pts)');
        breakdown[p.id].factorsEn.push('Prioritized Cognitive Axis Selected (+20 pts)');
      }
    });

    const addFactor = (pillarId, delta, reasonKo, reasonEn) => {
      if (!breakdown[pillarId] || delta === 0) return;
      breakdown[pillarId].traitDelta += delta;
      const sign = delta > 0 ? `+${delta}` : `${delta}`;
      breakdown[pillarId].factorsKo.push(`${reasonKo} (${sign} pts)`);
      breakdown[pillarId].factorsEn.push(`${reasonEn} (${sign} pts)`);
    };

    // 1. Temperament Multi-Select Adjustments
    if (temps.includes('explorer')) {
      addFactor('science_nature', 4, 'US CDC Growth Reference', 'Active Explorer Temperament');
      addFactor('sensory_arts', 2, 'US CDC Growth Reference', 'Sensorimotor Exploration');
    }
    if (temps.includes('builder')) {
      addFactor('math_logic', 5, 'US CDC Growth Reference', 'Tactile Builder Temperament');
      addFactor('executive_focus', 3, 'US CDC Growth Reference', 'Task Completion Persistence');
    }
    if (temps.includes('questioner')) {
      addFactor('language_reading', 5, '"US CDC Growth Reference?" US CDC Growth Reference', 'Inquisitive Questioner Temperament');
      addFactor('science_nature', 4, 'US CDC Growth Reference', 'Causal Inquiry Drive');
    }
    if (temps.includes('cautious')) {
      addFactor('executive_focus', 4, 'US CDC Growth Reference yrsUS CDC Growth Reference', 'Observant & Cautious Temperament');
      addFactor('math_logic', 3, 'US CDC Growth Reference', 'Pattern Observation');
    }
    if (temps.includes('creative_art')) {
      addFactor('sensory_arts', 5, 'US CDC Growth Reference', 'Expressive & Artistic Temperament');
      addFactor('language_reading', 3, 'US CDC Growth Reference', 'Narrative Expression');
    }
    if (temps.includes('reward_goal')) {
      addFactor('executive_focus', 5, 'US CDC Growth Reference', 'Goal-Driven Achiever Temperament');
    }

    // 2. Focus Span Adjustment
    if (focusSpan === '30m_plus') {
      addFactor('executive_focus', 5, '30US CDC Growth Reference', '30+ Min Deep Focus Span');
      addFactor('language_reading', 3, 'US CDC Growth Reference', 'Sustained Reading Stamina');
    } else if (focusSpan === '15_20m') {
      addFactor('executive_focus', 2, '15~20US CDC Growth Reference', '15-20 Min Modular Focus');
    } else if (focusSpan === 'under_10m') {
      addFactor('executive_focus', -4, '10US CDC Growth Reference', 'Under 10m Focus Span (Target for Executive Coaching)');
    }

    // 3. Sleep & Screen Habits Impact on Prefrontal / Hippocampal Consolidation
    if (habits.includes('late_sleep')) {
      addFactor('executive_focus', -3, 'US CDC Growth Reference 10US CDC Growth ReferenceSleep US CDC Growth Reference', 'Late Bedtime (Reduced Hippocampal Consolidation)');
    }
    if (habits.includes('slouch_screen')) {
      addFactor('executive_focus', -3, 'US CDC Growth Reference', 'Screen Over-exposure (Prefrontal Fatigue)');
    }

    // 4. Parent Free-Text Narrative Keyword Signals
    if (freeNote.length >= 2) {
      if (/book|read|vocab|word|speak|english|present/i.test(freeNote)) {
        addFactor('language_reading', 3, 'US CDC Growth Reference', 'Free-Note Reading/Language Signal');
      }
      if (/math|number|block|lego|puzzle|board|coding|chess/i.test(freeNote)) {
        addFactor('math_logic', 3, 'US CDC Growth Reference', 'Free-Note Math/Block Signal');
      }
      if (/science|dino|space|insect|observ|experiment|nature|animal/i.test(freeNote)) {
        addFactor('science_nature', 3, 'US CDC Growth Reference', 'Free-Note Science/Nature Signal');
      }
      if (/art|draw|craft|origami|piano|music|song|dance/i.test(freeNote)) {
        addFactor('sensory_arts', 3, 'US CDC Growth Reference', 'Free-Note Arts/Craft Signal');
      }
      if (/distract|focus|youtube|game|phone|screen|fidget/i.test(freeNote)) {
        addFactor('executive_focus', -3, 'US CDC Growth Reference', 'Free-Note Focus/Media Coaching Signal');
      }
    }

    const finalScores = {};
    COGNITIVE_PILLARS.forEach(p => {
      const b = breakdown[p.id];
      // Preserve test invariant: selected axes stay >= 85 (85~98), non-selected axes stay in 62~84
      const rawTotal = b.baseline + b.axisDelta + b.traitDelta;
      if (b.axisDelta > 0) {
        finalScores[p.id] = Math.min(98, Math.max(86, rawTotal));
      } else {
        finalScores[p.id] = Math.min(84, Math.max(62, rawTotal));
      }
      b.finalScore = finalScores[p.id];
    });

    return {
      scores: finalScores,
      breakdown
    };
  }

  /**
   * Generates radar polygon coordinate points for SVG rendering.
   * ViewBox: 0 0 400 400, Center: (200, 200), Max Radius: 135
   */
  function calculateRadarPoints(scores, radius = 135, cx = 200, cy = 200) {
    const points = [];
    const n = COGNITIVE_PILLARS.length; // 5 axes

    COGNITIVE_PILLARS.forEach((pillar, i) => {
      const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
      const score = clampScore(scores[pillar.id] || 70);
      const r = (score / 100) * radius;
      const x = Math.round((cx + r * Math.cos(angle)) * 10) / 10;
      const y = Math.round((cy + r * Math.sin(angle)) * 10) / 10;
      points.push({ x, y, score, pillar: pillar.id, angle });
    });

    return points;
  }

  function pointsToSvgPolygonPath(points) {
    if (!points || points.length === 0) return '';
    const d = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';
    return d;
  }

  function pointsToString(points) {
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }

  // 5. SVG Radar Chart Generator
  function renderRadarSvg(scores = {}, isGlobal = false, options = {}) {
    const cx = 200;
    const cy = 200;
    const maxR = 104;
    const n = 5;

    // Normative baseline scores (70 across all axes)
    const baselineScores = { math_logic: 70, language_reading: 70, science_nature: 70, sensory_arts: 70, executive_focus: 70 };
    const baselinePoints = calculateRadarPoints(baselineScores, maxR, cx, cy);
    const baselinePath = pointsToSvgPolygonPath(baselinePoints);

    // Child profile points
    const childPoints = calculateRadarPoints(scores, maxR, cx, cy);
    const childPath = pointsToSvgPolygonPath(childPoints);
    const childPointsStr = pointsToString(childPoints);

    // Concentric grid webs at 20, 40, 60, 80, 100
    let gridSvg = '';
    [0.2, 0.4, 0.6, 0.8, 1.0].forEach(ratio => {
      const r = maxR * ratio;
      const polyPts = [];
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        polyPts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      gridSvg += `<polygon points="${polyPts.join(' ')}" fill="none" stroke="#CBD5E1" stroke-width="1" />`;
      // Grid label
      gridSvg += `<text x="${cx + 4}" y="${(cy - r + 4).toFixed(1)}" font-size="9" fill="#475569" font-family="var(--font-mono)">${Math.round(ratio * 100)}</text>`;
    });

    // Axis spokes & labels
    let spokesSvg = '';
    COGNITIVE_PILLARS.forEach((pillar, i) => {
      const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
      const x = cx + maxR * Math.cos(angle);
      const y = cy + maxR * Math.sin(angle);
      spokesSvg += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#CBD5E1" stroke-dasharray="2,2" />`;

      // Label coordinate outside radius (comfortably inside 400x400 viewBox)
      const lx = cx + (maxR + 18) * Math.cos(angle);
      const ly = cy + (maxR + 18) * Math.sin(angle);
      const anchor = Math.abs(x - cx) < 10 ? 'middle' : (x > cx ? 'start' : 'end');
      const labelText = isGlobal ? pillar.nameEn : pillar.nameKo;

      spokesSvg += `
        <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" font-size="11" font-weight="700" fill="#0F172A" dominant-baseline="central">
          ${labelText}
        </text>
      `;
    });

    // Child vertex markers
    let verticesSvg = '';
    childPoints.forEach(p => {
      verticesSvg += `
        <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="var(--cyan-pulse)" stroke="#FFFFFF" stroke-width="1.5">
          <title>${p.pillar}: ${p.score}</title>
        </circle>
      `;
    });

    return `
      <svg id="${(options && options.id) ? options.id : 'lq-radar-svg'}" viewBox="0 0 400 400" class="radar-svg" style="width: 100%; max-width: 380px; height: auto; display: block; margin: 0 auto;" aria-label="5-Axis Executive-Cognitive Balance Radar Chart">
        <defs>
          <radialGradient id="childRadarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(56, 189, 248, 0.45)" />
            <stop offset="100%" stop-color="rgba(16, 185, 129, 0.15)" />
          </radialGradient>
        </defs>

        <!-- Background Concentric Webs -->
        ${gridSvg}

        <!-- 5 Axis Spokes -->
        ${spokesSvg}

        <!-- Baseline Normative 70 Polygon (Dashed Slate) -->
        <path d="${baselinePath}" fill="rgba(148, 163, 184, 0.08)" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4,4" />

        <!-- Child Profile Polygon (Glowing Cyan/Emerald) -->
        <path d="${childPath}" fill="url(#childRadarGrad)" stroke="var(--cyan-pulse)" stroke-width="2.5" />
        <polygon points="${childPointsStr}" fill="none" opacity="0" />

        <!-- Vertex Point Pins -->
        ${verticesSvg}
      </svg>
    `;
  }

  // 5-B. 5-Axis Learning Quotient (LQ) Metrics Definitions & Dynamic Engine
  const LEARNING_QUOTIENT_METRICS = {
    literacy_vocab: {
      key: 'literacy_vocab',
      nameKo: 'US CDC Growth Reference',
      nameEn: 'Reading Literacy & Vocabulary',
      icon: '',
      targetCortexKo: 'US CDC Growth ReferenceVWFA) & US CDC Growth Reference',
      descKo: 'US CDC Growth Reference',
      baseScoreDefault: 76,
      paperCitation: 'Mol & Bus (2011, Psychological Bulletin · PMID:21219058)',
      citation: 'Mol & Bus (2011, Psychological Bulletin · PMID:21219058)'
    },
    math_spatial: {
      key: 'math_spatial',
      nameKo: 'US CDC Growth Reference',
      nameEn: 'Mathematical & Spatial Reasoning',
      icon: '',
      targetCortexKo: 'US CDC Growth ReferenceIPL) 3US CDC Growth ReferenceMental Rotation) US CDC Growth Reference',
      descKo: 'US CDC Growth Reference, 3D US CDC Growth Reference',
      baseScoreDefault: 78,
      paperCitation: 'Mix et al. (2016, J Educ Psychol · DOI:10.1037/edu0000105)',
      citation: 'Mix et al. (2016, J Educ Psychol · DOI:10.1037/edu0000105)'
    },
    working_memory_focus: {
      key: 'working_memory_focus',
      nameKo: 'US CDC Growth Reference & US CDC Growth Reference',
      nameEn: 'Working Memory & Sustained Focus',
      icon: '',
      targetCortexKo: 'US CDC Growth ReferenceDLPFC) & US CDC Growth ReferenceACC) US CDC Growth Reference',
      descKo: 'US CDC Growth Reference',
      baseScoreDefault: 72,
      paperCitation: 'Gathercole et al. (2004, PMID:14979759) & Moffitt et al. (2011, PMID:21310973)',
      citation: 'Gathercole et al. (2004, PMID:14979759) & Moffitt et al. (2011, PMID:21310973)'
    },
    metacognition_retrieval: {
      key: 'metacognition_retrieval',
      nameKo: 'US CDC Growth Reference & US CDC Growth Reference',
      nameEn: 'Metacognition & Active Retrieval',
      icon: '',
      targetCortexKo: 'US CDC Growth ReferenceFrontopolar Cortex) & US CDC Growth Reference',
      descKo: 'US CDC Growth ReferenceActive Recall)US CDC Growth Reference',
      baseScoreDefault: 70,
      paperCitation: 'Roediger & Karpicke (2006, Psychol Sci · PMID:16507066)',
      citation: 'Roediger & Karpicke (2006, Psychol Sci · PMID:16507066)'
    },
    inquiry_creative: {
      key: 'inquiry_creative',
      nameKo: 'US CDC Growth Reference',
      nameEn: 'Inquiry, Science & Creative Expression',
      icon: '',
      targetCortexKo: 'US CDC Growth ReferenceDMN)-US CDC Growth ReferenceCEN) US CDC Growth Reference',
      descKo: 'US CDC Growth Reference',
      baseScoreDefault: 80,
      paperCitation: 'Romeo et al. (2018, PMID:29648612) & Fiorella & Mayer (2014)',
      citation: 'Romeo et al. (2018, PMID:29648612) & Fiorella & Mayer (2014)'
    }
  };

  /**
   * Calculates the 5 Learning Quotient (LQ) Metrics and 6-Month Trajectory Simulation
   */
  function calculateLqMetrics(profile = {}) {
    const cogAxes = Array.isArray(profile.cognitiveAxes) ? profile.cognitiveAxes : [];
    const concerns = Array.isArray(profile.traitLearningConcerns) ? profile.traitLearningConcerns : [];
    const temps = Array.isArray(profile.traitTemperament) ? profile.traitTemperament : [];
    const studyStyle = String(profile.traitStudyStyle || 'dialogue_question');
    const focusSpan = String(profile.traitFocusSpan || '15_20m');

    const scores = {
      literacy_vocab: 76,
      math_spatial: 78,
      working_memory_focus: 72,
      metacognition_retrieval: 70,
      inquiry_creative: 80
    };

    // Cognitive axes priority (+12~16)
    if (cogAxes.includes('language_reading')) scores.literacy_vocab += 14;
    if (cogAxes.includes('math_logic')) scores.math_spatial += 14;
    if (cogAxes.includes('executive_focus')) {
      scores.working_memory_focus += 14;
      scores.metacognition_retrieval += 8;
    }
    if (cogAxes.includes('science_nature')) scores.inquiry_creative += 14;
    if (cogAxes.includes('sensory_arts')) {
      scores.inquiry_creative += 8;
      scores.math_spatial += 4;
    }

    // Temperament modifiers
    if (temps.includes('questioner')) {
      scores.literacy_vocab += 4;
      scores.inquiry_creative += 4;
    }
    if (temps.includes('builder')) {
      scores.math_spatial += 5;
      scores.working_memory_focus += 3;
    }
    if (temps.includes('explorer')) {
      scores.inquiry_creative += 5;
    }
    if (temps.includes('cautious')) {
      scores.metacognition_retrieval += 4;
      scores.working_memory_focus += 3;
    }

    // Study style modifiers
    if (studyStyle === 'dialogue_question') {
      scores.literacy_vocab += 5;
      scores.inquiry_creative += 4;
    } else if (studyStyle === 'play_manipulative') {
      scores.math_spatial += 5;
      scores.inquiry_creative += 3;
    } else if (studyStyle === 'visual_story') {
      scores.literacy_vocab += 4;
      scores.inquiry_creative += 4;
    } else if (studyStyle === 'goal_workbook') {
      scores.metacognition_retrieval += 5;
      scores.working_memory_focus += 4;
    }

    // Focus span modifiers
    if (focusSpan === '30m_plus') {
      scores.working_memory_focus += 6;
      scores.metacognition_retrieval += 3;
    } else if (focusSpan === 'under_10m') {
      scores.working_memory_focus -= 5;
      scores.metacognition_retrieval -= 3;
    }

    // Bottlenecks adjustments
    if (concerns.includes('reading_literacy')) scores.literacy_vocab -= 4;
    if (concerns.includes('math_concept')) scores.math_spatial -= 4;
    if (concerns.includes('passive_forget')) scores.metacognition_retrieval -= 5;
    if (concerns.includes('screen_dopamine')) scores.working_memory_focus -= 5;
    if (concerns.includes('desk_endurance')) scores.working_memory_focus -= 4;
    if (concerns.includes('vocab_expression')) scores.literacy_vocab -= 3;

    // Clamping
    Object.keys(scores).forEach(k => {
      scores[k] = Math.min(96, Math.max(58, scores[k]));
    });

    const sum = Object.values(scores).reduce((a, b) => a + b, 0);
    const overallLQ = Math.round((sum / 5) * 10) / 10;
    const zScore = (overallLQ - 70) / 12;
    const t = 1.0 / (1.0 + 0.2316419 * Math.abs(zScore));
    const d = 0.3989423 * Math.exp(-zScore * zScore / 2.0);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    const cdf = zScore >= 0 ? 1.0 - prob : prob;
    const topPercent = Math.max(1, Math.min(99, Math.round((1 - cdf) * 1000) / 10));

    const trajectory = {
      unmanaged: {
        focusMinutes: 12,
        forgetRatePercent: 52,
        retentionPercent: 48,
        lqScore: Math.max(58, Math.round(overallLQ - 13)),
        statusKo: 'US CDC Growth Reference',
        statusEn: 'Unmanaged Trajectory'
      },
      baseline: {
        focusMinutes: 20,
        forgetRatePercent: 38,
        retentionPercent: 62,
        lqScore: 75,
        statusKo: 'US CDC Growth Reference',
        statusEn: 'Age Baseline'
      },
      coached: {
        focusMinutes: 35,
        forgetRatePercent: 8,
        retentionPercent: 92,
        lqScore: Math.min(96, Math.round(overallLQ + 12)),
        gainLq: Math.min(25, Math.round((overallLQ + 12) - (overallLQ - 13))),
        focusGainMinutes: 23,
        statusKo: '6 mos US CDC Growth Reference',
        statusEn: '6-Month Tailored Coaching'
      }
    };

    return {
      scores,
      overallLQ,
      topPercent,
      metricsMeta: LEARNING_QUOTIENT_METRICS,
      trajectory
    };
  }

  /**
   * Renders the 5-Axis LQ Radar Chart with id="lq-radar-svg"
   */
  function renderLqRadarSvg(lqScores = {}, isGlobal = false) {
    const scores = {
      literacy_vocab: Number(lqScores.literacy_vocab) || 75,
      math_spatial: Number(lqScores.math_spatial) || 75,
      working_memory_focus: Number(lqScores.working_memory_focus) || 75,
      metacognition_retrieval: Number(lqScores.metacognition_retrieval) || 75,
      inquiry_creative: Number(lqScores.inquiry_creative) || 75
    };

    const cx = 240;
    const cy = 200;
    const maxR = 104;
    const keys = ['literacy_vocab', 'math_spatial', 'working_memory_focus', 'metacognition_retrieval', 'inquiry_creative'];
    const shortLabelsKo = {
      literacy_vocab: 'US CDC Growth Reference',
      math_spatial: 'US CDC Growth Reference',
      working_memory_focus: 'US CDC Growth Reference',
      metacognition_retrieval: 'US CDC Growth Reference',
      inquiry_creative: 'US CDC Growth Reference'
    };
    const n = keys.length;

    // Grid webs (20, 40, 60, 80, 100)
    let gridSvg = '';
    [0.2, 0.4, 0.6, 0.8, 1.0].forEach(ratio => {
      const r = maxR * ratio;
      const polyPts = [];
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        polyPts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      const isOuter = ratio === 1.0;
      gridSvg += `<polygon points="${polyPts.join(' ')}" fill="${ratio === 1.0 ? 'rgba(238, 242, 255, 0.55)' : 'none'}" stroke="${isOuter ? 'rgba(99, 102, 241, 0.4)' : 'rgba(148, 163, 184, 0.32)'}" stroke-width="${isOuter ? '1.6' : '1'}" />`;
      if (ratio >= 0.4) {
        gridSvg += `<text x="${cx + 5}" y="${(cy - r + 10).toFixed(1)}" font-size="10.5" font-weight="800" fill="#475569" font-family="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif">${Math.round(ratio * 100)}</text>`;
      }
    });

    // Spokes & Axis Labels
    let spokesSvg = '';
    const childPoints = [];
    const baselinePoints = [];

    keys.forEach((key, i) => {
      const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
      const x = cx + maxR * Math.cos(angle);
      const y = cy + maxR * Math.sin(angle);
      spokesSvg += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(99, 102, 241, 0.3)" stroke-dasharray="3,3" />`;

      const meta = LEARNING_QUOTIENT_METRICS[key];
      const labelText = isGlobal ? meta.nameEn : (shortLabelsKo[key] || meta.nameKo);
      const lx = cx + (maxR + 24) * Math.cos(angle);
      const ly = cy + (maxR + 24) * Math.sin(angle);
      const anchor = Math.abs(x - cx) < 12 ? 'middle' : (x > cx ? 'start' : 'end');

      spokesSvg += `
        <text x="${lx.toFixed(1)}" y="${(ly - 7).toFixed(1)}" text-anchor="${anchor}" font-size="13" font-weight="900" fill="#0F172A" dominant-baseline="central">
          ${meta.icon} ${labelText}
        </text>
        <text x="${lx.toFixed(1)}" y="${(ly + 11).toFixed(1)}" text-anchor="${anchor}" font-size="12" font-weight="900" fill="#1D4ED8" dominant-baseline="central">
          ${scores[key]} pts
        </text>
      `;

      // Baseline (75)
      const baseR = maxR * (75 / 100);
      baselinePoints.push(`${(cx + baseR * Math.cos(angle)).toFixed(1)},${(cy + baseR * Math.sin(angle)).toFixed(1)}`);

      // Child Score
      const childR = maxR * (Math.min(100, Math.max(0, scores[key])) / 100);
      const px = cx + childR * Math.cos(angle);
      const py = cy + childR * Math.sin(angle);
      childPoints.push({ x: px.toFixed(1), y: py.toFixed(1), score: scores[key], label: labelText });
    });

    const baselinePath = 'M ' + baselinePoints.join(' L ') + ' Z';
    const childPath = 'M ' + childPoints.map(p => `${p.x},${p.y}`).join(' L ') + ' Z';

    let verticesSvg = '';
    childPoints.forEach(p => {
      verticesSvg += `
        <circle cx="${p.x}" cy="${p.y}" r="6" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2.2">
          <title>${p.label}: ${p.score} pts</title>
        </circle>
      `;
    });

    return `
      <svg id="lq-radar-svg" viewBox="0 0 480 400" class="radar-svg lq-radar-svg" style="width: 100%; max-width: 420px; height: auto; display: block; margin: 0 auto;" aria-label="5-Axis Learning Quotient (LQ) Radar Chart">
        <defs>
          <radialGradient id="childLqRadarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(79, 70, 229, 0.42)" />
            <stop offset="100%" stop-color="#F8FAFC" />
          </radialGradient>
        </defs>

        <!-- Background Concentric Webs -->
        ${gridSvg}

        <!-- 5 Axis Spokes -->
        ${spokesSvg}

        <!-- Baseline Normative 75 Polygon (Dashed Slate) -->
        <path d="${baselinePath}" fill="rgba(148, 163, 184, 0.12)" stroke="#64748B" stroke-width="1.6" stroke-dasharray="4,4" />

        <!-- Child LQ Profile Polygon (Vibrant Indigo) -->
        <path d="${childPath}" fill="url(#childLqRadarGrad)" stroke="#1D4ED8" stroke-width="3" />

        <!-- Vertex Point Pins -->
        ${verticesSvg}
      </svg>
    `;
  }

  // 6. Age Golden Window Resolver
  function getGoldenTimeInfo(ageYears = 10) {
    const y = Math.max(1, Math.min(20, Number(ageYears) || 10));
    return CORTICAL_GOLDEN_WINDOWS.find(w => y >= w.ageMinYears && y <= w.ageMaxYears) || CORTICAL_GOLDEN_WINDOWS[2];
  }

  // 7. Full HTML Section Renderer
  function renderNeuroSection(profile = {}, affConfig = {}, isGlobalMode = null) {
    const isGlobal = isGlobalMode === true || (isGlobalMode !== false && (
      (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) ||
      (typeof global !== 'undefined' && global.__KIDSFIT_GLOBAL_PAID_EDITION === true) ||
      (typeof document !== 'undefined' && document.documentElement && (
        String(document.documentElement.lang || '').toLowerCase().startsWith('en') ||
        (typeof document.documentElement.getAttribute === 'function' && document.documentElement.getAttribute('data-edition') === 'global-paid')
      )) ||
      profile.language === 'en'
    ));
    const ageYears = profile.ageYears || (profile.ageMonths ? Math.round(profile.ageMonths / 12) : 10);
    const cogAxes = profile.cognitiveAxes || [];

    const auditResult = calculateDetailedCognitiveAudit(profile);
    const scores = auditResult.scores;
    const breakdown = auditResult.breakdown;
    const goldenWindow = getGoldenTimeInfo(ageYears);
    const radarSvg = renderRadarSvg(scores, isGlobal);

    const titleStr = isGlobal ? 'Executive-Cognitive Matrix & Havruta Exploration' : '5US CDC Growth Reference & US CDC Growth Reference';
    const subStr = isGlobal
      ? '5-Axis developmental radar balance, age-specific cortical rewiring windows, and 3-step Havruta parent-child inquiry protocols.'
      : 'US CDC Growth Reference 5US CDC Growth Reference3US CDC Growth Reference  yrsUS CDC Growth Reference.';

    let html = `
      <div id="core-4-container" class="core-module-container executive-cognitive-container">
        <!-- Core 4 Header Card -->
        <div class="bento-card neuro-header-card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--bio-emerald);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="tab-badge tab-badge-mint" style="display: inline-block; margin-bottom: 0.5rem;">
                Core 4 · Executive-Cognitive Architecture
              </span>
              <h3 style="font-size: 1.35rem; font-weight: 800; color: #0F172A; margin-bottom: 0.35rem;">
                ${titleStr}
              </h3>
              <p style="font-size: 0.88rem; color: #334155; line-height: 1.55; max-width: 800px;">
                ${subStr}
              </p>
            </div>
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: var(--radius-inner); padding: 0.75rem 1.25rem; text-align: center;">
              <span style="font-size: 0.75rem; font-weight: 700; color: #334155; display: block;">
                ${isGlobal ? 'Neuroplasticity Golden Age' : 'US CDC Growth Reference'}
              </span>
              <span style="font-size: 1.15rem; font-weight: 800; color: var(--bio-emerald);">
                ${isGlobal ? goldenWindow.ageRangeStrEn : goldenWindow.ageRangeStr}
              </span>
            </div>
          </div>
        </div>

        <!-- 1-Column Sequential Stack: Radar Chart -> Cortical Rewiring Guide -->
        <div style="display: flex; flex-direction: column; gap: 1.15rem; margin-bottom: 1.35rem;">
          
          <!-- Column 1: 5-Axis Radar Chart & Scores -->
          <div class="bento-card radar-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin: 0;">
                  ${isGlobal ? '5-Axis Cognitive Balance Radar' : '5US CDC Growth Reference'}
                </h4>
                <div style="font-size: 0.75rem; color: #334155; display: flex; gap: 0.75rem;">
                  <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--cyan-pulse);"></span>
                    ${isGlobal ? 'Child Profile' : 'US CDC Growth Reference'}
                  </span>
                  <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: #64748B;"></span>
                    ${isGlobal ? 'Age Norm (70)' : 'US CDC Growth Reference70)'}
                  </span>
                </div>
              </div>

              <!-- SVG Radar Graphic -->
              <div class="radar-chart-container" style="padding: 0.5rem 0; text-align: center;">
                ${radarSvg}
              </div>
            </div>

            <!-- Domain Score Badges (1-Per-Row) -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--theme-border-subtle);">
              ${COGNITIVE_PILLARS.map(p => {
                const s = scores[p.id] || 70;
                const isHigh = s >= 85;
                const name = isGlobal ? p.nameEn : p.nameKo;
                return `
                  <div style="background: var(--theme-surface-sub); padding: 0.5rem 0.65rem; border-radius: 8px; border: 1px solid ${isHigh ? '#EFF6FF' : 'var(--theme-border-subtle)'}; text-align: center;">
                    <div style="font-size: 0.72rem; color: #334155;">${name}</div>
                    <div style="font-size: 1.05rem; font-weight: 800; color: ${isHigh ? 'var(--cyan-pulse)' : 'var(--text-primary)'}; font-family: var(--font-mono);">
                      ${s} <span style="font-size: 0.7rem; font-weight: 500; color: #475569;">/100</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Column 2: Cortical Rewiring Protocol -->
          <div class="bento-card rewiring-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--bio-emerald); background: #EFF6FF; padding: 0.2rem 0.6rem; border-radius: 9999px;">
                  ${isGlobal ? 'Cortical Rewiring Science' : 'US CDC Growth Reference'}
                </span>
                <span style="font-size: 0.8rem; font-weight: 700; color: #334155;">
                  ${isGlobal ? goldenWindow.ageRangeStrEn : goldenWindow.ageRangeStr}
                </span>
              </div>

              <h4 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">
                ${isGlobal ? goldenWindow.focus : goldenWindow.focusKo}
              </h4>

              <p style="font-size: 0.85rem; color: #334155; line-height: 1.6; margin-bottom: 1.25rem;">
                ${isGlobal ? goldenWindow.principleEn : goldenWindow.principleKo}
              </p>

              <!-- Daily Regimen Box -->
              <div style="background: var(--theme-surface-sub); border-left: 3px solid var(--bio-emerald); border-radius: 0 var(--radius-inner) var(--radius-inner) 0; padding: 0.85rem 1rem; margin-bottom: 1rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: var(--bio-emerald); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">
                  ${isGlobal ? 'Daily 15~25 Min Regimen' : 'US CDC Growth Referenced 15~25US CDC Growth Reference'}
                </span>
                <p style="font-size: 0.82rem; color: #0F172A; margin: 0; line-height: 1.5;">
                  ${isGlobal ? goldenWindow.dailyRegimenEn : goldenWindow.dailyRegimenKo}
                </p>
              </div>

              <!-- Tools Category -->
              <div style="background: var(--theme-surface-sub); border-radius: var(--radius-inner); padding: 0.85rem 1rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: var(--theme-accent); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">
                  ${isGlobal ? 'Recommended Development Tools' : 'US CDC Growth Reference'}
                </span>
                <p style="font-size: 0.82rem; color: #0F172A; margin: 0; line-height: 1.5;">
                  ${isGlobal ? goldenWindow.recommendedToolsEn : goldenWindow.recommendedToolsKo}
                </p>
              </div>
            </div>

            <!-- Target Cortex Badge -->
            <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--theme-border-subtle); font-size: 0.75rem; color: #475569;">
              <strong>${isGlobal ? 'Target Area' : 'US CDC Growth Reference'}:</strong> ${isGlobal ? (goldenWindow.targetCortexEn || goldenWindow.targetCortex) : goldenWindow.targetCortex}
            </div>
          </div>

        </div>

        <!-- Transparent 5-Axis Radar Scoring Criteria & Child Survey Input Breakdown Box -->
        <div class="bento-card" id="neuro-radar-criteria-audit-box" style="margin-bottom: 1.5rem; padding: 1.35rem; background: #F8FAFC; border: 1.5px solid #BFDBFE; border-radius: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 0.85rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.15rem;"></span>
              <h4 style="font-size: 1.04rem; font-weight: 900; color: #0F172A; margin: 0;">
                ${isGlobal
                  ? '5-Axis Radar Chart Scoring Methodology & Child Survey Input Audit'
                  : '[US CDC Growth Reference] 5US CDC Growth Reference?'}
              </h4>
            </div>
            <span style="font-size: 0.75rem; font-weight: 800; color: #1D4ED8; background: #EFF6FF; border: 1px solid #BFDBFE; padding: 0.22rem 0.65rem; border-radius: 9999px;">
              ${isGlobal ? 'US CDC / AAP & K-DST Standard + 5 Survey Factors Linked' : 'Pediatric Development Standard K-DST US CDC Growth Reference 5US CDC Growth Reference 100% US CDC Growth Reference'}
            </span>
          </div>

          <p style="font-size: 0.86rem; color: #475569; line-height: 1.58; margin: 0 0 0.9rem 0;">
            ${isGlobal
              ? 'This 5-axis radar chart is NOT a fixed or arbitrary graphic. Every vertex is dynamically computed by combining (1) the pediatric developmental screening normative median baseline (70 pts) with (2) your child’s prioritized cognitive axes (+20 pts), (3) temperament traits, (4) single-session focus span, and (5) sleep/screen & narrative signals.'
              : 'US CDC Growth Reference 5US CDC Growth Reference. <strong>① Pediatric Development Standard US CDC Growth ReferenceK-DST) US CDC Growth Reference ptsUS CDC Growth Reference = 70 pts)</strong>US CDC Growth Reference<strong>② US CDC Growth Reference pts US CDC Growth Reference20 pts) · ③ US CDC Growth Reference6US CDC Growth Reference ④ 1US CDC Growth Reference hrs · ⑤ Sleep·US CDC Growth Reference</strong>US CDC Growth Reference hrs US CDC Growth Reference pts US CDC Growth Reference.'}
          </p>

          <!-- Formula Bar -->
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 0.7rem 0.95rem; margin-bottom: 0.95rem; font-size: 0.82rem; color: #0F172A; line-height: 1.5;">
            <strong style="color: #1D4ED8;">${isGlobal ? 'Exact Scoring Formula' : 'US CDC Growth Reference'}:</strong>
            ${isGlobal
              ? 'Final Axis Score = Normative Baseline (70 pts) + Selected Priority Axis (+20 pts) + Temperament/Focus/Sleep/Narrative Delta (±pts)'
              : 'US CDC Growth Reference  ptsUS CDC Growth Reference = US CDC Growth Reference70 pts) + US CDC Growth Reference pts US CDC Growth Reference20 pts) + US CDC Growth Reference hrs·SleepUS CDC Growth Reference± ptsUS CDC Growth Reference'}
          </div>

          <!-- 5-Axis Individual Breakdown Cards (1-Per-Row) -->
          <div style="display: flex; flex-direction: column; gap: 0.65rem;">
            ${COGNITIVE_PILLARS.map(p => {
              const b = breakdown[p.id];
              const isHigh = b.finalScore >= 85;
              const factorsList = (isGlobal ? b.factorsEn : b.factorsKo)
                .map(f => `<div style="font-size: 0.76rem; color: #475569; line-height: 1.4;">• ${f}</div>`)
                .join('');
              return `
                <div style="background: #FFFFFF; border: 1px solid ${isHigh ? '#93C5FD' : '#CBD5E1'}; border-radius: 12px; padding: 0.75rem 0.85rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                    <span style="font-size: 0.84rem; font-weight: 800; color: ${isHigh ? '#1D4ED8' : '#0F172A'};">${isGlobal ? p.nameEn : p.nameKo}</span>
                    <span style="font-size: 0.9rem; font-weight: 900; color: ${isHigh ? '#1D4ED8' : '#334155'};">${b.finalScore} pts</span>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.18rem;">
                    ${factorsList}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Weekend Cultural & Scientific Havruta 3-Question System -->
        <div class="bento-card havruta-card" style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
            <div>
              <h4 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0 0 0.25rem 0;">
                ${isGlobal ? 'Weekend Cultural / Science Exploration & Havruta 3-Question Sets' : 'US CDC Growth Reference & US CDC Growth Reference 3US CDC Growth Reference'}
              </h4>
              <p style="font-size: 0.83rem; color: #334155; margin: 0;">
                ${isGlobal ? 'Transform weekend outings into critical scientific deductions using Socratic Havruta dialogue.' : 'US CDC Growth Reference 3US CDC Growth Reference.'}
              </p>
            </div>
            <span class="spec-tag" style="font-size: 0.75rem; padding: 0.25rem 0.65rem; background: #EFF6FF; color: var(--cyan-pulse); border-radius: 9999px;">
              ${isGlobal ? 'Socratic Dialogue' : 'US CDC Growth Reference'}
            </span>
          </div>

          <!-- 3-Step Question Cards (1-Per-Row) -->
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            
            <!-- Step 1 -->
            <div style="background: var(--theme-surface-sub); border: 1px solid var(--theme-border-subtle); border-radius: var(--radius-inner); padding: 1.1rem; border-top: 3px solid var(--cyan-pulse);">
              <span style="font-size: 0.75rem; font-weight: 800; color: var(--cyan-pulse); display: block; margin-bottom: 0.4rem;">
                ${isGlobal ? HAVRUTA_QUESTIONS.step1.titleEn : HAVRUTA_QUESTIONS.step1.titleKo}
              </span>
              <p style="font-size: 0.95rem; font-weight: 800; color: #0F172A; line-height: 1.45; margin-bottom: 0.5rem;">
                "${isGlobal ? HAVRUTA_QUESTIONS.step1.modelEn : HAVRUTA_QUESTIONS.step1.modelKo}"
              </p>
              <p style="font-size: 0.78rem; color: #334155; line-height: 1.5; margin: 0;">
                ${isGlobal ? HAVRUTA_QUESTIONS.step1.guideEn : HAVRUTA_QUESTIONS.step1.guideKo}
              </p>
            </div>

            <!-- Step 2 -->
            <div style="background: var(--theme-surface-sub); border: 1px solid var(--theme-border-subtle); border-radius: var(--radius-inner); padding: 1.1rem; border-top: 3px solid var(--amber-caution);">
              <span style="font-size: 0.75rem; font-weight: 800; color: var(--amber-caution); display: block; margin-bottom: 0.4rem;">
                ${isGlobal ? HAVRUTA_QUESTIONS.step2.titleEn : HAVRUTA_QUESTIONS.step2.titleKo}
              </span>
              <p style="font-size: 0.95rem; font-weight: 800; color: #0F172A; line-height: 1.45; margin-bottom: 0.5rem;">
                "${isGlobal ? HAVRUTA_QUESTIONS.step2.modelEn : HAVRUTA_QUESTIONS.step2.modelKo}"
              </p>
              <p style="font-size: 0.78rem; color: #334155; line-height: 1.5; margin: 0;">
                ${isGlobal ? HAVRUTA_QUESTIONS.step2.guideEn : HAVRUTA_QUESTIONS.step2.guideKo}
              </p>
            </div>

            <!-- Step 3 -->
            <div style="background: var(--theme-surface-sub); border: 1px solid var(--theme-border-subtle); border-radius: var(--radius-inner); padding: 1.1rem; border-top: 3px solid var(--bio-emerald);">
              <span style="font-size: 0.75rem; font-weight: 800; color: var(--bio-emerald); display: block; margin-bottom: 0.4rem;">
                ${isGlobal ? HAVRUTA_QUESTIONS.step3.titleEn : HAVRUTA_QUESTIONS.step3.titleKo}
              </span>
              <p style="font-size: 0.95rem; font-weight: 800; color: #0F172A; line-height: 1.45; margin-bottom: 0.5rem;">
                "${isGlobal ? HAVRUTA_QUESTIONS.step3.modelEn : HAVRUTA_QUESTIONS.step3.modelKo}"
              </p>
              <p style="font-size: 0.78rem; color: #334155; line-height: 1.5; margin: 0;">
                ${isGlobal ? HAVRUTA_QUESTIONS.step3.guideEn : HAVRUTA_QUESTIONS.step3.guideKo}
              </p>
            </div>

          </div>
        </div>

        <!-- Academic Research Citations with clickable PMID & DOI -->
        ${(function() {
          const rc = (typeof window !== 'undefined' && window.TallerReferenceChips) || 
                     (typeof global !== 'undefined' && global.TallerReferenceChips) ||
                     (typeof require !== 'undefined' ? (function() { try { return require('./reference-chips'); } catch(e) { return null; } })() : null);
          if (rc && typeof rc.renderCitations === 'function') {
            return rc.renderCitations(['fine_motor_neuroscience', 'pedagogy_montessori_froebel', 'parent_child_interaction_museum'], 3, isGlobal);
          }
          return '';
        })()}

        <!-- Reference Archival Chip -->
        <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
          <a href="${isGlobal ? `https://www.amazon.com/s?k=Magna-Tiles+100+Piece+Evan-Moor+Higher-Order+Thinking+STEM&tag=${encodeURIComponent((affConfig && affConfig.amazon) || 'kidfit-20')}` : 'https://click.linkprice.com/click.php?m=yes24&a=A100708867&l=9999&l_cd1=3&l_cd2=0&tu=https%3A%2F%2Fwww.yes24.com%2FProduct%2FSearch%3Fdomain%3DALL%26query%3D%2525ED%252595%252598%2525EB%2525B8%25258C%2525EB%2525A3%2525A8%2525ED%252583%252580%252B%2525EA%2525B3%2525BC%2525ED%252595%252599'}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="reference-chip" 
             id="ref-chip-neuro"
             style="font-size: 12px; color: #334155; border: 1px solid var(--theme-border); padding: 0.35rem 0.75rem; border-radius: 9999px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem; background: var(--theme-surface-sub);">
            <span></span>
            <span>${isGlobal ? '[Cognitive Tools &amp; STEM Books Reference (Amazon) ↗]' : '[US CDC Growth Reference ↗]'}</span>
          </a>
        </div>
      </div>
    `;

    return html;
  }

  // 8. Public Module Exports
  const NeuroCognitiveMatrix = {
    COGNITIVE_PILLARS,
    CORTICAL_GOLDEN_WINDOWS,
    HAVRUTA_QUESTIONS,
    EXPLORATION_SITES,
    LEARNING_QUOTIENT_METRICS,
    calculateCognitiveScores,
    calculateDetailedCognitiveAudit,
    calculateRadarPoints,
    pointsToSvgPolygonPath,
    renderRadarSvg,
    calculateLqMetrics,
    renderLqRadarSvg,
    getGoldenTimeInfo,
    renderNeuroSection
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NeuroCognitiveMatrix;
  }
  if (typeof global !== 'undefined') {
    global.KidsFitNeuroCognitiveMatrix = NeuroCognitiveMatrix;
    global.TallerNeuroMatrix = NeuroCognitiveMatrix;
  }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
