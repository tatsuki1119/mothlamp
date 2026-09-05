(() => {

    const FANCAM_REPORT_API =
        "https://fancam.mothlamp.info/api/report";


    let fancamReportTarget = null;


    function escapeFancamReportHtml(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function ensureFancamReportUi() {

        if (
            document.getElementById(
                "fancam-report-modal"
            )
        ) {
            return;
        }


        const modal =
            document.createElement(
                "div"
            );

        modal.id =
            "fancam-report-modal";

        modal.className =
            "fancam-report-modal";

        modal.innerHTML = `
            <div
                class="fancam-report-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="fancam-report-title"
            >
                <h3 id="fancam-report-title">
                    ⚑ 通報する
                </h3>

                <p
                    id="fancam-report-target"
                    class="fancam-report-target"
                ></p>

                <div class="fancam-report-row">
                    <label for="fancam-report-reason">
                        通報理由
                    </label>

                    <select id="fancam-report-reason">
                        <option value="">
                            選択してください
                        </option>
                        <option value="ファントムシータに関連しない">
                            ファントムシータに関連しない
                        </option>
                        <option value="表示されない">
                            表示されない
                        </option>
                        <option value="不適切な表現・コメント">
                            不適切な表現・コメント
                        </option>
                        <option value="不適切なタグ">
                            不適切なタグ
                        </option>
                        <option value="著作権等の侵害・無断転載">
                            著作権等の侵害・無断転載
                        </option>
                        <option value="その他の不適切な内容">
                            その他の不適切な内容
                        </option>
                    </select>
                </div>

                <div class="fancam-report-row">
                    <label for="fancam-report-detail">
                        詳細（任意）
                    </label>

                    <textarea
                        id="fancam-report-detail"
                        maxlength="300"
                    ></textarea>
                </div>

                <div
                    id="fancam-report-message"
                    class="fancam-report-message"
                ></div>

                <div class="fancam-report-actions">
                    <button
                        type="button"
                        id="fancam-report-cancel"
                    >
                        キャンセル
                    </button>

                    <button
                        type="button"
                        id="fancam-report-submit"
                        class="fancam-report-submit"
                    >
                        通報する
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(
            modal
        );


        document
            .getElementById(
                "fancam-report-cancel"
            )
            .addEventListener(
                "click",
                closeFancamReport
            );


        document
            .getElementById(
                "fancam-report-submit"
            )
            .addEventListener(
                "click",
                submitFancamReport
            );


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {
                    closeFancamReport();
                }
            }
        );


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                    && modal.classList.contains(
                        "visible"
                    )
                ) {
                    closeFancamReport();
                }
            }
        );
    }


    function openFancamReport(target) {

        ensureFancamReportUi();

        fancamReportTarget =
            target;


        const targetText =
            target.type === "page"
                ? `記事: ${target.title || target.pid}`
                : `Xポスト: ${target.url || target.xPostId}`;


        document
            .getElementById(
                "fancam-report-target"
            )
            .innerHTML =
            escapeFancamReportHtml(
                targetText
            );


        document
            .getElementById(
                "fancam-report-reason"
            )
            .value =
            "";


        document
            .getElementById(
                "fancam-report-detail"
            )
            .value =
            "";


        document
            .getElementById(
                "fancam-report-message"
            )
            .textContent =
            "";


        document
            .getElementById(
                "fancam-report-modal"
            )
            .classList.add(
                "visible"
            );
    }


    function closeFancamReport() {

        const modal =
            document.getElementById(
                "fancam-report-modal"
            );

        if (modal) {
            modal.classList.remove(
                "visible"
            );
        }

        fancamReportTarget =
            null;
    }


    async function submitFancamReport() {

        if (!fancamReportTarget) {
            return;
        }


        const reason =
            document
                .getElementById(
                    "fancam-report-reason"
                )
                .value;


        const detail =
            document
                .getElementById(
                    "fancam-report-detail"
                )
                .value
                .trim();


        const message =
            document.getElementById(
                "fancam-report-message"
            );


        if (!reason) {
            message.textContent =
                "通報理由を選択してください。";

            return;
        }


        const submitButton =
            document.getElementById(
                "fancam-report-submit"
            );


        submitButton.disabled =
            true;

        message.textContent =
            "送信しています…";


        let requestData = {
            target:
                fancamReportTarget.type,
            reason:
                detail
                    ? `${reason} / ${detail}`
                    : reason,
        };


        if (
            fancamReportTarget.type === "page"
        ) {
            requestData.pid =
                fancamReportTarget.pid;

        } else {
            requestData.x_post_id =
                fancamReportTarget.xPostId;
        }


        try {

            const response =
                await fetch(
                    FANCAM_REPORT_API,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify(
                                requestData
                            ),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.error ||
                    `HTTP ${response.status}`
                );
            }


            message.textContent =
                "通報を受け付けました。ご協力ありがとうございます。";


            setTimeout(
                closeFancamReport,
                1200
            );

        } catch (error) {

            console.error(
                "Fancam report error:",
                error
            );

            message.textContent =
                "通報を送信できませんでした。時間をおいて再度お試しください。";

        } finally {

            submitButton.disabled =
                false;
        }
    }


    document.addEventListener(
        "click",
        function (event) {

            const pageButton =
                event.target.closest(
                    "[data-fancam-report-page]"
                );

            if (pageButton) {
                openFancamReport({
                    type: "page",
                    pid:
                        pageButton.dataset
                            .fancamReportPage,
                    title:
                        pageButton.dataset
                            .fancamReportTitle ||
                        "",
                });

                return;
            }


            const postButton =
                event.target.closest(
                    "[data-fancam-report-post]"
                );

            if (postButton) {
                openFancamReport({
                    type: "post",
                    xPostId:
                        Number(
                            postButton.dataset
                                .fancamReportPost
                        ),
                    url:
                        postButton.dataset
                            .fancamReportUrl ||
                        "",
                });
            }
        }
    );


    window.openFancamPageReport =
        function (
            pid,
            title = ""
        ) {
            openFancamReport({
                type: "page",
                pid: pid,
                title: title,
            });
        };


    window.openFancamPostReport =
        function (
            xPostId,
            url = ""
        ) {
            openFancamReport({
                type: "post",
                xPostId: Number(
                    xPostId
                ),
                url: url,
            });
        };

})();
