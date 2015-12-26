//将isbn13转化为isbn10
function conv13to10(str) {
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
    result += checkDigit == 10 ? "X" : (checkDigit + "");

    return ( result );
}


//获取图书信息
function getInfo (isbn_info) {
    var preUrl = "http://opac.lib.szu.edu.cn/opac/searchresult.aspx?isbn_f=" + isbn_info;

    var jqxhr = $.ajax({
    	url:preUrl,
    	cache: false})
		.done(function(msg) {
	        if (msg.indexOf("searchnotfound") != -1) {
	            if (isbn_info.length == 13) {
	            	getInfo(conv13to10(isbn_info));
	            }
	            else {
	            	$("#szulib").append("没有找到！");
	            }                   
	        }
	        else {
	            //取得信息后准备第二次连接
	            $("#isex").html("有！");
	            $("#isex").after("<br><h2>在这里</h2>");
	            var findurl = msg.replace(/( |　|\r\n|\n)/ig, "")
	            	.split("<spanclass=\"title\"><ahref=\"")[1].split("\"target=\"_blank\"")[0];
	            var info_url = "http://opac.lib.szu.edu.cn/opac/" + findurl;
	            showinfo(info_url);
	           
			}
		})
		.fail(function() {
	        $("#szulib").append("连接图书馆出错！");
	    });
}
function showinfo(url) {
	 $.ajax({
		url:url,
		cache: false})
		.done(function (detail) {
	        var detail_table = detail.split("<h5 class=\"tbc\">藏书情况</h5>")[1].split("<input")[0];
	        $("#szulib").append(detail_table + "<br><h2 class=\"bs\" id=\"mdt\"><a href=\"" 
	        	+ url + "\" target=\"_blank\">点击查看详细</a></h2>");


	        $(".tbhead tr td:eq(2)").hide();
	        $(".tbhead tr td:eq(3)").hide();
	        $(".tbhead tr td:eq(4)").hide();
	        $(".tbhead tr td:eq(6)").hide();

	        for (var i = 1; i <= $("#szulib div .tb tbody tr").length ; i++) {
	            $(".tb tbody tr td").eq(7 * i - 5).hide();
	            $(".tb tbody tr td").eq(7 * i - 4).hide();
	            $(".tb tbody tr td").eq(7 * i - 3).hide();
	            $(".tb tbody tr td").eq(7 * i - 1).hide();
	        }

	        $("#szulib tbody").find("a").contents().unwrap();
		})
		.fail(function () {
		    $("#szulib").append("获取信息失败!");
		});
}

function init () {

    //添加与豆瓣风格一样的div
    $("#buyinfo").before("<div class=\"gray_ad\" id=\"szulib\"></div>");
    //首先快速载入问题（无需连接到图书馆）
    $("#szulib").append("<h2>深大图书馆有没有?</h2><div class=\"bs\" id=\"isex\"></div>");
    //获取isbn，text()获取html的文本， split分割
    var isbn = $("#info").text().split("ISBN: ")[1].trim();
    getInfo(isbn);
}

init();
