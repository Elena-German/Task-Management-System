import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { FilterType } from "app/Filter/Filter.types";
import { Todo } from "types/todo";

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
}

interface AxiosBaseQueryError {
  status?: number;
  data: unknown;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/",
});

const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await axiosInstance({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

// для эндпоинта getUser
interface UserResponse {
  auth: boolean;
}

export const todoApi = createApi({
  reducerPath: "todo",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["todo", "user"],
  endpoints: (builder) => ({
    getUser: builder.query<UserResponse[], void>({
      query: () => ({ url: "user" }),
      providesTags: ["user"],
    }),

    toggleAuth: builder.mutation<UserResponse[], void>({
      query: () => ({
        url: "user",
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApi.util.updateQueryData("getUser", undefined, (draft) => {
            if (draft && draft[0]) {
              draft[0].auth = !draft[0].auth;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    getAllTodo: builder.query<
      {
        items: Todo[];
        hasMore: boolean;
        totalCount: number;
        counters: {
          total: number;
          completed: number;
          uncompleted: number;
          important: number;
        };
      },
      { page: number; filter: FilterType }
    >({
      query: ({ page = 1, filter = "all" }) => ({
        url: "/todos",
        method: "GET",
        params: { page, filter },
      }),
      providesTags: (result, error, arg) => [
        { type: "todo", id: `list-${arg.filter}-${arg.page}` },
        { type: "todo", id: "PARTIAL_LIST" },
      ],
    }),

    getOneTodo: builder.query<Todo, number>({
      query: (id) => ({ url: `/todos/${id}` }),
      providesTags: (res, err, id) => [{ type: "todo", id }],
    }),

    createTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (data) => ({
        url: "/todos",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "todo", id: "PARTIAL_LIST" }],
    }),

    updateTodo: builder.mutation<
      Todo,
      Partial<Todo> & { page?: number; filter?: FilterType }
    >({
      query: (data) => {
        const body = { ...data };
        delete body.page;
        delete body.filter;
        return {
          url: `/todos/${data.id}`,
          method: "PATCH",
          data: body,
        };
      },
      invalidatesTags: (result, error, arg) => {
        const page = arg.page ?? 1;
        const filter = arg.filter ?? "all";
        return [
          { type: "todo", id: `list-${filter}-${page}` },
          { type: "todo", id: "PARTIAL_LIST" },
        ];
      },
      async onQueryStarted(
        { id, page = 1, filter = "all", ...rest },
        { dispatch, queryFulfilled }
      ) {
        const patchListResult = dispatch(
          todoApi.util.updateQueryData(
            "getAllTodo",
            { page, filter },
            (draft) => {
              const todoInList = draft?.items?.find((todo) => todo.id === id);
              if (todoInList) {
                Object.assign(todoInList, rest);
              }
            }
          )
        );
        const patchSingleResult = dispatch(
          todoApi.util.updateQueryData("getOneTodo", id as number, (draft) => {
            if (draft) {
              Object.assign(draft, rest);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchListResult.undo();
          patchSingleResult.undo();
        }
      },
    }),

    removeTodo: builder.mutation<
      void,
      { id: number; page: number; filter: FilterType }
    >({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "todo", id: `list-${arg.filter}-${arg.page}` },
        { type: "todo", id: "PARTIAL_LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllTodoQuery,
  useGetOneTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useRemoveTodoMutation,
  useGetUserQuery,
  useToggleAuthMutation,
} = todoApi;
