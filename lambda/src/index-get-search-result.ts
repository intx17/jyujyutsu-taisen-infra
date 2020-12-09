import { GetSearchResultLogic } from './logic/get-search-result'

export const handler = async(event: any, contenxt: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new GetSearchResultLogic();
    try {
        const parsedEvent = logic.parseSearchTweetsEvent(event);

        const data = await logic.getSearchResult(parsedEvent);

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