export enum UserType {
  ROOT = 'Root',
}

export enum PACKAGE {
  BASIC = 'Basic',
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
}

export enum PLAN {
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'In-Active',
}

export enum Owner {
  SELF = 'Self',
  PARTNER = 'Partner',
  JOINT = 'Joint',
}

export enum Frequency {
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
  BI_WEEKLY = 'Bi-Weekly',
  SEMI_MONTHLY = 'Semi-Monthly',
}

export enum PAYMENT_METHOD {
  AUTO_DEBIT = 'Auto Debit',
  AUTO_TRANSFER = 'Auto Transfer',
  BILL_PAY = 'Bill Pay',
  CHECK_CASH = 'Check or Cash',
  DEBT_CREDIT = 'Debit or Credit',
}

export enum SAV_RET_TYPE {
  SAVINGS = 'Savings',
  RETIREMENTS = 'Retirements',
}

export enum DEBT_CATEGORY {
  CREDIT_CARD = 'Credit Card',
  DEPARTMENT_STORE = 'Department Store',
  FAMILY_FRIEND_LOAN = 'Family/Friend Loan',
  MEDICAL_DEBT = 'Medical Debt',
  PERSONAL_LOAN = 'Personal Loan',
  STUDENT_LOAN = 'Student Loan',
  OTHER_DEBT = 'Other Debt',
}

export enum EXPENSES_CATEGORY {
  HOUSING = 'Housing',
  TRANSPORTATION = 'Transportation',
  CHARITY = 'Charity',
  FOOD = 'Food',
  ENTERTAINMENT = 'Entertainment',
  CHILDREN = 'Children',
  PARENT_ELDER_CARE = 'Parents/Elder Care',
  PETS_ANIMAL = 'Pets/Animals',
  HEALTH_MEDICAL = 'Health/Medical',
  OTHER_INSURANCE = 'Other Insurance',
  HOUSEHOLD_PERSONAL_CARE_AND_GIFTS = 'Household, Personal Care & Gifts',
  DUES_SUBSCRIPTIONS = 'Dues/Subscriptions',
  RECREATION = 'Recreation',
  VACATIONS = 'Vacations',
  RENTAL_PROPERTY = 'Rental Property',
  JOINT_CONTRIBUTION = 'Joint Contribution',
  OTHER_EXPENSE = 'Other Expense',
}

export enum TRANSACTION_TYPE {
  WITHDRAWAL = 'Withdrawal',
  CREDIT = 'Credit',
}

export enum GOAL_TYPE {
  DEBT = 'Debt',
  EXPENSE = 'Expense',
  MAIN = 'Main',
}

export enum MAIN_CATEGORY {
  EXPENSES = 'Expenses',
  DEBTS = 'Debts',
  RETIREMENT = 'Retirement',
  SAVINGS = 'Savings',
}
