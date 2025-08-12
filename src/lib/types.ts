
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  carbonIntensity: number; // in kg CO2e per kg of product
  isOrganic: boolean;
  category: 'Clothing' | 'Electronics' | 'Groceries' | 'Home Goods';
  price: number;
  isSustainableSwap?: boolean; // Optional flag for cart items
  ecoCreds?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  points: number;
}


export interface Recommendation extends Product {
  comparison: string;
  ecoCreds: number;
}
