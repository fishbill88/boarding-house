export enum UserRole {
  TENANT = 'TENANT',
  LANDLORD = 'LANDLORD',
}

export enum TenantStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum BillingType {
  ONE_TIME = 'ONE_TIME',
  MONTHLY = 'MONTHLY',
  FREE = 'FREE',
}

export enum ApplianceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum BillType {
  RENT = 'RENT',
  ELECTRIC = 'ELECTRIC',
  WATER = 'WATER',
  APPLIANCE = 'APPLIANCE',
  CUSTOM = 'CUSTOM',
}

export enum BillStatus {
  UNPAID = 'UNPAID',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface House {
  id: string;
  houseCode: string;
  name: string;
  address: string;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HouseSettings {
  id: string;
  houseId: string;
  rentAmount: number;
  rentDueDay: number;
  electricityEnabled: boolean;
  waterEnabled: boolean;
  notifyDaysBefore: number;
  gracePeriodDays: number;
  customBillings: unknown[];
  updatedAt: string;
}

export interface TenantProfile {
  id: string;
  userId: string;
  houseId: string;
  roomNumber?: string;
  moveInDate?: string;
  validIdUrl?: string;
  status: TenantStatus;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  tenantId: string;
  houseId: string;
  type: BillType;
  amount: number;
  dueDate: string;
  billingMonth: number;
  billingYear: number;
  status: BillStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  billId: string;
  tenantId: string;
  amount: number;
  proofImageUrl?: string;
  submittedAt: string;
  reviewedAt?: string;
  status: PaymentStatus;
  rejectionReason?: string;
  addedByLandlord: boolean;
}

export interface Appliance {
  id: string;
  tenantId: string;
  houseId: string;
  name: string;
  description?: string;
  watts?: number;
  registrationFee: number;
  billingType: BillingType;
  status: ApplianceStatus;
  createdAt: string;
  updatedAt: string;
}

export enum NotificationType {
  PAYMENT_SUBMITTED = 'payment-submitted',
  PAYMENT_APPROVED = 'payment-approved',
  PAYMENT_REJECTED = 'payment-rejected',
  APPLIANCE_APPROVED = 'appliance-approved',
  APPLIANCE_REJECTED = 'appliance-rejected',
  AUTO_OVERDUE = 'auto-overdue',
  BILL_REMINDER = 'bill-reminder',
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  data: Record<string, unknown>;
  createdAt: string;
}
