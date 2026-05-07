// все селекторы собраны в один модуль, чтобы не было дублирования в компонентах при использовании useSelector
//  + кэширование, т.к. useSelector будет всегда получать одну и ту же ссылку на функцию

import {
  all,
  allLength,
  completed,
  completedLength,
  uncompleted,
  uncompletedLength,
  important,
  importantLength,
  findById,
  ids,
} from 'redux/todoSelectors';
import { auth } from 'redux/userSelectors';

export const selectors = {
  todo: {
    all: all,
    allLength: allLength,
    completed: completed,
    completedLength: completedLength,
    uncompleted: uncompleted,
    uncompletedLength: uncompletedLength,
    important: important,
    importantLength: importantLength,
    findById: findById,
    ids: ids,
  },
  user: {
    auth: auth,
  },
};
