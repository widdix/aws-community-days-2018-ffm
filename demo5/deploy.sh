#!/bin/bash

set -ex

aws cloudformation package --template-file template.yml --s3-bucket "${CFN_PACKAGE_BUCKET}" --output-template-file package.yml
aws cloudformation deploy --template-file package.yml --stack-name ffm-demo5 --capabilities CAPABILITY_IAM
rm package.yml
