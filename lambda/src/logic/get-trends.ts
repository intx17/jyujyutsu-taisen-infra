import Twitter from 'twitter';
import secrets from '../secrets.json';

interface GetTrendsResult {
    trends: Trend[]
}

interface Trend {
    name: string
    // tweetVolume: number
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

    async getTrends(): Promise<GetTrendsResult> {
        const requestParams = {
            id: 1,
        }

        return new Promise((resolve, reject) => {
            this.twitterClient.get('trends/place', requestParams, (err, data, response) => {
                if (err) {
                    reject(err);
                }
                const sourceTrends = data[0].trends;
                const trends = sourceTrends.map((trend: any) => {
                    return {
                        name: trend.name,
                        // tweetVolume: trend.tweet_volume ?? 0
                    }
                });
                resolve({
                    trends
                });
            })
        })
    }
}
