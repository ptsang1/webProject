(function ($) {
    "use strict";

    $(':input').each(function(){
        if ($(this).attr("name") === "password"){
            $(this) 
            .on('invalid', function(){
                return this.setCustomValidity('Bạn chưa nhập thông tin nè!');
            });
        }
    
        $(this) 
            .on("input change", function(){
                    return this.setCustomValidity("");
            });
    });

    $('input[name="confirmpassword"]').on('invalid', function(){
        const message = validateConfirm_password();
        if (message.length > 0){
            return this.setCustomValidity(message);
        }
        return this.setCustomValidity("");
    });

    $('input[name="confirmpassword"]').on('input change', function(){
        return this.setCustomValidity("");
    });

    $('input[type="submit"]').click(function(){
        const messageConfirm_Password = validateConfirm_password();
        if (messageConfirm_Password.length > 0){
            let input = $('input[name="confirmpassword"]')[0];
            return input.setCustomValidity(messageConfirm_Password);
        }
        alert('Bạn đã đổi mật khẩu thành công!');
    });

    function validateConfirm_password () {
        if ($('input[name="confirmpassword"]').val().length === 0){
            return "Bạn chưa nhập thông tin nè!";
        }else if($('input[name="password"]').val() != 
                 $('input[name="confirmpassword"]').val()){
            return "Mật khẩu xác nhận chưa đúng!";
        }
        return "";
    }
})(jQuery);