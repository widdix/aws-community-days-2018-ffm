#!/bin/bash

set -e

TEXT="${1:-"demo9: Hello AWS Community Day!"}"
SLACK_MESSAGES="${2:-"100"}"

WEBHOOK_FUNCTION_NAME="$(aws cloudformation describe-stacks --stack-name ffm-demo9 --query '(Stacks[0].Outputs[?OutputKey==`WebhookFunctionName`])[0].OutputValue' --output text)"

for message in $(seq 1 "${SLACK_MESSAGES}"); do
  aws lambda invoke --function-name "${WEBHOOK_FUNCTION_NAME}" --invocation-type Event --payload "{\"text\": \"${TEXT} (${message})\"}" /dev/null
done
