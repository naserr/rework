export default function ProjectAuthService(Auth, appConfig) {
  'ngInject';

  let user = Auth.getCurrentUserSync();

  return {
    getUserRole,
    hasAccess
  };

  function getUserRole(project) {
    return _.find(project.users, {_id: user._id}).role || 0;
  }

  function hasAccess(project, role) {
    return getUserRole(project) >= appConfig.roleNames[role.toLowerCase()];
  }
}
