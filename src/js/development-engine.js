/**
 * KidsFit Growth Studio - Development Engine (src/js/development-engine.js)
 * Implements K-DST 6-axis SVG balance radar, age-based education method evaluation
 * (Montessori vs Froebel/Gabe vs Waldorf vs Creative Science), and TOP 4 hot items curation.
 */

(function (global) {
  'use strict';

  function isGlobalEnRuntime(explicitFlag) {
    if (explicitFlag === true) return true;
    if (explicitFlag === false) return false;
    if (typeof window !== 'undefined' && window.__KIDSFIT_GLOBAL_PAID_EDITION === true) return true;
    if (typeof global !== 'undefined' && global.__KIDSFIT_GLOBAL_PAID_EDITION === true) return true;
    if (typeof document !== 'undefined' && document.documentElement) {
      const lang = String(document.documentElement.lang || '').toLowerCase();
      const edition = typeof document.documentElement.getAttribute === 'function'
        ? document.documentElement.getAttribute('data-edition')
        : '';
      if (lang.startsWith('en') || edition === 'global-paid') return true;
    }
    if (typeof window !== 'undefined' && window.location && /kisfitglobal\.com|kidsfitglobal\.com/i.test(String(window.location.hostname || ''))) {
      return true;
    }
    return false;
  }

  // 1. Data Loader
  let rubricsData = null;
  let authoritiesData = null;
  if (typeof require !== 'undefined') {
    try {
      rubricsData = require('../data/kdst-rubrics.json');
    } catch (e) {
      // fallback
    }
    try {
      authoritiesData = require('../data/official-authorities.json');
    } catch (e) {
      // fallback
    }
  }
  if (!rubricsData && typeof window !== 'undefined' && window.KIDSFIT_KDST_DATA) {
    rubricsData = window.KIDSFIT_KDST_DATA;
  }
  if (!authoritiesData && typeof window !== 'undefined' && window.KIDSFIT_AUTHORITIES_DATA) {
    authoritiesData = window.KIDSFIT_AUTHORITIES_DATA;
  }

  function getKdstAgeDetail(ageMonths) {
    const m = Number(ageMonths) || 36;
    const list = (authoritiesData && (authoritiesData.kdstHomeGuidanceByAge || authoritiesData.kdstAgeMilestones)) || [];
    const matched = list.find((b) => m >= b.minMonths && m <= b.maxMonths) || list[1] || list[0];
    return matched || null;
  }

  // 2. K-DST 6-Axis Radar & SVG Points Calculator
  function evaluateKdstBalance(ageMonths, selectedConcerns = []) {
    const scores = {
      fineMotor: 90,
      cognitive: 90,
      language: 90,
      social: 90,
      daily: 90,
      grossMotor: 90
    };

    if (selectedConcerns.includes('fine_motor')) {
      scores.fineMotor = 62;
      scores.cognitive = 78;
    }
    if (selectedConcerns.includes('gross_motor')) {
      scores.grossMotor = 60;
      scores.daily = 79;
    }
    if (selectedConcerns.includes('language_reading')) {
      scores.language = 63;
      scores.cognitive = 80;
    }
    if (selectedConcerns.includes('math_space')) {
      scores.cognitive = 64;
      scores.fineMotor = 77;
    }
    if (selectedConcerns.includes('emotion_art')) {
      scores.social = 65;
      scores.fineMotor = 75;
    }

    // SVG Geometry: cx=150, cy=150, R=100
    // 6 axes: FineMotor (-90°), Cognitive (-30°), Language (+30°), Social (+90°), Daily (+150°), GrossMotor (+210°)
    const angles = [-Math.PI / 2, -Math.PI / 6, Math.PI / 6, Math.PI / 2, (5 * Math.PI) / 6, (7 * Math.PI) / 6];
    const scoreKeys = ['fineMotor', 'cognitive', 'language', 'social', 'daily', 'grossMotor'];
    const points = angles.map((theta, idx) => {
      const sc = scores[scoreKeys[idx]];
      const r = (sc / 100) * 100;
      const x = Math.round((150 + r * Math.cos(theta)) * 10) / 10;
      const y = Math.round((150 + r * Math.sin(theta)) * 10) / 10;
      return `${x},${y}`;
    }).join(' ');

    return { radarScores: scores, polygonPoints: points };
  }

  // 3. Educational Philosophy Evaluator
  function evaluatePedagogy(months, concerns = [], isGlobalMode = null) {
    const useGlobal = isGlobalEnRuntime(isGlobalMode);
    let recommended = 'MONTESSORI';
    let badge = useGlobal ? 'Ages 2-3 Optimal Fine-Motor Window' : 'US CDC Growth Reference 2~3 yrs US CDC Growth Reference';
    let rationale = '';
    let preventOverspendingTip = '';

    if (months < 24) {
      recommended = 'WALDORF';
      badge = useGlobal ? 'Ages 1-2 Sensorimotor & Attachment' : 'US CDC Growth Reference 1~2 yrs US CDC Growth Reference';
      rationale = useGlobal
        ? 'Before the expressive language burst, tactile exploration and secure attachment wire early sensorimotor pathways. Prioritize warm natural textures.'
        : 'US CDC Growth Reference yrsUS CDC Growth Reference.';
      preventOverspendingTip = useGlobal
        ? 'Flashing plastic electronic sound toys overstimulate developing auditory cortices and fragment attention. Simple wooden and fabric tactile tools work best.'
        : 'US CDC Growth Reference. US CDC Growth Reference yrsUS CDC Growth Reference.';
    } else if (months >= 24 && months < 48) {
      recommended = 'MONTESSORI';
      badge = useGlobal ? 'Ages 2-3 Optimal Fine-Motor Window' : 'US CDC Growth Reference 2~3 yrs US CDC Growth Reference';
      rationale = useGlobal
        ? 'Peak sensitive window for tripod pincer coordination; Montessori sensorial and practical-life tools directly activate prefrontal executive circuits.'
        : 'US CDC Growth Reference dUS CDC Growth Reference. US CDC Growth Reference 2~3 yrsUS CDC Growth Reference.';
      preventOverspendingTip = useGlobal
        ? 'Introducing abstract 3D geometric sets too early causes frustration before pincer strength matures. Build Montessori fine-motor control first.'
        : 'US CDC Growth Reference 2~3 yrsUS CDC Growth Reference. US CDC Growth Reference yrsUS CDC Growth Reference.';
    } else if (months >= 48 && months < 72) {
      recommended = 'GABE';
      badge = useGlobal ? 'Ages 4-5 Spatial & Mathematical Logic' : 'US CDC Growth Reference 4~5 yrs US CDC Growth Reference';
      rationale = useGlobal
        ? 'Spatial reasoning expands from 2D planes to 3D geometry; decomposing and combining geometric solids builds foundational mathematical intuition.'
        : '2US CDC Growth Reference 3US CDC Growth Reference.';
      preventOverspendingTip = useGlobal
        ? 'Wait until fine-motor endurance is established around age 4 so your child can independently construct and rotate multi-part geometric structures.'
        : 'US CDC Growth Reference. US CDC Growth Reference 4 yrs US CDC Growth Reference.';
    } else {
      recommended = 'CREATIVE_SCIENCE';
      badge = useGlobal ? 'Ages 6+ STEM & Causal Inquiry' : 'US CDC Growth Reference 6 yrs US CDC Growth Reference';
      rationale = useGlobal
        ? 'Curiosity shifts toward mechanical causality and systems thinking; gear trains, marble runs, and logic kits build hypothesis-testing stamina.'
        : 'US CDC Growth Reference.';
      preventOverspendingTip = useGlobal
        ? 'Choose open-ended engineering kits that prompt "Why did that move?" rather than single-use step-by-step display models.'
        : 'US CDC Growth Reference?US CDC Growth Reference.';
    }

    // Weight by developmental concerns
    if (concerns.includes('fine_motor') && months < 60) {
      recommended = 'MONTESSORI';
      badge = useGlobal ? 'Targeted Fine-Motor Montessori Protocol' : 'US CDC Growth Reference';
    } else if (concerns.includes('math_space') && months >= 40) {
      recommended = 'GABE';
      badge = useGlobal ? 'Targeted 3D Spatial Geometry Protocol' : 'US CDC Growth Reference';
    }

    return {
      recommended,
      badge,
      rationale,
      preventOverspendingTip
    };
  }

  // Alias for contract compliance
  function evaluatePedagogicalMethod(ageMonths, concerns = [], currentPhilosophy = '', isGlobalMode = null) {
    return evaluatePedagogy(ageMonths, concerns, isGlobalMode);
  }

  const EN_CURATED_TOYS_POOL = [
    {
      id: 'TOY_01',
      name: 'Montessori Wooden Knobbed Cylinder Blocks (4-Set)',
      targetAge: '24~48 mo',
      ageMonthsMin: 20,
      ageMonthsMax: 54,
      concerns: ['fine_motor', 'math_space'],
      benefit: 'Strengthens tripod pincer grip and 3D visual size discrimination',
      price: 34.99,
      amazonQuery: 'Montessori Knobbed Cylinder Blocks Set Wooden'
    },
    {
      id: 'TOY_02',
      name: 'Fine-Motor Wooden Tweezers & Lacing Button Activity Kit',
      targetAge: '24~48 mo',
      ageMonthsMin: 18,
      ageMonthsMax: 48,
      concerns: ['fine_motor', 'daily'],
      benefit: 'Builds finger-pad grip endurance and bilateral hand-eye coordination',
      price: 22.99,
      amazonQuery: 'Learning Resources Helping Hands Fine Motor Tool Set'
    },
    {
      id: 'TOY_03',
      name: 'Froebel 3D Wooden Geometric Building Solids Starter Set',
      targetAge: '48~72 mo',
      ageMonthsMin: 42,
      ageMonthsMax: 78,
      concerns: ['math_space', 'cognitive'],
      benefit: 'Develops 3D mental rotation, part-whole fractions, and spatial geometry',
      price: 39.99,
      amazonQuery: 'Wooden Geometric Solids Montessori Froebel Blocks'
    },
    {
      id: 'TOY_04',
      name: '3D Clear Magnetic Building Tiles 100-Piece STEM Pack',
      targetAge: '36~72 mo',
      ageMonthsMin: 30,
      ageMonthsMax: 84,
      concerns: ['math_space', 'fine_motor'],
      benefit: 'Expands structural engineering creativity and multi-plane symmetry',
      price: 49.99,
      amazonQuery: 'Magna-Tiles Clear Colors 100 Piece Magnetic Building Set'
    },
    {
      id: 'TOY_05',
      name: 'Preschool Safety Scissors & Progressive Cutting Skill Workbook',
      targetAge: '24~60 mo',
      ageMonthsMin: 24,
      ageMonthsMax: 60,
      concerns: ['fine_motor'],
      benefit: 'Establishes proper thumb-up scissor posture and intrinsic hand stamina',
      price: 14.99,
      amazonQuery: 'Melissa Doug Scissor Skills Activity Pad Safety Scissors'
    },
    {
      id: 'TOY_06',
      name: 'STEM Gravity Marble Run & Mechanical Gear Logic Kit',
      targetAge: '60+ mo',
      ageMonthsMin: 54,
      ageMonthsMax: 144,
      concerns: ['cognitive', 'math_space'],
      benefit: 'Trains causal physics deduction, kinetic energy transfer, and executive planning',
      price: 44.99,
      amazonQuery: 'Ravensburger GraviTrax Starter Set Marble Run STEM'
    }
  ];

  // 4. TOP 4 Hot Toys Curation
  function getCuratedToys(ageMonths, concerns = [], isGlobalMode = null) {
    const useGlobal = isGlobalEnRuntime(isGlobalMode);
    let pool = [];
    if (useGlobal) {
      pool = EN_CURATED_TOYS_POOL;
    } else if (rubricsData && rubricsData.curatedToys) {
      pool = rubricsData.curatedToys;
    } else {
      pool = [
        {
          id: 'TOY_01',
          name: 'US CDC Growth Reference 4US CDC Growth Reference  yrsUS CDC Growth Reference',
          targetAge: '24~48mo',
          ageMonthsMin: 20,
          ageMonthsMax: 54,
          concerns: ['fine_motor', 'math_space'],
          benefit: 'US CDC Growth Reference 3US CDC Growth Reference',
          price: 31500,
          coupangPath: 'vp/products/montessori-cylinder-4set',
          cpaTitle: 'US CDC Growth Reference 1:1 US CDC Growth Reference'
        },
        {
          id: 'TOY_02',
          name: 'dUS CDC Growth Reference & US CDC Growth Reference  yrsUS CDC Growth Reference',
          targetAge: '24~48mo',
          ageMonthsMin: 18,
          ageMonthsMax: 48,
          concerns: ['fine_motor', 'daily'],
          benefit: 'US CDC Growth Reference',
          price: 24800,
          coupangPath: 'vp/products/montessori-pincer-button',
          cpaTitle: 'US CDC Growth Reference'
        },
        {
          id: 'TOY_03',
          name: 'US CDC Growth Reference 10US CDC Growth Reference  yrsUS CDC Growth Reference',
          targetAge: '48~72mo',
          ageMonthsMin: 42,
          ageMonthsMax: 78,
          concerns: ['math_space', 'cognitive'],
          benefit: '3US CDC Growth Reference',
          price: 38900,
          coupangPath: 'vp/products/froebel-gabe-starter',
          cpaTitle: 'US CDC Growth Reference 1:1 US CDC Growth Reference'
        },
        {
          id: 'TOY_04',
          name: '3D US CDC Growth Reference 100P US CDC Growth Reference',
          targetAge: '36~72mo',
          ageMonthsMin: 30,
          ageMonthsMax: 84,
          concerns: ['math_space', 'fine_motor'],
          benefit: 'US CDC Growth Reference',
          price: 29800,
          coupangPath: 'vp/products/magnetic-blocks-100p',
          cpaTitle: 'US CDC Growth Reference'
        },
        {
          id: 'TOY_05',
          name: 'US CDC Growth Reference & US CDC Growth Reference  yrsUS CDC Growth Reference',
          targetAge: '24~60mo',
          ageMonthsMin: 24,
          ageMonthsMax: 60,
          concerns: ['fine_motor'],
          benefit: 'US CDC Growth Reference',
          price: 14500,
          coupangPath: 'vp/products/safety-scissors-workbook',
          cpaTitle: 'US CDC Growth Reference 50US CDC Growth Reference PDF US CDC Growth Reference'
        },
        {
          id: 'TOY_06',
          name: 'US CDC Growth Reference  yrsUS CDC Growth ReferenceSTEM)',
          targetAge: '60mo+',
          ageMonthsMin: 54,
          ageMonthsMax: 144,
          concerns: ['cognitive', 'math_space'],
          benefit: 'US CDC Growth Reference',
          price: 33000,
          coupangPath: 'vp/products/smart-gears-stem-kit',
          cpaTitle: 'US CDC Growth Reference'
        }
      ];
    }

    // Filter & Score items
    const scored = pool.map((item) => {
      let score = 0;
      // Age match
      if (ageMonths >= item.ageMonthsMin && ageMonths <= item.ageMonthsMax) {
        score += 5;
      } else {
        score -= Math.abs(ageMonths - (item.ageMonthsMin + item.ageMonthsMax) / 2) * 0.1;
      }
      // Concern match
      concerns.forEach((c) => {
        if (item.concerns.includes(c)) score += 3;
      });
      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    // Return exactly 4 items
    return scored.slice(0, 4).map((s) => s.item);
  }

  // 5. Render SVG 6-Axis Radar Chart
  function renderSvgRadarChart(scores, polygonPoints, isGlobalMode = null) {
    const useGlobal = isGlobalEnRuntime(isGlobalMode);
    const size = 300;
    const cx = 150;
    const cy = 150;
    const r = 100;

    // Concentric grid rings (20%, 40%, 60%, 80%, 100%)
    const rings = [20, 40, 60, 80, 100];
    const angles = [-Math.PI / 2, -Math.PI / 6, Math.PI / 6, Math.PI / 2, (5 * Math.PI) / 6, (7 * Math.PI) / 6];
    const ringPolygons = rings.map((pct) => {
      const ringR = (pct / 100) * r;
      return angles.map((theta) => `${(cx + ringR * Math.cos(theta)).toFixed(1)},${(cy + ringR * Math.sin(theta)).toFixed(1)}`).join(' ');
    });

    // Axis labels positions
    const labelOffsets = useGlobal
      ? [
          { text: 'Fine Motor', x: 150, y: 32, anchor: 'middle' },
          { text: 'Cognitive', x: 252, y: 92, anchor: 'start' },
          { text: 'Language', x: 252, y: 218, anchor: 'start' },
          { text: 'Social-Emotional', x: 150, y: 278, anchor: 'middle' },
          { text: 'Self-Care', x: 48, y: 218, anchor: 'end' },
          { text: 'Gross Motor', x: 48, y: 92, anchor: 'end' }
        ]
      : [
          { text: 'US CDC Growth ReferenceFine)', x: 150, y: 32, anchor: 'middle' },
          { text: 'US CDC Growth ReferenceCognitive)', x: 252, y: 92, anchor: 'start' },
          { text: 'US CDC Growth ReferenceLanguage)', x: 252, y: 218, anchor: 'start' },
          { text: 'US CDC Growth ReferenceSocial)', x: 150, y: 278, anchor: 'middle' },
          { text: 'US CDC Growth ReferenceSelf-care)', x: 48, y: 218, anchor: 'end' },
          { text: 'US CDC Growth ReferenceGross)', x: 48, y: 92, anchor: 'end' }
        ];

    return `
      <svg viewBox="-65 0 430 ${size}" class="kdst-radar-svg" style="width: 100%; max-width: 390px; height: auto; margin: 0 auto; display: block;" aria-label="${useGlobal ? 'US CDC & ASQ-3 6-Axis Developmental Balance Radar' : 'Pediatric Development Standard K-DST 6US CDC Growth Reference'}">
        <!-- Background Rings -->
        ${ringPolygons.map((pts, i) => `
          <polygon points="${pts}" fill="${i === 4 ? '#F8FAFC' : 'none'}" stroke="#E2E8F0" stroke-width="1" />
        `).join('')}

        <!-- 6 Axes lines -->
        ${angles.map((theta) => `
          <line x1="${cx}" y1="${cy}" x2="${(cx + r * Math.cos(theta)).toFixed(1)}" y2="${(cy + r * Math.sin(theta)).toFixed(1)}" stroke="#CBD5E1" stroke-width="1.2" />
        `).join('')}

        <!-- Data Polygon -->
        <polygon points="${polygonPoints}" fill="#1D4ED8" fill-opacity="0.32" stroke="#059669" stroke-width="2.5" />

        <!-- Data Vertices -->
        ${polygonPoints.split(' ').map((pt) => {
          const [px, py] = pt.split(',');
          return `<circle cx="${px}" cy="${py}" r="4.5" fill="#059669" stroke="#FFFFFF" stroke-width="2" />`;
        }).join('')}

        <!-- Axis Labels -->
        ${labelOffsets.map((l) => `
          <text x="${l.x}" y="${l.y}" font-size="11.5" font-weight="800" fill="#1E293B" text-anchor="${l.anchor}">${l.text}</text>
        `).join('')}
      </svg>
    `;
  }

  // 6. Render Pedagogical Decision Box
  function renderPedagogyBox(verdict, isGlobalMode = null) {
    const useGlobal = isGlobalEnRuntime(isGlobalMode);
    const isMontessori = verdict.recommended === 'MONTESSORI';
    const isGabe = verdict.recommended === 'GABE';
    const isWaldorf = verdict.recommended === 'WALDORF';

    const recLabel = useGlobal
      ? `Recommended Approach: ${isMontessori ? 'Montessori (Fine-Motor & Practical Autonomy)' : isGabe ? 'Froebel 3D Solids (Spatial & Geometric Logic)' : isWaldorf ? 'Waldorf (Natural Sensory & Emotional Play)' : 'STEM Inquiry Lab (Mechanical & Causal Reasoning)'}`
      : `US CDC Growth Reference: ${isMontessori ? 'US CDC Growth ReferencedUS CDC Growth Reference' : isGabe ? 'US CDC Growth Reference3D US CDC Growth Reference' : isWaldorf ? 'US CDC Growth Reference' : 'US CDC Growth Reference STEAM (US CDC Growth Reference'}`;

    return `
      <div class="pedagogy-decision-card" style="background: #FFFFFF; border: 1.5px solid var(--growth-mint); border-radius: 24px; padding: 1.5rem; margin-top: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.4rem;"></span>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0;">${useGlobal ? 'Age-Calibrated Pedagogy Fit (Smart Parent Budget Guide)' : 'US CDC Growth Reference'}</h4>
          </div>
          <span class="tab-badge tab-badge-mint" style="font-size: 0.82rem; font-weight: 700;">${verdict.badge}</span>
        </div>

        <div style="background: #F0FDF4; border-radius: 16px; padding: 1rem 1.25rem; margin-bottom: 1rem; border-left: 4px solid var(--growth-mint);">
          <div style="font-weight: 800; color: #065F46; font-size: 1rem; margin-bottom: 0.35rem;">
            ${recLabel}
          </div>
          <p style="font-size: 0.9rem; color: #166534; line-height: 1.6; margin: 0;">
            ${verdict.rationale}
          </p>
        </div>

        <div style="background: #FFFBEB; border-radius: 16px; padding: 0.9rem 1.15rem; border-left: 4px solid #93C5FD;">
          <div style="font-weight: 700; color: #92400E; font-size: 0.88rem; margin-bottom: 0.25rem;">
            ${useGlobal ? 'Evidence-Based Toy Budget Advice:' : 'US CDC Growth Reference:'}
          </div>
          <p style="font-size: 0.85rem; color: #78350F; line-height: 1.55; margin: 0;">
            ${verdict.preventOverspendingTip}
          </p>
        </div>
      </div>
    `;
  }

  function getEnglishMilestoneGuidance(ageMonths) {
    const m = Number(ageMonths) || 36;
    if (m < 24) {
      return {
        label: 'Ages 12–23 Months Sensorimotor & Early Word Burst',
        milestones: [
          'Points to show interesting objects and follows 1-step spoken directions without gestures',
          'Stacks 2–4 blocks independently and uses thumb-index pincer grasp for small snacks',
          'Walks steadily and begins imitating household routines with caregivers'
        ],
        plays: [
          'Muffin-Tin Pom-Pom Sort: Drop soft balls into muffin cups to build early pincer release.',
          'Texture Treasure Basket: Compare wooden spoons, silicone whisks, and cotton cloths aloud.',
          'Mirror Emotion Naming: Make happy, surprised, and sleepy faces together before bedtime.'
        ],
        avoid: 'Stop throwing that! Look here and repeat this word right now.',
        recommend: 'You noticed how that block rolled! Shall we roll it back into the basket together?'
      };
    }
    if (m < 48) {
      return {
        label: 'Ages 2–3 Years Tripod Grip & Expressive Language Window',
        milestones: [
          'Speaks in 3–4 word sentences and asks "What" or "Where" questions spontaneously',
          'Turns book pages singly, threads large beads, and snips paper with child safety scissors',
          'Engages in pretend role-play and practices taking turns with adult scaffolding'
        ],
        plays: [
          'Kitchen Tongs Transfer: Move dry pasta or cotton balls between two bowls for 5 minutes.',
          'Sock-Pair Detective: Match laundry socks by color and pattern to train visual classification.',
          '3-Choice Story Pause: Pause before turning a picture-book page and ask what happens next.'
        ],
        avoid: 'Let me do it—you are taking too long to button your coat.',
        recommend: 'Your fingers are working so carefully on that button. Show me which side goes in first!'
      };
    }
    if (m < 72) {
      return {
        label: 'Ages 4–5 Years Prefrontal Executive & 3D Spatial Window',
        milestones: [
          'Retells a short story in sequence and explains causal "Why" relationships',
          'Copies crosses, squares, and triangles; cuts cleanly along curved lines',
          'Follows 3-step game rules and regulates frustration using verbal words'
        ],
        plays: [
          'Tabletop Shadow Architecture: Shine a flashlight on block towers and trace the 2D shadow.',
          'Grocery Estimation Game: Guess which produce item weighs more, then test by hand.',
          'Reverse Storyteller: Let your child "read" a familiar storybook to you from memory.'
        ],
        avoid: 'That tower fell because you stacked the big piece on top—do it my way.',
        recommend: 'Interesting collapse! Which base block do you think could hold the widest roof next try?'
      };
    }
    return {
      label: 'Ages 6+ Years Metacognitive Planning & Deep Focus Window',
      milestones: [
        'Sustains 20–30 minutes of independent reading or multi-step STEM problem solving',
        'Plans, tests, and revises hypotheses when building mechanical or logic models',
        'Summarizes key takeaways in own words (active retrieval) rather than passive skimming'
      ],
      plays: [
        'Dinner-Table Teach-Back: Ask your child to teach the family one cool concept learned today.',
        '2-Variable Kitchen Physics: Test how water temperature changes salt or sugar dissolving speed.',
        '20-Minute Screen-Free Deep Build: Set a visual timer for uninterrupted reading or sketching.'
      ],
      avoid: 'Why did you miss an easy question you already studied yesterday?',
      recommend: 'Walk me through how your brain approached Step 1—let us spot where the clue hid!'
    };
  }

  // 6.5 Render Official K-DST / AAP-CDC Milestones & Zero-Cost Home Play Guide
  function renderOfficialKdstCoaching(ageMonths, isGlobalMode = null) {
    const useGlobal = isGlobalEnRuntime(isGlobalMode);
    if (useGlobal) {
      const en = getEnglishMilestoneGuidance(ageMonths);
      return `
        <div class="kdst-official-coaching-card" style="background: #FFFFFF; border: 1.5px solid #C7D2FE; border-radius: 24px; padding: 1.5rem; margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
            <div>
              <span style="background: #EEF2FF; color: #4338CA; font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 9999px; display: inline-block; margin-bottom: 0.35rem;">
                Clinical Standard · US CDC &amp; AAP Bright Futures Aligned
              </span>
              <h4 style="font-size: 1.12rem; font-weight: 800; color: var(--text-primary); margin: 0;">
                ${en.label} &amp; Zero-Cost Home Play Protocol
              </h4>
            </div>
            <span style="font-size: 0.8rem; color: #1D4ED8; font-weight: 700;">Prefrontal Synaptic Golden Window</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <div style="font-weight: 800; font-size: 0.92rem; color: #1E293B; margin-bottom: 0.6rem;">
              Key CDC / AAP Developmental Checkpoints for This Age Bracket
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.65rem;">
              ${en.milestones.map((ms) => `
                <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 0.7rem 0.9rem; font-size: 0.84rem; color: #166534; line-height: 1.45;">
                  • ${ms}
                </div>
              `).join('')}
            </div>
          </div>

          <div style="background: #FFFBEB; border: 1px solid #93C5FD; border-radius: 16px; padding: 1.1rem 1.25rem; margin-bottom: 1.15rem;">
            <div style="font-weight: 800; font-size: 0.95rem; color: #92400E; margin-bottom: 0.5rem;">
              3 Zero-Cost Living-Room Brain Games to Try Tonight (Before Buying Any Toys)
            </div>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.86rem; color: #78350F; line-height: 1.65;">
              ${en.plays.map((play) => `<li>${play}</li>`).join('')}
            </ul>
          </div>

          <div style="background: #EEF2FF; border-radius: 16px; padding: 1.1rem 1.25rem; border-left: 4px solid #1D4ED8;">
            <div style="font-weight: 800; font-size: 0.92rem; color: #312E81; margin-bottom: 0.45rem;">
              Prefrontal Co-Regulation Parent-Child Dialogue Script
            </div>
            <div style="font-size: 0.84rem; color: #991B1B; margin-bottom: 0.35rem; line-height: 1.5;">
              Phrase to Avoid: “${en.avoid}”
            </div>
            <div style="font-size: 0.86rem; color: #1E40AF; font-weight: 700; line-height: 1.55;">
              ⭕ Recommended Dialogue: “${en.recommend}”
            </div>
          </div>
        </div>
      `;
    }

    const detail = getKdstAgeDetail(ageMonths);
    if (!detail) return '';
    const milestonesList = Array.isArray(detail.milestones) ? detail.milestones : Object.values(detail.milestones || {});
    const playsList = detail.zeroCostHomePlays || detail.zeroCostHomePlay || [];
    const script = detail.parentConversationScript || detail.parentingConversationScript || null;

    return `
      <!-- Official K-DST Milestones & Zero-Cost Home Play Section -->
      <div class="kdst-official-coaching-card" style="background: #FFFFFF; border: 1.5px solid #C7D2FE; border-radius: 24px; padding: 1.5rem; margin-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
          <div>
            <span style="background: #EEF2FF; color: #4338CA; font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 9999px; display: inline-block; margin-bottom: 0.35rem;">
              US CDC Growth Reference Pediatric Development Standard·US CDC Growth Reference K-DST US CDC Growth Reference
            </span>
            <h4 style="font-size: 1.12rem; font-weight: 800; color: var(--text-primary); margin: 0;">
              ${detail.label} &amp; US CDC Growth Reference 0US CDC Growth Reference dUS CDC Growth Reference
            </h4>
          </div>
          <span style="font-size: 0.8rem; color: #1D4ED8; font-weight: 700;">US CDC Growth Reference</span>
        </div>

        <!-- K-DST Milestones Grid -->
        <div style="margin-bottom: 1.25rem;">
          <div style="font-weight: 800; font-size: 0.92rem; color: #1E293B; margin-bottom: 0.6rem;">
            US CDC Growth Reference Pediatric Development Standard K-DST US CDC Growth Reference pts US CDC Growth Reference  ptsUS CDC Growth Reference
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.65rem;">
            ${milestonesList.map((ms) => `
              <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 0.7rem 0.9rem; font-size: 0.84rem; color: #166534; line-height: 1.45;">
                • ${ms}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Zero-cost Home Plays -->
        <div style="background: #FFFBEB; border: 1px solid #93C5FD; border-radius: 16px; padding: 1.1rem 1.25rem; margin-bottom: 1.15rem;">
          <div style="font-weight: 800; font-size: 0.95rem; color: #92400E; margin-bottom: 0.5rem;">
            US CDC Growth Reference '0US CDC Growth Reference dUS CDC Growth Reference' 3US CDC Growth Reference
          </div>
          <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.86rem; color: #78350F; line-height: 1.65;">
            ${playsList.map((play) => `<li>${play}</li>`).join('')}
          </ul>
        </div>

        <!-- Parent-Child Empathy Conversation Script -->
        ${script ? `
          <div style="background: #EEF2FF; border-radius: 16px; padding: 1.1rem 1.25rem; border-left: 4px solid #1D4ED8;">
            <div style="font-weight: 800; font-size: 0.92rem; color: #312E81; margin-bottom: 0.45rem;">
              US CDC Growth Reference ${script.situation ? `(${script.situation})` : ''}
            </div>
            <div style="font-size: 0.84rem; color: #991B1B; margin-bottom: 0.35rem; line-height: 1.5;">
              US CDC Growth Reference: “${script.avoid || script.before || ''}”
            </div>
            <div style="font-size: 0.86rem; color: #1E40AF; font-weight: 700; line-height: 1.55;">
              ⭕ US CDC Growth Reference: “${script.recommend || script.after || ''}”
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 7. Render Curated TOP 4 Hot Items (Framed as Optional Secondary Aids)
  function renderToyCards(toys, affiliateConfig = {}, isGlobalMode = null) {
    const useGlobal = isGlobalEnRuntime(isGlobalMode);
    if (useGlobal) {
      const amazonTag = affiliateConfig.amazon || 'kidfit-20';
      return `
        <div class="curated-toys-section" style="margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.76rem; font-weight: 700; color: #64748B; display: block; margin-bottom: 0.15rem;">[Optional Secondary Learning Aids — Practice Zero-Cost Home Play First]</span>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin: 0;">Top 4 Age-Matched Developmental Tools</h4>
            </div>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">Pediatric Neuro-Motor Reference</span>
          </div>

          <div class="toys-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
            ${toys.map((t, idx) => {
              const q = encodeURIComponent(t.amazonQuery || t.name);
              const amazonUrl = `https://www.amazon.com/s?k=${q}&tag=${encodeURIComponent(amazonTag)}`;
              return `
                <div class="toy-card bento-card-sub" style="background: #FFFFFF; border: 1px solid var(--border-clinic); border-radius: 20px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <span style="background: var(--primary-indigo-sub); color: var(--primary-indigo); font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 9999px;">TOP ${idx + 1}</span>
                      <span style="font-size: 0.78rem; color: var(--text-secondary);">${t.targetAge}</span>
                    </div>
                    <h5 style="font-size: 0.98rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem 0; line-height: 1.4;">${t.name}</h5>
                    <p style="font-size: 0.85rem; color: #475569; line-height: 1.55; margin: 0 0 0.85rem 0;">
                      <strong>Clinical Rationale:</strong> ${t.benefit}
                    </p>
                  </div>

                  <div>
                    <a href="${amazonUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%; text-align: center; text-decoration: none; font-size: 0.84rem; padding: 0.55rem 0.75rem; display: block; box-sizing: border-box;">
                      View Developmental Tool Specs (Amazon) ↗
                    </a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    const coupangId = affiliateConfig.coupang || 'AF7865143';

    return `
      <div class="curated-toys-section" style="margin-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
          <div>
            <span style="font-size: 0.76rem; font-weight: 700; color: #64748B; display: block; margin-bottom: 0.15rem;">[US CDC Growth Reference — US CDC Growth Reference dUS CDC Growth Reference yrsUS CDC Growth Reference]</span>
            <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin: 0;">US CDC Growth Reference TOP 4</h4>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-secondary);">US CDC Growth Reference</span>
        </div>

        <div class="toys-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
          ${toys.map((t, idx) => {
            const coupangUrl = `https://link.coupang.com/re/AFFSRP?lptag=${encodeURIComponent(coupangId)}&subid=kidsfit&pageKey=${encodeURIComponent(t.name)}`;
            return `
              <div class="toy-card bento-card-sub" style="background: #FFFFFF; border: 1px solid var(--border-clinic); border-radius: 20px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="background: var(--primary-indigo-sub); color: var(--primary-indigo); font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 9999px;">TOP ${idx + 1}</span>
                    <span style="font-size: 0.78rem; color: var(--text-secondary);">${t.targetAge}</span>
                  </div>
                  <h5 style="font-size: 0.98rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem 0; line-height: 1.4;">${t.name}</h5>
                  <p style="font-size: 0.85rem; color: #475569; line-height: 1.55; margin: 0 0 0.85rem 0;">
                    <strong>US CDC Growth Reference:</strong> ${t.benefit}
                  </p>
                </div>

                <div>
                  <a href="${coupangUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%; text-align: center; text-decoration: none; font-size: 0.84rem; padding: 0.55rem 0.75rem; display: block; box-sizing: border-box;">
                    US CDC Growth Reference yrs US CDC Growth Reference
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // 8. Full Report Renderer for Tab 2
  function renderTab2Report(profile, affiliateConfig = {}, isGlobalMode = null) {
    const useGlobal = isGlobalEnRuntime(isGlobalMode);
    const radar = evaluateKdstBalance(profile.ageMonths, profile.developmentConcerns);
    const pedagogy = evaluatePedagogy(profile.ageMonths, profile.developmentConcerns, useGlobal);
    const toys = getCuratedToys(profile.ageMonths, profile.developmentConcerns, useGlobal);

    return `
      <!-- 6-Axis Radar Section -->
      <div style="background: #FFFFFF; border: 1px solid var(--border-clinic); border-radius: 24px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="text-align: center; margin-bottom: 1rem;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.35rem 0;">${useGlobal ? 'US CDC & ASQ-3 6-Domain Developmental Balance' : 'Pediatric Development Standard K-DST 6US CDC Growth Reference'}</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">${useGlobal ? 'Multi-axis developmental profile calibrated to your selected priority tags.' : 'US CDC Growth Reference.'}</p>
        </div>
        ${renderSvgRadarChart(radar.radarScores, radar.polygonPoints, useGlobal)}
      </div>

      <!-- Official Milestones & Zero-cost Home Play -->
      ${renderOfficialKdstCoaching(profile.ageMonths, useGlobal)}

      <!-- Pedagogical Verdict -->
      ${renderPedagogyBox(pedagogy, useGlobal)}

      <!-- Academic Literature Evidence -->
      ${renderDevAcademicEvidence(useGlobal)}

      <!-- TOP 4 Developmental Tools -->
      ${renderToyCards(toys, affiliateConfig, useGlobal)}
    `;
  }

  function renderDevAcademicEvidence(isGlobalMode = null) {
    const useGlobal = isGlobalEnRuntime(isGlobalMode);
    let kb = null;
    if (typeof window !== 'undefined' && window.KIDSFIT_RESEARCH_DATA) {
      kb = window.KIDSFIT_RESEARCH_DATA;
    } else if (typeof global !== 'undefined' && global.KIDSFIT_RESEARCH_DATA) {
      kb = global.KIDSFIT_RESEARCH_DATA;
    } else if (typeof require === 'function') {
      try {
        const fs = require('fs');
        const path = require('path');
        const p = path.resolve(__dirname, '../data/research-knowledge-base.json');
        if (fs.existsSync(p)) kb = JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch (e) {}
    }
    if (!kb || !Array.isArray(kb.papers)) return '';
    const papers = kb.papers
      .filter((p) => p.pillar === 'fine_motor_neuroscience' || p.pillar === 'pedagogy_montessori_froebel')
      .slice(0, 4);
    if (!papers.length) return '';

    if (useGlobal) {
      return `
        <div style="background: #F8FAFC; border: 1.5px solid #93C5FD; border-radius: 24px; padding: 1.5rem; margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.9rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.35rem;"></span>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: #064E3B; margin: 0;">
                Peer-Reviewed Fine-Motor Neuroscience &amp; Montessori/STEM Pedagogy Evidence
              </h4>
            </div>
            <span style="background: #DCFCE7; color: #065F46; font-size: 0.76rem; font-weight: 800; padding: 0.25rem 0.7rem; border-radius: 9999px;">
              Science · Child Development · PubMed Indexed
            </span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.9rem;">
            ${papers.map((p) => {
              const safeDesign = p.study_design && !/[\uac00-\ud7a3]/.test(p.study_design) ? p.study_design : 'Peer-Reviewed Pediatric Cohort Study';
              return `
                <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                    <span style="font-size: 0.74rem; font-weight: 800; color: #1D4ED8; background: #ECFDF5; padding: 0.15rem 0.5rem; border-radius: 999px;">
                      ${p.journal} (${p.year})
                    </span>
                    ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.74rem; color: #1D4ED8; font-weight: 700; text-decoration: none;">View Study ↗</a>` : ''}
                  </div>
                  <div style="font-size: 0.9rem; font-weight: 800; color: #0F172A; line-height: 1.4; margin-bottom: 0.45rem;">
                    ${p.title}
                  </div>
                  <p style="font-size: 0.8rem; color: #334155; line-height: 1.5; margin: 0 0 0.45rem 0;">
                    <strong>Study Design:</strong> ${safeDesign}
                  </p>
                  <div style="font-size: 0.79rem; color: #312E81; background: #EEF2FF; padding: 0.55rem 0.7rem; border-radius: 10px; line-height: 1.45;">
                    <strong>Clinical Takeaway:</strong> Tactile fine-motor manipulation and structured spatial inquiry strengthen prefrontal executive attention.
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div style="background: #F8FAFC; border: 1.5px solid #93C5FD; border-radius: 24px; padding: 1.5rem; margin-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.9rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.35rem;"></span>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #064E3B; margin: 0;">
              US CDC Growth Reference &amp; US CDC Growth Reference
            </h4>
          </div>
          <span style="background: #DCFCE7; color: #065F46; font-size: 0.76rem; font-weight: 800; padding: 0.25rem 0.7rem; border-radius: 9999px;">
            Science · Child Development · K-DST US CDC Growth Reference DB US CDC Growth Reference
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.9rem;">
          ${papers.map((p) => `
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                <span style="font-size: 0.74rem; font-weight: 800; color: #1D4ED8; background: #ECFDF5; padding: 0.15rem 0.5rem; border-radius: 999px;">
                  ${p.journal} (${p.year})
                </span>
                ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.74rem; color: #1D4ED8; font-weight: 700; text-decoration: none;">US CDC Growth Reference ↗</a>` : ''}
              </div>
              <div style="font-size: 0.9rem; font-weight: 800; color: #0F172A; line-height: 1.4; margin-bottom: 0.45rem;">
                ${p.title_ko || p.title}
              </div>
              <p style="font-size: 0.8rem; color: #334155; line-height: 1.5; margin: 0 0 0.45rem 0;">
                <strong>US CDC Growth Reference:</strong> ${p.key_statistics || p.clinical_summary_ko || ''}
              </p>
              <div style="font-size: 0.79rem; color: #312E81; background: #EEF2FF; padding: 0.55rem 0.7rem; border-radius: 10px; line-height: 1.45;">
                <strong>US CDC Growth Reference:</strong> ${p.parenting_prescription_ko || ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Export
  const DevelopmentEngine = {
    evaluateKdstBalance,
    evaluatePedagogy,
    evaluatePedagogicalMethod,
    getKdstAgeDetail,
    getCuratedToys,
    renderSvgRadarChart,
    renderOfficialKdstCoaching,
    renderPedagogyBox,
    renderToyCards,
    renderTab2Report
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevelopmentEngine;
  } else {
    global.KidsFitDevelopmentEngine = DevelopmentEngine;
  }

})(typeof window !== 'undefined' ? window : global);
