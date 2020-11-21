#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MyDoomsdayClockInfraStack } from '../lib/my-doomsday-clock-infra-stack';

const app = new cdk.App();
new MyDoomsdayClockInfraStack(app, 'MyDoomsdayClockInfraStack');
