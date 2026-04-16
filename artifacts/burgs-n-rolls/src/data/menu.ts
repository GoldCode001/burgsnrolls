export interface MenuItem {
  id: string;
  code: string;
  name: string;
  image: string | null;
  ingredients: string[];
  category: string;
  price: string;
}

export interface Category {
  id: string;
  label: string;
}

export const categories: Category[] = [
  { id: "wraps", label: "Wraps & Durumlar" },
  { id: "kids", label: "Kids Menu" },
  { id: "salads", label: "Salads" },
];

export const menuItems: MenuItem[] = [
  {
    id: "d1",
    code: "D1",
    name: "B&R Special Wrap",
    image: "/d1.jpeg",
    ingredients: ["Chicken Pieces", "Fries", "Special Sauces", "Ayran"],
    category: "wraps",
    price: "230₺",
  },
  {
    id: "d2",
    code: "D2",
    name: "Chicken Popcorn",
    image: "/d2.jpeg",
    ingredients: ["Chicken Pops", "Fries", "Ketchup", "Mayonnaise", "Cabbage", "Lettuce", "Ayran"],
    category: "wraps",
    price: "220₺",
  },
  {
    id: "d3",
    code: "D3",
    name: "Mexican Crazy",
    image: "/d3.jpeg",
    ingredients: ["Chicken Pieces", "Fries", "Hot Sauce", "Salad", "Ayran"],
    category: "wraps",
    price: "240₺",
  },
  {
    id: "d4",
    code: "D4",
    name: "Chicken Grilled",
    image: "/d4.jpeg",
    ingredients: ["Chicken Grilled", "Fries", "Ketchup", "Mayonnaise", "Cabbage", "Lettuce", "Ayran"],
    category: "wraps",
    price: "250₺",
  },
  {
    id: "d5",
    code: "D5",
    name: "Tuna (Ton Balık)",
    image: "/d5.jpeg",
    ingredients: ["Tuna Fish", "Fries", "Salads", "Ketchup", "Mayonnaise", "Ayran"],
    category: "wraps",
    price: "220₺",
  },
  {
    id: "d6",
    code: "D6",
    name: "Vegan Wrap",
    image: "/d6.jpeg",
    ingredients: ["Onion Rings", "Carrots", "Fries", "Cabbage", "Lettuce", "Ayran"],
    category: "wraps",
    price: "200₺",
  },
  {
    id: "d7",
    code: "D7",
    name: "Beef Kebap Special (Et Durum)",
    image: "/d7.jpeg",
    ingredients: ["Beef", "Mix Spices", "Fries", "Sauces", "Cabbage", "Lettuce", "Ayran"],
    category: "wraps",
    price: "270₺",
  },
  {
    id: "d8",
    code: "D8",
    name: "Mixed Wrap (Karışık Dürüm)",
    image: "/d8.jpeg",
    ingredients: ["Chicken", "Beef", "Fries", "Sauces"],
    category: "wraps",
    price: "320₺",
  },
  {
    id: "d9",
    code: "D9",
    name: "Onion Rings BBQ Chicken",
    image: "/d9.jpeg",
    ingredients: ["Chicken", "Onion Rings", "Fries", "Sauces"],
    category: "wraps",
    price: "250₺",
  },
  {
    id: "a1",
    code: "A1",
    name: "Burger",
    image: null,
    ingredients: [],
    category: "kids",
    price: "260₺",
  },
  {
    id: "a2",
    code: "A2",
    name: "Kids Chicken Nuggets",
    image: null,
    ingredients: [],
    category: "kids",
    price: "230₺",
  },
  {
    id: "a3",
    code: "A3",
    name: "3 Mozzarella Sticks + Ayran",
    image: null,
    ingredients: [],
    category: "kids",
    price: "150₺",
  },
  {
    id: "a4",
    code: "A4",
    name: "Fries (Çips)",
    image: null,
    ingredients: [],
    category: "kids",
    price: "160₺",
  },
  {
    id: "s1",
    code: "S1",
    name: "Popcorn Salad",
    image: null,
    ingredients: ["Popcorn Chicken", "Fresh Salad", "Ayran"],
    category: "salads",
    price: "240₺",
  },
  {
    id: "s2",
    code: "S2",
    name: "Grilled Salad",
    image: null,
    ingredients: ["Grilled Chicken", "Fresh Salad", "Ayran"],
    category: "salads",
    price: "260₺",
  },
  {
    id: "s3",
    code: "S3",
    name: "Tuna Salad (Ton Balık)",
    image: null,
    ingredients: ["Tuna Fish", "Fresh Salad", "Ayran"],
    category: "salads",
    price: "250₺",
  },
  {
    id: "s4",
    code: "S4",
    name: "Vegetarian Salad",
    image: null,
    ingredients: ["Fresh Vegetables", "Salad Mix", "Ayran"],
    category: "salads",
    price: "220₺",
  },
];
