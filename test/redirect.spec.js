describe('satellizer.redirect',function(){
  var $redirect,
      $httpBackend,
      $q,
      noFeed,
      errorFeed,
      successFeed;
  
  beforeEach(
    module('satellizer')
  );
  
  beforeEach(inject(function($injector) {
    $redirect = $injector.get('satellizer.redirect');
    $httpBackend = $injector.get('$httpBackend');
    $q = $injector.get('$q');

    noFeed='';
    errorFeed = '<!DOCTYPE html><html><head><title>Error</title></head><body></body></html>';
    successFeed = '<!DOCTYPE html><html><head><title>Success</title></head><body></body></html>';

    $httpBackend.when('GET', 'https://federated-login.com&status=down').respond(0,'');
    $httpBackend.when('GET', 'https://federated-login.com&status=success').respond(200,successFeed);
    $httpBackend.when('GET', 'https://federated-login.com&status=error').respond(200,errorFeed);
    
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('performRedirect()',function(){

    it('should be defined',function() {
      expect($redirect.performRedirect).toBeDefined();
    });

    it('should resolve defer obj with http error',function() {
      var defer = $q.defer();
      spyOn(defer,'resolve');
      $httpBackend.expectGET('https://federated-login.com&status=error');
      $redirect.performRedirect('https://federated-login.com&status=error',defer);
      $httpBackend.flush();
      expect(defer.resolve).toHaveBeenCalledWith({ message : errorFeed });
    });

    it('should resolve defer obj with server down',function() {
      var defer = $q.defer();
      spyOn(defer,'resolve');
      $httpBackend.expectGET('https://federated-login.com&status=down');
      $redirect.performRedirect('https://federated-login.com&status=down',defer);
      $httpBackend.flush();
      expect(defer.resolve).toHaveBeenCalledWith({ message : '' });
    });
    
    // it('should redirect with successful call',function() {
    //   var defer = $q.defer();
    //   var page = new WebPage();
    //   spyOn(defer,'resolve');
    //   $httpBackend.expectGET('https://federated-login.com&status=success');
    //   $redirect.performRedirect('https://federated-login.com&status=success',defer);
    //   $httpBackend.flush();
    //   expect(defer.resolve).not.toHaveBeenCalled();
    // });
  });
});
