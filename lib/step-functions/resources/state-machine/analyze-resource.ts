import config from 'config';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as stepfunctions from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events'
import { Schedule } from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import { JapaneseWoeid } from '../../../../lambda/src/domain/japanese-woeid';

interface IDependencyResouce {
    analyzeTextFunction: lambda.Function,
    getSearchResultFunction: lambda.Function,
    getTrendsFunction: lambda.Function,
}

export function getAnalyzeStateMachine(scope: cdk.Construct, dependencyResource: IDependencyResouce): stepfunctions.StateMachine {
     const role = new iam.Role(scope, 'AnalyzeRole', {
        roleName: `${config.get('systemName')}-ANALYZE`,
        assumedBy: new iam.ServicePrincipal(`states.${cdk.Aws.REGION}.amazonaws.com`),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaRole'),
        ]
    });

    const fail = new stepfunctions.Fail(scope, 'AnalyzeFail', {
        comment: 'statemachine fail',
    });

    const success = new stepfunctions.Succeed(scope, 'AnalyzeSuccess', {
        comment: 'statemachine success',
    });

    const getTrendsTask = getGetTrendsFunctionTask(scope, dependencyResource.getTrendsFunction, fail);
    const searchAndAnalyzeMap = getSearchAndAnalyzeMap(scope, dependencyResource.getSearchResultFunction, dependencyResource.analyzeTextFunction, fail);

    const analyzeStateMachine = new stepfunctions.StateMachine(scope, 'AnalyzeStateMachine', {
        stateMachineName: `${config.get<string>('systemName')}-ANALYZE`,
        definition:
            getTrendsTask
            .next(searchAndAnalyzeMap)
            .next(success),
        role: role
    });
    cdk.Tags.of(analyzeStateMachine).add('NAME', 'ANALYZE');

    // event bridge
    const rule = new events.Rule(scope, 'StartAnalyzeRule', {
        description: 'Start Analyze',
        ruleName: `${config.get<string>('systemName')}-START-ANALYZE`,
        schedule:  Schedule.cron({
            minute: '30',
            hour: '14',
        }),
    });
    rule.addTarget(new targets.SfnStateMachine(analyzeStateMachine, {
        input: events.RuleTargetInput.fromObject({
            woeid: JapaneseWoeid.Japan
        })
    }));

    return analyzeStateMachine;
}

function getGetTrendsFunctionTask(scope: cdk.Construct, getTrendsFunction: lambda.Function, fail: stepfunctions.Fail): stepfunctions.TaskStateBase {
    const task: stepfunctions.TaskStateBase = new tasks.LambdaInvoke(scope, 'GetTrendsTask', {
        lambdaFunction: getTrendsFunction,
        comment: `invoke ${getTrendsFunction.functionName}`,
        inputPath: '$',
        resultPath: '$.getTrendsTaskResult',
        outputPath: '$',
        payloadResponseOnly: true,
    });

    task.addCatch(fail, {
        errors: [stepfunctions.Errors.ALL],
        resultPath: '$.error-info'
    })

    return task;
}

function getSearchAndAnalyzeMap(scope: cdk.Construct, getSearchResultFunction: lambda.Function, analyzeTextFunction: lambda.Function, fail: stepfunctions.Fail): stepfunctions.Map {
    const getSearchResultTask: stepfunctions.TaskStateBase = new tasks.LambdaInvoke(scope, 'GetSearchResult', {
        lambdaFunction: getSearchResultFunction,
        comment: `invoke ${getSearchResultFunction.functionName}`,
        inputPath: '$',
        resultPath: '$.getSearchResultResult',
        outputPath: '$',
        payloadResponseOnly: true,
    });

    const analyzeTextTask: stepfunctions.TaskStateBase = new tasks.LambdaInvoke(scope, 'AnalyzeTextTask', {
        lambdaFunction: analyzeTextFunction,
        comment: `invoke ${analyzeTextFunction.functionName}`,
        inputPath: '$.getSearchResultResult',
        resultPath: '$.analyzeTextResult',
        outputPath: '$',
        payloadResponseOnly: true,
    });

    const map: stepfunctions.Map = new stepfunctions.Map(scope, 'SearchAndAnalyzeMap', {
        inputPath: '$.getTrendsTaskResult',
        itemsPath: '$.trends',
    }).iterator(
        getSearchResultTask
        .next(analyzeTextTask)
    )

    map.addCatch(fail, {
        errors: [stepfunctions.Errors.ALL],
        resultPath: '$.error-info'
    })

    return map;
}