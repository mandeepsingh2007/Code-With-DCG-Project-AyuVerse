"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, ShoppingCart } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Ashwagandha Root Extract",
    description: "Stress relief & immune support",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Herbs",
    badge: "Bestseller",
    modelUrl: "/assets/3d/duck.glb", // Using the sample 3D model for demonstration
  },
  {
    id: 2,
    name: "Turmeric Curcumin Complex",
    description: "Anti-inflammatory support",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Supplements",
  },
  {
    id: 3,
    name: "Holy Basil Adaptogen",
    description: "Mood & cognitive support",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Herbs",
    badge: "New",
    modelUrl: "/assets/3d/duck.glb", // Using the sample 3D model for demonstration
  },
  {
    id: 4,
    name: "Triphala Digestive Support",
    description: "Gut health & detoxification",
    price: 22.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Supplements",
  },
  {
    id: 5,
    name: "Brahmi Mind Enhancement",
    description: "Memory & focus support",
    price: 27.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Herbs",
    modelUrl: "/assets/3d/duck.glb", // Using the sample 3D model for demonstration
  },
  {
    id: 6,
    name: "Amla Vitamin C Boost",
    description: "Immunity & skin health",
    price: 21.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Supplements",
    badge: "Popular",
  },
]

export default function ProductGrid() {
  const [activeProduct, setActiveProduct] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]"
        >
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            {product.badge && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                {product.badge}
              </Badge>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => setActiveProduct(product.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {product.modelUrl ? "View 3D" : "Quick View"}
                </Button>
                <Button size="sm" className="rounded-full">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
            <h3 className="font-medium text-lg mb-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <div className="font-semibold">${product.price}</div>
            <Link href={`/product/${product.id}`}>
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}


    </div>
  )
}



