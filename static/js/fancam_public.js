window.FancamPublic = (() => {

    const API_BASE =
        "https://fancam.mothlamp.info/api";


    function getApiBase() {
        return API_BASE;
    }


    function formatUtcDate(value) {

        if (!value) {
            return "";
        }

        if (
            !value.endsWith("Z") &&
            !/[+-]\d{2}:\d{2}$/.test(value)
        ) {
            value += "Z";
        }

        const date =
            new Date(value);

        return date.toLocaleString(
            "ja-JP",
            {
                timeZone: "Asia/Tokyo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    function loadTwitterWidgets() {

        if (
            window.twttr &&
            window.twttr.widgets
        ) {
            window.twttr.widgets.load();
            return;
        }

        if (
            document.getElementById(
                "twitter-wjs"
            )
        ) {
            return;
        }

        const script =
            document.createElement(
                "script"
            );

        script.id =
            "twitter-wjs";

        script.src =
            "https://platform.twitter.com/widgets.js";

        script.async =
            true;

        document.body.appendChild(
            script
        );
    }


    // Fancam X embed grids: scaled tweet spacing
    function adjustFancamTweetSpacing() {

        document
            .querySelectorAll(
                [
                    ".fancam-detail-post-grid .tweet-container",
                    ".fancam-post-grid .tweet-container"
                ].join(",")
            )
            .forEach(
                function (container) {

                    const layoutHeight =
                        container.offsetHeight;

                    const visualHeight =
                        container
                            .getBoundingClientRect()
                            .height;


                    if (
                        layoutHeight <= 0 ||
                        visualHeight <= 0
                    ) {
                        return;
                    }


                    const unusedHeight =
                        layoutHeight -
                        visualHeight;


                    if (unusedHeight > 1) {

                        container.style.marginBottom =
                            `-${Math.ceil(unusedHeight)}px`;

                    } else {

                        container.style.marginBottom =
                            "";
                    }
                }
            );
    }


    function initializeFancamTweetSpacing() {

        const grids =
            document.querySelectorAll(
                [
                    ".fancam-detail-post-grid",
                    ".fancam-post-grid"
                ].join(",")
            );


        if (grids.length === 0) {
            return;
        }


        for (const grid of grids) {

            if (
                grid.dataset
                    .fancamTweetSpacingInitialized ===
                "1"
            ) {
                continue;
            }


            grid.dataset
                .fancamTweetSpacingInitialized =
                "1";


            const observer =
                new MutationObserver(
                    function () {

                        setTimeout(
                            adjustFancamTweetSpacing,
                            100
                        );
                    }
                );


            observer.observe(
                grid,
                {
                    childList: true,
                    subtree: true
                }
            );
        }


        if (
            document.documentElement.dataset
                .fancamTweetSpacingResizeInitialized !==
            "1"
        ) {

            document.documentElement.dataset
                .fancamTweetSpacingResizeInitialized =
                "1";


            window.addEventListener(
                "resize",
                adjustFancamTweetSpacing
            );
        }


        setTimeout(
            adjustFancamTweetSpacing,
            100
        );
    }
    // /Fancam X embed grids: scaled tweet spacing


    function createTags(tags) {

        if (
            !tags ||
            tags.length === 0
        ) {
            return null;
        }

        const container =
            document.createElement(
                "div"
            );

        container.className =
            "fancam-post-tags";

        for (const tag of tags) {

            const element =
                document.createElement(
                    "span"
                );

            element.className =
                "fancam-post-tag";

            element.textContent =
                tag.name;

            container.appendChild(
                element
            );
        }

        return container;
    }


    function createPageLinks(pages) {

        if (
            !pages ||
            pages.length === 0
        ) {
            return null;
        }

        const container =
            document.createElement(
                "div"
            );

        container.className =
            "fancam-post-pages";

        const title =
            document.createElement(
                "p"
            );

        title.className =
            "fancam-post-pages-title";

        title.textContent =
            "このポストを含む記事";

        container.appendChild(
            title
        );

        const list =
            document.createElement(
                "div"
            );

        list.className =
            "fancam-post-page-list";

        for (const page of pages) {

            const link =
                document.createElement(
                    "a"
                );

            link.className =
                "fancam-post-page-link";

            link.href =
                `/?p=fancam.article&pid=${encodeURIComponent(page.pid)}`;

            link.textContent =
                page.title;

            list.appendChild(
                link
            );
        }

        container.appendChild(
            list
        );

        return container;
    }


    function createPageReportButton(
        pid,
        title
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "fancam-report-button";

        button.dataset.fancamReportPage =
            pid;

        button.dataset.fancamReportTitle =
            title || "";

        button.textContent =
            "⚑ 通報する";

        return button;
    }


    function createPostReportButton(
        xPostId,
        url
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "fancam-report-button";

        button.dataset.fancamReportPost =
            String(xPostId);

        button.dataset.fancamReportUrl =
            url || "";

        button.textContent =
            "⚑ 通報する";

        return button;
    }


    function createReportArea(button) {

        const area =
            document.createElement(
                "div"
            );

        area.className =
            "fancam-report-area";

        area.appendChild(
            button
        );

        return area;
    }


    function createStatusWarning(message) {

        const block =
            document.createElement(
                "div"
            );

        block.className =
            "contents_block fancam-status-warning";

        const text =
            document.createElement(
                "p"
            );

        text.textContent =
            message;

        block.appendChild(
            text
        );

        return block;
    }


    function showMessage(
        container,
        message
    ) {

        container.innerHTML =
            "";

        const block =
            document.createElement(
                "div"
            );

        block.className =
            "contents_block";

        const text =
            document.createElement(
                "p"
            );

        text.textContent =
            message;

        block.appendChild(
            text
        );

        container.appendChild(
            block
        );
    }



    function getPageFromUrl(
        parameterName = "page"
    ) {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const value =
            Number(
                params.get(
                    parameterName
                )
            );

        if (
            !Number.isInteger(value) ||
            value < 1
        ) {
            return 1;
        }

        return value;
    }


    function setPageInUrl(
        page,
        replace = false,
        parameterName = "page"
    ) {

        const url =
            new URL(
                window.location.href
            );

        if (page <= 1) {
            url.searchParams.delete(
                parameterName
            );

        } else {
            url.searchParams.set(
                parameterName,
                String(page)
            );
        }


        if (replace) {
            window.history.replaceState(
                {},
                "",
                url
            );

        } else {
            window.history.pushState(
                {},
                "",
                url
            );
        }
    }


    function createPagination(
        currentPage,
        totalPages,
        onPageChange,
        totalItems = null
    ) {

        const nav =
            document.createElement(
                "nav"
            );

        nav.className =
            "fancam-pagination";

        nav.setAttribute(
            "aria-label",
            "ページ切り替え"
        );


        if (
            totalItems !== null
        ) {

            const info =
                document.createElement(
                    "p"
                );

            info.className =
                "fancam-pagination-info";

            info.textContent =
                `${totalItems}件 / ${currentPage} / ${totalPages}ページ`;

            nav.appendChild(
                info
            );
        }


        if (totalPages <= 1) {
            return nav;
        }


        const addButton =
            function (
                label,
                page,
                options = {}
            ) {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.className =
                    "fancam-pagination-button";

                button.textContent =
                    label;


                if (options.current) {

                    button.classList.add(
                        "current"
                    );

                    button.disabled =
                        true;

                    button.setAttribute(
                        "aria-current",
                        "page"
                    );
                }


                if (options.disabled) {
                    button.disabled =
                        true;
                }


                if (!button.disabled) {

                    button.addEventListener(
                        "click",
                        function () {
                            onPageChange(
                                page
                            );
                        }
                    );
                }


                nav.appendChild(
                    button
                );
            };


        const addEllipsis =
            function () {

                const span =
                    document.createElement(
                        "span"
                    );

                span.className =
                    "fancam-pagination-ellipsis";

                span.textContent =
                    "…";

                nav.appendChild(
                    span
                );
            };


        const pages =
            new Set([
                1,
                totalPages,
                currentPage - 1,
                currentPage,
                currentPage + 1
            ]);


        const pageNumbers =
            [...pages]
                .filter(
                    function (page) {
                        return (
                            page >= 1 &&
                            page <= totalPages
                        );
                    }
                )
                .sort(
                    function (a, b) {
                        return a - b;
                    }
                );


        let previousPage = null;


        for (
            const page
            of pageNumbers
        ) {

            if (
                previousPage !== null &&
                page - previousPage > 1
            ) {
                addEllipsis();
            }


            addButton(
                String(page),
                page,
                {
                    current:
                        page === currentPage
                }
            );


            previousPage =
                page;
        }


        return nav;
    }


    initializeFancamTweetSpacing();


    return {
        getApiBase,
        formatUtcDate,
        loadTwitterWidgets,
        createTags,
        createPageLinks,
        createPageReportButton,
        createPostReportButton,
        createReportArea,
        createStatusWarning,
        showMessage,
        getPageFromUrl,
        setPageInUrl,
        createPagination
    };

})();
