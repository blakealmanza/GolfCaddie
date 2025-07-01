import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';

export class BackendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// DynamoDB: Shots table
		const shotsTable = new dynamodb.Table(this, 'ShotsTable', {
			partitionKey: { name: 'roundId', type: dynamodb.AttributeType.STRING },
			sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.RETAIN,
		});

		// S3: Course data bucket
		const courseBucket = new s3.Bucket(this, 'CourseDataBucket', {
			bucketName: 'golf-caddie-courses',
			blockPublicAccess: {
				blockPublicAcls: false,
				blockPublicPolicy: false,
				ignorePublicAcls: false,
				restrictPublicBuckets: false,
			},
			publicReadAccess: true,
			removalPolicy: cdk.RemovalPolicy.RETAIN,
			autoDeleteObjects: false,
		});

		// Lambda: logShot function
		const logShotFn = new lambda.Function(this, 'LogShotFunction', {
			runtime: lambda.Runtime.NODEJS_20_X,
			handler: 'index.handler',
			code: lambda.Code.fromAsset('lambda/logShot'),
			environment: {
				SHOTS_TABLE: shotsTable.tableName,
			},
		});

		// Grant Lambda permission to write to DynamoDB
		shotsTable.grantWriteData(logShotFn);

		// API Gateway
		const api = new apigateway.RestApi(this, 'GolfCaddieAPI', {
			restApiName: 'Golf Caddie Service',
			deployOptions: {
				stageName: 'prod',
			},
		});

		const logShotResource = api.root.addResource('log-shot');
		logShotResource.addMethod(
			'POST',
			new apigateway.LambdaIntegration(logShotFn),
		);
	}
}
