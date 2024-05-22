const request = require('supertest');
const UserPlugin = require('../../server/api/users');
const testHelper = require('../test_helper');
const mockingoose = require('mockingoose');
const commonHelper = require('../../server/helpers/commonHelper');
const RedisService = require('../../server/services/redisService');
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
        { _id: '664d3fc3ff0857ddfe3a2f77', userName: 'test', accountNumber: '12345', emailAddress: 'test@example.com', identityNumber: '123456' },
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
        { _id: '664d3fc3ff0857ddfe3a2f77', userName: 'test', accountNumber: '12345', emailAddress: 'test@example.com', identityNumber: '123456' },
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
          expect(response.statusCode).toBe(500);
          expect(response.body.message).toBe('Something Went Wrong');
          expect(response.body.statusMessage).toBe('Database error');
        });
    });
  });

  describe('[GET] User By Id', () => {
    beforeEach(() => {
      const specificId = '664d3fc3ff0857ddfe3a2f77';
      mockingoose(User).toReturn(
        {
          _id: specificId,
          userName: 'testuser',
          accountNumber: '12345678',
          emailAddress: 'testuser@example.com',
          identityNumber: 123456
        },
        'findOne'
      );
      // let getKey;
      // getKey = jest.spyOn(RedisService, 'getDataRedis');
      // MockGetKeyRedis =
      //   '{"_id":"664d3fc3ff0857ddfe3a2f77","userName":"Abigayle.Hegmann","accountNumber":"88786686","emailAddress":"jamil85@example.com","identityNumber":951,"__v":0}';

      // getKey.mockImplementation((keys) => {
      //   if (keys.key === `fmc_pt_status_TSEL_i1_123123123`) {
      //     return Promise.resolve(MockGetKeyRedis);
      //   }
      // });
    });

    test('it should return status response 200 Success Find User By Id', async () => {
      const specificId = '664d3fc3ff0857ddfe3a2f77';
      await request(server)
        .get(`/user?id=${specificId}`)
        .set(commonHelper.getDefaultHeaders())
        .expect(200)
        .then((response) => {
          expect(response.body).toBeDefined();
          expect(response.statusCode).toBe(200);
          expect(response.body.status).toBe('Success');
        });
    });

    test('it should return status response 403 Forbidden', async () => {
      mockingoose(User).toReturn(null, 'findOne');
      await request(server)
        .get('/user?id=asdasd')
        .expect(403)
        .set(commonHelper.getDefaultHeaders())
        .then((response) => {
          expect(response.statusCode).toBe(403);
        });
    });

    test('it should return status response 500 ', async () => {
      mockingoose(User).toReturn(new Error('Database error'), 'findOne');
      await request(server)
        .get('/user?id=664d3fc3ff0857ddfe3a2f77')
        .expect(500)
        .set(commonHelper.getDefaultHeaders())
        .then((response) => {
          expect(response.statusCode).toBe(500);
        });
    });
  });

  describe('[DELETE] Delete User By Id', () => {
    beforeEach(() => {
      mockingoose(User).toReturn(
        { _id: '664d3fc3ff0857ddfe3a2f77', userName: 'test', accountNumber: '12345', emailAddress: 'test@example.com', identityNumber: '123456' },
        'findOne'
      );
      mockingoose(User).toReturn(
        { _id: '664d3fc3ff0857ddfe3a2f77', userName: 'test', accountNumber: '12345', emailAddress: 'test@example.com', identityNumber: '123456' },
        'findOneAndDelete'
      );
    });

    test('it should return status response 200 Success', async () => {
      await request(server)
        .delete(`/user?id=664d3fc3ff0857ddfe3a2f77`)
        .set(commonHelper.getDefaultHeaders())
        .expect(200)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body.status).toBe('Del Success');
        });
    });

    test('it should return status response 403 Forbidden Delete', async () => {
      mockingoose(User).toReturn(null, 'findOneAndDelete');
      await request(server)
        .delete('/user?id=asdasd')
        .expect(403)
        .set(commonHelper.getDefaultHeaders())
        .then((response) => {
          expect(response.statusCode).toBe(403);
        });
    });
    // test('it should return status response 404 Invalid User ID', async () => {
    //   await request(server)
    //     .delete(`/user?id=abc`)
    //     .set(commonHelper.getDefaultHeaders())
    //     .expect(404)
    //     .then((response) => {
    //       expect(response.statusCode).toBe(404);
    //       expect(response.body.status).toBe(404);
    //       expect(response.body.statusMessage).toBe('Invalid User Id');
    //     });
    // });

    test('it should return status response 500 Internal Server Error Couldnt connect DB', async () => {
      mockingoose(User).toReturn(new Error('Database error'), 'find');
      await request(server)
        .get('/users')
        .set(commonHelper.getDefaultHeaders())
        .expect(500)
        .then((response) => {
          expect(response.statusCode).toBe(500);
          expect(response.body.message).toBe('Something Went Wrong');
          expect(response.body.statusMessage).toBe('Database error');
        });
    });
  });

  describe('[UPDATE] Update User By Id', () => {
    beforeEach(() => {
      mockingoose(User).toReturn(
        { _id: '664d3fc3ff0857ddfe3a2f77', userName: 'test', accountNumber: '12345', emailAddress: 'test@example.com', identityNumber: '123456' },
        'findOneAndUpdate'
      );
      payload = {
        userId: '664d3fc3ff0857ddfe3a2f77',
        userName: 'test',
        accountNumber: '12345',
        emailAddress: 'test@example.com',
        identityNumber: 123456
      };
    });

    test('it should return status response 200 User Updated', async () => {
      await request(server)
        .patch(`/user`)
        .set(commonHelper.getDefaultHeaders())
        .expect(201)
        .send(payload)
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body.status).toBe('Success');
        });
    });

    test('it should return status response 403 Forbidden Update', async () => {
      mockingoose(User).toReturn(null, 'findOneAndUpdate');
      payload.userId = 'asdasd';
      await request(server)
        .patch('/user')
        .send(payload)
        .expect(403)
        .set(commonHelper.getDefaultHeaders())
        .then((response) => {
          expect(response.statusCode).toBe(403);
        });
    });
    test('it should return status response 400  Bad Request', async () => {
      await request(server)
        .patch(`/user`)
        .set(commonHelper.getDefaultHeaders())
        .expect(400)
        .then((response) => {
          expect(response.statusCode).toBe(400);
          expect(response.body.statusCode).toBe(400);
          expect(response.body.error).toBe('Bad Request');
        });
    });

    // test('it should return status response 404 Invalid User ID', async () => {
    //   payload.userId = 'abc';
    //   await request(server)
    //     .patch(`/user`)
    //     .set(commonHelper.getDefaultHeaders())
    //     .send(payload)
    //     .expect(404)
    //     .then((response) => {
    //       expect(response.statusCode).toBe(404);
    //       expect(response.body.status).toBe(404);
    //       expect(response.body.statusMessage).toBe('Invalid User Id');
    //     });
    // });

    // test.only('it should return status response 404 User Is Not Found', async () => {
    //   mockingoose(User).toReturn(null, 'findOneAndUpdate');
    //   payload.userId = '664c53c8c6b7624258c87d40';

    //   await request(server)
    //     .patch(`/user`)
    //     .send(payload)
    //     .expect(404)
    //     .then((response) => {
    //       expect(response.statusCode).toBe(404);
    //       expect(response.body.status).toBe(404);
    //       expect(response.body.statusMessage).toBe('Not Found');
    //     });
    // });

    test('it should return status response 500 Internal Server Error Couldnt connect DB', async () => {
      mockingoose(User).toReturn(new Error('Database error'), 'findOneAndUpdate');
      await request(server)
        .get('/users')
        .set(commonHelper.getDefaultHeaders())
        .expect(500)
        .then((response) => {
          expect(response.statusCode).toBe(500);
          expect(response.body.message).toBe('Something Went Wrong');
          expect(response.body.statusMessage).toBe('Database error');
        });
    });
  });
});
