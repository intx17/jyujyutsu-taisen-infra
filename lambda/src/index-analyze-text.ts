import { AnalyzeTextLogic } from './logic/analyze-text-logic';

export const handler = async(event: any, contenxt: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new AnalyzeTextLogic();
    try {
        const parsedEvent = logic.parseAnalyzeSentimentEvent(event);
        const data = await logic.analyzeSentiment(parsedEvent);

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
            },
        }));
        return callback(e, {});
    }
}