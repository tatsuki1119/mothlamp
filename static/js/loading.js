// // ロード画面

// // http://~~~?p=xxx.yyy のとき /pages/xxx/yyy.html を読み込み
// // #contents の中身を置換する
// // ページの読み込みを有効化する場合 data-load_page="true" とする
// // <script src="/static/js/loading.js" data-load_page="true"></script>

// // 読み込むHTML内に
// // <div id="page-title" style="display: none;">new title</div>
// // と記載すると title, meta情報 を置換する
// // <div id="page-description" style="display: none;">new description</div>
// // と記載すると meta情報のdescription を置換する
// // <div id="page-ogimg" style="display: none;">ogimg-path</div>
// // と記載すると ogimgとtwitter img を置換する

// var load_page = $("script[src*='loading.js']").attr("data-load_page");

// $(function () {
//     if (load_page == "true") {

//         var queryString = window.location.search;
//         var urlParams = new URLSearchParams(queryString);
//         var pathQuery = urlParams.get('p');

//         if (pathQuery) {
//             console.log(pathQuery)
//             var path = pathQuery.replace(/\./g, '/');
//             var noCacheUrl = "/pages/" + path + ".html?nocache=" + new Date().getTime();
//             $.get(noCacheUrl)
//                 .done(function (data) {
//                     // ページ内容更新
//                     $("#contents").html(data);

//                     var newTitle = $("#contents").find("#page-title").text();
//                     var newDescription = $("#contents").find("#page-description").text();
//                     var newOgimg = $("#contents").find("#page-ogimg").text();

//                     if (newTitle) {
//                         document.title = newTitle;

//                         $('meta[property="og:title"]').attr("content", newTitle);
//                         $('meta[name="twitter:title"]').attr("content", newTitle);
//                     }

//                     if (newDescription) {
//                         $('meta[name="description"]').attr("content", newDescription);
//                         $('meta[property="og:description"]').attr("content", newDescription);
//                         $('meta[name="twitter:description"]').attr("content", newDescription);
//                     }

//                     if (newOgimg) {
//                         $('meta[property="og:image"]').attr("content", newOgimg);
//                         $('meta[name="twitter:image"]').attr("content", newOgimg);
//                     }

//                 })
//                 .fail(function () {
//                     $.get("/pages/404.html", function (data) {
//                         $("#contents").html(data);
//                         var newTitle = $("#contents").find("#page-title").text();
//                         if (newTitle) {
//                             document.title = newTitle;
//                         }
//                         if ($('meta[name="robots"]').length) {
//                             $('meta[name="robots"]').attr("content", "noindex");
//                         } else {
//                             $("head").append('<meta name="robots" content="noindex">');
//                         }
//                     });
//                 });
//         } else {
//             $.get("/pages/index-page.html?nocache=" + new Date().getTime(), function (data) {
//                 $("#contents").html(data);
//             });
//         }
//     }


//     $('#loader').fadeOut(500);
//     $('#main').fadeIn(500, function () {
//         // アニメーション完了後にアンカータグが指定されていればその位置に移動
//         var hash = window.location.hash; // URLのハッシュ部分を取得
//         if (hash) {
//             var anchor = $(hash); // HTML全体から該当要素を検索
//             console.log(anchor);
//             if (anchor.length) {
//                 $('html, body').animate({
//                     scrollTop: anchor.offset().top - 10
//                 }, 0); // スクロール
//             }
//         }
//     });
// });

// $(function () {
//     // フォームが Submit されたときの処理
//     $('form').submit(function (event) {
//         // ロード画面を表示
//         $('#loader').show();

//         // 一定時間後にロード画面を非表示にする
//         setTimeout(function () {
//             $('#loader').fadeOut(500);
//         }, 100000); // ms
//     });
//     // <a> タグがクリックされたときの処理
//     $('a').click(function (event) {
//         var href = $(this).attr('href');
//         // ロード画面にしない対象
//         if (
//             href.startsWith('#')
//             || href.startsWith('javascript:')
//         ) {
//             return; // 処理を中断して終了
//         }

//         // ロード画面を表示
//         $('#loader').show();

//         // 一定時間後にロード画面を非表示にする
//         setTimeout(function () {
//             $('#loader').fadeOut(500);
//         }, 10000); // ms

//         // クリックされたリンクのURLに遷移
//         window.location.href = href;

//         event.preventDefault(); // デフォルトのリンク遷移をキャンセル
//     });

//     // 戻った時にロード画面を消す
//     $(window).on('pageshow', function (event) {
//         if (event.originalEvent.persisted) {
//             $('#loader').fadeOut(500);
//         }
//     });
// });


var load_page = $("script[src*='loading.js']").attr("data-load_page");

$(function () {
    if (load_page == "true") {

        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var pathQuery = urlParams.get('p');
        if (!pathQuery) {
            pathQuery = "index-page"
        }

        console.log(pathQuery)
        var path = pathQuery.replace(/\./g, '/');
        var noCacheUrl = "/pages/" + path + ".html?nocache=" + new Date().getTime();
        $.get(noCacheUrl)
            .done(function (data) {
                $("#contents").html(data);

                var newTitle = $("#contents").find("#page-title").text();
                var newDescription = $("#contents").find("#page-description").text();
                var newOgimg = $("#contents").find("#page-ogimg").text();

                if (newTitle) {
                    document.title = newTitle;

                    $("head").append('<meta property="og:title" content="' + newTitle + '">');
                    $("head").append('<meta name="twitter:title" content="' + newTitle + '">');
                }

                if (newDescription) {
                    $("head").append('<meta name="description" content="' + newDescription + '">');
                    $("head").append('<meta property="og:description" content="' + newDescription + '">');
                    $("head").append('<meta name="twitter:description" content="' + newDescription + '">');
                }

                if (newOgimg) {
                    $("head").append('<meta property="og:image" content="' + newOgimg + '">');
                    $("head").append('<meta name="twitter:image" content="' + newOgimg + '">');
                }

            })
            .fail(function () {
                $.get("/pages/404.html", function (data) {
                    $("#contents").html(data);
                    var newTitle = $("#contents").find("#page-title").text();
                    if (newTitle) {
                        document.title = newTitle;
                    }

                    $("head").append('<meta name="robots" content="noindex">');
                });
            });

    }

    $('#loader').fadeOut(500);
    $('#main').fadeIn(500, function () {
        var hash = window.location.hash;
        if (hash) {
            var anchor = $(hash);
            console.log(anchor);
            if (anchor.length) {
                $('html, body').animate({
                    scrollTop: anchor.offset().top - 10
                }, 0);
            }
        }
    });
});

$(function () {
    $('form').submit(function (event) {
        $('#loader').show();

        setTimeout(function () {
            $('#loader').fadeOut(500);
        }, 100000);
    });

    $('a').click(function (event) {
        var href = $(this).attr('href');
        if (
            href.startsWith('#')
            || href.startsWith('javascript:')
        ) {
            return;
        }

        $('#loader').show();

        setTimeout(function () {
            $('#loader').fadeOut(500);
        }, 10000);

        window.location.href = href;

        event.preventDefault();
    });

    $(window).on('pageshow', function (event) {
        if (event.originalEvent.persisted) {
            $('#loader').fadeOut(500);
        }
    });
});
