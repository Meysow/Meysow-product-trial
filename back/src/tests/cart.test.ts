import request from "supertest";
import { app } from "../index";
import { connectDB, disconnectDB } from "./setup";

let token: string;
let productId: string;

beforeAll(async () => {
  await connectDB();

  // ✅ Create user to test
  await request(app).post("/auth/account").send({
    username: "admin",
    firstname: "Admin",
    email: "admin@admin.com",
    password: "password",
  });

  const res = await request(app).post("/auth/token").send({
    email: "admin@admin.com",
    password: "password",
  });

  token = res.body.token;

  // ✅ chekc if token is valid
  if (!token) {
    throw new Error("❌ Impossible d'obtenir un token valide.");
  }

  // ✅ Create a product to test
  const productRes = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${token}`)
    .send({
      code: "P001",
      name: "Test Product",
      description: "A great product",
      category: "Test",
      price: 100,
      quantity: 5,
      internalReference: "REF123",
      shellId: 1,
      inventoryStatus: "INSTOCK",
      rating: 5,
    });

  productId = productRes.body._id;

  // ✅ check if product id is valid
  if (!productId) {
    throw new Error("❌ Impossible de créer un produit pour le panier.");
  }
});

afterAll(async () => {
  await disconnectDB();
});

describe("🛒 Gestion du Panier", () => {
  it("Ajouter un produit au panier", async () => {
    const res = await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId, quantity: 2 });

    console.log("✅ Réponse ajout panier:", res.body); // 🔍 DEBUG

    expect(res.status).toBe(200);
    expect(res.body.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ productId, quantity: 2 }),
      ])
    );
  });

  it("Ne doit pas ajouter un produit inexistant au panier", async () => {
    const res = await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: "123456789abcdef123456789", quantity: 1 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Produit introuvable.");
  });

  it("Récupérer le panier de l'utilisateur", async () => {
    const res = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it("Supprimer un produit du panier", async () => {
    // ✅ wait for the cart to be updated
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const res = await request(app)
      .delete("/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId });

    console.log("✅ Réponse suppression panier:", res.body); // 🔍 DEBUG

    expect(res.status).toBe(200);
    expect(res.body.products).not.toContain(
      expect.objectContaining({ productId })
    );
  });
});
