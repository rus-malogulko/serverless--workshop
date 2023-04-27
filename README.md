# Serverless workshop

This workshop includes three services: 
- main service (create instances, i.e. auctions), implementing CRUD, 
- auth service for integration with auth0, 
- notification service to send emails via AWS SES.

## Deployment

Before all you need to configure your AWS CLI

```aws configure```

and to install Serverless framework

```brew install serverless```

After that you able to deploy it as CloudFormation stack via

```sls deploy```

To deploy specific funciton

```sls deploy -f <funciton_name>```

To view logs of this function execution

```sls logs -f <function_name>```

To trigger function manually

```sls invoke -f <function_name>```

To remove stack completely

```sls delete```

## Create new service based on template

```sls create --name notification-service --template-url https://github.com/arielweinberger/sls-base```

For auth service used different template

```sls create --name notification-service --template-url https://github.com/arielweinberger/serverless-auth0-authorizer```
