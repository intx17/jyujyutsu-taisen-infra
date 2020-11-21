import config from 'config';
import fetch from 'node-fetch';
import { S3 } from 'aws-sdk';
import { OriginalPositives, ParsedPositives } from '../domain/positives';

export class UpdatePositivesLogic {
    async fetchLatestPositives (): Promise<ParsedPositives> {
        const response = await fetch('https://www3.nhk.or.jp/news/special/coronavirus/data/47newpatients-data.json')
            .catch((e) => { throw new Error(e) });
        const data: OriginalPositives = await response.json();

        const parsedData47 = data.data47.reduce((o, d) => {
            const prefectureName: string = d.name;
            const latestPositives: number = d.data[d.data.length - 1];
            const obj = Object.assign(o, {[prefectureName]: latestPositives})
            return obj;
        }, {})

        return {
            data47: parsedData47
        }
    }

    async uploadPositives (json: string) {
        const s3Client = new S3();
        const uploadRequest: S3.PutObjectRequest = {
            Bucket: 'my-doomsday-clock-bucket',
            Key: 'positives.json',
            Body: json,
        }

        await s3Client.putObject(uploadRequest).promise();
    }
}
