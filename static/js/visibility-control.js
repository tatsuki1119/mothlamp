// 要素の表示/非表示をコントロール

$(document).ready(function () {
    // 初期設定で両方のクラスを非表示にする
    $('.local, .public').hide();

    // 現在のドメイン（ホスト名またはIPアドレス）を取得
    const domain = window.location.hostname;

    // クエリパラメータに "mode=public" があるかをチェック
    const urlParams = new URLSearchParams(window.location.search);
    const isPublicMode = urlParams.get('mode') === 'public';
    const isLocalMode = urlParams.get('mode') === 'local';

    // ドメインとクエリに基づいて表示するクラスを切り替える関数
    function toggleVisibility() {
        if (isPublicMode) {
            $('.public').show();
            // $('.local').hide();
            $('.local').remove();
        } else if (domain === '192.168.3.82' || domain === '140.83.54.211') {
            $('.local').show();
            if (isLocalMode) {
                $('.public').hide();
            }
        } else {
            $('.public').show();
            // $('.local').hide();
            $('.local').remove();
        }
    }

    // 初期表示の設定
    toggleVisibility();

    // 非同期のDOM変化を監視して、要素が追加された場合にも処理を実行
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0) {
                // 非同期で要素が追加された場合も表示を更新
                toggleVisibility();
            }
        });
    });

    // 監視する対象ノード（body）とオプションを設定
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
