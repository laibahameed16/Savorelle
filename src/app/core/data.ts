export type Category = 'Starters' | 'Mains' | 'Pasta & Rice' | 'Desserts';

export interface Dish {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: Category;
  image: string;
  /** how the round plate is animated on cards: continuous spin (cw / ccw) or float + spin on hover */
  anim: 'spin' | 'spin-rev' | 'float';
  description: string;
  ingredients: string[];
  tags: string[];
  prep: string;
}

export const CATEGORIES: ('All' | Category)[] = ['All', 'Starters', 'Mains', 'Pasta & Rice', 'Desserts'];

export const DISHES: Dish[] = [
  { id: 'truffle-pasta', name: 'Truffle Pasta', price: 65, rating: 5.0, category: 'Pasta & Rice', image: 'img/pasta-plate.jpg', anim: 'spin',
    description: 'Hand-cut farfalle tossed with wild mushrooms, wilted spinach and shaved black truffle in a silky parmesan cream.',
    ingredients: ['Farfalle', 'Black truffle', 'Wild mushrooms', 'Spinach', 'Parmesan'], tags: ['Vegetarian', 'Signature'], prep: '20 min' },
  { id: 'sea-urchin-risotto', name: 'Sea Urchin Risotto', price: 90, rating: 4.9, category: 'Pasta & Rice', image: 'img/risotto-plate.jpg', anim: 'float',
    description: 'Creamy saffron risotto crowned with fresh uni, tiger prawns, cherry tomatoes and a hint of spring onion.',
    ingredients: ['Arborio rice', 'Sea urchin', 'Tiger prawns', 'Saffron', 'Cherry tomato'], tags: ['Seafood', 'Chef pick'], prep: '25 min' },
  { id: 'matcha-lava-cake', name: 'Matcha Lava Cake', price: 35, rating: 5.0, category: 'Desserts', image: 'img/matcha-plate.jpg', anim: 'spin-rev',
    description: 'Warm ceremonial-grade matcha cake with a molten centre, served with whipped cream and candied orange.',
    ingredients: ['Matcha', 'White chocolate', 'Cream', 'Orange', 'Sesame'], tags: ['Vegetarian', 'Sweet'], prep: '15 min' },
  { id: 'teriyaki-wings', name: 'Teriyaki Wings', price: 28, rating: 4.8, category: 'Starters', image: 'img/hero-wings-plate.jpg', anim: 'float',
    description: 'Crispy, saucy wings lacquered in house teriyaki and finished with toasted sesame.',
    ingredients: ['Chicken wings', 'Teriyaki glaze', 'Sesame', 'Ginger', 'Soy'], tags: ['Spicy', 'Popular'], prep: '15 min' },
  { id: 'wagyu-steak', name: 'Peppercorn Wagyu', price: 120, rating: 4.9, category: 'Mains', image: 'img/gallery-steak-plate.jpg', anim: 'spin',
    description: 'Seared A5 wagyu with a red peppercorn crust, finished on a cast-iron pan and rested for tenderness.',
    ingredients: ['A5 wagyu', 'Red peppercorn', 'Butter', 'Thyme', 'Sea salt'], tags: ['Premium', 'Chef pick'], prep: '30 min' },
  { id: 'glazed-short-rib', name: 'Glazed Short Rib', price: 58, rating: 4.7, category: 'Mains', image: 'img/gallery-steak2-plate.jpg', anim: 'float',
    description: 'Slow-braised for twelve hours and glazed in a dark reduction until it falls from the bone.',
    ingredients: ['Beef short rib', 'Red wine', 'Shallot', 'Rosemary', 'Demi-glace'], tags: ['Slow cooked'], prep: '25 min' },
  { id: 'herb-chicken-salad', name: 'Herb Chicken Salad', price: 42, rating: 4.6, category: 'Starters', image: 'img/salad-plate.jpg', anim: 'spin-rev',
    description: 'Sliced roast chicken with golden potatoes, crisp greens and a lemon-herb dressing.',
    ingredients: ['Roast chicken', 'Baby potatoes', 'Greens', 'Lemon', 'Herbs'], tags: ['Light'], prep: '12 min' },
  { id: 'garden-noodles', name: 'Garden Noodle Stir Fry', price: 38, rating: 4.7, category: 'Pasta & Rice', image: 'img/noodles.jpg', anim: 'float',
    description: 'Wok-tossed noodles with seasonal vegetables, crisp shallots and a smoky soy glaze.',
    ingredients: ['Egg noodles', 'Seasonal vegetables', 'Soy', 'Garlic', 'Shallots'], tags: ['Vegetarian'], prep: '15 min' },
  { id: 'truffle-penne', name: 'Truffle Penne', price: 52, rating: 4.8, category: 'Pasta & Rice', image: 'img/penne-plate.jpg', anim: 'spin',
    description: 'Al dente penne with sauteed mushrooms and a snowfall of aged pecorino.',
    ingredients: ['Penne', 'Mushrooms', 'Pecorino', 'Olive oil', 'Black pepper'], tags: ['Vegetarian'], prep: '18 min' },
];

export const CHEFS = [
  { name: 'James Carlow', role: 'Executive Chef', image: 'img/chef-james.jpg', bio: 'Twenty years of fire, steel and patience. James leads our kitchen with a love for smoke and slow cooking.' },
  { name: 'Elena Morin', role: 'Pastry & Dessert Chef', image: 'img/chef-elena.jpg', bio: 'Elena turns sugar, matcha and citrus into the final, unforgettable chapter of every dinner.' },
  { name: 'Takeshi Ito', role: 'Head of Seafood', image: 'img/chef-takeshi.jpg', bio: 'Trained in Tokyo, Takeshi brings precision and the cleanest flavours of the sea to our table.' },
];

export const REVIEWS = [
  { name: 'Sophia M', role: 'Food Critic', text: 'A truly unforgettable experience. From the ambiance to the plating, everything was flawless. The tasting menu was a journey in itself.' },
  { name: 'Daniel L', role: 'Culinary Enthusiast', text: 'Every bite was a masterpiece. You can taste the passion and precision in every dish. Absolutely worth it.' },
  { name: 'Ava R', role: 'Lifestyle Blogger', text: 'Exceptional service, world-class flavors, and a setting that makes you feel like royalty. My new favorite dining destination.' },
  { name: 'Marcus T', role: 'Regular Guest', text: 'The truffle pasta is the best I have had outside of Italy. The staff remembered our anniversary and surprised us with dessert.' },
  { name: 'Priya K', role: 'Travel Writer', text: 'Warm, elegant and endlessly creative. I booked the chef\'s counter and watched the whole kitchen work like an orchestra.' },
];

export const LOCATIONS = ['Main Dining Hall', 'Garden Terrace', 'Chef\'s Counter', 'Private Dining Room'];
export const TIMES = ['12:00 PM', '1:00 PM', '2:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];

export const GALLERY = [
  { src: 'img/penne.jpg', title: 'Truffle Penne', tag: 'Dishes' },
  { src: 'img/waiter.jpg', title: 'Service with a smile', tag: 'Team' },
  { src: 'img/pasta.jpg', title: 'Truffle Pasta', tag: 'Dishes' },
  { src: 'img/noodles.jpg', title: 'Wok in motion', tag: 'Kitchen' },
  { src: 'img/matcha.jpg', title: 'Matcha Lava Cake', tag: 'Dishes' },
  { src: 'img/chef-james.jpg', title: 'Chef James Carlow', tag: 'Team' },
  { src: 'img/risotto.jpg', title: 'Sea Urchin Risotto', tag: 'Dishes' },
  { src: 'img/gallery-1.jpg', title: 'The tasting table', tag: 'Dishes' },
  { src: 'img/chef-elena.jpg', title: 'Chef Elena Morin', tag: 'Team' },
  { src: 'img/hero-wings.jpg', title: 'Teriyaki Wings', tag: 'Dishes' },
  { src: 'img/gallery-steak.jpg', title: 'Peppercorn Wagyu', tag: 'Dishes' },
  { src: 'img/chef-takeshi.jpg', title: 'Chef Takeshi Ito', tag: 'Team' },
];
