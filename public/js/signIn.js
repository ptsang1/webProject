(function ($) {
    "use strict";
    $('input[type="submit"]').click(function(){
        const checkEmail = validateEmail()
        if (checkEmail.length){
            let input = $('input[name="email"]')[0];
            return input.setCustomValidity(checkEmail);
        }
        if (!validatePassword()){
            let input = $('input[name="confirm_password"]')[0];
            return input.setCustomValidity('Mật khẩu xác nhận chưa đúng!');
        }
    });

    // $('input[type="submit"]').submit(function(event){
    //     if (!validateEmail()){
    //         let input = $('input[name="email"]')[0];
    //         input.setCustomValidity('Bạn hãy nhập EMAIL đã đăng ký nhé!');
    //         return isValidForm();
    //     }
    // });

    $('#register-form').submit(function() {
        $(this).ajaxSubmit({
          error: function(xhr) {
            status('Error: ' + xhr.status);
          },
         success: function(response) {
          console.log(response);
         }
        });
        //Very important line, it disable the page refresh.
        return false;
      });

    function validateEmail () {
        let input = $('input[name="email"]');
        if (input.val().length === 0)
            return 'Bạn chưa nhập thông tin nè!'
        if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return "Bạn hãy nhập EMAIL để đăng ký nhé!";
        }

        return "";
    }

    function validatePassword () {
        return $('input[name="password"]').val() === $('input[name="confirm_password"]').val();
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
        if ($(this).attr("name") != "email" || $(this).attr("name") != "confirm_password"){
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
        const checkEmail = validateEmail()
        if (checkEmail.length){
            return this.setCustomValidity(checkEmail);
        }
    })

})(jQuery);