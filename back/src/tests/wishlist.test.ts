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
});

afterAll(async () => {
  await disconnectDB();
});

describe("💖 Gestion de la Wishlist", () => {
  it("Ajouter un produit à la wishlist", async () => {
    const res = await request(app)
      .post("/wishlist")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId });

    expect(res.status).toBe(200);
    expect(res.body.products).toContain(productId);
  });

  it("Supprimer un produit de la wishlist", async () => {
    // ✅ wait for the wishlist to be updated
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const res = await request(app)
      .delete("/wishlist")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId });

    expect(res.status).toBe(200);
    expect(res.body.wishlist.products).not.toContain(productId);
  });
});
