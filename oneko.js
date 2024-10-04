(function oneko() {
    const nekoEl = document.createElement("div");

    let nekoPosX = 32;
    let nekoPosY = 32;

    let mousePosX = 0;
    let mousePosY = 0;

    const isReducedMotion =
      window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
      window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReducedMotion) {
      return;
    }

    function init() {
        nekoEl.id = "oneko";
        nekoEl.ariaHidden = true;
        nekoEl.style.width = "32px";
        nekoEl.style.height = "32px";
        nekoEl.style.position = "fixed";
        nekoEl.style.pointerEvents = "none";
        nekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')";
        nekoEl.style.imageRendering = "pixelated";
        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
        nekoEl.style.zIndex = Number.MAX_VALUE;

        document.body.appendChild(nekoEl);

        document.addEventListener("mousemove", function (event) {
            mousePosX = event.clientX;
            mousePosY = event.clientY;
        });

        window.requestAnimationFrame(onAnimationFrame);
    }

    let lastFrameTimestamp;

    function onAnimationFrame(timestamp) {
        if (!nekoEl.isConnected) {
            return;
        }
        if (!lastFrameTimestamp) {
            lastFrameTimestamp = timestamp;
        }
        if (timestamp - lastFrameTimestamp > 50) { // Reduced frame update interval for smoothness (~20 fps)
            lastFrameTimestamp = timestamp;
            frame();
        }
        window.requestAnimationFrame(onAnimationFrame);
    }

    function setSprite(name, frame) {
        const spriteSets = {
            idle: [[-3, -3]],
            alert: [[-7, -3]],
            tired: [[-3, -2]],
            N: [[-1, -2], [-1, -3]],
            NE: [[0, -2], [0, -3]],
            E: [[-3, 0], [-3, -1]],
            SE: [[-5, -1], [-5, -2]],
            S: [[-6, -3], [-7, -2]],
            SW: [[-5, -3], [-6, -1]],
            W: [[-4, -2], [-4, -3]],
            NW: [[-1, 0], [-1, -1]],
        };
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    }

    function frame() {
        const diffX = mousePosX - nekoPosX;
        const diffY = mousePosY - nekoPosY;
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);

        const speed = 5; // Moderate speed for smoother following

        if (distance > 1) {
            nekoPosX += (diffX / distance) * speed;
            nekoPosY += (diffY / distance) * speed;
        }

        let direction = "";
        if (Math.abs(diffY) > Math.abs(diffX)) {
            direction += diffY < 0 ? "N" : "S";
        }
        if (Math.abs(diffX) > Math.abs(diffY)) {
            direction += diffX < 0 ? "W" : "E";
        }

        setSprite(direction || "idle", frameCount++);
        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
    }

    let frameCount = 0;
    init();
})();
