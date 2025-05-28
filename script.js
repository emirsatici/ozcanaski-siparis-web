
let orders = [];
let currentUser = null;
let currentFilter = "Tümü";

const users = [
  { username: "sube1", password: "ozcan123", role: "sube" },
  { username: "depo", password: "askidepo", role: "depo" }
];

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const user = users.find(x => x.username === u && x.password === p);
  if (user) {
    currentUser = user;
    document.querySelector(".login-container").classList.add("hidden");
    document.getElementById("panel").classList.remove("hidden");
    document.getElementById("panelTitle").innerText = user.role === "sube" ? "Şube Paneli" : "Depo Paneli";
    if (user.role === "depo") document.getElementById("orderForm").style.display = "none";
  } else {
    document.getElementById("error").innerText = "Hatalı giriş";
  }
}

function addOrder() {
  const order = {
    branch: document.getElementById("branch").value,
    product: document.getElementById("product").value,
    quantity: document.getElementById("quantity").value,
    note: document.getElementById("note").value,
    type: document.getElementById("type").value,
    date: new Date().toLocaleString(),
    selected: false
  };
  orders.push(order);
  renderOrders();
}

function filterOrders(type) {
  currentFilter = type;
  renderOrders();
}

function toggleSelect(index) {
  orders[index].selected = !orders[index].selected;
}

function renderOrders() {
  const container = document.getElementById("orders");
  container.innerHTML = "";
  orders.forEach((o, i) => {
    if (currentFilter !== "Tümü" && o.type !== currentFilter) return;
    const div = document.createElement("div");
    div.className = "order-card";
    div.innerHTML = `
      <label><input type="checkbox" onchange="toggleSelect(${i})" ${o.selected ? "checked" : ""}> Seç</label>
      <p><b>Şube:</b> ${o.branch}</p>
      <p><b>Ürün:</b> ${o.product} (${o.quantity})</p>
      <p><b>Not:</b> ${o.note}</p>
      <p><b>Tür:</b> ${o.type}</p>
      <p><i>${o.date}</i></p>
    `;
    container.appendChild(div);
  });
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;
  orders.filter(o => o.selected).forEach(o => {
    doc.text(`Şube: ${o.branch}`, 10, y); y += 6;
    doc.text(`Ürün: ${o.product} (${o.quantity})`, 10, y); y += 6;
    doc.text(`Not: ${o.note}`, 10, y); y += 6;
    doc.text(`Tür: ${o.type}`, 10, y); y += 6;
    doc.text(`Tarih: ${o.date}`, 10, y); y += 10;
  });
  doc.save("siparisler.pdf");
}
