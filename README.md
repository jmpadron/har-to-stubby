# har-to-stubby
CLI package to create a [Stubby](https://www.npmjs.com/package/stubby) data .json file based on a [HAR](https://en.wikipedia.org/wiki/HAR_(file_format)) file.

## Use Cases
This package allows you to convert the HTTP browser's interactions into mock data. You can find it useful in, among others, these situations:
* A starting point for a mock server.
* Recreate on your local mock server something that's happening in another environment.

## Installation
    npm install -g har-to-stubby

## Test
    npm run test

## CLI Arguments
```
 Mandatory arguments:
    --source                    .har file location
    --destination               stubby data file output location(it will be overridden if exist)

Optional arguments:
    --filter-urls-by-regexp     If present, only urls that match will be take into consideration
    --track-request-params      If present, query params and post data will be included in the mock
```

## Example
```
har-to-stubby --source "./test-data/localhost.har" --destination "./test-data/localhost.json" --filter-urls-by-regexp "/cool-api/g" --track-request-params
```
