import config from 'config';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as stepfunctions from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as lambda from '@aws-cdk/aws-lambda';

interface IDependencyResouce {
    analyzeTextFunction: lambda.Function,
    getSearchResultTextFunction: lambda.Function,
    getTrendsFunction: lambda.Function,
}

export function getAnalyzeStepFunction(scope: cdk.Construct, dependencyResource: IDependencyResouce): stepfunctions.StateMachine {
     const role = new iam.Role(scope, 'AddPharmacyRole', {
        roleName: `${config.get('systemName')}-ANALYZE`,
        assumedBy: new iam.ServicePrincipal(`states.${cdk.Aws.REGION}.amazonaws.com`),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaRole'),
        ]
    });

    const getTrendsTask = getGetTrendsFunctionTask(scope, dependencyResource.getTrendsFunction);
    const searchAndAnalyzeMap = getSearchAndAnalyzeMap(scope, dependencyResource.getSearchResultTextFunction, dependencyResource.analyzeTextFunction);

    const analyzeStateMachine = new stepfunctions.StateMachine(scope, 'AnalyzeStateMachine', {
        stateMachineName: `${config.get<string>('systemName')}-ANALYZE`,
        definition:
            getTrendsTask
            .next(searchAndAnalyzeMap),
        role: role
    });
    cdk.Tags.of(analyzeStateMachine).add('NAME', analyzeStateMachine.stateMachineName);
    return analyzeStateMachine;
}

function getGetTrendsFunctionTask(scope: cdk.Construct, getTrendsFunction: lambda.Function): stepfunctions.TaskStateBase {
    const task: stepfunctions.TaskStateBase = new tasks.LambdaInvoke(scope, 'GetTrendsTask', {
        lambdaFunction: getTrendsFunction,
        comment: `invoke ${getTrendsFunction.functionName}`,
        inputPath: '$',
        resultPath: '$.getTrendsTaskResult',
        outputPath: '$'
    });

    return task;
}

function getSearchAndAnalyzeMap(scope: cdk.Construct, getSearchResultTextFunction: lambda.Function, analyzeTextFunction: lambda.Function): stepfunctions.Map {
    const searchResultTask: stepfunctions.TaskStateBase = new tasks.LambdaInvoke(scope, 'GetSearchResultText', {
        lambdaFunction: getSearchResultTextFunction,
        comment: `invoke ${getSearchResultTextFunction.functionName}`,
        inputPath: '$',
        resultPath: '$.getSearchResultTextResult',
        outputPath: '$'
    });

    const analyzeTextTask: stepfunctions.TaskStateBase = new tasks.LambdaInvoke(scope, 'AnalyzeTextTask', {
        lambdaFunction: analyzeTextFunction,
        comment: `invoke ${analyzeTextFunction.functionName}`,
        inputPath: '$',
        resultPath: '$.getSearchResultTextResult',
        outputPath: '$'
    });

    const map: stepfunctions.Map = new stepfunctions.Map(scope, 'SearchAndAnalyzeMap', {
        inputPath: '$.getTrendsTaskResult',
        itemsPath: '$.trends',
    }).iterator(
        searchResultTask
        .next(analyzeTextTask)
    )
    return map;
}