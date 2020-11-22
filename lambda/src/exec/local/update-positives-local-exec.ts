import { callbackMock } from './util/local-exec-util';
import { handler } from '../../index-update-positives';

(async (): Promise<void> => {
    const event: any = {};
    await handler(event, null, callbackMock);
})();