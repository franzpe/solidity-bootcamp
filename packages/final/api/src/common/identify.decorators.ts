// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { getSession } from 'next-auth/react';
//
// const Identify = createParamDecorator(async (_, ctx: ExecutionContext) => {
//   const req = ctx.switchToHttp().getRequest();
//   const session = await getSession({ req });
//
//   return session?.user ? (session.user as any).address : undefined;
// });
//
// export default Identify;
