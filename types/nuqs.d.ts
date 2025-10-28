declare module "nuqs" {
  import { ZodTypeAny } from "zod";
  import { Dispatch, SetStateAction } from "react";
  export function useQueryState<T>(
    key: string,
    schema: ZodTypeAny
  ): [T, Dispatch<SetStateAction<T>>];
}
