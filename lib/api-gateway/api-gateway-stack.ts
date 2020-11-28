import config from 'config';
import * as cdk from '@aws-cdk/core';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import { MethodLoggingLevel } from '@aws-cdk/aws-apigateway';
import { getFindPositivesFunction } from './resources/find-positives-resource';
import { getUpdatePositivesFunction } from './resources/update-positives-resource';

export class ApiGatewayStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const findPositivesFunction = getFindPositivesFunction(this);
        const updatePositivesFunction = getUpdatePositivesFunction(this);

        const restApiName = `${config.get<string>('systemName')}-REST-API`;
        const restApi = new apiGateway.RestApi(this, `RestApi`, {
            restApiName,
            deployOptions: {
                metricsEnabled: true,
                loggingLevel: MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
        });
        cdk.Tags.of(restApi).add('NAME', restApiName);
        const v1 = restApi.root.addResource('v1');
        const positives = v1.addResource('positives');
        const findPositivesIntegration = new apiGateway.LambdaIntegration(findPositivesFunction, {});
        const updatePositivesIntegration = new apiGateway.LambdaIntegration(updatePositivesFunction, {});
        positives.addMethod('GET', findPositivesIntegration);
        positives.addMethod('POST', updatePositivesIntegration);
    }
}