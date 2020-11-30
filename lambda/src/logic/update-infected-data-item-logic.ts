import { DynamoDB } from 'aws-sdk';
import moment from 'moment';

interface ParsedUpdateInfectedDataItemEvent {
    content: string,
}

interface InfectedDataItem {
    id: string,
    date?: string,
    content?: string,
}

export class UpdateInfectedDataItemLogic {
    private client: DynamoDB.DocumentClient;
    private tableName: string;

    constructor () {
        this.client = new DynamoDB.DocumentClient();
        this.tableName = 'InfectedData-kluhkmblrbejljkhxtul4ec6re-dev';
    }
    parseUpdateInfectedDataItemEvent (event: any) {
        const content: string | undefined = event?.content
        if (!content) {
            throw new Error(`parameter is invalid. ${JSON.stringify(event)}`);
        }

        return {
            content
        }
    }

    async updateInfectedDataItem (parsedEvent: ParsedUpdateInfectedDataItemEvent) {
        const now = moment();
        const date = now.format('YYYY-MM-DD');

        const input: DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: this.tableName,
            Key: {
                date
            },
            ExpressionAttributeNames: {
                '#content': 'content',
                '#createdAt': 'createdAt',
                '#updatedAt': 'updatedAt',
                '#typeName': '__typename',
            },
            ExpressionAttributeValues: {
                ':content': parsedEvent.content,
                ':createdAt': now.toISOString(),
                ':updatedAt': now.toISOString(),
                ':typeName': 'InfectedData',
            },
            ReturnValues: 'ALL_NEW', 
        }

        input.UpdateExpression = 'SET #content = :content, #typeName = :typeName, #updatedAt = :updatedAt, #createdAt = if_not_exists(#createdAt, :createdAt)';
        await this.client.update(input).promise();
    }
}
