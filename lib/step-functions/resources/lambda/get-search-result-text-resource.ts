import path = require('path');
import config from 'config';
import * as cdk from "@aws-cdk/core";
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs'

export function getGetSearchResultTextFunction (scope: cdk.Construct): lambda.Function {
    const role: iam.Role = new iam.Role(scope, 'GetSearchResultTextFnRole', {
        roleName: `${config.get<string>('systemName')}-GET-SEARCH-RESULT-TEXT-FN`,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ]
    });

    const functionName =  `${config.get<string>('systemName')}-GET-SEARCH-RESULT-TEXT`;
    const lambdaFunction = new lambda.Function(scope, 'GetSearchResultTextFunction', {
        functionName,
        description: 'analyze text',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../../../dist/pack/src/get-search-result-text')),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        role,
        timeout: cdk.Duration.seconds(30),
        environment: {
            ACCOUNT_ID: cdk.Aws.ACCOUNT_ID,
            TZ: 'Asia/Tokyo',
        },
    });
    cdk.Tags.of(lambdaFunction).add('NAME', functionName);

     // Add Log
    new logs.CfnLogGroup(scope, 'GetSearchResultTextFnLogGroup', {
        logGroupName: `/aws/lambda/${lambdaFunction.functionName}`,
        retentionInDays: 1
    });

    return lambdaFunction;
}