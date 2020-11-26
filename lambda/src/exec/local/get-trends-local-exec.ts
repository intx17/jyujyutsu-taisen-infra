import { callbackMock } from './util/local-exec-util';
import { handler } from '../../index-get-trends';

(async (): Promise<void> => {
    await handler({}, null, callbackMock);
})();