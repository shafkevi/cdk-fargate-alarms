import { Construct } from "@aws-cdk/core";

import {
  Alarm,
} from "@aws-cdk/aws-cloudwatch";

import {
  FargateService,
} from "@aws-cdk/aws-ecs";

export interface MonitoringAlarmsProps {
  service: FargateService,
  cpuAlarmProps: { evaluationPeriods: number, threshold: number},
  memoryAlarmProps: { evaluationPeriods: number, threshold: number},
}

export default class MonitoringAlarms extends Construct {
  public readonly cpuAlarm: Alarm;
  public readonly memoryAlarm: Alarm;

  constructor(scope: Construct, id: string, props: MonitoringAlarmsProps) {
    super(scope, id);

    const { 
      service,
      cpuAlarmProps,
      memoryAlarmProps,
    } = props;

    this.cpuAlarm = service
      .metricCpuUtilization()
      .createAlarm(
        this, 
        "cpuAlarm", 
        cpuAlarmProps
      );

    this.memoryAlarm = service
      .metricMemoryUtilization()
      .createAlarm(
        this, 
        "memoryAlarm", 
        memoryAlarmProps
      );



  }
}
