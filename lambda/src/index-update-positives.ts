import { UpdatePositivesLogic } from './logic/update-positives-logic';

export const handler = async (event: any, context: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new UpdatePositivesLogic();
    try {
        const positives = await logic.fetchLatestPositives()
        const json = JSON.stringify(positives);
        console.log(JSON.stringify({
            message: 'converted',
            json
        }));
        await logic.uploadPositives(json);

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                result: 'SUCCEEDED',
            }),
        }
        callback(null, response)
    } catch (e) {
         const response = {
            statusCode: 500,
            body: JSON.stringify({
                result: 'FAILED',
            }),
        }
        return callback(null, response);
    }
}