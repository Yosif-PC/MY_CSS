function Save_image_From_URL(Image_URL, Image_Name) {
    if (localStorage.getItem(Image_Name)) return;
    
fetch(Image_URL)
    .then(res => res.blob())
    .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem(Image_Name, reader.result); // حفظ فقط
            console.log("تم حفظ الصورة فقط ✅");
        };
        reader.readAsDataURL(blob);
    })
    .catch(err => {
        console.error("فشل تحميل الصورة ❌", err);
    });

}


function Save_content_From_URL(Data_URL, Data_Name){
    if (localStorage.getItem(Data_Name)) return;

fetch(Data_URL)
    .then(res => res.blob())
    .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem(Data_Name, reader.result); // حفظ فقط
            console.log("تم حفظ  فقط ✅");
        };
        reader.readAsDataURL(blob);
    })
    .catch(err => {
        console.error("فشل تحميل  ❌", err);
    });


}


Save_content_From_URL("https://raw.githubusercontent.com/Yosif-PC/MY_CSS/main/style.css","A1");


Save_image_From_URL("https://raw.githubusercontent.com/Yosif-PC/MY_CSS/main/Home_Logo.png","My_Logo");

