import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || "";
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || "";

export async function POST(req: NextRequest) {
    console.log("📨 Received request at /api/shopify");

    try {
        let requestBody;
        try {
            requestBody = await req.json();
        } catch (error) {
            console.error("🛑 Failed to parse JSON:", error);
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (!requestBody.keywords) {
            console.error("❌ Missing 'keywords' in request body");
            return NextResponse.json({ error: "Missing keywords" }, { status: 400 });
        }

        const keywords = requestBody.keywords;
        console.log("🔍 Searching Shopify for:", keywords);

        if (!SHOPIFY_STORE_URL || !SHOPIFY_ACCESS_TOKEN) {
            console.error("❌ Missing Shopify credentials");
            return NextResponse.json({ error: "Missing Shopify API credentials" }, { status: 500 });
        }

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

        console.log("📨 Sending request to Shopify...");

        const response = await axios.post(
            `https://aiwellnessstore.myshopify.com/admin/api/2023-10/graphql.json`,
            { query },
            { headers: { 
                "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN, 
                "Content-Type": "application/json" 
            }}
        );

        if (!response.data || !response.data.data) {
            console.error("❌ Unexpected Shopify response format:", response.data);
            return NextResponse.json({ error: "Invalid response from Shopify" }, { status: 500 });
        }

        console.log("✅ Shopify API Response:", response.data.data.products.edges);

        return NextResponse.json({ products: response.data.data.products.edges }, { status: 200 });

    } catch (error) {
        console.error("🔥 Error in /api/shopify:", error);
        return NextResponse.json({ error: "Shopify API request failed" }, { status: 500 });
    }
}
