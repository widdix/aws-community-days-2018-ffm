const crypto = require('crypto');
const request = require('request');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const config = require('./config.json');

const WEBHOOK_TABLE_NAME = process.env.DEPENDENCY1_ARN.split('/')[1];

const sha256 = (str) => {
  const hash = crypto.createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
};

const callWebhook = (url, body) => new Promise((resolve, reject) => {
  request({
    url,
    method: 'POST',
    body,
    json: true
  }, (err, res, body) => {
    if (err) {
      reject(err);
    } else {
      if (res.statusCode === 200) {
        if (body.ok === true) {
          resolve(body);
        } else {
          reject(new Error('Slack not ok'));
        }
      } else {
        reject(new Error('Slack not 200'));
      }
    }
  });
});

exports.handler = async (event) => {
  const id = sha256(event.text);
  try {
    await dynamodb.updateItem({
      TableName: WEBHOOK_TABLE_NAME,
      Key: {
        id: {S: id}
      },
      UpdateExpression: 'SET #text=:text, created_at=:now',
      ExpressionAttributeNames: { // text is a reserved word
        '#text': 'text'
      },
      ExpressionAttributeValues: {
        ':text': {S: event.text},
        ':now': {S: new Date().toISOString()} // the item is only written once, so the changing date doesn't matter
      },
      ConditionExpression: 'attribute_not_exists(id)'
    }).promise();
    await callWebhook(config.slack.webhookUrl, {text: event.text});
    return {};
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') { // already sent, skip event
      return {};
    } else {
      throw err;
    }
  }
};
