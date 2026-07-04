export interface Property {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  price: number;
  priceUnit: "month" | "year";
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  tags: string[];
  isVerified: boolean;
  isAIMatched: boolean;
  agentName: string;
  agentAvatar: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  listings: number;
  rating: number;
  verified: boolean;
}
