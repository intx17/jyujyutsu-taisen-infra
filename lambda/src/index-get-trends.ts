import { GetTrendsogic } from './logic/get-trends';

export const handler = async(event: any, contenxt: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new GetTrendsogic();
    try {
        const data = await logic.getTrends();

        console.log(JSON.stringify({
            result: 'SUCCEEDED',
            data
        }),)
        callback(null, data);
    } catch (e) {
        console.log(JSON.stringify({
            result: 'FAILED',
            error: {
                reason: e.message
            },
        }))
        return callback(e, {});
    }
}