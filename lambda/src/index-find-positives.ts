import { FindPositivesLogic } from './logic/find-positives-logic';

export const handler = async(event: any, contenxt: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new FindPositivesLogic();
    try {
        const parsedEvent = logic.parseFindPositivesEvent(event);
        console.log(JSON.stringify({
            message: 'event was parsed',
            parsedEvent
        }));
        const positives = await logic.getPositives();
        const positivesOfPref = logic.findPositivesOfPrefecture(parsedEvent, positives);

        const ret = {
            prefecture: parsedEvent.prefecture,
            latestPositives: positivesOfPref
        }
          console.log(JSON.stringify({
            message: 'return value',
            ret
        }));
        callback(null, ret);
    } catch (e) {
        return callback(e);
    }
}