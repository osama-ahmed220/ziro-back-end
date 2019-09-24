import { testConn } from "../../test-utils/testConn";
import { Connection } from "typeorm";
import faker from "faker";
import { crudTest } from "../../test-utils/CrudTest";

let con: Connection;
beforeAll(async () => {
  con = await testConn();
});

afterAll(async () => {
  if (con) {
    await con.close();
  }
});

describe("Stack", () => {
  const stackToBeCreated = { title: faker.lorem.word() };
  crudTest({
    testName: "stack",
    crud: {
      create: {
        source: `mutation CreateStack($data: CreateStackInput!) {
          createStack(data: $data) {
              id
              title
          }
        }`,
        methodName: "createStack",
        variableValues: {
          data: stackToBeCreated
        },
        expectedData: stackToBeCreated
      },
      get: {
        source: `query GetStack($id: String!) {
          getStack(id: $id) {
            id
            title
          }
        }`,
        methodName: "getStack",
        expectedData: { title: stackToBeCreated.title }
      },
      getAll: {
        source: `query GetAllStack {
          getAllStack {
            id
            title
          }
        }`,
        methodName: "getAllStack",
        expectedData: { title: stackToBeCreated.title }
      }
    }
  });
});
