export interface Writer {
  name: string;
  image: string;
  quote: string;
  width?: number;
  height?: number;
}

export const WRITERS: Writer[] = [
  {
    name: "Ernest Hemingway",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/28/ErnestHemingway.jpg",
    quote: "Write hard. Write true.",
    width: 400,
    height: 600
  },
  {
    name: "Virginia Woolf",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg",
    quote: "A woman must have money and a room of her own.",
    width: 400,
    height: 600
  },
  {
    name: "F. Scott Fitzgerald",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/F_Scott_Fitzgerald_1921.jpg",
    quote: "You don't write because you want to say something.",
    width: 400,
    height: 600
  },
  {
    name: "Maya Angelou",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Angelou_at_Clinton_inauguration.jpg",
    quote: "There is no greater agony than bearing an untold story.",
    width: 400,
    height: 600
  },
  {
    name: "James Joyce",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/James_Joyce_by_Alex_Ehrenzweig%2C_1915_cropped.jpg/500px-James_Joyce_by_Alex_Ehrenzweig%2C_1915_cropped.jpg?20110226050215",
    quote: "Write a book that will make the world more beautiful.",
    width: 400,
    height: 600
  }
]; 