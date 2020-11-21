import config from 'config';
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketAccessControl } from '@aws-cdk/aws-s3';

export class S3Stack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucketName: string = `${config.get<string>('systemName')}-bucket`;
        const bucket = new s3.Bucket(this, 'S3Bucket', {
            bucketName: `${config.get<string>('systemName')}-bucket`,
            accessControl: BucketAccessControl.PRIVATE
        });

        cdk.Tags.of(bucket).add('NAME', bucketName);

        new cdk.CfnOutput(this, 'S3Bucket.BucketArn', {
            value: bucket.bucketArn,
            description: 'bucket arn',
            exportName: `${config.get<string>('systemName')}-S3Bucket-BucketArn`
        });
    }
}
