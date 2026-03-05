(function () {
  const bg = document.getElementById("bg-gradient");
  if (!bg) return;

  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    bg.style.background = `radial-gradient(
      circle at ${x}% ${y}%,
      #ffffff,
      #ffe4f2,
      #d8f3ff,
      #fff7c2
    )`;
  });
})();

(function () {
  const container = document.getElementById("sakura-container");
  if (!container) return;

  const SAKURA_COUNT = 150;
  const sakuras = [];
  let mouseX = -1000;
  let mouseY = -1000;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // 桜生成
  for (let i = 0; i < SAKURA_COUNT; i++) {
    const sakura = document.createElement("div");
    sakura.classList.add("sakura");

    const size = Math.random() * 10 + 8;

    const shape = Math.random();
    if (shape < 0.33) sakura.style.borderRadius = "50% 70% 50% 70%";
    else if (shape < 0.66) sakura.style.borderRadius = "70% 50% 70% 50%";
    else sakura.style.borderRadius = "60% 40% 70% 50%";

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    const speed = Math.random() * 1 + 0.5;

    sakura.style.width = size + "px";
    sakura.style.height = size + "px";

    container.appendChild(sakura);

    sakuras.push({
      el: sakura,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: speed,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      size
    });
  }

  let t = 0;

  function animate() {
    t += 0.01;
    const windX = Math.sin(t) * 0.6 + Math.sin(t * 0.3) * 0.4;

    // ★ 桜同士の衝突判定（軽量版）
    for (let i = 0; i < sakuras.length; i++) {
      for (let j = i + 1; j < sakuras.length; j++) {
        const a = sakuras[i];
        const b = sakuras[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (a.size + b.size) * 0.6;

        if (dist < minDist) {
          const force = (minDist - dist) / minDist;

          const nx = dx / dist;
          const ny = dy / dist;

          a.vx += nx * force * 0.5;
          a.vy += ny * force * 0.5;

          b.vx -= nx * force * 0.5;
          b.vy -= ny * force * 0.5;
        }
      }
    }

    sakuras.forEach((s) => {
      const dx = s.x - mouseX;
      const dy = s.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        const force = (120 - dist) / 120;
        s.vx += (dx / dist) * force * 2;
        s.vy += (dy / dist) * force * 2;
      }

      s.vx += windX * 0.05;
      s.vy += 0.02;

      s.vx *= 0.96;
      s.vy *= 0.96;

      s.x += s.vx;
      s.y += s.vy;

      s.rot += s.rotSpeed;

      if (s.y > window.innerHeight) {
        s.y = -20;
        s.x = Math.random() * window.innerWidth;
        s.vx = (Math.random() - 0.5) * 0.5;
        s.vy = Math.random() * 1 + 0.5;
      }

      s.el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`;
    });

    requestAnimationFrame(animate);
  }

  animate();
})();

(function () {
  const container = document.getElementById("sakura-container");
  const ground = document.getElementById("sakura-ground");
  if (!container || !ground) return;

  const SAKURA_COUNT = 150;
  const sakuras = [];
  const groundSakura = []; // ★ 積もった桜を管理
  let mouseX = -1000;
  let mouseY = -1000;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // 桜生成
  for (let i = 0; i < SAKURA_COUNT; i++) {
    const sakura = document.createElement("div");
    sakura.classList.add("sakura");

    const size = Math.random() * 10 + 8;

    const shape = Math.random();
    if (shape < 0.33) sakura.style.borderRadius = "50% 70% 50% 70%";
    else if (shape < 0.66) sakura.style.borderRadius = "70% 50% 70% 50%";
    else sakura.style.borderRadius = "60% 40% 70% 50%";

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    const speed = Math.random() * 1 + 0.5;

    sakura.style.width = size + "px";
    sakura.style.height = size + "px";

    container.appendChild(sakura);

    sakuras.push({
      el: sakura,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: speed,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      size,
      landed: false
    });
  }

  let t = 0;

  function animate() {
    t += 0.01;
    const windX = Math.sin(t) * 0.6 + Math.sin(t * 0.3) * 0.4;

    // 落下中の桜の衝突判定
    for (let i = 0; i < sakuras.length; i++) {
      for (let j = i + 1; j < sakuras.length; j++) {
        const a = sakuras[i];
        const b = sakuras[j];

        if (a.landed || b.landed) continue;

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (a.size + b.size) * 0.6;

        if (dist < minDist) {
          const force = (minDist - dist) / minDist;
          const nx = dx / dist;
          const ny = dy / dist;

          a.vx += nx * force * 0.5;
          a.vy += ny * force * 0.5;
          b.vx -= nx * force * 0.5;
          b.vy -= ny * force * 0.5;
        }
      }
    }

    sakuras.forEach((s) => {
      if (!s.landed) {
        // マウス反発
        const dx = s.x - mouseX;
        const dy = s.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const force = (120 - dist) / 120;
          s.vx += (dx / dist) * force * 2;
          s.vy += (dy / dist) * force * 2;
        }

        // 風
        s.vx += windX * 0.05;
        s.vy += 0.02;

        s.vx *= 0.96;
        s.vy *= 0.96;

        s.x += s.vx;
        s.y += s.vy;

        s.rot += s.rotSpeed;

        // ★ 地面に到達 → 積もる
        if (s.y > window.innerHeight - 120) {
          s.landed = true;

          const groundItem = document.createElement("div");
          groundItem.classList.add("sakura-ground-item");
          groundItem.style.width = s.size + "px";
          groundItem.style.height = s.size + "px";
          groundItem.style.left = s.x + "px";
          groundItem.style.bottom = Math.random() * 100 + "px";

          ground.appendChild(groundItem);

          // ★ 積もった桜も物理オブジェクトとして管理
          groundSakura.push({
            el: groundItem,
            x: s.x,
            y: window.innerHeight - (Math.random() * 100 + 20),
            vx: 0,
            vy: 0,
            size: s.size
          });

          s.el.remove();
          return;
        }

        s.el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`;
      }
    });

    // ★ 積もった桜もマウスで動く
    groundSakura.forEach((g) => {
      const dx = g.x - mouseX;
      const dy = g.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        const force = (80 - dist) / 80;
        g.vx += (dx / dist) * force * 1.5;
        g.vy += (dy / dist) * force * 1.5;
      }

      // 摩擦でゆっくり止まる
      g.vx *= 0.9;
      g.vy *= 0.9;

      g.x += g.vx;
      g.y += g.vy;

      g.el.style.transform = `translate(${g.x}px, ${g.y - (window.innerHeight - 120)}px)`;
    });

    requestAnimationFrame(animate);
  }

  animate();
})();
