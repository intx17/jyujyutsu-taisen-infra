import { Comprehend } from 'aws-sdk';

interface ParsedAnalyzeSentimentEvent {
    text: string
}

interface AnalyzeSentimentResult {
    sentiment: string,
    sentimentScore: {
        positive: number,
        negative: number,
        neutral: number,
        mixed: number
    }
}

export class AnalyzeTextLogic {
    parseAnalyzeSentimentEvent (event: any): ParsedAnalyzeSentimentEvent {
        const text: string | undefined = event?.text
        if (!text) {
            throw new Error(`event is invalid. ${JSON.stringify(event)}`);
        }

        return {
            text
        }
    }

    async analyzeSentiment(parsedEvent: ParsedAnalyzeSentimentEvent): Promise<AnalyzeSentimentResult> {
        const comprehendClient = new Comprehend();
        const request: Comprehend.DetectSentimentRequest = {
            LanguageCode: 'ja',
            Text: parsedEvent.text
        }
        const result = await comprehendClient.detectSentiment(request).promise()
        .then((data) => {
            return {
                sentiment: data.Sentiment ?? '',
                sentimentScore: {
                    positive: data.SentimentScore?.Positive ?? 0,
                    negative: data.SentimentScore?.Negative ?? 0,
                    neutral: data.SentimentScore?.Neutral ?? 0,
                    mixed: data.SentimentScore?.Mixed ?? 0
                }
            }
        })
        .catch(e => { throw new Error(e.message) });
        return result;
    }
}
