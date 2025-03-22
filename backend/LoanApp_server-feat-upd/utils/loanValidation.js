
const { body, validationResult } = require('express-validator');

const saveDraftValidation = [
  body('amount').isNumeric().withMessage('Amount should be a number').notEmpty().withMessage('Amount is required'),
  body('repayment_schedule').isArray().withMessage('Repayment schedule should be an array').notEmpty().withMessage('Repayment schedule is required'),
  body('interest_rate').isFloat({ min: 0, max: 100 }).withMessage('Interest rate should be a valid number between 0 and 100').notEmpty().withMessage('Interest rate is required')
];

const submitLoanValidation = [
  body('loan_id').isString().withMessage('Loan ID should be a string').notEmpty().withMessage('Loan ID is required')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array()); 
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};



module.exports = {
  saveDraftValidation,
  submitLoanValidation,
  validate
};
