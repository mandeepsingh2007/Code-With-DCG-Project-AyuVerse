import { NextResponse } from "next/server";
import axios from "axios";

const SHOPIFY_GRAPHQL_URL = "https://aiwellnessstore.myshopify.com/admin/api/2023-10/graphql.json";
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN; // Use environment variable

// Define TypeScript interfaces
interface ShopifyProduct {
  id: string;
  title: string;
  descriptionHtml: string;
  images: {
    edges: {
      node: {
        originalSrc: string;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        price: string;
      };
    }[];
  };
}

export async function GET() {
  try {
    const query = `
      {
        products(first: 10) {
          edges {
            node {
              id
              title
              descriptionHtml
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      SHOPIFY_GRAPHQL_URL,
      { query },
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract and format the products
    const products = response.data.data.products.edges.map(({ node }: { node: ShopifyProduct }) => ({
      id: node.id,
      name: node.title,
      description: node.descriptionHtml,
      price: node.variants.edges[0]?.node.price || "N/A",
      image: node.images.edges[0]?.node.originalSrc || "/placeholder.svg",
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching Shopify products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
