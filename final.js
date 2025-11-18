// final.js

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("finalCanvas");
  const ctx = canvas.getContext("2d");

  const W = canvas.width;
  const H = canvas.height;

  // ⭐ โหลดรูปจาก localStorage
  const keys = ["pic1", "pic2", "pic3", "pic4"];

  function loadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }

  Promise.all(keys.map(k => loadImage(localStorage.getItem(k))))
    .then(images => {
      // พื้นหลังขาว
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

      // ⭐ ตำแหน่งช่อง 2x2
      const paddingX = 55;
      const paddingY = 90;
      const gapX = 18;
      const gapY = 18;

      const slotW = (W - paddingX * 2 - gapX) / 2;
      const slotH = (H - paddingY * 2 - gapY) / 2;

      const positions = [
        { x: paddingX,                 y: paddingY },
        { x: paddingX + slotW + gapX,  y: paddingY },
        { x: paddingX,                 y: paddingY + slotH + gapY },
        { x: paddingX + slotW + gapX,  y: paddingY + slotH + gapY },
      ];

      // ⭐ วาดรูปแบบ object-fit: cover
      images.forEach((img, i) => {
        if (!img) return;
        const { x, y } = positions[i];

        const iw = img.width;
        const ih = img.height;

        const slotR = slotW / slotH;
        const imgR  = iw / ih;

        let sx, sy, sw, sh;

        if (imgR > slotR) {
          // รูปกว้างเกิน → ตัดซ้ายขวา
          sh = ih;
          sw = ih * slotR;
          sx = (iw - sw) / 2;
          sy = 0;
        } else {
          // รูปสูงเกิน → ตัดบนล่าง
          sw = iw;
          sh = iw / slotR;
          sx = 0;
          sy = (ih - sh) / 2;
        }

        // วาดครอปกลางภาพ
        ctx.drawImage(img, sx, sy, sw, sh, x, y, slotW, slotH);
      });

      // ⭐ วาดกรอบทับด้านบน
      const frameImg = new Image();
      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, W, H);
      };
      frameImg.src = "Mymelodyypic/Polaroid4.png"; 
      // ⬆ เปลี่ยนชื่อให้ตรงกับไฟล์กรอบของคุณ
    });

  // ⭐ ปุ่ม Download
  document.getElementById("downloadBtn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "cuteshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // ⭐ ปุ่ม Restart
  document.getElementById("homeBtn").addEventListener("click", () => {
    localStorage.removeItem("pic1");
    localStorage.removeItem("pic2");
    localStorage.removeItem("pic3");
    localStorage.removeItem("pic4");
    window.location.href = "upload.html";  
    // ⬆ ถ้าไฟล์เลือกภาพชื่ออื่น เช่น index.html ให้แก้ตรงนี้
  });
});
