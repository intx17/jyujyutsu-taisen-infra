import * as cdk from '@aws-cdk/core';
import { getStartUpdatePositivesResource } from './resources/start-update-positives-resource';

export class EventsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        getStartUpdatePositivesResource(this);
    }
}