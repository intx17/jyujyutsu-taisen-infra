import Twitter from 'twitter';
import secrets from '../secrets.json';
import { JapaneseWoeid } from '../domain/japanese-woeid';

interface ParsedGetTrendsEvent {
    woeid: JapaneseWoeid,
}

interface GetTrendsResult {
    trends: Trend[]
}

interface Trend {
    q: string,
    count: number,
    tweetVolume: number
}

export class GetTrendsogic {
    private twitterClient: Twitter;

    constructor () {
        this.twitterClient = new Twitter({
            consumer_key: secrets.consumerKey,
            consumer_secret: secrets.consumerSecret,
            access_token_key: secrets.accessTokenKey,
            access_token_secret: secrets.accessTokenSecret
        })
    }

    parseGetTimelineTextEvent (event: any): ParsedGetTrendsEvent {
        const woeid: number | undefined = event?.woeid
        if (!woeid) {
            throw new Error(`event is invalid. ${JSON.stringify(event)}`);
        }

        return {
            woeid
        }
    }

    async getTrends(parsedEvent: ParsedGetTrendsEvent): Promise<GetTrendsResult> {
        const requestParams = {
            id: parsedEvent.woeid,
        }

        return new Promise((resolve, reject) => {
            this.twitterClient.get('trends/place', requestParams, (err, data, response) => {
                if (err) {
                    reject(err);
                }
                const sourceTrends = data[0].trends;
                const trends = sourceTrends
                    .filter((trend: any) => !!trend.tweet_volume)
                    .map((trend: any) => {
                        return {
                            q: trend.name,
                            tweetVolume: trend.tweet_volume
                        }
                    })
                resolve({
                    trends
                });
            })
        })
    }
}
