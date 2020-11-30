import config from 'config';
import cdk = require('@aws-cdk/core');
import cognito = require('@aws-cdk/aws-cognito');

export class CognitoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cognito.UserPool(this, 'UserPool', {
        userPoolName: `${config.get<string>('systemName')}-players`
    });
  }
}