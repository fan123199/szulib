function conv13to10(str) {
    //将isbn13转化为isbn10
    var s;
    var c;
    var checkDigit = 0;
    var result = "";

    s = str.substring(3,str.length);
    for ( i = 10; i > 1; i-- ) {
        c = s.charAt(10 - i);
        checkDigit += (c - 0) * i;
        result += c;
    }
    checkDigit = (11 - (checkDigit % 11)) % 11;
    result += checkDigit == 10 ? 'X' : (checkDigit + "");

    return ( result );
}

function getInfo (isbn) {
    var preurl = 'http://opac.lib.szu.edu.cn/opac/searchresult.aspx?isbn_f=' + isbn;

    var jqxhr = $.ajax(preurl)
        .done(function(msg) {
            if (msg.indexOf('searchnotfound') != -1) {
                if(isbn.length == 13) {
                    //alert(isbn.length);
                    getInfo(conv13to10(isbn));//检查isbn10
                }
                else {
                     alert(isbn.length);
                     $('#szulib').append("没有找到！");
                }
            }
            else {
                //取得信息后准备第二次连接
                $('#isex').html('有！');
                $('#isex').after('<br><h2>在这里</h2>');
                var findurl = msg.replace(/( |　|\r\n|\n)/ig, '').split('<spanclass="title"><ahref="')[1].split('"target="_blank"')[0];
                $.ajax({
                url: "http://opac.lib.szu.edu.cn/opac/" + findurl,
                type: 'GET',
                error: function () {
                    $('#szulib').append('获取信息失败!');
                },
                success: function (detail) {
                    var detail_table = detail.split('<h5 class="tbc">藏书情况</h5>')[1].split('<input')[0];

                    $('#szulib').append(detail_table + '<br><h2 class="bs" id="mdt"><a href="' + "http://opac.lib.szu.edu.cn/opac/" + findurl + '" target="_blank">点击查看详细</a></h2>');

                    $('.tbhead tr td:eq(2)').hide();
                    $('.tbhead tr td:eq(3)').hide();
                    $('.tbhead tr td:eq(4)').hide();
                    $('.tbhead tr td:eq(6)').hide();

                    for (var i = 1; i <= $('#szulib div .tb tbody tr').length ; i++) {
                        $('.tb tbody tr td').eq(7 * i - 5).hide();
                        $('.tb tbody tr td').eq(7 * i - 4).hide();
                        $('.tb tbody tr td').eq(7 * i - 3).hide();
                        $('.tb tbody tr td').eq(7 * i - 1).hide();
                    }

                    $('#szulib tbody').find('a').contents().unwrap();
                 //   $(this).text($(this).text());
                }
            });
        }
        })
        .fail(function() {
            $('#szulib').append("连接图书馆出错！");
        });
}

function init () {
    //未处理在图书馆登录后的情况
    //添加与豆瓣风格一样的div
    $('#buyinfo').before('<div class="gray_ad" id="szulib"></div>');
    //首先快速载入问题（无需连接到图书馆）
    $('#szulib').append('<h2>深大图书馆有没有?</h2><div class="bs" id="isex"></div>');
    //获取isbn，text()获取html的文本， split分割
    var isbn = $('#info').text().split('ISBN: ')[1].trim();
    getInfo(isbn);
}

init();
