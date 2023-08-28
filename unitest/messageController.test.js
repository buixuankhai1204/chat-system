const request = require("supertest");
const httpServer = require("../serverChat");
const {connect, disconnect} = require("../mongooseConfig");
const dotenv = require("dotenv");
describe('Test All test cases controller of message', () => {
    let token = '';
    beforeAll(async () => {
        dotenv.config({ path: './config.env' });
        connect();
        const res = await request(httpServer)
            .post('/api/v1/users/signin')
            .send({
                "email": "buixuankhai1806@gmail.com",
                "password": "buixuankhai1806"
            });
        token = res._body.token;

    })

    describe('shouldReturnAllMessageByChannelId', () => {
        it('shouldReturnAllMessageByChannelId', async () => {
            const channelIdParams = "64df465c4fd5916745afd02f";
            const res = await request(httpServer)
                .get(`/api/v1/chat/message/${channelIdParams}`)
                .set('Authorization', `Bearer ${token}`);
            expect(channelIdParams).toBeDefined();
            expect(res.statusCode).toEqual(200)
        })
        it('shouldDefineChannelIdParams', async () => {
            const channelIdParams = "64df465c4fd5916745afd02f";
            expect(channelIdParams).toBeDefined();
        })
    })


    afterAll((done) => {
        disconnect(done);
    });
});

