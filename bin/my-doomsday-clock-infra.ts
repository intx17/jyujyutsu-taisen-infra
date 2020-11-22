#!/usr/bin/env node
import 'source-map-support/register';
import config from 'config';
import * as cdk from '@aws-cdk/core';
import { S3Stack } from '../lib/s3/s3-statck';
import { LambdaStack } from '../lib/lambda/lambda-stack';
import { EventsStack } from '../lib/events/events-stack';

const app = new cdk.App();
(async() => {
    const systemNameUpperCase = config.get<string>('systemName').toUpperCase();
    const s3Stack = new S3Stack(app, `${systemNameUpperCase}-S3-STACK`)
    const lambdaStack = new LambdaStack(app, `${systemNameUpperCase}-LAMBDA-STACK`)
    const eventsStack = new EventsStack(app, `${systemNameUpperCase}-EVENTS-STACK`)
        .addDependency(lambdaStack);
})().catch(e => {
    console.error(e);
    process.exitCode = 1;
});