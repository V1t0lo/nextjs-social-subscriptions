export interface Post {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
  user: {
    name: string;
  };
}
