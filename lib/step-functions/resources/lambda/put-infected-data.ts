import path = require('path');
import config from 'config';
import * as cdk from "@aws-cdk/core";
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs'

export function getPutInfectedDataFunction (scope: cdk.Construct): lambda.Function {
    const role: iam.Role = new iam.Role(scope, 'PutInfectedDataFnRole', {
        roleName: `${config.get<string>('systemName')}-PUT-INFECTED-DATA-FN`,
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
                            'dynamodb:ListTables',
                            'dynamodb:PutItem',
                        ],
                        resources: [
                            `arn:aws:dynamodb:ap-northeast-1:${cdk.Aws.ACCOUNT_ID}:table/${config.get<string>('dynamodb.infectedDataTable.tableName')}`
                        ],
                    }),
                ]
            })
        }
    });

    const functionName =  `${config.get<string>('systemName')}-PUT-INFECTED-DATA`;
    const lambdaFunction = new lambda.Function(scope, 'PutInfectedDataFunction', {
        functionName,
        description: 'Put infected data',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../../../dest/pack/src/put-infected-data')),
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
    new logs.CfnLogGroup(scope, 'PutInfectedDataFnLogGroup', {
        logGroupName: `/aws/lambda/${lambdaFunction.functionName}`,
        retentionInDays: 1
    });

    return lambdaFunction;
}