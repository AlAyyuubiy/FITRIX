/* ============================================================
   FITRIX — bmi.js
   Full BMI calculator logic for contact.html

   FORMULAS:
   Metric:   BMI = weight_kg / (height_m²)
   Imperial: BMI = (weight_lbs / height_in²) × 703

   CATEGORIES:
   < 18.5          — Underweight
   18.5 – 24.9     — Normal weight
   25.0 – 29.9     — Overweight
   ≥ 30            — Obese
   ============================================================ */


/* ---- Element references ---- */

const metricBtn     = document.getElementById('metricBtn');
const imperialBtn   = document.getElementById('imperialBtn');
const metricInputs  = document.getElementById('metricInputs');
const imperialInputs = document.getElementById('imperialInputs');
const calcBtn       = document.getElementById('calcBmi');
const bmiResult     = document.getElementById('bmiResult');
const bmiScore      = document.getElementById('bmiScore');
const bmiCategory   = document.getElementById('bmiCategory');
const bmiNeedle     = document.getElementById('bmiNeedle');
const bmiNote       = document.getElementById('bmiNote');

/* Only run if we're on the contact page */
if (metricBtn && imperialBtn && calcBtn) {

  let currentUnit = 'metric';


  /* ---- UNIT TOGGLE ---- */

  metricBtn.addEventListener('click', () => {
    currentUnit = 'metric';
    metricBtn.classList.add('active');
    imperialBtn.classList.remove('active');
    metricBtn.setAttribute('aria-pressed', 'true');
    imperialBtn.setAttribute('aria-pressed', 'false');
    metricInputs.hidden = false;
    imperialInputs.hidden = true;
    resetResult();
  });

  imperialBtn.addEventListener('click', () => {
    currentUnit = 'imperial';
    imperialBtn.classList.add('active');
    metricBtn.classList.remove('active');
    imperialBtn.setAttribute('aria-pressed', 'true');
    metricBtn.setAttribute('aria-pressed', 'false');
    imperialInputs.hidden = false;
    metricInputs.hidden = true;
    resetResult();
  });


  /* ---- CALCULATE ---- */

  calcBtn.addEventListener('click', () => {
    let bmi = null;

    if (currentUnit === 'metric') {
      const kg = parseFloat(document.getElementById('weightKg').value);
      const cm = parseFloat(document.getElementById('heightCm').value);

      if (!kg || !cm || kg <= 0 || cm <= 0) {
        showError('Please enter valid weight and height.');
        return;
      }

      const m = cm / 100;
      bmi = kg / (m * m);

    } else {
      const lbs = parseFloat(document.getElementById('weightLbs').value);
      const inches = parseFloat(document.getElementById('heightIn').value);

      if (!lbs || !inches || lbs <= 0 || inches <= 0) {
        showError('Please enter valid weight and height.');
        return;
      }

      bmi = (lbs / (inches * inches)) * 703;
    }

    displayResult(bmi);
  });


  /* ---- DISPLAY RESULT ---- */

  function displayResult(bmi) {
    const rounded = Math.round(bmi * 10) / 10;

    bmiScore.textContent = rounded;
    bmiResult.hidden = false;
    bmiNote.textContent = '';

    /* Determine category, color, needle position, and note */
    let category, noteText, needlePercent;

    if (bmi < 18.5) {
      category      = 'Underweight';
      needlePercent = mapRange(bmi, 10, 18.5, 0, 22);
      noteText      = 'Your BMI suggests you may be underweight. A FITRIX nutrition coach can help you build a healthy, sustainable plan to reach your ideal weight.';

    } else if (bmi < 25) {
      category      = 'Normal Weight';
      needlePercent = mapRange(bmi, 18.5, 24.9, 22, 50);
      noteText      = 'Great — your BMI is in the healthy range. A FITRIX strength or conditioning programme can help you build on this foundation and reach peak performance.';

    } else if (bmi < 30) {
      category      = 'Overweight';
      needlePercent = mapRange(bmi, 25, 29.9, 50, 75);
      noteText      = 'Your BMI is in the overweight range. FITRIX\'s HIIT and nutrition programmes are designed precisely for this — sustainable fat loss without crash diets.';

    } else {
      category      = 'Obese';
      needlePercent = mapRange(bmi, 30, 45, 75, 100);
      noteText      = 'Your BMI indicates obesity. This is a starting point, not a verdict. FITRIX coaches work with members at every level — our personal training programme is built exactly for this journey.';
    }

    bmiCategory.textContent = category;
    bmiNote.textContent = noteText;

    /* Clamp needle between 2% and 98% so it's always visible */
    const clampedPercent = Math.min(98, Math.max(2, needlePercent));
    bmiNeedle.style.left = clampedPercent + '%';
  }


  /* ---- HELPERS ---- */

  /* Maps a value from one range to another */
  function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
  }

  function resetResult() {
    bmiResult.hidden = true;
    bmiScore.textContent = '--';
    bmiCategory.textContent = '--';
    bmiNote.textContent = '';
    bmiNeedle.style.left = '0%';
  }

  function showError(msg) {
    bmiNote.textContent = msg;
    bmiResult.hidden = false;
    bmiScore.textContent = '--';
    bmiCategory.textContent = '--';
  }

}