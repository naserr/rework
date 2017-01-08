export default function ProjectAuthService(Auth, appConfig) {
  'ngInject';

  return {
    getUserRole,
    hasAccess
  };

  function getUserRole(project) {
    let user = Auth.getCurrentUserSync();
    return _.find(project.users, {_id: user._id}).role || 0;
  }

  function hasAccess(project, role) {
    return getUserRole(project) >= appConfig.roleNames[role.toLowerCase()];
  }
}
