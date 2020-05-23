const { runner } = require('./src/runner');

var argv = require('minimist')(process.argv.slice(2));

if (argv['help']) {
    const helpMessage = `har-to-stubby Help
    Mandatory arguments:
        --source                    .har file location
        --destination               stubby data file output location(it will be overridden if exist)
    Optional arguments:
        --filter-urls-by-regexp     If present, only urls that match will be take into consideration (e.g. "/backend-api/g").
        --with-request-params      If present, query params and post data will be included in the mock`;
    console.info(helpMessage);
    return;
}


if (argv['source'] && argv['destination']) {
    const source = argv['source'];
    const result = argv['destination'];
    const urlsToKeepParam = argv['filter-urls-by-regexp'] ? argv['filter-urls-by-regexp'] : null;
    const withRequestParams = argv['with-request-params'] ? argv['with-request-params'] : false;

    try {
        runner(source, result, urlsToKeepParam, withRequestParams);
    } catch (err) {
        console.error(err);
    }
    
} else {
    console.error('Arguments --source and --destination are mandatory');
}