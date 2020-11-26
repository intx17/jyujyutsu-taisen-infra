import { info } from 'console';
import Twitter from 'twitter';
import secrets from '../secrets.json';

interface TrendInfo {
    name: string
    tweetVolume: number
}

export class GetTrendInfoLogic {
    private twitterClient: Twitter;

    constructor () {
        this.twitterClient = new Twitter({
            consumer_key: secrets.consumerKey,
            consumer_secret: secrets.consumerSecret,
            access_token_key: secrets.accessTokenKey,
            access_token_secret: secrets.accessTokenSecret
        })
    }

    async getTrendInfo(): Promise<TrendInfo[]> {
        const requestParams = {
            id: 1,
        }

        return new Promise((resolve, reject) => {
            this.twitterClient.get('trends/place', requestParams, (err, data, response) => {
                if (err) {
                    reject(err);
                }
                const trends = data[0].trends;
                const infos = trends.map((trend: any) => {
                    return {
                        name: trend.name,
                        tweetVolume: trend.tweet_volume ?? 0
                    }
                });
                resolve(infos);
            })
        })
    }
}
