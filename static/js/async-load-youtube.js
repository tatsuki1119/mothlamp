$(document).ready(function () {
    // YouTube Shorts の埋め込み処理を行う関数
    function initializeYouTubeShorts() {
        const $links = $('a.yt-shorts-data'); // 対象の<a>要素を取得

        // IntersectionObserverで可視範囲に入った際の処理
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const $link = $(entry.target);
                    let videoUrl = $link.attr('href'); // 元の<a>のURLを取得
                    let videoId = '';

                    // Shorts URL から動画IDを抽出
                    const match = videoUrl.match(/shorts\/([a-zA-Z0-9_-]+)/);
                    if (match) {
                        videoId = match[1];
                    }

                    if (videoId) {
                        // <iframe> 要素を作成
                        const iframe = $('<iframe>', {
                            src: `https://www.youtube.com/embed/${videoId}`,
                            frameborder: 0,
                            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                            referrerpolicy: "strict-origin-when-cross-origin",
                            allowfullscreen: true
                        });

                        // ローディング表示用の要素
                        const loadingDiv = $(`
                        <div class="list-loading">
                            <svg role="img" aria-label="ロード中">
                                <use href="#butterfly"></use>
                            </svg>
                            Loading...
                            <svg role="img" aria-label="ロード中">
                                <use href="#butterfly"></use>
                            </svg>
                        </div>
                    `);

                        // <iframe> を .yt-container に挿入
                        const $container = $link.closest('.yt-shorts-container');
                        $container.append(loadingDiv);
                        setTimeout(() => {
                            loadingDiv.remove(); // ローディング削除
                            $container.append(iframe);
                        }, 1000);

                        // 元の<a>要素を削除
                        $link.remove();
                    }

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
    initializeYouTubeShorts();

    // 非同期更新に対応するためにMutationObserverを設定
    const mutationObserver = new MutationObserver(() => {
        initializeYouTubeShorts(); // 再初期化
    });

    mutationObserver.observe(document.body, {
        childList: true,       // 子ノードの追加/削除を監視
        subtree: true          // サブツリーも監視
    });
});
