# demo3: Twitter like status updates - Status update creation time as an input (broken: missing updates)

Run `deploy.sh` to deploy the demo stack(s).

Open multiple terminals and run `test.sh` with different arguments, e.g.: `test.sh 1`, `test.sh 2`, ..., `test.sh 10` to simulate 10 concurrent users who post status updates.

10 concurrent users are enough to exceed the provisioned write capacity of the DynamoDB table. Some Lambda function invocations will therefore receive an error from DynamoDB an Lambda will retry them.
