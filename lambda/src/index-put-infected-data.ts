import { PutInfectedDataLogic } from './logic/put-infected-data-logic';

export const handler = async (event: any, context: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new PutInfectedDataLogic();
    try {
        const parsedEvent = logic.parsePutInfectedDataEvent(event);
        await logic.putInfectedData(parsedEvent);

        console.log(JSON.stringify({
            result: 'SUCCEEDED'
        }))

        callback(null, {})
    } catch (e) {
        console.log(JSON.stringify({
            result: 'FAILED',
            error: {
                reason: e.message
            }
        }))
        return callback(e, {});
    }
}