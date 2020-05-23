const fs = require('fs');

const harReader = (harPath) => {
    try {
        fs.accessSync(harPath, fs.constants.R_OK);
        return {
            getJSON: () => {
                try {
                    const raw = fs.readFileSync(harPath);
                    return JSON.parse(raw);
                } catch (err) {
                    throw new Error('Something went wrong while parsing the HAR file');
                }
            },
            filterEntries: (harJson, regexpUrlToKeep) => {
                try {
                    const entries = harJson['log']['entries'];
                    if (!regexpUrlToKeep) {
                        return entries;
                    }
                    return entries.filter(entry => entry['request']['url'].search(regexpUrlToKeep) >= 0);

                } catch (err) {
                    throw new Error('Something went wrong while filtering the HAR file');
                }
            }
        }
    } catch (err) {
        throw new Error('Something went wrong. The HAR file is not accessible');
    }
}

module.exports = {
    harReader
}