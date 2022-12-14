const { User, Modul, RoleAcces } = require('../db/models');

module.exports = (modulName, readAccess = false, writeAccess = false) => {
    return async (req, res, next) => {
        const { role } = req.user;
        if (!role) return res.status(401).json({ status: false, message: 'you\'re not authorized!', data: null });

        // get role data
        const roleDB = await User.findOne({ where: { role: role } });
        if (!roleDB) return res.status(401).json({ status: false, message: 'you\'re not authorized!', data: null });

        // get role modul
        const modul = await Modul.findOne({ where: { name: modulName } });
        if (!modul) return res.status(401).json({ status: false, message: 'you\'re not authorized!', data: null });

        // get role access data
        const roleAcces = await RoleAcces.findOne({ where: { user_id: roleDB.id, module_id: modul.id } });
        if (!roleAcces) return res.status(401).json({ status: false, message: 'you\'re not authorized!', data: null });

        console.log('rbac read :', readAccess);
        console.log('user read :', roleAcces.read);
        
        console.log('rbac write :', writeAccess);
        console.log('user write :', roleAcces.write);

        if (readAccess && !roleAcces.read) {
            return res.status(401).json({ status: false, message: 'you\'re not Admin!', data: null });
        }

        if (writeAccess && !roleAcces.write) {
            return res.status(401).json({ status: false, message: 'you\'re not authorized!', data: null });
        }

        next();
    };

};