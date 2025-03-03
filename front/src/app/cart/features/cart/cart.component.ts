import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { CartService } from "app/cart/data-access/cart.service";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  standalone: true,
  imports: [CommonModule, ButtonModule],
})
export class CartComponent {
  public readonly cartService = inject(CartService);
  public readonly cart = this.cartService.cart;

  public onRemove(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  public onClearCart() {
    this.cartService.clearCart();
  }

  public onIncreaseQuantity(productId: number) {
    this.cartService.onIncreaseQuantity(productId);
  }

  public onDecreaseQuantity(productId: number) {
    this.cartService.onDecreaseQuantity(productId);
  }
}
