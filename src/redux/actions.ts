import {
  create as todoCreate,
  toggle as todoToggle,
  remove as todoRemove,
  update as todoUpdate,
} from 'redux/todoSlice';
import { login as userLogin, logout as userLogout } from 'redux/userSlice';

export const actions = {
  todo: {
    create: todoCreate, // содержит функцию, которая возвращает объект действия (тип type и данные payload)
    toggle: todoToggle,
    remove: todoRemove,
    update: todoUpdate,
  },
  user: {
    login: userLogin,
    logout: userLogout,
  },
};
