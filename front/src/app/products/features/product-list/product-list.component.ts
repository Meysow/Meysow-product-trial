import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { CartService } from "app/cart/data-access/cart.service";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { PaginatorModule } from "primeng/paginator";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    DataViewModule,
    CardModule,
    ButtonModule,
    DialogModule,
    ProductFormComponent,
    PaginatorModule,
    CommonModule,
  ],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  public readonly cartService = inject(CartService);

  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  public readonly categories = signal([
    { label: "Toutes", value: "" },
    { label: "Accessoires", value: "Accessories" },
    { label: "Vêtements", value: "Clothing" },
    { label: "Électronique", value: "Electronics" },
    { label: "Fitness", value: "Fitness" },
  ]);

  public readonly selectedCategory = signal<string>("");
  public readonly currentPage = signal<number>(0);
  public readonly itemsPerPage = signal<number>(6);
  public readonly totalRecords = signal<number>(0);

  public readonly filteredProductsList = computed(() => {
    return this.products().filter(
      (product) =>
        !this.selectedCategory() || product.category === this.selectedCategory()
    );
  });
  // 🔍 Filtrage des produits par catégorie et pagination
  public readonly filteredProducts = computed(() => {
    const start = this.currentPage() * this.itemsPerPage();
    return this.filteredProductsList().slice(
      start,
      start + this.itemsPerPage()
    );
  });

  public onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(0); // ✅ Revient toujours en page 1

    // ✅ Met à jour `totalRecords` pour la pagination
    this.totalRecords.set(this.filteredProductsList().length);
  }

  public readonly totalPages = computed(() => {
    const filtered = this.products().filter(
      (product) =>
        !this.selectedCategory() || product.category === this.selectedCategory()
    );
    return Math.ceil(filtered.length / this.itemsPerPage());
  });

  public readonly isLastPage = computed(() => {
    return this.currentPage() >= this.totalPages() - 1;
  });

  public onPageChange(event: any) {
    const maxPages = this.totalPages();
    if (event.page < maxPages) {
      this.currentPage.set(event.page);
    } else {
      this.currentPage.set(maxPages - 1); // ✅ Reste sur la dernière page
    }
  }

  ngOnInit() {
    this.productsService.get().subscribe(() => {
      this.totalRecords.set(this.filteredProductsList().length);
    });
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onAddToCart(product: Product) {
    const quantity = this.quantitiesToAdd()[product.id] || 1; // Récupère la quantité sélectionnée
    for (let i = 0; i < quantity; i++) {
      this.cartService.addToCart(product).subscribe();
    }
    console.log(`🛒 ${quantity}x ${product.name} ajouté(s) au panier`);
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  public readonly quantitiesToAdd = signal<Record<number, number>>({});

  public onIncreaseQuantity(product: Product) {
    this.quantitiesToAdd.update((qty) => ({
      ...qty,
      [product.id]: (qty[product.id] || 1) + 1, // Augmente la quantité pour CE produit
    }));
  }

  public onDecreaseQuantity(product: Product) {
    this.quantitiesToAdd.update((qty) => ({
      ...qty,
      [product.id]: Math.max(1, (qty[product.id] || 1) - 1), // Min = 1
    }));
  }

  public getStockLabel(status: string): string {
    switch (status) {
      case "INSTOCK":
        return "✅ En stock";
      case "LOWSTOCK":
        return "⚠️ Stock limité";
      case "OUTOFSTOCK":
        return "❌ Rupture de stock";
      default:
        return "❔ Statut inconnu";
    }
  }
}
