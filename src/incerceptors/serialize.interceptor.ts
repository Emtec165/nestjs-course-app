import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { plainToInstance } from "class-transformer";

interface ClassConstructor {
  new (...args: any[]): unknown
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: any) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //Run something before a request is handled by the request handler
    // console.log('Im running before the handler ', context);

    return next.handle().pipe(
      map((data: any) => {
        //Run something before the response is sent out

        // console.log('Im running before response is sent out ', data)
        return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
      })
    );
  }
}