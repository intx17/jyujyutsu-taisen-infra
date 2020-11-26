import { callbackMock } from './util/local-exec-util';
import { handler } from '../../index-get-timeline-text';

(async (): Promise<void> => {
    const event: any = {
        screenName: 'xxxxxx',
    };
    await handler(event, null, callbackMock);
})();