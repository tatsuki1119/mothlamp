$(document).ready(function () {
    // 共通メッセージを定数として定義
    const PROTECT_ALERT_MSG = 'この画像を無断で使用することは禁止されています。\n保存はご遠慮ください。';

    // 右クリックを検出（PC）
    function setupRightClick(element) {
        element.on('contextmenu', function (e) {
            alert(PROTECT_ALERT_MSG);
            e.preventDefault(); // コンテキストメニュー（右クリックメニュー）を表示しない
        });
    }

    // タッチイベントの処理（スマホ）
    let touchTimer;
    function setupTouchEvents(element) {
        element.on('touchstart', function (e) {
            touchTimer = setTimeout(function () {
                alert(PROTECT_ALERT_MSG);
                e.preventDefault(); // 長押し時にタッチイベントを無効化
            }, 500); // 長押しの時間（必要に応じて調整）
        }).on('touchend touchmove touchcancel', function (e) {
            clearTimeout(touchTimer);
        });
    }

    // 保護処理のセットアップを関数化
    function applyProtectionToElements(elements) {
        setupRightClick(elements);
        setupTouchEvents(elements);
    }

    // 初期要素に対して保護処理を設定
    const initialProtectedElements = $('.protected-img, .protected-img-wrapper');
    applyProtectionToElements(initialProtectedElements);

    // MutationObserverを使って動的追加要素にも対応
    const observer = new MutationObserver(function (mutationsList) {
        mutationsList.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const $node = $(node);

                    // 自身または子要素に対象のクラスを持つ要素があるか確認
                    const targets = $node.find('.protected-img, .protected-img-wrapper').addBack('.protected-img, .protected-img-wrapper');
                    if (targets.length > 0) {
                        applyProtectionToElements(targets);
                    }
                }
            });
        });
    });

    // 監視対象のルート要素（body以下を監視）
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
