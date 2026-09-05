const FANCAM_POST_PER_PAGE =
    50;

let fancamPosts = [];
let fancamFilteredPosts = [];
let fancamTagGenres = [];
let fancamAppliedFilters = {};


$(function () {

    bindFancamFilterEvents();

    loadFancamPosts();


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


function bindFancamFilterEvents() {

    document
        .getElementById(
            "open-fancam-filters"
        )
        .addEventListener(
            "click",
            openFancamFilterModal
        );


    document
        .getElementById(
            "close-fancam-filters"
        )
        .addEventListener(
            "click",
            closeFancamFilterModal
        );


    document
        .getElementById(
            "apply-filters"
        )
        .addEventListener(
            "click",
            function () {

                fancamAppliedFilters =
                    collectSelectedFancamFilters();

                applyFancamFilters();

                closeFancamFilterModal();
            }
        );


    document
        .getElementById(
            "reset-filters"
        )
        .addEventListener(
            "click",
            resetFancamFilters
        );


    const modal =
        document.getElementById(
            "fancam-filter-modal"
        );


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                modal
            ) {
                closeFancamFilterModal();
            }
        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "visible"
                )
            ) {
                closeFancamFilterModal();
            }
        }
    );
}


function openFancamFilterModal() {

    const modal =
        document.getElementById(
            "fancam-filter-modal"
        );

    modal.classList.add(
        "visible"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "fancam-filter-modal-open"
    );


    const firstButton =
        modal.querySelector(
            ".filter-toggle:not(:disabled), .fancam-custom-filter-search"
        );

    if (firstButton) {
        firstButton.focus();
    }
}


function closeFancamFilterModal() {

    const modal =
        document.getElementById(
            "fancam-filter-modal"
        );

    modal.classList.remove(
        "visible"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "fancam-filter-modal-open"
    );


    const openButton =
        document.getElementById(
            "open-fancam-filters"
        );

    openButton.focus();
}


async function loadFancamPosts() {

    try {

        const [
            postsResponse,
            tagsResponse
        ] = await Promise.all([
            fetch(
                `${FancamPublic.getApiBase()}/posts`,
                {
                    cache: "no-store"
                }
            ),
            fetch(
                `${FancamPublic.getApiBase()}/tags`,
                {
                    cache: "no-store"
                }
            )
        ]);


        if (!postsResponse.ok) {
            throw new Error(
                `posts HTTP ${postsResponse.status}`
            );
        }

        if (!tagsResponse.ok) {
            throw new Error(
                `tags HTTP ${tagsResponse.status}`
            );
        }


        const postsData =
            await postsResponse.json();

        const tagsData =
            await tagsResponse.json();


        fancamPosts =
            postsData.posts || [];

        fancamFilteredPosts =
            fancamPosts;

        fancamTagGenres =
            tagsData.genres || [];


        ensureCustomGenreDefinition();

        createFancamFilters(
            fancamTagGenres,
            fancamPosts
        );

        updateFancamFilterSummary();

        renderFancamPosts(
            FancamPublic.getPageFromUrl()
        );


    } catch (error) {

        console.error(
            error
        );

        document
            .getElementById(
                "fancam-filters"
            )
            .innerHTML =
            "<p>絞り込み情報を取得できませんでした。</p>";

        document
            .getElementById(
                "fancam-post-list"
            )
            .innerHTML =
            '<div class="fancam-post-grid-empty"><p>Fancamポストを取得できませんでした。</p></div>';

        $("#fancam-post-pagination")
            .empty();
    }
}


function ensureCustomGenreDefinition() {

    const hasCustom =
        fancamTagGenres.some(
            function (genre) {
                return (
                    genre.name ===
                    "カスタム"
                );
            }
        );


    if (!hasCustom) {
        fancamTagGenres.push({
            name: "カスタム",
            tags: []
        });
    }
}


function createFancamFilters(
    genres,
    posts
) {

    const container =
        document.getElementById(
            "fancam-filters"
        );

    container.innerHTML =
        "";


    const usageCounts =
        getFancamTagUsageCounts(
            posts
        );


    for (const genre of genres) {

        if (
            genre.name ===
            "カスタム"
        ) {

            createCustomFancamFilterSection(
                container,
                genre,
                usageCounts
            );

            continue;
        }


        createDefinedFancamFilterSection(
            container,
            genre,
            usageCounts
        );
    }
}


function createDefinedFancamFilterSection(
    container,
    genre,
    usageCounts
) {

    const section =
        createFancamFilterSection(
            genre.name
        );

    const group =
        document.createElement(
            "div"
        );

    group.className =
        "filter-group";


    for (
        const tagName
        of genre.tags || []
    ) {

        const count =
            getFancamTagUsageCount(
                usageCounts,
                genre.name,
                tagName
            );

        group.appendChild(
            createFancamFilterButton(
                genre.name,
                tagName,
                count,
                count === 0
            )
        );
    }


    if (
        !genre.tags ||
        genre.tags.length === 0
    ) {
        group.appendChild(
            createFancamFilterEmptyMessage(
                "タグが登録されていません。"
            )
        );
    }


    section.appendChild(
        group
    );

    container.appendChild(
        section
    );
}


function createCustomFancamFilterSection(
    container,
    genre,
    usageCounts
) {

    const section =
        createFancamFilterSection(
            "カスタム",
            "現在Fancamで使われているカスタムタグから絞り込めます。"
        );


    const search =
        document.createElement(
            "input"
        );

    search.type =
        "search";

    search.className =
        "fancam-custom-filter-search";

    search.placeholder =
        "カスタムタグを検索";

    search.autocomplete =
        "off";

    section.appendChild(
        search
    );


    const group =
        document.createElement(
            "div"
        );

    group.className =
        "filter-group fancam-custom-filter-group";


    const collator =
        new Intl.Collator(
            "ja",
            {
                numeric: true,
                sensitivity: "base"
            }
        );


    const usedTags =
        (genre.tags || [])
            .filter(
                function (tagName) {
                    return (
                        getFancamTagUsageCount(
                            usageCounts,
                            "カスタム",
                            tagName
                        ) > 0
                    );
                }
            )
            .sort(
                function (a, b) {
                    return collator.compare(
                        a,
                        b
                    );
                }
            );


    for (const tagName of usedTags) {

        const count =
            getFancamTagUsageCount(
                usageCounts,
                "カスタム",
                tagName
            );

        group.appendChild(
            createFancamFilterButton(
                "カスタム",
                tagName,
                count,
                false
            )
        );
    }


    const emptyMessage =
        createFancamFilterEmptyMessage(
            usedTags.length === 0
                ? "現在利用中のカスタムタグはありません。"
                : "一致するカスタムタグはありません。"
        );

    emptyMessage.classList.add(
        "fancam-custom-filter-empty"
    );

    emptyMessage.style.display =
        usedTags.length === 0
            ? "block"
            : "none";


    section.appendChild(
        group
    );

    section.appendChild(
        emptyMessage
    );


    search.addEventListener(
        "input",
        function () {

            filterCustomFancamTags(
                search,
                group,
                emptyMessage
            );
        }
    );


    container.appendChild(
        section
    );
}


function createFancamFilterSection(
    titleText,
    descriptionText = ""
) {

    const section =
        document.createElement(
            "section"
        );

    section.className =
        "fancam-filter-section";


    const title =
        document.createElement(
            "h4"
        );

    title.className =
        "fancam-filter-section-title";

    title.textContent =
        titleText;

    section.appendChild(
        title
    );


    if (descriptionText) {

        const description =
            document.createElement(
                "p"
            );

        description.className =
            "fancam-filter-section-description";

        description.textContent =
            descriptionText;

        section.appendChild(
            description
        );
    }


    return section;
}


function createFancamFilterButton(
    genre,
    tagName,
    count,
    disabled
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

    button.disabled =
        disabled;


    const label =
        document.createElement(
            "span"
        );

    label.textContent =
        tagName;

    button.appendChild(
        label
    );


    const countElement =
        document.createElement(
            "span"
        );

    countElement.className =
        "fancam-filter-tag-count";

    countElement.textContent =
        String(count);

    button.appendChild(
        countElement
    );


    button.addEventListener(
        "click",
        function () {

            this.classList.toggle(
                "active"
            );
        }
    );


    return button;
}


function createFancamFilterEmptyMessage(
    message
) {

    const p =
        document.createElement(
            "p"
        );

    p.className =
        "fancam-filter-empty";

    p.textContent =
        message;

    return p;
}


function filterCustomFancamTags(
    search,
    group,
    emptyMessage
) {

    const query =
        search.value
            .trim()
            .toLocaleLowerCase(
                "ja"
            );

    let visibleCount = 0;


    group
        .querySelectorAll(
            ".filter-toggle"
        )
        .forEach(
            function (button) {

                const tagName =
                    button.dataset.tag
                        .toLocaleLowerCase(
                            "ja"
                        );

                const visible =
                    !query ||
                    tagName.includes(
                        query
                    );

                button.style.display =
                    visible
                        ? "inline-flex"
                        : "none";

                if (visible) {
                    visibleCount += 1;
                }
            }
        );


    emptyMessage.style.display =
        visibleCount === 0
            ? "block"
            : "none";
}


function getFancamTagUsageCounts(
    posts
) {

    const counts =
        new Map();


    for (const post of posts) {

        const postTags =
            new Set();


        for (
            const tag
            of post.tags || []
        ) {

            postTags.add(
                getFancamTagKey(
                    tag.genre,
                    tag.name
                )
            );
        }


        for (const key of postTags) {
            counts.set(
                key,
                (counts.get(key) || 0) + 1
            );
        }
    }


    return counts;
}


function getFancamTagUsageCount(
    counts,
    genre,
    tagName
) {

    return (
        counts.get(
            getFancamTagKey(
                genre,
                tagName
            )
        ) || 0
    );
}


function getFancamTagKey(
    genre,
    tagName
) {

    return JSON.stringify([
        genre,
        tagName
    ]);
}


function collectSelectedFancamFilters() {

    const selected = {};


    document
        .querySelectorAll(
            ".filter-toggle.active:not(:disabled)"
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


    return selected;
}


function applyFancamFilters() {

    fancamFilteredPosts =
        fancamPosts.filter(
            function (post) {

                return Object
                    .entries(
                        fancamAppliedFilters
                    )
                    .every(
                        function (
                            [
                                genre,
                                selectedTags
                            ]
                        ) {

                            if (
                                selectedTags.length === 0
                            ) {
                                return true;
                            }


                            const postTags =
                                (post.tags || [])
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

    updateFancamFilterSummary();
}


function resetFancamFilters() {

    document
        .querySelectorAll(
            ".filter-toggle.active"
        )
        .forEach(
            function (button) {
                button.classList.remove(
                    "active"
                );
            }
        );


    const customSearch =
        document.querySelector(
            ".fancam-custom-filter-search"
        );

    if (customSearch) {
        customSearch.value =
            "";

        customSearch.dispatchEvent(
            new Event(
                "input"
            )
        );
    }


    fancamAppliedFilters = {};

    fancamFilteredPosts =
        fancamPosts;


    FancamPublic.setPageInUrl(
        1
    );

    renderFancamPosts(
        1
    );

    updateFancamFilterSummary();
}


function updateFancamFilterSummary() {

    const selectedCount =
        Object.values(
            fancamAppliedFilters
        )
        .reduce(
            function (
                total,
                tags
            ) {
                return (
                    total +
                    tags.length
                );
            },
            0
        );


    const openButton =
        document.getElementById(
            "open-fancam-filters"
        );

    const summary =
        document.getElementById(
            "fancam-filter-summary"
        );


    if (selectedCount === 0) {

        openButton.textContent =
            "絞り込み";

        summary.textContent =
            "絞り込み条件なし";

        return;
    }


    openButton.textContent =
        `絞り込み（${selectedCount}）`;

    summary.textContent =
        `${selectedCount}個の条件を適用中 / ${fancamFilteredPosts.length}件`;
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
