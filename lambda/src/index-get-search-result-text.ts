import { GetSearchResultTextLogic } from './logic/get-search-result-text'

export const handler = async(event: any, contenxt: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new GetSearchResultTextLogic();
    try {
        const parsedEvent = logic.parseGetTimelineTextEvent(event);

        const data = await logic.getSearchResultText(parsedEvent);

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