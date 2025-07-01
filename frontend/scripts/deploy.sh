#!/bin/bash

set -e

# Load environment variables from .env.local in the parent directory
ENV_FILE="$(dirname "$0")/../.env.local"
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "$ENV_FILE not found. Environment variables will not be loaded."
fi


if [ -z "$AWS_S3_BUCKET" ] || [ -z "$AWS_CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "Missing environment variables. Please set AWS_S3_BUCKET and AWS_CLOUDFRONT_DISTRIBUTION_ID."
  exit 1
fi

echo "Building frontend..."
npm run build

echo "Uploading to S3: $AWS_S3_BUCKET"
aws s3 sync dist s3://$AWS_S3_BUCKET --delete

echo "Invalidating CloudFront cache for distribution: $AWS_CLOUDFRONT_DISTRIBUTION_ID"
aws cloudfront create-invalidation --distribution-id "$AWS_CLOUDFRONT_DISTRIBUTION_ID" --paths '/*'

echo "Deployment complete."
