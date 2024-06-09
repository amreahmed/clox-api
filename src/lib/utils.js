const {PermissionsBitField} = require('discord.js');
/**
 * @param {string | number | bigint} permissions
 * @params {import('discord.js').PermissionString} permission
 */

function hasPermission(permissions, permission) {
    const perms = new PermissionsBitField(permissions);
    return perms.has(permission);
}

module.exports = {
    hasPermission
};