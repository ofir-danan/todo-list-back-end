const request = require("supertest");
const app = require("./index");

describe("GET route", () => {
  const expectedTask = {
    "my-todo": { priority: "1", date: 1614101194861, text: "aaa" },
  };

  const expectedError = {
    message: "Illegal ID",
  };

  it("Should return a task by a given id", async () => {
    const response = await request(app).get("/b/1614101194861");
    expect.assertions(2);
    // Is the status code 200
    expect(response.status).toBe(200);

    // are tasks equal
    expect(response.body.record).toEqual(expectedTask);
  });

  it("Should return an error message with status code 400 for illegal id", async () => {
    const response = await request(app).get("/b/aba");

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal expectedQuote
    expect(response.body["message"]).toBe("Illegal ID");
  });

  it("Should return an error message with status code 404 for not found bin", async () => {
    const response = await request(app).get("/b/8");

    // Is the status code 404
    expect(response.status).toBe(404);

    // Is the body equal to the error
    expect(response.body.message).toBe("Bin not found");
  });
});

describe("POST route", () => {
  const date = new Date().getTime();
  const taskToSend = {
    "my-todo": { priority: "1", date: date, text: "aaa" },
  };

  const expectedResponse = {
    record: taskToSend,
    metadata: {
      id: taskToSend["my-todo"]["date"],
    },
  };

  it("Should post a new task successfully", async () => {
    const response = await request(app).post("/b").send(taskToSend);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });
});

describe("PUT route", () => {
  const date = new Date().getTime();
  const taskToSend = {
    "my-todo": { priority: "1", date: date, text: "bbb" },
  };

  const expectedResponse = {
    record: taskToSend,
    metadata: {
      id: taskToSend["my-todo"]["date"],
    },
  };

  it("Should return an error message with status code 400 for illegal id", async () => {
    const response = await request(app).put("/b/aba");

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal expectedQuote
    expect(response.body["message"]).toBe("Illegal ID");
  });

  it("Should return an error message with status code 404 for not found bin", async () => {
    const response = await request(app).put("/b/8");

    // Is the status code 404
    expect(response.status).toBe(404);

    // Is the body equal to the error
    expect(response.body.message).toBe("Bin not found");
  });

  it("Should update a task successfully", async () => {
    const response = await request(app)
      .put("/b/1613920702000")
      .send(taskToSend);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(taskToSend);
  });

  it("Should not add another file", async () => {
    const responseBeforePut = await request(app).get("/b");
    await request(app).put("/b/1613920702000").send(taskToSend);
    const response = await request(app).get("/b");

    expect(response.status).toBe(200);
    expect(responseBeforePut.length).toBe(response.length);
  });
});

describe("DELETE route", () => {
  it("Should delete task successfully", async () => {
    const allTasks = await request(app).get("/b");
    const latestTask = allTasks.body[allTasks.body.length - 1];
    const response = await request(app).delete(
      `/b/${latestTask["my-todo"]["date"]}`
    );
    const allTasksAfterDelete = await request(app).get("/b");

    expect(response.status).toBe(200);
    expect(allTasksAfterDelete.body.length).toBe(allTasks.body.length - 1);
    expect(response.body.message).toBe("Bin deleted successfully");
  });

  it("Should return an error message with status code 400 for illegal id", async () => {
    const response = await request(app).delete("/b/aba");

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal expectedQuote
    expect(response.body["message"]).toBe("Illegal ID");
  });

  it("Should return an error message with status code 404 for not found bin", async () => {
    const response = await request(app).delete("/b/8");

    // Is the status code 404
    expect(response.status).toBe(404);

    // Is the body equal to the error
    expect(response.body.message).toBe("Bin not found");
  });
});
