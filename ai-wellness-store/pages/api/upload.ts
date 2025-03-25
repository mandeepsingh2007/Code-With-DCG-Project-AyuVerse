import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { getDocument, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const form = formidable({ multiples: false });

    try {
        const [fields, files] = await form.parse(req);
        const file = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileData = fs.readFileSync(file.filepath);
        const pdfText = await extractTextFromPDF(fileData);
        console.log("Extracted PDF Text:", pdfText.join(" "));

        const extractedData = analyzeVitalSigns(pdfText.join(" "));
        console.log("Extracted Vitals:", extractedData);

        const products = await fetchRecommendedProducts(extractedData);
        console.log("Fetched Products:", products);

        return res.status(200).json({ products });
    } catch (error) {
        console.error("Error processing file:", error);
        return res.status(500).json({ message: "Error processing file" });
    }
}

async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string[]> {
    const loadingTask = getDocument({
        data: new Uint8Array(pdfBuffer),
        standardFontDataUrl: "/pdfjs-dist/standard_fonts/", // Fix local font loading issue
    });

    const pdf: PDFDocumentProxy = await loadingTask.promise;
    const numPages = pdf.numPages;
    const textContents: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page: PDFPageProxy = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => (item as any).str).join(" ");
        textContents.push(pageText);
    }

    return textContents;
}

function analyzeVitalSigns(text: string) {
    const bpmMatch = text.match(/Heart Rate:\s*-?\s*Current:\s*(\d+)/);
    const tempMatch = text.match(/Body Temperature:\s*(\d+(\.\d+)?)/);
    const stressMatch = text.match(/Stress Level:\s*(\w+)/);

    return {
        bpm: bpmMatch ? parseInt(bpmMatch[1]) : null,
        temperature: tempMatch ? parseFloat(tempMatch[1]) : null,
        stress: stressMatch ? stressMatch[1] : null,
    };
}

async function fetchRecommendedProducts(vitals: any) {
    try {
        const response = await fetch(
            "https://aiwellnessstore.myshopify.com/api/2025-01/graphql.json",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
                },
                body: JSON.stringify({
                    query: `
              query {
                products(first: 5, query: "health") {
                  edges {
                    node {
                      id
                      title
                      description
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                      variants(first: 1) {
                        edges {
                          node {
                            price {
                              amount
                              currencyCode
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Shopify API error:", errorText);
            throw new Error(`Failed to fetch products: ${errorText}`);
        }

        const data = await response.json();
        return data.data.products.edges.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            description: edge.node.description,
            image: edge.node.images.edges.length > 0 ? edge.node.images.edges[0].node.url : null,
            price: edge.node.variants.edges.length > 0
                ? `${edge.node.variants.edges[0].node.price.amount} ${edge.node.variants.edges[0].node.price.currencyCode}`
                : "Price not available",
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

