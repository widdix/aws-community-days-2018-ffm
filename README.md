# Your Lambda function might execute twice. Be prepared!

## Demos

* demo1: Cron triggert Lambda function that fails for 25% of the times and outputs system time
* demo2: Cron triggert Lambda function that fails for 25% of the times and outputs system time + event time

## Prepare demos

```
cp env.example.sh env.sh
# edit as needed
source env.sh
```

Each demo has a `deploy.sh` script that you can use to create/update the demo stack.
