const expect = require('chai').expect;
const { harReader } = require('./../src/har-reader');

// stubs
const stubHarParsed = {
    log: {
        entries: [
            {
                request: {
                    url: 'http://fake-domain.com/cool-api/todo'
                }
            },
            {
                request: {
                    url: 'http://fake-domain.com/news'
                }
            }
        ]
    }
};

describe('har-reader tests', () => {
    it('should return an object if path is valid', () => {
        expect(harReader('./test/data/fake-domain.har')).to.be.an('object');
    });
    it('should throw an error if path is invalid', () => {
        expect(() => {
            harReader('./test/data/wrong-path.har')
        }).to.throw('The HAR file is not accessible');
    });

    it('should parse .har file is is valid', () => {
        const obj = harReader('./test/data/fake-domain.har');
        const parsed = obj.getJSON();
        expect(parsed.log.entries.length).to.equal(1);
    });
    it('should throw an error while parsing .har file if is invalid', () => {
        const obj = harReader('./test/data/invalid.har');
        expect(() => {
            obj.getJSON();
        }).to.throw('Something went wrong while parsing the HAR file');
    });

    it('should return all entries if no regexp is provided', () => {
        const obj = harReader('./test/data/fake-domain.har');
        expect(obj.filterEntries(stubHarParsed, null).length).to.equal(stubHarParsed.log.entries.length);
    });
    it('should return entries that match with provided regexp', () => {
        const obj = harReader('./test/data/fake-domain.har');
        expect(obj.filterEntries(stubHarParsed, /cool-api/g).length).to.equal(1);
    });
    it('should throw an error if parsed data does not have the proper format', () => {
        const obj = harReader('./test/data/fake-domain.har');
        expect(() => {
            obj.filterEntries({ key: 9090 }, "wrong-regexp");
        }).to.throw('Something went wrong while filtering the HAR file');
    })
})