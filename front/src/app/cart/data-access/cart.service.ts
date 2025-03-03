import { Injectable, effect, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private readonly _cart = signal<Product[]>(this.loadCartFromStorage()); // ✅ Charge le panier au démarrage
  public readonly cart = this._cart.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem("cart", JSON.stringify(this._cart())); // ✅ Synchronisation automatique
    });
  }

  private loadCartFromStorage(): Product[] {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  }

  public addToCart(product: Product): Observable<boolean> {
    const existingItem = this._cart().find((item) => item.id === product.id);

    if (existingItem) {
      return of(true).pipe(
        tap(() => {
          this._cart.update((cart) =>
            cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
            )
          );
        })
      );
    } else {
      return of(true).pipe(
        tap(() => {
          this._cart.update((cart) => [...cart, { ...product, quantity: 1 }]);
        })
      );
    }
  }

  public removeFromCart(productId: number): void {
    this._cart.update((cart) => {
      const updatedCart = cart.filter((p) => p.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Mise à jour du localStorage
      return updatedCart;
    });
  }

  public clearCart(): void {
    this._cart.set([]);
    localStorage.removeItem("cart"); // ✅ Supprime du localStorage
  }

  public getProductQuantity(productId: number): number {
    const item = this._cart().find((p) => p.id === productId);
    return item ? item.quantity : 0;
  }

  private syncCartWithLocalStorage(): void {
    localStorage.setItem("cart", JSON.stringify(this._cart()));
  }
  public updateQuantity(
    productId: number,
    quantity: number
  ): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        this._cart.update((cart) =>
          cart.map((p) =>
            p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
          )
        );
        this.syncCartWithLocalStorage();
      })
    );
  }

  public onIncreaseQuantity(productId: number) {
    const item = this._cart().find((p) => p.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1).subscribe();
    }
  }

  public onDecreaseQuantity(productId: number) {
    const item = this._cart().find((p) => p.id === productId);
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1).subscribe();
    }
  }
}
