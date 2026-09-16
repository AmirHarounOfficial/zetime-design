import { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  Star, 
  Clock, 
  DollarSign, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  CheckCircle2, 
  TrendingUp,
  MessageSquare,
  Utensils,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { foodRestaurants, CartItem, FoodItem, FoodOption, FoodAddon } from '../../data/mock-data';

/**
 * RestaurantMenu Component
 * Displays a restaurant's menu with category navigation and item selection.
 */
export function RestaurantMenu() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [activeCategory, setActiveCategory] = useState('');
  
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const restaurant = foodRestaurants.find(r => r.id === restaurantId);

  useEffect(() => {
    if (restaurant?.menu && restaurant.menu.length > 0) {
      setActiveCategory(restaurant.menu[0].id);
    }
  }, [restaurant]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
        <div>
          <Utensils size={48} className="mx-auto mb-4 text-gray-200" />
          <h1 className="text-xl font-black text-[#2952AB] uppercase tracking-widest mb-2">Restaurant not found</h1>
          <button onClick={() => navigate(-1)} className="text-[#C69815] font-bold uppercase tracking-widest text-xs">Go back</button>
        </div>
      </div>
    );
  }

  const addToCart = (item: FoodItem, quantity: number, options: Record<string, FoodOption>, addons: FoodAddon[], totalPrice: number) => {
    setCart(prev => {
      return [...prev, { 
        item, 
        quantity, 
        selectedOptions: options, 
        selectedAddons: addons, 
        totalItemPrice: totalPrice 
      }];
    });
    setSelectedItem(null);
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    categoryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const subtotal = cart.reduce((sum, ci) => sum + ci.totalItemPrice * ci.quantity, 0);
  const total = subtotal + restaurant.deliveryFee;
  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Visual Header */}
      <div className="relative h-48">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-[10px] flex items-center justify-center text-white"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black uppercase tracking-widest leading-none">{restaurant.name}</h1>
            {restaurant.popular && <Zap size={16} className="text-[#C69815] fill-[#C69815]" />}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-[#C69815] fill-[#C69815]" />
              <span className="text-xs font-black">{restaurant.rating}</span>
              <span className="text-[10px] opacity-70">({restaurant.reviews})</span>
            </div>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{restaurant.cuisine}</span>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="px-6 py-4 border-b border-[#C2D1E8]/10 flex items-center justify-between bg-white text-[10px] font-black uppercase tracking-widest text-[#2952AB]">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[#C69815]" />
          <span>{restaurant.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-[#C69815]" />
          <span>${restaurant.deliveryFee} Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <Utensils size={14} className="text-[#C69815]" />
          <span>Min. ${restaurant.minimumOrder}</span>
        </div>
      </div>

      {/* Sticky Categories */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm overflow-x-auto no-scrollbar border-b border-[#C2D1E8]/10 px-4">
        <div className="flex gap-1 py-4">
          {restaurant.menu.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#2952AB] text-white shadow-md shadow-[#2952AB]/20'
                  : 'text-gray-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-6 mt-6 space-y-10">
        {restaurant.menu.map((cat) => (
          <div key={cat.id} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-24">
            <h2 className="text-sm font-black text-[#2952AB] uppercase tracking-[0.2em] mb-6 border-l-4 border-[#C69815] pl-4 flex items-center justify-between">
              {cat.name}
              <span className="text-[10px] text-gray-300 font-bold">{cat.items.length} items</span>
            </h2>
            <div className="space-y-6">
              {cat.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="w-full text-left flex gap-4 group active:scale-[0.98] transition-all"
                >
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xs font-black text-[#2952AB] uppercase tracking-wider group-hover:text-[#C69815] transition-colors">{item.name}</h3>
                        {item.popular && (
                          <div className="bg-[#E4ECF7] p-1 rounded-full">
                            <TrendingUp size={10} className="text-[#2952AB]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed mb-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#2952AB] tracking-tight">${item.price.toFixed(2)}</span>
                      {item.customizable && (
                        <span className="text-[8px] font-black text-[#C69815] uppercase tracking-widest border border-[#C69815]/20 px-2 py-0.5 rounded-full">
                          Customizable
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-24 h-24 relative flex-shrink-0">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-[10px] group-hover:shadow-lg transition-all" 
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-[#C2D1E8]/10 rounded-[10px] flex items-center justify-center text-[#2952AB] shadow-lg group-hover:bg-[#2952AB] group-hover:text-white transition-all">
                      <Plus size={16} strokeWidth={3} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Item Detail Bottom Sheet */}
      {selectedItem && (
        <ItemDetailBottomSheet 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onAdd={addToCart}
        />
      )}

      {/* Cart Modal */}
      {showCart && (
        <CartBottomSheet 
          cart={cart} 
          restaurant={restaurant} 
          onClose={() => setShowCart(false)} 
          onUpdateQuantity={updateCartQuantity}
          onCheckout={() => navigate(`/food-delivery/${restaurant.id}/checkout`, { state: { cart, restaurant } })}
        />
      )}

      {/* Floating Cart Button */}
      {!showCart && cartCount > 0 && !selectedItem && (
        <div className="fixed bottom-12 left-0 right-0 px-6 z-50">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-between px-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart size={20} strokeWidth={2.5} />
                  <span className="absolute -top-3 -right-3 bg-[#C69815] text-white text-[8px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-[#2952AB]">
                    {cartCount}
                  </span>
                </div>
                <span className="text-[10px]">View Basket</span>
              </div>
              <span className="text-xs font-black tracking-tight">${total.toFixed(2)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemDetailBottomSheet({ item, onClose, onAdd }: { item: FoodItem, onClose: () => void, onAdd: any }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, FoodOption>>({});
  const [selectedAddons, setSelectedAddons] = useState<FoodAddon[]>([]);

  useEffect(() => {
    const initialOptions: Record<string, FoodOption> = {};
    item.optionGroups?.forEach(group => {
      if (group.required && group.options.length > 0) {
        initialOptions[group.id] = group.options[0];
      }
    });
    setSelectedOptions(initialOptions);
  }, [item]);

  const toggleAddon = (addon: FoodAddon) => {
    setSelectedAddons(prev => 
      prev.find(a => a.id === addon.id) 
        ? prev.filter(a => a.id !== addon.id) 
        : [...prev, addon]
    );
  };

  const optionPrices = Object.values(selectedOptions).reduce((sum, opt) => sum + opt.price, 0);
  const addonPrices = selectedAddons.reduce((sum, add) => sum + add.price, 0);
  const unitPrice = item.price + optionPrices + addonPrices;
  const totalPrice = unitPrice * quantity;

  const canAdd = !item.optionGroups?.some(group => group.required && !selectedOptions[group.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4">
      <div className="absolute inset-0 bg-[#2952AB]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[25px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-500">
        <div className="relative h-64 flex-shrink-0">
          <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'} alt={item.name} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-[10px] flex items-center justify-center text-white">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-32">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-[#2952AB] uppercase tracking-widest">{item.name}</h2>
              <span className="text-lg font-black text-[#C69815] tracking-tight">${item.price.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.description}</p>
          </div>
          {item.optionGroups?.map((group) => (
            <div key={group.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#C69815] rounded-full" />
                  <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">{group.name}</h3>
                </div>
                {group.required && <span className="text-[8px] font-black text-[#C69815] uppercase tracking-widest bg-[#FEF8E7] px-2 py-1 rounded-full">Required</span>}
              </div>
              <div className="space-y-3">
                {group.options.map((opt) => (
                  <button key={opt.id} onClick={() => setSelectedOptions(prev => ({ ...prev, [group.id]: opt }))} className={`w-full flex items-center justify-between p-4 rounded-[12px] border transition-all ${selectedOptions[group.id]?.id === opt.id ? 'bg-[#E4ECF7] border-[#2952AB] shadow-sm' : 'bg-gray-50 border-transparent'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedOptions[group.id]?.id === opt.id ? 'border-[#2952AB]' : 'border-gray-300'}`}>
                         {selectedOptions[group.id]?.id === opt.id && <div className="w-2 h-2 bg-[#2952AB] rounded-full" />}
                      </div>
                      <span className="text-xs font-bold text-[#2952AB]">{opt.name}</span>
                    </div>
                    {opt.price > 0 && <span className="text-[10px] font-black text-gray-400">+${opt.price.toFixed(2)}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {item.addons && item.addons.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#C69815] rounded-full" />
                <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Add Extras</h3>
              </div>
              <div className="space-y-3">
                {item.addons.map((addon) => {
                  const isSelected = selectedAddons.find(a => a.id === addon.id);
                  return (
                    <button key={addon.id} onClick={() => toggleAddon(addon)} className={`w-full flex items-center justify-between p-4 rounded-[12px] border transition-all ${isSelected ? 'bg-[#FEF8E7] border-[#C69815] shadow-sm' : 'bg-gray-50 border-transparent'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#C69815] border-[#C69815]' : 'border-gray-300 shadow-inner'}`}>
                           {isSelected && <X size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-bold text-[#2952AB]">{addon.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-400">+${addon.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-[#C69815]" />
              <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Special Requests</h3>
            </div>
            <textarea placeholder="e.g. No onions, extra spicy..." className="w-full bg-gray-50 border border-[#C2D1E8]/10 rounded-[12px] p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 placeholder:text-gray-300 resize-none min-h-[100px]" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-[#C2D1E8]/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-gray-100 rounded-[10px] p-1 h-14">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-[#2952AB] active:scale-90 transition-all">
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="w-8 text-center text-sm font-black text-[#2952AB]">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-[#2952AB] active:scale-95 transition-all">
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
            <button disabled={!canAdd} onClick={() => onAdd(item, quantity, selectedOptions, selectedAddons, unitPrice)} className="flex-1 bg-[#2952AB] text-white h-14 rounded-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2952AB]/20 flex items-center justify-between px-6 active:scale-95 transition-all disabled:opacity-50">
              <span className="text-[10px]">Add to Basket</span>
              <span className="text-xs tracking-tighter">${totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartBottomSheet({ cart, restaurant, onClose, onUpdateQuantity, onCheckout }: any) {
  const subtotal = cart.reduce((sum: number, ci: any) => sum + ci.totalItemPrice * ci.quantity, 0);
  const total = subtotal + restaurant.deliveryFee;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4">
      <div className="absolute inset-0 bg-[#2952AB]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[25px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-500">
        <div className="px-6 py-5 border-b border-[#C2D1E8]/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#2952AB] uppercase tracking-widest">Your Basket</h2>
            <p className="text-[10px] font-bold text-gray-400 underline decoration-[#C69815] decoration-2 underline-offset-4">{restaurant.name}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-[10px] text-gray-400">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-100" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Basket is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((ci: any, index: number) => (
                <div key={`${ci.item.id}-${index}`} className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className="text-xs font-black text-[#2952AB] uppercase">{ci.item.name}</h3>
                       <span className="text-[10px] font-black text-[#C69815]">${ci.totalItemPrice.toFixed(2)}</span>
                    </div>
                    <div className="space-y-0.5">
                      {Object.values(ci.selectedOptions || {}).map((opt: any) => (
                        <p key={opt.id} className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1.5">
                          <CheckCircle2 size={10} className="text-green-500" /> {opt.name}
                        </p>
                      ))}
                      {ci.selectedAddons?.map((add: any) => (
                        <p key={add.id} className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1.5">
                          <Plus size={10} className="text-[#C69815]" /> {add.name}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-[10px] px-2 py-1 h-fit self-center">
                    <button onClick={() => onUpdateQuantity(index, -1)} className="text-[#2952AB] active:scale-95 transition-all"><Minus size={14} strokeWidth={3} /></button>
                    <span className="text-xs font-black text-[#2952AB] w-4 text-center">{ci.quantity}</span>
                    <button onClick={() => onUpdateQuantity(index, 1)} className="text-[#2952AB] active:scale-95 transition-all"><Plus size={14} strokeWidth={3} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-6 bg-gray-50 space-y-4">
          <div className="space-y-2">
             <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Delivery</span>
                <span>${restaurant.deliveryFee.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm font-black text-[#2952AB] uppercase tracking-widest pt-2 border-t border-[#C2D1E8]/20">
                <span>Total</span>
                <span className="tracking-tight text-lg">${total.toFixed(2)}</span>
             </div>
          </div>
          <button onClick={onCheckout} disabled={cart.length === 0 || subtotal < restaurant.minimumOrder} className="w-full bg-[#2952AB] text-white py-4 rounded-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2952AB]/20 flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-[0.98]">
             {subtotal < restaurant.minimumOrder ? `Min. Order is $${restaurant.minimumOrder}` : (
               <>
                 <ShieldCheck size={18} fill="white" className="text-[#2952AB]" />
                 Proceed to Checkout
               </>
             )}
          </button>
        </div>
      </div>
    </div>
  );
}
