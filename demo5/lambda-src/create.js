const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const STATUS_TABLE_NAME = process.env.DEPENDENCY1_ARN.split('/')[1];

const processRecord = async (record) => { // idempotent
  const payload = JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString('utf8'));
  try {
    await dynamodb.updateItem({
      TableName: STATUS_TABLE_NAME,
      Key: {
        user_id: {S: record.kinesis.partitionKey},
        status_sequence_number: {S: record.kinesis.sequenceNumber}
      },
      UpdateExpression: 'SET #status=:status, created_at=:now',
      ExpressionAttributeNames: { // status is a reserved word
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': {S: payload.status},
        ':now': {S: new Date().toISOString()} // the item is only written once, so the changing date doesn't matter
      },
      ConditionExpression: 'attribute_not_exists(user_id) AND attribute_not_exists(status_sequence_number)'
    }).promise();
    return {};
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') { // already created, skip record
      return {};
    } else {
      throw err;
    }
  }
};

exports.handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
  return {};
};
