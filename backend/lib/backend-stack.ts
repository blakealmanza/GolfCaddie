import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';

export class BackendStack extends cdk.Stack {
	public readonly api: apigateway.RestApi;
	public readonly logShotIntegration: apigateway.LambdaIntegration;
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// DynamoDB: Courses, Rounds, Users tables
		const coursesTable = new dynamodb.Table(this, 'CoursesTable', {
			partitionKey: { name: 'courseId', type: dynamodb.AttributeType.STRING },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.RETAIN,
		});

		const roundsTable = new dynamodb.Table(this, 'RoundsTable', {
			partitionKey: { name: 'roundId', type: dynamodb.AttributeType.STRING },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.RETAIN,
		});

		const usersTable = new dynamodb.Table(this, 'UsersTable', {
			partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.RETAIN,
		});

		// S3: Course data bucket
		new s3.Bucket(this, 'CourseDataBucket', {
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

		// Helper to create Lambda and grant access
		const makeLambda = (
			name: string,
			codePath: string,
			env: Record<string, string>,
			grants: dynamodb.Table[] = [],
		) => {
			const fn = new NodejsFunction(this, name, {
				entry: `${codePath}/index.ts`,
				handler: 'handler',
				runtime: lambda.Runtime.NODEJS_20_X,
				environment: env,
				bundling: {
					externalModules: [],
					nodeModules: ['@aws-sdk/client-dynamodb', 'uuid'],
				},
			});
			grants.forEach((t) => t.grantReadWriteData(fn));
			return new apigateway.LambdaIntegration(fn);
		};

		// Lambda Functions
		const startRoundIntegration = makeLambda(
			'StartRoundFunction',
			'lambda/startRound',
			{ ROUNDS_TABLE: roundsTable.tableName },
			[roundsTable],
		);
		const updateHoleIntegration = makeLambda(
			'UpdateHoleFunction',
			'lambda/updateHole',
			{ ROUNDS_TABLE: roundsTable.tableName },
			[roundsTable],
		);
		const finishRoundIntegration = makeLambda(
			'FinishRoundFunction',
			'lambda/finishRound',
			{ ROUNDS_TABLE: roundsTable.tableName },
			[roundsTable],
		);
		const createCourseIntegration = makeLambda(
			'CreateCourseFunction',
			'lambda/createCourse',
			{ COURSES_TABLE: coursesTable.tableName },
			[coursesTable],
		);
		const listCoursesIntegration = makeLambda(
			'ListCoursesFunction',
			'lambda/listCourses',
			{ COURSES_TABLE: coursesTable.tableName },
			[coursesTable],
		);
		const getCourseIntegration = makeLambda(
			'GetCourseFunction',
			'lambda/getCourse',
			{ COURSES_TABLE: coursesTable.tableName },
			[coursesTable],
		);
		const saveUserIntegration = makeLambda(
			'SaveUserFunction',
			'lambda/saveUser',
			{ USERS_TABLE: usersTable.tableName },
			[usersTable],
		);
		const getUserStatsIntegration = makeLambda(
			'GetUserStatsFunction',
			'lambda/getUserStats',
			{
				USERS_TABLE: usersTable.tableName,
				ROUNDS_TABLE: roundsTable.tableName,
			},
			[usersTable, roundsTable],
		);

		// API Gateway
		this.api = new apigateway.RestApi(this, 'GolfCaddieAPI', {
			restApiName: 'Golf Caddie Service',
			deployOptions: {
				stageName: 'prod',
			},
			defaultCorsPreflightOptions: {
				allowOrigins: apigateway.Cors.ALL_ORIGINS,
				allowMethods: apigateway.Cors.ALL_METHODS,
				allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
			},
		});

		const apiRoot = this.api.root.addResource('api').addResource('v1');

		// Cognito: User Pool
		const userPool = new cognito.UserPool(this, 'GolfCaddieUserPool', {
			selfSignUpEnabled: true,
			signInAliases: { email: true },
			autoVerify: { email: true },
			accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
			removalPolicy: cdk.RemovalPolicy.RETAIN,
		});

		// Cognito: User Pool Client
		userPool.addClient('UserPoolClient', {
			authFlows: {
				userPassword: true,
				userSrp: true,
			},
			preventUserExistenceErrors: true,
		});

		// Cognito: API Gateway Authorizer
		const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
			this,
			'APIGatewayAuthorizer',
			{
				cognitoUserPools: [userPool],
			},
		);

		// API Resources
		const rounds = apiRoot.addResource('rounds');
		const roundById = rounds.addResource('{roundId}');
		const roundHoles = roundById.addResource('holes');

		rounds.addMethod('POST', startRoundIntegration, {
			authorizationType: apigateway.AuthorizationType.COGNITO,
			authorizer,
		});

		roundHoles.addMethod('PUT', updateHoleIntegration, {
			authorizationType: apigateway.AuthorizationType.COGNITO,
			authorizer,
		});

		roundById.addMethod('PATCH', finishRoundIntegration, {
			authorizationType: apigateway.AuthorizationType.COGNITO,
			authorizer,
		});

		const courses = apiRoot.addResource('courses');
		const courseById = courses.addResource('{id}');

		courses.addMethod('POST', createCourseIntegration, {
			authorizationType: apigateway.AuthorizationType.COGNITO,
			authorizer,
		});
		courses.addMethod('GET', listCoursesIntegration, {
			authorizationType: apigateway.AuthorizationType.COGNITO,
			authorizer,
		});
		courseById.addMethod('GET', getCourseIntegration, {
			authorizationType: apigateway.AuthorizationType.COGNITO,
			authorizer,
		});

		const users = apiRoot.addResource('users');
		const userStats = users.addResource('stats');

		users.addMethod('POST', saveUserIntegration, {
			authorizationType: apigateway.AuthorizationType.COGNITO,
			authorizer,
		});
		userStats.addMethod('GET', getUserStatsIntegration, {
			authorizationType: apigateway.AuthorizationType.COGNITO,
			authorizer,
		});
	}
}
