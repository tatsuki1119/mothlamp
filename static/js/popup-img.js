$(document).ready(function () {
    const modal = $('#popupimg-modal'); // モーダル
    const normalModalImg = $('#popupimg-modal-img'); // モーダル内の画像
    const protectedImgWrapper = $('#popupimg-modal-protected-img-wrapper'); // モーダル内の画像ラッパー
    const protectedModalImg = $('#popupimg-modal-protected-img'); // モーダル内の保護画像
    const modalOrigLink = $('#popupimg-modal-orig-link'); // 元ポストへのリンク
    const closeSpan = $('#popupimg-modal-close'); // モーダルを閉じるボタン
    const imgs = $('.popupimg-popup-img'); // .popupimg-popup-img クラスの画像
    const wrapper = $('.popupimg-wrapper'); // 外側の div

    // モーダルを開く処理
    function openModal(targetImg) {
        if (targetImg.length) {
            // モーダルを表示
            modal.css({
                'opacity': '1',
                'visibility': 'visible'
            });



            // `protected-img` かどうか
            if (targetImg.hasClass('protected-img')) {
                protectedModalImg.attr('src', targetImg.attr('src')); // protected画像のsrcを更新
                protectedModalImg.css('display', 'block'); // protected画像を表示
                normalModalImg.css('display', 'none'); // 通常画像を非表示
            } else {
                normalModalImg.attr('src', targetImg.attr('src')); // 通常画像のsrcを更新
                normalModalImg.css('display', 'block'); // 通常画像を表示
                protectedModalImg.css('display', 'none'); // protected画像を非表示
            }

            // モーダル内にリンクを反映
            // 兄弟要素から元の投稿リンクを取得
            const origLinkElement = targetImg.siblings('.phanart-popup-orig-link');

            if (origLinkElement.length) {
                // 元の投稿リンクがある場合
                const origLink = origLinkElement.attr('href');
                modalOrigLink.attr('href', origLink).show(); // リンクを設定して表示
            } else {
                // 元の投稿リンクがない場合
                modalOrigLink.hide(); // リンクを非表示
            }

        }
    }

    // 外側のコンテナクリックでモーダルを開く
    wrapper.on('click', function () {
        const targetImg = $(this).find('.popupimg-popup-img'); // コンテナ内の画像を取得
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
