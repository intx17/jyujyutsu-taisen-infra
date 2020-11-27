import { callbackMock } from './util/local-exec-util';
import { handler } from '../../index-get-trends';
import { JapaneseWoeid } from '../../domain/japanese-woeid';

(async (): Promise<void> => {
    await handler({
        woeid: JapaneseWoeid.Tokyo
    }, null, callbackMock);
})();