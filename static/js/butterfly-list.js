// class=butterfly-list の中のliにSVGを追加

$(document).ready(function () {
    function addSvgToListItems(listItems) {
        listItems.each(function () {
            if ($(this).find('svg').length === 0) {
                var svgIcon = $('<svg role="img" aria-label="蝶々">' +
                    '<use href="#butterfly"></use>' +
                    '<!-- SVG added by butterfly-list.js -->' +
                    '</svg>');
                $(this).prepend(svgIcon);
            }
        });
    }

    // 初期の <li> 要素に対して処理を実行
    addSvgToListItems($('.butterfly-list li'));

    // MutationObserver の設定
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                const newListItems = $(node).find('.butterfly-list li');
                addSvgToListItems(newListItems); // 新しく追加された要素に処理を実行
            });
        });
    });

    // 監視対象の設定
    observer.observe(document.body, {
        childList: true, // 子ノードの追加・削除を監視
        subtree: true    // サブツリー（子孫要素）の変更も監視
    });
});
