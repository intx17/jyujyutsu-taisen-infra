import { callbackMock } from './util/local-exec-util';
import { handler } from '../../index-get-trend-info';

(async (): Promise<void> => {
    await handler({}, null, callbackMock);
})();