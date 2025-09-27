export interface User {
  id: string;
  name: string;
  email: string;
  interests: string[];
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  createdAt: string; // ISO 8601 date string
  text: string;
  rating: {
    content: number;
    instructor: number;
    practicality: number;
  };
  upvotes: number;
  downvotes: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  overview: string;
  url: string;
  imageUrl: string;
  platform: string;
  platformLogoUrl: string;
  instructor: string;
  subject: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  price: number; // 0 for free
  content: string[]; // topics covered
  reviews: Review[];
}

export interface DiscussionPost {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string; // ISO 8601 date string
}

export interface LearningPathStep {
  title: string;
  description: string;
  rationale: string;
}
