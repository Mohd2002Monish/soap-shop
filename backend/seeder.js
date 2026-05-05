import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();

// ——— Sterling Botanica — 6 Soaps ———
const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Category.deleteMany({});
  await Product.deleteMany({});
  console.log("🗑️  Cleared existing products and categories");

  // Create categories
  const categories = await Category.insertMany([
    { name: "Brightening", slug: "brightening", description: "Soaps to even skin tone and add radiance", isActive: true },
    { name: "Detox", slug: "detox", description: "Deep cleansing and pore-purifying soaps", isActive: true },
    { name: "Healing", slug: "healing", description: "Antibacterial and skin-repairing soaps", isActive: true },
    { name: "Nourishing", slug: "nourishing", description: "Rich, moisturising soaps for soft skin", isActive: true },
    { name: "Luxury", slug: "luxury", description: "Indulgent buttery bars for total skin pampering", isActive: true },
    { name: "Refreshing", slug: "refreshing", description: "Uplifting and aromatic soaps", isActive: true },
  ]);

  const cat = (name) => categories.find((c) => c.name === name)._id;

  const products = [
    {
      name: "Kesar & Goat Milk",
      slug: "kesar-goat-milk",
      description:
        "A royal bar inspired by centuries of Ayurvedic wisdom. Pure saffron (kesar) is one of the most prized skin-brightening ingredients in the world, known to reduce dark spots, hyperpigmentation, and uneven tone. Combined with raw goat milk — which is rich in lactic acid, vitamins A, B, C, D, and natural fats — this bar gently exfoliates dead cells while delivering deep nourishment. Goat milk's pH is close to human skin, making it exceptionally gentle and non-stripping. Suitable for daily use. With consistent use (2–3 weeks), expect a visible improvement in skin luminosity and texture.",
      shortDescription: "Brightening & royal — saffron glow meets goat milk softness",
      price: 399,
      discountPrice: 349,
      stock: 50,
      sku: "SB-KGM-001",
      category: cat("Brightening"),
      images: [
        {
          url: "https://placehold.co/600x600/E8D5B7/3A2E2E?text=Kesar+%26+Goat+Milk",
          publicId: "sterling-botanica/kesar-goat-milk",
        },
      ],
      ingredients: "Coconut Oil, Goat Milk, Raw Saffron (Kesar), Shea Butter, Castor Oil, Kaolin Clay, Vitamin E",
      weight: "100g",
      scent: "Warm & Floral",
      isFeatured: true,
      isActive: true,
      ratings: { average: 4.9, count: 0 },
    },
    {
      name: "Charcoal & Coffee",
      slug: "charcoal-coffee",
      description:
        "A power-duo bar engineered for deep detox. Activated bamboo charcoal acts like a magnet — drawing out environmental toxins, excess sebum, and microscopic impurities trapped in your pores. Coffee grounds provide a natural physical exfoliation, sloughing off dead skin cells and stimulating blood circulation, which reduces the appearance of cellulite and puffiness. The caffeine in coffee also tightens skin temporarily, giving it a firm, refreshed look. Tea tree oil completes the formula with its clinically proven antibacterial action, keeping acne-causing bacteria at bay. Best used 3–4 times a week for oily or congested skin.",
      shortDescription: "Deep detox & energising — the ultimate pore purifier",
      price: 379,
      discountPrice: null,
      stock: 45,
      sku: "SB-CC-002",
      category: cat("Detox"),
      images: [
        {
          url: "https://placehold.co/600x600/3A2E2E/FFF8F2?text=Charcoal+%26+Coffee",
          publicId: "sterling-botanica/charcoal-coffee",
        },
      ],
      ingredients: "Activated Bamboo Charcoal, Arabica Coffee Grounds, Tea Tree Essential Oil, Coconut Oil, Castor Oil, Kaolin Clay",
      weight: "100g",
      scent: "Earthy Coffee & Fresh",
      isFeatured: true,
      isActive: true,
      ratings: { average: 4.8, count: 0 },
    },
    {
      name: "Neem & Aloe Vera",
      slug: "neem-aloe-vera",
      description:
        "Trusted by generations of Indian households, neem is nature's most powerful antibacterial plant. This bar harnesses cold-pressed neem oil — rich in nimbidin, azadirachtin, and fatty acids — to combat acne-causing bacteria, fungal infections, and skin inflammation at the root. Aloe vera gel soothes post-breakout redness and accelerates skin healing, while also providing lightweight moisture that does not clog pores. This combination makes it exceptional for back acne, chest acne, and body rashes. Completely free of artificial fragrance. The earthy scent is natural from the neem oil and fades after rinsing.",
      shortDescription: "Antibacterial & healing — nature's oldest skincare secret",
      price: 349,
      discountPrice: 299,
      stock: 60,
      sku: "SB-NAV-003",
      category: cat("Healing"),
      images: [
        {
          url: "https://placehold.co/600x600/4A7C59/FFF8F2?text=Neem+%26+Aloe+Vera",
          publicId: "sterling-botanica/neem-aloe-vera",
        },
      ],
      ingredients: "Neem Oil, Aloe Vera Gel, Coconut Oil, Olive Oil, Tea Tree Oil, Vitamin E",
      weight: "100g",
      scent: "Herbal & Natural",
      isFeatured: true,
      isActive: true,
      ratings: { average: 4.7, count: 0 },
    },
    {
      name: "Honey & Oatmeal",
      slug: "honey-oatmeal",
      description:
        "The gentlest bar in our collection and the one we recommend first for sensitive skin. Colloidal oatmeal — the gold standard in sensitive skincare — forms a protective barrier on the skin, locking in moisture and shielding against environmental irritants. Raw honey is a natural humectant that draws moisture from the air into the skin. It also contains hydrogen peroxide and propolis, which have natural antibacterial properties without being harsh. Together they soothe eczema flares, psoriasis irritation, rosacea redness, and general dryness. Safe for children over 3 years. Dermatologist tested and fragrance-free.",
      shortDescription: "Gentle & soothing — golden care for sensitive souls",
      price: 329,
      discountPrice: 279,
      stock: 70,
      sku: "SB-HO-004",
      category: cat("Nourishing"),
      images: [
        {
          url: "https://placehold.co/600x600/F4C84D/3A2E2E?text=Honey+%26+Oatmeal",
          publicId: "sterling-botanica/honey-oatmeal",
        },
      ],
      ingredients: "Colloidal Oatmeal, Raw Honey, Goat Milk, Chamomile Extract, Coconut Oil, Olive Oil, Shea Butter",
      weight: "100g",
      scent: "Honey & Vanilla",
      isFeatured: false,
      isActive: true,
      ratings: { average: 4.9, count: 0 },
    },
    {
      name: "Butter Bar",
      slug: "butter-bar",
      description:
        "Our most indulgent, most luxurious bar — crafted entirely around butters. A triple butter formula of shea, cocoa, and mango seed butter delivers unmatched richness and lasting moisture. Unlike water-based moisturisers, butters form an occlusive layer on the skin that prevents transepidermal water loss, keeping skin soft for 12+ hours post-shower. This bar is ideal for extremely dry skin, cracked heels, rough elbows, and anyone living in cold or dry climates. The scent is a natural, warm chocolate-vanilla from the cocoa butter — no artificial fragrance. Rich, creamy lather that feels like a spa treatment.",
      shortDescription: "Ultra-rich & indulgent — triple butter luxury for very dry skin",
      price: 449,
      discountPrice: 399,
      stock: 35,
      sku: "SB-BB-005",
      category: cat("Luxury"),
      images: [
        {
          url: "https://placehold.co/600x600/C68B3B/FFF8F2?text=Butter+Bar",
          publicId: "sterling-botanica/butter-bar",
        },
      ],
      ingredients: "Shea Butter, Cocoa Butter, Mango Seed Butter, Coconut Oil, Castor Oil, Vitamin E",
      weight: "100g",
      scent: "Warm Chocolate & Vanilla",
      isFeatured: true,
      isActive: true,
      ratings: { average: 4.8, count: 0 },
    },
    {
      name: "Lemon & Lavender",
      slug: "lemon-lavender",
      description:
        "An unexpected yet perfect pairing. Cold-pressed lemon essential oil brings brightening vitamin C, fights oiliness, and gives your skin a natural glow. Lavender essential oil counterbalances with its renowned calming and anti-inflammatory properties — preventing the citrus from being too astringent. Together they form a soap that's both energising and calming, perfect for morning or evening use. Lemon's natural alpha hydroxy acids (AHAs) gently dissolve the bonds between dead skin cells, revealing fresher skin underneath. This is our best-selling combination for those who want one soap that does it all: brightens, calms, cleanses, and smells absolutely divine.",
      shortDescription: "Bright & balanced — citrus energy meets lavender calm",
      price: 359,
      discountPrice: 319,
      stock: 55,
      sku: "SB-LL-006",
      category: cat("Refreshing"),
      images: [
        {
          url: "https://placehold.co/600x600/CDB4DB/3A2E2E?text=Lemon+%26+Lavender",
          publicId: "sterling-botanica/lemon-lavender",
        },
      ],
      ingredients: "Lemon Essential Oil, Lavender Essential Oil, Coconut Oil, Shea Butter, Castor Oil, Vitamin C, Dried Lavender Buds",
      weight: "100g",
      scent: "Fresh Lemon & Lavender",
      isFeatured: true,
      isActive: true,
      ratings: { average: 4.9, count: 0 },
    },
  ];

  const inserted = await Product.insertMany(products);
  console.log(`✅ Seeded ${inserted.length} Sterling Botanica products!`);
  inserted.forEach((p) => console.log(`   🧼 ${p.name} — ID: ${p._id}`));

  mongoose.connection.close();
  console.log("\n🎉 Database seeding complete. Happy selling!");
  process.exit(0);
};

seedData().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
