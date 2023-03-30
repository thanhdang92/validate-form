Validator = function (option) {
    var formElement = document.querySelector(option.form)
    if (formElement) { 
        //Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            option.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector);
                validate(inputElement, rule)
            });

         }


        var selectorRules = {}; // khởi tạo selectorRules bằng chuỗi rỗng
        
        const validate = (inputElement, rule) => {
        //  Lấy ra các rule của selector
            var rules = selectorRules[rule.selector];
            var errorMess;
        // lặp qua các rules và kiểm tra
            // nếu có lỗi thì dừng lặp (break)
         for (var i = 0; i < rules.length; i++) { 
             var errorMess = rules[i](inputElement.value)
             if (errorMess) break;
         }
        
            var erroElement = inputElement.parentElement.querySelector(option.errorSelector)
                if (errorMess) {
                    erroElement.innerText = errorMess;
                    inputElement.parentElement.classList.add('invalid');
                } else { 
                    erroElement.innerText = "";
                    inputElement.parentElement.classList.remove('invalid');
                }
         }
        option.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector)
            // Nêu selectorRules[rule.selector] không phải là một cái Arr thì gán cho nó 
            // bằng một cái Arr bằng [rule.test]
            // sau khi đc gán thành 1 mảng thì tiếp tục push rule.test vào để có
            // một selectorRules = một mảng có nhìu rule.test
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else { 
                selectorRules[rule.selector] = [rule.test];
            }
            inputElement.onblur = function () { 
                validate(inputElement, rule);
            }
            // Khi người dùng nhập value vào ô input thì mất remove lỗi
            inputElement.oninput = function () { 
            var erroElement = inputElement.parentElement.querySelector(option.errorSelector)
                erroElement.innerText = "";
                inputElement.parentElement.classList.remove('invalid');
            };
        });
        
    }
}

Validator.isRequired = function (selector, message) { 
    return {
        selector: selector,
        test: function (value) { 
            return value.trim() ? undefined : message || "vui long nhap du lieu";
        }
    }
}

Validator.isEmail = function (selector, message) { 
     return {
        selector: selector,
        test: function (value) { 
            var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regexEmail.test(value) ? undefined : message || "Vui long nhap dung Email"
        }
    }
}
Validator.isWebsite = function (selector, message) { 
    return {
        selector: selector,
        test: function (value) { 
            var regexWebsite = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)(?:\.[a-zA-Z]+)+$/;
            return regexWebsite.test(value) ? undefined : message || "Vui long nhap dung Website";
        }
    }
}

Validator.isAge = function (selector, message) { 
    return {
        selector: selector,
        test: function (value) { 
            return value ? undefined : message || "Vui long nhap dung tuoi"
        }
    }
}

Validator.isPassword = function (selector, message, minLength) { 
    return {
        selector: selector,
        test: function (value) { 
            return value.length >= minLength ? undefined : message || "Vui long nhap password"
        }
    }
}

Validator.isConfirmationPassword = function (selector, message, getConfirmation) { 
    return {
        selector: selector,
        test: function (value) { 
            return value === getConfirmation() ? undefined : message || "Vui long nhap dung password"
        }
    }
}