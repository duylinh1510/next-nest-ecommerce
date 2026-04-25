export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
