$(function () {
    var btn = $("#menu_btn");
    btn.on("mousedown touchend", function (event) {
        // ボタンクリック、タップ
        event.preventDefault();
        if ($("#menu_list_area").is(":visible")) {
            btn.text("MENU");
        } else {
            btn.text("CLOSE");
        }
        // 表示トグル
        $("#menu_list_area").stop(true, false).fadeToggle();
    });

    var startPos = 0;
    var winScrollTop = 0;
    $(window).on("scroll", function () {
        // スクロール時
        if ($(window).width() < 768) {
            // スマホ表示
            btn.text("MENU");
            $('#menu_list').fadeIn();
            $("#menu_list_area").fadeOut();
        } else {
            // PC表示
            winScrollTop = $(window).scrollTop();
            if (winScrollTop <= 0) {
                // 画面一番上では表示
                $('#menu_list').css({
                    'opacity': '1',
                    'transform': 'translateY(0)',
                    'transition': 'opacity 0s, transform 0s'
                });
            } else if (winScrollTop > startPos) {
                // 下スクロールで消す（フェードアウトと同時に上に移動）
                $('#menu_list').css({
                    'opacity': '0',
                    'transform': 'translateY(-80px)',
                    'transition': '\
                        opacity 0.8s cubic-bezier(.5, 1, .5, 1), \
                         transform 0.8s cubic-bezier(.5, .7, 1, .25) \
                         '
                });
            } else if (winScrollTop < startPos) {
                // 上スクロールで出す（フェードインと同時に元の位置に戻す）
                $('#menu_list').css({
                    'opacity': '1',
                    'transform': 'translateY(0)',
                    'transition': 'opacity 0.4s ease-in, transform 0.4s ease-out'
                });
            }

            startPos = winScrollTop;
        }
    });
})
