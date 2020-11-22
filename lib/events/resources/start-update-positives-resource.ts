import config from 'config'
import * as cdk from '@aws-cdk/core';
import * as events from '@aws-cdk/aws-events'
import * as lambda from '@aws-cdk/aws-lambda'

export function getStartUpdatePositivesResource (scope: cdk.Construct): events.CfnRule | null {
    const functionArn = `arn:aws:lambda:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:function:${config.get<string>('systemName')}-UPDATE-POSITIVES`;
    const rule = new events.CfnRule(scope, 'StartUpdatePositiveRule', {
        description: 'Start Updating Positive',
        name: `${config.get<string>('systemName')}-START-UPDATE-POSITIVE`,
        scheduleExpression: 'cron(0 15 * * ? *)',
        targets: [{
                id: 'StartRDSFunction',
                arn: functionArn,
            },
        ]
    });

    new lambda.CfnPermission(scope, 'UpdatePositivesPermission', {
        action: 'lambda:InvokeFunction',
        principal: 'events.amazonaws.com',
        functionName: functionArn,
        sourceArn: rule.attrArn,
    })

    return rule;
}