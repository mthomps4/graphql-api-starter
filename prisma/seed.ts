import { roleSeedDate, seedRoles } from './seeds/roles';
import { userSeedData, seedUsers } from './seeds/users';

const seed = async () => {
  console.log('seeding Roles...');
  await seedRoles(roleSeedDate);
  console.log('seeding Users...');
  await seedUsers(userSeedData);
};

seed()
  .catch((e) => console.error(e))
  .finally(() => console.log('Seeding Complete'));
