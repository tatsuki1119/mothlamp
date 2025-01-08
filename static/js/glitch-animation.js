// アニメーションのランダムディレイとランダムアニメーション設定

$(document).ready(function () {
    // glitch-text クラスにランダムなアニメーションディレイとアニメーションを適用する関数
    function setRandomGlitchAnimation(element) {
        const randomDelay = Math.random() * 10; // 0〜10秒のランダムなディレイ
        const randomDuration = 10 + Math.random() * 10; // 10〜20秒のランダムな再生時間
        const randomAnimation = `glitch-text-${Math.floor(Math.random() * 10) + 1}`; // 10種類のアニメーションからランダムに選択

        // CSSスタイルを設定
        $(element).css({
            'animation-name': randomAnimation,
            'animation-delay': `${randomDelay}s`,
            'animation-duration': `${randomDuration}s`,
            'animation-iteration-count': 'infinite'
        });
    }

    // 初期表示されている .glitch-text 要素にランダムなアニメーションとディレイを設定
    $('.glitch-text').each(function () {
        setRandomGlitchAnimation(this);
    });

    // 非同期のDOM変化を監視して、要素が追加された場合にも処理を実行
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0) {
                // 新たに追加された .glitch-text 要素にランダムなアニメーションとディレイを適用
                $(mutation.addedNodes).each(function () {
                    if ($(this).hasClass('glitch-text')) {
                        setRandomGlitchAnimation(this);
                    }
                    // 子孫要素に .glitch-text がある場合も含めてランダムアニメーションとディレイを適用
                    $(this).find('.glitch-text').each(function () {
                        setRandomGlitchAnimation(this);
                    });
                });
            }
        });
    });

    // 監視する対象ノード（body）とオプションを設定
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
