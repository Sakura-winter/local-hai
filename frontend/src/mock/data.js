export const INITIAL_SHOPS = [
  {
    id: 1,
    name: "Lakshmi Provision Store",
    owner_id: 2,
    owner_name: "Ramesh Gupta",
    description: "Serving the neighbourhood with fresh daily staples, spices, and groceries for over 28 years.",
    address: "Shop #4, Cross Rd 2, Indiranagar, Bengaluru",
    category: "Kirana & Daily Essentials",
    is_active: true,
    rating: 4.8,
    reviews_count: 1240,
    delivery_time: "15-25 mins",
    badge: "Neighbourhood Hero",
    banner_url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop&q=80",
    open_now: true
  },
  {
    id: 2,
    name: "Green Valley Organics & Fruits",
    owner_id: 3,
    owner_name: "Priya Sharma",
    description: "Farm-fresh regional veggies, seasonal fruits, and organic cold-pressed oils.",
    address: "12th Main, 4th Block, Koramangala, Bengaluru",
    category: "Fresh Fruits & Veggies",
    is_active: true,
    rating: 4.9,
    reviews_count: 840,
    delivery_time: "20-30 mins",
    badge: "Verified Local",
    banner_url: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&auto=format&fit=crop&q=80",
    open_now: true
  },
  {
    id: 3,
    name: "New Bangalore Bakery & Sweets",
    owner_id: 4,
    owner_name: "Syed Imran",
    description: "Iconic Iyengar-style sponge cakes, fresh milk bread, khara biscuits, and hot samosas.",
    address: "88 Bazaar Street, Domlur, Bengaluru",
    category: "Bakery & Savouries",
    is_active: true,
    rating: 4.7,
    reviews_count: 2150,
    delivery_time: "10-20 mins",
    badge: "Legendary Kirana",
    banner_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80",
    open_now: true
  }
];

export const INITIAL_PRODUCTS = [
  // Shop 1 (Lakshmi Provision Store)
  {
    id: 1,
    shop_id: 1,
    name: "Aashirvaad Shudh Chakki Atta",
    unit: "5 kg",
    description: "100% whole wheat grain atta made with traditional chakki process for softer rotis.",
    price: 245.00,
    stock: 32,
    category: "Flours & Grains",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: 2,
    shop_id: 1,
    name: "Amul Taaza Homogenised Toned Milk",
    unit: "1 L Pouch",
    description: "Pasteurised toned milk with 3.0% fat, fresh and wholesome for morning tea and coffee.",
    price: 56.00,
    stock: 18,
    category: "Dairy & Eggs",
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: 3,
    shop_id: 1,
    name: "Tata Salt Vacuum Evaporated Iodised",
    unit: "1 kg",
    description: "Desh ka namak with guaranteed iodine content for healthy family cooking.",
    price: 28.00,
    stock: 54,
    category: "Salt & Spices",
    image_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: 4,
    shop_id: 1,
    name: "Fortune Sunlite Refined Sunflower Oil",
    unit: "1 L Pouch",
    description: "Light and healthy cooking oil fortified with Vitamin A and D.",
    price: 135.00,
    stock: 24,
    category: "Oils & Ghee",
    image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: 5,
    shop_id: 1,
    name: "Maggi 2-Minute Masala Noodles",
    unit: "Pack of 4 (280g)",
    description: "Classic favourite instant noodles with the signature blend of 10 roasted spices.",
    price: 55.00,
    stock: 40,
    category: "Instant Food",
    image_url: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: 6,
    shop_id: 1,
    name: "Brooke Bond Taj Mahal Rich Tea",
    unit: "500 g",
    description: "Exquisite tea leaves selected for the discerning palate with signature aroma.",
    price: 320.00,
    stock: 15,
    category: "Tea & Beverages",
    image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: 7,
    shop_id: 1,
    name: "Surf Excel Easy Wash Detergent Powder",
    unit: "1 kg",
    description: "Removes tough stains easily while keeping clothes vibrant and fresh.",
    price: 140.00,
    stock: 20,
    category: "Household & Cleaning",
    image_url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: 8,
    shop_id: 1,
    name: "Fresh Farm Nashik Red Onions",
    unit: "1 kg",
    description: "Crisp and flavorful local onions sourced directly from wholesale mandi.",
    price: 35.00,
    stock: 45,
    category: "Fresh Produce",
    image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },

  // Shop 2 (Green Valley)
  {
    id: 9,
    shop_id: 2,
    name: "Organic Shimla Royal Delicious Apples",
    unit: "1 kg (4-5 pcs)",
    description: "Crisp, sweet mountain-grown apples packed with vitamins and natural pectin.",
    price: 180.00,
    stock: 22,
    category: "Fresh Fruits",
    image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: 10,
    shop_id: 2,
    name: "Naturally Ripened Robusta Bananas",
    unit: "1 Dozen",
    description: "Chemical-free ripened sweet bananas, high potassium and dietary fiber.",
    price: 60.00,
    stock: 30,
    category: "Fresh Fruits",
    image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: 11,
    shop_id: 2,
    name: "Hydroponic Baby Spinach (Palak)",
    unit: "250 g bunch",
    description: "Pesticide-free tender spinach leaves, washed and ready to cook.",
    price: 45.00,
    stock: 12,
    category: "Fresh Produce",
    image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },

  // Shop 3 (New Bangalore Bakery)
  {
    id: 12,
    shop_id: 3,
    name: "Iyengar Bakery Fresh Honey Butter Bun",
    unit: "Pack of 2",
    description: "Iconic sweet bread roll stuffed with whipped honey butter and tutti frutti.",
    price: 40.00,
    stock: 25,
    category: "Bakery",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: 13,
    shop_id: 3,
    name: "Crispy Bangalore Khara Biscuits",
    unit: "250 g Box",
    description: "Traditional savory cookies flavoured with fresh coriander, curry leaves, and green chillies.",
    price: 85.00,
    stock: 18,
    category: "Snacks",
    image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80",
    is_available: true
  }
];

export const INITIAL_ORDERS = [
  {
    id: 101,
    order_number: "LH-8041",
    shop_id: 1,
    shop_name: "Lakshmi Provision Store",
    customer_id: 1,
    customer_name: "Peter Parker (Resident)",
    customer_phone: "+91 98765 43210",
    delivery_address: "Flat 302, Spider Apt, 5th Cross, Indiranagar",
    status: "placed",
    total_amount: 357.00,
    notes: "Leave by the door if I'm not answering. Swing fast!",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    items: [
      { product_id: 1, name: "Aashirvaad Shudh Chakki Atta (5kg)", quantity: 1, unit_price: 245.00, subtotal: 245.00 },
      { product_id: 2, name: "Amul Taaza Homogenised Toned Milk", quantity: 2, unit_price: 56.00, subtotal: 112.00 }
    ]
  },
  {
    id: 102,
    order_number: "LH-8038",
    shop_id: 1,
    shop_name: "Lakshmi Provision Store",
    customer_id: 5,
    customer_name: "Kabir Verma",
    customer_phone: "+91 91234 56789",
    delivery_address: "B-12, Green Heights, Double Road, Indiranagar",
    status: "accepted",
    total_amount: 193.00,
    notes: "Please call on arrival",
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    items: [
      { product_id: 5, name: "Maggi 2-Minute Masala Noodles (Pack of 4)", quantity: 3, unit_price: 55.00, subtotal: 165.00 },
      { product_id: 3, name: "Tata Salt Vacuum Evaporated Iodised", quantity: 1, unit_price: 28.00, subtotal: 28.00 }
    ]
  },
  {
    id: 103,
    order_number: "LH-8035",
    shop_id: 1,
    shop_name: "Lakshmi Provision Store",
    customer_id: 6,
    customer_name: "Ananya Sengupta",
    customer_phone: "+91 98450 11223",
    delivery_address: "House 45, 1st Cross, Near Water Tank",
    status: "delivered",
    total_amount: 455.00,
    notes: "",
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    items: [
      { product_id: 6, name: "Brooke Bond Taj Mahal Rich Tea (500g)", quantity: 1, unit_price: 320.00, subtotal: 320.00 },
      { product_id: 4, name: "Fortune Sunlite Refined Sunflower Oil", quantity: 1, unit_price: 135.00, subtotal: 135.00 }
    ]
  }
];

export const DEMO_USERS = {
  customer: {
    id: 1,
    email: "resident@localhai.in",
    full_name: "Peter Parker",
    role: "customer",
    address: "Flat 302, Spider Apt, 5th Cross, Indiranagar"
  },
  shop_owner: {
    id: 2,
    email: "guptastores@localhai.in",
    full_name: "Ramesh Gupta",
    role: "shop_owner",
    shop_id: 1,
    shop_name: "Lakshmi Provision Store"
  }
};

