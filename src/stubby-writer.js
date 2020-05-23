const fs = require('fs');

const stubbyWriter = (resultPath) => {
    const content = [];
    const path = resultPath;

    const createMock = (entry, recordRequestParams) => {
        const url = new URL(entry.request.url);
        const contentType = entry.response.content.mimeType;
        const query = entry.request.queryString.map(elem => {
            const param = {};
            param[elem.name] = elem.value;
            return param;
        });
        const post = (entry.request.postData && entry.request.postData.text) ? entry.request.postData.text : false;
        return {
            request: {
                url: `^${url.pathname}`,
                method: entry.request.method,
                ...(recordRequestParams && query.length > 0 && { 'query': query }),
                ...(recordRequestParams && !!post && { post })
            },
            response: {
                status: entry.response.status,
                latency: 500,
                headers: {
                    'content-type': contentType
                },
                body: entry.response.content.text
            }
        }
    };

    return {
        parseEntries: (entries, recordRequestParams) => {
            try {
                for (let entry of entries) {
                    content.push(createMock(entry, recordRequestParams));
                }
                return content;
            } catch (err) {
                throw new Error('Something went wrong while parsing entries');
            }
        },
        save: () => {
            try {
                const data = JSON.stringify(content, null, 2);
                fs.writeFileSync(path, data);
            } catch (err) {
                throw new Error('Something went wrong while saving the stubby data file');
            }
        }
    }
}

module.exports = { stubbyWriter };