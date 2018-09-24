# demo1: Something is wrong here

Run `deploy.sh` to deploy the demo stack(s).

> The demo has to run for a couple of hours to produce enough events.

Each 5 minutes, a Lambda function is invoked that fails in 10% of cases to demonstrate retry behavior.
