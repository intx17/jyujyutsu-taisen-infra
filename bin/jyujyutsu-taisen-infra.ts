#!/usr/bin/env node
import 'source-map-support/register';
import config from 'config';
import * as cdk from '@aws-cdk/core';
import { StepFunctionsStack } from '../lib/step-functions/step-functions-stack';

const app = new cdk.App();
(async() => {
    const systemNameUpperCase = config.get<string>('systemName').toUpperCase();
    const stepFunctionsStack = new StepFunctionsStack(app, `${systemNameUpperCase}-STEP-FUNCTIONS-STACK`)
})().catch(e => {
    console.error(e);
    process.exitCode = 1;
});