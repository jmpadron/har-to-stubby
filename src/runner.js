const { harReader } = require('./har-reader');
const { stubbyWriter } = require('./stubby-writer');

const runner = (source, result, urlsToKeepParam, withRequestParams) => {
    const parseRegexp = (regexpParam) => {
        if(regexpParam) {
            try {
                const flags = regexpParam.replace(/.*\/([gimy]*)$/, '$1');
                const pattern = regexpParam.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
                return new RegExp(pattern, flags);
            } catch (err) {
                throw new Error(`Something went wrong while parsing provided regexp: '${regexpParam}' . No filter will be applied.`);
            }
        }
    }

    try {
        const har = harReader(source);
        const harJson = har.getJSON();
        const entries = har.filterEntries(harJson, parseRegexp(urlsToKeepParam));

        const stubby = stubbyWriter(result);
        stubby.parseEntries(entries, withRequestParams);
        stubby.save();
        console.info('Process finished successfully');
    } catch (err) {
        throw err;
    }
};

module.exports = { runner };