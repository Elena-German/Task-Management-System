import { createSelector } from 'reselect'; // заменим селекторы на мемоизированные версии с использованием функции createSelector

// reselect может хранить в кэше только одно значение — и мы будем постоянно перезаписывать кэш в селекторе для поиска задачи по id
//Для решения этой проблемы установим пакет re-reselect
import { createCachedSelector } from 're-reselect';
import type { RootState } from 'redux/store'
/*

const inputSelectorOne = (state) => state.one;
const inputSelectorTwo = (state, id) => state.two[id];
const resultFunction = (one, two) => one + two;

Результаты выполнения первых двух функций-аргументов (входные селекторы) подаются на вход третьей
функции-аргумента. Если результаты выполнения входных селекторов будут такими же, как в прошлый
раз — то третья функция (результирующая) не вызывается, а результат возвращается из кэша. Входных
селекторов может быть один,два,три — тогда результирующая ф-ция принимает один,два,три аргумента.

const awesomeSelector = createSelector(inputSelectorOne, inputSelectorTwo, resultFunction);

Как reselect понимает, когда отдавать данные из кеша:

Если параметры входных селекторов inputSelectorOne и inputSelectorTwo не изменились (по shallowEqual) — возвратить данные из кэша.
В нашем примере, если state и id не изменились, то reselect вернет предыдущий результат resultFunction.

Если не изменились результаты выполнения inputSelectorOne и inputSelectorTwo (по shallowEqual) — возвратить данные из кэша.
В нашем примере, если state всё-таки изменился, то reselect вызовет inputSelectorOne и inputSelectorTwo.
Если они вернут неизмененные данные, то reselect вернет предыдущий результат resultFunction.

*/

export const all = (state:RootState) => state.todos; // массив всех задач

export const allLength = createSelector(
  // количество всех задач
  all,
  (items) => items.length
);

export const completed = createSelector(
  // массив завершенных задач
  all,
  (items) => items.filter((item) => item.isCompleted)
);

export const completedLength = createSelector(
  // количество завершенных задач
  completed,
  (items) => items.length
);

export const uncompleted = createSelector(
  // массив не завершенных задач
  all,
  (items) => items.filter((item) => !item.isCompleted)
);

export const uncompletedLength = createSelector(
  // количество не завершенных задач
  uncompleted,
  (items) => items.length
);

export const important = createSelector(
  // массив важных задач
  all,
  (items) => items.filter((item) => item.isImportant)
);

export const importantLength = createSelector(
  // количество важных задач
  important,
  (items) => items.length
);

export const findById = createCachedSelector(
  //для кэширования множества значений
  // createCachedSelector позволяет создавать уникальные кэшированные экземпляры для каждого уникального ключа

  all, // 1. Входные селекторы (как в обычном Reselect)
  (state: RootState, id: number) => id, // 1. Входные селекторы (как в обычном Reselect)
  (items, id) => items.find((item) => item.id === id) // 2. Результат (combiner)
)(
  (state, id) => id // 3. KeySelector: возвращает ключ для кэширования (например, userId)
);

export const ids = createSelector(all, (items) => items.map((item) => item.id));
