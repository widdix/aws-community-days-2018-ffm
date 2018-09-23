#!/bin/bash

set -e

USER_ID="${1:-"1"}"
STATUS_UPDATES="${2:-"99"}"

CREATE_FUNCTION_NAME="$(aws cloudformation describe-stacks --stack-name ffm-demo4 --query '(Stacks[0].Outputs[?OutputKey==`CreateFunctionName`])[0].OutputValue' --output text)"

aws lambda invoke --function-name "${CREATE_FUNCTION_NAME}" --invocation-type Event --payload "{\"id\": \"${USER_ID}\", \"status\": \"my initial status update\"}" /dev/null

for status in $(seq 1 "${STATUS_UPDATES}"); do  
  aws lambda invoke --function-name "${CREATE_FUNCTION_NAME}" --invocation-type Event --payload "{\"id\": \"${USER_ID}\", \"previous_no\": ${status}, \"status\": \"my status update number ${status}\"}" /dev/null
done
