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



const table = document.getElementById("ProductsTable");
const tbody = table.querySelector("tbody");
const ProductsList = JSON.parse(localStorage.getItem("Products_LD"));

// رسم الجدول
function renderTable() {
  tbody.innerHTML = ProductsList.map((item) => `
    <tr>
      <td>${item[0]}</td>
      <td>${item[1]}</td>
      <td class="deleteBtn" onclick="deleteRow(this)">X</td>
    </tr>
  `).join('');
}

renderTable();


  function addToProductsTable(){

    let P1 =document.getElementById("P1").value;
    let P2 =document.getElementById("P2").value;
    if (P1 === "" || P2 === "") {
    alert("من فضلك املأ جميع الحقول");
    return;
    }

    if (isNaN(P2) || Number(P2) <= 0) {
    alert("تأكد من صحة سعر الصنف");
    return;
}

    ProductsList.push([P1,P2])

    let tbody = document.querySelector("#ProductsTable tbody");
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${P1}</td>
      <td>${P2}</td>
      <td class="deleteBtn" onclick="deleteRow(this)">X</td>
    `;
    tbody.appendChild(row);
    
  }

   function deleteRow(el) {

    // رسالة التأكيد
    let result = confirm("هل أنت متأكد؟");

    if(result) {
        // المستخدم ضغط OK → نفذ الأمر
        let row = el.parentNode;
        let index = Array.from(row.parentNode.children).indexOf(row);
        ProductsList.splice(index, 1); // حذف الصف من المصفوفة
        row.remove();

    } 
    
  }

  function sendProductsData() {
    localStorage.setItem("Products_LD", JSON.stringify(ProductsList));
    alert("تم الحفظ بنجاح");
  }
