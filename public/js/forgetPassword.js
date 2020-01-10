(function ($) {
    "use strict";
    $('input[name="email"]').on('invalid', function(){
        let check = validateEmail();
        if(check.length > 0){
            return this.setCustomValidity(check);
        }
    })

    $('input[type="submit"]').click(function(){
        let input = $('input[name="email"]')[0];
        let check = validateEmail();
        if(check.length > 0){
            return input.setCustomValidity(check);
        }
    });

    $('#forgetPassword-form').submit(function(event){
        event.preventDefault();
        isEmailExisted();
    })

    function isEmailExisted(){
        const input = $('input[name="email"]')[0];
        $.getJSON(`/account/is-available?email=${$(input).val()}`, function (data) {
            if (data.length === 0){
                input.setCustomValidity("Email của bạn chưa được đăng ký tài khoản!");
                input.reportValidity();
            }else{
                alert('Chúng tôi đã gửi mail xác nhận đổi mật khẩu đến bạn. Vui lòng kiểm tra mail!');
                $('#forgetPassword-form').off('submit').submit();
            }
        })
    }

    function validateEmail () {
        const input = $('input[name="email"]')[0];
        if ($(input).val().length === 0)
            return 'Bạn chưa nhập thông tin nè!'
        if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return "Bạn hãy nhập EMAIL để đăng ký nhé!";
        }
        return "";
    }

    $(':input[name="email"]').each(function(){
            $(this) 
            .on('input propertychange', function(){
            return this.setCustomValidity('');
        });
    });
})(jQuery);