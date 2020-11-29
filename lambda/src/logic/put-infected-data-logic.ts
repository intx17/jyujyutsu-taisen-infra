import { v4 as uuidv4 } from 'uuid';
import { DynamoDB } from 'aws-sdk';
import moment from 'moment';

interface ParsedPutInfectedDataEvent {
    content: string,
}

export class PutInfectedDataLogic {
    parsePutInfectedDataEvent (event: any) {
        const content: string | undefined = event?.content
        if (!content) {
            throw new Error(`parameter is invalid. ${JSON.stringify(event)}`);
        }

        return {
            content
        }
    }

    async putInfectedData (parsedEvent: ParsedPutInfectedDataEvent) {
        const dynamoDb = new DynamoDB.DocumentClient();
        const input: DynamoDB.DocumentClient.PutItemInput = {
            TableName: 'InfectedData-k4wzejb44nfnncje7zbcjewbyq-dev',
            Item: {
                id: uuidv4(),
                content: parsedEvent.content,
                date: moment().format('YYYY-MM-DD')
            }
        }
        await dynamoDb.put(input).promise();
    }
}
