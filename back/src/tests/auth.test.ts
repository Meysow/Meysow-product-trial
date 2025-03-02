import request from "supertest";
import { app } from "../index";
import { connectDB, disconnectDB } from "./setup";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
  await new Promise((resolve) => setTimeout(() => resolve(true), 1000)); // ✅ Timeout to close the connection
});

describe("🔐 Authentification", () => {
  it("Créer un compte utilisateur", async () => {
    const res = await request(app).post("/auth/account").send({
      username: "testuser",
      firstname: "Test",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Compte créé avec succès !");
  });

  it("Connecter un utilisateur et récupérer un token", async () => {
    await request(app).post("/auth/account").send({
      username: "testuser",
      firstname: "Test",
      email: "test@example.com",
      password: "123456",
    });

    const res = await request(app).post("/auth/token").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("Empêcher la connexion avec un mauvais mot de passe", async () => {
    const res = await request(app).post("/auth/token").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email ou mot de passe incorrect.");
  });
});
