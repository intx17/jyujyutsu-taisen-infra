import * as cdk from '@aws-cdk/core';
import { getAnalyzeTextFunction } from './resources/lambda/analyze-text-resource';

export class StepFunctionsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const analyzeTextFunction = getAnalyzeTextFunction(this);
    }
}