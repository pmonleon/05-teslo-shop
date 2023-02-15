export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: ("admin" | "client")[];
  // crear createdAt y updatedAt
  createdAt?: string;
  updatedAt?: string;
}
