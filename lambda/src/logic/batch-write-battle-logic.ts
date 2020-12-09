import { v4 as uuidv4 } from 'uuid';
import { DynamoDB } from 'aws-sdk';
import moment from 'moment';
import { JapaneseWoeid } from '../domain/japanese-woeid';

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

export interface Player {
  id: string
  name: string
  maxHP: number
  woeid: JapaneseWoeid
  prefecture: string
}
interface Battle {
    id: string
    date: string
    playerHP: number
    curseHP: number
    histories: string
    trends: string
    playerID: string
    curseID: string
    inProgress: boolean
    createdAt: string
    updatedAt: string
    __typename: string
}

interface PutBattleParam {
    trends: string,
    curse: Curse,
    player: Player
}

export class BatchWriteBattleLogic {
    private client: DynamoDB.DocumentClient;
    private curseTableName: string;
    private playerTableName: string;

    constructor () {
        this.client = new DynamoDB.DocumentClient();
        this.curseTableName = 'Curse-jkmvijgwfjcwtkjx2z5dbeowqy-mtitechsa';
        this.playerTableName = 'Player-jkmvijgwfjcwtkjx2z5dbeowqy-mtitechsa';
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

    private async scanPlayer (): Promise<Player[]> {
        const input: DynamoDB.DocumentClient.ScanInput = {
            TableName: this.playerTableName
        }

        const players = await this.client.scan(input).promise();

        return players.Items?.map((item, index) => {
            return {
                id: String(item.id),
                name: String(item.name),
                maxHP: Number(item.maxHP),
                woeid: Number(item.woeid),
                prefecture: String(item.prefecture)
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
        const players = await this.scanPlayer();

        curses.sort((c1, c2) => c2.negative - c1.negative);

        const params: PutBattleParam[] = [];
        players.forEach(player => {
            eventChildren.forEach(child => {
                const curse = curses.find((c) => {
                    return c.negative <= (child.negative * child.tweetVolume)
                });

                if (!curse) {
                    return;
                }

                const param: PutBattleParam = {
                    player,
                    curse,
                    trends: child.text
                }

                params.push(param);
            });
        });

        return params;
    }

    async bulkBatchWriteBattles (params: PutBattleParam[]) {
        const paramsMatrix: PutBattleParam[][] = []
        let paramColumnCount = 0;
        let lastParamIndex = params.length - 1;
        let row: PutBattleParam[] = [];
        for (const [index, param] of params.entries()) {
            if (index === lastParamIndex) {
                paramsMatrix.push(row);
            } else if (paramColumnCount < 20) {
                row.push(param);
                paramColumnCount += 1;
            } else {
                paramsMatrix.push(row)
                row = [param]
                paramColumnCount = 0
            }
        }

        const now = moment();
        const createdAt = now.toISOString();
        const updatedAt = now.toISOString();

        let currentPlayerID = ''
        const inputs: DynamoDB.BatchWriteItemInput[] = paramsMatrix.map(row => {
            const writeRequests: DynamoDB.DocumentClient.WriteRequests = row.map(param => {
                // 1つだけ進行中にしておく
                const inProgress = currentPlayerID !== param.player.id;
                currentPlayerID = param.player.id
                const item: Battle = {
                    id: uuidv4(),
                    date: moment().format('YYYY-MM-DD'),
                    playerHP: param.player.maxHP,
                    curseHP: param.curse.maxHP,
                    histories: `${param.curse.name}が出現した\n`,
                    trends: param.trends,
                    playerID: param.player.id,
                    curseID: param.curse.id,
                    __typename: 'Battle',
                    inProgress,
                    createdAt,
                    updatedAt
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

            return batchWriteInput;
        });

        const requests = inputs.map(i => this.client.batchWrite(i).promise());

        await Promise.all(requests);
    }
}
