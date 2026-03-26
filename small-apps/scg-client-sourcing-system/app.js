
const form = document.getElementById('leadForm');
const leadList = document.getElementById('leadList');
const exportAllBtn = document.getElementById('exportAllBtn');
const printBtn = document.getElementById('printBtn');

const scoreValue = document.getElementById('scoreValue');
const ratingBand = document.getElementById('ratingBand');
const categoryValue = document.getElementById('categoryValue');
const actionValue = document.getElementById('actionValue');
const feeValue = document.getElementById('feeValue');

const getChecks = (name) => [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x => x.value);

function computeScore(data) {
  let score = 0;

  if ((data.dealSize || 0) >= 5) score += 10;
  if ((data.dealSize || 0) >= 25) score += 8;
  if ((data.fundingRequired || 0) >= 2) score += 8;

  if (data.promoterStrength === 'Strong') score += 12;
  else if (data.promoterStrength === 'Moderate') score += 6;

  if (data.seriousness === 'Ready to Proceed') score += 18;
  else if (data.seriousness === 'Serious') score += 10;
  else if (data.seriousness === 'Exploring') score += 4;

  if (data.feesWilling === 'Yes') score += 16;
  else if (data.feesWilling === 'To be discussed') score += 8;
  else if (data.feesWilling === 'No') score -= 15;

  if (data.bankingStatus === 'Standard') score += 10;
  else if (data.bankingStatus === 'SMA') score += 3;
  else if (data.bankingStatus === 'NPA') score += 5;

  if ((data.turnover || 0) > 0) score += 5;
  if ((data.loanExposure || 0) > 0) score += 4;
  if ((data.profit || 0) > 0) score += 8;

  score += Math.min((data.readiness || []).length * 4, 20);

  if (data.security && data.security.trim().length > 0) score += 6;
  if (data.briefRequirement && data.briefRequirement.trim().length > 20) score += 4;
  if (data.expectedOutcome && data.expectedOutcome.trim().length > 10) score += 4;

  return Math.max(0, Math.min(score, 100));
}

function classify(score, data) {
  let rating = 'Unrated';
  let pillClass = 'neutral';
  let category = 'C';
  let action = 'Need more data';

  if (score >= 75) {
    rating = 'High-Potential';
    pillClass = 'good';
    category = 'A';
    action = 'Proceed for detailed discussion';
  } else if (score >= 50) {
    rating = 'Selective';
    pillClass = 'mid';
    category = 'B';
    action = 'Ask for more data and schedule screening call';
  } else {
    rating = 'Weak / Early';
    pillClass = 'bad';
    category = 'C';
    action = 'Drop, defer, or seek clarification';
  }

  if (data.feesWilling === 'No') {
    category = 'C';
    action = 'Do not proceed without commercial alignment';
  }

  return { rating, pillClass, category, action };
}

function refreshDecision(data) {
  const score = computeScore(data);
  const c = classify(score, data);

  scoreValue.textContent = score;
  ratingBand.textContent = c.rating;
  ratingBand.className = `pill ${c.pillClass}`;
  categoryValue.textContent = c.category;
  actionValue.textContent = c.action;
  feeValue.textContent = data.feesWilling || '—';
}

function getLeads() {
  return JSON.parse(localStorage.getItem('scg_leads') || '[]');
}

function saveLeads(leads) {
  localStorage.setItem('scg_leads', JSON.stringify(leads));
}

function formDataObject() {
  return {
    clientName: document.getElementById('clientName').value.trim(),
    contactPerson: document.getElementById('contactPerson').value.trim(),
    mobile: document.getElementById('mobile').value.trim(),
    email: document.getElementById('email').value.trim(),
    location: document.getElementById('location').value.trim(),
    sector: document.getElementById('sector').value.trim(),
    dealSize: parseFloat(document.getElementById('dealSize').value) || 0,
    fundingRequired: parseFloat(document.getElementById('fundingRequired').value) || 0,
    requirements: getChecks('requirement'),
    briefRequirement: document.getElementById('briefRequirement').value.trim(),
    expectedOutcome: document.getElementById('expectedOutcome').value.trim(),
    urgency: document.getElementById('urgency').value,
    bankingStatus: document.getElementById('bankingStatus').value,
    promoterStrength: document.getElementById('promoterStrength').value,
    seriousness: document.getElementById('seriousness').value,
    turnover: parseFloat(document.getElementById('turnover').value) || 0,
    profit: parseFloat(document.getElementById('profit').value) || 0,
    loanExposure: parseFloat(document.getElementById('loanExposure').value) || 0,
    feesWilling: document.getElementById('feesWilling').value,
    security: document.getElementById('security').value.trim(),
    usp: document.getElementById('usp').value.trim(),
    readiness: getChecks('readiness'),
    referredBy: document.getElementById('referredBy').value.trim(),
    risks: document.getElementById('risks').value.trim(),
    createdAt: new Date().toISOString()
  };
}

function renderLeads() {
  const leads = getLeads().reverse();
  if (!leads.length) {
    leadList.innerHTML = '<div class="lead-item">No leads saved yet.</div>';
    return;
  }

  leadList.innerHTML = leads.map((lead, idx) => {
    const c = classify(lead.score || 0, lead);
    return `
      <div class="lead-item">
        <h4>${lead.clientName || 'Unnamed Lead'}</h4>
        <div class="lead-meta">${lead.contactPerson || ''} | ${lead.location || '—'} | ${lead.sector || '—'}</div>
        <div><strong>Score:</strong> ${lead.score || 0} | <strong>Category:</strong> ${c.category}</div>
        <div><strong>Requirement:</strong> ${(lead.requirements || []).join(', ') || '—'}</div>
        <div><strong>Action:</strong> ${c.action}</div>
      </div>
    `;
  }).join('');
}

function exportJSON() {
  const leads = getLeads();
  const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'scg-client-leads.json';
  a.click();
}

form.addEventListener('input', () => refreshDecision(formDataObject()));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = formDataObject();
  data.score = computeScore(data);
  const leads = getLeads();
  leads.push(data);
  saveLeads(leads);
  refreshDecision(data);
  renderLeads();
  alert('Lead saved successfully.');
});

exportAllBtn.addEventListener('click', exportJSON);
printBtn.addEventListener('click', () => window.print());

renderLeads();
refreshDecision({});
