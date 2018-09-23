#!/bin/bash

set -e

USER_ID="${1:-"1"}"
STATUS_UPDATES="${2:-"100"}"

CREATE_FUNCTION_NAME="$(aws cloudformation describe-stacks --stack-name ffm-demo2 --query '(Stacks[0].Outputs[?OutputKey==`CreateFunctionName`])[0].OutputValue' --output text)"

for status in $(seq 1 "${STATUS_UPDATES}"); do  
  aws lambda invoke --function-name "${CREATE_FUNCTION_NAME}" --invocation-type Event --payload "{\"id\": \"${USER_ID}\", \"status\": \"my status update number ${status}\"}" /dev/null
done
