import { IUser } from "./user";

export interface IOrderItem {
  _id?: string;
  title: string;
  size: string;
  gender: string;
  quantity: number;
  slug: string;
  image: string;
  price: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
  telephone: string;
}

export interface IOrder {
  _id?: string;
  user?: IUser | string;
  orderItems: IOrderItem[];
  shippingAddress: ShippingAddress;
  paymentResult?: string;
  numberOfItems: number;
  subtotal: number;
  tax: number;
  total: number;
  isPaid: boolean;
  paidAt?: string;
  transactionId?: string;
  // crear createdAt y updatedAt
  createdAt?: string;
  updatedAt?: string;
}
