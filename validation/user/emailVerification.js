const Validator = require('validator');
const isEmpty = require('../isEmpty');


const emailVerification = (data) => {
    let errors = {}
    data.email = !isEmpty(data.email) ? data.email : '';
    data.otp = !isEmpty(data.otp) ? data.otp : '';

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }
     
    if (!Validator.isLength(data.otp, { min: 6, max: 6 })) {
        errors.otp = 'Otp must be of 6 character';
    }

    if (Validator.isEmpty(data.otp)) {
        errors.otp = 'Otp field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

}


module.exports = emailVerification