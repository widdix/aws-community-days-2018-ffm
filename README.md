# Your Lambda function might execute twice. Be prepared!

* `demo1`: Something is wrong here
* `demo2`: Twitter like status updates (broken: mixed and missing updates)
* `demo3`: Twitter like status updates - Status update creation time as an input (broken: missing updates)
* `demo4`: Twitter like status updates - Previous status update as an input (broken: missing updates)
* `demo5`: Twitter like status updates - Use Kinesis Data Stream in between
* `demo6`: Twitter like status updates - Use Kinesis Data Stream in between with sequence numbers (safe)
* `demo7`: TODO
* `demo8`: at-most-once Slack message
* `demo9`: at-least-once Slack message

## Prepare demos

```
cp env.example.sh env.sh
# edit as needed
source env.sh
```

Each demo has a `deploy.sh` script that you can use to create/update the demo stack.
