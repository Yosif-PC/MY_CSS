let Order_Data = [];
let summ = 0;

// العملاء مع الهاتف والعنوان
let clientsData = []; // شكل: [{name:"أحمد", phone:"010", address:"القاهرة"}, ...]

// المنتجات والأسعار
let productsList = [];
let productsPrices = [];

const scriptURL = "https://script.google.com/macros/s/AKfycbwRMlFgvB7v1kkb5XsIbAtpl00hSrnrt3_0Hj5XXSqZHuG6NYBTFGIfXFC2L2Uubfce/exec";

// === تحميل العملاء بالكامل مع الهاتف والعنوان ===
async function loadClients() {
    try {
        const resNames = await fetch(`${scriptURL}?sheet=ClientsSheet&column=العميل`);
        const resPhones = await fetch(`${scriptURL}?sheet=ClientsSheet&column=الهاتف`);
        const resAddresses = await fetch(`${scriptURL}?sheet=ClientsSheet&column=العنوان`);

        const names = await resNames.json();
        const phones = await resPhones.json();
        const addresses = await resAddresses.json();

        clientsData = names.map((name, i) => ({
            name: name,
            phone: phones[i] || "",
            address: addresses[i] || ""
        }));

        const listCL = document.getElementById("list_CL");
        listCL.innerHTML = clientsData.map(c => `<button class="item-btn">${c.name}</button>`).join('');
        attachButtons(listCL, 'CL');

    } catch (e) {
        console.error("خطأ في تحميل العملاء:", e);
    }
}

// === تحميل أسماء المنتجات ===
async function loadProductNames() {
    try {
        const res = await fetch(`${scriptURL}?sheet=ProductsSheet&column=المنتج`);
        productsList = await res.json();
        const listD1 = document.getElementById("list_D1");
        listD1.innerHTML = productsList.map(p => `<button class="item-btn">${p}</button>`).join('');
        attachButtons(listD1, 'D1');
    } catch (e) {
        console.error("خطأ في تحميل أسماء المنتجات:", e);
    }
}

// === تحميل أسعار المنتجات ===
async function loadProductPrices() {
    try {
        const res = await fetch(`${scriptURL}?sheet=ProductsSheet&column=السعر`);
        productsPrices = await res.json();
    } catch (e) {
        console.error("خطأ في تحميل أسعار المنتجات:", e);
    }
}

// === اختيار العميل ===
function selectClient(val) {
    document.getElementById("Cl").value = val;
    closePopup("popup_CL");
}

// === اختيار المنتج مع إيجاد السعر ===
function selectProduct(val) {
    document.getElementById("D1").value = val;
    const index = productsList.indexOf(val);
    document.getElementById("D3").value = (index >= 0) ? productsPrices[index] || 0 : 0;
    closePopup("popup_D1");
}

// === فتح Popups عند النقر على المدخل ===
document.getElementById("Cl").addEventListener("click", () => {
    document.getElementById("popup_CL").style.display = 'flex';
});
document.getElementById("D1").addEventListener("click", () => {
    document.getElementById("popup_D1").style.display = 'flex';
});

// === ربط أزرار القوائم ===
function attachButtons(listContainer, type) {
    const buttons = listContainer.querySelectorAll(".item-btn");
    buttons.forEach(btn => {
        btn.onclick = null;
        btn.addEventListener("click", function () {
            const val = this.innerText.trim();
            if (type === 'CL') selectClient(val);
            else if (type === 'D1') selectProduct(val);
        });
    });
}

// === إغلاق Popup عند الضغط خارج المحتوى ===
document.querySelectorAll(".popup").forEach(p => {
    p.addEventListener("click", e => {
        if (e.target === p) closePopup(p.id);
    });
});
function closePopup(id) {
    const p = document.getElementById(id);
    p.style.display = "none";
    p.hidden = true;
}

// === فلترة البحث داخل كل Popup ===
function filterList(popupId, text) {
    const p = document.getElementById(popupId);
    if (!p) return;
    const items = p.querySelectorAll(".item-btn");
    const noElem = p.querySelector(".no-results");
    const q = text.trim().toLowerCase();
    let shown = 0;

    items.forEach(btn => {
        const itemText = btn.innerText.trim().toLowerCase();
        if (q === "" || itemText.includes(q)) {
            btn.style.display = "block";
            shown++;
        } else btn.style.display = "none";
    });

    if (noElem) noElem.style.display = (shown === 0) ? "block" : "none";
}

// === إضافة صف إلى الجدول ===
function addToTable() {
    const D1 = document.getElementById("D1").value;
    const D2 = Number(document.getElementById("D2").value);
    const D3 = Number(document.getElementById("D3").value);
    if (!D1 || !D2 || !D3) return;
    Order_Data.push([D1, D2, D3, D2 * D3]);
    updateTable();
}

// === تحديث الجدول ===
function updateTable() {
    const tbody = document.querySelector("#resultsTable tbody");
    tbody.innerHTML = "";
    summ = Order_Data.reduce((sum, row) => sum + Number(row[3]), 0);
    Order_Data.forEach((row, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td>
                        <td class="deleteBtn" onclick="deleteRow(${i})">X</td>`;
        tbody.appendChild(tr);
    });
    updateSummary();
}

// === حذف صف ===
function deleteRow(i) {
    if (confirm("هل أنت متأكد؟")) {
        Order_Data.splice(i, 1);
        updateTable();
    }
}

// === تحديث ملخص الطلب ===
function updateSummary() {
    const D5 = Number(document.getElementById("D5").value || 0);
    const D6 = Number(document.getElementById("D6").value || 0);
    const tbody2 = document.querySelector("#resultsTable2 tbody");
    tbody2.innerHTML = `<tr><td>${summ}</td><td>${D5}</td><td>${D6}</td><td>${summ + D5 - D6}</td></tr>`;
}

// === تحديث ملخص الطلب عند تغيير التوصيل أو الخصم تلقائياً ===
document.getElementById("D5").addEventListener("input", updateSummary);
document.getElementById("D6").addEventListener("input", updateSummary);

// === حفظ الطلب مع الهاتف والعنوان مخفي ===
function sendData() {
    const overlay = document.getElementById("loadingOverlay");
    overlay.style.display = "flex";

    const ClName = document.getElementById("Cl").value;
    const client = clientsData.find(c => c.name === ClName);
    if (!client || Order_Data.length === 0) {
        overlay.style.display = "none";
        alert("اختر العميل وأضف أصناف");
        return;
    }

    const D5 = Number(document.getElementById("D5").value || 0);
    const D6 = Number(document.getElementById("D6").value || 0);
    const totalRequired = summ + D5 - D6;

    const today = new Date();
    const invoiceNumber = 1;

    const orderArray = Order_Data.map(r => ({
        الصنف: r[0],
        الكمية: r[1],
        السعر: r[2],
        الاحمالي: r[3]
    }));

    const postData = {
        sheet: "Accept_OrdersSheet",
        "رقم الفاتورة": invoiceNumber,
        "التاريخ": today.toLocaleDateString(),
        "العميل": client.name,
        "الهاتف": client.phone,
        "العنوان": client.address,
        "ثمن الأصناف": summ,
        "التوصيل": D5,
        "الخصم": D6,
        "المطلوب": totalRequired,
        "مصفوفة الطلب": JSON.stringify(orderArray)
    };

    fetch(scriptURL, {
        method: 'POST',
        body: new URLSearchParams(postData)
    })
    .then(res => res.json())
    .then(d => {
        overlay.style.display = "none";
        if (d.result === "success") {
            alert("تم الحفظ بنجاح");
            Order_Data = [];
            updateTable();
        } else {
            alert("فشل الحفظ: " + d.message);
        }
    })
    .catch(err => {
        overlay.style.display = "none";
        console.error(err);
        alert("حدث خطأ أثناء الإرسال!");
    });
}

// === تهيئة الصفحة ===
loadClients();
loadProductNames();
loadProductPrices();
