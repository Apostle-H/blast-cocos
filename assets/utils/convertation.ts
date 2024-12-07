import { UITransform, Vec3 } from "cc";


export function convertLocalToOtherLocal(fromLocalPosition: Vec3, fromLocal: UITransform, toLocal: UITransform): Vec3 {
    const toWorldPos = fromLocal.convertToWorldSpaceAR(fromLocalPosition);
    return toLocal.convertToNodeSpaceAR(toWorldPos);
}