import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Authentication system (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("handles a signup request", () => {

    const email = "sample@email.com";

    return request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        email: email,
        password: "password"
      })
      .expect(HttpStatus.CREATED)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it("signup as new user then get currently logger in user", async () => {

    const email = "sample@email.com";

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email,
        password: "password"
      })
      .expect(HttpStatus.CREATED)

    const cookie = res.get('Set-Cookie')

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK)

      expect(body.id).toBeDefined();
      expect(body.email).toEqual(email);
  });
});
