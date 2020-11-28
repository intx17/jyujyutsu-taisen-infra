import fetch from 'node-fetch';
import { OriginalInfectedData, ParsedInfectedData, parse } from '../domain/infected-data';

interface FetchInfectedDataResult {
    content: string
}

export class FetchInfectedDataLogic {
    async fetchInfectedData (): Promise<FetchInfectedDataResult> {
        const response = await fetch('https://www3.nhk.or.jp/news/special/coronavirus/data/47newpatients-data.json')
            .catch((e) => { throw new Error(e) });
        const data: OriginalInfectedData = await response.json();
        const parsed: ParsedInfectedData = parse(data);
        
        return {
            content: JSON.stringify(parsed),
        };
    }
}
