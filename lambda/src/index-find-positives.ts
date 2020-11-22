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

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                result: 'SUCCEEDED',
                positiives: {
                    prefecture: parsedEvent.prefecture,
                    latestPositives: positivesOfPref
                }
            }),
        }
        callback(null, response);
    } catch (e) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                result: 'FAILED',
                error: {
                    reason: e.message
                },
            }),
        }
        return callback(null, response);
    }
}