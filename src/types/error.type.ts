export enum ErrorCode {
  EmailExists = '1001',
  PhoneExists = '1002',
  CustomerNotFound = '1003',
  AmountNotEnough = '1004',
  SourceAccountNotFound = '1005',
  TargetAccountNotFound = '1006',
  AccountNotFound = '1007',
  AmountNotSmallerMin = '1008',
}

export class MappingMessageError extends Error {
  statusCode: number;
  code: ErrorCode;
  details?: object;

  constructor(errorCode: ErrorCode, statusCode = 400, details?: object) {
    super(errors[errorCode] + ` (${errorCode})`);
    this.statusCode = statusCode;
    this.code = errorCode;
    this.details = details;
  }
}

const errors = {
  [ErrorCode.EmailExists]: 'Email đã tồn tại',
  [ErrorCode.PhoneExists]: 'Số điện thoại đã tồn tại',
  [ErrorCode.CustomerNotFound]: 'Khách hàng không tồn tại',
  [ErrorCode.AmountNotEnough]: 'Số dư không đủ',
  [ErrorCode.SourceAccountNotFound]: 'Tài khoản nguồn không tồn tại',
  [ErrorCode.TargetAccountNotFound]: 'Tài khoản đích không tồn tại',
  [ErrorCode.AccountNotFound]: 'Tài khoản không tồn tại',
  [ErrorCode.AmountNotSmallerMin]:
    'Số tiền không nhỏ hơn số tiền tối thiểu 10.000',
};
