const { User, Modul, RoleAccess } = require('../db/models');

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
        const roleAccess = await RoleAccess.findOne({ where: { user_id: roleDB.id, module_id: modul.id } });
        if (!roleAccess) return res.status(401).json({ status: false, message: 'you\'re not authorized!', data: null });

        console.log('rbac read :', readAccess);
        console.log('user read :', roleAccess.read);
        
        console.log('rbac write :', writeAccess);
        console.log('user write :', roleAccess.write);

        if (readAccess && !roleAccess.read) {
            return res.status(401).json({ status: false, message: 'you\'re not authorized!', data: null });
        }

        if (writeAccess && !roleAccess.write) {
            return res.status(401).json({ status: false, message: 'you\'re not authorized!', data: null });
        }

        next();
    };

};