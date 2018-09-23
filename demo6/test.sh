#!/bin/bash

set -e

USER_ID="${1:-"1"}"
STATUS_UPDATES="${2:-"100"}"

DATA_STREAM_NAME="$(aws cloudformation describe-stacks --stack-name ffm-demo5 --query '(Stacks[0].Outputs[?OutputKey==`DataStreamName`])[0].OutputValue' --output text)"

LAST_SEQUENCE_NUMBER="$(aws kinesis put-record --stream-name "${DATA_STREAM_NAME}" --partition-key "6:${USER_ID}" --data "{\"status\": \"my status update number 1\"}" --query "SequenceNumber" --output text)"

for status in $(seq 2 "${STATUS_UPDATES}"); do  
  LAST_SEQUENCE_NUMBER="$(aws kinesis put-record --stream-name "${DATA_STREAM_NAME}" --partition-key "6:${USER_ID}" --sequence-number-for-ordering "${LAST_SEQUENCE_NUMBER}" --data "{\"status\": \"my status update number ${status}\"}" --query "SequenceNumber" --output text)"
done
