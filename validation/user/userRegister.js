const Validator = require('validator');
const isEmpty = require('../isEmpty');


const validateUserRegisterInput = (data) => {
    let errors = {}
    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.organization = !isEmpty(data.organization) ? data.organization : '';


    if (!Validator.isLength(data.firstName, { min: 3, max: 30 })) {
        errors.firstName = 'First name must be between 3 and 30 characters';
    }

    if (Validator.isEmpty(data.firstName)) {
        errors.firstName = 'First Name field is required';
    }

    if (!Validator.isLength(data.lastName, { min: 3, max: 30 })) {
        errors.lastName = 'Last Name must be between 3 and 30 characters';
    }

    if (Validator.isEmpty(data.lastName)) {
        errors.lastName = 'Last Name field is required';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (!Validator.isLength(data.password, { min: 5 })) {
        errors.password = 'Password must contain atleast 5 character';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (!Validator.isLength(data.organization, { min: 3 })) {
        errors.organization = 'Organization must contain atleast 3 character';
    }

    if (Validator.isEmpty(data.organization)) {
        errors.organization = 'Organization field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

}


module.exports = validateUserRegisterInput 