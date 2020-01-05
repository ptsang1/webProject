(function ($) {
    "use strict";

    $(':input').each(function(){
        if ($(this).attr("name") === "name" ||
            $(this).attr("name") === "gender" ||
            $(this).attr("name") === "address" ||
            $(this).attr("name") === "password"){
            $(this) 
            .on('invalid', function(){
                return this.setCustomValidity('Bạn chưa nhập thông tin nè!');
            });
        }
    
        $(this) 
            .on("input propertychange", function(){
                    return this.setCustomValidity("");
            });
    });

    $('input[name="email"]').on('invalid', function(){
        let check = validateEmail();
        if(check.length > 0){
            return this.setCustomValidity(check);
        }
    })

    $('input[name="confirm_password"]').on('invalid', function(){
        const message = validateConfirm_password();
        if (message.length > 0){
            return this.setCustomValidity(message);
        }
        return this.setCustomValidity("");
    });

    // $('input[name="email"]').on({
    //     invalid: function(){
    //         const message = validateEmail();
    //         if (message.length > 0){
    //             return this.setCustomValidity(message);
    //         }
    //         return this.setCustomValidity("");
    //     },
    //     change: function(){
    //         return this.setCustomValidity("");
    //     },
    //     input: function(){
    //         return this.setCustomValidity("");
    //     }
    // });

    $('input[name="agree-term"]').on({
        invalid: function(){
            return this.setCustomValidity('Bạn chưa chọn ô này!');
        },
        change: function(){
            return this.setCustomValidity("");
        },
        input: function(){
            return this.setCustomValidity("");
        }
    });   

    $('input[name="birthday"]').on({
        invalid: function(){
            return this.setCustomValidity("Ngày sinh không hợp lệ!");
        },
        change: function(){
            return this.setCustomValidity("");
        },
        input: function(){
            return this.setCustomValidity("");
        }
    });

    $('input[type="submit"]').click(function(){
        const messageEmail = validateEmail();
        if (messageEmail.length > 0){
            let input = $('input[name="email"]')[0];
            return input.setCustomValidity(messageEmail);
        }
        isEmailExisted().then(function(data){
            if (data.length > 0){
                let input = $('input[name="email"]')[0];
                return input.setCustomValidity(data);
            }
        });
        const messageConfirm_Password = validateConfirm_password();
        if (messageConfirm_Password.length > 0){
            let input = $('input[name="confirm_password"]')[0];
            return input.setCustomValidity(messageConfirm_Password);
        }
        if (!reCaptchaCheck()){
            alert("Bạn chưa chọn reCaptcha kìa!");
            return false;
        }
        return true;
    });

    function validateEmail () {
        const input = $('input[name="email"]')[0];
        if ($(input).val().length === 0)
            return 'Bạn chưa nhập thông tin nè!'
        if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return "Bạn hãy nhập EMAIL để đăng ký nhé!";
        }
        return "";
    }

    function isEmailExisted(){
        const input = $('input[name="email"]')[0];
        const email = CryptoJS.AES.encrypt($(input).val(), "ptSang").toString();
        return $.getJSON(`account/signup/is-available?email=${email}`).then(function (data) {
            return data;
        });
    }

    function validateConfirm_password () {
        if ($('input[name="confirm_password"]').val().length === 0){
            return "Bạn chưa nhập thông tin nè!";
        }else if($('input[name="password"]').val() != 
                 $('input[name="confirm_password"]').val()){
            return "Mật khẩu xác nhận chưa đúng!";
        }
        return "";
    }

    function reCaptchaCheck(){
        return grecaptcha.getResponse() != 0
    }
})(jQuery);