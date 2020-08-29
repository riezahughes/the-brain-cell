/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("servers", {
        id: 'id',
        guild_id: { type: 'integer', notNull: true },
        braincell_group_id: { type: 'integer', notNull: true },
        braincell_singular_id: { type: 'varchar(1000)', notNull: true },
        last_moved: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        createdAt: {
          type: 'timestamp',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
    })
    pgm.createIndex("servers", "id");
    pgm.createIndex("servers", "guild_id");
};

exports.down = pgm => {
    pgm.dropTable("servers");
};