import path = require('path');
import config from 'config';
import * as cdk from "@aws-cdk/core";
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs'

export function getFindPositivesFunction (scope: cdk.Construct): lambda.Function {
    const role: iam.Role = new iam.Role(scope, 'FindPositivesFnRole', {
        roleName: `${config.get<string>('systemName')}-FIND-POSITIVES-FN`,
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
                            's3:ListBucket',
                        ],
                        resources: [
                            `${cdk.Fn.importValue(`${config.get<string>('systemName')}-S3Bucket-BucketArn`)}`
                        ],
                    }),
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: [
                            's3:GetObject',
                        ],
                        resources: [
                            `${cdk.Fn.importValue(`${config.get<string>('systemName')}-S3Bucket-BucketArn`)}/\*`
                        ],
                    }),
                ]
            })
        }
    })

    const functionName =  `${config.get<string>('systemName')}-FIND-POSITIVES`;
    const lambdaFunction = new lambda.Function(scope, 'FindPositivesFunction', {
        functionName,
        description: 'find positives',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../../dest/pack/src/find-positives')),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        role,
        timeout: cdk.Duration.seconds(10),
        environment: {
            ACCOUNT_ID: cdk.Aws.ACCOUNT_ID,
            TZ: 'Asia/Tokyo',
        },
    });
    cdk.Tags.of(lambdaFunction).add('NAME', functionName);

     // Add Log
    new logs.CfnLogGroup(scope, 'FindPositivesFnLogGroup', {
        logGroupName: `/aws/lambda/${lambdaFunction.functionName}`,
        retentionInDays: 1
    });

    return lambdaFunction;
}