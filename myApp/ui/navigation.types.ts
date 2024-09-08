import { Product } from "../store/listings";

// types.ts
export type RootStackParamList = {
  SignIn: undefined; // No parameters expected
  SignUp: undefined; // No parameters expected
  ForgetPassword: undefined; // No parameters expected
  Home: undefined;
  Profile: undefined;
  Chats: undefined;
  Listings: undefined;
  SingleProduct: { product?: Product; id?: string };
  ChatWindow: {
    conversationId: string;
    peerProfile: { id: string; name: string; avatar?: string };
  };
  EditProduct: { product: Product };
  ProductList: { category: string };
};
