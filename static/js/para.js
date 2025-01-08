// 背景が、paraの値が正で上に、負で下に動く

let para1 = -0.25;
let para2 = -0.32;
let para3 = -0.4;
let para4 = -0.5;
$(window).scroll(function () {
    let y = $(window).scrollTop();
    $("#bg_1").css("background-position-y", y * (para1) + "px");
    $("#bg_2").css("background-position-y", y * (para2) + "px");
    $("#bg_3").css("background-position-y", y * (para3) + "px");
    $("#bg_4").css("background-position-y", y * (para4) + "px");
});

