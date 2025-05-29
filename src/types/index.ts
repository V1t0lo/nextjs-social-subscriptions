export interface Post {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "image" | "video";
}
