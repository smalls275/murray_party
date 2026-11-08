const STORAGE_KEY = 'murrayPartyRSVPs';

const defaultRSVPs = [
  { id: crypto.randomUUID(), name: 'Ed Murray', attendance: 'coming', partySize: 2, kids: 'Yes', note: 'Looking forward to a cozy cocktail hour.' },
  { id: crypto.randomUUID(), name: 'Lauren Murray', attendance: 'coming', partySize: 2, kids: 'Yes', note: 'Cookies are a must.' },
  { id: crypto.randomUUID(), name: 'Lillian Murray', attendance: 'coming', partySize: 1, kids: 'Yes', note: 'Ready for holiday sparkle and snacks.' }
];

const form = document.querySelector('#rsvpForm');
const guestTableBody = document.querySelector('#guestTableBody');
const comingCount = document.querySelector('#comingCount');
const maybeCount = document.querySelector('#maybeCount');
const totalGuests = document.querySelector('#totalGuests');

function readRSVPs() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRSVPs));
    return [...defaultRSVPs];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...defaultRSVPs];
  } catch (error) {
    console.error('Failed to read RSVP data', error);
    return [...defaultRSVPs];
  }
}

function saveRSVPs(rsvps) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvps));
}

function formatStatus(status) {
  const map = {
    coming: 'Coming',
    maybe: 'Maybe',
    declined: 'Can’t make it'
  };

  return map[status] || status;
}

function renderTable(rsvps) {
  guestTableBody.innerHTML = '';

  if (!rsvps.length) {
    guestTableBody.innerHTML = `
      <tr>
        <td colspan="4">No RSVPs yet. Be the first to join the celebration.</td>
      </tr>
    `;
    return;
  }

  rsvps.forEach((guest) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${guest.name}</td>
      <td><span class="status-pill status-pill--${guest.attendance}">${formatStatus(guest.attendance)}</span></td>
      <td>${guest.partySize}</td>
      <td>${guest.kids}</td>
    `;
    guestTableBody.appendChild(row);
  });
}

function renderSummary(rsvps) {
  const coming = rsvps.filter((guest) => guest.attendance === 'coming').length;
  const maybe = rsvps.filter((guest) => guest.attendance === 'maybe').length;
  const total = rsvps.reduce((sum, guest) => sum + Number(guest.partySize || 1), 0);

  comingCount.textContent = String(coming);
  maybeCount.textContent = String(maybe);
  totalGuests.textContent = String(total);
}

function render() {
  const rsvps = readRSVPs();
  renderTable(rsvps);
  renderSummary(rsvps);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const guest = {
    id: crypto.randomUUID(),
    name: (formData.get('guestName') || '').toString().trim(),
    attendance: (formData.get('attendance') || 'coming').toString(),
    partySize: Number(formData.get('partySize') || 1),
    kids: (formData.get('kids') || 'No').toString(),
    note: (formData.get('note') || '').toString().trim()
  };

  if (!guest.name) {
    return;
  }

  const current = readRSVPs();
  const updated = [...current, guest];
  saveRSVPs(updated);
  render();
  form.reset();
  const partySizeInput = document.querySelector('#partySize');
  if (partySizeInput) partySizeInput.value = 2;
});

render();
