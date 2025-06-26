export interface EditorsPick {
  title: string;
  backgroundImage: string;
  tag: string;
  headline: string;
  subheadline: string;
  author: string;
}

export const EDITORS_PICK: EditorsPick = {
  title: "Editors Pick",
  backgroundImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", // Example Unsplash image
  tag: "Writing Advice",
  headline: "How to Write with Clarity in 2024",
  subheadline: "Modern tips from top editors for cutting through the noise.",
  author: "Jane Doe"
}; 