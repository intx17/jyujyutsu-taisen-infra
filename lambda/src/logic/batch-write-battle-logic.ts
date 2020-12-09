import { v4 as uuidv4 } from 'uuid';
import { DynamoDB } from 'aws-sdk';
import moment from 'moment';

interface ParsedBatchWriteBattleLogicEvent {
    children: ParsedBatchWriteBattleLogicEventChild[]
}

interface ParsedBatchWriteBattleLogicEventChild {
    q: string
    tweetVolume: number
    text: string
    negative: number
}

interface Curse {
    id: string
    name: string
    negative: number
    maxHP: number
}

interface Battle {
    id: string
    date: string
    curseHP: number
    histories: string
    trends: string
    curseID: string
}

interface PutBattleParam {
    trends: string,
    curse: Curse
}

export class BatchWriteBattleLogic {
    private client: DynamoDB.DocumentClient;
    private curseTableName: string;

    constructor () {
        this.client = new DynamoDB.DocumentClient();
        this.curseTableName = 'Curse-jkmvijgwfjcwtkjx2z5dbeowqy-mtitechsa';
    }

    private parseBatchWriteBattleLogicEventChild  (child: any): ParsedBatchWriteBattleLogicEventChild {
        const q: string | undefined = child?.q;
        const tweetVolume: number | undefined = child?.tweetVolume;
        const text: string | undefined = child?.getSearchResultResult?.text;
        const negative: number | undefined = child?.analyzeTextResult?.sentimentScore?.negative;

        if (!(q && tweetVolume && text && negative)) {
            throw new Error(`parameter is invalid. ${JSON.stringify(child)}`);
        }

        return {
            q,
            tweetVolume,
            text,
            negative
        }
    }

    private async scanCurse (): Promise<Curse[]> {
        const input: DynamoDB.DocumentClient.ScanInput = {
            TableName: this.curseTableName,
            Limit: 10
        }

        const curses = await this.client.scan(input).promise();

        return curses.Items?.map((item, index) => {
            return {
                id: String(item.id),
                name: String(item.name),
                negative: Number(item.negative),
                maxHP: Number(item.maxHP)
            }
        })
        ?? [];
    }

    parseBatchWriteBattleLogicEvent (event: any): ParsedBatchWriteBattleLogicEvent {
         const searchAndAnalyzeResult: any[] | undefined = event;

        if (!searchAndAnalyzeResult) {
            throw new Error(`parameter is invalid. ${JSON.stringify(event)}`);
        }
        const children = searchAndAnalyzeResult.map(r => this.parseBatchWriteBattleLogicEventChild(r));

        return {
            children
        }
    }


    async getPutBattleParams (eventChildren: ParsedBatchWriteBattleLogicEventChild[]): Promise<PutBattleParam[]> {
        const curses = await this.scanCurse();

        curses.sort((c1, c2) => c2.negative - c1.negative);

        const params: PutBattleParam[] = [];
        eventChildren.forEach(child => {
            const curse = curses.find((c) => {
                return c.negative <= (child.negative * child.tweetVolume)
            });

            if (!curse) {
                return;
            }

            const param: PutBattleParam = {
                curse,
                trends: child.text
            }

            params.push(param);
        });

        return params;
    }

    async bulkBatchWriteBattles (params: PutBattleParam[]) {
        const writeRequests: DynamoDB.DocumentClient.WriteRequests = params.map(param => {
            const item: Battle = {
                id: uuidv4(),
                date: moment().format('YYYY-MM-DD'),
                curseHP: param.curse.maxHP,
                histories: `${param.curse.name}が出現した\n`,
                trends: param.trends,
                curseID: param.curse.id
            }
            const request: DynamoDB.DocumentClient.PutRequest = {
                Item: item
            }
            return {
                PutRequest: request
            }
        });

        // テーブル名がキー
        const map: DynamoDB.DocumentClient.BatchWriteItemRequestMap = {
            'Battle-jkmvijgwfjcwtkjx2z5dbeowqy-mtitechsa': writeRequests
        }

        const batchWriteInput: DynamoDB.BatchWriteItemInput = {
            RequestItems: map
        }

        await this.client.batchWrite(batchWriteInput).promise();
    }
}
