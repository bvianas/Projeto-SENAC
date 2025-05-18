/* ========= DOM refs ========= */
const monthPicker  = document.getElementById('monthPicker');
const habitListEl  = document.getElementById('habitList');
const newHabitInp  = document.getElementById('newHabit');
const addHabitBtn  = document.getElementById('addHabit');
const reminderInp  = document.getElementById('reminderTime');
const saveRemBtn   = document.getElementById('setReminder');
const monthTitle   = document.getElementById('monthTitle');
const thead        = document.querySelector('#habitTable thead');
const tbody        = document.querySelector('#habitTable tbody');
const shareBtn     = document.getElementById('shareBtn');
const pointsEl     = document.getElementById('points');
const weeklyReport = document.getElementById('weeklyReport');

/* Progress‑bar DOM refs */
const weeklyBar   = document.getElementById('weeklyBar');
const monthlyBar  = document.getElementById('monthlyBar');
const weeklyPct   = document.getElementById('weeklyPct');
const monthlyPct  = document.getElementById('monthlyPct');

/* ========= STATE ========= */
let year   = new Date().getFullYear();
let month  = new Date().getMonth();      // 0‑based
let habits = [];
let points = 0;

/* ========= Helpers ========= */
const pad = n => String(n).padStart(2,'0');
const key = base => `${base}-${year}-${pad(month+1)}`;

const load = (k,f='{}') => JSON.parse(localStorage.getItem(k) || f);
const save = (k,v)     => localStorage.setItem(k, JSON.stringify(v));

const dataKey   = () => key('habitData');
const namesKey  = () => key('habitNames');
const pointsKey = 'habitPoints';

/* ========= Picker init ========= */
monthPicker.value = `${year}-${pad(month+1)}`;

/* ========= UI helpers ========= */
function updateRowProgress(tr){
  const boxes = tr.querySelectorAll('input[type="checkbox"]');
  const done  = tr.querySelectorAll('input[type="checkbox"]:checked').length;
  tr.querySelector('.progress-bar span').style.width =
      `${Math.round((done/boxes.length)*100)}%`;
}

function renderSidebar(){
  habitListEl.innerHTML = habits.map((h,i)=>
    `<li><span>${h.replace(/</g,'&lt;')}</span><button data-del="${i}" title="Remove">✖</button></li>`
  ).join('');
}

function buildHeader(){
  thead.innerHTML = `
    <tr>
      <th>Date</th><th>Day</th>
      ${habits.map(h=>`<th>${h}</th>`).join('')}
      <th>Progress</th>
    </tr>`;
}

function buildTable(){
  monthTitle.textContent = new Date(year,month).toLocaleString('en',{month:'long'});
  buildHeader();
  tbody.innerHTML = '';

  const store = load(dataKey());
  const d = new Date(year,month,1);

  while(d.getMonth()===month){
    const day = pad(d.getDate());
    if(!store[day]) store[day] = Array(habits.length).fill(false);

    const weekday = d.toLocaleDateString('en',{weekday:'long'});
    const cells = store[day].map((f,i)=>
      `<td><input type="checkbox" data-day="${day}" data-idx="${i}" ${f?'checked':''}></td>`
    ).join('');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${day}</td>
      <td><span class="badge ${weekday}">${weekday}</span></td>
      ${cells}
      <td><div class="progress-bar"><span></span></div></td>`;

    tbody.appendChild(tr);
    updateRowProgress(tr);
    d.setDate(d.getDate()+1);
  }
  save(dataKey(),store);
  buildStats(store);
}

/* ========= STATS (Weekly & Monthly bars) ========= */
function setBar(barEl,pctEl,val){
  const pct = Math.min(100,Math.max(0,val));
  barEl.style.width = pct + '%';
  pctEl.textContent = pct + '%';
}

function buildStats(store){
  const rows = Object.values(store);

  // ---- Month ----
  const totalMonth = rows.length * habits.length;
  const checkedMonth = rows.flat().filter(Boolean).length;
  const pctMonth = totalMonth ? Math.round((checkedMonth/totalMonth)*100) : 0;
  setBar(monthlyBar, monthlyPct, pctMonth);

  // ---- Current week ----
  const today   = new Date();
  const curWeek = Math.floor((today.getDate()-1)/7)+1;
  const weekRows = Object.entries(store)
        .filter(([d])=> Math.floor((+d-1)/7)+1 === curWeek)
        .map(([,row])=> row);
  const totalWeek = weekRows.length * habits.length;
  const checkedWeek = weekRows.flat().filter(Boolean).length;
  const pctWeek = totalWeek ? Math.round((checkedWeek/totalWeek)*100) : 0;
  setBar(weeklyBar, weeklyPct, pctWeek);

  // ---- Simple insight ----
  const weekTotals = habits.map((_,i)=>
      weekRows.reduce((s,row)=> s + (row[i]?1:0),0) );
  const best  = weekTotals.indexOf(Math.max(...weekTotals));
  const worst = weekTotals.indexOf(Math.min(...weekTotals));

  weeklyReport.innerHTML = `
    <p>📈 <strong>Sua semana ${curWeek}</strong></p>
    <ul>
      <li>Parabéns pelo hábito <b>${habits[best]||'-'}</b>!</li>
      <li>Dê mais atenção a <b>${habits[worst]||'-'}</b>.</li>
    </ul>`;
}

/* ========= Habit CRUD ========= */
function addHabit(name){
  habits.push(name); save(namesKey(),habits);
  const store = load(dataKey());
  Object.keys(store).forEach(d=>store[d].push(false));
  save(dataKey(),store);
  rerender();
}
function deleteHabit(idx){
  habits.splice(idx,1); save(namesKey(),habits);
  const store = load(dataKey());
  Object.keys(store).forEach(d=>store[d].splice(idx,1));
  save(dataKey(),store);
  rerender();
}

/* ========= Points ========= */
function adjustPoints(delta){
  points = Math.max(0, points + delta);
  save(pointsKey, points);
  pointsEl.textContent = points;
}

/* ========= Share ========= */
function share(){
  const msg = `⭐ ${points} pts em ${monthTitle.textContent}!`;
  if(navigator.share) navigator.share({text:msg}).catch(()=>{});
  else { navigator.clipboard.writeText(msg); alert('Copiado!'); }
}

/* ========= Event listeners ========= */
addHabitBtn.onclick = () => {
  const v = newHabitInp.value.trim();
  if(v){ addHabit(v); newHabitInp.value=''; }
};
habitListEl.onclick = e => {
  if('del' in e.target.dataset) deleteHabit(+e.target.dataset.del);
};
monthPicker.onchange = e => {
  const [y,m] = e.target.value.split('-').map(Number);
  year = y; month = m-1; habits = load(namesKey(),'[]');
  rerender();
};
tbody.oninput = e => {
  if(e.target.type!=='checkbox') return;
  const {day,idx} = e.target.dataset;
  const store = load(dataKey());
  const prev  = store[day][idx];
  store[day][idx] = e.target.checked;
  save(dataKey(),store);
  updateRowProgress(e.target.closest('tr'));
  buildStats(store);
  if(e.target.checked && !prev) adjustPoints(1);
  if(!e.target.checked && prev)  adjustPoints(-1);
};
shareBtn.onclick = share;

/* ========= First load ========= */
(function init(){
  habits = load(namesKey(),'[]');
  points = +localStorage.getItem(pointsKey) || 0;
  pointsEl.textContent = points;
  rerender();
})();
function rerender(){ renderSidebar(); buildTable(); }
