export class Helper{
  static mapper<T>(target: T, source: Object, customProp?: Map<string,string>): T{
    Object.getOwnPropertyNames(target).forEach(element => {
      if(customProp?.has(element)){
        if(target[element] instanceof Date){
          target[element] = new Date(source[customProp.get(element)]);
        }
        else{
          target[element] = source[customProp.get(element)];
        }
      }
      else{
        if(target[element] instanceof Date){
          target[element] = new Date(source[element]);
        }
        else{
          target[element] = source[element];
        }
      }
    });
    return target;
  }
}