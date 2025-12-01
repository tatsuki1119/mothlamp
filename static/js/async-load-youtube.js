$(document).ready(function () {

    // ▼ 共通 YouTube埋め込み関数（動画 / Shorts / Music 共通）
    function initializeYouTubeEmbeds() {

        // 未処理の .yt-container を取得
        const $containers = $('.yt-container').not('[data-yt-processed]');

        // IntersectionObserver
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                const $container = $(entry.target);

                // ▼ 内部リンク取得（動画 / Shorts / Music）
                const $link =
                    $container.find('a.yt-video-data, a.yt-shorts-data, a.yt-music-data').first();

                if (!$link.length) {
                    observer.unobserve(entry.target);
                    return;
                }

                const href = $link.attr('href') || '';
                let videoId = '';

                // ======================================================
                // ▼ 種類ごとにクラス追加（ここが今回の追加ポイント）
                // ======================================================
                if ($link.hasClass('yt-video-data')) {
                    $container.addClass('yt-video-container');
                } else if ($link.hasClass('yt-shorts-data')) {
                    $container.addClass('yt-shorts-container');
                } else if ($link.hasClass('yt-music-data')) {
                    $container.addClass('yt-music-container');
                }

                // ======================================================
                // ▼ ID 抽出（Shorts だけ専用、それ以外は共通）
                // ======================================================
                if ($link.hasClass('yt-shorts-data')) {

                    const matchShorts = href.match(/shorts\/([a-zA-Z0-9_-]+)/);
                    if (matchShorts) videoId = matchShorts[1];

                } else {

                    // youtu.be
                    const matchShort = href.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
                    if (matchShort) videoId = matchShort[1];

                    // watch?v=
                    if (!videoId) {
                        const matchWatch = href.match(/[?&]v=([a-zA-Z0-9_-]+)/);
                        if (matchWatch) videoId = matchWatch[1];
                    }
                }

                // ▼ iframe 埋め込み
                if (videoId) {

                    // ▼ ▼ ▼ ここに追加（Music だけ controls 非表示） ▼ ▼ ▼
                    let embedUrl = `https://www.youtube.com/embed/${videoId}`;

                    // music のときは操作ボタンを隠す
                    if ($link.hasClass('yt-music-data')) {
                        embedUrl += `?controls=0&modestbranding=1&rel=0&fs=0`;
                    }
                    // ▲ ▲ ▲ 追加ここまで ▲ ▲ ▲

                    const iframe = $('<iframe>', {
                        src: embedUrl, // ← 変更点
                        frameborder: 0,
                        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                        referrerpolicy: "strict-origin-when-cross-origin",
                        allowfullscreen: true
                    });

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

                    $container.append(loadingDiv);

                    setTimeout(() => {
                        loadingDiv.remove();
                        $container.append(iframe);
                    }, 1000);

                    $link.remove();
                }

                $container.attr('data-yt-processed', '1');
                observer.unobserve(entry.target);

            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.25
        });

        // ▼ 監視開始
        $containers.each(function () {
            observer.observe(this);
        });
    }

    // 初期ロード
    initializeYouTubeEmbeds();

    // 動的追加にも対応
    const mutationObserver = new MutationObserver(() => {
        initializeYouTubeEmbeds();
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});
