// ロード画面

// http://~~~?p=xxx のとき phantom-siita/pages/xxx.html を読み込み
// #contents の中身を置換する
// ページの読み込みを有効化する場合 data-load_page="true" とする
// <script src="/static/js/loading.js" data-load_page="true"></script>

// 読み込むHTML内に
// <div id="page-title" style="display: none;">title</div>
// と記載すると title を置換する

var load_page = $("script[src*='loading-ps.js']").attr("data-load_page");

$(function () {
    if (load_page == "true") {
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var pathQuery = urlParams.get('p');

        if (pathQuery) {
            console.log(pathQuery)
            var path = pathQuery.replace(/\./g, '/');
            var noCacheUrl = "/pages/" + path + ".html?nocache=" + new Date().getTime();
            $.get(noCacheUrl)
                .done(function (data) {
                    $("#contents").html(data);

                    // 読み込んだHTMLからタイトルを取得してページタイトルに反映
                    var newTitle = $("#contents").find("#page-title").text();
                    if (newTitle) {
                        document.title = newTitle;
                    }

                })
                .fail(function () {
                    $.get("/pages/404.html", function (data) {
                        $("#contents").html(data);
                    });
                });
        }
    }
    $('#loader').fadeOut(500);
    $('#main').fadeIn(800);
})

$(function () {
    // フォームが Submit されたときの処理
    $('form').submit(function (event) {
        // ロード画面を表示
        $('#loader').show();

        // 一定時間後にロード画面を非表示にする
        setTimeout(function () {
            $('#loader').fadeOut(500);
        }, 100000); // ms
    });
    // <a> タグがクリックされたときの処理
    $('a').click(function (event) {
        var href = $(this).attr('href');
        // ロード画面にしない対象
        if (
            href.startsWith('#')
            || href.startsWith('javascript:')
        ) {
            return; // 処理を中断して終了
        }

        // ロード画面を表示
        $('#loader').show();

        // 一定時間後にロード画面を非表示にする
        setTimeout(function () {
            $('#loader').fadeOut(500);
        }, 10000); // ms

        // クリックされたリンクのURLに遷移
        window.location.href = href;

        event.preventDefault(); // デフォルトのリンク遷移をキャンセル
    });

    // 戻った時にロード画面を消す
    $(window).on('pageshow', function (event) {
        if (event.originalEvent.persisted) {
            $('#loader').fadeOut(500);
        }
    });
});


