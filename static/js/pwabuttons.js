$(function () {
    // リロードリンクのクリックイベントを監視
    $('#reload_btn_a').click(function (e) {
        e.preventDefault(); // デフォルトのリンク動作をキャンセル
        // location.reload(); // ページをリロード(ハードリロード?)
        let href = location.href;
        window.location.href = href;
    });

    // 戻るリンクのクリックイベントを監視
    $('#back_btn_a').click(function (e) {
        if (history.length <= 1) {
            // 戻る履歴がないとき
            e.preventDefault(); // デフォルトのリンク動作をキャンセル
            $('#loader').fadeOut(500);
        } else {
            e.preventDefault(); // デフォルトのリンク動作をキャンセル
            history.back(); // ブラウザの履歴を一つ前に戻る
            $('#loader').fadeOut(500);
        }
    });
});

$(function () {
    // $('.pwa_only').hide();
    // iOSのPWAモードの判定
    let isPwaMode = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    // iOSのPWAモードの場合にのみ項目を表示
    if (isPwaMode) {
        $('.pwa_only').show();
        $('.not_pwa_only').hide();
    }
});
