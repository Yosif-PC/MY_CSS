const cssContent = localStorage.getItem("style.css");
    if (cssContent) {
        // إزالة أي CSS سابق لتجنب التكرار
        const oldStyle = document.getElementById("style.css");
        if (oldStyle) oldStyle.remove();
            
        const style = document.createElement("style");
        style.id = "myStyle";
        style.textContent = cssContent;
        document.head.appendChild(style);

        console.log("تم تطبيق CSS تلقائيًا!");
    } else {
        console.log("لا يوجد CSS محفوظ");
    }



function selectClient(val) {
    document.getElementById("Cl").value = val;
    const index = ClientsList.findIndex(row => row[0] === val);
    document.getElementById("Cl_Phone").value = (index >= 0) ? ClientsList[index][1] || "" : "";
    document.getElementById("Cl_Address").value = (index >= 0) ? ClientsList[index][2] || "" : "";

    closePopup("popup_CL");
}

function selectProduct(val) {
    document.getElementById("D1").value = val;
    const index = ProductList.findIndex(row => row[0] === val);
    document.getElementById("D3").value = (index >= 0) ? ProductList[index][1] || 0 : 0;
    closePopup("popup_D1");

    

    
}

function attachButtons(listContainer, type) {
    const buttons = listContainer.querySelectorAll(".item-btn");
    buttons.forEach(btn => {
        btn.onclick = null;
        btn.addEventListener("click", function () {
            const val = this.innerText.trim();
            if (type === 'CL') selectClient(val);
            else if (type === 'Pr') selectProduct(val);
        });
    });
}

const ClientsList = JSON.parse(localStorage.getItem("Clients_LD"));

const list_CL = document.getElementById("list_CL");
list_CL.innerHTML = ClientsList.map(p => `<button class="item-btn">${p[0]}</button>`).join('');
attachButtons(list_CL, 'CL');
document.getElementById("Cl").addEventListener("click", () => {
    document.getElementById("popup_CL").style.display = 'flex';});


const ProductList = JSON.parse(localStorage.getItem("Products_LD"));

const list_Pr = document.getElementById("list_D1");
list_Pr.innerHTML = ProductList.map(p => `<button class="item-btn">${p[0]}</button>`).join('');
attachButtons(list_Pr, 'Pr');



document.getElementById("Cl").addEventListener("click", () => {
    document.getElementById("popup_CL").style.display = 'flex';});

document.getElementById("D1").addEventListener("click", () => {
    document.getElementById("popup_D1").style.display = 'flex';
});



// === إغلاق Popup عند الضغط خارج المحتوى ===
document.querySelectorAll(".popup").forEach(p => {
    p.addEventListener("click", e => {
        if (e.target === p) closePopup(p.id);
    });
});
function closePopup(id) {
    const p = document.getElementById(id);
    p.style.display = "none";
    p.hidden = true;}


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





let Order_Data = [];
let summ = 0;


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




function sendData() {
    
    

    const D5 = Number(document.getElementById("D5").value || 0);
    const D6 = Number(document.getElementById("D6").value || 0);
    const totalRequired = summ + D5 - D6;

    const today = new Date();
    
    


    const The_Order = JSON.parse(localStorage.getItem("Orders_LD"))||[];
    const invoiceNumber = The_Order.length + 1;
    document.getElementById("invoice").textContent = "فاتورة رقم : " + invoiceNumber;

    The_Order.push(
    [
        invoiceNumber,
        today.toLocaleDateString(),
        document.getElementById("Cl").value,
        document.getElementById("Cl_Phone").value,
        document.getElementById("Cl_Address").value,
        summ,
        D5,
        D6,
        totalRequired,
        Order_Data]);

    localStorage.setItem("Orders_LD", JSON.stringify(The_Order));




}
