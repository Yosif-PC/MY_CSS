
//اللوجو
const btn = document.getElementById("B");
const savedImage = localStorage.getItem("Home_Logo.png");
        if (savedImage) {
            btn.style.backgroundImage = `url(${savedImage})`;
}
const cssContent = localStorage.getItem("style.css");
    if (cssContent) {
        // إزالة أي CSS سابق لتجنب التكرار
        const oldStyle = document.getElementById("style.css");
        if (oldStyle) oldStyle.remove();

        const style = document.createElement("style.css");
        style.id = "style.css";
        style.textContent = cssContent;
        document.head.appendChild(style);

        console.log("تم تطبيق CSS تلقائيًا!");
    } else {
        console.log("لا يوجد CSS محفوظ");
    }
