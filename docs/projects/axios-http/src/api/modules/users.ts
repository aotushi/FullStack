/**
 * 业务模块示例。它存在的目的是演示「调用方该怎么用这套封装」，尤其是下面 createUser
 * 里那个 409 的处理——那是本封装最想表达的一种用法。
 *
 * 要点：传输层的错误分类（HttpError + status）不适合直接交给页面。页面关心的是
 * 「这个用户名被占了」，不是「HTTP 409」。所以业务模块把它翻译成领域错误，页面
 * 只 catch UserAlreadyExistsError，完全不需要知道 HTTP 是什么。
 */

import { http } from "../http";
import { HttpError } from "../http/errors";

export interface CreateUserInput {
  name: string;
}

export interface User {
  id: string;
  name: string;
}

export class UserAlreadyExistsError extends Error {
  constructor(cause: HttpError) {
    super("User already exists", { cause });
    this.name = "UserAlreadyExistsError";
  }
}

export async function createUser(input: CreateUserInput): Promise<User> {
  try {
    // errorMode: "silent" 关掉全局 Toast，因为 409 要显示在表单的用户名字段旁边，
    // 而不是飘一个全局提示。注意它只关展示，不关上报——监控里照样看得到。
    return await http.post<User, CreateUserInput>("/users", input, {
      errorMode: "silent",
    });
  } catch (error) {
    // 只翻译自己认识的那一个状态码，其余原样抛出去。这一点很容易写错成 catch 住
    // 所有错误都当成「已存在」，那样网络断了也会提示用户换个名字。
    if (error instanceof HttpError && error.status === 409) {
      // 原错误挂在 cause 上，排查时还能顺着找回 HTTP 层的现场。
      throw new UserAlreadyExistsError(error);
    }

    throw error;
  }
}
