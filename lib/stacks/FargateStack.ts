import { Construct, Stack, StackProps, CfnOutput } from "@aws-cdk/core";
import { Vpc, Port } from "@aws-cdk/aws-ec2";
import { Cluster, Secret } from "@aws-cdk/aws-ecs";

import LoadBalancedFargateService from "../constructs/LoadBalancedFargateService";
import FargateMonitoringAlarms from "../constructs/FargateMonitoringAlarms";
import AuroraDatabase from "../constructs/AuroraDatabase";
import AuroraMonitoringAlarms from "../constructs/AuroraMonitoringAlarms";

export default class FargateStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "Vpc", { maxAzs: 2 });

    const auroraDatabase = new AuroraDatabase(this, "AuroraDatabase", {
      vpc,
    });

    const auroraSecret = (name: string) => Secret.fromSecretsManager(
      auroraDatabase.cluster.secret!,
      name
    );

    const {
       cpuAlarm: auroraCpuAlarm
    } = new AuroraMonitoringAlarms(this, "AuroraAlarms", {
      cluster: auroraDatabase.cluster,
      cpuAlarmProps: {
        evaluationPeriods: 1,
        threshold: 5,
      }
    });

    const fargateCluster = new Cluster(this, "FargateCluster", {
      vpc
    });

    const { loadBalancedFargateService } = new LoadBalancedFargateService(this, "FargateService", {
      dockerfileDirectory: "./src/ecs/expressApi",
      cluster: fargateCluster,
      secrets: {
        DB_CONNECTION: auroraSecret("engine"),
        DB_DATABASE: auroraSecret("dbname"),
        DB_HOST: auroraSecret("host"),
        DB_PORT: auroraSecret("port"),
        DB_USERNAME: auroraSecret("username"),
        DB_PASSWORD: auroraSecret("password")
      }
    });

    const { cpuAlarm, memoryAlarm } = new FargateMonitoringAlarms(this, "FargateServiceAlarms", {
      service: loadBalancedFargateService.service,
      cpuAlarmProps: {
        evaluationPeriods: 1,
        threshold: 5,
      },
      memoryAlarmProps: {
        evaluationPeriods: 1,
        threshold: 5,
      }
    });


    auroraDatabase.cluster.connections.allowFrom(
      loadBalancedFargateService.service, 
      Port.tcp(auroraDatabase.cluster.clusterEndpoint.port),
    );

  }
}
