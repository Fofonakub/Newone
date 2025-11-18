// final.js
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("finalCanvas");
  const ctx = canvas.getContext("2d");

  const W = canvas.width;
  const H = canvas.height;

  // ดึงรูปจาก localStorage
  const keys = ["pic1", "pic2", "pic3", "pic4"];

  function loadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }

Promise.all([
  ...keys.map(k => loadImage(localStorage.getItem(k))),
  loadImage("Mymelodyypic/Polaroid4.png")  // กรอบ
]).then(results => {
  const images = results.slice(0, 4);   // รูป 1–4
  const frameImg = results[4];          // กรอบ

  const W = canvas.width;
  const H = canvas.height;

  // เคลียร์ + พื้นหลังขาว
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // ✨ ขนาดรูปให้พอดีช่องขาว (เล็กกว่าช่องนิดหน่อย)
  const slotW = 285;  // กว้าง 250px
  const slotH = 435;  // สูง 410px

  // ตำแหน่ง 4 ช่อง (วัดจากไฟล์กรอบมาให้แล้ว)
  const positions = [
    { x: 43,  y:  30 },  // ซ้ายบน
    { x: 320, y:  30 },  // ขวาบน
    { x: 43,  y: 493 },  // ซ้ายล่าง
    { x: 320, y: 493 },  // ขวาล่าง
  ];

  // 1) วาด "รูป" ลงไปก่อน ให้เต็มช่องขาว
images.forEach((img, i) => {
  if (!img) return;
  const { x, y } = positions[i];

  const iw = img.width;
  const ih = img.height;

  const slotR = slotW / slotH;   // อัตราส่วนของช่อง
  const imgR  = iw / ih;         // อัตราส่วนของรูปจริง

  let sx, sy, sw, sh;

  if (imgR > slotR) {
    // รูป "กว้าง" กว่าช่อง → ตัดข้างซ้ายขวาออก
    sh = ih;
    sw = ih * slotR;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    // รูป "สูง" กว่าช่อง → ตัดบนล่างออก
    sw = iw;
    sh = iw / slotR;
    sx = 0;
    sy = (ih - sh) / 2;
  }

  // วาดแบบ crop กลางภาพและ scale ให้พอดีช่อง
  ctx.drawImage(img, sx, sy, sw, sh, x, y, slotW, slotH);
});

  // 2) แล้วค่อยวาด "กรอบ" ทับด้านบนสุด
  if (frameImg) {
    ctx.drawImage(frameImg, 0, 0, W, H);
  }
});


  // ปุ่มดาวน์โหลด
  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "cuteshot.png";
    link.href = canvas.toDataURL();
    link.click();
  });

  // ปุ่มเริ่มใหม่
  const homeBtn = document.getElementById("homeBtn");
  homeBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "upload.html";
  });
});
