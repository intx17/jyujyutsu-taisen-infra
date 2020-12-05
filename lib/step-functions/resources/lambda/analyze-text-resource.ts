import path = require('path');
import config from 'config';
import * as cdk from "@aws-cdk/core";
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs'

export function getAnalyzeTextFunction (scope: cdk.Construct): lambda.Function {
    const role: iam.Role = new iam.Role(scope, 'AnalyzeTextFnRole', {
        roleName: `${config.get<string>('systemName')}-ANALYZE-TEXT-FN`,
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ],
        inlinePolicies: {
            'INLINE': new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: [
                            'comprehend:DetectEntities',
                            'comprehend:DetectSentiment'
                        ],
                        resources: [
                            '*'
                        ],
                    }),
                ]
            })
        }
    });

    const functionName =  `${config.get<string>('systemName')}-ANALYZE-TEXT`;
    const lambdaFunction = new lambda.Function(scope, 'AnalyzeTextFunction', {
        functionName,
        description: 'analyze text',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../../../dist/pack/src/analyze-text')),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        role,
        timeout: cdk.Duration.minutes(1),
        environment: {
            ACCOUNT_ID: cdk.Aws.ACCOUNT_ID,
            TZ: 'Asia/Tokyo',
        },
    });
    cdk.Tags.of(lambdaFunction).add('NAME', functionName);

     // Add Log
    new logs.CfnLogGroup(scope, 'AnalyzeTextFnLogGroup', {
        logGroupName: `/aws/lambda/${lambdaFunction.functionName}`,
        retentionInDays: 1
    });

    return lambdaFunction;
}