export const lambdaHandler = async () => {
    console.log("Lambda function invoked!!!");
    return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello world',
    }),
  }
}