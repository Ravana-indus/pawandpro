import { getProductById } from '@/lib/queries';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import Link from 'next/link';

export default async function ProductDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-surface-container-lowest min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="bg-surface-container-low border-b border-outline-variant/20 pt-6 pb-4 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-sm text-on-surface-variant font-medium">
          <Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          {product.category && (
            <>
              <Link href={`/marketplace/category/${product.category.toLowerCase()}`} className="hover:text-primary transition-colors">{product.category}</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
            </>
          )}
          <span className="text-on-surface truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Left Column - Image Gallery (Simplified for now) */}
        <div className="relative group">
          <div className="sticky top-28 bg-surface-container rounded-3xl overflow-hidden border border-outline-variant/20 aspect-square flex items-center justify-center p-8">
            <img
              src={product.details.image || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800"}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            />
            {product.details.isBestSeller && (
               <div className="absolute top-6 left-6 bg-[#FFD700] text-[#8B6508] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-[#DAA520]/30 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">stars</span> Best Seller
               </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-error text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col pt-4 lg:pt-10">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">{product.brand || 'Premium Quality'}</span>
            <div className="flex items-center gap-1 text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-[#FFD700] fill-current">star</span>
              <span className="font-bold">{product.details.rating || 4.5}</span>
              <span className="text-on-surface-variant text-sm">({product.details.reviewsCount || 0} reviews)</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6">
            {product.name}
          </h1>

          <div className="flex items-end gap-4 mb-8">
            <span className="text-4xl font-headline font-black text-on-surface tracking-tight">Rs. {product.price.toLocaleString()}</span>
            {product.details.originalPrice && product.details.originalPrice > product.price && (
              <span className="text-xl text-on-surface-variant line-through mb-1">Rs. {product.details.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <p className="text-lg text-on-surface-variant leading-relaxed mb-8 font-medium">
            {product.details.description || 'Clinical-grade nutrition and care. Backed by SLVC certified veterinarians for optimal pet health.'}
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {product.details.tags?.map((tag: string) => (
               <span key={tag} className="bg-surface-container-low text-on-surface-variant px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-outline-variant/30">
                  {tag}
               </span>
            ))}
          </div>

          <div className="mt-auto space-y-6">
            <AddToCartButton productId={product.id} variant="primary" />
            
            {product.details.subscribeDiscountPercent && product.details.subscribeDiscountPercent > 0 ? (
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
                 <div>
                    <h4 className="font-bold text-primary flex items-center gap-2 mb-1">
                       <span className="material-symbols-outlined">autorenew</span>
                       Subscribe & Save {product.details.subscribeDiscountPercent}%
                    </h4>
                    <p className="text-sm text-on-surface-variant">Never run out. Auto-delivered to your door.</p>
                 </div>
                 <span className="material-symbols-outlined text-primary transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            ) : null}
          </div>

          {/* Delivery Info */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-outline-variant/20 pt-8">
             <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">local_shipping</span>
                <div>
                   <p className="font-bold text-on-surface text-sm">Island-wide Delivery</p>
                   <p className="text-xs text-on-surface-variant mt-0.5">2-4 Business Days</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">verified</span>
                <div>
                   <p className="font-bold text-on-surface text-sm">Authentic Product</p>
                   <p className="text-xs text-on-surface-variant mt-0.5">Direct from manufacturer</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
