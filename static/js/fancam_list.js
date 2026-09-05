const FANCAM_PAGE_PER_PAGE =
    5;

let fancamPages = [];


$(function () {

    loadFancamPages();


    window.addEventListener(
        "popstate",
        function () {

            if (fancamPages.length > 0) {
                renderFancamPages(
                    FancamPublic.getPageFromUrl()
                );
            }
        }
    );
});


async function loadFancamPages() {

    const contents =
        document.getElementById(
            "fancam-contents"
        );

    try {

        const response =
            await fetch(
                `${FancamPublic.getApiBase()}/pages`,
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

        fancamPages =
            data.pages || [];


        renderFancamPages(
            FancamPublic.getPageFromUrl()
        );


    } catch (error) {

        console.error(
            error
        );

        document
            .getElementById(
                "fancam-pagination"
            )
            .innerHTML =
            "";

        FancamPublic.showMessage(
            contents,
            "Fancamページの一覧を取得できませんでした。"
        );
    }
}


function renderFancamPages(
    requestedPage
) {

    const contents =
        document.getElementById(
            "fancam-contents"
        );

    let pagination =
        document.getElementById(
            "fancam-pagination"
        );


    if (!pagination) {

        pagination =
            document.createElement(
                "div"
            );

        pagination.id =
            "fancam-pagination";

        contents.insertAdjacentElement(
            "afterend",
            pagination
        );
    }


    contents.innerHTML =
        "";

    pagination.innerHTML =
        "";


    if (fancamPages.length === 0) {

        FancamPublic.showMessage(
            contents,
            "現在公開されているFancamページはありません。"
        );

        return;
    }


    const totalPages =
        Math.ceil(
            fancamPages.length /
            FANCAM_PAGE_PER_PAGE
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
        ) * FANCAM_PAGE_PER_PAGE;

    const end =
        start +
        FANCAM_PAGE_PER_PAGE;


    const pages =
        fancamPages.slice(
            start,
            end
        );


    for (const page of pages) {

        const block =
            document.createElement(
                "div"
            );

        block.className =
            "contents_block contents_block_has_a";


        const link =
            document.createElement(
                "a"
            );

        link.className =
            "contents_block_a";

        link.href =
            `/?p=fancam.article&pid=${encodeURIComponent(page.pid)}`;

        link.setAttribute(
            "aria-label",
            page.title
        );


        const title =
            document.createElement(
                "h3"
            );

        title.textContent =
            page.title;


        block.appendChild(
            link
        );

        block.appendChild(
            title
        );


        const tags =
            FancamPublic.createTags(
                page.tags
            );

        if (tags) {
            block.appendChild(
                tags
            );
        }


        const meta =
            document.createElement(
                "p"
            );

        meta.className =
            "block-description";

        meta.textContent =
            `${page.url_count}件 / 更新 ${FancamPublic.formatUtcDate(page.updated_at)}`;


        block.appendChild(
            meta
        );

        contents.appendChild(
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

                renderFancamPages(
                    page
                );

                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                });
            },
            fancamPages.length
        )
    );
}
