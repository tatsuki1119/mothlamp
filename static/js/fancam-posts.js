const FANCAM_POST_PER_PAGE =
    50;

let fancamPosts = [];
let fancamFilteredPosts = [];


$(function () {

    loadFancamPosts();


    $("#apply-filters").on(
        "click",
        function () {
            applyFancamFilters();
        }
    );


    $("#reset-filters").on(
        "click",
        function () {

            $(".filter-toggle")
                .removeClass(
                    "active"
                );

            fancamFilteredPosts =
                fancamPosts;

            FancamPublic.setPageInUrl(
                1
            );

            renderFancamPosts(
                1
            );
        }
    );


    window.addEventListener(
        "popstate",
        function () {

            if (
                fancamFilteredPosts.length > 0 ||
                fancamPosts.length > 0
            ) {

                renderFancamPosts(
                    FancamPublic.getPageFromUrl()
                );
            }
        }
    );
});


async function loadFancamPosts() {

    try {

        const response =
            await fetch(
                `${FancamPublic.getApiBase()}/posts`,
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        fancamPosts =
            data.posts || [];

        fancamFilteredPosts =
            fancamPosts;


        createFancamFilters(
            fancamPosts
        );


        renderFancamPosts(
            FancamPublic.getPageFromUrl()
        );


    } catch (error) {

        console.error(
            error
        );

        $("#fancam-filters").html(
            "<p>絞り込み情報を取得できませんでした。</p>"
        );

        $("#fancam-post-list").html(
            '<div class="contents_block"><p>Fancamポストを取得できませんでした。</p></div>'
        );

        $("#fancam-post-pagination")
            .empty();
    }
}


function createFancamFilters(
    posts
) {

    const genres = {};


    for (const post of posts) {

        for (const tag of post.tags) {

            if (!genres[tag.genre]) {
                genres[tag.genre] =
                    new Set();
            }


            genres[tag.genre].add(
                tag.name
            );
        }
    }


    const container =
        document.getElementById(
            "fancam-filters"
        );

    container.innerHTML =
        "";


    if (
        Object.keys(genres).length === 0
    ) {

        const p =
            document.createElement(
                "p"
            );

        p.textContent =
            "利用できる絞り込み条件はありません。";

        container.appendChild(
            p
        );

        return;
    }


    for (
        const [genre, tags]
        of Object.entries(genres)
    ) {

        const title =
            document.createElement(
                "p"
            );

        title.textContent =
            genre;

        container.appendChild(
            title
        );


        const group =
            document.createElement(
                "div"
            );

        group.className =
            "filter-group";


        for (
            const tagName
            of [...tags].sort()
        ) {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "filter-toggle";

            button.dataset.genre =
                genre;

            button.dataset.tag =
                tagName;

            button.textContent =
                tagName;


            button.addEventListener(
                "click",
                function () {

                    this.classList.toggle(
                        "active"
                    );
                }
            );


            group.appendChild(
                button
            );
        }


        container.appendChild(
            group
        );
    }
}


function applyFancamFilters() {

    const selected = {};


    document
        .querySelectorAll(
            ".filter-toggle.active"
        )
        .forEach(
            function (button) {

                const genre =
                    button.dataset.genre;

                const tag =
                    button.dataset.tag;


                if (!selected[genre]) {
                    selected[genre] = [];
                }


                selected[genre].push(
                    tag
                );
            }
        );


    fancamFilteredPosts =
        fancamPosts.filter(
            function (post) {

                return Object
                    .entries(selected)
                    .every(
                        function (
                            [
                                genre,
                                selectedTags
                            ]
                        ) {

                            const postTags =
                                post.tags
                                    .filter(
                                        function (tag) {
                                            return (
                                                tag.genre ===
                                                genre
                                            );
                                        }
                                    )
                                    .map(
                                        function (tag) {
                                            return tag.name;
                                        }
                                    );


                            return selectedTags.some(
                                function (tag) {
                                    return postTags.includes(
                                        tag
                                    );
                                }
                            );
                        }
                    );
            }
        );


    FancamPublic.setPageInUrl(
        1
    );


    renderFancamPosts(
        1
    );
}


function renderFancamPosts(
    requestedPage
) {

    const container =
        document.getElementById(
            "fancam-post-list"
        );

    let pagination =
        document.getElementById(
            "fancam-post-pagination"
        );


    if (!pagination) {

        pagination =
            document.createElement(
                "div"
            );

        pagination.id =
            "fancam-post-pagination";

        container.insertAdjacentElement(
            "afterend",
            pagination
        );
    }


    container.innerHTML =
        "";

    pagination.innerHTML =
        "";


    const posts =
        fancamFilteredPosts;


    if (posts.length === 0) {

        const block =
            document.createElement(
                "div"
            );

        block.className =
            "fancam-post-grid-empty";


        const p =
            document.createElement(
                "p"
            );

        p.textContent =
            "条件に一致するFancamはありません。";


        block.appendChild(
            p
        );

        container.appendChild(
            block
        );

        return;
    }


    const totalPages =
        Math.ceil(
            posts.length /
            FANCAM_POST_PER_PAGE
        );


    const currentPage =
        Math.min(
            Math.max(
                requestedPage,
                1
            ),
            totalPages
        );


    if (
        currentPage !==
        requestedPage
    ) {

        FancamPublic.setPageInUrl(
            currentPage,
            true
        );
    }


    const start =
        (
            currentPage - 1
        ) * FANCAM_POST_PER_PAGE;

    const end =
        start +
        FANCAM_POST_PER_PAGE;


    const currentPosts =
        posts.slice(
            start,
            end
        );


    for (
        const post
        of currentPosts
    ) {

        const block =
            document.createElement(
                "div"
            );

        block.className =
            "fancam-post-grid-item";


        const tags =
            FancamPublic.createTags(
                post.tags
            );

        if (tags) {
            block.appendChild(
                tags
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
            post.url;


        tweet.appendChild(
            link
        );

        tweetContainer.appendChild(
            tweet
        );

        block.appendChild(
            tweetContainer
        );


        const pages =
            FancamPublic.createPageLinks(
                post.pages
            );

        if (pages) {
            block.appendChild(
                pages
            );
        }


        block.appendChild(
            FancamPublic.createReportArea(
                FancamPublic.createPostReportButton(
                    post.x_post_id,
                    post.url
                )
            )
        );


        container.appendChild(
            block
        );
    }


    pagination.appendChild(
        FancamPublic.createPagination(
            currentPage,
            totalPages,
            function (page) {

                FancamPublic.setPageInUrl(
                    page
                );

                renderFancamPosts(
                    page
                );

                document
                    .getElementById(
                        "fancam-post-list"
                    )
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            },
            posts.length
        )
    );


    FancamPublic.loadTwitterWidgets();
}
