#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";
import FargateStack from "../lib/stacks/FargateStack";


const app = new App();

const props = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.AWS_REGION ??
      process.env.CDK_DEPLOY_REGION ??
      process.env.CDK_DEFAULT_REGION ??
      "us-east-1"
  }
};

new FargateStack(app, "FargateStack", props);
