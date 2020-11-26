import { callbackMock } from './util/local-exec-util';
import { handler } from '../../index-analyze-text';

(async (): Promise<void> => {
    const event: any = {
        text: '楽しい、悲しい、面白い',
    };
    await handler(event, null, callbackMock);
})();