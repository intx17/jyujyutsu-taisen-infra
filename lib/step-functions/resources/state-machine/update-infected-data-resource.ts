import config from 'config';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as stepfunctions from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events'
import { Schedule } from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';

interface IDependencyResouce {
    fetchInfectedDataFunction: lambda.Function,
    updateInfectedDataItemFunction: lambda.Function,
}

export function getUpdateInfectedDataStateMachine(scope: cdk.Construct, dependencyResource: IDependencyResouce): stepfunctions.StateMachine {
     const role = new iam.Role(scope, 'UpdateInfectedDataRole', {
        roleName: `${config.get('systemName')}-UPDATE-INFECTED-DATA`,
        assumedBy: new iam.ServicePrincipal(`states.${cdk.Aws.REGION}.amazonaws.com`),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaRole'),
        ]
    });

    const fail = new stepfunctions.Fail(scope, 'UpdateInfectedDataFail', {
        comment: 'statemachine fail',
    });

    const success = new stepfunctions.Succeed(scope, 'UpdateInfectedDataSuccess', {
        comment: 'statemachine success',
    });

    const fetchInfectedDataTask = getFetchInfectedDataFunctionTask(scope, dependencyResource.fetchInfectedDataFunction, fail);
    const updateInfectedDataItemTask = getUpdateInfectedDataItemFunctionTask(scope, dependencyResource.updateInfectedDataItemFunction, fail);

    const updateInfectedDataStateMachine = new stepfunctions.StateMachine(scope, 'UpdateInfectedDataStateMachine', {
        stateMachineName: `${config.get<string>('systemName')}-UPDATE-INFECTED-DATA`,
        definition:
        fetchInfectedDataTask
            .next(updateInfectedDataItemTask)
            .next(success),
        role: role
    });
    cdk.Tags.of(updateInfectedDataStateMachine).add('NAME', 'UPDATE-INFECTED-DATA');

    // event bridge
    const rule = new events.Rule(scope, 'StartUpdateInfectedDataRule', {
        description: 'Start Update Infected Data',
        ruleName: `${config.get<string>('systemName')}-START-UPDATE-INFECTED-DATA`,
        schedule:  Schedule.cron({
            minute: '0',
        }),
    });
    rule.addTarget(new targets.SfnStateMachine(updateInfectedDataStateMachine));

    return updateInfectedDataStateMachine;
}

function getFetchInfectedDataFunctionTask(scope: cdk.Construct, fetchInfectedDataFunction: lambda.Function, fail: stepfunctions.Fail): stepfunctions.TaskStateBase {
    const task: stepfunctions.TaskStateBase = new tasks.LambdaInvoke(scope, 'FetchInfectedDataTask', {
        lambdaFunction: fetchInfectedDataFunction,
        comment: `invoke ${fetchInfectedDataFunction.functionName}`,
        inputPath: '$',
        resultPath: '$.fetchInfectedDataResult',
        outputPath: '$',
        payloadResponseOnly: true,
    });

    task.addCatch(fail, {
        errors: [stepfunctions.Errors.ALL],
        resultPath: '$.error-info'
    })

    return task;
}

function getUpdateInfectedDataItemFunctionTask(scope: cdk.Construct, updateInfectedDataItemFunction: lambda.Function, fail: stepfunctions.Fail): stepfunctions.TaskStateBase {
    const task: stepfunctions.TaskStateBase = new tasks.LambdaInvoke(scope, 'UpdateInfectedDataItemTask', {
        lambdaFunction: updateInfectedDataItemFunction,
        comment: `invoke ${updateInfectedDataItemFunction.functionName}`,
        inputPath: '$.fetchInfectedDataResult',
        resultPath: '$.updateInfectedDataItemResult',
        outputPath: '$',
        payloadResponseOnly: true,
    });

    task.addCatch(fail, {
        errors: [stepfunctions.Errors.ALL],
        resultPath: '$.error-info'
    })

    return task;
}