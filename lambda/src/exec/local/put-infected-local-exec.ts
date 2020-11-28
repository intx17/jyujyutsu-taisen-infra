import { callbackMock } from './util/local-exec-util';
import { handler } from '../../index-put-infected-data';

(async (): Promise<void> => {
    const event: any = {};
    await handler(event, null, callbackMock);
})();