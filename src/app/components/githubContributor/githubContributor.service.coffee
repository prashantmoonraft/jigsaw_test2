angular.module 'jigsawTest3'
  .factory 'githubContributor', ($log, $http) ->
    'ngInject'
    apiHost = 'https://bitbucket.org/api/1.0/repositories/moonrafters/generator-moonraft-boilerplate'

    getContributors = (limit=30) ->

      getContributorsComplete = (response) ->
        response.data

      getContributorsFailed = (error) ->
        $log.error 'XHR Failed for getContributors.\n' + angular.toJson(error.data, true)
        return

      $http.get(apiHost + '/contributors?per_page=' + limit).then(getContributorsComplete).catch getContributorsFailed

    service =
      apiHost: apiHost
      getContributors: getContributors
