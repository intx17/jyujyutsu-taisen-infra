import config from 'config';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as stepfunctions from '@aws-cdk/aws-stepfunctions';
import * as lambda from '@aws-cdk/aws-lambda';

// export function getAnalyzeResource(scope: cdk.Construct): stepfunctions.StateMachine {
//     const alayzeStateMachine = new stepfunctions.StateMachine(scope, 'AnalyzeStateMachine', {
//         stateMachineName: `${config.get<string>('systemName')}-ANALYZE`,
//         definition: 
//     })
// }