#!/usr/bin/env node
import 'source-map-support/register';
import config from 'config';
import * as cdk from '@aws-cdk/core';
import { S3Stack } from '../lib/s3/s3-statck';
import { ApiGatewayStack} from '../lib/api-gateway/api-gateway-stack';
import { StepFunctionsStack } from '../lib/step-functions/step-functions-stack';

const app = new cdk.App();
(async() => {
    const systemNameUpperCase = config.get<string>('systemName').toUpperCase();
    const s3Stack = new S3Stack(app, `${systemNameUpperCase}-S3-STACK`)
    const stepFunctionsStack = new StepFunctionsStack(app, `${systemNameUpperCase}-STEP-FUNCTIONS-STACK`)
    const apiGatewayStack = new ApiGatewayStack(app, `${systemNameUpperCase}-API-GATEWAY-STACK`);
    apiGatewayStack.addDependency(s3Stack);
})().catch(e => {
    console.error(e);
    process.exitCode = 1;
});
