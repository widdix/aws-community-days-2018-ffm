#!/bin/bash

set -e

TEXT="${1:-"Hello AWS Community Day!"}"

WEBHOOK_FUNCTION_NAME="$(aws cloudformation describe-stacks --stack-name ffm-demo8 --query '(Stacks[0].Outputs[?OutputKey==`WebhookFunctionName`])[0].OutputValue' --output text)"

aws lambda invoke --function-name "${WEBHOOK_FUNCTION_NAME}" --invocation-type Event --payload "{\"text\": \"${TEXT}\"}" /dev/null
