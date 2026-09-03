$(function () {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const pid =
        params.get(
            "pid"
        );

    if (!pid) {

        showFancamPageMessage(
            "ページが指定されていません。"
        );

        return;
    }

    loadFancamPage(
        pid
    );
});


async function loadFancamPage(pid) {

    try {

        const response =
            await fetch(
                `${FancamPublic.getApiBase()}/page?pid=${encodeURIComponent(pid)}`,
                {
                    cache: "no-store"
                }
            );

        if (
            response.status === 404
        ) {

            showFancamPageMessage(
                "指定されたFancamページは存在しません。"
            );

            return;
        }

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        if (
            data.status === "private" ||
            data.status === "revision" ||
            data.status === "ng"
        ) {

            showFancamPageMessage(
                data.message
            );

            return;
        }

        renderFancamPage(
            data
        );

    } catch (error) {

        console.error(
            error
        );

        showFancamPageMessage(
            "Fancamページを取得できませんでした。"
        );
    }
}


function renderFancamPage(page) {

    const container =
        document.getElementById(
            "fancam-page"
        );

    container.innerHTML =
        "";


    const postsBlock =
        document.getElementById(
            "fancam-posts-block"
        );

    const postsGrid =
        document.getElementById(
            "fancam-detail-post-grid"
        );


    if (postsBlock) {
        postsBlock.style.display =
            "none";
    }

    if (postsGrid) {
        postsGrid.innerHTML =
            "";
    }


    if (
        page.status === "reported"
    ) {

        container.appendChild(
            FancamPublic.createStatusWarning(
                page.message ||
                "この投稿は通報を受け、現在管理者が内容を確認しています。"
            )
        );
    }

    const pageBlock =
        document.createElement(
            "div"
        );

    pageBlock.className =
        "contents_block";

    const title =
        document.createElement(
            "h1"
        );

    title.className =
        "glitch-text";

    title.textContent =
        page.title;

    pageBlock.appendChild(
        title
    );

    if (page.description) {

        const description =
            document.createElement(
                "p"
            );

        description.textContent =
            page.description;

        description.style.whiteSpace =
            "pre-wrap";

        pageBlock.appendChild(
            description
        );
    }

    const meta =
        document.createElement(
            "p"
        );

    meta.className =
        "block-description";

    meta.textContent =
        `${page.urls.length}件 / 更新 ${FancamPublic.formatUtcDate(page.updated_at)}`;

    pageBlock.appendChild(
        meta
    );

    pageBlock.appendChild(
        FancamPublic.createReportArea(
            FancamPublic.createPageReportButton(
                page.pid,
                page.title
            )
        )
    );

    container.appendChild(
        pageBlock
    );

    if (
        !page.urls ||
        page.urls.length === 0
    ) {

        const block =
            document.createElement(
                "div"
            );

        block.className =
            "contents_block";

        const p =
            document.createElement(
                "p"
            );

        p.textContent =
            "現在表示できるFancamはありません。";

        block.appendChild(
            p
        );

        container.appendChild(
            block
        );

        return;
    }

    postsGrid.innerHTML =
        "";

    postsBlock.style.display =
        "";


    let hasTweet =
        false;


    for (const item of page.urls) {

        const block =
            document.createElement(
                "div"
            );

        block.className =
            "fancam-detail-post-grid-item";


        if (item.blocked) {

            const blocked =
                document.createElement(
                    "div"
                );

            blocked.className =
                "fancam-blocked-post";


            const message =
                document.createElement(
                    "p"
                );

            message.textContent =
                item.message ||
                "このポストは不適切な内容のため非表示になりました。";


            blocked.appendChild(
                message
            );

            block.appendChild(
                blocked
            );

            postsGrid.appendChild(
                block
            );

            continue;
        }


        const tags =
            FancamPublic.createTags(
                item.tags
            );

        if (tags) {
            block.appendChild(
                tags
            );
        }


        if (item.comment) {

            const comment =
                document.createElement(
                    "p"
                );

            comment.className =
                "fancam-post-comment";

            comment.textContent =
                item.comment;

            comment.style.whiteSpace =
                "pre-wrap";

            block.appendChild(
                comment
            );
        }


        const tweetContainer =
            document.createElement(
                "div"
            );

        tweetContainer.className =
            "tweet-container";


        const tweet =
            document.createElement(
                "blockquote"
            );

        tweet.className =
            "twitter-tweet";


        const link =
            document.createElement(
                "a"
            );

        link.href =
            item.url;


        tweet.appendChild(
            link
        );

        tweetContainer.appendChild(
            tweet
        );

        block.appendChild(
            tweetContainer
        );


        postsGrid.appendChild(
            block
        );

        hasTweet =
            true;
    }


    document.title =
        `${page.title} [誘蛾灯の導き]`;

    if (hasTweet) {
        FancamPublic.loadTwitterWidgets();
    }
}


function showFancamPageMessage(
    message
) {

    const container =
        document.getElementById(
            "fancam-page"
        );

    const postsBlock =
        document.getElementById(
            "fancam-posts-block"
        );

    const postsGrid =
        document.getElementById(
            "fancam-detail-post-grid"
        );


    if (postsBlock) {
        postsBlock.style.display =
            "none";
    }

    if (postsGrid) {
        postsGrid.innerHTML =
            "";
    }


    FancamPublic.showMessage(
        container,
        message
    );
}
