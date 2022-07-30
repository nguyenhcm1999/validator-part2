function Validator(formSelector){
    function getParent(element,selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var formRules = {}
    /*
    Quy ước tạo rule:
    - Nếu có lỗi return `error message`
    - Nếu không có lôi thì return `undefined`
    */
    var validatorRules = {
        required:function(value){
            return value ? undefined : 'Vui lòng nhập trường này'
        },
        email:function(value){
            var regax =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
            return regax.test(value) ? undefined : 'Vui lòng nhập email'
        },
        min:function(min){
            return function(value){
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự`
            }
        },
        max:function(max){
            return function(value){
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${min} ký tự`
            }
        },
    };


    var test = ["required","email"]
    for (var key in test) {
        // for in lặp qua thuộc tính của đối tượng
        console.log(key) // 0 1
        console.log(validatorRules[key]) // undefined
        console.log(test[key]) // required email
        console.log(validatorRules[test[key]])
    }
    for (var key of test) {
        // for of lặp qua giá trị của đối tượng
        console.log(key)
        console.log(validatorRules[key])
        console.log(validatorRules['required'])
    }


    // Lấy ra form element trong DOM theo  `formSelector`
    var formElement = document.querySelector(formSelector)

    // Chỉ xử lý khi có element trong DOM
    if(formElement){

        var inputs = formElement.querySelectorAll('[name][rules]')

        for (var input of inputs){
    // rules là attribute tự định nghĩa ra không hợp lệ nên phải sử dụng phương thức getAttribute
            // [required] ["required", "email"] ["required", "min:6"]
            var rules = input.getAttribute('rules').split('|'); 
            for (var rule of rules) {
                // Đặt biến var ruleInfo bên ngoài để ruleInfo[1] hoạt động được
                var ruleInfo;
                var isRuleHasValue = rule.includes(':');

                // rule: required required email required  min:6
                if(isRuleHasValue){
                    ruleInfo = rule.split(':') 
    // cắt chuỗi string thành mảng trả về ["min","6"] và lấy ra phần tử đầu tiên rule 0 là min
                    console.log(ruleInfo)
                    rule = ruleInfo[0]
                    console.log(validatorRules[rule](ruleInfo[1]))
                }

                var ruleFunc = validatorRules[rule]

    // Giải thích trong trường hợp rule có dấu : thì ruleFunc sẽ truyền ruleInfo[1] vào
                if(isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1])
                }
                // rule: required required email required min
                console.log(rule) 
                if(Array.isArray(formRules[input.name])){
                // lần thứ 2 input name là email thêm rule 2 vào mảng là email
                    formRules[input.name].push(ruleFunc)
                } else {
                // lần thứ 1 input name là full name gán rule là required
                // lần thứ 2 input name là email gán rule là required
                    formRules[input.name] = [ruleFunc]
                    // console.log(validatorRules[rule])
                }
            }
            // console.log(input)
    // rules là attribute tự định nghĩa ra không hợp lệ nên phải sử dụng phương thức getAttribute
            // formRules[input.name] = input.getAttribute('rules')


            // Lắng nghe sự kiện để validate sự kiện blur, change, ...
            input.onblur = handleValidate
            input.oninput = handleClearError
        }

        // Hàm thực hiện Validate
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage
            for (var i in rules) {
                console.log(rules)  
                errorMessage = rules[i](event.target.value)
            if (errorMessage) break;
            }

            if (errorMessage) {
                var formGroup = getParent(event.target,'.form-group')
                if (formGroup) {
                    formGroup.classList.add('invalid')
                    var formMessage = formGroup.querySelector('.form-message')
                    if (formMessage) {
                        formMessage.innerText = errorMessage
                    }
                }
                console.log(formGroup)
            }
        }
        console.log(formRules)

        // Hàm clear message lỗi
        function handleClearError(event) {
            var formGroup = getParent(event.target,'.form-group');
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')

                var formMessage = formGroup.querySelector('.form-message')
                    if (formMessage) {
                        formMessage.innerText = ''
                    }
            }
        }
    }
}