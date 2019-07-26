
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'jarred', password: '$2a$14$vtVOEjzzosiN7mR1uEVjoO1Gr9DteqZ2a2r7O.8jIIYHxI3RuXC.G' }
      ]);
    });
};
