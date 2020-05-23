const expect = require('chai').expect;
const fs = require('fs');
const { stubbyWriter } = require('./../src/stubby-writer');

// stubs
const path = './test/data/fake-domain.json';
const stubEntries = [
    {
        request: {
            url: 'https://fake-domain.com/cool-api/todo',
            method: 'POST',
            queryString: [],
            postData: {
                text: 'id=10001077&ver=1&passw=1112'
            },
        },
        response: {
            headers: [
                {
                    name: 'Content-Type',
                    value: 'application/json'
                }
            ],
            status: 200,
            content: {
                text: '{"key":8998}'
            }
        }
    }
];

const stubMock = {
    request: {
        url: '^/cool-api/todo',
        method: 'POST'
    },
    response: {
        status: 200,
        latency: 500,
        headers: {
            'content-type': 'application/json'
        },
        body: '{"key":8998}'
    }
}

describe('stubby-writer tests', () => {
    it('should create a mock based on entry', () => {
        const obj = stubbyWriter(path);
        const mocks = obj.parseEntries(stubEntries, false);
        expect(mocks[0].request.url).to.equal(stubMock.request.url);
        expect(mocks[0].request.method).to.equal(stubMock.request.method);
        expect(mocks[0].response.status).to.equal(stubMock.response.status);
        expect(mocks[0].response.body).to.equal(stubMock.response.body);
        expect(mocks[0].response.headers['content-type']).to.equal(stubMock.response.headers['content-type']);
    });
    it('should create a mock with post params', () => {
        const obj = stubbyWriter(path);
        const mocks = obj.parseEntries(stubEntries, true);
        expect(mocks[0].request.post).to.equal(stubEntries[0].request.postData.text);
    });

    it('should throw an error if entries does not have the proper format', () => {
        const obj = stubbyWriter(path);
        expect(() => {
            obj.parseEntries({ random: 89 }, false);
        }).to.throw('Something went wrong while parsing entries')
    });

    it('should save .json stubby data file', () => {
        const obj = stubbyWriter(path);
        obj.parseEntries(stubEntries, false);
        obj.save();
        expect(() => {
            fs.accessSync(path, fs.constants.R_OK);
        }).not.to.throw('Something went wrong while saving the stubby data file');
    });
    it('should throw an error while saving .json stubby data file if path is invalid', () => {
        const obj = stubbyWriter('./wrong-path/fake-domain.json');
        obj.parseEntries(stubEntries, false);
        
        expect(() => {
            obj.save();
        }).to.throw('Something went wrong while saving the stubby data file');
    });
})