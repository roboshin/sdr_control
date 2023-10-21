/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { Point3D_Ts } from "./point3d_-ts";

export class RobotInformation {
    nowMeasurePoint: Point3D_Ts = {"x":0.0,"y":0.0,"z":0.0};
    nowMeasureDXFPoint: Point3D_Ts = {"x":0.0,"y":0.0,"z":0.0};
    inkOnStatus: boolean;
    nonKuiNavyData: boolean;
    dxfLoaded: boolean;
    obstacleDetected: boolean;
    errorX: number;
    errorY: number;
    imuRz: number;
    imuRy: number;
    imuRx: number;
    beforMove: boolean;
    drawing: boolean;
    drawLayerName: string = "";
    viewLayerName: string = "";
    orgError: number;
}
