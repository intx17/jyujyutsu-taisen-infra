import { callbackMock } from './util/local-exec-util';
import { handler } from '../../index-find-positives';

(async (): Promise<void> => {
    const event: any = {
        prefecture: '東京都',
    };
    await handler(event, null, callbackMock);
})();