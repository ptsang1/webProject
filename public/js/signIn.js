(function ($) {
    "use strict";
    $('input[type="submit"]').click(function(){
        let input = $('input[name="email"]')[0];
        let check = validateEmail();
        if(check === 1){
            return input.setCustomValidity('Bạn hãy nhập EMAIL đã đăng ký vào đây nhé!');
        }else if(check == 0){
            return input.setCustomValidity('Bạn chưa nhập thông tin nè!');
        }else{
            return input.setCustomValidity('');
        }
    });


    function validateEmail () {
        let input = $('input[name="email"]');
        if (input.val().length === 0)
            return 0;
        if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return 1;
        }
        return 2;
    }
   
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass === 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
        
    });

    $(':input').each(function(){
        if ($(this).attr("name") != "email"){
            $(this) 
            .on('invalid', function(){
                return this.setCustomValidity('Bạn chưa nhập thông tin nè!');
            });
        }
        $(this).on('input propertychange', function(){
            return this.setCustomValidity('');
        });
    });

    $('input[name="email"]').on('invalid', function(){
        let check = validateEmail();
        if(check === 1){
            return this.setCustomValidity('Bạn hãy nhập EMAIL đã đăng ký vào đây nhé!');
        }else if(check == 0){
            return this.setCustomValidity('Bạn chưa nhập thông tin nè!');
        }else{
            return this.setCustomValidity('');
        }
    })
})(jQuery);