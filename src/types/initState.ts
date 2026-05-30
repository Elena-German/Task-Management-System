import type { Todo } from 'types/todo'; //  import type - вы сообщаете компилятору, что импортируете сущность, которая нужна только для проверки типов.
//  Она гарантированно не содержит исполняемого JS-кода (классов или переменных).

export interface InitState {
    items: Todo[],
    loading: boolean,
    loadError: string | null,
    status: string | null,
    error: string | null,
}
