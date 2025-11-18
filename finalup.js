// final.js  📌 (อัปเดตใหม่) 
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("finalCanvas");
  const ctx = canvas.getContext("2d");

  const W = canvas.width;
  const H = canvas.height;

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
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

     
      const paddingX = 42;
      const paddingY = 15;
      const gapX = 10;
      const gapY = 14;

      const slotW = (W - paddingX * 2 - gapX) / 2;
      const slotH = slotW * 1.7;

      const positions = [
        { x: paddingX, y: paddingY },
        { x: paddingX + slotW + gapX, y: paddingY },
        { x: paddingX, y: paddingY + slotH + gapY },
        { x: paddingX + slotW + gapX, y: paddingY + slotH + gapY },
      ];

      // ⭐ วาดแบบ object-fit: cover (เต็มกรอบ ไม่ยืด)
      images.forEach((img, i) => {
        if (!img) return;

        const { x, y } = positions[i];

        const iw = img.width;
        const ih = img.height;

        const slotR = slotW / slotH;
        const imgR = iw / ih;

        let sx, sy, sw, sh;

        if (imgR > slotR) {
          // รูปกว้างเกิน → ครอปด้านข้าง
          sh = ih;
          sw = ih * slotR;
          sx = (iw - sw) / 2;
          sy = 0;
        } else {
          // รูปสูงเกิน → ครอปด้านบนล่าง
          sw = iw;
          sh = iw / slotR;
          sx = 0;
          sy = (ih - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, x, y, slotW, slotH);
      });

      // ⭐ ใส่กรอบทับด้านบน
      const frame = new Image();
      frame.onload = () => {
        ctx.drawImage(frame, 0, 0, W, H);
      };
      frame.src = "Mymelodyypic/Polaroid4.png";
    });

  // Download
  document.getElementById("downloadBtn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "cuteshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // Restart
  document.getElementById("homeBtn").addEventListener("click", () => {
    localStorage.removeItem("pic1");
    localStorage.removeItem("pic2");
    localStorage.removeItem("pic3");
    localStorage.removeItem("pic4");
    window.location.href = "upload.html";
  });
});
