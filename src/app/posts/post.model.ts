export interface PostModel {
  id: string | null;
  title: string;
  content: string;
  image: string | File;
  creator: string;
}
