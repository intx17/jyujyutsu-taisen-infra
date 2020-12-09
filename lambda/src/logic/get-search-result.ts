import Twitter from 'twitter';
import secrets from '../secrets.json';

interface ParsedSearchTweetsEvent {
    q: string
}

interface GetSearchResultResult {
    text: string
}

export class GetSearchResultLogic {
    private twitterClient: Twitter;

    constructor () {
        this.twitterClient = new Twitter({
            consumer_key: secrets.consumerKey,
            consumer_secret: secrets.consumerSecret,
            access_token_key: secrets.accessTokenKey,
            access_token_secret: secrets.accessTokenSecret
        })
    }

    parseSearchTweetsEvent (event: any): ParsedSearchTweetsEvent {
        const q: string | undefined = event?.q
        if (!q) {
            throw new Error(`event is invalid. ${JSON.stringify(event)}`);
        }

        return {
            q
        }
    }

    async getSearchResult(parsedEvent: ParsedSearchTweetsEvent): Promise<GetSearchResultResult> {
        const requestParams = {
            q: parsedEvent.q,
            count: 5
        }

        return new Promise((resolve, reject) => {
            this.twitterClient.get('search/tweets', requestParams, (err, data, response) => {
                if (err) {
                    reject(err);
                }
                const statuses = data.statuses;
                const text = statuses.reduce((combined: string, status: any) => {
                    combined += String(status.text);
                    return combined;
                }, '');
                resolve({
                    text,
                });
            })
        })
    }
}
