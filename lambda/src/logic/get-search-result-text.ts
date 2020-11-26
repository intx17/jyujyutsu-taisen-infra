import { info } from 'console';
import Twitter from 'twitter';
import secrets from '../secrets.json';

interface ParsedSearchTweetsEvent {
    q: string,
    count: number
}

export class GetSearchResultTextLogic {
    private twitterClient: Twitter;

    constructor () {
        this.twitterClient = new Twitter({
            consumer_key: secrets.consumerKey,
            consumer_secret: secrets.consumerSecret,
            access_token_key: secrets.accessTokenKey,
            access_token_secret: secrets.accessTokenSecret
        })
    }

    parseGetTimelineTextEvent (event: any): ParsedSearchTweetsEvent {
        const q: string | undefined = event?.q
        const count: number | undefined = event?.count
        if (!q || !count) {
            throw new Error('parameter is invalid.');
        }

        return {
            q,
            count
        }
    }

    async getSearchResultText(parsedEvent: ParsedSearchTweetsEvent): Promise<void> {
        const requestParams = {
            q: parsedEvent.q,
            count: parsedEvent.count
        }

        return new Promise((resolve, reject) => {
            this.twitterClient.get('search/tweets', requestParams, (err, data, response) => {
                if (err) {
                    reject(err);
                }
                console.log(data);
                resolve();
            })
        })
    }
}
