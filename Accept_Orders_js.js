const cssContent = localStorage.getItem("style2.css");
    if (cssContent) {
        // إزالة أي CSS سابق لتجنب التكرار
        const oldStyle = document.getElementById("style2.css");
        if (oldStyle) oldStyle.remove();
            
        const style = document.createElement("style");
        style.id = "myStyle";
        style.textContent = cssContent;
        document.head.appendChild(style);

        console.log("تم تطبيق CSS تلقائيًا!");
    } else {
        console.log("لا يوجد CSS محفوظ");
    }


let invoicesData = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("popup_invoices").style.display = "flex";
});


// تحميل الفواتير من الشيت
async function loadInvoices() {
  try {
    invoicesData = localStorage.getItem("Orders_LD") ? JSON.parse(localStorage.getItem("Orders_LD")) : [];

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
  return row;
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
  const items = row[9];

itemsBody.innerHTML = "";

items.forEach(item => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item[0]}</td>  <!-- الصنف -->
    <td>${item[1]}</td>  <!-- الكمية -->
    <td>${item[2]}</td>  <!-- السعر -->
    <td>${item[3]}</td>  <!-- الاجمالي -->
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


function Accepted() {
    
    // 1️⃣ جلب بيانات الطلبات المقبولة
const Accept_Order = JSON.parse(localStorage.getItem("Accept_Order_LD")) || [];

// 2️⃣ تحديد رقم الفاتورة من الجدول
const invoiceNumber = document.querySelector("#invoiceInfo tr").cells[0].innerText;

// 3️⃣ جلب الصف المطلوب من Orders_LD
let Orders_LD = JSON.parse(localStorage.getItem("Orders_LD")) || [];
const rowToRemove = Orders_LD.find(r => r[0] == invoiceNumber); // استخدم == بدل ===

// 4️⃣ أضف للطلبات المقبولة
if(rowToRemove){
    Accept_Order.push(rowToRemove);
    localStorage.setItem("Accept_Order_LD", JSON.stringify(Accept_Order));

    // 5️⃣ حذف الصف من Orders_LD
    Orders_LD = Orders_LD.filter(row => 
        row.map(String).join(",") !== rowToRemove.map(String).join(",")
    );
    localStorage.setItem("Orders_LD", JSON.stringify(Orders_LD));

    alert("تم قبول الطلب");
    window.location.reload()
}else{
    alert("لم يتم العثور على الفاتورة");
}

}


function Rejected() {
    
// 2️⃣ تحديد رقم الفاتورة من الجدول
const invoiceNumber = document.querySelector("#invoiceInfo tr").cells[0].innerText;

// 3️⃣ جلب الصف المطلوب من Orders_LD
let Orders_LD = JSON.parse(localStorage.getItem("Orders_LD")) || [];
const rowToRemove = Orders_LD.find(r => r[0] == invoiceNumber); // استخدم == بدل ===

// 4️⃣ أضف للطلبات المقبولة
if(rowToRemove){
    // 5️⃣ حذف الصف من Orders_LD
    Orders_LD = Orders_LD.filter(row => 
        row.map(String).join(",") !== rowToRemove.map(String).join(",")
    );
    localStorage.setItem("Orders_LD", JSON.stringify(Orders_LD));

    alert("تم رفض الطلب");
    window.location.reload();
}else{
    alert("لم يتم العثور على الفاتورة");
}

}













function Open_Whatsapp() {
  window.open(`https://wa.me/2${document.querySelector("#clientInfo tr").cells[1].innerText}`, "_blank");
}









// إغلاق Popup
function closePopup() {
  document.getElementById("popup_invoices").style.display = "none";
}

// تحميل الفواتير عند فتح الصفحة
window.addEventListener("load", loadInvoices);



document.getElementById("window.print").addEventListener("click", () => {
  // اختر العنصر الذي تريد حفظه
  const element = document.getElementById("Print_Area"); 

  html2canvas(element).then(canvas => {
    const link = document.createElement("a");
    link.download = "section.png";       // اسم الصورة
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
