// 引っ張ってリロード

$(window).on("scroll", function () {
    let threshold = -100; // 引っ張る閾値
    let timeThreshold = 100; // リロードする時間閾値(ms)
    let timeoutId;

    var scrollTop = $(this).scrollTop(); // ウィンドウのスクロール位置を取得

    if (scrollTop < threshold) {
        // リロードまでの時間閾値を超えた場合にリロード
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            $('#loader').show();
            // location.reload(); // ページをリロード
            var href = location.href;
            window.location.href = href;

        }, timeThreshold);
    } else {
        // リロードまでの時間閾値を超える前にスクロールが元に戻った場合にタイマーをクリア
        clearTimeout(timeoutId);
    }
});

$(function () {
    // URL部分に文字を入れる
    // 現在のページのURLを取得
    var currentUrl = window.location.href;
    // URLを指定された要素に置換
    $('.url_area').text(currentUrl);
})

function isPinchZooming() {
    return window.visualViewport.scale > 1
}
