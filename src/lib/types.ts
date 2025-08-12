
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  carbonIntensity: number; // in kg CO2e per kg of product
  isOrganic: boolean;
  category: 'Meat' | 'Dairy' | 'Produce' | 'Grains' | 'Clothing' | 'Electronics' | 'Home Goods' | 'Automotive' | 'Energy' | 'Transportation';
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
