# Unit of Work (UoW) Architecture

## Motivation
Complex workflows touch multiple repositories. Passing around raw database clients causes coupling. The UnitOfWork abstracts the transaction and coordinates repository instances.

## Usage Pattern
```ts
const uow = new UnitOfWork(tenantId);
try {
  await uow.begin();
  
  const userRepo = uow.getRepository(UserRepository);
  const roleRepo = uow.getRepository(RoleRepository);
  
  // These operations share the exact same Transaction Client
  await userRepo.insert(newUser);
  await roleRepo.insert(roleAssignment);
  
  await uow.commit();
} catch (e) {
  await uow.rollback();
} finally {
  await uow.dispose();
}
```
