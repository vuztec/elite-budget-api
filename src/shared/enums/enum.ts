export enum UserType {
  ROOT = 'Root',
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
  AUTO_DEBIT = 'Auto Debt',
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
  MEDICLE_DEBT = 'Medicle Debt',
  PERSONAL_LOAN = 'Personal Loan',
  STUDENT_LOAN = 'Student Loan',
  OTHER = 'Other',
}

export enum EXPENSES_CATEGORY {
  HOUSING = 'Housing',
  TRANSPORTATION = 'Transportation',
  CHARITY = 'Charity',
  FOOD = 'Food',
  ENTERTAINMENT = 'Entertainment',
  CHILDREN = 'Children',
  PARENT_ELDER_CARE = 'Parent/Elder Care',
  PETS_ANIMAL = 'Pets/Animal',
  HEALTH_MEDICLE = 'Health Medicle',
  OTHER_INSURANCE = 'Other Insurance',
  HOUSEHOLD_PERSONAL_CARE_AND_GIFTS = 'Household, Personal Care & Gifts',
  DUES_SUBSCRIPTIONS = 'Dues/Subscriptions',
  RECREATION = 'Recreation',
  VACATIONS = 'Vacations',
  RENTAL_PROPERTY = 'Rental Property',
}

export enum TRANSACTION_TYPE {
  WITHDRAWAL = 'Withdrawal',
  CREDIT = 'Credit',
}
