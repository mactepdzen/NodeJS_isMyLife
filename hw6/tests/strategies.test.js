const strategies = require('../strategies');
const db = require('../database');

jest.mock('../database');


describe('strategies test', () => {
    const token = 'token_lol';
    const doneCallback = jest.fn();
    const username = 'Onotole';

    beforeEach(() => {
        db.User.findOne.mockImplementation(({jwt: token}) => {
            return {
                exec: () => {
                    return new Promise((resolve) => {
                        resolve({name: username});
                    });
                },
            };
        });
    });

    test('searching for user', () => {
        strategies.bearerStrategy(token, doneCallback);
        expect(db.User.findOne).toHaveBeenCalled();
    });

    test('bearerStrategy should call done when found token', async () => {
        await strategies.bearerStrategy(token, doneCallback);
        expect(doneCallback).toHaveBeenCalled();
    })

    test('localStrategy should return name in case of valid JWT', async() => {
        await strategies.localStrategy(username, 'keke', doneCallback);
        expect(doneCallback).toHaveBeenCalled();
        expect(doneCallback.mock.calls[0][0]).toBe({name: 'Onotole'});
    })
})
