import { S3 } from "aws-sdk";
import { ParsedPositives } from '../domain/positives';

export interface ParsedFindPositivesEvent {
    prefecture: string;
}

export class FindPositivesLogic {
    async getPositives (): Promise<ParsedPositives> {
        const s3Client = new S3();
        const getRequest: S3.GetObjectRequest = {
            Bucket: 'my-doomsday-clock-bucket',
            Key: 'positives.json',
        }

        const data = await s3Client.getObject(getRequest).promise();
        if (!data.Body) {
            throw new Error('json body got from s3 does not exist.')
        }
        return JSON.parse(data.Body.toString());
    }

    findPositivesOfPrefecture(parsedEvent: ParsedFindPositivesEvent, positives: ParsedPositives): number {
        const latestPositivesNumber = positives.data47[parsedEvent.prefecture];
        if (!latestPositivesNumber) {
            throw new Error('data of requested prefecture does not exist.');
        }
        return latestPositivesNumber;
    }
    
    parseFindPositivesEvent (event: any): ParsedFindPositivesEvent {
        const prefecture: string | undefined = event?.queryStringParameters?.prefecture
        if (!prefecture) {
            throw new Error('prefecture parameter is missing or blank.');
        }

        return {
            prefecture
        }
    }
}