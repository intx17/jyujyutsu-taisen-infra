import * as cdk from '@aws-cdk/core';
import { getAnalyzeTextFunction } from './resources/lambda/analyze-text-resource';
import { getGetSearchResultTextFunction } from './resources/lambda/get-search-result-text-resource';
import { getGetTrendsFunction } from './resources/lambda/get-trends-resource';
import { getAnalyzeStepFunction } from './resources/step-function/analyze-resource';

export class StepFunctionsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const analyzeTextFunction = getAnalyzeTextFunction(this);
        const getSearchResultTextFunction = getGetSearchResultTextFunction(this);
        const getTrendsFunction = getGetTrendsFunction(this);
        getAnalyzeStepFunction(this, {
            analyzeTextFunction,
            getSearchResultTextFunction,
            getTrendsFunction,
        });
    }
}