import { Construct } from "@aws-cdk/core";

import {
    InstanceClass,
    InstanceSize,
    InstanceType,
    SubnetType,
    IVpc
  } from "@aws-cdk/aws-ec2";
  
import {
  DatabaseCluster,
  DatabaseClusterEngine,
  SubnetGroup
} from "@aws-cdk/aws-rds";


export interface AuroraDatabaseProps {
  vpc: IVpc,
  instances?: number,
}

export default class AuroraDatabase extends Construct {
  public readonly cluster: DatabaseCluster;
  constructor(scope: Construct, id: string, props: AuroraDatabaseProps) {
    super(scope, id);

    const { 
      vpc, 
      instances,

    } = props;

    const subnetGroup = new SubnetGroup(this, "SubnetGroup", {
      vpc,
      description: "Subnet Group for ThreeTierWebApp",
      vpcSubnets: vpc.selectSubnets({
        onePerAz: true,
        subnetType: SubnetType.PRIVATE
      })
    });


    this.cluster = new DatabaseCluster(this, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      defaultDatabaseName: "app",
      instances: instances ?? 2,
      instanceProps: {
        instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL),
        vpc,
      },
      subnetGroup,
    });

  }
}
