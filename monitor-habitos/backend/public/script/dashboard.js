// =================== CONFIG ===================
const API = "http://localhost:3001"; // back‑end base URL

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// =================== DOM refs ===================
const monthPicker = document.getElementById("monthPicker");
const habitListEl = document.getElementById("habitList");
const newHabitInp = document.getElementById("newHabit");
const addHabitBtn = document.getElementById("addHabit");
const monthTitle = document.getElementById("monthTitle");
const thead = document.querySelector("#habitTable thead");
const tbody = document.querySelector("#habitTable tbody");
const weeklyReport = document.getElementById("weeklyReport");
const weeklyBar = document.getElementById("weeklyBar");
const monthlyBar = document.getElementById("monthlyBar");
const weeklyPct = document.getElementById("weeklyPct");
const monthlyPct = document.getElementById("monthlyPct");
const pointsEl = document.getElementById("points");
const shareBtn = document.getElementById("shareBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Redireciona se n�o houver token salvo
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// =================== STATE ===================
let year = new Date().getFullYear();
let month = new Date().getMonth(); // 0‑based
let habits = [];      // nomes
let habitDocs = [];   // objetos completos {_id,nome,diasConcluidos[]}
let points = 0;

monthPicker.value = `${year}-${String(month + 1).padStart(2, "0")}`;

// =================== UI helpers ===================
function renderSidebar() {
  habitListEl.innerHTML = habits
    .map(
      (h, i) =>
        `<li><span>${h}</span><button data-del="${i}" title="Remove">✖</button></li>`
    )
    .join("");
}

function buildHeader() {
  thead.innerHTML = `<tr><th>Data</th><th></th>${habits
    .map((h) => `<th>${h}</th>`) 
    .join("")}<th>Progresso</th></tr>`;
}

function updateRowProgress(tr) {
  const total = tr.querySelectorAll("input").length;
  const done = tr.querySelectorAll("input:checked").length;
  tr.querySelector(".progress-bar span").style.width = `${Math.round(
    (done / total) * 100
  )}%`;
}

// Formata a data no padrao YYYY-MM-DD sem quebras de linha ou espacos extras
function formatDate(y, mZeroBased, day) {
  return `${y}-${String(mZeroBased + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

// =================== BUILD TABLE ===================
function buildTable() {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const mes = capitalize(new Date(year, month).toLocaleDateString("pt-BR", { month: "long" }));
    monthTitle.textContent = mes;
  
  buildHeader();
  tbody.innerHTML = "";

  const store = {};
  habitDocs.forEach((h, idx) => {
    h.diasConcluidos.forEach((d) => {
      const date = new Date(d);
      const y = date.getUTCFullYear();
      const m = date.getUTCMonth();
      const day = date.getUTCDate();

      if (y === year && m === month) {
        const key = String(day).padStart(2, "0");
        if (!store[key]) store[key] = Array(habits.length).fill(false);
        store[key][idx] = true;
      }
    });
  });

  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    const dayNum = d.getDate();
    const key = String(dayNum).padStart(2, "0");
    if (!store[key]) store[key] = Array(habits.length).fill(false);
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const weekday = capitalize(d.toLocaleDateString("pt-BR", { weekday: "long" }));
    const dateStr = formatDate(year, month, dayNum);
    const cells = store[key]
      .map(
        (flag, i) =>
          `<td><input type="checkbox" data-date="${dateStr}" data-idx="${i}" ${
            flag ? "checked" : ""
          }></td>`
      )
      .join("");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${key}</td><td><span class="badge ${weekday}">${weekday}</span></td>${cells}<td><div class="progress-bar"><span></span></div></td>`;
    tbody.appendChild(tr);
    updateRowProgress(tr);
    d.setDate(d.getDate() + 1);
  }

  buildStats(store);
}

// =================== BUILD STATS ===================
function setBar(bar, pctEl, val) {
  bar.style.width = val + "%";
  pctEl.textContent = val + "%";
}

function buildStats(store) {
  const rows = Object.values(store);
  const monthTotal = rows.length * habits.length;
  const monthChecked = rows.flat().filter(Boolean).length;
  const pctMonth = monthTotal ? Math.round((monthChecked / monthTotal) * 100) : 0;
  setBar(monthlyBar, monthlyPct, pctMonth);

  const today = new Date();
  const weekIdx = Math.floor((today.getDate() - 1) / 7) + 1;
  const weekRows = Object.entries(store)
    .filter(([d]) => Math.floor((+d - 1) / 7) + 1 === weekIdx)
    .map(([, r]) => r);
  const weekTotal = weekRows.length * habits.length;
  const weekChecked = weekRows.flat().filter(Boolean).length;
  const pctWeek = weekTotal ? Math.round((weekChecked / weekTotal) * 100) : 0;
  setBar(weeklyBar, weeklyPct, pctWeek);

  const weekTotals = habits.map((_, i) =>
    weekRows.reduce((s, row) => s + (row[i] ? 1 : 0), 0)
  );
const max = Math.max(...weekTotals);
  const min = Math.min(...weekTotals);
  const best = weekTotals.findIndex((v) => v === max && max > 0);
  const worst = weekTotals.findIndex((v) => v === min && min < max);

  let insights = `<p>📈 <strong>Sua semana ${weekIdx}</strong></p><ul>`;
  if (best !== -1) insights += `<li>Parabéns pelo hábito <b>${habits[best]}</b>!</li>`;
  if (worst !== -1) insights += `<li>Dê mais atenção a <b>${habits[worst]}</b>.</li>`;
  if (best === -1 && worst === -1) insights += `<li>Nenhum hábito foi concluído ainda esta semana.</li>`;
  insights += `</ul>`;
  weeklyReport.innerHTML = insights;
}


// =================== API-driven CRUD ===================
async function fetchHabits() {
  habitDocs = await api("/habitos");
  habits = habitDocs.map((h) => h.nome);

  // Atualiza pontos com base real do backend
  const { pontos } = await api("/pontos");
  points = pontos;
  pointsEl.textContent = points;
}

async function addHabit(name) {
  const novo = await api("/habitos", {
    method: "POST",
    body: JSON.stringify({ nome: name }),
  });
  habitDocs.push(novo);
  habits.push(novo.nome);
  buildTable();
  renderSidebar();
}

async function deleteHabit(idx) {
  const id = habitDocs[idx]._id;
  await api(`/habitos/${id}`, { method: "DELETE" });
  habitDocs.splice(idx, 1);
  habits.splice(idx, 1);
  buildTable();
  renderSidebar();
}

async function toggleHabit(date, idx, checked) {
  const id = habitDocs[idx]._id;
  await api(`/habitos/${id}/concluir`, {
    method: checked ? "PUT" : "DELETE",
    body: JSON.stringify({ data: date }),
  });
}

function shareProgress() {
  const msg = `⭐ ${points} pts em ${monthTitle.textContent.trim()}!`;
  if (navigator.share) {
    navigator.share({ text: msg }).catch(() => alert("Não foi possível compartilhar."));
  } else {
    navigator.clipboard.writeText(msg);
    alert("Progresso copiado para a área de transferência!");
  }
}

// =================== Event listeners ===================
addHabitBtn.onclick = async () => {
  const v = newHabitInp.value.trim();
  if (v) {
    try {
      await addHabit(v);
      newHabitInp.value = "";
    } catch (err) {
      alert("Erro ao adicionar hábito");
    }
  }
};

habitListEl.onclick = async (e) => {
  if ("del" in e.target.dataset) {
    try {
      await deleteHabit(+e.target.dataset.del);
    } catch {
      alert("Erro ao deletar hábito");
    }
  }
};

monthPicker.onchange = async (e) => {
  const [y, m] = e.target.value.split("-").map(Number);
  year = y;
  month = m - 1;
  await fetchHabits();
  buildTable();
};

tbody.oninput = async (e) => {
  if (e.target.type !== "checkbox") return;
  const date = e.target.dataset.date;
  const idx = +e.target.dataset.idx;
  const checked = e.target.checked;
  try {
    await toggleHabit(date, idx, checked);
    await fetchHabits();       // <-- garante atualização real
    buildTable();              // <-- reconstrói visualmente com dados novos
  } catch {
    alert("Falha ao salvar no servidor");
    e.target.checked = !checked;
  }
};

shareBtn.onclick = shareProgress;
logoutBtn.onclick = () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
};

// =================== Init ===================
(async function init() {
  try {
    await fetchHabits();
    buildTable();
    renderSidebar();
  } catch (err) {
    alert("Erro ao carregar hábitos. Você está logada?");
  }
})();

const reminderInp = document.getElementById("reminderTime");
const saveRemBtn = document.getElementById("setReminder");

// Salva o horário no localStorage
saveRemBtn.onclick = () => {
  const time = reminderInp.value;
  if (time) {
    localStorage.setItem("habitReminder", time);
    alert(`Lembrete salvo para ${time}`);
  }
};

function checkReminder() {
  const reminderTime = localStorage.getItem("habitReminder");
  if (!reminderTime) return;

  const now = new Date();
  const current = now.getHours().toString().padStart(2, "0") + ":" +
                  now.getMinutes().toString().padStart(2, "0");

  if (current === reminderTime) {
    alert("⏰ Hora de praticar seus hábitos!");
  }
}

// Verifica a cada minuto
setInterval(checkReminder, 60 * 1000);

const savedTime = localStorage.getItem("habitReminder");
if (savedTime) reminderInp.value = savedTime;
