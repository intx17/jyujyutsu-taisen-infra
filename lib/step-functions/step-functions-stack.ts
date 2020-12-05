import * as cdk from '@aws-cdk/core';
import { getAnalyzeTextFunction } from './resources/lambda/analyze-text-resource';
import { getGetSearchResultFunction } from './resources/lambda/get-search-result-resource';
import { getGetTrendsFunction } from './resources/lambda/get-trends-resource';
import { getFetchInfectedDataFunction } from './resources/lambda/fetch-infected-data';
import { getUpdateInfectedDataItemFunction } from './resources/lambda/update-infected-data-item';
import { getAnalyzeStateMachine } from './resources/state-machine/analyze-resource';
import { getUpdateInfectedDataStateMachine } from './resources/state-machine/update-infected-data-resource';

export class StepFunctionsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const analyzeTextFunction = getAnalyzeTextFunction(this);
        const getSearchResultFunction = getGetSearchResultFunction(this);
        const getTrendsFunction = getGetTrendsFunction(this);

        getAnalyzeStateMachine(this, {
            analyzeTextFunction,
            getSearchResultFunction,
            getTrendsFunction,
        });

        const fetchInfectedDataFunction = getFetchInfectedDataFunction(this);
        const updateInfectedDataItemFunction = getUpdateInfectedDataItemFunction(this);

        getUpdateInfectedDataStateMachine(this, {
            fetchInfectedDataFunction,
            updateInfectedDataItemFunction
        });
    }
}