$(document).ready(function () {
    // 非同期に追加された要素も処理する関数
    function initializeTwitterTweets() {
        const $links = $('a.twitter-tweet-data'); // 対象の<a>要素を取得

        // IntersectionObserverで可視範囲に入った際の処理
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const $link = $(entry.target);
                    let tweetUrl = $link.attr('href'); // 元の<a>のURLを取得

                    // URLがx.comの場合、twitter.comに変更
                    if (tweetUrl.startsWith('https://x.com')) {
                        tweetUrl = tweetUrl.replace('https://x.com', 'https://twitter.com');
                    }

                    // 新しい<blockquote>要素を作成
                    const newTweet = $('<blockquote>')
                        .addClass('twitter-tweet') // クラス設定
                        .html(`<a href="${tweetUrl}" style="display: none;">${tweetUrl}</a>`); // 元のリンクを挿入

                    // `<script>`タグと`list-loading`を作成
                    const scriptTag = $('<script>')
                        .attr('async', true)
                        .attr('src', 'https://platform.twitter.com/widgets.js')
                        .attr('charset', 'utf-8');

                    const loadingDiv = $(`
                        <div class="list-loading">
                            <svg role="img" aria-label="リボン">
                                <use href="#butterfly"></use>
                            </svg>
                            Loading...
                            <svg role="img" aria-label="リボン">
                                <use href="#butterfly"></use>
                            </svg>
                        </div>
                    `);

                    // <blockquote>内にloadingとscriptを挿入
                    newTweet.prepend(loadingDiv);
                    newTweet.append(scriptTag);

                    // 元の<a>要素を置き換え
                    $link.replaceWith(newTweet);

                    // 監視解除
                    observer.unobserve(entry.target);
                }
            });
        });

        // 監視対象を追加
        $links.each(function () {
            observer.observe(this);
        });
    }

    // 初期ロード時に実行
    initializeTwitterTweets();

    // 非同期更新に対応するためにMutationObserverを設定
    const mutationObserver = new MutationObserver(() => {
        initializeTwitterTweets(); // 再初期化
    });

    mutationObserver.observe(document.body, {
        childList: true,       // 子ノードの追加/削除を監視
        subtree: true          // サブツリーも監視
    });
});
