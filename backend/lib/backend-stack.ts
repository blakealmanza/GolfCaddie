/** biome-ignore-all lint/complexity/noUselessConstructor: <Needs constructor to work> */
import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here

		// example resource
		// const queue = new sqs.Queue(this, 'BackendQueue', {
		//   visibilityTimeout: cdk.Duration.seconds(300)
		// });
	}
}
