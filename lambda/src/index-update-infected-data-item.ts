import { UpdateInfectedDataItemLogic } from './logic/update-infected-data-item-logic';

export const handler = async (event: any, context: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new UpdateInfectedDataItemLogic();
    try {
        const parsedEvent = logic.parseUpdateInfectedDataItemEvent(event);
        await logic.updateInfectedDataItem(parsedEvent);

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