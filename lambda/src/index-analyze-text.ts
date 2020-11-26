import { AnalyzeTextLogic } from './logic/analyze-text-logic';

export const handler = async(event: any, contenxt: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new AnalyzeTextLogic();
    try {
        const parsedEvent = logic.parseAnalyzeSentimentEvent(event);
        console.log(JSON.stringify({
            message: 'event was parsed',
            parsedEvent
        }));
        const data = await logic.analyzeSentiment(parsedEvent);

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                result: 'SUCCEEDED',
                data
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
        return callback(e, response);
    }
}