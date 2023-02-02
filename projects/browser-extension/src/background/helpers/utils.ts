import _ from "lodash";
import type { RxJsonSchema } from "rxdb";

function customizer(objValue, srcValue) {
  if (_.isArray(objValue) && _.isArray(srcValue)) {
    return _.uniq(objValue.concat(srcValue));
  }
}

export function mergeSchema(
  objValue: RxJsonSchema<any>,
  srcValue: RxJsonSchema<any>
): RxJsonSchema<any> {
  return _.mergeWith({}, objValue, srcValue, customizer);
}
