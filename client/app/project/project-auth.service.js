export default function ProjectAuthService(Auth, appConfig) {
  'ngInject';

  return {
    getUserRole,
    hasAccess
  };

  function getUserRole(project) {
    let user = Auth.getCurrentUserSync();
    if(_.isArray(project)) {
      project = project[0];
    }
    let tempUser = _.find(project.users, {_id: user._id});
    console.log('user > ', tempUser, tempUser.role);
    return tempUser.role || 0;
  }

  function hasAccess(project, role) {
    return getUserRole(project) >= appConfig.roleNames[role.toLowerCase()];
  }
}
