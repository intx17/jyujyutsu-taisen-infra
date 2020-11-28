import path = require('path');
import config from 'config';
import * as cdk from "@aws-cdk/core";
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs'

export function getGetTrendsFunction (scope: cdk.Construct): lambda.Function {
    const role: iam.Role = new iam.Role(scope, 'GetTrendsFnRole', {
        roleName: `${config.get<string>('systemName')}-GET-TRENDS-FN`,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ]
    });

    const functionName =  `${config.get<string>('systemName')}-GET-TRENDS`;
    const lambdaFunction = new lambda.Function(scope, 'GetTrendsFunction', {
        functionName,
        description: 'analyze text',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../../../dest/pack/src/get-trends')),
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
    new logs.CfnLogGroup(scope, 'GetTrendsFnLogGroup', {
        logGroupName: `/aws/lambda/${lambdaFunction.functionName}`,
        retentionInDays: 1
    });

    return lambdaFunction;
}