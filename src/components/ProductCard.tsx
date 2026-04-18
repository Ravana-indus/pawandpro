import React from "react";
import Link from "next/link";
import { Product } from "@/types/models";
import { AddToCartButton } from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col border border-outline-variant/20 h-full">
      <div className="relative aspect-square overflow-hidden bg-surface-container-low">
        <Link href={`/marketplace/product/${product.id}`}>
          <img
            src={product.details.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </Link>
        {product.details.isBestSeller && (
          <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10 shadow-sm">
            Best Seller
          </div>
        )}
        {product.details.isNew && (
          <div className="absolute top-4 left-4 bg-tertiary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10 shadow-sm">
            New
          </div>
        )}
        
        <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-on-surface hover:text-error hover:bg-error-container opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent flex justify-center z-10">
           <AddToCartButton productId={product.id} variant="quick-add" />
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.category}</span>
          <div className="flex items-center text-amber-500">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-xs font-bold ml-1">{product.details.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <Link href={`/marketplace/product/${product.id}`}>
          <h3 className="text-lg font-headline font-bold text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">{product.details.description}</p>

        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-black text-on-surface">Rs. {product.price.toLocaleString()}</span>
            {product.details.originalPrice && (
              <span className="text-xs text-outline line-through">Rs. {product.details.originalPrice.toLocaleString()}</span>
            )}
          </div>
          
          {product.details.subscribeDiscountPercent && product.details.subscribeDiscountPercent > 0 && (
            <div className="bg-primary/5 p-2.5 rounded-lg flex items-center justify-between mt-auto border border-primary/10">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Subscribe & Save {product.details.subscribeDiscountPercent}%</span>
              </div>
              <span className="text-xs font-black text-primary">
                Rs. {(product.price * (1 - product.details.subscribeDiscountPercent / 100)).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
