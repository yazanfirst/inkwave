import productTshirt from "@/assets/product-tshirt.jpg";
import productMug from "@/assets/product-mug.jpg";
import productPhonecase from "@/assets/product-phonecase.jpg";
import productHoodie from "@/assets/product-hoodie.jpg";
import productTotebag from "@/assets/product-totebag.jpg";
import productPoster from "@/assets/product-poster.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
}

export const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Ocean Wave T-Shirt",
    description: "Premium cotton t-shirt with vibrant ocean wave print. Comfortable fit, machine washable, perfect for casual wear.",
    price: 89,
    image: productTshirt,
    category: "T-Shirts",
    featured: true,
  },
  {
    id: "2",
    name: "Artistic Ceramic Mug",
    description: "High-quality ceramic mug with colorful artistic design. Dishwasher and microwave safe, 350ml capacity.",
    price: 45,
    image: productMug,
    category: "Mugs",
    featured: true,
  },
  {
    id: "3",
    name: "Wave Phone Case",
    description: "Durable phone case with stunning wave artwork. Shock-absorbent material, precise cutouts for all ports.",
    price: 59,
    image: productPhonecase,
    category: "Accessories",
    featured: true,
  },
  {
    id: "4",
    name: "Wave Art Hoodie",
    description: "Cozy hoodie with premium wave art print on the back. Fleece-lined interior, kangaroo pocket, adjustable hood.",
    price: 179,
    image: productHoodie,
    category: "Hoodies",
    featured: true,
  },
  {
    id: "5",
    name: "Canvas Tote Bag",
    description: "Eco-friendly canvas tote bag with beautiful wave design. Spacious interior, reinforced handles, perfect for daily use.",
    price: 65,
    image: productTotebag,
    category: "Bags",
    featured: false,
  },
  {
    id: "6",
    name: "Ocean Wave Poster",
    description: "Museum-quality art poster featuring stunning ocean wave artwork. Printed on premium matte paper, multiple sizes available.",
    price: 120,
    image: productPoster,
    category: "Posters",
    featured: false,
  },
];

export const getProducts = (): Product[] => {
  const custom = localStorage.getItem("inkwave-products");
  if (custom) return JSON.parse(custom);
  return defaultProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem("inkwave-products", JSON.stringify(products));
};
