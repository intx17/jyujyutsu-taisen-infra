import { GetTimelineTextLoginc } from './logic/get-timeline-text';

export const handler = async(event: any, contenxt: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new GetTimelineTextLoginc();
    try {
        const parsedEvent = logic.parseGetTimelineTextEvent(event);
        console.log(JSON.stringify({
            message: 'event was parsed',
            parsedEvent
        }));
        const data = await logic.getTimelineText(parsedEvent);

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