#!/bin/bash

set -e

USER_ID="${1:-"1"}"
STATUS_UPDATES="${2:-"100"}"

DATA_STREAM_NAME="$(aws cloudformation describe-stacks --stack-name ffm-demo5 --query '(Stacks[0].Outputs[?OutputKey==`DataStreamName`])[0].OutputValue' --output text)"

for status in $(seq 1 "${STATUS_UPDATES}"); do
  aws kinesis put-record --stream-name "${DATA_STREAM_NAME}" --partition-key "${USER_ID}" --data "{\"status\": \"my status update number ${status}\"}"
done
