const scriptURL = "https://script.google.com/macros/s/AKfycbwRMlFgvB7v1kkb5XsIbAtpl00hSrnrt3_0Hj5XXSqZHuG6NYBTFGIfXFC2L2Uubfce/exec";

let invoicesData = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("popup_invoices").style.display = "flex";
});


// تحميل الفواتير من الشيت
async function loadInvoices() {
  try {
    const res = await fetch(`${scriptURL}?sheet=Accept_OrdersSheet`);
    const data = await res.json(); // الصف 0 هو العناوين
    invoicesData = data.slice(1); // تجاهل الصفوف الأولى (العناوين)

    renderInvoiceList(invoicesData);
  } catch (e) {
    console.error("خطأ في تحميل الفواتير:", e);
    alert("انتظر تحميل الفواتير");
  }
}

// عرض قائمة الفواتير
function renderInvoiceList(list) {
  const container = document.getElementById("list_invoices");
  container.innerHTML = "";

  list.forEach(row => {
    const invoice = row[0];
    const client  = row[2];

    const btn = document.createElement("button");
    btn.className = "item-btn";
    btn.textContent = `${invoice} - ${client}`;

    btn.onclick = () => selectInvoice(invoice);

    container.appendChild(btn);
  });

  // إظهار رسالة لا توجد نتائج إذا القائمة فارغة
  document.getElementById("no_invoices").style.display = list.length === 0 ? "block" : "none";
}

// فلترة البحث داخل Popup
function filterInvoiceList(text) {
  const q = text.trim().toLowerCase();
  const filtered = invoicesData.filter(row => {
    const invoice = String(row[0]);
    const client  = String(row[2]);
    return invoice.includes(q) || client.toLowerCase().includes(q);
  });

  renderInvoiceList(filtered);
}

// اختيار فاتورة
function selectInvoice(invoiceNumber) {
  const row = invoicesData.find(r => r[0] == invoiceNumber);
  if (!row) return;

  fillInvoice(row);
  closePopup();
}

// ملء الجداول
function fillInvoice(row) {
  document.getElementById("invoiceInfo").innerHTML = `
    <tr>
      <td>${row[0]}</td>
      <td>${row[2]}</td>
    </tr>
  `;

  document.getElementById("clientInfo").innerHTML = `
    <tr>
      <td>${row[3]}</td>
      <td>${row[4]}</td>
    </tr>
  `;

  const itemsBody = document.getElementById("itemsTable");
  itemsBody.innerHTML = "";
  const items = JSON.parse(row[9]); // مصفوفة الطلب
  items.forEach(i => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i.الصنف}</td>
      <td>${i.الكمية}</td>
      <td>${i.السعر}</td>
      <td>${i.الاحمالي}</td>
    `;
    itemsBody.appendChild(tr);
  });

  document.getElementById("summaryTable").innerHTML = `
    <tr>
      <td>${row[5]}</td>
      <td>${row[6]}</td>
      <td>${row[7]}</td>
      <td>${row[8]} جنيه</td>
    </tr>
  `;
}

// إغلاق Popup
function closePopup() {
  document.getElementById("popup_invoices").style.display = "none";
}

// تحميل الفواتير عند فتح الصفحة
window.addEventListener("load", loadInvoices);
