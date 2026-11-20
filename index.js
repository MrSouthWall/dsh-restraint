/**
 * Host half of the dsh-zhiming bundle.
 *
 * A Host plugin exports `apply(ctx, config)`. Register every resource inside
 * `apply` with `ctx.effect` or `ctx.on` and return its cleanup, for example:
 *
 *   export function apply(ctx, config) {
 *     return ctx.effect(() => {
 *       // register something; return a disposer
 *     })
 *   }
 *
 * `export const inject = ['tools']` declares required services, and
 * `export const Config` validates the row's `config`.
 */
export function apply() {}
