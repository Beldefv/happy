document.querySelectorAll('.ani-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const effect = btn.dataset.effect;

        // 既存の効果をリセット
        document.body.className = '';

        // 新しい効果を付与
        document.body.classList.add(effect);
    });
});

document.querySelectorAll('.ani-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const effect = btn.dataset.effect;

        // 既存の効果を消す
        document.body.classList.remove("stars", "glitch", "bg-dark", "bg-space");

        // 新しい効果を付ける
        document.body.classList.add(effect);
    });
});