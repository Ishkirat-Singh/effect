import type * as Effect from "../../Effect.ts"
import * as Exit from "../../Exit.ts"
import * as Option from "../../Option.ts"
import { args } from "../core.ts"

/** @internal */
export const missing = Symbol()

/** @internal */
export { args }

/** @internal */
export type Success<A, E = never> = Exit.Success<A, E> & { readonly [args]: A }

/** @internal */
export const succeed = Exit.succeed as <A>(value: A) => Success<A>

/** The input/output is absent. This is distinct from a present `undefined`. @internal */
export const missingExit = succeed(missing)

/**
 * A successful parser result whose present input is returned unchanged.
 *
 * This is distinct from {@link missingExit}: the payload is never interpreted
 * as an absent value. Consumers must resolve it with {@link valueOrInput} or
 * {@link materialize} before crossing a generic Effect boundary.
 *
 * @internal
 */
export const unchangedExit = succeed(Symbol())

/** @internal */
export const valueOrInput = <E>(exit: Success<unknown, E>, input: unknown): unknown =>
  exit === unchangedExit ? input : exit[args]

/** @internal */
export const materialize = <E, R>(
  result: Effect.Effect<unknown, E, R>,
  input: unknown
): Effect.Effect<unknown, E, R> => result === unchangedExit ? succeed(input) : result

/** @internal */
export const toOption = <A>(value: A): Option.Option<A> => value === missing ? Option.none() : Option.some(value as A)

/** @internal */
export const fromOptionExit = <A>(option: Option.Option<A>): Success<A | typeof missing> =>
  option._tag === "None" ? missingExit : succeed(option.value)
