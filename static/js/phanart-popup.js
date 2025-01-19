$(document).ready(function () {
    const modal = $('#phanart-modal');          // モーダル
    const modalImg = $('#phanart-modal-img');  // モーダル内の画像
    const imgs = $('.phanart-popup-img');              // .phanart-popup-img クラスの画像
    const wrapper = $('.phanart-wrapper'); // 外側の div
    const closeSpan = $('#phanart-modal-close'); // モーダルを閉じるボタン

    // モーダルを開く処理
    function openModal(targetImg) {
        if (targetImg.length) {
            // モーダルを表示
            modal.css({
                'opacity': '1',
                'visibility': 'visible'
            });

            // モーダル内に画像を表示
            modalImg.attr('src', targetImg.attr('src'));

            // `protected-img` クラスの場合の特別な処理
            if (targetImg.hasClass('protected-img')) {
                modalImg.css('pointer-events', 'none'); // ポップアップ画像を操作不可にする
            } else {
                modalImg.css('pointer-events', 'auto'); // 通常時は操作可能にする
            }
        }
    }

    // 外側のコンテナクリックでモーダルを開く
    wrapper.on('click', function () {
        const targetImg = $(this).find('.phanart-popup-img'); // コンテナ内の画像を取得
        openModal(targetImg);
    });

    // 画像クリックでモーダルを開く
    imgs.on('click', function (e) {
        e.stopPropagation(); // コンテナのクリックイベントが重複しないように停止
        const targetImg = $(this); // クリックした画像を取得
        openModal(targetImg);
    });

    // クローズボタンを押したらモーダルを閉じる
    closeSpan.on('click', function () {
        modal.css({
            'opacity': '0',
            'visibility': 'hidden'
        });
    });

    // 画像以外の部分をクリックしたらモーダルを閉じる
    $(window).on('click', function (event) {
        if ($(event.target).is(modal)) {
            modal.css({
                'opacity': '0',
                'visibility': 'hidden'
            });
        }
    });

    // スクロール時にモーダルを閉じる
    $(window).on('scroll', function () {
        modal.css({
            'opacity': '0',
            'visibility': 'hidden'
        });
    });
});
