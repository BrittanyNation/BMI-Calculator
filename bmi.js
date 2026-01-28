function toKg(weight, unit){
  if(!weight || weight <= 0) return NaN;
  return unit === 'lb' ? weight * 0.45359237 : weight;
}

function toMeters(height, unit){
  if(!height || height <= 0) return NaN;
  return unit === 'in' ? height * 0.0254 : height / 100;
}

function calcBMI(kg, m){
  if(!kg || !m || m === 0) return NaN;
  return kg / (m * m);
}

function getCategory(bmi){
  if(bmi < 18.5) return {name:'Underweight', key:'under', tips:['Consider a balanced increase in calories and resistance training.','Talk to a healthcare provider for personalized advice.']};
  if(bmi < 25) return {name:'Normal', key:'normal', tips:['Maintain your weight with a balanced diet and regular activity.','Continue regular checkups and healthy habits.']};
  if(bmi < 30) return {name:'Overweight', key:'over', tips:['Increase physical activity and review dietary choices.','Small sustained changes can reduce risk.']};
  return {name:'Obese', key:'obese', tips:['Consult a healthcare provider for a personalized plan.','Focus on gradual lifestyle changes and support.']};
}

function mapBmiToPercent(bmi){
  // Visual range from BMI 12 -> 40
  const min = 12, max = 40;
  if(isNaN(bmi)) return 0;
  if(bmi <= min) return 0;
  if(bmi >= max) return 100;
  return ((bmi - min) / (max - min)) * 100;
}

function updateUI(bmi){
  const result = document.getElementById('result');
  const bmiNumber = document.getElementById('bmiNumber');
  const bmiCategory = document.getElementById('bmiCategory');
  const tipsEl = document.getElementById('tips');
  const marker = document.getElementById('gaugeMarker');

  if(isNaN(bmi) || !isFinite(bmi)){
    result.classList.add('hidden');
    return;
  }

  const rounded = Math.round(bmi * 10) / 10;
  bmiNumber.textContent = rounded;

  const cat = getCategory(rounded);
  bmiCategory.textContent = cat.name;

  // tips
  tipsEl.innerHTML = '';
  cat.tips.forEach(t => {
    const p = document.createElement('p'); p.textContent = '• ' + t; tipsEl.appendChild(p);
  });

  // gauge marker
  const pct = mapBmiToPercent(rounded);
  marker.style.left = pct + '%';
  marker.style.background = '#222';

  result.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('bmiForm');
  const weight = document.getElementById('weight');
  const weightUnit = document.getElementById('weightUnit');
  const height = document.getElementById('height');
  const heightUnit = document.getElementById('heightUnit');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const w = parseFloat(weight.value);
    const h = parseFloat(height.value);
    const kg = toKg(w, weightUnit.value);
    const m = toMeters(h, heightUnit.value);
    const bmi = calcBMI(kg, m);
    if(isNaN(bmi) || !isFinite(bmi)){
      alert('Please enter valid positive numbers for weight and height.');
      return;
    }
    updateUI(bmi);
  });

  form.addEventListener('reset', ()=>{
    setTimeout(()=>{
      document.getElementById('result').classList.add('hidden');
      document.getElementById('bmiNumber').textContent = '—';
      document.getElementById('bmiCategory').textContent = '—';
      document.getElementById('tips').innerHTML = '';
      document.getElementById('gaugeMarker').style.left = '0%';
    }, 0);
  });
});
