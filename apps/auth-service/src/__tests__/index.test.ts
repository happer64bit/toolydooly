import supertest from "supertest";
import { describe, it } from "@jest/globals";
import { createServer } from "../server";

describe("server", () => {
  // it("status check returns 200", async () => {
  //   await supertest(createServer())
  //     .get("/status")
  //     .expect(200)
  //     .then((res) => {
  //       expect(res.body.ok).toBe(true);
  //     });
  // });

  // it("message endpoint says hello", async () => {
  //   await supertest(createServer())
  //     .get("/message/jared")
  //     .expect(200)
  //     .then((res) => {
  //       expect(res.body.message).toBe("hello jared");
  //     });
  // });

  it("Register New User", async () => {
    await supertest(createServer())
      .post("/create-user")
      .send({
        username: "wintkhantlin",
        email: "wintkhantlin@gmail.com",
        password: "password0A@"
      })
      .expect(201).then((res) => console.log(res.text))
  })
});
