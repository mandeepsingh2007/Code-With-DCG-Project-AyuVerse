import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || "https://aiwellnessstore.myshopify.com/";
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || "";

export async function POST(req: NextRequest) {
    try {
        const { keywords } = await req.json();

        const query = `
            {
                products(first: 5, query: "${keywords}") {
                    edges {
                        node {
                            id
                            title
                            description
                            images(first: 1) { edges { node { src } } }
                            variants(first: 1) { edges { node { price } } }
                        }
                    }
                }
            }
        `;

        const response = await axios.post(
            `${SHOPIFY_STORE_URL}/admin/api/2024-01/graphql.json`,
            { query },
            { headers: { "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN, "Content-Type": "application/json" } }
        );

        return NextResponse.json({ products: response.data.data.products.edges }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
