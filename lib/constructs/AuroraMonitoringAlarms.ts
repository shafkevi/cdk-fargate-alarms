import { Construct } from "@aws-cdk/core";

import {
  Alarm,
} from "@aws-cdk/aws-cloudwatch";

import {
  DatabaseCluster,
} from "@aws-cdk/aws-rds";

export interface MonitoringAlarmsProps {
  cluster: DatabaseCluster,
  cpuAlarmProps: { evaluationPeriods: number, threshold: number},
}

export default class MonitoringAlarms extends Construct {
  public readonly cpuAlarm: Alarm;
  public readonly memoryAlarm: Alarm;

  constructor(scope: Construct, id: string, props: MonitoringAlarmsProps) {
    super(scope, id);

    const { 
      cluster,
      cpuAlarmProps,
    } = props;

    this.cpuAlarm = cluster
      .metricCPUUtilization()
      .createAlarm(
        this, 
        "cpuAlarm", 
        cpuAlarmProps
      );

  }
}
