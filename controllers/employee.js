const bcrypt = require('bcryptjs')


//Model
const User = require('../models/user')



//For email
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');



module.exports = {
    addEmployee: async (req, res, next) => {
        try {
            let errors = {}
            if (req.user.role !== "super-admin") {
                errors.role = "Now allowed to add new User"
                return res.status(400).json(errors)
            }
            const { firstName, lastName, email, password, role } = req.body;
            let hashedPassword = await bcrypt.hash(password, 10)
            const generateOTP = () => {
                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 6; i++) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }
                return OTP;
            }
            const otp = generateOTP()
            const newEmployee = await new User({
                firstName,
                lastName,
                email,
                role,
                otp,
                password: hashedPassword,
                organization: req.user.organization
            })
            await newEmployee.save()
            const msg = {
                to: newEmployee.email,
                from: 'hemant@edunomics.in',
                subject: 'Accout verification for Idea Deployer',
                text: 'Your verification code for registration is ' + otp
            };
            await sgMail.send(msg)
            return res.status(201).json({
                message: "New Employee added",
                result: newEmployee,
                success: true
            })
        }
        catch (err) {
            console.log("Error in addEmployee", err)
            return res.status(400).json({
                success: false,
                message: `Error in addEmployee ${err.message}`
            })
        }
    },
    updateEmployee: async (req, res, next) => {
        try {
            const { employeeId } = req.params;
            const { firstName, lastName, role, password } = req.body;
            const employee = await User.findById(employeeId)
            if (!employee) {
                return res.status(404).json({
                    message: 'User not found',
                    success: false
                })
            }
            if (firstName) {
                employee.firstName = firstName
            }
            if (lastName) {
                employee.lastName = lastName
            }
            if (role) {
                employee.role = role
            }
            await employee.save()
            return res.status(200).json({
                success: true,
                message: "Updated successfully",
                result: employee
            })
          
        }
        catch (err) {
            console.log("Error in updateEmployee", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in updateEmployee ${err.message}`
            })
        }
    },
    deleteEmployee: async (req, res, next) => {
        try {

            const { employeeId } = req.params;
            const employee = await User.findByIdAndRemove(employeeId)
            if (!employee) {
                return res.status(400).json({
                    success: false,
                    message: "user not found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "user deleted successfully",
                result: employee
            })
        }
        catch (err) {
            console.log("Error in deleteEmployee", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in deleteEmployee ${err.message}`
            })
        }
    },
    getEmployee: async (req, res, next) => {
        try {
            const { organization } = req.user
            const employees = await User.find({ organization })
            if (employees.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No employees found"
                })
            }
            return res.status(200).json({
                success: true,
                result: employees
            })
        }
        catch (err) {
            console.log("Error in getEmployee", err.message)
            return res.status(400).json({
                success: false,
                message: `Error in getEmployee ${err.message}`
            })
        }
    }
}


