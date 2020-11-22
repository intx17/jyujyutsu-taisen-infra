import * as cdk from '@aws-cdk/core';
import { getFindPositivesFunction } from './src/find-positives-resource';
import { getUpdatePositivesFunction } from './src/update-positives-resource';

export class LambdaStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        getFindPositivesFunction(this);
        getUpdatePositivesFunction(this);
    }
}