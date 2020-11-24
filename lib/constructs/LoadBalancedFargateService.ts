import { Construct } from "@aws-cdk/core";

import {
  Cluster,
  ContainerImage,
  Secret,
} from "@aws-cdk/aws-ecs";
  
import {
  ApplicationLoadBalancedFargateService
} from "@aws-cdk/aws-ecs-patterns";
import { EnvironmentPlaceholders } from "@aws-cdk/cx-api";


export interface LoadBalancedFargateServiceProps {
  cluster: Cluster,
  dockerfileDirectory: string,
  cpu?: number,
  environment?: { [key: string]: string },
  secrets?: { [key: string]: Secret }
  desiredCount?: number,
  containerPort?: number,
  memoryLimitMiB?: number,
  publicLoadBalancer?: boolean,
}

export default class LoadBalancedFargateService extends Construct {
  public readonly loadBalancedFargateService: ApplicationLoadBalancedFargateService;
  constructor(scope: Construct, id: string, props: LoadBalancedFargateServiceProps) {
    super(scope, id);

    const { 
      cluster,
      dockerfileDirectory,
      cpu,
      secrets,
      environment,
      desiredCount,
      containerPort,
      memoryLimitMiB,
      publicLoadBalancer,
    } = props;

    this.loadBalancedFargateService = new ApplicationLoadBalancedFargateService(this, "LoadBalancedFargateService", {
      cluster: cluster,
      cpu: cpu ?? 256,
      desiredCount: desiredCount ?? 1,
      taskImageOptions: {
        image: ContainerImage.fromAsset(dockerfileDirectory),
        containerPort: containerPort ?? 8080,
        environment,
        secrets,
      },
      memoryLimitMiB: memoryLimitMiB ?? 512,
      publicLoadBalancer: publicLoadBalancer ?? true,
    });

  }
}
