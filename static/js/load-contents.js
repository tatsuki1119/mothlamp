// 別HTMLから要素を読み込む
//
// 使い方
//
// jQueryを使用しているため、読み込みが必要
//   例: <script src="https://code.jquery.com/jquery.min.js"></script>
// このファイルを読み込む
//   例: <script src="/static/js/load-contents.js"></script>
// 読み込みたいタグに
//   class="load_content"
// を追加し、読み込むHTMLのパスを
//   data-load_file="xxxx.html"
// のように指定する
//
// 例
//   <div class="load-content" data-loadfile="/header.html"></div>
//
// 読み込みに失敗した場合は赤文字でエラーが表示される
//

$(document).ready(function () {
    function loadContent($element) {
        let filePath = $element.data('loadfile');
        let noCacheUrl = filePath + "?nocache=" + new Date().getTime();
        $.get(noCacheUrl)

        if (!filePath) {
            $element.html('<span style="color: red;">Error: No "loadfile" data attribute found.</span>');
            console.error('Error: No "load_file" data attribute found for element:', $element);
            return;
        }

        $.ajax({
            url: filePath,
            method: 'GET',
            success: function (data) {
                $element.html(data);
            },
            error: function (xhr, status, error) {
                $element.html('<span style="color: red;">Failed to load content from "' + filePath + '". Reason: ' + error + '</span>');
                console.error('Error loading content from "' + filePath + '":', status, error);
            }
        });
    }

    // 初期ロード
    $('.load-content').each(function () {
        loadContent($(this));
    });

    // MutationObserverを使って非同期で追加された要素に対応
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            $(mutation.addedNodes).each(function () {
                if ($(this).hasClass('load-content')) {
                    loadContent($(this));
                }

                // 子孫ノードに対する処理
                $(this).find('.load-content').each(function () {
                    loadContent($(this));
                });
            });
        });
    });

    // DOMの監視を開始
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

