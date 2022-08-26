$(function(){
    $(".main__productlist li").hover(
        function () {
            $(this).children('.js-imghoverpc').addClass("main__productlist--hover");
            }
    );
    $(".js-slidesp").on('click', function(){
        if($(this).children('.js-imghoversp').hasClass('active-hover')){
            $(this).children('.js-imghoversp').removeClass('active-hover');
        }else{
            $(this).children('.js-imghoversp').addClass('active-hover');
        }
    });
   
});