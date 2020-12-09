import path = require('path');
import config from 'config';
import * as cdk from "@aws-cdk/core";
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs'

export function getBatchWriteBattleFunction (scope: cdk.Construct): lambda.Function {
    const role: iam.Role = new iam.Role(scope, 'BatchWriteBattleFnRole', {
        roleName: `${config.get<string>('systemName')}-BATCH-WRITE-BATTLE-FN`,
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
                            'dynamodb:BatchWriteItem',
                            'dynamodb:Scan',
                            'dynamodb:PutItem',
                        ],
                        resources: [
                            `arn:aws:dynamodb:ap-northeast-1:${cdk.Aws.ACCOUNT_ID}:table/${config.get<string>('dynamodb.battleTable.tableName')}`,
                            `arn:aws:dynamodb:ap-northeast-1:${cdk.Aws.ACCOUNT_ID}:table/${config.get<string>('dynamodb.curseTable.tableName')}`,
                            `arn:aws:dynamodb:ap-northeast-1:${cdk.Aws.ACCOUNT_ID}:table/${config.get<string>('dynamodb.playerTable.tableName')}`,
                        ],
                    }),
                ]
            })
        }
    });

    const functionName =  `${config.get<string>('systemName')}-BATCH-WRITE-BATTLE`;
    const lambdaFunction = new lambda.Function(scope, 'BatchWriteBattleFunction', {
        functionName,
        description: 'Update infected data',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../../../dist/pack/src/batch-write-battle')),
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
    new logs.CfnLogGroup(scope, 'BatchWriteBattleFnLogGroup', {
        logGroupName: `/aws/lambda/${lambdaFunction.functionName}`,
        retentionInDays: 1
    });

    return lambdaFunction;
}