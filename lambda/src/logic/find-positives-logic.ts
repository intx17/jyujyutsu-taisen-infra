import config from 'config';
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
            throw new Error('json body get from s3 does not exist.')
        }
        return JSON.parse(data.Body.toString());
    }

    findPositivesOfPrefecture(parsedEvent: ParsedFindPositivesEvent, positives: ParsedPositives): number {
        return positives.data47[parsedEvent.prefecture];
    }
    
    parseFindPositivesEvent (event: any): ParsedFindPositivesEvent {
        const prefecture: string | undefined = event?.prefecture
        if (!prefecture) {
            throw new Error('prefecture prop is missing or blank.');
        }

        return {
            prefecture
        }
    }
}