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



const table = document.getElementById("ClientsTable");
const tbody = table.querySelector("tbody");
const ClientsList = JSON.parse(localStorage.getItem("Clients_LD"));

// رسم الجدول
function renderTable() {
  tbody.innerHTML = ClientsList.map((item, index) => `
    <tr>
      <td>${item[0]}</td>
      <td>${item[1]}</td>
      <td>${item[2]}</td>
      <td class="deleteBtn" onclick="deleteRow(this)">X</td>
    </tr>
  `).join('');
}

renderTable();


  function addToClientsTable(){
    
    let C1 =document.getElementById("C1").value;
    let C2 =document.getElementById("C2").value;
    let C3 =document.getElementById("C3").value;
    if (C1 === "" || C2 === "") {
    alert("من فضلك املأ جميع الحقول");
    return;
    }

    if (!/^(010|011|012|015)[0-9]{8}$/.test(C3)) {
    alert("تأكد من صحة رقم الهاتف");
    return;
}

    ClientsList.push([C1,C2,C3])

    let tbody = document.querySelector("#ClientsTable tbody");
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${C1}</td>
      <td>${C2}</td>
      <td>${C3}</td>
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
        ClientsList.splice(index, 1); // حذف الصف من المصفوفة
        row.remove();

    } 
    
  }

  function sendClientsData() {

    localStorage.setItem("Clients_LD", JSON.stringify(ClientsList));
    alert("تم الحفظ بنجاح");

  }
