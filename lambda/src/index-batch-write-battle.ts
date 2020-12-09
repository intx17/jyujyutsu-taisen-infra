import { BatchWriteBattleLogic } from './logic/batch-write-battle-logic';

export const handler = async (event: any, context: any, callback: (err: Error | null, result?: object) => void): Promise<void> => {
    const logic = new BatchWriteBattleLogic();

    try {
        const parsedEvent = logic.parseBatchWriteBattleLogicEvent(event);

        const params = await logic.getPutBattleParams(parsedEvent.children);

        await logic.bulkBatchWriteBattles(params);

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