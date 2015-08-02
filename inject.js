
//未处理在图书馆登录后的情况
//添加与豆瓣风格一样的div
$('#buyinfo').before('<div class="gray_ad" id="szulib"></div>');
//首先快速载入问题（无需连接到图书馆）
$('#szulib').append('<h2>深大图书馆有没有?</h2><div class="bs" id="isex"></div>');
//获取isbn，text()获取html的文本， split分割
var isbn = $('#info').text().split('ISBN: ')[1];
//得出搜索图书的链接
var preurl = 'http://opac.lib.szu.edu.cn/opac/searchresult.aspx?isbn_f=' + isbn;
//第一次ajax，搜索图书 
$.ajax({
    url: preurl,
    type: 'GET',
    //错误信息
    error: function () {
        $('#isex').html('访问图书馆失败!');
    },

    success: function (msg) {
        if (msg.indexOf('searchnotfound') != -1) { //之前使用'本馆没有您要检索的馆藏书目'
            $('#isex').html('没有！');
        } else {
            $('#isex').html('有！');
            $('#isex').after('<br><h2>在这里</h2>');
            var findurl = msg.replace(/( |　|\r\n|\n)/ig, '').split('<spanclass="title"><ahref="')[1].split('"target="_blank"')[0];
            //二次ajax,进入图书详情页
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
    }
});