import request from "supertest";
import { app } from "../index";
import { connectDB, disconnectDB } from "./setup";

let token: string;

beforeAll(async () => {
  await connectDB();

  // Créer un admin pour les tests
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
});

afterAll(async () => {
  await disconnectDB();
  await new Promise((resolve) => setTimeout(() => resolve(true), 1000)); // ✅ Timeout to close the connection
});

describe("🛒 Gestion des produits", () => {
  let productId: string;

  it("Créer un produit (Admin uniquement)", async () => {
    const res = await request(app)
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

    expect(res.status).toBe(201);
    productId = res.body._id;
  });

  it("Récupérer tous les produits", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("Récupérer un produit par ID", async () => {
    const res = await request(app).get(`/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(productId);
  });

  it("Supprimer un produit (Admin uniquement)", async () => {
    const res = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Produit supprimé avec succès");
  });
});
