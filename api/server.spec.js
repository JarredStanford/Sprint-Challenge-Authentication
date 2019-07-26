const request = require('supertest')

const server = require('./server.js')
const db = require('../database/dbConfig.js');

beforeEach(async () => {
    await db('users').truncate();
});

describe('server', () => {
    it('db environment set to testing', () => {
        expect(process.env.DB_ENV).toBe('testing')
    })

    describe('POST /api/register', () => {
        it('should return 201 OK and new username', () => {
            const user = {
                username: 'jarred5',
                password: "password"
            }
            return request(server)
                .post('/api/register')
                .send(user)
                .then(res => {
                    expect(res.status).toBe(201)
                    expect(res.body.username).toBe(user.username)
                })
        })


        /*it('requests with a username already in the DB should return 400', () => {
            const user = {
                username: "jarred5",
                password: "yo"
            }
            const error = "A user with this name already exists."

            return request(server)
                .post('/api/register')
                .send(user)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.message).toBe(error)
                })
        })*/

        it('requests without a username or password should return 400', () => {
            const user = {
                username: "jarred"
            }
            const error = "Please include a username and password to register."
            return request(server)
                .post('/api/register')
                .send(user)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.message).toBe(error)
                })
        })
    })

    describe('POST /api/login', () => {
        it('should return 200 OK', () => {
            const user = {
                username: 'jarred',
                password: 'nah'
            }

            return request(server)
                .post('/api/login')
                .send(user)
                .then(res => {
                    expect(res.status).toBe(200)
                })
        })
        it('requests without a login or password should return 400', () => {
            const user = {
                username: 'jarred'
            }
            const error = "Username or password are missing."

            return request(server)
                .post('/api/login')
                .send(user)
                .then(res => {
                    expect(res.status).toBe(400)
                    expect(res.body.message).toBe(error)
                })
        })
    })
})