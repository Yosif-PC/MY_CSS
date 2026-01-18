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
