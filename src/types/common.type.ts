export enum SystemStatus {
  activated = 'activated',
  deactivated = 'deactivated',
  expired = 'expired',
  pending = 'pending',
  draft = 'draft',
}

export enum TransactionStatus {
  pending = 'pending',
  success = 'success',
  failed = 'failed',
}

export enum TransactionType {
  transfer = 'transfer',
  receive = 'receive',
}

export enum AccoutStatus {
  active = 'active',
  inactive = 'inactive',
  blocked = 'blocked',
  pending = 'pending',
}

export interface TransactionLogRelations {
  id: string;
  status: string;
  amount: number;
  senderAccount: string;
  receiverAccount: string;
  createdAt: string;
  type: string;
  description: string;
}
