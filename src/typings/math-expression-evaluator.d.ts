declare module 'math-expression-evaluator' {
  namespace mexp {
    export interface Token {
      type: number
      token: string
      value: any
      show: string
    }
  }

  class mexp {
    static eval (exp: string, tokens?: mexp.Token[], pair?: {[index: string]: number}): number
  }

  export = mexp
}