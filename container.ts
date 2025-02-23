import { DependencyContainer } from 'tsyringe';
import { ClassConstructor, IocAdapter } from 'routing-controllers';

export class TsyringeAdapter implements IocAdapter {
    constructor(private readonly container: DependencyContainer) {}

    get<T>(someClass: ClassConstructor<T>): T {
        return this.container.resolve<T>(someClass);
    }
}
