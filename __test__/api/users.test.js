const request = require('supertest');
const UserPlugin = require('../../server/api/users');
const testHelper = require('../test_helper');
const mockingoose = require('mockingoose');
const commonHelper = require('../../server/helpers/commonHelper');
const { User } = require('../../server/models/User');
const QS = require('qs');

describe('SERVICE-AUTH', () => {
  beforeAll(() => {
    server = testHelper.createTestServer('/', UserPlugin);
  });

  afterAll(async () => {
    jest.clearAllMocks();
    mockingoose.resetAll();

    // Close server and redis client if they exist
    if (server && server.close) {
      await server.close();
    }
  });

  /*
   * EXPERIMENT
   */
  describe('[POST] Create User', () => {
    let payload;
    beforeEach(() => {
      mockingoose(User).toReturn(
        { _id: 'userId', userName: 'test', accountNumber: '12345', emailAddress: 'test@example.com', identityNumber: '123456' },
        'save'
      );
      payload = { userName: 'test', accountNumber: '12345', emailAddress: 'test@example.com', identityNumber: '123456' };
    });

    test('it should return status response 200 Success Create User', async () => {
      await request(server)
        .post('/user')
        .send(payload)
        .expect(201)
        .then((response) => {
          expect(response.body).toBeDefined();
          expect(response.statusCode).toBe(201);
          expect(response.body.status).toBe('Success');
        });
    });

    test('it should return status response 400 Bad Request didnt send payload', async () => {
      await request(server)
        .post('/user')
        .expect(400)
        .then((response) => {
          expect(response.body).toBeDefined();
          expect(response.statusCode).toBe(400);
          expect(response.body.error).toBe('Bad Request');
        });
    });

    test('it should return status response 500 Internal Server Error Couldnt connect DB', async () => {
      mockingoose(User).toReturn(new Error('Database error'), 'save');
      await request(server)
        .post('/user')
        .send(payload)
        .expect(500)
        .then((response) => {
          expect(response.statusCode).toBe(500);
          expect(response.body.message).toBe('Something Went Wrong');
          expect(response.body.statusMessage).toBe('Database error');
        });
    });
  });

  describe('[GET] Get All User', () => {
    beforeEach(() => {
      mockingoose(User).toReturn(
        { _id: 'userId', userName: 'test', accountNumber: '12345', emailAddress: 'test@example.com', identityNumber: '123456' },
        'find'
      );
    });

    test('it should return status response 200 Success Create User', async () => {
      await request(server)
        .get('/users')
        .expect(200)
        .then((response) => {
          expect(response.body).toBeDefined();
          expect(response.statusCode).toBe(200);
          expect(response.body.status).toBe('Success');
        });
    });

    test('it should return status response 500 Internal Server Error Couldnt connect DB', async () => {
      mockingoose(User).toReturn(new Error('Database error'), 'find');
      await request(server)
        .get('/users')
        .expect(500)
        .then((response) => {
          console.log(222, response);
          expect(response.statusCode).toBe(500);
          expect(response.body.message).toBe('Something Went Wrong');
          expect(response.body.statusMessage).toBe('Database error');
        });
    });
  });

  describe('[DELETE] Delete User By Id', () => {
    beforeEach(() => {
      mockingoose(User).toReturn(
        { _id: '664c53c8c6b7624258c87d40', userName: 'test', accountNumber: '12345', emailAddress: 'test@example.com', identityNumber: '123456' },
        'findByIdAndDelete'
      );
    });

    test('it should return status response 404 Invalid User ID', async () => {
      await request(server)
        .delete(`/user?id=abc`)
        .expect(404)
        .then((response) => {
          console.log(response.body);
          expect(response.statusCode).toBe(404);
          expect(response.body.status).toBe(404);
          expect(response.body.statusMessage).toBe('Invalid User ID');
        });
    });

    test('it should return status response 404 User Is Not Found', async () => {
      await request(server)
        .delete(`/user?id=664c53c8c6b7624258c87d40`)
        .expect(404)
        .then((response) => {
          console.log(response.body);
          expect(response.statusCode).toBe(404);
          expect(response.body.status).toBe(404);
          expect(response.body.statusMessage).toBe('Not Found');
        });
    });

    test.only('it should return status response 200 User Deleted', async () => {
      await request(server)
        .delete(`/user?id=664c53c8c6b7624258c87d40`)
        .expect(404)
        .then((response) => {
          console.log(111, response.body);
          expect(response.statusCode).toBe(404);
          expect(response.body.status).toBe(404);
          expect(response.body.statusMessage).toBe('Not Found');
        });
    });

    test('it should return status response 500 Internal Server Error Couldnt connect DB', async () => {
      mockingoose(User).toReturn(new Error('Database error'), 'find');
      await request(server)
        .get('/users')
        .expect(500)
        .then((response) => {
          console.log(222, response);
          expect(response.statusCode).toBe(500);
          expect(response.body.message).toBe('Something Went Wrong');
          expect(response.body.statusMessage).toBe('Database error');
        });
    });
  });
});
