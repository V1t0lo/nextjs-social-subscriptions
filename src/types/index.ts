export interface Post {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
  user: {
    id: string
    name: string;
  };
}

export interface PublicUser {
  id: string;
  name: string | null;
  email: string;
  //image: string | null;
  followerCount: number;
  subscriberCount: number;
}
