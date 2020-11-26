import Twitter from 'twitter';
import secrets from '../secrets.json';

interface ParsedGetTimelineTextEvent {
    screenName: string
}

export class GetTimelineTextLogic {
    private twitterClient: Twitter;

    constructor () {
        this.twitterClient = new Twitter({
            consumer_key: secrets.consumerKey,
            consumer_secret: secrets.consumerSecret,
            access_token_key: secrets.accessTokenKey,
            access_token_secret: secrets.accessTokenSecret
        })
    }

     parseGetTimelineTextEvent (event: any): ParsedGetTimelineTextEvent {
        const screenName: string | undefined = event?.screenName
        if (!screenName) {
            throw new Error('screenName does not exists or is blank.');
        }

        return {
            screenName
        }
    }

    async getTimelineText(parsedEvent: ParsedGetTimelineTextEvent): Promise<string> {
        const requestParams = {
            screen_name: parsedEvent.screenName,
        }

        return new Promise((resolve, reject) => {
            this.twitterClient.get('statuses/user_timeline', requestParams, (err, tweets, response) => {
                if (err) {
                    reject(err);
                }
                const text = tweets.reduce((combined: string, tweet: any) => {
                    combined += tweet.text;
                    return combined;
                }, '');
                resolve(text);
            })
        })
    }
}
