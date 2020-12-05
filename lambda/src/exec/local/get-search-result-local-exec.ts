import { callbackMock } from './util/local-exec-util';
import { handler } from '../../index-get-search-result';

(async (): Promise<void> => {
    await handler({
        q: 'test',
        count: 10
    }, null, callbackMock);
})();