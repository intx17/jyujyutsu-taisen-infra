import { FetchInfectedDataLogic } from './logic/fetch-infected-data-logic';

export const handler = async (event: any, context: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new FetchInfectedDataLogic();
    try {
        const data = await logic.fetchInfectedData();

        console.log(JSON.stringify({
            result: 'SUCCEEDED',
            data
        }))

        callback(null, data);
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